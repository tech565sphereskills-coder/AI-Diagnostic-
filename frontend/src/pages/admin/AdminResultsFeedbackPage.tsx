import React from 'react';
import { Star } from 'lucide-react';

export const AdminResultsFeedbackPage: React.FC = () => {
  const feedbacks = [
    { id: 'fb-1', user: 'Alex Johnson', assessment: 'Academic Problem Assessment', result: 'Time Management Challenges', rating: 5, isHelpful: true, comment: 'Extremely accurate recommendations! The weekly study plan schedule worked immediately.', date: '2026-03-01' },
    { id: 'fb-2', user: 'Sarah Connor', assessment: 'Technology Troubleshooting', result: 'PostgreSQL Connection Exhaustion', rating: 4, isHelpful: true, comment: 'PgBouncer recommendation fixed our server timeout.', date: '2026-02-21' }
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
            System Quality Assurance
          </span>
          <h1 className="text-2xl font-extrabold text-white font-outfit">AI Results & Feedback Analytics</h1>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm font-outfit block">{fb.user}</span>
                <span className="text-[10px] text-slate-400">{fb.assessment} • {fb.date}</span>
              </div>
              <div className="flex items-center space-x-1 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{fb.rating} / 5</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Generated Result</span>
              <strong className="text-white text-xs block">{fb.result}</strong>
            </div>

            <p className="text-slate-300 italic">"{fb.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};
