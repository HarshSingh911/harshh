export interface HotelProviderDeal {
  id: string;
  name: string;
  logoBg: string;
  logoText: string;
  rating: number;
  reviewsCount: string;
  note: string;
  priceDelta: number;
  isCheapest?: boolean;
  isOfficial?: boolean;
}

export function buildHotelProviderDeals(
  hotelName: string,
  sortBy: 'price' | 'rating' = 'price'
): HotelProviderDeal[] {
  const shortBrand = hotelName.split(' ')[0] || 'Hotel';
  const list: HotelProviderDeal[] = [
    {
      id: 'tripyeah-hotels-direct',
      name: 'TripYeah Hotels Direct',
      logoBg: 'bg-blue-600',
      logoText: 'TY',
      rating: 4.9,
      reviewsCount: '24,200+ reviews',
      note: 'Best price guarantee · Instant confirmation · Choose room & meal options on site',
      priceDelta: 0,
      isCheapest: true,
    },
    {
      id: 'agoda',
      name: 'Agoda',
      logoBg: 'bg-[#0b7c7b]',
      logoText: 'AG',
      rating: 4.7,
      reviewsCount: '42,000+ reviews',
      note: 'Member-only nightly rate · Instant voucher · Select room & add-ons on partner site',
      priceDelta: 80,
    },
    {
      id: 'booking-com',
      name: 'Booking.com',
      logoBg: 'bg-[#003580]',
      logoText: 'BK',
      rating: 4.8,
      reviewsCount: '65,000+ reviews',
      note: 'Flexible booking options · Verified guest reviews · Choose room category on site',
      priceDelta: 120,
    },
    {
      id: 'makemytrip-hotels',
      name: 'MakeMyTrip Hotels',
      logoBg: 'bg-[#ea2330]',
      logoText: 'MMT',
      rating: 4.7,
      reviewsCount: '38,500+ reviews',
      note: 'Verified stay partner · 24/7 travel helpline · Customize stay options during booking',
      priceDelta: 160,
    },
    {
      id: 'hotel-official',
      name: `${shortBrand} Official Site`,
      logoBg: 'bg-slate-900',
      logoText: hotelName.substring(0, 2).toUpperCase() || 'HT',
      rating: 4.9,
      reviewsCount: 'Property Direct',
      note: 'Direct property reservation · Loyalty benefits · Full inventory on official website',
      priceDelta: 190,
      isOfficial: true,
    },
    {
      id: 'expedia',
      name: 'Expedia',
      logoBg: 'bg-[#ffc72c] text-slate-900',
      logoText: 'EXP',
      rating: 4.6,
      reviewsCount: '31,000+ reviews',
      note: 'OneKey member savings · Transparent total pricing · Select room on checkout',
      priceDelta: 210,
    },
    {
      id: 'hotels-com',
      name: 'Hotels.com',
      logoBg: 'bg-[#d4111e]',
      logoText: 'H.C',
      rating: 4.6,
      reviewsCount: '19,400+ reviews',
      note: 'Collect reward nights · Price match support · Customize room options on site',
      priceDelta: 240,
    },
    {
      id: 'goibibo-hotels',
      name: 'Goibibo',
      logoBg: 'bg-[#f4511e]',
      logoText: 'GO',
      rating: 4.5,
      reviewsCount: '14,000+ reviews',
      note: 'Express mobile check-in · Instant partner voucher · Choose inclusions on site',
      priceDelta: 290,
    },
  ];

  if (sortBy === 'rating') {
    return [...list].sort((a, b) => b.rating - a.rating || a.priceDelta - b.priceDelta);
  }
  return [...list].sort((a, b) => a.priceDelta - b.priceDelta);
}

export function getLowestHotelDealPrice(basePrice: number, deals: HotelProviderDeal[]): number {
  if (!deals.length) return basePrice;
  const minDelta = Math.min(...deals.map((d) => d.priceDelta));
  return basePrice + minDelta;
}
