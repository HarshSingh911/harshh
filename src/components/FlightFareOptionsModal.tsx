import React, { useState } from 'react';
import {
  X,
  Check,
  Plane,
  Sparkles,
  ShieldCheck,
  Luggage,
  Utensils,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';

export interface FlightFareTier {
  id: 'saver' | 'flexi' | 'corporate' | 'max';
  name: string;
  badge: string;
  tagline: string;
  priceDelta: number; // added to base price
  cabinBaggage: string;
  checkInBaggage: string;
  seatSelection: string;
  meal: string;
  dateChange: string;
  cancellation: string;
  priorityServices?: string;
  recommended?: boolean;
}

interface FlightFareOptionsModalProps {
  flight: {
    id: string;
    airline: string;
    flightNo: string;
    depTime: string;
    arrTime: string;
    depTerminal?: string;
    arrTerminal?: string;
    duration: string;
    priceInr: number;
    badgeBg?: string;
    badgeCode?: string;
    aircraft?: string;
    fromCode: string;
    toCode: string;
  };
  currency: CurrencyCode;
  onSelectFareAndProceed: (fareTier: FlightFareTier, finalPriceInr: number) => void;
  onClose: () => void;
}

export const FARE_TIERS: FlightFareTier[] = [
  {
    id: 'saver',
    name: 'Saver / Eco Lite',
    badge: 'Standard Fare',
    tagline: 'Best value for light travellers with basic needs',
    priceDelta: 0,
    cabinBaggage: '7 kg Hand Bag',
    checkInBaggage: '15 kg Check-in Bag',
    seatSelection: 'Chargeable (from ₹150)',
    meal: 'Chargeable on-board',
    dateChange: '₹3,000 + Fare Difference',
    cancellation: '₹3,500 Cancellation Fee',
  },
  {
    id: 'flexi',
    name: 'Flexi Plus / SpiceFlex',
    badge: 'Popular Choice',
    tagline: 'Free seat, complimentary snack & low change fees',
    priceDelta: 750,
    cabinBaggage: '7 kg Hand Bag',
    checkInBaggage: '15 kg Check-in Bag',
    seatSelection: 'FREE Standard Seat Included',
    meal: 'FREE Snack & Drink Included',
    dateChange: 'Reduced Fee (₹499) + Fare Diff',
    cancellation: '₹2,500 Cancellation Fee',
    recommended: true,
  },
  {
    id: 'corporate',
    name: 'Corporate / Super Saver',
    badge: 'Extra Flexibility',
    tagline: 'Extra baggage allowance with free unlimited date changes',
    priceDelta: 1450,
    cabinBaggage: '7 kg Hand Bag',
    checkInBaggage: '20 kg Check-in (+5 kg Free)',
    seatSelection: 'FREE Any Seat (incl. Front Rows)',
    meal: 'FREE Hot Gourmet Meal Included',
    dateChange: 'FREE Unlimited Date Changes',
    cancellation: 'Low Fee (₹999 Only)',
    priorityServices: 'Priority Check-in Counter',
  },
  {
    id: 'max',
    name: 'SpiceMax / Premium XL',
    badge: 'VIP Experience',
    tagline: 'XL extra legroom seat, priority baggage & zero cancel fee',
    priceDelta: 2200,
    cabinBaggage: '7 kg Hand Bag',
    checkInBaggage: '25 kg Check-in (+10 kg Free)',
    seatSelection: 'FREE XL Extra Legroom Front Seat',
    meal: 'FREE Gourmet Hot Meal + Beverage + Dessert',
    dateChange: 'FREE 100% Flexible Date Change',
    cancellation: 'ZERO Cancellation Charge (Full Refund)',
    priorityServices: 'Dedicated Priority Check-in, Fast-Track Boarding & Priority Baggage Delivery',
  },
];

export const FlightFareOptionsModal: React.FC<FlightFareOptionsModalProps> = ({
  flight,
  currency,
  onSelectFareAndProceed,
  onClose,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<'saver' | 'flexi' | 'corporate' | 'max'>('flexi');

  const selectedTier = FARE_TIERS.find((t) => t.id === selectedTierId) || FARE_TIERS[1];
  const finalPriceInr = flight.priceInr + selectedTier.priceDelta;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header Strip with Flight Info */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${flight.badgeBg || 'bg-blue-600'} text-white font-extrabold flex items-center justify-center text-sm shadow-md`}>
              {flight.badgeCode || flight.airline.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl font-black">
                  {flight.airline} {flight.flightNo}
                </h3>
                <span className="text-[11px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                  Select Fare Option
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>{flight.fromCode} ({flight.depTime})</span>
                <span>→</span>
                <span>{flight.toCode} ({flight.arrTime})</span>
                <span>·</span>
                <span>{flight.duration}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 4 Fare Option Cards */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                Choose Your Fare Family
              </h4>
              <p className="text-xs text-slate-500">
                Tailor your flight with customized baggage, free meals, preferred seats &amp; date change flexibility
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FARE_TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              const tierPrice = flight.priceInr + tier.priceDelta;

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`relative rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between border-2 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wide shadow-xs whitespace-nowrap">
                      ★ Recommended
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        {tier.badge}
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-display font-black text-sm text-slate-900">
                        {tier.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-tight mt-1">
                        {tier.tagline}
                      </p>
                    </div>

                    {/* Price Header */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {formatPrice(tierPrice, currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">per traveller</div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-start gap-1.5">
                        <Luggage className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-700 font-medium">
                          {tier.checkInBaggage}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className={`text-[11px] ${tier.seatSelection.includes('FREE') ? 'font-bold text-emerald-700' : 'text-slate-600'}`}>
                          {tier.seatSelection}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className={`text-[11px] ${tier.meal.includes('FREE') ? 'font-bold text-emerald-700' : 'text-slate-600'}`}>
                          {tier.meal}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-600">
                          Change: <strong>{tier.dateChange}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-600">
                          Cancel: <strong>{tier.cancellation}</strong>
                        </span>
                      </div>

                      {tier.priorityServices && (
                        <div className="flex items-start gap-1.5 pt-1 text-[10px] font-bold text-indigo-700 bg-indigo-50/70 p-1.5 rounded-lg">
                          <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{tier.priorityServices}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-0 z-20 rounded-b-3xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Selected Fare Option:</span>
              <span className="font-extrabold text-sm text-blue-700">{selectedTier.name}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {formatPrice(finalPriceInr, currency)}
              </span>
              <span className="text-xs text-slate-400">Total Base Fare · Includes Baggage</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onSelectFareAndProceed(selectedTier, finalPriceInr)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Book {selectedTier.name.split(' ')[0]} Fare</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
