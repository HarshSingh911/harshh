import React, { useState, useMemo, useEffect } from 'react';
import {
  TrainFront,
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
  Zap,
} from 'lucide-react';
import { BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';
import { TripDatePickerModal } from './TripDatePickerModal';

interface TrainBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
}

export interface TrainPassenger {
  id: string;
  title: 'Mr' | 'Mrs' | 'Ms' | 'Master';
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender';
  berthPref: string;
  foodPref: string;
  isSeniorCitizen?: boolean;
}

export interface TrainInfant {
  id: string;
  name: string;
  age: number; // 1 to 4
  gender: 'Male' | 'Female';
}

interface BoardingStationOption {
  code: string;
  name: string;
  time: string;
  day: string;
  distanceKm: number;
  platform: string;
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

const DEFAULT_BOARDING_STATIONS: BoardingStationOption[] = [
  { code: 'NDLS', name: 'New Delhi', time: '06:00 AM', day: 'Day 1', distanceKm: 0, platform: 'Platform 1' },
  { code: 'MTJ', name: 'Mathura Junction', time: '07:45 AM', day: 'Day 1', distanceKm: 141, platform: 'Platform 2' },
  { code: 'AGC', name: 'Agra Cantt', time: '08:35 AM', day: 'Day 1', distanceKm: 195, platform: 'Platform 1' },
  { code: 'GWL', name: 'Gwalior Junction', time: '10:10 AM', day: 'Day 1', distanceKm: 313, platform: 'Platform 3' },
  { code: 'VGLJ', name: 'VGL Jhansi Junction', time: '11:35 AM', day: 'Day 1', distanceKm: 410, platform: 'Platform 2' },
  { code: 'BINA', name: 'Bina Junction', time: '01:30 PM', day: 'Day 1', distanceKm: 563, platform: 'Platform 1' },
  { code: 'BPL', name: 'Bhopal Junction', time: '03:15 PM', day: 'Day 1', distanceKm: 702, platform: 'Platform 2' },
  { code: 'ET', name: 'Itarsi Junction', time: '04:55 PM', day: 'Day 1', distanceKm: 794, platform: 'Platform 3' },
];

const SAVED_FREQUENT_TRAVELLERS = [
  { title: 'Mr', firstName: 'Rahul', lastName: 'Sharma', age: 31, gender: 'Male', berthPref: 'Lower Berth', foodPref: 'Veg Meal' },
  { title: 'Mrs', firstName: 'Pooja', lastName: 'Sharma', age: 29, gender: 'Female', berthPref: 'Middle Berth', foodPref: 'Veg Meal' },
  { title: 'Master', firstName: 'Aarav', lastName: 'Sharma', age: 7, gender: 'Male', berthPref: 'Window Seat', foodPref: 'Veg Meal' },
  { title: 'Mr', firstName: 'Rajesh', lastName: 'Sharma', age: 62, gender: 'Male', berthPref: 'Lower Berth', foodPref: 'Jain Meal' },
];

const TRAIN_COUPONS = [
  { code: 'TRAINYEAH', title: 'Flat ₹100 Off', detail: 'Instant discount on all IRCTC train bookings', discountInr: 100 },
  { code: 'ZEROFEES', title: 'Zero Gateway Fee', detail: '100% waiver on IRCTC agent & PG charges', discountInr: 45 },
  { code: 'SUPERRAIL', title: 'Flat ₹150 Off (2+ Berths)', detail: 'For family or group train bookings', discountInr: 150, minPassengers: 2 },
];

export const TrainBookingCheckoutPage: React.FC<TrainBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
}) => {
  // Train Info Defaults
  const trainName = item.trainName || 'MMCT TEJAS RAJDHANI';
  const trainNo = item.trainNo || '12952';
  const trainClass = item.trainClass || '3A (3-Tier AC)';
  const originStation = item.fromCity || 'New Delhi (NDLS)';
  const destinationStation = item.toCity || 'Mumbai Central (MMCT)';
  const depTime = item.depTime?.split(' ')[0] || '16:55';
  const arrTime = item.arrTime?.split(' ')[0] || '08:35';
  const duration = item.duration || '15h 40m';
  const pricePerSeat = item.priceInr || 2420;
  const travelDate = item.travelDate || '18 Oct 2026';
  const seatAvailability = item.seatNumbers || 'AVAILABLE-0042';

  // 1. Boarding Station State
  const [selectedBoardingStation, setSelectedBoardingStation] = useState<BoardingStationOption>(
    DEFAULT_BOARDING_STATIONS[0]
  );
  const [showBoardingModal, setShowBoardingModal] = useState<boolean>(false);

  // 2. IRCTC User ID State
  const [irctcUserId, setIrctcUserId] = useState<string>('rahul_sharma99');
  const [isIrctcVerified, setIsIrctcVerified] = useState<boolean>(true);
  const [isVerifyingIrctc, setIsVerifyingIrctc] = useState<boolean>(false);
  const [showIrctcHelpModal, setShowIrctcHelpModal] = useState<boolean>(false);

  // 3. Dynamic Passengers State (1 to 6)
  const [passengers, setPassengers] = useState<TrainPassenger[]>([
    {
      id: 'p-1',
      title: 'Mr',
      firstName: 'Rahul',
      lastName: 'Sharma',
      age: 31,
      gender: 'Male',
      berthPref: 'Lower Berth',
      foodPref: 'Veg Meal',
    },
  ]);

  // Infants without berth
  const [infants, setInfants] = useState<TrainInfant[]>([]);

  // 4. Contact Details
  const [email, setEmail] = useState<string>('rahul.sharma@example.com');
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

  // 5. Booking Preferences
  const [autoUpgradation, setAutoUpgradation] = useState<boolean>(true);
  const [berthAllotmentRule, setBerthAllotmentRule] = useState<string>('same-coach');

  // 6. Protection & Insurance
  const [freeCancellationProtect, setFreeCancellationProtect] = useState<boolean>(true);
  const [railInsurance, setRailInsurance] = useState<boolean>(true);

  // 7. Coupons
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('TRAINYEAH');

  // 8. GST Invoicing
  const [hasGst, setHasGst] = useState<boolean>(false);
  const [gstNumber, setGstNumber] = useState<string>('07AAAAA0000A1Z5');
  const [gstCompanyName, setGstCompanyName] = useState<string>('Sharma Enterprises Pvt Ltd');
  const [gstState, setGstState] = useState<string>('Delhi');

  // 9. Policies & Advisories accordions
  const [expandedPolicy, setExpandedPolicy] = useState<'advisory' | 'refund' | 'tatkal' | null>('advisory');

  // 10. Payment & Booking state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiVpa, setUpiVpa] = useState<string>('rahulsharma@okaxis');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookedTrip | null>(null);

  // Travel Journey Date & Calendar State (Replaces countdown timer)
  const [trainTravelDate, setTrainTravelDate] = useState<string>(travelDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // --- Dynamic Pricing Calculations ---
  const passengerCount = passengers.length;
  const baseFare = pricePerSeat * passengerCount;
  const reservationCharge = 40; // Superfast + Reservation Fee
  const irctcConvenienceFee = 17.7; // ₹15 + 18% GST

  const cancelProtectionFee = freeCancellationProtect ? 99 * passengerCount : 0;
  const insuranceFee = railInsurance ? Number((0.45 * passengerCount).toFixed(2)) : 0;

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon === 'TRAINYEAH') {
    couponDiscount = 100;
  } else if (appliedCoupon === 'ZEROFEES') {
    couponDiscount = 45;
  } else if (appliedCoupon === 'SUPERRAIL' && passengerCount >= 2) {
    couponDiscount = 150;
  }

  const totalPayableInr = Math.max(
    0,
    Math.round(
      baseFare + reservationCharge + irctcConvenienceFee + cancelProtectionFee + insuranceFee - couponDiscount
    )
  );

  // --- Passenger Handlers ---
  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      onNotify('Maximum Limit Reached', 'IRCTC allows a maximum of 6 passengers per ticket booking.', 'info');
      return;
    }
    const newPassenger: TrainPassenger = {
      id: `p-${Date.now()}`,
      title: 'Mr',
      firstName: '',
      lastName: '',
      age: 28,
      gender: 'Male',
      berthPref: 'No Preference',
      foodPref: 'Veg Meal',
    };
    setPassengers([...passengers, newPassenger]);
    onNotify('Passenger Added', `Passenger ${passengers.length + 1} added. Fare updated dynamically.`, 'success');
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length === 1) {
      onNotify('Action Denied', 'At least 1 primary passenger is required to book a train ticket.', 'info');
      return;
    }
    setPassengers(passengers.filter((p) => p.id !== id));
    onNotify('Passenger Removed', 'Passenger removed. Total fare recalculated.', 'info');
  };

  const handleUpdatePassenger = (id: string, field: keyof TrainPassenger, value: any) => {
    setPassengers(
      passengers.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === 'age') {
          updated.isSeniorCitizen = Number(value) >= 60;
        }
        return updated;
      })
    );
  };

  const handleAddInfant = () => {
    if (infants.length >= 2) {
      onNotify('Infant Limit', 'Maximum 2 infants allowed per ticket without berth.', 'info');
      return;
    }
    setInfants([
      ...infants,
      {
        id: `inf-${Date.now()}`,
        name: 'Infant Child',
        age: 2,
        gender: 'Male',
      },
    ]);
    onNotify('Infant Added', 'Infant under 5 years added (free of charge as per Railway rules).', 'success');
  };

  const handleRemoveInfant = (id: string) => {
    setInfants(infants.filter((i) => i.id !== id));
  };

  const handleFastAddSavedTraveller = (saved: typeof SAVED_FREQUENT_TRAVELLERS[0]) => {
    if (passengers.length >= 6) {
      onNotify('Maximum Limit Reached', 'IRCTC allows up to 6 passengers per booking.', 'info');
      return;
    }
    const newPassenger: TrainPassenger = {
      id: `p-${Date.now()}`,
      title: saved.title as any,
      firstName: saved.firstName,
      lastName: saved.lastName,
      age: saved.age,
      gender: saved.gender as any,
      berthPref: saved.berthPref,
      foodPref: saved.foodPref,
      isSeniorCitizen: saved.age >= 60,
    };
    setPassengers([...passengers, newPassenger]);
    onNotify('Auto-Filled', `${saved.firstName} ${saved.lastName} added to passenger list.`, 'success');
  };

  // --- IRCTC Verification Simulation ---
  const handleVerifyIrctc = () => {
    if (!irctcUserId.trim()) {
      onNotify('Input Required', 'Please enter your IRCTC User ID to verify.', 'info');
      return;
    }
    setIsVerifyingIrctc(true);
    setTimeout(() => {
      setIsVerifyingIrctc(false);
      setIsIrctcVerified(true);
      onNotify(
        'IRCTC ID Verified!',
        `User ${irctcUserId} successfully authenticated with Railway Reservation System.`,
        'success'
      );
    }, 800);
  };

  // --- Coupon Handler ---
  const handleApplyCoupon = (code: string) => {
    const c = TRAIN_COUPONS.find((cp) => cp.code.toLowerCase() === code.trim().toLowerCase());
    if (!c) {
      onNotify('Invalid Coupon', 'Please enter a valid coupon code like TRAINYEAH or ZEROFEES.', 'info');
      return;
    }
    if (c.minPassengers && passengerCount < c.minPassengers) {
      onNotify(
        'Coupon Requirement',
        `Coupon ${c.code} requires minimum ${c.minPassengers} passengers on this booking.`,
        'info'
      );
      return;
    }
    setAppliedCoupon(c.code);
    onNotify('Coupon Applied!', `You saved ₹${c.discountInr} on this train booking with ${c.code}!`, 'success');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    onNotify('Coupon Removed', 'Coupon discount removed from total fare.', 'info');
  };

  // --- Final Booking & Payment Submission ---
  const handleContinueToPayment = () => {
    // 1. Validate IRCTC ID
    if (!irctcUserId.trim()) {
      onNotify('IRCTC ID Missing', 'Please enter your IRCTC User ID before proceeding.', 'info');
      return;
    }

    // 2. Validate Passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim()) {
        onNotify(
          'Incomplete Passenger Details',
          `Please enter the full name for Passenger ${i + 1}.`,
          'info'
        );
        return;
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        onNotify(
          'Invalid Age',
          `Please enter a valid age for Passenger ${i + 1} (${p.firstName || 'Passenger'}).`,
          'info'
        );
        return;
      }
    }

    // 3. Validate Contact
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      onNotify('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number for PNR updates.', 'info');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onNotify('Invalid Email', 'Please enter a valid email address to receive your ticket PDF.', 'info');
      return;
    }

    // 4. Process Payment & Reservation
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedPnr = `284-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const leadName = `${passengers[0].title} ${passengers[0].firstName} ${passengers[0].lastName}`;

      const newBooking: BookedTrip = {
        bookingId: `TRIP-TRAIN-${Date.now()}`,
        category: 'trains',
        bookingReference: generatedPnr,
        title: `${trainName} (${trainNo}) - ${trainClass}`,
        routeSummary: `${selectedBoardingStation.name} (${selectedBoardingStation.code}) → ${destinationStation}`,
        dateSummary: travelDate,
        travellers: passengerCount,
        cabinOrRoom: `${trainClass} · Coach B2, Berths ${passengers.map((_, idx) => 32 + idx * 3).join(', ')}`,
        totalPaidInr: totalPayableInr,
        studentFareApplied: false,
        status: 'Confirmed',
        bookedAt: new Date().toISOString().split('T')[0],
      };

      setConfirmedBooking(newBooking);
      onConfirmPayment(newBooking, leadName);
      onNotify('Train Berths Confirmed!', `PNR ${generatedPnr} generated. E-Ticket sent to ${email}.`, 'success');
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
              <span>Back to Train Results</span>
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-emerald-300">
                Official IRCTC Authorized Booking Gateway
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Click to view calendar and change journey date"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            <span>Journey: <strong>{trainTravelDate}</strong></span>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-mono">Calendar</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ===============================================================
              LEFT COLUMN (8 COLS): Train Details, Boarding, Passengers, IRCTC
          =============================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. TRAIN DETAILS & LIVE SEAT AVAILABILITY CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
              {/* Header: Name, No., Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                    <TrainFront className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg sm:text-xl font-black text-slate-900">
                        {trainName}
                      </h2>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        #{trainNo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                      <span>Runs: All Days</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold">Pantry Car Attached</span>
                      <span>·</span>
                      <span className="text-indigo-600 font-bold">LHB Superfast Rake</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-bold text-xs font-mono">
                    Class: {trainClass}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    General Quota
                  </span>
                </div>
              </div>

              {/* Schedule, Route & Station Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5">
                {/* Departure */}
                <div className="sm:col-span-4 text-left">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                    {depTime}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {selectedBoardingStation.name} ({selectedBoardingStation.code})
                  </div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(true)}
                      className="hover:text-emerald-700 font-bold inline-flex items-center gap-1 text-slate-700 cursor-pointer"
                      title="Change Journey Date"
                    >
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>{trainTravelDate}</span>
                    </button>
                    <span>·</span>
                    <span>{selectedBoardingStation.platform}</span>
                  </div>
                </div>

                {/* Duration Bar */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
                  <span className="text-xs font-bold text-slate-500 mb-1">{duration}</span>
                  <div className="w-full h-1 bg-slate-200 rounded-full relative flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-600 absolute right-0 shadow-xs" />
                    <TrainFront className="w-4 h-4 text-emerald-600 absolute bg-white px-0.5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Express Superfast Speed</span>
                  </span>
                </div>

                {/* Arrival */}
                <div className="sm:col-span-4 text-left sm:text-right">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                    {arrTime}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {destinationStation}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Next Day · Platform 3
                  </div>
                </div>
              </div>

              {/* Seat Availability & Boarding Station Changer Strip */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Availability Tag */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                    Current Availability:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono font-extrabold text-xs shadow-2xs">
                    {seatAvailability}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    98% High Confirmation Probability
                  </span>
                </div>

                {/* Change Boarding Station CTA */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Boarding Point:</span>
                  <button
                    type="button"
                    onClick={() => setShowBoardingModal(true)}
                    className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{selectedBoardingStation.code} ({selectedBoardingStation.name})</span>
                    <span className="underline ml-1">Change</span>
                  </button>
                </div>
              </div>

              {selectedBoardingStation.code !== 'NDLS' && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      Boarding Station changed to <strong>{selectedBoardingStation.name} ({selectedBoardingStation.code})</strong> at {selectedBoardingStation.time}. Chart will be prepared for this station.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBoardingStation(DEFAULT_BOARDING_STATIONS[0])}
                    className="text-amber-800 font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* 2. IRCTC USER LOGIN / VERIFICATION CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900">
                      IRCTC User ID Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mandatory as per Indian Railways guidelines to confirm reservation
                    </p>
                  </div>
                </div>

                {isIrctcVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified IRCTC ID</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Verification Required</span>
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={irctcUserId}
                      onChange={(e) => {
                        setIrctcUserId(e.target.value);
                        setIsIrctcVerified(false);
                      }}
                      placeholder="Enter IRCTC Username"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyIrctc}
                    disabled={isVerifyingIrctc}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isVerifyingIrctc ? 'Verifying...' : 'Verify IRCTC ID'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                  <p className="flex items-center gap-1.5 text-amber-800">
                    <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      IRCTC password will be required immediately after payment to finalize ticket creation.
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowIrctcHelpModal(true)}
                    className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                  >
                    Forgot ID or Create New?
                  </button>
                </div>
              </div>
            </div>

            {/* 3. PASSENGER DETAILS & DYNAMIC ADD TRAVELLER */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      Passenger Details
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      {passengers.length} of 6 Added
                    </span>
                  </div>
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

              {/* Fast Auto-Fill Saved Travellers */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quick Add Saved Travellers:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {SAVED_FREQUENT_TRAVELLERS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleFastAddSavedTraveller(s)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-xs font-semibold text-slate-800 hover:text-blue-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      + {s.firstName} ({s.age}, {s.gender})
                    </button>
                  ))}
                </div>
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
                            Senior Citizen (Lower Berth Priority)
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
                      {/* Title */}
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

                      {/* First & Middle Name */}
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          First &amp; Middle Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={p.firstName}
                          onChange={(e) => handleUpdatePassenger(p.id, 'firstName', e.target.value)}
                          placeholder="As per Aadhaar / Passport"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={p.lastName}
                          onChange={(e) => handleUpdatePassenger(p.id, 'lastName', e.target.value)}
                          placeholder="Surname"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Age, Gender, Berth Preference & Food Preference */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {/* Age */}
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

                      {/* Gender */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                        <select
                          value={p.gender}
                          onChange={(e) => handleUpdatePassenger(p.id, 'gender', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                        </select>
                      </div>

                      {/* Berth Preference */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Berth Preference</label>
                        <select
                          value={p.berthPref}
                          onChange={(e) => handleUpdatePassenger(p.id, 'berthPref', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Lower Berth">Lower Berth</option>
                          <option value="Middle Berth">Middle Berth</option>
                          <option value="Upper Berth">Upper Berth</option>
                          <option value="Side Lower">Side Lower</option>
                          <option value="Side Upper">Side Upper</option>
                          <option value="Window Seat">Window Seat</option>
                          <option value="No Preference">No Preference</option>
                        </select>
                      </div>

                      {/* Food Preference */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Food Preference</label>
                        <select
                          value={p.foodPref}
                          onChange={(e) => handleUpdatePassenger(p.id, 'foodPref', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Veg Meal">Veg Meal</option>
                          <option value="Non-Veg Meal">Non-Veg Meal</option>
                          <option value="Jain Meal">Jain Meal</option>
                          <option value="No Food">No Food</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Infant Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Travelling with children under 5 years?</span>
                  <button
                    type="button"
                    onClick={handleAddInfant}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    + Add Infant (Without Berth, Free)
                  </button>
                </div>

                {infants.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {infants.map((inf, idx) => (
                      <div
                        key={inf.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">Infant {idx + 1}:</span>
                          <input
                            type="text"
                            value={inf.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setInfants(infants.map((i) => (i.id === inf.id ? { ...i, name: val } : i)));
                            }}
                            placeholder="Infant Name"
                            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                          <span className="text-slate-500">Age: {inf.age} yrs (Free)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveInfant(inf.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. CONTACT DETAILS & NOTIFICATIONS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Contact Information (For E-Ticket &amp; PNR Dispatch)</span>
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

              {/* WhatsApp notification opt-in */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 mt-0.5 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-emerald-900 block">
                    Get Instant PNR Status, Platform Number &amp; Live Train Running Updates on WhatsApp
                  </span>
                  <span className="text-emerald-700">
                    Real-time alerts if your train is delayed or if the platform number changes.
                  </span>
                </div>
              </label>
            </div>

            {/* 5. RAILWAY BOOKING PREFERENCES & AUTO-UPGRADE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                Indian Railways Booking Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoUpgradation}
                    onChange={(e) => setAutoUpgradation(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Consider for Free Auto-Upgradation
                    </span>
                    <span className="text-xs text-slate-500">
                      If vacant berths exist at chart preparation, your ticket will be upgraded to the next higher AC class (e.g. 3A to 2A) without extra fee.
                    </span>
                  </div>
                </label>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">Berth Allocation Condition:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'same-coach', label: 'All berths in same coach' },
                      { id: 'lower-berth', label: 'At least 1 lower berth' },
                      { id: 'none', label: 'Book any available berths' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBerthAllotmentRule(opt.id)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-left border cursor-pointer transition-colors ${
                          berthAllotmentRule === opt.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 6. FREE CANCELLATION PROTECTION & RAIL INSURANCE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Cancellation Protection &amp; Travel Insurance
                </h3>
              </div>

              {/* Zero-Cancel Protection Card */}
              <div
                onClick={() => setFreeCancellationProtect(!freeCancellationProtect)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  freeCancellationProtect
                    ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={freeCancellationProtect}
                    onChange={() => {}}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 mt-0.5 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-900">
                        TripYeah Zero-Cancel Protection
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-600 text-white uppercase">
                        100% Refund
                      </span>
                    </div>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Get 100% full refund of ₹{baseFare} directly to your UPI/bank with zero questions asked if cancelled before chart preparation.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-slate-900">
                    +₹{99 * passengerCount}
                  </div>
                  <div className="text-[10px] text-slate-400">₹99 per passenger</div>
                </div>
              </div>

              {/* IRCTC Rail Insurance Card */}
              <div
                onClick={() => setRailInsurance(!railInsurance)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  railInsurance
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={railInsurance}
                    onChange={() => {}}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 mt-0.5 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-emerald-900 block">
                      IRCTC Travel Insurance
                    </span>
                    <span className="text-xs text-emerald-700">
                      Covers accidental hospitalization up to ₹10,00,000 &amp; baggage loss compensation.
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-slate-900">
                    +₹{(0.45 * passengerCount).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">₹0.45 per passenger</div>
                </div>
              </div>
            </div>

            {/* 7. GST STATE SELECTION & BUSINESS INVOICING */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-display font-bold text-base text-slate-900 block">
                    GST Number for Business Invoicing (Optional)
                  </span>
                  <span className="text-xs text-slate-500">
                    Claim input tax credit on your railway travel ticket
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

            {/* 8. TRAVEL ADVISORY & RAILWAY REFUND POLICY ACCORDION */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-3">
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                Railway Travel Advisory &amp; Official Refund Policies
              </h3>

              {/* Advisory Card */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedPolicy(expandedPolicy === 'advisory' ? null : 'advisory')}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Chart Preparation &amp; Boarding Timings</span>
                  </span>
                  {expandedPolicy === 'advisory' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedPolicy === 'advisory' && (
                  <div className="p-4 text-xs text-slate-600 space-y-2 bg-white border-t border-slate-200 leading-relaxed">
                    <p>
                      • <strong>Chart 1 Preparation:</strong> Usually finalized 4 hours prior to train departure (or 2 hours for trains departing between 00:01 and 06:00).
                    </p>
                    <p>
                      • <strong>Second Chart:</strong> Finalized 30 minutes before departure for last-minute vacant seat allocations.
                    </p>
                    <p>
                      • <strong>Mandatory ID Proof:</strong> Passengers must carry original physical Govt ID (Aadhaar Card, Voter ID, Driving License, Passport, PAN Card) or verifiable DigiLocker app copy.
                    </p>
                  </div>
                )}
              </div>

              {/* Refund Policy Card */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedPolicy(expandedPolicy === 'refund' ? null : 'refund')}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Cancellation Timelines &amp; TDR Refund Policy</span>
                  </span>
                  {expandedPolicy === 'refund' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedPolicy === 'refund' && (
                  <div className="p-4 text-xs text-slate-600 space-y-2 bg-white border-t border-slate-200 leading-relaxed">
                    <p>
                      • <strong>&gt; 48 hours prior to departure:</strong> Full refund minus flat clerkage charges (₹240 for 1A/EC, ₹200 for 2A, ₹180 for 3A/CC, ₹120 for SL).
                    </p>
                    <p>
                      • <strong>12 to 48 hours prior:</strong> 25% cancellation charge applies (or flat clerkage, whichever is higher).
                    </p>
                    <p>
                      • <strong>Waitlist / RAC Auto Refund:</strong> If a ticket remains in Waitlist after final chart preparation, it is automatically cancelled and 100% refund is credited back to your original payment mode within 24-48 hours.
                    </p>
                    <p>
                      • <strong>TDR Filing:</strong> If train is delayed by &gt; 3 hours or AC is not working, file TDR before actual departure to receive full refund.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN (4 COLS): Dynamic Fare Breakup & Payment CTA
          =============================================================== */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* COUPONS SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Coupons &amp; Rail Offers
                </h3>
              </div>

              {/* Coupon input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter Coupon Code"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon(couponCodeInput)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Verified Coupons Pills */}
              <div className="space-y-2 pt-1">
                {TRAIN_COUPONS.map((cp) => {
                  const isCurrent = appliedCoupon === cp.code;
                  return (
                    <div
                      key={cp.code}
                      onClick={() => (isCurrent ? handleRemoveCoupon() : handleApplyCoupon(cp.code))}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isCurrent
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
                      <span className={`text-xs font-bold ${isCurrent ? 'text-rose-600' : 'text-blue-600'}`}>
                        {isCurrent ? 'Remove' : 'Apply'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC REAL-TIME FARE BREAKUP CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Fare Summary
                </h3>
                <span className="text-xs font-bold text-blue-600">
                  {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Base Fare */}
                <div className="flex items-center justify-between text-slate-700">
                  <span>
                    Base Train Fare ({formatPrice(pricePerSeat, currency)} × {passengerCount})
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatPrice(baseFare, currency)}
                  </span>
                </div>

                {/* Reservation & Superfast Charges */}
                <div className="flex items-center justify-between text-slate-700">
                  <span>Reservation &amp; Superfast Fee</span>
                  <span className="font-mono text-slate-900">
                    {formatPrice(reservationCharge, currency)}
                  </span>
                </div>

                {/* IRCTC Fee */}
                <div className="flex items-center justify-between text-slate-700">
                  <span>IRCTC Convenience Fee (Incl. GST)</span>
                  <span className="font-mono text-slate-900">
                    {formatPrice(Math.round(irctcConvenienceFee), currency)}
                  </span>
                </div>

                {/* Cancellation Protection */}
                {freeCancellationProtect && (
                  <div className="flex items-center justify-between text-indigo-700">
                    <span>Zero Cancellation Protection ({passengerCount} pax)</span>
                    <span className="font-mono font-bold">
                      +{formatPrice(cancelProtectionFee, currency)}
                    </span>
                  </div>
                )}

                {/* Insurance */}
                {railInsurance && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>IRCTC Rail Insurance ({passengerCount} pax)</span>
                    <span className="font-mono font-bold">
                      +{formatPrice(insuranceFee, currency)}
                    </span>
                  </div>
                )}

                {/* Coupon Discount */}
                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold bg-emerald-50/70 p-2 rounded-lg">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span className="font-mono">-{formatPrice(couponDiscount, currency)}</span>
                  </div>
                )}
              </div>

              {/* Total Payable Strip */}
              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <div className="font-display text-sm font-bold text-slate-900">Total Payable</div>
                  <div className="text-[10px] text-slate-400">All Railway taxes &amp; cess included</div>
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {formatPrice(totalPayableInr, currency)}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Select Payment Option:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: '⚡ UPI' },
                    { id: 'card', label: '💳 Cards' },
                    { id: 'netbanking', label: '🏛️ NetBanking' },
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

                {paymentMethod === 'upi' && (
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="Enter UPI VPA (e.g. mobile@upi)"
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800"
                  />
                )}
              </div>

              {/* Continue to Payment CTA */}
              <button
                type="button"
                onClick={handleContinueToPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Locking Berths with IRCTC...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Continue to Payment · {formatPrice(totalPayableInr, currency)}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-400">
                🔒 Safe 256-Bit SSL Encrypted Indian Railways Certified Transaction
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===============================================================
          MODAL 1: CHANGE BOARDING STATION SELECTOR
      =============================================================== */}
      {showBoardingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Select Boarding Station
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBoardingModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              You can board from any scheduled intermediate stop on the route. Charting will allocate your berths from that station.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {DEFAULT_BOARDING_STATIONS.map((station) => {
                const isSelected = selectedBoardingStation.code === station.code;
                return (
                  <button
                    key={station.code}
                    type="button"
                    onClick={() => {
                      setSelectedBoardingStation(station);
                      setShowBoardingModal(false);
                      onNotify(
                        'Boarding Station Updated',
                        `Boarding station changed to ${station.name} (${station.code}) at ${station.time}.`,
                        'success'
                      );
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black">{station.code}</span>
                        <span className="font-bold text-sm">{station.name}</span>
                        <span className="text-[10px] text-slate-400">({station.platform})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Departure: <strong className="text-slate-700">{station.time}</strong> ({station.day}) · {station.distanceKm} km from origin
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================
          MODAL 2: FORGOT IRCTC ID / CREATE ACCOUNT HELP
      =============================================================== */}
      {showIrctcHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span>IRCTC Account Assistance</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowIrctcHelpModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">1. Forgot your IRCTC Username?</h4>
                <p>
                  Send an SMS <strong>IRCTC &lt;Your Registered Mobile No&gt;</strong> to <strong>139</strong> or check the initial confirmation email received from <em>ticketadmin@irctc.co.in</em>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">2. New to IRCTC?</h4>
                <p>
                  You can register a free account instantly on <strong>irctc.co.in</strong> using your Aadhaar/Mobile number. Registration takes less than 2 minutes.
                </p>
                <a
                  href="https://www.irctc.co.in/nget/profile/user-registration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline mt-1"
                >
                  <span>Open Official IRCTC Sign-Up Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIrctcHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* ===============================================================
          MODAL 3: BOOKING CONFIRMATION & PNR DETAILS
      =============================================================== */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900">
                Train Ticket Confirmed!
              </h2>
              <p className="text-xs text-slate-500">
                Your reservation has been successfully booked and synchronized with IRCTC.
              </p>
            </div>

            {/* PNR & Train Details Strip */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Official Railway PNR
                </span>
                <span className="font-mono text-base font-black text-emerald-900">
                  {confirmedBooking.bookingReference}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-emerald-950">
                <div>
                  <span className="text-emerald-700 block text-[10px]">Train:</span>
                  <strong className="font-bold">{trainName} (#{trainNo})</strong>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[10px]">Boarding Station:</span>
                  <strong className="font-bold">{selectedBoardingStation.name} ({selectedBoardingStation.code})</strong>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[10px]">Allocated Berths:</span>
                  <strong className="font-bold">Coach B2 · {passengers.map((_, i) => 32 + i * 3).join(', ')}</strong>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[10px]">Total Paid:</span>
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
                <span>Print E-Ticket</span>
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

      {/* Interactive TripYeah IRCTC Train Journey Calendar Modal */}
      {showDatePicker && (
        <TripDatePickerModal
          selectedDateStr={trainTravelDate}
          title="Select Train Journey Date"
          subtitle="Check live seat availability, quota status & lowest fares"
          onSelectDate={(formatted) => {
            setTrainTravelDate(formatted);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};
