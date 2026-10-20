export interface DiningVenue {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  rating: number;
  reviewsCount: number;
  cuisine: string;
  priceForTwoInr: number;
  priceTier: '$$$$' | '$$$$$';
  dressCode: 'Formal' | 'Smart Elegant' | 'Chic Casual' | 'Black Tie';
  coverImage: string;
  gallery: string[];
  features: string[];
  description: string;
  chefName: string;
  tableTypes: {
    id: string;
    name: string;
    description: string;
    extraFeeInr: number;
  }[];
  timeSlots: string[];
  popularDish: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'starters' | 'mains' | 'degustation' | 'cocktails' | 'desserts';
  venueId: string;
  venueName: string;
  priceInr: number;
  dietary: 'veg' | 'non-veg' | 'vegan';
  isChefSpecial?: boolean;
  image: string;
  description: string;
  prepTime: string;
  calories?: string;
}

export interface GroupPartyPackage {
  id: string;
  title: string;
  subtitle: string;
  city: string;
  venueName: string;
  minGuests: number;
  maxGuests: number;
  pricePerGuestInr: number;
  image: string;
  badge: string;
  highlights: string[];
  includes: string[];
  dressCode: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  clubName: string;
  city: string;
  date: string;
  time: string;
  musicGenre: string;
  djArtist: string;
  coverImage: string;
  vibe: string;
  passes: {
    type: 'stag-vip' | 'couple-vip' | 'elite-table';
    name: string;
    priceInr: number;
    perks: string;
    seatsLeft: number;
  }[];
}

export interface SocialPartyTable {
  id: string;
  title: string;
  venueName: string;
  city: string;
  date: string;
  time: string;
  hostName: string;
  hostBio: string;
  hostAvatar: string;
  vibeTag: string;
  totalSeats: number;
  filledSeats: number;
  costPerSeatInr: number;
  coverImage: string;
  description: string;
  attendees: {
    name: string;
    role: string;
    avatar: string;
  }[];
}

export interface SlideshowItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  venueName: string;
  city: string;
  category: 'restaurant' | 'party' | 'club' | 'food';
  image: string;
  rating: number;
  perk: string;
  ctaText: string;
  actionType: 'book-venue' | 'book-party' | 'book-club' | 'view-food';
  targetId: string;
}

