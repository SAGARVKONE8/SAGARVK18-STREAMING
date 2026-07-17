package com.sagarvk18.streaming.repository;

import com.sagarvk18.streaming.entity.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByType(Content.ContentType type);
    Page<Content> findAll(Pageable pageable);

    @Query("SELECT c FROM Content c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Content> searchContent(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM Content c JOIN c.genres g WHERE g.name = :genre")
    List<Content> findByGenreName(@Param("genre") String genre);

    @Query("SELECT c FROM Content c ORDER BY c.views DESC")
    List<Content> findTrending(Pageable pageable);

    @Query("SELECT c FROM Content c ORDER BY c.createdAt DESC")
    List<Content> findNewReleases(Pageable pageable);

    List<Content> findByLanguage(String language);
    List<Content> findByReleaseYear(Integer year);
    List<Content> findByIsPremium(boolean isPremium);
    List<Content> findTop10ByOrderByRatingDesc();
}
