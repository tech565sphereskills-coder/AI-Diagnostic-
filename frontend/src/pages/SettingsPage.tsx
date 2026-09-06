import React, { useState } from 'react';
import { Sun, Moon, Monitor, Bell, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<'Light' | 'Dark' | 'System'>('Light');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
          System Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Customize your theme, display preferences, and notifications.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Settings saved!</span>
        </div>
      )}

      <div className="space-y-6 text-xs">
        {/* Theme Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Theme Preference
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Light', label: 'Light Theme', icon: <Sun className="w-5 h-5 text-amber-500" /> },
              { id: 'Dark', label: 'Dark Theme', icon: <Moon className="w-5 h-5 text-indigo-400" /> },
              { id: 'System', label: 'System Default', icon: <Monitor className="w-5 h-5 text-slate-500" /> }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${
                  theme === t.id
                    ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {t.icon}
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2 flex items-center">
            <Bell className="w-4 h-4 text-indigo-600 mr-2" />
            Notifications & Email Digest
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Assessment Completion Email Alerts</span>
                <span className="text-[11px] text-slate-500">Receive an email when AI analysis generates recommendations.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
