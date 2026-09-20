import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { parseDDMMYYYY, formatDateToDDMMYYYY } from '../../utils/dateUtils';

const DateController = ({ 
  currentDob, 
  onDateChange, 
  onUpdateLogic, 
  isCalculating
}) => {
  const { isDark } = useTheme();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  const initialDate = parseDDMMYYYY(currentDob) || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    const selectedDate = new Date(viewYear, viewMonth, day);
    const formatted = formatDateToDDMMYYYY(selectedDate);
    onDateChange(formatted);
    setCalendarOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    const formatted = formatDateToDDMMYYYY(today);
    onDateChange(formatted);
    setCalendarOpen(false);
  };

  const handleClear = () => {
    onDateChange('');
    setCalendarOpen(false);
  };

  const selectedDateObj = parseDDMMYYYY(currentDob);

  return (
    <div className={`
      rounded-xl border transition-all duration-150 overflow-hidden
      ${isDark ? 'bg-[#111827] border-[#26324A]' : 'bg-white border-slate-200 shadow-sm'}
    `}>
      {/* Engine Control Bar */}
      <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title & Engine Metadata */}
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className={`text-base md:text-lg font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Dynamic Analysis Engine
            </h1>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              isDark ? 'bg-[#151D2F] border-[#2B3A5A] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              Vedic Analysis Engine v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Changing the candidate's Date of Birth will automatically recalculate maternal/paternal dominance limits.
          </p>
        </div>

        {/* Date Selector & Action */}
        <div className="flex items-center space-x-2.5 shrink-0 relative" ref={calendarRef}>
          {/* Custom Date Input */}
          <div className="relative">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className={`
                flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-mono font-medium border transition-colors
                ${isDark 
                  ? 'bg-[#151D2F] border-[#26324A] text-slate-200 hover:border-slate-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400'
                }
              `}
              title="Select Candidate Date of Birth"
            >
              <CalendarIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{currentDob || 'DD/MM/YYYY'}</span>
            </button>

            {/* Calendar Popup */}
            {calendarOpen && (
              <div className={`
                absolute right-0 top-full mt-1.5 z-50 w-64 p-3.5 rounded-xl border shadow-xl
                ${isDark ? 'bg-[#151D2F] border-[#2B3A5A] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}
              `}>
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-inherit">
                  <span className="font-semibold text-xs text-slate-200">
                    {monthNames[viewMonth]} {viewYear}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-1">
                  {daysOfWeek.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6 w-6" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNumber = i + 1;
                    const isSelected = selectedDateObj &&
                      selectedDateObj.getDate() === dayNumber &&
                      selectedDateObj.getMonth() === viewMonth &&
                      selectedDateObj.getFullYear() === viewYear;

                    return (
                      <button
                        key={dayNumber}
                        type="button"
                        onClick={() => handleSelectDay(dayNumber)}
                        className={`
                          h-6 w-6 rounded flex items-center justify-center font-mono text-xs transition-colors
                          ${isSelected 
                            ? 'bg-blue-600 text-white font-bold' 
                            : isDark 
                              ? 'text-slate-300 hover:bg-[#1E293B] hover:text-white' 
                              : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                          }
                        `}
                      >
                        {dayNumber}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-inherit text-[11px]">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleSetToday}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Update Logic Primary Action */}
          <button
            onClick={onUpdateLogic}
            disabled={isCalculating}
            className={`
              flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white 
              bg-blue-600 hover:bg-blue-500 border border-blue-500 shadow-sm transition-colors shrink-0
              ${isCalculating ? 'opacity-60 cursor-wait' : ''}
            `}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>Update Logic</span>
          </button>
        </div>
      </div>

      {/* Subtle Technical Telemetry Strip */}
      <div className={`px-5 py-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono ${
        isDark ? 'bg-[#0E1526] border-[#202C45] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center space-x-4">
          <span>Source: <strong className="text-slate-300 font-normal">Test.xlsx</strong></span>
          <span className="text-slate-600">•</span>
          <span>Factors Evaluated: <strong className="text-slate-300 font-normal">7</strong></span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline">Engine: <strong className="text-slate-300 font-normal">Parity Dominance</strong></span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Precision: <strong className="text-slate-300 font-normal">3 Decimals</strong></span>
          <span className="text-slate-600">•</span>
          <span>Target Sum: <strong className="text-emerald-400 font-normal">100.000</strong></span>
        </div>
      </div>
    </div>
  );
};

export default DateController;
