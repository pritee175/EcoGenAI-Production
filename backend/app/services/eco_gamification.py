"""
Eco-Score Gamification Service
Team-based sustainability engagement and competition
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List, Dict
from ..models.scheduler import TeamEcoScore

class EcoGamification:
    """
    Gamification system for sustainability engagement
    Encourages behavioral change through team competition
    """
    
    # Badge definitions
    BADGES = {
        "CARBON_SAVER_BRONZE": {
            "name": "Carbon Saver Bronze",
            "description": "Saved 10 kg CO₂",
            "threshold": 10,
            "icon": "🥉"
        },
        "CARBON_SAVER_SILVER": {
            "name": "Carbon Saver Silver",
            "description": "Saved 50 kg CO₂",
            "threshold": 50,
            "icon": "🥈"
        },
        "CARBON_SAVER_GOLD": {
            "name": "Carbon Saver Gold",
            "description": "Saved 100 kg CO₂",
            "threshold": 100,
            "icon": "🥇"
        },
        "EARLY_ADOPTER": {
            "name": "Early Adopter",
            "description": "Adopted 5 optimizations",
            "threshold": 5,
            "icon": "🚀"
        },
        "EFFICIENCY_CHAMPION": {
            "name": "Efficiency Champion",
            "description": "Adopted 20 optimizations",
            "threshold": 20,
            "icon": "⚡"
        },
        "GREEN_LEADER": {
            "name": "Green Leader",
            "description": "Top team for the month",
            "threshold": 1,
            "icon": "🌟"
        },
        "CONSISTENCY_AWARD": {
            "name": "Consistency Award",
            "description": "Active for 3 consecutive months",
            "threshold": 3,
            "icon": "📈"
        }
    }
    
    @staticmethod
    def calculate_team_score(
        carbon_saved_kg: float,
        energy_saved_kwh: float,
        optimizations_adopted: int
    ) -> int:
        """Calculate team eco-score based on actions"""
        # Scoring formula
        carbon_points = carbon_saved_kg * 10  # 10 points per kg CO₂
        energy_points = energy_saved_kwh * 5  # 5 points per kWh
        optimization_points = optimizations_adopted * 50  # 50 points per optimization
        
        total_score = int(carbon_points + energy_points + optimization_points)
        return max(0, total_score)
    
    @staticmethod
    def update_team_score(
        db: Session,
        team_name: str,
        carbon_saved_kg: float = 0,
        energy_saved_kwh: float = 0,
        optimizations_adopted: int = 0
    ) -> Dict:
        """Update team score for current month"""
        current_month = datetime.now().strftime("%Y-%m")
        
        # Get or create team score for current month
        team_score = db.query(TeamEcoScore).filter(
            TeamEcoScore.team_name == team_name,
            TeamEcoScore.month == current_month
        ).first()
        
        if not team_score:
            team_score = TeamEcoScore(
                team_name=team_name,
                month=current_month,
                score=0,
                carbon_saved_kg=0,
                energy_saved_kwh=0,
                optimizations_adopted=0,
                badges=[]
            )
            db.add(team_score)
        
        # Update metrics
        team_score.carbon_saved_kg += carbon_saved_kg
        team_score.energy_saved_kwh += energy_saved_kwh
        team_score.optimizations_adopted += optimizations_adopted
        
        # Recalculate score
        team_score.score = EcoGamification.calculate_team_score(
            team_score.carbon_saved_kg,
            team_score.energy_saved_kwh,
            team_score.optimizations_adopted
        )
        
        # Check for new badges
        new_badges = EcoGamification._check_badges(team_score)
        if new_badges:
            current_badges = team_score.badges or []
            for badge in new_badges:
                if badge not in current_badges:
                    current_badges.append(badge)
            team_score.badges = current_badges
        
        db.commit()
        db.refresh(team_score)
        
        # Update rankings
        EcoGamification._update_rankings(db, current_month)
        
        return {
            "team_score": team_score.to_dict(),
            "new_badges": new_badges
        }
    
    @staticmethod
    def _check_badges(team_score: TeamEcoScore) -> List[str]:
        """Check if team has earned new badges"""
        new_badges = []
        
        # Carbon saver badges
        if team_score.carbon_saved_kg >= 100:
            new_badges.append("CARBON_SAVER_GOLD")
        elif team_score.carbon_saved_kg >= 50:
            new_badges.append("CARBON_SAVER_SILVER")
        elif team_score.carbon_saved_kg >= 10:
            new_badges.append("CARBON_SAVER_BRONZE")
        
        # Optimization badges
        if team_score.optimizations_adopted >= 20:
            new_badges.append("EFFICIENCY_CHAMPION")
        elif team_score.optimizations_adopted >= 5:
            new_badges.append("EARLY_ADOPTER")
        
        return new_badges
    
    @staticmethod
    def _update_rankings(db: Session, month: str):
        """Update team rankings for the month"""
        teams = db.query(TeamEcoScore).filter(
            TeamEcoScore.month == month
        ).order_by(TeamEcoScore.score.desc()).all()
        
        for rank, team in enumerate(teams, 1):
            team.rank = rank
            # Award green leader badge to top team
            if rank == 1 and "GREEN_LEADER" not in (team.badges or []):
                badges = team.badges or []
                badges.append("GREEN_LEADER")
                team.badges = badges
        
        db.commit()
    
    @staticmethod
    def get_leaderboard(db: Session, month: str = None) -> List[Dict]:
        """Get team leaderboard"""
        if not month:
            month = datetime.now().strftime("%Y-%m")
        
        teams = db.query(TeamEcoScore).filter(
            TeamEcoScore.month == month
        ).order_by(TeamEcoScore.rank).all()
        
        return [team.to_dict() for team in teams]
    
    @staticmethod
    def get_team_stats(db: Session, team_name: str) -> Dict:
        """Get comprehensive team statistics"""
        current_month = datetime.now().strftime("%Y-%m")
        
        current_score = db.query(TeamEcoScore).filter(
            TeamEcoScore.team_name == team_name,
            TeamEcoScore.month == current_month
        ).first()
        
        # Get historical performance
        all_scores = db.query(TeamEcoScore).filter(
            TeamEcoScore.team_name == team_name
        ).order_by(TeamEcoScore.month).all()
        
        total_carbon = sum(s.carbon_saved_kg for s in all_scores)
        total_energy = sum(s.energy_saved_kwh for s in all_scores)
        total_optimizations = sum(s.optimizations_adopted for s in all_scores)
        
        # Collect all unique badges
        all_badges = set()
        for score in all_scores:
            if score.badges:
                all_badges.update(score.badges)
        
        return {
            "team_name": team_name,
            "current_month": current_score.to_dict() if current_score else None,
            "all_time_stats": {
                "total_carbon_saved_kg": round(total_carbon, 2),
                "total_energy_saved_kwh": round(total_energy, 2),
                "total_optimizations_adopted": total_optimizations,
                "months_active": len(all_scores),
                "total_badges": len(all_badges),
                "badges": list(all_badges)
            },
            "monthly_history": [s.to_dict() for s in all_scores]
        }
    
    @staticmethod
    def get_badge_info() -> Dict:
        """Get information about all available badges"""
        return EcoGamification.BADGES
    
    @staticmethod
    def get_gamification_summary(db: Session) -> Dict:
        """Get overall gamification statistics"""
        current_month = datetime.now().strftime("%Y-%m")
        
        total_teams = db.query(TeamEcoScore).filter(
            TeamEcoScore.month == current_month
        ).count()
        
        total_carbon = db.query(TeamEcoScore).filter(
            TeamEcoScore.month == current_month
        ).with_entities(
            func.sum(TeamEcoScore.carbon_saved_kg)
        ).scalar() or 0.0
        
        total_optimizations = db.query(TeamEcoScore).filter(
            TeamEcoScore.month == current_month
        ).with_entities(
            func.sum(TeamEcoScore.optimizations_adopted)
        ).scalar() or 0
        
        # Get top team
        top_team = db.query(TeamEcoScore).filter(
            TeamEcoScore.month == current_month,
            TeamEcoScore.rank == 1
        ).first()
        
        return {
            "current_month": current_month,
            "total_teams": total_teams,
            "total_carbon_saved_kg": round(total_carbon, 2),
            "total_optimizations_adopted": total_optimizations,
            "top_team": top_team.to_dict() if top_team else None,
            "average_score_per_team": round(
                db.query(TeamEcoScore).filter(
                    TeamEcoScore.month == current_month
                ).with_entities(
                    func.avg(TeamEcoScore.score)
                ).scalar() or 0, 0
            )
        }
