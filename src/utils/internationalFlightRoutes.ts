export interface CountryCityHub {
  city: string;
  code: string;
  stationCode: string;
  country: string;
  countryIso2: string;
  airportName: string;
  popularTag: string;
  lat: number;
  lng: number;
  hubTier: 'primary' | 'major' | 'regional';
}

export interface CountryDirectoryEntry {
  country: string;
  iso2: string;
  flagEmoji: string;
  aliases: string[];
  region: string;
  hubs: CountryCityHub[];
}

export interface InternationalCityOption {
  city: string;
  code: string;
  stationCode: string;
  country: string;
  airportName: string;
  popularTag: string;
  isCountry?: boolean;
  countryIso2?: string;
  flagEmoji?: string;
}

export type CountrySearchMode =
  | 'direct'
  | 'from-country-to-city'
  | 'city-to-country'
  | 'country-to-country';

export interface InternationalCityRouteItem {
  city: InternationalCityOption;
  lowestPriceInr: number;
  perTravellerPriceInr: number;
  airlinePreview: string;
  durationPreview: string;
  durationMins: number;
  stopsLabel: string;
  isDirect: boolean;
  isCheapest: boolean;
  flightCount: number;
  distanceKm: number;
}

export const COUNTRY_DIRECTORY: CountryDirectoryEntry[] = [
  {
    country: 'India',
    iso2: 'IN',
    flagEmoji: '🇮🇳',
    aliases: ['india', 'bharat', 'hindustan', 'ind'],
    region: 'South Asia',
    hubs: [
      { city: 'New Delhi', code: 'DEL', stationCode: 'NDLS', country: 'India', countryIso2: 'IN', airportName: 'Indira Gandhi International Airport', popularTag: 'Capital Hub', lat: 28.5562, lng: 77.1, hubTier: 'primary' },
      { city: 'Mumbai', code: 'BOM', stationCode: 'CSMT', country: 'India', countryIso2: 'IN', airportName: 'Chhatrapati Shivaji Maharaj Intl', popularTag: 'Financial Hub', lat: 19.0896, lng: 72.8656, hubTier: 'primary' },
      { city: 'Bengaluru', code: 'BLR', stationCode: 'SBC', country: 'India', countryIso2: 'IN', airportName: 'Kempegowda International Airport', popularTag: 'Tech Hub', lat: 13.1986, lng: 77.7066, hubTier: 'primary' },
      { city: 'Hyderabad', code: 'HYD', stationCode: 'SC', country: 'India', countryIso2: 'IN', airportName: 'Rajiv Gandhi International Airport', popularTag: 'City of Pearls', lat: 17.2403, lng: 78.4294, hubTier: 'major' },
      { city: 'Chennai', code: 'MAA', stationCode: 'MAS', country: 'India', countryIso2: 'IN', airportName: 'Chennai International Airport', popularTag: 'Southern Gateway', lat: 12.9941, lng: 80.1709, hubTier: 'major' },
      { city: 'Kolkata', code: 'CCU', stationCode: 'HWH', country: 'India', countryIso2: 'IN', airportName: 'Netaji Subhas Chandra Bose Intl', popularTag: 'Eastern Hub', lat: 22.6547, lng: 88.4467, hubTier: 'major' },
      { city: 'Kochi', code: 'COK', stationCode: 'ERS', country: 'India', countryIso2: 'IN', airportName: 'Cochin International Airport', popularTag: 'Kerala Gateway', lat: 10.152, lng: 76.4019, hubTier: 'major' },
      { city: 'Ahmedabad', code: 'AMD', stationCode: 'ADI', country: 'India', countryIso2: 'IN', airportName: 'Sardar Vallabhbhai Patel Intl', popularTag: 'Gujarat Hub', lat: 23.0772, lng: 72.6347, hubTier: 'major' },
      { city: 'Goa', code: 'GOI', stationCode: 'MAO', country: 'India', countryIso2: 'IN', airportName: 'Dabolim / Mopa International Airport', popularTag: 'Coastal Escape', lat: 15.3808, lng: 73.8314, hubTier: 'regional' },
      { city: 'Jaipur', code: 'JAI', stationCode: 'JP', country: 'India', countryIso2: 'IN', airportName: 'Jaipur International Airport', popularTag: 'Royal Heritage', lat: 26.8242, lng: 75.8122, hubTier: 'regional' },
    ],
  },
  {
    country: 'United Arab Emirates',
    iso2: 'AE',
    flagEmoji: '🇦🇪',
    aliases: ['uae', 'united arab emirates', 'emirates'],
    region: 'Middle East',
    hubs: [
      { city: 'Dubai', code: 'DXB', stationCode: 'DXB', country: 'United Arab Emirates', countryIso2: 'AE', airportName: 'Dubai International Airport', popularTag: 'Global Megahub', lat: 25.2532, lng: 55.3657, hubTier: 'primary' },
      { city: 'Abu Dhabi', code: 'AUH', stationCode: 'AUH', country: 'United Arab Emirates', countryIso2: 'AE', airportName: 'Zayed International Airport', popularTag: 'Capital Oasis', lat: 24.433, lng: 54.6511, hubTier: 'primary' },
      { city: 'Sharjah', code: 'SHJ', stationCode: 'SHJ', country: 'United Arab Emirates', countryIso2: 'AE', airportName: 'Sharjah International Airport', popularTag: 'Cultural Emirate', lat: 25.3286, lng: 55.5172, hubTier: 'major' },
      { city: 'Ras Al Khaimah', code: 'RKT', stationCode: 'RKT', country: 'United Arab Emirates', countryIso2: 'AE', airportName: 'Ras Al Khaimah International Airport', popularTag: 'Coastal Mountains', lat: 25.6135, lng: 55.9388, hubTier: 'regional' },
    ],
  },
  {
    country: 'Japan',
    iso2: 'JP',
    flagEmoji: '🇯🇵',
    aliases: ['japan', 'jpn', 'nippon'],
    region: 'East Asia',
    hubs: [
      { city: 'Tokyo', code: 'HND', stationCode: 'TYO', country: 'Japan', countryIso2: 'JP', airportName: 'Haneda / Narita International Airport', popularTag: 'Capital Metropolis', lat: 35.5494, lng: 139.7798, hubTier: 'primary' },
      { city: 'Osaka', code: 'KIX', stationCode: 'OSA', country: 'Japan', countryIso2: 'JP', airportName: 'Kansai International Airport', popularTag: 'Kitchen of Japan', lat: 34.432, lng: 135.2304, hubTier: 'primary' },
      { city: 'Nagoya', code: 'NGO', stationCode: 'NGO', country: 'Japan', countryIso2: 'JP', airportName: 'Chubu Centrair International Airport', popularTag: 'Central Honshu', lat: 34.8584, lng: 136.8054, hubTier: 'major' },
      { city: 'Fukuoka', code: 'FUK', stationCode: 'FUK', country: 'Japan', countryIso2: 'JP', airportName: 'Fukuoka International Airport', popularTag: 'Kyushu Gateway', lat: 33.5859, lng: 130.4507, hubTier: 'major' },
      { city: 'Sapporo', code: 'CTS', stationCode: 'SPK', country: 'Japan', countryIso2: 'JP', airportName: 'New Chitose Airport', popularTag: 'Hokkaido Snow', lat: 42.7752, lng: 141.6923, hubTier: 'regional' },
    ],
  },
  {
    country: 'United Kingdom',
    iso2: 'GB',
    flagEmoji: '🇬🇧',
    aliases: ['uk', 'united kingdom', 'britain', 'great britain', 'england', 'scotland'],
    region: 'Europe',
    hubs: [
      { city: 'London', code: 'LHR', stationCode: 'KGX', country: 'United Kingdom', countryIso2: 'GB', airportName: 'London Heathrow Airport', popularTag: 'Global Capital', lat: 51.47, lng: -0.4543, hubTier: 'primary' },
      { city: 'Manchester', code: 'MAN', stationCode: 'MAN', country: 'United Kingdom', countryIso2: 'GB', airportName: 'Manchester International Airport', popularTag: 'Northern Hub', lat: 53.3537, lng: -2.275, hubTier: 'major' },
      { city: 'Birmingham', code: 'BHX', stationCode: 'BHM', country: 'United Kingdom', countryIso2: 'GB', airportName: 'Birmingham Airport', popularTag: 'Midlands Gateway', lat: 52.4539, lng: -1.748, hubTier: 'major' },
      { city: 'Edinburgh', code: 'EDI', stationCode: 'EDB', country: 'United Kingdom', countryIso2: 'GB', airportName: 'Edinburgh Airport', popularTag: 'Scottish Capital', lat: 55.95, lng: -3.3725, hubTier: 'major' },
      { city: 'Glasgow', code: 'GLA', stationCode: 'GLC', country: 'United Kingdom', countryIso2: 'GB', airportName: 'Glasgow International Airport', popularTag: 'Clyde Gateway', lat: 55.8719, lng: -4.4331, hubTier: 'regional' },
    ],
  },
  {
    country: 'France',
    iso2: 'FR',
    flagEmoji: '🇫🇷',
    aliases: ['france', 'fra'],
    region: 'Europe',
    hubs: [
      { city: 'Paris', code: 'CDG', stationCode: 'FRPNO', country: 'France', countryIso2: 'FR', airportName: 'Charles de Gaulle Airport', popularTag: 'City of Light', lat: 49.0097, lng: 2.5479, hubTier: 'primary' },
      { city: 'Nice', code: 'NCE', stationCode: 'NCE', country: 'France', countryIso2: 'FR', airportName: 'Nice Côte d’Azur Airport', popularTag: 'French Riviera', lat: 43.6584, lng: 7.2159, hubTier: 'major' },
      { city: 'Lyon', code: 'LYS', stationCode: 'LYS', country: 'France', countryIso2: 'FR', airportName: 'Lyon–Saint Exupéry Airport', popularTag: 'Gastronomy Capital', lat: 45.7256, lng: 5.0811, hubTier: 'major' },
      { city: 'Marseille', code: 'MRS', stationCode: 'MRS', country: 'France', countryIso2: 'FR', airportName: 'Marseille Provence Airport', popularTag: 'Mediterranean Port', lat: 43.4393, lng: 5.2214, hubTier: 'regional' },
      { city: 'Toulouse', code: 'TLS', stationCode: 'TLS', country: 'France', countryIso2: 'FR', airportName: 'Toulouse–Blagnac Airport', popularTag: 'Pink City', lat: 43.6291, lng: 1.3638, hubTier: 'regional' },
    ],
  },
  {
    country: 'United States',
    iso2: 'US',
    flagEmoji: '🇺🇸',
    aliases: ['usa', 'us', 'united states', 'united states of america', 'america'],
    region: 'North America',
    hubs: [
      { city: 'New York', code: 'JFK', stationCode: 'NYP', country: 'United States', countryIso2: 'US', airportName: 'John F. Kennedy International', popularTag: 'Atlantic Gateway', lat: 40.6413, lng: -73.7781, hubTier: 'primary' },
      { city: 'Newark', code: 'EWR', stationCode: 'EWR', country: 'United States', countryIso2: 'US', airportName: 'Newark Liberty International', popularTag: 'NYC Metro Hub', lat: 40.6895, lng: -74.1745, hubTier: 'primary' },
      { city: 'Chicago', code: 'ORD', stationCode: 'CHI', country: 'United States', countryIso2: 'US', airportName: 'O’Hare International Airport', popularTag: 'Midwest Hub', lat: 41.9742, lng: -87.9073, hubTier: 'primary' },
      { city: 'San Francisco', code: 'SFO', stationCode: 'SFO', country: 'United States', countryIso2: 'US', airportName: 'San Francisco International', popularTag: 'Silicon Valley Bay', lat: 37.6213, lng: -122.379, hubTier: 'primary' },
      { city: 'Los Angeles', code: 'LAX', stationCode: 'LAX', country: 'United States', countryIso2: 'US', airportName: 'Los Angeles International', popularTag: 'West Coast Hub', lat: 33.9416, lng: -118.4085, hubTier: 'primary' },
      { city: 'Washington DC', code: 'IAD', stationCode: 'WAS', country: 'United States', countryIso2: 'US', airportName: 'Washington Dulles International', popularTag: 'US Capital', lat: 38.9531, lng: -77.4565, hubTier: 'major' },
      { city: 'Boston', code: 'BOS', stationCode: 'BOS', country: 'United States', countryIso2: 'US', airportName: 'Boston Logan International', popularTag: 'New England Hub', lat: 42.3656, lng: -71.0096, hubTier: 'major' },
      { city: 'Dallas', code: 'DFW', stationCode: 'DFW', country: 'United States', countryIso2: 'US', airportName: 'Dallas/Fort Worth International', popularTag: 'Central Superhub', lat: 32.8998, lng: -97.0403, hubTier: 'major' },
      { city: 'Miami', code: 'MIA', stationCode: 'MIA', country: 'United States', countryIso2: 'US', airportName: 'Miami International Airport', popularTag: 'Sunshine Gateway', lat: 25.7959, lng: -80.287, hubTier: 'major' },
    ],
  },
  {
    country: 'Thailand',
    iso2: 'TH',
    flagEmoji: '🇹🇭',
    aliases: ['thailand', 'thai', 'siam'],
    region: 'Southeast Asia',
    hubs: [
      { city: 'Bangkok', code: 'BKK', stationCode: 'BKK', country: 'Thailand', countryIso2: 'TH', airportName: 'Suvarnabhumi International Airport', popularTag: 'Temples & Street Food', lat: 13.69, lng: 100.7501, hubTier: 'primary' },
      { city: 'Phuket', code: 'HKT', stationCode: 'HKT', country: 'Thailand', countryIso2: 'TH', airportName: 'Phuket International Airport', popularTag: 'Andaman Islands', lat: 8.1132, lng: 98.3169, hubTier: 'primary' },
      { city: 'Chiang Mai', code: 'CNX', stationCode: 'CNX', country: 'Thailand', countryIso2: 'TH', airportName: 'Chiang Mai International Airport', popularTag: 'Northern Mountains', lat: 18.7668, lng: 98.9626, hubTier: 'major' },
      { city: 'Krabi', code: 'KBV', stationCode: 'KBV', country: 'Thailand', countryIso2: 'TH', airportName: 'Krabi International Airport', popularTag: 'Limestone Cliffs', lat: 8.0991, lng: 98.9862, hubTier: 'regional' },
    ],
  },
  {
    country: 'Singapore',
    iso2: 'SG',
    flagEmoji: '🇸🇬',
    aliases: ['singapore', 'sgp'],
    region: 'Southeast Asia',
    hubs: [
      { city: 'Singapore', code: 'SIN', stationCode: 'SIN', country: 'Singapore', countryIso2: 'SG', airportName: 'Changi International Airport', popularTag: 'Garden Metropolis', lat: 1.3644, lng: 103.9915, hubTier: 'primary' },
    ],
  },
  {
    country: 'Indonesia',
    iso2: 'ID',
    flagEmoji: '🇮🇩',
    aliases: ['indonesia', 'idn'],
    region: 'Southeast Asia',
    hubs: [
      { city: 'Bali', code: 'DPS', stationCode: 'DPS', country: 'Indonesia', countryIso2: 'ID', airportName: 'Ngurah Rai International Airport', popularTag: 'Island Paradise', lat: -8.7482, lng: 115.1672, hubTier: 'primary' },
      { city: 'Jakarta', code: 'CGK', stationCode: 'CGK', country: 'Indonesia', countryIso2: 'ID', airportName: 'Soekarno–Hatta International Airport', popularTag: 'Capital Hub', lat: -6.1256, lng: 106.6558, hubTier: 'primary' },
      { city: 'Surabaya', code: 'SUB', stationCode: 'SUB', country: 'Indonesia', countryIso2: 'ID', airportName: 'Juanda International Airport', popularTag: 'East Java Gateway', lat: -7.3798, lng: 112.7868, hubTier: 'regional' },
    ],
  },
  {
    country: 'Italy',
    iso2: 'IT',
    flagEmoji: '🇮🇹',
    aliases: ['italy', 'italia'],
    region: 'Europe',
    hubs: [
      { city: 'Rome', code: 'FCO', stationCode: 'ROM', country: 'Italy', countryIso2: 'IT', airportName: 'Leonardo da Vinci–Fiumicino', popularTag: 'Eternal City', lat: 41.8003, lng: 12.2389, hubTier: 'primary' },
      { city: 'Milan', code: 'MXP', stationCode: 'MIL', country: 'Italy', countryIso2: 'IT', airportName: 'Milan Malpensa Airport', popularTag: 'Fashion & Lakes', lat: 45.6301, lng: 8.7231, hubTier: 'primary' },
      { city: 'Venice', code: 'VCE', stationCode: 'VCE', country: 'Italy', countryIso2: 'IT', airportName: 'Venice Marco Polo Airport', popularTag: 'Lagoon Canals', lat: 45.5053, lng: 12.3519, hubTier: 'major' },
      { city: 'Naples', code: 'NAP', stationCode: 'NAP', country: 'Italy', countryIso2: 'IT', airportName: 'Naples International Airport', popularTag: 'Amalfi Gateway', lat: 40.886, lng: 14.2908, hubTier: 'regional' },
      { city: 'Bologna', code: 'BLQ', stationCode: 'BLQ', country: 'Italy', countryIso2: 'IT', airportName: 'Bologna Guglielmo Marconi Airport', popularTag: 'Food & Florence', lat: 44.5354, lng: 11.2887, hubTier: 'regional' },
    ],
  },
  {
    country: 'Germany',
    iso2: 'DE',
    flagEmoji: '🇩🇪',
    aliases: ['germany', 'deutschland', 'deu'],
    region: 'Europe',
    hubs: [
      { city: 'Frankfurt', code: 'FRA', stationCode: 'FRA', country: 'Germany', countryIso2: 'DE', airportName: 'Frankfurt Airport', popularTag: 'Central European Hub', lat: 50.0379, lng: 8.5622, hubTier: 'primary' },
      { city: 'Munich', code: 'MUC', stationCode: 'MUC', country: 'Germany', countryIso2: 'DE', airportName: 'Munich International Airport', popularTag: 'Bavarian Gateway', lat: 48.3537, lng: 11.775, hubTier: 'primary' },
      { city: 'Berlin', code: 'BER', stationCode: 'BER', country: 'Germany', countryIso2: 'DE', airportName: 'Berlin Brandenburg Airport', popularTag: 'Capital & Culture', lat: 52.3667, lng: 13.5033, hubTier: 'major' },
      { city: 'Düsseldorf', code: 'DUS', stationCode: 'DUS', country: 'Germany', countryIso2: 'DE', airportName: 'Düsseldorf Airport', popularTag: 'Rhine Business Hub', lat: 51.2895, lng: 6.7668, hubTier: 'major' },
      { city: 'Hamburg', code: 'HAM', stationCode: 'HAM', country: 'Germany', countryIso2: 'DE', airportName: 'Hamburg Airport', popularTag: 'Northern Port', lat: 53.6304, lng: 9.9882, hubTier: 'regional' },
    ],
  },
  {
    country: 'Switzerland',
    iso2: 'CH',
    flagEmoji: '🇨🇭',
    aliases: ['switzerland', 'swiss', 'che'],
    region: 'Europe',
    hubs: [
      { city: 'Zurich', code: 'ZRH', stationCode: 'ZRH', country: 'Switzerland', countryIso2: 'CH', airportName: 'Zurich Airport', popularTag: 'Alps & Lakes', lat: 47.4647, lng: 8.5492, hubTier: 'primary' },
      { city: 'Geneva', code: 'GVA', stationCode: 'GVA', country: 'Switzerland', countryIso2: 'CH', airportName: 'Geneva Airport', popularTag: 'Lake Geneva', lat: 46.2381, lng: 6.1089, hubTier: 'major' },
      { city: 'Basel', code: 'BSL', stationCode: 'BSL', country: 'Switzerland', countryIso2: 'CH', airportName: 'EuroAirport Basel Mulhouse', popularTag: 'Tri-Border Hub', lat: 47.59, lng: 7.5299, hubTier: 'regional' },
    ],
  },
  {
    country: 'Australia',
    iso2: 'AU',
    flagEmoji: '🇦🇺',
    aliases: ['australia', 'aus', 'oz'],
    region: 'Oceania',
    hubs: [
      { city: 'Sydney', code: 'SYD', stationCode: 'SYD', country: 'Australia', countryIso2: 'AU', airportName: 'Sydney Kingsford Smith Airport', popularTag: 'Harbour & Opera', lat: -33.9399, lng: 151.1753, hubTier: 'primary' },
      { city: 'Melbourne', code: 'MEL', stationCode: 'MEL', country: 'Australia', countryIso2: 'AU', airportName: 'Melbourne Tullamarine Airport', popularTag: 'Coffee & Coast', lat: -37.669, lng: 144.841, hubTier: 'primary' },
      { city: 'Brisbane', code: 'BNE', stationCode: 'BNE', country: 'Australia', countryIso2: 'AU', airportName: 'Brisbane Airport', popularTag: 'Gold Coast Gateway', lat: -27.3942, lng: 153.1218, hubTier: 'major' },
      { city: 'Perth', code: 'PER', stationCode: 'PER', country: 'Australia', countryIso2: 'AU', airportName: 'Perth Airport', popularTag: 'Western Australia', lat: -31.9385, lng: 115.9672, hubTier: 'major' },
    ],
  },
  {
    country: 'Canada',
    iso2: 'CA',
    flagEmoji: '🇨🇦',
    aliases: ['canada', 'can'],
    region: 'North America',
    hubs: [
      { city: 'Toronto', code: 'YYZ', stationCode: 'YYZ', country: 'Canada', countryIso2: 'CA', airportName: 'Toronto Pearson International', popularTag: 'Eastern Hub', lat: 43.6777, lng: -79.6248, hubTier: 'primary' },
      { city: 'Vancouver', code: 'YVR', stationCode: 'YVR', country: 'Canada', countryIso2: 'CA', airportName: 'Vancouver International Airport', popularTag: 'Pacific & Rockies', lat: 49.1967, lng: -123.1815, hubTier: 'primary' },
      { city: 'Montreal', code: 'YUL', stationCode: 'YUL', country: 'Canada', countryIso2: 'CA', airportName: 'Montréal–Trudeau International', popularTag: 'French Heritage', lat: 45.4706, lng: -73.7408, hubTier: 'major' },
      { city: 'Calgary', code: 'YYC', stationCode: 'YYC', country: 'Canada', countryIso2: 'CA', airportName: 'Calgary International Airport', popularTag: 'Banff Gateway', lat: 51.1215, lng: -114.0076, hubTier: 'regional' },
    ],
  },
  {
    country: 'Spain',
    iso2: 'ES',
    flagEmoji: '🇪🇸',
    aliases: ['spain', 'espana', 'esp'],
    region: 'Europe',
    hubs: [
      { city: 'Madrid', code: 'MAD', stationCode: 'MAD', country: 'Spain', countryIso2: 'ES', airportName: 'Adolfo Suárez Madrid–Barajas', popularTag: 'Royal Capital', lat: 40.4983, lng: -3.5676, hubTier: 'primary' },
      { city: 'Barcelona', code: 'BCN', stationCode: 'BCN', country: 'Spain', countryIso2: 'ES', airportName: 'Josep Tarradellas Barcelona–El Prat', popularTag: 'Catalan Coast', lat: 41.2974, lng: 2.0833, hubTier: 'primary' },
      { city: 'Malaga', code: 'AGP', stationCode: 'AGP', country: 'Spain', countryIso2: 'ES', airportName: 'Málaga–Costa del Sol Airport', popularTag: 'Andalusia Sun', lat: 36.6749, lng: -4.4991, hubTier: 'regional' },
    ],
  },
  {
    country: 'Vietnam',
    iso2: 'VN',
    flagEmoji: '🇻🇳',
    aliases: ['vietnam', 'vnm'],
    region: 'Southeast Asia',
    hubs: [
      { city: 'Hanoi', code: 'HAN', stationCode: 'HAN', country: 'Vietnam', countryIso2: 'VN', airportName: 'Noi Bai International Airport', popularTag: 'Old Quarter & Ha Long', lat: 21.2212, lng: 105.8072, hubTier: 'primary' },
      { city: 'Ho Chi Minh City', code: 'SGN', stationCode: 'SGN', country: 'Vietnam', countryIso2: 'VN', airportName: 'Tan Son Nhat International Airport', popularTag: 'Saigon Hub', lat: 10.8188, lng: 106.6519, hubTier: 'primary' },
      { city: 'Da Nang', code: 'DAD', stationCode: 'DAD', country: 'Vietnam', countryIso2: 'VN', airportName: 'Da Nang International Airport', popularTag: 'Golden Bridge & Beaches', lat: 16.0439, lng: 108.1994, hubTier: 'major' },
    ],
  },
  {
    country: 'Malaysia',
    iso2: 'MY',
    flagEmoji: '🇲🇾',
    aliases: ['malaysia', 'mys'],
    region: 'Southeast Asia',
    hubs: [
      { city: 'Kuala Lumpur', code: 'KUL', stationCode: 'KUL', country: 'Malaysia', countryIso2: 'MY', airportName: 'Kuala Lumpur International Airport', popularTag: 'Petronas Hub', lat: 2.7456, lng: 101.7072, hubTier: 'primary' },
      { city: 'Penang', code: 'PEN', stationCode: 'PEN', country: 'Malaysia', countryIso2: 'MY', airportName: 'Penang International Airport', popularTag: 'Heritage & Food', lat: 5.2971, lng: 100.2768, hubTier: 'major' },
      { city: 'Langkawi', code: 'LGK', stationCode: 'LGK', country: 'Malaysia', countryIso2: 'MY', airportName: 'Langkawi International Airport', popularTag: 'Duty-Free Island', lat: 6.3297, lng: 99.7287, hubTier: 'regional' },
    ],
  },
  {
    country: 'South Korea',
    iso2: 'KR',
    flagEmoji: '🇰🇷',
    aliases: ['south korea', 'korea', 'kor'],
    region: 'East Asia',
    hubs: [
      { city: 'Seoul', code: 'ICN', stationCode: 'SEL', country: 'South Korea', countryIso2: 'KR', airportName: 'Incheon International Airport', popularTag: 'K-Culture & Tech', lat: 37.4602, lng: 126.4407, hubTier: 'primary' },
      { city: 'Busan', code: 'PUS', stationCode: 'PUS', country: 'South Korea', countryIso2: 'KR', airportName: 'Gimhae International Airport', popularTag: 'Coastal Harbor', lat: 35.1796, lng: 128.9382, hubTier: 'major' },
      { city: 'Jeju', code: 'CJU', stationCode: 'CJU', country: 'South Korea', countryIso2: 'KR', airportName: 'Jeju International Airport', popularTag: 'Volcanic Island', lat: 33.5113, lng: 126.493, hubTier: 'regional' },
    ],
  },
  {
    country: 'Turkey',
    iso2: 'TR',
    flagEmoji: '🇹🇷',
    aliases: ['turkey', 'turkiye', 'türkiye'],
    region: 'Eurasia',
    hubs: [
      { city: 'Istanbul', code: 'IST', stationCode: 'IST', country: 'Turkey', countryIso2: 'TR', airportName: 'Istanbul International Airport', popularTag: 'Bosphorus Bridge', lat: 41.2753, lng: 28.7519, hubTier: 'primary' },
      { city: 'Ankara', code: 'ESB', stationCode: 'ESB', country: 'Turkey', countryIso2: 'TR', airportName: 'Ankara Esenboğa Airport', popularTag: 'Capital City', lat: 40.1281, lng: 32.9951, hubTier: 'major' },
      { city: 'Antalya', code: 'AYT', stationCode: 'AYT', country: 'Turkey', countryIso2: 'TR', airportName: 'Antalya Airport', popularTag: 'Turquoise Coast', lat: 36.8987, lng: 30.8005, hubTier: 'regional' },
    ],
  },
  {
    country: 'Netherlands',
    iso2: 'NL',
    flagEmoji: '🇳🇱',
    aliases: ['netherlands', 'holland', 'nld'],
    region: 'Europe',
    hubs: [
      { city: 'Amsterdam', code: 'AMS', stationCode: 'AMS', country: 'Netherlands', countryIso2: 'NL', airportName: 'Amsterdam Airport Schiphol', popularTag: 'Canals & Europe Hub', lat: 52.3105, lng: 4.7683, hubTier: 'primary' },
      { city: 'Eindhoven', code: 'EIN', stationCode: 'EIN', country: 'Netherlands', countryIso2: 'NL', airportName: 'Eindhoven Airport', popularTag: 'Design & Tech', lat: 51.4501, lng: 5.3745, hubTier: 'regional' },
    ],
  },
  {
    country: 'Qatar',
    iso2: 'QA',
    flagEmoji: '🇶🇦',
    aliases: ['qatar', 'qat'],
    region: 'Middle East',
    hubs: [
      { city: 'Doha', code: 'DOH', stationCode: 'DOH', country: 'Qatar', countryIso2: 'QA', airportName: 'Hamad International Airport', popularTag: '5-Star Hub', lat: 25.2731, lng: 51.6081, hubTier: 'primary' },
    ],
  },
  {
    country: 'Saudi Arabia',
    iso2: 'SA',
    flagEmoji: '🇸🇦',
    aliases: ['saudi arabia', 'saudi', 'ksa'],
    region: 'Middle East',
    hubs: [
      { city: 'Riyadh', code: 'RUH', stationCode: 'RUH', country: 'Saudi Arabia', countryIso2: 'SA', airportName: 'King Khalid International Airport', popularTag: 'Capital Hub', lat: 24.9576, lng: 46.6988, hubTier: 'primary' },
      { city: 'Jeddah', code: 'JED', stationCode: 'JED', country: 'Saudi Arabia', countryIso2: 'SA', airportName: 'King Abdulaziz International Airport', popularTag: 'Red Sea Gateway', lat: 21.6796, lng: 39.1565, hubTier: 'primary' },
      { city: 'Dammam', code: 'DMM', stationCode: 'DMM', country: 'Saudi Arabia', countryIso2: 'SA', airportName: 'King Fahd International Airport', popularTag: 'Eastern Province', lat: 26.4712, lng: 49.7979, hubTier: 'major' },
    ],
  },
  {
    country: 'Maldives',
    iso2: 'MV',
    flagEmoji: '🇲🇻',
    aliases: ['maldives', 'mdv'],
    region: 'South Asia',
    hubs: [
      { city: 'Malé', code: 'MLE', stationCode: 'MLE', country: 'Maldives', countryIso2: 'MV', airportName: 'Velana International Airport', popularTag: 'Overwater Luxury', lat: 4.1918, lng: 73.5291, hubTier: 'primary' },
      { city: 'Gan Island', code: 'GAN', stationCode: 'GAN', country: 'Maldives', countryIso2: 'MV', airportName: 'Gan International Airport', popularTag: 'Southern Atolls', lat: -0.6933, lng: 73.1556, hubTier: 'regional' },
    ],
  },
  {
    country: 'Sri Lanka',
    iso2: 'LK',
    flagEmoji: '🇱🇰',
    aliases: ['sri lanka', 'lanka', 'lka'],
    region: 'South Asia',
    hubs: [
      { city: 'Colombo', code: 'CMB', stationCode: 'CMB', country: 'Sri Lanka', countryIso2: 'LK', airportName: 'Bandaranaike International Airport', popularTag: 'Island Capital', lat: 7.1808, lng: 79.8841, hubTier: 'primary' },
      { city: 'Hambantota', code: 'HRI', stationCode: 'HRI', country: 'Sri Lanka', countryIso2: 'LK', airportName: 'Mattala Rajapaksa International', popularTag: 'Southern Wildlife', lat: 6.2845, lng: 81.1241, hubTier: 'regional' },
    ],
  },
  {
    country: 'Nepal',
    iso2: 'NP',
    flagEmoji: '🇳🇵',
    aliases: ['nepal', 'npl'],
    region: 'South Asia',
    hubs: [
      { city: 'Kathmandu', code: 'KTM', stationCode: 'KTM', country: 'Nepal', countryIso2: 'NP', airportName: 'Tribhuvan International Airport', popularTag: 'Himalayan Gateway', lat: 27.6966, lng: 85.3591, hubTier: 'primary' },
      { city: 'Pokhara', code: 'PKR', stationCode: 'PKR', country: 'Nepal', countryIso2: 'NP', airportName: 'Pokhara International Airport', popularTag: 'Annapurna Lakes', lat: 28.1904, lng: 84.0155, hubTier: 'major' },
    ],
  },
  {
    country: 'Egypt',
    iso2: 'EG',
    flagEmoji: '🇪🇬',
    aliases: ['egypt', 'egy'],
    region: 'Africa',
    hubs: [
      { city: 'Cairo', code: 'CAI', stationCode: 'CAI', country: 'Egypt', countryIso2: 'EG', airportName: 'Cairo International Airport', popularTag: 'Pyramids & Nile', lat: 30.1219, lng: 31.4056, hubTier: 'primary' },
      { city: 'Hurghada', code: 'HRG', stationCode: 'HRG', country: 'Egypt', countryIso2: 'EG', airportName: 'Hurghada International Airport', popularTag: 'Red Sea Diving', lat: 27.1783, lng: 33.7994, hubTier: 'regional' },
    ],
  },
];

