"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Leaf, Zap, Settings2, Globe, TrendingUp, Award } from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts"

const scoreBreakdown = [
  { category: "Carbon Efficiency", score: 82, weight: 30, icon: Leaf, color: "text-success" },
  { category: "Energy Efficiency", score: 75, weight: 25, icon: Zap, color: "text-warning" },
  { category: "Optimization Adoption", score: 68, weight: 20, icon: Settings2, color: "text-primary" },
  { category: "Regional Sustainability", score: 85, weight: 15, icon: Globe, color: "text-accent" },
  { category: "Governance Compliance", score: 92, weight: 10, icon: Award, color: "text-success" },
]

const trendData = [
  { month: "Aug", score: 62 },
  { month: "Sep", score: 65 },
  { month: "Oct", score: 68 },
  { month: "Nov", score: 72 },
  { month: "Dec", score: 75 },
  { month: "Jan", score: 78 },
]

const radarData = [
  { subject: "Carbon", current: 82, target: 90, industry: 65 },
  { subject: "Energy", current: 75, target: 85, industry: 60 },
  { subject: "Optimization", current: 68, target: 80, industry: 55 },
  { subject: "Regional", current: 85, target: 90, industry: 70 },
  { subject: "Governance", current: 92, target: 95, industry: 75 },
]

const benchmarks = [
  { name: "Industry Average", score: 54 },
  { name: "Allianz Target 2024", score: 80 },
  { name: "Best in Class", score: 92 },
]

export default function ESGScorePage() {
  const overallScore = 78

  return (
    <div className="min-h-screen">
      <Header title="ESG Score" />
      
      <div className="space-y-6">
        {/* Main Score Display */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Score Card */}
          <Card className="bg-card border-border lg:row-span-2">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Overall ESG Score</CardTitle>
              <CardDescription>AI Sustainability Rating</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-6">
                <svg className="h-48 w-48 -rotate-90 transform">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-secondary"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(overallScore / 100) * 553} 553`}
                    strokeLinecap="round"
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-foreground">{overallScore}</span>
                  <span className="text-sm text-muted-foreground">out of 100</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Performance Level</span>
                  <span className="font-medium text-success">Good</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Percentile Rank</span>
                  <span className="font-medium text-foreground">Top 15%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Change (30d)</span>
                  <span className="font-medium text-success">+6 points</span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <p className="text-xs font-medium text-muted-foreground mb-3">Benchmarks</p>
                <div className="space-y-2">
                  {benchmarks.map((benchmark) => (
                    <div key={benchmark.name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{benchmark.name}</span>
                          <span className="text-foreground">{benchmark.score}</span>
                        </div>
                        <Progress value={benchmark.score} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Score Breakdown</CardTitle>
              <CardDescription>Weighted components of your ESG score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoreBreakdown.map((item) => (
                  <div key={item.category} className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{item.weight}% weight</span>
                          <span className="text-sm font-bold text-foreground">{item.score}</span>
                        </div>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Score Trend</CardTitle>
              <CardDescription>ESG score progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} domain={[50, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#1a1a1a'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#0066b3" 
                      strokeWidth={3}
                      dot={{ fill: '#0066b3', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#0066b3' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Comparison</CardTitle>
            <CardDescription>Current performance vs targets and industry average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={12} />
                  <PolarRadiusAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1a1a1a'
                    }} 
                  />
                  <Legend wrapperStyle={{ color: '#6b7280' }} />
                  <Radar name="Current" dataKey="current" stroke="#0066b3" fill="#0066b3" fillOpacity={0.4} />
                  <Radar name="Target" dataKey="target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeDasharray="5 5" />
                  <Radar name="Industry Avg" dataKey="industry" stroke="#6b7280" fill="#6b7280" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Tips */}
        <Card className="bg-secondary/30 border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Path to 80+ Score</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  To reach your 2024 target of 80 points, focus on: (1) Implementing 2 pending optimization recommendations (+4 pts), 
                  (2) Increasing renewable energy region usage (+3 pts), and (3) Reducing idle workload energy waste (+2 pts).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
