"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Lock, Mail, AlertCircle, User, ArrowLeft } from "lucide-react"
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/firebase"
import { Alert, AlertDescription } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

declare global {
  interface Window {
    VANTA: any
    THREE: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    const loadThree = () => {
      return new Promise((resolve, reject) => {
        if (window.THREE) {
          resolve(true)
          return
        }
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
        script.onload = () => resolve(true)
        script.onerror = () => reject(new Error('Failed to load Three.js'))
        document.head.appendChild(script)
      })
    }

    const loadVanta = () => {
      return new Promise((resolve, reject) => {
        if (window.VANTA) {
          resolve(true)
          return
        }
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js'
        script.onload = () => resolve(true)
        script.onerror = () => reject(new Error('Failed to load Vanta.js'))
        document.head.appendChild(script)
      })
    }

    const initVanta = async () => {
      try {
        await loadThree()
        await loadVanta()
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!mounted) return
        
        if (vantaRef.current && window.VANTA && window.THREE && !vantaEffect.current) {
          vantaEffect.current = window.VANTA.CLOUDS({
            el: vantaRef.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            skyColor: 0x68b8d7,
            cloudColor: 0xadc1de,
            cloudShadowColor: 0x183550,
            sunColor: 0xff9919,
            sunGlareColor: 0xff6633,
            sunlightColor: 0xff9933,
            speed: 0.8
          })
        }
      } catch (error) {
        console.error('Vanta initialization error:', error)
      }
    }

    initVanta()

    return () => {
      mounted = false
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy()
          vantaEffect.current = null
        } catch (error) {
          console.error('Vanta cleanup error:', error)
        }
      }
    }
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (isSignUp) {
      if (!fullName) {
        setError("Please enter your full name")
        return
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
    }

    setIsLoading(true)

    try {
      if (isSignUp) {
        const { user, error: authError } = await signUpWithEmail(email, password)
        if (authError) {
          setError(authError)
          setIsLoading(false)
          return
        }
        if (user) {
          // Save email to localStorage
          localStorage.setItem('userEmail', user.email || '');
          
          // Create profile in background (don't wait)
          fetch(`${API_URL}/api/profile/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email,
              full_name: fullName 
            })
          }).catch(err => console.error('Profile creation error:', err));
          
          // Redirect immediately - new user goes to onboarding
          router.push("/onboarding");
        }
      } else {
        const { user, error: authError } = await signInWithEmail(email, password)
        if (authError) {
          setError(authError)
          setIsLoading(false)
          return
        }
        if (user) {
          // Save email to localStorage
          localStorage.setItem('userEmail', user.email || '');
          
          // Update last login in background (don't wait)
          fetch(`${API_URL}/api/profile/${user.email}/update-login`, {
            method: 'POST'
          }).catch(err => console.error('Login update error:', err));
          
          // Check onboarding status and redirect
          try {
            const response = await fetch(`${API_URL}/api/onboarding/status/${user.email}`, {
              signal: AbortSignal.timeout(2000) // 2 second timeout
            });
            
            if (response.ok) {
              const data = await response.json();
              router.push(data.onboarding_completed ? "/dashboard" : "/onboarding");
            } else {
              // If API fails, assume onboarding needed
              router.push("/onboarding");
            }
          } catch (error) {
            // On timeout or error, go to onboarding (safe default)
            console.warn('Onboarding check timeout, redirecting to onboarding');
            router.push("/onboarding");
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError("")
    setIsLoading(true)

    try {
      const { user, error: authError } = await signInWithGoogle()
      if (authError) {
        setError(authError)
        setIsLoading(false)
        return
      }
      if (user) {
        // Save email to localStorage
        localStorage.setItem('userEmail', user.email || '');
        
        // Update last login in background (don't wait)
        fetch(`${API_URL}/api/profile/${user.email}/update-login`, {
          method: 'POST'
        }).catch(err => console.error('Login update error:', err));
        
        // Check onboarding status with timeout
        try {
          const response = await fetch(`${API_URL}/api/onboarding/status/${user.email}`, {
            signal: AbortSignal.timeout(2000) // 2 second timeout
          });
          
          if (response.ok) {
            const data = await response.json();
            router.push(data.onboarding_completed ? "/dashboard" : "/onboarding");
          } else {
            router.push("/onboarding");
          }
        } catch (error) {
          console.warn('Onboarding check timeout, redirecting to onboarding');
          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setIsLoading(false)
    }
  }

  return (
    <div 
      ref={vantaRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ width: '100%', height: '100vh' }}
    >
      {/* Back to Home Button */}
      <Button
        onClick={() => router.push('/landing')}
        variant="ghost"
        className="absolute top-4 left-4 z-20 text-white hover:bg-white/20 border border-white/30"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border shadow-2xl backdrop-blur-xl" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderColor: '#d4d4d4',
          padding: '2rem'
        }}>
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg" style={{ 
              backgroundColor: '#003781',
              boxShadow: '0 10px 40px rgba(0, 55, 129, 0.3)'
            }}>
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#003781' }}>EcoGenAI</h1>
            <p className="mt-1 text-sm" style={{ color: '#666666' }}>ESG Intelligence Platform</p>
          </div>

          <div className="mb-6 flex rounded-lg border p-1" style={{ borderColor: '#d4d4d4', backgroundColor: '#f5f5f5' }}>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all"
              style={{
                backgroundColor: !isSignUp ? '#003781' : 'transparent',
                color: !isSignUp ? '#ffffff' : '#666666'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true)
                setError("")
              }}
              className="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all"
              style={{
                backgroundColor: isSignUp ? '#003781' : 'transparent',
                color: isSignUp ? '#ffffff' : '#666666'
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" style={{ color: '#333333' }}>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#666666' }} />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 bg-white"
                    style={{ borderColor: '#d4d4d4' }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#333333' }}>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#666666' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10 bg-white"
                  style={{ borderColor: '#d4d4d4' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#333333' }}>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#666666' }} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-white"
                  style={{ borderColor: '#d4d4d4' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: '#333333' }}>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#666666' }} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white"
                    style={{ borderColor: '#d4d4d4' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#003781' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#d4d4d4' }}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2" style={{ color: '#666666' }}>Or continue with</span>
              </div>
            </div>

            <Button 
              type="button"
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full"
              style={{ borderColor: '#d4d4d4' }}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
