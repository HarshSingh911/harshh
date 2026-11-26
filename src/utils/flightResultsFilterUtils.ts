import { parseFlightBaggageAllowance } from './flightCompareUtils';

export type FlightFareToggleMode = 'all' | 'baggage-only' | 'full-fare';

export interface FlightBaggageClassification {
  hasCabinBag: boolean;
  hasCheckedBag: boolean;
  fareMode: 'baggage-only' | 'full-fare';
  badgeLabel: string;
}

export function classifyFlightBaggage(baggageStr?: string): FlightBaggageClassification {
  const parsed = parseFlightBaggageAllowance(baggageStr);
  const hasCabinBag = parsed.flightIncludesCabin;
  const hasCheckedBag = parsed.flightIncludesCheckIn;

  if (hasCheckedBag) {
    return {
      hasCabinBag,
      hasCheckedBag: true,
      fareMode: 'full-fare',
      badgeLabel: `${parsed.checkInWeightText} Checked included`,
    };
  }

  return {
    hasCabinBag,
    hasCheckedBag: false,
    fareMode: 'baggage-only',
    badgeLabel: hasCabinBag
      ? `${parsed.cabinWeightText} Cabin bag only`
      : 'Underseat carry-on only',
  };
}

export function matchesFareToggleMode(
  baggageStr: string | undefined,
  mode: FlightFareToggleMode
): boolean {
  if (mode === 'all') return true;
  const { hasCheckedBag } = classifyFlightBaggage(baggageStr);
  if (mode === 'full-fare') return hasCheckedBag;
  return !hasCheckedBag;
}

export function matchesSidebarBaggageFilters(
  baggageStr: string | undefined,
  selectedBaggage: string[]
): boolean {
  if (selectedBaggage.length === 0) return true;
  const { hasCabinBag, hasCheckedBag } = classifyFlightBaggage(baggageStr);
  if (selectedBaggage.includes('cabin') && !hasCabinBag) return false;
  if (selectedBaggage.includes('checked') && !hasCheckedBag) return false;
  return true;
}

export function countFlightsByFareMode(
  flights: ReadonlyArray<{ baggage?: string }>
): { all: number; baggageOnly: number; fullFare: number } {
  let baggageOnly = 0;
  let fullFare = 0;
  for (const flight of flights) {
    if (classifyFlightBaggage(flight.baggage).hasCheckedBag) {
      fullFare += 1;
    } else {
      baggageOnly += 1;
    }
  }
  return {
    all: flights.length,
    baggageOnly,
    fullFare,
  };
}
