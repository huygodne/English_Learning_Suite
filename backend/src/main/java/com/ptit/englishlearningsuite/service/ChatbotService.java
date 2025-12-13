package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.ChatMessageDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.ChatMessage;
import com.ptit.englishlearningsuite.entity.SenderRole;
import com.ptit.englishlearningsuite.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private AccountService accountService;

    @Autowired
    private Executor taskExecutor;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final String SYSTEM_PROMPT = """
            Bạn là 'ELS-Bot', một trợ lý AI thân thiện và chuyên nghiệp của website 'English Learning Suite'. 
            Nhiệm vụ chính của bạn là:
            1. Giúp người dùng học tiếng Anh: Trả lời các câu hỏi về ngữ pháp, cung cấp từ vựng, giúp luyện dịch, và đưa ra các bài tập thực hành.
            2. Hỗ trợ người dùng: Trả lời các câu hỏi về cách sử dụng website 'English Learning Suite'.
            Quy tắc ứng xử:
            - Khi người dùng hỏi bạn là ai, hãy tự giới thiệu mình là 'ELS-Bot'.
            - Không được nói rằng bạn là một mô hình AI chung chung.
            - Luôn giữ thái độ khuyến khích và tập trung vào việc học.
            """;

    @Transactional
    public String getReplyAndSave(String userMessage, String username) {

        Account currentUser = accountService.findByUsername(username);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + username);
        }

        saveMessage(currentUser, userMessage, SenderRole.USER);

        String botReply = callGeminiApi(userMessage);

        CompletableFuture.runAsync(() -> {
            try {
                transactionTemplate.execute(status -> {
                    saveMessage(currentUser, botReply, SenderRole.BOT);
                    return null;
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, taskExecutor);

        return botReply;
    }

    public List<ChatMessageDTO> getChatHistory(String username) {
        Account currentUser = accountService.findByUsername(username);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + username);
        }

        List<ChatMessage> messages = chatMessageRepository.findByAccountIdOrderByTimestampAsc(currentUser.getId());

        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private String callGeminiApi(String userMessage) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("YOUR_API_KEY_HERE")) {
            return "Lỗi: API key chưa được cấu hình. Vui lòng cập nhật API key trong file application.properties. " +
                   "Tạo API key tại: https://aistudio.google.com/app/apikey";
        }
        String fullApiUrl = apiUrl + "?key=" + apiKey;
        String combinedPrompt = SYSTEM_PROMPT + "\n\nNgười dùng: " + userMessage + "\nELS-Bot:";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", combinedPrompt);
        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(textPart));
        content.put("role", "user");
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(fullApiUrl, entity, Map.class);

            if (response != null && response.containsKey("error")) {
                Map<String, Object> error = (Map<String, Object>) response.get("error");
                String errorMessage = (String) error.get("message");
                String errorStatus = (String) error.get("status");
                
                if ("PERMISSION_DENIED".equals(errorStatus) && errorMessage != null && errorMessage.contains("leaked")) {
                    return "Lỗi: API key đã bị rò rỉ. Vui lòng tạo API key mới tại https://aistudio.google.com/app/apikey và cập nhật trong file application.properties";
                }
                
                return "Lỗi từ Gemini API: " + errorMessage;
            }

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> contentResponse = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentResponse.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "Lỗi: Không thể parse response từ AI.";
        } catch (HttpClientErrorException e) {
            int statusCode = e.getStatusCode().value();
            String responseBody = null;
            
            try {
                responseBody = e.getResponseBodyAsString();
            } catch (Exception ex) {
            }
            
            if (statusCode == 400) {
                if (responseBody != null) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        Map<String, Object> errorResponse = mapper.readValue(responseBody, Map.class);
                        
                        if (errorResponse.containsKey("error")) {
                            Map<String, Object> error = (Map<String, Object>) errorResponse.get("error");
                            String errorMessage = (String) error.get("message");
                            String errorStatus = (String) error.get("status");
                            
                            if (errorMessage != null && errorMessage.contains("API key not valid")) {
                                return "Lỗi: API key không hợp lệ. Vui lòng kiểm tra lại API key trong file application.properties. " +
                                       "Tạo API key mới tại: https://aistudio.google.com/app/apikey";
                            }
                            
                            if (errorMessage != null) {
                                return "Lỗi từ Gemini API (" + errorStatus + "): " + errorMessage + 
                                       ". Vui lòng kiểm tra lại API key trong file application.properties";
                            }
                        }
                    } catch (Exception ex) {
                        if (responseBody.contains("API key not valid")) {
                            return "Lỗi: API key không hợp lệ. Vui lòng kiểm tra lại API key trong file application.properties. " +
                                   "Tạo API key mới tại: https://aistudio.google.com/app/apikey";
                        }
                    }
                }
                return "Lỗi 400: Yêu cầu không hợp lệ. Vui lòng kiểm tra lại API key trong file application.properties";
            }
            
            if (statusCode == 403) {
                if (responseBody != null && responseBody.contains("leaked")) {
                    return "Lỗi: API key đã bị rò rỉ. Vui lòng tạo API key mới tại https://aistudio.google.com/app/apikey và cập nhật trong file application.properties";
                }
                return "Lỗi 403: API key không hợp lệ hoặc không có quyền truy cập. Vui lòng kiểm tra lại API key trong file application.properties";
            }
            
            if (statusCode == 401) {
                return "Lỗi 401: Xác thực thất bại. Vui lòng kiểm tra lại API key trong file application.properties";
            }
            
            if (statusCode == 429) {
                return "Lỗi: Đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau vài giây.";
            }
            
            e.printStackTrace();
            return "Xin lỗi, tôi đang gặp lỗi hệ thống (HTTP " + statusCode + "): " + 
                   (responseBody != null && responseBody.length() < 200 ? responseBody : e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return "Xin lỗi, tôi đang gặp lỗi hệ thống: " + e.getMessage();
        }
    }

    private void saveMessage(Account account, String message, SenderRole sender) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setAccount(account);
        chatMessage.setMessageContent(message);
        chatMessage.setSender(sender);
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(chatMessage);
    }


    private ChatMessageDTO convertToDto(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setMessageContent(message.getMessageContent());
        dto.setSender(message.getSender());
        dto.setTimestamp(message.getTimestamp());
        return dto;
    }
}