import React, { useState, useEffect } from 'react';
import {
  Plane,
  TrainFront,
  Building2,
  Bus,
  Car,
  Palmtree,
  RollerCoaster,
  ArrowLeftRight,
  Calendar,
  Search,
  ChevronDown,
  ShieldCheck,
  Clock,
  Briefcase,
  Sparkles,
  BadgePercent,
  CheckCircle2,
  MapPin,
  Users,
  Compass,
  Gift,
  Globe,
  Camera,
  X,
  UtensilsCrossed,
} from 'lucide-react';
import {
  ASSETS,
  BookingCategory,
  CITIES,
  CityOption,
  TripType,
} from '../data/travelData';
import { SafeImage } from './SafeImage';
import { NormalCalendarDropdown } from './NormalCalendarDropdown';

interface HeroSearchSectionProps {
  activeCategory: BookingCategory;
  onSelectCategory: (cat: BookingCategory) => void;
  fromCity: CityOption;
  toCity: CityOption;
  onChangeFromCity: (city: CityOption) => void;
  onChangeToCity: (city: CityOption) => void;
  onSwapCities: () => void;
  tripType: TripType;
  onChangeTripType: (t: TripType) => void;
  dummyTripType?: 'one-way' | 'round-trip';
  onChangeDummyTripType?: (t: 'one-way' | 'round-trip') => void;
  departureDate: string;
  returnDate: string;
  onChangeDepartureDate: (d: string) => void;
  onChangeReturnDate: (d: string) => void;
  studentFare?: boolean;
  onToggleStudentFare?: () => void;
  travellers: number;
  cabinClass: string;
  onChangeTravellers: (count: number, cabin: string) => void;
  onTriggerSearch: () => void;
  onSelectTrustPillar: (pillarTitle: string, pillarDetail: string) => void;
  onOpenTripAI?: () => void;
  onOpenExplorePage?: () => void;
  onOpenInfluencersPage?: () => void;
  onOpenDiningClubPage?: () => void;
  onOpenHostelsPage?: () => void;
  hotelMode?: 'overnight' | 'hourly' | 'villas' | 'hostels';
  onChangeHotelMode?: (mode: 'overnight' | 'hourly' | 'villas' | 'hostels') => void;
}

const SERVICE_TABS: {
  id: BookingCategory;
  label: string;
  ctaLabel: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'flights', label: 'Flights', ctaLabel: 'Search Flights', icon: Plane },
  { id: 'trains', label: 'Trains', ctaLabel: 'Search Trains', icon: TrainFront },
  { id: 'hotels', label: 'Hotels', ctaLabel: 'Search Hotels', icon: Building2 },
  { id: 'buses', label: 'Buses', ctaLabel: 'Search Buses', icon: Bus },
  { id: 'cabs', label: 'Cabs', ctaLabel: 'Search Cabs', icon: Car },
  { id: 'holidays', label: 'Holidays', ctaLabel: 'Search Holidays', icon: Palmtree },
  { id: 'experiences', label: 'Attractions', ctaLabel: 'Explore Attractions', icon: RollerCoaster },
];

const FLIGHT_CLASSES = ['Economy', 'Premium Eco', 'Business', 'First Class'];
const TRAIN_CLASSES = [
  'All Classes',
  '1A - First AC',
  '2A - AC 2 Tier',
  '3A - AC 3 Tier',
  'CC - AC Chair Car',
  'SL - Sleeper',
];
const TRAIN_QUOTAS = ['General Quota', 'Tatkal', 'Ladies Quota', 'Sr. Citizen'];
const BUS_TYPES = ['All Buses', 'AC Sleeper', 'AC Seater', 'Volvo Multi-Axle'];
const CAB_TIMES = ['06:00 AM', '09:00 AM', '11:30 AM', '02:00 PM', '05:00 PM', '08:30 PM'];
const CAB_PACKAGES = ['4 Hrs / 40 km', '8 Hrs / 80 km', '12 Hrs / 120 km'];

export interface DiscoveryOption {
  id: 'explore' | 'business-travel' | 'dining-club' | 'influencers';
  icon: React.FC<{ className?: string }>;
  title: string;
  subtitle: string;
  badge?: string;
  detail: string;
}

const DISCOVERY_OPTIONS: DiscoveryOption[] = [
  {
    id: 'explore',
    icon: Compass,
    title: 'Explore',
    subtitle: 'Curated Destinations',
    badge: 'Popular',
    detail: 'Discover handpicked international & domestic getaways, scenic hidden gems, and trending travel itineraries across the globe.',
  },
  {
    id: 'business-travel',
    icon: Briefcase,
    title: 'Business Travel',
    subtitle: 'Corporate Fares & GST',
    badge: 'Corporate',
    detail: 'Automated GST tax invoices, corporate discounted airfares, zero cancellation fees, and dedicated company expense management.',
  },
  {
    id: 'dining-club',
    icon: UtensilsCrossed,
    title: 'Dining Club',
    subtitle: 'VIP Tables & Parties',
    badge: 'Luxury VIP',
    detail: 'Reserve Michelin-inspired tables, pre-order gourmet food, book private group party banquets, secure VIP club passes & join social dining tables.',
  },
  {
    id: 'influencers',
    icon: Camera,
    title: 'Influencers',
    subtitle: 'Creator Club & Perks',
    badge: 'Creators',
    detail: 'TripYeah Creator Club for Instagram & YouTube creators: Sponsored luxury resort stays, flight credits, affiliate commissions & PR media kits.',
  },
];