// Fast lookup maps
const HUB_BY_IATA = new Map<string, CountryCityHub>();
const COUNTRY_BY_NAME_OR_ALIAS = new Map<string, CountryDirectoryEntry>();

for (const entry of COUNTRY_DIRECTORY) {
  COUNTRY_BY_NAME_OR_ALIAS.set(entry.country.toLowerCase(), entry);
  COUNTRY_BY_NAME_OR_ALIAS.set(entry.iso2.toLowerCase(), entry);
  for (const alias of entry.aliases) {
    COUNTRY_BY_NAME_OR_ALIAS.set(alias.toLowerCase(), entry);
  }
  for (const hub of entry.hubs) {
    HUB_BY_IATA.set(hub.code.toUpperCase(), hub);
  }
}

export function isCountryOption(option?: Partial<InternationalCityOption> | null): boolean {
  return Boolean(option?.isCountry);
}

export function toCountryCityOption(entry: CountryDirectoryEntry): InternationalCityOption {
  return {
    city: entry.country,
    code: entry.iso2,
    stationCode: entry.iso2,
    country: entry.country,
    airportName: `All International Cities in ${entry.country} (${entry.hubs.length} hubs)`,
    popularTag: `${entry.hubs.length} ${entry.hubs.length === 1 ? 'city' : 'cities'} · Compare fares`,
    isCountry: true,
    countryIso2: entry.iso2,
    flagEmoji: entry.flagEmoji,
  };
}

