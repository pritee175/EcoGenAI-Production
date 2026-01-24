"""
Carbon Footprint Calculation Service for ESG Monitoring
Converts energy consumption into CO₂ emissions using region-specific factors
"""
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict, Optional
from ..models.workload import AIWorkload, JobStatus
from ..models.energy import EnergyUsage
from ..models.carbon import CarbonEmission
from ..config import carbon_config
from ..database import SessionLocal

class CarbonCalculator:
    """
    Service for calculating and tracking carbon emissions
    
    This service implements ESG-standard carbon footprint calculation for AI workloads.
    It depends on the energy calculation module and applies region-specific carbon
    intensity factors to convert electricity consumption into CO₂ emissions.
    
    Formula: CO₂ (kg) = Energy (kWh) × Carbon Intensity (kg CO₂ / kWh)
    
    This approach is:
    - Transparent and auditable for ESG reporting
    - Based on regional electricity grid data
    - Suitable for climate impact assessment
    - Aligned with GHG Protocol standards
    """
    
    @staticmethod
    def update_carbon_for_running_workloads():
        """
        Update carbon emissions for all running workloads
        
        Called by APScheduler every 5 seconds to increment carbon values.
        Reads energy data and applies region-specific carbon intensity.
        """
        db = SessionLocal()
        try:
            # Get all running workloads
            running_workloads = db.query(AIWorkload).filter(
                AIWorkload.status == JobStatus.RUNNING
            ).all()
            
            for workload in running_workloads:
                # Get current energy consumption
                energy_record = db.query(EnergyUsage).filter(
                    EnergyUsage.workload_id == workload.id
                ).first()
                
                if not energy_record:
                    continue
                
                # Calculate carbon emissions from energy
                carbon_kg = carbon_config.calculate_carbon(
                    energy_record.energy_kwh,
                    workload.cloud_region
                )
                
                # Get or create carbon emission record
                carbon_record = db.query(CarbonEmission).filter(
                    CarbonEmission.workload_id == workload.id
                ).first()
                
                if carbon_record:
                    # Update existing record
                    carbon_record.energy_kwh = energy_record.energy_kwh
                    carbon_record.carbon_kg = carbon_kg
                    carbon_record.last_updated = datetime.utcnow()
                else:
                    # Create new record
                    carbon_record = CarbonEmission(
                        workload_id=workload.id,
                        region=workload.cloud_region,
                        energy_kwh=energy_record.energy_kwh,
                        carbon_kg=carbon_kg
                    )
                    db.add(carbon_record)
            
            db.commit()
            
        except Exception as e:
            print(f"Error updating carbon emissions: {e}")
            db.rollback()
        finally:
            db.close()
    
    @staticmethod
    def get_workload_carbon(db: Session, workload_id: int) -> Optional[Dict]:
        """
        Get carbon emissions for a specific workload
        
        Args:
            db: Database session
            workload_id: ID of the workload
            
        Returns:
            Dictionary with carbon data or None
        """
        carbon_record = db.query(CarbonEmission).filter(
            CarbonEmission.workload_id == workload_id
        ).first()
        
        if carbon_record:
            return carbon_record.to_dict()
        return None
    
    @staticmethod
    def get_total_carbon_footprint(db: Session) -> float:
        """
        Calculate total AI carbon footprint
        
        Args:
            db: Database session
            
        Returns:
            Total CO₂ emissions in kg
        """
        carbon_records = db.query(CarbonEmission).all()
        total_carbon = sum(record.carbon_kg for record in carbon_records)
        return round(total_carbon, 4)
    
    @staticmethod
    def get_carbon_by_region(db: Session) -> List[Dict]:
        """
        Get carbon emissions grouped by region
        
        Args:
            db: Database session
            
        Returns:
            List of dictionaries with region and carbon emissions
        """
        # Get all carbon records
        carbon_records = db.query(CarbonEmission).all()
        
        # Group by region
        region_carbon = {}
        for record in carbon_records:
            region = record.region
            if region not in region_carbon:
                region_carbon[region] = 0.0
            region_carbon[region] += record.carbon_kg
        
        # Convert to list and sort by carbon (descending)
        result = [
            {
                "region": region,
                "carbon_kg": round(carbon, 4),
                "carbon_intensity": carbon_config.get_carbon_intensity(region)
            }
            for region, carbon in region_carbon.items()
        ]
        result.sort(key=lambda x: x["carbon_kg"], reverse=True)
        
        return result
    
    @staticmethod
    def get_carbon_by_model(db: Session) -> List[Dict]:
        """
        Get carbon emissions grouped by AI model
        
        Args:
            db: Database session
            
        Returns:
            List of dictionaries with model name and carbon emissions
        """
        # Get all workloads with carbon data
        workloads = db.query(AIWorkload).join(CarbonEmission).all()
        
        # Group by model name
        model_carbon = {}
        for workload in workloads:
            model_name = workload.model_name
            carbon_record = db.query(CarbonEmission).filter(
                CarbonEmission.workload_id == workload.id
            ).first()
            
            if carbon_record:
                if model_name not in model_carbon:
                    model_carbon[model_name] = 0.0
                model_carbon[model_name] += carbon_record.carbon_kg
        
        # Convert to list and sort by carbon (descending)
        result = [
            {"model_name": name, "carbon_kg": round(carbon, 4)}
            for name, carbon in model_carbon.items()
        ]
        result.sort(key=lambda x: x["carbon_kg"], reverse=True)
        
        return result
    
    @staticmethod
    def get_top_carbon_emitters(db: Session, limit: int = 5) -> List[Dict]:
        """
        Get top carbon-emitting workloads
        
        Args:
            db: Database session
            limit: Number of top emitters to return
            
        Returns:
            List of workloads with highest carbon emissions
        """
        # Query workloads with carbon, ordered by carbon descending
        results = db.query(AIWorkload, CarbonEmission).join(
            CarbonEmission, AIWorkload.id == CarbonEmission.workload_id
        ).order_by(
            CarbonEmission.carbon_kg.desc()
        ).limit(limit).all()
        
        top_emitters = []
        for workload, carbon in results:
            top_emitters.append({
                "workload_id": workload.id,
                "model_name": workload.model_name,
                "region": workload.cloud_region,
                "energy_kwh": round(carbon.energy_kwh, 4),
                "carbon_kg": round(carbon.carbon_kg, 4),
                "status": workload.status.value
            })
        
        return top_emitters
    
    @staticmethod
    def get_carbon_intensity_factors(db: Session) -> Dict:
        """
        Get all carbon intensity factors for transparency
        
        Returns:
            Dictionary with carbon intensity data
        """
        return {
            "carbon_intensities": carbon_config.get_all_intensities(),
            "unit": "kg CO₂ per kWh",
            "description": "Region-specific electricity grid carbon intensity",
            "source": "Based on regional energy mix data"
        }
