import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const FactorTable = ({ calculation }) => {
  const { isDark } = useTheme();

  if (!calculation || !calculation.factors) return null;

  return (
    <div className={`
      rounded-2xl border overflow-hidden transition-all duration-200 my-6 shadow-xl shadow-black/20
      ${isDark ? 'bg-[#0f1527] border-[#1e2a47]' : 'bg-white border-slate-200'}
    `}>
      {/* Table Header Section */}
      <div className="px-6 py-4 border-b border-inherit flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-white flex items-center space-x-2">
          <span>Detailed Factor Breakdown</span>
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] px-2.5 py-1 rounded-md font-mono bg-slate-800 text-slate-300 border border-slate-700">
            Precision: 3 Decimals
          </span>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          {/* Table Column Headers */}
          <thead>
            <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#141d33] border-[#1e2a47] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <th scope="col" className="py-3.5 px-4 text-center w-12">#</th>
              <th scope="col" className="py-3.5 px-6">LIFE FACTOR</th>
              
              {/* MOTHER INFLUENCE column header with pink accent badge matching video */}
              <th scope="col" className="py-3.5 px-6 text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20">
                  MOTHER INFLUENCE
                </span>
              </th>

              {/* FATHER INFLUENCE column header with indigo accent badge matching video */}
              <th scope="col" className="py-3.5 px-6 text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                  FATHER INFLUENCE
                </span>
              </th>

              <th scope="col" className="py-3.5 px-6 text-right font-bold text-slate-300">
                TOTAL COMBINED
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-inherit">
            {calculation.factors.map((factor, index) => {
              const isMotherHigher = factor.motherValue > factor.fatherValue;

              return (
                <tr 
                  key={factor.id || index}
                  className={`
                    transition-colors duration-150
                    ${isDark ? 'hover:bg-[#151f38]' : 'hover:bg-slate-50'}
                  `}
                >
                  {/* # Index */}
                  <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                    {index + 1}
                  </td>

                  {/* Life Factor Name */}
                  <td className="py-3 px-6 font-semibold text-slate-200">
                    {factor.name}
                  </td>

                  {/* Mother Value */}
                  <td className={`py-3 px-6 text-right font-mono font-bold ${
                    isMotherHigher ? 'text-pink-400 font-extrabold' : 'text-slate-300'
                  }`}>
                    {factor.motherValue.toFixed(3)}
                  </td>

                  {/* Father Value */}
                  <td className={`py-3 px-6 text-right font-mono font-bold ${
                    !isMotherHigher ? 'text-indigo-400 font-extrabold' : 'text-slate-300'
                  }`}>
                    {factor.fatherValue.toFixed(3)}
                  </td>

                  {/* Total Combined */}
                  <td className="py-3 px-6 text-right font-mono font-bold text-slate-200">
                    {factor.totalValue.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: TOTAL Row */}
          <tfoot>
            <tr className={`
              border-t-2 font-mono font-extrabold text-sm md:text-base
              ${isDark ? 'bg-[#12192d] border-[#223154]' : 'bg-slate-100 border-slate-300'}
            `}>
              <td className="py-4 px-4 text-center text-slate-500"></td>
              <td className="py-4 px-6 tracking-wider font-extrabold text-white uppercase">
                TOTAL
              </td>
              
              {/* Mother Total */}
              <td className="py-4 px-6 text-right font-extrabold text-pink-400">
                {calculation.motherTotal.toFixed(3)}
              </td>

              {/* Father Total */}
              <td className="py-4 px-6 text-right font-extrabold text-indigo-400">
                {calculation.fatherTotal.toFixed(3)}
              </td>

              {/* Grand Total - 100.000 in red font matching video and Excel! */}
              <td className="py-4 px-6 text-right font-black text-rose-500 text-base md:text-lg tracking-tight">
                {calculation.grandTotal.toFixed(3)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default FactorTable;
