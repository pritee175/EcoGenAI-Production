"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Activity,
  Zap,
  Leaf,
  Settings2,
  Shield,
  BarChart3,
  FileText,
  Cloud,
  Bot,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import { logOut } from "@/lib/firebase"
import { useLanguage } from "@/lib/language-context"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ai-monitoring", label: "AI Monitoring", icon: Activity },
  { href: "/dashboard/energy", label: "Energy Consumption", icon: Zap },
  { href: "/dashboard/carbon", label: "Carbon Footprint", icon: Leaf },
  { href: "/dashboard/optimization", label: "Optimization", icon: Settings2 },
  { href: "/dashboard/governance", label: "Governance", icon: Shield },
  { href: "/dashboard/esg-score", label: "ESG Score", icon: BarChart3 },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/climate-risk", label: "Climate Risk", icon: Cloud },
  { href: "/dashboard/auditor-bot", label: "Auditor Bot", icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useLanguage()

  const handleLogout = async () => {
    await logOut()
    router.push("/")
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )} style={{ borderColor: '#d4d4d4' }}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4 bg-white" style={{ borderColor: '#d4d4d4' }}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded" style={{ backgroundColor: '#003781' }}>
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ color: '#333333' }}>EcoGenAI</span>
                <span className="block text-xs" style={{ color: '#666666' }}>ESG Platform</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded mx-auto" style={{ backgroundColor: '#003781' }}>
              <Leaf className="h-5 w-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
            style={{ color: '#666666' }}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 bg-white">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const translatedLabel = t(item.label)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "font-medium"
                    : "hover:bg-gray-50"
                )}
                style={{
                  backgroundColor: isActive ? '#e6f2f9' : 'transparent',
                  color: isActive ? '#003781' : '#333333'
                }}
                title={collapsed ? translatedLabel : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" style={{ color: isActive ? '#003781' : '#666666' }} />
                {!collapsed && <span>{translatedLabel}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-2 bg-white" style={{ borderColor: '#d4d4d4' }}>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
            style={{ color: '#333333' }}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" style={{ color: '#666666' }} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
