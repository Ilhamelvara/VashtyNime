package com.vashtynime.api.controller;

import com.vashtynime.api.entity.ChatMessage;
import com.vashtynime.api.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        // Simpan ke database sebelum di-broadcast
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        return savedMessage;
    }

    @GetMapping("/api/chat/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory() {
        List<ChatMessage> history = chatMessageRepository.findTop50ByOrderByCreatedAtDesc();
        // Membalik urutan agar pesan terlama di atas, terbaru di bawah jika diperlukan
        // Atau biarkan terbalik untuk FlatList inverted={true}
        return ResponseEntity.ok(history);
    }
}
