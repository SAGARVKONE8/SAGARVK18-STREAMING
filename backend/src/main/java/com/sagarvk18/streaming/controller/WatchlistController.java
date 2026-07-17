package com.sagarvk18.streaming.controller;

import com.sagarvk18.streaming.dto.response.ApiResponse;
import com.sagarvk18.streaming.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {
    private final WatchlistService watchlistService;

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<ApiResponse<?>> getWatchlist(@PathVariable Long profileId) {
        return ResponseEntity.ok(ApiResponse.success(watchlistService.getWatchlist(profileId)));
    }

    @PostMapping("/profile/{profileId}/content/{contentId}")
    public ResponseEntity<ApiResponse<?>> add(@PathVariable Long profileId, @PathVariable Long contentId) {
        return ResponseEntity.ok(ApiResponse.success(watchlistService.addToWatchlist(profileId, contentId), "Added to My List"));
    }

    @DeleteMapping("/profile/{profileId}/content/{contentId}")
    public ResponseEntity<ApiResponse<?>> remove(@PathVariable Long profileId, @PathVariable Long contentId) {
        watchlistService.removeFromWatchlist(profileId, contentId);
        return ResponseEntity.ok(ApiResponse.success(null, "Removed from My List"));
    }

    @GetMapping("/profile/{profileId}/content/{contentId}/check")
    public ResponseEntity<ApiResponse<Boolean>> check(@PathVariable Long profileId, @PathVariable Long contentId) {
        return ResponseEntity.ok(ApiResponse.success(watchlistService.isInWatchlist(profileId, contentId)));
    }
}
