import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Database, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { CityOption, CITIES } from '../data/travelData';
import { searchSupabaseAirports } from '../services/airportService';
import { testSupabaseConnection, SupabaseConnectionStatus } from '../lib/supabase';

interface AirportAutocompleteDropdownProps {
  label: 'From' | 'To' | 'City / Airport';
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
  isStation?: boolean;
}

export const AirportAutocompleteDropdown: React.FC<AirportAutocompleteDropdownProps> = ({
  label,
  selectedCity,
  onSelectCity,
  isOpen,
  onClose,
  align = 'left',
  isStation = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityOption[]>(CITIES);
  const [loading, setLoading] = useState(false);
  const [connStatus, setConnStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [hasError, setHasError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check connection on first open
  useEffect(() => {
    if (isOpen) {
      testSupabaseConnection().then((st) => {
        setConnStatus(st);
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

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await searchSupabaseAirports(query, 18);
        setResults(res.airports);
        if (res.error) {
          setHasError(res.error);
        } else {
          setHasError(null);
        }
      } catch (err: any) {
        setHasError(err?.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(handler);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-dropdown-container="true"
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${
        align === 'right' ? 'right-0' : 'left-0'
      } top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150`}
    >
      {/* Header with Title and Supabase Status */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-800">Select {label}</span>
          <span className="text-[10px] text-slate-400">({isStation ? 'Rail/Air' : 'Airport'})</span>
        </div>

        {/* Supabase Connection indicator pill */}
        <div
          title={
            connStatus?.connected
              ? `Connected to Supabase (${connStatus.totalAirports?.toLocaleString() || '9,000+'} airports in '${connStatus.tableName}' table)`
              : connStatus?.error
              ? `Supabase Error: ${connStatus.error}`
              : 'Connecting to Supabase...'
          }
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
            connStatus?.connected
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : hasError
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Database className="w-2.5 h-2.5 text-current" />
          <span>
            {connStatus?.connected
              ? `Supabase Live (${connStatus.totalAirports || '9k+'})`
              : hasError
              ? 'Local Fallback'
              : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative mb-2">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, airport name, or code (e.g. DEL, JFK, Paris)..."
          className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
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

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <span>{query ? `Search Results (${results.length})` : 'Popular Destinations'}</span>
        {loading && (
          <span className="flex items-center gap-1 text-blue-600 font-normal normal-case">
            <Loader2 className="w-3 h-3 animate-spin" /> Searching Supabase...
          </span>
        )}
      </div>

      {/* Results List */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1 mt-1 pr-1">
        {results.length === 0 && !loading ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            <MapPin className="w-6 h-6 mx-auto mb-1 text-slate-300" />
            No airports found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          results.map((city, idx) => {
            const isSelected = selectedCity.code === city.code;
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
        <span>Powered by Supabase Database</span>
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
