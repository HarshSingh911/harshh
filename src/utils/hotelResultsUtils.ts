export function buildHotelCardPhotos(
  primaryImage: string,
  gallery: string[] | undefined,
  fallbackGallery: string[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  const pushUnique = (src?: string) => {
    const clean = (src || '').trim();
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    out.push(clean);
  };

  pushUnique(primaryImage);
  if (Array.isArray(gallery)) {
    for (const img of gallery) {
      pushUnique(img);
    }
  }
  for (const img of fallbackGallery) {
    pushUnique(img);
  }

  return out;
}

export function getAdjacentPhotoIndex(
  currentIndex: number,
  total: number,
  direction: 'prev' | 'next'
): number {
  if (total <= 1) return 0;
  const safeCurrent = ((currentIndex % total) + total) % total;
  if (direction === 'next') {
    return (safeCurrent + 1) % total;
  }
  return (safeCurrent - 1 + total) % total;
}

export function getHotelReviewSummaryLabel(rating: number): string {
  if (rating >= 4.8) return 'Exceptional';
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  return 'Good';
}

const CURRENCY_CONFIG: Record<string, { symbol: string; rate: number }> = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  AED: { symbol: 'AED ', rate: 0.044 },
  GBP: { symbol: '£', rate: 0.0094 },
  SGD: { symbol: 'S$', rate: 0.016 },
  CAD: { symbol: 'C$', rate: 0.0165 },
};

export function formatCompactMapPrice(amountInr: number, currency: string = 'INR'): string {
  const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  const converted = Math.max(1, Math.round(amountInr * cfg.rate));
  return `${cfg.symbol}${new Intl.NumberFormat('en-IN').format(converted)}`;
}

const PLACES_PRICE_LEVEL_INR: Record<string, number> = {
  FREE: 0,
  PRICE_LEVEL_FREE: 0,
  INEXPENSIVE: 1800,
  PRICE_LEVEL_INEXPENSIVE: 1800,
  MODERATE: 4200,
  PRICE_LEVEL_MODERATE: 4200,
  EXPENSIVE: 8500,
  PRICE_LEVEL_EXPENSIVE: 8500,
  VERY_EXPENSIVE: 15000,
  PRICE_LEVEL_VERY_EXPENSIVE: 15000,
};

export function formatPlacesPriceLevelLabel(
  priceLevel: unknown,
  currency: string = 'INR'
): string | null {
  if (typeof priceLevel !== 'string') return null;
  const normalized = priceLevel.trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (!(normalized in PLACES_PRICE_LEVEL_INR)) return null;
  const approxInr = PLACES_PRICE_LEVEL_INR[normalized];
  if (approxInr <= 0) return 'Free stay';
  return `~${formatCompactMapPrice(approxInr, currency)}`;
}

export function normalizeHotelMatchKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(hotel|hotels|resort|resorts|spa|villa|boutique|and|the|goa)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type HotelPriceDisplayMode = 'per-night' | 'total-stay';

export const DEFAULT_HOTEL_MAX_PRICE = 25000;
export const ALL_HOTEL_STARS: ReadonlyArray<number> = [5, 4, 3, 2, 1];

export interface HotelPriceBracketOption {
  id: string;
  min: number;
  max: number | null;
}

export const HOTEL_PRICE_BRACKETS: ReadonlyArray<HotelPriceBracketOption> = [
  { id: 'all', min: 0, max: null },
  { id: '0-2000', min: 0, max: 2000 },
  { id: '2000-5000', min: 2000, max: 5000 },
  { id: '5000-8000', min: 5000, max: 8000 },
  { id: '8000-12000', min: 8000, max: 12000 },
  { id: '12000-20000', min: 12000, max: 20000 },
  { id: '20000-plus', min: 20000, max: null },
];

export function getDisplayedHotelPrice(
  nightlyPriceInr: number,
  mode: HotelPriceDisplayMode,
  stayNights: number
): number {
  const safePrice = Math.max(0, Math.round(nightlyPriceInr));
  const safeNights = Math.max(1, Math.floor(stayNights));
  return mode === 'total-stay' ? safePrice * safeNights : safePrice;
}

export function matchesHotelPriceBracket(priceInr: number, bracketId: string): boolean {
  if (!bracketId || bracketId === 'all') return true;
  const found = HOTEL_PRICE_BRACKETS.find((b) => b.id === bracketId);
  if (!found) return true;
  if (found.max === null) {
    return priceInr >= found.min;
  }
  return priceInr >= found.min && priceInr <= found.max;
}

export function formatHotelPriceBracketLabel(
  bracket: HotelPriceBracketOption,
  currency: string = 'INR'
): string {
  if (bracket.id === 'all') return 'All Budgets';
  if (bracket.max === null) {
    return `${formatCompactMapPrice(bracket.min, currency)}+`;
  }
  const minLabel =
    bracket.min === 0
      ? `${(CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR).symbol}0`
      : formatCompactMapPrice(bracket.min, currency);
  return `${minLabel} - ${formatCompactMapPrice(bracket.max, currency)}`;
}

export function parseMinMaxPriceInputs(
  minRaw: string,
  maxRaw: string,
  defaultMax: number = DEFAULT_HOTEL_MAX_PRICE
): { minPrice: number; maxPrice: number } {
  const parsedMin = minRaw.trim() === '' ? 0 : Math.max(0, Math.floor(Number(minRaw)));
  const parsedMax =
    maxRaw.trim() === '' ? defaultMax : Math.max(0, Math.floor(Number(maxRaw)));

  const safeMin = Number.isFinite(parsedMin) ? parsedMin : 0;
  const safeMax = Number.isFinite(parsedMax) ? parsedMax : defaultMax;

  if (maxRaw.trim() === '') {
    return { minPrice: safeMin, maxPrice: defaultMax };
  }
  if (safeMin > safeMax) {
    return { minPrice: safeMax, maxPrice: safeMin };
  }
  return { minPrice: safeMin, maxPrice: safeMax };
}

