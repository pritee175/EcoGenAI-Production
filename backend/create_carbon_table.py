"""
Database migration script to create carbon_emissions table
Run this once to add carbon tracking to existing database
"""
from app.database import engine, Base
from app.models.carbon import CarbonEmission
from app.models.workload import AIWorkload
from app.models.energy import EnergyUsage

def create_carbon_table():
    """Create carbon_emissions table in database"""
    print("Creating carbon_emissions table...")
    Base.metadata.create_all(bind=engine)
    print("✓ Carbon table created successfully!")
    print("\nYou can now track CO₂ emissions for AI workloads.")

if __name__ == "__main__":
    create_carbon_table()
