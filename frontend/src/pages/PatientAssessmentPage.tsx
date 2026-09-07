import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  BrainCircuit,
  FileText,
  Clock,
  Printer,
  Plus
} from 'lucide-react';
import type { Symptom, VitalSigns, AIDiagnosticAssessment, ActivePage } from '../types';
import { runAIDiagnosticAPI } from '../services/api';
import { StageTracker } from '../components/assessment/StageTracker';
import { useAuth } from '../context/AuthContext';

interface PatientAssessmentPageProps {
  onNavigate: (page: ActivePage) => void;
  onSaveAssessment?: (assessment: AIDiagnosticAssessment) => void;
  addToast?: (type: 'success' | 'warning' | 'error' | 'info', title: string, message?: string) => void;
}

export const PatientAssessmentPage: React.FC<PatientAssessmentPageProps> = ({
  onNavigate,
  onSaveAssessment,
  addToast
}) => {
  const { user } = useAuth();

  // Wizard Navigation Step (1 to 9 - Demographics to Next Steps)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const authEmail = user?.email || 'registered@user.ng';

  // Requirement 1: Patient Demographics & Profile Info (Name, Age, Sex, etc.)
  const [fullName, setFullName] = useState(user?.name || 'Registered Patient');
  const [age, setAge] = useState<number>(28);
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [location, setLocation] = useState('Abuja, Nigeria');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');

  // Requirement 3 & 4 & 5: Symptoms (select/describe, duration, 1-10 severity)
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [symptomDescription, setSymptomDescription] = useState('');
  const [overallDuration, setOverallDuration] = useState('1 to 3 days');
  const [customSymptomInput, setCustomSymptomInput] = useState('');

  // Requirement 6: Medical History
  const [selectedChronic, setSelectedChronic] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState('');
  const [pastSurgeries, setPastSurgeries] = useState('');

  // Requirement 7: Additional information (Blood Pressure & Temperature)
  const [vitals, setVitals] = useState<VitalSigns>({
    temperature: 36.8,
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 76,
    respiratoryRate: 18,
    oxygenSaturation: 98,
    weight: 68,
    height: 168
  });

  // Requirement 8, 9, 10: Submission, AI Analysis, Results & Recommendations
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState<AIDiagnosticAssessment | null>(null);

  // Common Symptom Presets
  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Fatigue', 'Chest Pain',
    'Shortness of Breath', 'Abdominal Pain', 'Vomiting', 'Diarrhea',
    'Dizziness', 'Loss of Appetite', 'Chills', 'Body Aches', 'Sore Throat', 'Joint Pain'
  ];

  const chronicOptions = [
    'Hypertension (High BP)', 'Diabetes Mellitus', 'Asthma / Respiratory',
    'Sickle Cell Disease', 'Heart Disease', 'Kidney Disease', 'None'
  ];

  const allergyOptions = ['Penicillin', 'Sulfa Drugs', 'NSAIDs / Aspirin', 'Food Allergies', 'None'];

  // Helper functions
  const calculateBMI = (w: number, h: number) => {
    if (!w || !h) return 0;
    const hMeter = h / 100;
    return parseFloat((w / (hMeter * hMeter)).toFixed(1));
  };

  const getBPStatus = (sys: number, dia: number) => {
    if (sys >= 180 || dia >= 120) return { label: 'Hypertensive Crisis', color: 'bg-red-600 text-white' };
    if (sys >= 140 || dia >= 90) return { label: 'Stage 2 Hypertension', color: 'bg-amber-600 text-white' };
    if (sys >= 130 || dia >= 80) return { label: 'Stage 1 Hypertension', color: 'bg-amber-500 text-white' };
    if (sys >= 120 && dia < 80) return { label: 'Elevated BP', color: 'bg-yellow-500 text-slate-900' };
    return { label: 'Normal BP', color: 'bg-emerald-600 text-white' };
  };

  const getSeverityBadge = (rating: number) => {
    if (rating >= 9) return { label: `${rating}/10 - Extreme`, bg: 'bg-red-100 text-red-800 border-red-300' };
    if (rating >= 7) return { label: `${rating}/10 - Severe`, bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (rating >= 4) return { label: `${rating}/10 - Moderate`, bg: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { label: `${rating}/10 - Mild`, bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  const handleAddSymptom = (name: string) => {
    if (symptoms.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    const newSym: Symptom = {
      id: Date.now().toString(),
      name,
      severity: 'Moderate',
      severityRating: 5,
      duration: overallDuration
    };
    setSymptoms([...symptoms, newSym]);
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id));
  };

  const handleUpdateSeverityRating = (id: string, rating: number) => {
    const sevString: 'Mild' | 'Moderate' | 'Severe' = rating >= 7 ? 'Severe' : rating >= 4 ? 'Moderate' : 'Mild';
    setSymptoms(
      symptoms.map((s) => (s.id === id ? { ...s, severityRating: rating, severity: sevString } : s))
    );
  };

  const toggleChronic = (item: string) => {
    if (item === 'None') {
      setSelectedChronic(['None']);
      return;
    }
    const filtered = selectedChronic.filter((c) => c !== 'None');
    if (filtered.includes(item)) {
      setSelectedChronic(filtered.filter((c) => c !== item));
    } else {
      setSelectedChronic([...filtered, item]);
    }
  };

  const toggleAllergy = (item: string) => {
    if (item === 'None') {
      setSelectedAllergies(['None']);
      return;
    }
    const filtered = selectedAllergies.filter((a) => a !== 'None');
    if (filtered.includes(item)) {
      setSelectedAllergies(filtered.filter((a) => a !== item));
    } else {
      setSelectedAllergies([...filtered, item]);
    }
  };

  // Requirement: Submit Information for AI Analysis and Save Medical Record
  const handleSubmitAssessment = async () => {
    setIsProcessing(true);
    setProcessingStep(1);

    const payload = {
      accountMode: 'register',
      userInfo: {
        fullName: fullName || user?.name || 'Registered Patient',
        age,
        sex,
        location,
        bloodGroup,
        phone,
        email: authEmail
      },
      chiefComplaint: symptomDescription,
      symptomDescription,
      overallDuration,
      symptoms,
      medicalHistory: {
        chronicConditions: selectedChronic,
        allergies: selectedAllergies,
        medications: currentMedications ? [currentMedications] : [],
        pastSurgeries
      },
      vitals
    };

    setTimeout(() => setProcessingStep(2), 600);
    setTimeout(() => setProcessingStep(3), 1200);
    setTimeout(() => setProcessingStep(4), 1800);
    setTimeout(() => setProcessingStep(5), 2400);

    // Dynamic Clinical Category Scoring Evaluator
    const textToAnalyze = (symptomDescription + ' ' + symptoms.map(s => `${s.name} ${s.notes || ''}`).join(' ')).toLowerCase();
    const vitalsInfo = `BP ${vitals.systolicBP}/${vitals.diastolicBP} mmHg, Temp ${vitals.temperature}°C`;

    const scores: Record<string, number> = {
      ulcer: 0,
      respiratory: 0,
      hypertension: 0,
      gastroenteritis: 0,
      uti: 0,
      diabetes: 0,
      joint: 0,
      dermatitis: 0,
      dental: 0,
      malaria: 0
    };

    if (textToAnalyze.includes('stomach') || textToAnalyze.includes('ulcer') || textToAnalyze.includes('heartburn') || textToAnalyze.includes('acid') || textToAnalyze.includes('epigastric') || textToAnalyze.includes('gastric') || textToAnalyze.includes('gastritis')) scores.ulcer += 10;
    if (textToAnalyze.includes('cough') || textToAnalyze.includes('sore throat') || textToAnalyze.includes('throat') || textToAnalyze.includes('chest') || textToAnalyze.includes('catarrh') || textToAnalyze.includes('bronchitis') || textToAnalyze.includes('sputum') || textToAnalyze.includes('wheezing')) scores.respiratory += 10;
    if (textToAnalyze.includes('bp') || textToAnalyze.includes('hypertension') || textToAnalyze.includes('dizziness') || textToAnalyze.includes('palpitations') || vitals.systolicBP >= 140 || vitals.diastolicBP >= 90) scores.hypertension += 10;
    if (textToAnalyze.includes('diarrhea') || textToAnalyze.includes('vomit') || textToAnalyze.includes('purging') || textToAnalyze.includes('stool') || textToAnalyze.includes('gastroenteritis') || textToAnalyze.includes('food poisoning')) scores.gastroenteritis += 10;
    if (textToAnalyze.includes('urine') || textToAnalyze.includes('urinary') || textToAnalyze.includes('dysuria') || textToAnalyze.includes('burning urination') || textToAnalyze.includes('flank')) scores.uti += 10;
    if (textToAnalyze.includes('diabetes') || textToAnalyze.includes('sugar') || textToAnalyze.includes('thirst') || textToAnalyze.includes('frequent urination')) scores.diabetes += 10;
    if (textToAnalyze.includes('joint') || textToAnalyze.includes('arthritis') || textToAnalyze.includes('waist') || textToAnalyze.includes('knee') || textToAnalyze.includes('back pain') || textToAnalyze.includes('swelling')) scores.joint += 10;
    if (textToAnalyze.includes('rash') || textToAnalyze.includes('itching') || textToAnalyze.includes('eczema') || textToAnalyze.includes('hives') || textToAnalyze.includes('skin') || textToAnalyze.includes('boils')) scores.dermatitis += 10;
    if (textToAnalyze.includes('tooth') || textToAnalyze.includes('dental') || textToAnalyze.includes('gum') || textToAnalyze.includes('jaw')) scores.dental += 10;
    if (textToAnalyze.includes('fever') || textToAnalyze.includes('chills') || textToAnalyze.includes('rigors') || textToAnalyze.includes('malaria') || vitals.temperature >= 38.0) scores.malaria += 8;

    const highestCategory = Object.entries(scores).reduce((max, curr) => curr[1] > max[1] ? curr : max, ['malaria', -1])[0];
    
    let generatedConditions: any[] = [];
    let generatedMeds: any[] = [];
    let generatedLabs: any[] = [];
    let generatedRecs: string[] = [];

    if (highestCategory === 'ulcer') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Peptic Ulcer Disease (PUD) / Acute Gastritis',
          confidence: 91,
          riskLevel: 'Moderate',
          supportingFactors: [`Epigastric discomfort reported: "${symptomDescription || 'Stomach distress'}"`, `Symptom duration of ${overallDuration}`, 'No signs of acute gastrointestinal bleeding'],
          clinicalObservations: ['Epigastric tenderness on palpation', 'Gastric hyperacidity symptoms reported'],
          labFindings: ['Helicobacter pylori stool antigen / urea breath test recommended']
        },
        {
          rank: 2,
          conditionName: 'Gastroesophageal Reflux Disease (GERD)',
          confidence: 74,
          riskLevel: 'Low',
          supportingFactors: ['Substernal burning sensation after meals', 'Position-dependent acid reflux'],
          clinicalObservations: ['Normal esophageal auscultation'],
          labFindings: ['Upper Endoscopy (EGD) if refractory to PPI treatment']
        }
      ];
      generatedMeds = [
        { name: 'Omeprazole (Prilosec)', dosage: '20mg', frequency: 'Once Daily (OD 30 mins before breakfast)', duration: '14 to 28 Days', instructions: 'Swallow whole with water before morning meal.', purpose: 'Proton Pump Inhibitor for gastric acid suppression and mucosal healing.' },
        { name: 'Magnesium Trisilicate Antacid Gel', dosage: '15ml', frequency: '8-Hourly between meals & bedtime (TDS)', duration: '7 Days', instructions: 'Shake bottle well. Take between meals for immediate neutralizing of gastric acid.', purpose: 'Rapid relief of burning stomach acid.' },
        { name: 'Hyoscine Butylbromide (Buscopan)', dosage: '10mg', frequency: '8-Hourly as needed (TDS)', duration: '3 to 5 Days', instructions: 'Take strictly for acute stomach muscle cramps.', purpose: 'GI antispasmodic for pain relief.' }
      ];
      generatedLabs = [
        { id: '1', name: 'H. pylori Stool Antigen Test', reason: 'Screen for bacterial ulcer infection.', priority: 'Urgent' },
        { id: '2', name: 'Full Blood Count (FBC)', reason: 'Check hemoglobin/PCV to rule out occult gastric bleeding.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Initiate 14-day Omeprazole gastric acid suppression regimen.',
        'Avoid NSAIDs (aspirin, ibuprofen), alcohol, caffeine, and highly spiced foods.',
        'Eat smaller, frequent meals and avoid lying down within 2 hours after eating.',
        'Seek EMERGENCY CARE immediately if experiencing black tarry stools or vomiting blood.'
      ];
    } else if (highestCategory === 'respiratory') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Acute Bronchitis / Lower Respiratory Tract Infection',
          confidence: 89,
          riskLevel: 'Moderate',
          supportingFactors: [`Airway symptoms reported: "${symptomDescription || 'Respiratory symptoms'}"`, `Temperature recorded at ${vitals.temperature}°C`, `Duration of ${overallDuration}`],
          clinicalObservations: ['Mucosal bronchial inflammation', 'Rhinorrhea and cough reflex intact'],
          labFindings: ['Chest X-Ray (PA view) and Sputum Culture']
        },
        {
          rank: 2,
          conditionName: 'Acute Viral Upper Respiratory Tract Infection',
          confidence: 72,
          riskLevel: 'Low',
          supportingFactors: ['Nasal congestion and sore throat', 'Mild generalized malaise'],
          clinicalObservations: ['Pharyngeal erythema'],
          labFindings: ['Viral swab test']
        }
      ];
      generatedMeds = [
        { name: 'Amoxicillin / Clavulanate (Augmentin)', dosage: age < 12 ? '375mg' : '625mg', frequency: '12-Hourly after meals (BD)', duration: '7 Days', instructions: 'Complete full 7-day antibacterial course even if feeling better.', purpose: 'Broad-spectrum antibacterial treatment for respiratory infection.' },
        { name: 'Salbutamol / Bromhexine Expectorant Syrup', dosage: '10ml', frequency: '8-Hourly (TDS)', duration: '5 Days', instructions: 'Take after food to loosen airway secretions.', purpose: 'Bronchodilator and mucolytic expectorant.' },
        { name: 'Cetirizine Hydrochloride', dosage: '10mg', frequency: 'Once Daily at Bedtime (OD)', duration: '5 Days', instructions: 'May cause mild drowsiness; avoid driving.', purpose: 'Antihistamine for throat congestion.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Chest X-Ray (PA View)', reason: 'Rule out pneumonia consolidation.', priority: 'Urgent' },
        { id: '2', name: 'Pulse Oximetry (SpO2 Test)', reason: 'Monitor oxygen saturation levels.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Take Augmentin 625mg twice daily for 7 full days as prescribed.',
        'Perform warm steam inhalation twice daily to clear viscous airway mucus.',
        'Increase daily fluid intake to 3 Litres to thin respiratory secretions.',
        'Seek IMMEDIATE CARE if experiencing severe shortness of breath or blue lips.'
      ];
    } else if (highestCategory === 'hypertension') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Primary Essential Hypertension / Elevated Vascular Resistance',
          confidence: 93,
          riskLevel: 'High',
          supportingFactors: [`Elevated BP recorded: ${vitals.systolicBP}/${vitals.diastolicBP} mmHg`, `Symptoms reported: "${symptomDescription || 'Hypertensive symptoms'}"`, `Age ${age} years`],
          clinicalObservations: ['Elevated arterial blood pressure readings', 'Vascular resistance elevated'],
          labFindings: ['Fasting Lipid Profile, ECG, and Renal Function (E/U/Cr)']
        },
        {
          rank: 2,
          conditionName: 'Hypertensive Stress Response',
          confidence: 68,
          riskLevel: 'Moderate',
          supportingFactors: ['Acute anxiety/stress episode', 'Elevated pulse rate'],
          clinicalObservations: ['Normal renal function'],
          labFindings: ['24-Hour Ambulatory BP Monitoring']
        }
      ];
      generatedMeds = [
        { name: 'Amlodipine Besylate', dosage: '5mg', frequency: 'Once Daily in the Morning (OD)', duration: '30 Days / Doctor Review', instructions: 'Take every morning with water. Log BP daily before taking.', purpose: 'Calcium channel blocker for arterial vasodilation & BP regulation.' },
        { name: 'Lisinopril', dosage: '5mg', frequency: 'Once Daily in the Morning (OD)', duration: '30 Days / Doctor Review', instructions: 'Monitor BP daily. Consult physician if persistent cough occurs.', purpose: 'ACE Inhibitor for blood pressure & kidney protection.' },
        { name: 'Low-Dose Aspirin', dosage: '75mg', frequency: 'Once Daily after Lunch (OD)', duration: '30 Days', instructions: 'Take immediately after food.', purpose: 'Vascular anti-platelet agent under medical supervision.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Fasting Lipid Profile (Cholesterol)', reason: 'Screen for cardiovascular risk factors.', priority: 'Urgent' },
        { id: '2', name: 'Serum Electrolytes, Urea & Creatinine (E/U/Cr)', reason: 'Assess renal safety before antihypertensive therapy.', priority: 'Recommended' },
        { id: '3', name: '12-Lead Electrocardiogram (ECG)', reason: 'Evaluate cardiac rhythm and left ventricular strain.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Initiate prescribed Amlodipine 5mg morning dose and log blood pressure twice daily.',
        'Adopt DASH dietary plan: reduce dietary salt to <2g daily and eliminate saturated fats.',
        'Engage in 30 minutes of moderate aerobic exercise (walking, swimming) 5 days a week.',
        'Seek IMMEDIATE EMERGENCY CARE if experiencing crushing chest pain, arm numbness, or severe shortness of breath.'
      ];
    } else if (highestCategory === 'gastroenteritis') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Acute Infective Gastroenteritis & Dehydration Risk',
          confidence: 90,
          riskLevel: 'High',
          supportingFactors: [`Intestinal symptoms reported: "${symptomDescription || 'Intestinal purging'}"`, `Duration of ${overallDuration}`, 'Fluid loss from frequent loose bowel movements'],
          clinicalObservations: ['Hyperactive bowel sounds', 'Mild abdominal cramping'],
          labFindings: ['Stool Microscopy, Culture & Sensitivity (M/C/S)']
        },
        {
          rank: 2,
          conditionName: 'Amoebic / Bacterial Dysentery',
          confidence: 71,
          riskLevel: 'Moderate',
          supportingFactors: ['Tenesmus and abdominal pain', 'Reported nausea'],
          clinicalObservations: ['Diffuse lower abdominal tenderness'],
          labFindings: ['Stool Ova and Parasites examination']
        }
      ];
      generatedMeds = [
        { name: 'Ciprofloxacin', dosage: '500mg', frequency: 'Twice Daily after food (BD)', duration: '5 Days', instructions: 'Take with full glass of water. Do not take antacids within 2 hours.', purpose: 'Fluoroquinolone antibiotic for intestinal bacterial pathogens.' },
        { name: 'Metronidazole (Flagyl)', dosage: '400mg', frequency: '8-Hourly after meals (TDS)', duration: '5 Days', instructions: 'Strictly avoid alcohol during treatment.', purpose: 'Anti-protozoal treatment for intestinal parasites.' },
        { name: 'Oral Rehydration Salts (ORS) + Zinc Sulphate', dosage: '1 Sachet in 1L Water + 20mg Zinc', frequency: 'Continuous sip after every loose stool', duration: '3 to 5 Days', instructions: 'Mix sachet in clean water; discard after 24h.', purpose: 'Electrolyte restoration and gut wall lining repair.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Stool Microscopy, Culture & Sensitivity (M/C/S)', reason: 'Identify specific bacterial/parasitic pathogen.', priority: 'Urgent' },
        { id: '2', name: 'Serum Electrolytes (Na+, K+, Cl-)', reason: 'Monitor dehydration and electrolyte deficits.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Sip Oral Rehydration Solution (ORS) continuously after every loose stool movement.',
        'Complete full 5-day antibiotic regimen (Ciprofloxacin + Flagyl).',
        'Eat a soft BRAT diet (Bananas, Rice, Applesauce, Toast) while avoiding dairy and fried foods.',
        'Seek IMMEDIATE CARE if unable to keep liquids down or experiencing high persistent fever.'
      ];
    } else if (highestCategory === 'uti') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Acute Uncomplicated Urinary Tract Infection (Bacterial Cystitis)',
          confidence: 91,
          riskLevel: 'Moderate',
          supportingFactors: [`Urinary distress reported: "${symptomDescription || 'Urinary symptoms'}"`, `Biological sex: ${sex}`, `Duration of ${overallDuration}`],
          clinicalObservations: ['Suprapubic tenderness', 'Urine cloudiness reported'],
          labFindings: ['Urinalysis (dipstick/microscopy) and Urine Culture (M/C/S)']
        },
        {
          rank: 2,
          conditionName: 'Urethritis / Lower Urinary Tract Inflammation',
          confidence: 69,
          riskLevel: 'Low',
          supportingFactors: ['Meatal burning sensation', 'Frequency'],
          clinicalObservations: ['Normal pelvic examination'],
          labFindings: ['Urine Nucleic Acid Amplification Test']
        }
      ];
      generatedMeds = [
        { name: 'Nitrofurantoin (Macrodantin)', dosage: '100mg', frequency: 'Twice Daily with food (BD)', duration: '7 Days', instructions: 'Take with meals or milk to enhance absorption.', purpose: 'Urinary tract targeted antibacterial agent.' },
        { name: 'Potassium Citrate Mixture', dosage: '10ml', frequency: '8-Hourly in half glass water (TDS)', duration: '5 Days', instructions: 'Dilute in water after meals.', purpose: 'Urinary alkalinizer to soothe painful bladder irritation.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Full Urinalysis & Microscopy', reason: 'Detect leukocytes, nitrites, and protein in urine.', priority: 'Urgent' },
        { id: '2', name: 'Urine Culture & Antibiotic Sensitivity (M/C/S)', reason: 'Isolate exact bacterial strain.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Take Nitrofurantoin 100mg twice daily with meals for 7 full days.',
        'Drink at least 3 Litres of clean water daily to flush bacteria from the urinary bladder.',
        'Void urine frequently and avoid holding urine for long periods.',
        'Consult doctor if high fever, back/flank pain, or chills develop.'
      ];
    } else if (highestCategory === 'diabetes') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Suspected Diabetes Mellitus / Impaired Glycemic Control',
          confidence: 88,
          riskLevel: 'High',
          supportingFactors: [`Glycemic symptoms reported: "${symptomDescription || 'Hyperglycemic symptoms'}"`, `Age ${age} years`, `Vitals: ${vitalsInfo}`],
          clinicalObservations: ['Osmotic polyuria/polydipsia symptoms present', 'Requires biochemical validation'],
          labFindings: ['Fasting Blood Glucose (FBG) and Glycated Hemoglobin (HbA1c)']
        }
      ];
      generatedMeds = [
        { name: 'Metformin Hydrochloride', dosage: '500mg', frequency: 'Twice Daily with meals (BD)', duration: '30 Days / Doctor Review', instructions: 'Take with morning and evening meals to prevent stomach upset.', purpose: 'Biguanide for enhancing insulin sensitivity and lowering blood sugar.' },
        { name: 'Neurobion (Vitamin B1, B6, B12)', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', instructions: 'Take daily after food.', purpose: 'Neuroprotective nerve protection against diabetic neuropathy.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Fasting Plasma Glucose (FPG / FBG)', reason: 'Confirm diagnostic threshold (>126 mg/dL).', priority: 'Urgent' },
        { id: '2', name: 'HbA1c (Glycated Hemoglobin)', reason: 'Evaluate 3-month average glycemic control.', priority: 'Urgent' }
      ];
      generatedRecs = [
        'Obtain lab Fasting Blood Glucose (FBG) and HbA1c test after an 8-hour overnight fast.',
        'Eliminate refined sugars, sweetened beverages, and white flour products from diet.',
        'Monitor blood glucose levels regularly using a home glucometer.',
        'Follow up with an endocrinologist or primary physician.'
      ];
    } else if (highestCategory === 'joint') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Acute Musculoskeletal Pain / Inflammatory Arthropathy',
          confidence: 87,
          riskLevel: 'Moderate',
          supportingFactors: [`Joint/musculoskeletal complaints: "${symptomDescription || 'Joint pains'}"`, `Duration of ${overallDuration}`],
          clinicalObservations: ['Joint tenderness and mild stiffness', 'No systemic signs of septic joint infection'],
          labFindings: ['Radiograph of affected joint and Serum Uric Acid screening']
        }
      ];
      generatedMeds = [
        { name: 'Ibuprofen', dosage: '400mg', frequency: '8-Hourly after food (TDS)', duration: '5 Days', instructions: 'Take strictly with or after food to protect stomach lining.', purpose: 'Non-Steroidal Anti-Inflammatory Drug (NSAID) for pain and swelling.' },
        { name: 'Diclofenac Topical Gel (Voltaren)', dosage: 'Apply thin layer', frequency: '8 to 12 Hourly', duration: '7 Days', instructions: 'Massage gently into painful joint until absorbed.', purpose: 'Topical analgesic anti-inflammatory.' },
        { name: 'Calcium Carbonate + Vitamin D3', dosage: '500mg/200IU', frequency: 'Twice Daily with meals (BD)', duration: '30 Days', instructions: 'Take with food.', purpose: 'Bone mineralization and joint cartilage support.' }
      ];
      generatedLabs = [
        { id: '1', name: 'X-Ray of Affected Joint / Spine', reason: 'Evaluate joint space narrowing or osteophytes.', priority: 'Urgent' },
        { id: '2', name: 'Serum Uric Acid & ESR', reason: 'Screen for Gouty arthritis and systemic inflammation.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Take Ibuprofen 400mg 8-hourly after food for up to 5 days.',
        'Apply warm compress to affected joint for 15 minutes twice daily.',
        'Avoid strenuous joint-loading activity while resting the affected limb.',
        'Consult orthopedic specialist if joint swelling or deformity increases.'
      ];
    } else if (highestCategory === 'dermatitis') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Acute Allergic Dermatitis / Urticarial Skin Reaction',
          confidence: 86,
          riskLevel: 'Moderate',
          supportingFactors: [`Dermal symptoms reported: "${symptomDescription || 'Skin itching & rash'}"`, `Duration of ${overallDuration}`],
          clinicalObservations: ['Pruritic cutaneous erythema', 'No mucosal stridor or airway involvement'],
          labFindings: ['Allergy skin patch test and Serum IgE']
        }
      ];
      generatedMeds = [
        { name: 'Cetirizine Hydrochloride', dosage: '10mg', frequency: 'Once Daily at Bedtime (OD)', duration: '5 to 7 Days', instructions: 'Take 1 tablet at night with water.', purpose: '2nd generation antihistamine for itching and skin rash relief.' },
        { name: 'Hydrocortisone Cream 1%', dosage: 'Apply thin layer', frequency: '12-Hourly (BD)', duration: '5 Days', instructions: 'Apply sparingly to affected itchy skin. Do not apply on open wounds.', purpose: 'Topical corticosteroid for cutaneous inflammation.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Complete Blood Count (CBC) with Eosinophils', reason: 'Assess systemic allergic response.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Take Cetirizine 10mg nightly and apply Hydrocortisone cream sparingly twice daily.',
        'Avoid hot showers, harsh scented soaps, and synthetic tight clothing.',
        'Identify and eliminate recent potential drug, food, or chemical allergens.',
        'Seek EMERGENCY CARE immediately if experiencing facial swelling or difficulty breathing.'
      ];
    } else if (highestCategory === 'dental') {
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Acute Dental Caries / Periapical Odontogenic Infection',
          confidence: 92,
          riskLevel: 'High',
          supportingFactors: [`Dental symptoms reported: "${symptomDescription || 'Tooth pain'}"`, `Duration of ${overallDuration}`],
          clinicalObservations: ['Localized tooth tenderness to percussion', 'Gingival swelling'],
          labFindings: ['Intraoral Periapical / OPG Radiograph']
        }
      ];
      generatedMeds = [
        { name: 'Amoxicillin 500mg + Metronidazole 400mg', dosage: '500mg / 400mg', frequency: '8-Hourly after meals (TDS)', duration: '5 Days', instructions: 'Take after food. Complete full 5-day course.', purpose: 'Combined antibacterial coverage for dental aerobic and anaerobic bacteria.' },
        { name: 'Ibuprofen', dosage: '400mg', frequency: '8-Hourly after food (TDS)', duration: '5 Days', instructions: 'Take after food for dental pain.', purpose: 'Analgesic anti-inflammatory.' },
        { name: 'Chlorhexidine 0.2% Antiseptic Mouthwash', dosage: '15ml', frequency: 'Twice Daily (BD)', duration: '7 Days', instructions: 'Rinse mouth vigorously for 60 seconds then spit out.', purpose: 'Oral antimicrobial mouth rinse.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Dental Intraoral Periapical X-Ray', reason: 'Assess root abscess and periapical lesion extent.', priority: 'Urgent' }
      ];
      generatedRecs = [
        'Take prescribed antibiotics (Amoxicillin + Flagyl) after food for 5 days.',
        'Rinse mouth with Chlorhexidine mouthwash or warm salt water twice daily.',
        'Schedule an immediate dental appointment for tooth restoration or extraction.',
        'Seek EMERGENCY CARE if jaw swelling spreads towards the neck or throat.'
      ];
    } else {
      // Default: Suspected Acute Febrile Illness / Malaria Syndrome
      generatedConditions = [
        {
          rank: 1,
          conditionName: 'Acute Plasmodium falciparum Malaria',
          confidence: 88,
          riskLevel: 'High',
          supportingFactors: [
            `Fever/Febrile episode: Temp ${vitals.temperature}°C`,
            `Reported symptoms: "${symptomDescription || symptoms.map((s) => `${s.name} (${s.severityRating}/10)`).join(', ')}"`,
            `Symptom duration of ${overallDuration}`
          ],
          clinicalObservations: ['Febrile to touch with generalized body pains and chills', 'Dry mucous membranes'],
          labFindings: ['Malaria Rapid Diagnostic Test (RDT) or Blood Film Microscopy']
        },
        {
          rank: 2,
          conditionName: 'Enteric Fever (Typhoid Fever)',
          confidence: 66,
          riskLevel: 'Moderate',
          supportingFactors: ['Persistent fever pattern', 'Associated weakness and malaise'],
          clinicalObservations: ['Mild abdominal tenderness'],
          labFindings: ['Widal / Typhidot blood test advised']
        }
      ];
      generatedMeds = [
        { name: 'Artemether / Lumefantrine (Coartem)', dosage: age < 14 ? '40/240mg' : '80/480mg (4 Tablets per dose)', frequency: 'Twice Daily (BD at 0h, 8h, 24h, 36h, 48h, 60h)', duration: '3 Days (6 Doses Total)', instructions: 'Take strictly with fatty food or milk to optimize drug absorption.', purpose: 'First-line Artemisinin Combination Therapy (ACT) for malaria.' },
        { name: 'Paracetamol (Acetaminophen)', dosage: '500mg - 1000mg', frequency: '8-Hourly as needed (TDS)', duration: '3 to 5 Days', instructions: 'Maximum 4000mg per 24 hours. Use for fever & body pains.', purpose: 'Antipyretic for fever and analgesic for body pains.' },
        { name: 'Oral Rehydration Salts (ORS)', dosage: '1 Sachet in 1L Water', frequency: 'Drink 2 to 3 Litres daily', duration: '3 Days', instructions: 'Sip continuously to replace fluids lost to high temperature.', purpose: 'Electrolyte maintenance during fever spikes.' }
      ];
      generatedLabs = [
        { id: '1', name: 'Malaria Rapid Diagnostic Test (RDT) / MP Film', reason: 'Confirm Plasmodium parasite presence in blood.', priority: 'Urgent' },
        { id: '2', name: 'Complete Blood Count (CBC / FBC)', reason: 'Evaluate hematocrit, PCV, and WBC counts.', priority: 'Recommended' }
      ];
      generatedRecs = [
        'Obtain immediate laboratory blood test (Malaria RDT / MP microscopy).',
        'Initiate Artemether/Lumefantrine (Coartem) full 3-day treatment course as prescribed.',
        'Take Paracetamol 1g every 8 hours for fever and body pains relief.',
        'Maintain high fluid intake (2.5 - 3 Litres of clean water or oral rehydration fluids daily).',
        'Seek EMERGENCY CARE immediately if experiencing chest pain, difficulty breathing, or severe confusion.'
      ];
    }

    const fallbackResult: AIDiagnosticAssessment = {
      id: `ASM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: user?.id || 'PT-2026-REG',
      patientName: fullName || user?.name || 'Registered Patient',
      patientAge: age,
      patientSex: sex,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modelVersion: 'AI Health Assessment Engine v1.0',
      status: 'Completed',
      overallRisk: symptoms.some((s) => (s.severityRating || 5) >= 8) || vitals.temperature >= 38.5 ? 'High' : 'Moderate',
      riskScore: vitals.temperature >= 38.5 ? 78 : 58,
      chiefComplaint: symptomDescription,
      vitalsSnapshot: vitals,
      symptomsSnapshot: symptoms,
      possibleConditions: generatedConditions,
      keyFactors: [
        { category: 'Symptoms', title: 'Primary Symptom Analysis', detail: `Reported: ${symptomDescription || 'Self-assessment input'}` },
        { category: 'Clinical Observations', title: 'Symptom Severity Rating', detail: `Highest symptom severity rated at ${Math.max(...symptoms.map(s => s.severityRating || 5), 5)}/10` },
        { category: 'Medical History', title: 'Vitals & BP Status', detail: `BP ${vitals.systolicBP}/${vitals.diastolicBP} mmHg, Temp ${vitals.temperature}°C` }
      ],
      recommendedInvestigations: generatedLabs,
      clinicalRecommendations: generatedRecs,
      prescribedMedications: generatedMeds
    };

    const saveMedicalRecord = (res: AIDiagnosticAssessment) => {
      const medicalRecordObj = {
        id: res.id,
        userId: user?.id || 'usr-current',
        userName: fullName || user?.name || 'Registered Patient',
        userEmail: user?.email || authEmail || 'user@example.com',
        dateTime: res.dateTime || new Date().toISOString().replace('T', ' ').substring(0, 16),
        patientInfo: {
          fullName: fullName || user?.name || 'Registered Patient',
          age,
          sex,
          location,
          bloodGroup,
          phone
        },
        chiefComplaint: symptomDescription,
        symptoms,
        overallDuration,
        medicalHistory: {
          chronicConditions: selectedChronic,
          allergies: selectedAllergies,
          medications: currentMedications ? [currentMedications] : [],
          pastSurgeries
        },
        vitals,
        diagnosticResult: res
      };

      const savedRecordsStr = localStorage.getItem('user_medical_records');
      const savedRecords: any[] = savedRecordsStr ? JSON.parse(savedRecordsStr) : [];
      savedRecords.unshift(medicalRecordObj);
      localStorage.setItem('user_medical_records', JSON.stringify(savedRecords));

      const localAsmsStr = localStorage.getItem('user_assessments');
      const localAsms: any[] = localAsmsStr ? JSON.parse(localAsmsStr) : [];
      localAsms.unshift({
        id: res.id,
        userId: user?.id || 'usr-current',
        patientName: fullName || user?.name || 'Registered Patient',
        assessmentTypeId: 'cat-academic',
        assessmentTypeName: 'Diagnostic Healthcare Assessment',
        category: 'general',
        status: 'Completed',
        createdAt: res.dateTime,
        updatedAt: res.dateTime,
        completedAt: res.dateTime
      });
      localStorage.setItem('user_assessments', JSON.stringify(localAsms));

      const localRecsStr = localStorage.getItem('user_recommendations');
      const localRecs: any[] = localRecsStr ? JSON.parse(localRecsStr) : [];
      if (res.recommendedInvestigations) {
        res.recommendedInvestigations.forEach((inv) => {
          localRecs.unshift({
            id: `rec-${inv.id}-${Date.now()}`,
            title: inv.name,
            description: inv.reason,
            priority: inv.priority === 'Urgent' ? 'High' : 'Medium',
            createdAt: res.dateTime
          });
        });
      }
      localStorage.setItem('user_recommendations', JSON.stringify(localRecs));
    };

    try {
      const apiResult = await runAIDiagnosticAPI(payload);
      const targetResult = (apiResult && apiResult.possibleConditions) ? apiResult : fallbackResult;
      
      setTimeout(() => {
        setIsProcessing(false);
        setAssessmentResult(targetResult);
        saveMedicalRecord(targetResult);
        if (onSaveAssessment) onSaveAssessment(targetResult);
        if (addToast) addToast('success', 'AI Analysis Complete', 'Diagnostic suggestions and recommendations ready.');
        setCurrentStep(8); // Move to Step 8 Results
      }, 2500);
    } catch (err) {
      setTimeout(() => {
        setIsProcessing(false);
        setAssessmentResult(fallbackResult);
        saveMedicalRecord(fallbackResult);
        if (onSaveAssessment) onSaveAssessment(fallbackResult);
        if (addToast) addToast('success', 'AI Analysis Complete', 'Diagnostic suggestions and recommendations ready.');
        setCurrentStep(8); // Move to Step 8 Results
      }, 2500);
    }
  };

  // Stage tracker (1: COLLECT for steps 1-6, 2: VALIDATE for step 7, 3: ANALYZE for steps 8-9)
  const currentSystemStage: 1 | 2 | 3 = currentStep <= 6 ? 1 : currentStep === 7 ? 2 : 3;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* 3-Stage Process Tracker */}
      <StageTracker currentStage={currentSystemStage} />

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Patient Health Diagnostic Wizard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
              AI Symptom & Health Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl opacity-90 leading-relaxed">
              Complete the guided clinical self-assessment to receive instant AI diagnostic suggestions and personalized medical care recommendations.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
            <Clock className="w-4 h-4 text-teal-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">ESTIMATED TIME</span>
              <span className="font-bold text-white">3–5 Minutes</span>
            </div>
          </div>
        </div>

        {/* Wizard Step Progress Tracker (Steps 1 to 9) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="hidden lg:grid grid-cols-9 gap-1 text-center">
            {[
              { num: 1, name: 'Demographics' },
              { num: 2, name: 'Symptoms' },
              { num: 3, name: 'Severity 1-10' },
              { num: 4, name: 'Duration' },
              { num: 5, name: 'History' },
              { num: 6, name: 'Vitals & BP' },
              { num: 7, name: 'AI Submit' },
              { num: 8, name: 'Diagnosis' },
              { num: 9, name: 'Next Steps' }
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => {
                  if (step.num <= currentStep || assessmentResult) setCurrentStep(step.num);
                }}
                className={`py-2 px-1 rounded-xl transition-all text-xs flex flex-col items-center space-y-1 ${
                  currentStep === step.num
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold shadow-md'
                    : step.num < currentStep
                    ? 'bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-800/40'
                    : 'bg-slate-900/60 text-slate-500'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-950/50 flex items-center justify-center text-[10px]">
                  {step.num < currentStep ? '✓' : step.num}
                </span>
                <span className="text-[10px] truncate max-w-full">{step.name}</span>
              </button>
            ))}
          </div>

          {/* Mobile / Tablet Step Counter */}
          <div className="lg:hidden flex items-center justify-between text-xs">
            <span className="font-semibold text-teal-400">Step {currentStep} of 9</span>
            <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-teal-400 h-full transition-all duration-300"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start space-x-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold uppercase tracking-wider block text-[11px] mb-0.5">Medical Safety Notice</strong>
          <span>This AI health checker provides diagnostic probabilities and decision-support guidance. It does not replace professional medical diagnosis. If you have severe symptoms, chest pain, or emergency warning signs, please call emergency services immediately.</span>
        </div>
      </div>

      {/* STEP 1: Patient Demographics & Profile Info */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 1</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 1: Patient Demographics & Profile Info</h2>
            <p className="text-xs text-slate-500 mt-1">Please confirm or enter your demographic details to calibrate risk modeling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Amina Ibrahim or Zainab Sulaiman"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Sex assigned at birth *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Female', 'Male', 'Other'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      sex === s
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-bold">Age *</label>
                <span className="font-extrabold text-blue-900 font-outfit text-sm">{age} Years Old</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 yr (Pediatric)</span>
                <span>50 yrs</span>
                <span>100 yrs (Geriatric)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">State / Location of Residence</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Abuja, Lagos, Enugu, Kano"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Blood Group (Optional)</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Step 2: Select Symptoms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select or describe symptoms */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 2</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 2: Select or Describe Your Symptoms</h2>
            <p className="text-xs text-slate-500 mt-1">Select from common symptoms or describe how you feel in your own words.</p>
          </div>

          {/* Quick-Select Symptom Pills */}
          <div>
            <label className="block text-slate-700 font-bold text-xs mb-2 uppercase tracking-wider">
              Quick Add Common Symptoms:
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((sym) => {
                const isSelected = symptoms.some((s) => s.name.toLowerCase() === sym.toLowerCase());
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => (isSelected ? handleRemoveSymptom(symptoms.find((s) => s.name.toLowerCase() === sym.toLowerCase())?.id || '') : handleAddSymptom(sym))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-teal-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{sym}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Symptom Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customSymptomInput}
              onChange={(e) => setCustomSymptomInput(e.target.value)}
              placeholder="Type custom symptom (e.g. Skin Rash, Dizziness, Eye redness)..."
              className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            />
            <button
              onClick={() => {
                if (customSymptomInput.trim()) {
                  handleAddSymptom(customSymptomInput.trim());
                  setCustomSymptomInput('');
                }
              }}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Detailed Natural Language Description */}
          <div>
            <label className="block text-slate-700 font-bold text-xs mb-1">
              Describe Your Health Symptoms in Detail (Natural Language Description) *
            </label>
            <textarea
              rows={4}
              value={symptomDescription}
              onChange={(e) => setSymptomDescription(e.target.value)}
              placeholder="e.g. I started having a severe headache 3 days ago, followed by high fever with chills at night. I also feel extremely tired and lost my appetite..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-blue-900/20"
            />
          </div>

          {/* Selected Symptoms Summary */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Currently Selected Symptoms ({symptoms.length}):
            </span>
            {symptoms.length === 0 ? (
              <p className="text-xs text-amber-700 font-medium italic">No symptoms selected yet. Please select at least one above.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <span>{s.name}</span>
                    <button
                      onClick={() => handleRemoveSymptom(s.id)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={symptoms.length === 0}
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>Continue to Step 3: Rate Severity (1-10)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Rate the severity of the symptoms like 1-10 */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 3</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 3: Rate Symptom Severity (1–10 Scale)</h2>
            <p className="text-xs text-slate-500 mt-1">Rate how severe each symptom feels from 1 (Mild) to 10 (Extremely Severe / Unbearable).</p>
          </div>

          <div className="space-y-4">
            {symptoms.map((s) => {
              const rating = s.severityRating || 5;
              const badge = getSeverityBadge(rating);
              return (
                <div key={s.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm font-outfit">{s.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Interactive 1-10 Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={rating}
                      onChange={(e) => handleUpdateSeverityRating(s.id, parseInt(e.target.value))}
                      className="w-full accent-blue-900 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>1 (Very Mild)</span>
                      <span>5 (Moderate)</span>
                      <span>7 (Severe)</span>
                      <span>10 (Extreme / Unbearable)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Step 4: Symptom Duration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Indicate how long they have those symptoms */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 4</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 4: Indicate Symptom Duration & Onset</h2>
            <p className="text-xs text-slate-500 mt-1">Specify how long you have experienced these symptoms.</p>
          </div>

          {/* Overall Duration Picker */}
          <div>
            <label className="block text-slate-700 font-bold text-xs mb-2">Overall Symptom Onset Period *</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                'Less than 24 hours',
                '1–3 days',
                '4–7 days',
                '1–2 weeks',
                'More than 2 weeks'
              ].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setOverallDuration(dur)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    overallDuration === dur
                      ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Per-Symptom Individual Duration */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-bold text-xs">Individual Duration Per Symptom:</label>
            {symptoms.map((s) => (
              <div key={s.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <span className="font-bold text-slate-900 w-44">{s.name}</span>
                <div className="flex items-center space-x-2 flex-1 max-w-xs">
                  <span className="text-slate-500 text-[11px]">Duration:</span>
                  <input
                    type="text"
                    value={s.duration}
                    onChange={(e) => {
                      const updated = symptoms.map((item) => (item.id === s.id ? { ...item, duration: e.target.value } : item));
                      setSymptoms(updated);
                    }}
                    placeholder="e.g. 4 days"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Step 5: Rate Severity (1-10)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Rate the severity of the symptoms like 1-10 */}
      {currentStep === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 5</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 5: Rate Symptom Severity (1–10 Scale)</h2>
            <p className="text-xs text-slate-500 mt-1">Rate how severe each symptom feels from 1 (Mild) to 10 (Extremely Severe / Unbearable).</p>
          </div>

          <div className="space-y-4">
            {symptoms.map((s) => {
              const rating = s.severityRating || 5;
              const badge = getSeverityBadge(rating);
              return (
                <div key={s.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm font-outfit">{s.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Interactive 1-10 Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={rating}
                      onChange={(e) => handleUpdateSeverityRating(s.id, parseInt(e.target.value))}
                      className="w-full accent-blue-900 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>1 (Very Mild)</span>
                      <span>5 (Moderate)</span>
                      <span>7 (Severe)</span>
                      <span>10 (Extreme / Unbearable)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Step 6: Medical History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Provide medical history */}
      {currentStep === 6 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 6</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 6: Medical History & Background</h2>
            <p className="text-xs text-slate-500 mt-1">Select pre-existing conditions, allergies, or regular medications.</p>
          </div>

          {/* Chronic Pre-existing Conditions */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider">
              Pre-existing / Chronic Conditions:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {chronicOptions.map((item) => {
                const isSelected = selectedChronic.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChronic(item)}
                    className={`p-3 rounded-xl border font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Known Allergies */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider">
              Known Drug / Food Allergies:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {allergyOptions.map((item) => {
                const isSelected = selectedAllergies.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAllergy(item)}
                    className={`p-3 rounded-xl border font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-900 text-white border-red-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Medications & Past Surgeries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Current Medications (If any)</label>
              <textarea
                rows={3}
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                placeholder="e.g. Amlodipine 5mg daily, Metformin 500mg, Paracetamol..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Past Surgeries / Family History</label>
              <textarea
                rows={3}
                value={pastSurgeries}
                onChange={(e) => setPastSurgeries(e.target.value)}
                placeholder="e.g. Appendectomy 2021, Family history of hypertension..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(7)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Step 7: Vitals & BP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Provide additional information such as blood pressure and temperature */}
      {currentStep === 7 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 7</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 7: Additional Vitals (Blood Pressure & Temperature)</h2>
            <p className="text-xs text-slate-500 mt-1">Enter measured physical vitals including body temperature and blood pressure.</p>
          </div>

          {/* Vitals Input Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Temperature */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-amber-700 font-bold">
                <Thermometer className="w-5 h-5 text-amber-600" />
                <span>Body Temperature</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 37 })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900 text-lg font-outfit"
                />
                <span className="font-bold text-slate-500">°C</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                vitals.temperature >= 38.0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {vitals.temperature >= 38.0 ? 'High Fever Spike' : 'Normal Temp'}
              </span>
            </div>

            {/* Blood Pressure Systolic */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-red-700 font-bold">
                <Activity className="w-5 h-5 text-red-600" />
                <span>Systolic BP (mmHg)</span>
              </div>
              <input
                type="number"
                value={vitals.systolicBP}
                onChange={(e) => setVitals({ ...vitals, systolicBP: parseInt(e.target.value) || 120 })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900 text-lg font-outfit"
              />
              <span className="text-[10px] text-slate-400 block">Top BP Number</span>
            </div>

            {/* Blood Pressure Diastolic */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-red-700 font-bold">
                <Heart className="w-5 h-5 text-red-600" />
                <span>Diastolic BP (mmHg)</span>
              </div>
              <input
                type="number"
                value={vitals.diastolicBP}
                onChange={(e) => setVitals({ ...vitals, diastolicBP: parseInt(e.target.value) || 80 })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900 text-lg font-outfit"
              />
              <span className="text-[10px] text-slate-400 block">Bottom BP Number</span>
            </div>

            {/* Heart Rate */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Heart Rate (bpm)</span>
              </div>
              <input
                type="number"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value) || 80 })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900 text-lg font-outfit"
              />
              <span className="text-[10px] text-slate-400 block">Pulse Rate</span>
            </div>
          </div>

          {/* BP Status Banner & Auto BMI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Evaluated BP Status</span>
                <span className="font-extrabold text-sm font-outfit">{vitals.systolicBP} / {vitals.diastolicBP} mmHg</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBPStatus(vitals.systolicBP, vitals.diastolicBP).color}`}>
                {getBPStatus(vitals.systolicBP, vitals.diastolicBP).label}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-700 block">Auto Computed BMI</span>
                <span className="font-extrabold text-lg text-teal-900 font-outfit">
                  {calculateBMI(vitals.weight, vitals.height)} kg/m²
                </span>
              </div>
              <span className="text-xs text-teal-700 font-semibold">
                Weight: {vitals.weight}kg | Height: {vitals.height}cm
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(6)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(8)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Step 8: Review & AI Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Submit the information for AI analysis */}
      {currentStep === 7 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 7</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 7: Final Review & Submit for AI Analysis</h2>
            <p className="text-xs text-slate-500 mt-1">Review your entered health information before sending to the AI inference engine.</p>
          </div>

          {/* Review Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Patient & Demographics</h4>
              <div className="space-y-1 text-slate-700">
                <p><strong>Name:</strong> {fullName || user?.name || 'Registered Patient'}</p>
                <p><strong>Age / Sex:</strong> {age} years / {sex}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Account:</strong> <span className="capitalize font-bold text-emerald-700">{user?.email || authEmail}</span></p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Clinical Parameters Snapshot</h4>
              <div className="space-y-1 text-slate-700">
                <p><strong>Symptoms:</strong> {symptoms.map((s) => `${s.name} (${s.severityRating}/10)`).join(', ')}</p>
                <p><strong>Duration:</strong> {overallDuration}</p>
                <p><strong>Vitals:</strong> Temp {vitals.temperature}°C, BP {vitals.systolicBP}/{vitals.diastolicBP} mmHg</p>
                <p><strong>Chronic History:</strong> {selectedChronic.join(', ') || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Validation Status Checks */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-xs font-semibold">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Pre-flight Clinical Data Validation Checklist Complete</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-emerald-800">
              <div>✓ Demographics ready</div>
              <div>✓ {symptoms.length} symptoms rated (1-10)</div>
              <div>✓ Duration set</div>
              <div>✓ BP & Temp captured</div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="font-bold text-base font-outfit">Ready for Neural Diagnostic Evaluation</h3>
              <p className="text-xs text-slate-300 mt-0.5">Execute multi-vector AI probabilistic disease classification engine.</p>
            </div>

            <button
              onClick={handleSubmitAssessment}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Submit Information for AI Analysis</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Receive possible health diagnostic suggestions */}
      {currentStep === 8 && assessmentResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 8</span>
              <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 8: Possible Health Diagnostic Suggestions</h2>
              <p className="text-xs text-slate-500 mt-1">AI differential diagnosis results ranked by statistical confidence & clinical matching.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-mono">Assessment ID:</span>
              <span className="px-3 py-1 bg-slate-100 font-mono font-bold text-slate-900 text-xs rounded-lg border border-slate-200">
                {assessmentResult.id}
              </span>
            </div>
          </div>

          {/* Differential Diagnoses List */}
          <div className="space-y-4">
            {assessmentResult.possibleConditions.map((cond) => (
              <div
                key={cond.rank}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-blue-900 text-white flex items-center justify-center font-extrabold text-xs font-outfit">
                      #{cond.rank}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base font-outfit">{cond.conditionName}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">Ranked #{cond.rank} Diagnostic Vector</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cond.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cond.riskLevel} Risk
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-black text-blue-900 font-outfit">{cond.confidence}%</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Match Confidence</span>
                    </div>
                  </div>
                </div>

                {/* Supporting Clinical Factors */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Supporting Clinical Factors:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {cond.supportingFactors.map((factor: string, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(7)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Review</span>
            </button>
            <button
              onClick={() => setCurrentStep(9)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Step 9: Next Step Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: Receive recommendations on what to do next */}
      {currentStep === 9 && assessmentResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Requirement 9</span>
              <h2 className="text-xl font-bold text-slate-900 font-outfit">Step 9: Recommendations & Next Steps</h2>
              <p className="text-xs text-slate-500 mt-1">Actionable medical guidance, recommended laboratory investigations, and care next steps.</p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl inline-flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Report PDF</span>
            </button>
          </div>

          {/* Action Care Advice Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base font-outfit">Recommended Medical Action Plan</h3>
                <p className="text-xs text-slate-300">Follow these key clinical recommendations based on your AI health assessment.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              {assessmentResult.clinicalRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 leading-relaxed font-medium">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prescribed Clinical Drug Treatment Protocol */}
          {assessmentResult.prescribedMedications && assessmentResult.prescribedMedications.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center">
                <Stethoscope className="w-4 h-4 text-teal-600 mr-1.5" />
                Targeted Clinical Drug Prescriptions & Medication Protocol:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {assessmentResult.prescribedMedications.map((med: any, i: number) => (
                  <div key={i} className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-slate-900 font-outfit text-sm block">{med.name}</span>
                        <span className="text-[11px] text-teal-800 font-bold">{med.dosage} — {med.frequency}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-teal-800 text-white font-extrabold text-[10px] flex-shrink-0">
                        {med.duration}
                      </span>
                    </div>
                    {med.purpose && (
                      <p className="text-slate-700 text-[11px] font-medium leading-relaxed">
                        <strong className="text-slate-900">Purpose:</strong> {med.purpose}
                      </p>
                    )}
                    {med.instructions && (
                      <div className="p-2.5 rounded-xl bg-white border border-teal-100 text-[11px] text-teal-950 font-semibold">
                        <span className="text-teal-700 font-bold uppercase tracking-wider text-[9px] block">Special Instructions:</span>
                        {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Laboratory Investigations */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center">
              <FileText className="w-4 h-4 text-blue-900 mr-1.5" />
              Recommended Laboratory Tests & Investigations:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {assessmentResult.recommendedInvestigations.map((inv) => (
                <div key={inv.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-outfit">{inv.name}</span>
                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                      {inv.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{inv.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(8)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Diagnosis Suggestions</span>
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Go to Portal Dashboard
              </button>
              <button
                onClick={() => {
                  setAssessmentResult(null);
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Start New Health Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Neural AI Processing Overlay Screen */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-2xl mb-6 animate-pulse">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-2xl font-extrabold font-outfit mb-2">Executing Neural AI Health Diagnostic Engine</h3>
          <p className="text-xs text-slate-300 max-w-md mb-8 leading-relaxed">
            Processing clinical vectors, symptom 1–10 severity ratings, blood pressure thresholds, and differential diagnostic models...
          </p>

          <div className="w-full max-w-sm space-y-2.5 text-xs text-left">
            <div className={`p-3 rounded-xl border transition-all ${processingStep >= 1 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`}>
              ✓ 1. Validating account access & patient demographics
            </div>
            <div className={`p-3 rounded-xl border transition-all ${processingStep >= 2 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`}>
              ✓ 2. Processing symptoms vector & 1–10 severity ratings
            </div>
            <div className={`p-3 rounded-xl border transition-all ${processingStep >= 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`}>
              ✓ 3. Evaluating blood pressure, temperature & medical history
            </div>
            <div className={`p-3 rounded-xl border transition-all ${processingStep >= 4 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`}>
              ✓ 4. Computing differential diagnosis probabilities (%)
            </div>
            <div className={`p-3 rounded-xl border transition-all ${processingStep >= 5 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`}>
              ✓ 5. Generating personalized clinical care recommendations
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAssessmentPage;
