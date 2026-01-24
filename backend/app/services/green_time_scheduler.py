"""
Green-Time Scheduler Service
Schedule workloads during low-carbon electricity periods
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from ..models.scheduler import GreenTimeWindow, ScheduledWorkload

class GreenTimeScheduler:
    """
    Schedules AI workloads during periods of low carbon intensity
    Reduces emissions by timing workloads with renewable energy availability
    """
    
    # Default green time windows (based on typical renewable energy patterns)
    DEFAULT_GREEN_WINDOWS = {
        "us-east-1": [
            {"day": 0, "start": 10, "end": 16, "carbon": 0.35, "renewable": 45},  # Monday 10am-4pm
            {"day": 1, "start": 10, "end": 16, "carbon": 0.35, "renewable": 45},
            {"day": 2, "start": 10, "end": 16, "carbon": 0.35, "renewable": 45},
            {"day": 3, "start": 10, "end": 16, "carbon": 0.35, "renewable": 45},
            {"day": 4, "start": 10, "end": 16, "carbon": 0.35, "renewable": 45},
            {"day": 5, "start": 11, "end": 15, "carbon": 0.38, "renewable": 40},  # Weekend
            {"day": 6, "start": 11, "end": 15, "carbon": 0.38, "renewable": 40},
        ],
        "eu-west-1": [
            {"day": 0, "start": 11, "end": 17, "carbon": 0.20, "renewable": 60},
            {"day": 1, "start": 11, "end": 17, "carbon": 0.20, "renewable": 60},
            {"day": 2, "start": 11, "end": 17, "carbon": 0.20, "renewable": 60},
            {"day": 3, "start": 11, "end": 17, "carbon": 0.20, "renewable": 60},
            {"day": 4, "start": 11, "end": 17, "carbon": 0.20, "renewable": 60},
            {"day": 5, "start": 12, "end": 16, "carbon": 0.22, "renewable": 55},
            {"day": 6, "start": 12, "end": 16, "carbon": 0.22, "renewable": 55},
        ],
        "ap-south-1": [
            {"day": 0, "start": 9, "end": 15, "carbon": 0.60, "renewable": 25},
            {"day": 1, "start": 9, "end": 15, "carbon": 0.60, "renewable": 25},
            {"day": 2, "start": 9, "end": 15, "carbon": 0.60, "renewable": 25},
            {"day": 3, "start": 9, "end": 15, "carbon": 0.60, "renewable": 25},
            {"day": 4, "start": 9, "end": 15, "carbon": 0.60, "renewable": 25},
            {"day": 5, "start": 10, "end": 14, "carbon": 0.65, "renewable": 20},
            {"day": 6, "start": 10, "end": 14, "carbon": 0.65, "renewable": 20},
        ]
    }
    
    @staticmethod
    def initialize_green_windows(db: Session):
        """Initialize default green time windows"""
        existing = db.query(GreenTimeWindow).count()
        if existing > 0:
            return {"message": "Green time windows already initialized", "count": existing}
        
        count = 0
        for region, windows in GreenTimeScheduler.DEFAULT_GREEN_WINDOWS.items():
            for window in windows:
                green_window = GreenTimeWindow(
                    region=region,
                    day_of_week=window["day"],
                    start_hour=window["start"],
                    end_hour=window["end"],
                    carbon_intensity=window["carbon"],
                    renewable_percentage=window["renewable"],
                    is_active=True
                )
                db.add(green_window)
                count += 1
        
        db.commit()
        return {"message": f"Initialized {count} green time windows", "count": count}
    
    @staticmethod
    def get_next_green_window(db: Session, region: str) -> Optional[Dict]:
        """Find the next available green time window for a region"""
        now = datetime.now()
        current_day = now.weekday()
        current_hour = now.hour
        
        # Check today's remaining windows
        windows = db.query(GreenTimeWindow).filter(
            GreenTimeWindow.region == region,
            GreenTimeWindow.day_of_week == current_day,
            GreenTimeWindow.start_hour > current_hour,
            GreenTimeWindow.is_active == True
        ).all()
        
        if windows:
            next_window = windows[0]
            scheduled_time = now.replace(hour=next_window.start_hour, minute=0, second=0)
            return {
                "window": next_window.to_dict(),
                "scheduled_time": scheduled_time,
                "hours_until": (scheduled_time - now).total_seconds() / 3600
            }
        
        # Check next 7 days
        for days_ahead in range(1, 8):
            check_day = (current_day + days_ahead) % 7
            windows = db.query(GreenTimeWindow).filter(
                GreenTimeWindow.region == region,
                GreenTimeWindow.day_of_week == check_day,
                GreenTimeWindow.is_active == True
            ).order_by(GreenTimeWindow.start_hour).all()
            
            if windows:
                next_window = windows[0]
                scheduled_time = now + timedelta(days=days_ahead)
                scheduled_time = scheduled_time.replace(
                    hour=next_window.start_hour, 
                    minute=0, 
                    second=0
                )
                return {
                    "window": next_window.to_dict(),
                    "scheduled_time": scheduled_time,
                    "hours_until": (scheduled_time - now).total_seconds() / 3600
                }
        
        return None
    
    @staticmethod
    def schedule_workload(
        db: Session,
        model_name: str,
        job_type: str,
        gpu_count: int,
        preferred_region: str,
        created_by: str = "System"
    ) -> Dict:
        """Schedule a workload for green-time execution"""
        next_window = GreenTimeScheduler.get_next_green_window(db, preferred_region)
        
        if not next_window:
            return {
                "success": False,
                "message": f"No green time windows available for region {preferred_region}"
            }
        
        # Calculate potential carbon savings
        normal_carbon_intensity = 0.40  # Average
        green_carbon_intensity = next_window["window"]["carbon_intensity"]
        estimated_energy_kwh = gpu_count * 0.3  # Rough estimate
        carbon_saved = (normal_carbon_intensity - green_carbon_intensity) * estimated_energy_kwh
        
        scheduled_workload = ScheduledWorkload(
            model_name=model_name,
            job_type=job_type,
            gpu_count=gpu_count,
            preferred_region=preferred_region,
            scheduled_time=next_window["scheduled_time"],
            status="SCHEDULED",
            carbon_saved_kg=max(0, carbon_saved),
            scheduling_reason=f"Scheduled during green time window ({next_window['window']['renewable_percentage']}% renewable)",
            created_by=created_by
        )
        
        db.add(scheduled_workload)
        db.commit()
        db.refresh(scheduled_workload)
        
        return {
            "success": True,
            "scheduled_workload": scheduled_workload.to_dict(),
            "green_window": next_window["window"],
            "hours_until_execution": next_window["hours_until"],
            "estimated_carbon_savings_kg": carbon_saved
        }
    
    @staticmethod
    def get_scheduled_workloads(db: Session, status: Optional[str] = None) -> List[Dict]:
        """Get all scheduled workloads"""
        query = db.query(ScheduledWorkload)
        if status:
            query = query.filter(ScheduledWorkload.status == status)
        
        workloads = query.order_by(ScheduledWorkload.scheduled_time).all()
        return [w.to_dict() for w in workloads]
    
    @staticmethod
    def get_scheduling_statistics(db: Session) -> Dict:
        """Get scheduling statistics"""
        total_scheduled = db.query(ScheduledWorkload).count()
        completed = db.query(ScheduledWorkload).filter(
            ScheduledWorkload.status == "COMPLETED"
        ).count()
        pending = db.query(ScheduledWorkload).filter(
            ScheduledWorkload.status == "SCHEDULED"
        ).count()
        
        total_carbon_saved = db.query(ScheduledWorkload).filter(
            ScheduledWorkload.status == "COMPLETED"
        ).with_entities(
            func.sum(ScheduledWorkload.carbon_saved_kg)
        ).scalar() or 0.0
        
        return {
            "total_scheduled": total_scheduled,
            "completed": completed,
            "pending": pending,
            "cancelled": total_scheduled - completed - pending,
            "total_carbon_saved_kg": round(total_carbon_saved, 2),
            "average_carbon_saved_per_workload_kg": round(
                total_carbon_saved / completed if completed > 0 else 0, 2
            )
        }
    
    @staticmethod
    def get_green_windows_by_region(db: Session, region: str) -> List[Dict]:
        """Get all green time windows for a region"""
        windows = db.query(GreenTimeWindow).filter(
            GreenTimeWindow.region == region,
            GreenTimeWindow.is_active == True
        ).order_by(
            GreenTimeWindow.day_of_week,
            GreenTimeWindow.start_hour
        ).all()
        
        return [w.to_dict() for w in windows]
