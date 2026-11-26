export type FlightPartnerId =
  | 'tripyeah-direct'
  | 'airline-direct'
  | 'makemytrip'
  | 'easemytrip'
  | 'cleartrip'
  | 'goibibo'
  | 'expedia';

export interface FlightPartnerFeaturePoint {
  key: 'upi' | 'instant' | 'cancellation';
  label: string;
}

export interface FlightProviderDeal {
  id: FlightPartnerId;
  name: string;
  logoBg: string;
  logoText: string;
  rating: number;
  reviewsCount: string;
  deskLabel: string;
  featurePoints: FlightPartnerFeaturePoint[];
  hasCabinBag: boolean;
  hasCheckInBag: boolean;
  hasSmallPersonalBag: boolean;
  cabinBagLabel: string;
  checkInBagLabel: string;
  priceDelta: number;
  isCheapest?: boolean;
  isOfficialAirline?: boolean;
}

export interface FlightBaggageFilterState {
  requireCabinBag: boolean;
  requireCheckInBag: boolean;
}

export function extractAirportCode(cityStr?: string, fallback = 'DEL'): string {
  if (!cityStr) return fallback;
  const parenMatch = cityStr.match(/\(([A-Z]{3})\)/i);
  if (parenMatch) return parenMatch[1].toUpperCase();
  const trimmed = cityStr.trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(trimmed)) return trimmed;
  return fallback;
}

export function extractCityNameOnly(cityStr?: string, fallback = 'New Delhi'): string {
  if (!cityStr) return fallback;
  const parenMatch = cityStr.match(/^(.+?)\s*\([A-Z]{3}\)$/i);
  if (parenMatch) return parenMatch[1].trim();
  return cityStr.trim() || fallback;
}

export function parseFlightBaggageAllowance(baggageStr?: string): {
  flightIncludesCabin: boolean;
  flightIncludesCheckIn: boolean;
  cabinWeightText: string;
  checkInWeightText: string;
} {
  const raw = (baggageStr || '').trim();
  const lower = raw.toLowerCase();

  const isUnderseatOnly =
    lower.includes('underseat') && !lower.includes('cabin') && !lower.includes('checked') && !lower.includes('check-in');

  const hasCheckedKeyword =
    (lower.includes('checked') || lower.includes('check-in') || lower.includes('check in')) &&
    !lower.includes('no check-in') &&
    !lower.includes('no checked');

  const hasCabinKeyword =
    lower.includes('cabin') || lower.includes('carry-on') || lower.includes('carry on') || lower.includes('hand');

  const cabinWeightMatch = raw.match(/(\d+\s*kg)\s*(?:cabin|carry-on|hand)/i);
  const checkInWeightMatch = raw.match(/(\d+\s*kg)\s*(?:checked|check-in|check in)/i);

  if (isUnderseatOnly) {
    return {
      flightIncludesCabin: false,
      flightIncludesCheckIn: false,
      cabinWeightText: '7 kg',
      checkInWeightText: '15 kg',
    };
  }

  return {
    flightIncludesCabin: hasCabinKeyword || !raw,
    flightIncludesCheckIn: hasCheckedKeyword || !raw,
    cabinWeightText: cabinWeightMatch?.[1] || '7 kg',
    checkInWeightText: checkInWeightMatch?.[1] || '15 kg',
  };
}

export function getBaggageSummaryText(hasCabinBag: boolean, hasCheckInBag: boolean): string {
  if (hasCabinBag && hasCheckInBag) {
    return 'Cabin + Checked bag included';
  }
  if (hasCabinBag) {
    return 'Cabin bag included';
  }
  if (hasCheckInBag) {
    return 'Checked bag included';
  }
  return '';
}

