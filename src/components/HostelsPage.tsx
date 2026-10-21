import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Users,
  Wifi,
  Coffee,
  MapPin,
  Star,
  Search,
  Filter,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  BedDouble,
  Heart,
  Share2,
  Lock,
  Tv,
  Gamepad2,
  Utensils,
  Compass,
  Zap,
  Info,
  ChevronDown,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';
import { SafeImage } from './SafeImage';

export interface HostelItem {
  id: string;
  brand: 'The Hosteller' | 'goSTOPS' | 'Zostel' | 'Madpackers';
  name: string;
  tagline: string;
  city: string;
  locationArea: string;
  rating: number;
  reviewCount: number;
  startingPriceInr: number;
  image: string;
  vibe: 'Workation & Social' | 'Party & Gaming' | 'Heritage & Lakefront' | 'Riverside & Nature' | 'Spiritual & Cultural';
  dormTypes: {
    name: string;
    type: 'female-dorm' | 'mixed-dorm' | 'private-room';
    priceInr: number;
    bedsLeft: number;
    description: string;
  }[];
  amenities: string[];
  highlights: string[];
}

export const HOSTELS_DATA: HostelItem[] = [
  {
    id: 'hostel-th-goa-anjuna',
    brand: 'The Hosteller',
    name: 'The Hosteller Goa, Anjuna',
    tagline: 'Rooftop Pool, Yellow Submarine Cafe & Sunset Vibez',
    city: 'Goa',
    locationArea: 'Anjuna Beach Road, North Goa',
    rating: 4.8,
    reviewCount: 1420,
    startingPriceInr: 599,
    image: '/assets/images/dest_goa_beach_1792241006825.jpg',
    vibe: 'Workation & Social',
    dormTypes: [
      {
        name: '6-Bed AC Mixed Dormitory',
        type: 'mixed-dorm',
        priceInr: 599,
        bedsLeft: 5,
        description: 'Bunk bed with personal reading lamp, privacy curtain, 2 USB charging ports, lockable wardrobe.',
      },
      {
        name: '4-Bed AC Female-Only Dorm',
        type: 'female-dorm',
        priceInr: 699,
        bedsLeft: 3,
        description: 'Female-only safe sanctuary with full-length mirror, en-suite bathroom, vanity station & hairdryer.',
      },
      {
        name: 'Deluxe Private Pool-View Room',
        type: 'private-room',
        priceInr: 2499,
        bedsLeft: 2,
        description: 'King size bed, private balcony overlooking pool, workstation desk, mini-fridge & smart TV.',
      },
    ],
    amenities: ['150 Mbps Wi-Fi', 'Swimming Pool', 'Rooftop Cafe', 'Female Dorms', 'Scooter Rental', 'Air Conditioned'],
    highlights: ['5 mins walk from Anjuna Beach', 'Nightly live music & beach volleyball', 'Co-working zone with silent booths'],
  },
  {
    id: 'hostel-gs-rishikesh',
    brand: 'goSTOPS',
    name: 'goSTOPS Rishikesh Tapovan',
    tagline: 'Panoramic Ganga Rooftops & 24/7 Gaming Common Area',
    city: 'Rishikesh',
    locationArea: 'Tapovan, Upper Badrinath Marg (Near Laxman Jhula)',
    rating: 4.7,
    reviewCount: 2180,
    startingPriceInr: 499,
    image: '/assets/images/banner_mountain_traveler_1790774776035.jpg',
    vibe: 'Party & Gaming',
    dormTypes: [
      {
        name: '8-Bed AC Mixed Social Dorm',
        type: 'mixed-dorm',
        priceInr: 499,
        bedsLeft: 8,
        description: 'Spacious high-ceiling dorm with underbed electronic lockers and orthopedic spring mattresses.',
      },
      {
        name: '6-Bed Female-Only Sanctuary',
        type: 'female-dorm',
        priceInr: 599,
        bedsLeft: 4,
        description: 'Keycard access, attached washroom, organic toiletries, dedicated dressing mirror.',
      },
      {
        name: 'Private Ganga-View Balcony Room',
        type: 'private-room',
        priceInr: 1999,
        bedsLeft: 1,
        description: 'Serene mountain and river sunrise views, double plush bed, private bathroom, high-speed fiber Wi-Fi.',
      },
    ],
    amenities: ['PS5 & Pool Table', 'Soundproof Home Theater', 'Rooftop Cafe', 'Ganga View', 'Free Chai & Biscuits', 'Yoga Terrace'],
    highlights: ['Daily curated Ganga Aarti walks & river rafting', 'In-house movie nights & board game tournaments', 'Pet friendly common lounge'],
  },
  {
    id: 'hostel-th-manali-old',
    brand: 'The Hosteller',
    name: 'The Hosteller Manali (Old Manali)',
    tagline: 'Apple Orchard Workation with Snow Peak Views',
    city: 'Manali',
    locationArea: 'Old Manali, Himachal Pradesh',
    rating: 4.9,
    reviewCount: 1890,
    startingPriceInr: 649,
    image: '/assets/images/dest_manali_snow_1792241007871.jpg',
    vibe: 'Riverside & Nature',
    dormTypes: [
      {
        name: '4-Bed Cozy Alpine Mixed Dorm',
        type: 'mixed-dorm',
        priceInr: 649,
        bedsLeft: 4,
        description: 'Pine-wood bunk beds with warm duvets, personal lockers, mountain view windows & silent hours.',
      },
      {
        name: '4-Bed Female Dorm with Balcony',
        type: 'female-dorm',
        priceInr: 749,
        bedsLeft: 2,
        description: 'Heated blankets in winter, wooden pine flooring, valley balcony access, private en-suite bath.',
      },
      {
        name: 'Cedar Wooden Attic Suite',
        type: 'private-room',
        priceInr: 2899,
        bedsLeft: 2,
        description: 'Romantic wooden sloping ceiling, panoramic Himalayan vista, work desk & heated room.',
      },
    ],
    amenities: ['Heated Beds', 'High-Speed Fiber Wi-Fi', 'Apple Orchard Lawn', 'Bonfire Nights', 'Cafe Bistro', 'Power Backup'],
    highlights: ['Walking distance to Manu Temple & Old Manali cafes', 'Workation paradise with ergonomic chairs & power backup', 'Evening acoustic jam sessions by the bonfire'],
  },
  {
    id: 'hostel-gs-goa-calangute',
    brand: 'goSTOPS',
    name: 'goSTOPS Goa, Calangute',
    tagline: 'Tropical Courtyard Pool & Coastal Chill Zone',
    city: 'Goa',
    locationArea: 'Calangute Beach Road, North Goa',
    rating: 4.7,
    reviewCount: 1640,
    startingPriceInr: 549,
    image: '/assets/images/dest_goa_beach_1792241006825.jpg',
    vibe: 'Party & Gaming',
    dormTypes: [
      {
        name: '6-Bed AC Mixed Bunk Dorm',
        type: 'mixed-dorm',
        priceInr: 549,
        bedsLeft: 6,
        description: 'Modern pod-style beds with individual curtain screens, 2 power sockets & secure luggage cage.',
      },
      {
        name: '4-Bed Premium Female Dorm',
        type: 'female-dorm',
        priceInr: 649,
        bedsLeft: 3,
        description: 'En-suite bath, biometric card door lock, personal vanity mirrors and fresh linen.',
      },
      {
        name: 'Private Palm Studio with Patio',
        type: 'private-room',
        priceInr: 2299,
        bedsLeft: 2,
        description: 'Queen bed, direct access to pool deck, air conditioning, smart television & coffee station.',
      },
    ],
    amenities: ['Outdoor Pool', 'Foosball & Ping Pong', 'Bar Counter', 'Laundry Facility', 'Community Kitchen', '24/7 Security'],
    highlights: ['8 mins walk to Calangute Beach', 'Sundowner DJ events & beer pong championships', 'Bike & scooter rental right at reception'],
  },
  {
    id: 'hostel-zs-udaipur-pichola',
    brand: 'Zostel',
    name: 'Zostel Udaipur (Lake Pichola)',
    tagline: 'Heritage Waterfront Haveli with Castle Views',
    city: 'Udaipur',
    locationArea: 'Pichola, Old City, Udaipur, Rajasthan',
    rating: 4.9,
    reviewCount: 3400,
    startingPriceInr: 699,
    image: '/assets/images/dest_udaipur_palace_1792241008240.jpg',
    vibe: 'Heritage & Lakefront',
    dormTypes: [
      {
        name: '6-Bed Traditional Jharokha Dorm',
        type: 'mixed-dorm',
        priceInr: 699,
        bedsLeft: 4,
        description: 'Handcrafted Rajasthani wooden bunks, lake breeze windows, personal reading lamps & lockers.',
      },
      {
        name: '4-Bed Royal Female Dorm',
        type: 'female-dorm',
        priceInr: 799,
        bedsLeft: 2,
        description: 'Exclusively for female travellers, en-suite marble bath, traditional mirrors & premium bedding.',
      },
      {
        name: 'Lake-Facing Private Haveli Room',
        type: 'private-room',
        priceInr: 3199,
        bedsLeft: 1,
        description: 'Private window jharokha looking onto Lake Pichola and City Palace, King size mattress & tea kettle.',
      },
    ],
    amenities: ['Rooftop Lake Cafe', 'Heritage Courtyard', 'Cultural City Walks', 'Free High-Speed Wi-Fi', 'Library & Board Games'],
    highlights: ['Breathtaking sunset views of Taj Lake Palace & Jag Mandir', 'Daily Old City heritage walking tours with guide', 'Rooftop dining with Indian delicacies & mocktails'],
  },
  {
    id: 'hostel-th-jaipur-pink',
    brand: 'The Hosteller',
    name: 'The Hosteller Jaipur (MI Road)',
    tagline: 'Vibrant Pink City Backpacker Hub with Co-working',
    city: 'Jaipur',
    locationArea: 'MI Road, Near Railway Station & Hawa Mahal',
    rating: 4.8,
    reviewCount: 1310,
    startingPriceInr: 499,
    image: '/assets/images/dest_udaipur_palace_1792241008240.jpg',
    vibe: 'Workation & Social',
    dormTypes: [
      {
        name: '8-Bed AC Mixed Nomad Dorm',
        type: 'mixed-dorm',
        priceInr: 499,
        bedsLeft: 7,
        description: 'Clean bunk beds with privacy curtains, bedside sockets, lockable storage cage & air-con.',
      },
      {
        name: '6-Bed AC Female Sanctuary',
        type: 'female-dorm',
        priceInr: 599,
        bedsLeft: 3,
        description: 'Restricted key-card access, attached washroom, daily fresh linen & vanity corner.',
      },
      {
        name: 'Rajputana Private Suite',
        type: 'private-room',
        priceInr: 1999,
        bedsLeft: 3,
        description: 'Double bed with plush pillows, work desk, private bath with hot rain shower & flat-screen TV.',
      },
    ],
    amenities: ['Dedicated Coworking Desks', 'Rooftop Cafe & Chai Bar', 'Games Lounge', 'Tour Desk', 'Luggage Storage'],
    highlights: ['Curated Jaipur street food & bazaar trails', 'Fast fiber connection for remote work', 'Chai & cookie sessions at 5 PM'],
  },
  {
    id: 'hostel-th-kasol-chalal',
    brand: 'The Hosteller',
    name: 'The Hosteller Kasol (Parvati Valley)',
    tagline: 'Pine Forest Riverside Haven & Starry Bonfires',
    city: 'Kasol',
    locationArea: 'Chalal Trail, Parvati River, Himachal Pradesh',
    rating: 4.9,
    reviewCount: 2450,
    startingPriceInr: 599,
    image: '/assets/images/hero_alpine_lakeside_1790774682097.jpg',
    vibe: 'Riverside & Nature',
    dormTypes: [
      {
        name: '6-Bed Pine Forest Mixed Dorm',
        type: 'mixed-dorm',
        priceInr: 599,
        bedsLeft: 5,
        description: 'Wood-clad cabin dorm with river-sound ambience, thick fleece duvets, electronic lockers.',
      },
      {
        name: '4-Bed Female Mountain Dorm',
        type: 'female-dorm',
        priceInr: 699,
        bedsLeft: 2,
        description: 'En-suite bath, alpine view balcony, heated blankets & feminine hygiene essentials.',
      },
      {
        name: 'Riverside Wooden Chalet Room',
        type: 'private-room',
        priceInr: 2699,
        bedsLeft: 1,
        description: 'Direct views of Parvati River rapids, private deck, King bed, electric kettle & heater.',
      },
    ],
    amenities: ['Riverside Cafe', 'Bonfire Courtyard', 'Kheerganga Trek Briefing', 'Pet Friendly', 'Starlink / High-Speed Wi-Fi'],
    highlights: ['Direct access to Parvati riverbank in 2 minutes', 'Basecamp for Grahan & Kheerganga treks', 'Starry sky acoustic nights'],
  },
  {
    id: 'hostel-gs-varanasi-ghats',
    brand: 'goSTOPS',
    name: 'goSTOPS Varanasi (Assi Ghat)',
    tagline: 'Colors of Kashi with Spiritual Ghats Access',
    city: 'Varanasi',
    locationArea: 'Bhadaini, Assi Ghat Road, Varanasi',
    rating: 4.7,
    reviewCount: 1520,
    startingPriceInr: 449,
    image: '/assets/images/dest_bali_temple_1790774699717.jpg',
    vibe: 'Spiritual & Cultural',
    dormTypes: [
      {
        name: '8-Bed AC Ghat Mixed Dorm',
        type: 'mixed-dorm',
        priceInr: 449,
        bedsLeft: 6,
        description: 'Cool air-conditioned dorm, thick mattresses, privacy blinds, charging station & storage.',
      },
      {
        name: '6-Bed Female Sanctuary',
        type: 'female-dorm',
        priceInr: 549,
        bedsLeft: 3,
        description: 'Female only floor, modern washrooms, high security, complimentary towel on check-in.',
      },
      {
        name: 'Private Deluxe Kashi Room',
        type: 'private-room',
        priceInr: 1850,
        bedsLeft: 2,
        description: 'Queen bed, vibrant wall art, attached modern bathroom with 24/7 hot water & smart TV.',
      },
    ],
    amenities: ['Rooftop Sunrise View', 'Subah-e-Banaras Walks', 'Common Kitchen', 'Movie Screening Lounge', 'Luggage Room'],
    highlights: ['5 mins walk to Assi Ghat for morning yoga & aarti', 'Boat ride community bookings at discounted rates', 'Clean, modern oasis amidst ancient city lanes'],
  },
];

