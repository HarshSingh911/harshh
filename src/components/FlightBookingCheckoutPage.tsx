import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronRight,
  Home,
  Luggage,
  Plane,
  Star,
  Clock,
  Users,
  X,
  ArrowRight,
  Utensils,
  Wifi,
  Tv,
  Check,
  ChevronDown,
  Usb,
  Globe,
} from 'lucide-react';
import { BookedTrip, CurrencyCode, formatPrice } from '../data/travelData';
import { CheckoutItem } from './CheckoutPaymentPage';
import { FlightProviderWordmark } from './FlightProviderWordmark';
import {
  AirlineLogoMark,
  CabinBagIcon,
  CheckInBagIcon,
  FreeCancelIcon,
  InstantConfirmIcon,
  PersonalBagIcon,
  PriorityDeskIcon,
  SeatLayoutIcon,
  SelfTransferIcon,
  UpiPayIcon,
} from './FlightCheckoutIcons';
import {
  buildFlightPartnerBookingUrl,
  buildFlightProviderDeals,
  filterFlightProviderDeals,
  FlightAmenitiesState,
  FlightProviderDeal,
  getBaggageSummaryText,
  ParsedFlightJourneyDetails,
  parseFlightJourneyDetails,
} from '../utils/flightCompareUtils';

interface FlightBookingCheckoutPageProps {
  item: CheckoutItem;
  currency: CurrencyCode;
  onConfirmPayment: (booking: BookedTrip, leadName: string) => void;
  onBackToResults: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onGoToTrips?: () => void;
  onGoHome?: () => void;
  onGoFlights?: () => void;
  onOpenSupportFaq?: (faqId: string) => void;
}

const formatCityHeaderDisplay = (val: string) => {
  const match = val.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
  if (match) {
    return { city: match[1].trim(), code: match[2] };
  }
  return { city: val, code: '' };
};

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const [y, m, d] = parts;
      const dateObj = new Date(Date.UTC(y, m - 1, d));
      return dateObj.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

