package com.vashtynime.api.service;

import com.vashtynime.api.dto.AnimeDTO;
import com.vashtynime.api.entity.Anime;
import com.vashtynime.api.repository.AnimeRepository;
import com.vashtynime.api.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnimeService {

    @Autowired
    private AnimeRepository animeRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private CacheService cacheService;

    @Transactional(readOnly = true)
    public List<AnimeDTO> getTrending(String userId) {
        // Try to fetch from Redis cache
        List<AnimeDTO> cached = cacheService.getTrendingCache();
        if (cached != null) {
            // Re-resolve bookmarks for the specific user in the cached response
            if (userId != null) {
                cached.forEach(dto -> {
                    dto.setBookmarked(bookmarkRepository.findByUserIdAndAnimeId(userId, dto.getId()).isPresent());
                });
            }
            return cached;
        }

        // DB Fallback
        List<Anime> trendingAnime = animeRepository.findTopTrendingAnime();
        List<AnimeDTO> dtos = trendingAnime.stream()
                .map(anime -> convertToDTO(anime, userId))
                .collect(Collectors.toList());

        // Cache the result in Redis (unpersonalized for guests)
        List<AnimeDTO> unpersonalizedList = trendingAnime.stream()
                .map(anime -> convertToDTO(anime, null))
                .collect(Collectors.toList());
        cacheService.putTrendingCache(unpersonalizedList);

        return dtos;
    }

    @Transactional(readOnly = true)
    public AnimeDTO getById(UUID id, String userId) {
        Anime anime = animeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anime not found with id: " + id));
        return convertToDTO(anime, userId);
    }

    @Transactional(readOnly = true)
    public List<AnimeDTO> search(String query, String userId) {
        // Try search cache
        List<AnimeDTO> cached = cacheService.getSearchCache(query);
        if (cached != null) {
            if (userId != null) {
                cached.forEach(dto -> {
                    dto.setBookmarked(bookmarkRepository.findByUserIdAndAnimeId(userId, dto.getId()).isPresent());
                });
            }
            return cached;
        }

        List<Anime> results = animeRepository.findByTitleContainingIgnoreCase(query);
        List<AnimeDTO> dtos = results.stream()
                .map(anime -> convertToDTO(anime, userId))
                .collect(Collectors.toList());

        // Cache search results for 10 minutes
        List<AnimeDTO> unpersonalizedList = results.stream()
                .map(anime -> convertToDTO(anime, null))
                .collect(Collectors.toList());
        cacheService.putSearchCache(query, unpersonalizedList);

        return dtos;
    }

    @Transactional
    public Anime save(Anime anime) {
        Anime saved = animeRepository.save(anime);
        // Evict trending cache since data has changed
        cacheService.evictTrendingCache();
        return saved;
    }

    @Transactional
    public void delete(UUID id) {
        animeRepository.deleteById(id);
        cacheService.evictTrendingCache();
    }

    public AnimeDTO convertToDTO(Anime anime, String userId) {
        boolean isBookmarked = false;
        if (userId != null) {
            isBookmarked = bookmarkRepository.findByUserIdAndAnimeId(userId, anime.getId()).isPresent();
        }
        return new AnimeDTO(
                anime.getId(),
                anime.getTitle(),
                anime.getDescription(),
                anime.getCoverUrl(),
                anime.getBannerUrl(),
                anime.getGenre(),
                anime.getRating(),
                anime.getStatus(),
                isBookmarked,
                anime.getPremium(),
                anime.getReleaseDay()
        );
    }
}
