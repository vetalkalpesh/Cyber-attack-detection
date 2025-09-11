"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  username: string
  email: string
  role: "admin" | "analyst" | "viewer"
  firstName: string
  lastName: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    user,
    isLoading,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isAnalyst: user?.role === "analyst" || user?.role === "admin",
  }
}
