import React, { useState } from 'react';
import { BrainCircuit, Sparkles, ArrowRight, GraduationCap, Menu, X, Home, Layers, Compass, LogIn, LayoutDashboard } from 'lucide-react';
import type { ActivePage } from '../../types';

interface NavbarProps {
  onNavigate: (page: ActivePage) => void;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isAuthenticated }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleAnchorClick = (e: React.MouseEvent, page: ActivePage, anchorId?: string) => {
    e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-extrabold text-slate-900 tracking-tight font-outfit">
                AI Diagnostic CDSS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold hidden sm:inline-block">
                Nigeria Healthcare
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block -mt-0.5">
              By <strong className="text-indigo-600">Zainab Sulaiman</strong>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
          <a href="#home" onClick={(e) => handleAnchorClick(e, 'landing')} className="hover:text-emerald-600 transition-colors">
            Home
          </a>
          <a href="#about-project" onClick={(e) => handleAnchorClick(e, 'landing', 'about-project')} className="hover:text-emerald-600 transition-colors flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Research Background</span>
          </a>
          <a href="#features" onClick={(e) => handleAnchorClick(e, 'landing', 'features')} className="hover:text-emerald-600 transition-colors">
            System Features
          </a>
          <a href="#how-it-works" onClick={(e) => handleAnchorClick(e, 'landing', 'how-it-works')} className="hover:text-emerald-600 transition-colors">
            How It Works
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          {isAuthenticated ? (
            <button
              onClick={() => handleNavClick('dashboard')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 text-slate-700 hover:text-emerald-600 font-bold transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center space-x-2">
          {isAuthenticated && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={(e) => handleAnchorClick(e, 'landing')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>Home</span>
            </button>
            <button
              onClick={(e) => handleAnchorClick(e, 'landing', 'about-project')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Research Background</span>
            </button>
            <button
              onClick={(e) => handleAnchorClick(e, 'landing', 'features')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span>System Features</span>
            </button>
            <button
              onClick={(e) => handleAnchorClick(e, 'landing', 'how-it-works')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>How It Works</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <span>Access Clinical Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-slate-700 hover:bg-slate-100 font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 text-sm border border-slate-200"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

