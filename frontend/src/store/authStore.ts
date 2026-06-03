import { create } from 'zustand';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  photo?: string;
  premium?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user: UserProfile, token: string) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  updateUser: (updatedUser: Partial<UserProfile>) => set((state: any) => ({
    user: state.user ? { ...state.user, ...updatedUser } : null
  })),
}));