export function buildFlightProviderDeals(params: {
  airline: string;
  baggageText?: string;
}): FlightProviderDeal[] {
  const airlineName = (params.airline || 'Commercial Airline').trim();
  const parsed = parseFlightBaggageAllowance(params.baggageText);
  const isUnderseatFlight = !parsed.flightIncludesCabin && !parsed.flightIncludesCheckIn;

  // Provide realistic fare bundles across major booking partners so users can compare
  // sites with both bags, cabin-only, check-in-only, and basic personal-bag-only fares.
  const deals: FlightProviderDeal[] = [
    {
      id: 'goibibo',
      name: 'Goibibo',
      logoBg: 'bg-indigo-600',
      logoText: 'GO',
      rating: 4.5,
      reviewsCount: '19,800',
      deskLabel: '24/7 priority desk',
      featurePoints: [
        { key: 'upi', label: 'UPI payments accepted' },
      ],
      hasCabinBag: false,
      hasCheckInBag: false,
      hasSmallPersonalBag: true,
      cabinBagLabel: `Cabin bag (${parsed.cabinWeightText})`,
      checkInBagLabel: `Checked bag (${parsed.checkInWeightText})`,
      priceDelta: isUnderseatFlight ? 0 : -280,
    },
    {
      id: 'easemytrip',
      name: 'EaseMyTrip',
      logoBg: 'bg-cyan-700',
      logoText: 'EMT',
      rating: 4.6,
      reviewsCount: '31,200',
      deskLabel: '24/7 priority desk',
      featurePoints: [
        { key: 'upi', label: 'UPI payments accepted' },
        { key: 'instant', label: 'Instant confirmation' },
      ],
      hasCabinBag: true,
      hasCheckInBag: false,
      hasSmallPersonalBag: true,
      cabinBagLabel: `Cabin bag (${parsed.cabinWeightText})`,
      checkInBagLabel: `Checked bag (${parsed.checkInWeightText})`,
      priceDelta: isUnderseatFlight ? 350 : -120,
    },
    {
      id: 'tripyeah-direct',
      name: 'TripYeah Official',
      logoBg: 'bg-blue-600',
      logoText: 'TY',
      rating: 4.9,
      reviewsCount: '28,400',
      deskLabel: '24/7 priority desk',
      featurePoints: [
        { key: 'upi', label: 'UPI payments accepted' },
        { key: 'cancellation', label: 'Free 24h cancellation' },
      ],
      hasCabinBag: true,
      hasCheckInBag: true,
      hasSmallPersonalBag: true,
      cabinBagLabel: `Cabin bag (${parsed.cabinWeightText})`,
      checkInBagLabel: `Checked bag (${parsed.checkInWeightText})`,
      priceDelta: isUnderseatFlight ? 1450 : 0,
    },
    {
      id: 'cleartrip',
      name: 'Cleartrip',
      logoBg: 'bg-orange-600',
      logoText: 'CT',
      rating: 4.6,
      reviewsCount: '22,600',
      deskLabel: '24/7 priority desk',
      featurePoints: [
        { key: 'upi', label: 'UPI payments accepted' },
      ],
      hasCabinBag: false,
      hasCheckInBag: true,
      hasSmallPersonalBag: true,
      cabinBagLabel: `Cabin bag (${parsed.cabinWeightText})`,
      checkInBagLabel: `Checked bag (${parsed.checkInWeightText})`,
      priceDelta: isUnderseatFlight ? 1180 : 95,
    },
    {
      id: 'airline-direct',
      name: `${airlineName} Official Site`,
      logoBg: 'bg-slate-900',
      logoText: airlineName.substring(0, 2).toUpperCase() || 'AL',
      rating: 4.8,
      reviewsCount: '45,100',
      deskLabel: '24/7 priority desk',
      featurePoints: [
        { key: 'upi', label: 'UPI payments accepted' },
        { key: 'instant', label: 'Instant e-ticket' },
      ],
      hasCabinBag: true,
      hasCheckInBag: true,
      hasSmallPersonalBag: true,
      cabinBagLabel: `Cabin bag (${parsed.cabinWeightText})`,
      checkInBagLabel: `Checked bag (${parsed.checkInWeightText})`,
      priceDelta: isUnderseatFlight ? 1590 : 120,
      isOfficialAirline: true,
    },
    {
      id: 'makemytrip',
      name: 'MakeMyTrip',
      logoBg: 'bg-red-600',
      logoText: 'MMT',
      rating: 4.7,
      reviewsCount: '54,300',
      deskLabel: '24/7 priority desk',
      featurePoints: [
        { key: 'upi', label: 'UPI payments accepted' },
        { key: 'instant', label: 'Instant confirmation' },
      ],
      hasCabinBag: true,
      hasCheckInBag: true,
      hasSmallPersonalBag: true,
      cabinBagLabel: `Cabin bag (${parsed.cabinWeightText})`,
      checkInBagLabel: `Checked bag (${parsed.checkInWeightText})`,
      priceDelta: isUnderseatFlight ? 1680 : 185,
    },
    {
      id: 'expedia',
      name: 'Expedia',
      logoBg: 'bg-[#001959]',
      logoText: 'EXP',
      rating: 4.6,
      reviewsCount: '33,900',
      deskLabel: '24/7 priority desk',
      featurePoints: [
        { key: 'cancellation', label: 'Free 24h cancellation' },
        { key: 'instant', label: 'Instant confirmation' },
      ],
      hasCabinBag: true,
      hasCheckInBag: false,
      hasSmallPersonalBag: true,
      cabinBagLabel: `Cabin bag (${parsed.cabinWeightText})`,
      checkInBagLabel: `Checked bag (${parsed.checkInWeightText})`,
      priceDelta: isUnderseatFlight ? 490 : 210,
    },
  ];

  const sorted = [...deals].sort((a, b) => a.priceDelta - b.priceDelta);
  if (sorted.length > 0) {
    sorted[0] = { ...sorted[0], isCheapest: true };
  }
  return sorted;
}

