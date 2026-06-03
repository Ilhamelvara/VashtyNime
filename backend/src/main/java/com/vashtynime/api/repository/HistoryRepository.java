package com.vashtynime.api.repository;

import com.vashtynime.api.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HistoryRepository extends JpaRepository<History, UUID> {

    List<History> findByUserIdOrderByUpdatedAtDesc(String userId);

    Optional<History> findByUserIdAndEpisodeId(String userId, UUID episodeId);
}
