from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.assessment_result import AssessmentResult
from app.models.key_finding import KeyFinding
from app.models.recommendation import Recommendation
from app.models.next_step import NextStep
from app.models.feedback import Feedback

class ResultRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_assessment_id(self, assessment_id: str) -> Optional[AssessmentResult]:
        return self.db.query(AssessmentResult).filter(AssessmentResult.assessment_id == assessment_id).first()

    def get_by_id(self, result_id: str) -> Optional[AssessmentResult]:
        return self.db.query(AssessmentResult).filter(AssessmentResult.id == result_id).first()

    def save_full_result(
        self,
        assessment_id: str,
        result_title: str,
        result_summary: str,
        confidence_score: float,
        explanation: str,
        key_findings: List[str],
        recommendations: List[dict],
        next_steps: List[str]
    ) -> AssessmentResult:
        # Enforce transaction safety
        try:
            # Check if result exists
            existing = self.get_by_assessment_id(assessment_id)
            if existing:
                self.db.delete(existing)
                self.db.flush()

            db_result = AssessmentResult(
                assessment_id=assessment_id,
                result_title=result_title,
                result_summary=result_summary,
                confidence_score=confidence_score,
                explanation=explanation
            )
            self.db.add(db_result)
            self.db.flush() # obtain db_result.id

            # Save key findings
            for f in key_findings:
                self.db.add(KeyFinding(result_id=db_result.id, finding=f))

            # Save recommendations
            for r in recommendations:
                self.db.add(Recommendation(
                    result_id=db_result.id,
                    title=r["title"],
                    description=r["description"],
                    priority=r.get("priority", "medium")
                ))

            # Save next steps
            for idx, ns in enumerate(next_steps, start=1):
                self.db.add(NextStep(
                    result_id=db_result.id,
                    step_number=idx,
                    description=ns
                ))

            self.db.commit()
            self.db.refresh(db_result)
            return db_result
        except Exception:
            self.db.rollback()
            raise

    def add_feedback(self, user_id: str, result_id: str, rating: int, comment: Optional[str] = None) -> Feedback:
        existing = self.db.query(Feedback).filter(
            Feedback.user_id == user_id,
            Feedback.result_id == result_id
        ).first()

        if existing:
            existing.rating = rating
            existing.comment = comment
            self.db.commit()
            self.db.refresh(existing)
            return existing

        fb = Feedback(user_id=user_id, result_id=result_id, rating=rating, comment=comment)
        self.db.add(fb)
        self.db.commit()
        self.db.refresh(fb)
        return fb
