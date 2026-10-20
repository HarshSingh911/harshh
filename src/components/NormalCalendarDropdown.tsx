import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface NormalCalendarDropdownProps {
  selectedDate: string; // ISO format e.g. '2026-10-15'
  minDate?: string; // ISO format e.g. '2026-10-17'
  onSelectDate: (isoDate: string) => void;
  onClose: () => void;
  alignRight?: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseIso(str: string): Date {
  if (!str) return new Date(2026, 9, 15);
  const parts = str.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date(2026, 9, 15);
}

export const NormalCalendarDropdown: React.FC<NormalCalendarDropdownProps> = ({
  selectedDate,
  minDate = '2026-10-15',
  onSelectDate,
  onClose,
  alignRight = false,
}) => {
  const initial = parseIso(selectedDate);
  const [viewMonth, setViewMonth] = useState<number>(initial.getMonth());
  const [viewYear, setViewYear] = useState<number>(initial.getFullYear());

  const minDateObj = parseIso(minDate);
  minDateObj.setHours(0, 0, 0, 0);

  const selDateObj = parseIso(selectedDate);
  selDateObj.setHours(0, 0, 0, 0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${
        alignRight ? 'right-0' : 'left-0'
      } top-full mt-2 w-72 sm:w-76 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-40 select-none animate-in fade-in zoom-in-95 duration-100`}
    >
      {/* Month & Year Navigation Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={handlePrev}
          className="p-1 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          title="Previous Month"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs sm:text-sm font-bold text-slate-900">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="p-1 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          title="Next Month"
          aria-label="Next Month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAY_NAMES.map((d, idx) => (
          <span
            key={d}
            className={`text-[11px] font-semibold py-0.5 ${
              idx === 0 || idx === 6 ? 'text-rose-500' : 'text-slate-400'
            }`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const cellDate = new Date(viewYear, viewMonth, dayNum);
          cellDate.setHours(0, 0, 0, 0);

          const isPast = cellDate.getTime() < minDateObj.getTime();
          const isSelected = cellDate.getTime() === selDateObj.getTime();

          return (
            <button
              key={dayNum}
              type="button"
              disabled={isPast}
              onClick={(e) => {
                e.stopPropagation();
                const m = String(viewMonth + 1).padStart(2, '0');
                const d = String(dayNum).padStart(2, '0');
                onSelectDate(`${viewYear}-${m}-${d}`);
                onClose();
              }}
              className={`w-8 h-8 mx-auto flex items-center justify-center text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                isPast
                  ? 'text-slate-300 cursor-not-allowed bg-transparent'
                  : isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};
