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
  ChevronUp,
  Clock,
  Compass,
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  Flame,
  HelpCircle,
  Hotel,
  Info,
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
import { SafeImage } from './SafeImage';
import { BusSeatLayoutSelector } from './BusSeatLayoutSelector';
import { FlightFareOptionsModal } from './FlightFareOptionsModal';
import { TripDatePickerModal } from './TripDatePickerModal';
import { NormalCalendarDropdown } from './NormalCalendarDropdown';

interface FlightSearchResultsPageProps {
  activeCategory: BookingCategory;
  fromCity: CityOption;
  toCity: CityOption;
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
  onChangeDepartureDate?: (d: string) => void;
  onChangeReturnDate?: (d: string) => void;
  onChangeTravellers?: (count: number, cabin: string) => void;
  onChangeCategory?: (cat: BookingCategory) => void;
  onModifySearch?: () => void;
  onSelectFlightOrStayForCheckout: (summary: {
    title: string;
    code: string;
    depTime: string;
    arrTime: string;
    duration: string;
    priceInr: number;
    category: BookingCategory;
    airline?: string;
    flightNo?: string;
    cabinClass?: string;
    trainName?: string;
    trainNo?: string;
    trainClass?: string;
    hotelName?: string;
    hotelLocation?: string;
    roomType?: string;
    busOperator?: string;
    busType?: string;
    cabType?: string;
    holidayTheme?: string;
    fromCity?: string;
    toCity?: string;
    seatNumbers?: string;
    busBoardingPoint?: string;
    busDroppingPoint?: string;
    travellers?: number;
  }) => void;
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

// --- A. FLIGHT RESULTS ---
const FLIGHT_RESULTS = [
  {
    id: '6E-2134',
    airline: 'IndiGo',
    flightNo: '6E-2134',
    badgeCode: '6E',
    badgeBg: 'bg-[#1D4ED8]',
    aircraft: 'Airbus A320neo · Standard Seat',
    depTime: '06:15',
    depTerminal: 'T2',
    duration: '2h 15m',
    durationMins: 135,
    stops: 'Non-stop',
    arrTime: '08:30',
    arrTerminal: 'Dabolim',
    priceInr: 4450,
    rating: 4.8,
    tags: ['Cheapest Fare', 'Free Meal'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'morning',
    refundable: true,
  },
  {
    id: 'AI-883',
    airline: 'Air India',
    flightNo: 'AI-883',
    badgeCode: 'AI',
    badgeBg: 'bg-[#DC2626]',
    aircraft: 'Boeing 777-300ER · Complimentary Hot Meal',
    depTime: '09:40',
    depTerminal: 'T3',
    duration: '2h 30m',
    durationMins: 150,
    stops: 'Non-stop',
    arrTime: '12:10',
    arrTerminal: 'Dabolim',
    priceInr: 5120,
    rating: 4.6,
    tags: ['Hot Indian Meal Included'],
    baggage: 'Cabin: 7kg · Check-in: 15kg',
    period: 'morning',
    refundable: true,
  },
  {
    id: 'UK-851',
    airline: 'Vistara',
    flightNo: 'UK-851',
    badgeCode: 'UK',
    badgeBg: 'bg-[#5B21B6]',
    aircraft: 'Airbus A321 · Wireless In-flight Entertainment',
    depTime: '14:20',
    depTerminal: 'T3',
    duration: '2h 30m',
    durationMins: 150,
    stops: 'Non-stop',
    arrTime: '16:50',
    arrTerminal: 'Dabolim',
    priceInr: 5680,
    rating: 4.9,
    tags: ['Complimentary Gourmet Snack'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'afternoon',
    refundable: true,
  },
  {
    id: 'QP-1355',
    airline: 'Akasa Air',
    flightNo: 'QP-1355',
    badgeCode: 'QP',
    badgeBg: 'bg-[#2563EB]',
    aircraft: 'Boeing 737 MAX · Ultra-quiet Cabin',
    depTime: '18:00',
    depTerminal: 'T2',
    duration: '2h 25m',
    durationMins: 145,
    stops: 'Non-stop',
    arrTime: '20:25',
    arrTerminal: 'Dabolim',
    priceInr: 4650,
    rating: 4.7,
    tags: ['98% On-Time Guarantee'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'night',
    refundable: false,
  },
  {
    id: '6E-678',
    airline: 'IndiGo',
    flightNo: '6E-678',
    badgeCode: '6E',
    badgeBg: 'bg-[#1D4ED8]',
    aircraft: 'Airbus A321neo · Red-Eye Option',
    depTime: '21:30',
    depTerminal: 'T2',
    duration: '2h 35m',
    durationMins: 155,
    stops: 'Non-stop',
    arrTime: '00:05',
    arrTerminal: 'Dabolim',
    priceInr: 4290,
    rating: 4.75,
    tags: ['Late Night Saver'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'night',
    refundable: false,
  },
];

// --- A2. RETURN FLIGHT RESULTS (For Round Trips) ---
const RETURN_FLIGHT_RESULTS = [
  {
    id: '6E-2401',
    airline: 'IndiGo',
    flightNo: '6E-2401',
    badgeCode: '6E',
    badgeBg: 'bg-[#1D4ED8]',
    aircraft: 'Airbus A320neo · Standard Seat',
    depTime: '17:30',
    depTerminal: 'Dabolim',
    duration: '2h 20m',
    durationMins: 140,
    stops: 'Non-stop',
    arrTime: '19:50',
    arrTerminal: 'T2',
    priceInr: 4590,
    rating: 4.8,
    tags: ['Cheapest Return', 'Free Snack'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'afternoon',
    refundable: true,
  },
  {
    id: 'AI-884',
    airline: 'Air India',
    flightNo: 'AI-884',
    badgeCode: 'AI',
    badgeBg: 'bg-[#DC2626]',
    aircraft: 'Boeing 777-300ER · Hot Dinner',
    depTime: '19:15',
    depTerminal: 'Dabolim',
    duration: '2h 30m',
    durationMins: 150,
    stops: 'Non-stop',
    arrTime: '21:45',
    arrTerminal: 'T3',
    priceInr: 5240,
    rating: 4.6,
    tags: ['Hot Dinner Included'],
    baggage: 'Cabin: 7kg · Check-in: 15kg',
    period: 'night',
    refundable: true,
  },
  {
    id: 'UK-852',
    airline: 'Vistara',
    flightNo: 'UK-852',
    badgeCode: 'UK',
    badgeBg: 'bg-[#5B21B6]',
    aircraft: 'Airbus A321 · Premium Leather',
    depTime: '20:45',
    depTerminal: 'Dabolim',
    duration: '2h 25m',
    durationMins: 145,
    stops: 'Non-stop',
    arrTime: '23:10',
    arrTerminal: 'T3',
    priceInr: 5850,
    rating: 4.9,
    tags: ['Complimentary Dinner & Drinks'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'night',
    refundable: true,
  },
  {
    id: 'QP-1356',
    airline: 'Akasa Air',
    flightNo: 'QP-1356',
    badgeCode: 'QP',
    badgeBg: 'bg-[#2563EB]',
    aircraft: 'Boeing 737 MAX · Café Akasa',
    depTime: '15:10',
    depTerminal: 'Dabolim',
    duration: '2h 20m',
    durationMins: 140,
    stops: 'Non-stop',
    arrTime: '17:30',
    arrTerminal: 'T2',
    priceInr: 4720,
    rating: 4.7,
    tags: ['Fastest Return Flight'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'afternoon',
    refundable: false,
  },
  {
    id: '6E-789',
    airline: 'IndiGo',
    flightNo: '6E-789',
    badgeCode: '6E',
    badgeBg: 'bg-[#1D4ED8]',
    aircraft: 'Airbus A321neo · Late Return',
    depTime: '22:15',
    depTerminal: 'Dabolim',
    duration: '2h 30m',
    durationMins: 150,
    stops: 'Non-stop',
    arrTime: '00:45',
    arrTerminal: 'T2',
    priceInr: 4380,
    rating: 4.75,
    tags: ['Late Evening Saver'],
    baggage: 'Check-in: 15kg · Cabin: 7kg',
    period: 'night',
    refundable: false,
  },
];

// --- B. TRAIN RESULTS (IRCTC Authorized Partner) ---
interface TrainClassQuota {
  classCode: string;
  className: string;
  priceInr: number;
  status: 'AVAILABLE' | 'RAC' | 'WL';
  quotaLabel: string;
  probability?: string;
  isAC: boolean;
}

interface TrainResult {
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

const TRAIN_RESULTS: TrainResult[] = [
  {
    id: 'TR-20172',
    trainNo: '20172',
    trainName: 'VANDE BHARAT EXP',
    depTime: '06:00',
    depStation: 'New Delhi',
    depCode: 'NDLS',
    arrTime: '14:05',
    arrStation: 'Varanasi Cantt / Goa Madgaon',
    arrCode: 'MAO',
    duration: '8h 05m',
    durationMins: 485,
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S'],
    trainType: 'Vande Bharat',
    pantryAvailable: true,
    onTimePercent: 99,
    minPriceInr: 1750,
    depPeriod: '6am-12pm',
    arrPeriod: '12pm-6pm',
    freeCancellation: true,
    hasAlternateGuarantee: true,
    quotas: ['General Quota', 'Tatkal', 'Ladies Quota', 'Sr. Citizen'],
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', priceInr: 1750, status: 'AVAILABLE', quotaLabel: 'AVL-42', isAC: true },
      { classCode: 'EC', className: 'Exec Chair Car', priceInr: 3300, status: 'AVAILABLE', quotaLabel: 'AVL-14', isAC: true },
    ],
  },
  {
    id: 'TR-12952',
    trainNo: '12952',
    trainName: 'MMCT TEJAS RAJDHANI',
    depTime: '16:55',
    depStation: 'New Delhi',
    depCode: 'NDLS',
    arrTime: '08:35',
    arrStation: 'Mumbai Central / Kalyan',
    arrCode: 'MMCT',
    duration: '15h 40m',
    durationMins: 940,
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    trainType: 'Tejas',
    pantryAvailable: true,
    onTimePercent: 98,
    minPriceInr: 2420,
    depPeriod: '12pm-6pm',
    arrPeriod: '6am-12pm',
    freeCancellation: true,
    hasAlternateGuarantee: true,
    quotas: ['General Quota', 'Tatkal', 'Ladies Quota'],
    classes: [
      { classCode: '3A', className: '3-Tier AC', priceInr: 2420, status: 'AVAILABLE', quotaLabel: 'AVL-38', isAC: true },
      { classCode: '2A', className: '2-Tier AC', priceInr: 3560, status: 'AVAILABLE', quotaLabel: 'AVL-15', isAC: true },
      { classCode: '1A', className: 'First AC', priceInr: 5820, status: 'RAC', quotaLabel: 'RAC 04', isAC: true },
    ],
  },
  {
    id: 'TR-12954',
    trainNo: '12954',
    trainName: 'AK TEJAS RAJ EX',
    depTime: '17:15',
    depStation: 'Hazrat Nizamuddin',
    depCode: 'NZM',
    arrTime: '10:05',
    arrStation: 'Mumbai Central',
    arrCode: 'MMCT',
    duration: '16h 50m',
    durationMins: 1010,
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    trainType: 'Rajdhani',
    pantryAvailable: true,
    onTimePercent: 97,
    minPriceInr: 2380,
    depPeriod: '12pm-6pm',
    arrPeriod: '6am-12pm',
    freeCancellation: true,
    hasAlternateGuarantee: true,
    quotas: ['General Quota', 'Tatkal', 'Ladies Quota', 'Sr. Citizen'],
    classes: [
      { classCode: '3A', className: '3-Tier AC', priceInr: 2380, status: 'AVAILABLE', quotaLabel: 'AVL-25', isAC: true },
      { classCode: '2A', className: '2-Tier AC', priceInr: 3480, status: 'AVAILABLE', quotaLabel: 'AVL-11', isAC: true },
      { classCode: '1A', className: 'First AC', priceInr: 5690, status: 'AVAILABLE', quotaLabel: 'AVL-02', isAC: true },
    ],
  },
  {
    id: 'TR-12910',
    trainNo: '12910',
    trainName: 'BDTS GARIBRATH',
    depTime: '15:35',
    depStation: 'Hazrat Nizamuddin',
    depCode: 'NZM',
    arrTime: '07:35',
    arrStation: 'Bandra Terminus',
    arrCode: 'BDTS',
    duration: '16h 00m',
    durationMins: 960,
    runningDays: ['W', 'F', 'S'],
    trainType: 'Garib Rath',
    pantryAvailable: false,
    onTimePercent: 93,
    minPriceInr: 1020,
    depPeriod: '12pm-6pm',
    arrPeriod: '6am-12pm',
    freeCancellation: true,
    hasAlternateGuarantee: false,
    quotas: ['General Quota', 'Tatkal'],
    classes: [
      { classCode: '3E', className: '3 AC Economy', priceInr: 1020, status: 'AVAILABLE', quotaLabel: 'AVL-44', isAC: true },
      { classCode: '3A', className: '3-Tier AC', priceInr: 1140, status: 'AVAILABLE', quotaLabel: 'AVL-62', isAC: true },
    ],
  },
  {
    id: 'TR-12432',
    trainNo: '12432',
    trainName: 'TRIVANDRUM RAJDHANI',
    depTime: '06:15',
    depStation: 'Hazrat Nizamuddin',
    depCode: 'NZM',
    arrTime: '07:20',
    arrStation: 'Madgaon Junction (Goa)',
    arrCode: 'MAO',
    duration: '25h 05m',
    durationMins: 1505,
    runningDays: ['S', 'T', 'W'],
    trainType: 'Rajdhani',
    pantryAvailable: true,
    onTimePercent: 96,
    minPriceInr: 2190,
    depPeriod: '6am-12pm',
    arrPeriod: '6am-12pm',
    freeCancellation: true,
    hasAlternateGuarantee: true,
    quotas: ['General Quota', 'Tatkal', 'Ladies Quota', 'Sr. Citizen'],
    classes: [
      { classCode: '3E', className: '3 AC Economy', priceInr: 2190, status: 'AVAILABLE', quotaLabel: 'AVL-35', isAC: true },
      { classCode: '3A', className: '3-Tier AC', priceInr: 2420, status: 'AVAILABLE', quotaLabel: 'AVL-28', isAC: true },
      { classCode: '2A', className: '2-Tier AC', priceInr: 3580, status: 'AVAILABLE', quotaLabel: 'AVL-12', isAC: true },
      { classCode: '1A', className: 'First AC', priceInr: 5890, status: 'RAC', quotaLabel: 'RAC 04', isAC: true },
    ],
  },
  {
    id: 'TR-12004',
    trainNo: '12004',
    trainName: 'GOA SUPERFAST EXPRESS',
    depTime: '15:05',
    depStation: 'New Delhi',
    depCode: 'NDLS',
    arrTime: '20:10',
    arrStation: 'Madgaon Junction',
    arrCode: 'MAO',
    duration: '29h 05m',
    durationMins: 1745,
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    trainType: 'Superfast',
    pantryAvailable: true,
    onTimePercent: 94,
    minPriceInr: 790,
    depPeriod: '12pm-6pm',
    arrPeriod: '6pm-12am',
    freeCancellation: true,
    hasAlternateGuarantee: false,
    quotas: ['General Quota', 'Tatkal', 'Ladies Quota', 'Sr. Citizen'],
    classes: [
      { classCode: 'SL', className: 'Sleeper', priceInr: 790, status: 'AVAILABLE', quotaLabel: 'AVL-68', isAC: false },
      { classCode: '3A', className: '3-Tier AC', priceInr: 2090, status: 'AVAILABLE', quotaLabel: 'AVL-45', isAC: true },
      { classCode: '2A', className: '2-Tier AC', priceInr: 3040, status: 'AVAILABLE', quotaLabel: 'AVL-16', isAC: true },
      { classCode: '1A', className: 'First AC', priceInr: 5210, status: 'AVAILABLE', quotaLabel: 'AVL-03', isAC: true },
    ],
  },
  {
    id: 'TR-12618',
    trainNo: '12618',
    trainName: 'MANGALA LAKSHADWEEP EXP',
    depTime: '05:40',
    depStation: 'Hazrat Nizamuddin',
    depCode: 'NZM',
    arrTime: '13:40',
    arrStation: 'Madgaon Junction',
    arrCode: 'MAO',
    duration: '28h 25m',
    durationMins: 1705,
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    trainType: 'Superfast',
    pantryAvailable: true,
    onTimePercent: 92,
    minPriceInr: 810,
    depPeriod: '12am-6am',
    arrPeriod: '12pm-6pm',
    freeCancellation: false,
    hasAlternateGuarantee: true,
    quotas: ['General Quota', 'Ladies Quota'],
    classes: [
      { classCode: 'SL', className: 'Sleeper', priceInr: 810, status: 'WL', quotaLabel: 'WL 18', probability: '92% Confirmation', isAC: false },
      { classCode: '3A', className: '3-Tier AC', priceInr: 2140, status: 'AVAILABLE', quotaLabel: 'AVL-19', isAC: true },
      { classCode: '2A', className: '2-Tier AC', priceInr: 3120, status: 'AVAILABLE', quotaLabel: 'AVL-07', isAC: true },
    ],
  },
  {
    id: 'TR-12034',
    trainNo: '12034',
    trainName: 'NDLS CNB SHT / SHATABDI',
    depTime: '06:10',
    depStation: 'New Delhi',
    depCode: 'NDLS',
    arrTime: '11:20',
    arrStation: 'Kanpur Central',
    arrCode: 'CNB',
    duration: '5h 10m',
    durationMins: 310,
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S'],
    trainType: 'Vande Bharat',
    pantryAvailable: true,
    onTimePercent: 99,
    minPriceInr: 890,
    depPeriod: '6am-12pm',
    arrPeriod: '6am-12pm',
    freeCancellation: true,
    hasAlternateGuarantee: true,
    quotas: ['General Quota', 'Tatkal', 'Ladies Quota'],
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', priceInr: 890, status: 'AVAILABLE', quotaLabel: 'AVL-80', isAC: true },
      { classCode: 'EC', className: 'Exec Chair Car', priceInr: 1640, status: 'AVAILABLE', quotaLabel: 'AVL-19', isAC: true },
    ],
  },
  {
    id: 'TR-12138',
    trainNo: '12138',
    trainName: 'PUNJAB MAIL EXPRESS',
    depTime: '21:40',
    depStation: 'New Delhi',
    depCode: 'NDLS',
    arrTime: '06:45',
    arrStation: 'Kalyan Jn / CSMT',
    arrCode: 'KYN',
    duration: '33h 05m',
    durationMins: 1985,
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    trainType: 'Mail',
    pantryAvailable: true,
    onTimePercent: 91,
    minPriceInr: 340,
    depPeriod: '6pm-12am',
    arrPeriod: '6am-12pm',
    freeCancellation: true,
    hasAlternateGuarantee: false,
    quotas: ['General Quota', 'Tatkal', 'Ladies Quota', 'Sr. Citizen'],
    classes: [
      { classCode: '2S', className: 'Second Sitting', priceInr: 340, status: 'AVAILABLE', quotaLabel: 'AVL-110', isAC: false },
      { classCode: 'SL', className: 'Sleeper', priceInr: 690, status: 'AVAILABLE', quotaLabel: 'AVL-52', isAC: false },
      { classCode: '3A', className: '3-Tier AC', priceInr: 1850, status: 'AVAILABLE', quotaLabel: 'AVL-24', isAC: true },
      { classCode: '2A', className: '2-Tier AC', priceInr: 2680, status: 'AVAILABLE', quotaLabel: 'AVL-08', isAC: true },
    ],
  },
];

// --- C. HOTEL RESULTS (MakeMyTrip Style) ---
interface HotelResult {
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

const HOTEL_RESULTS: HotelResult[] = [
  {
    id: 'grand-azure-goa',
    name: 'The Grand Azure Beachfront Resort & Spa, Goa',
    location: 'Calangute Beachfront Road, North Goa · 120m from Beach',
    locality: 'Calangute',
    stars: 5,
    rating: 4.9,
    reviews: 842,
    propertyType: 'Resort',
    roomType: 'Premium Beachfront Suite with Private Jacuzzi',
    perks: 'Free Breakfast Included · Free Airport Cab · Free Cancellation till Check-in',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: true,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: true,
    hasAirportShuttle: true,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Beachfront / Sea View', 'Free Cancellation', 'Pay at Hotel', 'Spa & Wellness', 'Airport Shuttle'],
    priceInr: 8499,
    originalPriceInr: 14999,
    image: ASSETS.bali,
    tag: 'TripYeah Assured Luxury',
  },
  {
    id: 'taj-fort-aguada',
    name: 'Taj Fort Aguada Resort & Heritage Villas',
    location: 'Sinquerim, Candolim, North Goa · Sea-Facing Ramparts',
    locality: 'Candolim',
    stars: 5,
    rating: 4.95,
    reviews: 1290,
    propertyType: 'Heritage',
    roomType: 'Sea View Luxury Cottage with Private Sit-Out',
    perks: 'Complimentary Buffet Breakfast · Evening High Tea · Zero Prepayment',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: true,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: true,
    hasAirportShuttle: true,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Beachfront / Sea View', 'Free Cancellation', 'Pay at Hotel', 'Spa & Wellness', 'Airport Shuttle'],
    priceInr: 11200,
    originalPriceInr: 18500,
    image: ASSETS.singapore,
    tag: 'Bestseller in Goa',
  },
  {
    id: 'w-goa-vagator',
    name: 'W Goa Coastal Retreat & RockPool',
    location: 'Vagator Beach, Bardez, Goa · Cliffside Ocean View',
    locality: 'Vagator',
    stars: 5,
    rating: 4.85,
    reviews: 615,
    propertyType: 'Resort',
    roomType: 'Wonderful Garden Access King Room',
    perks: 'Breakfast + ₹2,000 Spa Credit · Late Check-out Eligible',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: true,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: false,
    hasSpa: true,
    hasAirportShuttle: true,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Beachfront / Sea View', 'Free Cancellation', 'Spa & Wellness', 'Airport Shuttle'],
    priceInr: 14850,
    originalPriceInr: 22000,
    image: ASSETS.dubai,
    tag: 'Couple Favorite',
  },
  {
    id: 'alila-diwa-goa',
    name: 'Alila Diwa Luxury Paddy Resort (Hyatt)',
    location: 'Majorda, South Goa · Surrounded by Lush Greenery',
    locality: 'Majorda',
    stars: 5,
    rating: 4.8,
    reviews: 940,
    propertyType: 'Resort',
    roomType: 'Diwa Club Room with Private Balcony Bath',
    perks: 'All Meals Included Option · Complimentary Beach Shuttle',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: false,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: true,
    hasAirportShuttle: true,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Free Cancellation', 'Pay at Hotel', 'Spa & Wellness', 'Airport Shuttle'],
    priceInr: 7990,
    originalPriceInr: 13500,
    image: ASSETS.paris,
    tag: 'South Goa Bestseller',
  },
  {
    id: 'lemon-tree-goa',
    name: 'Lemon Tree Amarante Beach Resort, Goa',
    location: 'Candolim, North Goa · 250m from Beach',
    locality: 'Candolim',
    stars: 4,
    rating: 4.6,
    reviews: 730,
    propertyType: 'Resort',
    roomType: 'Superior Pool View Room',
    perks: 'Free Breakfast Included · Swimming Pool Access',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: false,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: false,
    hasAirportShuttle: false,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Free Cancellation', 'Pay at Hotel'],
    priceInr: 4990,
    originalPriceInr: 8500,
    image: ASSETS.bali,
    tag: 'Top Value 4-Star',
  },
  {
    id: 'bloom-suites-calangute',
    name: 'Bloom Suites & Modern Residencies',
    location: 'Calangute, North Goa · Near Tito’s Lane & Calangute Mall',
    locality: 'Calangute',
    stars: 4,
    rating: 4.55,
    reviews: 580,
    propertyType: 'Hotel',
    roomType: 'Deluxe Queen Room with Work Desk',
    perks: 'Free High Speed WiFi · Free Breakfast · Zero Cancellation Fee',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: false,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: false,
    hasAirportShuttle: false,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Free Cancellation', 'Pay at Hotel'],
    priceInr: 3850,
    originalPriceInr: 6500,
    image: ASSETS.singapore,
    tag: 'Great For Workcation',
  },
  {
    id: 'villa-mar-panaji',
    name: 'Casa De Panjim Heritage Boutique Villa',
    location: 'Fontainhas Latin Quarter, Panaji · Heritage Walk Access',
    locality: 'Panaji',
    stars: 4,
    rating: 4.7,
    reviews: 410,
    propertyType: 'Villa',
    roomType: 'Portuguese Colonial Heritage Suite with Courtyard',
    perks: 'Artisan Breakfast Included · Authentic Goan Experience',
    hasBreakfast: true,
    hasPool: false,
    hasWifi: true,
    isBeachfront: false,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: false,
    hasAirportShuttle: false,
    isTripYeahAssured: false,
    amenities: ['Free Breakfast', 'Free WiFi', 'Couple Friendly', 'Free Cancellation', 'Pay at Hotel'],
    priceInr: 5400,
    originalPriceInr: 8900,
    image: ASSETS.paris,
    tag: 'Heritage Charm',
  },
  {
    id: 'ibisco-beach-cottages',
    name: 'Ibisco Wooden Sea-Facing Cottages, Baga',
    location: 'Baga Creek Road, Baga Beach · Steps to Beach & Shacks',
    locality: 'Baga',
    stars: 3,
    rating: 4.3,
    reviews: 320,
    propertyType: 'Villa',
    roomType: 'Eco Bamboo Cottage with Sea Breeze Balcony',
    perks: 'Direct Beach Access · 24/7 Front Desk · Couple Friendly',
    hasBreakfast: false,
    hasPool: false,
    hasWifi: true,
    isBeachfront: true,
    isCoupleFriendly: true,
    freeCancellation: false,
    payAtHotel: true,
    hasSpa: false,
    hasAirportShuttle: false,
    isTripYeahAssured: false,
    amenities: ['Free WiFi', 'Couple Friendly', 'Beachfront / Sea View', 'Pay at Hotel'],
    priceInr: 2450,
    originalPriceInr: 4200,
    image: ASSETS.bali,
    tag: 'Budget Beachfront',
  },
  {
    id: 'ginger-goa-panjim',
    name: 'Ginger Hotel Panjim City Centre',
    location: 'Patto Plaza, Panaji · 5 Mins from Bus Terminal & Casinos',
    locality: 'Panaji',
    stars: 3,
    rating: 4.15,
    reviews: 690,
    propertyType: 'Hotel',
    roomType: 'Luxe Smart Queen Room',
    perks: 'Fast Check-in · Free Breakfast · Business Amenities',
    hasBreakfast: true,
    hasPool: false,
    hasWifi: true,
    isBeachfront: false,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: false,
    hasAirportShuttle: false,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Free WiFi', 'Couple Friendly', 'Free Cancellation', 'Pay at Hotel'],
    priceInr: 2890,
    originalPriceInr: 4500,
    image: ASSETS.dubai,
    tag: 'Value Business Pick',
  },
  {
    id: 'sol-de-goa-boutique',
    name: 'Sol De Goa Luxury Riverfront Boutique Hotel',
    location: 'Sinquerim Backwaters, Candolim · Near Nerul River',
    locality: 'Candolim',
    stars: 4,
    rating: 4.75,
    reviews: 340,
    propertyType: 'Hotel',
    roomType: 'Riverview Club Room with Open Terrace',
    perks: 'Italian Breakfast · Sundowner Lounge Access · Pool Bar',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: false,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: false,
    hasSpa: true,
    hasAirportShuttle: false,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Free Cancellation', 'Spa & Wellness'],
    priceInr: 6200,
    originalPriceInr: 9800,
    image: ASSETS.singapore,
    tag: 'Romantic Boutique',
  },
  {
    id: 'taj-exotica-benaulim',
    name: 'Taj Exotica Resort & Mediterranean Spa',
    location: 'Benaulim Beach, South Goa · 56-Acre Sprawling Estate',
    locality: 'Majorda',
    stars: 5,
    rating: 4.96,
    reviews: 1450,
    propertyType: 'Resort',
    roomType: 'Executive Plunge Pool Villa overlooking Ocean',
    perks: 'Private Beach Cabana · Butler Service · Airport Mercedes Transfer',
    hasBreakfast: true,
    hasPool: true,
    hasWifi: true,
    isBeachfront: true,
    isCoupleFriendly: true,
    freeCancellation: true,
    payAtHotel: true,
    hasSpa: true,
    hasAirportShuttle: true,
    isTripYeahAssured: true,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Beachfront / Sea View', 'Free Cancellation', 'Pay at Hotel', 'Spa & Wellness', 'Airport Shuttle'],
    priceInr: 18500,
    originalPriceInr: 28000,
    image: ASSETS.paris,
    tag: 'Ultimate 5-Star Luxury',
  },
  {
    id: 'zostel-goa-vagator',
    name: 'Zostel Plus Vagator Bohemian Stay',
    location: 'Ozran Beach Road, Vagator · 500m from Little Vagator',
    locality: 'Vagator',
    stars: 3,
    rating: 4.4,
    reviews: 910,
    propertyType: 'Villa',
    roomType: 'Private Deluxe Bohemian Cottage',
    perks: 'Infinity Pool · Co-Working Space · Community Events',
    hasBreakfast: false,
    hasPool: true,
    hasWifi: true,
    isBeachfront: false,
    isCoupleFriendly: true,
    freeCancellation: false,
    payAtHotel: true,
    hasSpa: false,
    hasAirportShuttle: false,
    isTripYeahAssured: false,
    amenities: ['Swimming Pool', 'Free WiFi', 'Couple Friendly', 'Pay at Hotel'],
    priceInr: 1850,
    originalPriceInr: 3200,
    image: ASSETS.bali,
    tag: 'Youth & Social Vibe',
  },
];

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

const BUS_RESULTS: BusResult[] = [
  {
    id: 'BUS-101',
    operator: 'IntrCity SmartBus (Volvo 9600)',
    busType: 'AC Sleeper Multi-Axle (2+1)',
    busCategory: 'Volvo Multi-Axle',
    depTime: '18:30',
    depPoint: 'Kashmere Gate ISBT',
    depPeriod: '6pm-12am',
    arrTime: '08:45',
    arrPoint: 'Mapusa Bus Stand',
    arrPeriod: '6am-12pm',
    duration: '14h 15m',
    durationMins: 855,
    rating: 4.85,
    totalRatings: 1840,
    priceInr: 1850,
    originalPriceInr: 2400,
    seatsLeft: 5,
    isSingleLadyBerth: true,
    isPrimo: true,
    hasLiveTracking: true,
    hasFreeCancellation: true,
    amenities: ['Live GPS Tracking', 'Blankets & Linen', 'USB Charging Port', 'Emergency SOS', 'Reading Light', 'Free Wi-Fi Hotspot'],
    badges: ['Primo Certified', 'Top Rated Operator', 'Sanitized Cabins'],
  },
  {
    id: 'BUS-102',
    operator: 'Zingbus Plus Electric Luxury',
    busType: 'AC Electric Sleeper (Whisper Quiet)',
    busCategory: 'Electric',
    depTime: '20:15',
    depPoint: 'Dhaula Kuan',
    depPeriod: '6pm-12am',
    arrTime: '10:30',
    arrPoint: 'Panjim Central Bus Stand',
    arrPeriod: '6am-12pm',
    duration: '14h 15m',
    durationMins: 855,
    rating: 4.9,
    totalRatings: 920,
    priceInr: 1980,
    originalPriceInr: 2600,
    seatsLeft: 3,
    isSingleLadyBerth: true,
    isPrimo: true,
    hasLiveTracking: true,
    hasFreeCancellation: true,
    amenities: ['Live GPS Tracking', 'Water Bottle', 'USB Charging Port', 'Blankets & Linen', 'Free Wi-Fi Hotspot', 'Emergency SOS'],
    badges: ['Eco Electric', 'Zero Carbon', 'Prompt Departure'],
  },
  {
    id: 'BUS-103',
    operator: 'VRL Travels Executive',
    busType: 'Irizar i6 AC Sleeper (2+1)',
    busCategory: 'AC Sleeper',
    depTime: '21:00',
    depPoint: 'Anand Vihar',
    depPeriod: '6pm-12am',
    arrTime: '11:15',
    arrPoint: 'Margao KTC Bus Terminal',
    arrPeriod: '6am-12pm',
    duration: '14h 15m',
    durationMins: 855,
    rating: 4.75,
    totalRatings: 2650,
    priceInr: 1690,
    originalPriceInr: 2150,
    seatsLeft: 8,
    isSingleLadyBerth: false,
    isPrimo: false,
    hasLiveTracking: true,
    hasFreeCancellation: true,
    amenities: ['Live GPS Tracking', 'Blankets & Linen', 'Water Bottle', 'USB Charging Port'],
    badges: ['Punctual Operator', 'Highway Rest Stop'],
  },
  {
    id: 'BUS-104',
    operator: 'Kalyani Volvo Multi-Axle',
    busType: 'Volvo B11R AC Semi-Sleeper',
    busCategory: 'Semi-Sleeper',
    depTime: '22:30',
    depPoint: 'Kashmere Gate ISBT',
    depPeriod: '6pm-12am',
    arrTime: '12:45',
    arrPoint: 'Panjim Central Bus Stand',
    arrPeriod: '12pm-6pm',
    duration: '14h 15m',
    durationMins: 855,
    rating: 4.65,
    totalRatings: 1120,
    priceInr: 1420,
    originalPriceInr: 1800,
    seatsLeft: 12,
    isSingleLadyBerth: true,
    isPrimo: false,
    hasLiveTracking: false,
    hasFreeCancellation: false,
    amenities: ['USB Charging Port', 'Water Bottle', 'Reading Light'],
    badges: ['Value for Money', 'Spacious Legroom'],
  },
  {
    id: 'BUS-105',
    operator: 'NueGo Electric Green Intercity',
    busType: 'Pure Electric AC Seater / Recliner',
    busCategory: 'Electric',
    depTime: '06:30',
    depPoint: 'IFFCO Chowk Gurgaon',
    depPeriod: '6am-12pm',
    arrTime: '20:15',
    arrPoint: 'Calangute Beach Circle',
    arrPeriod: '6pm-12am',
    duration: '13h 45m',
    durationMins: 825,
    rating: 4.88,
    totalRatings: 1420,
    priceInr: 1550,
    originalPriceInr: 2100,
    seatsLeft: 7,
    isSingleLadyBerth: true,
    isPrimo: true,
    hasLiveTracking: true,
    hasFreeCancellation: true,
    amenities: ['Live GPS Tracking', 'Zero Carbon Ride', 'Water Bottle', 'USB Charging Port', 'Free Wi-Fi Hotspot', 'Emergency SOS'],
    badges: ['Primo Certified', 'Silent Drive', 'Women Safe'],
  },
  {
    id: 'BUS-106',
    operator: 'Orange Tours & Travels Grand',
    busType: 'Scania Metrolink Multi-Axle AC Sleeper',
    busCategory: 'Volvo Multi-Axle',
    depTime: '16:45',
    depPoint: 'Majnu Ka Tilla',
    depPeriod: '12pm-6pm',
    arrTime: '07:30',
    arrPoint: 'Porvorim',
    arrPeriod: '6am-12pm',
    duration: '14h 45m',
    durationMins: 885,
    rating: 4.8,
    totalRatings: 2100,
    priceInr: 2150,
    originalPriceInr: 2800,
    seatsLeft: 4,
    isSingleLadyBerth: true,
    isPrimo: true,
    hasLiveTracking: true,
    hasFreeCancellation: true,
    amenities: ['Live GPS Tracking', 'Blankets & Linen', 'Water Bottle', 'USB Charging Port', 'Emergency SOS', 'Reading Light'],
    badges: ['Primo Certified', 'Luxury Suspensions'],
  },
  {
    id: 'BUS-107',
    operator: 'SRS Luxury Travels',
    busType: 'Non-AC Hi-Tech Sleeper (2+1)',
    busCategory: 'Non-AC Sleeper',
    depTime: '19:15',
    depPoint: 'Karol Bagh',
    depPeriod: '6pm-12am',
    arrTime: '10:00',
    arrPoint: 'Mapusa Bus Stand',
    arrPeriod: '6am-12pm',
    duration: '14h 45m',
    durationMins: 885,
    rating: 4.3,
    totalRatings: 840,
    priceInr: 1190,
    originalPriceInr: 1500,
    seatsLeft: 14,
    isSingleLadyBerth: false,
    isPrimo: false,
    hasLiveTracking: false,
    hasFreeCancellation: false,
    amenities: ['USB Charging Port', 'Reading Light'],
    badges: ['Budget Friendly', 'Direct Route'],
  },
  {
    id: 'BUS-108',
    operator: 'IntrCity SmartBus Premium',
    busType: 'BharatBenz AC Sleeper Club Class',
    busCategory: 'AC Sleeper',
    depTime: '05:15',
    depPoint: 'Kashmere Gate ISBT',
    depPeriod: '12am-6am',
    arrTime: '19:45',
    arrPoint: 'Panjim Central Bus Stand',
    arrPeriod: '6pm-12am',
    duration: '14h 30m',
    durationMins: 870,
    rating: 4.82,
    totalRatings: 1350,
    priceInr: 1750,
    originalPriceInr: 2300,
    seatsLeft: 6,
    isSingleLadyBerth: true,
    isPrimo: true,
    hasLiveTracking: true,
    hasFreeCancellation: true,
    amenities: ['Live GPS Tracking', 'Blankets & Linen', 'Water Bottle', 'USB Charging Port', 'Emergency SOS'],
    badges: ['Primo Certified', 'Early Arrival Guarantee'],
  },
  {
    id: 'BUS-109',
    operator: 'Zingbus Electric Express',
    busType: 'AC Semi-Sleeper Luxury Electric',
    busCategory: 'Electric',
    depTime: '14:30',
    depPoint: 'Dhaula Kuan',
    depPeriod: '12pm-6pm',
    arrTime: '05:00',
    arrPoint: 'Calangute Beach Circle',
    arrPeriod: '12am-6am',
    duration: '14h 30m',
    durationMins: 870,
    rating: 4.78,
    totalRatings: 670,
    priceInr: 1390,
    originalPriceInr: 1850,
    seatsLeft: 9,
    isSingleLadyBerth: true,
    isPrimo: false,
    hasLiveTracking: true,
    hasFreeCancellation: true,
    amenities: ['Live GPS Tracking', 'Zero Carbon Ride', 'Water Bottle', 'USB Charging Port'],
    badges: ['Afternoon Boarding', 'Express Highway'],
  },
];

// --- E. CABS RESULTS (MakeMyTrip Outstation & Intercity) ---
interface CabResult {
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
    id: 'CAB-SEDAN',
    cabType: 'Comfort Sedan',
    modelExamples: 'Maruti Suzuki Dzire, Hyundai Aura or similar',
    cabCategory: 'Sedan',
    seats: 4,
    bags: 2,
    acType: 'Air Conditioned',
    priceInr: 3490,
    perKmRate: 13,
    includedKm: 350,
    tollTaxesIncluded: true,
    driverRating: 4.88,
    driverTrips: 840,
    perks: ['Doorstep Pickup & Drop', 'State Taxes & Tolls Included', 'Sanitized Cab', 'Free Cancellation up to 6h before'],
    tag: 'Most Popular',
  },
  {
    id: 'CAB-SUV-ERTIGA',
    cabType: 'Spacious SUV',
    modelExamples: 'Maruti Ertiga, Kia Carens or similar',
    cabCategory: 'SUV',
    seats: 6,
    bags: 3,
    acType: 'Dual Air Conditioning',
    priceInr: 4890,
    perKmRate: 16.5,
    includedKm: 350,
    tollTaxesIncluded: true,
    driverRating: 4.92,
    driverTrips: 1250,
    perks: ['Extra Luggage Boot', 'Spacious Legroom for Families', 'Verified Highway Expert Driver', 'Zero Extra Toll on Way'],
    tag: 'Best for Families',
  },
  {
    id: 'CAB-PRIME-INNOVA',
    cabType: 'Prime SUV (Innova Crysta)',
    modelExamples: 'Toyota Innova Crysta (Captain Seats)',
    cabCategory: 'Prime Crysta',
    seats: 7,
    bags: 4,
    acType: 'Tri-Zone Climate Control',
    priceInr: 6450,
    perKmRate: 19,
    includedKm: 350,
    tollTaxesIncluded: true,
    driverRating: 4.98,
    driverTrips: 1820,
    perks: ['Plush Leather Captain Seats', 'Chauffeur in Uniform & Water Bottles', 'Silent Suspension Ride', 'Top Tier Highway Rating'],
    tag: 'Ultimate Highway Luxury',
  },
  {
    id: 'CAB-TEMPO',
    cabType: 'Luxury Tempo Traveller',
    modelExamples: 'Force Urbania / Winger (12 Seater)',
    cabCategory: 'Tempo',
    seats: 12,
    bags: 8,
    acType: 'Individual Roof AC Vents',
    priceInr: 11800,
    perKmRate: 26,
    includedKm: 350,
    tollTaxesIncluded: true,
    driverRating: 4.85,
    driverTrips: 410,
    perks: ['Pushback Recliners', 'Dedicated Roof Luggage Carrier', 'Music & Mic System', 'Perfect for Group Outstation'],
    tag: 'Large Group Special',
  },
];

// --- F. HOLIDAYS RESULTS (MakeMyTrip Style) ---
interface HolidayPackageResult {
  id: string;
  title: string;
  destination: string;
  city: string;
  durationNightsCount: number; // e.g. 3, 4, 5, 6
  durationNights: string;
  durationDays: number;
  theme: 'Beach' | 'Honeymoon' | 'Luxury' | 'Adventure' | 'Culture' | 'Family';
  hotelCategory: '<3★' | '3★' | '4★' | '5★';
  hotelStars: number;
  rating: number;
  reviewsCount: number;
  inclusions: string[];
  highlights: string[];
  itinerary: { day: string; title: string; desc: string }[];
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

const HOLIDAY_RESULTS: HolidayPackageResult[] = [
  {
    id: 'HOL-GOA-SUPER-SAVER',
    title: 'Super Saver Goa Beach Getaway with North & South Sightseeing',
    destination: 'Goa, India',
    city: 'Goa',
    durationNightsCount: 3,
    durationNights: '3 Nights / 4 Days',
    durationDays: 4,
    theme: 'Beach',
    hotelCategory: '3★',
    hotelStars: 3,
    rating: 4.65,
    reviewsCount: 420,
    inclusions: ['3★ Calangute Hotel Stay', 'Daily Buffet Breakfast', 'Shared AC Sightseeing Tour', 'Airport / Madgaon Station Transfers'],
    highlights: ['Stay near Calangute & Baga Beach', 'North Goa Forts & Beach Tour', 'Mandovi River Evening Boat Ride'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Goa', desc: 'Pickup from Goa airport/station and check-in to your 3-star hotel. Evening walk on Calangute beach.' },
      { day: 'Day 2', title: 'North Goa Forts & Beaches', desc: 'Visit Fort Aguada, Chapora Fort, and Anjuna Beach flea market.' },
      { day: 'Day 3', title: 'South Goa Churches & Cruise', desc: 'Explore Basilica of Bom Jesus, Se Cathedral, and enjoy evening boat cruise.' },
      { day: 'Day 4', title: 'Check-out & Drop', desc: 'Enjoy breakfast, shop for local cashews and spices in Panjim, drop to airport.' },
    ],
    hotelStayTitle: 'Bloom Suites / Ginger City Center (3★ Selected Hotel)',
    startingPricePerPersonInr: 12999,
    originalPriceInr: 18500,
    image: ASSETS.bali,
    flightsIncluded: false,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: false,
    bestSeason: 'Oct – May',
    dealTag: 'Super Saver Deal',
  },
  {
    id: 'HOL-GOA-5D',
    title: '4N/5D Goa Coastal Bliss & Luxury 5★ Beachfront Resort Escape',
    destination: 'Goa, India',
    city: 'Goa',
    durationNightsCount: 4,
    durationNights: '4 Nights / 5 Days',
    durationDays: 5,
    theme: 'Beach',
    hotelCategory: '5★',
    hotelStars: 5,
    rating: 4.92,
    reviewsCount: 684,
    inclusions: ['Return Flights (Delhi ⇄ Goa)', '5★ Beachfront Resort Stay', 'Daily Buffet Breakfast & Dinner', 'Private AC Cab Transfers', 'South Goa Sunset Cruise'],
    highlights: ['Stay in Calangute Beachfront Resort', 'Catamaran Sunset Cruise with Live DJ', 'Private Sightseeing of Old Goa Churches & Aguada Fort'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Goa & Resort Check-in', desc: 'Complimentary private airport transfer to your luxury beachfront resort. Evening at leisure on Calangute beach.' },
      { day: 'Day 2', title: 'North Goa Heritage & Beach Tour', desc: 'Visit Chapora Fort, Vagator Cliff, and Anjuna Beach flea market with a dedicated private chauffeur.' },
      { day: 'Day 3', title: 'South Goa Heritage & Mandovi Sunset Cruise', desc: 'Explore Basilica of Bom Jesus, Mangueshi Temple and enjoy 2-hour Mandovi River Sunset Catamaran Cruise.' },
      { day: 'Day 4', title: 'Watersports Adventure & Spa Day', desc: 'Complimentary Parasailing & Jet Ski session in the morning, followed by relaxing Ayurvedic massage at the resort.' },
      { day: 'Day 5', title: 'Souvenir Shopping & Flight Back', desc: 'Enjoy leisurely breakfast, shop for cashew nuts & spices in Panjim, followed by private airport drop.' },
    ],
    hotelStayTitle: 'Grand Azure 5★ Beach Resort (Deluxe Sea View Suite)',
    startingPricePerPersonInr: 24999,
    originalPriceInr: 36000,
    image: ASSETS.paris,
    flightsIncluded: true,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: true,
    bestSeason: 'Oct – Mar',
    dealTag: 'Deal of the Day',
  },
  {
    id: 'HOL-GOA-HONEYMOON-VILLA',
    title: 'Goa Romantic Honeymoon Retreat with Private Plunge Pool Villa',
    destination: 'Goa, India',
    city: 'Goa',
    durationNightsCount: 4,
    durationNights: '4 Nights / 5 Days',
    durationDays: 5,
    theme: 'Honeymoon',
    hotelCategory: '5★',
    hotelStars: 5,
    rating: 4.96,
    reviewsCount: 310,
    inclusions: ['Return Flights Included', '5★ Private Plunge Pool Villa', 'Candlelight Beach Dinner with Wine', 'Couples Spa Therapy', 'Private Chauffeur Driven Sedan'],
    highlights: ['Exclusive Private Plunge Pool Villa', 'Complimentary Honeymoon Bed Decoration & Cake', 'Sunset Yacht Cruise on Arabian Sea'],
    itinerary: [
      { day: 'Day 1', title: 'VIP Airport Welcome & Check-in', desc: 'Chauffeur pickup in luxury sedan with welcome champagne. Romantic check-in to your private villa.' },
      { day: 'Day 2', title: 'South Goa Romance & Sunset Cruise', desc: 'Private yacht charter along Mandovi river with snacks and sunset views.' },
      { day: 'Day 3', title: 'Couples Spa & Candlelight Beach Dinner', desc: 'Relaxing 90-minute Aromatherapy couples massage followed by candlelit dinner under the stars.' },
      { day: 'Day 4', title: 'Vagator Cliffs & Beach Club Evening', desc: 'Scenic drive to Vagator cliff tops and reserved sunset lounge cabana at Ozran.' },
      { day: 'Day 5', title: 'Floating Breakfast & Farewell', desc: 'Signature floating breakfast in your private pool before departure transfer.' },
    ],
    hotelStayTitle: 'Taj Exotica / W Goa Cliff Villa (5★ Luxury Villa)',
    startingPricePerPersonInr: 34500,
    originalPriceInr: 49000,
    image: ASSETS.singapore,
    flightsIncluded: true,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: true,
    bestSeason: 'Year Round',
    dealTag: 'Honeymoon Special',
  },
  {
    id: 'HOL-GOA-ADVENTURE',
    title: '3N/4D Goa Thrill Adventure with Scuba Diving & Grand Island Boat Trip',
    destination: 'Goa, India',
    city: 'Goa',
    durationNightsCount: 3,
    durationNights: '3 Nights / 4 Days',
    durationDays: 4,
    theme: 'Adventure',
    hotelCategory: '3★',
    hotelStars: 3,
    rating: 4.78,
    reviewsCount: 540,
    inclusions: ['Grand Island Boat Cruise with Dolphin Spotting', 'PADI Certified Scuba Diving with Video', '5-in-1 Watersports Combo (Parasailing, JetSki, Banana, Bumper, Speedboat)', '3★ Candolim Stay + Breakfast'],
    highlights: ['Scuba diving with underwater photography', 'Bumper & Banana boat rides at Baga', 'Dolphin spotting catamaran cruise'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Candolim Check-in', desc: 'Transfer from Goa airport or station. Evening watersports trial at Candolim beach.' },
      { day: 'Day 2', title: 'Grand Island Scuba Expedition', desc: 'Full-day boat trip to Grand Island. Scuba diving with certified instructor and BBQ lunch on monkey beach.' },
      { day: 'Day 3', title: 'Water Sports Extravaganza', desc: 'Parasailing, jet skiing, and bumper boat rides at Baga beach followed by beach shack party.' },
      { day: 'Day 4', title: 'Check-out & Return', desc: 'Relaxed breakfast and airport transfer.' },
    ],
    hotelStayTitle: 'Lemon Tree / Candolim Boutique Hotel (3★/4★)',
    startingPricePerPersonInr: 14200,
    originalPriceInr: 21000,
    image: ASSETS.dubai,
    flightsIncluded: false,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: false,
    bestSeason: 'Oct – May',
    dealTag: 'Adventure Bestseller',
  },
  {
    id: 'HOL-GOA-CULTURE',
    title: '3N/4D Goa Fontainhas Latin Quarter & Portuguese Heritage Walk',
    destination: 'Goa, India',
    city: 'Goa',
    durationNightsCount: 3,
    durationNights: '3 Nights / 4 Days',
    durationDays: 4,
    theme: 'Culture',
    hotelCategory: '4★',
    hotelStars: 4,
    rating: 4.82,
    reviewsCount: 290,
    inclusions: ['Return Flights Included', '4★ Heritage Boutique Hotel in Fontainhas', 'Guided Latin Quarter Walking Tour', 'Portuguese Cooking Class & Fado Evening', 'Private AC Cab for 3 Days'],
    highlights: ['Stay in 19th Century Indo-Portuguese Villa', 'Curated Spice Plantation Tour with Traditional Goan Feast', 'Sunset walk through Fontainhas cobblestone streets'],
    itinerary: [
      { day: 'Day 1', title: 'Check-in to Heritage Quarter', desc: 'Private transfer from Goa airport to Latin Quarter boutique hotel. Evening walk past colorful heritage houses.' },
      { day: 'Day 2', title: 'Old Goa Churches & Spice Farm', desc: 'Visit Se Cathedral, Church of St. Francis of Assisi, and Sahakari Spice Farm for an organic lunch.' },
      { day: 'Day 3', title: 'Goan Fado Music & Culinary Walk', desc: 'Explore historic bakeries in Panaji, taste fresh Poee bread and attend live Portuguese Fado acoustic music.' },
      { day: 'Day 4', title: 'Shopping at 18th June Road & Departure', desc: 'Shop for handcrafted Azulejos tiles and transfer to airport.' },
    ],
    hotelStayTitle: 'Casa De Panjim Heritage Boutique Villa (4★)',
    startingPricePerPersonInr: 18500,
    originalPriceInr: 26000,
    image: ASSETS.paris,
    flightsIncluded: true,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: false,
    bestSeason: 'Year Round',
    dealTag: 'Heritage Special',
  },
  {
    id: 'HOL-GOA-BUDGET',
    title: '2N/3D Goa Weekend Backpackers & Party Special',
    destination: 'Goa, India',
    city: 'Goa',
    durationNightsCount: 2,
    durationNights: '2 Nights / 3 Days',
    durationDays: 3,
    theme: 'Beach',
    hotelCategory: '<3★',
    hotelStars: 2,
    rating: 4.4,
    reviewsCount: 380,
    inclusions: ['Cozy AC Hotel Stay near Tito’s Lane', 'Daily Breakfast', 'Scooter Rental for 2 Days (Fuel extra)', 'Club Entry Voucher'],
    highlights: ['Stay in the heart of Baga party strip', 'Self-drive scooter included for exploring North Goa', 'Complimentary entry pass to top beach club'],
    itinerary: [
      { day: 'Day 1', title: 'Check-in & Sunset at Curlies', desc: 'Arrive in Goa, collect rental scooter, check-in and head to Anjuna for sunset trance vibes.' },
      { day: 'Day 2', title: 'North Goa Beach Hop & Club Night', desc: 'Ride through Morjim, Ashwem, and Arambol sweet water lake. Night party at Tito’s lane.' },
      { day: 'Day 3', title: 'Morning Swim & Checkout', desc: 'Enjoy English breakfast by the beach, return scooter, and head to station.' },
    ],
    hotelStayTitle: 'Zostel Plus / Baga Beach House (<3★ Standard)',
    startingPricePerPersonInr: 7999,
    originalPriceInr: 12500,
    image: ASSETS.bali,
    flightsIncluded: false,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: false,
    bestSeason: 'Oct – Jun',
    dealTag: 'Pocket Friendly',
  },
  {
    id: 'HOL-BALI-6D',
    title: '5N/6D Bali Island Dreams with Ubud Private Pool Villa & Seminyak',
    destination: 'Bali, Indonesia',
    city: 'Bali',
    durationNightsCount: 5,
    durationNights: '5 Nights / 6 Days',
    durationDays: 6,
    theme: 'Honeymoon',
    hotelCategory: '5★',
    hotelStars: 5,
    rating: 4.95,
    reviewsCount: 512,
    inclusions: ['Return International Flights', '2N Ubud Private Pool Villa + 3N Seminyak Beachfront', 'Daily Floating Breakfast', 'Private Tour Escort', 'Nusa Penida Island Tour'],
    highlights: ['Private Pool Villa in Ubud Jungle', 'Speedboat tour to Kelingking Secret Beach (Nusa Penida)', 'Tanah Lot Sunset Temple visit'],
    itinerary: [
      { day: 'Day 1', title: 'Welcome to Denpasar Bali', desc: 'Flower garland reception at DPS airport and private scenic drive to Ubud Jungle Private Pool Villa.' },
      { day: 'Day 2', title: 'Tegalalang Rice Terraces & Jungle Swing', desc: 'Experience Bali giant swing, coffee tasting at Luwak plantation, and Tirta Empul water blessing.' },
      { day: 'Day 3', title: 'Transfer to Seminyak & Sunset at Tanah Lot', desc: 'Scenic transfer to vibrant Seminyak beachfront. Evening sunset at iconic offshore Tanah Lot temple.' },
      { day: 'Day 4', title: 'Nusa Penida Island Speedboat Day Tour', desc: 'Full day speedboat trip to Kelingking T-Rex cliff, Angel Billabong, and Broken Beach with lunch.' },
      { day: 'Day 5', title: 'Water Sports & Beach Club Night', desc: 'Parasailing and banana boat in Benoa, followed by VIP daybed access at Potato Head Beach Club.' },
      { day: 'Day 6', title: 'Seminyak Flea Markets & Departure', desc: 'Morning spa massage, souvenir shopping in Seminyak Square, and transfer to airport.' },
    ],
    hotelStayTitle: 'Ubud Hanging Villa + Seminyak Beach Resort (5★)',
    startingPricePerPersonInr: 48999,
    originalPriceInr: 68000,
    image: ASSETS.singapore,
    flightsIncluded: true,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: true,
    bestSeason: 'Year Round',
    dealTag: 'International Bestseller',
  },
  {
    id: 'HOL-DUBAI-5D',
    title: '4N/5D Dubai Extravaganza with Desert Safari & Burj Khalifa At The Top',
    destination: 'Dubai, UAE',
    city: 'Dubai',
    durationNightsCount: 4,
    durationNights: '4 Nights / 5 Days',
    durationDays: 5,
    theme: 'Luxury',
    hotelCategory: '4★',
    hotelStars: 4,
    rating: 4.88,
    reviewsCount: 890,
    inclusions: ['Emirates / IndiGo Return Flights', '4★/5★ Downtown Hotel', 'Burj Khalifa 124th Floor Tickets', 'Desert Safari with BBQ & Belly Dance', 'Dubai Marina Dhow Cruise Dinner'],
    highlights: ['Burj Khalifa Level 124 Observation Deck at Sunset', '4x4 Dune Bashing Desert Safari with BBQ Dinner', 'Dubai Mall Fountain Show & Aquarium'],
    itinerary: [
      { day: 'Day 1', title: 'Touchdown Dubai & Marina Dhow Cruise', desc: 'Private transfer from DXB airport. Evening luxury Dhow cruise dinner along Dubai Marina canal.' },
      { day: 'Day 2', title: 'City Tour & Burj Khalifa At The Top', desc: 'Photo stop at Burj Al Arab, Palm Jumeirah monorail, and evening visit to Burj Khalifa 124th floor.' },
      { day: 'Day 3', title: 'Thrilling 4x4 Desert Safari Experience', desc: 'Red dune bashing, camel riding, sandboarding, followed by live Tanoura dance and BBQ dinner.' },
      { day: 'Day 4', title: 'Museum of the Future & Dubai Gold Souk', desc: 'Morning at architectural marvel Museum of the Future. Evening Abra boat ride across Gold & Spice Souk.' },
      { day: 'Day 5', title: 'Last-minute Shopping & Departure', desc: 'Shop duty-free goods at Mall of the Emirates before comfortable airport drop.' },
    ],
    hotelStayTitle: 'Grand Millennium Downtown Dubai (4★/5★ Luxury)',
    startingPricePerPersonInr: 42500,
    originalPriceInr: 58000,
    image: ASSETS.dubai,
    flightsIncluded: true,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: true,
    bestSeason: 'Oct – Apr',
    dealTag: 'Luxury Favorite',
  },
  {
    id: 'HOL-KERALA-FAMILY',
    title: '5N/6D Kerala Serenity: Munnar Tea Hills & Alleppey Luxury Houseboat',
    destination: 'Kerala, India',
    city: 'Kerala',
    durationNightsCount: 5,
    durationNights: '5 Nights / 6 Days',
    durationDays: 6,
    theme: 'Family',
    hotelCategory: '4★',
    hotelStars: 4,
    rating: 4.85,
    reviewsCount: 460,
    inclusions: ['Return Domestic Flights to Kochi', '2N Munnar Tea Resort + 1N Thekkady + 1N Alleppey Houseboat + 1N Marari Beach', 'All Meals on Houseboat', 'Private AC Innova for All 6 Days'],
    highlights: ['Overnight stay on traditional wooden Kettuvallam houseboat', 'Tea tasting tour at Kolukkumalai Estate', 'Spice plantation walk in Thekkady'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Cochin & Drive to Munnar', desc: 'Scenic uphill drive past Cheeyappara waterfalls to lush tea plantation resort.' },
      { day: 'Day 2', title: 'Munnar Tea Hills & Eravikulam National Park', desc: 'Spot endangered Nilgiri Tahr at Rajamalai, visit Mattupetty Dam and Echo point.' },
      { day: 'Day 3', title: 'Munnar to Thekkady Spice Hills', desc: 'Drive through misty cardamom hills. Visit Periyar tiger reserve and watch martial arts show.' },
      { day: 'Day 4', title: 'Alleppey Backwaters Houseboat Cruise', desc: 'Board private luxury houseboat at noon. Glide past tranquil paddy fields, enjoy traditional Karimeen fish dinner.' },
      { day: 'Day 5', title: 'Marari Beach Relaxation', desc: 'Disembark houseboat and transfer to peaceful white sand Marari beach resort.' },
      { day: 'Day 6', title: 'Cochin Fort & Departure Flight', desc: 'See Chinese fishing nets in Fort Kochi before transfer to Cochin airport.' },
    ],
    hotelStayTitle: 'Blanket Hotel Munnar + Luxury AC Backwater Houseboat (4★)',
    startingPricePerPersonInr: 22999,
    originalPriceInr: 32000,
    image: ASSETS.bali,
    flightsIncluded: true,
    bookAtOneRupee: true,
    isCustomizable: true,
    isPremiumPackage: false,
    bestSeason: 'Sep – Apr',
    dealTag: 'Family Bestseller',
  },
];

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

export const FlightSearchResultsPage: React.FC<FlightSearchResultsPageProps> = ({
  activeCategory: initialActiveCategory,
  fromCity,
  toCity,
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
  onChangeDepartureDate,
  onChangeReturnDate,
  onChangeTravellers,
  onChangeCategory,
  onModifySearch,
  onSelectFlightOrStayForCheckout,
  onSelectHotelForDetails,
  onOpenHostelsPage,
  onNotify,
}) => {
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

  // Close calendar and travellers popovers on outside click
  useEffect(() => {
    if (!openCalendarDropdown && !openHeaderTravellers && !openModTravellers && !openCityPicker && !openTrainDropdown) return;
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
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [openCalendarDropdown, openHeaderTravellers, openModTravellers, openCityPicker, openTrainDropdown]);

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
          ? 'Dummy Flight (Round Trip)'
          : 'Dummy Flight (One Way)'
        : modTripType === 'round-trip'
        ? 'Round Trip'
        : 'One Way';
    
    let stayTypeLabel = 'Hotels & Stays';
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
  const [selectedOutboundId, setSelectedOutboundId] = useState<string>(FLIGHT_RESULTS[0].id);
  const [selectedReturnId, setSelectedReturnId] = useState<string>(RETURN_FLIGHT_RESULTS[0].id);
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

  // Reset all filters function
  const handleResetFilters = () => {
    setSortBy('cheapest');
    setFlightMaxPrice(10000);
    setFlightSelectedAirlines(['IndiGo', 'Air India', 'Vistara', 'Akasa Air']);
    setFlightNonStopOnly(false);
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
      if (flightDepSlot && fl.period !== flightDepSlot) return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (sortBy === 'fastest') return a.durationMins - b.durationMins;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'departure') return a.depTime.localeCompare(b.depTime);
      return a.priceInr - b.priceInr;
    });
  }, [flightMaxPrice, flightSelectedAirlines, flightNonStopOnly, flightRefundableOnly, flightDepSlot, sortBy]);

  // 1b. Filtered Return Flights (for Round Trip)
  const processedReturnFlights = useMemo(() => {
    let list = RETURN_FLIGHT_RESULTS.filter((fl) => {
      if (fl.priceInr > flightMaxPrice) return false;
      if (!flightSelectedAirlines.includes(fl.airline)) return false;
      if (flightNonStopOnly && fl.stops !== 'Non-stop') return false;
      if (flightRefundableOnly && !fl.refundable) return false;
      if (flightDepSlot && fl.period !== flightDepSlot) return false;
      return true;
    });

    return list.sort((a, b) => {
      if (returnSortBy === 'cheapest') return a.priceInr - b.priceInr;
      if (returnSortBy === 'fastest') return a.durationMins - b.durationMins;
      if (returnSortBy === 'rating') return b.rating - a.rating;
      if (returnSortBy === 'departure') return a.depTime.localeCompare(b.depTime);
      return a.priceInr - b.priceInr;
    });
  }, [flightMaxPrice, flightSelectedAirlines, flightNonStopOnly, flightRefundableOnly, flightDepSlot, returnSortBy]);

  const selectedOutboundFlight = useMemo(() => {
    return FLIGHT_RESULTS.find((f) => f.id === selectedOutboundId) || FLIGHT_RESULTS[0];
  }, [selectedOutboundId]);

  const selectedReturnFlight = useMemo(() => {
    return RETURN_FLIGHT_RESULTS.find((f) => f.id === selectedReturnId) || RETURN_FLIGHT_RESULTS[0];
  }, [selectedReturnId]);

  const totalRoundTripFare = useMemo(() => {
    if (currentTripType === 'dummy-flights') {
      return 890 * currentTravellers;
    }
    return (selectedOutboundFlight.priceInr + selectedReturnFlight.priceInr) * currentTravellers;
  }, [currentTripType, selectedOutboundFlight, selectedReturnFlight, currentTravellers]);

  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
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
    let list = HOTEL_RESULTS.filter((h) => {
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
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      {/* ===================================================================
          1. TOP COMPACT & INLINE MODIFY SEARCH STRIP (MakeMyTrip Style)
      =================================================================== */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
                {currentCategory === 'holidays' && <Palmtree className="w-4 h-4 text-purple-600 shrink-0" />}

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
                        : 'Hotels & Stays'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-900 font-semibold">{currentFromCity.city}</span>
                    <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                      {currentCategory === 'trains' ? currentFromCity.stationCode : currentFromCity.code}
                    </span>

                    <span className="text-slate-400 font-mono">
                      {currentCategory === 'flights' && isFlightRoundTrip ? '⇄' : '→'}
                    </span>

                    <span className="text-slate-900 font-semibold">{currentToCity.city}</span>
                    <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                      {currentCategory === 'trains' ? currentToCity.stationCode : currentToCity.code}
                    </span>

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
                            ? 'Dummy Ticket (Round Trip)'
                            : 'Dummy Ticket (One Way)'
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

              {/* Travellers / Guests (Custom Popover matching front page for flights, hidden for trains and hotels as requested) */}
              {currentCategory !== 'trains' && currentCategory !== 'hotels' && (
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

                      {openCityPicker === 'from' && (
                        <div className="absolute left-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50">
                          {CITIES.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setModFromCity(c);
                                setOpenCityPicker(null);
                              }}
                              className={`w-full text-left p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between ${
                                modFromCity.code === c.code ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              <span>{c.city}</span>
                              <span className="font-mono text-[10px] text-slate-500">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
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

                      {openCityPicker === 'to' && (
                        <div className="absolute right-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50">
                          {CITIES.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setModToCity(c);
                                setOpenCityPicker(null);
                              }}
                              className={`w-full text-left p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between ${
                                modToCity.code === c.code ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              <span>{c.city}</span>
                              <span className="font-mono text-[10px] text-slate-500">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
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
                        { id: 'overnight', label: 'Hotels & Stays' },
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
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      From City
                    </label>
                    <select
                      value={modFromCity.code}
                      onChange={(e) => {
                        const match = CITIES.find((c) => c.code === e.target.value);
                        if (match) setModFromCity(match);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      {CITIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase">To City</label>
                      <button
                        type="button"
                        onClick={handleSwapModCities}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                    </div>
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
                          {c.city}
                        </option>
                      ))}
                    </select>
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

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Bus Type
                    </label>
                    <select
                      value={modBusType}
                      onChange={(e) => setModBusType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      <option value="All Buses">All Buses</option>
                      <option value="Volvo Multi-Axle">Volvo Multi-Axle</option>
                      <option value="AC Sleeper">AC Sleeper (2+1)</option>
                      <option value="Electric">Electric AC Coach</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 5. CABS MODIFY CONTROLS */}
              {modCategory === 'cabs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pickup City
                    </label>
                    <select
                      value={modFromCity.code}
                      onChange={(e) => {
                        const match = CITIES.find((c) => c.code === e.target.value);
                        if (match) setModFromCity(match);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      {CITIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Drop City
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
                          {c.city}
                        </option>
                      ))}
                    </select>
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
                      }}
                      className={`w-full text-left bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs hover:border-amber-500 cursor-pointer flex items-center justify-between ${
                        openCalendarDropdown === 'mod-dep' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="truncate">{formatFriendlyDate(modDepDate || currentDepDate)}</span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded font-mono shrink-0">
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

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pickup Time
                    </label>
                    <select
                      value={modCabTime}
                      onChange={(e) => setModCabTime(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      <option value="06:00 AM">06:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                      <option value="09:00 PM">09:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Cab Type
                    </label>
                    <select
                      value={modCabType}
                      onChange={(e) => setModCabType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      <option value="SUV / Sedan">SUV / Sedan</option>
                      <option value="Sedan">Sedan (Dzire / Etios)</option>
                      <option value="Prime Crysta">Innova Crysta</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 6. HOLIDAYS MODIFY CONTROLS */}
              {modCategory === 'holidays' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Destination Package
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
                          {c.city} Getaways
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Month of Travel
                    </label>
                    <input
                      type="date"
                      value={modDepDate}
                      onChange={(e) => setModDepDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Duration
                    </label>
                    <select
                      value={modHolidayDuration}
                      onChange={(e) => setModHolidayDuration(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      <option value="3N / 4D">3 Nights / 4 Days</option>
                      <option value="4N / 5D">4 Nights / 5 Days</option>
                      <option value="5N / 6D">5 Nights / 6 Days</option>
                      <option value="6N / 7D">6 Nights / 7 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Theme
                    </label>
                    <select
                      value={modHolidayTheme}
                      onChange={(e) => setModHolidayTheme(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:outline-hidden cursor-pointer"
                    >
                      <option value="All Packages">All Packages</option>
                      <option value="Beach">Beach Getaway</option>
                      <option value="Honeymoon">Romantic Honeymoon</option>
                      <option value="Luxury">5-Star Luxury</option>
                    </select>
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
          2. TWO-COLUMN LAYOUT: LEFT FILTERS SIDEBAR + RIGHT MAIN RESULTS
      =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =================================================================
              LEFT COLUMN: UNIFIED FILTER SIDEBAR
          =================================================================== */}
          <aside
            className={`lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-5 ${
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
                  <span className="font-bold text-slate-800 block mb-2">Departure Time</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'morning', label: 'Morning', sub: '6am - 12pm', icon: Sun },
                      { id: 'afternoon', label: 'Afternoon', sub: '12pm - 6pm', icon: Sunrise },
                      { id: 'night', label: 'Night', sub: '6pm - 12am', icon: Moon },
                    ].map((slot) => {
                      const Icon = slot.icon;
                      const active = flightDepSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setFlightDepSlot(active ? null : slot.id)}
                          className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                            active
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 mx-auto mb-1 text-slate-500" />
                          <span className="block text-[11px] font-semibold">{slot.label}</span>
                          <span className="block text-[9px] text-slate-400">{slot.sub}</span>
                        </button>
                      );
                    })}
                  </div>
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
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                          />
                          <span>{airline}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Stops & Refundable */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                    <input
                      type="checkbox"
                      checked={flightNonStopOnly}
                      onChange={() => setFlightNonStopOnly(!flightNonStopOnly)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                    <span>Non-stop flights only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                    <input
                      type="checkbox"
                      checked={flightRefundableOnly}
                      onChange={() => setFlightRefundableOnly(!flightRefundableOnly)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
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
                  <span className="font-bold text-slate-800 block mb-1.5">Search Operator / Station</span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={busSearchQuery}
                      onChange={(e) => setBusSearchQuery(e.target.value)}
                      placeholder="e.g. IntrCity, Zingbus, ISBT..."
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

                {/* 2. Primo Certified Bus Toggle */}
                <div
                  onClick={() => setBusPrimoOnly((prev) => !prev)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                    busPrimoOnly
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={busPrimoOnly}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Primo Certified Buses</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Top 1% rated operators, 98% on-time guarantee &amp; verified clean linen
                    </p>
                  </div>
                </div>

                {/* 3. Safety & Convenience Quick Toggles */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 block mb-1">Safety &amp; Convenience</span>

                  {/* Single Lady Berths */}
                  <label className="flex items-center justify-between p-2 rounded-xl bg-pink-50/50 hover:bg-pink-50 border border-pink-200/80 cursor-pointer select-none text-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={busSingleLadyOnly}
                        onChange={() => setBusSingleLadyOnly(!busSingleLadyOnly)}
                        className="w-4 h-4 rounded border-pink-300 text-pink-600 cursor-pointer accent-pink-600"
                      />
                      <div>
                        <div className="font-bold text-xs text-pink-950 flex items-center gap-1">
                          <Users className="w-3 h-3 text-pink-600" />
                          <span>Single Lady Reserved</span>
                        </div>
                        <div className="text-[10px] text-pink-700">Adjacent berth reserved for female travelers</div>
                      </div>
                    </div>
                  </label>

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
                      { id: 'under-1500', label: 'Under ₹1,500 (Budget)' },
                      { id: '1500-2000', label: '₹1,500 - ₹2,000 (Popular)' },
                      { id: 'above-2000', label: '₹2,000+ (Luxury Sleeper)' },
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

                {/* 8. Boarding Points (Origin) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Boarding Points ({currentFromCity.city})
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Kashmere Gate ISBT', label: 'Kashmere Gate ISBT' },
                      { id: 'Majnu Ka Tilla', label: 'Majnu Ka Tilla' },
                      { id: 'Dhaula Kuan', label: 'Dhaula Kuan' },
                      { id: 'Anand Vihar', label: 'Anand Vihar' },
                      { id: 'IFFCO Chowk Gurgaon', label: 'IFFCO Chowk Gurgaon' },
                      { id: 'Karol Bagh', label: 'Karol Bagh' },
                    ].map((pt) => {
                      const checked = busSelectedBoardingPoints.includes(pt.id);
                      return (
                        <label
                          key={pt.id}
                          className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setBusSelectedBoardingPoints((prev) =>
                                checked ? prev.filter((p) => p !== pt.id) : [...prev, pt.id]
                              )
                            }
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                          />
                          <span className="text-[11px]">{pt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 9. Dropping Points (Destination) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">
                    Dropping Points ({currentToCity.city})
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Panjim Central Bus Stand', label: 'Panjim Central Bus Stand' },
                      { id: 'Mapusa Bus Stand', label: 'Mapusa Bus Stand' },
                      { id: 'Calangute Beach Circle', label: 'Calangute Beach Circle' },
                      { id: 'Margao KTC Bus Terminal', label: 'Margao KTC Bus Terminal' },
                      { id: 'Porvorim', label: 'Porvorim' },
                    ].map((pt) => {
                      const checked = busSelectedDroppingPoints.includes(pt.id);
                      return (
                        <label
                          key={pt.id}
                          className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setBusSelectedDroppingPoints((prev) =>
                                checked ? prev.filter((p) => p !== pt.id) : [...prev, pt.id]
                              )
                            }
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                          />
                          <span className="text-[11px]">{pt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 10. Bus Operators */}
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
                          <span>{v}</span>
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-colors"
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
                    <span className="text-purple-700 font-mono text-[11px] font-bold">
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
                    className="w-full accent-purple-600 cursor-pointer"
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
                              ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold shadow-2xs'
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
                          ? 'bg-purple-600 border-purple-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-[11px]">With Flight</div>
                      <div className={`text-[10px] ${holidayFlightOption === 'with-flight' ? 'text-purple-200' : 'text-slate-400'}`}>
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
                          ? 'bg-purple-600 border-purple-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-[11px]">Without Flight</div>
                      <div className={`text-[10px] ${holidayFlightOption === 'without-flight' ? 'text-purple-200' : 'text-slate-400'}`}>
                        ({HOLIDAY_RESULTS.filter((p) => !p.flightsIncluded).length})
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Budget (per person) - MMT Photo 3 & Photo 1 */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5">
                    <span>Budget (per person)</span>
                    <span className="font-bold text-purple-700 font-mono">
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
                    className="w-full accent-purple-600 cursor-pointer"
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
                              className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600"
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
                              ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold shadow-2xs'
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

                {/* 6. Cities / Destination (MMT Photo 1) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Cities</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Goa', label: 'Goa', count: HOLIDAY_RESULTS.filter((p) => p.city === 'Goa').length },
                      { id: 'Bali', label: 'Bali', count: HOLIDAY_RESULTS.filter((p) => p.city === 'Bali').length },
                      { id: 'Dubai', label: 'Dubai', count: HOLIDAY_RESULTS.filter((p) => p.city === 'Dubai').length },
                      { id: 'Kerala', label: 'Kerala', count: HOLIDAY_RESULTS.filter((p) => p.city === 'Kerala').length },
                    ].map((cityItem) => {
                      const checked = holidaySelectedCities.includes(cityItem.id);
                      return (
                        <label
                          key={cityItem.id}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setHolidaySelectedCities((prev) =>
                                  checked ? prev.filter((c) => c !== cityItem.id) : [...prev, cityItem.id]
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600"
                            />
                            <span className="text-[11px] font-medium">{cityItem.label}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">({cityItem.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Buy Now, Pay Later - MMT Photo 2 */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Buy Now, Pay Later</span>
                  <label
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                      holidayBookAtOneRupeeOnly
                        ? 'bg-purple-50 border-purple-400 text-purple-900'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={holidayBookAtOneRupeeOnly}
                        onChange={() => setHolidayBookAtOneRupeeOnly(!holidayBookAtOneRupeeOnly)}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-purple-900 block">Book @ ₹1</span>
                        <span className="text-[10px] text-slate-500">Pay remaining balance 7 days before trip</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-purple-700 font-mono font-bold">
                      ({HOLIDAY_RESULTS.filter((p) => p.bookAtOneRupee).length})
                    </span>
                  </label>
                </div>

                {/* 8. Themes - MMT Photo 2 */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-2">Themes</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Adventure', label: 'Adventure', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Adventure').length },
                      { id: 'Culture', label: 'Culture', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Culture').length },
                      { id: 'Beach', label: 'Beach', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Beach').length },
                      { id: 'Honeymoon', label: 'Honeymoon', count: HOLIDAY_RESULTS.filter((p) => p.theme === 'Honeymoon').length },
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
                              className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600"
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
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600"
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
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600"
                      />
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
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
          <main className="lg:col-span-9 space-y-4">
            {/* MakeMyTrip Style Horizontal Quick Sort Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <span>Sort By:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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

            {/* ===============================================================
                1. FLIGHT RESULTS LIST (ONE-WAY & ROUND-TRIP LAYOUTS)
            =============================================================== */}
            {currentCategory === 'flights' && (
              <div className="space-y-4">
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

                          {/* Quick Sort Chips */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-400 font-medium">{processedFlights.length} Flights Found</span>
                            <div className="flex items-center gap-1">
                              {(['cheapest', 'fastest', 'departure'] as const).map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setSortBy(s)}
                                  className={`px-2 py-0.5 rounded-md font-semibold capitalize cursor-pointer transition-colors ${
                                    sortBy === s ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
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
                                    {/* Radio Button */}
                                    <div
                                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                      }`}
                                    >
                                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div
                                      className={`w-6 h-6 rounded-md ${fl.badgeBg} text-white font-bold flex items-center justify-center text-[10px] shadow-2xs`}
                                    >
                                      {fl.badgeCode}
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs text-slate-900 leading-tight">
                                        {fl.airline}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-mono">{fl.flightNo}</div>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-black text-sm sm:text-base text-slate-900 font-mono">
                                      {formatPrice(fl.priceInr, currency)}
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-medium">per adult</div>
                                  </div>
                                </div>

                                {/* Timings & Stops */}
                                <div className="pt-2.5 flex items-center justify-between gap-2">
                                  <div className="text-left">
                                    <div className="font-extrabold text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.depTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentFromCity.code}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500">{fl.duration}</span>
                                    <div className="w-16 sm:w-20 h-[2px] bg-slate-300 relative my-0.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute right-0 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-600">{fl.stops}</span>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-extrabold text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.arrTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentToCity.code}
                                    </div>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="mt-2 pt-1.5 border-t border-blue-100 flex items-center justify-between text-[10px] text-blue-700 font-semibold">
                                    <span>Selected Outbound Flight</span>
                                    <span className="text-emerald-600">Free In-flight Meal</span>
                                  </div>
                                )}
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

                          {/* Quick Sort Chips */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-400 font-medium">
                              {processedReturnFlights.length} Flights Found
                            </span>
                            <div className="flex items-center gap-1">
                              {(['cheapest', 'fastest', 'departure'] as const).map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setReturnSortBy(s)}
                                  className={`px-2 py-0.5 rounded-md font-semibold capitalize cursor-pointer transition-colors ${
                                    returnSortBy === s
                                      ? 'bg-blue-600 text-white shadow-2xs'
                                      : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
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
                                    {/* Radio Button */}
                                    <div
                                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                      }`}
                                    >
                                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div
                                      className={`w-6 h-6 rounded-md ${fl.badgeBg} text-white font-bold flex items-center justify-center text-[10px] shadow-2xs`}
                                    >
                                      {fl.badgeCode}
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs text-slate-900 leading-tight">
                                        {fl.airline}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-mono">{fl.flightNo}</div>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-black text-sm sm:text-base text-slate-900 font-mono">
                                      {formatPrice(fl.priceInr, currency)}
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-medium">per adult</div>
                                  </div>
                                </div>

                                {/* Timings & Stops */}
                                <div className="pt-2.5 flex items-center justify-between gap-2">
                                  <div className="text-left">
                                    <div className="font-extrabold text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.depTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentToCity.code}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500">{fl.duration}</span>
                                    <div className="w-16 sm:w-20 h-[2px] bg-slate-300 relative my-0.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute right-0 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-600">{fl.stops}</span>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-extrabold text-slate-900 text-sm sm:text-base font-mono">
                                      {fl.arrTime}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">
                                      {currentFromCity.code}
                                    </div>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="mt-2 pt-1.5 border-t border-blue-100 flex items-center justify-between text-[10px] text-blue-700 font-semibold">
                                    <span>Selected Return Flight</span>
                                    <span className="text-emerald-600">Complimentary Snack</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Inline Round-Trip Summary & Book Now Card */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/30">
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                            {currentTripType === 'dummy-flights' ? 'Verifiable PNR Itinerary' : 'Combo Saver Deal'}
                          </span>
                          <span className="text-xs text-slate-300 font-semibold">
                            {currentFromCity.code} ⇄ {currentToCity.code} · {currentTravellers} Traveller{currentTravellers > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-200">
                          {selectedOutboundFlight.airline} ({selectedOutboundFlight.depTime}) + {selectedReturnFlight.airline} ({selectedReturnFlight.depTime})
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
                        <div className="text-center sm:text-right">
                          <div className="text-[11px] text-blue-200 font-medium">Total Round-Trip Fare</div>
                          <div className="text-2xl font-black text-amber-300 font-mono">
                            {formatPrice(totalRoundTripFare, currency)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setFlightForFareModal({
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
                            })
                          }
                          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer transition-all hover:shadow-xl"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
                                <div className="font-bold text-slate-900 text-sm sm:text-base">{fl.airline}</div>
                                <div className="text-xs text-slate-500 font-mono">
                                  {fl.flightNo} · {fl.aircraft.split('·')[0]}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 sm:gap-8 flex-1 justify-center">
                              <div className="text-left">
                                <div className="font-extrabold text-slate-900 text-lg sm:text-xl font-mono">
                                  {fl.depTime}
                                </div>
                                <div className="text-xs font-semibold text-slate-700">{currentFromCity.code}</div>
                                <div className="text-[11px] text-slate-400">{fl.depTerminal}</div>
                              </div>

                              <div className="flex flex-col items-center">
                                <span className="text-[11px] text-slate-500 font-medium">{fl.duration}</span>
                                <div className="w-24 sm:w-32 h-[2px] bg-slate-300 relative my-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-600 absolute right-0 top-1/2 -translate-y-1/2" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600">{fl.stops}</span>
                              </div>

                              <div className="text-right">
                                <div className="font-extrabold text-slate-900 text-lg sm:text-xl font-mono">
                                  {fl.arrTime}
                                </div>
                                <div className="text-xs font-semibold text-slate-700">{currentToCity.code}</div>
                                <div className="text-[11px] text-slate-400">{fl.arrTerminal}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                              <div className="text-right">
                                <div className="text-xl sm:text-2xl font-black text-slate-900">
                                  {formatPrice(fl.priceInr, currency)}
                                </div>
                                <div className="text-[11px] text-emerald-600 font-medium">Free Meal Included</div>
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
                                <span>Book Now</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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
                {processedHotels.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                    <Hotel className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-base text-slate-800">No hotels match your filters</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try clearing some filters on the left panel or search with a different keyword.
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
                {/* Top Promo Banner */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Bus className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                        <span>Guaranteed Clean Buses &amp; Live GPS Tracking</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-extrabold uppercase">
                          redBus Primo
                        </span>
                      </h3>
                      <p className="text-xs text-indigo-200 mt-0.5">
                        Women-only single berths reserved · 98% On-time guarantee or 50% refund · Free rescheduling
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-indigo-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    Instant E-Ticket on WhatsApp
                  </div>
                </div>

                {/* Active Bus Filters & Count Strip */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {processedBuses.length} Buses Found
                    </span>
                    <span className="text-xs text-slate-500">
                      {currentFromCity.city} to {currentToCity.city}
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

                    {busPrimoOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        Primo Certified
                        <button
                          type="button"
                          onClick={() => setBusPrimoOnly(false)}
                          className="hover:text-indigo-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {busSingleLadyOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                        Single Lady Berths
                        <button
                          type="button"
                          onClick={() => setBusSingleLadyOnly(false)}
                          className="hover:text-pink-900 cursor-pointer"
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
                            {bus.isPrimo && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                                Primo Certified
                              </span>
                            )}
                            {bus.hasLiveTracking && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live Tracking
                              </span>
                            )}
                            {bus.isSingleLadyBerth && (
                              <span className="text-[10px] font-bold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200">
                                Single Lady Berths
                              </span>
                            )}
                            {bus.badges.slice(0, 2).map((b) => (
                              <span
                                key={b}
                                className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                              >
                                {b}
                              </span>
                            ))}
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
                <div className="bg-gradient-to-r from-sky-800 via-blue-800 to-slate-900 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Car className="w-5 h-5 text-sky-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">All-Inclusive Outstation Cabs</h3>
                      <p className="text-xs text-sky-100">
                        Toll taxes, state entry tax &amp; driver allowance included · Zero hidden charges on highway
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-sky-200">Doorstep Pickup Guarantee</div>
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
                              <p className="text-xs text-slate-500">{cab.modelExamples}</p>
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
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" /> {cab.seats} Seats
                            </span>
                            <span className="flex items-center gap-1">
                              <Luggage className="w-3.5 h-3.5 text-slate-400" /> {cab.bags} Large Bags
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-slate-400" /> AC Included
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
                            <div className="text-2xl font-black text-slate-900">
                              {formatPrice(cab.priceInr, currency)}
                            </div>
                            <div className="text-[11px] text-emerald-600 font-semibold">Tolls &amp; Taxes Included</div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onSelectFlightOrStayForCheckout({
                                title: `${cab.cabType} (${cab.modelExamples.split(',')[0]})`,
                                code: cab.id,
                                depTime: 'Pickup: As Scheduled',
                                arrTime: 'Doorstep Drop',
                                duration: 'All-inclusive Cab',
                                priceInr: cab.priceInr,
                                category: 'cabs',
                                cabType: cab.cabType,
                              })
                            }
                            className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 cursor-pointer"
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
                {/* Promo Banner */}
                <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-slate-900 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Palmtree className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                        <span>Curated All-Inclusive Holiday Packages</span>
                        <span className="text-[10px] bg-purple-400/20 text-purple-200 border border-purple-300/30 px-2 py-0.5 rounded-full font-extrabold uppercase">
                          Book @ ₹1
                        </span>
                      </h3>
                      <p className="text-xs text-purple-200 mt-0.5">
                        Selected meals + handpicked 3★ to 5★ stays + private sightseeing cab · 100% customizable
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-purple-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    Zero Cancellation EMI Options
                  </div>
                </div>

                {/* Active Holiday Filters & Count Strip */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {processedHolidays.length} Packages Found
                    </span>
                    <span className="text-xs text-slate-500">
                      from {currentFromCity.city} to {currentToCity.city}
                    </span>
                  </div>

                  {/* Active Filter Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {holidaySearchQuery && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        "{holidaySearchQuery}"
                        <button
                          type="button"
                          onClick={() => setHolidaySearchQuery('')}
                          className="hover:text-purple-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {holidayFlightOption !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                        {holidayFlightOption === 'with-flight' ? 'Flights Included' : 'Without Flights'}
                        <button
                          type="button"
                          onClick={() => setHolidayFlightOption('all')}
                          className="hover:text-purple-950 cursor-pointer"
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

                    {holidaySelectedCities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {city}
                        <button
                          type="button"
                          onClick={() =>
                            setHolidaySelectedCities((prev) => prev.filter((c) => c !== city))
                          }
                          className="hover:text-blue-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {holidayBookAtOneRupeeOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                        Book @ ₹1
                        <button
                          type="button"
                          onClick={() => setHolidayBookAtOneRupeeOnly(false)}
                          className="hover:text-purple-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

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
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        Premium Packages
                        <button
                          type="button"
                          onClick={() => setHolidayPremiumOnly(false)}
                          className="hover:text-purple-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {(holidaySearchQuery ||
                      holidayFlightOption !== 'all' ||
                      holidayMinNights > 2 ||
                      holidayMaxNights < 7 ||
                      holidayBudgetBrackets.length > 0 ||
                      holidayHotelCategories.length > 0 ||
                      holidaySelectedCities.length > 0 ||
                      holidayBookAtOneRupeeOnly ||
                      holidaySelectedThemes.length > 0 ||
                      holidayCustomizableOnly ||
                      holidayPremiumOnly) && (
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
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-xs">
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
                                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
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

                                  <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-purple-700 transition-colors">
                                    {pkg.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                    Stay: {pkg.hotelStayTitle}
                                  </p>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-xs">
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
                                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
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
                                  onClick={() =>
                                    onSelectFlightOrStayForCheckout({
                                      title: pkg.title,
                                      code: pkg.id,
                                      depTime: pkg.flightsIncluded ? 'Return Flights + Hotel' : 'Hotel + Sightseeing',
                                      arrTime: `${pkg.durationNights} (${pkg.destination})`,
                                      duration: pkg.durationNights,
                                      priceInr: pkg.startingPricePerPersonInr,
                                      category: 'holidays',
                                      holidayTheme: pkg.theme,
                                    })
                                  }
                                  className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 cursor-pointer transition-all active:scale-95"
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
                                  <span className="font-bold text-xs font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded shrink-0 self-start">
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
      {currentCategory === 'flights' && isFlightRoundTrip && (
        <aside
          aria-label="Selected Round-Trip Booking Summary"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-3 px-3 sm:px-6 animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                    {selectedOutboundFlight.airline}{' '}
                    <span className="font-mono text-[10px] sm:text-[11px] text-slate-500 font-normal">
                      ({selectedOutboundFlight.flightNo})
                    </span>
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
                    {selectedReturnFlight.airline}{' '}
                    <span className="font-mono text-[10px] sm:text-[11px] text-slate-500 font-normal">
                      ({selectedReturnFlight.flightNo})
                    </span>
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
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono leading-tight">
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
                  })
                }
                className="px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-black text-xs sm:text-base shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all hover:shadow-xl group"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Flight Fare Options (Saver, Flexi Plus, Corporate, SpiceMax) Modal */}
      {flightForFareModal && (
        <FlightFareOptionsModal
          flight={flightForFareModal}
          currency={currency}
          onSelectFareAndProceed={(fareTier, finalPriceInr) => {
            onSelectFlightOrStayForCheckout({
              title: `${flightForFareModal.airline} ${flightForFareModal.flightNo} (${fareTier.name})`,
              code: flightForFareModal.id,
              depTime: flightForFareModal.depTime,
              arrTime: flightForFareModal.arrTime,
              duration: flightForFareModal.duration,
              priceInr: finalPriceInr,
              category: 'flights',
              airline: flightForFareModal.airline,
              flightNo: flightForFareModal.flightNo,
              cabinClass: currentCabinClass || 'Economy',
              roomType: fareTier.name,
              fromCity: `${currentFromCity.city} (${currentFromCity.code})`,
              toCity: `${currentToCity.city} (${currentToCity.code})`,
              travellers: currentTravellers,
            });
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
    </div>
  );
};
