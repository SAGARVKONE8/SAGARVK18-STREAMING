package com.sagarvk18.streaming.controller;

import com.sagarvk18.streaming.dto.request.RatingRequest;
import com.sagarvk18.streaming.dto.response.ApiResponse;
import com.sagarvk18.streaming.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

    @GetMapping("/content/{contentId}")
    public ResponseEntity<ApiResponse<?>> getRatings(@PathVariable Long contentId) {
        return ResponseEntity.ok(ApiResponse.success(ratingService.getRatings(contentId)));
    }

    @PostMapping("/content/{contentId}")
    public ResponseEntity<ApiResponse<?>> rate(@PathVariable Long contentId, @Valid @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(ratingService.rateContent(contentId, request), "Rating submitted"));
    }

    @GetMapping("/content/{contentId}/avg")
    public ResponseEntity<ApiResponse<Double>> getAvg(@PathVariable Long contentId) {
        return ResponseEntity.ok(ApiResponse.success(ratingService.getAvgRating(contentId)));
    }
}
