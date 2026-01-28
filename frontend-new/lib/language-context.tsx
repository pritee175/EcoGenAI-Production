"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type LanguageMode = 'technical' | 'simple'

interface LanguageContextType {
  mode: LanguageMode
  toggleMode: () => void
  t: (technicalTerm: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations: Record<string, string> = {
  // AI & Tech Terms
  "Generative AI": "AI system",
  "Inference": "AI giving answers",
  "Training": "Teaching the AI",
  "Fine-tuning": "Improving the AI",
  "Model": "AI model",
  "Large Language Model": "Advanced AI",
  "LLM": "Advanced AI",
  "Prompt": "Question given to AI",
  "Token": "AI text unit",
  "API Call": "AI request",
  "Pipeline": "AI process",
  "Compute": "AI processing power",
  "Workload": "AI task",
  "Job": "AI task",
  
  // Hardware & Infrastructure
  "GPU": "AI power chip",
  "GPU Utilization": "AI power usage",
  "Idle GPU": "Unused AI power",
  "Compute Cluster": "Group of AI machines",
  "Server": "Computer system",
  "Data Center": "AI facility",
  "Cloud Region": "Location of servers",
  "Resource Allocation": "Power distribution",
  "Auto-scaling": "Automatic power adjustment",
  
  // Energy & Carbon
  "Energy Consumption": "Electricity used",
  "Carbon Footprint": "Pollution caused",
  "CO₂ Emissions": "Carbon pollution",
  "CO2 Emissions": "Carbon pollution",
  "Carbon Intensity": "Pollution level of electricity",
  "Peak Hours": "High electricity usage time",
  "Off-peak Hours": "Low electricity usage time",
  "Renewable Energy": "Clean energy",
  "Offset": "Pollution compensation",
  
  // ESG & Sustainability
  "ESG": "Sustainability score",
  "ESG Score": "Sustainability score",
  "Environmental Score": "Environmental performance",
  "Sustainability Metrics": "Green performance data",
  "Governance": "Rules & approvals",
  "Compliance": "Following rules",
  "Audit Trail": "Activity history",
  "Risk Exposure": "Business risk",
  "Climate Risk": "Future climate impact",
  "Regulatory Compliance": "Government rule adherence",
  
  // Optimization & Control
  "Optimization": "Ways to save energy",
  "Efficiency": "Better usage",
  "Recommendation": "Suggested improvement",
  "Recommendations": "Suggested improvements",
  "Automation": "Automatic system action",
  "Carbon Autopilot": "Automatic pollution control",
  "Scheduler": "Task planner",
  "Green-Time Scheduling": "Running AI at cleaner hours",
  "Right-sizing": "Using correct power",
  "Resource Waste": "Wasted electricity",
  
  // Reporting & Analytics
  "Analytics": "Data insights",
  "Trend Analysis": "Usage pattern",
  "Dashboard": "Control screen",
  "KPI": "Key numbers",
  "Benchmark": "Comparison standard",
  "Projection": "Future estimate",
  "Simulation": "Future scenario",
  "Forecast": "Prediction",
  
  // Cost & Business
  "Cost Optimization": "Saving money",
  "Operational Cost": "Running cost",
  "ROI": "Value gained",
  "Budget Threshold": "Spending limit",
  "Financial Impact": "Money effect",
  
  // Status & Actions
  "Active": "Running",
  "Pending": "Waiting",
  "Completed": "Finished",
  "Failed": "Did not work",
  "Approved": "Accepted",
  "Rejected": "Denied",
  "In Progress": "Working on it",
  
  // Common Terms
  "Real-time": "Live",
  "Historical": "Past",
  "Current": "Now",
  "Total": "All together",
  "Average": "Typical",
  "Peak": "Highest",
  "Minimum": "Lowest",
  "Maximum": "Highest",
  "Threshold": "Limit",
  "Alert": "Warning",
  "Notification": "Message",
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LanguageMode>('technical')

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('languageMode') as LanguageMode
    if (saved) {
      setMode(saved)
    }
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'technical' ? 'simple' : 'technical'
    setMode(newMode)
    localStorage.setItem('languageMode', newMode)
  }

  const t = (technicalTerm: string): string => {
    if (mode === 'simple' && translations[technicalTerm]) {
      return translations[technicalTerm]
    }
    return technicalTerm
  }

  return (
    <LanguageContext.Provider value={{ mode, toggleMode, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
