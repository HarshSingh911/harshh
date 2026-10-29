import { supabase } from '../lib/supabase';

export interface PropertyListing {
  id: string;
  name: string;
  category: 'hotel' | 'villa' | 'homestay' | 'resort' | 'hostel' | 'apartment';
  city: string;
  state?: string;
  country: string;
  address: string;
  description: string;
  photos: string[];
  roomType: string;
  basePriceInr: number;
  originalPriceInr?: number;
  rating?: number;
  ratingCount?: number;
  amenities: string[];
  availableRooms: number;
  checkInTime: string;
  checkOutTime: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  hotelMode?: 'overnight' | 'hourly' | 'villas' | 'hostels';
  badge?: string;
  verifiedBy?: string;
}

const STORAGE_KEY = 'tripyeah_real_properties_v2';

// In-memory cache for fast UI updates
let cachedProperties: PropertyListing[] | null = null;

function loadLocalProperties(): PropertyListing[] {
  if (cachedProperties !== null) {
    return cachedProperties;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedProperties = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local property listings:', e);
  }
  cachedProperties = [];
  return [];
}

function saveLocalProperties(list: PropertyListing[]): void {
  cachedProperties = list;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to persist properties locally:', e);
  }
}

/**
 * Fetch all properties for admin review (including pending and rejected).
 */
