export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  assessmentCount: number;
}

export type QuestionType =
  | 'text'
  | 'long_text'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'number'
  | 'date'
  | 'rating_scale'
  | 'yes_no';

export interface QuestionOption {
  label: string;
  value: string;
  description?: string;
}

export interface ConditionRule {
  dependsOnQuestionId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than';
  value: string | number | boolean;
}

export interface Question {
  id: string;
  assessmentTypeId: string;
  questionText: string;
  type: QuestionType;
  required: boolean;
  order: number;
  placeholder?: string;
  options?: QuestionOption[];
  condition?: ConditionRule;
  helpText?: string;
  categorySection?: string; // e.g. "Basic Information", "Your Experience"
}

export interface AssessmentType {
  id: string;
  name: string;
  category: 'academic' | 'career' | 'technology' | 'general';
  description: string;
  estimatedMinutes: number;
  questionCount: number;
  active: boolean;
  iconName: string;
  requiredInfoList: string[];
}

export interface Requirement {
  id: string;
  assessmentTypeId: string;
  questionId: string;
  ruleDescription: string;
  isRequired: boolean;
  status: 'Complete' | 'Missing' | 'Invalid';
}

export type AssessmentStatus =
  | 'Draft'
  | 'In Progress'
  | 'Requires Information'
  | 'Analyzing'
  | 'Completed';

export interface Answer {
  questionId: string;
  value: any; // text, array, number, boolean
  answeredAt: string;
}

export interface Assessment {
  id: string;
  userId: string;
  assessmentTypeId: string;
  assessmentTypeName: string;
  category: string;
  status: AssessmentStatus;
  answers: Record<string, any>;
  missingQuestionIds: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface KeyFinding {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  severity: 'low' | 'medium' | 'high';
}

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RecommendationItem {
  id: string;
  assessmentId: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  category: string;
  createdAt: string;
  actionableSteps?: string[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  patientName?: string;
  patientAge?: number;
  patientSex?: 'Male' | 'Female' | 'Other';
  assessmentTypeName: string;
  identifiedArea: string;
  summary: string;
  confidenceScore: number; // 0-100 percentage
  confidenceLabel: string;
  keyFindings: KeyFinding[];
  recommendations: RecommendationItem[];
  prescribedMedications?: MedicationItem[];
  nextStepsTimeline: { stepNumber: number; title: string; detail: string }[];
  safetyDisclaimer: string;
  evaluatedAt: string;
}

export interface Feedback {
  id: string;
  resultId: string;
  userId: string;
  userName: string;
  isHelpful: boolean; // thumbs up/down
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: string;
}

export interface AdminStatistics {
  totalUsers: number;
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  averageFeedbackRating: number;
  successfulAIAnalyses: number;
  assessmentsOverTime: { date: string; count: number }[];
  assessmentsByCategory: { category: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  feedbackRatingBreakdown: { rating: number; count: number }[];
}

export type ActivePage =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'categories'
  | 'intro'
  | 'wizard'
  | 'validation'
  | 'analysis'
  | 'result'
  | 'history'
  | 'recommendations'
  | 'profile'
  | 'settings'
  | 'help'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-categories'
  | 'admin-builder'
  | 'admin-requirements'
  | 'admin-results'
  | 'patient-profile'
  | 'patients'
  | 'diagnostic-support'
  | 'diagnostic-results'
  | 'investigations'
  | 'treatment-plans'
  | 'referrals'
  | 'reports'
  | 'ai-model'
  | 'audit-logs';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type UrgencyLevel = 'Routine' | 'Recommended' | 'Urgent' | 'Emergency';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp?: string;
  dateTime?: string;
  read: boolean;
  type?: 'info' | 'warning' | 'success' | 'high_risk' | 'lab_result';
  patientId?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  stateOfResidence: string;
  emergencyContact: { name: string; relationship: string; phone: string; address?: string };
  medicalSummary: { chronicConditions: string[]; allergies: string[]; currentMedications: string[]; surgeries?: string[]; familyHistory?: string[] };
  riskLevel: RiskLevel;
  status: 'Active' | 'Under Review' | 'Discharged' | 'Critical';
  lastVisit: string;
  createdAt: string;
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  severityRating?: number;
  duration: string;
  notes?: string;
}

export interface VitalSigns {
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  systolicBP: number;
  diastolicBP: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi?: number;
}

export interface LabResult {
  id: string;
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Pending';
  category?: string;
  dateAdded?: string;
}

export interface Investigation {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  priority: 'Routine' | 'Recommended' | 'Urgent';
  requestedBy: string;
  requestedDate: string;
  status: 'Requested' | 'Pending' | 'In Progress' | 'Completed';
  clinicalReason: string;
  notes?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
  purpose?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  clinicalProblem: string;
  managementPlan: string;
  medications: MedicationItem[];
  monitoringRequirements: string;
  followUpDate: string;
  authorizedBy: string;
  createdAt: string;
  status: 'Active' | 'Completed' | 'Modified';
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  specialistType: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  referralReason: string;
  clinicalSummary: string;
  relevantInvestigations: string;
  status: 'Submitted' | 'In Review' | 'Accepted' | 'Completed';
  date: string;
  referringDoctor: string;
}

export interface AIDiagnosticAssessment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: 'Male' | 'Female' | 'Other';
  dateTime: string;
  modelVersion: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  overallRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number;
  possibleConditions: any[];
  keyFactors: any[];
  recommendedInvestigations: any[];
  clinicalRecommendations: string[];
  clinicianReview?: any;
  chiefComplaint?: string;
  vitalsSnapshot?: VitalSigns;
  symptomsSnapshot?: Symptom[];
  prescribedMedications?: any[];
}

export interface AuditLog {
  id: string;
  dateTime: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  status: 'Success' | 'Warning' | 'Failed';
  details?: string;
}
