import React, { useState, useEffect } from 'react';
import {
  Check,
  Plane,
  Building2,
  TrainFront,
  Bus,
  Car,
  Palmtree,
  Compass,
  ShieldCheck,
  Leaf,
  Lock,
  QrCode,
  CreditCard,
  Building,
  Wallet,
  Phone,
  Tag,
  Sparkles,
  User,
  Mail,
  ChevronDown,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  Luggage,
  Coffee,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Printer,
  Download,
  Share2,
  Armchair,
  Users,
  FileText,
  BadgeCheck,
  Wifi,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  ASSETS,
  BookedTrip,
  BookingCategory,
  CurrencyCode,
  formatPrice,
} from '../data/travelData';
import { SafeImage } from './SafeImage';
import { TrainBookingCheckoutPage } from './TrainBookingCheckoutPage';
import { FlightBookingCheckoutPage } from './FlightBookingCheckoutPage';
import { TripDatePickerModal } from './TripDatePickerModal';

export interface CheckoutItem {
  title: string;
  code: string;
  category: BookingCategory;
  priceInr: number;
  depTime?: string;
  arrTime?: string;
  duration?: string;
  fromCity?: string;
  toCity?: string;
  travelDate?: string;
  returnDate?: string;
  travellers?: number;
  cabinClass?: string;
  airline?: string;
  flightNo?: string;
  trainName?: string;
  trainNo?: string;
  trainClass?: string;
  hotelName?: string;
  hotelLocation?: string;
  roomType?: string;
  busOperator?: string;
  busType?: string;
  seatNumbers?: string;
  cabType?: string;
  pickupTime?: string;
  holidayTheme?: string;
  busBoardingPoint?: string;
  busDroppingPoint?: string;
  isRoundTrip?: boolean;
  outboundFlight?: any;
  returnFlight?: any;
  outboundTierName?: string;
  returnTierName?: string;
}

