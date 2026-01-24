# EcoGenAI Dashboard - Next.js Frontend

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

The dashboard will be available at: http://localhost:3000

## Features

- **Real-time Updates**: WebSocket connection for live workload monitoring
- **Enterprise UI**: Allianz-branded blue theme with professional styling
- **Interactive Charts**: Region distribution visualization using Recharts
- **Live Metrics**: Auto-updating runtime counters and GPU usage stats

## Architecture

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Recharts**: Data visualization library
- **WebSockets**: Real-time data streaming from FastAPI backend
