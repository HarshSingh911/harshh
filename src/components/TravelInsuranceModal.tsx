import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Sparkles,
  HeartHandshake,
  Plane,
  Briefcase,
  AlertCircle,
  FileCheck2,
  Calendar,
  Users,
  ChevronRight,
  Clock,
  PhoneCall,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';

interface TravelInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
}

export const TravelInsuranceModal: React.FC<TravelInsuranceModalProps> = ({
  isOpen,
  onClose,
  currency,
  onNotify,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'domestic' | 'international' | 'annual'>('domestic');
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [tripDays, setTripDays] = useState<number>(5);
  const [travelerName, setTravelerName] = useState<string>('Rahul Sharma');
  const [travelerEmail, setTravelerEmail] = useState<string>('rahul.sharma@example.com');
  const [travelerPhone, setTravelerPhone] = useState<string>('+91 98765 43210');
  const [activeTab, setActiveTab] = useState<'quote' | 'coverage' | 'claims'>('quote');
  const [isPolicyPurchased, setIsPolicyPurchased] = useState<boolean>(false);
  const [policyNumber, setPolicyNumber] = useState<string>('');

  if (!isOpen) return null;

  // Plan pricing base in INR
  const planRates = {
    domestic: 149,
    international: 499,
    annual: 1999,
  };

  const calculateTotalInr = () => {
    if (selectedPlan === 'annual') {
      return planRates.annual * travelersCount;
    }
    const daysMultiplier = Math.max(1, Math.ceil(tripDays / 4));
    return planRates[selectedPlan] * travelersCount * daysMultiplier;
  };

  const totalPayableInr = calculateTotalInr();

  const handlePurchasePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedPolicy = `TY-INS-${Math.floor(100000 + Math.random() * 900000)}`;
    setPolicyNumber(generatedPolicy);
    setIsPolicyPurchased(true);
    onNotify(
      'Travel Insurance Activated!',
      `Policy #${generatedPolicy} issued successfully for ${travelerName}. Instant policy document sent to ${travelerEmail}.`,
      'success'
    );
  };

  const handleCloseAndReset = () => {
    setIsPolicyPurchased(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={handleCloseAndReset}
            className="absolute right-4 top-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close insurance modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              TripProtect 360° Comprehensive Coverage
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white flex items-center gap-2.5">
            <span>TripYeah Travel Insurance</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Protect your journeys against medical emergencies, flight delays, baggage loss, and trip cancellations with cashless hospitalization worldwide.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => setActiveTab('quote')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quote'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Get Instant Quote & Buy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('coverage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'coverage'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Coverage Table & Limits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('claims')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'claims'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              24x7 Claims & Assistance
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {isPolicyPurchased ? (
            /* Success State */
            <div className="text-center py-6 sm:py-8 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Instant Policy Confirmed
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 font-display">
                  You’re Fully Protected!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your policy certificate <strong className="text-slate-900 font-mono">{policyNumber}</strong> is active. Digital policy kit & cashless card have been emailed to <strong className="text-slate-900">{travelerEmail}</strong>.
                </p>
              </div>

              {/* Policy Snapshot Card */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Insured Traveler:</span>
                  <span className="font-bold text-slate-900">{travelerName} ({travelersCount} Person)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Plan Type:</span>
                  <span className="font-bold text-emerald-700 capitalize">{selectedPlan} Travel Cover</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Emergency Medical Cover:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {selectedPlan === 'domestic' ? '₹5,00,000' : '$100,000 USD'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">24x7 Medical Helpline:</span>
                  <span className="font-bold text-indigo-600 font-mono">+91 1800-TRIP-CARE</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : activeTab === 'quote' ? (
            /* Tab 1: Quote & Buy */
            <form onSubmit={handlePurchasePolicy} className="space-y-6">
              {/* Step 1: Select Plan Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Choose Your Protection Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Domestic */}
                  <div
                    onClick={() => setSelectedPlan('domestic')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === 'domestic'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">Domestic India</span>
                      <span className="text-xs font-mono font-black text-emerald-700">
                        {formatPrice(planRates.domestic, currency)}/trip
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Best for flights, trains, and staycations in India. Covers hospitalization, missed flight, and baggage.
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>₹5 Lakh Medical Cover</span>
                    </div>
                  </div>

                  {/* International */}
                  <div
                    onClick={() => setSelectedPlan('international')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === 'international'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">Global Explorer</span>
                      <span className="text-xs font-mono font-black text-emerald-700">
                        {formatPrice(planRates.international, currency)}/trip
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Essential for overseas vacations, Schengen & US visas. Cashless hospital network worldwide.
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>$100,000 USD Medical</span>
                    </div>
                  </div>

                  {/* Annual */}
                  <div
                    onClick={() => setSelectedPlan('annual')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === 'annual'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">Multi-Trip Annual</span>
                      <span className="text-xs font-mono font-black text-emerald-700">
                        {formatPrice(planRates.annual, currency)}/yr
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Unlimited trips throughout 365 days. Perfect for business travelers & frequent holidaymakers.
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>365 Days Unlimited Cover</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Trip Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Number of Travelers</span>
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold font-mono text-sm text-slate-900">
                      {travelersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelersCount(Math.min(8, travelersCount + 1))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-xs text-slate-500">
                      ({travelersCount} Adult{travelersCount > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {selectedPlan !== 'annual' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Trip Duration (Days)</span>
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={tripDays}
                        onChange={(e) => setTripDays(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-500">days of travel</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Primary Traveler Details */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Primary Insured Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="As per passport / Aadhaar"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Email for Policy Delivery
                    </label>
                    <input
                      type="email"
                      required
                      value={travelerEmail}
                      onChange={(e) => setTravelerEmail(e.target.value)}
                      placeholder="Instant PDF sent here"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={travelerPhone}
                      onChange={(e) => setTravelerPhone(e.target.value)}
                      placeholder="For SMS alerts"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Total & Action Strip */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Total Premium Payable</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {formatPrice(totalPayableInr, currency)}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Zero Deductible · All Taxes Included
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCloseAndReset}
                    className="px-4 py-2.5 rounded-full border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-700/25 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Activate Policy Now</span>
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'coverage' ? (
            /* Tab 2: Coverage Table */
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900">
                <h4 className="font-bold text-sm flex items-center gap-1.5 mb-1 text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  What is Covered in TripProtect 360°?
                </h4>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  All TripYeah insurance packages are backed by top-rated international insurers, approved for Schengen & global visa applications with instant cashless network at 10,000+ hospitals.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
                <div className="p-3 bg-slate-50 flex items-center justify-between font-bold text-slate-900">
                  <span>Coverage Benefit</span>
                  <span>Domestic India</span>
                  <span>International Global</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">Emergency Medical Hospitalization</span>
                    <span className="text-[10px] text-slate-500">Illness, accidents, COVID-19 & OPD</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">₹5,00,000</span>
                  <span className="font-mono font-bold text-emerald-700">$100,000 USD</span>
                </div>
                <div className="p-3 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="font-semibold text-slate-900 block">Checked Baggage Loss & Theft</span>
                    <span className="text-[10px] text-slate-500">Airline lost luggage compensation</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">₹25,000</span>
                  <span className="font-mono font-bold text-emerald-700">$1,500 USD</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">Flight Delay (&gt; 3 Hours)</span>
                    <span className="text-[10px] text-slate-500">Food, hotel & taxi reimbursement</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">₹10,000</span>
                  <span className="font-mono font-bold text-emerald-700">$500 USD</span>
                </div>
                <div className="p-3 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="font-semibold text-slate-900 block">Trip Cancellation & Interruption</span>
                    <span className="text-[10px] text-slate-500">Unforeseen medical/family reason</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">100% Refund</span>
                  <span className="font-mono font-bold text-emerald-700">100% Refund</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">Passport & Visa Loss Assistance</span>
                    <span className="text-[10px] text-slate-500">Emergency embassy liaison fees</span>
                  </div>
                  <span className="text-slate-400">N/A</span>
                  <span className="font-mono font-bold text-emerald-700">$400 USD</span>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 3: Claims */
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    1
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1">Instant Notice</h5>
                  <p className="text-[11px] text-slate-500">
                    Call 1800-TRIP-CARE or WhatsApp our 24/7 hotline with your policy number.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1">Cashless Hospitalization</h5>
                  <p className="text-[11px] text-slate-500">
                    Show your digital health pass for direct cashless settlement at partner hospitals.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1">Fast Track Reimbursement</h5>
                  <p className="text-[11px] text-slate-500">
                    Baggage & flight delay claims settled within 48 hours directly into your bank.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5" />
                    24x7 Global Emergency Medical Assistance
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Toll-Free (India): 1800-874-7227 · International: +91 11-4980-8888
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs font-mono">
                  ACTIVE 24/7
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
