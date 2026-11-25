import React, { useEffect } from 'react';
import { RotateCcw, Search, ShieldCheck, SlidersHorizontal, Star, X } from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';

export interface HotelFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onResetFilters: () => void;
  currency: CurrencyCode;
  matchedCount: number;
  activeFilterCount: number;
  hotelSearchQuery: string;
  setHotelSearchQuery: (val: string) => void;
  hotelTripYeahAssuredOnly: boolean;
  setHotelTripYeahAssuredOnly: React.Dispatch<React.SetStateAction<boolean>>;
  hotelMaxPrice: number;
  setHotelMaxPrice: (val: number) => void;
  hotelPriceBracket: string;
  setHotelPriceBracket: (val: string) => void;
  hotelStars: number[];
  setHotelStars: React.Dispatch<React.SetStateAction<number[]>>;
  hotelMinRating: number;
  setHotelMinRating: (val: number) => void;
  hotelSelectedPropertyTypes: string[];
  setHotelSelectedPropertyTypes: React.Dispatch<React.SetStateAction<string[]>>;
  hotelSelectedAmenities: string[];
  setHotelSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}

const PRICE_BUCKETS = [
  { id: 'all', label: 'All Budgets' },
  { id: 'under-2500', label: 'Budget (Under ₹2,500)' },
  { id: '2500-5000', label: 'Value (₹2,500 - ₹5,000)' },
  { id: '5000-9000', label: 'Premium (₹5,000 - ₹9,000)' },
  { id: '9000-15000', label: 'Luxury (₹9,000 - ₹15,000)' },
  { id: 'above-15000', label: 'Ultra Luxury (₹15,000+)' },
];

const STAR_OPTIONS = [
  { star: 5, subtitle: 'Luxury Resorts & Palaces' },
  { star: 4, subtitle: 'Premium Stays' },
  { star: 3, subtitle: 'Standard & Budget' },
];

const RATING_OPTIONS = [
  { val: 0, label: 'Any Rating' },
  { val: 4.0, label: '4.0+ Very Good' },
  { val: 4.5, label: '4.5+ Excellent' },
  { val: 4.8, label: '4.8+ Top Rated' },
];

const PROPERTY_TYPES = ['Resort', 'Hotel', 'Villa', 'Heritage'];

const AMENITY_OPTIONS = [
  { id: 'Free Breakfast', label: 'Free Breakfast Included' },
  { id: 'Swimming Pool', label: 'Swimming Pool' },
  { id: 'Free WiFi', label: 'Free High-Speed WiFi' },
  { id: 'Couple Friendly', label: 'Couple Friendly (Unmarried Welcome)' },
  { id: 'Beachfront / Sea View', label: 'Beachfront / Sea View' },
  { id: 'Free Cancellation', label: 'Free Cancellation Available' },
  { id: 'Pay at Hotel', label: 'Pay at Hotel (₹0 Prepayment)' },
  { id: 'Spa & Wellness', label: 'Spa & Wellness Centre' },
  { id: 'Airport Shuttle', label: 'Airport Transfer / Shuttle' },
];

