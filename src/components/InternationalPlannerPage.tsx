import React, { useState, useEffect, useMemo } from 'react';
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
  Play,
  Pause,
  Camera,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Navigation,
  Globe,
  FileText,
  CreditCard,
  Wifi,
  Luggage,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Send,
  Eye,
  Sliders,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Palmtree,
  Star,
  Check,
  X,
  Copy,
} from 'lucide-react';
import {
  ASSETS,
  BookingCategory,
  CITIES,
  CityOption,
  CurrencyCode,
  DestinationPlace,
  formatPrice,
  TOP_DESTINATIONS,
} from '../data/travelData';
import { SafeImage } from './SafeImage';

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

const POPULAR_DESTINATIONS = [
  { name: 'Paris', country: 'France', code: 'CDG', image: ASSETS.paris, tag: 'Culture & Romance' },
  { name: 'Dubai', country: 'United Arab Emirates', code: 'DXB', image: ASSETS.dubai, tag: 'Futuristic & Luxury' },
  { name: 'Bali', country: 'Indonesia', code: 'DPS', image: ASSETS.bali, tag: 'Beaches & Temples' },
  { name: 'Singapore', country: 'Singapore', code: 'SIN', image: ASSETS.singapore, tag: 'Gardens & Food' },
  { name: 'Bangkok', country: 'Thailand', code: 'BKK', image: ASSETS.bangkok, tag: 'Temples & Street Food' },
  { name: 'Tokyo', country: 'Japan', code: 'HND', image: ASSETS.heroSantorini, tag: 'Anime & Modernity' },
  { name: 'London', country: 'United Kingdom', code: 'LHR', image: ASSETS.heroAlpine, tag: 'History & Royalty' },
];

export interface BackgroundSlide {
  id: string;
  title: string;
  location: string;
  tag: string;
  category: 'japan' | 'beach';
  image: string;
  fallbackImage: string;
}

export const BACKGROUND_SLIDES: BackgroundSlide[] = [
  {
    id: 'fuji-cherry-blossoms',
    title: 'Mount Fuji & Sakura Cherry Blossoms',
    location: 'Chureito Pagoda, Yamanashi, Japan',
    tag: 'Iconic Japan',
    category: 'japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.heroAlpine,
  },
  {
    id: 'tropical-coral-beach',
    title: 'Turquoise Coral Ocean & White Sands',
    location: 'Maldives & South Pacific Lagoon',
    tag: 'Pristine Beach',
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.heroMultimodal,
  },
  {
    id: 'kyoto-temple-lanterns',
    title: 'Historic Kyoto & Yasaka Pagoda',
    location: 'Higashiyama Lantern District, Kyoto, Japan',
    tag: 'Traditional Japan',
    category: 'japan',
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.bangkok,
  },
  {
    id: 'okinawa-sunset-beach',
    title: 'Okinawa Emerald Waters & White Sand Bay',
    location: 'Ryukyu Archipelago, Okinawa, Japan',
    tag: 'Japan Coastal Beach',
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.heroSantorini,
  },
  {
    id: 'tokyo-shibuya-night',
    title: 'Tokyo Tower & Neon Skyline at Twilight',
    location: 'Minato & Roppongi, Tokyo, Japan',
    tag: 'Modern Japan Metropole',
    category: 'japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.dubai,
  },
  {
    id: 'maldives-overwater-beach',
    title: 'Maldives Overwater Lagoon & Coral Sandbar',
    location: 'North Malé Atoll, Maldives',
    tag: 'Crystal Lagoon Beach',
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.heroMultimodal,
  },
  {
    id: 'kyoto-zen-cherry-garden',
    title: 'Zen Temple Gardens & Spring Sakura',
    location: 'Arashiyama & Philosopher Path, Kyoto, Japan',
    tag: 'Japan Sakura Garden',
    category: 'japan',
    image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.heroAlpine,
  },
  {
    id: 'bora-bora-sunset-beach',
    title: 'Sunset Tropical Palms & Gentle Turquoise Surf',
    location: 'Matira Beachfront, Bora Bora',
    tag: 'Sunset Paradise Beach',
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.heroSantorini,
  },
  {
    id: 'fushimi-inari-torii',
    title: 'Fushimi Inari Vermilion Torii Shrines',
    location: 'Mount Inari, Kyoto, Japan',
    tag: 'Sacred Japan Shrines',
    category: 'japan',
    image: 'https://images.unsplash.com/photo-1478436127897-769e00d28e19?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.bangkok,
  },
  {
    id: 'bali-water-shrine',
    title: 'Pura Ulun Danu Crater Lake & Coast',
    location: 'Bedugul & Uluwatu, Bali',
    tag: 'Tropical Island Escape',
    category: 'beach',
    image: ASSETS.bali,
    fallbackImage: ASSETS.heroMultimodal,
  },
  {
    id: 'santorini-cliffside-sea',
    title: 'Santorini White Cliffs & Aegean Blue Sea',
    location: 'Oia Bayfront, Cyclades, Greece',
    tag: 'Mediterranean Beach & Cliffs',
    category: 'beach',
    image: ASSETS.heroSantorini,
    fallbackImage: ASSETS.heroSantorini,
  },
  {
    id: 'osaka-castle-sakura',
    title: 'Osaka Castle & Blossoming Sakura Moat',
    location: 'Chuo Ward, Osaka, Japan',
    tag: 'Imperial Japan Sakura',
    category: 'japan',
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=2400&q=85',
    fallbackImage: ASSETS.heroAlpine,
  },
];

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'chk-1', category: 'passport', label: 'Check Passport Validity (6+ Months)', description: 'Ensure your passport has at least 6 months remaining validity from travel date and 2 blank pages.', completed: true, priority: 'High' },
  { id: 'chk-2', category: 'passport', label: 'Carry Visa Approval / e-Visa Printout', description: 'Print 2 physical copies of your valid visa, eVisa, or VoA confirmation receipt.', completed: true, priority: 'High' },
  { id: 'chk-3', category: 'passport', label: 'Color Photocopies & Cloud Backup', description: 'Store digital copies of passport first & last pages, visas, and IDs in a secure cloud drive.', completed: false, priority: 'Medium' },
  { id: 'chk-4', category: 'forex', label: 'Activate International Banking & Zero-Forex Card', description: 'Enable international transactions on credit/debit cards and load your multi-currency travel card.', completed: true, priority: 'High' },
  { id: 'chk-5', category: 'forex', label: 'Carry Local Cash Buffer ($100–$150 Equivalent)', description: 'Small bills for public transit kiosks, local tips, and street vendors.', completed: false, priority: 'Medium' },
  { id: 'chk-6', category: 'sim', label: 'Set Up International eSIM (Airalo/Holafly)', description: 'Install an eSIM before boarding or keep local airport SIM purchase details handy.', completed: true, priority: 'High' },
  { id: 'chk-7', category: 'insurance', label: 'Comprehensive International Travel Insurance', description: 'Covers emergency medical hospitalization, flight delay, baggage loss, and trip cancellation.', completed: true, priority: 'High' },
  { id: 'chk-8', category: 'packing', label: 'Universal Power Adapter & Power Bank', description: 'Check destination plug socket type (Type C/E/G). Keep 10,000mAh power bank in cabin baggage.', completed: false, priority: 'High' },
  { id: 'chk-9', category: 'packing', label: 'Prescription Medications & First Aid', description: 'Carry doctor prescription letter for any prescribed medicines in original packaging.', completed: false, priority: 'Medium' },
  { id: 'chk-10', category: 'airport', label: 'Complete Web Check-in (24h Prior)', description: 'Select preferred seats, confirm baggage allowances, and download digital boarding passes.', completed: false, priority: 'High' },
  { id: 'chk-11', category: 'airport', label: 'Submit Electronic Arrival Card (SGAC / e-CD)', description: 'Complete mandatory destination digital customs/arrival cards 48h before flight.', completed: false, priority: 'High' },
];

