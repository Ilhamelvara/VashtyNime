import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';


const PREDEFINED_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // Avatar 1
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', // Avatar 2
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', // Avatar 3
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', // Avatar 4
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', // Avatar 5
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', // Avatar 6
];

export default function ProfileScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photo || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      updateUser(response.data);
    } catch (err) {
      console.warn('Gagal memuat profil terbaru', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  useEffect(() => {
    if (!user || user.premium || (user.keysCount !== undefined && user.keysCount >= 10) || !user.lastKeyRegenTime) {
      setSecondsRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const regenTime = new Date(user.lastKeyRegenTime!).getTime();
      const now = new Date().getTime();
      const elapsedSeconds = Math.max(0, (now - regenTime) / 1000);
      const remaining = 60 - (Math.floor(elapsedSeconds) % 60);

      if (remaining === 60) {
        fetchProfile();
      }

      setSecondsRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.keysCount, user?.lastKeyRegenTime, user?.premium]);

  const formatCountdown = (sec: number | null) => {
    if (sec === null) return '';
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `+2 🔑 dalam ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditUsername(user?.username || '');
    setEditEmail(user?.email || '');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!editUsername.trim()) {
      Alert.alert('Error', 'Username tidak boleh kosong');
      return;
    }

    setIsUpdating(true);
    try {
      await apiClient.put('/auth/profile', {
        username: editUsername.trim(),
        email: editEmail.trim(),
        photo: user?.photo,
      });

      updateUser({
        username: editUsername.trim(),
        email: editEmail.trim(),
      });

      setShowEditModal(false);
      Alert.alert('Sukses', 'Profil berhasil diperbarui!');
    } catch (err) {
      console.warn('Backend PUT failed, updating local state only');
      updateUser({
        username: editUsername.trim(),
        email: editEmail.trim(),
      });
      setShowEditModal(false);
      Alert.alert('Profil Diperbarui', 'Profil berhasil diperbarui secara lokal.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setIsUpdating(true);
    try {
      await apiClient.put('/auth/profile', {
        username: user?.username,
        email: user?.email,
        photo: avatarUrl,
      });

      updateUser({ photo: avatarUrl });
      setShowAvatarModal(false);
      Alert.alert('Sukses', 'Foto profil berhasil diperbarui!');
    } catch (err) {
      console.warn('Backend PUT failed, updating photo locally');
      updateUser({ photo: avatarUrl });
      setShowAvatarModal(false);
      Alert.alert('Foto Profil Diperbarui', 'Foto profil diperbarui secara lokal.');
    } finally {
      setIsUpdating(false);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // We'll save the base64 string directly for prototype
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      try {
        await apiClient.put('/auth/profile', {
          ...user,
          photo: base64Image
        });
        updateUser({ photo: base64Image } as any);
        setShowAvatarModal(false);
      } catch (error) {
        console.warn('Failed to upload custom avatar:', error);
        // Save locally anyway for prototype purpose if backend fails
        updateUser({ photo: base64Image } as any);
        setShowAvatarModal(false);
      }
    }
  };

  const handleUpgradePremium = async () => {
    setIsUpgrading(true);
    try {
      await apiClient.post('/auth/premium');
      updateUser({ premium: true });
      Alert.alert('🎉 Selamat!', 'Akun Anda sekarang telah aktif menjadi member PREMIUM! Selamat menikmati akses streaming tanpa batas.');
    } catch (err) {
      console.warn('Backend POST premium failed, updating premium status locally');
      updateUser({ premium: true });
      Alert.alert('🎉 Selamat!', 'Akun Anda sekarang telah aktif menjadi member PREMIUM! (Simulasi lokal)');
    } finally {
      setIsUpgrading(false);
    }
  };

  const menuItems = [
    {
      icon: 'pencil-sharp',
      color: '#6366f1',
      title: 'Edit Profil',
      subtitle: 'Ubah username dan email',
      onPress: handleEditProfile,
    },
    {
      icon: 'bookmark-sharp',
      color: '#ec4899',
      title: 'Bookmark Saya',
      subtitle: 'Lihat anime yang disimpan',
      onPress: () => navigation.navigate('Bookmark'),
    },
    {
      icon: 'image-sharp',
      color: '#10b981',
      title: 'Ganti Foto Profil',
      subtitle: 'Pilih avatar premium favoritmu',
      onPress: () => {
        setSelectedAvatar(user?.photo || '');
        setShowAvatarModal(true);
      },
    },
  ];

  return (
    <View style={styles.mainWrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Saya</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.glowCircle} />

          {/* Avatar container */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setShowAvatarModal(true)}
            activeOpacity={0.9}
          >
            {user?.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.editAvatarIconContainer}>
              <Ionicons name="camera" size={14} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Display Name & Email */}
          <Text style={styles.displayName}>{user?.username || 'Guest'}</Text>
          <Text style={styles.emailText}>{user?.email || 'Tidak ada email'}</Text>

          {/* Premium / Free Status Badge */}
          {user?.premium ? (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={14} color="#0b0f19" />
              <Text style={styles.premiumBadgeText}>MEMBER PREMIUM</Text>
            </View>
          ) : (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>GUEST MEMBER</Text>
            </View>
          )}

          {/* Level & XP Info */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {user?.level || 1}</Text>
            <View style={styles.xpBarBackground}>
              <View style={[styles.xpBarFill, { width: `${user?.xp || 0}%` }]} />
            </View>
            <Text style={styles.xpText}>{user?.xp || 0} / 100 XP</Text>
          </View>

          {/* Keys balance */}
          <View style={styles.keysBalanceRow}>
            <Ionicons name="key" size={16} color="#f59e0b" style={{ marginRight: 6 }} />
            <Text style={styles.keysBalanceText}>
              Kunci: {user?.premium ? 'Unlimited ♾️' : `${user?.keysCount ?? 10} / 10 🔑`}
            </Text>
          </View>
          {secondsRemaining !== null && (
            <Text style={styles.cooldownText}>{formatCountdown(secondsRemaining)}</Text>
          )}

          {/* User ID Badge */}
          <View style={styles.idBadge}>
            <Text style={styles.idLabel}>ID PENGGUNA</Text>
            <Text style={styles.idValue} numberOfLines={1}>
              {user?.id || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Premium Upgrade Section */}
        {!user?.premium && (
          <View style={styles.premiumBannerCard}>
            <View style={styles.premiumCardContent}>
              <Text style={styles.premiumBannerTitle}>🚀 Upgrade ke Premium</Text>
              <Text style={styles.premiumBannerDesc}>
                Akses semua episode ongoing terbaru, nonton kualitas ultra HD, bebas iklan, dan jadilah wibu sejati!
              </Text>
              <TouchableOpacity
                style={styles.premiumButton}
                onPress={handleUpgradePremium}
                disabled={isUpgrading}
                activeOpacity={0.8}
              >
                {isUpgrading ? (
                  <ActivityIndicator size="small" color="#0b0f19" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={16} color="#0b0f19" style={{ marginRight: 6 }} />
                    <Text style={styles.premiumButtonText}>Aktifkan Premium - Rp 0</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Pengaturan Akun</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#4b5563" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>
            Vashty<Text style={styles.appNameAccent}>Nime</Text>
          </Text>
          <Text style={styles.appVersion}>Versi 1.1.0 (Premium Update)</Text>
          <Text style={styles.appCopyright}>© 2026 VashtyNime. All rights reserved.</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profil</Text>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Username</Text>
              <TextInput
                style={styles.modalInput}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="Masukkan username..."
                placeholderTextColor="#6b7280"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Email</Text>
              <TextInput
                style={styles.modalInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Masukkan email..."
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEditModal(false)}
                disabled={isUpdating}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalSaveText}>Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Pilih Foto Profil</Text>
            <Text style={styles.modalSubtitle}>Pilih salah satu karakter anime favoritmu:</Text>

            <View style={styles.avatarGrid}>
              {PREDEFINED_AVATARS.map((avatar, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.avatarGridItem,
                    selectedAvatar === avatar && styles.avatarGridItemActive,
                  ]}
                  onPress={() => handleAvatarSelect(avatar)}
                >
                  <Image source={{ uri: avatar }} style={styles.avatarGridImage} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customAvatarContainer}>
              <TouchableOpacity style={styles.customAvatarButton} onPress={pickImageAsync}>
                <Ionicons name="images-outline" size={24} color="#ffffff" />
                <Text style={styles.customAvatarText}>Pilih dari Galeri</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.avatarCloseButton}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.avatarCloseText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  profileCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    overflow: 'hidden',
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 100,
    top: -60,
    alignSelf: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  avatarPlaceholderText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
  },
  editAvatarIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111827',
  },
  displayName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  emailText: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 16,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  premiumBadgeText: {
    color: '#0b0f19',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  freeBadge: {
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  freeBadgeText: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  levelContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  xpBarBackground: {
    width: '80%',
    height: 8,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  xpText: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
  },
  keysBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  keysBalanceText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  cooldownText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 12,
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
  },
  idLabel: {
    color: '#6b7280',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  idValue: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  premiumBannerCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: '#1e1b4b',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    overflow: 'hidden',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  premiumCardContent: {
    padding: 20,
  },
  premiumBannerTitle: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  premiumBannerDesc: {
    color: '#c7d2fe',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#0b0f19',
    fontSize: 14,
    fontWeight: '800',
  },
  menuSection: {
    marginTop: 28,
    marginHorizontal: 20,
  },
  menuSectionTitle: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  menuIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  menuSubtitle: {
    color: '#6b7280',
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  appName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appNameAccent: {
    color: '#6366f1',
  },
  appVersion: {
    color: '#4b5563',
    fontSize: 12,
    marginTop: 4,
  },
  appCopyright: {
    color: '#374151',
    fontSize: 10,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInputContainer: {
    marginBottom: 18,
  },
  modalLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCancelText: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: 15,
  },
  modalSaveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
  },
  modalSaveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarGridItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatarGridItemActive: {
    borderColor: '#6366f1',
  },
  avatarGridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarCloseButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1f2937',
  },
  avatarCloseText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  customAvatarContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  customAvatarButton: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  customAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
});
