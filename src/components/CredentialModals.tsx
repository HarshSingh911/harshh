import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  Plane,
  MapPin,
  Mail,
  Phone,
  Utensils,
  Car,
  Wifi,
  Sparkles,
  Clock,
  AlertTriangle,
  Lock,
  CheckCircle2,
  QrCode,
  User,
} from 'lucide-react';
import { ASSETS } from '../data/travelData';
import { SafeImage } from './SafeImage';

export type ActiveCredentialModal = 'boarding-pass' | 'hotel-voucher' | 'cancel-refund' | null;

interface CredentialModalsProps {
  activeModal: ActiveCredentialModal;
  onClose: () => void;
  onConfirmCancellation: (refundAmountInr: number, reason: string) => void;
  onNotify: (title: string, detail: string) => void;
}

export const CredentialModals: React.FC<CredentialModalsProps> = ({
  activeModal,
  onClose,
  onConfirmCancellation,
  onNotify,
}) => {
  // Boarding Pass state (Image 4)
  const [selectedPassenger, setSelectedPassenger] = useState<1 | 2>(1);

  // Cancel & Refund state (Image 6)
  const [cancelFlight, setCancelFlight] = useState<boolean>(true);
  const [cancelResort, setCancelResort] = useState<boolean>(true);
  const [cancelReason, setCancelReason] = useState<string>(
    'Change of travel dates / personal plans'
  );
  const [cancelFeedback, setCancelFeedback] = useState<string>('');

  if (!activeModal) return null;

  const flightValue = 8900;
  const flightPenalty = 6000; // ₹3,000/passenger x 2
  const resortValue = 25497;
  const resortPenalty = 0; // 100% Free Cancellation eligible

  const selectedOriginalTotal =
    (cancelFlight ? flightValue : 0) + (cancelResort ? resortValue : 0);
  const totalDeductions =
    (cancelFlight ? flightPenalty : 0) + (cancelResort ? resortPenalty : 0);
  const netRefund = Math.max(0, selectedOriginalTotal - totalDeductions);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/65 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* =====================================================================
          IMAGE 4: DIGITAL BOARDING PASS & FLIGHT TICKET MODAL
      ===================================================================== */}
      {activeModal === 'boarding-pass' && (
        <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
          {/* Top Header */}
          <div className="p-5 sm:p-7 border-b border-slate-100 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-blue-600 uppercase mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Verified E-Ticket & Security Clearance</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Digital Boarding Pass & Flight Ticket
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Booking Ref:{' '}
                <strong className="text-slate-800 font-mono-tabular">
                  TY-8841-GOA
                </strong>{' '}
                · Airline PNR:{' '}
                <strong className="text-blue-600 font-mono-tabular">
                  6E-W8X9Q2
                </strong>{' '}
                · Issued: 15 Oct 2025
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onNotify(
                    'Boarding Pass PDF Downloaded',
                    'Saved 6E-2134_BoardingPass_TY-8841-GOA.pdf to your device.'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onNotify(
                    'Boarding Pass Link Copied',
                    'Ready to share via WhatsApp or Email.'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center ml-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Passenger Switcher & DigiYatra Status Row */}
          <div className="px-5 sm:px-7 py-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedPassenger(1)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPassenger === 1
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Passenger 1: Rahul Sharma</span>
                <span
                  className={`font-mono-tabular text-[11px] px-1.5 py-0.5 rounded ${
                    selectedPassenger === 1
                      ? 'bg-blue-800/80 text-white'
                      : 'bg-slate-300/70 text-slate-700'
                  }`}
                >
                  12B · Win
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPassenger(2)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPassenger === 2
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Passenger 2: Pooja Sharma</span>
                <span className="font-mono-tabular text-[11px] opacity-80">
                  12C · Aisle
                </span>
              </button>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>DigiYatra Biometric Enrolled · Gate T3 Auto-Pass</span>
            </div>
          </div>

          {/* Main Boarding Pass + Stub Ticket Container */}
          <div className="p-5 sm:p-7 bg-slate-50/40">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left Main Boarding Pass (8 Cols) */}
              <div className="lg:col-span-8 p-6 border-b lg:border-b-0 lg:border-r border-dashed border-slate-300">
                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 -mx-6 -mt-6 mb-5" />

                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-xs">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          IndiGo Airlines
                        </h3>
                        <span className="font-mono-tabular text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          6E-2134
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Aircraft: Airbus A321neo · Operates On-Time (98.4%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      Economy Premium
                    </span>
                    <span className="text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                      ● Web Check-in Done
                    </span>
                  </div>
                </div>

                {/* Route & Timing Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-3 items-center gap-4 mb-6">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono-tabular text-slate-900">
                      06:15
                    </div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      DEL · New Delhi
                    </div>
                    <div className="text-xs text-slate-500">
                      Indira Gandhi Intl, Terminal 3
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs font-mono-tabular text-slate-500 mb-1">
                      2h 15m · Non-stop
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-full h-px bg-blue-200" />
                      <Plane className="w-4 h-4 text-blue-600 mx-2 shrink-0" />
                      <div className="w-full h-px bg-blue-200" />
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600 mt-1">
                      Gate Closes 05:55 AM
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold font-mono-tabular text-slate-900">
                      08:30
                    </div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      GOI · Goa Dabolim
                    </div>
                    <div className="text-xs text-slate-500">
                      Dabolim International, Terminal 1
                    </div>
                  </div>
                </div>

                {/* Gate, Seat, Boarding Time, Sequence */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block">PASSENGER</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                      {selectedPassenger === 1 ? 'Rahul Sharma' : 'Pooja Sharma'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block">DEPARTURE GATE</span>
                    <span className="font-mono-tabular font-bold text-blue-600 text-sm mt-0.5 block">
                      Gate 14B (T3)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block">BOARDING TIME</span>
                    <span className="font-mono-tabular font-bold text-slate-900 text-sm mt-0.5 block">
                      05:30 AM · Zone 1
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                    <span className="text-blue-600 font-semibold block">
                      ASSIGNED SEAT
                    </span>
                    <span className="font-mono-tabular font-bold text-blue-700 text-base mt-0.5 block">
                      {selectedPassenger === 1 ? '12B (Window)' : '12C (Aisle)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Boarding Pass Stub (4 Cols) */}
              <div className="lg:col-span-4 p-6 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Boarding Pass Stub
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
                      PRIORITY
                    </span>
                  </div>

                  <h4 className="font-display text-lg font-bold text-slate-900">
                    {selectedPassenger === 1 ? 'Rahul Sharma' : 'Pooja Sharma'}
                  </h4>
                  <p className="text-xs font-mono-tabular text-slate-600 mt-0.5">
                    DEL → GOI · 6E-2134
                  </p>

                  <div className="grid grid-cols-2 gap-3 my-4 pt-4 border-t border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-400 block">DATE</span>
                      <span className="font-mono-tabular font-bold text-slate-900">
                        16 OCT 2025
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">SEAT</span>
                      <span className="font-mono-tabular font-bold text-blue-600">
                        {selectedPassenger === 1 ? '12B' : '12C'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">SEQ NO</span>
                      <span className="font-mono-tabular font-bold text-slate-900">
                        {selectedPassenger === 1 ? 'SEQ-042' : 'SEQ-043'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">BAGGAGE</span>
                      <span className="font-mono-tabular font-bold text-slate-900">
                        15kg + 7kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barcode & QR Graphic */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                  <QrCode className="w-14 h-14 text-slate-900 shrink-0" />
                  <div className="text-[11px] text-slate-500 leading-snug">
                    <p className="font-bold text-slate-800">
                      DigiYatra & CISF Gate Scan
                    </p>
                    <p className="font-mono-tabular text-[10px] text-slate-400 mt-0.5">
                      6E2134-TY8841GOA-{selectedPassenger === 1 ? '12B' : '12C'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          IMAGE 5: HOTEL BOOKING VOUCHER & STAY CONFIRMATION MODAL
      ===================================================================== */}
      {activeModal === 'hotel-voucher' && (
        <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>INSTANT CONFIRMED HOTEL VOUCHER</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onNotify(
                      'Hotel Voucher Downloaded',
                      'GrandAzureGoa_Voucher_TY-8841-GOA.pdf saved.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onNotify(
                      'Hotel Voucher Shared',
                      'Voucher link copied to clipboard.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close voucher"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Reference Codes */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  Hotel Booking Voucher & Stay
                  <br />
                  Confirmation
                </h2>
                <p className="text-xs text-slate-500 mt-1.5">
                  Official express check-in travel credentials guaranteed by
                  TripYeah Partners
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="flex flex-wrap sm:justify-end gap-2 text-xs font-mono-tabular font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                    TY REF: TY-8841-GOA
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                    HOTEL PIN: GABR-88492-X
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Booked 14 Oct 2025
                </p>
              </div>
            </div>

            {/* Property Overview Card */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                  <SafeImage
                    src={ASSETS.bali}
                    alt="The Grand Azure Beachfront Resort & Spa, Goa"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ★ 5.0
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white bg-blue-600 px-2 py-0.5 rounded">
                      5-Star Luxury Resort
                    </span>
                    <span className="text-slate-600 font-medium">
                      ✓ Beachfront Certified
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                    The Grand Azure Beachfront Resort & Spa, Goa
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Calangute Beachfront Road, North Goa, 403516</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3" /> frontdesk@grandazuregoa.com
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono-tabular">
                      <Phone className="w-3 h-3" /> +91 832 278 9900
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3 text-center shrink-0 self-stretch sm:self-auto flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Stay Duration
                </span>
                <span className="font-display text-xl font-bold text-blue-600 mt-0.5">
                  3 Nights
                </span>
                <span className="text-xs text-slate-500">2 Adults · 1 Room</span>
              </div>
            </div>

            {/* Check-In / Check-Out / Room Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Check-In
                  </span>
                  <div className="text-base font-bold text-slate-900 mt-2">
                    Thu, 16 Oct 2025
                  </div>
                  <div className="text-xs font-semibold text-blue-600 mt-0.5">
                    From 02:00 PM
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-4">
                  Standard Front Desk Check-in
                </p>
              </div>

              <div className="md:col-span-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Check-Out
                  </span>
                  <div className="text-base font-bold text-slate-900 mt-2">
                    Sun, 19 Oct 2025
                  </div>
                  <div className="text-xs font-semibold text-blue-600 mt-0.5">
                    Until 11:00 AM
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-4">
                  Late check-out on request
                </p>
              </div>

              <div className="md:col-span-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Room Selection & Meal Inclusions
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1.5">
                  Premium Beachfront Suite with Private Jacuzzi
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  1 King Bed · Arabian Sea Panoramic View · 680 sq.ft · Balcony
                  Deck
                </p>
                <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-blue-900">
                  <Utensils className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Complimentary Daily Lavish Breakfast & Sunset High Tea Included
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Guests & Privileges */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registered Guests
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Rahul Sharma
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Lead Traveler · +91 98765 43210
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Pooja Sharma
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Accompanying Adult Guest
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  TripYeah Privileges & Preferences
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">Free Roundtrip Airport Cab</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">300 Mbps Wi-Fi</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">₹2,000 Spa Credit (Jiva)</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">Early Check-in Requested</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2.5">
                  <strong>Special Request:</strong> Upper floor ocean-facing room
                  assigned. Non-smoking.
                </p>
              </div>
            </div>

            {/* Express Frontdesk Check-in QR */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shrink-0">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <span>Express Frontdesk Check-in QR</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Scan at the resort lobby smart kiosk or show directly to the
                  receptionist. Avoid the queues for instant digital room keycard
                  handover.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          IMAGE 6: CANCEL BOOKING & REQUEST REFUND MODAL
      ===================================================================== */}
      {activeModal === 'cancel-refund' && (
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
          <div className="p-6 sm:p-7 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display text-xl font-bold text-slate-900">
                      Cancel Booking & Request Refund
                    </h2>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                      Action Irreversible
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking ID: <strong className="text-slate-700">TY-8841-GOA</strong> ·
                    Goa Beachfront Escape & Flights (DEL ⇄ GOI)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guarantee Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block">
                  TripYeah Instant Refund Guarantee
                </strong>
                Refund computation is calculated based on fare rules, supplier
                penalty windows, and your active policy timestamp.
              </div>
            </div>

            {/* 1. Select Components to Cancel */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-slate-900">
                  1. Select Components to Cancel
                </span>
                <span className="font-semibold text-blue-600">
                  {(cancelFlight ? 1 : 0) + (cancelResort ? 1 : 0)} of 2 Selected
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Flight Component */}
                <label className="block p-4 rounded-2xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={cancelFlight}
                        onChange={() => setCancelFlight((p) => !p)}
                        className="w-4 h-4 mt-1 rounded text-blue-600 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            Flight
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            IndiGo 6E-2134 & 6E-2981
                          </span>
                          <span className="text-slate-500">(DEL ⇄ GOI)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          2 Passengers: Rahul Sharma, Pooja Sharma · 16 Oct – 19 Oct
                          2025
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-tabular font-bold text-slate-900 text-sm">
                      ₹8,900
                    </span>
                  </div>
                  <div className="mt-2.5 ml-7 px-3 py-1.5 rounded-lg bg-slate-50 text-[11px] text-slate-600">
                    ⓘ Airline policy: Standard statutory cancellation fee of{' '}
                    <strong>₹3,000/passenger</strong> applies within 72 hrs.
                  </div>
                </label>

                {/* Resort Component */}
                <label className="block p-4 rounded-2xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={cancelResort}
                        onChange={() => setCancelResort((p) => !p)}
                        className="w-4 h-4 mt-1 rounded text-blue-600 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            Resort
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            The Grand Azure Beachfront Resort & Spa
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Premium Beachfront Suite · 3 Nights · Calangute Beach,
                          North Goa
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-tabular font-bold text-slate-900 text-sm">
                      ₹25,497
                    </span>
                  </div>
                  <div className="mt-2.5 ml-7 px-3 py-1.5 rounded-lg bg-blue-50/70 text-[11px] text-blue-800 font-medium">
                    ✓ <strong>100% Free Cancellation</strong> eligible until 15 Oct,
                    02:00 PM (Zero penalty applied).
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Reason for Cancellation */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-slate-900">
                  2. Reason for Cancellation
                </span>
                <span className="text-slate-400">Mandatory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Change of travel dates / personal plans',
                  'Medical or family emergency',
                  'Found a better deal / alternate booking',
                  'Flight schedule change / disruption',
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      cancelReason === reason
                        ? 'border-blue-600 bg-blue-50/40 text-slate-900'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      checked={cancelReason === reason}
                      onChange={() => setCancelReason(reason)}
                      className="text-blue-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <input
                type="text"
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                placeholder="Tell us more about your cancellation reason (optional feedback)..."
                className="w-full mt-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* 3. Refund Calculation Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                <span>3. Refund Calculation Breakdown</span>
                <span className="text-[11px] font-semibold text-blue-600">
                  Live Fare Audit
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Selected Components Value</span>
                <span className="font-mono-tabular">
                  ₹{selectedOriginalTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Supplier Cancellation Fee</span>
                <span className="font-mono-tabular">
                  -₹{totalDeductions.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-emerald-700 pt-1 border-t border-slate-200">
                <span>Estimated Instant Refund to Original Source</span>
                <span className="font-mono-tabular">
                  ₹{netRefund.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted 256-bit cancellation protocol</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  Keep My Booking
                </button>
                <button
                  type="button"
                  disabled={!cancelFlight && !cancelResort}
                  onClick={() => onConfirmCancellation(netRefund, cancelReason)}
                  className="px-5 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Confirm & Submit Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
