export type BookingCategory = 'flights' | 'trains' | 'hotels' | 'buses' | 'cabs' | 'holidays' | 'experiences';
export type TripType = 'one-way' | 'round-trip' | 'dummy-flights';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'AED' | 'GBP' | 'SGD' | 'CAD';

export * from './experiencesData';

export interface CityOption {
  city: string;
  code: string;
  stationCode: string;
  country: string;
  airportName: string;
  popularTag: string;
}

export interface DestinationPlace {
  id: string;
  name: string;
  country: string;
  subtitle: string; // e.g. "Beaches · Nature · Culture"
  image: string;
  cityCode: string;
  startingFareInr: number;
  flightTime: string;
  bestSeason: string;
  visaPolicy: string;
  description: string;
  highlights: string[];
  itineraryPreview: {
    day: string;
    title: string;
    detail: string;
  }[];
}

export interface PromoOffer {
  id: string;
  category: BookingCategory;
  label: string;
  subLabel: string;
  discountHeadline: string;
  code: string;
  discountPercent: number;
  maxDiscountInr: number;
  description: string;
  validUntil: string;
}

export interface SearchListing {
  id: string;
  category: BookingCategory;
  providerName: string;
  providerCode: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stopsLabel: string;
  basePriceInr: number;
  features: string; // unboxed dot-separated metadata e.g. "Free Meal · 15kg Check-in · Refundable"
  seatsLeft: number;
  rating?: string;
}

export interface BookedTrip {
  bookingId: string;
  category: BookingCategory;
  title: string;
  routeSummary: string;
  dateSummary: string;
  travellers: number;
  cabinOrRoom: string;
  totalPaidInr: number;
  promoApplied?: string;
  studentFareApplied: boolean;
  status: 'Confirmed';
  bookedAt: string;
}

import heroMultimodal from '../assets/images/hero_multimodal_panorama_1790782919071.jpg';
import heroSantorini from '../assets/images/hero_santorini_couple_1790778151559.jpg';
import heroAlpine from '../assets/images/hero_alpine_lakeside_1790774682097.jpg';
import bali from '../assets/images/dest_bali_temple_1790774699717.jpg';
import dubai from '../assets/images/dest_dubai_skyline_1790774713819.jpg';
import singapore from '../assets/images/dest_singapore_bay_1790774729082.jpg';
import bangkok from '../assets/images/dest_bangkok_temple_1790774744899.jpg';
import paris from '../assets/images/dest_paris_eiffel_1790774759266.jpg';
import mountainTraveler from '../assets/images/banner_mountain_traveler_1790774776035.jpg';

export const ASSETS = {
  heroMultimodal,
  heroSantorini,
  heroAlpine,
  bali,
  dubai,
  singapore,
  bangkok,
  paris,
  mountainTraveler,
};

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'AED (د.إ)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'GBP (£)' },
  SGD: { symbol: 'S$', rate: 0.016, label: 'SGD (S$)' },
  CAD: { symbol: 'C$', rate: 0.0165, label: 'CAD (C$)' },
};

export function formatPrice(amountInr: number, currency: CurrencyCode): string {
  const { symbol, rate } = CURRENCY_RATES[currency];
  const converted = Math.round(amountInr * rate);
  return `${symbol}${converted.toLocaleString('en-IN')}`;
}

