"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  TrendingUp,
  Shield,
  FileText,
  ChevronRight,
  Globe,
  Building2,
} from "lucide-react"
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
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

const climateProjections = [
  { year: "2025", baseline: 100, optimistic: 98, pessimistic: 105 },
  { year: "2030", baseline: 115, optimistic: 105, pessimistic: 135 },
  { year: "2035", baseline: 125, optimistic: 110, pessimistic: 160 },
  { year: "2040", baseline: 140, optimistic: 115, pessimistic: 195 },
  { year: "2045", baseline: 155, optimistic: 120, pessimistic: 240 },
  { year: "2050", baseline: 170, optimistic: 125, pessimistic: 300 },
]

const regionalRisks = [
  { region: "Frankfurt", physical: 35, transition: 45, total: 80 },
  { region: "Munich", physical: 40, transition: 42, total: 82 },
  { region: "Singapore", physical: 65, transition: 30, total: 95 },
  { region: "London", physical: 30, transition: 50, total: 80 },
  { region: "New York", physical: 45, transition: 48, total: 93 },
  { region: "Sydney", physical: 70, transition: 35, total: 105 },
]

const assetExposure = [
  { name: "Data Center A", exposure: 850, risk: 72, category: "high" },
  { name: "Data Center B", exposure: 620, risk: 45, category: "medium" },
  { name: "Cloud Region EU", exposure: 1200, risk: 38, category: "low" },
  { name: "Cloud Region APAC", exposure: 980, risk: 68, category: "high" },
  { name: "Data Center C", exposure: 450, risk: 52, category: "medium" },
  { name: "Edge Network", exposure: 280, risk: 25, category: "low" },
]

const physicalRisks = [
  {
    type: "Heat Stress",
    icon: Thermometer,
    current: "Medium",
    projected: "High",
    impact: "Increased cooling costs, potential service disruption",
    mitigation: "Implement advanced cooling, relocate to cooler regions",
  },
  {
    type: "Flooding",
    icon: Droplets,
    current: "Low",
    projected: "Medium",
    impact: "Infrastructure damage, data loss risk",
    mitigation: "Elevated facilities, backup systems, insurance",
  },
  {
    type: "Extreme Weather",
    icon: Wind,
    current: "Medium",
    projected: "High",
    impact: "Power outages, supply chain disruption",
    mitigation: "Redundant power, distributed architecture",
  },
]

const transitionRisks = [
  {
    type: "Carbon Pricing",
    probability: 85,
    impact: "High",
    timeline: "2025-2030",
    financialImpact: "$12-18M annually",
  },
  {
    type: "Regulatory Changes",
    probability: 90,
    impact: "High",
    timeline: "2024-2026",
    financialImpact: "$5-8M compliance costs",
  },
  {
    type: "Technology Shifts",
    probability: 75,
    impact: "Medium",
    timeline: "2025-2035",
    financialImpact: "$20-30M capex required",
  },
  {
    type: "Market Sentiment",
    probability: 70,
    impact: "Medium",
    timeline: "Ongoing",
    financialImpact: "Reputational value at risk",
  },
]

const scenarioAnalysis = [
  { scenario: "Net Zero 2050", tempRise: "1.5°C", probability: 25, portfolioImpact: -5 },
  { scenario: "Below 2°C", tempRise: "1.8°C", probability: 35, portfolioImpact: -12 },
  { scenario: "Current Policies", tempRise: "2.7°C", probability: 30, portfolioImpact: -28 },
  { scenario: "Worst Case", tempRise: "4.0°C", probability: 10, portfolioImpact: -45 },
]

