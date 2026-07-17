package com.sagarvk18.streaming.controller;

import com.sagarvk18.streaming.dto.request.PaymentRequest;
import com.sagarvk18.streaming.dto.response.ApiResponse;
import com.sagarvk18.streaming.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<?>> getPlans() {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getActivePlans()));
    }

    @PostMapping("/users/{userId}/subscribe")
    public ResponseEntity<ApiResponse<?>> subscribe(@PathVariable Long userId, @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.processPayment(userId, request), "Subscription activated!"));
    }

    @GetMapping("/users/{userId}/payments")
    public ResponseEntity<ApiResponse<?>> getPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getUserPayments(userId)));
    }
}
