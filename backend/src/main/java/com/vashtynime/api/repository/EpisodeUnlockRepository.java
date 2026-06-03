package com.vashtynime.api.repository;

import com.vashtynime.api.entity.EpisodeUnlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EpisodeUnlockRepository extends JpaRepository<EpisodeUnlock, UUID> {
    Optional<EpisodeUnlock> findByUserIdAndEpisodeId(String userId, UUID episodeId);
    boolean existsByUserIdAndEpisodeId(String userId, UUID episodeId);
}
