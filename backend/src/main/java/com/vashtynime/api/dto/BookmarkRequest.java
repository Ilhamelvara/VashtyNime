package com.vashtynime.api.dto;

import java.util.UUID;

public class BookmarkRequest {
    private UUID animeId;

    public BookmarkRequest() {}

    public UUID getAnimeId() {
        return animeId;
    }

    public void setAnimeId(UUID animeId) {
        this.animeId = animeId;
    }
}
