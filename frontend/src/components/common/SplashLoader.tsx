import React, { useState, useEffect } from 'react';
import { Stethoscope, BrainCircuit, Sparkles, ShieldCheck, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

interface SplashLoaderProps {
  onComplete: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing Medical Knowledge Base...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);

        if (next < 30) {
          setStatusMessage('Initializing Medical Knowledge Base...');
        } else if (next < 60) {
          setStatusMessage('Configuring Nigerian Healthcare Protocols...');
        } else if (next < 90) {
          setStatusMessage('Loading AI Neural Diagnostic Engine...');
        } else {
          setStatusMessage('System Ready • Welcome Zainab Sulaiman');
        }

        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(onComplete, 600);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 font-sans text-white transition-opacity duration-700 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse delay-1000"></div>

      {/* Main Glass Card Container */}
      <div className="relative z-10 max-w-2xl w-full mx-4 p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Academic Spotlight Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-emerald-900/20">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>A Project by Zainab Sulaiman</span>
        </div>

        {/* Central Logo & Neural Pulse Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-3xl bg-emerald-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 relative z-10">
            <Stethoscope className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-md">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Project Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl font-extrabold font-outfit text-white tracking-tight leading-snug max-w-lg">
            Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria
          </h1>
          <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">
            AI-Powered Clinical Decision Support • Automated Symptom Analysis & Drug Prescriptions
          </p>
        </div>

        {/* Dynamic Cool Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-lg text-[11px] font-bold">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300 flex items-center space-x-1.5 justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Symptom NLP</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300 flex items-center space-x-1.5 justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Severity Scale 1-10</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300 flex items-center space-x-1.5 justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Drug Rx Engine</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300 flex items-center space-x-1.5 justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Nigeria Health DB</span>
          </div>
        </div>

        {/* Progress Bar & Status Display */}
        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{statusMessage}</span>
            </span>
            <span className="text-emerald-400 font-mono font-extrabold">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full p-0.5 border border-slate-800 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-200 shadow-md shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 300);
          }}
          className="text-slate-500 hover:text-emerald-400 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors pt-2"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer Credentials Note */}
      <div className="absolute bottom-6 z-10 flex items-center space-x-2 text-[11px] text-slate-500 font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Academic Project Submission • Zainab Sulaiman</span>
      </div>
    </div>
  );
};
