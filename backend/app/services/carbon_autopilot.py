"""
Carbon Autopilot Service
Automatically detect and manage idle AI resources to prevent waste
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict
from ..models.workload import AIWorkload
from ..models.scheduler import AutopilotAction

class CarbonAutopilot:
    """
    Automated carbon waste prevention system
    Detects idle resources and takes action to reduce emissions
    """
    
    # Configuration thresholds
    IDLE_THRESHOLD_MINUTES = 2  # Consider idle after 2 minutes (for demo)
    LONG_RUNNING_THRESHOLD_HOURS = 1  # Flag workloads running > 1 hour (for demo)
    
    @staticmethod
    def detect_idle_workloads(db: Session) -> List[Dict]:
        """Detect workloads that appear to be idle"""
        now = datetime.now()
        idle_threshold = now - timedelta(minutes=CarbonAutopilot.IDLE_THRESHOLD_MINUTES)
        
        # Find running workloads that haven't been updated recently
        idle_workloads = db.query(AIWorkload).filter(
            AIWorkload.status == "running",
            AIWorkload.updated_at < idle_threshold
        ).all()
        
        idle_list = []
        for workload in idle_workloads:
            idle_duration = (now - workload.updated_at).total_seconds() / 60
            
            # Estimate waste
            energy_per_minute = (workload.gpu_count * 0.3) / 60  # kWh per minute
            wasted_energy = energy_per_minute * idle_duration
            wasted_carbon = wasted_energy * 0.40  # Average carbon intensity
            wasted_cost = wasted_energy * 0.12  # $0.12/kWh
            
            idle_list.append({
                "workload_id": workload.id,
                "model_name": workload.model_name,
                "gpu_count": workload.gpu_count,
                "idle_duration_minutes": round(idle_duration, 1),
                "wasted_energy_kwh": round(wasted_energy, 3),
                "wasted_carbon_kg": round(wasted_carbon, 3),
                "wasted_cost_usd": round(wasted_cost, 2),
                "recommendation": "PAUSE" if idle_duration < 120 else "TERMINATE",
                "severity": "HIGH" if idle_duration > 60 else "MEDIUM"
            })
        
        return idle_list
    
    @staticmethod
    def detect_long_running_workloads(db: Session) -> List[Dict]:
        """Detect workloads running longer than expected"""
        now = datetime.now()
        long_running_threshold = now - timedelta(hours=CarbonAutopilot.LONG_RUNNING_THRESHOLD_HOURS)
        
        long_running = db.query(AIWorkload).filter(
            AIWorkload.status == "running",
            AIWorkload.start_time < long_running_threshold
        ).all()
        
        long_running_list = []
        for workload in long_running:
            runtime_hours = workload.runtime_seconds / 3600
            
            long_running_list.append({
                "workload_id": workload.id,
                "model_name": workload.model_name,
                "job_type": workload.job_type,
                "runtime_hours": round(runtime_hours, 1),
                "gpu_count": workload.gpu_count,
                "recommendation": "REVIEW",
                "message": f"Workload has been running for {runtime_hours:.1f} hours. Review if this is expected.",
                "severity": "MEDIUM"
            })
        
        return long_running_list
    
    @staticmethod
    def execute_autopilot_action(
        db: Session,
        workload_id: int,
        action_type: str,
        reason: str
    ) -> Dict:
        """Execute an autopilot action (simulation)"""
        workload = db.query(AIWorkload).filter(AIWorkload.id == workload_id).first()
        
        if not workload:
            return {"success": False, "message": "Workload not found"}
        
        if workload.status != "running":
            return {"success": False, "message": "Workload is not running"}
        
        # Calculate savings
        now = datetime.now()
        idle_duration = (now - workload.updated_at).total_seconds() / 60
        energy_per_minute = (workload.gpu_count * 0.3) / 60
        energy_saved = energy_per_minute * idle_duration
        carbon_saved = energy_saved * 0.40
        cost_saved = energy_saved * 0.12
        
        # Create autopilot action record
        action = AutopilotAction(
            workload_id=workload_id,
            action_type=action_type,
            reason=reason,
            idle_duration_minutes=int(idle_duration),
            carbon_saved_kg=carbon_saved,
            energy_saved_kwh=energy_saved,
            cost_saved_usd=cost_saved,
            status="EXECUTED"
        )
        
        db.add(action)
        
        # Update workload status
        if action_type == "TERMINATE":
            workload.status = "completed"
        elif action_type == "PAUSE_IDLE":
            workload.status = "paused"
        
        db.commit()
        db.refresh(action)
        
        return {
            "success": True,
            "action": action.to_dict(),
            "workload_status": workload.status,
            "savings": {
                "carbon_kg": round(carbon_saved, 3),
                "energy_kwh": round(energy_saved, 3),
                "cost_usd": round(cost_saved, 2)
            }
        }
    
    @staticmethod
    def get_autopilot_statistics(db: Session) -> Dict:
        """Get autopilot statistics"""
        total_actions = db.query(AutopilotAction).count()
        
        total_carbon_saved = db.query(AutopilotAction).with_entities(
            func.sum(AutopilotAction.carbon_saved_kg)
        ).scalar() or 0.0
        
        total_energy_saved = db.query(AutopilotAction).with_entities(
            func.sum(AutopilotAction.energy_saved_kwh)
        ).scalar() or 0.0
        
        total_cost_saved = db.query(AutopilotAction).with_entities(
            func.sum(AutopilotAction.cost_saved_usd)
        ).scalar() or 0.0
        
        # Count by action type
        actions_by_type = {}
        action_types = db.query(
            AutopilotAction.action_type,
            func.count(AutopilotAction.id)
        ).group_by(AutopilotAction.action_type).all()
        
        for action_type, count in action_types:
            actions_by_type[action_type] = count
        
        return {
            "total_actions": total_actions,
            "total_carbon_saved_kg": round(total_carbon_saved, 2),
            "total_energy_saved_kwh": round(total_energy_saved, 2),
            "total_cost_saved_usd": round(total_cost_saved, 2),
            "actions_by_type": actions_by_type,
            "average_carbon_saved_per_action_kg": round(
                total_carbon_saved / total_actions if total_actions > 0 else 0, 2
            )
        }
    
    @staticmethod
    def get_autopilot_recommendations(db: Session) -> Dict:
        """Get current autopilot recommendations"""
        idle_workloads = CarbonAutopilot.detect_idle_workloads(db)
        long_running = CarbonAutopilot.detect_long_running_workloads(db)
        
        # Calculate potential savings
        potential_carbon_savings = sum(w["wasted_carbon_kg"] for w in idle_workloads)
        potential_cost_savings = sum(w["wasted_cost_usd"] for w in idle_workloads)
        
        return {
            "idle_workloads": idle_workloads,
            "long_running_workloads": long_running,
            "total_idle_count": len(idle_workloads),
            "total_long_running_count": len(long_running),
            "potential_carbon_savings_kg": round(potential_carbon_savings, 2),
            "potential_cost_savings_usd": round(potential_cost_savings, 2),
            "recommendation": "Enable autopilot to automatically manage idle resources" if idle_workloads else "No idle resources detected"
        }
    
    @staticmethod
    def get_recent_actions(db: Session, limit: int = 10) -> List[Dict]:
        """Get recent autopilot actions"""
        actions = db.query(AutopilotAction).order_by(
            AutopilotAction.executed_at.desc()
        ).limit(limit).all()
        
        return [action.to_dict() for action in actions]
