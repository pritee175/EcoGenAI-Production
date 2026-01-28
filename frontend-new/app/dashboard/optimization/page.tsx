"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Settings2, MapPin, Clock, Cpu, Pause, ArrowRight, CheckCircle2, AlertCircle, 
  Lightbulb, Leaf, Zap, TrendingDown, DollarSign, Users, Shield, 
  BarChart3, FileCheck, Info, Target, Award, ArrowDown, ArrowUp
} from "lucide-react"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const optimizationRecommendations = [
  {
    id: 1,
    type: "Regional Migration",
    title: "Migrate GPT-4 workloads to EU-North",
    description: "Shifting GPT-4 inference from US-East to EU-North (Sweden) would reduce carbon by 65% due to higher renewable energy mix (92% vs 22%).",
    carbonImpact: {
      reduction: 145,
      currentEmissions: 223,
      optimizedEmissions: 78,
      unit: "kg CO₂e/month"
    },
    businessImpact: {
      costSavings: "$420/month",
      performanceRisk: "Low",
      riskColor: "text-green-600"
    },
    customerImpact: "No customer-facing impact",
    governanceStatus: "Approval Required",
    implementationType: "Regional Migration",
    priority: "high",
    status: "pending",
    icon: MapPin,
    verified: true
  },
  {
    id: 2,
    type: "Green-Time Scheduling",
    title: "Enable green-time scheduling",
    description: "Schedule non-urgent training jobs during off-peak hours (2AM-6AM local) when grid carbon intensity is 35% lower.",
    carbonImpact: {
      reduction: 82,
      currentEmissions: 234,
      optimizedEmissions: 152,
      unit: "kg CO₂e/month"
    },
    businessImpact: {
      costSavings: "$180/month",
      performanceRisk: "Low",
      riskColor: "text-green-600"
    },
    customerImpact: "Internal workload only",
    governanceStatus: "Auto-Approved",
    implementationType: "Green-Time Scheduling",
    priority: "medium",
    status: "pending",
    icon: Clock,
    verified: true
  },
  {
    id: 3,
    type: "Model Right-Sizing",
    title: "Replace Llama-2-70B with Llama-2-13B",
    description: "For document summarization tasks, the 13B model achieves 94% accuracy with 80% less energy consumption.",
    carbonImpact: {
      reduction: 210,
      currentEmissions: 263,
      optimizedEmissions: 53,
      unit: "kg CO₂e/month"
    },
    businessImpact: {
      costSavings: "$890/month",
      performanceRisk: "Medium",
      riskColor: "text-yellow-600"
    },
    customerImpact: "Minimal latency change (<50ms)",
    governanceStatus: "Approval Required",
    implementationType: "Model Right-Sizing",
    priority: "high",
    status: "pending",
    icon: Cpu,
    verified: true
  },
  {
    id: 4,
    type: "Idle Resource Optimization",
    title: "Auto-shutdown idle inference endpoints",
    description: "4 inference endpoints have been idle for >2 hours. Enable auto-shutdown after 30 minutes of inactivity.",
    carbonImpact: {
      reduction: 56,
      currentEmissions: 89,
      optimizedEmissions: 33,
      unit: "kg CO₂e/month"
    },
    businessImpact: {
      costSavings: "$320/month",
      performanceRisk: "Low",
      riskColor: "text-green-600"
    },
    customerImpact: "No customer-facing impact",
    governanceStatus: "Implemented",
    implementationType: "Idle Resource Optimization",
    priority: "medium",
    status: "approved",
    icon: Pause,
    verified: true
  },
  {
    id: 5,
    type: "Idle Resource Optimization",
    title: "Enable request batching for Claude-3",
    description: "Batch inference requests to improve GPU utilization from 45% to 78%, reducing per-request energy cost.",
    carbonImpact: {
      reduction: 94,
      currentEmissions: 167,
      optimizedEmissions: 73,
      unit: "kg CO₂e/month"
    },
    businessImpact: {
      costSavings: "$240/month",
      performanceRisk: "Low",
      riskColor: "text-green-600"
    },
    customerImpact: "No customer-facing impact",
    governanceStatus: "Auto-Approved",
    implementationType: "Idle Resource Optimization",
    priority: "low",
    status: "pending",
    icon: Zap,
    verified: true
  },
]

const carbonBudget = {
  monthlyAllowance: 1500, // kg CO₂e
  currentUsage: 976, // kg CO₂e
  remainingBalance: 524, // kg CO₂e
  percentUsed: 65
}

