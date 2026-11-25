export interface HotelProviderDeal {
  id: string;
  name: string;
  logoBg: string;
  logoText: string;
  rating: number;
  reviewsCount: string;
  roomType: string;
  policies: string[];
  note: string;
  priceDelta: number;
  isCheapest?: boolean;
  isOfficial?: boolean;
}

const EXTERNAL_CHEAPEST_CANDIDATE_IDS = [
  'agoda',
  'booking-com',
  'makemytrip-hotels',
  'expedia',
  'goibibo-hotels',
  'hotels-com',
] as const;

export function selectCheapestExternalProviderId(hotelName: string): string {
  const normalized = (hotelName || '').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }
  return EXTERNAL_CHEAPEST_CANDIDATE_IDS[hash % EXTERNAL_CHEAPEST_CANDIDATE_IDS.length];
}

export function buildHotelProviderDeals(
  hotelName: string,
  sortBy: 'price' | 'rating' = 'price'
): HotelProviderDeal[] {
  const shortBrand = hotelName.split(' ')[0] || 'Hotel';
  const cheapestProviderId = selectCheapestExternalProviderId(hotelName);

  const rawList: Omit<HotelProviderDeal, 'priceDelta' | 'isCheapest'>[] = [
    {
      id: 'agoda',
      name: 'agoda',
      logoBg: 'bg-[#0b7c7b]',
      logoText: 'AG',
      rating: 4.7,
      reviewsCount: '42,000+ reviews',
      roomType: 'Deluxe Studio',
      policies: ['Non-refundable', 'Meals not included'],
      note: 'Member-only nightly rate · Instant voucher · Select room & add-ons on partner site',
    },
    {
      id: 'booking-com',
      name: 'Booking.com',
      logoBg: 'bg-[#003580]',
      logoText: 'BK',
      rating: 4.8,
      reviewsCount: '65,000+ reviews',
      roomType: 'Superior Double Room',
      policies: ['Refundable', 'Meals not included', 'Pay at hotel'],
      note: 'Flexible booking options · Verified guest reviews · Choose room category on site',
    },
    {
      id: 'makemytrip-hotels',
      name: 'MakeMyTrip',
      logoBg: 'bg-[#ea2330]',
      logoText: 'MMT',
      rating: 4.7,
      reviewsCount: '38,500+ reviews',
      roomType: 'Executive Twin Room',
      policies: ['Refundable', 'Meals included'],
      note: 'Verified stay partner · 24/7 travel helpline · Customize stay options during booking',
    },
    {
      id: 'tripyeah-hotels-direct',
      name: 'TripYeah Hotels Direct',
      logoBg: 'bg-blue-600',
      logoText: 'TY',
      rating: 4.9,
      reviewsCount: '24,200+ reviews',
      roomType: 'Studio King Room',
      policies: ['Non-refundable', 'Meals not included'],
      note: 'Best price guarantee · Choose room & meal options on site',
    },
    {
      id: 'hotel-official',
      name: `${shortBrand} Official Site`,
      logoBg: 'bg-slate-900',
      logoText: hotelName.substring(0, 2).toUpperCase() || 'HT',
      rating: 4.9,
      reviewsCount: 'Property Direct',
      roomType: 'Premier King Suite',
      policies: ['Refundable', 'Meals included'],
      note: 'Property reservation · Loyalty benefits · Full inventory on official website',
      isOfficial: true,
    },
    {
      id: 'expedia',
      name: 'Expedia',
      logoBg: 'bg-[#ffc72c] text-slate-900',
      logoText: 'EXP',
      rating: 4.6,
      reviewsCount: '31,000+ reviews',
      roomType: 'Classic Studio',
      policies: ['Non-refundable', 'Meals included'],
      note: 'OneKey member savings · Transparent total pricing · Select room on checkout',
    },
    {
      id: 'hotels-com',
      name: 'Hotels.com',
      logoBg: 'bg-[#d4111e]',
      logoText: 'H.C',
      rating: 4.6,
      reviewsCount: '19,400+ reviews',
      roomType: 'Deluxe Queen Room',
      policies: ['Refundable', 'Meals not included', 'Free Wi-Fi'],
      note: 'Collect reward nights · Price match support · Customize room options on site',
    },
    {
      id: 'goibibo-hotels',
      name: 'goibibo',
      logoBg: 'bg-[#f4511e]',
      logoText: 'GO',
      rating: 4.5,
      reviewsCount: '14,000+ reviews',
      roomType: 'Club King Studio',
      policies: ['Refundable', 'Meals included'],
      note: 'Express mobile check-in · Instant partner voucher · Choose inclusions on site',
    },
  ];

  const otherDeltas = [65, 110, 145, 180, 210, 245, 290];
  let deltaIndex = 0;

  const list: HotelProviderDeal[] = rawList.map((item) => {
    if (item.id === cheapestProviderId) {
      return {
        ...item,
        priceDelta: 0,
        isCheapest: true,
      };
    }
    const assignedDelta = otherDeltas[deltaIndex] ?? 290 + deltaIndex * 30;
    deltaIndex += 1;
    return {
      ...item,
      priceDelta: assignedDelta,
    };
  });

  if (sortBy === 'rating') {
    return [...list].sort((a, b) => b.rating - a.rating || a.priceDelta - b.priceDelta);
  }
  return [...list].sort((a, b) => a.priceDelta - b.priceDelta);
}

