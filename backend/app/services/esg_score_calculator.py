"""
ESG Score Calculator Service
Calculates composite sustainability scores for executive-level ESG reporting
"""
from sqlalchemy.orm import Session
from typing import Dict, List
from datetime import datetime, timedelta
from ..models.esg_score import ESGScore
from ..models.workload import AIWorkload
from ..models.energy import EnergyUsage
from ..models.carbon import CarbonEmission
from ..services.optimization_engine import OptimizationEngine
from ..database import SessionLocal

class ESGScoreCalculator:
    """
    ESG Score Calculation Engine
    
    Calculates a composite ESG sustainability score (0-100) based on:
    1. Carbon Efficiency (40%): Lower emissions = higher score
    2. Energy Efficiency (30%): Lower energy per workload = higher score
    3. Optimization Adoption (20%): More recommendations adopted = higher score
    4. Regional Sustainability (10%): More workloads in low-carbon regions = higher score
    
    Scores are normalized to 0-100 scale and weighted to produce final score.
    Historical scores enable trend tracking for ESG reporting.
    """
    
    # Configurable weights (must sum to 1.0)
    CARBON_WEIGHT = 0.40
    ENERGY_WEIGHT = 0.30
    OPTIMIZATION_WEIGHT = 0.20
    REGIONAL_WEIGHT = 0.10
    
    # Benchmark thresholds for normalization
    # These represent "good" performance levels
    CARBON_BENCHMARK_KG = 2.0  # Target: < 2 kg CO₂ total
    ENERGY_BENCHMARK_KWH_PER_WORKLOAD = 0.5  # Target: < 0.5 kWh per workload
    LOW_CARBON_REGION_TARGET = 0.70  # Target: 70% in low-carbon regions
    
    # Low-carbon regions (carbon intensity < 0.30 kg CO₂/kWh)
    LOW_CARBON_REGIONS = ["EU"]
    
    @staticmethod
    def calculate_current_score(db: Session) -> Dict:
        """
        Calculate current ESG score based on latest data
        
        Returns:
            Dictionary with score and detailed breakdown
        """
        # Get all workloads
        workloads = db.query(AIWorkload).all()
        total_workloads = len(workloads)
        
        if total_workloads == 0:
            # No workloads - return neutral score
            return {
                "score": 50.0,
                "breakdown": {
                    "carbon_efficiency_score": 50.0,
                    "energy_efficiency_score": 50.0,
                    "optimization_adoption_score": 50.0,
                    "regional_sustainability_score": 50.0,
                    "carbon_weight": ESGScoreCalculator.CARBON_WEIGHT,
                    "energy_weight": ESGScoreCalculator.ENERGY_WEIGHT,
                    "optimization_weight": ESGScoreCalculator.OPTIMIZATION_WEIGHT,
                    "regional_weight": ESGScoreCalculator.REGIONAL_WEIGHT,
                    "total_carbon_kg": 0.0,
                    "total_energy_kwh": 0.0,
                    "total_workloads": 0,
                    "low_carbon_region_percentage": 0.0,
                    "optimization_opportunities": 0,
                    "recommendations_adopted": 0
                }
            }
        
        # 1. Calculate Carbon Efficiency Score
        total_carbon = db.query(CarbonEmission).count()
        if total_carbon > 0:
            total_carbon_kg = sum(
                c.carbon_kg for c in db.query(CarbonEmission).all()
            )
        else:
            total_carbon_kg = 0.0
        
        carbon_score = ESGScoreCalculator._normalize_carbon_score(total_carbon_kg)
        
        # 2. Calculate Energy Efficiency Score
        total_energy = db.query(EnergyUsage).count()
        if total_energy > 0:
            total_energy_kwh = sum(
                e.energy_kwh for e in db.query(EnergyUsage).all()
            )
            energy_per_workload = total_energy_kwh / total_workloads
        else:
            total_energy_kwh = 0.0
            energy_per_workload = 0.0
        
        energy_score = ESGScoreCalculator._normalize_energy_score(energy_per_workload)
        
        # 3. Calculate Optimization Adoption Score
        recommendations = OptimizationEngine.generate_recommendations(db)
        optimization_opportunities = len(recommendations)
        
        # For now, assume 0 adopted (future: track adoption in database)
        recommendations_adopted = 0
        
        optimization_score = ESGScoreCalculator._normalize_optimization_score(
            optimization_opportunities, recommendations_adopted
        )
        
        # 4. Calculate Regional Sustainability Score
        low_carbon_count = sum(
            1 for w in workloads 
            if w.cloud_region in ESGScoreCalculator.LOW_CARBON_REGIONS
        )
        low_carbon_percentage = (low_carbon_count / total_workloads * 100) if total_workloads > 0 else 0
        
        regional_score = ESGScoreCalculator._normalize_regional_score(
            low_carbon_percentage / 100.0
        )
        
        # 5. Calculate Weighted ESG Score
        esg_score = (
            carbon_score * ESGScoreCalculator.CARBON_WEIGHT +
            energy_score * ESGScoreCalculator.ENERGY_WEIGHT +
            optimization_score * ESGScoreCalculator.OPTIMIZATION_WEIGHT +
            regional_score * ESGScoreCalculator.REGIONAL_WEIGHT
        )
        
        return {
            "score": round(esg_score, 2),
            "breakdown": {
                "carbon_efficiency_score": round(carbon_score, 2),
                "energy_efficiency_score": round(energy_score, 2),
                "optimization_adoption_score": round(optimization_score, 2),
                "regional_sustainability_score": round(regional_score, 2),
                "carbon_weight": ESGScoreCalculator.CARBON_WEIGHT,
                "energy_weight": ESGScoreCalculator.ENERGY_WEIGHT,
                "optimization_weight": ESGScoreCalculator.OPTIMIZATION_WEIGHT,
                "regional_weight": ESGScoreCalculator.REGIONAL_WEIGHT,
                "total_carbon_kg": round(total_carbon_kg, 4),
                "total_energy_kwh": round(total_energy_kwh, 4),
                "total_workloads": total_workloads,
                "low_carbon_region_percentage": round(low_carbon_percentage, 2),
                "optimization_opportunities": optimization_opportunities,
                "recommendations_adopted": recommendations_adopted
            }
        }
    
    @staticmethod
    def _normalize_carbon_score(total_carbon_kg: float) -> float:
        """
        Normalize carbon emissions to 0-100 score
        Lower emissions = higher score
        """
        if total_carbon_kg <= 0:
            return 100.0
        
        # Score decreases as carbon increases
        # 0 kg = 100, benchmark kg = 70, 2x benchmark = 40, 3x+ benchmark = 20
        if total_carbon_kg <= ESGScoreCalculator.CARBON_BENCHMARK_KG:
            # Linear from 100 to 70
            ratio = total_carbon_kg / ESGScoreCalculator.CARBON_BENCHMARK_KG
            return 100.0 - (ratio * 30.0)
        elif total_carbon_kg <= ESGScoreCalculator.CARBON_BENCHMARK_KG * 2:
            # Linear from 70 to 40
            ratio = (total_carbon_kg - ESGScoreCalculator.CARBON_BENCHMARK_KG) / ESGScoreCalculator.CARBON_BENCHMARK_KG
            return 70.0 - (ratio * 30.0)
        elif total_carbon_kg <= ESGScoreCalculator.CARBON_BENCHMARK_KG * 3:
            # Linear from 40 to 20
            ratio = (total_carbon_kg - ESGScoreCalculator.CARBON_BENCHMARK_KG * 2) / ESGScoreCalculator.CARBON_BENCHMARK_KG
            return 40.0 - (ratio * 20.0)
        else:
            # Very high emissions
            return 20.0
    
    @staticmethod
    def _normalize_energy_score(energy_per_workload: float) -> float:
        """
        Normalize energy efficiency to 0-100 score
        Lower energy per workload = higher score
        """
        if energy_per_workload <= 0:
            return 100.0
        
        # Score decreases as energy per workload increases
        if energy_per_workload <= ESGScoreCalculator.ENERGY_BENCHMARK_KWH_PER_WORKLOAD:
            # Linear from 100 to 70
            ratio = energy_per_workload / ESGScoreCalculator.ENERGY_BENCHMARK_KWH_PER_WORKLOAD
            return 100.0 - (ratio * 30.0)
        elif energy_per_workload <= ESGScoreCalculator.ENERGY_BENCHMARK_KWH_PER_WORKLOAD * 2:
            # Linear from 70 to 40
            ratio = (energy_per_workload - ESGScoreCalculator.ENERGY_BENCHMARK_KWH_PER_WORKLOAD) / ESGScoreCalculator.ENERGY_BENCHMARK_KWH_PER_WORKLOAD
            return 70.0 - (ratio * 30.0)
        else:
            # High energy consumption
            return 40.0
    
    @staticmethod
    def _normalize_optimization_score(opportunities: int, adopted: int) -> float:
        """
        Normalize optimization adoption to 0-100 score
        More adopted recommendations = higher score
        """
        if opportunities == 0:
            # No opportunities = perfect score
            return 100.0
        
        adoption_rate = adopted / opportunities
        
        # Score based on adoption rate
        if adoption_rate >= 0.80:
            return 100.0  # 80%+ adoption = excellent
        elif adoption_rate >= 0.60:
            return 85.0   # 60-80% adoption = good
        elif adoption_rate >= 0.40:
            return 70.0   # 40-60% adoption = fair
        elif adoption_rate >= 0.20:
            return 55.0   # 20-40% adoption = needs improvement
        else:
            # Low adoption - but having opportunities is better than ignoring them
            return 40.0
    
    @staticmethod
    def _normalize_regional_score(low_carbon_ratio: float) -> float:
        """
        Normalize regional sustainability to 0-100 score
        More workloads in low-carbon regions = higher score
        """
        # Linear scale: 0% = 50, target% = 85, 100% = 100
        if low_carbon_ratio >= ESGScoreCalculator.LOW_CARBON_REGION_TARGET:
            # Above target: scale from 85 to 100
            excess = (low_carbon_ratio - ESGScoreCalculator.LOW_CARBON_REGION_TARGET) / (1.0 - ESGScoreCalculator.LOW_CARBON_REGION_TARGET)
            return 85.0 + (excess * 15.0)
        else:
            # Below target: scale from 50 to 85
            ratio = low_carbon_ratio / ESGScoreCalculator.LOW_CARBON_REGION_TARGET
            return 50.0 + (ratio * 35.0)
    
    @staticmethod
    def save_score(db: Session) -> ESGScore:
        """
        Calculate and save current ESG score to database
        
        Returns:
            Saved ESGScore record
        """
        score_data = ESGScoreCalculator.calculate_current_score(db)
        
        esg_score = ESGScore(
            score=score_data["score"],
            breakdown_json=score_data["breakdown"]
        )
        
        db.add(esg_score)
        db.commit()
        db.refresh(esg_score)
        
        return esg_score
    
    @staticmethod
    def get_score_history(db: Session, days: int = 7) -> List[Dict]:
        """
        Get ESG score history for trend analysis
        
        Args:
            days: Number of days to retrieve
            
        Returns:
            List of historical scores
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        scores = db.query(ESGScore).filter(
            ESGScore.score_date >= cutoff_date
        ).order_by(ESGScore.score_date.asc()).all()
        
        return [score.to_dict() for score in scores]
    
    @staticmethod
    def get_latest_score(db: Session) -> Dict:
        """
        Get most recent ESG score from database
        If no score exists, calculate and save one
        
        Returns:
            Latest ESG score dictionary
        """
        latest = db.query(ESGScore).order_by(
            ESGScore.score_date.desc()
        ).first()
        
        if latest:
            return latest.to_dict()
        else:
            # No score exists, calculate and save
            new_score = ESGScoreCalculator.save_score(db)
            return new_score.to_dict()
    
    @staticmethod
    def get_score_interpretation(score: float) -> Dict:
        """
        Provide human-readable interpretation of ESG score
        
        Args:
            score: ESG score (0-100)
            
        Returns:
            Dictionary with rating, color, and message
        """
        if score >= 80:
            return {
                "rating": "EXCELLENT",
                "color": "#059669",  # Green
                "message": "Your AI sustainability performance is excellent. Continue maintaining these high standards and explore opportunities for further optimization.",
                "icon": "🌟"
            }
        elif score >= 60:
            return {
                "rating": "GOOD",
                "color": "#10b981",  # Light green
                "message": "Your AI sustainability performance is good. Improving regional deployment and optimization adoption could increase the ESG score further.",
                "icon": "✅"
            }
        elif score >= 40:
            return {
                "rating": "FAIR",
                "color": "#f59e0b",  # Orange
                "message": "Your AI sustainability performance is fair. Focus on reducing carbon emissions, improving energy efficiency, and adopting optimization recommendations.",
                "icon": "⚠️"
            }
        else:
            return {
                "rating": "NEEDS IMPROVEMENT",
                "color": "#dc2626",  # Red
                "message": "Your AI sustainability performance needs improvement. Prioritize high-impact optimization recommendations and consider deploying workloads in low-carbon regions.",
                "icon": "🔴"
            }
