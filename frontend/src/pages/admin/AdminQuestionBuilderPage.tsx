import React, { useState, useEffect } from 'react';
import { Plus, GitBranch } from 'lucide-react';
import type { Question, QuestionType } from '../../types';
import { adminService } from '../../services/adminService';

export const AdminQuestionBuilderPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<QuestionType>('radio');
  const [required, setRequired] = useState(true);
  const [optionsText, setOptionsText] = useState('Option 1\nOption 2\nOption 3');
  const [hasCondition, setHasCondition] = useState(false);
  const [parentQId, setParentQId] = useState('');
  const [conditionVal, setConditionVal] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await adminService.getQuestions();
      setQuestions(data);
    }
    loadData();
  }, []);

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = optionsText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => ({ label: line.trim(), value: line.trim() }));

    const newQ: Question = {
      id: `q-custom-${Date.now()}`,
      assessmentTypeId: 'cat-academic',
      questionText: qText,
      type: qType,
      required,
      order: questions.length + 1,
      options: opts.length > 0 ? opts : undefined,
      categorySection: 'Custom Section',
      condition: hasCondition && parentQId ? {
        dependsOnQuestionId: parentQId,
        operator: 'equals',
        value: conditionVal
      } : undefined
    };

    setQuestions([...questions, newQ]);
    setBuilderOpen(false);
    setQText('');
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Visual Question Builder & Logic Engine
          </span>
          <h1 className="text-2xl font-extrabold text-white font-outfit">Visual Question Builder</h1>
        </div>
        <button
          onClick={() => setBuilderOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                  #{idx + 1}
                </span>
                <span className="font-bold text-white text-xs">{q.questionText}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                  {q.type}
                </span>
                {q.required ? (
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[10px]">Required</span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 font-bold text-[10px]">Optional</span>
                )}
              </div>
            </div>

            {/* Conditional Logic Flag */}
            {q.condition && (
              <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-[11px] text-indigo-300 flex items-center space-x-2">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  <strong>Conditional Logic:</strong> Display IF Question (ID: {q.condition.dependsOnQuestionId}) == "{q.condition.value}"
                </span>
              </div>
            )}

            {q.options && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {q.options.map((opt) => (
                  <span key={opt.value} className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px]">
                    {opt.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Visual Question Modal Form */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base font-outfit">Visual Question Builder</h3>
            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Question Text *</label>
                <input
                  type="text"
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. What is the main problem you are experiencing?"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Input Type *</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as QuestionType)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                  >
                    <option value="text">Single Line Text</option>
                    <option value="long_text">Long Textarea</option>
                    <option value="radio">Radio Buttons (Single)</option>
                    <option value="checkbox">Checkboxes (Multiple)</option>
                    <option value="dropdown">Dropdown List</option>
                    <option value="number">Number Input</option>
                    <option value="date">Date Picker</option>
                    <option value="rating_scale">Rating Scale (1-10)</option>
                    <option value="yes_no">Yes / No</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                      className="rounded"
                    />
                    <span>Required Question</span>
                  </label>
                </div>
              </div>

              {(qType === 'radio' || qType === 'checkbox' || qType === 'dropdown') && (
                <div>
                  <label className="block text-slate-400 mb-1">Options (One per line) *</label>
                  <textarea
                    rows={3}
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px]"
                  />
                </div>
              )}

              {/* Conditional Logic Configuration Section */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="flex items-center space-x-2 text-amber-400 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCondition}
                    onChange={(e) => setHasCondition(e.target.checked)}
                  />
                  <span>Enable Conditional Display Rule (IF / THEN)</span>
                </label>

                {hasCondition && (
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block mb-1">IF Question (Select Parent)</span>
                      <select
                        value={parentQId}
                        onChange={(e) => setParentQId(e.target.value)}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg"
                      >
                        <option value="">-- Choose Parent Question --</option>
                        {questions.map((pq) => (
                          <option key={pq.id} value={pq.id}>{pq.questionText}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Equals Answer Value</span>
                      <input
                        type="text"
                        value={conditionVal}
                        onChange={(e) => setConditionVal(e.target.value)}
                        placeholder="e.g. Time management"
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBuilderOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
