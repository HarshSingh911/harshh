import { ASSETS } from './travelData';

export interface DayWisePlan {
  dayNumber: number;
  dayLabel: string; // e.g. "Day 1"
  title: string;
  subtitle?: string;
  description: string;
  transfers: {
    title: string;
    description: string;
    type: 'flight' | 'cab' | 'ferry' | 'shuttle';
    included: boolean;
  };
  stay: {
    hotelName: string;
    roomType: string;
    starCategory: string;
    notes?: string;
    included: boolean;
  };
  food: {
    mealPlan: string; // e.g. "Breakfast & Dinner"
    description: string;
    included: boolean;
  };
  activities: string[];
}

export interface HolidayPackageDetails {
  id: string;
  title: string;
  destination: string;
  city: string;
  stateOrCountry: string;
  durationNightsCount: number;
  durationDaysCount: number;
  durationLabel: string; // "4 Nights / 5 Days"
  theme: 'Beach' | 'Honeymoon' | 'Luxury' | 'Adventure' | 'Culture' | 'Family';
  hotelCategory: '3★' | '4★' | '5★';
  hotelStars: number;
  rating: number;
  reviewsCount: number;
  startingPricePerPersonInr: number;
  originalPriceInr: number;
  flightsIncluded: boolean;
  galleryImages: string[];
  heroImage: string;
  highlights: string[];
  transfersOverview: {
    title: string;
    description: string;
    icon: string;
  }[];
  stayOverview: {
    hotelName: string;
    starRating: number;
    roomType: string;
    location: string;
    checkIn: string;
    checkOut: string;
    amenities: string[];
    perks: string[];
    image: string;
  };
  foodOverview: {
    title: string;
    badge: string;
    description: string;
    mealItems: string[];
  };
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: {
    refundablePercentage: number;
    noticeHours: number;
    terms: { timeframe: string; refund: string; note: string }[];
  };
  importantPolicies: string[];
  itinerary: DayWisePlan[];
}

