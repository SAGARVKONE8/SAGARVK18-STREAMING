package com.sagarvk18.streaming.controller;

import com.sagarvk18.streaming.dto.request.LoginRequest;
import com.sagarvk18.streaming.dto.request.RegisterRequest;
import com.sagarvk18.streaming.dto.response.ApiResponse;
import com.sagarvk18.streaming.dto.response.AuthResponse;
import com.sagarvk18.streaming.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request), "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request), "Login successful"));
    }
}
