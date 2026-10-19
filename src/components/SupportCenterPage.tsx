import React, { useState, useMemo } from 'react';
import {
  Search,
  Luggage,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  User,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  Compass,
  Gift,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Send,
  X,
  ExternalLink,
} from 'lucide-react';
import { AppPageView } from './Navbar';
import { BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { SafeImage } from './SafeImage';

export interface SupportCenterPageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: AppPageView) => void;
  bookedTrips: BookedTrip[];
  userName: string | null;
  currency: CurrencyCode;
  onOpenInsurance?: () => void;
  onOpenOffers?: () => void;
  onOpenAuth?: () => void;
  onNotify?: (title: string, message: string, type?: 'success' | 'info') => void;
}

type FaqCategory =
  | 'all'
  | 'Booking'
  | 'Payments'
  | 'Cancellations'
  | 'Refunds'
  | 'Account & Login'
  | 'Travel Assistance';

interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    id: 'b-1',
    category: 'Booking',
    question: 'How do I download or print my confirmed travel ticket / hotel voucher?',
    answer:
      'You can instantly access and download your e-ticket, digital boarding pass, and hotel confirmation voucher from the "My Trips" section on TripYehh. Open your booking card and click "Download Voucher" or "View Boarding Pass". A copy is also automatically dispatched to your registered email address.',
  },
  {
    id: 'b-2',
    category: 'Booking',
    question: 'Can I choose my seats or add special meal preferences after booking?',
    answer:
      'Yes. For flight bookings, you can select standard or extra legroom seats through our interactive 3-3 cabin seat map in My Trips or during checkout. Special meals (Vegetarian, Vegan, Jain, Diabetic) and extra baggage can be selected up to 6 hours before scheduled departure.',
  },
  {
    id: 'b-3',
    category: 'Booking',
    question: 'How does IRCTC train ticket synchronization work on TripYehh?',
    answer:
      'TripYehh synchronizes directly with official Indian Railways servers. When booking a train, your IRCTC credentials verify the reservation, and your 10-digit PNR is generated instantly. You can track real-time charting status, coach position, and platform numbers in My Trips.',
  },
  {
    id: 'c-1',
    category: 'Cancellations',
    question: 'What is TripYehh’s cancellation policy for flights and hotels?',
    answer:
      'Cancellation charges depend on the airline/hotel fare rules selected during booking. For member fares with "Free Cancellation Protection", 100% of the base fare is refunded with zero TripYehh cancellation fees if cancelled prior to the cutoff time (typically 24 hours before check-in or departure).',
  },
  {
    id: 'c-2',
    category: 'Cancellations',
    question: 'How do I modify my journey date or reschedule a trip?',
    answer:
      'Go to "My Trips", select the booking you wish to alter, and click "Reschedule / Change Date". TripYehh members enjoy zero date-change fees on select domestic routes and hotel bookings (fare difference, if applicable, is shown transparently).',
  },
  {
    id: 'r-1',
    category: 'Refunds',
    question: 'How long does it take for my refund to reflect in my bank account?',
    answer:
      'For UPI payments (Google Pay, PhonePe, Paytm), refunds are processed instantaneously within 2 to 24 hours. For Debit/Credit Card and Net Banking transactions, the credited amount reflects in your account within 3 to 5 business days, subject to your issuing bank’s clearing cycle.',
  },
  {
    id: 'r-2',
    category: 'Refunds',
    question: 'Can I track the real-time status of my refund?',
    answer:
      'Yes! Click on "Track Refund" in the My Trips section or check the Refund Tracker tool on this page using your Booking Reference ID (e.g. TY-8841-GOA). You will see step-by-step milestones: Request Received, Airline/Hotel Approval, Bank Gateway Dispatch, and Account Credit.',
  },
  {
    id: 'p-1',
    category: 'Payments',
    question: 'Which payment modes are supported on TripYehh?',
    answer:
      'TripYehh supports all major payment methods including Instant UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking across 50+ Indian banks, and TripPoints rewards balance.',
  },
  {
    id: 'p-2',
    category: 'Payments',
    question: 'Is my payment transaction secure on TripYehh?',
    answer:
      'All transactions on TripYehh are processed through PCI-DSS Level 1 certified payment gateways with industry-grade SSL encryption. We never store your full card numbers, CVVs, or UPI PINs.',
  },
  {
    id: 'a-1',
    category: 'Account & Login',
    question: 'How do I update my name, contact number, or co-travellers list?',
    answer:
      'Navigate to "My Account" from the top navigation or Quick Links. In Account Settings, you can update your personal profile, email, contact number, frequent flyer numbers, and pre-save co-travellers for 1-click booking during checkout.',
  },
  {
    id: 't-1',
    category: 'Travel Assistance',
    question: 'What should I do if my flight is delayed, rescheduled, or cancelled by the airline?',
    answer:
      'If an airline reschedules or cancels your flight, you will receive real-time SMS & email notifications from TripYehh. You are entitled to either a full instant refund with zero penalties or an alternate flight on the same airline. Contact our 24x7 emergency helpline for priority rebooking.',
  },
  {
    id: 't-2',
    category: 'Travel Assistance',
    question: 'Does TripYehh assist with international visa requirements and travel insurance?',
    answer:
      'Yes. Our "Go Global" international planner provides country-wise visa guidelines, processing times, and document checklists for destinations worldwide. Comprehensive travel insurance covers flight delays, baggage loss, and cashless international medical emergencies.',
  },
];

