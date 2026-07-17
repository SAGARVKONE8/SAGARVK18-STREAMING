package com.sagarvk18.streaming.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist", uniqueConstraints = {@UniqueConstraint(columnNames = {"profile_id", "content_id"})})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Watchlist {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Builder.Default
    private LocalDateTime addedAt = LocalDateTime.now();
}
