import React, { useState, useMemo } from 'react';
import {
  Car,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Star,
  Check,
  Clock,
  MapPin,
  X,
  ArrowRight,
  Info,
  Calendar,
  Users,
  Luggage,
  Sparkles,
  Zap,
  Phone,
  FileText,
  Printer,
  Navigation,
} from 'lucide-react';
import { BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';

interface CabBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
}

export type CabRideOptionId = 'standard-ac' | 'baggage-assist' | 'ev-green' | 'airport-meet';

interface CabRideOption {
  id: CabRideOptionId;
  name: string;
  badge: string;
  priceDelta: number;
  description: string;
}

const CAB_RIDE_OPTIONS: CabRideOption[] = [
  {
    id: 'standard-ac',
    name: 'Standard AC Cab',
    badge: 'Base Fare',
    priceDelta: 0,
    description: 'Clean air-conditioned cab with verified driver, GPS tracking, and doorstep pickup.',
  },
  {
    id: 'baggage-assist',
    name: 'Chauffeur Baggage Assist',
    badge: 'Extra Comfort',
    priceDelta: 150,
    description: 'Driver helps loading and unloading heavy bags at both pickup and destination.',
  },
  {
    id: 'ev-green',
    name: '100% Electric Green Cab',
    badge: 'Eco Friendly',
    priceDelta: 50,
    description: 'Zero-emission electric vehicle (Tata Nexon EV / Tigor EV) for clean, quiet, sustainable travel.',
  },
  {
    id: 'airport-meet',
    name: 'Terminal Meet & Greet',
    badge: 'VIP Service',
    priceDelta: 250,
    description: 'Chauffeur waits inside airport arrivals hall or hotel lobby with personalized nameboard.',
  },
];

interface CabProviderDeal {
  id: string;
  name: string;
  logoBg: string;
  logoText: string;
  rating: number;
  ridesCount: string;
  vehicleModel: string;
  perks: string;
  priceDelta: number;
  isCheapest?: boolean;
  isRecommended?: boolean;
}

