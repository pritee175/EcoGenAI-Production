"""
Optimization & Emission Reduction Engine
Rule-based system for generating actionable sustainability recommendations
"""
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from enum import Enum
from ..models.workload import AIWorkload, JobStatus, JobType
from ..models.energy import EnergyUsage
from ..models.carbon import CarbonEmission
from ..config import carbon_config
from ..database import SessionLocal

class RecommendationType(str, Enum):
    """Types of optimization recommendations"""
    REGION_OPTIMIZATION = "REGION_OPTIMIZATION"
    TIME_SCHEDULING = "TIME_SCHEDULING"
    MODEL_EFFICIENCY = "MODEL_EFFICIENCY"
    IDLE_DETECTION = "IDLE_DETECTION"

class Severity(str, Enum):
    """Recommendation severity levels"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class OptimizationEngine:
    """
    Rule-based optimization engine for ESG recommendations
    
    This engine analyzes AI workload data and generates actionable,
    explainable sustainability recommendations. It does NOT enforce
    changes automatically - all recommendations are advisory.
    
    The engine supports Allianz's ESG goals by:
    - Reducing AI-related carbon emissions
    - Lowering cloud infrastructure costs
    - Improving ESG performance metrics
    - Strengthening responsible AI governance
    """
    
    # High-compute models that may benefit from efficiency optimization
    HIGH_COMPUTE_MODELS = ["PolicyGPT", "RiskAssessor"]
    
    # Threshold for considering a workload as long-running (seconds)
    LONG_RUNTIME_THRESHOLD = 300  # 5 minutes
    
    @staticmethod
    def generate_recommendations(db: Session) -> List[Dict]:
        """
        Generate all optimization recommendations
        
        Analyzes current workload data and generates actionable
        sustainability recommendations based on rule-based logic.
        
        Returns:
            List of recommendation dictionaries
        """
        recommendations = []
        
        # Get all workloads with energy and carbon data
        workloads = db.query(AIWorkload).all()
        
        for workload in workloads:
            # Get associated energy and carbon data
            energy_record = db.query(EnergyUsage).filter(
                EnergyUsage.workload_id == workload.id
            ).first()
            
            carbon_record = db.query(CarbonEmission).filter(
                CarbonEmission.workload_id == workload.id
            ).first()
            
            if not energy_record or not carbon_record:
                continue
            
            # Rule 1: Region Optimization
            region_rec = OptimizationEngine._check_region_optimization(
                workload, energy_record, carbon_record
            )
            if region_rec:
                recommendations.append(region_rec)
            
            # Rule 2: Time-Based Scheduling
            time_rec = OptimizationEngine._check_time_scheduling(
                workload, energy_record, carbon_record
            )
            if time_rec:
                recommendations.append(time_rec)
            
            # Rule 3: Model Efficiency
            efficiency_rec = OptimizationEngine._check_model_efficiency(
                workload, energy_record, carbon_record
            )
            if efficiency_rec:
                recommendations.append(efficiency_rec)
            
            # Rule 4: Idle Detection
            idle_rec = OptimizationEngine._check_idle_workload(
                workload, energy_record, carbon_record
            )
            if idle_rec:
                recommendations.append(idle_rec)
        
        return recommendations
    
    @staticmethod
    def _check_region_optimization(workload: AIWorkload, energy: EnergyUsage, 
                                   carbon: CarbonEmission) -> Optional[Dict]:
        """
        Rule 1: Region Optimization Recommendation
        
        If workload runs in high-carbon region and cleaner region exists,
        recommend migration to reduce CO₂ emissions.
        """
        current_region = workload.cloud_region
        current_intensity = carbon_config.get_carbon_intensity(current_region)
        
        # Find cleaner region
        all_intensities = carbon_config.get_all_intensities()
        cleaner_regions = {
            region: intensity 
            for region, intensity in all_intensities.items()
            if intensity < current_intensity
        }
        
        if not cleaner_regions:
            return None
        
        # Find the cleanest region
        cleanest_region = min(cleaner_regions.items(), key=lambda x: x[1])
        cleanest_name, cleanest_intensity = cleanest_region
        
        # Calculate potential savings
        current_carbon = carbon.carbon_kg
        potential_carbon = energy.energy_kwh * cleanest_intensity
        carbon_saving = current_carbon - potential_carbon
        reduction_percent = (carbon_saving / current_carbon * 100) if current_carbon > 0 else 0
        
        # Only recommend if savings are significant (>10%)
        if reduction_percent < 10:
            return None
        
        # Determine severity based on carbon savings
        if carbon_saving > 0.5:
            severity = Severity.HIGH
        elif carbon_saving > 0.2:
            severity = Severity.MEDIUM
        else:
            severity = Severity.LOW
        
        return {
            "workload_id": workload.id,
            "model_name": workload.model_name,
            "recommendation_type": RecommendationType.REGION_OPTIMIZATION,
            "title": "Deploy in Cleaner Energy Region",
            "message": f"Consider deploying '{workload.model_name}' in {cleanest_name} region instead of {current_region} to reduce CO₂ emissions by an estimated {reduction_percent:.1f}%.",
            "current_region": current_region,
            "recommended_region": cleanest_name,
            "estimated_carbon_saving_kg": round(carbon_saving, 4),
            "estimated_energy_kwh": round(energy.energy_kwh, 4),
            "severity": severity,
            "impact_description": f"Switching to {cleanest_name} could save {carbon_saving:.4f} kg CO₂"
        }
    
    @staticmethod
    def _check_time_scheduling(workload: AIWorkload, energy: EnergyUsage,
                               carbon: CarbonEmission) -> Optional[Dict]:
        """
        Rule 2: Time-Based Scheduling Recommendation
        
        If workload is long-running training or batch inference,
        suggest scheduling during low-carbon time windows.
        """
        # Only recommend for training jobs or long-running inference
        if workload.job_type != JobType.TRAINING and workload.runtime_seconds < OptimizationEngine.LONG_RUNTIME_THRESHOLD:
            return None
        
        # Only for workloads with significant carbon footprint
        if carbon.carbon_kg < 0.1:
            return None
        
        # Estimate potential savings (assume 15-30% reduction during off-peak)
        estimated_saving = carbon.carbon_kg * 0.20  # Conservative 20% estimate
        
        severity = Severity.MEDIUM if carbon.carbon_kg > 0.5 else Severity.LOW
        
        return {
            "workload_id": workload.id,
            "model_name": workload.model_name,
            "recommendation_type": RecommendationType.TIME_SCHEDULING,
            "title": "Schedule During Low-Carbon Hours",
            "message": f"Schedule '{workload.model_name}' during low-carbon or off-peak time windows to reduce environmental impact. Training jobs can often be delayed to optimize for sustainability.",
            "job_type": workload.job_type.value,
            "runtime_seconds": workload.runtime_seconds,
            "estimated_carbon_saving_kg": round(estimated_saving, 4),
            "severity": severity,
            "impact_description": f"Off-peak scheduling could save approximately {estimated_saving:.4f} kg CO₂"
        }
    
    @staticmethod
    def _check_model_efficiency(workload: AIWorkload, energy: EnergyUsage,
                                carbon: CarbonEmission) -> Optional[Dict]:
        """
        Rule 3: Model Efficiency Recommendation
        
        If high-compute model is used, suggest considering smaller/efficient alternatives.
        """
        # Only recommend for high-compute models
        if workload.model_name not in OptimizationEngine.HIGH_COMPUTE_MODELS:
            return None
        
        # Only if carbon footprint is significant
        if carbon.carbon_kg < 0.3:
            return None
        
        # Estimate potential savings (assume 40-60% with smaller model)
        estimated_saving = carbon.carbon_kg * 0.50  # 50% potential reduction
        
        severity = Severity.HIGH if carbon.carbon_kg > 1.0 else Severity.MEDIUM
        
        return {
            "workload_id": workload.id,
            "model_name": workload.model_name,
            "recommendation_type": RecommendationType.MODEL_EFFICIENCY,
            "title": "Consider More Efficient Model",
            "message": f"'{workload.model_name}' is a high-compute model. For tasks like summarization or classification, consider using a smaller or more efficient model to reduce energy consumption and cost.",
            "current_model": workload.model_name,
            "gpu_count": workload.gpu_count,
            "estimated_carbon_saving_kg": round(estimated_saving, 4),
            "estimated_energy_saving_kwh": round(energy.energy_kwh * 0.50, 4),
            "severity": severity,
            "impact_description": f"Switching to efficient model could save {estimated_saving:.4f} kg CO₂ and reduce costs"
        }
    
    @staticmethod
    def _check_idle_workload(workload: AIWorkload, energy: EnergyUsage,
                            carbon: CarbonEmission) -> Optional[Dict]:
        """
        Rule 4: Idle or Over-Provisioned AI Detection
        
        If workload has been running long but shows low activity,
        flag for potential optimization.
        """
        # Only check running workloads
        if workload.status != JobStatus.RUNNING:
            return None
        
        # Check if runtime is very long (>10 minutes)
        if workload.runtime_seconds < 600:
            return None
        
        # Simple heuristic: if energy per second is very low, might be idle
        energy_per_second = energy.energy_kwh / (workload.runtime_seconds / 3600.0) if workload.runtime_seconds > 0 else 0
        
        # If energy consumption rate is suspiciously low for the GPU count
        expected_min_rate = workload.gpu_count * 0.05  # Minimum expected kW
        
        if energy_per_second >= expected_min_rate:
            return None
        
        severity = Severity.MEDIUM
        
        return {
            "workload_id": workload.id,
            "model_name": workload.model_name,
            "recommendation_type": RecommendationType.IDLE_DETECTION,
            "title": "Potential Underutilization Detected",
            "message": f"'{workload.model_name}' shows signs of underutilization. Consider batching requests or shutting down idle instances to reduce waste.",
            "runtime_seconds": workload.runtime_seconds,
            "gpu_count": workload.gpu_count,
            "estimated_carbon_saving_kg": round(carbon.carbon_kg * 0.30, 4),
            "severity": severity,
            "impact_description": "Optimizing utilization could reduce unnecessary emissions"
        }
    
    @staticmethod
    def calculate_total_potential_savings(db: Session) -> Dict:
        """
        Calculate total potential carbon and energy savings
        
        Returns:
            Dictionary with total potential savings
        """
        recommendations = OptimizationEngine.generate_recommendations(db)
        
        total_carbon_saving = sum(
            rec.get("estimated_carbon_saving_kg", 0) 
            for rec in recommendations
        )
        
        total_energy_saving = sum(
            rec.get("estimated_energy_saving_kwh", 0) 
            for rec in recommendations
        )
        
        return {
            "total_recommendations": len(recommendations),
            "total_carbon_saving_kg": round(total_carbon_saving, 4),
            "total_energy_saving_kwh": round(total_energy_saving, 4),
            "high_severity_count": sum(1 for r in recommendations if r.get("severity") == Severity.HIGH),
            "medium_severity_count": sum(1 for r in recommendations if r.get("severity") == Severity.MEDIUM),
            "low_severity_count": sum(1 for r in recommendations if r.get("severity") == Severity.LOW)
        }
