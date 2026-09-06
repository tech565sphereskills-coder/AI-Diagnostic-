import datetime
from typing import List, Dict, Any, Optional

class Database:
    def __init__(self):
        self.patients: List[Dict[str, Any]] = [
            {
                "id": "PT-2026-001",
                "firstName": "Amina",
                "lastName": "Ibrahim",
                "name": "Amina Ibrahim",
                "age": 32,
                "sex": "Female",
                "dob": "1994-05-14",
                "bloodGroup": "O+",
                "phone": "+234 803 456 7890",
                "email": "amina.ibrahim@example.ng",
                "address": "14 Ikeja Way, Victoria Island",
                "stateOfResidence": "Lagos",
                "emergencyContact": {
                    "name": "Usman Ibrahim",
                    "relationship": "Spouse",
                    "phone": "+234 802 111 2233"
                },
                "medicalSummary": {
                    "chronicConditions": ["Asthma (Mild)"],
                    "allergies": ["Penicillin", "Dust mites"],
                    "currentMedications": ["Salbutamol Inhaler (PRN)"],
                    "surgeries": ["Appendectomy (2018)"],
                    "familyHistory": ["Type 2 Diabetes (Mother)"]
                },
                "riskLevel": "Moderate",
                "status": "Under Review",
                "lastVisit": "2026-09-04",
                "createdAt": "2026-01-15"
            },
            {
                "id": "PT-2026-002",
                "firstName": "Chukwuemeka",
                "lastName": "Okoro",
                "name": "Chukwuemeka Okoro",
                "age": 47,
                "sex": "Male",
                "dob": "1979-11-22",
                "bloodGroup": "A+",
                "phone": "+234 812 345 6789",
                "email": "emeka.okoro@example.ng",
                "address": "88 Trans-Amadi Road, Port Harcourt",
                "stateOfResidence": "Rivers",
                "emergencyContact": {
                    "name": "Grace Okoro",
                    "relationship": "Wife",
                    "phone": "+234 805 999 8877"
                },
                "medicalSummary": {
                    "chronicConditions": ["Essential Hypertension"],
                    "allergies": ["None reported"],
                    "currentMedications": ["Amlodipine 10mg daily", "Lisinopril 5mg daily"],
                    "familyHistory": ["Hypertension (Father)"]
                },
                "riskLevel": "High",
                "status": "Active",
                "lastVisit": "2026-09-05",
                "createdAt": "2025-11-10"
            },
            {
                "id": "PT-2026-003",
                "firstName": "Blessing",
                "lastName": "Adeyemi",
                "name": "Blessing Adeyemi",
                "age": 28,
                "sex": "Female",
                "dob": "1998-03-09",
                "bloodGroup": "B+",
                "phone": "+234 703 123 4567",
                "email": "blessing.a@example.ng",
                "address": "5 Ring Road, Ibadan",
                "stateOfResidence": "Oyo",
                "emergencyContact": {
                    "name": "Dr. Folake Adeyemi",
                    "relationship": "Sister",
                    "phone": "+234 809 444 3322"
                },
                "medicalSummary": {
                    "chronicConditions": ["None"],
                    "allergies": ["Sulfa drugs"],
                    "currentMedications": ["Multivitamins"]
                },
                "riskLevel": "Low",
                "status": "Active",
                "lastVisit": "2026-09-02",
                "createdAt": "2026-03-20"
            }
        ]

        self.assessments: List[Dict[str, Any]] = [
            {
                "id": "ASM-2026-001",
                "patientId": "PT-2026-001",
                "patientName": "Amina Ibrahim",
                "patientAge": 32,
                "patientSex": "Female",
                "dateTime": "2026-09-04 14:32",
                "modelVersion": "AI Diagnostic Model v1.0",
                "status": "Completed",
                "overallRisk": "Moderate",
                "riskScore": 68,
                "chiefComplaint": "Persistent high fever (39.1°C), throbbing frontal headache, severe bodily fatigue, and loss of appetite for 4 days.",
                "vitalsSnapshot": {
                    "temperature": 39.1,
                    "heartRate": 104,
                    "respiratoryRate": 20,
                    "systolicBP": 118,
                    "diastolicBP": 78,
                    "oxygenSaturation": 98,
                    "weight": 64,
                    "height": 165,
                    "bmi": 23.5
                },
                "possibleConditions": [
                    {
                        "rank": 1,
                        "conditionName": "Acute Uncomplicated Malaria (P. falciparum)",
                        "confidence": 82,
                        "riskLevel": "Moderate",
                        "supportingFactors": [
                            "High spiking temperature (39.1°C)",
                            "Tachycardia (104 bpm)",
                            "Positive Malaria Parasite blood film (++ falciparum trophozoites)"
                        ],
                        "clinicalObservations": ["Mild splenomegaly on palpation"],
                        "labFindings": ["Malaria Parasite Count: 4,200 parasites/µL"]
                    },
                    {
                        "rank": 2,
                        "conditionName": "Enteric Fever (Typhoid Fever)",
                        "confidence": 61,
                        "riskLevel": "Moderate",
                        "supportingFactors": [
                            "Step-ladder fever pattern (>3 days)",
                            "Anorexia and generalized fatigue"
                        ],
                        "clinicalObservations": ["Mild abdominal tenderness"],
                        "labFindings": ["Leukopenia trend"]
                    }
                ],
                "keyFactors": [
                    {"category": "Symptoms", "title": "High Spiking Fever", "detail": "Recorded at 39.1°C with rigors."},
                    {"category": "Laboratory Findings", "title": "MP Positive (++)", "detail": "Microscopic P. falciparum trophozoites."}
                ],
                "recommendedInvestigations": [
                    {"id": "1", "name": "Complete Blood Count (CBC)", "reason": "Track PCV and platelet levels.", "priority": "Recommended"},
                    {"id": "2", "name": "Repeat MP Microscopy", "reason": "Track parasitemia post treatment.", "priority": "Routine"}
                ],
                "clinicalRecommendations": [
                    "Initiate oral Artemisinin-based Combination Therapy (ACT), e.g. Artemether-Lumefantrine 80/480mg BD for 3 days.",
                    "Administer Paracetamol 1g TDS for pyrexia.",
                    "Encourage aggressive oral rehydration."
                ],
                "clinicianReview": {
                    "decision": "Accepted",
                    "notes": "Confirmed malaria. ACT started.",
                    "reviewedBy": "Dr. Chinedu Okafor",
                    "reviewedAt": "2026-09-04 15:10"
                }
            }
        ]

        self.investigations: List[Dict[str, Any]] = [
            {
                "id": "INV-2026-001",
                "patientId": "PT-2026-001",
                "patientName": "Amina Ibrahim",
                "testName": "Complete Blood Count (CBC) & Differential",
                "priority": "Recommended",
                "requestedBy": "Dr. Chinedu Okafor",
                "requestedDate": "2026-09-04",
                "status": "Completed",
                "clinicalReason": "Evaluate anemia severity and leucocyte count."
            }
        ]

        self.treatment_plans: List[Dict[str, Any]] = [
            {
                "id": "TP-2026-001",
                "patientId": "PT-2026-001",
                "patientName": "Amina Ibrahim",
                "clinicalProblem": "Acute Uncomplicated P. falciparum Malaria",
                "managementPlan": "Initiate 3-day course of Artemether-Lumefantrine. Paracetamol for fever.",
                "medications": [
                    {
                        "id": "med-1",
                        "name": "Artemether / Lumefantrine (Coartem)",
                        "dosage": "80mg / 480mg",
                        "route": "Oral",
                        "frequency": "Twice Daily (BD)",
                        "duration": "3 Days",
                        "instructions": "Take with fatty meal or milk."
                    }
                ],
                "monitoringRequirements": "Re-assess temperature twice daily.",
                "followUpDate": "2026-09-08",
                "authorizedBy": "Dr. Chinedu Okafor",
                "createdAt": "2026-09-04",
                "status": "Active"
            }
        ]

        self.referrals: List[Dict[str, Any]] = [
            {
                "id": "REF-2026-001",
                "patientId": "PT-2026-002",
                "patientName": "Chukwuemeka Okoro",
                "specialistType": "Cardiologist",
                "urgency": "Urgent",
                "referralReason": "Hypertensive urgency episode with chest tightness.",
                "clinicalSummary": "47-year-old male with BP 178/112 mmHg on presentation.",
                "relevantInvestigations": "ECG LVH pattern.",
                "status": "Submitted",
                "date": "2026-09-05",
                "referringDoctor": "Dr. Chinedu Okafor"
            }
        ]

        self.audit_logs: List[Dict[str, Any]] = [
            {
                "id": "LOG-1001",
                "dateTime": "2026-09-05 09:45",
                "user": "Dr. Chinedu Okafor",
                "role": "Medical Doctor / Clinician",
                "action": "Generated Specialist Referral",
                "resource": "REF-2026-001 (Chukwuemeka Okoro)",
                "status": "Success",
                "details": "Referred patient to Cardiology Clinic."
            }
        ]

    def add_audit_log(self, user: str, role: str, action: str, resource: str, status: str = "Success", details: str = ""):
        log_entry = {
            "id": f"LOG-{len(self.audit_logs) + 1001}",
            "dateTime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "user": user,
            "role": role,
            "action": action,
            "resource": resource,
            "status": status,
            "details": details
        }
        self.audit_logs.insert(0, log_entry)
        return log_entry

db = Database()
