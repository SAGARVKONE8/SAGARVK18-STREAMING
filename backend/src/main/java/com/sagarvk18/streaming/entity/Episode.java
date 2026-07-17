package com.sagarvk18.streaming.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "episodes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Episode {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Season season;

    private Integer episodeNumber;
    private String title;
    private String description;
    private Integer duration;
    private String videoUrl;
    private String thumbnailUrl;
}
