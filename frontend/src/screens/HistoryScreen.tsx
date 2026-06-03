import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';


export default function HistoryScreen({ navigation }: any) {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/history');
      if (response && response.data && response.data.length > 0) {
        setHistoryList(response.data);
      } else {
        throw new Error('Empty data');
      }
    } catch (err) {
      console.warn('Failed to fetch watch history, using mock data');
      // Mock history fallback
      const mockHistory = [
        {
          id: 'h1',
          episodeId: 'ep1',
          episodeNumber: 1,
          animeId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
          animeTitle: "Frieren: Beyond Journey's End",
          thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
          progress: 320,
          duration: 596,
          updatedAt: '2026-06-03T20:30:00Z',
          animePremium: false,
        },
        {
          id: 'h2',
          episodeId: 'ep2',
          episodeNumber: 2,
          animeId: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
          animeTitle: 'Demon Slayer: Hashira Training Arc',
          thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
          progress: 100,
          duration: 600,
          updatedAt: '2026-06-02T18:15:00Z',
          animePremium: true,
        },
        {
          id: 'h3',
          episodeId: 'ep3',
          episodeNumber: 5,
          animeId: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
          animeTitle: 'One Piece',
          thumbnail: 'https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=500',
          progress: 580,
          duration: 600,
          updatedAt: '2026-06-03T15:00:00Z',
          animePremium: false,
        },
        {
          id: 'h4',
          episodeId: 'ep4',
          episodeNumber: 3,
          animeId: 'e4f5a6b7-8c9d-0e1f-2a3b-4c5d6e7f8a9b',
          animeTitle: 'Chainsaw Man',
          thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
          progress: 200,
          duration: 600,
          updatedAt: '2026-06-01T10:00:00Z',
          animePremium: true,
        },
        {
          id: 'h5',
          episodeId: 'ep5',
          episodeNumber: 1,
          animeId: 'a6b7c8d9-0e1f-2a3b-4c5d-6e7f8a9b0c1d',
          animeTitle: 'Dandadan',
          thumbnail: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500',
          progress: 450,
          duration: 600,
          updatedAt: '2026-06-03T12:00:00Z',
          animePremium: false,
        },
        {
          id: 'h6',
          episodeId: 'ep6',
          episodeNumber: 8,
          animeId: 'b7c8d9e0-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
          animeTitle: 'Kaguya-sama: Love is War',
          thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500',
          progress: 600,
          duration: 600,
          updatedAt: '2026-05-31T20:00:00Z',
          animePremium: false,
        },
        {
          id: 'h7',
          episodeId: 'ep7',
          episodeNumber: 12,
          animeId: 'a0b1c2d3-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
          animeTitle: 'Spy x Family Season 2',
          thumbnail: 'https://images.unsplash.com/photo-1614583225154-5fcdda07019e?w=500',
          progress: 50,
          duration: 600,
          updatedAt: '2026-06-02T09:00:00Z',
          animePremium: false,
        },
      ];
      setHistoryList(mockHistory);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistoryData();
    });
    return unsubscribe;
  }, [navigation]);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Hari ini';
      } else if (diffDays === 1) {
        return 'Kemarin';
      } else {
        return `${diffDays} hari yang lalu`;
      }
    } catch (e) {
      return '';
    }
  };

  const handlePlayPress = (item: any, isLocked: boolean) => {
    if (isLocked) {
      Alert.alert(
        'Konten Premium 🌟',
        'Anime ini hanya dapat ditonton oleh member Premium. Silakan aktifkan Premium Anda di halaman Profil terlebih dahulu.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Ke Profil', onPress: () => navigation.navigate('Profile') }
        ]
      );
      return;
    }

    navigation.navigate('VideoPlayer', {
      episodeId: item.episodeId,
      animeId: item.animeId,
      episodeNumber: item.episodeNumber,
      videoUrl: item.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      resumePosition: item.progress,
      episodeTitle: `${item.animeTitle} - Episode ${item.episodeNumber}`,
    });
  };

  const renderHistoryItem = ({ item }: { item: any }) => {
    const progressPercent = Math.min(Math.round((item.progress / item.duration) * 100), 100);
    const isCompleted = progressPercent >= 95;
    const isLocked = item.animePremium && !user?.premium;

    return (
      <TouchableOpacity
        style={[styles.card, isLocked && styles.cardLocked]}
        onPress={() => handlePlayPress(item, isLocked)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={24} color="#f59e0b" />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={[styles.animeTitle, isLocked && styles.animeTitleLocked]} numberOfLines={1}>
            {item.animeTitle} {isLocked && '🔑'}
          </Text>
          <Text style={styles.episodeText}>
            Episode {item.episodeNumber} {isCompleted && '• Selesai ditonton'}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>

          <View style={styles.footer}>
            <Ionicons name="calendar-outline" size={12} color="#6b7280" />
            <Text style={styles.timeText}>{formatTime(item.updatedAt)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.playButton, isLocked && styles.playButtonLocked]}
          onPress={() => handlePlayPress(item, isLocked)}
        >
          <Ionicons name={isLocked ? "lock-closed" : "play"} size={16} color="#ffffff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Tontonan</Text>
        <Text style={styles.headerSubtitle}>Lanjutkan menonton anime yang tertunda</Text>
      </View>

      {/* History List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : historyList.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={48} color="#4b5563" />
          <Text style={styles.noHistoryText}>Kamu belum menonton anime apa pun</Text>
        </View>
      ) : (
        <FlatList
          data={historyList}
          renderItem={renderHistoryItem}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  noHistoryText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    paddingRight: 12,
    position: 'relative',
  },
  cardLocked: {
    borderColor: 'rgba(245, 158, 11, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  thumbnail: {
    width: 95,
    height: 110,
    resizeMode: 'cover',
  },
  lockOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 95,
    height: 110,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  animeTitleLocked: {
    color: '#9ca3af',
  },
  episodeText: {
    color: '#9ca3af',
    fontSize: 11,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  progressPercent: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#6b7280',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '600',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  playButtonLocked: {
    backgroundColor: '#f59e0b',
  },
});
