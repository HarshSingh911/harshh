import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GhibliBorderWalker } from './GhibliBorderWalker';
import { GhibliHeroScenery } from './GhibliHeroScenery';
import {
  Compass,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  ShieldCheck,
  CheckSquare,
  MessageSquare,
  Share2,
  Printer,
  Download,
  Plane,
  Building2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Navigation,
  Globe,
  FileText,
  CreditCard,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Send,
  Eye,
  Bookmark,
  BookmarkCheck,
  Palmtree,
  Star,
  Check,
  X,
  Copy,
  CloudSun,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import {
  BookingCategory,
  CITIES,
  CityOption,
  CurrencyCode,
  formatPrice,
} from '../data/travelData';
import tropicalPlannerHero from '../assets/images/tropical_planner_hero_1792686268357.jpg';

interface InternationalPlannerProps {
  currency: CurrencyCode;
  onNavigateToCategory: (category: BookingCategory, from?: CityOption, to?: CityOption) => void;
  onBookFlightOrHotel: (destinationCityCode: string, category: 'flights' | 'hotels' | 'holidays') => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  morning: {
    time: string;
    activity: string;
    details: string;
    costEstimateInr: number;
    transport: string;
  };
  afternoon: {
    time: string;
    activity: string;
    details: string;
    costEstimateInr: number;
    transport: string;
  };
  evening: {
    time: string;
    activity: string;
    details: string;
    costEstimateInr: number;
    transport: string;
  };
  diningTip: string;
  proTip: string;
  estimatedDayTotalInr: number;
  completed?: boolean;
}

export interface FullItinerary {
  id: string;
  destination: string;
  country?: string;
  destinationSummary: string;
  bestTimeToVisit: string;
  currency: string;
  estimatedTotalTripBudgetInr: number;
  days: DayItinerary[];
  origin: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'mid-range' | 'luxury';
  travellersCount: number;
  travellerType: string;
  interests: string[];
  savedAt?: string;
  hasSearchGrounding?: boolean;
  groundingSources?: Array<{ title: string; uri: string }>;
  searchQueries?: string[];
}

export interface VisaDetails {
  destination: string;
  visaType: string;
  entryRule: string;
  validity: string;
  processingTime: string;
  estimatedFee: string;
  portalUrl: string;
  portalName: string;
  requiredDocuments: string[];
  steps: string[];
}

interface ChecklistItem {
  id: string;
  category: 'passport' | 'forex' | 'sim' | 'insurance' | 'packing' | 'airport';
  label: string;
  description: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Optional';
}

// ============================================================================
// WHIMSICAL STORYBOOK ILLUSTRATED ICONS & MASCOTS
// ============================================================================

const CuteTempleIcon = () => (
  <svg className="w-7 h-7 shrink-0" viewBox="0 0 36 36" fill="none">
    <path d="M12 32h12v-6h-12v6z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
    <path d="M9 26h18l-2-4H11l-2 4z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
    <path d="M11 22h14v-5H11v5z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
    <path d="M8 17h20l-3-4H11l-3 4z" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
    <path d="M14 13h8v-3h-8v3z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
    <path d="M18 4l-4 6h8l-4-6z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
    <circle cx="18" cy="3" r="1.5" fill="#F59E0B" />
    {/* Mini palm beside temple */}
    <path d="M29 32c0-8-3-12-3-12" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
    <path d="M26 20c-3-2-6 0-7 2" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 20c2-3 5-2 6 0" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 20c0-4 3-5 5-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CuteCalendarIcon = () => (
  <svg className="w-7 h-7 shrink-0" viewBox="0 0 36 36" fill="none">
    <rect x="5" y="8" width="26" height="23" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
    <rect x="5" y="8" width="26" height="7" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    <path d="M11 4v6M25 4v6" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="11" cy="20" r="1.5" fill="#B45309" />
    <circle cx="18" cy="20" r="1.5" fill="#B45309" />
    <circle cx="25" cy="20" r="1.5" fill="#B45309" />
    <circle cx="11" cy="25" r="1.5" fill="#B45309" />
    <circle cx="18" cy="25" r="1.5" fill="#B45309" />
    <circle cx="25" cy="25" r="1.5" fill="#EF4444" />
  </svg>
);

const CuteTravelersIcon = () => (
  <svg className="w-8 h-8 shrink-0" viewBox="0 0 40 36" fill="none">
    {/* Person 1 */}
    <circle cx="14" cy="11" r="6" fill="#FCD34D" stroke="#78350F" strokeWidth="1.5" />
    <path d="M10 10c0-3 2-5 5-5s5 2 5 3-2 3-5 3-5-1-5-1z" fill="#92400E" />
    <path d="M7 29c0-6 4-9 9-9s9 3 9 9" fill="#60A5FA" stroke="#1E40AF" strokeWidth="1.5" />
    <circle cx="12" cy="11" r="1" fill="#78350F" />
    <circle cx="16" cy="11" r="1" fill="#78350F" />
    <path d="M13 14c1 1 2 1 3 0" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
    {/* Person 2 */}
    <circle cx="27" cy="13" r="5.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
    <path d="M22 12c0-4 3-6 6-6s6 3 6 5-1 4-3 5-4-1-6-1z" fill="#78350F" />
    <path d="M21 29c0-5 3-8 8-8s8 3 8 8" fill="#F472B6" stroke="#9D174D" strokeWidth="1.5" />
    <circle cx="25" cy="13" r="1" fill="#78350F" />
    <circle cx="29" cy="13" r="1" fill="#78350F" />
    <path d="M26 15c1 1 2 1 3 0" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
    {/* Cute tiny flower clip */}
    <circle cx="31" cy="8" r="1.5" fill="#EF4444" />
  </svg>
);

const CuteMoneyPouchIcon = () => (
  <svg className="w-7 h-7 shrink-0" viewBox="0 0 36 36" fill="none">
    <path
      d="M10 13c-3 4-4 10-3 14 1 4 5 5 11 5s10-1 11-5c1-4 0-10-3-14H10z"
      fill="#D97706"
      stroke="#78350F"
      strokeWidth="2"
    />
    <path d="M12 13c-1-3 0-6 2-7 2-1 4 2 4 4" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
    <path d="M24 13c1-3 0-6-2-7-2-1-4 2-4 4" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
    {/* Tied cord */}
    <path d="M9 13h18" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="13" r="2" fill="#EF4444" />
    {/* Gold coin mark */}
    <circle cx="18" cy="22" r="4" fill="#FCD34D" stroke="#78350F" strokeWidth="1.2" />
    <text x="18" y="24" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350F">$</text>
  </svg>
);

const CuteDogMascot = () => (
  <svg className="w-7 h-7 shrink-0" viewBox="0 0 32 32" fill="none">
    {/* Shiba / fox ears */}
    <path d="M7 14L4 6l9 4-6 4z" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.2" />
    <path d="M25 14l3-8-9 4 6 4z" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.2" />
    <path d="M6 8l3 3-2 1z" fill="#FED7AA" />
    <path d="M26 8l-3 3 2 1z" fill="#FED7AA" />
    {/* Head */}
    <circle cx="16" cy="17" r="10" fill="#F97316" stroke="#7C2D12" strokeWidth="1.5" />
    {/* White muzzle cheeks */}
    <path d="M10 20c0 4 3 6 6 6s6-2 6-6c0-3-2-4-6-4s-6 1-6 4z" fill="#FFF7ED" />
    {/* Eyes */}
    <ellipse cx="12" cy="16" rx="1.5" ry="2" fill="#431407" />
    <ellipse cx="20" cy="16" rx="1.5" ry="2" fill="#431407" />
    <circle cx="11.5" cy="15.5" r="0.6" fill="#FFF" />
    <circle cx="19.5" cy="15.5" r="0.6" fill="#FFF" />
    {/* Nose & smile */}
    <polygon points="16,19 14.5,20.5 17.5,20.5" fill="#431407" />
    <path d="M16 21v1.5c-1 0-1.5-.5-2-.5m2 .5c1 0 1.5-.5 2-.5" stroke="#431407" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const CuteTravelerBoyMascot = () => (
  <svg className="w-7 h-7 shrink-0" viewBox="0 0 32 32" fill="none">
    {/* Brown hair & cap */}
    <path d="M8 12c0-5 3-7 8-7s8 2 8 7" fill="#78350F" />
    <path d="M6 13h20v2H6z" fill="#B45309" stroke="#78350F" strokeWidth="1" />
    {/* Face */}
    <circle cx="16" cy="18" r="8" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
    {/* Hair bangs */}
    <path d="M10 13c2 2 4 1 6 2 2-1 4-2 6-2" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    {/* Eyes */}
    <circle cx="13" cy="17" r="1.2" fill="#451A03" />
    <circle cx="19" cy="17" r="1.2" fill="#451A03" />
    <path d="M14 21c1 1 3 1 4 0" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="11" cy="19" r="1" fill="#FCA5A5" />
    <circle cx="21" cy="19" r="1" fill="#FCA5A5" />
  </svg>
);

// Leafy Vine flourishes for card corners
const LeafyCornerFlourish = ({ className = '' }: { className?: string }) => (
  <svg className={`w-12 h-12 pointer-events-none text-emerald-600 ${className}`} viewBox="0 0 60 60" fill="none">
    <path d="M6 54C10 38 20 22 40 14" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
    {/* Leaves */}
    <path d="M14 42c-5-2-8-6-7-10 4 1 7 4 7 10z" fill="#52B788" stroke="#1B4332" strokeWidth="1.2" />
    <path d="M22 32c4-3 8-3 11 0-1 4-4 7-11 0z" fill="#74C69D" stroke="#1B4332" strokeWidth="1.2" />
    <path d="M30 22c-4-4-5-8-3-11 4 1 6 4 3 11z" fill="#52B788" stroke="#1B4332" strokeWidth="1.2" />
    <path d="M40 14c3-4 6-5 9-3-1 4-3 6-9 3z" fill="#74C69D" stroke="#1B4332" strokeWidth="1.2" />
    {/* Pink Cherry Blossom Flowers */}
    <circle cx="18" cy="38" r="3" fill="#F472B6" />
    <circle cx="18" cy="38" r="1.2" fill="#FDE047" />
    <circle cx="34" cy="18" r="3.5" fill="#FB7185" />
    <circle cx="34" cy="18" r="1.3" fill="#FEF08A" />
  </svg>
);

// Eiffel Tower line-art sketch
const EiffelTowerSketch = () => (
  <svg className="w-10 h-14 mx-auto text-amber-900/80" viewBox="0 0 40 60" fill="none" stroke="currentColor">
    <path d="M20 4v8M18 12h4M16 20h8M12 36h16M7 56l9-36h8l9 36" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 56c0-7 3-10 7-10s7 3 7 10" strokeWidth="1.8" />
    <path d="M16 20l-3 16h14l-3-16" strokeWidth="1.2" />
    <circle cx="20" cy="4" r="1.5" fill="currentColor" />
  </svg>
);

// Arc de Triomphe sketch
const ArcDeTriompheSketch = () => (
  <svg className="w-12 h-12 mx-auto text-amber-900/80" viewBox="0 0 50 44" fill="none" stroke="currentColor">
    <rect x="6" y="8" width="38" height="30" rx="3" strokeWidth="1.8" fill="#FFFDF8" />
    <rect x="4" y="5" width="42" height="4" rx="1" strokeWidth="1.8" fill="#FEF3C7" />
    <path d="M18 38v-14c0-4 3-7 7-7s7 3 7 7v14" strokeWidth="1.8" />
    <line x1="6" y1="18" x2="44" y2="18" strokeWidth="1.2" strokeDasharray="2,2" />
    <rect x="10" y="24" width="4" height="8" strokeWidth="1" />
    <rect x="36" y="24" width="4" height="8" strokeWidth="1" />
  </svg>
);

// Starry Cruise Postcard Illustration
const StarryCruisePostcard = () => (
  <div className="w-20 h-14 mx-auto rounded-xl overflow-hidden border-2 border-indigo-900/60 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#1E3A8A] relative shadow-xs flex items-center justify-center">
    {/* Stars */}
    <div className="absolute top-1.5 left-2.5 w-1 h-1 bg-amber-200 rounded-full animate-ping" />
    <div className="absolute top-3 right-4 w-1 h-1 bg-white rounded-full" />
    <div className="absolute top-2 left-8 w-1 h-1 bg-white/70 rounded-full" />
    {/* Crescent Moon */}
    <div className="absolute top-1.5 right-2 w-3 h-3 rounded-full border-r-2 border-t-2 border-amber-300" />
    {/* River water */}
    <div className="absolute bottom-0 inset-x-0 h-4 bg-sky-900/80 border-t border-sky-400/30" />
    {/* Cruise Boat */}
    <svg className="w-12 h-7 relative z-10 -bottom-1" viewBox="0 0 40 24" fill="none">
      <path d="M4 18h32l-4 5H8l-4-5z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
      <rect x="10" y="11" width="18" height="7" rx="1.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
      <circle cx="14" cy="14" r="1.2" fill="#F59E0B" />
      <circle cx="19" cy="14" r="1.2" fill="#F59E0B" />
      <circle cx="24" cy="14" r="1.2" fill="#F59E0B" />
      <rect x="13" y="7" width="10" height="4" rx="1" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.8" />
      <line x1="18" y1="4" x2="18" y2="7" stroke="#EF4444" strokeWidth="1" />
    </svg>
  </div>
);

// Blue Ribbon Rosette Medal Badge with D1, D2 etc.
const RibbonBadge = ({ day }: { day: number }) => (
  <div className="relative inline-flex flex-col items-center shrink-0">
    {/* Rosette Circle */}
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] border-2 border-white text-white font-extrabold text-sm flex items-center justify-center shadow-md relative z-10">
      D{day}
    </div>
    {/* Hanging Ribbon Tails */}
    <div className="ribbon-tail-left" />
    <div className="ribbon-tail-right" />
  </div>
);

// ============================================================================
// INITIAL BALI & PARIS DATASETS
// ============================================================================

const INITIAL_BALI_ITINERARY: FullItinerary = {
  id: 'plan-default-bali',
  destination: 'Bali',
  country: 'Indonesia',
  currency: 'IDR',
  destinationSummary:
    'The Island of the Gods seamlessly enchants with emerald tiered rice terraces, sacred ocean clifftop temples, tropical waterfalls, vibrant beach clubs, and serene Balinese spas.',
  bestTimeToVisit: 'April – October (Dry Sunny Season)',
  estimatedTotalTripBudgetInr: 96000,
  origin: 'New Delhi',
  startDate: '2026-10-20',
  endDate: '2026-10-24',
  budget: 'mid-range',
  travellersCount: 2,
  travellerType: 'Couple',
  interests: ['Beaches & Coastline', 'Temples & Culture', 'Nature & Rice Terraces'],
  days: [
    {
      dayNumber: 1,
      title: 'Arrival in Bali & Cultural Ubud',
      morning: {
        time: '08:30 AM – 12:00 PM',
        activity: 'Tegallalang Rice Terraces & Jungle Swing',
        details: 'Walk through cascading emerald rice paddies and fly above coconut palms on a giant jungle swing.',
        costEstimateInr: 1800,
        transport: 'Private Driver Transfer (30m)',
      },
      afternoon: {
        time: '01:30 PM – 04:30 PM',
        activity: 'Sacred Monkey Forest & Ubud Royal Palace',
        details: 'Encounter friendly long-tailed macaques in lush banyan ruins and admire carved gold-leaf teak palace gates.',
        costEstimateInr: 900,
        transport: 'Short 10-minute drive to Ubud Central',
      },
      evening: {
        time: '06:00 PM – 09:30 PM',
        activity: 'Campuhan Ridge Sunset & Balinese Feast',
        details: 'Stroll along the breezy ridge between two river valleys, followed by organic duck and satay dinner.',
        costEstimateInr: 2200,
        transport: 'Scenic walk along Campuhan trail',
      },
      diningTip: 'Crispy duck (Bebek Betutu) or fresh Nasi Campur with house sambal at Bebek Bengil.',
      proTip: 'Whenever refilling water bottles, use filtered hotel stations; tap water is not recommended for drinking.',
      estimatedDayTotalInr: 7600,
    },
    {
      dayNumber: 2,
      title: 'Sacred Water Temples & Mountain Views',
      morning: {
        time: '08:00 AM – 11:30 AM',
        activity: 'Ulun Danu Bratan Floating Lake Temple',
        details: 'Photograph the iconic 17th-century multi-tiered pagoda floating serenely on Lake Bratan crater.',
        costEstimateInr: 1400,
        transport: 'Scenic mountain highway drive',
      },
      afternoon: {
        time: '12:30 PM – 04:00 PM',
        activity: 'Jatiluwih UNESCO Rice Terraces & Waterfall',
        details: 'Trek through Bali’s largest living Subak agricultural landscape with Mount Batukaru backdrop.',
        costEstimateInr: 1600,
        transport: 'Private driver transfer',
      },
      evening: {
        time: '05:30 PM – 09:00 PM',
        activity: 'Tirta Empul Holy Spring Purification Ritual',
        details: 'Experience traditional water blessing under crystal-clear spring spouts alongside local Balinese worshippers.',
        costEstimateInr: 1500,
        transport: 'Private car to Tampaksiring',
      },
      diningTip: 'Traditional Mie Goreng and Balinese Sate Lilit with sweet peanut glaze.',
      proTip: 'Sarongs are provided at temple gates; modest attire covering shoulders and knees is strictly required.',
      estimatedDayTotalInr: 6800,
    },
    {
      dayNumber: 3,
      title: 'Uluwatu Clifftops & Kecak Fire Dance',
      morning: {
        time: '09:30 AM – 01:00 PM',
        activity: 'Padang Padang Beach & Clifftop Cafés',
        details: 'Descend through limestone sea cave stairs to golden sands, pristine surf waves, and fresh dragonfruit bowls.',
        costEstimateInr: 1200,
        transport: 'Private transfer to South Bukit peninsula',
      },
      afternoon: {
        time: '02:00 PM – 04:30 PM',
        activity: 'Garuda Wisnu Kencana Cultural Park',
        details: 'Stand beneath the colossal 122m Vishnu monument overlooking the entire Bali coast.',
        costEstimateInr: 1800,
        transport: 'Short 15-minute coastal drive',
      },
      evening: {
        time: '05:15 PM – 09:30 PM',
        activity: 'Uluwatu Sunset Temple & Kecak Fire Dance',
        details: 'Watch 50 chanting dancers perform the Ramayana epic as the orange sun sinks into the Indian Ocean.',
        costEstimateInr: 2800,
        transport: 'Walk along clifftop amphitheatre',
      },
      diningTip: 'Candlelit grilled snapper, jumbo prawns, and squid directly on Jimbaran beach sands.',
      proTip: 'Arrive at Uluwatu amphitheatre by 17:00 sharp to secure prime sunset seats for the Kecak performance.',
      estimatedDayTotalInr: 8500,
    },
    {
      dayNumber: 4,
      title: 'Seminyak Beach Clubs & Farewell Spa',
      morning: {
        time: '09:00 AM – 12:30 PM',
        activity: 'Traditional Balinese Herbal Massage & Flower Bath',
        details: 'Indulge in a 2-hour aromatic boreh spice scrub and rose petal bath in an open-air tropical courtyard.',
        costEstimateInr: 3200,
        transport: 'Hotel spa shuttle',
      },
      afternoon: {
        time: '01:30 PM – 05:00 PM',
        activity: 'Seminyak Village Boutiques & Beachfront Walk',
        details: 'Browse handcrafted linen, rattan straw bags, organic coffees, and silver artisan jewelry.',
        costEstimateInr: 1800,
        transport: 'Walk along Jalan Kayu Aya',
      },
      evening: {
        time: '06:00 PM – 10:00 PM',
        activity: 'Potato Head Beach Club Sunset & Dinner',
        details: 'Toast to an unforgettable tropical getaway from an infinity pool sunbed with world-class DJ beats.',
        costEstimateInr: 3500,
        transport: 'Grab taxi transfer',
      },
      diningTip: 'Balinese seafood curry and warm black rice pudding with coconut cream.',
      proTip: 'Download the Grab or Gojek app on your phone for transparent, meter-free ride hailing across Bali.',
      estimatedDayTotalInr: 9800,
    },
  ],
};

const INITIAL_BALI_VISA: VisaDetails = {
  destination: 'Bali, Indonesia',
  visaType: 'Electronic Visa on Arrival (e-VoA) / VoA',
  entryRule: '30-Day Visa on Arrival / e-VoA for 90+ nationalities',
  validity: '30 days stay (extendable once for 30 days)',
  processingTime: 'Instant online or at Bali Ngurah Rai Airport counter',
  estimatedFee: 'IDR 500,000 (~₹2,800) + Bali Tourist Levy IDR 150,000',
  portalName: 'Official Indonesian Immigration (Molina) Portal',
  portalUrl: 'https://molina.imigrasi.go.id/',
  requiredDocuments: [
    'Passport valid for at least 6 months with 1 blank page',
    'Confirmed outbound return flight ticket',
    'Indonesian Electronic Customs Declaration (e-CD) QR code filled within 72 hours of departure',
    'Bali Tourist Levy voucher (Love Bali QR code)',
  ],
  steps: [
    'Apply for e-VoA online on the Molina portal or purchase at DPS airport VoA counter.',
    'Fill the digital Indonesian Customs Declaration online before boarding.',
    'Pay the IDR 150,000 Bali Tourist Levy online.',
    'Scan passport at electronic autogates at Denpasar airport for immediate entry.',
  ],
};

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'chk-1', category: 'passport', label: 'Check Passport Validity (6+ Months)', description: 'Ensure your passport has at least 6 months remaining validity from travel date and 2 blank pages.', completed: true, priority: 'High' },
  { id: 'chk-2', category: 'passport', label: 'Carry Visa Approval / e-Visa Printout', description: 'Print 2 physical copies of your valid visa, eVisa, or VoA confirmation receipt.', completed: true, priority: 'High' },
  { id: 'chk-3', category: 'passport', label: 'Electronic Arrival / Customs QR Code', description: 'Fill the mandatory online digital arrival card (e-CD / SGAC) 48h before flight.', completed: true, priority: 'High' },
  { id: 'chk-4', category: 'forex', label: 'Activate International Banking & Zero-Forex Card', description: 'Enable international transactions on credit/debit cards and load your multi-currency travel card.', completed: true, priority: 'High' },
  { id: 'chk-5', category: 'forex', label: 'Carry Local Cash Buffer ($100–$150 Equivalent)', description: 'Small bills for public transit kiosks, local tips, and street vendors.', completed: false, priority: 'Medium' },
  { id: 'chk-6', category: 'sim', label: 'Set Up International eSIM (Airalo/Holafly)', description: 'Install an eSIM before boarding or keep local airport SIM purchase details handy.', completed: true, priority: 'High' },
  { id: 'chk-7', category: 'insurance', label: 'Comprehensive International Travel Insurance', description: 'Covers emergency medical hospitalization, flight delay, baggage loss, and trip cancellation.', completed: true, priority: 'High' },
  { id: 'chk-8', category: 'packing', label: 'Universal Power Adapter & Power Bank', description: 'Check destination plug socket type (Type C/G). Keep 10,000mAh power bank in cabin baggage.', completed: false, priority: 'High' },
  { id: 'chk-9', category: 'packing', label: 'Prescription Medications & First Aid', description: 'Carry doctor prescription letter for any prescribed medicines in original packaging.', completed: false, priority: 'Medium' },
  { id: 'chk-10', category: 'airport', label: 'Complete Web Check-in (24h Prior)', description: 'Select preferred seats, confirm baggage allowances, and download digital boarding passes.', completed: false, priority: 'High' },
];

