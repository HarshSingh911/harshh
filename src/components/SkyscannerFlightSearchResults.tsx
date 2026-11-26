import React, { useState, useMemo, useEffect } from 'react';
import {
  Plane,
  Calendar,
  Clock,
  Luggage,
  ArrowRight,
  ArrowLeftRight,
  Check,
  ChevronDown,
  SlidersHorizontal,
  Bell,
  RotateCcw,
  Sparkles,
  Leaf,
  ThumbsUp,
  Zap,
  Sun,
  Moon,
  Utensils,
  Wifi,
  Armchair,
  Info,
  TrendingDown,
  ShieldCheck,
  ExternalLink,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RefreshCw,
  Activity,
  Search,
} from 'lucide-react';
import {
  CityOption,
  CurrencyCode,
  TripType,
  formatPrice,
  BookingCategory,
} from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';
import { AirportAutocompleteDropdown } from './AirportAutocompleteDropdown';
import { NormalCalendarDropdown } from './NormalCalendarDropdown';
import {
  getDisplayLocationCode,
  hasCityOptionChanged,
} from '../utils/internationalFlightRoutes';

export interface SkyscannerFlight {
  id: string;
  airline: string;
  flightNo: string;
  badgeCode: string;
  badgeBg: string;
  aircraft: string;
  depTime: string;
  depTerminal: string;
  duration: string;
  durationMins: number;
  stops: string;
  stopsCount: number;
  stopAirport?: string;
  arrTime: string;
  arrTerminal: string;
  daysLater?: number;
  priceInr: number;
  rating: number;
  tags: string[];
  baggage: string;
  co2Reduction?: string; // e.g. "-18% CO2"
  co2Eco?: boolean;
  isPopular?: boolean;
  isFastest?: boolean;
  isBestFare?: boolean;
  providersCount: number;
  primaryProvider: string;
  amenities: {
    wifi?: boolean;
    meal?: boolean;
    seatPitch?: string;
    power?: boolean;
    entertainment?: boolean;
  };
  depAirport?: string;
  arrAirport?: string;
  depGate?: string;
  arrGate?: string;
  flightStatus?: 'scheduled' | 'active' | 'landed' | 'delayed' | 'cancelled';
  delayMinutes?: number;
  isLiveAviationstack?: boolean;
}

export interface SkyscannerFlightSearchResultsProps {
  fromCity: CityOption;
  toCity: CityOption;
  departureDate: string;
  returnDate?: string;
  tripType?: TripType;
  dummyTripType?: 'one-way' | 'round-trip';
  travellers: number;
  cabinClass: string;
  currency: CurrencyCode;
  onSelectFlightOrStayForCheckout: (summary: CheckoutItem) => void;
  onChangeDepartureDate?: (d: string) => void;
  onChangeReturnDate?: (d: string) => void;
  onChangeFromCity?: (c: CityOption) => void;
  onChangeToCity?: (c: CityOption) => void;
  onChangeTravellers?: (count: number, cabin: string) => void;
  onChangeTripType?: (t: TripType) => void;
  onChangeDummyTripType?: (t: 'one-way' | 'round-trip') => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  currentCategory: BookingCategory;
  onChangeCategory?: (cat: BookingCategory) => void;
}

// ============================================================================
// RICH FLIGHT CATALOG (Domestic & International matching SkyVoyage reference)
// ============================================================================

const SKY_FLIGHT_CATALOG: SkyscannerFlight[] = [
  {
    id: 'sky-ba-178',
    airline: 'British Airways',
    flightNo: 'BA-178',
    badgeCode: 'BA',
    badgeBg: 'bg-blue-900',
    aircraft: 'Boeing 777-300ER',
    depTime: '08:30',
    depTerminal: 'Terminal 5',
    duration: '8h 05m',
    durationMins: 485,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '11:35',
    arrTerminal: 'Terminal 7',
    priceInr: 32250,
    rating: 4.8,
    tags: ['Popular choice', 'Free Checked Luggage'],
    baggage: '7 kg Cabin + 23 kg Checked',
    co2Reduction: '-18% CO₂',
    co2Eco: true,
    isPopular: true,
    providersCount: 12,
    primaryProvider: 'British Airways Direct',
    amenities: { wifi: true, meal: true, seatPitch: '31 in', power: true, entertainment: true },
  },
  {
    id: 'sky-norse-n01',
    airline: 'Norse Atlantic',
    flightNo: 'N0-701',
    badgeCode: 'N0',
    badgeBg: 'bg-sky-600',
    aircraft: 'Boeing 787-9 Dreamliner',
    depTime: '13:10',
    depTerminal: 'Terminal 3',
    duration: '8h 15m',
    durationMins: 495,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '16:25',
    arrTerminal: 'Terminal 1',
    priceInr: 26800,
    rating: 4.5,
    tags: ['Best Fare', 'Lowest Direct Price'],
    baggage: '7 kg Underseat Carry-on',
    isBestFare: true,
    providersCount: 9,
    primaryProvider: 'Norse Airways',
    amenities: { wifi: false, meal: false, seatPitch: '31 in', power: true, entertainment: true },
  },
  {
    id: 'sky-virgin-vs25',
    airline: 'Virgin Atlantic',
    flightNo: 'VS-25',
    badgeCode: 'VS',
    badgeBg: 'bg-red-700',
    aircraft: 'Airbus A350-1000',
    depTime: '10:45',
    depTerminal: 'Terminal 3',
    duration: '7h 55m',
    durationMins: 475,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '13:40',
    arrTerminal: 'Terminal 4',
    priceInr: 34700,
    rating: 4.9,
    tags: ['Fastest Route', 'Includes carry-on'],
    baggage: '10 kg Cabin + 23 kg Checked',
    co2Reduction: '-12% CO₂',
    co2Eco: true,
    isFastest: true,
    providersCount: 8,
    primaryProvider: 'Virgin Atlantic',
    amenities: { wifi: true, meal: true, seatPitch: '32 in', power: true, entertainment: true },
  },
  {
    id: 'sky-delta-dl47',
    airline: 'Delta Air Lines',
    flightNo: 'DL-47',
    badgeCode: 'DL',
    badgeBg: 'bg-blue-800',
    aircraft: 'Airbus A330-900neo',
    depTime: '06:15',
    depTerminal: 'Terminal 4',
    duration: '10h 30m',
    durationMins: 630,
    stops: '1 stop (AMS)',
    stopsCount: 1,
    stopAirport: 'Amsterdam (AMS) · 1h 20m layover',
    arrTime: '11:45',
    arrTerminal: 'Terminal 4',
    priceInr: 29150,
    rating: 4.6,
    tags: ['Baggage included', 'Free Messaging Wifi'],
    baggage: '7 kg Cabin + 23 kg Checked',
    providersCount: 18,
    primaryProvider: 'Expedia',
    amenities: { wifi: true, meal: true, seatPitch: '31 in', power: true, entertainment: true },
  },
  {
    id: 'sky-akasa-qp1382',
    airline: 'Akasa Air',
    flightNo: 'QP-1382',
    badgeCode: 'QP',
    badgeBg: 'bg-orange-500',
    aircraft: 'Boeing 737 MAX 8',
    depTime: '06:10',
    depTerminal: 'Terminal 1',
    duration: '2h 15m',
    durationMins: 135,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '08:25',
    arrTerminal: 'Terminal 2',
    priceInr: 3299,
    rating: 4.7,
    tags: ['Cheapest Deal', 'Super Saver'],
    baggage: '7 kg Cabin + 15 kg Checked',
    co2Reduction: '-15% CO₂',
    co2Eco: true,
    isBestFare: true,
    providersCount: 14,
    primaryProvider: 'TripYeah Direct',
    amenities: { wifi: false, meal: false, seatPitch: '30 in', power: true, entertainment: false },
  },
  {
    id: 'sky-indigo-6e2134',
    airline: 'IndiGo',
    flightNo: '6E-2134',
    badgeCode: '6E',
    badgeBg: 'bg-blue-600',
    aircraft: 'Airbus A321neo',
    depTime: '09:20',
    depTerminal: 'Terminal 1D',
    duration: '2h 20m',
    durationMins: 140,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '11:40',
    arrTerminal: 'Terminal 1',
    priceInr: 3850,
    rating: 4.8,
    tags: ['Popular choice', 'On-Time Punctuality 94%'],
    baggage: '7 kg Cabin + 15 kg Checked',
    co2Reduction: '-18% CO₂',
    co2Eco: true,
    isPopular: true,
    providersCount: 16,
    primaryProvider: 'IndiGo Official',
    amenities: { wifi: false, meal: true, seatPitch: '30 in', power: true, entertainment: false },
  },
  {
    id: 'sky-airindia-ai883',
    airline: 'Air India',
    flightNo: 'AI-883',
    badgeCode: 'AI',
    badgeBg: 'bg-red-600',
    aircraft: 'Airbus A320neo',
    depTime: '11:30',
    depTerminal: 'Terminal 3',
    duration: '2h 10m',
    durationMins: 130,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '13:40',
    arrTerminal: 'Terminal 2',
    priceInr: 4120,
    rating: 4.6,
    tags: ['Hot Meal Included', 'Free Baggage 15kg'],
    baggage: '7 kg Cabin + 15 kg Checked',
    isFastest: true,
    providersCount: 11,
    primaryProvider: 'MakeMyTrip',
    amenities: { wifi: false, meal: true, seatPitch: '32 in', power: true, entertainment: true },
  },
  {
    id: 'sky-vistara-uk995',
    airline: 'Vistara',
    flightNo: 'UK-995',
    badgeCode: 'UK',
    badgeBg: 'bg-purple-800',
    aircraft: 'Airbus A321neo',
    depTime: '14:30',
    depTerminal: 'Terminal 3',
    duration: '2h 15m',
    durationMins: 135,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '16:45',
    arrTerminal: 'Terminal 2',
    priceInr: 4650,
    rating: 4.9,
    tags: ['Full-Service Luxury', 'Complimentary Dining'],
    baggage: '7 kg Cabin + 15 kg Checked',
    co2Reduction: '-10% CO₂',
    co2Eco: true,
    providersCount: 10,
    primaryProvider: 'Vistara Direct',
    amenities: { wifi: true, meal: true, seatPitch: '32 in', power: true, entertainment: true },
  },
  {
    id: 'sky-spicejet-sg8169',
    airline: 'SpiceJet',
    flightNo: 'SG-8169',
    badgeCode: 'SG',
    badgeBg: 'bg-red-500',
    aircraft: 'Boeing 737-800',
    depTime: '18:15',
    depTerminal: 'Terminal 1B',
    duration: '2h 30m',
    durationMins: 150,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '20:45',
    arrTerminal: 'Terminal 1',
    priceInr: 3499,
    rating: 4.3,
    tags: ['Evening Flight', 'Budget Friendly'],
    baggage: '7 kg Cabin + 15 kg Checked',
    providersCount: 8,
    primaryProvider: 'EaseMyTrip',
    amenities: { wifi: false, meal: false, seatPitch: '29 in', power: false, entertainment: false },
  },
  {
    id: 'sky-lufthansa-lh400',
    airline: 'Lufthansa',
    flightNo: 'LH-400',
    badgeCode: 'LH',
    badgeBg: 'bg-amber-600',
    aircraft: 'Boeing 747-8 Intercontinental',
    depTime: '13:45',
    depTerminal: 'Terminal 2',
    duration: '11h 10m',
    durationMins: 670,
    stops: '1 stop (FRA)',
    stopsCount: 1,
    stopAirport: 'Frankfurt (FRA) · 1h 45m layover',
    arrTime: '19:55',
    arrTerminal: 'Terminal 1',
    priceInr: 39100,
    rating: 4.7,
    tags: ['Star Alliance', 'German Precision'],
    baggage: '8 kg Cabin + 23 kg Checked',
    providersCount: 15,
    primaryProvider: 'Lufthansa Official',
    amenities: { wifi: true, meal: true, seatPitch: '31 in', power: true, entertainment: true },
  },
];

