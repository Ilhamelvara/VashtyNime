import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';


const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [trending, setTrending] = useState<any[]>([]);
  const [allAnime, setAllAnime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  const fetchAnimeData = async () => {
    setIsLoading(true);
    try {
      const [trendingRes, allRes] = await Promise.all([
        apiClient.get('/anime/trending').catch(() => null),
        apiClient.get('/anime').catch(() => null),
      ]);

      if (trendingRes && trendingRes.data && trendingRes.data.length > 0) {
        setTrending(trendingRes.data);
      }
      if (allRes && allRes.data && allRes.data.length > 0) {
        setAllAnime(allRes.data);
      }

      // Fallback to beautiful mock data if no server or empty DB
      if (!allRes || !allRes.data || allRes.data.length === 0) {
        const mockData = [
          {
            id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
            title: "Frieren: Beyond Journey's End",
            description: 'Mage Frieren dan perjalanannya mencari arti kehidupan setelah mengalahkan Raja Iblis bersama kelompok pahlawan.',
            coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000',
            genre: ['Fantasy', 'Adventure', 'Drama'],
            rating: 4.9,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Minggu',
          },
          {
            id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
            title: 'Demon Slayer: Hashira Training Arc',
            description: 'Tanjiro pergi menemui Hashira Batu, Himejima, untuk bersiap menghadapi pertempuran besar melawan Muzan Kibutsuji.',
            coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000',
            genre: ['Action', 'Fantasy', 'Shounen'],
            rating: 4.8,
            status: 'ONGOING',
            isBookmarked: true,
            premium: true,
            releaseDay: 'Minggu',
          },
          {
            id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
            title: 'Jujutsu Kaisen Season 2',
            description: 'Kisah masa lalu Gojo Satoru dan Geto Suguru di SMA Jujutsu, dilanjutkan dengan insiden Shibuya.',
            coverUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
            genre: ['Action', 'Supernatural', 'Shounen'],
            rating: 4.7,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Kamis',
          },
          {
            id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
            title: 'Solo Leveling',
            description: "Hunter terlemah umat manusia, Sung Jin-Woo, mendapatkan kekuatan misterius melalui 'System' untuk menjadi Hunter terkuat.",
            coverUrl: 'https://images.unsplash.com/photo-1580234810907-b40315b76418?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000',
            genre: ['Action', 'Fantasy', 'Adventure'],
            rating: 4.8,
            status: 'ONGOING',
            isBookmarked: false,
            premium: true,
            releaseDay: 'Sabtu',
          },
          {
            id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
            title: 'One Piece',
            description: "Monkey D. Luffy dan krunya menjelajahi Grand Line demi menemukan harta karun legendaris 'One Piece' dan menjadi Raja Bajak Laut.",
            coverUrl: 'https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1513757378314-e46255f5ed16?w=1000',
            genre: ['Action', 'Adventure', 'Fantasy'],
            rating: 4.9,
            status: 'ONGOING',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Minggu',
          },
          {
            id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
            title: 'Oshi no Ko Season 2',
            description: 'Aqua dan Ruby terus menjelajahi sisi gelap industri hiburan demi mengungkap kebenaran di balik kematian ibu mereka.',
            coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000',
            genre: ['Drama', 'Supernatural', 'Mystery'],
            rating: 4.6,
            status: 'ONGOING',
            isBookmarked: false,
            premium: true,
            releaseDay: 'Rabu',
          },
          {
            id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
            title: 'Kaiju No. 8',
            description: 'Kafka Hibino bermimpi bergabung dengan Angkatan Pertahanan untuk melawan Kaiju, hingga akhirnya ia sendiri berubah menjadi Kaiju.',
            coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000',
            genre: ['Action', 'Sci-Fi', 'Shounen'],
            rating: 4.5,
            status: 'ONGOING',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Sabtu',
          },
          {
            id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
            title: 'Wind Breaker',
            description: 'Haruka Sakura pindah ke SMA Furin yang terkenal dengan murid-murid delinquent yang melindungi kota.',
            coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000',
            genre: ['Action', 'School', 'Delinquent'],
            rating: 4.4,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Jumat',
          },
          {
            id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
            title: 'Mushoku Tensei Season 2',
            description: 'Rudeus Greyrat berpetualang di dunia barunya untuk melupakan masa lalunya dan mencari keluarganya yang hilang.',
            coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000',
            genre: ['Fantasy', 'Isekai', 'Adventure'],
            rating: 4.6,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: true,
            releaseDay: 'Senin',
          },
          {
            id: 'a0b1c2d3-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
            title: 'Spy x Family Season 2',
            description: 'Keluarga Forger kembali! Loid, Yor, dan Anya menjalani misi rahasia sambil berusaha menjaga rahasia masing-masing.',
            coverUrl: 'https://images.unsplash.com/photo-1614583225154-5fcdda07019e?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=1000',
            genre: ['Comedy', 'Action', 'Slice of Life'],
            rating: 4.7,
            status: 'ONGOING',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Sabtu',
          },
          {
            id: 'b1c2d3e4-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
            title: 'Blue Lock',
            description: 'Program kontroversial untuk menciptakan striker terbaik Jepang memaksa 300 pemain muda saling bersaing tanpa ampun.',
            coverUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1000',
            genre: ['Sports', 'Shounen', 'Drama'],
            rating: 4.5,
            status: 'ONGOING',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Sabtu',
          },
          {
            id: 'c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
            title: 'Bocchi the Rock!',
            description: 'Hitori Gotoh, gadis introvert yang jago gitar, memulai perjalanannya di dunia band rock bersama teman-teman barunya.',
            coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000',
            genre: ['Comedy', 'Music', 'Slice of Life'],
            rating: 4.8,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Jumat',
          },
          {
            id: 'd3e4f5a6-7b8c-9d0e-1f2a-3b4c5d6e7f8a',
            title: 'My Dress-Up Darling',
            description: 'Wakana Gojo, pembuat boneka tradisional, bertemu Marin Kitagawa yang menginginkan bantuan membuat kostum cosplay.',
            coverUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000',
            genre: ['Romance', 'Comedy', 'Slice of Life'],
            rating: 4.6,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: true,
            releaseDay: 'Sabtu',
          },
          {
            id: 'e4f5a6b7-8c9d-0e1f-2a3b-4c5d6e7f8a9b',
            title: 'Chainsaw Man',
            description: 'Denji, pemuda miskin yang bergabung dengan iblis gergaji mesin, menjadi pemburu iblis pemerintah demi hidup layak.',
            coverUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1604076913837-52ab5f7c1ac4?w=1000',
            genre: ['Action', 'Horror', 'Supernatural'],
            rating: 4.7,
            status: 'ONGOING',
            isBookmarked: false,
            premium: true,
            releaseDay: 'Selasa',
          },
          {
            id: 'f5a6b7c8-9d0e-1f2a-3b4c-5d6e7f8a9b0c',
            title: 'Vinland Saga Season 2',
            description: 'Thorfinn meninggalkan kehidupan perang dan berusaha menemukan tanah damai Vinland yang dijanjikan ayahnya.',
            coverUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000',
            genre: ['Action', 'Historical', 'Drama'],
            rating: 4.9,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Senin',
          },
          {
            id: 'a6b7c8d9-0e1f-2a3b-4c5d-6e7f8a9b0c1d',
            title: 'Dandadan',
            description: 'Momo dan Okarun yang percaya pada hal supranatural dan alien, terlibat dalam petualangan gila yang tak terduga.',
            coverUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000',
            genre: ['Action', 'Supernatural', 'Comedy'],
            rating: 4.7,
            status: 'ONGOING',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Kamis',
          },
          {
            id: 'b7c8d9e0-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
            title: 'Kaguya-sama: Love is War',
            description: 'Dua jenius di dewan siswa saling jatuh cinta tapi terlalu gengsi untuk mengaku duluan. Perang psikologis dimulai!',
            coverUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500',
            bannerUrl: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=1000',
            genre: ['Romance', 'Comedy', 'Psychological'],
            rating: 4.8,
            status: 'COMPLETED',
            isBookmarked: false,
            premium: false,
            releaseDay: 'Jumat',
          },
        ];
        setTrending(mockData.filter(a => a.rating >= 4.7));
        setAllAnime(mockData);
      }
    } catch (err) {
      console.warn('Backend fetch failed, showing mock data');
    } finally {
      setIsLoading(false);
    }
  };

  // Hot Anime Auto-scroll logic
  const hotAnimeRef = useRef<FlatList>(null);
  const scrollPosition = useRef(0);
  const scrollDirection = useRef(1); // 1 for right, -1 for left

  useEffect(() => {
    if (trending.length === 0) return;
    
    // Smooth continuous scroll
    const interval = setInterval(() => {
      scrollPosition.current += 1.2 * scrollDirection.current;
      
      // Calculate max scroll width. 5 items, each is width * 0.45 + 12 (margin)
      const maxScroll = (width * 0.45 + 12) * 5 - width + 40;
      
      if (scrollPosition.current >= maxScroll) {
        scrollDirection.current = -1; // Reverse direction when reaching the end
      } else if (scrollPosition.current <= 0) {
        scrollDirection.current = 1; // Go forward when reaching the start
      }
      
      if (hotAnimeRef.current) {
        hotAnimeRef.current.scrollToOffset({
          offset: scrollPosition.current,
          animated: false,
        });
      }
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [trending.length]);

  useEffect(() => {
    fetchAnimeData();
  }, []);

  const renderTrendingItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.trendingCard}
      onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id })}
    >
      <Image source={{ uri: item.bannerUrl || item.coverUrl }} style={styles.trendingImage} />
      <View style={styles.trendingGradient} />
      <View style={styles.trendingInfo}>
        <View style={styles.badgeRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
          </View>
          {item.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>
        <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.trendingGenres} numberOfLines={1}>
          {item.genre ? item.genre.join(' • ') : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAnimeItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.animeGridItem}
      onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id })}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.animeCover} />
      {item.premium && (
        <View style={styles.gridPremiumBadge}>
          <Ionicons name="star" size={10} color="#ffffff" />
          <Text style={styles.gridPremiumText}>PREMIUM</Text>
        </View>
      )}
      <View style={styles.animeItemInfo}>
        <Text style={styles.animeTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'ONGOING' ? '#10b981' : '#4b5563' }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.ratingLabel}>★ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.mainWrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.welcomeRow}>
              <Text style={styles.welcomeText}>Halo,</Text>
              {user?.premium && (
                <View style={styles.premiumHeaderBadge}>
                  <Text style={styles.premiumHeaderBadgeText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.usernameText}>{user?.username || 'Guest'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionIconButton} onPress={() => navigation.navigate('Search')}>
              <Ionicons name="search" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton} onPress={() => navigation.navigate('Bookmark')}>
              <Ionicons name="bookmark" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.profileAvatarImage} />
              ) : (
                <Text style={styles.profileButtonText}>
                  {(user?.username || 'G').charAt(0).toUpperCase()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Genres Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Genres</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreList}>
          {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'].map((genre) => (
            <TouchableOpacity key={genre} style={styles.genrePill}>
              <Text style={styles.genrePillText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hot Anime Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Hot <Text style={{fontWeight: 'normal'}}>Anime</Text></Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Lihat Peringkat Anime &gt;</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={hotAnimeRef}
          data={trending.slice(0, 5)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hotAnimeList}
          keyExtractor={(item) => `hot-${item.id}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.hotAnimeCard}
              onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id })}
            >
              <Image source={{ uri: item.coverUrl }} style={styles.hotAnimeImage} />
              <View style={styles.hotAnimeGradient} />
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.hotAnimeRating}>
                <Text style={styles.hotAnimeRatingText}>★ {item.rating}</Text>
              </View>
              <View style={styles.hotAnimeInfo}>
                <Text style={styles.hotAnimeTitle} numberOfLines={2}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Baru Ditambahkan Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Baru Ditambahkan</Text>
        </View>
        <FlatList
          data={allAnime.slice(-6).reverse()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.newAnimeCard}
              onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.coverUrl }} style={styles.newAnimeCover} />
              {item.premium && (
                <View style={styles.newAnimePremiumBadge}>
                  <Text style={styles.newAnimePremiumText}>PRO</Text>
                </View>
              )}
              <Text style={styles.newAnimeTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.newAnimeGenre} numberOfLines={1}>
                {item.genre ? item.genre.slice(0, 2).join(' • ') : ''}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => 'new-' + item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newAnimeList}
        />

        {/* New Anime Update List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Anime Update</Text>
        </View>
        <FlatList
          data={allAnime}
          renderItem={renderAnimeItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridList}
        />
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  seeAllText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '700',
  },
  genreList: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  genrePill: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#111827',
  },
  genrePillText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  hotAnimeList: {
    paddingLeft: 20,
    paddingRight: 4,
    paddingBottom: 8,
  },
  hotAnimeCard: {
    width: width * 0.45,
    height: 250,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1f2937',
  },
  hotAnimeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hotAnimeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: 'rgba(11, 15, 25, 0.9)',
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankText: {
    color: '#0b0f19',
    fontWeight: '800',
    fontSize: 12,
  },
  hotAnimeRating: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotAnimeRatingText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  hotAnimeInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  hotAnimeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  premiumHeaderBadge: {
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  premiumHeaderBadgeText: {
    color: '#0b0f19',
    fontSize: 8,
    fontWeight: '800',
  },
  usernameText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    overflow: 'hidden',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendingList: {
    paddingLeft: 20,
    paddingRight: 4,
  },
  trendingCard: {
    width: width * 0.85,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
    backgroundColor: '#1f2937',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendingGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    backgroundColor: 'rgba(11, 15, 25, 0.95)',
    opacity: 0.8,
  },
  trendingInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  ratingText: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 11,
  },
  premiumBadge: {
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  premiumText: {
    color: '#0b0f19',
    fontWeight: '800',
    fontSize: 9,
  },
  trendingTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  trendingGenres: {
    color: '#9ca3af',
    fontSize: 12,
  },
  gridList: {
    paddingHorizontal: 12,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  animeGridItem: {
    width: '47%',
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
  },
  animeCover: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },
  gridPremiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  gridPremiumText: {
    color: '#0b0f19',
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 3,
  },
  animeItemInfo: {
    padding: 10,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  ratingLabel: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 11,
  },
  newAnimeList: {
    paddingLeft: 20,
    paddingRight: 4,
  },
  newAnimeCard: {
    width: 120,
    marginRight: 14,
  },
  newAnimeCover: {
    width: 120,
    height: 160,
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: '#1f2937',
  },
  newAnimePremiumBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  newAnimePremiumText: {
    color: '#0b0f19',
    fontSize: 8,
    fontWeight: '800',
  },
  newAnimeTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    lineHeight: 16,
  },
  newAnimeGenre: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 2,
  },
});
