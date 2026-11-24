export type AmenityCategoryId =
  | 'accessibility'
  | 'business-facilities'
  | 'food-and-drink'
  | 'for-the-family'
  | 'healthcare'
  | 'hotel-outdoor-facilities'
  | 'in-the-rooms'
  | 'leisure-entertainment'
  | 'media-technology'
  | 'services'
  | 'sport-fitness'
  | 'transport-parking'
  | 'wifi-internet';

export interface CategorizedAmenityGroup {
  id: AmenityCategoryId;
  title: string;
  items: string[];
}

export interface HotelAmenitiesDisplay {
  featuredAmenities: string[];
  categorizedGroups: CategorizedAmenityGroup[];
}

export const MAIN_AMENITY_OPTIONS: string[] = [
  'Free Wi-Fi',
  'Air Conditioning',
  'Swimming Pool',
  'Parking',
  '24/7 Front Desk',
  'Room Service',
];

export const SPECIFIC_AMENITY_OPTIONS: string[] = [
  'Free Breakfast',
  'Private Balcony',
  'On-site Restaurant',
  'Spa & Wellness',
  'Fitness Center',
  'Airport Shuttle',
  'Daily Housekeeping',
  'Pet Friendly',
];

export const FEATURED_AMENITY_DEFAULTS: string[] = [
  'Free Wi-Fi',
  'Air conditioning',
  'Pool',
  'Parking',
  'Restaurant',
  'Front desk 24 hour',
];

export const STANDARD_AMENITY_CATEGORIES: CategorizedAmenityGroup[] = [
  {
    id: 'accessibility',
    title: 'Accessibility',
    items: ['Handrails in stairways', 'Disabled facilities', 'Lift'],
  },
  {
    id: 'business-facilities',
    title: 'Business facilities',
    items: [
      'Executive lounge',
      'Executive floor',
      'Business centre',
      'Meeting facilities',
    ],
  },
  {
    id: 'food-and-drink',
    title: 'Food and drink',
    items: [
      'Complimentary bottled water',
      'Teahouse',
      'Coffee maker',
      'Minibar',
      'Lobby bar',
      'Café',
      'Banqueting service',
      'Restaurant',
      'Bar',
    ],
  },
  {
    id: 'for-the-family',
    title: 'For the family',
    items: ["Children's pool", 'Baby-sitting'],
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    items: ['First aid kit', 'First aid room'],
  },
  {
    id: 'hotel-outdoor-facilities',
    title: 'Hotel and outdoor facilities',
    items: [
      'Non-smoking floor',
      'Wedding facilities',
      'Shops',
      'Ticket office',
      'Non-smoking',
      'Smoking areas',
      'Laundry',
    ],
  },
  {
    id: 'in-the-rooms',
    title: 'In the rooms',
    items: ['Bathtub', 'Bathrobe', 'Hairdryer', 'Shower', 'Air conditioning'],
  },
  {
    id: 'leisure-entertainment',
    title: 'Leisure and entertainment',
    items: [
      'Spa',
      'Sunbathing area',
      'Bicycle hire',
      'Beauty salon',
      'Nightclub',
      'Casino',
    ],
  },
  {
    id: 'media-technology',
    title: 'Media and technology',
    items: ['Television', 'Satellite TV', 'Telephone', 'Photocopier', 'Fax'],
  },
  {
    id: 'services',
    title: 'Services',
    items: [
      'ATM',
      'Wake up call',
      'Multilingual staff',
      'Tours',
      'Trouser press',
      'Currency exchange',
      'Cash machine',
      'Concierge',
      'Luggage storage',
      'Express check-in',
      'Iron',
      'Room service',
      'Front desk 24 hour',
      'Express check-out',
      'Safe deposit box',
    ],
  },
  {
    id: 'sport-fitness',
    title: 'Sport and fitness',
    items: ['Golf course', 'Pool', 'Outdoor pool', 'Fitness centre'],
  },
  {
    id: 'transport-parking',
    title: 'Transport and parking',
    items: [
      'Electric vehicle (EV) charging station',
      'Airport shuttle',
      'Parking',
      'Valet parking',
    ],
  },
  {
    id: 'wifi-internet',
    title: 'WiFi and internet',
    items: ['WiFi in common areas', 'Wi-Fi'],
  },
];

