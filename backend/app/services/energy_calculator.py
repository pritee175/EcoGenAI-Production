"""
Energy Calculation Service for ESG Monitoring
Estimates electricity consumption for GenAI workloads
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from ..models.workload import AIWorkload, JobStatus
from ..models.energy import EnergyUsage
from ..config import energy_config
from ..database import SessionLocal

class EnergyCalculator:
    """
    Service for calculating and tracking energy consumption
    
    This service implements industry-standard energy estimation for AI workloads.
    Since direct hardware telemetry is not available for cloud-based GenAI systems,
    we use validated power coefficients based on GPU specifications.
    
    Formula: Energy (kWh) = Runtime (hours) × GPU Count × Power Coefficient (kW)
    
    This approach is:
    - Transparent and auditable for ESG reporting
    - Based on industry benchmarks (NVIDIA specs)
    - Conservative (tends to overestimate rather than underestimate)
    - Suitable for comparative analysis across workloads
    """
    
    @staticmethod
    def calculate_incremental_energy(workload: AIWorkload, 
                                     time_interval_seconds: float = 5.0) -> float:
        """
        Calculate energy consumed during a time interval
        
        Args:
            workload: AI workload instance
            time_interval_seconds: Time interval for calculation (default: 5 seconds)
            
        Returns:
            Energy consumed in kWh during the interval
        """
        # Convert interval to hours
        interval_hours = time_interval_seconds / 3600.0
        
        # Get power coefficient for this model
        power_per_gpu_kw = energy_config.get_power_coefficient(workload.model_name)
        
        # Calculate energy for this interval
        # Energy = Time × GPUs × Power per GPU
        energy_kwh = interval_hours * workload.gpu_count * power_per_gpu_kw
        
        return energy_kwh
    
    @staticmethod
    def update_energy_for_running_workloads():
        """
        Update energy consumption for all running workloads
        
        Called by APScheduler every 5 seconds to increment energy values.
        Only updates workloads with status='running'.
        """
        db = SessionLocal()
        try:
            # Get all running workloads
            running_workloads = db.query(AIWorkload).filter(
                AIWorkload.status == JobStatus.RUNNING
            ).all()
            
            for workload in running_workloads:
                # Calculate energy for this 5-second interval
                incremental_energy = EnergyCalculator.calculate_incremental_energy(
                    workload, 
                    time_interval_seconds=5.0
                )
                
                # Get or create energy usage record
                energy_record = db.query(EnergyUsage).filter(
                    EnergyUsage.workload_id == workload.id
                ).first()
                
                if energy_record:
                    # Update existing record
                    energy_record.energy_kwh += incremental_energy
                    energy_record.last_updated = datetime.utcnow()
                else:
                    # Create new record
                    energy_record = EnergyUsage(
                        workload_id=workload.id,
                        energy_kwh=incremental_energy
                    )
                    db.add(energy_record)
            
            db.commit()
            
        except Exception as e:
            print(f"Error updating energy: {e}")
            db.rollback()
        finally:
            db.close()
    
    @staticmethod
    def get_workload_energy(db: Session, workload_id: int) -> Optional[Dict]:
        """
        Get energy consumption for a specific workload
        
        Args:
            db: Database session
            workload_id: ID of the workload
            
        Returns:
            Dictionary with energy data or None
        """
        energy_record = db.query(EnergyUsage).filter(
            EnergyUsage.workload_id == workload_id
        ).first()
        
        if energy_record:
            return energy_record.to_dict()
        return None
    
    @staticmethod
    def get_total_energy_today(db: Session) -> float:
        """
        Calculate total energy consumed today
        
        Args:
            db: Database session
            
        Returns:
            Total energy in kWh
        """
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Get all workloads started today
        workloads_today = db.query(AIWorkload).filter(
            AIWorkload.start_time >= today_start
        ).all()
        
        total_energy = 0.0
        for workload in workloads_today:
            energy_record = db.query(EnergyUsage).filter(
                EnergyUsage.workload_id == workload.id
            ).first()
            if energy_record:
                total_energy += energy_record.energy_kwh
        
        return round(total_energy, 4)
    
    @staticmethod
    def get_energy_by_model(db: Session) -> List[Dict]:
        """
        Get energy consumption grouped by AI model
        
        Args:
            db: Database session
            
        Returns:
            List of dictionaries with model name and total energy
        """
        # Get all workloads with energy data
        workloads = db.query(AIWorkload).join(EnergyUsage).all()
        
        # Group by model name
        model_energy = {}
        for workload in workloads:
            model_name = workload.model_name
            energy_record = db.query(EnergyUsage).filter(
                EnergyUsage.workload_id == workload.id
            ).first()
            
            if energy_record:
                if model_name not in model_energy:
                    model_energy[model_name] = 0.0
                model_energy[model_name] += energy_record.energy_kwh
        
        # Convert to list and sort by energy (descending)
        result = [
            {"model_name": name, "total_energy_kwh": round(energy, 4)}
            for name, energy in model_energy.items()
        ]
        result.sort(key=lambda x: x["total_energy_kwh"], reverse=True)
        
        return result
    
    @staticmethod
    def get_top_energy_consumers(db: Session, limit: int = 5) -> List[Dict]:
        """
        Get top energy-consuming workloads
        
        Args:
            db: Database session
            limit: Number of top consumers to return
            
        Returns:
            List of workloads with highest energy consumption
        """
        # Query workloads with energy, ordered by energy descending
        results = db.query(AIWorkload, EnergyUsage).join(
            EnergyUsage, AIWorkload.id == EnergyUsage.workload_id
        ).order_by(
            EnergyUsage.energy_kwh.desc()
        ).limit(limit).all()
        
        top_consumers = []
        for workload, energy in results:
            top_consumers.append({
                "workload_id": workload.id,
                "model_name": workload.model_name,
                "job_type": workload.job_type.value,
                "gpu_count": workload.gpu_count,
                "runtime_seconds": workload.runtime_seconds,
                "energy_kwh": round(energy.energy_kwh, 4),
                "status": workload.status.value
            })
        
        return top_consumers
    
    @staticmethod
    def get_average_energy_per_model(db: Session) -> float:
        """
        Calculate average energy consumption per AI model
        
        Args:
            db: Database session
            
        Returns:
            Average energy in kWh
        """
        energy_records = db.query(EnergyUsage).all()
        
        if not energy_records:
            return 0.0
        
        total_energy = sum(record.energy_kwh for record in energy_records)
        avg_energy = total_energy / len(energy_records)
        
        return round(avg_energy, 4)
