import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_HOTEL_STARS,
  buildHotelCardPhotos,
  countActiveHotelFilters,
  DEFAULT_HOTEL_MAX_PRICE,
  formatCompactMapPrice,
  formatHotelCountLabel,
  formatHotelPriceBracketLabel,
  formatHotelResultsStatusLabel,
  formatHotelStarOptionLabel,
  formatPlacesPriceLevelLabel,
  getAdjacentPhotoIndex,
  getDisplayedHotelPrice,
  getHotelReviewSummaryLabel,
  HOTEL_PRICE_BRACKETS,
  HOTEL_SKELETON_CARD_COUNT,
  HOTEL_SORT_OPTIONS,
  matchesHotelPriceBracket,
  normalizeHotelMatchKey,
  parseMinMaxPriceInputs,
  sortHotelsForDisplay,
} from './hotelResultsUtils.ts';

test('buildHotelCardPhotos leads with primary image, preserves unique gallery items, and fills fallbacks', () => {
  const photos = buildHotelCardPhotos(
    '/img/main.jpg',
    ['/img/main.jpg', '/img/suite.jpg'],
    ['/img/pool.jpg', '/img/suite.jpg', '/img/dining.jpg']
  );

  assert.deepEqual(photos, [
    '/img/main.jpg',
    '/img/suite.jpg',
    '/img/pool.jpg',
    '/img/dining.jpg',
  ]);
});

test('getAdjacentPhotoIndex wraps forward and backward safely', () => {
  assert.equal(getAdjacentPhotoIndex(0, 4, 'prev'), 3);
  assert.equal(getAdjacentPhotoIndex(3, 4, 'next'), 0);
  assert.equal(getAdjacentPhotoIndex(1, 4, 'next'), 2);
  assert.equal(getAdjacentPhotoIndex(0, 1, 'next'), 0);
});

test('getHotelReviewSummaryLabel maps rating thresholds cleanly', () => {
  assert.equal(getHotelReviewSummaryLabel(4.9), 'Exceptional');
  assert.equal(getHotelReviewSummaryLabel(4.6), 'Excellent');
  assert.equal(getHotelReviewSummaryLabel(4.2), 'Very Good');
  assert.equal(getHotelReviewSummaryLabel(3.8), 'Good');
});

test('formatCompactMapPrice formats INR and USD prices cleanly for map pins', () => {
  assert.equal(formatCompactMapPrice(1950, 'INR'), '₹1,950');
  assert.equal(formatCompactMapPrice(11800, 'INR'), '₹11,800');
  assert.equal(formatCompactMapPrice(5000, 'USD'), '$60');
});

test('formatPlacesPriceLevelLabel maps Google Places priceLevel enums cleanly', () => {
  assert.equal(formatPlacesPriceLevelLabel('MODERATE', 'INR'), '~₹4,200');
  assert.equal(formatPlacesPriceLevelLabel('PRICE_LEVEL_EXPENSIVE', 'INR'), '~₹8,500');
  assert.equal(formatPlacesPriceLevelLabel('Very Expensive', 'INR'), '~₹15,000');
  assert.equal(formatPlacesPriceLevelLabel('INEXPENSIVE', 'USD'), '~$22');
  assert.equal(formatPlacesPriceLevelLabel(undefined, 'INR'), null);
});

test('normalizeHotelMatchKey strips filler words for duplicate detection', () => {
  assert.equal(
    normalizeHotelMatchKey('Taj Exotica Resort & Spa, Goa'),
    'taj exotica'
  );
  assert.equal(
    normalizeHotelMatchKey('The Lemon Tree Amarante Hotel'),
    'lemon tree amarante'
  );
});

test('countActiveHotelFilters returns 0 for defaults and counts active criteria accurately', () => {
  const defaults = {
    searchQuery: '',
    minPrice: 0,
    maxPrice: DEFAULT_HOTEL_MAX_PRICE,
    defaultMaxPrice: DEFAULT_HOTEL_MAX_PRICE,
    priceBracket: 'all',
    stars: [...ALL_HOTEL_STARS],
    minRating: 0,
    propertyTypes: [],
    amenities: [],
    localities: [],
    assuredOnly: false,
    freeCancellationOnly: false,
  };

  assert.equal(countActiveHotelFilters(defaults), 0);

  assert.equal(
    countActiveHotelFilters({
      ...defaults,
      minPrice: 1500,
      minRating: 4.5,
      stars: [5],
      propertyTypes: ['Resort'],
      amenities: ['Free WiFi', 'Swimming Pool'],
    }),
    6
  );

  assert.equal(
    countActiveHotelFilters({
      ...defaults,
      maxPrice: 12000,
    }),
    1
  );

  assert.equal(
    countActiveHotelFilters({
      ...defaults,
      maxPrice: 12000,
      priceBracket: '5000-8000',
    }),
    1
  );
});

