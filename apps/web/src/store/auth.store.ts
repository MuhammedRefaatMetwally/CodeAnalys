import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; max-age=0';
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'auth-storage' },
  ),
);