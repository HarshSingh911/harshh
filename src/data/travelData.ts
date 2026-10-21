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

export interface BookedTripPassenger {
  name: string;
  age?: number;
  gender?: string;
  seatOrBerth?: string;
}

export interface BookedTrip {
  bookingId: string;
  bookingReference?: string;
  category: BookingCategory;
  title: string;
  routeSummary: string;
  dateSummary: string;
  travellers: number;
  cabinOrRoom: string;
  totalPaidInr: number;
  promoApplied?: string;
  studentFareApplied: boolean;
  status: 'Confirmed' | 'Cancelled' | 'Completed';
  bookedAt: string;
  departureDate?: string;
  returnDate?: string;
  destinationCity?: string;
  destinationImage?: string;
  passengers?: BookedTripPassenger[];
  pnr?: string;
  carrierOrHotel?: string;
  cancellationDate?: string;
  cancellationReason?: string;
  refundStatus?: 'Refund Initiated' | 'Refund Processed' | 'In Review' | 'Not Applicable';
  refundAmountInr?: number;
  refundId?: string;
  paymentMode?: string;
  gstNumber?: string;
  hasInsurance?: boolean;
  policyNumber?: string;
  hotelCheckInTime?: string;
  hotelCheckOutTime?: string;
  hotelAddress?: string;
  hotelRating?: string;
  flightDepTime?: string;
  flightArrTime?: string;
  flightDuration?: string;
  flightCode?: string;
  trainNumber?: string;
  trainCoach?: string;
  busOperator?: string;
  busSeat?: string;
  isDemo?: boolean;
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
import goa from '../assets/images/dest_goa_beach_1792241006825.jpg';
import maldives from '../assets/images/dest_maldives_resort_1792241008307.jpg';
import manali from '../assets/images/dest_manali_snow_1792241007871.jpg';
import udaipur from '../assets/images/dest_udaipur_palace_1792241008240.jpg';
import flightBoardingHero from '../assets/images/flight_boarding_hero_1792552345678.jpg';

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
  goa,
  maldives,
  manali,
  udaipur,
  flightBoardingHero,
};

