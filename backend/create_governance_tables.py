"""
Create Governance tables in database
Run this script to initialize governance-related tables
"""
from app.database import engine, Base
from app.models.governance import ActionRequest, CostImpactAnalysis

def create_governance_tables():
    """Create governance tables"""
    print("Creating governance tables...")
    Base.metadata.create_all(bind=engine, tables=[
        ActionRequest.__table__,
        CostImpactAnalysis.__table__
    ])
    print("✓ action_requests table created successfully")
    print("✓ cost_impact_analyses table created successfully")

if __name__ == "__main__":
    create_governance_tables()
