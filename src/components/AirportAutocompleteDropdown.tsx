import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin, Check, AlertCircle, Loader2, X, Globe } from 'lucide-react';
import { CityOption, CITIES } from '../data/travelData';
import { searchSupabaseAirports } from '../services/airportService';
import { testSupabaseConnection } from '../lib/supabase';
import {
  COUNTRY_DIRECTORY,
  findMatchingCountries,
  getPopularCountryOptions,
} from '../utils/internationalFlightRoutes';

interface AirportAutocompleteDropdownProps {
  label: string;
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
  isStation?: boolean;
  allowCountrySelection?: boolean;
}

export const AirportAutocompleteDropdown: React.FC<AirportAutocompleteDropdownProps> = ({
  label,
  selectedCity,
  onSelectCity,
  isOpen,
  onClose,
  align = 'left',
  isStation = false,
  allowCountrySelection = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityOption[]>(CITIES);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const canSelectCountry = allowCountrySelection && !isStation;

  const matchingCountries = useMemo(() => {
    if (!canSelectCountry || !query.trim()) return [];
    return findMatchingCountries(query, 4);
  }, [canSelectCountry, query]);

  const popularCountries = useMemo(() => {
    if (!canSelectCountry || query.trim()) return [];
    return getPopularCountryOptions();
  }, [canSelectCountry, query]);

  // Close when clicking anywhere outside the dropdown or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        onCloseRef.current();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };

    document.addEventListener('mousedown', handleOutsideMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Check connection on first open
  useEffect(() => {
    if (isOpen) {
      testSupabaseConnection().then((st) => {
        if (!st.connected && st.error) {
          setHasError(st.error);
        }
      });
      // Focus search input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Debounced search when query changes
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      setResults(CITIES);
      setLoading(false);
      return;
    }

    const qLower = query.trim().toLowerCase();
    const directoryHubMatches: CityOption[] = COUNTRY_DIRECTORY.flatMap((entry) =>
      entry.hubs
        .filter(
          (h) =>
            h.city.toLowerCase().includes(qLower) ||
            h.code.toLowerCase().includes(qLower) ||
            h.country.toLowerCase().includes(qLower) ||
            h.airportName.toLowerCase().includes(qLower)
        )
        .map((h) => ({
          city: h.city,
          code: h.code,
          stationCode: h.stationCode,
          country: h.country,
          airportName: h.airportName,
          popularTag: h.popularTag,
          countryIso2: h.countryIso2,
          flagEmoji: entry.flagEmoji,
          isCountry: false,
        }))
    );

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await searchSupabaseAirports(query, 18);
        const merged = [...directoryHubMatches];
        const seenCodes = new Set(merged.map((m) => m.code.toUpperCase()));
        for (const item of res.airports) {
          if (!seenCodes.has(item.code.toUpperCase())) {
            seenCodes.add(item.code.toUpperCase());
            merged.push(item);
          }
        }
        setResults(merged.slice(0, 20));
        if (res.error && merged.length === 0) {
          setHasError(res.error);
        } else {
          setHasError(null);
        }
      } catch (err: any) {
        if (directoryHubMatches.length > 0) {
          setResults(directoryHubMatches.slice(0, 20));
        } else {
          setHasError(err?.message || 'Search failed');
        }
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(handler);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const qTrim = query.trim().toLowerCase();
    if (canSelectCountry && matchingCountries.length > 0) {
      const topCountry = matchingCountries[0];
      const exactCountryOrAlias = COUNTRY_DIRECTORY.find(
        (entry) =>
          entry.country.toLowerCase() === topCountry.city.toLowerCase() &&
          (entry.country.toLowerCase() === qTrim ||
            entry.iso2.toLowerCase() === qTrim ||
            entry.aliases.some((a) => a === qTrim))
      );
      if (exactCountryOrAlias || results.length === 0) {
        onSelectCity(topCountry);
        onClose();
        return;
      }
    }

    if (results.length > 0) {
      onSelectCity(results[0]);
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      data-dropdown-container="true"
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${
        align === 'right' ? 'right-0' : 'left-0'
      } top-full mt-2 w-80 sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150`}
    >
      {/* Search Input Box */}
      <div className="relative mb-2">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={
            canSelectCountry
              ? `${label}: Type city, airport, or country (e.g. India, Japan)`
              : label
          }
          aria-label={`Search ${label} city, airport or country`}
          className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Error alert banner if any */}
      {hasError && (
        <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 shrink-0 text-amber-600" />
          <span className="truncate">{hasError}</span>
        </div>
      )}

      {/* Matching Countries Section (when user types a country name or alias) */}
      {canSelectCountry && matchingCountries.length > 0 && (
        <div className="mb-2.5 pb-2 border-b border-slate-100">
          <div className="px-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
            <Globe className="w-3 h-3 shrink-0" />
            <span>Search Entire Country (Compare All Cities &amp; Prices)</span>
          </div>
          <div className="space-y-1 mt-1">
            {matchingCountries.map((countryOpt) => {
              const isSelected =
                selectedCity.isCountry &&
                selectedCity.country.toLowerCase() === countryOpt.country.toLowerCase();
              return (
                <button
                  key={`country-${countryOpt.code}`}
                  type="button"
                  onClick={() => {
                    onSelectCity(countryOpt);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'bg-blue-50/70 hover:bg-blue-100/80 text-slate-900 border border-blue-200/70'
                  }`}
                >
                  <div className="min-w-0 pr-2 flex items-center gap-2.5">
                    <span className="text-base leading-none shrink-0" aria-hidden="true">
                      {countryOpt.flagEmoji || '🌍'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold text-xs sm:text-sm truncate ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {countryOpt.city} (All Cities)
                        </span>
                      </div>
                      <div
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-blue-100' : 'text-slate-600'
                        }`}
                      >
                        {countryOpt.popularTag}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono-tabular font-bold text-[10px] px-2 py-0.5 rounded-lg border ${
                        isSelected
                          ? 'bg-blue-700 text-white border-blue-400'
                          : 'bg-white text-blue-700 border-blue-200'
                      }`}
                    >
                      COUNTRY
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Browse by Country Strip (when query is blank in flight mode) */}
      {canSelectCountry && !query.trim() && popularCountries.length > 0 && (
        <div className="mb-2.5 pb-2 border-b border-slate-100">
          <div className="px-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-600" />
              <span>Browse by Country</span>
            </span>
            <span className="text-[10px] font-medium normal-case text-blue-600">
              Compare city prices
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 custom-scrollbar">
            {popularCountries.map((cOpt) => {
              const isSelected =
                selectedCity.isCountry &&
                selectedCity.country.toLowerCase() === cOpt.country.toLowerCase();
              return (
                <button
                  key={`pop-country-${cOpt.code}`}
                  type="button"
                  onClick={() => {
                    onSelectCity(cOpt);
                    onClose();
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200/70'
                  }`}
                >
                  <span aria-hidden="true">{cOpt.flagEmoji}</span>
                  <span>{cOpt.city}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <span>{query ? `Airports & Cities (${results.length})` : 'Popular Destinations'}</span>
        {loading && (
          <span className="flex items-center gap-1 text-blue-600 font-normal normal-case">
            <Loader2 className="w-3 h-3 animate-spin" /> Searching airports...
          </span>
        )}
      </div>

      {/* Results List */}
      <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 mt-1 pr-1">
        {results.length === 0 && matchingCountries.length === 0 && !loading ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            <MapPin className="w-6 h-6 mx-auto mb-1 text-slate-300" />
            No airports or countries found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          results.map((city, idx) => {
            const isSelected = !selectedCity.isCountry && selectedCity.code === city.code;
            return (
              <button
                key={`${city.code}-${idx}`}
                type="button"
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-blue-800 border border-blue-200/80 shadow-2xs font-semibold'
                    : 'hover:bg-slate-100/90 text-slate-700'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                      {city.city}
                    </span>
                    {city.country && (
                      <span className="text-[10px] text-slate-500 shrink-0">
                        ({city.country})
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-[11px] truncate max-w-[210px] sm:max-w-[260px] mt-0.5">
                    {isStation ? `${city.city} Junction (${city.stationCode})` : city.airportName}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono-tabular font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                    {isStation ? city.stationCode : city.code}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer info badge */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 px-1">
        <span>{canSelectCountry ? 'Cities & Countries Directory' : 'Global Airport Directory'}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
