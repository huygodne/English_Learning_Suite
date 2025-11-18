package com.ptit.englishlearningsuite.dto;
import com.ptit.englishlearningsuite.entity.SenderRole;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long id;
    private String messageContent;
    private SenderRole sender; // "USER" hoặc "BOT"
    private LocalDateTime timestamp;
}