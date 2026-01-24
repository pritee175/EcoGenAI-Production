"""
Database migration script to create energy_usage table
Run this once to add energy tracking to existing database
"""
from app.database import engine, Base
from app.models.energy import EnergyUsage
from app.models.workload import AIWorkload

def create_energy_table():
    """Create energy_usage table in database"""
    print("Creating energy_usage table...")
    Base.metadata.create_all(bind=engine)
    print("✓ Energy table created successfully!")
    print("\nYou can now track energy consumption for AI workloads.")

if __name__ == "__main__":
    create_energy_table()
