import React from 'react';
import { FolderOpen, SearchX, FileQuestion, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'folder' | 'search' | 'file';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder',
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 my-4">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
        {icon === 'search' && <SearchX className="w-7 h-7" />}
        {icon === 'folder' && <FolderOpen className="w-7 h-7" />}
        {icon === 'file' && <FileQuestion className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
