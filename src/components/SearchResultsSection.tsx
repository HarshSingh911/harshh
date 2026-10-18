import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, SlidersHorizontal, X } from 'lucide-react';
import {
  BookingCategory,
  CityOption,
  CurrencyCode,
  formatPrice,
  PromoOffer,
  SearchListing,
  TripType,
} from '../data/travelData';

interface SearchResultsSectionProps {
  isOpen: boolean;
  onClose: () => void;
  category: BookingCategory;
  fromCity: CityOption;
  toCity: CityOption;
  departureDate: string;
  returnDate: string;
  tripType: TripType;
  dummyTripType?: 'one-way' | 'round-trip';
  travellers: number;
  cabinClass: string;
  studentFare: boolean;
  currency: CurrencyCode;
  listings: SearchListing[];
  activePromo: PromoOffer | null;
  onClearPromo: () => void;
  onBookListing: (listing: SearchListing, finalTotalInr: number) => void;
}

export const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  isOpen,
  onClose,
  category,
  fromCity,
  toCity,
  departureDate,
  returnDate,
  tripType,
  dummyTripType = 'one-way',
  travellers,
  cabinClass,
  studentFare,
  currency,
  listings,
  activePromo,
  onClearPromo,
  onBookListing,
}) => {
  const [sortBy, setSortBy] = useState<'price' | 'departure'>('price');

  if (!isOpen) return null;

  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === 'price') return a.basePriceInr - b.basePriceInr;
    return a.departureTime.localeCompare(b.departureTime);
  });

  const isRound = tripType === 'round-trip' || (tripType === 'dummy-flights' && dummyTripType === 'round-trip');

  const calculateFinalFare = (baseInr: number) => {
    if (tripType === 'dummy-flights' && category === 'flights') {
      // Verifiable PNR dummy flight ticket pricing for visa / onward travel proof
      const isRoundDummy = dummyTripType === 'round-trip';
      let dummyBase = Math.round(baseInr * (isRoundDummy ? 0.35 : 0.22)) * travellers;
      if (cabinClass === 'Business' || cabinClass === 'First Class') {
        dummyBase = Math.round(dummyBase * 1.35);
      }
      if (studentFare) {
        dummyBase = Math.round(dummyBase * 0.88);
      }
      return Math.max(isRoundDummy ? 890 : 490, dummyBase);
    }

    const tripMultiplier = tripType === 'round-trip' ? 1.85 : 1;
    const cabinMultiplier =
      cabinClass === 'Business'
        ? 2.1
        : cabinClass === 'First Class'
        ? 3.0
        : cabinClass === 'Premium Eco'
        ? 1.35
        : 1;

    let subtotal = Math.round(baseInr * tripMultiplier * cabinMultiplier * travellers);
    if (studentFare) {
      subtotal = Math.round(subtotal * 0.88); // 12% student fare discount
    }
    if (activePromo) {
      const promoDisc = Math.min(
        activePromo.maxDiscountInr,
        Math.round(subtotal * (activePromo.discountPercent / 100))
      );
      subtotal = Math.max(999, subtotal - promoDisc);
    }
    return subtotal;
  };

  return (
    <section
      id="search-results"
      aria-label="Available booking options"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-indigo-600 mb-1">
              {tripType === 'dummy-flights' && category === 'flights'
                ? `Dummy Flights · ${dummyTripType === 'round-trip' ? 'Round Trip (Outbound + Inbound PNR)' : 'One Way'} · Verifiable Airline PNR for Visa & Onward Travel`
                : 'Live Availability · Instant Confirmation'}
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>{fromCity.city}</span>
              <ArrowRight className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>{toCity.city}</span>
              <span className="text-sm font-normal text-slate-500 ml-1">
                · {tripType === 'dummy-flights'
                    ? dummyTripType === 'round-trip'
                      ? 'Dummy Flight (Round Trip)'
                      : 'Dummy Flight (One Way)'
                    : tripType === 'round-trip'
                    ? 'Round Trip'
                    : 'One Way'} · {travellers} {travellers === 1 ? 'Traveller' : 'Travellers'} · {cabinClass}
                {departureDate ? ` · Departs ${departureDate}` : ''}
                {isRound && returnDate ? ` · Returns ${returnDate}` : ''}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
              <button
                type="button"
                onClick={() => setSortBy('price')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  sortBy === 'price'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lowest Price
              </button>
              <button
                type="button"
                onClick={() => setSortBy('departure')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  sortBy === 'departure'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Earliest Schedule
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Hide search results"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Discounts Notice (Unboxed clean bar) */}
        {(studentFare || activePromo) && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100 text-xs text-emerald-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Applied savings:
                {studentFare ? ' Student Fare (12% off + extra 10kg baggage)' : ''}
                {studentFare && activePromo ? ' · ' : ''}
                {activePromo
                  ? ` Promo Code ${activePromo.code} (${activePromo.discountPercent}% off up to ₹${activePromo.maxDiscountInr.toLocaleString('en-IN')})`
                  : ''}
              </span>
            </div>
            {activePromo && (
              <button
                type="button"
                onClick={onClearPromo}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Remove Promo
              </button>
            )}
          </div>
        )}

        {/* Listings List */}
        <div className="divide-y divide-slate-100">
          {sortedListings.map((item) => {
            const finalInr = calculateFinalFare(item.basePriceInr);
            return (
              <div
                key={item.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors rounded-2xl px-2"
              >
                {/* Provider & Metadata */}
                <div className="md:w-1/3">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.providerName}
                    </h3>
                    <span className="text-xs font-mono-tabular text-slate-500">
                      {item.providerCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.features}
                    {item.rating ? ` · Guest Rating ${item.rating}` : ''}
                  </p>
                </div>

                {/* Schedule / Route Timing */}
                <div className="flex items-center gap-6 md:w-1/3">
                  <div>
                    <div className="text-base font-bold font-mono-tabular text-slate-900">
                      {item.departureTime}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.fromCity} ({item.fromCode})
                    </div>
                  </div>

                  <div className="flex-1 text-center px-2">
                    <div className="text-xs text-slate-500 font-mono-tabular">
                      {item.duration}
                    </div>
                    <div className="my-1 h-px bg-slate-200 relative">
                      <span className="absolute left-1/2 -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-600" />
                    </div>
                    <div className="text-xs text-indigo-600 font-medium">
                      {item.stopsLabel}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold font-mono-tabular text-slate-900">
                      {item.arrivalTime}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.toCity} ({item.toCode})
                    </div>
                  </div>
                </div>

                {/* Fare & Book Action */}
                <div className="flex items-center justify-between md:justify-end gap-5 md:w-1/4">
                  <div className="text-left md:text-right">
                    <div className="text-xl font-bold font-mono-tabular text-slate-900">
                      {formatPrice(finalInr, currency)}
                    </div>
                    <div className="text-xs text-slate-500 font-mono-tabular">
                      {item.seatsLeft} {category === 'hotels' ? 'rooms' : 'seats'} left at this fare
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookListing(item, finalInr)}
                    className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
