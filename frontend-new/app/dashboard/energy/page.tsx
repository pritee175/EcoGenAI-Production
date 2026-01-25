"use client"

import { Header } from "@/components/dashboard/header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, TrendingDown, Activity, Server } from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts"

const energyTrendData = [
  { date: "Jan 1", actual: 580, projected: 620 },
  { date: "Jan 5", actual: 620, projected: 630 },
  { date: "Jan 10", actual: 550, projected: 610 },
  { date: "Jan 15", actual: 590, projected: 600 },
  { date: "Jan 20", actual: 480, projected: 580 },
  { date: "Jan 25", actual: 520, projected: 570 },
  { date: "Today", actual: 495, projected: 560 },
]

const energyByServiceData = [
  { service: "Training Jobs", gpu: 4200, cpu: 1800, storage: 400 },
  { service: "Inference", gpu: 2800, cpu: 1200, storage: 200 },
  { service: "Fine-tuning", gpu: 1600, cpu: 600, storage: 150 },
  { service: "Data Processing", gpu: 800, cpu: 1400, storage: 350 },
  { service: "Model Serving", gpu: 1200, cpu: 800, storage: 100 },
]

const hourlyPatternData = [
  { hour: "00:00", consumption: 280 },
  { hour: "02:00", consumption: 220 },
  { hour: "04:00", consumption: 180 },
  { hour: "06:00", consumption: 250 },
  { hour: "08:00", consumption: 480 },
  { hour: "10:00", consumption: 620 },
  { hour: "12:00", consumption: 580 },
  { hour: "14:00", consumption: 640 },
  { hour: "16:00", consumption: 590 },
  { hour: "18:00", consumption: 450 },
  { hour: "20:00", consumption: 380 },
  { hour: "22:00", consumption: 320 },
]

export default function EnergyPage() {
  return (
    <div className="min-h-screen">
      <Header title="Energy Consumption" />
      
      <div className="dashboard-container">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Energy This Month"
            value="18.4 MWh"
            subtitle="Estimated consumption"
            change={{ value: "-5.3%", trend: "down" }}
            icon={Zap}
            iconColor="text-warning"
          />
          <KPICard
            title="Daily Average"
            value="612 kWh"
            subtitle="Per day consumption"
            change={{ value: "-8.1%", trend: "down" }}
            icon={Activity}
            iconColor="text-primary"
          />
          <KPICard
            title="Peak Usage"
            value="1.2 MW"
            subtitle="Maximum load recorded"
            change={{ value: "-2.4%", trend: "down" }}
            icon={TrendingDown}
            iconColor="text-accent"
          />
          <KPICard
            title="Active Infrastructure"
            value="156"
            subtitle="GPU/TPU instances"
            change={{ value: "+12", trend: "neutral" }}
            icon={Server}
            iconColor="text-success"
          />
        </div>

        {/* Energy Trend Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Energy Consumption Trend</CardTitle>
            <CardDescription>Actual vs projected daily consumption (kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyTrendData}>
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066b3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0066b3" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1a1a1a'
                    }} 
                  />
                  <Legend wrapperStyle={{ color: '#6b7280' }} />
                  <Area 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="#6b7280" 
                    fillOpacity={1}
                    fill="url(#projectedGradient)"
                    strokeDasharray="5 5"
                    name="Projected"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#0066b3" 
                    fillOpacity={1}
                    fill="url(#actualGradient)"
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid-responsive-2">
          {/* Energy by Service */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Energy by Service Type</CardTitle>
              <CardDescription>Breakdown by compute resource (kWh)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyByServiceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="service" type="category" stroke="#6b7280" fontSize={11} width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#1a1a1a'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: '#6b7280' }} />
                    <Bar dataKey="gpu" stackId="a" fill="#0066b3" name="GPU" />
                    <Bar dataKey="cpu" stackId="a" fill="#00a3a3" name="CPU" />
                    <Bar dataKey="storage" stackId="a" fill="#22c55e" name="Storage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Pattern */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Daily Usage Pattern</CardTitle>
              <CardDescription>Average hourly consumption (kWh)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyPatternData}>
                    <defs>
                      <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00a3a3" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00a3a3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#1a1a1a'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#00a3a3" 
                      fillOpacity={1}
                      fill="url(#hourlyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transparency Note */}
        <Card className="bg-secondary/30 border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Estimation Methodology</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Energy values are calculated using standardized estimation models. GPU energy is based on TDP ratings and utilization metrics. 
                  CPU energy uses server-level power monitoring where available, with estimates for remaining infrastructure. 
                  Storage energy accounts for active drives and cooling overhead. All values include a Power Usage Effectiveness (PUE) factor of 1.4.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
