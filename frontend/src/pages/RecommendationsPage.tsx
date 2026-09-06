import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ActivePage, RecommendationItem } from '../types';
import { resultService } from '../services/resultService';

interface RecommendationsPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onNavigate }) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      const data = await resultService.getRecommendations();
      setRecommendations(data);
    }
    loadData();
  }, []);

  const filtered = recommendations.filter((r) => {
    if (priorityFilter === 'ALL') return true;
    return r.priority === priorityFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Actionable Guidance Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
            My Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated personalized recommendations generated from your completed AI assessments.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto max-w-full">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex-shrink-0 ${
                priorityFilter === p ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p === 'ALL' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((rec) => (
          <div key={rec.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                rec.priority === 'HIGH' ? 'bg-indigo-900 text-white' : 'bg-indigo-100 text-indigo-900'
              }`}>
                {rec.priority} PRIORITY
              </span>
              <span className="text-xs text-slate-400 font-medium">{rec.createdAt}</span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 font-outfit">{rec.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>

            {rec.actionableSteps && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Actionable steps:</span>
                <ul className="space-y-1 text-slate-700">
                  {rec.actionableSteps.map((step, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onNavigate('result')}
                className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center cursor-pointer"
              >
                <span>View Full Result Report</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
