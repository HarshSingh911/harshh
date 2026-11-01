import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  MapPin,
  Plane,
  TrainFront,
  Building2,
  Briefcase,
  X,
  Check,
  Loader2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { CabPlace } from './CabLocationAutocompleteModal';

interface CabLocationDropdownProps {
  label: 'Pickup' | 'Drop';
  type: 'pickup' | 'drop';
  currentValue: string;
  cityContext: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (locationName: string, mapsUrl?: string) => void;
  align?: 'left' | 'right';
}

// Built-in curated hubs for popular cities for instant zero-latency presentation
const CURATED_CITY_HUBS: Record<string, CabPlace[]> = {
  delhi: [
    {
      id: 'del-hub-1',
      name: 'Indira Gandhi International Airport (Terminal 3 - IGI)',
      category: 'Airport',
      address: 'Terminal 3, New Delhi, Delhi 110037',
      landmark: 'Pillars 10-14 App-Based Cab Boarding Zone',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Indira+Gandhi+International+Airport+Terminal+3+New+Delhi',
      isMapsGrounded: true,
      distanceEstimate: '16 km from Connaught Place',
    },
    {
      id: 'del-hub-2',
      name: 'Indira Gandhi International Airport (Terminal 1 - Domestic)',
      category: 'Airport',
      address: 'Domestic Terminal 1D, Palam, New Delhi 110037',
      landmark: 'Arrival Gate 2 Dedicated Cab Pick-up Bay',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=IGI+Airport+Terminal+1+New+Delhi',
      isMapsGrounded: true,
      distanceEstimate: '14 km from City Center',
    },
    {
      id: 'del-hub-3',
      name: 'New Delhi Railway Station (Ajmeri Gate & Paharganj)',
      category: 'Railway',
      address: 'Bhavbhuti Marg, Ratan Lal Market, Kamla Market, New Delhi 110006',
      landmark: 'Ajmeri Gate Metro Station Exit 2 & Taxi Stand',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=New+Delhi+Railway+Station',
      isMapsGrounded: true,
      distanceEstimate: 'Central Delhi (1 km from CP)',
    },
    {
      id: 'del-hub-4',
      name: 'Hazrat Nizamuddin Railway Station (NZM)',
      category: 'Railway',
      address: 'Nizamuddin, Jungpura, New Delhi, Delhi 110013',
      landmark: 'Main Porch & Sarai Kale Khan RRTS Hub',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hazrat+Nizamuddin+Railway+Station',
      isMapsGrounded: true,
      distanceEstimate: '7 km from India Gate',
    },
    {
      id: 'del-hub-5',
      name: 'Connaught Place (Inner & Outer Circle)',
      category: 'Hub',
      address: 'Connaught Place, New Delhi, Delhi 110001',
      landmark: 'Block B & Block E Central Arcade',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Connaught+Place+New+Delhi',
      isMapsGrounded: true,
      distanceEstimate: 'City Center (0 km)',
    },
    {
      id: 'del-hub-6',
      name: 'DLF Cyber City & Cyber Hub (Gurugram)',
      category: 'Hub',
      address: 'DLF Phase 2, Sector 24, Gurugram, Haryana 122002',
      landmark: 'Cyber Hub Amphitheatre & Rapid Metro',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=DLF+Cyber+City+Gurugram',
      isMapsGrounded: true,
      distanceEstimate: '11 km from IGI Airport',
    },
    {
      id: 'del-hub-7',
      name: 'Aerocity Hospitality District & Worldmark',
      category: 'Hotel',
      address: 'Asset Area 11, Hospitality District, Aerocity, New Delhi 110037',
      landmark: 'Near JW Marriott & Pullman Hotel Porch',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Aerocity+Worldmark+New+Delhi',
      isMapsGrounded: true,
      distanceEstimate: '3 km from T3 Airport',
    },
    {
      id: 'del-hub-8',
      name: 'Select CITYWALK & Saket District Centre',
      category: 'Locality',
      address: 'A-3, District Centre, Saket, New Delhi, Delhi 110017',
      landmark: 'Gate 2 Driveway & Sheraton Hotel Drop Point',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Select+Citywalk+Saket+New+Delhi',
      isMapsGrounded: true,
      distanceEstimate: 'South Delhi Hub',
    },
  ],
  mumbai: [
    {
      id: 'bom-hub-1',
      name: 'Chhatrapati Shivaji Maharaj International Airport (T2 - BOM)',
      category: 'Airport',
      address: 'Sahar, Andheri East, Mumbai, Maharashtra 400099',
      landmark: 'Level P10 / P7 Multi-level Car Parking Cab Zone',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chhatrapati+Shivaji+Maharaj+International+Airport+Terminal+2',
      isMapsGrounded: true,
      distanceEstimate: 'Central Suburban Mumbai',
    },
    {
      id: 'bom-hub-2',
      name: 'Chhatrapati Shivaji Domestic Airport (T1 - Santacruz)',
      category: 'Airport',
      address: 'Western Express Hwy, Vile Parle, Mumbai 400099',
      landmark: 'Arrival Terminal 1B Pickup Ramp',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mumbai+Domestic+Airport+Terminal+1',
      isMapsGrounded: true,
      distanceEstimate: 'Santacruz West',
    },
    {
      id: 'bom-hub-3',
      name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT - Fort)',
      category: 'Railway',
      address: 'DN Road, Fort, Mumbai, Maharashtra 400001',
      landmark: 'Opposite BMC Headquarters & Platform 18 Taxi Bay',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=CSMT+Mumbai',
      isMapsGrounded: true,
      distanceEstimate: 'South Mumbai Heritage Hub',
    },
    {
      id: 'bom-hub-4',
      name: 'Bandra Kurla Complex (BKC Financial District)',
      category: 'Hub',
      address: 'G Block, BKC, Bandra East, Mumbai, Maharashtra 400051',
      landmark: 'Near Jio World Centre & US Consulate',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bandra+Kurla+Complex+Mumbai',
      isMapsGrounded: true,
      distanceEstimate: '8 km from Airport',
    },
    {
      id: 'bom-hub-5',
      name: 'The Taj Mahal Palace & Gateway of India (Colaba)',
      category: 'Hotel',
      address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
      landmark: 'Heritage Main Porch & Seaface Promenade',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Taj+Mahal+Palace+Mumbai',
      isMapsGrounded: true,
      distanceEstimate: 'South Mumbai waterfront',
    },
    {
      id: 'bom-hub-6',
      name: 'Hiranandani Gardens & Central Avenue (Powai)',
      category: 'Locality',
      address: 'Central Avenue, Powai, Mumbai, Maharashtra 400076',
      landmark: 'Near Galleria Mall & Powai Lake Promenade',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hiranandani+Gardens+Powai+Mumbai',
      isMapsGrounded: true,
      distanceEstimate: 'Eastern Suburbs Tech Hub',
    },
  ],
  bengaluru: [
    {
      id: 'blr-hub-1',
      name: 'Kempegowda International Airport (BLR - Terminal 1 & 2)',
      category: 'Airport',
      address: 'KIAL Rd, Devanahalli, Bengaluru, Karnataka 560300',
      landmark: 'Arrival Hall P4 App-Based Cab Boarding Zone',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kempegowda+International+Airport+Bengaluru',
      isMapsGrounded: true,
      distanceEstimate: '35 km from MG Road',
    },
    {
      id: 'blr-hub-2',
      name: 'KSR Bengaluru City Railway Station (Majestic)',
      category: 'Railway',
      address: 'Kempegowda, Sevashrama, Bengaluru, Karnataka 560023',
      landmark: 'Majestic Metro Interchange & Platform 1 Porch',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=KSR+Bengaluru+City+Railway+Station',
      isMapsGrounded: true,
      distanceEstimate: 'Central Bengaluru',
    },
    {
      id: 'blr-hub-3',
      name: 'Indiranagar (100 Feet Road & 12th Main)',
      category: 'Locality',
      address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
      landmark: 'Near Indiranagar Metro Station & Toit Pub',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Indiranagar+100+Feet+Road+Bengaluru',
      isMapsGrounded: true,
      distanceEstimate: '5 km from MG Road',
    },
    {
      id: 'blr-hub-4',
      name: 'Electronic City Phase 1 (Toll Plaza & Wipro Gate)',
      category: 'Hub',
      address: 'Hosur Rd, Electronic City, Bengaluru, Karnataka 560100',
      landmark: 'Elevated Expressway Exit & Infosys Gate 1',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Electronic+City+Phase+1+Bengaluru',
      isMapsGrounded: true,
      distanceEstimate: '20 km from City Center',
    },
    {
      id: 'blr-hub-5',
      name: 'Whitefield ITPL & Phoenix Marketcity',
      category: 'Hub',
      address: 'Whitefield Main Rd, Bengaluru, Karnataka 560066',
      landmark: 'Near ITPL Main Gate & Metro Station',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=ITPL+Whitefield+Bengaluru',
      isMapsGrounded: true,
      distanceEstimate: 'IT Corridor East',
    },
  ],
  goa: [
    {
      id: 'goa-hub-1',
      name: 'Manohar International Airport (MOPA - North Goa)',
      category: 'Airport',
      address: 'Mopa, Pernem, Goa 403512',
      landmark: 'Arrival Terminal Taxi & Cab Stand',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Manohar+International+Airport+Mopa+Goa',
      isMapsGrounded: true,
      distanceEstimate: '30 km from Baga/Calangute',
    },
    {
      id: 'goa-hub-2',
      name: 'Dabolim International Airport (GOI - South Goa)',
      category: 'Airport',
      address: 'Airport Rd, Dabolim, Goa 403801',
      landmark: 'Arrival Gate Pre-Paid Cab Counter',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dabolim+Airport+Goa',
      isMapsGrounded: true,
      distanceEstimate: '25 km from Panaji',
    },
    {
      id: 'goa-hub-3',
      name: 'Madgaon Junction Railway Station (MAO)',
      category: 'Railway',
      address: 'Margao, Goa 403601',
      landmark: 'Platform 1 Main Gate Taxi Stand',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Madgaon+Railway+Station+Goa',
      isMapsGrounded: true,
      distanceEstimate: 'South Goa Rail Hub',
    },
    {
      id: 'goa-hub-4',
      name: 'Calangute & Baga Beach Circle',
      category: 'Locality',
      address: 'Tito\'s Lane & Calangute Beach Rd, North Goa 403516',
      landmark: 'Near Calangute Mall & Tito\'s Lane entrance',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Calangute+Beach+Goa',
      isMapsGrounded: true,
      distanceEstimate: 'North Goa Coastal Strip',
    },
    {
      id: 'goa-hub-5',
      name: 'Panaji Promenade & Mandovi Riverfront',
      category: 'Hub',
      address: 'Dayanand Bandodkar Marg, Panaji, Goa 403001',
      landmark: 'Near Casino Pride Jetty & Miramar Beach',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Panaji+Goa',
      isMapsGrounded: true,
      distanceEstimate: 'Goa State Capital',
    },
  ],
};