export const DINING_SLIDESHOW_ITEMS: SlideshowItem[] = [
  {
    id: 'slide-aura',
    badge: 'TOP FEATURED LUXURY SKYLINE',
    title: 'Aura 48th Floor Caviar & Mixology Skyline Lounge',
    subtitle: 'Floor-to-ceiling glass edge seating overlooking the sparkling Arabian Sea & Bandra-Worli Sea Link with live saxophonist & sommelier cellar.',
    venueName: 'Aura Skyline & Mixology Lounge',
    city: 'Mumbai',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
    rating: 4.9,
    perk: 'Complimentary Moët Flutes + Arabian Sea Window Table Guarantee',
    ctaText: 'Reserve VIP Table',
    actionType: 'book-venue',
    targetId: 'aura-skyline',
  },
  {
    id: 'slide-bambolim',
    badge: 'GOA SUNSET BEACH CLUB',
    title: 'Private Sunset Beach Cabanas & Fire-Pit Seafood Barbecue',
    subtitle: 'Golden sands of Bambolim Bay, bottomless chilled champagne, live fire dancers, and butter-poached fresh rock lobster cooked on wood embers.',
    venueName: 'Bambolim Cove Beach Club & Fire Grill',
    city: 'Goa',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    rating: 4.92,
    perk: 'Private Shoreline Cabana with Dedicated Beach Butler & Bonfire',
    ctaText: 'Book Beach Cabana',
    actionType: 'book-venue',
    targetId: 'bambolim-beach-cove',
  },
  {
    id: 'slide-zafraan',
    badge: 'ROYAL AWADHI PALACE BANQUET',
    title: 'Zafraan Imperial Pavilion Under Belgian Chandeliers',
    subtitle: 'Tribute to royal Mughal manuscripts: slow-simmered brass handis, live sitar recital, and 24K pure edible gold leaf Dum Pukht biryani.',
    venueName: 'Zafraan Imperial Royal Pavilion',
    city: 'Delhi NCR',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=85',
    rating: 4.95,
    perk: 'Marble Lotus Fountain Courtyard + Handcrafted Ittar Welcome',
    ctaText: 'Reserve Royal Diwan',
    actionType: 'book-venue',
    targetId: 'zafraan-imperial',
  },
  {
    id: 'slide-onyx-club',
    badge: 'VIP NIGHTLIFE & TECHNO',
    title: 'Onyx Ultra Club Rooftop: Syndicate Melodic Saturdays',
    subtitle: 'Berlin headlining DJs, high-energy laser spectacles, queue-skip wristbands, and VIP velvet booths with premium bottle sparkler parades.',
    venueName: 'Onyx Ultra Club & Rooftop',
    city: 'Goa',
    category: 'club',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=85',
    rating: 4.98,
    perk: 'Express VIP Access Pass + Full Beverage Credit on Entry',
    ctaText: 'Get VIP Club Passes',
    actionType: 'book-club',
    targetId: 'onyx-syndicate-goa',
  },
  {
    id: 'slide-omakase',
    badge: 'MICHELIN-GRADE OMAKASE',
    title: 'Omakase Tokyo Room: Sacred Hinoki Cypress Counter',
    subtitle: 'Intimate 14-seat sanctuary with weekly Toyosu Market bluefin tuna, Miyazaki A5 Wagyu, and white binchotan charcoal flame presentation.',
    venueName: 'Omakase Tokyo Room',
    city: 'Bengaluru',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=85',
    rating: 4.88,
    perk: 'Direct Front-Row Seat with Master Chef Kenji + Sake Pairing',
    ctaText: 'Reserve Omakase Seat',
    actionType: 'book-venue',
    targetId: 'omakase-tokyo',
  },
  {
    id: 'slide-group-gala',
    badge: 'EXCLUSIVE GROUP PARTY',
    title: 'Neon Skyline Bachelorette, Birthday & Group Banquet Gala',
    subtitle: 'Exclusive private terrace takeovers, custom flare mixologist, neon photo stations, personal butler for every 8 guests, and custom 3-tier cakes.',
    venueName: 'Aura Skyline & Mixology Lounge',
    city: 'Mumbai',
    category: 'party',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85',
    rating: 4.96,
    perk: 'All-Inclusive Tapas & Caviar + Champagne Sparkler Parade',
    ctaText: 'Book Group Party',
    actionType: 'book-party',
    targetId: 'rooftop-bachelorette-bash',
  },
  {
    id: 'slide-dubai-maha',
    badge: 'DUBAI ULTRA LUXURY',
    title: 'Al-Maha Sky Palm Boardwalk & Gold-Leaf Decadence',
    subtitle: 'Palm Jumeirah boardwalk panorama with Burj Al Arab views, saffron rack of lamb, 24K gold cappuccino, and private shisha sommelier.',
    venueName: 'Al-Maha Sky Palm & Gold Lounge',
    city: 'Dubai',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    rating: 4.96,
    perk: 'Palm Edge Infinity Table + VIP Helipad Transfer Available',
    ctaText: 'Reserve Palm Edge Table',
    actionType: 'book-venue',
    targetId: 'al-maha-dubai',
  },
];

export interface AestheticHeroSlide {
  id: string;
  tag: string;
  title: string;
  location: string;
  image: string;
}

export const AESTHETIC_HERO_SLIDES: AestheticHeroSlide[] = [
  {
    id: 'cafe-bistro',
    tag: 'Aesthetic Terrace Bistro & Cafe',
    title: 'Warm Fairy-Lit Terrace Cafe & Artisan Croissants',
    location: 'Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'neon-nightlife-party',
    tag: 'High-Energy Neon Nightclub Party',
    title: 'Neon Laser EDM & VIP Table Nightclub Celebration',
    location: 'Vagator, Goa',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'rooftop-sunset-party',
    tag: 'Rooftop Sunset Party & Lounge',
    title: 'Skyline Sunset Cocktails, Fairy Lights & DJ Vibe',
    location: 'Indiranagar, Bengaluru',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'aesthetic-garden-cafe',
    tag: 'Chic Botanical Glasshouse Cafe',
    title: 'Sunlit Botanical Specialty Cafe & Brunch Garden',
    location: 'Chanakyapuri, New Delhi',
    image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'sunset-beach-party',
    tag: 'Golden Hour Beachfront Club',
    title: 'Boho Sunset Beach Club, Live Fire & Tropical Grooves',
    location: 'Anjuna Beach, Goa',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'cocktail-lounge',
    tag: 'Luxury Cocktail Bar & Mixology',
    title: 'Backlit Amber Speakeasy Bar & Jazz Night',
    location: 'Downtown, Dubai',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'cozy-artisan-cafe',
    tag: 'Artisan Espresso & Book Cafe',
    title: 'Cozy Warm Wood Cafe & Handcrafted Pastries',
    location: 'Koregaon Park, Pune',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'vip-champagne-party',
    tag: 'VIP Club & Sparkler Celebration',
    title: 'Midnight Sparkler Party, Confetti & Elite VIP Booths',
    location: 'BKC, Mumbai',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=85',
  },
];

export const DINING_CITIES = [
  'All Cities',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Goa',
  'Dubai',
  'Jaipur',
  'Kolkata',
];

