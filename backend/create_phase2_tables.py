"""
Create Phase 2 database tables
Green-Time Scheduler, Carbon Autopilot, Gamification, Climate Risk
"""
from app.database import engine, Base
from app.models.scheduler import (
    GreenTimeWindow,
    ScheduledWorkload,
    AutopilotAction,
    TeamEcoScore,
    ClimateRiskScore
)

def create_phase2_tables():
    """Create all Phase 2 tables"""
    print("Creating Phase 2 database tables...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    print("✓ Phase 2 tables created successfully!")
    print("\nTables created:")
    print("  - green_time_windows (Green-Time Scheduler)")
    print("  - scheduled_workloads (Green-Time Scheduler)")
    print("  - autopilot_actions (Carbon Autopilot)")
    print("  - team_eco_scores (Eco-Score Gamification)")
    print("  - climate_risk_scores (Climate Risk Simulator)")
    print("\nPhase 2 database initialization complete!")

if __name__ == "__main__":
    create_phase2_tables()
