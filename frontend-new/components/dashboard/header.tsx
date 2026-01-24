"use client"

import { Activity, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white backdrop-blur" style={{ borderColor: '#d4d4d4' }}>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold" style={{ color: '#333333' }}>{title}</h1>
      </div>

      <div className="flex items-center gap-3">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: '#e6f2f9' }}>
                <User className="h-4 w-4" style={{ color: '#003781' }} />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium" style={{ color: '#333333' }}>Sarah Mueller</p>
                <p className="text-xs" style={{ color: '#666666' }}>ESG Analyst</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