const InflightAmenitiesStrip: React.FC<{
  amenities: FlightAmenitiesState;
  aircraft: string;
  testIdPrefix: string;
  legKey: string;
}> = ({ amenities, aircraft, testIdPrefix, legKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  const availableItems: Array<{ key: string; label: string; icon: React.ReactNode }> = [];

  if (amenities.meal) {
    availableItems.push({
      key: 'meal',
      label: 'Meal',
      icon: <Utensils className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />,
    });
  }
  if (amenities.wifi) {
    availableItems.push({
      key: 'wifi',
      label: 'Wi-Fi',
      icon: <Wifi className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />,
    });
  }
  if (amenities.entertainment) {
    availableItems.push({
      key: 'entertainment',
      label: 'Entertainment',
      icon: <Tv className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />,
    });
  }

  return (
    <div className="pt-1 space-y-2" data-testid={`${testIdPrefix}-amenities-${legKey}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        data-testid={`${testIdPrefix}-amenities-toggle-${legKey}`}
        className="inline-flex flex-wrap items-center gap-3 rounded-lg px-2 py-1 -ml-2 hover:bg-slate-100/90 transition-colors cursor-pointer text-left"
      >
        {availableItems.length > 0 ? (
          availableItems.map((entry) => (
            <span
              key={entry.key}
              title={entry.label}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600"
            >
              {entry.icon}
              <span>{entry.label}</span>
            </span>
          ))
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <Utensils className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
            <span>Meals &amp; cabin info</span>
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          data-testid={`${testIdPrefix}-amenities-details-${legKey}`}
          className="rounded-xl border border-slate-200/90 bg-slate-50/85 px-3 py-2.5 space-y-1.5 text-[11px] text-slate-700"
        >
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
            <span className="font-medium text-slate-800">{aircraft}</span>
          </div>
          <div className="flex items-center gap-2">
            <SeatLayoutIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span>
              {amenities.seatLayout}
              {amenities.seatPitch ? ` · ${amenities.seatPitch} seat pitch` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Usb className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
            <span>{amenities.power ? 'In-seat USB outlet available' : 'No in-seat USB outlet'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
            <span>
              {amenities.wifi ? 'Onboard Wi-Fi web browsing available' : 'No onboard web browsing'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const JourneyDetailsSection: React.FC<{
  heading: string;
  dateStr: string;
  details: ParsedFlightJourneyDetails;
  testIdPrefix: string;
  hideHeader?: boolean;
}> = ({ heading, dateStr, details, testIdPrefix, hideHeader = false }) => {
  return (
    <div className="space-y-3" data-testid={testIdPrefix}>
      {!hideHeader && (
        <div className="flex items-baseline justify-between gap-3 px-0.5">
          <h3 className="font-sans text-sm sm:text-base font-semibold text-slate-800">
            {heading}
          </h3>
          <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
            {formatDisplayDate(dateStr)}
          </span>
        </div>
      )}

      {/* Large White Card Below */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        {/* 1. Airline Name + Operated By (if operated by another company) */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-semibold text-base text-slate-900" data-testid={`${testIdPrefix}-airline`}>
            {details.airline}
          </span>
          {details.operatedBy && (
            <span
              className="text-xs font-medium text-slate-500"
              data-testid={`${testIdPrefix}-operated-by`}
            >
              · Operated by {details.operatedBy}
            </span>
          )}
        </div>

        {/* 2. Airline Logo on Left + Horizontal Time-Wise Strip Beside It (Softer Font Weights) */}
        <div className="flex items-center gap-3.5" data-testid={`${testIdPrefix}-header-strip`}>
          <AirlineLogoMark
            badgeCode={details.badgeCode}
            badgeBg={details.badgeBg}
            airlineName={details.airline}
            size="lg"
          />

          <div className="flex-1 min-w-0 flex items-center justify-between gap-2.5">
            {/* Departure */}
            <div className="shrink-0">
              <div className="font-price text-base sm:text-lg font-medium text-slate-900 leading-none tabular-nums">
                {details.depTime}
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-1">{details.fromCode}</div>
            </div>

            {/* Horizontal Strip with Transparent/Hollow Dots & Minimal Distance */}
            <div className="flex-1 flex flex-col items-center min-w-[76px]">
              <span className="text-[11px] font-medium text-slate-500 leading-none">
                {details.duration}
              </span>
              <div className="w-full flex items-center gap-0.5 my-1.5">
                <span className="w-2 h-2 rounded-full border-2 border-slate-400 bg-white shrink-0" />
                <div className="flex-1 h-[1.5px] bg-slate-300 relative flex items-center justify-center">
                  {details.hasLayover && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs shrink-0" />
                  )}
                </div>
                <span className="w-2 h-2 rounded-full border-2 border-slate-400 bg-white shrink-0" />
              </div>
              <span
                className={`text-[11px] font-medium leading-none text-center truncate max-w-full ${
                  details.hasLayover ? 'text-amber-700' : 'text-emerald-600'
                }`}
              >
                {details.stopsLabel}
              </span>
            </div>

            {/* Arrival */}
            <div className="text-right shrink-0">
              <div className="font-price text-base sm:text-lg font-medium text-slate-900 leading-none tabular-nums inline-flex items-baseline justify-end">
                <span>{details.arrTime}</span>
                {details.daysLater && (
                  <sup className="text-[10px] text-red-600 font-semibold ml-0.5">
                    +{details.daysLater}
                  </sup>
                )}
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-1">{details.toCode}</div>
            </div>
          </div>
        </div>

        {/* 3. Small Airline Logo + Airline & Flight Number Right Below Horizontal Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <AirlineLogoMark
            badgeCode={details.badgeCode}
            badgeBg={details.badgeBg}
            airlineName={details.airline}
            size="sm"
          />
          <span className="text-xs sm:text-sm font-medium text-slate-800" data-testid={`${testIdPrefix}-flight-name`}>
            {details.airline} {details.flightNo}
          </span>
        </div>

        {/* 4. Vertical Downward Time-Wise Strip */}
        <div className="pt-1" data-testid={`${testIdPrefix}-vertical-timeline`}>
          {!details.hasLayover ? (
            <div className="grid grid-cols-[12px_1fr] gap-x-3">
              {/* Origin Point + Connecting Line */}
              <div className="flex flex-col items-center pt-[5px]">
                <span className="w-2 h-2 rounded-full border-2 border-slate-400 bg-white shrink-0" />
                <div className="w-[1.5px] flex-1 bg-slate-300 my-0.5 min-h-[56px]" />
              </div>
              <div className="pb-4 space-y-2.5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-price text-sm font-medium text-slate-900 tabular-nums">
                    {details.depTime}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {details.fromAirportLabel}
                  </span>
                </div>

                <div className="space-y-1.5 py-0.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{details.duration} flight</span>
                  </div>
                  <InflightAmenitiesStrip
                    amenities={details.amenities}
                    aircraft={details.aircraft}
                    testIdPrefix={testIdPrefix}
                    legKey="leg1"
                  />
                </div>
              </div>

              {/* Destination Point */}
              <div className="flex flex-col items-center pt-[5px]">
                <span className="w-2 h-2 rounded-full border-2 border-slate-400 bg-white shrink-0" />
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-price text-sm font-medium text-slate-900 tabular-nums inline-flex items-baseline">
                  <span>{details.arrTime}</span>
                  {details.daysLater && (
                    <sup className="text-[10px] text-red-600 font-semibold ml-0.5">
                      +{details.daysLater}
                    </sup>
                  )}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {details.toAirportLabel}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[14px_1fr] gap-x-3">
              {/* Origin Point + Leg 1 Connecting Line */}
              <div className="flex flex-col items-center pt-[5px]">
                <span className="w-2 h-2 rounded-full border-2 border-slate-400 bg-white shrink-0" />
                <div className="w-[1.5px] flex-1 bg-slate-300 my-0.5 min-h-[52px]" />
              </div>
              <div className="pb-4 space-y-2.5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-price text-sm font-medium text-slate-900 tabular-nums">
                    {details.depTime}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {details.fromAirportLabel}
                  </span>
                </div>

                <div className="space-y-1.5 py-0.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{details.leg1Duration} flight</span>
                  </div>
                  <InflightAmenitiesStrip
                    amenities={details.amenities}
                    aircraft={details.aircraft}
                    testIdPrefix={testIdPrefix}
                    legKey="leg1"
                  />
                </div>
              </div>

              {/* Layover Arrival Node */}
              <div className="flex flex-col items-center pt-[5px]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div className="w-0 flex-1 border-l-2 border-dashed border-amber-400 mt-0.5" />
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  {details.layoverArrTime && (
                    <span className="font-price text-sm font-medium text-slate-900 tabular-nums">
                      {details.layoverArrTime}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-800">
                    {details.layoverAirport}
                  </span>
                </div>
              </div>

              {/* Layover Box Right in the Middle of the Vertical Strip */}
              <div className="flex justify-center">
                <div className="w-0 border-l-2 border-dashed border-amber-400 h-full min-h-[44px]" />
              </div>
              <div className="py-1.5">
                <div
                  data-testid={`${testIdPrefix}-layover-box`}
                  className="rounded-xl border border-amber-200/90 bg-amber-50/75 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs"
                >
                  <span className="inline-flex items-center gap-1.5 font-semibold text-amber-900">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{details.layoverDuration} layover</span>
                  </span>
                  <span className="text-[11px] font-medium text-amber-800 text-right">
                    {details.layoverAirport}
                  </span>
                </div>
              </div>

              {/* Layover Departure Node + Leg 2 Connecting Line */}
              <div className="flex flex-col items-center">
                <div className="w-0 h-1.5 border-l-2 border-dashed border-amber-400 mb-0.5" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div className="w-[1.5px] flex-1 bg-slate-300 my-0.5 min-h-[52px]" />
              </div>
              <div className="pt-1 pb-4 space-y-2.5">
                <div className="flex flex-wrap items-baseline gap-2">
                  {details.layoverDepTime && (
                    <span className="font-price text-sm font-medium text-slate-900 tabular-nums">
                      {details.layoverDepTime}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-800">
                    {details.layoverAirport}
                  </span>
                </div>

                <div className="space-y-1.5 py-0.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{details.leg2Duration} flight</span>
                  </div>
                  <InflightAmenitiesStrip
                    amenities={details.amenities}
                    aircraft={details.aircraft}
                    testIdPrefix={testIdPrefix}
                    legKey="leg2"
                  />
                </div>
              </div>

              {/* Final Destination Point */}
              <div className="flex flex-col items-center pt-[5px]">
                <span className="w-2 h-2 rounded-full border-2 border-slate-400 bg-white shrink-0" />
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-price text-sm font-medium text-slate-900 tabular-nums inline-flex items-baseline">
                  <span>{details.arrTime}</span>
                  {details.daysLater && (
                    <sup className="text-[10px] text-red-600 font-semibold ml-0.5">
                      +{details.daysLater}
                    </sup>
                  )}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {details.toAirportLabel}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Compact Journey Duration Footer Note */}
        <div
          data-testid={`${testIdPrefix}-duration-footer`}
          className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500"
        >
          <span>
            {details.hasLayover
              ? `Total journey: ${details.duration} (incl. ${details.layoverDuration} layover)`
              : `Total journey: ${details.duration} · Non-stop`}
          </span>
          <span className="shrink-0">
            {details.daysLater ? `Arrives +${details.daysLater} day later` : 'Same-day arrival'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const FlightBookingCheckoutPage: React.FC<FlightBookingCheckoutPageProps> = ({
  item,
  currency,
  onConfirmPayment,
  onBackToResults,
  onNotify,
  onGoToTrips,
  onGoHome,
  onGoFlights,
  onOpenSupportFaq,
}) => {
  const outbound = item.outboundFlight;
  const returnFlight = item.returnFlight;
  const isRoundTrip = Boolean(item.isRoundTrip && returnFlight);

  const outboundAirline =
    outbound?.airline ||
    item.airline ||
    (item.title?.includes('IndiGo')
      ? 'IndiGo'
      : item.title?.includes('Akasa')
      ? 'Akasa Air'
      : item.title?.includes('Air India')
      ? 'Air India'
      : item.title?.includes('Vistara')
      ? 'Vistara'
      : 'Commercial Airline');
  const outboundFlightNo = outbound?.flightNo || item.flightNo || item.code || '6E-2134';
  const fromCityRaw = item.fromCity || 'New Delhi (DEL)';
  const toCityRaw = item.toCity || 'Mumbai (BOM)';
  const fromParts = formatCityHeaderDisplay(fromCityRaw);
  const toParts = formatCityHeaderDisplay(toCityRaw);

  const outboundDepTime = outbound?.depTime || item.depTime?.split(' ')[0] || '09:20';
  const outboundArrTime = outbound?.arrTime || item.arrTime?.split(' ')[0] || '11:40';
  const outboundDuration = outbound?.duration || item.duration || '2h 20m';
  const outboundBaggageText = outbound?.baggage || '7 kg Cabin + 15 kg Check-in';

  const travelDate = item.travelDate || '2026-10-15';
  const returnDate = item.returnDate || '2026-10-19';
  const travellers = Math.max(1, item.travellers || 1);
  const cabinClass = item.cabinClass || 'Economy';

  const outboundJourneyDetails = useMemo(
    () =>
      parseFlightJourneyDetails({
        flight: outbound,
        fallbackAirline: outboundAirline,
        fallbackFlightNo: outboundFlightNo,
        fallbackDepTime: outboundDepTime,
        fallbackArrTime: outboundArrTime,
        fallbackDuration: outboundDuration,
        fromCity: fromCityRaw,
        toCity: toCityRaw,
      }),
    [
      outbound,
      outboundAirline,
      outboundFlightNo,
      outboundDepTime,
      outboundArrTime,
      outboundDuration,
      fromCityRaw,
      toCityRaw,
    ]
  );

  const returnJourneyDetails = useMemo(
    () =>
      isRoundTrip && returnFlight
        ? parseFlightJourneyDetails({
            flight: returnFlight,
            fallbackAirline: returnFlight.airline || outboundAirline,
            fallbackFlightNo: returnFlight.flightNo || '6E-2135',
            fromCity: toCityRaw,
            toCity: fromCityRaw,
          })
        : null,
    [isRoundTrip, returnFlight, outboundAirline, toCityRaw, fromCityRaw]
  );

  const isSelfTransferFlight = Boolean(
    outbound?.selfTransfer ||
      returnFlight?.selfTransfer ||
      outboundJourneyDetails.selfTransfer ||
      returnJourneyDetails?.selfTransfer
  );

  // Two baggage filter tabs: Cabin Bag and Check-in Bag
  const [requireCabinBag, setRequireCabinBag] = useState<boolean>(false);
  const [requireCheckInBag, setRequireCheckInBag] = useState<boolean>(false);

  // Expandable "Keep in mind" self-transfer explanation box
  const [isSelfTransferInfoOpen, setIsSelfTransferInfoOpen] = useState<boolean>(false);

  // Expanded baggage breakdown popover/box per booking partner card
  const [expandedBaggageCardId, setExpandedBaggageCardId] = useState<string | null>(null);

  // Redirection modal state for internal TripYeah Official booking
  const [redirectingProvider, setRedirectingProvider] = useState<FlightProviderDeal | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingPnr, setConfirmedBookingPnr] = useState<string>('');

  // Per-traveller base price
  const basePassengerPrice = useMemo(() => {
    if (outbound?.priceInr) {
      return outbound.priceInr + (isRoundTrip && returnFlight?.priceInr ? returnFlight.priceInr : 0);
    }
    return Math.max(890, Math.round((item.priceInr || 3850) / travellers));
  }, [outbound, returnFlight, isRoundTrip, item.priceInr, travellers]);

  // Available Booking Partners List for this flight
  const allProviderDeals: FlightProviderDeal[] = useMemo(
    () =>
      buildFlightProviderDeals({
        airline: outboundAirline,
        baggageText: outboundBaggageText,
      }),
    [outboundAirline, outboundBaggageText]
  );

  // Filtered Booking Partners based on Cabin bag / Check-in bag toggle selection
  const visibleProviderDeals: FlightProviderDeal[] = useMemo(
    () =>
      filterFlightProviderDeals(allProviderDeals, {
        requireCabinBag,
        requireCheckInBag,
      }),
    [allProviderDeals, requireCabinBag, requireCheckInBag]
  );

  // Handle TripYeah Direct "Book Now" Click
  const handleBookOnTripYeah = (provider: FlightProviderDeal) => {
    const finalFarePerPerson = Math.max(500, basePassengerPrice + provider.priceDelta);
    const totalFare = finalFarePerPerson * travellers;
    const generatedPnr = `TY-${outboundAirline.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const bagText = getBaggageSummaryText(provider.hasCabinBag, provider.hasCheckInBag) || 'Small personal bag';

    setConfirmedBookingPnr(generatedPnr);
    setRedirectingProvider(provider);
    setBookingConfirmed(false);

    const newBooking: BookedTrip = {
      bookingId: `BK-${Date.now()}`,
      bookingReference: generatedPnr,
      category: 'flights',
      title: `${outboundAirline} ${outboundFlightNo}`,
      routeSummary: `${fromParts.city} → ${toParts.city}`,
      dateSummary: `${formatDisplayDate(travelDate)} · ${bagText}`,
      travellers,
      cabinOrRoom: `${cabinClass} Class · ${provider.name}`,
      totalPaidInr: totalFare,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: 'Just now',
      departureDate: travelDate,
      pnr: generatedPnr,
      carrierOrHotel: `${outboundAirline} via ${provider.name}`,
      flightDepTime: outboundDepTime,
      flightArrTime: outboundArrTime,
      flightDuration: outboundDuration,
      flightCode: outboundFlightNo,
      isDemo: false,
    };

    onConfirmPayment(newBooking, 'Verified Traveler');

    setTimeout(() => {
      setBookingConfirmed(true);
      onNotify?.(
        'Flight Booking Confirmed',
        `Official airline PNR ${generatedPnr} generated for ${provider.name}. View in My Trips anytime.`,
        'success'
      );
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-20 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ===================================================================
          1. SEAMLESS OCEAN-NAVY SECOND HEADER — HOTEL-STYLE BREADCRUMB ROW
             + TRAVELLERS & CABIN CLASS SUMMARY ON RIGHT
      =================================================================== */}
      <section className="bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] pt-[70px] pb-3.5 relative shadow-sm border-b border-white/10">
        <div className="w-full px-3 sm:px-5 lg:px-6 flex items-center justify-between flex-wrap gap-2.5">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1 sm:gap-1.5 text-xs sm:text-[13px] font-medium"
          >
            <button
              type="button"
              onClick={() => (onGoHome ? onGoHome() : onBackToResults())}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              <Home className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>Home</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={() => (onGoFlights ? onGoFlights() : onBackToResults())}
              className="px-2.5 py-1 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              Flights
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={onBackToResults}
              className="px-2.5 py-1 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              {toParts.city}
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />

            <span
              aria-current="page"
              className="px-2.5 py-1 rounded-lg text-white font-semibold bg-white/10 border border-white/15 truncate max-w-[220px] sm:max-w-md lg:max-w-xl"
              title={`${outboundAirline} · ${outboundFlightNo}`}
            >
              {outboundAirline} · {outboundFlightNo}
            </span>
          </nav>

          {/* Travellers & Cabin Class cleanly placed at top right */}
          <div
            data-testid="flight-travellers-class-bar"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-sky-100 shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span>
              {travellers} Traveller{travellers > 1 ? 's' : ''}
            </span>
            <span className="text-white/35">·</span>
            <span>{cabinClass}</span>
            <span className="text-white/35">·</span>
            <span>{isRoundTrip ? 'Return' : 'One Way'}</span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. MAIN CONTENT:
             TOP: Available booking partners + Redesigned Route badge + 2 Baggage options (Left)
                  Route details + Outbound journey (Right)
             BELOW: Big Booking Partner Boxes (Left) + Outbound Journey Card (Right)
      =================================================================== */}
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-6 items-start">
          {/* LEFT COLUMN: Optional "Keep in mind" -> Available booking partners + Route Badge -> Baggage Filter Tabs -> Partner Boxes */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3.5">
            {isSelfTransferFlight && (
              <div className="space-y-2.5 pb-1.5" data-testid="keep-in-mind-section">
                <h2
                  data-testid="keep-in-mind-heading"
                  className="font-sans text-lg sm:text-xl font-semibold text-slate-900 leading-tight"
                >
                  Keep in mind
                </h2>

                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isSelfTransferInfoOpen}
                    onClick={() => setIsSelfTransferInfoOpen((prev) => !prev)}
                    data-testid="keep-in-mind-self-transfer-btn"
                    className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2.5 min-w-0">
                      <SelfTransferIcon className="w-4 h-4 text-slate-700 shrink-0" />
                      <span className="text-xs sm:text-sm font-normal text-slate-700">
                        Baggage re-check (<span className="font-semibold text-slate-900">self transfer</span>) required on all options
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isSelfTransferInfoOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isSelfTransferInfoOpen && (
                    <div
                      data-testid="keep-in-mind-self-transfer-details"
                      className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 bg-slate-50/60 space-y-3 text-xs sm:text-[13px] text-slate-700"
                    >
                      <p className="leading-relaxed text-slate-700">
                        <span className="font-semibold text-slate-900">What is a self-transfer?</span>{' '}
                        Your itinerary combines separate tickets or airlines without an automatic baggage connection, so you manage the transfer yourself during the layover.
                      </p>

                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 rounded-xl bg-white border border-slate-200/80 px-3 py-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                          <span>
                            <strong className="font-semibold text-slate-900">Collect &amp; re-check your bags:</strong>{' '}
                            Pick up checked luggage from baggage claim at the stopover airport and check it in again for the next flight.
                          </span>
                        </li>
                        <li className="flex items-start gap-2 rounded-xl bg-white border border-slate-200/80 px-3 py-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                          <span>
                            <strong className="font-semibold text-slate-900">Re-clear check-in &amp; security:</strong>{' '}
                            Exit the transit zone if required, collect your next boarding pass, and pass through airport security again.
                          </span>
                        </li>
                        <li className="flex items-start gap-2 rounded-xl bg-white border border-slate-200/80 px-3 py-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                          <span>
                            <strong className="font-semibold text-slate-900">Allow extra layover time &amp; visas:</strong>{' '}
                            Separate tickets are not airline-protected against delays—keep enough buffer and valid transit/entry visas ready.
                          </span>
                        </li>
                      </ul>

                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => onOpenSupportFaq?.('t-3')}
                          data-testid="self-transfer-support-link"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 hover:text-slate-950 underline underline-offset-4 decoration-slate-400 hover:decoration-slate-800 transition-colors cursor-pointer"
                        >
                          <span>Want to know more about self-transfer? Read full details in Support Center</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-700" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <h2
                data-testid="available-partners-heading"
                className="font-sans text-lg sm:text-xl font-semibold text-slate-900 leading-tight"
              >
                Available booking partners
              </h2>

              <div
                data-testid="flight-route-badge"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs sm:text-sm text-slate-700"
              >
                <Plane className="w-3.5 h-3.5 text-[#072a4f] shrink-0" />
                <span className="font-semibold text-slate-900">{fromParts.city}</span>
                {fromParts.code && (
                  <span className="text-[11px] font-medium text-slate-500">({fromParts.code})</span>
                )}
                {isRoundTrip ? (
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className="font-semibold text-slate-900">{toParts.city}</span>
                {toParts.code && (
                  <span className="text-[11px] font-medium text-slate-500">({toParts.code})</span>
                )}
              </div>
            </div>

            {/* Horizontal Tab Selector: Cabin Bag & Check-in Bag (Monochrome line-art icons) */}
            <div
              className="flex flex-wrap items-center gap-2.5"
              role="tablist"
              aria-label="Filter booking sites by baggage"
            >
              <button
                type="button"
                role="tab"
                aria-selected={requireCabinBag}
                onClick={() => setRequireCabinBag((prev) => !prev)}
                data-testid="baggage-filter-cabin"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  requireCabinBag
                    ? 'bg-[#072a4f] border-[#072a4f] text-white shadow-xs'
                    : 'bg-white border-slate-300/90 hover:border-slate-400 text-slate-800 shadow-2xs'
                }`}
              >
                <CabinBagIcon className="w-4 h-4 shrink-0" />
                <span>Cabin Bag</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={requireCheckInBag}
                onClick={() => setRequireCheckInBag((prev) => !prev)}
                data-testid="baggage-filter-checkin"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  requireCheckInBag
                    ? 'bg-[#072a4f] border-[#072a4f] text-white shadow-xs'
                    : 'bg-white border-slate-300/90 hover:border-slate-400 text-slate-800 shadow-2xs'
                }`}
              >
                <CheckInBagIcon className="w-4 h-4 shrink-0" />
                <span>Checked Bag</span>
              </button>
            </div>

            {/* LEFT: BIG BOOKING PARTNER BOXES */}
            <div
              className="space-y-4"
              data-testid="flight-booking-partners-list"
            >
            {visibleProviderDeals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2 shadow-2xs">
                <Luggage className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">
                  No booking sites match the selected baggage filters
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRequireCabinBag(false);
                    setRequireCheckInBag(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Show all booking sites
                </button>
              </div>
            ) : (
              visibleProviderDeals.map((deal) => {
                const finalPricePerPerson = Math.max(500, basePassengerPrice + deal.priceDelta);
                const finalTotalPrice = finalPricePerPerson * travellers;
                const baggageSummary = getBaggageSummaryText(deal.hasCabinBag, deal.hasCheckInBag);
                const neitherIncluded = !deal.hasCabinBag && !deal.hasCheckInBag;
                const isBaggageBoxOpen = expandedBaggageCardId === deal.id;
                const partnerUrl = buildFlightPartnerBookingUrl({
                  providerId: deal.id,
                  airline: outboundAirline,
                  fromCity: fromCityRaw,
                  toCity: toCityRaw,
                  travelDate,
                  returnDate: isRoundTrip ? returnDate : undefined,
                  isRoundTrip,
                  travellers,
                  cabinClass,
                });

                return (
                  <div
                    key={deal.id}
                    data-testid={`flight-partner-card-${deal.id}`}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs hover:shadow-md transition-all ${
                      deal.isCheapest
                        ? 'border-emerald-500/80 ring-1 ring-emerald-500/15'
                        : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      {/* LEFT COLUMN INSIDE BIG SITE BOX */}
                      <div className="min-w-0 flex-1 space-y-2.5">
                        {/* 1. Site Name in Brand Wordmark Design */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <FlightProviderWordmark
                            providerId={deal.id}
                            airlineName={outboundAirline}
                            size="md"
                          />
                          {deal.isCheapest && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Best Price
                            </span>
                          )}
                        </div>

                        {/* 2. Star rating + Smaller numeric-only review count */}
                        <div className="flex items-baseline gap-1.5 text-slate-600">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0 self-center" />
                            <span className="tabular-nums">{deal.rating.toFixed(1)}</span>
                          </span>
                          <span className="text-slate-300 text-xs">·</span>
                          <span
                            data-testid={`partner-reviews-${deal.id}`}
                            className="text-[11px] font-normal text-slate-500 tabular-nums"
                          >
                            {deal.reviewsCount}
                          </span>
                        </div>

                        {/* 3. Feature Points: 24/7 priority desk + UPI/booking perks + Self-transfer (when applicable) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                            <PriorityDeskIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            <span>{deal.deskLabel}</span>
                          </div>

                          {deal.featurePoints.map((point) => (
                            <div
                              key={point.key}
                              data-testid={`partner-feature-${point.key}-${deal.id}`}
                              className="flex items-center gap-1.5 text-xs font-medium text-slate-700"
                            >
                              {point.key === 'upi' ? (
                                <UpiPayIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              ) : point.key === 'cancellation' ? (
                                <FreeCancelIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              ) : (
                                <InstantConfirmIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              )}
                              <span>{point.label}</span>
                            </div>
                          ))}

                          {isSelfTransferFlight && (
                            <div
                              data-testid={`partner-self-transfer-${deal.id}`}
                              className="flex items-center gap-1.5 text-xs font-medium text-slate-700"
                            >
                              <SelfTransferIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              <span>Self-transfer</span>
                            </div>
                          )}
                        </div>

                        {/* 4. Compact Baggage Icons Button (Icons only when collapsed; labels shown inside expanded box) */}
                        <div className="pt-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBaggageCardId((prev) => (prev === deal.id ? null : deal.id))
                            }
                            aria-expanded={isBaggageBoxOpen}
                            aria-label={
                              neitherIncluded
                                ? 'No cabin or checked bag included. View small personal bag details'
                                : baggageSummary
                            }
                            data-testid={`baggage-toggle-${deal.id}`}
                            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer text-left"
                          >
                            {/* Always display both monochrome baggage icons + monochrome check/cross signs */}
                            <span className="inline-flex items-center gap-2.5 shrink-0">
                              {/* Cabin bag icon + monochrome status sign */}
                              <span
                                className="inline-flex items-center gap-0.5 text-slate-700"
                                title={deal.hasCabinBag ? 'Cabin bag included' : 'Cabin bag not included'}
                              >
                                <CabinBagIcon className="w-4 h-4 text-slate-700" />
                                {deal.hasCabinBag ? (
                                  <Check className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" aria-hidden="true" />
                                ) : (
                                  <X className="w-3.5 h-3.5 text-slate-500 stroke-[2.5]" aria-hidden="true" />
                                )}
                              </span>

                              {/* Checked bag icon + monochrome status sign */}
                              <span
                                className="inline-flex items-center gap-0.5 text-slate-700"
                                title={deal.hasCheckInBag ? 'Checked bag included' : 'Checked bag not included'}
                              >
                                <CheckInBagIcon className="w-4 h-4 text-slate-700" />
                                {deal.hasCheckInBag ? (
                                  <Check className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" aria-hidden="true" />
                                ) : (
                                  <X className="w-3.5 h-3.5 text-slate-500 stroke-[2.5]" aria-hidden="true" />
                                )}
                              </span>
                            </span>

                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                                isBaggageBoxOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Expandable Box Below Baggage Icons */}
                          {isBaggageBoxOpen && (
                            <div
                              data-testid={`baggage-details-box-${deal.id}`}
                              className="mt-2.5 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50/90 p-3 space-y-2 text-xs shadow-xs"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                                  <PersonalBagIcon className="w-4 h-4 text-slate-700 shrink-0" />
                                  <span>Small personal bag</span>
                                </span>
                                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                                  <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                                  <span>Included</span>
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                                  <CabinBagIcon className="w-4 h-4 text-slate-700 shrink-0" />
                                  <span>Cabin bag</span>
                                </span>
                                {deal.hasCabinBag ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                                    <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                                    <span>Included</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                                    <X className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                                    <span>Not included</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                                  <CheckInBagIcon className="w-4 h-4 text-slate-700 shrink-0" />
                                  <span>Checked bag</span>
                                </span>
                                {deal.hasCheckInBag ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                                    <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                                    <span>Included</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                                    <X className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                                    <span>Not included</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT SIDE INSIDE BIG SITE BOX: PRICE & BOOK NOW CENTERED VERTICALLY */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <div className="text-left sm:text-right">
                          <div
                            data-testid={`flight-partner-price-${deal.id}`}
                            className="font-price text-lg sm:text-xl font-medium text-slate-900 tabular-nums"
                          >
                            {formatPrice(finalTotalPrice, currency)}
                          </div>
                        </div>

                        {deal.id === 'tripyeah-direct' ? (
                          <button
                            type="button"
                            onClick={() => handleBookOnTripYeah(deal)}
                            data-testid={`flight-book-now-${deal.id}`}
                            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] hover:from-[#072a4f] hover:via-[#093461] hover:to-[#0d437c] text-white shadow-md shadow-[#05203c]/20 hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center active:scale-95 whitespace-nowrap"
                          >
                            <span>Book Now</span>
                          </button>
                        ) : (
                          <a
                            href={partnerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`flight-book-now-${deal.id}`}
                            aria-label={`Book Now on ${deal.name}`}
                            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-b from-[#05203c] via-[#072a4f] to-[#0a3666] hover:from-[#072a4f] hover:via-[#093461] hover:to-[#0d437c] text-white shadow-md shadow-[#05203c]/20 hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center active:scale-95 whitespace-nowrap"
                          >
                            <span>Book Now</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          </div>

          {/* RIGHT COLUMN: Route details + Outbound journey header + Large Details Box(es) pinned to upper position */}
          <div className="lg:col-span-5 xl:col-span-4 lg:pt-[17px] flex flex-col gap-3">
            <div className="flex flex-col gap-5">
              <h2
                className="font-sans text-lg sm:text-xl font-semibold text-slate-900 leading-tight"
                data-testid="route-details-heading"
              >
                Route details
              </h2>

              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-sans text-sm sm:text-base font-semibold text-slate-800">
                  Outbound journey
                </h3>
                <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                  {formatDisplayDate(travelDate)}
                </span>
              </div>
            </div>

            <aside className="space-y-6">
              <JourneyDetailsSection
                heading="Outbound journey"
                dateStr={travelDate}
                details={outboundJourneyDetails}
                testIdPrefix="outbound-journey"
                hideHeader
              />

              {returnJourneyDetails && (
                <JourneyDetailsSection
                  heading="Return journey"
                  dateStr={returnDate}
                  details={returnJourneyDetails}
                  testIdPrefix="return-journey"
                />
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* ===================================================================
          3. TRIPYEAH OFFICIAL BOOKING CONFIRMATION MODAL
      =================================================================== */}
      {redirectingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-modal-backdrop">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-modal-slide-up space-y-5"
          >
            <button
              type="button"
              onClick={() => setRedirectingProvider(null)}
              aria-label="Close booking confirmation"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  TY
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <span className="w-8 h-[2px] bg-slate-300" />
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl ${redirectingProvider.logoBg} text-white font-extrabold flex items-center justify-center text-sm shadow-md`}
                >
                  {redirectingProvider.logoText}
                </div>
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">
                  {bookingConfirmed
                    ? `Confirmed with ${redirectingProvider.name}!`
                    : `Booking with ${redirectingProvider.name}...`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {bookingConfirmed
                    ? 'Your official airline itinerary has been verified and confirmed.'
                    : 'Securing the best guaranteed rate and passing flight specifications...'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <span className="font-bold text-slate-900">
                  {outboundAirline} {outboundFlightNo}
                </span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  PNR: {confirmedBookingPnr}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Route</span>
                  <span className="font-semibold text-slate-800">
                    {fromParts.city} → {toParts.city}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Flight Date</span>
                  <span className="font-semibold text-slate-800">{formatDisplayDate(travelDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Baggage Included</span>
                  <span className="font-semibold text-emerald-700">
                    {getBaggageSummaryText(redirectingProvider.hasCabinBag, redirectingProvider.hasCheckInBag) ||
                      'Small personal bag'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Passengers</span>
                  <span className="font-semibold text-slate-800">
                    {travellers} Passenger{travellers > 1 ? 's' : ''} ({cabinClass})
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Locked Fare:</span>
                <span className="text-base font-extrabold font-mono text-slate-900">
                  {formatPrice(Math.max(500, basePassengerPrice + redirectingProvider.priceDelta) * travellers, currency)}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setRedirectingProvider(null);
                  onGoToTrips?.();
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Booking in My Trips</span>
              </button>

              <button
                type="button"
                onClick={() => setRedirectingProvider(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Back to booking partners
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