// Return flights catalog for round-trip pairing
const SKY_RETURN_FLIGHT_CATALOG: SkyscannerFlight[] = [
  {
    id: 'ret-ba-179',
    airline: 'British Airways',
    flightNo: 'BA-179',
    badgeCode: 'BA',
    badgeBg: 'bg-blue-900',
    aircraft: 'Boeing 777-300ER',
    depTime: '18:20',
    depTerminal: 'Terminal 7',
    duration: '7h 05m',
    durationMins: 425,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '06:25',
    arrTerminal: 'Terminal 5',
    daysLater: 1,
    priceInr: 33100,
    rating: 4.8,
    tags: ['Overnight Return', 'Popular choice'],
    baggage: '7 kg Cabin + 23 kg Checked',
    providersCount: 12,
    primaryProvider: 'British Airways Direct',
    amenities: { wifi: true, meal: true, seatPitch: '31 in', power: true, entertainment: true },
  },
  {
    id: 'ret-norse-n02',
    airline: 'Norse Atlantic',
    flightNo: 'N0-702',
    badgeCode: 'N0',
    badgeBg: 'bg-sky-600',
    aircraft: 'Boeing 787-9 Dreamliner',
    depTime: '18:00',
    depTerminal: 'Terminal 1',
    duration: '7h 40m',
    durationMins: 460,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '06:40',
    arrTerminal: 'Terminal 3',
    daysLater: 1,
    priceInr: 27200,
    rating: 4.5,
    tags: ['Best Return Fare'],
    baggage: '7 kg Underseat Carry-on',
    providersCount: 9,
    primaryProvider: 'Trip.com & 4 others',
    amenities: { wifi: false, meal: false, seatPitch: '31 in', power: true, entertainment: true },
  },
  {
    id: 'ret-virgin-vs26',
    airline: 'Virgin Atlantic',
    flightNo: 'VS-26',
    badgeCode: 'VS',
    badgeBg: 'bg-red-700',
    aircraft: 'Airbus A350-1000',
    depTime: '21:30',
    depTerminal: 'Terminal 4',
    duration: '6h 55m',
    durationMins: 415,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '09:25',
    arrTerminal: 'Terminal 3',
    daysLater: 1,
    priceInr: 35100,
    rating: 4.9,
    tags: ['Fastest Return', 'Overnight Flight'],
    baggage: '10 kg Cabin + 23 kg Checked',
    providersCount: 8,
    primaryProvider: 'Virgin Atlantic',
    amenities: { wifi: true, meal: true, seatPitch: '32 in', power: true, entertainment: true },
  },
  {
    id: 'ret-delta-dl48',
    airline: 'Delta Air Lines',
    flightNo: 'DL-48',
    badgeCode: 'DL',
    badgeBg: 'bg-blue-800',
    aircraft: 'Airbus A330-900neo',
    depTime: '16:45',
    depTerminal: 'Terminal 4',
    duration: '11h 10m',
    durationMins: 670,
    stops: '1 stop (AMS)',
    stopsCount: 1,
    stopAirport: 'Amsterdam (AMS) · 1h 30m layover',
    arrTime: '08:55',
    arrTerminal: 'Terminal 4',
    daysLater: 1,
    priceInr: 30400,
    rating: 4.6,
    tags: ['Baggage included'],
    baggage: '7 kg Cabin + 23 kg Checked',
    providersCount: 18,
    primaryProvider: 'Expedia',
    amenities: { wifi: true, meal: true, seatPitch: '31 in', power: true, entertainment: true },
  },
  {
    id: 'ret-indigo-6e2135',
    airline: 'IndiGo',
    flightNo: '6E-2135',
    badgeCode: '6E',
    badgeBg: 'bg-blue-600',
    aircraft: 'Airbus A321neo',
    depTime: '16:30',
    depTerminal: 'Terminal 1',
    duration: '2h 20m',
    durationMins: 140,
    stops: 'Direct',
    stopsCount: 0,
    arrTime: '18:50',
    arrTerminal: 'Terminal 1D',
    priceInr: 3950,
    rating: 4.8,
    tags: ['Punctual Return', 'Express Exit'],
    baggage: '7 kg Cabin + 15 kg Checked',
    providersCount: 16,
    primaryProvider: 'IndiGo Official',
    amenities: { wifi: false, meal: true, seatPitch: '30 in', power: true, entertainment: false },
  },
];

