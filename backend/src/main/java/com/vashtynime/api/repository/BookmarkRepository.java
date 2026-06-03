package com.vashtynime.api.repository;

import com.vashtynime.api.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {

    List<Bookmark> findByUserId(String userId);

    Optional<Bookmark> findByUserIdAndAnimeId(String userId, UUID animeId);

    void deleteByUserIdAndAnimeId(String userId, UUID animeId);
}
