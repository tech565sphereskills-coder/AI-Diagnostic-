from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.assessment import Assessment
from app.models.question import Question
from app.models.requirement import Requirement
from app.schemas.admin import ValidationResponse, MissingInformationItem
from app.schemas.assessment import AssessmentProgress
from app.repositories.question_repository import QuestionRepository

class ValidationService:
    def __init__(self, db: Session):
        self.question_repo = QuestionRepository(db)

    def evaluate_condition(self, operator: str, user_answer_val: str, required_val: str) -> bool:
        if not user_answer_val or not required_val:
            return False

        u_val = user_answer_val.strip().lower()
        r_val = required_val.strip().lower()

        if operator == "equals":
            return u_val == r_val
        elif operator == "not_equals":
            return u_val != r_val
        elif operator == "contains":
            return r_val in u_val

        # Numeric comparisons
        try:
            num_u = float(u_val)
            num_r = float(r_val)

            if operator == "greater_than":
                return num_u > num_r
            elif operator == "less_than":
                return num_u < num_r
            elif operator == "greater_than_or_equal":
                return num_u >= num_r
            elif operator == "less_than_or_equal":
                return num_u <= num_r
        except ValueError:
            pass

        return False

    def validate_answer_type(self, question: Question, answer_text: str) -> Tuple[bool, str]:
        if not answer_text or not answer_text.strip():
            return False, "Answer cannot be empty."

        val = answer_text.strip()
        q_type = question.question_type

        if q_type == "number":
            try:
                float(val)
            except ValueError:
                return False, "Answer must be a valid number."

        elif q_type == "rating":
            try:
                r_num = float(val)
                if r_num < 1 or r_num > 10:
                    return False, "Rating must be between 1 and 10."
            except ValueError:
                return False, "Rating must be a numeric value."

        elif q_type in ("single_choice", "dropdown"):
            valid_opts = [opt.value for opt in question.options] + [opt.option_text for opt in question.options]
            if valid_opts and val not in valid_opts:
                return False, f"Selected option '{val}' is invalid."

        elif q_type == "multiple_choice":
            valid_opts = [opt.value for opt in question.options] + [opt.option_text for opt in question.options]
            selected = [s.strip() for s in val.split(",")]
            if valid_opts:
                for s in selected:
                    if s not in valid_opts:
                        return False, f"Selected option '{s}' is invalid."

        elif q_type == "boolean":
            if val.lower() not in ("true", "false", "yes", "no", "1", "0"):
                return False, "Answer must be yes/no or true/false."

        return True, ""

    def validate_assessment(self, assessment: Assessment) -> ValidationResponse:
        type_id = assessment.assessment_type_id
        all_questions = self.question_repo.get_questions_by_type_id(type_id)
        all_requirements = self.question_repo.get_requirements_by_type_id(type_id)

        # Map answered question_ids -> answer_text
        answers_map: Dict[str, str] = {ans.question_id: ans.answer_text for ans in assessment.answers}

        # Build list of active required question IDs
        required_q_ids = set()
        
        # 1. Base required questions
        for q in all_questions:
            if q.is_required:
                required_q_ids.add(q.id)

        # 2. Add requirements table requirements
        for req in all_requirements:
            if req.is_required and not req.conditional_question_id:
                required_q_ids.add(req.question_id)

        # 3. Evaluate conditional requirements (IF / THEN rules)
        for req in all_requirements:
            if req.conditional_question_id and req.conditional_operator and req.conditional_value:
                parent_ans = answers_map.get(req.conditional_question_id)
                if parent_ans:
                    is_condition_met = self.evaluate_condition(
                        operator=req.conditional_operator,
                        user_answer_val=parent_ans,
                        required_val=req.conditional_value
                    )
                    if is_condition_met:
                        required_q_ids.add(req.question_id)

        missing_info: List[MissingInformationItem] = []

        # Check answers against required questions
        for q in all_questions:
            if q.id in required_q_ids:
                ans_text = answers_map.get(q.id)
                if not ans_text or not ans_text.strip():
                    missing_info.append(MissingInformationItem(
                        question_id=q.id,
                        question=q.question_text,
                        reason="This information is required before analysis."
                    ))
                else:
                    is_valid, err_msg = self.validate_answer_type(q, ans_text)
                    if not is_valid:
                        missing_info.append(MissingInformationItem(
                            question_id=q.id,
                            question=q.question_text,
                            reason=err_msg
                        ))

        if missing_info:
            return ValidationResponse(
                status="incomplete",
                is_valid=False,
                missing_information=missing_info
            )

        return ValidationResponse(
            status="ready",
            is_valid=True,
            missing_information=[]
        )

    def calculate_progress(self, assessment: Assessment) -> AssessmentProgress:
        all_questions = self.question_repo.get_questions_by_type_id(assessment.assessment_type_id)
        answers_map = {ans.question_id: ans.answer_text for ans in assessment.answers}

        total_questions = len(all_questions)
        answered_questions = len([q for q in all_questions if answers_map.get(q.id)])
        
        required_q_ids = set(q.id for q in all_questions if q.is_required)
        required_questions = len(required_q_ids)
        answered_required = len([q_id for q_id in required_q_ids if answers_map.get(q_id)])

        percentage = round((answered_questions / total_questions * 100.0), 1) if total_questions > 0 else 0.0

        return AssessmentProgress(
            total_questions=total_questions,
            answered_questions=answered_questions,
            required_questions=required_questions,
            answered_required_questions=answered_required,
            percentage=percentage
        )
