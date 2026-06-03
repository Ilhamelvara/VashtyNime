package com.vashtynime.api.dto;

import java.util.UUID;

public class HistoryRequest {
    private UUID episodeId;
    private Integer progress; // Watch progress in seconds

    public HistoryRequest() {}

    public UUID getEpisodeId() {
        return episodeId;
    }

    public void setEpisodeId(UUID episodeId) {
        this.episodeId = episodeId;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }
}
