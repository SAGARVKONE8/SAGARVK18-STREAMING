package com.sagarvk18.streaming.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "genres")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Genre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
}
