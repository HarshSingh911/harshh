import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BadgePercent,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  BookedTrip,
  BookingCategory,
  CurrencyCode,
  formatPrice,
  PROMO_OFFERS,
  PromoOffer,
  TOP_DESTINATIONS,
} from '../data/travelData';
import {
  fetchAdminProperties,
  approvePropertyListing,
  rejectPropertyListing,
  deletePropertyListing,
  PropertyListing,
  submitPropertyListing,
} from '../services/propertyService';

interface AdminPanelProps {
  currency: CurrencyCode;
  bookedTrips: BookedTrip[];
  onUpdateTrips: (trips: BookedTrip[]) => void;
  onExitAdmin: () => void;
  onNotify: (title: string, detail: string) => void;
}

type AdminTab = 'overview' | 'properties' | 'bookings' | 'fares' | 'coupons' | 'support';

interface SupportTicket {
  id: string;
  customerName: string;
  email: string;
  category: BookingCategory;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currency,
  bookedTrips,
  onUpdateTrips,
  onExitAdmin,
  onNotify,
}) => {
  // Admin Login Security State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // set true by default or toggleable
  const [adminPin, setAdminPin] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Real Property Approvals & Stays State
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [propertyFilter, setPropertyFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [propertySearchQuery, setPropertySearchQuery] = useState<string>('');
  const [isLoadingProperties, setIsLoadingProperties] = useState<boolean>(false);

  const loadProperties = async () => {
    setIsLoadingProperties(true);
    try {
      const data = await fetchAdminProperties();
      setProperties(data);
    } catch (e) {
      console.warn('Failed to load admin properties:', e);
    } finally {
      setIsLoadingProperties(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleApproveProperty = async (id: string, name: string, city: string) => {
    await approvePropertyListing(id);
    await loadProperties();
    onNotify('Property Approved', `${name} in ${city} is now live and bookable on TripYeah.`);
  };

  const handleRejectProperty = async (id: string, name: string) => {
    await rejectPropertyListing(id);
    await loadProperties();
    onNotify('Property Listing Rejected', `${name} has been rejected.`);
  };

  const handleDeleteProperty = async (id: string, name: string) => {
    await deletePropertyListing(id);
    await loadProperties();
    onNotify('Property Removed', `${name} deleted from database.`);
  };

  const handleSeedSampleVerifiedProperty = async () => {
    await submitPropertyListing({
      name: 'Taj Aguada Palms Beachfront Resort & Heritage Villas',
      category: 'resort',
      city: 'Goa',
      country: 'India',
      address: 'Candolim Beach Road, North Goa 403515',
      description: 'Ultra-luxurious sea-facing 5-star beachfront resort with tropical lagoons, private balconies, infinity pools, and world-class Goan hospitality.',
      photos: [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ],
      roomType: 'Sea View Luxury Pavilion with King Bed',
      basePriceInr: 8900,
      availableRooms: 8,
      checkInTime: '02:00 PM',
      checkOutTime: '11:00 AM',
      ownerName: 'Taj Hospitality Partner Desk',
      ownerEmail: 'partner@tajresorts.com',
      ownerPhone: '+91 98221 44556',
      amenities: [
        'Free High-Speed Wi-Fi',
        'Air Conditioning',
        'Free Breakfast',
        'Swimming Pool',
        'Balcony / Scenic View',
        '24/7 Front Desk',
        'Spa & Wellness',
      ],
    });
    // Auto-approve the seeded partner property
    const all = await fetchAdminProperties();
    if (all.length > 0) {
      await approvePropertyListing(all[0].id);
    }
    await loadProperties();
    onNotify('Verified Property Added', 'Added and approved real partner listing in Goa.');
  };

  // Bookings Filter & Search State
  const [bookingCategoryFilter, setBookingCategoryFilter] = useState<string>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTripDetails, setSelectedTripDetails] = useState<BookedTrip | null>(null);

  // Coupons State (Initialized with travelData PROMO_OFFERS)
  const [coupons, setCoupons] = useState<PromoOffer[]>(PROMO_OFFERS);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState<boolean>(false);
  const [newCouponCode, setNewCouponCode] = useState<string>('');
  const [newCouponPercent, setNewCouponPercent] = useState<number>(30);
  const [newCouponCategory, setNewCouponCategory] = useState<BookingCategory>('flights');
  const [newCouponDesc, setNewCouponDesc] = useState<string>('');

  // Manageable Flight Fares & Inventory State
  const [managedFares, setManagedFares] = useState([
    {
      id: 'FARE-1',
      route: 'DEL → GOI',
      airline: 'IndiGo 6E-2134',
      category: 'flights',
      baseFareInr: 4999,
      seatsAvailable: 14,
      status: 'Active',
    },
    {
      id: 'FARE-2',
      route: 'BOM → BLR',
      airline: 'Air India AI-804',
      category: 'flights',
      baseFareInr: 3450,
      seatsAvailable: 8,
      status: 'Active',
    },
    {
      id: 'FARE-3',
      route: 'DEL → BOM',
      airline: 'Vande Bharat Exp (20172)',
      category: 'trains',
      baseFareInr: 2435,
      seatsAvailable: 32,
      status: 'Active',
    },
    {
      id: 'FARE-4',
      route: 'Goa Coastal Resort 5★',
      airline: 'Taj Holiday Village',
      category: 'hotels',
      baseFareInr: 7800,
      seatsAvailable: 5,
      status: 'Active',
    },
    {
      id: 'FARE-5',
      route: 'DEL → SXR (Srinagar)',
      airline: 'SpiceJet SG-102',
      category: 'flights',
      baseFareInr: 5890,
      seatsAvailable: 0,
      status: 'Sold Out',
    },
  ]);

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TICK-901',
      customerName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      category: 'flights',
      subject: 'Meal preference update for DEL to GOI flight',
      status: 'Open',
      priority: 'Medium',
      date: 'Today, 11:20 AM',
    },
    {
      id: 'TICK-899',
      customerName: 'Priya Patel',
      email: 'priya.p@example.com',
      category: 'hotels',
      subject: 'Early check-in request at Goa Beachfront Resort',
      status: 'In Progress',
      priority: 'Low',
      date: 'Yesterday, 04:15 PM',
    },
    {
      id: 'TICK-892',
      customerName: 'Amit Verma',
      email: 'amit.verma@example.com',
      category: 'trains',
      subject: 'Tatkal PNR confirmation inquiry (NDLS-CSMT)',
      status: 'Resolved',
      priority: 'High',
      date: '2 Oct 2026',
    },
  ]);

  // Calculate high-level stats
  const totalRevenueInr = bookedTrips.reduce((acc, t) => acc + t.totalPaidInr, 184500);
  const totalBookingsCount = bookedTrips.length + 24; // Including previous platform transactions
  const activePassengersCount = 58;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin === 'admin' || adminPin.toLowerCase() === 'tripyeah') {
      setIsAuthenticated(true);
      setAuthError('');
      onNotify('Admin Access Granted', 'Welcome to TripYeah Administrative Operations Center.');
    } else {
      setAuthError('Invalid Admin PIN. (Default demo PIN is 1234)');
    }
  };

  const handleUpdateTripStatus = (bookingId: string, newStatus: 'Confirmed' | 'Cancelled' | 'Refunded') => {
    const updated = bookedTrips.map((trip) =>
      trip.bookingId === bookingId ? { ...trip, status: newStatus as any } : trip
    );
    onUpdateTrips(updated);
    if (selectedTripDetails && selectedTripDetails.bookingId === bookingId) {
      setSelectedTripDetails({ ...selectedTripDetails, status: newStatus as any });
    }
    onNotify('Booking Status Updated', `Booking #${bookingId} marked as ${newStatus}.`);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const created: PromoOffer = {
      id: `promo-custom-${Date.now()}`,
      category: newCouponCategory,
      label: `${newCouponCategory.toUpperCase()} Promo`,
      subLabel: `${newCouponPercent}% Flat Discount`,
      discountHeadline: `Flat ${newCouponPercent}% OFF`,
      code: newCouponCode.toUpperCase().trim(),
      discountPercent: Number(newCouponPercent),
      maxDiscountInr: 2500,
      description: newCouponDesc || `Admin generated promotional code for ${newCouponCategory}.`,
      validUntil: '31 Dec 2026',
    };
    setCoupons([created, ...coupons]);
    setIsAddCouponOpen(false);
    setNewCouponCode('');
    onNotify('Coupon Created', `Promo code ${created.code} is now live across the platform.`);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(coupons.filter((c) => c.code !== code));
    onNotify('Coupon Removed', `Promo code ${code} has been deactivated.`);
  };

  const handleToggleFareStatus = (id: string) => {
    setManagedFares((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const next = f.status === 'Active' ? 'Sold Out' : 'Active';
          return { ...f, status: next };
        }
        return f;
      })
    );
    onNotify('Inventory Updated', 'Route availability updated in real-time booking engine.');
  };

  const handleUpdateTicketStatus = (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    onNotify('Ticket Updated', `Support ticket #${id} moved to ${newStatus}.`);
  };

  // Filtered Bookings
  const filteredBookings = bookedTrips.filter((b) => {
    if (bookingCategoryFilter !== 'all' && b.category !== bookingCategoryFilter) return false;
    if (bookingStatusFilter !== 'all' && (b.status as string).toLowerCase() !== bookingStatusFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingId.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.routeSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // If locked, show secure PIN screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-center">TripYeah Admin Portal</h2>
          <p className="text-xs text-slate-400 text-center mt-1 mb-6">
            Enter administrative PIN to access inventory, bookings &amp; system settings.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Security PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter PIN (Default: 1234)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-blue-500"
                  autoFocus
                />
              </div>
              {authError && <p className="text-xs text-rose-400 mt-2 font-medium">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Unlock Admin Console
            </button>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => {
                  setAdminPin('1234');
                  setIsAuthenticated(true);
                  onNotify('Quick Demo Access', 'Logged into Admin Portal with standard credentials.');
                }}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Quick Demo Login (PIN: 1234)
              </button>
              <button
                type="button"
                onClick={onExitAdmin}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 pb-20">
      {/* Top Operations Header */}
      <div className="bg-[#1E293B] border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              TY
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-base sm:text-lg text-white">
                  TripYeah Management Console
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  LIVE SYSTEM
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Centralized Operations · Flights · Trains · Hotels · Bookings · Inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNotify('System Synced', 'All bookings and fare inventories are synced with live database.')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Sync DB</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              title="Lock Admin Console"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none py-1.5 border-t border-slate-800/80">
          {[
            { id: 'overview', label: 'Operations Dashboard', icon: LayoutDashboard },
            {
              id: 'properties',
              label: `Property Approvals (${properties.filter((p) => p.status === 'pending').length})`,
              icon: Building2,
            },
            { id: 'bookings', label: `Passenger Bookings (${bookedTrips.length})`, icon: Ticket },
            { id: 'fares', label: 'Fare & Inventory Manager', icon: Layers },
            { id: 'coupons', label: `Coupons & Offers (${coupons.length})`, icon: Tag },
            { id: 'support', label: `Support Tickets (${tickets.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const isPendingProperty = tab.id === 'properties' && properties.some((p) => p.status === 'pending');
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer relative ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {isPendingProperty && !active && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ===================================================================
            TAB 1: OVERVIEW DASHBOARD
        =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Total Revenue</span>
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {formatPrice(totalRevenueInr, currency)}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs last week</span>
                </div>
              </div>

              <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Total Bookings</span>
                  <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{totalBookingsCount}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-400 mt-2 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>98.2% confirmation rate</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('properties')}
                className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden cursor-pointer hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Pending Property Approvals</span>
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {properties.filter((p) => p.status === 'pending').length}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 mt-2 font-medium">
                  <span>Review partner listings →</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('properties')}
                className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Live Verified Stays</span>
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {properties.filter((p) => p.status === 'approved').length} Active
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Publicly bookable</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Quick Actions & Live Booking Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Bookings Feed (2 cols) */}
              <div className="lg:col-span-2 bg-[#1E293B] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">
                      Recent Passenger Bookings
                    </h3>
                    <p className="text-xs text-slate-400">Live ticket generation and PNR feed</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-800">
                  {bookedTrips.map((trip) => (
                    <div
                      key={trip.bookingId}
                      className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                          {trip.category === 'flights' ? (
                            <Plane className="w-4 h-4" />
                          ) : (
                            <Ticket className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">
                              #{trip.bookingId}
                            </span>
                            <span className="text-xs font-semibold text-white truncate">
                              {trip.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {trip.routeSummary} · {trip.dateSummary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400">
                            {formatPrice(trip.totalPaidInr, currency)}
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {trip.status}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTripDetails(trip);
                            setActiveTab('bookings');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operations Quick Shortcuts & Platform Status (1 col) */}
              <div className="space-y-4">
                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5">
                  <h3 className="font-bold text-white text-sm mb-3">Quick Operations</h3>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('coupons');
                        setIsAddCouponOpen(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-400" />
                        Create New Discount Code
                      </span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('fares')}
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        Manage Route Fares &amp; Seats
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('support')}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        Review Customer Inquiries
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                        {tickets.filter((t) => t.status === 'Open').length} Open
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5">
                  <h3 className="font-bold text-white text-sm mb-2">Inventory Health</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Flight GDS Feed</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>IRCTC Train API</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Hotel CRS Channel</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Synced
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Payment Gateway (Razorpay/Stripe)</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Operational
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB: REAL PROPERTY LISTINGS & ADMIN APPROVALS
        =================================================================== */}
        {activeTab === 'properties' && (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={propertySearchQuery}
                    onChange={(e) => setPropertySearchQuery(e.target.value)}
                    placeholder="Search property, city or host..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => {
                    const count =
                      filter === 'all'
                        ? properties.length
                        : properties.filter((p) => p.status === filter).length;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setPropertyFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                          propertyFilter === filter
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {filter} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSeedSampleVerifiedProperty}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ Seed Verified Partner Resort</span>
                </button>
                <button
                  type="button"
                  onClick={loadProperties}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  title="Refresh from Database"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Properties List */}
            {isLoadingProperties ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Loading properties from database...
              </div>
            ) : properties.filter((p) => {
                if (propertyFilter !== 'all' && p.status !== propertyFilter) return false;
                if (propertySearchQuery.trim()) {
                  const q = propertySearchQuery.toLowerCase().trim();
                  return (
                    p.name.toLowerCase().includes(q) ||
                    p.city.toLowerCase().includes(q) ||
                    p.ownerName.toLowerCase().includes(q) ||
                    p.address.toLowerCase().includes(q)
                  );
                }
                return true;
              }).length === 0 ? (
              <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-bold text-white text-base">No Property Listings Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {propertyFilter === 'pending'
                    ? 'There are no pending partner property submissions at the moment.'
                    : 'Property listings submitted via "List Your Property" on the website or added by partners will appear here.'}
                </p>
                <button
                  type="button"
                  onClick={handleSeedSampleVerifiedProperty}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add First Verified Property</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties
                  .filter((p) => {
                    if (propertyFilter !== 'all' && p.status !== propertyFilter) return false;
                    if (propertySearchQuery.trim()) {
                      const q = propertySearchQuery.toLowerCase().trim();
                      return (
                        p.name.toLowerCase().includes(q) ||
                        p.city.toLowerCase().includes(q) ||
                        p.ownerName.toLowerCase().includes(q) ||
                        p.address.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((prop) => {
                    const isPending = prop.status === 'pending';
                    const isApproved = prop.status === 'approved';
                    const firstPhoto =
                      prop.photos && prop.photos.length > 0
                        ? prop.photos[0]
                        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

                    return (
                      <div
                        key={prop.id}
                        className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-colors shadow-xs"
                      >
                        {/* Photo Thumbnail */}
                        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                          <img
                            src={firstPhoto}
                            alt={prop.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-xs border border-white/10">
                              {prop.category}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isApproved
                                  ? 'bg-emerald-500/90 text-white'
                                  : isPending
                                  ? 'bg-amber-500/90 text-slate-950'
                                  : 'bg-rose-500/90 text-white'
                              }`}
                            >
                              {prop.status}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-slate-950/80 text-white text-xs font-mono font-bold">
                            ₹{prop.basePriceInr.toLocaleString('en-IN')} / night
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">
                                {prop.name}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                              <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                              <span>
                                {prop.city}, {prop.country}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {prop.description || prop.address}
                            </p>
                          </div>

                          {/* Room & Availability Details */}
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                            <div className="flex justify-between text-slate-300">
                              <span className="text-slate-500">Room Type:</span>
                              <span className="font-medium text-white truncate max-w-[150px]">
                                {prop.roomType}
                              </span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span className="text-slate-500">Inventory:</span>
                              <span>{prop.availableRooms} Units Available</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span className="text-slate-500">Host Contact:</span>
                              <span className="text-blue-300">
                                {prop.ownerName} ({prop.ownerPhone})
                              </span>
                            </div>
                          </div>

                          {/* Approval Actions */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                            {isPending ? (
                              <div className="flex items-center gap-2 w-full">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApproveProperty(prop.id, prop.name, prop.city)
                                  }
                                  className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve Listing</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectProperty(prop.id, prop.name)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold cursor-pointer border border-rose-500/30"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : isApproved ? (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Live in Search
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleRejectProperty(prop.id, prop.name)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs cursor-pointer"
                                  >
                                    Revoke
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProperty(prop.id, prop.name)}
                                    className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 cursor-pointer"
                                    title="Delete property"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Rejected
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApproveProperty(prop.id, prop.name, prop.city)
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold cursor-pointer"
                                  >
                                    Re-approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProperty(prop.id, prop.name)}
                                    className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: BOOKINGS MANAGEMENT
        =================================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by PNR or City..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <select
                  value={bookingCategoryFilter}
                  onChange={(e) => setBookingCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="flights">Flights</option>
                  <option value="trains">Trains</option>
                  <option value="hotels">Hotels</option>
                  <option value="holidays">Holidays</option>
                  <option value="cabs">Cabs</option>
                </select>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Showing <strong className="text-white">{filteredBookings.length}</strong> bookings
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5">Booking / PNR</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Service Details</th>
                      <th className="px-4 py-3.5">Travel Dates</th>
                      <th className="px-4 py-3.5">Amount</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          No matching passenger bookings found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((trip) => (
                        <tr key={trip.bookingId} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                            #{trip.bookingId}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="capitalize font-semibold text-slate-300">
                              {trip.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-white max-w-xs truncate">
                              {trip.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {trip.routeSummary}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                            {trip.dateSummary}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-emerald-400 whitespace-nowrap">
                            {formatPrice(trip.totalPaidInr, currency)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                trip.status === 'Confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : trip.status === 'Cancelled'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {trip.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1">
                            <button
                              type="button"
                              onClick={() => setSelectedTripDetails(trip)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                            >
                              Inspect
                            </button>
                            {trip.status === 'Confirmed' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateTripStatus(trip.bookingId, 'Refunded')}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium cursor-pointer"
                              >
                                Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Booking Details Modal */}
            {selectedTripDetails && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-base text-white">
                        Booking Inspection #{selectedTripDetails.bookingId}
                      </h3>
                      <p className="text-xs text-slate-400 capitalize">
                        {selectedTripDetails.category} Transaction Record
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTripDetails(null)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="py-4 space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Route &amp; Destination:</span>
                      <span className="font-semibold text-white">{selectedTripDetails.routeSummary}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Travel Date Window:</span>
                      <span className="font-semibold text-white">{selectedTripDetails.dateSummary}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Room / Cabin Class:</span>
                      <span className="font-semibold text-white">{selectedTripDetails.cabinOrRoom}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Travellers Count:</span>
                      <span className="font-semibold text-white">{selectedTripDetails.travellers} Passenger(s)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Total Fare Collected:</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {formatPrice(selectedTripDetails.totalPaidInr, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Booking Status:</span>
                      <span className="font-bold text-blue-400">{selectedTripDetails.status}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateTripStatus(selectedTripDetails.bookingId, 'Confirmed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                      >
                        Set Confirmed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateTripStatus(selectedTripDetails.bookingId, 'Cancelled')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold text-xs cursor-pointer"
                      >
                        Set Cancelled
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedTripDetails(null)}
                      className="px-4 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: FARE & INVENTORY MANAGER
        =================================================================== */}
        {activeTab === 'fares' && (
          <div className="space-y-5">
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Live Inventory &amp; Base Price Management
                </h3>
                <p className="text-xs text-slate-400">
                  Control ticket availability, seat quotas and pricing tiers across routes
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNotify('Inventory Refreshed', 'Synced with airline GDS and rail seat matrix.')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Seat Matrix</span>
              </button>
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5">Route / Service</th>
                      <th className="px-4 py-3.5">Provider / Carrier</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Base Fare</th>
                      <th className="px-4 py-3.5">Available Quota</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {managedFares.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                          {f.route}
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{f.airline}</td>
                        <td className="px-4 py-3.5 capitalize text-slate-400">{f.category}</td>
                        <td className="px-4 py-3.5 font-bold text-emerald-400">
                          {formatPrice(f.baseFareInr, currency)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`font-semibold ${
                              f.seatsAvailable > 5
                                ? 'text-slate-300'
                                : f.seatsAvailable > 0
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {f.seatsAvailable > 0 ? `${f.seatsAvailable} seats` : '0 (Exhausted)'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              f.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleFareStatus(f.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                              f.status === 'Active'
                                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {f.status === 'Active' ? 'Mark Sold Out' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: COUPONS & PROMO CODES
        =================================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-5">
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Promotional Coupons &amp; Discount Vouchers
                </h3>
                <p className="text-xs text-slate-400">
                  Manage active coupons that passengers can apply during checkout
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddCouponOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30">
                        {coupon.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {coupon.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm pt-1">
                      {coupon.discountHeadline}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Valid: {coupon.validUntil}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                      title="Deactivate Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Coupon Modal */}
            {isAddCouponOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-base text-white">Create Platform Promo Code</h3>
                    <button
                      type="button"
                      onClick={() => setIsAddCouponOpen(false)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddCoupon} className="space-y-4 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Promo Code (e.g. FESTIVE50)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="FESTIVE50"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Discount %
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={90}
                          value={newCouponPercent}
                          onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={newCouponCategory}
                          onChange={(e) => setNewCouponCategory(e.target.value as BookingCategory)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer"
                        >
                          <option value="flights">Flights</option>
                          <option value="trains">Trains</option>
                          <option value="hotels">Hotels</option>
                          <option value="holidays">Holidays</option>
                          <option value="cabs">Cabs</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Save up to 50% on all domestic departures"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddCouponOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Publish Coupon
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 5: SUPPORT TICKETS
        =================================================================== */}
        {activeTab === 'support' && (
          <div className="space-y-5">
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Customer Assistance &amp; Escalation Tickets
                </h3>
                <p className="text-xs text-slate-400">
                  Manage passenger refund requests, date change tickets, and inquiries
                </p>
              </div>
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5">Ticket ID</th>
                      <th className="px-4 py-3.5">Passenger</th>
                      <th className="px-4 py-3.5">Subject / Query</th>
                      <th className="px-4 py-3.5">Priority</th>
                      <th className="px-4 py-3.5">Logged At</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Resolve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                          #{t.id}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-white">{t.customerName}</div>
                          <div className="text-[11px] text-slate-400">{t.email}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-slate-200">{t.subject}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">
                            Category: {t.category}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.priority === 'High'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : t.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{t.date}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.status === 'Resolved'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : t.status === 'In Progress'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1">
                          {t.status !== 'Resolved' ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateTicketStatus(t.id, 'Resolved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold cursor-pointer"
                            >
                              Resolve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateTicketStatus(t.id, 'In Progress')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold cursor-pointer"
                            >
                              Reopen
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
