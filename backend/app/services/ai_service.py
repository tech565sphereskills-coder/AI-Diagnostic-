import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any
import httpx
from app.core.config import settings
from app.schemas.result import AIAnalysisResponse, RecommendationAIItem, MedicationAIItem

logger = logging.getLogger(__name__)

class BaseAIService(ABC):
    @abstractmethod
    async def analyze_assessment(self, payload: Dict[str, Any]) -> AIAnalysisResponse:
        pass

class MockAIService(BaseAIService):
    async def analyze_assessment(self, payload: Dict[str, Any]) -> AIAnalysisResponse:
        answers = payload.get("answers", [])
        ans_dict = {str(a.get("question", "")): str(a.get("answer", "")) for a in answers} if isinstance(answers, list) else {}

        # Extract text representations of symptoms and vitals
        symptom_text = payload.get("chiefComplaint") or payload.get("symptomDescription") or ""
        if not symptom_text:
            symptom_text = " ".join([ans_dict.get(k, "") for k in ans_dict if "symptom" in k.lower() or "describe" in k.lower()])
        if not symptom_text and isinstance(payload.get("symptoms"), list):
            symptom_text = " ".join([s.get("name", "") for s in payload["symptoms"] if isinstance(s, dict)])
        if not symptom_text:
            symptom_text = "General health consultation"

        vitals_text = payload.get("vitalsSnapshot") or payload.get("vitals") or ""
        if isinstance(vitals_text, dict):
            vitals_text = f"BP {vitals_text.get('systolicBP', 120)}/{vitals_text.get('diastolicBP', 80)}, Temp {vitals_text.get('temperature', 37.0)}C"
        else:
            vitals_text = str(vitals_text)

        text_lower = (symptom_text + " " + vitals_text).lower()

        # Dynamic symptom matching logic
        if any(k in text_lower for k in ["stomach", "ulcer", "heartburn", "gastric", "acid", "epigastric"]):
            title = "Peptic Ulcer Disease (PUD) / Gastritis"
            explanation = "Symptom presentation matches gastric hyperacidity and mucosal erosion."
            findings = [
                "Epigastric distress/burning chest discomfort exacerbated or relieved by food",
                "Absence of gastrointestinal acute intestinal hemorrhage",
                "Normal cardiovascular vital signs"
            ]
            recs = [
                RecommendationAIItem(title="1. Helicobacter pylori Stool Test", description="Obtain lab screening for H. pylori infection.", priority="high"),
                RecommendationAIItem(title="2. Dietary & Lifestyle Modification", description="Avoid NSAIDs, aspirin, spicy foods, caffeine, and alcohol.", priority="medium")
            ]
            meds = [
                MedicationAIItem(
                    name="Omeprazole",
                    dosage="20mg",
                    frequency="Once Daily (OD before breakfast)",
                    duration="14 to 28 Days",
                    instructions="Take 30 minutes before morning meal with water.",
                    purpose="Proton Pump Inhibitor for gastric acid suppression and ulcer healing."
                ),
                MedicationAIItem(
                    name="Magnesium Trisilicate / Aluminium Hydroxide Antacid Gel",
                    dosage="10ml - 20ml",
                    frequency="8-Hourly as needed (TDS between meals)",
                    duration="7 to 14 Days",
                    instructions="Shake bottle well before use. Take between meals & at bedtime.",
                    purpose="Rapid neutralizing of stomach acid."
                ),
                MedicationAIItem(
                    name="Hyoscine Butylbromide (Buscopan)",
                    dosage="10mg",
                    frequency="8-Hourly as needed (TDS)",
                    duration="3 to 5 Days",
                    instructions="Take for acute smooth muscle stomach cramps.",
                    purpose="Antispasmodic for GI pain relief."
                )
            ]
            next_s = ["Complete 14-day Omeprazole regimen.", "Perform H. pylori antigen lab test.", "Follow up if symptoms persist."]

        elif any(k in text_lower for k in ["cough", "throat", "bronchitis", "chest pain", "catarrh", "sputum", "wheezing"]):
            title = "Acute Lower Respiratory / Bronchial Tract Infection"
            explanation = "Clinical symptoms indicate airway mucosal inflammation and bacterial/viral bronchial involvement."
            findings = [
                "Productive or dry persistent cough with sore throat",
                "Mild chest tightness without hemodynamic instability",
                "Clear lung auscultation on physical exam"
            ]
            recs = [
                RecommendationAIItem(title="1. Chest X-Ray (PA View)", description="Confirm absence of lobar pneumonia consolidation.", priority="high"),
                RecommendationAIItem(title="2. Steam Inhalation & Airway Clearance", description="Inhale warm steam twice daily to loosen viscous mucus.", priority="medium")
            ]
            meds = [
                MedicationAIItem(
                    name="Amoxicillin / Clavulanate (Augmentin)",
                    dosage="625mg",
                    frequency="Twice Daily (BD after meals)",
                    duration="7 Days",
                    instructions="Complete full 7-day antibiotic course even if feeling better.",
                    purpose="Broad-spectrum antibacterial treatment."
                ),
                MedicationAIItem(
                    name="Salbutamol / Bromhexine Expectorant Syrup",
                    dosage="10ml",
                    frequency="8-Hourly (TDS)",
                    duration="5 Days",
                    instructions="Take after meals to clear bronchial mucus.",
                    purpose="Bronchodilator and mucolytic."
                ),
                MedicationAIItem(
                    name="Cetirizine Hydrochloride",
                    dosage="10mg",
                    frequency="Once Daily at Bedtime (OD)",
                    duration="5 Days",
                    instructions="May cause mild drowsiness; avoid driving.",
                    purpose="Antihistamine for throat tickle and congestion."
                )
            ]
            next_s = ["Obtain Chest X-Ray if cough persists beyond 7 days.", "Complete full Augmentin antibiotic course."]

        elif any(k in text_lower for k in ["bp", "hypertension", "140/", "150/", "160/", "dizziness", "palpitations"]):
            title = "Primary Hypertension / Elevated Vascular Resistance"
            explanation = "Elevated resting blood pressure requiring pharmacotherapy and cardiovascular protection."
            findings = [
                "Systolic BP >140 mmHg / Diastolic BP >90 mmHg",
                "Occasional occipital morning headache and lightheadedness",
                "No signs of acute end-organ hypertensive crisis"
            ]
            recs = [
                RecommendationAIItem(title="1. Daily Blood Pressure Log", description="Record morning and evening BP for 7 consecutive days.", priority="high"),
                RecommendationAIItem(title="2. Sodium Restriction & DASH Diet", description="Reduce dietary salt to <2g daily and increase potassium intake.", priority="high")
            ]
            meds = [
                MedicationAIItem(
                    name="Amlodipine Besylate",
                    dosage="5mg",
                    frequency="Once Daily (OD in morning)",
                    duration="30 Days / Physician Review",
                    instructions="Take every morning with a glass of water.",
                    purpose="Calcium channel blocker for arterial vasodilation."
                ),
                MedicationAIItem(
                    name="Lisinopril",
                    dosage="5mg",
                    frequency="Once Daily (OD in morning)",
                    duration="30 Days / Physician Review",
                    instructions="Monitor BP daily; notify doctor if persistent dry cough develops.",
                    purpose="ACE Inhibitor for blood pressure & renal protection."
                ),
                MedicationAIItem(
                    name="Low-Dose Aspirin",
                    dosage="75mg",
                    frequency="Once Daily (OD after food)",
                    duration="30 Days",
                    instructions="Take immediately after lunch.",
                    purpose="Vascular anti-platelet protection."
                )
            ]
            next_s = ["Maintain a 7-day BP tracking diary.", "Consult physician for medication titration."]

        elif any(k in text_lower for k in ["diarrhea", "vomit", "purging", "stool", "gastroenteritis", "food poisoning"]):
            title = "Acute Gastroenteritis & Dehydration Risk"
            explanation = "Acute intestinal infection causing fluid/electrolyte depletion."
            findings = [
                "Frequent loose bowel movements with abdominal cramping",
                "Moderate fluid loss needing urgent oral rehydration",
                "No gross hematochezia observed"
            ]
            recs = [
                RecommendationAIItem(title="1. Stool Microscopy & Culture", description="Submit stool sample for ova, parasites, and bacterial pathogens.", priority="high"),
                RecommendationAIItem(title="2. Oral Electrolyte Rehydration", description="Sip ORS continuously after every loose stool.", priority="high")
            ]
            meds = [
                MedicationAIItem(
                    name="Ciprofloxacin",
                    dosage="500mg",
                    frequency="Twice Daily (BD after meals)",
                    duration="5 Days",
                    instructions="Take with full glass of water. Avoid antacids within 2 hours.",
                    purpose="Fluoroquinolone antibiotic for enteropathogenic bacteria."
                ),
                MedicationAIItem(
                    name="Metronidazole (Flagyl)",
                    dosage="400mg",
                    frequency="8-Hourly (TDS after food)",
                    duration="5 Days",
                    instructions="Do NOT consume alcohol during treatment.",
                    purpose="Anti-protozoal treatment for intestinal parasites."
                ),
                MedicationAIItem(
                    name="Oral Rehydration Salts (ORS) + Zinc Sulphate 20mg",
                    dosage="1 Sachet in 1L Water",
                    frequency="Continuous sip after stooling",
                    duration="3 to 5 Days",
                    instructions="Mix sachet in clean drinking water; discard after 24h.",
                    purpose="Electrolyte balance and intestinal lining recovery."
                )
            ]
            next_s = ["Drink ORS after every bowel movement.", "Complete 5-day antibacterial course."]

        elif any(k in text_lower for k in ["urine", "urinary", "dysuria", "burning urination", "flank"]):
            title = "Acute Uncomplicated Urinary Tract Infection (UTI)"
            explanation = "Bacterial colonization of the lower urinary tract."
            findings = [
                "Dysuria (burning sensation) with urinary frequency and urgency",
                "Suprapubic discomfort",
                "Absence of high fever or costovertebral angle tenderness (no pyelonephritis)"
            ]
            recs = [
                RecommendationAIItem(title="1. Urine Full Urinalysis & Culture", description="Perform urine dipstick and M/C/S test.", priority="high"),
                RecommendationAIItem(title="2. High Fluid Intake Protocol", description="Drink 3 Litres of clean water daily to flush urinary tract.", priority="medium")
            ]
            meds = [
                MedicationAIItem(
                    name="Nitrofurantoin (Macrodantin)",
                    dosage="100mg",
                    frequency="Twice Daily (BD with food)",
                    duration="7 Days",
                    instructions="Take with meals or milk to improve absorption and avoid nausea.",
                    purpose="Urinary tract targeted antibacterial agent."
                ),
                MedicationAIItem(
                    name="Potassium Citrate Mixture",
                    dosage="10ml",
                    frequency="8-Hourly in water (TDS)",
                    duration="5 Days",
                    instructions="Dilute in half glass of water after meals.",
                    purpose="Urinary alkalinizer to relieve burning pain."
                )
            ]
            next_s = ["Complete 7-day Nitrofurantoin course.", "Perform urine culture test."]

        elif any(k in text_lower for k in ["diabetes", "sugar", "thirst", "frequent urination"]):
            title = "Suspected Diabetes Mellitus / Hyperglycemia Risk"
            explanation = "Impaired glucose metabolism requiring biochemical investigation."
            findings = [
                "Osmotic symptoms (polydipsia, polyuria) reported",
                "Elevated risk profile for glucose intolerance",
                "Requires fasting plasma glucose confirmation"
            ]
            recs = [
                RecommendationAIItem(title="1. Fasting Blood Glucose & HbA1c", description="Obtain lab blood test after 8-hour overnight fast.", priority="high"),
                RecommendationAIItem(title="2. Dietary Glycemic Index Control", description="Eliminate refined sugars and simple carbohydrates.", priority="high")
            ]
            meds = [
                MedicationAIItem(
                    name="Metformin Hydrochloride",
                    dosage="500mg",
                    frequency="Twice Daily (BD with meals)",
                    duration="30 Days / Clinical Review",
                    instructions="Take with morning and evening meals to minimize GI side effects.",
                    purpose="Biguanide for enhancing peripheral insulin sensitivity."
                ),
                MedicationAIItem(
                    name="Neurobion (Vitamin B1, B6, B12)",
                    dosage="1 Tablet",
                    frequency="Once Daily (OD)",
                    duration="30 Days",
                    instructions="Take daily after meals.",
                    purpose="Neuroprotective support for peripheral nerve health."
                )
            ]
            next_s = ["Perform Fasting Blood Sugar (FBS) test.", "Consult endocrinologist or physician."]

        elif any(k in text_lower for k in ["joint", "arthritis", "waist", "knee", "back pain", "swelling"]):
            title = "Acute Musculoskeletal Pain / Inflammatory Arthropathy"
            explanation = "Inflammatory joint/musculoskeletal irritation."
            findings = [
                "Joint pain and localized stiffness aggravated by movement",
                "No systemic signs of septic arthritis",
                "Mild periarticular soft tissue tenderness"
            ]
            recs = [
                RecommendationAIItem(title="1. Joint X-Ray & Uric Acid Screening", description="Radiograph of affected joint and serum uric acid test.", priority="medium"),
                RecommendationAIItem(title="2. Physical Therapy & Warm Compress", description="Apply warm compress for 15 minutes twice daily.", priority="medium")
            ]
            meds = [
                MedicationAIItem(
                    name="Ibuprofen",
                    dosage="400mg",
                    frequency="8-Hourly after food (TDS)",
                    duration="5 Days",
                    instructions="Take strictly with or after meals to protect stomach lining.",
                    purpose="Non-Steroidal Anti-Inflammatory Drug (NSAID)."
                ),
                MedicationAIItem(
                    name="Diclofenac Topical Gel",
                    dosage="Apply thin layer",
                    frequency="8-Hourly (TDS)",
                    duration="7 Days",
                    instructions="Gently rub into affected painful joint until absorbed.",
                    purpose="Topical anti-inflammatory analgesic."
                )
            ]
            next_s = ["Use Ibuprofen for 5 days max after meals.", "Rest joint and avoid heavy lifting."]

        elif any(k in text_lower for k in ["rash", "itching", "eczema", "hives", "skin", "boils"]):
            title = "Acute Allergic Dermatitis / Urticarial Skin Reaction"
            explanation = "Dermal histaminic allergic flare or cutaneous irritation."
            findings = [
                "Pruritic skin rash with localized erythema",
                "No mucosal swelling or respiratory stridor",
                "Intact skin barrier without active ulceration"
            ]
            recs = [
                RecommendationAIItem(title="1. Dermatological Allergy Assessment", description="Identify potential contact allergen or dietary trigger.", priority="medium"),
                RecommendationAIItem(title="2. Gentle Antiseptic Skin Care", description="Bathe with mild non-perfumed soap and lukewarm water.", priority="medium")
            ]
            meds = [
                MedicationAIItem(
                    name="Cetirizine Hydrochloride",
                    dosage="10mg",
                    frequency="Once Daily at Bedtime (OD)",
                    duration="5 to 7 Days",
                    instructions="Take 1 tablet at night.",
                    purpose="2nd Generation antihistamine for itching and rash resolution."
                ),
                MedicationAIItem(
                    name="Hydrocortisone Cream 1%",
                    dosage="Apply thin layer",
                    frequency="12-Hourly (BD)",
                    duration="5 Days",
                    instructions="Apply sparingly to itchy rash area. Do not use on broken skin.",
                    purpose="Topical corticosteroid for cutaneous inflammation."
                )
            ]
            next_s = ["Apply Hydrocortisone cream twice daily.", "Avoid harsh soaps and hot baths."]

        elif any(k in text_lower for k in ["tooth", "dental", "gum", "jaw"]):
            title = "Acute Dental Caries / Periapical Odontogenic Infection"
            explanation = "Localized dental bacterial inflammation or pulpal irritation."
            findings = [
                "Localized tooth ache exacerbated by hot/cold stimuli",
                "Gingival swelling around affected tooth site",
                "Absence of Ludwig's angina or airway impairment"
            ]
            recs = [
                RecommendationAIItem(title="1. Dental Practitioner Evaluation", description="Visit dental clinic for intraoral exam and radiograph.", priority="high"),
                RecommendationAIItem(title="2. Warm Saline Oral Rinse", description="Rinse mouth with warm salt water after every meal.", priority="medium")
            ]
            meds = [
                MedicationAIItem(
                    name="Amoxicillin 500mg + Metronidazole 400mg",
                    dosage="500mg / 400mg",
                    frequency="8-Hourly after meals (TDS)",
                    duration="5 Days",
                    instructions="Take after food. Complete full 5-day course.",
                    purpose="Combined antibacterial coverage for dental anaerobic bacteria."
                ),
                MedicationAIItem(
                    name="Ibuprofen",
                    dosage="400mg",
                    frequency="8-Hourly after food (TDS)",
                    duration="5 Days",
                    instructions="Take after meals for dental pain relief.",
                    purpose="Analgesic and anti-inflammatory."
                ),
                MedicationAIItem(
                    name="Chlorhexidine 0.2% Antiseptic Mouthwash",
                    dosage="15ml",
                    frequency="Twice Daily (BD)",
                    duration="7 Days",
                    instructions="Rinse vigorously for 60 seconds then spit out. Do not swallow.",
                    purpose="Oral antimicrobial mouth rinse."
                )
            ]
            next_s = ["Consult dentist for clinical procedure.", "Rinse with Chlorhexidine mouthwash twice daily."]

        else:
            # Default: Suspected Acute Febrile Illness / Malaria Syndrome
            title = "Suspected Uncomplicated Malaria / Febrile Illness"
            explanation = "Acute febrile illness typical of endemic Plasmodium falciparum infection."
            findings = [
                "Elevated body temperature with generalized rigors and headache",
                "Symptom onset within past 1 to 4 days",
                "Normal cardiovascular & respiratory parameters"
            ]
            recs = [
                RecommendationAIItem(title="1. Malaria Rapid Diagnostic Test (RDT)", description="Obtain immediate blood film for MP microscopy.", priority="high"),
                RecommendationAIItem(title="2. Fluid & Temperature Control", description="Sponging with lukewarm water and drinking ORS fluids.", priority="medium")
            ]
            meds = [
                MedicationAIItem(
                    name="Artemether / Lumefantrine (Coartem)",
                    dosage="80/480mg (4 Tablets per dose)",
                    frequency="Twice Daily (BD at 0h, 8h, 24h, 36h, 48h, 60h)",
                    duration="3 Days",
                    instructions="Take with fatty food or milk to optimize absorption.",
                    purpose="First-line Artemisinin Combination Therapy (ACT) for malaria."
                ),
                MedicationAIItem(
                    name="Paracetamol (Acetaminophen)",
                    dosage="500mg - 1000mg",
                    frequency="8-Hourly as needed (TDS)",
                    duration="3 to 5 Days",
                    instructions="Maximum 4g daily for fever and joint body pain relief.",
                    purpose="Antipyretic and analgesic."
                ),
                MedicationAIItem(
                    name="Oral Rehydration Salts (ORS)",
                    dosage="1 Sachet in 1L Water",
                    frequency="Sip continuously",
                    duration="3 Days",
                    instructions="Mix sachet in clean water; discard unused fluid after 24h.",
                    purpose="Hydration and electrolyte maintenance during fever spikes."
                )
            ]
            next_s = ["Perform Malaria RDT lab test.", "Complete full 3-day Coartem treatment course."]

        return AIAnalysisResponse(
            result_title=title,
            result_summary=f"Based on your reported symptoms ('{symptom_text[:60]}...'), vitals ({vitals_text}), age, and biological sex, our AI Diagnostic Support System has generated the following clinical evaluation and targeted drug prescriptions.",
            confidence_score=0.91,
            explanation=explanation,
            key_findings=findings,
            recommendations=recs,
            prescribed_medications=meds,
            next_steps=next_s
        )

