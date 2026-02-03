"use client"

import { Bell, User, Languages, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { logOut } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { mode, toggleMode } = useLanguage()
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await logOut()
    router.push('/login')
  }

  const handleProfileClick = () => {
    router.push('/dashboard/profile')
  }

  // Get display name and role
  const displayName = profile?.full_name || user?.displayName || user?.email?.split('@')[0] || 'User'
  const displayRole = profile?.job_title || 'Team Member'
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white backdrop-blur" style={{ borderColor: '#d4d4d4' }}>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold" style={{ color: '#333333' }}>{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Simple Language Mode Toggle */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleMode}
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          <Languages className="h-4 w-4" style={{ color: '#666666' }} />
          <span className="hidden sm:inline text-sm" style={{ color: '#333333' }}>
            Simple Language Mode
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ 
            backgroundColor: mode === 'simple' ? '#22c55e' : '#e5e7eb',
            color: mode === 'simple' ? '#ffffff' : '#666666'
          }}>
            {mode === 'simple' ? 'ON' : 'OFF'}
          </span>
        </Button>
        {/* Live Monitoring Indicator */}
        <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ backgroundColor: '#e6f7ed' }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: '#22c55e' }}></span>
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#22c55e' }}></span>
          </span>
          <span className="text-xs font-medium" style={{ color: '#22c55e' }}>AI Tracking Active</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" style={{ color: '#666666' }} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: '#dc2626' }}>
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: '#e6f2f9' }}>
                  <User className="h-4 w-4" style={{ color: '#003781' }} />
                </div>
              )}
              <div className="hidden text-left md:block">
                {loading ? (
                  <>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium" style={{ color: '#333333' }}>{displayName}</p>
                    <p className="text-xs" style={{ color: '#666666' }}>{displayRole}</p>
                  </>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
