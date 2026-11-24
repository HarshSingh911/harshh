import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { getAdjacentPhotoIndex } from '../utils/hotelResultsUtils';

interface HotelCardPhotoCarouselProps {
  images: string[];
  hotelName: string;
  onOpenDetails?: () => void;
}

export const HotelCardPhotoCarousel: React.FC<HotelCardPhotoCarouselProps> = ({
  images,
  hotelName,
  onOpenDetails,
}) => {
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const safeImages = images.length > 0 ? images : [''];
  const activeSrc = safeImages[photoIndex % safeImages.length];

  const handleStep = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation();
    e.preventDefault();
    setPhotoIndex((prev) => getAdjacentPhotoIndex(prev, safeImages.length, direction));
  };

  return (
    <div
      onClick={onOpenDetails}
      data-testid="hotel-card-photo-carousel"
      className="w-full md:w-64 h-44 md:h-auto min-h-[180px] relative shrink-0 overflow-hidden bg-slate-100 cursor-pointer select-none"
    >
      <SafeImage
        src={activeSrc}
        alt={hotelName}
        fallbackTitle={hotelName}
        className="w-full h-full object-cover transition-transform duration-300 group-hover/hotel:scale-[1.03]"
      />

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => handleStep(e, 'prev')}
            aria-label={`Previous photo of ${hotelName}`}
            data-testid="hotel-photo-prev"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/55 text-white shadow-[0_4px_16px_rgba(15,23,42,0.3)] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 z-10 opacity-0 pointer-events-none group-hover/hotel:opacity-100 group-hover/hotel:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
          >
            <ChevronLeft className="w-4 h-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]" />
          </button>

          <button
            type="button"
            onClick={(e) => handleStep(e, 'next')}
            aria-label={`Next photo of ${hotelName}`}
            data-testid="hotel-photo-next"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/55 text-white shadow-[0_4px_16px_rgba(15,23,42,0.3)] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 z-10 opacity-0 pointer-events-none group-hover/hotel:opacity-100 group-hover/hotel:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
          >
            <ChevronRight className="w-4 h-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]" />
          </button>

          <div
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10"
            aria-hidden="true"
          >
            {safeImages.slice(0, 6).map((_, idx) => (
              <button
                key={idx}
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setPhotoIndex(idx);
                }}
                className={`rounded-full transition-all cursor-pointer ${
                  idx === photoIndex % safeImages.length
                    ? 'w-2 h-2 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/65 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
