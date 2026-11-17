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

const INITIAL_SEED_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-zostel-goa',
    name: 'Zostel Goa & Backpackers Social Haven',
    category: 'hostel',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    address: 'Anjuna Beach Road, North Goa',
    description: 'Vibrant beachside backpacker hostel with high-speed Wi-Fi, rooftop cafe, co-working desks, and live music evenings.',
    photos: ['/public/assets/images/dest_goa_beach_1792241006825.jpg'],
    roomType: 'Air Conditioned Deluxe Private Room',
    basePriceInr: 899,
    originalPriceInr: 1600,
    rating: 4.7,
    ratingCount: 840,
    amenities: ['Free WiFi', 'Air Conditioning', 'Swimming Pool', 'Rooftop Cafe', 'Couple Friendly', 'Power Backup'],
    availableRooms: 6,
    checkInTime: '01:00 PM',
    checkOutTime: '11:00 AM',
    ownerName: 'Zostel Hospitality Desk',
    ownerEmail: 'host@zostelgoa.com',
    ownerPhone: '+91 98230 45678',
    status: 'approved',
    createdAt: new Date().toISOString(),
    hotelMode: 'overnight',
    badge: 'Cheapest Deal · Backpacker Top Pick',
    verifiedBy: 'TripYeah Admin Verification Desk',
  },
  {
    id: 'prop-goa-palms',
    name: 'Goa Palms Heritage Boutique Resort & Pool',
    category: 'resort',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    address: 'Calangute - Baga Circle, North Goa',
    description: 'Charming Portuguese heritage boutique resort with outdoor swimming pool, complimentary buffet breakfast, and lush tropical gardens.',
    photos: ['/public/assets/images/dest_bali_temple_1790774699717.jpg'],
    roomType: 'Deluxe Garden & Pool View Room',
    basePriceInr: 1950,
    originalPriceInr: 3200,
    rating: 4.8,
    ratingCount: 620,
    amenities: ['Free WiFi', 'Swimming Pool', 'Complimentary Breakfast', 'Air Conditioning', 'Bar & Lounge', 'Spa'],
    availableRooms: 8,
    checkInTime: '02:00 PM',
    checkOutTime: '11:00 AM',
    ownerName: 'Goa Palms Management',
    ownerEmail: 'reservations@goapalms.in',
    ownerPhone: '+91 98221 67890',
    status: 'approved',
    createdAt: new Date().toISOString(),
    hotelMode: 'overnight',
    badge: 'Best Value · 40% Off',
    verifiedBy: 'TripYeah Admin Verification Desk',
  },
  {
    id: 'prop-casa-bella',
    name: 'Casa Bella Seaview Private Pool Villa',
    category: 'villa',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    address: 'Candolim Beach Promenade, North Goa',
    description: 'Exclusive 2BHK luxury beachfront villa with private infinity plunge pool, personal butler, and panoramic Arabian Sea sunset views.',
    photos: ['/public/assets/images/dest_maldives_resort_1792241008307.jpg'],
    roomType: '2BHK Luxury Villa with Private Infinity Plunge Pool',
    basePriceInr: 4499,
    originalPriceInr: 7200,
    rating: 4.9,
    ratingCount: 310,
    amenities: ['Private Pool', 'Direct Beach Access', 'Free WiFi', 'Chef on Demand', 'Air Conditioning', 'Kitchenette'],
    availableRooms: 2,
    checkInTime: '02:00 PM',
    checkOutTime: '12:00 PM',
    ownerName: 'Casa Bella Estates',
    ownerEmail: 'villas@casabellagoa.com',
    ownerPhone: '+91 98110 23456',
    status: 'approved',
    createdAt: new Date().toISOString(),
    hotelMode: 'villas',
    badge: 'Exclusive Villa · Private Pool',
    verifiedBy: 'TripYeah Admin Verification Desk',
  },
  {
    id: 'prop-taj-exotica',
    name: 'Taj Exotica Resort & Spa Goa (5★ Luxury Icon)',
    category: 'resort',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    address: 'Benaulim Beach, South Goa',
    description: 'Mediterranean-inspired 56-acre luxury beachfront resort with private beach cabanas, Jiva Ayurvedic spa, and world-class dining.',
    photos: ['/public/assets/images/hero_alpine_lakeside_1790774682097.jpg'],
    roomType: 'Premium Ocean-Facing Heritage Suite',
    basePriceInr: 11800,
    originalPriceInr: 17500,
    rating: 4.96,
    ratingCount: 1540,
    amenities: ['Private Beach', 'Olympic Size Pool', 'Jiva Spa', 'Free High Speed WiFi', 'Tennis Court', 'Valet Parking'],
    availableRooms: 12,
    checkInTime: '02:00 PM',
    checkOutTime: '12:00 PM',
    ownerName: 'IHCL Taj Hotels',
    ownerEmail: 'exotica.goa@tajhotels.com',
    ownerPhone: '+91 832 668 3333',
    status: 'approved',
    createdAt: new Date().toISOString(),
    hotelMode: 'overnight',
    badge: 'TripYeah Luxe · 5★ Icon',
    verifiedBy: 'TripYeah Admin Verification Desk',
  },
];

// In-memory cache for fast UI updates
let cachedProperties: PropertyListing[] | null = null;

function loadLocalProperties(): PropertyListing[] {
  if (cachedProperties !== null && cachedProperties.length > 0) {
    return cachedProperties;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedProperties = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local property listings:', e);
  }
  cachedProperties = [...INITIAL_SEED_PROPERTIES];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_PROPERTIES));
  } catch {}
  return cachedProperties;
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
    const cityMatched = approved.filter(
      (p) =>
        p.city.toLowerCase().includes(qCity) ||
        qCity.includes(p.city.toLowerCase()) ||
        p.address.toLowerCase().includes(qCity)
    );
    if (cityMatched.length > 0) {
      approved = cityMatched;
    }
  }

  if (filters?.category && filters.category !== 'all') {
    approved = approved.filter((p) => p.category === filters.category);
  }

  if (filters?.hotelMode) {
    if (filters.hotelMode === 'villas') {
      const villasOnly = approved.filter((p) => p.category === 'villa' || p.category === 'homestay');
      if (villasOnly.length > 0) approved = villasOnly;
    } else if (filters.hotelMode === 'hostels') {
      const hostelsOnly = approved.filter((p) => p.category === 'hostel');
      if (hostelsOnly.length > 0) approved = hostelsOnly;
    }
  }

  if (filters?.maxPrice && filters.maxPrice > 0) {
    approved = approved.filter((p) => p.basePriceInr <= filters.maxPrice!);
  }

  // Always enforce lowest price first by default
  approved.sort((a, b) => a.basePriceInr - b.basePriceInr);

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
