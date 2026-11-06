import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  ChevronDown,
  User,
  HelpCircle,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  X,
} from 'lucide-react';
import { AppPageView } from './Navbar';
import { BookedTrip, CurrencyCode } from '../data/travelData';
import supportHeroBg from '../assets/images/support_hero_bg_1792412778981.jpg';
import customerSupportImg from '../assets/images/customer_support_rep_1792420256877.jpg';

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
  | 'Cancellations'
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <div className="flex-1 pb-16">
        {/* =========================================================================
            1. TOP HERO BANNER (CONCIERGE BACKGROUND EXTENDING ALL THE WAY UP TO HEADER)
        ========================================================================= */}
        <section className="relative overflow-hidden bg-slate-950 text-white min-h-[340px] sm:min-h-[400px] flex flex-col justify-end pt-24 sm:pt-28 pb-14 sm:pb-16 border-b border-slate-800">
          {/* Full-bleed Background Image - Clear, vivid and fully visible */}
          <div className="absolute inset-0 z-0">
            <img
              src={supportHeroBg}
              alt="TripYehh Customer Support & Concierge"
              className="w-full h-full object-cover object-center brightness-105 contrast-105 saturate-110"
            />
            {/* Subtle clean neutral contrast scrim so background image is clearly visible without heavy darkness */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-black/35" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            {/* Breadcrumb directly inside hero beneath navbar */}
            <div className="flex items-center text-xs text-white/90 gap-1.5 mb-4 drop-shadow-sm">
              <button
                type="button"
                onClick={onBackToHome}
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-white font-semibold">Customer Support</span>
            </div>

            <div>
              {/* Customer Support Title */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                Customer Support
              </h1>
            </div>
          </div>
        </section>

        {/* Container for main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 space-y-10 sm:space-y-12 relative z-20">



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

              {/* Card 2: Booking Help */}
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

              {/* Card 3: Travel Insurance */}
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
            </div>
          </section>

          {/* =========================================================================
              4. FAQS SECTION ("HOW CAN WE HELP YOU?")
          ========================================================================= */}
          <section id="faqs-section" className="space-y-6 pt-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  How can we help you?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Frequently asked questions organized by topic.
                </p>
              </div>

              {/* Search input for FAQs */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQ questions & answers..."
                  className="w-full pl-9.5 pr-8 py-2.5 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  'all',
                  'Booking',
                  'Cancellations',
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
              DIRECT 24x7 CONCIERGE DESK
          ========================================================================= */}
          <section className="pt-4">
            <div className="relative rounded-3xl text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-700/80 overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={customerSupportImg}
                  alt="TripYehh Customer Support Team"
                  className="w-full h-full object-cover object-center brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-950/85" />
              </div>

              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                    Direct Concierge Desk
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    24x7 Dedicated Travel Assistance
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
                    Need immediate assistance with flight changes, terminal updates, or hotel check-in? Connect directly with our priority customer support desk.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Phone Helpline */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider">
                        24x7 Toll-Free Helpline
                      </span>
                      <a
                        href="tel:18001207433"
                        className="font-mono text-base font-bold text-white hover:text-sky-300 transition-colors block mt-0.5"
                      >
                        1800-120-7433
                      </a>
                      <span className="text-[11px] text-emerald-400 block mt-1">
                        Toll-Free within India · Instant response
                      </span>
                    </div>
                  </div>

                  {/* Official Email */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/30 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider">
                        Priority Email Desk
                      </span>
                      <a
                        href="mailto:support@tripyeah.com"
                        className="font-mono text-base font-bold text-white hover:text-cyan-300 transition-colors block mt-0.5"
                      >
                        support@tripyeah.com
                      </a>
                      <span className="text-[11px] text-slate-300 block mt-1">
                        Average response: within 15 minutes
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Support */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider">
                        WhatsApp Quick Chat
                      </span>
                      <span className="font-mono text-base font-bold text-white block mt-0.5">
                        +91 98110 54321
                      </span>
                      <span className="text-[11px] text-slate-300 block mt-1">
                        Instant boarding pass &amp; PNR updates
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md text-xs text-sky-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Authorized customer assistance system · 24x7 verified agents.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
