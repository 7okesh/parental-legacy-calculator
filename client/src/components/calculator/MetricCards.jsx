import React from 'react';
import { Users, Shield, Scale } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MetricCards = ({ calculation }) => {
  const { isDark } = useTheme();

  if (!calculation) return null;

  const isMotherDominant = calculation.dominantParent === 'Mother';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-4">
      {/* Card 1: MOTHER'S INFLUENCE */}
      <div className={`
        p-4 rounded-xl border transition-colors
        ${isDark 
          ? 'bg-[#111827] border-[#26324A]' 
          : 'bg-white border-slate-200 shadow-sm'
        }
      `}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Mother's Influence
          </span>
          <div className={`p-1.5 rounded-md ${isDark ? 'bg-[#182238] text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
            <Users className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold tracking-tight font-mono ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {calculation.motherInfluence.toFixed(2)}%
          </div>
          <div className="text-xs font-mono text-slate-400">
            Exact: <span className="font-semibold text-rose-400">{calculation.motherTotal.toFixed(3)}</span>
          </div>
        </div>

        {/* Analytical Indicator Bar */}
        <div className="mt-3.5 w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-500 rounded-full transition-all duration-200"
            style={{ width: `${calculation.motherInfluence}%` }}
          />
        </div>
      </div>

      {/* Card 2: FATHER'S INFLUENCE */}
      <div className={`
        p-4 rounded-xl border transition-colors
        ${isDark 
          ? 'bg-[#111827] border-[#26324A]' 
          : 'bg-white border-slate-200 shadow-sm'
        }
      `}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Father's Influence
          </span>
          <div className={`p-1.5 rounded-md ${isDark ? 'bg-[#182238] text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Shield className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold tracking-tight font-mono ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {calculation.fatherInfluence.toFixed(2)}%
          </div>
          <div className="text-xs font-mono text-slate-400">
            Exact: <span className="font-semibold text-blue-400">{calculation.fatherTotal.toFixed(3)}</span>
          </div>
        </div>

        {/* Analytical Indicator Bar */}
        <div className="mt-3.5 w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-200"
            style={{ width: `${calculation.fatherInfluence}%` }}
          />
        </div>
      </div>

      {/* Card 3: DOMINANT PARENT */}
      <div className={`
        p-4 rounded-xl border transition-colors
        ${isDark 
          ? 'bg-[#111827] border-[#26324A]' 
          : 'bg-white border-slate-200 shadow-sm'
        }
      `}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Dominant Parent
          </span>
          <div className={`p-1.5 rounded-md ${isDark ? 'bg-[#182238] text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
            <Scale className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className={`text-3xl font-bold tracking-tight ${
            isMotherDominant ? 'text-rose-400' : 'text-blue-400'
          }`}>
            {calculation.dominantParent}
          </div>
          <div className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            +{calculation.differencePercentage}% Delta
          </div>
        </div>

        <div className="mt-3.5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Day {calculation.day} ({calculation.isOddDay ? 'Odd Parity' : 'Even Parity'})</span>
          <span className="text-slate-500">Target: 100.000</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