export const HotelFiltersDrawer: React.FC<HotelFiltersDrawerProps> = ({
  isOpen,
  onClose,
  onResetFilters,
  currency,
  matchedCount,
  activeFilterCount,
  hotelSearchQuery,
  setHotelSearchQuery,
  hotelTripYeahAssuredOnly,
  setHotelTripYeahAssuredOnly,
  hotelMaxPrice,
  setHotelMaxPrice,
  hotelPriceBracket,
  setHotelPriceBracket,
  hotelStars,
  setHotelStars,
  hotelMinRating,
  setHotelMinRating,
  hotelSelectedPropertyTypes,
  setHotelSelectedPropertyTypes,
  hotelSelectedAmenities,
  setHotelSelectedAmenities,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        data-testid="hotel-filters-backdrop"
        className="fixed inset-0 bg-slate-950/45"
      />

      {/* Slide-Over Left Side Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hotel Filters"
        data-testid="hotel-filters-drawer"
        className={`fixed inset-y-0 left-0 w-full max-w-[360px] sm:w-[380px] bg-white shadow-2xl border-r border-slate-200 flex flex-col transition-transform duration-200 ease-out overscroll-contain ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="shrink-0 px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <SlidersHorizontal className="w-4 h-4 text-blue-600 shrink-0" />
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <span className="text-xs font-semibold text-blue-600 tabular-nums">
                · {activeFilterCount} active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close hotel filters"
              data-testid="close-hotel-filters-button"
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 text-xs">
          {/* 1. Quick Search Box */}
          <div>
            <label
              htmlFor="hotel-drawer-search-input"
              className="font-bold text-slate-800 block mb-1.5"
            >
              Search Hotel / Locality
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="hotel-drawer-search-input"
                type="text"
                value={hotelSearchQuery}
                onChange={(e) => setHotelSearchQuery(e.target.value)}
                placeholder="e.g. Taj, Calangute, Villa..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
              />
              {hotelSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHotelSearchQuery('')}
                  aria-label="Clear hotel search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 2. TripYeah Assured Special Filter */}
          <label
            className={`p-3 rounded-xl border transition-colors cursor-pointer select-none flex items-start gap-2.5 ${
              hotelTripYeahAssuredOnly
                ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
            }`}
          >
            <input
              type="checkbox"
              checked={hotelTripYeahAssuredOnly}
              onChange={(e) => setHotelTripYeahAssuredOnly(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>TripYeah Assured Stays</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Verified photos, 24/7 concierge &amp; 100% money-back check-in guarantee
              </p>
            </div>
          </label>

          {/* 3. Price per Night Range & Brackets */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
              <label htmlFor="hotel-drawer-max-price">Max Price per Night</label>
              <span className="font-bold text-blue-600 font-mono tabular-nums">
                {formatPrice(hotelMaxPrice, currency)}
              </span>
            </div>
            <input
              id="hotel-drawer-max-price"
              type="range"
              min={1500}
              max={25000}
              step={500}
              value={hotelMaxPrice}
              onChange={(e) => {
                setHotelMaxPrice(Number(e.target.value));
                setHotelPriceBracket('all');
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono tabular-nums mt-0.5">
              <span>₹1,500</span>
              <span>₹25,000+</span>
            </div>

            {/* Quick Price Buckets */}
            <div className="mt-3 space-y-2">
              {PRICE_BUCKETS.map((bracket) => {
                const isSelected = hotelPriceBracket === bracket.id;
                return (
                  <label
                    key={bracket.id}
                    className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="hotelPriceBracket"
                      checked={isSelected}
                      onChange={() => setHotelPriceBracket(bracket.id)}
                      className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-0 cursor-pointer accent-blue-600"
                    />
                    <span className={isSelected ? 'font-bold text-blue-700' : ''}>
                      {bracket.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Hotel Star Rating */}
          <div className="pt-3 border-t border-slate-100">
            <span className="font-bold text-slate-800 block mb-2.5">Hotel Star Rating</span>
            <div className="space-y-2">
              {STAR_OPTIONS.map(({ star, subtitle }) => {
                const checked = hotelStars.includes(star);
                return (
                  <label
                    key={star}
                    className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setHotelStars((prev) =>
                          checked ? prev.filter((s) => s !== star) : [...prev, star]
                        )
                      }
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                    />
                    <span className="flex items-center gap-1 text-xs">
                      <span className="font-semibold tabular-nums">{star}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-slate-500 text-[11px]">{subtitle}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. Guest Review Rating */}
          <div className="pt-3 border-t border-slate-100">
            <span className="font-bold text-slate-800 block mb-2.5">Guest Review Rating</span>
            <div className="grid grid-cols-2 gap-2">
              {RATING_OPTIONS.map((item) => {
                const isActive = hotelMinRating === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setHotelMinRating(item.val)}
                    className={`py-2 px-2.5 rounded-lg text-center border font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Property Type */}
          <div className="pt-3 border-t border-slate-100">
            <span className="font-bold text-slate-800 block mb-2.5">Property Type</span>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((type) => {
                const active = hotelSelectedPropertyTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setHotelSelectedPropertyTypes((prev) =>
                        active ? prev.filter((t) => t !== type) : [...prev, type]
                      )
                    }
                    className={`py-2 px-2.5 rounded-lg text-center border font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Amenities & Freebies */}
          <div className="pt-3 border-t border-slate-100">
            <span className="font-bold text-slate-800 block mb-2.5">Amenities &amp; Freebies</span>
            <div className="space-y-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const checked = hotelSelectedAmenities.includes(amenity.id);
                return (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setHotelSelectedAmenities((prev) =>
                          checked ? prev.filter((a) => a !== amenity.id) : [...prev, amenity.id]
                        )
                      }
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs">{amenity.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer */}
        <div className="shrink-0 px-5 py-3.5 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 font-medium tabular-nums">
            <span className="font-bold text-slate-900">{matchedCount}</span>{' '}
            {matchedCount === 1 ? 'property' : 'properties'}
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="apply-hotel-filters-button"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            Show {matchedCount} {matchedCount === 1 ? 'Property' : 'Properties'}
          </button>
        </div>
      </div>
    </div>
  );
};
