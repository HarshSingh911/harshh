import React, { useState, useMemo } from 'react';
import {
  Plane,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Luggage,
  Sparkles,
  Star,
  Clock,
  X,
  ArrowRight,
  Utensils,
  Armchair,
  Wifi,
  Users,
} from 'lucide-react';
import { BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';

interface FlightBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
}

export type BaggageOptionId = 'included' | 'checkin';

interface BaggageChoice {
  id: BaggageOptionId;
  label: string;
  shortDesc: string;
  priceDelta: number;
}

const BAGGAGE_CHOICES: BaggageChoice[] = [
  {
    id: 'included',
    label: 'Included',
    shortDesc: '7 kg Cabin bag included',
    priceDelta: 0,
  },
  {
    id: 'checkin',
    label: 'Check-in (15 kg)',
    shortDesc: '7 kg Cabin + 15 kg Check-in bag',
    priceDelta: 499,
  },
];

interface ProviderDeal {
  id: string;
  name: string;
  logoBg: string;
  logoText: string;
  rating: number;
  reviewsCount: string;
  perks: string;
  priceDelta: number;
  isCheapest?: boolean;
  isOfficialAirline?: boolean;
}

const formatCityHeaderDisplay = (val: string) => {
  const match = val.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
  if (match) {
    return { city: match[1].trim(), code: match[2] };
  }
  return { city: val, code: '' };
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

export const FlightBookingCheckoutPage: React.FC<FlightBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
}) => {
  const outbound = item.outboundFlight;
  const returnFlight = item.returnFlight;
  const isRoundTrip = Boolean(item.isRoundTrip && returnFlight);

  const outboundAirline =
    outbound?.airline ||
    item.airline ||
    (item.title?.includes('IndiGo')
      ? 'IndiGo'
      : item.title?.includes('Akasa')
      ? 'Akasa Air'
      : item.title?.includes('Air India')
      ? 'Air India'
      : item.title?.includes('Vistara')
      ? 'Vistara'
      : 'Commercial Airline');
  const outboundFlightNo = outbound?.flightNo || item.flightNo || item.code || '6E-2134';
  const fromCityRaw = item.fromCity || 'New Delhi (DEL)';
  const toCityRaw = item.toCity || 'Mumbai (BOM)';
  const fromParts = formatCityHeaderDisplay(fromCityRaw);
  const toParts = formatCityHeaderDisplay(toCityRaw);

  const outboundDepTime = outbound?.depTime || item.depTime?.split(' ')[0] || '09:20';
  const outboundArrTime = outbound?.arrTime || item.arrTime?.split(' ')[0] || '11:40';
  const outboundDuration = outbound?.duration || item.duration || '2h 20m';
  const outboundStops = outbound?.stops || 'Direct';

  const travelDate = item.travelDate || '2026-10-15';
  const returnDate = item.returnDate || '2026-10-19';
  const travellers = Math.max(1, item.travellers || 1);
  const cabinClass = item.cabinClass || 'Economy';

  // Compact Baggage Selection: Included (Cabin) or Check-in (15 kg)
  const [selectedBaggageId, setSelectedBaggageId] = useState<BaggageOptionId>('included');
  const activeBaggage = useMemo(
    () => BAGGAGE_CHOICES.find((b) => b.id === selectedBaggageId) || BAGGAGE_CHOICES[0],
    [selectedBaggageId]
  );

  // Redirection modal state for "Go to site"
  const [redirectingProvider, setRedirectingProvider] = useState<ProviderDeal | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingPnr, setConfirmedBookingPnr] = useState<string>('');

  // Per-traveller base price
  const basePassengerPrice = useMemo(() => {
    if (outbound?.priceInr) {
      return outbound.priceInr + (isRoundTrip && returnFlight?.priceInr ? returnFlight.priceInr : 0);
    }
    return Math.max(890, Math.round((item.priceInr || 3850) / travellers));
  }, [outbound, returnFlight, isRoundTrip, item.priceInr, travellers]);

  const baggageDelta = activeBaggage.priceDelta;

  // Available Booking Sites List
  const providerDeals: ProviderDeal[] = useMemo(() => {
    return [
      {
        id: 'tripyeah-direct',
        name: 'TripYeah Official',
        logoBg: 'bg-blue-600',
        logoText: 'TY',
        rating: 4.9,
        reviewsCount: '28,400+ reviews',
        perks: 'Best Price Guarantee · Instant E-Ticket · Zero Convenience Fee',
        priceDelta: 0,
        isCheapest: true,
      },
      {
        id: 'airline-direct',
        name: `${outboundAirline} Official Site`,
        logoBg: 'bg-slate-900',
        logoText: outboundAirline.substring(0, 2).toUpperCase(),
        rating: 4.8,
        reviewsCount: 'Carrier Direct',
        perks: 'Direct Carrier PNR · Free Web Check-in Assist',
        priceDelta: 70,
        isOfficialAirline: true,
      },
      {
        id: 'makemytrip',
        name: 'MakeMyTrip',
        logoBg: 'bg-red-600',
        logoText: 'MMT',
        rating: 4.7,
        reviewsCount: 'Verified Partner',
        perks: 'MMT Assured · Easy Reschedule Option',
        priceDelta: 120,
      },
      {
        id: 'easemytrip',
        name: 'EaseMyTrip',
        logoBg: 'bg-cyan-700',
        logoText: 'EMT',
        rating: 4.6,
        reviewsCount: 'Verified Partner',
        perks: 'Zero Convenience Charges on UPI / NetBanking',
        priceDelta: 160,
      },
      {
        id: 'cleartrip',
        name: 'Cleartrip',
        logoBg: 'bg-orange-600',
        logoText: 'CT',
        rating: 4.6,
        reviewsCount: 'Flipkart Company',
        perks: 'ClearChoice Verified · Fast Cancellation Processing',
        priceDelta: 195,
      },
      {
        id: 'goibibo',
        name: 'Goibibo',
        logoBg: 'bg-indigo-600',
        logoText: 'GIB',
        rating: 4.5,
        reviewsCount: 'Verified Partner',
        perks: 'GoCash Bonus · 24/7 Phone Support',
        priceDelta: 240,
      },
    ];
  }, [outboundAirline]);

  // Handle "Go to site" Click
  const handleGoToSite = (provider: ProviderDeal) => {
    const finalFarePerPerson = basePassengerPrice + baggageDelta + provider.priceDelta;
    const totalFare = finalFarePerPerson * travellers;
    const generatedPnr = `TY-${outboundAirline.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setConfirmedBookingPnr(generatedPnr);
    setRedirectingProvider(provider);
    setBookingConfirmed(false);

    const newBooking: BookedTrip = {
      bookingId: `BK-${Date.now()}`,
      bookingReference: generatedPnr,
      category: 'flights',
      title: `${outboundAirline} ${outboundFlightNo}`,
      routeSummary: `${fromParts.city} → ${toParts.city}`,
      dateSummary: `${formatDisplayDate(travelDate)} · ${activeBaggage.shortDesc}`,
      travellers,
      cabinOrRoom: `${cabinClass} Class · ${provider.name}`,
      totalPaidInr: totalFare,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: 'Just now',
      departureDate: travelDate,
      pnr: generatedPnr,
      carrierOrHotel: `${outboundAirline} via ${provider.name}`,
      flightDepTime: outboundDepTime,
      flightArrTime: outboundArrTime,
      flightDuration: outboundDuration,
      flightCode: outboundFlightNo,
      isDemo: false,
    };

    onConfirmPayment(newBooking, 'Verified Traveler');

    setTimeout(() => {
      setBookingConfirmed(true);
      onNotify?.(
        'Redirecting to Provider',
        `Official airline PNR ${generatedPnr} generated for ${provider.name}. View in My Trips anytime.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-20 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ===================================================================
          1. SEAMLESS OCEAN-NAVY SECOND HEADER
      =================================================================== */}
      <section className="bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] pt-[74px] pb-6 relative shadow-md">
        <div className="w-full px-3 sm:px-5 lg:px-6 flex items-start gap-2.5">
          <button
            type="button"
            onClick={onBackToResults}
            title="Back to flights"
            aria-label="Back to flights"
            className="-ml-1.5 mt-0.5 p-1 text-white/90 hover:text-sky-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0 space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight truncate">
              {toParts.city}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-white/90">
              <span>
                {travellers} Traveller{travellers > 1 ? 's' : ''}
              </span>
              <span className="text-white/40">·</span>
              <span>{cabinClass}</span>
              <span className="text-white/40">·</span>
              <span>{isRoundTrip ? 'Return' : 'One Way'}</span>
              <span className="text-white/40">·</span>
              <span className="inline-flex items-center gap-1.5 text-sky-100">
                <Calendar className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>
                  {formatDisplayDate(travelDate)}
                  {isRoundTrip ? ` – ${formatDisplayDate(returnDate)}` : ''}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. TWO-COLUMN BOOKING LAYOUT:
             LEFT  -> COMPACT BAGGAGE TOGGLE + AVAILABLE BOOKING SITES
             RIGHT -> FULL FLIGHT DETAILS BLOCK
      =================================================================== */}
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDE: AVAILABLE SITES + COMPACT BAGGAGE OPTION */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Compact Baggage Toggle (Included or Check-in) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Luggage className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900">Baggage:</span>
                <span className="text-xs text-slate-500 hidden sm:inline">{activeBaggage.shortDesc}</span>
              </div>

              <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/80">
                {BAGGAGE_CHOICES.map((opt) => {
                  const isSelected = selectedBaggageId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedBaggageId(opt.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className={`text-[11px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {opt.priceDelta === 0 ? 'Free' : `+${formatPrice(opt.priceDelta, currency)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Booking Sites Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Available on {providerDeals.length} Booking Sites
              </h2>
              <span className="text-xs text-slate-500 font-medium">Sorted by lowest total fare</span>
            </div>

            {/* Booking Sites List */}
            <div className="space-y-3">
              {providerDeals.map((deal) => {
                const finalPricePerPerson = basePassengerPrice + baggageDelta + deal.priceDelta;
                const finalTotalPrice = finalPricePerPerson * travellers;

                return (
                  <div
                    key={deal.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      deal.isCheapest
                        ? 'border-emerald-500/80 ring-1 ring-emerald-500/20 bg-gradient-to-r from-emerald-50/20 via-white to-white'
                        : 'border-slate-200/90'
                    }`}
                  >
                    {/* Provider Info */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-[210px]">
                      <div
                        className={`w-11 h-11 rounded-xl ${deal.logoBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {deal.logoText}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-slate-900 leading-tight">{deal.name}</h3>
                          {deal.isCheapest && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-2xs">
                              <Sparkles className="w-2.5 h-2.5 fill-current" />
                              <span>Cheapest</span>
                            </span>
                          )}
                          {deal.isOfficialAirline && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              Carrier Direct
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <span>{deal.rating}</span>
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                          <span>·</span>
                          <span>{deal.reviewsCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Included Perks & Baggage */}
                    <div className="flex-1 md:px-4 text-xs text-slate-600 space-y-1 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Luggage className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{activeBaggage.shortDesc}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">{deal.perks}</p>
                    </div>

                    {/* Price & Go to site CTA */}
                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                          {formatPrice(finalTotalPrice, currency)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Total for {travellers} traveller{travellers > 1 ? 's' : ''} (taxes incl.)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleGoToSite(deal)}
                        className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                          deal.isCheapest
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 hover:shadow-lg'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 hover:shadow-lg'
                        }`}
                      >
                        <span>Go to site</span>
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: COMPLETE FLIGHT DETAILS BLOCK */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
              {/* Block Heading */}
              <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                <div>
                  <h2 className="font-bold text-base text-slate-900">Flight Details</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Complete itinerary, timings & fare inclusions
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200/80">
                  {isRoundTrip ? 'Round Trip' : 'One Way'}
                </span>
              </div>

              {/* Outbound Flight Detail Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Outbound · {formatDisplayDate(travelDate)}
                  </span>
                  <span className="font-semibold text-slate-600">{cabinClass} Class</span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${
                      outbound?.badgeBg || 'bg-blue-600'
                    } text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                  >
                    {outbound?.badgeCode || outboundAirline.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">
                      {outboundAirline} · <span className="font-mono">{outboundFlightNo}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {outbound?.aircraft || 'Airbus A320neo'} · {outboundStops}
                    </div>
                  </div>
                </div>

                {/* Outbound Route Timeline */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-extrabold font-mono text-slate-900 leading-none">
                        {outboundDepTime}
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">{fromCityRaw}</div>
                      <div className="text-[11px] text-slate-500">
                        {outbound?.depTerminal || 'Terminal 1'}
                        {outbound?.depGate ? ` · Gate ${outbound.depGate}` : ''}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-2 pt-1 shrink-0">
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {outboundDuration}
                      </span>
                      <div className="w-16 h-[1.5px] bg-slate-300 my-1.5 relative flex items-center justify-center">
                        <Plane className="w-3 h-3 text-blue-600 bg-slate-50 px-0.5" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">{outboundStops}</span>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-extrabold font-mono text-slate-900 leading-none">
                        {outboundArrTime}
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">{toCityRaw}</div>
                      <div className="text-[11px] text-slate-500">
                        {outbound?.arrTerminal || 'Terminal 2'}
                        {outbound?.arrGate ? ` · Gate ${outbound.arrGate}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Flight Detail Section (if Round Trip) */}
              {isRoundTrip && returnFlight && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Return · {formatDisplayDate(returnDate)}
                    </span>
                    <span className="font-semibold text-slate-600">{cabinClass} Class</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${
                        returnFlight.badgeBg || 'bg-indigo-600'
                      } text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                    >
                      {returnFlight.badgeCode || (returnFlight.airline || outboundAirline).substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {returnFlight.airline || outboundAirline} ·{' '}
                        <span className="font-mono">{returnFlight.flightNo || '6E-2135'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {returnFlight.aircraft || 'Airbus A321neo'} · {returnFlight.stops || 'Direct'}
                      </div>
                    </div>
                  </div>

                  {/* Return Route Timeline */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-extrabold font-mono text-slate-900 leading-none">
                          {returnFlight.depTime}
                        </div>
                        <div className="text-xs font-bold text-slate-800 mt-1">{toCityRaw}</div>
                        <div className="text-[11px] text-slate-500">
                          {returnFlight.depTerminal || 'Terminal 2'}
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-2 pt-1 shrink-0">
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {returnFlight.duration}
                        </span>
                        <div className="w-16 h-[1.5px] bg-slate-300 my-1.5 relative flex items-center justify-center">
                          <Plane className="w-3 h-3 text-indigo-600 bg-slate-50 px-0.5" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {returnFlight.stops || 'Direct'}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-extrabold font-mono text-slate-900 leading-none">
                          {returnFlight.arrTime}
                        </div>
                        <div className="text-xs font-bold text-slate-800 mt-1">{fromCityRaw}</div>
                        <div className="text-[11px] text-slate-500">
                          {returnFlight.arrTerminal || 'Terminal 1'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Baggage, Passengers & In-Flight Specifications */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Journey & Baggage Summary
                </h3>

                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Passengers</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {travellers} Adult{travellers > 1 ? 's' : ''} ({cabinClass})
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Luggage className="w-3.5 h-3.5 text-blue-600" />
                      <span>Cabin Bag</span>
                    </span>
                    <span className="font-bold text-slate-900">7 kg (Included)</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Luggage className="w-3.5 h-3.5 text-blue-600" />
                      <span>Check-in Bag</span>
                    </span>
                    <span
                      className={`font-bold ${
                        selectedBaggageId === 'checkin' ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      {selectedBaggageId === 'checkin' ? '15 kg Selected' : 'Not Included'}
                    </span>
                  </div>

                  {outbound?.amenities?.seatPitch && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Armchair className="w-3.5 h-3.5 text-slate-400" />
                        <span>Seat Pitch</span>
                      </span>
                      <span className="font-semibold text-slate-800">{outbound.amenities.seatPitch}</span>
                    </div>
                  )}

                  {outbound?.amenities?.meal && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Utensils className="w-3.5 h-3.5 text-slate-400" />
                        <span>In-flight Meal</span>
                      </span>
                      <span className="font-semibold text-slate-800">Complimentary Meal</span>
                    </div>
                  )}

                  {outbound?.amenities?.wifi && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Onboard Wi-Fi</span>
                      </span>
                      <span className="font-semibold text-emerald-700">Available</span>
                    </div>
                  )}
                </div>

                {/* Fare & Ticket Guarantee Notes */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant e-ticket &amp; official airline PNR</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>No hidden booking charges on partner sites</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ===================================================================
          3. REDIRECTION & BOOKING CONFIRMATION MODAL
      =================================================================== */}
      {redirectingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-modal-backdrop">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-modal-slide-up space-y-5"
          >
            <button
              type="button"
              onClick={() => setRedirectingProvider(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  TY
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <span className="w-8 h-[2px] bg-slate-300" />
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl ${redirectingProvider.logoBg} text-white font-extrabold flex items-center justify-center text-sm shadow-md`}
                >
                  {redirectingProvider.logoText}
                </div>
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">
                  {bookingConfirmed
                    ? `Connected to ${redirectingProvider.name}!`
                    : `Connecting you to ${redirectingProvider.name}...`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {bookingConfirmed
                    ? 'Your official airline itinerary has been verified and confirmed.'
                    : 'Securing the best guaranteed rate and passing flight specifications...'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <span className="font-bold text-slate-900">
                  {outboundAirline} {outboundFlightNo}
                </span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  PNR: {confirmedBookingPnr}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Route</span>
                  <span className="font-semibold text-slate-800">
                    {fromParts.city} → {toParts.city}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Flight Date</span>
                  <span className="font-semibold text-slate-800">{formatDisplayDate(travelDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Baggage Choice</span>
                  <span className="font-semibold text-emerald-700">{activeBaggage.shortDesc}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Passengers</span>
                  <span className="font-semibold text-slate-800">
                    {travellers} Passenger{travellers > 1 ? 's' : ''} ({cabinClass})
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Locked Fare:</span>
                <span className="text-base font-extrabold font-mono text-slate-900">
                  {formatPrice((basePassengerPrice + baggageDelta + redirectingProvider.priceDelta) * travellers, currency)}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setRedirectingProvider(null);
                  onGoToTrips?.();
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Booking in My Trips</span>
              </button>

              <button
                type="button"
                onClick={() => setRedirectingProvider(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Done / Back to Deals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
