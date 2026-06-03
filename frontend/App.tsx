import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from './src/store/authStore';
import apiClient from './src/services/api';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AnimeDetailScreen from './src/screens/AnimeDetailScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import BookmarkScreen from './src/screens/BookmarkScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import HistoryScreen from './src/screens/HistoryScreen';

import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncProfile = async () => {
      if (isAuthenticated && token) {
        setIsSyncing(true);
        try {
          const response = await apiClient.get('/auth/me');
          updateUser(response.data);
        } catch (err: any) {
          console.warn('Gagal sinkronisasi data profil pada startup', err);
          if (err.response?.status === 401) {
            logout();
          }
        } finally {
          setIsSyncing(false);
        }
      }
    };
    
    syncProfile();
  }, [isAuthenticated, token]);

  if (isSyncing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0f19', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#0b0f19" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0b0f19' },
        }}
      >
        {!isAuthenticated ? (
          // Auth stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // App stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="AnimeDetail" component={AnimeDetailScreen} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
            <Stack.Screen name="Bookmark" component={BookmarkScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

