import React, { useState, useRef } from 'react';
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Star,
  Hotel,
  Plane,
  ArrowLeft,
  ArrowRight,
  Eye,
  Bookmark,
  Share2,
  Check,
  X,
  Sun,
  Utensils,
  Mountain,
  Search,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  ExploreCategory,
  ExploreDestination,
  EXPLORE_THEME_CARDS,
  INDIA_DESTINATIONS,
  INTERNATIONAL_DESTINATIONS,
  TOURIST_COLLECTIONS,
  MONTHLY_TRAVEL_PICKS,
  VISUAL_STORIES,
} from '../data/exploreData';
import { SafeImage } from './SafeImage';
import { CurrencyCode, formatPrice } from '../data/travelData';

interface ExplorePageProps {
  onBackToHome: () => void;
  currency: CurrencyCode;
  onBookFlightToDestination?: (cityName: string, cityCode?: string) => void;
  onOpenAIPlanner?: (destination: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onBackToHome,
  currency,
  onBookFlightToDestination,
  onOpenAIPlanner,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | null>(null);

  // Selected Destination for Detail Modal/Page
  const [selectedDestination, setSelectedDestination] = useState<ExploreDestination | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'budget' | 'attractions' | 'hotels' | 'itinerary'>('overview');
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);
  const [shareToast, setShareToast] = useState(false);

  // Visual Story Modal State
  const [activeStory, setActiveStory] = useState<(typeof VISUAL_STORIES)[0] | null>(null);

