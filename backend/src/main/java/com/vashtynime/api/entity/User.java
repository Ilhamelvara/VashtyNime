package com.vashtynime.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(length = 128)
    private String id; // Firebase UID

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 500)
    private String photo;

    @Column(nullable = false)
    private Boolean premium = false;

    @Column(nullable = false, columnDefinition = "integer default 1")
    private Integer level = 1;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer xp = 0;

    @Column(name = "keys_count", nullable = false, columnDefinition = "integer default 10")
    private Integer keysCount = 10;

    @Column(name = "last_key_regen_time", nullable = false, columnDefinition = "timestamp without time zone default current_timestamp")
    private LocalDateTime lastKeyRegenTime = LocalDateTime.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Default Constructor
    public User() {
        this.level = 1;
        this.xp = 0;
        this.keysCount = 10;
        this.lastKeyRegenTime = LocalDateTime.now();
    }

    public User(String id, String username, String email, String photo) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.photo = photo;
        this.premium = false;
        this.level = 1;
        this.xp = 0;
        this.keysCount = 10;
        this.lastKeyRegenTime = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    // Dynamic key regeneration logic
    public void regenerateKeysIfNeeded() {
        if (Boolean.TRUE.equals(this.premium)) {
            return;
        }
        if (this.keysCount == null) {
            this.keysCount = 10;
        }
        if (this.keysCount >= 10) {
            this.lastKeyRegenTime = LocalDateTime.now();
            return;
        }
        if (this.lastKeyRegenTime == null) {
            this.lastKeyRegenTime = LocalDateTime.now();
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        long minutesBetween = java.time.Duration.between(this.lastKeyRegenTime, now).toMinutes();
        if (minutesBetween >= 1) {
            int keysToAdd = (int) minutesBetween * 2;
            this.keysCount = Math.min(10, this.keysCount + keysToAdd);
            this.lastKeyRegenTime = this.lastKeyRegenTime.plusMinutes(minutesBetween);
            
            if (this.keysCount >= 10) {
                this.lastKeyRegenTime = now;
            }
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
        if (Boolean.TRUE.equals(premium)) {
            this.keysCount = 10; // Reset or keep keys, won't matter for unlimited but safe
        }
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
