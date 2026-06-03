import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';

type AuthMode = 'login' | 'register';

export default function LoginScreen({ navigation }: any) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Silakan masukkan email Anda');
      return;
    }

    setIsLoading(true);
    try {
      // Login with existing account by email
      const response = await apiClient.post('/auth/login-email', { email });
      const { token, userId, username: resUsername, email: resEmail, photo } = response.data;
      login({ id: userId, username: resUsername, email: resEmail, photo }, token);
      Alert.alert('Sukses', `Selamat datang kembali, ${resUsername}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.';
      Alert.alert('Gagal Masuk', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !username) {
      Alert.alert('Error', 'Silakan masukkan email dan username');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        username,
        idToken: `user_${email.split('@')[0]}_${Date.now()}`,
      });

      const { token, userId, username: resUsername, email: resEmail, photo } = response.data;
      login({ id: userId, username: resUsername, email: resEmail, photo }, token);
      Alert.alert('Sukses', `Akun berhasil dibuat! Selamat datang, ${resUsername}!`);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Gagal Daftar', error.response?.data?.message || 'Terjadi kesalahan saat membuat akun.');
    } finally {
      setIsLoading(false);
    }
  };


  const isLoginMode = mode === 'login';

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.card}>
        {/* Logo */}
        <Text style={styles.logoText}>Vashty<Text style={styles.accentText}>Nime</Text></Text>
        <Text style={styles.subtitle}>Portal Streaming Anime Premium</Text>

        {/* Mode Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, isLoginMode && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, isLoginMode && styles.tabTextActive]}>Masuk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isLoginMode && styles.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, !isLoginMode && styles.tabTextActive]}>Daftar</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.modeDescription}>
          {isLoginMode
            ? 'Masuk dengan email akun Google yang sudah terdaftar'
            : 'Buat akun baru dengan email dan username'}
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ketik email Anda..."
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Username Input - only show for Register mode */}
        {!isLoginMode && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Ketik username Anda..."
              placeholderTextColor="#6b7280"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={isLoginMode ? handleLogin : handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLoginMode ? 'MASUK' : 'DAFTAR AKUN'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Switch Mode Hint */}
        <TouchableOpacity
          style={styles.switchModeButton}
          onPress={() => setMode(isLoginMode ? 'register' : 'login')}
        >
          <Text style={styles.switchModeText}>
            {isLoginMode
              ? 'Belum punya akun? Daftar di sini'
              : 'Sudah punya akun? Masuk di sini'}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  glowTop: {
    position: 'absolute',
    width: 250,
    height: 250,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderRadius: 125,
    top: '15%',
    left: '5%',
  },
  glowBottom: {
    position: 'absolute',
    width: 180,
    height: 180,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 90,
    bottom: '10%',
    right: '5%',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  accentText: {
    color: '#6366f1',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 6,
    marginBottom: 24,
  },

  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#ffffff',
  },

  // Mode description
  modeDescription: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 8,
  },

  // Input styles
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    backgroundColor: '#1f2937',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#374151',
  },

  // Submit button
  submitButton: {
    width: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Switch mode
  switchModeButton: {
    marginTop: 16,
    padding: 4,
  },
  switchModeText: {
    color: '#6366f1',
    fontSize: 13,
    fontWeight: '600',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 18,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    color: '#4b5563',
    fontSize: 12,
    marginHorizontal: 12,
  },

  // Bypass button
  bypassButton: {
    padding: 8,
  },
  bypassText: {
    color: '#4b5563',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
