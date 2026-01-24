# AI Sustainability Auditor Bot - User Guide

## 🤖 Overview

The AI Sustainability Auditor Bot is a natural language Q&A interface that helps ESG teams understand carbon emissions, energy consumption, and sustainability metrics without technical expertise.

## 🎯 Purpose

- **Democratize ESG Data**: Make sustainability metrics accessible to non-technical stakeholders
- **Explain Trends**: Provide clear explanations for emission changes
- **Support Decision-Making**: Offer data-driven insights for ESG strategy
- **Ensure Transparency**: Show supporting data for all answers

## 📍 Access

**Frontend URL**: http://localhost:3001/auditor  
**Navigation**: Click "Auditor Bot" in the main navigation menu

## 💬 How to Use

### 1. **Ask Questions in Natural Language**
Simply type your question in plain English. The bot understands context and intent.

### 2. **Use Quick Questions**
Click on recommended questions in the sidebar for instant answers.

### 3. **Review Supporting Data**
Each answer includes supporting data for transparency and verification.

### 4. **Monitor Real-Time Trends**
The sidebar shows current emission trends updated in real-time.

## 📝 Example Questions

### **Emission Trends**
- "Why did emissions increase this week?"
- "Why did emissions decrease this month?"
- "Explain the emission trends"
- "What caused the carbon spike?"

### **Current Metrics**
- "How much carbon have we emitted today?"
- "What is our current total carbon emissions?"
- "What is our total energy consumption?"
- "Show me today's carbon footprint"

### **Model Analysis**
- "Which model has the highest emissions?"
- "Which AI model is most energy-intensive?"
- "What are the top contributing models?"
- "Which model should we optimize first?"

### **Regional Analysis**
- "Which region has the highest carbon footprint?"
- "Where are most emissions coming from?"
- "Which cloud region is most carbon-intensive?"
- "What region should we avoid?"

### **General Queries**
- "Explain our sustainability metrics"
- "What is our ESG performance?"
- "How can we reduce emissions?"
- "What are our optimization opportunities?"

## 🎨 Interface Features

### **Chat Area**
- **User Messages**: Green bubbles on the right
- **Bot Responses**: Gray bubbles on the left
- **Supporting Data**: Expandable data sections with JSON details
- **Timestamps**: Each message shows when it was sent

### **Sidebar**
- **Quick Questions**: 5 recommended questions for instant answers
- **Current Trends**: Real-time emission trend indicators
  - Trend Direction (📈 Increasing / 📉 Decreasing / ➡️ Stable)
  - Change Percentage (7-day comparison)
  - Total Emissions (kg CO₂)
- **How to Use**: Quick help guide

### **Input Area**
- Type your question
- Press Enter or click "Ask" button
- Bot responds within seconds

## 🔍 Question Types Supported

### 1. **Trend Analysis**
**Keywords**: why, increase, decrease, rise, fall, trend  
**Example**: "Why did emissions increase this week?"  
**Response**: Detailed explanation with percentage change, top contributors, and recommendations

### 2. **Current Metrics**
**Keywords**: how much, total, current, today  
**Example**: "How much carbon have we emitted today?"  
**Response**: Current totals for carbon (kg CO₂) and energy (kWh)

### 3. **Model Analysis**
**Keywords**: which, model, highest, most  
**Example**: "Which model has the highest emissions?"  
**Response**: Top model with emission data and comparison

### 4. **Regional Analysis**
**Keywords**: region, where, location  
**Example**: "Which region has the highest carbon footprint?"  
**Response**: Top region with carbon intensity explanation

### 5. **General Queries**
**Fallback**: Any other question  
**Response**: General sustainability overview with suggestions

## 📊 Supporting Data Format

Each answer includes structured supporting data:

```json
{
  "current_total_kg": 123.45,
  "previous_total_kg": 98.76,
  "change_percentage": 25.0,
  "trend": "increasing",
  "top_contributing_models": [
    {"model": "GPT-4", "carbon_kg": 45.67}
  ],
  "top_contributing_regions": [
    {"region": "us-east-1", "carbon_kg": 67.89}
  ]
}
```

## 🔄 Real-Time Updates

The Auditor Bot connects to the WebSocket server for real-time updates:

- **Live Indicator**: Green dot = connected, Red dot = disconnected
- **Automatic Refresh**: Trends update when new workloads are created/stopped
- **No Manual Refresh**: Data stays current automatically

## 🎯 Use Cases

### **ESG Reporting**
- "Generate a summary of this week's emissions"
- "What should I include in the ESG report?"
- "Explain our carbon reduction progress"

### **Stakeholder Communication**
- "How do I explain the emission increase to leadership?"
- "What are our key sustainability achievements?"
- "Summarize our environmental impact"

### **Operational Decisions**
- "Which workloads should we optimize first?"
- "What regions should we prioritize?"
- "How can we reduce costs and emissions?"

### **Compliance & Audit**
- "Show me the methodology for carbon calculations"
- "What data supports our ESG claims?"
- "Explain how we measure sustainability"

## 🛠️ Technical Details

### **Backend API**
- **Endpoint**: `/api/auditor/ask`
- **Method**: POST
- **Request**: `{ "question": "your question here" }`
- **Response**: `{ "answer": "...", "supporting_data": {...} }`

### **Data Sources**
- AI Workload database
- Energy Usage calculations
- Carbon Emission records
- Historical trend analysis (7-day default)

### **Analysis Period**
- Default: 7 days
- Configurable via API parameters
- Real-time data for current metrics

## 💡 Tips for Best Results

1. **Be Specific**: "Why did emissions increase this week?" is better than "Why increase?"
2. **Use Keywords**: Include words like "model", "region", "emissions", "carbon"
3. **Ask Follow-ups**: Build on previous answers with related questions
4. **Check Supporting Data**: Review the data to understand the full context
5. **Use Quick Questions**: Start with recommended questions to learn the system

## 🚀 Advanced Features

### **Contextual Understanding**
The bot understands variations of the same question:
- "Why did emissions go up?" = "Why did emissions increase?"
- "Which model uses most energy?" = "Which model has highest emissions?"
- "Where are emissions highest?" = "Which region has highest carbon footprint?"

### **Multi-Factor Analysis**
Answers consider multiple factors:
- Model type and efficiency
- Regional carbon intensity
- Workload duration and frequency
- Historical trends and patterns

### **Explainable AI**
All answers include:
- Clear reasoning
- Supporting data
- Actionable recommendations
- Methodology transparency

## 📈 Integration with Other Features

The Auditor Bot integrates with:
- **Dashboard**: Real-time workload data
- **Carbon Footprint**: Regional emission data
- **Optimization**: Recommendation context
- **Governance**: Audit trail information
- **ESG Score**: Sustainability metrics

## 🎓 Training & Onboarding

### **For ESG Teams**
- Start with quick questions
- Learn common query patterns
- Understand supporting data format
- Practice explaining to stakeholders

### **For Leadership**
- Use for executive summaries
- Get quick answers during meetings
- Understand trends at a glance
- Make data-driven decisions

### **For Compliance Officers**
- Verify calculation methodologies
- Access audit trail data
- Generate compliance reports
- Ensure regulatory alignment

## 📞 Support

For questions or issues:
- Check the "How to Use" section in the sidebar
- Review recommended questions for examples
- Contact the EcoGenAI support team
- Refer to the main documentation

---

**Last Updated**: January 24, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
