import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Minus,
  Plus,
  Search,
} from 'lucide-react';
import {
  CityOption,
  CurrencyCode,
  TripType,
  formatPrice,
} from '../data/travelData';
import { AirportAutocompleteDropdown } from './AirportAutocompleteDropdown';
import { InternationalCityGridSkeleton } from './InternationalCityGridSkeleton';
import { NormalCalendarDropdown } from './NormalCalendarDropdown';
import {
  BUDGET_CATEGORY_OPTIONS,
  BUDGET_SLIDER_STEP_INR,
  detectCountrySearchMode,
  filterInternationalCityRoutes,
  getDisplayLocationCode,
  getInternationalCityRoutes,
  getPopularCountryOptions,
  hasCityOptionChanged,
  InternationalCityRouteItem,
  isSameCountryPair,
  MAX_BUDGET_SLIDER_INR,
  MIN_BUDGET_SLIDER_INR,
  STOPS_FILTER_OPTIONS,
  StopsFilterValue,
} from '../utils/internationalFlightRoutes';

export interface InternationalCitySelectorPageProps {
  fromCity: CityOption;
  toCity: CityOption;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  travellers: number;
  cabinClass: string;
  currency: CurrencyCode;
  onChangeFromCity: (city: CityOption) => void;
  onChangeToCity: (city: CityOption) => void;
  onChangeDepartureDate: (date: string) => void;
  onChangeReturnDate: (date: string) => void;
  onChangeTripType: (tripType: TripType) => void;
  onChangeTravellers: (count: number, cabin: string) => void;
  onCompleteCitySelection: (resolvedFromCity: CityOption, resolvedToCity: CityOption) => void;
  onBackToHome?: () => void;
}