export const SAMPLE_DEMO_TRIPS: BookedTrip[] = [
  // 1. UPCOMING TRIPS
  {
    bookingId: 'TY-8841-GOA',
    bookingReference: 'TY-GOA-9021',
    category: 'holidays',
    title: 'Goa Beachfront Escape & Flights',
    routeSummary: 'New Delhi (DEL) → Goa (GOI)',
    dateSummary: '16 Oct – 19 Oct 2026',
    departureDate: '2026-10-16',
    returnDate: '2026-10-19',
    destinationCity: 'Goa, India',
    destinationImage: goa,
    travellers: 2,
    cabinOrRoom: 'Premium Beachfront Suite + IndiGo 6E-2134',
    totalPaidInr: 34845,
    studentFareApplied: false,
    status: 'Confirmed',
    bookedAt: '2026-10-14',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: '12B (Extra Legroom)' },
      { name: 'Pooja Sharma', age: 29, gender: 'Female', seatOrBerth: '12C (Aisle)' },
    ],
    carrierOrHotel: 'The Grand Azure Beachfront Resort & IndiGo Airlines',
    pnr: 'TY-6E-8841',
    paymentMode: 'UPI / HDFC Net Banking',
    hasInsurance: true,
    policyNumber: 'TP-99214-DELGOI',
    hotelCheckInTime: '02:00 PM',
    hotelCheckOutTime: '11:00 AM',
    hotelAddress: 'Calangute Beachfront Road, North Goa, 403516',
    hotelRating: '5★ Luxury Resort',
    flightDepTime: '06:15 AM (DEL)',
    flightArrTime: '08:30 AM (GOI)',
    flightDuration: '2h 15m (Non-stop)',
    flightCode: 'IndiGo 6E-2134',
    isDemo: true,
  },
  {
    bookingId: 'TY-9042-BOM',
    bookingReference: 'AI-BOM-7712',
    category: 'flights',
    title: 'Air India Non-Stop DEL → BOM (Business Class)',
    routeSummary: 'New Delhi (DEL) → Mumbai (BOM)',
    dateSummary: '24 Oct 2026 · Morning Departure',
    departureDate: '2026-10-24',
    returnDate: '2026-10-24',
    destinationCity: 'Mumbai, India',
    destinationImage: heroMultimodal,
    travellers: 1,
    cabinOrRoom: 'Seat 2D (Business Class Lie-Flat)',
    totalPaidInr: 16800,
    studentFareApplied: false,
    status: 'Confirmed',
    bookedAt: '2026-10-15',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: '2D (Business Class)' },
    ],
    carrierOrHotel: 'Air India · Boeing 787-8 Dreamliner',
    pnr: 'AI-789042',
    paymentMode: 'Axis Bank Vistara Credit Card',
    hasInsurance: true,
    policyNumber: 'TP-44012-DELBOM',
    flightDepTime: '08:00 AM (DEL T3)',
    flightArrTime: '10:15 AM (BOM T2)',
    flightDuration: '2h 15m (Non-stop)',
    flightCode: 'Air India AI-804',
    isDemo: true,
  },
  {
    bookingId: 'TY-7301-MAN',
    bookingReference: 'MAN-HTL-5521',
    category: 'hotels',
    title: 'The Himalayan Pines Luxury Spa Resort',
    routeSummary: 'Log Huts Area, Old Manali, Himachal Pradesh',
    dateSummary: '28 Oct – 31 Oct 2026 (3 Nights)',
    departureDate: '2026-10-28',
    returnDate: '2026-10-31',
    destinationCity: 'Manali, Himachal Pradesh',
    destinationImage: manali,
    travellers: 2,
    cabinOrRoom: 'Snow Valley Panorama Suite with Fireplace',
    totalPaidInr: 22400,
    studentFareApplied: false,
    status: 'Confirmed',
    bookedAt: '2026-10-12',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: 'Suite 302' },
      { name: 'Pooja Sharma', age: 29, gender: 'Female', seatOrBerth: 'Suite 302' },
    ],
    carrierOrHotel: 'The Himalayan Pines Resort & Spa',
    pnr: 'HTL-MAN-7301',
    paymentMode: 'ICICI Net Banking',
    hasInsurance: false,
    hotelCheckInTime: '01:00 PM',
    hotelCheckOutTime: '11:00 AM',
    hotelAddress: 'Log Huts Area, Old Manali, Himachal Pradesh 175131',
    hotelRating: '4.8★ Mountain Resort',
    isDemo: true,
  },

  // 2. CANCELLED TRIPS
  {
    bookingId: 'TY-5420-BLR',
    bookingReference: '6E-BLR-4011',
    category: 'flights',
    title: 'IndiGo 6E-502 (DEL → BLR)',
    routeSummary: 'New Delhi (DEL) → Bengaluru (BLR)',
    dateSummary: '12 Oct 2026 · Evening Flight',
    departureDate: '2026-10-12',
    returnDate: '2026-10-12',
    destinationCity: 'Bengaluru, India',
    destinationImage: heroAlpine,
    travellers: 1,
    cabinOrRoom: 'Seat 14C (Aisle)',
    totalPaidInr: 6200,
    studentFareApplied: false,
    status: 'Cancelled',
    bookedAt: '2026-10-02',
    cancellationDate: '10 Oct 2026',
    cancellationReason: 'Rescheduled personal meetings; cancelled under 24-hr Free Cancellation Policy',
    refundStatus: 'Refund Processed',
    refundAmountInr: 6200,
    refundId: 'REF-6E-99410-UPI',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: '14C (Standard)' },
    ],
    carrierOrHotel: 'IndiGo Airlines · A320neo',
    pnr: '6E-REF5420',
    paymentMode: 'Google Pay (UPI)',
    flightDepTime: '07:20 PM',
    flightArrTime: '10:05 PM',
    flightDuration: '2h 45m',
    flightCode: 'IndiGo 6E-502',
    isDemo: true,
  },
  {
    bookingId: 'TY-4318-UDA',
    bookingReference: 'UDA-PAL-3329',
    category: 'hotels',
    title: 'Taj Lake Palace Heritage Grand Heritage Suite',
    routeSummary: 'Pichola Lake, Udaipur, Rajasthan',
    dateSummary: '05 Oct – 08 Oct 2026 (3 Nights)',
    departureDate: '2026-10-05',
    returnDate: '2026-10-08',
    destinationCity: 'Udaipur, Rajasthan',
    destinationImage: udaipur,
    travellers: 2,
    cabinOrRoom: 'Palace Lake View Suite with Royal Butler Service',
    totalPaidInr: 45000,
    studentFareApplied: false,
    status: 'Cancelled',
    bookedAt: '2026-09-20',
    cancellationDate: '01 Oct 2026',
    cancellationReason: 'Family emergency; 100% full refund approved by property manager',
    refundStatus: 'Refund Processed',
    refundAmountInr: 45000,
    refundId: 'REF-TAJ-88210-HDFC',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: 'Suite 104' },
      { name: 'Pooja Sharma', age: 29, gender: 'Female', seatOrBerth: 'Suite 104' },
    ],
    carrierOrHotel: 'Taj Lake Palace Udaipur',
    pnr: 'TAJ-UDA-4318',
    paymentMode: 'HDFC Infinia Credit Card',
    hotelCheckInTime: '02:00 PM',
    hotelCheckOutTime: '12:00 PM',
    hotelAddress: 'Pichola, Udaipur, Rajasthan 313001',
    hotelRating: '5★ Luxury Heritage Palace',
    isDemo: true,
  },

  // 3. COMPLETED TRIPS
  {
    bookingId: 'TY-3201-DXB',
    bookingReference: 'DXB-HOL-8832',
    category: 'holidays',
    title: 'Dubai Skyline, Burj Khalifa & Desert Safari 4N/5D',
    routeSummary: 'New Delhi (DEL) ⇄ Dubai (DXB)',
    dateSummary: '15 May – 19 May 2026 (4 Nights)',
    departureDate: '2026-05-15',
    returnDate: '2026-05-19',
    destinationCity: 'Dubai, UAE',
    destinationImage: dubai,
    travellers: 2,
    cabinOrRoom: 'Emirates EK-511 + Address Downtown 5★ Fountain View Room',
    totalPaidInr: 68500,
    studentFareApplied: false,
    status: 'Completed',
    bookedAt: '2026-04-18',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: '18A (Window)' },
      { name: 'Pooja Sharma', age: 29, gender: 'Female', seatOrBerth: '18B (Middle)' },
    ],
    carrierOrHotel: 'Emirates & Address Downtown Dubai',
    pnr: 'EK-TY-3201',
    paymentMode: 'Amex Platinum Card',
    gstNumber: '07AAACT1234F1Z8',
    hasInsurance: true,
    policyNumber: 'TP-INTL-33901',
    hotelCheckInTime: '03:00 PM',
    hotelCheckOutTime: '11:00 AM',
    flightDepTime: '10:30 AM (DEL T3)',
    flightArrTime: '01:00 PM (DXB T3)',
    flightDuration: '4h 00m (Non-stop)',
    flightCode: 'Emirates EK-511',
    isDemo: true,
  },
  {
    bookingId: 'TY-2190-BAL',
    bookingReference: 'DPS-BAL-1144',
    category: 'holidays',
    title: 'Bali Tropical Villas, Ubud Culture & Uluwatu Sunset',
    routeSummary: 'New Delhi (DEL) ⇄ Denpasar, Bali (DPS)',
    dateSummary: '18 Aug – 23 Aug 2026 (5 Nights)',
    departureDate: '2026-08-18',
    returnDate: '2026-08-23',
    destinationCity: 'Bali, Indonesia',
    destinationImage: bali,
    travellers: 2,
    cabinOrRoom: 'Private Pool Villa, Maya Ubud Resort',
    totalPaidInr: 54200,
    studentFareApplied: false,
    status: 'Completed',
    bookedAt: '2026-07-10',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: 'Villa 12' },
      { name: 'Pooja Sharma', age: 29, gender: 'Female', seatOrBerth: 'Villa 12' },
    ],
    carrierOrHotel: 'Singapore Airlines & Maya Ubud Resort',
    pnr: 'SQ-TY-2190',
    paymentMode: 'Razorpay / UPI',
    gstNumber: '07AAACT1234F1Z8',
    hasInsurance: true,
    policyNumber: 'TP-INTL-11029',
    hotelCheckInTime: '02:00 PM',
    hotelCheckOutTime: '11:00 AM',
    flightDepTime: '09:10 AM',
    flightArrTime: '06:40 PM',
    flightDuration: '7h 30m (1 stop SIN)',
    flightCode: 'Singapore Airlines SQ-401',
    isDemo: true,
  },
  {
    bookingId: 'TY-1082-SGP',
    bookingReference: 'SIN-AIR-9923',
    category: 'flights',
    title: 'Singapore Airlines SQ-403 (DEL → SIN)',
    routeSummary: 'New Delhi (DEL) → Singapore (SIN)',
    dateSummary: '10 Dec – 15 Dec 2025 (5 Days)',
    departureDate: '2025-12-10',
    returnDate: '2025-12-15',
    destinationCity: 'Singapore',
    destinationImage: singapore,
    travellers: 2,
    cabinOrRoom: 'Economy Flex (Row 34)',
    totalPaidInr: 48900,
    studentFareApplied: false,
    status: 'Completed',
    bookedAt: '2025-11-05',
    passengers: [
      { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: '34A, 34B' },
      { name: 'Pooja Sharma', age: 29, gender: 'Female', seatOrBerth: '34B' },
    ],
    carrierOrHotel: 'Singapore Airlines · Airbus A350-900',
    pnr: 'SQ-992310',
    paymentMode: 'HDFC Net Banking',
    flightDepTime: '09:55 AM (DEL T3)',
    flightArrTime: '06:10 PM (SIN T3)',
    flightDuration: '5h 45m',
    flightCode: 'Singapore Airlines SQ-403',
    isDemo: true,
  },
];

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
    title: 'Attractions',
    subtitle: 'Theme parks, tickets & activities',
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