export function getDisplayLocationCode(
  option?: Partial<InternationalCityOption> | null
): string {
  if (!option) return '';
  if (option.isCountry) {
    if (option.countryIso2) return option.countryIso2.toUpperCase();
    const resolved = resolveCountryEntry(option.country || option.city);
    if (resolved) return resolved.iso2.toUpperCase();
  }
  return (option.code || '').toUpperCase();
}

export function hasCityOptionChanged(
  a?: Partial<InternationalCityOption> | null,
  b?: Partial<InternationalCityOption> | null
): boolean {
  if (!a || !b) return a !== b;
  return (
    (a.code || '') !== (b.code || '') ||
    (a.city || '') !== (b.city || '') ||
    Boolean(a.isCountry) !== Boolean(b.isCountry)
  );
}

export function resolveCountryEntry(nameOrIso?: string): CountryDirectoryEntry | null {
  if (!nameOrIso) return null;
  const key = nameOrIso.trim().toLowerCase();
  if (!key) return null;

  const exact = COUNTRY_BY_NAME_OR_ALIAS.get(key);
  if (exact) return exact;

  // Partial match for multi-word country names
  return (
    COUNTRY_DIRECTORY.find(
      (entry) =>
        entry.country.toLowerCase() === key ||
        entry.country.toLowerCase().includes(key) ||
        entry.aliases.some((a) => a === key)
    ) || null
  );
}

