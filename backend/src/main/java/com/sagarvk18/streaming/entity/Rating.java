package com.sagarvk18.streaming.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = {@UniqueConstraint(columnNames = {"profile_id", "content_id"})})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Rating {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    private Integer rating; // 1-10
    private String review;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
