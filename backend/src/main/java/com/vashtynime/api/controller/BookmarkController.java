package com.vashtynime.api.controller;

import com.vashtynime.api.dto.AnimeDTO;
import com.vashtynime.api.dto.BookmarkRequest;
import com.vashtynime.api.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookmark")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    private String getRequiredUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<AnimeDTO>> getBookmarks() {
        String userId = getRequiredUserId();
        List<AnimeDTO> bookmarks = bookmarkService.getBookmarkedAnime(userId);
        return ResponseEntity.ok(bookmarks);
    }

    @PostMapping
    public ResponseEntity<String> addBookmark(@RequestBody BookmarkRequest request) {
        String userId = getRequiredUserId();
        bookmarkService.addBookmark(userId, request.getAnimeId());
        return ResponseEntity.ok("Bookmark added successfully");
    }

    @DeleteMapping("/{animeId}")
    public ResponseEntity<String> removeBookmark(@PathVariable UUID animeId) {
        String userId = getRequiredUserId();
        bookmarkService.removeBookmark(userId, animeId);
        return ResponseEntity.ok("Bookmark removed successfully");
    }
}
