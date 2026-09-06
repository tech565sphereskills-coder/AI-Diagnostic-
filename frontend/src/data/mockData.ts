import type {
  User,
  AssessmentType,
  Question,
  Assessment,
  AssessmentResult,
  RecommendationItem,
  AdminStatistics
} from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15',
    assessmentCount: 4
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10',
    assessmentCount: 2
  },
  {
    id: 'usr-admin',
    name: 'Admin User',
    email: 'admin@aidiagnostic.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-01',
    assessmentCount: 12
  }
];

export const MOCK_ASSESSMENT_TYPES: AssessmentType[] = [
  {
    id: 'cat-academic',
    name: 'Academic Problem Assessment',
    category: 'academic',
    description: 'Identify possible challenges affecting your academic performance, time management, and study routine.',
    estimatedMinutes: 8,
    questionCount: 8,
    active: true,
    iconName: 'GraduationCap',
    requiredInfoList: ['Main Problem Category', 'Symptom Duration', 'Study Frequency', 'Target Outcome']
  },
  {
    id: 'cat-career',
    name: 'Career Guidance Assessment',
    category: 'career',
    description: 'Explore your skills, work interests, career stagnation, and recommended professional growth pathways.',
    estimatedMinutes: 10,
    questionCount: 7,
    active: true,
    iconName: 'Briefcase',
    requiredInfoList: ['Current Professional Role', 'Career Challenge', 'Preferred Work Style']
  },
  {
    id: 'cat-tech',
    name: 'Technology Troubleshooting',
    category: 'technology',
    description: 'Describe a technical system failure, software glitch, or workflow bottleneck to receive diagnostic steps.',
    estimatedMinutes: 5,
    questionCount: 6,
    active: true,
    iconName: 'Cpu',
    requiredInfoList: ['Affected System/Tool', 'Error Description', 'Troubleshooting Tried']
  },
  {
    id: 'cat-general',
    name: 'General Problem Solving',
    category: 'general',
    description: 'Deconstruct complex personal, operational, or decision-making dilemmas into structured actionable steps.',
    estimatedMinutes: 7,
    questionCount: 6,
    active: true,
    iconName: 'BrainCircuit',
    requiredInfoList: ['Dilemma Summary', 'Urgency Level', 'Primary Constraints']
  }
];