export function formatHotelStarOptionLabel(star: number): string {
  const safeStar = Math.max(1, Math.min(5, Math.floor(star)));
  return `${safeStar} ${safeStar === 1 ? 'Star' : 'Stars'}`;
}

export interface HotelFilterCriteria {
  searchQuery: string;
  minPrice?: number;
  maxPrice: number;
  defaultMaxPrice?: number;
  priceBracket: string;
  stars: number[];
  minRating: number;
  propertyTypes: string[];
  amenities: string[];
  localities: string[];
  assuredOnly: boolean;
  freeCancellationOnly: boolean;
}

export function countActiveHotelFilters(filters: HotelFilterCriteria): number {
  const defaultMax = filters.defaultMaxPrice ?? DEFAULT_HOTEL_MAX_PRICE;
  const minPrice = filters.minPrice ?? 0;
  let count = 0;

  if (filters.searchQuery.trim().length > 0) count += 1;
  if (filters.assuredOnly) count += 1;
  if (filters.freeCancellationOnly) count += 1;
  if (filters.priceBracket !== 'all') {
    count += 1;
  } else if (minPrice > 0 || filters.maxPrice !== defaultMax) {
    count += 1;
  }

  const normalizedStars = Array.from(new Set(filters.stars)).sort((a, b) => a - b);
  const isAllStarsSelected =
    normalizedStars.length === ALL_HOTEL_STARS.length &&
    normalizedStars.every((val, idx) => val === idx + 1);
  if (!isAllStarsSelected) {
    count += 1;
  }

  if (filters.minRating > 0) count += 1;
  if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
  if (filters.amenities.length > 0) count += filters.amenities.length;
  if (filters.localities.length > 0) count += filters.localities.length;

  return count;
}

export type HotelSortOption =
  | 'recommended'
  | 'lowest-price'
  | 'best-value'
  | 'highest-rated';

export const HOTEL_SORT_OPTIONS: ReadonlyArray<{
  id: HotelSortOption;
  label: string;
}> = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'lowest-price', label: 'Lowest Price' },
  { id: 'best-value', label: 'Best Value' },
  { id: 'highest-rated', label: 'Highest Rated' },
];

export const HOTEL_SKELETON_CARD_COUNT = 4;

export function formatHotelCountLabel(count: number): string {
  const safeCount = Math.max(0, Math.floor(count));
  return `${safeCount} ${safeCount === 1 ? 'hotel' : 'hotels'}`;
}

export function formatHotelResultsStatusLabel(count: number, isSearching: boolean): string {
  if (isSearching) return 'Searching...';
  return formatHotelCountLabel(count);
}

export interface SortableHotelItem {
  id: string;
  priceInr: number;
  rating: number;
  reviews: number;
  stars: number;
  propertyType?: string;
  isTripYeahAssured?: boolean;
  freeCancellation?: boolean;
}

function getHotelRecommendedScore(hotel: SortableHotelItem): number {
  const assuredBonus = hotel.isTripYeahAssured ? 8 : 0;
  const freeCancelBonus = hotel.freeCancellation ? 2 : 0;
  const reviewSignal = Math.min(hotel.reviews, 1000) * 0.015;
  const pricePenalty = Math.min(hotel.priceInr, 25000) * 0.0005;
  return hotel.rating * 25 + reviewSignal + hotel.stars * 3 + assuredBonus + freeCancelBonus - pricePenalty;
}

function getHotelBestValueScore(hotel: SortableHotelItem): number {
  const quality = hotel.rating * 22 + hotel.stars * 4 + (hotel.freeCancellation ? 2 : 0);
  const priceLog = Math.log10(Math.max(hotel.priceInr, 500));
  return quality / priceLog;
}

export function sortHotelsForDisplay<T extends SortableHotelItem>(
  hotels: readonly T[],
  sortBy: HotelSortOption,
  hotelMode?: string
): T[] {
  const copy = [...hotels];

  if (sortBy === 'lowest-price') {
    return copy.sort(
      (a, b) =>
        a.priceInr - b.priceInr ||
        b.rating - a.rating ||
        b.reviews - a.reviews
    );
  }

  if (sortBy === 'highest-rated') {
    return copy.sort(
      (a, b) =>
        b.rating - a.rating ||
        b.reviews - a.reviews ||
        a.priceInr - b.priceInr
    );
  }

  if (sortBy === 'best-value') {
    return copy.sort(
      (a, b) =>
        getHotelBestValueScore(b) - getHotelBestValueScore(a) ||
        a.priceInr - b.priceInr
    );
  }

  // Default: 'recommended'
  return copy.sort((a, b) => {
    if (hotelMode === 'villas') {
      const aIsVR = a.propertyType === 'Villa' || a.propertyType === 'Resort';
      const bIsVR = b.propertyType === 'Villa' || b.propertyType === 'Resort';
      if (aIsVR && !bIsVR) return -1;
      if (!aIsVR && bIsVR) return 1;
    }
    return (
      getHotelRecommendedScore(b) - getHotelRecommendedScore(a) ||
      b.rating - a.rating ||
      a.priceInr - b.priceInr
    );
  });
}


