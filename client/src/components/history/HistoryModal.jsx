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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className={`
        w-full max-w-xl max-h-[80vh] flex flex-col p-6 rounded-2xl border shadow-2xl transition-all
        ${isDark ? 'bg-[#111728] border-[#253355] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Assessment Reports & History</h3>
              <p className="text-xs text-slate-400">Archived parental legacy calculations</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={fetchHistoryData}
              title="Refresh records"
              className="p-1.5 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto my-4 space-y-2.5 pr-1 flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Loading saved assessments...
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Database className="h-8 w-8 text-slate-500 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">No Saved Calculations Yet</div>
              <div className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Click the "Save" button in the top bar to save any assessment session.
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
                    p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-150
                    ${isDark 
                      ? 'bg-[#141d33] border-[#222e4d] hover:border-indigo-500/50 hover:bg-[#18233d]' 
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-500 hover:bg-slate-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0
                      ${isMother ? 'bg-pink-500/20 text-pink-400' : 'bg-indigo-500/20 text-indigo-400'}
                    `}>
                      {isMother ? 'M' : 'F'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-white">{record.dob}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isMother ? 'bg-pink-500/10 text-pink-400' : 'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {record.dominantParent} Dominant
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>Mother: {record.motherTotal?.toFixed(2)}%</span>
                        <span>•</span>
                        <span>Father: {record.fatherTotal?.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="text-[11px] font-medium hidden sm:inline">Load</span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>{history.length} assessment record(s)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