export const MOCK_QUESTIONS_ACADEMIC: Question[] = [
  {
    id: 'q-acad-1',
    assessmentTypeId: 'cat-academic',
    questionText: 'What is the main academic problem you are experiencing?',
    type: 'radio',
    required: true,
    order: 1,
    categorySection: 'Basic Information',
    options: [
      { label: 'Time Management & Scheduling', value: 'Time management', description: 'Difficulty balancing lectures, study sessions, and deadlines.' },
      { label: 'Concentration & Focus', value: 'Concentration', description: 'Struggling to remain attentive during lectures or long reading sessions.' },
      { label: 'Assignment Overwhelm', value: 'Assignments', description: 'Falling behind on coursework submissions and group projects.' },
      { label: 'Exam Preparation & Anxiety', value: 'Exam preparation', description: 'Difficulty organizing review material or experiencing severe test anxiety.' },
      { label: 'Other Academic Challenge', value: 'Other', description: 'Specify any other difficulty not listed above.' }
    ]
  },
  {
    id: 'q-acad-2',
    assessmentTypeId: 'cat-academic',
    questionText: 'How long have you experienced this problem?',
    type: 'dropdown',
    required: true,
    order: 2,
    categorySection: 'Basic Information',
    options: [
      { label: 'Less than 2 weeks', value: '<2 weeks' },
      { label: '1 to 3 months', value: '1-3 months' },
      { label: '3 to 6 months', value: '3-6 months' },
      { label: 'Entire academic year / Longer', value: '>6 months' }
    ]
  },
  {
    id: 'q-acad-3',
    assessmentTypeId: 'cat-academic',
    questionText: 'How often does this problem occur?',
    type: 'radio',
    required: true,
    order: 3,
    categorySection: 'Basic Information',
    options: [
      { label: 'Daily (Every day)', value: 'Daily' },
      { label: 'Multiple times per week', value: 'Weekly' },
      { label: 'Only during exam periods or deadlines', value: 'Exams' },
      { label: 'Occasionally', value: 'Occasionally' }
    ]
  },
  {
    id: 'q-acad-4',
    assessmentTypeId: 'cat-academic',
    questionText: 'How many hours do you study per day (outside scheduled classes)?',
    type: 'number',
    required: true,
    order: 4,
    categorySection: 'Your Experience',
    placeholder: 'e.g. 2'
  },
  {
    id: 'q-acad-5',
    assessmentTypeId: 'cat-academic',
    questionText: 'How do you currently organize your academic work?',
    type: 'checkbox',
    required: false,
    order: 5,
    categorySection: 'Your Experience',
    options: [
      { label: 'Digital Planner / Calendar App (Google Calendar, Notion)', value: 'Digital Planner' },
      { label: 'Physical Notebook / To-Do List', value: 'Paper Planner' },
      { label: 'Mental Reminders Only', value: 'Mental Notes' },
      { label: 'Study Group Schedules', value: 'Study Group' },
      { label: 'No Formal System Currently', value: 'No System' }
    ]
  },
  {
    id: 'q-acad-6',
    assessmentTypeId: 'cat-academic',
    questionText: 'How many assignments are currently overdue or near deadline?',
    type: 'rating_scale',
    required: true,
    order: 6,
    categorySection: 'Your Experience',
    helpText: 'Select 0 for none, 1-3 for moderate backlog, 4-10 for critical backlog.'
  },
  // Conditional Follow-up Question for Time Management
  {
    id: 'q-acad-7',
    assessmentTypeId: 'cat-academic',
    questionText: 'What have you already tried to resolve this challenge?',
    type: 'long_text',
    required: true,
    order: 7,
    categorySection: 'Attempts & Goals',
    placeholder: 'Describe tools, methods, or advice you have experimented with so far...',
    condition: {
      dependsOnQuestionId: 'q-acad-1',
      operator: 'not_equals',
      value: ''
    }
  },
  {
    id: 'q-acad-8',
    assessmentTypeId: 'cat-academic',
    questionText: 'What outcome would you like to achieve in the next 30 days?',
    type: 'text',
    required: true,
    order: 8,
    categorySection: 'Attempts & Goals',
    placeholder: 'e.g. Consistently submit assignments 24h early and study 3 hours daily.'
  }
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-101',
    userId: 'usr-1',
    assessmentTypeId: 'cat-academic',
    assessmentTypeName: 'Academic Problem Assessment',
    category: 'academic',
    status: 'Completed',
    answers: {
      'q-acad-1': 'Time management',
      'q-acad-2': '3 to 6 months',
      'q-acad-3': 'Daily',
      'q-acad-4': 2,
      'q-acad-5': ['Mental Notes', 'No System'],
      'q-acad-6': 4,
      'q-acad-7': 'Tried using a paper planner twice, but stopped after 3 days. Tried late-night cramming.',
      'q-acad-8': 'Establish a structured 3-hour daily study routine and eliminate overdue coursework.'
    },
    missingQuestionIds: [],
    createdAt: '2026-03-01 10:30',
    updatedAt: '2026-03-01 10:45',
    completedAt: '2026-03-01 10:45'
  },
  {
    id: 'asm-102',
    userId: 'usr-1',
    assessmentTypeId: 'cat-tech',
    assessmentTypeName: 'Technology Troubleshooting',
    category: 'technology',
    status: 'Completed',
    answers: {
      'q-tech-1': 'Database connection timeout under heavy load',
      'q-tech-2': '3 days',
      'q-tech-3': 'Restarted PostgreSQL service, increased max connections'
    },
    missingQuestionIds: [],
    createdAt: '2026-02-20 14:15',
    updatedAt: '2026-02-20 14:25',
    completedAt: '2026-02-20 14:25'
  },
  {
    id: 'asm-103',
    userId: 'usr-1',
    assessmentTypeId: 'cat-career',
    assessmentTypeName: 'Career Guidance Assessment',
    category: 'career',
    status: 'In Progress',
    answers: {
      'q-car-1': 'Software Engineering Lead',
      'q-car-2': 'Seeking transition to AI Engineering'
    },
    missingQuestionIds: ['q-car-3', 'q-car-4'],
    createdAt: '2026-03-04 09:00',
    updatedAt: '2026-03-04 09:10'
  }
];