export const CabBookingCheckoutPage: React.FC<CabBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
}) => {
  const cabType = item.cabType || item.title || 'Sedan (Dzire / Etios)';
  const pickupPoint = item.cabPickupPoint || item.fromCity || 'Indira Gandhi International Airport (DEL)';
  const dropPoint = item.cabDropPoint || item.toCity || 'Connaught Place, Central Delhi';
  const travelDate = item.travelDate || '15 Oct 2026';
  const pickupTime = item.pickupTime || item.depTime || '10:00 AM';
  const duration = item.duration || '120 km Included · ~2h 30m';
  const basePrice = Math.max(750, item.priceInr || 1850);

  // Selected Option
  const [selectedOptionId, setSelectedOptionId] = useState<CabRideOptionId>('standard-ac');

  // Redirection modal state for "Go to site"
  const [redirectingProvider, setRedirectingProvider] = useState<CabProviderDeal | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingPnr, setConfirmedBookingPnr] = useState<string>('');
  const [driverOtp, setDriverOtp] = useState<string>('');

  const activeOption = useMemo(() => {
    return CAB_RIDE_OPTIONS.find((o) => o.id === selectedOptionId) || CAB_RIDE_OPTIONS[0];
  }, [selectedOptionId]);

  const activeOptionDelta = activeOption.priceDelta;

  // Comparison Sites / Cab Providers list (Kayak Cabs / Skyscanner style)
  const providerDeals: CabProviderDeal[] = useMemo(() => {
    return [
      {
        id: 'tripyeah-cabs',
        name: 'TripYeah Cabs Direct',
        logoBg: 'bg-blue-600',
        logoText: 'TY',
        rating: 4.9,
        ridesCount: '18,500+ rides',
        vehicleModel: 'Maruti Suzuki Dzire AC',
        perks: 'Cheapest Rate Guarantee · Zero Surge Pricing · Doorstep Pickup · Live GPS Tracking',
        priceDelta: 0,
        isCheapest: true,
      },
      {
        id: 'uber-intercity',
        name: 'Uber Intercity / Premier',
        logoBg: 'bg-black text-white',
        logoText: 'UBER',
        rating: 4.8,
        ridesCount: '85,000+ rides',
        vehicleModel: 'Hyundai Aura / Dzire Prime',
        perks: 'Top-Rated Driver (4.8★+) · Instant Dispatch · Seamless Cashless In-App Trip',
        priceDelta: 90,
        isRecommended: true,
      },
      {
        id: 'ola-outstation',
        name: 'Ola Outstation',
        logoBg: 'bg-[#ffdc00] text-black',
        logoText: 'OLA',
        rating: 4.7,
        ridesCount: '62,000+ rides',
        vehicleModel: 'Toyota Etios / Dzire',
        perks: '15 Mins Free Wait Time · In-cab SOS Safety Assist · Verified Commercial Permit',
        priceDelta: 70,
      },
      {
        id: 'makemytrip-cabs',
        name: 'MakeMyTrip Cabs',
        logoBg: 'bg-[#ea2330]',
        logoText: 'MMT',
        rating: 4.7,
        ridesCount: '45,000+ rides',
        vehicleModel: 'Commercial Sedan AC',
        perks: 'MMT Assured · 100% On-Time Guarantee or ₹500 Cashback · Sanitized Vehicle',
        priceDelta: 120,
      },
      {
        id: 'savaari-rentals',
        name: 'Savaari Car Rentals',
        logoBg: 'bg-[#1b5e20]',
        logoText: 'SAV',
        rating: 4.8,
        ridesCount: '29,000+ rides',
        vehicleModel: 'Executive Sedan / Ertiga',
        perks: 'Experienced Highway Chauffeur · All Toll & State Permits Included in Fare',
        priceDelta: 160,
      },
      {
        id: 'blusmart-mobility',
        name: 'BluSmart EV',
        logoBg: 'bg-[#00b4d8] text-slate-900',
        logoText: 'BLU',
        rating: 4.9,
        ridesCount: '22,000+ rides',
        vehicleModel: 'Tata Tigor / Nexon EV',
        perks: '100% Zero-Emission Electric · Zero Driver Cancellation Guarantee · Clean Interiors',
        priceDelta: 110,
      },
      {
        id: 'meru-cabs',
        name: 'Meru Cabs',
        logoBg: 'bg-[#004b49]',
        logoText: 'MERU',
        rating: 4.5,
        ridesCount: '16,000+ rides',
        vehicleModel: 'Airport Express Sedan',
        perks: 'Express Airport Exit · Punctual Chauffeur · 24/7 Central Operations Helpline',
        priceDelta: 140,
      },
    ];
  }, []);

  const handleSelectSite = (provider: CabProviderDeal) => {
    setRedirectingProvider(provider);
  };

  const handleFinalizePartnerBooking = (provider: CabProviderDeal) => {
    const finalFare = basePrice + activeOptionDelta + provider.priceDelta;
    const generatedRef = `TY-CAB-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBookingPnr(generatedRef);
    setDriverOtp(randomOtp);

    const bookingRecord: BookedTrip = {
      id: `booking-${Date.now()}`,
      bookingId: generatedRef,
      bookingReference: generatedRef,
      category: 'cabs',
      title: `${cabType} (${provider.vehicleModel})`,
      routeSummary: `${pickupPoint} → ${dropPoint}`,
      dateSummary: `${travelDate} · ${pickupTime}`,
      travellers: 1,
      cabinOrRoom: `${cabType} · ${provider.name}`,
      totalPaidInr: finalFare,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: 'Just now',
      departureDate: travelDate,
      carrierOrHotel: `${provider.name} (${provider.vehicleModel})`,
      passengers: [{ name: 'Lead Passenger', age: 30, gender: 'Adult' }],
      pnr: generatedRef,
      isDemo: false,
    };

    onConfirmPayment(bookingRecord, 'Verified Passenger');
    setBookingConfirmed(true);
    onNotify('Cab Booking Confirmed!', `Ride reserved via ${provider.name}. OTP: ${randomOtp}`, 'success');
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        const [y, m, d] = parts;
        const dateObj = new Date(Date.UTC(y, m - 1, d));
        return dateObj.toLocaleDateString('en-US', {
          timeZone: 'UTC',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen text-slate-900 pb-20 font-sans">
      {/* ===================================================================
          1. SEAMLESS OCEAN-NAVY SECOND HEADER (MATCHING FLIGHTS)
      =================================================================== */}
      <section className="bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] pt-[74px] pb-6 relative shadow-md">
        <div className="w-full px-3 sm:px-5 lg:px-6 flex items-start gap-2.5">
          <button
            type="button"
            onClick={onBackToResults}
            title="Back to cabs"
            aria-label="Back to cabs"
            className="-ml-1.5 mt-0.5 p-1 text-white/90 hover:text-sky-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0 space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight truncate">
              {cabType}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-white/90">
              <span className="truncate max-w-[260px] sm:max-w-lg">
                {pickupPoint} → {dropPoint}
              </span>
              <span className="text-white/40">·</span>
              <span>{pickupTime}</span>
              <span className="text-white/40">·</span>
              <span className="inline-flex items-center gap-1.5 text-sky-100">
                <Calendar className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>{formatDisplayDate(travelDate)}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        {/* ===================================================================
            SECTION 1: CAB RIDE SUMMARY CARD
        =================================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-50 text-sky-700 border border-sky-200">
                    AC Doorstep Chauffeur Cab
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">{cabType}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Pickup: {formatDisplayDate(travelDate)} at {pickupTime} · {duration}</span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Fares from</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                  {formatPrice(basePrice, currency)}
                </div>
                <div className="text-[10px] text-slate-400">Includes all taxes &amp; km</div>
              </div>
            </div>

            {/* Route Box with Pickup and Drop */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  A
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Pickup Point</div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{pickupPoint}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  B
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Drop Point</div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{dropPoint}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Perks Strip */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                <span>4 Seats</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Luggage className="w-3.5 h-3.5 text-sky-600" />
                <span>2 Big Bags</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Navigation className="w-3.5 h-3.5 text-sky-600" />
                <span>Live GPS Tracking</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Zero Cancellation Fee up to 1 Hour Before Pickup</span>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2: RIDE OPTIONS & EXTRAS (CUSTOMIZATION)
        =================================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Customize Your Ride Experience</h2>
              <p className="text-xs text-slate-500">Choose extra comforts or green ride. Partner site fares update automatically below.</p>
            </div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
              Live Fare Update
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CAB_RIDE_OPTIONS.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50/40 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{opt.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{opt.description}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-baseline justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Fare Difference:</span>
                    <span className="font-bold text-sm font-mono text-slate-900">
                      {opt.priceDelta === 0 ? 'Included' : `+${formatPrice(opt.priceDelta, currency)}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            SECTION 3: CAB COMPARISON LIST (SKYSCANNER / KAYAK STYLE)
        =================================================================== */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Compare Fares on Verified Cab Sites ({providerDeals.length} Platforms)
              </h3>
              <p className="text-xs text-slate-500">
                Clicking <span className="font-semibold text-sky-600">Go to site</span> directly connects with partner fleet dispatch at locked fare.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Sorted by: Lowest Fare First</span>
          </div>

          <div className="space-y-3">
            {providerDeals.map((provider) => {
              const totalPrice = basePrice + activeOptionDelta + provider.priceDelta;

              return (
                <div
                  key={provider.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    provider.isCheapest
                      ? 'border-emerald-300 ring-1 ring-emerald-400/30'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Left: Provider Brand & Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl ${provider.logoBg} font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {provider.logoText}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{provider.name}</span>
                        {provider.isCheapest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Cheapest Fare
                          </span>
                        )}
                        {provider.isRecommended && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                            Top Rated Chauffeur
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-amber-500 flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{provider.rating}</span>
                        </span>
                        <span>·</span>
                        <span>{provider.ridesCount}</span>
                        <span>·</span>
                        <span className="text-slate-700 font-semibold">{provider.vehicleModel}</span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">{provider.perks}</p>
                    </div>
                  </div>

                  {/* Right: Fare & CTA Button */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Ride Fare</div>
                      <div className="text-2xl font-black font-mono text-slate-900">
                        {formatPrice(totalPrice, currency)}
                      </div>
                      <div className="text-[10px] text-slate-500">Tolls &amp; GST included</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectSite(provider)}
                      className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 ${
                        provider.isCheapest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
                      }`}
                    >
                      <span>Go to site</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* =====================================================================
          REDIRECTION & PARTNER DISPATCH MODAL
      ===================================================================== */}
      {redirectingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-center space-y-5">
            {!bookingConfirmed ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
                  <ExternalLink className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    Connecting to {redirectingProvider.name}...
                  </h3>
                  <p className="text-xs text-slate-500">
                    Routing your ride request to partner dispatch system with guaranteed on-time pickup and locked fare.
                  </p>
                </div>

                {/* Ride Review Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800">{cabType} ({redirectingProvider.vehicleModel})</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      {formatPrice(basePrice + activeOptionDelta + redirectingProvider.priceDelta, currency)}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Pickup:</span> {pickupPoint}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Drop:</span> {dropPoint}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Schedule:</span> {travelDate} at {pickupTime}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Customization:</span> {activeOption.name}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleFinalizePartnerBooking(redirectingProvider)}
                    className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Complete Booking on {redirectingProvider.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedirectingProvider(null)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Cancel &amp; Compare Other Cab Sites
                  </button>
                </div>
              </>
            ) : (
              /* Success Confirmation */
              <div className="space-y-4 py-2 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">Cab Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your ride has been confirmed with {redirectingProvider.name}. Chauffeur assigned.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-left space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Booking Ref:</span>
                    <span className="font-bold text-emerald-800">{confirmedBookingPnr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trip Start OTP:</span>
                    <span className="font-bold text-blue-700 text-sm tracking-wider">{driverOtp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Chauffeur:</span>
                    <span className="font-bold text-slate-900">Rajesh Sharma (4.9★)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle:</span>
                    <span className="font-bold text-slate-900">{redirectingProvider.vehicleModel} (DL-01-AB-4421)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pickup:</span>
                    <span className="font-bold text-slate-900">{travelDate} · {pickupTime}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRedirectingProvider(null);
                      onGoToTrips?.();
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View in My Trips &amp; Track Cab</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRedirectingProvider(null);
                      onBackToResults();
                    }}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Book Another Ride
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
