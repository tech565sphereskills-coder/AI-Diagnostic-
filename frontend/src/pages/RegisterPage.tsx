import React, { useState } from 'react';
import {
  BrainCircuit,
  Lock,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { ActivePage } from '../types';

interface RegisterPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password Requirement Checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Calculate Strength
  const getPasswordStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    if (password.length >= 12) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();
  const isFormValid = hasMinLength && hasNumber && hasSpecialChar && passwordsMatch && fullName.trim() && email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMessage('');
    setLoading(true);

    try {
      await register(fullName, email, password);
      sessionStorage.setItem('registered_email', email);
      sessionStorage.setItem('registered_success_msg', 'Account registered successfully! Please sign in with your credentials to validate your account.');
      onNavigate('login');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="max-w-4xl w-full bg-slate-950 rounded-2xl sm:rounded-3xl border border-emerald-900/30 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side Branding */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 p-5 sm:p-8 flex flex-col justify-between text-white relative border-b lg:border-b-0 lg:border-r border-emerald-900/40">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4 sm:space-y-6">
            <div
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold font-outfit tracking-tight block">AI Diagnostic</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block -mt-1">
                  CDSS System
                </span>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Project by Zainab Sulaiman</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-outfit text-white">Create Your Account</h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed opacity-90">
                Register to access guided clinical assessments, decision support predictions, and personalized healthcare recommendations.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-4 lg:mt-0 border-t border-emerald-900/40 text-[11px] text-slate-400">
            © 2026 Zainab Sulaiman • Healthcare CDSS Project
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:col-span-7 p-5 sm:p-8 bg-white flex flex-col justify-between text-xs">
          <div>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-outfit">Register Account</h3>
              <p className="text-slate-500 mt-0.5">Enter your details to register as a user.</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Zainab Sulaiman"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all text-xs"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-700">Password Strength:</span>
                  <span className={`font-bold ${
                    strengthScore >= 3 ? 'text-emerald-600' : strengthScore >= 2 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {strengthScore >= 3 ? 'Strong' : strengthScore >= 2 ? 'Moderate' : 'Weak'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5">
                  <div className={`rounded-full ${strengthScore >= 1 ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
                  <div className={`rounded-full ${strengthScore >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
                  <div className={`rounded-full ${strengthScore >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                  <div className={`rounded-full ${strengthScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                </div>

                {/* Password Requirements Checkbox List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-600 pt-1">
                  <div className="flex items-center space-x-1">
                    {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>At least one number</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {hasSpecialChar ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>One special character</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {passwordsMatch ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-center">
            <span className="text-slate-500">Already have an account? </span>
            <button onClick={() => onNavigate('login')} className="text-emerald-600 font-bold hover:underline">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

