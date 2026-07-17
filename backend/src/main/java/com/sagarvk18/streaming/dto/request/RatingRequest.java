package com.sagarvk18.streaming.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RatingRequest {
    @NotNull @Min(1) @Max(10)
    private Integer rating;
    private String review;
    @NotNull
    private Long profileId;
}
