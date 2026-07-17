package com.sagarvk18.streaming.controller;

import com.sagarvk18.streaming.dto.request.ContentRequest;
import com.sagarvk18.streaming.dto.response.ApiResponse;
import com.sagarvk18.streaming.entity.User;
import com.sagarvk18.streaming.repository.UserRepository;
import com.sagarvk18.streaming.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final ContentService contentService;
    private final UserRepository userRepository;

    @PostMapping("/content")
    public ResponseEntity<ApiResponse<?>> createContent(@RequestBody ContentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(contentService.createContent(request), "Content created"));
    }

    @PutMapping("/content/{id}")
    public ResponseEntity<ApiResponse<?>> updateContent(@PathVariable Long id, @RequestBody ContentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(contentService.updateContent(id, request), "Content updated"));
    }

    @DeleteMapping("/content/{id}")
    public ResponseEntity<ApiResponse<?>> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Content deleted"));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll()));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<?>> updateRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        return ResponseEntity.ok(ApiResponse.success(userRepository.save(user), "Role updated"));
    }
}
