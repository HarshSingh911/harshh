import test from 'node:test';
import assert from 'node:assert/strict';
import { buildHotelProviderDeals, getLowestHotelDealPrice } from './hotelCompareUtils';

test('buildHotelProviderDeals returns all 8 comparison sites sorted by lowest price by default', () => {
  const deals = buildHotelProviderDeals('Taj Fort Aguada Resort', 'price');
  assert.equal(deals.length, 8);
  assert.equal(deals[0].id, 'tripyeah-hotels-direct');
  assert.equal(deals[0].priceDelta, 0);
  for (let i = 1; i < deals.length; i++) {
    assert.ok(deals[i].priceDelta >= deals[i - 1].priceDelta);
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
