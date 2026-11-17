import React, { useState, useMemo } from 'react';
import {
  Building2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Star,
  Check,
  Clock,
  MapPin,
  Utensils,
  Wifi,
  Coffee,
  X,
  Share2,
  ArrowRight,
  Info,
  Calendar,
  Users,
  Printer,
  FileText,
} from 'lucide-react';
import { BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';

interface HotelBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
}

export type HotelMealOptionId = 'room-only' | 'breakfast-included' | 'half-board' | 'free-cancellation';

interface HotelMealOption {
  id: HotelMealOptionId;
  name: string;
  badge: string;
  priceDelta: number;
  description: string;
}

const HOTEL_MEAL_OPTIONS: HotelMealOption[] = [
  {
    id: 'room-only',
    name: 'Room Only (EP)',
    badge: 'Base Rate',
    priceDelta: 0,
    description: 'Includes air-conditioned room stay, high-speed Wi-Fi, and access to hotel swimming pool & fitness center.',
  },
  {
    id: 'breakfast-included',
    name: 'Free Breakfast Buffet Included (CP)',
    badge: 'Most Popular',
    priceDelta: 550,
    description: 'Complimentary morning international and Indian breakfast buffet served daily at the all-day dining restaurant.',
  },
  {
    id: 'half-board',
    name: 'Breakfast + Dinner Included (MAP)',
    badge: 'Best Value',
    priceDelta: 1250,
    description: 'Includes lavish breakfast buffet plus chef-curated 4-course dinner buffet every evening of your stay.',
  },
  {
    id: 'free-cancellation',
    name: '100% Refundable Flexible Rate',
    badge: 'Zero Risk',
    priceDelta: 300,
    description: 'Free cancellation with 100% full refund up to 24 hours prior to 02:00 PM check-in time.',
  },
];

interface HotelProviderDeal {
  id: string;
  name: string;
  logoBg: string;
  logoText: string;
  rating: number;
  reviewsCount: string;
  perks: string;
  priceDelta: number;
  isCheapest?: boolean;
  isOfficial?: boolean;
}

