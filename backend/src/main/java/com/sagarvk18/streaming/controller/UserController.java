package com.sagarvk18.streaming.controller;

import com.sagarvk18.streaming.dto.request.PasswordChangeRequest;
import com.sagarvk18.streaming.dto.request.ProfileRequest;
import com.sagarvk18.streaming.dto.response.ApiResponse;
import com.sagarvk18.streaming.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getMe(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserByEmail(auth.getName())));
    }

    @GetMapping("/{userId}/profiles")
    public ResponseEntity<ApiResponse<?>> getProfiles(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserProfiles(userId)));
    }

    @PostMapping("/{userId}/profiles")
    public ResponseEntity<ApiResponse<?>> createProfile(@PathVariable Long userId, @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.createProfile(userId, request), "Profile created"));
    }

    @PutMapping("/profiles/{profileId}")
    public ResponseEntity<ApiResponse<?>> updateProfile(@PathVariable Long profileId, @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(profileId, request), "Profile updated"));
    }

    @DeleteMapping("/profiles/{profileId}")
    public ResponseEntity<ApiResponse<?>> deleteProfile(@PathVariable Long profileId) {
        userService.deleteProfile(profileId);
        return ResponseEntity.ok(ApiResponse.success(null, "Profile deleted"));
    }

    @PutMapping("/{userId}/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(
            @PathVariable Long userId,
            @RequestBody PasswordChangeRequest request) {
        userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success(null, "Password updated successfully"));
    }
}
