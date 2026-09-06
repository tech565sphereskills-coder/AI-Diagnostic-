import React from 'react';

export const AdminRequirementsPage: React.FC = () => {
  const requirementRules = [
    { id: 'req-1', category: 'Academic Problems', rule: 'Must answer Problem Type, Duration, and Study Hours', status: 'Active' },
    { id: 'req-2', category: 'Career Guidance', rule: 'Must specify Current Role and Transition Target', status: 'Active' },
    { id: 'req-3', category: 'Technology Troubleshooting', rule: 'Must state System Type and Error Symptom', status: 'Active' },
    { id: 'req-4', category: 'General Problem Solving', rule: 'Must provide Dilemma Summary and Desired Goal', status: 'Active' }
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Rule Source of Truth
          </span>
          <h1 className="text-2xl font-extrabold text-white font-outfit">Assessment Requirements Rules</h1>
        </div>
      </div>

      <div className="space-y-3">
        {requirementRules.map((r) => (
          <div key={r.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-bold text-white text-xs block">{r.category}</span>
              <p className="text-slate-400 text-[11px]">{r.rule}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
