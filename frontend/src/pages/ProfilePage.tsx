import React, { useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import type { User as UserType } from '../types';

interface ProfilePageProps {
  user: UserType | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [email, setEmail] = useState(user?.email || 'alex.johnson@example.com');
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">My Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your personal information and security credentials.</p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Personal Info & Security Sections */}
      <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
        {/* Section 1: Personal Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Security */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2 flex items-center">
            <Lock className="w-4 h-4 text-indigo-600 mr-2" />
            Security & Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Account Stats */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Account Metadata
          </h3>
          <div className="grid grid-cols-2 gap-4 text-slate-700">
            <div><span className="text-slate-400 block text-[10px]">ACCOUNT CREATION DATE</span><strong>{user?.createdAt || '2026-01-15'}</strong></div>
            <div><span className="text-slate-400 block text-[10px]">COMPLETED ASSESSMENTS</span><strong className="text-indigo-600">{user?.assessmentCount || 4} Assessments</strong></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
