package com.sagarvk18.streaming.service;

import com.sagarvk18.streaming.dto.request.ContentRequest;
import com.sagarvk18.streaming.entity.Content;
import com.sagarvk18.streaming.entity.Genre;
import com.sagarvk18.streaming.repository.ContentRepository;
import com.sagarvk18.streaming.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {
    private final ContentRepository contentRepository;
    private final GenreRepository genreRepository;

    public List<Content> getAllContent(int page, int size) {
        return contentRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    public Content getContentById(Long id) {
        Content c = contentRepository.findById(id).orElseThrow(() -> new RuntimeException("Content not found"));
        c.setViews((c.getViews() == null ? 0 : c.getViews()) + 1);
        contentRepository.save(c);
        return c;
    }

    public Page<Content> searchContent(String query, int page, int size) {
        return contentRepository.searchContent(query, PageRequest.of(page, size));
    }

    public List<Content> getTrending() {
        return contentRepository.findTrending(PageRequest.of(0, 10));
    }

    public List<Content> getNewReleases() {
        return contentRepository.findNewReleases(PageRequest.of(0, 10));
    }

    public List<Content> getTopRated() {
        return contentRepository.findTop10ByOrderByRatingDesc();
    }

    public List<Content> getByType(String type) {
        return contentRepository.findByType(Content.ContentType.valueOf(type.toUpperCase()));
    }

    public List<Content> getByGenre(String genre) {
        return contentRepository.findByGenreName(genre);
    }

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @Transactional
    public Content createContent(ContentRequest request) {
        List<Genre> genres = new ArrayList<>();
        if (request.getGenreIds() != null) {
            genres = genreRepository.findAllById(request.getGenreIds());
        }
        Content content = Content.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(Content.ContentType.valueOf(request.getType().toUpperCase()))
                .language(request.getLanguage())
                .releaseYear(request.getReleaseYear())
                .rating(request.getRating())
                .posterUrl(request.getPosterUrl())
                .backdropUrl(request.getBackdropUrl())
                .trailerUrl(request.getTrailerUrl())
                .videoUrl(request.getVideoUrl())
                .duration(request.getDuration())
                .isPremium(request.isPremium())
                .cast(request.getCast())
                .director(request.getDirector())
                .ageRating(request.getAgeRating())
                .views(0L)
                .genres(genres)
                .build();
        return contentRepository.save(content);
    }

    @Transactional
    public Content updateContent(Long id, ContentRequest request) {
        Content content = contentRepository.findById(id).orElseThrow(() -> new RuntimeException("Content not found"));
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setType(Content.ContentType.valueOf(request.getType().toUpperCase()));
        content.setLanguage(request.getLanguage());
        content.setReleaseYear(request.getReleaseYear());
        content.setRating(request.getRating());
        content.setPosterUrl(request.getPosterUrl());
        content.setBackdropUrl(request.getBackdropUrl());
        content.setTrailerUrl(request.getTrailerUrl());
        content.setVideoUrl(request.getVideoUrl());
        content.setDuration(request.getDuration());
        content.setPremium(request.isPremium());
        content.setCast(request.getCast());
        content.setDirector(request.getDirector());
        content.setAgeRating(request.getAgeRating());
        if (request.getGenreIds() != null) {
            content.setGenres(genreRepository.findAllById(request.getGenreIds()));
        }
        return contentRepository.save(content);
    }

    public void deleteContent(Long id) {
        contentRepository.deleteById(id);
    }
}
