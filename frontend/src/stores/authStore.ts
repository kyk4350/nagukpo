import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData } from '@/types'
import * as authApi from '@/lib/api/auth'
import { getTokens } from '@/lib/api/client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  _hasHydrated: boolean

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  clearError: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const result = await authApi.login(credentials)
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const result = await authApi.register(data)
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      logout: async () => {
        const tokens = getTokens()
        if (tokens?.refreshToken) {
          try {
            await authApi.logout(tokens.refreshToken)
          } catch (error) {
            console.error('Logout error:', error)
          }
        }
        set({
          user: null,
          isAuthenticated: false,
          error: null
        })
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null })
        try {
          const user = await authApi.getCurrentUser()
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '사용자 정보를 가져오는데 실패했습니다'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null
          })
          throw error
        }
      },

      clearError: () => {
        set({ error: null })
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
