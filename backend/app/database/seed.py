import logging
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.assessment_type import AssessmentType
from app.models.question import Question
from app.models.question_option import QuestionOption
from app.models.requirement import Requirement

logger = logging.getLogger("aid_backend.seed")

def seed_initial_data(db: Session) -> None:
    """
    Seeds initial system data if database is unpopulated.
    """
    # 1. Check if admin user exists
    admin_user = db.query(User).filter(User.email == "admin@aidiagnostic.ng").first()
    if not admin_user:
        logger.info("Seeding default admin user...")
        admin = User(
            id="usr-admin-001",
            name="System Administrator",
            email="admin@aidiagnostic.ng",
            password_hash=get_password_hash("password123"),
            role="admin",
            is_active=True
        )
        db.add(admin)

    # 2. Check if default user exists
    normal_user = db.query(User).filter(User.email == "user@example.com").first()
    if not normal_user:
        logger.info("Seeding default regular user...")
        user = User(
            id="usr-demo-001",
            name="Alex Johnson",
            email="user@example.com",
            password_hash=get_password_hash("password123"),
            role="user",
            is_active=True
        )
        db.add(user)

    db.commit()

    # 3. Seed Assessment Types & Questions
    if db.query(AssessmentType).count() == 0:
        logger.info("Seeding initial Assessment Types and Question Banks...")
        
        # --- Category 1: Healthcare Diagnostic Support ---
        cat_academic = AssessmentType(
            id="cat-academic",
            name="Healthcare Diagnostic Support",
            description="Comprehensive clinical assessment covering demographics, symptoms, severity, medical history, and vitals.",
            estimated_minutes=10,
            is_active=True
        )
        db.add(cat_academic)
        db.flush()

        q1 = Question(
            id="q-age",
            assessment_type_id="cat-academic",
            question_text="1. Patient Age (in Years)",
            question_type="number",
            is_required=True,
            order_number=1,
            help_text="Age is used to determine appropriate clinical dosage and age-related risk factors."
        )
        db.add(q1)

        q2 = Question(
            id="q-sex",
            assessment_type_id="cat-academic",
            question_text="2. Patient Biological Sex",
            question_type="dropdown",
            is_required=True,
            order_number=2,
            help_text="Biological sex is used to check contraindications and pregnancy/hormonal precautions."
        )
        db.add(q2)
        db.flush()
        for idx, (lbl, val) in enumerate([("Female", "Female"), ("Male", "Male")], start=1):
            db.add(QuestionOption(question_id="q-sex", option_text=lbl, value=val, order_number=idx))

        q3 = Question(
            id="q-symptoms",
            assessment_type_id="cat-academic",
            question_text="3. Describe your symptoms in detail",
            question_type="textarea",
            is_required=True,
            order_number=3,
            help_text="Provide a complete description of how you are feeling."
        )
        db.add(q3)

        q4 = Question(
            id="q-duration",
            assessment_type_id="cat-academic",
            question_text="4. Indicate how long you have had those symptoms",
            question_type="dropdown",
            is_required=True,
            order_number=4,
            help_text="Select the duration since symptoms first started."
        )
        db.add(q4)
        db.flush()
        for idx, (lbl, val) in enumerate([
            ("Less than 24 hours (Sudden Onset)", "Less than 24 hours"),
            ("1 to 3 days", "1 to 3 days"),
            ("4 to 7 days", "4 to 7 days"),
            ("1 to 2 weeks", "1 to 2 weeks"),
            ("3 to 4 weeks", "3 to 4 weeks"),
            ("More than 1 month (Chronic)", "More than 1 month")
        ], start=1):
            db.add(QuestionOption(question_id="q-duration", option_text=lbl, value=val, order_number=idx))

        q5 = Question(
            id="q-severity",
            assessment_type_id="cat-academic",
            question_text="5. Rate the severity of the symptoms (1 to 10)",
            question_type="rating",
            is_required=True,
            order_number=5,
            help_text="1-3 = Mild, 4-6 = Moderate, 7-8 = Severe, 9-10 = Critical / Emergency"
        )
        db.add(q5)

        q6 = Question(
            id="q-medical-history",
            assessment_type_id="cat-academic",
            question_text="6. Provide your medical history",
            question_type="checkbox",
            is_required=False,
            order_number=6,
            help_text="Check all relevant pre-existing conditions, allergies, or treatments."
        )
        db.add(q6)
        db.flush()
        for idx, (lbl, val) in enumerate([
            ("Hypertension / High Blood Pressure", "Hypertension"),
            ("Diabetes Mellitus", "Diabetes"),
            ("Sickle Cell Genotype (SS / SC)", "Sickle Cell"),
            ("Asthma / Respiratory Conditions", "Asthma"),
            ("Peptic Ulcer Disease", "Peptic Ulcer"),
            ("Recent Malaria / Typhoid Infection", "Malaria/Typhoid"),
            ("Known Drug / Food Allergies", "Allergies"),
            ("Currently on Prescription Medications", "Prescription Meds")
        ], start=1):
            db.add(QuestionOption(question_id="q-medical-history", option_text=lbl, value=val, order_number=idx))

        q7 = Question(
            id="q-vitals-additional",
            assessment_type_id="cat-academic",
            question_text="7. Provide additional information such as blood pressure and temperature",
            question_type="textarea",
            is_required=True,
            order_number=7,
            help_text="Include measured temperature, blood pressure, or physical context."
        )
        db.add(q7)

        # --- Category 2: Career ---
        cat_career = AssessmentType(
            id="cat-career",
            name="Career Development & Skill Transition",
            description="Assess professional trajectory, skill gaps, and strategic career milestone planning.",
            estimated_minutes=12,
            is_active=True
        )
        db.add(cat_career)
        db.flush()

        q1_car = Question(
            id="q-car-1",
            assessment_type_id="cat-career",
            question_text="What is your current job title or primary field?",
            question_type="text",
            is_required=True,
            order_number=1
        )
        db.add(q1_car)

        q2_car = Question(
            id="q-car-2",
            assessment_type_id="cat-career",
            question_text="What is your target role or career goal for the next 12-24 months?",
            question_type="text",
            is_required=True,
            order_number=2
        )
        db.add(q2_car)

        q3_car = Question(
            id="q-car-3",
            assessment_type_id="cat-career",
            question_text="What do you identify as your primary career growth obstacle?",
            question_type="dropdown",
            is_required=True,
            order_number=3
        )
        db.add(q3_car)
        db.flush()
        for idx, (lbl, val) in enumerate([
            ("Technical Skill Gap", "Skill gap"),
            ("Lack of Industry Portfolio", "Portfolio gap"),
            ("Limited Professional Network", "Networking gap"),
            ("Interview & Self-Presentation Confidence", "Interview prep")
        ], start=1):
            db.add(QuestionOption(question_id="q-car-3", option_text=lbl, value=val, order_number=idx))

        q4_car = Question(
            id="q-car-4",
            assessment_type_id="cat-career",
            question_text="Detail key projects or certifications you are planning:",
            question_type="textarea",
            is_required=True,
            order_number=4
        )
        db.add(q4_car)

        # --- Category 3: Tech ---
        cat_tech = AssessmentType(
            id="cat-tech",
            name="Technical Architecture & Infrastructure",
            description="Diagnose system performance, database query bottlenecks, and operational readiness.",
            estimated_minutes=15,
            is_active=True
        )
        db.add(cat_tech)
        db.flush()

        q1_tech = Question(
            id="q-tech-1",
            assessment_type_id="cat-tech",
            question_text="Which architecture component is currently presenting issues?",
            question_type="dropdown",
            is_required=True,
            order_number=1
        )
        db.add(q1_tech)
        db.flush()
        for idx, (lbl, val) in enumerate([
            ("Database & Connection Pooling", "Database"),
            ("API Gateway & Async Services", "Backend API"),
            ("Frontend State & Rendering", "Frontend UI"),
            ("Cloud Infrastructure & CI/CD", "DevOps")
        ], start=1):
            db.add(QuestionOption(question_id="q-tech-1", option_text=lbl, value=val, order_number=idx))

        q2_tech = Question(
            id="q-tech-2",
            assessment_type_id="cat-tech",
            question_text="Describe the observed error rate or performance symptom:",
            question_type="textarea",
            is_required=True,
            order_number=2
        )
        db.add(q2_tech)

        # --- Category 4: General ---
        cat_general = AssessmentType(
            id="cat-general",
            name="General Problem Solving & Strategy",
            description="Structured decision evaluation framework for complex dilemmas and resource allocations.",
            estimated_minutes=8,
            is_active=True
        )
        db.add(cat_general)
        db.flush()

        q1_gen = Question(
            id="q-gen-1",
            assessment_type_id="cat-general",
            question_text="What is the central problem or strategic decision facing you?",
            question_type="text",
            is_required=True,
            order_number=1
        )
        db.add(q1_gen)

        q2_gen = Question(
            id="q-gen-2",
            assessment_type_id="cat-general",
            question_text="How long has this dilemma been pending?",
            question_type="dropdown",
            is_required=True,
            order_number=2
        )
        db.add(q2_gen)
        db.flush()
        for idx, (lbl, val) in enumerate([
            ("Less than a week", "days"),
            ("1 to 4 weeks", "weeks"),
            ("Multiple months", "months")
        ], start=1):
            db.add(QuestionOption(question_id="q-gen-2", option_text=lbl, value=val, order_number=idx))

        q3_gen = Question(
            id="q-gen-3",
            assessment_type_id="cat-general",
            question_text="Elaborate on options considered so far:",
            question_type="textarea",
            is_required=True,
            order_number=3
        )
        db.add(q3_gen)

        db.commit()
        logger.info("Database seeding completed successfully.")
