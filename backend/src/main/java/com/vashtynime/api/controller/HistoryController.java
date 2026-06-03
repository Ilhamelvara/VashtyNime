package com.vashtynime.api.controller;

import com.vashtynime.api.dto.HistoryRequest;
import com.vashtynime.api.service.EpisodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private EpisodeService episodeService;

    private String getRequiredUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<com.vashtynime.api.dto.HistoryDTO>> getHistory() {
        String userId = getRequiredUserId();
        List<com.vashtynime.api.dto.HistoryDTO> historyList = episodeService.getUserWatchHistory(userId);
        return ResponseEntity.ok(historyList);
    }

    @PostMapping
    public ResponseEntity<String> updateProgress(@RequestBody HistoryRequest request) {
        String userId = getRequiredUserId();
        episodeService.updateProgress(userId, request);
        return ResponseEntity.ok("Watch progress updated");
    }
}
