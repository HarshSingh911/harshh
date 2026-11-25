import React from 'react';
import { HOTEL_SKELETON_CARD_COUNT } from '../utils/hotelResultsUtils';

interface HotelResultsSkeletonProps {
  count?: number;
}

const TITLE_WIDTHS = ['w-3/4', 'w-2/3', 'w-4/5', 'w-3/5'];
const ADDRESS_WIDTHS = ['w-3/5', 'w-1/2', 'w-2/3', 'w-1/2'];

export const HotelResultsSkeleton: React.FC<HotelResultsSkeletonProps> = ({
  count = HOTEL_SKELETON_CARD_COUNT,
}) => {
  const safeCount = Math.max(1, Math.min(8, Math.floor(count)));

  return (
    <div
      data-testid="hotel-results-skeleton-list"
      aria-busy="true"
      aria-label="Searching hotels"
      className="space-y-4"
    >
      {Array.from({ length: safeCount }).map((_, idx) => (
        <div
          key={idx}
          data-testid={`hotel-skeleton-card-${idx}`}
          className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06),0_0_0_1px_rgba(15,23,42,0.08)] flex flex-col md:flex-row"
        >
          {/* Photo Carousel Skeleton */}
          <div className="w-full md:w-64 h-44 md:h-auto min-h-[212px] relative shrink-0 overflow-hidden hotel-skeleton-shimmer">
            <div
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
              aria-hidden="true"
            >
              <span className="w-2 h-2 rounded-full bg-white/75" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </div>
          </div>

          {/* Hotel Details Skeleton (Mirrors Name -> Stars -> Address -> Reviews -> Amenities -> Footer) */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* 1. Hotel Name Placeholder */}
              <div
                className={`h-5 sm:h-6 ${TITLE_WIDTHS[idx % TITLE_WIDTHS.length]} rounded-md hotel-skeleton-shimmer`}
              />

              {/* 2. Stars Placeholder */}
              <div className="flex items-center gap-1 mt-2" aria-hidden="true">
                {Array.from({ length: 5 }).map((__, sIdx) => (
                  <span
                    key={sIdx}
                    className="w-3.5 h-3.5 rounded-xs hotel-skeleton-shimmer"
                  />
                ))}
              </div>

              {/* 3. Address Placeholder */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-3.5 h-3.5 rounded-full hotel-skeleton-shimmer shrink-0" />
                <span
                  className={`h-3.5 ${ADDRESS_WIDTHS[idx % ADDRESS_WIDTHS.length]} rounded hotel-skeleton-shimmer`}
                />
              </div>

              {/* 4. Reviews Placeholder */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="w-11 h-5 rounded-lg hotel-skeleton-shimmer shrink-0" />
                <span className="w-16 h-3.5 rounded hotel-skeleton-shimmer" />
                <span className="w-24 h-3.5 rounded hotel-skeleton-shimmer" />
              </div>

              {/* 5. Amenities Placeholder */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                <span className="w-20 h-6 rounded-lg hotel-skeleton-shimmer" />
                <span className="w-28 h-6 rounded-lg hotel-skeleton-shimmer" />
                <span className="w-24 h-6 rounded-lg hotel-skeleton-shimmer" />
              </div>
            </div>

            {/* Footer: Price + Provider Pill (Left) · Compare Prices Button (Right) */}
            <div className="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-12 h-3 rounded hotel-skeleton-shimmer" />
                    <span className="w-14 h-4 rounded hotel-skeleton-shimmer" />
                  </div>
                  <div className="w-28 h-7 rounded-md hotel-skeleton-shimmer" />
                  <div className="w-24 h-2.5 rounded hotel-skeleton-shimmer" />
                </div>

                {/* Cheapest Provider Link Placeholder */}
                <div className="w-28 h-9 rounded-xl hotel-skeleton-shimmer" />
              </div>

              {/* Compare Prices CTA Placeholder */}
              <div className="w-36 h-10 rounded-full hotel-skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
