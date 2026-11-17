import React, { useState, useMemo } from 'react';
import {
  Compass,
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
  Ticket,
  Sparkles,
  QrCode,
  FileText,
  Printer,
  BadgeCheck,
} from 'lucide-react';
import { BookedTrip, CurrencyCode, ExperienceItem, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';

export interface AttractionBookingCheckoutPageProps {
  experience?: ExperienceItem;
  item?: CheckoutItem;
  currency: CurrencyCode;
  selectedDate?: string;
  onBack?: () => void;
  onBackToResults?: () => void;
  onCompleteBooking?: (bookedTrip: BookedTrip) => void;
  onConfirmPayment?: (booking: BookedTrip, leadName: string) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onNavigateTrips?: () => void;
  onGoToTrips?: () => void;
}

export type AttractionTicketOptionId = 'general-admission' | 'skip-line' | 'audio-guide' | 'vip-guided';

interface AttractionTicketOption {
  id: AttractionTicketOptionId;
  name: string;
  badge: string;
  priceDelta: number;
  description: string;
}

const ATTRACTION_TICKET_OPTIONS: AttractionTicketOption[] = [
  {
    id: 'general-admission',
    name: 'General Admission E-Ticket',
    badge: 'Standard Pass',
    priceDelta: 0,
    description: 'Direct smartphone scan access. Includes entry to all main galleries and observation decks.',
  },
  {
    id: 'skip-line',
    name: 'Skip-The-Line Priority Fast Track',
    badge: 'Most Popular',
    priceDelta: 650,
    description: 'Bypass standard public ticket and security entry queues via dedicated express priority turnstiles.',
  },
  {
    id: 'audio-guide',
    name: 'Priority Pass + Official Audio Guide',
    badge: 'Top Pick',
    priceDelta: 950,
    description: 'Includes priority fast-track entry plus multi-language handheld audio guide commentary & venue map.',
  },
  {
    id: 'vip-guided',
    name: 'VIP Small-Group Tour with Historian',
    badge: 'Full Experience',
    priceDelta: 1450,
    description: 'Exclusive 90-minute live guided walkthrough by certified English-speaking venue specialist & souvenir booklet.',
  },
];

interface AttractionProviderDeal {
  id: string;
  name: string;
  logoBg: string;
  logoText: string;
  rating: number;
  bookingsCount: string;
  perks: string;
  priceDelta: number;
  isCheapest?: boolean;
  isOfficial?: boolean;
}

export const AttractionBookingCheckoutPage: React.FC<AttractionBookingCheckoutPageProps> = ({
  experience,
  item,
  currency,
  selectedDate,
  onBack,
  onBackToResults,
  onCompleteBooking,
  onConfirmPayment,
  onNotify,
  onNavigateTrips,
  onGoToTrips,
}) => {
  const title = experience?.title || item?.title || 'Burj Khalifa At The Top (124th & 125th Floor)';
  const location = (experience as any)?.location || (experience as any)?.city || item?.toCity || 'Downtown Dubai, UAE';
  const visitDate = selectedDate || item?.travelDate || '15 Oct 2026';
  const timeSlot = '10:00 AM Entry';
  const participants = 1;
  const basePrice = Math.max(900, experience?.startingPriceInr || item?.priceInr || 2450);

  // Selected Option
  const [selectedOptionId, setSelectedOptionId] = useState<AttractionTicketOptionId>('skip-line');

  // Redirection modal state for "Go to site"
  const [redirectingProvider, setRedirectingProvider] = useState<AttractionProviderDeal | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingPnr, setConfirmedBookingPnr] = useState<string>('');
  const [qrCodeString, setQrCodeString] = useState<string>('');

  const activeOption = useMemo(() => {
    return ATTRACTION_TICKET_OPTIONS.find((t) => t.id === selectedOptionId) || ATTRACTION_TICKET_OPTIONS[1];
  }, [selectedOptionId]);

  const activeOptionDelta = activeOption.priceDelta;

  // Comparison Sites / Ticketing Platforms list (Viator / GetYourGuide / Klook style)
  const providerDeals: AttractionProviderDeal[] = useMemo(() => {
    return [
      {
        id: 'tripyeah-experiences',
        name: 'TripYeah Experiences Direct',
        logoBg: 'bg-blue-600',
        logoText: 'TY',
        rating: 4.9,
        bookingsCount: '28,000+ bookings',
        perks: 'Best Price Guarantee · Instant QR Mobile Voucher · Zero Booking Fee · 24/7 WhatsApp Assist',
        priceDelta: 0,
        isCheapest: true,
      },
      {
        id: 'getyourguide',
        name: 'GetYourGuide',
        logoBg: 'bg-[#ff5533]',
        logoText: 'GYG',
        rating: 4.8,
        bookingsCount: '95,000+ bookings',
        perks: 'Official Certified Partner · Free Cancellation up to 24h · Easy Smartphone Turnstile Scan',
        priceDelta: 90,
      },
      {
        id: 'viator-tripadvisor',
        name: 'Viator (TripAdvisor Company)',
        logoBg: 'bg-[#00aa6c]',
        logoText: 'VIA',
        rating: 4.8,
        bookingsCount: '82,000+ bookings',
        perks: 'Viator Exclusive Deal · Multilingual Customer Support · Reserve Now & Pay Later Option',
        priceDelta: 120,
      },
      {
        id: 'klook-travel',
        name: 'Klook Travel',
        logoBg: 'bg-[#ff5b00]',
        logoText: 'KLK',
        rating: 4.7,
        bookingsCount: '74,000+ bookings',
        perks: 'Instant E-Voucher Confirmation · Skip Box Office Line · Earn Klook Credits Cash-back',
        priceDelta: 60,
      },
      {
        id: 'venue-official',
        name: `${title.split(' ')[0]} Official Box Office`,
        logoBg: 'bg-slate-900',
        logoText: title.substring(0, 2).toUpperCase(),
        rating: 4.9,
        bookingsCount: 'Official Venue',
        perks: 'Direct Box Office Admission · Official Entry Barcode · Guaranteed Venue Access',
        priceDelta: 150,
        isOfficial: true,
      },
      {
        id: 'tiqets-pass',
        name: 'Tiqets',
        logoBg: 'bg-[#1b3b6f]',
        logoText: 'TIQ',
        rating: 4.6,
        bookingsCount: '21,000+ bookings',
        perks: 'Direct Smartphone Scan & Go · Instant E-Pass via SMS & Email · No Paper Printing Needed',
        priceDelta: 140,
      },
    ];
  }, [title]);

  const handleSelectSite = (provider: AttractionProviderDeal) => {
    setRedirectingProvider(provider);
  };

  const handleFinalizePartnerBooking = (provider: AttractionProviderDeal) => {
    const finalFare = basePrice + activeOptionDelta + provider.priceDelta;
    const generatedRef = `TY-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomQr = `QR-PASS-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setConfirmedBookingPnr(generatedRef);
    setQrCodeString(randomQr);

    const bookingRecord: BookedTrip = {
      id: `booking-${Date.now()}`,
      bookingId: generatedRef,
      bookingReference: generatedRef,
      category: 'experiences',
      title: `${title} (${activeOption.name})`,
      routeSummary: `${location} · ${timeSlot}`,
      dateSummary: `${visitDate} · ${activeOption.name}`,
      travellers: 1,
      cabinOrRoom: `${activeOption.name} · ${provider.name}`,
      totalPaidInr: finalFare,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: 'Just now',
      departureDate: visitDate,
      carrierOrHotel: `${provider.name}`,
      passengers: [{ name: 'Adult 1 (General Entry)', age: 28, gender: 'Adult' }],
      pnr: generatedRef,
      isDemo: false,
    };

    if (onCompleteBooking) {
      onCompleteBooking(bookingRecord);
    }
    if (onConfirmPayment) {
      onConfirmPayment(bookingRecord, 'Verified Guest');
    }

    setBookingConfirmed(true);
    onNotify('Attraction Ticket Confirmed!', `Reserved via ${provider.name}. Confirmation: ${generatedRef}`, 'success');
  };

  const handleBack = () => {
    if (onBack) onBack();
    else if (onBackToResults) onBackToResults();
  };

  const handleViewTrips = () => {
    if (onNavigateTrips) onNavigateTrips();
    else if (onGoToTrips) onGoToTrips();
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 pb-20 font-sans">
      {/* Top Breadcrumb & Navigation */}
      <header className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Attractions &amp; Experiences</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Ticket Partner Comparison</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ===================================================================
            SECTION 1: ATTRACTION SUMMARY CARD
        =================================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                    Official Attraction Pass
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{title}</h1>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{location}</span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-white/70 font-medium">Tickets from</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  {formatPrice(basePrice, currency)}
                </div>
                <div className="text-[10px] text-white/60">per participant</div>
              </div>
            </div>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-white/10 text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 text-white font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                <span>Visit Date: {visitDate}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 text-white font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                <span>Time Slot: {timeSlot}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 text-white font-medium">
                <Users className="w-3.5 h-3.5 text-indigo-300" />
                <span>{participants} Participant (Adult 12+)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                <QrCode className="w-3.5 h-3.5" />
                <span>Instant Mobile QR Scan &amp; Go</span>
              </span>
            </div>
          </div>

          {/* Substrip with Inclusions */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Official E-Ticket with Fast-Track Barcode</div>
                <div className="text-slate-500">Show voucher on mobile screen at entrance turnstiles. No paper printout required.</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Free Cancellation up to 24h Prior to Visit</span>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2: TICKET TYPE / PASS OPTIONS (CUSTOMIZATION)
        =================================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Select Ticket Category &amp; Tier</h2>
              <p className="text-xs text-slate-500">Upgrade for fast-track or guided tour. Partner ticket sites update automatically below.</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Live Fare Recalculation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ATTRACTION_TICKET_OPTIONS.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{opt.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{opt.description}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-baseline justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Ticket Delta:</span>
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
            SECTION 3: COMPARISON SITES LIST (GETYOURGUIDE / VIATOR / KLOOK STYLE)
        =================================================================== */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Compare Ticket Rates Across Verified Platforms ({providerDeals.length} Sites)
              </h3>
              <p className="text-xs text-slate-500">
                Clicking <span className="font-semibold text-indigo-600">Go to site</span> directly connects with the ticketing provider to issue your official pass.
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
                            Lowest Ticket Deal
                          </span>
                        )}
                        {provider.isOfficial && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-300">
                            Official Box Office
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-amber-500 flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{provider.rating}</span>
                        </span>
                        <span>·</span>
                        <span>{provider.bookingsCount}</span>
                        <span>·</span>
                        <span className="text-slate-600 font-medium">Verified Ticketing Channel</span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">{provider.perks}</p>
                    </div>
                  </div>

                  {/* Right: Price & CTA Button */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Ticket Fare</div>
                      <div className="text-2xl font-black font-mono text-slate-900">
                        {formatPrice(totalPrice, currency)}
                      </div>
                      <div className="text-[10px] text-slate-500">Includes admission taxes &amp; fees</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectSite(provider)}
                      className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 ${
                        provider.isCheapest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
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
          REDIRECTION & PARTNER TICKETING MODAL
      ===================================================================== */}
      {redirectingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-center space-y-5">
            {!bookingConfirmed ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                  <ExternalLink className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    Connecting to {redirectingProvider.name}...
                  </h3>
                  <p className="text-xs text-slate-500">
                    Routing to official partner ticketing portal to issue your official electronic barcode pass.
                  </p>
                </div>

                {/* Deal Review Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800">{title}</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      {formatPrice(basePrice + activeOptionDelta + redirectingProvider.priceDelta, currency)}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Venue:</span> {location}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Ticket Tier:</span> {activeOption.name}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Visit Schedule:</span> {visitDate} ({timeSlot})
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleFinalizePartnerBooking(redirectingProvider)}
                    className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
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
                  <h3 className="text-2xl font-black text-slate-900">Attraction Ticket Issued!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your official admission pass has been confirmed with {redirectingProvider.name}.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-left space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ticket Ref:</span>
                    <span className="font-bold text-emerald-800">{confirmedBookingPnr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Turnstile QR Pass:</span>
                    <span className="font-bold text-indigo-700 text-sm tracking-wider">{qrCodeString}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Experience:</span>
                    <span className="font-bold text-slate-900">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Admission Slot:</span>
                    <span className="font-bold text-slate-900">{visitDate} · {timeSlot}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRedirectingProvider(null);
                      handleViewTrips();
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View in My Trips &amp; Download Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRedirectingProvider(null);
                      handleBack();
                    }}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Explore More Attractions
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
