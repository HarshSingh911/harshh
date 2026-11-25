import React from 'react';

interface HotelProviderWordmarkProps {
  providerId: string;
  hotelName?: string;
  size?: 'sm' | 'md';
}

export const HotelProviderWordmark: React.FC<HotelProviderWordmarkProps> = ({
  providerId,
  hotelName = 'Hotel',
  size = 'md',
}) => {
  const shortBrand = hotelName.split(' ')[0] || 'Hotel';
  const isSm = size === 'sm';

  switch (providerId) {
    case 'agoda':
      return (
        <span className="inline-flex flex-col items-start select-none" aria-label="agoda">
          <span
            className={`${
              isSm ? 'text-[16px]' : 'text-[23px]'
            } font-extrabold tracking-tight text-slate-900 leading-none font-display`}
          >
            agoda
          </span>
          <span
            className={`flex items-center ${isSm ? 'gap-[3px] mt-[3px]' : 'gap-1 mt-1'}`}
            aria-hidden="true"
          >
            <span className={`${isSm ? 'w-[4.5px] h-[4.5px]' : 'w-1.5 h-1.5'} rounded-full bg-[#e12d39]`} />
            <span className={`${isSm ? 'w-[4.5px] h-[4.5px]' : 'w-1.5 h-1.5'} rounded-full bg-[#f59e0b]`} />
            <span className={`${isSm ? 'w-[4.5px] h-[4.5px]' : 'w-1.5 h-1.5'} rounded-full bg-[#10b981]`} />
            <span className={`${isSm ? 'w-[4.5px] h-[4.5px]' : 'w-1.5 h-1.5'} rounded-full bg-[#8b5cf6]`} />
            <span className={`${isSm ? 'w-[4.5px] h-[4.5px]' : 'w-1.5 h-1.5'} rounded-full bg-[#06b6d4]`} />
          </span>
        </span>
      );
    case 'booking-com':
      return (
        <span
          className={`${
            isSm ? 'text-[15px]' : 'text-[20px]'
          } font-extrabold tracking-tight leading-none font-display select-none`}
        >
          <span className="text-[#003580]">Booking</span>
          <span className="text-[#009fe3]">.com</span>
        </span>
      );
    case 'makemytrip-hotels':
      return (
        <span
          className={`${
            isSm ? 'text-[15px]' : 'text-[20px]'
          } font-extrabold tracking-tight leading-none font-display select-none`}
        >
          <span className="text-[#05203c]">make</span>
          <span className="text-[#eb2026] italic">my</span>
          <span className="text-[#05203c]">trip</span>
        </span>
      );
    case 'tripyeah-hotels-direct':
      return (
        <span className="inline-flex items-baseline gap-1 leading-none font-display select-none">
          <span className={`${isSm ? 'text-[15px]' : 'text-[20px]'} font-extrabold tracking-tight`}>
            <span className="text-[#05203c]">Trip</span>
            <span className="text-blue-600">Yeah</span>
          </span>
          <span className={`${isSm ? 'text-[10px]' : 'text-xs'} font-semibold text-slate-500`}>
            Hotels
          </span>
        </span>
      );
    case 'expedia':
      return (
        <span
          className={`inline-flex items-center ${isSm ? 'gap-1 text-[15px]' : 'gap-1.5 text-[20px]'} font-extrabold tracking-tight text-[#001959] leading-none font-display select-none`}
        >
          <span
            className={`${isSm ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full bg-[#febb02] inline-block shrink-0`}
            aria-hidden="true"
          />
          <span>Expedia</span>
        </span>
      );
    case 'hotels-com':
      return (
        <span
          className={`${
            isSm ? 'text-[15px]' : 'text-[20px]'
          } font-extrabold tracking-tight text-[#d32f2f] leading-none font-display select-none`}
        >
          Hotels.com
        </span>
      );
    case 'goibibo-hotels':
      return (
        <span
          className={`${
            isSm ? 'text-[16px]' : 'text-[21px]'
          } font-extrabold tracking-tight leading-none font-display select-none`}
        >
          <span className="text-[#ff6d38]">go</span>
          <span className="text-[#2276e3]">ibibo</span>
        </span>
      );
    case 'hotel-official':
    default:
      return (
        <span className="inline-flex items-baseline gap-1.5 leading-none select-none">
          <span className={`font-serif ${isSm ? 'text-[14px]' : 'text-[19px]'} font-bold tracking-tight text-slate-900`}>
            {shortBrand}
          </span>
          <span className={`${isSm ? 'text-[10px]' : 'text-xs'} font-medium text-slate-500`}>
            Official Site
          </span>
        </span>
      );
  }
};