export const CITIES: CityOption[] = [
  {
    city: 'New Delhi',
    code: 'DEL',
    stationCode: 'NDLS',
    country: 'India',
    airportName: 'Indira Gandhi International Airport',
    popularTag: 'Capital Hub',
  },
  {
    city: 'Goa',
    code: 'GOI',
    stationCode: 'MAO',
    country: 'India',
    airportName: 'Dabolim / Mopa International Airport',
    popularTag: 'Beach Escape',
  },
  {
    city: 'Mumbai',
    code: 'BOM',
    stationCode: 'CSMT',
    country: 'India',
    airportName: 'Chhatrapati Shivaji Maharaj Intl',
    popularTag: 'Financial Hub',
  },
  {
    city: 'Bengaluru',
    code: 'BLR',
    stationCode: 'SBC',
    country: 'India',
    airportName: 'Kempegowda International Airport',
    popularTag: 'Garden City',
  },
  {
    city: 'Bali',
    code: 'DPS',
    stationCode: 'DPS',
    country: 'Indonesia',
    airportName: 'Ngurah Rai International Airport',
    popularTag: 'Island Paradise',
  },
  {
    city: 'Dubai',
    code: 'DXB',
    stationCode: 'DXB',
    country: 'United Arab Emirates',
    airportName: 'Dubai International Airport',
    popularTag: 'Luxury & Skyline',
  },
  {
    city: 'Singapore',
    code: 'SIN',
    stationCode: 'SIN',
    country: 'Singapore',
    airportName: 'Changi International Airport',
    popularTag: 'Garden Metropolis',
  },
  {
    city: 'Bangkok',
    code: 'BKK',
    stationCode: 'BKK',
    country: 'Thailand',
    airportName: 'Suvarnabhumi International Airport',
    popularTag: 'Street Food & Temples',
  },
  {
    city: 'Paris',
    code: 'CDG',
    stationCode: 'FRPNO',
    country: 'France',
    airportName: 'Charles de Gaulle Airport',
    popularTag: 'Art & Romance',
  },
  {
    city: 'Tokyo',
    code: 'HND',
    stationCode: 'TYO',
    country: 'Japan',
    airportName: 'Haneda / Narita International Airport',
    popularTag: 'Culture & Modernity',
  },
  {
    city: 'Zurich',
    code: 'ZRH',
    stationCode: 'ZRH',
    country: 'Switzerland',
    airportName: 'Zurich Airport',
    popularTag: 'Alps & Lakes',
  },
  {
    city: 'London',
    code: 'LHR',
    stationCode: 'KGX',
    country: 'United Kingdom',
    airportName: 'London Heathrow Airport',
    popularTag: 'Royalty & Heritage',
  },
  {
    city: 'New York',
    code: 'JFK',
    stationCode: 'NYP',
    country: 'United States',
    airportName: 'John F. Kennedy International',
    popularTag: 'Skyline & Broadway',
  },
  {
    city: 'Rome',
    code: 'FCO',
    stationCode: 'ROM',
    country: 'Italy',
    airportName: 'Leonardo da Vinci–Fiumicino',
    popularTag: 'Colosseum & History',
  },
  {
    city: 'Hanoi',
    code: 'HAN',
    stationCode: 'HAN',
    country: 'Vietnam',
    airportName: 'Noi Bai International Airport',
    popularTag: 'Old Quarter & Bays',
  },
  {
    city: 'Sydney',
    code: 'SYD',
    stationCode: 'SYD',
    country: 'Australia',
    airportName: 'Sydney Kingsford Smith Airport',
    popularTag: 'Harbour & Beaches',
  },
  {
    city: 'Maldives',
    code: 'MLE',
    stationCode: 'MLE',
    country: 'Maldives',
    airportName: 'Velana International Airport',
    popularTag: 'Overwater Luxury',
  },
  {
    city: 'Jaipur',
    code: 'JAI',
    stationCode: 'JP',
    country: 'India',
    airportName: 'Jaipur International Airport',
    popularTag: 'Royal Heritage',
  },
];

