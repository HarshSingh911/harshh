import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFlightPartnerBookingUrl,
  buildFlightProviderDeals,
  filterFlightProviderDeals,
  getBaggageSummaryText,
  parseFlightBaggageAllowance,
  parseFlightJourneyDetails,
} from './flightCompareUtils';

test('getBaggageSummaryText returns exact labels for all 4 combinations', () => {
  assert.equal(getBaggageSummaryText(true, true), 'Cabin + Checked bag included');
  assert.equal(getBaggageSummaryText(true, false), 'Cabin bag included');
  assert.equal(getBaggageSummaryText(false, true), 'Checked bag included');
  assert.equal(getBaggageSummaryText(false, false), '');
});

test('parseFlightBaggageAllowance distinguishes full baggage vs underseat carry-on', () => {
  const full = parseFlightBaggageAllowance('7 kg Cabin + 15 kg Checked');
  assert.equal(full.flightIncludesCabin, true);
  assert.equal(full.flightIncludesCheckIn, true);
  assert.equal(full.cabinWeightText, '7 kg');
  assert.equal(full.checkInWeightText, '15 kg');

  const underseat = parseFlightBaggageAllowance('7 kg Underseat Carry-on');
  assert.equal(underseat.flightIncludesCabin, false);
  assert.equal(underseat.flightIncludesCheckIn, false);
});

test('buildFlightProviderDeals includes all 4 baggage states, 24/7 priority desk, numeric reviews, and UPI/partner perks', () => {
  const deals = buildFlightProviderDeals({
    airline: 'IndiGo',
    baggageText: '7 kg Cabin + 15 kg Checked',
  });

  assert.equal(deals.length, 7);
  assert.ok(deals.every((d) => d.deskLabel === '24/7 priority desk'));
  assert.ok(deals.every((d) => d.hasSmallPersonalBag === true));
  assert.ok(deals.every((d) => /^\d[\d,]*$/.test(d.reviewsCount)));
  assert.ok(deals.some((d) => d.featurePoints.some((fp) => fp.key === 'upi')));
  assert.ok(deals.every((d) => d.featurePoints.length >= 1));

  const hasBoth = deals.some((d) => d.hasCabinBag && d.hasCheckInBag);
  const hasCabinOnly = deals.some((d) => d.hasCabinBag && !d.hasCheckInBag);
  const hasCheckInOnly = deals.some((d) => !d.hasCabinBag && d.hasCheckInBag);
  const hasNeither = deals.some((d) => !d.hasCabinBag && !d.hasCheckInBag);

  assert.equal(hasBoth, true);
  assert.equal(hasCabinOnly, true);
  assert.equal(hasCheckInOnly, true);
  assert.equal(hasNeither, true);
});

test('filterFlightProviderDeals filters correctly by Cabin bag and Checked bag', () => {
  const deals = buildFlightProviderDeals({
    airline: 'Air India',
    baggageText: '7 kg Cabin + 20 kg Checked',
  });

  const all = filterFlightProviderDeals(deals, {
    requireCabinBag: false,
    requireCheckInBag: false,
  });
  assert.equal(all.length, deals.length);

  const cabinOnly = filterFlightProviderDeals(deals, {
    requireCabinBag: true,
    requireCheckInBag: false,
  });
  assert.ok(cabinOnly.length > 0 && cabinOnly.length < deals.length);
  assert.ok(cabinOnly.every((d) => d.hasCabinBag));

  const checkInOnly = filterFlightProviderDeals(deals, {
    requireCabinBag: false,
    requireCheckInBag: true,
  });
  assert.ok(checkInOnly.length > 0 && checkInOnly.length < deals.length);
  assert.ok(checkInOnly.every((d) => d.hasCheckInBag));

  const both = filterFlightProviderDeals(deals, {
    requireCabinBag: true,
    requireCheckInBag: true,
  });
  assert.ok(both.length > 0);
  assert.ok(both.every((d) => d.hasCabinBag && d.hasCheckInBag));
});

test('buildFlightPartnerBookingUrl builds valid flight search URLs for external booking partners', () => {
  const mmtUrl = buildFlightPartnerBookingUrl({
    providerId: 'makemytrip',
    airline: 'IndiGo',
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
    travelDate: '2026-10-15',
    travellers: 2,
    cabinClass: 'Economy',
  });
  assert.ok(mmtUrl.startsWith('https://www.makemytrip.com/flight/search'));
  assert.ok(mmtUrl.includes('DEL-GOI'));

  const emtUrl = buildFlightPartnerBookingUrl({
    providerId: 'easemytrip',
    airline: 'IndiGo',
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
    travelDate: '2026-10-15',
    travellers: 1,
    cabinClass: 'Economy',
  });
  assert.ok(emtUrl.startsWith('https://flight.easemytrip.com/FlightList/Index'));
  assert.ok(emtUrl.includes('DEL'));
  assert.ok(emtUrl.includes('GOI'));

  const ctUrl = buildFlightPartnerBookingUrl({
    providerId: 'cleartrip',
    airline: 'IndiGo',
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
    travelDate: '2026-10-15',
    travellers: 1,
    cabinClass: 'Economy',
  });
  assert.ok(ctUrl.startsWith('https://www.cleartrip.com/flights/results'));
  assert.ok(ctUrl.includes('from=DEL'));
  assert.ok(ctUrl.includes('to=GOI'));

  const goUrl = buildFlightPartnerBookingUrl({
    providerId: 'goibibo',
    airline: 'IndiGo',
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
    travelDate: '2026-10-15',
    travellers: 1,
    cabinClass: 'Economy',
  });
  assert.ok(goUrl.includes('goibibo.com/flights/air-DEL-GOI-20261015'));

  const airlineUrl = buildFlightPartnerBookingUrl({
    providerId: 'airline-direct',
    airline: 'IndiGo',
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
    travelDate: '2026-10-15',
    travellers: 1,
    cabinClass: 'Economy',
  });
  assert.equal(airlineUrl, 'https://www.goindigo.in/');
});

