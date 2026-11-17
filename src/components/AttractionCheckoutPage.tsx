import React from 'react';
import { BookedTrip, CurrencyCode, ExperienceItem } from '../data/travelData';
import { AttractionBookingCheckoutPage } from './AttractionBookingCheckoutPage';

export interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
  sample: string;
}

export const COUNTRY_DIAL_CODES: CountryCodeOption[] = [
  { code: '+91', country: 'India', flag: '🇮🇳', sample: '98765 43210' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', sample: '50 123 4567' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸', sample: '202 555 0123' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', sample: '7911 123456' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', sample: '8123 4567' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', sample: '81 234 5678' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', sample: '12 345 6789' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', sample: '812 3456 789' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', sample: '3312 3456' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', sample: '50 123 4567' },
  { code: '+968', country: 'Oman', flag: '🇴🇲', sample: '9123 4567' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭', sample: '3600 1234' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', sample: '412 345 678' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', sample: '151 23456789' },
  { code: '+33', country: 'France', flag: '🇫🇷', sample: '6 12 34 56 78' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', sample: '90 1234 5678' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', sample: '10 1234 5678' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰', sample: '9123 4567' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', sample: '71 234 5678' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵', sample: '984 1234567' },
  { code: '+960', country: 'Maldives', flag: '🇲🇻', sample: '771 2345' },
];

export interface AttractionCheckoutPageProps {
  experience: ExperienceItem;
  currency: CurrencyCode;
  selectedDate: string;
  onBack: () => void;
  onCompleteBooking: (bookedTrip: BookedTrip) => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onNavigateTrips?: () => void;
}

export const AttractionCheckoutPage: React.FC<AttractionCheckoutPageProps> = ({
  experience,
  currency,
  selectedDate,
  onBack,
  onCompleteBooking,
  onNotify,
  onNavigateTrips,
}) => {
  return (
    <AttractionBookingCheckoutPage
      experience={experience}
      currency={currency}
      selectedDate={selectedDate}
      onBack={onBack}
      onCompleteBooking={onCompleteBooking}
      onNotify={onNotify}
      onNavigateTrips={onNavigateTrips}
    />
  );
};
