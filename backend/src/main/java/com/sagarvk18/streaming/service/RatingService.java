package com.sagarvk18.streaming.service;

import com.sagarvk18.streaming.dto.request.RatingRequest;
import com.sagarvk18.streaming.entity.Content;
import com.sagarvk18.streaming.entity.Profile;
import com.sagarvk18.streaming.entity.Rating;
import com.sagarvk18.streaming.repository.ContentRepository;
import com.sagarvk18.streaming.repository.ProfileRepository;
import com.sagarvk18.streaming.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final ProfileRepository profileRepository;
    private final ContentRepository contentRepository;

    public List<Rating> getRatings(Long contentId) {
        return ratingRepository.findByContentId(contentId);
    }

    @Transactional
    public Rating rateContent(Long contentId, RatingRequest request) {
        Profile profile = profileRepository.findById(request.getProfileId()).orElseThrow();
        Content content = contentRepository.findById(contentId).orElseThrow();

        Optional<Rating> existing = ratingRepository.findByProfileIdAndContentId(request.getProfileId(), contentId);
        Rating rating = existing.orElse(Rating.builder().profile(profile).content(content).build());
        rating.setRating(request.getRating());
        rating.setReview(request.getReview());
        Rating saved = ratingRepository.save(rating);

        // Update content average rating
        Double avg = ratingRepository.findAvgRatingByContentId(contentId);
        content.setRating(avg);
        contentRepository.save(content);
        return saved;
    }

    public Double getAvgRating(Long contentId) {
        return ratingRepository.findAvgRatingByContentId(contentId);
    }
}
