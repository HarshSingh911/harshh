import React, { useState, useMemo, useEffect } from 'react';
import {
  Plane,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  Plus,
  Trash2,
  Tag,
  CreditCard,
  QrCode,
  Sparkles,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  FileText,
  Share2,
  Printer,
  X,
  ExternalLink,
  Lock,
  Luggage,
  Utensils,
  Car,
  Building2,
  Check,
  Gift,
  Zap,
} from 'lucide-react';
import { BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';
import { TripDatePickerModal } from './TripDatePickerModal';

interface FlightBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
}

export interface FlightPassenger {
  id: string;
  title: 'Mr' | 'Mrs' | 'Ms';
  firstName: string;
  lastName: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Others';
  frequentFlyerNo?: string;
  wheelchair: boolean;
}

const TITLE_OPTIONS = [
  { value: 'Mr', label: 'Mr', desc: 'Adult Male' },
  { value: 'Mrs', label: 'Mrs', desc: 'Adult Female' },
  { value: 'Ms', label: 'Ms', desc: 'Adult Female' },
];

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Others', label: 'Others' },
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
];

interface FlightCoupon {
  code: string;
  title: string;
  detail: string;
  category: 'all' | 'bank' | 'addons';
  discountInr: number;
  bankName?: string;
}

const FLIGHT_COUPONS: FlightCoupon[] = [
  {
    code: 'FLYYEAH',
    title: 'Flat ₹500 Instant Off',
    detail: 'Applicable on all domestic flight bookings with no minimum fare',
    category: 'all',
    discountInr: 500,
  },
  {
    code: 'HDFCSPECIAL',
    title: 'Flat ₹1,200 Off (HDFC)',
    detail: 'Instant discount using HDFC Bank Credit & Debit Cards',
    category: 'bank',
    discountInr: 1200,
    bankName: 'HDFC Bank',
  },
  {
    code: 'ICICISAVER',
    title: 'Flat ₹850 Off (ICICI)',
    detail: 'Instant savings on ICICI Bank NetBanking & Cards',
    category: 'bank',
    discountInr: 850,
    bankName: 'ICICI Bank',
  },
  {
    code: 'AXISFLY',
    title: 'Flat ₹1,000 Cashback (Axis)',
    detail: 'Direct statement cashback on Axis Bank Credit Cards',
    category: 'bank',
    discountInr: 1000,
    bankName: 'Axis Bank',
  },
  {
    code: 'MEALFREE',
    title: 'Free ₹250 Meal Waiver',
    detail: 'Get ₹250 off on in-flight meals and hot beverage selection',
    category: 'addons',
    discountInr: 250,
  },
];

