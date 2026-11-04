import React, { useState, useMemo, useEffect } from 'react';
import {
  Armchair,
  ArrowLeftRight,
  ArrowRight,
  BadgePercent,
  Building2,
  Bus,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  CreditCard,
  Crown,
  DollarSign,
  Eye,
  Filter,
  Flame,
  Heart,
  HelpCircle,
  Hotel,
  Info,
  Landmark,
  Luggage,
  MapPin,
  Moon,
  Palmtree,
  Phone,
  Plane,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Tag,
  TrainFront,
  Users,
  Utensils,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import {
  ASSETS,
  BookingCategory,
  CITIES,
  CityOption,
  CurrencyCode,
  TripType,
  formatPrice,
} from '../data/travelData';
import { useTranslation } from 'react-i18next';
import { formatDateWithLocale } from '../i18n/formatters';
import { SafeImage } from './SafeImage';
import { BusSeatLayoutSelector } from './BusSeatLayoutSelector';
import { FlightFareOptionsModal } from './FlightFareOptionsModal';
import { TripDatePickerModal } from './TripDatePickerModal';
import { NormalCalendarDropdown } from './NormalCalendarDropdown';
import { AirportAutocompleteDropdown } from './AirportAutocompleteDropdown';
import { CheckoutItem } from './CheckoutPaymentPage';
import { ListPropertyModal } from './ListPropertyModal';
import { fetchApprovedProperties, PropertyListing } from '../services/propertyService';
import { CabLocationAutocompleteModal, CabPlace } from './CabLocationAutocompleteModal';

interface FlightSearchResultsPageProps {
  activeCategory: BookingCategory;
  fromCity: CityOption;
  toCity: CityOption;
  cabPickupPoint?: string;
  cabDropPoint?: string;
  cabPickupMapsUrl?: string;
  cabDropMapsUrl?: string;
  tripType?: TripType;
  dummyTripType?: 'one-way' | 'round-trip';
  departureDate: string;
  returnDate?: string;
  travellers: number;
  cabinClass: string;
  currency: CurrencyCode;
  onChangeTripType?: (t: TripType) => void;
  onChangeDummyTripType?: (t: 'one-way' | 'round-trip') => void;
  onChangeFromCity?: (c: CityOption) => void;
  onChangeToCity?: (c: CityOption) => void;
  onChangeCabPickupPoint?: (pt: string, mapsUrl?: string) => void;
  onChangeCabDropPoint?: (pt: string, mapsUrl?: string) => void;
  onChangeDepartureDate?: (d: string) => void;
  onChangeReturnDate?: (d: string) => void;
  onChangeTravellers?: (count: number, cabin: string) => void;
  onChangeCategory?: (cat: BookingCategory) => void;
  onModifySearch?: () => void;
  onSelectFlightOrStayForCheckout: (summary: CheckoutItem) => void;
  onSelectHolidayForCheckout?: (pkg: any) => void;
  onSelectHotelForDetails?: (hotel: any) => void;
  onOpenHostelsPage?: () => void;
  hotelMode?: 'overnight' | 'hourly' | 'villas' | 'hostels';
  onChangeHotelMode?: (mode: 'overnight' | 'hourly' | 'villas' | 'hostels') => void;
  onNotify: (title: string, detail: string) => void;
}

// ============================================================================
// DATASETS FOR ALL 6 SERVICE CATEGORIES (MakeMyTrip / IRCTC / redBus Style)
// ============================================================================

const FLIGHT_CLASSES = ['Economy', 'Premium Eco', 'Business', 'First Class'];
const TRAIN_CLASSES = [
  'All Classes',
  '1A - First AC',
  '2A - AC 2 Tier',
  '3A - AC 3 Tier',
  'CC - AC Chair Car',
  'SL - Sleeper',
];
const TRAIN_QUOTAS = ['General Quota', 'Tatkal', 'Ladies Quota', 'Sr. Citizen'];

// --- A. FLIGHT RESULTS (Awaiting live GDS / Airline Partner Gateway) ---
export interface FlightResult {
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
  arrTime: string;
  arrTerminal: string;
  priceInr: number;
  rating: number;
  tags: string[];
  baggage: string;
  hasCheckInBaggage: boolean;
  period: string;
  refundable: boolean;
}

const FLIGHT_RESULTS: FlightResult[] = [];
const RETURN_FLIGHT_RESULTS: FlightResult[] = [];

// --- B. TRAIN RESULTS (IRCTC Rail Gateway Integration Pending) ---
export interface TrainClassQuota {
  classCode: string;
  className: string;
  priceInr: number;
  status: 'AVAILABLE' | 'RAC' | 'WL';
  quotaLabel: string;
  probability?: string;
  isAC: boolean;
}

export interface TrainResult {
  id: string;
  trainNo: string;
  trainName: string;
  depTime: string;
  depStation: string;
  depCode: string;
  arrTime: string;
  arrStation: string;
  arrCode: string;
  duration: string;
  durationMins: number;
  runningDays: string[];
  trainType: 'Vande Bharat' | 'Rajdhani' | 'Tejas' | 'Superfast' | 'Garib Rath' | 'Mail';
  pantryAvailable: boolean;
  onTimePercent: number;
  minPriceInr: number;
  depPeriod: '12am-6am' | '6am-12pm' | '12pm-6pm' | '6pm-12am';
  arrPeriod: '12am-6am' | '6am-12pm' | '12pm-6pm' | '6pm-12am';
  freeCancellation: boolean;
  hasAlternateGuarantee: boolean;
  quotas: ('General Quota' | 'Tatkal' | 'Ladies Quota' | 'Sr. Citizen')[];
  classes: TrainClassQuota[];
}

const TRAIN_RESULTS: TrainResult[] = [];

// --- C. HOTEL RESULTS (Populated dynamically from Supabase database) ---
export interface HotelResult {
  id: string;
  name: string;
  location: string;
  locality: string;
  stars: number;
  rating: number;
  reviews: number;
  propertyType: 'Resort' | 'Hotel' | 'Villa' | 'Heritage';
  roomType: string;
  perks: string;
  hasBreakfast: boolean;
  hasPool: boolean;
  hasWifi: boolean;
  isBeachfront: boolean;
  isCoupleFriendly: boolean;
  freeCancellation: boolean;
  payAtHotel: boolean;
  hasSpa: boolean;
  hasAirportShuttle: boolean;
  isTripYeahAssured: boolean;
  amenities: string[];
  priceInr: number;
  originalPriceInr: number;
  image: string;
  tag: string;
}

const HOTEL_RESULTS: HotelResult[] = [];

export function mapPropertyToHotelResult(p: PropertyListing): HotelResult {
  const cat = (p.category || 'hotel').toLowerCase();
  const starsMap: Record<string, number> = {
    hotel: 4,
    resort: 5,
    villa: 5,
    homestay: 3,
    hostel: 2,
    apartment: 4,
  };
  const propType =
    cat === 'resort'
      ? 'Resort'
      : cat === 'villa'
      ? 'Villa'
      : 'Hotel';
  const hasPool = p.amenities?.some((a) => a.toLowerCase().includes('pool')) || false;
  const hasWifi = p.amenities?.some((a) => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('wifi')) || true;
  const hasBreakfast = p.amenities?.some((a) => a.toLowerCase().includes('breakfast')) || false;
  const isBeachfront =
    p.amenities?.some((a) => a.toLowerCase().includes('beach')) ||
    p.address.toLowerCase().includes('beach') ||
    p.city.toLowerCase().includes('goa') ||
    false;

  return {
    id: p.id,
    name: p.name,
    location: `${p.address}, ${p.city}`,
    locality: p.city,
    stars: starsMap[p.category] || 4,
    rating: 4.85,
    reviews: 32,
    propertyType: propType as any,
    roomType: p.roomType || 'Standard Deluxe Room',
    perks: `Verified Partner Listing · ${p.availableRooms || 1} Room(s) Available · Check-in ${p.checkInTime || '02:00 PM'}`,
    hasBreakfast,
    hasPool,
    hasWifi,
    isBeachfront,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: p.amenities?.some((a) => a.toLowerCase().includes('spa')) || false,
    hasAirportShuttle: p.amenities?.some((a) => a.toLowerCase().includes('cab') || a.toLowerCase().includes('shuttle') || a.toLowerCase().includes('airport')) || false,
    isTripYeahAssured: true,
    amenities: p.amenities && p.amenities.length > 0 ? p.amenities : ['Free WiFi', 'Air Conditioning', 'Couple Friendly'],
    priceInr: p.basePriceInr,
    originalPriceInr: Math.round(p.basePriceInr * 1.3),
    image: p.photos && p.photos.length > 0 ? p.photos[0] : ASSETS.bali,
    tag: `${p.category} · Verified`,
  };
}

// --- D. BUS RESULTS (redBus & MMT Style) ---
export interface BusResult {
  id: string;
  operator: string;
  busType: string;
  busCategory: 'AC Sleeper' | 'Volvo Multi-Axle' | 'Electric' | 'Semi-Sleeper' | 'Non-AC Sleeper';
  depTime: string;
  depPoint: string;
  depPeriod: '12am-6am' | '6am-12pm' | '12pm-6pm' | '6pm-12am';
  arrTime: string;
  arrPoint: string;
  arrPeriod: '12am-6am' | '6am-12pm' | '12pm-6pm' | '6pm-12am';
  duration: string;
  durationMins: number;
  rating: number;
  totalRatings: number;
  priceInr: number;
  originalPriceInr: number;
  seatsLeft: number;
  isSingleLadyBerth: boolean;
  isPrimo: boolean;
  hasLiveTracking: boolean;
  hasFreeCancellation: boolean;
  amenities: string[];
  badges: string[];
}

const BUS_RESULTS: BusResult[] = [];

// --- E. CABS RESULTS (MakeMyTrip Outstation & Intercity) ---
export interface CabResult {
  id: string;
  cabType: string;
  modelExamples: string;
  cabCategory: 'Sedan' | 'SUV' | 'Prime Crysta' | 'Tempo';
  seats: number;
  bags: number;
  acType: string;
  priceInr: number;
  perKmRate: number;
  includedKm: number;
  tollTaxesIncluded: boolean;
  driverRating: number;
  driverTrips: number;
  perks: string[];
  tag: string;
}

const CAB_RESULTS: CabResult[] = [
  {
    id: 'cab-sedan-prime',
    cabType: 'Prime Sedan (Dzire / Etios / Aura)',
    modelExamples: 'Maruti Suzuki Dzire, Toyota Etios, Hyundai Aura',
    cabCategory: 'Sedan',
    seats: 4,
    bags: 3,
    acType: 'Air Conditioned',
    priceInr: 2850,
    perKmRate: 12,
    includedKm: 250,
    tollTaxesIncluded: true,
    driverRating: 4.89,
    driverTrips: 1420,
    perks: [
      'Verified Google Maps Doorstep Pickup & Drop',
      'Toll charges, state permits & driver allowance included',
      'Free 45 mins airport/doorstep waiting period',
      'Top-rated chauffeur with clean sanitized car & GPS tracking'
    ],
    tag: 'Most Popular · Best Value',
  },
  {
    id: 'cab-suv-ertiga',
    cabType: 'Family SUV (Maruti Ertiga / Triber)',
    modelExamples: 'Maruti Suzuki Ertiga, Renault Triber',
    cabCategory: 'SUV',
    seats: 6,
    bags: 4,
    acType: 'Dual Air Conditioned',
    priceInr: 3950,
    perKmRate: 15,
    includedKm: 250,
    tollTaxesIncluded: true,
    driverRating: 4.92,
    driverTrips: 980,
    perks: [
      'Extra boot space for family luggage & roof carrier support',
      'Verified Google Maps Route with real-time live tracking',
      'Zero surge guarantee on holidays & weekends',
      'Complimentary bottled water & phone charging port'
    ],
    tag: 'Spacious · Family Favorite',
  },
  {
    id: 'cab-crysta-luxury',
    cabType: 'Prime Executive (Toyota Innova Crysta)',
    modelExamples: 'Toyota Innova Crysta ZX / GX',
    cabCategory: 'Prime Crysta',
    seats: 7,
    bags: 5,
    acType: 'Climate Control AC',
    priceInr: 5450,
    perKmRate: 19,
    includedKm: 250,
    tollTaxesIncluded: true,
    driverRating: 4.97,
    driverTrips: 2150,
    perks: [
      'Executive captain seats with premium leather interior',
      'Guaranteed on-time arrival or 20% cashback',
      'Express highway FASTag tolls & state road tax included',
      'Senior chauffeur in formal attire with 10+ yrs highway experience'
    ],
    tag: 'Luxury Comfort · Top Rated',
  },
  {
    id: 'cab-tempo-traveller',
    cabType: 'Luxury Group Tempo (Force 12-Seater AC)',
    modelExamples: 'Force Traveller Luxury 12-Seater Executive',
    cabCategory: 'Tempo',
    seats: 12,
    bags: 10,
    acType: 'High-Power Rooftop AC',
    priceInr: 9600,
    perKmRate: 26,
    includedKm: 300,
    tollTaxesIncluded: true,
    driverRating: 4.88,
    driverTrips: 640,
    perks: [
      'Push-back reclining seats with ample aisle space',
      'Large luggage carrier and individual USB mobile chargers',
      'Commercial permit valid across all state borders',
      'Dedicated backup vehicle support 24/7'
    ],
    tag: 'Large Groups & Events',
  },
  {
    id: 'cab-sedan-comfort',
    cabType: 'Economy Sedan (Honda Amaze / Tigor)',
    modelExamples: 'Honda Amaze, Tata Tigor',
    cabCategory: 'Sedan',
    seats: 4,
    bags: 2,
    acType: 'Air Conditioned',
    priceInr: 2450,
    perKmRate: 11,
    includedKm: 200,
    tollTaxesIncluded: true,
    driverRating: 4.82,
    driverTrips: 830,
    perks: [
      'Budget-friendly outstation & airport transfer option',
      'Verified Google Maps pickup and drop coordinates',
      'Driver allowance & state entry tax covered',
      'Flexible 2-hour rescheduling without fees'
    ],
    tag: 'Budget Friendly',
  },
];

// --- F. HOLIDAY RESULTS (MakeMyTrip Style Packages) ---
export interface HolidayPackageItineraryDay {
  day: string;
  title: string;
  desc: string;
}

export interface HolidayPackageResult {
  id: string;
  title: string;
  destination: string;
  city: string;
  durationNightsCount: number;
  durationNights: string;
  durationDays: number;
  theme: 'Beach' | 'Honeymoon' | 'Luxury' | 'Adventure' | 'Culture' | 'Family' | 'Group Tours' | 'Pilgrimage' | 'Wildlife';
  hotelCategory: '<3★' | '3★' | '4★' | '5★';
  hotelStars: number;
  rating: number;
  reviewsCount: number;
  inclusions: string[];
  highlights: string[];
  itinerary: HolidayPackageItineraryDay[];
  hotelStayTitle: string;
  startingPricePerPersonInr: number;
  originalPriceInr: number;
  image: string;
  flightsIncluded: boolean;
  bookAtOneRupee: boolean;
  isCustomizable: boolean;
  isPremiumPackage: boolean;
  bestSeason: string;
  dealTag?: string;
}

const HOLIDAY_RESULTS: HolidayPackageResult[] = [];

const HOLIDAY_THEME_OPTIONS = [
  { id: 'all', label: 'All Packages', icon: Sparkles },
  { id: 'Honeymoon', label: 'Honeymoon', icon: Heart },
  { id: 'Group Tours', label: 'Group Tours', icon: Users },
  { id: 'Pilgrimage', label: 'Pilgrimage', icon: Landmark },
  { id: 'Wildlife', label: 'Wildlife', icon: Compass },
  { id: 'Beach', label: 'Beach & Islands', icon: Palmtree },
  { id: 'Adventure', label: 'Adventure', icon: Zap },
  { id: 'Luxury', label: 'Luxury', icon: Crown },
  { id: 'Family', label: 'Family Special', icon: Sun },
  { id: 'Culture', label: 'Culture & Heritage', icon: Landmark },
];

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

export const FlightSearchResultsPage: React.FC<FlightSearchResultsPageProps> = ({
  activeCategory: initialActiveCategory,
  fromCity,
  toCity,
  cabPickupPoint: propCabPickupPoint,
  cabDropPoint: propCabDropPoint,
  cabPickupMapsUrl: propCabPickupMapsUrl,
  cabDropMapsUrl: propCabDropMapsUrl,
  tripType = 'one-way',
  dummyTripType = 'one-way',
  departureDate,
  returnDate = '2026-10-19',
  travellers = 1,
  cabinClass = 'Economy',
  currency,
  hotelMode: initialHotelMode = 'overnight',
  onChangeHotelMode,
  onChangeTripType,
  onChangeDummyTripType,
  onChangeFromCity,
  onChangeToCity,
  onChangeCabPickupPoint,
  onChangeCabDropPoint,
  onChangeDepartureDate,
  onChangeReturnDate,
  onChangeTravellers,
  onChangeCategory,
  onModifySearch,
  onSelectFlightOrStayForCheckout,
  onSelectHolidayForCheckout,
  onSelectHotelForDetails,
  onOpenHostelsPage,
  onNotify,
}) => {
  const { t, i18n } = useTranslation();
  // Current active results tab (Flights, Trains, Hotels, Buses, Cabs, Holidays)
  const [currentCategory, setCurrentCategory] = useState<BookingCategory>(initialActiveCategory);
  const [currentTripType, setCurrentTripType] = useState<TripType>(tripType || 'one-way');
  const [currentDummyTripType, setCurrentDummyTripType] = useState<'one-way' | 'round-trip'>(dummyTripType || 'one-way');
  const [currentFromCity, setCurrentFromCity] = useState<CityOption>(fromCity);
  const [currentToCity, setCurrentToCity] = useState<CityOption>(toCity);
  const [currentDepDate, setCurrentDepDate] = useState<string>(departureDate || '2026-10-15');
  const [currentRetDate, setCurrentRetDate] = useState<string>(returnDate || '2026-10-19');
  const [currentTravellers, setCurrentTravellers] = useState<number>(travellers || 1);
  const [currentCabinClass, setCurrentCabinClass] = useState<string>(cabinClass || 'Economy');
  const [currentHotelMode, setCurrentHotelMode] = useState<'overnight' | 'hourly' | 'villas' | 'hostels'>(initialHotelMode);
  const [modHotelMode, setModHotelMode] = useState<'overnight' | 'hourly' | 'villas' | 'hostels'>(initialHotelMode);
  const [realHotels, setRealHotels] = useState<HotelResult[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState<boolean>(false);
  const [showListPropertyModal, setShowListPropertyModal] = useState<boolean>(false);

  // Cabs Pickup / Drop Grounded State
  const [localCabPickup, setLocalCabPickup] = useState<string>(
    propCabPickupPoint || 'Indira Gandhi International Airport (Terminal 3)'
  );
  const [localCabDrop, setLocalCabDrop] = useState<string>(
    propCabDropPoint || 'Connaught Place (Inner & Outer Circle)'
  );
  const [localCabPickupMapsUrl, setLocalCabPickupMapsUrl] = useState<string>(
    propCabPickupMapsUrl || 'https://www.google.com/maps/search/?api=1&query=Indira+Gandhi+International+Airport+Terminal+3+New+Delhi'
  );
  const [localCabDropMapsUrl, setLocalCabDropMapsUrl] = useState<string>(
    propCabDropMapsUrl || 'https://www.google.com/maps/search/?api=1&query=Connaught+Place+New+Delhi'
  );
  const [activeCabModal, setActiveCabModal] = useState<'pickup' | 'drop' | null>(null);

  const activeCabPickup = propCabPickupPoint || localCabPickup;
  const activeCabDrop = propCabDropPoint || localCabDrop;
  const activeCabPickupMapsUrl = propCabPickupMapsUrl || localCabPickupMapsUrl;
  const activeCabDropMapsUrl = propCabDropMapsUrl || localCabDropMapsUrl;

  const handleSelectCabLocation = (place: CabPlace, customText?: string) => {
    const locName = customText || place.name;
    const url = place.mapsUrl;
    if (activeCabModal === 'pickup') {
      setLocalCabPickup(locName);
      setLocalCabPickupMapsUrl(url);
      onChangeCabPickupPoint?.(locName, url);
    } else if (activeCabModal === 'drop') {
      setLocalCabDrop(locName);
      setLocalCabDropMapsUrl(url);
      onChangeCabDropPoint?.(locName, url);
    }
    setActiveCabModal(null);
  };

  // Fetch approved properties from Supabase / verified partner storage
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProperties(true);
    fetchApprovedProperties({ city: currentToCity.city, hotelMode: currentHotelMode })
      .then((props) => {
        if (isMounted) {
          setRealHotels(props.map(mapPropertyToHotelResult));
          setIsLoadingProperties(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load approved properties', err);
        if (isMounted) {
          setRealHotels([]);
          setIsLoadingProperties(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [currentToCity.city, currentHotelMode]);

  useEffect(() => {
    if (initialHotelMode) {
      setCurrentHotelMode(initialHotelMode);
      setModHotelMode(initialHotelMode);
    }
  }, [initialHotelMode]);

  // Sync with prop changes
  useEffect(() => {
    setCurrentCategory(initialActiveCategory);
  }, [initialActiveCategory]);

  useEffect(() => {
    if (tripType) setCurrentTripType(tripType);
  }, [tripType]);

  useEffect(() => {
    if (dummyTripType) {
      setCurrentDummyTripType(dummyTripType);
    }
  }, [dummyTripType]);

  useEffect(() => {
    if (fromCity) setCurrentFromCity(fromCity);
  }, [fromCity]);

  useEffect(() => {
    if (toCity) setCurrentToCity(toCity);
  }, [toCity]);

  useEffect(() => {
    if (departureDate) setCurrentDepDate(departureDate);
  }, [departureDate]);

  useEffect(() => {
    if (returnDate) setCurrentRetDate(returnDate);
  }, [returnDate]);

  useEffect(() => {
    if (travellers) setCurrentTravellers(travellers);
  }, [travellers]);

  useEffect(() => {
    if (cabinClass) setCurrentCabinClass(cabinClass);
  }, [cabinClass]);

  // Combined Round-Trip check (Standard Round Trip OR Dummy Flights with Round Trip)
  const isFlightRoundTrip =
    currentTripType === 'round-trip' ||
    (currentTripType === 'dummy-flights' && currentDummyTripType === 'round-trip');

  // --- INLINE MODIFY SEARCH BAR STATE (For All 6 Categories) ---
  const [isModifyOpen, setIsModifyOpen] = useState<boolean>(false);
  const [modCategory, setModCategory] = useState<BookingCategory>(currentCategory);
  const [modTripType, setModTripType] = useState<TripType>(currentTripType);
  const [modDummyTripType, setModDummyTripType] = useState<'one-way' | 'round-trip'>(currentDummyTripType);
  const [modFromCity, setModFromCity] = useState<CityOption>(currentFromCity);
  const [modToCity, setModToCity] = useState<CityOption>(currentToCity);
  const [modDepDate, setModDepDate] = useState<string>(currentDepDate);
  const [modRetDate, setModRetDate] = useState<string>(currentRetDate);
  const [modTravellers, setModTravellers] = useState<number>(currentTravellers);
  const [modCabinClass, setModCabinClass] = useState<string>(currentCabinClass);
  const [openCityPicker, setOpenCityPicker] = useState<'from' | 'to' | 'hotel-dest' | null>(null);

  // Category specific fields in modify bar
  const [modTrainClass, setModTrainClass] = useState<string>('All Classes');
  const [modTrainQuota, setModTrainQuota] = useState<string>('General Quota');
  const [modHotelRooms, setModHotelRooms] = useState<number>(1);
  const [modHotelGuests, setModHotelGuests] = useState<number>(2);
  const [modBusType, setModBusType] = useState<string>('All Buses');
  const [modCabType, setModCabType] = useState<string>('SUV / Sedan');
  const [modCabTime, setModCabTime] = useState<string>('10:00 AM');
  const [modHolidayTheme, setModHolidayTheme] = useState<string>('All Packages');
  const [modHolidayDuration, setModHolidayDuration] = useState<string>('4N / 5D');
  const [calendarTarget, setCalendarTarget] = useState<'dep' | 'ret' | null>(null);

  // Normal Calendar Dropdown state matching front page
  const [openCalendarDropdown, setOpenCalendarDropdown] = useState<
    'header-dep' | 'header-ret' | 'header-hotel-checkin' | 'header-hotel-checkout' | 'mod-dep' | 'mod-ret' | null
  >(null);
  const [openHeaderTravellers, setOpenHeaderTravellers] = useState<boolean>(false);
  const [openModTravellers, setOpenModTravellers] = useState<boolean>(false);
  const [openTrainDropdown, setOpenTrainDropdown] = useState<'from' | 'to' | 'class' | 'quota' | null>(null);
  const [openBusDropdown, setOpenBusDropdown] = useState<'from' | 'to' | 'type' | null>(null);
  const [openCabDropdown, setOpenCabDropdown] = useState<'from' | 'to' | 'time' | 'type' | null>(null);
  const [openHolidayDropdown, setOpenHolidayDropdown] = useState<'from' | 'to' | 'duration' | 'theme' | 'rooms' | null>(null);
  const [openOutboundSortDropdown, setOpenOutboundSortDropdown] = useState<boolean>(false);
  const [openReturnSortDropdown, setOpenReturnSortDropdown] = useState<boolean>(false);

  // Close calendar, travellers and custom popovers on outside click
  useEffect(() => {
    if (
      !openCalendarDropdown &&
      !openHeaderTravellers &&
      !openModTravellers &&
      !openCityPicker &&
      !openTrainDropdown &&
      !openBusDropdown &&
      !openCabDropdown &&
      !openHolidayDropdown &&
      !openOutboundSortDropdown &&
      !openReturnSortDropdown
    ) {
      return;
    }
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.dropdown-field-container') ||
        target.closest('[data-dropdown-container]')
      ) {
        return;
      }
      setOpenCalendarDropdown(null);
      setOpenHeaderTravellers(false);
      setOpenModTravellers(false);
      setOpenCityPicker(null);
      setOpenTrainDropdown(null);
      setOpenBusDropdown(null);
      setOpenCabDropdown(null);
      setOpenHolidayDropdown(null);
      setOpenOutboundSortDropdown(false);
      setOpenReturnSortDropdown(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [
    openCalendarDropdown,
    openHeaderTravellers,
    openModTravellers,
    openCityPicker,
    openTrainDropdown,
    openBusDropdown,
    openCabDropdown,
    openHolidayDropdown,
    openOutboundSortDropdown,
    openReturnSortDropdown,
  ]);

  const handleOpenModify = () => {
    setModCategory(currentCategory);
    setModTripType(currentTripType);
    setModDummyTripType(currentDummyTripType);
    setModFromCity(currentFromCity);
    setModToCity(currentToCity);
    setModDepDate(currentDepDate);
    setModRetDate(currentRetDate);
    setModTravellers(currentTravellers);
    setModCabinClass(currentCabinClass);
    setModHotelMode(currentHotelMode);
    setIsModifyOpen((prev) => !prev);
  };

  const handleSwapModCities = () => {
    const temp = modFromCity;
    setModFromCity(modToCity);
    setModToCity(temp);
  };

  const handleApplyModifySearch = () => {
    setCurrentCategory(modCategory);
    setCurrentTripType(modTripType);
    setCurrentDummyTripType(modDummyTripType);
    setCurrentFromCity(modFromCity);
    setCurrentToCity(modToCity);
    setCurrentDepDate(modDepDate);
    setCurrentRetDate(modRetDate);
    setCurrentTravellers(modTravellers);
    setCurrentCabinClass(modCabinClass);
    setCurrentHotelMode(modHotelMode);
    onChangeHotelMode?.(modHotelMode);

    if (modDepDate && modDepDate.includes('-')) {
      const parts = modDepDate.split('T')[0].split('-');
      if (parts.length === 3) {
        const newAnchor = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        setBusCarouselStartDate(new Date(newAnchor.getFullYear(), newAnchor.getMonth(), newAnchor.getDate() - 2));
      }
    }

    if (modCategory === 'cabs') {
      if (modCabType === 'Sedan') {
        setCabSelectedCategories(['Sedan']);
      } else if (modCabType === 'SUV') {
        setCabSelectedCategories(['SUV']);
      } else if (modCabType === 'Prime Crysta') {
        setCabSelectedCategories(['Prime Crysta']);
      } else if (modCabType === 'Tempo') {
        setCabSelectedCategories(['Tempo']);
      } else {
        setCabSelectedCategories(['Sedan', 'SUV', 'Prime Crysta', 'Tempo']);
      }
    }

    onChangeCategory?.(modCategory);
    onChangeTripType?.(modTripType);
    onChangeDummyTripType?.(modDummyTripType);
    onChangeFromCity?.(modFromCity);
    onChangeToCity?.(modToCity);
    onChangeDepartureDate?.(modDepDate);
    onChangeReturnDate?.(modRetDate);
    onChangeTravellers?.(modTravellers, modCabinClass);

    setIsModifyOpen(false);
    setOpenCityPicker(null);

    const catLabel = modCategory.charAt(0).toUpperCase() + modCategory.slice(1);
    const flightTypeLabel =
      modTripType === 'dummy-flights'
        ? modDummyTripType === 'round-trip'
          ? 'Dummy Flights (Round Trip)'
          : 'Dummy Flights (One Way)'
        : modTripType === 'round-trip'
        ? 'Round Trip'
        : 'One Way';
    
    let stayTypeLabel = 'Hotels';
    if (modCategory === 'hotels') {
      if (modHotelMode === 'villas') stayTypeLabel = 'Luxury Villas & Resorts';
      else if (modHotelMode === 'hourly') stayTypeLabel = 'Hourly Stays';
      else if (modHotelMode === 'hostels') stayTypeLabel = 'Hostels';
    }

    onNotify(
      `Search Updated for ${modCategory === 'hotels' ? stayTypeLabel : catLabel}`,
      modCategory === 'hotels'
        ? `${modToCity.city}, ${modToCity.country} · ${stayTypeLabel} · In: ${modDepDate}`
        : `${modFromCity.city} → ${modToCity.city} (${flightTypeLabel}), ${modDepDate}`
    );
  };

  // --- ROUND-TRIP FLIGHT SELECTIONS (MakeMyTrip Style) ---
  const [selectedOutboundId, setSelectedOutboundId] = useState<string>(FLIGHT_RESULTS[0]?.id || '');
  const [selectedReturnId, setSelectedReturnId] = useState<string>(RETURN_FLIGHT_RESULTS[0]?.id || '');
  const [returnSortBy, setReturnSortBy] = useState<'cheapest' | 'fastest' | 'rating' | 'departure'>('cheapest');

  // Common Sort state
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'rating' | 'departure'>('cheapest');
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [flightForFareModal, setFlightForFareModal] = useState<any | null>(null);

  // --- FILTERS STATE PER CATEGORY ---
  // 1. Flights
  const [flightMaxPrice, setFlightMaxPrice] = useState<number>(10000);
  const [flightSelectedAirlines, setFlightSelectedAirlines] = useState<string[]>(['IndiGo', 'Air India', 'Vistara', 'Akasa Air']);
  const [flightNonStopOnly, setFlightNonStopOnly] = useState<boolean>(false);
  const [flightSelectedStops, setFlightSelectedStops] = useState<string[]>([]);
  const [flightIncludeCheckInBaggage, setFlightIncludeCheckInBaggage] = useState<boolean>(false);
  const [flightRefundableOnly, setFlightRefundableOnly] = useState<boolean>(false);
  const [flightDepSlot, setFlightDepSlot] = useState<string | null>(null);

  // 2. Trains Filter State
  const [trainSearchQuery, setTrainSearchQuery] = useState<string>('');
  const [trainMaxPrice, setTrainMaxPrice] = useState<number>(6000);
  const [trainACOnly, setTrainACOnly] = useState<boolean>(false);
  const [trainAvailableOnly, setTrainAvailableOnly] = useState<boolean>(false);
  const [trainFreeCancellationOnly, setTrainFreeCancellationOnly] = useState<boolean>(false);
  const [trainTripGuaranteeOnly, setTrainTripGuaranteeOnly] = useState<boolean>(false);
  const [trainDepSlots, setTrainDepSlots] = useState<string[]>([]);
  const [trainArrSlots, setTrainArrSlots] = useState<string[]>([]);
  const [trainSelectedTypes, setTrainSelectedTypes] = useState<string[]>([]);
  const [trainSelectedClasses, setTrainSelectedClasses] = useState<string[]>([]);
  const [trainSelectedQuota, setTrainSelectedQuota] = useState<string>('General Quota');
  const [trainSelectedDepStations, setTrainSelectedDepStations] = useState<string[]>([]);
  const [trainSelectedArrStations, setTrainSelectedArrStations] = useState<string[]>([]);
  const [trainPantryOnly, setTrainPantryOnly] = useState<boolean>(false);

  // 3. Hotels
  const [hotelSearchQuery, setHotelSearchQuery] = useState<string>('');
  const [hotelMaxPrice, setHotelMaxPrice] = useState<number>(20000);
  const [hotelMinPrice, setHotelMinPrice] = useState<number>(0);
  const [hotelPriceBracket, setHotelPriceBracket] = useState<string>('all');
  const [hotelStars, setHotelStars] = useState<number[]>([5, 4, 3]);
  const [hotelMinRating, setHotelMinRating] = useState<number>(0);
  const [hotelSelectedLocalities, setHotelSelectedLocalities] = useState<string[]>([]);
  const [hotelSelectedPropertyTypes, setHotelSelectedPropertyTypes] = useState<string[]>([]);
  const [hotelSelectedAmenities, setHotelSelectedAmenities] = useState<string[]>([]);
  const [hotelBeachfrontOnly, setHotelBeachfrontOnly] = useState<boolean>(false);
  const [hotelTripYeahAssuredOnly, setHotelTripYeahAssuredOnly] = useState<boolean>(false);

  // 4. Buses (redBus / MakeMyTrip Style)
  const [busSearchQuery, setBusSearchQuery] = useState<string>('');
  const [busMaxPrice, setBusMaxPrice] = useState<number>(3000);
  const [busPriceBracket, setBusPriceBracket] = useState<string>('all');
  const [busPrimoOnly, setBusPrimoOnly] = useState<boolean>(false);
  const [busSingleLadyOnly, setBusSingleLadyOnly] = useState<boolean>(false);
  const [busLiveTrackingOnly, setBusLiveTrackingOnly] = useState<boolean>(false);
  const [busFreeCancellationOnly, setBusFreeCancellationOnly] = useState<boolean>(false);
  const [busDepSlots, setBusDepSlots] = useState<string[]>([]);
  const [busArrSlots, setBusArrSlots] = useState<string[]>([]);
  const [busSelectedCategories, setBusSelectedCategories] = useState<string[]>([]);
  const [busSelectedOperators, setBusSelectedOperators] = useState<string[]>([]);
  const [busSelectedBoardingPoints, setBusSelectedBoardingPoints] = useState<string[]>([]);
  const [busSelectedDroppingPoints, setBusSelectedDroppingPoints] = useState<string[]>([]);
  const [busSelectedAmenities, setBusSelectedAmenities] = useState<string[]>([]);
  const [busMinRating, setBusMinRating] = useState<number>(0);
  const [expandedBusId, setExpandedBusId] = useState<string | null>(null);

  // Bus date carousel scroll ref and Holiday theme options strip ref
  const busDateStripRef = React.useRef<HTMLDivElement>(null);
  const holidayDateStripRef = React.useRef<HTMLDivElement>(null);
  const holidayThemeStripRef = React.useRef<HTMLDivElement>(null);

  // Initialize carousel start date ONCE based on search date so selecting a date doesn't re-center or shift cards
  const [busCarouselStartDate, setBusCarouselStartDate] = useState<Date>(() => {
    let anchor = new Date();
    const target = departureDate || currentDepDate || '2026-10-15';
    if (target && target.includes('-')) {
      const parts = target.split('T')[0].split('-');
      if (parts.length === 3) {
        anchor = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
    }
    // Start 2 days before initial departure date
    return new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - 2);
  });

  const scrollBusDates = (dir: 'left' | 'right') => {
    if (busDateStripRef.current) {
      busDateStripRef.current.scrollBy({
        left: dir === 'left' ? -240 : 240,
        behavior: 'smooth',
      });
    }
  };

  const scrollHolidayDates = (dir: 'left' | 'right') => {
    if (holidayDateStripRef.current) {
      holidayDateStripRef.current.scrollBy({
        left: dir === 'left' ? -240 : 240,
        behavior: 'smooth',
      });
    }
  };

  const scrollHolidayThemes = (dir: 'left' | 'right') => {
    if (holidayThemeStripRef.current) {
      holidayThemeStripRef.current.scrollBy({
        left: dir === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  const busDateCards = useMemo(() => {
    const list = [];
    for (let i = 0; i < 45; i++) {
      const d = new Date(
        busCarouselStartDate.getFullYear(),
        busCarouselStartDate.getMonth(),
        busCarouselStartDate.getDate() + i
      );
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${dayNum}`;
      const dayOfWeek = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const displayDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const indicativeFare = 1420 + ((i * 7) % 5) * 80;
      list.push({
        dateStr,
        dayOfWeek,
        displayDate,
        fareLabel: `₹${indicativeFare}`,
      });
    }
    return list;
  }, [busCarouselStartDate]);

  const holidayDateCards = useMemo(() => {
    const list = [];
    for (let i = 0; i < 45; i++) {
      const d = new Date(
        busCarouselStartDate.getFullYear(),
        busCarouselStartDate.getMonth(),
        busCarouselStartDate.getDate() + i
      );
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${dayNum}`;
      const dayOfWeek = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const displayDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      list.push({
        dateStr,
        dayOfWeek,
        displayDate,
      });
    }
    return list;
  }, [busCarouselStartDate]);

  // 5. Cabs
  const [cabMaxPrice, setCabMaxPrice] = useState<number>(13000);
  const [cabSelectedCategories, setCabSelectedCategories] = useState<string[]>(['Sedan', 'SUV', 'Prime Crysta', 'Tempo']);
  const [cabMinRating, setCabMinRating] = useState<number>(4.8);

  // 6. Holidays (MakeMyTrip Style)
  const [holidaySearchQuery, setHolidaySearchQuery] = useState<string>('');
  const [holidayMaxNights, setHolidayMaxNights] = useState<number>(7);
  const [holidayMinNights, setHolidayMinNights] = useState<number>(2);
  const [holidayFlightOption, setHolidayFlightOption] = useState<'all' | 'with-flight' | 'without-flight'>('all');
  const [holidayMaxBudget, setHolidayMaxBudget] = useState<number>(60000);
  const [holidayBudgetBrackets, setHolidayBudgetBrackets] = useState<string[]>([]);
  const [holidayHotelCategories, setHolidayHotelCategories] = useState<string[]>([]);
  const [holidaySelectedCities, setHolidaySelectedCities] = useState<string[]>([]);
  const [holidayBookAtOneRupeeOnly, setHolidayBookAtOneRupeeOnly] = useState<boolean>(false);
  const [holidaySelectedThemes, setHolidaySelectedThemes] = useState<string[]>([]);
  const [holidayCustomizableOnly, setHolidayCustomizableOnly] = useState<boolean>(false);
  const [holidayPremiumOnly, setHolidayPremiumOnly] = useState<boolean>(false);
  const [expandedHolidayId, setExpandedHolidayId] = useState<string | null>(null);

  // Holiday header background slideshow (weekend getaways, holiday destinations, honeymoon retreats - no slide labels/names)
  const HOLIDAY_HERO_SLIDES = [
    ASSETS.goa,
    ASSETS.maldives,
    ASSETS.heroSantorini,
    ASSETS.bali,
    ASSETS.manali,
    ASSETS.udaipur,
  ];
  const [holidaySlideIndex, setHolidaySlideIndex] = useState<number>(0);

  useEffect(() => {
    if (currentCategory !== 'holidays') return;
    const interval = setInterval(() => {
      setHolidaySlideIndex((prev) => (prev + 1) % HOLIDAY_HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentCategory]);

  // Reset all filters function
  const handleResetFilters = () => {
    setSortBy('cheapest');
    setFlightMaxPrice(10000);
    setFlightSelectedAirlines(['IndiGo', 'Air India', 'Vistara', 'Akasa Air']);
    setFlightNonStopOnly(false);
    setFlightSelectedStops([]);
    setFlightIncludeCheckInBaggage(false);
    setFlightRefundableOnly(false);
    setFlightDepSlot(null);

    setTrainSearchQuery('');
    setTrainMaxPrice(6000);
    setTrainACOnly(false);
    setTrainAvailableOnly(false);
    setTrainFreeCancellationOnly(false);
    setTrainTripGuaranteeOnly(false);
    setTrainDepSlots([]);
    setTrainArrSlots([]);
    setTrainSelectedTypes([]);
    setTrainSelectedClasses([]);
    setTrainSelectedQuota('General Quota');
    setTrainSelectedDepStations([]);
    setTrainSelectedArrStations([]);
    setTrainPantryOnly(false);

    setHotelSearchQuery('');
    setHotelMaxPrice(20000);
    setHotelMinPrice(0);
    setHotelPriceBracket('all');
    setHotelStars([5, 4, 3]);
    setHotelMinRating(0);
    setHotelSelectedLocalities([]);
    setHotelSelectedPropertyTypes([]);
    setHotelSelectedAmenities([]);
    setHotelBeachfrontOnly(false);
    setHotelTripYeahAssuredOnly(false);

    setBusSearchQuery('');
    setBusMaxPrice(3000);
    setBusPriceBracket('all');
    setBusPrimoOnly(false);
    setBusSingleLadyOnly(false);
    setBusLiveTrackingOnly(false);
    setBusFreeCancellationOnly(false);
    setBusDepSlots([]);
    setBusArrSlots([]);
    setBusSelectedCategories([]);
    setBusSelectedOperators([]);
    setBusSelectedBoardingPoints([]);
    setBusSelectedDroppingPoints([]);
    setBusSelectedAmenities([]);
    setBusMinRating(0);

    setCabMaxPrice(13000);
    setCabSelectedCategories(['Sedan', 'SUV', 'Prime Crysta', 'Tempo']);
    setCabMinRating(4.8);

    setHolidaySearchQuery('');
    setHolidayMaxNights(7);
    setHolidayMinNights(2);
    setHolidayFlightOption('all');
    setHolidayMaxBudget(60000);
    setHolidayBudgetBrackets([]);
    setHolidayHotelCategories([]);
    setHolidaySelectedCities([]);
    setHolidayBookAtOneRupeeOnly(false);
    setHolidaySelectedThemes([]);
    setHolidayCustomizableOnly(false);
    setHolidayPremiumOnly(false);

    onNotify('Filters Reset', 'Displaying all options without criteria restrictions.');
  };

  // --- FILTERED & SORTED COMPUTATIONS ---
  // 1. Filtered Flights
  const processedFlights = useMemo(() => {
    let list = FLIGHT_RESULTS.filter((fl) => {
      if (fl.priceInr > flightMaxPrice) return false;
      if (!flightSelectedAirlines.includes(fl.airline)) return false;
      if (flightNonStopOnly && fl.stops !== 'Non-stop') return false;
      if (flightRefundableOnly && !fl.refundable) return false;

      // Departure Time filter: Early Morning (12am-6am), Morning (6am-12pm), Afternoon (12pm-6pm), Night (6pm-12am)
      if (flightDepSlot) {
        const hour = parseInt(fl.depTime.split(':')[0], 10);
        if (flightDepSlot === 'early-morning') {
          if (hour >= 6) return false;
        } else if (flightDepSlot === 'morning') {
          if (hour < 6 || hour >= 12) return false;
        } else if (flightDepSlot === 'afternoon') {
          if (hour < 12 || hour >= 18) return false;
        } else if (flightDepSlot === 'night') {
          if (hour < 18) return false;
        }
      }

      // Stops filter: Non-stop, 1 Stop, 2 and more
      if (flightSelectedStops.length > 0) {
        const stopsCount = (fl as any).stopsCount ?? (fl.stops.toLowerCase().includes('non-stop') ? 0 : fl.stops.includes('1') ? 1 : 2);
        const matchesNonStop = flightSelectedStops.includes('non-stop') && stopsCount === 0;
        const matches1Stop = flightSelectedStops.includes('1-stop') && stopsCount === 1;
        const matches2Plus = flightSelectedStops.includes('2-plus-stops') && stopsCount >= 2;
        if (!matchesNonStop && !matches1Stop && !matches2Plus) return false;
      }

      // Baggage filter: Include Check-in Baggage
      if (flightIncludeCheckInBaggage) {
        const hasCheckIn = (fl as any).hasCheckInBaggage ?? (fl.baggage.toLowerCase().includes('check-in') && !fl.baggage.toLowerCase().includes('no check-in'));
        if (!hasCheckIn) return false;
      }

      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (sortBy === 'fastest') return a.durationMins - b.durationMins;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'departure') return a.depTime.localeCompare(b.depTime);
      return a.priceInr - b.priceInr;
    });
  }, [flightMaxPrice, flightSelectedAirlines, flightNonStopOnly, flightRefundableOnly, flightDepSlot, flightSelectedStops, flightIncludeCheckInBaggage, sortBy]);

  // 1b. Filtered Return Flights (for Round Trip)
  const processedReturnFlights = useMemo(() => {
    let list = RETURN_FLIGHT_RESULTS.filter((fl) => {
      if (fl.priceInr > flightMaxPrice) return false;
      if (!flightSelectedAirlines.includes(fl.airline)) return false;
      if (flightNonStopOnly && fl.stops !== 'Non-stop') return false;
      if (flightRefundableOnly && !fl.refundable) return false;

      // Departure Time filter: Early Morning (12am-6am), Morning (6am-12pm), Afternoon (12pm-6pm), Night (6pm-12am)
      if (flightDepSlot) {
        const hour = parseInt(fl.depTime.split(':')[0], 10);
        if (flightDepSlot === 'early-morning') {
          if (hour >= 6) return false;
        } else if (flightDepSlot === 'morning') {
          if (hour < 6 || hour >= 12) return false;
        } else if (flightDepSlot === 'afternoon') {
          if (hour < 12 || hour >= 18) return false;
        } else if (flightDepSlot === 'night') {
          if (hour < 18) return false;
        }
      }

      // Stops filter: Non-stop, 1 Stop, 2 and more
      if (flightSelectedStops.length > 0) {
        const stopsCount = (fl as any).stopsCount ?? (fl.stops.toLowerCase().includes('non-stop') ? 0 : fl.stops.includes('1') ? 1 : 2);
        const matchesNonStop = flightSelectedStops.includes('non-stop') && stopsCount === 0;
        const matches1Stop = flightSelectedStops.includes('1-stop') && stopsCount === 1;
        const matches2Plus = flightSelectedStops.includes('2-plus-stops') && stopsCount >= 2;
        if (!matchesNonStop && !matches1Stop && !matches2Plus) return false;
      }

      // Baggage filter: Include Check-in Baggage
      if (flightIncludeCheckInBaggage) {
        const hasCheckIn = (fl as any).hasCheckInBaggage ?? (fl.baggage.toLowerCase().includes('check-in') && !fl.baggage.toLowerCase().includes('no check-in'));
        if (!hasCheckIn) return false;
      }

      return true;
    });

    return list.sort((a, b) => {
      if (returnSortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (returnSortBy === 'fastest') return a.durationMins - b.durationMins;
      if (returnSortBy === 'rating') return b.rating - a.rating;
      if (returnSortBy === 'departure') return a.depTime.localeCompare(b.depTime);
      return a.priceInr - b.priceInr;
    });
  }, [flightMaxPrice, flightSelectedAirlines, flightNonStopOnly, flightRefundableOnly, flightDepSlot, flightSelectedStops, flightIncludeCheckInBaggage, returnSortBy]);

  const selectedOutboundFlight = useMemo(() => {
    if (FLIGHT_RESULTS.length === 0) return null;
    return FLIGHT_RESULTS.find((f) => f.id === selectedOutboundId) || FLIGHT_RESULTS[0] || null;
  }, [selectedOutboundId]);

  const selectedReturnFlight = useMemo(() => {
    if (RETURN_FLIGHT_RESULTS.length === 0) return null;
    return RETURN_FLIGHT_RESULTS.find((f) => f.id === selectedReturnId) || RETURN_FLIGHT_RESULTS[0] || null;
  }, [selectedReturnId]);

  const totalRoundTripFare = useMemo(() => {
    if (currentTripType === 'dummy-flights') {
      return 890 * currentTravellers;
    }
    if (!selectedOutboundFlight || !selectedReturnFlight) return 0;
    return (((selectedOutboundFlight as any)?.priceInr || 0) + ((selectedReturnFlight as any)?.priceInr || 0)) * currentTravellers;
  }, [currentTripType, selectedOutboundFlight, selectedReturnFlight, currentTravellers]);

  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    return formatDateWithLocale(dateStr, i18n.language, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // 2. Filtered Trains
  const processedTrains = useMemo(() => {
    let list = TRAIN_RESULTS.filter((tr) => {
      // 1. Text search by train name, number, or station
      if (trainSearchQuery.trim()) {
        const q = trainSearchQuery.toLowerCase().trim();
        const matchesName = tr.trainName.toLowerCase().includes(q) || tr.trainNo.includes(q);
        const matchesStation = tr.depStation.toLowerCase().includes(q) || tr.arrStation.toLowerCase().includes(q);
        if (!matchesName && !matchesStation) return false;
      }

      // 2. Max Price
      if (tr.minPriceInr > trainMaxPrice) return false;

      // 3. Quick Filter: AC Only (at least one AC class)
      if (trainACOnly && !tr.classes.some((c) => c.isAC)) return false;

      // 4. Quick Filter: Available / Confirmed Seats Only
      if (trainAvailableOnly && !tr.classes.some((c) => c.status === 'AVAILABLE')) return false;

      // 5. Quick Filter: Free Cancellation
      if (trainFreeCancellationOnly && !tr.freeCancellation) return false;

      // 6. Quick Filter: Trip Guarantee (Confirmed or 3X Refund)
      if (trainTripGuaranteeOnly && !tr.hasAlternateGuarantee) return false;

      // 7. Departure Time Slots
      if (trainDepSlots.length > 0 && !trainDepSlots.includes(tr.depPeriod)) return false;

      // 8. Arrival Time Slots
      if (trainArrSlots.length > 0 && !trainArrSlots.includes(tr.arrPeriod)) return false;

      // 9. Train Types
      if (trainSelectedTypes.length > 0 && !trainSelectedTypes.includes(tr.trainType)) return false;

      // 10. Quota
      if (trainSelectedQuota && !tr.quotas.includes(trainSelectedQuota as any)) return false;

      // 11. Departure Stations
      if (trainSelectedDepStations.length > 0 && !trainSelectedDepStations.includes(tr.depCode)) return false;

      // 12. Arrival Stations
      if (trainSelectedArrStations.length > 0 && !trainSelectedArrStations.includes(tr.arrCode)) return false;

      // 13. Journey Classes
      if (trainSelectedClasses.length > 0) {
        const hasClass = tr.classes.some((c) => trainSelectedClasses.includes(c.classCode));
        if (!hasClass) return false;
      }

      // 14. Pantry Food
      if (trainPantryOnly && !tr.pantryAvailable) return false;

      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.minPriceInr - b.minPriceInr;
      if (sortBy === 'fastest') return a.durationMins - b.durationMins;
      if (sortBy === 'rating') return b.onTimePercent - a.onTimePercent;
      if (sortBy === 'departure') return a.depTime.localeCompare(b.depTime);
      return a.minPriceInr - b.minPriceInr;
    });
  }, [
    trainSearchQuery,
    trainMaxPrice,
    trainACOnly,
    trainAvailableOnly,
    trainFreeCancellationOnly,
    trainTripGuaranteeOnly,
    trainDepSlots,
    trainArrSlots,
    trainSelectedTypes,
    trainSelectedClasses,
    trainSelectedQuota,
    trainSelectedDepStations,
    trainSelectedArrStations,
    trainPantryOnly,
    sortBy,
  ]);

  // 3. Filtered Hotels
  const processedHotels = useMemo(() => {
    let list = realHotels.filter((h) => {
      // Search query filter (hotel name or location/locality)
      if (hotelSearchQuery.trim()) {
        const q = hotelSearchQuery.toLowerCase().trim();
        const matchesName = h.name.toLowerCase().includes(q);
        const matchesLoc = h.location.toLowerCase().includes(q) || h.locality.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc) return false;
      }

      // Price slider
      if (h.priceInr > hotelMaxPrice || h.priceInr < hotelMinPrice) return false;

      // Quick price bracket
      if (hotelPriceBracket === 'under-2500' && h.priceInr > 2500) return false;
      if (hotelPriceBracket === '2500-5000' && (h.priceInr < 2500 || h.priceInr > 5000)) return false;
      if (hotelPriceBracket === '5000-9000' && (h.priceInr < 5000 || h.priceInr > 9000)) return false;
      if (hotelPriceBracket === '9000-15000' && (h.priceInr < 9000 || h.priceInr > 15000)) return false;
      if (hotelPriceBracket === 'above-15000' && h.priceInr < 15000) return false;

      // Hotel Star Category
      if (hotelStars.length > 0 && !hotelStars.includes(h.stars)) return false;

      // User Rating
      if (hotelMinRating > 0 && h.rating < hotelMinRating) return false;

      // Locality
      if (hotelSelectedLocalities.length > 0 && !hotelSelectedLocalities.includes(h.locality)) return false;

      // Property Type
      if (hotelSelectedPropertyTypes.length > 0 && !hotelSelectedPropertyTypes.includes(h.propertyType)) return false;

      // Specific amenities
      for (const amenity of hotelSelectedAmenities) {
        if (!h.amenities.includes(amenity)) return false;
      }

      // Beachfront only
      if (hotelBeachfrontOnly && !h.isBeachfront) return false;

      // TripYeah Assured
      if (hotelTripYeahAssuredOnly && !h.isTripYeahAssured) return false;

      return true;
    });

    if (currentHotelMode === 'villas' && hotelSelectedPropertyTypes.length === 0) {
      list = [...list].sort((a, b) => {
        const aIsVR = a.propertyType === 'Villa' || a.propertyType === 'Resort';
        const bIsVR = b.propertyType === 'Villa' || b.propertyType === 'Resort';
        if (aIsVR && !bIsVR) return -1;
        if (!aIsVR && bIsVR) return 1;
        return 0;
      });
    }

    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (sortBy === 'fastest') return b.rating - a.rating; // best value
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'departure') return b.stars - a.stars; // star rating
      return a.priceInr - b.priceInr;
    });
  }, [
    realHotels,
    currentHotelMode,
    hotelSearchQuery,
    hotelMaxPrice,
    hotelMinPrice,
    hotelPriceBracket,
    hotelStars,
    hotelMinRating,
    hotelSelectedLocalities,
    hotelSelectedPropertyTypes,
    hotelSelectedAmenities,
    hotelBeachfrontOnly,
    hotelTripYeahAssuredOnly,
    sortBy,
  ]);

  // 4. Filtered Buses (redBus / MakeMyTrip Style)
  const processedBuses = useMemo(() => {
    let list = BUS_RESULTS.filter((b) => {
      // 1. Search Query
      if (busSearchQuery.trim()) {
        const q = busSearchQuery.toLowerCase().trim();
        const matchesOp = b.operator.toLowerCase().includes(q);
        const matchesType = b.busType.toLowerCase().includes(q) || b.busCategory.toLowerCase().includes(q);
        const matchesDep = b.depPoint.toLowerCase().includes(q);
        const matchesArr = b.arrPoint.toLowerCase().includes(q);
        if (!matchesOp && !matchesType && !matchesDep && !matchesArr) return false;
      }

      // 2. Quick Price Bracket
      if (busPriceBracket === 'under-1500' && b.priceInr >= 1500) return false;
      if (busPriceBracket === '1500-2000' && (b.priceInr < 1500 || b.priceInr > 2000)) return false;
      if (busPriceBracket === 'above-2000' && b.priceInr <= 2000) return false;

      // 3. Max Price Slider
      if (b.priceInr > busMaxPrice) return false;

      // 4. Primo Certified
      if (busPrimoOnly && !b.isPrimo) return false;

      // 5. Single Lady Berths
      if (busSingleLadyOnly && !b.isSingleLadyBerth) return false;

      // 6. Live GPS Tracking
      if (busLiveTrackingOnly && !b.hasLiveTracking) return false;

      // 7. Free Cancellation
      if (busFreeCancellationOnly && !b.hasFreeCancellation) return false;

      // 8. Departure Slots
      if (busDepSlots.length > 0 && !busDepSlots.includes(b.depPeriod)) return false;

      // 9. Arrival Slots
      if (busArrSlots.length > 0 && !busArrSlots.includes(b.arrPeriod)) return false;

      // 10. Coach Categories
      if (busSelectedCategories.length > 0 && !busSelectedCategories.includes(b.busCategory)) return false;

      // 11. Bus Operators
      if (busSelectedOperators.length > 0) {
        const matchesSelectedOp = busSelectedOperators.some((op) =>
          b.operator.toLowerCase().includes(op.toLowerCase())
        );
        if (!matchesSelectedOp) return false;
      }

      // 12. Boarding Points
      if (busSelectedBoardingPoints.length > 0 && !busSelectedBoardingPoints.includes(b.depPoint)) return false;

      // 13. Dropping Points
      if (busSelectedDroppingPoints.length > 0 && !busSelectedDroppingPoints.includes(b.arrPoint)) return false;

      // 14. Amenities
      if (busSelectedAmenities.length > 0) {
        const hasAll = busSelectedAmenities.every((amenity) => b.amenities.includes(amenity));
        if (!hasAll) return false;
      }

      // 15. Min Rating
      if (busMinRating > 0 && b.rating < busMinRating) return false;

      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (sortBy === 'fastest') return a.durationMins - b.durationMins;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'departure') return a.depTime.localeCompare(b.depTime);
      return a.priceInr - b.priceInr;
    });
  }, [
    busSearchQuery,
    busPriceBracket,
    busMaxPrice,
    busPrimoOnly,
    busSingleLadyOnly,
    busLiveTrackingOnly,
    busFreeCancellationOnly,
    busDepSlots,
    busArrSlots,
    busSelectedCategories,
    busSelectedOperators,
    busSelectedBoardingPoints,
    busSelectedDroppingPoints,
    busSelectedAmenities,
    busMinRating,
    sortBy,
  ]);

  // 5. Filtered Cabs
  const processedCabs = useMemo(() => {
    let list = CAB_RESULTS.filter((c) => {
      if (c.priceInr > cabMaxPrice) return false;
      if (!cabSelectedCategories.includes(c.cabCategory)) return false;
      if (c.driverRating < cabMinRating) return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (sortBy === 'rating') return b.driverRating - a.driverRating;
      return a.priceInr - b.priceInr;
    });
  }, [cabMaxPrice, cabSelectedCategories, cabMinRating, sortBy]);

  // 6. Filtered Holidays (MakeMyTrip Style)
  const processedHolidays = useMemo(() => {
    let list = HOLIDAY_RESULTS.filter((pkg) => {
      // 1. Text Search Query
      if (holidaySearchQuery.trim()) {
        const q = holidaySearchQuery.toLowerCase().trim();
        const matchesTitle = pkg.title.toLowerCase().includes(q);
        const matchesDest = pkg.destination.toLowerCase().includes(q) || pkg.city.toLowerCase().includes(q);
        const matchesHotel = pkg.hotelStayTitle.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDest && !matchesHotel) return false;
      }

      // 2. Duration (in Nights)
      if (pkg.durationNightsCount > holidayMaxNights || pkg.durationNightsCount < holidayMinNights) {
        return false;
      }

      // 3. Flights option
      if (holidayFlightOption === 'with-flight' && !pkg.flightsIncluded) return false;
      if (holidayFlightOption === 'without-flight' && pkg.flightsIncluded) return false;

      // 4. Budget Slider
      if (pkg.startingPricePerPersonInr > holidayMaxBudget) return false;

      // 5. Budget Brackets (checkboxes from MMT photo)
      if (holidayBudgetBrackets.length > 0) {
        const matchesAnyBracket = holidayBudgetBrackets.some((b) => {
          if (b === '<15000') return pkg.startingPricePerPersonInr < 15000;
          if (b === '15000-25000') return pkg.startingPricePerPersonInr >= 15000 && pkg.startingPricePerPersonInr <= 25000;
          if (b === '25000-35000') return pkg.startingPricePerPersonInr > 25000 && pkg.startingPricePerPersonInr <= 35000;
          if (b === '>35000') return pkg.startingPricePerPersonInr > 35000;
          return true;
        });
        if (!matchesAnyBracket) return false;
      }

      // 6. Hotel Category (<3★, 3★, 4★, 5★ from MMT photo)
      if (holidayHotelCategories.length > 0 && !holidayHotelCategories.includes(pkg.hotelCategory)) {
        return false;
      }

      // 7. Cities
      if (holidaySelectedCities.length > 0 && !holidaySelectedCities.includes(pkg.city)) {
        return false;
      }

      // 8. Buy Now, Pay Later: Book @ ₹1
      if (holidayBookAtOneRupeeOnly && !pkg.bookAtOneRupee) return false;

      // 9. Themes
      if (holidaySelectedThemes.length > 0 && !holidaySelectedThemes.includes(pkg.theme)) {
        return false;
      }

      // 10. Package Type: Customizable
      if (holidayCustomizableOnly && !pkg.isCustomizable) return false;

      // 11. Premium Packages
      if (holidayPremiumOnly && !pkg.isPremiumPackage) return false;

      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.startingPricePerPersonInr - b.startingPricePerPersonInr;
      if (sortBy === 'fastest') return a.durationDays - b.durationDays;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.startingPricePerPersonInr - b.startingPricePerPersonInr;
    });
  }, [
    holidaySearchQuery,
    holidayMaxNights,
    holidayMinNights,
    holidayFlightOption,
    holidayMaxBudget,
    holidayBudgetBrackets,
    holidayHotelCategories,
    holidaySelectedCities,
    holidayBookAtOneRupeeOnly,
    holidaySelectedThemes,
    holidayCustomizableOnly,
    holidayPremiumOnly,
    sortBy,
  ]);

  const handleCopyCoupon = () => {
    setCodeCopied(true);
    onNotify(
      'Promo Code TRIPYEAH40 Copied!',
      'Flat instant discount will be automatically applied at final payment.'
    );
    setTimeout(() => setCodeCopied(false), 3000);
  };

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* ===================================================================
          1. TOP COMPACT & INLINE MODIFY SEARCH STRIP (MakeMyTrip Style)
      =================================================================== */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="w-full px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Clickable Origin, Destination & Trip Type Chip */}
            <div
              className="flex flex-wrap items-center gap-2.5 sm:gap-4"
            >
              {/* Category & Route Chip (Clicking opens/toggles modify search) */}
              <div
                onClick={handleOpenModify}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer select-none ${
                  isModifyOpen
                    ? 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-slate-100 hover:bg-blue-50 text-slate-900 hover:text-blue-800 border-slate-200 hover:border-blue-200 shadow-2xs'
                }`}
                title="Click to modify search details"
              >
                {currentCategory === 'flights' && <Plane className="w-4 h-4 text-blue-600 shrink-0" />}
                {currentCategory === 'trains' && <TrainFront className="w-4 h-4 text-emerald-600 shrink-0" />}
                {currentCategory === 'hotels' && <Building2 className="w-4 h-4 text-amber-600 shrink-0" />}
                {currentCategory === 'buses' && <Bus className="w-4 h-4 text-indigo-600 shrink-0" />}
                {currentCategory === 'cabs' && <Car className="w-4 h-4 text-sky-600 shrink-0" />}
                {currentCategory === 'holidays' && <Palmtree className="w-4 h-4 text-blue-600 shrink-0" />}

                {currentCategory === 'hotels' ? (
                  <>
                    <span className="text-slate-900 font-extrabold">{currentToCity.city}</span>
                    <span className="text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-bold">
                      {currentToCity.country}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      currentHotelMode === 'villas'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs'
                        : currentHotelMode === 'hourly'
                        ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-2xs'
                        : currentHotelMode === 'hostels'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {currentHotelMode === 'villas'
                        ? 'Luxury Villas & Resorts'
                        : currentHotelMode === 'hourly'
                        ? 'Hourly Stays'
                        : currentHotelMode === 'hostels'
                        ? 'Hostels & Backpackers'
                        : 'Hotels'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-900 font-semibold">{currentFromCity.city}</span>
                    {currentCategory !== 'holidays' && (
                      <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                        {currentCategory === 'trains' ? currentFromCity.stationCode : currentFromCity.code}
                      </span>
                    )}

                    <span className="text-slate-400 font-mono">
                      {currentCategory === 'flights' && isFlightRoundTrip ? '⇄' : '→'}
                    </span>

                    <span className="text-slate-900 font-semibold">{currentToCity.city}</span>
                    {currentCategory !== 'holidays' && (
                      <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                        {currentCategory === 'trains' ? currentToCity.stationCode : currentToCity.code}
                      </span>
                    )}

                    {currentCategory === 'flights' && (
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        currentTripType === 'dummy-flights'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300/70'
                          : isFlightRoundTrip
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {currentTripType === 'dummy-flights'
                          ? currentDummyTripType === 'round-trip'
                            ? 'Dummy Flights (Round Trip)'
                            : 'Dummy Flights (One Way)'
                          : currentTripType === 'round-trip'
                          ? 'Round Trip'
                          : 'One Way'}
                      </span>
                    )}
                  </>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isModifyOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </div>

              {/* Hotel Check-In & Check-Out Adjusted into a Single Combined Box */}
              {currentCategory === 'hotels' ? (
                <div className="relative dropdown-field-container">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (openCalendarDropdown === 'header-hotel-checkin' || openCalendarDropdown === 'header-hotel-checkout') {
                        setOpenCalendarDropdown(null);
                      } else {
                        setOpenCalendarDropdown('header-hotel-checkin');
                      }
                    }}
                    className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-3 sm:px-3.5 py-1.5 rounded-xl border transition-all shadow-2xs select-none cursor-pointer ${
                      openCalendarDropdown === 'header-hotel-checkin' || openCalendarDropdown === 'header-hotel-checkout'
                        ? 'bg-blue-50 text-blue-700 border-blue-500 ring-2 ring-blue-100'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                    }`}
                    title="Click to change check-in and check-out dates"
                  >
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(
                          openCalendarDropdown === 'header-hotel-checkin' ? null : 'header-hotel-checkin'
                        );
                      }}
                      className="cursor-pointer hover:text-blue-600 flex items-center gap-1 font-bold text-slate-900"
                      title="Click to select check-in date"
                    >
                      <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">In:</span>
                      <span>{formatFriendlyDate(currentDepDate)}</span>
                    </button>

                    <span className="text-slate-400 font-mono text-xs">→</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(
                          openCalendarDropdown === 'header-hotel-checkout' ? null : 'header-hotel-checkout'
                        );
                      }}
                      className="cursor-pointer hover:text-blue-600 flex items-center gap-1 font-bold text-slate-900"
                      title="Click to select check-out date"
                    >
                      <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">Out:</span>
                      <span>{formatFriendlyDate(currentRetDate)}</span>
                    </button>

                    {(() => {
                      try {
                        const d1 = new Date(currentDepDate);
                        const d2 = new Date(currentRetDate);
                        const diffDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
                        return (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 ml-0.5">
                            {diffDays} {diffDays === 1 ? 'Night' : 'Nights'}
                          </span>
                        );
                      } catch {
                        return null;
                      }
                    })()}
                  </div>

                  {openCalendarDropdown === 'header-hotel-checkin' && (
                    <NormalCalendarDropdown
                      selectedDate={currentDepDate}
                      minDate="2026-10-15"
                      onSelectDate={(newDate) => {
                        setCurrentDepDate(newDate);
                        setModDepDate(newDate);
                        onChangeDepartureDate?.(newDate);
                        if (currentRetDate <= newDate) {
                          const nextD = new Date(newDate);
                          nextD.setDate(nextD.getDate() + 1);
                          const nextIso = nextD.toISOString().slice(0, 10);
                          setCurrentRetDate(nextIso);
                          setModRetDate(nextIso);
                          onChangeReturnDate?.(nextIso);
                        }
                        setOpenCalendarDropdown('header-hotel-checkout');
                        onNotify('Check-in Selected', `Now select check-out date`);
                      }}
                      onClose={() => setOpenCalendarDropdown(null)}
                      alignRight={false}
                    />
                  )}

                  {openCalendarDropdown === 'header-hotel-checkout' && (
                    <NormalCalendarDropdown
                      selectedDate={currentRetDate}
                      minDate={currentDepDate}
                      onSelectDate={(newDate) => {
                        setCurrentRetDate(newDate);
                        setModRetDate(newDate);
                        onChangeReturnDate?.(newDate);
                        setOpenCalendarDropdown(null);
                        onNotify('Check-out Date Updated', `Check-out set to ${formatFriendlyDate(newDate)}`);
                      }}
                      onClose={() => setOpenCalendarDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>
              ) : currentCategory === 'flights' && isFlightRoundTrip ? (
                <div className="flex items-center gap-2">
                  {/* Outbound / Departure Date */}
                  <div className="relative dropdown-field-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'header-dep' ? null : 'header-dep');
                      }}
                      className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                        openCalendarDropdown === 'header-dep'
                          ? 'bg-blue-50 text-blue-700 border-blue-500 ring-2 ring-blue-100'
                          : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                      }`}
                      title="Click to select departure date"
                    >
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-[11px] text-slate-500 hidden sm:inline">Dep:</span>
                      <span className="font-bold text-slate-900">{formatFriendlyDate(currentDepDate)}</span>
                    </button>

                    {openCalendarDropdown === 'header-dep' && (
                      <NormalCalendarDropdown
                        selectedDate={currentDepDate}
                        minDate="2026-10-15"
                        onSelectDate={(newDate) => {
                          setCurrentDepDate(newDate);
                          setModDepDate(newDate);
                          onChangeDepartureDate?.(newDate);
                          if (currentRetDate <= newDate) {
                            const nextD = new Date(newDate);
                            nextD.setDate(nextD.getDate() + 3);
                            const nextIso = nextD.toISOString().slice(0, 10);
                            setCurrentRetDate(nextIso);
                            setModRetDate(nextIso);
                            onChangeReturnDate?.(nextIso);
                          }
                          setOpenCalendarDropdown(null);
                          onNotify('Departure Date Updated', `Travel date set to ${formatFriendlyDate(newDate)}`);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>

                  <span className="text-slate-300">→</span>

                  {/* Return Date */}
                  <div className="relative dropdown-field-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'header-ret' ? null : 'header-ret');
                      }}
                      className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                        openCalendarDropdown === 'header-ret'
                          ? 'bg-blue-50 text-blue-700 border-blue-500 ring-2 ring-blue-100'
                          : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                      }`}
                      title="Click to select return date"
                    >
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-[11px] text-slate-500 hidden sm:inline">Ret:</span>
                      <span className="font-bold text-slate-900">{formatFriendlyDate(currentRetDate)}</span>
                    </button>

                    {openCalendarDropdown === 'header-ret' && (
                      <NormalCalendarDropdown
                        selectedDate={currentRetDate}
                        minDate={currentDepDate}
                        onSelectDate={(newDate) => {
                          setCurrentRetDate(newDate);
                          setModRetDate(newDate);
                          onChangeReturnDate?.(newDate);
                          setOpenCalendarDropdown(null);
                          onNotify('Return Date Updated', `Return date set to ${formatFriendlyDate(newDate)}`);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* One-Way or Single Journey Date */
                <div className="relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCalendarDropdown(openCalendarDropdown === 'header-dep' ? null : 'header-dep');
                    }}
                    className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                      openCalendarDropdown === 'header-dep'
                        ? 'bg-blue-50 text-blue-700 border-blue-500 ring-2 ring-blue-100'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                    }`}
                    title="Click to view full calendar and select travel date"
                  >
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">
                      {formatFriendlyDate(currentDepDate)}
                    </span>
                  </button>

                  {openCalendarDropdown === 'header-dep' && (
                    <NormalCalendarDropdown
                      selectedDate={currentDepDate}
                      minDate="2026-10-15"
                      onSelectDate={(newDate) => {
                        setCurrentDepDate(newDate);
                        setModDepDate(newDate);
                        onChangeDepartureDate?.(newDate);
                        setOpenCalendarDropdown(null);
                        onNotify('Travel Date Updated', `Travel date set to ${formatFriendlyDate(newDate)}`);
                      }}
                      onClose={() => setOpenCalendarDropdown(null)}
                      alignRight={false}
                    />
                  )}
                </div>
              )}

              {/* Travellers / Guests (Custom Popover matching front page for flights, hidden for trains, hotels, buses, cabs, and holidays as requested) */}
              {currentCategory !== 'trains' && currentCategory !== 'hotels' && currentCategory !== 'buses' && currentCategory !== 'cabs' && currentCategory !== 'holidays' && (
                <div className="relative dropdown-field-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenHeaderTravellers(!openHeaderTravellers);
                      setOpenCalendarDropdown(null);
                    }}
                    className={`hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                      openHeaderTravellers
                        ? 'bg-blue-50 text-blue-700 border-blue-500 ring-2 ring-blue-100'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                    }`}
                    title="Click to change travellers and class"
                  >
                    <Users className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900">
                      {`${currentTravellers} ${currentTravellers === 1 ? 'Traveller' : 'Travellers'} · ${currentCabinClass}`}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  {openHeaderTravellers && currentCategory === 'flights' && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 sm:left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 select-none animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Travellers</span>
                          <span className="text-[10px] text-slate-400">Adults (12+ yrs)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newCount = Math.max(1, currentTravellers - 1);
                              setCurrentTravellers(newCount);
                              setModTravellers(newCount);
                              onChangeTravellers?.(newCount, currentCabinClass);
                            }}
                            disabled={currentTravellers <= 1}
                            className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold font-mono-tabular text-slate-900">
                            {currentTravellers}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newCount = Math.min(9, currentTravellers + 1);
                              setCurrentTravellers(newCount);
                              setModTravellers(newCount);
                              onChangeTravellers?.(newCount, currentCabinClass);
                            }}
                            disabled={currentTravellers >= 9}
                            className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-700 mb-2">Flight Class</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {FLIGHT_CLASSES.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setCurrentCabinClass(c);
                                setModCabinClass(c);
                                onChangeTravellers?.(currentTravellers, c);
                                setOpenHeaderTravellers(false);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                                currentCabinClass === c
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
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filters</span>
              </button>

              {isModifyOpen && (
                <button
                  type="button"
                  onClick={handleOpenModify}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Close search panel"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              )}
            </div>
          </div>

          {/* ===============================================================
              INLINE EXPANDED MODIFY SEARCH PANEL (FOR ALL CATEGORIES)
          =============================================================== */}
          {isModifyOpen && (
            <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/80 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 rounded-b-2xl shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
              {/* 1. FLIGHTS MODIFY CONTROLS */}
              {modCategory === 'flights' && (
                <div className="space-y-4">
                  {/* Trip Type Pills */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="text-xs font-bold text-slate-600">Trip Type:</label>
                    <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setModTripType('one-way')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          modTripType === 'one-way'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        One Way
                      </button>
                      <button
                        type="button"
                        onClick={() => setModTripType('round-trip')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          modTripType === 'round-trip'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Round Trip
                      </button>
                      <button
                        type="button"
                        onClick={() => setModTripType('dummy-flights')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          modTripType === 'dummy-flights'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Dummy Flights
                      </button>
                    </div>

                    {modTripType === 'dummy-flights' && (
                      <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300/80 rounded-xl p-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setModDummyTripType('one-way')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            modDummyTripType === 'one-way'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-amber-800 hover:bg-amber-100/70'
                          }`}
                        >
                          One Way
                        </button>
                        <button
                          type="button"
                          onClick={() => setModDummyTripType('round-trip')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            modDummyTripType === 'round-trip'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-amber-800 hover:bg-amber-100/70'
                          }`}
                        >
                          Round Trip
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Grid Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* From City */}
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        From City
                      </label>
                      <button
                        type="button"
                        onClick={() => setOpenCityPicker(openCityPicker === 'from' ? null : 'from')}
                        className="w-full text-left bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between"
                      >
                        <div className="truncate">
                          <div className="text-slate-900">{modFromCity.city}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{modFromCity.code} · {modFromCity.airportName.split('·')[0]}</div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>

                      <AirportAutocompleteDropdown
                        label="From"
                        selectedCity={modFromCity}
                        onSelectCity={(c) => {
                          setModFromCity(c);
                          setOpenCityPicker(null);
                        }}
                        isOpen={openCityPicker === 'from'}
                        onClose={() => setOpenCityPicker(null)}
                        align="left"
                      />
                    </div>

                    {/* To City with Swap */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600 uppercase">To City</label>
                        <button
                          type="button"
                          onClick={handleSwapModCities}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                          title="Swap Cities"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Swap</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenCityPicker(openCityPicker === 'to' ? null : 'to')}
                        className="w-full text-left bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between"
                      >
                        <div className="truncate">
                          <div className="text-slate-900">{modToCity.city}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{modToCity.code} · {modToCity.airportName.split('·')[0]}</div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>

                      <AirportAutocompleteDropdown
                        label="To"
                        selectedCity={modToCity}
                        onSelectCity={(c) => {
                          setModToCity(c);
                          setOpenCityPicker(null);
                        }}
                        isOpen={openCityPicker === 'to'}
                        onClose={() => setOpenCityPicker(null)}
                        align="right"
                      />
                    </div>

                    {/* Departure Date */}
                    <div className="relative dropdown-field-container">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Departure Date
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCalendarDropdown(openCalendarDropdown === 'mod-dep' ? null : 'mod-dep');
                        }}
                        className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between ${
                          openCalendarDropdown === 'mod-dep' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">{formatFriendlyDate(modDepDate || currentDepDate)}</span>
                        </div>
                      </button>

                      {openCalendarDropdown === 'mod-dep' && (
                        <NormalCalendarDropdown
                          selectedDate={modDepDate || currentDepDate}
                          minDate="2026-10-15"
                          onSelectDate={(newDate) => {
                            setModDepDate(newDate);
                            if (modTripType === 'round-trip' && modRetDate <= newDate) {
                              const nextD = new Date(newDate);
                              nextD.setDate(nextD.getDate() + 3);
                              setModRetDate(nextD.toISOString().slice(0, 10));
                            }
                            setOpenCalendarDropdown(null);
                          }}
                          onClose={() => setOpenCalendarDropdown(null)}
                          alignRight={false}
                        />
                      )}
                    </div>

                    {/* Return Date */}
                    <div className="relative dropdown-field-container">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Return Date
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCalendarDropdown(openCalendarDropdown === 'mod-ret' ? null : 'mod-ret');
                          if (modTripType === 'one-way') setModTripType('round-trip');
                          if (modTripType === 'dummy-flights' && modDummyTripType === 'one-way') {
                            setModDummyTripType('round-trip');
                          }
                        }}
                        className={`w-full text-left border rounded-xl p-2.5 text-xs font-bold shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between ${
                          openCalendarDropdown === 'mod-ret'
                            ? 'border-blue-500 ring-2 ring-blue-100'
                            : modTripType === 'round-trip' || (modTripType === 'dummy-flights' && modDummyTripType === 'round-trip')
                            ? modTripType === 'dummy-flights'
                              ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-semibold'
                              : 'bg-blue-50/60 border-blue-300 text-blue-950 font-semibold'
                            : 'bg-white border-slate-300 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Calendar className={`w-4 h-4 shrink-0 ${
                            modTripType === 'dummy-flights' ? 'text-amber-600' : 'text-blue-600'
                          }`} />
                          <span className="truncate">
                            {modRetDate ? formatFriendlyDate(modRetDate) : 'Select Return Date'}
                          </span>
                        </div>
                      </button>

                      {openCalendarDropdown === 'mod-ret' && (
                        <NormalCalendarDropdown
                          selectedDate={modRetDate || currentRetDate}
                          minDate={modDepDate || currentDepDate}
                          onSelectDate={(newDate) => {
                            setModRetDate(newDate);
                            setOpenCalendarDropdown(null);
                          }}
                          onClose={() => setOpenCalendarDropdown(null)}
                          alignRight={true}
                        />
                      )}
                    </div>

                    {/* Travellers & Cabin Class */}
                    <div className="relative dropdown-field-container">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Travellers &amp; Class
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModTravellers(!openModTravellers);
                          setOpenCalendarDropdown(null);
                        }}
                        className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between ${
                          openModTravellers ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Users className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">
                            {modTravellers} {modTravellers === 1 ? 'Adult' : 'Adults'} · {modCabinClass}
                          </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>

                      {openModTravellers && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 select-none animate-in fade-in zoom-in-95 duration-100"
                        >
                          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Travellers</span>
                              <span className="text-[10px] text-slate-400">Adults (12+ yrs)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setModTravellers(Math.max(1, modTravellers - 1))}
                                disabled={modTravellers <= 1}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-sm font-bold font-mono-tabular text-slate-900">
                                {modTravellers}
                              </span>
                              <button
                                type="button"
                                onClick={() => setModTravellers(Math.min(9, modTravellers + 1))}
                                disabled={modTravellers >= 9}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-700 mb-2">Flight Class</p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {FLIGHT_CLASSES.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => {
                                    setModCabinClass(c);
                                    setOpenModTravellers(false);
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                                    modCabinClass === c
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
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TRAINS MODIFY CONTROLS */}
              {modCategory === 'trains' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* From Station */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      From Station
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTrainDropdown(openTrainDropdown === 'from' ? null : 'from');
                      }}
                      className="w-full text-left bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-emerald-500 cursor-pointer flex items-center justify-between"
                    >
                      <div className="truncate">
                        <div className="text-slate-900">{modFromCity.city} Junction</div>
                        <div className="text-[10px] text-slate-500 font-mono">{modFromCity.stationCode} · IRCTC</div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    {openTrainDropdown === 'from' && (
                      <div className="absolute left-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto custom-scrollbar bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                        {CITIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setModFromCity(c);
                              setOpenTrainDropdown(null);
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between ${
                              modFromCity.code === c.code ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <span>{c.city} Junction</span>
                            <span className="font-mono text-[10px] text-slate-500">{c.stationCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* To Station */}
                  <div className="relative dropdown-field-container">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase">To Station</label>
                      <button
                        type="button"
                        onClick={handleSwapModCities}
                        className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                        title="Swap railway stations"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTrainDropdown(openTrainDropdown === 'to' ? null : 'to');
                      }}
                      className="w-full text-left bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-emerald-500 cursor-pointer flex items-center justify-between"
                    >
                      <div className="truncate">
                        <div className="text-slate-900">{modToCity.city} Junction</div>
                        <div className="text-[10px] text-slate-500 font-mono">{modToCity.stationCode} · IRCTC</div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    {openTrainDropdown === 'to' && (
                      <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto custom-scrollbar bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                        {CITIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setModToCity(c);
                              setOpenTrainDropdown(null);
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between ${
                              modToCity.code === c.code ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <span>{c.city} Junction</span>
                            <span className="font-mono text-[10px] text-slate-500">{c.stationCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trains Journey Date */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Journey Date
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'mod-dep' ? null : 'mod-dep');
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-emerald-500 cursor-pointer flex items-center justify-between ${
                        openCalendarDropdown === 'mod-dep' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{formatFriendlyDate(modDepDate || currentDepDate)}</span>
                      </div>
                    </button>

                    {openCalendarDropdown === 'mod-dep' && (
                      <NormalCalendarDropdown
                        selectedDate={modDepDate || currentDepDate}
                        minDate="2026-10-15"
                        onSelectDate={(newDate) => {
                          setModDepDate(newDate);
                          setOpenCalendarDropdown(null);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>

                  {/* Train Class Custom Popover */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Class
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTrainDropdown(openTrainDropdown === 'class' ? null : 'class');
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-emerald-500 cursor-pointer flex items-center justify-between ${
                        openTrainDropdown === 'class' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-300'
                      }`}
                    >
                      <span className="truncate">{modTrainClass}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    {openTrainDropdown === 'class' && (
                      <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 max-h-60 overflow-y-auto custom-scrollbar">
                        {TRAIN_CLASSES.map((tc) => (
                          <button
                            key={tc}
                            type="button"
                            onClick={() => {
                              setModTrainClass(tc);
                              setOpenTrainDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                              modTrainClass === tc
                                ? 'bg-emerald-50 text-emerald-700 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {tc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Train Quota Custom Popover */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Quota
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTrainDropdown(openTrainDropdown === 'quota' ? null : 'quota');
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-emerald-500 cursor-pointer flex items-center justify-between ${
                        openTrainDropdown === 'quota' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-300'
                      }`}
                    >
                      <span className="truncate">{modTrainQuota}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    {openTrainDropdown === 'quota' && (
                      <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40">
                        {TRAIN_QUOTAS.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => {
                              setModTrainQuota(q);
                              setOpenTrainDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                              modTrainQuota === q
                                ? 'bg-emerald-50 text-emerald-700 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. HOTELS MODIFY CONTROLS */}
              {modCategory === 'hotels' && (
                <div className="space-y-3">
                  {/* Stay Type Selector Pills matching front page */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-xs font-bold text-slate-600">Stay Type:</label>
                    <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-2xs gap-1">
                      {[
                        { id: 'overnight', label: 'Hotels' },
                        { id: 'villas', label: 'Luxury Villas & Resorts' },
                        { id: 'hourly', label: 'Hourly Stays' },
                        { id: 'hostels', label: 'Hostels' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            if (m.id === 'hostels' && onOpenHostelsPage) {
                              onOpenHostelsPage();
                            } else {
                              setModHotelMode(m.id as any);
                            }
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            modHotelMode === m.id
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* City / Destination with Modern Popover matching front page */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      City, Property Name or Location
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCityPicker(openCityPicker === 'hotel-dest' ? null : 'hotel-dest');
                        setOpenCalendarDropdown(null);
                        setOpenModTravellers(false);
                      }}
                      className="w-full text-left bg-white border border-slate-300 hover:border-blue-500 rounded-xl p-2.5 shadow-2xs cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="truncate">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {modToCity.city}, {modToCity.country}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          320+ Verified Properties · {modToCity.airportName || 'Top Tourist Destination'}
                        </div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openCityPicker === 'hotel-dest' ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>

                    {openCityPicker === 'hotel-dest' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-0 top-full mt-1.5 w-72 max-h-64 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {CITIES.map((city) => (
                          <button
                            key={city.code}
                            type="button"
                            onClick={() => {
                              setModToCity(city);
                              setOpenCityPicker(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modToCity.code === city.code
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {city.city}, {city.country}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                                {city.airportName}
                              </div>
                            </div>
                            <span className="font-mono-tabular font-bold text-xs text-slate-600">
                              {city.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hotels Check-in Date */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Check-in Date
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'mod-dep' ? null : 'mod-dep');
                        setOpenCityPicker(null);
                        setOpenModTravellers(false);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between ${
                        openCalendarDropdown === 'mod-dep' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{formatFriendlyDate(modDepDate || currentDepDate)}</span>
                      </div>
                    </button>

                    {openCalendarDropdown === 'mod-dep' && (
                      <NormalCalendarDropdown
                        selectedDate={modDepDate || currentDepDate}
                        minDate="2026-10-15"
                        onSelectDate={(newDate) => {
                          setModDepDate(newDate);
                          if (modRetDate && modRetDate <= newDate) {
                            const nextD = new Date(newDate);
                            nextD.setDate(nextD.getDate() + 2);
                            setModRetDate(nextD.toISOString().slice(0, 10));
                          }
                          setOpenCalendarDropdown(null);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>

                  {/* Hotels Check-out Date */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Check-out Date
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'mod-ret' ? null : 'mod-ret');
                        setOpenCityPicker(null);
                        setOpenModTravellers(false);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between ${
                        openCalendarDropdown === 'mod-ret' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{modRetDate ? formatFriendlyDate(modRetDate) : 'Select Check-out'}</span>
                      </div>
                    </button>

                    {openCalendarDropdown === 'mod-ret' && (
                      <NormalCalendarDropdown
                        selectedDate={modRetDate || currentRetDate}
                        minDate={modDepDate || currentDepDate}
                        onSelectDate={(newDate) => {
                          setModRetDate(newDate);
                          setOpenCalendarDropdown(null);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>

                  {/* Rooms & Guests with Modern Popover matching front page */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Rooms &amp; Guests
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenModTravellers(!openModTravellers);
                        setOpenCityPicker(null);
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openModTravellers ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Users className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {modHotelRooms} {modHotelRooms === 1 ? 'Room' : 'Rooms'}, {modHotelGuests} Guests
                        </span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openModTravellers ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>

                    {openModTravellers && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 max-h-80 overflow-y-auto overscroll-contain custom-scrollbar space-y-3 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {/* Option 1: Rooms Counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">Rooms</span>
                            <span className="text-[10px] text-slate-400">Up to 4 rooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setModHotelRooms(Math.max(1, modHotelRooms - 1))}
                              disabled={modHotelRooms <= 1}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold font-mono-tabular">
                              {modHotelRooms}
                            </span>
                            <button
                              type="button"
                              onClick={() => setModHotelRooms(Math.min(4, modHotelRooms + 1))}
                              disabled={modHotelRooms >= 4}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Option 2: Guests / Adults Counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">Guests (Adults &amp; Children)</span>
                            <span className="text-[10px] text-slate-400">Up to 10 guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setModHotelGuests(Math.max(1, modHotelGuests - 1))}
                              disabled={modHotelGuests <= 1}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold font-mono-tabular">
                              {modHotelGuests}
                            </span>
                            <button
                              type="button"
                              onClick={() => setModHotelGuests(Math.min(10, modHotelGuests + 1))}
                              disabled={modHotelGuests >= 10}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price Per Night filter options matching front page */}
                        <div className="border-t border-slate-100 pt-2">
                          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                            Price Per Night
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            {['₹0 - ₹5,000', '₹5,000 - ₹12,000', '₹12,000 - ₹25,000', '₹0 - ₹15,000+'].map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setOpenModTravellers(false)}
                                className="px-2 py-1 rounded-lg text-[11px] font-medium truncate cursor-pointer bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

              {/* 4. BUSES MODIFY CONTROLS */}
              {modCategory === 'buses' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* From City Custom Dropdown with sleek frontpage style scrollbar */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      From City
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenBusDropdown(openBusDropdown === 'from' ? null : 'from');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-indigo-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openBusDropdown === 'from' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modFromCity.city}</div>
                        <div className="text-[10px] text-slate-500 truncate">ISBT / Main Boarding Point</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openBusDropdown === 'from' ? 'rotate-180 text-indigo-600' : ''}`} />
                    </button>

                    {openBusDropdown === 'from' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-0 top-full mt-1.5 w-72 max-h-64 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {CITIES.map((city) => (
                          <button
                            key={city.code}
                            type="button"
                            onClick={() => {
                              setModFromCity(city);
                              setOpenBusDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modFromCity.code === city.code
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {city.city}, {city.country}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                                {city.city} ISBT / Main Boarding Point
                              </div>
                            </div>
                            <span className="font-mono-tabular font-bold text-xs text-slate-600">
                              {city.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* To City Custom Dropdown with sleek frontpage style scrollbar */}
                  <div className="relative dropdown-field-container">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase">To City</label>
                      <button
                        type="button"
                        onClick={handleSwapModCities}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                        title="Swap cities"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenBusDropdown(openBusDropdown === 'to' ? null : 'to');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-indigo-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openBusDropdown === 'to' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modToCity.city}</div>
                        <div className="text-[10px] text-slate-500 truncate">Central Bus Terminal</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openBusDropdown === 'to' ? 'rotate-180 text-indigo-600' : ''}`} />
                    </button>

                    {openBusDropdown === 'to' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 sm:left-0 top-full mt-1.5 w-72 max-h-64 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {CITIES.map((city) => (
                          <button
                            key={city.code}
                            type="button"
                            onClick={() => {
                              setModToCity(city);
                              setOpenBusDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modToCity.code === city.code
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {city.city}, {city.country}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                                {city.city} Central Bus Stand
                              </div>
                            </div>
                            <span className="font-mono-tabular font-bold text-xs text-slate-600">
                              {city.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Buses Travel Date */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Travel Date
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'mod-dep' ? null : 'mod-dep');
                        setOpenBusDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-indigo-500 cursor-pointer flex items-center justify-between ${
                        openCalendarDropdown === 'mod-dep' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate">{formatFriendlyDate(modDepDate || currentDepDate)}</span>
                      </div>
                      <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded font-mono shrink-0">
                        Calendar
                      </span>
                    </button>

                    {openCalendarDropdown === 'mod-dep' && (
                      <NormalCalendarDropdown
                        selectedDate={modDepDate || currentDepDate}
                        minDate="2026-10-15"
                        onSelectDate={(newDate) => {
                          setModDepDate(newDate);
                          setOpenCalendarDropdown(null);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>

                  {/* Bus Type Custom Dropdown with sleek frontpage style scrollbar */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Bus Type
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenBusDropdown(openBusDropdown === 'type' ? null : 'type');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-indigo-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openBusDropdown === 'type' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modBusType}</div>
                        <div className="text-[10px] text-slate-500">Coach Category</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openBusDropdown === 'type' ? 'rotate-180 text-indigo-600' : ''}`} />
                    </button>

                    {openBusDropdown === 'type' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 w-64 max-h-60 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {[
                          { label: 'All Buses', desc: 'Sleeper, Seater & Volvo' },
                          { label: 'Volvo Multi-Axle', desc: 'Ultra-Comfort AC Ride' },
                          { label: 'AC Sleeper', desc: '2+1 Luxury Sleeper Berths' },
                          { label: 'Electric', desc: 'Zero Emission Green Coach' },
                          { label: 'AC Semi-Sleeper', desc: 'Pushback Recliner Seats' },
                          { label: 'BharatBenz Sleeper', desc: 'Air Suspension Club Class' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              setModBusType(item.label);
                              setOpenBusDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modBusType === item.label
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {item.label}
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                {item.desc}
                              </div>
                            </div>
                            {modBusType === item.label && (
                              <Check className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. CABS MODIFY CONTROLS */}
              {modCategory === 'cabs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Cabs Pickup City */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pickup City
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCabDropdown(openCabDropdown === 'from' ? null : 'from');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-sky-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openCabDropdown === 'from' ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modFromCity.city}</div>
                        <div className="text-[10px] text-slate-500">{modFromCity.country}</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openCabDropdown === 'from' ? 'rotate-180 text-sky-600' : ''}`} />
                    </button>

                    {openCabDropdown === 'from' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-0 top-full mt-1.5 w-72 max-h-64 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {CITIES.map((city) => (
                          <button
                            key={city.code}
                            type="button"
                            onClick={() => {
                              setModFromCity(city);
                              setOpenCabDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modFromCity.code === city.code
                                ? 'bg-sky-50 text-sky-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {city.city}, {city.country}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                                {city.airportName || `${city.city} City Center`}
                              </div>
                            </div>
                            <span className="font-mono-tabular font-bold text-xs text-slate-600">
                              {city.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cabs Drop City */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Drop City
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCabDropdown(openCabDropdown === 'to' ? null : 'to');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-sky-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openCabDropdown === 'to' ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modToCity.city}</div>
                        <div className="text-[10px] text-slate-500">{modToCity.country}</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openCabDropdown === 'to' ? 'rotate-180 text-sky-600' : ''}`} />
                    </button>

                    {openCabDropdown === 'to' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 sm:left-0 top-full mt-1.5 w-72 max-h-64 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {CITIES.map((city) => (
                          <button
                            key={city.code}
                            type="button"
                            onClick={() => {
                              setModToCity(city);
                              setOpenCabDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modToCity.code === city.code
                                ? 'bg-sky-50 text-sky-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {city.city}, {city.country}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                                {city.airportName || `${city.city} City Center`}
                              </div>
                            </div>
                            <span className="font-mono-tabular font-bold text-xs text-slate-600">
                              {city.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cabs Pickup Date */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pickup Date
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'mod-dep' ? null : 'mod-dep');
                        setOpenCabDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-sky-500 cursor-pointer flex items-center justify-between ${
                        openCalendarDropdown === 'mod-dep' ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="truncate">{formatFriendlyDate(modDepDate || currentDepDate)}</span>
                      </div>
                      <span className="text-[10px] text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded font-mono shrink-0">
                        Calendar
                      </span>
                    </button>

                    {openCalendarDropdown === 'mod-dep' && (
                      <NormalCalendarDropdown
                        selectedDate={modDepDate || currentDepDate}
                        minDate="2026-10-15"
                        onSelectDate={(newDate) => {
                          setModDepDate(newDate);
                          setOpenCalendarDropdown(null);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>

                  {/* Cabs Pickup Time */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pickup Time
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCabDropdown(openCabDropdown === 'time' ? null : 'time');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-sky-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openCabDropdown === 'time' ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modCabTime}</div>
                        <div className="text-[10px] text-slate-500">Scheduled Time</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openCabDropdown === 'time' ? 'rotate-180 text-sky-600' : ''}`} />
                    </button>

                    {openCabDropdown === 'time' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 w-48 max-h-60 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {[
                          '06:00 AM',
                          '07:30 AM',
                          '09:00 AM',
                          '10:30 AM',
                          '01:00 PM',
                          '03:30 PM',
                          '05:30 PM',
                          '07:00 PM',
                          '09:00 PM',
                          '11:00 PM',
                        ].map((timeSlot) => (
                          <button
                            key={timeSlot}
                            type="button"
                            onClick={() => {
                              setModCabTime(timeSlot);
                              setOpenCabDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modCabTime === timeSlot
                                ? 'bg-sky-50 text-sky-700 font-bold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="font-semibold">{timeSlot}</span>
                            {modCabTime === timeSlot && (
                              <Check className="w-4 h-4 text-sky-600 stroke-[2.5]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cabs Cab Type */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Cab Type
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCabDropdown(openCabDropdown === 'type' ? null : 'type');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-sky-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openCabDropdown === 'type' ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">
                          {modCabType === 'Prime Crysta' ? 'Prime SUV' : modCabType}
                        </div>
                        <div className="text-[10px] text-slate-500">Vehicle Category</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openCabDropdown === 'type' ? 'rotate-180 text-sky-600' : ''}`} />
                    </button>

                    {openCabDropdown === 'type' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 w-60 max-h-60 overflow-y-auto overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {[
                          { val: 'SUV / Sedan', label: 'All Cabs', desc: 'Any Available Vehicle' },
                          { val: 'Sedan', label: 'Sedan', desc: 'Comfortable 4-Seater' },
                          { val: 'SUV', label: 'SUV', desc: 'Spacious 6-Seater' },
                          { val: 'Prime Crysta', label: 'Prime SUV', desc: 'Premium 7-Seater' },
                          { val: 'Tempo', label: 'Tempo Traveller', desc: '12-Seater Coach' },
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => {
                              setModCabType(item.val);
                              setOpenCabDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modCabType === item.val
                                ? 'bg-sky-50 text-sky-700 font-bold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {item.label}
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                {item.desc}
                              </div>
                            </div>
                            {modCabType === item.val && (
                              <Check className="w-4 h-4 text-sky-600 stroke-[2.5]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. HOLIDAYS MODIFY CONTROLS */}
              {modCategory === 'holidays' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* From City Custom Dropdown */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      From City
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenHolidayDropdown(openHolidayDropdown === 'from' ? null : 'from');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openHolidayDropdown === 'from' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modFromCity.city}</div>
                        <div className="text-[10px] text-slate-500 truncate">Departure City</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openHolidayDropdown === 'from' ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>

                    {openHolidayDropdown === 'from' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-0 top-full mt-1.5 w-72 max-h-60 overflow-y-auto overflow-x-hidden overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {CITIES.map((city) => (
                          <button
                            key={city.code}
                            type="button"
                            onClick={() => {
                              setModFromCity(city);
                              setOpenHolidayDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modFromCity.code === city.code
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {city.city}, {city.country}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                                Flights / Cabs available
                              </div>
                            </div>
                            <span className="font-mono-tabular font-bold text-xs text-slate-600">
                              {city.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Destination Package Custom Dropdown */}
                  <div className="relative dropdown-field-container">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase">Destination</label>
                      <button
                        type="button"
                        onClick={handleSwapModCities}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                        title="Swap cities"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenHolidayDropdown(openHolidayDropdown === 'to' ? null : 'to');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openHolidayDropdown === 'to' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-slate-900 font-bold">{modToCity.city}</div>
                        <div className="text-[10px] text-slate-500 truncate">Holidays</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openHolidayDropdown === 'to' ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>

                    {openHolidayDropdown === 'to' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 sm:left-0 top-full mt-1.5 w-72 max-h-60 overflow-y-auto overflow-x-hidden overscroll-contain custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {CITIES.map((city) => (
                          <button
                            key={city.code}
                            type="button"
                            onClick={() => {
                              setModToCity(city);
                              setOpenHolidayDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              modToCity.code === city.code
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                {city.city} Getaways
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[175px]">
                                {city.city}, {city.country}
                              </div>
                            </div>
                            <span className="font-mono-tabular font-bold text-xs text-slate-600">
                              {city.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Travel Date with Calendar */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Travel Date
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarDropdown(openCalendarDropdown === 'mod-dep' ? null : 'mod-dep');
                        setOpenHolidayDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between ${
                        openCalendarDropdown === 'mod-dep' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{formatFriendlyDate(modDepDate || currentDepDate)}</span>
                      </div>
                      <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded font-mono shrink-0">
                        Calendar
                      </span>
                    </button>

                    {openCalendarDropdown === 'mod-dep' && (
                      <NormalCalendarDropdown
                        selectedDate={modDepDate || currentDepDate}
                        minDate="2026-10-15"
                        onSelectDate={(newDate) => {
                          setModDepDate(newDate);
                          setOpenCalendarDropdown(null);
                        }}
                        onClose={() => setOpenCalendarDropdown(null)}
                        alignRight={false}
                      />
                    )}
                  </div>

                  {/* Rooms & Guests Custom Dropdown (Replaced Duration) */}
                  <div className="relative dropdown-field-container">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Rooms &amp; Guests
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenHolidayDropdown(openHolidayDropdown === 'rooms' ? null : 'rooms');
                        setOpenCalendarDropdown(null);
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-blue-500 cursor-pointer flex items-center justify-between transition-colors ${
                        openHolidayDropdown === 'rooms' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Users className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">
                          {modHotelRooms} {modHotelRooms === 1 ? 'Room' : 'Rooms'}, {modHotelGuests} {modHotelGuests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openHolidayDropdown === 'rooms' ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>

                    {openHolidayDropdown === 'rooms' && (
                      <div
                        data-dropdown-container="true"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 max-h-80 overflow-y-auto overscroll-contain custom-scrollbar space-y-3 select-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        {/* Option 1: Rooms Counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">Rooms</span>
                            <span className="text-[10px] text-slate-400">Up to 4 rooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setModHotelRooms(Math.max(1, modHotelRooms - 1))}
                              disabled={modHotelRooms <= 1}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold font-mono-tabular">
                              {modHotelRooms}
                            </span>
                            <button
                              type="button"
                              onClick={() => setModHotelRooms(Math.min(4, modHotelRooms + 1))}
                              disabled={modHotelRooms >= 4}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Option 2: Guests Counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">Guests (Adults &amp; Children)</span>
                            <span className="text-[10px] text-slate-400">Up to 10 guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newG = Math.max(1, modHotelGuests - 1);
                                setModHotelGuests(newG);
                                setModTravellers(newG);
                              }}
                              disabled={modHotelGuests <= 1}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold font-mono-tabular">
                              {modHotelGuests}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newG = Math.min(10, modHotelGuests + 1);
                                setModHotelGuests(newG);
                                setModTravellers(newG);
                              }}
                              disabled={modHotelGuests >= 10}
                              className="w-7 h-7 rounded-full border border-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setOpenHolidayDropdown(null)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. TOURS & EXPERIENCES MODIFY CONTROLS */}
              {modCategory === 'experiences' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Destination City / Country
                    </label>
                    <select
                      value={modToCity.code}
                      onChange={(e) => {
                        const match = CITIES.find((c) => c.code === e.target.value);
                        if (match) setModToCity(match);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      {CITIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.city}, {c.country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Activity / Visit Date
                    </label>
                    <input
                      type="date"
                      value={modDepDate}
                      onChange={(e) => setModDepDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Apply / Cancel Strip */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModifyOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyModifySearch}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Update Search Results</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          2. TWO-COLUMN LAYOUT: LEFT FILTERS SIDEBAR + RIGHT MAIN RESULTS (Full-Width Corner to Corner)
      =================================================================== */}
      <div className="w-full px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-5">
        <div className="flex flex-col lg:flex-row gap-5 xl:gap-6 items-start w-full">
          {/* =================================================================
              LEFT COLUMN: UNIFIED FILTER SIDEBAR
          =================================================================== */}
          <aside
            className={`w-full lg:w-72 xl:w-80 shrink-0 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-5 sticky top-16 z-10 ${
              showMobileFilters ? 'block mb-4' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* --- FLIGHTS FILTERS --- */}
            {currentCategory === 'flights' && (
              <div className="space-y-4 text-xs">
                {/* Max Price Slider */}
                <div>
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                    <span>Max Fare</span>
                    <span className="font-bold text-blue-600">{formatPrice(flightMaxPrice, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={4000}
                    max={12000}
                    step={200}
                    value={flightMaxPrice}
                    onChange={(e) => setFlightMaxPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>₹4,000</span>
                    <span>₹12,000</span>
                  </div>
                </div>

                {/* Departure Time Slots */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">Departure Time</span>
                    {flightDepSlot && (
                      <button
                        type="button"
                        onClick={() => setFlightDepSlot(null)}
                        className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'early-morning', label: 'Early Morning', sub: '12am - 6am', icon: Sunrise },
                      { id: 'morning', label: 'Morning', sub: '6am - 12pm', icon: Sun },
                      { id: 'afternoon', label: 'Afternoon', sub: '12pm - 6pm', icon: Sunset },
                      { id: 'night', label: 'Night', sub: '6pm - 12am', icon: Moon },
                    ].map((slot) => {
                      const Icon = slot.icon;
                      const active = flightDepSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setFlightDepSlot(active ? null : slot.id)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            active
                              ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-semibold'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="text-[10px] text-slate-400 font-mono">{slot.sub}</span>
                          </div>
                          <div className="text-[11px] font-bold">{slot.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stops Filter */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">Stops</span>
                    {flightSelectedStops.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFlightSelectedStops([])}
                        className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'non-stop', label: 'Non-stop', sub: 'Direct' },
                      { id: '1-stop', label: '1 Stop', sub: '1 Layover' },
                      { id: '2-plus-stops', label: '2 and more', sub: 'Multi-stop' },
                    ].map((item) => {
                      const checked = flightSelectedStops.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 cursor-pointer select-none transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setFlightSelectedStops((prev) =>
                                  checked ? prev.filter((s) => s !== item.id) : [...prev, item.id]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                            />
                            <span className={`text-xs ${checked ? 'font-bold text-blue-700' : 'font-semibold text-slate-800'}`}>
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">
                            {item.sub}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Baggage Filter */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Luggage className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold text-slate-800">Baggage</span>
                    </div>
                  </div>
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 cursor-pointer select-none transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={flightIncludeCheckInBaggage}
                        onChange={() => setFlightIncludeCheckInBaggage(!flightIncludeCheckInBaggage)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                      />
                      <span className={`text-xs ${flightIncludeCheckInBaggage ? 'font-bold text-blue-700' : 'font-semibold text-slate-800'}`}>
                        Include Check-in Baggage
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      15kg Included
                    </span>
                  </label>
                </div>

                {/* Airlines Checkbox List */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Airlines</span>
                  <div className="space-y-2">
                    {['IndiGo', 'Air India', 'Vistara', 'Akasa Air'].map((airline) => {
                      const checked = flightSelectedAirlines.includes(airline);
                      return (
                        <label
                          key={airline}
                          className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setFlightSelectedAirlines((prev) =>
                                checked ? prev.filter((a) => a !== airline) : [...prev, airline]
                              )
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                          />
                          <span>{airline}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Refundable Fares */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                    <input
                      type="checkbox"
                      checked={flightRefundableOnly}
                      onChange={() => setFlightRefundableOnly(!flightRefundableOnly)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                    />
                    <span>Refundable fares only</span>
                  </label>
                </div>
              </div>
            )}

            {/* --- TRAINS FILTERS (TripYeah IRCTC Rail Experience) --- */}
            {currentCategory === 'trains' && (
              <div className="space-y-4 text-xs">
                {/* 1. Train Quick Search */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5">Search Train</span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trainSearchQuery}
                      onChange={(e) => setTrainSearchQuery(e.target.value)}
                      placeholder="Train no. or name (e.g. 12952, Tejas)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                    />
                    {trainSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setTrainSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Quick Filters (Smart Action Tiles) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Quick Filters</span>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 cursor-pointer select-none transition-colors">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={trainACOnly}
                          onChange={() => setTrainACOnly(!trainACOnly)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer accent-emerald-600"
                        />
                        <span className="font-semibold text-slate-800">AC Coaches Only</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                        1A, 2A, 3A, CC
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 cursor-pointer select-none transition-colors">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={trainAvailableOnly}
                          onChange={() => setTrainAvailableOnly(!trainAvailableOnly)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer accent-emerald-600"
                        />
                        <span className="font-semibold text-slate-800">Confirmed Seats Only</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                        AVAILABLE
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 cursor-pointer select-none transition-colors">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={trainFreeCancellationOnly}
                          onChange={() => setTrainFreeCancellationOnly(!trainFreeCancellationOnly)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer accent-emerald-600"
                        />
                        <span className="font-semibold text-slate-800">Free Cancellation</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
                        100% Refund
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 cursor-pointer select-none transition-colors">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={trainTripGuaranteeOnly}
                          onChange={() => setTrainTripGuaranteeOnly(!trainTripGuaranteeOnly)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer accent-emerald-600"
                        />
                        <span className="font-semibold text-slate-800">Alternate Trip Guarantee</span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.5 rounded">
                        3X Refund
                      </span>
                    </label>
                  </div>
                </div>

                {/* 3. Booking Quota */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">Seat Quota</span>
                    <span className="text-[10px] font-semibold text-emerald-700">IRCTC Direct</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'General Quota', code: 'GN', label: 'General' },
                      { id: 'Tatkal', code: 'CK', label: 'Tatkal' },
                      { id: 'Ladies Quota', code: 'LD', label: 'Ladies' },
                      { id: 'Sr. Citizen', code: 'SS', label: 'Sr. Citizen' },
                    ].map((q) => {
                      const isActive = trainSelectedQuota === q.id;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setTrainSelectedQuota(q.id)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-bold'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700 font-medium'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                            {q.code}
                          </div>
                          <div className="text-xs">{q.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Departure Time from Origin */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Departure Time ({currentFromCity.code})
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: '12am-6am', label: 'Early Morning', time: '12am - 6am', icon: Sunrise },
                      { id: '6am-12pm', label: 'Morning', time: '6am - 12pm', icon: Sun },
                      { id: '12pm-6pm', label: 'Afternoon', time: '12pm - 6pm', icon: Sunset },
                      { id: '6pm-12am', label: 'Night', time: '6pm - 12am', icon: Moon },
                    ].map((slot) => {
                      const Icon = slot.icon;
                      const active = trainDepSlots.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() =>
                            setTrainDepSlots((prev) =>
                              active ? prev.filter((s) => s !== slot.id) : [...prev, slot.id]
                            )
                          }
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            active
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-semibold'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="text-[10px] text-slate-400 font-mono">{slot.time}</span>
                          </div>
                          <div className="text-[11px] font-bold">{slot.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Arrival Time at Destination */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Arrival Time ({currentToCity.code})
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: '12am-6am', label: 'Early Morning', time: '12am - 6am', icon: Sunrise },
                      { id: '6am-12pm', label: 'Morning', time: '6am - 12pm', icon: Sun },
                      { id: '12pm-6pm', label: 'Afternoon', time: '12pm - 6pm', icon: Sunset },
                      { id: '6pm-12am', label: 'Night', time: '6pm - 12am', icon: Moon },
                    ].map((slot) => {
                      const Icon = slot.icon;
                      const active = trainArrSlots.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() =>
                            setTrainArrSlots((prev) =>
                              active ? prev.filter((s) => s !== slot.id) : [...prev, slot.id]
                            )
                          }
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            active
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-semibold'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="text-[10px] text-slate-400 font-mono">{slot.time}</span>
                          </div>
                          <div className="text-[11px] font-bold">{slot.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Journey Classes */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Journey Class</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { code: '1A', label: 'First AC' },
                      { code: '2A', label: '2 Tier AC' },
                      { code: '3A', label: '3 Tier AC' },
                      { code: '3E', label: '3 AC Eco' },
                      { code: 'CC', label: 'Chair Car' },
                      { code: 'EC', label: 'Exec Chair' },
                      { code: 'SL', label: 'Sleeper' },
                      { code: '2S', label: '2nd Sitting' },
                    ].map((cls) => {
                      const active = trainSelectedClasses.includes(cls.code);
                      return (
                        <button
                          key={cls.code}
                          type="button"
                          onClick={() =>
                            setTrainSelectedClasses((prev) =>
                              active ? prev.filter((c) => c !== cls.code) : [...prev, cls.code]
                            )
                          }
                          className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                            active
                              ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="font-mono font-bold text-xs">{cls.code}</div>
                          <div className={`text-[9px] truncate ${active ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {cls.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Train Types */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Train Type</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Vande Bharat', badge: 'VB', label: 'Vande Bharat Express' },
                      { id: 'Tejas', badge: 'TEJAS', label: 'Tejas Express' },
                      { id: 'Rajdhani', badge: 'RAJ', label: 'Rajdhani Express' },
                      { id: 'Superfast', badge: 'SF', label: 'Superfast Express' },
                      { id: 'Garib Rath', badge: 'GR', label: 'Garib Rath' },
                      { id: 'Mail', badge: 'MAIL', label: 'Mail / Express' },
                    ].map((t) => {
                      const checked = trainSelectedTypes.includes(t.id);
                      return (
                        <label
                          key={t.id}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setTrainSelectedTypes((prev) =>
                                  checked ? prev.filter((item) => item !== t.id) : [...prev, t.id]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer accent-emerald-600"
                            />
                            <span className="text-[11px] font-medium">{t.label}</span>
                          </div>
                          <span className="text-[9px] font-mono font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {t.badge}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 8. Boarding Stations (Origin) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Boarding Stations ({currentFromCity.city})
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { code: 'NDLS', name: 'New Delhi Railway Station' },
                      { code: 'NZM', name: 'Hazrat Nizamuddin' },
                      { code: 'ANVT', name: 'Anand Vihar Terminal' },
                    ].map((stn) => {
                      const checked = trainSelectedDepStations.includes(stn.code);
                      return (
                        <label
                          key={stn.code}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setTrainSelectedDepStations((prev) =>
                                  checked ? prev.filter((c) => c !== stn.code) : [...prev, stn.code]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer accent-emerald-600"
                            />
                            <span className="text-[11px]">{stn.name}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                            {stn.code}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 9. Deboarding Stations (Destination) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Deboarding Stations ({currentToCity.city})
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { code: 'MMCT', name: 'Mumbai Central' },
                      { code: 'BDTS', name: 'Bandra Terminus' },
                      { code: 'KYN', name: 'Kalyan Junction' },
                      { code: 'MAO', name: 'Madgaon Jn (Goa)' },
                      { code: 'CNB', name: 'Kanpur Central' },
                    ].map((stn) => {
                      const checked = trainSelectedArrStations.includes(stn.code);
                      return (
                        <label
                          key={stn.code}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setTrainSelectedArrStations((prev) =>
                                  checked ? prev.filter((c) => c !== stn.code) : [...prev, stn.code]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer accent-emerald-600"
                            />
                            <span className="text-[11px]">{stn.name}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                            {stn.code}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 10. Max Train Fare Slider */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                    <span>Max Fare Limit</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {formatPrice(trainMaxPrice, currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={6500}
                    step={100}
                    value={trainMaxPrice}
                    onChange={(e) => setTrainMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>₹300</span>
                    <span>₹6,500</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- HOTELS FILTERS (MakeMyTrip Style Left Sidebar) --- */}
            {currentCategory === 'hotels' && (
              <div className="space-y-4 text-xs">
                {/* 1. Quick Search Box */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5">Search Hotel / Locality</span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
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
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. TripYeah Assured Special Filter Banner */}
                <div
                  onClick={() => setHotelTripYeahAssuredOnly((prev) => !prev)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                    hotelTripYeahAssuredOnly
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hotelTripYeahAssuredOnly}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>TripYeah Assured Stays</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Verified photos, 24/7 concierge &amp; 100% money-back check-in guarantee
                    </p>
                  </div>
                </div>

                {/* 3. Price per Night Range & Brackets */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                    <span>Max Price per Night</span>
                    <span className="font-bold text-blue-600 font-mono">
                      {formatPrice(hotelMaxPrice, currency)}
                    </span>
                  </div>
                  <input
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
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>₹1,500</span>
                    <span>₹25,000+</span>
                  </div>

                  {/* Quick Price Buckets */}
                  <div className="mt-2.5 space-y-1.5">
                    {[
                      { id: 'all', label: 'All Budgets' },
                      { id: 'under-2500', label: 'Budget (Under ₹2,500)' },
                      { id: '2500-5000', label: 'Value (₹2,500 - ₹5,000)' },
                      { id: '5000-9000', label: 'Premium (₹5,000 - ₹9,000)' },
                      { id: '9000-15000', label: 'Luxury (₹9,000 - ₹15,000)' },
                      { id: 'above-15000', label: 'Ultra Luxury (₹15,000+)' },
                    ].map((bracket) => {
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
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Hotel Star Rating</span>
                  <div className="space-y-2">
                    {[
                      { star: 5, label: '5 Star (Luxury Resorts & Palaces)' },
                      { star: 4, label: '4 Star (Premium Stays)' },
                      { star: 3, label: '3 Star (Standard & Budget)' },
                    ].map(({ star, label }) => {
                      const checked = hotelStars.includes(star);
                      return (
                        <label key={star} className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900">
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
                          <span className="flex items-center gap-1 text-[11px]">
                            <span className="font-semibold">{star}</span>
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-slate-500 text-[10px]">{label.split('(')[1]?.replace(')', '')}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. User Review Rating */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Guest Review Rating</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { val: 0, label: 'Any Rating' },
                      { val: 4.0, label: '4.0+ Very Good' },
                      { val: 4.5, label: '4.5+ Excellent' },
                      { val: 4.8, label: '4.8+ Top Rated' },
                    ].map((item) => {
                      const isActive = hotelMinRating === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setHotelMinRating(item.val)}
                          className={`py-1.5 px-2 rounded-lg text-center border font-semibold text-[11px] transition-colors cursor-pointer ${
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


                {/* 7. Property Type */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Property Type</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Resort', 'Hotel', 'Villa', 'Heritage'].map((type) => {
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
                          className={`py-1.5 px-2 rounded-lg text-center border font-semibold text-[11px] transition-colors cursor-pointer ${
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

                {/* 8. Amenities & Freebies */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Amenities &amp; Freebies</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Free Breakfast', label: 'Free Breakfast Included' },
                      { id: 'Swimming Pool', label: 'Swimming Pool' },
                      { id: 'Free WiFi', label: 'Free High-Speed WiFi' },
                      { id: 'Couple Friendly', label: 'Couple Friendly (Unmarried Welcome)' },
                      { id: 'Beachfront / Sea View', label: 'Beachfront / Sea View' },
                      { id: 'Free Cancellation', label: 'Free Cancellation Available' },
                      { id: 'Pay at Hotel', label: 'Pay at Hotel (₹0 Prepayment)' },
                      { id: 'Spa & Wellness', label: 'Spa & Wellness Centre' },
                      { id: 'Airport Shuttle', label: 'Airport Transfer / Shuttle' },
                    ].map((amenity) => {
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
                          <span className="text-[11px]">{amenity.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --- BUSES FILTERS (redBus & MakeMyTrip Style Left Sidebar) --- */}
            {currentCategory === 'buses' && (
              <div className="space-y-4 text-xs">
                {/* 1. Quick Search Box */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5">Search Operators</span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={busSearchQuery}
                      onChange={(e) => setBusSearchQuery(e.target.value)}
                      placeholder="Search"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                    {busSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setBusSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Safety & Convenience Quick Toggles */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 block mb-1">Safety &amp; Convenience</span>

                  {/* Live GPS Tracking */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 cursor-pointer select-none text-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={busLiveTrackingOnly}
                        onChange={() => setBusLiveTrackingOnly(!busLiveTrackingOnly)}
                        className="w-4 h-4 rounded border-emerald-300 text-emerald-600 cursor-pointer accent-emerald-600"
                      />
                      <div>
                        <div className="font-bold text-xs text-emerald-950 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live GPS Bus Tracking</span>
                        </div>
                        <div className="text-[10px] text-emerald-700">Track real-time bus location &amp; ETA</div>
                      </div>
                    </div>
                  </label>

                  {/* Free Cancellation */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer select-none text-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={busFreeCancellationOnly}
                        onChange={() => setBusFreeCancellationOnly(!busFreeCancellationOnly)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">Free Cancellation / Refund</div>
                        <div className="text-[10px] text-slate-500">100% instant refund up to 6 hrs before</div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* 4. Departure Time Slots (4 Grid Blocks) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Departure from {currentFromCity.city}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '12am-6am', label: 'Early Morning', hours: 'Before 6 AM', icon: Sunrise },
                      { id: '6am-12pm', label: 'Morning', hours: '6 AM - 12 PM', icon: Sun },
                      { id: '12pm-6pm', label: 'Afternoon', hours: '12 PM - 6 PM', icon: Sunset },
                      { id: '6pm-12am', label: 'Evening/Night', hours: 'After 6 PM', icon: Moon },
                    ].map((slot) => {
                      const active = busDepSlots.includes(slot.id);
                      const IconComponent = slot.icon;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() =>
                            setBusDepSlots((prev) =>
                              active ? prev.filter((s) => s !== slot.id) : [...prev, slot.id]
                            )
                          }
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[68px] ${
                            active
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs font-semibold'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <IconComponent
                              className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-500'}`}
                            />
                            {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                          </div>
                          <div>
                            <div className="font-bold text-[11px] leading-tight">{slot.label}</div>
                            <div className="text-[9px] text-slate-500 font-mono">{slot.hours}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Arrival Time Slots (4 Grid Blocks) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Arrival in {currentToCity.city}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '12am-6am', label: 'Early Morning', hours: 'Before 6 AM', icon: Sunrise },
                      { id: '6am-12pm', label: 'Morning', hours: '6 AM - 12 PM', icon: Sun },
                      { id: '12pm-6pm', label: 'Afternoon', hours: '12 PM - 6 PM', icon: Sunset },
                      { id: '6pm-12am', label: 'Evening/Night', hours: 'After 6 PM', icon: Moon },
                    ].map((slot) => {
                      const active = busArrSlots.includes(slot.id);
                      const IconComponent = slot.icon;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() =>
                            setBusArrSlots((prev) =>
                              active ? prev.filter((s) => s !== slot.id) : [...prev, slot.id]
                            )
                          }
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[68px] ${
                            active
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs font-semibold'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <IconComponent
                              className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-500'}`}
                            />
                            {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                          </div>
                          <div>
                            <div className="font-bold text-[11px] leading-tight">{slot.label}</div>
                            <div className="text-[9px] text-slate-500 font-mono">{slot.hours}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Price Range Slider & Quick Tiers */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                    <span>Max Fare Limit</span>
                    <span className="font-bold text-indigo-600 font-mono">
                      {formatPrice(busMaxPrice, currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={3000}
                    step={100}
                    value={busMaxPrice}
                    onChange={(e) => {
                      setBusMaxPrice(Number(e.target.value));
                      setBusPriceBracket('all');
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>₹1,000</span>
                    <span>₹3,000</span>
                  </div>

                  {/* Quick Price Tier Radio */}
                  <div className="mt-2.5 space-y-1.5">
                    {[
                      { id: 'all', label: 'All Bus Fares' },
                      { id: 'under-1500', label: 'Under ₹1,500' },
                      { id: '1500-2000', label: '₹1,500 - ₹2,000' },
                      { id: 'above-2000', label: '₹2,000 & Above' },
                    ].map((bracket) => {
                      const isSelected = busPriceBracket === bracket.id;
                      return (
                        <label
                          key={bracket.id}
                          className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <input
                            type="radio"
                            name="busPriceBracket"
                            checked={isSelected}
                            onChange={() => setBusPriceBracket(bracket.id)}
                            className="w-3.5 h-3.5 text-indigo-600 border-slate-300 focus:ring-0 cursor-pointer accent-indigo-600"
                          />
                          <span className={isSelected ? 'font-bold text-indigo-700' : ''}>
                            {bracket.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Bus Coach & Seat Types */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Bus Type / Coach</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'AC Sleeper', label: 'AC Sleeper (2+1)', badge: 'Comfort' },
                      { id: 'Volvo Multi-Axle', label: 'Volvo Multi-Axle / Scania', badge: 'Smooth' },
                      { id: 'Electric', label: 'Pure Electric SmartBus', badge: 'Zero Noise' },
                      { id: 'Semi-Sleeper', label: 'AC Semi-Sleeper / Recliner', badge: 'Value' },
                      { id: 'Non-AC Sleeper', label: 'Non-AC Sleeper', badge: 'Economy' },
                    ].map((coach) => {
                      const checked = busSelectedCategories.includes(coach.id);
                      return (
                        <label
                          key={coach.id}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setBusSelectedCategories((prev) =>
                                  checked ? prev.filter((item) => item !== coach.id) : [...prev, coach.id]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                            />
                            <span className="text-[11px] font-medium">{coach.label}</span>
                          </div>
                          <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {coach.badge}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Bus Operators */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Popular Bus Operators</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'IntrCity', name: 'IntrCity SmartBus', rating: '4.8★' },
                      { id: 'Zingbus', name: 'Zingbus Electric', rating: '4.9★' },
                      { id: 'VRL Travels', name: 'VRL Travels Executive', rating: '4.7★' },
                      { id: 'NueGo', name: 'NueGo Green Express', rating: '4.9★' },
                      { id: 'Kalyani', name: 'Kalyani Volvo', rating: '4.6★' },
                      { id: 'Orange Tours', name: 'Orange Tours & Travels', rating: '4.8★' },
                      { id: 'SRS Luxury', name: 'SRS Travels', rating: '4.3★' },
                    ].map((op) => {
                      const checked = busSelectedOperators.includes(op.id);
                      return (
                        <label
                          key={op.id}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setBusSelectedOperators((prev) =>
                                  checked ? prev.filter((item) => item !== op.id) : [...prev, op.id]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                            />
                            <span className="text-[11px]">{op.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                            {op.rating}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 11. Bus Amenities */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Amenities &amp; Facilities</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Live GPS Tracking', label: 'Live GPS Tracking' },
                      { id: 'Blankets & Linen', label: 'Blankets & Fresh Linen' },
                      { id: 'USB Charging Port', label: 'USB Charging Port / Plug' },
                      { id: 'Water Bottle', label: 'Complimentary Water Bottle' },
                      { id: 'Free Wi-Fi Hotspot', label: 'Free Wi-Fi Hotspot' },
                      { id: 'Emergency SOS', label: 'Emergency SOS Alarm' },
                      { id: 'Reading Light', label: 'Personal Reading Light' },
                    ].map((amenity) => {
                      const checked = busSelectedAmenities.includes(amenity.id);
                      return (
                        <label
                          key={amenity.id}
                          className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setBusSelectedAmenities((prev) =>
                                checked ? prev.filter((a) => a !== amenity.id) : [...prev, amenity.id]
                              )
                            }
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                          />
                          <span className="text-[11px]">{amenity.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 12. Operator Rating */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Customer Rating</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { val: 0, label: 'Any Rating' },
                      { val: 4.0, label: '4.0+ Very Good' },
                      { val: 4.5, label: '4.5+ Excellent' },
                      { val: 4.8, label: '4.8+ Top Rated' },
                    ].map((item) => {
                      const isActive = busMinRating === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setBusMinRating(item.val)}
                          className={`py-1.5 px-2 rounded-lg text-center border font-semibold text-[11px] transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --- CABS FILTERS --- */}
            {currentCategory === 'cabs' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                    <span>Max Cab Fare</span>
                    <span className="font-bold text-sky-600">{formatPrice(cabMaxPrice, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={3000}
                    max={13000}
                    step={500}
                    value={cabMaxPrice}
                    onChange={(e) => setCabMaxPrice(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Vehicle Type</span>
                  <div className="space-y-2">
                    {['Sedan', 'SUV', 'Prime Crysta', 'Tempo'].map((v) => {
                      const checked = cabSelectedCategories.includes(v);
                      return (
                        <label key={v} className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setCabSelectedCategories((prev) =>
                                checked ? prev.filter((c) => c !== v) : [...prev, v]
                              )
                            }
                            className="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer"
                          />
                          <span>{v === 'Prime Crysta' ? 'Prime SUV' : v}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --- HOLIDAYS FILTERS (MakeMyTrip Style Left Sidebar) --- */}
            {currentCategory === 'holidays' && (
              <div className="space-y-4 text-xs">
                {/* 1. Quick Search Box */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5">Search Package / City</span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={holidaySearchQuery}
                      onChange={(e) => setHolidaySearchQuery(e.target.value)}
                      placeholder="e.g. Goa, Honeymoon, Villa..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    {holidaySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setHolidaySearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Duration (in Nights) - MMT Photo 3 */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5">
                    <span>Duration (in Nights)</span>
                    <span className="text-blue-700 font-mono text-[11px] font-bold">
                      {holidayMinNights}N – {holidayMaxNights}N
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={7}
                    step={1}
                    value={holidayMaxNights}
                    onChange={(e) => setHolidayMaxNights(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>2N</span>
                    <span>7N</span>
                  </div>

                  {/* Quick Duration Filters */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {[
                      { label: 'All Nights', min: 2, max: 7 },
                      { label: '2N - 3N (Short)', min: 2, max: 3 },
                      { label: '4N - 5N (Popular)', min: 4, max: 5 },
                      { label: '6N - 7N (Long)', min: 6, max: 7 },
                    ].map((d) => {
                      const isActive = holidayMinNights === d.min && holidayMaxNights === d.max;
                      return (
                        <button
                          key={d.label}
                          type="button"
                          onClick={() => {
                            setHolidayMinNights(d.min);
                            setHolidayMaxNights(d.max);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-center border font-semibold text-[11px] transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Flights Toggle - MMT Photo 3 */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Flights</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setHolidayFlightOption(holidayFlightOption === 'with-flight' ? 'all' : 'with-flight')
                      }
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        holidayFlightOption === 'with-flight'
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-[11px]">With Flight</div>
                      <div className={`text-[10px] ${holidayFlightOption === 'with-flight' ? 'text-blue-100' : 'text-slate-400'}`}>
                        ({HOLIDAY_RESULTS.filter((p) => p.flightsIncluded).length})
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setHolidayFlightOption(holidayFlightOption === 'without-flight' ? 'all' : 'without-flight')
                      }
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        holidayFlightOption === 'without-flight'
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-[11px]">Without Flight</div>
                      <div className={`text-[10px] ${holidayFlightOption === 'without-flight' ? 'text-blue-100' : 'text-slate-400'}`}>
                        ({HOLIDAY_RESULTS.filter((p) => !p.flightsIncluded).length})
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Budget (per person) - MMT Photo 3 & Photo 1 */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5">
                    <span>Budget (per person)</span>
                    <span className="font-bold text-blue-700 font-mono">
                      {formatPrice(holidayMaxBudget, currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={7000}
                    max={60000}
                    step={2000}
                    value={holidayMaxBudget}
                    onChange={(e) => setHolidayMaxBudget(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>₹0</span>
                    <span>₹60,000+</span>
                  </div>

                  {/* Exact Budget Checkboxes from MMT Screenshot */}
                  <div className="mt-2.5 space-y-1.5">
                    {[
                      {
                        id: '<15000',
                        label: '< ₹15,000',
                        count: HOLIDAY_RESULTS.filter((p) => p.startingPricePerPersonInr < 15000).length,
                      },
                      {
                        id: '15000-25000',
                        label: '₹15,000 - ₹25,000',
                        count: HOLIDAY_RESULTS.filter(
                          (p) => p.startingPricePerPersonInr >= 15000 && p.startingPricePerPersonInr <= 25000
                        ).length,
                      },
                      {
                        id: '25000-35000',
                        label: '₹25,000 - ₹35,000',
                        count: HOLIDAY_RESULTS.filter(
                          (p) => p.startingPricePerPersonInr > 25000 && p.startingPricePerPersonInr <= 35000
                        ).length,
                      },
                      {
                        id: '>35000',
                        label: '> ₹35,000',
                        count: HOLIDAY_RESULTS.filter((p) => p.startingPricePerPersonInr > 35000).length,
                      },
                    ].map((bracket) => {
                      const checked = holidayBudgetBrackets.includes(bracket.id);
                      return (
                        <label
                          key={bracket.id}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setHolidayBudgetBrackets((prev) =>
                                  checked ? prev.filter((b) => b !== bracket.id) : [...prev, bracket.id]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                            />
                            <span className="text-[11px] font-medium">{bracket.label}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">({bracket.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Hotel Rating (4 Columns from MMT Photo 1) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Hotel Star Rating</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      {
                        cat: '<3★',
                        count: HOLIDAY_RESULTS.filter((p) => p.hotelCategory === '<3★').length,
                      },
                      {
                        cat: '3★',
                        count: HOLIDAY_RESULTS.filter((p) => p.hotelCategory === '3★').length,
                      },
                      {
                        cat: '4★',
                        count: HOLIDAY_RESULTS.filter((p) => p.hotelCategory === '4★').length,
                      },
                      {
                        cat: '5★',
                        count: HOLIDAY_RESULTS.filter((p) => p.hotelCategory === '5★').length,
                      },
                    ].map(({ cat, count }) => {
                      const active = holidayHotelCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setHolidayHotelCategories((prev) =>
                              active ? prev.filter((c) => c !== cat) : [...prev, cat]
                            )
                          }
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            active
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="font-extrabold text-xs">{cat}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">({count})</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Themes - MMT Photo 2 */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Themes</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Adventure', label: 'Adventure', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Adventure').length },
                      { id: 'Culture', label: 'Culture & Heritage', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Culture').length },
                      { id: 'Beach', label: 'Beach & Islands', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Beach').length },
                      { id: 'Honeymoon', label: 'Honeymoon', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Honeymoon').length },
                      { id: 'Group Tours', label: 'Group Tours', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Group Tours').length },
                      { id: 'Pilgrimage', label: 'Pilgrimage', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Pilgrimage').length },
                      { id: 'Wildlife', label: 'Wildlife', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Wildlife').length },
                      { id: 'Luxury', label: 'Luxury', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Luxury').length },
                      { id: 'Family', label: 'Family', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Family').length },
                    ].map((th) => {
                      const checked = holidaySelectedThemes.includes(th.id);
                      return (
                        <label
                          key={th.id}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setHolidaySelectedThemes((prev) =>
                                  checked ? prev.filter((item) => item !== th.id) : [...prev, th.id]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                            />
                            <span className="text-[11px] font-medium">{th.label}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">({th.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 9. Package Type - MMT Photo 2 */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Package Type</span>
                  <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={holidayCustomizableOnly}
                        onChange={() => setHolidayCustomizableOnly(!holidayCustomizableOnly)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                      />
                      <span className="text-[11px] font-medium">Customizable Packages</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({HOLIDAY_RESULTS.filter((p) => p.isCustomizable).length})
                    </span>
                  </label>
                </div>

                {/* 10. Premium Packages - MMT Photo 2 */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Premium Packages</span>
                  <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={holidayPremiumOnly}
                        onChange={() => setHolidayPremiumOnly(!holidayPremiumOnly)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                      />
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px] font-medium">Premium Packages</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({HOLIDAY_RESULTS.filter((p) => p.isPremiumPackage).length})
                    </span>
                  </label>
                </div>
              </div>
            )}
          </aside>

          {/* =================================================================
              RIGHT COLUMN: SORT BAR & LIVE RESULTS
          =================================================================== */}
          <main className="flex-1 min-w-0 w-full space-y-4">
            {/* Bus Specific Header: Cities Route & Horizontal Date Carousel with Left/Right Buttons */}
            {currentCategory === 'buses' && (
              <div className="space-y-3">
                {/* Cities Destination Header (e.g. New Delhi to Goa) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{currentFromCity.city}</span>
                    <span className="text-slate-400 font-normal text-base">to</span>
                    <span>{currentToCity.city}</span>
                  </h2>
                </div>

                {/* Horizontal Date Strip with Left and Right Scroll Buttons */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs flex items-center gap-2 overflow-hidden max-w-full">
                  <button
                    type="button"
                    onClick={() => scrollBusDates('left')}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    aria-label="Previous Dates"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div
                    ref={busDateStripRef}
                    className="flex items-center gap-2 overflow-x-auto overflow-y-hidden scroll-smooth py-1 px-1 flex-1 min-w-0 max-w-full custom-scrollbar"
                  >
                    {busDateCards.map((item) => {
                      const cleanDep = (currentDepDate || '').split('T')[0];
                      const isSelected = item.dateStr === cleanDep;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => {
                            setCurrentDepDate(item.dateStr);
                            setModDepDate(item.dateStr);
                            if (onChangeDepartureDate) onChangeDepartureDate(item.dateStr);
                          }}
                          className={`min-w-[76px] sm:min-w-[88px] py-2 px-3 rounded-xl border text-center transition-all cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/20'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {item.dayOfWeek}
                          </div>
                          <div className="font-extrabold text-xs sm:text-sm font-mono mt-0.5">
                            {item.displayDate}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollBusDates('right')}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    aria-label="Next Dates"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Holiday Specific Header: Single Unified Block with Background Slideshow (NO slide names or text, purely visual) */}
            {currentCategory === 'holidays' && (
              <div className="relative rounded-2xl border border-white/20 shadow-md overflow-hidden max-w-full">
                {/* Background Slideshow (Weekend, Holidays, Honeymoon) - Pure visual with NO slide names/labels */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                  {HOLIDAY_HERO_SLIDES.map((slideImg, idx) => (
                    <img
                      key={idx}
                      src={slideImg}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        idx === holidaySlideIndex ? 'opacity-100 scale-105 transition-all duration-[6000ms]' : 'opacity-0 scale-100'
                      }`}
                    />
                  ))}
                  {/* Subtle uniform scrim so the entire slideshow image is vividly visible without black darkening */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/35" />
                </div>

                {/* Foreground Content */}
                <div className="relative z-10 py-3 space-y-2.5">
                  {/* Top Row: Destination City */}
                  <div className="px-3.5 sm:px-4 flex items-center">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      {currentToCity.city}
                    </h2>
                  </div>

                  {/* Bottom Row: Theme / Category Filter Scroll (No background blur, sharp slideshow visibility, soft shadow on active) */}
                  <div
                    ref={holidayThemeStripRef}
                    className="flex items-center gap-2 overflow-x-auto overflow-y-hidden scroll-smooth py-1 px-3 sm:px-4 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {HOLIDAY_THEME_OPTIONS.map((item) => {
                      const isSelected = item.id === 'all'
                        ? holidaySelectedThemes.length === 0
                        : holidaySelectedThemes.includes(item.id);
                      const IconComponent = item.icon;
                      const count = item.id === 'all'
                        ? HOLIDAY_RESULTS.length
                        : HOLIDAY_RESULTS.filter((p) => p.theme === item.id).length;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            if (item.id === 'all') {
                              setHolidaySelectedThemes([]);
                            } else {
                              if (holidaySelectedThemes.length === 1 && holidaySelectedThemes[0] === item.id) {
                                setHolidaySelectedThemes([]);
                              } else {
                                setHolidaySelectedThemes([item.id]);
                              }
                            }
                          }}
                          className={`flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl border text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-white/30 border-white text-white font-bold ring-1 ring-inset ring-white/60'
                              : 'bg-black/20 hover:bg-black/30 border-white/20 hover:border-white/35 text-white/90 hover:text-white font-medium'
                          }`}
                        >
                          <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-white/80'}`} />
                          <span className="drop-shadow-xs">{item.label}</span>
                          {count > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                                isSelected ? 'bg-white/30 text-white' : 'bg-white/15 text-white/85'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MakeMyTrip Style Horizontal Quick Sort Bar (Flights, Trains, Hotels, Buses) */}
            {currentCategory !== 'holidays' && !isFlightRoundTrip && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                {currentCategory === 'buses' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base font-mono">
                      {processedBuses.length} Buses Found
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                    <span>Sort By:</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {currentCategory === 'buses' && (
                    <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sort by:</span>
                    </span>
                  )}
                  {[
                    { id: 'cheapest', label: 'Cheapest First' },
                    { id: 'fastest', label: currentCategory === 'hotels' ? 'Best Value' : 'Fastest Duration' },
                    { id: 'rating', label: 'Highest Rated' },
                    { id: 'departure', label: 'Earliest Departure' },
                  ].map((s) => {
                    const isSelected = sortBy === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSortBy(s.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===============================================================
                1. FLIGHT RESULTS LIST (ONE-WAY & ROUND-TRIP LAYOUTS)
            =============================================================== */}
            {currentCategory === 'flights' && (
              <div className="space-y-4">
                {FLIGHT_RESULTS.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                      <Plane className="w-8 h-8" />
                    </div>
                    <div className="max-w-xl mx-auto space-y-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Live Carrier Inventory Gateway
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                        No Live Flights Available for {currentFromCity.city} ({currentFromCity.code}) → {currentToCity.city} ({currentToCity.code})
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Live airline reservation and distribution partner feed is currently awaiting direct API connector integration. TripYeah strictly displays genuine airline inventory without mock or fabricated flights.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentCategory('hotels');
                          onChangeCategory?.('hotels');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Hotel className="w-4 h-4" />
                        <span>Explore Verified Stays in {currentToCity.city}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNotify('Flight Alerts Enabled', `We will notify you when real flight schedules for ${currentFromCity.code} → ${currentToCity.code} go live.`)}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Notify When Live
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                {/* Promo Code Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <BadgePercent className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">TripYeah Special Flight Deals</h3>
                      <p className="text-xs text-blue-100">Use code TRIPYEAH40 for up to 40% instant off on domestic flights</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-900 rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                  >
                    {codeCopied ? 'Code Copied!' : 'Apply TRIPYEAH40'}
                  </button>
                </div>

                {/* --- A. ROUND-TRIP FLIGHT SELECTION LAYOUT (MakeMyTrip Style) --- */}
                {isFlightRoundTrip ? (
                  <div className="space-y-4 pb-36 sm:pb-32">
                    {/* TWO-COLUMN SIDE-BY-SIDE SPLIT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ---------------------------------------------------------
                          COLUMN 1: DEPARTURE FLIGHTS
                      --------------------------------------------------------- */}
                      <div className="space-y-3">
                        {/* Outbound Column Header */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
                                Departure
                              </span>
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {currentFromCity.city} → {currentToCity.city}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {formatFriendlyDate(currentDepDate)}
                            </span>
                          </div>

                          {/* Quick Sort Popover */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-400 font-medium">{processedFlights.length} {t('search.flightsFound', 'Flights Found')}</span>
                            <div className="relative dropdown-field-container">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenOutboundSortDropdown((prev) => !prev);
                                  setOpenReturnSortDropdown(false);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                              >
                                <SlidersHorizontal className="w-3 h-3 text-blue-600" />
                                <span>{t('search.sortBy', 'Sort By')}:</span>
                                <span className="text-blue-700 capitalize font-extrabold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[10px]">
                                  {sortBy === 'cheapest' ? t('search.cheapest', 'Cheapest') : sortBy === 'fastest' ? t('search.fastest', 'Fastest') : 'Departure'}
                                </span>
                                <ChevronDown
                                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                                    openOutboundSortDropdown ? 'rotate-180 text-blue-600' : ''
                                  }`}
                                />
                              </button>

                              {openOutboundSortDropdown && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-modal-slide-up"
                                >
                                  {(['cheapest', 'fastest', 'departure'] as const).map((s) => {
                                    const isSelected = sortBy === s;
                                    return (
                                      <button
                                        key={s}
                                        type="button"
                                        onClick={() => {
                                          setSortBy(s);
                                          setOpenOutboundSortDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                                          isSelected
                                            ? 'bg-blue-50 text-blue-700 font-bold'
                                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                                        }`}
                                      >
                                        <span>
                                          {s === 'cheapest'
                                            ? 'Cheapest First'
                                            : s === 'fastest'
                                            ? 'Fastest Flight'
                                            : 'Earliest Departure'}
                                        </span>
                                        {isSelected && (
                                          <Check className="w-3.5 h-3.5 text-blue-600 stroke-[2.5] shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Outbound Flight Cards */}
                        <div className="space-y-2.5">
                          {processedFlights.map((fl) => {
                            const isSelected = selectedOutboundId === fl.id;
                            return (
                              <div
                                key={fl.id}
                                onClick={() => setSelectedOutboundId(fl.id)}
                                className={`bg-white rounded-2xl border p-3.5 transition-all cursor-pointer relative ${
                                  isSelected
                                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/25 shadow-sm'
                                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-7 h-7 rounded-lg ${fl.badgeBg} text-white font-black flex items-center justify-center text-xs shadow-2xs`}
                                    >
                                      {fl.badgeCode}
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                                        {fl.airline}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-medium text-sm sm:text-base text-slate-900 font-mono">
                                      {formatPrice(fl.priceInr, currency)}
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-medium">per adult</div>
                                  </div>
                                </div>

                                {/* Timings & Stops */}
                                <div className="pt-2.5 flex items-center justify-between gap-2">
                                  <div className="text-left">
                                    <div className="font-medium text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.depTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentFromCity.code}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500">{fl.duration}</span>
                                    <div className="w-16 sm:w-20 h-[2px] bg-slate-200 relative my-0.5 rounded-full" />
                                    <span className="text-[9px] font-bold text-emerald-600">{fl.stops}</span>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-medium text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.arrTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentToCity.code}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Luggage className="w-3 h-3 text-slate-400" />
                                    <span>{fl.baggage}</span>
                                  </span>
                                  {isSelected ? (
                                    <span className="text-blue-700 font-bold">Selected Outbound</span>
                                  ) : (
                                    <span className="text-emerald-600 font-medium">Free Meal</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ---------------------------------------------------------
                          COLUMN 2: RETURN FLIGHTS
                      --------------------------------------------------------- */}
                      <div className="space-y-3">
                        {/* Return Column Header */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
                                Return
                              </span>
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {currentToCity.city} → {currentFromCity.city}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {formatFriendlyDate(currentRetDate)}
                            </span>
                          </div>

                          {/* Quick Sort Popover */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-400 font-medium">
                              {processedReturnFlights.length} Flights Found
                            </span>
                            <div className="relative dropdown-field-container">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenReturnSortDropdown((prev) => !prev);
                                  setOpenOutboundSortDropdown(false);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                              >
                                <SlidersHorizontal className="w-3 h-3 text-indigo-600" />
                                <span>Sort By:</span>
                                <span className="text-indigo-700 capitalize font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 text-[10px]">
                                  {returnSortBy === 'cheapest' ? 'Cheapest' : returnSortBy === 'fastest' ? 'Fastest' : 'Departure'}
                                </span>
                                <ChevronDown
                                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                                    openReturnSortDropdown ? 'rotate-180 text-indigo-600' : ''
                                  }`}
                                />
                              </button>

                              {openReturnSortDropdown && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-modal-slide-up"
                                >
                                  {(['cheapest', 'fastest', 'departure'] as const).map((s) => {
                                    const isSelected = returnSortBy === s;
                                    return (
                                      <button
                                        key={s}
                                        type="button"
                                        onClick={() => {
                                          setReturnSortBy(s);
                                          setOpenReturnSortDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                                          isSelected
                                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                                        }`}
                                      >
                                        <span>
                                          {s === 'cheapest'
                                            ? 'Cheapest First'
                                            : s === 'fastest'
                                            ? 'Fastest Flight'
                                            : 'Earliest Departure'}
                                        </span>
                                        {isSelected && (
                                          <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5] shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Return Flight Cards */}
                        <div className="space-y-2.5">
                          {processedReturnFlights.map((fl) => {
                            const isSelected = selectedReturnId === fl.id;
                            return (
                              <div
                                key={fl.id}
                                onClick={() => setSelectedReturnId(fl.id)}
                                className={`bg-white rounded-2xl border p-3.5 transition-all cursor-pointer relative ${
                                  isSelected
                                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/25 shadow-sm'
                                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-7 h-7 rounded-lg ${fl.badgeBg} text-white font-black flex items-center justify-center text-xs shadow-2xs`}
                                    >
                                      {fl.badgeCode}
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                                        {fl.airline}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-medium text-sm sm:text-base text-slate-900 font-mono">
                                      {formatPrice(fl.priceInr, currency)}
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-medium">per adult</div>
                                  </div>
                                </div>

                                {/* Timings & Stops */}
                                <div className="pt-2.5 flex items-center justify-between gap-2">
                                  <div className="text-left">
                                    <div className="font-medium text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.depTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentToCity.code}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500">{fl.duration}</span>
                                    <div className="w-16 sm:w-20 h-[2px] bg-slate-200 relative my-0.5 rounded-full" />
                                    <span className="text-[9px] font-bold text-emerald-600">{fl.stops}</span>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-medium text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.arrTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentFromCity.code}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Luggage className="w-3 h-3 text-slate-400" />
                                    <span>{fl.baggage}</span>
                                  </span>
                                  {isSelected ? (
                                    <span className="text-indigo-700 font-bold">Selected Return</span>
                                  ) : (
                                    <span className="text-emerald-600 font-medium">Free Snack</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Inline Round-Trip Summary & Book Now Card */}
                    {selectedOutboundFlight && selectedReturnFlight && (
                      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/30">
                        <div className="space-y-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                              {currentTripType === 'dummy-flights' ? 'Verifiable PNR Itinerary' : 'Combo Saver Deal'}
                            </span>
                            <span className="text-xs text-slate-300 font-semibold">
                              {currentFromCity.code} ⇄ {currentToCity.code} ({currentTravellers} Traveller{currentTravellers > 1 ? 's' : ''})
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-slate-200">
                            {selectedOutboundFlight.airline} ({selectedOutboundFlight.depTime}) + {selectedReturnFlight.airline} ({selectedReturnFlight.depTime})
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
                          <div className="text-center sm:text-right">
                            <div className="text-[11px] text-blue-200 font-medium">Total Round-Trip Fare</div>
                            <div className="text-2xl font-medium text-amber-300 font-mono">
                              {formatPrice(totalRoundTripFare, currency)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setFlightForFareModal({
                                isRoundTrip: true,
                                outboundFlight: {
                                  id: selectedOutboundFlight.id,
                                  airline: selectedOutboundFlight.airline,
                                  flightNo: selectedOutboundFlight.flightNo,
                                  depTime: selectedOutboundFlight.depTime,
                                  arrTime: selectedOutboundFlight.arrTime,
                                  depTerminal: selectedOutboundFlight.depTerminal,
                                  arrTerminal: selectedOutboundFlight.arrTerminal,
                                  duration: selectedOutboundFlight.duration,
                                  priceInr: selectedOutboundFlight.priceInr,
                                  badgeBg: selectedOutboundFlight.badgeBg,
                                  badgeCode: selectedOutboundFlight.badgeCode,
                                  aircraft: selectedOutboundFlight.aircraft,
                                  fromCode: currentFromCity.code,
                                  toCode: currentToCity.code,
                                },
                                returnFlight: {
                                  id: selectedReturnFlight.id,
                                  airline: selectedReturnFlight.airline,
                                  flightNo: selectedReturnFlight.flightNo,
                                  depTime: selectedReturnFlight.depTime,
                                  arrTime: selectedReturnFlight.arrTime,
                                  depTerminal: selectedReturnFlight.depTerminal,
                                  arrTerminal: selectedReturnFlight.arrTerminal,
                                  duration: selectedReturnFlight.duration,
                                  priceInr: selectedReturnFlight.priceInr,
                                  badgeBg: selectedReturnFlight.badgeBg,
                                  badgeCode: selectedReturnFlight.badgeCode,
                                  aircraft: selectedReturnFlight.aircraft,
                                  fromCode: currentToCity.code,
                                  toCode: currentFromCity.code,
                                },
                                flight: {
                                  id: `${selectedOutboundFlight.id}-${selectedReturnFlight.id}`,
                                  airline: `${selectedOutboundFlight.airline} + ${selectedReturnFlight.airline}`,
                                  flightNo: `${selectedOutboundFlight.flightNo} + ${selectedReturnFlight.flightNo}`,
                                  depTime: `${selectedOutboundFlight.depTime} (Out) / ${selectedReturnFlight.depTime} (Ret)`,
                                  arrTime: `${selectedOutboundFlight.arrTime} / ${selectedReturnFlight.arrTime}`,
                                  duration: `Out: ${selectedOutboundFlight.duration} · Ret: ${selectedReturnFlight.duration}`,
                                  priceInr: Math.round(totalRoundTripFare / currentTravellers),
                                  badgeBg: selectedOutboundFlight.badgeBg,
                                  badgeCode: selectedOutboundFlight.badgeCode,
                                  aircraft: `${selectedOutboundFlight.aircraft} · ${selectedReturnFlight.aircraft}`,
                                  fromCode: currentFromCity.code,
                                  toCode: currentToCity.code,
                                },
                              })
                            }
                            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer transition-all hover:shadow-xl"
                          >
                            <span>Prices</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* --- B. ONE-WAY FLIGHT SELECTION LAYOUT --- */
                  <div className="space-y-3">
                    {processedFlights.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                        <Plane className="w-10 h-10 text-slate-400 mx-auto" />
                        <h4 className="font-bold text-base text-slate-800">No flights match the selected filters</h4>
                        <p className="text-xs text-slate-500">Try adjusting your price range or selected airlines.</p>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      processedFlights.map((fl) => (
                        <div
                          key={fl.id}
                          className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-[190px]">
                              <div
                                className={`w-10 h-10 rounded-xl ${fl.badgeBg} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                              >
                                {fl.badgeCode}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight">{fl.airline}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 sm:gap-8 flex-1 justify-center">
                              <div className="text-left">
                                <div className="font-medium text-slate-900 text-lg sm:text-xl font-mono">
                                  {fl.depTime}
                                </div>
                                <div className="text-xs font-semibold text-slate-700">{currentFromCity.code}</div>
                                <div className="text-[11px] text-slate-400">{fl.depTerminal}</div>
                              </div>

                              <div className="flex flex-col items-center">
                                <span className="text-[11px] text-slate-500 font-medium">{fl.duration}</span>
                                <div className="w-24 sm:w-32 h-[2px] bg-slate-300 rounded-full my-1" />
                                <span className="text-[10px] font-bold text-emerald-600">{fl.stops}</span>
                              </div>

                              <div className="text-right">
                                <div className="font-medium text-slate-900 text-lg sm:text-xl font-mono">
                                  {fl.arrTime}
                                </div>
                                <div className="text-xs font-semibold text-slate-700">{currentToCity.code}</div>
                                <div className="text-[11px] text-slate-400">{fl.arrTerminal}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                              <div className="text-right">
                                <div className="text-xl sm:text-2xl font-medium text-slate-900 font-mono">
                                  {formatPrice(fl.priceInr, currency)}
                                </div>
                                <div className="text-[11px] text-emerald-600 font-medium">Free Meal Included</div>
                                <div className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1 mt-0.5">
                                  <Luggage className="w-3 h-3 text-slate-400" />
                                  <span>{fl.baggage}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setFlightForFareModal({
                                    id: fl.id,
                                    airline: fl.airline,
                                    flightNo: fl.flightNo,
                                    depTime: fl.depTime,
                                    arrTime: fl.arrTime,
                                    depTerminal: fl.depTerminal,
                                    arrTerminal: fl.arrTerminal,
                                    duration: fl.duration,
                                    priceInr: fl.priceInr,
                                    badgeBg: fl.badgeBg,
                                    badgeCode: fl.badgeCode,
                                    aircraft: fl.aircraft,
                                    fromCode: currentFromCity.code,
                                    toCode: currentToCity.code,
                                  })
                                }
                                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 hover:shadow-lg"
                              >
                                <span>Prices</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                  </>
                )}
              </div>
            )}

            {/* ===============================================================
                2. TRAIN RESULTS LIST (TripYeah IRCTC Rail Experience)
            =============================================================== */}
            {currentCategory === 'trains' && (
              <div className="space-y-4">
                {/* Active Train Filters & Result Count Strip */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {processedTrains.length} Trains Found
                    </span>
                    <span className="text-xs text-slate-500">
                      between {currentFromCity.city} &amp; {currentToCity.city}
                    </span>
                  </div>

                  {/* Active Filters Quick Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {trainSearchQuery && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        "{trainSearchQuery}"
                        <button
                          type="button"
                          onClick={() => setTrainSearchQuery('')}
                          className="hover:text-emerald-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {trainACOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        AC Coaches
                        <button
                          type="button"
                          onClick={() => setTrainACOnly(false)}
                          className="hover:text-emerald-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {trainAvailableOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Confirmed Available
                        <button
                          type="button"
                          onClick={() => setTrainAvailableOnly(false)}
                          className="hover:text-emerald-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {trainFreeCancellationOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Free Cancellation
                        <button
                          type="button"
                          onClick={() => setTrainFreeCancellationOnly(false)}
                          className="hover:text-blue-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {trainTripGuaranteeOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        3X Guarantee
                        <button
                          type="button"
                          onClick={() => setTrainTripGuaranteeOnly(false)}
                          className="hover:text-purple-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {trainSelectedTypes.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => setTrainSelectedTypes((prev) => prev.filter((item) => item !== t))}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {trainSelectedClasses.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        Class {c}
                        <button
                          type="button"
                          onClick={() => setTrainSelectedClasses((prev) => prev.filter((item) => item !== c))}
                          className="hover:text-emerald-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {trainDepSlots.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {trainDepSlots.length} Dep Slots
                        <button
                          type="button"
                          onClick={() => setTrainDepSlots([])}
                          className="hover:text-amber-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {(trainSearchQuery ||
                      trainACOnly ||
                      trainAvailableOnly ||
                      trainFreeCancellationOnly ||
                      trainTripGuaranteeOnly ||
                      trainSelectedTypes.length > 0 ||
                      trainSelectedClasses.length > 0 ||
                      trainDepSlots.length > 0 ||
                      trainArrSlots.length > 0 ||
                      trainSelectedDepStations.length > 0 ||
                      trainSelectedArrStations.length > 0) && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 underline pl-1 cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Train Cards List */}
                {processedTrains.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                    <TrainFront className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-base text-slate-800">No trains match the selected filters</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try clearing some time slot filters or increasing your maximum fare limit on the left panel.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  processedTrains.map((train) => (
                    <div
                      key={train.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow group"
                    >
                      {/* Train Header Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                            #{train.trainNo}
                          </span>
                          <h4 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors">
                            {train.trainName}
                          </h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {train.trainType}
                          </span>

                          {train.freeCancellation && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              Free Cancellation
                            </span>
                          )}

                          {train.hasAlternateGuarantee && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              3X Trip Guarantee
                            </span>
                          )}
                        </div>

                        {/* Running Days */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="text-[11px] font-medium">Runs on:</span>
                          <div className="flex items-center gap-1 font-mono text-[10px] font-bold">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                              <span
                                key={i}
                                className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                  train.runningDays.includes(d)
                                    ? 'bg-emerald-600 text-white font-bold'
                                    : 'bg-slate-100 text-slate-300'
                                }`}
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Station, Timings & Duration Row */}
                      <div className="py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-left">
                          <div className="font-mono text-xl sm:text-2xl font-black text-slate-900">{train.depTime}</div>
                          <div className="text-xs font-bold text-slate-800">{train.depStation}</div>
                          <div className="text-[11px] font-mono text-emerald-700 font-semibold">{train.depCode} · Departs</div>
                        </div>

                        <div className="flex flex-col items-center flex-1 max-w-[200px] sm:max-w-[260px]">
                          <span className="text-xs text-slate-500 font-semibold">{train.duration}</span>
                          <div className="w-full h-[2px] bg-emerald-500/40 relative my-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute right-0 top-1/2 -translate-y-1/2 shadow-xs" />
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                            {train.onTimePercent}% On-Time Record
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-xl sm:text-2xl font-black text-slate-900">{train.arrTime}</div>
                          <div className="text-xs font-bold text-slate-800">{train.arrStation}</div>
                          <div className="text-[11px] font-mono text-emerald-700 font-semibold">{train.arrCode} · Arrives</div>
                        </div>
                      </div>

                      {/* Travel Classes & Live Seat Quota Grid */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Available Coaches &amp; {trainSelectedQuota} Rates:
                          </div>
                          <div className="text-[10px] text-slate-400">Tap class to book ticket</div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {train.classes.map((cls) => {
                            const isAvailable = cls.status === 'AVAILABLE';
                            const isRAC = cls.status === 'RAC';

                            return (
                              <div
                                key={cls.classCode}
                                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                                  isAvailable
                                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50'
                                    : isRAC
                                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-500'
                                    : 'bg-rose-50/30 border-rose-200 hover:border-rose-400'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                      {cls.classCode} · {cls.className.split(' ')[0]}
                                    </span>
                                    <span className="font-black text-slate-900 text-xs sm:text-sm font-mono">
                                      {formatPrice(cls.priceInr, currency)}
                                    </span>
                                  </div>

                                  <div className="mt-1.5 flex items-center justify-between">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono ${
                                        isAvailable
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                          : isRAC
                                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}
                                    >
                                      {cls.quotaLabel}
                                    </span>

                                    {cls.probability && (
                                      <span className="text-[10px] text-slate-500 font-medium">
                                        {cls.probability}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    onSelectFlightOrStayForCheckout({
                                      title: `${train.trainName} (${train.trainNo}) - Class ${cls.classCode}`,
                                      code: `${train.trainNo}-${cls.classCode}`,
                                      depTime: `${train.depTime} (${train.depCode})`,
                                      arrTime: `${train.arrTime} (${train.arrCode})`,
                                      duration: train.duration,
                                      priceInr: cls.priceInr,
                                      category: 'trains',
                                      trainName: train.trainName,
                                      trainNo: train.trainNo,
                                      trainClass: `${cls.classCode} (${cls.className})`,
                                      fromCity: `${train.depStation} (${train.depCode})`,
                                      toCity: `${train.arrStation} (${train.arrCode})`,
                                      seatNumbers: cls.quotaLabel || 'AVAILABLE-0042',
                                    })
                                  }
                                  className="mt-3 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                                >
                                  Book {cls.classCode}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===============================================================
                3. HOTEL RESULTS LIST (MakeMyTrip Style)
            =============================================================== */}
            {currentCategory === 'hotels' && (
              <div className="space-y-4">
                {/* Backpacker Hostels & Dorms Banner */}
                {onOpenHostelsPage && (
                  <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0">
                        🎒
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">Looking for Backpacker Hostels &amp; Social Dorms?</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900 uppercase">
                            The Hosteller · goSTOPS · Zostel
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Explore verified bunk beds starting ₹449 with 100+ Mbps Wi-Fi, cafes, female-only dorms &amp; community events.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenHostelsPage}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Explore Hostels Page</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Active Hotel Filters & Result Count Strip */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {processedHotels.length} Properties Found
                    </span>
                    <span className="text-xs text-slate-500">
                      in {currentToCity.city}
                    </span>
                  </div>

                  {/* Active Filters Quick Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {hotelSearchQuery && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        "{hotelSearchQuery}"
                        <button
                          type="button"
                          onClick={() => setHotelSearchQuery('')}
                          className="hover:text-blue-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {hotelTripYeahAssuredOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        Assured Stays
                        <button
                          type="button"
                          onClick={() => setHotelTripYeahAssuredOnly(false)}
                          className="hover:text-blue-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {hotelPriceBracket !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {hotelPriceBracket === 'under-2500' && 'Under ₹2,500'}
                        {hotelPriceBracket === '2500-5000' && '₹2,500 - ₹5,000'}
                        {hotelPriceBracket === '5000-9000' && '₹5,000 - ₹9,000'}
                        {hotelPriceBracket === '9000-15000' && '₹9,000 - ₹15,000'}
                        {hotelPriceBracket === 'above-15000' && '₹15,000+'}
                        <button
                          type="button"
                          onClick={() => setHotelPriceBracket('all')}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {hotelMinRating > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {hotelMinRating}+ Rating
                        <button
                          type="button"
                          onClick={() => setHotelMinRating(0)}
                          className="hover:text-emerald-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {hotelSelectedAmenities.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {hotelSelectedAmenities.length} Amenities
                        <button
                          type="button"
                          onClick={() => setHotelSelectedAmenities([])}
                          className="hover:text-indigo-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {(hotelSearchQuery ||
                      hotelTripYeahAssuredOnly ||
                      hotelPriceBracket !== 'all' ||
                      hotelMinRating > 0 ||
                      hotelSelectedAmenities.length > 0 ||
                      hotelSelectedLocalities.length > 0 ||
                      hotelSelectedPropertyTypes.length > 0) && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 underline pl-1 cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Hotel Cards List */}
                {isLoadingProperties ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <h4 className="font-bold text-base text-slate-800">Loading verified properties...</h4>
                    <p className="text-xs text-slate-500">Querying live database for {currentToCity.city} accommodations.</p>
                  </div>
                ) : processedHotels.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="max-w-xl mx-auto space-y-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {realHotels.length > 0 ? 'Filtered Out' : 'Verified Listings Only'}
                      </span>
                      <h4 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                        {realHotels.length > 0
                          ? `No properties match your active filters (${realHotels.length} verified available)`
                          : `No Verified Stays in ${currentToCity.city} Yet`}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {realHotels.length > 0
                          ? 'Try resetting your price bracket, star rating, or locality filters to view verified inventory.'
                          : `TripYeah only showcases 100% verified, owner-submitted and admin-approved properties in ${currentToCity.city}. No dummy or simulated listings are permitted.`}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      {realHotels.length > 0 ? (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                        >
                          Reset All Filters
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowListPropertyModal(true)}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-2"
                          >
                            <Building2 className="w-4 h-4" />
                            <span>+ List Your Property in {currentToCity.city}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentToCity(CITIES[1]);
                              onNotify('Showing Goa Stays', 'Switched destination to Goa to view verified properties.');
                            }}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Explore Goa Verified Stays
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  processedHotels.map((hotel) => {
                    const discountPercent = Math.round(
                      ((hotel.originalPriceInr - hotel.priceInr) / hotel.originalPriceInr) * 100
                    );

                    return (
                      <div
                        key={hotel.id}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row group"
                      >
                        {/* Image with Badges */}
                        <div
                          onClick={() => onSelectHotelForDetails?.(hotel)}
                          className="w-full md:w-80 h-56 md:h-auto relative shrink-0 overflow-hidden bg-slate-100 cursor-pointer"
                        >
                          <SafeImage
                            src={hotel.image}
                            alt={hotel.name}
                            fallbackTitle={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-xs shadow-xs">
                              {hotel.tag}
                            </span>
                            {hotel.isTripYeahAssured && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                                <ShieldCheck className="w-3 h-3" />
                                ASSURED
                              </span>
                            )}
                          </div>

                          {hotel.isCoupleFriendly && (
                            <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-purple-700 shadow-xs border border-purple-200">
                              Couple Friendly
                            </span>
                          )}
                        </div>

                        {/* Hotel Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                                  <div className="flex items-center">
                                    {Array.from({ length: hotel.stars }).map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-600">
                                    {hotel.stars}-Star {hotel.propertyType}
                                  </span>
                                </div>
                                <h3
                                  onClick={() => onSelectHotelForDetails?.(hotel)}
                                  className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                  {hotel.name}
                                </h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{hotel.location}</span>
                                </p>
                              </div>

                              {/* Rating Card */}
                              <div className="text-right shrink-0">
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-xs">
                                  <span>{hotel.rating}</span>
                                  <Star className="w-3 h-3 fill-current" />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                  {hotel.reviews} reviews
                                </div>
                              </div>
                            </div>

                            {/* Room Type & Highlights */}
                            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100/90">
                              <div className="text-xs font-bold text-slate-800">{hotel.roomType}</div>
                              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{hotel.perks}</span>
                              </div>
                            </div>

                            {/* Amenity Badges */}
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {hotel.amenities.slice(0, 4).map((am) => (
                                <span
                                  key={am}
                                  className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200"
                                >
                                  {am}
                                </span>
                              ))}
                              {hotel.amenities.length > 4 && (
                                <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
                                  +{hotel.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price & Booking Action */}
                          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 line-through font-mono">
                                  {formatPrice(hotel.originalPriceInr, currency)}
                                </span>
                                {discountPercent > 0 && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                                {formatPrice(hotel.priceInr, currency)}
                                <span className="text-xs font-normal text-slate-500 font-sans"> / night</span>
                              </div>
                              <div className="text-[10px] text-slate-400">+ ₹{Math.round(hotel.priceInr * 0.12)} taxes &amp; fees</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (onSelectHotelForDetails) {
                                  onSelectHotelForDetails(hotel);
                                } else {
                                  onSelectFlightOrStayForCheckout({
                                    title: hotel.name,
                                    code: hotel.id,
                                    depTime: 'Check-in: 02:00 PM',
                                    arrTime: 'Check-out: 11:00 AM',
                                    duration: '1 Night Stay',
                                    priceInr: hotel.priceInr,
                                    category: 'hotels',
                                    hotelName: hotel.name,
                                    hotelLocation: hotel.location,
                                    roomType: 'Deluxe Suite (King Bed / City View)',
                                  });
                                }
                              }}
                              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                            >
                              <span>Book Hotel &amp; View Rooms</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ===============================================================
                4. BUS RESULTS LIST (redBus & MakeMyTrip Style)
            =============================================================== */}
            {currentCategory === 'buses' && (
              <div className="space-y-4">
                {/* Active Bus Filter Chips */}
                {(busSearchQuery ||
                  busLiveTrackingOnly ||
                  busFreeCancellationOnly ||
                  busDepSlots.length > 0 ||
                  busSelectedCategories.length > 0 ||
                  busSelectedOperators.length > 0) && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Active Filters:
                      </span>
                    </div>

                    {/* Active Filter Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                    {busSearchQuery && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        "{busSearchQuery}"
                        <button
                          type="button"
                          onClick={() => setBusSearchQuery('')}
                          className="hover:text-indigo-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}


                    {busLiveTrackingOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live GPS Tracking
                        <button
                          type="button"
                          onClick={() => setBusLiveTrackingOnly(false)}
                          className="hover:text-emerald-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {busFreeCancellationOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Free Cancellation
                        <button
                          type="button"
                          onClick={() => setBusFreeCancellationOnly(false)}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {busDepSlots.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {busDepSlots.length} Dep Time{busDepSlots.length > 1 ? 's' : ''}
                        <button
                          type="button"
                          onClick={() => setBusDepSlots([])}
                          className="hover:text-amber-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {busSelectedCategories.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {busSelectedCategories.length} Coach Type{busSelectedCategories.length > 1 ? 's' : ''}
                        <button
                          type="button"
                          onClick={() => setBusSelectedCategories([])}
                          className="hover:text-purple-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {busSelectedOperators.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {busSelectedOperators.length} Operator{busSelectedOperators.length > 1 ? 's' : ''}
                        <button
                          type="button"
                          onClick={() => setBusSelectedOperators([])}
                          className="hover:text-blue-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {(busSearchQuery ||
                      busPrimoOnly ||
                      busSingleLadyOnly ||
                      busLiveTrackingOnly ||
                      busFreeCancellationOnly ||
                      busDepSlots.length > 0 ||
                      busArrSlots.length > 0 ||
                      busSelectedCategories.length > 0 ||
                      busSelectedOperators.length > 0 ||
                      busSelectedBoardingPoints.length > 0 ||
                      busSelectedDroppingPoints.length > 0 ||
                      busSelectedAmenities.length > 0 ||
                      busMinRating > 0 ||
                      busPriceBracket !== 'all') && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 underline pl-1 cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                )}

                {/* Bus Cards List */}
                {processedBuses.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                    <Bus className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-base text-slate-800">No buses match your filters</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try expanding your price range, clearing some boarding points, or removing coach type filters.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  processedBuses.map((bus) => {
                    const discountPercent = Math.round(
                      ((bus.originalPriceInr - bus.priceInr) / bus.originalPriceInr) * 100
                    );

                    return (
                      <div
                        key={bus.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                      >
                        {/* Bus Operator Header & Badges */}
                        <div className="flex flex-wrap items-start justify-between gap-2.5 pb-3 border-b border-slate-100">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-base">{bus.operator}</h4>
                              <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-2xs shrink-0">
                                <span>{bus.rating}</span>
                                <Star className="w-3 h-3 fill-current" />
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">{bus.busType}</div>
                          </div>

                          {/* Badges strip */}
                          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                            {bus.hasLiveTracking && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live Tracking
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Boarding, Duration, Dropping Times */}
                        <div className="py-4 flex items-center justify-between gap-3 sm:gap-6">
                          {/* Boarding */}
                          <div className="text-left min-w-0">
                            <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 leading-none">
                              {bus.depTime}
                            </div>
                            <div className="text-xs font-semibold text-slate-700 truncate max-w-[130px] sm:max-w-[180px] mt-1">
                              {bus.depPoint}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">Boarding Point</div>
                          </div>

                          {/* Duration & Berths */}
                          <div className="flex flex-col items-center shrink-0 px-2">
                            <span className="text-[11px] text-slate-500 font-semibold">{bus.duration}</span>
                            <div className="w-16 sm:w-28 md:w-36 h-[2px] bg-slate-300 relative my-1">
                              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 absolute right-0 top-1/2 -translate-y-1/2 shadow-xs" />
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                bus.seatsLeft <= 4 ? 'text-rose-600' : 'text-amber-600'
                              }`}
                            >
                              {bus.seatsLeft} berths left
                            </span>
                          </div>

                          {/* Dropping */}
                          <div className="text-right min-w-0">
                            <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 leading-none">
                              {bus.arrTime}
                            </div>
                            <div className="text-xs font-semibold text-slate-700 truncate max-w-[130px] sm:max-w-[180px] mt-1">
                              {bus.arrPoint}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">Dropping Point</div>
                          </div>
                        </div>

                        {/* Bottom Bar: Amenities on Left, Price and Select Seat Button on Right */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Amenities */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 min-w-0 flex-1">
                            <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider shrink-0 mr-1">
                              Amenities:
                            </span>
                            {bus.amenities.slice(0, 3).map((amenity) => (
                              <span
                                key={amenity}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/80 text-[10px] shrink-0"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                {amenity}
                              </span>
                            ))}
                            {bus.amenities.length > 3 && (
                              <span className="text-[10px] text-slate-400 shrink-0">
                                +{bus.amenities.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Price and Select Seat CTA */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                            <div className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-xs text-slate-400 line-through font-mono">
                                  {formatPrice(bus.originalPriceInr, currency)}
                                </span>
                                {discountPercent > 0 && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono leading-none mt-0.5">
                                {formatPrice(bus.priceInr, currency)}
                              </div>
                              <div className="text-[10px] text-slate-400">All taxes included</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setExpandedBusId(expandedBusId === bus.id ? null : bus.id)}
                              className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap ${
                                expandedBusId === bus.id
                                  ? 'bg-slate-900 text-white shadow-slate-900/20'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                              }`}
                            >
                              {expandedBusId === bus.id ? 'Hide Seats' : 'Select Seat'}
                            </button>
                          </div>
                        </div>

                        {/* Inline Double-Floor Seat Layout & Pick/Drop Point Selector */}
                        {expandedBusId === bus.id && (
                          <BusSeatLayoutSelector
                            bus={bus}
                            currency={currency}
                            onProceedToBooking={({
                              bus: selectedBus,
                              selectedSeatNumbers,
                              totalPriceInr,
                              boardingPoint,
                              droppingPoint,
                            }) => {
                              onSelectFlightOrStayForCheckout({
                                title: `${selectedBus.operator} (${selectedBus.busType})`,
                                code: selectedBus.id,
                                depTime: `${selectedBus.depTime} (${boardingPoint.split(' (')[0]})`,
                                arrTime: `${selectedBus.arrTime} (${droppingPoint.split(' (')[0]})`,
                                duration: selectedBus.duration,
                                priceInr: Math.round(totalPriceInr / selectedSeatNumbers.length),
                                category: 'buses',
                                busOperator: selectedBus.operator,
                                busType: selectedBus.busType,
                                seatNumbers: selectedSeatNumbers.join(', '),
                                busBoardingPoint: boardingPoint,
                                busDroppingPoint: droppingPoint,
                                travellers: selectedSeatNumbers.length,
                                fromCity: boardingPoint.split(' (')[0],
                                toCity: droppingPoint.split(' (')[0],
                              });
                            }}
                            onClose={() => setExpandedBusId(null)}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ===============================================================
                5. CABS RESULTS LIST
            =============================================================== */}
            {currentCategory === 'cabs' && (
              <div className="space-y-4">
                {/* Google Maps Grounded Route & Pickup/Drop Banner */}
                <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Car className="w-5 h-5 text-sky-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base">All-Inclusive Chauffeur Cabs</h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                            <MapPin className="w-2.5 h-2.5" /> Maps Grounded
                          </span>
                        </div>
                        <p className="text-xs text-sky-200">
                          Tolls, state taxes &amp; driver allowance included · Zero hidden surge
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveCabModal('pickup')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer border border-white/10"
                      >
                        Change Pickup
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveCabModal('drop')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer border border-white/10"
                      >
                        Change Drop
                      </button>
                    </div>
                  </div>

                  {/* Route Visualizer Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div
                      onClick={() => setActiveCabModal('pickup')}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                          Pickup Location (From)
                        </span>
                        {activeCabPickupMapsUrl && (
                          <a
                            href={activeCabPickupMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-sky-300 hover:text-white underline font-medium"
                          >
                            View on Maps ↗
                          </a>
                        )}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-white truncate mt-1" title={activeCabPickup}>
                        {activeCabPickup}
                      </div>
                      <div className="text-[10px] text-sky-200/80 mt-0.5">Click to search verified landmarks</div>
                    </div>

                    <div
                      onClick={() => setActiveCabModal('drop')}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                          Drop Location (To)
                        </span>
                        {activeCabDropMapsUrl && (
                          <a
                            href={activeCabDropMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-indigo-300 hover:text-white underline font-medium"
                          >
                            View on Maps ↗
                          </a>
                        )}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-white truncate mt-1" title={activeCabDrop}>
                        {activeCabDrop}
                      </div>
                      <div className="text-[10px] text-indigo-200/80 mt-0.5">Click to search destination drop</div>
                    </div>
                  </div>
                </div>

                {processedCabs.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                    <Car className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-base text-slate-800">No cabs match your filters</h4>
                    <p className="text-xs text-slate-500">Adjust the vehicle categories or pricing slider.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {processedCabs.map((cab) => (
                      <div
                        key={cab.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                {cab.tag}
                              </span>
                              <h4 className="font-bold text-slate-900 text-lg mt-1.5">{cab.cabType}</h4>
                              <p className="text-[11px] text-slate-500">{cab.modelExamples}</p>
                            </div>

                            <div className="text-right">
                              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                <Star className="w-3 h-3 fill-current text-emerald-600" />
                                <span>{cab.driverRating}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{cab.driverTrips} trips</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 py-3 my-2 border-y border-slate-100 text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-medium">
                              <Users className="w-3.5 h-3.5 text-slate-400" /> {cab.seats} Seats
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Luggage className="w-3.5 h-3.5 text-slate-400" /> {cab.bags} Bags
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Zap className="w-3.5 h-3.5 text-emerald-600" /> AC Included
                            </span>
                          </div>

                          <ul className="space-y-1.5 text-xs text-slate-600 my-2">
                            {cab.perks.map((p, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-black text-slate-900 font-mono">
                              {formatPrice(cab.priceInr, currency)}
                            </div>
                            <div className="text-[10px] text-slate-400">Includes {cab.includedKm} km · ₹{cab.perKmRate}/km extra</div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onSelectFlightOrStayForCheckout({
                                title: cab.cabType,
                                code: cab.id,
                                depTime: 'Pickup: As Scheduled',
                                arrTime: 'Doorstep Drop',
                                duration: `${cab.includedKm} km Included`,
                                priceInr: cab.priceInr,
                                category: 'cabs',
                                cabType: cab.cabType,
                                cabPickupPoint: activeCabPickup,
                                cabDropPoint: activeCabDrop,
                                cabPickupMapsUrl: activeCabPickupMapsUrl,
                                cabDropMapsUrl: activeCabDropMapsUrl,
                                fromCity: activeCabPickup,
                                toCity: activeCabDrop,
                                travelDate: currentDepDate,
                              })
                            }
                            className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 cursor-pointer transition-all active:scale-95"
                          >
                            Book Cab
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===============================================================
                6. HOLIDAY RESULTS LIST (MakeMyTrip Style)
            =============================================================== */}
            {currentCategory === 'holidays' && (
              <div className="space-y-4">
                {/* Dedicated Slim Sort Bar for Holiday Packages */}
                <div className="bg-white rounded-xl border border-slate-200/80 px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sort By:</span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5 max-w-full">
                    {[
                      { id: 'cheapest', label: 'Cheapest First' },
                      { id: 'fastest', label: 'Best Value' },
                      { id: 'rating', label: 'Highest Rated' },
                      { id: 'departure', label: 'Popular' },
                    ].map((s) => {
                      const isSelected = sortBy === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSortBy(s.id as any)}
                          className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Holiday Filter Chips (Only shown when filters are active) */}
                {(holidaySearchQuery ||
                  holidayFlightOption !== 'all' ||
                  holidayMinNights > 2 ||
                  holidayMaxNights < 7 ||
                  holidayBudgetBrackets.length > 0 ||
                  holidayHotelCategories.length > 0 ||
                  holidaySelectedThemes.length > 0 ||
                  holidayCustomizableOnly ||
                  holidayPremiumOnly) && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                        <span>Active Filters:</span>
                      </span>

                      {holidaySearchQuery && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          "{holidaySearchQuery}"
                          <button
                            type="button"
                            onClick={() => setHolidaySearchQuery('')}
                            className="hover:text-blue-900 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {holidayFlightOption !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          {holidayFlightOption === 'with-flight' ? 'Flights Included' : 'Without Flights'}
                          <button
                            type="button"
                            onClick={() => setHolidayFlightOption('all')}
                            className="hover:text-blue-950 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {(holidayMinNights > 2 || holidayMaxNights < 7) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {holidayMinNights}N – {holidayMaxNights}N
                          <button
                            type="button"
                            onClick={() => {
                              setHolidayMinNights(2);
                              setHolidayMaxNights(7);
                            }}
                            className="hover:text-indigo-900 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {holidayBudgetBrackets.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700"
                        >
                          {b === '<15000' && '< ₹15,000'}
                          {b === '15000-25000' && '₹15,000 - ₹25,000'}
                          {b === '25000-35000' && '₹25,000 - ₹35,000'}
                          {b === '>35000' && '> ₹35,000'}
                          <button
                            type="button"
                            onClick={() =>
                              setHolidayBudgetBrackets((prev) => prev.filter((item) => item !== b))
                            }
                            className="hover:text-slate-900 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {holidayHotelCategories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          {cat} Hotel
                          <button
                            type="button"
                            onClick={() =>
                              setHolidayHotelCategories((prev) => prev.filter((c) => c !== cat))
                            }
                            className="hover:text-amber-950 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {holidaySelectedThemes.map((th) => (
                        <span
                          key={th}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-200"
                        >
                          {th}
                          <button
                            type="button"
                            onClick={() =>
                              setHolidaySelectedThemes((prev) => prev.filter((t) => t !== th))
                            }
                            className="hover:text-pink-900 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {holidayCustomizableOnly && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Customizable
                          <button
                            type="button"
                            onClick={() => setHolidayCustomizableOnly(false)}
                            className="hover:text-emerald-950 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {holidayPremiumOnly && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          Premium Packages
                          <button
                            type="button"
                            onClick={() => setHolidayPremiumOnly(false)}
                            className="hover:text-blue-950 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 underline pl-1 cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}

                {/* Holiday Cards List */}
                {processedHolidays.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                    <Palmtree className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-base text-slate-800">No holiday packages match the filters</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try selecting different nights, clearing some budget brackets, or checking without flights.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  processedHolidays.map((pkg) => {
                    const isExpanded = expandedHolidayId === pkg.id;
                    const discountPercent = Math.round(
                      ((pkg.originalPriceInr - pkg.startingPricePerPersonInr) / pkg.originalPriceInr) * 100
                    );

                    return (
                      <div
                        key={pkg.id}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow group"
                      >
                        <div className="flex flex-col lg:flex-row">
                          {/* Image with Deal Tags */}
                          <div className="w-full lg:w-80 h-56 lg:h-auto relative shrink-0 overflow-hidden bg-slate-100">
                            <SafeImage
                              src={pkg.image}
                              alt={pkg.title}
                              fallbackTitle={pkg.destination}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                              {pkg.dealTag && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/85 text-white backdrop-blur-xs shadow-xs">
                                  {pkg.dealTag}
                                </span>
                              )}
                              {pkg.bookAtOneRupee && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                                  Book @ ₹1
                                </span>
                              )}
                            </div>

                            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-xs border border-slate-200">
                              {pkg.durationNights}
                            </span>
                          </div>

                          {/* Content Details */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                      {pkg.theme}
                                    </span>
                                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                      {pkg.hotelCategory} Hotel Stay
                                    </span>
                                    {pkg.flightsIncluded ? (
                                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                                        <Plane className="w-3 h-3" />
                                        Flights Included
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                        Land Only (No Flights)
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                                    {pkg.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                    Stay: {pkg.hotelStayTitle}
                                  </p>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                                    <span>{pkg.rating}</span>
                                    <Star className="w-3 h-3 fill-current" />
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{pkg.reviewsCount} reviews</div>
                                </div>
                              </div>

                              {/* Inclusions Chips */}
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {pkg.inclusions.map((inc, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg"
                                  >
                                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                    {inc}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => setExpandedHolidayId(isExpanded ? null : pkg.id)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                              >
                                <span>{isExpanded ? 'Hide Day-by-Day Itinerary' : 'View Day-by-Day Plan'}</span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </button>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <span className="text-xs text-slate-400 line-through font-mono">
                                      {formatPrice(pkg.originalPriceInr, currency)}
                                    </span>
                                    {discountPercent > 0 && (
                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                        {discountPercent}% OFF
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                                    {formatPrice(pkg.startingPricePerPersonInr, currency)}
                                    <span className="text-xs font-normal text-slate-500 font-sans"> / person</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onSelectHolidayForCheckout) {
                                      onSelectHolidayForCheckout(pkg);
                                    } else {
                                      onSelectFlightOrStayForCheckout({
                                        title: pkg.title,
                                        code: pkg.id,
                                        depTime: pkg.flightsIncluded ? 'Return Flights + Hotel' : 'Hotel + Sightseeing',
                                        arrTime: `${pkg.durationNights} (${pkg.destination})`,
                                        duration: pkg.durationNights,
                                        priceInr: pkg.startingPricePerPersonInr,
                                        category: 'holidays',
                                        holidayTheme: pkg.theme,
                                      });
                                    }
                                  }}
                                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-95"
                                >
                                  Book Package
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Itinerary */}
                        {isExpanded && (
                          <div className="p-5 bg-slate-50 border-t border-slate-200/80 space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                              Complete Day-by-Day Trip Itinerary:
                            </h4>
                            <div className="space-y-3">
                              {pkg.itinerary.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-3 bg-white p-3 rounded-xl border border-slate-200/80"
                                >
                                  <span className="font-bold text-xs font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded shrink-0 self-start">
                                    {item.day}
                                  </span>
                                  <div>
                                    <div className="font-bold text-xs text-slate-900">{item.title}</div>
                                    <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                      {item.desc}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Sticky Bottom Booking Bar for Round-Trip Flight Selection (MakeMyTrip Style) */}
      {currentCategory === 'flights' && isFlightRoundTrip && selectedOutboundFlight && selectedReturnFlight && FLIGHT_RESULTS.length > 0 && (
        <aside
          aria-label="Selected Round-Trip Booking Summary"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-3 px-3 sm:px-6 animate-in slide-in-from-bottom duration-300"
        >
          <div className="w-full px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Outbound & Return Selected Details */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 flex-1">
              {/* Outbound Flight Pill */}
              <div className="flex items-center gap-2 sm:gap-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl p-2 sm:px-3 sm:py-2 flex-1 min-w-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${selectedOutboundFlight.badgeBg} text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-2xs`}
                >
                  {selectedOutboundFlight.badgeCode}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider truncate">
                      Departure · {currentFromCity.code} → {currentToCity.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 hidden sm:inline">
                      {formatPrice(selectedOutboundFlight.priceInr, currency)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedOutboundFlight.airline}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 font-mono">
                    {selectedOutboundFlight.depTime} → {selectedOutboundFlight.arrTime}{' '}
                    <span className="text-slate-400">({selectedOutboundFlight.duration})</span>
                  </div>
                </div>
              </div>

              {/* Arrow divider */}
              <div className="hidden sm:flex text-slate-400 shrink-0">
                <ArrowLeftRight className="w-4 h-4 text-blue-500" />
              </div>

              {/* Return Flight Pill */}
              <div className="flex items-center gap-2 sm:gap-2.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-2 sm:px-3 sm:py-2 flex-1 min-w-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${selectedReturnFlight.badgeBg} text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-2xs`}
                >
                  {selectedReturnFlight.badgeCode}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider truncate">
                      Return · {currentToCity.code} → {currentFromCity.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 hidden sm:inline">
                      {formatPrice(selectedReturnFlight.priceInr, currency)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedReturnFlight.airline}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 font-mono">
                    {selectedReturnFlight.depTime} → {selectedReturnFlight.arrTime}{' '}
                    <span className="text-slate-400">({selectedReturnFlight.duration})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Price & Book Now CTA Button */}
            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {currentTripType === 'dummy-flights' ? 'Dummy Round-Trip Ticket' : 'Total Round-Trip Fare'}
                </div>
                <div className="text-xl sm:text-2xl font-medium text-slate-900 font-mono leading-tight">
                  {formatPrice(totalRoundTripFare, currency)}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold hidden sm:block">
                  Combo Deal Applied · {currentTravellers} Traveller{currentTravellers > 1 ? 's' : ''}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFlightForFareModal({
                    isRoundTrip: true,
                    outboundFlight: {
                      id: selectedOutboundFlight.id,
                      airline: selectedOutboundFlight.airline,
                      flightNo: selectedOutboundFlight.flightNo,
                      depTime: selectedOutboundFlight.depTime,
                      arrTime: selectedOutboundFlight.arrTime,
                      depTerminal: selectedOutboundFlight.depTerminal,
                      arrTerminal: selectedOutboundFlight.arrTerminal,
                      duration: selectedOutboundFlight.duration,
                      priceInr: selectedOutboundFlight.priceInr,
                      badgeBg: selectedOutboundFlight.badgeBg,
                      badgeCode: selectedOutboundFlight.badgeCode,
                      aircraft: selectedOutboundFlight.aircraft,
                      fromCode: currentFromCity.code,
                      toCode: currentToCity.code,
                    },
                    returnFlight: {
                      id: selectedReturnFlight.id,
                      airline: selectedReturnFlight.airline,
                      flightNo: selectedReturnFlight.flightNo,
                      depTime: selectedReturnFlight.depTime,
                      arrTime: selectedReturnFlight.arrTime,
                      depTerminal: selectedReturnFlight.depTerminal,
                      arrTerminal: selectedReturnFlight.arrTerminal,
                      duration: selectedReturnFlight.duration,
                      priceInr: selectedReturnFlight.priceInr,
                      badgeBg: selectedReturnFlight.badgeBg,
                      badgeCode: selectedReturnFlight.badgeCode,
                      aircraft: selectedReturnFlight.aircraft,
                      fromCode: currentToCity.code,
                      toCode: currentFromCity.code,
                    },
                    flight: {
                      id: `${selectedOutboundFlight.id}-${selectedReturnFlight.id}`,
                      airline: `${selectedOutboundFlight.airline} + ${selectedReturnFlight.airline}`,
                      flightNo: `${selectedOutboundFlight.flightNo} + ${selectedReturnFlight.flightNo}`,
                      depTime: `${selectedOutboundFlight.depTime} (Out) / ${selectedReturnFlight.depTime} (Ret)`,
                      arrTime: `${selectedOutboundFlight.arrTime} / ${selectedReturnFlight.arrTime}`,
                      duration: `Out: ${selectedOutboundFlight.duration} · Ret: ${selectedReturnFlight.duration}`,
                      priceInr: Math.round(totalRoundTripFare / currentTravellers),
                      badgeBg: selectedOutboundFlight.badgeBg,
                      badgeCode: selectedOutboundFlight.badgeCode,
                      aircraft: `${selectedOutboundFlight.aircraft} · ${selectedReturnFlight.aircraft}`,
                      fromCode: currentFromCity.code,
                      toCode: currentToCity.code,
                    },
                  })
                }
                className="px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-black text-xs sm:text-base shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all hover:shadow-xl group"
              >
                <span>Prices</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Flight Fare Options (Saver, Flexi Plus, Corporate, SpiceMax) Modal */}
      {flightForFareModal && (
        <FlightFareOptionsModal
          flight={flightForFareModal.outboundFlight || flightForFareModal.flight || flightForFareModal}
          returnFlight={flightForFareModal.returnFlight}
          isRoundTrip={Boolean(flightForFareModal.isRoundTrip && flightForFareModal.returnFlight)}
          currency={currency}
          travellers={currentTravellers}
          onSelectFareAndProceed={(fareTier, finalPriceInr, roundTripFares) => {
            const isRT = Boolean(flightForFareModal.isRoundTrip && flightForFareModal.returnFlight && roundTripFares);
            const outFlight = flightForFareModal.outboundFlight || flightForFareModal.flight || flightForFareModal;
            const retFlight = flightForFareModal.returnFlight;

            if (isRT && retFlight && roundTripFares) {
              onSelectFlightOrStayForCheckout({
                title: `${outFlight.airline} (${roundTripFares.outboundTier.name.split('/')[0].trim()}) + ${retFlight.airline} (${roundTripFares.returnTier.name.split('/')[0].trim()})`,
                code: `${outFlight.id}-${retFlight.id}`,
                depTime: `${outFlight.depTime} (Out) / ${retFlight.depTime} (Ret)`,
                arrTime: `${outFlight.arrTime} / ${retFlight.arrTime}`,
                duration: `Out: ${outFlight.duration} · Ret: ${retFlight.duration}`,
                priceInr: finalPriceInr,
                category: 'flights',
                airline: `${outFlight.airline} + ${retFlight.airline}`,
                flightNo: `${outFlight.flightNo} + ${retFlight.flightNo}`,
                cabinClass: currentCabinClass || 'Economy',
                roomType: `Out: ${roundTripFares.outboundTier.name.split('/')[0].trim()} · Ret: ${roundTripFares.returnTier.name.split('/')[0].trim()}`,
                fromCity: `${currentFromCity.city} (${currentFromCity.code})`,
                toCity: `${currentToCity.city} (${currentToCity.code})`,
                travellers: currentTravellers,
                isRoundTrip: true,
                outboundFlight: outFlight,
                returnFlight: retFlight,
                outboundTierName: roundTripFares.outboundTier.name.split('/')[0].trim(),
                returnTierName: roundTripFares.returnTier.name.split('/')[0].trim(),
              });
            } else {
              const singleFlight = flightForFareModal.flight || flightForFareModal;
              onSelectFlightOrStayForCheckout({
                title: `${singleFlight.airline} ${singleFlight.flightNo} (${fareTier.name})`,
                code: singleFlight.id,
                depTime: singleFlight.depTime,
                arrTime: singleFlight.arrTime,
                duration: singleFlight.duration,
                priceInr: finalPriceInr,
                category: 'flights',
                airline: singleFlight.airline,
                flightNo: singleFlight.flightNo,
                cabinClass: currentCabinClass || 'Economy',
                roomType: fareTier.name,
                fromCity: `${currentFromCity.city} (${currentFromCity.code})`,
                toCity: `${currentToCity.city} (${currentToCity.code})`,
                travellers: currentTravellers,
                isRoundTrip: false,
              });
            }
            setFlightForFareModal(null);
          }}
          onClose={() => setFlightForFareModal(null)}
        />
      )}

      {/* Interactive TripYeah Live Fare & Availability Calendar Modal */}
      {calendarTarget && (
        <TripDatePickerModal
          selectedDateStr={calendarTarget === 'dep' ? (modDepDate || currentDepDate) : (modRetDate || currentRetDate)}
          title={calendarTarget === 'dep' ? 'Select Departure / Journey Date' : 'Select Return / Check-out Date'}
          subtitle="Choose travel date with live lowest fares & seat availability"
          minDateStr="2026-10-15"
          onSelectDate={(_formatted, iso) => {
            if (calendarTarget === 'dep') {
              setModDepDate(iso);
              setCurrentDepDate(iso);
              onChangeDepartureDate?.(iso);
            } else {
              setModRetDate(iso);
              setCurrentRetDate(iso);
              onChangeReturnDate?.(iso);
            }
            setCalendarTarget(null);
          }}
          onClose={() => setCalendarTarget(null)}
        />
      )}

      {/* Cab Pickup / Drop Google Maps Grounded Modal */}
      {activeCabModal && (
        <CabLocationAutocompleteModal
          isOpen={true}
          onClose={() => setActiveCabModal(null)}
          mode={activeCabModal}
          initialQuery={activeCabModal === 'pickup' ? activeCabPickup : activeCabDrop}
          cityContext={activeCabModal === 'pickup' ? currentFromCity.city : currentToCity.city}
          onSelectPlace={handleSelectCabLocation}
        />
      )}
    </div>
  );
};
