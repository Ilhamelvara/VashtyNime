package com.vashtynime.api.service;

import com.vashtynime.api.dto.EpisodeDTO;
import com.vashtynime.api.dto.HistoryRequest;
import com.vashtynime.api.entity.Anime;
import com.vashtynime.api.entity.Episode;
import com.vashtynime.api.entity.History;
import com.vashtynime.api.entity.User;
import com.vashtynime.api.entity.EpisodeUnlock;
import com.vashtynime.api.repository.AnimeRepository;
import com.vashtynime.api.repository.EpisodeRepository;
import com.vashtynime.api.repository.HistoryRepository;
import com.vashtynime.api.repository.UserRepository;
import com.vashtynime.api.repository.EpisodeUnlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EpisodeService {

    @Autowired
    private EpisodeRepository episodeRepository;

    @Autowired
    private AnimeRepository animeRepository;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EpisodeUnlockRepository episodeUnlockRepository;

    @Transactional(readOnly = true)
    public List<EpisodeDTO> getEpisodesByAnime(UUID animeId, String userId) {
        List<Episode> episodes = episodeRepository.findByAnimeIdOrderByEpisodeNumberAsc(animeId);
        return episodes.stream()
                .map(episode -> convertToDTO(episode, userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EpisodeDTO getEpisodeById(UUID id, String userId) {
        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Episode not found with id: " + id));
        return convertToDTO(episode, userId);
    }

    @Transactional
    public Episode saveEpisode(UUID animeId, Episode episode) {
        Anime anime = animeRepository.findById(animeId)
                .orElseThrow(() -> new RuntimeException("Anime not found with id: " + animeId));
        episode.setAnime(anime);
        return episodeRepository.save(episode);
    }

    @Transactional
    public void updateProgress(String userId, HistoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Episode episode = episodeRepository.findById(request.getEpisodeId())
                .orElseThrow(() -> new RuntimeException("Episode not found with id: " + request.getEpisodeId()));

        Optional<History> existingHistory = historyRepository.findByUserIdAndEpisodeId(userId, request.getEpisodeId());

        History history;
        boolean justFinished = false;
        if (existingHistory.isPresent()) {
            history = existingHistory.get();
            int oldProgress = history.getProgress();
            int newProgress = request.getProgress();
            history.setProgress(newProgress);
            
            int ninetyPercent = (int) (episode.getDuration() * 0.9);
            if (oldProgress < ninetyPercent && newProgress >= ninetyPercent) {
                justFinished = true;
            }
        } else {
            history = new History(user, episode, request.getProgress());
            int ninetyPercent = (int) (episode.getDuration() * 0.9);
            if (request.getProgress() >= ninetyPercent) {
                justFinished = true;
            }
        }
        historyRepository.save(history);

        if (justFinished) {
            addXpToUser(user, 20);
        }
    }

    @Transactional(readOnly = true)
    public List<com.vashtynime.api.dto.HistoryDTO> getUserWatchHistory(String userId) {
        List<History> historyList = historyRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        return historyList.stream()
                .map(history -> new com.vashtynime.api.dto.HistoryDTO(
                        history.getId(),
                        history.getEpisode().getId(),
                        history.getEpisode().getEpisodeNumber(),
                        history.getEpisode().getVideoUrl(),
                        history.getEpisode().getThumbnail(),
                        history.getEpisode().getAnime().getId(),
                        history.getEpisode().getAnime().getTitle(),
                        history.getEpisode().getAnime().getPremium(),
                        history.getProgress(),
                        history.getEpisode().getDuration(),
                        history.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public User unlockEpisode(String userId, UUID episodeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Pengguna tidak ditemukan"));
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new RuntimeException("Episode tidak ditemukan"));

        if (Boolean.TRUE.equals(user.getPremium())) {
            return user;
        }

        if (episodeUnlockRepository.existsByUserIdAndEpisodeId(userId, episodeId)) {
            return user;
        }

        user.regenerateKeysIfNeeded();

        if (user.getKeysCount() == null || user.getKeysCount() <= 0) {
            throw new RuntimeException("Kunci Anda habis! Silakan tunggu 1 menit untuk mendapatkan 2 kunci gratis.");
        }

        int oldKeys = user.getKeysCount();
        user.setKeysCount(oldKeys - 1);

        if (oldKeys >= 10) {
            user.setLastKeyRegenTime(LocalDateTime.now());
        }

        EpisodeUnlock unlock = new EpisodeUnlock(user, episode);
        episodeUnlockRepository.save(unlock);

        addXpToUser(user, 10);

        return userRepository.save(user);
    }

    private void addXpToUser(User user, int amount) {
        if (user.getXp() == null) user.setXp(0);
        if (user.getLevel() == null) user.setLevel(1);

        int newXp = user.getXp() + amount;
        int level = user.getLevel();

        while (newXp >= 100) {
            newXp -= 100;
            level++;
        }

        user.setXp(newXp);
        user.setLevel(level);
        userRepository.save(user);
    }

    private EpisodeDTO convertToDTO(Episode episode, String userId) {
        Integer watchProgress = 0;
        Boolean isUnlocked = false;
        if (userId != null) {
            Optional<History> history = historyRepository.findByUserIdAndEpisodeId(userId, episode.getId());
            if (history.isPresent()) {
                watchProgress = history.get().getProgress();
            }
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (Boolean.TRUE.equals(user.getPremium())) {
                    isUnlocked = true;
                } else {
                    isUnlocked = episodeUnlockRepository.existsByUserIdAndEpisodeId(userId, episode.getId());
                }
            }
        }
        return new EpisodeDTO(
                episode.getId(),
                episode.getAnime().getId(),
                episode.getEpisodeNumber(),
                episode.getVideoUrl(),
                episode.getDuration(),
                episode.getThumbnail(),
                watchProgress,
                isUnlocked
        );
    }
}
