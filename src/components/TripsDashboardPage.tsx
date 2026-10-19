import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plane,
  Building2,
  TrainFront,
  Bus,
  Palmtree,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  Share2,
  Printer,
  Download,
  Trash2,
  RotateCcw,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Copy,
  Check,
  MapPin,
  User,
  Users,
  CreditCard,
  ShieldCheck,
  FileText,
  Headphones,
  Sparkles,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  X,
  ExternalLink,
  MessageCircle,
  Receipt,
  QrCode,
  Armchair,
  Info,
  BadgeCheck,
  Ticket,
  Luggage,
  Coffee,
  Wifi,
  Phone,
  HelpCircle,
  Compass,
} from 'lucide-react';
import {
  ASSETS,
  BookedTrip,
  BookingCategory,
  CurrencyCode,
  formatPrice,
  SAMPLE_DEMO_TRIPS,
} from '../data/travelData';
import { ActiveCredentialModal } from './CredentialModals';
import { SafeImage } from './SafeImage';

// Generated dynamic background images matching specific tab moods
import bgUpcoming from '../assets/images/bg_trip_upcoming_1792245330035.jpg';
import bgCancelled from '../assets/images/bg_trip_cancelled_1792245330926.jpg';
import bgCompleted from '../assets/images/bg_trip_completed_1792245331105.jpg';
import bgTripPoints from '../assets/images/bg_trip_points_1792245331552.jpg';

interface TripsDashboardPageProps {
  currency: CurrencyCode;
  bookedTrips: BookedTrip[];
  onUpdateBookedTrips?: (trips: BookedTrip[]) => void;
  onBookNewTrip: () => void;
  onOpenCredentialModal: (modal: ActiveCredentialModal) => void;
  onNavigateToProfile: () => void;
  onNavigateToSearch?: (category?: BookingCategory, destination?: string) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
}

export type TabType = 'upcoming' | 'cancelled' | 'completed';
export type HeroMoodTheme = 'upcoming' | 'cancelled' | 'completed' | 'trippoints';
type SortType = 'date-asc' | 'date-desc' | 'booked-desc' | 'price-desc' | 'price-asc';

// Top slideshow destination list for background rotation
const SLIDESHOW_DESTINATIONS = [
  {
    image: ASSETS.bali,
    name: 'Bali, Indonesia',
    tagline: 'Emerald Rice Terraces & Clifftop Sunsets',
  },
  {
    image: ASSETS.heroAlpine,
    name: 'Swiss Alpine Valley',
    tagline: 'Glacial Lakes & Cogwheel Panoramic Rails',
  },
  {
    image: ASSETS.dubai,
    name: 'Dubai, UAE',
    tagline: 'Futuristic Metros & Desert Dune Safari',
  },
  {
    image: ASSETS.paris,
    name: 'Paris, France',
    tagline: 'Champs-Élysées & Romantic Seine Riverfront',
  },
  {
    image: ASSETS.heroSantorini,
    name: 'Santorini, Greece',
    tagline: 'Azure Domes & Aegean Sunsets',
  },
  {
    image: ASSETS.goa || ASSETS.bali,
    name: 'Goa Beaches, India',
    tagline: 'Golden Sands, Seafood Bistros & Palm Groves',
  },
];

