import React from 'react';
import { 
  FileDown, 
  Table as TableIcon, 
  Bookmark, 
  Menu,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ 
  currentFileName = 'Test.xlsx',
  onExportPdf, 
  onExportCsv, 
  onSave, 
  saveSuccess,
  setMobileOpen 
}) => {
  const { isDark } = useTheme();

  return (
    <header className={`
      px-6 py-3.5 border-b flex items-center justify-between sticky top-0 z-30
      ${isDark ? 'bg-[#0B1020]/95 border-[#202C45] backdrop-blur-md' : 'bg-white/95 border-slate-200 backdrop-blur-md'}
    `}>
      {/* Left: Mobile menu toggle + Workspace Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
          aria-label="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs md:text-sm font-medium">
          <span className="text-slate-400">Analytics</span>
          <span className="text-slate-600 font-mono">/</span>
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono border ${
            isDark 
              ? 'bg-[#151D2F] border-[#26324A] text-slate-200' 
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <FileSpreadsheet className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>{currentFileName}</span>
          </div>
        </div>
      </div>

      {/* Right: Realistic Enterprise Action Toolbar */}
      <div className="flex items-center space-x-2">
        {/* Save to Records */}
        <button
          onClick={onSave}
          className={`
            hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
            ${saveSuccess 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : isDark 
                ? 'bg-[#151D2F] border-[#26324A] text-slate-300 hover:bg-[#1E293B] hover:text-white' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }
          `}
          title="Save calculation to assessment records"
        >
          {saveSuccess ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5 text-slate-400" />
              <span>Save Record</span>
            </>
          )}
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCsv}
          className={`
            hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
            ${isDark 
              ? 'bg-[#151D2F] border-[#26324A] text-slate-300 hover:bg-[#1E293B] hover:text-white' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }
          `}
          title="Download dataset as CSV"
        >
          <TableIcon className="h-3.5 w-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>

        {/* Export PDF (Primary Action) */}
        <button
          onClick={onExportPdf}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 shadow-sm transition-colors"
          title="Download formal assessment report"
        >
          <FileDown className="h-3.5 w-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
