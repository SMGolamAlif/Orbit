import type { Models } from 'appwrite'
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../services/appwrite'
import { profileService } from '../services/profile'
import type { UserProfile } from '../types/profile'

interface AuthContextValue {
  user: Models.User<Models.Preferences> | null
  profile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const nextProfile = await profileService.getProfile(userId)
      setProfile(nextProfile)
    } catch (error) {
      console.error('Failed to load profile.', error)
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      try {
        const currentUser = await authService.getCurrentUser()
        if (!mounted) return
        setUser(currentUser)
        await loadProfile(currentUser.$id)
      } catch {
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    bootstrap()

    return () => {
      mounted = false
    }
  }, [loadProfile])

  async function login(email: string, password: string) {
    await authService.login(email, password)
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    await loadProfile(currentUser.$id)
  }

  async function register(name: string, email: string, password: string) {
    await authService.register(email, password, name)
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    await loadProfile(currentUser.$id)
  }

  async function logout() {
    await authService.logout()
    setUser(null)
    setProfile(null)
  }

  async function refreshProfile() {
    if (user) {
      await loadProfile(user.$id)
    }
  }

  async function refreshUser() {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, profile, loading, login, register, logout, refreshProfile, refreshUser }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
