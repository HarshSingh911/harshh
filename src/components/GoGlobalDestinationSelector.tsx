import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  MapPin,
  Search,
  Check,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';
import {
  SupabaseCountry,
  SupabaseCity,
  fetchCountriesFromSupabase,
  fetchCitiesByCountryFromSupabase,
} from '../services/destinationLocationService';

interface GoGlobalDestinationSelectorProps {
  selectedCountry: SupabaseCountry | null;
  selectedCity: SupabaseCity | null;
  onCountryChange: (country: SupabaseCountry) => void;
  onCityChange: (city: SupabaseCity) => void;
  onNotify?: (title: string, detail: string, type?: 'success' | 'info') => void;
}

export const GoGlobalDestinationSelector: React.FC<GoGlobalDestinationSelectorProps> = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  onNotify,
}) => {
  // Single Unified Dropdown open state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Search input state (search country or city)
  const [searchInput, setSearchInput] = useState<string>('');

  // Countries State from Supabase public.countries
  const [countries, setCountries] = useState<SupabaseCountry[]>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<string | null>(null);

  // Active / Focused Country for city recommendations
  const [activeCountry, setActiveCountry] = useState<SupabaseCountry | null>(selectedCountry);

  // Cities State from Supabase public.cities
  const [cities, setCities] = useState<SupabaseCity[]>([]);
  const [cityFilter, setCityFilter] = useState<string>('');
  const [cityPage, setCityPage] = useState<number>(0);
  const [cityTotalCount, setCityTotalCount] = useState<number>(0);
  const [cityHasMore, setCityHasMore] = useState<boolean>(false);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [loadingMoreCities, setLoadingMoreCities] = useState<boolean>(false);
  const [cityError, setCityError] = useState<string | null>(null);

  // Search input ref & container ref
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize active country with prop
  useEffect(() => {
    if (selectedCountry) {
      setActiveCountry(selectedCountry);
    }
  }, [selectedCountry]);

  // 1. Fetch all countries from public.countries on mount
  const loadCountries = async () => {
    setLoadingCountries(true);
    setCountryError(null);
    try {
      const res = await fetchCountriesFromSupabase();
      if (res.error) {
        setCountryError(res.error);
      } else {
        setCountries(res.countries);
      }
    } catch (err: any) {
      setCountryError(err?.message || 'Failed to load countries');
    } finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // 2. Fetch cities for the active country from public.cities (Requirement 3 & 4)
  const loadCitiesForCountry = async (
    countryIso2: string,
    filterText: string,
    page: number,
    isAppend: boolean = false
  ) => {
    if (!countryIso2) return;

    if (isAppend) {
      setLoadingMoreCities(true);
    } else {
      setLoadingCities(true);
      setCityError(null);
    }

    try {
      const result = await fetchCitiesByCountryFromSupabase({
        countryIso2,
        searchQuery: filterText,
        page,
        pageSize: 30,
      });

      if (result.error) {
        setCityError(result.error);
      } else {
        if (isAppend) {
          setCities((prev) => [...prev, ...result.cities]);
        } else {
          setCities(result.cities);
        }
        setCityTotalCount(result.totalCount);
        setCityHasMore(result.hasMore);
        setCityPage(page);
      }
    } catch (err: any) {
      setCityError(err?.message || 'Failed to load cities');
    } finally {
      setLoadingCities(false);
      setLoadingMoreCities(false);
    }
  };

  // When active country changes, fetch its recommended cities from Supabase
  useEffect(() => {
    if (activeCountry?.iso2) {
      setCityPage(0);
      loadCitiesForCountry(activeCountry.iso2, cityFilter, 0, false);
    } else {
      setCities([]);
      setCityTotalCount(0);
      setCityHasMore(false);
    }
  }, [activeCountry?.iso2]);

  // Dynamic Country Matching when user types in the search bar:
  // "agr m koi country likhu to uske recommend m uski cities show hone lge"
  useEffect(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) {
      setCityFilter('');
      return;
    }

    // Check if what user typed matches any country in our 250 countries
    const exactMatch = countries.find(
      (c) =>
        c.country_name.toLowerCase() === q ||
        c.iso2.toLowerCase() === q
    );

    const partialCountryMatch = countries.find(
      (c) =>
        c.country_name.toLowerCase().startsWith(q) ||
        c.country_name.toLowerCase().includes(q)
    );

    const matchedCountry = exactMatch || (q.length >= 2 ? partialCountryMatch : null);

    if (matchedCountry && matchedCountry.iso2 !== activeCountry?.iso2) {
      // Auto-focus that country and fetch its recommended cities!
      setActiveCountry(matchedCountry);
      onCountryChange(matchedCountry);
      setCityFilter('');
    } else if (activeCountry) {
      // If a country is already active, user typing filters cities within that country
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        setCityFilter(searchInput);
        setCityPage(0);
        loadCitiesForCountry(activeCountry.iso2, searchInput, 0, false);
      }, 350);
    }
  }, [searchInput, countries]);

  // Countries filtered by search input (for the quick-match bar)
  const matchingCountries = React.useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return [];
    return countries
      .filter(
        (c) =>
          c.country_name.toLowerCase().includes(q) ||
          c.iso2.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [countries, searchInput]);

  // Popular Quick Countries to switch in 1 tap (matched dynamically from Supabase countries!)
  const quickCountries = React.useMemo(() => {
    const popularIsos = ['FR', 'JP', 'IT', 'ES', 'CH', 'AE', 'ID', 'IN', 'TH', 'US', 'GB', 'DE'];
    return popularIsos
      .map((iso) => countries.find((c) => c.iso2 === iso))
      .filter((c): c is SupabaseCountry => Boolean(c));
  }, [countries]);

  // Switch Active Country
  const handleSelectCountry = (country: SupabaseCountry) => {
    setActiveCountry(country);
    onCountryChange(country); // Clears previous city in parent state (Requirement 7)
    setSearchInput('');
    setCityFilter('');
    onNotify?.(
      'Country Selected',
      `Showing verified city recommendations for ${country.flag_emoji} ${country.country_name}`,
      'info'
    );
  };

  // Select City Handler
  const handleSelectCity = (city: SupabaseCity) => {
    if (activeCountry) {
      onCountryChange(activeCountry);
    }
    onCityChange(city);
    setIsOpen(false);
    setSearchInput('');
    onNotify?.(
      'Destination Set',
      `Destination configured for ${city.city_name}, ${activeCountry?.country_name || ''}!`,
      'success'
    );
  };

  // Load more cities for pagination
  const handleLoadMoreCities = () => {
    if (!activeCountry?.iso2 || loadingMoreCities || !cityHasMore) return;
    const nextPage = cityPage + 1;
    loadCitiesForCountry(activeCountry.iso2, cityFilter, nextPage, true);
  };

  // Display title for the single unified button
  const displayTitle = React.useMemo(() => {
    if (selectedCity && selectedCountry) {
      return `${selectedCity.city_name}, ${selectedCountry.country_name}`;
    }
    if (selectedCountry) {
      return `${selectedCountry.country_name} • Choose a City`;
    }
    return 'Search country or city...';
  }, [selectedCity, selectedCountry]);

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      {/* =========================================================================
          SINGLE UNIFIED DESTINATION BUTTON (Country & City unified in one block)
      ========================================================================= */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="w-full flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full hover:bg-slate-100 transition-all text-left cursor-pointer group"
        title="Search destination country and cities from Supabase database"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 shadow-xs">
          {selectedCountry ? (
            <span className="text-lg leading-none" role="img" aria-label={selectedCountry.country_name}>
              {selectedCountry.flag_emoji}
            </span>
          ) : (
            <MapPin className="w-4 h-4 text-emerald-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Destination
          </span>
          <span className="font-bold text-xs sm:text-sm text-slate-900 truncate block">
            {displayTitle}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* =========================================================================
          UNIFIED DROPDOWN: TYPE COUNTRY -> ITS CITIES APPEAR AS RECOMMENDATIONS
      ========================================================================= */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full left-0 mt-3 w-88 sm:w-[430px] max-w-[94vw] bg-white rounded-3xl shadow-[0_25px_70px_rgba(15,23,42,0.28)] border border-slate-200/90 p-3.5 sm:p-4 z-[90] animate-modal-slide-up"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="font-display font-bold text-xs sm:text-sm text-slate-900">
                Select Destination
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Supabase Live
            </span>
          </div>

          {/* Search Input: Type country or city */}
          <div className="mt-3 mb-2.5">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type a country (e.g. France, Japan, India...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
              />
              {loadingCities && <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin shrink-0" />}
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="block text-[10px] text-slate-400 font-medium px-1.5 mt-1">
              Type any country to instantly view its verified cities from Supabase
            </span>
          </div>

          {/* Matching Countries Bar (when typing) */}
          {matchingCountries.length > 0 && (
            <div className="mb-3 p-2 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1.5 px-1">
                Matching Countries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchingCountries.map((c) => {
                  const isActive = activeCountry?.iso2 === c.iso2;
                  return (
                    <button
                      key={c.iso2}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-emerald-100/80 border border-emerald-200'
                      }`}
                    >
                      <span className="text-sm">{c.flag_emoji}</span>
                      <span>{c.country_name}</span>
                      {isActive && <Check className="w-3 h-3 text-white ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Country Switcher Chips (when search is blank) */}
          {!searchInput && quickCountries.length > 0 && (
            <div className="mb-3 pb-2.5 border-b border-slate-100">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                <span>Popular Countries</span>
                <span className="text-emerald-600 lowercase font-medium">click to load cities</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {quickCountries.map((c) => {
                  const isActive = activeCountry?.iso2 === c.iso2;
                  return (
                    <button
                      key={c.iso2}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{c.flag_emoji}</span>
                      <span>{c.country_name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              RECOMMENDED CITIES SECTION FOR THE ACTIVE COUNTRY
          ========================================================================= */}
          {activeCountry ? (
            <div>
              {/* Active Country Header */}
              <div className="flex items-center justify-between pb-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Recommended Cities in {activeCountry.country_name}
                  </span>
                  <span className="text-base leading-none" role="img" aria-label={activeCountry.country_name}>
                    {activeCountry.flag_emoji}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  {cityTotalCount} {cityTotalCount === 1 ? 'city' : 'cities'}
                </span>
              </div>

              {/* Cities List / Loading / Error / Empty */}
              {loadingCities ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  <span className="text-xs font-medium">
                    Loading recommended cities in {activeCountry.country_name}...
                  </span>
                </div>
              ) : cityError ? (
                <div className="py-6 px-3 text-center">
                  <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-red-600 mb-2">{cityError}</p>
                  <button
                    type="button"
                    onClick={() =>
                      activeCountry?.iso2 &&
                      loadCitiesForCountry(activeCountry.iso2, cityFilter, 0, false)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                </div>
              ) : cities.length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <MapPin className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">
                    No cities found {cityFilter ? `matching "${cityFilter}"` : ''} in {activeCountry.country_name}.
                  </p>
                  {cityFilter && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        setCityFilter('');
                      }}
                      className="mt-2 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                  {cities.map((city) => {
                    const isSelected = selectedCity?.id === city.id || selectedCity?.city_name === city.city_name;
                    return (
                      <button
                        key={`${city.id}-${city.city_name}`}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer group ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="truncate block text-slate-900 group-hover:text-emerald-700">
                              {city.city_name}
                            </span>
                            {city.state_region && (
                              <span className="text-[10px] text-slate-400 block truncate">
                                {city.state_region}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {activeCountry.country_name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                        </div>
                      </button>
                    );
                  })}

                  {/* Load More Cities (Pagination) */}
                  {cityHasMore && (
                    <div className="pt-2 pb-1 text-center border-t border-slate-100">
                      <button
                        type="button"
                        disabled={loadingMoreCities}
                        onClick={handleLoadMoreCities}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {loadingMoreCities ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                            <span>Loading more cities...</span>
                          </>
                        ) : (
                          <span>
                            Load more cities ({cities.length} of {cityTotalCount})
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <Globe className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-700">
                Type any country above to explore its cities
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Over 250 countries and 69,000+ verified cities available
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
