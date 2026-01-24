"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  Send,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  History,
  BookOpen,
  Shield,
  Search,
  Download,
  RefreshCw,
} from "lucide-react"

const suggestedQueries = [
  "What is our current CSRD compliance status?",
  "Summarize Q4 carbon emissions by region",
  "List pending governance actions",
  "Compare our ESG score to industry benchmarks",
  "What are the top optimization opportunities?",
  "Generate audit trail for AI workloads",
]

const recentAudits = [
  {
    id: 1,
    title: "Q4 2024 Carbon Emissions Audit",
    status: "completed",
    date: "2025-01-20",
    findings: 3,
    severity: "low",
  },
  {
    id: 2,
    title: "AI Workload Energy Compliance",
    status: "completed",
    date: "2025-01-18",
    findings: 1,
    severity: "medium",
  },
  {
    id: 3,
    title: "CSRD Documentation Review",
    status: "in-progress",
    date: "2025-01-22",
    findings: 0,
    severity: "pending",
  },
  {
    id: 4,
    title: "Governance Policy Validation",
    status: "completed",
    date: "2025-01-15",
    findings: 0,
    severity: "none",
  },
]

const complianceChecks = [
  { framework: "EU CSRD", status: "compliant", lastCheck: "2 hours ago" },
  { framework: "EU AI Act", status: "compliant", lastCheck: "4 hours ago" },
  { framework: "TCFD", status: "compliant", lastCheck: "1 day ago" },
  { framework: "GRI Standards", status: "review", lastCheck: "3 hours ago" },
]

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: string[]
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your ESG Auditor Assistant. I can help you with compliance queries, audit trails, regulatory documentation, and sustainability reporting. How can I assist you today?",
    timestamp: new Date(),
  },
]

export default function AuditorBotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, { content: string; sources: string[] }> = {
        csrd: {
          content: "Based on my analysis of your current documentation and metrics:\n\n**CSRD Compliance Status: 94%**\n\n**Completed Requirements:**\n- Double materiality assessment\n- Climate-related disclosures (ESRS E1)\n- Governance structure documentation\n- Value chain mapping\n\n**Pending Items:**\n- Biodiversity impact assessment (ESRS E4) - Due Feb 2025\n- Social metrics validation (ESRS S1) - In review\n\n**Recommendation:** Focus on completing biodiversity impact assessment to maintain full compliance ahead of the reporting deadline.",
          sources: ["CSRD Compliance Matrix", "Q4 2024 ESG Report", "Regulatory Tracker"],
        },
        carbon: {
          content: "**Q4 2024 Carbon Emissions Summary by Region:**\n\n| Region | Scope 1 | Scope 2 | Scope 3 | Total | vs Q3 |\n|--------|---------|---------|---------|-------|-------|\n| EMEA | 1,245 | 3,420 | 8,560 | 13,225 | -8% |\n| APAC | 890 | 2,890 | 6,230 | 10,010 | -5% |\n| Americas | 1,120 | 3,150 | 7,890 | 12,160 | -12% |\n\n**Key Insights:**\n- Overall 8.3% reduction vs Q3\n- Americas showed strongest improvement due to renewable energy transition\n- APAC Scope 3 needs attention - supplier engagement recommended\n\n**Audit Trail:** All data verified against energy bills, travel records, and supplier reports.",
          sources: ["Carbon Tracking System", "Energy Management Platform", "Supplier Portal"],
        },
        governance: {
          content: "**Pending Governance Actions:**\n\n1. **AI Ethics Policy Update** (High Priority)\n   - Status: Awaiting board approval\n   - Due: January 31, 2025\n   - Owner: Chief Ethics Officer\n\n2. **ESG Committee Charter Review** (Medium Priority)\n   - Status: In legal review\n   - Due: February 15, 2025\n   - Owner: General Counsel\n\n3. **Whistleblower Procedure Enhancement** (Low Priority)\n   - Status: Draft completed\n   - Due: March 1, 2025\n   - Owner: Compliance Team\n\n**Total: 3 pending actions | 0 overdue**",
          sources: ["Governance Action Tracker", "Board Meeting Minutes", "Policy Repository"],
        },
        default: {
          content: "I've analyzed your query and gathered relevant information from our ESG data systems. Based on the current metrics and documentation, I can provide detailed insights on compliance status, audit trails, and sustainability performance.\n\nWould you like me to:\n1. Generate a detailed report on this topic?\n2. Create an audit trail document?\n3. Compare with industry benchmarks?\n4. Identify improvement opportunities?",
          sources: ["ESG Database", "Compliance Tracker", "Performance Metrics"],
        },
      }

      let responseData = responses.default
      const lowerInput = input.toLowerCase()
      if (lowerInput.includes("csrd") || lowerInput.includes("compliance")) {
        responseData = responses.csrd
      } else if (lowerInput.includes("carbon") || lowerInput.includes("emission")) {
        responseData = responses.carbon
      } else if (lowerInput.includes("governance") || lowerInput.includes("pending")) {
        responseData = responses.governance
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: responseData.content,
        timestamp: new Date(),
        sources: responseData.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ESG Auditor Bot</h1>
          <p className="text-muted-foreground">AI-powered compliance assistant and audit trail generator</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border bg-transparent">
            <History className="mr-2 h-4 w-4" />
            Audit History
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            <BookOpen className="mr-2 h-4 w-4" />
            Documentation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Audit Assistant</CardTitle>
                  <CardDescription>Ask questions about compliance, audits, and ESG metrics</CardDescription>
                </div>
                <Badge className="ml-auto bg-success/20 text-success border-success/30">
                  <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                  Online
                </Badge>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.sources && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.sources.map((source) => (
                              <Badge key={source} variant="secondary" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-foreground">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Analyzing data...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedQueries.slice(0, 3).map((query) => (
                  <Button
                    key={query}
                    variant="outline"
                    size="sm"
                    className="text-xs border-border bg-transparent"
                    onClick={() => setInput(query)}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    {query.length > 30 ? query.slice(0, 30) + "..." : query}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about compliance, audits, or ESG metrics..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="bg-muted border-border"
                />
                <Button onClick={handleSend} disabled={isLoading} className="bg-primary text-primary-foreground">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compliance Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Live Compliance Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceChecks.map((check) => (
                <div key={check.framework} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {check.status === "compliant" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Clock className="h-4 w-4 text-warning" />
                    )}
                    <span className="text-sm text-foreground">{check.framework}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{check.lastCheck}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Audits */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-foreground">Recent Audits</CardTitle>
                <Button variant="ghost" size="sm" className="h-8">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAudits.map((audit) => (
                <div key={audit.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{audit.title}</p>
                    {audit.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-warning flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{audit.date}</span>
                    {audit.findings > 0 && (
                      <Badge
                        className={
                          audit.severity === "low"
                            ? "bg-success/20 text-success border-success/30 text-xs"
                            : audit.severity === "medium"
                            ? "bg-warning/20 text-warning border-warning/30 text-xs"
                            : "bg-muted text-muted-foreground text-xs"
                        }
                      >
                        {audit.findings} findings
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-border bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Generate Audit Report
              </Button>
              <Button variant="outline" className="w-full justify-start border-border bg-transparent">
                <Shield className="mr-2 h-4 w-4" />
                Run Compliance Check
              </Button>
              <Button variant="outline" className="w-full justify-start border-border bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Audit Trail
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
