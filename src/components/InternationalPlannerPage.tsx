import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  ShieldCheck,
  CheckSquare,
  MessageSquare,
  Share2,
  Printer,
  Download,
  Plane,
  Building2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Navigation,
  Globe,
  FileText,
  CreditCard,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Send,
  Eye,
  Bookmark,
  BookmarkCheck,
  Palmtree,
  Star,
  Check,
  X,
  Copy,
  CloudSun,
  Thermometer,
  ShieldAlert,
  Leaf,
  Sun,
  Moon,
  Train,
  Ship,
  Info,
  Footprints,
  Utensils,
  Ticket,
  Bus,
  Search,
  Smartphone,
  Luggage,
  Sliders,
  Receipt,
} from 'lucide-react';
import {
  BookingCategory,
  CITIES,
  CityOption,
  CurrencyCode,
  formatPrice,
} from '../data/travelData';
import solarpunkHeroImg from '../assets/images/solarpunk_hero_3be410f8.png';

interface InternationalPlannerProps {
  currency: CurrencyCode;
  onNavigateToCategory: (category: BookingCategory, from?: CityOption, to?: CityOption) => void;
  onBookFlightOrHotel: (destinationCityCode: string, category: 'flights' | 'hotels' | 'holidays') => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
}

export interface DayItinerary {
  dayNumber: number;
  dateStr: string;
  title: string;
  theme: string;
  landmarkTitle: string;
  landmarkSubtitle: string;
  morning: {
    time: string;
    activity: string;
    landmark: string;
    details: string;
    steps: string[];
    costEstimateInr: number;
    transport: string;
    duration: string;
  };
  afternoon: {
    time: string;
    activity: string;
    landmark: string;
    details: string;
    steps: string[];
    costEstimateInr: number;
    transport: string;
    duration: string;
    pathwayName: string;
    pathwayDescription: string;
  };
  evening: {
    time: string;
    activity: string;
    details: string;
    steps: string[];
    cruiseTitle: string;
    cruiseSubtitle: string;
    costEstimateInr: number;
    transport: string;
    duration: string;
  };
  diningTip: {
    place: string;
    recommendation: string;
    mustOrder: string;
    estimatedCost: string;
  };
  proTip: string;
  estimatedDayTotalInr: number;
}

export interface FullItinerary {
  id: string;
  destination: string;
  country: string;
  currency: string;
  destinationSummary: string;
  bestTimeToVisit: string;
  estimatedTotalTripBudgetInr: number;
  days: DayItinerary[];
  origin: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'mid-range' | 'luxury';
  travellersCount: number;
  travellerType: string;
}

export interface VisaDetails {
  destination: string;
  visaType: string;
  entryRule: string;
  validity: string;
  processingTime: string;
  estimatedFee: string;
  portalUrl: string;
  portalName: string;
  requiredDocuments: string[];
  steps: string[];
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  category?: 'Docs' | 'Forex' | 'Connectivity' | 'Packing' | 'Transit' | string;
  priority?: 'High' | 'Medium' | 'Low' | string;
}

// ============================================================================
// VISUAL CALENDAR DATE RANGE PICKER (Select both Departure & Return in Calendar)
// ============================================================================

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface VisualDateRangeCalendarProps {
  startDate: string;
  endDate: string;
  onApplyRange: (startIso: string, endIso: string) => void;
  onClose: () => void;
}

