import React, { useMemo } from 'react';
import {
  Accessibility,
  Baby,
  BedDouble,
  Bell,
  Briefcase,
  Building2,
  Car,
  Check,
  Clock,
  Dumbbell,
  HeartPulse,
  Plane,
  Sparkles,
  Tv,
  Utensils,
  Waves,
  Wifi,
  Wind,
} from 'lucide-react';
import {
  AmenityCategoryId,
  buildHotelAmenitiesDisplay,
} from '../utils/hotelAmenitiesUtils';

interface HotelAmenitiesSectionProps {
  amenities?: string[];
  variant?: 'checkout' | 'details';
}

const CATEGORY_ICON_MAP: Record<AmenityCategoryId, React.ElementType> = {
  accessibility: Accessibility,
  'business-facilities': Briefcase,
  'food-and-drink': Utensils,
  'for-the-family': Baby,
  healthcare: HeartPulse,
  'hotel-outdoor-facilities': Building2,
  'in-the-rooms': BedDouble,
  'leisure-entertainment': Sparkles,
  'media-technology': Tv,
  services: Bell,
  'sport-fitness': Dumbbell,
  'transport-parking': Car,
  'wifi-internet': Wifi,
};

function getFeaturedAmenityIcon(label: string): React.ElementType {
  const lower = label.toLowerCase();
  if (lower.includes('wi-fi') || lower.includes('wifi')) return Wifi;
  if (lower.includes('air conditioning') || lower === 'ac') return Wind;
  if (lower.includes('pool')) return Waves;
  if (lower.includes('parking')) return Car;
  if (lower.includes('restaurant') || lower.includes('dining') || lower.includes('breakfast')) return Utensils;
  if (lower.includes('front desk') || lower.includes('24')) return Clock;
  if (lower.includes('airport') || lower.includes('shuttle')) return Plane;
  if (lower.includes('fitness') || lower.includes('gym')) return Dumbbell;
  if (lower.includes('spa')) return Sparkles;
  return Check;
}

export const HotelAmenitiesSection: React.FC<HotelAmenitiesSectionProps> = ({
  amenities,
  variant = 'checkout',
}) => {
  const { featuredAmenities, categorizedGroups } = useMemo(
    () => buildHotelAmenitiesDisplay(amenities),
    [amenities]
  );

  const wrapperClass =
    variant === 'details'
      ? 'bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs'
      : '';

  return (
    <div className={wrapperClass}>
      <div className="space-y-1 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
          Amenities
        </h2>
        <p className="text-sm text-slate-600">
          Essential facilities and services available across the property.
        </p>
      </div>

      {/* Top Prominent Highlight Amenities (no "Main Amenities" heading) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-8 mb-8 border-b border-slate-200">
        {featuredAmenities.map((amenity) => {
          const IconComponent = getFeaturedAmenityIcon(amenity);
          return (
            <div
              key={amenity}
              className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/90 bg-slate-50/75 hover:bg-blue-50/40 hover:border-blue-200 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>

      {/* Categorized Amenities Directory */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {categorizedGroups.map((group) => {
          const CategoryIcon = CATEGORY_ICON_MAP[group.id] || Check;
          return (
            <div key={group.id} className="break-inside-avoid mb-7">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-[15px] pb-2 mb-3 border-b border-slate-100">
                <CategoryIcon className="w-4 h-4 text-blue-600 shrink-0" />
                <h3>{group.title}</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {group.items.map((itemText) => (
                  <li key={itemText} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="leading-snug">{itemText}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
