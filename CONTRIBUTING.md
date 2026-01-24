# Contributing to EcoGenAI

## Development Setup

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Code Standards

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints for all functions
- Add docstrings for classes and public methods
- Keep functions focused and under 50 lines

### TypeScript (Frontend)
- Use TypeScript strict mode
- Define interfaces for all props
- Use functional components with hooks
- Keep components under 200 lines

## Project Structure

```
EcoGenAI/
├── backend/          # FastAPI application
│   └── app/
│       ├── models/   # Database models
│       ├── services/ # Business logic
│       ├── api/      # REST endpoints
│       └── websocket/# Real-time updates
│
└── frontend/         # Next.js application
    └── src/
        ├── app/      # Pages and routing
        ├── components/# Reusable UI components
        └── services/ # API client
```

## Git Workflow

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test locally
4. Submit pull request
5. Code review required

## Commit Message Format

```
<type>: <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: add climate risk simulation endpoint
fix: resolve carbon calculation rounding error
docs: update API reference for ESG reports
```

## Testing

Before submitting:
- Verify backend APIs respond correctly
- Check frontend renders without errors
- Test WebSocket connections
- Validate data calculations
