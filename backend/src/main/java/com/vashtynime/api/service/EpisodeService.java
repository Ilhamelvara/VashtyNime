package com.vashtynime.api.service;

import com.vashtynime.api.dto.EpisodeDTO;
import com.vashtynime.api.dto.HistoryRequest;
import com.vashtynime.api.entity.Anime;
import com.vashtynime.api.entity.Episode;
import com.vashtynime.api.entity.History;
import com.vashtynime.api.entity.User;
import com.vashtynime.api.repository.AnimeRepository;
import com.vashtynime.api.repository.EpisodeRepository;
import com.vashtynime.api.repository.HistoryRepository;
import com.vashtynime.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        if (existingHistory.isPresent()) {
            history = existingHistory.get();
            history.setProgress(request.getProgress());
        } else {
            history = new History(user, episode, request.getProgress());
        }
        historyRepository.save(history);
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

    private EpisodeDTO convertToDTO(Episode episode, String userId) {
        Integer watchProgress = 0;
        if (userId != null) {
            Optional<History> history = historyRepository.findByUserIdAndEpisodeId(userId, episode.getId());
            if (history.isPresent()) {
                watchProgress = history.get().getProgress();
            }
        }
        return new EpisodeDTO(
                episode.getId(),
                episode.getAnime().getId(),
                episode.getEpisodeNumber(),
                episode.getVideoUrl(),
                episode.getDuration(),
                episode.getThumbnail(),
                watchProgress
        );
    }
}
