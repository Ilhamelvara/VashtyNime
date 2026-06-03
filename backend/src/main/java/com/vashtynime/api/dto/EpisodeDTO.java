package com.vashtynime.api.dto;

import java.util.UUID;

public class EpisodeDTO {
    private UUID id;
    private UUID animeId;
    private Integer episodeNumber;
    private String videoUrl;
    private Integer duration;
    private String thumbnail;
    private Integer watchProgress; // In seconds, from user's history if available

    public EpisodeDTO() {}

    public EpisodeDTO(UUID id, UUID animeId, Integer episodeNumber, String videoUrl, Integer duration, String thumbnail, Integer watchProgress) {
        this.id = id;
        this.animeId = animeId;
        this.episodeNumber = episodeNumber;
        this.videoUrl = videoUrl;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.watchProgress = watchProgress;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAnimeId() {
        return animeId;
    }

    public void setAnimeId(UUID animeId) {
        this.animeId = animeId;
    }

    public Integer getEpisodeNumber() {
        return episodeNumber;
    }

    public void setEpisodeNumber(Integer episodeNumber) {
        this.episodeNumber = episodeNumber;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Integer getWatchProgress() {
        return watchProgress;
    }

    public void setWatchProgress(Integer watchProgress) {
        this.watchProgress = watchProgress;
    }
}
