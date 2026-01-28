"use client"

import React, { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, Leaf, Zap, Settings2, Globe, TrendingUp, Award, 
  Trophy, Star, Target, Sparkles, Gift, Crown, Medal, Flame,
  Lock, CheckCircle, Users, Calendar, Info, TrendingDown, 
  FileCheck, Shield, AlertCircle
} from "lucide-react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  BarChart, Bar
} from "recharts"
import { getGamificationSummary, getLeaderboard, getBadgeInfo, getCarbonSummary } from "@/lib/api"

// Mock data - will be replaced with API calls
const ecoActions = [
  { action: "Reduced Energy Usage", points: 150, icon: Zap, color: "#f59e0b" },
  { action: "Lower CO₂ Emissions", points: 200, icon: Leaf, color: "#22c55e" },
  { action: "Optimization Adopted", points: 100, icon: Settings2, color: "#0066b3" },
  { action: "Clean Region Usage", points: 120, icon: Globe, color: "#00a3a3" },
  { action: "Minimized Idle GPU", points: 80, icon: Target, color: "#ef4444" },
]

const badges = [
  { 
    id: 1, 
    name: "Carbon Warrior", 
    description: "Reduced CO₂ by 100kg", 
    icon: Leaf, 
    unlocked: true, 
    progress: 100,
    color: "#22c55e",
    tier: "gold"
  },
  { 
    id: 2, 
    name: "Energy Saver", 
    description: "Saved 500 kWh", 
    icon: Zap, 
    unlocked: true, 
    progress: 100,
    color: "#f59e0b",
    tier: "silver"
  },
  { 
    id: 3, 
    name: "Optimizer Pro", 
    description: "Adopted 10 recommendations", 
    icon: Settings2, 
    unlocked: true, 
    progress: 100,
    color: "#0066b3",
    tier: "bronze"
  },
  { 
    id: 4, 
    name: "Green Champion", 
    description: "Use clean regions 50 times", 
    icon: Globe, 
    unlocked: false, 
    progress: 68,
    color: "#00a3a3",
    tier: "platinum"
  },
  { 
    id: 5, 
    name: "Efficiency Master", 
    description: "Zero idle time for 30 days", 
    icon: Target, 
    unlocked: false, 
    progress: 45,
    color: "#8b5cf6",
    tier: "platinum"
  },
  { 
    id: 6, 
    name: "Carbon Reduction Contributor", 
    description: "Reduce emissions by 25% vs baseline", 
    icon: Leaf, 
    unlocked: true, 
    progress: 100,
    color: "#22c55e",
    tier: "gold"
  },
  { 
    id: 7, 
    name: "Credit-Ready Organization", 
    description: "Achieve carbon credit eligibility", 
    icon: Award, 
    unlocked: false, 
    progress: 72,
    color: "#0066b3",
    tier: "diamond"
  },
  { 
    id: 8, 
    name: "Sustainability Legend", 
    description: "Reach Eco-Score 95+", 
    icon: Crown, 
    unlocked: false, 
    progress: 82,
    color: "#fbbf24",
    tier: "diamond"
  },
]

const rewards = [
  { 
    id: 1, 
    name: "Ocean Theme", 
    description: "Calming blue dashboard theme", 
    points: 500, 
    icon: Sparkles, 
    unlocked: true,
    category: "theme"
  },
  { 
    id: 2, 
    name: "Forest Theme", 
    description: "Nature-inspired green theme", 
    points: 500, 
    icon: Sparkles, 
    unlocked: false,
    category: "theme"
  },
  { 
    id: 3, 
    name: "Sustainability Certificate", 
    description: "Official ESG achievement certificate", 
    points: 1000, 
    icon: Award, 
    unlocked: true,
    category: "certificate"
  },
  { 
    id: 4, 
    name: "Advanced Insights", 
    description: "Unlock predictive analytics", 
    points: 1500, 
    icon: BarChart3, 
    unlocked: false,
    category: "feature"
  },
  { 
    id: 5, 
    name: "Leaderboard Badge", 
    description: "Top 10 recognition badge", 
    points: 2000, 
    icon: Trophy, 
    unlocked: false,
    category: "recognition"
  },
  { 
    id: 6, 
    name: "Premium Reports", 
    description: "Detailed ESG reports", 
    points: 2500, 
    icon: Gift, 
    unlocked: false,
    category: "feature"
  },
]

