package com.sagarvk18.streaming.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscription_plans")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private Double price;
    private String quality; // SD, HD, FHD, 4K
    private Integer screens;
    private Integer downloads;
    private String features;
    private boolean active;
}