export const DINING_VENUES: DiningVenue[] = [
  {
    id: 'aura-skyline',
    name: 'Aura Skyline & Mixology Lounge',
    city: 'Mumbai',
    neighborhood: 'Worli Skyline',
    rating: 4.9,
    reviewsCount: 384,
    cuisine: 'Modern European & Caviar Bar',
    priceForTwoInr: 6500,
    priceTier: '$$$$$',
    dressCode: 'Smart Elegant',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['360° Arabian Sea View', 'Private Sommelier', 'Valet Parking', 'Live Saxophonist', 'VIP Velvet Booths'],
    description: 'Suspended on the 48th floor overlooking Mumbai’s glittering coastline. Experience Michelin-inspired European gastronomy paired with rare vintage cellars and hand-carved artisanal ice cocktails.',
    chefName: 'Chef Alessandro Rossi',
    popularDish: 'Oscietra Caviar & Smoked Wagyu Carpaccio',
    tableTypes: [
      { id: 'window-sea', name: 'Arabian Sea Window Table', description: 'Floor-to-ceiling glass edge seating overlooking Bandra-Worli Sea Link.', extraFeeInr: 1000 },
      { id: 'velvet-booth', name: 'Velvet VIP Booth', description: 'Plush velvet circular booth with mood lighting & private server.', extraFeeInr: 1500 },
      { id: 'chef-counter', name: 'Chef Tasting Counter', description: 'Front-row 6-seat marble bar directly facing Chef Alessandro.', extraFeeInr: 2000 },
      { id: 'outdoor-deck', name: 'Sky Terrace Alfresco', description: 'Open-air breezy high-altitude lounge with cocktail service.', extraFeeInr: 800 },
    ],
    timeSlots: ['07:00 PM', '07:30 PM', '08:15 PM', '09:00 PM', '09:45 PM', '10:30 PM'],
  },
  {
    id: 'zafraan-imperial',
    name: 'Zafraan Imperial Royal Pavilion',
    city: 'Delhi NCR',
    neighborhood: 'Lutyens Heritage Quarter',
    rating: 4.95,
    reviewsCount: 512,
    cuisine: 'Royal Awadhi & Dum Pukht Heritage',
    priceForTwoInr: 7200,
    priceTier: '$$$$$',
    dressCode: 'Formal',
    coverImage: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Live Sitar & Sarod Recital', 'Silver Plated Dining', 'Handcrafted Ittar Welcome', 'Heritage Royal Courtyard'],
    description: 'A tribute to the lost culinary manuscripts of the Mughal Emperors and Nawabs of Awadh. Slow-simmered brass handis, pure saffron infused biryanis, and edible 24K gold foil delicacies.',
    chefName: 'Ustad Imtiaz Qureshi Lineage',
    popularDish: '24K Edible Gold Dum Biryani & Galouti Kebab',
    tableTypes: [
      { id: 'courtyard-fountain', name: 'Marble Fountain Courtyard', description: 'Dining beside illuminated marble lotus fountains under candlelit lanterns.', extraFeeInr: 1200 },
      { id: 'royal-diwan', name: 'Royal Diwan Canopy Booth', description: 'Private silk canopy with embroidered bolsters and dedicated butler.', extraFeeInr: 2500 },
      { id: 'heritage-hall', name: 'Imperial Chandelier Hall', description: 'Opulent Belgian crystal chandelier hall with classical sitar tunes.', extraFeeInr: 0 },
    ],
    timeSlots: ['07:00 PM', '07:45 PM', '08:30 PM', '09:15 PM', '10:00 PM'],
  },
  {
    id: 'omakase-tokyo',
    name: 'Omakase Tokyo Room',
    city: 'Bengaluru',
    neighborhood: 'Indiranagar Prime',
    rating: 4.88,
    reviewsCount: 290,
    cuisine: 'Authentic Japanese Omakase & Robata',
    priceForTwoInr: 8000,
    priceTier: '$$$$$',
    dressCode: 'Smart Elegant',
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Fish Flown Weekly from Toyosu', 'Master Japanese Chef', '120 Rare Sake Cellar', 'Minimalist Zen Architecture'],
    description: 'An intimate 14-seat sanctuary of haute Japanese gastronomy. Each piece of nigiri is brushed with 30-year aged tare sauce and torched with binchotan white charcoal in front of your eyes.',
    chefName: 'Master Kenji Takahashi',
    popularDish: 'Otoro Bluefin Nigiri with Black Truffle & Caviar',
    tableTypes: [
      { id: 'hinoki-counter', name: 'Sacred Hinoki Cypress Counter', description: 'Intimate counter seat directly across from Chef Kenji.', extraFeeInr: 2500 },
      { id: 'tatami-room', name: 'Private Tatami Zen Room', description: 'Shoji screened private tatami room for up to 6 guests.', extraFeeInr: 3000 },
    ],
    timeSlots: ['06:30 PM', '08:30 PM', '10:00 PM'],
  },
  {
    id: 'bambolim-beach-cove',
    name: 'Bambolim Cove Beach Club & Fire Grill',
    city: 'Goa',
    neighborhood: 'Bambolim Bay Waterfront',
    rating: 4.92,
    reviewsCount: 460,
    cuisine: 'Coastal Mediterranean & Woodfired Seafood',
    priceForTwoInr: 5800,
    priceTier: '$$$$',
    dressCode: 'Chic Casual',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Private Sunset Beach Cabanas', 'Live Acoustic & Fire Shows', 'Fresh Lobster Catch of the Day', 'Moet & Chandon Sunset Bar'],
    description: 'Where golden Goa sunsets melt into chilled champagne flutes. Enjoy wood-fired tiger prawns, charcoal grilled whole sea bass, and plush bohemian daybeds right on the soft sand.',
    chefName: 'Chef Vasco Da Cruz',
    popularDish: 'Charred Butter-Poached Rock Lobster',
    tableTypes: [
      { id: 'beach-cabana', name: 'Private Sunset Beach Cabana', description: 'White linen draped cabana on the shoreline with personal butler.', extraFeeInr: 2000 },
      { id: 'deck-lounge', name: 'Fire-Pit Wooden Deck', description: 'Elevated wooden deck overlooking waves with ambient fire-pits.', extraFeeInr: 1000 },
      { id: 'poolside-bed', name: 'Infinity Pool Daybed', description: 'Swim-up cocktail access and direct sunset panorama.', extraFeeInr: 1200 },
    ],
    timeSlots: ['05:30 PM (Sunset Slot)', '07:30 PM', '09:00 PM', '10:15 PM'],
  },
  {
    id: 'celeste-aerocity',
    name: 'Celeste Contemporary French Grill',
    city: 'Delhi NCR',
    neighborhood: 'Aerocity Luxury Enclave',
    rating: 4.87,
    reviewsCount: 320,
    cuisine: 'Haute French & Dry-Aged Steaks',
    priceForTwoInr: 6800,
    priceTier: '$$$$$',
    dressCode: 'Smart Elegant',
    coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Walk-in Glass Wine Cellar', 'In-House Dry Aging Room', 'Artisanal Bread Cart', 'Complimentary Amuse-Bouche'],
    description: 'Sophisticated Parisian flair meets modern culinary chemistry. Hand-selected Australian Angus steaks aged for 45 days, flambéed tableside with vintage cognac.',
    chefName: 'Chef Camille Laurent',
    popularDish: 'Cognac Flambéed Angus Tenderloin & Truffle Mash',
    tableTypes: [
      { id: 'wine-cellar-table', name: 'Private Cellar Table', description: 'Dine surrounded by 2,000 vintage French and Italian bottles.', extraFeeInr: 1800 },
      { id: 'main-dining', name: 'Chandeliers Main Hall', description: 'Classic marble tables with warm golden sconce lighting.', extraFeeInr: 0 },
    ],
    timeSlots: ['07:00 PM', '08:00 PM', '09:00 PM', '10:15 PM'],
  },
  {
    id: 'al-maha-dubai',
    name: 'Al-Maha Sky Palm & Gold Lounge',
    city: 'Dubai',
    neighborhood: 'Palm Jumeirah Boardwalk',
    rating: 4.96,
    reviewsCount: 640,
    cuisine: 'Royal Middle Eastern & Fusion Caviar',
    priceForTwoInr: 11500,
    priceTier: '$$$$$',
    dressCode: 'Black Tie',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Burj Al Arab Skyline View', 'Helipad Arrival Option', '24K Gold Cappuccino', 'Private Shisha Sommelier'],
    description: 'The pinnacle of Arabian luxury atop Palm Jumeirah. Feast on saffron-infused rack of lamb, pomegranate molasses glazed wagyu, and decadent Turkish delights adorned in real gold.',
    chefName: 'Chef Tariq Al-Mansoor',
    popularDish: 'Royal Gold-Leaf Lamb Shank & Truffle Hummus',
    tableTypes: [
      { id: 'palm-edge-vip', name: 'Palm Edge Infinity VIP Table', description: 'Uninterrupted view of Dubai Marina skyline & gentle sea breeze.', extraFeeInr: 3500 },
      { id: 'sultan-suite', name: 'Sultan Private Dining Room', description: 'Opulent brass-inlaid dining room with private butler & violinist.', extraFeeInr: 6000 },
    ],
    timeSlots: ['07:30 PM', '08:30 PM', '09:30 PM', '10:45 PM'],
  },
  {
    id: 'amer-citadel-jaipur',
    name: 'Amer Citadel Heritage Courtyard',
    city: 'Jaipur',
    neighborhood: 'Old City Palace Perimeter',
    rating: 4.91,
    reviewsCount: 410,
    cuisine: 'Royal Rajputana & Mewari Banquets',
    priceForTwoInr: 5500,
    priceTier: '$$$$',
    dressCode: 'Formal',
    coverImage: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Torchlit Courtyard by Lake', 'Folk Rajasthani Ghoomar', 'Silver Thali Feast', 'Elephant Torch Welcome'],
    description: 'Dine like the Maharajas of Rajasthan in an authentic 18th-century stone pavilion lit with 500 beeswax candles and fragrant rose petals.',
    chefName: 'Maharaj Raghuraj Singh',
    popularDish: 'Smoked Jungli Maas & Ker Sangri Crisp',
    tableTypes: [
      { id: 'torchlit-terrace', name: 'Torchlit Terrace Table', description: 'Overlooking the illuminated ramparts of Amer Fort.', extraFeeInr: 1000 },
      { id: 'jharokha-booth', name: 'Intricately Carved Jharokha', description: 'Private alcove with traditional handcrafted bolsters.', extraFeeInr: 1500 },
    ],
    timeSlots: ['07:00 PM', '08:00 PM', '09:15 PM'],
  },
];

