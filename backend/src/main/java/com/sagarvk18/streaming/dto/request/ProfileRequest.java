package com.sagarvk18.streaming.dto.request;

import lombok.Data;

@Data
public class ProfileRequest {
    private String name;
    private String avatar;
    private boolean isKids;
    private String languagePreference;
    private String pin;
}
