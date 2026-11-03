import { supabase } from '../lib/supabase';

export interface SupabaseCountry {
  country_name: string;
  iso2: string;
  flag_emoji: string;
}

export interface SupabaseCity {
  id: number | string;
  city_name: string;
  country_iso2: string;
  state_region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface FetchCitiesParams {
  countryIso2: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchCitiesResult {
  cities: SupabaseCity[];
  totalCount: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
  error?: string;
}

/**
 * Fetches all countries from public.countries using country_name, iso2, and flag_emoji.
 * Sorted alphabetically by country_name.
 */
export async function fetchCountriesFromSupabase(): Promise<{
  countries: SupabaseCountry[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('country_name, iso2, flag_emoji')
      .order('country_name', { ascending: true });

    if (error) {
      console.error('[Supabase] Failed to fetch countries:', error);
      return { countries: [], error: error.message };
    }

    // Filter out invalid records if any
    const validCountries = (data || []).filter(
      (c) => c && typeof c.country_name === 'string' && typeof c.iso2 === 'string'
    );

    return { countries: validCountries };
  } catch (err: any) {
    console.error('[Supabase] Unexpected error fetching countries:', err);
    return { countries: [], error: err?.message || 'Failed to connect to database' };
  }
}

/**
 * Fetches cities belonging to a selected country from public.cities using country_iso2 = selectedCountry.iso2.
 * Supports server-side search by city_name and pagination via range.
 */
export async function fetchCitiesByCountryFromSupabase({
  countryIso2,
  searchQuery = '',
  page = 0,
  pageSize = 30,
}: FetchCitiesParams): Promise<FetchCitiesResult> {
  if (!countryIso2) {
    return {
      cities: [],
      totalCount: 0,
      hasMore: false,
      page: 0,
      pageSize,
    };
  }

  const cleanIso = countryIso2.trim().toUpperCase();
  const cleanSearch = searchQuery.trim();

  try {
    let query = supabase
      .from('cities')
      .select('id, city_name, country_iso2, state_region, latitude, longitude', { count: 'exact' })
      .eq('country_iso2', cleanIso);

    if (cleanSearch) {
      // Server-side case-insensitive partial match
      query = query.ilike('city_name', `%${cleanSearch}%`);
    }

    // Sort alphabetically for clean user browsing
    query = query.order('city_name', { ascending: true });

    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error(`[Supabase] Failed to fetch cities for ${cleanIso}:`, error);
      return {
        cities: [],
        totalCount: 0,
        hasMore: false,
        page,
        pageSize,
        error: error.message,
      };
    }

    const totalCount = count ?? 0;
    const cities: SupabaseCity[] = data || [];
    const hasMore = (page + 1) * pageSize < totalCount;

    return {
      cities,
      totalCount,
      hasMore,
      page,
      pageSize,
    };
  } catch (err: any) {
    console.error(`[Supabase] Unexpected error fetching cities for ${cleanIso}:`, err);
    return {
      cities: [],
      totalCount: 0,
      hasMore: false,
      page,
      pageSize,
      error: err?.message || 'Failed to fetch cities from database',
    };
  }
}
