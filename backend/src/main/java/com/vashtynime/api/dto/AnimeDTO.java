package com.vashtynime.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class AnimeDTO {
    private UUID id;
    private String title;
    private String description;
    private String coverUrl;
    private String bannerUrl;
    private List<String> genre;
    private BigDecimal rating;
    private String status;
    private boolean isBookmarked;
    private Boolean premium;
    private String releaseDay;

    public AnimeDTO() {}

    public AnimeDTO(UUID id, String title, String description, String coverUrl, String bannerUrl, List<String> genre, BigDecimal rating, String status, boolean isBookmarked, Boolean premium, String releaseDay) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.coverUrl = coverUrl;
        this.bannerUrl = bannerUrl;
        this.genre = genre;
        this.rating = rating;
        this.status = status;
        this.isBookmarked = isBookmarked;
        this.premium = premium;
        this.releaseDay = releaseDay;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public List<String> getGenre() {
        return genre;
    }

    public void setGenre(List<String> genre) {
        this.genre = genre;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isBookmarked() {
        return isBookmarked;
    }

    public void setBookmarked(boolean bookmarked) {
        this.isBookmarked = bookmarked;
    }

    public Boolean getPremium() {
        return premium;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public String getReleaseDay() {
        return releaseDay;
    }

    public void setReleaseDay(String releaseDay) {
        this.releaseDay = releaseDay;
    }
}
