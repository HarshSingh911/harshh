import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Check,
  TrendingDown,
  Info,
} from 'lucide-react';

export interface TripDatePickerModalProps {
  selectedDateStr: string; // e.g. '2026-10-18' or '18 Oct 2026'
  title?: string;
  subtitle?: string;
  minDateStr?: string; // e.g. '2026-10-15'
  onSelectDate: (formattedDate: string, rawIsoDate: string) => void;
  onClose: () => void;
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

// Helper to parse loose date string
function parseLooseDate(str: string): Date {
  if (!str) return new Date(2026, 9, 18);
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }
  // Try formats like "18 Oct 2026" or "2026/10/18"
  const parsed = new Date(str + (str.includes('T') ? '' : ' 00:00:00'));
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date(2026, 9, 18);
}

function formatFriendlyDateStr(d: Date): string {
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatIsoStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Generate realistic low fares for calendar dates (TripYeah dynamic calendar pricing)
function getIndicativeFare(day: number, month: number): { priceStr: string; isLowest: boolean; tag?: string } {
  // Deterministic calculation based on day and month
  const seed = (day * 37 + month * 19) % 100;
  if (seed < 22) {
    return { priceStr: '₹2,990', isLowest: true, tag: 'Saver' };
  } else if (seed < 48) {
    return { priceStr: '₹3,450', isLowest: true };
  } else if (seed < 75) {
    return { priceStr: '₹4,120', isLowest: false };
  } else {
    return { priceStr: '₹4,890', isLowest: false, tag: 'Popular' };
  }
}

export const TripDatePickerModal: React.FC<TripDatePickerModalProps> = ({
  selectedDateStr,
  title = 'Select Travel Date',
  subtitle = 'Find lowest fares & guaranteed seat availability across dates',
  minDateStr,
  onSelectDate,
  onClose,
}) => {
  const initialDate = parseLooseDate(selectedDateStr);
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [pickedDate, setPickedDate] = useState<Date>(initialDate);

  const minDate = minDateStr ? parseLooseDate(minDateStr) : new Date(2026, 9, 1);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Days calculations
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Quick date shortcuts
  const handleQuickSelect = (daysOffset: number) => {
    const target = new Date(2026, 9, 17); // base anchor
    target.setDate(target.getDate() + daysOffset);
    setPickedDate(target);
    setCurrentMonth(target.getMonth());
    setCurrentYear(target.getFullYear());
  };

  const handleConfirm = () => {
    onSelectDate(formatFriendlyDateStr(pickedDate), formatIsoStr(pickedDate));
    onClose();
  };

  const pickedFare = getIndicativeFare(pickedDate.getDate(), pickedDate.getMonth());

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col my-auto">
        {/* Header - TripYeah Brand Design */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30 shadow-xs">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg text-white">
                  {title}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 text-[10px] font-bold border border-blue-400/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Live Fares
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Calendar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Date Shortcuts Bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar bg-slate-50/70">
          <button
            type="button"
            onClick={() => handleQuickSelect(0)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Today (17 Oct)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(1)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Tomorrow (18 Oct)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(7)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition-colors whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Next Weekend (24 Oct)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(14)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            +2 Weeks (31 Oct)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(21)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Diwali Week (Nov)
          </button>
        </div>

        {/* Calendar Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Month & Year Navigation Header + Fare Legend */}
          <div className="flex items-center justify-between pb-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="font-display font-black text-base sm:text-lg text-slate-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Fare Legend */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-150">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Lowest Fares</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Standard</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Weekend Peak</span>
            </span>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold">
            {DAY_NAMES.map((dn, idx) => (
              <span
                key={dn}
                className={`text-xs py-1 ${
                  idx === 0 || idx === 6 ? 'text-rose-600 font-extrabold' : 'text-slate-400 font-bold'
                }`}
              >
                {dn}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full h-13" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(currentYear, currentMonth, dayNum);
              const isSelected =
                pickedDate.getDate() === dayNum &&
                pickedDate.getMonth() === currentMonth &&
                pickedDate.getFullYear() === currentYear;

              const isPast = dateObj.getTime() < minDate.getTime();
              const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
              const fareInfo = getIndicativeFare(dayNum, currentMonth);

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => setPickedDate(dateObj)}
                  className={`h-13 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer relative border ${
                    isPast
                      ? 'border-transparent text-slate-300 cursor-not-allowed opacity-35 bg-slate-50'
                      : isSelected
                      ? 'bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-300 scale-102 z-10'
                      : isWeekend
                      ? 'border-rose-100 bg-rose-50/40 text-slate-800 hover:border-blue-300 hover:bg-blue-50'
                      : fareInfo.isLowest
                      ? 'border-emerald-100 bg-emerald-50/30 text-slate-800 hover:border-blue-300 hover:bg-blue-50'
                      : 'border-slate-100 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs ${isSelected ? 'font-black text-white' : 'font-bold'}`}>
                    {dayNum}
                  </span>
                  
                  {/* Fare Tag underneath */}
                  {!isPast && (
                    <span
                      className={`text-[9px] font-mono leading-none mt-0.5 ${
                        isSelected
                          ? 'text-blue-100 font-bold'
                          : fareInfo.isLowest
                          ? 'text-emerald-600 font-bold'
                          : isWeekend
                          ? 'text-rose-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {fareInfo.priceStr}
                    </span>
                  )}

                  {/* Dot indicator for lowest fares */}
                  {fareInfo.isLowest && !isPast && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-500 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Preview Bar */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/90 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <span className="text-[10px] text-blue-700 font-black uppercase tracking-wider block">
                Selected Journey Date:
              </span>
              <span className="font-display font-black text-sm sm:text-base text-blue-950 truncate block">
                {formatFriendlyDateStr(pickedDate)} ({pickedDate.toLocaleDateString('en-US', { weekday: 'long' })})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Starting from</span>
                <span className="font-mono font-black text-blue-700 text-xs sm:text-sm">
                  {pickedFare.priceStr}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs shadow-xs">
                ✓ Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Best price guarantee applied</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Apply Travel Date</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
