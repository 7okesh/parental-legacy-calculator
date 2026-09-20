import React from 'react';
import { Activity, ShieldCheck, Heart, Crown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MetricCards = ({ calculation }) => {
  const { isDark } = useTheme();

  if (!calculation) return null;

  const isMotherDominant = calculation.dominantParent === 'Mother';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {/* Card 1: MOTHER'S INFLUENCE */}
      <div className={`
        relative overflow-hidden p-5 rounded-2xl border transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-b from-[#131b30] to-[#0f1526] border-[#222e4d] shadow-lg shadow-black/20' 
          : 'bg-white border-slate-200 shadow-sm'
        }
        ${isMotherDominant ? 'ring-1 ring-pink-500/40' : ''}
      `}>
        {/* Glow ambient background */}
        <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none ${
          isMotherDominant ? 'bg-pink-500/15' : 'bg-pink-500/5'
        }`} />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
            MOTHER'S INFLUENCE
          </span>
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
            <Heart className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-white">
            {calculation.motherInfluence.toFixed(2)}
          </div>
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Activity className="h-3.5 w-3.5 text-pink-400 animate-pulse" />
            <span className="font-mono">{calculation.motherTotal.toFixed(3)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-600 to-rose-400 transition-all duration-500 rounded-full"
            style={{ width: `${calculation.motherInfluence}%` }}
          />
        </div>
      </div>

      {/* Card 2: FATHER'S INFLUENCE */}
      <div className={`
        relative overflow-hidden p-5 rounded-2xl border transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-b from-[#131b30] to-[#0f1526] border-[#222e4d] shadow-lg shadow-black/20' 
          : 'bg-white border-slate-200 shadow-sm'
        }
        ${!isMotherDominant ? 'ring-1 ring-indigo-500/40' : ''}
      `}>
        <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none ${
          !isMotherDominant ? 'bg-indigo-500/15' : 'bg-indigo-500/5'
        }`} />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
            FATHER'S INFLUENCE
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-white">
            {calculation.fatherInfluence.toFixed(2)}
          </div>
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Activity className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="font-mono">{calculation.fatherTotal.toFixed(3)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-400 transition-all duration-500 rounded-full"
            style={{ width: `${calculation.fatherInfluence}%` }}
          />
        </div>
      </div>

      {/* Card 3: DOMINANT PARENT */}
      <div className={`
        relative overflow-hidden p-5 rounded-2xl border transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-b from-[#131b30] to-[#0f1526] border-[#222e4d] shadow-lg shadow-black/20' 
          : 'bg-white border-slate-200 shadow-sm'
        }
      `}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
            DOMINANT PARENT
          </span>
          <div className={`p-2 rounded-xl ${
            isMotherDominant ? 'bg-pink-500/10 text-pink-400' : 'bg-indigo-500/10 text-indigo-400'
          }`}>
            <Crown className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
            isMotherDominant ? 'text-pink-400' : 'text-indigo-400'
          }`}>
            {calculation.dominantParent}
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-emerald-400 border border-emerald-500/20">
            {calculation.differencePercentage}% Difference
          </div>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Parity: Day {calculation.day} ({calculation.isOddDay ? 'Odd Day' : 'Even Day'})</span>
          <span className="text-slate-500">Target: 100.000</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
