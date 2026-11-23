/// <reference types="google.maps" />
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiIsLoaded,
  useApiLoadingStatus,
  APILoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CarTaxiFront,
  Compass,
  Footprints,
  Layers,
  MapPin,
  Plane,
  Star,
  TrainFront,
  X,
} from 'lucide-react';
import {
  calculateHaversineDistanceKm,
  deriveCabPickupSummary,
  filterDistinctNearbyPlaces,
  formatDistanceLabel,
  formatRouteDistanceMeters,
  formatRouteDurationMillis,
  resolveCountryRegionCode,
  TRANSIT_OVERLAY_OPTIONS,
  TransitOverlayMode,
} from '../utils/hotelCompareUtils';

export interface ResolvedPlacePin {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distanceLabel?: string;
  rating?: number;
  userRatingCount?: number;
  typeLabel?: string;
  category: 'hotel' | 'nearby_hotel' | 'attraction' | 'transit' | 'airport' | 'taxi';
}

export interface RouteMetricInfo {
  durationText: string;
  distanceText: string;
}

export interface HotelMapsState {
  apiKey: string;
  keyLoaded: boolean;
  hotelPin: ResolvedPlacePin | null;
  nearbyHotels: ResolvedPlacePin[];
  attractions: ResolvedPlacePin[];
  transit: ResolvedPlacePin[];
  airports: ResolvedPlacePin[];
  taxiStands: ResolvedPlacePin[];
  isSearching: boolean;
  selectedPinId: string | null;
  setSelectedPinId: (id: string | null) => void;
}

const DEFAULT_FALLBACK_CENTER = { lat: 20.5937, lng: 78.9629 };

const HotelMapsContext = createContext<HotelMapsState>({
  apiKey: '',
  keyLoaded: false,
  hotelPin: null,
  nearbyHotels: [],
  attractions: [],
  transit: [],
  airports: [],
  taxiStands: [],
  isSearching: false,
  selectedPinId: null,
  setSelectedPinId: () => {},
});

export function useHotelMapsState(): HotelMapsState {
  return useContext(HotelMapsContext);
}

