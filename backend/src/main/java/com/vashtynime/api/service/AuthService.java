package com.vashtynime.api.service;

import com.vashtynime.api.dto.AuthRequest;
import com.vashtynime.api.dto.AuthResponse;
import com.vashtynime.api.entity.User;
import com.vashtynime.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public AuthResponse authenticate(AuthRequest request) {
        String firebaseUid;
        
        // 1. In a production environment, we would verify the idToken using FirebaseAdminSdk:
        // FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.getIdToken());
        // firebaseUid = decodedToken.getUid();
        
        // For local development and fallback, we use request parameters or generate a clean id
        if (request.getIdToken() != null && !request.getIdToken().isEmpty()) {
            firebaseUid = request.getIdToken(); // mock firebaseUid
        } else {
            firebaseUid = "firebase_user_" + UUID.randomUUID().toString().substring(0, 8);
        }

        String email = request.getEmail() != null ? request.getEmail() : "user@vashtynime.com";
        String username = request.getUsername() != null ? request.getUsername() : "NimeWatcher";
        String photo = request.getPhoto();

        // 2. Resolve User account (Create if new, update details if modified)
        Optional<User> existingUser = userRepository.findById(firebaseUid);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            if (request.getUsername() != null) user.setUsername(username);
            if (request.getPhoto() != null) user.setPhoto(photo);
            user.regenerateKeysIfNeeded();
            user = userRepository.save(user);
        } else {
            user = new User(firebaseUid, username, email, photo);
            user = userRepository.save(user);
        }

        // 3. Generate our application JWT token
        String jwtToken = jwtService.generateToken(user.getId());

        return new AuthResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail(), user.getPhoto(), user.getPremium(),
                user.getLevel(), user.getXp(), user.getKeysCount(), user.getLastKeyRegenTime());
    }

    @Transactional
    public User resolveUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.regenerateKeysIfNeeded();
        return userRepository.save(user);
    }

    /**
     * Login with existing email - finds user by email and returns JWT.
     * Does NOT create a new account if the email is not found.
     */
    @Transactional
    public AuthResponse loginByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Akun dengan email '" + email + "' tidak ditemukan. Silakan daftar terlebih dahulu."));

        user.regenerateKeysIfNeeded();
        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getId());
        return new AuthResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail(), user.getPhoto(), user.getPremium(),
                user.getLevel(), user.getXp(), user.getKeysCount(), user.getLastKeyRegenTime());
    }

    @Transactional
    public User updateProfile(String userId, String username, String email, String photo, Boolean premium) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        if (username != null && !username.isBlank()) user.setUsername(username);
        if (email != null && !email.isBlank()) user.setEmail(email);
        if (photo != null) user.setPhoto(photo);
        if (premium != null) user.setPremium(premium);
        return userRepository.save(user);
    }

    @Transactional
    public User upgradePremium(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setPremium(true);
        return userRepository.save(user);
    }
}
