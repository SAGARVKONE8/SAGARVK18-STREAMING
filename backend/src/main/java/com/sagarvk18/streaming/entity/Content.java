package com.sagarvk18.streaming.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "content")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Content {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType type;

    private String language;
    private Integer releaseYear;
    private Double rating;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private String videoUrl;
    private Integer duration; // minutes
    private boolean isPremium;
    private Long views;
    private String cast;
    private String director;
    private String ageRating;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "content_genres",
        joinColumns = @JoinColumn(name = "content_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id"))
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<Genre> genres;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<Season> seasons;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ContentType { MOVIE, SERIES }
}