export const GOURMET_MENU_ITEMS: MenuItem[] = [
  {
    id: 'caviar-blinis',
    name: 'Royal Oscietra Caviar & Buckwheat Blinis',
    category: 'starters',
    venueId: 'aura-skyline',
    venueName: 'Aura Skyline & Mixology Lounge',
    priceInr: 3800,
    dietary: 'non-veg',
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    description: '30g Royal Oscietra Sturgeon caviar served on warm buckwheat blinis, organic crème fraîche, chives, and sieved quail egg.',
    prepTime: '12 mins',
    calories: '280 kcal',
  },
  {
    id: 'truffle-burrata',
    name: 'Artisanal Truffle Burrata & Heirloom Figs',
    category: 'starters',
    venueId: 'celeste-aerocity',
    venueName: 'Celeste Contemporary French Grill',
    priceInr: 1450,
    dietary: 'veg',
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-stretched Puglia burrata injected with black summer truffle oil, roasted caramelized mission figs, aged balsamic glaze & micro arugula.',
    prepTime: '10 mins',
    calories: '390 kcal',
  },
  {
    id: 'gold-biryani',
    name: '24K Edible Gold Dum Pukht Biryani',
    category: 'mains',
    venueId: 'zafraan-imperial',
    venueName: 'Zafraan Imperial Royal Pavilion',
    priceInr: 2950,
    dietary: 'non-veg',
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    description: 'Tender baby lamb shanks slow-steamed for 8 hours in sealed earthen degs with Kashmiri saffron, topped with delicate sheets of 24K pure edible gold foil.',
    prepTime: '20 mins',
    calories: '650 kcal',
  },
  {
    id: 'lobster-thermidor',
    name: 'Butter-Poached Rock Lobster Thermidor',
    category: 'mains',
    venueId: 'bambolim-beach-cove',
    venueName: 'Bambolim Cove Beach Club',
    priceInr: 3600,
    dietary: 'non-veg',
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh Goa rock lobster braised in white wine mustard cream sauce, gratinated with Gruyère cheese, served inside lobster shell with herb butter rice.',
    prepTime: '18 mins',
    calories: '540 kcal',
  },
  {
    id: 'morel-risotto',
    name: 'Smoked Himalayan Morel & Truffle Risotto',
    category: 'mains',
    venueId: 'celeste-aerocity',
    venueName: 'Celeste Contemporary French Grill',
    priceInr: 2150,
    dietary: 'veg',
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    description: 'Acquerello carnaroli rice simmered with wild Kashmir morels, aged Parmigiano Reggiano 24 months, and shaved black Perigord truffle.',
    prepTime: '15 mins',
    calories: '480 kcal',
  },
  {
    id: 'omakase-degustation',
    name: '7-Course Master Chef Degustation Journey',
    category: 'degustation',
    venueId: 'omakase-tokyo',
    venueName: 'Omakase Tokyo Room',
    priceInr: 6500,
    dietary: 'non-veg',
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    description: 'Complete culinary voyage: Toro tartare, A5 Miyazaki Wagyu, 5-piece Toyosu Market sushi, miso marinated black cod, and matcha yuzu cloud dessert.',
    prepTime: 'Chef Sequence',
    calories: '850 kcal',
  },
  {
    id: 'smoked-cocktail',
    name: 'The Golden Alchemist Smoked Cocktail',
    category: 'cocktails',
    venueId: 'aura-skyline',
    venueName: 'Aura Skyline & Mixology Lounge',
    priceInr: 1250,
    dietary: 'veg',
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    description: 'Woodford Reserve Bourbon, 18-year Pedro Ximenez sherry, bitters, infused under a bell jar with smoking applewood & dusted with 24K gold mist.',
    prepTime: '5 mins',
    calories: '190 kcal',
  },
  {
    id: 'saffron-spritz',
    name: 'Saffron & Wild Rose Imperial Spritz',
    category: 'cocktails',
    venueId: 'al-maha-dubai',
    venueName: 'Al-Maha Sky Palm & Gold Lounge',
    priceInr: 1100,
    dietary: 'veg',
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    description: 'Prosecco Superiore, hand-harvested Persian saffron cordial, organic Damascus rose water, edible orchids, and sparkling gold shimmer.',
    prepTime: '5 mins',
    calories: '150 kcal',
  },
  {
    id: 'gold-chocolate-sphere',
    name: 'Flambéed Valrhona Gold Chocolate Sphere',
    category: 'desserts',
    venueId: 'aura-skyline',
    venueName: 'Aura Skyline & Mixology Lounge',
    priceInr: 1350,
    dietary: 'veg',
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    description: 'Dark Valrhona 70% chocolate dome dusted in gold leaf. Melted tableside with boiling caramel Grand Marnier ganache to reveal Madagascar vanilla bean gelato inside.',
    prepTime: '8 mins',
    calories: '420 kcal',
  },
  {
    id: 'pistachio-baklava',
    name: 'Pistachio Kunafa Baklava with Gold Honey',
    category: 'desserts',
    venueId: 'al-maha-dubai',
    venueName: 'Al-Maha Sky Palm & Gold Lounge',
    priceInr: 1150,
    dietary: 'veg',
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy kataifi pastry layered with imported Gaziantep pistachio paste, clotted kaymak cream, and organic acacia blossom gold honey.',
    prepTime: '8 mins',
    calories: '460 kcal',
  },
];

