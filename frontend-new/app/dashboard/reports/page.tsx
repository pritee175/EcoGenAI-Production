"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  FileBarChart,
  FileSpreadsheet,
  FilePieChart,
  Search,
  Filter,
  Plus,
  Eye,
  Share2,
  Sparkles,
} from "lucide-react"

const recentReports = [
  {
    id: 1,
    name: "Q4 2024 ESG Performance Report",
    type: "Quarterly Report",
    format: "PDF",
    size: "4.2 MB",
    date: "2025-01-15",
    status: "published",
    downloads: 156,
  },
  {
    id: 2,
    name: "AI Carbon Footprint Analysis - December",
    type: "Monthly Analysis",
    format: "XLSX",
    size: "2.8 MB",
    date: "2025-01-10",
    status: "published",
    downloads: 89,
  },
  {
    id: 3,
    name: "CSRD Compliance Documentation",
    type: "Regulatory Filing",
    format: "PDF",
    size: "12.5 MB",
    date: "2025-01-08",
    status: "published",
    downloads: 234,
  },
  {
    id: 4,
    name: "Sustainability Audit Trail Q4",
    type: "Audit Report",
    format: "PDF",
    size: "8.1 MB",
    date: "2025-01-05",
    status: "draft",
    downloads: 0,
  },
  {
    id: 5,
    name: "Energy Optimization ROI Analysis",
    type: "Financial Report",
    format: "XLSX",
    size: "1.9 MB",
    date: "2025-01-03",
    status: "published",
    downloads: 67,
  },
]

const scheduledReports = [
  {
    id: 1,
    name: "Weekly AI Workload Summary",
    frequency: "Weekly",
    nextRun: "2025-01-27",
    recipients: 12,
    format: "PDF",
  },
  {
    id: 2,
    name: "Monthly Carbon Emissions Report",
    frequency: "Monthly",
    nextRun: "2025-02-01",
    recipients: 28,
    format: "PDF + XLSX",
  },
  {
    id: 3,
    name: "Quarterly ESG Board Summary",
    frequency: "Quarterly",
    nextRun: "2025-04-01",
    recipients: 8,
    format: "PDF",
  },
  {
    id: 4,
    name: "Daily Energy Consumption Alert",
    frequency: "Daily",
    nextRun: "2025-01-25",
    recipients: 5,
    format: "Email",
  },
]

const reportTemplates = [
  {
    id: 1,
    name: "ESG Executive Summary",
    description: "High-level overview for leadership and board",
    icon: FilePieChart,
    popular: true,
  },
  {
    id: 2,
    name: "Carbon Footprint Analysis",
    description: "Detailed emissions breakdown by source",
    icon: FileBarChart,
    popular: true,
  },
  {
    id: 3,
    name: "Regulatory Compliance Report",
    description: "CSRD, TCFD, and GRI standard compliance",
    icon: FileText,
    popular: false,
  },
  {
    id: 4,
    name: "AI Sustainability Metrics",
    description: "AI workload energy and carbon tracking",
    icon: FileSpreadsheet,
    popular: true,
  },
  {
    id: 5,
    name: "Audit Trail Documentation",
    description: "Complete audit history and evidence",
    icon: FileText,
    popular: false,
  },
  {
    id: 6,
    name: "Stakeholder Impact Report",
    description: "Social and community impact analysis",
    icon: FilePieChart,
    popular: false,
  },
]

export default function ReportsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Reports" />
      <div className="dashboard-container">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate, schedule, and manage ESG reports</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reports Generated</p>
                  <p className="text-2xl font-bold text-foreground">247</p>
                  <p className="text-xs text-success">This year</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold text-foreground">1,842</p>
                  <p className="text-xs text-success">+12% vs last month</p>
                </div>
                <div className="p-3 rounded-lg bg-success/20">
                  <Download className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Reports</p>
                  <p className="text-2xl font-bold text-foreground">18</p>
                  <p className="text-xs text-muted-foreground">Active schedules</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/20">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI-Generated</p>
                  <p className="text-2xl font-bold text-foreground">89</p>
                  <p className="text-xs text-primary">Automated insights</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Recent Reports</CardTitle>
                    <CardDescription>View and download generated reports</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search reports..." className="pl-9 w-64 bg-muted border-border" />
                    </div>
                    <Button variant="outline" size="icon" className="border-border bg-transparent">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">{report.type}</span>
                            <span className="text-xs text-muted-foreground">{report.format}</span>
                            <span className="text-xs text-muted-foreground">{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{report.date}</p>
                          <p className="text-xs text-muted-foreground">{report.downloads} downloads</p>
                        </div>
                        <Badge
                          className={
                            report.status === "published"
                              ? "bg-success/20 text-success border-success/30"
                              : "bg-warning/20 text-warning border-warning/30"
                          }
                        >
                          {report.status === "published" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {report.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Scheduled Reports</CardTitle>
                    <CardDescription>Automated report generation schedules</CardDescription>
                  </div>
                  <Button variant="outline" className="border-border bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    New Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduledReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {report.frequency}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{report.format}</span>
                            <span className="text-xs text-muted-foreground">{report.recipients} recipients</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Next run</p>
                          <p className="text-sm font-medium text-foreground">{report.nextRun}</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-border bg-transparent">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Report Templates</CardTitle>
                <CardDescription>Pre-configured templates for common ESG reporting needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <template.icon className="h-5 w-5 text-primary" />
                        </div>
                        {template.popular && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <Button variant="outline" size="sm" className="w-full border-border bg-transparent">
                        Use Template
                      </Button>
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