export function findMatchingCountries(query: string, limit = 5): InternationalCityOption[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [];
  }

  const scored: { entry: CountryDirectoryEntry; score: number }[] = [];

  for (const entry of COUNTRY_DIRECTORY) {
    const cLower = entry.country.toLowerCase();
    const isoLower = entry.iso2.toLowerCase();
    if (cLower === q || isoLower === q || entry.aliases.some((a) => a === q)) {
      scored.push({ entry, score: 100 });
    } else if (cLower.startsWith(q) || entry.aliases.some((a) => a.startsWith(q))) {
      scored.push({ entry, score: 75 });
    } else if (cLower.includes(q) || entry.aliases.some((a) => a.includes(q))) {
      scored.push({ entry, score: 50 });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.entry.country.localeCompare(b.entry.country));
  return scored.slice(0, limit).map((item) => toCountryCityOption(item.entry));
}

export function getPopularCountryOptions(): InternationalCityOption[] {
  const preferredIsos = ['IN', 'AE', 'JP', 'GB', 'FR', 'US', 'TH', 'SG', 'IT', 'CH', 'AU', 'CA'];
  return preferredIsos
    .map((iso) => COUNTRY_DIRECTORY.find((e) => e.iso2 === iso))
    .filter((e): e is CountryDirectoryEntry => Boolean(e))
    .map(toCountryCityOption);
}