export const FlightBookingCheckoutPage: React.FC<FlightBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
}) => {
  // Flight Info & Roundtrip Detection
  const isRoundTripFlight = Boolean(
    item.isRoundTrip === true ||
    (item.isRoundTrip !== false &&
      Boolean(
        item.returnFlight ||
        (item.flightNo?.includes('+') && item.airline?.includes('+')) ||
        (item.title?.includes('+') && item.depTime?.includes('/'))
      ))
  );

  const outboundAirline = item.outboundFlight?.airline || (item.airline?.includes('+') ? item.airline.split('+')[0].trim() : (item.airline || 'IndiGo'));
  const outboundFlightNo = item.outboundFlight?.flightNo || (item.flightNo?.includes('+') ? item.flightNo.split('+')[0].trim() : (item.flightNo || item.code || '6E-2134'));
  const outboundDepTime = item.outboundFlight?.depTime || (item.depTime?.includes('/') ? item.depTime.split('/')[0].replace('(Out)', '').trim() : (item.depTime || '06:15'));
  const outboundArrTime = item.outboundFlight?.arrTime || (item.arrTime?.includes('/') ? item.arrTime.split('/')[0].trim() : (item.arrTime || '08:30'));
  const outboundDuration = item.outboundFlight?.duration || (item.duration?.includes('·') ? item.duration.split('·')[0].replace('Out:', '').trim() : (item.duration || '2h 15m'));
  const outboundDate = item.travelDate || '18 Oct 2026';
  const outboundTier = item.outboundTierName || (item.roomType?.includes('·') ? item.roomType.split('·')[0].replace('Out:', '').trim() : (item.roomType || 'Flexi Plus'));

  const returnAirline = item.returnFlight?.airline || (item.airline?.includes('+') ? item.airline.split('+')[1].trim() : 'SpiceJet');
  const returnFlightNo = item.returnFlight?.flightNo || (item.flightNo?.includes('+') ? item.flightNo.split('+')[1].trim() : 'SG-8169');
  const returnDepTime = item.returnFlight?.depTime || (item.depTime?.includes('/') ? item.depTime.split('/')[1].replace('(Ret)', '').trim() : '19:40');
  const returnArrTime = item.returnFlight?.arrTime || (item.arrTime?.includes('/') ? item.arrTime.split('/')[1].trim() : '21:55');
  const returnDuration = item.returnFlight?.duration || (item.duration?.includes('·') ? item.duration.split('·')[1].replace('Ret:', '').trim() : (item.duration || '2h 15m'));
  const returnDate = item.returnDate || '22 Oct 2026';
  const returnTier = item.returnTierName || (item.roomType?.includes('·') ? item.roomType.split('·')[1].replace('Ret:', '').trim() : 'Saver');

  // One-way fallbacks
  const airline = item.airline || outboundAirline;
  const flightNo = item.flightNo || outboundFlightNo;
  const fromCity = item.fromCity || 'New Delhi (DEL)';
  const toCity = item.toCity || 'Goa (GOI)';
  const depTime = item.depTime?.split(' ')[0] || outboundDepTime;
  const arrTime = item.arrTime?.split(' ')[0] || outboundArrTime;
  const duration = item.duration || outboundDuration;
  const travelDate = item.travelDate || outboundDate;
  const pricePerPax = item.priceInr || 4850;
  const cabinClass = item.cabinClass || 'Economy';
  const fareCategory = item.roomType || outboundTier;

  // 1. Dynamic Passengers (Starts with item.travellers or 1)
  const initialPaxCount = Math.max(1, item.travellers || 1);
  const [passengers, setPassengers] = useState<FlightPassenger[]>(() => {
    const list: FlightPassenger[] = [
      {
        id: 'pax-1',
        title: 'Mr',
        firstName: '',
        lastName: '',
        age: '',
        gender: 'Male',
        frequentFlyerNo: '',
        wheelchair: false,
      },
    ];
    for (let i = 2; i <= initialPaxCount; i++) {
      list.push({
        id: `pax-${i}`,
        title: i % 2 === 0 ? 'Mrs' : 'Mr',
        firstName: '',
        lastName: '',
        age: '',
        gender: i % 2 === 0 ? 'Female' : 'Male',
        frequentFlyerNo: '',
        wheelchair: false,
      });
    }
    return list;
  });

  // 2. Extra Baggage Selection (Separate for Outbound and Return when Round-Trip)
  const [extraBaggageKg, setExtraBaggageKg] = useState<number>(0);
  const [extraBaggageOutboundKg, setExtraBaggageOutboundKg] = useState<number>(0);
  const [extraBaggageReturnKg, setExtraBaggageReturnKg] = useState<number>(0);

  // 3. Travel Protection & Flexible Booking (Removed as per user request)
  const freeDateChangeProtect = false;
  const tripInsurance = false;

  // 4. In-Flight Seat Selection (Rows 1-15)
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['12A']);

  // 5. In-Flight Meals Add-on (Removed as per user request)
  const mealCost = 0;

  // 6. Airport Cab Transfer Add-on
  const [airportCabType, setAirportCabType] = useState<'none' | 'sedan' | 'suv'>('none');

  // 7. Priority Services (Check-in + Fast Baggage)
  const [priorityServices, setPriorityServices] = useState<boolean>(false);

  // 8. Destination Hotel Deal
  const [destinationHotelDeal, setDestinationHotelDeal] = useState<boolean>(false);

  // 9. Contact Details
  const [email, setEmail] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

  // 10. GST Billing
  const [hasGst, setHasGst] = useState<boolean>(false);
  const [gstNumber, setGstNumber] = useState<string>('');
  const [gstCompanyName, setGstCompanyName] = useState<string>('');
  const [gstState, setGstState] = useState<string>('Delhi');

  // 11. Coupons & Bank Offers
  const [activeOfferTab, setActiveOfferTab] = useState<'all' | 'bank' | 'addons'>('all');
  const [customCouponInput, setCustomCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('FLYYEAH');

  // 12. Accordions & Modals
  const [expandedSection, setExpandedSection] = useState<'cancellation' | 'advisory' | null>('cancellation');
  const [showSeatMapModal, setShowSeatMapModal] = useState<boolean>(false);
  const [showFareRulesModal, setShowFareRulesModal] = useState<boolean>(false);
  const [fareRulesTab, setFareRulesTab] = useState<'cancellation' | 'dateChange'>('cancellation');

  // 13. Payment & Confirmation
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookedTrip | null>(null);

  // Travel Date & Calendar State (Replaces countdown timer)
  const [flightTravelDate, setFlightTravelDate] = useState<string>(travelDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Custom Popover Dropdown State for Passenger Title & Gender (matches frontpage)
  const [openPaxDropdown, setOpenPaxDropdown] = useState<string | null>(null);

  // Close custom dropdown on outside click
  useEffect(() => {
    if (!openPaxDropdown) return;
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-pax-dropdown]')) return;
      setOpenPaxDropdown(null);
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleDocClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleDocClick);
    };
  }, [openPaxDropdown]);

  // --- Dynamic Pricing Calculations ---
  const paxCount = passengers.length;
  const baseFlightFare = pricePerPax * paxCount;
  const taxesAndAviationFees = (paxCount * 820); // Aviation security, passenger service fee & GST

  // Extra Baggage Cost
  const extraBaggagePriceMap: Record<number, number> = {
    0: 0,
    3: 1350,
    5: 1950,
    10: 3750,
    15: 5400,
  };
  const extraBaggageCost = isRoundTripFlight
    ? ((extraBaggagePriceMap[extraBaggageOutboundKg] || 0) + (extraBaggagePriceMap[extraBaggageReturnKg] || 0)) * paxCount
    : (extraBaggagePriceMap[extraBaggageKg] || 0) * paxCount;

  // Seat Selection Cost (0 as allocated seats block is removed)
  const seatCost = 0;

  // Travel Protection & Flexible Date Change (Removed as per user request)
  const dateChangeProtectCost = 0;
  const tripInsuranceCost = 0;

  // Cab Cost
  const cabCost = airportCabType === 'sedan' ? 850 : airportCabType === 'suv' ? 1400 : 0;

  // Priority Services Cost
  const priorityServicesCost = priorityServices ? 399 * paxCount : 0;

  // Hotel Deal Cost
  const hotelDealCost = destinationHotelDeal ? 1999 : 0;

  // Total Additional Services
  const totalAdditionalServices =
    extraBaggageCost +
    seatCost +
    mealCost +
    dateChangeProtectCost +
    tripInsuranceCost +
    cabCost +
    priorityServicesCost +
    hotelDealCost;

  // Coupon Discount
  let couponDiscount = 0;
  const currentCouponObj = FLIGHT_COUPONS.find((c) => c.code === appliedCoupon);
  if (currentCouponObj) {
    couponDiscount = currentCouponObj.discountInr;
  }

  const totalPayableInr = Math.max(
    0,
    Math.round(baseFlightFare + taxesAndAviationFees + totalAdditionalServices - couponDiscount)
  );

  // --- Passenger Handlers ---
  const handleAddPassenger = () => {
    if (passengers.length >= 9) {
      onNotify('Limit Reached', 'Maximum 9 passengers allowed per commercial airline booking.', 'info');
      return;
    }
    const newPassenger: FlightPassenger = {
      id: `pax-${Date.now()}`,
      title: 'Mr',
      firstName: '',
      lastName: '',
      age: '',
      gender: 'Male',
      frequentFlyerNo: '',
      wheelchair: false,
    };
    setPassengers([...passengers, newPassenger]);
    // Also allocate default next seat
    setSelectedSeats([...selectedSeats, `${12 + passengers.length}B`]);
    onNotify('Passenger Added', `Passenger ${passengers.length + 1} added. Fare updated dynamically.`, 'success');
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length === 1) {
      onNotify('Action Denied', 'At least 1 passenger is required to book a flight.', 'info');
      return;
    }
    setPassengers(passengers.filter((p) => p.id !== id));
    if (selectedSeats.length > 1) {
      setSelectedSeats(selectedSeats.slice(0, selectedSeats.length - 1));
    }
    onNotify('Passenger Removed', 'Passenger removed. Total fare recalculated.', 'info');
  };

  const handleUpdatePassenger = (id: string, field: keyof FlightPassenger, value: any) => {
    setPassengers(
      passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // --- Coupon Handler ---
  const handleApplyCoupon = (code: string) => {
    const c = FLIGHT_COUPONS.find((cp) => cp.code.toLowerCase() === code.trim().toLowerCase());
    if (!c) {
      onNotify('Invalid Coupon', 'Please enter a valid coupon code like FLYYEAH or HDFCSPECIAL.', 'info');
      return;
    }
    setAppliedCoupon(c.code);
    onNotify('Offer Applied!', `Discount of ₹${c.discountInr} applied successfully with ${c.code}!`, 'success');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    onNotify('Offer Removed', 'Discount removed from total fare summary.', 'info');
  };

  // --- Continue to Payment Handler ---
  const handleContinueToPayment = () => {
    // 1. Validate Passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim()) {
        onNotify('Passenger Name Required', `Please enter the First Name for Passenger ${i + 1}.`, 'info');
        return;
      }
      if (!p.lastName.trim()) {
        onNotify('Passenger Name Required', `Please enter the Last Name for Passenger ${i + 1}.`, 'info');
        return;
      }
      if (!p.age || Number(p.age) < 1 || Number(p.age) > 120) {
        onNotify('Invalid Age', `Please enter a valid age for Passenger ${i + 1}.`, 'info');
        return;
      }
    }

    // 2. Validate Contact
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      onNotify('Mobile Number Required', 'Please enter a valid 10-digit mobile number for flight SMS alerts.', 'info');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onNotify('Email Address Required', 'Please enter a valid email address to receive your e-ticket PDF.', 'info');
      return;
    }

    // 3. Process Booking
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedPnr = `6E-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const leadFullName = `${passengers[0].title} ${passengers[0].firstName} ${passengers[0].lastName}`;

      const newBooking: BookedTrip = {
        bookingId: `TRIP-FLIGHT-${Date.now()}`,
        bookingReference: generatedPnr,
        category: 'flights',
        title: isRoundTripFlight
          ? `${outboundAirline} (${outboundFlightNo}) + ${returnAirline} (${returnFlightNo}) · Round-Trip`
          : `${airline} ${flightNo} · ${fromCity.split(' ')[0]} → ${toCity.split(' ')[0]}`,
        routeSummary: isRoundTripFlight
          ? `${fromCity} ⇄ ${toCity} (Round-Trip)`
          : `${fromCity} → ${toCity}`,
        dateSummary: isRoundTripFlight
          ? `${flightTravelDate || outboundDate} - ${returnDate}`
          : (flightTravelDate || travelDate),
        travellers: paxCount,
        cabinOrRoom: `${cabinClass} (${fareCategory.split(' ')[0]}) · Seats ${selectedSeats.join(', ')}`,
        totalPaidInr: totalPayableInr,
        studentFareApplied: false,
        status: 'Confirmed',
        bookedAt: new Date().toISOString().split('T')[0],
      };

      setConfirmedBooking(newBooking);
      onConfirmPayment(newBooking, leadFullName);
      onNotify('Flight Booking Confirmed!', `Airline PNR ${generatedPnr} issued. E-Ticket dispatched to ${email}.`, 'success');
    }, 1500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 text-slate-900">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToResults}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Flight Results</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ===============================================================
              LEFT COLUMN (8 COLS): Flight Info, Baggage, Add-ons, Passengers
          =============================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. FLIGHT DETAILS & SCHEDULE CARDS */}
            {isRoundTripFlight ? (
              <div className="space-y-4">
                {/* 1A. DEPARTURE FLIGHT CARD */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                        <Plane className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            🛫 Departure Flight
                          </span>
                          <h2 className="font-display text-lg sm:text-xl font-black text-slate-900">
                            {outboundAirline} {outboundFlightNo}
                          </h2>
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {outboundTier}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                          <span>Airbus A321neo</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-bold">Non-Stop</span>
                          <span>·</span>
                          <span>{cabinClass} Class</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-medium block">Departure Date</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{flightTravelDate || outboundDate}</span>
                    </div>
                  </div>

                  {/* Departure, Duration & Arrival Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5">
                    <div className="sm:col-span-4 text-left">
                      <div className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 leading-none">
                        {outboundDepTime}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">
                        {fromCity}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Gate Opens 45m Prior
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
                      <span className="text-xs font-bold text-slate-500 mb-1">{outboundDuration}</span>
                      <div className="w-full h-1 bg-slate-200 rounded-full relative flex items-center justify-center">
                        <Plane className="w-4 h-4 text-blue-600 absolute bg-white px-0.5" />
                      </div>
                    </div>

                    <div className="sm:col-span-4 text-left sm:text-right">
                      <div className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 leading-none">
                        {outboundArrTime}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">
                        {toCity}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Terminal 1 · Baggage Belt 3
                      </div>
                    </div>
                  </div>

                  {/* Baggage Summary Strip */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/70 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 px-5 sm:px-7 py-3 rounded-b-3xl">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Luggage className="w-4 h-4 text-blue-600" />
                        <span>Included Cabin Bag: <strong>7 kg / pax</strong></span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Luggage className="w-4 h-4 text-blue-600" />
                        <span>Included Check-in Bag: <strong>15 kg / pax</strong></span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFareRulesModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:scale-102"
                      title="Click to view cancellation charges and date change policies"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Fare Rules</span>
                    </button>
                  </div>
                </div>

                {/* 1B. RETURN FLIGHT CARD */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                        <Plane className="w-6 h-6 rotate-180" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                            🛬 Return Flight
                          </span>
                          <h2 className="font-display text-lg sm:text-xl font-black text-slate-900">
                            {returnAirline} {returnFlightNo}
                          </h2>
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {returnTier}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                          <span>Boeing 737-800</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-bold">Non-Stop</span>
                          <span>·</span>
                          <span>{cabinClass} Class</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-medium block">Return Date</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{returnDate}</span>
                    </div>
                  </div>

                  {/* Return Departure, Duration & Arrival Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5">
                    <div className="sm:col-span-4 text-left">
                      <div className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 leading-none">
                        {returnDepTime}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">
                        {toCity}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Gate Opens 45m Prior
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
                      <span className="text-xs font-bold text-slate-500 mb-1">{returnDuration}</span>
                      <div className="w-full h-1 bg-slate-200 rounded-full relative flex items-center justify-center">
                        <Plane className="w-4 h-4 text-indigo-600 absolute bg-white px-0.5 rotate-180" />
                      </div>
                    </div>

                    <div className="sm:col-span-4 text-left sm:text-right">
                      <div className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 leading-none">
                        {returnArrTime}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">
                        {fromCity}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Terminal 2 · Baggage Belt 1
                      </div>
                    </div>
                  </div>

                  {/* Baggage Summary Strip */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/70 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 px-5 sm:px-7 py-3 rounded-b-3xl">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Luggage className="w-4 h-4 text-indigo-600" />
                        <span>Included Cabin Bag: <strong>7 kg / pax</strong></span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Luggage className="w-4 h-4 text-indigo-600" />
                        <span>Included Check-in Bag: <strong>15 kg / pax</strong></span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFareRulesModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:scale-102"
                      title="Click to view cancellation charges and date change policies"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View Fare Rules</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                      <Plane className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-lg sm:text-xl font-black text-slate-900">
                          {airline} {flightNo}
                        </h2>
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {fareCategory}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                        <span>Airbus A321neo</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-bold">Non-Stop Flight</span>
                        <span>·</span>
                        <span>{cabinClass} Class</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium block">Travel Date</span>
                    <span className="font-mono text-sm font-bold text-slate-900">{flightTravelDate}</span>
                  </div>
                </div>

                {/* Departure, Duration & Arrival Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5">
                  <div className="sm:col-span-4 text-left">
                    <div className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 leading-none">
                      {depTime}
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      {fromCity}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Gate Opens 45m Prior
                    </div>
                  </div>

                  <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
                    <span className="text-xs font-bold text-slate-500 mb-1">{duration}</span>
                    <div className="w-full h-1 bg-slate-200 rounded-full relative flex items-center justify-center">
                      <Plane className="w-4 h-4 text-blue-600 absolute bg-white px-0.5" />
                    </div>
                  </div>

                  <div className="sm:col-span-4 text-left sm:text-right">
                    <div className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 leading-none">
                      {arrTime}
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      {toCity}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Terminal 1 · Baggage Belt 3
                    </div>
                  </div>
                </div>

                {/* Baggage Summary Strip */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/70 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 px-5 sm:px-7 py-3 rounded-b-3xl">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Luggage className="w-4 h-4 text-blue-600" />
                      <span>Included Cabin Bag: <strong>7 kg / pax</strong></span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Luggage className="w-4 h-4 text-blue-600" />
                      <span>Included Check-in Bag: <strong>15 kg / pax</strong></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFareRulesModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:scale-102"
                    title="Click to view cancellation charges and date change policies"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Fare Rules</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. EXTRA BAGGAGE ADD-ON */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Luggage className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Pre-Book Extra Check-in Baggage
                  </h3>
                </div>
              </div>

              {isRoundTripFlight ? (
                <div className="space-y-4">
                  {/* Outbound Flight Baggage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                        <span>🛫 Departure Flight Baggage:</span>
                        <span className="text-slate-600 font-semibold lowercase">
                          ({fromCity.split(' ')[0]} → {toCity.split(' ')[0]})
                        </span>
                      </span>
                      {extraBaggageOutboundKg > 0 && (
                        <span className="text-xs font-bold text-blue-700">
                          +{extraBaggageOutboundKg} kg Added
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { kg: 0, label: 'Standard 15 kg', price: 0 },
                        { kg: 3, label: '+3 kg Extra', price: 1350 },
                        { kg: 5, label: '+5 kg Extra', price: 1950 },
                        { kg: 10, label: '+10 kg Extra', price: 3750 },
                        { kg: 15, label: '+15 kg Extra', price: 5400 },
                      ].map((bg) => {
                        const isSelected = extraBaggageOutboundKg === bg.kg;
                        return (
                          <button
                            key={bg.kg}
                            type="button"
                            onClick={() => setExtraBaggageOutboundKg(bg.kg)}
                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="text-xs font-extrabold">{bg.label}</div>
                            <div className="text-xs font-mono font-bold mt-1 text-slate-900">
                              {bg.price === 0 ? 'Included' : `+₹${bg.price}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Return Flight Baggage */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                        <span>🛬 Return Flight Baggage:</span>
                        <span className="text-slate-600 font-semibold lowercase">
                          ({toCity.split(' ')[0]} → {fromCity.split(' ')[0]})
                        </span>
                      </span>
                      {extraBaggageReturnKg > 0 && (
                        <span className="text-xs font-bold text-indigo-700">
                          +{extraBaggageReturnKg} kg Added
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { kg: 0, label: 'Standard 15 kg', price: 0 },
                        { kg: 3, label: '+3 kg Extra', price: 1350 },
                        { kg: 5, label: '+5 kg Extra', price: 1950 },
                        { kg: 10, label: '+10 kg Extra', price: 3750 },
                        { kg: 15, label: '+15 kg Extra', price: 5400 },
                      ].map((bg) => {
                        const isSelected = extraBaggageReturnKg === bg.kg;
                        return (
                          <button
                            key={bg.kg}
                            type="button"
                            onClick={() => setExtraBaggageReturnKg(bg.kg)}
                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="text-xs font-extrabold">{bg.label}</div>
                            <div className="text-xs font-mono font-bold mt-1 text-slate-900">
                              {bg.price === 0 ? 'Included' : `+₹${bg.price}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { kg: 0, label: 'Standard 15 kg', price: 0 },
                    { kg: 3, label: '+3 kg Extra', price: 1350 },
                    { kg: 5, label: '+5 kg Extra', price: 1950 },
                    { kg: 10, label: '+10 kg Extra', price: 3750 },
                    { kg: 15, label: '+15 kg Extra', price: 5400 },
                  ].map((bg) => {
                    const isSelected = extraBaggageKg === bg.kg;
                    return (
                      <button
                        key={bg.kg}
                        type="button"
                        onClick={() => setExtraBaggageKg(bg.kg)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{bg.label}</div>
                        <div className="text-xs font-mono font-bold mt-1 text-slate-900">
                          {bg.price === 0 ? 'Included' : `+₹${bg.price}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. PASSENGER DETAILS & DYNAMIC ADD TRAVELLER */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      Traveller Details
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter names exactly as displayed on Govt Photo ID (Aadhaar / Passport).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPassenger}
                  disabled={passengers.length >= 9}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Traveller</span>
                </button>
              </div>

              {/* Passengers Cards List */}
              <div className="space-y-4">
                {passengers.map((p, index) => (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {index === 0 ? 'Primary Passenger (Adult)' : `Passenger ${index + 1}`}
                        </span>
                      </div>

                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(p.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* 1. Custom Title Dropdown (Matches frontpage style & scroll) */}
                      <div className="sm:col-span-2 relative" data-pax-dropdown="true">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenPaxDropdown(
                                openPaxDropdown === `${p.id}-title` ? null : `${p.id}-title`
                              );
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                              openPaxDropdown === `${p.id}-title`
                                ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 text-slate-900 shadow-xs'
                                : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <span>{p.title}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                openPaxDropdown === `${p.id}-title` ? 'rotate-180 text-blue-600' : ''
                              }`}
                            />
                          </button>

                          {openPaxDropdown === `${p.id}-title` && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 overflow-y-auto max-h-56 custom-scrollbar animate-modal-slide-up"
                            >
                              {TITLE_OPTIONS.map((opt) => {
                                const isSelected = p.title === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      handleUpdatePassenger(p.id, 'title', opt.value);
                                      setOpenPaxDropdown(null);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-blue-50 text-blue-700 font-bold'
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                    }`}
                                  >
                                    <div>
                                      <span className="block font-bold">{opt.label}</span>
                                      <span className="block text-[10px] text-slate-400 font-normal">
                                        {opt.desc}
                                      </span>
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5] shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          First &amp; Middle Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={p.firstName}
                          onChange={(e) => handleUpdatePassenger(p.id, 'firstName', e.target.value)}
                          placeholder="First & Middle Name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Last Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={p.lastName}
                          onChange={(e) => handleUpdatePassenger(p.id, 'lastName', e.target.value)}
                          placeholder="Last Name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Age <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={p.age || ''}
                          onChange={(e) => handleUpdatePassenger(p.id, 'age', e.target.value ? Number(e.target.value) : '')}
                          placeholder="Age (Years)"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* 2. Custom Gender Dropdown (Matches frontpage style & scroll) */}
                      <div className="relative" data-pax-dropdown="true">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenPaxDropdown(
                                openPaxDropdown === `${p.id}-gender` ? null : `${p.id}-gender`
                              );
                            }}
                            className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                              openPaxDropdown === `${p.id}-gender`
                                ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 text-slate-900 shadow-xs'
                                : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <span>{p.gender}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                openPaxDropdown === `${p.id}-gender` ? 'rotate-180 text-blue-600' : ''
                              }`}
                            />
                          </button>

                          {openPaxDropdown === `${p.id}-gender` && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-0 top-full mt-1.5 w-full min-w-[140px] bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 overflow-y-auto max-h-56 custom-scrollbar animate-modal-slide-up"
                            >
                              {GENDER_OPTIONS.map((opt) => {
                                const isSelected = p.gender === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      handleUpdatePassenger(p.id, 'gender', opt.value);
                                      setOpenPaxDropdown(null);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-blue-50 text-blue-700 font-bold'
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                    }`}
                                  >
                                    <span className="font-semibold">{opt.label}</span>
                                    {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5] shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Frequent Flyer (Optional)</label>
                        <input
                          type="text"
                          value={p.frequentFlyerNo || ''}
                          onChange={(e) => handleUpdatePassenger(p.id, 'frequentFlyerNo', e.target.value)}
                          placeholder="Airline Membership No."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.wheelchair}
                        onChange={(e) => handleUpdatePassenger(p.id, 'wheelchair', e.target.checked)}
                        className="w-3.5 h-3.5 text-blue-600 rounded"
                      />
                      <span>Request Wheelchair Assistance at Airport</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. CONTACT DETAILS & NOTIFICATIONS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Contact Details (For E-Ticket &amp; Boarding Pass)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email ID"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter Mobile Number"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-blue-950 block">
                    Receive Flight Web Check-in, Boarding Gate &amp; Baggage Belt Alerts on WhatsApp
                  </span>
                  <span className="text-blue-700">
                    Get real-time gate change alerts, weather updates and boarding pass barcode directly on WhatsApp.
                  </span>
                </div>
              </label>
            </div>


            {/* 7. AIRPORT CAB GROUND TRANSFER */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                Airport Ground Transfer
              </h3>

              {/* Airport Cab */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900">Airport Transfer at Destination ({toCity.split(' ')[0]})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'none', label: 'No Cab Needed', price: 0 },
                    { id: 'sedan', label: 'Dedicated AC Sedan (Dzire)', price: 850 },
                    { id: 'suv', label: 'Spacious AC SUV (Ertiga/Innova)', price: 1400 },
                  ].map((cb) => (
                    <button
                      key={cb.id}
                      type="button"
                      onClick={() => setAirportCabType(cb.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        airportCabType === cb.id
                          ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{cb.label}</div>
                      <div className="text-xs font-mono font-bold mt-1 text-slate-900">
                        {cb.price === 0 ? '₹0' : `+₹${cb.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. OPTIONAL GST INVOICING */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-display font-bold text-base text-slate-900 block">
                    GST Number for Business Invoice (Optional)
                  </span>
                  <span className="text-xs text-slate-500">
                    Claim input tax credit on aviation fees &amp; GST for your corporate account
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasGst}
                  onChange={(e) => setHasGst(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>

              {hasGst && (
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={gstCompanyName}
                      onChange={(e) => setGstCompanyName(e.target.value)}
                      placeholder="Registered Company Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">State Selection</label>
                    <select
                      value={gstState}
                      onChange={(e) => setGstState(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 9. TRAVEL ADVISORY & CANCELLATION ACCORDION */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-3">
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                Aviation Travel Advisory &amp; Cancellation Policy
              </h3>

              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'cancellation' ? null : 'cancellation')}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Cancellation &amp; Reschedule Charges</span>
                  </span>
                  {expandedSection === 'cancellation' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'cancellation' && (
                  <div className="p-4 text-xs text-slate-600 space-y-2 bg-white border-t border-slate-200 leading-relaxed">
                    <p>
                      • <strong>&gt; 72 hours before departure:</strong> Flat ₹3,000 cancellation fee per passenger.
                    </p>
                    <p>
                      • <strong>24 to 72 hours before departure:</strong> ₹3,500 cancellation fee per passenger.
                    </p>
                    <p>
                      • <strong>&lt; 24 hours before departure:</strong> Airline non-refundable bracket (Govt taxes &amp; UDF refundable).
                    </p>
                    <p>
                      • <strong>Free Date Change:</strong> If TripProtect 360 is selected, date change penalty is ₹0 (only airline fare difference applies).
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'advisory' ? null : 'advisory')}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Airport Reporting, DigiYatra &amp; Mandatory Web Check-in</span>
                  </span>
                  {expandedSection === 'advisory' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'advisory' && (
                  <div className="p-4 text-xs text-slate-600 space-y-2 bg-white border-t border-slate-200 leading-relaxed">
                    <p>
                      • <strong>Mandatory Web Check-in:</strong> As per DGCA guidelines, all passengers must complete web check-in 48 hours to 60 minutes prior to flight departure.
                    </p>
                    <p>
                      • <strong>DigiYatra Biometric Entry:</strong> Available at Delhi T1D, Mumbai T2 &amp; Goa. Scan barcode to bypass terminal entry queues.
                    </p>
                    <p>
                      • <strong>Photo Identification:</strong> Carry physical or DigiLocker copy of Aadhaar Card, Passport, or Driving License.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN (4 COLS): Sticky Fare Summary & Offers
          =============================================================== */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* STICKY FARE BREAKUP CARD (NOW ON TOP) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Fare Summary
                </h3>
                <span className="text-xs font-bold text-blue-600">
                  {paxCount} {paxCount === 1 ? 'Adult' : 'Adults'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Base Flight Fare */}
                <div className="flex items-center justify-between text-slate-700">
                  <span>
                    Base Airline Fare ({formatPrice(pricePerPax, currency)} × {paxCount})
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatPrice(baseFlightFare, currency)}
                  </span>
                </div>

                {/* Taxes & Aviation Fees */}
                <div className="flex items-center justify-between text-slate-700">
                  <span>Taxes, Aviation Security &amp; GST</span>
                  <span className="font-mono text-slate-900">
                    {formatPrice(taxesAndAviationFees, currency)}
                  </span>
                </div>

                {/* Extra Baggage */}
                {extraBaggageCost > 0 && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>
                      {isRoundTripFlight
                        ? `Pre-booked Baggage (${[
                            extraBaggageOutboundKg > 0 ? `Dep +${extraBaggageOutboundKg}kg` : '',
                            extraBaggageReturnKg > 0 ? `Ret +${extraBaggageReturnKg}kg` : '',
                          ]
                            .filter(Boolean)
                            .join(', ')})`
                        : `Pre-booked Baggage (+${extraBaggageKg} kg)`}
                    </span>
                    <span className="font-mono text-slate-900">
                      +{formatPrice(extraBaggageCost, currency)}
                    </span>
                  </div>
                )}


                {/* Airport Cab */}
                {cabCost > 0 && (
                  <div className="flex items-center justify-between text-sky-700">
                    <span>Airport Transfer Cab ({airportCabType.toUpperCase()})</span>
                    <span className="font-mono font-bold">
                      +{formatPrice(cabCost, currency)}
                    </span>
                  </div>
                )}

                {/* Destination Hotel Deal */}
                {destinationHotelDeal && (
                  <div className="flex items-center justify-between text-amber-700">
                    <span>Destination Stay Deal (Flat 30% Off)</span>
                    <span className="font-mono font-bold">
                      +{formatPrice(hotelDealCost, currency)}
                    </span>
                  </div>
                )}

                {/* Coupon Discount */}
                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold bg-emerald-50/70 p-2 rounded-lg">
                    <span>Offer Savings ({appliedCoupon})</span>
                    <span className="font-mono">-{formatPrice(couponDiscount, currency)}</span>
                  </div>
                )}
              </div>

              {/* Total Payable Strip */}
              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <div className="font-display text-sm font-bold text-slate-900">Total Payable</div>
                  <div className="text-[10px] text-slate-400">All airline taxes &amp; fees included</div>
                </div>
                <div className="text-2xl sm:text-3xl font-medium text-slate-900 font-mono tracking-tight">
                  {formatPrice(totalPayableInr, currency)}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: '💳 Cards' },
                    { id: 'upi', label: '⚡ UPI' },
                    { id: 'netbanking', label: '🏛️ NetBank' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue to Payment CTA */}
              <button
                type="button"
                onClick={handleContinueToPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Flight with Airline...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Payment · {formatPrice(totalPayableInr, currency)}</span>
                  </>
                )}
              </button>
            </div>

            {/* OFFERS, BANK DISCOUNTS & COUPONS CARD (NOW BELOW FARE SUMMARY) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Offers &amp; Bank Discounts
                </h3>
              </div>

              {/* Offer Category Tabs: All, Bank, Add-ons */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-bold">
                {[
                  { id: 'all', label: 'All Offers' },
                  { id: 'bank', label: 'Bank Offers' },
                  { id: 'addons', label: 'Add-on Perks' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveOfferTab(tab.id as any)}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                      activeOfferTab === tab.id
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Coupon Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCouponInput}
                  onChange={(e) => setCustomCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter Coupon Code"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon(customCouponInput)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Filtered Offers List */}
              <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {FLIGHT_COUPONS.filter((c) => activeOfferTab === 'all' || c.category === activeOfferTab).map((cp) => {
                  const isApplied = appliedCoupon === cp.code;
                  return (
                    <div
                      key={cp.code}
                      onClick={() => (isApplied ? handleRemoveCoupon() : handleApplyCoupon(cp.code))}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isApplied
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-mono font-bold">
                          <span>{cp.code}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-sans">
                            {cp.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">{cp.detail}</div>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ml-2 ${isApplied ? 'text-rose-600' : 'text-blue-600'}`}>
                        {isApplied ? 'Remove' : 'Apply'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===============================================================
          MODAL: INTERACTIVE 3-3 AIRCRAFT SEAT MAP
      =============================================================== */}
      {showSeatMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-modal-slide-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Select Aircraft Seats
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSeatMapModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Boeing 737 / Airbus A321 (3-3 Layout)</span>
              <span className="font-bold text-blue-600">Selected: {selectedSeats.join(', ')}</span>
            </div>

            {/* Seat Map Visual Grid */}
            <div className="max-h-72 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 custom-scrollbar">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15].map((row) => (
                <div key={row} className="flex items-center justify-between gap-3 text-xs font-mono">
                  {/* Left 3 Seats: A, B, C */}
                  <div className="flex items-center gap-1.5">
                    {['A', 'B', 'C'].map((col) => {
                      const seatCode = `${row}${col}`;
                      const isSel = selectedSeats.includes(seatCode);
                      return (
                        <button
                          key={seatCode}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              if (selectedSeats.length > 1) setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
                            } else {
                              if (selectedSeats.length < paxCount) {
                                setSelectedSeats([...selectedSeats, seatCode]);
                              } else {
                                setSelectedSeats([seatCode]);
                              }
                            }
                          }}
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isSel
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-400'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[10px] text-slate-400 font-bold">R{row}</span>

                  {/* Right 3 Seats: D, E, F */}
                  <div className="flex items-center gap-1.5">
                    {['D', 'E', 'F'].map((col) => {
                      const seatCode = `${row}${col}`;
                      const isSel = selectedSeats.includes(seatCode);
                      return (
                        <button
                          key={seatCode}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              if (selectedSeats.length > 1) setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
                            } else {
                              if (selectedSeats.length < paxCount) {
                                setSelectedSeats([...selectedSeats, seatCode]);
                              } else {
                                setSelectedSeats([seatCode]);
                              }
                            }
                          }}
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isSel
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-400'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowSeatMapModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Done Seat Selection
            </button>
          </div>
        </div>
      )}

      {/* ===============================================================
          MODAL: CONFIRMATION SUCCESS WITH PNR & TICKETS
      =============================================================== */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-modal-slide-up space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900">
                Flight Ticket Confirmed!
              </h2>
              <p className="text-xs text-slate-500">
                Your reservation has been confirmed and official airline PNR generated.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  Airline PNR Code
                </span>
                <span className="font-mono text-base font-medium text-blue-900">
                  {confirmedBooking.bookingReference}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-blue-950">
                <div>
                  <span className="text-blue-700 block text-[10px]">Flight:</span>
                  <strong className="font-bold">{airline} {flightNo}</strong>
                </div>
                <div>
                  <span className="text-blue-700 block text-[10px]">Route:</span>
                  <strong className="font-bold">{fromCity.split(' ')[0]} → {toCity.split(' ')[0]}</strong>
                </div>
                <div>
                  <span className="text-blue-700 block text-[10px]">Confirmed Seats:</span>
                  <strong className="font-bold">{selectedSeats.join(', ')}</strong>
                </div>
                <div>
                  <span className="text-blue-700 block text-[10px]">Total Paid:</span>
                  <strong className="font-bold font-mono">{formatPrice(totalPayableInr, currency)}</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Flight E-Ticket</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onGoToTrips?.();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>View in My Trips</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive TripYeah Travel Calendar Modal */}
      {showDatePicker && (
        <TripDatePickerModal
          selectedDateStr={flightTravelDate}
          title="Select Flight Departure Date"
          subtitle="Choose travel date with live lowest fares & seat protection"
          onSelectDate={(formatted) => {
            setFlightTravelDate(formatted);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* ===============================================================
          MODAL: FARE RULES (CANCELLATION CHARGES & DATE CHANGES)
      =============================================================== */}
      {showFareRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200/90 flex flex-col animate-modal-slide-up">
            {/* Header: Whitish, modern, seamless without corner artifacts */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 border-b border-slate-200 flex items-center justify-between shrink-0 rounded-t-3xl">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-slate-900">
                    Fare Rules &amp; Policy
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {airline} {flightNo} · <span className="text-blue-700 font-semibold">{fareCategory}</span> · {cabinClass} Class
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFareRulesModal(false)}
                aria-label="Close fare rules"
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFareRulesTab('cancellation')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  fareRulesTab === 'cancellation'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Cancellation Charges</span>
              </button>

              <button
                type="button"
                onClick={() => setFareRulesTab('dateChange')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  fareRulesTab === 'dateChange'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Date Change Charges</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 text-xs sm:text-sm leading-relaxed">
              {fareRulesTab === 'cancellation' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs font-medium">
                    <p>
                      <strong>Important:</strong> All cancellation fees mentioned are charged per passenger per sector. Statutory airport taxes (UDF, PSF, Aviation Security Fee) are always 100% refundable.
                    </p>
                  </div>

                  {/* Cancellation Fee Slabs */}
                  <div className="space-y-2.5">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          More than 72 hours before flight
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Standard early cancellation window
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-mono font-bold text-rose-600 text-sm">₹3,000</span>
                        <span className="text-[11px] text-slate-400 block">per passenger</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Between 24 to 72 hours before flight
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Mid-window cancellation fee
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-mono font-bold text-rose-600 text-sm">₹3,500</span>
                        <span className="text-[11px] text-slate-400 block">per passenger</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Within 24 hours of flight departure
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Late cancellation / airline non-refundable tier
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-bold text-amber-700 text-sm">Non-Refundable</span>
                        <span className="text-[11px] text-slate-400 block">Airport taxes refunded</span>
                      </div>
                    </div>
                  </div>

                  {/* Refund Process details */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">Refund Processing Timeline:</p>
                    <p>• Refunds are initiated instantly upon online cancellation request.</p>
                    <p>• Credited back to original source account (UPI / Card / NetBanking) within 2 to 4 bank working days.</p>
                    <p>• If flight is cancelled or rescheduled &gt; 2 hours by airline, 100% full refund is issued with zero deduction.</p>
                  </div>
                </div>
              )}

              {fareRulesTab === 'dateChange' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-950 text-xs font-medium">
                    <p>
                      <strong>Flexible Date Change:</strong> If you select the "Flexible Booking / Date Change Guarantee" addon, airline date change penalty is <strong>₹0 (Completely FREE)</strong>.
                    </p>
                  </div>

                  {/* Date Change Fee Slabs */}
                  <div className="space-y-2.5">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          With TripProtect / Zero Cancellation Protection
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                          Unlimited free date change anytime up to 2 hours prior
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-bold text-emerald-600 text-sm">FREE (₹0)</span>
                        <span className="text-[11px] text-slate-400 block">+ Fare diff if any</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Standard Date Change (&gt; 72 hours)
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Standard rescheduling fee
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm">₹2,500</span>
                        <span className="text-[11px] text-slate-400 block">+ Fare diff per pax</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Standard Date Change (24 to 72 hours)
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Within 3 days of departure
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm">₹3,000</span>
                        <span className="text-[11px] text-slate-400 block">+ Fare diff per pax</span>
                      </div>
                    </div>
                  </div>

                  {/* Rescheduling Rules details */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">Date Change Guidelines:</p>
                    <p>• Reschedule to any available date up to 365 days from original date.</p>
                    <p>• If new flight fare is lower, airline does not refund fare difference; if new flight fare is higher, difference is payable.</p>
                    <p>• Name corrections (up to 3 characters for spelling mistakes) are supported free before web check-in.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setShowFareRulesModal(false)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md shadow-blue-600/20 active:scale-95 transition-all"
              >
                Close Fare Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