export const GROUP_PARTY_PACKAGES: GroupPartyPackage[] = [
  {
    id: 'royal-milestone-gala',
    title: 'The Royal Milestone Banquet Gala',
    subtitle: 'Birthdays, Anniversaries & Landmark Celebrations',
    city: 'Delhi NCR',
    venueName: 'Zafraan Imperial Royal Pavilion',
    minGuests: 15,
    maxGuests: 60,
    pricePerGuestInr: 4500,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
    badge: 'Most Booked',
    dressCode: 'Black Tie / Royal Formal',
    highlights: [
      '5-Course Imperial Awadhi & Mughlai Tasting Banquet',
      'Unlimited French Champagne & Single Malt Bar (3 Hours)',
      'Live Classical Sitar, Flute & Tabla Ensemble',
      'Personal Butler for Every 8 Guests',
      'Custom 3-Tier Gourmet Celebration Cake with Gold Foil',
    ],
    includes: [
      'Valet parking for all guests',
      'Personalized embossed menus with guest names',
      'Red carpet lantern arrival ceremony',
      'Dedicated event manager and photographer',
    ],
  },
  {
    id: 'rooftop-bachelorette-bash',
    title: 'Neon Skyline Bachelorette / Bachelor Bash',
    subtitle: 'High-Energy Pre-Wedding & Birthday VIP Lounges',
    city: 'Mumbai',
    venueName: 'Aura Skyline & Mixology Lounge',
    minGuests: 10,
    maxGuests: 35,
    pricePerGuestInr: 3900,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    badge: 'Nightlife Exclusive',
    dressCode: 'Glam Chic / Cocktail',
    highlights: [
      'Private Suspended Sea-View VIP Terrace Takeover',
      'Dedicated Flare Mixologist with Custom Welcome Cocktails',
      'Custom Neon Photo Wall & Polaroid Memory Station',
      'Unlimited Tapas, Gourmet Sliders & Caviar Spoons',
      'Complimentary Bottle of Moët & Chandon with Sparkler Parade',
    ],
    includes: [
      'Sound system setup for custom playlist or live DJ',
      'Party prop kit (sashes, sunglasses, neon glow)',
      'Guaranteed priority valet entry',
      'Dessert fireworks platter',
    ],
  },
  {
    id: 'goa-sundowner-party',
    title: 'Goa Bohemian Sundowner Beach Feast',
    subtitle: 'Private Beach Cabanas, Barbecue & Ocean Waves',
    city: 'Goa',
    venueName: 'Bambolim Cove Beach Club',
    minGuests: 15,
    maxGuests: 75,
    pricePerGuestInr: 4800,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    badge: 'Beachfront Glam',
    dressCode: 'Resort Chic / White Bohemian',
    highlights: [
      'Exclusive Waterfront Daybed & Private Beach Enclosure',
      'Woodfired Charcoal Barbecue & Fresh Lobster / Seafood Bar',
      'Bottomless Sangrias, Craft Beers & Sunset Spritz Bar',
      'Live Saxophonist & Sunset Acoustic Jam Session',
      'Bonfire & Fire Dancer Performance after dusk',
    ],
    includes: [
      'Tiki cocktail bar with coconut shell servings',
      'Boho fairy lighting & floral beach pergola',
      'Drone group photo & 4K cinematic video clip',
      'Beach volleyball & chill game zone',
    ],
  },
  {
    id: 'corporate-executive-summit',
    title: 'Elite Corporate Milestone & Board Soiree',
    subtitle: 'Private Dining Rooms, AV Presentations & Fine Wine',
    city: 'Bengaluru',
    venueName: 'Omakase Tokyo Room & Lounge',
    minGuests: 10,
    maxGuests: 40,
    pricePerGuestInr: 4200,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    badge: 'Corporate VIP',
    dressCode: 'Business Formal',
    highlights: [
      'Soundproof Private Dining Chamber with 85-inch 4K Display',
      '4-Course Sommelier-Paired Wine Dinner',
      'High-Speed Secure Wi-Fi & Conference Audio Support',
      'Corporate GST Invoicing & Dedicated Host Liaison',
      'Artisanal Coffee & Single Origin Chocolate Box for Every Guest',
    ],
    includes: [
      'Express VIP valet parking',
      'Curated dietary options (Keto, Vegan, Jain, Halal)',
      'Discreet service protocol',
    ],
  },
];

