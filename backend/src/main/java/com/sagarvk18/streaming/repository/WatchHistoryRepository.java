package com.sagarvk18.streaming.repository;

import com.sagarvk18.streaming.entity.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    List<WatchHistory> findByProfileIdOrderByWatchedAtDesc(Long profileId);
    Optional<WatchHistory> findByProfileIdAndContentId(Long profileId, Long contentId);
}
