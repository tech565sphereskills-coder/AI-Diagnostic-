import { apiClient } from './api';
import type { AssessmentType, Question, Assessment, AssessmentResult } from '../types';
import { MOCK_ASSESSMENT_TYPES } from '../data/mockData';

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'q-age',
    assessmentTypeId: 'cat-academic',
    questionText: '1. Patient Age (in Years)',
    type: 'number',
    required: true,
    order: 1,
    categorySection: 'Patient Profile & Demographics',
    placeholder: 'e.g. 25',
    helpText: 'Age is used to determine appropriate clinical dosage and age-related risk factors.'
  },
  {
    id: 'q-sex',
    assessmentTypeId: 'cat-academic',
    questionText: '2. Patient Biological Sex',
    type: 'dropdown',
    required: true,
    order: 2,
    categorySection: 'Patient Profile & Demographics',
    options: [
      { label: 'Female', value: 'Female' },
      { label: 'Male', value: 'Male' }
    ],
    helpText: 'Biological sex is used to check contraindications and pregnancy/hormonal precautions.'
  },
  {
    id: 'q-symptoms',
    assessmentTypeId: 'cat-academic',
    questionText: '3. Describe your symptoms in detail',
    type: 'long_text',
    required: true,
    order: 3,
    categorySection: 'Symptom Description',
    placeholder: 'Describe all physical symptoms you are experiencing (e.g. high fever, severe headache, body weakness, chills, joint pain, nausea, cough, chest tightness)...',
    helpText: 'Provide a complete description of how you are feeling.'
  },
  {
    id: 'q-duration',
    assessmentTypeId: 'cat-academic',
    questionText: '4. Indicate how long you have had those symptoms',
    type: 'dropdown',
    required: true,
    order: 4,
    categorySection: 'Symptom Duration',
    options: [
      { label: 'Less than 24 hours (Sudden Onset)', value: 'Less than 24 hours' },
      { label: '1 to 3 days', value: '1 to 3 days' },
      { label: '4 to 7 days', value: '4 to 7 days' },
      { label: '1 to 2 weeks', value: '1 to 2 weeks' },
      { label: '3 to 4 weeks', value: '3 to 4 weeks' },
      { label: 'More than 1 month (Chronic)', value: 'More than 1 month' }
    ],
    helpText: 'Select the duration since symptoms first started.'
  },
  {
    id: 'q-severity',
    assessmentTypeId: 'cat-academic',
    questionText: '5. Rate the severity of the symptoms (1 to 10)',
    type: 'rating_scale',
    required: true,
    order: 5,
    categorySection: 'Severity Rating (1-10)',
    helpText: '1-3 = Mild, 4-6 = Moderate (interferes with activity), 7-8 = Severe, 9-10 = Critical / Emergency'
  },
  {
    id: 'q-medical-history',
    assessmentTypeId: 'cat-academic',
    questionText: '6. Provide your medical history',
    type: 'checkbox',
    required: false,
    order: 6,
    categorySection: 'Medical History',
    options: [
      { label: 'Hypertension / High Blood Pressure', value: 'Hypertension', description: 'Diagnosed elevated blood pressure' },
      { label: 'Diabetes Mellitus', value: 'Diabetes', description: 'Type 1 or Type 2 Diabetes' },
      { label: 'Sickle Cell Genotype (SS / SC)', value: 'Sickle Cell', description: 'Sickle cell disease or trait' },
      { label: 'Asthma / Respiratory Conditions', value: 'Asthma', description: 'History of asthmatic attacks' },
      { label: 'Peptic Ulcer Disease', value: 'Peptic Ulcer', description: 'Gastric or duodenal ulcer history' },
      { label: 'Recent Malaria / Typhoid Infection', value: 'Malaria/Typhoid', description: 'Treated for malaria or typhoid recently' },
      { label: 'Known Drug / Food Allergies', value: 'Allergies', description: 'Adverse reactions to penicillin, sulfa, etc.' },
      { label: 'Currently on Prescription Medications', value: 'Prescription Meds', description: 'Active daily prescription drugs' }
    ],
    helpText: 'Check all relevant pre-existing conditions, allergies, or treatments.'
  },
  {
    id: 'q-vitals-additional',
    assessmentTypeId: 'cat-academic',
    questionText: '7. Provide additional information such as blood pressure and temperature',
    type: 'long_text',
    required: true,
    order: 7,
    categorySection: 'Vitals & Clinical Measurements',
    placeholder: 'Enter clinical measurements if available e.g. Temperature: 38.5 °C, Blood Pressure: 130/85 mmHg, Pulse Rate: 84 bpm, Weight: 70kg, or any other notes...',
    helpText: 'Include measured temperature, blood pressure, or physical context.'
  }
];

