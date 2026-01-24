"""
Cost vs Carbon Analyzer
Business decision support for sustainability trade-offs
"""
from sqlalchemy.orm import Session
from typing import Dict
from datetime import datetime, timedelta
from ..models.governance import CostImpactAnalysis
from ..models.carbon import CarbonEmission
from ..models.energy import EnergyUsage
from ..models.workload import AIWorkload
from ..services.optimization_engine import OptimizationEngine
from ..services.model_efficiency_optimizer import ModelEfficiencyOptimizer

class CostAnalyzer:
    """
    Cost vs Carbon Analyzer
    
    Provides business decision support by analyzing:
    - Current cloud costs vs carbon emissions
    - Potential savings from optimization
    - ROI of sustainability initiatives
    - Cost per kg CO₂ saved
    - Payback periods
    
    Enables leadership to make informed trade-off decisions.
    """
    
    # Cost assumptions (configurable)
    CLOUD_COST_PER_KWH = 0.12  # $0.12 per kWh (typical cloud pricing)
    CLOUD_COST_PER_GPU_HOUR = 2.50  # $2.50 per GPU hour
    IMPLEMENTATION_COST_PER_ACTION = 500  # $500 per optimization action
    
    @staticmethod
    def calculate_current_costs(db: Session) -> Dict:
        """
        Calculate current cloud costs based on energy usage
        
        Returns:
            Dictionary with cost breakdown
        """
        # Get all energy usage
        energy_records = db.query(EnergyUsage).all()
        total_energy_kwh = sum(e.energy_kwh for e in energy_records)
        
        # Calculate energy-based cost
        energy_cost = total_energy_kwh * CostAnalyzer.CLOUD_COST_PER_KWH
        
        # Calculate GPU-based cost
        workloads = db.query(AIWorkload).all()
        total_gpu_hours = sum(
            (w.runtime_seconds / 3600.0) * w.gpu_count 
            for w in workloads
        )
        gpu_cost = total_gpu_hours * CostAnalyzer.CLOUD_COST_PER_GPU_HOUR
        
        # Use higher estimate (more conservative)
        estimated_cost = max(energy_cost, gpu_cost)
        
        return {
            "total_energy_kwh": round(total_energy_kwh, 4),
            "total_gpu_hours": round(total_gpu_hours, 2),
            "energy_based_cost_usd": round(energy_cost, 2),
            "gpu_based_cost_usd": round(gpu_cost, 2),
            "estimated_cloud_cost_usd": round(estimated_cost, 2),
            "cost_calculation_method": "GPU hours" if gpu_cost > energy_cost else "Energy consumption"
        }
    
    @staticmethod
    def calculate_optimization_savings(db: Session) -> Dict:
        """
        Calculate potential savings from all optimization opportunities
        
        Returns:
            Dictionary with savings breakdown
        """
        # Get optimization recommendations
        opt_recommendations = OptimizationEngine.generate_recommendations(db)
        model_recommendations = ModelEfficiencyOptimizer.generate_model_optimization_recommendations(db)
        
        all_recommendations = opt_recommendations + model_recommendations
        
        # Calculate total potential savings
        total_carbon_saving = sum(
            rec.get("estimated_carbon_saving_kg", 0) 
            for rec in all_recommendations
        )
        
        total_energy_saving = sum(
            rec.get("estimated_energy_saving_kwh", 0) 
            for rec in all_recommendations
        )
        
        # Calculate cost savings
        energy_cost_saving = total_energy_saving * CostAnalyzer.CLOUD_COST_PER_KWH
        
        # Calculate implementation cost
        implementation_cost = len(all_recommendations) * CostAnalyzer.IMPLEMENTATION_COST_PER_ACTION
        
        # Calculate net savings
        net_savings = energy_cost_saving - implementation_cost
        
        # Calculate ROI
        roi_months = (implementation_cost / energy_cost_saving * 12) if energy_cost_saving > 0 else 0
        
        return {
            "total_opportunities": len(all_recommendations),
            "total_carbon_saving_kg": round(total_carbon_saving, 4),
            "total_energy_saving_kwh": round(total_energy_saving, 4),
            "potential_cost_savings_usd": round(energy_cost_saving, 2),
            "implementation_cost_usd": round(implementation_cost, 2),
            "net_savings_usd": round(net_savings, 2),
            "roi_months": round(roi_months, 1),
            "cost_per_kg_carbon_saved": round(implementation_cost / total_carbon_saving, 2) if total_carbon_saving > 0 else 0
        }
    
    @staticmethod
    def generate_cost_impact_analysis(db: Session) -> Dict:
        """
        Generate comprehensive cost vs carbon analysis
        
        Returns:
            Complete analysis for decision support
        """
        # Get current costs
        current_costs = CostAnalyzer.calculate_current_costs(db)
        
        # Get optimization savings
        optimization_savings = CostAnalyzer.calculate_optimization_savings(db)
        
        # Get current carbon
        carbon_records = db.query(CarbonEmission).all()
        total_carbon_kg = sum(c.carbon_kg for c in carbon_records)
        
        # Calculate carbon reduction percentage
        carbon_reduction_pct = (
            optimization_savings["total_carbon_saving_kg"] / total_carbon_kg * 100
        ) if total_carbon_kg > 0 else 0
        
        # Calculate cost reduction percentage
        cost_reduction_pct = (
            optimization_savings["net_savings_usd"] / current_costs["estimated_cloud_cost_usd"] * 100
        ) if current_costs["estimated_cloud_cost_usd"] > 0 else 0
        
        # Breakdown by action type
        action_breakdown = CostAnalyzer._calculate_action_breakdown(db)
        
        return {
            "analysis_date": datetime.utcnow().isoformat(),
            "current_state": {
                "total_carbon_kg": round(total_carbon_kg, 4),
                "total_energy_kwh": current_costs["total_energy_kwh"],
                "estimated_cloud_cost_usd": current_costs["estimated_cloud_cost_usd"],
                "total_workloads": db.query(AIWorkload).count()
            },
            "optimization_potential": {
                "carbon_saving_kg": optimization_savings["total_carbon_saving_kg"],
                "energy_saving_kwh": optimization_savings["total_energy_saving_kwh"],
                "cost_savings_usd": optimization_savings["potential_cost_savings_usd"],
                "implementation_cost_usd": optimization_savings["implementation_cost_usd"],
                "net_savings_usd": optimization_savings["net_savings_usd"]
            },
            "impact_metrics": {
                "carbon_reduction_percentage": round(carbon_reduction_pct, 2),
                "cost_reduction_percentage": round(cost_reduction_pct, 2),
                "cost_per_kg_carbon_saved": optimization_savings["cost_per_kg_carbon_saved"],
                "roi_months": optimization_savings["roi_months"]
            },
            "action_breakdown": action_breakdown,
            "recommendation": CostAnalyzer._generate_recommendation(
                carbon_reduction_pct, 
                cost_reduction_pct, 
                optimization_savings["roi_months"]
            )
        }
    
    @staticmethod
    def _calculate_action_breakdown(db: Session) -> Dict:
        """Calculate savings breakdown by action type"""
        opt_recommendations = OptimizationEngine.generate_recommendations(db)
        model_recommendations = ModelEfficiencyOptimizer.generate_model_optimization_recommendations(db)
        
        breakdown = {}
        
        # Process optimization recommendations
        for rec in opt_recommendations:
            rec_type = rec.get("recommendation_type", "UNKNOWN")
            if rec_type not in breakdown:
                breakdown[rec_type] = {
                    "count": 0,
                    "carbon_saving_kg": 0,
                    "cost_impact_usd": 0
                }
            breakdown[rec_type]["count"] += 1
            breakdown[rec_type]["carbon_saving_kg"] += rec.get("estimated_carbon_saving_kg", 0)
            
            # Estimate cost impact
            energy_saving = rec.get("estimated_energy_saving_kwh", 0)
            cost_saving = energy_saving * CostAnalyzer.CLOUD_COST_PER_KWH
            breakdown[rec_type]["cost_impact_usd"] += -cost_saving  # Negative = savings
        
        # Process model optimization recommendations
        for rec in model_recommendations:
            rec_type = rec.get("type", "UNKNOWN")
            if rec_type not in breakdown:
                breakdown[rec_type] = {
                    "count": 0,
                    "carbon_saving_kg": 0,
                    "cost_impact_usd": 0
                }
            breakdown[rec_type]["count"] += 1
            breakdown[rec_type]["carbon_saving_kg"] += rec.get("estimated_carbon_saving_kg", 0)
            breakdown[rec_type]["cost_impact_usd"] += rec.get("estimated_cost_impact_usd", 0)
        
        # Round values
        for key in breakdown:
            breakdown[key]["carbon_saving_kg"] = round(breakdown[key]["carbon_saving_kg"], 4)
            breakdown[key]["cost_impact_usd"] = round(breakdown[key]["cost_impact_usd"], 2)
        
        return breakdown
    
    @staticmethod
    def _generate_recommendation(carbon_reduction_pct: float, cost_reduction_pct: float, roi_months: float) -> Dict:
        """Generate business recommendation based on analysis"""
        if carbon_reduction_pct > 30 and cost_reduction_pct > 10 and roi_months < 6:
            return {
                "priority": "HIGH",
                "message": "Strong business case: Significant carbon reduction with positive ROI and quick payback.",
                "action": "Recommend immediate implementation of high-priority optimizations."
            }
        elif carbon_reduction_pct > 20 and roi_months < 12:
            return {
                "priority": "MEDIUM",
                "message": "Good opportunity: Meaningful carbon reduction with acceptable ROI.",
                "action": "Recommend phased implementation starting with low-complexity actions."
            }
        elif carbon_reduction_pct > 10:
            return {
                "priority": "LOW",
                "message": "Moderate opportunity: Some carbon reduction potential but longer payback period.",
                "action": "Consider implementation as part of broader ESG strategy."
            }
        else:
            return {
                "priority": "MONITOR",
                "message": "Limited immediate opportunity: Continue monitoring for new optimization possibilities.",
                "action": "Focus on operational efficiency and workload optimization."
            }
    
    @staticmethod
    def save_cost_analysis(db: Session) -> CostImpactAnalysis:
        """
        Save cost analysis to database for historical tracking
        
        Returns:
            Saved CostImpactAnalysis record
        """
        analysis = CostAnalyzer.generate_cost_impact_analysis(db)
        
        # Create database record
        cost_analysis = CostImpactAnalysis(
            period_start=datetime.utcnow() - timedelta(days=1),
            period_end=datetime.utcnow(),
            total_carbon_kg=analysis["current_state"]["total_carbon_kg"],
            potential_carbon_savings_kg=analysis["optimization_potential"]["carbon_saving_kg"],
            current_cloud_cost_usd=analysis["current_state"]["estimated_cloud_cost_usd"],
            potential_cost_savings_usd=analysis["optimization_potential"]["cost_savings_usd"],
            optimization_implementation_cost_usd=analysis["optimization_potential"]["implementation_cost_usd"],
            net_cost_impact_usd=analysis["optimization_potential"]["net_savings_usd"],
            carbon_reduction_percentage=analysis["impact_metrics"]["carbon_reduction_percentage"],
            cost_per_kg_carbon_saved=analysis["impact_metrics"]["cost_per_kg_carbon_saved"],
            roi_months=analysis["impact_metrics"]["roi_months"],
            action_breakdown=analysis["action_breakdown"]
        )
        
        db.add(cost_analysis)
        db.commit()
        db.refresh(cost_analysis)
        
        return cost_analysis