export function detectCountrySearchMode(
  fromCity: InternationalCityOption,
  toCity: InternationalCityOption
): CountrySearchMode {
  const fromIsCountry = isCountryOption(fromCity);
  const toIsCountry = isCountryOption(toCity);

  if (fromIsCountry && toIsCountry) return 'country-to-country';
  if (fromIsCountry && !toIsCountry) return 'from-country-to-city';
  if (!fromIsCountry && toIsCountry) return 'city-to-country';
  return 'direct';
}

export function getCountryNameForOption(option: InternationalCityOption): string {
  if (option.isCountry) return option.country || option.city;
  if (option.country && option.country !== 'Worldwide') return option.country;
  const hub = HUB_BY_IATA.get((option.code || '').toUpperCase());
  return hub?.country || option.country || '';
}

export function isSameCountryPair(
  fromCity: InternationalCityOption,
  toCity: InternationalCityOption
): boolean {
  const fromC = getCountryNameForOption(fromCity).toLowerCase();
  const toC = getCountryNameForOption(toCity).toLowerCase();
  return Boolean(fromC && toC && fromC === toC);
}

export function getCitiesForCountry(countryNameOrIso: string): InternationalCityOption[] {
  const entry = resolveCountryEntry(countryNameOrIso);
  if (!entry) return [];
  return entry.hubs.map((hub) => ({
    city: hub.city,
    code: hub.code,
    stationCode: hub.stationCode,
    country: hub.country,
    airportName: hub.airportName,
    popularTag: hub.popularTag,
    countryIso2: hub.countryIso2,
    flagEmoji: entry.flagEmoji,
    isCountry: false,
  }));
}