const STOP_CITY_LABELS: Record<string, string> = {
  BOM: 'Mumbai (BOM)',
  DEL: 'Delhi (DEL)',
  BLR: 'Bengaluru (BLR)',
  HYD: 'Hyderabad (HYD)',
  MAA: 'Chennai (MAA)',
  CCU: 'Kolkata (CCU)',
  AMD: 'Ahmedabad (AMD)',
  AMS: 'Amsterdam (AMS)',
  FRA: 'Frankfurt (FRA)',
  DXB: 'Dubai (DXB)',
  DOH: 'Doha (DOH)',
  SIN: 'Singapore (SIN)',
  LHR: 'London (LHR)',
  CDG: 'Paris (CDG)',
};

const getReadableStopLabel = (fl: SkyscannerFlight): string => {
  const isDirect = fl.stopsCount === 0 && fl.stops === 'Direct';
  if (isDirect) return 'Direct';

  const rawHub = fl.stopAirport ? fl.stopAirport.split(' · ')[0].trim() : '';
  const fromStopsMatch = fl.stops.match(/\(([^)]+)\)/);
  const candidate = rawHub || (fromStopsMatch ? fromStopsMatch[1].trim() : '');
  const readableHub = STOP_CITY_LABELS[candidate.toUpperCase()] || candidate;
  const countPrefix = fl.stopsCount >= 2 ? `${fl.stopsCount} stops` : '1 stop';

  return readableHub ? `${countPrefix} · ${readableHub}` : fl.stops;
};

