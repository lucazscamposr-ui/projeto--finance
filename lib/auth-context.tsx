'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type AuthUser = {
  name: string
  email: string
  avatarUrl?: string
  initials: string
}

export type ThemeSettings = {
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  cardColor?: string
  wallpaperUrl?: string
  glassmorphism?: boolean
}

type AuthContextType = {
  currentUser: AuthUser | null
  loading: boolean
  login: (email: string, password: string, keepConnected: boolean) => Promise<{ success: boolean; message: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  sendPasswordRecovery: (email: string) => Promise<{ success: boolean; message: string }>
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  updateProfile: (data: Partial<AuthUser>) => void
  theme: ThemeSettings
  updateTheme: (data: ThemeSettings) => void
  resetTheme: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_STORAGE_KEY = 'finance_ai_users'
const SESSION_STORAGE_KEY = 'finance_ai_session'
const THEME_STORAGE_PREFIX = 'finance_ai_theme_'

// Helper to hash password using SHA-256 via Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<ThemeSettings>({})

  // Initialize DB and verify session
  useEffect(() => {
    async function initAuth() {
      try {
        // 1. Set default user in localStorage if no database exists
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
        if (!storedUsers) {
          const defaultHashedPassword = await hashPassword('Senha123!')
          const defaultUsers = [
            {
              name: 'Gustavo Silva',
              email: 'gustavo@financeai.app',
              passwordHash: defaultHashedPassword,
              avatarUrl: '',
            },
          ]
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers))
        }

        // 2. Validate current session
        const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY)
        if (sessionStr) {
          const session = JSON.parse(sessionStr)
          const now = Date.now()
          if (session.user && session.expiresAt > now) {
            setCurrentUser(session.user)
            loadUserTheme(session.user.email)
          } else {
            // Session expired or invalid
            localStorage.removeItem(SESSION_STORAGE_KEY)
          }
        }
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Sync theme changes with DOM
  useEffect(() => {
    if (currentUser) {
      applyThemeStyles(theme)
    } else {
      clearThemeStyles()
    }
  }, [theme, currentUser])

  function loadUserTheme(email: string) {
    try {
      const savedTheme = localStorage.getItem(`${THEME_STORAGE_PREFIX}${email}`)
      if (savedTheme) {
        setTheme(JSON.parse(savedTheme))
      } else {
        setTheme({})
      }
    } catch (e) {
      console.error('Erro ao carregar tema do usuário:', e)
    }
  }

  function applyThemeStyles(settings: ThemeSettings) {
    const root = document.documentElement
    
    if (settings.primaryColor) {
      root.style.setProperty('--primary', settings.primaryColor)
      root.style.setProperty('--ring', settings.primaryColor)
      root.style.setProperty('--sidebar-primary', settings.primaryColor)
    } else {
      root.style.removeProperty('--primary')
      root.style.removeProperty('--ring')
      root.style.removeProperty('--sidebar-primary')
    }

    if (settings.backgroundColor) {
      root.style.setProperty('--background', settings.backgroundColor)
    } else {
      root.style.removeProperty('--background')
    }

    if (settings.textColor) {
      root.style.setProperty('--foreground', settings.textColor)
      root.style.setProperty('--sidebar-foreground', settings.textColor)
    } else {
      root.style.removeProperty('--foreground')
      root.style.removeProperty('--sidebar-foreground')
    }

    if (settings.wallpaperUrl) {
      root.style.setProperty('--wallpaper-url', `url(${settings.wallpaperUrl})`)
      // If glassmorphism is active, adjust card transparency, otherwise use cardColor or default
      if (settings.glassmorphism) {
        root.style.setProperty('--card', 'rgba(21, 27, 38, 0.65)')
        root.style.setProperty('--sidebar', 'rgba(15, 20, 30, 0.75)')
        root.style.setProperty('--popover', 'rgba(21, 27, 38, 0.8)')
        root.style.setProperty('backdrop-filter', 'blur(16px)')
      } else {
        const bg = settings.cardColor || 'rgba(33, 38, 48, 0.92)'
        root.style.setProperty('--card', bg)
        root.style.setProperty('--sidebar', bg)
        root.style.removeProperty('backdrop-filter')
      }
    } else {
      root.style.removeProperty('--wallpaper-url')
      root.style.removeProperty('backdrop-filter')
      if (settings.cardColor) {
        root.style.setProperty('--card', settings.cardColor)
        root.style.setProperty('--sidebar', settings.cardColor)
      } else {
        root.style.removeProperty('--card')
        root.style.removeProperty('--sidebar')
      }
    }
  }

  function clearThemeStyles() {
    const root = document.documentElement
    root.style.removeProperty('--primary')
    root.style.removeProperty('--ring')
    root.style.removeProperty('--sidebar-primary')
    root.style.removeProperty('--background')
    root.style.removeProperty('--foreground')
    root.style.removeProperty('--sidebar-foreground')
    root.style.removeProperty('--wallpaper-url')
    root.style.removeProperty('--card')
    root.style.removeProperty('--sidebar')
    root.style.removeProperty('--popover')
    root.style.removeProperty('backdrop-filter')
  }

  const updateTheme = (newSettings: ThemeSettings) => {
    if (!currentUser) return
    const updatedTheme = { ...theme, ...newSettings }
    setTheme(updatedTheme)
    localStorage.setItem(`${THEME_STORAGE_PREFIX}${currentUser.email}`, JSON.stringify(updatedTheme))
  }

  const resetTheme = () => {
    if (!currentUser) return
    setTheme({})
    localStorage.removeItem(`${THEME_STORAGE_PREFIX}${currentUser.email}`)
    clearThemeStyles()
  }

  // Get list of registered users
  function getUsers(): any[] {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Generate initial initials from name
  function getInitials(name: string): string {
    const parts = name.trim().split(' ')
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }

  // Actions
  const login = async (email: string, password: string, keepConnected: boolean) => {
    // Simular latência de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return { success: false, message: 'Usuário não cadastrado.' }
    }

    const hashed = await hashPassword(password)
    if (user.passwordHash !== hashed) {
      return { success: false, message: 'Senha incorreta.' }
    }

    const authUser: AuthUser = {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || '',
      initials: getInitials(user.name),
    }

    // Guardar sessão
    const duration = keepConnected ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 dias vs 1 dia
    const expiresAt = Date.now() + duration

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        user: authUser,
        expiresAt,
      })
    )

    setCurrentUser(authUser)
    loadUserTheme(authUser.email)
    return { success: true, message: 'Login efetuado com sucesso.' }
  }

  const signup = async (name: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const users = getUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Este e-mail já está sendo utilizado.' }
    }

    const hashed = await hashPassword(password)
    const newUser = {
      name,
      email,
      passwordHash: hashed,
      avatarUrl: '',
    }

    users.push(newUser)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

    // Fazer login automático
    const authUser: AuthUser = {
      name: newUser.name,
      email: newUser.email,
      avatarUrl: '',
      initials: getInitials(newUser.name),
    }

    const duration = 24 * 60 * 60 * 1000 // 1 dia por padrão
    const expiresAt = Date.now() + duration

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        user: authUser,
        expiresAt,
      })
    )

    setCurrentUser(authUser)
    loadUserTheme(authUser.email)
    return { success: true, message: 'Conta criada e conectada com sucesso.' }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setCurrentUser(null)
    clearThemeStyles()
    setTheme({})
  }

  const sendPasswordRecovery = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const users = getUsers()
    const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!userExists) {
      return { success: false, message: 'E-mail não cadastrado em nossa base.' }
    }
    return { success: true, message: 'Link de recuperação enviado para o e-mail informado.' }
  }

  const resetPassword = async (email: string, newPassword: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) {
      return { success: false, message: 'E-mail não encontrado.' }
    }

    const hashed = await hashPassword(newPassword)
    users[userIndex].passwordHash = hashed
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

    return { success: true, message: 'Senha atualizada com sucesso.' }
  }

  const updateProfile = (data: Partial<AuthUser>) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, ...data }
    
    // Atualizar no banco de dados local
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === currentUser.email.toLowerCase())
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }

    // Atualizar sessão
    const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY)
    if (sessionStr) {
      const session = JSON.parse(sessionStr)
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          ...session,
          user: updatedUser,
        })
      )
    }

    setCurrentUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        signup,
        logout,
        sendPasswordRecovery,
        resetPassword,
        updateProfile,
        theme,
        updateTheme,
        resetTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
