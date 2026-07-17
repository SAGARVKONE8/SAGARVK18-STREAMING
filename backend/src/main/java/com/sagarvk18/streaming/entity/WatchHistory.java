package com.sagarvk18.streaming.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watch_history")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WatchHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    private Integer progressSeconds;
    private boolean completed;

    @Builder.Default
    private LocalDateTime watchedAt = LocalDateTime.now();
}
