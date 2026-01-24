"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, RefreshCw, Activity, Clock, MapPin, Cpu, Zap, Leaf } from "lucide-react"
import { useState, useEffect } from "react"

const initialWorkloads = [
  { id: 1, model: "GPT-4-Turbo", status: "running", region: "EU-West-1", runtime: 3842, compute: "A100 x4", energy: 45.2, carbon: 12.4 },
  { id: 2, model: "Claude-3-Opus", status: "running", region: "US-East-1", runtime: 2156, compute: "H100 x2", energy: 38.7, carbon: 18.2 },
  { id: 3, model: "Llama-2-70B", status: "running", region: "EU-Central-1", runtime: 5621, compute: "A100 x8", energy: 72.1, carbon: 19.8 },
  { id: 4, model: "Gemini-Pro", status: "idle", region: "APAC-1", runtime: 0, compute: "TPU v4", energy: 0, carbon: 0 },
  { id: 5, model: "GPT-4-Vision", status: "running", region: "US-West-2", runtime: 1423, compute: "A100 x4", energy: 28.4, carbon: 13.1 },
  { id: 6, model: "Custom-FinBERT", status: "running", region: "EU-West-2", runtime: 8234, compute: "V100 x2", energy: 15.3, carbon: 4.2 },
  { id: 7, model: "Mistral-7B", status: "running", region: "EU-North-1", runtime: 4521, compute: "A100 x2", energy: 22.8, carbon: 5.1 },
  { id: 8, model: "Claude-3-Sonnet", status: "stopped", region: "US-Central-1", runtime: 0, compute: "H100 x1", energy: 0, carbon: 0 },
]

function formatRuntime(seconds: number): string {
  if (seconds === 0) return "—"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function AIMonitoringPage() {
  const [workloads, setWorkloads] = useState(initialWorkloads)
  const [searchTerm, setSearchTerm] = useState("")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkloads(prev => prev.map(w => {
        if (w.status === "running") {
          return {
            ...w,
            runtime: w.runtime + 1,
            energy: +(w.energy + 0.01).toFixed(2),
            carbon: +(w.carbon + 0.003).toFixed(3)
          }
        }
        return w
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredWorkloads = workloads.filter(w => 
    w.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const runningCount = workloads.filter(w => w.status === "running").length
  const totalEnergy = workloads.reduce((sum, w) => sum + w.energy, 0)
  const totalCarbon = workloads.reduce((sum, w) => sum + w.carbon, 0)

  return (
    <div className="min-h-screen">
      <Header title="AI Monitoring" />
      
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{runningCount}</p>
                  <p className="text-xs text-muted-foreground">Active Workloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Cpu className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{workloads.length}</p>
                  <p className="text-xs text-muted-foreground">Total Models</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalEnergy.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">kWh Consumed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Leaf className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalCarbon.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">kg CO₂ Emitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workloads Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-foreground">Real-Time AI Workloads</CardTitle>
                <CardDescription>Live monitoring of all Generative AI processes</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search models or regions..."
                    className="w-64 pl-9 bg-input border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="border-border bg-transparent">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-border bg-transparent">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Runtime</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Compute</th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Energy (kWh)</th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">CO₂ (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredWorkloads.map((workload) => (
                    <tr key={workload.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{workload.model}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge 
                          variant={workload.status === "running" ? "default" : "secondary"}
                          className={
                            workload.status === "running" 
                              ? "bg-success/10 text-success border-success/20" 
                              : workload.status === "idle"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {workload.status === "running" && (
                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                          )}
                          {workload.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {workload.region}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 font-mono text-sm text-foreground">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {formatRuntime(workload.runtime)}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{workload.compute}</td>
                      <td className="py-4 text-right font-mono text-sm text-foreground">{workload.energy.toFixed(1)}</td>
                      <td className="py-4 text-right font-mono text-sm text-foreground">{workload.carbon.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Transparency Note:</span> Energy and carbon values are calculated using standardized estimation models based on GPU utilization, regional grid intensity, and power usage effectiveness (PUE) factors.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
