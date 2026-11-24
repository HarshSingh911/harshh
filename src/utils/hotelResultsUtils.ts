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