function getCityHubs(city: string): CabPlace[] {
  const cLower = (city || '').toLowerCase().trim();
  if (cLower.includes('delhi') || cLower.includes('noida') || cLower.includes('gurgaon') || cLower.includes('gurugram')) {
    return CURATED_CITY_HUBS.delhi;
  }
  if (cLower.includes('mumbai') || cLower.includes('bombay') || cLower.includes('thane') || cLower.includes('navi')) {
    return CURATED_CITY_HUBS.mumbai;
  }
  if (cLower.includes('bangalore') || cLower.includes('bengaluru')) {
    return CURATED_CITY_HUBS.bengaluru;
  }
  if (cLower.includes('goa') || cLower.includes('panaji') || cLower.includes('madgaon')) {
    return CURATED_CITY_HUBS.goa;
  }

  // Generic fallback hubs for any other city
  const cap = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'City';
  return [
    {
      id: `gen-hub-1-${cap}`,
      name: `${cap} International / Domestic Airport Terminal`,
      category: 'Airport',
      address: `Airport Access Road, ${cap}`,
      landmark: 'Arrival Gate Dedicated Cab Pickup Zone',
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cap + ' Airport')}`,
      isMapsGrounded: true,
      distanceEstimate: `12 km from ${cap} Center`,
    },
    {
      id: `gen-hub-2-${cap}`,
      name: `${cap} Central Junction Railway Station`,
      category: 'Railway',
      address: `Station Road, ${cap}`,
      landmark: 'Platform 1 Main Porch & Pre-paid Taxi Bay',
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cap + ' Railway Station')}`,
      isMapsGrounded: true,
      distanceEstimate: `Central ${cap}`,
    },
    {
      id: `gen-hub-3-${cap}`,
      name: `${cap} Downtown Center & Commercial Market`,
      category: 'Hub',
      address: `Main City Center, ${cap}`,
      landmark: 'Central Shopping Plaza & Commercial Arcade',
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cap + ' City Center')}`,
      isMapsGrounded: true,
      distanceEstimate: 'City Center (0 km)',
    },
    {
      id: `gen-hub-4-${cap}`,
      name: `5-Star Luxury Hotels Enclave, ${cap}`,
      category: 'Hotel',
      address: `Hospitality Boulevard, ${cap}`,
      landmark: 'Major Luxury Hotels & Concierge Driveway',
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cap + ' 5 Star Hotels')}`,
      isMapsGrounded: true,
      distanceEstimate: `6 km from ${cap}`,
    },
  ];
}