export const CLUB_EVENTS: ClubEvent[] = [
  {
    id: 'onyx-syndicate-goa',
    title: 'Syndicate Techno & Melodic Saturdays',
    clubName: 'Onyx Ultra Club & Rooftop',
    city: 'Goa',
    date: 'Saturday, 24 Oct 2026',
    time: '10:00 PM – 05:00 AM',
    musicGenre: 'Melodic Techno & Deep House',
    djArtist: 'Artemis (Berlin) & DJ DualCode',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    vibe: 'High-Energy Laser Spectacle & Ocean Breeze',
    passes: [
      {
        type: 'stag-vip',
        name: 'VIP Stag Entry',
        priceInr: 2999,
        perks: 'Express Queue Skip + ₹2,000 Full Beverage Cover',
        seatsLeft: 18,
      },
      {
        type: 'couple-vip',
        name: 'VIP Couple Pass',
        priceInr: 4499,
        perks: 'Express Queue Skip + 2 Welcome Cocktails + ₹3,500 Cover',
        seatsLeft: 12,
      },
      {
        type: 'elite-table',
        name: 'Main Stage Elite VIP Velvet Booth',
        priceInr: 28000,
        perks: 'Entry for 8 Guests + 2 Premium Bottles (Grey Goose/Black Label) + Personal Bouncer & Platter',
        seatsLeft: 3,
      },
    ],
  },
  {
    id: 'mirage-gold-mumbai',
    title: 'Gold Rush Saturday: Hip-Hop & Commercial VIP',
    clubName: 'Mirage Velvet Lounge & Ultra Bar',
    city: 'Mumbai',
    date: 'Saturday, 24 Oct 2026',
    time: '10:30 PM – 04:00 AM',
    musicGenre: 'Global Hip-Hop, Afrobeats & Club Anthems',
    djArtist: 'DJ Shaan & MC Savage',
    coverImage: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80',
    vibe: 'Celebrity Hangout with Crystal Chandeliers',
    passes: [
      {
        type: 'stag-vip',
        name: 'VIP Stag Pass',
        priceInr: 3499,
        perks: 'Priority Access + ₹2,500 Full F&B Cover',
        seatsLeft: 14,
      },
      {
        type: 'couple-vip',
        name: 'VIP Couple Pass',
        priceInr: 4999,
        perks: 'Express Access + ₹4,000 Cover + Champagne Welcome Flute',
        seatsLeft: 9,
      },
      {
        type: 'elite-table',
        name: 'DJ Adjacent Royal Velvet Cabana',
        priceInr: 35000,
        perks: 'Entry for 10 Guests + 3 Bottles + Sparkler Bottle Service + Dedicated Butler',
        seatsLeft: 2,
      },
    ],
  },
  {
    id: 'vault-speakeasy-delhi',
    title: 'Midnight Jazz & Electronic Fusion Soiree',
    clubName: 'The Vault Speakeasy & Night Lounge',
    city: 'Delhi NCR',
    date: 'Friday, 23 Oct 2026',
    time: '09:30 PM – 03:00 AM',
    musicGenre: 'Electro-Swing, Deep Groove & Saxophone Live',
    djArtist: 'Kavya Quartet & DJ Tarun',
    coverImage: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=1200&q=80',
    vibe: 'Secret Password Entry & Dark Mahogany Speakeasy',
    passes: [
      {
        type: 'stag-vip',
        name: 'Speakeasy Pass (Stag)',
        priceInr: 2499,
        perks: 'Secret Door Password + 2 Handcrafted Mixologist Cocktails',
        seatsLeft: 16,
      },
      {
        type: 'couple-vip',
        name: 'Speakeasy Pass (Couple)',
        priceInr: 3999,
        perks: 'Secret Door Password + 4 Craft Cocktails + Gourmet Tapas Board',
        seatsLeft: 11,
      },
      {
        type: 'elite-table',
        name: 'Bankers Secret Vault Room Table',
        priceInr: 22000,
        perks: 'Private Vault for 6 Guests + Japanese Single Malt Bottle + Personal Bartender',
        seatsLeft: 2,
      },
    ],
  },
];

