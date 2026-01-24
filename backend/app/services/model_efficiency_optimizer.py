"""
Model Efficiency Optimizer
Advanced optimization recommendations for model right-sizing
"""
from sqlalchemy.orm import Session
from typing import List, Dict
from ..models.workload import AIWorkload, JobType
from ..models.energy import EnergyUsage
from ..models.carbon import CarbonEmission

class ModelEfficiencyOptimizer:
    """
    Model Efficiency Optimizer
    
    Identifies opportunities to reduce compute at the source through:
    - Model quantization (reduce precision)
    - Model distillation (smaller student model)
    - Model right-sizing (switch to appropriate size)
    - Architecture optimization
    
    All recommendations are advisory only - no automated changes.
    """
    
    # Model size categories and their characteristics
    MODEL_SIZES = {
        "PolicyGPT": {
            "current_size": "large",
            "parameters": "7B",
            "alternatives": {
                "medium": {"parameters": "3B", "efficiency_gain": 0.60},
                "small": {"parameters": "1B", "efficiency_gain": 0.80}
            }
        },
        "RiskAssessor": {
            "current_size": "large",
            "parameters": "13B",
            "alternatives": {
                "medium": {"parameters": "7B", "efficiency_gain": 0.50},
                "small": {"parameters": "3B", "efficiency_gain": 0.75}
            }
        },
        "ClaimsBot": {
            "current_size": "medium",
            "parameters": "3B",
            "alternatives": {
                "small": {"parameters": "1B", "efficiency_gain": 0.65}
            }
        }
    }
    
    # Optimization techniques
    OPTIMIZATION_TECHNIQUES = {
        "quantization": {
            "name": "Model Quantization",
            "description": "Reduce model precision from FP32 to INT8",
            "efficiency_gain": 0.40,  # 40% reduction
            "accuracy_impact": "minimal (<2%)",
            "implementation_complexity": "low"
        },
        "distillation": {
            "name": "Knowledge Distillation",
            "description": "Train smaller student model from large teacher",
            "efficiency_gain": 0.60,  # 60% reduction
            "accuracy_impact": "moderate (3-5%)",
            "implementation_complexity": "high"
        },
        "pruning": {
            "name": "Model Pruning",
            "description": "Remove less important weights/neurons",
            "efficiency_gain": 0.30,  # 30% reduction
            "accuracy_impact": "minimal (<2%)",
            "implementation_complexity": "medium"
        }
    }
    
    @staticmethod
    def generate_model_optimization_recommendations(db: Session) -> List[Dict]:
        """
        Generate model efficiency optimization recommendations
        
        Analyzes workloads to identify:
        - Over-sized models for simple tasks
        - Models suitable for quantization
        - Candidates for distillation
        - Inefficient model architectures
        
        Returns:
            List of optimization recommendations
        """
        recommendations = []
        
        # Get all workloads with energy and carbon data
        workloads = db.query(AIWorkload).all()
        
        for workload in workloads:
            energy_record = db.query(EnergyUsage).filter(
                EnergyUsage.workload_id == workload.id
            ).first()
            
            carbon_record = db.query(CarbonEmission).filter(
                CarbonEmission.workload_id == workload.id
            ).first()
            
            if not energy_record or not carbon_record:
                continue
            
            # Only recommend for models with significant carbon footprint
            if carbon_record.carbon_kg < 0.2:
                continue
            
            # Check for model right-sizing opportunities
            if workload.model_name in ModelEfficiencyOptimizer.MODEL_SIZES:
                sizing_rec = ModelEfficiencyOptimizer._check_model_sizing(
                    workload, energy_record, carbon_record
                )
                if sizing_rec:
                    recommendations.append(sizing_rec)
            
            # Check for quantization opportunities
            if workload.job_type == JobType.INFERENCE:
                quant_rec = ModelEfficiencyOptimizer._check_quantization(
                    workload, energy_record, carbon_record
                )
                if quant_rec:
                    recommendations.append(quant_rec)
            
            # Check for distillation opportunities (training jobs)
            if workload.job_type == JobType.TRAINING and workload.model_name in ["PolicyGPT", "RiskAssessor"]:
                distill_rec = ModelEfficiencyOptimizer._check_distillation(
                    workload, energy_record, carbon_record
                )
                if distill_rec:
                    recommendations.append(distill_rec)
        
        return recommendations
    
    @staticmethod
    def _check_model_sizing(workload: AIWorkload, energy: EnergyUsage, carbon: CarbonEmission) -> Dict:
        """Check if model can be right-sized to smaller variant"""
        model_info = ModelEfficiencyOptimizer.MODEL_SIZES.get(workload.model_name)
        
        if not model_info or not model_info.get("alternatives"):
            return None
        
        # Recommend medium size for large models
        best_alternative = None
        best_efficiency = 0
        
        for size, details in model_info["alternatives"].items():
            if details["efficiency_gain"] > best_efficiency:
                best_efficiency = details["efficiency_gain"]
                best_alternative = (size, details)
        
        if not best_alternative:
            return None
        
        alt_size, alt_details = best_alternative
        
        # Calculate savings
        energy_saving = energy.energy_kwh * best_efficiency
        carbon_saving = carbon.carbon_kg * best_efficiency
        
        return {
            "type": "MODEL_SIZING",
            "workload_id": workload.id,
            "model_name": workload.model_name,
            "title": f"Right-Size {workload.model_name} Model",
            "description": f"Switch from {model_info['current_size']} ({model_info['parameters']}) to {alt_size} ({alt_details['parameters']}) model for {workload.job_type.value} tasks",
            "current_config": {
                "size": model_info['current_size'],
                "parameters": model_info['parameters']
            },
            "recommended_config": {
                "size": alt_size,
                "parameters": alt_details['parameters']
            },
            "estimated_energy_saving_kwh": round(energy_saving, 4),
            "estimated_carbon_saving_kg": round(carbon_saving, 4),
            "estimated_cost_impact_usd": round(-energy_saving * 0.12, 2),  # $0.12/kWh
            "efficiency_gain_percentage": round(best_efficiency * 100, 1),
            "implementation_notes": "Requires model redeployment and testing. Minimal accuracy impact expected for most tasks."
        }
    
    @staticmethod
    def _check_quantization(workload: AIWorkload, energy: EnergyUsage, carbon: CarbonEmission) -> Dict:
        """Check if model is suitable for quantization"""
        technique = ModelEfficiencyOptimizer.OPTIMIZATION_TECHNIQUES["quantization"]
        
        # Calculate savings
        energy_saving = energy.energy_kwh * technique["efficiency_gain"]
        carbon_saving = carbon.carbon_kg * technique["efficiency_gain"]
        
        return {
            "type": "QUANTIZATION",
            "workload_id": workload.id,
            "model_name": workload.model_name,
            "title": f"Quantize {workload.model_name} Model",
            "description": f"{technique['description']} for inference workloads",
            "technique": technique["name"],
            "current_config": {
                "precision": "FP32 (32-bit floating point)"
            },
            "recommended_config": {
                "precision": "INT8 (8-bit integer)"
            },
            "estimated_energy_saving_kwh": round(energy_saving, 4),
            "estimated_carbon_saving_kg": round(carbon_saving, 4),
            "estimated_cost_impact_usd": round(-energy_saving * 0.12, 2),
            "efficiency_gain_percentage": round(technique["efficiency_gain"] * 100, 1),
            "accuracy_impact": technique["accuracy_impact"],
            "implementation_complexity": technique["implementation_complexity"],
            "implementation_notes": "Use PyTorch quantization or TensorFlow Lite. Test accuracy on validation set before deployment."
        }
    
    @staticmethod
    def _check_distillation(workload: AIWorkload, energy: EnergyUsage, carbon: CarbonEmission) -> Dict:
        """Check if model is suitable for knowledge distillation"""
        technique = ModelEfficiencyOptimizer.OPTIMIZATION_TECHNIQUES["distillation"]
        
        # Calculate savings
        energy_saving = energy.energy_kwh * technique["efficiency_gain"]
        carbon_saving = carbon.carbon_kg * technique["efficiency_gain"]
        
        return {
            "type": "DISTILLATION",
            "workload_id": workload.id,
            "model_name": workload.model_name,
            "title": f"Distill {workload.model_name} Model",
            "description": f"{technique['description']} to reduce inference costs",
            "technique": technique["name"],
            "current_config": {
                "model_type": "Large teacher model"
            },
            "recommended_config": {
                "model_type": "Compact student model (3-5x smaller)"
            },
            "estimated_energy_saving_kwh": round(energy_saving, 4),
            "estimated_carbon_saving_kg": round(carbon_saving, 4),
            "estimated_cost_impact_usd": round(-energy_saving * 0.12, 2),
            "efficiency_gain_percentage": round(technique["efficiency_gain"] * 100, 1),
            "accuracy_impact": technique["accuracy_impact"],
            "implementation_complexity": technique["implementation_complexity"],
            "implementation_notes": "Requires training student model with teacher supervision. Budget 2-4 weeks for implementation and validation."
        }
    
    @staticmethod
    def get_optimization_summary(db: Session) -> Dict:
        """
        Get summary of model optimization opportunities
        
        Returns:
            Summary statistics
        """
        recommendations = ModelEfficiencyOptimizer.generate_model_optimization_recommendations(db)
        
        total_energy_saving = sum(r.get("estimated_energy_saving_kwh", 0) for r in recommendations)
        total_carbon_saving = sum(r.get("estimated_carbon_saving_kg", 0) for r in recommendations)
        total_cost_impact = sum(r.get("estimated_cost_impact_usd", 0) for r in recommendations)
        
        by_type = {}
        for rec in recommendations:
            rec_type = rec.get("type", "UNKNOWN")
            if rec_type not in by_type:
                by_type[rec_type] = 0
            by_type[rec_type] += 1
        
        return {
            "total_opportunities": len(recommendations),
            "total_energy_saving_kwh": round(total_energy_saving, 4),
            "total_carbon_saving_kg": round(total_carbon_saving, 4),
            "total_cost_savings_usd": round(-total_cost_impact, 2),
            "by_type": by_type,
            "recommendations": recommendations
        }
