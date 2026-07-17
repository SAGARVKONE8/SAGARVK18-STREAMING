package com.sagarvk18.streaming.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ContentRequest {
    private String title;
    private String description;
    private String type; // MOVIE or SERIES
    private String language;
    private Integer releaseYear;
    private Double rating;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private String videoUrl;
    private Integer duration;
    private boolean isPremium;
    private String cast;
    private String director;
    private String ageRating;
    private List<Long> genreIds;
}