export const SkyscannerFlightSearchResults: React.FC<SkyscannerFlightSearchResultsProps> = ({
  fromCity,
  toCity,
  departureDate,
  returnDate = '2026-10-22',
  tripType = 'one-way',
  dummyTripType = 'one-way',
  travellers = 1,
  cabinClass = 'Economy',
  currency,
  onSelectFlightOrStayForCheckout,
  onChangeDepartureDate,
  onChangeReturnDate,
  onChangeFromCity,
  onChangeToCity,
  onChangeTravellers,
  onChangeTripType,
  onChangeDummyTripType,
  onNotify,
  currentCategory,
  onChangeCategory,
}) => {
  // Draft Second-Header State (changes only inside header until Search is clicked)
  const [draftTripType, setDraftTripType] = useState<TripType>(tripType || 'one-way');
  const [draftFromCity, setDraftFromCity] = useState<CityOption>(fromCity);
  const [draftToCity, setDraftToCity] = useState<CityOption>(toCity);
  const [draftDepDate, setDraftDepDate] = useState<string>(departureDate || '2026-10-15');
  const [draftRetDate, setDraftRetDate] = useState<string>(returnDate || '2026-10-19');
  const [draftTravellers, setDraftTravellers] = useState<number>(travellers);
  const [draftCabinClass, setDraftCabinClass] = useState<string>(cabinClass);
  const [draftDirectOnly, setDraftDirectOnly] = useState<boolean>(false);

  // Applied Search State (drives everything below the second header)
  const [appliedTripType, setAppliedTripType] = useState<TripType>(tripType || 'one-way');
  const [appliedFromCity, setAppliedFromCity] = useState<CityOption>(fromCity);
  const [appliedToCity, setAppliedToCity] = useState<CityOption>(toCity);
  const [appliedDepDate, setAppliedDepDate] = useState<string>(departureDate || '2026-10-15');
  const [appliedRetDate, setAppliedRetDate] = useState<string>(returnDate || '2026-10-19');
  const [appliedTravellers, setAppliedTravellers] = useState<number>(travellers);
  const [appliedCabinClass, setAppliedCabinClass] = useState<string>(cabinClass);
  const [appliedDirectOnly, setAppliedDirectOnly] = useState<boolean>(false);

  const isDraftRoundTrip = draftTripType === 'round-trip';
  const isAppliedRoundTrip = appliedTripType === 'round-trip';

  // Sync only when external props change (e.g. navigating from Home page search)
  useEffect(() => {
    if (departureDate) {
      setDraftDepDate(departureDate);
      setAppliedDepDate(departureDate);
    }
  }, [departureDate]);

  useEffect(() => {
    if (returnDate) {
      setDraftRetDate(returnDate);
      setAppliedRetDate(returnDate);
    }
  }, [returnDate]);

  useEffect(() => {
    if (tripType) {
      setDraftTripType(tripType);
      setAppliedTripType(tripType);
    }
  }, [tripType]);

  useEffect(() => {
    setDraftFromCity(fromCity);
    setAppliedFromCity(fromCity);
  }, [fromCity.code, fromCity.city, fromCity.isCountry]);

  useEffect(() => {
    setDraftToCity(toCity);
    setAppliedToCity(toCity);
  }, [toCity.code, toCity.city, toCity.isCountry]);

  useEffect(() => {
    setDraftTravellers(travellers);
    setAppliedTravellers(travellers);
  }, [travellers]);

  useEffect(() => {
    setDraftCabinClass(cabinClass);
    setAppliedCabinClass(cabinClass);
  }, [cabinClass]);

  // Interactive Filter States matching Skyscanner (Sidebar)
  const [selectedStops, setSelectedStops] = useState<string[]>(['direct', '1-stop']);
  const [selectedDepTimes, setSelectedDepTimes] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([
    'British Airways',
    'Virgin Atlantic',
    'Delta Air Lines',
    'Norse Atlantic',
    'Emirates',
    'Lufthansa',
    'IndiGo',
    'Air India',
    'Vistara',
    'Akasa Air',
    'SpiceJet',
  ]);
  const [greenerOnly, setGreenerOnly] = useState<boolean>(false);
  const [selectedBaggage, setSelectedBaggage] = useState<string[]>([]);
  const [priceAlertsActive, setPriceAlertsActive] = useState<boolean>(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'best' | 'cheapest' | 'fastest' | 'departure'>('cheapest');
  const [openSortDropdown, setOpenSortDropdown] = useState<boolean>(false);

  // Search Bar Expanders / Dropdowns
  const [openCityPicker, setOpenCityPicker] = useState<'from' | 'to' | null>(null);
  const [openCalendarDropdown, setOpenCalendarDropdown] = useState<'departure' | 'return' | null>(null);
  const [openTravellersDropdown, setOpenTravellersDropdown] = useState<boolean>(false);

  // Pagination / Load More
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Aviationstack Live Flights API Integration
  const [liveFlights, setLiveFlights] = useState<SkyscannerFlight[] | null>(null);
  const [liveReturnFlights, setLiveReturnFlights] = useState<SkyscannerFlight[] | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [isReturnLoading, setIsReturnLoading] = useState<boolean>(false);
  const [liveApiSource, setLiveApiSource] = useState<'aviationstack' | 'verified_schedule' | null>(null);
  const [hasAviationstackKey, setHasAviationstackKey] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Just now');

  const fetchLiveFlightsData = async (
    depOverride?: string,
    arrOverride?: string,
    dateOverride?: string
  ) => {
    setIsLiveLoading(true);
    const startedAt = Date.now();
    try {
      const depCode = depOverride || appliedFromCity.code || 'DEL';
      const arrCode = arrOverride || appliedToCity.code || 'BOM';
      const flightDate = dateOverride || appliedDepDate;
      const res = await fetch(
        `/api/flights/live?dep_iata=${encodeURIComponent(depCode)}&arr_iata=${encodeURIComponent(arrCode)}&flight_date=${encodeURIComponent(flightDate)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.flights) && data.flights.length > 0) {
          setLiveFlights(data.flights);
          setLiveApiSource(data.source);
          setHasAviationstackKey(data.hasApiKey);
          setLastRefreshedAt(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }
      }
      const elapsed = Date.now() - startedAt;
      if (elapsed < 700) {
        await new Promise((resolve) => setTimeout(resolve, 700 - elapsed));
      }
    } catch (err) {
      console.warn('Live flights API request error:', err);
    } finally {
      setIsLiveLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveFlightsData(appliedFromCity.code, appliedToCity.code, appliedDepDate);
  }, [appliedFromCity.code, appliedToCity.code, appliedDepDate]);

  // Round-Trip Return Flight Live Fetch (reacts immediately to applied return date / route changes)
  useEffect(() => {
    if (!isAppliedRoundTrip) {
      setIsReturnLoading(false);
      return;
    }
    let isCancelled = false;
    const fetchReturnData = async () => {
      setIsReturnLoading(true);
      const startedAt = Date.now();
      try {
        const depCode = appliedToCity.code || 'BOM';
        const arrCode = appliedFromCity.code || 'DEL';
        const res = await fetch(
          `/api/flights/live?dep_iata=${encodeURIComponent(depCode)}&arr_iata=${encodeURIComponent(arrCode)}&flight_date=${encodeURIComponent(appliedRetDate)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data && Array.isArray(data.flights) && data.flights.length > 0) {
            setLiveReturnFlights(data.flights);
          }
        }
        const elapsed = Date.now() - startedAt;
        if (!isCancelled && elapsed < 220) {
          await new Promise((resolve) => setTimeout(resolve, 220 - elapsed));
        }
      } catch (err) {
        console.warn('Return flights API fetch note:', err);
      } finally {
        if (!isCancelled) {
          setIsReturnLoading(false);
        }
      }
    };
    fetchReturnData();
    return () => {
      isCancelled = true;
    };
  }, [isAppliedRoundTrip, appliedFromCity.code, appliedToCity.code, appliedRetDate]);

  // Pure UTC-based timezone-safe date shift (±1 day or arbitrary delta)
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

      if (minDateStr && resultStr < minDateStr) {
        return minDateStr;
      }
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
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const handlePrevDeparture = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newD = shiftDate(draftDepDate, -1);
    setDraftDepDate(newD);
    setAppliedDepDate(newD);
    onChangeDepartureDate?.(newD);
  };

  const handleNextDeparture = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newD = shiftDate(draftDepDate, 1);
    setDraftDepDate(newD);
    setAppliedDepDate(newD);
    onChangeDepartureDate?.(newD);
    if (isDraftRoundTrip && draftRetDate < newD) {
      const newR = shiftDate(newD, 3);
      setDraftRetDate(newR);
      if (isAppliedRoundTrip) {
        setAppliedRetDate(newR);
        onChangeReturnDate?.(newR);
      }
    }
  };

  const handlePrevReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetBase = draftRetDate || shiftDate(draftDepDate, 4);
    const newR = shiftDate(targetBase, -1, draftDepDate);
    setDraftRetDate(newR);
    if (isAppliedRoundTrip) {
      setAppliedRetDate(newR);
      onChangeReturnDate?.(newR);
    }
  };

  const handleNextReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetBase = draftRetDate || shiftDate(draftDepDate, 4);
    const newR = shiftDate(targetBase, 1);
    setDraftRetDate(newR);
    if (isAppliedRoundTrip) {
      setAppliedRetDate(newR);
      onChangeReturnDate?.(newR);
    }
  };

  // Filtered & Sorted Flights (uses applied search state only)
  const filteredFlights = useMemo(() => {
    const activeFlightPool = liveFlights && liveFlights.length > 0 ? liveFlights : SKY_FLIGHT_CATALOG;
    let list = activeFlightPool.filter((fl) => {
      // Direct only toggle (applied only after clicking Search)
      if (appliedDirectOnly && fl.stops !== 'Direct') return false;

      // Stops filter
      if (selectedStops.length > 0) {
        const isDir = fl.stops === 'Direct';
        const isOne = fl.stops.includes('1 stop');
        const isTwo = fl.stopsCount >= 2;
        const matchDir = selectedStops.includes('direct') && isDir;
        const matchOne = selectedStops.includes('1-stop') && isOne;
        const matchTwo = selectedStops.includes('2-stops') && isTwo;
        if (!matchDir && !matchOne && !matchTwo) return false;
      }

      // Airlines filter (only filter airlines present in sidebar list, or all if user unchecks)
      const sidebarAirlines = ['British Airways', 'Virgin Atlantic', 'Delta Air Lines', 'Norse Atlantic', 'Emirates', 'Lufthansa', 'IndiGo', 'Air India', 'Vistara', 'Akasa Air', 'SpiceJet'];
      if (selectedAirlines.length === 0) {
        return false;
      }
      if (sidebarAirlines.includes(fl.airline) && !selectedAirlines.includes(fl.airline)) {
        return false;
      }

      // Greener flights
      if (greenerOnly && !fl.co2Eco) {
        return false;
      }

      // Baggage filter
      if (selectedBaggage.length > 0) {
        const bagText = (fl.baggage || '').toLowerCase();
        const hasCabin = bagText.includes('cabin') || bagText.includes('carry-on');
        const hasChecked = bagText.includes('checked') || bagText.includes('15 kg') || bagText.includes('23 kg');
        if (selectedBaggage.includes('cabin') && !hasCabin) return false;
        if (selectedBaggage.includes('checked') && !hasChecked) return false;
      }

      // Departure times
      if (selectedDepTimes.length > 0) {
        const hour = parseInt(fl.depTime.split(':')[0], 10);
        const isMorning = hour >= 6 && hour < 12;
        const isAfternoon = hour >= 12 && hour < 18;
        const isEvening = hour >= 18 || hour < 6;
        const matchMorn = selectedDepTimes.includes('morning') && isMorning;
        const matchAft = selectedDepTimes.includes('afternoon') && isAfternoon;
        const matchEve = selectedDepTimes.includes('evening') && isEvening;
        if (!matchMorn && !matchAft && !matchEve) return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (sortBy === 'fastest') return a.durationMins - b.durationMins;
      if (sortBy === 'departure') return a.depTime.localeCompare(b.depTime);
      // 'best' - balance between rating, direct flight, and price
      if (sortBy === 'best') {
        const scoreA = (a.stopsCount === 0 ? 1000 : 0) + a.rating * 100 - a.priceInr / 50;
        const scoreB = (b.stopsCount === 0 ? 1000 : 0) + b.rating * 100 - b.priceInr / 50;
        return scoreB - scoreA;
      }
      return a.priceInr - b.priceInr;
    });
  }, [liveFlights, appliedDirectOnly, selectedStops, selectedAirlines, greenerOnly, selectedBaggage, selectedDepTimes, sortBy]);

  // Handlers
  const handleResetFilters = () => {
    setDraftDirectOnly(false);
    setAppliedDirectOnly(false);
    setSelectedStops(['direct', '1-stop']);
    setSelectedDepTimes([]);
    setSelectedBaggage([]);
    setSelectedAirlines([
      'British Airways',
      'Virgin Atlantic',
      'Delta Air Lines',
      'Norse Atlantic',
      'Emirates',
      'Lufthansa',
      'IndiGo',
      'Air India',
      'Vistara',
      'Akasa Air',
      'SpiceJet',
    ]);
    setGreenerOnly(false);
    onNotify('Filters Reset', 'All airline and timing filters have been restored.', 'info');
  };

  const handleSwapCities = () => {
    const nextFrom = draftToCity;
    const nextTo = draftFromCity;
    setDraftFromCity(nextFrom);
    setDraftToCity(nextTo);
  };

  const getCabinMultiplier = (cabin: string): number => {
    switch (cabin) {
      case 'Premium Eco':
        return 1.45;
      case 'Business':
        return 2.4;
      case 'First Class':
        return 3.5;
      default:
        return 1;
    }
  };

  const hasPendingHeaderChange =
    hasCityOptionChanged(draftFromCity, appliedFromCity) ||
    hasCityOptionChanged(draftToCity, appliedToCity) ||
    draftTravellers !== appliedTravellers ||
    draftCabinClass !== appliedCabinClass ||
    draftTripType !== appliedTripType;

  const handleApplyTravellerSearch = () => {
    setOpenTravellersDropdown(false);
    setOpenCityPicker(null);
    setOpenCalendarDropdown(null);

    const fromChanged = hasCityOptionChanged(draftFromCity, appliedFromCity);
    const toChanged = hasCityOptionChanged(draftToCity, appliedToCity);

    setAppliedTripType(draftTripType);
    setAppliedFromCity(draftFromCity);
    setAppliedToCity(draftToCity);
    setAppliedDepDate(draftDepDate);
    setAppliedRetDate(draftRetDate);
    setAppliedTravellers(draftTravellers);
    setAppliedCabinClass(draftCabinClass);
    setAppliedDirectOnly(draftDirectOnly);

    if (fromChanged) {
      onChangeFromCity?.(draftFromCity);
    }
    if (toChanged) {
      onChangeToCity?.(draftToCity);
    }
    onChangeTripType?.(draftTripType);
    onChangeReturnDate?.(draftRetDate);
    onChangeTravellers?.(draftTravellers, draftCabinClass);
    if (!draftFromCity.isCountry && !draftToCity.isCountry) {
      fetchLiveFlightsData(draftFromCity.code, draftToCity.code, draftDepDate);
    }
  };

  const handleSelectFlight = (flight: SkyscannerFlight, returnFlight?: SkyscannerFlight) => {
    const cabinMult = getCabinMultiplier(appliedCabinClass);
    const baseFare = returnFlight
      ? flight.priceInr + returnFlight.priceInr
      : flight.priceInr;
    const totalFare = Math.round(baseFare * cabinMult) * appliedTravellers;

    const itemTitle = returnFlight
      ? `${flight.airline} (${flight.flightNo}) + ${returnFlight.airline} (${returnFlight.flightNo})`
      : `${flight.airline} ${flight.flightNo}`;

    onSelectFlightOrStayForCheckout({
      title: itemTitle,
      code: returnFlight ? `${flight.id}-${returnFlight.id}` : flight.id,
      depTime: returnFlight ? `${flight.depTime} (Out) / ${returnFlight.depTime} (Ret)` : flight.depTime,
      arrTime: returnFlight ? `${flight.arrTime} / ${returnFlight.arrTime}` : flight.arrTime,
      duration: returnFlight ? `Out: ${flight.duration} · Ret: ${returnFlight.duration}` : flight.duration,
      priceInr: totalFare,
      category: 'flights',
      airline: returnFlight ? `${flight.airline} + ${returnFlight.airline}` : flight.airline,
      flightNo: returnFlight ? `${flight.flightNo} + ${returnFlight.flightNo}` : flight.flightNo,
      cabinClass: appliedCabinClass || 'Economy',
      fromCity: `${appliedFromCity.city} (${appliedFromCity.code})`,
      toCity: `${appliedToCity.city} (${appliedToCity.code})`,
      travelDate: appliedDepDate,
      returnDate: isAppliedRoundTrip ? appliedRetDate : undefined,
      travellers: appliedTravellers,
      isRoundTrip: isAppliedRoundTrip,
      outboundFlight: flight,
      returnFlight: returnFlight,
    });
  };

  // Best / Cheapest / Fastest values for top summary tabs
  const summaryMetrics = useMemo(() => {
    const cabinMult = getCabinMultiplier(appliedCabinClass);
    const scaleFare = (baseInr: number) => Math.round(baseInr * cabinMult) * appliedTravellers;

    if (filteredFlights.length === 0) {
      return {
        best: { price: scaleFare(3850), duration: '2h 15m avg' },
        cheapest: { price: scaleFare(3299), duration: '2h 20m avg' },
        fastest: { price: scaleFare(4120), duration: '2h 10m avg' },
      };
    }
    const cheapestFlight = [...filteredFlights].sort((a, b) => a.priceInr - b.priceInr)[0];
    const fastestFlight = [...filteredFlights].sort((a, b) => a.durationMins - b.durationMins)[0];
    const bestFlight = filteredFlights.find((f) => f.isPopular) || filteredFlights[0];

    return {
      best: { price: scaleFare(bestFlight.priceInr), duration: bestFlight.duration },
      cheapest: { price: scaleFare(cheapestFlight.priceInr), duration: cheapestFlight.duration },
      fastest: { price: scaleFare(fastestFlight.priceInr), duration: fastestFlight.duration },
    };
  }, [filteredFlights, appliedCabinClass, appliedTravellers]);

  return (
    <div className="bg-[#f1f5f9] min-h-screen text-slate-800 pb-20 font-sans">
      {/* ===================================================================
          1. SEAMLESS OCEAN-NAVY FLIGHT SEARCH HEADER
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
                    if (!draftRetDate || draftRetDate <= draftDepDate) {
                      const nextRet = shiftDate(draftDepDate, 4);
                      setDraftRetDate(nextRet);
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
                          className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center tabular-nums">{draftTravellers}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextCount = Math.min(9, draftTravellers + 1);
                            setDraftTravellers(nextCount);
                          }}
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
                onClick={handleApplyTravellerSearch}
                title="Search flights with selected trip type, travelers & cabin class"
                aria-label="Search flights"
                className={`w-[34px] h-[34px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 ${
                  hasPendingHeaderChange
                    ? 'bg-white text-[#05203c] shadow-md ring-2 ring-sky-300/80 hover:bg-blue-50 scale-105'
                    : 'bg-white hover:bg-blue-50 text-[#05203c] shadow-xs border border-white/80'
                }`}
              >
                <Search className={`w-3.5 h-3.5 stroke-[2.25] ${isLiveLoading ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            {/* Direct Flights Only Checkbox */}
            <label className="flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white cursor-pointer select-none whitespace-nowrap shrink-0">
              <input
                type="checkbox"
                checked={draftDirectOnly}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setDraftDirectOnly(checked);
                  setAppliedDirectOnly(checked);
                }}
                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400 accent-blue-500 cursor-pointer"
              />
              <span>Direct flights only</span>
            </label>
          </div>

          {/* Single Unified Greyish-Blue Search Box (Only Arrow Buttons Have Boxes) */}
          <div className="rounded-2xl p-1.5 bg-[#cfdce9] border border-white/30 shadow-lg">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Route: FROM & TO with Swap button */}
              <div className="flex flex-col sm:flex-row items-stretch relative lg:flex-[2] min-w-0">
                {/* FROM */}
                <div className="relative flex-1 min-w-0">
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setOpenCalendarDropdown(null);
                      setOpenTravellersDropdown(false);
                      setOpenCityPicker(openCityPicker === 'from' ? null : 'from');
                    }}
                    className="px-4 py-2 rounded-xl hover:bg-white/35 cursor-pointer transition-colors h-[56px] flex flex-col justify-center"
                  >
                    <div className="text-[11px] font-semibold text-slate-600 leading-none">From</div>
                    <div className="flex items-baseline gap-1.5 mt-1 truncate">
                      <span className="font-bold text-slate-900 text-sm sm:text-[15px] truncate">{draftFromCity.city}</span>
                      <span className="font-bold text-xs font-mono text-slate-600 shrink-0">{getDisplayLocationCode(draftFromCity)}</span>
                    </div>
                  </div>

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

                {/* Swap Button (no divider line behind it) */}
                <div className="shrink-0 flex items-center justify-center sm:-mx-3.5 z-10 my-0.5 sm:my-0">
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    title="Swap From and To"
                    aria-label="Swap From and To cities"
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-slate-300/80 text-slate-700 hover:text-blue-700 flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* TO */}
                <div className="relative flex-1 min-w-0">
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setOpenCalendarDropdown(null);
                      setOpenTravellersDropdown(false);
                      setOpenCityPicker(openCityPicker === 'to' ? null : 'to');
                    }}
                    className="px-4 py-2 rounded-xl hover:bg-white/35 cursor-pointer transition-colors h-[56px] flex flex-col justify-center sm:pl-6"
                  >
                    <div className="text-[11px] font-semibold text-slate-600 leading-none">To</div>
                    <div className="flex items-baseline gap-1.5 mt-1 truncate">
                      <span className="font-bold text-slate-900 text-sm sm:text-[15px] truncate">{draftToCity.city}</span>
                      <span className="font-bold text-xs font-mono text-slate-600 shrink-0">{getDisplayLocationCode(draftToCity)}</span>
                    </div>
                  </div>

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

              {/* Dates: Departure (+ Return in Round Trip) — equal 1:1 width with From and To */}
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
                      onClick={handlePrevDeparture}
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
                        setOpenCalendarDropdown(openCalendarDropdown === 'departure' ? null : 'departure');
                      }}
                      className="flex-1 min-w-0 h-full px-2 rounded-xl hover:bg-white/35 transition-colors cursor-pointer select-none flex items-center justify-center gap-2 text-slate-900 hover:text-[#072a4f]"
                      title="Click to open calendar"
                    >
                      <Calendar className="w-4 h-4 text-[#072a4f] shrink-0" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 tabular-nums whitespace-nowrap truncate">
                        {formatDisplayDate(draftDepDate)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextDeparture}
                      title="Next Day"
                      aria-label="Next departure day"
                      className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl border border-slate-300/75 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-[#072a4f] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {openCalendarDropdown === 'departure' && (
                    <NormalCalendarDropdown
                      selectedDate={draftDepDate}
                      minDate="2026-01-01"
                      onSelectDate={(newDate) => {
                        setDraftDepDate(newDate);
                        setAppliedDepDate(newDate);
                        onChangeDepartureDate?.(newDate);
                        if (isDraftRoundTrip && draftRetDate < newDate) {
                          const nextRet = shiftDate(newDate, 3);
                          setDraftRetDate(nextRet);
                          if (isAppliedRoundTrip) {
                            setAppliedRetDate(nextRet);
                            onChangeReturnDate?.(nextRet);
                          }
                        }
                        setOpenCalendarDropdown(null);
                      }}
                      onClose={() => setOpenCalendarDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* Return Date (shown in Round Trip mode) */}
                {isDraftRoundTrip && (
                  <>
                    <div className="h-px sm:h-auto sm:w-px bg-slate-400/45 mx-2 my-1 sm:my-2 sm:mx-1 shrink-0" />
                    <div className="relative flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 h-[56px] px-1">
                        <button
                          type="button"
                          onClick={handlePrevReturn}
                          title="Previous Day"
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
                            setOpenCalendarDropdown(openCalendarDropdown === 'return' ? null : 'return');
                          }}
                          className="flex-1 min-w-0 h-full px-2 rounded-xl hover:bg-white/35 transition-colors cursor-pointer select-none flex items-center justify-center gap-2 text-slate-900 hover:text-[#072a4f]"
                          title="Click to open calendar"
                        >
                          <Calendar className="w-4 h-4 text-[#072a4f] shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-slate-900 tabular-nums whitespace-nowrap truncate">
                            {formatDisplayDate(draftRetDate)}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleNextReturn}
                          title="Next Day"
                          aria-label="Next return day"
                          className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl border border-slate-300/75 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-[#072a4f] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {openCalendarDropdown === 'return' && (
                        <NormalCalendarDropdown
                          selectedDate={draftRetDate}
                          minDate={draftDepDate}
                          onSelectDate={(newDate) => {
                            setDraftRetDate(newDate);
                            if (isAppliedRoundTrip) {
                              setAppliedRetDate(newDate);
                              onChangeReturnDate?.(newDate);
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
          2. TWO-COLUMN CONTENT AREA (Sidebar Filters + Skyscanner Results)
      =================================================================== */}
      <main className="w-full px-3 sm:px-5 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ===============================================================
              LEFT COLUMN: FILTERS SIDEBAR (OPEN ON GREY PAGE - NO BOX)
          =============================================================== */}
          <aside className="lg:col-span-3 space-y-5">
            {/* Price Alerts Card */}
            <div className="rounded-2xl border border-slate-200/90 p-4 space-y-2.5 bg-white shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Get Price Alerts</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priceAlertsActive}
                    onChange={(e) => {
                      setPriceAlertsActive(e.target.checked);
                      if (e.target.checked) {
                        onNotify('Price Alert Active', `We will notify you when fares drop for ${appliedFromCity.code} → ${appliedToCity.code}`, 'success');
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-xs text-slate-600 leading-snug">Instant updates when fares change.</p>
              <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Prices are {formatPrice(450, currency)} lower than usual</span>
              </div>
            </div>

            {/* Sidebar Controls (Cleanly on grey background, no "Filters" heading or box) */}
            <div className="space-y-5 px-1">
              {/* 1. STOPS with Reset link */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    STOPS
                  </span>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-blue-700 hover:text-blue-800 font-bold cursor-pointer"
                  >
                    Reset all
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'direct', label: 'Direct', price: 3299 },
                    { id: '1-stop', label: '1 Stop', price: 3850 },
                    { id: '2-stops', label: '2+ Stops', price: 5100 },
                  ].map((s) => {
                    const checked = selectedStops.includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center justify-between cursor-pointer select-none py-1">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setSelectedStops(selectedStops.filter((x) => x !== s.id));
                              } else {
                                setSelectedStops([...selectedStops, s.id]);
                              }
                            }}
                            className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                          />
                          <span className="font-semibold text-slate-800">{s.label}</span>
                        </div>
                        <span className="font-price text-slate-900 font-medium">
                          {formatPrice(s.price, currency)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. DEPARTURE TIMES */}
              <div className="pt-3 border-t border-slate-300/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    DEPARTURE TIMES
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Outbound</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'morning', label: 'Morning', hours: '06:00-12:00', icon: Sun },
                    { id: 'afternoon', label: 'Afternoon', hours: '12:00-18:00', icon: Sun },
                    { id: 'evening', label: 'Evening', hours: '18:00-00:00', icon: Moon },
                  ].map((slot) => {
                    const Icon = slot.icon;
                    const active = selectedDepTimes.includes(slot.id);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setSelectedDepTimes(selectedDepTimes.filter((x) => x !== slot.id));
                          } else {
                            setSelectedDepTimes([...selectedDepTimes, slot.id]);
                          }
                        }}
                        className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                          active
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-200/80 hover:bg-slate-200 text-slate-800 border border-slate-300/80'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mx-auto mb-1" />
                        <div className="text-[11px] font-bold leading-tight">{slot.label}</div>
                        <div className={`text-[9px] ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                          {slot.hours}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. AIRLINES */}
              <div className="pt-3 border-t border-slate-300/70">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  AIRLINES
                </span>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Emirates', price: 24900 },
                    { name: 'Lufthansa', price: 29800 },
                    { name: 'British Airways', price: 32250 },
                    { name: 'Virgin Atlantic', price: 34700 },
                    { name: 'Delta Air Lines', price: 29150 },
                    { name: 'Norse Atlantic', price: 26800 },
                    { name: 'IndiGo', price: 3850 },
                    { name: 'Air India', price: 4120 },
                    { name: 'Vistara', price: 4650 },
                    { name: 'Akasa Air', price: 3299 },
                  ].map((air) => {
                    const checked = selectedAirlines.includes(air.name);
                    return (
                      <label key={air.name} className="flex items-center justify-between cursor-pointer select-none py-0.5">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setSelectedAirlines(selectedAirlines.filter((x) => x !== air.name));
                              } else {
                                setSelectedAirlines([...selectedAirlines, air.name]);
                              }
                            }}
                            className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                          />
                          <span className="font-semibold text-slate-800">{air.name}</span>
                        </div>
                        <span className="font-price text-slate-900 font-medium">
                          {formatPrice(air.price, currency)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. BAGGAGE */}
              <div className="pt-3 border-t border-slate-300/70">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  BAGGAGE
                </span>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'cabin', label: 'Cabin bag included' },
                    { id: 'checked', label: 'Checked baggage (15kg+)' },
                  ].map((bag) => {
                    const checked = selectedBaggage.includes(bag.id);
                    return (
                      <label key={bag.id} className="flex items-center gap-2.5 cursor-pointer select-none py-0.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setSelectedBaggage(selectedBaggage.filter((x) => x !== bag.id));
                            } else {
                              setSelectedBaggage([...selectedBaggage, bag.id]);
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span className="font-semibold text-slate-800">{bag.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. GREENER FLIGHTS */}
              <div className="pt-3.5 border-t border-slate-200/90">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Greener flights</div>
                      <div className="text-[10px] text-slate-500">Only show flights with lower CO₂ emissions</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={greenerOnly}
                      onChange={(e) => setGreenerOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* ===============================================================
              RIGHT COLUMN: RESULTS, TABS & FLIGHT CARDS
          =============================================================== */}
          <div className="lg:col-span-9 space-y-4">
            {/* Results Header: Count & Custom Sort Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Showing <strong className="text-slate-900">{filteredFlights.length} flights</strong> from{' '}
                <span className="font-semibold">{appliedFromCity.city}</span> to{' '}
                <span className="font-semibold">{appliedToCity.city}</span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenSortDropdown(!openSortDropdown)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-xl px-3.5 py-2 shadow-2xs text-xs transition-all cursor-pointer"
                >
                  <span className="text-slate-500 font-medium">Sort by</span>
                  <span className="font-bold text-slate-900">
                    {sortBy === 'cheapest'
                      ? 'Cheapest First'
                      : sortBy === 'best'
                      ? 'Best Balanced'
                      : sortBy === 'fastest'
                      ? 'Fastest Route'
                      : 'Earliest Departure'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${
                      openSortDropdown ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {openSortDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setOpenSortDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 animate-in fade-in">
                      {[
                        { id: 'cheapest' as const, label: 'Cheapest First' },
                        { id: 'best' as const, label: 'Best Balanced' },
                        { id: 'fastest' as const, label: 'Fastest Route' },
                        { id: 'departure' as const, label: 'Earliest Departure' },
                      ].map((opt) => {
                        const isActive = sortBy === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.id);
                              setOpenSortDropdown(false);
                            }}
                            className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 font-bold'
                                : 'text-slate-700 font-medium hover:bg-slate-50'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isActive && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Top 3 Summary Cards (Best / Cheapest / Fastest) */}
            <div className="grid grid-cols-3 gap-3">
              {/* Best */}
              <button
                type="button"
                onClick={() => setSortBy('best')}
                className={`p-3 sm:p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  sortBy === 'best'
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Best</span>
                </div>
                <div className="font-price font-medium text-base sm:text-xl text-slate-950 mt-1">
                  {formatPrice(summaryMetrics.best.price, currency)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {summaryMetrics.best.duration}
                </div>
              </button>

              {/* Cheapest */}
              <button
                type="button"
                onClick={() => setSortBy('cheapest')}
                className={`p-3 sm:p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  sortBy === 'cheapest'
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-700">Cheapest</div>
                <div className="font-price font-medium text-base sm:text-xl text-slate-950 mt-1">
                  {formatPrice(summaryMetrics.cheapest.price, currency)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {summaryMetrics.cheapest.duration}
                </div>
              </button>

              {/* Fastest */}
              <button
                type="button"
                onClick={() => setSortBy('fastest')}
                className={`p-3 sm:p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  sortBy === 'fastest'
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-700">Fastest</div>
                <div className="font-price font-medium text-base sm:text-xl text-slate-950 mt-1">
                  {formatPrice(summaryMetrics.fastest.price, currency)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {summaryMetrics.fastest.duration}
                </div>
              </button>
            </div>

            {/* Flights Cards List */}
            {isLiveLoading || isReturnLoading ? (
              <div className="space-y-4" data-testid="flight-results-skeleton-list" aria-busy="true">
                {[0, 1, 2].map((skeletonIdx) => (
                  <div
                    key={skeletonIdx}
                    className="bg-white rounded-2xl border border-slate-200/90 px-5 py-5 sm:px-7 sm:py-6 shadow-xs"
                  >
                    <div className="h-3.5 w-28 hotel-skeleton-shimmer rounded mb-4" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      <div className="flex-1 flex items-center gap-4 sm:gap-5">
                        <div className="w-11 h-11 rounded-xl hotel-skeleton-shimmer shrink-0" />
                        <div className="w-16 space-y-2">
                          <div className="h-5 hotel-skeleton-shimmer rounded" />
                          <div className="h-3 w-10 hotel-skeleton-shimmer rounded" />
                        </div>
                        <div className="flex-1 max-w-[340px] space-y-2 flex flex-col items-center">
                          <div className="h-3 w-12 hotel-skeleton-shimmer rounded" />
                          <div className="h-0.5 w-full hotel-skeleton-shimmer rounded" />
                          <div className="h-3 w-16 hotel-skeleton-shimmer rounded" />
                        </div>
                        <div className="w-16 space-y-2">
                          <div className="h-5 hotel-skeleton-shimmer rounded" />
                          <div className="h-3 w-10 hotel-skeleton-shimmer rounded ml-auto" />
                        </div>
                      </div>
                      <div className="md:w-[310px] lg:w-[335px] flex items-center justify-between md:justify-end gap-5 md:border-l border-slate-100 md:pl-7">
                        <div className="space-y-2">
                          <div className="h-7 w-24 hotel-skeleton-shimmer rounded" />
                          <div className="h-3 w-28 hotel-skeleton-shimmer rounded" />
                        </div>
                        <div className="h-11 w-24 hotel-skeleton-shimmer rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                <Plane className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-base text-slate-800">No flights match the selected filters</h4>
                <p className="text-xs text-slate-500">Try adjusting your price, timing or airline filters.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.slice(0, visibleCount).map((flight, idx) => {
                  const returnPool = liveReturnFlights && liveReturnFlights.length > 0 ? liveReturnFlights : SKY_RETURN_FLIGHT_CATALOG;
                  const returnFlight = isAppliedRoundTrip
                    ? returnPool[idx % returnPool.length]
                    : undefined;
                  const baseCardPrice = returnFlight
                    ? flight.priceInr + returnFlight.priceInr
                    : flight.priceInr;
                  const cardPrice = Math.round(baseCardPrice * getCabinMultiplier(appliedCabinClass));
                  const airlineHeading =
                    returnFlight && returnFlight.airline !== flight.airline
                      ? `${flight.airline} and ${returnFlight.airline}`
                      : flight.airline;
                  const isOutboundStoppage = flight.stopsCount > 0 || flight.stops !== 'Direct';
                  const outboundStopLabel = getReadableStopLabel(flight);
                  const isReturnStoppage = returnFlight ? returnFlight.stopsCount > 0 || returnFlight.stops !== 'Direct' : false;
                  const returnStopLabel = returnFlight ? getReadableStopLabel(returnFlight) : '';

                  return (
                    <div
                      key={flight.id}
                      className="bg-white rounded-2xl border border-slate-200/90 px-5 py-5 sm:px-7 sm:py-6 shadow-xs hover:shadow-md transition-shadow relative"
                    >
                      {/* Main Flight Layout: Left Flight Tracks + Right Price CTA */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-7">
                        {/* Left Side: Airline Heading + Legs Container */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-3">
                            <div className="text-sm font-bold text-slate-800 tracking-tight">
                              {airlineHeading}
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Outbound Leg */}
                            <div className="flex items-center gap-4 sm:gap-5">
                              {/* Airline Badge */}
                              <div className="w-11 shrink-0 flex items-center justify-center">
                                <div
                                  className={`w-11 h-11 rounded-xl ${flight.badgeBg} text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-2xs`}
                                >
                                  {flight.badgeCode}
                                </div>
                              </div>

                              {/* Departure */}
                              <div className="w-[72px] sm:w-[80px] shrink-0 text-left">
                                <div className="font-price font-medium text-slate-900 text-xl sm:text-[22px] leading-none">
                                  {flight.depTime}
                                </div>
                                <div className="text-xs font-bold text-slate-500 mt-1.5">{appliedFromCity.code}</div>
                              </div>

                              {/* Flight Center Line Track */}
                              <div className="flex-1 flex flex-col items-center min-w-[100px] max-w-[340px]">
                                <span className="text-xs font-medium text-slate-500 leading-none">{flight.duration}</span>
                                <div className="relative w-full flex items-center my-2">
                                  <div className="flex-1 h-[1.5px] bg-slate-300 relative flex items-center justify-center">
                                    {isOutboundStoppage && (
                                      flight.stopsCount >= 2 ? (
                                        <div className="flex items-center justify-evenly w-full px-4">
                                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs" />
                                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs" />
                                        </div>
                                      ) : (
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs" />
                                      )
                                    )}
                                  </div>
                                  <Plane className="w-4 h-4 text-slate-500 fill-slate-500 rotate-45 -ml-0.5 shrink-0" />
                                </div>
                                <span
                                  className={`text-xs font-bold leading-none text-center ${
                                    isOutboundStoppage ? 'text-amber-700' : 'text-emerald-600'
                                  }`}
                                >
                                  {outboundStopLabel}
                                </span>
                              </div>

                              {/* Arrival */}
                              <div className="w-[72px] sm:w-[80px] shrink-0 text-right">
                                <div className="font-price font-medium text-slate-900 text-xl sm:text-[22px] leading-none flex items-center justify-end">
                                  <span>{flight.arrTime}</span>
                                  {flight.daysLater && (
                                    <sup className="text-[10px] text-red-600 font-bold ml-0.5">
                                      +{flight.daysLater}
                                    </sup>
                                  )}
                                </div>
                                <div className="text-xs font-bold text-slate-500 mt-1.5">{appliedToCity.code}</div>
                              </div>
                            </div>

                            {/* Return Leg (if Round-Trip) — identical alignment, no divider line */}
                            {isAppliedRoundTrip && returnFlight && (
                              <div className="flex items-center gap-4 sm:gap-5">
                                {/* Airline Badge */}
                                <div className="w-11 shrink-0 flex items-center justify-center">
                                  <div
                                    className={`w-11 h-11 rounded-xl ${returnFlight.badgeBg} text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-2xs`}
                                  >
                                    {returnFlight.badgeCode}
                                  </div>
                                </div>

                                {/* Departure */}
                                <div className="w-[72px] sm:w-[80px] shrink-0 text-left">
                                  <div className="font-price font-medium text-slate-900 text-xl sm:text-[22px] leading-none">
                                    {returnFlight.depTime}
                                  </div>
                                  <div className="text-xs font-bold text-slate-500 mt-1.5">{appliedToCity.code}</div>
                                </div>

                                {/* Flight Center Line Track */}
                                <div className="flex-1 flex flex-col items-center min-w-[100px] max-w-[340px]">
                                  <span className="text-xs font-medium text-slate-500 leading-none">{returnFlight.duration}</span>
                                  <div className="relative w-full flex items-center my-2">
                                    <div className="flex-1 h-[1.5px] bg-slate-300 relative flex items-center justify-center">
                                      {isReturnStoppage && (
                                        returnFlight.stopsCount >= 2 ? (
                                          <div className="flex items-center justify-evenly w-full px-4">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs" />
                                          </div>
                                        ) : (
                                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs" />
                                        )
                                      )}
                                    </div>
                                    <Plane className="w-4 h-4 text-slate-500 fill-slate-500 rotate-45 -ml-0.5 shrink-0" />
                                  </div>
                                  <span
                                    className={`text-xs font-bold leading-none text-center ${
                                      isReturnStoppage ? 'text-amber-700' : 'text-emerald-600'
                                    }`}
                                  >
                                    {returnStopLabel}
                                  </span>
                                </div>

                                {/* Arrival */}
                                <div className="w-[72px] sm:w-[80px] shrink-0 text-right">
                                  <div className="font-price font-medium text-slate-900 text-xl sm:text-[22px] leading-none flex items-center justify-end">
                                    <span>{returnFlight.arrTime}</span>
                                    {returnFlight.daysLater && (
                                      <sup className="text-[10px] text-red-600 font-bold ml-0.5">
                                        +{returnFlight.daysLater}
                                      </sup>
                                    )}
                                  </div>
                                  <div className="text-xs font-bold text-slate-500 mt-1.5">{appliedFromCity.code}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Price & "Select ->" Action */}
                        <div className="md:w-[310px] lg:w-[335px] shrink-0 flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-7">
                          <div className="text-left md:text-right">
                            <div className="flex items-baseline gap-1 md:justify-end">
                              <span className="text-xs text-slate-400">From</span>
                              <span className="font-price text-2xl sm:text-[26px] font-medium text-slate-950 leading-none">
                                {formatPrice(cardPrice * appliedTravellers, currency)}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium mt-1.5">
                              {appliedTravellers > 1 ? `Total for ${appliedTravellers} travelers` : 'Total for 1 traveler'}
                              {appliedCabinClass && appliedCabinClass !== 'Economy' ? ` · ${appliedCabinClass}` : ''}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {flight.providersCount} deals
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectFlight(flight, returnFlight)}
                            className="px-6 py-3 rounded-xl bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] hover:from-[#072a4f] hover:via-[#093461] hover:to-[#0d437c] active:scale-95 text-white font-bold text-sm shadow-sm shadow-[#05203c]/25 flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-md shrink-0 whitespace-nowrap"
                          >
                            <span>Select</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Show More Flights Button */}
            {visibleCount < filteredFlights.length && (
              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm text-slate-800 shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Show more flights ({filteredFlights.length - visibleCount} left)</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}

            {/* Bottom Disclaimer */}
            <div className="text-center text-[11px] text-slate-400 pt-2">
              Prices include estimated taxes and fees. Baggage may cost extra.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
