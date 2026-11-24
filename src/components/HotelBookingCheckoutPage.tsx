import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Calendar,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Copy,
  ExternalLink,
  FileText,
  Home,
  MapPin,
  PawPrint,
  Plane,
  Search,
  Star,
  Users,
  Utensils,
  Waves,
  Wifi,
  X,
} from 'lucide-react';
import { ASSETS, BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';
import { SafeImage } from './SafeImage';
import { NormalCalendarDropdown } from './NormalCalendarDropdown';
import hotelPoolImg from '../assets/images/hotel_gallery_exterior_pool_1795360066864.jpg';
import hotelLobbyImg from '../assets/images/hotel_gallery_lobby_lounge_1795360057197.jpg';
import hotelSuiteImg from '../assets/images/hotel_gallery_suite_interior_1795360052553.jpg';
import hotelDiningImg from '../assets/images/hotel_gallery_dining_terrace_1795360101868.jpg';

import {
  addDaysToIsoDate,
  buildHotelProviderDeals,
  calculateStayAdjustedNightlyPrice,
  calculateStayNights,
  getLowestHotelDealPrice,
  resolveHotelCountryAndCity,
  type HotelProviderDeal,
} from '../utils/hotelCompareUtils';
import {
  HotelAddressMapModal,
  HotelIntegratedMapCanvas,
  HotelLocationBlocksPanel,
  HotelMapsProvider,
} from './HotelGoogleMapSection';
import { HotelAmenitiesSection } from './HotelAmenitiesSection';

interface HotelBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
  onGoHome?: () => void;
  onGoHotels?: () => void;
  onGoCountry?: (country: string) => void;
  onGoCity?: (city: string) => void;
}

type HotelSectionId = 'overview' | 'deals' | 'location' | 'information' | 'amenities';

const SECTION_TABS: { id: HotelSectionId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'deals', label: 'Prices' },
  { id: 'location', label: 'Map' },
  { id: 'information', label: 'Policies' },
  { id: 'amenities', label: 'Amenities' },
];