export const TOP_DESTINATIONS: DestinationPlace[] = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    subtitle: 'Beaches · Nature · Culture',
    image: ASSETS.bali,
    cityCode: 'DPS',
    startingFareInr: 24990,
    flightTime: '6h 50m via SIN',
    bestSeason: 'April – October',
    visaPolicy: 'Visa on Arrival',
    description:
      'Sacred water temples perched on volcanic crater lakes, emerald rice terraces in Ubud, and golden surf breaks along Uluwatu.',
    highlights: [
      'Pura Ulun Danu Bratan lake temple sunrise tour',
      'Tegallalang rice terrace & jungle swing experience',
      'Nusa Penida West Coast speed-boat excursion',
      'Private beachfront villa stay in Seminyak',
    ],
    itineraryPreview: [
      { day: 'Day 01', title: 'Arrival in Denpasar & Uluwatu Sunset', detail: 'Airport chauffeur pickup · Cliffside Kecak fire dance' },
      { day: 'Day 02', title: 'Ubud Sacred Forests & Waterfalls', detail: 'Tegenungan waterfall · Artisan silver village · Rice terraces' },
      { day: 'Day 03', title: 'Bedugul Crater Lake & Tanah Lot', detail: 'Ulun Danu Bratan shrine · Coastal sunset dinner' },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    subtitle: 'Shopping · Luxury · Adventure',
    image: ASSETS.dubai,
    cityCode: 'DXB',
    startingFareInr: 18490,
    flightTime: '3h 40m Non-stop',
    bestSeason: 'November – March',
    visaPolicy: '48-Hr Express E-Visa',
    description:
      'Soaring futuristic architecture, twilight desert dune adventures, and world-class waterfront dining along Downtown Dubai and the Marina.',
    highlights: [
      'Burj Khalifa 124th & 125th Floor Sunset Observation',
      'Lahbab Red Dunes 4x4 Desert Safari & BBQ camp',
      'Dubai Marina luxury dhow cruise with live music',
      'Museum of the Future & Dubai Mall Aquarium pass',
    ],
    itineraryPreview: [
      { day: 'Day 01', title: 'Downtown Skyline & Fountain Show', detail: 'VIP airport transfer · Burj Khalifa At The Top · Souk Al Bahar' },
      { day: 'Day 02', title: 'Arabian Desert Dunes & Starlight Camp', detail: 'Red dune bashing · Camel trek · Bedouin dinner' },
      { day: 'Day 03', title: 'Palm Jumeirah & Marina Yacht Cruise', detail: 'The View at The Palm · Evening yacht deck dining' },
    ],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    subtitle: 'City Life · Food · Entertainment',
    image: ASSETS.singapore,
    cityCode: 'SIN',
    startingFareInr: 21800,
    flightTime: '5h 30m Non-stop',
    bestSeason: 'Year-Round',
    visaPolicy: 'Digital E-Visa Included',
    description:
      'Where lush biodomes meet iconic bayfront engineering, Michelin-starred street hawker stalls, and island resorts on Sentosa.',
    highlights: [
      'Marina Bay Sands SkyPark & Spectra Light Water Show',
      'Gardens by the Bay Cloud Forest & Supertree Grove',
      'Sentosa Island cable car & Universal Studios pass',
      'Lau Pa Sat & Maxwell Road nocturnal food trail',
    ],
    itineraryPreview: [
      { day: 'Day 01', title: 'Marina Bay & Supertree Rhapsody', detail: 'Changi Jewel Rain Vortex · Gardens by the Bay evening walk' },
      { day: 'Day 02', title: 'Sentosa Island & Coastal Cable Car', detail: 'Mount Faber aerial ride · Siloso Beach · S.E.A. Aquarium' },
      { day: 'Day 03', title: 'Heritage Quarters & Night Safari', detail: 'Chinatown & Kampong Gelam · Mandai Night Safari tram' },
    ],
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    subtitle: 'Nightlife · Temples · Food',
    image: ASSETS.bangkok,
    cityCode: 'BKK',
    startingFareInr: 15200,
    flightTime: '4h 10m Non-stop',
    bestSeason: 'November – February',
    visaPolicy: 'Visa-Free Entry',
    description:
      'Gilded royal spires along the Chao Phraya river, bustling riverside night markets, and rooftop lounges overlooking a vibrant metropolis.',
    highlights: [
      'Grand Palace & Temple of the Emerald Buddha guided walk',
      'Wat Arun & Wat Pho reclining Buddha river crossing',
      'Chao Phraya luxury evening river dinner cruise',
      'Yaowarat Chinatown street food & Mahanakhon SkyWalk',
    ],
    itineraryPreview: [
      { day: 'Day 01', title: 'Chao Phraya River & Asiatique Nightfront', detail: 'Fast-track arrival · Longtail canal boat · Sunset cruise' },
      { day: 'Day 02', title: 'Royal Grand Palace & Golden Temples', detail: 'Wat Phra Kaew · Wat Pho · Rooftop twilight mocktails' },
      { day: 'Day 03', title: 'Floating Markets & Siam Shopping District', detail: 'Damnoen Saduak morning boat · IconSiam riverfront' },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    subtitle: 'Art · History · Romance',
    image: ASSETS.paris,
    cityCode: 'CDG',
    startingFareInr: 52900,
    flightTime: '9h 05m Non-stop',
    bestSeason: 'April – October',
    visaPolicy: 'Schengen Visa Assistance',
    description:
      'Golden hour along the Seine, timeless Haussmann boulevards, world-renowned art collections at the Louvre, and candlelit bistro terraces.',
    highlights: [
      'Eiffel Tower 2nd Floor & Summit skip-the-line access',
      'Louvre Museum & Musée d’Orsay curated art pass',
      'Bateaux Parisiens glass-canopy Seine river cruise',
      'Montmartre & Sacré-Cœur artisan quarter walking tour',
    ],
    itineraryPreview: [
      { day: 'Day 01', title: 'Champ de Mars & Illuminated Seine Cruise', detail: 'CDG private transfer · Trocadéro promenade · River boat' },
      { day: 'Day 02', title: 'Louvre Masterpieces & Le Marais Cafés', detail: 'Guided gallery morning · Tuileries Garden · Patisserie tasting' },
      { day: 'Day 03', title: 'Versailles Palace & Montmartre Sunset', detail: 'Hall of Mirrors & gardens · Artist square evening dinner' },
    ],
  },
];

