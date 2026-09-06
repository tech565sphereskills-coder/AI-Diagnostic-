import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { ActivePage, Assessment } from '../types';
import { assessmentService } from '../services/assessmentService';

interface AssessmentHistoryPageProps {
  onNavigate: (page: ActivePage) => void;
  onSelectAssessment: (asm: Assessment) => void;
}

export const AssessmentHistoryPage: React.FC<AssessmentHistoryPageProps> = ({
  onNavigate,
  onSelectAssessment
}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      const data = await assessmentService.getHistory();
      setAssessments(data);
    }
    loadData();
  }, []);

  const filtered = assessments.filter((asm) => {
    const matchesSearch =
      asm.assessmentTypeName.toLowerCase().includes(search.toLowerCase()) ||
      asm.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || asm.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || asm.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Requires Information':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Historical Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
            Assessment History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and review all previous assessment sessions and results.
          </p>
        </div>

        <button
          onClick={() => onNavigate('intro')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
        >
          + New Assessment
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by assessment type or ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="career">Career</option>
            <option value="technology">Technology</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Requires Information">Requires Info</option>
          </select>
        </div>
      </div>

      {/* Desktop Table & Mobile Card View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-200">
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((asm) => (
                <tr key={asm.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{asm.assessmentTypeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{asm.id}</span>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-medium text-slate-700">{asm.category}</td>
                  <td className="py-3.5 px-4 text-slate-500">{asm.createdAt}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(asm.status)}`}>
                      {asm.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        onSelectAssessment(asm);
                        if (asm.status === 'Completed') onNavigate('result');
                        else onNavigate('wizard');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                    >
                      {asm.status === 'Completed' ? 'View Result' : 'Continue'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100 p-4 space-y-3">
          {filtered.map((asm) => (
            <div key={asm.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{asm.assessmentTypeName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(asm.status)}`}>
                  {asm.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Date: {asm.createdAt}</p>
              <button
                onClick={() => {
                  onSelectAssessment(asm);
                  if (asm.status === 'Completed') onNavigate('result');
                  else onNavigate('wizard');
                }}
                className="w-full mt-2 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                {asm.status === 'Completed' ? 'View Result' : 'Continue'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
