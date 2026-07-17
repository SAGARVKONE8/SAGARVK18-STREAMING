package com.sagarvk18.streaming.service;

import com.sagarvk18.streaming.dto.request.LoginRequest;
import com.sagarvk18.streaming.dto.request.RegisterRequest;
import com.sagarvk18.streaming.dto.response.AuthResponse;
import com.sagarvk18.streaming.entity.Profile;
import com.sagarvk18.streaming.entity.User;
import com.sagarvk18.streaming.repository.ProfileRepository;
import com.sagarvk18.streaming.repository.UserRepository;
import com.sagarvk18.streaming.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .build();
        user = userRepository.save(user);

        // Create default profile
        Profile defaultProfile = Profile.builder()
                .user(user)
                .name(request.getName())
                .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getName())
                .build();
        profileRepository.save(defaultProfile);

        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
        String token = jwtUtil.generateToken(userDetails);
        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
        String token = jwtUtil.generateToken(userDetails);
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .subscriptionType(user.getSubscriptionType().name())
                .build();
    }
}
