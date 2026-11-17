import React from 'react';

interface CountryFlagProps {
  countryOrCode: string;
  className?: string;
}

const NAME_TO_CODE: Record<string, string> = {
  India: 'IN',
  IN: 'IN',
  '🇮🇳': 'IN',
  'United States': 'US',
  US: 'US',
  '🇺🇸': 'US',
  'United Arab Emirates': 'AE',
  AE: 'AE',
  '🇦🇪': 'AE',
  'United Kingdom': 'GB',
  GB: 'GB',
  UK: 'GB',
  '🇬🇧': 'GB',
  'European Union': 'EU',
  EU: 'EU',
  '🇪🇺': 'EU',
  Singapore: 'SG',
  SG: 'SG',
  '🇸🇬': 'SG',
  Canada: 'CA',
  CA: 'CA',
  '🇨🇦': 'CA',
  fr: 'FR',
  FR: 'FR',
  '🇫🇷': 'FR',
  de: 'DE',
  DE: 'DE',
  '🇩🇪': 'DE',
  es: 'ES',
  ES: 'ES',
  '🇪🇸': 'ES',
  ja: 'JP',
  JP: 'JP',
  '🇯🇵': 'JP',
  ko: 'KR',
  KR: 'KR',
  '🇰🇷': 'KR',
  zh: 'CN',
  CN: 'CN',
  '🇨🇳': 'CN',
  ar: 'SA',
  SA: 'SA',
  '🇸🇦': 'SA',
  ru: 'RU',
  RU: 'RU',
  '🇷🇺': 'RU',
  pt: 'BR',
  BR: 'BR',
  '🇧🇷': 'BR',
  th: 'TH',
  TH: 'TH',
  '🇹🇭': 'TH',
  en: 'US',
  hi: 'IN',
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryOrCode,
  className = 'w-5 h-3.5',
}) => {
  const code = NAME_TO_CODE[countryOrCode] || NAME_TO_CODE[countryOrCode.toUpperCase()] || 'IN';

  const baseClass = `inline-block shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(15,23,42,0.12)] overflow-hidden align-middle ${className}`;

  switch (code) {
    case 'IN':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="India flag" role="img">
          <rect width="30" height="6.67" y="0" fill="#FF9933" />
          <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" y="13.33" fill="#138808" />
          <circle cx="15" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth="0.65" />
          <circle cx="15" cy="10" r="0.55" fill="#000080" />
          <g stroke="#000080" strokeWidth="0.3">
            <line x1="15" y1="7.6" x2="15" y2="12.4" />
            <line x1="12.6" y1="10" x2="17.4" y2="10" />
            <line x1="13.3" y1="8.3" x2="16.7" y2="11.7" />
            <line x1="16.7" y1="8.3" x2="13.3" y2="11.7" />
          </g>
        </svg>
      );

    case 'US':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="United States flag" role="img">
          <rect width="30" height="20" fill="#FFFFFF" />
          <rect width="30" height="2.85" y="0" fill="#B22234" />
          <rect width="30" height="2.85" y="5.71" fill="#B22234" />
          <rect width="30" height="2.85" y="11.42" fill="#B22234" />
          <rect width="30" height="2.86" y="17.14" fill="#B22234" />
          <rect width="13.5" height="11.42" x="0" y="0" fill="#3C3B6E" />
          <g fill="#FFFFFF">
            <circle cx="2.5" cy="2.5" r="0.7" />
            <circle cx="6.7" cy="2.5" r="0.7" />
            <circle cx="10.9" cy="2.5" r="0.7" />
            <circle cx="4.6" cy="5.5" r="0.7" />
            <circle cx="8.8" cy="5.5" r="0.7" />
            <circle cx="2.5" cy="8.5" r="0.7" />
            <circle cx="6.7" cy="8.5" r="0.7" />
            <circle cx="10.9" cy="8.5" r="0.7" />
          </g>
        </svg>
      );

    case 'AE':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="United Arab Emirates flag" role="img">
          <rect width="22" height="6.67" x="8" y="0" fill="#00732F" />
          <rect width="22" height="6.67" x="8" y="6.67" fill="#FFFFFF" />
          <rect width="22" height="6.67" x="8" y="13.33" fill="#000000" />
          <rect width="8" height="20" x="0" y="0" fill="#FF0000" />
        </svg>
      );

    case 'GB':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="United Kingdom flag" role="img">
          <rect width="30" height="20" fill="#012169" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="3.5" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="1.6" />
          <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="5.2" />
          <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3" />
        </svg>
      );

    case 'EU':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="European Union flag" role="img">
          <rect width="30" height="20" fill="#003399" />
          <g fill="#FFCC00">
            <circle cx="15" cy="4.2" r="0.85" />
            <circle cx="15" cy="15.8" r="0.85" />
            <circle cx="9.2" cy="10" r="0.85" />
            <circle cx="20.8" cy="10" r="0.85" />
            <circle cx="10.9" cy="5.9" r="0.85" />
            <circle cx="19.1" cy="5.9" r="0.85" />
            <circle cx="10.9" cy="14.1" r="0.85" />
            <circle cx="19.1" cy="14.1" r="0.85" />
          </g>
        </svg>
      );

    case 'SG':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Singapore flag" role="img">
          <rect width="30" height="10" y="0" fill="#EF3340" />
          <rect width="30" height="10" y="10" fill="#FFFFFF" />
          <circle cx="6.5" cy="5" r="3" fill="#FFFFFF" />
          <circle cx="7.7" cy="5" r="2.6" fill="#EF3340" />
          <g fill="#FFFFFF">
            <circle cx="9.2" cy="3.4" r="0.55" />
            <circle cx="11" cy="4.6" r="0.55" />
            <circle cx="10.3" cy="6.6" r="0.55" />
            <circle cx="8.1" cy="6.6" r="0.55" />
            <circle cx="7.5" cy="4.6" r="0.55" />
          </g>
        </svg>
      );

    case 'CA':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Canada flag" role="img">
          <rect width="7.5" height="20" x="0" y="0" fill="#FF0000" />
          <rect width="15" height="20" x="7.5" y="0" fill="#FFFFFF" />
          <rect width="7.5" height="20" x="22.5" y="0" fill="#FF0000" />
          <path
            d="M15,4 L16.2,7.2 L18.8,6.5 L17.6,9.2 L19.6,10.2 L17.2,11.6 L17.5,13.3 L15.5,12.8 L15.5,15.8 L14.5,15.8 L14.5,12.8 L12.5,13.3 L12.8,11.6 L10.4,10.2 L12.4,9.2 L11.2,6.5 L13.8,7.2 Z"
            fill="#FF0000"
          />
        </svg>
      );

    case 'FR':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="France flag" role="img">
          <rect width="10" height="20" x="0" fill="#002395" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#ED2939" />
        </svg>
      );

    case 'DE':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Germany flag" role="img">
          <rect width="30" height="6.67" y="0" fill="#000000" />
          <rect width="30" height="6.67" y="6.67" fill="#DD0000" />
          <rect width="30" height="6.67" y="13.33" fill="#FFCE00" />
        </svg>
      );

    case 'ES':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Spain flag" role="img">
          <rect width="30" height="5" y="0" fill="#AA151B" />
          <rect width="30" height="10" y="5" fill="#F1BF00" />
          <rect width="30" height="5" y="15" fill="#AA151B" />
          <rect width="3" height="4.5" x="7" y="7.7" rx="1" fill="#AA151B" />
        </svg>
      );

    case 'JP':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Japan flag" role="img">
          <rect width="30" height="20" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="5" fill="#BC002D" />
        </svg>
      );

    case 'KR':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="South Korea flag" role="img">
          <rect width="30" height="20" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="4.5" fill="#CD2E3A" />
          <path d="M10.5,10 A4.5,4.5 0 0,0 19.5,10 A2.25,2.25 0 0,1 15,10 A2.25,2.25 0 0,0 10.5,10 Z" fill="#0047A0" />
        </svg>
      );

    case 'CN':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="China flag" role="img">
          <rect width="30" height="20" fill="#DE2910" />
          <circle cx="6.2" cy="6" r="2.1" fill="#FFDE00" />
          <circle cx="10.2" cy="3.5" r="0.6" fill="#FFDE00" />
          <circle cx="11.5" cy="5.5" r="0.6" fill="#FFDE00" />
          <circle cx="11.2" cy="7.8" r="0.6" fill="#FFDE00" />
          <circle cx="9.6" cy="9.2" r="0.6" fill="#FFDE00" />
        </svg>
      );

    case 'SA':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Saudi Arabia flag" role="img">
          <rect width="30" height="20" fill="#006C35" />
          <rect width="16" height="1.5" x="7" y="13.5" rx="0.7" fill="#FFFFFF" />
          <path d="M8,8.5 H22" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="2 1" />
        </svg>
      );

    case 'RU':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Russia flag" role="img">
          <rect width="30" height="6.67" y="0" fill="#FFFFFF" />
          <rect width="30" height="6.67" y="6.67" fill="#0039A6" />
          <rect width="30" height="6.67" y="13.33" fill="#D52B1E" />
        </svg>
      );

    case 'BR':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Brazil flag" role="img">
          <rect width="30" height="20" fill="#009C3B" />
          <polygon points="15,2.5 26.5,10 15,17.5 3.5,10" fill="#FFDF00" />
          <circle cx="15" cy="10" r="3.8" fill="#002776" />
        </svg>
      );

    case 'TH':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="Thailand flag" role="img">
          <rect width="30" height="3.33" y="0" fill="#A51931" />
          <rect width="30" height="3.33" y="3.33" fill="#F4F5F8" />
          <rect width="30" height="6.67" y="6.67" fill="#2D2A4A" />
          <rect width="30" height="3.33" y="13.33" fill="#F4F5F8" />
          <rect width="30" height="3.34" y="16.66" fill="#A51931" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 30 20" className={baseClass} aria-label="India flag" role="img">
          <rect width="30" height="6.67" y="0" fill="#FF9933" />
          <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" y="13.33" fill="#138808" />
          <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.6" />
        </svg>
      );
  }
};
