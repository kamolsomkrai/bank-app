// src/store/authStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  hydrated: boolean; // รอให้โหลดค่าจาก localStorage เสร็จก่อน
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: false,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);