export const PROMO_OFFERS: PromoOffer[] = [
  {
    id: 'offer-flights',
    category: 'flights',
    label: 'Flights',
    subLabel: 'Up to',
    discountHeadline: '40% OFF',
    code: 'TRIPYEAH40',
    discountPercent: 20,
    maxDiscountInr: 4500,
    description: 'Instant fare reduction on domestic and international round-trip & one-way flight bookings.',
    validUntil: 'Valid through 31 Oct 2026',
  },
  {
    id: 'offer-hotels',
    category: 'hotels',
    label: 'Hotels',
    subLabel: 'Up to',
    discountHeadline: '60% OFF',
    code: 'STAY60',
    discountPercent: 30,
    maxDiscountInr: 8000,
    description: 'Curated luxury resorts, boutique villas, and business stays worldwide with complimentary breakfast.',
    validUntil: 'Valid through 31 Oct 2026',
  },
  {
    id: 'offer-holidays',
    category: 'holidays',
    label: 'Holidays',
    subLabel: 'Up to',
    discountHeadline: '50% OFF',
    code: 'HOLIDAY50',
    discountPercent: 25,
    maxDiscountInr: 12500,
    description: 'All-inclusive flight + hotel + private transfer holiday bundles for families and couples.',
    validUntil: 'Valid through 31 Oct 2026',
  },
  {
    id: 'offer-experiences',
    category: 'experiences',
    label: 'Experiences',
    subLabel: 'Up to',
    discountHeadline: '35% OFF',
    code: 'EXPLORE35',
    discountPercent: 20,
    maxDiscountInr: 3500,
    description: 'Instant savings on theme park passes, desert safaris, scuba diving, and top city tours.',
    validUntil: 'Valid through 31 Oct 2026',
  },
];

export const PLATFORM_SERVICES: {
  id: BookingCategory;
  title: string;
  subtitle: string;
  image: string;
  accentColor: string;
}[] = [
  {
    id: 'flights',
    title: 'Book Flights',
    subtitle: 'Domestic & International',
    image: ASSETS.dubai,
    accentColor: 'from-sky-500 to-blue-600',
  },
  {
    id: 'trains',
    title: 'Book Trains',
    subtitle: 'IRCTC & Partner Trains',
    image: ASSETS.heroAlpine,
    accentColor: 'from-indigo-500 to-violet-600',
  },
  {
    id: 'hotels',
    title: 'Hotels',
    subtitle: 'Best stays worldwide',
    image: ASSETS.singapore,
    accentColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'holidays',
    title: 'Holiday Packages',
    subtitle: 'Curated experiences',
    image: ASSETS.bali,
    accentColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'experiences',
    title: 'Tours & Experiences',
    subtitle: 'Theme parks & activities',
    image: ASSETS.paris,
    accentColor: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'cabs',
    title: 'Cabs & Transfers',
    subtitle: 'Airport & City rides',
    image: ASSETS.mountainTraveler,
    accentColor: 'from-blue-600 to-indigo-700',
  },
];