export const HotelBookingCheckoutPage: React.FC<HotelBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
}) => {
  const hotelName = item.hotelName || item.title || 'Grand Luxury Resort & Spa';
  const location = item.hotelLocation || item.toCity || 'City Center, Near Prime Landmarks';
  const roomType = item.roomType || 'Deluxe King Room (Air Conditioned, City View)';
  const checkInDate = item.travelDate || '15 Oct 2026';
  const checkOutDate = item.returnDate || '18 Oct 2026';
  const guests = Math.max(1, item.travellers || 2);
  const basePrice = Math.max(1200, item.priceInr || 4850);

  // Selected Option
  const [selectedOptionId, setSelectedOptionId] = useState<HotelMealOptionId>('breakfast-included');

  // Redirection modal state for "Go to site"
  const [redirectingProvider, setRedirectingProvider] = useState<HotelProviderDeal | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingPnr, setConfirmedBookingPnr] = useState<string>('');

  const activeOption = useMemo(() => {
    return HOTEL_MEAL_OPTIONS.find((m) => m.id === selectedOptionId) || HOTEL_MEAL_OPTIONS[1];
  }, [selectedOptionId]);

  const activeOptionDelta = activeOption.priceDelta;

  // Comparison Sites / Provider Deals list (Trivago / Google Hotels style)
  const providerDeals: HotelProviderDeal[] = useMemo(() => {
    return [
      {
        id: 'tripyeah-hotels-direct',
        name: 'TripYeah Hotels Direct',
        logoBg: 'bg-blue-600',
        logoText: 'TY',
        rating: 4.9,
        reviewsCount: '24,200+ reviews',
        perks: 'Best Price Guarantee · Instant Voucher · Zero Convenience Fee · Dedicated 24/7 Concierge',
        priceDelta: 0,
        isCheapest: true,
      },
      {
        id: 'booking-com',
        name: 'Booking.com',
        logoBg: 'bg-[#003580]',
        logoText: 'BK',
        rating: 4.8,
        reviewsCount: '65,000+ reviews',
        perks: 'Genius 10% Member Rate · Pay at Hotel Available · Free Cancellation Included',
        priceDelta: 120,
      },
      {
        id: 'agoda',
        name: 'Agoda',
        logoBg: 'bg-[#0b7c7b]',
        logoText: 'AG',
        rating: 4.7,
        reviewsCount: '42,000+ reviews',
        perks: 'Agoda VIP Price · Lowest Rate Match Guarantee · Instant Email Confirmation',
        priceDelta: 80,
      },
      {
        id: 'makemytrip-hotels',
        name: 'MakeMyTrip Hotels',
        logoBg: 'bg-[#ea2330]',
        logoText: 'MMT',
        rating: 4.7,
        reviewsCount: '38,500+ reviews',
        perks: 'MMT Assured Property · Free Room Upgrade if Available · On-Stay Support',
        priceDelta: 160,
      },
      {
        id: 'hotel-official',
        name: `${hotelName.split(' ')[0]} Official Site`,
        logoBg: 'bg-slate-900',
        logoText: hotelName.substring(0, 2).toUpperCase(),
        rating: 4.9,
        reviewsCount: 'Property Direct',
        perks: 'Direct Property Reservation · Early Check-in Priority · Loyalty Points Accrual',
        priceDelta: 190,
        isOfficial: true,
      },
      {
        id: 'expedia',
        name: 'Expedia',
        logoBg: 'bg-[#ffc72c] text-slate-900',
        logoText: 'EXP',
        rating: 4.6,
        reviewsCount: '31,000+ reviews',
        perks: 'Expedia Member Price · Earn OneKey Cash · Zero Cancellation Fee up to 48h',
        priceDelta: 210,
      },
      {
        id: 'hotels-com',
        name: 'Hotels.com',
        logoBg: 'bg-[#d4111e]',
        logoText: 'H.C',
        rating: 4.6,
        reviewsCount: '19,400+ reviews',
        perks: 'Collect OneKey Rewards · Price Match Guarantee · Easy Reschedule Option',
        priceDelta: 240,
      },
      {
        id: 'goibibo-hotels',
        name: 'Goibibo',
        logoBg: 'bg-[#f4511e]',
        logoText: 'GO',
        rating: 4.5,
        reviewsCount: '14,000+ reviews',
        perks: 'GoStays Certified · Express Mobile Check-in Pass · 24/7 Helpline',
        priceDelta: 290,
      },
    ];
  }, [hotelName]);

  const handleSelectSite = (provider: HotelProviderDeal) => {
    setRedirectingProvider(provider);
  };

  const handleFinalizePartnerBooking = (provider: HotelProviderDeal) => {
    const finalFare = basePrice + activeOptionDelta + provider.priceDelta;
    const generatedRef = `TY-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedBookingPnr(generatedRef);

    const bookingRecord: BookedTrip = {
      id: `booking-${Date.now()}`,
      bookingId: generatedRef,
      bookingReference: generatedRef,
      category: 'hotels',
      title: `${hotelName} (${roomType})`,
      routeSummary: `${location}`,
      dateSummary: `${checkInDate} - ${checkOutDate} · ${activeOption.name}`,
      travellers: guests,
      cabinOrRoom: `${roomType} · ${activeOption.name}`,
      totalPaidInr: finalFare,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: 'Just now',
      departureDate: checkInDate,
      returnDate: checkOutDate,
      hotelAddress: location,
      carrierOrHotel: `${hotelName} via ${provider.name}`,
      passengers: [{ name: `Lead Guest (${guests} Pax)`, age: 30, gender: 'Adult' }],
      pnr: generatedRef,
      isDemo: false,
    };

    onConfirmPayment(bookingRecord, 'Verified Guest');
    setBookingConfirmed(true);
    onNotify('Hotel Booking Confirmed!', `Reserved via ${provider.name}. Confirmation Ref: ${generatedRef}`, 'success');
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
            title="Back to hotels"
            aria-label="Back to hotels"
            className="-ml-1.5 mt-0.5 p-1 text-white/90 hover:text-sky-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0 space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight truncate">
              {hotelName}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-white/90">
              <span>
                {guests} Guest{guests > 1 ? 's' : ''}
              </span>
              <span className="text-white/40">·</span>
              <span className="truncate max-w-[260px] sm:max-w-md">{location}</span>
              <span className="text-white/40">·</span>
              <span className="inline-flex items-center gap-1.5 text-sky-100">
                <Calendar className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>
                  {formatDisplayDate(checkInDate)} – {formatDisplayDate(checkOutDate)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        {/* ===================================================================
            SECTION 1: HOTEL SUMMARY CARD
        =================================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-slate-700 font-bold ml-1">5-Star Luxury Stay</span>
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">{hotelName}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{location}</span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Rates from</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                  {formatPrice(basePrice, currency)}
                </div>
                <div className="text-[10px] text-slate-400">per room / night</div>
              </div>
            </div>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Check-in: {formatDisplayDate(checkInDate)}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Check-out: {formatDisplayDate(checkOutDate)}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{guests} Guest{guests > 1 ? 's' : ''} · 1 Room</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                <Wifi className="w-3.5 h-3.5" />
                <span>Free High-Speed Wi-Fi</span>
              </span>
            </div>
          </div>

          {/* Room Details Substrip */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{roomType}</div>
                <div className="text-slate-500">King Bed / Twin Beds · City / Pool View · 42 m² · Ensuite Marble Bathroom</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Complimentary Welcome Drink &amp; Mineral Water</span>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2: MEAL PLAN & FLEXI-RATE OPTIONS (CUSTOMIZATION)
        =================================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Choose Room &amp; Meal Package</h2>
              <p className="text-xs text-slate-500">Pick your preferred meal plan. Partner site rates will automatically recalculate below.</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Live Rate Calculation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {HOTEL_MEAL_OPTIONS.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{opt.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{opt.description}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-baseline justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Rate Difference:</span>
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
            SECTION 3: COMPARISON SITES LIST (SKYSCANNER / TRIVAGO STYLE)
        =================================================================== */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Compare &amp; Book on Top Travel Sites ({providerDeals.length} Providers)
              </h3>
              <p className="text-xs text-slate-500">
                Clicking <span className="font-semibold text-blue-600">Go to site</span> securely opens partner rates with your locked price and room selection.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Sorted by: Best Price First</span>
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
                      className={`w-12 h-12 rounded-2xl ${provider.logoBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {provider.logoText}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{provider.name}</span>
                        {provider.isCheapest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Lowest Price Deal
                          </span>
                        )}
                        {provider.isOfficial && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-300">
                            Official Site
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-amber-500 flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{provider.rating}</span>
                        </span>
                        <span>·</span>
                        <span>{provider.reviewsCount}</span>
                        <span>·</span>
                        <span className="text-slate-600 font-medium">Verified Channel</span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">{provider.perks}</p>
                    </div>
                  </div>

                  {/* Right: Price & CTA Button */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total per Night</div>
                      <div className="text-2xl font-black font-mono text-slate-900">
                        {formatPrice(totalPrice, currency)}
                      </div>
                      <div className="text-[10px] text-slate-500">Taxes &amp; fees included</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectSite(provider)}
                      className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 ${
                        provider.isCheapest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
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
          REDIRECTION & PARTNER HAND-OFF MODAL
      ===================================================================== */}
      {redirectingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-center space-y-5">
            {!bookingConfirmed ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                  <ExternalLink className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    Connecting to {redirectingProvider.name}...
                  </h3>
                  <p className="text-xs text-slate-500">
                    You are being securely directed to partner booking channel with your locked room rate &amp; meal package.
                  </p>
                </div>

                {/* Deal Review Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800">{hotelName}</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      {formatPrice(basePrice + activeOptionDelta + redirectingProvider.priceDelta, currency)}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Room:</span> {roomType}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Package:</span> {activeOption.name}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Stay:</span> {checkInDate} to {checkOutDate} ({guests} Guests)
                  </div>
                </div>

                {/* Simulated Partner Direct Confirmation CTA */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleFinalizePartnerBooking(redirectingProvider)}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Complete Booking on {redirectingProvider.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedirectingProvider(null)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Cancel &amp; Compare Other Sites
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
                  <h3 className="text-2xl font-black text-slate-900">Hotel Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your reservation has been confirmed with {redirectingProvider.name}.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-left space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Confirmation Ref:</span>
                    <span className="font-bold text-emerald-800">{confirmedBookingPnr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Property:</span>
                    <span className="font-bold text-slate-900">{hotelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Check-in:</span>
                    <span className="font-bold text-slate-900">{checkInDate} (02:00 PM)</span>
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
                    <span>View in My Trips &amp; Hotel Voucher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRedirectingProvider(null);
                      onBackToResults();
                    }}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Search More Hotels
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
