import React, { useState, useMemo } from 'react';
import {
  Check,
  User,
  ShieldCheck,
  MapPin,
  Clock,
  Info,
  Sparkles,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';
import { BusResult } from './FlightSearchResultsPage';

export interface BusSeat {
  id: string; // e.g. 'L1', 'U3', 'S2'
  seatNo: string;
  deck: 'lower' | 'upper';
  type: 'sleeper' | 'seater';
  berthType: 'single' | 'double';
  position: 'window' | 'aisle';
  priceInr: number;
  status: 'available' | 'booked' | 'female';
}

interface BoardingPointOption {
  id: string;
  name: string;
  time: string;
  landmark: string;
}

interface BusSeatLayoutSelectorProps {
  bus: BusResult;
  currency: CurrencyCode;
  onProceedToBooking: (bookingDetails: {
    bus: BusResult;
    selectedSeatNumbers: string[];
    totalPriceInr: number;
    boardingPoint: string;
    droppingPoint: string;
  }) => void;
  onClose: () => void;
}

export const BusSeatLayoutSelector: React.FC<BusSeatLayoutSelectorProps> = ({
  bus,
  currency,
  onProceedToBooking,
  onClose,
}) => {
  // Active Deck Tab on mobile ('lower' | 'upper' | 'both')
  const [activeDeckTab, setActiveDeckTab] = useState<'both' | 'lower' | 'upper'>('both');

  // Selected Seats State
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['L3']);

  // Dynamic Pick-up Points based on bus.depPoint & depTime
  const boardingPoints: BoardingPointOption[] = useMemo(() => [
    {
      id: 'bp-1',
      name: bus.depPoint,
      time: '',
      landmark: '',
    },
    {
      id: 'bp-2',
      name: `${bus.depPoint.split(' ')[0]} Metro Station Gate 2`,
      time: '',
      landmark: '',
    },
    {
      id: 'bp-3',
      name: 'Expressway Highway Toll Plaza',
      time: '',
      landmark: '',
    },
    {
      id: 'bp-4',
      name: 'City Bypass Junction Boarding Point',
      time: '',
      landmark: '',
    },
  ], [bus.depPoint]);

  // Dynamic Drop-off Points based on bus.arrPoint & arrTime
  const droppingPoints: BoardingPointOption[] = useMemo(() => [
    {
      id: 'dp-1',
      name: bus.arrPoint,
      time: '',
      landmark: '',
    },
    {
      id: 'dp-2',
      name: `${bus.arrPoint.split(' ')[0]} Outer Ring Road Circle`,
      time: '',
      landmark: '',
    },
    {
      id: 'dp-3',
      name: 'Airport Junction Main Highway Bypass',
      time: '',
      landmark: '',
    },
    {
      id: 'dp-4',
      name: 'South Bus Terminal Stand',
      time: '',
      landmark: '',
    },
  ], [bus.arrPoint]);

  const [selectedBoardingId, setSelectedBoardingId] = useState<string>(boardingPoints[0].id);
  const [selectedDroppingId, setSelectedDroppingId] = useState<string>(droppingPoints[0].id);

  // Generate realistic Lower and Upper Deck Seats for this bus
  const basePrice = bus.priceInr || 1400;

  const seatsData: BusSeat[] = useMemo(() => {
    const list: BusSeat[] = [];

    // --- LOWER DECK (5 Rows, 2+1 layout: Single Sleeper on Left, Seater/Sleeper on Right) ---
    // Left Single Sleepers (Rows 1-5)
    list.push({ id: 'L1', seatNo: 'L1', deck: 'lower', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 100, status: 'available' });
    list.push({ id: 'L2', seatNo: 'L2', deck: 'lower', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 100, status: 'booked' });
    list.push({ id: 'L3', seatNo: 'L3', deck: 'lower', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 100, status: 'available' });
    list.push({ id: 'L4', seatNo: 'L4', deck: 'lower', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 100, status: 'female' });
    list.push({ id: 'L5', seatNo: 'L5', deck: 'lower', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 100, status: 'available' });

    // Right Side: Front 2 rows are Comfortable Reclining Seaters (S1-S4), Next 3 rows are Lower Sleepers (L6-L11)
    list.push({ id: 'S1', seatNo: 'S1', deck: 'lower', type: 'seater', berthType: 'double', position: 'aisle', priceInr: Math.round(basePrice * 0.85), status: 'available' });
    list.push({ id: 'S2', seatNo: 'S2', deck: 'lower', type: 'seater', berthType: 'double', position: 'window', priceInr: Math.round(basePrice * 0.85), status: 'available' });
    list.push({ id: 'S3', seatNo: 'S3', deck: 'lower', type: 'seater', berthType: 'double', position: 'aisle', priceInr: Math.round(basePrice * 0.85), status: 'booked' });
    list.push({ id: 'S4', seatNo: 'S4', deck: 'lower', type: 'seater', berthType: 'double', position: 'window', priceInr: Math.round(basePrice * 0.85), status: 'female' });

    list.push({ id: 'L6', seatNo: 'L6', deck: 'lower', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice, status: 'available' });
    list.push({ id: 'L7', seatNo: 'L7', deck: 'lower', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice, status: 'available' });
    list.push({ id: 'L8', seatNo: 'L8', deck: 'lower', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice, status: 'booked' });
    list.push({ id: 'L9', seatNo: 'L9', deck: 'lower', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice, status: 'available' });
    list.push({ id: 'L10', seatNo: 'L10', deck: 'lower', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice, status: 'available' });
    list.push({ id: 'L11', seatNo: 'L11', deck: 'lower', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice, status: 'booked' });

    // --- UPPER DECK (5 Rows, All Luxury Sleeper Berths, 2+1 layout) ---
    // Left Single Sleepers (Rows 1-5)
    list.push({ id: 'U1', seatNo: 'U1', deck: 'upper', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 150, status: 'available' });
    list.push({ id: 'U2', seatNo: 'U2', deck: 'upper', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 150, status: 'available' });
    list.push({ id: 'U3', seatNo: 'U3', deck: 'upper', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 150, status: 'female' });
    list.push({ id: 'U4', seatNo: 'U4', deck: 'upper', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 150, status: 'booked' });
    list.push({ id: 'U5', seatNo: 'U5', deck: 'upper', type: 'sleeper', berthType: 'single', position: 'window', priceInr: basePrice + 150, status: 'available' });

    // Right Double Sleepers (Rows 1-5)
    list.push({ id: 'U6', seatNo: 'U6', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice + 50, status: 'available' });
    list.push({ id: 'U7', seatNo: 'U7', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice + 50, status: 'available' });
    list.push({ id: 'U8', seatNo: 'U8', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice + 50, status: 'booked' });
    list.push({ id: 'U9', seatNo: 'U9', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice + 50, status: 'available' });
    list.push({ id: 'U10', seatNo: 'U10', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice + 50, status: 'available' });
    list.push({ id: 'U11', seatNo: 'U11', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice + 50, status: 'female' });
    list.push({ id: 'U12', seatNo: 'U12', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice + 50, status: 'available' });
    list.push({ id: 'U13', seatNo: 'U13', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice + 50, status: 'available' });
    list.push({ id: 'U14', seatNo: 'U14', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'aisle', priceInr: basePrice + 50, status: 'booked' });
    list.push({ id: 'U15', seatNo: 'U15', deck: 'upper', type: 'sleeper', berthType: 'double', position: 'window', priceInr: basePrice + 50, status: 'available' });

    return list;
  }, [basePrice]);

  const lowerSeats = useMemo(() => seatsData.filter((s) => s.deck === 'lower'), [seatsData]);
  const upperSeats = useMemo(() => seatsData.filter((s) => s.deck === 'upper'), [seatsData]);

  // Toggle seat selection
  const handleToggleSeat = (seat: BusSeat) => {
    if (seat.status === 'booked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 6) {
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  // Selected seats objects
  const selectedSeatsList = useMemo(() => {
    return seatsData.filter((s) => selectedSeatIds.includes(s.id));
  }, [seatsData, selectedSeatIds]);

  const totalSeatsPrice = useMemo(() => {
    return selectedSeatsList.reduce((acc, curr) => acc + curr.priceInr, 0);
  }, [selectedSeatsList]);

  const selectedBoardingObj = boardingPoints.find((b) => b.id === selectedBoardingId) || boardingPoints[0];
  const selectedDroppingObj = droppingPoints.find((d) => d.id === selectedDroppingId) || droppingPoints[0];

  // Render individual seat item
  const renderSeatItem = (seat: BusSeat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'booked';
    const isFemale = seat.status === 'female';

    if (seat.type === 'sleeper') {
      // Sleeper berth layout: vertical rectangle (elongated downwards) matching Indian sleeper bus diagrams
      return (
        <button
          key={seat.id}
          type="button"
          disabled={isBooked}
          onClick={() => handleToggleSeat(seat)}
          title={`Seat ${seat.seatNo} (${seat.deck === 'lower' ? 'Lower' : 'Upper'} Sleeper) - ₹${seat.priceInr}`}
          className={`relative group rounded-xl p-1.5 transition-all text-center flex flex-col justify-between items-center cursor-pointer border shrink-0 ${
            isBooked
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              : isSelected
              ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-700 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400 scale-[1.02]'
              : isFemale
              ? 'bg-pink-50 hover:bg-pink-100 border-pink-300 text-pink-700 hover:border-pink-400'
              : 'bg-white hover:bg-indigo-50/70 border-slate-300 hover:border-indigo-500 text-slate-800 shadow-2xs'
          } w-[48px] sm:w-[54px] h-[78px] sm:h-[84px]`}
        >
          {/* Headrest / Pillow graphic accent at top (horizontal pillow bar) */}
          <div
            className={`w-7 sm:w-8 h-2 rounded-xs shrink-0 transition-colors ${
              isSelected
                ? 'bg-white/40'
                : isBooked
                ? 'bg-slate-300'
                : isFemale
                ? 'bg-pink-200'
                : 'bg-slate-200 group-hover:bg-indigo-200'
            }`}
          />

          {/* Seat Number & Status */}
          <div className="flex flex-col items-center justify-center -my-0.5 w-full">
            <span className="font-mono text-xs font-black tracking-tight">{seat.seatNo}</span>
            {isSelected ? (
              <Check className="w-3.5 h-3.5 text-white stroke-[3] mt-0.5" />
            ) : isFemale ? (
              <span className="text-[10px] text-pink-500 font-bold leading-none mt-0.5">♀</span>
            ) : (
              <span className={`text-[8px] uppercase font-bold tracking-tight leading-none mt-0.5 ${
                isSelected ? 'text-emerald-100' : 'text-slate-400'
              }`}>
                Slpr
              </span>
            )}
          </div>

          {/* Price at bottom */}
          <div className="text-[9px] font-mono leading-none font-bold">
            <span className={isSelected ? 'text-emerald-100' : 'text-slate-600'}>
              ₹{seat.priceInr}
            </span>
          </div>
        </button>
      );
    }

    // Seater Chair Layout: chair shape matching column width
    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked}
        onClick={() => handleToggleSeat(seat)}
        title={`Seat ${seat.seatNo} (Seater Chair) - ₹${seat.priceInr}`}
        className={`relative group rounded-xl p-1.5 transition-all text-center flex flex-col justify-between items-center cursor-pointer border shrink-0 ${
          isBooked
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            : isSelected
            ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-700 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400 scale-[1.02]'
            : isFemale
            ? 'bg-pink-50 hover:bg-pink-100 border-pink-300 text-pink-700 hover:border-pink-400'
            : 'bg-white hover:bg-indigo-50/70 border-slate-300 hover:border-indigo-500 text-slate-800 shadow-2xs'
        } w-[48px] sm:w-[54px] h-[54px] sm:h-[58px]`}
      >
        <div
          className={`w-6 h-1 rounded-full ${
            isSelected ? 'bg-white/40' : isBooked ? 'bg-slate-300' : 'bg-slate-200'
          }`}
        />
        <div className="flex items-center justify-center gap-0.5">
          <span className="font-mono text-xs font-black">{seat.seatNo}</span>
          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
        </div>
        <div className="text-[8px] font-mono leading-none font-bold">
          <span className={isSelected ? 'text-emerald-100' : 'text-slate-600'}>
            ₹{seat.priceInr}
          </span>
        </div>
      </button>
    );
  };

  const handleBook = () => {
    if (selectedSeatIds.length === 0) return;

    onProceedToBooking({
      bus,
      selectedSeatNumbers: selectedSeatIds,
      totalPriceInr: totalSeatsPrice,
      boardingPoint: selectedBoardingObj.name,
      droppingPoint: selectedDroppingObj.name,
    });
  };

  return (
    <div className="mt-4 pt-5 border-t border-indigo-100 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-5 rounded-b-3xl shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Top Header & Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wide">
              Interior Seat Layout
            </span>
            <span className="text-sm font-bold text-slate-900">
              {bus.operator}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Double-Decker 2+1 Layout · Select your preferred seats &amp; boarding point
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-slate-300 bg-white shadow-2xs" />
            <span className="text-slate-600 text-[11px] font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span className="text-slate-600 text-[11px] font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-pink-300 bg-pink-100 text-pink-700 text-[10px] flex items-center justify-center font-bold">
              ♀
            </div>
            <span className="text-pink-700 text-[11px] font-medium">Female Only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-slate-200 bg-slate-200" />
            <span className="text-slate-400 text-[11px] font-medium">Booked</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Side Seat Decks (8 Cols) | Right Side Boarding/Dropping Selector (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* ===============================================================
            1. SEATS LAYOUT: LOWER DECK & UPPER DECK (8 COLS)
        =============================================================== */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Deck Selector Tabs on mobile */}
          <div className="flex sm:hidden items-center p-1 rounded-xl bg-slate-200/80 w-fit">
            <button
              type="button"
              onClick={() => setActiveDeckTab('both')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeDeckTab === 'both' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Both Decks
            </button>
            <button
              type="button"
              onClick={() => setActiveDeckTab('lower')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeDeckTab === 'lower' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Lower Deck
            </button>
            <button
              type="button"
              onClick={() => setActiveDeckTab('upper')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeDeckTab === 'upper' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Upper Deck
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* --- DECK 1: LOWER DECK --- */}
            {(activeDeckTab === 'both' || activeDeckTab === 'lower') && (
              <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs relative">
                {/* Deck Title */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Lower Deck
                    </span>
                  </div>
                </div>

                {/* Bus Front & Driver Cabin Representation */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100 mb-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Front Entrance</span>
                  <div className="flex items-center gap-1 text-slate-600 font-bold">
                    <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="2" x2="12" y2="9" />
                      <line x1="12" y1="15" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="9" y2="12" />
                      <line x1="15" y1="12" x2="22" y2="12" />
                    </svg>
                    <span>Driver Cabin</span>
                  </div>
                </div>

                {/* Seats Arrangement (2+1 Column Layout) */}
                <div className="flex items-start justify-center gap-2 sm:gap-4 overflow-x-auto custom-scrollbar pb-2">
                  {/* Left Column: Single Lower Sleepers (L1-L5) */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight text-center">
                      Single Window
                    </div>
                    {lowerSeats.filter((s) => s.berthType === 'single').map(renderSeatItem)}
                  </div>

                  {/* Aisle Walkway */}
                  <div className="flex flex-col items-center justify-center px-1 text-[10px] font-mono text-slate-300 self-stretch min-h-[440px] border-x border-dashed border-slate-200">
                    <span className="rotate-90 whitespace-nowrap tracking-widest text-[9px]">AISLE</span>
                  </div>

                  {/* Right Column: Front 2 Seaters (S1-S4) + 3 Lower Double Sleepers (L6-L11) */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight text-center">
                      Double Berths
                    </div>

                    {/* Front Seater Chairs Row 1 */}
                    <div className="flex items-center gap-2">
                      {lowerSeats.filter((s) => s.id === 'S1').map(renderSeatItem)}
                      {lowerSeats.filter((s) => s.id === 'S2').map(renderSeatItem)}
                    </div>

                    {/* Front Seater Chairs Row 2 */}
                    <div className="flex items-center gap-2">
                      {lowerSeats.filter((s) => s.id === 'S3').map(renderSeatItem)}
                      {lowerSeats.filter((s) => s.id === 'S4').map(renderSeatItem)}
                    </div>

                    {/* Lower Double Sleepers */}
                    <div className="flex items-center gap-2">
                      {lowerSeats.filter((s) => s.id === 'L6').map(renderSeatItem)}
                      {lowerSeats.filter((s) => s.id === 'L7').map(renderSeatItem)}
                    </div>

                    <div className="flex items-center gap-2">
                      {lowerSeats.filter((s) => s.id === 'L8').map(renderSeatItem)}
                      {lowerSeats.filter((s) => s.id === 'L9').map(renderSeatItem)}
                    </div>

                    <div className="flex items-center gap-2">
                      {lowerSeats.filter((s) => s.id === 'L10').map(renderSeatItem)}
                      {lowerSeats.filter((s) => s.id === 'L11').map(renderSeatItem)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- DECK 2: UPPER DECK --- */}
            {(activeDeckTab === 'both' || activeDeckTab === 'upper') && (
              <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs relative">
                {/* Deck Title */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Upper Deck
                    </span>
                  </div>
                </div>

                {/* Upper Deck Front Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-purple-50/50 rounded-2xl border border-purple-100 mb-4 text-[10px] text-purple-700 font-bold uppercase tracking-wider">
                  <span>Front Panoramic View</span>
                  <span>Panoramic Windshield</span>
                </div>

                {/* Upper Deck Seats Arrangement (2+1 Layout) */}
                <div className="flex items-start justify-center gap-2 sm:gap-4 overflow-x-auto custom-scrollbar pb-2">
                  {/* Left Column: Single Upper Sleepers (U1-U5) */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight text-center">
                      Single Window
                    </div>
                    {upperSeats.filter((s) => s.berthType === 'single').map(renderSeatItem)}
                  </div>

                  {/* Aisle Walkway */}
                  <div className="flex flex-col items-center justify-center px-1 text-[10px] font-mono text-slate-300 self-stretch min-h-[440px] border-x border-dashed border-slate-200">
                    <span className="rotate-90 whitespace-nowrap tracking-widest text-[9px]">AISLE</span>
                  </div>

                  {/* Right Column: Double Upper Sleepers (U6-U15) */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight text-center">
                      Double Berths
                    </div>

                    <div className="flex items-center gap-2">
                      {upperSeats.filter((s) => s.id === 'U6').map(renderSeatItem)}
                      {upperSeats.filter((s) => s.id === 'U7').map(renderSeatItem)}
                    </div>

                    <div className="flex items-center gap-2">
                      {upperSeats.filter((s) => s.id === 'U8').map(renderSeatItem)}
                      {upperSeats.filter((s) => s.id === 'U9').map(renderSeatItem)}
                    </div>

                    <div className="flex items-center gap-2">
                      {upperSeats.filter((s) => s.id === 'U10').map(renderSeatItem)}
                      {upperSeats.filter((s) => s.id === 'U11').map(renderSeatItem)}
                    </div>

                    <div className="flex items-center gap-2">
                      {upperSeats.filter((s) => s.id === 'U12').map(renderSeatItem)}
                      {upperSeats.filter((s) => s.id === 'U13').map(renderSeatItem)}
                    </div>

                    <div className="flex items-center gap-2">
                      {upperSeats.filter((s) => s.id === 'U14').map(renderSeatItem)}
                      {upperSeats.filter((s) => s.id === 'U15').map(renderSeatItem)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===============================================================
            2. RIGHT COLUMN: PICK-UP & DROP LOCATION SELECTOR (4 COLS)
        =============================================================== */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            {/* Header */}
            <div>
              <h4 className="font-display text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Select Pick-up &amp; Drop Locations</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Choose the most convenient boarding and dropping point
              </p>
            </div>

            {/* A. Pick-up / Boarding Points */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-950 flex items-center justify-between">
                <span>1. Boarding Point (Pick-up)</span>
                <span className="text-[10px] text-indigo-600 font-normal">Select 1</span>
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {boardingPoints.map((bp) => {
                  const isChecked = selectedBoardingId === bp.id;
                  return (
                    <div
                      key={bp.id}
                      onClick={() => setSelectedBoardingId(bp.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isChecked
                          ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`boarding-${bus.id}`}
                        checked={isChecked}
                        onChange={() => setSelectedBoardingId(bp.id)}
                        className="w-3.5 h-3.5 text-indigo-600 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-slate-900 block truncate">{bp.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* B. Drop-off / Dropping Points */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-950 flex items-center justify-between">
                <span>2. Dropping Point (Destination)</span>
                <span className="text-[10px] text-purple-600 font-normal">Select 1</span>
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {droppingPoints.map((dp) => {
                  const isChecked = selectedDroppingId === dp.id;
                  return (
                    <div
                      key={dp.id}
                      onClick={() => setSelectedDroppingId(dp.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isChecked
                          ? 'bg-purple-50/80 border-purple-400 text-purple-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`dropping-${bus.id}`}
                        checked={isChecked}
                        onChange={() => setSelectedDroppingId(dp.id)}
                        className="w-3.5 h-3.5 text-purple-600 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-slate-900 block truncate">{dp.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* C. Selection Summary & Book Button */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Selected Seats:</span>
                  <span className="font-mono font-black text-indigo-700">
                    {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Total Passengers:</span>
                  <span className="font-bold text-slate-800">
                    {selectedSeatIds.length} {selectedSeatIds.length === 1 ? 'Seat' : 'Seats'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold">
                  <span>Total Amount:</span>
                  <span className="font-mono text-base font-black text-slate-900">
                    {formatPrice(totalSeatsPrice, currency)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleBook}
                  disabled={selectedSeatIds.length === 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Book {selectedSeatIds.length > 0 ? `${selectedSeatIds.length} Seats` : 'Seats'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {selectedSeatIds.length === 0 && (
                <p className="text-[10px] text-center text-rose-600 font-bold">
                  * Please select at least 1 seat from the layout to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
