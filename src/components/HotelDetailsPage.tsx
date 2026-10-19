import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Wifi,
  Coffee,
  Waves,
  Car,
  Utensils,
  Clock,
  Sparkles,
  Heart,
  Share2,
  Calendar,
  Users,
  ChevronRight,
  Info,
  Check,
  X,
  CreditCard,
  Shield,
  Phone,
  Plane,
  Eye,
  Camera,
  Maximize2,
  ThumbsUp,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CurrencyCode, formatPrice, ASSETS } from '../data/travelData';
import { SafeImage } from './SafeImage';

export interface RoomOption {
  id: string;
  name: string;
  image: string;
  sizeSqFt: number;
  bedType: string;
  maxAdults: number;
  maxChildren: number;
  view: string;
  priceInr: number;
  originalPriceInr: number;
  perks: string[];
  amenities: string[];
  refundable: boolean;
  breakfastIncluded: boolean;
  availableCount: number;
}

export interface HotelDetailsPageProps {
  hotel: any;
  currency: CurrencyCode;
  checkInDate: string;
  checkOutDate?: string;
  travellers: number;
  cabinClass?: string;
  onBack: () => void;
  onSelectRoomForCheckout: (
    selectedRoom: RoomOption,
    hotel: any,
    mealPlan: string
  ) => void;
  onNotify: (title: string, detail: string) => void;
}

// Fallback high-quality photo gallery
const HOTEL_GALLERY_IMAGES = [
  {
    url: ASSETS.bali,
    caption: 'Beachfront Infinity Pool & Sunset Deck',
    category: 'Pool & Beach',
  },
  {
    url: ASSETS.singapore,
    caption: 'Executive Panoramic Ocean Suite with Balcony',
    category: 'Rooms & Suites',
  },
  {
    url: ASSETS.dubai,
    caption: 'Grand Azure Lobby & 24/7 Luxury Concierge',
    category: 'Aerial & Grounds',
  },
  {
    url: ASSETS.bangkok,
    caption: 'The Palm Court Multi-Cuisine Fine Dining & Rock Bar',
    category: 'Dining & Lounge',
  },
  {
    url: ASSETS.heroSantorini,
    caption: 'Ayurvedic Wellness Spa, Jacuzzi & Aromatherapy',
    category: 'Spa & Wellness',
  },
  {
    url: ASSETS.paris,
    caption: 'Private Beach Cabanas & Evening Candlelight Dinner',
    category: 'Pool & Beach',
  },
  {
    url: ASSETS.heroAlpine,
    caption: 'Sunrise Yoga Deck & Tropical Landscaped Gardens',
    category: 'Aerial & Grounds',
  },
];

// Curated room options per hotel
const DEFAULT_ROOMS: RoomOption[] = [
  {
    id: 'room-deluxe-king',
    name: 'Deluxe King Room with Pool & Garden View',
    image: ASSETS.singapore,
    sizeSqFt: 390,
    bedType: '1 Extra-Large King Bed',
    maxAdults: 2,
    maxChildren: 1,
    view: 'Tropical Gardens & Swimming Pool',
    priceInr: 6899,
    originalPriceInr: 10500,
    perks: [
      'Free High-Speed Wi-Fi 6',
      'Complimentary Welcome Drink on Arrival',
      '55-inch 4K Smart TV with Netflix',
      'Marble En-Suite with Rain Shower',
    ],
    amenities: ['Air Conditioning', 'Balcony', 'Minibar', 'Soundproofing', 'Safe Deposit Box', 'Tea/Coffee Maker'],
    refundable: true,
    breakfastIncluded: false,
    availableCount: 4,
  },
  {
    id: 'room-premier-sea-view',
    name: 'Premier Sea View Suite with Private Balcony',
    image: ASSETS.bali,
    sizeSqFt: 520,
    bedType: '1 King Bed + 1 Plush Daybed',
    maxAdults: 3,
    maxChildren: 1,
    view: 'Direct Panoramic Ocean & Sunset View',
    priceInr: 8999,
    originalPriceInr: 14200,
    perks: [
      'Complimentary Buffet Breakfast Included',
      'Private Oceanfront Balcony with Lounge Chairs',
      'Deep Soaking Luxury Bathtub & Bathrobes',
      'Nespresso Coffee Machine with Daily Pods',
    ],
    amenities: ['Sea View', 'Free Breakfast', 'Espresso Machine', 'Bathtub', 'Club Lounge Access', 'Minibar'],
    refundable: true,
    breakfastIncluded: true,
    availableCount: 3,
  },
  {
    id: 'room-beachfront-villa-jacuzzi',
    name: 'Beachfront Heritage Villa with Private Jacuzzi',
    image: ASSETS.heroSantorini,
    sizeSqFt: 820,
    bedType: '1 Ultra-Comfort Royal King Bed',
    maxAdults: 2,
    maxChildren: 2,
    view: 'Direct Beach Walkway & Private Enclosed Garden',
    priceInr: 13499,
    originalPriceInr: 21999,
    perks: [
      'All Meals Included (Breakfast, Lunch & Candlelight Dinner)',
      'Private Outdoor Hydrotherapy Jacuzzi',
      'Dedicated 24/7 Personal Villa Butler Service',
      'Complimentary Airport Cab Pickup & Drop',
    ],
    amenities: ['Private Jacuzzi', 'Direct Beach Access', 'Personal Butler', 'All Meals', 'Airport Transfer', 'Wine on Arrival'],
    refundable: true,
    breakfastIncluded: true,
    availableCount: 2,
  },
  {
    id: 'room-family-interconnected',
    name: 'Family 2-Bedroom Interconnected Grand Suite',
    image: ASSETS.dubai,
    sizeSqFt: 760,
    bedType: '1 King Bed + 2 Single Twin Beds',
    maxAdults: 4,
    maxChildren: 2,
    view: 'Panoramic Resort & Skyline View',
    priceInr: 11800,
    originalPriceInr: 18900,
    perks: [
      'Free Buffet Breakfast for all guests',
      '2 Full Bathrooms with Luxury Amenities',
      'Complimentary Kids Activity Zone Pass',
      'Express Early Check-in Guarantee',
    ],
    amenities: ['2 Bedrooms', '2 Bathrooms', 'Kids Pass', 'Kitchenette', 'Free Breakfast', 'Connecting Doors'],
    refundable: true,
    breakfastIncluded: true,
    availableCount: 2,
  },
];

