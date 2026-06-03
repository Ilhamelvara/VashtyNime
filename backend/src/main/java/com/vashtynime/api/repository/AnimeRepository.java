package com.vashtynime.api.repository;

import com.vashtynime.api.entity.Anime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, UUID> {

    List<Anime> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT a FROM Anime a ORDER BY a.rating DESC")
    List<Anime> findTopTrendingAnime();

    @Query("SELECT a FROM Anime a WHERE a.genre LIKE %:genre%")
    List<Anime> findByGenre(@Param("genre") String genre);
}
