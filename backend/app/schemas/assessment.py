from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.assessment_type import AssessmentTypeResponse
from app.schemas.question import QuestionResponse
from app.schemas.answer import AnswerResponse

class AssessmentCreate(BaseModel):
    assessment_type_id: str

class AssessmentProgress(BaseModel):
    total_questions: int
    answered_questions: int
    required_questions: int
    answered_required_questions: int
    percentage: float

class AssessmentResponse(BaseModel):
    id: str
    user_id: str
    assessment_type_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    assessment_type: Optional[AssessmentTypeResponse] = None
    questions: Optional[List[QuestionResponse]] = None
    answers: Optional[List[AnswerResponse]] = None
    progress: Optional[AssessmentProgress] = None

    class Config:
        from_attributes = True