export const TripsDashboardPage: React.FC<TripsDashboardPageProps> = ({
  currency,
  bookedTrips,
  onUpdateBookedTrips,
  onBookNewTrip,
  onOpenCredentialModal,
  onNavigateToProfile,
  onNavigateToSearch,
  onNotify,
}) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  // Hero Background Theme (Upcoming, Cancelled, Completed, or Yellow TripPoints)
  const [heroTheme, setHeroTheme] = useState<HeroMoodTheme>('upcoming');
  const [showPointsModal, setShowPointsModal] = useState<boolean>(false);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<BookingCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortType>('date-asc');

  // Demo Mode Switch (persisted in session)
  const [demoMode, setDemoMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_trips_demo_mode');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Top Background Slideshow Index
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Modals & Details State
  const [selectedTripForManage, setSelectedTripForManage] = useState<BookedTrip | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('Change in travel plans');
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('2026-10-25');
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewTrip, setReviewTrip] = useState<BookedTrip | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewFeedback, setReviewFeedback] = useState<string>('');
  const [reviewTags, setReviewTags] = useState<string[]>(['On-time Departure', 'Clean Seats', 'Great Service']);

  // Loading Skeleton simulation on filter change
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Pagination
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Copy Feedback
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);

  // Auto-rotate slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDESHOW_DESTINATIONS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Save demo mode state
  const handleToggleDemoMode = (enabled: boolean) => {
    setDemoMode(enabled);
    try {
      localStorage.setItem('tripyeah_trips_demo_mode', String(enabled));
    } catch {}
    onNotify(
      enabled ? 'Demo Mode Enabled' : 'Demo Mode Disabled',
      enabled
        ? 'Showing sample demonstration bookings alongside your real records.'
        : 'Displaying only your actual booked trips.',
      'info'
    );
  };

  // Combine real user bookings with demo sample bookings if demoMode is ON
  const allAvailableTrips = useMemo<BookedTrip[]>(() => {
    if (!demoMode) {
      return bookedTrips;
    }
    // In demo mode, merge real trips with sample demo trips (avoiding duplicate bookingId)
    const realIds = new Set(bookedTrips.map((t) => t.bookingId));
    const demoToAdd = SAMPLE_DEMO_TRIPS.filter((d) => !realIds.has(d.bookingId));
    return [...bookedTrips, ...demoToAdd];
  }, [bookedTrips, demoMode]);

  // Tab counts based on ACTUAL status
  const counts = useMemo(() => {
    const upcoming = allAvailableTrips.filter((t) => t.status === 'Confirmed').length;
    const cancelled = allAvailableTrips.filter((t) => t.status === 'Cancelled').length;
    const completed = allAvailableTrips.filter((t) => t.status === 'Completed').length;
    return { upcoming, cancelled, completed };
  }, [allAvailableTrips]);

  // Filter and Sort Trips
  const filteredTrips = useMemo(() => {
    let list = allAvailableTrips.filter((trip) => {
      // Tab filter
      if (activeTab === 'upcoming' && trip.status !== 'Confirmed') return false;
      if (activeTab === 'cancelled' && trip.status !== 'Cancelled') return false;
      if (activeTab === 'completed' && trip.status !== 'Completed') return false;

      // Category filter
      if (selectedCategory !== 'all' && trip.category !== selectedCategory) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = trip.bookingId.toLowerCase().includes(q);
        const matchesRef = trip.bookingReference?.toLowerCase().includes(q);
        const matchesTitle = trip.title.toLowerCase().includes(q);
        const matchesRoute = trip.routeSummary.toLowerCase().includes(q);
        const matchesCity = trip.destinationCity?.toLowerCase().includes(q);
        const matchesCarrier = trip.carrierOrHotel?.toLowerCase().includes(q);
        const matchesPassenger = trip.passengers?.some((p) =>
          p.name.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesRef && !matchesTitle && !matchesRoute && !matchesCity && !matchesCarrier && !matchesPassenger) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'price-desc') return b.totalPaidInr - a.totalPaidInr;
      if (sortBy === 'price-asc') return a.totalPaidInr - b.totalPaidInr;
      if (sortBy === 'booked-desc') {
        return new Date(b.bookedAt || '2026-01-01').getTime() - new Date(a.bookedAt || '2026-01-01').getTime();
      }
      if (sortBy === 'date-desc') {
        const dateA = a.departureDate || a.dateSummary || '';
        const dateB = b.departureDate || b.dateSummary || '';
        return dateB.localeCompare(dateA);
      }
      // date-asc default
      const dateA = a.departureDate || a.dateSummary || '';
      const dateB = b.departureDate || b.dateSummary || '';
      return dateA.localeCompare(dateB);
    });

    return list;
  }, [allAvailableTrips, activeTab, selectedCategory, searchQuery, sortBy]);

  // Simulate quick skeleton transition on filter change & set dynamic hero theme
  const handleTabChange = (tab: TabType) => {
    setIsFiltering(true);
    setActiveTab(tab);
    setHeroTheme(tab);
    setVisibleCount(6);
    setTimeout(() => setIsFiltering(false), 220);
  };

  // Switch to Golden TripPoints Rewards mood and open points vault
  const handleSelectPointsTheme = () => {
    setHeroTheme('trippoints');
    setShowPointsModal(true);
    onNotify(
      'TripPoints Loyalty Vault',
      'Displaying golden rewards theme. You have 2,705 active points ready to redeem.',
      'info'
    );
  };

  const handleCopyBookingId = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedBookingId(id);
    onNotify('Booking ID Copied', `${id} copied to your clipboard.`);
    setTimeout(() => setCopiedBookingId(null), 2000);
  };

  // Perform Real Cancellation and Refund Calculation
  const handleConfirmCancellation = () => {
    if (!selectedTripForManage) return;

    const refundPercent = 100; // Free cancellation guarantee
    const refundAmt = Math.round(selectedTripForManage.totalPaidInr * (refundPercent / 100));
    const nowIso = new Date().toISOString().split('T')[0];

    const updatedTrip: BookedTrip = {
      ...selectedTripForManage,
      status: 'Cancelled',
      cancellationDate: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      cancellationReason: cancelReason,
      refundStatus: 'Refund Processed',
      refundAmountInr: refundAmt,
      refundId: `REF-${Math.floor(100000 + Math.random() * 900000)}-TY`,
    };

    if (onUpdateBookedTrips) {
      const updatedList = bookedTrips.map((t) =>
        t.bookingId === selectedTripForManage.bookingId ? updatedTrip : t
      );
      // If it wasn't already in bookedTrips (e.g. was a demo item), append it so user sees it in Cancelled tab
      if (!bookedTrips.some((t) => t.bookingId === selectedTripForManage.bookingId)) {
        updatedList.unshift(updatedTrip);
      }
      onUpdateBookedTrips(updatedList);
    }

    setShowCancelModal(false);
    setSelectedTripForManage(updatedTrip);
    onNotify(
      'Booking Cancelled & Refund Initiated',
      `Booking ${updatedTrip.bookingId} cancelled. ${formatPrice(refundAmt, currency)} will be refunded to your original payment mode within 24 hours.`,
      'success'
    );
  };

  // Perform Reschedule
  const handleConfirmReschedule = () => {
    if (!selectedTripForManage) return;

    const formattedDate = new Date(newRescheduleDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const updatedTrip: BookedTrip = {
      ...selectedTripForManage,
      departureDate: newRescheduleDate,
      dateSummary: `${formattedDate} · Rescheduled Departure`,
    };

    if (onUpdateBookedTrips) {
      const updatedList = bookedTrips.map((t) =>
        t.bookingId === selectedTripForManage.bookingId ? updatedTrip : t
      );
      if (!bookedTrips.some((t) => t.bookingId === selectedTripForManage.bookingId)) {
        updatedList.unshift(updatedTrip);
      }
      onUpdateBookedTrips(updatedList);
    }

    setShowRescheduleModal(false);
    setSelectedTripForManage(updatedTrip);
    onNotify(
      'Journey Rescheduled Successfully',
      `Trip ${updatedTrip.bookingId} moved to ${formattedDate}. New boarding passes issued.`,
      'success'
    );
  };

  // Submit Review
  const handleSubmitReview = () => {
    if (!reviewTrip) return;
    onNotify(
      'Review Submitted with +200 TripPoints',
      `Thank you for rating your trip to ${reviewTrip.destinationCity || reviewTrip.title}! Your feedback helps other travelers.`,
      'success'
    );
    setShowReviewModal(false);
    setReviewTrip(null);
  };

  // Compute live countdown string
  const getTripCountdown = (trip: BookedTrip) => {
    if (trip.status !== 'Confirmed') return null;

    if (trip.departureDate) {
      const target = new Date(trip.departureDate).getTime();
      const now = new Date().getTime();
      const diffMs = target - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 1) return `Departs in ${diffDays} Days`;
      if (diffDays === 1) return 'Departs Tomorrow';
      if (diffDays === 0) return 'Departs Today!';
      if (diffDays < 0) return 'Travel Date Active';
    }
    return 'Confirmed & Ready to Travel';
  };

  // Category Icon Resolver
  const getCategoryIcon = (cat: BookingCategory) => {
    switch (cat) {
      case 'flights':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'hotels':
        return <Building2 className="w-4 h-4 text-cyan-600" />;
      case 'trains':
        return <TrainFront className="w-4 h-4 text-indigo-600" />;
      case 'buses':
        return <Bus className="w-4 h-4 text-sky-600" />;
      case 'holidays':
        return <Palmtree className="w-4 h-4 text-teal-600" />;
      case 'cabs':
        return <Compass className="w-4 h-4 text-amber-600" />;
      default:
        return <Plane className="w-4 h-4 text-blue-600" />;
    }
  };

  // Category Badge Label
  const getCategoryLabel = (cat: BookingCategory) => {
    switch (cat) {
      case 'flights':
        return 'Flight';
      case 'hotels':
        return 'Hotel Stay';
      case 'trains':
        return 'Train Express';
      case 'buses':
        return 'Bus Seat';
      case 'holidays':
        return 'Holiday Package';
      case 'cabs':
        return 'Outstation Cab';
      default:
        return 'Travel';
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 pb-16">
      {/* =========================================================================
          1. TOP HERO SECTION WITH SUBTLE DESTINATION SLIDESHOW (Smooth Fade + Dark Overlay)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
        {/* =========================================================================
            DYNAMIC MOOD-BASED BACKGROUND LAYERS
            1. Upcoming: excited traveler embarking on trip in sunlit terminal
            2. Cancelled: sad/moody traveler beside rainy airport window
            3. Completed: radiant happy celebratory travelers on scenic cliff
            4. TripPoints: golden yellow glowing rewards, gold coins and VIP card
        ========================================================================= */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Upcoming Mood Image: Crystal clear, vibrant & deep colors (no white washout) */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              heroTheme === 'upcoming' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={bgUpcoming}
              alt="Going on a Trip"
              className="w-full h-full object-cover object-center contrast-105 saturate-115"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Cancelled Mood Image: Crisp, clear & moody rainy airport scene */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              heroTheme === 'cancelled' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={bgCancelled}
              alt="Cancelled Trip Sad Mood"
              className="w-full h-full object-cover object-center contrast-105 saturate-110"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Completed Mood Image: Deep turquoise ocean & sunny tropical cliffs */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              heroTheme === 'completed' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={bgCompleted}
              alt="Completed Happy Memories"
              className="w-full h-full object-cover object-center contrast-105 saturate-120"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* TripPoints Mood Image: Rich golden yellow VIP rewards & cards */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              heroTheme === 'trippoints' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={bgTripPoints}
              alt="TripPoints Golden Rewards"
              className="w-full h-full object-cover object-center contrast-110 saturate-125"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Top subtle dark vignette for navbar/logo readability */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/70 to-transparent pointer-events-none" />

          {/* Soft Bottom Feather / Dissolve to Page Background: Smoothly fades into the light background without any harsh straight cut line */}
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/70 to-transparent pointer-events-none" />
        </div>

        {/* Slideshow Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-10 space-y-6">
          {/* Top Breadcrumb & User Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <nav className="flex items-center gap-1.5 text-slate-300 font-medium">
              <button
                type="button"
                onClick={onNavigateToProfile}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                My Account
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-cyan-400 font-bold">My Trips</span>
            </nav>

            {/* Demo Mode Switch */}
            <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-700/80 px-3 py-1 rounded-full text-xs backdrop-blur-md">
              <span className="text-[11px] font-semibold text-slate-200">Sample Demo:</span>
              <button
                type="button"
                onClick={() => handleToggleDemoMode(!demoMode)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  demoMode
                    ? 'bg-cyan-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {demoMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Main Title */}
          <div className="pt-1">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
              My Trips
            </h1>
          </div>

          {/* Search by Booking Option - Positioned lower down, just above the Upcoming Trips block */}
          <div className="flex justify-start sm:justify-end pt-3 pb-1">
            <div className="w-full sm:w-96">
              <div className="relative">
                <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none drop-shadow-xs" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Booking ID (e.g. TY-8841)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/40 text-white placeholder-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-300/80 focus:border-white transition-all shadow-md drop-shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MAIN CONTENT AREA (Clean White / Light Slate Background)
      ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        {/* DEMO NOTICE BANNER (when Demo Mode is active) */}
        {demoMode && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-cyan-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping shrink-0" />
              <div className="text-slate-800">
                <strong className="text-blue-900 font-bold">Sample Demo Mode is active: </strong>
                Sample bookings are loaded across Upcoming, Cancelled & Completed for full demonstration.
                Demo cards are labeled with a <span className="bg-cyan-100 text-cyan-800 font-mono-tabular font-bold px-1.5 py-0.5 rounded text-[10px]">DEMO</span> tag so they cannot be confused with real bookings.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleDemoMode(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer transition-colors"
              >
                Hide Sample Demo Data
              </button>
            </div>
          </div>
        )}

        {/* 3 CORE TABS (Upcoming, Cancelled, Completed) with Blue/Cyan Underline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-2 border-b sm:border-b-0 border-slate-100 pb-1 sm:pb-0 w-full sm:w-auto">
            {/* Upcoming Tab */}
            <button
              type="button"
              onClick={() => handleTabChange('upcoming')}
              className={`relative px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className={`w-4 h-4 ${activeTab === 'upcoming' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Upcoming Trips</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono-tabular font-bold ${
                  activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts.upcoming}
              </span>
            </button>

            {/* Cancelled Tab */}
            <button
              type="button"
              onClick={() => handleTabChange('cancelled')}
              className={`relative px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'cancelled'
                  ? 'text-rose-600 bg-rose-50/70 border-b-2 border-rose-600 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <XCircle className={`w-4 h-4 ${activeTab === 'cancelled' ? 'text-rose-600' : 'text-slate-400'}`} />
              <span>Cancelled Trips</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono-tabular font-bold ${
                  activeTab === 'cancelled' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts.cancelled}
              </span>
            </button>

            {/* Completed Tab */}
            <button
              type="button"
              onClick={() => handleTabChange('completed')}
              className={`relative px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'completed' && heroTheme !== 'trippoints'
                  ? 'text-emerald-600 bg-emerald-50/70 border-b-2 border-emerald-600 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${activeTab === 'completed' && heroTheme !== 'trippoints' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Completed Trips</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono-tabular font-bold ${
                  activeTab === 'completed' && heroTheme !== 'trippoints' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts.completed}
              </span>
            </button>

            {/* TripPoints Yellow Vault Button (Placed right after Completed Trips) */}
            <button
              type="button"
              onClick={handleSelectPointsTheme}
              className={`relative px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                heroTheme === 'trippoints'
                  ? 'text-amber-800 bg-amber-100 border-b-2 border-amber-500 font-extrabold shadow-2xs'
                  : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>TripPoints Vault</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-tabular font-bold bg-amber-400 text-slate-950">
                2,705
              </span>
            </button>
          </div>

          {/* Quick Header CTA buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() =>
                onNotify(
                  'Consolidated Invoices Ready',
                  'Download zip package containing all GST tax invoices and payment vouchers.',
                  'info'
                )
              }
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>All Invoices</span>
            </button>

            <button
              type="button"
              onClick={onBookNewTrip}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Book New Trip</span>
            </button>
          </div>
        </div>

        {/* FILTER BAR & SORT CONTROLS */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 mr-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>

            {[
              { id: 'all', label: 'All Categories' },
              { id: 'flights', label: 'Flights' },
              { id: 'hotels', label: 'Hotels' },
              { id: 'trains', label: 'Trains' },
              { id: 'holidays', label: 'Holidays' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="date-asc">Nearest Travel Date</option>
              <option value="date-desc">Latest Travel Date</option>
              <option value="booked-desc">Recently Booked</option>
              <option value="price-desc">Total Paid: High to Low</option>
              <option value="price-asc">Total Paid: Low to High</option>
            </select>
          </div>
        </div>

        {/* LOADING SKELETON (Simulated for smooth transition) */}
        {isFiltering ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 animate-pulse space-y-4 shadow-2xs"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-48 bg-slate-200 rounded-lg" />
                  <div className="h-5 w-24 bg-slate-200 rounded-lg" />
                </div>
                <div className="h-10 w-3/4 bg-slate-200 rounded-xl" />
                <div className="h-16 w-full bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          /* =========================================================================
              EMPTY STATE FOR CURRENT TAB & SEARCH FILTER
          ========================================================================= */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-sm space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
              {activeTab === 'upcoming' && <Clock className="w-10 h-10 text-blue-500" />}
              {activeTab === 'cancelled' && <CheckCircle2 className="w-10 h-10 text-emerald-500" />}
              {activeTab === 'completed' && <Palmtree className="w-10 h-10 text-cyan-500" />}
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {searchQuery
                  ? `No bookings match "${searchQuery}"`
                  : activeTab === 'upcoming'
                  ? 'No Upcoming Trips Scheduled'
                  : activeTab === 'cancelled'
                  ? 'No Cancelled Bookings'
                  : 'No Completed Trips Yet'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {searchQuery
                  ? 'Try searching with a different booking ID, city name, or clear your search filters.'
                  : activeTab === 'upcoming'
                  ? 'Ready for your next adventure? Explore trending flights, luxury beach resorts, and curated holiday getaways.'
                  : activeTab === 'cancelled'
                  ? 'You have zero cancelled bookings. All your travel arrangements are confirmed and on schedule!'
                  : 'Your past holiday memories will appear here once you complete your journeys.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear Search Filter
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToSearch) onNavigateToSearch('flights');
                      else onBookNewTrip();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm cursor-pointer transition-colors"
                  >
                    Search Flights
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToSearch) onNavigateToSearch('hotels');
                      else onBookNewTrip();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 shadow-sm cursor-pointer transition-colors"
                  >
                    Explore Hotels
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToSearch) onNavigateToSearch('holidays');
                      else onBookNewTrip();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Holiday Packages
                  </button>
                </>
              )}

              {!demoMode && (
                <button
                  type="button"
                  onClick={() => handleToggleDemoMode(true)}
                  className="px-4 py-2.5 rounded-xl border border-cyan-300 bg-cyan-50 text-cyan-800 text-xs font-bold hover:bg-cyan-100 transition-colors cursor-pointer"
                >
                  ✨ Load Sample Demo Bookings
                </button>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
              3. BOOKINGS LIST (Rendered by Active Tab)
          ========================================================================= */
          <div className="space-y-5">
            {filteredTrips.slice(0, visibleCount).map((trip) => {
              const countdown = getTripCountdown(trip);

              return (
                <article
                  key={trip.bookingId}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Status & Top Bar */}
                  <div
                    className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
                      trip.status === 'Confirmed'
                        ? 'bg-blue-50/60 border-blue-100'
                        : trip.status === 'Cancelled'
                        ? 'bg-rose-50/70 border-rose-100'
                        : 'bg-emerald-50/60 border-emerald-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Status Badge */}
                      {trip.status === 'Confirmed' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-2xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Upcoming Confirmed</span>
                        </span>
                      )}

                      {trip.status === 'Cancelled' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-2xs">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelled</span>
                        </span>
                      )}

                      {trip.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed Journey</span>
                        </span>
                      )}

                      {/* Demo indicator if applicable */}
                      {trip.isDemo && (
                        <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          Demo Sample
                        </span>
                      )}

                      {/* Live Countdown for Upcoming */}
                      {countdown && (
                        <span className="bg-white text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                          ⚡ {countdown}
                        </span>
                      )}

                      {/* Cancellation Date for Cancelled */}
                      {trip.status === 'Cancelled' && trip.cancellationDate && (
                        <span className="text-rose-700 bg-white border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                          Cancelled on {trip.cancellationDate}
                        </span>
                      )}
                    </div>

                    {/* Booking ID with One-Click Copy */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Booking ID:</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyBookingId(trip.bookingId, e)}
                        className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 cursor-pointer transition-colors"
                        title="Click to copy Booking ID"
                      >
                        <span>{trip.bookingId}</span>
                        {copiedBookingId === trip.bookingId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Main Card Body */}
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Top Details Header */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative">
                          <SafeImage
                            src={trip.destinationImage || ASSETS.bali}
                            alt={trip.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-md shadow-2xs">
                            {getCategoryIcon(trip.category)}
                          </div>
                        </div>

                        {/* Title & Route */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                              {getCategoryLabel(trip.category)}
                            </span>
                            {trip.destinationCity && (
                              <>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{trip.destinationCity}</span>
                                </span>
                              </>
                            )}
                          </div>

                          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                            {trip.title}
                          </h2>

                          <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 font-medium">
                            <span>{trip.routeSummary}</span>
                            <span>·</span>
                            <span>{trip.dateSummary}</span>
                          </p>

                          <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{trip.travellers} {trip.travellers === 1 ? 'Traveller' : 'Travellers'}</span>
                            </span>
                            <span>·</span>
                            <span>{trip.cabinOrRoom}</span>
                            {trip.pnr && (
                              <>
                                <span>·</span>
                                <span>PNR: <strong className="text-slate-700">{trip.pnr}</strong></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Amount & Payment Status */}
                      <div className="sm:text-right shrink-0">
                        <span className="text-[11px] text-slate-500 block">
                          {trip.status === 'Cancelled' ? 'Refunded Amount' : 'Total Amount Paid'}
                        </span>
                        <div className="font-display text-2xl font-bold font-mono-tabular text-slate-900 mt-0.5">
                          {formatPrice(
                            trip.status === 'Cancelled' && trip.refundAmountInr
                              ? trip.refundAmountInr
                              : trip.totalPaidInr,
                            currency
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {trip.status === 'Cancelled'
                            ? `Status: ${trip.refundStatus || 'Refund Processed'}`
                            : `Paid via ${trip.paymentMode || 'Secure Payment'}`}
                        </span>
                      </div>
                    </div>

                    {/* CONTEXTUAL BLOCK PER TAB */}
                    {/* TAB 1: UPCOMING - Itinerary Snippet, Timings & Actions */}
                    {trip.status === 'Confirmed' && (
                      <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          {trip.flightDepTime ? (
                            <>
                              <div>
                                <span className="text-[11px] text-slate-500 block">Departure</span>
                                <strong className="text-slate-900 font-mono-tabular text-sm">
                                  {trip.flightDepTime}
                                </strong>
                              </div>
                              <div className="text-center sm:text-left">
                                <span className="text-[11px] text-slate-500 block">Duration / Flight</span>
                                <span className="text-blue-600 font-semibold">
                                  {trip.flightCode || trip.flightDuration || 'Non-stop Service'}
                                </span>
                              </div>
                              <div className="sm:text-right">
                                <span className="text-[11px] text-slate-500 block">Arrival</span>
                                <strong className="text-slate-900 font-mono-tabular text-sm">
                                  {trip.flightArrTime || 'On Schedule'}
                                </strong>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-[11px] text-slate-500 block">Check-in</span>
                                <strong className="text-slate-900 text-sm">
                                  {trip.hotelCheckInTime || '02:00 PM'}
                                </strong>
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-500 block">Property</span>
                                <span className="text-cyan-600 font-semibold truncate block">
                                  {trip.carrierOrHotel || trip.title}
                                </span>
                              </div>
                              <div className="sm:text-right">
                                <span className="text-[11px] text-slate-500 block">Check-out</span>
                                <strong className="text-slate-900 text-sm">
                                  {trip.hotelCheckOutTime || '11:00 AM'}
                                </strong>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Guest / Seat Roster Snippet */}
                        {trip.passengers && trip.passengers.length > 0 && (
                          <div className="pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-800">Guests:</span>
                              {trip.passengers.map((p, idx) => (
                                <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200">
                                  {p.name} {p.seatOrBerth ? `(${p.seatOrBerth})` : ''}
                                </span>
                              ))}
                            </div>
                            {trip.hasInsurance && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                <span>TripProtect 360° Insured</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: CANCELLED - Cancellation & Refund Details */}
                    {trip.status === 'Cancelled' && (
                      <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-rose-900 font-bold">Cancellation Reason:</strong>
                              <span className="text-slate-700">{trip.cancellationReason || 'Requested by traveller'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <span>Refund Status:</span>
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                                ✓ {trip.refundStatus || 'Refund Processed (100%)'}
                              </span>
                              {trip.refundId && (
                                <span className="font-mono-tabular text-slate-500">
                                  ARN: {trip.refundId}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onNotify(
                                'Cancellation Receipt Downloaded',
                                `Receipt for ${trip.bookingId} downloaded with refund reference ${trip.refundId || 'REF-88410'}.`,
                                'info'
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold cursor-pointer transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Refund Receipt</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: COMPLETED - Journey Summary & Rating */}
                    {trip.status === 'Completed' && (
                      <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold">
                            <BadgeCheck className="w-4 h-4 text-emerald-600" />
                            <span>Journey Successfully Completed</span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Earned +250 TripPoints pool reward for this completed reservation.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReviewTrip(trip);
                              setShowReviewModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                            <span>Rate & Review</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onNotify(
                                'GST Tax Invoice Downloaded',
                                `Tax invoice for booking ${trip.bookingId} saved.`,
                                'info'
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>GST Invoice</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ACTION BUTTONS ROW */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {/* Primary View & Manage Booking Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedTripForManage(trip)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Manage Booking</span>
                        </button>

                        {/* Download Ticket / Voucher */}
                        {trip.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => onOpenCredentialModal('boarding-pass')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5 text-blue-600" />
                            <span>E-Ticket & Pass</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Completed: Book Again */}
                        {trip.status === 'Completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onNavigateToSearch) {
                                onNavigateToSearch(trip.category, trip.destinationCity);
                              } else {
                                onBookNewTrip();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Book Again</span>
                          </button>
                        )}

                        {/* Upcoming: Cancel Trip Action */}
                        {trip.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTripForManage(trip);
                              setShowCancelModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {/* Share Itinerary */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            onNotify('Itinerary Link Copied', `Sharable booking link for ${trip.bookingId} copied.`);
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer transition-colors"
                          title="Share Itinerary"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* LOAD MORE / PAGINATION */}
            {filteredTrips.length > visibleCount && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  <span>Load More Bookings ({filteredTrips.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          4. "VIEW & MANAGE BOOKING" COMPREHENSIVE MODAL (Requirement 8)
      ========================================================================= */}
      {selectedTripForManage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedTripForManage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                    TripYeah Itinerary Management
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedTripForManage.status === 'Confirmed'
                        ? 'bg-blue-600 text-white'
                        : selectedTripForManage.status === 'Cancelled'
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {selectedTripForManage.status}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mt-0.5">
                  {selectedTripForManage.title}
                </h3>
                <p className="text-xs text-slate-300">
                  Booking ID: <strong className="text-cyan-300 font-mono-tabular">{selectedTripForManage.bookingId}</strong>
                  {selectedTripForManage.pnr && ` · PNR: ${selectedTripForManage.pnr}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTripForManage(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
              {/* Route & Schedule Timeline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Schedule & Journey Timeline</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ROUTE</span>
                    <strong className="text-slate-900 font-semibold">{selectedTripForManage.routeSummary}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DATES</span>
                    <strong className="text-slate-900 font-semibold">{selectedTripForManage.dateSummary}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">BOOKED ON</span>
                    <span className="text-slate-700">{selectedTripForManage.bookedAt || 'Confirmed'}</span>
                  </div>
                </div>
              </div>

              {/* Passenger / Guest Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Traveller & Seat Roster ({selectedTripForManage.travellers} Guests)</span>
                </h4>

                <div className="space-y-2">
                  {(selectedTripForManage.passengers || [
                    { name: 'Rahul Sharma (Lead Passenger)', age: 31, gender: 'Male', seatOrBerth: selectedTripForManage.cabinOrRoom },
                  ]).map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-slate-900 block">{p.name}</strong>
                          <span className="text-slate-400 text-[10px]">
                            {p.gender ? `${p.gender} · ` : ''}Adult Passenger
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Seat / Berth / Room</span>
                        <strong className="text-slate-800 font-mono-tabular">
                          {p.seatOrBerth || selectedTripForManage.cabinOrRoom}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Invoice Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Payment Summary</span>
                </h4>

                <div className="space-y-1.5 pt-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Fare & Tariffs</span>
                    <span className="font-mono-tabular text-slate-900 font-semibold">
                      {formatPrice(Math.round(selectedTripForManage.totalPaidInr * 0.82), currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applicable Taxes & GST (18%)</span>
                    <span className="font-mono-tabular text-slate-900 font-semibold">
                      {formatPrice(Math.round(selectedTripForManage.totalPaidInr * 0.18), currency)}
                    </span>
                  </div>
                  {selectedTripForManage.hasInsurance && (
                    <div className="flex justify-between text-indigo-700">
                      <span>TripProtect 360° Comprehensive Cover</span>
                      <span className="font-semibold">Included</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Total Amount Paid</span>
                    <span className="font-mono-tabular text-blue-600">
                      {formatPrice(selectedTripForManage.totalPaidInr, currency)}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>Payment Method: <strong>{selectedTripForManage.paymentMode || 'UPI / Card'}</strong></span>
                  <button
                    type="button"
                    onClick={() =>
                      onNotify(
                        'Tax Invoice Downloaded',
                        `Official GST Tax Invoice for ${selectedTripForManage.bookingId} downloaded.`,
                        'info'
                      )
                    }
                    className="text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Download GST Tax Invoice (PDF)
                  </button>
                </div>
              </div>

              {/* Cancellation Policy & Management Actions */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>TripYeah 100% Free Cancellation Guarantee</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Full 100% refund is available up to 24 hours prior to departure date. Refunds are processed immediately to the source payment method.
                </p>

                {selectedTripForManage.status === 'Confirmed' && (
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Booking & Refund</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRescheduleModal(true)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Reschedule Travel Date</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 24x7 Support & Help Options */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Need Help With This Itinerary?</strong>
                    <span className="text-slate-500 text-[11px]">24x7 TripYeah Priority Helpline: 1800-202-9900</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onNotify(
                      'Live Concierge Connected',
                      'TripYeah Priority Concierge assigned. You will receive an SMS and WhatsApp callback.',
                      'info'
                    )
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-blue-300 text-blue-700 font-bold hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  Contact Concierge
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Itinerary</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTripForManage(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. CANCEL BOOKING CONFIRMATION MODAL
      ========================================================================= */}
      {showCancelModal && selectedTripForManage && (
        <div
          className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-rose-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Cancel Booking {selectedTripForManage.bookingId}?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to cancel this reservation?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Estimated Refund Amount:</span>
                <span className="font-mono-tabular text-emerald-700 text-sm">
                  {formatPrice(selectedTripForManage.totalPaidInr, currency)} (100%)
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Zero cancellation penalty applied. Full refund will be credited back to your original payment mode within 24 hours.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 block">
                Please select reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Change in travel plans">Change in travel plans</option>
                <option value="Found a better price or route">Found a better price or route</option>
                <option value="Personal / Medical emergency">Personal / Medical emergency</option>
                <option value="Booking date mistake">Booking date mistake</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
              >
                No, Keep Booking
              </button>

              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer transition-colors"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. RESCHEDULE MODAL
      ========================================================================= */}
      {showRescheduleModal && selectedTripForManage && (
        <div
          className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowRescheduleModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Reschedule Journey Date
                </h3>
                <p className="text-xs text-slate-500">
                  Select a new departure date for {selectedTripForManage.title}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 block">
                Choose New Travel Date:
              </label>
              <input
                type="date"
                min="2026-10-18"
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-900 text-[11px] leading-relaxed">
              <strong>Zero Reschedule Fee:</strong> As a verified TripYeah member, your first date modification on this booking carries zero airline/hotel amendment charges.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer transition-colors"
              >
                Confirm New Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. RATE & REVIEW STAY MODAL
      ========================================================================= */}
      {showReviewModal && reviewTrip && (
        <div
          className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-amber-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Rate Your Experience
              </h3>
              <p className="text-xs text-slate-500">
                How was your trip for <strong>{reviewTrip.title}</strong>?
              </p>
            </div>

            {/* 5-Star Rating Buttons */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-115"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewRating
                        ? 'text-amber-500 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Quick Feedback Tags */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 block text-[11px]">
                What stood out?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['On-time Departure', 'Clean Seats', 'Great Hospitality', 'Comfortable Room', 'Delicious Breakfast'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setReviewTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      reviewTags.includes(tag)
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Written Review */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700 block text-[11px]">
                Detailed Review (Optional):
              </label>
              <textarea
                rows={3}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="Share advice or tips for fellow travelers..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={handleSubmitReview}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm cursor-pointer transition-colors"
              >
                Submit Review (+200 pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. TRIPPOINTS GOLDEN REWARDS VAULT MODAL (Triggered by TripPoints Card)
      ========================================================================= */}
      {showPointsModal && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowPointsModal(false)}
        >
          <div
            className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-amber-400/40 text-white relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Yellow/Gold Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                      VIP Loyalty Rewards
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      Platinum Tier
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mt-0.5">
                    TripPoints Vault
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPointsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Golden Balance Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg relative z-10">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span>AVAILABLE TRIPPOINTS POOL</span>
                <span>1 Pt = ₹1.00</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl font-extrabold font-mono-tabular">
                  2,705
                </span>
                <span className="text-sm font-bold text-amber-950">
                  (Direct Cash Value: ₹2,705)
                </span>
              </div>
              <p className="text-[11px] text-amber-950/80 mt-1 font-medium">
                Earn 2x points on flights & 3x points on luxury hotels. Points never expire.
              </p>
            </div>

            {/* Instant Redemption Catalog */}
            <div className="space-y-2.5 relative z-10 text-xs">
              <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider">
                Redeem Rewards Instantly:
              </h4>

              <div className="space-y-2">
                {[
                  { title: 'Airport Lounge Pass (Complimentary)', cost: '500 Points', desc: 'Access 45+ domestic & international airport lounges with free buffet & Wi-Fi' },
                  { title: 'Airline Extra Legroom Seat Upgrade', cost: '800 Points', desc: 'Lock Row 1 or Emergency Exit seats with priority boarding on IndiGo / Air India' },
                  { title: 'Flat ₹1,000 Off Next Holiday / Flight', cost: '1,000 Points', desc: 'Applied directly as cash deduction at checkout on any booking' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-400/40 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <strong className="text-white block font-semibold">{item.title}</strong>
                      <span className="text-slate-400 text-[11px]">{item.desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onNotify(
                          'Reward Voucher Unlocked!',
                          `Redeemed ${item.cost} for "${item.title}". Voucher sent to your registered email.`,
                          'success'
                        );
                        setShowPointsModal(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 cursor-pointer text-xs"
                    >
                      {item.cost}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between gap-3 relative z-10">
              <span className="text-[11px] text-slate-400">
                Yellow Theme is currently active on your My Trips hero.
              </span>
              <button
                type="button"
                onClick={() => setShowPointsModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer text-xs"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