const leaderboardData = [
  { rank: 1, team: "Green Innovators", score: 95, points: 4850, trend: "up", avatar: "🌟" },
  { rank: 2, team: "Eco Warriors", score: 92, points: 4520, trend: "up", avatar: "🌿" },
  { rank: 3, team: "Carbon Crushers", score: 89, points: 4180, trend: "same", avatar: "⚡" },
  { rank: 4, team: "Your Team", score: 85, points: 3920, trend: "up", avatar: "🎯", highlight: true },
  { rank: 5, team: "Sustainability Squad", score: 82, points: 3650, trend: "down", avatar: "🌍" },
]

export default function ESGScorePage() {
  const [ecoScore, setEcoScore] = useState(85)
  const [totalPoints, setTotalPoints] = useState(3920)
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'rewards' | 'leaderboard'>('overview')
  const [gamificationData, setGamificationData] = useState<any>(null)
  
  // Carbon Credit Readiness Data
  const [carbonData, setCarbonData] = useState({
    totalReduction: 245.8, // kg CO₂ reduced
    baselineEmissions: 1250.0, // kg CO₂ baseline
    currentEmissions: 1004.2, // kg CO₂ current
    eligibleReduction: 198.5, // kg CO₂ eligible for credits
    readinessLevel: 72, // percentage (0-100)
    readinessStatus: 'Partially Verified' as 'Not Eligible' | 'Partially Verified' | 'Credit Ready',
    verificationDate: '2026-01-20',
    nextAuditDate: '2026-02-15'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamData, carbonSummary] = await Promise.all([
          getGamificationSummary(),
          getCarbonSummary()
        ])
        
        if (gamData) {
          setGamificationData(gamData)
        }
        
        // Update carbon credit readiness from backend
        if (carbonSummary) {
          const baseline = 1250.0 // This should come from historical data
          const current = carbonSummary.total_carbon_kg || 1004.2
          const reduction = baseline - current
          const reductionPercent = (reduction / baseline) * 100
          
          setCarbonData({
            totalReduction: reduction,
            baselineEmissions: baseline,
            currentEmissions: current,
            eligibleReduction: reduction * 0.85, // 85% eligible after verification
            readinessLevel: Math.min(reductionPercent * 3, 100), // Scale to 100
            readinessStatus: reductionPercent >= 30 ? 'Credit Ready' : reductionPercent >= 15 ? 'Partially Verified' : 'Not Eligible',
            verificationDate: new Date().toISOString().split('T')[0],
            nextAuditDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })
        }
      } catch (error) {
        console.error('Error fetching gamification data:', error)
      }
    }
    fetchData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'from-cyan-400 to-blue-600'
      case 'platinum': return 'from-gray-300 to-gray-500'
      case 'gold': return 'from-yellow-400 to-yellow-600'
      case 'silver': return 'from-gray-200 to-gray-400'
      case 'bronze': return 'from-orange-400 to-orange-600'
      default: return 'from-gray-200 to-gray-400'
    }
  }

  const getReadinessColor = (status: string) => {
    switch (status) {
      case 'Credit Ready': return { bg: 'from-green-500 to-emerald-600', text: 'text-green-600', icon: CheckCircle }
      case 'Partially Verified': return { bg: 'from-blue-500 to-cyan-600', text: 'text-blue-600', icon: Shield }
      case 'Not Eligible': return { bg: 'from-gray-400 to-gray-500', text: 'text-gray-600', icon: AlertCircle }
      default: return { bg: 'from-gray-400 to-gray-500', text: 'text-gray-600', icon: AlertCircle }
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Eco-Score & Gamification" />
      
      <div className="dashboard-container">
        {/* Top Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Eco-Score</p>
                  <p className="text-4xl font-bold mt-1 text-blue-700">{ecoScore}</p>
                  <p className="text-xs text-gray-500 mt-1">out of 100</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Eco Points</p>
                  <p className="text-4xl font-bold mt-1 text-cyan-700">{totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">+250 this week</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Star className="h-8 w-8 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Badges Earned</p>
                  <p className="text-4xl font-bold mt-1 text-teal-700">{badges.filter(b => b.unlocked).length}/{badges.length}</p>
                  <p className="text-xs text-gray-500 mt-1">3 unlocked</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <Award className="h-8 w-8 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Rank</p>
                  <p className="text-4xl font-bold mt-1 text-green-700">#4</p>
                  <p className="text-xs text-gray-500 mt-1">Top 20%</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Medal className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'rewards', label: 'Green Rewards', icon: Gift },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Carbon Credit Readiness Section */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Carbon Credit Readiness</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        Verified CO₂ reduction tracking for carbon markets
                        <div className="group relative inline-block">
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                            This platform prepares verified emission reduction data for external carbon markets and ESG audits. We do not trade carbon credits directly.
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getReadinessColor(carbonData.readinessStatus).bg} text-white font-bold flex items-center gap-2`}>
                    {carbonData.readinessStatus === 'Credit Ready' && <CheckCircle className="h-5 w-5" />}
                    {carbonData.readinessStatus === 'Partially Verified' && <Shield className="h-5 w-5" />}
                    {carbonData.readinessStatus === 'Not Eligible' && <AlertCircle className="h-5 w-5" />}
                    {carbonData.readinessStatus}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                  <div className="p-4 rounded-xl bg-white border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-muted-foreground">Total Reduction</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{carbonData.totalReduction.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">kg CO₂ reduced</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      <p className="text-sm font-medium text-muted-foreground">Baseline</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-700">{carbonData.baselineEmissions.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">kg CO₂ baseline</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-medium text-muted-foreground">Current</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{carbonData.currentEmissions.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">kg CO₂ current</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <p className="text-sm font-medium text-muted-foreground">Eligible</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">{carbonData.eligibleReduction.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">kg CO₂ eligible</p>
                  </div>
                </div>

                {/* Readiness Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-foreground">Credit Readiness Level</p>
                    <p className="text-sm font-bold text-foreground">{carbonData.readinessLevel}%</p>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-emerald-600 rounded-full transition-all duration-1000 relative"
                      style={{ width: `${carbonData.readinessLevel}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Not Eligible</span>
                    <span>Partially Verified</span>
                    <span>Credit Ready</span>
                  </div>
                </div>

                {/* Reduction Impact */}
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">Reduction vs Baseline</p>
                      <TrendingDown className="h-5 w-5 text-cyan-600" />
                    </div>
                    <p className="text-4xl font-bold mb-1 text-cyan-700">
                      {((carbonData.totalReduction / carbonData.baselineEmissions) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">
                      +{((carbonData.totalReduction / carbonData.baselineEmissions) * 100 * 10).toFixed(0)} Eco Points earned
                    </p>
                  </div>

                  <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">Verification Status</p>
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold mb-1 text-blue-700">85% Verified</p>
                    <p className="text-xs text-gray-600">
                      Last verified: {carbonData.verificationDate}
                    </p>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Carbon Credit Preparation</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      EcoGenAI tracks and verifies your CO₂ reduction data to prepare documentation for external carbon credit markets and ESG audits. 
                      We do not trade carbon credits directly. Your verified reduction data can be submitted to carbon registries like Verra, Gold Standard, 
                      or used for corporate ESG reporting. Next audit scheduled: <span className="font-semibold">{carbonData.nextAuditDate}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eco Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Sustainability Actions & Points
                </CardTitle>
                <CardDescription>Track your eco-friendly actions and earn points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {ecoActions.map((action) => (
                    <div key={action.action} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-secondary/30">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                        <action.icon className="h-6 w-6" style={{ color: action.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{action.action}</p>
                        <p className="text-lg font-bold" style={{ color: action.color }}>+{action.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Eco-Score Calculation</CardTitle>
                  <CardDescription>Real-time score based on sustainability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Energy Efficiency", value: 88, max: 100, color: "#f59e0b" },
                      { label: "Carbon Reduction", value: 92, max: 100, color: "#22c55e" },
                      { label: "Optimization Rate", value: 75, max: 100, color: "#0066b3" },
                      { label: "Clean Region Usage", value: 85, max: 100, color: "#00a3a3" },
                      { label: "Resource Efficiency", value: 80, max: 100, color: "#8b5cf6" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{metric.label}</span>
                          <span className="text-sm font-bold" style={{ color: metric.color }}>{metric.value}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Trend</CardTitle>
                  <CardDescription>Your Eco-Score over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { day: 'Week 1', score: 78 },
                        { day: 'Week 2', score: 80 },
                        { day: 'Week 3', score: 82 },
                        { day: 'Week 4', score: 85 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} domain={[70, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#0066b3" strokeWidth={3} dot={{ fill: '#0066b3', r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievement Badges
                </CardTitle>
                <CardDescription>Unlock badges by reaching sustainability milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        badge.unlocked 
                          ? 'border-transparent bg-gradient-to-br ' + getTierColor(badge.tier) + ' text-white shadow-lg'
                          : 'border-border bg-secondary/30'
                      }`}
                    >
                      {badge.unlocked && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                      )}
                      
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                        badge.unlocked ? 'bg-white/20' : 'bg-secondary'
                      }`}>
                        <badge.icon className={`h-8 w-8 ${badge.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>

                      <h3 className={`text-lg font-bold mb-1 ${badge.unlocked ? 'text-white' : 'text-foreground'}`}>
                        {badge.name}
                      </h3>
                      <p className={`text-sm mb-3 ${badge.unlocked ? 'text-white/90' : 'text-muted-foreground'}`}>
                        {badge.description}
                      </p>

                      {!badge.unlocked && (
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{badge.progress}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ width: `${badge.progress}%`, backgroundColor: badge.color }}
                            />
                          </div>
                        </div>
                      )}

                      {badge.unlocked && (
                        <Badge className="bg-white/20 text-white border-white/30">
                          {badge.tier.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Badge Tiers Info */}
            <Card style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', borderColor: '#bbdefb' }} className="border-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Badge Tiers</h3>
                <div className="grid gap-3 md:grid-cols-5">
                  {[
                    { tier: 'Bronze', bgColor: '#ffccbc', points: '0-500' },
                    { tier: 'Silver', bgColor: '#e0e0e0', points: '500-1000' },
                    { tier: 'Gold', bgColor: '#fff9c4', points: '1000-2000' },
                    { tier: 'Platinum', bgColor: '#b3e5fc', points: '2000-3500' },
                    { tier: 'Diamond', bgColor: '#e1f5fe', points: '3500+' },
                  ].map((tier) => (
                    <div key={tier.tier} className="text-center">
                      <div className="h-12 w-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: tier.bgColor }}>
                        <Crown className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{tier.tier}</p>
                      <p className="text-xs text-muted-foreground">{tier.points} pts</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-500" />
                  Green Rewards Store
                </CardTitle>
                <CardDescription>Redeem your Eco Points for exclusive benefits</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="mb-6 p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Available Points</p>
                      <p className="text-3xl font-bold text-blue-700">{totalPoints.toLocaleString()}</p>
                    </div>
                    <Star className="h-12 w-12 text-blue-400" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rewards.map((reward) => (
                    <div 
                      key={reward.id} 
                      className={`p-6 rounded-xl border-2 transition-all ${
                        reward.unlocked 
                          ? 'border-green-500 bg-green-50'
                          : totalPoints >= reward.points
                          ? 'border-blue-500 bg-blue-50 hover:shadow-lg cursor-pointer'
                          : 'border-border bg-secondary/30 opacity-60'
                      }`}
                    >
                      <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${
                        reward.unlocked 
                          ? 'bg-green-500'
                          : totalPoints >= reward.points
                          ? 'bg-blue-500'
                          : 'bg-secondary'
                      }`}>
                        {reward.unlocked ? (
                          <CheckCircle className="h-7 w-7 text-white" />
                        ) : totalPoints >= reward.points ? (
                          <reward.icon className="h-7 w-7 text-white" />
                        ) : (
                          <Lock className="h-7 w-7 text-muted-foreground" />
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-1">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-bold text-foreground">{reward.points}</span>
                        </div>
                        {reward.unlocked ? (
                          <Badge className="bg-green-500 text-white">Unlocked</Badge>
                        ) : totalPoints >= reward.points ? (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Redeem
                          </Button>
                        ) : (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reward Categories */}
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { category: 'Themes', count: 2, icon: Sparkles, bgColor: '#e3f2fd' },
                { category: 'Certificates', count: 1, icon: Award, bgColor: '#e1f5fe' },
                { category: 'Features', count: 2, icon: BarChart3, bgColor: '#e0f7fa' },
                { category: 'Recognition', count: 1, icon: Trophy, bgColor: '#e8f5e9' },
              ].map((cat) => (
                <Card key={cat.category}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.bgColor }}>
                        <cat.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">{cat.count} available</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Monthly Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Monthly Leaderboard
                  </CardTitle>
                  <CardDescription>Top teams this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboardData.map((team) => (
                      <div 
                        key={team.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                          team.highlight 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'bg-secondary/30 hover:bg-secondary/50'
                        }`}
                      >
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold ${
                          team.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                          team.rank === 2 ? 'bg-gray-300 text-gray-700' :
                          team.rank === 3 ? 'bg-orange-400 text-orange-900' :
                          team.highlight ? 'bg-white/20 text-white' :
                          'bg-secondary text-foreground'
                        }`}>
                          {team.rank <= 3 ? (
                            <Trophy className="h-5 w-5" />
                          ) : (
                            `#${team.rank}`
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{team.avatar}</span>
                            <p className={`font-bold truncate ${team.highlight ? 'text-white' : 'text-foreground'}`}>
                              {team.team}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className={team.highlight ? 'text-white/90' : 'text-muted-foreground'}>
                              Score: {team.score}
                            </span>
                            <span className={team.highlight ? 'text-white/90' : 'text-muted-foreground'}>
                              •
                            </span>
                            <span className={team.highlight ? 'text-white/90' : 'text-muted-foreground'}>
                              {team.points.toLocaleString()} pts
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          {team.trend === 'up' && (
                            <TrendingUp className={`h-5 w-5 ${team.highlight ? 'text-white' : 'text-green-500'}`} />
                          )}
                          {team.trend === 'down' && (
                            <TrendingUp className={`h-5 w-5 rotate-180 ${team.highlight ? 'text-white' : 'text-red-500'}`} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Overall Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    All-Time Leaderboard
                  </CardTitle>
                  <CardDescription>Top performers overall</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboardData.map((team) => (
                      <div 
                        key={team.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          team.highlight 
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                            : 'bg-secondary/30'
                        }`}
                      >
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold ${
                          team.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                          team.rank === 2 ? 'bg-gray-300 text-gray-700' :
                          team.rank === 3 ? 'bg-orange-400 text-orange-900' :
                          team.highlight ? 'bg-white/20 text-white' :
                          'bg-secondary text-foreground'
                        }`}>
                          {team.rank <= 3 ? (
                            <Crown className="h-5 w-5" />
                          ) : (
                            `#${team.rank}`
                          )}
                        </div>

                        <div className="flex-1">
                          <p className={`font-bold ${team.highlight ? 'text-white' : 'text-foreground'}`}>
                            {team.team}
                          </p>
                          <p className={`text-sm ${team.highlight ? 'text-white/90' : 'text-muted-foreground'}`}>
                            {team.points.toLocaleString()} total points
                          </p>
                        </div>

                        <div className={`text-2xl font-bold ${team.highlight ? 'text-white' : 'text-foreground'}`}>
                          {team.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Stats */}
            <Card className="border-0" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Users className="h-5 w-5" />
                  Your Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">4th</p>
                    <p className="text-sm text-gray-600">Current Rank</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">85</p>
                    <p className="text-sm text-gray-600">Eco-Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">3,920</p>
                    <p className="text-sm text-gray-600">Total Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">↑ 2</p>
                    <p className="text-sm text-gray-600">Rank Change</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competition Info */}
            <Card style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', borderColor: '#bbdefb' }} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#90caf9' }}>
                    <Flame className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Monthly Competition</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Top 3 teams at the end of the month receive special recognition badges and bonus rewards!
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">1st: 1000 bonus pts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-cyan-600" />
                        <span className="font-medium">2nd: 500 bonus pts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">3rd: 250 bonus pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
