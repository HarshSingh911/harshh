import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  CreditCard,
  DollarSign,
  Download,
  Edit2,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  HelpCircle,
  Hotel,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Palmtree,
  Phone,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
  TrainFront,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react';

// ============================================================================
// STANDALONE TRIPYEAH / MAKEMYTRIP-STYLE ADMIN & EXTRANET APPLICATION
// Paste this entire file into your new VS Code project's "src/App.tsx"
// Dependencies needed in new project: npm install lucide-react
// ============================================================================

export type BookingCategory = 'flights' | 'trains' | 'hotels' | 'buses' | 'cabs' | 'holidays';
export type BookingStatus = 'Confirmed' | 'Pending Verification' | 'Cancelled' | 'Refunded';

export interface PassengerBooking {
  pnr: string;
  category: BookingCategory;
  serviceTitle: string;
  route: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  travelDate: string;
  fareInr: number;
  paymentMode: string;
  status: BookingStatus;
  bookedAt: string;
  seatOrRoom: string;
}

export interface InventoryRoute {
  id: string;
  category: BookingCategory;
  serviceName: string;
  carrierOrHotel: string;
  route: string;
  baseFareInr: number;
  availableQuota: number;
  status: 'Active' | 'Sold Out' | 'Suspended';
}

export interface PromoCoupon {
  code: string;
  category: BookingCategory | 'all';
  discountPercent: number;
  maxDiscountInr: number;
  validUntil: string;
  usageCount: number;
  isActive: boolean;
}

