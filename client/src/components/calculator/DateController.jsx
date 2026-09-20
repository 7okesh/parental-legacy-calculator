import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { parseDDMMYYYY, formatDateToDDMMYYYY } from '../../utils/dateUtils';

const DateController = ({ 
  currentDob, 
  onDateChange, 
  onUpdateLogic, 
  isCalculating, 
  allowFutureDates = true,
  setAllowFutureDates
}) => {
  const { isDark } = useTheme();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  // Current view month & year in calendar
  const initialDate = parseDDMMYYYY(currentDob) || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Close calendar on outside click
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

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Days calculations
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
      p-5 md:p-6 rounded-2xl border transition-all duration-200
      ${isDark 
        ? 'bg-gradient-to-r from-[#111728] via-[#141d33] to-[#111728] border-[#222e4d] shadow-xl shadow-black/20' 
        : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200 shadow-sm'
      }
    `}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title & Description */}
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Dynamic Analysis Logic</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-medium">
              Vedic Engine v2.4
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Changing the candidate's Date of Birth will automatically recalculate maternal/paternal dominance limits.
          </p>
        </div>

        {/* Date Selector and Update Logic Button matching video */}
        <div className="flex items-center space-x-3 shrink-0 relative" ref={calendarRef}>
          {/* Custom Date Input Trigger */}
          <div className="relative">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className={`
                flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs md:text-sm font-mono font-medium border transition-all duration-200
                ${isDark 
                  ? 'bg-[#151e36] border-[#263559] text-slate-100 hover:border-indigo-500/60 shadow-inner' 
                  : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-500 shadow-sm'
                }
              `}
            >
              <CalendarIcon className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="tracking-wider">{currentDob || 'Select DOB'}</span>
            </button>

            {/* Interactive Calendar Dropdown Popup */}
            {calendarOpen && (
              <div className={`
                absolute right-0 top-full mt-2 z-50 w-72 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95
                ${isDark 
                  ? 'bg-[#12192e]/95 border-[#28375e] text-slate-100 shadow-indigo-950/40' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/60'
                }
              `}>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-inherit">
                  <span className="font-semibold text-sm">
                    {monthNames[viewMonth]} {viewYear}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
                  {daysOfWeek.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-7 w-7" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNumber = i + 1;
                    const isSelected = selectedDateObj &&
                      selectedDateObj.getDate() === dayNumber &&
                      selectedDateObj.getMonth() === viewMonth &&
                      selectedDateObj.getFullYear() === viewYear;

                    const isEven = dayNumber % 2 === 0;

                    return (
                      <button
                        key={dayNumber}
                        type="button"
                        onClick={() => handleSelectDay(dayNumber)}
                        className={`
                          h-7 w-7 rounded-lg flex items-center justify-center font-mono font-medium transition-all
                          ${isSelected 
                            ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/40' 
                            : isDark 
                              ? 'text-slate-300 hover:bg-[#1f2a48] hover:text-white' 
                              : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                          }
                        `}
                      >
                        {dayNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Footer Buttons */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-inherit text-xs">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-slate-400 hover:text-rose-400 px-2 py-1 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleSetToday}
                    className="text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Update Logic Button matching video's purple gradient button */}
          <button
            onClick={onUpdateLogic}
            disabled={isCalculating}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-white 
              bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500
              shadow-lg shadow-indigo-600/30 active:scale-95 transition-all duration-150 shrink-0
              ${isCalculating ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            <Sparkles className={`h-4 w-4 ${isCalculating ? 'animate-spin' : 'animate-pulse'}`} />
            <span>Update Logic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateController;
