import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  FileQuestion,
  CheckSquare,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import type { ActivePage, User as UserType } from '../../types';

interface AdminLayoutProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  user: UserType | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPage,
  onNavigate,
  user,
  onLogout,
  children
}) => {
  const adminMenuItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'admin-users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
    { id: 'admin-categories', label: 'Assessment Types', icon: <Layers className="w-4 h-4" /> },
    { id: 'admin-builder', label: 'Visual Question Builder', icon: <FileQuestion className="w-4 h-4" /> },
    { id: 'admin-requirements', label: 'Requirements Rules', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'admin-results', label: 'Results & Feedback', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-tight font-outfit uppercase">
                  Admin Console
                </h2>
                <span className="text-[10px] text-amber-400 font-semibold block uppercase tracking-wider">
                  AI SaaS Operations
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Management Portal
            </div>
            {adminMenuItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Dashboard</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold rounded-xl border border-red-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-slate-950 text-slate-100">
        <header className="bg-slate-900/80 border-b border-slate-800 py-3.5 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/40">
              System Admin Active
            </span>
            <span className="text-xs text-slate-400 truncate hidden sm:inline">
              Superuser Control Panel & AI Analytics
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-300">{user?.name}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
