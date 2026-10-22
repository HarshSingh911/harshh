import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  Info,
  Ticket,
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
} from 'lucide-react';
import {
  BookedTrip,
  CurrencyCode,
  ExperienceItem,
  formatPrice,
  TicketTier,
} from '../data/travelData';
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

export interface AttractionCheckoutPageProps {
  experience: ExperienceItem;
  currency: CurrencyCode;
  selectedDate: string;
  onBack: () => void;
  onCompleteBooking: (bookedTrip: BookedTrip) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onNavigateTrips?: () => void;
}

// Expanded attraction entry time slots covering full operating day
const DEFAULT_ATTRACTION_TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '01:00 PM',
  '01:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
  '06:30 PM',
  '07:30 PM',
  '08:00 PM',
];

// Curated additional gallery images per category
const CATEGORY_GALLERIES: Record<string, string[]> = {
  'theme-park': [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  ],
  'water-park': [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80',
  ],
  adventure: [
    'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  ],
  landmark: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  ],
  culture: [
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  ],
};

export const AttractionCheckoutPage: React.FC<AttractionCheckoutPageProps> = ({
  experience,
  currency,
  selectedDate: initialDate,
  onBack,
  onCompleteBooking,
  onNotify,
  onNavigateTrips,
}) => {
  // Activity / Ticket Selection State
  const [selectedTier, setSelectedTier] = useState<TicketTier>(
    experience.ticketTiers[0] || {
      id: 'tier-std',
      name: 'Standard 1-Day Pass',
      description: 'Full day general admission with unlimited access.',
      priceInr: experience.startingPriceInr,
    }
  );
  const [visitDate, setVisitDate] = useState<string>(initialDate || '2026-10-24');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  // Expanded available slots combining experience slots and timetable
  const allTimeSlots = useMemo(() => {
    return Array.from(new Set([...(experience.timeSlots || []), ...DEFAULT_ATTRACTION_TIME_SLOTS]));
  }, [experience.timeSlots]);

  const [selectedSlot, setSelectedSlot] = useState<string>(
    experience.timeSlots[0] || '10:00 AM'
  );
  const [slotCategoryFilter, setSlotCategoryFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  const filteredSlots = useMemo(() => {
    if (slotCategoryFilter === 'morning') {
      return allTimeSlots.filter((s) => s.includes('AM') || s.startsWith('09:') || s.startsWith('10:') || s.startsWith('11:'));
    }
    if (slotCategoryFilter === 'afternoon') {
      return allTimeSlots.filter((s) => (s.includes('PM') && !s.startsWith('05:') && !s.startsWith('06:') && !s.startsWith('07:') && !s.startsWith('08:')) || s.startsWith('12:'));
    }
    if (slotCategoryFilter === 'evening') {
      return allTimeSlots.filter((s) => s.includes('PM') && (s.startsWith('05:') || s.startsWith('06:') || s.startsWith('07:') || s.startsWith('08:')));
    }
    return allTimeSlots;
  }, [allTimeSlots, slotCategoryFilter]);

  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  // Gallery Active Image
  const galleryImages = [
    experience.image,
    experience.fallbackImage,
    ...(CATEGORY_GALLERIES[experience.category] || CATEGORY_GALLERIES['theme-park']),
  ].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Information Active Tab (without voucher preview)
  const [activeInfoTab, setActiveInfoTab] = useState<
    'overview' | 'inclusions' | 'guidelines' | 'timings' | 'cancellation'
  >('overview');

  // Traveler Details Form State (empty on start as requested)
  const [travelerName, setTravelerName] = useState<string>('');
  const [travelerEmail, setTravelerEmail] = useState<string>('');
  const [travelerPhone, setTravelerPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');

  const selectedCountryObj = useMemo(() => {
    return (
      COUNTRY_DIAL_CODES.find((c) => c.code === countryCode) || {
        code: '+91',
        country: 'India',
        flag: '🇮🇳',
        sample: '98765 43210',
      }
    );
  }, [countryCode]);

  const filteredCountryCodes = useMemo(() => {
    if (!countrySearchQuery.trim()) return COUNTRY_DIAL_CODES;
    const q = countrySearchQuery.toLowerCase().trim();
    return COUNTRY_DIAL_CODES.filter(
      (c) => c.country.toLowerCase().includes(q) || c.code.includes(q)
    );
  }, [countrySearchQuery]);

  // Additional Travellers State
  const [additionalTravellers, setAdditionalTravellers] = useState<
    Array<{
      id: string;
      name: string;
      gender: 'Male' | 'Female' | 'Other';
      type: 'Adult' | 'Child';
    }>
  >([]);

  const handleAddTraveller = () => {
    const nextIndex = additionalTravellers.length + 2;
    const isChild = nextIndex > adults && children > 0;
    const newTraveller = {
      id: `tr-${Date.now()}-${Math.random()}`,
      name: '',
      gender: 'Male' as const,
      type: isChild ? ('Child' as const) : ('Adult' as const),
    };
    setAdditionalTravellers((prev) => [...prev, newTraveller]);
  };

  const handleRemoveTraveller = (id: string) => {
    setAdditionalTravellers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTraveller = (
    id: string,
    field: 'name' | 'gender' | 'type',
    value: string
  ) => {
    setAdditionalTravellers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  // PAN State
  const [panNumber, setPanNumber] = useState<string>('');

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent?: number;
    flatDiscount?: number;
    description: string;
  } | null>({
    code: 'PARKPASS15',
    discountPercent: 15,
    description: '15% Off Attraction & Theme Park Special',
  });

  // Success Confirmation Modal State
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingRef: string;
    qrCodeString: string;
    totalPaid: number;
    visitDate: string;
    slot: string;
    tierName: string;
  } | null>(null);

  // Date formatter
  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return 'Select Date';
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch {}
    return dStr;
  };

  // Pricing calculations
  const adultSubtotal = selectedTier.priceInr * adults;
  const childPrice = Math.round(selectedTier.priceInr * 0.75); // 25% child discount
  const childSubtotal = childPrice * children;
  const rawSubtotal = adultSubtotal + childSubtotal;

  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      promoDiscount = Math.round((rawSubtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.flatDiscount) {
      promoDiscount = appliedPromo.flatDiscount;
    }
  }

  const taxesAndFees = Math.round((rawSubtotal - promoDiscount) * 0.05); // 5% tourism fee & tax
  const finalTotalInr = Math.max(0, rawSubtotal - promoDiscount + taxesAndFees);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (!code) return;

    if (code === 'PARKPASS15') {
      setAppliedPromo({
        code: 'PARKPASS15',
        discountPercent: 15,
        description: '15% Off Theme Park & Activity Pass',
      });
      onNotify('Promo Applied!', '15% discount has been applied to your tickets.', 'success');
    } else if (code === 'TRIPYEHH') {
      setAppliedPromo({
        code: 'TRIPYEHH',
        flatDiscount: 600,
        description: 'Flat ₹600 Instant Saving on Experiences',
      });
      onNotify('Promo Applied!', '₹600 discount has been applied.', 'success');
    } else if (code === 'EARLYBIRD') {
      setAppliedPromo({
        code: 'EARLYBIRD',
        discountPercent: 10,
        description: '10% Early Bird Online Booking Bonus',
      });
      onNotify('Promo Applied!', '10% discount has been applied.', 'success');
    } else {
      onNotify('Invalid Code', 'Please enter a valid coupon code like PARKPASS15 or TRIPYEHH', 'info');
    }
    setPromoCode('');
  };

  const handleConfirmAndPay = () => {
    if (!travelerName.trim()) {
      onNotify('Name Required', 'Please enter lead traveler full name.', 'info');
      return;
    }
    if (!travelerEmail.trim()) {
      onNotify('Email Required', 'Please enter email address.', 'info');
      return;
    }
    if (!travelerPhone.trim()) {
      onNotify('Phone Required', 'Please enter contact mobile number.', 'info');
      return;
    }
    if (!panNumber.trim()) {
      onNotify('PAN Required', 'As per RBI, PAN Details are mandatory for this booking.', 'info');
      return;
    }

    const randomBookingRef = `TY-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const guestLabel = `${adults} Adult${adults > 1 ? 's' : ''}${
      children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''
    }`;

    const passengersList = [
      { name: travelerName.trim(), age: 30, gender: 'Adult', seatOrBerth: `Barcode: ${randomBookingRef}-01` },
      ...additionalTravellers.filter((t) => t.name.trim()).map((t, idx) => ({
        name: t.name.trim(),
        age: t.type === 'Child' ? 8 : 28,
        gender: t.gender,
        seatOrBerth: `Barcode: ${randomBookingRef}-0${idx + 2}`,
      })),
    ];

    const newTrip: BookedTrip = {
      bookingId: randomBookingRef,
      bookingReference: randomBookingRef,
      category: 'experiences',
      title: `${experience.title} (${selectedTier.name})`,
      routeSummary: `${experience.city}, ${experience.country} · Official Turnstile Pass`,
      dateSummary: `${formatDisplayDate(visitDate)} @ ${selectedSlot}`,
      travellers: adults + children,
      cabinOrRoom: `${selectedTier.name} · ${guestLabel}`,
      totalPaidInr: finalTotalInr,
      promoApplied: appliedPromo?.code,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: new Date().toISOString().split('T')[0],
      departureDate: visitDate,
      passengers: passengersList,
      carrierOrHotel: `${experience.title} Official Gate Entry`,
      pnr: randomBookingRef,
      paymentMode: 'Online Payment (Verified E-Ticket)',
      hotelCheckInTime: selectedSlot,
    };

    // Save to App-level state
    onCompleteBooking(newTrip);

    // Trigger local confirmation modal
    setConfirmedBooking({
      bookingRef: randomBookingRef,
      qrCodeString: `https://tripyehh.com/verify/${randomBookingRef}`,
      totalPaid: finalTotalInr,
      visitDate: visitDate,
      slot: selectedSlot,
      tierName: selectedTier.name,
    });

    onNotify(
      'Tickets Confirmed!',
      `Official Turnstile E-Ticket generated for ${experience.title}. Ref: ${randomBookingRef}`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>Back to Attractions Search</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* 2-COLUMN MAIN CONTENT: (LEFT: IMAGES, HIGHLIGHTS, ACTIVITY OPTIONS, INFO, DETAILS / RIGHT: BOOKING SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ===================================================================
              LEFT SECTION: IMAGES, HIGHLIGHTS, ACTIVITY OPTIONS & INFO
          =================================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. ATTRACTION HERO & GALLERY SHOWCASE WITH TITLE UNDER IMAGES */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 group">
                <SafeImage
                  src={galleryImages[activeImageIndex]}
                  alt={experience.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />

                {/* View Full Photo Arrow/Maximize Button */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  title="View Full Photo"
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white shadow-md flex items-center justify-center transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails Gallery Strip */}
              <div className="grid grid-cols-4 gap-2.5">
                {galleryImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer group ${
                      activeImageIndex === idx
                        ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {activeImageIndex === idx && (
                      <div className="absolute inset-0 bg-indigo-600/15 flex items-center justify-center">
                        <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                          Active
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Attraction Title placed directly underneath images */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {experience.city}, {experience.country}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500 uppercase tracking-wider text-[11px]">
                    {experience.categoryLabel}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                  {experience.title}
                </h1>
              </div>
            </div>

            {/* 2. ATTRACTION HIGHLIGHTS */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">
                    Attraction Highlights & Features
                  </h2>
                  <p className="text-xs text-slate-500">
                    Why thousands of travelers book this experience with TripYehh
                  </p>
                </div>
              </div>

              {/* Highlights Bullet Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {experience.inclusions.map((highlight, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 leading-snug">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. ACTIVITY OPTIONS (TICKET TIERS, DATE, SLOTS & GUESTS) */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 font-display">
                      Select Activity Options & Passes
                    </h2>
                    <p className="text-xs text-slate-500">
                      Choose your ticket tier, visit date, entry time slot and guests
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {experience.ticketTiers.length} Options Available
                </span>
              </div>

              {/* Step A: Choose Ticket Tier */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Step 1: Choose Ticket Option
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {experience.ticketTiers.map((tier) => {
                    const isSelected = selectedTier.id === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                                  {tier.name}
                                </h3>
                                {tier.badge && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-2xs">
                                    {tier.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                {tier.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4 shrink-0">
                            <div className="text-xs text-slate-400">Starting from</div>
                            <div className="text-lg font-black text-slate-900 font-mono">
                              {formatPrice(tier.priceInr, currency)}
                            </div>
                            <div className="text-[10px] text-slate-500">per person</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step B: Date & Time Slot Grid */}
              <div className="space-y-5 mb-6 pt-5 border-t border-slate-100">
                {/* Visit Date */}
                <div className="relative">
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    Step 2: Visit Date
                  </label>
                  <div className="max-w-md">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-500 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {formatDisplayDate(visitDate)}
                          </div>
                          <div className="text-[10px] text-slate-500">Click to change date</div>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {showCalendar && (
                      <div className="absolute top-full left-0 mt-2 z-50 shadow-2xl">
                        <NormalCalendarDropdown
                          selectedDate={visitDate}
                          minDate="2026-10-15"
                          onSelectDate={(iso) => {
                            setVisitDate(iso);
                            setShowCalendar(false);
                          }}
                          onClose={() => setShowCalendar(false)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Entry Time Slot (Expanded with multiple slots) */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Step 3: Entry Time Slot
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Select from {allTimeSlots.length} available entry schedules throughout the day
                      </p>
                    </div>
                    <span className="self-start sm:self-auto text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shrink-0">
                      Selected Slot: {selectedSlot}
                    </span>
                  </div>

                  {/* Period Filter Buttons */}
                  <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: 'all', label: `All Slots (${allTimeSlots.length})` },
                      { id: 'morning', label: '🌅 Morning (09:00 - 11:30 AM)' },
                      { id: 'afternoon', label: '☀️ Afternoon (12:00 - 04:30 PM)' },
                      { id: 'evening', label: '🌙 Evening (05:30 - 08:00 PM)' },
                    ].map((period) => (
                      <button
                        key={period.id}
                        type="button"
                        onClick={() => setSlotCategoryFilter(period.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          slotCategoryFilter === period.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2.5">
                    {filteredSlots.map((slot) => {
                      const isSlot = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
                            isSlot
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isSlot ? 'text-white' : 'text-slate-400'}`} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step C: Guests Counter (+/-) */}
              <div className="pt-5 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Step 4: Select Number of Guests
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Adults */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Adults</div>
                      <div className="text-[11px] text-slate-500">Age 12+</div>
                      <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                        {formatPrice(selectedTier.priceInr, currency)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-full bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-sm font-mono">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                        className="w-7 h-7 rounded-full bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900">Children</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                          25% OFF
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">Age 3 - 11</div>
                      <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
                        {formatPrice(childPrice, currency)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={children <= 0}
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-full bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-sm font-mono">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.min(8, prev + 1))}
                        className="w-7 h-7 rounded-full bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Infants</div>
                      <div className="text-[11px] text-slate-500">Under 3 yrs</div>
                      <div className="text-xs font-bold text-indigo-600 mt-0.5">Free Pass</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={infants <= 0}
                        onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-full bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-sm font-mono">{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants((prev) => Math.min(4, prev + 1))}
                        className="w-7 h-7 rounded-full bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. COMPREHENSIVE INFORMATION TABS */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">
                    Attraction Information & Guidelines
                  </h2>
                  <p className="text-xs text-slate-500">
                    Important details you need before your visit
                  </p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 border-b border-slate-100 scrollbar-none">
                {[
                  { id: 'overview', label: '📖 Overview' },
                  { id: 'inclusions', label: '✅ Inclusions' },
                  { id: 'guidelines', label: '⚠️ Guidelines & Rules' },
                  { id: 'timings', label: '📍 Timings & Location' },
                  { id: 'cancellation', label: '🛡️ Cancellation' },
                ].map((tab) => {
                  const active = activeInfoTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveInfoTab(tab.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Display */}
              <div className="text-xs leading-relaxed text-slate-700">
                {activeInfoTab === 'overview' && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {experience.overview}
                    </p>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-xs">
                        What to Expect During Your Experience
                      </h4>
                      <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                        <li>Direct entry via TripYehh automated turnstile gates.</li>
                        <li>Full access to all zones, rollercoasters, wave pools & shows included with your pass tier.</li>
                        <li>Lockers, cabanas, towel rentals and photography services available on-site.</li>
                        <li>Digital map and show timetable available at park concierge.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'inclusions' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* What's Included */}
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs mb-3">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>What’s Included in this Ticket</span>
                        </div>
                        <ul className="space-y-2">
                          {experience.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* What's Excluded */}
                      <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                        <div className="flex items-center gap-1.5 text-rose-900 font-extrabold text-xs mb-3">
                          <X className="w-4 h-4 text-rose-600 stroke-[3]" />
                          <span>What’s Not Included</span>
                        </div>
                        <ul className="space-y-2 text-slate-700">
                          <li className="flex items-start gap-2">
                            <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>Food and beverages (unless meal combo pass selected)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>Private hotel transfer (unless booked as an add-on)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>Locker and towel rental fees</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'guidelines' && (
                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Dress Code & Safety Protocols</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                        <li>Proper swimwear is mandatory for water slides (no zippers, buttons or cotton shirts).</li>
                        <li>Certain high-speed thrill coasters require a minimum height of 120cm - 140cm.</li>
                        <li>Guests with back/neck ailments or heart conditions are advised to consult on-site safety guides.</li>
                        <li>Outside food and glassware are not permitted inside security screening.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'timings' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">
                            Exact Attraction Location & Address
                          </div>
                          <p className="text-slate-600 mt-1">
                            {experience.locationAddress}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">
                            Standard Operating Hours
                          </div>
                          <p className="text-slate-600 mt-1">
                            Open daily from 10:00 AM to 08:30 PM. Turnstile gates open 30 minutes prior to ride operations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'cancellation' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>TripYehh 100% Refundable Guarantee</span>
                    </div>
                    <p className="text-emerald-900">
                      {experience.cancellationPolicy}
                    </p>
                    <p className="text-emerald-800 text-[11px] pt-1">
                      Plans changed? Simply cancel from your Trips Dashboard up to 24 hours prior to visit date for an instant 100% refund with zero cancellation penalty.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 5. ADD TRAVELLER DETAILS */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 font-display">
                      Add Traveller Details
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enter details for visitors attending the attraction
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                  Total Guests: <span className="font-extrabold text-indigo-600">{adults + children}</span>
                </div>
              </div>

              {/* Primary / Traveller 1 Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden transition-all"
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden transition-all"
                    />
                  </div>

                  {/* Mobile Number with sleek country code selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="flex items-center gap-2 relative">
                      {/* Country code selector button */}
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer shrink-0"
                      >
                        <span className="text-base">{selectedCountryObj.flag}</span>
                        <span>{selectedCountryObj.code}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {/* Phone input */}
                      <input
                        type="tel"
                        value={travelerPhone}
                        onChange={(e) => setTravelerPhone(e.target.value)}
                        placeholder="Enter Mobile Number"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden transition-all"
                      />

                      {/* Searchable and smooth-scroll Country Popover */}
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:bg-white focus:border-indigo-600 focus:outline-hidden"
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
                                        ? 'bg-indigo-50 text-indigo-700 font-bold'
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
                      {/* Gender Selector */}
                      <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px] font-bold">
                        {(['Male', 'Female'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleUpdateTraveller(tr.id, 'gender', g)}
                            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                              tr.gender === g
                                ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>

                      {/* Remove Button */}
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all"
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

              {/* Add Traveller Button */}
              <button
                type="button"
                onClick={handleAddTraveller}
                className="w-full sm:w-auto mt-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Traveller</span>
              </button>
            </section>

            {/* 6. PAN DETAILS */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs tracking-wider border border-indigo-200/80">
                  PAN
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-wider uppercase focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all font-mono"
                  />
                  {panNumber.length === 10 && (
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valid</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  10-digit alphanumeric Permanent Account Number (e.g. ABCDE1234F)
                </p>
              </div>
            </section>
          </div>

          {/* ===================================================================
              RIGHT SECTION: STICKY PRICE BREAKDOWN & BOOKING CARD
          =================================================================== */}
          <div className="lg:col-span-4 sticky top-20 z-20 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-lg space-y-3.5">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
                    Booking Summary
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-extrabold border border-emerald-200">
                    Instant E-Ticket
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm font-display mt-1 leading-snug line-clamp-1" title={experience.title}>
                  {experience.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold mt-1">
                  <Ticket className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedTier.name}</span>
                </div>
              </div>

              {/* Date, Slot & Guests Summary */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-3 gap-2 text-center">
                <div className="border-r border-slate-200/80 pr-1">
                  <div className="text-[10px] text-slate-500 font-medium">Visit Date</div>
                  <div className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                    {formatDisplayDate(visitDate)}
                  </div>
                </div>
                <div className="border-r border-slate-200/80 pr-1">
                  <div className="text-[10px] text-slate-500 font-medium">Entry Slot</div>
                  <div className="text-xs font-extrabold text-indigo-600 truncate mt-0.5">
                    {selectedSlot}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Guests</div>
                  <div className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                    {adults + children} {adults + children === 1 ? 'Guest' : 'Guests'}
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
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:bg-white focus:border-indigo-600 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo()}
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
                    Adult ({adults} × {formatPrice(selectedTier.priceInr, currency)})
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
                  <span>Tourism Tax & Service Fee (5%)</span>
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
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:brightness-105 active:scale-98 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all mt-1"
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
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <SafeImage
              src={galleryImages[activeImageIndex]}
              alt={experience.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* CONFIRMED BOOKING SUCCESS MODAL */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 my-8 animate-in fade-in zoom-in-95 space-y-5">
            {/* Success Header */}
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">
                Attraction Booking Confirmed!
              </h3>
              <p className="text-xs text-slate-500">
                Official turnstile barcode e-ticket delivered to {travelerEmail}
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Official Mobile Pass
                  </span>
                  <div className="font-extrabold text-sm text-white">{experience.title}</div>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {confirmedBooking.bookingRef}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Pass Tier</div>
                  <div className="font-bold text-amber-300">{confirmedBooking.tierName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Visit Date & Slot</div>
                  <div className="font-bold text-slate-200">
                    {formatDisplayDate(confirmedBooking.visitDate)} @ {confirmedBooking.slot}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Visitor(s)</div>
                  <div className="font-bold text-slate-200 truncate">
                    {travelerName || 'Lead Visitor'}
                    {additionalTravellers.filter((t) => t.name.trim()).length > 0 && (
                      <span className="text-amber-300 font-medium text-[11px] block truncate">
                        + {additionalTravellers.filter((t) => t.name.trim()).map((t) => t.name).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Total Paid</div>
                  <div className="font-bold text-emerald-400 font-mono">
                    {formatPrice(confirmedBooking.totalPaid, currency)}
                  </div>
                </div>
              </div>

              {/* Barcode & QR Display */}
              <div className="bg-white rounded-xl p-3 text-slate-900 text-center space-y-1.5">
                <div className="h-10 bg-slate-900 rounded flex items-center justify-center">
                  <span className="text-white font-mono text-[11px] tracking-widest">
                    ||| | ||||| || |||| ||| |||| |
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-600 font-bold">
                  PASS CODE: {confirmedBooking.bookingRef}
                </div>
                <div className="text-[10px] text-slate-400">
                  Present this digital barcode directly at entry gate scanner
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmedBooking(null);
                  if (onNavigateTrips) {
                    onNavigateTrips();
                  } else {
                    onBack();
                  }
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
              >
                View in My Trips Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedBooking(null);
                  onBack();
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
              >
                Book More Attractions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
