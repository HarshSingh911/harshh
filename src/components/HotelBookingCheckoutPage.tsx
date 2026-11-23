import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Copy,
  Dumbbell,
  ExternalLink,
  FileText,
  Globe,
  Info,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
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
import hotelPoolImg from '../assets/images/hotel_gallery_exterior_pool_1795360066864.jpg';
import hotelLobbyImg from '../assets/images/hotel_gallery_lobby_lounge_1795360057197.jpg';
import hotelSuiteImg from '../assets/images/hotel_gallery_suite_interior_1795360052553.jpg';
import hotelDiningImg from '../assets/images/hotel_gallery_dining_terrace_1795360101868.jpg';

import {
  buildHotelProviderDeals,
  getLowestHotelDealPrice,
  type HotelProviderDeal,
} from '../utils/hotelCompareUtils';

interface HotelBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
}

type HotelSectionId = 'overview' | 'deals' | 'location' | 'information' | 'amenities';

const SECTION_TABS: { id: HotelSectionId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'deals', label: 'Compare prices' },
  { id: 'location', label: 'Location' },
  { id: 'information', label: 'Information' },
  { id: 'amenities', label: 'Amenities' },
];

export const HotelBookingCheckoutPage: React.FC<HotelBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
}) => {
  const hotelName = item.hotelName || item.title || 'Grand Luxury Resort & Spa';
  const location = item.hotelLocation || item.toCity || 'City Center, Near Prime Landmarks';
  const locality = item.hotelLocality || location.split(',')[0]?.trim() || 'Prime District';
  const propertyType = item.hotelPropertyType || 'Hotel & Resort';
  const stars = item.hotelStars || 5;
  const rating = item.hotelRating || 4.8;
  const reviewsCount = item.hotelReviews || 1240;
  const checkInDate = item.travelDate || '2026-10-15';
  const checkOutDate = item.returnDate || '2026-10-18';
  const guests = Math.max(1, item.travellers || 2);
  const basePrice = Math.max(1200, item.priceInr || 4850);

  // Active anchor navigation tab
  const [activeSection, setActiveSection] = useState<HotelSectionId>('overview');

  // Deals sorting
  const [dealsSort, setDealsSort] = useState<'price' | 'rating'>('price');

  // Photo Lightbox state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

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

  // Comparison Sites / Provider Deals list
  const providerDeals: HotelProviderDeal[] = useMemo(
    () => buildHotelProviderDeals(hotelName, dealsSort),
    [hotelName, dealsSort]
  );

  const lowestDealPrice = useMemo(
    () => getLowestHotelDealPrice(basePrice, providerDeals),
    [basePrice, providerDeals]
  );

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
    const finalFare = basePrice + provider.priceDelta;
    const generatedRef = `TY-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedBookingPnr(generatedRef);

    const bookingRecord: BookedTrip = {
      id: `booking-${Date.now()}`,
      bookingId: generatedRef,
      bookingReference: generatedRef,
      category: 'hotels',
      title: hotelName,
      routeSummary: location,
      dateSummary: `${formatDisplayDate(checkInDate)} – ${formatDisplayDate(checkOutDate)}`,
      travellers: guests,
      cabinOrRoom: `Booked via ${provider.name}`,
      totalPaidInr: finalFare,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: 'Just now',
      departureDate: checkInDate,
      returnDate: checkOutDate,
      hotelAddress: location,
      carrierOrHotel: `${hotelName} via ${provider.name}`,
      passengers: [{ name: `Lead Guest (${guests} Pax)`, age: 30, gender: 'Adult' }],
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

  // Curated nearby landmarks adapted to the hotel's locality
  const nearbySpots = useMemo(
    () => [
      { category: 'Neighborhood Hub', place: `${locality} Main Promenade & Cafés`, distance: '450 m · 5 min walk' },
      { category: 'Dining & Shopping', place: `${locality} Culinary & Artisan Market`, distance: '1.2 km · 4 min drive' },
      { category: 'Cultural Landmark', place: `Historic Heritage Quarter`, distance: '3.6 km · 10 min drive' },
      { category: 'Transit Hub', place: 'Central Railway & Metro Terminal', distance: '9.4 km · 20 min drive' },
      { category: 'Airport Access', place: 'International Airport Terminal', distance: '24 km · 35 min drive' },
    ],
    [locality]
  );

  // Featured hotel amenities (filtering out breakfast/meal specific tags so we keep focus clean)
  const featuredAmenities = useMemo(() => {
    const incoming = (item.hotelAmenities || []).filter(
      (am) => !am.toLowerCase().includes('breakfast') && !am.toLowerCase().includes('meal')
    );
    if (incoming.length >= 4) return incoming.slice(0, 8);
    return [
      'Free High-Speed Wi-Fi',
      'Swimming Pool',
      'Air Conditioning',
      '24-Hour Front Desk',
      'Fitness Center',
      'Valet & Self Parking',
      'Spa & Wellness',
      'Airport Shuttle',
    ];
  }, [item.hotelAmenities]);

  const amenityGroups = [
    {
      title: 'Internet & General Comfort',
      icon: Wifi,
      items: [
        'Complimentary High-Speed Wi-Fi across property',
        'Individually controlled Air Conditioning',
        'Daily Housekeeping & Linen Service',
        'Elevator access to all guest floors',
        'Sound-insulated interiors & blackout drapes',
      ],
    },
    {
      title: 'Wellness & Leisure',
      icon: Waves,
      items: [
        'Outdoor Temperature-Controlled Swimming Pool',
        '24/7 Air-Conditioned Fitness Center',
        'Full-Service Spa & Relaxation Lounge',
        'Landscaped Courtyard & Sun Terrace',
        'Poolside Loungers & Towel Service',
      ],
    },
    {
      title: 'Food & Drink Venues',
      icon: Utensils,
      items: [
        'On-Site Multi-Cuisine Restaurant',
        'Rooftop / Courtyard Lounge & Bar',
        'Artisan Coffee Bar & Bakery Corner',
        '24-Hour In-Room Dining Service',
        'Special Dietary Preparation on Request',
      ],
    },
    {
      title: 'Transport & Guest Services',
      icon: Car,
      items: [
        'Complimentary On-Site & Valet Parking',
        'Airport Pickup & Drop-off Transfers',
        '24-Hour Front Desk & Travel Concierge',
        'Secure Luggage Storage & Safety Lockers',
        'Laundry, Pressing & Dry Cleaning',
      ],
    },
  ];

  const ratingLabel = rating >= 4.8 ? 'Exceptional' : rating >= 4.5 ? 'Wonderful' : 'Very Good';

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-24 font-sans">
      {/* ===================================================================
          1. SEAMLESS OCEAN-NAVY SECOND HEADER (MATCHING APP NAVIGATION)
      =================================================================== */}
      <section className="bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] pt-[74px] pb-6 relative shadow-md">
        <div className="w-full px-3 sm:px-5 lg:px-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBackToResults}
              title="Back to hotels"
              aria-label="Back to hotels"
              className="-ml-1.5 mt-0.5 p-1 text-white/90 hover:text-sky-200 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0 space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight truncate">
                {hotelName}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-white/90">
                <span>
                  {guests} Guest{guests > 1 ? 's' : ''}
                </span>
                <span className="text-white/40" aria-hidden="true">·</span>
                <span className="truncate max-w-[240px] sm:max-w-md">{location}</span>
                <span className="text-white/40" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-sky-100">
                  <Calendar className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span>
                    {formatDisplayDate(checkInDate)} – {formatDisplayDate(checkOutDate)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-sky-200 font-medium">Best nightly rate</div>
              <div className="text-lg font-bold text-white tabular-nums">
                {formatPrice(lowestDealPrice, currency)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('deals')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Compare prices
            </button>
          </div>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-semibold drop-shadow-sm line-clamp-1">
                {galleryPhotos[0].caption}
              </p>
            </div>
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
                <span aria-hidden="true">·</span>
                <span>Verified Property</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">
                {hotelName}
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{location}</span>
                </span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => scrollToSection('location')}
                  className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline cursor-pointer"
                >
                  Show on map
                </button>
              </div>
            </div>

            {/* Guest Score & Starting Price */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-6 shrink-0">
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

              <div className="h-10 w-px bg-slate-200 hidden sm:block" />

              <div className="text-right">
                <div className="text-xs text-slate-500">Nightly rates from</div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">
                  {formatPrice(lowestDealPrice, currency)}
                </div>
                <div className="text-[11px] text-slate-500">incl. taxes &amp; fees</div>
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
        className="sticky top-0 z-30 bg-white border-y border-slate-200 shadow-2xs"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
            {SECTION_TABS.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`py-3.5 text-sm whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
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

          <div className="hidden md:flex items-center gap-4 shrink-0 py-2">
            <div className="text-right">
              <span className="text-xs text-slate-500 mr-1.5">From</span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatPrice(lowestDealPrice, currency)}
              </span>
              <span className="text-xs text-slate-500"> / night</span>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('deals')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Compare prices
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Compare prices
              </h2>
              <p className="text-sm text-slate-600">
                Compare nightly rates from {providerDeals.length} verified booking sites for{' '}
                {formatDisplayDate(checkInDate)} – {formatDisplayDate(checkOutDate)}. Choose your room
                type and meal preferences directly on the booking site.
              </p>
            </div>

            {/* Interactive sort segmented control */}
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-200/80 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setDealsSort('price')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  dealsSort === 'rating'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Highest rated
              </button>
            </div>
          </div>

          {/* Single unified block containing all booking sites */}
          <div
            data-testid="compare-prices-sites-block"
            className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-200 overflow-hidden"
          >
            {providerDeals.map((provider) => {
              const nightlyPrice = basePrice + provider.priceDelta;

              return (
                <div
                  key={provider.id}
                  className={`p-4 sm:p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    provider.isCheapest
                      ? 'bg-emerald-50/35 hover:bg-emerald-50/55'
                      : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  {/* Provider Info */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl ${provider.logoBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                    >
                      {provider.logoText}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="font-semibold text-base text-slate-900">
                          {provider.name}
                        </span>
                        {provider.isCheapest && (
                          <span className="text-xs font-semibold text-emerald-700">
                            · Lowest price
                          </span>
                        )}
                        {provider.isOfficial && (
                          <span className="text-xs font-medium text-slate-500">
                            · Official site
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700 inline-flex items-center gap-1 tabular-nums">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          {provider.rating}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{provider.reviewsCount}</span>
                        <span aria-hidden="true">·</span>
                        <span>Verified partner</span>
                      </div>

                      <p className="text-xs text-slate-600">{provider.note}</p>
                    </div>
                  </div>

                  {/* Price & Go to Site CTA */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-500">Per night</div>
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">
                        {formatPrice(nightlyPrice, currency)}
                      </div>
                      <div className="text-[11px] text-slate-500">Taxes &amp; fees included</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectSite(provider)}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
                        provider.isCheapest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
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
            SECTION 3: LOCATION
        ----------------------------------------------------------------- */}
        <section id="hotel-sec-location" className="scroll-mt-14 py-10 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Location
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
            {/* Visual Map Panel */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50 relative overflow-hidden min-h-[280px] flex flex-col justify-between p-5">
              {/* Architectural Map Grid Background */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />
              {/* Subtle stylized arterial lines */}
              <svg
                className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
                viewBox="0 0 600 320"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 220 Q180 180 340 200 T600 140" fill="none" stroke="#3b82f6" strokeWidth="6" />
                <path d="M120 0 Q160 150 260 320" fill="none" stroke="#94a3b8" strokeWidth="3" />
                <path d="M410 0 Q380 160 470 320" fill="none" stroke="#94a3b8" strokeWidth="3" />
              </svg>

              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-white/95 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
                  {locality} Area Map
                </span>
              </div>

              {/* Center Pin */}
              <div className="relative z-10 my-8 flex flex-col items-center justify-center">
                <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 max-w-xs">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">{hotelName}</span>
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-sm -mt-1" />
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <span className="bg-white/95 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
                  Prime neighborhood · Easy cab &amp; airport access
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onNotify(
                      'Directions Ready',
                      `Location pinned for ${hotelName} (${location}). Address copied for navigation.`,
                      'info'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get directions</span>
                </button>
              </div>
            </div>

            {/* Nearby Distances List */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4">What&apos;s nearby</h3>
                <div className="divide-y divide-slate-100">
                  {nearbySpots.map((spot) => (
                    <div key={spot.place} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-500">{spot.category}</div>
                        <div className="text-sm font-medium text-slate-900 mt-0.5">{spot.place}</div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap shrink-0 mt-1">
                        {spot.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            SECTION 4: INFORMATION
        ----------------------------------------------------------------- */}
        <section id="hotel-sec-information" className="scroll-mt-14 py-10 bg-white">
          <div className="space-y-1 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Information
            </h2>
            <p className="text-sm text-slate-600">
              Good-to-know details, check-in schedules, and property guidelines before you book.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-in & Check-out */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <h3>Check-in &amp; Check-out</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1 text-sm">
                <div>
                  <div className="text-xs text-slate-500">Check-in from</div>
                  <div className="font-semibold text-slate-900 mt-0.5 tabular-nums">02:00 PM</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Check-out until</div>
                  <div className="font-semibold text-slate-900 mt-0.5 tabular-nums">11:00 AM</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                24-hour front desk available. Early check-in and late check-out are subject to property
                availability at arrival.
              </p>
            </div>

            {/* Booking Partner Terms */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <h3>Booking &amp; Stay Preferences</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Exact room categories, bed preferences, meal inclusions, and cancellation or pay-at-hotel
                terms are displayed and selected directly on the booking partner&apos;s website when you
                complete your reservation.
              </p>
            </div>

            {/* Guest Identification & Age */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <h3>Guest ID &amp; Verification</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                All guests are required to present a valid government-issued photo ID (Passport, Aadhaar,
                Driving License, or Voter ID) at check-in. Primary guest must be 18 years or older.
              </p>
            </div>

            {/* Property Facts & House Policies */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <h3>Property Facts &amp; House Rules</h3>
              </div>
              <dl className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Property type</dt>
                  <dd className="font-medium text-slate-900">{stars}-Star {propertyType}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Languages spoken</dt>
                  <dd className="font-medium text-slate-900">English, Hindi</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Smoking policy</dt>
                  <dd className="font-medium text-slate-900">Non-smoking interiors</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Children &amp; families</dt>
                  <dd className="font-medium text-slate-900">All ages welcome</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            SECTION 5: AMENITIES
        ----------------------------------------------------------------- */}
        <section id="hotel-sec-amenities" className="scroll-mt-14 py-10 bg-white">
          <div className="space-y-1 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Amenities
            </h2>
            <p className="text-sm text-slate-600">
              Facilities and services available across the property.
            </p>
          </div>

          {/* Popular Highlights Grid (clean unboxed rows, zero pill clutter) */}
          <div className="pb-8 mb-8 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Most popular facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-3 gap-x-6">
              {featuredAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categorized Full Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {amenityGroups.map((group) => {
              const IconComponent = group.icon;
              return (
                <div key={group.title} className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                    <IconComponent className="w-4 h-4 text-blue-600 shrink-0" />
                    <h3>{group.title}</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-600">
                    {group.items.map((itemText) => (
                      <li key={itemText} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{itemText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
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
                      {formatPrice(basePrice + redirectingProvider.priceDelta, currency)} / night
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Location:</span> {location}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Stay dates:</span>{' '}
                    {formatDisplayDate(checkInDate)} – {formatDisplayDate(checkOutDate)} ({guests} Guest
                    {guests > 1 ? 's' : ''})
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
                      {formatDisplayDate(checkInDate)} (02:00 PM)
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
    </div>
  );
};
