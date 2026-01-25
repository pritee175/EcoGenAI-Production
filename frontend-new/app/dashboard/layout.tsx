import React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <Sidebar />
      <main className="lg:pl-64 transition-all duration-300" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="mx-auto max-w-[1400px] px-3 md:px-6 py-3 md:py-4">
          {children}
        </div>
      </main>
    </div>
  )
}