const INITIAL_PARIS_ITINERARY: FullItinerary = {
  id: 'plan-default-paris',
  destination: 'Paris',
  country: 'France',
  currency: 'EUR',
  destinationSummary: 'The City of Light captivates travellers with world-renowned art, romantic Seine riverbanks, iconic Belle Époque boulevards, and Michelin-star gastronomy.',
  bestTimeToVisit: 'April – October & December (Holiday Lights)',
  estimatedTotalTripBudgetInr: 165000,
  origin: 'New Delhi',
  startDate: '2026-10-20',
  endDate: '2026-10-24',
  budget: 'mid-range',
  travellersCount: 2,
  travellerType: 'Couple',
  interests: ['Sightseeing & Iconic Landmarks', 'Food & Culinary Trails', 'Art & Museums'],
  days: [
    {
      dayNumber: 1,
      title: 'Iconic Iron Lady & Seine Sunset Cruise',
      morning: {
        time: '09:00 AM – 12:30 PM',
        activity: 'Eiffel Tower Summit & Champ de Mars',
        details: 'Ascend to the top deck of the Eiffel Tower for panoramic views over Paris, followed by photos at Champ de Mars.',
        costEstimateInr: 5800,
        transport: 'Metro Line 6 to Bir-Hakeim',
      },
      afternoon: {
        time: '02:00 PM – 05:30 PM',
        activity: 'Trocadéro Gardens & Arc de Triomphe',
        details: 'Stroll across Pont d’Iéna to Trocadéro terrace, then take Avenue Kléber to the iconic Arc de Triomphe.',
        costEstimateInr: 3200,
        transport: 'Walk or Metro Line 1 to Charles de Gaulle – Étoile',
      },
      evening: {
        time: '06:30 PM – 09:30 PM',
        activity: 'Bateaux Parisiens Glass-Canopy River Cruise',
        details: 'Glide down the River Seine as the Eiffel Tower illuminates every hour with glittering golden strobes.',
        costEstimateInr: 4500,
        transport: 'Boarding at Port de la Bourdonnais',
      },
      diningTip: 'Classic French duck confit or steak frites at Café de Flore or Le Relais de Venise.',
      proTip: 'Book Eiffel Tower summit elevator passes 60 days ahead to skip the 2-hour queue.',
      estimatedDayTotalInr: 13500,
    },
    {
      dayNumber: 2,
      title: 'Masterpieces of the Louvre & Tuileries Garden',
      morning: {
        time: '09:00 AM – 01:00 PM',
        activity: 'Louvre Museum Timed Entry',
        details: 'Marvel at Mona Lisa, Venus de Milo, Winged Victory of Samothrace, and Napoleon III Apartments.',
        costEstimateInr: 4200,
        transport: 'Metro Line 1 to Palais Royal – Musée du Louvre',
      },
      afternoon: {
        time: '02:30 PM – 05:30 PM',
        activity: 'Jardin des Tuileries & Place de la Concorde',
        details: 'Relax by grand circular fountain basins with hot chocolate and pastries from Angelina.',
        costEstimateInr: 2100,
        transport: 'Leisurely walk through royal gardens',
      },
      evening: {
        time: '06:30 PM – 09:30 PM',
        activity: 'Le Marais Historic District & Dinner',
        details: 'Explore trendy boutiques, Place des Vosges brick arches, and artisanal crêperies.',
        costEstimateInr: 3900,
        transport: 'Metro Line 1 to Saint-Paul',
      },
      diningTip: 'Try savoury galettes and sweet caramel crêpes at Breizh Café in Le Marais.',
      proTip: 'Enter Louvre via the Carrousel du Louvre underground mall entrance for much shorter lines.',
      estimatedDayTotalInr: 10200,
    },
    {
      dayNumber: 3,
      title: 'Bohemian Montmartre & Sacré-Cœur Sunset',
      morning: {
        time: '09:30 AM – 12:30 PM',
        activity: 'Montmartre Hilltop & Place du Tertre',
        details: 'Wander cobblestone alleyways where Picasso and Van Gogh painted; see portrait artists at Place du Tertre.',
        costEstimateInr: 1500,
        transport: 'Metro Line 2 to Anvers + Montmartre Funicular',
      },
      afternoon: {
        time: '02:00 PM – 05:00 PM',
        activity: 'Sacré-Cœur Basilica & Panoramic Steps',
        details: 'Visit the Romano-Byzantine white basilica and sit on the steps overlooking the Parisian skyline.',
        costEstimateInr: 1200,
        transport: 'Walk uphill along Rue Foyatier',
      },
      evening: {
        time: '06:30 PM – 09:30 PM',
        activity: 'Moulin Rouge Exterior & Pigalle Dining',
        details: 'Photograph the iconic red windmill and enjoy French bistro onion soup and crème brûlée.',
        costEstimateInr: 4800,
        transport: 'Metro Line 2 to Blanche',
      },
      diningTip: 'Traditional French onion soup and escargots at La Boîte aux Lettres.',
      proTip: 'Watch out for wristband scammers near Sacré-Cœur funicular stairs; keep hands in pockets.',
      estimatedDayTotalInr: 7500,
    },
    {
      dayNumber: 4,
      title: 'Île de la Cité, Notre-Dame & Latin Quarter',
      morning: {
        time: '09:00 AM – 12:30 PM',
        activity: 'Notre-Dame Cathedral & Sainte-Chapelle',
        details: 'View Notre-Dame’s restored Gothic spires and the breathtaking 13th-century stained glass at Sainte-Chapelle.',
        costEstimateInr: 3200,
        transport: 'Metro Line 4 to Cité',
      },
      afternoon: {
        time: '01:30 PM – 05:00 PM',
        activity: 'Shakespeare and Company & Latin Quarter',
        details: 'Browse historic English bookshop and wander through student-favorite medieval Latin Quarter streets.',
        costEstimateInr: 2000,
        transport: 'Walk across Pont Saint-Michel',
      },
      evening: {
        time: '06:00 PM – 09:00 PM',
        activity: 'Sunset at Pont Neuf & Farewell Parisian Dinner',
        details: 'Cross Paris’s oldest standing bridge and toast with French sparkling wine along the Seine quays.',
        costEstimateInr: 5200,
        transport: 'Walk along Quai de la Mégisserie',
      },
      diningTip: 'French fondue or bouillabaisse at Le Relais Saint Germain.',
      proTip: 'Pick up an Navigo Easy transit card loaded with 10 metro t+ tickets for seamless transit.',
      estimatedDayTotalInr: 10400,
    },
  ],
};

