import { supabase } from '../lib/supabase';
import { CITIES, CityOption } from '../data/travelData';

export interface AirportRecord {
  id: number | string;
  airport_name?: string;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  iata_code?: string;
  code?: string;
  icao_code?: string;
}

// In-memory query cache to avoid redundant network hits while typing
const queryCache = new Map<string, CityOption[]>();

/**
 * Normalizes a raw Supabase database row into the app's CityOption structure.
 */
export function mapAirportRecordToCityOption(item: AirportRecord): CityOption {
  const iata = (item.iata_code || item.code || '').trim().toUpperCase();
  const city = (item.city || item.airport_name || item.name || 'Unknown City').trim();
  const airportName = (item.airport_name || item.name || `${city} Airport`).trim();
  const country = (item.country || '').trim();

  return {
    city,
    code: iata || 'AIR',
    stationCode: iata || 'STN',
    country: country || 'Worldwide',
    airportName,
    popularTag: country ? `${country} · Airport` : 'Airport',
  };
}

/**
 * Searches airports from the user's Supabase project.
 * Falls back to local curated airports if Supabase is unavailable.
 */
export async function searchSupabaseAirports(
  rawQuery: string,
  limit = 20
): Promise<{ airports: CityOption[]; fromSupabase: boolean; error?: string }> {
  const query = rawQuery.trim();

  // If query is blank, return local top defaults + popular hubs
  if (!query) {
    return { airports: CITIES, fromSupabase: true };
  }

  const cacheKey = `${query.toLowerCase()}_${limit}`;
  if (queryCache.has(cacheKey)) {
    return { airports: queryCache.get(cacheKey)!, fromSupabase: true };
  }

  try {
    const clean = query.replace(/[^\w\s-]/g, '').trim();
    if (!clean) {
      return { airports: CITIES, fromSupabase: true };
    }

    // Try querying 'airports' table
    let { data, error } = await supabase
      .from('airports')
      .select('id, airport_name, city, country, iata_code')
      .or(`city.ilike.%${clean}%,iata_code.ilike.%${clean}%,airport_name.ilike.%${clean}%`)
      .limit(limit);

    // If 'airports' failed due to table not found, try 'airport'
    if (error && error.code === 'PGRST205') {
      const alt = await supabase
        .from('airport')
        .select('*')
        .or(`city.ilike.%${clean}%,iata_code.ilike.%${clean}%,airport_name.ilike.%${clean}%`)
        .limit(limit);
      data = alt.data;
      error = alt.error;
    }

    if (error) {
      console.warn('Supabase airport query error, falling back to local list:', error.message);
      const fallback = CITIES.filter(
        (c) =>
          c.city.toLowerCase().includes(clean.toLowerCase()) ||
          c.code.toLowerCase().includes(clean.toLowerCase()) ||
          c.country.toLowerCase().includes(clean.toLowerCase())
      );
      return { airports: fallback, fromSupabase: false, error: error.message };
    }

    if (data && data.length > 0) {
      // Prioritize exact IATA code match first, then city match, then airport name
      const mapped = data
        .filter((item: AirportRecord) => item.iata_code || item.city)
        .map(mapAirportRecordToCityOption);

      mapped.sort((a, b) => {
        const qUpper = clean.toUpperCase();
        if (a.code === qUpper && b.code !== qUpper) return -1;
        if (b.code === qUpper && a.code !== qUpper) return 1;
        if (a.city.toLowerCase().startsWith(clean.toLowerCase()) && !b.city.toLowerCase().startsWith(clean.toLowerCase())) return -1;
        if (b.city.toLowerCase().startsWith(clean.toLowerCase()) && !a.city.toLowerCase().startsWith(clean.toLowerCase())) return 1;
        return 0;
      });

      queryCache.set(cacheKey, mapped);
      return { airports: mapped, fromSupabase: true };
    }

    // If no records in Supabase matched, search local fallback as secondary
    const fallback = CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(clean.toLowerCase()) ||
        c.code.toLowerCase().includes(clean.toLowerCase()) ||
        c.country.toLowerCase().includes(clean.toLowerCase())
    );
    return { airports: fallback, fromSupabase: true };
  } catch (err: any) {
    console.error('Supabase airport search exception:', err);
    const fallback = CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())
    );
    return { airports: fallback, fromSupabase: false, error: err.message };
  }
}