export async function fetchAdminProperties(): Promise<PropertyListing[]> {
  try {
    // Attempt Supabase query first
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: PropertyListing[] = data.map((row: any) => ({
        id: String(row.id || row.property_id),
        name: row.name || row.property_name || 'Untitled Property',
        category: (row.category || 'hotel').toLowerCase() as any,
        city: row.city || '',
        state: row.state,
        country: row.country || 'India',
        address: row.address || '',
        description: row.description || '',
        photos: Array.isArray(row.photos) ? row.photos : (row.photo_url ? [row.photo_url] : []),
        roomType: row.room_type || 'Standard Room',
        basePriceInr: Number(row.base_price_inr || row.price_per_night || 0),
        originalPriceInr: row.original_price_inr ? Number(row.original_price_inr) : undefined,
        rating: row.rating ? Number(row.rating) : 4.8,
        ratingCount: row.rating_count ? Number(row.rating_count) : 12,
        amenities: Array.isArray(row.amenities) ? row.amenities : [],
        availableRooms: Number(row.available_rooms || 1),
        checkInTime: row.check_in_time || '02:00 PM',
        checkOutTime: row.check_out_time || '11:00 AM',
        ownerName: row.owner_name || row.host_name || 'Partner Host',
        ownerEmail: row.owner_email || row.host_email || '',
        ownerPhone: row.owner_phone || row.host_phone || '',
        status: (row.status || 'pending').toLowerCase() as any,
        createdAt: row.created_at || new Date().toISOString(),
        hotelMode: row.hotel_mode || 'overnight',
        badge: row.badge,
      }));

      // Merge with any local offline properties
      const local = loadLocalProperties();
      const existingIds = new Set(mapped.map((p) => p.id));
      for (const item of local) {
        if (!existingIds.has(item.id)) {
          mapped.push(item);
        }
      }
      saveLocalProperties(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase fetchAdminProperties error, using local storage:', err);
  }

  return loadLocalProperties();
}

/**
 * Fetch public approved properties only (filtered by city and optional mode/category).
 */
export async function fetchApprovedProperties(filters?: {
  city?: string;
  category?: string;
  hotelMode?: 'overnight' | 'hourly' | 'villas' | 'hostels';
  maxPrice?: number;
}): Promise<PropertyListing[]> {
  const all = await fetchAdminProperties();
  
  // Filter ONLY approved listings
  let approved = all.filter((p) => p.status === 'approved');

  if (filters?.city && filters.city.trim() !== '') {
    const qCity = filters.city.trim().toLowerCase();
    approved = approved.filter(
      (p) =>
        p.city.toLowerCase().includes(qCity) ||
        qCity.includes(p.city.toLowerCase()) ||
        p.address.toLowerCase().includes(qCity)
    );
  }

  if (filters?.category && filters.category !== 'all') {
    approved = approved.filter((p) => p.category === filters.category);
  }

  if (filters?.hotelMode) {
    if (filters.hotelMode === 'villas') {
      approved = approved.filter((p) => p.category === 'villa' || p.category === 'homestay');
    } else if (filters.hotelMode === 'hostels') {
      approved = approved.filter((p) => p.category === 'hostel');
    }
  }

  if (filters?.maxPrice && filters.maxPrice > 0) {
    approved = approved.filter((p) => p.basePriceInr <= filters.maxPrice!);
  }

  return approved;
}

/**
 * Property owner submits a new listing. Status defaults to 'pending'.
 */
export async function submitPropertyListing(
  listing: Omit<PropertyListing, 'id' | 'status' | 'createdAt'>
): Promise<PropertyListing> {
  const id = `PROP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const newProperty: PropertyListing = {
    ...listing,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
    rating: 5.0,
    ratingCount: 1,
  };

  // Save locally first for instant availability in admin panel
  const current = loadLocalProperties();
  const updated = [newProperty, ...current];
  saveLocalProperties(updated);

  // Attempt to sync with Supabase properties table
  try {
    const { error } = await supabase.from('properties').insert([
      {
        id,
        name: newProperty.name,
        category: newProperty.category,
        city: newProperty.city,
        state: newProperty.state || '',
        country: newProperty.country,
        address: newProperty.address,
        description: newProperty.description,
        photos: newProperty.photos,
        room_type: newProperty.roomType,
        base_price_inr: newProperty.basePriceInr,
        amenities: newProperty.amenities,
        available_rooms: newProperty.availableRooms,
        check_in_time: newProperty.checkInTime,
        check_out_time: newProperty.checkOutTime,
        owner_name: newProperty.ownerName,
        owner_email: newProperty.ownerEmail,
        owner_phone: newProperty.ownerPhone,
        status: 'pending',
        created_at: newProperty.createdAt,
      },
    ]);
    if (error) {
      console.warn('Note: Supabase table properties insert error (saved locally):', error.message);
    }
  } catch (err) {
    console.warn('Note: Supabase exception during property insert (saved locally):', err);
  }

  return newProperty;
}

/**
 * Admin approves a property listing. It will immediately appear in customer search.
 */
export async function approvePropertyListing(propertyId: string): Promise<boolean> {
  const current = loadLocalProperties();
  const target = current.find((p) => p.id === propertyId);
  if (!target) return false;

  target.status = 'approved';
  target.verifiedBy = 'TripYeah Admin Verification Desk';
  saveLocalProperties([...current]);

  // Attempt Supabase update
  try {
    await supabase
      .from('properties')
      .update({ status: 'approved', verified_by: 'TripYeah Admin' })
      .eq('id', propertyId);
  } catch (e) {
    console.warn('Supabase approve update note:', e);
  }

  return true;
}

/**
 * Admin rejects a property listing.
 */
export async function rejectPropertyListing(propertyId: string): Promise<boolean> {
  const current = loadLocalProperties();
  const target = current.find((p) => p.id === propertyId);
  if (!target) return false;

  target.status = 'rejected';
  saveLocalProperties([...current]);

  try {
    await supabase
      .from('properties')
      .update({ status: 'rejected' })
      .eq('id', propertyId);
  } catch (e) {
    console.warn('Supabase reject update note:', e);
  }

  return true;
}

/**
 * Admin deletes a property listing.
 */
export async function deletePropertyListing(propertyId: string): Promise<boolean> {
  const current = loadLocalProperties();
  const filtered = current.filter((p) => p.id !== propertyId);
  saveLocalProperties(filtered);

  try {
    await supabase.from('properties').delete().eq('id', propertyId);
  } catch (e) {
    console.warn('Supabase delete note:', e);
  }

  return true;
}
