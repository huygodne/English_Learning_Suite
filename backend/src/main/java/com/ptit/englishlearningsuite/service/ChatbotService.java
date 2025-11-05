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
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private AccountService accountService;

    // THAY ĐỔI: Đọc config của Gemini
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    // Lời nhắc hệ thống (giữ nguyên)
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

        // THAY ĐỔI: Gọi hàm callGeminiApi
        String botReply = callGeminiApi(userMessage);

        saveMessage(currentUser, botReply, SenderRole.BOT);

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

    // --- CÁC HÀM HỖ TRỢ (PRIVATE) ---

    // THAY ĐỔI: Hàm gọi API của Google Gemini
    private String callGeminiApi(String userMessage) {
        // Gemini dùng API Key trong URL
        String fullApiUrl = apiUrl + "?key=" + apiKey;
        String combinedPrompt = SYSTEM_PROMPT + "\n\nNgười dùng: " + userMessage + "\nELS-Bot:";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Cấu trúc Request Body của Gemini
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

            // Parse JSON response của Gemini
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
        } catch (Exception e) {
            e.printStackTrace();
            // Lỗi 404 (nếu Bước 0 thất bại) sẽ bị bắt ở đây
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