export const HotelBookingCheckoutPage: React.FC<HotelBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
  onGoHome,
  onGoHotels,
  onGoCountry,
  onGoCity,
}) => {
  const hotelName = item.hotelName || item.title || 'Grand Luxury Resort & Spa';
  const location = item.hotelLocation || item.toCity || 'City Center, Near Prime Landmarks';
  const locality = item.hotelLocality || location.split(',')[0]?.trim() || 'Prime District';
  const propertyType = item.hotelPropertyType || 'Hotel & Resort';
  const stars = item.hotelStars || 5;
  const rating = item.hotelRating || 4.8;
  const reviewsCount = item.hotelReviews || 1240;
  const initialCheckIn = item.travelDate || '2026-10-15';
  const initialCheckOut = item.returnDate || '2026-10-18';
  const initialAdults = Math.max(1, item.travellers || 2);
  const parsedRoomsMatch = item.cabinClass?.match(/(\d+)/);
  const initialRooms = parsedRoomsMatch ? Math.max(1, parseInt(parsedRoomsMatch[1], 10)) : 1;
  const basePrice = Math.max(1200, item.priceInr || 4850);

  // Committed stay criteria (used for live comparison pricing & booking)
  const [activeCheckIn, setActiveCheckIn] = useState<string>(initialCheckIn);
  const [activeCheckOut, setActiveCheckOut] = useState<string>(initialCheckOut);
  const [activeRooms, setActiveRooms] = useState<number>(initialRooms);
  const [activeAdults, setActiveAdults] = useState<number>(initialAdults);

  // Draft stay criteria edited inside Compare prices bar until Search is clicked
  const [draftCheckIn, setDraftCheckIn] = useState<string>(initialCheckIn);
  const [draftCheckOut, setDraftCheckOut] = useState<string>(initialCheckOut);
  const [draftRooms, setDraftRooms] = useState<number>(initialRooms);
  const [draftAdults, setDraftAdults] = useState<number>(initialAdults);
  const [openPicker, setOpenPicker] = useState<'checkin' | 'checkout' | 'rooms' | null>(null);
  const roomsPopoverRef = useRef<HTMLDivElement>(null);

  const { country, city } = useMemo(
    () =>
      resolveHotelCountryAndCity({
        toCity: item.toCity,
        hotelLocation: item.hotelLocation,
        hotelName,
      }),
    [item.toCity, item.hotelLocation, hotelName]
  );

  // Active anchor navigation tab
  const [activeSection, setActiveSection] = useState<HotelSectionId>('overview');

  // Deals sorting
  const [dealsSort, setDealsSort] = useState<'price' | 'rating'>('price');

  // Photo Lightbox state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Website-integrated Google Maps dialog triggered by clicking the hotel address
  const [isAddressMapOpen, setIsAddressMapOpen] = useState<boolean>(false);

  // Partner handoff modal state
  const [redirectingProvider, setRedirectingProvider] = useState<HotelProviderDeal | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingPnr, setConfirmedBookingPnr] = useState<string>('');

  // Build curated hotel photo gallery (leads with the clicked hotel's own photo if available)
  const galleryPhotos = useMemo(() => {
    const baseGallery = [
      {
        url: hotelPoolImg,
        caption: `${hotelName} — Exterior & Infinity Pool Deck`,
      },
      {
        url: hotelLobbyImg,
        caption: 'Grand Reception Lobby & Guest Lounge',
      },
      {
        url: hotelSuiteImg,
        caption: 'Signature Guest Interior & Balcony View',
      },
      {
        url: hotelDiningImg,
        caption: 'Courtyard Dining & Evening Terrace',
      },
      {
        url: ASSETS.maldives,
        caption: 'Scenic Surroundings & Relaxation Grounds',
      },
    ];

    if (item.hotelImage && item.hotelImage !== hotelPoolImg) {
      return [
        {
          url: item.hotelImage,
          caption: `${hotelName} — Property Exterior & View`,
        },
        ...baseGallery.slice(0, 4),
        baseGallery[4],
      ];
    }

    return baseGallery;
  }, [item.hotelImage, hotelName]);

  const adjustedBasePrice = useMemo(
    () => calculateStayAdjustedNightlyPrice(basePrice, activeRooms, activeAdults),
    [basePrice, activeRooms, activeAdults]
  );

  const draftNights = useMemo(
    () => calculateStayNights(draftCheckIn, draftCheckOut),
    [draftCheckIn, draftCheckOut]
  );

  // Comparison Sites / Provider Deals list
  const providerDeals: HotelProviderDeal[] = useMemo(
    () => buildHotelProviderDeals(hotelName, dealsSort),
    [hotelName, dealsSort]
  );

  const lowestDealPrice = useMemo(
    () => getLowestHotelDealPrice(adjustedBasePrice, providerDeals),
    [adjustedBasePrice, providerDeals]
  );

  // Close Rooms & Adults popover on outside click / Escape
  useEffect(() => {
    if (openPicker !== 'rooms') return;
    const handleMouseDown = (e: MouseEvent) => {
      if (roomsPopoverRef.current && !roomsPopoverRef.current.contains(e.target as Node)) {
        setOpenPicker(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPicker(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPicker]);

  const handleApplyCompareSearch = () => {
    setOpenPicker(null);
    setActiveCheckIn(draftCheckIn);
    setActiveCheckOut(draftCheckOut);
    setActiveRooms(draftRooms);
    setActiveAdults(draftAdults);
    onNotify(
      'Compare Prices Updated',
      `${formatDisplayDate(draftCheckIn)} – ${formatDisplayDate(draftCheckOut)} · ${draftRooms} ${
        draftRooms === 1 ? 'Room' : 'Rooms'
      }, ${draftAdults} ${draftAdults === 1 ? 'Adult' : 'Adults'}`,
      'info'
    );
  };

  // Smooth scroll to section when clicking horizontal heading tabs
  const scrollToSection = useCallback((sectionId: HotelSectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(`hotel-sec-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Automatically highlight active section tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollOffset = window.scrollY + 80;
      let current: HotelSectionId = 'overview';

      for (const tab of SECTION_TABS) {
        const el = document.getElementById(`hotel-sec-${tab.id}`);
        if (el && el.offsetTop <= scrollOffset) {
          current = tab.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation in Photo Lightbox
  useEffect(() => {
    if (!isGalleryOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryOpen(false);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % galleryPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, galleryPhotos.length]);

  const handleSelectSite = (provider: HotelProviderDeal) => {
    setRedirectingProvider(provider);
    setBookingConfirmed(false);
  };

  const handleFinalizePartnerBooking = (provider: HotelProviderDeal) => {
    const finalFare = adjustedBasePrice + provider.priceDelta;
    const generatedRef = `TY-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedBookingPnr(generatedRef);

    const bookingRecord: BookedTrip = {
      id: `booking-${Date.now()}`,
      bookingId: generatedRef,
      bookingReference: generatedRef,
      category: 'hotels',
      title: hotelName,
      routeSummary: location,
      dateSummary: `${formatDisplayDate(activeCheckIn)} – ${formatDisplayDate(activeCheckOut)}`,
      travellers: activeAdults,
      cabinOrRoom: `${activeRooms} Room${activeRooms > 1 ? 's' : ''} · Booked via ${provider.name}`,
      totalPaidInr: finalFare,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: 'Just now',
      departureDate: activeCheckIn,
      returnDate: activeCheckOut,
      hotelAddress: location,
      carrierOrHotel: `${hotelName} via ${provider.name}`,
      passengers: [{ name: `Lead Guest (${activeAdults} Adults)`, age: 30, gender: 'Adult' }],
      pnr: generatedRef,
      isDemo: false,
    };

    onConfirmPayment(bookingRecord, 'Verified Guest');
    setBookingConfirmed(true);
    onNotify(
      'Hotel Booking Confirmed!',
      `Reserved via ${provider.name}. Confirmation Ref: ${generatedRef}`,
      'success'
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        const [y, m, d] = parts;
        const dateObj = new Date(Date.UTC(y, m - 1, d));
        return dateObj.toLocaleDateString('en-US', {
          timeZone: 'UTC',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(`${hotelName}, ${location}`);
    onNotify('Address Copied', `${hotelName}, ${location} copied to clipboard.`, 'info');
  };

  const ratingLabel = rating >= 4.8 ? 'Exceptional' : rating >= 4.5 ? 'Wonderful' : 'Very Good';

  return (
    <HotelMapsProvider hotelName={hotelName} location={location} city={city} country={country}>
      <div className="bg-white min-h-screen text-slate-900 pb-24 font-sans">
      {/* ===================================================================
          1. SEAMLESS OCEAN-NAVY SECOND HEADER — CLICKABLE BREADCRUMB ROW
             Home > Hotels > Country > City > Hotel Name
      =================================================================== */}
      <section className="bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] pt-[70px] pb-3.5 relative shadow-sm border-b border-white/10">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1 sm:gap-1.5 text-xs sm:text-[13px] font-medium"
          >
            <button
              type="button"
              onClick={() => (onGoHome ? onGoHome() : onBackToResults())}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              <Home className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>Home</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={() => (onGoHotels ? onGoHotels() : onBackToResults())}
              className="px-2.5 py-1 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              Hotels
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={() =>
                onGoCountry ? onGoCountry(country) : onBackToResults()
              }
              className="px-2.5 py-1 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              {country}
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={() =>
                onGoCity ? onGoCity(city) : onBackToResults()
              }
              className="px-2.5 py-1 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              {city}
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                setActiveSection('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current="page"
              className="px-2.5 py-1 rounded-lg text-white font-semibold bg-white/10 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer truncate max-w-[240px] sm:max-w-md lg:max-w-2xl"
              title={hotelName}
            >
              {hotelName}
            </button>
          </nav>
        </div>
      </section>

      {/* ===================================================================
          2. OVERVIEW — EDGE-TO-EDGE CORNER-TO-CORNER IMAGES ONLY
      =================================================================== */}
      <section id="hotel-sec-overview" className="scroll-mt-14 w-full bg-white">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1.5 overflow-hidden">
          {/* Large Primary Hero Photo */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Open photo gallery: ${galleryPhotos[0].caption}`}
            onClick={() => {
              setActivePhotoIndex(0);
              setIsGalleryOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActivePhotoIndex(0);
                setIsGalleryOpen(true);
              }
            }}
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer h-[280px] sm:h-[360px] md:h-[440px] overflow-hidden bg-slate-100"
          >
            <SafeImage
              src={galleryPhotos[0].url}
              alt={galleryPhotos[0].caption}
              fallbackTitle={hotelName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
          </div>

          {/* 4 Secondary Grid Photos */}
          {galleryPhotos.slice(1, 5).map((photo, idx) => {
            const photoIdx = idx + 1;
            const isLastVisible = idx === 3;

            return (
              <div
                key={photoIdx}
                role="button"
                tabIndex={0}
                aria-label={`Open photo ${photoIdx + 1}: ${photo.caption}`}
                onClick={() => {
                  setActivePhotoIndex(photoIdx);
                  setIsGalleryOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePhotoIndex(photoIdx);
                    setIsGalleryOpen(true);
                  }
                }}
                className="relative group cursor-pointer h-[160px] sm:h-[190px] md:h-[217px] overflow-hidden bg-slate-100"
              >
                <SafeImage
                  src={photo.url}
                  alt={photo.caption}
                  fallbackTitle={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />

                {isLastVisible && (
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-xs font-semibold shadow-sm transition-colors">
                      <Camera className="w-3.5 h-3.5 text-slate-700" />
                      <span>Show all {galleryPhotos.length} photos</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================
          3. HOTEL NAME HEADER (BELOW IMAGES, ABOVE THE OVERVIEW ROW)
      =================================================================== */}
      <section className="bg-white pt-6 pb-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              {/* Quiet unboxed metadata line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: stars }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </span>
                <span>{stars}-Star {propertyType}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">
                {hotelName}
              </h2>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                <button
                  type="button"
                  onClick={() => setIsAddressMapOpen(true)}
                  aria-label={`Open ${hotelName} address on integrated Google Maps`}
                  className="inline-flex items-center gap-1.5 text-left text-slate-700 hover:text-blue-700 hover:underline underline-offset-4 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{location}</span>
                </button>
              </div>
            </div>

            {/* Guest Score */}
            <div className="flex items-center justify-between lg:justify-end shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-left sm:text-right">
                  <div className="text-sm font-semibold text-slate-900">{ratingLabel}</div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    {reviewsCount.toLocaleString()} verified reviews
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center tabular-nums">
                  {rating.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. HORIZONTAL SECTION HEADINGS BAR (STICKS AT TOP WHEN SCROLLED)
             Overview | Compare prices | Location | Information | Amenities
      =================================================================== */}
      <nav
        aria-label="Hotel sections"
        className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-7 sm:gap-10 overflow-x-auto no-scrollbar">
            {SECTION_TABS.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`py-4 sm:py-[18px] text-[15px] whitespace-nowrap shrink-0 border-b-[3px] transition-colors cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-5 shrink-0 py-2.5">
            <div className="text-right leading-none">
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                {formatPrice(lowestDealPrice, currency)}
              </span>
              <span className="text-sm font-medium text-slate-500 ml-1">/ night</span>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('deals')}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] hover:from-[#072a4f] hover:via-[#093461] hover:to-[#0d437c] text-white shadow-sm shadow-[#05203c]/25 hover:shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              View Prices
            </button>
          </div>
        </div>
      </nav>

      {/* ===================================================================
          SECTION 2: COMPARE PRICES (GREYISH BACKGROUND ONLY FOR THIS BLOCK)
      =================================================================== */}
      <section
        id="hotel-sec-deals"
        className="scroll-mt-14 w-full bg-[#eef2f6] border-y border-slate-200/80 py-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Compare prices
              </h2>
              <p className="text-sm text-slate-600">
                We check multiple booking sites so you get the best deal
              </p>
            </div>

            <div className="inline-flex flex-col items-stretch gap-2 w-fit max-w-full shrink-0">
              {/* Circular logos row for all available hotel booking sites */}
              <div
                data-testid="compare-sites-logo-strip"
                className="flex items-center flex-wrap gap-1.5"
                aria-label="Available booking websites"
              >
                {providerDeals.map((provider) => {
                  const scrollToSite = () => {
                    const target = document.getElementById(`hotel-deal-site-${provider.id}`);
                    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  };

                  const renderCircleMark = () => {
                    switch (provider.id) {
                      case 'tripyeah-hotels-direct':
                        return (
                          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#05203c] to-[#2563eb] text-white ring-1 ring-white shadow-xs inline-flex items-center justify-center text-[10px] font-extrabold tracking-tight font-display">
                            TY
                          </span>
                        );
                      case 'agoda':
                        return (
                          <span className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs inline-flex flex-col items-center justify-center leading-none">
                            <span className="text-[11px] font-extrabold text-slate-900 -mb-[1px] font-display">
                              a
                            </span>
                            <span className="flex items-center gap-[1.5px]" aria-hidden="true">
                              <span className="w-[3px] h-[3px] rounded-full bg-[#e12d39]" />
                              <span className="w-[3px] h-[3px] rounded-full bg-[#f59e0b]" />
                              <span className="w-[3px] h-[3px] rounded-full bg-[#10b981]" />
                              <span className="w-[3px] h-[3px] rounded-full bg-[#8b5cf6]" />
                              <span className="w-[3px] h-[3px] rounded-full bg-[#06b6d4]" />
                            </span>
                          </span>
                        );
                      case 'booking-com':
                        return (
                          <span className="w-7 h-7 rounded-full bg-[#003580] ring-1 ring-white shadow-xs inline-flex items-center justify-center text-[12px] font-extrabold leading-none font-display">
                            <span className="text-white">B</span>
                            <span className="text-[#009fe3]">.</span>
                          </span>
                        );
                      case 'makemytrip-hotels':
                        return (
                          <span className="w-7 h-7 rounded-full bg-[#eb2026] text-white ring-1 ring-white shadow-xs inline-flex items-center justify-center text-[11px] font-extrabold italic tracking-tight font-display">
                            my
                          </span>
                        );
                      case 'hotel-official':
                        return (
                          <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-300 ring-1 ring-white shadow-xs inline-flex items-center justify-center">
                            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        );
                      case 'expedia':
                        return (
                          <span className="w-7 h-7 rounded-full bg-[#001959] ring-1 ring-white shadow-xs inline-flex items-center justify-center gap-0.5">
                            <span className="w-[5px] h-[5px] rounded-full bg-[#febb02] shrink-0" aria-hidden="true" />
                            <span className="text-[10px] font-extrabold text-white leading-none font-display">
                              E
                            </span>
                          </span>
                        );
                      case 'hotels-com':
                        return (
                          <span className="w-7 h-7 rounded-full bg-[#d32f2f] text-white ring-1 ring-white shadow-xs inline-flex items-center justify-center text-[11px] font-extrabold leading-none font-display">
                            H.
                          </span>
                        );
                      case 'goibibo-hotels':
                      default:
                        return (
                          <span className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs inline-flex items-center justify-center text-[10px] font-extrabold leading-none font-display">
                            <span className="text-[#ff6d38]">g</span>
                            <span className="text-[#2276e3]">o</span>
                          </span>
                        );
                    }
                  };

                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={scrollToSite}
                      title={provider.name}
                      aria-label={provider.name}
                      data-testid={`compare-site-circle-${provider.id}`}
                      className="rounded-full transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer shrink-0"
                    >
                      {renderCircleMark()}
                    </button>
                  );
                })}
              </div>

              {/* Interactive sort segmented control */}
              <div
                data-testid="compare-sort-toggle"
                className="grid grid-cols-2 items-center gap-1 p-1 rounded-lg bg-slate-200/80 w-full"
              >
                <button
                  type="button"
                  onClick={() => setDealsSort('price')}
                  className={`w-full px-3 py-1.5 rounded-md text-xs font-medium text-center transition-colors cursor-pointer whitespace-nowrap ${
                    dealsSort === 'price'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lowest price
                </button>
                <button
                  type="button"
                  onClick={() => setDealsSort('rating')}
                  className={`w-full px-3 py-1.5 rounded-md text-xs font-medium text-center transition-colors cursor-pointer whitespace-nowrap ${
                    dealsSort === 'rating'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Highest rated
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Check-in / Check-out Calendar + Rooms & Adults + Search Bar */}
          <div
            data-testid="hotel-deals-search-bar"
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 sm:p-3 mb-2"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
              {/* Block 1: Full Check-in & Check-out Calendar Block */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 bg-slate-50/90 border border-slate-200/90 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200/90 relative">
                {/* Check-in */}
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Select check-in date"
                    onClick={() => setOpenPicker(openPicker === 'checkin' ? null : 'checkin')}
                    className={`w-full h-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none transition-colors cursor-pointer ${
                      openPicker === 'checkin'
                        ? 'bg-blue-50/80'
                        : 'hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Calendar className="w-4 h-4 text-[#072a4f] shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[11px] font-medium text-slate-500">
                          Check-in
                        </span>
                        <span className="block text-sm font-bold text-slate-900 truncate">
                          {formatDisplayDate(draftCheckIn)}
                        </span>
                      </div>
                    </div>
                  </button>

                  {openPicker === 'checkin' && (
                    <NormalCalendarDropdown
                      selectedDate={draftCheckIn}
                      minDate="2026-10-15"
                      onSelectDate={(newIn) => {
                        setDraftCheckIn(newIn);
                        if (draftCheckOut <= newIn) {
                          setDraftCheckOut(addDaysToIsoDate(newIn, 1));
                        }
                      }}
                      onClose={() => setOpenPicker(null)}
                      alignRight={false}
                    />
                  )}
                </div>

                {/* Check-out */}
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Select check-out date"
                    onClick={() => setOpenPicker(openPicker === 'checkout' ? null : 'checkout')}
                    className={`w-full h-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none transition-colors cursor-pointer ${
                      openPicker === 'checkout'
                        ? 'bg-blue-50/80'
                        : 'hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Calendar className="w-4 h-4 text-[#072a4f] shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[11px] font-medium text-slate-500">
                          Check-out
                        </span>
                        <span className="block text-sm font-bold text-slate-900 truncate">
                          {formatDisplayDate(draftCheckOut)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shrink-0 tabular-nums">
                      {draftNights} {draftNights === 1 ? 'night' : 'nights'}
                    </span>
                  </button>

                  {openPicker === 'checkout' && (
                    <NormalCalendarDropdown
                      selectedDate={draftCheckOut}
                      minDate={addDaysToIsoDate(draftCheckIn, 1)}
                      onSelectDate={(newOut) => setDraftCheckOut(newOut)}
                      onClose={() => setOpenPicker(null)}
                      alignRight={true}
                    />
                  )}
                </div>
              </div>

              {/* Block 2: Rooms & Adults Selector Block */}
              <div className="lg:col-span-4 relative" ref={roomsPopoverRef}>
                <button
                  type="button"
                  aria-label="Select rooms and adults"
                  aria-expanded={openPicker === 'rooms'}
                  onClick={() => setOpenPicker(openPicker === 'rooms' ? null : 'rooms')}
                  className={`w-full h-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    openPicker === 'rooms'
                      ? 'bg-blue-50/80 border-blue-500'
                      : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Users className="w-4 h-4 text-[#072a4f] shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[11px] font-medium text-slate-500">
                        Rooms &amp; Adults
                      </span>
                      <span className="block text-sm font-bold text-slate-900 truncate">
                        {draftRooms} {draftRooms === 1 ? 'Room' : 'Rooms'} · {draftAdults}{' '}
                        {draftAdults === 1 ? 'Adult' : 'Adults'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                      openPicker === 'rooms' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openPicker === 'rooms' && (
                  <div className="absolute right-0 left-0 sm:left-auto top-full mt-2 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Rooms</div>
                        <div className="text-[11px] text-slate-500">Select number of rooms</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          aria-label="Decrease rooms"
                          disabled={draftRooms <= 1}
                          onClick={() => setDraftRooms((r) => Math.max(1, r - 1))}
                          className="w-8 h-8 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-sm font-bold tabular-nums text-slate-900">
                          {draftRooms}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase rooms"
                          disabled={draftRooms >= 10}
                          onClick={() => setDraftRooms((r) => Math.min(10, r + 1))}
                          className="w-8 h-8 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Adults</div>
                        <div className="text-[11px] text-slate-500">Ages 13+</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          aria-label="Decrease adults"
                          disabled={draftAdults <= 1}
                          onClick={() => setDraftAdults((a) => Math.max(1, a - 1))}
                          className="w-8 h-8 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-sm font-bold tabular-nums text-slate-900">
                          {draftAdults}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase adults"
                          disabled={draftAdults >= 16}
                          onClick={() => setDraftAdults((a) => Math.min(16, a + 1))}
                          className="w-8 h-8 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenPicker(null)}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Block 3: Search Button */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={handleApplyCompareSearch}
                  className="w-full h-full min-h-[50px] px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] hover:from-[#072a4f] hover:via-[#093461] hover:to-[#0d437c] text-white font-bold text-sm shadow-sm shadow-[#05203c]/25 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-500 px-1 mb-5">
            Taxes and fees not included
          </p>

          {/* Single unified block containing all booking sites */}
          <div
            data-testid="compare-prices-sites-block"
            className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-200 overflow-hidden"
          >
            {providerDeals.map((provider) => {
              const nightlyPrice = adjustedBasePrice + provider.priceDelta;
              const shortBrand = hotelName.split(' ')[0] || 'Hotel';

              const renderWordmark = () => {
                switch (provider.id) {
                  case 'agoda':
                    return (
                      <div className="inline-flex flex-col items-start select-none" aria-label="agoda">
                        <span className="text-[23px] font-extrabold tracking-tight text-slate-900 leading-none font-display">
                          agoda
                        </span>
                        <span className="flex items-center gap-1 mt-1" aria-hidden="true">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e12d39]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
                        </span>
                      </div>
                    );
                  case 'booking-com':
                    return (
                      <span className="text-[20px] font-extrabold tracking-tight leading-none font-display select-none">
                        <span className="text-[#003580]">Booking</span>
                        <span className="text-[#009fe3]">.com</span>
                      </span>
                    );
                  case 'makemytrip-hotels':
                    return (
                      <span className="text-[20px] font-extrabold tracking-tight leading-none font-display select-none">
                        <span className="text-[#05203c]">make</span>
                        <span className="text-[#eb2026] italic">my</span>
                        <span className="text-[#05203c]">trip</span>
                      </span>
                    );
                  case 'tripyeah-hotels-direct':
                    return (
                      <span className="inline-flex items-baseline gap-1.5 leading-none font-display select-none">
                        <span className="text-[20px] font-extrabold tracking-tight">
                          <span className="text-[#05203c]">Trip</span>
                          <span className="text-blue-600">Yeah</span>
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Hotels</span>
                      </span>
                    );
                  case 'expedia':
                    return (
                      <span className="inline-flex items-center gap-1.5 text-[20px] font-extrabold tracking-tight text-[#001959] leading-none font-display select-none">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#febb02] inline-block shrink-0" aria-hidden="true" />
                        <span>Expedia</span>
                      </span>
                    );
                  case 'hotels-com':
                    return (
                      <span className="text-[20px] font-extrabold tracking-tight text-[#d32f2f] leading-none font-display select-none">
                        Hotels.com
                      </span>
                    );
                  case 'goibibo-hotels':
                    return (
                      <span className="text-[21px] font-extrabold tracking-tight leading-none font-display select-none">
                        <span className="text-[#ff6d38]">go</span>
                        <span className="text-[#2276e3]">ibibo</span>
                      </span>
                    );
                  case 'hotel-official':
                  default:
                    return (
                      <span className="inline-flex items-baseline gap-2 leading-none select-none">
                        <span className="font-serif text-[19px] font-bold tracking-tight text-slate-900">
                          {shortBrand}
                        </span>
                        <span className="text-xs font-medium text-slate-500">Official Site</span>
                      </span>
                    );
                }
              };

              return (
                <div
                  key={provider.id}
                  id={`hotel-deal-site-${provider.id}`}
                  className="scroll-mt-20 p-4 sm:p-5 bg-white hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Site Logo Wordmark, Room/Bed Type & 2-3 Policy Points */}
                  <div className="space-y-2 min-w-0">
                    <div>{renderWordmark()}</div>

                    <div className="text-sm font-semibold text-slate-900">
                      {provider.roomType}
                    </div>

                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      {provider.policies.slice(0, 3).map((policy) => {
                        const isNegative = /non-refundable|not included/i.test(policy);
                        return (
                          <li
                            key={policy}
                            className={`inline-flex items-center gap-1.5 font-medium ${
                              isNegative ? 'text-slate-500' : 'text-emerald-700'
                            }`}
                          >
                            {isNegative ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                            <span>{policy}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Price & Go to Site CTA */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">
                        {formatPrice(nightlyPrice, currency)}
                      </div>
                      <div className="text-[11px] text-slate-500">per night</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectSite(provider)}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] hover:from-[#072a4f] hover:via-[#093461] hover:to-[#0d437c] text-white shadow-sm shadow-[#05203c]/25 hover:shadow-md active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <span>Go to site</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          MAIN CONTENT STACK (PURE WHITE BACKGROUND FOR LOCATION, INFO, AMENITIES)
      =================================================================== */}
      <main className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 divide-y divide-slate-200">

        {/* -----------------------------------------------------------------
            SECTION 3: MAP (INTEGRATED GOOGLE MAP + ATTRACTIONS / TRANSIT / AIRPORT)
        ----------------------------------------------------------------- */}
        <section id="hotel-sec-location" className="scroll-mt-14 py-10 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Map
              </h2>
              <p className="text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{location}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Clean Integrated Google Map Panel (no extra overlay text or widgets inside) */}
            <div className="lg:col-span-7">
              <HotelIntegratedMapCanvas stars={stars} />
            </div>

            {/* 3 Blocks: Attractions, Transit, Airport */}
            <div className="lg:col-span-5">
              <HotelLocationBlocksPanel />
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            SECTION 4: POLICIES
        ----------------------------------------------------------------- */}
        <section id="hotel-sec-information" className="scroll-mt-14 py-10 bg-white space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Policies
          </h2>

          {/* Large Check-in & Check-out Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 sm:divide-x divide-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#072a4f] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Check-in
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums mt-1">
                    02:00 PM
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                    24-hour front desk · Early check-in subject to availability
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:pl-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                <div className="w-11 h-11 rounded-xl bg-[#072a4f] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Check-out
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums mt-1">
                    11:00 AM
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                    Express check-out available · Late check-out on request
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Before you go */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display">Before you go</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <PawPrint className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900">Pets</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Pets are not allowed at {hotelName} (certified service animals are welcome).
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900">Extra beds &amp; cribs</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Extra beds and baby cribs depend on the room you choose. Please contact the
                    hotel directly before arrival to check availability and charges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display">What to expect</h3>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {galleryPhotos.slice(0, 3).map((photo, index) => (
                  <div
                    key={index}
                    className="h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100"
                  >
                    <SafeImage
                      src={photo.url}
                      alt={photo.caption}
                      fallbackTitle={hotelName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Set in the heart of{' '}
                  {locality.toLowerCase() === city.toLowerCase() ? city : `${locality}, ${city}`},{' '}
                  {hotelName} offers {stars}-star hospitality with spacious modern rooms, an outdoor
                  pool deck, and courtyard evening dining. Guests can unwind on private balconies or
                  step straight out to explore {city}&apos;s vibrant neighborhoods.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <Plane className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Airport distance:</span>{' '}
                      International Airport is approximately 24 km away (~35 min drive; airport
                      transfers available on request).
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <Coffee className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Cafés &amp; dining nearby:</span>{' '}
                      {locality} Promenade Cafés, artisan bakery spots, and seaside restaurants are
                      within a 5-minute walk (450 m).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            SECTION 5: AMENITIES
        ----------------------------------------------------------------- */}
        <section id="hotel-sec-amenities" className="scroll-mt-14 py-10 bg-white">
          <HotelAmenitiesSection amenities={item.hotelAmenities} variant="checkout" />
        </section>
      </main>

      {/* =====================================================================
          PHOTO GALLERY LIGHTBOX MODAL
      ===================================================================== */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between p-4 sm:p-6">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="min-w-0 pr-4">
              <h3 className="font-display font-semibold text-base sm:text-lg truncate">
                {hotelName}
              </h3>
              <p className="text-xs text-white/70 truncate">
                Photo {activePhotoIndex + 1} of {galleryPhotos.length} ·{' '}
                {galleryPhotos[activePhotoIndex]?.caption}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsGalleryOpen(false)}
              aria-label="Close photo gallery"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 relative">
            <SafeImage
              src={galleryPhotos[activePhotoIndex]?.url || hotelPoolImg}
              alt={galleryPhotos[activePhotoIndex]?.caption || hotelName}
              fallbackTitle={hotelName}
              className="max-h-[72vh] max-w-full rounded-xl object-contain"
            />

            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length)
              }
              aria-label="Previous photo"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setActivePhotoIndex((prev) => (prev + 1) % galleryPhotos.length)}
              aria-label="Next photo"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-3 border-t border-white/10">
            {galleryPhotos.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActivePhotoIndex(i)}
                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activePhotoIndex === i
                    ? 'border-blue-500 opacity-100'
                    : 'border-transparent opacity-55 hover:opacity-90'
                }`}
              >
                <SafeImage
                  src={img.url}
                  alt={img.caption}
                  fallbackTitle={img.caption}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          PARTNER HAND-OFF & CONFIRMATION MODAL
      ===================================================================== */}
      {redirectingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-center space-y-5">
            {!bookingConfirmed ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <ExternalLink className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900">
                    Continue to {redirectingProvider.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    You&apos;ll choose your preferred room type, meal plan, and cancellation option directly on{' '}
                    {redirectingProvider.name}.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 gap-3">
                    <span className="font-semibold text-slate-900 truncate">{hotelName}</span>
                    <span className="font-bold text-emerald-700 text-sm tabular-nums shrink-0">
                      {formatPrice(adjustedBasePrice + redirectingProvider.priceDelta, currency)} / night
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Location:</span> {location}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Stay dates:</span>{' '}
                    {formatDisplayDate(activeCheckIn)} – {formatDisplayDate(activeCheckOut)} ({activeRooms}{' '}
                    {activeRooms === 1 ? 'Room' : 'Rooms'}, {activeAdults} Adult
                    {activeAdults > 1 ? 's' : ''})
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFinalizePartnerBooking(redirectingProvider)}
                    className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Complete Booking on {redirectingProvider.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedirectingProvider(null)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Cancel &amp; compare other sites
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">Hotel Booking Confirmed</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your reservation has been recorded with {redirectingProvider.name}.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Confirmation Ref</span>
                    <span className="font-semibold text-emerald-700 tabular-nums">
                      {confirmedBookingPnr}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Property</span>
                    <span className="font-semibold text-slate-900 text-right">{hotelName}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Check-in</span>
                    <span className="font-semibold text-slate-900">
                      {formatDisplayDate(activeCheckIn)} (02:00 PM)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRedirectingProvider(null);
                      onGoToTrips?.();
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View in My Trips &amp; Hotel Voucher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRedirectingProvider(null);
                      onBackToResults();
                    }}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Search more hotels
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Full-Page Website-Integrated Google Maps Explorer when clicking the hotel address */}
      <HotelAddressMapModal
        isOpen={isAddressMapOpen}
        onClose={() => setIsAddressMapOpen(false)}
        hotelName={hotelName}
        location={location}
        stars={stars}
        hotelImage={galleryPhotos[0]?.url}
        rating={rating}
        reviewsCount={reviewsCount}
        propertyType={propertyType}
        formattedPrice={formatPrice(lowestDealPrice, currency)}
      />
      </div>
    </HotelMapsProvider>
  );
};
