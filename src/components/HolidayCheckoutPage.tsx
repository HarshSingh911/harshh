import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  Info,
  Users,
  ChevronDown,
  X,
  CreditCard,
  Sparkles,
  Maximize2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Car,
  Hotel,
  Utensils,
  Plane,
  Ship,
  Compass,
  FileText,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  BookedTrip,
  CurrencyCode,
  formatPrice,
} from '../data/travelData';
import {
  HolidayPackageDetails,
  HOLIDAY_PACKAGES_DATA,
} from '../data/holidayPackagesData';
import { SafeImage } from './SafeImage';
import { NormalCalendarDropdown } from './NormalCalendarDropdown';

export interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
  sample: string;
}

export const COUNTRY_DIAL_CODES: CountryCodeOption[] = [
  { code: '+91', country: 'India', flag: '🇮🇳', sample: '98765 43210' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', sample: '50 123 4567' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸', sample: '202 555 0123' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', sample: '7911 123456' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', sample: '8123 4567' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', sample: '81 234 5678' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', sample: '12 345 6789' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', sample: '812 3456 789' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', sample: '3312 3456' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', sample: '50 123 4567' },
  { code: '+968', country: 'Oman', flag: '🇴🇲', sample: '9123 4567' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭', sample: '3600 1234' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', sample: '412 345 678' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', sample: '151 23456789' },
  { code: '+33', country: 'France', flag: '🇫🇷', sample: '6 12 34 56 78' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', sample: '90 1234 5678' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', sample: '10 1234 5678' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰', sample: '9123 4567' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', sample: '71 234 5678' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵', sample: '984 1234567' },
  { code: '+960', country: 'Maldives', flag: '🇲🇻', sample: '771 2345' },
];

export interface AdditionalTraveller {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  type: 'Adult' | 'Child';
}

export interface HolidayCheckoutPageProps {
  holidayPackage?: HolidayPackageDetails;
  currency: CurrencyCode;
  selectedDate: string;
  onBack: () => void;
  onCompleteBooking: (bookedTrip: BookedTrip) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onNavigateTrips?: () => void;
}

export const HolidayCheckoutPage: React.FC<HolidayCheckoutPageProps> = ({
  holidayPackage: propPackage,
  currency,
  selectedDate: initialDate,
  onBack,
  onCompleteBooking,
  onNotify,
  onNavigateTrips,
}) => {
  // Use passed package or fallback to premier package
  const holiday = propPackage || HOLIDAY_PACKAGES_DATA[0];

  // Gallery Active Image & Lightbox State
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Booking Parameters State
  const [departureDate, setDepartureDate] = useState<string>(initialDate || '2026-10-18');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [roomsCount, setRoomsCount] = useState<number>(1);

  // Day-wise Itinerary expanded filter: 'all' or specific day index
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');
  const [expandedDayAccordions, setExpandedDayAccordions] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });

  // Section Tabs for Details & Policies
  const [activeDetailTab, setActiveDetailTab] = useState<
    'itinerary' | 'transfers' | 'stay' | 'food' | 'inclusions' | 'policies'
  >('itinerary');

  // Traveler Details Form State
  const [travelerName, setTravelerName] = useState<string>('');
  const [travelerEmail, setTravelerEmail] = useState<string>('');
  const [travelerPhone, setTravelerPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');
  const [additionalTravellers, setAdditionalTravellers] = useState<AdditionalTraveller[]>([]);

  // PAN Details State (Mandatory as per RBI)
  const [panNumber, setPanNumber] = useState<string>('');

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('HOLIDAY50');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; maxDiscount: number } | null>({
    code: 'HOLIDAY50',
    discountPercent: 10,
    maxDiscount: 5000,
  });

  // Booking Confirmation Modal
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookedTrip | null>(null);

  // Filter country dial codes
  const filteredCountryCodes = useMemo(() => {
    if (!countrySearchQuery.trim()) return COUNTRY_DIAL_CODES;
    const q = countrySearchQuery.toLowerCase();
    return COUNTRY_DIAL_CODES.filter(
      (c) => c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countrySearchQuery]);

  const selectedCountryObj = useMemo(() => {
    return COUNTRY_DIAL_CODES.find((c) => c.code === countryCode) || COUNTRY_DIAL_CODES[0];
  }, [countryCode]);

  // Pricing calculations
  const adultBasePrice = holiday.startingPricePerPersonInr;
  const childPrice = Math.round(adultBasePrice * 0.65); // Children discounted at 35% off
  const adultSubtotal = adults * adultBasePrice;
  const childSubtotal = children * childPrice;
  const rawSubtotal = adultSubtotal + childSubtotal;

  // Promo calculation
  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    const calc = (rawSubtotal * appliedPromo.discountPercent) / 100;
    return Math.min(calc, appliedPromo.maxDiscount);
  }, [appliedPromo, rawSubtotal]);

  // GST & Tourism Tax (5%)
  const taxesAndFees = Math.round((rawSubtotal - promoDiscount) * 0.05);
  const finalTotalInr = rawSubtotal - promoDiscount + taxesAndFees;

  // Format Departure Date Display
  const formatDisplayDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  // Add Traveler
  const handleAddTraveller = () => {
    const nextId = `TR-${Date.now()}`;
    const nextIndex = additionalTravellers.length + 2;
    setAdditionalTravellers((prev) => [
      ...prev,
      {
        id: nextId,
        name: '',
        gender: 'Male',
        type: nextIndex > adults ? 'Child' : 'Adult',
      },
    ]);
  };

  const handleRemoveTraveller = (id: string) => {
    setAdditionalTravellers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTraveller = (id: string, field: keyof AdditionalTraveller, val: any) => {
    setAdditionalTravellers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  // Toggle Accordion Day
  const toggleDayAccordion = (dayNum: number) => {
    setExpandedDayAccordions((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  // Apply Promo
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      onNotify('Promo Code Required', 'Please enter a valid coupon code.', 'info');
      return;
    }
    if (code === 'HOLIDAY50' || code === 'TRIPYEAH50' || code === 'SUPER50') {
      setAppliedPromo({ code, discountPercent: 10, maxDiscount: 5000 });
      onNotify('Coupon Applied!', `Saved up to ₹5,000 with ${code}!`, 'success');
    } else if (code === 'SUMMER20' || code === 'FIRSTTRIP') {
      setAppliedPromo({ code, discountPercent: 5, maxDiscount: 2500 });
      onNotify('Coupon Applied!', `Saved ₹2,500 with ${code}!`, 'success');
    } else {
      onNotify('Invalid Code', 'Try HOLIDAY50 for instant ₹5,000 off!', 'info');
    }
  };

  // Validate PAN
  const isValidPan = (pan: string) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan.trim().toUpperCase());
  };

  // Confirm and Pay Booking Handler
  const handleConfirmAndPay = () => {
    if (!travelerName.trim()) {
      onNotify('Name Required', 'Please enter your Full Name in traveller details.', 'info');
      return;
    }
    if (!travelerEmail.trim() || !travelerEmail.includes('@')) {
      onNotify('Email Required', 'Please enter a valid Email ID for trip voucher delivery.', 'info');
      return;
    }
    if (!travelerPhone.trim() || travelerPhone.length < 8) {
      onNotify('Phone Required', 'Please enter a valid Mobile Number for driver and pickup coordination.', 'info');
      return;
    }
    if (!panNumber.trim() || panNumber.trim().length !== 10) {
      onNotify('PAN Required', 'Please enter a valid 10-character PAN Number as required by RBI.', 'info');
      return;
    }

    const bookingRef = `TY-HLD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: BookedTrip = {
      bookingId: bookingRef,
      bookingReference: bookingRef,
      category: 'holidays',
      title: holiday.title,
      routeSummary: `${holiday.durationLabel} · ${holiday.destination}`,
      dateSummary: `${formatDisplayDate(departureDate)} (${holiday.durationLabel})`,
      travellers: adults + children,
      cabinOrRoom: `${roomsCount} Room(s) · ${holiday.stayOverview.roomType}`,
      totalPaidInr: finalTotalInr,
      promoApplied: appliedPromo?.code,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: new Date().toISOString().split('T')[0],
      departureDate: departureDate,
      destinationCity: holiday.city,
      carrierOrHotel: holiday.stayOverview.hotelName,
      paymentMode: 'UPI / NetBanking (TripYehh Secure)',
      passengers: [
        { name: travelerName, age: 30, gender: 'Primary Contact' },
        ...additionalTravellers.map((t) => ({
          name: t.name || 'Co-Traveller',
          gender: t.gender,
        })),
      ],
      hotelCheckInTime: holiday.stayOverview.checkIn,
      hotelCheckOutTime: holiday.stayOverview.checkOut,
      hasInsurance: true,
      policyNumber: `TY-POL-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setConfirmedBookingData(newBooking);
    onCompleteBooking(newBooking);
    setShowSuccessModal(true);
    onNotify('Holiday Booked!', `Your ${holiday.durationLabel} holiday to ${holiday.city} is confirmed!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900 font-sans">
      {/* 1. TOP NAVIGATION / RETURN BAR */}
      <nav aria-label="Breadcrumb Navigation" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-all">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span>Back to Holiday Packages</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Compass className="w-3.5 h-3.5" />
              <span>{holiday.durationLabel}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Refund Guarantee</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* MAIN 2-COLUMN GRID (Images & Main Content on Left, Sticky Sidebar on Right aligned at top) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================
              LEFT COLUMN: HERO GALLERY, TITLE, DAY-WISE ITINERARY,
              TRANSFERS, STAY, FOOD, POLICIES, TRAVELLERS & PAN
          ========================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* 2. IMAGE GALLERY SHOWCASE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs overflow-hidden">
              {/* Main Large Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 bg-slate-100 group">
                <SafeImage
                  src={holiday.galleryImages[activeImageIndex] || holiday.heroImage}
                  alt={holiday.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-md">
                    {holiday.durationLabel}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-900 shadow-sm flex items-center gap-1">
                    <Hotel className="w-3 h-3 text-amber-500" />
                    <span>{holiday.hotelCategory} Luxury Stay</span>
                  </span>
                  {holiday.flightsIncluded && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                      <Plane className="w-3 h-3" />
                      <span>Return Flights Included</span>
                    </span>
                  )}
                </div>

                {/* Enlarge Button */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="View full gallery"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Photos ({holiday.galleryImages.length})</span>
                </button>
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
                {holiday.galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-600/30 scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 3. PACKAGE TITLE, LOCATION & HIGHLIGHTS (Right below images) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">
                    {holiday.theme} Package
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{holiday.destination}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>TripYehh Verified Holiday</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-4 leading-snug">
                {holiday.title}
              </h1>

              {/* Quick Feature Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Duration</div>
                    <div className="text-xs font-extrabold text-slate-900">{holiday.durationLabel}</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Transfers</div>
                    <div className="text-xs font-extrabold text-slate-900">Private AC Cab</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Hotel Stay</div>
                    <div className="text-xs font-extrabold text-slate-900">{holiday.hotelCategory} Category</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Meals Plan</div>
                    <div className="text-xs font-extrabold text-slate-900">Breakfast & Dinner</div>
                  </div>
                </div>
              </div>

              {/* Highlights Bullets */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
                  Package Key Highlights:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {holiday.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-relaxed">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. COMPREHENSIVE TABS: ITINERARY, TRANSFERS, STAY, FOOD, INCLUSIONS, POLICIES */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Holiday Plan, Accommodations & Policies
                  </h2>
                  <p className="text-xs text-slate-500">
                    Everything included in this package: Day-by-day plan, transfers, resort stay & dining
                  </p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-100 scrollbar-none">
                {[
                  { id: 'itinerary', label: '📅 Day-Wise Plan', count: `${holiday.itinerary.length} Days` },
                  { id: 'transfers', label: '🚗 Transfers', count: 'Private AC' },
                  { id: 'stay', label: '🏨 Stay & Resort', count: holiday.hotelCategory },
                  { id: 'food', label: '🍽️ Food & Meals', count: 'Included' },
                  { id: 'inclusions', label: '✅ Inclusions & Exclusions', count: '' },
                  { id: 'policies', label: '🛡️ Policies & Cancellation', count: '100% Refundable' },
                ].map((tab) => {
                  const active = activeDetailTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveDetailTab(tab.id as any)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            active ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: DAY-WISE ITINERARY PLAN */}
              {activeDetailTab === 'itinerary' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/60 border border-blue-200/80 rounded-2xl p-3.5">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-extrabold text-blue-950">
                        Day-Wise Detailed Itinerary ({holiday.durationLabel})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const allOpen = holiday.itinerary.reduce((acc, _, i) => ({ ...acc, [i + 1]: true }), {});
                          setExpandedDayAccordions(allOpen);
                        }}
                        className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        Expand All
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => setExpandedDayAccordions({})}
                        className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>

                  {/* Days Timeline Accordions */}
                  <div className="space-y-4">
                    {holiday.itinerary.map((day) => {
                      const isExpanded = expandedDayAccordions[day.dayNumber];
                      return (
                        <div
                          key={day.dayNumber}
                          className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs transition-all"
                        >
                          {/* Accordion Header */}
                          <button
                            type="button"
                            onClick={() => toggleDayAccordion(day.dayNumber)}
                            className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50/70 transition-colors cursor-pointer text-left gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-16 py-1 text-center rounded-lg bg-blue-600 text-white font-mono font-black text-xs shrink-0 shadow-2xs">
                                {day.dayLabel}
                              </span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                                  {day.title}
                                </h4>
                                {day.subtitle && (
                                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                    {day.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {/* Quick tags */}
                              <div className="hidden sm:flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                                  <Car className="w-3 h-3 text-blue-600" />
                                  <span>Transfer</span>
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                                  <Hotel className="w-3 h-3 text-amber-600" />
                                  <span>Stay</span>
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                                  <Utensils className="w-3 h-3 text-purple-600" />
                                  <span>Food</span>
                                </span>
                              </div>

                              <div
                                className={`w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center transition-transform ${
                                  isExpanded ? 'rotate-180 bg-blue-50 text-blue-600' : ''
                                }`}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </button>

                          {/* Accordion Body */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 bg-slate-50/60 border-t border-slate-100 space-y-4 text-xs">
                              {/* Narrative Description */}
                              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                                {day.description}
                              </p>

                              {/* Day Breakdown Cards: Transfers, Stay, Food */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                {/* 1. Transfers card */}
                                <div className="p-3.5 rounded-xl bg-white border border-blue-200/80 space-y-1.5 shadow-2xs">
                                  <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase tracking-wider text-[10px]">
                                    <Car className="w-3.5 h-3.5" />
                                    <span>Transfers</span>
                                  </div>
                                  <div className="font-extrabold text-slate-900 text-xs">
                                    {day.transfers.title}
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-snug">
                                    {day.transfers.description}
                                  </p>
                                </div>

                                {/* 2. Stay card */}
                                <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 space-y-1.5 shadow-2xs">
                                  <div className="flex items-center gap-1.5 text-amber-700 font-bold uppercase tracking-wider text-[10px]">
                                    <Hotel className="w-3.5 h-3.5" />
                                    <span>Stay & Accommodation</span>
                                  </div>
                                  <div className="font-extrabold text-slate-900 text-xs">
                                    {day.stay.hotelName}
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-snug">
                                    {day.stay.roomType} · {day.stay.starCategory}
                                  </p>
                                </div>

                                {/* 3. Food card */}
                                <div className="p-3.5 rounded-xl bg-white border border-purple-200/80 space-y-1.5 shadow-2xs">
                                  <div className="flex items-center gap-1.5 text-purple-700 font-bold uppercase tracking-wider text-[10px]">
                                    <Utensils className="w-3.5 h-3.5" />
                                    <span>Food & Meal Plan</span>
                                  </div>
                                  <div className="font-extrabold text-slate-900 text-xs">
                                    {day.food.mealPlan}
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-snug">
                                    {day.food.description}
                                  </p>
                                </div>
                              </div>

                              {/* Daily Key Activities */}
                              {day.activities && day.activities.length > 0 && (
                                <div className="pt-3 border-t border-slate-200/80">
                                  <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wide block mb-2">
                                    Scheduled Day Activities:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {day.activities.map((act, aIdx) => (
                                      <span
                                        key={aIdx}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 text-[11px] font-semibold"
                                      >
                                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                                        <span>{act}</span>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: TRANSFERS DETAILS */}
              {activeDetailTab === 'transfers' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-3">
                    <Car className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm text-blue-950">
                        100% Private Air-Conditioned Vehicle Guarantee
                      </h4>
                      <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                        No shared buses or waiting for stranger groups. You get a dedicated, sanitized AC vehicle with a verified chauffeur throughout your vacation.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {holiday.transfersOverview.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          {item.icon === 'Ship' ? (
                            <Ship className="w-4 h-4" />
                          ) : (
                            <Car className="w-4 h-4" />
                          )}
                        </div>
                        <h5 className="font-extrabold text-xs text-slate-900">{item.title}</h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {holiday.flightsIncluded && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 mt-3">
                      <Plane className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-extrabold text-xs text-emerald-950">
                          Return Airline Tickets Included (Economy Class)
                        </h5>
                        <p className="text-[11px] text-emerald-900 mt-0.5 leading-relaxed">
                          Includes 15kg check-in baggage + 7kg cabin baggage per passenger. Flight schedule and boarding pass web check-in handled by TripYehh travel desk.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: STAY DETAILS */}
              {activeDetailTab === 'stay' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">
                          {holiday.stayOverview.starRating}★ PREMIER
                        </span>
                        <span className="text-xs text-slate-500">{holiday.stayOverview.location}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">
                        {holiday.stayOverview.hotelName}
                      </h4>
                      <p className="text-xs text-blue-700 font-bold">
                        {holiday.stayOverview.roomType}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shrink-0">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Check-In</div>
                        <div className="text-xs font-mono font-extrabold text-slate-900">
                          {holiday.stayOverview.checkIn}
                        </div>
                      </div>
                      <div className="text-slate-300">|</div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Check-Out</div>
                        <div className="text-xs font-mono font-extrabold text-slate-900">
                          {holiday.stayOverview.checkOut}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resort Amenities */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3">
                    <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">
                      Resort Features & Perks:
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {holiday.stayOverview.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                      {holiday.stayOverview.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{perk}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FOOD DETAILS */}
              {activeDetailTab === 'food' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex items-start gap-3">
                    <Utensils className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-purple-950">
                          {holiday.foodOverview.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-600 text-white">
                          {holiday.foodOverview.badge}
                        </span>
                      </div>
                      <p className="text-xs text-purple-900 mt-1 leading-relaxed">
                        {holiday.foodOverview.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3">
                    <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">
                      Dining Inclusions Breakdown:
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {holiday.foodOverview.mealItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 5: INCLUSIONS & EXCLUSIONS */}
              {activeDetailTab === 'inclusions' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Inclusions */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs uppercase tracking-wide">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>What's Included in this Holiday</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {holiday.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-rose-950 font-extrabold text-xs uppercase tracking-wide">
                      <X className="w-4 h-4 text-rose-600 stroke-[3]" />
                      <span>What's Not Included</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {holiday.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 6: POLICIES & CANCELLATION */}
              {activeDetailTab === 'policies' && (
                <div className="space-y-4">
                  {/* 100% Refundable Policy Card */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>TripYehh 100% Refundable Guarantee</span>
                    </div>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      Enjoy complete peace of mind. Cancel your holiday package up to 7 days before departure for an instant 100% full refund with zero cancellation fee.
                    </p>
                  </div>

                  {/* Slab Table */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 p-3 text-xs font-bold text-slate-700 grid grid-cols-3">
                      <span>Timeframe</span>
                      <span>Refund Value</span>
                      <span>Policy Note</span>
                    </div>
                    {holiday.cancellationPolicy.terms.map((term, i) => (
                      <div
                        key={i}
                        className="p-3 text-xs border-t border-slate-200/80 grid grid-cols-3 items-center bg-white"
                      >
                        <span className="font-extrabold text-slate-900">{term.timeframe}</span>
                        <span className="font-bold text-emerald-700">{term.refund}</span>
                        <span className="text-slate-500 text-[11px]">{term.note}</span>
                      </div>
                    ))}
                  </div>

                  {/* Important Guidelines */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                      Important Travel Guidelines:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {holiday.importantPolicies.map((pol, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{pol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 5. ADD TRAVELLER DETAILS */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Add Traveller Details
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enter details for guests traveling on this holiday package
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                  Total Guests: <span className="font-extrabold text-blue-600">{adults + children}</span>
                </div>
              </div>

              {/* Traveller 1 Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                      Traveller 1
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="Enter Full Name"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-hidden transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={travelerEmail}
                      onChange={(e) => setTravelerEmail(e.target.value)}
                      placeholder="Enter Email ID"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-hidden transition-all"
                    />
                  </div>

                  {/* Mobile Number with country selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="flex items-center gap-2 relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer shrink-0"
                      >
                        <span className="text-base">{selectedCountryObj.flag}</span>
                        <span>{selectedCountryObj.code}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <input
                        type="tel"
                        value={travelerPhone}
                        onChange={(e) => setTravelerPhone(e.target.value)}
                        placeholder="Enter Mobile Number"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-hidden transition-all"
                      />

                      {showCountryDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowCountryDropdown(false)}
                          />
                          <div className="absolute top-full left-0 mt-1.5 z-50 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 space-y-2 animate-in fade-in zoom-in-95">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                              <input
                                type="text"
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                placeholder="Search country or code..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:bg-white focus:border-blue-600 focus:outline-hidden"
                                autoFocus
                              />
                            </div>

                            <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1 text-slate-800">
                              {filteredCountryCodes.map((item) => {
                                const isCurrent = item.code === countryCode;
                                return (
                                  <button
                                    key={item.code + item.country}
                                    type="button"
                                    onClick={() => {
                                      setCountryCode(item.code);
                                      setShowCountryDropdown(false);
                                      setCountrySearchQuery('');
                                    }}
                                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                                      isCurrent
                                        ? 'bg-blue-50 text-blue-700 font-bold'
                                        : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <span className="text-base shrink-0">{item.flag}</span>
                                      <span className="truncate">{item.country}</span>
                                    </div>
                                    <span className="font-mono text-slate-500 font-bold ml-2 shrink-0">
                                      {item.code}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Travellers List */}
              {additionalTravellers.map((tr, index) => (
                <div
                  key={tr.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 mb-3 space-y-3 relative shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center">
                        {index + 2}
                      </span>
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                        Traveller {index + 2} Details
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px] font-bold">
                        {(['Male', 'Female'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleUpdateTraveller(tr.id, 'gender', g)}
                            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                              tr.gender === g
                                ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveTraveller(tr.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove traveller"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={tr.name}
                        onChange={(e) => handleUpdateTraveller(tr.id, 'name', e.target.value)}
                        placeholder="Enter Full Name"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:bg-white focus:border-blue-600 focus:outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category / Age Group
                      </label>
                      <select
                        value={tr.type}
                        onChange={(e) => handleUpdateTraveller(tr.id, 'type', e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                      >
                        <option value="Adult">Adult (Age 12+)</option>
                        <option value="Child">Child (Age 3-11)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Traveller Button (Single +) */}
              <button
                type="button"
                onClick={handleAddTraveller}
                className="w-full sm:w-auto mt-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Traveller</span>
              </button>
            </section>

            {/* 6. PAN DETAILS (Mandatory as per RBI) */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs tracking-wider border border-blue-200/80">
                  PAN
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    PAN Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    As per RBI, PAN Details are mandatory for this booking
                  </p>
                </div>
              </div>

              <div className="max-w-md">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  PAN Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ENTER PAN HERE"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-slate-900 uppercase focus:bg-white focus:border-blue-600 focus:outline-hidden transition-all"
                  />

                  {panNumber.length === 10 && (
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[11px] font-bold">
                      {isValidPan(panNumber) ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Valid PAN</span>
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>Invalid Format</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Format: 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F). Your details are stored securely.
                </p>
              </div>
            </section>
          </div>

          {/* =========================================================
              RIGHT COLUMN: STICKY BOOKING SUMMARY (Side-by-side with images at top)
          ========================================================== */}
          <div className="lg:col-span-4 sticky top-20 z-20 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-lg space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Booking Summary
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Best Price
                </span>
              </div>

              {/* Package Header Pill */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                  <SafeImage
                    src={holiday.heroImage}
                    alt={holiday.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-900 truncate">
                    {holiday.title}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>{holiday.destination} · {holiday.durationLabel}</span>
                  </div>
                </div>
              </div>

              {/* Date & Rooms Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Departure Date */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Departure Date
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-left hover:bg-white hover:border-blue-500 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="truncate">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {formatDisplayDate(departureDate)}
                      </div>
                    </div>
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                  </button>

                  {showCalendar && (
                    <div className="absolute top-full left-0 mt-1 z-50 shadow-2xl">
                      <NormalCalendarDropdown
                        selectedDate={departureDate}
                        minDate="2026-10-15"
                        onSelectDate={(iso) => {
                          setDepartureDate(iso);
                          setShowCalendar(false);
                        }}
                        onClose={() => setShowCalendar(false)}
                      />
                    </div>
                  )}
                </div>

                {/* Rooms Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Rooms
                  </label>
                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <button
                      type="button"
                      disabled={roomsCount <= 1}
                      onClick={() => setRoomsCount((prev) => Math.max(1, prev - 1))}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs font-mono">{roomsCount} Room{roomsCount > 1 ? 's' : ''}</span>
                    <button
                      type="button"
                      onClick={() => setRoomsCount((prev) => Math.min(5, prev + 1))}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Guests Counter */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Adults */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Adults (12+)</div>
                    <div className="text-[10px] text-slate-500">{formatPrice(adultBasePrice, currency)}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-xs w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Children</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{formatPrice(childPrice, currency)}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-xs w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren((prev) => Math.min(8, prev + 1))}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              <div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (Optional)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-all shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="mt-1.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedPromo.code} Applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>
                    Adult ({adults} × {formatPrice(adultBasePrice, currency)})
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatPrice(adultSubtotal, currency)}
                  </span>
                </div>

                {children > 0 && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Child ({children} × {formatPrice(childPrice, currency)})
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatPrice(childSubtotal, currency)}
                    </span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Promo Discount ({appliedPromo?.code})</span>
                    <span className="font-mono">-{formatPrice(promoDiscount, currency)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>GST & Service Charge (5%)</span>
                  <span className="font-mono">{formatPrice(taxesAndFees, currency)}</span>
                </div>

                {/* Final Total */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Payable</div>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      {formatPrice(finalTotalInr, currency)}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium">
                    All Taxes Included
                  </span>
                </div>
              </div>

              {/* Confirm & Book Action */}
              <button
                type="button"
                onClick={handleConfirmAndPay}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-black text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all mt-1"
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Pay {formatPrice(finalTotalInr, currency)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX FULLSCREEN IMAGE MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in">
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
            <div>
              <div className="font-bold text-sm sm:text-base">{holiday.title}</div>
              <div className="text-xs text-slate-300">
                Photo {activeImageIndex + 1} of {holiday.galleryImages.length}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-5xl mx-auto flex-1 flex items-center justify-center p-4">
            <SafeImage
              src={holiday.galleryImages[activeImageIndex] || holiday.heroImage}
              alt="Holiday Preview"
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          {/* Lightbox Thumbnails */}
          <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-2">
            {holiday.galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer ${
                  activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-50'
                }`}
              >
                <SafeImage src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && confirmedBookingData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Holiday Booking Confirmed!
              </h3>
              <p className="text-xs text-slate-500">
                Booking Reference: <span className="font-mono font-bold text-blue-600">{confirmedBookingData.bookingReference}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Package:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">{confirmedBookingData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Departure:</span>
                <span className="font-bold text-slate-900">{formatDisplayDate(departureDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-mono font-bold text-emerald-700">{formatPrice(finalTotalInr, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Voucher Sent To:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">{travelerEmail}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onNavigateTrips) onNavigateTrips();
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
              >
                View in My Trips
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
