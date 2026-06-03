import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../services/api';


const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function ScheduleScreen({ navigation }: any) {
  const [selectedDay, setSelectedDay] = useState('Minggu');
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScheduleData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/anime');
      if (response && response.data && response.data.length > 0) {
        // Filter ongoing anime that have a release day
        setAnimeList(response.data.filter((anime: any) => anime.status === 'ONGOING'));
      } else {
        throw new Error('Empty data');
      }
    } catch (err) {
      console.warn('Failed to fetch schedule from API, using mock data');
      // Full matching mock data fallback
      const mockData = [
        {
          id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
          title: 'Demon Slayer: Hashira Training Arc',
          coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
          genre: ['Action', 'Fantasy', 'Shounen'],
          rating: 4.8,
          status: 'ONGOING',
          premium: true,
          releaseDay: 'Minggu',
        },
        {
          id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
          title: 'Solo Leveling',
          coverUrl: 'https://images.unsplash.com/photo-1580234810907-b40315b76418?w=500',
          genre: ['Action', 'Fantasy', 'Adventure'],
          rating: 4.8,
          status: 'ONGOING',
          premium: true,
          releaseDay: 'Sabtu',
        },
        {
          id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
          title: 'One Piece',
          coverUrl: 'https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=500',
          genre: ['Action', 'Adventure', 'Fantasy'],
          rating: 4.9,
          status: 'ONGOING',
          premium: false,
          releaseDay: 'Minggu',
        },
        {
          id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
          title: 'Oshi no Ko Season 2',
          coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500',
          genre: ['Drama', 'Supernatural', 'Mystery'],
          rating: 4.6,
          status: 'ONGOING',
          premium: true,
          releaseDay: 'Rabu',
        },
        {
          id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
          title: 'Kaiju No. 8',
          coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
          genre: ['Action', 'Sci-Fi', 'Shounen'],
          rating: 4.5,
          status: 'ONGOING',
          premium: false,
          releaseDay: 'Sabtu',
        },
        {
          id: 'a0b1c2d3-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
          title: 'Spy x Family Season 2',
          coverUrl: 'https://images.unsplash.com/photo-1614583225154-5fcdda07019e?w=500',
          genre: ['Comedy', 'Action', 'Slice of Life'],
          rating: 4.7,
          status: 'ONGOING',
          premium: false,
          releaseDay: 'Sabtu',
        },
        {
          id: 'b1c2d3e4-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
          title: 'Blue Lock',
          coverUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500',
          genre: ['Sports', 'Shounen', 'Drama'],
          rating: 4.5,
          status: 'ONGOING',
          premium: false,
          releaseDay: 'Sabtu',
        },
        {
          id: 'e4f5a6b7-8c9d-0e1f-2a3b-4c5d6e7f8a9b',
          title: 'Chainsaw Man',
          coverUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
          genre: ['Action', 'Horror', 'Supernatural'],
          rating: 4.7,
          status: 'ONGOING',
          premium: true,
          releaseDay: 'Selasa',
        },
        {
          id: 'a6b7c8d9-0e1f-2a3b-4c5d-6e7f8a9b0c1d',
          title: 'Dandadan',
          coverUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500',
          genre: ['Action', 'Supernatural', 'Comedy'],
          rating: 4.7,
          status: 'ONGOING',
          premium: false,
          releaseDay: 'Kamis',
        },
        {
          id: 'jjk-ongoing-id',
          title: 'Jujutsu Kaisen: Shinjuku Arc',
          coverUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500',
          genre: ['Action', 'Supernatural', 'Shounen'],
          rating: 4.8,
          status: 'ONGOING',
          premium: true,
          releaseDay: 'Kamis',
        },
        {
          id: 'mushoku-ongoing-id',
          title: 'Mushoku Tensei Season 3',
          coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
          genre: ['Fantasy', 'Isekai', 'Adventure'],
          rating: 4.6,
          status: 'ONGOING',
          premium: true,
          releaseDay: 'Senin',
        },
        {
          id: 'wind-ongoing-id',
          title: 'Wind Breaker Season 2',
          coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500',
          genre: ['Action', 'School', 'Delinquent'],
          rating: 4.4,
          status: 'ONGOING',
          premium: false,
          releaseDay: 'Jumat',
        },
      ];
      setAnimeList(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const filteredAnime = animeList.filter(
    (anime) => anime.releaseDay?.toLowerCase() === selectedDay.toLowerCase()
  );

  const renderAnimeCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.animeCard}
      onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.animeCover} />
      {item.premium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.animeTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.genres} numberOfLines={1}>
          {item.genre ? item.genre.join(', ') : ''}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
          </View>
          <View style={styles.timeBox}>
            <Ionicons name="time-outline" size={12} color="#9ca3af" />
            <Text style={styles.timeText}>Setiap {item.releaseDay}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jadwal Rilis</Text>
        <Text style={styles.headerSubtitle}>Pantau rilis episode terbaru anime ongoing favoritmu</Text>
      </View>

      {/* Days Selector */}
      <View style={styles.daysScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, isSelected && styles.dayButtonActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Anime List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : filteredAnime.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={48} color="#4b5563" />
          <Text style={styles.noAnimeText}>Tidak ada jadwal rilis hari {selectedDay}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAnime}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  daysScrollContainer: {
    marginBottom: 16,
  },
  daysScroll: {
    paddingHorizontal: 16,
  },
  dayButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#111827',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  dayButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  dayText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '700',
  },
  dayTextActive: {
    color: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  noAnimeText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  animeCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  animeCover: {
    width: 95,
    height: 120,
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    zIndex: 2,
  },
  premiumText: {
    color: '#0b0f19',
    fontSize: 8,
    fontWeight: '800',
  },
  cardInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  genres: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
});