function isQuotaError(err: unknown): boolean {
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

function readEnvMapsKey(): string {
  try {
    const viteKey = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      ?.VITE_GOOGLE_MAPS_API_KEY;
    if (viteKey && viteKey.trim()) return viteKey.trim();
  } catch {
    // ignore
  }
  return '';
}

const HotelPlacesLoader: React.FC<{
  hotelName: string;
  location: string;
  city: string;
  country: string;
  regionCode: string;
  onUpdate: (patch: Partial<HotelMapsState>) => void;
}> = ({ hotelName, location, city, country, regionCode, onUpdate }) => {
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    const loadHotelAndNearby = async () => {
      onUpdate({ isSearching: true });
      try {
        const { Place, SearchNearbyRankPreference } = placesLib;
        const lowerRegion = regionCode.toLowerCase();

        // 1. Resolve exact hotel location via Places API (New) Place.searchByText
        const queries = [
          `${hotelName}, ${location}`,
          `${hotelName}, ${city}, ${country}`,
          `${city}, ${country}`,
        ];

        let resolvedHotel: google.maps.places.Place | null = null;
        for (const textQuery of queries) {
          try {
            const { places } = await Place.searchByText({
              textQuery,
              fields: ['displayName', 'location', 'formattedAddress'],
              language: 'en',
              region: lowerRegion,
              maxResultCount: 1,
            });
            if (places && places.length > 0 && places[0].location) {
              resolvedHotel = places[0];
              break;
            }
          } catch (err) {
            if (isQuotaError(err)) {
              window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
              return;
            }
          }
        }

        if (cancelled || !resolvedHotel?.location) {
          return;
        }

        const hotelLat = resolvedHotel.location.lat();
        const hotelLng = resolvedHotel.location.lng();
        const center = { lat: hotelLat, lng: hotelLng };

        const hotelResolvedPin: ResolvedPlacePin = {
          id: resolvedHotel.id || 'hotel-primary',
          name: hotelName,
          address: resolvedHotel.formattedAddress || location,
          lat: hotelLat,
          lng: hotelLng,
          category: 'hotel',
        };

        onUpdate({
          hotelPin: hotelResolvedPin,
          selectedPinId: null,
        });

        const toPins = (
          placesList: google.maps.places.Place[],
          category: 'nearby_hotel' | 'attraction' | 'transit' | 'airport' | 'taxi',
          limit: number
        ): ResolvedPlacePin[] => {
          const mapped: ResolvedPlacePin[] = [];
          for (const p of placesList) {
            if (!p.location || !p.displayName) continue;
            const rawId = p.id || p.displayName;
            if (rawId === hotelResolvedPin.id) continue;
            const pLat = p.location.lat();
            const pLng = p.location.lng();
            const distKm = calculateHaversineDistanceKm(hotelLat, hotelLng, pLat, pLng);
            mapped.push({
              id: `${category}-${rawId}`,
              name: p.displayName,
              address: p.formattedAddress || '',
              lat: pLat,
              lng: pLng,
              distanceLabel: formatDistanceLabel(distKm),
              rating: typeof p.rating === 'number' ? p.rating : undefined,
              userRatingCount:
                typeof p.userRatingCount === 'number' ? p.userRatingCount : undefined,
              typeLabel:
                typeof p.primaryTypeDisplayName === 'string' && p.primaryTypeDisplayName.trim()
                  ? p.primaryTypeDisplayName.trim()
                  : undefined,
              category,
            });
          }

          return filterDistinctNearbyPlaces(
            mapped,
            `${category}-${hotelResolvedPin.id}`,
            category === 'nearby_hotel' ? hotelName : undefined,
            limit
          );
        };

        const fetchCategory = async (
          category: 'nearby_hotel' | 'attraction' | 'transit' | 'airport' | 'taxi',
          includedPrimaryTypes: string[],
          radiusMeters: number,
          fallbackTextQuery: string,
          limit: number,
          includeRichFields = false,
          rankByPopularity = false
        ): Promise<ResolvedPlacePin[]> => {
          const fields = includeRichFields
            ? [
                'displayName',
                'location',
                'formattedAddress',
                'rating',
                'userRatingCount',
                'primaryTypeDisplayName',
              ]
            : ['displayName', 'location', 'formattedAddress', 'primaryTypeDisplayName'];

          try {
            const { places } = await Place.searchNearby({
              fields,
              locationRestriction: {
                center,
                radius: radiusMeters,
              },
              includedPrimaryTypes,
              maxResultCount: Math.min(20, limit + 4),
              rankPreference: rankByPopularity
                ? SearchNearbyRankPreference.POPULARITY
                : SearchNearbyRankPreference.DISTANCE,
              language: 'en',
              region: lowerRegion,
            });
            const pins = toPins(places || [], category, limit);
            if (pins.length > 0) return pins;
          } catch (err) {
            if (isQuotaError(err)) {
              window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
              throw err;
            }
          }

          try {
            const { places } = await Place.searchByText({
              textQuery: fallbackTextQuery,
              fields,
              locationBias: center,
              language: 'en',
              region: lowerRegion,
              maxResultCount: Math.min(20, limit + 3),
            });
            return toPins(places || [], category, limit);
          } catch (err) {
            if (isQuotaError(err)) {
              window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
              throw err;
            }
            return [];
          }
        };

        const [nearbyHotelPins, attrPins, transitPins, airportPins, taxiPins] = await Promise.all([
          fetchCategory(
            'nearby_hotel',
            ['hotel', 'resort_hotel'],
            5000,
            `hotels near ${city}, ${country}`,
            8,
            true,
            true
          ),
          fetchCategory(
            'attraction',
            ['tourist_attraction', 'museum', 'park', 'historical_landmark'],
            15000,
            `top tourist attractions in ${city}`,
            3
          ),
          fetchCategory(
            'transit',
            ['transit_station', 'train_station', 'subway_station', 'bus_station'],
            15000,
            `railway or metro station in ${city}`,
            6
          ),
          fetchCategory(
            'airport',
            ['airport'],
            50000,
            `airport near ${city} ${country}`,
            2
          ),
          fetchCategory(
            'taxi',
            ['taxi_stand'],
            10000,
            `taxi stand cab pickup near ${city} ${country}`,
            5
          ),
        ]);

        if (!cancelled) {
          onUpdate({
            nearbyHotels: nearbyHotelPins,
            attractions: attrPins,
            transit: transitPins,
            airports: airportPins,
            taxiStands: taxiPins,
          });
        }
      } catch {
        // Handled cleanly via state
      } finally {
        if (!cancelled) {
          onUpdate({ isSearching: false });
        }
      }
    };

    void loadHotelAndNearby();
    return () => {
      cancelled = true;
    };
  }, [placesLib, hotelName, location, city, country, regionCode, onUpdate]);

  return null;
};

