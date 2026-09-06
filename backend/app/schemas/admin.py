from typing import List, Dict, Any
from pydantic import BaseModel

class MissingInformationItem(BaseModel):
    question_id: str
    question: str
    reason: str

class ValidationResponse(BaseModel):
    status: str # 'incomplete' or 'ready'
    is_valid: bool
    missing_information: List[MissingInformationItem] = []

class AdminStatistics(BaseModel):
    total_users: int
    total_assessments: int
    completed_assessments: int
    in_progress_assessments: int
    failed_assessments: int
    average_feedback_rating: float
    assessments_by_category: List[Dict[str, Any]]
    assessments_over_time: List[Dict[str, Any]]
    feedback_distribution: List[Dict[str, Any]]
    successful_ai_analyses: int
