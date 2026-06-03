import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';

export default function AnimeDetailScreen({ route, navigation }: any) {
  const { animeId } = route.params;
  const user = useAuthStore((state) => state.user);
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const [animeRes, episodesRes] = await Promise.all([
        apiClient.get(`/anime/${animeId}`).catch(() => null),
        apiClient.get(`/episode/anime/${animeId}`).catch(() => null),
      ]);

      if (animeRes && animeRes.data) {
        setAnime(animeRes.data);
        setIsBookmarked(animeRes.data.isBookmarked);
      }
      
      if (episodesRes && episodesRes.data) {
        setEpisodes(episodesRes.data);
      }

      // Fallback Mock Data if no server or empty DB
      if (!animeRes || !animeRes.data) {
        // Find which mock anime was requested
        const mockAnimeList = [
          {
            id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
            title: 'Frieren: Beyond Journey\'s End',
            description: 'Mage Frieren dan perjalanannya mencari arti kehidupan setelah mengalahkan Raja Iblis bersama kelompok pahlawan. Setelah bertahun-tahun berpisah, ia memutuskan untuk melatih murid barunya, Fern, dan melakukan perjalanan kembali ke utara.',
            coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000',
            genre: ['Fantasy', 'Adventure', 'Drama'],
            rating: 4.9,
            status: 'COMPLETED',
            isBookmarked: false,
          },
          {
            id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
            title: 'Demon Slayer: Hashira Training Arc',
            description: 'Tanjiro pergi menemui Hashira Batu, Himejima, untuk bersiap menghadapi pertempuran yang akan datang. Pelatihan untuk menjadi Hashira sangat intens dan menuntut kekuatan fisik serta mental yang luar biasa.',
            coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000',
            genre: ['Action', 'Fantasy', 'Shounen'],
            rating: 4.8,
            status: 'ONGOING',
            isBookmarked: true,
          },
          {
            id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
            title: 'Jujutsu Kaisen Season 2',
            description: 'Kisah masa lalu Gojo Satoru dan Geto Suguru di SMA Jujutsu, dilanjutkan dengan insiden Shibuya yang mengubah dunia Jujutsu selamanya.',
            coverUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
            genre: ['Action', 'Supernatural', 'Shounen'],
            rating: 4.7,
            status: 'COMPLETED',
            isBookmarked: false,
          }
        ];

        const selectedAnime = mockAnimeList.find(a => a.id === animeId) || mockAnimeList[0];
        setAnime(selectedAnime);
        setIsBookmarked(selectedAnime.isBookmarked);

        // Populate mock episodes
        setEpisodes([
          {
            id: 'ep1',
            animeId: selectedAnime.id,
            episodeNumber: 1,
            videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
            duration: 734,
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
            watchProgress: 120
          },
          {
            id: 'ep2',
            animeId: selectedAnime.id,
            episodeNumber: 2,
            videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
            duration: 840,
            thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
            watchProgress: 0
          }
        ]);
      }

    } catch (err) {
      console.warn('Gagal memuat detail anime', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [animeId]);

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await apiClient.delete(`/bookmark/${animeId}`);
        setIsBookmarked(false);
        Alert.alert('Bookmark', 'Dihapus dari bookmark.');
      } else {
        await apiClient.post('/bookmark', { animeId });
        setIsBookmarked(true);
        Alert.alert('Bookmark', 'Ditambahkan ke bookmark.');
      }
    } catch (err) {
      // Mock toggling state on connection error
      setIsBookmarked(!isBookmarked);
      Alert.alert('Bookmark (Local Mode)', isBookmarked ? 'Dihapus dari bookmark' : 'Ditambahkan ke bookmark');
    }
  };

  const renderEpisodeItem = ({ item }: { item: any }) => {
    const isWatched = item.watchProgress > 0;
    const progressPercent = item.duration > 0 ? (item.watchProgress / item.duration) * 100 : 0;
    const isLocked = anime?.premium && !user?.premium;

    return (
      <TouchableOpacity 
        style={[styles.episodeCard, isLocked && styles.episodeCardLocked]}
        onPress={() => {
          if (isLocked) {
            Alert.alert(
              'Konten Premium 🌟',
              'Episode ini hanya dapat ditonton oleh member Premium. Silakan aktifkan Premium Anda di halaman Profil terlebih dahulu.',
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Ke Profil', onPress: () => navigation.navigate('Profile') }
              ]
            );
            return;
          }
          navigation.navigate('VideoPlayer', {
            episodeId: item.id,
            videoUrl: item.videoUrl,
            episodeTitle: `${anime?.title} - Episode ${item.episodeNumber}`,
            initialProgress: item.watchProgress || 0
          });
        }}
      >
        <View style={styles.episodeThumbContainer}>
          <Image source={{ uri: item.thumbnail || anime?.coverUrl }} style={styles.episodeThumb} />
          {isWatched && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
            </View>
          )}
        </View>

        <View style={styles.episodeInfo}>
          <Text style={[styles.episodeTitleText, isLocked && styles.episodeTitleTextLocked]}>
            Episode {item.episodeNumber} {isLocked && '🔑'}
          </Text>
          <Text style={styles.episodeDurationText}>
            Durasi: {Math.floor(item.duration / 60)} menit
          </Text>
          {isWatched && (
            <Text style={styles.watchedProgressText}>
              Progress: {Math.floor(item.watchProgress / 60)}m ditonton
            </Text>
          )}
        </View>

        <View style={styles.playIconContainer}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={16} color="#f59e0b" />
          ) : (
            <Text style={styles.playIcon}>▶</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading || !anime) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: anime.bannerUrl || anime.coverUrl }} style={styles.bannerImage} />
        <View style={styles.bannerGradient} />
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.detailCard}>
        <View style={styles.row}>
          <Image source={{ uri: anime.coverUrl }} style={styles.coverImage} />
          <View style={styles.metaInfo}>
            <Text style={styles.titleText}>{anime.title}</Text>
            
            <View style={styles.badgeRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {anime.rating}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: anime.status === 'ONGOING' ? '#10b981' : '#4b5563' }]}>
                <Text style={styles.statusText}>{anime.status}</Text>
              </View>
              {anime.premium && (
                <View style={styles.premiumDetailBadge}>
                  <Text style={styles.premiumDetailBadgeText}>PREMIUM</Text>
                </View>
              )}
            </View>

            <Text style={styles.genresText}>
              {anime.genre ? anime.genre.join(', ') : ''}
            </Text>

            {/* Bookmark button */}
            <TouchableOpacity 
              style={[styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive]} 
              onPress={toggleBookmark}
            >
              <Text style={styles.bookmarkButtonText}>
                {isBookmarked ? '♥ Bookmarked' : '♡ Bookmark'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Sinopsis</Text>
        <Text style={styles.descriptionText}>{anime.description}</Text>

        <Text style={styles.sectionHeader}>Daftar Episode ({episodes.length})</Text>
        {episodes.length === 0 ? (
          <Text style={styles.noEpisodesText}>Belum ada episode tersedia untuk anime ini.</Text>
        ) : (
          <FlatList
            data={episodes}
            renderItem={renderEpisodeItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0b0f19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(11, 15, 25, 1)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  detailCard: {
    paddingHorizontal: 20,
    marginTop: -40,
  },
  row: {
    flexDirection: 'row',
  },
  coverImage: {
    width: 110,
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  metaInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  ratingText: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 12,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  genresText: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 12,
  },
  bookmarkButton: {
    borderWidth: 1,
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButtonActive: {
    backgroundColor: '#6366f1',
  },
  bookmarkButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  descriptionText: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 22,
  },
  noEpisodesText: {
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 10,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  episodeThumbContainer: {
    position: 'relative',
    width: 90,
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1f2937',
  },
  episodeThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  episodeTitleText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  episodeDurationText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  watchedProgressText: {
    color: '#6366f1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  playIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  playIcon: {
    color: '#6366f1',
    fontSize: 12,
    marginLeft: 2, // Slight offset for visual play alignment
  },
  episodeCardLocked: {
    borderColor: 'rgba(245, 158, 11, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  episodeTitleTextLocked: {
    color: '#9ca3af',
  },
  premiumDetailBadge: {
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  premiumDetailBadgeText: {
    color: '#0b0f19',
    fontSize: 10,
    fontWeight: '800',
  },
});
