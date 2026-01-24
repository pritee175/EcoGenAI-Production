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
EcoGenAI/
├── backend/          # FastAPI backend with AI workload monitoring
├── frontend-new/     # Production Next.js frontend with Firebase auth
├── VERCEL-DEPLOYMENT.md  # Deployment guide for Vercel
└── README.md         # This file
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
cd frontend-new
npm install
# Add Firebase credentials to .env.local (see FIREBASE-SETUP-GUIDE.md)
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
4. Add credentials to `frontend-new/.env.local`

See `frontend-new/FIREBASE-SETUP-GUIDE.md` for detailed instructions.

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

- **Deployment Guide**: `VERCEL-DEPLOYMENT.md`
- **Frontend Setup**: `frontend-new/README.md`
- **Firebase Guide**: `frontend-new/FIREBASE-SETUP-GUIDE.md`
- **Quick Start**: `frontend-new/QUICK-START.md`
- **Backend API**: `backend/README.md`

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend-new
npm test
```

## 🚢 Deployment

See `VERCEL-DEPLOYMENT.md` for complete deployment instructions.

### Backend
- Deploy to Railway, Render, Heroku, AWS, or any Python hosting
- Set environment variables from `.env`
- Run: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Frontend
- Deploy to Vercel (recommended) - see `VERCEL-DEPLOYMENT.md`
- Set Firebase environment variables
- Root directory: `frontend-new`
- Build: `npm run build`

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
