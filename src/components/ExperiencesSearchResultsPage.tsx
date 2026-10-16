import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Ticket,
  Users,
  RotateCcw,
  ArrowRight,
  Info,
  BadgePercent,
  AlertCircle,
  ExternalLink,
  QrCode,
  Share2,
} from 'lucide-react';
import {
  BookingCategory,
  CityOption,
  CurrencyCode,
  formatPrice,
  EXPERIENCES_DATA,
  ExperienceItem,
  TicketTier,
  CITIES,
} from '../data/travelData';
import { SafeImage } from './SafeImage';

// Slideshow images showcasing varied waterparks, theme parks, rollercoasters & activities
const SLIDESHOW_ITEMS = [
  {
    id: 'slide-aquaventure',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80',
    title: 'Atlantis Aquaventure & The Palm',
    tag: '🌊 105+ Record-Breaking Waterslides & Wave Lagoons',
    location: 'Dubai, UAE',
  },
  {
    id: 'slide-ferrari',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=2000&q=80',
    title: 'Ferrari World Yas Island Coasters',
    tag: '🎢 Formula Rossa 240 km/h High-Speed Thrill Rides',
    location: 'Abu Dhabi / Dubai',
  },
  {
    id: 'slide-waterbom',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    title: 'Waterbom Tropical Eco-Waterpark',
    tag: '🌴 Asia’s #1 Ranked Waterpark in Kuta Gardens',
    location: 'Bali, Indonesia',
  },
  {
    id: 'slide-safari',
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=2000&q=80',
    title: 'Red Dunes Desert Safari & Quad Biking',
    tag: '🪂 4x4 Dune Bashing, Camel Rides & Sunset Camp BBQ',
    location: 'Lahbab Desert, Dubai',
  },
  {
    id: 'slide-disney',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80',
    title: 'Disneyland Paris & Avengers Campus',
    tag: '✨ Fairy Tale Castles, Marvel Rides & Night Fireworks',
    location: 'Paris, France',
  },
  {
    id: 'slide-scuba',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
    title: 'Grand Island Coral Scuba Diving',
    tag: '🤿 Under-Water Video, Snorkeling & Dolphin Sightseeing',
    location: 'Goa, India',
  },
];

interface ExperiencesSearchResultsPageProps {
  destinationCity: CityOption;
  selectedDate: string;
  currency: CurrencyCode;
  onChangeDestination: (city: CityOption) => void;
  onChangeDate: (date: string) => void;
  onModifySearch: () => void;
  onSelectExperienceForCheckout: (bookingSummary: {
    title: string;
    code: string;
    depTime: string;
    arrTime: string;
    duration: string;
    priceInr: number;
    category: BookingCategory;
  }) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
}

