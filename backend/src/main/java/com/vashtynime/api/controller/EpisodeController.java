package com.vashtynime.api.controller;

import com.vashtynime.api.dto.EpisodeDTO;
import com.vashtynime.api.entity.Episode;
import com.vashtynime.api.service.EpisodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/episode")
public class EpisodeController {

    @Autowired
    private EpisodeService episodeService;

    private String getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return (String) auth.getPrincipal();
        }
        return null;
    }

    @GetMapping("/anime/{animeId}")
    public ResponseEntity<List<EpisodeDTO>> getEpisodesByAnime(@PathVariable UUID animeId) {
        String userId = getAuthenticatedUserId();
        List<EpisodeDTO> episodes = episodeService.getEpisodesByAnime(animeId, userId);
        return ResponseEntity.ok(episodes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EpisodeDTO> getEpisodeById(@PathVariable UUID id) {
        String userId = getAuthenticatedUserId();
        EpisodeDTO episode = episodeService.getEpisodeById(id, userId);
        return ResponseEntity.ok(episode);
    }

    // Admin endpoint
    @PostMapping("/{animeId}")
    public ResponseEntity<Episode> createEpisode(@PathVariable UUID animeId, @RequestBody Episode episode) {
        Episode saved = episodeService.saveEpisode(animeId, episode);
        return ResponseEntity.ok(saved);
    }
}
