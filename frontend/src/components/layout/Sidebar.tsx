import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Award,
  User,
  HelpCircle,
  Settings,
  LogOut,
  BrainCircuit,
  ShieldCheck,
  X,
  ChevronRight
} from 'lucide-react';
import type { ActivePage, User as UserType } from '../../types';

interface SidebarProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  user: UserType | null;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  user,
  onLogout,
  mobileOpen,
  onCloseMobile
}) => {
  const menuItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'intro', label: 'New Assessment', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'history', label: 'Assessment History', icon: <History className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Award className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'help', label: 'Help Center', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight font-outfit">
              AI Diagnostic
            </h2>
            <span className="text-[10px] text-indigo-400 font-semibold block uppercase tracking-wider">
              Recommendation Engine
            </span>
          </div>
        </div>
        <button onClick={onCloseMobile} className="lg:hidden text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Main Navigation
        </div>
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
            </button>
          );
        })}

        {/* Admin Portal Toggle (If Admin Role) */}
        {user?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <button
              onClick={() => {
                onNavigate('admin-dashboard');
                onCloseMobile();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Switch to Admin Portal</span>
            </button>
          </div>
        )}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User avatar"
            className="w-9 h-9 rounded-xl object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize">{user?.role || 'user'} Account</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-800 hover:bg-red-950/50 hover:text-red-300 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-40 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative z-10 flex-1 max-w-xs w-full bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