const GUEST_REVIEWS_DATA = [
  {
    id: 'rev-1',
    author: 'Rajesh & Pooja Malhotra',
    location: 'Mumbai, India',
    rating: 5.0,
    stayDate: 'Stayed 3 nights · October 2026',
    travellerType: 'Couple Getaway',
    roomBooked: 'Premier Sea View Suite',
    title: 'Breathtaking beach views, incredible food and top-tier hospitality!',
    comment:
      'We booked the Premier Sea View Suite for our anniversary and it exceeded all expectations. Waking up to the Arabian Sea breeze from the private balcony was magical. The buffet spread at The Palm Court was huge and delicious. The resort staff arranged a lovely surprise cake for us too. Absolutely worth every rupee!',
    helpfulCount: 42,
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Dr. Jennifer Stewart',
    location: 'London, United Kingdom',
    rating: 4.8,
    stayDate: 'Stayed 5 nights · September 2026',
    travellerType: 'Solo / Leisure',
    roomBooked: 'Deluxe King Room',
    title: 'Peaceful oasis with wonderful spa treatments and ultra-clean rooms',
    comment:
      'The pool area is spotless and never overcrowded. High speed WiFi allowed me to take calls smoothly while working remotely. The Ayurvedic massage at the spa relieved all my flight fatigue. Easy walking distance to Calangute beach yet peaceful inside the property.',
    helpfulCount: 28,
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Sunil & Ananya Verma',
    location: 'Bengaluru, India',
    rating: 4.9,
    stayDate: 'Stayed 4 nights · October 2026',
    travellerType: 'Family with Children',
    roomBooked: 'Family 2-Bedroom Grand Suite',
    title: 'Exceptional hospitality and kid-friendly environment',
    comment:
      'Travelling with our two kids was so comfortable. The kids pool and activity area kept them thoroughly entertained while we relaxed by the beach cabana. In-room dining service was prompt and the kids menu was very thoughtful.',
    helpfulCount: 19,
    verified: true,
  },
];