  // Refs for horizontal scrolling carousels
  const indiaScrollRef = useRef<HTMLDivElement>(null);
  const internationalScrollRef = useRef<HTMLDivElement>(null);
  const collectionsScrollRef = useRef<HTMLDivElement>(null);
  const monthlyScrollRef = useRef<HTMLDivElement>(null);
  const storiesScrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 380;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleToggleSave = (destId: string) => {
    setSavedDestinations((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Explore ${title} on TripYeah`,
        text: `Discover attractions, budget, hotels and itineraries for ${title}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  // Helper to open destination detail from any card
  const handleOpenDestination = (dest: ExploreDestination) => {
    setSelectedDestination(dest);
    setActiveGalleryIndex(0);
    setActiveDetailTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter theme cards if search query is active
  const filteredThemeCards = EXPLORE_THEME_CARDS.filter((card) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(q) ||
      card.shortDesc.toLowerCase().includes(q) ||
      card.popularPlaces.some((p) => p.toLowerCase().includes(q))
    );
  });

  // Filter India destinations
  const filteredIndia = INDIA_DESTINATIONS.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.stateOrRegion.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
    );
  });

  // Filter International destinations
  const filteredInternational = INTERNATIONAL_DESTINATIONS.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Link copied to clipboard!</span>
        </div>
      )}

      {/* Top Navigation & Breadcrumb */}
      <header className="sticky top-0 z-40 bg-[#070B14]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>TripYeah</span>
              <span className="text-slate-600">/</span>
              <span className="text-blue-400 font-semibold">Explore Destinations</span>
            </div>
          </div>

          {/* Quick Search in Header */}
          <div className="relative w-48 sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, beaches..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16 border-b border-white/5">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wide">
            <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
            <span>Curated Travel Inspiration</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Discover the World with <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">TripYeah</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Explore destinations, discover experiences, and plan your perfect getaway.
          </p>

          {/* Quick Category Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <button
              type="button"
              onClick={() => setSelectedThemeFilter(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedThemeFilter === null
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              All Collections
            </button>
            {['Beaches', 'Mountains', 'Heritage', 'Romance', 'Adventure', 'International'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedThemeFilter(selectedThemeFilter === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedThemeFilter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* SECTION 1: 12 THEME IMAGE CARDS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-blue-400 tracking-wider uppercase">Categories &amp; Themes</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Explore by Travel Style
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Handcrafted themes curated for every wanderlust—from mountain summits to tropical shorelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredThemeCards.map((card) => (
              <div
                key={card.id}
                className="group relative bg-[#0D1424] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 flex flex-col justify-between"
              >
                {/* Image Container with measured contrast scrim */}
                <div className="relative h-48 overflow-hidden">
                  <SafeImage
                    src={card.image}
                    alt={card.title}
                    fallbackTitle={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-[#0D1424]/40 to-transparent" />
                  
                  {/* Subtle Unboxed Tag */}
                  <div className="absolute top-3 left-3 text-[11px] font-semibold text-blue-300 bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                    {card.tag}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                      {card.shortDesc}
                    </p>
                  </div>

                  {/* Popular places metadata */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">
                      {card.popularPlaces.slice(0, 3).join(' · ')}
                    </span>
                    <span className="font-semibold text-slate-300 shrink-0 font-mono">
                      from {formatPrice(card.startingPriceInr, currency)}
                    </span>
                  </div>

                  {/* Explore Button */}
                  <button
                    type="button"
                    onClick={() => {
                      // Find best matching destination for this category
                      if (card.id === 'beach') handleOpenDestination(INDIA_DESTINATIONS[0]);
                      else if (card.id === 'hills-mountains') handleOpenDestination(INDIA_DESTINATIONS[2]);
                      else if (card.id === 'heritage') handleOpenDestination(INDIA_DESTINATIONS[4]);
                      else if (card.id === 'honeymoon') handleOpenDestination(INTERNATIONAL_DESTINATIONS[0]);
                      else if (card.id === 'romantic-places') handleOpenDestination(INTERNATIONAL_DESTINATIONS[3]);
                      else if (card.id === 'international-destinations') handleOpenDestination(INTERNATIONAL_DESTINATIONS[4]);
                      else if (card.id === 'places-to-relax') handleOpenDestination(INDIA_DESTINATIONS[3]);
                      else handleOpenDestination(INDIA_DESTINATIONS[0]);
                    }}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <span>Explore {card.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: TOP PLACES TO VISIT IN INDIA (HORIZONTAL CAROUSEL) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 tracking-wider uppercase">Incredible Bharat</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Top Places to Visit in India
              </h2>
            </div>

            {/* Carousel Control Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel(indiaScrollRef, 'left')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous India destinations"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(indiaScrollRef, 'right')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next India destinations"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={indiaScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredIndia.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleOpenDestination(dest)}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[350px] snap-start bg-[#0D1424] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-amber-950/20 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <SafeImage
                    src={dest.heroImage}
                    alt={dest.name}
                    fallbackTitle={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-transparent to-black/30" />
                  
                  {/* Location badge */}
                  <div className="absolute top-3 left-3 text-[11px] font-semibold text-slate-200 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{dest.stateOrRegion}</span>
                  </div>

                  {/* Bookmark quick action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave(dest.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 hover:bg-black/75 text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors"
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedDestinations.includes(dest.id) ? 'fill-amber-400 text-amber-400' : 'text-white'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-display text-xl font-bold text-white drop-shadow-md">
                      {dest.name}
                    </div>
                    <div className="text-[11px] text-slate-300 drop-shadow-sm truncate">
                      {dest.quickStats.idealDuration} · {dest.bestTimeToVisit.months}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {dest.tagline}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Budget / Person</span>
                      <span className="font-bold text-amber-300 font-mono">
                        {formatPrice(dest.estimatedBudget.totalEstimateInr, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: TOP INTERNATIONAL DESTINATIONS (HORIZONTAL CAROUSEL) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-sky-400 tracking-wider uppercase">Passport Ready</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Top International Destinations
              </h2>
            </div>

            {/* Carousel Control Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel(internationalScrollRef, 'left')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous international destinations"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(internationalScrollRef, 'right')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next international destinations"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={internationalScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredInternational.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleOpenDestination(dest)}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[350px] snap-start bg-[#0D1424] rounded-2xl overflow-hidden border border-white/10 hover:border-sky-500/40 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-sky-950/20 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <SafeImage
                    src={dest.heroImage}
                    alt={dest.name}
                    fallbackTitle={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-transparent to-black/30" />
                  
                  {/* Location badge */}
                  <div className="absolute top-3 left-3 text-[11px] font-semibold text-slate-200 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span>{dest.country}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave(dest.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 hover:bg-black/75 text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors"
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedDestinations.includes(dest.id) ? 'fill-sky-400 text-sky-400' : 'text-white'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-display text-xl font-bold text-white drop-shadow-md">
                      {dest.name}
                    </div>
                    <div className="text-[11px] text-slate-300 drop-shadow-sm truncate">
                      {dest.quickStats.idealDuration} · {dest.bestTimeToVisit.months}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {dest.tagline}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Budget / Person</span>
                      <span className="font-bold text-sky-300 font-mono">
                        {formatPrice(dest.estimatedBudget.totalEstimateInr, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-sky-500 group-hover:text-slate-950 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Explore Destination</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: TOP TOURIST PLACES COLLECTIONS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Curated Circuits</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Top Tourist Places Collections
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel(collectionsScrollRef, 'left')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous collections"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(collectionsScrollRef, 'right')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next collections"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={collectionsScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TOURIST_COLLECTIONS.map((col) => (
              <div
                key={col.id}
                onClick={() => {
                  // Map collection to a primary destination
                  if (col.id === 'golden-triangle' || col.id === 'royal-rajasthan-forts') {
                    handleOpenDestination(INDIA_DESTINATIONS[4]); // Udaipur
                  } else if (col.id === 'swiss-alps-panorama') {
                    handleOpenDestination(INTERNATIONAL_DESTINATIONS[4]); // Zurich
                  } else if (col.id === 'southeast-asia-islands') {
                    handleOpenDestination(INTERNATIONAL_DESTINATIONS[1]); // Bali
                  } else if (col.id === 'kerala-backwaters-munnar') {
                    handleOpenDestination(INDIA_DESTINATIONS[3]); // Varkala
                  } else {
                    handleOpenDestination(INTERNATIONAL_DESTINATIONS[3]); // Paris
                  }
                }}
                className="min-w-[300px] sm:min-w-[340px] md:min-w-[370px] snap-start bg-[#0D1424] rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-indigo-950/20 flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <SafeImage
                    src={col.image}
                    alt={col.title}
                    fallbackTitle={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-[#0D1424]/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 text-[10px] font-bold text-indigo-300 bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                    {col.tag}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {col.duration} · {col.destinationsCount}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {col.overview}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Package Starting At</span>
                      <span className="font-bold text-indigo-300 font-mono text-sm">
                        {formatPrice(col.priceInr, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1"
                    >
                      <span>Explore Circuit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: MONTHLY TRAVEL PICKS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Seasonal Calendars</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Monthly Travel Picks
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel(monthlyScrollRef, 'left')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous monthly picks"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(monthlyScrollRef, 'right')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next monthly picks"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={monthlyScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {MONTHLY_TRAVEL_PICKS.map((pick) => (
              <div
                key={pick.id}
                onClick={() => {
                  if (pick.id === 'pick-dec') handleOpenDestination(INDIA_DESTINATIONS[2]);
                  else if (pick.id === 'pick-feb') handleOpenDestination(INDIA_DESTINATIONS[0]);
                  else if (pick.id === 'pick-oct-nov') handleOpenDestination(INDIA_DESTINATIONS[4]);
                  else handleOpenDestination(INDIA_DESTINATIONS[1]);
                }}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] snap-start bg-[#0D1424] rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden">
                  <SafeImage
                    src={pick.image}
                    alt={pick.title}
                    fallbackTitle={pick.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-[#0D1424]/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 text-[11px] font-bold text-emerald-300 bg-slate-950/75 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>{pick.monthLabel}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>{pick.location}</span>
                    <span className="font-mono text-emerald-300">{pick.temperature}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {pick.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {pick.highlight}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{pick.recommendedDays} Tour</span>
                      <span className="font-bold text-emerald-300 font-mono">
                        ~{formatPrice(pick.approxBudgetInr, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: VISUAL STORIES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-400 tracking-wider uppercase">Traveler Moments</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Visual Stories &amp; Photo Journals
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel(storiesScrollRef, 'left')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous stories"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(storiesScrollRef, 'right')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next stories"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={storiesScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {VISUAL_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="min-w-[270px] sm:min-w-[300px] md:min-w-[320px] snap-start bg-[#0D1424] rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/40 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-rose-950/20 flex flex-col justify-between"
              >
                <div className="relative h-60 overflow-hidden">
                  <SafeImage
                    src={story.image}
                    alt={story.title}
                    fallbackTitle={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 text-[10px] font-bold text-rose-300 bg-slate-950/75 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-rose-400" />
                    <span>Photo Story</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] text-slate-300 block">{story.location}</span>
                    <h3 className="font-display text-sm font-bold text-white mt-0.5 group-hover:text-rose-200 transition-colors">
                      {story.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    "{story.snippet}"
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>By {story.author}</span>
                    <span>{story.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL 1: DESTINATION DETAIL PAGE (PHOTOS, OVERVIEW, BEST TIME, BUDGET, ATTRACTIONS, HOTELS, ITINERARY) */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-[#0B1120] text-slate-100 rounded-3xl max-w-4xl w-full my-auto border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]">
            
            {/* Modal Header Bar */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#070B14]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                      {selectedDestination.name}
                    </h2>
                    <span className="text-xs text-slate-400">· {selectedDestination.country}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    {selectedDestination.quickStats.idealDuration} · {selectedDestination.bestTimeToVisit.months}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleSave(selectedDestination.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Save Destination"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      savedDestinations.includes(selectedDestination.id)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(selectedDestination.name)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDestination(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
              
              {/* Photo Gallery & Hero */}
              <div className="space-y-3">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 group">
                  <SafeImage
                    src={selectedDestination.galleryImages[activeGalleryIndex] || selectedDestination.heroImage}
                    alt={selectedDestination.name}
                    fallbackTitle={selectedDestination.name}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block">
                      {selectedDestination.stateOrRegion}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {selectedDestination.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                      {selectedDestination.tagline}
                    </p>
                  </div>
                </div>

                {/* Thumbnail switchers */}
                {selectedDestination.galleryImages.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {selectedDestination.galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeGalleryIndex === idx
                            ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <SafeImage
                          src={img}
                          alt={`${selectedDestination.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Ideal Duration</span>
                  <span className="font-semibold text-slate-200">{selectedDestination.quickStats.idealDuration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Airport / Rail</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedDestination.quickStats.airportOrStation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Getting Around</span>
                  <span className="font-semibold text-slate-200">{selectedDestination.quickStats.localTransport}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Est. Budget / Person</span>
                  <span className="font-bold text-blue-400 font-mono">
                    {formatPrice(selectedDestination.estimatedBudget.totalEstimateInr, currency)}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview & Climate' },
                  { id: 'budget', label: 'Estimated Budget' },
                  { id: 'attractions', label: `Attractions (${selectedDestination.topAttractions.length})` },
                  { id: 'hotels', label: `Hotels (${selectedDestination.recommendedHotels.length})` },
                  { id: 'itinerary', label: 'Day-by-Day Itinerary' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDetailTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeDetailTab === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW & BEST TIME TO VISIT */}
              {activeDetailTab === 'overview' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-2">
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                      About {selectedDestination.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedDestination.overview}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Best Time to Visit</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {selectedDestination.bestTimeToVisit.months}
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>Climate:</strong> {selectedDestination.bestTimeToVisit.weather}
                    </p>
                    <p className="text-xs text-blue-300/90 pt-1 border-t border-white/10">
                      💡 <strong>Pro Tip:</strong> {selectedDestination.bestTimeToVisit.seasonTip}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ESTIMATED BUDGET BREAKDOWN */}
              {activeDetailTab === 'budget' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Estimated Budget Breakdown
                      </span>
                      <span className="text-sm font-display font-bold text-emerald-400 font-mono">
                        Total ~{formatPrice(selectedDestination.estimatedBudget.totalEstimateInr, currency)} / person
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Flight / Train</span>
                        <span className="font-bold text-slate-100 font-mono mt-1 block">
                          {formatPrice(selectedDestination.estimatedBudget.flightOrTrainEstimateInr, currency)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">3-4★ Hotel Stay</span>
                        <span className="font-bold text-slate-100 font-mono mt-1 block">
                          {formatPrice(selectedDestination.estimatedBudget.hotelEstimateInr, currency)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Food &amp; Dining</span>
                        <span className="font-bold text-slate-100 font-mono mt-1 block">
                          {formatPrice(selectedDestination.estimatedBudget.foodEstimateInr, currency)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Activities &amp; Cabs</span>
                        <span className="font-bold text-slate-100 font-mono mt-1 block">
                          {formatPrice(selectedDestination.estimatedBudget.activitiesEstimateInr, currency)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/10">
                      * {selectedDestination.estimatedBudget.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: ATTRACTIONS & HIGHLIGHTS */}
              {activeDetailTab === 'attractions' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  {selectedDestination.topAttractions.map((att, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-display text-sm font-bold text-white">
                          {att.name}
                        </h5>
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded shrink-0">
                          {att.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {att.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {att.timing}
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">
                          {att.entryFee}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: RECOMMENDED HOTELS */}
              {activeDetailTab === 'hotels' && (
                <div className="space-y-3 animate-in fade-in">
                  {selectedDestination.recommendedHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-display text-sm font-bold text-white truncate">
                            {hotel.name}
                          </h5>
                          {hotel.badge && (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded font-mono shrink-0">
                              {hotel.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="flex items-center gap-0.5 text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <strong>{hotel.rating}</strong>
                          </span>
                          <span>·</span>
                          <span className="text-slate-400">{hotel.area}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {hotel.amenities.map((am, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-md"
                            >
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Starting from</span>
                          <span className="font-bold text-sm text-blue-400 font-mono">
                            {formatPrice(hotel.pricePerNightInr, currency)} / night
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDestination(null);
                            if (onBookFlightToDestination) {
                              onBookFlightToDestination(selectedDestination.name);
                            } else {
                              onBackToHome();
                            }
                          }}
                          className="mt-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Book Stay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: DAY-BY-DAY ITINERARY */}
              {activeDetailTab === 'itinerary' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
                    <span>💡 Full Day-by-Day schedule curated by destination experts.</span>
                    {onOpenAIPlanner && (
                      <button
                        type="button"
                        onClick={() => {
                          const destName = selectedDestination.name;
                          setSelectedDestination(null);
                          onOpenAIPlanner(destName);
                        }}
                        className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Customize with AI</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedDestination.dayByDayItinerary.map((plan) => (
                      <div
                        key={plan.dayNumber}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {plan.dayNumber}
                          </span>
                          <h5 className="font-display text-sm font-bold text-white">
                            {plan.dayTitle}
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                            <span className="text-[10px] text-amber-400 font-bold block mb-1">🌅 MORNING</span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{plan.morning}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                            <span className="text-[10px] text-sky-400 font-bold block mb-1">☀️ AFTERNOON</span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{plan.afternoon}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                            <span className="text-[10px] text-indigo-400 font-bold block mb-1">🌙 EVENING</span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{plan.evening}</p>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                          <Utensils className="w-3 h-3 text-amber-400 shrink-0" />
                          <span><strong>Highlight Culinary Stop:</strong> {plan.highlightMeal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#070B14] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-300">
                <span className="block text-[11px] text-slate-400">Total Estimated Budget</span>
                <span className="font-display text-lg font-bold text-emerald-400 font-mono">
                  {formatPrice(selectedDestination.estimatedBudget.totalEstimateInr, currency)} / person
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {onOpenAIPlanner && (
                  <button
                    type="button"
                    onClick={() => {
                      const destName = selectedDestination.name;
                      setSelectedDestination(null);
                      onOpenAIPlanner(destName);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>AI Itinerary Planner</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const destName = selectedDestination.name;
                    setSelectedDestination(null);
                    if (onBookFlightToDestination) {
                      onBookFlightToDestination(destName);
                    } else {
                      onBackToHome();
                    }
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Book Flights to {selectedDestination.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VISUAL STORY DETAIL */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1120] text-slate-100 rounded-3xl max-w-lg w-full border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="relative h-64 overflow-hidden">
              <SafeImage
                src={activeStory.image}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-black/40" />
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-xs text-rose-300 font-semibold">{activeStory.location}</span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {activeStory.title}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/10">
                <div>
                  <span className="text-slate-200 font-semibold block">{activeStory.author}</span>
                  <span className="text-[11px] text-slate-400">{activeStory.authorRole}</span>
                </div>
                <span className="text-[11px] font-mono">{activeStory.readTime}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{activeStory.snippet}"
              </p>

              <div className="p-3 rounded-xl bg-white/5 text-xs text-slate-400">
                {activeStory.stats}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