test('hotel price display mode, numbered brackets, min/max parser, and star labels behave accurately', () => {
  assert.equal(getDisplayedHotelPrice(2000, 'per-night', 4), 2000);
  assert.equal(getDisplayedHotelPrice(2000, 'total-stay', 4), 8000);

  assert.deepEqual(
    HOTEL_PRICE_BRACKETS.map((b) => formatHotelPriceBracketLabel(b, 'INR')),
    [
      'All Budgets',
      '₹0 - ₹2,000',
      '₹2,000 - ₹5,000',
      '₹5,000 - ₹8,000',
      '₹8,000 - ₹12,000',
      '₹12,000 - ₹20,000',
      '₹20,000+',
    ]
  );

  assert.equal(matchesHotelPriceBracket(1500, '0-2000'), true);
  assert.equal(matchesHotelPriceBracket(2500, '0-2000'), false);
  assert.equal(matchesHotelPriceBracket(4500, '2000-5000'), true);
  assert.equal(matchesHotelPriceBracket(22000, '20000-plus'), true);
  assert.equal(matchesHotelPriceBracket(500, 'all'), true);

  assert.deepEqual(parseMinMaxPriceInputs('1000', '5000'), { minPrice: 1000, maxPrice: 5000 });
  assert.deepEqual(parseMinMaxPriceInputs('8000', '3000'), { minPrice: 3000, maxPrice: 8000 });
  assert.deepEqual(parseMinMaxPriceInputs('', ''), { minPrice: 0, maxPrice: DEFAULT_HOTEL_MAX_PRICE });

  assert.equal(formatHotelStarOptionLabel(5), '5 Stars');
  assert.equal(formatHotelStarOptionLabel(2), '2 Stars');
  assert.equal(formatHotelStarOptionLabel(1), '1 Star');
});

test('HOTEL_SORT_OPTIONS exposes Recommended first, Lowest Price second, and omits Earliest Departure', () => {
  assert.deepEqual(
    HOTEL_SORT_OPTIONS.map((o) => o.label),
    ['Recommended', 'Lowest Price', 'Best Value', 'Highest Rated']
  );
  assert.equal(HOTEL_SORT_OPTIONS[0].id, 'recommended');
});

test('formatHotelCountLabel handles singular, plural, and zero counts cleanly', () => {
  assert.equal(formatHotelCountLabel(9), '9 hotels');
  assert.equal(formatHotelCountLabel(3), '3 hotels');
  assert.equal(formatHotelCountLabel(1), '1 hotel');
  assert.equal(formatHotelCountLabel(0), '0 hotels');
  assert.equal(formatHotelCountLabel(-4), '0 hotels');
});

test('formatHotelResultsStatusLabel returns Searching... while loading and hotel count when loaded', () => {
  assert.equal(formatHotelResultsStatusLabel(9, true), 'Searching...');
  assert.equal(formatHotelResultsStatusLabel(0, true), 'Searching...');
  assert.equal(formatHotelResultsStatusLabel(9, false), '9 hotels');
  assert.equal(formatHotelResultsStatusLabel(1, false), '1 hotel');
  assert.equal(formatHotelResultsStatusLabel(0, false), '0 hotels');
  assert.equal(HOTEL_SKELETON_CARD_COUNT, 4);
});

test('sortHotelsForDisplay orders hotels deterministically across all 4 sort modes without mutating input', () => {
  const sample = [
    {
      id: 'budget',
      priceInr: 1200,
      rating: 4.3,
      reviews: 210,
      stars: 3,
      propertyType: 'Hotel',
      isTripYeahAssured: false,
      freeCancellation: true,
    },
    {
      id: 'luxury-icon',
      priceInr: 14500,
      rating: 4.95,
      reviews: 950,
      stars: 5,
      propertyType: 'Resort',
      isTripYeahAssured: true,
      freeCancellation: true,
    },
    {
      id: 'sweet-spot',
      priceInr: 2200,
      rating: 4.85,
      reviews: 820,
      stars: 4,
      propertyType: 'Resort',
      isTripYeahAssured: true,
      freeCancellation: true,
    },
  ];
  const originalOrder = sample.map((h) => h.id);

  assert.deepEqual(
    sortHotelsForDisplay(sample, 'lowest-price').map((h) => h.id),
    ['budget', 'sweet-spot', 'luxury-icon']
  );
  assert.deepEqual(
    sortHotelsForDisplay(sample, 'highest-rated').map((h) => h.id),
    ['luxury-icon', 'sweet-spot', 'budget']
  );
  assert.equal(sortHotelsForDisplay(sample, 'best-value')[0].id, 'sweet-spot');
  assert.equal(sortHotelsForDisplay(sample, 'recommended')[0].id, 'luxury-icon');

  // Ensure input array was never mutated
  assert.deepEqual(sample.map((h) => h.id), originalOrder);
});


