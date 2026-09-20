import React from 'react';
import { 
  FileDown, 
  Table as TableIcon, 
  Bookmark, 
  Menu,
  ChevronRight,
  Database,
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
      px-6 py-4 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-md
      ${isDark ? 'bg-[#0a0d14]/90 border-[#1e2942]' : 'bg-white/90 border-slate-200'}
    `}>
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 text-slate-400"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs md:text-sm font-medium">
          <span className="text-slate-400 hover:text-slate-200 transition-colors">Analytics</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${
            isDark 
              ? 'bg-[#141d33] border-[#243355] text-indigo-300' 
              : 'bg-slate-100 border-slate-200 text-indigo-700'
          }`}>
            {currentFileName}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Save to DB button */}
        <button
          onClick={onSave}
          className={`
            hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
            ${saveSuccess 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
              : isDark 
                ? 'bg-[#141b30] border-[#253252] text-slate-300 hover:bg-[#1b2542] hover:text-white' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }
          `}
          title="Save calculation to MongoDB / Local Storage"
        >
          {saveSuccess ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5 text-slate-400" />
              <span>Save</span>
            </>
          )}
        </button>

        {/* Export CSV button */}
        <button
          onClick={onExportCsv}
          className={`
            hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
            ${isDark 
              ? 'bg-[#141b30] border-[#253252] text-slate-300 hover:bg-[#1b2542] hover:text-white' 
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }
          `}
          title="Export CSV dataset"
        >
          <TableIcon className="h-3.5 w-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>

        {/* Export PDF button matching video */}
        <button
          onClick={onExportPdf}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border border-slate-600/50 shadow-sm transition-all"
        >
          <FileDown className="h-3.5 w-3.5 text-indigo-300" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
