import React from 'react';

interface InternationalCityGridSkeletonProps {
  count?: number;
}

const CITY_TITLE_WIDTHS = ['w-36', 'w-32', 'w-40', 'w-28'];
const SUBTITLE_WIDTHS = ['w-24', 'w-28', 'w-20', 'w-24'];

export const InternationalCityGridSkeleton: React.FC<InternationalCityGridSkeletonProps> = ({
  count = 8,
}) => {
  const safeCount = Math.max(1, Math.min(12, Math.floor(count)));

  return (
    <div
      data-testid="international-city-skeleton-list"
      aria-busy="true"
      aria-label="Loading flight destinations"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
    >
      {Array.from({ length: safeCount }).map((_, idx) => (
        <div
          key={idx}
          data-testid={`international-city-skeleton-card-${idx}`}
          className="w-full bg-white rounded-xl border border-slate-200/90 px-4 py-3.5 flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="min-w-0 space-y-2 flex-1">
            <div
              className={`h-4 ${CITY_TITLE_WIDTHS[idx % CITY_TITLE_WIDTHS.length]} rounded hotel-skeleton-shimmer`}
            />
            <div
              className={`h-3 ${SUBTITLE_WIDTHS[idx % SUBTITLE_WIDTHS.length]} rounded hotel-skeleton-shimmer`}
            />
            <div className="h-3 w-14 rounded hotel-skeleton-shimmer" />
          </div>

          <div className="h-5 w-16 rounded-md hotel-skeleton-shimmer shrink-0" />
        </div>
      ))}
    </div>
  );
};
