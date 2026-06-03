package com.vashtynime.api.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private String username;
    private String email;
    private String photo;
    private Boolean premium;

    public AuthResponse(String token, String userId, String username, String email, String photo, Boolean premium) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.photo = photo;
        this.premium = premium;
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
}
