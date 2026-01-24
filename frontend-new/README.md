# EcoGenAI Frontend

Production Next.js frontend for the EcoGenAI ESG Intelligence Platform.

## Features

- Firebase Authentication (Google SSO + Email/Password)
- Vanta.js animated background
- 10 dashboard pages with real-time updates
- Professional UI with Tailwind CSS
- Responsive design

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Add Firebase credentials to .env.local
npm run dev
```

Open http://localhost:3001

## Firebase Setup

See `FIREBASE-SETUP-GUIDE.md` for detailed instructions.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Firebase Auth
- Recharts
- Vanta.js

## Documentation

- `FIREBASE-SETUP-GUIDE.md` - Firebase configuration
- `FIREBASE-CONSOLE-STEPS.md` - Step-by-step Firebase setup
- `QUICK-FIREBASE-SETUP.md` - Quick setup (5 minutes)
- `QUICK-START.md` - Getting started guide

## Project Structure

```
├── app/                  # Next.js pages
├── components/           # React components
├── lib/                  # Firebase & utilities
├── types/                # TypeScript types
└── public/               # Static assets
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Lint code
```

## License

Proprietary



