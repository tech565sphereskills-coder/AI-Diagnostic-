from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class KeyFindingResponse(BaseModel):
    id: str
    finding: str
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    id: str
    title: str
    description: str
    priority: str # low, medium, high
    created_at: datetime

    class Config:
        from_attributes = True

class NextStepResponse(BaseModel):
    id: str
    step_number: int
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class AssessmentResultResponse(BaseModel):
    id: str
    assessment_id: str
    result_title: str
    result_summary: str
    confidence_score: float
    explanation: str
    created_at: datetime
    updated_at: datetime
    key_findings: List[KeyFindingResponse] = []
    recommendations: List[RecommendationResponse] = []
    next_steps: List[NextStepResponse] = []

    class Config:
        from_attributes = True

class RecommendationAIItem(BaseModel):
    title: str
    description: str
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")

class MedicationAIItem(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str
    instructions: str
    purpose: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    result_title: str
    result_summary: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    explanation: str
    key_findings: List[str]
    recommendations: List[RecommendationAIItem]
    prescribed_medications: List[MedicationAIItem] = []
    next_steps: List[str]