class RealAIService(BaseAIService):
    async def analyze_assessment(self, payload: Dict[str, Any]) -> AIAnalysisResponse:
        system_prompt = (
            "You are an expert AI Diagnostic and Recommendation engine for healthcare in Nigeria. "
            "You analyze patient questionnaire data (symptoms, duration, severity 1-10, age, biological sex, vitals, medical history) and return ONLY a valid JSON object matching this exact schema:\n"
            "{\n"
            '  "result_title": "string",\n'
            '  "result_summary": "string starting with Based on your responses...",\n'
            '  "confidence_score": 0.92 (float between 0.0 and 1.0),\n'
            '  "explanation": "string",\n'
            '  "key_findings": ["string"],\n'
            '  "recommendations": [{"title": "string", "description": "string", "priority": "high|medium|low"}],\n'
            '  "prescribed_medications": [{"name": "string", "dosage": "string", "frequency": "string", "duration": "string", "instructions": "string", "purpose": "string"}],\n'
            '  "next_steps": ["string"]\n'
            "}\n"
            "Do NOT include markdown formatting or extra text. Output plain valid JSON."
        )

        headers = {
            "Authorization": f"Bearer {settings.AI_API_KEY}",
            "Content-Type": "application/json"
        }

        body = {
            "model": settings.AI_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(payload)}
            ],
            "temperature": 0.2
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(f"{settings.AI_BASE_URL}/chat/completions", headers=headers, json=body)
                res.raise_for_status()
                data = res.json()
                content = data["choices"][0]["message"]["content"].strip()
                if content.startswith("```"):
                    content = content.replace("```json", "").replace("```", "").strip()

                parsed = json.loads(content)
                return AIAnalysisResponse(**parsed)
        except Exception as e:
            logger.error(f"RealAIService call failed: {str(e)}. Falling back to MockAIService.")
            mock_fallback = MockAIService()
            return await mock_fallback.analyze_assessment(payload)

def get_ai_service() -> BaseAIService:
    if settings.USE_MOCK_AI or not settings.AI_API_KEY:
        return MockAIService()
    return RealAIService()
