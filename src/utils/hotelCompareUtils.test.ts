import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDaysToIsoDate,
  buildHotelProviderDeals,
  calculateStayAdjustedNightlyPrice,
  calculateStayNights,
  getLowestHotelDealPrice,
  resolveHotelCountryAndCity,
} from './hotelCompareUtils';

test('buildHotelProviderDeals returns all 8 comparison sites sorted by lowest price by default', () => {
  const deals = buildHotelProviderDeals('Taj Fort Aguada Resort', 'price');
  assert.equal(deals.length, 8);
  assert.equal(deals[0].id, 'tripyeah-hotels-direct');
  assert.equal(deals[0].priceDelta, 0);
  for (let i = 1; i < deals.length; i++) {
    assert.ok(deals[i].priceDelta >= deals[i - 1].priceDelta);
  }
  for (const deal of deals) {
    assert.ok(deal.roomType.length > 0);
    assert.ok(deal.policies.length >= 2 && deal.policies.length <= 3);
    assert.ok(
      deal.policies.some((p) => /refundable/i.test(p)),
      `Expected refundability policy on ${deal.id}`
    );
    assert.ok(
      deal.policies.some((p) => /meals (included|not included)/i.test(p)),
      `Expected meal policy on ${deal.id}`
    );
    assert.ok(
      !deal.policies.some((p) => /instant confirmation|direct booking/i.test(p)),
      `Did not expect Instant confirmation or Direct booking on ${deal.id}`
    );
  }
});

test('buildHotelProviderDeals sorts by highest rating when requested', () => {
  const deals = buildHotelProviderDeals('Grand Hyatt', 'rating');
  assert.equal(deals[0].rating, 4.9);
  for (let i = 1; i < deals.length; i++) {
    assert.ok(deals[i].rating <= deals[i - 1].rating);
  }
});

test('getLowestHotelDealPrice computes lowest nightly price accurately', () => {
  const deals = buildHotelProviderDeals('Grand Hyatt', 'price');
  assert.equal(getLowestHotelDealPrice(5000, deals), 5000);
});

test('resolveHotelCountryAndCity extracts country and city for domestic and international hotels', () => {
  assert.deepEqual(
    resolveHotelCountryAndCity({
      toCity: 'Goa (GOI)',
      hotelLocation: 'Calangute - Baga Circle, North Goa, Goa',
    }),
    { country: 'India', city: 'Goa' }
  );
  assert.deepEqual(
    resolveHotelCountryAndCity({
      toCity: 'Dubai (DXB)',
      hotelLocation: 'Palm Jumeirah, Dubai',
    }),
    { country: 'United Arab Emirates', city: 'Dubai' }
  );
  assert.deepEqual(
    resolveHotelCountryAndCity({
      hotelLocation: 'Shinjuku Ward, Tokyo',
    }),
    { country: 'Japan', city: 'Tokyo' }
  );
});

test('addDaysToIsoDate and calculateStayNights handle date ranges accurately', () => {
  assert.equal(addDaysToIsoDate('2026-10-15', 1), '2026-10-16');
  assert.equal(addDaysToIsoDate('2026-10-31', 2), '2026-11-02');
  assert.equal(calculateStayNights('2026-10-15', '2026-10-18'), 3);
  assert.equal(calculateStayNights('2026-10-18', '2026-10-18'), 1);
  assert.equal(calculateStayNights('2026-10-20', '2026-10-18'), 1);
});

test('calculateStayAdjustedNightlyPrice scales by rooms and extra adult occupancy', () => {
  assert.equal(calculateStayAdjustedNightlyPrice(2000, 1, 2), 2000);
  assert.equal(calculateStayAdjustedNightlyPrice(2000, 2, 4), 4000);
  assert.equal(calculateStayAdjustedNightlyPrice(2000, 1, 3), 2450);
});

test('calculateHaversineDistanceKm, formatDistanceLabel, and resolveCountryRegionCode compute accurate values', async () => {
  const { calculateHaversineDistanceKm, formatDistanceLabel, resolveCountryRegionCode } =
    await import('./hotelCompareUtils');
  assert.equal(calculateHaversineDistanceKm(15.5, 73.75, 15.5, 73.75), 0);
  const approxKm = calculateHaversineDistanceKm(15.5439, 73.7553, 15.38, 73.8314);
  assert.ok(approxKm > 15 && approxKm < 25);
  assert.equal(formatDistanceLabel(0.45), '450 m');
  assert.equal(formatDistanceLabel(3.46), '3.5 km');
  assert.equal(formatDistanceLabel(24.3), '24 km');
  assert.equal(resolveCountryRegionCode('India'), 'IN');
  assert.equal(resolveCountryRegionCode('Japan'), 'JP');
  assert.equal(resolveCountryRegionCode('Unknown'), 'IN');
});

test('filterDistinctNearbyPlaces excludes primary hotel and deduplicates repeated place names', async () => {
  const { filterDistinctNearbyPlaces } = await import('./hotelCompareUtils');
  const filtered = filterDistinctNearbyPlaces(
    [
      { id: 'h-main', name: 'Goa Palms Heritage Resort' },
      { id: 'h-dup-name', name: ' goa palms heritage resort ' },
      { id: 't-1', name: 'Aradi, Saligao' },
      { id: 't-2', name: 'Aradi, Saligao' },
      { id: 't-3', name: 'St. Alex Church Stop' },
      { id: 't-4', name: 'Calangute Bus Stand' },
    ],
    'h-main',
    'Goa Palms Heritage Resort',
    2
  );
  assert.deepEqual(filtered, [
    { id: 't-1', name: 'Aradi, Saligao' },
    { id: 't-3', name: 'St. Alex Church Stop' },
  ]);
});


