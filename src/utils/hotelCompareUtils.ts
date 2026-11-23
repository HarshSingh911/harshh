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

export function buildHotelProviderDeals(
  hotelName: string,
  sortBy: 'price' | 'rating' = 'price'
): HotelProviderDeal[] {
  const shortBrand = hotelName.split(' ')[0] || 'Hotel';
  const list: HotelProviderDeal[] = [
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
      priceDelta: 0,
      isCheapest: true,
    },
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
      priceDelta: 80,
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
      priceDelta: 120,
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
      priceDelta: 160,
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
      priceDelta: 190,
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
      priceDelta: 210,
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
      priceDelta: 240,
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
      priceDelta: 290,
    },
  ];

  if (sortBy === 'rating') {
    return [...list].sort((a, b) => b.rating - a.rating || a.priceDelta - b.priceDelta);
  }
  return [...list].sort((a, b) => a.priceDelta - b.priceDelta);
}

export function getLowestHotelDealPrice(basePrice: number, deals: HotelProviderDeal[]): number {
  if (!deals.length) return basePrice;
  const minDelta = Math.min(...deals.map((d) => d.priceDelta));
  return basePrice + minDelta;
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