export const HotelDetailsPage: React.FC<HotelDetailsPageProps> = ({
  hotel: initialHotel,
  currency,
  checkInDate,
  checkOutDate,
  travellers,
  onBack,
  onSelectRoomForCheckout,
  onNotify,
}) => {
  // Safe fallback if hotel prop is missing
  const hotel = initialHotel || {
    id: 'grand-azure-goa',
    name: 'The Grand Azure Beachfront Resort & Spa, Goa',
    location: 'Calangute Beachfront Road, North Goa · 120m from Beach',
    locality: 'Calangute',
    stars: 5,
    rating: 4.9,
    reviews: 1290,
    propertyType: 'Resort',
    roomType: 'Premier Beachfront Suite with Private Jacuzzi',
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
    amenities: [
      'Free Breakfast',
      'Swimming Pool',
      'Free WiFi',
      'Couple Friendly',
      'Beachfront / Sea View',
      'Free Cancellation',
      'Pay at Hotel',
      'Spa & Wellness',
      'Airport Shuttle',
      '24/7 Room Service',
      'Fitness Center',
      'Valet Parking',
    ],
    priceInr: 8499,
    originalPriceInr: 14999,
    image: ASSETS.bali,
    tag: 'TripYeah Assured Luxury',
  };

  // State
  const [selectedRoomId, setSelectedRoomId] = useState<string>(DEFAULT_ROOMS[0].id);
  const [selectedMealPlan, setSelectedMealPlan] = useState<Record<string, string>>({
    'room-deluxe-king': 'breakfast',
    'room-premier-sea-view': 'breakfast',
    'room-beachfront-villa-jacuzzi': 'all-meals',
    'room-family-interconnected': 'breakfast',
  });
  const [activePhotoCategory, setActivePhotoCategory] = useState<string>('All');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'rooms' | 'amenities' | 'reviews' | 'location' | 'policies'>('rooms');
  const [reviewFilter, setReviewFilter] = useState<string>('All');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [upvotedReviews, setUpvotedReviews] = useState<Record<string, boolean>>({});

  // Active selected room
  const currentSelectedRoom =
    DEFAULT_ROOMS.find((r) => r.id === selectedRoomId) || DEFAULT_ROOMS[0];

  // Helper calculation for meal plan adjustment
  const getRoomPrice = (room: RoomOption): number => {
    const plan = selectedMealPlan[room.id] || 'breakfast';
    if (plan === 'room-only') return Math.max(room.priceInr - 700, 2999);
    if (plan === 'all-meals') return room.priceInr + 1800;
    return room.priceInr;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotel.name,
        text: `Check out ${hotel.name} on TripYeah!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      onNotify('Link Copied!', 'Hotel link copied to your clipboard.');
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onNotify(
      !isWishlisted ? 'Saved to Wishlist' : 'Removed from Wishlist',
      !isWishlisted
        ? `${hotel.name} added to your saved luxury escapes.`
        : 'Removed from saved properties.'
    );
  };

  const handleSelectRoomAndBook = (room: RoomOption) => {
    const plan = selectedMealPlan[room.id] || (room.breakfastIncluded ? 'Breakfast Included' : 'Room Only');
    const calculatedRoom = {
      ...room,
      priceInr: getRoomPrice(room),
    };
    onSelectRoomForCheckout(calculatedRoom, hotel, plan);
  };

  const scrollToSection = (sec: 'rooms' | 'amenities' | 'reviews' | 'location' | 'policies') => {
    setActiveSection(sec);
    const element = document.getElementById(`hotel-sec-${sec}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtered photos for modal
  const filteredPhotos =
    activePhotoCategory === 'All'
      ? HOTEL_GALLERY_IMAGES
      : HOTEL_GALLERY_IMAGES.filter((img) => img.category === activePhotoCategory);

  const displayCheckIn = checkInDate || '18 Oct 2026';
  const displayCheckOut = checkOutDate || '21 Oct 2026';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* 1. TOP BREADCRUMB & BACK ACTION BAR */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hotels</span>
            </button>

            <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span>Home</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span>Hotels</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-600">{hotel.locality || 'Goa'}</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-blue-700 font-bold truncate max-w-[200px]">
                {hotel.name}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleWishlist}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('rooms')}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              Select Room
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* 2. HOTEL HEADER: NAME, BADGES, RATING & LOCATION */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {Array.from({ length: hotel.stars || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-[11px] font-bold text-amber-900 ml-1">
                    {hotel.stars || 5}-Star Luxury {hotel.propertyType || 'Resort'}
                  </span>
                </div>

                {hotel.isTripYeahAssured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-600 text-white uppercase tracking-wider shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    TripYeah Assured Stay
                  </span>
                )}

                {hotel.isCoupleFriendly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Couple Friendly
                  </span>
                )}

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Free Cancellation
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
                {hotel.name}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  {hotel.location}
                </span>

                <span className="text-slate-300 hidden sm:inline">|</span>

                <span className="text-blue-700 font-semibold cursor-pointer hover:underline" onClick={() => scrollToSection('location')}>
                  View on interactive map &amp; nearby spots →
                </span>
              </div>
            </div>

            {/* Overall Rating & Fast Price Card */}
            <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-black text-blue-900 uppercase tracking-wide">
                    {hotel.rating >= 4.8 ? 'Exceptional' : 'Superb'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {hotel.reviews || 1290} verified guest reviews
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-base flex items-center justify-center shadow-md shadow-blue-500/20">
                  {hotel.rating || 4.9}
                </div>
              </div>

              <div className="text-left sm:text-right mt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Rooms starting from
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {formatPrice(DEFAULT_ROOMS[0].priceInr, currency)}
                  <span className="text-xs font-normal text-slate-500 font-sans"> / night</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  + Zero cancellation fee &amp; instant booking
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LUXURY IMAGE GALLERY (1 Large Hero + 4 Mosaic Cards + Lightbox Trigger) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3 rounded-3xl overflow-hidden shadow-md">
            {/* Main Featured Photo (Left 2 cols, 2 rows) */}
            <div
              className="md:col-span-2 md:row-span-2 relative group cursor-pointer aspect-4/3 md:aspect-auto h-72 sm:h-96 md:h-full overflow-hidden"
              onClick={() => {
                setActivePhotoIndex(0);
                setIsPhotoModalOpen(true);
              }}
            >
              <SafeImage
                src={HOTEL_GALLERY_IMAGES[0].url}
                alt={hotel.name}
                fallbackTitle={hotel.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white mb-1.5 inline-block">
                  Featured View
                </span>
                <p className="text-sm sm:text-base font-bold drop-shadow-sm">
                  {HOTEL_GALLERY_IMAGES[0].caption}
                </p>
              </div>
              <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white backdrop-blur-xs group-hover:bg-black/60 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            {/* Right 4 Grid Photos */}
            {HOTEL_GALLERY_IMAGES.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer h-40 sm:h-48 overflow-hidden"
                onClick={() => {
                  setActivePhotoIndex(idx + 1);
                  setIsPhotoModalOpen(true);
                }}
              >
                <SafeImage
                  src={img.url}
                  alt={img.caption}
                  fallbackTitle={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[11px] font-semibold text-white drop-shadow-md line-clamp-1">
                    {img.caption}
                  </span>
                </div>

                {/* Last photo overlay with 'View All' count */}
                {idx === 3 && (
                  <div className="absolute inset-0 bg-slate-950/65 flex flex-col items-center justify-center text-white backdrop-blur-xs p-3 text-center">
                    <Camera className="w-6 h-6 mb-1 text-blue-400" />
                    <span className="text-sm font-extrabold">View All 18 Photos</span>
                    <span className="text-[10px] text-slate-300">Rooms, Pool, Dining, Spa</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              100% verified traveler and property photography
            </span>
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Open Interactive Gallery ({HOTEL_GALLERY_IMAGES.length} curated angles) →
            </button>
          </div>
        </div>

        {/* 4. STICKY SUB-NAVIGATION TABS */}
        <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm p-1.5 mb-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'rooms', label: `Available Rooms (${DEFAULT_ROOMS.length})`, count: DEFAULT_ROOMS.length },
            { id: 'amenities', label: 'Facilities & Amenities' },
            { id: 'location', label: 'Location & Nearby' },
            { id: 'reviews', label: `Guest Reviews (${hotel.reviews || 1290})` },
            { id: 'policies', label: 'Hotel Policies & Rules' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 5. MAIN CONTENT TWO-COLUMN GRID (Details Left / Sticky Selection Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: ROOMS, AMENITIES, REVIEWS, LOCATION, POLICIES (Col 1 to 8) */}
          <div className="lg:col-span-8 space-y-10">
            {/* SECTION A: AVAILABLE ROOMS */}
            <section id="hotel-sec-rooms" className="scroll-mt-28">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                      Select Your Room
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose from {DEFAULT_ROOMS.length} luxury categories. All rooms include air conditioning, en-suite bathroom, and premium linen.
                    </p>
                  </div>

                  {/* Stay Dates Pill */}
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-900">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {displayCheckIn} → {displayCheckOut}
                    </span>
                    <span className="text-blue-400">·</span>
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{travellers} Guest{travellers > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* ROOM CARDS LIST */}
                <div className="space-y-6">
                  {DEFAULT_ROOMS.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const calculatedPrice = getRoomPrice(room);
                    const currentPlan = selectedMealPlan[room.id] || 'breakfast';
                    const discount = Math.round(
                      ((room.originalPriceInr - calculatedPrice) / room.originalPriceInr) * 100
                    );

                    return (
                      <div
                        key={room.id}
                        className={`rounded-2xl border-2 transition-all overflow-hidden ${
                          isSelected
                            ? 'border-blue-600 ring-4 ring-blue-500/10 bg-blue-50/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                          {/* Room Photo & Badges */}
                          <div className="md:col-span-5 relative group min-h-[220px]">
                            <SafeImage
                              src={room.image}
                              alt={room.name}
                              fallbackTitle={room.name}
                              className="w-full h-full object-cover min-h-[220px]"
                            />
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900/85 text-white backdrop-blur-xs">
                                {room.sizeSqFt} sq.ft ({Math.round(room.sizeSqFt * 0.0929)} m²)
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                                {room.view}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold drop-shadow-md">
                              <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                                <Users className="w-3 h-3 text-amber-300" />
                                {room.maxAdults} Adults, {room.maxChildren} Child
                              </span>
                              <span className="bg-emerald-600/90 px-2 py-0.5 rounded-md">
                                {room.availableCount} left
                              </span>
                            </div>
                          </div>

                          {/* Room Specifications & Meal Plan Selector */}
                          <div className="md:col-span-7 p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg">
                                  {room.name}
                                </h3>
                              </div>

                              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                                <span>{room.bedType}</span>
                                <span>•</span>
                                <span>{room.view}</span>
                              </p>

                              {/* Key Room Amenities */}
                              <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-slate-600">
                                {room.perks.slice(0, 4).map((perk, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="truncate">{perk}</span>
                                  </div>
                                ))}
                              </div>

                              {/* MEAL PLAN SELECTION BUTTONS */}
                              <div className="mt-4 pt-3 border-t border-slate-100">
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                  Choose Meal &amp; Rate Option:
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedMealPlan((prev) => ({
                                        ...prev,
                                        [room.id]: 'room-only',
                                      }))
                                    }
                                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                      currentPlan === 'room-only'
                                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-500'
                                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold">Room Only</span>
                                      {currentPlan === 'room-only' && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      Standard base fare
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedMealPlan((prev) => ({
                                        ...prev,
                                        [room.id]: 'breakfast',
                                      }))
                                    }
                                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                      currentPlan === 'breakfast'
                                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500'
                                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold flex items-center gap-1">
                                        <Coffee className="w-3 h-3 text-emerald-600" />
                                        Free Breakfast
                                      </span>
                                      {currentPlan === 'breakfast' && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      )}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                                      Recommended buffet spread
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* PRICE & SELECT ACTION STRIP */}
                            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400 line-through font-mono">
                                    {formatPrice(room.originalPriceInr, currency)}
                                  </span>
                                  {discount > 0 && (
                                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                      {discount}% OFF
                                    </span>
                                  )}
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                                  {formatPrice(calculatedPrice, currency)}
                                  <span className="text-xs font-normal text-slate-500 font-sans">
                                    {' '}
                                    / night
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  + ₹{Math.round(calculatedPrice * 0.12)} GST &amp; resort charges
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRoomId(room.id)}
                                  className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {isSelected ? '✓ Selected' : 'Select'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectRoomAndBook(room)}
                                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <span>Book This Room</span>
                                  <span>→</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION B: FACILITIES & AMENITIES ("facilties") */}
            <section id="hotel-sec-amenities" className="scroll-mt-28">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    Facilities &amp; Luxury Amenities
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thoughtfully designed hospitality services to make your beach escape effortless and indulgent.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category 1: Popular Highlights */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Popular Highlights
                    </h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Waves className="w-4 h-4 text-blue-600" />
                        <span>Infinity Swimming Pool with Shallow Kids Section</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-emerald-600" />
                        <span>Complimentary High-Speed Wi-Fi 6 across resort</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-indigo-600" />
                        <span>Complimentary Valet Parking &amp; EV Charging Station</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-purple-600" />
                        <span>Airport Shuttle &amp; Luxury Cab on Demand</span>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Dining & Bar */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                      <Utensils className="w-4 h-4 text-rose-500" />
                      Dining &amp; Beverages
                    </h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>The Palm Court: Multi-Cuisine All-Day Restaurant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Azure Sunset Beach Bar &amp; Live Cocktails</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>24-Hour In-Room Dining &amp; Chef Special Menus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Kid-friendly meals &amp; specialized Jain / Vegan choices</span>
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Wellness & Spa */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Wellness, Spa &amp; Fitness
                    </h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Ayurvedic Holistic Spa &amp; Aromatherapy Centre</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Steam Room, Sauna &amp; Hydrotherapy Jacuzzis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>24/7 Air-Conditioned Fitness Studio (Technogym)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Morning Beachside Yoga &amp; Meditation Sessions</span>
                      </div>
                    </div>
                  </div>

                  {/* Category 4: Services & Front Desk */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Services &amp; Security
                    </h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>24-Hour Front Desk &amp; Travel Concierge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Daily Housekeeping &amp; Evening Turndown Service</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Luggage Storage &amp; Secure Safety Deposit Lockers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Doctor on Call &amp; First-Aid Certified Staff</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION C: LOCATION & NEARBY ATTRACTIONS ("location") */}
            <section id="hotel-sec-location" className="scroll-mt-28">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    Location &amp; What's Nearby
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {hotel.location} · Prime beachfront address with convenient connectivity.
                  </p>
                </div>

                {/* Visual Map Mock Card */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-16/9 sm:aspect-21/9 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-200/40 to-indigo-900/15" />

                  {/* Simulated Map Grid Lines */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }} />

                  {/* Pin Card Marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-lg border border-white/20 whitespace-nowrap flex items-center gap-1.5 animate-bounce">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 fill-current" />
                      <span>{hotel.name}</span>
                    </div>
                    <div className="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-md -mt-1 ring-4 ring-rose-400/30" />
                  </div>

                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                    Calangute Coastal Strip, North Goa
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <button
                      type="button"
                      onClick={() =>
                        onNotify(
                          'Directions Loaded',
                          'GPS Coordinates: 15.5430° N, 73.7554° E. Calangute Main Beach Road.'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>

                {/* Distances List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Beaches &amp; Coast
                    </div>
                    <div className="font-bold text-xs text-slate-800 mt-1">Calangute Beach</div>
                    <div className="text-[11px] text-blue-600 font-semibold">120 m (2 min walk)</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Nightlife &amp; Cafes
                    </div>
                    <div className="font-bold text-xs text-slate-800 mt-1">Tito’s &amp; Mambo’s Lane</div>
                    <div className="text-[11px] text-blue-600 font-semibold">850 m (10 min walk)</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Heritage Sightseeing
                    </div>
                    <div className="font-bold text-xs text-slate-800 mt-1">Fort Aguada Lighthouse</div>
                    <div className="text-[11px] text-blue-600 font-semibold">4.8 km (12 min drive)</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Airport Connectivity
                    </div>
                    <div className="font-bold text-xs text-slate-800 mt-1">Dabolim Airport (GOI)</div>
                    <div className="text-[11px] text-slate-500 font-semibold">38 km · ~45 min drive</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      New Airport
                    </div>
                    <div className="font-bold text-xs text-slate-800 mt-1">Mopa Airport (GOX)</div>
                    <div className="text-[11px] text-slate-500 font-semibold">29 km · ~35 min drive</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Railway Station
                    </div>
                    <div className="font-bold text-xs text-slate-800 mt-1">Thivim Railway Station</div>
                    <div className="text-[11px] text-slate-500 font-semibold">18 km · ~30 min drive</div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION D: GUEST REVIEWS & BREAKDOWN ("reviews") */}
            <section id="hotel-sec-reviews" className="scroll-mt-28">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                      Guest Reviews &amp; Ratings
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Based on {hotel.reviews || 1290} genuine verified traveler stays on TripYeah.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 font-mono">
                        {hotel.rating || 4.9} / 5.0
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold">
                        98% recommend this stay
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                      ★ {hotel.rating || 4.9}
                    </div>
                  </div>
                </div>

                {/* Rating Sub-Category Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                  {[
                    { label: 'Cleanliness & Hygiene', score: '4.9', percent: 98 },
                    { label: 'Comfort & Bed Quality', score: '4.8', percent: 96 },
                    { label: 'Location & Beach Access', score: '5.0', percent: 100 },
                    { label: 'Staff & Hospitality', score: '4.9', percent: 98 },
                    { label: 'Facilities & Pool', score: '4.8', percent: 96 },
                    { label: 'Value for Money', score: '4.7', percent: 94 },
                  ].map((cat, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700">{cat.label}</span>
                        <span className="font-mono text-slate-900">{cat.score}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Filter Review Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
                  {['All', 'Couple Getaway', 'Family with Children', 'Solo / Leisure'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setReviewFilter(filter)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        reviewFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {GUEST_REVIEWS_DATA.filter(
                    (r) => reviewFilter === 'All' || r.travellerType.includes(reviewFilter)
                  ).map((rev) => {
                    const isUpvoted = !!upvotedReviews[rev.id];

                    return (
                      <div
                        key={rev.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-colors bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                              {rev.author.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                                <span>{rev.author}</span>
                                {rev.verified && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Verified Stay
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{rev.location}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {rev.stayDate}
                            </span>
                            <div className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs">
                              ★ {rev.rating}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-blue-900 mb-1">
                          "{rev.title}"
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rev.comment}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Booked: <strong className="text-slate-600">{rev.roomBooked}</strong></span>
                          <button
                            type="button"
                            onClick={() => {
                              setUpvotedReviews((prev) => ({
                                ...prev,
                                [rev.id]: !prev[rev.id],
                              }));
                            }}
                            className={`flex items-center gap-1 hover:text-slate-700 cursor-pointer ${
                              isUpvoted ? 'text-blue-600 font-bold' : ''
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({rev.helpfulCount + (isUpvoted ? 1 : 0)})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION E: HOTEL POLICIES & HOUSE RULES ("policies wagera") */}
            <section id="hotel-sec-policies" className="scroll-mt-28">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    Hotel Policies &amp; House Rules
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clear regulations to ensure a smooth check-in and pleasant stay for all guests.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Check-in / Check-out Timing */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Check-in Schedule</div>
                        <div className="text-xs text-slate-600">Standard Check-in: <strong>02:00 PM</strong></div>
                        <div className="text-[10px] text-slate-400">Early check-in from 10:00 AM subject to room readiness</div>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-10 bg-slate-200" />

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Check-out Schedule</div>
                        <div className="text-xs text-slate-600">Standard Check-out: <strong>11:00 AM</strong></div>
                        <div className="text-[10px] text-slate-400">Late check-out available upon concierge request</div>
                      </div>
                    </div>
                  </div>

                  {/* Policy Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Free Cancellation Policy
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Free cancellation up to 24 hours prior to check-in date. 100% instant refund back to your original source.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                        <Users className="w-4 h-4 text-blue-600" />
                        Couple &amp; Guest Age Policy
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Couple friendly property. Primary guest must be at least 18 years of age with a valid government ID.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                        <Info className="w-4 h-4 text-amber-600" />
                        Identity Verification
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Government photo ID (Passport, Aadhaar Card, Driving License, or Voter ID) required for every guest. (PAN card is not accepted).
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        Payment &amp; Prepayment
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Pay online or choose Pay at Hotel. Major credit cards, debit cards, UPI, and net banking accepted.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                        <Heart className="w-4 h-4 text-rose-500" />
                        Pet Policy
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Pets are permitted in designated ground-floor private garden villas with prior notification.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        Smoking &amp; Alcohol
                      </div>
                      <p className="text-[11px] text-slate-600">
                        100% non-smoking guest rooms. Designated outdoor smoking pavilions provided across grounds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION F: FREQUENTLY ASKED QUESTIONS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
              <h3 className="text-lg font-black text-slate-900 mb-4 font-display flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: 'Does this resort have direct access to Calangute Beach?',
                    a: 'Yes, our private resort boardwalk leads directly onto Calangute Beach within 120 meters (less than 2 minutes of leisurely walking). Beach towels and loungers are provided free of cost.',
                  },
                  {
                    q: 'Is airport pick-up and drop included in the reservation?',
                    a: 'Complimentary luxury airport transfer is included for Beachfront Villas and Premier Suites. For other categories, private airport taxi can be added at ₹1,200 (Dabolim) or ₹950 (Mopa).',
                  },
                  {
                    q: 'What time is the complimentary buffet breakfast served?',
                    a: 'The breakfast buffet at The Palm Court runs daily from 07:00 AM to 10:30 AM featuring live egg stations, South Indian dosa/idli counters, fresh bakeries, seasonal fruits, and international choices.',
                  },
                  {
                    q: 'Can we request early check-in or late check-out?',
                    a: 'Early check-in from 10:00 AM and late check-out till 02:00 PM are provided complimentary based on room readiness. You are welcome to use the swimming pool, luggage room, and restaurant in the interim.',
                  },
                ].map((faq, i) => {
                  const isOpen = expandedFaqIndex === i;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200/90 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isOpen ? null : i)}
                        className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING SUMMARY CARD (Col 9 to 12) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl border-2 border-blue-600/30 p-5 sm:p-6 shadow-xl shadow-blue-500/5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Your Stay Selection
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Instant Confirmation
                </span>
              </div>

              {/* Selected Room Snippet */}
              <div className="mt-4 p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80">
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Selected Room:
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {currentSelectedRoom.name}
                </div>
                <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1.5">
                  <span>{currentSelectedRoom.bedType}</span>
                  <span>•</span>
                  <span>{currentSelectedRoom.view}</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>
                    {selectedMealPlan[currentSelectedRoom.id] === 'all-meals'
                      ? 'All Meals (Breakfast + Lunch + Dinner)'
                      : selectedMealPlan[currentSelectedRoom.id] === 'breakfast'
                      ? 'Buffet Breakfast Included'
                      : 'Room Only (No Meals)'}
                  </span>
                </div>
              </div>

              {/* Stay Dates Box */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Check-in</div>
                  <div className="font-extrabold text-slate-800 mt-0.5">{displayCheckIn}</div>
                  <div className="text-[10px] text-slate-500">From 02:00 PM</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Check-out</div>
                  <div className="font-extrabold text-slate-800 mt-0.5">{displayCheckOut}</div>
                  <div className="text-[10px] text-slate-500">Until 11:00 AM</div>
                </div>
              </div>

              {/* Guests Count */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Guests:</span>
                </span>
                <span className="font-bold text-slate-900">
                  {travellers} Adult{travellers > 1 ? 's' : ''} (1 Room)
                </span>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Room rate (1 night)</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {formatPrice(getRoomPrice(currentSelectedRoom), currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Taxes &amp; Luxury GST (12%)</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {formatPrice(Math.round(getRoomPrice(currentSelectedRoom) * 0.12), currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Instant TripYeah Promo</span>
                  <span className="font-mono font-bold">-₹500</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Total Payable Amount</div>
                    <div className="text-[10px] text-slate-400">Includes all taxes &amp; fees</div>
                  </div>
                  <div className="text-2xl font-black text-blue-900 font-mono">
                    {formatPrice(
                      Math.max(
                        getRoomPrice(currentSelectedRoom) +
                          Math.round(getRoomPrice(currentSelectedRoom) * 0.12) -
                          500,
                        1000
                      ),
                      currency
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Booking Button */}
              <button
                type="button"
                onClick={() => handleSelectRoomAndBook(currentSelectedRoom)}
                className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-blue-600/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book Now: {currentSelectedRoom.name.split(' ')[0]}</span>
                <span>→</span>
              </button>

              <div className="mt-3 text-center">
                <p className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero cancellation fee · Pay now or pay at check-in</span>
                </p>
              </div>
            </div>

            {/* Need Assistance Card */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs text-slate-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Need help booking this hotel?</div>
                <div className="text-[11px] text-slate-500">Call our 24/7 Goa Concierge Desk at 1800-TRIP-GOA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PHOTO GALLERY LIGHTBOX MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg">
                {hotel.name} - Official Gallery
              </h3>
              <p className="text-xs text-white/60">
                Photo {activePhotoIndex + 1} of {filteredPhotos.length} · {filteredPhotos[activePhotoIndex]?.caption}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Photo Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {['All', 'Rooms & Suites', 'Pool & Beach', 'Dining & Lounge', 'Spa & Wellness', 'Aerial & Grounds'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActivePhotoCategory(cat);
                    setActivePhotoIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activePhotoCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Main Large Image Preview */}
          <div className="flex-1 flex items-center justify-center py-4 relative">
            <SafeImage
              src={filteredPhotos[activePhotoIndex]?.url || ASSETS.bali}
              alt={filteredPhotos[activePhotoIndex]?.caption || hotel.name}
              fallbackTitle={filteredPhotos[activePhotoIndex]?.caption || hotel.name}
              className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {/* Left & Right Navigation Buttons */}
            {activePhotoIndex > 0 && (
              <button
                type="button"
                onClick={() => setActivePhotoIndex((prev) => prev - 1)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer backdrop-blur-xs transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {activePhotoIndex < filteredPhotos.length - 1 && (
              <button
                type="button"
                onClick={() => setActivePhotoIndex((prev) => prev + 1)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer backdrop-blur-xs transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/10 pb-1">
            {filteredPhotos.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActivePhotoIndex(i)}
                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activePhotoIndex === i
                    ? 'border-blue-500 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <SafeImage
                  src={img.url}
                  alt={img.caption}
                  fallbackTitle={img.caption}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 7. MOBILE FLOATING STICKY BOOKING DOCK */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3.5 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">
            {currentSelectedRoom.name.split(' ')[0]} Room
          </div>
          <div className="text-lg font-black text-slate-900 font-mono">
            {formatPrice(getRoomPrice(currentSelectedRoom), currency)}
            <span className="text-[11px] font-normal text-slate-500 font-sans"> / night</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">Free Cancellation</div>
        </div>

        <button
          type="button"
          onClick={() => handleSelectRoomAndBook(currentSelectedRoom)}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Book Room</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
