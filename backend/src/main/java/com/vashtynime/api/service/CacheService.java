package com.vashtynime.api.service;

import com.vashtynime.api.dto.AnimeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class CacheService {

    private static final Logger LOGGER = Logger.getLogger(CacheService.class.getName());

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    private static final String TRENDING_KEY = "anime:trending";
    private static final String SEARCH_PREFIX = "anime:search:";

    @SuppressWarnings("unchecked")
    public List<AnimeDTO> getTrendingCache() {
        if (redisTemplate == null) return null;
        try {
            return (List<AnimeDTO>) redisTemplate.opsForValue().get(TRENDING_KEY);
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to read trending cache from Redis, falling back to database", e);
            return null;
        }
    }

    public void putTrendingCache(List<AnimeDTO> trendingList) {
        if (redisTemplate == null) return;
        try {
            redisTemplate.opsForValue().set(TRENDING_KEY, trendingList, 1, TimeUnit.HOURS);
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to write trending cache to Redis", e);
        }
    }

    public void evictTrendingCache() {
        if (redisTemplate == null) return;
        try {
            redisTemplate.delete(TRENDING_KEY);
            LOGGER.info("Evicted trending cache from Redis");
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to evict trending cache from Redis", e);
        }
    }

    @SuppressWarnings("unchecked")
    public List<AnimeDTO> getSearchCache(String query) {
        if (redisTemplate == null) return null;
        try {
            return (List<AnimeDTO>) redisTemplate.opsForValue().get(SEARCH_PREFIX + query.toLowerCase());
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to read search cache from Redis", e);
            return null;
        }
    }

    public void putSearchCache(String query, List<AnimeDTO> results) {
        if (redisTemplate == null) return;
        try {
            redisTemplate.opsForValue().set(SEARCH_PREFIX + query.toLowerCase(), results, 10, TimeUnit.MINUTES);
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to write search cache to Redis", e);
        }
    }
}
