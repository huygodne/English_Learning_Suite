package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Tự động tạo câu query:
     * SELECT * FROM chat_message WHERE account_id = ? ORDER BY timestamp ASC
     */
    List<ChatMessage> findByAccountIdOrderByTimestampAsc(Long accountId);
}