export const SOCIAL_PARTY_TABLES: SocialPartyTable[] = [
  {
    id: 'founders-sunset-dinner',
    title: 'Entrepreneurs, Angels & Tech Founders Supper',
    venueName: 'Aura Skyline & Mixology Lounge',
    city: 'Mumbai',
    date: 'Friday, 23 Oct 2026',
    time: '08:00 PM',
    hostName: 'Vikram Malhotra',
    hostBio: 'Tech Founder & Seed Investor · Forbes 30u30',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    vibeTag: 'Networking & Ideas',
    totalSeats: 8,
    filledSeats: 6,
    costPerSeatInr: 2800,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'An intimate dinner table connecting founders, operators, and creators over fine European plates and sea views. No pitch decks, just genuine conversations and great wine.',
    attendees: [
      { name: 'Vikram M.', role: 'Host · Founder', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { name: 'Rhea S.', role: 'AI Product Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      { name: 'Aditya K.', role: 'Fintech Co-Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { name: 'Tanvi M.', role: 'Venture Partner', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
    ],
  },
  {
    id: 'truffle-wine-soiree',
    title: 'Haute Truffle & French Wine Pairing Table',
    venueName: 'Celeste Contemporary French Grill',
    city: 'Delhi NCR',
    date: 'Saturday, 24 Oct 2026',
    time: '08:30 PM',
    hostName: 'Chef Natasha Roy',
    hostBio: 'Sommelier & Gastronomy Columnist',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    vibeTag: 'Epicurean & Wine Lovers',
    totalSeats: 8,
    filledSeats: 5,
    costPerSeatInr: 3500,
    coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    description: 'Taste 4 rare reserve wines paired with white truffle risotto, dry aged beef, and French cheeses. Handpicked by certified sommelier Natasha.',
    attendees: [
      { name: 'Natasha R.', role: 'Host · Sommelier', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
      { name: 'Sameer J.', role: 'Architect & Wine Buff', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      { name: 'Priya N.', role: 'Fashion Director', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    ],
  },
  {
    id: 'goa-club-crawl-table',
    title: 'Goa Saturday Night VIP Club Crew',
    venueName: 'Onyx Ultra Club & Rooftop',
    city: 'Goa',
    date: 'Saturday, 24 Oct 2026',
    time: '10:30 PM',
    hostName: 'Aryan Verma',
    hostBio: 'Music Curator & Goa Resident',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    vibeTag: 'Party Animals & Nightlife',
    totalSeats: 12,
    filledSeats: 9,
    costPerSeatInr: 4200,
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    description: 'Skip the queues and join our shared VIP Velvet Booth right in front of the DJ stage! Includes shared premium bottle service, sparklers, and afterparty entry.',
    attendees: [
      { name: 'Aryan V.', role: 'Host · DJ Host', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
      { name: 'Zoya P.', role: 'Solo Traveller', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
      { name: 'Kunal D.', role: 'Creative Director', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
    ],
  },
  {
    id: 'solo-foodies-omakase',
    title: 'Solo Travellers Omakase Sushi & Sake Social',
    venueName: 'Omakase Tokyo Room',
    city: 'Bengaluru',
    date: 'Sunday, 25 Oct 2026',
    time: '08:30 PM',
    hostName: 'Tanya Mathur',
    hostBio: 'Culinary Travel Writer',
    hostAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    vibeTag: 'Foodie Social & Culture',
    totalSeats: 6,
    filledSeats: 4,
    costPerSeatInr: 3200,
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    description: 'Traveling solo or love sushi? Join 5 fellow epicureans at the Hinoki Cypress counter. We will taste authentic nigiri, discuss travel stories, and try warm junmai daiginjo sake.',
    attendees: [
      { name: 'Tanya M.', role: 'Host · Food Writer', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },
      { name: 'Rahul B.', role: 'Software Architect', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' },
    ],
  },
];