const INITIAL_VISA_DATA: VisaDetails = {
  destination: 'France (Schengen Visa)',
  visaType: 'Short-Stay Tourist Schengen Visa (Type C)',
  entryRule: 'Mandatory prior sticker visa required for Indian passport holders',
  validity: 'Up to 90 days stay within 180-day period',
  processingTime: '15 calendar days (VFS Global)',
  estimatedFee: '€90 (~₹8,200) + VFS service fee ₹2,100',
  portalName: 'France-Visas Official Portal (Government of France)',
  portalUrl: 'https://france-visas.gouv.fr/',
  requiredDocuments: [
    'Original Passport valid for at least 3 months beyond departure with 2 blank pages',
    'Completed & signed France-Visas application form + appointment receipt',
    'Two recent biometric photos (35x45mm white background, 80% face coverage)',
    'Confirmed round-trip flight booking / flight reservation itinerary',
    'Proof of hotel accommodation / accommodation voucher for all days in Schengen area',
    'Travel medical insurance with minimum €30,000 coverage including repatriation',
    'Personal bank statements for last 3 to 6 months with official bank stamp & seal',
    'Income Tax Returns (ITR-V) acknowledgement for last 2 assessment years',
    'Cover letter detailing day-by-day travel itinerary and purpose of trip',
  ],
  steps: [
    'Create an online account on the France-Visas official government portal.',
    'Fill the digital visa form and download the validated application PDF.',
    'Book an appointment at the nearest VFS Global center in your city.',
    'Attend your appointment to submit documents and provide biometric fingerprints.',
    'Track passport dispatch and receive your stamped Schengen visa.',
  ],
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

  // Planning Form State
  const [destination, setDestination] = useState<string>('Paris');
  const [origin, setOrigin] = useState<string>('New Delhi');
  const [startDate, setStartDate] = useState<string>('2026-10-20');
  const [endDate, setEndDate] = useState<string>('2026-10-24');
  const [daysCount, setDaysCount] = useState<number>(4);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'mid-range' | 'luxury'>('mid-range');
  const [travellersCount, setTravellersCount] = useState<number>(2);
  const [travellerType, setTravellerType] = useState<string>('Couple');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Sightseeing & Iconic Landmarks',
    'Food & Culinary Trails',
    'Art & Museums',
  ]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active Generated Itinerary (Pre-seeded with default Paris so it's never null)
  const [currentItinerary, setCurrentItinerary] = useState<FullItinerary | null>(INITIAL_PARIS_ITINERARY);

  // Visa Assistant State (Pre-seeded with verified France/Schengen visa data)
  const [passportCountry, setPassportCountry] = useState<string>('India');
  const [visaData, setVisaData] = useState<VisaDetails | null>(INITIAL_VISA_DATA);
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

  // Saved Itineraries State (Local Storage persistent, guaranteed array)
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
      text: "Bonjour! I'm your TripYeah AI International Concierge. Ask me anything about Paris or your upcoming destination — from skip-the-line ticket tips and hidden cafés to metro passes, dress codes, or budget hacks!",
      time: 'Just now',
    },
  ]);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  // Interactive Map Selected Day Pin
  const [selectedMapDay, setSelectedMapDay] = useState<number>(1);

  // Budget Calculator Custom Sliders
  const [flightEstimateInr, setFlightEstimateInr] = useState<number>(45000); // per person in INR
  const [hotelTierRate, setHotelTierRate] = useState<number>(8500); // per night in INR
  const [diningPerDayRate, setDiningPerDayRate] = useState<number>(3000); // per person per day
  const [transitPerDayRate, setTransitPerDayRate] = useState<number>(1200); // per person per day
  const [activitiesPerDayRate, setActivitiesPerDayRate] = useState<number>(2500); // per person per day
  // Pure Automatic Scenic Background Slideshow (Japan, Beaches, Pagodas, Oceans)
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const safeSlideIndex = currentSlideIndex % BACKGROUND_SLIDES.length;

  // Save checklist to localStorage
  useEffect(() => {
    localStorage.setItem('tripyeah_travel_checklist', JSON.stringify(checklist));
  }, [checklist]);

  // Save saved itineraries to localStorage
  useEffect(() => {
    localStorage.setItem('tripyeah_saved_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  // Initial load: Generate default itinerary for Paris
  useEffect(() => {
    handleGenerateItinerary(false);
    fetchVisaDetails('Paris', 'India');
  }, []);

  // Update budget calculator rates when tier or destination changes
  useEffect(() => {
    if (budgetTier === 'luxury') {
      setHotelTierRate(18500);
      setDiningPerDayRate(6500);
      setTransitPerDayRate(3500);
      setActivitiesPerDayRate(5500);
    } else if (budgetTier === 'budget') {
      setHotelTierRate(3800);
      setDiningPerDayRate(1500);
      setTransitPerDayRate(600);
      setActivitiesPerDayRate(1200);
    } else {
      setHotelTierRate(8500);
      setDiningPerDayRate(3000);
      setTransitPerDayRate(1200);
      setActivitiesPerDayRate(2500);
    }

    // Set flight estimate based on destination
    const dest = destination.toLowerCase();
    if (dest.includes('dubai')) setFlightEstimateInr(22000);
    else if (dest.includes('bali')) setFlightEstimateInr(28000);
    else if (dest.includes('singapore')) setFlightEstimateInr(24000);
    else if (dest.includes('bangkok')) setFlightEstimateInr(18000);
    else if (dest.includes('tokyo')) setFlightEstimateInr(58000);
    else if (dest.includes('london')) setFlightEstimateInr(55000);
    else setFlightEstimateInr(52000);
  }, [budgetTier, destination]);

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
    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          origin,
          startDate,
          endDate,
          daysCount,
          budget: budgetTier,
          travellersCount,
          travellerType,
          interests: selectedInterests,
          customNotes,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const fullPlan: FullItinerary = {
          id: `plan-${Date.now()}`,
          ...json.data,
          days: Array.isArray(json.data.days) ? json.data.days : [],
          origin,
          startDate,
          endDate,
          budget: budgetTier,
          travellersCount,
          travellerType,
          interests: selectedInterests,
        };
        setCurrentItinerary(fullPlan);

        // Also update Assistant context message
        setAssistantMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `I've prepared a ${daysCount}-day ${budgetTier} travel plan for ${destination}! Feel free to ask me to modify any day, recommend restaurants, or provide transport tips.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        if (showToast) {
          onNotify(
            `${destination} Itinerary Generated!`,
            `Personalized ${daysCount}-day ${budgetTier} plan crafted with day-by-day sightseeing and culinary highlights.`,
            'success'
          );
        }
      } else {
        throw new Error(json.error || 'Failed to generate itinerary');
      }
    } catch (err: any) {
      console.error(err);
      if (showToast) {
        onNotify('Itinerary Generation Notice', 'Used verified destination template.', 'info');
      }
    } finally {
      setIsGenerating(false);
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
          text: `For ${destination}, we recommend booking major attraction tickets 48h in advance online, keeping a multi-currency zero-forex card for contactless payments, and using public metro rapid transit.`,
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

  // Export / Print Itinerary
  const handlePrint = () => {
    window.print();
  };

  // Copy shareable summary
  const handleShareSummary = () => {
    if (!currentItinerary) return;
    const daysArr = Array.isArray(currentItinerary.days) ? currentItinerary.days : [];
    const summary = `✈️ TripYeah International Plan: ${currentItinerary.destination}\n📅 ${currentItinerary.startDate} – ${currentItinerary.endDate} (${daysArr.length} Days)\n👥 ${currentItinerary.travellersCount} Travellers (${currentItinerary.travellerType})\n💰 Estimated Budget: ${formatPrice(currentItinerary.estimatedTotalTripBudgetInr, currency)}\n\nHighlights:\n${daysArr.map((d) => `• Day ${d.dayNumber}: ${d.title} (Morning: ${d.morning?.activity || ''}, Afternoon: ${d.afternoon?.activity || ''})`).join('\n')}\n\nPlanned with TripYeah International Planner`;

    navigator.clipboard.writeText(summary);
    onNotify('Itinerary Copied to Clipboard!', 'Shareable itinerary summary ready to paste into WhatsApp, Email, or Notes.', 'success');
  };

  // Calculate total budget breakdown
  const budgetCalculations = useMemo(() => {
    const nights = Math.max(1, daysCount - 1);
    const flightsTotal = flightEstimateInr * travellersCount;
    const hotelTotal = hotelTierRate * nights;
    const mealsTotal = diningPerDayRate * daysCount * travellersCount;
    const transitTotal = transitPerDayRate * daysCount * travellersCount;
    const activitiesTotal = activitiesPerDayRate * daysCount * travellersCount;
    const visaAndInsuranceTotal = (travellersCount * 8500) + (travellersCount * 1800);
    const simAndBufferTotal = (travellersCount * 2500) + 5000;

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
    return CITIES.find(
      (c) =>
        c.city.toLowerCase() === dLower ||
        c.country.toLowerCase() === dLower ||
        dLower.includes(c.city.toLowerCase())
    ) || CITIES[4]; // Default to Bali (DPS) or Paris (CDG)
  }, [destination]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* 1. HERO HEADER WITH AUTOMATIC BRIGHT SCENIC SLIDESHOW (Japan, Beaches, etc.) */}
      <section className="relative text-white pt-20 sm:pt-24 lg:pt-26 pb-36 sm:pb-44 lg:pb-48 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[490px] sm:min-h-[550px] lg:min-h-[590px]">
        {/* Automatic Bright Scenic Background Slideshow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {BACKGROUND_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === safeSlideIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).src = slide.fallbackImage;
                }}
                className="w-full h-full object-cover object-center brightness-105 contrast-105 transform transition-transform duration-[8000ms] ease-out scale-105"
              />
            </div>
          ))}

          {/* Top & atmospheric contrast scrim */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/15 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Soft shadow depth layer before the white fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Smooth white bottom fade into page body — dissolves like soft fog/shadow into #F8FAFC with NO drawn line, just like front page */}
          <div
            className="absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 via-35% to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/40 border border-white/30 text-white text-xs font-semibold mb-3 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>AI-Powered Global Itinerary & Visa Concierge</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                International{' '}
                <span className="bg-gradient-to-r from-sky-200 via-blue-100 to-white bg-clip-text text-transparent">
                  Trip Planner
                </span>
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSavePlan}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-lg hover:border-white/50"
              >
                <Bookmark className="w-4 h-4 text-sky-300" />
                <span>Save Current Plan</span>
              </button>

              <button
                type="button"
                onClick={handleShareSummary}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-lg hover:border-white/50"
              >
                <Share2 className="w-4 h-4 text-sky-300" />
                <span>Share / Copy</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-xl transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Quick Destination Pill selector — Seamless without any dividing line */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-white/90 shrink-0 uppercase tracking-wider drop-shadow-xs">
              Popular:
            </span>
            {POPULAR_DESTINATIONS.map((p) => {
              const isSelected = destination.toLowerCase() === p.name.toLowerCase();
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setDestination(p.name);
                    fetchVisaDetails(p.name, passportCountry);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-white/50'
                      : 'bg-black/35 hover:bg-black/55 text-white border border-white/25 backdrop-blur-md'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-80 font-mono">({p.code})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. PLANNER CONTROLS CARD & TABS NAVIGATOR (Overlaps the fading hero seamlessly) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 lg:-mt-32 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/80 p-4 sm:p-6 mb-8 text-slate-900">
          {/* Form Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-5">
            {/* 1. Destination Input */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Destination Country / City
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Paris, Dubai, Bali, Tokyo"
                  className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Departure Date */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Start Date
              </label>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  {new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {/* 3. Duration & Return Date */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Duration ({daysCount} Days)
              </label>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  {new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {/* 4. Travellers & Type */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Travellers & Style
              </label>
              <div className="flex items-center justify-between mt-1">
                <select
                  value={travellerType}
                  onChange={(e) => setTravellerType(e.target.value)}
                  className="bg-transparent text-sm sm:text-base font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="Solo">1 Solo</option>
                  <option value="Couple">2 Couple</option>
                  <option value="Family">Family with Kids</option>
                  <option value="Friends">Group of Friends</option>
                </select>
                <Users className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
            </div>

            {/* 5. Budget Tier & Generate Button */}
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Budget Level
                </label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value as any)}
                  className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 focus:outline-none cursor-pointer capitalize mt-1"
                >
                  <option value="budget">Budget Saver</option>
                  <option value="mid-range">Mid-Range (Recommended)</option>
                  <option value="luxury">5★ Luxury</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleGenerateItinerary(true);
                  fetchVisaDetails(destination, passportCountry);
                }}
                disabled={isGenerating}
                className="h-full px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:brightness-110 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-md shadow-blue-600/25 transition-all cursor-pointer shrink-0 disabled:opacity-60"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isGenerating ? 'Planning...' : 'Generate AI'}</span>
              </button>
            </div>
          </div>

          {/* Service Feature Tabs */}
          <div className="flex items-center gap-2 border-t border-slate-100 pt-4 overflow-x-auto scrollbar-none">
            {[
              { id: 'itinerary', label: '1. Day-by-Day Itinerary', icon: Calendar },
              { id: 'visa', label: '2. Visa Assistant & Docs', icon: ShieldCheck },
              { id: 'budget', label: '3. Trip Budget Calculator', icon: DollarSign },
              { id: 'map', label: '4. Places & Interactive Route', icon: Navigation },
              { id: 'checklist', label: `5. Travel Checklist (${checklistStats.percent}%)`, icon: CheckSquare },
              { id: 'assistant', label: '6. AI Travel Assistant', icon: MessageSquare },
              { id: 'saved', label: `7. Saved Plans (${(savedItineraries || []).length})`, icon: Bookmark },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MAIN TAB CONTENT DISPLAY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ===================================================================
            TAB 1: AI TRIP ITINERARY
        =================================================================== */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {/* Destination Overview Banner & Direct Booking Bridge */}
            {currentItinerary && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Curated International Itinerary · {currentItinerary.budget.toUpperCase()}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    {(currentItinerary.days || []).length} Days in {currentItinerary.destination}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
                    {currentItinerary.destinationSummary}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <span><strong>Best Season:</strong> {currentItinerary.bestTimeToVisit}</span>
                    <span>·</span>
                    <span><strong>Local Currency:</strong> {currentItinerary.currency}</span>
                    <span>·</span>
                    <span>
                      <strong>Est. Total Expenses:</strong>{' '}
                      <span className="font-mono-tabular font-bold text-emerald-700">
                        {formatPrice(currentItinerary.estimatedTotalTripBudgetInr, currency)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Direct Reuse of TripYeah Flight & Hotel Booking */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0 w-full lg:w-80 space-y-2.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Book on TripYeah</span>
                    <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
                      Direct Integrated
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Search verified flights and partner hotels for {destination} using TripYeah's booking engine.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onBookFlightOrHotel(matchedCity.code, 'flights')}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>Search Flights</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookFlightOrHotel(matchedCity.code, 'hotels')}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Browse Hotels</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Day-by-Day Cards List */}
            {currentItinerary && Array.isArray(currentItinerary.days) && currentItinerary.days.length > 0 ? (
              <div className="space-y-5">
                {currentItinerary.days.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:border-blue-300"
                  >
                    {/* Day Header Strip */}
                    <div className="p-4 sm:px-6 bg-slate-50/90 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-display text-sm font-bold flex items-center justify-center shadow-xs">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                            Day {day.dayNumber}: {day.title}
                          </h3>
                          <span className="text-xs text-slate-500">
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
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          <span>View on Map</span>
                        </button>
                      </div>
                    </div>

                    {/* Morning / Afternoon / Evening Grid */}
                    <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Morning */}
                      <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-sky-800 mb-2">
                            <span className="px-2 py-0.5 rounded-md bg-sky-100">Morning</span>
                            <span className="font-mono text-[11px] text-slate-500">{day.morning.time}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mb-1">
                            {day.morning.activity}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {day.morning.details}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-sky-100/60 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>🚇 {day.morning.transport}</span>
                          <span className="font-mono font-bold text-slate-700">~{formatPrice(day.morning.costEstimateInr, currency)}</span>
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-amber-800 mb-2">
                            <span className="px-2 py-0.5 rounded-md bg-amber-100">Afternoon</span>
                            <span className="font-mono text-[11px] text-slate-500">{day.afternoon.time}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mb-1">
                            {day.afternoon.activity}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {day.afternoon.details}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-amber-100/60 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>🚶 {day.afternoon.transport}</span>
                          <span className="font-mono font-bold text-slate-700">~{formatPrice(day.afternoon.costEstimateInr, currency)}</span>
                        </div>
                      </div>

                      {/* Evening */}
                      <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-indigo-800 mb-2">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100">Evening</span>
                            <span className="font-mono text-[11px] text-slate-500">{day.evening.time}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mb-1">
                            {day.evening.activity}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {day.evening.details}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-indigo-100/60 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>🚕 {day.evening.transport}</span>
                          <span className="font-mono font-bold text-slate-700">~{formatPrice(day.evening.costEstimateInr, currency)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pro-Tips & Dining Strip */}
                    <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="font-bold text-blue-700 shrink-0">🍴 Dining Tip:</span>
                        <span className="truncate">{day.diningTip}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="font-bold text-amber-700 shrink-0">💡 Pro Tip:</span>
                        <span className="truncate">{day.proTip}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">Generating Your Itinerary...</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting to TripYeah AI travel intelligence.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: VISA ASSISTANT
        =================================================================== */}
        {activeTab === 'visa' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Official Immigration & Visa Guidelines</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    Visa Requirements for {destination}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Current entry regulations, document checklists, and official government portal application links.
                  </p>
                </div>

                {/* Passport Country Selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">My Passport:</span>
                  <select
                    value={passportCountry}
                    onChange={(e) => {
                      setPassportCountry(e.target.value);
                      fetchVisaDetails(destination, e.target.value);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="India">🇮🇳 Indian Passport</option>
                    <option value="United States">🇺🇸 United States Passport</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom Passport</option>
                    <option value="UAE">🇦🇪 UAE Resident / Passport</option>
                    <option value="Canada">🇨🇦 Canadian Passport</option>
                    <option value="Australia">🇦🇺 Australian Passport</option>
                  </select>
                </div>
              </div>

              {isVisaLoading ? (
                <div className="py-16 text-center">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Checking latest visa regulations...</p>
                </div>
              ) : visaData ? (
                <div className="mt-6 space-y-6">
                  {/* Key Visa Metrics 4-Col Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        Visa Category
                      </span>
                      <div className="font-display text-lg font-bold text-slate-900 mt-1">
                        {visaData.visaType}
                      </div>
                      <span className="text-xs text-blue-700 font-semibold block mt-0.5">
                        {visaData.entryRule}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                        Validity & Stay
                      </span>
                      <div className="font-display text-lg font-bold text-slate-900 mt-1">
                        {visaData.validity}
                      </div>
                      <span className="text-xs text-emerald-700 block mt-0.5">
                        Tourism & Leisure Entry
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                        Processing Turnaround
                      </span>
                      <div className="font-display text-lg font-bold text-slate-900 mt-1">
                        {visaData.processingTime}
                      </div>
                      <span className="text-xs text-purple-700 block mt-0.5">
                        Apply at least 3 weeks prior
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                        Official Fee Estimate
                      </span>
                      <div className="font-display text-lg font-bold text-slate-900 mt-1">
                        {visaData.estimatedFee}
                      </div>
                      <span className="text-xs text-amber-700 block mt-0.5">
                        Direct embassy / VFS rate
                      </span>
                    </div>
                  </div>

                  {/* Mandatory Document Checklist & Application Steps */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
                    {/* Documents Required (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
                      <h3 className="font-display text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Mandatory Document Checklist</span>
                      </h3>
                      <ul className="space-y-2.5">
                        {(visaData.requiredDocuments || []).map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step-by-Step Procedure & Official Portal (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
                        <h3 className="font-display text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                          <span>How to Apply</span>
                        </h3>
                        <div className="space-y-3">
                          {(visaData.steps || []).map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Official Embassy Button */}
                      <div className="p-4 rounded-2xl bg-blue-600 text-white flex flex-col justify-between gap-3 shadow-md">
                        <div>
                          <div className="text-xs font-semibold text-blue-200">Verified External Portal</div>
                          <div className="font-bold text-sm text-white mt-0.5">{visaData.portalName}</div>
                        </div>
                        <a
                          href={visaData.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 rounded-xl bg-white text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors shadow-xs"
                        >
                          <span>Open Official Embassy Website</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: TRIP BUDGET CALCULATOR
        =================================================================== */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Realistic Expense Estimator</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    Trip Budget Breakdown
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Customizable budget breakdown for {destination} ({daysCount} days, {travellersCount} travellers)
                  </p>
                </div>

                {/* Grand Total Display Pill */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 text-right shrink-0">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Total Estimated Trip Cost
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-blue-700 font-mono-tabular">
                    {formatPrice(budgetCalculations.grandTotalInr, currency)}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    ~{formatPrice(budgetCalculations.perPersonInr, currency)} / person
                  </span>
                </div>
              </div>

              {/* Sliders & Tweak Controls Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                {/* Left Controls (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Adjust Your Spending Preferences
                  </h3>

                  {/* Flight Slider */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>✈️ Return Flights (Per Person)</span>
                      <span className="font-mono text-blue-600 font-bold">
                        {formatPrice(flightEstimateInr, currency)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={120000}
                      step={2000}
                      value={flightEstimateInr}
                      onChange={(e) => setFlightEstimateInr(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Budget (₹10k)</span>
                      <span>Economy Avg</span>
                      <span>Premium / Peak (₹120k)</span>
                    </div>
                  </div>

                  {/* Hotel Slider */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>🏨 Accommodation (Per Night · {budgetCalculations.nights} Nights)</span>
                      <span className="font-mono text-blue-600 font-bold">
                        {formatPrice(hotelTierRate, currency)} / night
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2000}
                      max={35000}
                      step={1000}
                      value={hotelTierRate}
                      onChange={(e) => setHotelTierRate(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Hostel / 3★ (₹2k)</span>
                      <span>4★ City Hotel</span>
                      <span>5★ Luxury Resort (₹35k)</span>
                    </div>
                  </div>

                  {/* Dining Slider */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>🍴 Dining & Food (Per Person / Day)</span>
                      <span className="font-mono text-blue-600 font-bold">
                        {formatPrice(diningPerDayRate, currency)} / day
                      </span>
                    </div>
                    <input
                      type="range"
                      min={800}
                      max={12000}
                      step={500}
                      value={diningPerDayRate}
                      onChange={(e) => setDiningPerDayRate(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Casual & Street Food</span>
                      <span>Cafés & Bistros</span>
                      <span>Fine Dining</span>
                    </div>
                  </div>

                  {/* Local Transit Slider */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>🚇 Local Transit & Cabs (Per Person / Day)</span>
                      <span className="font-mono text-blue-600 font-bold">
                        {formatPrice(transitPerDayRate, currency)} / day
                      </span>
                    </div>
                    <input
                      type="range"
                      min={300}
                      max={5000}
                      step={200}
                      value={transitPerDayRate}
                      onChange={(e) => setTransitPerDayRate(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Metro Day Pass</span>
                      <span>Mixed Transit</span>
                      <span>Private Chauffeur</span>
                    </div>
                  </div>
                </div>

                {/* Right Category Breakdown Cards (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h3 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                    Detailed Itemized Breakdown
                  </h3>

                  <div className="flex justify-between items-center text-xs text-slate-700 py-1">
                    <span className="flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-blue-600" />
                      Flights ({travellersCount} Passengers)
                    </span>
                    <strong className="font-mono">{formatPrice(budgetCalculations.flightsTotal, currency)}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-700 py-1">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      Hotels & Accommodation ({budgetCalculations.nights} Nights)
                    </span>
                    <strong className="font-mono">{formatPrice(budgetCalculations.hotelTotal, currency)}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-700 py-1">
                    <span className="flex items-center gap-1.5">
                      <span>🍴</span> Food, Cafés & Dinners
                    </span>
                    <strong className="font-mono">{formatPrice(budgetCalculations.mealsTotal, currency)}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-700 py-1">
                    <span className="flex items-center gap-1.5">
                      <span>🚇</span> Local Trains, Metro & Cabs
                    </span>
                    <strong className="font-mono">{formatPrice(budgetCalculations.transitTotal, currency)}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-700 py-1">
                    <span className="flex items-center gap-1.5">
                      <span>🎟️</span> Sightseeing & Museum Tickets
                    </span>
                    <strong className="font-mono">{formatPrice(budgetCalculations.activitiesTotal, currency)}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-700 py-1">
                    <span className="flex items-center gap-1.5">
                      <span>🛂</span> Visa Fees & Travel Insurance
                    </span>
                    <strong className="font-mono">{formatPrice(budgetCalculations.visaAndInsuranceTotal, currency)}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-700 py-1">
                    <span className="flex items-center gap-1.5">
                      <span>📱</span> eSIM Data & Misc Forex Buffer
                    </span>
                    <strong className="font-mono">{formatPrice(budgetCalculations.simAndBufferTotal, currency)}</strong>
                  </div>

                  <div className="pt-3 border-t border-slate-200 mt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Grand Total Estimate</span>
                    <span className="text-base text-blue-700 font-mono">
                      {formatPrice(budgetCalculations.grandTotalInr, currency)}
                    </span>
                  </div>

                  {/* Booking CTA button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => onBookFlightOrHotel(matchedCity.code, 'flights')}
                      className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Plane className="w-4 h-4" />
                      <span>Lock In TripYeah Flight Fares</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: PLACES & INTERACTIVE MAP VIEW
        =================================================================== */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    <Navigation className="w-4 h-4" />
                    <span>Visual Route & Daily Waypoints</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    Interactive Map: {destination}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Explore daily routes, estimated travel times, landmark pins, and nearby spots.
                  </p>
                </div>

                {/* Day Filter Pills */}
                {currentItinerary && Array.isArray(currentItinerary.days) && currentItinerary.days.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {currentItinerary.days.map((d) => (
                      <button
                        key={d.dayNumber}
                        type="button"
                        onClick={() => setSelectedMapDay(d.dayNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedMapDay === d.dayNumber
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Day {d.dayNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stylized Interactive Map Canvas & Landmark Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                {/* Visual SVG Map Canvas (8 cols) */}
                <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden relative min-h-[420px] flex items-center justify-center p-6 border border-slate-800">
                  {/* Subtle City Grid Graphic */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* River / Coast curve simulation */}
                  <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 600 400" preserveAspectRatio="none">
                    <path
                      d="M -20,220 Q 150,180 300,240 T 620,160"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="28"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Route Polyline connecting Waypoints */}
                  <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 600 400">
                    {/* Connecting line */}
                    <line x1="160" y1="140" x2="310" y2="210" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6,6" />
                    <line x1="310" y1="210" x2="450" y2="150" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6,6" />

                    {/* Pin 1: Morning */}
                    <g transform="translate(160, 140)">
                      <circle r="18" fill="#2563EB" />
                      <circle r="8" fill="#FFFFFF" />
                      <text x="0" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                        1. Morning
                      </text>
                    </g>

                    {/* Pin 2: Afternoon */}
                    <g transform="translate(310, 210)">
                      <circle r="18" fill="#F59E0B" />
                      <circle r="8" fill="#FFFFFF" />
                      <text x="0" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                        2. Afternoon
                      </text>
                    </g>

                    {/* Pin 3: Evening */}
                    <g transform="translate(450, 150)">
                      <circle r="18" fill="#6366F1" />
                      <circle r="8" fill="#FFFFFF" />
                      <text x="0" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                        3. Evening
                      </text>
                    </g>
                  </svg>

                  {/* Top Overlay Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3.5 py-1.5 rounded-xl text-white text-xs">
                    <span className="text-sky-400 font-bold">Day {selectedMapDay} Route:</span> ~7.4 km total transit distance
                  </div>

                  <div className="absolute bottom-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] text-slate-300">
                    🗺️ Interactive Route Pins & Metro Corridors
                  </div>
                </div>

                {/* Right Waypoint Details (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  {currentItinerary && Array.isArray(currentItinerary.days) && currentItinerary.days.length > 0 && (
                    <>
                      {/* Morning Stop */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            Stop 1: Morning
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">09:30 AM</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {currentItinerary.days[selectedMapDay - 1]?.morning?.activity || `${destination} Landmark`}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {currentItinerary.days[selectedMapDay - 1]?.morning?.details}
                        </p>
                        <div className="text-[11px] text-blue-600 font-semibold pt-1">
                          Transit: ~12 mins via Metro Line 1
                        </div>
                      </div>

                      {/* Afternoon Stop */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            Stop 2: Afternoon
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">02:00 PM</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {currentItinerary.days[selectedMapDay - 1]?.afternoon?.activity || `${destination} District`}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {currentItinerary.days[selectedMapDay - 1]?.afternoon?.details}
                        </p>
                        <div className="text-[11px] text-amber-700 font-semibold pt-1">
                          Transit: ~8 mins scenic walk
                        </div>
                      </div>

                      {/* Evening Stop */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                            Stop 3: Evening Sunset
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">06:30 PM</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {currentItinerary.days[selectedMapDay - 1]?.evening?.activity || `${destination} Promenade`}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {currentItinerary.days[selectedMapDay - 1]?.evening?.details}
                        </p>
                        <div className="text-[11px] text-indigo-600 font-semibold pt-1">
                          Transit: ~15 mins river boat / cab
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: TRAVEL CHECKLIST
        =================================================================== */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    <CheckSquare className="w-4 h-4" />
                    <span>Departure Readiness</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    International Travel Checklist
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Passport, visa, forex card, eSIM, insurance, and airport preparation.
                  </p>
                </div>

                {/* Progress bar pill */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full sm:w-64 shrink-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                    <span>Preparation Progress</span>
                    <span className="text-blue-600 font-mono">{checklistStats.percent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${checklistStats.percent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5">
                    {checklistStats.done} of {checklistStats.total} essential tasks ready
                  </div>
                </div>
              </div>

              {/* Add Custom Item Form */}
              <form onSubmit={handleAddChecklistItem} className="my-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Add a new custom task (e.g. Buy waterproof camera pouch, exchange 200 EUR)..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                />
                <select
                  value={newChecklistCategory}
                  onChange={(e) => setNewChecklistCategory(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
                >
                  <option value="packing">Packing</option>
                  <option value="passport">Passport & Visa</option>
                  <option value="forex">Forex & Money</option>
                  <option value="sim">SIM & Connectivity</option>
                  <option value="insurance">Insurance</option>
                  <option value="airport">Airport Transit</option>
                </select>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </form>

              {/* Checklist Items List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      item.completed
                        ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-500'
                        : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800 shadow-xs'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        item.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs sm:text-sm font-bold truncate ${
                            item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            item.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChecklistItem(item.id);
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: AI TRAVEL ASSISTANT CONCIERGE CHAT
        =================================================================== */}
        {activeTab === 'assistant' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[600px]">
              {/* Header */}
              <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">
                      TripYeah AI Travel Assistant
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Real-time advice for {destination} · Powered by Gemini
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  ● Online & Ready
                </span>
              </div>

              {/* Chat Message Scroll */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {assistantMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                      <span
                        className={`block text-[10px] mt-1.5 ${
                          msg.role === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isAssistantThinking && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>TripYeah Assistant is analyzing destination guidelines...</span>
                  </div>
                )}
              </div>

              {/* Suggested Quick Question Chips */}
              <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Ask:</span>
                {[
                  `Top vegetarian restaurants in ${destination}`,
                  `Best time to visit landmarks to skip lines`,
                  `How to buy a local metro transit pass?`,
                  `Customary tipping rules and etiquette`,
                  `Is it safe to drink tap water?`,
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setAssistantInput(chip);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAssistantMessage()}
                  placeholder={`Ask anything about ${destination} travel, food, safety, or modifications...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleSendAssistantMessage}
                  disabled={isAssistantThinking || !assistantInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 7: SAVED PLANS (MY TRIPS DASHBOARD)
        =================================================================== */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Saved International Itineraries</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    My Saved Trips ({(savedItineraries || []).length})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Revisit, reload, and manage your custom travel plans and estimated budgets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleGenerateItinerary(true);
                    setActiveTab('itinerary');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Plan New Trip</span>
                </button>
              </div>

              {(savedItineraries || []).length === 0 ? (
                <div className="text-center py-16">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No Saved Plans Yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Save Current Plan" on any itinerary to store it here for future reference.
                  </p>
                  <button
                    type="button"
                    onClick={handleSavePlan}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Save Current {destination} Itinerary
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                  {savedItineraries.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            {plan.budget.toUpperCase()}
                          </span>
                          <span className="font-mono text-[11px]">{plan.savedAt || 'Saved'}</span>
                        </div>

                        <h4 className="font-display text-xl font-bold text-slate-900">
                          {plan.destination}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          📅 {plan.startDate} – {plan.endDate} ({(plan.days || []).length} Days)
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          👥 {plan.travellersCount} Travellers · {plan.travellerType}
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-200 text-xs flex justify-between items-center">
                          <span className="text-slate-500">Estimated Budget:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {formatPrice(plan.estimatedTotalTripBudgetInr, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentItinerary(plan);
                            setDestination(plan.destination);
                            setDaysCount((plan.days || []).length || 4);
                            setActiveTab('itinerary');
                            onNotify('Itinerary Loaded', `Switched active plan to ${plan.destination}.`, 'success');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSavedItineraries((prev) => prev.filter((p) => p.id !== plan.id));
                            onNotify('Plan Removed', `Removed ${plan.destination} from saved plans.`, 'info');
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
