import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildHotelCardPhotos,
  countActiveHotelFilters,
  formatCompactMapPrice,
  formatPlacesPriceLevelLabel,
  getAdjacentPhotoIndex,
  getHotelReviewSummaryLabel,
  normalizeHotelMatchKey,
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
    maxPrice: 20000,
    priceBracket: 'all',
    stars: [5, 4, 3],
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
      searchQuery: 'Taj',
      assuredOnly: true,
      minRating: 4.5,
      stars: [5],
      propertyTypes: ['Resort'],
      amenities: ['Free WiFi', 'Swimming Pool'],
    }),
    7
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
      priceBracket: '5000-9000',
    }),
    1
  );
});


