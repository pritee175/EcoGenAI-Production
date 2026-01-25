"""
Seed database with sample data for testing
"""
import sys
from datetime import datetime, timedelta
import random
from app.database import SessionLocal, engine
from app.models.workload import Workload, Base as WorkloadBase
from app.models.energy import EnergyConsumption, Base as EnergyBase
from app.models.governance import Base as GovernanceBase

# Create all tables
WorkloadBase.metadata.create_all(bind=engine)
EnergyBase.metadata.create_all(bind=engine)
GovernanceBase.metadata.create_all(bind=engine)

def seed_workloads(db):
    """Create sample AI workloads"""
    models = ["GPT-4", "BERT", "ResNet-50", "DALL-E", "Claude", "LLaMA"]
    regions = ["us-east-1", "eu-west-1", "ap-south-1", "us-west-2"]
    statuses = ["running", "completed", "pending"]
    
    print("Creating sample workloads...")
    for i in range(20):
        workload = Workload(
            model_name=random.choice(models),
            region=random.choice(regions),
            status=random.choice(statuses),
            gpu_hours=round(random.uniform(0.5, 10.0), 2),
            tokens_processed=random.randint(10000, 1000000),
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
        )
        db.add(workload)
    
    db.commit()
    print(f"✅ Created {20} sample workloads")

def seed_energy_data(db):
    """Create sample energy consumption data"""
    models = ["GPT-4", "BERT", "ResNet-50", "DALL-E", "Claude", "LLaMA"]
    regions = ["us-east-1", "eu-west-1", "ap-south-1", "us-west-2"]
    
    print("Creating sample energy data...")
    for i in range(30):
        energy = EnergyConsumption(
            model_name=random.choice(models),
            region=random.choice(regions),
            energy_kwh=round(random.uniform(5.0, 50.0), 2),
            gpu_hours=round(random.uniform(1.0, 10.0), 2),
            timestamp=datetime.utcnow() - timedelta(hours=random.randint(0, 720))
        )
        db.add(energy)
    
    db.commit()
    print(f"✅ Created {30} energy consumption records")

def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    print("=" * 50)
    
    db = SessionLocal()
    try:
        # Clear existing data (optional)
        print("Clearing existing data...")
        db.query(Workload).delete()
        db.query(EnergyConsumption).delete()
        db.commit()
        print("✅ Cleared existing data")
        print()
        
        # Seed data
        seed_workloads(db)
        seed_energy_data(db)
        
        print()
        print("=" * 50)
        print("✅ Database seeding completed successfully!")
        print()
        print("Summary:")
        print(f"  - Workloads: {db.query(Workload).count()}")
        print(f"  - Energy Records: {db.query(EnergyConsumption).count()}")
        print()
        print("🚀 Your dashboard should now show data!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
