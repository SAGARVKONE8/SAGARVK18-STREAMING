package com.sagarvk18.streaming.repository;

import com.sagarvk18.streaming.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByUserId(Long userId);
    int countByUserId(Long userId);
}
