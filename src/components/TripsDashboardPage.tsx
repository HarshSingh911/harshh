import React, { useState } from 'react';
import {
  Plane,
  Globe,
  PiggyBank,
  Download,
  PlusCircle,
  Share2,
  Printer,
  Headphones,
  QrCode,
  Armchair,
  MapPin,
  FileText,
  ShieldCheck,
  Sun,
  Phone,
  Award,
  Calendar,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Star,
} from 'lucide-react';
import {
  ASSETS,
  BookedTrip,
  CurrencyCode,
  formatPrice,
} from '../data/travelData';
import { ActiveCredentialModal } from './CredentialModals';
import { SafeImage } from './SafeImage';

interface TripsDashboardPageProps {
  currency: CurrencyCode;
  bookedTrips: BookedTrip[];
  onBookNewTrip: () => void;
  onOpenCredentialModal: (modal: ActiveCredentialModal) => void;
  onNavigateToProfile: () => void;
  onNotify: (title: string, detail: string) => void;
}

export const TripsDashboardPage: React.FC<TripsDashboardPageProps> = ({
  currency,
  bookedTrips,
  onBookNewTrip,
  onOpenCredentialModal,
  onNavigateToProfile,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<
    'upcoming' | 'completed' | 'cancelled' | 'wallet'
  >('upcoming');

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Member Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-600 text-blue-700 font-display text-xl font-bold flex items-center justify-center">
                RS
              </div>
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center absolute -bottom-0.5 -right-0.5 text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Welcome back, Rahul Sharma
                </h1>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  ✓ Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  TripYeah Platinum Explorer
                </span>
                <span>· rahul.sharma@example.com · Member since 2021</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                onNotify(
                  'All GST Tax Invoices Downloaded',
                  'Consolidated FY 2025-26 travel statement downloaded.'
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Invoices</span>
            </button>

            <button
              type="button"
              onClick={onBookNewTrip}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Trip</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stat Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>UPCOMING TRIPS</span>
              <Plane className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold font-mono-tabular text-slate-900">
                {bookedTrips.length}
              </span>
              <span className="text-xs font-semibold text-blue-600">
                Active Itinerary
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>TRIPPOINTS POOL</span>
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Redeem ›
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold font-mono-tabular text-slate-900">
                2,705
              </span>
              <span className="text-xs text-slate-400">(Value: ₹2,705)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>LIFETIME SAVINGS</span>
              <PiggyBank className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold font-mono-tabular text-slate-900">
                ₹12,400
              </span>
              <span className="text-xs text-slate-400">via Club Deals</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>CITIES EXPLORED</span>
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold font-mono-tabular text-slate-900">
                14
              </span>
              <span className="text-xs text-slate-400">Across 3 Nations</span>
            </div>
          </div>
        </div>

        {/* 6 Sub-Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Upcoming Trips</span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono-tabular">
              {bookedTrips.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Completed Trips (12)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Cancelled & Refunds (1)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Wallet & Rewards
          </button>

          <button
            type="button"
            onClick={onNavigateToProfile}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer ml-auto"
          >
            Profile & Co-Travelers →
          </button>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Confirmed Trip Card (Booking ID: TY-8841-GOA) */}
            <div className="bg-white rounded-3xl border border-slate-200/85 overflow-hidden shadow-2xs">
              {/* Top Status Bar */}
              <div className="px-5 py-3 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <strong className="text-blue-950">
                    Confirmed & Ready to Travel
                  </strong>
                  <span className="text-blue-700 bg-white px-2.5 py-0.5 rounded-full font-semibold text-[11px] border border-blue-100">
                    Departs in 3 Days (16 Oct 2025)
                  </span>
                </div>
                <span className="font-mono-tabular text-slate-600 font-semibold">
                  Booking ID: <strong className="text-slate-900">TY-8841-GOA</strong>
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Package Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                      HOLIDAY PACKAGE · GOA, INDIA
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      Goa Beachfront Escape & Flights
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      DEL → GOI Roundtrip · 3 Nights at Calangute Coast · 2 Adults
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onNotify(
                            'Itinerary Shared',
                            'Copied live trip link for TY-8841-GOA.'
                          )
                        }
                        title="Share Trip"
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        title="Print Itinerary"
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCredentialModal('cancel-refund')}
                        title="Cancel Booking & Request Refund"
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>24x7 Goa Concierge</span>
                    </span>
                  </div>
                </div>

                {/* Flight Sub-Card (IndiGo 6E-2134) */}
                <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1D4ED8] text-white font-mono-tabular font-bold text-xs flex items-center justify-center">
                        6E
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          IndiGo Flight · 6E-2134
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Airbus A321neo · Economy Premium
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Web Check-in Confirmed</span>
                    </span>
                  </div>

                  {/* Timings */}
                  <div className="grid grid-cols-3 items-center gap-3 pt-1">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-slate-900">
                        06:15
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        DEL · New Delhi
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Indira Gandhi Intl, T3 · Gate 14B
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-[11px] font-mono-tabular text-slate-500 mb-1">
                        2h 15m · Non-stop
                      </div>
                      <div className="relative flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <div className="flex-1 h-px bg-blue-200 mx-1" />
                        <Plane className="w-3.5 h-3.5 text-blue-600" />
                        <div className="flex-1 h-px bg-blue-200 mx-1" />
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      </div>
                      <div className="text-[11px] font-semibold text-blue-600 mt-1">
                        On Schedule
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-slate-900">
                        08:30
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        GOI · Goa Dabolim
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Dabolim Airport, T1
                      </div>
                    </div>
                  </div>

                  {/* Seats & Boarding Pass Trigger */}
                  <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span>
                        Seats: <strong className="text-slate-900">12B, 12C</strong>{' '}
                        (Extra Legroom)
                      </span>
                      <span>·</span>
                      <span>
                        Check-in: <strong className="text-slate-900">15 kg</strong> /
                        cabin: <strong className="text-slate-900">7 kg</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenCredentialModal('boarding-pass')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Boarding Passes (2)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onNotify(
                            'Seat Map Opened',
                            'Current seats 12B (Window) & 12C (Aisle) are locked in Row 12.'
                          )
                        }
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <Armchair className="w-3.5 h-3.5" />
                        <span>Change Seat</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hotel Sub-Card (The Grand Azure Beachfront Resort & Spa) */}
                <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 relative">
                      <SafeImage
                        src={ASSETS.bali}
                        alt="The Grand Azure Beachfront Resort & Spa"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        ★ 5-Star Luxury
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-slate-900">
                          The Grand Azure Beachfront Resort & Spa
                        </h3>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-lg shrink-0">
                          3 Nights Stay
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Calangute Beachfront Road, North Goa, 403516</span>
                      </p>

                      <p className="text-xs text-slate-700 mt-2">
                        <strong>Room:</strong> Premium Beachfront Suite with Private
                        Jacuzzi
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Guests: Rahul Sharma (Primary), Pooja Sharma · Check-in: 16
                        Oct (02:00 PM) → Check-out: 19 Oct (11:00 AM)
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-700 mt-2.5">
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          🍴 Free Breakfast Buffet
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          🚕 Free Airport Cab Included
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          📅 Free Cancellation till 15 Oct, 2:00 PM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Actions Row */}
                  <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onNotify(
                          'Resort Location & Contacts',
                          'Calangute Beachfront Rd, North Goa · Front Desk: +91 832 278 9900'
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Hotel Directions & Contact
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onNotify(
                            'Early Check-in Priority Logged',
                            'Resort front desk notified for 12:00 PM arrival.'
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Request Early Check-in
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenCredentialModal('hotel-voucher')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download Voucher (PDF)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* TripProtect 360 Footer Bar */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm font-bold text-slate-900">
                          TripProtect 360° Comprehensive Active
                        </strong>
                        <span className="text-[10px] font-mono-tabular font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded">
                          Policy #TP-99214
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Medical coverage up to ₹5,00,000, baggage loss assurance &
                        100% trip cancellation cover.
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">
                      Total Package Value
                    </span>
                    <span className="font-display text-xl font-bold font-mono-tabular text-slate-900">
                      {formatPrice(34845, currency)}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Paid in Full · Inv #TY-INV-8841
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Trip History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Recent Trip History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Re-book past favorites or review bookings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('completed')}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  View All 12 Completed Trips →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <SafeImage
                        src={ASSETS.bangkok}
                        alt="Rajasthan Heritage Odyssey"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[10px] text-blue-600 font-bold">
                        <span>Completed · Sep 2025</span>
                        <span className="text-slate-400">5 Nights</span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-slate-900 truncate mt-0.5">
                        Rajasthan Heritage Odyssey
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        Udaipur & Jaipur Forts · 2 Guests
                      </p>
                      <span className="font-mono-tabular text-xs font-bold text-slate-900 mt-1 block">
                        ₹42,100
                      </span>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={onBookNewTrip}
                      className="text-blue-600 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Book Again</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onNotify('Invoice Downloaded', 'Saved TY-RAJ-2025.pdf')
                      }
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      ↓ Invoice
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <SafeImage
                        src={ASSETS.dubai}
                        alt="Dubai Skyline & Desert Safari"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[10px] text-blue-600 font-bold">
                        <span>Completed · May 2025</span>
                        <span className="text-slate-400">4 Nights</span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-slate-900 truncate mt-0.5">
                        Dubai Skyline & Desert Safari
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        Downtown Dubai & Desert Camp · 2 Guests
                      </p>
                      <span className="font-mono-tabular text-xs font-bold text-slate-900 mt-1 block">
                        ₹68,500
                      </span>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        onNotify('5-Star Review Submitted', 'Earned +150 TripPoints!')
                      }
                      className="text-blue-600 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3 h-3" />
                      <span>Review Stay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onNotify('Invoice Downloaded', 'Saved TY-DXB-2025.pdf')
                      }
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      ↓ Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (4 Cols): GOA ITINERARY PLAN, WEATHER, PLATINUM PERKS */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Goa Itinerary Plan */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Goa Itinerary Plan
                </h3>
                <span className="text-xs font-semibold text-blue-600">
                  Oct 16 – 19
                </span>
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
                {[
                  {
                    day: 'Day 1 · Thu 16 Oct',
                    title: 'Flight DEL → GOI & Beachfront Check-in',
                    desc: '08:30 AM arrival, airport transfer, 02:00 PM resort check-in, sunset dinner at Salina Coastal Dining.',
                    active: true,
                  },
                  {
                    day: 'Day 2 · Fri 17 Oct',
                    title: 'Spa Session & Water Sports',
                    desc: '11:00 AM complimentary Jiva Ayurvedic Spa Session; afternoon jet-skiing at Calangute.',
                    active: false,
                  },
                  {
                    day: 'Day 3 · Sat 18 Oct',
                    title: 'Saturday Night Market & Stroll',
                    desc: 'Arpora Night Bazaar, live music, beachside seafood dining at Baga.',
                    active: false,
                  },
                  {
                    day: 'Day 4 · Sun 19 Oct',
                    title: 'Checkout & Return Flight',
                    desc: '11:00 AM checkout, souvenir shopping in Panaji, 06:40 PM return flight to Delhi.',
                    active: false,
                  },
                ].map((item) => (
                  <div key={item.day} className="relative">
                    <span
                      className={`w-3 h-3 rounded-full absolute -left-5 top-1 border-2 border-white ${
                        item.active ? 'bg-blue-600' : 'bg-indigo-400'
                      }`}
                    />
                    <span className="text-[11px] font-bold text-blue-600 block">
                      {item.day}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  onNotify(
                    'Day Schedule Customizer',
                    'Concierge request sent to customize your Day 2 & Day 3 Goa activities.'
                  )
                }
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-blue-600 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Customize Day Schedule</span>
              </button>
            </div>

            {/* Destination Insight Card */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-slate-400">
                <span>DESTINATION INSIGHT</span>
                <span className="text-blue-600">North Goa</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-3xl font-bold font-mono-tabular text-slate-900">
                    28°C
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    Sunny · Light Ocean Breeze
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Sunset expected at 06:18 PM
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sun className="w-6 h-6" />
                </div>
              </div>

              <div className="relative h-24 rounded-2xl overflow-hidden bg-slate-100">
                <SafeImage
                  src={ASSETS.bali}
                  alt="Calangute & Baga Strip"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                  Calangute & Baga Strip
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center gap-2.5 text-xs">
                <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <strong className="text-slate-900 block">
                    TripYeah Goa Helpline:
                  </strong>
                  <span className="text-slate-500 font-mono-tabular text-[11px]">
                    +91 98765 43210 (Toll Free 24/7)
                  </span>
                </div>
              </div>
            </div>

            {/* Platinum Member Perks Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] text-white p-5 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-300" />
                <h3 className="font-display text-base font-bold">
                  Platinum Member Perks
                </h3>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Unlocked privileges currently active on your account for this trip:
              </p>
              <ul className="space-y-2 text-xs text-blue-50">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>10% Discount on In-flight Meals & Beverages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Priority Check-In & Room Upgrade eligibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>2x TripPoints on all local dining & activities</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() =>
                  onNotify(
                    'Platinum Rewards Catalog',
                    'You have 2,705 TripPoints ready for lounge passes & upgrades.'
                  )
                }
                className="w-full py-2.5 rounded-xl bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold shadow-xs cursor-pointer"
              >
                Explore Tier Rewards Catalog
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