export const MOCK_RESULT_DEMO: AssessmentResult = {
  id: 'res-101',
  assessmentId: 'asm-101',
  userId: 'usr-1',
  assessmentTypeName: 'Academic Problem Assessment',
  identifiedArea: 'Time Management & Task Prioritization Deficit',
  summary: 'Based on your reported responses, your primary challenge stems from an informal planning structure combined with high task volume, leading to reactive studying and an accumulation of overdue assignments.',
  confidenceScore: 87,
  confidenceLabel: 'High System Match Confidence',
  keyFindings: [
    {
      id: 'kf-1',
      title: 'Difficulty Maintaining a Consistent Schedule',
      description: 'Reliance on mental notes creates cognitive fatigue and missed task triggers.',
      severity: 'high'
    },
    {
      id: 'kf-2',
      title: 'Multiple Overdue Coursework Items (4+)',
      description: 'Backlog creates persistent background stress, shortening active study focus window to ~2 hours.',
      severity: 'high'
    },
    {
      id: 'kf-3',
      title: 'Short-lived Habit Experimentation',
      description: 'Previous paper planner attempt failed due to lack of incremental milestone tracking.',
      severity: 'medium'
    }
  ],
  recommendations: [
    {
      id: 'rec-1',
      assessmentId: 'asm-101',
      title: 'Create a Structured Weekly Schedule',
      description: 'Divide your total study capacity into fixed 45-minute Pomodoro sessions with digital calendar blocks.',
      priority: 'HIGH',
      category: 'Academic Time Management',
      createdAt: '2026-03-01 10:45',
      actionableSteps: [
        'Set up a digital calendar app (Google Calendar) for lecture & study blocks.',
        'Reserve 90 minutes every morning for highest-priority coursework.',
        'Use 45-min active work / 15-min break cycles.'
      ]
    },
    {
      id: 'rec-2',
      assessmentId: 'asm-101',
      title: 'Break Large Assignments into 3-Step Micro Tasks',
      description: 'Deconstruct overdue tasks into sub-tasks taking under 30 minutes each to lower initiation friction.',
      priority: 'HIGH',
      category: 'Task Management',
      createdAt: '2026-03-01 10:45',
      actionableSteps: [
        'List 3 immediate sub-actions for your oldest overdue assignment.',
        'Complete Step 1 before 5 PM today.'
      ]
    },
    {
      id: 'rec-3',
      assessmentId: 'asm-101',
      title: 'Establish a Centralized Deadline Dashboard',
      description: 'Consolidate all upcoming exams and submission dates into a single visible priority list.',
      priority: 'MEDIUM',
      category: 'Organization',
      createdAt: '2026-03-01 10:45',
      actionableSteps: ['Review course syllabi and input all remaining semester dates.']
    }
  ],
  nextStepsTimeline: [
    { stepNumber: 1, title: 'Build Your Calendar Schedule', detail: 'Set up digital time blocks for lecture & study routines.' },
    { stepNumber: 2, title: 'Identify Top 2 Priority Backlog Items', detail: 'Isolate overdue coursework requiring immediate turn-in.' },
    { stepNumber: 3, title: 'Execute Pomodoro Study Sessions', detail: 'Conduct 45-minute focus intervals without phone distractions.' },
    { stepNumber: 4, title: 'Review Progress in 7 Days', detail: 'Re-evaluate task backlog and adjust time allocations.' }
  ],
  safetyDisclaimer: 'These diagnostic results are generated from your self-reported assessment inputs and are intended as guidance. They should not be treated as professional psychological or institutional administrative advice.',
  evaluatedAt: '2026-03-01 10:45'
};

export const MOCK_RECOMMENDATIONS_ALL: RecommendationItem[] = [
  ...MOCK_RESULT_DEMO.recommendations,
  {
    id: 'rec-4',
    assessmentId: 'asm-102',
    title: 'Implement PostgreSQL Connection Pooling (PgBouncer)',
    description: 'Mitigate connection exhaustion during backend spike traffic by placing a connection pool manager in front of your FastAPI service.',
    priority: 'HIGH',
    category: 'System Architecture',
    createdAt: '2026-02-20 14:25',
    actionableSteps: ['Configure PgBouncer with pool size = 20', 'Update database URI string']
  },
  {
    id: 'rec-5',
    assessmentId: 'asm-102',
    title: 'Add Query Performance Indexing',
    description: 'Add composite B-Tree indexes on frequently filtered foreign key fields.',
    priority: 'MEDIUM',
    category: 'Database Optimization',
    createdAt: '2026-02-20 14:25'
  }
];

export const MOCK_ADMIN_STATS: AdminStatistics = {
  totalUsers: 1420,
  totalAssessments: 3840,
  completedAssessments: 3290,
  pendingAssessments: 550,
  averageFeedbackRating: 4.8,
  successfulAIAnalyses: 3245,
  assessmentsOverTime: [
    { date: 'Feb 25', count: 120 },
    { date: 'Feb 26', count: 145 },
    { date: 'Feb 27', count: 190 },
    { date: 'Feb 28', count: 230 },
    { date: 'Mar 01', count: 310 },
    { date: 'Mar 02', count: 280 },
    { date: 'Mar 03', count: 340 }
  ],
  assessmentsByCategory: [
    { category: 'Academic Problems', count: 1420 },
    { category: 'Career Guidance', count: 980 },
    { category: 'Technology Problems', count: 850 },
    { category: 'General Problem Solving', count: 590 }
  ],
  statusDistribution: [
    { status: 'Completed', count: 3290 },
    { status: 'In Progress', count: 310 },
    { status: 'Requires Info', count: 180 },
    { status: 'Draft', count: 60 }
  ],
  feedbackRatingBreakdown: [
    { rating: 5, count: 2100 },
    { rating: 4, count: 840 },
    { rating: 3, count: 210 },
    { rating: 2, count: 60 },
    { rating: 1, count: 30 }
  ]
};
