package com.sagarvk18.streaming.repository;

import com.sagarvk18.streaming.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByContentId(Long contentId);
    Optional<Rating> findByProfileIdAndContentId(Long profileId, Long contentId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.content.id = :contentId")
    Double findAvgRatingByContentId(@Param("contentId") Long contentId);
}
