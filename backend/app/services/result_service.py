from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.assessment_repository import AssessmentRepository
from app.repositories.question_repository import QuestionRepository
from app.repositories.result_repository import ResultRepository
from app.services.validation_service import ValidationService
from app.services.ai_service import get_ai_service
from app.schemas.result import AssessmentResultResponse
from app.schemas.admin import ValidationResponse
from app.utils.exceptions import ItemNotFoundException, AccessForbiddenException, ValidationFailedException

class ResultService:
    def __init__(self, db: Session):
        self.db = db
        self.asm_repo = AssessmentRepository(db)
        self.q_repo = QuestionRepository(db)
        self.res_repo = ResultRepository(db)
        self.val_service = ValidationService(db)

    async def analyze_assessment(self, assessment_id: str, current_user: User) -> dict:
        asm = self.asm_repo.get_by_id(assessment_id)
        if not asm:
            raise ItemNotFoundException(detail="Assessment not found")

        if asm.user_id != current_user.id and current_user.role != "admin":
            raise AccessForbiddenException(detail="Not authorized to analyze this assessment")

        # Duplicate analysis protection
        if asm.status == "analyzing":
            raise ValidationFailedException(detail="Assessment is currently being analyzed. Please wait.")

        # 1. Perform Validation Engine check
        val_result: ValidationResponse = self.val_service.validate_assessment(asm)
        if not val_result.is_valid:
            self.asm_repo.update_status(asm, "incomplete")
            return {
                "is_valid": False,
                "status": "incomplete",
                "validation": val_result
            }

        # Update status to 'ready' then 'analyzing'
        self.asm_repo.update_status(asm, "analyzing")

        try:
            # 2. Build structured input payload for AI Engine
            questions = self.q_repo.get_questions_by_type_id(asm.assessment_type_id)
            q_map = {q.id: q.question_text for q in questions}
            
            structured_answers = []
            for ans in asm.answers:
                q_text = q_map.get(ans.question_id, "Question")
                structured_answers.append({
                    "question": q_text,
                    "answer": ans.answer_text
                })

            asm_type = self.q_repo.get_assessment_type_by_id(asm.assessment_type_id)
            type_name = asm_type.name if asm_type else "General Assessment"

            payload = {
                "assessment_type": type_name,
                "answers": structured_answers
            }

            # 3. Call AI Service Abstraction
            ai_service = get_ai_service()
            ai_output = await ai_service.analyze_assessment(payload)

            # 4. Save result inside database transaction
            recs_dict = [
                {"title": r.title, "description": r.description, "priority": r.priority}
                for r in ai_output.recommendations
            ]

            saved_res = self.res_repo.save_full_result(
                assessment_id=asm.id,
                result_title=ai_output.result_title,
                result_summary=ai_output.result_summary,
                confidence_score=ai_output.confidence_score,
                explanation=ai_output.explanation,
                key_findings=ai_output.key_findings,
                recommendations=recs_dict,
                next_steps=ai_output.next_steps
            )

            # 5. Transition status to completed
            asm.status = "completed"
            asm.completed_at = datetime.now(timezone.utc)
            self.db.commit()

            return {
                "is_valid": True,
                "status": "completed",
                "result": AssessmentResultResponse.model_validate(saved_res)
            }

        except Exception as e:
            self.asm_repo.update_status(asm, "failed")
            raise ValidationFailedException(detail=f"AI Analysis failed: {str(e)}")

    def get_result_by_assessment(self, assessment_id: str, current_user: User) -> AssessmentResultResponse:
        asm = self.asm_repo.get_by_id(assessment_id)
        if not asm:
            raise ItemNotFoundException(detail="Assessment not found")

        if asm.user_id != current_user.id and current_user.role != "admin":
            raise AccessForbiddenException(detail="Not authorized to access this result")

        res = self.res_repo.get_by_assessment_id(assessment_id)
        if not res:
            raise ItemNotFoundException(detail="Result not available for this assessment")

        return AssessmentResultResponse.model_validate(res)
