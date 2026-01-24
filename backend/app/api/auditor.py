"""
REST API endpoints for Sustainability Auditor Bot
Step 8: Natural language Q&A for ESG transparency
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..services.sustainability_auditor import SustainabilityAuditor

router = APIRouter(prefix="/api/auditor", tags=["auditor"])

class QuestionRequest(BaseModel):
    """Request model for asking a question"""
    question: str

class QuestionResponse(BaseModel):
    """Response model for bot answer"""
    question: str
    answer: str
    supporting_data: dict
    question_type: str

@router.post("/ask", response_model=QuestionResponse)
def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    """
    Ask the sustainability auditor bot a question
    
    The bot can answer questions about:
    - Why emissions increased/decreased
    - Current carbon footprint
    - Which models/regions have highest emissions
    - Emission trends and patterns
    
    Example questions:
    - "Why did emissions increase this week?"
    - "How much carbon have we emitted today?"
    - "Which model has the highest emissions?"
    - "Which region has the highest carbon footprint?"
    
    Returns natural language explanation with supporting data.
    """
    response = SustainabilityAuditor.answer_question(db, request.question)
    return response

@router.get("/trends")
def get_emission_trends(days: int = 7, db: Session = Depends(get_db)):
    """
    Get emission trend analysis
    
    Analyzes carbon emission trends over the specified period.
    Returns trend direction, change percentage, and top contributors.
    
    Args:
        days: Number of days to analyze (default: 7)
    """
    return SustainabilityAuditor.analyze_emission_trends(db, days)

@router.get("/explain-increase")
def explain_emission_increase(days: int = 7, db: Session = Depends(get_db)):
    """
    Get explanation for emission increase
    
    Provides natural language explanation of why emissions increased
    (if they did) with supporting data.
    
    Args:
        days: Number of days to analyze (default: 7)
    """
    answer = SustainabilityAuditor.explain_emission_increase(db, days)
    analysis = SustainabilityAuditor.analyze_emission_trends(db, days)
    
    return {
        "explanation": answer,
        "supporting_data": analysis
    }

@router.get("/recommended-questions")
def get_recommended_questions():
    """
    Get list of recommended questions
    
    Returns example questions users can ask the auditor bot.
    """
    return {
        "questions": SustainabilityAuditor.get_recommended_questions(),
        "description": "Example questions you can ask the sustainability auditor bot"
    }

