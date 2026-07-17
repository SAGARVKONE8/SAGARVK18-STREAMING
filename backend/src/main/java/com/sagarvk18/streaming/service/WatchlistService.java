package com.sagarvk18.streaming.service;

import com.sagarvk18.streaming.entity.Content;
import com.sagarvk18.streaming.entity.Profile;
import com.sagarvk18.streaming.entity.Watchlist;
import com.sagarvk18.streaming.repository.ContentRepository;
import com.sagarvk18.streaming.repository.ProfileRepository;
import com.sagarvk18.streaming.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistService {
    private final WatchlistRepository watchlistRepository;
    private final ProfileRepository profileRepository;
    private final ContentRepository contentRepository;

    public List<Watchlist> getWatchlist(Long profileId) {
        return watchlistRepository.findByProfileId(profileId);
    }

    @Transactional
    public Watchlist addToWatchlist(Long profileId, Long contentId) {
        if (watchlistRepository.existsByProfileIdAndContentId(profileId, contentId)) {
            throw new RuntimeException("Already in watchlist");
        }
        Profile profile = profileRepository.findById(profileId).orElseThrow();
        Content content = contentRepository.findById(contentId).orElseThrow();
        return watchlistRepository.save(Watchlist.builder().profile(profile).content(content).build());
    }

    @Transactional
    public void removeFromWatchlist(Long profileId, Long contentId) {
        watchlistRepository.deleteByProfileIdAndContentId(profileId, contentId);
    }

    public boolean isInWatchlist(Long profileId, Long contentId) {
        return watchlistRepository.existsByProfileIdAndContentId(profileId, contentId);
    }
}
