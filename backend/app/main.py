"""
EcoGenAI - Enterprise ESG Monitoring Platform for Allianz
Main FastAPI application with real-time GenAI workload tracking
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager
import asyncio

from .config import settings
from .database import engine, Base, SessionLocal
from .api import workloads, energy, carbon, optimization, esg_score, governance, phase2, auditor, onboarding, profile
from .services.simulator import WorkloadSimulator
from .services.energy_calculator import EnergyCalculator
from .services.carbon_calculator import CarbonCalculator
from .services.cloud_connector import CloudConnector
from .models.cloud_integration import CloudIntegration, ConnectionStatus
from .models.user_profile import UserProfile  # Import to ensure table creation
from .websocket.manager import manager

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Background scheduler for real-time updates
scheduler = BackgroundScheduler()

async def broadcast_workload_updates():
    """
    Fetch current workloads with energy and carbon data and broadcast to all WebSocket clients
    Called every 5 seconds by scheduler
    """
    db = SessionLocal()
    try:
        from .models.energy import EnergyUsage
        from .models.carbon import CarbonEmission
        
        active_workloads = WorkloadSimulator.get_active_workloads(db)
        workload_data = []
        
        for w in active_workloads:
            workload_dict = w.to_dict()
            
            # Add energy data if available
            energy_record = db.query(EnergyUsage).filter(
                EnergyUsage.workload_id == w.id
            ).first()
            
            if energy_record:
                workload_dict["energy_kwh"] = round(energy_record.energy_kwh, 4)
            else:
                workload_dict["energy_kwh"] = 0.0
            
            # Add carbon data if available
            carbon_record = db.query(CarbonEmission).filter(
                CarbonEmission.workload_id == w.id
            ).first()
            
            if carbon_record:
                workload_dict["carbon_kg"] = round(carbon_record.carbon_kg, 4)
            else:
                workload_dict["carbon_kg"] = 0.0
            
            workload_data.append(workload_dict)
        
        # Get energy summary
        energy_summary = {
            "total_energy_today_kwh": EnergyCalculator.get_total_energy_today(db),
            "average_energy_per_model_kwh": EnergyCalculator.get_average_energy_per_model(db)
        }
        
        # Get carbon summary
        carbon_summary = {
            "total_carbon_kg": CarbonCalculator.get_total_carbon_footprint(db)
        }
        
        # Broadcast to all connected dashboard clients
        await manager.broadcast({
            "type": "workload_update",
            "data": workload_data,
            "energy_summary": energy_summary,
            "carbon_summary": carbon_summary,
            "timestamp": active_workloads[0].updated_at.isoformat() if active_workloads else None
        })
    finally:
        db.close()

def scheduled_update():
    """
    Scheduler job that runs every 5 seconds
    Updates workload runtimes, energy consumption, carbon emissions, and broadcasts to clients
    """
    # Update workload runtimes
    WorkloadSimulator.update_running_workloads()
    
    # Update energy consumption for running workloads
    EnergyCalculator.update_energy_for_running_workloads()
    
    # Update carbon emissions for running workloads
    CarbonCalculator.update_carbon_for_running_workloads()
    
    # Broadcast updates (run in event loop)
    try:
        # Get the running event loop or create a new one
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            # No running loop, create new one for this thread
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(broadcast_workload_updates())
            loop.close()
        else:
            # Loop is running, schedule the coroutine
            asyncio.create_task(broadcast_workload_updates())
    except Exception as e:
        print(f"Error in scheduled update: {e}")

def cloud_monitoring_job():
    """
    Background job that monitors cloud integrations
    Runs every 30 seconds to detect new GPU workloads from connected cloud providers
    This is what makes EcoGenAI a persistent monitoring engine
    """
    db = SessionLocal()
    try:
        # Get all active cloud integrations
        integrations = db.query(CloudIntegration).filter(
            CloudIntegration.status == ConnectionStatus.CONNECTED
        ).all()
        
        for integration in integrations:
            try:
                # Detect GPU workloads from cloud provider
                detected_workloads = CloudConnector.detect_gpu_workloads(integration, db)
                
                if detected_workloads:
                    print(f"✓ Detected {len(detected_workloads)} workloads from {integration.provider.value}")
                
            except Exception as e:
                print(f"Error monitoring {integration.provider.value} for {integration.user_email}: {e}")
                integration.status = ConnectionStatus.FAILED
                integration.error_message = str(e)
                db.commit()
        
    except Exception as e:
        print(f"Error in cloud monitoring job: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle management
    Starts/stops background scheduler
    """
    # Startup: Initialize scheduler
    scheduler.add_job(scheduled_update, 'interval', seconds=5, id='workload_updater')
    scheduler.add_job(cloud_monitoring_job, 'interval', seconds=30, id='cloud_monitor')
    scheduler.start()
    print("✓ APScheduler started - updating workloads every 5 seconds")
    print("✓ Cloud monitoring started - checking cloud providers every 30 seconds")
    
    # Create initial demo workloads (disabled - using real GCP monitoring)
    # db = SessionLocal()
    # try:
    #     for _ in range(3):
    #         WorkloadSimulator.create_workload(db)
    #     print("✓ Created initial demo workloads")
    # finally:
    #     db.close()
    print("✓ Demo workloads disabled - using real cloud monitoring")
    
    yield
    
    # Shutdown: Stop scheduler
    scheduler.shutdown()
    print("✓ APScheduler stopped")

# Initialize FastAPI app
app = FastAPI(
    title="EcoGenAI - Allianz ESG Monitoring",
    description="Real-time Generative AI workload monitoring for carbon tracking",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for Next.js frontend
# Allow multiple ports for development and production Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "https://eco-gen-ai-jl2y.vercel.app",
        "https://eco-gen-ai-jl2y-gmailcoms-projects.vercel.app",
        "https://eco-gen-ai-jl2y-git-main-gmailcoms-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include REST API routes
app.include_router(workloads.router)
app.include_router(energy.router)
app.include_router(carbon.router)
app.include_router(optimization.router)
app.include_router(esg_score.router)
app.include_router(governance.router)
app.include_router(phase2.router)
app.include_router(auditor.router)
app.include_router(onboarding.router)
app.include_router(profile.router)

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "service": "EcoGenAI Platform",
        "status": "operational",
        "version": "1.0.0"
    }

@app.websocket("/ws/workloads")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time workload updates
    Dashboard connects here to receive live metrics
    """
    await manager.connect(websocket)
    try:
        # Keep connection alive and listen for client messages
        while True:
            data = await websocket.receive_text()
            # Echo back for connection health check
            await websocket.send_json({"type": "pong", "message": "connected"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
