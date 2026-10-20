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
  title: 'Mr' | 'Mrs' | 'Ms' | 'Master';
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  frequentFlyerNo?: string;
  wheelchair: boolean;
}

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
  // Flight Info
  const airline = item.airline || 'IndiGo';
  const flightNo = item.flightNo || item.code || '6E-2134';
  const fromCity = item.fromCity || 'New Delhi (DEL)';
  const toCity = item.toCity || 'Goa (GOI)';
  const depTime = item.depTime?.split(' ')[0] || '06:15';
  const arrTime = item.arrTime?.split(' ')[0] || '08:30';
  const duration = item.duration || '2h 15m';
  const travelDate = item.travelDate || '18 Oct 2026';
  const pricePerPax = item.priceInr || 4850;
  const cabinClass = item.cabinClass || 'Economy';
  const fareCategory = item.roomType || 'Flexi Plus (SpiceFlex)'; // borrowed field or default

  // 1. Dynamic Passengers (Starts with item.travellers or 1)
  const initialPaxCount = Math.max(1, item.travellers || 1);
  const [passengers, setPassengers] = useState<FlightPassenger[]>(() => {
    const list: FlightPassenger[] = [
      {
        id: 'pax-1',
        title: 'Mr',
        firstName: 'Rahul',
        lastName: 'Sharma',
        age: 31,
        gender: 'Male',
        frequentFlyerNo: '',
        wheelchair: false,
      },
    ];
    for (let i = 2; i <= initialPaxCount; i++) {
      list.push({
        id: `pax-${i}`,
        title: i % 2 === 0 ? 'Mrs' : 'Mr',
        firstName: i % 2 === 0 ? 'Pooja' : 'Aarav',
        lastName: 'Sharma',
        age: i % 2 === 0 ? 29 : 8,
        gender: i % 2 === 0 ? 'Female' : 'Male',
        frequentFlyerNo: '',
        wheelchair: false,
      });
    }
    return list;
  });

  // 2. Extra Baggage Selection
  const [extraBaggageKg, setExtraBaggageKg] = useState<number>(0);

  // 3. Travel Protection & Flexible Booking
  const [freeDateChangeProtect, setFreeDateChangeProtect] = useState<boolean>(true);
  const [tripInsurance, setTripInsurance] = useState<boolean>(true);

  // 4. In-Flight Seat Selection (Rows 1-15)
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['12A']);

  // 5. In-Flight Meals Add-on
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['Veg Junglee Sandwich (+₹250)']);

  // 6. Airport Cab Transfer Add-on
  const [airportCabType, setAirportCabType] = useState<'none' | 'sedan' | 'suv'>('none');

  // 7. Priority Services (Check-in + Fast Baggage)
  const [priorityServices, setPriorityServices] = useState<boolean>(false);

  // 8. Destination Hotel Deal
  const [destinationHotelDeal, setDestinationHotelDeal] = useState<boolean>(false);

  // 9. Contact Details
  const [email, setEmail] = useState<string>('rahul.sharma@example.com');
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

  // 10. GST Billing
  const [hasGst, setHasGst] = useState<boolean>(false);
  const [gstNumber, setGstNumber] = useState<string>('07AAAAA0000A1Z5');
  const [gstCompanyName, setGstCompanyName] = useState<string>('Sharma Global Tech Pvt Ltd');
  const [gstState, setGstState] = useState<string>('Delhi');

  // 11. Coupons & Bank Offers
  const [activeOfferTab, setActiveOfferTab] = useState<'all' | 'bank' | 'addons'>('all');
  const [customCouponInput, setCustomCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('FLYYEAH');

  // 12. Accordions & Modals
  const [expandedSection, setExpandedSection] = useState<'cancellation' | 'advisory' | null>('cancellation');
  const [showSeatMapModal, setShowSeatMapModal] = useState<boolean>(false);

  // 13. Payment & Confirmation
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookedTrip | null>(null);

  // Travel Date & Calendar State (Replaces countdown timer)
  const [flightTravelDate, setFlightTravelDate] = useState<string>(travelDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

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
  const extraBaggageCost = (extraBaggagePriceMap[extraBaggageKg] || 0) * paxCount;

  // Seat Selection Cost (e.g. ₹250 per seat)
  const seatCost = selectedSeats.length * 250;

  // Meals Cost
  const mealCost = selectedMeals.length * 250;

  // Travel Protection & Flexible Date Change
  const dateChangeProtectCost = freeDateChangeProtect ? 399 * paxCount : 0;
  const tripInsuranceCost = tripInsurance ? 249 * paxCount : 0;

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
      age: 26,
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
      if (!p.age || p.age < 1 || p.age > 120) {
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
        title: `${airline} ${flightNo} · ${fromCity.split(' ')[0]} → ${toCity.split(' ')[0]}`,
        routeSummary: `${fromCity} → ${toCity}`,
        dateSummary: travelDate,
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
      {/* Top Breadcrumb & Lock Timer Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToResults}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Flight Results</span>
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-blue-200">
                Official Airline Booking &amp; Instant PNR Issuance
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Click to view calendar and change departure date"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>Departure: <strong>{flightTravelDate}</strong></span>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-mono">Calendar</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ===============================================================
              LEFT COLUMN (8 COLS): Flight Info, Baggage, Add-ons, Passengers
          =============================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. FLIGHT DETAILS & SCHEDULE CARD */}
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs font-mono transition-colors cursor-pointer"
                    title="Change travel date"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-300" />
                    <span>{flightTravelDate}</span>
                  </button>
                </div>
              </div>

              {/* Departure, Duration & Arrival Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5">
                <div className="sm:col-span-4 text-left">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                    {depTime}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {fromCity}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Terminal 1D · Gate Opens 45m Prior
                  </div>
                </div>

                <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
                  <span className="text-xs font-bold text-slate-500 mb-1">{duration}</span>
                  <div className="w-full h-1 bg-slate-200 rounded-full relative flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 absolute right-0 shadow-xs" />
                    <Plane className="w-4 h-4 text-blue-600 absolute bg-white px-0.5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>On-Time Performance 98%</span>
                  </span>
                </div>

                <div className="sm:col-span-4 text-left sm:text-right">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 leading-none">
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
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Free Web Check-in 48h Prior
                </span>
              </div>
            </div>

            {/* 2. EXTRA BAGGAGE ADD-ON */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Luggage className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Pre-Book Extra Check-in Baggage
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Save up to 50% vs Airport Counter Rates
                </span>
              </div>

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
            </div>

            {/* 3. SEAT SELECTION & IN-FLIGHT MEALS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Seat Selection &amp; In-Flight Hot Meals
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reserve your preferred window/aisle seat and pre-book fresh chef meals
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSeatMapModal(true)}
                  className="px-4 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs cursor-pointer border border-blue-200 transition-colors"
                >
                  View 3-3 Seat Map
                </button>
              </div>

              {/* Selected Seats summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Allocated Seats:</span>
                  <div className="flex items-center gap-1.5">
                    {selectedSeats.map((st) => (
                      <span key={st} className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-mono font-bold text-blue-700 shadow-2xs">
                        {st} (Window)
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-slate-500 font-mono">₹250 / seat included</span>
              </div>

              {/* Meals Multi-Select */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block">
                  Select In-Flight Meal / Beverage:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Veg Junglee Sandwich (+₹250)',
                    'Paneer Tikka Kathi Roll (+₹350)',
                    'Chicken Club Sandwich (+₹350)',
                    'South Indian Upma & Coffee (+₹250)',
                    'Jain Special Meal Box (+₹250)',
                    'Fresh Fruit Bowl (+₹200)',
                  ].map((mealItem) => {
                    const isSelected = selectedMeals.includes(mealItem);
                    return (
                      <button
                        key={mealItem}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedMeals(selectedMeals.filter((m) => m !== mealItem));
                          } else {
                            setSelectedMeals([...selectedMeals, mealItem]);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{mealItem}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. PASSENGER DETAILS & DYNAMIC ADD TRAVELLER */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      Traveller Details
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      {passengers.length} of 9 Added
                    </span>
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
                  <span>+ Add Traveller</span>
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
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Seat: {selectedSeats[index] || '14A'}
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
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                        <select
                          value={p.title}
                          onChange={(e) => handleUpdatePassenger(p.id, 'title', e.target.value)}
                          className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Master">Master</option>
                        </select>
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          First &amp; Middle Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={p.firstName}
                          onChange={(e) => handleUpdatePassenger(p.id, 'firstName', e.target.value)}
                          placeholder="As per Passport / Aadhaar"
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
                          placeholder="Surname"
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
                          value={p.age}
                          onChange={(e) => handleUpdatePassenger(p.id, 'age', Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                        <select
                          value={p.gender}
                          onChange={(e) => handleUpdatePassenger(p.id, 'gender', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
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
                      placeholder="name@example.com"
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
                      placeholder="10-digit mobile number"
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

            {/* 6. FLEXIBLE BOOKING & TRAVEL PROTECTION (TripProtect 360) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Flexible Booking &amp; Travel Protection
                </h3>
              </div>

              <div
                onClick={() => setFreeDateChangeProtect(!freeDateChangeProtect)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  freeDateChangeProtect
                    ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={freeDateChangeProtect}
                    onChange={() => {}}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 mt-0.5 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-950">
                        Zero Cancellation / Free Date Change Guarantee
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-600 text-white uppercase">
                        100% Refundable
                      </span>
                    </div>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Reschedule your flight anytime up to 2 hours before departure with zero airline change penalty.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-slate-900">
                    +₹{399 * paxCount}
                  </div>
                  <div className="text-[10px] text-slate-400">₹399 per traveller</div>
                </div>
              </div>

              <div
                onClick={() => setTripInsurance(!tripInsurance)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  tripInsurance
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={tripInsurance}
                    onChange={() => {}}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 mt-0.5 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-emerald-950 block">
                      TripProtect 360 Comprehensive Flight Insurance
                    </span>
                    <span className="text-xs text-emerald-700">
                      Emergency medical cover up to ₹15 Lakhs, baggage loss compensation ₹25,000 &amp; trip delay payout.
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-slate-900">
                    +₹{249 * paxCount}
                  </div>
                  <div className="text-[10px] text-slate-400">₹249 per traveller</div>
                </div>
              </div>
            </div>

            {/* 7. AIRPORT CABS & EXCLUSIVE HOTEL DEALS ADD-ONS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                Ground Transfer &amp; Exclusive Hotel Deals
              </h3>

              {/* Airport Cab */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900">Airport Transfer at Destination ({toCity.split(' ')[0]})</span>
                  </div>
                  <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded">
                    Flight Delay Waiting Included
                  </span>
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

              {/* Exclusive Hotel Deal Card */}
              <div
                onClick={() => setDestinationHotelDeal(!destinationHotelDeal)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  destinationHotelDeal
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={destinationHotelDeal}
                    onChange={() => {}}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 mt-0.5 focus:ring-amber-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-bold text-amber-950">
                        Exclusive Destination Stay Voucher (Flat 30% Off)
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Lock a 4-Star Resort in {toCity.split(' ')[0]} with free breakfast and pool access at exclusive flight-bundled rates.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-slate-900">+₹1,999</span>
                  <div className="text-[10px] text-slate-400">per room / night</div>
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
                {extraBaggageKg > 0 && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Pre-booked Baggage (+{extraBaggageKg} kg)</span>
                    <span className="font-mono text-slate-900">
                      +{formatPrice(extraBaggageCost, currency)}
                    </span>
                  </div>
                )}

                {/* Seat Selection */}
                {seatCost > 0 && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Preferred Seat Selection ({selectedSeats.length} seats)</span>
                    <span className="font-mono text-slate-900">
                      +{formatPrice(seatCost, currency)}
                    </span>
                  </div>
                )}

                {/* In-Flight Meals */}
                {mealCost > 0 && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>In-Flight Meals ({selectedMeals.length} items)</span>
                    <span className="font-mono text-slate-900">
                      +{formatPrice(mealCost, currency)}
                    </span>
                  </div>
                )}

                {/* Flexible Booking Protect */}
                {freeDateChangeProtect && (
                  <div className="flex items-center justify-between text-indigo-700">
                    <span>Free Date Change Protection ({paxCount} pax)</span>
                    <span className="font-mono font-bold">
                      +{formatPrice(dateChangeProtectCost, currency)}
                    </span>
                  </div>
                )}

                {/* Travel Insurance */}
                {tripInsurance && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>TripProtect 360 Insurance ({paxCount} pax)</span>
                    <span className="font-mono font-bold">
                      +{formatPrice(tripInsuranceCost, currency)}
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
                <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
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

              <div className="text-[11px] text-center text-slate-400">
                🔒 Safe 256-Bit SSL Encrypted Airline Verified Transaction
              </div>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
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
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 space-y-5">
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
                <span className="font-mono text-base font-black text-blue-900">
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
    </div>
  );
};