export const SupportCenterPage: React.FC<SupportCenterPageProps> = ({
  onBackToHome,
  onNavigatePage,
  bookedTrips,
  userName,
  currency,
  onOpenInsurance,
  onOpenOffers,
  onOpenAuth,
  onNotify,
}) => {
  // Search query in hero & FAQ
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqCategory, setActiveFaqCategory] = useState<FaqCategory>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('b-1');

  // Refund tracker modal
  const [showRefundTracker, setShowRefundTracker] = useState(false);
  const [refundTrackingId, setRefundTrackingId] = useState(
    bookedTrips[0]?.bookingId || 'TY-8841-GOA'
  );

  // Contact form state
  const [contactName, setContactName] = useState(userName || '');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('Booking & Reservation');
  const [contactBookingRef, setContactBookingRef] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    subject: string;
    date: string;
  } | null>(null);

  // Filter FAQs based on category & search query
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory =
        activeFaqCategory === 'all' || faq.category === activeFaqCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFaqCategory, searchQuery]);

  // Handle support form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      onNotify?.('Missing Information', 'Please fill in all required fields.', 'info');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `TY-TK-${Math.floor(10000 + Math.random() * 90000)}`;

      // Save ticket to localStorage
      try {
        const stored = localStorage.getItem('tripyeah_support_tickets');
        const tickets = stored ? JSON.parse(stored) : [];
        const newTicket = {
          id: generatedId,
          customerName: contactName.trim(),
          email: contactEmail.trim(),
          category: contactCategory,
          bookingRef: contactBookingRef.trim() || 'N/A',
          subject: contactMessage.slice(0, 60) + (contactMessage.length > 60 ? '...' : ''),
          message: contactMessage.trim(),
          status: 'Open',
          priority: 'High',
          date: 'Just now',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          'tripyeah_support_tickets',
          JSON.stringify([newTicket, ...tickets])
        );
      } catch (err) {
        console.warn('Error saving support ticket:', err);
      }

      setSubmittedTicket({
        ticketId: generatedId,
        subject: contactCategory,
        date: 'Just now',
      });

      onNotify?.(
        'Support Ticket Created',
        `Ticket #${generatedId} has been logged. Our executive will reach out to ${contactEmail.trim()} within 2-4 hours.`,
        'success'
      );
    }, 600);
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setContactMessage('');
    setContactBookingRef('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* =========================================================================
          BREADCRUMB BAR
      ========================================================================= */}
      <div className="bg-white border-b border-slate-200/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center text-xs text-slate-500 gap-1.5">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-blue-600 transition-colors cursor-pointer font-medium"
          >
            Home
          </button>
          <span>&gt;</span>
          <span className="text-slate-900 font-semibold">Customer Support</span>
        </div>
      </div>

      <div className="flex-1 pb-16">
        {/* =========================================================================
            1. TOP HERO BANNER (CORPORATE CALL-CENTER WITH EXECUTIVE IMAGE)
        ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white border-b border-slate-800">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading, Subtitle & Interactive Search */}
              <div className="lg:col-span-7 space-y-5">
                {/* 24x7 Live Support Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-semibold backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24x7 Dedicated Travel Assistance · Average response time &lt; 5 mins</span>
                </div>

                <div className="space-y-2">
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Customer Support
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                    TripYehh is here to help you. Find answers, manage your bookings and get assistance with your travel plans.
                  </p>
                </div>

                {/* Hero Search Box */}
                <div className="pt-2 max-w-xl">
                  <div className="relative flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white focus-within:text-slate-900 rounded-2xl border border-white/20 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400/30 shadow-xl transition-all">
                    <Search className="w-5 h-5 ml-4 text-slate-300 focus-within:text-blue-600 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search booking reference, flight issues, cancellations, refunds..."
                      className="w-full px-3.5 py-3.5 text-xs sm:text-sm font-medium bg-transparent text-white focus:text-slate-900 focus:outline-none placeholder:text-slate-300 focus:placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mr-3 p-1 rounded-full text-slate-300 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-xs text-sky-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Showing results for "{searchQuery}" in FAQs below</span>
                    </div>
                  )}
                </div>

                {/* Quick Info Badges */}
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant UPI Refunds</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Free Date Modifications</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>IRCTC Sync &amp; Verified PNRs</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Professional Corporate Call Center Executive Image */}
              <div className="lg:col-span-5 hidden sm:block">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 max-h-[380px] group">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                    alt="TripYehh Customer Support Executive"
                    className="w-full h-full object-cover object-center max-h-[380px] transition-transform duration-500 group-hover:scale-102"
                    fallbackTitle="TripYehh 24x7 Customer Support Operations"
                  />
                  {/* Subtle Gradient Overlay to ensure visual harmony with theme */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-blue-900/10 pointer-events-none" />

                  {/* Floating Verified Agent Tag */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 border border-white/20 p-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          TripYehh Travel Concierge
                        </span>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          Active &amp; Ready to Assist
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-sky-300 bg-blue-950/90 px-2.5 py-1 rounded-full border border-sky-400/30">
                      Toll-Free 1800-120-7433
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Container for main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 space-y-10 sm:space-y-12 relative z-20">

          {/* =========================================================================
              2. MY TRIPS SECTION (WHITE CARD BELOW HERO BANNER)
          ========================================================================= */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Luggage className="w-4 h-4" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    My Trips
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  View and manage your bookings in one place.
                </p>
              </div>

              {/* 4 Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigatePage('trips')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Luggage className="w-3.5 h-3.5" />
                  <span>View Bookings</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigatePage('trips')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Modify Booking</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigatePage('trips')}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Cancel Booking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRefundTracker(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Track Refund</span>
                </button>
              </div>
            </div>

            {/* Bookings Display / Empty State */}
            <div className="pt-6">
              {bookedTrips && bookedTrips.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>
                      Showing {bookedTrips.length} recent{' '}
                      {bookedTrips.length === 1 ? 'booking' : 'bookings'} associated with your profile:
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigatePage('trips')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Full Trips Dashboard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {bookedTrips.map((trip) => {
                      const isConfirmed = trip.status === 'Confirmed';
                      const isCancelled = trip.status === 'Cancelled';

                      return (
                        <div
                          key={trip.bookingId}
                          onClick={() => onNavigatePage('trips')}
                          className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50/60 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                                  Ref: #{trip.bookingId}
                                </span>
                                {trip.pnr && (
                                  <span className="font-mono text-[11px] font-semibold text-slate-500 ml-2">
                                    PNR: {trip.pnr}
                                  </span>
                                )}
                              </div>

                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  isConfirmed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isCancelled
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {trip.status}
                              </span>
                            </div>

                            <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {trip.title}
                            </h3>

                            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{trip.dateSummary || `${trip.departureDate} – ${trip.returnDate}`}</span>
                              <span>·</span>
                              <span>{trip.routeSummary}</span>
                            </p>

                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                              {trip.carrierOrHotel || trip.cabinOrRoom}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900 font-mono">
                              Total: {formatPrice(trip.totalPaidInr, currency)}
                            </span>
                            <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <span>Manage details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Proper Empty State */
                <div className="text-center py-12 px-4 max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Luggage className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      No bookings found
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {userName
                        ? 'You currently do not have any active or upcoming travel reservations.'
                        : 'Sign in to access your flight tickets, hotel vouchers, and PNR details.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onBackToHome}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Explore Trips
                    </button>
                    {!userName && (
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =========================================================================
              3. QUICK LINKS SECTION
          ========================================================================= */}
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Quick Links
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Explore account services and travel assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: My Account */}
              <button
                type="button"
                onClick={() => onNavigatePage('account')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                    <span>My Account</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Update your profile, co-travellers, and account preferences.
                  </p>
                </div>
              </button>

              {/* Card 2: Payment & Refunds */}
              <button
                type="button"
                onClick={() => {
                  setActiveFaqCategory('Refunds');
                  setShowRefundTracker(true);
                }}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                    <span>Payment &amp; Refunds</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Check payment-related help, UPI/Card statuses, and instant refund timelines.
                  </p>
                </div>
              </button>

              {/* Card 3: Booking Help */}
              <button
                type="button"
                onClick={() => {
                  setActiveFaqCategory('Booking');
                  const el = document.getElementById('faqs-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                    <span>Booking Help</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Get instant assistance with date changes, seat allocation, and PNR verification.
                  </p>
                </div>
              </button>

              {/* Card 4: Travel Insurance */}
              <button
                type="button"
                onClick={onOpenInsurance}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 shadow-2xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
                    <span>Travel Insurance</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-600 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    View policy documents, claim assistance, and emergency cashless hospital cover.
                  </p>
                </div>
              </button>

              {/* Card 5: Trip Ideas */}
              <button
                type="button"
                onClick={() => onNavigatePage('explore')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                    <span>Trip Ideas</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Discover travel inspiration, curated itineraries, and top trending destinations.
                  </p>
                </div>
              </button>

              {/* Card 6: Gift Cards & Offers */}
              <button
                type="button"
                onClick={onOpenOffers}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-2xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                    <span>Gift Cards &amp; Offers</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Apply promo coupons, redeem travel vouchers, and unlock exclusive discounts.
                  </p>
                </div>
              </button>

              {/* Card 7: Contact Support */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('contact-form-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer sm:col-span-2 lg:col-span-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                    <span>Contact Support Team</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Speak directly with the TripYehh 24x7 customer assistance desk or raise an expedited ticket.
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* =========================================================================
              4. FAQS SECTION ("HOW CAN WE HELP YOU?")
          ========================================================================= */}
          <section id="faqs-section" className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  How can we help you?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Frequently asked questions organized by topic.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    'all',
                    'Booking',
                    'Payments',
                    'Cancellations',
                    'Refunds',
                    'Account & Login',
                    'Travel Assistance',
                  ] as FaqCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveFaqCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFaqCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {cat === 'all' ? 'All Questions' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion FAQ List */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className="transition-colors hover:bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedFaqId(isExpanded ? null : faq.id)
                        }
                        className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                            {faq.category}
                          </span>
                          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
                            {faq.question}
                          </h3>
                        </div>
                        <div
                          className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 bg-blue-100 text-blue-700' : 'text-slate-500'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-slate-500 text-xs">
                  No questions found matching your search. Please reach out to our team below.
                </div>
              )}
            </div>
          </section>

          {/* =========================================================================
              5. CONTACT SUPPORT & FORM SECTION
          ========================================================================= */}
          <section id="contact-form-section" className="pt-4">
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 rounded-3xl text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Left: Verified Contact Information & Details */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                      Direct Concierge Desk
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Contact TripYehh Support
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Have a query regarding an existing booking, immediate flight change, or refund status? Our customer service champions are at your disposal.
                    </p>
                  </div>

                  {/* Verified Support Cards */}
                  <div className="space-y-3.5">
                    {/* Phone Helpline */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          24x7 Toll-Free Helpline
                        </span>
                        <a
                          href="tel:18001207433"
                          className="font-mono text-sm sm:text-base font-bold text-white hover:text-sky-300 transition-colors"
                        >
                          1800-120-7433
                        </a>
                        <span className="text-[11px] text-emerald-400 block mt-0.5">
                          Toll-Free within India · Zero wait time for members
                        </span>
                      </div>
                    </div>

                    {/* Official Email */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-600/30 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Priority Email Desk
                        </span>
                        <a
                          href="mailto:support@tripyeah.com"
                          className="font-mono text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors"
                        >
                          support@tripyeah.com
                        </a>
                        <span className="text-[11px] text-slate-300 block mt-0.5">
                          Average email response time: within 15 minutes
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Support */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          WhatsApp Quick Chat
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-white">
                          +91 98110 54321
                        </span>
                        <span className="text-[11px] text-slate-300 block mt-0.5">
                          Instant boarding pass &amp; PNR dispatch on WhatsApp
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-900/30 border border-blue-500/20 text-xs text-sky-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Authorized customer support system · All inquiries securely logged.</span>
                  </div>
                </div>

                {/* Right: Contact Form */}
                <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl">
                  {submittedTicket ? (
                    <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
                          Support Request Logged
                        </span>
                        <h3 className="font-display text-2xl font-bold text-slate-900">
                          Ticket #{submittedTicket.ticketId} Created
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                          We have recorded your ticket for <strong>{submittedTicket.subject}</strong>. A support executive has been allocated to review your request.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs text-slate-600 text-left space-y-1 font-mono-tabular">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Response Target:</span>
                          <strong className="text-emerald-700">&lt; 2 Hours</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Assigned Desk:</span>
                          <strong className="text-slate-800">TripYehh Concierge Tier 1</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          Submit an Inquiry
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Fill out the details below and our team will get in touch.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="e.g. rahul@example.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Category */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Issue Category *
                          </label>
                          <select
                            value={contactCategory}
                            onChange={(e) => setContactCategory(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="Booking & Reservation">Booking &amp; Reservation</option>
                            <option value="Flight Reschedule / Cancellation">Flight Reschedule / Cancellation</option>
                            <option value="Refund Status & Timeline">Refund Status &amp; Timeline</option>
                            <option value="Hotel Check-in & Room Issue">Hotel Check-in &amp; Room Issue</option>
                            <option value="Train / IRCTC Sync Inquiry">Train / IRCTC Sync Inquiry</option>
                            <option value="Account & Login Help">Account &amp; Login Help</option>
                            <option value="Other Travel Question">Other Travel Question</option>
                          </select>
                        </div>

                        {/* Booking Ref */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Booking Reference / PNR (Optional)
                          </label>
                          <input
                            type="text"
                            value={contactBookingRef}
                            onChange={(e) => setContactBookingRef(e.target.value)}
                            placeholder="e.g. TY-8841-GOA"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Message / Issue Description *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Please provide details about your inquiry so we can resolve it promptly..."
                          className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Submitting Request...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Support Request</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>

      {/* =========================================================================
          TRACK REFUND MODAL
      ========================================================================= */}
      {showRefundTracker && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Live Refund Tracker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify real-time status of your payment return
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRefundTracker(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reference Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Booking ID or Reference
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={refundTrackingId}
                    onChange={(e) => setRefundTrackingId(e.target.value.toUpperCase())}
                    placeholder="e.g. TY-8841-GOA"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm font-bold text-slate-900 uppercase focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Tracking: #{refundTrackingId}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    IN PROGRESS
                  </span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-400">
                  {/* Step 1 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">1. Refund Request Verified</h4>
                    <p className="text-[11px] text-slate-500">
                      Zero cancellation deduction policy validated by TripYehh.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">2. Airline / Property Approved</h4>
                    <p className="text-[11px] text-slate-500">
                      Carrier authorization reference generated.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] animate-pulse">
                      ●
                    </span>
                    <h4 className="text-xs font-bold text-blue-900">3. Gateway Clearing to Source</h4>
                    <p className="text-[11px] text-slate-500">
                      Funds dispatched to originating payment mode (Expected within 2-4 hours for UPI).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowRefundTracker(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  Close Tracker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
