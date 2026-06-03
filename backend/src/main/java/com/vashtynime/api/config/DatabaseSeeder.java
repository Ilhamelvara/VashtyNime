package com.vashtynime.api.config;

import com.vashtynime.api.entity.Anime;
import com.vashtynime.api.entity.Episode;
import com.vashtynime.api.repository.AnimeRepository;
import com.vashtynime.api.repository.EpisodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private AnimeRepository animeRepository;

    @Autowired
    private EpisodeRepository episodeRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Manually run DDL updates because Supabase pooler blocks Hibernate auto-update DDL
        try {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE anime ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE anime ADD COLUMN IF NOT EXISTS release_day VARCHAR(50)");
            System.out.println("Database schema altered successfully with raw SQL.");
        } catch (Exception e) {
            System.err.println("Manual database schema update warning: " + e.getMessage());
        }

        try {
            if (animeRepository.count() == 0) {
                seedAnime();
            }
        } catch (Exception e) {
            System.err.println("Database seeding failed: " + e.getMessage());
        }
    }

    private void seedAnime() {
        List<Anime> animeList = new ArrayList<>();

        // 1. Frieren
        Anime frieren = new Anime();
        frieren.setTitle("Frieren: Beyond Journey's End");
        frieren.setDescription("Mage Frieren dan perjalanannya mencari arti kehidupan setelah mengalahkan Raja Iblis bersama kelompok pahlawan.");
        frieren.setCoverUrl("https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500");
        frieren.setBannerUrl("https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000");
        frieren.setGenre(Arrays.asList("Fantasy", "Adventure", "Drama"));
        frieren.setRating(new BigDecimal("4.9"));
        frieren.setStatus("COMPLETED");
        frieren.setPremium(false);
        frieren.setReleaseDay("Minggu");
        animeList.add(frieren);

        // 2. Demon Slayer
        Anime demonSlayer = new Anime();
        demonSlayer.setTitle("Demon Slayer: Hashira Training Arc");
        demonSlayer.setDescription("Tanjiro pergi menemui Hashira Batu, Himejima, untuk bersiap menghadapi pertempuran besar melawan Muzan Kibutsuji.");
        demonSlayer.setCoverUrl("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500");
        demonSlayer.setBannerUrl("https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000");
        demonSlayer.setGenre(Arrays.asList("Action", "Fantasy", "Shounen"));
        demonSlayer.setRating(new BigDecimal("4.8"));
        demonSlayer.setStatus("ONGOING");
        demonSlayer.setPremium(true);
        demonSlayer.setReleaseDay("Minggu");
        animeList.add(demonSlayer);

        // 3. Jujutsu Kaisen S2
        Anime jjk = new Anime();
        jjk.setTitle("Jujutsu Kaisen Season 2");
        jjk.setDescription("Kisah masa lalu Gojo Satoru dan Geto Suguru di SMA Jujutsu, dilanjutkan dengan insiden Shibuya yang dahsyat.");
        jjk.setCoverUrl("https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500");
        jjk.setBannerUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000");
        jjk.setGenre(Arrays.asList("Action", "Supernatural", "Shounen"));
        jjk.setRating(new BigDecimal("4.7"));
        jjk.setStatus("COMPLETED");
        jjk.setPremium(false);
        jjk.setReleaseDay("Kamis");
        animeList.add(jjk);

        // 4. Solo Leveling
        Anime soloLeveling = new Anime();
        soloLeveling.setTitle("Solo Leveling");
        soloLeveling.setDescription("Hunter terlemah umat manusia, Sung Jin-Woo, mendapatkan kekuatan misterius melalui 'System' untuk menjadi Hunter terkuat.");
        soloLeveling.setCoverUrl("https://images.unsplash.com/photo-1580234810907-b40315b76418?w=500");
        soloLeveling.setBannerUrl("https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000");
        soloLeveling.setGenre(Arrays.asList("Action", "Fantasy", "Adventure"));
        soloLeveling.setRating(new BigDecimal("4.8"));
        soloLeveling.setStatus("ONGOING");
        soloLeveling.setPremium(true);
        soloLeveling.setReleaseDay("Sabtu");
        animeList.add(soloLeveling);

        // 5. One Piece
        Anime onePiece = new Anime();
        onePiece.setTitle("One Piece");
        onePiece.setDescription("Monkey D. Luffy dan krunya menjelajahi Grand Line demi menemukan harta karun legendaris 'One Piece' dan menjadi Raja Bajak Laut.");
        onePiece.setCoverUrl("https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=500");
        onePiece.setBannerUrl("https://images.unsplash.com/photo-1513757378314-e46255f5ed16?w=1000");
        onePiece.setGenre(Arrays.asList("Action", "Adventure", "Fantasy"));
        onePiece.setRating(new BigDecimal("4.9"));
        onePiece.setStatus("ONGOING");
        onePiece.setPremium(false);
        onePiece.setReleaseDay("Minggu");
        animeList.add(onePiece);

        // 6. Oshi no Ko
        Anime oshiNoKo = new Anime();
        oshiNoKo.setTitle("Oshi no Ko Season 2");
        oshiNoKo.setDescription("Aqua dan Ruby terus menjelajahi sisi gelap industri hiburan demi mengungkap kebenaran di balik kematian ibu mereka.");
        oshiNoKo.setCoverUrl("https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500");
        oshiNoKo.setBannerUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000");
        oshiNoKo.setGenre(Arrays.asList("Drama", "Supernatural", "Mystery"));
        oshiNoKo.setRating(new BigDecimal("4.6"));
        oshiNoKo.setStatus("ONGOING");
        oshiNoKo.setPremium(true);
        oshiNoKo.setReleaseDay("Rabu");
        animeList.add(oshiNoKo);

        // 7. Kaiju No. 8
        Anime kaijuNo8 = new Anime();
        kaijuNo8.setTitle("Kaiju No. 8");
        kaijuNo8.setDescription("Kafka Hibino bermimpi bergabung dengan Angkatan Pertahanan untuk melawan Kaiju, hingga akhirnya ia sendiri berubah menjadi Kaiju.");
        kaijuNo8.setCoverUrl("https://images.unsplash.com/photo-1563089145-599997674d42?w=500");
        kaijuNo8.setBannerUrl("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000");
        kaijuNo8.setGenre(Arrays.asList("Action", "Sci-Fi", "Shounen"));
        kaijuNo8.setRating(new BigDecimal("4.5"));
        kaijuNo8.setStatus("ONGOING");
        kaijuNo8.setPremium(false);
        kaijuNo8.setReleaseDay("Sabtu");
        animeList.add(kaijuNo8);

        // 8. Wind Breaker
        Anime windBreaker = new Anime();
        windBreaker.setTitle("Wind Breaker");
        windBreaker.setDescription("Haruka Sakura pindah ke SMA Furin yang terkenal dengan murid-murid delinquent yang melindungi kota.");
        windBreaker.setCoverUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500");
        windBreaker.setBannerUrl("https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000");
        windBreaker.setGenre(Arrays.asList("Action", "School", "Delinquent"));
        windBreaker.setRating(new BigDecimal("4.4"));
        windBreaker.setStatus("COMPLETED");
        windBreaker.setPremium(false);
        windBreaker.setReleaseDay("Jumat");
        animeList.add(windBreaker);

        // 9. Mushoku Tensei
        Anime mushokuTensei = new Anime();
        mushokuTensei.setTitle("Mushoku Tensei: Jobless Reincarnation S2");
        mushokuTensei.setDescription("Rudeus Greyrat berpetualang di dunia barunya untuk melupakan masa lalunya dan mencari keluarganya yang hilang.");
        mushokuTensei.setCoverUrl("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500");
        mushokuTensei.setBannerUrl("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000");
        mushokuTensei.setGenre(Arrays.asList("Fantasy", "Isekai", "Adventure"));
        mushokuTensei.setRating(new BigDecimal("4.6"));
        mushokuTensei.setStatus("COMPLETED");
        mushokuTensei.setPremium(true);
        mushokuTensei.setReleaseDay("Senin");
        animeList.add(mushokuTensei);

        // Save anime and add episodes
        for (Anime anime : animeList) {
            Anime savedAnime = animeRepository.save(anime);
            seedEpisodesForAnime(savedAnime);
        }
    }

    private void seedEpisodesForAnime(Anime anime) {
        String videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        int duration = 596; // ~10 minutes

        for (int i = 1; i <= 3; i++) {
            Episode episode = new Episode();
            episode.setAnime(anime);
            episode.setEpisodeNumber(i);
            episode.setVideoUrl(videoUrl);
            episode.setDuration(duration);
            episode.setThumbnail(anime.getCoverUrl());
            episodeRepository.save(episode);
        }
    }
}
