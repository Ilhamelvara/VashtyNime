package com.vashtynime.api.repository;

import com.vashtynime.api.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, UUID> {

    List<Episode> findByAnimeIdOrderByEpisodeNumberAsc(UUID animeId);

    Optional<Episode> findByAnimeIdAndEpisodeNumber(UUID animeId, Integer episodeNumber);
}