interface CheckoutPaymentPageProps {
  currency: CurrencyCode;
  item: CheckoutItem;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
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

export interface DynamicPassenger {
  id: string;
  title: 'Mr' | 'Mrs' | 'Ms';
  firstName: string;
  lastName: string;
  age: number | '';
  gender: 'Male' | 'Female' | 'Others';
  isSeniorCitizen?: boolean;
}

const DefaultCheckoutPaymentPage: React.FC<CheckoutPaymentPageProps> = ({
  currency,
  item,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
}) => {
  const category = item.category || 'flights';

  // Dynamic Passengers (Matching Train Checkout Page: Empty defaults, custom dropdowns, dynamic add/remove)
  const [passengers, setPassengers] = useState<DynamicPassenger[]>([
    {
      id: 'p-1',
      title: 'Mr',
      firstName: '',
      lastName: '',
      age: '' as any,
      gender: 'Male',
    },
  ]);
  const [openPaxDropdown, setOpenPaxDropdown] = useState<string | null>(null);

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-pax-dropdown="true"]')) {
        setOpenPaxDropdown(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Passenger Handlers
  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      onNotify('Maximum Limit Reached', 'Maximum 6 passengers allowed per booking.', 'info');
      return;
    }
    setPassengers((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        title: 'Mr',
        firstName: '',
        lastName: '',
        age: '' as any,
        gender: 'Male',
      },
    ]);
    onNotify('Passenger Added', `Passenger ${passengers.length + 1} added. Fare updated dynamically.`, 'success');
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length === 1) {
      onNotify('Action Denied', 'At least 1 primary passenger is required.', 'info');
      return;
    }
    setPassengers((prev) => prev.filter((p) => p.id !== id));
    onNotify('Passenger Removed', 'Passenger removed. Total fare recalculated.', 'info');
  };

  const handleUpdatePassenger = (id: string, field: keyof DynamicPassenger, value: any) => {
    setPassengers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === 'age') {
          updated.isSeniorCitizen = Number(value) >= 60;
        }
        return updated;
      })
    );
  };

  const travellersCount = Math.max(1, category === 'buses' ? passengers.length : (item.travellers || passengers.length));

  // Contact Details (Matching Train Checkout Page: Empty defaults)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // GST & Business Details
  const [hasGst, setHasGst] = useState(false);
  const [gstNumber, setGstNumber] = useState('07AAAAA0000A1Z5');
  const [companyName, setCompanyName] = useState('Sharma Global Tech Pvt Ltd');

  // 2. Flight Specific State
  const [selectedSeat, setSelectedSeat] = useState<string>(item.seatNumbers || '12A');
  const [flightMeal, setFlightMeal] = useState<string>('Veg Sandwich & Juice (+₹250)');
  const [extraBaggage, setExtraBaggage] = useState<string>('Standard 15 kg (Included)');
  const [frequentFlyerNo, setFrequentFlyerNo] = useState<string>('');
  const [wheelchairReq, setWheelchairReq] = useState<boolean>(false);
  const [protectFlight, setProtectFlight] = useState<boolean>(true);

  // 3. Hotel Specific State
  const [prefEarlyCheckin, setPrefEarlyCheckin] = useState<boolean>(true);
  const [prefHighFloor, setPrefHighFloor] = useState<boolean>(true);
  const [prefBedType, setPrefBedType] = useState<'King Bed' | 'Twin Beds'>('King Bed');
  const [prefSmoking, setPrefSmoking] = useState<boolean>(false);
  const [hotelAirportTransfer, setHotelAirportTransfer] = useState<boolean>(false);
  const [hotelFreeCancelProtect, setHotelFreeCancelProtect] = useState<boolean>(true);

  // 4. Train Specific State
  const [irctcUsername, setIrctcUsername] = useState<string>('rahul_sharma99');
  const [irctcVerified, setIrctcVerified] = useState<boolean>(true);
  const [trainBerthPref, setTrainBerthPref] = useState<string>('Lower Berth');
  const [trainFoodPref, setTrainFoodPref] = useState<string>('Veg Meal (Included)');
  const [autoUpgradation, setAutoUpgradation] = useState<boolean>(true);
  const [confirmSameCoach, setConfirmSameCoach] = useState<boolean>(true);

  // 5. Bus Specific State
  const [busBoardingPoint, setBusBoardingPoint] = useState<string>(
    item.busBoardingPoint || 'Kashmere Gate Metro Gate 1, ISBT (09:00 PM)'
  );
  const [busDroppingPoint, setBusDroppingPoint] = useState<string>(
    item.busDroppingPoint || 'Mapusa Bus Stand, Near Police Station (11:30 AM)'
  );
  const [femaleSafetySeat, setFemaleSafetySeat] = useState<boolean>(false);

  // 6. Cab Specific State
  const [pickupAddress, setPickupAddress] = useState<string>(
    'House 42, Barakhamba Road, Connaught Place, New Delhi'
  );
  const [dropAddress, setDropAddress] = useState<string>(
    'Terminal 3 Departure, IGI Airport, New Delhi'
  );
  const [flightOrTrainNo, setFlightOrTrainNo] = useState<string>('6E-2134');
  const [cabExtraLuggageCarrier, setCabExtraLuggageCarrier] = useState<boolean>(false);

  // 7. General Add-ons & Coupons
  const [carbonOffset, setCarbonOffset] = useState<boolean>(true);
  const [couponApplied, setCouponApplied] = useState<string | null>(
    category === 'flights' ? 'FLYYEAH' : category === 'trains' ? 'TRAINYEAH' : 'TRIPSTEAL'
  );
  const [customCouponInput, setCustomCouponInput] = useState<string>('');

  // 8. Payment Method State
  const [payTab, setPayTab] = useState<'upi' | 'card' | 'netbanking' | 'emi'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [upiVpa, setUpiVpa] = useState<string>('rahulsharma@okaxis');
  const [vpaVerified, setVpaVerified] = useState<boolean>(true);
  const [cardNumber, setCardNumber] = useState<string>('4312 8892 4410 7109');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('742');
  const [cardHolder, setCardHolder] = useState<string>('RAHUL SHARMA');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<string>('3 Months (@ ₹0 interest)');

  // 9. Booking Success State (Post-Payment Celebration Modal)
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookedTrip | null>(null);

  // Travel Date & Calendar State (Replaces countdown timer)
  const [bookingTravelDate, setBookingTravelDate] = useState<string>(item.travelDate || '18 Oct 2026');
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false);

  // Base pricing logic based on category
  const baseServiceFare = (item.priceInr || 5800) * (category === 'hotels' || category === 'cabs' ? 1 : travellersCount);

  // Category specific add-ons cost
  let categoryAddonsInr = 0;
  if (category === 'flights') {
    if (protectFlight) categoryAddonsInr += 299 * travellersCount;
    if (flightMeal.includes('+₹250')) categoryAddonsInr += 250 * travellersCount;
    if (flightMeal.includes('+₹350')) categoryAddonsInr += 350 * travellersCount;
    if (extraBaggage.includes('+₹1,450')) categoryAddonsInr += 1450 * travellersCount;
    if (extraBaggage.includes('+₹2,750')) categoryAddonsInr += 2750 * travellersCount;
  } else if (category === 'hotels') {
    if (hotelFreeCancelProtect) categoryAddonsInr += 399;
    if (hotelAirportTransfer) categoryAddonsInr += 1400;
  } else if (category === 'trains') {
    categoryAddonsInr += Math.round(0.45 * travellersCount); // IRCTC Rail Insurance
  } else if (category === 'buses') {
    categoryAddonsInr += 19 * travellersCount;
  } else if (category === 'cabs') {
    if (cabExtraLuggageCarrier) categoryAddonsInr += 200;
  }

  // Taxes
  let taxesAndFeesInr = 0;
  if (category === 'flights') {
    taxesAndFeesInr = Math.round(baseServiceFare * 0.12) + 420; // Aviation fees
  } else if (category === 'hotels') {
    taxesAndFeesInr = Math.round(baseServiceFare * 0.12); // GST
  } else if (category === 'trains') {
    taxesAndFeesInr = 15 + Math.round(baseServiceFare * 0.05); // IRCTC Convenience Fee + GST
  } else if (category === 'buses') {
    taxesAndFeesInr = Math.round(baseServiceFare * 0.08);
  } else if (category === 'cabs') {
    taxesAndFeesInr = Math.round(baseServiceFare * 0.05);
  } else {
    taxesAndFeesInr = Math.round(baseServiceFare * 0.10);
  }

  if (carbonOffset) {
    categoryAddonsInr += 45;
  }

  // Discounts
  let couponDiscountInr = 0;
  if (couponApplied === 'TRIPSTEAL') couponDiscountInr = Math.min(1500, Math.round(baseServiceFare * 0.1));
  else if (couponApplied === 'FLYYEAH') couponDiscountInr = Math.min(1800, Math.round(baseServiceFare * 0.12));
  else if (couponApplied === 'TRAINYEAH') couponDiscountInr = 150;
  else if (couponApplied === 'HOTEL20') couponDiscountInr = Math.min(2500, Math.round(baseServiceFare * 0.2));
  else if (couponApplied) couponDiscountInr = 500;

  const totalPayableInr = Math.max(
    500,
    baseServiceFare + categoryAddonsInr + taxesAndFeesInr - couponDiscountInr
  );

  const handleApplyCoupon = () => {
    const code = customCouponInput.trim().toUpperCase();
    if (!code) return;
    setCouponApplied(code);
    setCustomCouponInput('');
    onNotify(`Coupon ${code} Applied!`, 'Discount updated in your price summary.', 'success');
  };

  // Confirm and Pay Action
  const handleProceedPayment = () => {
    // 1. Validate Primary Passenger
    const primary = passengers[0];
    if (!primary || !primary.firstName.trim()) {
      onNotify('Passenger Name Required', 'Please enter the First & Middle Name for Primary Passenger 1.', 'info');
      return;
    }
    if (!primary.age || Number(primary.age) < 1 || Number(primary.age) > 120) {
      onNotify('Invalid Age', 'Please enter a valid age for Primary Passenger 1.', 'info');
      return;
    }

    // 2. Validate Contact
    if (!email.trim() || !email.includes('@')) {
      onNotify('Invalid Email', 'Please enter a valid email address to receive your ticket.', 'info');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      onNotify('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.', 'info');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const generatedId =
        category === 'flights'
          ? `TY-${Math.floor(1000 + Math.random() * 9000)}-${item.code || 'DEL'}`
          : category === 'trains'
          ? `${Math.floor(2000000000 + Math.random() * 900000000)}`
          : category === 'hotels'
          ? `TY-HTL-${Math.floor(1000 + Math.random() * 9000)}`
          : category === 'buses'
          ? `TY-BUS-${Math.floor(1000 + Math.random() * 9000)}`
          : category === 'cabs'
          ? `TY-CAB-${Math.floor(1000 + Math.random() * 9000)}`
          : `TY-PKG-${Math.floor(1000 + Math.random() * 9000)}`;

      const leadFullName = `${primary.title} ${primary.firstName} ${primary.lastName}`.trim() || 'Passenger';

      const cabinOrRoomLabel =
        category === 'flights'
          ? `${item.cabinClass || 'Economy'} · Seat ${selectedSeat}`
          : category === 'trains'
          ? `${item.trainClass || 'Executive Chair Car'} · Berth ${trainBerthPref}`
          : category === 'hotels'
          ? `${item.roomType || 'Deluxe Room'} (${prefBedType})`
          : category === 'buses'
          ? `Volvo Sleeper · Seat L3`
          : category === 'cabs'
          ? `${item.cabType || 'Sedan'} · Private Door-to-Door`
          : 'Curated Tour Package';

      const routeLabel =
        category === 'hotels'
          ? `${item.title} · ${item.toCity || 'Goa'}`
          : `${item.fromCity || 'New Delhi'} → ${item.toCity || 'Goa'}`;

      const newBooking: BookedTrip = {
        bookingId: generatedId,
        category,
        title: item.title,
        routeSummary: routeLabel,
        dateSummary: item.travelDate || '18 Oct 2026',
        travellers: travellersCount,
        cabinOrRoom: cabinOrRoomLabel,
        totalPaidInr: totalPayableInr,
        studentFareApplied: false,
        status: 'Confirmed',
        bookedAt: new Date().toISOString().split('T')[0],
      };

      setConfirmedBookingData(newBooking);
      onConfirmPayment(newBooking, leadFullName);
    }, 1200);
  };

  // Service Icon Helper
  const CategoryIcon =
    category === 'flights'
      ? Plane
      : category === 'trains'
      ? TrainFront
      : category === 'hotels'
      ? Building2
      : category === 'buses'
      ? Bus
      : category === 'cabs'
      ? Car
      : category === 'holidays'
      ? Palmtree
      : Compass;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      {/* 1. TOP PROGRESS & NAVIGATION HEADER */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={onBackToResults}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer group"
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
              <span>Back to Results</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>1. Selected</span>
            </div>
            <span className="w-4 sm:w-8 h-0.5 bg-blue-600" />
            <div className="flex items-center gap-1.5 text-blue-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>2. Review &amp; Details</span>
            </div>
            <span className="w-4 sm:w-8 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">
                3
              </span>
              <span>3. Payment</span>
            </div>
          </div>

          {/* Travel / Journey Date Calendar Selector (Hidden for buses and cabs as requested) */}
          {category !== 'buses' && category !== 'cabs' && (
            <button
              type="button"
              onClick={() => setShowDatePickerModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200/90 text-xs font-semibold text-blue-700 transition-all cursor-pointer shadow-2xs hover:scale-102"
              title="Click to view calendar and change travel date"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Travel Date: <strong className="font-bold text-blue-900">{bookingTravelDate}</strong></span>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-mono">Calendar</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN BOOKING ENGINE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            LEFT COLUMN (8 Cols): ITINERARY DETAILS, PASSENGER FORMS & ADD-ONS
        =================================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. DEDICATED ITINERARY SUMMARY CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <CategoryIcon className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {category.toUpperCase()} RESERVATION
                  </span>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    {item.title}
                  </h2>
                </div>
              </div>

              {category !== 'buses' && category !== 'cabs' && (
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Instant Confirmation Guaranteed</span>
                  </span>
                </div>
              )}
            </div>

            {/* FLIGHT REVIEW SUMMARY */}
            {category === 'flights' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px]">
                      {item.airline || 'IndiGo'}
                    </span>
                    <span className="font-bold text-slate-900">{item.flightNo || item.code || '6E-2134'}</span>
                    <span>·</span>
                    <span>Airbus A320neo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Partially Refundable
                    </span>
                    <span>·</span>
                    <span>{item.cabinClass || 'Economy'} Class</span>
                  </div>
                </div>

                {/* Timeline Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-2">
                  <div className="sm:col-span-4">
                    <div className="text-2xl font-medium text-slate-900 font-mono-tabular">
                      {item.depTime || '06:15'}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {item.fromCity || 'New Delhi (DEL)'}
                    </div>
                    <div className="text-xs text-slate-500">Terminal 2 (T2)</div>
                  </div>

                  <div className="sm:col-span-4 text-center py-2 sm:py-0">
                    <div className="text-xs font-bold text-slate-500 mb-1">
                      {item.duration || '2h 15m'}
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-slate-300" />
                      <Plane className="w-4 h-4 text-blue-600 absolute bg-slate-50 px-0.5" />
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-1">Non-stop</div>
                  </div>

                  <div className="sm:col-span-4 text-left sm:text-right">
                    <div className="text-2xl font-medium text-slate-900 font-mono-tabular">
                      {item.arrTime || '08:30'}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {item.toCity || 'Goa (GOI)'}
                    </div>
                    <div className="text-xs text-slate-500">Dabolim Airport</div>
                  </div>
                </div>

                {/* Baggage Inclusions */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Luggage className="w-4 h-4 text-blue-600" />
                    <span>
                      Cabin Baggage: <strong>7 kg / traveller</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Luggage className="w-4 h-4 text-emerald-600" />
                    <span>
                      Check-in Baggage: <strong>15 kg / traveller</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <span>Complimentary In-Flight Water</span>
                  </div>
                </div>
              </div>
            )}

            {/* HOTEL REVIEW SUMMARY */}
            {category === 'hotels' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/40 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0">
                    <SafeImage
                      src={ASSETS.bali}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                      <span>★★★★★ 5-Star Luxury Resort</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                        100% Free Cancellation
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {item.hotelName || item.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{item.hotelLocation || 'Candolim Beach Road, North Goa (100m to shore)'}</span>
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span>📅 Check-in: <strong>18 Oct 2026 (02:00 PM)</strong></span>
                      <span>·</span>
                      <span>📅 Check-out: <strong>21 Oct 2026 (11:00 AM)</strong></span>
                      <span>·</span>
                      <span className="text-blue-600 font-bold">3 Nights</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Coffee className="w-4 h-4 text-emerald-600" />
                    <span>Free Daily Buffet Breakfast Included</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-blue-600" />
                    <span>Free High-Speed WiFi</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Welcome Drink on Arrival</span>
                  </div>
                </div>
              </div>
            )}

            {/* TRAIN REVIEW SUMMARY */}
            {category === 'trains' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-xs">
                      IRCTC Verified
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {item.trainName || 'Vande Bharat Express'} ({item.trainNo || '20172'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="bg-slate-200 px-2 py-0.5 rounded text-xs">
                      {item.trainClass || 'Executive Chair Car (EC)'}
                    </span>
                    <span>General Quota</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-2">
                  <div className="sm:col-span-4">
                    <div className="text-2xl font-medium text-slate-900 font-mono-tabular">
                      {item.depTime?.split(' ')[0] || '06:00'}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {item.fromCity || 'New Delhi (NDLS)'}
                    </div>
                    <div className="text-xs text-slate-500">Platform 1</div>
                  </div>

                  <div className="sm:col-span-4 text-center py-2 sm:py-0">
                    <div className="text-xs font-bold text-slate-500 mb-1">
                      {item.duration || '6h 30m'}
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-slate-300" />
                      <TrainFront className="w-4 h-4 text-emerald-700 absolute bg-slate-50 px-0.5" />
                    </div>
                    <div className="text-[11px] font-bold text-emerald-700 mt-1">Superfast Speed</div>
                  </div>

                  <div className="sm:col-span-4 text-left sm:text-right">
                    <div className="text-2xl font-medium text-slate-900 font-mono-tabular">
                      {item.arrTime?.split(' ')[0] || '12:30'}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {item.toCity || 'Varanasi Jn (BSB)'}
                    </div>
                    <div className="text-xs text-slate-500">Platform 3</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ High Confirmation Probability
                  </span>
                  <span>·</span>
                  <span>Free On-board Meals Included</span>
                  <span>·</span>
                  <span>Reclining 180° Rotating Seats</span>
                </div>
              </div>
            )}

            {/* BUS REVIEW SUMMARY */}
            {category === 'buses' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/40 border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold text-purple-600 uppercase">Boarding Point</div>
                    <div className="font-bold text-sm text-slate-900">{busBoardingPoint}</div>
                    <div className="text-xs text-slate-500">Reporting 15 mins before departure</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold text-purple-600 uppercase">Dropping Point</div>
                    <div className="font-bold text-sm text-slate-900">{busDroppingPoint}</div>
                    <div className="text-xs text-slate-500">Central drop location</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span>Selected Seat: <strong className="text-slate-900 font-mono">{item.seatNumbers || 'Lower Berth L3 (Window)'}</strong></span>
                </div>
              </div>
            )}

            {/* CAB REVIEW SUMMARY */}
            {category === 'cabs' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">
                      {item.cabType || 'Sedan'}
                    </span>
                    <span className="font-bold text-slate-900">Dedicated Chauffeur Driven</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold text-blue-600 uppercase">Door-to-Door Pickup</div>
                    <div className="font-bold text-sm text-slate-900">{pickupAddress}</div>
                    <div className="text-xs text-slate-500">Scheduled: 18 Oct 2026 @ 08:30 AM</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold text-blue-600 uppercase">Destination Drop</div>
                    <div className="font-bold text-sm text-slate-900">{dropAddress}</div>
                    <div className="text-xs text-slate-500">250 km package included</div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Driver details and vehicle plate number will be sent 1 hour prior via WhatsApp and SMS.</span>
                </div>
              </div>
            )}

            {/* HOLIDAYS & EXPERIENCES SUMMARY */}
            {(category === 'holidays' || category === 'experiences') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 space-y-3">
                <div className="text-sm font-bold text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  Includes curated 5-day itinerary, partner 4★/5★ accommodation, daily breakfast, private sightseeing transfers, and 24x7 local tour concierge.
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-indigo-700 font-semibold">
                  <span>✓ Complete Flights + Resort Bundle</span>
                  <span>·</span>
                  <span>✓ English / Hindi Certified Guide</span>
                  <span>·</span>
                  <span>✓ Free Cancellation till 48h prior</span>
                </div>
              </div>
            )}
          </div>

          {/* B. PASSENGER & GUEST CONTACT DETAILS FORM */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>
                    {category === 'hotels' ? 'Guest Information' : 'Passenger Details'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Names must match original Govt photo ID proof carried during the journey.
                </p>
              </div>

              {/* Add Traveller Button */}
              <button
                type="button"
                onClick={handleAddPassenger}
                disabled={passengers.length >= 6}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Traveller</span>
              </button>
            </div>

            {/* Passenger Cards List */}
            <div className="space-y-4">
              {passengers.map((p, index) => (
                <div
                  key={p.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 relative"
                >
                  {/* Header Strip */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {index === 0 ? 'Primary Passenger' : `Passenger ${index + 1}`}
                      </span>
                      {p.isSeniorCitizen && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] border border-purple-200">
                          Senior Citizen
                        </span>
                      )}
                    </div>

                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePassenger(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Passenger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Custom Title Dropdown */}
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
                                    handleUpdatePassenger(p.id, 'title', opt.value as any);
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

                    {/* First & Middle Name */}
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        First &amp; Middle Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={p.firstName}
                        onChange={(e) => handleUpdatePassenger(p.id, 'firstName', e.target.value)}
                        placeholder="First & Middle Name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-normal text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={p.lastName}
                        onChange={(e) => handleUpdatePassenger(p.id, 'lastName', e.target.value)}
                        placeholder="Last Name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-normal text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  </div>

                  {/* Age & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Age */}
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
                        placeholder="Age"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-normal text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>

                    {/* Custom Gender Dropdown */}
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
                            className="absolute left-0 top-full mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 overflow-y-auto max-h-48 custom-scrollbar animate-modal-slide-up"
                          >
                            {GENDER_OPTIONS.map((opt) => {
                              const isSelected = p.gender === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    handleUpdatePassenger(p.id, 'gender', opt.value as any);
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
                  </div>
                </div>
              ))}
            </div>

            {/* CONTACT DETAILS & NOTIFICATIONS */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Contact Information</span>
              </h4>

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
                      placeholder="Enter Email Id"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-normal text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter Mobile Number"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-normal text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cab Specific Door Pickup Inputs */}
            {category === 'cabs' && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Pickup &amp; Drop Landmark Coordination
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Complete Pickup Address
                    </label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Flight / Train Number (For Live Delay Tracking)
                    </label>
                    <input
                      type="text"
                      value={flightOrTrainNo}
                      onChange={(e) => setFlightOrTrainNo(e.target.value)}
                      placeholder="e.g. 6E-2134 or 20172"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GST Invoice Details Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasGst}
                  onChange={(e) => setHasGst(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-700">
                  I have a GST number for business tax input credit (Optional)
                </span>
              </label>

              {hasGst && (
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Registered Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* C. CUSTOMIZATION & ADD-ONS (SEATS, MEALS, HOTEL ROOM PREFS, INSURANCE) */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>
                {category === 'flights'
                  ? 'Seat Selection & In-Flight Add-ons'
                  : category === 'hotels'
                  ? 'Room Preferences & Upgrades'
                  : category === 'trains'
                  ? 'IRCTC Catering & Auto-Upgrade'
                  : 'Trip Comfort Upgrades'}
              </span>
            </h3>

            {/* FLIGHT INTERACTIVE SEATS & MEALS */}
            {category === 'flights' && (
              <div className="space-y-4">
                {/* Visual Seat Selection Bar */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Armchair className="w-4 h-4 text-blue-600" />
                      <span>Select Preferred Seat (Selected: {selectedSeat})</span>
                    </span>
                    <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
                      Standard Seat Included
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { seat: '12A', type: 'Window', free: true },
                      { seat: '12B', type: 'Middle', free: true },
                      { seat: '12C', type: 'Aisle', free: true },
                      { seat: '14A', type: 'Window (Extra Legroom)', free: false, fee: 350 },
                      { seat: '14C', type: 'Aisle (Extra Legroom)', free: false, fee: 350 },
                      { seat: '15F', type: 'Window', free: true },
                      { seat: '16D', type: 'Aisle', free: true },
                    ].map((s) => {
                      const isSelected = selectedSeat === s.seat;
                      return (
                        <button
                          key={s.seat}
                          type="button"
                          onClick={() => {
                            setSelectedSeat(s.seat);
                            onNotify('Seat Assigned', `${s.seat} (${s.type}) selected for ${passengers[0]?.firstName || 'Primary Passenger'}.`, 'info');
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                          }`}
                        >
                          <div className="font-mono text-sm leading-none">{s.seat}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{s.type}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Meal & Extra Baggage Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span>In-Flight Meal</span>
                    </label>
                    <select
                      value={flightMeal}
                      onChange={(e) => setFlightMeal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="None">No Meal</option>
                      <option value="Veg Sandwich & Juice (+₹250)">Veg Sandwich &amp; Juice (+₹250)</option>
                      <option value="Paneer Tikka Rice Bowl (+₹350)">Paneer Tikka Rice Bowl (+₹350)</option>
                      <option value="Fruit Platter & Nuts (+₹200)">Fruit Platter &amp; Nuts (+₹200)</option>
                    </select>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Luggage className="w-4 h-4 text-blue-600" />
                      <span>Check-in Baggage</span>
                    </label>
                    <select
                      value={extraBaggage}
                      onChange={(e) => setExtraBaggage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Standard 15 kg (Included)">Standard 15 kg (Included)</option>
                      <option value="Prepaid +5 kg (+₹1,450)">Prepaid +5 kg (+₹1,450)</option>
                      <option value="Prepaid +10 kg (+₹2,750)">Prepaid +10 kg (+₹2,750)</option>
                    </select>
                  </div>
                </div>

                {/* Flight TripProtect */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="protectFlight"
                    checked={protectFlight}
                    onChange={(e) => setProtectFlight(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300 cursor-pointer"
                  />
                  <label htmlFor="protectFlight" className="cursor-pointer">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>TripProtect Comprehensive Cover (+₹299 / person)</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      Covers medical emergencies up to ₹5,00,000, 24x7 doctor teleconsultation, ₹25,000 lost luggage reimbursement, and flight delay compensation.
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* HOTEL ROOM PREFERENCES */}
            {category === 'hotels' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={prefEarlyCheckin}
                      onChange={(e) => setPrefEarlyCheckin(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Early Check-in (subject to availability)
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={prefHighFloor}
                      onChange={(e) => setPrefHighFloor(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      High Floor Room with Sea / Garden View
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={prefBedType === 'King Bed'}
                      onChange={(e) => setPrefBedType(e.target.checked ? 'King Bed' : 'Twin Beds')}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Large King Double Bed
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hotelAirportTransfer}
                      onChange={(e) => setHotelAirportTransfer(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Private Airport Transfer Cab (+₹1,400)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* TRAIN AUTO-UPGRADATION */}
            {category === 'trains' && (
              <div className="space-y-3">
                <label className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoUpgradation}
                    onChange={(e) => setAutoUpgradation(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-emerald-900">
                      Opt-in for Free IRCTC Auto-Upgradation
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Get automatically upgraded to First AC or Executive Class if seats remain vacant during chart preparation without any extra payment.
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

        </div>

        {/* ===================================================================
            RIGHT COLUMN (4 Cols): PRICE SUMMARY & COUPONS
        =================================================================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* PRICE BREAKDOWN CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Fare Breakdown</span>
              <span className="text-xs font-normal text-slate-500">
                {travellersCount} {travellersCount === 1 ? 'Traveller' : 'Travellers'}
              </span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Base Service Fare</span>
                <span className="font-mono-tabular font-bold text-slate-900">
                  {formatPrice(baseServiceFare, currency)}
                </span>
              </div>

              {categoryAddonsInr > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Selected Add-ons &amp; Insurance</span>
                  <span className="font-mono-tabular font-bold text-slate-900">
                    +{formatPrice(categoryAddonsInr, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-600">
                <span>Taxes &amp; Operational Charges</span>
                <span className="font-mono-tabular font-bold text-slate-900">
                  +{formatPrice(taxesAndFeesInr, currency)}
                </span>
              </div>

              {couponDiscountInr > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                  <span>Promo Code ({couponApplied})</span>
                  <span className="font-mono-tabular">
                    -{formatPrice(couponDiscountInr, currency)}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <div className="text-sm font-bold text-slate-900">Total Payable</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Incl. of all taxes &amp; charges</div>
                </div>
                <div className="text-2xl font-medium text-blue-700 font-mono-tabular">
                  {formatPrice(totalPayableInr, currency)}
                </div>
              </div>

              {/* CONTINUE / BOOKING BUTTON */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleProceedPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* COUPONS & PROMOS */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>Offers &amp; Promo Codes</span>
            </h4>

            <div className="flex">
              <input
                type="text"
                value={customCouponInput}
                onChange={(e) => setCustomCouponInput(e.target.value)}
                placeholder="ENTER PROMO CODE"
                className="flex-1 px-3 py-2 rounded-l-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-r-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Suggested Coupons */}
            <div className="space-y-2 pt-2">
              {[
                { code: 'TRIPSTEAL', discount: 'Flat ₹1,500 Off', desc: 'On all bookings above ₹5,000' },
                { code: 'FLYYEAH', discount: 'Flat ₹1,800 Off', desc: 'Exclusive flight festival offer' },
                { code: 'HOTEL20', discount: '20% Instant Off', desc: 'On 5-Star luxury resort suites' },
              ].map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    setCouponApplied(c.code);
                    onNotify(`Coupon ${c.code} Applied`, c.discount, 'success');
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    couponApplied === c.code
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-blue-700">{c.code}</span>
                    <span className="font-bold text-emerald-700">{c.discount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================================
          3. POST-PAYMENT CELEBRATION MODAL
      ===================================================================== */}
      {confirmedBookingData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 text-center my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                PAYMENT VERIFIED &amp; CONFIRMED
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Booking Confirmed!
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                E-Ticket &amp; vouchers sent to <strong>{email}</strong>
              </p>
            </div>

            {/* Generated Ticket Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Booking Reference / PNR:</span>
                <span className="font-mono font-medium text-sm text-blue-700">
                  {confirmedBookingData.bookingId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{confirmedBookingData.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Passenger / Lead:</span>
                <span className="font-semibold text-slate-800">{`${passengers[0]?.title} ${passengers[0]?.firstName} ${passengers[0]?.lastName}`.trim() || 'Primary Passenger'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Route / Stay:</span>
                <span className="font-semibold text-slate-800">{confirmedBookingData.routeSummary}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Allocation:</span>
                <span className="font-semibold text-slate-800">{confirmedBookingData.cabinOrRoom}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold">
                <span className="text-slate-900">Total Paid:</span>
                <span className="text-emerald-700 font-mono text-sm">
                  {formatPrice(confirmedBookingData.totalPaidInr, currency)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmedBookingData(null);
                  if (onGoToTrips) {
                    onGoToTrips();
                  } else {
                    onBackToResults();
                  }
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Go to My Trips &amp; View Digital Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive TripYeah Travel Calendar Modal */}
      {showDatePickerModal && (
        <TripDatePickerModal
          selectedDateStr={bookingTravelDate}
          title={`Select ${category.toUpperCase()} Travel Date`}
          subtitle="Choose your travel date with guaranteed seat & price lock"
          onSelectDate={(formatted) => {
            setBookingTravelDate(formatted);
            setShowDatePickerModal(false);
          }}
          onClose={() => setShowDatePickerModal(false)}
        />
      )}
    </div>
  );
};

export const CheckoutPaymentPage: React.FC<CheckoutPaymentPageProps> = (props) => {
  if (props.item.category === 'trains') {
    return <TrainBookingCheckoutPage {...props} />;
  }
  if (props.item.category === 'flights') {
    return <FlightBookingCheckoutPage {...props} />;
  }
  return <DefaultCheckoutPaymentPage {...props} />;
};
