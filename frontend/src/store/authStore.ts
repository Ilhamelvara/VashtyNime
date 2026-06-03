import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  photo?: string;
  premium?: boolean;
  level?: number;
  xp?: number;
  keysCount?: number;
  lastKeyRegenTime?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: any): AuthState => ({
      user: null as UserProfile | null,
      token: null as string | null,
      isAuthenticated: false,
      login: (user: UserProfile, token: string) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updatedUser: Partial<UserProfile>) => set((state: any) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null
      })),
    }),
    {
      name: 'vashtynime-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