export const HotelMapsProvider: React.FC<{
  hotelName: string;
  location: string;
  city: string;
  country: string;
  children: React.ReactNode;
}> = ({ hotelName, location, city, country, children }) => {
  const [apiKey, setApiKey] = useState<string>(() => readEnvMapsKey());
  const [keyLoaded, setKeyLoaded] = useState<boolean>(() => Boolean(readEnvMapsKey()));
  const [hotelPin, setHotelPin] = useState<ResolvedPlacePin | null>(null);
  const [nearbyHotels, setNearbyHotels] = useState<ResolvedPlacePin[]>([]);
  const [attractions, setAttractions] = useState<ResolvedPlacePin[]>([]);
  const [transit, setTransit] = useState<ResolvedPlacePin[]>([]);
  const [airports, setAirports] = useState<ResolvedPlacePin[]>([]);
  const [taxiStands, setTaxiStands] = useState<ResolvedPlacePin[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  useEffect(() => {
    if (apiKey) {
      setKeyLoaded(true);
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
        setKeyLoaded(true);
      })
      .catch(() => {
        if (active) setKeyLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [apiKey]);

  const handleUpdate = useCallback((patch: Partial<HotelMapsState>) => {
    if ('hotelPin' in patch) setHotelPin(patch.hotelPin ?? null);
    if ('nearbyHotels' in patch && patch.nearbyHotels) setNearbyHotels(patch.nearbyHotels);
    if ('attractions' in patch && patch.attractions) setAttractions(patch.attractions);
    if ('transit' in patch && patch.transit) setTransit(patch.transit);
    if ('airports' in patch && patch.airports) setAirports(patch.airports);
    if ('taxiStands' in patch && patch.taxiStands) setTaxiStands(patch.taxiStands);
    if ('isSearching' in patch && typeof patch.isSearching === 'boolean') {
      setIsSearching(patch.isSearching);
    }
    if ('selectedPinId' in patch) setSelectedPinId(patch.selectedPinId ?? null);
  }, []);

  const regionCode = useMemo(() => resolveCountryRegionCode(country), [country]);

  const contextValue = useMemo<HotelMapsState>(
    () => ({
      apiKey,
      keyLoaded,
      hotelPin,
      nearbyHotels,
      attractions,
      transit,
      airports,
      taxiStands,
      isSearching,
      selectedPinId,
      setSelectedPinId,
    }),
    [
      apiKey,
      keyLoaded,
      hotelPin,
      nearbyHotels,
      attractions,
      transit,
      airports,
      taxiStands,
      isSearching,
      selectedPinId,
    ]
  );

  if (!apiKey) {
    return <HotelMapsContext.Provider value={contextValue}>{children}</HotelMapsContext.Provider>;
  }

  return (
    <HotelMapsContext.Provider value={contextValue}>
      <APIProvider
        apiKey={apiKey}
        libraries={['places', 'marker', 'routes', 'maps']}
        language="en"
        region={regionCode}
      >
        <HotelPlacesLoader
          hotelName={hotelName}
          location={location}
          city={city}
          country={country}
          regionCode={regionCode}
          onUpdate={handleUpdate}
        />
        {children}
      </APIProvider>
    </HotelMapsContext.Provider>
  );
};

const PinWithInfoWindow: React.FC<{
  pin: ResolvedPlacePin;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
  stars?: number;
}> = ({ pin, isSelected, onSelect, onClose, stars }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const pinColors = useMemo(() => {
    switch (pin.category) {
      case 'hotel':
        return { background: '#072a4f', borderColor: '#ffffff', glyphColor: '#ffffff' };
      case 'nearby_hotel':
        return { background: '#4f46e5', borderColor: '#ffffff', glyphColor: '#ffffff' };
      case 'airport':
        return { background: '#2563eb', borderColor: '#ffffff', glyphColor: '#ffffff' };
      case 'transit':
        return { background: '#0f766e', borderColor: '#ffffff', glyphColor: '#ffffff' };
      case 'taxi':
        return { background: '#eab308', borderColor: '#ffffff', glyphColor: '#0f172a' };
      case 'attraction':
      default:
        return { background: '#d97706', borderColor: '#ffffff', glyphColor: '#ffffff' };
    }
  }, [pin.category]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: pin.lat, lng: pin.lng }}
        title={pin.name}
        onClick={onSelect}
        zIndex={pin.category === 'hotel' ? 30 : isSelected ? 25 : 10}
      >
        <Pin
          background={pinColors.background}
          borderColor={pinColors.borderColor}
          glyphColor={pinColors.glyphColor}
          scale={pin.category === 'hotel' ? 1.25 : isSelected ? 1.15 : 0.95}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onClose} maxWidth={260}>
          <div className="p-0.5 space-y-1 text-slate-900">
            <div className="font-bold text-xs sm:text-sm leading-snug">{pin.name}</div>
            {pin.category === 'hotel' && stars ? (
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: stars }).map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-current" />
                ))}
              </div>
            ) : null}
            {pin.category === 'nearby_hotel' && typeof pin.rating === 'number' ? (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                <span>{pin.rating.toFixed(1)}</span>
                {pin.userRatingCount ? (
                  <span className="text-slate-500 font-normal">
                    ({pin.userRatingCount.toLocaleString()})
                  </span>
                ) : null}
                {pin.typeLabel ? <span className="text-slate-500">· {pin.typeLabel}</span> : null}
              </div>
            ) : null}
            {pin.address ? (
              <div className="text-[11px] text-slate-600 leading-snug">{pin.address}</div>
            ) : null}
            {pin.distanceLabel ? (
              <div className="text-[11px] font-semibold text-blue-700">
                {pin.distanceLabel} from hotel
              </div>
            ) : null}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const CameraPanner: React.FC<{
  lat: number | null;
  lng: number | null;
  zoom: number;
}> = ({ lat, lng, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || lat === null || lng === null) return;
    map.panTo({ lat, lng });
    map.setZoom(zoom);
  }, [map, lat, lng, zoom]);

  return null;
};

