package com.vashtynime.api.controller;

import com.vashtynime.api.dto.AnimeDTO;
import com.vashtynime.api.entity.Anime;
import com.vashtynime.api.service.AnimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/anime")
public class AnimeController {

    @Autowired
    private AnimeService animeService;

    // Helper to get authenticated user ID if present (returns null for guests)
    private String getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return (String) auth.getPrincipal();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<AnimeDTO>> getAllAnime() {
        String userId = getAuthenticatedUserId();
        // Return standard list, sorted or cached
        List<AnimeDTO> animeList = animeService.search("", userId);
        return ResponseEntity.ok(animeList);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<AnimeDTO>> getTrending() {
        String userId = getAuthenticatedUserId();
        List<AnimeDTO> trending = animeService.getTrending(userId);
        return ResponseEntity.ok(trending);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimeDTO> getAnimeById(@PathVariable UUID id) {
        String userId = getAuthenticatedUserId();
        AnimeDTO anime = animeService.getById(id, userId);
        return ResponseEntity.ok(anime);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AnimeDTO>> searchAnime(@RequestParam("q") String query) {
        String userId = getAuthenticatedUserId();
        List<AnimeDTO> results = animeService.search(query, userId);
        return ResponseEntity.ok(results);
    }

    // Admin endpoints
    @PostMapping
    public ResponseEntity<Anime> createAnime(@RequestBody Anime anime) {
        Anime saved = animeService.save(anime);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnime(@PathVariable UUID id) {
        animeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
