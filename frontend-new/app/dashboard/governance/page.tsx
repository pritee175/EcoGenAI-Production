"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  DollarSign,
  Leaf,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { useState } from "react"

const pendingApprovals = [
  {
    id: 1,
    title: "Migrate GPT-4 workloads to EU-North",
    type: "Region Shift",
    submittedBy: "Sarah Mueller",
    submittedAt: "2024-01-22 14:30",
    carbonSaving: "145 kg CO₂e/month",
    costImpact: "+€120/month",
    riskLevel: "Low",
    description: "Shifting GPT-4 inference from US-East to EU-North (Sweden) would reduce carbon by 65%.",
  },
  {
    id: 2,
    title: "Replace Llama-2-70B with Llama-2-13B",
    type: "Model Efficiency",
    submittedBy: "Thomas Weber",
    submittedAt: "2024-01-21 09:15",
    carbonSaving: "210 kg CO₂e/month",
    costImpact: "-€350/month",
    riskLevel: "Medium",
    description: "For document summarization tasks, the 13B model achieves 94% accuracy with 80% less energy.",
  },
]

const auditTrail = [
  {
    id: 1,
    action: "Approved",
    item: "Auto-shutdown idle inference endpoints",
    by: "Dr. Hans Richter",
    role: "ESG Director",
    date: "2024-01-20 16:45",
    status: "approved",
  },
  {
    id: 2,
    action: "Rejected",
    item: "Disable GPU monitoring for cost savings",
    by: "Dr. Hans Richter",
    role: "ESG Director",
    date: "2024-01-19 11:20",
    status: "rejected",
    reason: "Conflicts with ESG transparency requirements",
  },
  {
    id: 3,
    action: "Approved",
    item: "Enable green-time scheduling for training jobs",
    by: "Maria Schmidt",
    role: "Sustainability Manager",
    date: "2024-01-18 14:30",
    status: "approved",
  },
  {
    id: 4,
    action: "Approved",
    item: "Deploy carbon monitoring dashboard",
    by: "Dr. Hans Richter",
    role: "ESG Director",
    date: "2024-01-15 09:00",
    status: "approved",
  },
]

export default function GovernancePage() {
  const [approvals, setApprovals] = useState(pendingApprovals)
  const [generatingReport, setGeneratingReport] = useState(false)

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
  }

  const handleReject = (id: number) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
  }

  const handleGenerateReport = async (format: 'json' | 'csv') => {
    setGeneratingReport(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const endpoint = format === 'csv' 
        ? `${API_URL}/api/governance/reports/export/csv?period_days=30`
        : `${API_URL}/api/governance/reports/export/json?period_days=30`
      
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Failed to generate report')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `esg_report_30days.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setGeneratingReport(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Governance" />
      
      <div className="dashboard-container">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{approvals.length}</p>
                  <p className="text-xs text-muted-foreground">Pending Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Approved This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2</p>
                  <p className="text-xs text-muted-foreground">Rejected This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">98%</p>
                  <p className="text-xs text-muted-foreground">Compliance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Pending Approvals</CardTitle>
            <CardDescription>Optimization actions awaiting managerial review</CardDescription>
          </CardHeader>
          <CardContent>
            {approvals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                <p className="text-lg font-medium text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground">No pending approvals at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvals.map((approval) => (
                  <div 
                    key={approval.id}
                    className="rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-medium text-foreground">{approval.title}</h3>
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {approval.type}
                          </Badge>
                          <Badge variant="outline" className={
                            approval.riskLevel === "Low" ? "border-success/30 text-success" :
                            approval.riskLevel === "Medium" ? "border-warning/30 text-warning" :
                            "border-destructive/30 text-destructive"
                          }>
                            {approval.riskLevel} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{approval.description}</p>
                        
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{approval.submittedBy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{approval.submittedAt}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-success" />
                            <span className="text-xs font-medium text-success">{approval.carbonSaving}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className={`text-xs font-medium ${
                              approval.costImpact.startsWith("+") ? "text-warning" : "text-success"
                            }`}>{approval.costImpact}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-border bg-transparent"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
                          onClick={() => handleReject(approval.id)}
                        >
                          <ThumbsDown className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ESG Report Generation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">ESG Reports</CardTitle>
            <CardDescription>Generate comprehensive ESG compliance reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-secondary/20 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">Comprehensive ESG Report (Last 30 Days)</h3>
                    <p className="text-sm text-muted-foreground">
                      Includes executive summary, workload analysis, carbon footprint, energy consumption, 
                      cost analysis, and optimization recommendations.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-border bg-transparent"
                      onClick={() => handleGenerateReport('csv')}
                      disabled={generatingReport}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      {generatingReport ? 'Generating...' : 'Download CSV'}
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleGenerateReport('json')}
                      disabled={generatingReport}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      {generatingReport ? 'Generating...' : 'Download JSON'}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-secondary/10 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="h-4 w-4 text-success" />
                    <span className="text-xs font-medium text-muted-foreground">Carbon Tracking</span>
                  </div>
                  <p className="text-sm text-foreground">Complete CO₂e emissions data</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/10 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-warning" />
                    <span className="text-xs font-medium text-muted-foreground">Cost Analysis</span>
                  </div>
                  <p className="text-sm text-foreground">Financial impact breakdown</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/10 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Compliance</span>
                  </div>
                  <p className="text-sm text-foreground">Audit-ready documentation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Audit Trail</CardTitle>
            <CardDescription>Complete history of governance decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditTrail.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3"
                >
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    item.status === "approved" ? "bg-success/10" : "bg-destructive/10"
                  }`}>
                    {item.status === "approved" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-medium ${
                        item.status === "approved" ? "text-success" : "text-destructive"
                      }`}>
                        {item.action}
                      </span>
                      <span className="text-sm text-foreground truncate">{item.item}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.by}</span>
                      <span>•</span>
                      <span>{item.role}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                    {item.reason && (
                      <p className="mt-1 text-xs text-muted-foreground italic">Reason: {item.reason}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
