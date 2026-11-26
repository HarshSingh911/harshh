import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyFlightBaggage,
  countFlightsByFareMode,
  matchesFareToggleMode,
  matchesSidebarBaggageFilters,
} from './flightResultsFilterUtils';

test('classifyFlightBaggage identifies full-fare checked baggage vs cabin/underseat baggage-only fares', () => {
  const full = classifyFlightBaggage('7 kg Cabin + 15 kg Checked');
  assert.equal(full.hasCabinBag, true);
  assert.equal(full.hasCheckedBag, true);
  assert.equal(full.fareMode, 'full-fare');
  assert.equal(full.badgeLabel, '15 kg Checked included');

  const cabinOnly = classifyFlightBaggage('7 kg Cabin bag only');
  assert.equal(cabinOnly.hasCabinBag, true);
  assert.equal(cabinOnly.hasCheckedBag, false);
  assert.equal(cabinOnly.fareMode, 'baggage-only');
  assert.equal(cabinOnly.badgeLabel, '7 kg Cabin bag only');

  const underseat = classifyFlightBaggage('7 kg Underseat Carry-on');
  assert.equal(underseat.hasCabinBag, false);
  assert.equal(underseat.hasCheckedBag, false);
  assert.equal(underseat.fareMode, 'baggage-only');
  assert.equal(underseat.badgeLabel, 'Underseat carry-on only');
});

test('matchesFareToggleMode filters full-fare and baggage-only options accurately', () => {
  const flights = [
    { id: 'sg', baggage: '7 kg Cabin bag only' },
    { id: 'n0', baggage: '7 kg Underseat Carry-on' },
    { id: '6e', baggage: '7 kg Cabin + 15 kg Checked' },
    { id: 'ba', baggage: '7 kg Cabin + 23 kg Checked' },
  ];

  const all = flights.filter((f) => matchesFareToggleMode(f.baggage, 'all'));
  assert.equal(all.length, 4);

  const fullFare = flights.filter((f) => matchesFareToggleMode(f.baggage, 'full-fare'));
  assert.deepEqual(
    fullFare.map((f) => f.id),
    ['6e', 'ba']
  );

  const baggageOnly = flights.filter((f) => matchesFareToggleMode(f.baggage, 'baggage-only'));
  assert.deepEqual(
    baggageOnly.map((f) => f.id),
    ['sg', 'n0']
  );
});

test('matchesSidebarBaggageFilters and countFlightsByFareMode work consistently', () => {
  const flights = [
    { baggage: '7 kg Cabin bag only' },
    { baggage: '7 kg Underseat Carry-on' },
    { baggage: '7 kg Cabin + 15 kg Checked' },
    { baggage: '10 kg Cabin + 23 kg Checked' },
  ];

  assert.deepEqual(countFlightsByFareMode(flights), {
    all: 4,
    baggageOnly: 2,
    fullFare: 2,
  });

  const cabinFiltered = flights.filter((f) => matchesSidebarBaggageFilters(f.baggage, ['cabin']));
  assert.equal(cabinFiltered.length, 3);

  const checkedFiltered = flights.filter((f) => matchesSidebarBaggageFilters(f.baggage, ['checked']));
  assert.equal(checkedFiltered.length, 2);
});
