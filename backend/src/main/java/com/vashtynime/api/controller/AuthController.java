package com.vashtynime.api.controller;

import com.vashtynime.api.dto.AuthRequest;
import com.vashtynime.api.dto.AuthResponse;
import com.vashtynime.api.entity.User;
import com.vashtynime.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    private String getRequiredUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // Register or login with Google/Firebase token
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    // Login with existing email only (no new account creation)
    @PostMapping("/login-email")
    public ResponseEntity<?> loginByEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email tidak boleh kosong"));
        }
        try {
            AuthResponse response = authService.loginByEmail(email.trim());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    // Update user profile info (username, email, photo, premium)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        try {
            String userId = getRequiredUserId();
            String username = (String) body.get("username");
            String email = (String) body.get("email");
            String photo = (String) body.get("photo");
            Boolean premium = (Boolean) body.get("premium");

            User updatedUser = authService.updateProfile(userId, username, email, photo, premium);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    // Upgrade user to Premium status
    @PostMapping("/premium")
    public ResponseEntity<?> upgradePremium() {
        try {
            String userId = getRequiredUserId();
            User updatedUser = authService.upgradePremium(userId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}

