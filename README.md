# EcoGenAI - ESG Intelligence Platform

Enterprise-grade platform for AI sustainability monitoring and ESG compliance.

## 🎯 Overview

EcoGenAI is a comprehensive ESG (Environmental, Social, and Governance) intelligence platform that monitors AI workloads, calculates carbon footprints, and provides actionable insights for sustainable AI operations.

## 🚀 Features

- **Real-time AI Monitoring** - Track AI workloads with WebSocket updates
- **Energy Consumption Analysis** - Calculate and monitor energy usage (kWh)
- **Carbon Footprint Tracking** - CO₂ emissions by region with intensity factors
- **ESG Scoring** - Composite sustainability score (0-100)
- **Optimization Recommendations** - AI-powered suggestions for emission reduction
- **Climate Risk Analysis** - Future emission projections and risk assessment
- **Governance & Compliance** - Approval workflows and audit trails
- **Firebase Authentication** - Secure Google SSO and email/password login

## 📁 Project Structure

```
├── EcoGenAI/                    # Main backend + legacy frontend
│   ├── backend/                 # FastAPI backend
│   └── frontend/                # Legacy React frontend
├── final_frontened/             # Production Next.js frontend
│   ├── app/                     # Next.js 16 pages
│   ├── components/              # React components
│   └── lib/                     # Firebase & utilities
└── eco-gen-ai-enterprise-dashboard/  # Alternative dashboard
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite + SQLAlchemy
- **Real-time**: WebSocket
- **Language**: Python 3.9+

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Authentication**: Firebase
- **Animation**: Vanta.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Firebase account

### Backend Setup

```bash
cd EcoGenAI/backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd final_frontened
npm install
cp .env.local.example .env.local
# Add Firebase credentials to .env.local
npm run dev
```

Access the application:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔐 Firebase Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Google + Email/Password)
3. Get your Firebase config
4. Add credentials to `final_frontened/.env.local`

See `final_frontened/FIREBASE-SETUP-GUIDE.md` for detailed instructions.

## 📊 Dashboard Pages

1. **Dashboard** - Overview with KPIs and real-time stats
2. **AI Monitoring** - Workload tracking and management
3. **Energy** - Consumption analysis and trends
4. **Carbon** - Footprint tracking by region
5. **Optimization** - AI-powered recommendations
6. **ESG Score** - Sustainability scoring
7. **Governance** - Approval workflows
8. **Reports** - ESG report generation
9. **Climate Risk** - Risk assessment
10. **Auditor Bot** - AI-powered Q&A

## 🎨 Design

- **Theme**: Professional light theme
- **Colors**: Blue (#003781, #0066b3), Gray (#f5f5f5)
- **Layout**: Standard 1400px max-width
- **Responsive**: Mobile-friendly design

## 📝 Documentation

- **Frontend Setup**: `final_frontened/README.md`
- **Firebase Guide**: `final_frontened/FIREBASE-SETUP-GUIDE.md`
- **Quick Start**: `final_frontened/QUICK-START.md`
- **Backend API**: `EcoGenAI/backend/README.md`
- **Features**: `EcoGenAI/FEATURES-COMPLETE.md`

## 🧪 Testing

```bash
# Backend tests
cd EcoGenAI/backend
pytest

# Frontend tests
cd final_frontened
npm test

# Test all features
cd EcoGenAI
.\test-all-features.ps1
```

## 🚢 Deployment

### Backend
- Deploy to any Python hosting (AWS, GCP, Azure, Heroku)
- Set environment variables
- Run migrations
- Start with `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Frontend
- Deploy to Vercel, Netlify, or any Node.js hosting
- Set Firebase environment variables
- Build: `npm run build`
- Start: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software.

## 👥 Authors

- **pritee175** - Initial work

## 🙏 Acknowledgments

- Firebase for authentication
- Vanta.js for background animations
- shadcn/ui for component library
- Recharts for data visualization

---

**Built with ❤️ for sustainable AI**