const TransitMapOverlayController: React.FC<{
  mode: TransitOverlayMode | null;
  hotelPin: ResolvedPlacePin | null;
  targets: ResolvedPlacePin[];
  selectedPinId: string | null;
  onRouteMetricsChange?: (metrics: Record<string, RouteMetricInfo>, isLoading: boolean) => void;
}> = ({ mode, hotelPin, targets, selectedPinId, onRouteMetricsChange }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const routesLib = useMapsLibrary('routes');
  const [computedRoutes, setComputedRoutes] = useState<
    Array<{ targetId: string; mode: 'walking_routes' | 'cab_taxi'; route: google.maps.routes.Route }>
  >([]);

  useEffect(() => {
    if (!map || !mapsLib || !mode) {
      return;
    }

    let activeLayer: google.maps.TransitLayer | google.maps.TrafficLayer | null = null;
    if (mode === 'public_transport') {
      const transitLayer = new mapsLib.TransitLayer();
      transitLayer.setMap(map);
      activeLayer = transitLayer;
    } else if (mode === 'cab_taxi') {
      const trafficLayer = new mapsLib.TrafficLayer({ autoRefresh: true });
      trafficLayer.setMap(map);
      activeLayer = trafficLayer;
    }

    return () => {
      if (activeLayer) {
        activeLayer.setMap(null);
      }
    };
  }, [map, mapsLib, mode]);

  useEffect(() => {
    if (!routesLib || !hotelPin || (mode !== 'walking_routes' && mode !== 'cab_taxi')) {
      setComputedRoutes([]);
      onRouteMetricsChange?.({}, false);
      return;
    }

    const targetsToRoute = targets.slice(0, 6);
    if (targetsToRoute.length === 0) {
      setComputedRoutes([]);
      onRouteMetricsChange?.({}, false);
      return;
    }

    let cancelled = false;
    onRouteMetricsChange?.({}, true);

    const computeAllRoutes = async () => {
      const metricsMap: Record<string, RouteMetricInfo> = {};
      const nextRoutes: Array<{
        targetId: string;
        mode: 'walking_routes' | 'cab_taxi';
        route: google.maps.routes.Route;
      }> = [];
      const travelMode =
        mode === 'walking_routes'
          ? google.maps.TravelMode.WALKING
          : google.maps.TravelMode.DRIVING;

      const results = await Promise.all(
        targetsToRoute.map(async (target) => {
          try {
            const response = await routesLib.Route.computeRoutes({
              origin: { lat: hotelPin.lat, lng: hotelPin.lng },
              destination: { lat: target.lat, lng: target.lng },
              travelMode,
              ...(mode === 'cab_taxi'
                ? { routingPreference: routesLib.RoutingPreference.TRAFFIC_AWARE }
                : {}),
              fields: ['path', 'durationMillis', 'distanceMeters', 'localizedValues'],
            });
            return { target, route: response.routes?.[0] ?? null };
          } catch (err) {
            if (isQuotaError(err)) {
              window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
            }
            return { target, route: null };
          }
        })
      );

      if (cancelled) return;

      results.forEach(({ target, route }) => {
        if (!route) return;
        const durationText =
          route.localizedValues?.duration || formatRouteDurationMillis(route.durationMillis);
        const distanceText =
          route.localizedValues?.distance || formatRouteDistanceMeters(route.distanceMeters);

        if (durationText || distanceText) {
          metricsMap[target.id] = {
            durationText: durationText || '',
            distanceText: distanceText || target.distanceLabel || '',
          };
        }
        nextRoutes.push({ targetId: target.id, mode, route });
      });

      setComputedRoutes(nextRoutes);
      onRouteMetricsChange?.(metricsMap, false);
    };

    void computeAllRoutes();

    return () => {
      cancelled = true;
    };
  }, [routesLib, hotelPin, mode, targets, onRouteMetricsChange]);

  useEffect(() => {
    if (!map || computedRoutes.length === 0 || (mode !== 'walking_routes' && mode !== 'cab_taxi')) {
      return;
    }

    const polylines: google.maps.Polyline[] = [];
    const selectedTargetIndex = computedRoutes.findIndex((item) => item.targetId === selectedPinId);
    const primaryIndex = selectedTargetIndex >= 0 ? selectedTargetIndex : 0;

    computedRoutes.forEach(({ route, mode: routeMode }, idx) => {
      if (routeMode !== mode) return;
      const isPrimary = idx === primaryIndex;
      const created = route.createPolylines({
        polylineOptions:
          mode === 'walking_routes'
            ? {
                strokeColor: isPrimary ? '#0284c7' : '#38bdf8',
                strokeOpacity: isPrimary ? 0.92 : 0.45,
                strokeWeight: isPrimary ? 5 : 3,
                zIndex: isPrimary ? 20 : 8,
              }
            : {
                strokeColor: isPrimary ? '#b45309' : '#f59e0b',
                strokeOpacity: isPrimary ? 0.9 : 0.4,
                strokeWeight: isPrimary ? 5 : 3,
                zIndex: isPrimary ? 20 : 8,
              },
      });

      created.forEach((poly) => {
        poly.setMap(map);
        polylines.push(poly);
      });
    });

    return () => {
      polylines.forEach((poly) => poly.setMap(null));
    };
  }, [map, computedRoutes, selectedPinId, mode]);

  return null;
};

