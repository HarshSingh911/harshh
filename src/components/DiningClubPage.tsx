import React, { useState, useEffect, useMemo } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
  Filter,
  Check,
  CheckCircle2,
  Wine,
  PartyPopper,
  Flame,
  CreditCard,
  Ticket,
  Plus,
  Minus,
  ShoppingBag,
  Share2,
  Crown,
  ShieldCheck,
  Award,
  ArrowRight,
  Info,
  Phone,
  Mail,
  UserCheck,
  QrCode,
  Download,
  Copy,
  Music,
  Compass,
  Play,
  Pause,
  Maximize2,
  Eye,
  Camera,
  ZoomIn,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';
import {
  DINING_CITIES,
  DINING_VENUES,
  DiningVenue,
  GOURMET_MENU_ITEMS,
  MenuItem,
  GROUP_PARTY_PACKAGES,
  GroupPartyPackage,
  CLUB_EVENTS,
  ClubEvent,
  SOCIAL_PARTY_TABLES,
  SocialPartyTable,
  AESTHETIC_HERO_SLIDES,
  AestheticHeroSlide,
} from '../data/diningClubData';
import { SafeImage } from './SafeImage';

export interface DiningClubPageProps {
  currency: CurrencyCode;
  onBackToHome: () => void;
  onNotify: (title: string, message: string, type?: 'success' | 'info') => void;
  userName?: string | null;
}

type DiningTab = 'all' | 'restaurants' | 'food-order' | 'group-party' | 'club-tickets' | 'join-party' | 'my-passes';

export interface UserDiningPass {
  id: string;
  type: 'table' | 'food' | 'group' | 'club' | 'social';
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  guestsOrQty: string;
  totalPaidInr: number;
  qrCodeUrl?: string;
  badge: string;
  details: string;
}