export const ExperiencesSearchResultsPage: React.FC<ExperiencesSearchResultsPageProps> = ({
  destinationCity,
  selectedDate,
  currency,
  onChangeDestination,
  onChangeDate,
  onModifySearch,
  onSelectExperienceForCheckout,
  onNotify,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>(
    destinationCity?.city || 'all'
  );
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [selectedDurationFilter, setSelectedDurationFilter] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [skipTheLineOnly, setSkipTheLineOnly] = useState<boolean>(false);
  const [instantConfirmationOnly, setInstantConfirmationOnly] = useState<boolean>(false);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState<boolean>(false);
  const [hotelPickupOnly, setHotelPickupOnly] = useState<boolean>(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'reviews'>('recommended');

  // Mobile Filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Background visual slideshow state
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Auto-cycle through waterparks & activity slides every 4.5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDESHOW_ITEMS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Quick Book Modal / Drawer State
  const [bookingExperience, setBookingExperience] = useState<ExperienceItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [ticketDate, setTicketDate] = useState<string>(selectedDate || '2026-10-24');
  const [adultCount, setAdultCount] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(0);

  // Detailed Info Modal State
  const [detailExperience, setDetailExperience] = useState<ExperienceItem | null>(null);

  // Instant E-Ticket Preview Modal
  const [voucherModal, setVoucherModal] = useState<{
    experience: ExperienceItem;
    tier: TicketTier;
    adults: number;
    children: number;
    date: string;
    timeSlot: string;
    totalInr: number;
    bookingRef: string;
  } | null>(null);

  // Keep destination city filter synchronized if prop changes
  React.useEffect(() => {
    if (destinationCity?.city) {
      // If the destination has matching experiences, set city filter
      const hasMatch = EXPERIENCES_DATA.some(
        (e) => e.city.toLowerCase() === destinationCity.city.toLowerCase()
      );
      if (hasMatch) {
        setSelectedCityFilter(destinationCity.city);
      } else {
        setSelectedCityFilter('all');
      }
    }
  }, [destinationCity]);

  // Available unique cities in experiences dataset
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    EXPERIENCES_DATA.forEach((e) => set.add(e.city));
    return Array.from(set);
  }, []);

  // Filtered and Sorted Experiences List
  const filteredExperiences = useMemo(() => {
    let list = EXPERIENCES_DATA.filter((exp) => {
      // 1. Text Search query (title, city, category, highlights, inclusions)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = exp.title.toLowerCase().includes(q);
        const matchesCity = exp.city.toLowerCase().includes(q) || exp.country.toLowerCase().includes(q);
        const matchesInclusions = exp.inclusions.some((inc) => inc.toLowerCase().includes(q));
        const matchesOverview = exp.overview.toLowerCase().includes(q);
        const matchesCategory = exp.categoryLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCity && !matchesInclusions && !matchesOverview && !matchesCategory) {
          return false;
        }
      }

      // 2. City Filter
      if (selectedCityFilter !== 'all') {
        if (exp.city.toLowerCase() !== selectedCityFilter.toLowerCase()) {
          return false;
        }
      }

      // 3. Category Tab Filter
      if (selectedCategoryTab !== 'all') {
        if (selectedCategoryTab === 'theme-parks' && exp.category !== 'theme-park') return false;
        if (selectedCategoryTab === 'water-parks' && exp.category !== 'water-park') return false;
        if (selectedCategoryTab === 'adventure' && exp.category !== 'adventure') return false;
        if (selectedCategoryTab === 'landmarks' && exp.category !== 'landmark') return false;
        if (selectedCategoryTab === 'culture' && exp.category !== 'culture') return false;
      }

      // 4. Max Price Slider
      if (exp.startingPriceInr > maxPrice) return false;

      // 5. Min Rating
      if (minRating > 0 && exp.rating < minRating) return false;

      // 6. Duration Filter
      if (selectedDurationFilter !== 'all') {
        if (selectedDurationFilter === 'short' && !exp.duration.includes('Hour') && !exp.duration.includes('2 - 3') && !exp.duration.includes('3 - 4')) return false;
        if (selectedDurationFilter === 'half' && !exp.duration.includes('4 - 5') && !exp.duration.includes('6 - 7') && !exp.duration.includes('6h')) return false;
        if (selectedDurationFilter === 'full' && !exp.duration.includes('Full Day') && !exp.duration.includes('8h') && !exp.duration.includes('9h') && !exp.duration.includes('10h')) return false;
      }

      // 7. Feature badges
      if (skipTheLineOnly && !exp.badges.some((b) => b.toLowerCase().includes('skip'))) return false;
      if (instantConfirmationOnly && !exp.badges.some((b) => b.toLowerCase().includes('instant'))) return false;
      if (freeCancellationOnly && !exp.cancellationPolicy.toLowerCase().includes('free')) return false;
      if (hotelPickupOnly && !exp.inclusions.some((i) => i.toLowerCase().includes('pickup') || i.toLowerCase().includes('transfer'))) return false;

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.startingPriceInr - b.startingPriceInr;
      if (sortBy === 'price-desc') return b.startingPriceInr - a.startingPriceInr;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return b.reviewCount * b.rating - a.reviewCount * a.rating; // recommended default
    });
  }, [
    searchQuery,
    selectedCategoryTab,
    selectedCityFilter,
    maxPrice,
    minRating,
    selectedDurationFilter,
    skipTheLineOnly,
    instantConfirmationOnly,
    freeCancellationOnly,
    hotelPickupOnly,
    sortBy,
  ]);

  const handleOpenBooking = (exp: ExperienceItem) => {
    setBookingExperience(exp);
    setSelectedTier(exp.ticketTiers[0] || null);
    setSelectedTimeSlot(exp.timeSlots[0] || '10:00 AM');
    setTicketDate(selectedDate || '2026-10-24');
    setAdultCount(2);
    setChildCount(0);
  };

  const calculateBookingTotal = () => {
    if (!selectedTier) return 0;
    const adultFare = selectedTier.priceInr * adultCount;
    const childFare = Math.round(selectedTier.priceInr * 0.75) * childCount; // 25% discount for children
    return adultFare + childFare;
  };

  const handleConfirmToCheckout = () => {
    if (!bookingExperience || !selectedTier) return;
    const totalFare = calculateBookingTotal();
    const guestLabel = `${adultCount} Adult${adultCount > 1 ? 's' : ''}${childCount > 0 ? `, ${childCount} Child` : ''}`;

    onSelectExperienceForCheckout({
      title: `${bookingExperience.title} (${selectedTier.name})`,
      code: bookingExperience.id,
      depTime: `${ticketDate} @ ${selectedTimeSlot}`,
      arrTime: `${bookingExperience.duration} (${bookingExperience.city})`,
      duration: `${bookingExperience.duration} · ${guestLabel}`,
      priceInr: totalFare,
      category: 'experiences',
    });

    onNotify(
      `Tickets Added: ${bookingExperience.title}`,
      `${guestLabel} on ${ticketDate} (${selectedTimeSlot}). Total: ${formatPrice(totalFare, currency)}.`,
      'success'
    );

    setBookingExperience(null);
  };

  const handleGenerateInstantVoucher = () => {
    if (!bookingExperience || !selectedTier) return;
    const totalFare = calculateBookingTotal();
    const randomRef = `TY-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    setVoucherModal({
      experience: bookingExperience,
      tier: selectedTier,
      adults: adultCount,
      children: childCount,
      date: ticketDate,
      timeSlot: selectedTimeSlot,
      totalInr: totalFare,
      bookingRef: randomRef,
    });

    setBookingExperience(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryTab('all');
    setSelectedCityFilter('all');
    setMaxPrice(12000);
    setSelectedDurationFilter('all');
    setMinRating(0);
    setSkipTheLineOnly(false);
    setInstantConfirmationOnly(false);
    setFreeCancellationOnly(false);
    setHotelPickupOnly(false);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800 antialiased relative">
      {/* Visual Dynamic Background Slideshow across Waterparks, Rollercoasters & Tours */}
      <div className="relative w-full pt-8 pb-24 sm:pb-28 overflow-hidden">
        {/* Slideshow Image Layers */}
        <div className="absolute inset-0 z-0">
          {SLIDESHOW_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Transparent-friendly scrim: subtle dark top gradient so waterparks & coasters background remains vividly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Gentle white fade at bottom: soft gradient dissolve into the page background */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#F8FAFC]/60 to-[#F8FAFC] pointer-events-none" />
        </div>

        {/* Hero Content (Breadcrumb, Title, Destination Modifier & Category Tabs) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold mb-2 drop-shadow-md">
                <span>TripYeah Experiences</span>
                <span>/</span>
                <span className="text-white">Theme Parks, Activities & Attractions</span>
                {selectedCityFilter !== 'all' && (
                  <>
                    <span>/</span>
                    <span className="text-amber-300 font-extrabold">{selectedCityFilter}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white flex items-center gap-3 drop-shadow-lg">
                <Compass className="w-8 h-8 text-amber-400 shrink-0 drop-shadow-md" />
                <span>Tours, Theme Parks & Activities</span>
              </h1>
            </div>

            {/* Quick Search & Modify Strip */}
            <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-lg">
              {/* Destination Pill */}
              <div className="relative">
                <select
                  value={selectedCityFilter}
                  onChange={(e) => {
                    const city = e.target.value;
                    setSelectedCityFilter(city);
                    const matched = CITIES.find((c) => c.city.toLowerCase() === city.toLowerCase());
                    if (matched) onChangeDestination(matched);
                  }}
                  className="bg-slate-900/90 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/20 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">🌍 All Destinations (Worldwide)</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      📍 {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                <Calendar className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <input
                  type="date"
                  value={selectedDate || '2026-10-24'}
                  onChange={(e) => onChangeDate(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-hidden cursor-pointer"
                />
              </div>

              {/* Modify Search Action */}
              <button
                type="button"
                onClick={onModifySearch}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Modify Search
              </button>
            </div>
          </div>

          {/* Quick Category Tabs Bar */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: '🌟 All Experiences', count: EXPERIENCES_DATA.length },
              {
                id: 'theme-parks',
                label: '🎢 Theme Parks',
                count: EXPERIENCES_DATA.filter((e) => e.category === 'theme-park').length,
              },
              {
                id: 'water-parks',
                label: '🌊 Water Parks',
                count: EXPERIENCES_DATA.filter((e) => e.category === 'water-park').length,
              },
              {
                id: 'adventure',
                label: '🪂 Adventure & Safaris',
                count: EXPERIENCES_DATA.filter((e) => e.category === 'adventure').length,
              },
              {
                id: 'landmarks',
                label: '🏛️ Iconic Landmarks',
                count: EXPERIENCES_DATA.filter((e) => e.category === 'landmark').length,
              },
              {
                id: 'culture',
                label: '🎨 Museum & Culture',
                count: EXPERIENCES_DATA.filter((e) => e.category === 'culture').length,
              },
            ].map((tab) => {
              const active = selectedCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategoryTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-white text-indigo-950 shadow-md font-extrabold'
                      : 'bg-slate-950/50 text-white hover:bg-slate-900/75 border border-white/20 backdrop-blur-md shadow-xs'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-indigo-100 text-indigo-900' : 'bg-white/20 text-indigo-100'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Body: Two-Column Layout (Filters Left, Results Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ===================================================================
              LEFT SIDEBAR: FILTERS
          =================================================================== */}
          <aside
            className={`lg:col-span-1 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Search Activities & Parks
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Ferrari, Atlantis, Scuba..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between font-bold text-xs text-slate-800 mb-1.5">
                <span>Max Starting Price</span>
                <span className="text-indigo-600">{formatPrice(maxPrice, currency)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={12000}
                step={250}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>₹1,000</span>
                <span>₹12,000+</span>
              </div>
            </div>

            {/* Duration Filter */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Duration
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'all', label: 'Any Duration' },
                  { id: 'short', label: '2 - 4 Hours' },
                  { id: 'half', label: 'Half Day (4-7h)' },
                  { id: 'full', label: 'Full Day (8h+)' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setSelectedDurationFilter(dur.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-center text-xs font-semibold border transition-all cursor-pointer ${
                      selectedDurationFilter === dur.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Perks & Badges */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Perks & Inclusions
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={skipTheLineOnly}
                  onChange={() => setSkipTheLineOnly(!skipTheLineOnly)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                />
                <span className="font-semibold text-slate-900">Skip-the-Line / FastPass</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={instantConfirmationOnly}
                  onChange={() => setInstantConfirmationOnly(!instantConfirmationOnly)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                />
                <span>Instant E-Ticket Confirmation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={freeCancellationOnly}
                  onChange={() => setFreeCancellationOnly(!freeCancellationOnly)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                />
                <span>Free 24h Cancellation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={hotelPickupOnly}
                  onChange={() => setHotelPickupOnly(!hotelPickupOnly)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                />
                <span>Hotel Pickup & Drop Included</span>
              </label>
            </div>

            {/* Guest Rating Filter */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Guest Review Rating
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { val: 0, label: 'Any Rating' },
                  { val: 4.5, label: '4.5+ Excellent' },
                  { val: 4.8, label: '4.8+ Top Rated' },
                  { val: 4.9, label: '4.9★ Exceptional' },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setMinRating(r.val)}
                    className={`py-1.5 px-2 rounded-lg text-center text-[11px] font-bold border transition-colors cursor-pointer ${
                      minRating === r.val
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Pillar Notice */}
            <div className="pt-3 border-t border-slate-100 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>TripYeah Official Partner</span>
              </div>
              <p className="text-[11px] text-indigo-700 mt-1 leading-snug">
                All theme park & activity tickets are 100% verified official barcoded e-tickets scanned directly at turnstiles.
              </p>
            </div>
          </aside>

          {/* ===================================================================
              RIGHT COLUMN: RESULTS LIST
          =================================================================== */}
          <main className="lg:col-span-3 space-y-4">
            {/* Top Results Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                  {filteredExperiences.length}{' '}
                  {filteredExperiences.length === 1 ? 'Activity & Park Pass' : 'Activities & Park Passes'} Found
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedCityFilter !== 'all' ? `Showing activities in ${selectedCityFilter}` : 'Worldwide curated top experiences'}
                  {selectedDate ? ` · Visit Date: ${selectedDate}` : ''}
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                <span>{showMobileFilters ? 'Hide Filters' : 'Filters'}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="recommended">Recommended & Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated (★)</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredExperiences.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <Compass className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-bold text-lg text-slate-800">
                  No experiences match your selected filters
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your budget slider, clearing search keywords, or selecting "All Destinations" from the top dropdown.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Experiences Cards Grid */
              <div className="space-y-4">
                {filteredExperiences.map((exp) => {
                  const discountPercent = Math.round(
                    ((exp.originalPriceInr - exp.startingPriceInr) / exp.originalPriceInr) * 100
                  );

                  return (
                    <article
                      key={exp.id}
                      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col md:flex-row"
                    >
                      {/* Image Preview with Badges */}
                      <div className="w-full md:w-72 lg:w-80 h-52 md:h-auto relative shrink-0 overflow-hidden bg-slate-100">
                        <SafeImage
                          src={exp.image}
                          alt={exp.title}
                          fallbackTitle={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-xs">
                            {exp.categoryLabel}
                          </span>
                          {exp.badges.slice(0, 2).map((b, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs"
                            >
                              {b}
                            </span>
                          ))}
                        </div>

                        {/* Duration Pill at bottom */}
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-xs font-bold bg-white/95 text-slate-900 shadow-xs flex items-center gap-1 border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{exp.duration}</span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* City, Location & Rating Row */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{exp.city}, {exp.country}</span>
                              </div>
                              <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition-colors leading-snug">
                                {exp.title}
                              </h3>
                            </div>

                            {/* Rating Badge */}
                            <div className="text-right shrink-0">
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xs">
                                <span>{exp.rating}</span>
                                <Star className="w-3 h-3 fill-slate-950" />
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                {exp.reviewCount.toLocaleString()} reviews
                              </div>
                            </div>
                          </div>

                          {/* Address */}
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            📍 {exp.locationAddress}
                          </p>

                          {/* Inclusions Highlights */}
                          <div className="mt-3 space-y-1">
                            {exp.inclusions.slice(0, 3).map((inc, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{inc}</span>
                              </div>
                            ))}
                          </div>

                          {/* Next Time Slots Available */}
                          {exp.timeSlots && exp.timeSlots.length > 0 && (
                            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Available Slots:
                              </span>
                              {exp.timeSlots.slice(0, 3).map((slot, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono"
                                >
                                  {slot}
                                </span>
                              ))}
                              {exp.timeSlots.length > 3 && (
                                <span className="text-[10px] font-bold text-indigo-600">
                                  +{exp.timeSlots.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price & Action Row */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setDetailExperience(exp)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>View Full Highlights & Guidelines</span>
                          </button>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-xs text-slate-400 line-through font-mono">
                                  {formatPrice(exp.originalPriceInr, currency)}
                                </span>
                                {discountPercent > 0 && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                              <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                                {formatPrice(exp.startingPriceInr, currency)}
                                <span className="text-xs font-normal text-slate-500 font-sans"> / ticket</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenBooking(exp)}
                              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:brightness-105 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <Ticket className="w-4 h-4" />
                              <span>Book Tickets</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: INTERACTIVE TICKET BOOKING & TIER SELECTION MODAL
      ===================================================================== */}
      {bookingExperience && selectedTier && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              type="button"
              onClick={() => setBookingExperience(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pr-8">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                {bookingExperience.categoryLabel}
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-1">
                {bookingExperience.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                📍 {bookingExperience.locationAddress}
              </p>
            </div>

            {/* Step 1: Select Ticket Tier */}
            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                1. Select Ticket Category / Pass Option
              </label>
              <div className="space-y-2">
                {bookingExperience.ticketTiers.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {tier.name}
                            </span>
                            {tier.badge && (
                              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full">
                                {tier.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {tier.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-black text-sm sm:text-base text-slate-900 font-mono">
                          {formatPrice(tier.priceInr, currency)}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">per ticket</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Time Slot Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  2. Visit Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={ticketDate}
                    onChange={(e) => setTicketDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Time Slot / Entry Wave
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  {bookingExperience.timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Ticket Quantity Counters */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                3. Number of Attendees & Tickets
              </label>

              {/* Adults Counter */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Adult (Age 12+)</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {formatPrice(selectedTier.priceInr, currency)} each
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm font-mono-tabular">
                    {adultCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdultCount(Math.min(10, adultCount + 1))}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Counter (with 25% discount) */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Child (Age 3 - 11)</div>
                  <div className="text-[11px] text-emerald-600 font-mono font-semibold">
                    {formatPrice(Math.round(selectedTier.priceInr * 0.75), currency)} (25% Child Discount)
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm font-mono-tabular">
                    {childCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChildCount(Math.min(8, childCount + 1))}
                    className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Fare & Booking Action */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Payable</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  {formatPrice(calculateBookingTotal(), currency)}
                </span>
                <span className="text-[10px] text-slate-400 block">Taxes & park fees included</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateInstantVoucher}
                  className="px-3.5 py-2.5 rounded-full border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Generate instant digital pass"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Preview Pass</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmToCheckout}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:brightness-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cancellation Guarantee */}
            <p className="text-[11px] text-emerald-700 mt-3 text-center flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{bookingExperience.cancellationPolicy}</span>
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: FULL EXPERIENCE DETAILS & HIGHLIGHTS MODAL
      ===================================================================== */}
      {detailExperience && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              type="button"
              onClick={() => setDetailExperience(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Banner */}
            <div className="w-full h-56 rounded-2xl overflow-hidden relative mb-4">
              <SafeImage
                src={detailExperience.image}
                alt={detailExperience.title}
                fallbackTitle={detailExperience.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900/90 text-white backdrop-blur-xs">
                  {detailExperience.categoryLabel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                  ★ {detailExperience.rating} ({detailExperience.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Title & Location */}
            <h3 className="font-display font-extrabold text-xl text-slate-900">
              {detailExperience.title}
            </h3>
            <p className="text-xs text-indigo-600 font-bold mt-1">
              📍 {detailExperience.city}, {detailExperience.country} · {detailExperience.duration}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact Address: {detailExperience.locationAddress}
            </p>

            {/* Overview */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Experience Overview
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {detailExperience.overview}
              </p>
            </div>

            {/* Inclusions */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                What's Included in Your Ticket
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detailExperience.inclusions.map((inc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor Instructions & Cancellation */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Important Visitor Guidelines</span>
              </div>
              <p className="text-[11px] text-amber-800">
                • Please carry a government-issued photo ID (Passport / Aadhaar) matching the ticket lead name.
              </p>
              <p className="text-[11px] text-amber-800">
                • Show digital barcode on your mobile device at park entry turnstiles; no physical printout needed.
              </p>
              <p className="text-[11px] text-amber-800">
                • Cancellation Policy: {detailExperience.cancellationPolicy}
              </p>
            </div>

            {/* Action */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Starting from</span>
                <div className="text-xl font-black text-slate-900 font-mono">
                  {formatPrice(detailExperience.startingPriceInr, currency)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDetailExperience(null);
                  handleOpenBooking(detailExperience);
                }}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Book This Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: INSTANT DIGITAL E-TICKET VOUCHER PREVIEW
      ===================================================================== */}
      {voucherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              type="button"
              onClick={() => setVoucherModal(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Digital Pass Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Verified Digital E-Ticket
              </h3>
              <p className="text-xs font-mono text-emerald-700 font-bold">
                REF: {voucherModal.bookingRef}
              </p>
            </div>

            {/* Experience Details */}
            <div className="py-4 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Activity / Park</span>
                <div className="font-bold text-sm text-slate-900 leading-snug">
                  {voucherModal.experience.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pass Type</span>
                  <div className="font-bold text-slate-800">{voucherModal.tier.name}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Date & Slot</span>
                  <div className="font-bold text-slate-800">{voucherModal.date} @ {voucherModal.timeSlot}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Attendees</span>
                  <div className="font-bold text-slate-800">
                    {voucherModal.adults} Adults{voucherModal.children > 0 ? `, ${voucherModal.children} Children` : ''}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Paid</span>
                  <div className="font-black text-slate-900 font-mono">
                    {formatPrice(voucherModal.totalInr, currency)}
                  </div>
                </div>
              </div>

              {/* QR Code Demo */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 text-center space-y-2">
                <div className="w-28 h-28 bg-white p-2 rounded-xl mx-auto border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Scan at park turnstile scanner for immediate direct gate access
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onNotify('E-Ticket Downloaded', 'Pass saved as digital voucher (PDF).', 'success');
                  setVoucherModal(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center cursor-pointer transition-colors"
              >
                Save Ticket Pass
              </button>

              <button
                type="button"
                onClick={() => {
                  setVoucherModal(null);
                  handleOpenBooking(voucherModal.experience);
                }}
                className="py-2.5 px-4 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Book More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
