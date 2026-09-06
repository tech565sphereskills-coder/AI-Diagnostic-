import React, { useState, useEffect } from 'react';
import {
  Users,
  FileCheck2,
  Star,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { AdminStatistics } from '../../types';
import { adminService } from '../../services/adminService';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStatistics | null>(null);

  useEffect(() => {
    async function loadStats() {
      const data = await adminService.getAdminStats();
      setStats(data);
    }
    loadStats();
  }, []);

  if (!stats) {
    return <div className="text-xs text-slate-400 p-8">Loading admin statistics...</div>;
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#64748B'];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
            System Operational Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Admin Overview & Analytics
          </h1>
        </div>
      </div>

      {/* Statistic Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-outfit block">{stats.totalUsers}</span>
          <span className="text-[10px] text-emerald-400">Active user accounts</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Total Assessments</span>
            <FileCheck2 className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-outfit block">{stats.totalAssessments}</span>
          <span className="text-[10px] text-blue-400">{stats.completedAssessments} Completed</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>AI Analyses Executed</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-extrabold text-purple-300 font-outfit block">{stats.successfulAIAnalyses}</span>
          <span className="text-[10px] text-purple-400">Successful inference runs</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Average Feedback Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-amber-400 font-outfit block">{stats.averageFeedbackRating} / 5.0</span>
          <span className="text-[10px] text-amber-400">Based on user reviews</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Chart 1: Assessments Over Time (Line Chart) */}
        <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-outfit flex items-center">
              <TrendingUp className="w-4 h-4 text-amber-400 mr-2" />
              Assessments Over Time (Daily Volume)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.assessmentsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Distribution (Pie Chart) */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-outfit">
              Assessment Status Breakdown
            </h3>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stats.statusDistribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Assessments by Category (Bar Chart) */}
        <div className="lg:col-span-6 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-outfit flex items-center">
              <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
              Assessments By Category
            </h3>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.assessmentsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Feedback Rating Breakdown */}
        <div className="lg:col-span-6 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-outfit flex items-center">
              <Star className="w-4 h-4 text-amber-400 mr-2" />
              User Feedback Rating Breakdown
            </h3>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.feedbackRatingBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="rating" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
