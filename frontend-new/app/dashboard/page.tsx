"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { Activity, Zap, Leaf, BarChart3, AlertTriangle, TrendingUp, Cpu, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import {
  getActiveWorkloads,
  getEnergySummary,
  getCarbonSummary,
  getESGScore,
  getEnergyByModel,
  getCarbonByRegion,
  createWebSocket
} from "@/lib/api"

export default function DashboardPage() {
  const [workloads, setWorkloads] = useState<any[]>([])
  const [energySummary, setEnergySummary] = useState<any>(null)
  const [carbonSummary, setCarbonSummary] = useState<any>(null)
  const [esgScore, setEsgScore] = useState<any>(null)
  const [energyByModel, setEnergyByModel] = useState<any[]>([])
  const [carbonByRegion, setCarbonByRegion] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [
        workloadsData,
        energyData,
        carbonData,
        esgData,
        energyModelData,
        carbonRegionData
      ] = await Promise.all([
        getActiveWorkloads(),
        getEnergySummary(),
        getCarbonSummary(),
        getESGScore(),
        getEnergyByModel(),
        getCarbonByRegion()
      ])

      setWorkloads(workloadsData || [])
      setEnergySummary(energyData || { total_energy_today_kwh: 0, average_energy_per_model_kwh: 0, total_workloads: 0 })
      setCarbonSummary(carbonData || { total_carbon_kg: 0 })
      setEsgScore(esgData || { overall_score: 0, grade: 'N/A' })
      setEnergyByModel(energyModelData || [])
      setCarbonByRegion(carbonRegionData || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Set default values on error
      setWorkloads([])
      setEnergySummary({ total_energy_today_kwh: 0, average_energy_per_model_kwh: 0, total_workloads: 0 })
      setCarbonSummary({ total_carbon_kg: 0 })
      setEsgScore({ overall_score: 0, grade: 'N/A' })
      setEnergyByModel([])
      setCarbonByRegion([])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // WebSocket for real-time updates
    const ws = createWebSocket((data) => {
      if (data.type === 'workload_update') {
        setIsConnected(true)
        fetchDashboardData()
      }
    })

    // Refresh every 10 seconds
    const interval = setInterval(fetchDashboardData, 10000)

    return () => {
      ws.close()
      clearInterval(interval)
    }
  }, [])

  // Prepare chart data with safe null checks
  const energyByModelData = energyByModel
    .filter(item => item && item.model_name && item.total_energy_kwh != null)
    .map(item => ({
      model: item.model_name,
      energy: parseFloat(Number(item.total_energy_kwh).toFixed(2))
    }))

  const regionDistributionData = carbonByRegion
    .filter(item => item && item.region && item.total_carbon_kg != null)
    .map((item, index) => ({
      name: item.region,
      value: parseFloat(Number(item.total_carbon_kg).toFixed(2)),
      color: ['#0066b3', '#00a3a3', '#22c55e', '#f59e0b', '#ef4444'][index % 5]
    }))

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen">
      <Header title="ESG Overview" />
      
      <div className="space-y-6">
        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-muted-foreground">
            {isConnected ? 'Live Updates Active' : 'Connecting...'}
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Active AI Workloads"
            value={workloads?.length?.toString() || '0'}
            subtitle="Currently running"
            change={{ value: `${workloads?.length || 0} active`, trend: "up" }}
            icon={Cpu}
            iconColor="text-primary"
          />
          <KPICard
            title="Energy Consumption"
            value={`${energySummary?.total_energy_today_kwh?.toFixed(1) || '0.0'} kWh`}
            subtitle="Estimated today"
            change={{ value: `${energySummary?.total_workloads || 0} workloads`, trend: "neutral" }}
            icon={Zap}
            iconColor="text-warning"
          />
          <KPICard
            title="CO₂ Emissions"
            value={`${carbonSummary?.total_carbon_kg?.toFixed(2) || '0.00'} kg`}
            subtitle="Total carbon footprint"
            change={{ value: `${carbonByRegion?.length || 0} regions`, trend: "down" }}
            icon={Leaf}
            iconColor="text-success"
          />
          <KPICard
            title="ESG Score"
            value={`${esgScore?.overall_score?.toFixed(0) || '0'}/100`}
            subtitle="Sustainability rating"
            change={{ value: esgScore?.grade || 'N/A', trend: "up" }}
            icon={BarChart3}
            iconColor="text-accent"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Energy by Model */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Energy Consumption by AI Model</CardTitle>
              <CardDescription>kWh consumption breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {energyByModelData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyByModelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={12} />
                      <YAxis dataKey="model" type="category" stroke="#6b7280" fontSize={12} width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          color: '#1a1a1a'
                        }} 
                      />
                      <Bar dataKey="energy" fill="#0066b3" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No energy data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Region Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Carbon by Region</CardTitle>
              <CardDescription>Distribution of emissions (kg CO₂)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {regionDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}`}
                      >
                        {regionDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          color: '#1a1a1a'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No carbon data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Workloads Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Active AI Workloads</CardTitle>
                <CardDescription>Real-time monitoring of running workloads</CardDescription>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {workloads.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workloads && workloads.length > 0 ? (
                workloads.slice(0, 5).map((workload) => (
                  <div
                    key={workload.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{workload.model_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {workload.job_type || 'N/A'} • {workload.gpu_count || 0} GPUs • {workload.cloud_region || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {Math.floor((workload.runtime_seconds || 0) / 60)}m {(workload.runtime_seconds || 0) % 60}s
                      </p>
                      <p className="text-xs text-muted-foreground">{workload.status || 'unknown'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active workloads
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
