import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { AssessmentType } from '../../types';
import { adminService } from '../../services/adminService';

export const AdminAssessmentTypesPage: React.FC = () => {
  const [types, setTypes] = useState<AssessmentType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'academic' | 'career' | 'technology' | 'general'>('academic');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function loadTypes() {
      const data = await adminService.getAssessmentTypes();
      setTypes(data);
    }
    loadTypes();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newType: AssessmentType = {
      id: `cat-${Date.now()}`,
      name,
      category,
      description,
      estimatedMinutes: 7,
      questionCount: 5,
      active: true,
      iconName: 'BrainCircuit',
      requiredInfoList: ['Primary Description', 'Duration']
    };
    setTypes([...types, newType]);
    setModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Category Configuration
          </span>
          <h1 className="text-2xl font-extrabold text-white font-outfit">Assessment Types Manager</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assessment Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((t) => (
          <div key={t.id} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm font-outfit">{t.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                t.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
              }`}>
                {t.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">{t.description}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              <span>Category: <strong className="text-slate-300 capitalize">{t.category}</strong></span>
              <span>{t.questionCount} Questions</span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-base font-outfit">Create Assessment Type</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                >
                  <option value="academic">Academic</option>
                  <option value="career">Career</option>
                  <option value="technology">Technology</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
