"use client"

import { Header } from "@/components/dashboard/header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingDown, Globe, Factory } from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

const carbonByModelData = [
  { model: "GPT-4-Turbo", carbon: 892, baseline: 1200 },
  { model: "Claude-3", carbon: 654, baseline: 850 },
  { model: "Llama-2-70B", carbon: 423, baseline: 580 },
  { model: "Gemini-Pro", carbon: 312, baseline: 420 },
  { model: "Mistral-7B", carbon: 156, baseline: 210 },
]

const regionCarbonData = [
  { region: "EU-West (Ireland)", carbon: 285, intensity: 0.28, source: "45% Renewable" },
  { region: "EU-North (Sweden)", carbon: 142, intensity: 0.14, source: "92% Renewable" },
  { region: "US-East (Virginia)", carbon: 534, intensity: 0.52, source: "22% Renewable" },
  { region: "US-West (Oregon)", carbon: 312, intensity: 0.31, source: "68% Renewable" },
  { region: "APAC (Singapore)", carbon: 478, intensity: 0.47, source: "18% Renewable" },
]

const monthlyTrendData = [
  { month: "Aug", emissions: 4.8, offset: 0.2, net: 4.6 },
  { month: "Sep", emissions: 4.5, offset: 0.3, net: 4.2 },
  { month: "Oct", emissions: 4.2, offset: 0.4, net: 3.8 },
  { month: "Nov", emissions: 3.9, offset: 0.5, net: 3.4 },
  { month: "Dec", emissions: 3.7, offset: 0.6, net: 3.1 },
  { month: "Jan", emissions: 3.5, offset: 0.7, net: 2.8 },
]

const scopeData = [
  { scope: "Scope 1", value: 5 },
  { scope: "Scope 2", value: 75 },
  { scope: "Scope 3", value: 20 },
]

export default function CarbonPage() {
  return (
    <div className="min-h-screen">
      <Header title="Carbon Footprint" />
      
      <div className="dashboard-container">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total CO₂ Emissions"
            value="4.2 tCO₂e"
            subtitle="This month"
            change={{ value: "-12.1%", trend: "down" }}
            icon={Leaf}
            iconColor="text-success"
          />
          <KPICard
            title="Carbon Intensity"
            value="0.23 kg/kWh"
            subtitle="Weighted average"
            change={{ value: "-8.5%", trend: "down" }}
            icon={Factory}
            iconColor="text-warning"
          />
          <KPICard
            title="Offset Credits"
            value="0.7 tCO₂e"
            subtitle="Purchased this month"
            change={{ value: "+40%", trend: "up" }}
            icon={TrendingDown}
            iconColor="text-accent"
          />
          <KPICard
            title="Regions Monitored"
            value="12"
            subtitle="Across 4 continents"
            change={{ value: "+2", trend: "up" }}
            icon={Globe}
            iconColor="text-primary"
          />
        </div>

        {/* Carbon by Region */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Regional Carbon Impact</CardTitle>
            <CardDescription>CO₂ emissions by deployment region (kg CO₂e)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Carbon (kg)</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Grid Intensity</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Energy Mix</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Impact Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {regionCarbonData.map((region, index) => (
                    <tr key={index} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-4 font-medium text-foreground">{region.region}</td>
                      <td className="py-4 font-mono text-foreground">{region.carbon}</td>
                      <td className="py-4 text-muted-foreground">{region.intensity} kg/kWh</td>
                      <td className="py-4 text-muted-foreground">{region.source}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 max-w-24 rounded-full bg-secondary">
                            <div 
                              className={`h-2 rounded-full ${
                                region.intensity < 0.2 ? 'bg-success' :
                                region.intensity < 0.4 ? 'bg-warning' : 'bg-destructive'
                              }`}
                              style={{ width: `${Math.min(region.intensity * 200, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            region.intensity < 0.2 ? 'text-success' :
                            region.intensity < 0.4 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {region.intensity < 0.2 ? 'Low' : region.intensity < 0.4 ? 'Medium' : 'High'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid-responsive-2">
          {/* Carbon by Model */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Emissions by AI Model</CardTitle>
              <CardDescription>Actual vs baseline carbon footprint (kg CO₂e)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={carbonByModelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" fontSize={10} />
                    <YAxis dataKey="model" type="category" stroke="#6b7280" fontSize={10} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#1a1a1a',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: '#6b7280', fontSize: '12px' }} />
                    <Bar dataKey="baseline" fill="#e5e7eb" name="Baseline" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="carbon" fill="#22c55e" name="Actual" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Carbon Trend</CardTitle>
              <CardDescription>Emissions, offsets, and net carbon (tCO₂e)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
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
                    <Bar dataKey="emissions" fill="#0066b3" name="Emissions" />
                    <Bar dataKey="offset" fill="#00a3a3" name="Offsets" />
                    <Line type="monotone" dataKey="net" stroke="#22c55e" strokeWidth={2} name="Net Carbon" dot={{ fill: '#22c55e' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transparency Note */}
        <Card className="bg-secondary/30 border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-success/10">
                <Leaf className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Carbon Intensity Assumptions</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Carbon intensity values are sourced from regional grid operators and updated monthly. Scope 2 emissions (purchased electricity) 
                  are calculated using location-based methods. Scope 3 emissions include upstream fuel and transmission losses. 
                  Carbon offset credits are verified through Gold Standard and Verra registries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
