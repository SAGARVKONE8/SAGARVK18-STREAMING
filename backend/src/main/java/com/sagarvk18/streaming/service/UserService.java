package com.sagarvk18.streaming.service;

import com.sagarvk18.streaming.dto.request.ProfileRequest;
import com.sagarvk18.streaming.entity.Profile;
import com.sagarvk18.streaming.entity.User;
import com.sagarvk18.streaming.repository.ProfileRepository;
import com.sagarvk18.streaming.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Profile> getUserProfiles(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    public Profile createProfile(Long userId, ProfileRequest request) {
        if (profileRepository.countByUserId(userId) >= 5) {
            throw new RuntimeException("Maximum 5 profiles allowed");
        }
        User user = userRepository.findById(userId).orElseThrow();
        Profile profile = Profile.builder()
                .user(user)
                .name(request.getName())
                .avatar(request.getAvatar() != null ? request.getAvatar() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getName())
                .isKids(request.isKids())
                .languagePreference(request.getLanguagePreference())
                .pin(request.getPin())
                .build();
        return profileRepository.save(profile);
    }

    public Profile updateProfile(Long profileId, ProfileRequest request) {
        Profile profile = profileRepository.findById(profileId).orElseThrow();
        profile.setName(request.getName());
        if (request.getAvatar() != null) profile.setAvatar(request.getAvatar());
        profile.setKids(request.isKids());
        profile.setLanguagePreference(request.getLanguagePreference());
        return profileRepository.save(profile);
    }

    public void deleteProfile(Long profileId) {
        profileRepository.deleteById(profileId);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
