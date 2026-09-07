import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { ActivePage } from '../types';

interface LoginPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);

  useEffect(() => {
    const regEmail = sessionStorage.getItem('registered_email');
    const regMsg = sessionStorage.getItem('registered_success_msg');
    if (regEmail) {
      setEmail(regEmail);
      setPassword('');
      if (regMsg) setSuccessMessage(regMsg);
      sessionStorage.removeItem('registered_email');
      sessionStorage.removeItem('registered_success_msg');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@aidiagnostic.ng');
      setPassword('password123');
    } else {
      setEmail('user@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="max-w-4xl w-full bg-slate-950 rounded-2xl sm:rounded-3xl border border-emerald-900/30 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px] sm:min-h-[580px]">
        {/* Left Side Branding */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden text-white border-b lg:border-b-0 lg:border-r border-emerald-900/40">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4 sm:space-y-6">
            {/* Top Logo */}
            <div
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold font-outfit tracking-tight block">AI Diagnostic</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block -mt-1">
                  CDSS System
                </span>
              </div>
            </div>

            {/* Academic Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Project by Zainab Sulaiman</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-outfit text-white">Sign In to Your Account</h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed opacity-90">
                Access structured clinical assessments, validation engine checks, AI diagnostic predictions, and healthcare recommendations tailored for Nigeria.
              </p>
            </div>

            {/* Feature Highlights (Hidden on small phone screens to reduce scroll height) */}
            <div className="hidden sm:block space-y-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-900/40 text-xs flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>3-Stage Decision Flow (Collect → Validate → Analyze)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-900/40 text-xs flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-teal-300 flex-shrink-0" />
                <span>FastAPI + SQLite/PostgreSQL Ready Architecture</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-4 lg:mt-0 border-t border-emerald-900/40 text-[11px] text-slate-400 flex items-center justify-between gap-1">
            <span>Healthcare CDSS Project</span>
            <span className="text-emerald-400 font-bold font-mono">v2.0.0</span>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="lg:col-span-6 p-5 sm:p-8 lg:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-outfit">Sign In</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enter your account credentials to continue.</p>
            </div>

            {/* Quick Demo Autofill */}
            <div className="mb-5 p-3 sm:p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">Demo Autofill</span>
                <span className="text-slate-600 text-[11px]">User or Admin Account</span>
              </div>
              <div className="flex space-x-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('user')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Registration Success Notification Banner */}
            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in duration-200 shadow-xs">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* API Error Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-emerald-600 hover:underline font-bold"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 sm:py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 text-center text-xs">
            <span className="text-slate-500">Don't have an account yet? </span>
            <button
              onClick={() => onNavigate('register')}
              className="text-emerald-600 font-bold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-slate-900 text-xs shadow-2xl border border-slate-200">
            <h4 className="font-bold text-base font-outfit text-slate-900">Forgot Password</h4>
            <p className="text-slate-600">Enter your email address to receive password reset instructions.</p>
            <input
              type="email"
              placeholder="user@example.com"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setForgotOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Password reset link sent to your email.');
                  setForgotOpen(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