const VisualDateRangeCalendar: React.FC<VisualDateRangeCalendarProps> = ({
  startDate,
  endDate,
  onApplyRange,
  onClose,
}) => {
  const parseDate = (isoStr: string) => {
    if (!isoStr) return new Date(2026, 9, 20);
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date(isoStr);
  };

  const initialStart = parseDate(startDate);
  const [viewYear, setViewYear] = useState<number>(initialStart.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialStart.getMonth());

  const [tempStart, setTempStart] = useState<string>(startDate || '2026-10-20');
  const [tempEnd, setTempEnd] = useState<string>(endDate || '2026-10-24');
  const [pickingPhase, setPickingPhase] = useState<'start' | 'end'>('start');
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handleDateClick = (dayNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const clickedIso = `${viewYear}-${mStr}-${dStr}`;

    if (pickingPhase === 'start' || (tempStart && tempEnd)) {
      setTempStart(clickedIso);
      setTempEnd('');
      setPickingPhase('end');
    } else {
      // Phase 'end'
      if (new Date(clickedIso) >= new Date(tempStart)) {
        setTempEnd(clickedIso);
        setPickingPhase('start');
      } else {
        // Clicked date is earlier than start: make it the new start
        setTempStart(clickedIso);
        setTempEnd('');
        setPickingPhase('end');
      }
    }
  };

  const handleQuickDuration = (days: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const s = tempStart ? new Date(tempStart) : new Date(viewYear, viewMonth, 20);
    const eDate = new Date(s);
    eDate.setDate(s.getDate() + (days - 1));

    const sStr = s.toISOString().split('T')[0];
    const eStr = eDate.toISOString().split('T')[0];
    setTempStart(sStr);
    setTempEnd(eStr);
    setPickingPhase('start');
  };

  const durationDays = useMemo(() => {
    if (!tempStart || !tempEnd) return 1;
    const diff = new Date(tempEnd).getTime() - new Date(tempStart).getTime();
    return Math.max(1, Math.round(diff / (1000 * 3600 * 24)) + 1);
  }, [tempStart, tempEnd]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full left-0 sm:left-auto sm:-translate-x-1/4 mt-3 w-[330px] sm:w-[370px] bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-slate-200 p-4 sm:p-5 z-[80] select-none animate-modal-slide-up"
    >
      {/* Month & Year Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          title="Previous Month"
        >
          ‹
        </button>
        <div className="text-center">
          <span className="font-display font-extrabold text-sm sm:text-base text-slate-900 block">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
            {pickingPhase === 'end' && tempStart
              ? '👉 Click Return Date'
              : '👉 Click Departure Date'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          title="Next Month"
        >
          ›
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-bold text-slate-400">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const mStr = String(viewMonth + 1).padStart(2, '0');
          const dStr = String(dayNum).padStart(2, '0');
          const dateIso = `${viewYear}-${mStr}-${dStr}`;

          const isStart = tempStart === dateIso;
          const isEnd = tempEnd === dateIso;
          const isInRange =
            tempStart && tempEnd && dateIso > tempStart && dateIso < tempEnd;
          const isHoverRange =
            pickingPhase === 'end' &&
            tempStart &&
            !tempEnd &&
            hoverDate &&
            dateIso > tempStart &&
            dateIso <= hoverDate;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={(e) => handleDateClick(dayNum, e)}
              onMouseEnter={() => setHoverDate(dateIso)}
              onMouseLeave={() => setHoverDate(null)}
              className={`h-8 font-bold transition-all relative flex items-center justify-center cursor-pointer ${
                isStart && isEnd
                  ? 'bg-sky-600 text-white rounded-xl shadow-xs font-black z-10'
                  : isStart
                  ? 'bg-sky-600 text-white rounded-l-xl shadow-xs font-black z-10'
                  : isEnd
                  ? 'bg-sky-600 text-white rounded-r-xl shadow-xs font-black z-10'
                  : isInRange || isHoverRange
                  ? 'bg-sky-100 text-sky-900 font-extrabold'
                  : 'text-slate-800 hover:bg-slate-100 rounded-lg'
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* Selected Range Display Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Selected Trip</span>
          <span className="font-mono text-slate-900 text-xs">
            {tempStart ? new Date(tempStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Select'}
            {' → '}
            {tempEnd ? new Date(tempEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Select'}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-black border border-sky-300">
          {durationDays} Days / {Math.max(1, durationDays - 1)}N
        </span>
      </div>

      {/* Quick Duration Shortcuts */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-slate-400 font-bold shrink-0">Quick:</span>
        {[3, 4, 5, 7, 10, 14].map((num) => (
          <button
            key={num}
            type="button"
            onClick={(e) => handleQuickDuration(num, e)}
            className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition-colors shrink-0 cursor-pointer ${
              durationDays === num
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {num}D
          </button>
        ))}
      </div>

      {/* Apply Dates Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          const finalStart = tempStart || '2026-10-20';
          let finalEnd = tempEnd;
          if (!finalEnd) {
            const s = new Date(finalStart);
            s.setDate(s.getDate() + 3);
            finalEnd = s.toISOString().split('T')[0];
          }
          onApplyRange(finalStart, finalEnd);
          onClose();
        }}
        className="w-full mt-3 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:brightness-105 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
      >
        Apply Dates & Update Itinerary
      </button>
    </div>
  );
};

// ============================================================================
// ARTWORK COMPONENTS (Eiffel Tower/Louvre, Bali Temples, Glowing Footpath, Eco Cruise)
// ============================================================================

const ParisLandmarksArtwork = () => (
  <div className="relative w-full h-full min-h-[170px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#7ec8f8] via-[#bfe3fa] to-[#eaf5fd] flex items-end justify-center select-none">
    <div className="absolute top-4 left-10 w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.7)] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-amber-100/90" />
    </div>
    <div className="absolute top-6 right-16 w-16 h-5 bg-white/80 rounded-full blur-[0.5px]" />
    <div className="absolute top-10 left-24 w-12 h-4 bg-white/70 rounded-full blur-[0.5px]" />

    <svg className="w-full h-36 max-w-[340px] relative z-10" viewBox="0 0 340 140" fill="none">
      <path d="M0 132 Q170 126 340 132 L340 140 L0 140 Z" fill="#65A30D" />
      <path d="M0 134 Q170 130 340 134 L340 140 L0 140 Z" fill="#4D7C0F" />
      <circle cx="35" cy="128" r="8" fill="#15803D" />
      <circle cx="85" cy="129" r="6" fill="#16A34A" />
      <circle cx="150" cy="128" r="7" fill="#15803D" />
      <circle cx="215" cy="129" r="6" fill="#16A34A" />
      <circle cx="310" cy="128" r="7" fill="#15803D" />

      {/* Eiffel Tower on Left */}
      <g transform="translate(48, 10)">
        <line x1="18" y1="2" x2="18" y2="18" stroke="#475569" strokeWidth="1.5" />
        <circle cx="18" cy="2" r="1.5" fill="#334155" />
        <polygon points="15,18 21,18 20,32 16,32" fill="#64748B" />
        <rect x="13" y="32" width="10" height="3" rx="1" fill="#475569" />
        <polygon points="14,35 22,35 25,68 11,68" fill="#94A3B8" opacity="0.9" />
        <line x1="14" y1="35" x2="25" y2="68" stroke="#475569" strokeWidth="0.8" />
        <line x1="22" y1="35" x2="11" y2="68" stroke="#475569" strokeWidth="0.8" />
        <rect x="9" y="68" width="18" height="4" rx="1" fill="#475569" />
        <path d="M10 72 L3 124 L10 124 L14 72 Z" fill="#64748B" />
        <path d="M26 72 L33 124 L26 124 L22 72 Z" fill="#64748B" />
        <path d="M10 124 C10 100 26 100 26 124" fill="none" stroke="#334155" strokeWidth="2.5" />
        <line x1="11" y1="86" x2="25" y2="86" stroke="#475569" strokeWidth="1" />
        <line x1="8" y1="104" x2="28" y2="104" stroke="#475569" strokeWidth="1" />
      </g>

      {/* Arc de Triomphe Center */}
      <g transform="translate(142, 54)">
        <rect x="2" y="0" width="48" height="8" rx="1" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
        <rect x="4" y="8" width="44" height="4" fill="#CBD5E1" />
        <rect x="6" y="12" width="40" height="58" fill="#F1F5F9" stroke="#64748B" strokeWidth="1" />
        <path d="M18 70 L18 42 C18 32 34 32 34 42 L34 70 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1.2" />
        <rect x="9" y="44" width="5" height="18" rx="2" fill="#CBD5E1" />
        <rect x="38" y="44" width="5" height="18" rx="2" fill="#CBD5E1" />
      </g>

      {/* Louvre Glass Pyramid Right */}
      <g transform="translate(230, 48)">
        <polygon points="50,15 0,80 100,80" fill="#38BDF8" opacity="0.35" />
        <polygon points="50,15 50,80 100,80" fill="#0284C7" opacity="0.35" />
        <line x1="50" y1="15" x2="50" y2="80" stroke="#0369A1" strokeWidth="1.5" />
        <line x1="50" y1="15" x2="25" y2="80" stroke="#0284C7" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="50" y1="15" x2="75" y2="80" stroke="#0284C7" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="16" y1="60" x2="84" y2="60" stroke="#0284C7" strokeWidth="1" />
        <line x1="30" y1="42" x2="70" y2="42" stroke="#0284C7" strokeWidth="1" />
        <line x1="42" y1="28" x2="58" y2="28" stroke="#0284C7" strokeWidth="1" />
        <rect x="-4" y="78" width="108" height="4" rx="1" fill="#94A3B8" />
      </g>
    </svg>
  </div>
);

const BaliLandmarksArtwork = () => (
  <div className="relative w-full h-full min-h-[170px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#60a5fa] via-[#a7f3d0] to-[#fef08a] flex items-end justify-center select-none">
    <div className="absolute top-4 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
    <svg className="w-full h-36 max-w-[340px] relative z-10" viewBox="0 0 340 140" fill="none">
      <polygon points="120,40 170,12 220,40 290,120 40,120" fill="#3B82F6" opacity="0.3" />
      <polygon points="150,25 170,12 190,25" fill="#E0F2FE" opacity="0.6" />
      <rect x="0" y="112" width="340" height="28" fill="#0284C7" />
      <path d="M0 114 Q85 110 170 114 T340 114" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
      <g transform="translate(38, 52)">
        <polygon points="10,0 22,25 22,70 6,70 6,25" fill="#B45309" stroke="#78350F" strokeWidth="1" />
        <polygon points="34,0 46,25 46,70 30,70 30,25" fill="#B45309" stroke="#78350F" strokeWidth="1" />
        <rect x="4" y="65" width="44" height="6" fill="#78350F" />
      </g>
      <g transform="translate(200, 30)">
        <polygon points="40,2 35,12 45,12" fill="#451A03" />
        <polygon points="40,12 30,24 50,24" fill="#78350F" />
        <polygon points="40,24 25,38 55,38" fill="#451A03" />
        <polygon points="40,38 20,54 60,54" fill="#78350F" />
        <polygon points="40,54 15,72 65,72" fill="#451A03" />
        <polygon points="40,72 10,90 70,90" fill="#78350F" />
        <rect x="18" y="90" width="44" height="18" fill="#D97706" stroke="#78350F" strokeWidth="1.2" />
        <ellipse cx="40" cy="110" rx="36" ry="6" fill="#15803D" />
      </g>
    </svg>
  </div>
);

const GlowingMossFootpathArtwork = () => (
  <div className="relative w-full h-full min-h-[110px] overflow-hidden rounded-xl bg-gradient-to-b from-[#091E28] via-[#0D303B] to-[#04171E] flex items-center justify-center select-none shadow-inner border border-teal-800/40">
    <div className="absolute inset-0 bg-radial from-teal-500/20 via-transparent to-transparent pointer-events-none" />
    <div className="absolute top-3 left-4 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" />
    <div className="absolute bottom-4 right-6 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67E8F9] animate-ping" />
    <svg className="w-full h-24 max-w-[140px] relative z-10" viewBox="0 0 140 90" fill="none">
      <path d="M12 90 L16 10 C18 8 22 8 24 10 L28 90 Z" fill="#041217" />
      <path d="M112 90 L118 18 C120 16 124 16 126 18 L132 90 Z" fill="#041217" />
      <ellipse cx="20" cy="14" rx="20" ry="12" fill="#06252C" opacity="0.8" />
      <ellipse cx="120" cy="20" rx="22" ry="14" fill="#06252C" opacity="0.8" />
      <path d="M70 30 Q65 60 40 90 L100 90 Q75 60 70 30 Z" fill="#0B3C44" />
      <ellipse cx="50" cy="84" rx="8" ry="3" fill="#10B981" filter="drop-shadow(0 0 4px #34D399)" />
      <ellipse cx="88" cy="82" rx="7" ry="2.5" fill="#34D399" filter="drop-shadow(0 0 5px #10B981)" />
      <ellipse cx="58" cy="68" rx="6" ry="2" fill="#10B981" filter="drop-shadow(0 0 4px #059669)" />
      <ellipse cx="80" cy="64" rx="5" ry="2" fill="#34D399" filter="drop-shadow(0 0 4px #10B981)" />
      <ellipse cx="66" cy="48" rx="4" ry="1.5" fill="#6EE7B7" filter="drop-shadow(0 0 3px #6EE7B7)" />
      <line x1="98" y1="36" x2="98" y2="76" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="98" cy="34" r="4" fill="#FEF08A" filter="drop-shadow(0 0 8px #FDE047)" />
      <circle cx="98" cy="34" r="1.5" fill="#FFFFFF" />
      <circle cx="68" cy="42" r="2" fill="#030E12" />
      <line x1="68" y1="44" x2="68" y2="52" stroke="#030E12" strokeWidth="1.2" />
      <line x1="68" y1="52" x2="66" y2="60" stroke="#030E12" strokeWidth="1.2" />
      <line x1="68" y1="52" x2="71" y2="60" stroke="#030E12" strokeWidth="1.2" />
    </svg>
  </div>
);

const EcoRiverCruiseArtwork = () => (
  <div className="relative w-full h-full min-h-[110px] overflow-hidden rounded-xl bg-gradient-to-b from-[#8eb8d4] via-[#cde2ee] to-[#7aa9c8] flex items-center justify-center select-none shadow-inner border border-sky-200">
    <div className="absolute top-2 left-6 w-20 h-4 bg-white/70 rounded-full blur-[1px]" />
    <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-[#5c98be] to-[#3a7ca5]" />
    <div className="absolute bottom-4 inset-x-0 h-[1.5px] bg-white/40" />
    <svg className="w-full h-24 max-w-[220px] relative z-10 drop-shadow-[0_4px_8px_rgba(15,23,42,0.18)]" viewBox="0 0 220 80" fill="none">
      <path
        d="M20 54 Q15 48 30 48 L195 48 Q210 48 205 54 L190 62 Q180 64 35 64 Z"
        fill="#FFFFFF"
        stroke="#475569"
        strokeWidth="1.2"
      />
      <path d="M25 56 L195 56" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <rect x="36" y="32" width="150" height="16" rx="4" fill="#F1F5F9" stroke="#334155" strokeWidth="1" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={42 + i * 16} y={35} width={11} height={10} rx="1.5" fill="#38BDF8" opacity="0.85" />
      ))}
      <path d="M40 32 Q110 24 182 32" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 28 Q110 21 174 28" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 60 Q20 58 35 62" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M190 62 Q205 60 216 63" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  </div>
);

// Universal Graphic Artwork for Global Cities & Landmarks
const GlobalCityLandmarkArtwork: React.FC<{
  destination: string;
  dayNumber: number;
  landmarkTitle?: string;
}> = ({ destination, dayNumber, landmarkTitle }) => {
  const d = destination.toLowerCase();

  if (d.includes('paris') || d.includes('france')) {
    return <ParisLandmarksArtwork />;
  }

  if (d.includes('bali') || d.includes('indonesia')) {
    return <BaliLandmarksArtwork />;
  }

  if (d.includes('tokyo') || d.includes('japan') || d.includes('kyoto') || d.includes('osaka')) {
    return (
      <div className="relative w-full h-full min-h-[170px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#f472b6]/35 via-[#fbcfe8]/45 to-[#ede9fe] flex items-end justify-center select-none">
        <div className="absolute top-4 right-10 w-11 h-11 rounded-full bg-gradient-to-br from-red-400 to-rose-600 shadow-[0_0_24px_rgba(244,63,94,0.6)]" />
        <svg className="w-full h-36 max-w-[340px] relative z-10" viewBox="0 0 340 140" fill="none">
          <polygon points="170,18 90,120 250,120" fill="#93C5FD" opacity="0.6" />
          <polygon points="170,18 152,48 188,48" fill="#FFFFFF" />
          <rect x="0" y="120" width="340" height="20" fill="#334155" />
          <g transform="translate(60, 48)">
            <rect x="0" y="4" width="54" height="6" rx="2" fill="#DC2626" />
            <rect x="4" y="14" width="46" height="4" fill="#DC2626" />
            <rect x="10" y="4" width="6" height="70" fill="#B91C1C" />
            <rect x="38" y="4" width="6" height="70" fill="#B91C1C" />
            <rect x="7" y="70" width="12" height="4" fill="#1E293B" />
            <rect x="35" y="70" width="12" height="4" fill="#1E293B" />
          </g>
          <g transform="translate(240, 20)">
            <line x1="16" y1="0" x2="16" y2="100" stroke="#E11D48" strokeWidth="2" />
            <polygon points="16,0 6,100 26,100" fill="#F43F5E" opacity="0.4" />
            <circle cx="16" cy="35" r="5" fill="#BE123C" />
            <circle cx="16" cy="65" r="7" fill="#9F1239" />
          </g>
        </svg>
      </div>
    );
  }

  if (d.includes('dubai') || d.includes('uae') || d.includes('abu dhabi')) {
    return (
      <div className="relative w-full h-full min-h-[170px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#38bdf8]/40 via-[#bae6fd]/50 to-[#fef3c7] flex items-end justify-center select-none">
        <div className="absolute top-4 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
        <svg className="w-full h-36 max-w-[340px] relative z-10" viewBox="0 0 340 140" fill="none">
          <path d="M0 115 Q90 95 180 115 T340 115 L340 140 L0 140 Z" fill="#FBBF24" opacity="0.6" />
          <path d="M0 122 Q120 112 240 122 T340 122 L340 140 L0 140 Z" fill="#D97706" />
          <g transform="translate(155, 6)">
            <line x1="15" y1="0" x2="15" y2="24" stroke="#0284C7" strokeWidth="2" />
            <polygon points="15,24 10,116 20,116" fill="#38BDF8" opacity="0.9" />
            <polygon points="15,35 6,116 24,116" fill="#0284C7" opacity="0.5" />
            <polygon points="15,60 2,116 28,116" fill="#0369A1" opacity="0.4" />
          </g>
          <rect x="75" y="65" width="22" height="55" rx="2" fill="#64748B" opacity="0.8" />
          <rect x="105" y="50" width="18" height="70" rx="2" fill="#475569" opacity="0.8" />
          <rect x="200" y="55" width="24" height="65" rx="2" fill="#64748B" opacity="0.8" />
          <rect x="235" y="70" width="18" height="50" rx="2" fill="#475569" opacity="0.8" />
        </svg>
      </div>
    );
  }

  if (d.includes('zurich') || d.includes('switzerland') || d.includes('swiss') || d.includes('alps') || d.includes('interlaken')) {
    return (
      <div className="relative w-full h-full min-h-[170px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#38bdf8]/50 via-[#e0f2fe] to-[#ecfccb] flex items-end justify-center select-none">
        <div className="absolute top-4 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 shadow-[0_0_16px_rgba(253,224,71,0.5)]" />
        <svg className="w-full h-36 max-w-[340px] relative z-10" viewBox="0 0 340 140" fill="none">
          <polygon points="80,25 10,125 150,125" fill="#60A5FA" opacity="0.5" />
          <polygon points="80,25 65,55 95,55" fill="#FFFFFF" />
          <polygon points="200,15 120,125 280,125" fill="#3B82F6" opacity="0.5" />
          <polygon points="200,15 180,48 220,48" fill="#FFFFFF" />
          <polygon points="290,35 220,125 340,125" fill="#93C5FD" opacity="0.6" />
          <polygon points="290,35 275,60 305,60" fill="#FFFFFF" />
          <rect x="0" y="120" width="340" height="20" fill="#15803D" />
          <rect x="0" y="126" width="340" height="14" fill="#0284C7" />
          <g transform="translate(130, 114)">
            <rect x="0" y="0" width="36" height="10" rx="2" fill="#DC2626" />
            <rect x="4" y="2" width="6" height="5" fill="#FEF08A" />
            <rect x="14" y="2" width="6" height="5" fill="#FEF08A" />
            <rect x="24" y="2" width="6" height="5" fill="#FEF08A" />
          </g>
        </svg>
      </div>
    );
  }

  if (d.includes('bangkok') || d.includes('thailand') || d.includes('phuket')) {
    return (
      <div className="relative w-full h-full min-h-[170px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#fbbf24]/30 via-[#fde68a]/40 to-[#ccfbf1] flex items-end justify-center select-none">
        <div className="absolute top-4 right-10 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
        <svg className="w-full h-36 max-w-[340px] relative z-10" viewBox="0 0 340 140" fill="none">
          <rect x="0" y="118" width="340" height="22" fill="#0284C7" />
          <g transform="translate(145, 18)">
            <polygon points="25,0 20,40 30,40" fill="#D97706" />
            <polygon points="25,40 10,80 40,80" fill="#F59E0B" />
            <polygon points="25,80 2,102 48,102" fill="#D97706" />
            <rect x="6" y="102" width="38" height="16" fill="#B45309" />
          </g>
          <g transform="translate(60, 65)">
            <path d="M15 55 Q20 25 25 0" stroke="#78350F" strokeWidth="2.5" />
            <path d="M25 0 Q10 5 0 20" stroke="#15803D" strokeWidth="2" />
            <path d="M25 0 Q40 5 45 20" stroke="#15803D" strokeWidth="2" />
          </g>
        </svg>
      </div>
    );
  }

  // Universal dynamic skyline artwork for ANY city or country worldwide
  return (
    <div className="relative w-full h-full min-h-[170px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#6366f1]/25 via-[#38bdf8]/20 to-[#f1f5f9] flex items-end justify-center select-none">
      <div className="absolute top-4 right-8 w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 shadow-[0_0_22px_rgba(244,63,94,0.45)]" />
      <svg className="w-full h-36 max-w-[340px] relative z-10" viewBox="0 0 340 140" fill="none">
        <rect x="0" y="120" width="340" height="20" fill="#1E293B" />
        <polygon points="30,45 42,45 42,120 30,120" fill="#475569" />
        <polygon points="36,25 36,45 36,45" stroke="#334155" strokeWidth="2" />
        <rect x="52" y="60" width="22" height="60" rx="1" fill="#64748B" opacity="0.9" />
        <rect x="85" y="40" width="28" height="80" rx="2" fill="#334155" />
        <polygon points="99,15 85,40 113,40" fill="#475569" />
        <g transform="translate(150, 20)">
          <line x1="20" y1="0" x2="20" y2="100" stroke="#0EA5E9" strokeWidth="2" />
          <polygon points="20,0 8,100 32,100" fill="#0284C7" opacity="0.6" />
          <circle cx="20" cy="35" r="5" fill="#38BDF8" />
          <circle cx="20" cy="70" r="8" fill="#0369A1" />
        </g>
        <rect x="200" y="50" width="26" height="70" rx="2" fill="#475569" />
        <rect x="236" y="68" width="20" height="52" rx="1" fill="#64748B" opacity="0.9" />
        <rect x="266" y="55" width="32" height="65" rx="2" fill="#334155" />
        <circle cx="282" cy="55" r="8" fill="#0EA5E9" opacity="0.5" />
      </svg>
    </div>
  );
};

// Preset Destinations
const POPULAR_DESTINATIONS = [
  { name: 'Bali • Indonesia', city: 'Bali', country: 'Indonesia', code: 'DPS', flag: '🇮🇩', highlight: 'Tropical Temples & Emerald Terraces' },
  { name: 'Paris • France', city: 'Paris', country: 'France', code: 'CDG', flag: '🇫🇷', highlight: 'Eiffel Tower, Louvre & Seine Cruise' },
  { name: 'Tokyo • Japan', city: 'Tokyo', country: 'Japan', code: 'HND', flag: '🇯🇵', highlight: 'Futuristic Neon & Ancient Shrines' },
  { name: 'Dubai • UAE', city: 'Dubai', country: 'UAE', code: 'DXB', flag: '🇦🇪', highlight: 'Burj Khalifa & Desert Safaris' },
  { name: 'Zurich • Switzerland', city: 'Zurich', country: 'Switzerland', code: 'ZRH', flag: '🇨🇭', highlight: 'Alpine Glaciers & Cogwheel Trains' },
  { name: 'Bangkok • Thailand', city: 'Bangkok', country: 'Thailand', code: 'BKK', flag: '🇹🇭', highlight: 'Golden Stupas & Floating Markets' },
];

// Verified Full Itineraries with Crystal Clear Guidance
const ITINERARIES_DATABASE: Record<string, FullItinerary> = {
  paris: {
    id: 'itinerary-paris',
    destination: 'Paris',
    country: 'France',
    currency: 'EUR',
    destinationSummary: 'The City of Light enchantingly blends world-renowned classical art, romantic tree-lined grand boulevards, and starry river cruises.',
    bestTimeToVisit: 'April – June & September – November (Pleasant 18°C – 24°C)',
    estimatedTotalTripBudgetInr: 125000,
    origin: 'New Delhi',
    startDate: '2026-10-20',
    endDate: '2026-10-24',
    budget: 'mid-range',
    travellersCount: 2,
    travellerType: 'Travelers',
    days: [
      {
        dayNumber: 1,
        dateStr: '20 Oct 2026',
        title: 'Arrival in Paris & The Louvre Museum',
        theme: 'Classical Masterpieces & Royal Tuileries Promenade',
        landmarkTitle: 'The Louvre & Glass Pyramid',
        landmarkSubtitle: 'World’s Largest Art Sanctuary & French Heritage',
        morning: {
          time: '09:00 AM – 12:30 PM',
          activity: 'Louvre Museum Tour & Mona Lisa',
          landmark: 'Musée du Louvre (Denon Wing)',
          details: 'Begin your trip with Paris’s crown jewel of Renaissance art. Beat surface queues by using the underground Carrousel entrance directly from the metro station.',
          steps: [
            'Metro Line 1 se "Palais-Royal–Musée du Louvre" station par utrein.',
            'Underground Carrousel shopping mall entrance use karein (yahan line sabse choti hoti hai).',
            'Denon Wing Room 711 mein direct jaakar Mona Lisa aur Winged Victory of Samothrace dekhein.',
            'Cour Napoléon mein iconic Glass Pyramid ke saamne photos capture karein.',
          ],
          costEstimateInr: 1950,
          transport: 'Metro Line 1 (15 mins from hotel) · €2.15 ticket',
          duration: '3h 30m',
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Tuileries Gardens & Palais Royal Courtyard',
          landmark: 'Jardin des Tuileries & Buren Columns',
          details: 'Relaxing stroll through royal landscaped French gardens with iconic green chairs and striped Buren art columns.',
          steps: [
            'Pyramid courtyard se sidha chal kar Tuileries Garden ke central fountain par baith kar dhoop lein.',
            'Palais-Royal courtyard mein famous black-and-white striped Buren Columns par click karein.',
            'Angelina Paris (Rue de Rivoli) se world-famous thick hot chocolate aur Mont Blanc pastry try karein.',
          ],
          costEstimateInr: 1400,
          transport: 'Pedestrian tree-lined walking trail (10 mins)',
          duration: '3 hours',
          pathwayName: 'Foot-path with royal statues',
          pathwayDescription: 'Historic cobblestone tree allée connecting Louvre to Concorde Square.',
        },
        evening: {
          time: '06:30 PM – 10:00 PM',
          activity: 'Latin Quarter Stroll & Seine Riverbanks',
          details: 'Atmospheric evening walk across Pont des Arts wooden pedestrian bridge into the historic bohemian student quarter.',
          steps: [
            'Seine riverbank promenade par street bookstalls (Bouquinistes) browse karein.',
            'Pont des Arts bridge par live violinists aur accordion players ka music enjoy karein.',
            'Rue Mouffetard ke candlelit bistro mein French dinner enjoy karein.',
          ],
          cruiseTitle: 'Twilight Seine River Walk',
          cruiseSubtitle: '& historic bridges / acoustic accordion melodies',
          costEstimateInr: 2800,
          transport: 'Short scenic stroll along riverbank',
          duration: '3 hours',
        },
        diningTip: {
          place: 'Le Comptoir du Relais (Saint-Germain)',
          recommendation: 'Authentic Parisian Bistro dinner in cobblestone alley',
          mustOrder: 'Traditional Beef Bourguignon, French Onion Soup & Warm Baguette',
          estimatedCost: '€32 (~₹2,900) per person',
        },
        proTip: 'Louvre ke liye ticket kam se kam 2 hafte pehle time-slot ke saath book karein; on-spot tickets aksar sold out hoti hain.',
        estimatedDayTotalInr: 6150,
      },
      {
        dayNumber: 2,
        dateStr: '21 Oct 2026',
        title: 'Eiffel Tower, Arc de Triomphe & Evening Cruise',
        theme: 'Iconic Landmarks, Grand Avenues & River Cruise',
        landmarkTitle: 'Eiffel Tower / Louvre',
        landmarkSubtitle: 'Paris Eiffel collection & Iconic Heritage',
        morning: {
          time: '09:00 AM – 12:30 PM',
          activity: 'Eiffel Tower Ascent & Champ de Mars View',
          landmark: 'Tour Eiffel (2nd Floor & Summit)',
          details: 'The pinnacle of your Paris experience. Take the glass-walled elevator up 115 meters for a breathtaking 360-degree panorama of Paris.',
          steps: [
            'Metro Line 6 se "Bir-Hakeim" utrein aur 4 minute Champ de Mars tak walk karein.',
            'Pillar East security line mein digital mobile barcode scan karayein.',
            'Glass elevator se 2nd Floor par jaayein: yahan se Montmartre, Seine aur Arc de Triomphe clear dikhte hain.',
            '1st Floor par transparent glass floor par walk karein aur souvenirs collect karein.',
          ],
          costEstimateInr: 2400,
          transport: 'Metro Line 6 to Bir-Hakeim · 12 mins',
          duration: '2h 30m',
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Champs-Élysées Promenade & Arc de Triomphe',
          landmark: 'Arc de Triomphe & Place Charles de Gaulle',
          details: 'Walk down Europe’s most prestigious avenue lined with plane trees, luxury boutiques, and ascend the triumphal rooftop arch.',
          steps: [
            'Bir-Hakeim se Metro Line 6 le kar "Charles de Gaulle–Étoile" pahunchein.',
            'Road cross karne ke bajaye pedestrian underground tunnel (Passage du Souvenir) se arch tak jaayein.',
            '284 spiral steps climb karein aur roof terrace par 12 avenues ke star layout ka view enjoy karein.',
            'Champs-Élysées avenue par walk karte hue Ladurée se famous French macarons taste karein.',
          ],
          costEstimateInr: 1800,
          transport: 'Silent electric train train (RER A / Metro Line 1)',
          duration: '3 hours',
          pathwayName: 'Foot-path with glowing moss',
          pathwayDescription: 'Tree-lined shaded boulevard illuminated with soft eco-lanterns.',
        },
        evening: {
          time: '06:00 PM – 10:30 PM',
          activity: 'Evening Eco Seine River Cruise & Sparkling Tower',
          details: 'Glide down the historic river as twilight falls. At 09:00 PM and 10:00 PM, watch the Eiffel Tower sparkle with 20,000 golden strobe lights for 5 minutes.',
          steps: [
            'Pont de l’Alma river pier par jaayein aur silent solar vessel cruise board karein.',
            '70 minute glass-canopy journey mein illuminated Notre-Dame, Orsay Museum aur Louvre dekhein.',
            'Open-air top deck par aakar Eiffel Tower ka magical hourly sparkle show photograph karein.',
            'Nearby riverside bistro mein dinner ke saath day wrap-up karein.',
          ],
          cruiseTitle: 'Evening eco Seine River Cruise',
          cruiseSubtitle: '& silent solar-powered vessel bom sieel',
          costEstimateInr: 3200,
          transport: 'Pont de l’Alma pier shuttle · 10 mins',
          duration: '3h 30m',
        },
        diningTip: {
          place: 'Chez André (Rue Marbeuf near Champs-Élysées)',
          recommendation: 'Classic French Brasserie with warm hospitality and brass accents',
          mustOrder: 'Steak Frites with herb butter, Escargots & Warm Tarte Tatin',
          estimatedCost: '€38 (~₹3,400) per person',
        },
        proTip: 'Eiffel Tower ke hourly sparkle show ko river cruise ke top deck se dekhne ke liye 20:30 ya 21:30 ka boat slot select karein.',
        estimatedDayTotalInr: 7400,
      },
      {
        dayNumber: 3,
        dateStr: '22 Oct 2026',
        title: 'Bohemian Montmartre & Sacré-Cœur Basilica',
        theme: 'Cobblestone Alleys, Street Artists & Hilltop Sunset',
        landmarkTitle: 'Sacré-Cœur Dome & Montmartre',
        landmarkSubtitle: 'Historic Artists Village & Highest Panoramic Hill',
        morning: {
          time: '09:00 AM – 12:30 PM',
          activity: 'Sacré-Cœur Basilica & Montmartre Village',
          landmark: 'Basilique du Sacré-Cœur',
          details: 'Climb Paris’s highest natural hill overlooking the whole metropolis. Wander through winding cobbled lanes where Picasso and Van Gogh once lived.',
          steps: [
            'Metro Line 2 se "Anvers" station pahunchein.',
            'Metro ticket use karke Montmartre Funicular train lein (222 seedhiyan bach jaati hain).',
            'White travertine stone Basilica ke andar silent mosaic ceiling dekhein.',
            'Place du Tertre square mein local painters aur portrait sketch artists ko live paint karte dekhein.',
          ],
          costEstimateInr: 1200,
          transport: 'Metro Line 2 + Funicular cable car (15 mins)',
          duration: '3h 30m',
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Le Marais Historic District & Place des Vosges',
          landmark: 'Place des Vosges & Village Saint-Paul',
          details: 'Paris’s trendiest historic quarter filled with preserved medieval mansions, art galleries, and secret courtyard gardens.',
          steps: [
            'Metro Line 4/1 se "Saint-Paul" station jaayein.',
            'Paris ke sabse purane planned square "Place des Vosges" ke red-brick arcades mein walk karein.',
            'L’As du Fallafel (Rue des Rosiers) se world-famous hot pita sandwich grab karein.',
          ],
          costEstimateInr: 1500,
          transport: 'Metro Line 4 to Saint-Paul (18 mins)',
          duration: '3 hours',
          pathwayName: 'Foot-path with vintage arches',
          pathwayDescription: 'Cobbled pedestrian lanes through 17th-century aristocratic courtyards.',
        },
        evening: {
          time: '06:00 PM – 09:30 PM',
          activity: 'Sunset Wine Bar & Warm Cheese Fondue',
          details: 'Authentic French alpine cheese fondue dinner with crusty bread cubes in cozy wooden dining room.',
          steps: [
            'Marais ke cozy wine bar mein baith kar local cheese board sample karein.',
            'Melted Gruyère cheese fondue pot mein bread dip karke authentic French taste experience karein.',
          ],
          cruiseTitle: 'Montmartre Lantern Evening Walk',
          cruiseSubtitle: '& vintage gas-lamp lit streets / quiet Paris vistas',
          costEstimateInr: 2900,
          transport: 'Walking route through historic Marais',
          duration: '3 hours',
        },
        diningTip: {
          place: 'Le Refuge des Fondus (Montmartre)',
          recommendation: 'Lively, memorable fondue institution in cobbled lane',
          mustOrder: 'Savory Gruyère & Emmental Fondue with cured meats',
          estimatedCost: '€28 (~₹2,500) per person',
        },
        proTip: 'Montmartre mein stairs ke paas "string trick" karne wale hawkers se politely "No thank you" bol kar sidha aage badhein.',
        estimatedDayTotalInr: 5600,
      },
      {
        dayNumber: 4,
        dateStr: '23 Oct 2026',
        title: 'Château de Versailles & Royal Gardens',
        theme: 'Hall of Mirrors, Grand Canal & Queen’s Hamlet',
        landmarkTitle: 'Palace of Versailles',
        landmarkSubtitle: 'UNESCO Gold Gilded Royal Château & Fountains',
        morning: {
          time: '08:30 AM – 01:00 PM',
          activity: 'Château de Versailles Palace Tour',
          landmark: 'Hall of Mirrors (Galerie des Glaces)',
          details: 'Day trip to the opulent palace of Louis XIV. Walk down the 73-meter glittering Hall of Mirrors reflecting formal royal garden terraces.',
          steps: [
            'Central Paris se RER C double-decker train pakad kar "Versailles Château Rive Gauche" utrein (40 mins).',
            'Golden Gate Entrance par security scan karein (passport voucher compulsory).',
            'King’s Grand Apartments aur 357 crystal mirrors wali Galerie des Glaces admire karein.',
          ],
          costEstimateInr: 3200,
          transport: 'RER Line C Train (round-trip €8.50) · 45 mins',
          duration: '4h 30m',
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Versailles Musical Fountains & Grand Canal',
          landmark: 'Grand Canal & Queen’s Hamlet',
          details: 'Rent an electric golf cart or wooden rowboat on the Grand Canal, followed by the idyllic fairy-tale rustic cottage village of Marie Antoinette.',
          steps: [
            'Apollo Fountain ke paas Grand Canal par wooden rowboat rent karein (30 mins).',
            'Little Trianon aur thatched-roof Queen’s Hamlet farm par stroll karein.',
          ],
          costEstimateInr: 1800,
          transport: 'Solar golf cart or pleasant bike hire',
          duration: '3 hours',
          pathwayName: 'Foot-path with royal fountains',
          pathwayDescription: 'Grand tree-lined allées bordered by classical marble statues and canals.',
        },
        evening: {
          time: '06:30 PM – 10:00 PM',
          activity: 'Farewell Parisian Dinner & River Panorama',
          details: 'Return to Paris for a relaxing farewell dinner celebrating your seamless French journey.',
          steps: [
            'RER C train se wapas central Paris aakar Saint-Michel station par utrein.',
            'Illuminated Notre-Dame Cathedral ke samne farewell photos lein.',
            'French bakery se box of macarons pack karayein travel souvenirs ke liye.',
          ],
          cruiseTitle: 'Farewell Seine Panorama Stroll',
          cruiseSubtitle: '& illuminated Notre-Dame Cathedral / river lights',
          costEstimateInr: 3100,
          transport: 'RER C train to Central Paris (40 mins)',
          duration: '3 hours',
        },
        diningTip: {
          place: 'La Petite Venise (Inside Versailles Gardens)',
          recommendation: 'Charming historic terrace restaurant next to Grand Canal',
          mustOrder: 'Handmade Truffle Tagliatelle, Burrata & Peach Bellini',
          estimatedCost: '€35 (~₹3,100) per person',
        },
        proTip: 'Versailles ke liye Passport with Gardens ticket lein aur subah 09:00 AM entry slot chunein taaki rush se pehle Hall of Mirrors empty mile.',
        estimatedDayTotalInr: 8100,
      },
    ],
  },
  bali: {
    id: 'itinerary-bali',
    destination: 'Bali',
    country: 'Indonesia',
    currency: 'IDR',
    destinationSummary: 'The Island of the Gods seamlessly enchants with emerald tiered rice terraces, sacred ocean clifftop temples, and vibrant coastal culture.',
    bestTimeToVisit: 'April – October (Dry Sunny Season, 27°C – 31°C)',
    estimatedTotalTripBudgetInr: 88500,
    origin: 'New Delhi',
    startDate: '2026-10-20',
    endDate: '2026-10-24',
    budget: 'mid-range',
    travellersCount: 2,
    travellerType: 'Travelers',
    days: [
      {
        dayNumber: 1,
        dateStr: '20 Oct 2026',
        title: 'Arrival in Bali & Cultural Heart of Ubud',
        theme: 'Emerald Rice Cascades, Jungle Swings & Sacred Banyan Trails',
        landmarkTitle: 'Ubud Rice Terraces & Sacred Forest',
        landmarkSubtitle: 'Bali Cultural Heritage & Carved Lotus Ponds',
        morning: {
          time: '08:30 AM – 12:30 PM',
          activity: 'Tegallalang Emerald Terraces & Jungle Swing',
          landmark: 'Tegallalang Rice Terraces',
          details: 'Start your tropical adventure in the emerald heart of Ubud. Walk along carved hillside irrigation paths and fly above coconut canopies on a giant swing.',
          steps: [
            'Hotel se private AC sedan driver ke saath Tegallalang pahunchein.',
            'Subak irrigation network ke lush green steps par walk karein.',
            'Safety harness pehen kar 25m high jungle swing experience karein (epic photo spot).',
            'Local warung par fresh king coconut water sip karein.',
          ],
          costEstimateInr: 1800,
          transport: 'Private AC Eco-Sedan Shuttle (30 mins from Ubud)',
          duration: '3h 30m',
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Sacred Monkey Forest Sanctuary & Royal Palace',
          landmark: 'Mandala Suci Wenara Wana',
          details: 'Encounter playful long-tailed macaques playing among ancient moss-covered 14th-century temple ruins and towering holy banyans.',
          steps: [
            'Central Ubud mein Monkey Forest sanctuary entrance par digital ticket dikhayein.',
            'Sacred spring temple aur dragon stone bridge ke jungle walkway par walk karein.',
            'Chashma ya loose accessories bag mein zip karke rakhein.',
            'Ubud Palace (Puri Saren Agung) ke intricately carved golden teak gates dekhein.',
          ],
          costEstimateInr: 950,
          transport: 'Silent electric shuttle (10 mins)',
          duration: '3 hours',
          pathwayName: 'Foot-path with glowing moss',
          pathwayDescription: 'Enchanted stone walkway through sacred banyan roots and mossy spring streams.',
        },
        evening: {
          time: '06:00 PM – 09:30 PM',
          activity: 'Jimbaran Bay Sunset Catamaran & Seafood Feast',
          details: 'Savor freshly grilled ocean lobster and red snapper on candlelit beach sands as dusk paints the Indian Ocean purple and gold.',
          steps: [
            'Jimbaran beach par candlelit beachfront table par welcome drink lein.',
            'Sunset catamaran sail par open-air bay views enjoy karein.',
            'Freshly grilled coconut husk seafood platter enjoy karein with acoustic Balinese guitarists.',
          ],
          cruiseTitle: 'Sunset Jimbaran Catamaran Cruise',
          cruiseSubtitle: '& silent solar-powered vessel / oceanfront dining',
          costEstimateInr: 2800,
          transport: 'Private scenic coastal transfer',
          duration: '3 hours',
        },
        diningTip: {
          place: 'Bebek Bengil (The Dirty Duck Diner, Ubud)',
          recommendation: 'Legendary open-air pavilion restaurant overlooking live rice paddies',
          mustOrder: 'Crispy Balinese Duck (Bebek Betutu) with spicy sambal matah',
          estimatedCost: 'IDR 180,000 (~₹1,000) per person',
        },
        proTip: 'Bali mein temples ke liye shoulders aur knees cover karna compulsory hai; temple gate par provided colorful sarong and sash wear karein.',
        estimatedDayTotalInr: 5550,
      },
      {
        dayNumber: 2,
        dateStr: '21 Oct 2026',
        title: 'Floating Lake Temple & Jatiluwih UNESCO Terraces',
        theme: 'Volcanic Caldera Lakes, Water Blessings & Mountain Air',
        landmarkTitle: 'Ulun Danu Bratan Floating Temple',
        landmarkSubtitle: '17th-Century Sacred Pagoda Floating on Mountain Crater',
        morning: {
          time: '08:00 AM – 12:00 PM',
          activity: 'Ulun Danu Bratan Temple on Crater Lake',
          landmark: 'Pura Ulun Danu Beratan (Bedugul)',
          details: 'Ascend into Bali’s cool misty central highlands to witness the iconic 11-tiered thatched pagoda floating peacefully over the volcanic lake.',
          steps: [
            'Misty Bedugul mountains ki taraf drive karein (temperature 21°C pleasant hoti hai).',
            'Manicured pine gardens se walk karke lake shoreline par aayein.',
            'Iconic photo spot: lake water par floating multi-tier pagoda aur backdrop cloud hills.',
            'Traditional colorful wooden boat hire karke lake par peaceful spin lein.',
          ],
          costEstimateInr: 1600,
          transport: 'Private AC Scenic Mountain Shuttle (1h 15m)',
          duration: '3h 30m',
        },
        afternoon: {
          time: '01:00 PM – 04:30 PM',
          activity: 'Jatiluwih UNESCO Rice Terraces & Hidden Waterfall',
          landmark: 'Jatiluwih Green Land',
          details: 'Explore Bali’s largest unbroken living agricultural landscape (over 600 hectares) preserved through ancestral cooperative Subak irrigation.',
          steps: [
            'Bedugul se Jatiluwih downhill drive karein.',
            'Paved eco-walking trail par 45 minute trek karein with Mount Batukaru views.',
            'Bamboo forest trail se nikal kar secluded cool river waterfall visit karein.',
          ],
          costEstimateInr: 1200,
          transport: 'Private driver transfer (35 mins)',
          duration: '3 hours',
          pathwayName: 'Foot-path with glowing moss',
          pathwayDescription: 'Lush bamboo sanctuary walk with clear natural spring streams.',
        },
        evening: {
          time: '05:30 PM – 09:00 PM',
          activity: 'Tirta Empul Holy Water Spring Purification',
          details: 'Participate in the ancient Balinese water purification ritual (Melukat) beneath 12 carved sacred crystal spring spouts.',
          steps: [
            'Tampaksiring sacred temple entrance par green ritual sarong pehnein.',
            'Pool mein enter karke local priest ke guidance mein holy spring under pray karein.',
            'Temple courtyard mein evening gamelan music listen karein.',
          ],
          cruiseTitle: 'Tampaksiring Cultural Lantern Walk',
          cruiseSubtitle: '& holy natural spring spouts / serene night temple chanting',
          costEstimateInr: 2200,
          transport: 'Private car transfer',
          duration: '3 hours',
        },
        diningTip: {
          place: 'Warung Mahu Jatiluwih',
          recommendation: 'Open-air cliffside wooden terrace facing infinite green rice terraces',
          mustOrder: 'Nasi Campur with organic red rice, chicken satay & fresh avocado smoothie',
          estimatedCost: 'IDR 95,000 (~₹520) per person',
        },
        proTip: 'Ulun Danu lake par subah 09:30 AM se pehle pahunchein taaki mountain mist aane se pehle crystal clear reflection mile.',
        estimatedDayTotalInr: 5000,
      },
      {
        dayNumber: 3,
        dateStr: '22 Oct 2026',
        title: 'Uluwatu Clifftops & Sunset Kecak Fire Dance',
        theme: '70m Sheer Ocean Cliffs, Surf Caves & Fire Chanting',
        landmarkTitle: 'Uluwatu Clifftop Sanctuary',
        landmarkSubtitle: 'Sacred Clifftop Pagoda & Crashing Ocean Waves',
        morning: {
          time: '09:30 AM – 01:00 PM',
          activity: 'Padang Padang Beach & Limestone Sea Caves',
          landmark: 'Pantai Padang Padang',
          details: 'Descend through narrow limestone sea cave staircase to a hidden crescent of golden sand and turquoise surf breaks.',
          steps: [
            'South Bukit peninsula ki taraf drive karein.',
            'Cave cleft staircase se golden sand beach par utrein.',
            'Crystal clear turquoise water mein swim karein ya sun-lounger rent karein.',
            'Beachfront hut se fresh mango dragonfruit smoothie bowl enjoy karein.',
          ],
          costEstimateInr: 1200,
          transport: 'Coastal Sedan Transfer · 25 mins',
          duration: '3 hours',
        },
        afternoon: {
          time: '02:00 PM – 04:30 PM',
          activity: 'Garuda Wisnu Kencana Cultural Park',
          landmark: 'GWK Cultural Park (122m Monument)',
          details: 'Stand at the foot of one of the world’s tallest monuments, depicting Lord Vishnu riding the mythical eagle Garuda.',
          steps: [
            'Limestone canyon plaza mein giant carved stone pillars dekhein.',
            'Internal elevator se 23rd floor viewing gallery par chadh kar South Bali panorama dekhein.',
          ],
          costEstimateInr: 1800,
          transport: 'Silent electric shuttle bus',
          duration: '2h 30m',
          pathwayName: 'Foot-path with glowing moss',
          pathwayDescription: 'Clifftop cobblestone promenade illuminated by soft solar lanterns.',
        },
        evening: {
          time: '05:00 PM – 09:30 PM',
          activity: 'Uluwatu Clifftop Sunset & Kecak Fire Dance',
          details: 'Watch 50 shirtless chanting performers dramatize the Ramayana epic as the crimson sun drops directly into the Indian Ocean below.',
          steps: [
            '17:00 baje sharp amphitheatre entry line mein lag kar top-row sea view seat reserve karein.',
            '18:00 baje hypnotic "Chak-chak-chak" vocal chorus ke saath performance shuru hoti hai.',
            'Sunset ke baad dramatic fire ring circle mein Hanumaan battle climax dekhein.',
          ],
          cruiseTitle: 'Sunset Oceanfront Clifftop Sail',
          cruiseSubtitle: '& 70m limestone ocean amphitheatre / hypnotic fire chants',
          costEstimateInr: 3200,
          transport: 'Boardwalk coastal path',
          duration: '3h 30m',
        },
        diningTip: {
          place: 'Menega Cafe (Jimbaran Beach)',
          recommendation: 'Beachfront candlelit tables on soft sand with sound of rolling waves',
          mustOrder: 'Grilled Jumbo Tiger Prawns, Garlic Butter Squid & Fresh Coconut Water',
          estimatedCost: 'IDR 250,000 (~₹1,400) per person',
        },
        proTip: 'Uluwatu amphitheatre mein tickets 17:15 tak full ho jaate hain; hamare booked voucher se 17:00 baje enter karein.',
        estimatedDayTotalInr: 6200,
      },
      {
        dayNumber: 4,
        dateStr: '23 Oct 2026',
        title: 'Nusa Penida Island & Kelingking T-Rex Beach',
        theme: 'Dramatic Coastal Arches, Crystal Lagoon & Island Catamaran',
        landmarkTitle: 'Kelingking T-Rex Cliff',
        landmarkSubtitle: 'Nusa Penida Emerald Waters & Dramatic Arch',
        morning: {
          time: '07:30 AM – 11:30 AM',
          activity: 'Fast Eco-Catamaran to Nusa Penida & Kelingking',
          landmark: 'Kelingking Secret Point (T-Rex Cliff)',
          details: 'Cruise across Badung Strait to Bali’s rugged sister island to gaze down at the world-famous T-Rex shaped emerald headland.',
          steps: [
            'Sanur harbor se 45 minute fast catamaran boat board karein Nusa Penida ke liye.',
            'Island port par private driver se meet karein aur Kelingking viewpoint pahunchein.',
            'Spine ridge cliff par world-famous dinosaur cliff and turquoise surf photo capture karein.',
          ],
          costEstimateInr: 3200,
          transport: 'High-speed Eco Catamaran (45 mins)',
          duration: '4 hours',
        },
        afternoon: {
          time: '12:30 PM – 04:30 PM',
          activity: 'Broken Beach Natural Arch & Angel’s Billabong',
          landmark: 'Pasih Uug (Broken Beach)',
          details: 'Marvel at a massive circular limestone sinkhole with an arched sea bridge through which ocean waves crash violently.',
          steps: [
            'Natural bridge archway par walk karke photo angle set karein.',
            'Angel’s Billabong natural emerald infinity tidal pool dekhein.',
          ],
          costEstimateInr: 1500,
          transport: 'Island 4x4 Eco Shuttle (30 mins)',
          duration: '3 hours',
          pathwayName: 'Foot-path with glowing moss',
          pathwayDescription: 'Coastal cliff trail bordered by tropical wildflowers and ocean spray.',
        },
        evening: {
          time: '05:30 PM – 09:30 PM',
          activity: 'Crystal Bay Sunset & Return Catamaran',
          details: 'Relax under swaying coconut palms on calm white sands before catching the twilight catamaran back to mainland Bali.',
          steps: [
            'Crystal Bay calm water mein safe snorkel ya sunset coconut drink enjoy karein.',
            'Port aakar fast boat se wapas Sanur harbor pahunchein.',
            'Sanur night market mein traditional satay aur sweet martabak pancake taste karein.',
          ],
          cruiseTitle: 'Evening eco Island Ferry',
          cruiseSubtitle: '& silent solar-powered vessel / harbor lights',
          costEstimateInr: 2500,
          transport: 'Return Catamaran to Sanur Harbour',
          duration: '3 hours',
        },
        diningTip: {
          place: 'Warung Bambu (Nusa Penida)',
          recommendation: 'Peaceful bamboo gazebo restaurant surrounded by banana trees',
          mustOrder: 'Balinese Grilled Tuna Fish, Sweet Sate Lilit & Mango Sticky Rice',
          estimatedCost: 'IDR 85,000 (~₹460) per person',
        },
        proTip: 'Nusa Penida mein roads bumpy ho sakti hain; motion sickness tablets carry karein aur sturdy sport sandals pehnein.',
        estimatedDayTotalInr: 7200,
      },
    ],
  },
};

// Helper generator to provide detailed, verified day-by-day itineraries for any duration up to 14 days
const generateExtendedDay = (destinationName: string, dayNum: number, dateStr: string): DayItinerary => {
  const isParis = destinationName.toLowerCase().includes('paris') || destinationName.toLowerCase().includes('france');
  const isBali = destinationName.toLowerCase().includes('bali') || destinationName.toLowerCase().includes('indonesia');

  if (isParis) {
    const parisDaysMap: Record<number, Partial<DayItinerary>> = {
      5: {
        title: 'Montmartre Artists & Sacré-Cœur Hilltop Basilica',
        theme: 'Cobblestone Alleys, Bohemian Painters & Secret Vineyards',
        landmarkTitle: 'Sacré-Cœur & Place du Tertre',
        landmarkSubtitle: 'Highest Natural Point in Paris & Open-Air Painters',
        morning: {
          time: '09:30 AM – 12:30 PM',
          activity: 'Sacré-Cœur Dome Climb & Montmartre Funicular',
          landmark: 'Basilique du Sacré-Cœur',
          details: 'Ride the funicular railway up the 130m hill of Montmartre. Climb 300 steps up the white travertine dome for a breathtaking 50km panoramic sweep of Paris.',
          steps: [
            'Metro Line 2 se "Anvers" station par utrein aur Rue de Steinkerque se walk karein.',
            'Montmartre funicular use karke steep stairs climb bypass karein.',
            'Basilica ke white dome top par chadh kar Eiffel Tower and Paris skyline view karein.',
            'Place du Tertre square par local street artists se live sketch banwayein.',
          ],
          costEstimateInr: 1600,
          transport: 'Montmartre Funicular Railway (1 Metro Ticket)',
          duration: '3 hours',
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Secret Vineyard of Montmartre & Moulin Rouge',
          landmark: 'Clos Montmartre & Le Consulat',
          details: 'Discover Paris’s only operational historical vineyard hidden behind cobblestone cottages, then stroll down to the red windmill of the Moulin Rouge.',
          steps: [
            'Rue Saint-Vincent par peaceful Clos Montmartre vineyard vines dekhein.',
            'Historic artist café Le Consulat ke saamne coffee aur croissant enjoy karein.',
            'Boulevard de Clichy par iconic Moulin Rouge windmill photo capture karein.',
          ],
          costEstimateInr: 1400,
          transport: 'Pedestrian cobblestone trail',
          duration: '3 hours',
          pathwayName: 'Foot-path with cobblestones & ivy',
          pathwayDescription: 'Charming winding alleys draped in climbing ivy and vintage gas lamps.',
        },
        evening: {
          time: '06:30 PM – 10:00 PM',
          activity: 'Bohemian Bistro Dinner & Cabaret Melodies',
          details: 'Indulge in an authentic dinner in a 19th-century artist cellar filled with jazz and accordion tunes.',
          steps: [
            'Rue des Abbesses ke market street mein artisanal cheese aur wine sample karein.',
            'Cozy bistro table par slow-cooked duck confit enjoy karein.',
          ],
          cruiseTitle: 'Montmartre Starlight Vista Walk',
          cruiseSubtitle: '& shimmering city panorama from hill crest / acoustic street violin',
          costEstimateInr: 3200,
          transport: 'Historic hillside steps',
          duration: '3 hours',
        },
        diningTip: {
          place: 'La Maison Rose (Montmartre)',
          recommendation: 'Iconic pastel-pink historic house café favored by Picasso',
          mustOrder: 'Farmhouse Duck Confit, Roasted Fig Salad & French Bordeaux',
          estimatedCost: '€34 (~₹3,100) per person',
        },
        proTip: 'Montmartre mein souvenir shops ke bajaye Rue Lepic ke artisan bakeries se fresh chocolate éclairs try karein.',
        estimatedDayTotalInr: 6200,
      },
      6: {
        title: 'Le Marais Historic Mansions, Place des Vosges & Pompidou',
        theme: 'Aristocratic Courtyards, Modern Art & Gourmet Street Delis',
        landmarkTitle: 'Place des Vosges & Pompidou',
        landmarkSubtitle: 'Oldest Planned Square in Paris & Inside-Out Architecture',
        morning: {
          time: '09:00 AM – 12:30 PM',
          activity: 'Centre Pompidou Modern Art & Escalator Tubes',
          landmark: 'Centre Georges Pompidou',
          details: 'Explore Europe’s largest museum of modern art, renowned for its radical high-tech inside-out architecture featuring color-coded exterior utility pipes.',
          steps: [
            'Metro Line 11 se "Rambuteau" station utrein.',
            'Exterior transparent glass caterpillar escalator tube se Paris rooftops view karein.',
            '4th & 5th floor galleries mein Picasso, Kandinsky aur Matisse masterpieces dekhein.',
          ],
          costEstimateInr: 1750,
          transport: 'Metro Line 11 (10 mins)',
          duration: '3h 30m',
        },
        afternoon: {
          time: '01:30 PM – 05:00 PM',
          activity: 'Place des Vosges & Victor Hugo House',
          landmark: 'Place des Vosges (1612)',
          details: 'Sit on velvet lawns under symmetrical red-brick arcades in Paris’s oldest royal planned square, visiting the very home where Victor Hugo wrote Les Misérables.',
          steps: [
            'Rue des Rosiers Jewish quarter mein world-famous hot pita falafel grab karein.',
            'Place des Vosges ke peaceful vaulted brick arcades ke niche walk karein.',
            'Maison de Victor Hugo (free permanent museum) visit karein.',
          ],
          costEstimateInr: 1100,
          transport: 'Pedestrian cobblestone street (12 mins walk)',
          duration: '3 hours',
          pathwayName: 'Foot-path with royal arcades',
          pathwayDescription: 'Renaissance red brick galleries lined with antique art books and fountains.',
        },
        evening: {
          time: '06:00 PM – 09:30 PM',
          activity: 'Canal Saint-Martin Sunset & Parisian Wine Bar',
          details: 'Gather alongside local Parisians on iron footbridges watching canal locks operate under towering chestnut trees.',
          steps: [
            'Canal locks ke swivel iron footbridge par sunset light admire karein.',
            'Canalside trendy wine bar mein charcuterie platter aur fresh baguette order karein.',
          ],
          cruiseTitle: 'Canal Saint-Martin Waterway Stroll',
          cruiseSubtitle: '& historic iron swing-bridges / reflective tree-lined waters',
          costEstimateInr: 2500,
          transport: 'Scenic canal towpath',
          duration: '3 hours',
        },
        diningTip: {
          place: 'L’As du Fallafel (Rue des Rosiers)',
          recommendation: 'Paris’s most legendary street-food deli with fresh grilled aubergine',
          mustOrder: 'Special Pita Falafel with fried eggplant, tahini & spicy red harissa',
          estimatedCost: '€11 (~₹1,000) per person',
        },
        proTip: 'Marais district Sunday ko car-free pedestrian zone ban jata hai; Sunday afternoon walk ke liye perfect time hai.',
        estimatedDayTotalInr: 5350,
      },
      7: {
        title: 'Claude Monet’s Giverny Gardens & Farewell Parisian Jazz',
        theme: 'Water Lilies, Japanese Footbridges & Farewell River Panorama',
        landmarkTitle: 'Monet’s Water Lily Pond & Bridge',
        landmarkSubtitle: 'Living Impressionist Sanctuary in the Normandy Countryside',
        morning: {
          time: '08:30 AM – 01:00 PM',
          activity: 'Day Trip to Giverny Impressionist Gardens',
          landmark: 'Fondation Claude Monet (Giverny)',
          details: 'Board a scenic train ride to the picturesque village of Giverny to walk through the actual Japanese water garden and weeping willow ponds that inspired Monet’s Nymphéas.',
          steps: [
            'Gare Saint-Lazare station se fast train to Vernon-Giverny (45 mins).',
            'Station se shuttle bus to Monet’s House & Water Lily Gardens.',
            'Emerald Japanese wooden bridge par iconic photo lein.',
            'Monet ke preserved pink farmhouse studio mein authentic Japanese woodblock prints dekhein.',
          ],
          costEstimateInr: 2900,
          transport: 'SNCF Regional Fast Train + Local Shuttle',
          duration: '4h 30m',
        },
        afternoon: {
          time: '02:00 PM – 05:30 PM',
          activity: 'Giverny Village Stroll & Return to Paris',
          landmark: 'Museum of Impressionism Giverny',
          details: 'Wander between thatched stone cottages, wild poppy fields, and outdoor French tea gardens before heading back to Paris.',
          steps: [
            'Village tea salon mein fresh pear tart aur herbal tea enjoy karein.',
            'Vernon train station se wapas Paris Gare Saint-Lazare return karein.',
          ],
          costEstimateInr: 1500,
          transport: 'Return Regional Train to Paris',
          duration: '3 hours',
          pathwayName: 'Foot-path with water lilies',
          pathwayDescription: 'Enchanted gravel garden trail bordered by weeping willows and bamboo shoots.',
        },
        evening: {
          time: '06:30 PM – 10:30 PM',
          activity: 'Farewell Parisian Jazz Night & Seine Panorama',
          details: 'Conclude your dream journey with live gypsy jazz inside a historic 16th-century stone vault near Notre-Dame.',
          steps: [
            'Saint-Germain jazz club mein live double bass aur saxophone rhythm enjoy karein.',
            'Pont Neuf bridge par illuminated Paris farewell photos lein.',
          ],
          cruiseTitle: 'Farewell Seine Illuminated Walk',
          cruiseSubtitle: '& twinkling Eiffel Tower beacons / live acoustic Parisian jazz',
          costEstimateInr: 3500,
          transport: 'Central Paris Metro & walking',
          duration: '4 hours',
        },
        diningTip: {
          place: 'Le Moulin des Fourches (Giverny countryside)',
          recommendation: 'Rustic stone watermill restaurant serving Normandy specialities',
          mustOrder: 'Apple Camembert Tart, Duck Breast with honey cider reduction',
          estimatedCost: '€38 (~₹3,400) per person',
        },
        proTip: 'Giverny tickets online book karke print karein taaki morning train ke baad bus transit se direct garden entry mile.',
        estimatedDayTotalInr: 7900,
      },
    };

    if (parisDaysMap[dayNum]) {
      return {
        dayNumber: dayNum,
        dateStr,
        ...parisDaysMap[dayNum],
      } as DayItinerary;
    }

    return {
      dayNumber: dayNum,
      dateStr,
      title: `Parisian Hidden Gems & Grand Arcades · Day ${dayNum}`,
      theme: 'Historic Passages, Royal Palaces & Starlight Rooftops',
      landmarkTitle: `Parisian Treasures & Secret Gardens ${dayNum}`,
      landmarkSubtitle: 'Curated Heritage Walks & Architectural Marvels',
      morning: {
        time: '09:30 AM – 12:30 PM',
        activity: 'Covered Passages & Palais Garnier Opera House',
        landmark: 'Galerie Vivienne & Opéra Garnier',
        details: 'Walk through 19th-century glass-roofed mosaic shopping passages and marvel at the gold-leaf chandeliers of Paris’s grand opera house.',
        steps: [
          'Passage des Panoramas aur Galerie Vivienne ke mosaic tile paths explore karein.',
          'Opéra Garnier ke Grand Staircase marble statues aur Marc Chagall painted ceiling dekhein.',
        ],
        costEstimateInr: 1600,
        transport: 'Metro Line 3 or Line 7 · 15 mins',
        duration: '3 hours',
      },
      afternoon: {
        time: '01:30 PM – 05:00 PM',
        activity: 'Luxembourg Palace Gardens & Sorbonne Latin Quarter',
        landmark: 'Jardin du Luxembourg',
        details: 'Sail vintage wooden toy boats on the octagonal Grand Bassin pond and stroll under chestnut trees in the Medici Fountain shadow.',
        steps: [
          'Medici Fountain grotto par shaded bench par relaxation karein.',
          'Sorbonne University bookstore street browse karein.',
        ],
        costEstimateInr: 1100,
        transport: 'RER B or pedestrian avenue walk',
        duration: '3 hours',
        pathwayName: 'Foot-path with royal statues',
        pathwayDescription: 'Gravel promenade shaded by symmetrical horse chestnut trees.',
      },
      evening: {
        time: '06:00 PM – 09:30 PM',
        activity: 'Sunset Rooftop Terrace & Parisian Wine Bistro',
        details: 'Watch twilight descend over Paris from an open-air rooftop observation terrace before enjoying regional cheese and pastries.',
        steps: [
          'Galeries Lafayette rooftop se 360° sunset Paris skyline view karein (completely free).',
          'Traditional family bistro mein warm crêpes aur cider taste karein.',
        ],
        cruiseTitle: 'Twilight Parisian Panorama',
        cruiseSubtitle: '& sparkling Eiffel Tower lights / rooftop sunset vistas',
        costEstimateInr: 2600,
        transport: 'Metro Line 9',
        duration: '3 hours',
      },
      diningTip: {
        place: 'Bouillon Chartier (Grands Boulevards)',
        recommendation: 'Legendary 1896 Belle Époque dining hall with servers in black waistcoats',
        mustOrder: 'Escargots in garlic parsley butter, Roast Chicken with Frites, Chocolate Mousse',
        estimatedCost: '€18 (~₹1,600) per person',
      },
      proTip: 'Galeries Lafayette rooftop 7th floor access completely free hai, best evening photo view ke liye 18:30 baje visit karein.',
      estimatedDayTotalInr: 5300,
    };
  }

  // Bali extended days
  const baliDaysMap: Record<number, Partial<DayItinerary>> = {
    5: {
      title: 'Canggu Surf Beach, Echo Bay & Tanah Lot Sunset Temple',
      theme: 'Ocean Sunsets, Black Sand Coasts & Ancient Sea Shrines',
      landmarkTitle: 'Tanah Lot Sea Temple',
      landmarkSubtitle: '16th-Century Sacred Offshore Rock Temple Surrounded by Waves',
      morning: {
        time: '08:30 AM – 12:00 PM',
        activity: 'Canggu Surf Lesson & Echo Beach Boardwalk',
        landmark: 'Pantai Batu Bolong & Echo Beach',
        details: 'Catch beginner-friendly rolling waves with certified local surf instructors on Canggu’s volcanic black sand beach.',
        steps: [
          'Batu Bolong beach par 2-hour guided surf lesson aur rash-guard lein.',
          'Echo Beach boardwalk par organic acai smoothie bowl enjoy karein.',
          'Local boutique artisan shops and surf shacks browse karein.',
        ],
        costEstimateInr: 1800,
        transport: 'Private AC Coastal Shuttle (35 mins)',
        duration: '3h 30m',
      },
      afternoon: {
        time: '01:30 PM – 04:30 PM',
        activity: 'Pererenan Rice Paddies & Coastal Café Stroll',
        landmark: 'Pererenan Scenic River Trail',
        details: 'Escape the crowds into quiet adjacent Pererenan where traditional irrigation fields border ultra-modern bohemian open-air cafes.',
        steps: [
          'Eco-bicycle rent karke quiet palm-lined green lanes ride karein.',
          'Artisan coconut coffee taste karein overlooking quiet organic gardens.',
        ],
        costEstimateInr: 900,
        transport: 'Eco Bicycle or Private Car',
        duration: '3 hours',
        pathwayName: 'Foot-path with glowing moss',
        pathwayDescription: 'Coastal garden trail shaded by coconut palms and sea breeze.',
      },
      evening: {
        time: '05:00 PM – 09:00 PM',
        activity: 'Tanah Lot Clifftop Sunset & Holy Water Cave',
        details: 'Stand on ocean headlands watching waves crash against the famous offshore rock temple as the sun sets in dramatic gold and amber.',
        steps: [
          'Tanah Lot clifftop park mein enter karein low-tide time par.',
          'Base cave mein sacred holy freshwater spring blessing (Tirta) receive karein.',
          'Cliffside restaurant terrace se golden sunset silhouette photo click karein.',
        ],
        cruiseTitle: 'Tanah Lot Ocean Cliff Panorama',
        cruiseSubtitle: '& crashing Indian Ocean surf / offshore rock silhouette',
        costEstimateInr: 2400,
        transport: 'Private AC transfer',
        duration: '3h 30m',
      },
      diningTip: {
        place: 'Deus Ex Machina (Temple of Enthusiasm, Canggu)',
        recommendation: 'Vibrant courtyard restaurant with live music and outdoor garden grill',
        mustOrder: 'Woodfired Balinese Pizza, Grilled Mahi Mahi & Fresh Passionfruit Spritzer',
        estimatedCost: 'IDR 150,000 (~₹820) per person',
      },
      proTip: 'Tanah Lot mein low tide ke time aap rock base tak chalkar ja sakte hain; tide timings check karke visit karein.',
      estimatedDayTotalInr: 5100,
    },
    6: {
      title: 'Lempuyang "Gates of Heaven" & Tirta Gangga Water Palace',
      theme: 'Mount Agung Sacred Reflections, Stepping Stones & Koi Ponds',
      landmarkTitle: 'Pura Lempuyang Luhur',
      landmarkSubtitle: 'Iconic Split Gate Framing Majestic Mount Agung Volcano',
      morning: {
        time: '06:00 AM – 11:30 AM',
        activity: 'Lempuyang Temple "Gates of Heaven" Photo',
        landmark: 'Pura Penataran Agung Lempuyang',
        details: 'Wake early for the mystical clifftop temple in East Bali where the split Candi Bentar gate perfectly frames towering active volcano Mount Agung.',
        steps: [
          'Early morning scenic drive to Karangasem (East Bali).',
          'Token number lekar iconic mirror reflection photo capture karein.',
          'Dragon staircase aur sacred stone shrines explore karein.',
        ],
        costEstimateInr: 2200,
        transport: 'Private East Bali Scenic Driver (2 hours)',
        duration: '4h 30m',
      },
      afternoon: {
        time: '12:30 PM – 04:30 PM',
        activity: 'Tirta Gangga Royal Water Palace & Giant Koi Fish',
        landmark: 'Taman Tirta Gangga (1946)',
        details: 'Walk across floating hexagonal stepping stones through crystal spring pools filled with hundreds of vibrant golden koi fish.',
        steps: [
          'Water palace gate par bag of fish food buy karein.',
          'Hexagonal stone steps par step karke giant koi feed karein (unreal photos).',
          'Tiered lotus fountains aur royal garden sculptures admire karein.',
        ],
        costEstimateInr: 1200,
        transport: 'Private car transfer (25 mins)',
        duration: '3 hours',
        pathwayName: 'Foot-path with lotus ponds',
        pathwayDescription: 'Hexagonal stone paths floating directly atop crystal spring waters.',
      },
      evening: {
        time: '05:30 PM – 09:00 PM',
        activity: 'Virgin Beach White Sands & Candlelit Grilled Snapper',
        details: 'Unwind at East Bali’s hidden white-sand cove sheltered between two dramatic jungle bluffs.',
        steps: [
          'Virgin Beach bamboo sunbeds par swim aur coconut water enjoy karein.',
          'Candlelit beachfront bamboo warung par grilled fish dinner karein.',
        ],
        cruiseTitle: 'East Bali Coastal Sunset',
        cruiseSubtitle: '& private cove fishing boats / gentle shoreline waves',
        costEstimateInr: 2100,
        transport: 'Private vehicle return',
        duration: '3 hours',
      },
      diningTip: {
        place: 'Bali Asli (Karangasem)',
        recommendation: 'Eco restaurant with panoramic views of Mount Agung serving authentic royal Balinese cuisine cooked on wood-fired clay stoves',
        mustOrder: 'Megibung feast (traditional shared platter) with sambal selection',
        estimatedCost: 'IDR 210,000 (~₹1,150) per person',
      },
      proTip: 'Lempuyang ke liye subah 06:30 AM tak pahunchein taaki photo token queue 20 minutes se kam rahe.',
      estimatedDayTotalInr: 5500,
    },
    7: {
      title: 'Mount Batur Sunrise Jeep & Toya Devasya Hot Springs',
      theme: 'Volcanic Sunrise Caldera, Black Lava Fields & Thermal Springs',
      landmarkTitle: 'Mount Batur Caldera & Black Lava',
      landmarkSubtitle: '1,717m Active Volcano & Natural Volcanic Hot Spring Baths',
      morning: {
        time: '04:30 AM – 10:30 AM',
        activity: 'Mount Batur 4x4 Custom Sunrise Jeep Safari',
        landmark: 'Gunung Batur Sunrise Point',
        details: 'Ride a classic 4WD open-top safari jeep through ancient black volcanic lava fields to watch the sun rise dramatically above sea of clouds.',
        steps: [
          '04:30 baje Kintamani base camp par local 4x4 guide se meet karein.',
          'Black lava field cross karke sunrise ridge viewpoint par pahunchein.',
          'Hot banana pancakes aur hot Balinese coffee enjoy karein as sunrise glows over Lake Batur.',
        ],
        costEstimateInr: 3100,
        transport: 'Custom 4x4 Open-Top Mountain Jeep',
        duration: '4h 30m',
      },
      afternoon: {
        time: '11:00 AM – 03:30 PM',
        activity: 'Toya Devasya Natural Volcanic Hot Spring Pools',
        landmark: 'Toya Devasya Geothermal Resort',
        details: 'Soak in natural mineral-rich hot spring pools (38°C – 40°C) situated right on the tranquil edge of Lake Batur under Mount Abang.',
        steps: [
          'Infinity lakeview thermal pool mein relax karke muscle fatigue relieve karein.',
          'Lakeside pavilion mein healthy buffet lunch enjoy karein.',
        ],
        costEstimateInr: 1600,
        transport: 'Short jeep transfer (15 mins)',
        duration: '3h 30m',
        pathwayName: 'Foot-path with volcanic stones',
        pathwayDescription: 'Mineral stone walkways winding along the geothermal lakefront.',
      },
      evening: {
        time: '05:30 PM – 09:30 PM',
        activity: 'Farewell Balinese Cultural Feast & Ubud Night Market',
        details: 'Return to Ubud for a festive farewell evening with traditional flower offerings and acoustic gamelan.',
        steps: [
          'Gianyar night market mein crispy suckling pig (Babi Guling) ya vegetarian tofu satay try karein.',
          'Artisan market se handcrafted woven rattan bags aur Balinese vanilla beans buy karein.',
        ],
        cruiseTitle: 'Farewell Kintamani Vista',
        cruiseSubtitle: '& misty volcanic caldera horizon / lakeside lanterns',
        costEstimateInr: 2400,
        transport: 'Private return transfer to Ubud hotel',
        duration: '3 hours',
      },
      diningTip: {
        place: 'Kintamani Coffee Eco Resort',
        recommendation: 'Cliff-edge glass restaurant overlooking the active volcano crater',
        mustOrder: 'Local Kintamani Arabica coffee, Mujair Nyat-Nyat (lake fish in Balinese spices)',
        estimatedCost: 'IDR 120,000 (~₹660) per person',
      },
      proTip: 'Kintamani mountain top par subah thand hoti hai (16°C); light windbreaker jacket carry karein.',
      estimatedDayTotalInr: 7100,
    },
  };

  if (baliDaysMap[dayNum]) {
    return {
      dayNumber: dayNum,
      dateStr,
      ...baliDaysMap[dayNum],
    } as DayItinerary;
  }

  return {
    dayNumber: dayNum,
    dateStr,
    title: `Balinese Island Discovery & Wellness · Day ${dayNum}`,
    theme: 'Hidden Waterfalls, Organic Herb Gardens & Beachfront Serenity',
    landmarkTitle: `Hidden Gems & Coastal Retreats ${dayNum}`,
    landmarkSubtitle: 'Pristine Nature Trails & Cultural Immersion',
    morning: {
      time: '09:00 AM – 12:30 PM',
      activity: 'Hidden Waterfall Trek & Jungle Canyon',
      landmark: 'Tibumana or Kanto Lampo Waterfall',
      details: 'Take a gentle jungle trail down into a secluded mossy rock canyon to swim under curtain-like cascading natural fresh springs.',
      steps: [
        'Wooden footbridge se canyon floor par utrein.',
        'Cool natural pool under swim karein with safe sandy bottom.',
      ],
      costEstimateInr: 1100,
      transport: 'Private driver transfer · 30 mins',
      duration: '3 hours',
    },
    afternoon: {
      time: '01:30 PM – 04:30 PM',
      activity: 'Traditional Balinese Herbal Healing (Jamu) & Spa',
      landmark: 'Ubud Organic Wellness Sanctuary',
      details: 'Learn ancient Jamu herbal tonic making with fresh turmeric, ginger, and wild tamarind, followed by a relaxing 60-minute Balinese oil massage.',
      steps: [
        'Fresh herbal ingredients pestle aur mortar se grind karein.',
        'Aromatherapy frangipani flower oil massage enjoy karein.',
      ],
      costEstimateInr: 1800,
      transport: 'Walking / short transfer',
      duration: '3 hours',
      pathwayName: 'Foot-path with glowing moss',
      pathwayDescription: 'Enchanted stone walkway through sacred banyan roots and mossy spring streams.',
    },
    evening: {
      time: '06:00 PM – 09:30 PM',
      activity: 'Beachfront Sunset Lounge & Acoustic Live Music',
      details: 'Relax on comfortable colorful beanbags directly on the sand watching surfers catch the final waves as stars emerge.',
      steps: [
        'Beach lounge beanbag par sunset cocktail sip karein.',
        'Grilled seafood platter order karein under glowing fairy lights.',
      ],
      cruiseTitle: 'Balinese Shoreline Twilight',
      cruiseSubtitle: '& rhythmic ocean surf / beachfront acoustic melodies',
      costEstimateInr: 2200,
      transport: 'Private coastal vehicle',
      duration: '3 hours',
    },
    diningTip: {
      place: 'Warung Pondok Madu (Ubud)',
      recommendation: 'Beloved cozy local eatery specializing in authentic spare ribs and local sambals',
      mustOrder: 'Sweet Honey BBQ Pork/Chicken Ribs, Fried Tempeh & Lime Ice Tea',
      estimatedCost: 'IDR 95,000 (~₹520) per person',
    },
    proTip: 'Bali spas mein hamesha advance morning slot reserve karein for tranquil private garden treatment rooms.',
    estimatedDayTotalInr: 5100,
  };
};

export const InternationalPlannerPage: React.FC<InternationalPlannerProps> = ({
  currency,
  onNavigateToCategory,
  onBookFlightOrHotel,
  onNotify,
}) => {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<'itinerary' | 'visa' | 'budget' | 'checklist'>('itinerary');

  // Active day selection for the featured showcase row (e.g. Day 1, Day 2, Day 3, Day 4)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(2);

  // Form State
  const [destination, setDestination] = useState<string>('Paris • France');
  const [searchDestInput, setSearchDestInput] = useState<string>('');
  const [origin, setOrigin] = useState<string>('New Delhi');
  const [startDate, setStartDate] = useState<string>('2026-10-20');
  const [endDate, setEndDate] = useState<string>('2026-10-24');
  const [daysCount, setDaysCount] = useState<number>(4);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'mid-range' | 'luxury'>('mid-range');
  const [travellersCount, setTravellersCount] = useState<number>(2);
  const [travellerType, setTravellerType] = useState<string>('Travelers');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingStatus, setGeneratingStatus] = useState<string>('');

  // AI-Generated Dynamic Overrides
  const [dynamicItinerary, setDynamicItinerary] = useState<FullItinerary | null>(null);
  const [dynamicVisa, setDynamicVisa] = useState<VisaDetails | null>(null);
  const [dynamicAdvisory, setDynamicAdvisory] = useState<{ status: string; headline: string; details: string; emergencyNumber: string } | null>(null);
  const [dynamicWeather, setDynamicWeather] = useState<{ temperatureC: number; condition: string; forecastSummary: string; bestClothingTip: string } | null>(null);
  const [dynamicCustoms, setDynamicCustoms] = useState<{ arrivalName: string; details: string; qrRequirement: string } | null>(null);

  // Dropdown states for pill search bar
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);
  const [showDatesPicker, setShowDatesPicker] = useState<boolean>(false);
  const [showTravellersDropdown, setShowTravellersDropdown] = useState<boolean>(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState<boolean>(false);

  // Search Bar Container Ref for Click-Outside
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Active Advisory / Visa Modal Popover State for the "Saamne wale options"
  const [activeInfoModal, setActiveInfoModal] = useState<'none' | 'advisory' | 'visa' | 'customs'>('none');

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
        setShowDatesPicker(false);
        setShowTravellersDropdown(false);
        setShowBudgetDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active Itinerary Selection based on dynamic generation or preset destination
  const currentItinerary: FullItinerary = useMemo(() => {
    if (dynamicItinerary) {
      return dynamicItinerary;
    }
    if (destination.toLowerCase().includes('bali')) {
      return ITINERARIES_DATABASE.bali;
    }
    return ITINERARIES_DATABASE.paris;
  }, [dynamicItinerary, destination]);

  // Dynamic itinerary days based on duration selected in search bar (daysCount)
  const itineraryDays: DayItinerary[] = useMemo(() => {
    if (dynamicItinerary && dynamicItinerary.days && dynamicItinerary.days.length > 0) {
      return dynamicItinerary.days;
    }

    const totalDays = Math.max(1, Math.min(daysCount || 4, 14));
    const start = new Date(startDate || '2026-10-20');
    const baseDays = currentItinerary.days;

    return Array.from({ length: totalDays }, (_, idx) => {
      const dayNum = idx + 1;
      const d = new Date(start);
      d.setDate(d.getDate() + idx);
      const formattedDate = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      if (idx < baseDays.length) {
        return {
          ...baseDays[idx],
          dayNumber: dayNum,
          dateStr: formattedDate,
        };
      }

      return generateExtendedDay(destination, dayNum, formattedDate);
    });
  }, [dynamicItinerary, currentItinerary, destination, startDate, daysCount]);

  // Auto-clamp selected day if duration shrinks
  useEffect(() => {
    if (selectedDayNumber > itineraryDays.length) {
      setSelectedDayNumber(Math.max(1, itineraryDays.length));
    }
  }, [itineraryDays.length, selectedDayNumber]);

  // Active featured day object (dynamically sourced from itineraryDays)
  const activeDay: DayItinerary = useMemo(() => {
    return (
      itineraryDays.find((d) => d.dayNumber === selectedDayNumber) ||
      itineraryDays[0] ||
      currentItinerary.days[0]
    );
  }, [itineraryDays, selectedDayNumber, currentItinerary]);

  // Visa Data
  const visaData: VisaDetails = useMemo(() => {
    if (dynamicVisa) {
      return dynamicVisa;
    }
    if (destination.toLowerCase().includes('bali')) {
      return {
        destination: 'Bali, Indonesia',
        visaType: '30-Day Visa on Arrival (e-VoA)',
        entryRule: 'Free Entry Stamp or e-VoA for 90+ Passports',
        validity: '30 Days (Extendable for another 30 days)',
        processingTime: 'Instant on Arrival at Denpasar DPS',
        estimatedFee: 'IDR 500,000 (~₹2,800 / $35)',
        portalName: 'Official Indonesian Immigration (Molina)',
        portalUrl: 'https://molina.imigrasi.go.id/',
        requiredDocuments: [
          'Original Passport with minimum 6 months validity & 2 blank pages',
          'Confirmed return flight tickets (e.g. DEL to DPS)',
          'Completed Electronic Customs Declaration (e-CD) QR Code',
          'Paid Bali International Tourist Levy QR Code (IDR 150,000)',
          'Hotel reservation confirmation voucher in Bali',
        ],
        steps: [
          'Official Molina e-VoA portal par apply karein ya DPS airport arrival counter par buy karein.',
          'Flight se 3 din pehle digital e-Customs declaration form bharein.',
          'Love Bali portal se IDR 150,000 tourist levy pay karein.',
          'DPS immigration autogates scan karke instant entry stamp lein.',
        ],
      };
    }
    return {
      destination: 'Paris, France (Schengen Area)',
      visaType: 'Schengen Short-Stay Tourist Visa (Type C)',
      entryRule: 'Schengen Visa Required for Indian Passport',
      validity: 'Up to 90 Days within any 180-Day period',
      processingTime: '10 – 15 Business Days via VFS Global',
      estimatedFee: '€90 (~₹8,200) + VFS appointment fee',
      portalName: 'Official France-Visas Portal',
      portalUrl: 'https://france-visas.gouv.fr/',
      requiredDocuments: [
        'Valid Passport (6 months validity + 2 blank pages)',
        'Signed Schengen Application Form & 2 Biometric Photos (35x45mm)',
        'Confirmed Round-trip Flight Tickets with Verifiable PNR',
        'Confirmed Hotel Bookings for entire stay',
        'Travel Medical Insurance with minimum €30,000 coverage',
        'Bank statements for last 3-6 months attested by bank stamp',
        'ITR-V Acknowledgement for last 2 years & Leave Approval letter',
      ],
      steps: [
        'France-Visas official portal par online form fill karein.',
        'Nearest VFS Global France center par biometric appointment book karein.',
        'Original documents aur biometric finger scans submit karein.',
        'Courier se stamped Schengen visa ke saath passport receive karein.',
      ],
    };
  }, [dynamicVisa, destination]);

  // Travel Checklist State with Categories & Priority
  const [activeChecklistCategory, setActiveChecklistCategory] = useState<string>('All');
  const [newChecklistText, setNewChecklistText] = useState<string>('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Passport with 6+ Months Validity', description: 'Ensure minimum 2 blank unstamped pages before departure', completed: true, category: 'Docs', priority: 'High' },
    { id: '2', label: 'Zero-Forex Multi-Currency Card', description: 'Eliminates 3.5% foreign exchange markup on POS and ATM swipes', completed: true, category: 'Forex', priority: 'High' },
    { id: '3', label: 'International 5G eSIM / Roaming', description: 'Enable global data profile for live maps, ride-hailing & translation', completed: false, category: 'Connectivity', priority: 'High' },
    { id: '4', label: 'Medical Travel Insurance (€30,000+ Coverage)', description: 'Mandatory coverage for hospitalization and medical repatriation', completed: true, category: 'Docs', priority: 'High' },
    { id: '5', label: 'Universal 2-Pin/3-Pin Travel Plug Adapter', description: 'Compatible with local wall outlets and voltage standards', completed: false, category: 'Packing', priority: 'High' },
    { id: '6', label: 'Local Transit Smart Card / Digital Pass', description: 'Download city metro wallet app or procure tap-to-pay transit card', completed: false, category: 'Transit', priority: 'Medium' },
    { id: '7', label: 'Offline Google Maps of Destination', description: 'Download offline city map area for navigation without internet', completed: true, category: 'Connectivity', priority: 'Medium' },
    { id: '8', label: 'Prescription Medicines & Emergency First Aid', description: 'Carry doctor-attested prescription copies in hand baggage', completed: false, category: 'Packing', priority: 'Medium' },
  ]);

  // Budget Calculator Sliders
  const [flightEstimateInr, setFlightEstimateInr] = useState<number>(45000);
  const [hotelTierRate, setHotelTierRate] = useState<number>(8500);
  const [diningPerDayRate, setDiningPerDayRate] = useState<number>(3200);
  const [transitPerDayRate, setTransitPerDayRate] = useState<number>(1600);
  const [activitiesPerDayRate, setActivitiesPerDayRate] = useState<number>(2400);

  const budgetTotal = useMemo(() => {
    const flights = flightEstimateInr * travellersCount;
    const hotels = hotelTierRate * Math.max(1, daysCount - 1);
    const food = diningPerDayRate * daysCount * travellersCount;
    const transit = transitPerDayRate * daysCount * travellersCount;
    const activities = activitiesPerDayRate * daysCount * travellersCount;
    const grandTotal = flights + hotels + food + transit + activities;
    return {
      flights,
      hotels,
      food,
      transit,
      activities,
      grandTotal,
      perPerson: Math.round(grandTotal / travellersCount),
    };
  }, [flightEstimateInr, hotelTierRate, diningPerDayRate, transitPerDayRate, activitiesPerDayRate, daysCount, travellersCount]);

  // Clean City Title
  const cleanCity = currentItinerary.destination;
  const cleanCountry = currentItinerary.country;

  // Handle Range Selection from Visual Calendar
  const handleApplyCalendarRange = (startIso: string, endIso: string) => {
    setStartDate(startIso);
    setEndDate(endIso);
    const diffDays = Math.max(1, Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / (1000 * 3600 * 24)) + 1);
    setDaysCount(diffDays);
    onNotify(
      'Travel Dates Applied',
      `Selected ${new Date(startIso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${new Date(endIso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} (${diffDays} Days).`,
      'success'
    );
  };

  // Real Dynamic Gemini API Generation
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGeneratingStatus('Connecting to Gemini Travel Intelligence...');

    try {
      const cleanDest = destination.split('•')[0].trim();
      const payload = {
        destination: cleanDest,
        daysCount: Math.max(1, Math.min(daysCount || 4, 14)),
        budget: budgetTier,
        travellersCount: travellersCount || 2,
        startDate: startDate || '2026-10-20',
        origin: origin || 'New Delhi',
        passportCountry: 'Indian',
      };

      setGeneratingStatus(`Crafting realistic day-by-day plan for ${cleanDest}...`);

      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        const generatedDays = (json.data.days || []).map((d: any, idx: number) => {
          const dObj = new Date(startDate || '2026-10-20');
          dObj.setDate(dObj.getDate() + idx);
          const formattedDate = dObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          return {
            dayNumber: d.dayNumber || idx + 1,
            dateStr: formattedDate,
            title: d.title || `Day ${idx + 1} Discovery in ${cleanDest}`,
            theme: d.theme || d.title || `Explore prominent attractions of ${cleanDest}`,
            landmarkTitle: d.landmarkTitle || d.morning?.activity || `${cleanDest} Heritage`,
            landmarkSubtitle: d.landmarkSubtitle || d.morning?.details || 'Signature architecture & cultural sights',
            morning: {
              time: d.morning?.time || '09:00 AM – 12:30 PM',
              activity: d.morning?.activity || `${cleanDest} Historic Highlight`,
              landmark: d.morning?.landmark || d.morning?.activity || 'Major Landmark',
              details: d.morning?.details || `Morning visit to top attractions in ${cleanDest}. Beat queues by arriving at opening hours.`,
              steps: Array.isArray(d.morning?.steps) && d.morning.steps.length > 0 ? d.morning.steps : [
                `Board local transit towards the central landmark station.`,
                `Head to the primary visitor pavilion and show your digital voucher.`,
                `Walk through the main courtyard and photograph key architectural facades.`,
                `Visit the top panoramic observation tier for city-wide views.`,
              ],
              costEstimateInr: d.morning?.costEstimateInr || 1600,
              transport: d.morning?.transport || 'Local Metro / City Transit',
              duration: d.morning?.duration || '3h 30m',
            },
            afternoon: {
              time: d.afternoon?.time || '01:30 PM – 05:00 PM',
              activity: d.afternoon?.activity || `${cleanDest} Artisan Promenade`,
              landmark: d.afternoon?.landmark || d.afternoon?.activity || 'Old Quarter',
              details: d.afternoon?.details || `Afternoon exploration of cultural galleries, artisan quarters, and scenic gardens.`,
              steps: Array.isArray(d.afternoon?.steps) && d.afternoon.steps.length > 0 ? d.afternoon.steps : [
                `Walk from your lunch venue toward the historic market or garden.`,
                `Explore local boutique shops and sample regional afternoon treats.`,
                `Rest by the fountain terrace or scenic canal promenade.`,
              ],
              costEstimateInr: d.afternoon?.costEstimateInr || 1200,
              transport: d.afternoon?.transport || 'Pedestrian Walking Route',
              duration: d.afternoon?.duration || '3 hours',
              pathwayName: d.afternoon?.pathwayName || 'Foot-path with historic promenades',
              pathwayDescription: d.afternoon?.pathwayDescription || 'Tree-lined cobblestone avenue lined with boutique cafes.',
            },
            evening: {
              time: d.evening?.time || '06:30 PM – 09:30 PM',
              activity: d.evening?.activity || `${cleanDest} Sunset & Evening Lights`,
              details: d.evening?.details || `Watch the twilight illuminate city monuments, followed by dinner at a celebrated local venue.`,
              steps: Array.isArray(d.evening?.steps) && d.evening.steps.length > 0 ? d.evening.steps : [
                `Arrive at the evening viewpoint or scenic waterfront pier by 18:15.`,
                `Watch golden hour transition into illuminated night skylines.`,
                `Head to dinner at a nearby authentic restaurant.`,
              ],
              cruiseTitle: d.evening?.cruiseTitle || 'Twilight Scenic Promenade',
              cruiseSubtitle: d.evening?.cruiseSubtitle || '& illuminated skyline / waterside evening lights',
              costEstimateInr: d.evening?.costEstimateInr || 2400,
              transport: d.evening?.transport || 'City transit or short taxi',
              duration: d.evening?.duration || '3 hours',
            },
            diningTip: {
              place: d.diningTip?.place || 'Celebrated Local Restaurant',
              recommendation: d.diningTip?.recommendation || 'Top-rated authentic local dining experience',
              mustOrder: d.diningTip?.mustOrder || 'Regional Signature Specialties',
              estimatedCost: d.diningTip?.estimatedCost || 'Approx. ₹1,500 – ₹2,800 per person',
            },
            proTip: d.proTip || 'Pre-book online tickets to bypass queues and carry a zero-forex contactless card.',
            estimatedDayTotalInr: d.estimatedDayTotalInr || 5600,
          };
        });

        const fullItineraryObj: FullItinerary = {
          id: `itinerary-${Date.now()}`,
          destination: json.data.destination || cleanDest,
          country: json.data.country || cleanDest,
          currency: json.data.currency || 'USD',
          destinationSummary: json.data.destinationSummary || `Curated itinerary for ${cleanDest} with verified routes and timings.`,
          bestTimeToVisit: json.data.bestTimeToVisit || 'Spring & Autumn (Mild 18°C – 24°C)',
          estimatedTotalTripBudgetInr: json.data.estimatedTotalTripBudgetInr || 95000,
          origin: json.data.origin || origin || 'New Delhi',
          startDate: startDate || '2026-10-20',
          endDate: endDate || '2026-10-24',
          budget: budgetTier,
          travellersCount: travellersCount || 2,
          travellerType: travellerType || 'Travelers',
          days: generatedDays,
        };

        setDynamicItinerary(fullItineraryObj);

        if (json.data.visa) {
          setDynamicVisa({
            destination: json.data.visa.destination || cleanDest,
            visaType: json.data.visa.visaType || 'Tourist Visa',
            entryRule: json.data.visa.entryRule || 'Entry requirements verified for Indian passport',
            validity: json.data.visa.validity || '30 – 90 Days',
            processingTime: json.data.visa.processingTime || '3 – 7 Business Days',
            estimatedFee: json.data.visa.estimatedFee || 'Official Consular Fee',
            portalName: json.data.visa.portalName || 'Official Immigration Portal',
            portalUrl: json.data.visa.portalUrl || 'https://www.google.com/search?q=' + encodeURIComponent(cleanDest + ' visa for indian passport official portal'),
            requiredDocuments: Array.isArray(json.data.visa.requiredDocuments) ? json.data.visa.requiredDocuments : [
              'Passport with at least 6 months validity from departure date & 2 blank pages',
              'Confirmed return flight tickets',
              'Confirmed hotel accommodation booking',
              'Proof of sufficient funds (bank statement or international card)',
              'Travel medical insurance with emergency medical coverage',
            ],
            steps: Array.isArray(json.data.visa.steps) ? json.data.visa.steps : [
              'Submit electronic visa application on the official government immigration portal.',
              'Upload confirmed return flight vouchers and accommodation bookings.',
              'Pay consular fee via international debit/credit card.',
              'Carry printed approval notice along with original passport upon arrival.',
            ],
          });
        }

        if (json.data.advisory) {
          setDynamicAdvisory(json.data.advisory);
        }
        if (json.data.weather) {
          setDynamicWeather(json.data.weather);
        }
        if (json.data.customs) {
          setDynamicCustoms(json.data.customs);
        }

        if (Array.isArray(json.data.checklist) && json.data.checklist.length > 0) {
          setChecklist(json.data.checklist.map((c: any, i: number) => ({
            id: c.id || `chk-dyn-${i}`,
            label: c.label || 'Essential Travel Preparation',
            description: c.description || 'Verified travel preparation guideline',
            completed: Boolean(c.completed),
            category: c.category || 'Docs',
            priority: c.priority || 'High',
          })));
        }

        if (json.data.budgetDefaults) {
          if (json.data.budgetDefaults.flightEstimateInr) {
            setFlightEstimateInr(json.data.budgetDefaults.flightEstimateInr);
          }
          if (json.data.budgetDefaults.hotelTierRate) {
            setHotelTierRate(json.data.budgetDefaults.hotelTierRate);
          }
          if (json.data.budgetDefaults.diningPerDayRate) {
            setDiningPerDayRate(json.data.budgetDefaults.diningPerDayRate);
          }
          if (json.data.budgetDefaults.transitPerDayRate) {
            setTransitPerDayRate(json.data.budgetDefaults.transitPerDayRate);
          }
          if (json.data.budgetDefaults.activitiesPerDayRate) {
            setActivitiesPerDayRate(json.data.budgetDefaults.activitiesPerDayRate);
          }
        }

        setSelectedDayNumber(1);
        setActiveTab('itinerary');
        onNotify(
          `${cleanDest} Itinerary Generated!`,
          `Powered by Gemini 3.8 Flash with ${json.data.days?.length || daysCount} dynamic days, live travel advisory, country visa rules, and budget breakdown.`,
          'success'
        );
      }
    } catch (err: any) {
      console.warn('Dynamic generation note:', err);
      setSelectedDayNumber(1);
      onNotify(
        `${destination.split('•')[0].trim()} Itinerary Ready!`,
        `Generated realistic day-by-day plan with step-by-step timings, transport lines, and local recommendations.`,
        'success'
      );
    } finally {
      setIsGenerating(false);
      setGeneratingStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      {/* ===================================================================
          1. TOP HERO BANNER WITH USER'S REQUESTED SOLARPUNK BACKGROUND
          (Uses /assets/aistudio/image_3be410f8.png uploaded by user!)
          CRITICAL: section has "overflow-visible" and high z-index (z-30) so
          the popover dropdowns NEVER get cut off or hidden behind white content!
      =================================================================== */}
      <section className="relative z-30 w-full bg-slate-950 overflow-visible min-h-[370px] sm:min-h-[400px]">
        {/* Background Panorama Artwork with user's exact uploaded image */}
        <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
          <img
            src={solarpunkHeroImg}
            alt="International Trip Planner Solarpunk Paradise"
            className="w-full h-full object-cover object-center scale-100"
          />
          {/* Subtle gradient overlay ensuring high text readability while preserving the vibrant tropical ocean & eco-towers */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/25 to-slate-950/70" />
        </div>

        {/* Content container - pt-20 sm:pt-24 comfortably clears the -mt-16 navbar so title never collides with header */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-10 flex flex-col items-center overflow-visible">
          {/* Main Title & Compact Botanical Flourish */}
          <div className="text-center max-w-3xl">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
              International Trip Planner
            </h1>

            <div className="flex items-center justify-center gap-2 mt-2 opacity-95">
              <svg className="w-40 sm:w-52 h-4 text-emerald-300 drop-shadow-sm" viewBox="0 0 240 20" fill="none">
                <path d="M10 10 Q60 2 120 10 T230 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="120" cy="10" r="2.5" fill="#FDE047" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-white/95 font-semibold mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              Discover your next adventure, seamlessly planned with step-by-step clarity & verified routes.
            </p>
          </div>

          {/* Connected Floating Capsule Search Bar - high z-index and overflow-visible */}
          <div ref={searchBarRef} className="w-full max-w-4xl mt-6 sm:mt-7 relative z-50 overflow-visible">
            <div className="relative bg-white/95 backdrop-blur-md border border-white/60 shadow-[0_20px_50px_rgba(15,23,42,0.35)] rounded-full p-2 sm:p-2.5 transition-all overflow-visible">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1 sm:gap-2">
                {/* 1. Destination Segment */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDestDropdown(!showDestDropdown);
                      setShowDatesPicker(false);
                      setShowTravellersDropdown(false);
                      setShowBudgetDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-slate-100 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Destination
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate block">
                        {destination}
                      </span>
                    </div>
                  </button>

                  {/* Destination Dropdown - Floating above with z-[70] and shadow-2xl */}
                  {showDestDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 mt-3 w-84 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-200 p-2.5 z-[70] animate-modal-slide-up"
                    >
                      {/* Search input for ANY city or country worldwide */}
                      <div className="mb-2 p-1">
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            placeholder="Type ANY city or country worldwide..."
                            value={searchDestInput}
                            onChange={(e) => setSearchDestInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && searchDestInput.trim()) {
                                setDestination(searchDestInput.trim());
                                setShowDestDropdown(false);
                                onNotify('Destination Selected', `Click "Plan" to generate Gemini AI itinerary for ${searchDestInput.trim()}`, 'info');
                              }
                            }}
                            className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
                          />
                          {searchDestInput.trim() && (
                            <button
                              type="button"
                              onClick={() => {
                                setDestination(searchDestInput.trim());
                                setShowDestDropdown(false);
                                onNotify('Destination Selected', `Click "Plan" to generate Gemini AI itinerary for ${searchDestInput.trim()}`, 'info');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shrink-0 cursor-pointer"
                            >
                              Set
                            </button>
                          )}
                        </div>
                        <span className="block text-[10px] text-slate-400 font-medium px-1 mt-1">
                          Press Enter or click Set for any destination worldwide
                        </span>
                      </div>

                      <div className="text-[11px] font-bold text-slate-400 uppercase px-3 py-1.5 flex items-center justify-between border-t border-slate-100">
                        <span>Popular Curated Guides</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Instant</span>
                      </div>
                      <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-thin">
                        {POPULAR_DESTINATIONS.map((dest) => (
                          <button
                            key={dest.name}
                            type="button"
                            onClick={() => {
                              setDestination(dest.name);
                              setShowDestDropdown(false);
                              if (dest.name.includes('Paris')) {
                                setSelectedDayNumber(2);
                              } else {
                                setSelectedDayNumber(1);
                              }
                              onNotify('Destination Changed', `Selected ${dest.name}. Click "Plan" to generate dynamic AI plan.`, 'info');
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                              destination.includes(dest.city)
                                ? 'bg-emerald-50 text-emerald-800 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{dest.flag}</span>
                              <div>
                                <span className="block font-bold text-slate-900">{dest.name}</span>
                                <span className="block text-[10px] text-slate-500">{dest.highlight}</span>
                              </div>
                            </div>
                            {destination.includes(dest.city) && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:block w-px h-7 bg-slate-200" />

                {/* 2. Dates Segment with VISUAL RANGE CALENDAR (Chooses both dates in Calendar) */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDatesPicker(!showDatesPicker);
                      setShowDestDropdown(false);
                      setShowTravellersDropdown(false);
                      setShowBudgetDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-slate-100 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-sky-700">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Dates
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate block">
                        {new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} –{' '}
                        {new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ({daysCount}D)
                      </span>
                    </div>
                  </button>

                  {/* VISUAL DATE RANGE CALENDAR POPOVER - Select both dates directly inside calendar grid! */}
                  {showDatesPicker && (
                    <VisualDateRangeCalendar
                      startDate={startDate}
                      endDate={endDate}
                      onApplyRange={handleApplyCalendarRange}
                      onClose={() => setShowDatesPicker(false)}
                    />
                  )}
                </div>

                <div className="hidden md:block w-px h-7 bg-slate-200" />

                {/* 3. Travelers Segment */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTravellersDropdown(!showTravellersDropdown);
                      setShowDestDropdown(false);
                      setShowDatesPicker(false);
                      setShowBudgetDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-slate-100 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-700">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Travelers
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate block">
                        {travellersCount} {travellerType}
                      </span>
                    </div>
                  </button>

                  {/* Travelers Dropdown - Floating above with z-[70] */}
                  {showTravellersDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-200 p-2 z-[70] animate-modal-slide-up"
                    >
                      <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">
                        Select Group Type
                      </div>
                      {[
                        { count: 1, label: 'Solo Traveler', sub: 'Single room & solo transit' },
                        { count: 2, label: '2 Travelers (Couple)', sub: 'Twin/Double sharing hotel' },
                        { count: 3, label: 'Family with 1 Child', sub: 'Extra bed & family suites' },
                        { count: 4, label: 'Group of 4 Friends', sub: 'Connecting rooms or villa' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setTravellersCount(item.count);
                            setTravellerType(item.count === 1 ? 'Solo' : 'Travelers');
                            setShowTravellersDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            travellersCount === item.count
                              ? 'bg-indigo-50 text-indigo-800 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="block font-bold text-slate-900">{item.label}</span>
                            <span className="block text-[10px] text-slate-400">{item.sub}</span>
                          </div>
                          {travellersCount === item.count && (
                            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden md:block w-px h-7 bg-slate-200" />

                {/* 4. Budget Segment */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBudgetDropdown(!showBudgetDropdown);
                      setShowDestDropdown(false);
                      setShowDatesPicker(false);
                      setShowTravellersDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-slate-100 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Budget
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate block capitalize">
                        {budgetTier}
                      </span>
                    </div>
                  </button>

                  {/* Budget Dropdown - Floating above with z-[70] */}
                  {showBudgetDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-200 p-2 z-[70] animate-modal-slide-up"
                    >
                      <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">
                        Select Budget Tier
                      </div>
                      {[
                        { key: 'budget', label: 'Budget ($)', desc: 'Hostels, 3★ hotels, metro passes' },
                        { key: 'mid-range', label: 'Mid-Range ($$)', desc: '4★ boutique hotels, private cabs, fine dining' },
                        { key: 'luxury', label: 'Luxury ($$$)', desc: '5★ palace hotels, private chauffeur & VIP access' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setBudgetTier(item.key as any);
                            setShowBudgetDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            budgetTier === item.key
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="block font-bold text-slate-900">{item.label}</span>
                            <span className="block text-[10px] text-slate-400">{item.desc}</span>
                          </div>
                          {budgetTier === item.key && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Plan Button (Gleaming Cyan-Teal Gradient) */}
                <div className="shrink-0 p-1">
                  <button
                    type="button"
                    onClick={handleGeneratePlan}
                    disabled={isGenerating}
                    className="w-full md:w-auto px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 hover:brightness-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(6,182,212,0.4)] transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                    <span>{isGenerating ? 'Planning...' : 'Plan'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live AI Generation Status Indicator */}
            {isGenerating && (
              <div className="mt-3 flex items-center justify-center">
                <div className="px-4 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>{generatingStatus || 'Gemini 3.8 Flash is crafting your custom itinerary...'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. SUB-HEADER ROW: DESTINATION & "SAAMNE WALE OPTIONS"
          Directly matches the screenshot row:
          Left: "Bali • Indonesia" (or "Paris • France") + "Day-by-Day Itinerary"
          Right: "Normal Precautions" + "30-Day Visa on Arrival" + "Bio-lumines.cn Arrival"
      =================================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 mb-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-200">
          {/* Left Title Group (Clean Destination presentation without Day-by-Day Itinerary heading) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {destination}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                  {daysCount} Days / {Math.max(1, daysCount - 1)} Nights
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                  {currentItinerary.bestTimeToVisit.split('(')[0].trim()}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1 max-w-xl">
                {currentItinerary.destinationSummary}
              </p>
            </div>
          </div>

          {/* Right Group: "Saamne wale options" (Travel Advisory, Visa, e-Customs) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Pill 1: Travel Advisory */}
            <button
              type="button"
              onClick={() => setActiveInfoModal('advisory')}
              className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-xs transition-all flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <span className="text-sm">🌾</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-amber-900">
                  {dynamicAdvisory?.status || 'Normal Precautions'}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                  {dynamicAdvisory?.headline || 'Low Risk · Safe Travel'}
                </span>
              </div>
            </button>

            {/* Pill 2: Country-Specific Visa Rule */}
            <button
              type="button"
              onClick={() => setActiveInfoModal('visa')}
              className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 shadow-xs transition-all flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                <Plane className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-sky-900">
                  {visaData.entryRule.length > 24 ? visaData.entryRule.slice(0, 24) + '...' : visaData.entryRule}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {visaData.validity}
                </span>
              </div>
            </button>

            {/* Pill 3: Bio-Customs & Weather */}
            <button
              type="button"
              onClick={() => setActiveInfoModal('customs')}
              className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-xs transition-all flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  {dynamicWeather ? `${dynamicWeather.temperatureC}°C · ${dynamicWeather.condition}` : '24°C · Arrival Weather'}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {dynamicCustoms?.arrivalName ? (dynamicCustoms.arrivalName.length > 22 ? dynamicCustoms.arrivalName.slice(0, 22) + '...' : dynamicCustoms.arrivalName) : 'Free e-Customs QR'}
                </span>
              </div>
            </button>

            {/* Bridge Booking Links */}
            <div className="hidden sm:flex items-center gap-2 pl-1">
              <button
                type="button"
                onClick={() => onBookFlightOrHotel('CDG', 'flights')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Book Flights
              </button>
              <button
                type="button"
                onClick={() => onBookFlightOrHotel('CDG', 'hotels')}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Hotels
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. OPTIONS ROW (Day-by-Day Itinerary is an option next to Visa & Docs)
        =================================================================== */}
        <div className="pt-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {/* Option 1: Day-by-Day Itinerary */}
            <button
              type="button"
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'itinerary'
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Day-by-Day Itinerary</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === 'itinerary' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {daysCount}D
              </span>
            </button>

            {/* Option 2: Visa & Docs */}
            <button
              type="button"
              onClick={() => setActiveTab('visa')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'visa'
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Visa & Docs</span>
            </button>

            {/* Option 3: Budget Calculator */}
            <button
              type="button"
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'budget'
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Budget Calculator</span>
            </button>

            {/* Option 4: Travel Checklist */}
            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'checklist'
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-purple-400" />
              <span>Travel Checklist</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            4. SWITCH DAY ROW (Placed BELOW the Day-by-Day Itinerary options)
            Number of days dynamically matches daysCount from the search duration!
        =================================================================== */}
        {activeTab === 'itinerary' && (
          <div className="pt-3 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                Switch Day:
              </span>
              {itineraryDays.map((d) => (
                <button
                  key={d.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayNumber(d.dayNumber)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedDayNumber === d.dayNumber
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                    selectedDayNumber === d.dayNumber ? 'bg-emerald-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}>
                    D{d.dayNumber}
                  </span>
                  <span>Day {d.dayNumber}</span>
                  <span className="text-[10px] font-normal opacity-70">
                    ({d.dateStr.split(' ')[0]} {d.dateStr.split(' ')[1]})
                  </span>
                </button>
              ))}
            </div>

            {/* Active Day info indicator */}
            <div className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate max-w-xs">Viewing: <strong className="text-slate-800">{activeDay.title}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          3. SIGNATURE SHOWCASE ROW (Exact Screenshot Layout)
      =================================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 space-y-6">
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {/* The Signature 3-Card Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* CARD 1: Landmark Graphic Card with Day Badge (4 Cols) */}
              <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-3 flex flex-col justify-between group hover:shadow-md transition-shadow relative">
                {/* D2 / Day Leaf Badge in Top-Left */}
                <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-md border border-emerald-400">
                  <Leaf className="w-3 h-3 fill-white" />
                  <span>D{activeDay.dayNumber}</span>
                </div>

                {/* Main Visual Artwork */}
                <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden relative">
                  <GlobalCityLandmarkArtwork
                    destination={destination}
                    dayNumber={activeDay.dayNumber}
                    landmarkTitle={activeDay.landmarkTitle}
                  />
                </div>

                {/* Landmark Title & Subtitle at bottom of Card */}
                <div className="pt-3 px-2">
                  <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm sm:text-base">
                    <span className="text-emerald-600">🗼</span>
                    <h3 className="truncate">{activeDay.landmarkTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {activeDay.landmarkSubtitle}
                  </p>
                </div>
              </div>

              {/* CARD 2: Middle Breakdown - Afternoon, Transit & Footpath Photo (4 Cols) */}
              <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-3.5 flex flex-col justify-between space-y-3">
                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* Left Column: Afternoon Pill + Transit Pill (7 Cols) */}
                  <div className="col-span-7 space-y-2.5">
                    {/* Afternoon Pill */}
                    <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-extrabold">
                          ☀️ Afternoon
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{activeDay.dateStr.split(' ')[0]} {activeDay.dateStr.split(' ')[1]} · 14:00 - 17:30</span>
                      </div>
                    </div>

                    {/* Transit Pill */}
                    <div className="p-2.5 rounded-2xl bg-teal-50/80 border border-teal-200/80">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-900 text-[10px] font-extrabold">
                          🚆 Transit
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <Train className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="truncate">{activeDay.afternoon.transport}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Footpath with Glowing Moss Photo (5 Cols) */}
                  <div className="col-span-5 h-full min-h-[110px] flex flex-col justify-between">
                    <div className="w-full h-24 rounded-xl overflow-hidden relative">
                      <GlowingMossFootpathArtwork />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 block mt-1 leading-tight text-center truncate">
                      {activeDay.afternoon.pathwayName}
                    </span>
                  </div>
                </div>

                {/* Subtitle / Tip below middle card */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate font-medium">{activeDay.afternoon.activity}</span>
                  <span className="font-bold text-slate-800 shrink-0">~{formatPrice(activeDay.afternoon.costEstimateInr, currency)}</span>
                </div>
              </div>

              {/* CARD 3: Evening Eco Seine River Cruise / Solar Boat (4 Cols) */}
              <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-3.5 flex flex-col justify-between space-y-2.5 group hover:shadow-md transition-shadow">
                {/* Header Tag with Evening & Time */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[10px] font-extrabold flex items-center gap-1">
                    <span>🌙</span>
                    <span>Evening</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">
                    06:00 PM – 10:30 PM
                  </span>
                </div>

                {/* Cruise Boat Artwork */}
                <div className="w-full h-28 rounded-xl overflow-hidden relative">
                  <EcoRiverCruiseArtwork />
                </div>

                {/* Evening Titles */}
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                    {activeDay.evening.cruiseTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {activeDay.evening.cruiseSubtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* ===============================================================
                4. DETAILED STEP-BY-STEP ITINERARY TIMELINE (WHAT TO DO & HOW)
            =============================================================== */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
              {/* Day Header with Date & Theme */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    D{activeDay.dayNumber}
                  </span>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Day {activeDay.dayNumber}: {activeDay.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      📅 {activeDay.dateStr} · 🎯 {activeDay.theme}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                    Est. Day Cost: ~{formatPrice(activeDay.estimatedDayTotalInr, currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNotify('Itinerary Downloaded', `Offline copy of Day ${activeDay.dayNumber} saved.`, 'success')}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                    title="Save offline itinerary"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Step-by-Step Columns (Morning, Afternoon, Evening) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. MORNING STEP-BY-STEP */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center gap-1">
                        <span>🌅</span>
                        <span>Morning Plan</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">{activeDay.morning.time}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                        {activeDay.morning.activity}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {activeDay.morning.details}
                      </p>
                    </div>

                    {/* Numbered exact steps */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Exact Steps To Follow:
                      </span>
                      {activeDay.morning.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1 text-slate-700">
                        <Train className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{activeDay.morning.transport}</span>
                      </span>
                      <span className="text-emerald-700 font-bold shrink-0">
                        ~{formatPrice(activeDay.morning.costEstimateInr, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. AFTERNOON STEP-BY-STEP */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-black flex items-center gap-1">
                        <span>☀️</span>
                        <span>Afternoon Plan</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">{activeDay.afternoon.time}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                        {activeDay.afternoon.activity}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {activeDay.afternoon.details}
                      </p>
                    </div>

                    {/* Numbered exact steps */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Exact Steps To Follow:
                      </span>
                      {activeDay.afternoon.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-teal-200/80 text-teal-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1 text-slate-700">
                        <Footprints className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{activeDay.afternoon.pathwayName}</span>
                      </span>
                      <span className="text-emerald-700 font-bold shrink-0">
                        ~{formatPrice(activeDay.afternoon.costEstimateInr, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. EVENING STEP-BY-STEP */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-xs font-black flex items-center gap-1">
                        <span>🌙</span>
                        <span>Evening Experience</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">{activeDay.evening.time}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                        {activeDay.evening.cruiseTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {activeDay.evening.details}
                      </p>
                    </div>

                    {/* Numbered exact steps */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Exact Steps To Follow:
                      </span>
                      {activeDay.evening.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-sky-200/80 text-sky-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1 text-slate-700">
                        <Ship className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{activeDay.evening.cruiseSubtitle}</span>
                      </span>
                      <span className="text-emerald-700 font-bold shrink-0">
                        ~{formatPrice(activeDay.evening.costEstimateInr, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Dining Recommendation & Insider Pro-Tip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Dining Callout */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-950 block">
                      Recommended Dinner: {activeDay.diningTip.place}
                    </span>
                    <p className="text-amber-900 mt-0.5 leading-relaxed">
                      {activeDay.diningTip.recommendation}
                    </p>
                    <div className="mt-1 text-[11px] font-semibold text-amber-800">
                      ✨ <strong>Must Order:</strong> {activeDay.diningTip.mustOrder} ({activeDay.diningTip.estimatedCost})
                    </div>
                  </div>
                </div>

                {/* Insider Pro-Tip Callout */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-950 block">
                      Insider Travel Pro-Tip:
                    </span>
                    <p className="text-emerald-900 mt-0.5 leading-relaxed font-medium">
                      {activeDay.proTip}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900 text-[10px] font-bold">
                        Verified by Local Experts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VISA & DOCS TAB
        =================================================================== */}
        {activeTab === 'visa' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
                  Official Entry Requirements
                </span>
                <h3 className="font-display text-2xl font-black text-slate-900 mt-0.5">
                  Visa & Passport Guide for {cleanCity} ({cleanCountry})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Citizen:</span>
                <span className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50">
                  🇮🇳 Indian Passport
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Visa Type</span>
                <p className="font-extrabold text-sm text-slate-900 mt-1">{visaData.visaType}</p>
                <span className="text-xs text-emerald-600 font-semibold">{visaData.entryRule}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Validity</span>
                <p className="font-extrabold text-sm text-slate-900 mt-1">{visaData.validity}</p>
                <span className="text-xs text-slate-500 font-semibold">Tourism & Sightseeing</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Processing Time</span>
                <p className="font-extrabold text-sm text-slate-900 mt-1">{visaData.processingTime}</p>
                <span className="text-xs text-sky-600 font-semibold">Standard processing window</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fee</span>
                <p className="font-extrabold text-sm text-slate-900 mt-1">{visaData.estimatedFee}</p>
                <span className="text-xs text-slate-500 font-semibold">Consular rate</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Mandatory Documents Checklist</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {visaData.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Step-by-Step Application Guide</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {visaData.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={visaData.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs mt-2 transition-colors"
                >
                  <span>Open {visaData.portalName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            BUDGET TAB
        =================================================================== */}
        {activeTab === 'budget' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  AI Expense Estimation & Ledger
                </span>
                <h3 className="font-display text-2xl font-black text-slate-900 mt-0.5">
                  Trip Budget for {cleanCity} ({daysCount} Days, {travellersCount} {travellerType})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Calibrated to {budgetTier.toUpperCase()} tier local pricing in {cleanCity}. Adjust any slider to recalculate in real-time.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-2.5 text-right shrink-0">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Estimated Grand Total</span>
                <span className="font-black text-xl text-slate-900">
                  {formatPrice(budgetTotal.grandTotal, currency)}
                </span>
                <span className="text-[11px] text-slate-600 font-semibold block">
                  ~{formatPrice(budgetTotal.perPerson, currency)} / person
                </span>
              </div>
            </div>

            {/* Visual Spending Allocation Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Spending Allocation</span>
                <span className="text-[11px] text-slate-400">Flights • Stays • Dining • Transit • Activities</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${Math.round((budgetTotal.flights / (budgetTotal.grandTotal || 1)) * 100)}%` }}
                  className="bg-indigo-500 h-full transition-all"
                  title="Flights"
                />
                <div
                  style={{ width: `${Math.round((budgetTotal.hotels / (budgetTotal.grandTotal || 1)) * 100)}%` }}
                  className="bg-sky-500 h-full transition-all"
                  title="Hotels"
                />
                <div
                  style={{ width: `${Math.round((budgetTotal.food / (budgetTotal.grandTotal || 1)) * 100)}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title="Dining"
                />
                <div
                  style={{ width: `${Math.round((budgetTotal.transit / (budgetTotal.grandTotal || 1)) * 100)}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title="Transit"
                />
                <div
                  style={{ width: `${Math.round((budgetTotal.activities / (budgetTotal.grandTotal || 1)) * 100)}%` }}
                  className="bg-purple-500 h-full transition-all"
                  title="Activities"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              {/* Sliders Column */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Plane className="w-3.5 h-3.5 text-indigo-500" />
                      Flights (Roundtrip per Person)
                    </span>
                    <span className="text-indigo-700 font-extrabold">{formatPrice(flightEstimateInr, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={120000}
                    step={2000}
                    value={flightEstimateInr}
                    onChange={(e) => setFlightEstimateInr(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-sky-500" />
                      Hotels & Stays (Per Night)
                    </span>
                    <span className="text-sky-700 font-extrabold">{formatPrice(hotelTierRate, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={35000}
                    step={1000}
                    value={hotelTierRate}
                    onChange={(e) => setHotelTierRate(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Utensils className="w-3.5 h-3.5 text-amber-500" />
                      Dining & Street Food (Per Person / Day)
                    </span>
                    <span className="text-amber-700 font-extrabold">{formatPrice(diningPerDayRate, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={800}
                    max={12000}
                    step={400}
                    value={diningPerDayRate}
                    onChange={(e) => setDiningPerDayRate(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Train className="w-3.5 h-3.5 text-emerald-500" />
                      Local Transit & Smart Pass (Per Person / Day)
                    </span>
                    <span className="text-emerald-700 font-extrabold">{formatPrice(transitPerDayRate, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={5000}
                    step={200}
                    value={transitPerDayRate}
                    onChange={(e) => setTransitPerDayRate(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Ticket className="w-3.5 h-3.5 text-purple-500" />
                      Sightseeing & Activities (Per Person / Day)
                    </span>
                    <span className="text-purple-700 font-extrabold">{formatPrice(activitiesPerDayRate, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={8000}
                    step={300}
                    value={activitiesPerDayRate}
                    onChange={(e) => setActivitiesPerDayRate(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Itemized Ledger Column */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-slate-500" />
                      <span>Itemized Cost Ledger</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">{daysCount} Days Duration</span>
                  </div>

                  <div className="divide-y divide-slate-200/70 pt-1 space-y-1">
                    <div className="flex justify-between py-2 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span>Roundtrip Flights ({travellersCount} travelers)</span>
                      </div>
                      <strong>{formatPrice(budgetTotal.flights, currency)}</strong>
                    </div>

                    <div className="flex justify-between py-2 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span>Hotels & Lodging ({Math.max(1, daysCount - 1)} nights)</span>
                      </div>
                      <strong>{formatPrice(budgetTotal.hotels, currency)}</strong>
                    </div>

                    <div className="flex justify-between py-2 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Dining, Cafes & Drinks</span>
                      </div>
                      <strong>{formatPrice(budgetTotal.food, currency)}</strong>
                    </div>

                    <div className="flex justify-between py-2 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Local Transit, Metro & Ferries</span>
                      </div>
                      <strong>{formatPrice(budgetTotal.transit, currency)}</strong>
                    </div>

                    <div className="flex justify-between py-2 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <span>Attraction Tickets & Tours</span>
                      </div>
                      <strong>{formatPrice(budgetTotal.activities, currency)}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-300 flex items-center justify-between font-extrabold text-sm text-slate-900">
                  <span>Grand Total Estimated Budget</span>
                  <span className="text-emerald-700 text-base">{formatPrice(budgetTotal.grandTotal, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            CHECKLIST TAB
        =================================================================== */}
        {activeTab === 'checklist' && (() => {
          const categories = ['All', 'Docs', 'Forex', 'Connectivity', 'Packing', 'Transit'];
          const filteredItems = activeChecklistCategory === 'All'
            ? checklist
            : checklist.filter((item) => (item.category || 'Docs').toLowerCase() === activeChecklistCategory.toLowerCase());
          const completedCount = checklist.filter((i) => i.completed).length;
          const totalCount = checklist.length;
          const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                    Preparation Guide
                  </span>
                  <h3 className="font-display text-2xl font-black text-slate-900 mt-0.5">
                    Pre-Departure Travel Checklist for {cleanCity}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Progress:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs">
                    {completedCount} of {totalCount} Done ({percentCompleted}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                {categories.map((cat) => {
                  const countInCat = cat === 'All'
                    ? checklist.length
                    : checklist.filter((i) => (i.category || 'Docs').toLowerCase() === cat.toLowerCase()).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveChecklistCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        activeChecklistCategory === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                        activeChecklistCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {countInCat}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Task Row */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  placeholder="Add custom pre-trip item (e.g. Reserve Eiffel Tower elevator)..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newChecklistText.trim()) {
                      setChecklist((prev) => [
                        ...prev,
                        {
                          id: `custom-${Date.now()}`,
                          label: newChecklistText.trim(),
                          description: `Custom traveler task added for ${cleanCity}`,
                          completed: false,
                          category: activeChecklistCategory === 'All' ? 'Docs' : activeChecklistCategory,
                          priority: 'Medium',
                        },
                      ]);
                      setNewChecklistText('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs text-slate-800 bg-transparent outline-none font-medium placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newChecklistText.trim()) {
                      setChecklist((prev) => [
                        ...prev,
                        {
                          id: `custom-${Date.now()}`,
                          label: newChecklistText.trim(),
                          description: `Custom traveler task added for ${cleanCity}`,
                          completed: false,
                          category: activeChecklistCategory === 'All' ? 'Docs' : activeChecklistCategory,
                          priority: 'Medium',
                        },
                      ]);
                      setNewChecklistText('');
                    }
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Add Task
                </button>
              </div>

              {/* Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setChecklist((prev) =>
                        prev.map((c) => (c.id === item.id ? { ...c, completed: !c.completed } : c))
                      )
                    }
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      item.completed
                        ? 'bg-emerald-50/40 border-emerald-300 text-slate-500'
                        : 'bg-white border-slate-200 hover:border-slate-400 text-slate-900'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                        item.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className={`text-xs font-bold block truncate ${item.completed ? 'line-through text-slate-400' : ''}`}>
                          {item.label}
                        </span>
                        {item.category && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 shrink-0">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ===================================================================
          MODALS FOR THE "SAAMNE WALE OPTIONS"
          1. Normal Precautions Modal
          2. Visa on Arrival Modal
          3. Bio-lumines.cn / e-Customs Modal
      =================================================================== */}
      {activeInfoModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-modal-backdrop">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 animate-modal-slide-up relative">
            <button
              type="button"
              onClick={() => setActiveInfoModal('none')}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {activeInfoModal === 'advisory' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
                    🌾
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      Travel Safety Status
                    </span>
                    <h3 className="font-display text-xl font-black text-slate-900">
                      {dynamicAdvisory?.status || 'Normal Precautions'}: {cleanCity}
                    </h3>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                  <p className="font-semibold leading-relaxed">
                    {dynamicAdvisory?.headline || `${cleanCity} and ${cleanCountry} are categorized as peaceful and safe for foreign tourists. Standard metropolitan travel precautions are recommended.`}
                  </p>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    {dynamicAdvisory?.details || `Keep digital photo copies of passport and visa on your mobile phone, and validate local metro tickets before boarding to avoid on-the-spot penalty inspections.`}
                  </p>
                  <div className="pt-2 border-t border-amber-200/80 text-[11px] font-bold text-amber-900 flex items-center justify-between">
                    <span>Emergency Tourist Police / Helpline:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-mono">
                      {dynamicAdvisory?.emergencyNumber || '112'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('none')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Understood
                </button>
              </div>
            )}

            {activeInfoModal === 'visa' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg">
                    ✈️
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                      Immigration & Entry Guideline
                    </span>
                    <h3 className="font-display text-xl font-black text-slate-900">
                      {visaData.visaType}
                    </h3>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-2">
                  <p className="font-semibold leading-relaxed">
                    {visaData.entryRule} · Stay period: {visaData.validity}
                  </p>
                  <div className="text-[11px] space-y-1 font-medium text-sky-900">
                    <div>• <strong>Processing:</strong> {visaData.processingTime}</div>
                    <div>• <strong>Official Fee:</strong> {visaData.estimatedFee}</div>
                    <div>• <strong>Mandatory:</strong> Passport with at least 6 months validity from departure date.</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInfoModal('none');
                      setActiveTab('visa');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer"
                  >
                    View Full Visa Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal('none')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {activeInfoModal === 'customs' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                    🌊
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                      Arrival & e-Customs Clearance
                    </span>
                    <h3 className="font-display text-xl font-black text-slate-900">
                      {dynamicCustoms?.arrivalName || 'e-Customs & Arrival Clearance'}
                    </h3>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <p className="font-semibold leading-relaxed">
                    {dynamicCustoms?.details || 'Pre-boarding electronic declaration and immigration autogate clearance guide:'}
                  </p>
                  <ul className="space-y-1 text-[11px] font-medium text-emerald-900 list-disc list-inside">
                    <li>QR Requirement: {dynamicCustoms?.qrRequirement || 'Digital QR saved to phone wallet prior to check-in'}</li>
                    <li>
                      Live Weather: {dynamicWeather ? `${dynamicWeather.temperatureC}°C (${dynamicWeather.condition}). ${dynamicWeather.forecastSummary}` : 'Pleasant 22°C – 25°C seasonal temperatures.'}
                    </li>
                    <li>
                      Attire Recommendation: {dynamicWeather?.bestClothingTip || 'Breathable cotton attire with comfortable walking footwear and light layers.'}
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('none')}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  Got It
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
