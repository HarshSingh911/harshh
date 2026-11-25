/// <reference types="google.maps" />
import React, { useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  useAdvancedMarkerRef,
  useApiIsLoaded,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Star } from 'lucide-react';
import { CurrencyCode } from '../data/travelData';
import {
  formatCompactMapPrice,
  formatPlacesPriceLevelLabel,
  normalizeHotelMatchKey,
} from '../utils/hotelResultsUtils';
import { resolveCountryRegionCode } from '../utils/hotelCompareUtils';

export interface SidebarMapHotelInput {
  id: string;
  name: string;
  location: string;
  locality: string;
  stars: number;
  rating: number;
  reviews: number;
  priceInr: number;
}

interface ResolvedSidebarHotelPin {
  pinId: string;
  kind: 'listed' | 'nearby';
  hotelId?: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  priceLabel: string;
  stars?: number;
  rating?: number;
  reviews?: number;
  googleMapsURI?: string;
}

const DEFAULT_MAP_CENTER = { lat: 15.2993, lng: 74.124 };

function readViteMapsKey(): string {
  try {
    const viteKey = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      ?.VITE_GOOGLE_MAPS_API_KEY;
    if (viteKey && viteKey.trim()) return viteKey.trim();
  } catch {
    // ignore
  }
  return '';
}

function isMapsQuotaError(err: unknown): boolean {
  const msg = String(
    err instanceof Error ? err.message : typeof err === 'object' && err !== null ? JSON.stringify(err) : err
  );
  return (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('QuotaExceeded') ||
    msg.includes('429')
  );
}

const SidebarBoundsController: React.FC<{
  pins: ResolvedSidebarHotelPin[];
  fallbackCenter: { lat: number; lng: number } | null;
}> = ({ pins, fallbackCenter }) => {
  const map = useMap();
  const coreLib = useMapsLibrary('core');

  useEffect(() => {
    if (!map) return;
    if (pins.length >= 2 && coreLib?.LatLngBounds) {
      const bounds = new coreLib.LatLngBounds();
      pins.forEach((pin) => bounds.extend({ lat: pin.lat, lng: pin.lng }));
      map.fitBounds(bounds, { top: 28, right: 24, bottom: 24, left: 24 });
      return;
    }
    if (pins.length === 1) {
      map.panTo({ lat: pins[0].lat, lng: pins[0].lng });
      map.setZoom(13);
      return;
    }
    if (fallbackCenter) {
      map.panTo(fallbackCenter);
      map.setZoom(12);
    }
  }, [map, coreLib, pins, fallbackCenter]);

  return null;
};

