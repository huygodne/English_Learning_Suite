package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.ChatMessageDTO;
import com.ptit.englishlearningsuite.dto.ChatRequestDTO;
import com.ptit.englishlearningsuite.dto.ChatResponseDTO;
import com.ptit.englishlearningsuite.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    /**
     * Endpoint để GỬI tin nhắn mới
     * (POST /api/chatbot/send)
     */
    @PostMapping("/send")
    public ResponseEntity<ChatResponseDTO> sendMessage(@RequestBody ChatRequestDTO request) {
        try {
            // Tự động lấy username của người dùng đã đăng nhập (nhờ JWT)
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            String reply = chatbotService.getReplyAndSave(request.getUserMessage(), username);

            ChatResponseDTO response = new ChatResponseDTO();
            response.setBotReply(reply);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ChatResponseDTO errorResponse = new ChatResponseDTO();
            errorResponse.setBotReply("Sorry, I'm having trouble thinking right now: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Endpoint để LẤY LỊCH SỬ chat
     * (GET /api/chatbot/history)
     */
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory() {
        try {
            // Tự động lấy username của người dùng đã đăng nhập
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            List<ChatMessageDTO> history = chatbotService.getChatHistory(username);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            // Trả về lỗi server nếu có vấn đề
            return ResponseEntity.status(500).build();
        }
    }
}