export function buildListingsForSearch(
  category: BookingCategory,
  fromCity: CityOption,
  toCity: CityOption
): SearchListing[] {
  const isInternational = fromCity.country !== toCity.country;
  const baseMultiplier = isInternational ? 3.4 : 1;

  if (category === 'flights') {
    return [
      {
        id: `fl-1-${fromCity.code}-${toCity.code}`,
        category: 'flights',
        providerName: 'IndiGo',
        providerCode: '6E-2041',
        fromCity: fromCity.city,
        fromCode: fromCity.code,
        toCity: toCity.city,
        toCode: toCity.code,
        departureTime: '06:15',
        arrivalTime: isInternational ? '11:45' : '08:50',
        duration: isInternational ? '5h 30m' : '2h 35m',
        stopsLabel: 'Non-stop',
        basePriceInr: Math.round(4890 * baseMultiplier),
        features: '15kg Check-in · 7kg Cabin · Zero Date-Change Fee',
        seatsLeft: 4,
      },
      {
        id: `fl-2-${fromCity.code}-${toCity.code}`,
        category: 'flights',
        providerName: 'Air India',
        providerCode: 'AI-865',
        fromCity: fromCity.city,
        fromCode: fromCity.code,
        toCity: toCity.city,
        toCode: toCity.code,
        departureTime: '10:30',
        arrivalTime: isInternational ? '16:10' : '13:05',
        duration: isInternational ? '5h 40m' : '2h 35m',
        stopsLabel: 'Non-stop',
        basePriceInr: Math.round(5450 * baseMultiplier),
        features: 'Hot Meal Included · 25kg Check-in · Free Seat Selection',
        seatsLeft: 7,
      },
      {
        id: `fl-3-${fromCity.code}-${toCity.code}`,
        category: 'flights',
        providerName: 'Vistara / Air India Express',
        providerCode: 'UK-943',
        fromCity: fromCity.city,
        fromCode: fromCity.code,
        toCity: toCity.city,
        toCode: toCity.code,
        departureTime: '17:45',
        arrivalTime: isInternational ? '23:20' : '20:15',
        duration: isInternational ? '5h 35m' : '2h 30m',
        stopsLabel: 'Non-stop',
        basePriceInr: Math.round(6190 * baseMultiplier),
        features: 'Complimentary Gourmet Dining · Priority Boarding · Partially Refundable',
        seatsLeft: 3,
      },
      {
        id: `fl-4-${fromCity.code}-${toCity.code}`,
        category: 'flights',
        providerName: 'Akasa Air',
        providerCode: 'QP-1382',
        fromCity: fromCity.city,
        fromCode: fromCity.code,
        toCity: toCity.city,
        toCode: toCity.code,
        departureTime: '21:10',
        arrivalTime: isInternational ? '02:55' : '23:40',
        duration: isInternational ? '5h 45m' : '2h 30m',
        stopsLabel: 'Non-stop',
        basePriceInr: Math.round(4590 * baseMultiplier),
        features: 'USB In-Seat Power · 15kg Check-in · Instant Refund Protect',
        seatsLeft: 9,
      },
    ];
  }

  if (category === 'trains') {
    return [
      {
        id: `tr-1-${fromCity.stationCode}-${toCity.stationCode}`,
        category: 'trains',
        providerName: 'Vande Bharat Express',
        providerCode: '22436',
        fromCity: fromCity.city,
        fromCode: fromCity.stationCode,
        toCity: toCity.city,
        toCode: toCity.stationCode,
        departureTime: '06:00',
        arrivalTime: '14:15',
        duration: '8h 15m',
        stopsLabel: 'AC Chair Car (CC)',
        basePriceInr: 1850,
        features: 'IRCTC Authorised · Onboard Catering Included · Automatic Doors',
        seatsLeft: 18,
      },
      {
        id: `tr-2-${fromCity.stationCode}-${toCity.stationCode}`,
        category: 'trains',
        providerName: 'Rajdhani Tejas Express',
        providerCode: '12952',
        fromCity: fromCity.city,
        fromCode: fromCity.stationCode,
        toCity: toCity.city,
        toCode: toCity.stationCode,
        departureTime: '16:55',
        arrivalTime: '08:35',
        duration: '15h 40m',
        stopsLabel: 'AC 2-Tier (2A)',
        basePriceInr: 2940,
        features: 'Confirmed Berth Guarantee · Linen & Meals Included · Zero PNR Fee',
        seatsLeft: 6,
      },
      {
        id: `tr-3-${fromCity.stationCode}-${toCity.stationCode}`,
        category: 'trains',
        providerName: 'Duronto Superfast',
        providerCode: '12264',
        fromCity: fromCity.city,
        fromCode: fromCity.stationCode,
        toCity: toCity.city,
        toCode: toCity.stationCode,
        departureTime: '22:10',
        arrivalTime: '12:40',
        duration: '14h 30m',
        stopsLabel: 'First AC (1A)',
        basePriceInr: 4480,
        features: 'Private Lockable Cabin · Chef-Prepared Meals · Priority Refund',
        seatsLeft: 2,
      },
    ];
  }

  if (category === 'hotels') {
    return [
      {
        id: `ht-1-${toCity.code}`,
        category: 'hotels',
        providerName: `Grand Hyatt ${toCity.city} Resort & Spa`,
        providerCode: '5-Star Luxury',
        fromCity: toCity.city,
        fromCode: toCity.code,
        toCity: 'Waterfront District',
        toCode: 'Check-out 12:00',
        departureTime: 'Check-in 14:00',
        arrivalTime: 'Check-out 12:00',
        duration: 'Per Night',
        stopsLabel: 'Lagoon View King Suite',
        basePriceInr: Math.round(9200 * (isInternational ? 1.6 : 1)),
        features: 'Breakfast Buffet Included · Free Cancellation · Infinity Pool & Spa',
        seatsLeft: 3,
        rating: '4.9 / 5',
      },
      {
        id: `ht-2-${toCity.code}`,
        category: 'hotels',
        providerName: `Taj Exotica & Heritage Villas ${toCity.city}`,
        providerCode: '5-Star Premier',
        fromCity: toCity.city,
        fromCode: toCity.code,
        toCity: 'Coastal Promenade',
        toCode: 'Check-out 11:00',
        departureTime: 'Check-in 14:00',
        arrivalTime: 'Check-out 11:00',
        duration: 'Per Night',
        stopsLabel: 'Deluxe Garden Pavilion',
        basePriceInr: Math.round(12400 * (isInternational ? 1.5 : 1)),
        features: 'Airport Chauffeur Pickup · Complimentary High Tea · Pay at Hotel',
        seatsLeft: 2,
        rating: '4.95 / 5',
      },
      {
        id: `ht-3-${toCity.code}`,
        category: 'hotels',
        providerName: `The Postcard Boutique Stay ${toCity.city}`,
        providerCode: '4-Star Boutique',
        fromCity: toCity.city,
        fromCode: toCity.code,
        toCity: 'Central Quarter',
        toCode: 'Check-out 12:00',
        departureTime: 'Check-in 13:00',
        arrivalTime: 'Check-out 12:00',
        duration: 'Per Night',
        stopsLabel: 'Terrace Studio Room',
        basePriceInr: Math.round(5800 * (isInternational ? 1.4 : 1)),
        features: 'Anytime Breakfast · High-Speed Wi-Fi · Zero Cancellation Penalty',
        seatsLeft: 5,
        rating: '4.8 / 5',
      },
    ];
  }

  if (category === 'buses') {
    return [
      {
        id: `bs-1-${fromCity.code}-${toCity.code}`,
        category: 'buses',
        providerName: 'Zingbus Plus Volvo 9600 Multi-Axle',
        providerCode: 'A/C Sleeper (2+1)',
        fromCity: fromCity.city,
        fromCode: fromCity.code,
        toCity: toCity.city,
        toCode: toCity.code,
        departureTime: '21:30',
        arrivalTime: '07:15',
        duration: '9h 45m',
        stopsLabel: 'Single Berth Available',
        basePriceInr: 1390,
        features: 'Live GPS Tracking · Fresh Sanitized Blanket · Lounge Boarding',
        seatsLeft: 8,
      },
      {
        id: `bs-2-${fromCity.code}-${toCity.code}`,
        category: 'buses',
        providerName: 'IntrCity SmartBus Scania Lounge',
        providerCode: 'Executive Sleeper',
        fromCity: fromCity.city,
        fromCode: fromCity.code,
        toCity: toCity.city,
        toCode: toCity.code,
        departureTime: '22:45',
        arrivalTime: '08:10',
        duration: '9h 25m',
        stopsLabel: 'Onboard Washroom',
        basePriceInr: 1580,
        features: 'Trained Bus Captain · Snacks & Water · Instant Refund',
        seatsLeft: 5,
      },
    ];
  }

  if (category === 'cabs') {
    return [
      {
        id: `cb-1-${fromCity.code}-${toCity.code}`,
        category: 'cabs',
        providerName: 'Toyota Innova Hycross Chauffeur',
        providerCode: '6-Seater SUV',
        fromCity: `${fromCity.city} Airport (${fromCity.code})`,
        fromCode: fromCity.code,
        toCity: `${toCity.city} Hotel / City Center`,
        toCode: toCity.code,
        departureTime: 'Flexible Pickup',
        arrivalTime: 'Door-to-Door',
        duration: 'All Tolls Included',
        stopsLabel: 'Flight Delay Protection',
        basePriceInr: 2490,
        features: 'Verified Chauffeur · 45 Min Free Airport Waiting · Zero Surge',
        seatsLeft: 4,
      },
      {
        id: `cb-2-${fromCity.code}-${toCity.code}`,
        category: 'cabs',
        providerName: 'Honda City / Hyundai Verna Executive',
        providerCode: '4-Seater Sedan',
        fromCity: `${fromCity.city} Airport (${fromCity.code})`,
        fromCode: fromCity.code,
        toCity: `${toCity.city} Hotel / City Center`,
        toCode: toCity.code,
        departureTime: 'Flexible Pickup',
        arrivalTime: 'Door-to-Door',
        duration: 'All Tolls Included',
        stopsLabel: 'Meet & Greet Placard',
        basePriceInr: 1650,
        features: '100% Electric / Clean Fuel · Bottled Water · Free Cancellation 1h Prior',
        seatsLeft: 6,
      },
    ];
  }

  // Holidays
  return [
    {
      id: `hl-1-${toCity.code}`,
      category: 'holidays',
      providerName: `4N/5D Signature ${toCity.city} Escape`,
      providerCode: 'Flights + 5★ Resort + Transfers',
      fromCity: fromCity.city,
      fromCode: fromCity.code,
      toCity: toCity.city,
      toCode: toCity.code,
      departureTime: 'Round-Trip Flights',
      arrivalTime: '4 Nights Stay',
      duration: '5 Days / 4 Nights',
      stopsLabel: 'All-Inclusive Bundle',
      basePriceInr: Math.round(24990 * (isInternational ? 1.25 : 0.85)),
      features: 'Return Flights · Daily Breakfast & 1 Candlelight Dinner · Private Sightseeing',
      seatsLeft: 3,
      rating: '4.9 / 5',
    },
    {
      id: `hl-2-${toCity.code}`,
      category: 'holidays',
      providerName: `6N/7D Grand ${toCity.city} & Private Villa Tour`,
      providerCode: 'Luxury Curated Holiday',
      fromCity: fromCity.city,
      fromCode: fromCity.code,
      toCity: toCity.city,
      toCode: toCity.code,
      departureTime: 'Round-Trip Flights',
      arrivalTime: '6 Nights Stay',
      duration: '7 Days / 6 Nights',
      stopsLabel: 'Private Pool Villa',
      basePriceInr: Math.round(36800 * (isInternational ? 1.3 : 0.9)),
      features: 'Visa Assistance · Dedicated Travel Concierge · Full Excursion Pass',
      seatsLeft: 2,
      rating: '4.95 / 5',
    },
  ];
}