const SidebarPricePinMarker: React.FC<{
  pin: ResolvedSidebarHotelPin;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
  onFocusHotelCard?: (hotelId: string) => void;
  onOpenHotelDetails?: (hotelId: string) => void;
}> = ({ pin, isSelected, onSelect, onClose, onFocusHotelCard, onOpenHotelDetails }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const isListed = pin.kind === 'listed';

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: pin.lat, lng: pin.lng }}
        title={`${pin.name} · ${pin.priceLabel}`}
        onClick={onSelect}
        zIndex={isSelected ? 40 : isListed ? 25 : 12}
      >
        <button
          type="button"
          data-testid={`map-price-pin-${pin.pinId}`}
          aria-label={`${pin.name} ${pin.priceLabel}`}
          className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold tabular-nums whitespace-nowrap border shadow-md transition-transform cursor-pointer ${
            isSelected
              ? 'bg-blue-600 text-white border-white scale-110 ring-2 ring-blue-300'
              : isListed
              ? 'bg-[#05203c] text-white border-white/90 hover:bg-blue-700 hover:scale-105'
              : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50 hover:scale-105'
          }`}
        >
          {pin.priceLabel}
        </button>
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onClose} maxWidth={230}>
          <div className="p-0.5 space-y-1.5 text-slate-900 min-w-[170px]">
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-xs leading-snug line-clamp-2">{pin.name}</div>
              <span
                className={`text-[11px] font-black tabular-nums shrink-0 ${
                  isListed ? 'text-blue-700' : 'text-slate-700'
                }`}
              >
                {pin.priceLabel}
              </span>
            </div>

            {typeof pin.rating === 'number' && (
              <div className="flex items-center gap-1 text-[11px] text-slate-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                <span className="font-bold">{pin.rating.toFixed(1)}</span>
                {typeof pin.reviews === 'number' && (
                  <span className="text-slate-500">({pin.reviews.toLocaleString()})</span>
                )}
                {!isListed && (
                  <span className="text-[10px] text-slate-500 ml-0.5">· Nearby stay</span>
                )}
              </div>
            )}

            {pin.address && (
              <div className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                {pin.address}
              </div>
            )}

            {isListed && pin.hotelId ? (
              <div className="flex items-center gap-1.5 pt-0.5">
                {onFocusHotelCard && (
                  <button
                    type="button"
                    onClick={() => onFocusHotelCard(pin.hotelId!)}
                    className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold cursor-pointer"
                  >
                    Highlight card
                  </button>
                )}
                {onOpenHotelDetails && (
                  <button
                    type="button"
                    onClick={() => onOpenHotelDetails(pin.hotelId!)}
                    className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer"
                  >
                    View hotel
                  </button>
                )}
              </div>
            ) : pin.googleMapsURI ? (
              <a
                href={pin.googleMapsURI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 hover:underline pt-0.5"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ) : null}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const SidebarMapInner: React.FC<{
  city: string;
  country: string;
  regionCode: string;
  currency: CurrencyCode;
  hotels: SidebarMapHotelInput[];
  onSelectHotelCard?: (hotelId: string) => void;
  onOpenHotelDetails?: (hotelId: string) => void;
}> = ({ city, country, regionCode, currency, hotels, onSelectHotelCard, onOpenHotelDetails }) => {
  const isLoaded = useApiIsLoaded();
  const status = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');

  const [listedLocationsById, setListedLocationsById] = useState<
    Record<string, { lat: number; lng: number; address: string }>
  >({});
  const [nearbyPlaces, setNearbyPlaces] = useState<
    Array<{
      id: string;
      name: string;
      address: string;
      lat: number;
      lng: number;
      rating?: number;
      reviews?: number;
      priceLevel?: unknown;
      startPriceUnits?: number;
      googleMapsURI?: string;
    }>
  >([]);
  const [cityCenter, setCityCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isLoadingPins, setIsLoadingPins] = useState<boolean>(false);

  const hotelsSignature = useMemo(
    () => hotels.map((h) => `${h.id}:${h.name}:${h.location}`).join('|'),
    [hotels]
  );

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    const resolveMapHotels = async () => {
      setIsLoadingPins(true);
      try {
        const { Place, SearchNearbyRankPreference } = placesLib;
        const lowerRegion = regionCode.toLowerCase();

        // 1. Resolve destination center via Places API (New)
        let resolvedCenter: { lat: number; lng: number } | null = null;
        try {
          const { places: cityPlaces } = await Place.searchByText({
            textQuery: `${city}, ${country}`,
            fields: ['location', 'displayName'],
            language: 'en',
            region: lowerRegion,
            maxResultCount: 1,
          });
          const loc = cityPlaces?.[0]?.location;
          if (loc) {
            resolvedCenter = { lat: loc.lat(), lng: loc.lng() };
          }
        } catch (err) {
          if (isMapsQuotaError(err)) {
            window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
            return;
          }
        }

        if (cancelled) return;
        if (resolvedCenter) {
          setCityCenter(resolvedCenter);
        }

        // 2. Resolve coordinates for filtered listed hotels via Places API (New)
        const targetHotels = hotels.slice(0, 10);
        const resolvedListEntries = await Promise.all(
          targetHotels.map(async (h) => {
            const queries = [
              `${h.name}, ${h.location}`,
              `${h.name}, ${city}, ${country}`,
              `${h.locality}, ${city}, ${country}`,
            ];
            for (const textQuery of queries) {
              try {
                const { places } = await Place.searchByText({
                  textQuery,
                  fields: ['location', 'formattedAddress'],
                  ...(resolvedCenter ? { locationBias: resolvedCenter } : {}),
                  language: 'en',
                  region: lowerRegion,
                  maxResultCount: 1,
                });
                const place = places?.[0];
                if (place?.location) {
                  return {
                    id: h.id,
                    lat: place.location.lat(),
                    lng: place.location.lng(),
                    address: place.formattedAddress || h.location,
                  };
                }
              } catch (err) {
                if (isMapsQuotaError(err)) {
                  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
                  return null;
                }
              }
            }
            return null;
          })
        );

        if (cancelled) return;

        const nextLocationDict: Record<string, { lat: number; lng: number; address: string }> = {};
        for (const entry of resolvedListEntries) {
          if (entry) {
            nextLocationDict[entry.id] = {
              lat: entry.lat,
              lng: entry.lng,
              address: entry.address,
            };
          }
        }
        setListedLocationsById(nextLocationDict);

        // Anchor nearby hotel search at primary resolved hotel or city center
        const firstEntry = resolvedListEntries.find((e) => e !== null);
        const searchAnchor = firstEntry
          ? { lat: firstEntry.lat, lng: firstEntry.lng }
          : resolvedCenter;

        if (!searchAnchor) {
          setNearbyPlaces([]);
          return;
        }

        // 3. Fetch nearby hotels & lodging prices via Places API (New) searchNearby
        const nearbyFields = [
          'displayName',
          'location',
          'formattedAddress',
          'rating',
          'userRatingCount',
          'priceLevel',
          'priceRange',
          'googleMapsURI',
        ];

        let fetchedNearby: google.maps.places.Place[] = [];
        try {
          const { places } = await Place.searchNearby({
            fields: nearbyFields,
            locationRestriction: {
              center: searchAnchor,
              radius: 8000,
            },
            includedPrimaryTypes: ['hotel', 'resort_hotel'],
            maxResultCount: 10,
            rankPreference: SearchNearbyRankPreference.POPULARITY,
            language: 'en',
            region: lowerRegion,
          });
          fetchedNearby = places || [];
        } catch (err) {
          if (isMapsQuotaError(err)) {
            window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
            return;
          }
        }

        if (fetchedNearby.length === 0 && !cancelled) {
          try {
            const { places } = await Place.searchByText({
              textQuery: `hotels near ${city}, ${country}`,
              fields: nearbyFields,
              locationBias: searchAnchor,
              language: 'en',
              region: lowerRegion,
              maxResultCount: 8,
            });
            fetchedNearby = places || [];
          } catch (err) {
            if (isMapsQuotaError(err)) {
              window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
              return;
            }
          }
        }

        if (cancelled) return;

        const mappedNearby: Array<{
          id: string;
          name: string;
          address: string;
          lat: number;
          lng: number;
          rating?: number;
          reviews?: number;
          priceLevel?: unknown;
          startPriceUnits?: number;
          googleMapsURI?: string;
        }> = [];

        for (const p of fetchedNearby) {
          if (!p.location || !p.displayName) continue;
          const rawPriceRange = (
            p as unknown as {
              priceRange?: { startPrice?: { units?: number | string } | null } | null;
            }
          ).priceRange;
          const parsedUnits = Number(rawPriceRange?.startPrice?.units);
          mappedNearby.push({
            id: p.id || p.displayName,
            name: p.displayName,
            address: p.formattedAddress || '',
            lat: p.location.lat(),
            lng: p.location.lng(),
            rating: typeof p.rating === 'number' ? p.rating : undefined,
            reviews: typeof p.userRatingCount === 'number' ? p.userRatingCount : undefined,
            priceLevel: (p as unknown as { priceLevel?: unknown }).priceLevel,
            startPriceUnits: Number.isFinite(parsedUnits) && parsedUnits > 0 ? parsedUnits : undefined,
            googleMapsURI: typeof p.googleMapsURI === 'string' ? p.googleMapsURI : undefined,
          });
        }

        setNearbyPlaces(mappedNearby);
      } finally {
        if (!cancelled) {
          setIsLoadingPins(false);
        }
      }
    };

    void resolveMapHotels();
    return () => {
      cancelled = true;
    };
  }, [placesLib, city, country, regionCode, hotelsSignature]);

  const combinedPins = useMemo<ResolvedSidebarHotelPin[]>(() => {
    const out: ResolvedSidebarHotelPin[] = [];
    const listedKeys: Record<string, boolean> = {};
    const occupiedCoordCounts: Record<string, number> = {};

    const jitterIfOccupied = (lat: number, lng: number): { lat: number; lng: number } => {
      const bucket = `${lat.toFixed(3)},${lng.toFixed(3)}`;
      const count = occupiedCoordCounts[bucket] || 0;
      occupiedCoordCounts[bucket] = count + 1;
      if (count === 0) return { lat, lng };
      const angle = (count * 2.2);
      return {
        lat: lat + Math.sin(angle) * 0.0028 * count,
        lng: lng + Math.cos(angle) * 0.0028 * count,
      };
    };

    for (const h of hotels) {
      const coords = listedLocationsById[h.id];
      if (!coords) continue;
      const key = normalizeHotelMatchKey(h.name);
      if (key) listedKeys[key] = true;
      const pos = jitterIfOccupied(coords.lat, coords.lng);
      out.push({
        pinId: `listed-${h.id}`,
        kind: 'listed',
        hotelId: h.id,
        name: h.name,
        address: coords.address,
        lat: pos.lat,
        lng: pos.lng,
        priceLabel: formatCompactMapPrice(h.priceInr, currency),
        stars: h.stars,
        rating: h.rating,
        reviews: h.reviews,
      });
    }

    let nearbyAdded = 0;
    for (const np of nearbyPlaces) {
      if (nearbyAdded >= 7) break;
      const key = normalizeHotelMatchKey(np.name);
      if (key && listedKeys[key]) continue;
      if (key) listedKeys[key] = true;

      const rangePrice =
        typeof np.startPriceUnits === 'number'
          ? `${formatCompactMapPrice(np.startPriceUnits, currency)}+`
          : null;
      const tierPrice = rangePrice || formatPlacesPriceLevelLabel(np.priceLevel, currency);
      const pillLabel =
        tierPrice || (typeof np.rating === 'number' ? `★ ${np.rating.toFixed(1)}` : 'Stay');
      const pos = jitterIfOccupied(np.lat, np.lng);

      out.push({
        pinId: `nearby-${np.id}`,
        kind: 'nearby',
        name: np.name,
        address: np.address,
        lat: pos.lat,
        lng: pos.lng,
        priceLabel: pillLabel,
        rating: np.rating,
        reviews: np.reviews,
        googleMapsURI: np.googleMapsURI,
      });
      nearbyAdded += 1;
    }

    return out;
  }, [hotels, listedLocationsById, nearbyPlaces, currency]);

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-600 text-xs p-4 text-center">
        Unable to load Google Maps right now.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-500 text-xs">
        Loading hotel map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={cityCenter || DEFAULT_MAP_CENTER}
        defaultZoom={12}
        gestureHandling="cooperative"
        disableDefaultUI
        zoomControl
        fullscreenControl
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
      >
        <SidebarBoundsController pins={combinedPins} fallbackCenter={cityCenter} />
        {combinedPins.map((pin) => (
          <SidebarPricePinMarker
            key={pin.pinId}
            pin={pin}
            isSelected={selectedPinId === pin.pinId}
            onSelect={() => setSelectedPinId(pin.pinId)}
            onClose={() => setSelectedPinId(null)}
            onFocusHotelCard={onSelectHotelCard}
            onOpenHotelDetails={onOpenHotelDetails}
          />
        ))}
      </GoogleMap>

      {isLoadingPins && combinedPins.length === 0 && (
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-xs border border-slate-200">
          Locating hotels &amp; prices...
        </div>
      )}
    </div>
  );
};

export const HotelSidebarMapCard: React.FC<{
  city: string;
  country: string;
  currency: CurrencyCode;
  hotels: SidebarMapHotelInput[];
  onSelectHotelCard?: (hotelId: string) => void;
  onOpenHotelDetails?: (hotelId: string) => void;
}> = ({ city, country, currency, hotels, onSelectHotelCard, onOpenHotelDetails }) => {
  const [apiKey, setApiKey] = useState<string>(() => readViteMapsKey());
  const [keyChecked, setKeyChecked] = useState<boolean>(() => Boolean(readViteMapsKey()));

  useEffect(() => {
    if (apiKey) {
      setKeyChecked(true);
      return;
    }
    let active = true;
    fetch('/api/maps/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.apiKey) {
          setApiKey(String(data.apiKey).trim());
        }
        setKeyChecked(true);
      })
      .catch(() => {
        if (active) setKeyChecked(true);
      });
    return () => {
      active = false;
    };
  }, [apiKey]);

  const regionCode = useMemo(() => resolveCountryRegionCode(country), [country]);

  return (
    <div
      data-testid="hotel-sidebar-map"
      className="w-full h-[360px] lg:h-[430px] xl:h-[460px] rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50 shadow-xs flex flex-col"
    >
      <div className="shrink-0 px-3.5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-900 truncate">
            {city} Hotels Map
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold shrink-0">
          <span className="inline-flex items-center gap-1 text-[#05203c]">
            <span className="w-2 h-2 rounded-full bg-[#05203c]" />
            <span>Listed</span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-white border border-slate-400" />
            <span>Nearby</span>
          </span>
        </div>
      </div>

      <div className="relative w-full flex-1 min-h-0">
        <div className="absolute inset-0">
          {!keyChecked ? (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
              Loading map...
            </div>
          ) : !apiKey ? (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 p-4 text-center">
              Google Maps API key is not configured in this environment.
            </div>
          ) : (
            <APIProvider
              apiKey={apiKey}
              libraries={['places', 'marker', 'core']}
              language="en"
              region={regionCode}
            >
              <SidebarMapInner
                city={city}
                country={country}
                regionCode={regionCode}
                currency={currency}
                hotels={hotels}
                onSelectHotelCard={onSelectHotelCard}
                onOpenHotelDetails={onOpenHotelDetails}
              />
            </APIProvider>
          )}
        </div>
      </div>
    </div>
  );
};
