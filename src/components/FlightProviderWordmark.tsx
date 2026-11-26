import React from 'react';
import { FlightPartnerId } from '../utils/flightCompareUtils';

interface FlightProviderWordmarkProps {
  providerId: FlightPartnerId;
  airlineName?: string;
  size?: 'sm' | 'md';
}

function getAirlineAccentClass(airlineName: string): string {
  const lower = airlineName.toLowerCase();
  if (lower.includes('indigo')) return 'text-[#001b94]';
  if (lower.includes('air india')) return 'text-[#b91c1c]';
  if (lower.includes('akasa')) return 'text-[#ea580c]';
  if (lower.includes('spicejet')) return 'text-[#dc2626]';
  if (lower.includes('vistara')) return 'text-[#581c87]';
  if (lower.includes('british')) return 'text-[#075985]';
  if (lower.includes('virgin')) return 'text-[#be123c]';
  if (lower.includes('emirates')) return 'text-[#b91c1c]';
  if (lower.includes('delta')) return 'text-[#1e3a8a]';
  if (lower.includes('lufthansa')) return 'text-[#0a1d4a]';
  if (lower.includes('qatar')) return 'text-[#5c0632]';
  return 'text-slate-900';
}

export const FlightProviderWordmark: React.FC<FlightProviderWordmarkProps> = ({
  providerId,
  airlineName = 'Airline',
  size = 'md',
}) => {
  const isSm = size === 'sm';

  switch (providerId) {
    case 'tripyeah-direct':
      return (
        <span className="inline-flex items-baseline gap-1.5 leading-none font-display select-none">
          <span className={`${isSm ? 'text-[17px]' : 'text-[22px]'} font-extrabold tracking-tight`}>
            <span className="text-[#05203c]">Trip</span>
            <span className="text-blue-600">Yeah</span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            Official
          </span>
        </span>
      );

    case 'makemytrip':
      return (
        <span
          className={`${
            isSm ? 'text-[17px]' : 'text-[22px]'
          } font-extrabold tracking-tight leading-none font-display select-none`}
          aria-label="MakeMyTrip"
        >
          <span className="text-[#05203c]">make</span>
          <span className="text-[#eb2026] italic">my</span>
          <span className="text-[#05203c]">trip</span>
        </span>
      );

    case 'easemytrip':
      return (
        <span
          className={`inline-flex items-baseline ${
            isSm ? 'text-[17px]' : 'text-[22px]'
          } font-extrabold tracking-tight leading-none font-display select-none`}
          aria-label="EaseMyTrip"
        >
          <span className="text-[#0077b6]">Ease</span>
          <span className="text-[#00a8e8] italic">My</span>
          <span className="text-[#05203c]">Trip</span>
          <span className="text-[11px] font-bold text-[#00a8e8] ml-0.5">.com</span>
        </span>
      );

    case 'cleartrip':
      return (
        <span
          className={`inline-flex items-center gap-1 ${
            isSm ? 'text-[17px]' : 'text-[22px]'
          } font-extrabold tracking-tight leading-none font-display select-none`}
          aria-label="Cleartrip"
        >
          <span className="text-[#e34824]">clear</span>
          <span className="text-[#f36b21]">trip</span>
          <span
            className="w-2 h-2 rounded-xs bg-[#e34824] rotate-45 inline-block ml-0.5"
            aria-hidden="true"
          />
        </span>
      );

    case 'goibibo':
      return (
        <span
          className={`${
            isSm ? 'text-[18px]' : 'text-[23px]'
          } font-extrabold tracking-tight leading-none font-display select-none`}
          aria-label="Goibibo"
        >
          <span className="text-[#ff6d38]">go</span>
          <span className="text-[#2276e3]">ibibo</span>
        </span>
      );

    case 'expedia':
      return (
        <span
          className={`inline-flex items-center ${
            isSm ? 'gap-1.5 text-[17px]' : 'gap-2 text-[22px]'
          } font-extrabold tracking-tight text-[#001959] leading-none font-display select-none`}
          aria-label="Expedia"
        >
          <span
            className={`${isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} rounded-full bg-[#febb02] inline-block shrink-0`}
            aria-hidden="true"
          />
          <span>Expedia</span>
        </span>
      );

    case 'airline-direct':
    default:
      return (
        <span className="inline-flex items-baseline gap-2 leading-none select-none flex-wrap">
          <span
            className={`font-display ${
              isSm ? 'text-[17px]' : 'text-[21px]'
            } font-extrabold tracking-tight ${getAirlineAccentClass(airlineName)}`}
          >
            {airlineName}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
            Official Site
          </span>
        </span>
      );
  }
};
