"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings2, MapPin, Clock, Cpu, Pause, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, Leaf, Zap } from "lucide-react"
import { useState } from "react"

const optimizationRecommendations = [
  {
    id: 1,
    type: "region-shift",
    title: "Migrate GPT-4 workloads to EU-North",
    description: "Shifting GPT-4 inference from US-East to EU-North (Sweden) would reduce carbon by 65% due to higher renewable energy mix (92% vs 22%).",
    impact: "Save 145 kg CO₂e/month",
    severity: "high",
    status: "pending",
    icon: MapPin,
  },
  {
    id: 2,
    type: "scheduling",
    title: "Enable green-time scheduling",
    description: "Schedule non-urgent training jobs during off-peak hours (2AM-6AM local) when grid carbon intensity is 35% lower.",
    impact: "Save 82 kg CO₂e/month",
    severity: "medium",
    status: "pending",
    icon: Clock,
  },
  {
    id: 3,
    type: "model-efficiency",
    title: "Replace Llama-2-70B with Llama-2-13B",
    description: "For document summarization tasks, the 13B model achieves 94% accuracy with 80% less energy consumption.",
    impact: "Save 210 kg CO₂e/month",
    severity: "high",
    status: "pending",
    icon: Cpu,
  },
  {
    id: 4,
    type: "idle-reduction",
    title: "Auto-shutdown idle inference endpoints",
    description: "4 inference endpoints have been idle for >2 hours. Enable auto-shutdown after 30 minutes of inactivity.",
    impact: "Save 56 kg CO₂e/month",
    severity: "medium",
    status: "approved",
    icon: Pause,
  },
  {
    id: 5,
    type: "batching",
    title: "Enable request batching for Claude-3",
    description: "Batch inference requests to improve GPU utilization from 45% to 78%, reducing per-request energy cost.",
    impact: "Save 94 kg CO₂e/month",
    severity: "low",
    status: "pending",
    icon: Zap,
  },
]

const summaryStats = {
  totalPotentialSavings: "587 kg CO₂e/month",
  implementedSavings: "56 kg CO₂e/month",
  pendingRecommendations: 4,
  approvedActions: 1,
}

export default function OptimizationPage() {
  const [recommendations, setRecommendations] = useState(optimizationRecommendations)

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

  return (
    <div className="min-h-screen">
      <Header title="Optimization" />
      
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Leaf className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{summaryStats.totalPotentialSavings}</p>
                  <p className="text-xs text-muted-foreground">Potential Savings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{summaryStats.implementedSavings}</p>
                  <p className="text-xs text-muted-foreground">Implemented</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Lightbulb className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{summaryStats.pendingRecommendations}</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Settings2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{summaryStats.approvedActions}</p>
                  <p className="text-xs text-muted-foreground">Approved Actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Optimization Recommendations</CardTitle>
            <CardDescription>AI-identified opportunities to reduce carbon footprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-start"
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                    rec.severity === "high" ? "bg-destructive/10" :
                    rec.severity === "medium" ? "bg-warning/10" : "bg-primary/10"
                  }`}>
                    <rec.icon className={`h-5 w-5 ${
                      rec.severity === "high" ? "text-destructive" :
                      rec.severity === "medium" ? "text-warning" : "text-primary"
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-foreground">{rec.title}</h3>
                      <Badge variant="outline" className={
                        rec.severity === "high" ? "border-destructive/30 text-destructive" :
                        rec.severity === "medium" ? "border-warning/30 text-warning" : "border-primary/30 text-primary"
                      }>
                        {rec.severity} priority
                      </Badge>
                      {rec.status === "approved" && (
                        <Badge className="bg-success/10 text-success border-success/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Approved
                        </Badge>
                      )}
                      {rec.status === "sent" && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <ArrowRight className="mr-1 h-3 w-3" />
                          Sent for Approval
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">{rec.impact}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-col">
                    {rec.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleSendForApproval(rec.id)}
                        >
                          Send for Approval
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-border bg-transparent"
                        >
                          Dismiss
                        </Button>
                      </>
                    )}
                    {rec.status === "sent" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-border text-muted-foreground bg-transparent"
                        disabled
                      >
                        Awaiting Review
                      </Button>
                    )}
                    {rec.status === "approved" && (
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        disabled
                      >
                        Implemented
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-secondary/30 border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">How Recommendations Work</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommendations are generated by analyzing workload patterns, regional carbon intensity, and model efficiency metrics. 
                  Actions sent for approval are routed to the Governance module for managerial review. 
                  Approved actions are automatically scheduled for implementation during the next maintenance window.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