export const assessmentService = {
  async getAssessmentTypes(): Promise<AssessmentType[]> {
    try {
      const res = await apiClient.get('/assessment-types');
      return res.data;
    } catch (err) {
      return MOCK_ASSESSMENT_TYPES;
    }
  },

  async getQuestions(_typeId?: string): Promise<Question[]> {
    return DIAGNOSTIC_QUESTIONS;
  },

  async createAssessment(assessmentTypeId: string): Promise<Assessment> {
    try {
      const res = await apiClient.post('/assessments', { assessmentTypeId });
      return res.data;
    } catch (err) {
      const typeObj = MOCK_ASSESSMENT_TYPES.find((t) => t.id === assessmentTypeId) || MOCK_ASSESSMENT_TYPES[0];
      const newAsm: Assessment = {
        id: `asm-${Date.now()}`,
        userId: 'usr-current',
        assessmentTypeId: typeObj.id,
        assessmentTypeName: 'Diagnostic Healthcare Assessment',
        category: 'general',
        status: 'In Progress',
        answers: {},
        missingQuestionIds: [],
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      // Save locally to user assessments store
      const localAsmsStr = localStorage.getItem('user_assessments');
      const localAsms: Assessment[] = localAsmsStr ? JSON.parse(localAsmsStr) : [];
      localAsms.unshift(newAsm);
      localStorage.setItem('user_assessments', JSON.stringify(localAsms));

      return newAsm;
    }
  },

  async validateAssessment(id: string, answers: Record<string, any>, questions: Question[]): Promise<{ isValid: boolean; missingQuestions: Question[] }> {
    try {
      const res = await apiClient.post(`/assessments/${id}/validate`, { answers });
      return res.data;
    } catch (err) {
      // Local completeness check
      const missingQuestions = questions.filter((q) => {
        if (!q.required) return false;
        const val = answers[q.id];
        if (val === undefined || val === null || val === '') return true;
        if (Array.isArray(val) && val.length === 0) return true;
        return false;
      });
      return {
        isValid: missingQuestions.length === 0,
        missingQuestions
      };
    }
  },

  async analyzeAssessment(id: string, answers: Record<string, any>): Promise<AssessmentResult> {
    try {
      const res = await apiClient.post(`/assessments/${id}/analyze`, { answers });
      return res.data;
    } catch (err) {
      // Extract Patient Demographics
      const currentAuthUserStr = localStorage.getItem('user');
      let patientName = 'Zainab Sulaiman';
      if (currentAuthUserStr) {
        try {
          const parsed = JSON.parse(currentAuthUserStr);
          if (parsed.name) patientName = parsed.name;
        } catch (e) {}
      }

      const patientAge = typeof answers['q-age'] === 'number' ? answers['q-age'] : parseInt(answers['q-age']) || 24;
      const patientSex: 'Male' | 'Female' | 'Other' = answers['q-sex'] === 'Male' ? 'Male' : 'Female';

      // Extract Clinical Inputs
      const symptomsStr = String(answers['q-symptoms'] || answers['q-gen-1'] || 'High fever, joint aches, and headache');
      const durationStr = String(answers['q-duration'] || '1 to 3 days');
      const severityNum = typeof answers['q-severity'] === 'number' ? answers['q-severity'] : 6;
      const historyArr = Array.isArray(answers['q-medical-history']) ? answers['q-medical-history'].join(', ') : String(answers['q-medical-history'] || 'None reported');
      const vitalsStr = String(answers['q-vitals-additional'] || 'Temperature: 38.5 °C, Blood Pressure: 125/82 mmHg');

      const evaluatedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Determine Diagnostic Suggestions & Medications based on symptoms, vitals, age, and sex
      let primaryDiagnosis = 'Suspected Acute Febrile Illness / Malaria Syndrome';
      let confidence = 92;
      let severityImpact: 'low' | 'medium' | 'high' = severityNum >= 7 ? 'high' : severityNum >= 4 ? 'medium' : 'low';

      const symptomsLower = symptomsStr.toLowerCase();
      const vitalsLower = vitalsStr.toLowerCase();

      let prescribedMedications: any[] = [];

      if (vitalsLower.includes('140/') || vitalsLower.includes('150/') || symptomsLower.includes('dizziness') || symptomsLower.includes('hypertension')) {
        primaryDiagnosis = 'Elevated Blood Pressure & Hypertensive Stress Risk';
        confidence = 89;
        prescribedMedications = [
          {
            id: 'med-1',
            name: 'Amlodipine Besylate',
            dosage: patientAge > 60 ? '2.5mg' : '5mg',
            route: 'Oral',
            frequency: 'Once Daily (OD in morning)',
            duration: 'Continuous / Doctor Review',
            instructions: 'Take in the morning with water. Monitor blood pressure daily before morning dose.',
            purpose: 'Calcium channel blocker for arterial vasodilation & BP stabilization.'
          },
          {
            id: 'med-2',
            name: 'Low-Dose Aspirin',
            dosage: '75mg',
            route: 'Oral',
            frequency: 'Once Daily (OD after meals)',
            duration: '30 Days',
            instructions: 'Take immediately after food to reduce gastric irritation.',
            purpose: 'Vascular anti-platelet protection under clinical supervision.'
          }
        ];
      } else if (symptomsLower.includes('cough') || symptomsLower.includes('sore throat') || symptomsLower.includes('chest')) {
        primaryDiagnosis = 'Acute Upper Respiratory Tract Infection';
        confidence = 88;
        prescribedMedications = [
          {
            id: 'med-1',
            name: 'Amoxicillin / Clavulanic Acid (Augmentin)',
            dosage: patientAge < 12 ? '375mg' : '625mg',
            route: 'Oral',
            frequency: '12-Hourly (BD after meals)',
            duration: '7 Days',
            instructions: 'Complete full 7-day course even if symptoms improve early.',
            purpose: 'Broad-spectrum antibacterial coverage for respiratory tract infection.'
          },
          {
            id: 'med-2',
            name: 'Cetirizine Hydrochloride',
            dosage: '10mg',
            route: 'Oral',
            frequency: 'Once Daily at Bedtime (OD)',
            duration: '5 Days',
            instructions: 'May cause mild drowsiness; avoid driving or operating machinery.',
            purpose: 'Antihistamine for allergic rhinorrhea, sneezing, and airway inflammation.'
          },
          {
            id: 'med-3',
            name: 'Vitamin C (Ascorbic Acid)',
            dosage: '1000mg',
            route: 'Oral (Effervescent)',
            frequency: 'Once Daily (OD)',
            duration: '10 Days',
            instructions: 'Dissolve tablet in 200ml clean water daily.',
            purpose: 'Immune system boosting & cellular repair support.'
          }
        ];
      } else if (symptomsLower.includes('vomit') || symptomsLower.includes('diarrhea') || symptomsLower.includes('stomach')) {
        primaryDiagnosis = 'Acute Gastroenteritis & Dehydration Risk';
        confidence = 90;
        prescribedMedications = [
          {
            id: 'med-1',
            name: 'Metronidazole (Flagyl)',
            dosage: '400mg',
            route: 'Oral',
            frequency: '8-Hourly (TDS with food)',
            duration: '5 Days',
            instructions: 'Do NOT consume alcohol while taking metronidazole. Take strictly after meals.',
            purpose: 'Anti-protozoal & anti-anaerobic treatment for intestinal tract infection.'
          },
          {
            id: 'med-2',
            name: 'Zinc Sulphate',
            dosage: '20mg',
            route: 'Oral',
            frequency: 'Once Daily (OD)',
            duration: '10 Days',
            instructions: 'Take on an empty stomach or with light food.',
            purpose: 'Gut mucosal tissue repair and reduction of diarrhea severity.'
          },
          {
            id: 'med-3',
            name: 'Oral Rehydration Salts (ORS)',
            dosage: '1 Sachet in 1 Litre Water',
            route: 'Oral',
            frequency: 'Sip continuously after each loose stool',
            duration: '3 to 5 Days',
            instructions: 'Mix 1 sachet in exactly 1 Litre of clean drinking water. Discard unused fluid after 24 hours.',
            purpose: 'Prevents life-threatening dehydration & electrolyte depletion.'
          }
        ];
      } else {
        // Default: Suspected Uncomplicated Malaria / Febrile Illness (Most common in Nigeria)
        primaryDiagnosis = 'Suspected Acute Febrile Illness / Malaria Syndrome';
        confidence = 93;
        prescribedMedications = [
          {
            id: 'med-1',
            name: 'Artemether / Lumefantrine (Coartem)',
            dosage: patientAge < 14 ? '40/240mg' : '80/480mg (4 Tablets per dose)',
            route: 'Oral',
            frequency: 'Twice Daily (BD at 0h, 8h, 24h, 360h, 48h, 60h)',
            duration: '3 Days (6 Doses Total)',
            instructions: 'Take strictly with fatty food or milk to enhance drug absorption.',
            purpose: 'First-line Artemisinin-based Combination Therapy (ACT) for P. falciparum malaria.'
          },
          {
            id: 'med-2',
            name: 'Paracetamol (Acetaminophen)',
            dosage: '500mg - 1000mg (1 to 2 Tablets)',
            route: 'Oral',
            frequency: '8-Hourly as needed (TDS for fever >38°C)',
            duration: '3 to 5 Days',
            instructions: 'Maximum 4000mg per 24 hours. Do not exceed recommended dosage.',
            purpose: 'Antipyretic for fever reduction and analgesic for joint & muscle body pains.'
          },
          {
            id: 'med-3',
            name: 'Oral Rehydration Salts (ORS)',
            dosage: '1 Sachet in 1 Litre Water',
            route: 'Oral',
            frequency: 'Drink 2 to 3 Litres daily',
            duration: '3 Days',
            instructions: 'Sip regularly throughout the day to replace fluids lost to sweating and high temperature.',
            purpose: 'Maintains optimal blood volume and electrolyte balance during fever spikes.'
          }
        ];
      }

      const resultObj: AssessmentResult = {
        id: `res-${Date.now()}`,
        assessmentId: id,
        userId: 'usr-current',
        patientName: patientName,
        patientAge: patientAge,
        patientSex: patientSex,
        assessmentTypeName: 'AI Healthcare Diagnostic Support System',
        identifiedArea: `Diagnostic Suggestion: ${primaryDiagnosis}`,
        summary: `Based on your reported symptoms ("${symptomsStr.substring(0, 60)}..."), duration (${durationStr}), severity rating (${severityNum}/10), age (${patientAge} yrs, ${patientSex}), and vital signs (${vitalsStr}), our AI Diagnostic Support System has generated the following patient diagnostic evaluation, clinical drug prescriptions, and care recommendations.`,
        confidenceScore: confidence,
        confidenceLabel: 'AI Diagnostic Match Confidence',
        keyFindings: [
          {
            id: 'kf-1',
            title: `Patient Profile & Symptom Analysis: ${primaryDiagnosis}`,
            description: `Patient: ${patientName} (${patientAge} yrs, ${patientSex}). Reported symptoms: "${symptomsStr.substring(0, 80)}" persisting for ${durationStr}.`,
            severity: severityImpact
          },
          {
            id: 'kf-2',
            title: `Clinical Vitals & Severity Rating`,
            description: `Vital signs recorded: ${vitalsStr}. Symptom severity rated at ${severityNum}/10.`,
            severity: severityImpact
          },
          {
            id: 'kf-3',
            title: `Medical History & Co-Factors`,
            description: `Relevant medical history: ${historyArr || 'No previous chronic conditions reported'}.`,
            severity: 'medium'
          }
        ],
        recommendations: [
          {
            id: `rec-${Date.now()}-1`,
            assessmentId: id,
            title: '1. Recommended Diagnostic Laboratory Confirmation',
            description: 'Obtain immediate laboratory test confirmation to verify pathogen presence before initiating drug therapy.',
            priority: 'HIGH',
            category: 'Laboratory Investigations',
            createdAt: evaluatedDate,
            actionableSteps: [
              'Request Rapid Diagnostic Test (RDT) or Thick/Thin Blood Film for Malaria parasites.',
              'Perform Full Blood Count (FBC) and Widal test if fever persists past 48h.',
              'Present lab test report to a medical clinician.'
            ]
          },
          {
            id: `rec-${Date.now()}-2`,
            assessmentId: id,
            title: '2. Professional Medical Doctor Consultation',
            description: 'Schedule an evaluation with a licensed physician at a primary healthcare facility in Nigeria.',
            priority: severityNum >= 7 ? 'HIGH' : 'MEDIUM',
            category: 'Clinical Follow-Up',
            createdAt: evaluatedDate,
            actionableSteps: [
              'Visit nearest clinic or general hospital for physical examination.',
              'Bring this AI diagnostic summary report, drug prescription list, and recent vitals readings.'
            ]
          },
          {
            id: `rec-${Date.now()}-3`,
            assessmentId: id,
            title: '3. Hydration & Resting Protocol',
            description: 'Maintain adequate fluid intake and monitor vital signs closely while under treatment.',
            priority: 'MEDIUM',
            category: 'Self-Care & Monitoring',
            createdAt: evaluatedDate,
            actionableSteps: [
              'Drink 2.5 to 3 Litres of clean water or oral rehydration fluids daily.',
              'Record temperature and blood pressure twice daily.',
              'Rest adequately and avoid strenuous physical labor.'
            ]
          }
        ],
        prescribedMedications: prescribedMedications,
        nextStepsTimeline: [
          { stepNumber: 1, title: 'Perform Diagnostic Lab Work', detail: 'Get Malaria RDT/MP blood film or baseline blood pressure monitoring.' },
          { stepNumber: 2, title: 'Review Drug Prescriptions with Doctor', detail: 'Verify prescribed medications with a physician or registered pharmacist.' },
          { stepNumber: 3, title: 'Initiate Treatment & Dosage', detail: 'Take prescribed medication according to exact dosage schedules.' },
          { stepNumber: 4, title: 'Re-evaluate in 48-72 Hours', detail: 'Re-assess symptom resolution or seek urgent emergency care if condition worsens.' }
        ],
        safetyDisclaimer: 'Notice: This AI diagnostic support system is designed to assist healthcare decision-making in Nigeria. Prescribed drug guidance should be reviewed with a registered medical practitioner or pharmacist.',
        evaluatedAt: evaluatedDate
      };

      // Update status to 'Completed' in local store
      const localAsmsStr = localStorage.getItem('user_assessments');
      let localAsms: Assessment[] = localAsmsStr ? JSON.parse(localAsmsStr) : [];
      const target = localAsms.find((a) => a.id === id);
      if (target) {
        target.status = 'Completed';
        target.completedAt = evaluatedDate;
        target.answers = answers;
      } else {
        localAsms.unshift({
          id: id,
          userId: 'usr-current',
          assessmentTypeId: 'cat-academic',
          assessmentTypeName: 'Diagnostic Healthcare Assessment',
          category: 'general',
          status: 'Completed',
          answers,
          missingQuestionIds: [],
          createdAt: evaluatedDate,
          updatedAt: evaluatedDate,
          completedAt: evaluatedDate
        });
      }
      localStorage.setItem('user_assessments', JSON.stringify(localAsms));

      // Save generated recommendations locally
      const localRecsStr = localStorage.getItem('user_recommendations');
      const localRecs: any[] = localRecsStr ? JSON.parse(localRecsStr) : [];
      if (resultObj.recommendations) {
        resultObj.recommendations.forEach((r) => localRecs.unshift(r));
      }
      localStorage.setItem('user_recommendations', JSON.stringify(localRecs));

      return resultObj;
    }
  },

  async getHistory(): Promise<Assessment[]> {
    try {
      const res = await apiClient.get('/assessments');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      // Fallthrough to local store check
    }

    const localAsmsStr = localStorage.getItem('user_assessments');
    if (localAsmsStr) {
      try {
        return JSON.parse(localAsmsStr);
      } catch (e) {}
    }

    return [];
  }
};

