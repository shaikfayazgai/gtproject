'use client'
import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  displayName: string | null
  onboardingComplete: boolean
  setAuth: (userId: string, displayName: string) => void
  setOnboardingComplete: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userId: null,
  displayName: null,
  onboardingComplete: false,
  setAuth: (userId, displayName) => set({ isAuthenticated: true, userId, displayName }),
  setOnboardingComplete: () => set({ onboardingComplete: true }),
  logout: () =>
    set({ isAuthenticated: false, userId: null, displayName: null, onboardingComplete: false }),
}))