const HOSTEL_HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2000&q=80',
    caption: 'Backpacker Bunks & Social Vibe',
  },
  {
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80',
    caption: 'Rooftop Cafe & Swimming Pool',
  },
  {
    url: '/assets/images/dest_goa_beach_1792241006825.jpg',
    caption: 'Goa Coastal Hostels',
  },
  {
    url: '/assets/images/dest_manali_snow_1792241007871.jpg',
    caption: 'Himalayan Mountain Stays',
  },
  {
    url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=2000&q=80',
    caption: 'Community Lounges & Gaming Zones',
  },
];

interface HostelsPageProps {
  currency: CurrencyCode;
  onBackToHome: () => void;
  onSelectHostelForCheckout: (checkoutSummary: {
    title: string;
    code: string;
    category: 'hotels';
    priceInr: number;
    hotelName: string;
    hotelLocation: string;
    roomType: string;
    depTime: string;
    arrTime: string;
    duration: string;
    fromCity: string;
    toCity: string;
    travelDate: string;
    travellers: number;
    cabinClass: string;
  }) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
}

export const HostelsPage: React.FC<HostelsPageProps> = ({
  currency,
  onBackToHome,
  onSelectHostelForCheckout,
  onNotify,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<'All' | 'The Hosteller' | 'goSTOPS' | 'Zostel'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bedTypeFilter, setBedTypeFilter] = useState<'all' | 'female-dorm' | 'mixed-dorm' | 'private-room'>('all');
  const [activeHostelModal, setActiveHostelModal] = useState<HostelItem | null>(null);
  const [selectedDormIndex, setSelectedDormIndex] = useState<number>(0);
  const [bedsCount, setBedsCount] = useState<number>(1);
  const [checkInDate, setCheckInDate] = useState<string>('2026-10-18');
  const [nightsCount, setNightsCount] = useState<number>(2);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Auto-rotating background slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HOSTEL_HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const filteredHostels = useMemo(() => {
    return HOSTELS_DATA.filter((h) => {
      if (selectedBrand !== 'All' && h.brand !== selectedBrand) return false;
      if (bedTypeFilter !== 'all') {
        const hasDormType = h.dormTypes.some((d) => d.type === bedTypeFilter);
        if (!hasDormType) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          h.name.toLowerCase().includes(q) ||
          h.brand.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.locationArea.toLowerCase().includes(q) ||
          h.vibe.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [selectedBrand, bedTypeFilter, searchQuery]);

  const handleOpenHostelBooking = (hostel: HostelItem) => {
    setActiveHostelModal(hostel);
    setSelectedDormIndex(0);
    setBedsCount(1);
  };

  const handleConfirmHostelBooking = () => {
    if (!activeHostelModal) return;
    const dorm = activeHostelModal.dormTypes[selectedDormIndex];
    const totalPrice = dorm.priceInr * bedsCount * nightsCount;

    onSelectHostelForCheckout({
      title: `${activeHostelModal.name} (${dorm.name})`,
      code: `${activeHostelModal.id}-${dorm.type}`,
      category: 'hotels',
      priceInr: totalPrice,
      hotelName: activeHostelModal.name,
      hotelLocation: activeHostelModal.locationArea,
      roomType: `${dorm.name} (${bedsCount} ${dorm.type === 'private-room' ? 'Room' : 'Beds'} · ${nightsCount} Nights)`,
      depTime: 'Check-in: 01:00 PM',
      arrTime: 'Check-out: 11:00 AM',
      duration: `${nightsCount} Nights Stay`,
      fromCity: 'New Delhi (DEL)',
      toCity: `${activeHostelModal.city}`,
      travelDate: checkInDate,
      travellers: bedsCount,
      cabinClass: 'Standard Bed',
    });

    onNotify(
      'Bed Reserved!',
      `Proceeding to checkout for ${activeHostelModal.name}. Have an awesome backpacker trip!`,
      'success'
    );
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* 1. TOP HEADER & BRAND HERO BANNER WITH BACKGROUND SLIDESHOW */}
      <div className="relative text-white overflow-hidden border-b border-slate-800/80 bg-slate-950">
        {/* Background Image Slideshow with smooth crossfade - crisp & clearly visible */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HOSTEL_HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIndex ? 'opacity-85' : 'opacity-0'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.caption}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out"
              />
            </div>
          ))}
          {/* Balanced clean gradient overlay for crystal clear photo visibility + text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/55" />
          <div className="absolute inset-0 bg-slate-950/15" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-12">
          {/* Back button - placed lower with breathing space */}
          <div className="pt-2 sm:pt-4 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-amber-300 px-4 py-2 rounded-xl bg-slate-950/50 hover:bg-slate-900/70 transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Stays &amp; Hotels</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                Backpacker Hostels &amp; Workations
              </h1>
              <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium drop-shadow-sm">
                Book top-rated dorm beds and private rooms with verified 100+ Mbps Wi-Fi, vibrant community cafes,
                female-only safe dorms, and unforgettable social events across India.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/20 text-center shadow-lg">
                <span className="block text-2xl font-black font-mono text-amber-300">₹449</span>
                <span className="text-[11px] text-white/90 font-medium">Beds Starting From</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/20 text-center shadow-lg">
                <span className="block text-2xl font-black font-mono text-emerald-400">100+</span>
                <span className="text-[11px] text-white/90 font-medium">Mbps High-Speed WiFi</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/20 text-center col-span-2 sm:col-span-1 shadow-lg">
                <span className="block text-2xl font-black font-mono text-sky-400">100%</span>
                <span className="text-[11px] text-white/90 font-medium">Safe Female Dorms</span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-8 bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl shadow-2xl border border-white/30 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city (Goa, Manali, Rishikesh), hostel chain (The Hosteller, goSTOPS)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Clear Search */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-slate-900 px-3 py-2 cursor-pointer font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. FILTER STRIPS: BRANDS & ROOM TYPES (Hubs removed as requested) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
        {/* Brand Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Chains:</span>
          {(['All', 'The Hosteller', 'goSTOPS', 'Zostel'] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBrand(b)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
                selectedBrand === b
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {b === 'All' ? 'All Hostel Brands' : b}
            </button>
          ))}
        </div>

        {/* Bed Type Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Stays' },
              { id: 'female-dorm', label: '👩 Female-Only Dorms' },
              { id: 'mixed-dorm', label: '🛏️ Mixed Bunk Dorms' },
              { id: 'private-room', label: '🚪 Private Ensuite Rooms' },
            ].map((bt) => (
              <button
                key={bt.id}
                type="button"
                onClick={() => setBedTypeFilter(bt.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  bedTypeFilter === bt.id
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                {bt.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-mono">{filteredHostels.length}</strong> backpacker properties
          </div>
        </div>
      </div>

      {/* 3. HOSTEL CARDS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {filteredHostels.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-800">No hostels matched your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try switching your chain filter to &quot;All&quot; or clearing your search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedBrand('All');
                setSearchQuery('');
                setBedTypeFilter('all');
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer shadow-xs hover:bg-indigo-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels.map((hostel) => (
              <div
                key={hostel.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col group"
              >
                {/* Image Cover & Brand Badge */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <SafeImage
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-900/30" />

                  {/* Chain Branding Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${
                        hostel.brand === 'The Hosteller'
                          ? 'bg-amber-400 text-slate-900'
                          : hostel.brand === 'goSTOPS'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {hostel.brand}
                    </span>
                  </div>

                  {/* Rating Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hostel.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({hostel.reviewCount})</span>
                  </div>

                  {/* Vibe Pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] font-bold backdrop-blur-sm border border-white/20">
                      {hostel.vibe}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {hostel.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">
                      {hostel.tagline}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{hostel.locationArea}</span>
                    </div>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {hostel.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hostel.amenities.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px]">
                          +{hostel.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                        Dorms From
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-xl font-black text-slate-900">
                          {formatPrice(hostel.startingPriceInr, currency)}
                        </span>
                        <span className="text-xs text-slate-400">/ night</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenHostelBooking(hostel)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Dorms</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. BED & ROOM SELECTION BOOKING MODAL */}
      {activeHostelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                    {activeHostelModal.brand}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ⭐ {activeHostelModal.rating} ({activeHostelModal.reviewCount} Reviews)
                  </span>
                </div>
                <h3 className="font-display font-black text-xl text-slate-900 mt-1">
                  {activeHostelModal.name}
                </h3>
                <p className="text-xs text-slate-500">{activeHostelModal.locationArea}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveHostelModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stay Dates & Beds Counter Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Check-in Date:</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Stay Duration:</label>
                <select
                  value={nightsCount}
                  onChange={(e) => setNightsCount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
                >
                  <option value={1}>1 Night</option>
                  <option value={2}>2 Nights</option>
                  <option value={3}>3 Nights</option>
                  <option value={4}>4 Nights</option>
                  <option value={7}>7 Nights (Weekly Workation)</option>
                  <option value={14}>14 Nights (Workation Special)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Number of Beds / Rooms:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBedsCount(Math.max(1, bedsCount - 1))}
                    disabled={bedsCount <= 1}
                    className="w-7 h-7 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-sm text-slate-900 w-6 text-center">
                    {bedsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBedsCount(Math.min(6, bedsCount + 1))}
                    disabled={bedsCount >= 6}
                    className="w-7 h-7 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Dorm & Room Options List */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                Select Your Bed / Room Type:
              </label>

              <div className="space-y-2.5">
                {activeHostelModal.dormTypes.map((dorm, idx) => {
                  const isSelected = selectedDormIndex === idx;
                  return (
                    <div
                      key={dorm.name}
                      onClick={() => setSelectedDormIndex(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{dorm.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              dorm.type === 'female-dorm'
                                ? 'bg-pink-100 text-pink-800'
                                : dorm.type === 'private-room'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {dorm.type === 'female-dorm'
                              ? 'Female Only'
                              : dorm.type === 'private-room'
                              ? 'Private Room'
                              : 'Mixed Dorm'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{dorm.description}</p>
                        <span className="text-[11px] text-emerald-600 font-bold block">
                          ✓ {dorm.bedsLeft} spots left for chosen dates
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-base font-black text-slate-900">
                          {formatPrice(dorm.priceInr, currency)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ bed / night</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Fare & Confirmation Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Total for {bedsCount} {activeHostelModal.dormTypes[selectedDormIndex].type === 'private-room' ? 'room' : 'bed(s)'} · {nightsCount} Nights:
                </span>
                <span className="font-mono text-2xl font-black text-slate-900">
                  {formatPrice(
                    activeHostelModal.dormTypes[selectedDormIndex].priceInr * bedsCount * nightsCount,
                    currency
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmHostelBooking}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>Reserve Bed &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
