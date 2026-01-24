"""
Climate Risk Simulator Service
Predictive climate impact modeling for strategic planning
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Dict, List
from ..models.workload import AIWorkload
from ..models.energy import EnergyUsage
from ..models.scheduler import ClimateRiskScore

class ClimateRiskSimulator:
    """
    Strategic climate risk assessment tool
    Projects long-term climate impact of AI operations
    """
    
    # Risk thresholds (annual emissions in kg CO₂)
    RISK_THRESHOLDS = {
        "LOW": 1000,        # < 1 ton/year
        "MODERATE": 5000,   # 1-5 tons/year
        "HIGH": 10000,      # 5-10 tons/year
        "CRITICAL": 10000   # > 10 tons/year
    }
    
    @staticmethod
    def calculate_emissions_trend(db: Session, days: int = 30) -> str:
        """Calculate emissions trend over recent period"""
        now = datetime.now()
        period_start = now - timedelta(days=days)
        mid_point = period_start + timedelta(days=days/2)
        
        # Get emissions for first half
        first_half = db.query(AIWorkload).filter(
            AIWorkload.created_at >= period_start,
            AIWorkload.created_at < mid_point
        ).count()
        
        # Get emissions for second half
        second_half = db.query(AIWorkload).filter(
            AIWorkload.created_at >= mid_point,
            AIWorkload.created_at < now
        ).count()
        
        if second_half > first_half * 1.1:
            return "INCREASING"
        elif second_half < first_half * 0.9:
            return "DECREASING"
        else:
            return "STABLE"
    
    @staticmethod
    def project_annual_emissions(db: Session) -> float:
        """Project annual emissions based on recent activity"""
        # Get last 30 days of emissions
        now = datetime.now()
        thirty_days_ago = now - timedelta(days=30)
        
        recent_workloads = db.query(AIWorkload).filter(
            AIWorkload.created_at >= thirty_days_ago
        ).all()
        
        # Calculate total emissions
        total_emissions = 0.0
        for workload in recent_workloads:
            # Get energy usage for this workload
            energy_record = db.query(EnergyUsage).filter(
                EnergyUsage.workload_id == workload.id
            ).first()
            
            if energy_record:
                # Use region-specific carbon intensity
                carbon_intensity = {
                    "us-east-1": 0.40,
                    "eu-west-1": 0.25,
                    "ap-south-1": 0.70
                }.get(workload.cloud_region, 0.40)
                
                total_emissions += energy_record.energy_kwh * carbon_intensity
        
        # Project to annual (30 days * 12 months)
        projected_annual = (total_emissions / 30) * 365
        
        return projected_annual
    
    @staticmethod
    def identify_risk_factors(
        db: Session,
        projected_annual_emissions: float,
        emissions_trend: str
    ) -> List[Dict]:
        """Identify specific risk factors"""
        risk_factors = []
        
        # High emissions risk
        if projected_annual_emissions > ClimateRiskSimulator.RISK_THRESHOLDS["HIGH"]:
            risk_factors.append({
                "factor": "HIGH_EMISSIONS",
                "severity": "HIGH",
                "description": f"Projected annual emissions ({projected_annual_emissions:.0f} kg CO₂) exceed sustainable thresholds",
                "impact": "Significant contribution to organizational carbon footprint"
            })
        
        # Increasing trend risk
        if emissions_trend == "INCREASING":
            risk_factors.append({
                "factor": "INCREASING_TREND",
                "severity": "MEDIUM",
                "description": "AI workload emissions are trending upward",
                "impact": "Future emissions may exceed current projections"
            })
        
        # Check for high-carbon regions
        high_carbon_workloads = db.query(AIWorkload).filter(
            AIWorkload.cloud_region == "ap-south-1",
            AIWorkload.status == "running"
        ).count()
        
        total_running = db.query(AIWorkload).filter(
            AIWorkload.status == "running"
        ).count()
        
        if total_running > 0 and (high_carbon_workloads / total_running) > 0.3:
            risk_factors.append({
                "factor": "HIGH_CARBON_REGIONS",
                "severity": "MEDIUM",
                "description": f"{(high_carbon_workloads/total_running)*100:.0f}% of workloads in high-carbon regions",
                "impact": "Regional distribution increases carbon intensity"
            })
        
        # Check for lack of optimization
        total_workloads = db.query(AIWorkload).count()
        if total_workloads > 100:  # Only flag if significant volume
            risk_factors.append({
                "factor": "OPTIMIZATION_OPPORTUNITY",
                "severity": "LOW",
                "description": "Optimization recommendations available but not fully adopted",
                "impact": "Missing opportunities for emissions reduction"
            })
        
        return risk_factors
    
    @staticmethod
    def generate_mitigation_recommendations(
        risk_factors: List[Dict],
        projected_annual_emissions: float
    ) -> List[Dict]:
        """Generate mitigation recommendations based on risk factors"""
        recommendations = []
        
        for factor in risk_factors:
            if factor["factor"] == "HIGH_EMISSIONS":
                recommendations.append({
                    "priority": "HIGH",
                    "action": "Implement aggressive optimization program",
                    "target": "Reduce emissions by 30% within 6 months",
                    "estimated_impact_kg": projected_annual_emissions * 0.3
                })
            
            elif factor["factor"] == "INCREASING_TREND":
                recommendations.append({
                    "priority": "MEDIUM",
                    "action": "Establish emissions monitoring and caps",
                    "target": "Stabilize emissions at current levels",
                    "estimated_impact_kg": projected_annual_emissions * 0.15
                })
            
            elif factor["factor"] == "HIGH_CARBON_REGIONS":
                recommendations.append({
                    "priority": "MEDIUM",
                    "action": "Migrate workloads to low-carbon regions (EU)",
                    "target": "Shift 50% of workloads to EU regions",
                    "estimated_impact_kg": projected_annual_emissions * 0.25
                })
            
            elif factor["factor"] == "OPTIMIZATION_OPPORTUNITY":
                recommendations.append({
                    "priority": "LOW",
                    "action": "Adopt pending optimization recommendations",
                    "target": "Implement model efficiency improvements",
                    "estimated_impact_kg": projected_annual_emissions * 0.10
                })
        
        return recommendations
    
    @staticmethod
    def calculate_risk_score(
        projected_annual_emissions: float,
        emissions_trend: str,
        risk_factors: List[Dict]
    ) -> float:
        """Calculate overall climate risk score (0-100)"""
        # Base score from emissions level
        if projected_annual_emissions < ClimateRiskSimulator.RISK_THRESHOLDS["LOW"]:
            base_score = 20
        elif projected_annual_emissions < ClimateRiskSimulator.RISK_THRESHOLDS["MODERATE"]:
            base_score = 40
        elif projected_annual_emissions < ClimateRiskSimulator.RISK_THRESHOLDS["HIGH"]:
            base_score = 60
        else:
            base_score = 80
        
        # Adjust for trend
        if emissions_trend == "INCREASING":
            base_score += 10
        elif emissions_trend == "DECREASING":
            base_score -= 10
        
        # Adjust for risk factors
        high_severity_count = sum(1 for f in risk_factors if f["severity"] == "HIGH")
        base_score += high_severity_count * 5
        
        return min(100, max(0, base_score))
    
    @staticmethod
    def determine_impact_category(risk_score: float) -> str:
        """Determine climate impact category"""
        if risk_score < 30:
            return "LOW"
        elif risk_score < 50:
            return "MODERATE"
        elif risk_score < 70:
            return "HIGH"
        else:
            return "CRITICAL"
    
    @staticmethod
    def generate_climate_risk_assessment(db: Session) -> Dict:
        """Generate comprehensive climate risk assessment"""
        # Calculate current emissions
        now = datetime.now()
        thirty_days_ago = now - timedelta(days=30)
        
        recent_workloads = db.query(AIWorkload).filter(
            AIWorkload.created_at >= thirty_days_ago
        ).all()
        
        total_emissions = 0.0
        for workload in recent_workloads:
            # Get energy usage for this workload
            energy_record = db.query(EnergyUsage).filter(
                EnergyUsage.workload_id == workload.id
            ).first()
            
            if energy_record:
                carbon_intensity = {
                    "us-east-1": 0.40,
                    "eu-west-1": 0.25,
                    "ap-south-1": 0.70
                }.get(workload.cloud_region, 0.40)
                total_emissions += energy_record.energy_kwh * carbon_intensity
        
        # Project annual emissions
        projected_annual = ClimateRiskSimulator.project_annual_emissions(db)
        
        # Calculate trend
        emissions_trend = ClimateRiskSimulator.calculate_emissions_trend(db)
        
        # Identify risk factors
        risk_factors = ClimateRiskSimulator.identify_risk_factors(
            db, projected_annual, emissions_trend
        )
        
        # Calculate risk score
        risk_score = ClimateRiskSimulator.calculate_risk_score(
            projected_annual, emissions_trend, risk_factors
        )
        
        # Determine impact category
        impact_category = ClimateRiskSimulator.determine_impact_category(risk_score)
        
        # Generate recommendations
        recommendations = ClimateRiskSimulator.generate_mitigation_recommendations(
            risk_factors, projected_annual
        )
        
        # Save to database
        climate_risk = ClimateRiskScore(
            risk_score=risk_score,
            total_emissions_kg=total_emissions,
            emissions_trend=emissions_trend,
            projected_annual_emissions_kg=projected_annual,
            climate_impact_category=impact_category,
            risk_factors=risk_factors,
            mitigation_recommendations=recommendations
        )
        
        db.add(climate_risk)
        db.commit()
        db.refresh(climate_risk)
        
        return climate_risk.to_dict()
    
    @staticmethod
    def get_risk_history(db: Session, days: int = 30) -> List[Dict]:
        """Get historical climate risk scores"""
        cutoff = datetime.now() - timedelta(days=days)
        
        scores = db.query(ClimateRiskScore).filter(
            ClimateRiskScore.score_date >= cutoff
        ).order_by(ClimateRiskScore.score_date).all()
        
        return [score.to_dict() for score in scores]
    
    @staticmethod
    def get_latest_assessment(db: Session) -> Dict:
        """Get the most recent climate risk assessment"""
        latest = db.query(ClimateRiskScore).order_by(
            ClimateRiskScore.score_date.desc()
        ).first()
        
        if latest:
            return latest.to_dict()
        
        # Generate new assessment if none exists
        return ClimateRiskSimulator.generate_climate_risk_assessment(db)
