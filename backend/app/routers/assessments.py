from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.assessment import AssessmentCreate, AssessmentResponse
from app.schemas.answer import AnswersBatchCreate, AnswerCreate, AnswerResponse
from app.schemas.result import AssessmentResultResponse
from app.schemas.admin import ValidationResponse
from app.services.assessment_service import AssessmentService
from app.services.result_service import ResultService
from app.services.validation_service import ValidationService

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    payload: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new assessment for the authenticated user. Initial status: draft.
    """
    service = AssessmentService(db)
    asm = service.create_assessment(user_id=current_user.id, assessment_type_id=payload.assessment_type_id)
    return service.get_assessment(asm.id, current_user)

@router.get("", response_model=List[AssessmentResponse])
def get_user_assessments(
    status: Optional[str] = None,
    assessment_type_id: Optional[str] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user assessments with optional filters.
    """
    service = AssessmentService(db)
    user_asms = service.asm_repo.get_user_assessments(
        user_id=current_user.id,
        status=status,
        assessment_type_id=assessment_type_id,
        skip=skip,
        limit=limit
    )
    return [service.get_assessment(a.id, current_user) for a in user_asms]

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_single_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get single assessment with questions, answers, and progress calculations.
    """
    service = AssessmentService(db)
    return service.get_assessment(assessment_id, current_user)

@router.post("/{assessment_id}/answers", response_model=List[AnswerResponse])
def submit_answers(
    assessment_id: str,
    batch: AnswersBatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit or update batch answers for an assessment.
    """
    service = AssessmentService(db)
    answers_data = [a.model_dump() for a in batch.answers]
    return service.save_answers(assessment_id, answers_data, current_user)

@router.put("/{assessment_id}/answers/{question_id}", response_model=List[AnswerResponse])
def update_single_answer(
    assessment_id: str,
    question_id: str,
    answer_in: AnswerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update or insert single question answer.
    """
    service = AssessmentService(db)
    answer_data = [{"question_id": question_id, "answer_text": answer_in.answer_text}]
    return service.save_answers(assessment_id, answer_data, current_user)

@router.post("/{assessment_id}/validate", response_model=ValidationResponse)
def validate_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Execute validation engine check to determine completeness and missing information.
    """
    asm_service = AssessmentService(db)
    asm_res = asm_service.get_assessment(assessment_id, current_user)
    
    val_service = ValidationService(db)
    asm_obj = asm_service.asm_repo.get_by_id(assessment_id)
    return val_service.validate_assessment(asm_obj)

@router.post("/{assessment_id}/analyze")
async def analyze_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Trigger AI engine analysis if validation passes.
    """
    service = ResultService(db)
    return await service.analyze_assessment(assessment_id, current_user)

@router.get("/{assessment_id}/result", response_model=AssessmentResultResponse)
def get_assessment_result(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve stored assessment result for assessment owner or admin.
    """
    service = ResultService(db)
    return service.get_result_by_assessment(assessment_id, current_user)