export interface SupportTicket {
  id: string;
  passengerName: string;
  contact: string;
  category: BookingCategory;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

// Initial Mock Datasets
const INITIAL_BOOKINGS: PassengerBooking[] = [
  {
    pnr: 'TY-9021-DEL',
    category: 'flights',
    serviceTitle: 'IndiGo 6E-2134 (Non-stop)',
    route: 'New Delhi (DEL) → Goa (GOI)',
    passengerName: 'Rahul Sharma',
    passengerEmail: 'rahul.sharma@example.com',
    passengerPhone: '+91 98765 43210',
    travelDate: '18 Oct 2026',
    fareInr: 12450,
    paymentMode: 'UPI / Razorpay',
    status: 'Confirmed',
    bookedAt: 'Today, 08:30 AM',
    seatOrRoom: '12A, 12B (Economy)',
  },
  {
    pnr: 'TY-8842-BOM',
    category: 'trains',
    serviceTitle: 'Vande Bharat Express (20172)',
    route: 'New Delhi (NDLS) → Mumbai (CSMT)',
    passengerName: 'Ananya Deshmukh',
    passengerEmail: 'ananya.d@example.com',
    passengerPhone: '+91 98220 11223',
    travelDate: '20 Oct 2026',
    fareInr: 4870,
    paymentMode: 'HDFC Net Banking',
    status: 'Confirmed',
    bookedAt: 'Yesterday, 04:15 PM',
    seatOrRoom: 'Coach C2 - Seat 24, 25 (Executive Chair)',
  },
  {
    pnr: 'TY-7731-GOA',
    category: 'hotels',
    serviceTitle: 'Taj Holiday Village Resort & Spa 5★',
    route: 'Candolim, North Goa (3 Nights)',
    passengerName: 'Vikram & Sneha Singhal',
    passengerEmail: 'singhal.travels@example.com',
    passengerPhone: '+91 99100 88776',
    travelDate: '22 Oct – 25 Oct 2026',
    fareInr: 38500,
    paymentMode: 'Credit Card (Visa)',
    status: 'Confirmed',
    bookedAt: 'Yesterday, 01:20 PM',
    seatOrRoom: 'Sea View Luxury Villa (Breakfast Included)',
  },
  {
    pnr: 'TY-6519-DXB',
    category: 'holidays',
    serviceTitle: 'Dubai Skyline & Desert Safari 4N/5D',
    route: 'Delhi → Dubai (DXB) Package',
    passengerName: 'Kunal Mehra',
    passengerEmail: 'kunal.mehra@corporate.in',
    passengerPhone: '+91 94140 33445',
    travelDate: '01 Nov – 05 Nov 2026',
    fareInr: 72000,
    paymentMode: 'Corporate Card',
    status: 'Pending Verification',
    bookedAt: '2 days ago',
    seatOrRoom: 'Twin Sharing · 5★ Hotel + Flights Included',
  },
  {
    pnr: 'TY-5420-BLR',
    category: 'flights',
    serviceTitle: 'Air India AI-804',
    route: 'Mumbai (BOM) → Bengaluru (BLR)',
    passengerName: 'Rohan Joshi',
    passengerEmail: 'rohan.j@testmail.com',
    passengerPhone: '+91 97654 32190',
    travelDate: '15 Oct 2026',
    fareInr: 6200,
    paymentMode: 'UPI',
    status: 'Cancelled',
    bookedAt: '3 days ago',
    seatOrRoom: '14C (Economy)',
  },
];

const INITIAL_INVENTORY: InventoryRoute[] = [
  {
    id: 'INV-101',
    category: 'flights',
    serviceName: 'IndiGo 6E-2134 (Morning Departure)',
    carrierOrHotel: 'IndiGo Airlines',
    route: 'DEL → GOI',
    baseFareInr: 4999,
    availableQuota: 18,
    status: 'Active',
  },
  {
    id: 'INV-102',
    category: 'flights',
    serviceName: 'Air India AI-804 (Non-stop)',
    carrierOrHotel: 'Air India',
    route: 'BOM → BLR',
    baseFareInr: 3450,
    availableQuota: 8,
    status: 'Active',
  },
  {
    id: 'INV-103',
    category: 'trains',
    serviceName: 'Vande Bharat Express (20172)',
    carrierOrHotel: 'Indian Railways (IRCTC)',
    route: 'NDLS → CSMT',
    baseFareInr: 2435,
    availableQuota: 45,
    status: 'Active',
  },
  {
    id: 'INV-104',
    category: 'hotels',
    serviceName: 'Taj Holiday Village Resort & Spa',
    carrierOrHotel: 'IHCL / Taj Hotels',
    route: 'North Goa Coastal',
    baseFareInr: 8900,
    availableQuota: 4,
    status: 'Active',
  },
  {
    id: 'INV-105',
    category: 'holidays',
    serviceName: 'Bali Temple & Waterfalls 4N/5D Getaway',
    carrierOrHotel: 'TripYeah Curated Holidays',
    route: 'DPS (Bali, Indonesia)',
    baseFareInr: 26999,
    availableQuota: 12,
    status: 'Active',
  },
  {
    id: 'INV-106',
    category: 'flights',
    serviceName: 'SpiceJet SG-102 (Peak Hour)',
    carrierOrHotel: 'SpiceJet',
    route: 'DEL → SXR (Srinagar)',
    baseFareInr: 6490,
    availableQuota: 0,
    status: 'Sold Out',
  },
];

const INITIAL_COUPONS: PromoCoupon[] = [
  {
    code: 'TRIPYEAH40',
    category: 'flights',
    discountPercent: 40,
    maxDiscountInr: 2500,
    validUntil: '31 Dec 2026',
    usageCount: 1428,
    isActive: true,
  },
  {
    code: 'STAY60',
    category: 'hotels',
    discountPercent: 60,
    maxDiscountInr: 4000,
    validUntil: '15 Nov 2026',
    usageCount: 890,
    isActive: true,
  },
  {
    code: 'HOLIDAY50',
    category: 'holidays',
    discountPercent: 50,
    maxDiscountInr: 5000,
    validUntil: '31 Dec 2026',
    usageCount: 420,
    isActive: true,
  },
  {
    code: 'FESTIVE25',
    category: 'all',
    discountPercent: 25,
    maxDiscountInr: 1500,
    validUntil: '30 Nov 2026',
    usageCount: 2310,
    isActive: true,
  },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-881',
    passengerName: 'Rahul Sharma',
    contact: 'rahul.sharma@example.com',
    category: 'flights',
    subject: 'Seat modification request: Change from 12B to Window',
    priority: 'Medium',
    status: 'Open',
    createdAt: 'Today, 10:15 AM',
  },
  {
    id: 'TCK-879',
    passengerName: 'Rohan Joshi',
    contact: '+91 97654 32190',
    category: 'flights',
    subject: 'Refund status inquiry for cancelled BOM-BLR flight',
    priority: 'High',
    status: 'In Progress',
    createdAt: 'Yesterday, 03:40 PM',
  },
  {
    id: 'TCK-865',
    passengerName: 'Ananya Deshmukh',
    contact: 'ananya.d@example.com',
    category: 'trains',
    subject: 'Tatkal IRCTC confirmation confirmation receipt download',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2 days ago',
  },
];

