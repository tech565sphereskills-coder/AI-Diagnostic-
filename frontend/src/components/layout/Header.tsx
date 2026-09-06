import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Shield,
  Stethoscope,
  X
} from 'lucide-react';
import type { ActivePage, User } from '../../types';

interface HeaderProps {
  onMenuToggle: () => void;
  onNavigate: (page: ActivePage) => void;
  onOpenNotifications: () => void;
  onOpenHelp: () => void;
  onLogout: () => void;
  unreadCount: number;
  user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  onNavigate,
  onOpenNotifications,
  onOpenHelp,
  onLogout,
  unreadCount,
  user
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || 'Zainab Sulaiman';
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const roleLabel =
    user?.role === 'admin'
      ? 'System Administrator'
      : (user?.role as string) === 'doctor'
      ? 'Doctor / Medical Practitioner'
      : 'Registered User / Patient';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Branding & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-teal-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
              <Stethoscope className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-lg font-outfit truncate">
                  AI Diagnostic CDSS
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Nigeria Health
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Clinical Decision Support System
              </p>
            </div>
          </div>
        </div>

        {/* Center Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, assessments, symptoms..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Search"
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Help & System Info"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

          {/* User Profile Pill Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 transition-all text-left"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-extrabold text-xs border-2 border-emerald-400 shadow-xs shrink-0">
                {getInitials(displayName)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{displayName}</p>
                <p className="text-[10px] text-emerald-700 font-medium">{roleLabel}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p className="text-xs font-bold text-slate-900">{displayName}</p>
                  <p className="text-[10px] text-emerald-700 font-medium">{roleLabel}</p>
                </div>

                <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Account Menu
                </div>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 mr-2.5 text-slate-500" />
                  My Profile & Settings
                </button>

                <button
                  onClick={() => {
                    onOpenHelp();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Shield className="w-4 h-4 mr-2.5 text-slate-500" />
                  Security & Audit
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 animate-in slide-in-from-top-2 duration-150">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, assessments, symptoms..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