const FEATURED_KEYWORDS = [
  'wi-fi',
  'wifi',
  'air conditioning',
  'ac',
  'pool',
  'parking',
  'restaurant',
  'front desk',
  'room service',
  'spa',
  'airport shuttle',
  'fitness',
];

function matchesAnyKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

export function normalizeAmenityKey(text: string): string {
  const lower = text.trim().toLowerCase();
  if (lower.includes('wi-fi') || lower.includes('wifi')) return 'wifi';
  if (lower.includes('air conditioning') || lower === 'ac') return 'ac';
  if (lower.includes('swimming pool') || lower === 'pool') return 'pool';
  if (lower === 'parking' || lower === 'valet parking' || lower.includes('parking available')) {
    return lower.includes('valet') ? 'valetparking' : 'parking';
  }
  if (lower.includes('front desk') || lower.includes('reception')) return 'front-desk';
  if (lower.includes('room service')) return 'room-service';
  if (lower.includes('restaurant')) return 'restaurant';
  if (lower.includes('airport shuttle')) return 'airport-shuttle';
  return lower.replace(/[^a-z0-9]/g, '');
}

function dedupeAmenities(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of items) {
    const trimmed = typeof raw === 'string' ? raw.trim() : '';
    if (!trimmed) continue;
    const key = normalizeAmenityKey(trimmed);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(trimmed);
    }
  }
  return result;
}

/**
 * Builds the hotel amenities structure:
 * - featuredAmenities: Top 6 large highlight amenities (Wi-Fi, AC, Pool, Parking, etc.)
 * - categorizedGroups: Full 13-category directory (Accessibility through WiFi and internet)
 */
export function buildHotelAmenitiesDisplay(rawAmenities?: string[]): HotelAmenitiesDisplay {
  const cleaned = dedupeAmenities(rawAmenities || []);

  // Build top 6 featured highlights without duplicates
  const featured: string[] = [];
  const featuredKeys = new Set<string>();

  for (const item of cleaned) {
    if (featured.length >= 6) break;
    if (matchesAnyKeyword(item, FEATURED_KEYWORDS)) {
      const key = normalizeAmenityKey(item);
      if (!featuredKeys.has(key)) {
        featured.push(item);
        featuredKeys.add(key);
      }
    }
  }

  for (const fallback of FEATURED_AMENITY_DEFAULTS) {
    if (featured.length >= 6) break;
    const key = normalizeAmenityKey(fallback);
    if (!featuredKeys.has(key)) {
      featured.push(fallback);
      featuredKeys.add(key);
    }
  }

  // Clone standard categorized groups and include any extra API items in Services/appropriate group
  const categorizedGroups: CategorizedAmenityGroup[] = STANDARD_AMENITY_CATEGORIES.map((group) => ({
    ...group,
    items: [...group.items],
  }));

  const existingNormalized = new Set<string>();
  for (const group of categorizedGroups) {
    for (const item of group.items) {
      existingNormalized.add(item.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
      existingNormalized.add(normalizeAmenityKey(item));
    }
  }

  const servicesGroup = categorizedGroups.find((g) => g.id === 'services');
  if (servicesGroup) {
    for (const rawItem of cleaned) {
      const strictKey = rawItem.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const normKey = normalizeAmenityKey(rawItem);
      if (!existingNormalized.has(strictKey) && !existingNormalized.has(normKey)) {
        servicesGroup.items.push(rawItem);
        existingNormalized.add(strictKey);
        existingNormalized.add(normKey);
      }
    }
  }

  return {
    featuredAmenities: featured.slice(0, 6),
    categorizedGroups,
  };
}
