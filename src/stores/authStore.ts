import { create } from "zustand";
import type { User } from "../types";
import * as authService from "../services/auth";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  login: (email: string, password: string, userType?: "corista" | "admin") => Promise<boolean>;
  register: (email: string, password: string, nombre?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hydrate: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (email: string, password: string, userType?: "corista" | "admin") => {
    set({ isLoading: true, error: null });

    const result = await authService.login(email, password, userType);

    if (result.error) {
      set({ isLoading: false, error: result.error.message });
      return false;
    }

    if (result.data) {
      set({
        user: result.data.user,
        isLoading: false,
        error: null,
      });
      return true;
    }

    set({ isLoading: false, error: "Unknown error occurred" });
    return false;
  },

  register: async (email: string, password: string, nombre?: string) => {
    set({ isLoading: true, error: null });

    const result = await authService.register(email, password, nombre);

    if (result.error) {
      set({ isLoading: false, error: result.error.message });
      return false;
    }

    if (result.data) {
      set({
        user: result.data.user,
        isLoading: false,
        error: null,
      });
      return true;
    }

    set({ isLoading: false, error: "Unknown error occurred" });
    return false;
  },

  logout: () => {
    authService.logout();
    set({ user: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  hydrate: async () => {
    set({ isInitializing: true });
    
    const storedUser = authService.getStoredUser();
    const isAuth = authService.isAuthenticated();

    if (storedUser && isAuth) {
      set({ user: storedUser, isInitializing: false });
      return;
    }

    if (isAuth) {
      const result = await authService.getCurrentUser();
      if (result.data) {
        set({ user: result.data, isInitializing: false });
      } else {
        set({ user: null, isInitializing: false });
      }
    } else {
      set({ user: null, isInitializing: false });
    }
  },

  refreshUser: async () => {
    const result = await authService.getCurrentUser();
    if (result.data) {
      set({ user: result.data });
      return true;
    }
    return false;
  },

  checkAuth: () => {
    return authService.isAuthenticated();
  },
}));
