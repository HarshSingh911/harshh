import React, { useEffect, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { CurrencyCode } from '../data/travelData';
import {
  ALL_HOTEL_STARS,
  DEFAULT_HOTEL_MAX_PRICE,
  formatHotelPriceBracketLabel,
  formatHotelStarOptionLabel,
  HOTEL_PRICE_BRACKETS,
  HotelPriceDisplayMode,
  parseMinMaxPriceInputs,
} from '../utils/hotelResultsUtils';

export interface HotelFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onResetFilters: () => void;
  currency: CurrencyCode;
  matchedCount: number;
  activeFilterCount: number;
  stayNights: number;
  priceDisplayMode: HotelPriceDisplayMode;
  setPriceDisplayMode: (mode: HotelPriceDisplayMode) => void;
  hotelMinPrice: number;
  hotelMaxPrice: number;
  onApplyMinMaxPrice: (minPrice: number, maxPrice: number) => void;
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
  stayNights,
  priceDisplayMode,
  setPriceDisplayMode,
  hotelMinPrice,
  hotelMaxPrice,
  onApplyMinMaxPrice,
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
  const [minDraft, setMinDraft] = useState<string>(hotelMinPrice > 0 ? String(hotelMinPrice) : '');
  const [maxDraft, setMaxDraft] = useState<string>(
    hotelMaxPrice !== DEFAULT_HOTEL_MAX_PRICE ? String(hotelMaxPrice) : ''
  );

  // Sync draft inputs whenever external min/max resets or updates
  useEffect(() => {
    setMinDraft(hotelMinPrice > 0 ? String(hotelMinPrice) : '');
    setMaxDraft(hotelMaxPrice !== DEFAULT_HOTEL_MAX_PRICE ? String(hotelMaxPrice) : '');
  }, [hotelMinPrice, hotelMaxPrice]);

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

  const handleSubmitPriceRange = (e?: React.FormEvent) => {
    e?.preventDefault();
    const { minPrice, maxPrice } = parseMinMaxPriceInputs(
      minDraft,
      maxDraft,
      DEFAULT_HOTEL_MAX_PRICE
    );
    onApplyMinMaxPrice(minPrice, maxPrice);
  };

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
          {/* 1. View Price As (Per night / Total stay) */}
          <div data-testid="hotel-view-price-as-section">
            <span className="font-bold text-slate-800 block mb-2">View price as</span>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                data-testid="price-mode-per-night"
                aria-pressed={priceDisplayMode === 'per-night'}
                onClick={() => setPriceDisplayMode('per-night')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  priceDisplayMode === 'per-night'
                    ? 'bg-white text-[#05203c] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Per night
              </button>
              <button
                type="button"
                data-testid="price-mode-total-stay"
                aria-pressed={priceDisplayMode === 'total-stay'}
                onClick={() => setPriceDisplayMode('total-stay')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  priceDisplayMode === 'total-stay'
                    ? 'bg-white text-[#05203c] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Total stay
              </button>
            </div>
            {priceDisplayMode === 'total-stay' && (
              <p className="text-[11px] text-slate-500 mt-1.5">
                Showing total price for {stayNights} {stayNights === 1 ? 'night' : 'nights'}
              </p>
            )}
          </div>

          {/* 2. Price Range (Min / Max Number Inputs + Compact Search Button) & Numbered Brackets */}
          <div className="pt-3 border-t border-slate-100">
            <span className="font-bold text-slate-800 block mb-2.5">
              {priceDisplayMode === 'total-stay' ? 'Price (Total stay)' : 'Price (Per night)'}
            </span>

            <form
              onSubmit={handleSubmitPriceRange}
              data-testid="hotel-price-minmax-form"
              className="flex items-end gap-2"
            >
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="hotel-drawer-min-price"
                  className="block text-[11px] font-semibold text-slate-500 mb-1"
                >
                  Min
                </label>
                <input
                  id="hotel-drawer-min-price"
                  data-testid="hotel-min-price-input"
                  type="number"
                  min={0}
                  step={100}
                  inputMode="numeric"
                  value={minDraft}
                  onChange={(e) => setMinDraft(e.target.value)}
                  placeholder="0"
                  className="w-full h-[34px] bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-semibold text-slate-900 placeholder-slate-400 tabular-nums focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <span className="pb-2 text-slate-400 font-semibold select-none">–</span>

              <div className="flex-1 min-w-0">
                <label
                  htmlFor="hotel-drawer-max-price"
                  className="block text-[11px] font-semibold text-slate-500 mb-1"
                >
                  Max
                </label>
                <input
                  id="hotel-drawer-max-price"
                  data-testid="hotel-max-price-input"
                  type="number"
                  min={0}
                  step={100}
                  inputMode="numeric"
                  value={maxDraft}
                  onChange={(e) => setMaxDraft(e.target.value)}
                  placeholder="25000"
                  className="w-full h-[34px] bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-semibold text-slate-900 placeholder-slate-400 tabular-nums focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Compact Icon-Only Search Button Matching Second Header Search Button */}
              <button
                type="submit"
                data-testid="hotel-price-apply-search-btn"
                title="Apply Min & Max price"
                aria-label="Apply min and max price"
                className="w-[34px] h-[34px] rounded-xl bg-[#05203c] hover:bg-[#0a3666] text-white shadow-xs border border-[#05203c] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.25]" />
              </button>
            </form>

            {/* Numbered Budget Brackets (All Budgets, ₹0 - ₹2,000, ₹2,000 - ₹5,000, ...) */}
            <div
              data-testid="hotel-price-brackets-list"
              className="mt-3.5 space-y-2"
            >
              {HOTEL_PRICE_BRACKETS.map((bracket) => {
                const isSelected = hotelPriceBracket === bracket.id;
                const label = formatHotelPriceBracketLabel(bracket, currency);
                return (
                  <label
                    key={bracket.id}
                    data-testid={`hotel-price-bracket-${bracket.id}`}
                    className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="hotelPriceBracket"
                      checked={isSelected}
                      onChange={() => setHotelPriceBracket(bracket.id)}
                      className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-0 cursor-pointer accent-blue-600"
                    />
                    <span className={`tabular-nums ${isSelected ? 'font-bold text-blue-700' : 'font-medium'}`}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Hotel Star Rating (5 Stars down to 1 Star with exact star icons) */}
          <div className="pt-3 border-t border-slate-100" data-testid="hotel-star-rating-section">
            <span className="font-bold text-slate-800 block mb-2.5">Hotel Star Rating</span>
            <div className="space-y-2.5">
              {ALL_HOTEL_STARS.map((star) => {
                const checked = hotelStars.includes(star);
                const starLabel = formatHotelStarOptionLabel(star);
                return (
                  <label
                    key={star}
                    data-testid={`hotel-star-option-${star}`}
                    className="flex items-center justify-between gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                  >
                    <span className="flex items-center gap-2.5">
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
                      <span
                        className="inline-flex items-center gap-0.5 text-amber-500"
                        aria-hidden="true"
                      >
                        {Array.from({ length: star }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </span>
                      <span className="font-semibold text-xs text-slate-800">{starLabel}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Guest Review Rating */}
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

          {/* 5. Property Type */}
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

          {/* 6. Amenities & Freebies */}
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