const MapInnerSurface: React.FC<{
  stars?: number;
  pins: ResolvedPlacePin[];
  selectedPinId: string | null;
  onSelectPin: (id: string | null) => void;
  transitOverlay?: TransitOverlayMode | null;
  overlayTargets?: ResolvedPlacePin[];
  onRouteMetricsChange?: (metrics: Record<string, RouteMetricInfo>, isLoading: boolean) => void;
}> = ({
  stars,
  pins,
  selectedPinId,
  onSelectPin,
  transitOverlay = null,
  overlayTargets = [],
  onRouteMetricsChange,
}) => {
  const isLoaded = useApiIsLoaded();
  const status = useApiLoadingStatus();
  const { hotelPin } = useHotelMapsState();

  const activePin = useMemo(
    () => pins.find((p) => p.id === selectedPinId) || hotelPin,
    [pins, selectedPinId, hotelPin]
  );

  const center = useMemo(
    () =>
      activePin
        ? { lat: activePin.lat, lng: activePin.lng }
        : hotelPin
        ? { lat: hotelPin.lat, lng: hotelPin.lng }
        : DEFAULT_FALLBACK_CENTER,
    [activePin, hotelPin]
  );

  const zoom = hotelPin
    ? selectedPinId && selectedPinId !== hotelPin.id
      ? 15
      : transitOverlay === 'walking_routes' || transitOverlay === 'cab_taxi'
      ? 14
      : pins.some((p) => p.category === 'nearby_hotel')
      ? 14
      : 15
    : 5;

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-600 text-xs sm:text-sm p-6 text-center">
        Unable to load Google Maps right now. Please check your connection or API key quota.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-500 text-xs sm:text-sm">
        Loading Google Maps...
      </div>
    );
  }

  return (
    <GoogleMap
      mapId="DEMO_MAP_ID"
      defaultCenter={center}
      defaultZoom={zoom}
      gestureHandling="greedy"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      className="w-full h-full"
    >
      <CameraPanner
        lat={activePin ? activePin.lat : null}
        lng={activePin ? activePin.lng : null}
        zoom={zoom}
      />
      <TransitMapOverlayController
        mode={transitOverlay}
        hotelPin={hotelPin}
        targets={overlayTargets}
        selectedPinId={selectedPinId}
        onRouteMetricsChange={onRouteMetricsChange}
      />
      {pins.map((pin) => (
        <PinWithInfoWindow
          key={pin.id}
          pin={pin}
          stars={pin.category === 'hotel' ? stars : undefined}
          isSelected={selectedPinId === pin.id}
          onSelect={() => onSelectPin(pin.id)}
          onClose={() => onSelectPin(null)}
        />
      ))}
    </GoogleMap>
  );
};

/**
 * Clean Integrated Google Map Container — ZERO extra overlay text, badges, or buttons inside the map.
 */
export const HotelIntegratedMapCanvas: React.FC<{
  stars: number;
}> = ({ stars }) => {
  const {
    keyLoaded,
    apiKey,
    hotelPin,
    attractions,
    transit,
    airports,
    selectedPinId,
    setSelectedPinId,
  } = useHotelMapsState();

  const inlinePins = useMemo(() => {
    const list: ResolvedPlacePin[] = [];
    if (hotelPin) list.push(hotelPin);
    list.push(...attractions, ...transit.slice(0, 3), ...airports);
    return list;
  }, [hotelPin, attractions, transit, airports]);

  if (!keyLoaded) {
    return (
      <div
        data-testid="hotel-integrated-google-map"
        className="w-full h-[360px] sm:h-[440px] lg:h-full lg:min-h-[440px] rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center text-xs sm:text-sm text-slate-500"
      >
        Loading Google Maps...
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div
        data-testid="hotel-integrated-google-map"
        className="w-full h-[360px] sm:h-[440px] lg:h-full lg:min-h-[440px] rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center text-xs sm:text-sm text-slate-600 p-6 text-center"
      >
        Google Maps API key is not configured in this environment.
      </div>
    );
  }

  return (
    <div
      data-testid="hotel-integrated-google-map"
      className="w-full h-[360px] sm:h-[440px] lg:h-full lg:min-h-[440px] rounded-2xl border border-slate-200 overflow-hidden bg-slate-100"
    >
      <MapInnerSurface
        stars={stars}
        pins={inlinePins}
        selectedPinId={selectedPinId}
        onSelectPin={setSelectedPinId}
      />
    </div>
  );
};

/**
 * Three Dedicated Blocks: Attractions, Transit, Airport (replaces "What's nearby").
 */