export default function ClimateRiskPage() {
  return (
    <div className="min-h-screen">
      <Header title="Climate Risk" />
      <div className="dashboard-container">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Climate Risk Assessment</h1>
            <p className="text-muted-foreground">TCFD-aligned climate risk analysis and scenario modeling</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileText className="mr-2 h-4 w-4" />
            Generate TCFD Report
          </Button>
        </div>

        {/* Risk Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                  <p className="text-2xl font-bold text-foreground">Medium-High</p>
                  <p className="text-xs text-warning">Score: 62/100</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/20">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Physical Risk</p>
                  <p className="text-2xl font-bold text-foreground">45/100</p>
                  <p className="text-xs text-success">Manageable</p>
                </div>
                <div className="p-3 rounded-lg bg-destructive/20">
                  <Thermometer className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transition Risk</p>
                  <p className="text-2xl font-bold text-foreground">68/100</p>
                  <p className="text-xs text-warning">Elevated</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resilience Score</p>
                  <p className="text-2xl font-bold text-foreground">76/100</p>
                  <p className="text-xs text-success">Above Average</p>
                </div>
                <div className="p-3 rounded-lg bg-success/20">
                  <Shield className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projections" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="projections">Climate Projections</TabsTrigger>
            <TabsTrigger value="physical">Physical Risks</TabsTrigger>
            <TabsTrigger value="transition">Transition Risks</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="projections" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Climate Impact Projections</CardTitle>
                  <CardDescription>Indexed operational cost impact under different scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={climateProjections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
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
                          dataKey="pessimistic"
                          name="Pessimistic"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.2}
                        />
                        <Area
                          type="monotone"
                          dataKey="baseline"
                          name="Baseline"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="optimistic"
                          name="Optimistic"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.4}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Regional Risk Distribution</CardTitle>
                  <CardDescription>Physical vs transition risk by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionalRisks} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" fontSize={12} />
                        <YAxis dataKey="region" type="category" stroke="#6b7280" fontSize={12} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#1a1a1a'
                          }}
                        />
                        <Bar dataKey="physical" name="Physical Risk" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="transition" name="Transition Risk" stackId="a" fill="#0066b3" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Asset Exposure Map</CardTitle>
                <CardDescription>Climate risk exposure by asset value and risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="exposure"
                        name="Exposure ($M)"
                        stroke="#6b7280"
                        fontSize={12}
                        label={{ value: "Asset Value ($M)", position: "bottom", fill: "#6b7280" }}
                      />
                      <YAxis
                        dataKey="risk"
                        name="Risk Score"
                        stroke="#6b7280"
                        fontSize={12}
                        label={{ value: "Risk Score", angle: -90, position: "left", fill: "#6b7280" }}
                      />
                      <ZAxis range={[100, 500]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          color: "#1a1a1a"
                        }}
                        formatter={(value, name) => [value, name === "exposure" ? "Value ($M)" : "Risk Score"]}
                      />
                      <Scatter name="Assets" data={assetExposure}>
                        {assetExposure.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.category === "high"
                                ? "#ef4444"
                                : entry.category === "medium"
                                ? "#f59e0b"
                                : "#22c55e"
                            }
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physical" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {physicalRisks.map((risk) => (
                <Card key={risk.type} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/20">
                        <risk.icon className="h-5 w-5 text-destructive" />
                      </div>
                      <CardTitle className="text-lg text-foreground">{risk.type}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Level</p>
                        <Badge
                          className={
                            risk.current === "Low"
                              ? "bg-success/20 text-success border-success/30"
                              : risk.current === "Medium"
                              ? "bg-warning/20 text-warning border-warning/30"
                              : "bg-destructive/20 text-destructive border-destructive/30"
                          }
                        >
                          {risk.current}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">2050 Projected</p>
                        <Badge
                          className={
                            risk.projected === "Low"
                              ? "bg-success/20 text-success border-success/30"
                              : risk.projected === "Medium"
                              ? "bg-warning/20 text-warning border-warning/30"
                              : "bg-destructive/20 text-destructive border-destructive/30"
                          }
                        >
                          {risk.projected}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Potential Impact</p>
                      <p className="text-sm text-foreground">{risk.impact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mitigation Strategy</p>
                      <p className="text-sm text-success">{risk.mitigation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transition" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Transition Risk Assessment</CardTitle>
                <CardDescription>Risks from transitioning to a low-carbon economy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transitionRisks.map((risk) => (
                    <div key={risk.type} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-foreground">{risk.type}</span>
                          <Badge
                            className={
                              risk.impact === "High"
                                ? "bg-destructive/20 text-destructive border-destructive/30"
                                : "bg-warning/20 text-warning border-warning/30"
                            }
                          >
                            {risk.impact} Impact
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{risk.timeline}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Probability</p>
                          <div className="flex items-center gap-2">
                            <Progress value={risk.probability} className="flex-1 h-2" />
                            <span className="text-sm text-foreground">{risk.probability}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Financial Impact</p>
                          <p className="text-sm font-medium text-foreground">{risk.financialImpact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Climate Scenario Analysis</CardTitle>
                <CardDescription>Portfolio impact under different climate scenarios (NGFS aligned)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarioAnalysis.map((scenario) => (
                    <div key={scenario.scenario} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{scenario.scenario}</h4>
                          <p className="text-sm text-muted-foreground">Temperature rise: {scenario.tempRise}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Probability</p>
                          <p className="text-lg font-bold text-foreground">{scenario.probability}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Portfolio Impact by 2050</p>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-full ${
                                scenario.portfolioImpact > -15
                                  ? "bg-success"
                                  : scenario.portfolioImpact > -30
                                  ? "bg-warning"
                                  : "bg-destructive"
                              }`}
                              style={{ width: `${100 + scenario.portfolioImpact}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
