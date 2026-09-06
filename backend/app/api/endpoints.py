from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, Optional, List
from app.db.database import db
from app.core.validation import DataValidationModule
from app.ml.engine import DiagnosticEngine

router = APIRouter()

# 1. Authentication Endpoint
@router.post("/auth/login")
async def login(credentials: Dict[str, Any] = Body(...)):
    email = credentials.get("email", "")
    password = credentials.get("password", "")

    if email == "doctor@aidiagnostic.ng" and password == "password123":
        db.add_audit_log("Dr. Chinedu Okafor", "Doctor", "Authenticated Session", "CDSS Portal", "Success")
        return {
            "success": True,
            "token": "bearer-clinical-token-2026",
            "user": {
                "name": "Dr. Chinedu Okafor",
                "email": "doctor@aidiagnostic.ng",
                "role": "Medical Doctor / Clinician",
                "department": "Internal Medicine & Diagnostics"
            }
        }
    else:
        db.add_audit_log(email, "Unknown", "Failed Login Attempt", "CDSS Portal", "Failed")
        raise HTTPException(status_code=401, detail="Invalid institutional credentials.")

# 2. Patient Management Endpoints
@router.get("/patients")
async def get_patients(search: Optional[str] = None, risk: Optional[str] = None):
    patients = db.patients
    if search:
        s = search.lower()
        patients = [p for p in patients if s in p["name"].lower() or s in p["id"].lower() or s in p["phone"]]
    if risk and risk != "all":
        patients = [p for p in patients if p["riskLevel"].lower() == risk.lower()]
    return {"success": True, "count": len(patients), "data": patients}

@router.post("/patients")
async def create_patient(patient_data: Dict[str, Any] = Body(...)):
    if "id" not in patient_data or not patient_data["id"]:
        patient_data["id"] = f"PT-2026-00{len(db.patients) + 1}"
    
    db.patients.insert(0, patient_data)
    db.add_audit_log(
        "Dr. Chinedu Okafor", "Doctor", "Registered New Patient",
        f"{patient_data['id']} ({patient_data.get('name', 'Patient')})", "Success"
    )
    return {"success": True, "data": patient_data}

# 3. Flowchart Step 3: Data Validation Pipeline
@router.post("/diagnostic/validate")
async def validate_data(payload: Dict[str, Any] = Body(...)):
    is_valid, errors, checks = DataValidationModule.validate_clinical_data(payload)
    return {
        "isValid": is_valid,
        "errors": errors,
        "checks": checks
    }

# 4. Flowchart Step 4 & 5: AI Preprocessing & Diagnostic Inference Engine
@router.post("/diagnostic/assess")
async def run_assessment(payload: Dict[str, Any] = Body(...)):
    # Validate first
    is_valid, errors, checks = DataValidationModule.validate_clinical_data(payload)
    if not is_valid:
        raise HTTPException(status_code=422, detail={"message": "Clinical data validation failed.", "errors": errors})

    # Execute ML Inference Engine
    result = DiagnosticEngine.run_inference(payload)
    db.assessments.insert(0, result)

    patient_name = result["patientName"]
    db.add_audit_log(
        "Dr. Chinedu Okafor", "Doctor", "Executed AI Diagnostic Engine",
        f"{result['id']} ({patient_name})", "Success",
        f"Result: {result['possibleConditions'][0]['conditionName']} ({result['possibleConditions'][0]['confidence']}%)"
    )

    return {"success": True, "data": result}

# 5. Clinician Review Authorization
@router.post("/diagnostic/review")
async def record_clinician_review(payload: Dict[str, Any] = Body(...)):
    assessment_id = payload.get("assessmentId")
    decision = payload.get("decision")  # Accepted, Modified, Rejected
    notes = payload.get("notes", "")

    for asm in db.assessments:
        if asm["id"] == assessment_id:
            asm["clinicianReview"] = {
                "decision": decision,
                "notes": notes,
                "reviewedBy": "Dr. Chinedu Okafor",
                "reviewedAt": "Just Now"
            }
            db.add_audit_log(
                "Dr. Chinedu Okafor", "Doctor", f"Clinician Review: {decision}",
                f"{assessment_id} ({asm['patientName']})", "Success", notes
            )
            return {"success": True, "data": asm}

    raise HTTPException(status_code=404, detail="Diagnostic assessment record not found.")

# 6. Investigations Endpoints
@router.get("/investigations")
async def get_investigations():
    return {"success": True, "data": db.investigations}

@router.post("/investigations")
async def create_investigation(payload: Dict[str, Any] = Body(...)):
    if "id" not in payload:
        payload["id"] = f"INV-2026-00{len(db.investigations) + 1}"
    db.investigations.insert(0, payload)
    db.add_audit_log("Dr. Chinedu Okafor", "Doctor", "Requested Investigation", payload["id"], "Success")
    return {"success": True, "data": payload}

# 7. Treatment Plans Endpoints
@router.get("/treatment-plans")
async def get_treatment_plans():
    return {"success": True, "data": db.treatment_plans}

@router.post("/treatment-plans")
async def create_treatment_plan(payload: Dict[str, Any] = Body(...)):
    if "id" not in payload:
        payload["id"] = f"TP-2026-00{len(db.treatment_plans) + 1}"
    db.treatment_plans.insert(0, payload)
    db.add_audit_log("Dr. Chinedu Okafor", "Doctor", "Authorized Treatment Plan", payload["id"], "Success")
    return {"success": True, "data": payload}

# 8. Referrals Endpoints
@router.get("/referrals")
async def get_referrals():
    return {"success": True, "data": db.referrals}

@router.post("/referrals")
async def create_referral(payload: Dict[str, Any] = Body(...)):
    if "id" not in payload:
        payload["id"] = f"REF-2026-00{len(db.referrals) + 1}"
    db.referrals.insert(0, payload)
    db.add_audit_log("Dr. Chinedu Okafor", "Doctor", "Created Specialist Referral", payload["id"], "Success")
    return {"success": True, "data": payload}

# 9. Audit Logs Endpoint
@router.get("/audit-logs")
async def get_audit_logs():
    return {"success": True, "data": db.audit_logs}

# 10. System Configuration & Model Meta
@router.get("/system/info")
async def get_system_info():
    return {
        "success": True,
        "application": "AI Diagnostic Support System",
        "projectTitle": "Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria",
        "modelVersion": "1.0.0",
        "accuracy": "94.2%",
        "sensitivity": "92.8%",
        "specificity": "95.1%",
        "auroc": "0.965",
        "architecture": "Multi-Tier Software Architecture (5-Tier)",
        "disclaimer": "AI-Assisted Clinical Decision Support – Final clinical decisions must be made by a qualified healthcare professional."
    }
