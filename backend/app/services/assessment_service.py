from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.assessment import Assessment
from app.models.user import User
from app.repositories.assessment_repository import AssessmentRepository
from app.repositories.question_repository import QuestionRepository
from app.services.validation_service import ValidationService
from app.schemas.assessment import AssessmentResponse, AssessmentProgress
from app.schemas.question import QuestionResponse
from app.schemas.answer import AnswerResponse
from app.utils.exceptions import ItemNotFoundException, AccessForbiddenException, ValidationFailedException

class AssessmentService:
    def __init__(self, db: Session):
        self.db = db
        self.asm_repo = AssessmentRepository(db)
        self.q_repo = QuestionRepository(db)
        self.val_service = ValidationService(db)

    def create_assessment(self, user_id: str, assessment_type_id: str) -> Assessment:
        asm_type = self.q_repo.get_assessment_type_by_id(assessment_type_id)
        if not asm_type:
            raise ItemNotFoundException(detail="Assessment category not found")

        asm = Assessment(
            user_id=user_id,
            assessment_type_id=assessment_type_id,
            status="draft"
        )
        return self.asm_repo.create(asm)

    def get_assessment(self, assessment_id: str, current_user: User) -> AssessmentResponse:
        asm = self.asm_repo.get_by_id(assessment_id)
        if not asm:
            raise ItemNotFoundException(detail="Assessment not found")

        if asm.user_id != current_user.id and current_user.role != "admin":
            raise AccessForbiddenException(detail="Not authorized to access this assessment")

        questions = self.q_repo.get_questions_by_type_id(asm.assessment_type_id)
        progress = self.val_service.calculate_progress(asm)

        asm_res = AssessmentResponse.model_validate(asm)
        asm_res.questions = [QuestionResponse.model_validate(q) for q in questions]
        asm_res.answers = [AnswerResponse.model_validate(a) for a in asm.answers]
        asm_res.progress = progress
        return asm_res

    def save_answers(self, assessment_id: str, answers_data: List[dict], current_user: User) -> List[AnswerResponse]:
        asm = self.asm_repo.get_by_id(assessment_id)
        if not asm:
            raise ItemNotFoundException(detail="Assessment not found")

        if asm.user_id != current_user.id and current_user.role != "admin":
            raise AccessForbiddenException(detail="Not authorized to update this assessment")

        # Validate that questions belong to assessment type
        valid_q_ids = set(q.id for q in self.q_repo.get_questions_by_type_id(asm.assessment_type_id))
        for item in answers_data:
            if item["question_id"] not in valid_q_ids:
                raise ValidationFailedException(detail=f"Question {item['question_id']} does not belong to this assessment type")

        saved = self.asm_repo.save_answers(assessment_id, answers_data)

        # Update status from draft to in_progress if applicable
        if asm.status == "draft":
            self.asm_repo.update_status(asm, "in_progress")

        return [AnswerResponse.model_validate(a) for a in saved]
