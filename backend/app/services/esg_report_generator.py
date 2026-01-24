"""
ESG Report Generator
Generates audit-ready ESG reports for regulatory compliance
"""
from sqlalchemy.orm import Session
from typing import Dict, List
from datetime import datetime, timedelta
import json
from ..models.workload import AIWorkload
from ..models.energy import EnergyUsage
from ..models.carbon import CarbonEmission
from ..models.esg_score import ESGScore
from ..models.governance import ActionRequest, ApprovalStatus
from ..config import carbon_config

class ESGReportGenerator:
    """
    ESG Report Generator
    
    Generates comprehensive ESG reports for:
    - Regulatory compliance
    - Audit requirements
    - Stakeholder reporting
    - Board presentations
    
    Reports include:
    - Methodology and assumptions
    - Carbon intensity factors
    - Transparency notes
    - Audit trail
    """
    
    @staticmethod
    def generate_comprehensive_report(db: Session, period_days: int = 30) -> Dict:
        """
        Generate comprehensive ESG report
        
        Args:
            db: Database session
            period_days: Reporting period in days
            
        Returns:
            Complete ESG report dictionary
        """
        cutoff_date = datetime.utcnow() - timedelta(days=period_days)
        
        # Executive Summary
        executive_summary = ESGReportGenerator._generate_executive_summary(db, cutoff_date)
        
        # AI Workload Summary
        workload_summary = ESGReportGenerator._generate_workload_summary(db, cutoff_date)
        
        # Energy Consumption Report
        energy_report = ESGReportGenerator._generate_energy_report(db, cutoff_date)
        
        # Carbon Emissions Report
        carbon_report = ESGReportGenerator._generate_carbon_report(db, cutoff_date)
        
        # ESG Score Trend
        esg_trend = ESGReportGenerator._generate_esg_trend(db, cutoff_date)
        
        # Optimization Actions
        optimization_actions = ESGReportGenerator._generate_optimization_report(db, cutoff_date)
        
        # Methodology & Transparency
        methodology = ESGReportGenerator._generate_methodology_section()
        
        # Compliance Statements
        compliance = ESGReportGenerator._generate_compliance_section()
        
        return {
            "report_metadata": {
                "report_title": "AI Sustainability ESG Report",
                "organization": "Allianz",
                "reporting_period_days": period_days,
                "report_start_date": cutoff_date.isoformat(),
                "report_end_date": datetime.utcnow().isoformat(),
                "generated_at": datetime.utcnow().isoformat(),
                "report_version": "1.0"
            },
            "executive_summary": executive_summary,
            "workload_summary": workload_summary,
            "energy_report": energy_report,
            "carbon_report": carbon_report,
            "esg_score_trend": esg_trend,
            "optimization_actions": optimization_actions,
            "methodology": methodology,
            "compliance": compliance
        }
    
    @staticmethod
    def _generate_executive_summary(db: Session, cutoff_date: datetime) -> Dict:
        """Generate executive summary section"""
        # Get latest ESG score
        latest_score = db.query(ESGScore).order_by(
            ESGScore.score_date.desc()
        ).first()
        
        # Get totals
        total_workloads = db.query(AIWorkload).filter(
            AIWorkload.created_at >= cutoff_date
        ).count()
        
        total_energy = sum(
            e.energy_kwh for e in db.query(EnergyUsage).filter(
                EnergyUsage.last_updated >= cutoff_date
            ).all()
        )
        
        total_carbon = sum(
            c.carbon_kg for c in db.query(CarbonEmission).filter(
                CarbonEmission.last_updated >= cutoff_date
            ).all()
        )
        
        # Get approved actions
        approved_actions = db.query(ActionRequest).filter(
            ActionRequest.status.in_([ApprovalStatus.APPROVED, ApprovalStatus.EXECUTED]),
            ActionRequest.requested_at >= cutoff_date
        ).count()
        
        return {
            "esg_score": round(latest_score.score, 2) if latest_score else None,
            "esg_rating": "GOOD" if latest_score and latest_score.score >= 60 else "FAIR",
            "total_ai_workloads": total_workloads,
            "total_energy_consumption_kwh": round(total_energy, 4),
            "total_carbon_emissions_kg": round(total_carbon, 4),
            "sustainability_actions_approved": approved_actions,
            "key_achievements": [
                f"Monitored {total_workloads} AI workloads for environmental impact",
                f"Tracked {round(total_carbon, 2)} kg CO₂ emissions from AI operations",
                f"Approved {approved_actions} sustainability optimization actions"
            ]
        }
    
    @staticmethod
    def _generate_workload_summary(db: Session, cutoff_date: datetime) -> Dict:
        """Generate workload summary section"""
        workloads = db.query(AIWorkload).filter(
            AIWorkload.created_at >= cutoff_date
        ).all()
        
        # By model
        by_model = {}
        for w in workloads:
            if w.model_name not in by_model:
                by_model[w.model_name] = 0
            by_model[w.model_name] += 1
        
        # By region
        by_region = {}
        for w in workloads:
            if w.cloud_region not in by_region:
                by_region[w.cloud_region] = 0
            by_region[w.cloud_region] += 1
        
        # By job type
        by_job_type = {}
        for w in workloads:
            job_type = w.job_type.value if w.job_type else "UNKNOWN"
            if job_type not in by_job_type:
                by_job_type[job_type] = 0
            by_job_type[job_type] += 1
        
        return {
            "total_workloads": len(workloads),
            "by_model": by_model,
            "by_region": by_region,
            "by_job_type": by_job_type,
            "total_gpu_hours": round(sum((w.runtime_seconds / 3600.0) * w.gpu_count for w in workloads), 2)
        }
    
    @staticmethod
    def _generate_energy_report(db: Session, cutoff_date: datetime) -> Dict:
        """Generate energy consumption report"""
        energy_records = db.query(EnergyUsage).filter(
            EnergyUsage.last_updated >= cutoff_date
        ).all()
        
        total_energy = sum(e.energy_kwh for e in energy_records)
        
        # By workload
        by_workload = []
        for e in energy_records:
            workload = db.query(AIWorkload).filter(AIWorkload.id == e.workload_id).first()
            if workload:
                by_workload.append({
                    "workload_id": e.workload_id,
                    "model_name": workload.model_name,
                    "energy_kwh": round(e.energy_kwh, 4)
                })
        
        # Sort by energy
        by_workload.sort(key=lambda x: x["energy_kwh"], reverse=True)
        
        return {
            "total_energy_kwh": round(total_energy, 4),
            "average_energy_per_workload": round(total_energy / len(energy_records), 4) if energy_records else 0,
            "top_consumers": by_workload[:5],
            "calculation_method": "Runtime × GPU Count × Power Coefficient",
            "power_coefficients": {
                "high_compute": "0.5 kW per GPU",
                "medium_compute": "0.3 kW per GPU",
                "low_compute": "0.15 kW per GPU"
            }
        }
    
    @staticmethod
    def _generate_carbon_report(db: Session, cutoff_date: datetime) -> Dict:
        """Generate carbon emissions report"""
        carbon_records = db.query(CarbonEmission).filter(
            CarbonEmission.last_updated >= cutoff_date
        ).all()
        
        total_carbon = sum(c.carbon_kg for c in carbon_records)
        
        # By region
        by_region = {}
        for c in carbon_records:
            workload = db.query(AIWorkload).filter(AIWorkload.id == c.workload_id).first()
            if workload:
                region = workload.cloud_region
                if region not in by_region:
                    by_region[region] = 0
                by_region[region] += c.carbon_kg
        
        # Round values
        for region in by_region:
            by_region[region] = round(by_region[region], 4)
        
        return {
            "total_carbon_emissions_kg": round(total_carbon, 4),
            "by_region": by_region,
            "carbon_intensity_factors": carbon_config.get_all_intensities(),
            "calculation_method": "Energy (kWh) × Regional Carbon Intensity (kg CO₂/kWh)",
            "ghg_protocol_scope": "Scope 2 (Indirect emissions from purchased electricity)"
        }
    
    @staticmethod
    def _generate_esg_trend(db: Session, cutoff_date: datetime) -> Dict:
        """Generate ESG score trend"""
        scores = db.query(ESGScore).filter(
            ESGScore.score_date >= cutoff_date
        ).order_by(ESGScore.score_date.asc()).all()
        
        if not scores:
            return {
                "trend": "No historical data",
                "scores": []
            }
        
        trend = "stable"
        if len(scores) >= 2:
            change = scores[-1].score - scores[0].score
            if change > 5:
                trend = "improving"
            elif change < -5:
                trend = "declining"
        
        return {
            "trend": trend,
            "latest_score": round(scores[-1].score, 2) if scores else None,
            "score_change": round(scores[-1].score - scores[0].score, 2) if len(scores) >= 2 else 0,
            "scores": [
                {
                    "date": s.score_date.isoformat(),
                    "score": round(s.score, 2)
                } for s in scores
            ]
        }
    
    @staticmethod
    def _generate_optimization_report(db: Session, cutoff_date: datetime) -> Dict:
        """Generate optimization actions report"""
        actions = db.query(ActionRequest).filter(
            ActionRequest.requested_at >= cutoff_date
        ).all()
        
        by_status = {}
        for a in actions:
            status = a.status.value if a.status else "UNKNOWN"
            if status not in by_status:
                by_status[status] = 0
            by_status[status] += 1
        
        # Calculate realized savings from executed actions
        executed_actions = [a for a in actions if a.status == ApprovalStatus.EXECUTED]
        realized_carbon_savings = sum(a.estimated_carbon_saving_kg for a in executed_actions)
        realized_energy_savings = sum(a.estimated_energy_saving_kwh for a in executed_actions)
        
        return {
            "total_actions_requested": len(actions),
            "by_status": by_status,
            "realized_carbon_savings_kg": round(realized_carbon_savings, 4),
            "realized_energy_savings_kwh": round(realized_energy_savings, 4),
            "approval_rate": round(by_status.get("APPROVED", 0) / len(actions) * 100, 2) if actions else 0
        }
    
    @staticmethod
    def _generate_methodology_section() -> Dict:
        """Generate methodology and assumptions section"""
        return {
            "energy_estimation": {
                "formula": "Energy (kWh) = Runtime (hours) × GPU Count × Power Coefficient (kW)",
                "power_coefficients": {
                    "high_compute": 0.5,
                    "medium_compute": 0.3,
                    "low_compute": 0.15
                },
                "assumptions": [
                    "Power coefficients based on industry averages for cloud GPU instances",
                    "Does not include cooling or infrastructure overhead",
                    "Actual values may vary based on specific hardware and utilization"
                ]
            },
            "carbon_calculation": {
                "formula": "CO₂ (kg) = Energy (kWh) × Carbon Intensity (kg CO₂/kWh)",
                "carbon_intensity_factors": carbon_config.get_all_intensities(),
                "data_source": "Regional electricity grid carbon intensity averages",
                "assumptions": [
                    "Carbon intensity factors represent annual averages",
                    "Does not account for time-of-day variations",
                    "Based on location-based method (Scope 2)"
                ]
            },
            "esg_scoring": {
                "methodology": "Weighted composite scoring model",
                "components": {
                    "carbon_efficiency": "40% weight",
                    "energy_efficiency": "30% weight",
                    "optimization_adoption": "20% weight",
                    "regional_sustainability": "10% weight"
                },
                "normalization": "Each component normalized to 0-100 scale before weighting"
            }
        }
    
    @staticmethod
    def _generate_compliance_section() -> Dict:
        """Generate compliance statements"""
        return {
            "standards_alignment": [
                "GHG Protocol Scope 2 guidance for indirect emissions",
                "ISO 14064 for greenhouse gas accounting",
                "CDP (Carbon Disclosure Project) reporting framework"
            ],
            "transparency_statement": "All sustainability metrics are based on estimated models using industry-standard methodologies. Actual environmental impact may vary based on specific infrastructure and operational factors.",
            "limitations": [
                "Energy estimates based on runtime and GPU count, not direct hardware telemetry",
                "Carbon intensity factors are regional averages, not real-time grid data",
                "Optimization savings are estimates and require validation through implementation",
                "ESG scores are composite indicators for internal governance"
            ],
            "audit_trail": "Complete audit trail maintained for all sustainability actions and approvals",
            "data_quality": "Data collected from operational AI workload monitoring systems",
            "reporting_boundary": "Covers AI/ML workloads within monitored infrastructure"
        }
    
    @staticmethod
    def export_to_csv_format(report: Dict) -> str:
        """
        Export report to CSV format
        
        Args:
            report: Report dictionary
            
        Returns:
            CSV formatted string
        """
        csv_lines = []
        
        # Header
        csv_lines.append("EcoGenAI ESG Report - CSV Export")
        csv_lines.append(f"Generated: {report['report_metadata']['generated_at']}")
        csv_lines.append(f"Period: {report['report_metadata']['reporting_period_days']} days")
        csv_lines.append("")
        
        # Executive Summary
        csv_lines.append("EXECUTIVE SUMMARY")
        csv_lines.append("Metric,Value")
        exec_sum = report['executive_summary']
        csv_lines.append(f"ESG Score,{exec_sum.get('esg_score', 'N/A')}")
        csv_lines.append(f"Total Workloads,{exec_sum['total_ai_workloads']}")
        csv_lines.append(f"Total Energy (kWh),{exec_sum['total_energy_consumption_kwh']}")
        csv_lines.append(f"Total Carbon (kg CO₂),{exec_sum['total_carbon_emissions_kg']}")
        csv_lines.append("")
        
        # Carbon by Region
        csv_lines.append("CARBON EMISSIONS BY REGION")
        csv_lines.append("Region,Carbon (kg CO₂)")
        for region, carbon in report['carbon_report']['by_region'].items():
            csv_lines.append(f"{region},{carbon}")
        csv_lines.append("")
        
        return "\n".join(csv_lines)
    
    @staticmethod
    def export_to_json_format(report: Dict) -> str:
        """
        Export report to JSON format
        
        Args:
            report: Report dictionary
            
        Returns:
            JSON formatted string
        """
        return json.dumps(report, indent=2)
