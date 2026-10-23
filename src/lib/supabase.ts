import { createClient } from '@supabase/supabase-js';

// Clean any accidental whitespace from the Supabase URL
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ufnjelaypwikopefbfji.supabase.co';
const supabaseUrl = rawUrl.replace(/\s+/g, '');
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_cmYa-kIeYjdMygWU3LU4OQ_hLh8gG99';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseConnectionStatus {
  connected: boolean;
  tableName: string;
  totalAirports?: number;
  sampleRecord?: any;
  error?: string;
  latencyMs?: number;
}

/**
 * Diagnostic helper to test the Supabase connection and verify access to the airport table.
 */
export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const startTime = performance.now();
  try {
    // Test 'airports' table first
    const { data, error, count } = await supabase
      .from('airports')
      .select('id, airport_name, city, country, iata_code', { count: 'exact' })
      .limit(1);

    if (!error && data) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        connected: true,
        tableName: 'airports',
        totalAirports: count ?? undefined,
        sampleRecord: data[0] || null,
        latencyMs,
      };
    }

    // Fallback attempt with 'airport' table name
    const { data: altData, error: altError, count: altCount } = await supabase
      .from('airport')
      .select('*', { count: 'exact' })
      .limit(1);

    if (!altError && altData) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        connected: true,
        tableName: 'airport',
        totalAirports: altCount ?? undefined,
        sampleRecord: altData[0] || null,
        latencyMs,
      };
    }

    const latencyMs = Math.round(performance.now() - startTime);
    return {
      connected: false,
      tableName: 'airports',
      error: error?.message || altError?.message || 'Failed to query airport table',
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      connected: false,
      tableName: 'airports',
      error: err?.message || 'Network / connection error',
      latencyMs,
    };
  }
}
