import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VideoPlayer from 'react-native-video';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../services/api';

export default function VideoPlayerScreen({ route, navigation }: any) {
  const { episodeId, videoUrl, episodeTitle, resumePosition = 0 } = route.params;

  const videoRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(resumePosition);
  const [isLoading, setIsLoading] = useState(true);

  // Sync playback progress back to Spring Boot History database every 10 seconds
  useEffect(() => {
    if (currentTime <= 0) return;

    const syncInterval = setInterval(() => {
      apiClient.post('/history', {
        episodeId,
        progress: Math.floor(currentTime)
      }).catch((err: any) => console.warn('Failed to sync history progress:', err));
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [currentTime, episodeId]);

  const handleProgress = (data: { currentTime: number }) => {
    setCurrentTime(data.currentTime);
  };

  const handleLoad = () => {
    setIsLoading(false);
    // Seek to previous watch progress if any
    if (resumePosition > 0 && videoRef.current) {
      videoRef.current.seek(resumePosition);
    }
  };

  const handleBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setIsLoading(isBuffering);
  };

  const handleError = (error: any) => {
    console.warn('Video playback error:', error);
    setIsLoading(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{episodeTitle}</Text>
      </View>
      
      {isLoading && (
        <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
      )}

      <VideoPlayer
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.videoPlayer}
        resizeMode="contain"
        paused={!isPlaying}
        controls={true}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onBuffer={handleBuffer}
        onError={handleError}
      />

      <View style={styles.controlsBar}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={togglePlayback}
        >
          <Text style={styles.buttonText}>{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          Waktu: {Math.floor(currentTime / 60)}m {Math.floor(currentTime % 60)}s
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    color: '#f3f4f6',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  videoPlayer: {
    width: '100%',
    height: 240,
    backgroundColor: '#1f2937',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  playButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  progressText: {
    color: '#9ca3af',
    fontSize: 14,
  },
});