export function getCheapestHotelProviderDeal(hotelName: string): HotelProviderDeal {
  return buildHotelProviderDeals(hotelName, 'price')[0];
}

export function cleanHotelNameForPartnerLookup(hotelName: string): string {
  return (hotelName || 'Hotel')
    .replace(/\([^)]*[★☆][^)]*\)/g, '')
    .replace(/\((?:verified|couple friendly|luxury icon|best seller|top rated)\)/gi, '')
    .replace(/[★☆]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatIsoToMmDdYyyy(isoDate?: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return '';
  const [yyyy, mm, dd] = parts;
  return `${mm}${dd}${yyyy}`;
}

function formatIsoToYyyyMmDd(isoDate?: string): string {
  if (!isoDate) return '';
  return isoDate.replace(/-/g, '');
}

export function buildHotelProviderBookingUrl(params: {
  providerId: string;
  hotelName: string;
  city?: string;
  locality?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  partnerUrls?: Partial<Record<string, string>>;
}): string {
  const cleanedHotel = cleanHotelNameForPartnerLookup(params.hotelName);
  const city = (params.city || '').trim();
  const query = city ? `${cleanedHotel}, ${city}` : cleanedHotel;
  const encodedQuery = encodeURIComponent(query);
  const encodedHotel = encodeURIComponent(cleanedHotel);
  const checkIn = params.checkIn || '';
  const checkOut = params.checkOut || '';
  const rooms = Math.max(1, params.rooms || 1);
  const adults = Math.max(1, params.adults || 2);
  const nights = checkIn && checkOut ? calculateStayNights(checkIn, checkOut) : 1;

  // If a direct property-page partner URL is supplied for this hotel & provider, use it directly
  const directOverride = params.partnerUrls?.[params.providerId];
  if (directOverride && /^https?:\/\//i.test(directOverride)) {
    try {
      const url = new URL(directOverride);
      if (checkIn && !url.searchParams.has('checkin') && !url.searchParams.has('checkIn')) {
        url.searchParams.set('checkin', checkIn);
      }
      if (checkOut && !url.searchParams.has('checkout') && !url.searchParams.has('checkOut')) {
        url.searchParams.set('checkout', checkOut);
      }
      if (!url.searchParams.has('adults')) {
        url.searchParams.set('adults', String(adults));
      }
      if (!url.searchParams.has('rooms')) {
        url.searchParams.set('rooms', String(rooms));
      }
      return url.toString();
    } catch {
      return directOverride;
    }
  }

  switch (params.providerId) {
    case 'agoda':
      return `https://www.agoda.com/en-in/search?textToSearch=${encodedQuery}&searchText=${encodedQuery}${
        checkIn ? `&checkIn=${encodeURIComponent(checkIn)}&los=${nights}` : ''
      }&rooms=${rooms}&adults=${adults}&children=0`;
    case 'booking-com':
      return `https://www.booking.com/searchresults.html?ss=${encodedQuery}&dest_type=hotel&src=index${
        checkIn ? `&checkin=${encodeURIComponent(checkIn)}` : ''
      }${checkOut ? `&checkout=${encodeURIComponent(checkOut)}` : ''}&group_adults=${adults}&no_rooms=${rooms}&group_children=0`;
    case 'makemytrip-hotels': {
      const mmtIn = formatIsoToMmDdYyyy(checkIn);
      const mmtOut = formatIsoToMmDdYyyy(checkOut);
      return `https://www.makemytrip.com/hotels/hotel-listing/?${
        mmtIn ? `checkin=${mmtIn}&` : ''
      }${mmtOut ? `checkout=${mmtOut}&` : ''}roomStayQualifier=${adults}e0e&locusType=hotel&reference=hotel&type=hotel&searchText=${encodedQuery}`;
    }
    case 'expedia':
      return `https://www.expedia.co.in/Hotel-Search?destination=${encodedQuery}&hotelName=${encodedHotel}${
        checkIn ? `&startDate=${encodeURIComponent(checkIn)}&d1=${encodeURIComponent(checkIn)}` : ''
      }${checkOut ? `&endDate=${encodeURIComponent(checkOut)}&d2=${encodeURIComponent(checkOut)}` : ''}&adults=${adults}&rooms=${rooms}`;
    case 'hotels-com':
      return `https://in.hotels.com/Hotel-Search?destination=${encodedQuery}&hotelName=${encodedHotel}${
        checkIn ? `&startDate=${encodeURIComponent(checkIn)}&d1=${encodeURIComponent(checkIn)}` : ''
      }${checkOut ? `&endDate=${encodeURIComponent(checkOut)}&d2=${encodeURIComponent(checkOut)}` : ''}&adults=${adults}&rooms=${rooms}`;
    case 'goibibo-hotels': {
      const citySlug = (city || 'india')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'india';
      const ci = formatIsoToYyyyMmDd(checkIn);
      const co = formatIsoToYyyyMmDd(checkOut);
      return `https://www.goibibo.com/hotels/find-hotels-in-${encodeURIComponent(citySlug)}/?${
        ci ? `ci=${ci}&` : ''
      }${co ? `co=${co}&` : ''}r=${rooms}-${adults}-0&searchText=${encodedHotel}&hotelName=${encodedHotel}`;
    }
    case 'hotel-official':
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(`${query} official website book hotel`)}`;
  }
}

export function getLowestHotelDealPrice(basePrice: number, deals: HotelProviderDeal[]): number {
  if (!deals.length) return basePrice;
  const minDelta = Math.min(...deals.map((d) => d.priceDelta));
  return basePrice + minDelta;
}

export interface HotelPriceChartPoint {
  providerId: string;
  name: string;
  shortLabel: string;
  priceInr: number;
  isCheapest: boolean;
  deltaFromLowestInr: number;
}

const PROVIDER_SHORT_CHART_LABELS: Record<string, string> = {
  agoda: 'Agoda',
  'booking-com': 'Booking',
  'makemytrip-hotels': 'MMT',
  'tripyeah-hotels-direct': 'TripYeah',
  'hotel-official': 'Direct',
  expedia: 'Expedia',
  'hotels-com': 'Hotels',
  'goibibo-hotels': 'Goibibo',
};

export function getShortProviderChartLabel(providerId: string, fallbackName: string): string {
  return PROVIDER_SHORT_CHART_LABELS[providerId] || fallbackName.split(' ')[0] || 'Site';
}

export function buildHotelPriceComparisonChartData(
  hotelName: string,
  basePriceInr: number,
  maxProviders = 5
): HotelPriceChartPoint[] {
  const safeBase = Math.max(100, Math.round(basePriceInr));
  const deals = buildHotelProviderDeals(hotelName, 'price').slice(0, Math.max(2, maxProviders));
  const lowestPrice = deals.length > 0 ? safeBase + deals[0].priceDelta : safeBase;

  return deals.map((deal, idx) => {
    const priceInr = safeBase + deal.priceDelta;
    return {
      providerId: deal.id,
      name: deal.name,
      shortLabel: getShortProviderChartLabel(deal.id, deal.name),
      priceInr,
      isCheapest: idx === 0,
      deltaFromLowestInr: Math.max(0, priceInr - lowestPrice),
    };
  });
}

export function computeCompactPriceChartDomain(prices: number[]): [number, number] {
  const valid = prices.filter((p) => Number.isFinite(p) && p >= 0);
  if (valid.length === 0) return [0, 100];
  const minPrice = Math.min(...valid);
  const maxPrice = Math.max(...valid);
  const spread = Math.max(50, maxPrice - minPrice);
  const lowerBound = Math.max(0, Math.floor(minPrice - spread * 0.55));
  const upperBound = Math.ceil(maxPrice + spread * 0.22);
  return [lowerBound, upperBound];
}

const CITY_TO_COUNTRY: Record<string, string> = {
  'new delhi': 'India',
  delhi: 'India',
  goa: 'India',
  'north goa': 'India',
  'south goa': 'India',
  mumbai: 'India',
  bengaluru: 'India',
  bangalore: 'India',
  jaipur: 'India',
  udaipur: 'India',
  manali: 'India',
  shimla: 'India',
  rishikesh: 'India',
  leh: 'India',
  agra: 'India',
  kochi: 'India',
  varanasi: 'India',
  darjeeling: 'India',
  ooty: 'India',
  munnar: 'India',
  coorg: 'India',
  hyderabad: 'India',
  chennai: 'India',
  kolkata: 'India',
  pune: 'India',
  ahmedabad: 'India',
  amritsar: 'India',
  srinagar: 'India',
  alleppey: 'India',
  jodhpur: 'India',
  pushkar: 'India',
  bali: 'Indonesia',
  ubud: 'Indonesia',
  seminyak: 'Indonesia',
  dubai: 'United Arab Emirates',
  'abu dhabi': 'United Arab Emirates',
  singapore: 'Singapore',
  bangkok: 'Thailand',
  phuket: 'Thailand',
  krabi: 'Thailand',
  paris: 'France',
  nice: 'France',
  tokyo: 'Japan',
  kyoto: 'Japan',
  osaka: 'Japan',
  zurich: 'Switzerland',
  interlaken: 'Switzerland',
  lucerne: 'Switzerland',
  london: 'United Kingdom',
  'new york': 'United States',
  'los angeles': 'United States',
  rome: 'Italy',
  venice: 'Italy',
  florence: 'Italy',
  hanoi: 'Vietnam',
  'ho chi minh': 'Vietnam',
  sydney: 'Australia',
  melbourne: 'Australia',
  maldives: 'Maldives',
  male: 'Maldives',
};

function cleanCityName(raw?: string): string {
  if (!raw) return '';
  return raw
    .replace(/\s*\([A-Z]{3,5}\)\s*$/i, '')
    .split(',')[0]
    .trim();
}

export function resolveHotelCountryAndCity(params: {
  toCity?: string;
  hotelLocation?: string;
  hotelName?: string;
}): { country: string; city: string } {
  const { toCity, hotelLocation, hotelName } = params;

  const candidateFromToCity = cleanCityName(toCity);
  if (candidateFromToCity) {
    const key = candidateFromToCity.toLowerCase();
    if (CITY_TO_COUNTRY[key]) {
      return { country: CITY_TO_COUNTRY[key], city: candidateFromToCity };
    }
  }

  const combined = `${hotelLocation || ''} ${hotelName || ''} ${toCity || ''}`.toLowerCase();
  for (const [cityKey, country] of Object.entries(CITY_TO_COUNTRY)) {
    if (combined.includes(cityKey)) {
      const formattedCity = cityKey
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return {
        country,
        city: candidateFromToCity || formattedCity,
      };
    }
  }

  if (hotelLocation) {
    const parts = hotelLocation
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      const last = parts[parts.length - 1];
      const prev = parts[parts.length - 2];
      return { country: last, city: candidateFromToCity || prev };
    }
    if (parts.length === 1) {
      return { country: 'India', city: candidateFromToCity || parts[0] };
    }
  }

  return { country: 'India', city: candidateFromToCity || 'Goa' };
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return isoDate;
  const [y, m, d] = parts;
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function calculateStayNights(checkInIso: string, checkOutIso: string): number {
  const inParts = checkInIso.split('-').map(Number);
  const outParts = checkOutIso.split('-').map(Number);
  if (
    inParts.length !== 3 ||
    outParts.length !== 3 ||
    inParts.some(isNaN) ||
    outParts.some(isNaN)
  ) {
    return 1;
  }
  const inMs = Date.UTC(inParts[0], inParts[1] - 1, inParts[2]);
  const outMs = Date.UTC(outParts[0], outParts[1] - 1, outParts[2]);
  const diffDays = Math.round((outMs - inMs) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function calculateStayAdjustedNightlyPrice(
  baseNightlyPrice: number,
  rooms: number,
  adults: number
): number {
  const safeRooms = Math.max(1, rooms);
  const safeAdults = Math.max(1, adults);
  const extraAdults = Math.max(0, safeAdults - safeRooms * 2);
  return Math.round(baseNightlyPrice * safeRooms + extraAdults * 450);
}

export function calculateHaversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function formatDistanceLabel(km: number): string {
  if (!Number.isFinite(km) || km < 0) return '';
  if (km < 1) {
    const meters = Math.max(50, Math.round((km * 1000) / 10) * 10);
    return `${meters} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

const COUNTRY_TO_REGION: Record<string, string> = {
  india: 'IN',
  'united arab emirates': 'AE',
  indonesia: 'ID',
  singapore: 'SG',
  thailand: 'TH',
  france: 'FR',
  japan: 'JP',
  switzerland: 'CH',
  'united kingdom': 'GB',
  'united states': 'US',
  italy: 'IT',
  australia: 'AU',
  maldives: 'MV',
};

export function resolveCountryRegionCode(countryName?: string): string {
  if (!countryName) return 'IN';
  return COUNTRY_TO_REGION[countryName.trim().toLowerCase()] || 'IN';
}

export function filterDistinctNearbyPlaces<T extends { id: string; name: string }>(
  items: T[],
  excludeId: string | undefined,
  excludeName: string | undefined,
  limit: number
): T[] {
  const normExclude = (excludeName || '').trim().toLowerCase();
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const out: T[] = [];

  for (const item of items) {
    const normName = item.name.trim().toLowerCase();
    if (!normName) continue;
    if (excludeId && item.id === excludeId) continue;
    if (normExclude && normName === normExclude) continue;
    if (seenIds.has(item.id) || seenNames.has(normName)) continue;
    seenIds.add(item.id);
    seenNames.add(normName);
    out.push(item);
    if (out.length >= limit) break;
  }

  return out;
}

export type TransitOverlayMode = 'public_transport' | 'walking_routes' | 'cab_taxi';

export interface TransitOverlayOption {
  id: TransitOverlayMode;
  label: string;
  shortHint: string;
}

export const TRANSIT_OVERLAY_OPTIONS: TransitOverlayOption[] = [
  {
    id: 'public_transport',
    label: 'Public Transport',
    shortHint: 'Live transit lines & stations',
  },
  {
    id: 'walking_routes',
    label: 'Walking Routes',
    shortHint: 'Walkable paths & times',
  },
  {
    id: 'cab_taxi',
    label: 'Cab/Taxi Availability',
    shortHint: 'Taxi stands & live traffic',
  },
];

export function formatRouteDurationMillis(durationMillis?: number | null): string {
  if (typeof durationMillis !== 'number' || !Number.isFinite(durationMillis) || durationMillis <= 0) {
    return '';
  }
  const totalMinutes = Math.max(1, Math.round(durationMillis / 60000));
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
}

export function formatRouteDistanceMeters(distanceMeters?: number | null): string {
  if (typeof distanceMeters !== 'number' || !Number.isFinite(distanceMeters) || distanceMeters <= 0) {
    return '';
  }
  return formatDistanceLabel(distanceMeters / 1000);
}

export function deriveCabPickupSummary(params: {
  taxiStandCount: number;
  nearestDriveDuration?: string;
  nearestStandName?: string;
}): string {
  const { taxiStandCount, nearestDriveDuration, nearestStandName } = params;
  if (taxiStandCount > 0 && nearestStandName) {
    return nearestDriveDuration
      ? `Nearest stand: ${nearestStandName} (${nearestDriveDuration} drive) · Live road traffic overlay active`
      : `${taxiStandCount} nearby taxi stand${taxiStandCount > 1 ? 's' : ''} found · Live road traffic overlay active`;
  }
  return 'Live Google Maps traffic overlay active · Showing nearest transit & airport cab pickup points';
}


