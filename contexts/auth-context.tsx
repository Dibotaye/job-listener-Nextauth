"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/auth"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data on mount
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        try {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          localStorage.removeItem("accessToken")
          localStorage.removeItem("user")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
    }
  }

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
