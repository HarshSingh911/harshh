import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildHotelAmenitiesDisplay,
  STANDARD_AMENITY_CATEGORIES,
} from './hotelAmenitiesUtils';

test('returns 6 featured highlights and all 13 standard categories', () => {
  const result = buildHotelAmenitiesDisplay([]);
  assert.equal(result.featuredAmenities.length, 6);
  assert.equal(result.categorizedGroups.length, STANDARD_AMENITY_CATEGORIES.length);
  assert.equal(result.categorizedGroups[0].title, 'Accessibility');
  assert.equal(
    result.categorizedGroups[result.categorizedGroups.length - 1].title,
    'WiFi and internet'
  );
});

test('prioritizes API-provided highlights and avoids WiFi duplicates', () => {
  const result = buildHotelAmenitiesDisplay([
    'Free WiFi',
    'Free Wi-Fi',
    'Swimming Pool',
    'Air Conditioning',
    'Airport Shuttle',
  ]);

  const wifiEntries = result.featuredAmenities.filter(
    (a) => a.toLowerCase().includes('wifi') || a.toLowerCase().includes('wi-fi')
  );
  assert.equal(wifiEntries.length, 1);
  assert.equal(result.featuredAmenities.length, 6);
  assert.ok(result.featuredAmenities.includes('Airport Shuttle'));
});

test('includes custom API amenity not in standard categories under Services', () => {
  const result = buildHotelAmenitiesDisplay(['Private Helipad']);
  const services = result.categorizedGroups.find((g) => g.id === 'services');
  assert.ok(services?.items.includes('Private Helipad'));
});
