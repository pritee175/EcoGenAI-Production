# EcoGenAI Backend - FastAPI Service

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database
Create PostgreSQL database:
```sql
CREATE DATABASE ecogenai;
```

Update `.env` file with your database credentials:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ecogenai
```

### 3. Run the Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

## API Endpoints

- `GET /api/workloads/active` - Get running workloads
- `GET /api/workloads/history` - Get workload history
- `POST /api/workloads/start` - Start new workload
- `POST /api/workloads/stop/{id}` - Stop workload
- `WS /ws/workloads` - WebSocket for real-time updates

## Architecture

- **FastAPI**: REST API and WebSocket server
- **SQLAlchemy**: ORM for PostgreSQL
- **APScheduler**: Updates workloads every 5 seconds
- **WebSockets**: Real-time dashboard updates
