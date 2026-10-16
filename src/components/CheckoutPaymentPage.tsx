import React, { useState } from 'react';
import {
  Check,
  Plane,
  ShieldCheck,
  Leaf,
  Lock,
  QrCode,
  CreditCard,
  Building,
  Wallet,
  Phone,
  Tag,
  Sparkles,
  User,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { ASSETS, CurrencyCode, formatPrice } from '../data/travelData';
import { SafeImage } from './SafeImage';

interface CheckoutPaymentPageProps {
  currency: CurrencyCode;
  selectedOptionTitle?: string;
  onConfirmPayment: (totalPaidInr: number, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string) => void;
}

export const CheckoutPaymentPage: React.FC<CheckoutPaymentPageProps> = ({
  currency,
  selectedOptionTitle,
  onConfirmPayment,
  onBackToResults,
  onNotify,
}) => {
  // Passenger & Guest Form State
  const [leadName, setLeadName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [phone, setPhone] = useState('9876543210');
  const [secondGuest, setSecondGuest] = useState('Pooja Sharma');
  const [hasGst, setHasGst] = useState(false);

  // Hotel Preferences
  const [prefEarlyCheckin, setPrefEarlyCheckin] = useState(true);
  const [prefHighFloor, setPrefHighFloor] = useState(true);
  const [prefDoubleBed, setPrefDoubleBed] = useState(false);
  const [prefQuietRoom, setPrefQuietRoom] = useState(false);

  // Insurance & Add-ons
  const [protectTrip, setProtectTrip] = useState(true);
  const [carbonOffset, setCarbonOffset] = useState(true);
  const [redeemPoints, setRedeemPoints] = useState(false);

  // Coupon State
  const [couponApplied, setCouponApplied] = useState<string | null>('TRIPSTEAL');
  const [customCouponInput, setCustomCouponInput] = useState('');

  // Payment Method State
  const [payTab, setPayTab] = useState<'upi' | 'card' | 'netbanking' | 'emi'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [upiVpa, setUpiVpa] = useState('rahulsharma@okaxis');
  const [vpaVerified, setVpaVerified] = useState(true);

  // Price Calculation matching Image 2 (₹34,845 default)
  const baseStayInr = 25497;
  const returnFlightsInr = 8900;
  const insuranceInr = protectTrip ? 498 : 0;
  const carbonInr = carbonOffset ? 45 : 0;
  const taxesInr = 1450;
  const couponDiscountInr =
    couponApplied === 'TRIPSTEAL'
      ? 1500
      : couponApplied === 'FEDERAL2000'
      ? 2000
      : couponApplied === 'FLYYEAH'
      ? 1800
      : 0;
  const memberLoyaltyDiscountInr = 2045;
  const walletPointsDiscountInr = redeemPoints ? 2705 : 0;

  const totalPayableInr =
    baseStayInr +
    returnFlightsInr +
    insuranceInr +
    carbonInr +
    taxesInr -
    couponDiscountInr -
    memberLoyaltyDiscountInr -
    walletPointsDiscountInr;

  const totalSavedInr =
    couponDiscountInr + memberLoyaltyDiscountInr + walletPointsDiscountInr;

  const handleApplyCustomCoupon = () => {
    const code = customCouponInput.trim().toUpperCase();
    if (!code) return;
    setCouponApplied(code);
    setCustomCouponInput('');
    onNotify(
      `Coupon ${code} Applied!`,
      'Instant bundle discount updated in your price summary.'
    );
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-14">
      {/* Top 4-Step Progress Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={onBackToResults}
              className="flex items-center gap-1.5 text-blue-600 hover:underline cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">
                <Check className="w-3 h-3" />
              </span>
              <span>Itinerary</span>
            </button>
            <span className="w-6 sm:w-10 h-0.5 bg-blue-600" />
            <div className="flex items-center gap-1.5 text-blue-600">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">
                <Check className="w-3 h-3" />
              </span>
              <span>Guests</span>
            </div>
            <span className="w-6 sm:w-10 h-0.5 bg-blue-600" />
            <div className="flex items-center gap-1.5 text-blue-600">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">
                <Check className="w-3 h-3" />
              </span>
              <span>Add-ons</span>
            </div>
            <span className="w-6 sm:w-10 h-0.5 bg-blue-600" />
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-[11px]">
                4
              </span>
              <span>Payment</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-semibold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>
              Session expires in{' '}
              <strong className="font-mono-tabular">14:26 mins</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. CURATED LUXURY BUNDLE SUMMARY */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                  CURATED LUXURY BUNDLE
                </span>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  Booking ID:{' '}
                  <strong className="text-slate-900">TY-8841-GOA</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={onBackToResults}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <span>View Itinerary Breakdown</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Resort Card */}
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                <SafeImage
                  src={ASSETS.bali}
                  alt="The Grand Azure Beachfront Resort & Spa, Goa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-500">
                  <span>★★★★★</span>
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    5-Star Luxury Resort
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  The Grand Azure Beachfront Resort & Spa, Goa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Premium Beachfront Suite with Private Jacuzzi · 3 Nights (16 Oct
                  – 19 Oct 2025) · 2 Adults
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-blue-700 mt-2">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                    ✓ Free Breakfast Included
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                    ✓ Free Airport Cab
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                    ✓ Free Cancellation till 15 Oct
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Strip */}
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <strong className="text-slate-900 font-bold">
                      {selectedOptionTitle || 'IndiGo 6E-2134'}
                    </strong>
                    <span className="text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Economy · Regular
                    </span>
                  </div>
                  <div className="text-xs font-mono-tabular font-bold text-slate-800 mt-1">
                    06:15 DEL T2 ──── 2h 15m ──── 08:30 GOI T1
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold text-blue-600 font-mono-tabular">
                DEL → GOI (Non-stop · 2h 15m)
              </span>
            </div>
          </div>

          {/* 2. PRIMARY CONTACT & GUEST DETAILS */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Primary Contact & Guest Details
                </h2>
                <p className="text-xs text-slate-500">
                  E-tickets, hotel vouchers, and live gate alerts will be sent here.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLeadName('Rahul Sharma');
                    setEmail('rahul.sharma@example.com');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold cursor-pointer"
                >
                  Self: Rahul S.
                </button>
                <button
                  type="button"
                  onClick={() => setSecondGuest('Pooja Sharma')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  + Pooja Sharma
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lead Passenger Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address (For Vouchers & PNR) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number (For WhatsApp Updates) *
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono-tabular font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Second Guest Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={secondGuest}
                    onChange={(e) => setSecondGuest(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hasGst}
                onChange={() => setHasGst((p) => !p)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>
                I have a GST number (claim up to 18% Input Tax Credit on business
                travel)
              </span>
            </label>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-2.5">
                Complimentary Hotel Preferences:
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefEarlyCheckin}
                    onChange={() => setPrefEarlyCheckin((p) => !p)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Early Check-in priority</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefHighFloor}
                    onChange={() => setPrefHighFloor((p) => !p)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>High floor / Sea-facing suite</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefDoubleBed}
                    onChange={() => setPrefDoubleBed((p) => !p)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Large Double Bed</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefQuietRoom}
                    onChange={() => setPrefQuietRoom((p) => !p)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Quiet room away from elevator</span>
                </label>
              </div>
            </div>
          </div>

          {/* 3. TRIPPROTECT 360 TRAVEL INSURANCE */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  TripProtect 360° Travel Insurance
                </h2>
                <p className="text-xs text-slate-500">
                  Comprehensive medical, trip cancellation, and flight delay coverage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <strong className="text-slate-900 block mb-1">
                  ✈️ Flight Delay & Lost Baggage
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Up to ₹25,000 reimbursement for delayed or lost check-in luggage.
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <strong className="text-slate-900 block mb-1">
                  🏥 Emergency Medical Care
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Cashless hospitalization in Goa up to ₹5,00,000 for both guests.
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <strong className="text-slate-900 block mb-1">
                  🛡️ Last-minute Interruption
                </strong>
                <span className="text-slate-500 text-[11px]">
                  100% refund on unused hotel nights & return flights in case of
                  illness.
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                  protectTrip
                    ? 'bg-blue-50/40 border-blue-400'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="tripProtect"
                    checked={protectTrip}
                    onChange={() => setProtectTrip(true)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Yes, Protect my entire trip
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Recommended · 94% of Goa travelers choose this
                    </span>
                  </div>
                </div>
                <span className="font-mono-tabular text-xs sm:text-sm font-bold text-blue-600">
                  +₹498
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                  !protectTrip
                    ? 'bg-blue-50/40 border-blue-400'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="tripProtect"
                    checked={!protectTrip}
                    onChange={() => setProtectTrip(false)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">
                      No, I will risk my travel without insurance
                    </span>
                    <span className="text-[11px] text-slate-400">
                      You may bear full financial liability for cancellations &
                      emergencies
                    </span>
                  </div>
                </div>
                <span className="font-mono-tabular text-xs text-slate-400">₹0</span>
              </label>
            </div>

            {/* Carbon Footprint Offset Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Offset Flight & Hotel Carbon Footprint
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Neutralize approx. 210 kg CO₂ with certified forest regeneration
                    in Western Ghats.
                  </span>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={carbonOffset}
                  onChange={() => setCarbonOffset((p) => !p)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-mono-tabular text-xs font-bold text-blue-600">
                  +₹45
                </span>
              </label>
            </div>
          </div>

          {/* 4. SELECT SECURE PAYMENT METHOD */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Select Secure Payment Method
                </h2>
                <p className="text-xs text-slate-500">
                  All transactions are encrypted with 256-bit SSL protocols
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>RBI COMPLIANT TOKENIZATION</span>
              </span>
            </div>

            {/* TripYeah Wallet Rewards Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    TripYeah Wallet Rewards
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Available Balance: 2,705 TripPoints (1 Point = ₹1.00)
                  </div>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={redeemPoints}
                  onChange={() => setRedeemPoints((p) => !p)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Redeem 2,705 Points (-₹2,705)</span>
              </label>
            </div>

            {/* Payment Tabs + UPI / Card Panel */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Payment Tabs */}
              <div className="md:col-span-4 space-y-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building },
                  { id: 'emi', label: '0% EMI / Pay Later', icon: Wallet },
                ].map((pt) => {
                  const Icon = pt.icon;
                  const active = payTab === pt.id;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() =>
                        setPayTab(pt.id as 'upi' | 'card' | 'netbanking' | 'emi')
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? 'bg-indigo-50 text-blue-700 border border-blue-300'
                          : 'bg-slate-50 text-slate-700 border border-slate-200/70 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{pt.label}</span>
                      </span>
                      <span>›</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Active Payment Box */}
              <div className="md:col-span-8 p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Pay Instantly using UPI
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Fastest
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'gpay', label: 'Google Pay' },
                    { id: 'phonepe', label: 'PhonePe' },
                    { id: 'paytm', label: 'Paytm / Others' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedUpiApp === app.id
                          ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>

                <div className="text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  OR ENTER VIRTUAL PAYMENT ADDRESS
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enter UPI ID / VPA
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => {
                        setUpiVpa(e.target.value);
                        setVpaVerified(false);
                      }}
                      placeholder="yourusername@okaxis"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono-tabular focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVpaVerified(true);
                        onNotify(
                          'UPI VPA Verified',
                          `Verified ${upiVpa} (Rahul Sharma - Axis Bank).`
                        );
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#3730A3] hover:bg-indigo-900 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                    >
                      {vpaVerified ? 'Verified ✓' : 'Verify VPA'}
                    </button>
                  </div>
                </div>

                {/* Scan QR Box */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-4">
                  <QrCode className="w-12 h-12 text-slate-900 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Scan QR with any Banking App
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Supports BHIM, Google Pay, CRED, PayZapp & 140+ mobile banking
                      apps.
                    </p>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      ✓ Instant auto-approval
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Confirm & Pay Row */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  PCI-DSS Level 1 256-Bit Encrypted Checkout · Instant PNR & Hotel
                  Voucher
                </span>
              </div>

              <button
                type="button"
                onClick={() => onConfirmPayment(totalPayableInr, leadName)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] hover:brightness-105 text-white text-sm font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  Pay {formatPrice(totalPayableInr, currency)} & Confirm Booking
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 Cols): PREVIEW, COUPONS, PRICE SUMMARY */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Trip Summary Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-200/85 overflow-hidden shadow-2xs">
            <div className="relative h-40">
              <SafeImage
                src={ASSETS.bali}
                alt="Goa Luxury Getaway"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 px-2 py-0.5 rounded">
                  GOA LUXURY GETAWAY
                </span>
                <h3 className="font-display text-base font-bold mt-1">
                  3 Nights · Beachfront Suite + Flights
                </h3>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between text-xs text-slate-600">
              <div>
                <div className="font-bold text-slate-900">
                  16 Oct - 19 Oct 2025
                </div>
                <div className="text-[11px] text-slate-500">
                  ✈️ DEL ⇄ GOI (IndiGo 6E)
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">2 Guests · 1 Suite</div>
                <div className="text-[11px] text-emerald-600 font-semibold">
                  Confirmed Seats
                </div>
              </div>
            </div>
          </div>

          {/* Coupons & Bank Offers */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-2xs space-y-3.5">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Coupons & Bank Offers
            </h3>

            {couponApplied && (
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {couponApplied} Applied
                    </div>
                    <div className="text-[11px] text-indigo-700">
                      ₹{couponDiscountInr.toLocaleString('en-IN')} instant bundle
                      discount
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCouponApplied(null)}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={customCouponInput}
                onChange={(e) => setCustomCouponInput(e.target.value)}
                placeholder="HAVE ANOTHER COUPON CODE"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono-tabular uppercase focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleApplyCustomCoupon}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
              >
                Apply
              </button>
            </div>

            <div className="text-[11px] text-slate-500">
              More available:{' '}
              <button
                type="button"
                onClick={() => setCouponApplied('FEDERAL2000')}
                className="font-mono-tabular font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                FEDERAL2000
              </button>
              ,{' '}
              <button
                type="button"
                onClick={() => setCouponApplied('FLYYEAH')}
                className="font-mono-tabular font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                FLYYEAH
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-2xs space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">
              Price Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex justify-between">
                <span>Base Stay Fare (3 Nights, 2 Adults)</span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  {formatPrice(baseStayInr, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Return Flights (IndiGo · 2 Pax)</span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  {formatPrice(returnFlightsInr, currency)}
                </span>
              </div>
              {protectTrip && (
                <div className="flex justify-between">
                  <span>TripProtect 360° Insurance</span>
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {formatPrice(insuranceInr, currency)}
                  </span>
                </div>
              )}
              {carbonOffset && (
                <div className="flex justify-between">
                  <span>Western Ghats Carbon Offset</span>
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {formatPrice(carbonInr, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Hotel & Aviation Taxes (GST 12%)</span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  {formatPrice(taxesInr, currency)}
                </span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Code ({couponApplied})</span>
                  <span className="font-mono-tabular">
                    -{formatPrice(couponDiscountInr, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-blue-600 font-medium">
                <span>TripYeah Member Loyalty Savings</span>
                <span className="font-mono-tabular">
                  -{formatPrice(memberLoyaltyDiscountInr, currency)}
                </span>
              </div>
              {redeemPoints && (
                <div className="flex justify-between text-indigo-600 font-medium">
                  <span>TripPoints Redeemed</span>
                  <span className="font-mono-tabular">
                    -{formatPrice(walletPointsDiscountInr, currency)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Total Amount Payable
                </span>
                <span className="text-[10px] text-slate-500">
                  Inclusive of all taxes & fees
                </span>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-bold font-mono-tabular text-blue-700 block">
                  {formatPrice(totalPayableInr, currency)}
                </span>
                <span className="text-[10px] font-bold text-emerald-700">
                  You saved {formatPrice(totalSavedInr, currency)} on this trip!
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>100% Free Cancellation</strong> till 15 Oct, 02:00 PM.
                Instant refund directly to payment source.
              </span>
            </div>
          </div>

          {/* Need Booking Help */}
          <div className="bg-white rounded-2xl border border-slate-200/85 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 block">
                  Need booking help?
                </strong>
                <span className="text-slate-500 font-mono-tabular">
                  Call our Goa VIP Desk: +91 98765 43210
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