export const InternationalCitySelectorPage: React.FC<InternationalCitySelectorPageProps> = ({
  fromCity,
  toCity,
  departureDate,
  returnDate = '2026-10-19',
  tripType,
  travellers,
  cabinClass,
  currency,
  onChangeFromCity,
  onChangeToCity,
  onChangeDepartureDate,
  onChangeReturnDate,
  onChangeTripType,
  onChangeTravellers,
  onCompleteCitySelection,
}) => {
  // For Country -> Country two-step selection on this same page:
  // Step 1 picks departure city (`chosenFromCity`), Step 2 picks arrival city and opens the flight list.
  const [chosenFromCity, setChosenFromCity] = useState<CityOption | null>(null);
  const [minBudgetInr, setMinBudgetInr] = useState<number>(MIN_BUDGET_SLIDER_INR);
  const [maxBudgetInr, setMaxBudgetInr] = useState<number>(MAX_BUDGET_SLIDER_INR);
  const [stopsFilter, setStopsFilter] = useState<StopsFilterValue>('all');
  const [openBudgetDropdown, setOpenBudgetDropdown] = useState<boolean>(false);
  const [openStopsDropdown, setOpenStopsDropdown] = useState<boolean>(false);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(true);
  const [searchReloadNonce, setSearchReloadNonce] = useState<number>(0);

  // Header draft states (applied only when user clicks the Search icon button)
  const [draftFromCity, setDraftFromCity] = useState<CityOption>(fromCity);
  const [draftToCity, setDraftToCity] = useState<CityOption>(toCity);
  const [draftTripType, setDraftTripType] = useState<TripType>(tripType);
  const [draftRetDate, setDraftRetDate] = useState<string>(returnDate);
  const [draftTravellers, setDraftTravellers] = useState<number>(travellers);
  const [draftCabinClass, setDraftCabinClass] = useState<string>(cabinClass);

  // Header popover states
  const [openCityPicker, setOpenCityPicker] = useState<'from' | 'to' | null>(null);
  const [openCalendarDropdown, setOpenCalendarDropdown] = useState<'departure' | 'return' | null>(null);
  const [openTravellersDropdown, setOpenTravellersDropdown] = useState<boolean>(false);

  useEffect(() => {
    setDraftFromCity(fromCity);
  }, [fromCity.code, fromCity.city, fromCity.isCountry]);

  useEffect(() => {
    setDraftToCity(toCity);
  }, [toCity.code, toCity.city, toCity.isCountry]);

  useEffect(() => {
    setDraftTripType(tripType);
  }, [tripType]);

  useEffect(() => {
    setDraftRetDate(returnDate);
  }, [returnDate]);

  useEffect(() => {
    setDraftTravellers(travellers);
  }, [travellers]);

  useEffect(() => {
    setDraftCabinClass(cabinClass);
  }, [cabinClass]);

  // Reset sequential step & filters when applied From or To changes
  useEffect(() => {
    setChosenFromCity(null);
    setMinBudgetInr(MIN_BUDGET_SLIDER_INR);
    setMaxBudgetInr(MAX_BUDGET_SLIDER_INR);
    setStopsFilter('all');
    setOpenBudgetDropdown(false);
    setOpenStopsDropdown(false);
  }, [fromCity.code, fromCity.city, fromCity.isCountry, toCity.code, toCity.city, toCity.isCountry]);

  const mode = useMemo(() => detectCountrySearchMode(fromCity, toCity), [fromCity, toCity]);
  const sameCountry = useMemo(() => isSameCountryPair(fromCity, toCity), [fromCity, toCity]);
  const isDraftRoundTrip = draftTripType === 'round-trip';

  // Smooth hotel-style shimmer loading on page open, filter/step choice, or Search commit
  useEffect(() => {
    if (sameCountry) {
      setIsLoadingCities(false);
      return;
    }
    setIsLoadingCities(true);
    const timer = window.setTimeout(() => {
      setIsLoadingCities(false);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [
    sameCountry,
    fromCity.code,
    fromCity.city,
    fromCity.isCountry,
    toCity.code,
    toCity.city,
    toCity.isCountry,
    chosenFromCity?.code,
    chosenFromCity?.city,
    minBudgetInr,
    maxBudgetInr,
    stopsFilter,
    departureDate,
    returnDate,
    tripType,
    travellers,
    cabinClass,
    searchReloadNonce,
  ]);

  const hasPendingHeaderChange =
    hasCityOptionChanged(draftFromCity, fromCity) ||
    hasCityOptionChanged(draftToCity, toCity) ||
    draftTripType !== tripType ||
    draftTravellers !== travellers ||
    draftCabinClass !== cabinClass;

  const handleApplyHeaderSearch = () => {
    setOpenTravellersDropdown(false);
    setOpenCityPicker(null);
    setOpenCalendarDropdown(null);
    if (hasCityOptionChanged(draftFromCity, fromCity)) {
      onChangeFromCity(draftFromCity);
    }
    if (hasCityOptionChanged(draftToCity, toCity)) {
      onChangeToCity(draftToCity);
    }
    onChangeTripType(draftTripType);
    onChangeReturnDate(draftRetDate);
    onChangeTravellers(draftTravellers, draftCabinClass);
    setSearchReloadNonce((prev) => prev + 1);
  };

  // Determine whether we are currently picking departure location or arrival location
  const currentStepConfig = useMemo(() => {
    if (mode === 'from-country-to-city') {
      return {
        direction: 'departure-cities' as const,
        targetCountry: fromCity.country || fromCity.city,
        counterpartCity: toCity,
        counterpartCountry: undefined,
        heading: 'Choose departure location',
      };
    }

    if (mode === 'city-to-country') {
      return {
        direction: 'arrival-cities' as const,
        targetCountry: toCity.country || toCity.city,
        counterpartCity: fromCity,
        counterpartCountry: undefined,
        heading: 'Choose arrival location',
      };
    }

    if (!chosenFromCity) {
      return {
        direction: 'departure-cities' as const,
        targetCountry: fromCity.country || fromCity.city,
        counterpartCity: undefined,
        counterpartCountry: toCity.country || toCity.city,
        heading: 'Choose departure location',
      };
    }

    return {
      direction: 'arrival-cities' as const,
      targetCountry: toCity.country || toCity.city,
      counterpartCity: chosenFromCity,
      counterpartCountry: undefined,
      heading: 'Choose arrival location',
    };
  }, [mode, fromCity, toCity, chosenFromCity]);

  const rawCityRoutes = useMemo(() => {
    if (sameCountry) return [];
    return getInternationalCityRoutes({
      targetCountry: currentStepConfig.targetCountry,
      direction: currentStepConfig.direction,
      counterpartCity: currentStepConfig.counterpartCity,
      counterpartCountry: currentStepConfig.counterpartCountry,
      tripType,
      travellers,
      cabinClass,
    });
  }, [sameCountry, currentStepConfig, tripType, travellers, cabinClass]);

  const isUnrestrictedBudget =
    minBudgetInr === MIN_BUDGET_SLIDER_INR && maxBudgetInr >= MAX_BUDGET_SLIDER_INR;

  const displayedCityRoutes = useMemo(() => {
    return filterInternationalCityRoutes(rawCityRoutes, {
      minBudgetInr,
      maxBudgetInr: isUnrestrictedBudget ? null : maxBudgetInr,
      stopsFilter,
    });
  }, [rawCityRoutes, minBudgetInr, maxBudgetInr, isUnrestrictedBudget, stopsFilter]);

  const hasBudgetFilter =
    minBudgetInr > MIN_BUDGET_SLIDER_INR || maxBudgetInr < MAX_BUDGET_SLIDER_INR;
  const hasStopsFilter = stopsFilter !== 'all';

  const quickAlternativeCountries = useMemo(() => {
    const activeFromCountry = (fromCity.country || fromCity.city).toLowerCase();
    return getPopularCountryOptions()
      .filter((c) => c.country.toLowerCase() !== activeFromCountry)
      .slice(0, 6);
  }, [fromCity]);

  const shiftDate = (currentDateStr: string, deltaDays: number, minDateStr?: string): string => {
    if (!currentDateStr) return currentDateStr;
    try {
      const parts = currentDateStr.split('-').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return currentDateStr;
      const [y, m, d] = parts;
      const dateObj = new Date(Date.UTC(y, m - 1, d + deltaDays));
      const newY = dateObj.getUTCFullYear();
      const newM = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const newD = String(dateObj.getUTCDate()).padStart(2, '0');
      const resultStr = `${newY}-${newM}-${newD}`;
      if (minDateStr && resultStr < minDateStr) return minDateStr;
      return resultStr;
    } catch {
      return currentDateStr;
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        const [y, m, d] = parts;
        const dateObj = new Date(Date.UTC(y, m - 1, d));
        return dateObj.toLocaleDateString('en-US', {
          timeZone: 'UTC',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleSwap = () => {
    const prevFrom = draftFromCity;
    const prevTo = draftToCity;
    setDraftFromCity(prevTo);
    setDraftToCity(prevFrom);
  };

  const handleCityCardClick = (item: InternationalCityRouteItem) => {
    if (mode === 'from-country-to-city') {
      onCompleteCitySelection(item.city, toCity);
      return;
    }
    if (mode === 'city-to-country') {
      onCompleteCitySelection(fromCity, item.city);
      return;
    }
    // Country -> Country
    if (!chosenFromCity) {
      setChosenFromCity(item.city);
      setMinBudgetInr(MIN_BUDGET_SLIDER_INR);
      setMaxBudgetInr(MAX_BUDGET_SLIDER_INR);
      setStopsFilter('all');
      setOpenBudgetDropdown(false);
      setOpenStopsDropdown(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCompleteCitySelection(chosenFromCity, item.city);
    }
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen text-slate-800 pb-20 font-sans">
      {/* ===================================================================
          1. SEAMLESS OCEAN-NAVY FLIGHT SEARCH HEADER (Identical to Flight Results)
      =================================================================== */}
      <section className="bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] pt-[74px] pb-6 relative shadow-md">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          {/* Top Compact Trip Controls Row (Directly on Ocean Navy Header) */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Trip Type Segmented Control */}
              <div className="inline-flex rounded-xl p-1 bg-white/10 border border-white/15 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDraftTripType('one-way');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    draftTripType === 'one-way'
                      ? 'bg-white text-[#05203c] shadow-xs'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftTripType('round-trip');
                    if (!draftRetDate || draftRetDate <= departureDate) {
                      setDraftRetDate(shiftDate(departureDate, 4));
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    draftTripType === 'round-trip'
                      ? 'bg-white text-[#05203c] shadow-xs'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  Round Trip
                </button>
              </div>

              {/* Travellers & Cabin Class Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenTravellersDropdown(!openTravellersDropdown)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/18 text-white font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <span>
                    {draftTravellers} Adult{draftTravellers > 1 ? 's' : ''} · {draftCabinClass}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/75" />
                </button>

                {openTravellersDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenTravellersDropdown(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 space-y-4 text-slate-800 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs">Travelers</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const nextCount = Math.max(1, draftTravellers - 1);
                              setDraftTravellers(nextCount);
                            }}
                            aria-label="Decrease travelers"
                            className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-sm w-4 text-center tabular-nums">
                            {draftTravellers}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextCount = Math.min(9, draftTravellers + 1);
                              setDraftTravellers(nextCount);
                            }}
                            aria-label="Increase travelers"
                            className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-600 mb-1.5">Cabin Class</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {['Economy', 'Premium Eco', 'Business', 'First Class'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setDraftCabinClass(c);
                                setOpenTravellersDropdown(false);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                                draftCabinClass === c
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Compact Icon-Only Search Button right after Travellers / Cabin Class */}
              <button
                type="button"
                onClick={handleApplyHeaderSearch}
                title="Search flights with selected trip type, travelers & cabin class"
                aria-label="Search flights"
                className={`w-[34px] h-[34px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 ${
                  hasPendingHeaderChange
                    ? 'bg-white text-[#05203c] shadow-md ring-2 ring-sky-300/80 hover:bg-blue-50 scale-105'
                    : 'bg-white hover:bg-blue-50 text-[#05203c] shadow-xs border border-white/80'
                }`}
              >
                <Search className="w-3.5 h-3.5 stroke-[2.25]" />
              </button>
            </div>
          </div>

          {/* Single Unified Greyish-Blue Search Box (Only Arrow Buttons Have Boxes) */}
          <div className="rounded-2xl p-1.5 bg-[#cfdce9] border border-white/30 shadow-lg">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Route: FROM & TO with Swap button */}
              <div className="flex flex-col sm:flex-row items-stretch relative lg:flex-[2] min-w-0">
                {/* FROM */}
                <div className="relative flex-1 min-w-0">
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setOpenCalendarDropdown(null);
                      setOpenTravellersDropdown(false);
                      setOpenCityPicker(openCityPicker === 'from' ? null : 'from');
                    }}
                    className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/35 cursor-pointer transition-colors h-[56px] flex flex-col justify-center"
                  >
                    <div className="text-[11px] font-semibold text-slate-600 leading-none">From</div>
                    <div className="flex items-baseline gap-1.5 mt-1 truncate">
                      <span className="font-bold text-slate-900 text-sm sm:text-[15px] truncate">
                        {draftFromCity.city}
                      </span>
                      <span className="font-bold text-xs font-mono text-slate-600 shrink-0">
                        {getDisplayLocationCode(draftFromCity)}
                      </span>
                    </div>
                  </button>

                  <AirportAutocompleteDropdown
                    label="From"
                    selectedCity={draftFromCity}
                    onSelectCity={(c) => {
                      setDraftFromCity(c);
                      setOpenCityPicker(null);
                    }}
                    isOpen={openCityPicker === 'from'}
                    onClose={() => setOpenCityPicker(null)}
                    align="left"
                    allowCountrySelection={true}
                  />
                </div>

                {/* Swap Button */}
                <div className="shrink-0 flex items-center justify-center sm:-mx-3.5 z-10 my-0.5 sm:my-0">
                  <button
                    type="button"
                    onClick={handleSwap}
                    title="Swap From and To"
                    aria-label="Swap From and To cities"
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-slate-300/80 text-slate-700 hover:text-blue-700 flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* TO */}
                <div className="relative flex-1 min-w-0">
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setOpenCalendarDropdown(null);
                      setOpenTravellersDropdown(false);
                      setOpenCityPicker(openCityPicker === 'to' ? null : 'to');
                    }}
                    className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/35 cursor-pointer transition-colors h-[56px] flex flex-col justify-center sm:pl-6"
                  >
                    <div className="text-[11px] font-semibold text-slate-600 leading-none">To</div>
                    <div className="flex items-baseline gap-1.5 mt-1 truncate">
                      <span className="font-bold text-slate-900 text-sm sm:text-[15px] truncate">
                        {draftToCity.city}
                      </span>
                      <span className="font-bold text-xs font-mono text-slate-600 shrink-0">
                        {getDisplayLocationCode(draftToCity)}
                      </span>
                    </div>
                  </button>

                  <AirportAutocompleteDropdown
                    label="To"
                    selectedCity={draftToCity}
                    onSelectCity={(c) => {
                      setDraftToCity(c);
                      setOpenCityPicker(null);
                    }}
                    isOpen={openCityPicker === 'to'}
                    onClose={() => setOpenCityPicker(null)}
                    align="left"
                    allowCountrySelection={true}
                  />
                </div>
              </div>

              {/* Divider between Route and Dates */}
              <div className="h-px lg:h-auto lg:w-px bg-slate-400/45 mx-2 my-1 lg:my-2 lg:mx-1.5 shrink-0" />

              {/* Dates: Departure (+ Return in Round Trip) */}
              <div
                className={`flex flex-col sm:flex-row items-stretch min-w-0 ${
                  isDraftRoundTrip ? 'lg:flex-[2]' : 'lg:flex-1'
                }`}
              >
                {/* Departure Date */}
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 h-[56px] px-1">
                    <button
                      type="button"
                      onClick={() => onChangeDepartureDate(shiftDate(departureDate, -1))}
                      title="Previous Day"
                      aria-label="Previous departure day"
                      className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl border border-slate-300/75 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-[#072a4f] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCityPicker(null);
                        setOpenTravellersDropdown(false);
                        setOpenCalendarDropdown(
                          openCalendarDropdown === 'departure' ? null : 'departure'
                        );
                      }}
                      className="flex-1 min-w-0 h-full px-2 rounded-xl hover:bg-white/35 transition-colors cursor-pointer select-none flex items-center justify-center gap-2 text-slate-900 hover:text-[#072a4f]"
                      title="Click to open calendar"
                    >
                      <Calendar className="w-4 h-4 text-[#072a4f] shrink-0" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 tabular-nums whitespace-nowrap truncate">
                        {formatDisplayDate(departureDate)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const nextD = shiftDate(departureDate, 1);
                        onChangeDepartureDate(nextD);
                        if (isDraftRoundTrip && draftRetDate < nextD) {
                          const nextR = shiftDate(nextD, 3);
                          setDraftRetDate(nextR);
                          if (tripType === 'round-trip') {
                            onChangeReturnDate(nextR);
                          }
                        }
                      }}
                      title="Next Day"
                      aria-label="Next departure day"
                      className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl border border-slate-300/75 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-[#072a4f] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {openCalendarDropdown === 'departure' && (
                    <NormalCalendarDropdown
                      selectedDate={departureDate}
                      minDate="2026-01-01"
                      onSelectDate={(newDate) => {
                        onChangeDepartureDate(newDate);
                        if (isDraftRoundTrip && draftRetDate < newDate) {
                          const nextR = shiftDate(newDate, 3);
                          setDraftRetDate(nextR);
                          if (tripType === 'round-trip') {
                            onChangeReturnDate(nextR);
                          }
                        }
                        setOpenCalendarDropdown(null);
                      }}
                      onClose={() => setOpenCalendarDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {isDraftRoundTrip && (
                  <>
                    <div className="h-px sm:h-auto sm:w-px bg-slate-400/45 mx-2 my-1 sm:my-2 sm:mx-1 shrink-0" />
                    <div className="relative flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 h-[56px] px-1">
                        <button
                          type="button"
                          onClick={() => {
                            const nextR = shiftDate(draftRetDate, -1, departureDate);
                            setDraftRetDate(nextR);
                            if (tripType === 'round-trip') {
                              onChangeReturnDate(nextR);
                            }
                          }}
                          title="Previous Return Day"
                          aria-label="Previous return day"
                          className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl border border-slate-300/75 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-[#072a4f] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenCityPicker(null);
                            setOpenTravellersDropdown(false);
                            setOpenCalendarDropdown(
                              openCalendarDropdown === 'return' ? null : 'return'
                            );
                          }}
                          className="flex-1 min-w-0 h-full px-2 rounded-xl hover:bg-white/35 transition-colors cursor-pointer select-none flex items-center justify-center gap-2 text-slate-900 hover:text-[#072a4f]"
                          title="Click to open return calendar"
                        >
                          <Calendar className="w-4 h-4 text-[#072a4f] shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-slate-900 tabular-nums whitespace-nowrap truncate">
                            {formatDisplayDate(draftRetDate)}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const nextR = shiftDate(draftRetDate, 1);
                            setDraftRetDate(nextR);
                            if (tripType === 'round-trip') {
                              onChangeReturnDate(nextR);
                            }
                          }}
                          title="Next Return Day"
                          aria-label="Next return day"
                          className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl border border-slate-300/75 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-[#072a4f] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {openCalendarDropdown === 'return' && (
                        <NormalCalendarDropdown
                          selectedDate={draftRetDate}
                          minDate={departureDate}
                          onSelectDate={(newDate) => {
                            setDraftRetDate(newDate);
                            if (tripType === 'round-trip') {
                              onChangeReturnDate(newDate);
                            }
                            setOpenCalendarDropdown(null);
                          }}
                          onClose={() => setOpenCalendarDropdown(null)}
                          alignRight={true}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. FULL-WIDTH GREY PAGE CONTENT (Heading + 2 Options + Compact Grid Boxes)
      =================================================================== */}
      <section
        aria-label="International city fare selection"
        className="w-full px-3 sm:px-5 lg:px-6 pt-6 space-y-4"
      >
        {sameCountry ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6" />
            </div>
            <div className="max-w-lg mx-auto space-y-1.5">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Choose a different international destination
              </h1>
              <p className="text-sm text-slate-600">
                Both From and To are currently set to <strong>{fromCity.country || fromCity.city}</strong>. Select a foreign country below to compare fares.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {quickAlternativeCountries.map((cOpt) => (
                <button
                  key={`alt-country-${cOpt.code}`}
                  type="button"
                  onClick={() => onChangeToCity(cOpt)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>{cOpt.flagEmoji}</span>
                  <span>Fly to {cOpt.city}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Plain Heading Directly on Grey Page (No Box) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {currentStepConfig.heading}
              </h1>

              {mode === 'country-to-country' && chosenFromCity && (
                <button
                  type="button"
                  onClick={() => {
                    setChosenFromCity(null);
                    setMinBudgetInr(MIN_BUDGET_SLIDER_INR);
                    setMaxBudgetInr(MAX_BUDGET_SLIDER_INR);
                    setStopsFilter('all');
                    setOpenBudgetDropdown(false);
                    setOpenStopsDropdown(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>
                    From {chosenFromCity.city} ({chosenFromCity.code}) · Change departure
                  </span>
                </button>
              )}
            </div>

            {/* Two Filter Options Directly on Grey Page (Budget Dropdown + Stops Dropdown, No Wrapper Box) */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Budget Dropdown (0-1L Strip + Price-Wise Categories Inside Popover) */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Budget"
                  aria-haspopup="dialog"
                  aria-expanded={openBudgetDropdown}
                  onClick={() => {
                    setOpenStopsDropdown(false);
                    setOpenBudgetDropdown((prev) => !prev);
                  }}
                  className={`inline-flex items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold cursor-pointer focus:outline-none shadow-2xs transition-colors ${
                    hasBudgetFilter
                      ? 'bg-blue-50/80 border border-blue-500 text-[#05203c]'
                      : 'bg-white border border-slate-300/90 hover:border-slate-400 text-slate-800'
                  }`}
                >
                  <span>Budget</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${
                      openBudgetDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openBudgetDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setOpenBudgetDropdown(false)}
                    />
                    <div
                      role="dialog"
                      aria-label="Budget options"
                      className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3.5 z-30 space-y-3"
                    >
                      {/* 0 to 1,00,000 Price Strip */}
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <label
                            htmlFor="intl-budget-strip"
                            className="text-xs font-bold text-slate-700"
                          >
                            Price range
                          </label>
                          <span className="font-price text-xs font-bold text-[#072a4f] tabular-nums">
                            {formatPrice(minBudgetInr, currency)} – {formatPrice(maxBudgetInr, currency)}
                          </span>
                        </div>
                        <input
                          id="intl-budget-strip"
                          type="range"
                          aria-label="Budget range"
                          min={MIN_BUDGET_SLIDER_INR}
                          max={MAX_BUDGET_SLIDER_INR}
                          step={BUDGET_SLIDER_STEP_INR}
                          value={maxBudgetInr}
                          onChange={(e) => {
                            setMinBudgetInr(MIN_BUDGET_SLIDER_INR);
                            setMaxBudgetInr(Number(e.target.value));
                          }}
                          className="w-full h-1.5 bg-slate-300 rounded-lg accent-[#0a3666] cursor-pointer block"
                        />
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mt-1 tabular-nums">
                          <span>{formatPrice(MIN_BUDGET_SLIDER_INR, currency)}</span>
                          <span>{formatPrice(50000, currency)}</span>
                          <span>{formatPrice(MAX_BUDGET_SLIDER_INR, currency)}</span>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* Price-Wise Category Options */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 px-1">
                          Price categories
                        </div>
                        <div
                          role="radiogroup"
                          aria-label="Price categories"
                          className="flex flex-col gap-0.5"
                        >
                          {BUDGET_CATEGORY_OPTIONS.map((opt) => {
                            const isSelected =
                              minBudgetInr === opt.minPriceInr && maxBudgetInr === opt.maxPriceInr;
                            const labelText =
                              opt.id === 'all'
                                ? 'Any budget'
                                : opt.minPriceInr === 0
                                  ? `Under ${formatPrice(opt.maxPriceInr, currency)}`
                                  : `${formatPrice(opt.minPriceInr, currency)} – ${formatPrice(opt.maxPriceInr, currency)}`;

                            return (
                              <button
                                key={opt.id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => {
                                  setMinBudgetInr(opt.minPriceInr);
                                  setMaxBudgetInr(opt.maxPriceInr);
                                  setOpenBudgetDropdown(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs sm:text-sm flex items-center gap-2.5 transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50 text-[#05203c] font-bold'
                                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                                }`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    isSelected ? 'border-[#0a3666]' : 'border-slate-400'
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a3666]" />
                                  )}
                                </span>
                                <span className="tabular-nums">{labelText}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Stops Point-Wise Dropdown (Clean Non-Scrolling Popover) */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Stops"
                  aria-haspopup="menu"
                  aria-expanded={openStopsDropdown}
                  onClick={() => {
                    setOpenBudgetDropdown(false);
                    setOpenStopsDropdown((prev) => !prev);
                  }}
                  className={`inline-flex items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold cursor-pointer focus:outline-none shadow-2xs transition-colors ${
                    hasStopsFilter
                      ? 'bg-blue-50/80 border border-blue-500 text-[#05203c]'
                      : 'bg-white border border-slate-300/90 hover:border-slate-400 text-slate-800'
                  }`}
                >
                  <span>Stops</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${
                      openStopsDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openStopsDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setOpenStopsDropdown(false)}
                    />
                    <div
                      role="radiogroup"
                      aria-label="Stops options"
                      className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 flex flex-col gap-0.5"
                    >
                      {STOPS_FILTER_OPTIONS.map((opt) => {
                        const isSelected = stopsFilter === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => {
                              setStopsFilter(opt.value);
                              setOpenStopsDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2.5 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 text-[#05203c] font-bold'
                                : 'text-slate-700 hover:bg-slate-100 font-medium'
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#0a3666]' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0a3666]" />
                              )}
                            </span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Compact Multi-Column City Boxes Stretching Edge-to-Edge */}
            {isLoadingCities ? (
              <InternationalCityGridSkeleton count={8} />
            ) : displayedCityRoutes.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
                <MapPin className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">
                  No locations match the selected budget or stops filter
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMinBudgetInr(MIN_BUDGET_SLIDER_INR);
                    setMaxBudgetInr(MAX_BUDGET_SLIDER_INR);
                    setStopsFilter('all');
                    setOpenBudgetDropdown(false);
                    setOpenStopsDropdown(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                data-testid="international-city-routes-list"
              >
                {displayedCityRoutes.map((item) => {
                  const fromLine =
                    currentStepConfig.direction === 'departure-cities'
                      ? `From ${item.city.city}`
                      : `From ${currentStepConfig.counterpartCity?.city || fromCity.city}`;

                  return (
                    <button
                      key={`${item.city.code}-${item.city.city}`}
                      type="button"
                      onClick={() => handleCityCardClick(item)}
                      className="w-full text-left bg-white rounded-xl border border-slate-200/90 hover:border-slate-300/90 px-4 py-3.5 flex items-center justify-between gap-3 transition-shadow duration-200 cursor-pointer shadow-2xs hover:shadow-[0_10px_24px_-4px_rgba(15,23,42,0.14),0_4px_10px_-2px_rgba(15,23,42,0.06)] focus:outline-none focus-visible:shadow-[0_10px_24px_-4px_rgba(15,23,42,0.14),0_4px_10px_-2px_rgba(15,23,42,0.06)]"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-display text-[15px] font-bold text-slate-900 truncate">
                          {item.city.city}, {item.city.country}
                        </div>
                        <div className="text-xs text-slate-600 truncate">
                          {fromLine}
                        </div>
                        <div
                          className={`text-xs font-medium ${
                            item.isDirect ? 'text-emerald-700' : 'text-slate-500'
                          }`}
                        >
                          {item.stopsLabel}
                        </div>
                      </div>

                      <div className="font-price text-base font-bold text-slate-900 tabular-nums shrink-0">
                        {formatPrice(item.lowestPriceInr, currency)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