export const DiningClubPage: React.FC<DiningClubPageProps> = ({
  currency,
  onBackToHome,
  onNotify,
  userName,
}) => {
  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<DiningTab>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all');

  // Interactive Cart for Pre-Ordering Food
  const [cart, setCart] = useState<{ [itemId: string]: number }>({
    'caviar-blinis': 1,
    'smoked-cocktail': 2,
  });
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // User Passes Storage in local state
  const [userPasses, setUserPasses] = useState<UserDiningPass[]>([
    {
      id: 'TY-DINE-7819',
      type: 'table',
      title: 'Arabian Sea Window Table Reservation',
      venue: 'Aura Skyline & Mixology Lounge',
      city: 'Mumbai',
      date: 'Friday, 24 Oct 2026',
      time: '08:15 PM',
      guestsOrQty: '2 Guests',
      totalPaidInr: 1000,
      badge: 'VIP Table Confirmed',
      details: 'Window table reserved with complimentary champagne flutes on arrival.',
    },
  ]);

  // Modals State
  const [selectedVenueForBooking, setSelectedVenueForBooking] = useState<DiningVenue | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('2026-10-24');
  const [bookingTime, setBookingTime] = useState<string>('08:15 PM');
  const [bookingTableType, setBookingTableType] = useState<string>('');
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [bookingOccasion, setBookingOccasion] = useState<string>('Romantic Date');
  const [bookingName, setBookingName] = useState<string>(userName || 'Mehul Singhania');
  const [bookingPhone, setBookingPhone] = useState<string>('+91 98765 43210');
  const [bookingSpecialNotes, setBookingSpecialNotes] = useState<string>('');

  // Group Party Modal
  const [selectedPartyPackage, setSelectedPartyPackage] = useState<GroupPartyPackage | null>(null);
  const [partyGuestsCount, setPartyGuestsCount] = useState<number>(20);
  const [partyDate, setPartyDate] = useState<string>('2026-10-28');
  const [partyBeverageTier, setPartyBeverageTier] = useState<'standard' | 'premium' | 'mocktail'>('premium');
  const [partyAddButler, setPartyAddButler] = useState<boolean>(true);
  const [partyAddCake, setPartyAddCake] = useState<boolean>(true);
  const [partyAddDJ, setPartyAddDJ] = useState<boolean>(false);

  // Club Ticket Modal
  const [selectedClubEvent, setSelectedClubEvent] = useState<ClubEvent | null>(null);
  const [selectedPassIndex, setSelectedPassIndex] = useState<number>(0);
  const [passCount, setPassCount] = useState<number>(1);

  // Join Party Modal
  const [selectedSocialTable, setSelectedSocialTable] = useState<SocialPartyTable | null>(null);
  const [joinName, setJoinName] = useState<string>(userName || '');
  const [joinVibe, setJoinVibe] = useState<string>('Founder / Travel Enthusiast');

  // Host Table Modal
  const [showHostTableModal, setShowHostTableModal] = useState<boolean>(false);
  const [hostTitle, setHostTitle] = useState<string>('');
  const [hostVenue, setHostVenue] = useState<string>('Aura Skyline & Mixology Lounge');
  const [hostDate, setHostDate] = useState<string>('2026-10-26');
  const [hostTime, setHostTime] = useState<string>('08:30 PM');
  const [hostSeats, setHostSeats] = useState<number>(6);
  const [hostVibe, setHostVibe] = useState<string>('Creative Networking & Cocktails');

  // Active Success Pass Display Modal
  const [activeCreatedPass, setActiveCreatedPass] = useState<UserDiningPass | null>(null);

  // Aesthetic Background Slideshow State (Auto transitions aesthetic parties & cafes)
  const [bgSlideIndex, setBgSlideIndex] = useState<number>(0);

  // Lightbox Modal State for Ultra-Clear High-Def Photo Viewing ("saaf saaf photo")
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    title: string;
    subtitle?: string;
    city?: string;
    badge?: string;
  } | null>(null);

  // Auto-play background slideshow every 4.5 seconds with smooth cross-fade
  useEffect(() => {
    const interval = setInterval(() => {
      setBgSlideIndex((prev) => (prev + 1) % AESTHETIC_HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Cart Calculations
  const cartItemDetails = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = GOURMET_MENU_ITEMS.find((m) => m.id === id);
        return item ? { ...item, quantity: qty } : null;
      })
      .filter(Boolean) as (MenuItem & { quantity: number })[];
  }, [cart]);

  const cartSubtotalInr = useMemo(() => {
    return cartItemDetails.reduce((sum, item) => sum + item.priceInr * item.quantity, 0);
  }, [cartItemDetails]);

  const cartDiscountInr = Math.round(cartSubtotalInr * 0.2); // 20% VIP Dining Club privilege
  const cartTotalInr = Math.max(0, cartSubtotalInr - cartDiscountInr);
  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleUpdateCart = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  // Filtered Venues
  const filteredVenues = useMemo(() => {
    return DINING_VENUES.filter((v) => {
      const matchCity = selectedCity === 'All Cities' || v.city.toLowerCase() === selectedCity.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.popularDish.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCuisine =
        selectedCuisine === 'All' || v.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
      return matchCity && matchSearch && matchCuisine;
    });
  }, [selectedCity, searchQuery, selectedCuisine]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return GOURMET_MENU_ITEMS.filter((item) => {
      const matchCat = selectedMenuCategory === 'all' || item.category === selectedMenuCategory;
      const matchDiet = dietaryFilter === 'all' || item.dietary === dietaryFilter;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.venueName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiet && matchSearch;
    });
  }, [selectedMenuCategory, dietaryFilter, searchQuery]);

  // Filtered Club Events
  const filteredClubEvents = useMemo(() => {
    return CLUB_EVENTS.filter((event) => {
      const matchCity = selectedCity === 'All Cities' || event.city.toLowerCase() === selectedCity.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.musicGenre.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchSearch;
    });
  }, [selectedCity, searchQuery]);

  // Filtered Social Party Tables
  const filteredSocialTables = useMemo(() => {
    return SOCIAL_PARTY_TABLES.filter((table) => {
      const matchCity = selectedCity === 'All Cities' || table.city.toLowerCase() === selectedCity.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        table.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.vibeTag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchSearch;
    });
  }, [selectedCity, searchQuery]);

  // Booking Execution Functions
  const handleConfirmTableBooking = () => {
    if (!selectedVenueForBooking) return;
    const tableChoice =
      selectedVenueForBooking.tableTypes.find((t) => t.id === bookingTableType) ||
      selectedVenueForBooking.tableTypes[0];
    const totalDeposit = tableChoice ? tableChoice.extraFeeInr : 0;
    const refCode = `TY-DINE-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: UserDiningPass = {
      id: refCode,
      type: 'table',
      title: `${tableChoice.name} · ${selectedVenueForBooking.name}`,
      venue: selectedVenueForBooking.name,
      city: selectedVenueForBooking.city,
      date: bookingDate,
      time: bookingTime,
      guestsOrQty: `${bookingGuests} Guests (${bookingOccasion})`,
      totalPaidInr: totalDeposit,
      badge: 'Table Reserved & Confirmed',
      details: `Reserved under ${bookingName}. Dress code: ${selectedVenueForBooking.dressCode}. Deposit ₹${totalDeposit} credited toward dinner bill.`,
    };

    setUserPasses((prev) => [newPass, ...prev]);
    setSelectedVenueForBooking(null);
    setActiveCreatedPass(newPass);
    onNotify(
      `Table Reserved: ${selectedVenueForBooking.name}`,
      `Pass #${refCode} issued. Your ${tableChoice.name} is confirmed for ${bookingGuests} guests.`,
      'success'
    );
  };

  const handleConfirmCartOrder = () => {
    if (cartItemDetails.length === 0) return;
    const refCode = `TY-FOOD-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = cartItemDetails.map((i) => `${i.quantity}x ${i.name}`).join(', ');

    const newPass: UserDiningPass = {
      id: refCode,
      type: 'food',
      title: 'Gourmet Chef Pre-Order & VIP Dining Voucher',
      venue: cartItemDetails[0].venueName || 'TripYehh Haute Cellar',
      city: selectedCity === 'All Cities' ? 'Pan-India Delivery & Dine-In' : selectedCity,
      date: 'Today / Scheduled Dine-In',
      time: 'Priority VIP Kitchen Dispatch',
      guestsOrQty: `${totalCartCount} Gourmet Items`,
      totalPaidInr: cartTotalInr,
      badge: 'Kitchen Dispatched · 20% Discount Applied',
      details: itemsSummary,
    };

    setUserPasses((prev) => [newPass, ...prev]);
    setCart({});
    setShowCartDrawer(false);
    setActiveCreatedPass(newPass);
    onNotify(
      'Gourmet Order Placed!',
      `Order #${refCode} confirmed. ${totalCartCount} items sent to the executive chef.`,
      'success'
    );
  };

  const handleConfirmGroupParty = () => {
    if (!selectedPartyPackage) return;
    const refCode = `TY-PARTY-${Math.floor(1000 + Math.random() * 9000)}`;
    let total = partyGuestsCount * selectedPartyPackage.pricePerGuestInr;
    if (partyBeverageTier === 'premium') total += partyGuestsCount * 1200;
    if (partyAddButler) total += 3500;
    if (partyAddCake) total += 2500;
    if (partyAddDJ) total += 8000;

    const newPass: UserDiningPass = {
      id: refCode,
      type: 'group',
      title: selectedPartyPackage.title,
      venue: selectedPartyPackage.venueName,
      city: selectedPartyPackage.city,
      date: partyDate,
      time: '07:30 PM (Private Banquet)',
      guestsOrQty: `${partyGuestsCount} Guests (${partyBeverageTier.toUpperCase()} Bar)`,
      totalPaidInr: total,
      badge: 'Group Celebration Confirmed',
      details: `Dedicated banquet manager assigned. All ${partyGuestsCount} guests have priority valet and red-carpet welcome.`,
    };

    setUserPasses((prev) => [newPass, ...prev]);
    setSelectedPartyPackage(null);
    setActiveCreatedPass(newPass);
    onNotify(
      `Party Package Booked!`,
      `Pass #${refCode} for ${partyGuestsCount} guests confirmed at ${selectedPartyPackage.venueName}.`,
      'success'
    );
  };

  const handleConfirmClubPass = () => {
    if (!selectedClubEvent) return;
    const pass = selectedClubEvent.passes[selectedPassIndex];
    const total = pass.priceInr * passCount;
    const refCode = `TY-CLUB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: UserDiningPass = {
      id: refCode,
      type: 'club',
      title: `${pass.name} · ${selectedClubEvent.title}`,
      venue: selectedClubEvent.clubName,
      city: selectedClubEvent.city,
      date: selectedClubEvent.date,
      time: selectedClubEvent.time,
      guestsOrQty: `${passCount}x ${pass.name}`,
      totalPaidInr: total,
      badge: 'VIP Club Pass Active',
      details: `${pass.perks}. Show digital QR barcode at priority VIP ropes.`,
    };

    setUserPasses((prev) => [newPass, ...prev]);
    setSelectedClubEvent(null);
    setActiveCreatedPass(newPass);
    onNotify(
      `Club Passes Issued!`,
      `${passCount}x ${pass.name} confirmed for ${selectedClubEvent.clubName}.`,
      'success'
    );
  };

  const handleConfirmJoinParty = () => {
    if (!selectedSocialTable) return;
    const refCode = `TY-JOIN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: UserDiningPass = {
      id: refCode,
      type: 'social',
      title: `Social Table: ${selectedSocialTable.title}`,
      venue: selectedSocialTable.venueName,
      city: selectedSocialTable.city,
      date: selectedSocialTable.date,
      time: selectedSocialTable.time,
      guestsOrQty: `1 Seat (Host: ${selectedSocialTable.hostName})`,
      totalPaidInr: selectedSocialTable.costPerSeatInr,
      badge: 'Social Seat Confirmed',
      details: `Joined table with ${selectedSocialTable.filledSeats + 1}/${selectedSocialTable.totalSeats} seats filled. Group WhatsApp/Telegram link unlocked.`,
    };

    setUserPasses((prev) => [newPass, ...prev]);
    setSelectedSocialTable(null);
    setActiveCreatedPass(newPass);
    onNotify(
      `You're on the Guestlist!`,
      `Your seat is reserved for ${selectedSocialTable.title} hosted by ${selectedSocialTable.hostName}.`,
      'success'
    );
  };

  const handleCreateHostTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostTitle.trim()) return;
    const refCode = `TY-HOST-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: UserDiningPass = {
      id: refCode,
      type: 'social',
      title: `Hosted by You: ${hostTitle}`,
      venue: hostVenue,
      city: selectedCity === 'All Cities' ? 'Mumbai' : selectedCity,
      date: hostDate,
      time: hostTime,
      guestsOrQty: `${hostSeats} Seats Table (Vibe: ${hostVibe})`,
      totalPaidInr: 0,
      badge: 'Host Table Live',
      details: `Your social table is now published for fellow TripYehh members to join. Host privileges activated.`,
    };

    setUserPasses((prev) => [newPass, ...prev]);
    setShowHostTableModal(false);
    setActiveCreatedPass(newPass);
    onNotify(
      `Party Table Created!`,
      `Your social dinner "${hostTitle}" is published. Members can now request to join.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Ambient Glow Lights */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-32 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* LUXURY HERO HEADER WITH AESTHETIC PARTIES & CAFES BACKGROUND SLIDESHOW */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 overflow-hidden">
        {/* AESTHETIC PARTIES & CAFES BACKGROUND SLIDESHOW (Continuous Smooth Cross-fade) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {AESTHETIC_HERO_SLIDES.map((slide, idx) => {
            const isCurrent = idx === bgSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isCurrent ? 'opacity-85' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover brightness-95 contrast-105 saturate-110 transition-transform duration-[7000ms] ease-out ${
                    isCurrent ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}
          {/* Subtle elegant gradient - images are visible, colorful and vibrant (not dark/blacked out) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-[#070a13]/40 to-[#070a13]/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(7,10,19,0.55)_100%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumb & Back to Home */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300/80 hover:text-amber-300 transition-colors cursor-pointer group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to TripYehh Home</span>
            </button>

            <div className="flex items-center gap-3">
              {/* My Passes Drawer Trigger */}
              <button
                type="button"
                onClick={() => setActiveTab('my-passes')}
                className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-200 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all cursor-pointer shadow-xs"
              >
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                <span>My VIP Passes</span>
                {userPasses.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {userPasses.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setShowCartDrawer(true)}
                className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-yellow-400 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gourmet Cart</span>
                <span>({totalCartCount})</span>
              </button>
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1] drop-shadow-md">
            Haute Cuisine, Elite Lounges &amp;{' '}
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              VIP Dining Club
            </span>
          </h1>

          {/* Search & City Filter Bar */}
          <div className="mt-8 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-stretch gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, dishes, club parties, or vibes..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-slate-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City Selection Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 pl-1 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                City:
              </span>
              {DINING_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCity === city
                      ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY NAVIGATION TABS */}
      <div className="sticky top-0 z-30 bg-[#070a13]/95 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Experiences', icon: Sparkles },
              { id: 'restaurants', label: 'Restaurant Seat Booking', icon: UtensilsCrossed },
              { id: 'food-order', label: 'Order Gourmet Food', icon: ShoppingBag },
              { id: 'group-party', label: 'Group Party Booking', icon: PartyPopper },
              { id: 'club-tickets', label: 'Club Tickets & VIP', icon: Wine },
              { id: 'join-party', label: 'Join a Party', icon: Users },
              { id: 'my-passes', label: 'My VIP Passes', icon: Ticket },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as DiningTab)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black scale-102'
                      : 'bg-slate-900/60 text-slate-300 hover:text-amber-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Social Host Action Shortcut */}
          <button
            type="button"
            onClick={() => setShowHostTableModal(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Host a Table</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* SECTION 1: RESTAURANT SEAT BOOKING */}
        {(activeTab === 'all' || activeTab === 'restaurants') && (
          <section id="restaurants-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/15 pb-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Fine Dining &amp; Skyline Lounges</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Reserve Premier Restaurant Seats
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Guaranteed table reservations at India &amp; Dubai&apos;s most coveted Michelin-star inspired restaurants.
                </p>
              </div>

              {/* Cuisine Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'European', 'Awadhi', 'Japanese', 'Mediterranean', 'French'].map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCuisine === cuisine
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/* Venues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/60 transition-all duration-300 overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Photo & Badges (Crystal Clear HD View) */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <SafeImage
                      src={venue.coverImage}
                      alt={venue.name}
                      fallbackTitle={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-105 contrast-[1.03]"
                    />
                    {/* Soft gradient strictly behind bottom text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-slate-950/85 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                        {venue.priceTier}
                      </span>
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500/90 text-slate-950">
                        {venue.dressCode}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxPhoto({
                            url: venue.coverImage,
                            title: venue.name,
                            subtitle: `${venue.cuisine} · ${venue.neighborhood}, ${venue.city}`,
                            city: venue.city,
                            badge: `${venue.priceTier} · ${venue.rating} ★`,
                          });
                        }}
                        className="p-1.5 rounded-md bg-slate-950/85 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/40 backdrop-blur-md transition-all cursor-pointer shadow-md"
                        title="View Crystal-Clear HD Photo"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-slate-950/90 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{venue.rating}</span>
                        <span className="text-slate-400 text-[10px]">({venue.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <div className="text-[11px] font-semibold text-amber-300/90 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{venue.neighborhood}, {venue.city}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white truncate drop-shadow-sm">
                        {venue.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-300">
                        {venue.cuisine}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {venue.description}
                      </p>

                      {/* Signature Dish Pill */}
                      <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">Chef&apos;s Signature: <strong>{venue.popularDish}</strong></span>
                      </div>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {venue.features.slice(0, 3).map((feat) => (
                          <span
                            key={feat}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Avg. Price For Two</div>
                        <div className="font-display text-base font-extrabold text-amber-300">
                          {formatPrice(venue.priceForTwoInr, currency)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVenueForBooking(venue);
                          setBookingTableType(venue.tableTypes[0]?.id || '');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-102"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Book Seats</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: GOURMET FOOD ORDERING */}
        {(activeTab === 'all' || activeTab === 'food-order') && (
          <section id="food-ordering-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/15 pb-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Culinary Masterpieces &amp; Cellar</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Pre-Order Haute Food &amp; Cocktails
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Order Michelin-grade degustation items in advance for seamless dine-in seating or VIP private delivery.
                </p>
              </div>

              {/* Dietary & Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setDietaryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      dietaryFilter === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietaryFilter('veg')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                      dietaryFilter === 'veg' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Pure Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietaryFilter('non-veg')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                      dietaryFilter === 'non-veg' ? 'bg-rose-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Non-Veg
                  </button>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                  {[
                    { id: 'all', label: 'All Dishes' },
                    { id: 'starters', label: 'Caviar & Starters' },
                    { id: 'mains', label: 'Signature Mains' },
                    { id: 'degustation', label: 'Degustation' },
                    { id: 'cocktails', label: 'Craft Cocktails' },
                    { id: 'desserts', label: 'Gold Desserts' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedMenuCategory(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedMenuCategory === cat.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMenuItems.map((item) => {
                const inCartQty = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex gap-4">
                      {/* Dish Thumbnail (Clickable HD Visual) */}
                      <div
                        onClick={() =>
                          setLightboxPhoto({
                            url: item.image,
                            title: item.name,
                            subtitle: `${item.venueName} · ${item.category.toUpperCase()}`,
                            badge: `${formatPrice(item.priceInr, currency)} · Prep: ${item.prepTime}`,
                          })
                        }
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 hover:border-amber-400/60 cursor-pointer group/thumb"
                        title="Click to view crystal-clear HD food photo"
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          fallbackTitle={item.name}
                          className="w-full h-full object-cover brightness-105 contrast-[1.03] group-hover/thumb:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover/thumb:bg-transparent transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-slate-950/50 backdrop-blur-xs">
                          <Eye className="w-4 h-4 text-amber-300" />
                        </div>
                        {item.isChefSpecial && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-950 shadow-xs z-10">
                            Chef Star
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full border ${
                              item.dietary === 'veg'
                                ? 'border-emerald-400 bg-emerald-500'
                                : 'border-rose-400 bg-rose-500'
                            }`}
                          />
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {item.venueName}
                          </span>
                        </div>
                        <h4 className="font-display text-sm sm:text-base font-bold text-white mt-1 group-hover:text-amber-300 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-amber-300/80">
                          <Clock className="w-3 h-3" />
                          <span>{item.prepTime}</span>
                          {item.calories && (
                            <>
                              <span>•</span>
                              <span>{item.calories}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Cart Stepper */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="font-display text-base font-extrabold text-amber-300">
                        {formatPrice(item.priceInr, currency)}
                      </div>

                      {inCartQty > 0 ? (
                        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/50 rounded-xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateCart(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold hover:bg-amber-300 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono-tabular font-bold text-xs text-amber-300 px-1">
                            {inCartQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCart(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold hover:bg-amber-300 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateCart(item.id, 1)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/20"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 3: GROUP PARTY BOOKING */}
        {(activeTab === 'all' || activeTab === 'group-party') && (
          <section id="group-parties-section" className="space-y-6">
            <div className="border-b border-amber-500/15 pb-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <PartyPopper className="w-4 h-4" />
                <span>Private Terraces, Banquets &amp; Sundowners</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Luxury Group Party &amp; Celebration Packages
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Host unforgettable landmark birthdays, bachelorette bashes, corporate dinners &amp; beach club takeovers with dedicated butlers, custom menus &amp; open bars.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GROUP_PARTY_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/50 transition-all overflow-hidden flex flex-col group shadow-xl"
                >
                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                    <SafeImage
                      src={pkg.image}
                      alt={pkg.title}
                      fallbackTitle={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-105 contrast-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow-md">
                        {pkg.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                        {pkg.city}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxPhoto({
                            url: pkg.image,
                            title: pkg.title,
                            subtitle: `${pkg.venueName} · ${pkg.city} (${pkg.minGuests}-${pkg.maxGuests} Guests)`,
                            city: pkg.city,
                            badge: pkg.badge,
                          });
                        }}
                        className="p-1.5 rounded-md bg-slate-950/85 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/40 backdrop-blur-md transition-all cursor-pointer shadow-md"
                        title="View Crystal-Clear HD Photo"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <div className="text-xs font-semibold text-amber-300">
                        {pkg.venueName} · {pkg.minGuests}–{pkg.maxGuests} Guests
                      </div>
                      <h3 className="font-display text-xl font-bold text-white drop-shadow">
                        {pkg.title}
                      </h3>
                      <div className="text-xs text-slate-300 mt-0.5">{pkg.subtitle}</div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-amber-300/90 uppercase tracking-wider">
                        Package Highlights
                      </div>
                      <ul className="space-y-1.5">
                        {pkg.highlights.map((h, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Starting From</div>
                        <div className="font-display text-lg font-black text-amber-300">
                          {formatPrice(pkg.pricePerGuestInr, currency)}
                          <span className="text-xs font-normal text-slate-400"> / guest</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPartyPackage(pkg);
                          setPartyGuestsCount(pkg.minGuests);
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <PartyPopper className="w-3.5 h-3.5" />
                        <span>Book Group Party</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: CLUB TICKETS & VIP NIGHTLIFE PASSES */}
        {(activeTab === 'all' || activeTab === 'club-tickets') && (
          <section id="club-tickets-section" className="space-y-6">
            <div className="border-b border-amber-500/15 pb-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Wine className="w-4 h-4" />
                <span>Nightclubs, Speakeasies &amp; DJ Lineups</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                VIP Club Passes &amp; Velvet Booths
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Skip long queues with verified VIP Stag/Couple wristbands or book elite DJ-adjacent bottle booths with private bouncers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredClubEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/50 transition-all overflow-hidden flex flex-col group shadow-lg"
                >
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <SafeImage
                      src={evt.coverImage}
                      alt={evt.title}
                      fallbackTitle={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-105 contrast-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-rose-600 text-white shadow-xs z-10">
                      Live DJ Night
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxPhoto({
                            url: evt.coverImage,
                            title: evt.title,
                            subtitle: `${evt.clubName} · ${evt.city} (${evt.musicGenre})`,
                            city: evt.city,
                            badge: `${evt.djArtist} · ${evt.time}`,
                          });
                        }}
                        className="p-1 rounded-md bg-slate-950/85 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/40 backdrop-blur-md transition-all cursor-pointer shadow-md"
                        title="View Crystal-Clear HD Photo"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                        {evt.city}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <div className="text-[11px] font-bold text-amber-300">{evt.clubName}</div>
                      <h3 className="font-display text-base font-bold text-white drop-shadow truncate">
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Music className="w-3.5 h-3.5 text-amber-400" />
                        <span>{evt.musicGenre} · <strong>{evt.djArtist}</strong></span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        ✨ {evt.vibe}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Passes From</div>
                        <div className="font-display text-base font-extrabold text-amber-300">
                          {formatPrice(evt.passes[0].priceInr, currency)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClubEvent(evt);
                          setSelectedPassIndex(0);
                          setPassCount(1);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/20"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Get Passes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: JOIN A PARTY (SOCIAL DINING & COMMUNITY TABLES) */}
        {(activeTab === 'all' || activeTab === 'join-party') && (
          <section id="join-party-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/15 pb-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Social Dining &amp; Table Sharing</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Join a Curated Social Party Table
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Never dine alone. Join verified dining tables hosted by creators, tech founders, wine lovers, and party hosts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHostTableModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-amber-300 bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>+ Host Your Own Table</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSocialTables.map((table) => {
                const spotsLeft = table.totalSeats - table.filledSeats;
                return (
                  <div
                    key={table.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/50 transition-all flex flex-col justify-between gap-4 shadow-xl group"
                  >
                    <div>
                      {/* Social Table Ambience Photo (Crystal Clear HD View) */}
                      <div className="relative aspect-[16/7] rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                        <SafeImage
                          src={table.coverImage}
                          alt={table.title}
                          fallbackTitle={table.title}
                          className="w-full h-full object-cover brightness-105 contrast-[1.03] group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxPhoto({
                              url: table.coverImage,
                              title: table.title,
                              subtitle: `${table.venueName}, ${table.city} · Hosted by ${table.hostName}`,
                              city: table.city,
                              badge: table.vibeTag,
                            });
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/85 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/40 backdrop-blur-md transition-all cursor-pointer shadow-md"
                          title="View Crystal-Clear HD Photo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                            {table.vibeTag}
                          </span>
                          <h3 className="font-display text-lg font-bold text-white mt-2 group-hover:text-amber-300 transition-colors">
                            {table.title}
                          </h3>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>{table.venueName}, {table.city}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-2 py-1 rounded-lg text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                        {table.description}
                      </p>

                      {/* Host Bio */}
                      <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                        <img
                          src={table.hostAvatar}
                          alt={table.hostName}
                          className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            <span>Hosted by {table.hostName}</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{table.hostBio}</div>
                        </div>
                      </div>

                      {/* Attendees Avatars */}
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-2 overflow-hidden">
                            {table.attendees.map((att, i) => (
                              <img
                                key={i}
                                src={att.avatar}
                                alt={att.name}
                                title={`${att.name} (${att.role})`}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover"
                              />
                            ))}
                          </div>
                          <span className="text-[11px] ml-1">
                            {table.filledSeats} guests joined
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-amber-300">
                          <Clock className="w-3 h-3" />
                          <span>{table.date} · {table.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Seat Share</div>
                        <div className="font-display text-base font-extrabold text-amber-300">
                          {formatPrice(table.costPerSeatInr, currency)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedSocialTable(table)}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Join This Party</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 6: MY VIP PASSES & BOOKINGS */}
        {(activeTab === 'all' || activeTab === 'my-passes') && (
          <section id="my-passes-section" className="space-y-6 pt-6 border-t border-amber-500/15">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Ticket className="w-4 h-4" />
                  <span>Personal Member Dashboard</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  My Active Dining Passes &amp; Tickets
                </h2>
              </div>
            </div>

            {userPasses.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
                <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold">No active passes yet.</p>
                <p className="text-xs text-slate-500 mt-1">Reserve a fine dining seat, club pass, or group party above to get your digital VIP ticket.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userPasses.map((pass) => (
                  <div
                    key={pass.id}
                    onClick={() => setActiveCreatedPass(pass)}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-400/40 hover:border-amber-400 transition-all cursor-pointer shadow-lg group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                          {pass.badge}
                        </span>
                        <h4 className="font-display text-base font-bold text-white mt-2 group-hover:text-amber-300 transition-colors">
                          {pass.title}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">{pass.venue} · {pass.city}</div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-1 rounded border border-amber-400/30">
                          {pass.id}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Date &amp; Time</span>
                        <span>{pass.date} · {pass.time}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Pass Details</span>
                        <span>{pass.guestsOrQty}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total: <strong className="text-amber-300">{formatPrice(pass.totalPaidInr, currency)}</strong></span>
                      <span className="text-amber-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View VIP Pass &amp; QR</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: RESTAURANT TABLE RESERVATION */}
      {/* ======================================================== */}
      {selectedVenueForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVenueForBooking(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                VIP Table Reservation
              </span>
              <h3 className="font-display text-2xl font-black text-white mt-1">
                {selectedVenueForBooking.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedVenueForBooking.neighborhood}, {selectedVenueForBooking.city} · Dress Code: <strong className="text-amber-300">{selectedVenueForBooking.dressCode}</strong>
              </p>
            </div>

            {/* Select Table Zone */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 block">
                Select Table Preference / Seating Zone
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedVenueForBooking.tableTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBookingTableType(t.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      bookingTableType === t.id
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{t.name}</span>
                      {t.extraFeeInr > 0 ? (
                        <span className="text-[10px] font-mono text-amber-400">+{formatPrice(t.extraFeeInr, currency)}</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold">Included</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                  Reservation Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                  Number of Guests
                </label>
                <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setBookingGuests((g) => Math.max(1, g - 1))}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-amber-400"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-xs text-white">
                    {bookingGuests} {bookingGuests === 1 ? 'Guest' : 'Guests'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBookingGuests((g) => Math.min(12, g + 1))}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-amber-400"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 block">
                Select Seating Time Slot
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedVenueForBooking.timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setBookingTime(slot)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      bookingTime === slot
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Occasion */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 block">
                Special Occasion
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Romantic Date', 'Birthday Celebration', 'Anniversary', 'Business Dinner', 'Casual Dine'].map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setBookingOccasion(occ)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      bookingOccasion === occ
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Guest Full Name</label>
                <input
                  type="text"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Mobile for SMS/WhatsApp Pass</label>
                <input
                  type="text"
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Guarantee Callout */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Booking Surcharge:</strong> Your table deposit is 100% credited toward your final food &amp; beverage bill at the restaurant.
              </span>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedVenueForBooking(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmTableBooking}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>Confirm VIP Table Reservation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: GOURMET CART DRAWER */}
      {/* ======================================================== */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md h-full bg-slate-900 border-l border-amber-500/30 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <h3 className="font-display text-lg font-bold text-white">Gourmet Order Tray</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cartItemDetails.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold">Your gourmet tray is empty.</p>
                  <p className="text-xs text-slate-500 mt-1">Explore our chef signature mains, caviar blinis &amp; craft cocktails above.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800 mt-4 space-y-3">
                  {cartItemDetails.map((item) => (
                    <div key={item.id} className="pt-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <div className="text-[10px] text-slate-400">{item.venueName}</div>
                        <div className="font-mono text-xs font-bold text-amber-300 mt-1">
                          {formatPrice(item.priceInr, currency)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleUpdateCart(item.id, -1)}
                          className="w-5 h-5 rounded bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCart(item.id, 1)}
                          className="w-5 h-5 rounded bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItemDetails.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                {/* Bill Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(cartSubtotalInr, currency)}</span>
                  </div>
                  <div className="flex justify-between text-amber-400 font-semibold">
                    <span>Dining Club VIP Privilege (20% Off)</span>
                    <span className="font-mono">-{formatPrice(cartDiscountInr, currency)}</span>
                  </div>
                  <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-slate-800">
                    <span>Grand Total</span>
                    <span className="font-mono text-amber-300">{formatPrice(cartTotalInr, currency)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmCartOrder}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm Pre-Order ({formatPrice(cartTotalInr, currency)})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: GROUP PARTY CUSTOMIZER */}
      {/* ======================================================== */}
      {selectedPartyPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setSelectedPartyPackage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Group Celebration Booking
              </span>
              <h3 className="font-display text-2xl font-black text-white mt-1">
                {selectedPartyPackage.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedPartyPackage.venueName} · {selectedPartyPackage.city}
              </p>
            </div>

            {/* Guest Count Slider */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Expected Guests Count:</span>
                <span className="font-black text-base text-amber-300 font-mono">
                  {partyGuestsCount} Guests
                </span>
              </div>
              <input
                type="range"
                min={selectedPartyPackage.minGuests}
                max={selectedPartyPackage.maxGuests}
                value={partyGuestsCount}
                onChange={(e) => setPartyGuestsCount(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Min: {selectedPartyPackage.minGuests}</span>
                <span>Max: {selectedPartyPackage.maxGuests}</span>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                Event / Party Date
              </label>
              <input
                type="date"
                value={partyDate}
                onChange={(e) => setPartyDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Beverage Package Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 block">
                Beverage Package Tier
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'standard', name: 'Standard Bar', sub: 'Beers & Wine' },
                  { id: 'premium', name: 'Ultra Premium', sub: '+ Champagne & Single Malts' },
                  { id: 'mocktail', name: 'Zero Proof', sub: 'Artisanal Mocktails' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setPartyBeverageTier(tier.id as any)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      partyBeverageTier === tier.id
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">{tier.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tier.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 block">
                Party Add-Ons &amp; Enhancements
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={partyAddButler}
                      onChange={(e) => setPartyAddButler(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span>Personal Butler &amp; Sommelier Service</span>
                  </div>
                  <span className="font-mono text-amber-400">+{formatPrice(3500, currency)}</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={partyAddCake}
                      onChange={(e) => setPartyAddCake(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span>Custom 3-Tier Gold Foil Celebration Cake</span>
                  </div>
                  <span className="font-mono text-amber-400">+{formatPrice(2500, currency)}</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={partyAddDJ}
                      onChange={(e) => setPartyAddDJ(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span>Live Saxophonist &amp; Sound System</span>
                  </div>
                  <span className="font-mono text-amber-400">+{formatPrice(8000, currency)}</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedPartyPackage(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmGroupParty}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Reserve Group Party Package</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CLUB TICKETS SELECTION */}
      {/* ======================================================== */}
      {selectedClubEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setSelectedClubEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                VIP Nightclub Access &amp; Passes
              </span>
              <h3 className="font-display text-2xl font-black text-white mt-1">
                {selectedClubEvent.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedClubEvent.clubName} · {selectedClubEvent.date}
              </p>
            </div>

            {/* Ticket Tier Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 block">
                Select VIP Pass Tier
              </label>
              <div className="space-y-2">
                {selectedClubEvent.passes.map((p, idx) => (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => setSelectedPassIndex(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPassIndex === idx
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{p.name}</span>
                      <span className="font-mono text-sm font-extrabold text-amber-300">
                        {formatPrice(p.priceInr, currency)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{p.perks}</div>
                    <div className="text-[10px] text-rose-400 font-bold mt-1">
                      Only {p.seatsLeft} passes remaining
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pass Count */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Quantity of Passes</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPassCount((c) => Math.max(1, c - 1))}
                  className="w-7 h-7 rounded bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm text-white px-2">{passCount}</span>
                <button
                  type="button"
                  onClick={() => setPassCount((c) => Math.min(6, c + 1))}
                  className="w-7 h-7 rounded bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedClubEvent(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmClubPass}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Get Digital Club Passes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: JOIN SOCIAL PARTY TABLE */}
      {/* ======================================================== */}
      {selectedSocialTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setSelectedSocialTable(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Join Social Dining Table
              </span>
              <h3 className="font-display text-2xl font-black text-white mt-1">
                {selectedSocialTable.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedSocialTable.venueName} · {selectedSocialTable.date} ({selectedSocialTable.time})
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={selectedSocialTable.hostAvatar}
                alt={selectedSocialTable.hostName}
                className="w-12 h-12 rounded-full object-cover border border-amber-400/50"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Host: {selectedSocialTable.hostName}</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{selectedSocialTable.hostBio}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Profession or Icebreaker Vibe</label>
                <input
                  type="text"
                  value={joinVibe}
                  onChange={(e) => setJoinVibe(e.target.value)}
                  placeholder="e.g. Architect, Foodie, Travel Blogger"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              🤝 <strong>Split Seat Guarantee:</strong> Includes chef tasting plates, wine pairing &amp; immediate access to the private table group chat.
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedSocialTable(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmJoinParty}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Reserve My Seat ({formatPrice(selectedSocialTable.costPerSeatInr, currency)})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: HOST A PARTY TABLE */}
      {/* ======================================================== */}
      {showHostTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateHostTable}
            className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowHostTableModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Community Host
              </span>
              <h3 className="font-display text-2xl font-black text-white mt-1">
                Host a Social Table / Party
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Invite fellow TripYehh members to join your table for dinner, rooftop drinks, or club night.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Table Title / Theme</label>
              <input
                type="text"
                required
                value={hostTitle}
                onChange={(e) => setHostTitle(e.target.value)}
                placeholder="e.g. Saturday Night Sunset Cocktails &amp; Deep House"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Select Venue</label>
              <select
                value={hostVenue}
                onChange={(e) => setHostVenue(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                {DINING_VENUES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Date</label>
                <input
                  type="date"
                  value={hostDate}
                  onChange={(e) => setHostDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Time</label>
                <input
                  type="text"
                  value={hostTime}
                  onChange={(e) => setHostTime(e.target.value)}
                  placeholder="08:30 PM"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Total Seats (Table Size)</label>
                <input
                  type="number"
                  min={4}
                  max={20}
                  value={hostSeats}
                  onChange={(e) => setHostSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Table Vibe</label>
                <input
                  type="text"
                  value={hostVibe}
                  onChange={(e) => setHostVibe(e.target.value)}
                  placeholder="e.g. Chill Drinks, Networking"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowHostTableModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Social Table</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: DIGITAL VIP PASS TICKET PREVIEW & QR */}
      {/* ======================================================== */}
      {activeCreatedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-400 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setActiveCreatedPass(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Brand Header */}
            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Crown className="w-3.5 h-3.5" />
                <span>TripYehh Dining Club VIP Pass</span>
              </div>
              <h3 className="font-display text-xl font-black text-white">
                {activeCreatedPass.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeCreatedPass.venue} · {activeCreatedPass.city}
              </p>
            </div>

            {/* Pass QR and Code Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-md">
                <QrCode className="w-28 h-28 text-slate-950" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Official Pass Reference</span>
                <div className="font-mono text-base font-black text-amber-300 tracking-wider">
                  {activeCreatedPass.id}
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block">Date &amp; Time</span>
                  <span className="font-semibold">{activeCreatedPass.date} ({activeCreatedPass.time})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Guests / Seats</span>
                  <span className="font-semibold">{activeCreatedPass.guestsOrQty}</span>
                </div>
              </div>

              <div className="text-left w-full text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                {activeCreatedPass.details}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(activeCreatedPass.id);
                  onNotify('Pass Reference Copied', `Reference ${activeCreatedPass.id} copied to clipboard.`, 'info');
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNotify('VIP Pass Saved', 'Pass saved to your TripYehh wallet & SMS dispatched.', 'success');
                  setActiveCreatedPass(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: ULTRA HIGH-DEFINITION CRYSTAL-CLEAR PHOTO VIEWER ("Saaf Saaf Photo") */}
      {/* ======================================================== */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-slate-900 border border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 p-4 sm:px-6 bg-slate-950/85 border-b border-amber-500/20">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shrink-0">
                  HD Visual
                </span>
                {lightboxPhoto.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-400/30 truncate">
                    {lightboxPhoto.badge}
                  </span>
                )}
                <h3 className="font-display text-sm sm:text-base font-bold text-white truncate">
                  {lightboxPhoto.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
                title="Close Photo Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Crystal Clear Photo Display */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain sm:object-cover brightness-105 contrast-[1.03] select-none"
              />
            </div>

            {/* Bottom Caption & Controls */}
            <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-white text-sm">{lightboxPhoto.title}</div>
                {lightboxPhoto.subtitle && (
                  <div className="text-slate-400 text-xs mt-0.5">{lightboxPhoto.subtitle}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.open(lightboxPhoto.url, '_blank');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Open Full Resolution</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxPhoto(null)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