export const HOLIDAY_PACKAGES_DATA: HolidayPackageDetails[] = [
  {
    id: 'HOL-GOA-5D',
    title: '4N/5D Goa Coastal Bliss & Luxury 5★ Beachfront Resort Escape',
    destination: 'Goa, India',
    city: 'Goa',
    stateOrCountry: 'India',
    durationNightsCount: 4,
    durationDaysCount: 5,
    durationLabel: '4 Nights / 5 Days',
    theme: 'Beach',
    hotelCategory: '5★',
    hotelStars: 5,
    rating: 4.92,
    reviewsCount: 684,
    startingPricePerPersonInr: 24999,
    originalPriceInr: 36000,
    flightsIncluded: true,
    heroImage: ASSETS.goa || ASSETS.paris,
    galleryImages: [
      ASSETS.goa || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: [
      '5★ Beachfront Resort with private beach access & infinity pool',
      'Return Flights included with 15kg check-in & 7kg cabin baggage',
      'Dedicated AC chauffeur sedan for all airport and sightseeing transfers',
      'Daily lavish buffet breakfast & 4-course chef dinner',
      'Mandovi River Luxury Catamaran Sunset Cruise with live Goan music',
      'Old Goa UNESCO Churches & historic Fort Aguada guided tour',
    ],
    transfersOverview: [
      {
        title: 'Airport Chauffeur Pick & Drop',
        description: 'Private AC Sedan pickup from Dabolim / Mopa International Airport directly to resort doorstep and return drop.',
        icon: 'Car',
      },
      {
        title: 'Sightseeing AC Vehicle',
        description: 'Dedicated air-conditioned car for North & South Goa excursions with professional English/Hindi speaking driver.',
        icon: 'Navigation',
      },
      {
        title: 'Sunset Catamaran Boat Ride',
        description: 'Pre-reserved VIP seats for Mandovi river luxury sunset catamaran cruise.',
        icon: 'Ship',
      },
    ],
    stayOverview: {
      hotelName: 'The Grand Azure Beachfront 5★ Resort & Spa',
      starRating: 5,
      roomType: 'Deluxe Sea-Facing Balcony Suite',
      location: 'Calangute - Candolim Promenade, North Goa',
      checkIn: '02:00 PM',
      checkOut: '11:00 AM',
      amenities: [
        'Private Beach Access',
        'Multi-Tier Infinity Pool',
        'Ayurvedic Luxury Spa',
        '24/7 Room Service',
        'High-Speed Wi-Fi',
        'Fitness Gym',
      ],
      perks: [
        'Welcome tropical mocktail on arrival',
        'Complimentary 15% discount on spa massages',
        'Complimentary high-tea served at sunset deck',
      ],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    },
    foodOverview: {
      title: 'Modified American Plan (MAP)',
      badge: 'Daily Breakfast + Daily Dinner Included',
      description: 'Start your mornings with an extensive live international buffet and unwind each evening with a curated 4-course chef dinner.',
      mealItems: [
        'Daily lavish morning buffet (Indian, Continental, Live Dosa & Egg stations, fresh tropical juices)',
        'Daily 4-course multicuisine dinner at beachfront restaurant',
        '1 Candlelight romantic beach dinner with complimentary house wine or mocktails',
        '100% Pure vegetarian, Jain and Halal meal options available on request',
      ],
    },
    inclusions: [
      'Return flight tickets (Ex-Delhi/Mumbai/Bengaluru to Goa with 15kg check-in baggage)',
      '4 Nights stay in 5★ Deluxe Sea-Facing Suite at Grand Azure Beachfront Resort',
      'Daily buffet breakfast & daily 4-course dinner for all guests',
      'Private AC Cab for airport pickup, drop, and complete sightseeing itinerary',
      'Mandovi River Sunset Catamaran Cruise tickets',
      'Fort Aguada, Chapora Fort, and Old Goa guided heritage walk',
      'All toll taxes, parking fees, fuel charges, and driver allowances',
      'All applicable GST & luxury hotel taxes included',
    ],
    exclusions: [
      'Personal expenses, laundry, minibar consumption and telephone calls',
      'Water sports rides (jet ski, parasailing, banana rides) at Baga beach',
      'Monument entry tickets or camera fees not specified in itinerary',
      'Any extra meals or beverages ordered à la carte outside the meal plan',
      'Travel insurance (can be added optionally at checkout)',
    ],
    cancellationPolicy: {
      refundablePercentage: 100,
      noticeHours: 72,
      terms: [
        { timeframe: '> 7 Days Before Departure', refund: '100% Full Refund', note: 'Zero cancellation penalty' },
        { timeframe: '3 to 7 Days Before Departure', refund: '70% Refund', note: 'Standard airline & hotel retention' },
        { timeframe: '< 72 Hours Before Departure', refund: 'Reschedule Only', note: 'Date change permitted with nominal fare difference' },
      ],
    },
    importantPolicies: [
      'As per RBI and Ministry of Tourism guidelines, PAN Details & valid Government Photo ID (Aadhaar / Voter ID / Passport) are mandatory for all adult guests.',
      'Check-in time is 02:00 PM and check-out time is 11:00 AM. Early check-in is subject to room availability.',
      'Private cab is available for standard 8 hours / 80 km per sightseeing day as scheduled in the itinerary.',
      'Digital trip voucher, hotel confirmation code, and driver details will be shared on WhatsApp and Email 24 hours prior to travel.',
    ],
    itinerary: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1',
        title: 'Arrival in Goa & Beachfront Resort Check-in',
        subtitle: 'Airport Welcome · Scenic Coastal Drive · Sunset at Leisure',
        description:
          'Arrive at Goa International Airport (Dabolim / Mopa). Meet your dedicated private chauffeur outside the arrivals terminal holding your name placard. Enjoy a scenic air-conditioned drive to your 5-star beachfront resort in North Goa. Complete seamless express check-in, receive tropical welcome drinks, and unpack in your Deluxe Sea-Facing Suite. In the evening, stroll along the golden sands of Calangute Beach or relax by the infinity pool. Conclude your day with a delicious multi-cuisine welcome dinner buffet at the resort restaurant.',
        transfers: {
          title: 'Airport to Resort Private AC Transfer',
          description: 'Private AC Sedan chauffeur pickup from Goa Airport to resort lobby (Tolls & parking covered).',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'The Grand Azure Beachfront 5★ Resort & Spa',
          roomType: 'Deluxe Sea-Facing Balcony Suite',
          starCategory: '5-Star Luxury Resort',
          notes: 'Check-in from 02:00 PM · Ocean breeze balcony',
          included: true,
        },
        food: {
          mealPlan: 'Welcome Drink + Buffet Dinner',
          description: 'Refreshing kokum/coconut welcome drink upon arrival followed by evening chef buffet dinner.',
          included: true,
        },
        activities: [
          'Chauffeur airport meet & greet with placard',
          'Resort check-in & welcome mocktail',
          'Sunset beach stroll along Calangute promenade',
          'Access to multi-tier infinity pool & jacuzzi',
        ],
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 2',
        title: 'North Goa Coastal Heritage & Forts Excursion',
        subtitle: 'Aguada Lighthouse · Chapora Fort · Vagator Cliff Views',
        description:
          'Wake up to the sound of ocean waves and indulge in a lavish buffet breakfast with live cooking counters. At 09:30 AM, your private cab arrives for a full-day curated North Goa tour. Visit the historic 17th-century Fort Aguada and its Portuguese lighthouse commanding panoramic vistas of the Arabian Sea. Continue to the famous Chapora Fort perched atop Vagator cliff (famed from Bollywood films). Explore the vibrant bohemian vibe of Anjuna Beach and browse coastal handicrafts. Return to the resort by late afternoon for high-tea and an exquisite evening dinner.',
        transfers: {
          title: 'Full Day Sightseeing Chauffeur Cab',
          description: 'Dedicated AC car for 8 hours covering Fort Aguada, Candolim, Chapora, and Vagator.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'The Grand Azure Beachfront 5★ Resort & Spa',
          roomType: 'Deluxe Sea-Facing Balcony Suite',
          starCategory: '5-Star Luxury Resort',
          included: true,
        },
        food: {
          mealPlan: 'Buffet Breakfast & Dinner Included',
          description: 'Full spread morning buffet with live eggs/dosa & evening coastal themed 4-course dinner.',
          included: true,
        },
        activities: [
          'Guided walk through Portuguese Fort Aguada',
          'Scenic hike to Chapora Fort clifftop',
          'Vagator Red Cliff view & Anjuna artisan stalls',
          'Evening High-Tea at resort sunset deck',
        ],
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 3',
        title: 'South Goa Heritage, Churches & Mandovi Sunset Cruise',
        subtitle: 'Old Goa UNESCO Sights · Mangueshi Temple · Luxury Catamaran Cruise',
        description:
          'After breakfast, embark on an enriching cultural journey to South Goa. Explore the UNESCO World Heritage Basilica of Bom Jesus housing the sacred relics of St. Francis Xavier, and the majestic Sé Cathedral, one of the largest churches in Asia. Stop by the serene Mangueshi Temple dedicated to Lord Shiva. In the late afternoon, head to Panaji jetty and board your luxury Mandovi River Sunset Catamaran Cruise. Enjoy 2 hours of lively Goan folk dance performances, live DJ music, and breathtaking sunset panoramas over the backwaters before returning to the resort.',
        transfers: {
          title: 'South Goa Sightseeing & Jetty Transfers',
          description: 'Private AC vehicle from resort to Old Goa monuments, Panaji promenade, and cruise jetty.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'The Grand Azure Beachfront 5★ Resort & Spa',
          roomType: 'Deluxe Sea-Facing Balcony Suite',
          starCategory: '5-Star Luxury Resort',
          included: true,
        },
        food: {
          mealPlan: 'Buffet Breakfast & Dinner Included',
          description: 'Morning buffet at resort + snacks on cruise + dinner featuring traditional Goan specialties.',
          included: true,
        },
        activities: [
          'Basilica of Bom Jesus & Sé Cathedral guided tour',
          'Visit to 400-year-old Shri Mangueshi Temple',
          'Mandovi River 2-Hour Luxury Sunset Catamaran Cruise with live DJ',
          'Evening walk through Latin Quarter (Fontainhas)',
        ],
      },
      {
        dayNumber: 4,
        dayLabel: 'Day 4',
        title: 'Watersports Thrills, Spa Rejuvenation & Candlelight Dinner',
        subtitle: 'Beach Adventures · Ayurvedic Spa Therapy · Romantic Beach Dinner',
        description:
          'Savor your morning breakfast leisurely. Today is dedicated to thrill and relaxation. Head to the beach for an exhilarating adventure combo session (parasailing, jet ski, banana boat) or unwind by the resort infinity pool. In the afternoon, enjoy a complimentary relaxing Ayurvedic head & shoulder massage at the resort wellness spa. At night, celebrate your holiday with an exclusive Candlelight Beach Dinner set up under the starlit sky right by the crashing waves with candle lanterns and premium wine.',
        transfers: {
          title: 'Local Transfers & Resort Buggy Service',
          description: 'Complimentary resort electric buggy service and concierge assistance.',
          type: 'shuttle',
          included: true,
        },
        stay: {
          hotelName: 'The Grand Azure Beachfront 5★ Resort & Spa',
          roomType: 'Deluxe Sea-Facing Balcony Suite',
          starCategory: '5-Star Luxury Resort',
          included: true,
        },
        food: {
          mealPlan: 'Breakfast & Exclusive Candlelight Dinner',
          description: 'Lavish breakfast buffet + Special private beachfront candlelight 4-course dinner with wine/mocktails.',
          included: true,
        },
        activities: [
          'Morning beachside watersports & swimming',
          'Complimentary Ayurvedic relaxation massage at resort spa',
          'Private beach cabana lounging with tropical mocktails',
          'Special Candlelight Beachfront 4-Course Dinner under the stars',
        ],
      },
      {
        dayNumber: 5,
        dayLabel: 'Day 5',
        title: 'Souvenir Shopping in Panjim & Airport Departure',
        subtitle: 'Latin Quarter Walk · Local Cashew Shopping · Private Airport Drop',
        description:
          'Enjoy your final sunrise and a hearty farewell breakfast at the resort. Pack your memories and complete check-out by 11:00 AM. Your private chauffeur will take you on a brief stop in Panjim for traditional Goan cashew nuts, feni, artisanal chocolate, and spices. You will then be transferred comfortably to Goa Airport in time for your flight back home, with unforgettable tropical memories.',
        transfers: {
          title: 'Resort to Airport Private Departure Drop',
          description: 'Private AC Chauffeur transfer from resort to Goa Airport departure terminal with flight assistance.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Trip Completion',
          roomType: 'Check-out at 11:00 AM',
          starCategory: 'Safe Travels',
          notes: 'Luggage storage available if flight is later in the evening',
          included: false,
        },
        food: {
          mealPlan: 'Buffet Breakfast Included',
          description: 'Complete morning breakfast buffet before checkout.',
          included: true,
        },
        activities: [
          'Morning beach photo session & leisurely breakfast',
          'Express resort checkout assistance',
          'Shopping stop at 18th June Road for Goan cashews & spices',
          'Chauffeur drop to Goa Airport departure gates',
        ],
      },
    ],
  },
  {
    id: 'HOL-GOA-HONEYMOON-VILLA',
    title: 'Goa Romantic Honeymoon Retreat with Private Plunge Pool Villa',
    destination: 'Goa, India',
    city: 'Goa',
    stateOrCountry: 'India',
    durationNightsCount: 4,
    durationDaysCount: 5,
    durationLabel: '4 Nights / 5 Days',
    theme: 'Honeymoon',
    hotelCategory: '5★',
    hotelStars: 5,
    rating: 4.96,
    reviewsCount: 310,
    startingPricePerPersonInr: 34500,
    originalPriceInr: 49000,
    flightsIncluded: true,
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: [
      'Exclusive 5★ Luxury Villa with Private Plunge Pool & Sun Deck',
      'Complimentary Honeymoon Bed Floral Decor, Cake & Chilled Sparkling Wine',
      'Private Yacht Cruise along Mandovi Bay with sunset champagne',
      'Couples Aromatherapy Spa Therapy (90 Mins)',
      'Signature Floating Pool Breakfast served directly in your villa',
      'Dedicated Mercedes/Audi chauffeur sedan for all transfers',
    ],
    transfersOverview: [
      {
        title: 'VIP Luxury Sedan Chauffeur',
        description: 'Chauffeur pickup in Mercedes E-Class / Audi A6 with sparkling juice welcome.',
        icon: 'Car',
      },
      {
        title: 'Private Yacht Charter',
        description: 'Private luxury speedboat/yacht for 2 hours with captain and refreshments.',
        icon: 'Ship',
      },
    ],
    stayOverview: {
      hotelName: 'Taj Exotica / W Goa Cliffside Private Villa',
      starRating: 5,
      roomType: 'Luxury Private Plunge Pool Villa',
      location: 'South Goa Pristine Coastline',
      checkIn: '02:00 PM',
      checkOut: '12:00 PM',
      amenities: [
        'Private Temperature-Controlled Plunge Pool',
        'Butler On Call',
        'Outdoor Rain Shower',
        'Private Sun Loungers',
        'Espresso Machine',
        'Bose Sound System',
      ],
      perks: [
        'Complimentary bottle of sparkling wine & chocolates',
        'Romantic flower petal bed turndown service',
        'Daily evening sunset mocktail & canapés',
      ],
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    },
    foodOverview: {
      title: 'Romantic Gourmet Meal Plan',
      badge: 'All Meals + Floating Breakfast Included',
      description: 'Handcrafted culinary experiences tailored for couples, from floating pool trays to intimate seaside dining.',
      mealItems: [
        'Signature Instagrammable Floating Breakfast in private plunge pool',
        'Daily gourmet multi-course dinner at beachfront fine-dining venue',
        '1 Private 5-course Candlelight Beach Dinner with personal chef & violinist',
        'Romantic High Tea served in your villa courtyard',
      ],
    },
    inclusions: [
      'Return flights in economy class with priority seat selection',
      '4 Nights in 5★ Private Plunge Pool Villa with butler service',
      'All meals (Breakfast, High-Tea, and Dinner) included',
      '1 Signature Floating Breakfast in your private pool',
      '1 Private 2-hour Sunset Yacht Charter on Mandovi Bay',
      '90-Minute Couples Aromatherapy Spa session',
      'Dedicated luxury sedan chauffeur for 5 days',
      'All applicable GST, fuel & airport parking fees',
    ],
    exclusions: [
      'Personal excursions not mentioned in the romantic itinerary',
      'Scuba diving or extreme water sports (available on request)',
    ],
    cancellationPolicy: {
      refundablePercentage: 100,
      noticeHours: 72,
      terms: [
        { timeframe: '> 7 Days Before Departure', refund: '100% Full Refund', note: 'Zero cancellation charges' },
        { timeframe: '3 to 7 Days Before Departure', refund: '75% Refund', note: 'Reschedule anytime without penalty' },
        { timeframe: '< 72 Hours Before Departure', refund: 'Reschedule Only', note: 'Subject to villa availability' },
      ],
    },
    importantPolicies: [
      'Mandatory PAN Details required as per RBI regulations for tour bookings.',
      'Couples require valid Government photo identification for villa check-in.',
      'Private yacht schedule is weather dependent and subject to port authority clearance.',
    ],
    itinerary: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1',
        title: 'VIP Chauffeur Arrival & Romantic Villa Check-in',
        subtitle: 'Airport Welcome · Flower Petals Turndown · Candlelight Welcome',
        description:
          'Arrive in style at Goa Airport where your private luxury chauffeur welcomes you with fresh garlands and chilled sparkling drinks. Drive in comfort to your private plunge pool villa. Unpack in paradise surrounded by exotic flower petals, celebratory honeymoon cake, and chilled champagne. Spend the twilight hours by your personal pool before savoring an intimate welcome dinner.',
        transfers: {
          title: 'VIP Luxury Sedan Transfer',
          description: 'Airport to villa private transfer in premium Mercedes/Audi sedan.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Taj Exotica / W Goa Cliffside Private Villa',
          roomType: 'Luxury Private Plunge Pool Villa',
          starCategory: '5-Star Luxury Villa',
          included: true,
        },
        food: {
          mealPlan: 'Champagne + Honeymoon Cake + Welcome Dinner',
          description: 'Sparkling wine, Belgian chocolates, celebratory cake & multi-course dinner.',
          included: true,
        },
        activities: [
          'VIP Airport Meet & Chauffeur Transfer',
          'Private Villa check-in with floral garland welcome',
          'Sunset dip in private temperature-controlled plunge pool',
        ],
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 2',
        title: 'Floating Pool Breakfast & Private Sunset Yacht Charter',
        subtitle: 'Floating Tray in Villa · Coastal Views · Private Yacht on Arabian Sea',
        description:
          'Begin the day with the signature TripYehh floating breakfast served directly in your private pool. In the afternoon, your chauffeur escorts you to the private marina where your luxury yacht awaits. Set sail for 2 blissful hours across the Arabian Sea with chilled wine, fruit skewers, and music as the sun paints the horizon gold.',
        transfers: {
          title: 'Chauffeur to Private Marina',
          description: 'Private luxury sedan transfer to yacht jetty and return.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Taj Exotica / W Goa Cliffside Private Villa',
          roomType: 'Luxury Private Plunge Pool Villa',
          starCategory: '5-Star Luxury Villa',
          included: true,
        },
        food: {
          mealPlan: 'Floating Pool Breakfast + Yacht Canapés + Dinner',
          description: 'Instagrammable floating breakfast tray + sunset yacht snacks + dinner.',
          included: true,
        },
        activities: [
          'Signature floating breakfast in your private pool',
          '2-Hour private sunset yacht cruise on Arabian Sea',
          'Sunset photoshoot on yacht deck',
        ],
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 3',
        title: 'Couples Spa Rejuvenation & Starlit Beach Dinner',
        subtitle: '90-Min Aromatherapy · Private Beach Cabana · Live Violinist Dinner',
        description:
          'Indulge in a 90-minute Aromatherapy and Ayurvedic relaxation therapy designed for couples in a private garden pavilion. In the evening, walk hand-in-hand to a secluded stretch of the beach illuminated by candles and tiki torches. Dine on a custom 5-course menu prepared by your private chef, accompanied by the gentle tunes of a live violinist.',
        transfers: {
          title: 'On-Property Electric Buggy',
          description: 'Seamless buggy escort around the 56-acre resort property.',
          type: 'shuttle',
          included: true,
        },
        stay: {
          hotelName: 'Taj Exotica / W Goa Cliffside Private Villa',
          roomType: 'Luxury Private Plunge Pool Villa',
          starCategory: '5-Star Luxury Villa',
          included: true,
        },
        food: {
          mealPlan: 'Gourmet Breakfast + 5-Course Starlit Beach Dinner',
          description: 'Breakfast buffet + Private candlelit beach dinner with wine & live violinist.',
          included: true,
        },
        activities: [
          '90-Minute Couples Aromatherapy Spa session',
          'Private beach cabana relaxation',
          'Exclusive 5-course Candlelight Beach Dinner with violinist',
        ],
      },
      {
        dayNumber: 4,
        dayLabel: 'Day 4',
        title: 'Scenic Vagator Cliffs & Twilight Beach Club Lounge',
        subtitle: 'Chauffeur Tour · Panoramic Cliff Vistas · Reserved VIP Cabana',
        description:
          'Spend a leisurely morning in your villa. After lunch, your chauffeur takes you to the scenic cliffs of North Goa overlooking the ocean. Enjoy reserved VIP cabana seating at a premier cliffside lounge, tasting Mediterranean tapas while listening to ambient sunset beats.',
        transfers: {
          title: 'Private Chauffeur Sedan',
          description: 'Chauffeur-driven sedan for cliffside tour & lounge visit.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Taj Exotica / W Goa Cliffside Private Villa',
          roomType: 'Luxury Private Plunge Pool Villa',
          starCategory: '5-Star Luxury Villa',
          included: true,
        },
        food: {
          mealPlan: 'Buffet Breakfast & Sunset Tapas Dinner',
          description: 'Villa breakfast + cliffside lounge appetizers and dinner.',
          included: true,
        },
        activities: [
          'Scenic cliffside photo tour',
          'Reserved VIP sunset cabana at cliff lounge',
          'Evening moonlight walk on private resort beach',
        ],
      },
      {
        dayNumber: 5,
        dayLabel: 'Day 5',
        title: 'Farewell Breakfast & Luxury Airport Drop',
        subtitle: 'Final Pool Dip · Souvenir Hamper · Private Departure',
        description:
          'Enjoy your last morning dip in your plunge pool followed by a sumptuous breakfast. Your butler assists with checkout and presents a complimentary Goan gourmet souvenir hamper. Your chauffeur escorts you to the airport in comfort for your flight home.',
        transfers: {
          title: 'Luxury Sedan Airport Drop',
          description: 'Chauffeur transfer directly to Goa Airport departures.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Trip Completion',
          roomType: 'Check-out at 12:00 PM',
          starCategory: 'Memories Forever',
          included: false,
        },
        food: {
          mealPlan: 'Champagne Breakfast Included',
          description: 'Farewell breakfast buffet with sparkling wine.',
          included: true,
        },
        activities: [
          'Morning pool swim & photography',
          'Butler assisted checkout & souvenir gifting',
          'VIP chauffeur drop to airport',
        ],
      },
    ],
  },
  {
    id: 'HOL-GOA-ADVENTURE',
    title: '3N/4D Goa Thrill Adventure with Scuba Diving & Grand Island Boat Trip',
    destination: 'Goa, India',
    city: 'Goa',
    stateOrCountry: 'India',
    durationNightsCount: 3,
    durationDaysCount: 4,
    durationLabel: '3 Nights / 4 Days',
    theme: 'Adventure',
    hotelCategory: '4★',
    hotelStars: 4,
    rating: 4.84,
    reviewsCount: 540,
    startingPricePerPersonInr: 14200,
    originalPriceInr: 21000,
    flightsIncluded: false,
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: [
      'PADI Certified Instructor Scuba Diving with HD underwater video & photos',
      'Full Day Grand Island Catamaran Cruise with wild dolphin spotting',
      '5-in-1 Watersports Combo: Parasailing, Jet Ski, Banana, Bumper & Speedboat',
      'Beachside BBQ lunch on Monkey Island & fresh fruit refreshments',
      '4★ Candolim Boutique Resort stay with outdoor swimming pool',
      'Private AC Cab for all airport and water sports transfers',
    ],
    transfersOverview: [
      {
        title: 'Airport & Station AC Cab',
        description: 'Chauffeur pickup from Goa Airport / Madgaon Station to Candolim hotel.',
        icon: 'Car',
      },
      {
        title: 'Grand Island Speedboat / Catamaran',
        description: 'Boat ride to Grand Island with safety gear, life jackets & dolphin spotting.',
        icon: 'Ship',
      },
    ],
    stayOverview: {
      hotelName: 'Lemon Tree Amarante / Candolim Boutique Beach Resort',
      starRating: 4,
      roomType: 'Superior Pool-View Balcony Room',
      location: 'Candolim Beach Road, North Goa',
      checkIn: '02:00 PM',
      checkOut: '11:00 AM',
      amenities: ['Outdoor Pool', 'Free Wi-Fi', 'Poolside Bar', 'Restaurant', 'Gym', 'Tour Desk'],
      perks: ['Complimentary welcome drink', 'Pool towel services', '10% food & beverage discount'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    },
    foodOverview: {
      title: 'Adventure Energy Meal Plan',
      badge: 'Daily Breakfast + Grand Island Island BBQ Lunch',
      description: 'Energizing meals to keep you fueled for high-octane diving and water sports.',
      mealItems: [
        'Daily buffet breakfast with hot Indian & continental selections',
        'Beachside buffet BBQ lunch on Grand Island (Veg / Non-Veg grilled items)',
        'Unlimited fresh fruits, snacks and bottled water during the boat excursion',
      ],
    },
    inclusions: [
      '3 Nights in 4★ Candolim Beach Resort with pool view room',
      'Daily buffet breakfast for all guests',
      'Grand Island full-day catamaran cruise with dolphin spotting',
      'Scuba diving session with certified PADI dive master + underwater video',
      '5-in-1 Watersports: Parasailing, Jet Ski, Bumper, Banana & Speedboat',
      'Island BBQ lunch and chilled refreshments',
      'Private AC cab for airport pickup, drop, and boat jetty transfers',
      'All equipment rentals, safety gear, wetsuits, and taxes included',
    ],
    exclusions: [
      'Flights or train tickets to Goa (available as add-on)',
      'Dinners (resort has multiple dining options nearby on Candolim street)',
    ],
    cancellationPolicy: {
      refundablePercentage: 100,
      noticeHours: 72,
      terms: [
        { timeframe: '> 72 Hours Before Departure', refund: '100% Full Refund', note: 'Instant refund processed' },
        { timeframe: '< 72 Hours Before Departure', refund: 'Free Reschedule', note: 'Valid for 6 months' },
      ],
    },
    importantPolicies: [
      'PAN Details mandatory as per RBI guidelines.',
      'Scuba diving is suitable for non-swimmers; medical disclaimer form must be signed on-site.',
      'Wear comfortable swimwear and carry sunscreen, sunhat and dry clothes.',
    ],
    itinerary: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1',
        title: 'Arrival in Goa & Candolim Beach Check-in',
        subtitle: 'Airport Pickup · Hotel Check-in · Sunset at Candolim Beach',
        description:
          'Chauffeur pickup from Goa Airport or train station. Drive to your 4-star boutique hotel in Candolim. Check in, relax by the swimming pool, and head to Candolim beach in the evening to soak in the sunset vibes.',
        transfers: {
          title: 'Airport to Hotel Transfer',
          description: 'Private AC Sedan pickup from Goa Airport to Candolim.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Lemon Tree Amarante Candolim',
          roomType: 'Superior Pool-View Room',
          starCategory: '4-Star Resort',
          included: true,
        },
        food: {
          mealPlan: 'Welcome Drink',
          description: 'Chilled tropical drink upon check-in.',
          included: true,
        },
        activities: ['Resort check-in & pool relaxation', 'Evening stroll along Candolim beach'],
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 2',
        title: 'Full Day Grand Island Expedition & Scuba Diving',
        subtitle: 'Catamaran Cruise · Dolphin Spotting · Coral Scuba Dive · Island BBQ',
        description:
          'Early morning pickup at 07:30 AM to the boat jetty. Board the catamaran towards Grand Island. Watch playful dolphins leaping in the sea along the route. Receive hands-on training from certified PADI dive instructors and dive into the crystal clear waters to explore coral reefs and exotic marine life. Enjoy an open-flame BBQ lunch on Monkey Beach with chilled beverages.',
        transfers: {
          title: 'Hotel to Jetty & Boat Transfer',
          description: 'AC cab to jetty + speed catamaran cruise to Grand Island.',
          type: 'ferry',
          included: true,
        },
        stay: {
          hotelName: 'Lemon Tree Amarante Candolim',
          roomType: 'Superior Pool-View Room',
          starCategory: '4-Star Resort',
          included: true,
        },
        food: {
          mealPlan: 'Buffet Breakfast & Island BBQ Lunch Included',
          description: 'Hearty breakfast at hotel + fresh grilled BBQ lunch on island.',
          included: true,
        },
        activities: [
          'Boat cruise with dolphin spotting',
          'PADI Scuba diving with underwater HD video',
          'Island BBQ lunch with chilled drinks',
        ],
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 3',
        title: '5-in-1 Watersports Extravaganza at Baga Beach',
        subtitle: 'Parasailing · Jet Ski Speed Run · Banana & Bumper Rides',
        description:
          'Fuel up with a hearty breakfast. Transfer to the action-packed watersports center at Baga Beach. Take to the skies with high-altitude parasailing, ride the waves on high-powered Jet Skis, and hold on tight during banana and bumper boat rides. Enjoy the afternoon chilling at iconic beach shacks.',
        transfers: {
          title: 'Cab to Watersports Hub',
          description: 'Dedicated cab transfer to Baga Beach activity hub.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Lemon Tree Amarante Candolim',
          roomType: 'Superior Pool-View Room',
          starCategory: '4-Star Resort',
          included: true,
        },
        food: {
          mealPlan: 'Buffet Breakfast Included',
          description: 'Morning buffet at hotel.',
          included: true,
        },
        activities: [
          'Parasailing with breathtaking ocean views',
          'High-speed Jet Ski ride with instructor',
          'Bumper & Banana boat tube rides',
        ],
      },
      {
        dayNumber: 4,
        dayLabel: 'Day 4',
        title: 'Check-out & Chauffeur Airport Drop',
        subtitle: 'Breakfast · Souvenir Shopping · Return Home',
        description:
          'Enjoy breakfast and checkout by 11:00 AM. Stop at Panjim for traditional Goan cashews before being transferred to Goa Airport for your return journey.',
        transfers: {
          title: 'Hotel to Airport Transfer',
          description: 'Private AC Cab drop to airport departure terminal.',
          type: 'cab',
          included: true,
        },
        stay: {
          hotelName: 'Trip Completion',
          roomType: 'Check-out at 11:00 AM',
          starCategory: 'Adventures Completed',
          included: false,
        },
        food: {
          mealPlan: 'Buffet Breakfast Included',
          description: 'Breakfast buffet before checkout.',
          included: true,
        },
        activities: ['Breakfast & checkout', 'Airport transfer'],
      },
    ],
  },
];
