package com.sagarvk18.streaming.repository;

import com.sagarvk18.streaming.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByProfileId(Long profileId);
    Optional<Watchlist> findByProfileIdAndContentId(Long profileId, Long contentId);
    boolean existsByProfileIdAndContentId(Long profileId, Long contentId);
    void deleteByProfileIdAndContentId(Long profileId, Long contentId);
}
