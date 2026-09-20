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
  const [chartType, setChartType] = useState('bar');

  if (!calculation || !calculation.factors) return null;

  const barData = calculation.factors.map(f => ({
    name: f.name.length > 16 ? f.name.substring(0, 14) + '…' : f.name,
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
    { name: 'Mother Influence', value: calculation.motherTotal, color: '#F43F5E' },
    { name: 'Father Influence', value: calculation.fatherTotal, color: '#3B82F6' }
  ];

  return (
    <div className={`
      p-5 rounded-xl border transition-colors my-4
      ${isDark ? 'bg-[#111827] border-[#26324A]' : 'bg-white border-slate-200 shadow-sm'}
    `}>
      {/* Visual Analytics Header & Toggle */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3.5 border-b gap-3 ${
        isDark ? 'border-[#202C45]' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-sm font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Parental Contribution Visualizations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparative analysis of maternal vs paternal balance across all 7 life factors.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className={`inline-flex p-1 rounded-lg border ${isDark ? 'bg-[#151D2F] border-[#26324A]' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Comparison</span>
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              chartType === 'radar' 
                ? 'bg-blue-600 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Disc className="h-3.5 w-3.5" />
            <span>Radar Map</span>
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              chartType === 'donut' 
                ? 'bg-blue-600 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="h-3.5 w-3.5" />
            <span>Distribution</span>
          </button>
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="h-68 w-full pt-1" style={{ minHeight: '260px' }}>
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }} 
                angle={-10} 
                textAnchor="end"
                interval={0}
              />
              <YAxis 
                domain={[0, 12]} 
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#151D2F', 
                  borderColor: '#26324A',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }} 
              />
              <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Mother" fill="#F43F5E" radius={[2, 2, 0, 0]} name="Mother Influence" />
              <Bar dataKey="Father" fill="#3B82F6" radius={[2, 2, 0, 0]} name="Father Influence" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'radar' && (
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#26324A" />
              <PolarAngleAxis dataKey="factor" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 11]} stroke="#334155" tick={{ fill: '#64748B', fontSize: 9 }} />
              <Radar name="Mother Influence" dataKey="Mother" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.25} />
              <Radar name="Father Influence" dataKey="Father" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
              <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#151D2F', 
                  borderColor: '#26324A',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'donut' && (
          <div className="h-full flex flex-col md:flex-row items-center justify-center gap-8 py-2">
            <div className="h-52 w-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => `${Number(val).toFixed(3)}%`}
                    contentStyle={{ 
                      backgroundColor: '#151D2F', 
                      borderColor: '#26324A',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-[#151D2F] border border-[#26324A]">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Mother Total Contribution</div>
                  <div className="text-rose-400 font-bold">{calculation.motherTotal.toFixed(3)}%</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-[#151D2F] border border-[#26324A]">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Father Total Contribution</div>
                  <div className="text-blue-400 font-bold">{calculation.fatherTotal.toFixed(3)}%</div>
                </div>
              </div>

              <div className="text-slate-400 text-[11px] pt-1">
                Sum: {calculation.motherTotal.toFixed(3)} + {calculation.fatherTotal.toFixed(3)} = <span className="text-emerald-400 font-semibold">100.000%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactorCharts;
