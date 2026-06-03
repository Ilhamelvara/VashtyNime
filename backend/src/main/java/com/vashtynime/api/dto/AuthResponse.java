package com.vashtynime.api.dto;

import java.time.LocalDateTime;

public class AuthResponse {
    private String token;
    private String userId;
    private String username;
    private String email;
    private String photo;
    private Boolean premium;
    private Integer level;
    private Integer xp;
    private Integer keysCount;
    private LocalDateTime lastKeyRegenTime;

    public AuthResponse(String token, String userId, String username, String email, String photo, Boolean premium,
                        Integer level, Integer xp, Integer keysCount, LocalDateTime lastKeyRegenTime) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.photo = photo;
        this.premium = premium;
        this.level = level;
        this.xp = xp;
        this.keysCount = keysCount;
        this.lastKeyRegenTime = lastKeyRegenTime;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Boolean getPremium() {
        return premium;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
    }

    public Integer getKeysCount() {
        return keysCount;
    }

    public void setKeysCount(Integer keysCount) {
        this.keysCount = keysCount;
    }

    public LocalDateTime getLastKeyRegenTime() {
        return lastKeyRegenTime;
    }

    public void setLastKeyRegenTime(LocalDateTime lastKeyRegenTime) {
        this.lastKeyRegenTime = lastKeyRegenTime;
    }
}