export default function StandaloneAdminApp() {
  // Staff Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default true for instant preview
  const [staffEmail, setStaffEmail] = useState<string>('ops.admin@tripyeah.com');
  const [staffPassword, setStaffPassword] = useState<string>('');
  const [staffRole, setStaffRole] = useState<string>('Super Admin (All Operations)');
  const [loginError, setLoginError] = useState<string>('');

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'inventory' | 'coupons' | 'support'>('dashboard');

  // Bookings state & filters
  const [bookings, setBookings] = useState<PassengerBooking[]>(INITIAL_BOOKINGS);
  const [searchPnrQuery, setSearchPnrQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [inspectedBooking, setInspectedBooking] = useState<PassengerBooking | null>(null);

  // Inventory state
  const [inventory, setInventory] = useState<InventoryRoute[]>(INITIAL_INVENTORY);
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [editFareValue, setEditFareValue] = useState<number>(0);
  const [editQuotaValue, setEditQuotaValue] = useState<number>(0);

  // Coupons state
  const [coupons, setCoupons] = useState<PromoCoupon[]>(INITIAL_COUPONS);
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState<boolean>(false);
  const [newCouponCode, setNewCouponCode] = useState<string>('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(30);
  const [newCouponCategory, setNewCouponCategory] = useState<BookingCategory | 'all'>('flights');
  const [newCouponMaxInr, setNewCouponMaxInr] = useState<number>(2000);

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // System notification toast
  const [toastMessage, setToastMessage] = useState<string | null>('Connected to Central Operations Database (Real-time Sync Active)');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffPassword === 'admin' || staffPassword === '1234' || staffPassword === 'tripyeah') {
      setIsAuthenticated(true);
      setLoginError('');
      triggerToast('Authenticated as Staff Administrator.');
    } else {
      setLoginError('Incorrect Security PIN. (Default demo PIN is 1234)');
    }
  };

  // Booking actions
  const handleUpdateBookingStatus = (pnr: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.pnr === pnr ? { ...b, status: newStatus } : b))
    );
    if (inspectedBooking && inspectedBooking.pnr === pnr) {
      setInspectedBooking({ ...inspectedBooking, status: newStatus });
    }
    triggerToast(`Booking #${pnr} marked as ${newStatus}.`);
  };

  // Inventory updates
  const handleSaveInventory = (id: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              baseFareInr: Number(editFareValue),
              availableQuota: Number(editQuotaValue),
              status: Number(editQuotaValue) === 0 ? 'Sold Out' : 'Active',
            }
          : item
      )
    );
    setEditingInventoryId(null);
    triggerToast('Inventory and Base Fare updated in real-time booking engine.');
  };

  // Coupon actions
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newCoupon: PromoCoupon = {
      code: newCouponCode.toUpperCase().trim(),
      category: newCouponCategory,
      discountPercent: Number(newCouponDiscount),
      maxDiscountInr: Number(newCouponMaxInr),
      validUntil: '31 Dec 2026',
      usageCount: 0,
      isActive: true,
    };
    setCoupons([newCoupon, ...coupons]);
    setIsNewCouponModalOpen(false);
    setNewCouponCode('');
    triggerToast(`Promo code ${newCoupon.code} published live.`);
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
    triggerToast(`Promo status toggled for ${code}.`);
  };

  // Filtered Bookings calculation
  const filteredBookings = bookings.filter((b) => {
    if (selectedCategoryFilter !== 'all' && b.category !== selectedCategoryFilter) return false;
    if (selectedStatusFilter !== 'all' && b.status.toLowerCase() !== selectedStatusFilter.toLowerCase()) return false;
    if (searchPnrQuery) {
      const q = searchPnrQuery.toLowerCase();
      return (
        b.pnr.toLowerCase().includes(q) ||
        b.passengerName.toLowerCase().includes(q) ||
        b.route.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Gross Merchandise Value
  const totalGmvInr = bookings.reduce((sum, b) => (b.status !== 'Cancelled' ? sum + b.fareInr : sum), 134020);
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  // ==========================================================================
  // VIEW 1: ENTERPRISE CORPORATE LOGIN (When not authenticated)
  // ==========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="w-full max-w-md bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">TripYeah Extranet</h1>
            <p className="text-xs text-slate-400 mt-1">
              Central Operations · Airline GDS Desk · IRCTC &amp; Hotel Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Corporate ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Department / Role
              </label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs cursor-pointer focus:outline-hidden focus:border-blue-500"
              >
                <option value="Super Admin (All Operations)">Super Admin (All Operations)</option>
                <option value="Flight Desk Officer">Flight GDS &amp; Ticketing Desk</option>
                <option value="Hotel Extranet Partner">Hotel Extranet &amp; Stays Desk</option>
                <option value="Refund & Finance Ops">Refund &amp; Finance Accounts</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Security Passcode / PIN
                </label>
                <span className="text-[11px] text-blue-400 font-mono">Demo: 1234</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter Passcode (1234)"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  autoFocus
                />
              </div>
              {loginError && <p className="text-xs text-rose-400 font-medium mt-1.5">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer mt-2"
            >
              Sign In to Operations Console
            </button>

            <button
              type="button"
              onClick={() => {
                setStaffPassword('1234');
                setIsAuthenticated(true);
                triggerToast('Authenticated via Quick Demo Bypass.');
              }}
              className="w-full text-center text-xs text-blue-400 hover:text-blue-300 py-1 cursor-pointer"
            >
              One-Click Staff Demo Login
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
            Protected by TripYeah Enterprise Single Sign-On (SSO) &amp; ISO 27001 TLS Encryption.
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: FULL STANDALONE OPERATIONS DESK (MakeMyTrip Partner & Admin Style)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-800 border border-blue-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Operations Bar */}
      <header className="bg-[#10172A] border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              TY
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                  TripYeah Extranet &amp; Admin
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  SYSTEM ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                MakeMyTrip-grade central ticketing, PNR verification &amp; fare matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Logged as:</span>
              <span className="text-white font-semibold">{staffRole.split(' ')[0]} Admin</span>
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Real-time database records refreshed.')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 border-t border-slate-800/80">
          {[
            { id: 'dashboard', label: 'Operations Overview', icon: LayoutDashboard },
            { id: 'bookings', label: `Passenger Bookings (${bookings.length})`, icon: Ticket },
            { id: 'inventory', label: 'Route Fares & Seat Quota', icon: Layers },
            { id: 'coupons', label: `Promotional Coupons (${coupons.length})`, icon: Tag },
            { id: 'support', label: `Escalations & Tickets (${supportTickets.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* ===================================================================
            TAB 1: OPERATIONS DASHBOARD
        =================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stat KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Gross Ticket Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  ₹{totalGmvInr.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+24.6% this week</span>
                </div>
              </div>

              <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Confirmed PNRs</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{confirmedCount} Tickets</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  <span>100% digital boarding issuance</span>
                </div>
              </div>

              <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Managed Routes</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{inventory.length} Active Feeds</div>
                <div className="text-[11px] text-indigo-400 mt-2 font-medium">
                  <span>Flights, IRCTC &amp; Hotels</span>
                </div>
              </div>

              <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Active Promo Coupons</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {coupons.filter((c) => c.isActive).length} Live Codes
                </div>
                <div className="text-[11px] text-amber-400 mt-2 font-semibold">
                  <span>Up to 60% discounts</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Bookings Feed (2 cols) */}
              <div className="lg:col-span-2 bg-[#12192C] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base">Live PNR Feed</h3>
                    <p className="text-xs text-slate-400">Direct booking stream from customer web platform</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Bookings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-800">
                  {bookings.map((b) => (
                    <div
                      key={b.pnr}
                      className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                          {b.category === 'flights' ? (
                            <Plane className="w-4 h-4" />
                          ) : b.category === 'trains' ? (
                            <TrainFront className="w-4 h-4" />
                          ) : (
                            <Hotel className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">#{b.pnr}</span>
                            <span className="text-xs font-semibold text-white truncate">{b.passengerName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {b.route} · {b.serviceTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400">
                            ₹{b.fareInr.toLocaleString('en-IN')}
                          </div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : b.status === 'Cancelled'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setInspectedBooking(b);
                            setActiveTab('bookings');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                          title="Inspect PNR Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operations Control Panel (1 col) */}
              <div className="space-y-4">
                <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5">
                  <h3 className="font-bold text-white text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('coupons');
                        setIsNewCouponModalOpen(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-400" />
                        Create Discount Code
                      </span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('inventory')}
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        Modify Dynamic Fares
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('support')}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        Support Escalation Queue
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                        {supportTickets.filter((t) => t.status === 'Open').length} Open
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5">
                  <h3 className="font-bold text-white text-sm mb-3">Live Service Gateways</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Sabre / Amadeus Flight GDS</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 99.9% Uptime
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>CRIS / IRCTC Rail Gateway</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Razorpay &amp; Stripe Gateways</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: PASSENGER BOOKINGS & PNR MANAGEMENT
        =================================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by PNR, Name, Route..."
                    value={searchPnrQuery}
                    onChange={(e) => setSearchPnrQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="flights">Flights</option>
                  <option value="trains">Trains</option>
                  <option value="hotels">Hotels</option>
                  <option value="holidays">Holidays</option>
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending verification">Pending Verification</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Found <strong className="text-white">{filteredBookings.length}</strong> matching records
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#12192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D1424] border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">PNR / Ref</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Passenger Details</th>
                      <th className="px-4 py-3.5">Service &amp; Route</th>
                      <th className="px-4 py-3.5">Travel Date</th>
                      <th className="px-4 py-3.5">Fare Paid</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredBookings.map((b) => (
                      <tr key={b.pnr} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                          #{b.pnr}
                        </td>
                        <td className="px-4 py-3.5 capitalize font-semibold text-slate-300 whitespace-nowrap">
                          {b.category}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-white">{b.passengerName}</div>
                          <div className="text-[11px] text-slate-400">{b.passengerPhone}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-slate-200">{b.serviceTitle}</div>
                          <div className="text-[11px] text-slate-400">{b.route}</div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">{b.travelDate}</td>
                        <td className="px-4 py-3.5 font-bold text-emerald-400 whitespace-nowrap">
                          ₹{b.fareInr.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : b.status === 'Cancelled'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : b.status === 'Refunded'
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectedBooking(b)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                          >
                            Inspect
                          </button>
                          {b.status === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(b.pnr, 'Refunded')}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold cursor-pointer"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inspect PNR Modal */}
            {inspectedBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
                <div className="w-full max-w-lg bg-[#12192C] border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-base text-white">
                        PNR Record: #{inspectedBooking.pnr}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {inspectedBooking.serviceTitle} · {inspectedBooking.bookedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInspectedBooking(null)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="py-4 space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Passenger Lead:</span>
                      <span className="font-semibold text-white">{inspectedBooking.passengerName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Contact Email:</span>
                      <span className="font-mono text-white">{inspectedBooking.passengerEmail}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Contact Phone:</span>
                      <span className="font-mono text-white">{inspectedBooking.passengerPhone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Route &amp; Travel Date:</span>
                      <span className="font-semibold text-white">{inspectedBooking.route} ({inspectedBooking.travelDate})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Seat / Room Allocation:</span>
                      <span className="font-semibold text-sky-400">{inspectedBooking.seatOrRoom}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Payment Channel:</span>
                      <span className="font-semibold text-white">{inspectedBooking.paymentMode}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Total Collected Fare:</span>
                      <span className="font-bold text-emerald-400 text-sm">₹{inspectedBooking.fareInr.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Current PNR Status:</span>
                      <span className="font-bold text-blue-400">{inspectedBooking.status}</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(inspectedBooking.pnr, 'Confirmed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                      >
                        Set Confirmed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(inspectedBooking.pnr, 'Cancelled')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold text-xs cursor-pointer"
                      >
                        Cancel Ticket
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(inspectedBooking.pnr, 'Refunded')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-xs cursor-pointer"
                      >
                        Issue Refund
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectedBooking(null)}
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
            TAB 3: ROUTE FARES & SEAT QUOTA (Dynamic Inventory)
        =================================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">Route Fares &amp; Seat Inventory</h3>
                <p className="text-xs text-slate-400">
                  Direct control of flight base fares, IRCTC quotas, and resort room rates
                </p>
              </div>

              <button
                type="button"
                onClick={() => triggerToast('Synced with Sabre & Amadeus central quota feeds.')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync GDS Feed</span>
              </button>
            </div>

            <div className="bg-[#12192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D1424] border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Route</th>
                      <th className="px-4 py-3.5">Service / Carrier</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Base Fare (₹)</th>
                      <th className="px-4 py-3.5">Seat / Room Quota</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Edit Quota / Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inventory.map((item) => {
                      const isEditing = editingInventoryId === item.id;
                      return (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                            {item.route}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-200">{item.serviceName}</div>
                            <div className="text-[11px] text-slate-400">{item.carrierOrHotel}</div>
                          </td>
                          <td className="px-4 py-3.5 capitalize text-slate-300 font-medium whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editFareValue}
                                onChange={(e) => setEditFareValue(Number(e.target.value))}
                                className="w-24 px-2 py-1 rounded bg-[#090D16] border border-blue-500 text-white font-bold"
                              />
                            ) : (
                              <span className="font-bold text-emerald-400">
                                ₹{item.baseFareInr.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editQuotaValue}
                                onChange={(e) => setEditQuotaValue(Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded bg-[#090D16] border border-blue-500 text-white font-bold"
                              />
                            ) : (
                              <span
                                className={`font-semibold ${
                                  item.availableQuota > 5
                                    ? 'text-slate-200'
                                    : item.availableQuota > 0
                                    ? 'text-amber-400'
                                    : 'text-rose-400'
                                }`}
                              >
                                {item.availableQuota > 0 ? `${item.availableQuota} available` : '0 (Sold Out)'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                item.status === 'Active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveInventory(item.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingInventoryId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingInventoryId(item.id);
                                  setEditFareValue(item.baseFareInr);
                                  setEditQuotaValue(item.availableQuota);
                                }}
                                className="px-3 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-semibold cursor-pointer"
                              >
                                Modify Fare
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: COUPONS & DISCOUNT ENGINE
        =================================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">Promotional Coupons &amp; Discount Vouchers</h3>
                <p className="text-xs text-slate-400">
                  Create and manage promo codes that users can apply on checkout
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewCouponModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="bg-[#12192C] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30">
                        {coupon.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          coupon.isActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base mt-2.5">
                      {coupon.discountPercent}% Flat Off
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Category: <span className="capitalize text-slate-200">{coupon.category}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Max Cap: ₹{coupon.maxDiscountInr.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Redeemed {coupon.usageCount} times · Valid till {coupon.validUntil}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(coupon.code)}
                      className="text-xs text-blue-400 hover:underline cursor-pointer"
                    >
                      {coupon.isActive ? 'Disable Code' : 'Enable Code'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCoupons(coupons.filter((c) => c.code !== coupon.code));
                        triggerToast(`Deleted coupon ${coupon.code}.`);
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Coupon Modal */}
            {isNewCouponModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
                <div className="w-full max-w-md bg-[#12192C] border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-base text-white">Publish New Promo Code</h3>
                    <button
                      type="button"
                      onClick={() => setIsNewCouponModalOpen(false)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="space-y-3.5 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Promo Code Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FESTIVE50"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs font-mono uppercase"
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
                          value={newCouponDiscount}
                          onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Max Limit (₹)
                        </label>
                        <input
                          type="number"
                          value={newCouponMaxInr}
                          onChange={(e) => setNewCouponMaxInr(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Applies To Category
                      </label>
                      <select
                        value={newCouponCategory}
                        onChange={(e) => setNewCouponCategory(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-xs cursor-pointer"
                      >
                        <option value="all">All Services</option>
                        <option value="flights">Flights Only</option>
                        <option value="hotels">Hotels Only</option>
                        <option value="holidays">Holidays Only</option>
                        <option value="trains">Trains Only</option>
                      </select>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsNewCouponModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
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
            TAB 5: ESCALATIONS & TICKETS
        =================================================================== */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="bg-[#12192C] border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-white text-base">Customer Support Escalation Queue</h3>
              <p className="text-xs text-slate-400">
                Handle cancellation requests, seat reassignments, and refund queries
              </p>
            </div>

            <div className="bg-[#12192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D1424] border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Ticket ID</th>
                      <th className="px-4 py-3.5">Passenger</th>
                      <th className="px-4 py-3.5">Subject &amp; Service</th>
                      <th className="px-4 py-3.5">Priority</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {supportTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                          #{t.id}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-white">{t.passengerName}</div>
                          <div className="text-[11px] text-slate-400">{t.contact}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-slate-200">{t.subject}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">
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
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          {t.status !== 'Resolved' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSupportTickets((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id ? { ...item, status: 'Resolved' } : item
                                  )
                                );
                                triggerToast(`Ticket #${t.id} marked as Resolved.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold cursor-pointer"
                            >
                              Resolve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSupportTickets((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id ? { ...item, status: 'In Progress' } : item
                                  )
                                );
                                triggerToast(`Ticket #${t.id} reopened.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 cursor-pointer"
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
      </main>
    </div>
  );
}
