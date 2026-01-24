"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Lock, Mail, AlertCircle, User } from "lucide-react"
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/firebase"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

    // Load Three.js first
    const loadThree = () => {
      return new Promise((resolve, reject) => {
        if (window.THREE) {
          console.log('Three.js already loaded')
          resolve(true)
          return
        }
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
        script.onload = () => {
          console.log('Three.js loaded successfully')
          resolve(true)
        }
        script.onerror = () => {
          console.error('Failed to load Three.js')
          reject(new Error('Failed to load Three.js'))
        }
        document.head.appendChild(script)
      })
    }

    // Load Vanta Clouds
    const loadVanta = () => {
      return new Promise((resolve, reject) => {
        if (window.VANTA) {
          console.log('Vanta.js already loaded')
          resolve(true)
          return
        }
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js'
        script.onload = () => {
          console.log('Vanta.js loaded successfully')
          resolve(true)
        }
        script.onerror = () => {
          console.error('Failed to load Vanta.js')
          reject(new Error('Failed to load Vanta.js'))
        }
        document.head.appendChild(script)
      })
    }

    // Initialize Vanta effect
    const initVanta = async () => {
      try {
        console.log('Starting Vanta initialization...')
        await loadThree()
        await loadVanta()
        
        // Wait a bit for scripts to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!mounted) return
        
        if (vantaRef.current && window.VANTA && window.THREE && !vantaEffect.current) {
          console.log('Initializing Vanta effect...')
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
          console.log('Vanta effect initialized successfully')
        } else {
          console.log('Vanta initialization skipped:', {
            hasRef: !!vantaRef.current,
            hasVANTA: !!window.VANTA,
            hasTHREE: !!window.THREE,
            hasEffect: !!vantaEffect.current
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
          console.log('Destroying Vanta effect...')
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

    // Validation
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
        // Sign Up
        const { user, error: authError } = await signUpWithEmail(email, password)
        
        if (authError) {
          setError(authError)
          setIsLoading(false)
          return
        }

        if (user) {
          router.push("/dashboard")
        }
      } else {
        // Sign In
        const { user, error: authError } = await signInWithEmail(email, password)
        
        if (authError) {
          setError(authError)
          setIsLoading(false)
          return
        }

        if (user) {
          router.push("/dashboard")
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
        router.push("/dashboard")
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
      {/* Vanta.js will render here */}
      
      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border shadow-2xl backdrop-blur-xl" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderColor: '#d4d4d4',
          padding: '2rem'
        }}>
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg" style={{ 
              backgroundColor: '#003781',
              boxShadow: '0 10px 40px rgba(0, 55, 129, 0.3)'
            }}>
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#333333' }}>EcoGenAI</h1>
            <p className="mt-1 text-sm" style={{ color: '#666666' }}>ESG Intelligence Platform</p>
          </div>

          {/* Sign In / Sign Up Toggle */}
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

          {/* Auth Form */}
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
              {isSignUp && (
                <p className="text-xs" style={{ color: '#666666' }}>
                  Must be at least 6 characters
                </p>
              )}
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

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" style={{ accentColor: '#003781' }} />
                  <span style={{ color: '#666666' }}>Remember me</span>
                </label>
                <button type="button" className="hover:underline" style={{ color: '#0066b3' }}>
                  Forgot password?
                </button>
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

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#d4d4d4' }}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2" style={{ color: '#666666' }}>Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In */}
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

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            {/* Already have account / New user link */}
            <div className="text-sm">
              {isSignUp ? (
                <p style={{ color: '#666666' }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="font-medium hover:underline"
                    style={{ color: '#0066b3' }}
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p style={{ color: '#666666' }}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="font-medium hover:underline"
                    style={{ color: '#0066b3' }}
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>

            {/* Terms and Privacy */}
            <p className="text-xs" style={{ color: '#666666' }}>
              {isSignUp ? 'By creating an account' : 'By signing in'}, you agree to our{" "}
              <span className="hover:underline cursor-pointer" style={{ color: '#0066b3' }}>Terms of Service</span> and{" "}
              <span className="hover:underline cursor-pointer" style={{ color: '#0066b3' }}>Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Version Info */}
        <p className="mt-4 text-center text-xs" style={{ color: '#666666' }}>
          EcoGenAI v2.4.1 • Environment: Production
        </p>
      </div>
    </div>
  )
}
