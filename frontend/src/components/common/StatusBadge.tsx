import React from 'react';
import type { RiskLevel, UrgencyLevel } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, ShieldX } from 'lucide-react';

interface StatusBadgeProps {
  type: 'risk' | 'priority' | 'status';
  value: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'md' }) => {
  const getBadgeStyle = () => {
    if (type === 'risk') {
      switch (value as RiskLevel) {
        case 'Low':
          return {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          };
        case 'Moderate':
          return {
            bg: 'bg-amber-50 text-amber-800 border-amber-200',
            icon: <Info className="w-3.5 h-3.5 mr-1 text-amber-600" />
          };
        case 'High':
          return {
            bg: 'bg-orange-50 text-orange-800 border-orange-200',
            icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-orange-600" />
          };
        case 'Critical':
          return {
            bg: 'bg-red-100 text-red-900 border-red-300 font-semibold animate-pulse-subtle',
            icon: <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-700" />
          };
        default:
          return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
      }
    }

    if (type === 'priority') {
      switch (value as UrgencyLevel) {
        case 'Routine':
          return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
        case 'Recommended':
          return { bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: null };
        case 'Urgent':
          return { bg: 'bg-amber-50 text-amber-800 border-amber-300 font-medium', icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" /> };
        case 'Emergency':
          return { bg: 'bg-red-100 text-red-900 border-red-300 font-semibold', icon: <ShieldX className="w-3.5 h-3.5 mr-1 text-red-700" /> };
        default:
          return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
      }
    }

    // Default status handling
    switch (value.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'accepted':
      case 'success':
      case 'normal':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3.5 h-3.5 mr-1" /> };
      case 'under review':
      case 'in progress':
      case 'pending':
      case 'abnormal':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: <Info className="w-3.5 h-3.5 mr-1" /> };
      case 'discharged':
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
      case 'failed':
      case 'rejected':
      case 'critical':
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: <ShieldAlert className="w-3.5 h-3.5 mr-1" /> };
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
    }
  };

  const style = getBadgeStyle();
  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses} font-medium`}>
      {style.icon}
      {value}
    </span>
  );
};
