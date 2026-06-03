import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import apiClient from '../services/api';

export default function BookmarkScreen({ navigation }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/bookmark');
      if (response && response.data) {
        setBookmarks(response.data);
      }
    } catch (err) {
      console.warn('Gagal memuat bookmark dari server, menggunakan mockup');
      // Mock data bookmarks
      setBookmarks([
        {
          id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
          title: 'Demon Slayer: Hashira Training Arc',
          description: 'Tanjiro pergi menemui Hashira Batu, Himejima, untuk bersiap menghadapi pertempuran yang akan datang.',
          coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
          bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000',
          genre: ['Action', 'Fantasy', 'Shounen'],
          rating: 4.8,
          status: 'ONGOING',
          isBookmarked: true,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookmarks();
    });
    return unsubscribe;
  }, [navigation]);

  const renderBookmarkItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.bookmarkCard}
      onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id })}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.coverImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.genreText} numberOfLines={1}>
          {item.genre ? item.genre.join(', ') : ''}
        </Text>
        <View style={styles.row}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'ONGOING' ? '#10b981' : '#4b5563' }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.arrowIcon}>➔</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmark Saya</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={styles.emptyTitle}>Bookmark Kosong</Text>
          <Text style={styles.emptySubtitle}>
            Belum ada anime yang Anda simpan. Cari anime favorit Anda dan tambahkan ke bookmark!
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>JELAJAHI ANIME</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  listContainer: {
    padding: 20,
  },
  bookmarkCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  coverImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  genreText: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  ratingText: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 10,
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
  arrowIcon: {
    color: '#6366f1',
    fontSize: 18,
    paddingLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  browseButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
