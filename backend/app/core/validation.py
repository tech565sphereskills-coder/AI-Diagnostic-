from typing import Dict, Any, List, Tuple

class DataValidationModule:
    """
    Implements Step 3 of the System Flowchart (Figure 3.18):
    Checks patient clinical input data for completeness and correctness.
    """

    @staticmethod
    def validate_clinical_data(payload: Dict[str, Any]) -> Tuple[bool, List[str], Dict[str, Any]]:
        errors = []
        checks = {
            "demographicsComplete": False,
            "chiefComplaintRecorded": False,
            "symptomsValid": False,
            "vitalsValid": False,
            "labDataAvailable": False
        }

        # 1. Demographics & Patient Record Check
        patient = payload.get("patient") or payload
        user_info = payload.get("userInfo") or {}
        patient_name = user_info.get("fullName") or patient.get("name") or payload.get("patientName")
        if patient_name and len(patient_name.strip()) > 0:
            checks["demographicsComplete"] = True
        else:
            errors.append("Patient demographic information is missing or incomplete.")

        # 2. Chief Complaint Check
        chief_complaint = payload.get("chiefComplaint") or payload.get("symptomDescription") or ""
        if len(chief_complaint.strip()) >= 3:
            checks["chiefComplaintRecorded"] = True
        else:
            errors.append("Chief complaint description is required.")

        # 3. Symptoms Entry Check
        symptoms = payload.get("symptoms") or []
        if isinstance(symptoms, list) and len(symptoms) > 0:
            checks["symptomsValid"] = True
        else:
            errors.append("At least one clinical symptom must be selected or entered.")

        # 4. Vital Signs Physiological Bounds & Correctness Check
        vitals = payload.get("vitals") or payload.get("vitalsSnapshot") or {}
        if vitals:
            temp = float(vitals.get("temperature", 37.0))
            hr = int(vitals.get("heartRate", 80))
            rr = int(vitals.get("respiratoryRate", 18))
            sbp = int(vitals.get("systolicBP", 120))
            dbp = int(vitals.get("diastolicBP", 80))
            spo2 = int(vitals.get("oxygenSaturation", 98))

            vitals_errs = []
            if not (30.0 <= temp <= 45.0):
                vitals_errs.append(f"Temperature value ({temp}°C) is out of physiological bounds (30.0 - 45.0°C).")
            if not (30 <= hr <= 230):
                vitals_errs.append(f"Heart rate value ({hr} bpm) is out of valid range (30 - 230 bpm).")
            if not (5 <= rr <= 60):
                vitals_errs.append(f"Respiratory rate ({rr}/min) is out of valid range.")
            if not (50 <= sbp <= 280) or not (30 <= dbp <= 180):
                vitals_errs.append(f"Blood pressure values ({sbp}/{dbp} mmHg) are invalid.")
            if not (50 <= spo2 <= 100):
                vitals_errs.append(f"Oxygen saturation ({spo2}%) is invalid.")

            if len(vitals_errs) == 0:
                checks["vitalsValid"] = True
            else:
                errors.extend(vitals_errs)
        else:
            errors.append("Vital signs input parameters are missing.")

        # 5. Lab Data Status
        labs = payload.get("labs") or payload.get("labFindings") or []
        if len(labs) > 0:
            checks["labDataAvailable"] = True

        is_valid = len(errors) == 0
        return is_valid, errors, checks
