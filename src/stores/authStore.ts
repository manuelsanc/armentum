/**
 * Authentication Store
 * Global state management for authentication using Zustand
 */

import { create } from "zustand";
import { login, logout, getCurrentUser } from "../services/auth";

export interface AuthUser {
  email: string;
  userType: "corista" | "admin";
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: "corista" | "admin") => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string, userType: "corista" | "admin") => {
    set({ isLoading: true, error: null });

    const result = await login(email, password, userType);

    if (result.error) {
      set({ isLoading: false, error: result.error.message });
      return false;
    }

    set({
      user: {
        email,
        userType,
      },
      isLoading: false,
      error: null,
    });

    return true;
  },

  logout: () => {
    logout();
    set({ user: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  hydrate: () => {
    const user = getCurrentUser();
    set({ user });
  },
}));