export function filterFlightProviderDeals(
  deals: FlightProviderDeal[],
  filter: FlightBaggageFilterState
): FlightProviderDeal[] {
  return deals.filter((deal) => {
    if (filter.requireCabinBag && !deal.hasCabinBag) {
      return false;
    }
    if (filter.requireCheckInBag && !deal.hasCheckInBag) {
      return false;
    }
    return true;
  });
}

function toDdMmYyyy(isoDate?: string): string {
  if (!isoDate) return '15/10/2026';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return '15/10/2026';
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function toYyyyMmDdCompact(isoDate?: string): string {
  if (!isoDate) return '20261015';
  return isoDate.replace(/-/g, '');
}

function getAirlineOfficialFlightUrl(airlineName: string): string {
  const lower = (airlineName || '').toLowerCase();
  if (lower.includes('indigo')) return 'https://www.goindigo.in/';
  if (lower.includes('air india')) return 'https://www.airindia.com/';
  if (lower.includes('akasa')) return 'https://www.akasaair.com/';
  if (lower.includes('spicejet')) return 'https://www.spicejet.com/';
  if (lower.includes('vistara')) return 'https://www.airindia.com/';
  if (lower.includes('british')) return 'https://www.britishairways.com/';
  if (lower.includes('virgin')) return 'https://www.virginatlantic.com/';
  if (lower.includes('emirates')) return 'https://www.emirates.com/';
  if (lower.includes('singapore')) return 'https://www.singaporeair.com/';
  if (lower.includes('lufthansa')) return 'https://www.lufthansa.com/';
  if (lower.includes('qatar')) return 'https://www.qatarairways.com/';
  if (lower.includes('delta')) return 'https://www.delta.com/';
  if (lower.includes('norse')) return 'https://flynorse.com/';
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(airlineName || 'flights')}`;
}

const INDIAN_DOMESTIC_IATAS = new Set([
  'DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU', 'GOI', 'GOX', 'PNQ', 'AMD',
  'COK', 'JAI', 'LKO', 'GAU', 'ATQ', 'IXC', 'SXR', 'VNS', 'PAT', 'BBI',
  'TRV', 'IXB', 'UDR', 'JDH', 'NAG', 'IDR', 'VTZ', 'CJB', 'BDQ', 'STV',
]);

export function buildFlightPartnerBookingUrl(params: {
  providerId: FlightPartnerId;
  airline: string;
  fromCity: string;
  toCity: string;
  travelDate: string;
  returnDate?: string;
  isRoundTrip?: boolean;
  travellers: number;
  cabinClass: string;
}): string {
  const fromCode = extractAirportCode(params.fromCity, 'DEL');
  const toCode = extractAirportCode(params.toCity, 'BOM');
  const fromName = extractCityNameOnly(params.fromCity, 'New Delhi');
  const toName = extractCityNameOnly(params.toCity, 'Mumbai');
  const pax = Math.max(1, params.travellers || 1);
  const isRoundTrip = Boolean(params.isRoundTrip && params.returnDate);
  const depDdMmYyyy = toDdMmYyyy(params.travelDate);
  const retDdMmYyyy = toDdMmYyyy(params.returnDate);
  const depCompact = toYyyyMmDdCompact(params.travelDate);
  const retCompact = toYyyyMmDdCompact(params.returnDate);
  const isIntl = !INDIAN_DOMESTIC_IATAS.has(fromCode) || !INDIAN_DOMESTIC_IATAS.has(toCode);

  const cabinLower = (params.cabinClass || 'Economy').toLowerCase();
  const mmtCabin = cabinLower.includes('first')
    ? 'F'
    : cabinLower.includes('business')
    ? 'B'
    : cabinLower.includes('premium')
    ? 'PE'
    : 'E';
  const ctCabin = cabinLower.includes('first')
    ? 'First'
    : cabinLower.includes('business')
    ? 'Business'
    : cabinLower.includes('premium')
    ? 'Premium%20Economy'
    : 'Economy';
  const goCabin = cabinLower.includes('first')
    ? 'F'
    : cabinLower.includes('business')
    ? 'B'
    : cabinLower.includes('premium')
    ? 'W'
    : 'E';
  const expediaCabin = cabinLower.includes('first')
    ? 'first'
    : cabinLower.includes('business')
    ? 'business'
    : cabinLower.includes('premium')
    ? 'premium'
    : 'economy';

  switch (params.providerId) {
    case 'makemytrip': {
      const itinerary = isRoundTrip
        ? `${fromCode}-${toCode}-${depDdMmYyyy}_${toCode}-${fromCode}-${retDdMmYyyy}`
        : `${fromCode}-${toCode}-${depDdMmYyyy}`;
      return `https://www.makemytrip.com/flight/search?itinerary=${encodeURIComponent(itinerary)}&tripType=${
        isRoundTrip ? 'R' : 'O'
      }&paxType=A-${pax}_C-0_I-0&intl=${isIntl ? 'true' : 'false'}&cabinClass=${mmtCabin}`;
    }
    case 'easemytrip': {
      const srch = `${fromCode}-${fromName}-${toCode}-${toName}-${depDdMmYyyy}`;
      return `https://flight.easemytrip.com/FlightList/Index?srch=${encodeURIComponent(srch)}&px=${pax}-0-0&cbn=0&ar=${
        isRoundTrip ? encodeURIComponent(retDdMmYyyy) : ''
      }&isow=${isRoundTrip ? 'false' : 'true'}`;
    }
    case 'cleartrip':
      return `https://www.cleartrip.com/flights/results?adults=${pax}&childs=0&infants=0&class=${ctCabin}&depart_date=${encodeURIComponent(
        depDdMmYyyy
      )}&from=${fromCode}&to=${toCode}&intl=${isIntl ? 'y' : 'n'}${
        isRoundTrip ? `&return_date=${encodeURIComponent(retDdMmYyyy)}` : ''
      }`;
    case 'goibibo':
      return `https://www.goibibo.com/flights/air-${fromCode}-${toCode}-${depCompact}${
        isRoundTrip ? `-${retCompact}` : ''
      }-${pax}-0-0-${goCabin}-${isIntl ? 'I' : 'D'}/`;
    case 'expedia':
      return `https://www.expedia.co.in/Flights-Search?trip=${
        isRoundTrip ? 'roundtrip' : 'oneway'
      }&leg1=from:${fromCode},to:${toCode},departure:${encodeURIComponent(depDdMmYyyy)}TANYT${
        isRoundTrip
          ? `&leg2=from:${toCode},to:${fromCode},departure:${encodeURIComponent(retDdMmYyyy)}TANYT`
          : ''
      }&passengers=adults:${pax},children:0,seniors:0,infantinlap:Y&options=cabinclass:${expediaCabin}&mode=search`;
    case 'airline-direct':
      return getAirlineOfficialFlightUrl(params.airline);
    case 'tripyeah-direct':
    default:
      return '';
  }
}

export interface FlightAmenitiesState {
  meal: boolean;
  wifi: boolean;
  entertainment: boolean;
  power: boolean;
  seatPitch: string;
  seatLayout: string;
}

export function getAircraftSeatLayout(aircraftName?: string): string {
  const lower = (aircraftName || '').toLowerCase();
  if (lower.includes('777') || lower.includes('747')) return '3-4-3 seat layout';
  if (lower.includes('787') || lower.includes('a350') || lower.includes('a330')) {
    return '3-3-3 seat layout';
  }
  if (lower.includes('atr') || lower.includes('q400') || lower.includes('dash')) {
    return '2-2 seat layout';
  }
  if (lower.includes('a220') || lower.includes('e190') || lower.includes('e175')) {
    return '2-3 seat layout';
  }
  return '3-3 seat layout';
}

export interface ParsedFlightJourneyDetails {
  airline: string;
  operatedBy?: string;
  flightNo: string;
  aircraft: string;
  badgeCode: string;
  badgeBg: string;
  depTime: string;
  arrTime: string;
  duration: string;
  durationMins: number;
  stopsLabel: string;
  hasLayover: boolean;
  layoverAirport: string;
  layoverDuration: string;
  layoverArrTime: string;
  layoverDepTime: string;
  leg1Duration: string;
  leg2Duration: string;
  fromAirportLabel: string;
  toAirportLabel: string;
  fromCode: string;
  toCode: string;
  depTerminalLine: string;
  arrTerminalLine: string;
  daysLater?: number;
  selfTransfer: boolean;
  amenities: FlightAmenitiesState;
}

export function parseDurationTextToMins(durationStr?: string, fallbackMins = 140): number {
  if (!durationStr) return fallbackMins;
  const hMatch = durationStr.match(/(\d+)\s*h/i);
  const mMatch = durationStr.match(/(\d+)\s*m/i);
  const hours = hMatch ? Number(hMatch[1]) : 0;
  const mins = mMatch ? Number(mMatch[1]) : 0;
  const total = hours * 60 + mins;
  return total > 0 ? total : fallbackMins;
}

export function formatMinutesToDuration(totalMins: number): string {
  const safeMins = Math.max(15, Math.round(totalMins));
  const h = Math.floor(safeMins / 60);
  const m = safeMins % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function parseClockTimeToMins(timeStr?: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function formatMinsToClockTime(totalMins: number): string {
  const normalized = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTerminalOnly(terminal?: string, fallbackTerminal = 'Terminal 1'): string {
  const cleanTerminal = (terminal || fallbackTerminal).trim();
  return cleanTerminal.replace(/\s*[·,-]?\s*gate\s+[a-z0-9-]+/gi, '').trim() || fallbackTerminal;
}

export function parseFlightJourneyDetails(params: {
  flight?: {
    airline?: string;
    operatedBy?: string;
    flightNo?: string;
    aircraft?: string;
    badgeCode?: string;
    badgeBg?: string;
    depTime?: string;
    arrTime?: string;
    duration?: string;
    durationMins?: number;
    stops?: string;
    stopsCount?: number;
    stopAirport?: string;
    depTerminal?: string;
    arrTerminal?: string;
    depGate?: string;
    arrGate?: string;
    daysLater?: number;
    selfTransfer?: boolean;
    tags?: string[];
    amenities?: {
      wifi?: boolean;
      meal?: boolean;
      entertainment?: boolean;
      power?: boolean;
      seatPitch?: string;
    };
  };
  fallbackAirline?: string;
  fallbackFlightNo?: string;
  fallbackDepTime?: string;
  fallbackArrTime?: string;
  fallbackDuration?: string;
  fromCity: string;
  toCity: string;
}): ParsedFlightJourneyDetails {
  const fl = params.flight || {};
  const airline = (fl.airline || params.fallbackAirline || 'Commercial Airline').trim();
  const rawOperatedBy = (fl.operatedBy || '').trim();
  const operatedBy =
    rawOperatedBy && rawOperatedBy.toLowerCase() !== airline.toLowerCase()
      ? rawOperatedBy
      : undefined;

  const flightNo = (fl.flightNo || params.fallbackFlightNo || '6E-2134').trim();
  const aircraft = (fl.aircraft || 'Airbus A320neo').trim();
  const badgeCode = (fl.badgeCode || airline.substring(0, 2).toUpperCase() || 'FL').trim();
  const badgeBg = fl.badgeBg || 'bg-blue-600';

  const depTime = (fl.depTime || params.fallbackDepTime || '09:20').trim();
  const arrTime = (fl.arrTime || params.fallbackArrTime || '11:40').trim();
  const durationMins = fl.durationMins && fl.durationMins > 0
    ? fl.durationMins
    : parseDurationTextToMins(fl.duration || params.fallbackDuration, 140);
  const duration = (fl.duration || params.fallbackDuration || formatMinutesToDuration(durationMins)).trim();

  const rawStops = (fl.stops || 'Direct').trim();
  const stopsCount = typeof fl.stopsCount === 'number' ? fl.stopsCount : 0;
  const hasLayover =
    stopsCount > 0 ||
    Boolean(fl.stopAirport) ||
    (rawStops.length > 0 &&
      !rawStops.toLowerCase().includes('direct') &&
      !rawStops.toLowerCase().includes('non-stop') &&
      !rawStops.toLowerCase().includes('nonstop'));

  const selfTransfer = Boolean(
    fl.selfTransfer ||
      fl.tags?.some((t) => /self[- ]?transfer/i.test(t)) ||
      /self[- ]?transfer/i.test(rawStops)
  );

  let layoverAirport = '';
  let layoverDuration = '';

  if (hasLayover) {
    const rawStopAirport = (fl.stopAirport || '').trim();
    if (rawStopAirport.includes('·')) {
      const [hubPart, durPart] = rawStopAirport.split('·').map((s) => s.trim());
      layoverAirport = hubPart;
      layoverDuration = durPart.replace(/layover/i, '').trim() || '1h 15m';
    } else if (rawStopAirport) {
      layoverAirport = rawStopAirport;
      layoverDuration = durationMins > 300 ? '1h 30m' : '1h 15m';
    } else {
      const codeMatch = rawStops.match(/\(([^)]+)\)/);
      layoverAirport = codeMatch ? `${codeMatch[1].trim()}` : 'Connecting Hub';
      layoverDuration = durationMins > 300 ? '1h 30m' : '1h 15m';
    }
  }

  const layoverMins = hasLayover ? parseDurationTextToMins(layoverDuration, 75) : 0;
  const flyingMins = hasLayover ? Math.max(60, durationMins - layoverMins) : durationMins;
  const leg1Mins = hasLayover ? Math.max(30, Math.round((flyingMins * 0.52) / 5) * 5) : durationMins;
  const leg2Mins = hasLayover ? Math.max(30, flyingMins - leg1Mins) : 0;

  const parsedDepMins = parseClockTimeToMins(depTime);
  const layoverArrTime =
    hasLayover && parsedDepMins !== null ? formatMinsToClockTime(parsedDepMins + leg1Mins) : '';
  const layoverDepTime =
    hasLayover && parsedDepMins !== null
      ? formatMinsToClockTime(parsedDepMins + leg1Mins + layoverMins)
      : '';

  const fromCode = extractAirportCode(params.fromCity, 'DEL');
  const toCode = extractAirportCode(params.toCity, 'BOM');

  const airlineLower = airline.toLowerCase();
  const isFullServiceDefault =
    airlineLower.includes('air india') ||
    airlineLower.includes('vistara') ||
    airlineLower.includes('british') ||
    airlineLower.includes('virgin') ||
    airlineLower.includes('emirates') ||
    airlineLower.includes('lufthansa') ||
    airlineLower.includes('delta') ||
    airlineLower.includes('qatar') ||
    airlineLower.includes('singapore');

  const amenities: FlightAmenitiesState = {
    meal: fl.amenities?.meal !== undefined ? Boolean(fl.amenities.meal) : isFullServiceDefault,
    wifi: fl.amenities?.wifi !== undefined ? Boolean(fl.amenities.wifi) : isFullServiceDefault && durationMins > 180,
    entertainment:
      fl.amenities?.entertainment !== undefined
        ? Boolean(fl.amenities.entertainment)
        : isFullServiceDefault,
    power:
      fl.amenities?.power !== undefined
        ? Boolean(fl.amenities.power)
        : isFullServiceDefault || airlineLower.includes('indigo') || airlineLower.includes('akasa'),
    seatPitch: (fl.amenities?.seatPitch || (isFullServiceDefault ? '31 in' : '30 in')).trim(),
    seatLayout: getAircraftSeatLayout(aircraft),
  };

  return {
    airline,
    operatedBy,
    flightNo,
    aircraft,
    badgeCode,
    badgeBg,
    depTime,
    arrTime,
    duration,
    durationMins,
    stopsLabel: hasLayover
      ? layoverAirport && rawStops.includes(`(${layoverAirport})`)
        ? rawStops.replace(`(${layoverAirport})`, `· ${layoverAirport}`).replace(/\s+·\s+/, ' · ')
        : rawStops || '1 stop'
      : rawStops || 'Direct',
    hasLayover,
    layoverAirport,
    layoverDuration,
    layoverArrTime,
    layoverDepTime,
    leg1Duration: formatMinutesToDuration(leg1Mins),
    leg2Duration: hasLayover ? formatMinutesToDuration(leg2Mins) : '',
    fromAirportLabel: params.fromCity,
    toAirportLabel: params.toCity,
    fromCode,
    toCode,
    depTerminalLine: formatTerminalOnly(fl.depTerminal, 'Terminal 1'),
    arrTerminalLine: formatTerminalOnly(fl.arrTerminal, 'Terminal 2'),
    daysLater: fl.daysLater,
    selfTransfer,
    amenities,
  };
}