test('parseFlightJourneyDetails parses direct flight, gate deduplication, and dynamic amenities', () => {
  const direct = parseFlightJourneyDetails({
    flight: {
      airline: 'SpiceJet',
      flightNo: 'SG-8169',
      badgeCode: 'SG',
      badgeBg: 'bg-red-500',
      aircraft: 'Boeing 737-800',
      depTime: '15:20',
      arrTime: '17:40',
      duration: '2h 20m',
      durationMins: 140,
      stops: 'Direct',
      stopsCount: 0,
      depTerminal: 'Terminal 2',
      depGate: 'Gate 25',
      arrTerminal: 'Terminal 1',
      arrGate: 'B9',
      amenities: { meal: false, wifi: false, entertainment: false, power: false, seatPitch: '29 in' },
    },
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
  });

  assert.equal(direct.hasLayover, false);
  assert.equal(direct.operatedBy, undefined);
  assert.equal(direct.depTerminalLine, 'Terminal 2');
  assert.equal(direct.arrTerminalLine, 'Terminal 1');
  assert.deepEqual(direct.amenities, {
    meal: false,
    wifi: false,
    entertainment: false,
    power: false,
    seatPitch: '29 in',
    seatLayout: '3-3 seat layout',
  });
});

test('parseFlightJourneyDetails parses layover flights, leg times, operatedBy, and amenities', () => {
  const layover = parseFlightJourneyDetails({
    flight: {
      airline: 'Delta Air Lines',
      operatedBy: 'KLM Royal Dutch Airlines',
      flightNo: 'DL-108',
      badgeCode: 'DL',
      badgeBg: 'bg-blue-800',
      aircraft: 'Airbus A330-900neo',
      depTime: '06:15',
      arrTime: '14:45',
      duration: '10h 30m',
      durationMins: 630,
      stops: '1 stop (AMS)',
      stopsCount: 1,
      stopAirport: 'Amsterdam (AMS) · 1h 20m layover',
      depTerminal: 'Terminal 3',
      arrTerminal: 'Terminal 4',
      amenities: { meal: true, wifi: true, entertainment: true, power: true, seatPitch: '31 in' },
    },
    fromCity: 'New Delhi (DEL)',
    toCity: 'London (LHR)',
  });

  assert.equal(layover.hasLayover, true);
  assert.equal(layover.operatedBy, 'KLM Royal Dutch Airlines');
  assert.equal(layover.layoverAirport, 'Amsterdam (AMS)');
  assert.equal(layover.layoverDuration, '1h 20m');
  assert.equal(layover.leg1Duration, '4h 45m');
  assert.equal(layover.leg2Duration, '4h 25m');
  assert.equal(layover.layoverArrTime, '11:00');
  assert.equal(layover.layoverDepTime, '12:20');
  assert.deepEqual(layover.amenities, {
    meal: true,
    wifi: true,
    entertainment: true,
    power: true,
    seatPitch: '31 in',
    seatLayout: '3-3-3 seat layout',
  });

  const nestedStops = parseFlightJourneyDetails({
    flight: {
      airline: 'IndiGo',
      flightNo: '6E-6412',
      depTime: '16:10',
      arrTime: '21:05',
      duration: '4h 55m',
      durationMins: 295,
      stops: '1 stop (Bengaluru (BLR))',
      stopsCount: 1,
      stopAirport: 'Bengaluru (BLR) · 1h 25m layover',
    },
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
  });
  assert.equal(nestedStops.stopsLabel, '1 stop · Bengaluru (BLR)');
  assert.equal(nestedStops.selfTransfer, false);

  const selfTransferFlight = parseFlightJourneyDetails({
    flight: {
      airline: 'IndiGo',
      flightNo: '6E-6412',
      depTime: '16:10',
      arrTime: '21:05',
      duration: '4h 55m',
      durationMins: 295,
      stops: '1 stop (Bengaluru (BLR))',
      stopsCount: 1,
      stopAirport: 'Bengaluru (BLR) · 1h 25m layover',
      selfTransfer: true,
    },
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
  });
  assert.equal(selfTransferFlight.hasLayover, true);
  assert.equal(selfTransferFlight.selfTransfer, true);
});