export const HotelLocationBlocksPanel: React.FC = () => {
  const { attractions, transit, airports, isSearching, selectedPinId, setSelectedPinId, apiKey } =
    useHotelMapsState();

  const renderBlock = (
    title: string,
    Icon: React.ComponentType<{ className?: string }>,
    items: ResolvedPlacePin[],
    emptyText: string
  ) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#eef2f6] text-[#072a4f] flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">{title}</h3>
      </div>

      {isSearching && items.length === 0 ? (
        <div className="text-xs text-slate-500 py-1">Loading {title.toLowerCase()} from Google Maps...</div>
      ) : items.length === 0 ? (
        <div className="text-xs text-slate-500 py-1">
          {apiKey ? emptyText : 'Connect Google Maps API key to load live nearby places.'}
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((place) => {
            const isActive = selectedPinId === place.id;
            return (
              <li key={place.id} className="py-2 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedPinId(place.id)}
                  className={`w-full text-left flex items-start justify-between gap-3 rounded-lg px-2 py-1.5 -mx-2 transition-colors cursor-pointer ${
                    isActive ? 'bg-blue-50/90 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium leading-snug">{place.name}</span>
                  {place.distanceLabel ? (
                    <span className="text-xs font-semibold text-slate-600 tabular-nums whitespace-nowrap shrink-0">
                      {place.distanceLabel}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div data-testid="hotel-location-blocks" className="space-y-4">
      {renderBlock('Attractions', Compass, attractions, 'No nearby attractions returned.')}
      {renderBlock('Transit', TrainFront, transit.slice(0, 3), 'No nearby transit stations returned.')}
      {renderBlock('Airport', Plane, airports, 'No nearby airport returned.')}
    </div>
  );
};

/**
 * Full-Page Google Maps Explorer opened when clicking the hotel address directly.
 * Features a Google Maps-style left sidebar (clicked hotel card at top + side-by-side Nearby Hotels & Transit tabs below)
 * paired with a full-viewport Google Map on the right.
 */
export const HotelAddressMapModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  location: string;
  stars: number;
  hotelImage?: string;
  rating?: number;
  reviewsCount?: number;
  propertyType?: string;
  formattedPrice?: string;
}> = ({
  isOpen,
  onClose,
  hotelName,
  location,
  stars,
  hotelImage,
  rating,
  reviewsCount,
  propertyType,
  formattedPrice,
}) => {
  const {
    apiKey,
    hotelPin,
    nearbyHotels,
    transit,
    attractions,
    airports,
    taxiStands,
    isSearching,
  } = useHotelMapsState();
  const [sidebarTab, setSidebarTab] = useState<'hotels' | 'transit'>('hotels');
  const [transitOverlay, setTransitOverlay] = useState<TransitOverlayMode>('public_transport');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [routeMetrics, setRouteMetrics] = useState<Record<string, RouteMetricInfo>>({});
  const [isComputingRoutes, setIsComputingRoutes] = useState<boolean>(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Lock page background scroll and reset focus to primary hotel whenever opened
  useEffect(() => {
    if (!isOpen) return;
    setSidebarTab('hotels');
    setTransitOverlay('public_transport');
    setSelectedPinId(hotelPin?.id || null);
    setRouteMetrics({});
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, hotelPin?.id]);

  const handleTabSwitch = (nextTab: 'hotels' | 'transit') => {
    setSidebarTab(nextTab);
    setSelectedPinId(hotelPin?.id || null);
  };

  const handleTransitOverlayChange = (nextMode: TransitOverlayMode) => {
    setTransitOverlay(nextMode);
    setSelectedPinId(hotelPin?.id || null);
  };

  const handleRouteMetricsChange = useCallback(
    (metrics: Record<string, RouteMetricInfo>, loading: boolean) => {
      setRouteMetrics(metrics);
      setIsComputingRoutes(loading);
    },
    []
  );

  const walkingDestinations = useMemo(
    () =>
      filterDistinctNearbyPlaces(
        [...transit, ...attractions],
        hotelPin?.id,
        hotelName,
        6
      ),
    [transit, attractions, hotelPin?.id, hotelName]
  );

  const cabPickupDestinations = useMemo(
    () =>
      filterDistinctNearbyPlaces(
        taxiStands.length > 0 ? [...taxiStands, ...airports] : [...transit.slice(0, 3), ...airports],
        hotelPin?.id,
        hotelName,
        6
      ),
    [taxiStands, transit, airports, hotelPin?.id, hotelName]
  );

  const activeTransitItems = useMemo(() => {
    switch (transitOverlay) {
      case 'walking_routes':
        return walkingDestinations;
      case 'cab_taxi':
        return cabPickupDestinations;
      case 'public_transport':
      default:
        return transit;
    }
  }, [transitOverlay, walkingDestinations, cabPickupDestinations, transit]);

  const fullPagePins = useMemo(() => {
    const base: ResolvedPlacePin[] = [];
    if (hotelPin) base.push(hotelPin);
    if (sidebarTab === 'hotels') {
      base.push(...nearbyHotels);
    } else {
      base.push(...activeTransitItems);
    }
    return base;
  }, [hotelPin, sidebarTab, nearbyHotels, activeTransitItems]);

  if (!isOpen) return null;

  const activeItems = sidebarTab === 'hotels' ? nearbyHotels : activeTransitItems;
  const activeOverlayForMap: TransitOverlayMode | null =
    sidebarTab === 'transit' ? transitOverlay : null;

  const nearestCabStand = taxiStands[0];
  const nearestCabMetric = nearestCabStand ? routeMetrics[nearestCabStand.id] : undefined;
  const cabSummaryText = deriveCabPickupSummary({
    taxiStandCount: taxiStands.length,
    nearestStandName: nearestCabStand?.name,
    nearestDriveDuration: nearestCabMetric?.durationText,
  });

  const getOverlayIcon = (mode: TransitOverlayMode) => {
    switch (mode) {
      case 'walking_routes':
        return Footprints;
      case 'cab_taxi':
        return CarTaxiFront;
      case 'public_transport':
      default:
        return TrainFront;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${hotelName} on Google Maps`}
      data-testid="hotel-fullpage-google-map-view"
      className="fixed inset-0 z-[90] bg-white flex flex-col md:flex-row overflow-hidden"
    >
      {/* Left Google Maps Sidebar Panel */}
      <aside
        aria-label="Hotel and nearby places explorer"
        className="w-full md:w-[390px] lg:w-[420px] shrink-0 h-[48vh] md:h-full bg-white border-b md:border-b-0 md:border-r border-slate-200 shadow-xl z-10 flex flex-col"
      >
        {/* Top Back / Search Header Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to hotel"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex-1 min-w-0 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-700 truncate font-medium">
            {hotelName}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Google Map"
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Clicked Hotel Card */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedPinId(hotelPin?.id || null)}
            className={`w-full text-left rounded-xl p-2.5 -m-1 transition-colors cursor-pointer flex items-start gap-3 ${
              selectedPinId === hotelPin?.id ? 'bg-white ring-1 ring-[#072a4f]/25 shadow-xs' : 'hover:bg-white'
            }`}
          >
            {hotelImage ? (
              <img
                src={hotelImage}
                alt={hotelName}
                className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-[#072a4f] text-white flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#072a4f]">
                  {propertyType || `${stars}-Star Hotel`}
                </span>
                {formattedPrice ? (
                  <span className="text-xs font-bold text-slate-900 tabular-nums shrink-0">
                    {formattedPrice}
                    <span className="font-normal text-slate-500">/night</span>
                  </span>
                ) : null}
              </div>

              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 font-display">
                {hotelName}
              </h2>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="inline-flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </span>
                {typeof rating === 'number' ? (
                  <span className="font-semibold text-slate-800">{rating.toFixed(1)}</span>
                ) : null}
                {typeof reviewsCount === 'number' ? (
                  <span className="text-slate-500">({reviewsCount.toLocaleString()})</span>
                ) : null}
              </div>

              <p className="text-xs text-slate-600 flex items-start gap-1 leading-snug">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{hotelPin?.address || location}</span>
              </p>
            </div>
          </button>
        </div>

        {/* Same Box Side-by-Side Switcher: Nearby Hotels | Transit */}
        <div
          role="tablist"
          aria-label="Nearby places category"
          className="grid grid-cols-2 border-b border-slate-200 bg-white shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={sidebarTab === 'hotels'}
            onClick={() => handleTabSwitch('hotels')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              sidebarTab === 'hotels'
                ? 'border-[#072a4f] text-[#072a4f] bg-slate-50/70'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40'
            }`}
          >
            <BedDouble className="w-4 h-4 shrink-0" />
            <span>Nearby Hotels</span>
            {nearbyHotels.length > 0 ? (
              <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                ({nearbyHotels.length})
              </span>
            ) : null}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={sidebarTab === 'transit'}
            onClick={() => handleTabSwitch('transit')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              sidebarTab === 'transit'
                ? 'border-[#072a4f] text-[#072a4f] bg-slate-50/70'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40'
            }`}
          >
            <TrainFront className="w-4 h-4 shrink-0" />
            <span>Transit</span>
            {transit.length > 0 ? (
              <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                ({transit.length})
              </span>
            ) : null}
          </button>
        </div>

        {/* Transit Map Overlay Filter Section */}
        {sidebarTab === 'transit' ? (
          <section
            aria-label="Transit map overlay filters"
            data-testid="transit-overlay-filter-section"
            className="px-4 py-3 border-b border-slate-200 bg-slate-50/80 space-y-2.5 shrink-0"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Layers className="w-3.5 h-3.5 text-[#072a4f]" />
                <span>Map Overlays</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {transitOverlay === 'public_transport'
                  ? 'Transit Layer'
                  : transitOverlay === 'walking_routes'
                  ? isComputingRoutes
                    ? 'Calculating routes...'
                    : 'Pedestrian Paths'
                  : isComputingRoutes
                  ? 'Checking traffic...'
                  : 'Traffic & Cab Hubs'}
              </span>
            </div>

            <div
              role="group"
              aria-label="Toggle Google Maps transit overlays"
              className="grid grid-cols-3 gap-1.5"
            >
              {TRANSIT_OVERLAY_OPTIONS.map((option) => {
                const Icon = getOverlayIcon(option.id);
                const isActive = transitOverlay === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    data-testid={`transit-filter-${option.id}`}
                    aria-pressed={isActive}
                    onClick={() => handleTransitOverlayChange(option.id)}
                    className={`rounded-lg px-2 py-2 text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                      isActive
                        ? 'bg-[#072a4f] text-white border-[#072a4f] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#072a4f]'
                      }`}
                    />
                    <span className="text-[11px] font-semibold leading-tight">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p
              data-testid="transit-overlay-status-summary"
              className="text-[11px] text-slate-600 leading-snug bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5"
            >
              {transitOverlay === 'public_transport'
                ? 'Google Maps Transit Layer active — displaying rail, metro & bus corridors.'
                : transitOverlay === 'walking_routes'
                ? `Showing walking routes & estimated walk times from ${hotelName}.`
                : cabSummaryText}
            </p>
          </section>
        ) : null}

        {/* Scrollable Nearby Hotels or Transit Overlay List */}
        <div
          data-testid="hotel-fullpage-sidebar-list"
          className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white"
        >
          {isSearching && activeItems.length === 0 ? (
            <div className="p-6 text-xs sm:text-sm text-slate-500 text-center">
              Loading {sidebarTab === 'hotels' ? 'nearby hotels' : 'transit places'} from Google Maps...
            </div>
          ) : activeItems.length === 0 ? (
            <div className="p-6 text-xs sm:text-sm text-slate-500 text-center">
              {apiKey
                ? sidebarTab === 'hotels'
                  ? 'No nearby hotels returned in this area.'
                  : transitOverlay === 'cab_taxi'
                  ? 'No nearby taxi stands or pickup hubs returned in this area.'
                  : 'No nearby transit stations returned in this area.'
                : 'Google Maps API key is not configured in this environment.'}
            </div>
          ) : (
            activeItems.map((place) => {
              const isSelected = selectedPinId === place.id;
              const metric = sidebarTab === 'transit' ? routeMetrics[place.id] : undefined;
              const ItemIcon =
                sidebarTab === 'hotels'
                  ? Building2
                  : place.category === 'taxi'
                  ? CarTaxiFront
                  : place.category === 'airport'
                  ? Plane
                  : place.category === 'attraction'
                  ? Compass
                  : TrainFront;

              const iconColorClass =
                sidebarTab === 'hotels'
                  ? 'text-indigo-600'
                  : place.category === 'taxi'
                  ? 'text-amber-600'
                  : place.category === 'airport'
                  ? 'text-blue-600'
                  : place.category === 'attraction'
                  ? 'text-amber-700'
                  : 'text-teal-700';

              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setSelectedPinId(place.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-l-4 border-l-[#072a4f]'
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start gap-2">
                      <ItemIcon className={`w-4 h-4 ${iconColorClass} shrink-0 mt-0.5`} />
                      <span className="text-sm font-semibold text-slate-900 leading-snug">
                        {place.name}
                      </span>
                    </div>

                    {sidebarTab === 'hotels' && typeof place.rating === 'number' ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 pl-6">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {place.rating.toFixed(1)}
                        </span>
                        {place.userRatingCount ? (
                          <span className="text-slate-500">
                            ({place.userRatingCount.toLocaleString()})
                          </span>
                        ) : null}
                        {place.typeLabel ? (
                          <span className="text-slate-500 truncate">· {place.typeLabel}</span>
                        ) : null}
                      </div>
                    ) : place.typeLabel ? (
                      <div className="text-xs text-slate-500 pl-6">{place.typeLabel}</div>
                    ) : null}

                    {place.address ? (
                      <p className="text-xs text-slate-500 pl-6 line-clamp-2 leading-snug">
                        {place.address}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end gap-0.5 shrink-0 pt-0.5">
                    {metric?.durationText ? (
                      <span className="text-xs font-bold text-[#072a4f] tabular-nums whitespace-nowrap">
                        {metric.durationText}{' '}
                        {transitOverlay === 'walking_routes' ? 'walk' : 'drive'}
                      </span>
                    ) : null}
                    {metric?.distanceText || place.distanceLabel ? (
                      <span
                        className={`tabular-nums whitespace-nowrap ${
                          metric?.durationText
                            ? 'text-[11px] font-medium text-slate-500'
                            : 'text-xs font-bold text-[#072a4f]'
                        }`}
                      >
                        {metric?.distanceText || place.distanceLabel}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Right Full-Page Interactive Google Map Canvas */}
      <div
        data-testid="hotel-fullpage-google-map-canvas"
        className="flex-1 relative h-[52vh] md:h-full bg-slate-100"
      >
        {apiKey ? (
          <MapInnerSurface
            stars={stars}
            pins={fullPagePins}
            selectedPinId={selectedPinId}
            onSelectPin={setSelectedPinId}
            transitOverlay={activeOverlayForMap}
            overlayTargets={activeTransitItems}
            onRouteMetricsChange={handleRouteMetricsChange}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-600 p-6 text-center">
            Google Maps API key is not configured in this environment.
          </div>
        )}
      </div>
    </div>
  );
};
