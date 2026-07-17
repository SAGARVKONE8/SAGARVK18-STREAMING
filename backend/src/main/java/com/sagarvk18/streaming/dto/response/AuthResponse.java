package com.sagarvk18.streaming.dto.response;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private String type;
    private Long userId;
    private String email;
    private String name;
    private String role;
    private String subscriptionType;
}