const verifiedSavings = {
  totalApproved: 56, // kg CO₂e/month
  pendingVerification: 531, // kg CO₂e/month
  auditReady: true,
  lastAuditDate: "2026-01-15"
}

export default function OptimizationPage() {
  const [recommendations, setRecommendations] = useState(optimizationRecommendations)
  const [selectedRec, setSelectedRec] = useState<number | null>(null)

  // Sort recommendations: high-impact, low-risk first
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const riskOrder = { Low: 3, Medium: 2, High: 1 }
    
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder]
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder]
    const aRisk = riskOrder[a.businessImpact.performanceRisk as keyof typeof riskOrder]
    const bRisk = riskOrder[b.businessImpact.performanceRisk as keyof typeof riskOrder]
    
    // High impact + low risk = highest priority
    const aScore = aPriority * 10 + aRisk
    const bScore = bPriority * 10 + bRisk
    
    return bScore - aScore
  })

  const handleApprove = (id: number) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, status: "approved" } : rec
      )
    )
  }

  const handleSendForApproval = (id: number) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, status: "sent" } : rec
      )
    )
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-700 border-green-300"
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "High": return "bg-red-100 text-red-700 border-red-300"
      default: return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getGovernanceBadgeColor = (status: string) => {
    switch (status) {
      case "Auto-Approved": return "bg-blue-100 text-blue-700 border-blue-300"
      case "Approval Required": return "bg-orange-100 text-orange-700 border-orange-300"
      case "Implemented": return "bg-green-100 text-green-700 border-green-300"
      default: return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Optimization" />
      
      <div className="dashboard-container">
        {/* Governance Notice Banner */}
        <Card className="border-2" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', borderColor: '#90caf9' }}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#90caf9' }}>
                <Shield className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Enterprise Governance & Safety</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  EcoGenAI does not automatically modify production systems. All optimization recommendations follow approval workflows 
                  and governance policies. Changes are transparent, explainable, and require explicit authorization before implementation. 
                  Your production environment remains fully under your control.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Budget Indicator */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e3f2fd' }}>
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Monthly AI Carbon Budget</CardTitle>
                  <CardDescription>Track your carbon allowance and remaining balance</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-700">{carbonBudget.remainingBalance}</p>
                <p className="text-xs text-gray-600">kg CO₂e remaining</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Usage</span>
                  <span className="text-sm font-bold text-blue-700">{carbonBudget.percentUsed}%</span>
                </div>
                <Progress value={carbonBudget.percentUsed} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Used: {carbonBudget.currentUsage} kg CO₂e</span>
                  <span>Allowance: {carbonBudget.monthlyAllowance} kg CO₂e</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#e3f2fd' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-medium text-gray-700">Potential Reduction</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">531</p>
                  <p className="text-xs text-gray-600">kg CO₂e/month</p>
                </div>

                <div className="p-3 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-medium text-gray-700">Verified Savings</p>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{verifiedSavings.totalApproved}</p>
                  <p className="text-xs text-gray-600">kg CO₂e/month</p>
                </div>

                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fff3e0' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-orange-600" />
                    <p className="text-xs font-medium text-gray-700">Pending Review</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-700">4</p>
                  <p className="text-xs text-gray-600">recommendations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verified Carbon Savings Tracker */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-green-100">
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Verified Carbon Savings Tracker</CardTitle>
                  <CardDescription>Audit-ready data for ESG reporting and carbon offset programs</CardDescription>
                </div>
              </div>
              {verifiedSavings.auditReady && (
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  <Award className="h-3 w-3 mr-1" />
                  Audit Ready
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Total Approved Reductions</p>
                <p className="text-3xl font-bold text-green-700 mb-1">{verifiedSavings.totalApproved} kg</p>
                <p className="text-xs text-gray-600">CO₂e saved per month</p>
              </div>

              <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Pending Verification</p>
                <p className="text-3xl font-bold text-blue-700 mb-1">{verifiedSavings.pendingVerification} kg</p>
                <p className="text-xs text-gray-600">Awaiting approval</p>
              </div>

              <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Last Audit Date</p>
                <p className="text-2xl font-bold text-gray-700 mb-1">{verifiedSavings.lastAuditDate}</p>
                <p className="text-xs text-gray-600">ESG compliance verified</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                All approved carbon reductions are tracked and verified for submission to carbon registries (Verra, Gold Standard) 
                and ESG reporting frameworks (GRI, SASB, TCFD). Data is audit-ready and includes timestamps, methodology, and verification status.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Enterprise Optimization Recommendations
            </CardTitle>
            <CardDescription>
              AI-identified opportunities prioritized by impact and risk. Low-risk, high-impact actions highlighted first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sortedRecommendations.map((rec, index) => (
                <div 
                  key={rec.id}
                  className={`rounded-xl border-2 p-6 transition-all ${
                    rec.priority === "high" && rec.businessImpact.performanceRisk === "Low"
                      ? "border-green-300 bg-green-50 shadow-md"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        rec.priority === "high" && rec.businessImpact.performanceRisk === "Low"
                          ? "bg-green-200"
                          : "bg-blue-100"
                      }`}>
                        <rec.icon className={`h-6 w-6 ${
                          rec.priority === "high" && rec.businessImpact.performanceRisk === "Low"
                            ? "text-green-700"
                            : "text-blue-600"
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{rec.title}</h3>
                          {rec.priority === "high" && rec.businessImpact.performanceRisk === "Low" && (
                            <Badge className="bg-green-600 text-white">
                              ⭐ Recommended
                            </Badge>
                          )}
                          {rec.verified && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        
                        {/* Implementation Type Tag */}
                        <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                          <Settings2 className="h-3 w-3 mr-1" />
                          {rec.implementationType}
                        </Badge>
                      </div>
                    </div>

                    {rec.status === "approved" && (
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Implemented
                      </Badge>
                    )}
                  </div>

                  {/* Four Key Sections */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    {/* 1. Carbon Impact */}
                    <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <p className="text-xs font-semibold text-gray-700">Carbon Impact</p>
                      </div>
                      <p className="text-2xl font-bold text-green-700 mb-1">
                        -{rec.carbonImpact.reduction}
                      </p>
                      <p className="text-xs text-gray-600">{rec.carbonImpact.unit}</p>
                    </div>

                    {/* 2. Business Impact */}
                    <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-semibold text-gray-700">Business Impact</p>
                      </div>
                      <p className="text-lg font-bold text-blue-700 mb-1">
                        {rec.businessImpact.costSavings}
                      </p>
                      <Badge className={getRiskBadgeColor(rec.businessImpact.performanceRisk)}>
                        {rec.businessImpact.performanceRisk} Risk
                      </Badge>
                    </div>

                    {/* 3. Customer Impact */}
                    <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <p className="text-xs font-semibold text-gray-700">Customer Impact</p>
                      </div>
                      <p className="text-sm font-medium text-purple-700 mt-3">
                        {rec.customerImpact}
                      </p>
                    </div>

                    {/* 4. Governance Status */}
                    <div className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        <p className="text-xs font-semibold text-gray-700">Governance</p>
                      </div>
                      <Badge className={`mt-2 ${getGovernanceBadgeColor(rec.governanceStatus)}`}>
                        {rec.governanceStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Before vs After Comparison */}
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Before vs After Comparison
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Current Emissions</span>
                          <span className="text-sm font-bold text-red-600">{rec.carbonImpact.currentEmissions} kg</span>
                        </div>
                        <div className="h-8 bg-red-200 rounded-lg relative overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-lg flex items-center justify-end pr-2"
                            style={{ width: '100%' }}
                          >
                            <span className="text-xs font-bold text-white">Current</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Optimized Emissions</span>
                          <span className="text-sm font-bold text-green-600">{rec.carbonImpact.optimizedEmissions} kg</span>
                        </div>
                        <div className="h-8 bg-green-200 rounded-lg relative overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-lg flex items-center justify-end pr-2"
                            style={{ width: `${(rec.carbonImpact.optimizedEmissions / rec.carbonImpact.currentEmissions) * 100}%` }}
                          >
                            <span className="text-xs font-bold text-white">After</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2 text-green-700">
                      <ArrowDown className="h-5 w-5" />
                      <span className="text-sm font-bold">
                        {Math.round((rec.carbonImpact.reduction / rec.carbonImpact.currentEmissions) * 100)}% Reduction
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end">
                    {rec.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-300"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-white"
                          style={{ backgroundColor: '#64b5f6' }}
                          onClick={() => handleSendForApproval(rec.id)}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Send for Approval
                        </Button>
                      </>
                    )}
                    {rec.status === "sent" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-orange-300 text-orange-700"
                        disabled
                      >
                        Awaiting Governance Review
                      </Button>
                    )}
                    {rec.status === "approved" && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 text-white"
                        disabled
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Implemented & Verified
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
