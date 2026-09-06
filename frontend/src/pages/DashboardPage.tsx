import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileCheck2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import type { ActivePage, Assessment, RecommendationItem, User } from '../types';
import { assessmentService } from '../services/assessmentService';
import { resultService } from '../services/resultService';

interface DashboardPageProps {
  onNavigate: (page: ActivePage) => void;
  onSelectAssessment: (asm: Assessment) => void;
  onSelectCategory?: (categoryId: string) => void;
  user: User | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectAssessment,
  user
}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [asmData, recData] = await Promise.all([
          assessmentService.getHistory(),
          resultService.getRecommendations()
        ]);
        setAssessments(asmData);
        setRecommendations(recData);
      } catch (err) {
        console.error(err);
      }
    }
    loadDashboardData();
  }, []);

  const totalCount = assessments.length;
  const completedCount = assessments.filter((a) => a.status === 'Completed').length;
  const inProgressCount = assessments.filter((a) => a.status === 'In Progress' || a.status === 'Draft').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Requires Information':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Analyzing':
        return 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 font-sans">
      {/* Header Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] sm:text-xs text-emerald-300 font-bold uppercase tracking-wider block">
            Healthcare Decision Support Dashboard
          </span>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold font-outfit leading-tight">
            Welcome back, <span className="text-emerald-400 font-extrabold">{user?.name || 'Zainab Sulaiman'}</span>! 👋
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-300 max-w-xl leading-relaxed">
            Logged in as <strong className="text-white font-semibold">{user?.email || 'user'}</strong>. Select an assessment below or review your recent diagnostic recommendations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('intro')}
          className="w-full sm:w-auto px-5 py-3 bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold truncate text-[11px] sm:text-xs">Total</span>
            <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
          </div>
          <span className="text-lg sm:text-2xl font-extrabold text-slate-900 font-outfit block">{totalCount}</span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block truncate">Across all categories</span>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold truncate text-[11px] sm:text-xs">Completed</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <span className="text-lg sm:text-2xl font-extrabold text-emerald-700 font-outfit block">{completedCount}</span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block truncate">AI Diagnostic Results</span>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold truncate text-[11px] sm:text-xs">In Progress</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <span className="text-lg sm:text-2xl font-extrabold text-amber-600 font-outfit block">{inProgressCount}</span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block truncate">Pending completion</span>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold truncate text-[11px] sm:text-xs">Recommendations</span>
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
          </div>
          <span className="text-lg sm:text-2xl font-extrabold text-indigo-600 font-outfit block">{recommendations.length}</span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block truncate">Actionable next steps</span>
        </div>
      </div>

      {/* Start New Assessment Primary Banner Card */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
            <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 font-outfit">Need help understanding a problem?</h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl leading-relaxed">
              Start a structured assessment today. Answer guided questions, validate information completeness, and receive instant AI analysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('intro')}
          className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <span>Start New Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Two Column Layout: Recent Assessments & Recent Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Recent Assessments Table (Col 7) */}
        <div className="lg:col-span-7 bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-outfit uppercase tracking-wider">
              Recent Assessments
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-indigo-600 hover:underline font-bold"
            >
              View All →
            </button>
          </div>

          {assessments.length === 0 ? (
            <div className="text-center py-6 sm:py-10 px-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">No Assessments Submitted Yet</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                  Your diagnostic assessment history is currently empty (0 assessments).
                </p>
              </div>
              <button
                onClick={() => onNavigate('intro')}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start Your First Assessment</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Mobile Card List View (< sm screens) */}
              <div className="sm:hidden space-y-3">
                {assessments.slice(0, 5).map((asm) => (
                  <div key={asm.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs truncate max-w-[140px] xs:max-w-[200px]">{asm.assessmentTypeName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadge(asm.status)}`}>
                        {asm.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                      <span>{asm.createdAt}</span>
                      <button
                        onClick={() => {
                          onSelectAssessment(asm);
                          if (asm.status === 'Completed') onNavigate('result');
                          else onNavigate('wizard');
                        }}
                        className="px-3 py-1 bg-white border border-slate-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        {asm.status === 'Completed' ? 'View Result' : 'Continue'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= sm screens) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-200">
                      <th className="py-2.5 px-3">Assessment Type</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assessments.slice(0, 5).map((asm) => (
                      <tr key={asm.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{asm.assessmentTypeName}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{asm.category} category</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">{asm.createdAt}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(asm.status)}`}>
                            {asm.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              onSelectAssessment(asm);
                              if (asm.status === 'Completed') onNavigate('result');
                              else onNavigate('wizard');
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                          >
                            {asm.status === 'Completed' ? 'View Result' : 'Continue'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent Recommendations List (Col 5) */}
        <div className="lg:col-span-5 bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-outfit uppercase tracking-wider">
              Recent Recommendations
            </h3>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs text-emerald-600 hover:underline font-bold"
            >
              All Recommendations →
            </button>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-6 sm:py-10 px-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">No Active Recommendations</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                  Recommendations will automatically appear here once you complete a diagnostic assessment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-200 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {rec.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-400">{rec.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs font-outfit">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{rec.description}</p>
                  <button
                    onClick={() => onNavigate('result')}
                    className="text-[11px] font-bold text-emerald-600 hover:underline inline-flex items-center"
                  >
                    <span>View Result</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

