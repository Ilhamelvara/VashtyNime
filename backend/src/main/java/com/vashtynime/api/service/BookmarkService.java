package com.vashtynime.api.service;

import com.vashtynime.api.dto.AnimeDTO;
import com.vashtynime.api.entity.Anime;
import com.vashtynime.api.entity.Bookmark;
import com.vashtynime.api.entity.User;
import com.vashtynime.api.repository.AnimeRepository;
import com.vashtynime.api.repository.BookmarkRepository;
import com.vashtynime.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private AnimeRepository animeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnimeService animeService;

    @Transactional
    public void addBookmark(String userId, UUID animeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Anime anime = animeRepository.findById(animeId)
                .orElseThrow(() -> new RuntimeException("Anime not found with id: " + animeId));

        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndAnimeId(userId, animeId);
        if (existing.isEmpty()) {
            Bookmark bookmark = new Bookmark(user, anime);
            bookmarkRepository.save(bookmark);
        }
    }

    @Transactional
    public void removeBookmark(String userId, UUID animeId) {
        bookmarkRepository.deleteByUserIdAndAnimeId(userId, animeId);
    }

    @Transactional(readOnly = true)
    public List<AnimeDTO> getBookmarkedAnime(String userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        return bookmarks.stream()
                .map(bookmark -> animeService.convertToDTO(bookmark.getAnime(), userId))
                .collect(Collectors.toList());
    }
}
