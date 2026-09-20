import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const FactorTable = ({ calculation }) => {
  const { isDark } = useTheme();

  if (!calculation || !calculation.factors) return null;

  return (
    <div className={`
      rounded-xl border overflow-hidden my-4 transition-colors
      ${isDark ? 'bg-[#111827] border-[#26324A]' : 'bg-white border-slate-200 shadow-sm'}
    `}>
      {/* Table Header Section */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
        isDark ? 'border-[#202C45]' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-2.5">
          <h2 className={`text-sm font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Detailed Factor Breakdown
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
            7 Life Factors
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Precision: <span className="text-slate-200">0.001</span>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          {/* Table Column Headers */}
          <thead>
            <tr className={`border-b text-[11px] font-semibold tracking-wider uppercase font-mono ${
              isDark ? 'bg-[#0E1526] border-[#202C45] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <th scope="col" className="py-2.5 px-4 text-center w-12 text-slate-500 font-medium">#</th>
              <th scope="col" className="py-2.5 px-5">Life Factor</th>
              
              {/* MOTHER INFLUENCE Header */}
              <th scope="col" className="py-2.5 px-5 text-right text-rose-400 font-semibold">
                Mother Influence
              </th>

              {/* FATHER INFLUENCE Header */}
              <th scope="col" className="py-2.5 px-5 text-right text-blue-400 font-semibold">
                Father Influence
              </th>

              <th scope="col" className="py-2.5 px-5 text-right text-slate-300 font-semibold">
                Total Combined
              </th>
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody className={`divide-y font-mono ${isDark ? 'divide-[#1A253D]' : 'divide-slate-200'}`}>
            {calculation.factors.map((factor, index) => {
              const isMotherHigher = factor.motherValue > factor.fatherValue;

              return (
                <tr 
                  key={factor.id || index}
                  className={`
                    transition-colors duration-100
                    ${isDark ? 'hover:bg-[#151E33]' : 'hover:bg-slate-50'}
                  `}
                >
                  {/* # Index */}
                  <td className="py-2.5 px-4 text-center text-slate-500 text-xs font-normal">
                    {index + 1}
                  </td>

                  {/* Life Factor Name */}
                  <td className="py-2.5 px-5 font-sans font-medium text-slate-200 text-xs md:text-sm">
                    {factor.name}
                  </td>

                  {/* Mother Value */}
                  <td className={`py-2.5 px-5 text-right tabular-nums text-xs md:text-sm ${
                    isMotherHigher ? 'text-rose-400 font-bold' : 'text-slate-300'
                  }`}>
                    {factor.motherValue.toFixed(3)}
                  </td>

                  {/* Father Value */}
                  <td className={`py-2.5 px-5 text-right tabular-nums text-xs md:text-sm ${
                    !isMotherHigher ? 'text-blue-400 font-bold' : 'text-slate-300'
                  }`}>
                    {factor.fatherValue.toFixed(3)}
                  </td>

                  {/* Total Combined */}
                  <td className="py-2.5 px-5 text-right tabular-nums text-slate-200 font-semibold text-xs md:text-sm">
                    {factor.totalValue.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: Total Row */}
          <tfoot>
            <tr className={`
              border-t-2 font-mono font-bold text-xs md:text-sm
              ${isDark ? 'bg-[#0E1526] border-[#22304F]' : 'bg-slate-100 border-slate-300'}
            `}>
              <td className="py-3 px-4 text-center text-slate-500"></td>
              <td className="py-3 px-5 tracking-wider uppercase font-sans font-bold text-slate-100">
                Total Combined
              </td>
              
              {/* Mother Total */}
              <td className="py-3 px-5 text-right tabular-nums text-rose-400 font-bold">
                {calculation.motherTotal.toFixed(3)}
              </td>

              {/* Father Total */}
              <td className="py-3 px-5 text-right tabular-nums text-blue-400 font-bold">
                {calculation.fatherTotal.toFixed(3)}
              </td>

              {/* Grand Total Invariant = 100.000 */}
              <td className="py-3 px-5 text-right tabular-nums text-red-400 font-bold text-sm md:text-base">
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