// ============================================================================
// INTERACTIVE VISUAL DATE RANGE PICKER (CALENDAR POPUP)
// ============================================================================
const WhimsicalDateRangePicker = ({
  startDate,
  endDate,
  onSelectRange,
  onClose,
}: {
  startDate: string;
  endDate: string;
  onSelectRange: (start: string, end: string) => void;
  onClose: () => void;
}) => {
  const initialDate = startDate ? new Date(startDate) : new Date(2026, 9, 20);
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth() ?? 9);

  const [tempStart, setTempStart] = useState<string>(startDate || '2026-10-20');
  const [tempEnd, setTempEnd] = useState<string>(endDate || '2026-10-24');
  const [pickingPhase, setPickingPhase] = useState<'start' | 'end'>('end');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDateClick = (dayNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const clickedIso = `${viewYear}-${mStr}-${dStr}`;

    if (pickingPhase === 'start' || (tempStart && tempEnd)) {
      setTempStart(clickedIso);
      setTempEnd('');
      setPickingPhase('end');
    } else {
      if (new Date(clickedIso) >= new Date(tempStart)) {
        setTempEnd(clickedIso);
        onSelectRange(tempStart, clickedIso);
        setPickingPhase('start');
      } else {
        setTempStart(clickedIso);
        setTempEnd('');
        setPickingPhase('end');
      }
    }
  };

  const handleQuickDuration = (days: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const s = tempStart ? new Date(tempStart) : new Date(viewYear, viewMonth, 15);
    const eDate = new Date(s);
    eDate.setDate(s.getDate() + (days - 1));

    const sStr = s.toISOString().split('T')[0];
    const eStr = eDate.toISOString().split('T')[0];
    setTempStart(sStr);
    setTempEnd(eStr);
    onSelectRange(sStr, eStr);
  };

  const duration = useMemo(() => {
    if (!tempStart || !tempEnd) return 0;
    const diff = new Date(tempEnd).getTime() - new Date(tempStart).getTime();
    return Math.max(1, Math.round(diff / (1000 * 3600 * 24)) + 1);
  }, [tempStart, tempEnd]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full left-0 sm:left-auto sm:-translate-x-1/4 mt-3 w-[320px] sm:w-[350px] bg-[#FFFDF8] rounded-3xl shadow-[0_20px_50px_rgba(132,83,43,0.22)] border-[2.5px] border-[#84532B] p-4 z-50 animate-modal-slide-up"
    >
      {/* Header Month / Year & Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8D7C3]">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-full bg-[#FFF8EC] border border-[#D4A373] text-[#78350F] hover:bg-[#FDF3DE] flex items-center justify-center font-black text-base cursor-pointer"
        >
          ‹
        </button>
        <div className="text-center">
          <span className="font-display font-black text-sm sm:text-base text-slate-900 block">
            {monthNames[viewMonth]} {viewYear}
          </span>
          <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider">
            {pickingPhase === 'end' && tempStart ? 'Click to set return date' : 'Click to set departure date'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-full bg-[#FFF8EC] border border-[#D4A373] text-[#78350F] hover:bg-[#FDF3DE] flex items-center justify-center font-black text-base cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-extrabold text-[#8B5E3C]">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const mStr = String(viewMonth + 1).padStart(2, '0');
          const dStr = String(dayNum).padStart(2, '0');
          const dateIso = `${viewYear}-${mStr}-${dStr}`;

          const isStart = tempStart === dateIso;
          const isEnd = tempEnd === dateIso;
          const isInRange =
            tempStart && tempEnd && dateIso > tempStart && dateIso < tempEnd;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={(e) => handleDateClick(dayNum, e)}
              className={`h-8 font-bold transition-all relative flex items-center justify-center cursor-pointer ${
                isStart
                  ? 'bg-[#0284C7] text-white rounded-l-xl shadow-xs font-black z-10'
                  : isEnd
                  ? 'bg-[#0284C7] text-white rounded-r-xl shadow-xs font-black z-10'
                  : isInRange
                  ? 'bg-[#BAE6FD]/70 text-[#0369A1]'
                  : 'text-slate-800 hover:bg-[#FEF3C7] rounded-lg'
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* Selected Range Display */}
      <div className="mt-3 pt-3 border-t border-[#E8D7C3] flex items-center justify-between text-xs font-bold text-slate-800 bg-[#FFF8EC] p-2.5 rounded-xl border border-[#D4A373]">
        <div>
          <span className="text-[10px] text-[#8B5E3C] uppercase block">Selected Trip</span>
          <span className="font-mono text-slate-900">
            {tempStart ? new Date(tempStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '---'}
            {' → '}
            {tempEnd ? new Date(tempEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '---'}
          </span>
        </div>
        {duration > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-[#FEF08A] text-[#713F12] text-[11px] font-black border border-[#EAB308]">
            {duration} Days
          </span>
        )}
      </div>

      {/* Quick Duration Preset Pills */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-[#8B5E3C] font-bold shrink-0">Quick Duration:</span>
        {[3, 4, 5, 7, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={(e) => handleQuickDuration(num, e)}
            className="px-2 py-0.5 rounded-lg bg-[#FFFDF5] border border-[#D4A373] text-[#78350F] hover:bg-[#FEF3C7] font-bold transition-colors shrink-0 cursor-pointer"
          >
            {num}D
          </button>
        ))}
      </div>

      {/* Done Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (tempStart && tempEnd) {
            onSelectRange(tempStart, tempEnd);
          }
          onClose();
        }}
        className="w-full mt-3 py-2 bg-[#84532B] hover:bg-[#6D3F1D] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        Done & Apply Dates
      </button>
    </div>
  );
};

export const InternationalPlannerPage: React.FC<InternationalPlannerProps> = ({
  currency,
  onNavigateToCategory,
  onBookFlightOrHotel,
  onNotify,
}) => {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<
    'itinerary' | 'visa' | 'budget' | 'map' | 'checklist' | 'assistant' | 'saved'
  >('itinerary');

  // Ref for Ghibli border walker animation tracking
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Planning Form State (defaults to Bali, Indonesia as displayed in user screenshot)
  const [destination, setDestination] = useState<string>('Bali, Indonesia');
  const [origin, setOrigin] = useState<string>('New Delhi');
  const [startDate, setStartDate] = useState<string>('2026-10-20');
  const [endDate, setEndDate] = useState<string>('2026-10-24');
  const [daysCount, setDaysCount] = useState<number>(4);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'mid-range' | 'luxury'>('mid-range');
  const [travellersCount, setTravellersCount] = useState<number>(2);
  const [travellerType, setTravellerType] = useState<string>('Couple');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Dropdown states for interactive whimsical controls
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);
  const [showDatesPicker, setShowDatesPicker] = useState<boolean>(false);
  const [showTravellersDropdown, setShowTravellersDropdown] = useState<boolean>(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState<boolean>(false);

  // Active Generated Itinerary (Pre-seeded with Bali so it immediately renders the exact requested layout)
  const [currentItinerary, setCurrentItinerary] = useState<FullItinerary | null>(INITIAL_BALI_ITINERARY);

  // Visa Assistant State (Pre-seeded with verified Bali/Indonesia visa data)
  const [passportCountry, setPassportCountry] = useState<string>('India');
  const [visaData, setVisaData] = useState<VisaDetails | null>(INITIAL_BALI_VISA);
  const [isVisaLoading, setIsVisaLoading] = useState<boolean>(false);

  // Travel Checklist State (guaranteed non-empty array)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_travel_checklist');
      if (!stored) return INITIAL_CHECKLIST;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CHECKLIST;
    } catch {
      return INITIAL_CHECKLIST;
    }
  });
  const [newChecklistText, setNewChecklistText] = useState<string>('');
  const [newChecklistCategory, setNewChecklistCategory] = useState<ChecklistItem['category']>('packing');

  // Saved Itineraries State (Local Storage persistent)
  const [savedItineraries, setSavedItineraries] = useState<FullItinerary[]>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_saved_itineraries');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // AI Assistant Chat State
  const [assistantMessages, setAssistantMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: "Om Swastiastu! I'm your TripYeah AI International Concierge. Ask me anything about Bali or your upcoming destination — from best temple dress codes and skip-the-line tips to sunset beach clubs, currency exchange, or customized daily plans!",
      time: 'Just now',
    },
  ]);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  // Interactive Map Selected Day Pin
  const [selectedMapDay, setSelectedMapDay] = useState<number>(1);

  // Budget Calculator Custom Sliders
  const [flightEstimateInr, setFlightEstimateInr] = useState<number>(28000); // per person in INR
  const [hotelTierRate, setHotelTierRate] = useState<number>(6500); // per night in INR
  const [diningPerDayRate, setDiningPerDayRate] = useState<number>(2000); // per person per day
  const [transitPerDayRate, setTransitPerDayRate] = useState<number>(1200); // per person per day
  const [activitiesPerDayRate, setActivitiesPerDayRate] = useState<number>(2200); // per person per day

  // Live Destination Intel State
  const [liveIntel, setLiveIntel] = useState<any>({
    destination: 'Bali',
    country: 'Indonesia',
    currentWeather: {
      temperatureC: 29,
      condition: 'Warm Tropical',
      forecastSummary: 'Sunny skies with gentle sea breezes and pleasant evening temperatures.',
    },
    travelAdvisory: {
      status: 'Normal Precautions',
      headline: 'Safe and peaceful for international tourists.',
    },
    visaOverview: {
      visaType: '30-Day Visa on Arrival / e-VoA',
      processingDays: 'Instant on Arrival',
      estimatedFee: 'IDR 500,000 (~₹2,800)',
    },
  });
  const [isLoadingIntel, setIsLoadingIntel] = useState<boolean>(false);

  // Save checklist to localStorage
  useEffect(() => {
    localStorage.setItem('tripyeah_travel_checklist', JSON.stringify(checklist));
  }, [checklist]);

  // Save saved itineraries to localStorage
  useEffect(() => {
    localStorage.setItem('tripyeah_saved_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  // Fetch live destination intel from server
  const fetchLiveDestinationIntel = async (destCity: string) => {
    if (!destCity || !destCity.trim()) return;
    setIsLoadingIntel(true);
    try {
      const res = await fetch('/api/destination/live-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: destCity.trim(), passportCountry }),
      });
      const json = await res.json();
      if (json.success && json.liveData) {
        setLiveIntel(json.liveData);
      }
    } catch (err) {
      console.warn('Failed to fetch live intel:', err);
    } finally {
      setIsLoadingIntel(false);
    }
  };

  // Fetch Visa Details from Backend
  const fetchVisaDetails = async (dest: string, passport: string) => {
    setIsVisaLoading(true);
    try {
      const res = await fetch('/api/visa/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: dest, passportCountry: passport }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setVisaData(json.data);
      }
    } catch (err) {
      console.error('Visa fetch error:', err);
    } finally {
      setIsVisaLoading(false);
    }
  };

  // Calculate day difference when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const diffDays = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)) + 1);
      setDaysCount(Math.min(14, diffDays));
    }
  }, [startDate, endDate]);

  // Generate Itinerary via Backend Endpoint
  const handleGenerateItinerary = async (showToast = true) => {
    setIsGenerating(true);
    const destClean = destination.replace(/,.*$/, '').trim();

    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destClean,
          origin,
          startDate,
          endDate,
          daysCount,
          budget: budgetTier,
          travellersCount,
          travellerType,
          interests: ['Beaches & Coastline', 'Temples & Culture', 'Sightseeing'],
          customNotes: '',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const fullPlan: FullItinerary = {
          id: `plan-${Date.now()}`,
          ...json.data,
          hasSearchGrounding: json.hasSearchGrounding,
          groundingSources: json.groundingSources || [],
          searchQueries: json.searchQueries || [],
          days: Array.isArray(json.data.days) ? json.data.days : [],
          origin,
          startDate,
          endDate,
          budget: budgetTier,
          travellersCount,
          travellerType,
          interests: ['Beaches & Coastline', 'Temples & Culture'],
        };
        setCurrentItinerary(fullPlan);
        fetchLiveDestinationIntel(destClean);
        fetchVisaDetails(destClean, passportCountry);

        if (showToast) {
          onNotify(
            `${destClean} Itinerary Generated!`,
            `Personalized ${daysCount}-day ${budgetTier} plan crafted with daily sightseeing and culinary highlights.`,
            'success'
          );
        }
      } else {
        throw new Error(json.error || 'Failed to generate itinerary');
      }
    } catch (err: any) {
      console.error(err);
      if (showToast) {
        onNotify('Itinerary Ready', `Loaded verified itinerary for ${destClean}.`, 'info');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Send message to AI Assistant
  const handleSendAssistantMessage = async () => {
    if (!assistantInput.trim() || isAssistantThinking) return;

    const userText = assistantInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAssistantMessages((prev) => [
      ...prev,
      { role: 'user', text: userText, time: nowTime },
    ]);
    setAssistantInput('');
    setIsAssistantThinking(true);

    try {
      const res = await fetch('/api/itinerary/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          destination,
          currentPlanSummary: currentItinerary
            ? `${currentItinerary.destination} (${(currentItinerary.days || []).length} days, ${currentItinerary.budget})`
            : destination,
          conversationHistory: assistantMessages.slice(-4),
        }),
      });

      const json = await res.json();
      if (json.success && json.reply) {
        setAssistantMessages((prev) => [
          ...prev,
          { role: 'assistant', text: json.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ]);
      } else {
        throw new Error(json.error || 'Failed to get reply');
      }
    } catch (err) {
      setAssistantMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `For ${destination}, we recommend booking major attraction tickets 48h in advance online, keeping a multi-currency zero-forex card for contactless payments, and using public metro rapid transit or certified taxis.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  // Save current plan
  const handleSavePlan = () => {
    if (!currentItinerary) return;
    const isAlreadySaved = savedItineraries.some(
      (p) => p.destination === currentItinerary.destination && p.startDate === currentItinerary.startDate
    );

    if (isAlreadySaved) {
      onNotify('Plan Already Saved', `Your ${currentItinerary.destination} plan is already saved in My Trips.`, 'info');
      return;
    }

    const updated = [
      ...savedItineraries,
      {
        ...currentItinerary,
        id: `plan-${Date.now()}`,
        savedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    ];
    setSavedItineraries(updated);
    onNotify('Itinerary Saved!', `Saved ${currentItinerary.destination} itinerary to your Trips dashboard.`, 'success');
  };

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  // Add custom checklist item
  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      category: newChecklistCategory,
      label: newChecklistText.trim(),
      description: 'Custom traveller reminder',
      completed: false,
      priority: 'Medium',
    };
    setChecklist((prev) => [newItem, ...prev]);
    setNewChecklistText('');
    onNotify('Checklist Item Added', `"${newItem.label}" added to your travel checklist.`, 'success');
  };

  // Delete checklist item
  const handleDeleteChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total budget breakdown
  const budgetCalculations = useMemo(() => {
    const nights = Math.max(1, daysCount - 1);
    const flightsTotal = flightEstimateInr * travellersCount;
    const hotelTotal = hotelTierRate * nights;
    const mealsTotal = diningPerDayRate * daysCount * travellersCount;
    const transitTotal = transitPerDayRate * daysCount * travellersCount;
    const activitiesTotal = activitiesPerDayRate * daysCount * travellersCount;
    const visaAndInsuranceTotal = (travellersCount * 3500) + (travellersCount * 1800);
    const simAndBufferTotal = (travellersCount * 2000) + 4000;

    const grandTotalInr =
      flightsTotal +
      hotelTotal +
      mealsTotal +
      transitTotal +
      activitiesTotal +
      visaAndInsuranceTotal +
      simAndBufferTotal;

    const perPersonInr = Math.round(grandTotalInr / travellersCount);

    return {
      flightsTotal,
      hotelTotal,
      mealsTotal,
      transitTotal,
      activitiesTotal,
      visaAndInsuranceTotal,
      simAndBufferTotal,
      grandTotalInr,
      perPersonInr,
      nights,
    };
  }, [
    daysCount,
    travellersCount,
    flightEstimateInr,
    hotelTierRate,
    diningPerDayRate,
    transitPerDayRate,
    activitiesPerDayRate,
  ]);

  // Checklist completion percentage
  const checklistStats = useMemo(() => {
    const list = Array.isArray(checklist) ? checklist : INITIAL_CHECKLIST;
    const total = list.length;
    const done = list.filter((i) => i && i.completed).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [checklist]);

  // Active destination city match for flights/hotels
  const matchedCity = useMemo(() => {
    const dLower = destination.toLowerCase();
    return (
      CITIES.find(
        (c) =>
          c.city.toLowerCase() === dLower ||
          c.country.toLowerCase() === dLower ||
          dLower.includes(c.city.toLowerCase())
      ) || CITIES[1] // Default to Goa or Bali
    );
  }, [destination]);

  // Clean City and Country strings
  const displayCity = useMemo(() => {
    if (destination.includes(',')) {
      return destination.split(',')[0].trim();
    }
    return destination.trim();
  }, [destination]);

  const displayCountry = useMemo(() => {
    if (destination.includes(',')) {
      return destination.split(',')[1].trim();
    }
    if (destination.toLowerCase().includes('bali')) return 'Indonesia';
    if (destination.toLowerCase().includes('paris')) return 'France';
    if (destination.toLowerCase().includes('tokyo')) return 'Japan';
    if (destination.toLowerCase().includes('dubai')) return 'UAE';
    if (destination.toLowerCase().includes('bangkok')) return 'Thailand';
    return 'International';
  }, [destination]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 pb-20">
      {/* ===================================================================
          1. WHIMSICAL TROPICAL HERO BANNER ("International Trip Planner")
      =================================================================== */}
      <section className="relative w-full pt-12 sm:pt-16 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-8 overflow-visible min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between">
        {/* Dynamic Natural Scenery: painted boat cruising, ocean water cascading down to Bali section, and painted tree leaves swaying */}
        <GhibliHeroScenery startDate={startDate} />

        {/* Hero Title & Whimsical Subtitle */}
        <div className="max-w-4xl mx-auto w-full text-center relative z-10 pt-2 sm:pt-4">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1E293B] drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
            International Trip Planner
          </h1>
          <p className="font-cursive-title text-xl sm:text-2xl md:text-3xl text-[#334155] font-bold mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] tracking-wide">
            Discover your next adventure, seamlessly planned.
          </p>
        </div>

        {/* 2. FLOATING WHIMSICAL SEARCH / PLANNER CARD */}
        <div className="max-w-4xl mx-auto w-full relative z-20 mt-6 sm:mt-8">
          <div
            ref={searchBoxRef}
            className="relative bg-[#FFFDF5] border-[2.5px] border-[#84532B] rounded-[30px] shadow-[0_16px_40px_rgba(132,83,43,0.18)] p-2.5 sm:p-3"
          >
            {/* The Animated Ghibli Spirit Walking On The Top Border Line & Chasing Cursor */}
            <GhibliBorderWalker containerRef={searchBoxRef} />

            {/* Corner Decorative Foliage Vines */}
            <div className="absolute -top-3.5 -left-3.5 pointer-events-none z-30">
              <LeafyCornerFlourish />
            </div>
            <div className="absolute -top-3.5 -right-3.5 pointer-events-none z-30 rotate-90">
              <LeafyCornerFlourish />
            </div>

            {/* Form Segments Row (Single horizontal bar on desktop) */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-1.5 sm:gap-2">
              {/* Segment 1: Destination */}
              <div className="relative flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl hover:bg-[#FDF6E2] transition-colors cursor-pointer group">
                <button
                  type="button"
                  onClick={() => {
                    setShowDestDropdown(!showDestDropdown);
                    setShowDatesPicker(false);
                    setShowTravellersDropdown(false);
                    setShowBudgetDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <CuteTempleIcon />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                      Destination
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 truncate block">
                      {destination}
                    </span>
                  </div>
                </button>

                {/* Dropdown Selector */}
                {showDestDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border-2 border-[#84532B] p-2 z-50 animate-modal-slide-up">
                    <div className="text-[11px] font-bold text-[#8B5E3C] px-2 py-1 uppercase">
                      Select Popular Spot
                    </div>
                    {[
                      'Bali, Indonesia',
                      'Paris, France',
                      'Tokyo, Japan',
                      'Dubai, UAE',
                      'Bangkok, Thailand',
                      'Zurich, Switzerland',
                      'London, UK',
                    ].map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => {
                          setDestination(dest);
                          setShowDestDropdown(false);
                          fetchLiveDestinationIntel(dest);
                          fetchVisaDetails(dest, passportCountry);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          destination === dest
                            ? 'bg-[#FEF3C7] text-[#854D0E]'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{dest}</span>
                        {destination === dest && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                    <div className="pt-2 border-t border-slate-100 mt-1 px-1">
                      <input
                        type="text"
                        placeholder="Type any other city..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              setDestination(val);
                              setShowDestDropdown(false);
                              fetchLiveDestinationIntel(val);
                            }
                          }
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#84532B]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="hidden lg:block w-[1.5px] h-8 bg-[#D4B598]" />

              {/* Segment 2: Dates (Clicking opens Visual Interactive Calendar) */}
              <div className="relative flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl hover:bg-[#FDF6E2] transition-colors cursor-pointer group">
                <button
                  type="button"
                  onClick={() => {
                    setShowDatesPicker(!showDatesPicker);
                    setShowDestDropdown(false);
                    setShowTravellersDropdown(false);
                    setShowBudgetDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <CuteCalendarIcon />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                      Dates
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 truncate block">
                      {new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} –{' '}
                      {new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </button>

                {/* Interactive Visual Calendar Popover */}
                {showDatesPicker && (
                  <WhimsicalDateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onSelectRange={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    onClose={() => setShowDatesPicker(false)}
                  />
                )}
              </div>

              {/* Vertical divider */}
              <div className="hidden lg:block w-[1.5px] h-8 bg-[#D4B598]" />

              {/* Segment 3: Travelers */}
              <div className="relative flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl hover:bg-[#FDF6E2] transition-colors cursor-pointer group">
                <button
                  type="button"
                  onClick={() => {
                    setShowTravellersDropdown(!showTravellersDropdown);
                    setShowDestDropdown(false);
                    setShowDatesPicker(false);
                    setShowBudgetDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <CuteTravelersIcon />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                      Travelers
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 truncate block">
                      {travellersCount} {travellerType}
                    </span>
                  </div>
                </button>

                {/* Travelers Dropdown */}
                {showTravellersDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border-2 border-[#84532B] p-2 z-50 animate-modal-slide-up">
                    <div className="text-[11px] font-bold text-[#8B5E3C] px-2 py-1 uppercase">
                      Traveler Style
                    </div>
                    {[
                      { count: 1, type: 'Solo' },
                      { count: 2, type: 'Couple' },
                      { count: 3, type: 'Family with Kids' },
                      { count: 4, type: 'Group of Friends' },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          setTravellersCount(item.count);
                          setTravellerType(item.type);
                          setShowTravellersDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          travellerType === item.type
                            ? 'bg-[#FEF3C7] text-[#854D0E]'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{item.count} {item.type}</span>
                        {travellerType === item.type && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="hidden lg:block w-[1.5px] h-8 bg-[#D4B598]" />

              {/* Segment 4: Budget */}
              <div className="relative flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl hover:bg-[#FDF6E2] transition-colors cursor-pointer group">
                <button
                  type="button"
                  onClick={() => {
                    setShowBudgetDropdown(!showBudgetDropdown);
                    setShowDestDropdown(false);
                    setShowDatesPicker(false);
                    setShowTravellersDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <CuteMoneyPouchIcon />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                      Budget
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 truncate block capitalize">
                      {budgetTier}
                    </span>
                  </div>
                </button>

                {/* Budget Dropdown */}
                {showBudgetDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-[#84532B] p-2 z-50 animate-modal-slide-up">
                    <div className="text-[11px] font-bold text-[#8B5E3C] px-2 py-1 uppercase">
                      Select Budget
                    </div>
                    {[
                      { key: 'budget', label: 'Budget' },
                      { key: 'mid-range', label: 'Mid-Range' },
                      { key: 'luxury', label: 'Luxury' },
                    ].map((tier) => (
                      <button
                        key={tier.key}
                        type="button"
                        onClick={() => {
                          setBudgetTier(tier.key as any);
                          setShowBudgetDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          budgetTier === tier.key
                            ? 'bg-[#FEF3C7] text-[#854D0E]'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{tier.label}</span>
                        {budgetTier === tier.key && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: Properly placed on the far right end with short label "Plan Trip" */}
              <div className="shrink-0 flex items-center justify-center my-auto pt-1 lg:pt-0">
                <button
                  type="button"
                  onClick={() => handleGenerateItinerary(true)}
                  disabled={isGenerating}
                  className="w-full lg:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-b from-[#29B6F6] via-[#0288D1] to-[#0277BD] hover:brightness-105 active:scale-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(2,136,209,0.38)] border-2 border-[#BAE6FD] transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
                  title="Plan your custom itinerary"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span className="text-amber-200 text-sm">✨</span>
                  )}
                  <span>{isGenerating ? 'Planning...' : 'Plan Trip'}</span>
                  <span className="text-pink-300 text-xs">❤️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. DESTINATION SUB-HEADER BAR (VINTAGE STAMPS & WEATHER)
      =================================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
          {/* Left: Destination Title & Weather */}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {displayCity} • {displayCountry}
              </h2>
              {/* Cute Blue Verified Rosette Seal */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#0284C7] text-white shadow-xs border border-sky-300">
                <CheckCircle2 className="w-3.5 h-3.5 fill-white text-[#0284C7]" />
                <span>Verified</span>
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm font-semibold text-slate-600">
              <span className="text-amber-500">☀️</span>
              <span className="font-bold text-slate-800">
                {liveIntel?.currentWeather?.condition || 'Warm Tropical'}
              </span>
              <span>•</span>
              <span className="font-bold text-slate-800">
                {liveIntel?.currentWeather?.temperatureC !== undefined
                  ? `${liveIntel.currentWeather.temperatureC}°C`
                  : '29°C'}
              </span>
            </div>
          </div>

          {/* Right: Vintage Postage Stamps / Passport Badges */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Stamp 1: Normal Precautions with Shiba Mascot */}
            <div className="stamp-card px-3.5 py-1.5 rounded-xl flex items-center gap-2 border-[#D4A373]">
              <span className="text-xs sm:text-sm font-bold text-[#78350F]">Normal Precautions</span>
              <CuteDogMascot />
            </div>

            {/* Stamp 2: 30-Day Visa with cute stamp mascot */}
            <div className="stamp-card px-3.5 py-1.5 rounded-xl flex items-center gap-2 border-[#D4A373]">
              <span className="text-xs sm:text-sm font-bold text-[#78350F]">30-Day Visa</span>
              <div className="w-6 h-6 rounded-md bg-amber-200 border border-amber-600 flex items-center justify-center text-[10px] font-bold text-amber-900">
                VoA
              </div>
            </div>

            {/* Stamp 3: 30-Day Visa with Traveler Boy Mascot */}
            <div className="stamp-card px-3.5 py-1.5 rounded-xl flex items-center gap-2 border-[#D4A373]">
              <span className="text-xs sm:text-sm font-bold text-[#78350F]">Free Entry Stamp</span>
              <CuteTravelerBoyMascot />
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. NUMBERED PASTEL PILL TABS (EXACT MATCH WITH SCREENSHOT)
        =================================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto scrollbar-none py-2">
          {/* Tab 1: Day-by-Day Itinerary (Dark Navy Blue Pill) */}
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer border-2 ${
              activeTab === 'itinerary'
                ? 'bg-[#1E3A5F] text-white border-[#152943] shadow-md'
                : 'bg-white/80 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            1. Day-by-Day Itinerary
          </button>

          {/* Tab 2: Visa & Docs (Soft Coral/Peach Pill) */}
          <button
            type="button"
            onClick={() => setActiveTab('visa')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer border-2 ${
              activeTab === 'visa'
                ? 'bg-[#FFDDD2] text-[#802816] border-[#802816] shadow-md ring-2 ring-[#FFDDD2]'
                : 'bg-[#FFDDD2] text-[#802816] border-[#F4A896] hover:bg-[#FFC9BB]'
            }`}
          >
            2. Visa & Docs
          </button>

          {/* Tab 3: Budget Calculator (Soft Butter-Yellow Pill) */}
          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer border-2 ${
              activeTab === 'budget'
                ? 'bg-[#FEF08A] text-[#713F12] border-[#713F12] shadow-md ring-2 ring-[#FEF08A]'
                : 'bg-[#FEF08A] text-[#713F12] border-[#EAB308]/70 hover:bg-[#FDE047]'
            }`}
          >
            3. Budget Calculator
          </button>

          {/* Tab 4: Interactive Route (Soft Sage Green Pill) */}
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer border-2 ${
              activeTab === 'map'
                ? 'bg-[#DCFCE7] text-[#14532D] border-[#14532D] shadow-md ring-2 ring-[#DCFCE7]'
                : 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC] hover:bg-[#BBF7D0]'
            }`}
          >
            4. Interactive Route
          </button>

          {/* Tab 5: Travel Checklist (Soft Pastel Lavender Pill) */}
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer border-2 ${
              activeTab === 'checklist'
                ? 'bg-[#EDE9FE] text-[#4C1D95] border-[#4C1D95] shadow-md ring-2 ring-[#EDE9FE]'
                : 'bg-[#EDE9FE] text-[#4C1D95] border-[#C4B5FD] hover:bg-[#DDD6FE]'
            }`}
          >
            5. Travel Checklist ({checklistStats.percent}%)
          </button>

          {/* Tab 6: AI Travel Assistant */}
          <button
            type="button"
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer border-2 ${
              activeTab === 'assistant'
                ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            💬 6. AI Assistant
          </button>

          {/* Tab 7: Saved Plans */}
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer border-2 ${
              activeTab === 'saved'
                ? 'bg-slate-900 text-white border-slate-950 shadow-md'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            🔖 7. Saved ({(savedItineraries || []).length})
          </button>
        </div>
      </div>

      {/* ===================================================================
          4. TAB CONTENT AREA
      =================================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ===================================================================
            TAB 1: DAY-BY-DAY ITINERARY CARDS (PARCHMENT STORYBOOK THEME)
        =================================================================== */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {/* Section Sub-Header: "4 Days in Bali" with Flight & Hotel Booking Bridges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">✦</span>
                <h3 className="font-cursive-title text-3xl sm:text-4xl font-bold text-slate-900 tracking-wide">
                  {daysCount} Days in {displayCity}
                </h3>
                <span className="text-amber-500 text-sm">✧</span>
                <span className="text-slate-400 text-base">☁️</span>
              </div>

              {/* Action Buttons: "Search Flights" & "Browse Hotels" */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onBookFlightOrHotel(matchedCity.code, 'flights')}
                  className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#FFDDD2] text-[#802816] border-2 border-[#F4A896] hover:scale-105 active:scale-95 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>✈️</span>
                  <span>Search Flights</span>
                </button>
                <button
                  type="button"
                  onClick={() => onBookFlightOrHotel(matchedCity.code, 'hotels')}
                  className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#FEF3C7] text-[#78350F] border-2 border-[#FCD34D] hover:scale-105 active:scale-95 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>🏠</span>
                  <span>Browse Hotels</span>
                </button>
              </div>
            </div>

            {/* Day Cards List (Matching Screenshot Card Aesthetics) */}
            {currentItinerary && Array.isArray(currentItinerary.days) && currentItinerary.days.length > 0 ? (
              <div className="space-y-6">
                {currentItinerary.days.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="relative bg-[#FFFDF9] border-[2.5px] border-[#84532B]/60 rounded-[30px] p-5 sm:p-7 shadow-[0_8px_24px_rgba(132,83,43,0.06)] hover:border-[#84532B] transition-all"
                  >
                    {/* Leafy Branch Flourishes in bottom corners */}
                    <div className="absolute -bottom-2 -left-2 pointer-events-none z-10 scale-75">
                      <LeafyCornerFlourish />
                    </div>
                    <div className="absolute -bottom-2 -right-2 pointer-events-none z-10 scale-75 -scale-x-75">
                      <LeafyCornerFlourish />
                    </div>

                    {/* Day Card Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D7C3]/80">
                      <div className="flex items-center gap-3.5">
                        {/* Blue Ribbon Rosette Medal Badge */}
                        <RibbonBadge day={day.dayNumber} />

                        <div>
                          <h4 className="font-display text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            Day {day.dayNumber}: {day.title}
                          </h4>
                          <span className="text-xs font-semibold text-slate-500">
                            Estimated Day Cost: ~{formatPrice(day.estimatedDayTotalInr, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('map');
                            setSelectedMapDay(day.dayNumber);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#D4B598] bg-[#FFF8EC] hover:bg-[#FDF3DE] text-xs font-bold text-[#78350F] flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5 text-[#0284C7]" />
                          <span>View on Map</span>
                        </button>
                      </div>
                    </div>

                    {/* Top Pro-Tip Banner (As in Reference Card) */}
                    <div className="mt-3.5 p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-amber-900 flex items-start gap-2">
                      <span className="text-amber-600 text-sm">💡</span>
                      <p className="font-medium leading-relaxed">
                        <strong className="font-bold">Pro Tip:</strong> {day.proTip}
                      </p>
                    </div>

                    {/* 3-Column Activity Grid (Morning, Afternoon, Evening) */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* 1. Morning Column */}
                      <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#E8D7C3] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-[#8B5E3C] mb-1">
                            <span className="font-cursive-title text-base text-[#78350F]">Morning</span>
                            <span className="text-[11px] text-slate-500 font-mono">{day.morning.time}</span>
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-sm mb-1.5">
                            {day.morning.activity}
                          </h5>

                          {/* Landmark Sketch Doodle */}
                          <div className="py-2 flex items-center justify-center">
                            {day.morning.activity.toLowerCase().includes('eiffel') ? (
                              <EiffelTowerSketch />
                            ) : (
                              <CuteTempleIcon />
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {day.morning.details}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#E8D7C3]/60 flex items-center justify-between text-[11px] text-slate-600">
                          <span className="font-medium truncate">{day.morning.transport}</span>
                          <span className="font-bold text-[#8B5E3C] shrink-0">
                            ~{formatPrice(day.morning.costEstimateInr, currency)}
                          </span>
                        </div>
                      </div>

                      {/* 2. Afternoon Column */}
                      <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#E8D7C3] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-[#8B5E3C] mb-1">
                            <span className="font-cursive-title text-base text-[#78350F]">Afternoon</span>
                            <span className="text-[11px] text-slate-500 font-mono">{day.afternoon.time}</span>
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-sm mb-1.5">
                            {day.afternoon.activity}
                          </h5>

                          {/* Landmark Sketch Doodle */}
                          <div className="py-2 flex items-center justify-center">
                            {day.afternoon.activity.toLowerCase().includes('arc') ? (
                              <ArcDeTriompheSketch />
                            ) : (
                              <CuteDogMascot />
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {day.afternoon.details}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#E8D7C3]/60 flex items-center justify-between text-[11px] text-slate-600">
                          <span className="font-medium truncate">{day.afternoon.transport}</span>
                          <span className="font-bold text-[#8B5E3C] shrink-0">
                            ~{formatPrice(day.afternoon.costEstimateInr, currency)}
                          </span>
                        </div>
                      </div>

                      {/* 3. Evening Column */}
                      <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#E8D7C3] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-[#8B5E3C] mb-1">
                            <span className="font-cursive-title text-base text-[#78350F]">Evening</span>
                            <span className="text-[11px] text-slate-500 font-mono">{day.evening.time}</span>
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-sm mb-1.5">
                            {day.evening.activity}
                          </h5>

                          {/* Starry Night Cruise Postcard */}
                          <div className="py-2">
                            <StarryCruisePostcard />
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {day.evening.details}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#E8D7C3]/60 flex items-center justify-between text-[11px] text-slate-600">
                          <span className="font-medium truncate">{day.evening.transport}</span>
                          <span className="font-bold text-[#8B5E3C] shrink-0">
                            ~{formatPrice(day.evening.costEstimateInr, currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dining Highlight Callout */}
                    <div className="mt-4 pt-3 border-t border-[#E8D7C3]/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="font-bold text-amber-800">🍴 Recommended Dining:</span>
                        <span className="text-slate-600 font-medium">{day.diningTip}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSavePlan}
                        className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save Day</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#FFFDF5] rounded-3xl border-2 border-[#84532B]/40">
                <Compass className="w-12 h-12 text-[#D4B598] mx-auto mb-3 animate-spin" />
                <h4 className="text-lg font-bold text-slate-800">Drafting Your Travel Plan...</h4>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: VISA & DOCS ASSISTANT
        =================================================================== */}
        {activeTab === 'visa' && (
          <div className="bg-[#FFFDF9] border-[2.5px] border-[#84532B]/60 rounded-[30px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D7C3]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#802816] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Consular & Entry Guidelines</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  Visa Regulations for {displayCity}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Passport validity, arrival stamps, and verified official government application portals.
                </p>
              </div>

              {/* Passport Country Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8B5E3C]">Passport Country:</span>
                <select
                  value={passportCountry}
                  onChange={(e) => {
                    setPassportCountry(e.target.value);
                    fetchVisaDetails(destination, e.target.value);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FFF8EC] border-2 border-[#D4A373] text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="India">🇮🇳 Indian Passport</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="UAE">🇦🇪 UAE Resident</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Australia">🇦🇺 Australia</option>
                </select>
              </div>
            </div>

            {isVisaLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="w-8 h-8 text-[#0284C7] animate-spin mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Checking latest immigration rules...</p>
              </div>
            ) : visaData ? (
              <div className="mt-6 space-y-6">
                {/* 4 Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FFDDD2]/60 border-2 border-[#F4A896]">
                    <span className="text-[11px] font-bold text-[#802816] uppercase tracking-wider">
                      Visa Type
                    </span>
                    <div className="font-extrabold text-base text-slate-900 mt-1">
                      {visaData.visaType}
                    </div>
                    <span className="text-xs text-[#802816] font-semibold block mt-0.5">
                      {visaData.entryRule}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#DCFCE7]/60 border-2 border-[#86EFAC]">
                    <span className="text-[11px] font-bold text-[#14532D] uppercase tracking-wider">
                      Stay Period
                    </span>
                    <div className="font-extrabold text-base text-slate-900 mt-1">
                      {visaData.validity}
                    </div>
                    <span className="text-xs text-[#14532D] block mt-0.5">
                      Tourism & Sightseeing
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#EDE9FE]/60 border-2 border-[#C4B5FD]">
                    <span className="text-[11px] font-bold text-[#4C1D95] uppercase tracking-wider">
                      Processing Time
                    </span>
                    <div className="font-extrabold text-base text-slate-900 mt-1">
                      {visaData.processingTime}
                    </div>
                    <span className="text-xs text-[#4C1D95] block mt-0.5">
                      Pre-boarding or on arrival
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FEF08A]/60 border-2 border-[#FDE047]">
                    <span className="text-[11px] font-bold text-[#713F12] uppercase tracking-wider">
                      Official Fee
                    </span>
                    <div className="font-extrabold text-base text-slate-900 mt-1">
                      {visaData.estimatedFee}
                    </div>
                    <span className="text-xs text-[#713F12] block mt-0.5">
                      Consular / counter rate
                    </span>
                  </div>
                </div>

                {/* Documents & Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 bg-[#FFFDF5] rounded-2xl p-5 border-2 border-[#E8D7C3]">
                    <h4 className="font-display text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0284C7]" />
                      <span>Required Documents Checklist</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {(visaData.requiredDocuments || []).map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-[#FFFDF5] rounded-2xl p-5 border-2 border-[#E8D7C3]">
                      <h4 className="font-display text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-[#0284C7]" />
                        <span>Application Procedure</span>
                      </h4>
                      <div className="space-y-3">
                        {(visaData.steps || []).map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#78350F] font-bold flex items-center justify-center shrink-0 text-[11px] border border-[#FCD34D]">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href={visaData.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <span>Open Official Embassy Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ===================================================================
            TAB 3: TRIP BUDGET CALCULATOR
        =================================================================== */}
        {activeTab === 'budget' && (
          <div className="bg-[#FFFDF9] border-[2.5px] border-[#84532B]/60 rounded-[30px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D7C3]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#713F12] uppercase tracking-wider mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Interactive Expense Ledger</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  Trip Budget Breakdown
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Customizable budget estimates for {displayCity} ({daysCount} days, {travellersCount} travellers).
                </p>
              </div>

              {/* Total Pill */}
              <div className="bg-[#FEF08A] border-2 border-[#EAB308] rounded-2xl px-5 py-3 text-right shrink-0">
                <span className="text-[11px] font-bold text-[#713F12] uppercase tracking-wider block">
                  Total Estimated Cost
                </span>
                <span className="font-display text-2xl sm:text-3xl font-black text-[#713F12]">
                  {formatPrice(budgetCalculations.grandTotalInr, currency)}
                </span>
                <span className="text-xs font-semibold text-[#854D0E] block">
                  ~{formatPrice(budgetCalculations.perPersonInr, currency)} / person
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Sliders (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="font-display text-base font-bold text-slate-900">
                  Adjust Rates & Preferences
                </h4>

                {/* Flights */}
                <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#E8D7C3]">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>✈️ Return Flights (Per Person)</span>
                    <span className="text-[#0284C7] font-bold">{formatPrice(flightEstimateInr, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={100000}
                    step={2000}
                    value={flightEstimateInr}
                    onChange={(e) => setFlightEstimateInr(Number(e.target.value))}
                    className="w-full accent-[#0284C7] cursor-pointer"
                  />
                </div>

                {/* Hotel */}
                <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#E8D7C3]">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>🏨 Accommodation (Per Night · {budgetCalculations.nights} Nights)</span>
                    <span className="text-[#0284C7] font-bold">{formatPrice(hotelTierRate, currency)} / night</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={30000}
                    step={1000}
                    value={hotelTierRate}
                    onChange={(e) => setHotelTierRate(Number(e.target.value))}
                    className="w-full accent-[#0284C7] cursor-pointer"
                  />
                </div>

                {/* Food */}
                <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#E8D7C3]">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>🍴 Dining & Drinks (Per Person / Day)</span>
                    <span className="text-[#0284C7] font-bold">{formatPrice(diningPerDayRate, currency)} / day</span>
                  </div>
                  <input
                    type="range"
                    min={800}
                    max={8000}
                    step={400}
                    value={diningPerDayRate}
                    onChange={(e) => setDiningPerDayRate(Number(e.target.value))}
                    className="w-full accent-[#0284C7] cursor-pointer"
                  />
                </div>
              </div>

              {/* Breakdown Cards (5 cols) */}
              <div className="lg:col-span-5 bg-[#FFFDF5] rounded-2xl p-5 border-2 border-[#E8D7C3] space-y-3">
                <h4 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-[#E8D7C3]">
                  Itemized Breakdown
                </h4>
                <div className="flex justify-between text-xs text-slate-700 py-1">
                  <span>Flights ({travellersCount} travellers)</span>
                  <strong>{formatPrice(budgetCalculations.flightsTotal, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-700 py-1">
                  <span>Hotels ({budgetCalculations.nights} nights)</span>
                  <strong>{formatPrice(budgetCalculations.hotelTotal, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-700 py-1">
                  <span>Dining & Food</span>
                  <strong>{formatPrice(budgetCalculations.mealsTotal, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-700 py-1">
                  <span>Transit & Cabs</span>
                  <strong>{formatPrice(budgetCalculations.transitTotal, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-700 py-1">
                  <span>Activities & Spas</span>
                  <strong>{formatPrice(budgetCalculations.activitiesTotal, currency)}</strong>
                </div>
                <div className="pt-3 border-t border-[#E8D7C3] flex justify-between text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-[#0284C7]">{formatPrice(budgetCalculations.grandTotalInr, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: INTERACTIVE MAP & ROUTE
        =================================================================== */}
        {activeTab === 'map' && (
          <div className="bg-[#FFFDF9] border-[2.5px] border-[#84532B]/60 rounded-[30px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D7C3]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14532D] uppercase tracking-wider mb-1">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span>Waypoints & Daily Sightseeing Trails</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  Interactive Route Map: {displayCity}
                </h3>
              </div>

              {/* Day filter pills */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedMapDay(d)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                      selectedMapDay === d
                        ? 'bg-[#1E3A5F] text-white'
                        : 'bg-[#FFF8EC] text-[#78350F] border border-[#D4A373]'
                    }`}
                  >
                    Day {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Illustrated Map Canvas */}
            <div className="mt-6 bg-[#0F172A] rounded-2xl p-6 relative overflow-hidden min-h-[380px] flex items-center justify-center border-2 border-[#84532B]/60">
              {/* Turquoise Coastal Lagoon Wave Curve */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 600 400" preserveAspectRatio="none">
                <path d="M -20,240 Q 150,160 320,260 T 640,140" fill="none" stroke="#38BDF8" strokeWidth="36" strokeLinecap="round" />
              </svg>

              {/* Connecting dashed route */}
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 600 400">
                <line x1="160" y1="140" x2="310" y2="220" stroke="#FDE047" strokeWidth="3.5" strokeDasharray="6,6" />
                <line x1="310" y1="220" x2="460" y2="150" stroke="#FDE047" strokeWidth="3.5" strokeDasharray="6,6" />

                <g transform="translate(160, 140)">
                  <circle r="18" fill="#0284C7" stroke="#FFF" strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">1</text>
                  <text x="0" y="30" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="bold">Morning Stop</text>
                </g>
                <g transform="translate(310, 220)">
                  <circle r="18" fill="#F59E0B" stroke="#FFF" strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">2</text>
                  <text x="0" y="30" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="bold">Afternoon Stop</text>
                </g>
                <g transform="translate(460, 150)">
                  <circle r="18" fill="#8B5CF6" stroke="#FFF" strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">3</text>
                  <text x="0" y="30" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="bold">Evening Sunset</text>
                </g>
              </svg>

              <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-bold">
                🗺️ Day {selectedMapDay} Scenic Trail · ~8.4 km Total Transit Distance
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: TRAVEL CHECKLIST
        =================================================================== */}
        {activeTab === 'checklist' && (
          <div className="bg-[#FFFDF9] border-[2.5px] border-[#84532B]/60 rounded-[30px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D7C3]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4C1D95] uppercase tracking-wider mb-1">
                  <CheckSquare className="w-4 h-4 text-purple-600" />
                  <span>Departure Readiness</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  Pre-Departure Travel Checklist
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="bg-[#EDE9FE] border-2 border-[#C4B5FD] rounded-2xl p-3.5 w-full sm:w-64 shrink-0">
                <div className="flex justify-between items-center text-xs font-black text-[#4C1D95] mb-1">
                  <span>Preparedness</span>
                  <span>{checklistStats.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${checklistStats.percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#5B21B6] mt-1 block font-medium">
                  {checklistStats.done} of {checklistStats.total} items completed
                </span>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-6">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.completed
                      ? 'bg-emerald-50/50 border-emerald-300 text-slate-500'
                      : 'bg-[#FFFDF5] border-[#E8D7C3] hover:border-[#84532B] text-slate-900'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                      item.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`text-xs sm:text-sm font-bold block ${item.completed ? 'line-through text-slate-400' : ''}`}>
                      {item.label}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: AI TRAVEL CONCIERGE CHAT
        =================================================================== */}
        {activeTab === 'assistant' && (
          <div className="bg-[#FFFDF9] border-[2.5px] border-[#84532B]/60 rounded-[30px] shadow-sm overflow-hidden flex flex-col h-[560px]">
            <div className="p-4 sm:px-6 bg-[#1E3A5F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <div>
                  <h4 className="font-display text-base font-bold">TripYeah AI Concierge</h4>
                  <p className="text-[11px] text-sky-200">Instant answers for {displayCity} travel</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full">
                ● Live Concierge
              </span>
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFFDF5]">
              {assistantMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#0284C7] text-white rounded-tr-none'
                        : 'bg-white border-2 border-[#E8D7C3] text-slate-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                    <span className={`block text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-[#E8D7C3] flex items-center gap-2">
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAssistantMessage()}
                placeholder={`Ask anything about ${displayCity}...`}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#84532B]"
              />
              <button
                type="button"
                onClick={handleSendAssistantMessage}
                disabled={isAssistantThinking || !assistantInput.trim()}
                className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs sm:text-sm cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 7: SAVED PLANS
        =================================================================== */}
        {activeTab === 'saved' && (
          <div className="bg-[#FFFDF9] border-[2.5px] border-[#84532B]/60 rounded-[30px] p-6 sm:p-8 shadow-sm">
            <h3 className="font-display text-2xl font-black text-slate-900 pb-4 border-b border-[#E8D7C3]">
              My Saved Itineraries ({(savedItineraries || []).length})
            </h3>
            {(savedItineraries || []).length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No saved itineraries yet. Click Save on any day to store here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {savedItineraries.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#E8D7C3] space-y-2">
                    <h4 className="font-black text-slate-900 text-lg">{p.destination}</h4>
                    <p className="text-xs text-slate-600">{p.startDate} – {p.endDate} · {(p.days || []).length} Days</p>
                    <span className="font-bold text-[#0284C7] text-sm block">
                      {formatPrice(p.estimatedTotalTripBudgetInr, currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
