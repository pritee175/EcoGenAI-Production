"""
Governance & Approval Workflow Engine
Enterprise-grade approval system for sustainability actions
"""
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from datetime import datetime
from ..models.governance import ActionRequest, ActionType, ApprovalStatus
from ..models.workload import AIWorkload

class GovernanceEngine:
    """
    Governance Engine for Sustainability Actions
    
    Implements enterprise-grade approval workflow:
    1. System generates action recommendations
    2. Manager reviews and approves/rejects
    3. Approved actions are executed
    4. Full audit trail maintained
    
    No automated execution without approval - ensures enterprise compliance.
    """
    
    @staticmethod
    def create_action_request(
        db: Session,
        action_type: ActionType,
        title: str,
        description: str,
        workload_id: Optional[int],
        estimated_carbon_saving_kg: float,
        estimated_energy_saving_kwh: float,
        estimated_cost_impact_usd: float,
        technical_details: Dict,
        requested_by: str = "System"
    ) -> ActionRequest:
        """
        Create new action request for approval
        
        Args:
            db: Database session
            action_type: Type of action
            title: Short title
            description: Detailed description
            workload_id: Related workload ID (optional)
            estimated_carbon_saving_kg: Estimated carbon savings
            estimated_energy_saving_kwh: Estimated energy savings
            estimated_cost_impact_usd: Estimated cost impact (negative = savings)
            technical_details: Technical implementation details
            requested_by: Who requested the action
            
        Returns:
            Created ActionRequest
        """
        action_request = ActionRequest(
            action_type=action_type,
            workload_id=workload_id,
            title=title,
            description=description,
            estimated_carbon_saving_kg=estimated_carbon_saving_kg,
            estimated_energy_saving_kwh=estimated_energy_saving_kwh,
            estimated_cost_impact_usd=estimated_cost_impact_usd,
            technical_details=technical_details,
            requested_by=requested_by,
            status=ApprovalStatus.PENDING
        )
        
        db.add(action_request)
        db.commit()
        db.refresh(action_request)
        
        return action_request
    
    @staticmethod
    def get_pending_requests(db: Session) -> List[ActionRequest]:
        """Get all pending action requests"""
        return db.query(ActionRequest).filter(
            ActionRequest.status == ApprovalStatus.PENDING
        ).order_by(ActionRequest.requested_at.desc()).all()
    
    @staticmethod
    def get_all_requests(db: Session, limit: int = 100) -> List[ActionRequest]:
        """Get all action requests with limit"""
        return db.query(ActionRequest).order_by(
            ActionRequest.requested_at.desc()
        ).limit(limit).all()
    
    @staticmethod
    def get_request_by_id(db: Session, request_id: int) -> Optional[ActionRequest]:
        """Get specific action request by ID"""
        return db.query(ActionRequest).filter(
            ActionRequest.id == request_id
        ).first()
    
    @staticmethod
    def approve_request(
        db: Session,
        request_id: int,
        reviewed_by: str,
        review_notes: Optional[str] = None
    ) -> ActionRequest:
        """
        Approve action request
        
        Args:
            db: Database session
            request_id: Request ID to approve
            reviewed_by: Manager who approved
            review_notes: Optional approval notes
            
        Returns:
            Updated ActionRequest
        """
        request = GovernanceEngine.get_request_by_id(db, request_id)
        
        if not request:
            raise ValueError(f"Request {request_id} not found")
        
        if request.status != ApprovalStatus.PENDING:
            raise ValueError(f"Request {request_id} is not pending (status: {request.status})")
        
        request.status = ApprovalStatus.APPROVED
        request.reviewed_by = reviewed_by
        request.reviewed_at = datetime.utcnow()
        request.review_notes = review_notes
        
        db.commit()
        db.refresh(request)
        
        return request
    
    @staticmethod
    def reject_request(
        db: Session,
        request_id: int,
        reviewed_by: str,
        review_notes: str
    ) -> ActionRequest:
        """
        Reject action request
        
        Args:
            db: Database session
            request_id: Request ID to reject
            reviewed_by: Manager who rejected
            review_notes: Rejection reason (required)
            
        Returns:
            Updated ActionRequest
        """
        request = GovernanceEngine.get_request_by_id(db, request_id)
        
        if not request:
            raise ValueError(f"Request {request_id} not found")
        
        if request.status != ApprovalStatus.PENDING:
            raise ValueError(f"Request {request_id} is not pending (status: {request.status})")
        
        request.status = ApprovalStatus.REJECTED
        request.reviewed_by = reviewed_by
        request.reviewed_at = datetime.utcnow()
        request.review_notes = review_notes
        
        db.commit()
        db.refresh(request)
        
        return request
    
    @staticmethod
    def execute_request(
        db: Session,
        request_id: int,
        execution_result: Dict
    ) -> ActionRequest:
        """
        Mark request as executed with results
        
        Args:
            db: Database session
            request_id: Request ID to execute
            execution_result: Execution outcome details
            
        Returns:
            Updated ActionRequest
        """
        request = GovernanceEngine.get_request_by_id(db, request_id)
        
        if not request:
            raise ValueError(f"Request {request_id} not found")
        
        if request.status != ApprovalStatus.APPROVED:
            raise ValueError(f"Request {request_id} is not approved (status: {request.status})")
        
        request.status = ApprovalStatus.EXECUTED
        request.executed_at = datetime.utcnow()
        request.execution_result = execution_result
        
        db.commit()
        db.refresh(request)
        
        return request
    
    @staticmethod
    def get_approval_statistics(db: Session) -> Dict:
        """
        Get approval workflow statistics
        
        Returns:
            Dictionary with approval metrics
        """
        total_requests = db.query(ActionRequest).count()
        pending_requests = db.query(ActionRequest).filter(
            ActionRequest.status == ApprovalStatus.PENDING
        ).count()
        approved_requests = db.query(ActionRequest).filter(
            ActionRequest.status == ApprovalStatus.APPROVED
        ).count()
        rejected_requests = db.query(ActionRequest).filter(
            ActionRequest.status == ApprovalStatus.REJECTED
        ).count()
        executed_requests = db.query(ActionRequest).filter(
            ActionRequest.status == ApprovalStatus.EXECUTED
        ).count()
        
        # Calculate total potential savings from approved/executed requests
        approved_or_executed = db.query(ActionRequest).filter(
            ActionRequest.status.in_([ApprovalStatus.APPROVED, ApprovalStatus.EXECUTED])
        ).all()
        
        total_carbon_savings = sum(r.estimated_carbon_saving_kg for r in approved_or_executed)
        total_energy_savings = sum(r.estimated_energy_saving_kwh for r in approved_or_executed)
        total_cost_impact = sum(r.estimated_cost_impact_usd for r in approved_or_executed)
        
        return {
            "total_requests": total_requests,
            "pending_requests": pending_requests,
            "approved_requests": approved_requests,
            "rejected_requests": rejected_requests,
            "executed_requests": executed_requests,
            "approval_rate": round((approved_requests / total_requests * 100) if total_requests > 0 else 0, 2),
            "execution_rate": round((executed_requests / approved_requests * 100) if approved_requests > 0 else 0, 2),
            "total_carbon_savings_kg": round(total_carbon_savings, 4),
            "total_energy_savings_kwh": round(total_energy_savings, 4),
            "total_cost_impact_usd": round(total_cost_impact, 2)
        }
    
    @staticmethod
    def get_audit_trail(db: Session, workload_id: Optional[int] = None) -> List[Dict]:
        """
        Get audit trail for compliance
        
        Args:
            workload_id: Optional filter by workload
            
        Returns:
            List of audit trail entries
        """
        query = db.query(ActionRequest)
        
        if workload_id:
            query = query.filter(ActionRequest.workload_id == workload_id)
        
        requests = query.order_by(ActionRequest.requested_at.desc()).all()
        
        return [request.to_dict() for request in requests]
