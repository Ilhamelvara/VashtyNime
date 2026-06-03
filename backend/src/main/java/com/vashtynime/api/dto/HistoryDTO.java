package com.vashtynime.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class HistoryDTO {
    private UUID id;
    private UUID episodeId;
    private Integer episodeNumber;
    private String videoUrl;
    private String thumbnail;
    private UUID animeId;
    private String animeTitle;
    private Boolean animePremium;
    private Integer progress;
    private Integer duration;
    private LocalDateTime updatedAt;

    public HistoryDTO() {}

    public HistoryDTO(UUID id, UUID episodeId, Integer episodeNumber, String videoUrl, String thumbnail, UUID animeId, String animeTitle, Boolean animePremium, Integer progress, Integer duration, LocalDateTime updatedAt) {
        this.id = id;
        this.episodeId = episodeId;
        this.episodeNumber = episodeNumber;
        this.videoUrl = videoUrl;
        this.thumbnail = thumbnail;
        this.animeId = animeId;
        this.animeTitle = animeTitle;
        this.animePremium = animePremium;
        this.progress = progress;
        this.duration = duration;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getEpisodeId() {
        return episodeId;
    }

    public void setEpisodeId(UUID episodeId) {
        this.episodeId = episodeId;
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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public UUID getAnimeId() {
        return animeId;
    }

    public void setAnimeId(UUID animeId) {
        this.animeId = animeId;
    }

    public String getAnimeTitle() {
        return animeTitle;
    }

    public void setAnimeTitle(String animeTitle) {
        this.animeTitle = animeTitle;
    }

    public Boolean getAnimePremium() {
        return animePremium;
    }

    public void setAnimePremium(Boolean animePremium) {
        this.animePremium = animePremium;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
