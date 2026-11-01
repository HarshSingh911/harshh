import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Plane,
  TrainFront,
  Building2,
  Briefcase,
  X,
  ExternalLink,
  Sparkles,
  Check,
  Compass,
  Navigation,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export interface CabPlace {
  id: string;
  name: string;
  category: 'Airport' | 'Railway' | 'Hotel' | 'Hub' | 'Locality';
  address: string;
  landmark?: string;
  mapsUrl: string;
  isMapsGrounded: boolean;
  distanceEstimate?: string;
}

export interface CabLocationAutocompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'pickup' | 'drop';
  mode?: 'pickup' | 'drop';
  currentCity?: string;
  cityContext?: string;
  currentValue?: string;
  initialQuery?: string;
  onSelectLocation?: (place: CabPlace, customText?: string) => void;
  onSelectPlace?: (place: CabPlace, customText?: string) => void;
  onChangeCity?: (newCity: string) => void;
}

const POPULAR_CITIES = [
  'New Delhi',
  'Mumbai',
  'Goa',
  'Bengaluru',
  'Dubai',
  'Paris',
  'Bangkok',
];

export const CabLocationAutocompleteModal: React.FC<CabLocationAutocompleteModalProps> = ({
  isOpen,
  onClose,
  type: propType,
  mode: propMode,
  currentCity: propCurrentCity,
  cityContext: propCityContext,
  currentValue = '',
  initialQuery = '',
  onSelectLocation,
  onSelectPlace,
  onChangeCity,
}) => {
  const activeType: 'pickup' | 'drop' = propMode || propType || 'pickup';
  const effectiveCity = propCityContext || propCurrentCity || 'New Delhi';
  const effectiveInitial = initialQuery || currentValue;

  const handleSelect = (place: CabPlace, customText?: string) => {
    if (onSelectPlace) {
      onSelectPlace(place, customText);
    } else if (onSelectLocation) {
      onSelectLocation(place, customText);
    }
  };

  const [searchQuery, setSearchQuery] = useState(effectiveInitial);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [places, setPlaces] = useState<CabPlace[]>([]);
  const [mapsSources, setMapsSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [summary, setSummary] = useState('');
  const [isLiveMaps, setIsLiveMaps] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch places from server with Google Maps Grounding
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch('/api/cabs/lookup-places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            city: effectiveCity,
            type: activeType,
          }),
          signal: controller.signal,
        });

        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data.places) {
            setPlaces(data.places);
            setMapsSources(data.mapsSources || []);
            setSummary(data.summary || '');
            setIsLiveMaps(Boolean(data.isLiveMaps));
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Cabs lookup-places fetch notice:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, searchQuery ? 350 : 0);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isOpen, searchQuery, effectiveCity, activeType]);

  if (!isOpen) return null;

  const filteredPlaces = places.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryIcon = (cat: CabPlace['category']) => {
    switch (cat) {
      case 'Airport':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'Railway':
        return <TrainFront className="w-4 h-4 text-emerald-600" />;
      case 'Hotel':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'Hub':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      default:
        return <MapPin className="w-4 h-4 text-sky-600" />;
    }
  };

  const isPickup = activeType === 'pickup';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-modal-slide-up"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
              isPickup ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {isPickup ? 'Select Cab Pickup Point' : 'Select Cab Drop Point'}
                </h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isPickup ? 'bg-blue-500/25 text-blue-300 border border-blue-400/40' : 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                }`}>
                  {isPickup ? 'Pickup' : 'Dropoff'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>In &amp; around <strong>{effectiveCity}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-sky-300 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Google Maps Verified
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick City Switcher Ribbon */}
        {onChangeCity && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              City:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChangeCity(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    effectiveCity.toLowerCase() === c.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Input Box with Live Google Maps Indicator */}
        <div className="p-4 border-b border-slate-200 bg-white shrink-0 space-y-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${isPickup ? 'pickup' : 'drop'} terminal, railway station, hotel, or address...`}
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] py-0.5">
            {[
              { id: 'all', label: 'All Hubs' },
              { id: 'airport', label: 'Airports ✈️' },
              { id: 'railway', label: 'Railway Stations 🚆' },
              { id: 'hotel', label: 'Hotels & Resorts 🏨' },
              { id: 'hub', label: 'Tech Parks & Hubs 🏢' },
              { id: 'locality', label: 'Localities 📍' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar min-h-[220px]">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-600">
                Grounding locations with Google Maps data...
              </p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No verified hub found for &quot;{searchQuery}&quot;
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You can still confirm &quot;{searchQuery}&quot; as your custom doorstep address below!
              </p>
              {searchQuery.trim().length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    const customPlace: CabPlace = {
                      id: `custom-${Date.now()}`,
                      name: searchQuery.trim(),
                      category: 'Locality',
                      address: `${searchQuery.trim()}, ${effectiveCity}`,
                      landmark: 'Custom doorstep address',
                      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        searchQuery.trim() + ' ' + effectiveCity
                      )}`,
                      isMapsGrounded: true,
                    };
                    handleSelect(customPlace, searchQuery.trim());
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Use &quot;{searchQuery.trim()}&quot; as {isPickup ? 'Pickup' : 'Drop'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            filteredPlaces.map((place) => {
              const isSelected = currentValue === place.name || currentValue.includes(place.name);
              return (
                <div
                  key={place.id}
                  onClick={() => {
                    handleSelect(place);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors border border-slate-200/60 shadow-2xs">
                      {getCategoryIcon(place.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {place.name}
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          {place.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-normal">
                        {place.address}
                      </p>
                      {place.landmark && (
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Navigation className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                          <span>{place.landmark}</span>
                        </p>
                      )}

                      {/* Google Maps External Verification Link */}
                      {place.mapsUrl && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100/80 flex items-center gap-3">
                          <a
                            href={place.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            title="Verify location on Google Maps"
                          >
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>View on Google Maps</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>

                          {place.distanceEstimate && (
                            <span className="text-[10px] font-mono-tabular text-slate-400">
                              {place.distanceEstimate}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center self-center pl-2">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 underline group-hover:no-underline hidden sm:inline">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Grounding Banner */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Google Maps Grounded Engine</span>
            <span className="text-slate-400">· Accurate airport gates, stations &amp; pickup zones</span>
          </div>

          <div className="text-[11px] text-slate-500">
            Zero surge · Doorstep pickup
          </div>
        </div>
      </div>
    </div>
  );
};
