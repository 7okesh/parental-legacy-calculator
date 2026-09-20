import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Disc } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const FactorCharts = ({ calculation }) => {
  const { isDark } = useTheme();
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'radar' | 'donut'

  if (!calculation || !calculation.factors) return null;

  // Format data for Recharts
  const barData = calculation.factors.map(f => ({
    name: f.name.length > 15 ? f.name.substring(0, 13) + '...' : f.name,
    fullName: f.name,
    Mother: f.motherValue,
    Father: f.fatherValue,
    Total: f.totalValue
  }));

  const radarData = calculation.factors.map(f => ({
    factor: f.name,
    Mother: f.motherValue,
    Father: f.fatherValue,
    fullMark: 12
  }));

  const pieData = [
    { name: 'Mother Influence', value: calculation.motherTotal, color: '#ec4899' },
    { name: 'Father Influence', value: calculation.fatherTotal, color: '#6366f1' }
  ];

  return (
    <div className={`
      p-6 rounded-2xl border transition-all duration-200 my-6 shadow-xl shadow-black/20
      ${isDark ? 'bg-[#0f1527] border-[#1e2a47]' : 'bg-white border-slate-200'}
    `}>
      {/* Visual Analytics Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-inherit gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Parental Factor Visualizations</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Interactive
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual comparison of maternal vs paternal contribution across all 7 life factors.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className={`inline-flex p-1 rounded-xl border ${isDark ? 'bg-[#141d33] border-[#222e4d]' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'bar' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Comparison</span>
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'radar' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Disc className="h-3.5 w-3.5" />
            <span>Radar Map</span>
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'donut' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="h-3.5 w-3.5" />
            <span>Distribution</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                angle={-15} 
                textAnchor="end"
                interval={0}
              />
              <YAxis 
                domain={[0, 12]} 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  borderColor: '#374151',
                  borderRadius: '12px',
                  color: '#f3f4f6',
                  fontSize: '12px'
                }} 
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Mother" fill="#ec4899" radius={[4, 4, 0, 0]} name="Mother Influence" />
              <Bar dataKey="Father" fill="#6366f1" radius={[4, 4, 0, 0]} name="Father Influence" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'radar' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="factor" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 11]} stroke="#475569" />
              <Radar name="Mother Influence" dataKey="Mother" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
              <Radar name="Father Influence" dataKey="Father" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              <Legend verticalAlign="top" height={36} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  borderColor: '#374151',
                  borderRadius: '12px',
                  color: '#f3f4f6',
                  fontSize: '12px'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'donut' && (
          <div className="h-full flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => `${Number(val).toFixed(3)}%`}
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      borderColor: '#374151',
                      borderRadius: '12px',
                      color: '#f3f4f6',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <div className="h-3 w-3 rounded-full bg-pink-500" />
                <div>
                  <div className="font-bold text-pink-400">Mother Total Influence</div>
                  <div className="text-white text-sm font-extrabold">{calculation.motherTotal.toFixed(3)}% ({calculation.motherInfluence}%)</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                <div>
                  <div className="font-bold text-indigo-400">Father Total Influence</div>
                  <div className="text-white text-sm font-extrabold">{calculation.fatherTotal.toFixed(3)}% ({calculation.fatherInfluence}%)</div>
                </div>
              </div>

              <div className="text-slate-400 text-[11px] pt-1">
                Invariant Verification: {calculation.motherTotal.toFixed(3)} + {calculation.fatherTotal.toFixed(3)} = <span className="text-rose-400 font-bold">100.000%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactorCharts;
