package com.sagarvk18.streaming.controller;

import com.sagarvk18.streaming.dto.response.ApiResponse;
import com.sagarvk18.streaming.entity.Content;
import com.sagarvk18.streaming.entity.Genre;
import com.sagarvk18.streaming.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {
    private final ContentService contentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Content>>> getAllContent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllContent(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Content>> getContent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(contentService.getContentById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(contentService.searchContent(query, page, size)));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<Content>>> getTrending() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getTrending()));
    }

    @GetMapping("/new-releases")
    public ResponseEntity<ApiResponse<List<Content>>> getNewReleases() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getNewReleases()));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<Content>>> getTopRated() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getTopRated()));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<Content>>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success(contentService.getByType(type)));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<ApiResponse<List<Content>>> getByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(ApiResponse.success(contentService.getByGenre(genre)));
    }

    @GetMapping("/genres")
    public ResponseEntity<ApiResponse<List<Genre>>> getGenres() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllGenres()));
    }
}
