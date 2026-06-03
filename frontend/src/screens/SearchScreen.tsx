import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import apiClient from '../services/api';

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get(`/anime/search?q=${text}`);
      if (response && response.data) {
        setResults(response.data);
      }
    } catch (err) {
      console.warn('Gagal memuat hasil pencarian dari server, menggunakan filter mockup');
      
      const mockAnimeList = [
        {
          id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
          title: 'Frieren: Beyond Journey\'s End',
          description: 'Mage Frieren dan perjalanannya mencari arti kehidupan setelah mengalahkan Raja Iblis.',
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
          description: 'Tanjiro pergi menemui Hashira Batu, Himejima, untuk bersiap menghadapi pertempuran.',
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
          description: 'Kisah masa lalu Gojo Satoru dan Geto Suguru di SMA Jujutsu, dilanjutkan dengan insiden Shibuya.',
          coverUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500',
          bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
          genre: ['Action', 'Supernatural', 'Shounen'],
          rating: 4.7,
          status: 'COMPLETED',
          isBookmarked: false,
        }
      ];

      const filtered = mockAnimeList.filter(anime => 
        anime.title.toLowerCase().includes(text.toLowerCase()) || 
        anime.genre.some(g => g.toLowerCase().includes(text.toLowerCase()))
      );
      setResults(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id })}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.coverImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.genreText} numberOfLines={1}>
          {item.genre ? item.genre.join(', ') : ''}
        </Text>
        <View style={styles.row}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Search Bar */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari judul anime atau genre..."
          placeholderTextColor="#6b7280"
          value={query}
          onChangeText={handleSearch}
          autoFocus={true}
          clearButtonMode="while-editing"
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : query.trim() && results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>Tidak ada hasil untuk "{query}"</Text>
          <Text style={styles.noResultsSubtitle}>Coba kata kunci lain atau periksa ejaan Anda.</Text>
        </View>
      ) : !query.trim() ? (
        <View style={styles.centerContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.hintTitle}>Temukan Anime Favorit</Text>
          <Text style={styles.hintSubtitle}>Ketik judul anime, genre, atau kategori pencarian Anda di atas.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultItem}
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
  searchHeader: {
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
  searchInput: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#374151',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
  },
  searchIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  hintTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  hintSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  listContainer: {
    padding: 20,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  coverImage: {
    width: 50,
    height: 70,
    borderRadius: 6,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  genreText: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 11,
  },
  dot: {
    color: '#4b5563',
    marginHorizontal: 8,
  },
  statusText: {
    color: '#9ca3af',
    fontSize: 11,
  },
});