export const HeroSearchSection: React.FC<HeroSearchSectionProps> = ({
  activeCategory,
  onSelectCategory,
  fromCity,
  toCity,
  onChangeFromCity,
  onChangeToCity,
  onSwapCities,
  tripType,
  onChangeTripType,
  dummyTripType = 'one-way',
  onChangeDummyTripType,
  departureDate,
  returnDate,
  onChangeDepartureDate,
  onChangeReturnDate,
  studentFare,
  onToggleStudentFare,
  travellers,
  cabinClass,
  onChangeTravellers,
  onTriggerSearch,
  onSelectTrustPillar,
  onOpenTripAI,
  onOpenExplorePage,
  onOpenInfluencersPage,
  onOpenDiningClubPage,
  onOpenHostelsPage,
  hotelMode: propHotelMode,
  onChangeHotelMode,
}) => {
  const [internalDummyTripType, setInternalDummyTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const activeDummyTripType = dummyTripType || internalDummyTripType;
  const isRoundTripActive =
    tripType === 'round-trip' ||
    (tripType === 'dummy-flights' && activeDummyTripType === 'round-trip');

  const handleSelectDummyTripType = (type: 'one-way' | 'round-trip') => {
    setInternalDummyTripType(type);
    if (onChangeDummyTripType) {
      onChangeDummyTripType(type);
    }
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [swapRotated, setSwapRotated] = useState(false);

  // Close any open popover dropdown when clicking outside
  useEffect(() => {
    if (!openDropdown) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.dropdown-field-container') ||
        target.closest('[data-dropdown-container]')
      ) {
        return;
      }
      setOpenDropdown(null);
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [openDropdown]);

  // Business Travel & Gift Cards interactive states
  const [showBusinessModal, setShowBusinessModal] = useState<boolean>(false);
  const [showGiftCardsModal, setShowGiftCardsModal] = useState<boolean>(false);
  const [giftAmount, setGiftAmount] = useState<number>(2500);
  const [giftRecipient, setGiftRecipient] = useState<string>('');
  const [giftEmail, setGiftEmail] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>(
    'Wishing you wonderful journeys and unforgettable memories with TripYeah!'
  );
  const [giftSentSuccess, setGiftSentSuccess] = useState<boolean>(false);
  const [bizCompany, setBizCompany] = useState<string>('');
  const [bizGst, setBizGst] = useState<string>('');
  const [bizEmail, setBizEmail] = useState<string>('');
  const [bizSuccess, setBizSuccess] = useState<boolean>(false);

  // Category-specific realistic online booking states
  // 1. Trains state
  const [trainMode, setTrainMode] = useState<'book' | 'pnr' | 'status'>('book');
  const [trainClass, setTrainClass] = useState<string>('All Classes');
  const [trainQuota, setTrainQuota] = useState<string>('General Quota');
  const [pnrInput, setPnrInput] = useState<string>('2458916304');
  const [pnrResult, setPnrResult] = useState<string | null>(null);
  const [liveTrainNo, setLiveTrainNo] = useState<string>('22436 - Vande Bharat Exp');
  const [liveTrainStatusMsg, setLiveTrainStatusMsg] = useState<string | null>(null);

  // 2. Hotels state
  const [internalHotelMode, setInternalHotelMode] = useState<'overnight' | 'hourly' | 'villas' | 'hostels'>('overnight');
  const hotelMode = propHotelMode !== undefined ? propHotelMode : internalHotelMode;
  const setHotelMode = (mode: 'overnight' | 'hourly' | 'villas' | 'hostels') => {
    setInternalHotelMode(mode);
    onChangeHotelMode?.(mode);
  };
  const [hotelRooms, setHotelRooms] = useState<number>(1);
  const [hotelGuests, setHotelGuests] = useState<number>(2);
  const [hotelPriceFilter, setHotelPriceFilter] = useState<string>('₹0 - ₹15,000+');
  const [hourlySlot, setHourlySlot] = useState<string>('3 Hours Stay');
  const [freeBreakfast, setFreeBreakfast] = useState<boolean>(true);

  // 3. Buses state
  const [busFilter, setBusFilter] = useState<string>('All Buses');
  const [singleLadySeat, setSingleLadySeat] = useState<boolean>(false);

  // 4. Cabs state
  const [cabMode, setCabMode] = useState<'one-way' | 'round-trip' | 'airport' | 'hourly'>('one-way');
  const [cabCarType, setCabCarType] = useState<string>('SUV / Sedan');
  const [cabPickupTime, setCabPickupTime] = useState<string>('10:00 AM');
  const [cabHourlyPkg, setCabHourlyPkg] = useState<string>('8 Hrs / 80 km');

  // 5. Holidays state
  const [holidayTheme, setHolidayTheme] = useState<string>('All Packages');
  const [holidayDuration, setHolidayDuration] = useState<string>('4N / 5D');
  const [withFlights, setWithFlights] = useState<boolean>(true);

  // 6. Tours & Experiences state
  const [experienceTheme, setExperienceTheme] = useState<string>('All Experiences');

  const handleSwap = () => {
    setSwapRotated((prev) => !prev);
    onSwapCities();
  };

  const formatDisplayDate = (dateStr: string, fallback = 'Select Date') => {
    if (!dateStr) return fallback;
    const parsed = new Date(dateStr + 'T00:00:00');
    if (isNaN(parsed.getTime())) return fallback;
    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Reusable City/Station Picker Popover
  const renderCityDropdown = (
    which: 'from' | 'to',
    selected: CityOption,
    onSelect: (c: CityOption) => void,
    isStation = false
  ) => {
    if (openDropdown !== which) return null;
    return (
      <div
        data-dropdown-container="true"
        onClick={(e) => e.stopPropagation()}
        className={`absolute ${
          which === 'to' ? 'right-0' : 'left-0'
        } mt-2 w-72 max-h-64 overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40`}
      >
        {CITIES.map((city) => (
          <button
            key={city.code}
            type="button"
            onClick={() => {
              onSelect(city);
              setOpenDropdown(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
              selected.code === city.code
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                {city.city}, {city.country}
              </div>
              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                {isStation ? `${city.city} Junction (${city.stationCode})` : city.airportName}
              </div>
            </div>
            <span className="font-mono-tabular font-bold text-xs text-slate-600">
              {isStation ? city.stationCode : city.code}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <section id="top" className="relative w-full">
      {/* Hero Visual Container — Multi-Modal Travel Panorama */}
      <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[680px] overflow-hidden">
        <SafeImage
          src={ASSETS.heroMultimodal}
          alt="Panoramic coastal travel scene featuring a passenger jet airplane in the sky, high-speed train on a coastal viaduct, tour buses on a palm highway, resort skyline, mountains, and cruise ship in the bay"
          fallbackTitle="Explore the World with TripYeah"
          className="w-full h-full object-cover object-center"
        />

        {/* Subtle top & center contrast scrim + smooth white bottom fade */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/20 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent"
          aria-hidden="true"
        />

        {/* Centered Hero Headline above the middle Search Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 text-center">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-white uppercase drop-shadow-sm mb-2">
            Explore the World with TripYeah
          </p>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.08] tracking-tight mb-2.5 drop-shadow-[0_4px_18px_rgba(15,23,42,0.45)] mx-auto max-w-3xl">
            Where will you go{' '}
            <span className="text-sky-300">next?</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-white/95 font-medium max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(15,23,42,0.45)]">
            Flights, Trains, Hotels, Buses, Cabs &amp; Holiday Packages — all in one
            place.
          </p>
        </div>
      </div>

      {/* Floating Multi-Modal Search Engine Card — Positioned in the Middle over the Hero */}
      <div className="relative z-20 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 -mt-64 sm:-mt-72 lg:-mt-80">
        <div className="bg-white rounded-[26px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-slate-200/80 p-3.5 sm:p-5 lg:p-6">
          {/* ROW 1: 7 Service Category Tabs in a single horizontal landscape line */}
          <div
            role="tablist"
            aria-label="Booking categories"
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2 pb-3.5 mb-3.5 border-b border-slate-100"
          >
            {SERVICE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => {
                    setOpenDropdown(null);
                    onSelectCategory(tab.id);
                  }}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3.5 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-600/25'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/75 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ===================================================================
              1. FLIGHTS INTERFACE (One Way = Only Departure, Round Trip = Departure + Return, Class in top-right where it originally was)
          =================================================================== */}
          {activeCategory === 'flights' && (
            <>
              {/* Row 2: One Way | Round Trip | Dummy Flights + Traveller & Class */}
              <div className="flex items-center justify-between gap-2 mb-3.5 flex-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
                  {(
                    [
                      { id: 'one-way', label: 'One Way' },
                      { id: 'round-trip', label: 'Round Trip' },
                      { id: 'dummy-flights', label: 'Dummy Flights' },
                    ] as { id: TripType; label: string }[]
                  ).map((t) => {
                    const active = tripType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onChangeTripType(t.id)}
                        className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}

                  {/* Dummy Flights Sub-selector: One Way vs Round Trip */}
                  {tripType === 'dummy-flights' && (
                    <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300/80 rounded-full p-0.5 shadow-2xs ml-0.5 sm:ml-1 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => handleSelectDummyTripType('one-way')}
                        title="One-Way Verifiable PNR for Proof of Travel"
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                          activeDummyTripType === 'one-way'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-amber-800 hover:bg-amber-100/80'
                        }`}
                      >
                        One Way
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectDummyTripType('round-trip')}
                        title="Round-Trip Verifiable PNR with Return Ticket for Visa"
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                          activeDummyTripType === 'round-trip'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-amber-800 hover:bg-amber-100/80'
                        }`}
                      >
                        Round Trip
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Controls: Traveller & Class Dropdown (Original Position) */}
                <div className="flex items-center gap-2.5 sm:gap-4 relative shrink-0">
                  {/* Traveller & Flight Class Popover in original top-right position */}
                  <div className="relative dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          openDropdown === 'travellers' ? null : 'travellers'
                        );
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        openDropdown === 'travellers'
                          ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-800'
                      } text-[11px] sm:text-xs font-semibold`}
                    >
                      <span>
                        {travellers} {travellers === 1 ? 'Traveller' : 'Travellers'} · {cabinClass}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {openDropdown === 'travellers' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 max-h-80 overflow-y-auto custom-scrollbar select-none"
                      >
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              Travellers
                            </span>
                            <span className="text-[10px] text-slate-400">Adults (12+ yrs)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onChangeTravellers(
                                  Math.max(1, travellers - 1),
                                  cabinClass
                                )
                              }
                              disabled={travellers <= 1}
                              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-sm font-bold font-mono-tabular text-slate-900">
                              {travellers}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onChangeTravellers(
                                  Math.min(9, travellers + 1),
                                  cabinClass
                                )
                              }
                              disabled={travellers >= 9}
                              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-700 mb-2">
                            Flight Class
                          </p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {FLIGHT_CLASSES.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  onChangeTravellers(travellers, c);
                                  setOpenDropdown(null);
                                }}
                                className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                                  cabinClass === c
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Landscape Flight Search Row (Return only shown in Round Trip!) */}
              <div className="flex items-stretch gap-2 w-full">
                {/* From ⇄ To */}
                <div className="flex-[2.2] min-w-0 grid grid-cols-2 gap-2 relative">
                  <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'from' ? null : 'from');
                      }}
                      className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 transition-colors cursor-pointer"
                    >
                      <span className="block text-[11px] text-slate-500 font-medium">
                        From
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                        {fromCity.city}
                      </span>
                      <span className="block text-[11px] font-mono-tabular text-slate-500 truncate">
                        {fromCity.code}
                      </span>
                    </button>
                    {renderCityDropdown('from', fromCity, onChangeFromCity)}
                  </div>

                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="Swap departure and arrival cities"
                    className={`flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-transform duration-200 cursor-pointer ${
                      swapRotated ? 'rotate-180' : ''
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'to' ? null : 'to');
                      }}
                      className="w-full h-full text-left pl-4 pr-3 sm:pl-5 sm:pr-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 transition-colors cursor-pointer"
                    >
                      <span className="block text-[11px] text-slate-500 font-medium">
                        To
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                        {toCity.city}
                      </span>
                      <span className="block text-[11px] font-mono-tabular text-slate-500 truncate">
                        {toCity.code}
                      </span>
                    </button>
                    {renderCityDropdown('to', toCity, onChangeToCity)}
                  </div>
                </div>

                {/* Departure Date (Always shown) — Opens Normal Inline Calendar */}
                <div className="flex-1 min-w-0 relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'departure-date' ? null : 'departure-date');
                    }}
                    className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                      openDropdown === 'departure-date'
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                    }`}
                    title="Click to select departure date"
                    aria-label="Select departure date"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                        Departure Date
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formatDisplayDate(departureDate)}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        One-Way / Outbound
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1.5 transition-colors shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Normal White & Blue Calendar Dropdown — Opens right here under the departure box */}
                  {openDropdown === 'departure-date' && (
                    <NormalCalendarDropdown
                      selectedDate={departureDate}
                      minDate="2026-10-17"
                      onSelectDate={(newDate) => {
                        onChangeDepartureDate(newDate);
                        if (isRoundTripActive && returnDate <= newDate) {
                          const nextD = new Date(newDate);
                          nextD.setDate(nextD.getDate() + 3);
                          const ym = nextD.toISOString().slice(0, 10);
                          onChangeReturnDate(ym);
                        }
                      }}
                      onClose={() => setOpenDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* Return Date — shown when Round Trip is selected OR Dummy Flights with Round Trip is selected */}
                {isRoundTripActive && (
                  <div className="flex-1 min-w-0 relative dropdown-field-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'return-date' ? null : 'return-date');
                      }}
                      className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                        openDropdown === 'return-date'
                          ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                          : tripType === 'dummy-flights'
                          ? 'bg-amber-50/70 hover:bg-amber-50 hover:border-amber-400 border-amber-200'
                          : 'bg-indigo-50/60 hover:bg-indigo-50 hover:border-indigo-400 border-indigo-200'
                      }`}
                      title="Click to select return date"
                      aria-label="Select return date"
                    >
                      <div className="min-w-0">
                        <span className={`block text-[11px] font-semibold transition-colors ${
                          tripType === 'dummy-flights'
                            ? 'text-amber-700 group-hover:text-amber-800'
                            : 'text-indigo-600 group-hover:text-indigo-700'
                        }`}>
                          Return Date
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {formatDisplayDate(returnDate, 'Select Return')}
                        </span>
                        <span className={`block text-[11px] truncate ${
                          tripType === 'dummy-flights' ? 'text-amber-600 font-medium' : 'text-indigo-500'
                        }`}>
                          Round-Trip Save 10%
                        </span>
                      </div>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-1.5 transition-colors shadow-2xs ${
                        tripType === 'dummy-flights'
                          ? 'bg-amber-100/80 group-hover:bg-amber-600 text-amber-700 group-hover:text-white'
                          : 'bg-indigo-100/80 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white'
                      }`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Normal White & Blue Calendar Dropdown — Opens right here under the return box */}
                    {openDropdown === 'return-date' && (
                      <NormalCalendarDropdown
                        selectedDate={returnDate}
                        minDate={departureDate}
                        onSelectDate={(newDate) => {
                          onChangeReturnDate(newDate);
                        }}
                        onClose={() => setOpenDropdown(null)}
                        alignRight={true}
                      />
                    )}
                  </div>
                )}

                {/* Search Button */}
                <div className="shrink-0 flex items-stretch">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      onTriggerSearch();
                    }}
                    className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#6D28D9] hover:brightness-105 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

            </>
          )}

          {/* ===================================================================
              2. TRAINS INTERFACE (IRCTC Style: Book Train Tickets | Check PNR Status | Live Train Status)
          =================================================================== */}
          {activeCategory === 'trains' && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3.5 flex-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {[
                    { id: 'book', label: 'Book Train Tickets' },
                    { id: 'pnr', label: 'Check PNR Status' },
                    { id: 'status', label: 'Live Train Status' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setTrainMode(m.id as 'book' | 'pnr' | 'status');
                        setPnrResult(null);
                        setLiveTrainStatusMsg(null);
                      }}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        trainMode === m.id
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Right: IRCTC Quota Selector */}
                <div className="flex items-center gap-2 relative shrink-0">
                  <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">
                    IRCTC Authorised Partner ·
                  </span>
                  <div className="relative dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          openDropdown === 'train-quota' ? null : 'train-quota'
                        );
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[11px] sm:text-xs font-semibold whitespace-nowrap cursor-pointer ${
                        openDropdown === 'train-quota'
                          ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span>{trainQuota}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    {openDropdown === 'train-quota' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 max-h-60 overflow-y-auto custom-scrollbar"
                      >
                        {TRAIN_QUOTAS.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => {
                              setTrainQuota(q);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                              trainQuota === q
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {trainMode === 'book' && (
                <div className="flex items-stretch gap-2 w-full">
                  {/* From Station ⇄ To Station */}
                  <div className="flex-[2.2] min-w-0 grid grid-cols-2 gap-2 relative">
                    <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === 'from' ? null : 'from');
                        }}
                        className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 cursor-pointer"
                      >
                        <span className="block text-[11px] text-slate-500 font-medium">
                          From Station
                        </span>
                        <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                          {fromCity.city} Jn
                        </span>
                        <span className="block text-[11px] font-mono-tabular text-slate-500 truncate">
                          {fromCity.stationCode} · IRCTC
                        </span>
                      </button>
                      {renderCityDropdown('from', fromCity, onChangeFromCity, true)}
                    </div>

                    <button
                      type="button"
                      onClick={handleSwap}
                      aria-label="Swap railway stations"
                      className={`flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-indigo-600 transition-transform duration-200 cursor-pointer ${
                        swapRotated ? 'rotate-180' : ''
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === 'to' ? null : 'to');
                        }}
                        className="w-full h-full text-left pl-4 pr-3 sm:pl-5 sm:pr-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 cursor-pointer"
                      >
                        <span className="block text-[11px] text-slate-500 font-medium">
                          To Station
                        </span>
                        <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                          {toCity.city} Jn
                        </span>
                        <span className="block text-[11px] font-mono-tabular text-slate-500 truncate">
                          {toCity.stationCode} · IRCTC
                        </span>
                      </button>
                      {renderCityDropdown('to', toCity, onChangeToCity, true)}
                    </div>
                  </div>

                  {/* Travel Date — Opens Normal Inline Calendar */}
                  <div className="flex-1 min-w-0 relative dropdown-field-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'train-date' ? null : 'train-date');
                      }}
                      className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                        openDropdown === 'train-date'
                          ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                          : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                      }`}
                      title="Click to select train travel date"
                    >
                      <div className="min-w-0">
                        <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                          Travel Date
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {formatDisplayDate(departureDate)}
                        </span>
                        <span className="block text-[11px] text-slate-400 truncate">
                          {trainQuota}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1 transition-colors shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </button>
                    {openDropdown === 'train-date' && (
                      <NormalCalendarDropdown
                        selectedDate={departureDate}
                        minDate="2026-10-15"
                        onSelectDate={(newDate) => onChangeDepartureDate(newDate)}
                        onClose={() => setOpenDropdown(null)}
                      />
                    )}
                  </div>

                  {/* Train Coach Class */}
                  <div className="flex-1 min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          openDropdown === 'train-class' ? null : 'train-class'
                        );
                      }}
                      className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all flex items-center justify-between gap-1 cursor-pointer ${
                        openDropdown === 'train-class'
                          ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                          : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/90'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-[11px] text-slate-500 font-medium">
                          Class
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {trainClass}
                        </span>
                        <span className="block text-[11px] text-slate-400 truncate">
                          Coach Tier
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </button>

                    {openDropdown === 'train-class' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 max-h-60 overflow-y-auto custom-scrollbar"
                      >
                        {TRAIN_CLASSES.map((tc) => (
                          <button
                            key={tc}
                            type="button"
                            onClick={() => {
                              setTrainClass(tc);
                              onChangeTravellers(travellers, tc);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                              trainClass === tc
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {tc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Trains Button */}
                  <button
                    type="button"
                    onClick={onTriggerSearch}
                    className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#6D28D9] text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Search</span>
                  </button>
                </div>
              )}

              {trainMode === 'pnr' && (
                <div className="space-y-3">
                  <div className="flex items-stretch gap-2 w-full">
                    <div className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="w-full">
                        <span className="block text-[11px] text-slate-500 font-medium">
                          Enter 10-Digit IRCTC PNR Number
                        </span>
                        <input
                          type="text"
                          maxLength={10}
                          value={pnrInput}
                          onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 2458916304"
                          className="w-full bg-transparent text-sm sm:text-base font-mono-tabular font-bold text-slate-900 focus:outline-none mt-0.5"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPnrResult(
                          `PNR ${pnrInput || '2458916304'}: Train 22436 Vande Bharat Exp (${fromCity.stationCode} → ${toCity.stationCode}) · Coach C4, Berth 32 (Window) · Status: CNF (Confirmed)`
                        )
                      }
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md whitespace-nowrap cursor-pointer"
                    >
                      Check PNR Status
                    </button>
                  </div>
                  {pnrResult && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pnrResult}</span>
                    </div>
                  )}
                </div>
              )}

              {trainMode === 'status' && (
                <div className="space-y-3">
                  <div className="flex items-stretch gap-2 w-full">
                    <div className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="block text-[11px] text-slate-500 font-medium">
                        Train Number or Name
                      </span>
                      <input
                        type="text"
                        value={liveTrainNo}
                        onChange={(e) => setLiveTrainNo(e.target.value)}
                        className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none mt-0.5"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLiveTrainStatusMsg(
                          `${liveTrainNo} is running ON TIME · Last crossed Kota Jn 14 mins ago · Expected arrival at ${toCity.city} (${toCity.stationCode}) on Platform 3.`
                        )
                      }
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md whitespace-nowrap cursor-pointer"
                    >
                      Check Live Status
                    </button>
                  </div>
                  {liveTrainStatusMsg && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium flex items-center gap-2">
                      <TrainFront className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{liveTrainStatusMsg}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ===================================================================
              3. HOTELS INTERFACE (Upto 4 Rooms | Hourly Stays | Villas + City/Property, Check-In, Check-Out, Rooms & Guests)
          =================================================================== */}
          {activeCategory === 'hotels' && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3.5 flex-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {[
                    { id: 'overnight', label: 'Upto 4 Rooms' },
                    { id: 'hourly', label: 'Hourly Stays' },
                    { id: 'villas', label: 'Luxury Villas & Resorts' },
                    { id: 'hostels', label: 'Hostels (Hosteller / goSTOPS)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        if (m.id === 'hostels') {
                          if (onOpenHostelsPage) {
                            onOpenHostelsPage();
                          } else {
                            setHotelMode('hostels');
                          }
                        } else {
                          setHotelMode(m.id as 'overnight' | 'hourly' | 'villas' | 'hostels');
                        }
                      }}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        hotelMode === m.id
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : m.id === 'hostels'
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {m.id === 'hostels' && (
                        <Sparkles className="w-3.5 h-3.5 inline-block mr-1 text-amber-600 fill-amber-500" />
                      )}
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-stretch gap-2 w-full">
                {/* City, Property Name or Location */}
                <div className="flex-[1.6] min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'to' ? null : 'to');
                    }}
                    className="w-full h-full text-left px-3.5 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 cursor-pointer"
                  >
                    <span className="block text-[11px] text-slate-500 font-medium">
                      City, Property Name or Location
                    </span>
                    <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                      {toCity.city}, {toCity.country}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">
                      {hotelMode === 'villas'
                        ? 'Private Pool Villas & Beach Resorts'
                        : hotelMode === 'hostels'
                        ? 'The Hosteller, goSTOPS, Zostel & Dorms'
                        : '320+ Verified Properties'}
                    </span>
                  </button>
                  {renderCityDropdown('to', toCity, onChangeToCity)}
                </div>

                {/* Check-In Date — Opens Normal Inline Calendar */}
                <div className="flex-1 min-w-0 relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'hotel-checkin' ? null : 'hotel-checkin');
                    }}
                    className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                      openDropdown === 'hotel-checkin'
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                    }`}
                    title="Click to select check-in date"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                        Check-In
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formatDisplayDate(departureDate, 'Select Check-In')}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        From 14:00
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1 transition-colors shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </button>
                  {openDropdown === 'hotel-checkin' && (
                    <NormalCalendarDropdown
                      selectedDate={departureDate}
                      minDate="2026-10-15"
                      onSelectDate={(newDate) => {
                        onChangeDepartureDate(newDate);
                        if (returnDate <= newDate) {
                          const nextD = new Date(newDate);
                          nextD.setDate(nextD.getDate() + 1);
                          onChangeReturnDate(nextD.toISOString().slice(0, 10));
                        }
                      }}
                      onClose={() => setOpenDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* Check-Out Date OR Hourly Slot */}
                {hotelMode === 'hourly' ? (
                  <div className="flex-1 min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          openDropdown === 'hourly-slot' ? null : 'hourly-slot'
                        );
                      }}
                      className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="block text-[11px] text-indigo-600 font-semibold">
                          Hourly Duration
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {hourlySlot}
                        </span>
                        <span className="block text-[11px] text-indigo-500 truncate">
                          Flexible Check-In
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    </button>
                    {openDropdown === 'hourly-slot' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 max-h-60 overflow-y-auto custom-scrollbar"
                      >
                        {['3 Hours Stay', '6 Hours Stay', '9 Hours Stay'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setHourlySlot(slot);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 cursor-pointer"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 min-w-0 relative dropdown-field-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'hotel-checkout' ? null : 'hotel-checkout');
                      }}
                      className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                        openDropdown === 'hotel-checkout'
                          ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                          : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                      }`}
                      title="Click to select check-out date"
                    >
                      <div className="min-w-0">
                        <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                          Check-Out
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {formatDisplayDate(returnDate, 'Select Check-Out')}
                        </span>
                        <span className="block text-[11px] text-slate-400 truncate">
                          Until 12:00
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1 transition-colors shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </button>
                    {openDropdown === 'hotel-checkout' && (
                      <NormalCalendarDropdown
                        selectedDate={returnDate}
                        minDate={departureDate}
                        onSelectDate={(newDate) => onChangeReturnDate(newDate)}
                        onClose={() => setOpenDropdown(null)}
                        alignRight={true}
                      />
                    )}
                  </div>
                )}

                {/* Rooms & Guests */}
                <div className="flex-1 min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === 'hotel-guests' ? null : 'hotel-guests'
                      );
                    }}
                    className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 flex items-center justify-between gap-1 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium">
                        Rooms & Guests
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {hotelRooms} {hotelRooms === 1 ? 'Room' : 'Rooms'}, {hotelGuests} Guests
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        {hotelPriceFilter}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>

                  {openDropdown === 'hotel-guests' && (
                    <div
                      data-dropdown-container="true"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 max-h-80 overflow-y-auto custom-scrollbar space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Rooms</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setHotelRooms(Math.max(1, hotelRooms - 1))}
                            className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono-tabular">
                            {hotelRooms}
                          </span>
                          <button
                            type="button"
                            onClick={() => setHotelRooms(Math.min(4, hotelRooms + 1))}
                            className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Adults</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const next = Math.max(1, hotelGuests - 1);
                              setHotelGuests(next);
                              onChangeTravellers(next, `${hotelRooms} Room`);
                            }}
                            className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono-tabular">
                            {hotelGuests}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = Math.min(10, hotelGuests + 1);
                              setHotelGuests(next);
                              onChangeTravellers(next, `${hotelRooms} Room`);
                            }}
                            className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-2">
                        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                          Price Per Night
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {['₹0 - ₹5,000', '₹5,000 - ₹12,000', '₹12,000 - ₹25,000', '₹0 - ₹15,000+'].map(
                            (p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => {
                                  setHotelPriceFilter(p);
                                  setOpenDropdown(null);
                                }}
                                className={`px-2 py-1 rounded-lg text-[11px] font-medium truncate cursor-pointer ${
                                  hotelPriceFilter === p
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {p}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Hotels Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (hotelMode === 'hostels' && onOpenHostelsPage) {
                      onOpenHostelsPage();
                    } else {
                      onTriggerSearch();
                    }
                  }}
                  className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#6D28D9] text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>{hotelMode === 'hostels' ? 'Search Hostels' : 'Search'}</span>
                </button>
              </div>

              {hotelMode === 'hostels' && (
                <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                      🎒
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <span>The Hosteller · goSTOPS · Zostel Collection</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-900 uppercase">
                          Backpacker Stays
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-800">
                        Book social dorms &amp; private rooms with 100+ Mbps Wi-Fi, cafes, female-only dorms &amp; community events starting ₹449.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenHostelsPage?.()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Open Hostels Page</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* ===================================================================
              4. BUSES INTERFACE (RedBus / MMT Style: Coach Filters + From City ⇄ To City + Travel Date + Seat Type)
          =================================================================== */}
          {activeCategory === 'buses' && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3.5 flex-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {BUS_TYPES.map((bt) => (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => {
                        setBusFilter(bt);
                        onChangeTravellers(travellers, bt);
                      }}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        busFilter === bt
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>

                <label className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-700 cursor-pointer select-none whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={singleLadySeat}
                    onChange={() => setSingleLadySeat((prev) => !prev)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 cursor-pointer"
                  />
                  <span>Women / Single Lady Berth</span>
                </label>
              </div>

              <div className="flex items-stretch gap-2 w-full">
                {/* From Bus Stand ⇄ To Bus Stand */}
                <div className="flex-[2.2] min-w-0 grid grid-cols-2 gap-2 relative">
                  <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'from' ? null : 'from');
                      }}
                      className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 cursor-pointer"
                    >
                      <span className="block text-[11px] text-slate-500 font-medium">
                        From City
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                        {fromCity.city}
                      </span>
                      <span className="block text-[11px] text-slate-500 truncate">
                        ISBT / Main Boarding Point
                      </span>
                    </button>
                    {renderCityDropdown('from', fromCity, onChangeFromCity)}
                  </div>

                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="Swap bus cities"
                    className={`flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-indigo-600 transition-transform duration-200 cursor-pointer ${
                      swapRotated ? 'rotate-180' : ''
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'to' ? null : 'to');
                      }}
                      className="w-full h-full text-left pl-4 pr-3 sm:pl-5 sm:pr-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 cursor-pointer"
                    >
                      <span className="block text-[11px] text-slate-500 font-medium">
                        To City
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                        {toCity.city}
                      </span>
                      <span className="block text-[11px] text-slate-500 truncate">
                        Central Bus Terminal
                      </span>
                    </button>
                    {renderCityDropdown('to', toCity, onChangeToCity)}
                  </div>
                </div>

                {/* Travel Date — Opens Normal Inline Calendar */}
                <div className="flex-1 min-w-0 relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'bus-date' ? null : 'bus-date');
                    }}
                    className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                      openDropdown === 'bus-date'
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                    }`}
                    title="Click to select bus travel date"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                        Travel Date
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formatDisplayDate(departureDate)}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        {busFilter}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1 transition-colors shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </button>
                  {openDropdown === 'bus-date' && (
                    <NormalCalendarDropdown
                      selectedDate={departureDate}
                      minDate="2026-10-15"
                      onSelectDate={(newDate) => onChangeDepartureDate(newDate)}
                      onClose={() => setOpenDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* Search Buses Button */}
                <button
                  type="button"
                  onClick={onTriggerSearch}
                  className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#6D28D9] text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </div>
            </>
          )}

          {/* ===================================================================
              5. CABS INTERFACE (Outstation One-Way | Outstation Round-Trip | Airport Transfer | Hourly Rental)
          =================================================================== */}
          {activeCategory === 'cabs' && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3.5 flex-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {[
                    { id: 'one-way', label: 'Outstation One-Way' },
                    { id: 'round-trip', label: 'Outstation Round-Trip' },
                    { id: 'airport', label: 'Airport Transfer' },
                    { id: 'hourly', label: 'Hourly Rental' },
                  ].map((cm) => (
                    <button
                      key={cm.id}
                      type="button"
                      onClick={() =>
                        setCabMode(
                          cm.id as 'one-way' | 'round-trip' | 'airport' | 'hourly'
                        )
                      }
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        cabMode === cm.id
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {cm.label}
                    </button>
                  ))}
                </div>

                {/* Vehicle Preference */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {['Hatchback', 'Sedan', 'SUV (Innova)'].map((car) => (
                    <button
                      key={car}
                      type="button"
                      onClick={() => {
                        setCabCarType(car);
                        onChangeTravellers(travellers, car);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                        cabCarType === car
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {car}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-stretch gap-2 w-full">
                {/* Pickup & Drop (or Hourly City + Package) */}
                {cabMode === 'hourly' ? (
                  <>
                    <div className="flex-[1.3] min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === 'from' ? null : 'from');
                        }}
                        className="w-full h-full text-left px-3.5 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 cursor-pointer"
                      >
                        <span className="block text-[11px] text-slate-500 font-medium">
                          Pickup City
                        </span>
                        <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                          {fromCity.city}
                        </span>
                        <span className="block text-[11px] text-slate-500 truncate">
                          Chauffeur-Driven Rental
                        </span>
                      </button>
                      {renderCityDropdown('from', fromCity, onChangeFromCity)}
                    </div>

                    <div className="flex-1 min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(
                            openDropdown === 'cab-pkg' ? null : 'cab-pkg'
                          );
                        }}
                        className="w-full h-full text-left px-3.5 py-2.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="block text-[11px] text-indigo-600 font-semibold">
                            Rental Package
                          </span>
                          <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                            {cabHourlyPkg}
                          </span>
                          <span className="block text-[11px] text-indigo-500 truncate">
                            AC {cabCarType}
                          </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      </button>
                      {openDropdown === 'cab-pkg' && (
                        <div
                          data-dropdown-container="true"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 max-h-60 overflow-y-auto custom-scrollbar"
                        >
                          {CAB_PACKAGES.map((pkg) => (
                            <button
                              key={pkg}
                              type="button"
                              onClick={() => {
                                setCabHourlyPkg(pkg);
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 cursor-pointer"
                            >
                              {pkg}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-[2] min-w-0 grid grid-cols-2 gap-2 relative">
                    <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === 'from' ? null : 'from');
                        }}
                        className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 cursor-pointer"
                      >
                        <span className="block text-[11px] text-slate-500 font-medium">
                          {cabMode === 'airport' ? 'Airport Terminal' : 'From Pickup'}
                        </span>
                        <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                          {fromCity.city}
                        </span>
                        <span className="block text-[11px] text-slate-500 truncate">
                          {cabMode === 'airport'
                            ? `${fromCity.code} Terminal`
                            : 'Doorstep Pickup'}
                        </span>
                      </button>
                      {renderCityDropdown('from', fromCity, onChangeFromCity)}
                    </div>

                    <button
                      type="button"
                      onClick={handleSwap}
                      aria-label="Swap pickup and drop locations"
                      className={`flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-indigo-600 transition-transform duration-200 cursor-pointer ${
                        swapRotated ? 'rotate-180' : ''
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === 'to' ? null : 'to');
                        }}
                        className="w-full h-full text-left pl-4 pr-3 sm:pl-5 sm:pr-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 cursor-pointer"
                      >
                        <span className="block text-[11px] text-slate-500 font-medium">
                          To Drop
                        </span>
                        <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                          {toCity.city}
                        </span>
                        <span className="block text-[11px] text-slate-500 truncate">
                          Hotel / City Address
                        </span>
                      </button>
                      {renderCityDropdown('to', toCity, onChangeToCity)}
                    </div>
                  </div>
                )}

                {/* Pickup Date — Opens Normal Inline Calendar */}
                <div className="flex-1 min-w-0 relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'cab-pickup-date' ? null : 'cab-pickup-date');
                    }}
                    className={`w-full h-full text-left px-3 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                      openDropdown === 'cab-pickup-date'
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                    }`}
                    title="Click to select cab pickup date"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                        Pickup Date
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formatDisplayDate(departureDate)}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        Zero Surge
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1 transition-colors shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </button>
                  {openDropdown === 'cab-pickup-date' && (
                    <NormalCalendarDropdown
                      selectedDate={departureDate}
                      minDate="2026-10-15"
                      onSelectDate={(newDate) => {
                        onChangeDepartureDate(newDate);
                        if (returnDate <= newDate) {
                          const nextD = new Date(newDate);
                          nextD.setDate(nextD.getDate() + 1);
                          onChangeReturnDate(nextD.toISOString().slice(0, 10));
                        }
                      }}
                      onClose={() => setOpenDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* Return Date — ONLY shown when Outstation Round-Trip is selected */}
                {cabMode === 'round-trip' && (
                  <div className="flex-1 min-w-0 relative dropdown-field-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'cab-return-date' ? null : 'cab-return-date');
                      }}
                      className={`w-full h-full text-left px-3 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                        openDropdown === 'cab-return-date'
                          ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                          : 'bg-indigo-50/50 hover:bg-indigo-50/80 hover:border-indigo-400 border-indigo-200'
                      }`}
                      title="Click to select cab return date"
                    >
                      <div className="min-w-0">
                        <span className="block text-[11px] text-indigo-600 font-semibold transition-colors">
                          Return Date
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {formatDisplayDate(returnDate, 'Select Return')}
                        </span>
                        <span className="block text-[11px] text-indigo-500 truncate">
                          Round-Trip Cab
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-indigo-100/80 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white flex items-center justify-center shrink-0 ml-1 transition-colors shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </button>
                    {openDropdown === 'cab-return-date' && (
                      <NormalCalendarDropdown
                        selectedDate={returnDate}
                        minDate={departureDate}
                        onSelectDate={(newDate) => onChangeReturnDate(newDate)}
                        onClose={() => setOpenDropdown(null)}
                        alignRight={true}
                      />
                    )}
                  </div>
                )}

                {/* Pickup Time */}
                <div className="flex-1 min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === 'cab-time' ? null : 'cab-time'
                      );
                    }}
                    className="w-full h-full text-left px-3 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between gap-1 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium">
                        Pickup Time
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {cabPickupTime}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        45m Free Wait
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>
                  {openDropdown === 'cab-time' && (
                    <div
                      data-dropdown-container="true"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                      {CAB_TIMES.map((tm) => (
                        <button
                          key={tm}
                          type="button"
                          onClick={() => {
                            setCabPickupTime(tm);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-slate-100 cursor-pointer"
                        >
                          {tm}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Cabs Button */}
                <button
                  type="button"
                  onClick={onTriggerSearch}
                  className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#6D28D9] text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </div>
            </>
          )}

          {/* ===================================================================
              6. HOLIDAYS INTERFACE (All Packages | Honeymoon | Family | Adventure + With Flights Toggle)
          =================================================================== */}
          {activeCategory === 'holidays' && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3.5 flex-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {['All Packages', 'Honeymoon', 'Family Vacation', 'Adventure'].map(
                    (th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setHolidayTheme(th)}
                        className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          holidayTheme === th
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        {th}
                      </button>
                    )
                  )}
                </div>

                <label className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-700 cursor-pointer select-none whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={withFlights}
                    onChange={() => setWithFlights((prev) => !prev)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 cursor-pointer"
                  />
                  <span>Include Return Flights</span>
                </label>
              </div>

              <div className="flex items-stretch gap-2 w-full">
                {/* Departure City ⇄ Holiday Destination */}
                <div className="flex-[2.2] min-w-0 grid grid-cols-2 gap-2 relative">
                  <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'from' ? null : 'from');
                      }}
                      className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 cursor-pointer"
                    >
                      <span className="block text-[11px] text-slate-500 font-medium">
                        From City
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                        {fromCity.city}
                      </span>
                      <span className="block text-[11px] text-slate-500 truncate">
                        {withFlights ? 'With Return Flights' : 'Land Package Only'}
                      </span>
                    </button>
                    {renderCityDropdown('from', fromCity, onChangeFromCity)}
                  </div>

                  <div className="relative min-w-0 dropdown-field-container" data-dropdown-container="true">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === 'to' ? null : 'to');
                      }}
                      className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 cursor-pointer"
                    >
                      <span className="block text-[11px] text-slate-500 font-medium">
                        To Destination
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                        {toCity.city}
                      </span>
                      <span className="block text-[11px] text-slate-500 truncate">
                        {holidayTheme}
                      </span>
                    </button>
                    {renderCityDropdown('to', toCity, onChangeToCity)}
                  </div>
                </div>

                {/* Departure Date — Opens Normal Inline Calendar */}
                <div className="flex-1 min-w-0 relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'holiday-date' ? null : 'holiday-date');
                    }}
                    className={`w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                      openDropdown === 'holiday-date'
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                    }`}
                    title="Click to select holiday departure date"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                        Departure Date
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formatDisplayDate(departureDate)}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        Flexible Dates
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1 transition-colors shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </button>
                  {openDropdown === 'holiday-date' && (
                    <NormalCalendarDropdown
                      selectedDate={departureDate}
                      minDate="2026-10-15"
                      onSelectDate={(newDate) => onChangeDepartureDate(newDate)}
                      onClose={() => setOpenDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* Duration & Guests */}
                <div className="flex-1 min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === 'holiday-dur' ? null : 'holiday-dur'
                      );
                    }}
                    className="w-full h-full text-left px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between gap-1 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium">
                        Duration
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {holidayDuration}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        5★ Stays + Transfers
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>
                  {openDropdown === 'holiday-dur' && (
                    <div
                      data-dropdown-container="true"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                      {['3N / 4D', '4N / 5D', '6N / 7D', '8N / 9D'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            setHolidayDuration(d);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-slate-100 cursor-pointer"
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Holidays Button */}
                <button
                  type="button"
                  onClick={onTriggerSearch}
                  className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#6D28D9] text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </div>
            </>
          )}

          {/* ===================================================================
              7. TOURS AND EXPERIENCES INTERFACE
              (Strictly: Destination + Select Date + Search Button, plus theme park / activity filters)
          =================================================================== */}
          {activeCategory === 'experiences' && (
            <>
              {/* Top Row: Activity / Theme Park Filters */}
              <div className="flex items-center justify-between gap-2 mb-3.5 flex-nowrap overflow-x-auto pb-1 scrollbar-none">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {[
                    'All Experiences',
                    '🎢 Theme Parks',
                    '🌊 Water Parks',
                    '🪂 Adventure & Outdoor',
                    '🏛️ Iconic Landmarks',
                    '⛵ Island & Boat Tours',
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setExperienceTheme(cat)}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        experienceTheme === cat
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant E-Ticket Turnstile Entry</span>
                </div>
              </div>

              {/* Landscape Search Bar: ONLY Destination and Select Date */}
              <div className="flex items-stretch gap-2 w-full">
                {/* 1. Destination / Attraction Picker */}
                <div className="flex-[2.5] min-w-0 relative dropdown-field-container" data-dropdown-container="true">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'to' ? null : 'to');
                    }}
                    className="w-full h-full text-left px-3.5 sm:px-4 py-2.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 transition-colors cursor-pointer"
                  >
                    <span className="block text-[11px] text-slate-500 font-medium">
                      Destination
                    </span>
                    <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                      {toCity.city}, {toCity.country}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">
                      {experienceTheme === 'All Experiences'
                        ? 'Theme Parks, Water Parks, Sightseeing & Activities'
                        : `${experienceTheme} & Guided Passes`}
                    </span>
                  </button>
                  {renderCityDropdown('to', toCity, onChangeToCity)}
                </div>

                {/* 2. Select Date (Activity Date) — Opens Normal Inline Calendar */}
                <div className="flex-[1.5] min-w-0 relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === 'experience-date' ? null : 'experience-date');
                    }}
                    className={`w-full h-full text-left px-3.5 sm:px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                      openDropdown === 'experience-date'
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-slate-50/90 hover:bg-slate-100/90 hover:border-blue-400 border-slate-200/90'
                    }`}
                    title="Click to select visit date"
                  >
                    <div className="min-w-0">
                      <span className="block text-[11px] text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                        Select Date
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formatDisplayDate(departureDate, 'Select Visit Date')}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        Flexible Reschedule Available
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 ml-1.5 transition-colors shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </button>
                  {openDropdown === 'experience-date' && (
                    <NormalCalendarDropdown
                      selectedDate={departureDate}
                      minDate="2026-10-15"
                      onSelectDate={(newDate) => onChangeDepartureDate(newDate)}
                      onClose={() => setOpenDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* 3. Search Button */}
                <button
                  type="button"
                  onClick={onTriggerSearch}
                  className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#6D28D9] hover:brightness-105 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-all"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* 4 Feature Options Strip: Explore, Business Travel, Gift Cards, Influencers */}
        <div className="mt-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-2 sm:p-3 shadow-md shadow-slate-900/5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {DISCOVERY_OPTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'explore') {
                      if (onOpenExplorePage) {
                        onOpenExplorePage();
                      } else {
                        onSelectTrustPillar('Explore Destinations', item.detail);
                        const destEl = document.querySelector('section:has(h2)') || document.getElementById('top');
                        destEl?.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else if (item.id === 'business-travel') {
                      setShowBusinessModal(true);
                    } else if (item.id === 'dining-club') {
                      if (onOpenDiningClubPage) {
                        onOpenDiningClubPage();
                      } else {
                        onSelectTrustPillar('Dining Club', item.detail);
                      }
                    } else if (item.id === 'influencers') {
                      if (onOpenInfluencersPage) {
                        onOpenInfluencersPage();
                      }
                    }
                  }}
                  className="flex items-center gap-2.5 sm:gap-3.5 text-left group p-2 sm:p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/90 transition-all cursor-pointer min-w-0"
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-xs group-hover:scale-105">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Modal: Business Travel */}
      {showBusinessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">TripYeah Business Travel</h3>
                  <p className="text-xs text-slate-500">Corporate Fares, GST Invoicing &amp; Managed Trips</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowBusinessModal(false);
                  setBizSuccess(false);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bizSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-slate-900">Corporate Account Registered!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our Corporate Accounts Desk has provisioned your company profile. Corporate discounted fares and automated GST invoices will now apply on all bookings for <strong>{bizCompany || 'your organization'}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowBusinessModal(false);
                    setBizSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Done &amp; Continue
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBizSuccess(true);
                  onSelectTrustPillar('Corporate Account Linked', `GST profile for ${bizCompany || 'your company'} configured with corporate benefits.`);
                }}
                className="space-y-4"
              >
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-blue-900">🏢 Exclusive Corporate Benefits:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                    <li>Automated GST Tax Invoices for 100% Input Tax Credit claim</li>
                    <li>Up to 15% corporate special fares on flights &amp; partner business stays</li>
                    <li>Free flight date modifications and zero cancellation charges</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={bizCompany}
                    onChange={(e) => setBizCompany(e.target.value)}
                    placeholder="e.g. Acme Technologies Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Corporate GSTIN (Optional)</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={bizGst}
                      onChange={(e) => setBizGst(e.target.value.toUpperCase())}
                      placeholder="07AAAAA0000A1Z5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold uppercase font-mono-tabular focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Work Email *</label>
                    <input
                      type="email"
                      required
                      value={bizEmail}
                      onChange={(e) => setBizEmail(e.target.value)}
                      placeholder="travel@acme.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBusinessModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-blue-600/25 cursor-pointer"
                  >
                    Register Corporate Desk
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive Modal: Gift Cards */}
      {showGiftCardsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">TripYeah Travel Gift Cards</h3>
                  <p className="text-xs text-slate-500">Send instant digital vouchers for flights, hotels &amp; holidays</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGiftCardsModal(false);
                  setGiftSentSuccess(false);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {giftSentSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-slate-900">Gift Card Dispatched!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A ₹{giftAmount.toLocaleString('en-IN')} TripYeah Travel Voucher has been sent to <strong>{giftEmail || 'the recipient'}</strong> with code <strong>TY-GIFT-8820</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowGiftCardsModal(false);
                    setGiftSentSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Awesome!
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setGiftSentSuccess(true);
                  onSelectTrustPillar('Gift Card Purchased', `₹${giftAmount.toLocaleString('en-IN')} travel voucher generated.`);
                }}
                className="space-y-4"
              >
                {/* Visual Card Preview */}
                <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-sm font-bold tracking-widest text-sky-300">TRIPYEAH VOUCHER</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold font-mono-tabular text-amber-300">
                    ₹{giftAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Redeemable on all Flights, IRCTC Trains, 5★ Stays &amp; Holidays
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>CODE: TY-GIFT-8820</span>
                    <span>NO EXPIRY · 100% TRANSFERABLE</span>
                  </div>
                </div>

                {/* Amount Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Card Denomination</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setGiftAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          giftAmount === amt
                            ? 'bg-[#2563EB] text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={giftRecipient}
                      onChange={(e) => setGiftRecipient(e.target.value)}
                      placeholder="e.g. Priyanshu Singh"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email *</label>
                    <input
                      type="email"
                      required
                      value={giftEmail}
                      onChange={(e) => setGiftEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Custom Greeting Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Greeting Message</label>
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGiftCardsModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Purchase &amp; Send Gift Card</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
