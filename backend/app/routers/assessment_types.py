from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.assessment_type import AssessmentTypeResponse
from app.schemas.question import QuestionResponse
from app.repositories.question_repository import QuestionRepository
from app.utils.exceptions import ItemNotFoundException

router = APIRouter(prefix="/assessment-types", tags=["Assessment Types"])

@router.get("", response_model=List[AssessmentTypeResponse])
def get_assessment_types(db: Session = Depends(get_db)):
    """
    Get all active assessment types.
    """
    repo = QuestionRepository(db)
    return repo.get_assessment_types(active_only=True)

@router.get("/{type_id}", response_model=AssessmentTypeResponse)
def get_assessment_type_by_id(type_id: str, db: Session = Depends(get_db)):
    """
    Get details of a single assessment type.
    """
    repo = QuestionRepository(db)
    asm_type = repo.get_assessment_type_by_id(type_id)
    if not asm_type:
        raise ItemNotFoundException(detail="Assessment type not found")
    return asm_type

@router.get("/{type_id}/questions", response_model=List[QuestionResponse])
def get_questions_for_assessment_type(type_id: str, db: Session = Depends(get_db)):
    """
    Get active questions and options for an assessment type.
    """
    repo = QuestionRepository(db)
    asm_type = repo.get_assessment_type_by_id(type_id)
    if not asm_type:
        raise ItemNotFoundException(detail="Assessment type not found")

    questions = repo.get_questions_by_type_id(type_id, active_only=True)
    return questions
