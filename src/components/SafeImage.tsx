import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleImageError = () => {
    // If it was referencing /src/assets/images, try /assets/images/ before failing
    if (typeof currentSrc === 'string' && currentSrc.startsWith('/src/assets/images/')) {
      setCurrentSrc(currentSrc.replace('/src/assets/images/', '/assets/images/'));
      return;
    }
    setHasError(true);
  };

  if (hasError || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 text-white/80 p-4 ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'Travel visual'}
      >
        <Compass className="w-8 h-8 text-indigo-400 mb-2 opacity-80" />
        {fallbackTitle && (
          <span className="text-xs font-medium tracking-wide text-center text-slate-200">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || fallbackTitle || 'Travel photography'}
      onError={handleImageError}
      className={className}
      {...props}
    />
  );
};
