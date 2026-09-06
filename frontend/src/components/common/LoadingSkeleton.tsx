import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
          <div className="h-4 bg-slate-200 rounded w-1/5"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-6 bg-slate-200 rounded-full w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center space-x-4">
      <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-40 bg-white rounded-xl border border-slate-200"></div>
      <div className="h-40 bg-white rounded-xl border border-slate-200"></div>
      <div className="h-40 bg-white rounded-xl border border-slate-200"></div>
    </div>
  </div>
);
