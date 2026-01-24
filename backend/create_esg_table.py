"""
Create ESG Scores table in database
Run this script to initialize the esg_scores table
"""
from app.database import engine, Base
from app.models.esg_score import ESGScore

def create_esg_table():
    """Create esg_scores table"""
    print("Creating esg_scores table...")
    Base.metadata.create_all(bind=engine, tables=[ESGScore.__table__])
    print("✓ esg_scores table created successfully")

if __name__ == "__main__":
    create_esg_table()
