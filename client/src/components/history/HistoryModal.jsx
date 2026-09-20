import React, { useState, useEffect } from 'react';
import { FileText, X, Clock, Calendar, ChevronRight, Database, RefreshCw } from 'lucide-react';
import { getHistoryFromServer } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const HistoryModal = ({ isOpen, onClose, onLoadRecord }) => {
  const { isDark } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      // 1. Try server
      const res = await getHistoryFromServer();
      if (res && res.data && res.data.length > 0) {
        setHistory(res.data);
      } else {
        // 2. Fallback to localStorage
        const local = JSON.parse(localStorage.getItem('qv_saved_calculations') || '[]');
        setHistory(local);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('qv_saved_calculations') || '[]');
      setHistory(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistoryData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className={`
        w-full max-w-xl max-h-[80vh] flex flex-col p-6 rounded-xl border shadow-2xl transition-all
        ${isDark ? 'bg-[#111827] border-[#26324A] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">Historical Records & Audits</h3>
              <p className="text-xs text-slate-400">Archived parental legacy assessment runs</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={fetchHistoryData}
              title="Refresh records"
              className="p-1.5 rounded-lg hover:bg-[#1E293B] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1E293B] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto my-4 space-y-2 pr-1 flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Loading assessment records...
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Database className="h-7 w-7 text-slate-500 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">No Archived Calculations</div>
              <div className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Click "Save" in the top bar to commit calculations to database records.
              </div>
            </div>
          ) : (
            history.map((record, index) => {
              const isMother = record.dominantParent === 'Mother';
              return (
                <div
                  key={record._id || index}
                  onClick={() => {
                    onLoadRecord(record);
                    onClose();
                  }}
                  className={`
                    p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors
                    ${isDark 
                      ? 'bg-[#151D2F] border-[#1E293B] hover:border-blue-500/50 hover:bg-[#18233C]' 
                      : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-slate-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      h-8 w-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border
                      ${isMother 
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      }
                    `}>
                      {isMother ? 'M' : 'F'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold text-xs text-slate-200">{record.dob}</span>
                        <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
                          isMother 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {record.dominantParent} Dominant
                        </span>
                      </div>
                      <div className="text-[11px] font-mono tabular-nums text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>Mother: {record.motherTotal?.toFixed(3)}%</span>
                        <span className="text-slate-600">•</span>
                        <span>Father: {record.fatherTotal?.toFixed(3)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="text-xs font-medium text-slate-400 hover:text-blue-400 hidden sm:inline">Load</span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="font-mono text-[11px]">{history.length} archived record(s)</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#26324A] text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