export function isInternationalAirportCode(iata: string): boolean {
  const hub = HUB_BY_IATA.get((iata || '').trim().toUpperCase());
  if (hub) {
    return hub.countryIso2 !== 'IN';
  }
  const extraIntl = ['LHR', 'JFK', 'DXB', 'SIN', 'DPS', 'BKK', 'HND', 'NRT', 'FRA', 'CDG', 'KIX', 'ZRH', 'FCO', 'SYD', 'YYZ', 'LAX', 'SFO', 'ICN', 'KUL', 'IST', 'DOH', 'MLE', 'HAN', 'SGN'];
  return extraIntl.includes((iata || '').trim().toUpperCase());
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function getCoordinatesForCity(optionOrIata: string | InternationalCityOption): {
  lat: number;
  lng: number;
  hubTier: 'primary' | 'major' | 'regional';
  countryIso2: string;
} {
  const iata = typeof optionOrIata === 'string' ? optionOrIata.toUpperCase() : (optionOrIata.code || '').toUpperCase();
  const hub = HUB_BY_IATA.get(iata);
  if (hub) {
    return { lat: hub.lat, lng: hub.lng, hubTier: hub.hubTier, countryIso2: hub.countryIso2 };
  }

  if (typeof optionOrIata !== 'string' && optionOrIata.country) {
    const entry = resolveCountryEntry(optionOrIata.country);
    if (entry && entry.hubs.length > 0) {
      const h = entry.hubs[0];
      return { lat: h.lat, lng: h.lng, hubTier: 'major', countryIso2: entry.iso2 };
    }
  }

  // Fallback international hub coordinates
  return { lat: 25.2532, lng: 55.3657, hubTier: 'major', countryIso2: 'XX' };
}

export function getCabinMultiplier(cabinClass: string = 'Economy'): number {
  switch (cabinClass) {
    case 'Premium Eco':
      return 1.45;
    case 'Business':
      return 2.4;
    case 'First Class':
      return 3.5;
    default:
      return 1;
  }
}

function pickRouteAirlineAndStops(
  depIso: string,
  arrIso: string,
  depTier: 'primary' | 'major' | 'regional',
  arrTier: 'primary' | 'major' | 'regional',
  distanceKm: number
): { airline: string; isDirect: boolean; stopsLabel: string } {
  const isDirect =
    (depTier === 'primary' && arrTier === 'primary' && distanceKm <= 10500) ||
    (depTier !== 'regional' && arrTier !== 'regional' && distanceKm <= 6500) ||
    distanceKm <= 3800;

  let airline = 'Air India';
  if (depIso === 'AE' || arrIso === 'AE') airline = isDirect ? 'Emirates' : 'Etihad Airways';
  else if (depIso === 'QA' || arrIso === 'QA') airline = 'Qatar Airways';
  else if (depIso === 'SG' || arrIso === 'SG') airline = 'Singapore Airlines';
  else if (depIso === 'JP' || arrIso === 'JP') airline = isDirect ? 'ANA / Air India' : 'Singapore Airlines';
  else if (depIso === 'GB' || arrIso === 'GB') airline = isDirect ? 'British Airways' : 'Lufthansa';
  else if (depIso === 'FR' || arrIso === 'FR') airline = isDirect ? 'Air France' : 'Lufthansa';
  else if (depIso === 'DE' || arrIso === 'DE') airline = 'Lufthansa';
  else if (depIso === 'CH' || arrIso === 'CH') airline = isDirect ? 'SWISS' : 'Lufthansa';
  else if (depIso === 'US' || arrIso === 'US') airline = isDirect ? 'Air India / United' : 'Delta Air Lines';
  else if (depIso === 'TH' || arrIso === 'TH') airline = isDirect ? 'Thai Airways / IndiGo' : 'Malaysia Airlines';
  else if (depIso === 'AU' || arrIso === 'AU') airline = isDirect ? 'Qantas / Air India' : 'Singapore Airlines';
  else if (depIso === 'CA' || arrIso === 'CA') airline = isDirect ? 'Air Canada' : 'British Airways';
  else if (depIso === 'TR' || arrIso === 'TR') airline = 'Turkish Airlines';
  else if (depIso === 'NL' || arrIso === 'NL') airline = 'KLM';
  else if (depIso === 'KR' || arrIso === 'KR') airline = isDirect ? 'Korean Air' : 'Singapore Airlines';
  else if (depIso === 'MY' || arrIso === 'MY') airline = 'Malaysia Airlines';

  return {
    airline,
    isDirect,
    stopsLabel: isDirect ? 'Direct' : '1 stop',
  };
}

export function getRouteFlightEstimate(
  fromCityOrIata: string | InternationalCityOption,
  toCityOrIata: string | InternationalCityOption
): {
  baseFareInr: number;
  durationMins: number;
  duration: string;
  distanceKm: number;
  isDirect: boolean;
  stopsLabel: string;
  airline: string;
} {
  const fromCoords = getCoordinatesForCity(fromCityOrIata);
  const toCoords = getCoordinatesForCity(toCityOrIata);

  const fromCode = typeof fromCityOrIata === 'string' ? fromCityOrIata.toUpperCase() : (fromCityOrIata.code || '').toUpperCase();
  const toCode = typeof toCityOrIata === 'string' ? toCityOrIata.toUpperCase() : (toCityOrIata.code || '').toUpperCase();

  const distanceKm = fromCode === toCode ? 450 : Math.max(450, haversineKm(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng));
  const isSameCountry = fromCoords.countryIso2 === toCoords.countryIso2 && fromCoords.countryIso2 !== 'XX';

  // Realistic base fare formula (one-way Economy INR)
  let baseFareInr: number;
  if (isSameCountry) {
    baseFareInr = Math.round((3100 + distanceKm * 2.1) / 10) * 10;
  } else {
    // International pricing curve: short-haul intl (~₹11k-18k), medium (~₹22k-38k), long-haul (~₹42k-68k)
    const raw = 6800 + distanceKm * 4.35;
    const tierOffset =
      (fromCoords.hubTier === 'primary' ? 0 : fromCoords.hubTier === 'major' ? 1450 : 2850) +
      (toCoords.hubTier === 'primary' ? 0 : toCoords.hubTier === 'major' ? 1350 : 2650);

    // Small deterministic hash offset per city pair so every city has distinct competitive pricing
    const pairHash = ((fromCode.charCodeAt(0) || 65) * 31 + (toCode.charCodeAt(0) || 65) * 17 + (fromCode.charCodeAt(1) || 65) * 7 + (toCode.charCodeAt(2) || 65) * 13) % 1800;
    baseFareInr = Math.round((raw + tierOffset + pairHash) / 50) * 50;
  }

  const { airline, isDirect, stopsLabel } = pickRouteAirlineAndStops(
    fromCoords.countryIso2,
    toCoords.countryIso2,
    fromCoords.hubTier,
    toCoords.hubTier,
    distanceKm
  );

  // Flight duration: ~810 km/h cruise + 45m taxi/climb + layover if 1-stop
  const flyingMins = Math.round((distanceKm / 810) * 60 + 45);
  const durationMins = isDirect ? flyingMins : flyingMins + 115;
  const h = Math.floor(durationMins / 60);
  const m = durationMins % 60;
  const duration = `${h}h ${String(m).padStart(2, '0')}m`;

  return {
    baseFareInr,
    durationMins,
    duration,
    distanceKm,
    isDirect,
    stopsLabel,
    airline,
  };
}

export function estimateInternationalRouteFareInr(depIata: string, arrIata: string): number {
  return getRouteFlightEstimate(depIata, arrIata).baseFareInr;
}

export interface GetInternationalCityRoutesParams {
  targetCountry: string;
  direction: 'departure-cities' | 'arrival-cities';
  counterpartCity?: InternationalCityOption;
  counterpartCountry?: string;
  tripType?: 'one-way' | 'round-trip' | 'dummy-flights';
  travellers?: number;
  cabinClass?: string;
}

export function getInternationalCityRoutes({
  targetCountry,
  direction,
  counterpartCity,
  counterpartCountry,
  tripType = 'one-way',
  travellers = 1,
  cabinClass = 'Economy',
}: GetInternationalCityRoutesParams): InternationalCityRouteItem[] {
  const cities = getCitiesForCountry(targetCountry);
  if (cities.length === 0) return [];

  // Determine counterpart city to price against:
  // If counterpart is a specific city, price directly against that city.
  // If counterpart is another country (Step 1 of Country -> Country), price against that destination country's primary/cheapest gateway hub!
  let counterpartRef: InternationalCityOption | undefined = counterpartCity;
  if (!counterpartRef && counterpartCountry) {
    const destCities = getCitiesForCountry(counterpartCountry);
    counterpartRef = destCities[0];
  }
  if (!counterpartRef) return [];

  const cabinMult = getCabinMultiplier(cabinClass);
  const roundTripMult = tripType === 'round-trip' ? 1.88 : 1;
  const safeTravellers = Math.max(1, travellers);

  const items: InternationalCityRouteItem[] = cities
    .filter((c) => c.code.toUpperCase() !== counterpartRef!.code.toUpperCase())
    .map((city) => {
      const fromOpt = direction === 'departure-cities' ? city : counterpartRef!;
      const toOpt = direction === 'departure-cities' ? counterpartRef! : city;

      const estimate = getRouteFlightEstimate(fromOpt, toOpt);
      // Scale base fare by ~0.85 to match the cheapest carrier multiplier (Akasa/Emirates/Best Fare) on the Flight Results page
      const cheapestCarrierFareInr = Math.round((estimate.baseFareInr * 0.85) / 10) * 10;
      const perTravellerPriceInr = Math.round(cheapestCarrierFareInr * cabinMult * roundTripMult);
      const lowestPriceInr = perTravellerPriceInr * safeTravellers;

      return {
        city,
        lowestPriceInr,
        perTravellerPriceInr,
        airlinePreview: estimate.airline,
        durationPreview: estimate.duration,
        durationMins: estimate.durationMins,
        stopsLabel: estimate.stopsLabel,
        isDirect: estimate.isDirect,
        isCheapest: false,
        flightCount: estimate.isDirect ? 8 : 5,
        distanceKm: estimate.distanceKm,
      };
    });

  // Sort cheapest first
  items.sort((a, b) => a.lowestPriceInr - b.lowestPriceInr || a.durationMins - b.durationMins);

  if (items.length > 0) {
    items[0].isCheapest = true;
  }

  return items;
}

export type StopsFilterValue = 'all' | 'direct' | 'one-plus';

export const MIN_BUDGET_SLIDER_INR = 0;
export const MAX_BUDGET_SLIDER_INR = 100000;
export const BUDGET_SLIDER_STEP_INR = 1000;

export interface BudgetCategoryOption {
  id: string;
  minPriceInr: number;
  maxPriceInr: number;
}

export const BUDGET_CATEGORY_OPTIONS: ReadonlyArray<BudgetCategoryOption> = [
  { id: 'all', minPriceInr: 0, maxPriceInr: 100000 },
  { id: 'under-25k', minPriceInr: 0, maxPriceInr: 25000 },
  { id: '25k-45k', minPriceInr: 25000, maxPriceInr: 45000 },
  { id: '45k-70k', minPriceInr: 45000, maxPriceInr: 70000 },
  { id: '70k-100k', minPriceInr: 70000, maxPriceInr: 100000 },
];

export const STOPS_FILTER_OPTIONS: ReadonlyArray<{
  value: StopsFilterValue;
  label: string;
}> = [
  { value: 'all', label: 'Any stops' },
  { value: 'direct', label: 'Direct' },
  { value: 'one-plus', label: '1+ stops' },
];

export interface BudgetThreshold {
  id: string;
  maxPriceInr: number | null;
}

export function getBudgetThresholdsForRoutes(
  routes: InternationalCityRouteItem[]
): BudgetThreshold[] {
  const brackets: BudgetThreshold[] = [{ id: 'all', maxPriceInr: null }];
  if (routes.length === 0) return brackets;

  const prices = routes.map((r) => r.lowestPriceInr).sort((a, b) => a - b);
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];

  const stepUnit = maxPrice - minPrice < 4000 ? 500 : 1000;
  const roundUp = (val: number) => Math.ceil(val / stepUnit) * stepUnit;

  const candidateMultipliers = [0.25, 0.55, 0.85];
  const seen = new Set<number>();

  for (const pct of candidateMultipliers) {
    const raw = minPrice + (maxPrice - minPrice) * pct;
    const rounded = roundUp(raw);
    if (rounded >= minPrice && rounded < maxPrice && !seen.has(rounded)) {
      if (routes.some((r) => r.lowestPriceInr <= rounded)) {
        seen.add(rounded);
        brackets.push({ id: `under-${rounded}`, maxPriceInr: rounded });
      }
    }
  }

  const maxRounded = roundUp(maxPrice);
  if (!seen.has(maxRounded) && brackets.length === 1) {
    brackets.push({ id: `under-${maxRounded}`, maxPriceInr: maxRounded });
  }

  return brackets;
}

export function filterInternationalCityRoutes(
  routes: InternationalCityRouteItem[],
  options: {
    minBudgetInr?: number;
    maxBudgetInr: number | null;
    stopsFilter: StopsFilterValue;
  }
): InternationalCityRouteItem[] {
  const { minBudgetInr = 0, maxBudgetInr, stopsFilter } = options;
  return routes.filter((item) => {
    if (minBudgetInr > 0 && item.lowestPriceInr < minBudgetInr) {
      return false;
    }
    if (maxBudgetInr !== null && item.lowestPriceInr > maxBudgetInr) {
      return false;
    }
    if (stopsFilter === 'direct' && !item.isDirect) {
      return false;
    }
    if (stopsFilter === 'one-plus' && item.isDirect) {
      return false;
    }
    return true;
  });
}

