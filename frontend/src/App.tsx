import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { ActivePage, AssessmentType, Question, AssessmentResult } from './types';

// Layouts
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AdminLayout } from './components/layout/AdminLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// User Portal Pages
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentIntroPage } from './pages/AssessmentIntroPage';
import { PatientAssessmentPage } from './pages/PatientAssessmentPage';
import { AssessmentValidationPage } from './pages/AssessmentValidationPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { ResultsPage } from './pages/ResultsPage';
import { AssessmentHistoryPage } from './pages/AssessmentHistoryPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

// Admin Portal Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAssessmentTypesPage } from './pages/admin/AdminAssessmentTypesPage';
import { AdminQuestionBuilderPage } from './pages/admin/AdminQuestionBuilderPage';
import { AdminRequirementsPage } from './pages/admin/AdminRequirementsPage';
import { AdminResultsFeedbackPage } from './pages/admin/AdminResultsFeedbackPage';

import { SplashLoader } from './components/common/SplashLoader';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Active View State (Defaults to 'landing' for public visitors or 'dashboard' if logged in)
  const [currentPage, setCurrentPage] = useState<ActivePage>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active State Containers
  const [selectedCategory, setSelectedCategory] = useState<AssessmentType | null>(null);
  const [activeAnswers] = useState<Record<string, any>>({});
  const [activeQuestions] = useState<Question[]>([]);
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);

  // 0. ENTRANCE SPLASH ANIMATION
  if (showSplash) {
    return <SplashLoader onComplete={() => setShowSplash(false)} />;
  }

  // 1. PUBLIC LANDING PAGE
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={setCurrentPage} isAuthenticated={isAuthenticated} />;
  }

  // 2. PUBLIC AUTH PAGES (Login & Register)
  if (currentPage === 'login') {
    return <LoginPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onNavigate={setCurrentPage} />;
  }

  // Mandatory Authentication Guard: Guest users must register and log in before accessing user portal or assessment engine
  if (!isAuthenticated) {
    return <LoginPage onNavigate={setCurrentPage} />;
  }

  // 3. ADMIN PORTAL PAGES (Protected for Admin Role)
  if (currentPage.startsWith('admin-')) {
    return (
      <AdminLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogout={() => {
          logout();
          setCurrentPage('landing');
        }}
      >
        {currentPage === 'admin-dashboard' && <AdminDashboardPage />}
        {currentPage === 'admin-users' && <AdminUsersPage />}
        {currentPage === 'admin-categories' && <AdminAssessmentTypesPage />}
        {currentPage === 'admin-builder' && <AdminQuestionBuilderPage />}
        {currentPage === 'admin-requirements' && <AdminRequirementsPage />}
        {currentPage === 'admin-results' && <AdminResultsFeedbackPage />}
      </AdminLayout>
    );
  }

  // 4. USER PORTAL PAGES (Protected User Views inside Sidebar Layout)
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar Layout */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogout={() => {
          logout();
          setCurrentPage('landing');
        }}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenMobile={() => setMobileMenuOpen(true)}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header
          onMenuToggle={() => setMobileMenuOpen(true)}
          onNavigate={setCurrentPage}
          onOpenNotifications={() => setCurrentPage('recommendations')}
          onOpenHelp={() => setCurrentPage('help')}
          onLogout={() => {
            logout();
            setCurrentPage('landing');
          }}
          unreadCount={2}
          user={user}
        />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentPage}
              onSelectAssessment={(_asm) => { }}
              onSelectCategory={(_catId) => setSelectedCategory(null)}
              user={user}
            />
          )}

          {/* Diagnostic Assessment Intro (Bypasses Category Selection) */}
          {(currentPage === 'categories' || currentPage === 'intro') && (
            <AssessmentIntroPage
              category={selectedCategory}
              onNavigate={setCurrentPage}
              onStartWizard={() => setCurrentPage('wizard')}
            />
          )}

          {/* Main Interactive Diagnostic Assessment Wizard */}
          {currentPage === 'wizard' && (
            <PatientAssessmentPage
              onNavigate={setCurrentPage}
              onSaveAssessment={(res) => setActiveResult(res as any)}
            />
          )}

          {/* Assessment Completeness Validation Page */}
          {currentPage === 'validation' && (
            <AssessmentValidationPage
              answers={activeAnswers}
              questions={activeQuestions}
              onNavigate={setCurrentPage}
              onStartAnalysis={() => setCurrentPage('analysis')}
            />
          )}

          {/* Dedicated AI Analysis Screen */}
          {currentPage === 'analysis' && (
            <AIAnalysisPage
              answers={activeAnswers}
              onNavigate={setCurrentPage}
              onAnalysisComplete={(res) => setActiveResult(res)}
            />
          )}

          {/* Results Dashboard */}
          {currentPage === 'result' && (
            <ResultsPage result={activeResult} onNavigate={setCurrentPage} />
          )}

          {/* Assessment History */}
          {currentPage === 'history' && (
            <AssessmentHistoryPage
              onNavigate={setCurrentPage}
              onSelectAssessment={(_asm) => { }}
            />
          )}

          {/* Recommendations Hub */}
          {currentPage === 'recommendations' && (
            <RecommendationsPage onNavigate={setCurrentPage} />
          )}

          {/* Profile Page */}
          {currentPage === 'profile' && <ProfilePage user={user} />}

          {/* Settings Page */}
          {currentPage === 'settings' && <SettingsPage />}

          {/* Help Center */}
          {currentPage === 'help' && <HelpPage />}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
