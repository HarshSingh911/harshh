import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDaysToIsoDate,
  buildHotelProviderBookingUrl,
  buildHotelProviderDeals,
  calculateStayAdjustedNightlyPrice,
  calculateStayNights,
  getCheapestHotelProviderDeal,
  getLowestHotelDealPrice,
  resolveHotelCountryAndCity,
} from './hotelCompareUtils';

test('buildHotelProviderDeals returns all 8 comparison sites sorted by lowest price by default', () => {
  const deals = buildHotelProviderDeals('Taj Fort Aguada Resort', 'price');
  assert.equal(deals.length, 8);
  assert.equal(deals[0].priceDelta, 0);
  assert.equal(deals[0].isCheapest, true);
  assert.notEqual(deals[0].id, 'tripyeah-hotels-direct');
  assert.equal(getCheapestHotelProviderDeal('Taj Fort Aguada Resort').id, deals[0].id);
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

test('buildHotelProviderBookingUrl builds exact hotel deep-link URLs with cleaned names and partner stay parameters', () => {
  const agodaUrl = buildHotelProviderBookingUrl({
    providerId: 'agoda',
    hotelName: 'Goa Palms Heritage Boutique Resort & Pool',
    city: 'Goa',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
    rooms: 1,
    adults: 2,
  });
  assert.ok(agodaUrl.startsWith('https://www.agoda.com/en-in/search?textToSearch='));
  assert.ok(agodaUrl.includes('checkIn=2026-10-15'));
  assert.ok(agodaUrl.includes('los=4'));

  const bookingUrl = buildHotelProviderBookingUrl({
    providerId: 'booking-com',
    hotelName: 'Taj Exotica Resort & Spa Goa (5★ Luxury Icon)',
    city: 'Goa',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
  });
  assert.ok(bookingUrl.startsWith('https://www.booking.com/searchresults.html?ss='));
  assert.ok(bookingUrl.includes('dest_type=hotel'));
  assert.ok(!bookingUrl.includes('Luxury%20Icon'), 'Marketing tags should be stripped for accurate hotel match');

  const expediaUrl = buildHotelProviderBookingUrl({
    providerId: 'expedia',
    hotelName: 'Casa Bella Seaview Private Pool Villa',
    city: 'Goa',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
  });
  assert.ok(expediaUrl.startsWith('https://www.expedia.co.in/Hotel-Search?destination='));
  assert.ok(expediaUrl.includes('hotelName=Casa%20Bella%20Seaview%20Private%20Pool%20Villa'));

  const mmtUrl = buildHotelProviderBookingUrl({
    providerId: 'makemytrip-hotels',
    hotelName: 'Casa Bella Villa',
    city: 'Goa',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
  });
  assert.ok(mmtUrl.startsWith('https://www.makemytrip.com/hotels/hotel-listing/'));
  assert.ok(mmtUrl.includes('checkin=10152026'));
  assert.ok(mmtUrl.includes('locusType=hotel'));

  const goibiboUrl = buildHotelProviderBookingUrl({
    providerId: 'goibibo-hotels',
    hotelName: 'Casa Bella Villa',
    city: 'North Goa',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
  });
  assert.ok(goibiboUrl.startsWith('https://www.goibibo.com/hotels/find-hotels-in-north-goa/'));
  assert.ok(goibiboUrl.includes('ci=20261015'));
  assert.ok(goibiboUrl.includes('hotelName=Casa%20Bella%20Villa'));

  const directOverrideUrl = buildHotelProviderBookingUrl({
    providerId: 'booking-com',
    hotelName: 'Taj Exotica Resort & Spa Goa',
    city: 'Goa',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
    rooms: 1,
    adults: 2,
    partnerUrls: {
      'booking-com': 'https://www.booking.com/hotel/in/taj-exotica-goa.html',
    },
  });
  assert.ok(directOverrideUrl.startsWith('https://www.booking.com/hotel/in/taj-exotica-goa.html?'));
  assert.ok(directOverrideUrl.includes('checkin=2026-10-15'));
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

test('TRANSIT_OVERLAY_OPTIONS exposes Public Transport, Walking Routes, and Cab/Taxi Availability', async () => {
  const { TRANSIT_OVERLAY_OPTIONS } = await import('./hotelCompareUtils');
  assert.deepEqual(
    TRANSIT_OVERLAY_OPTIONS.map((o) => o.label),
    ['Public Transport', 'Walking Routes', 'Cab/Taxi Availability']
  );
  assert.deepEqual(
    TRANSIT_OVERLAY_OPTIONS.map((o) => o.id),
    ['public_transport', 'walking_routes', 'cab_taxi']
  );
});

test('formatRouteDurationMillis and formatRouteDistanceMeters format route metrics accurately', async () => {
  const { formatRouteDurationMillis, formatRouteDistanceMeters } = await import(
    './hotelCompareUtils'
  );
  assert.equal(formatRouteDurationMillis(12 * 60 * 1000), '12 min');
  assert.equal(formatRouteDurationMillis(30000), '1 min');
  assert.equal(formatRouteDurationMillis(95 * 60 * 1000), '1 hr 35 min');
  assert.equal(formatRouteDurationMillis(0), '');
  assert.equal(formatRouteDurationMillis(null), '');

  assert.equal(formatRouteDistanceMeters(450), '450 m');
  assert.equal(formatRouteDistanceMeters(1850), '1.9 km');
  assert.equal(formatRouteDistanceMeters(undefined), '');
});

test('deriveCabPickupSummary formats real taxi stand and traffic status text without fabricating data', async () => {
  const { deriveCabPickupSummary } = await import('./hotelCompareUtils');
  assert.equal(
    deriveCabPickupSummary({
      taxiStandCount: 3,
      nearestStandName: 'Calangute Taxi Stand',
      nearestDriveDuration: '6 min',
    }),
    'Nearest stand: Calangute Taxi Stand (6 min drive) · Live road traffic overlay active'
  );
  assert.equal(
    deriveCabPickupSummary({ taxiStandCount: 0 }),
    'Live Google Maps traffic overlay active · Showing nearest transit & airport cab pickup points'
  );
});

test('buildHotelPriceComparisonChartData returns sorted top providers matching lowest deal', async () => {
  const { buildHotelPriceComparisonChartData, getCheapestHotelProviderDeal } = await import(
    './hotelCompareUtils'
  );
  const hotelName = 'Goa Palms Heritage Boutique Resort & Pool';
  const points = buildHotelPriceComparisonChartData(hotelName, 1950, 5);
  assert.equal(points.length, 5);
  assert.equal(points[0].providerId, getCheapestHotelProviderDeal(hotelName).id);
  assert.equal(points[0].priceInr, 1950);
  assert.equal(points[0].isCheapest, true);
  assert.equal(points[0].deltaFromLowestInr, 0);
  for (let i = 1; i < points.length; i++) {
    assert.ok(points[i].priceInr >= points[i - 1].priceInr);
    assert.equal(points[i].isCheapest, false);
    assert.ok(points[i].shortLabel.length > 0 && points[i].shortLabel.length <= 10);
  }
});

test('computeCompactPriceChartDomain produces tight non-negative domain for readable bar contrast', async () => {
  const { computeCompactPriceChartDomain } = await import('./hotelCompareUtils');
  const [minY, maxY] = computeCompactPriceChartDomain([1950, 2015, 2060, 2095, 2130]);
  assert.ok(minY >= 0 && minY < 1950);
  assert.ok(maxY > 2130);
  assert.ok(minY > 1500, 'Expected tight baseline so bar height differences are visually clear');
  assert.deepEqual(computeCompactPriceChartDomain([]), [0, 100]);
});