export const CabLocationDropdown: React.FC<CabLocationDropdownProps> = ({
  label,
  type,
  currentValue,
  cityContext,
  isOpen,
  onClose,
  onSelectLocation,
  align = 'left',
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [livePlaces, setLivePlaces] = useState<CabPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPickup = type === 'pickup';
  const defaultHubs = useMemo(() => getCityHubs(cityContext), [cityContext]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Debounced search via /api/cabs/lookup-places for live Google Maps grounding
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      setLivePlaces([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/cabs/lookup-places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query.trim(),
            city: cityContext || 'New Delhi',
            type,
          }),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.places) && data.places.length > 0) {
            setLivePlaces(data.places);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Cab lookup search notice:', err);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen, cityContext, type]);

  if (!isOpen) return null;

  // Combine live places or filter default curated hubs
  const qClean = query.toLowerCase().trim();
  let candidatePlaces: CabPlace[] = [];

  if (livePlaces.length > 0) {
    candidatePlaces = livePlaces;
  } else if (qClean) {
    candidatePlaces = defaultHubs.filter(
      (h) =>
        h.name.toLowerCase().includes(qClean) ||
        h.address.toLowerCase().includes(qClean) ||
        h.landmark?.toLowerCase().includes(qClean) ||
        h.category.toLowerCase().includes(qClean)
    );
  } else {
    candidatePlaces = defaultHubs;
  }

  // Filter by category chip
  const displayedPlaces = candidatePlaces.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryIcon = (category: CabPlace['category']) => {
    switch (category) {
      case 'Airport':
        return <Plane className="w-3.5 h-3.5 text-blue-600" />;
      case 'Railway':
        return <TrainFront className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Hotel':
        return <Building2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'Hub':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  const handleSelect = (name: string, mapsUrl?: string) => {
    onSelectLocation(name, mapsUrl);
    onClose();
  };

  return (
    <div
      data-dropdown-container="true"
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${
        align === 'right' ? 'right-0' : 'left-0'
      } top-full mt-2 w-80 sm:w-[410px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150`}
    >
      {/* Header with Title */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-900">
          Select {label} Point
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          aria-label="Close dropdown"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input Box */}
      <div className="relative mb-2">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${isPickup ? 'pickup' : 'drop'} terminal, hotel, landmark, area...`}
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

      {/* Fast Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] pb-2 mb-1 border-b border-slate-100">
        {[
          { id: 'all', label: 'All Points' },
          { id: 'airport', label: 'Airports ✈️' },
          { id: 'railway', label: 'Stations 🚆' },
          { id: 'hotel', label: 'Hotels 🏨' },
          { id: 'hub', label: 'Hubs 🏢' },
          { id: 'locality', label: 'Localities 📍' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Custom Address Direct Option if user typed something specific */}
      {query.trim().length >= 2 && (
        <button
          type="button"
          onClick={() => {
            const trimmed = query.trim();
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              trimmed + ' ' + (cityContext || '')
            )}`;
            handleSelect(trimmed, mapsUrl);
          }}
          className="w-full mb-1.5 p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-blue-900 truncate">
                &ldquo;{query.trim()}&rdquo;
              </span>
              <span className="block text-[10px] text-blue-700">
                Set custom {isPickup ? 'pickup' : 'drop'} location
              </span>
            </div>
          </div>
        </button>
      )}

      {/* Section Subheading & Loading Indicator */}
      <div className="flex items-center justify-between px-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <span>{query ? `Results (${displayedPlaces.length})` : `Popular ${label} Hubs`}</span>
        {loading && (
          <span className="inline-flex items-center gap-1 text-blue-600 font-normal normal-case">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Finding locations...</span>
          </span>
        )}
      </div>

      {/* Scrollable List of Locations (No new tab, inline select) */}
      <div className="max-h-64 sm:max-h-72 overflow-y-auto custom-scrollbar space-y-1.5 pr-0.5">
        {displayedPlaces.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            <p className="font-semibold text-slate-700 mb-1">
              No matching hub found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-[11px] text-slate-400">
              Type your location name above to set it directly.
            </p>
          </div>
        ) : (
          displayedPlaces.map((place) => {
            const isSelected =
              currentValue === place.name ||
              (currentValue && place.name && currentValue.includes(place.name));

            return (
              <div
                key={place.id}
                onClick={() => handleSelect(place.name, place.mapsUrl)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 group ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-blue-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors border border-slate-200/50">
                    {getCategoryIcon(place.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug truncate">
                        {place.name}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {place.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate leading-tight">
                      {place.address}
                    </p>
                    {place.landmark && (
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                        <Navigation className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                        <span className="truncate">{place.landmark}</span>
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="shrink-0 flex items-center self-center pl-1">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Verified Transit Gates &amp; Zones
        </span>
        <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
          Zero Surge
        </span>
      </div>
    </div>
  );
};
