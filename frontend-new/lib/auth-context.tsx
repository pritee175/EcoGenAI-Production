"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, User } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface UserProfile {
  email: string
  full_name: string | null
  job_title: string | null
  avatar_url: string | null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {}
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/api/profile/${email}`, {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile({
          email: data.email,
          full_name: data.full_name,
          job_title: data.job_title,
          avatar_url: data.avatar_url
        })
      }
    } catch (error) {
      console.warn('Failed to fetch profile:', error)
      // Set basic profile from Firebase user
      setProfile({
        email: email,
        full_name: null,
        job_title: null,
        avatar_url: null
      })
    }
  }

  const refreshProfile = async () => {
    if (user?.email) {
      await fetchProfile(user.email)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser?.email) {
        // Save to localStorage for backward compatibility
        localStorage.setItem('userEmail', firebaseUser.email)
        // Fetch profile from backend
        await fetchProfile(firebaseUser.email)
      } else {
        localStorage.removeItem('userEmail')
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
