import React from 'react';
import { Building2, Luggage, Sparkles, Globe, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { BookingCategory, CurrencyCode, CURRENCY_RATES } from '../data/travelData';
import { TripYeahLogo } from './TripYeahLogo';

export type AppPageView =
  | 'home'
  | 'search-results'
  | 'hotel-details'
  | 'checkout'
  | 'trips'
  | 'account'
  | 'admin'
  | 'international-planner'
  | 'explore'
  | 'influencers'
  | 'dining-club'
  | 'privacy-policy'
  | 'support'
  | 'terms-of-service'
  | 'about-us';

interface NavbarProps {
  activePage: AppPageView;
  activeCategory: BookingCategory;
  onSelectCategory: (cat: BookingCategory) => void;
  onNavigatePage: (page: AppPageView) => void;
  currency: CurrencyCode;
  language?: string;
  region?: string;
  onOpenLanguageModal: () => void;
  onOpenListProperty: () => void;
  onOpenInsurance: () => void;
  onOpenAuth: () => void;
  onOpenOffers?: () => void;
  tripsCount: number;
  userName: string | null;
  userRole?: 'user' | 'admin';
}

// Region flag helper
const REGION_FLAGS: Record<string, string> = {
  India: '🇮🇳',
  'United States': '🇺🇸',
  'United Arab Emirates': '🇦🇪',
  'United Kingdom': '🇬🇧',
  'European Union': '🇪🇺',
  Singapore: '🇸🇬',
  Canada: '🇨🇦',
};

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  activeCategory,
  onSelectCategory,
  onNavigatePage,
  currency,
  language = 'English',
  region = 'India',
  onOpenLanguageModal,
  onOpenListProperty,
  onOpenInsurance,
  onOpenAuth,
  onOpenOffers,
  tripsCount,
  userName,
  userRole = 'user',
}) => {
  // Flag for current region
  const regionFlag = REGION_FLAGS[region] || '🇮🇳';
  const currencySymbol = CURRENCY_RATES[currency]?.symbol?.trim() || '₹';
  const langCode = language.includes('(') ? language.split('(')[1].replace(')', '') : language.slice(0, 2).toUpperCase();

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Front page (home), international planner, explore, influencers, trips, account, and support have scenic backgrounds behind the navbar
  const isDarkHeader =
    activePage === 'home' ||
    activePage === 'international-planner' ||
    activePage === 'explore' ||
    activePage === 'influencers' ||
    activePage === 'dining-club' ||
    activePage === 'trips' ||
    activePage === 'account' ||
    activePage === 'support';

  // Categories show in top navigation after searching (search-results page or checkout)
  const isSearchResultsPage = activePage === 'search-results';

  return (
    <header
      className={`relative z-40 w-full ${
        isDarkHeader
          ? 'bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-transparent'
          : 'bg-white border-b border-slate-100 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand Wordmark, Go Global & Explore */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer group transition-transform active:scale-95 py-1"
            title="TripYeah — Home"
            aria-label="TripYeah Home"
          >
            <TripYeahLogo
              isDarkHeader={isDarkHeader}
              className="h-8 sm:h-9 md:h-10 w-auto"
            />
          </a>

          {/* Go Global Option (No box, no shadow) */}
          <button
            type="button"
            onClick={() => onNavigatePage('international-planner')}
            title="Go Global — International Itineraries & Visa Guide"
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer ${
              activePage === 'international-planner'
                ? isDarkHeader ? 'text-sky-300 font-bold' : 'text-blue-600 font-bold'
                : isDarkHeader
                ? 'text-white/85 hover:text-white'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <Globe className={`w-4 h-4 ${isDarkHeader ? 'text-sky-300' : 'text-blue-600'}`} />
            <span>Go Global</span>
          </button>
        </div>

        {/* Zone 2: Navigation (Clean links without category tabs) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <button
            type="button"
            onClick={onOpenListProperty}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkHeader
                ? 'text-white/85 hover:text-white'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <Building2 className={`w-4 h-4 ${isDarkHeader ? 'text-sky-300' : 'text-blue-600'}`} />
            <span>List Your Property</span>
          </button>

          {/* Travel Insurance Option */}
          <button
            type="button"
            onClick={onOpenInsurance}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkHeader
                ? 'text-white/85 hover:text-white'
                : 'text-slate-700 hover:text-emerald-600'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${isDarkHeader ? 'text-emerald-300' : 'text-emerald-600'}`} />
            <span>Travel Insurance</span>
          </button>
        </div>

        {/* Zone 3: Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 shrink-0">
          {/* 1. My Trips (No background, no border, no hover box) */}
          <button
            type="button"
            onClick={() => onNavigatePage('trips')}
            title="View My Booked Trips"
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer ${
              activePage === 'trips'
                ? isDarkHeader ? 'text-sky-300 font-bold' : 'text-blue-600 font-bold'
                : isDarkHeader
                ? 'text-white/85 hover:text-white'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <Luggage className={`w-4 h-4 ${isDarkHeader ? 'text-sky-300' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">My Trips</span>
          </button>

          {/* 2. Flag, Currency Code & Language Selector */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            title="Change Region, Currency & Language"
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkHeader
                ? 'text-white/85 hover:text-white'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <span className="text-sm sm:text-base leading-none">{regionFlag}</span>
            <span className={`font-mono-tabular font-bold ${isDarkHeader ? 'text-white' : 'text-slate-900'}`}>{currency}</span>
            <span className={isDarkHeader ? 'text-white/60' : 'text-slate-400'}>&</span>
            <span className={`font-medium ${isDarkHeader ? 'text-white/90' : 'text-slate-700'}`}>{language}</span>
            <ChevronDown className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-white/70' : 'text-slate-400'}`} />
          </button>

          {/* Admin Company Management Portal button */}
          {userName && userRole === 'admin' && (
            <button
              type="button"
              onClick={() => onNavigatePage('admin')}
              title="Open TripYeah Company Management & Extranet"
              className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer border ${
                activePage === 'admin'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/40'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 border-amber-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Company Admin</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

          {/* Login or Account Button */}
          {userName ? (
            <button
              type="button"
              onClick={() => onNavigatePage('account')}
              title={`Logged in as ${userName} - Account Settings`}
              className={`relative group px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 border ${
                isDarkHeader
                  ? 'bg-gradient-to-r from-white via-slate-50 to-blue-50 text-slate-900 border-white/60 shadow-white/15'
                  : 'bg-gradient-to-r from-[#111827] to-slate-800 text-white border-slate-700 shadow-slate-900/20'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <User className="w-3 h-3" />
              </span>
              <span className="max-w-[100px] sm:max-w-[130px] truncate">{userName}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              title="Login or Create a TripYeah Account"
              className={`relative group overflow-hidden px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-tight shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 border ${
                isDarkHeader
                  ? 'bg-gradient-to-r from-white via-sky-50 to-blue-100 hover:from-white hover:to-sky-50 text-slate-950 border-white/80 shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_25px_rgba(56,189,248,0.35)]'
                  : 'bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-400/40 shadow-blue-600/30 hover:shadow-blue-600/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform ${
                isDarkHeader
                  ? 'bg-gradient-to-tr from-[#2563EB] to-indigo-600 text-white'
                  : 'bg-white/20 text-white'
              }`}>
                <User className="w-3 h-3" />
              </span>
              <span className={isDarkHeader ? 'bg-gradient-to-r from-slate-950 to-blue-950 bg-clip-text text-transparent font-extrabold' : 'font-bold'}>
                Login or Create Account
              </span>
              <Sparkles className={`w-3.5 h-3.5 transition-transform group-hover:rotate-12 ${
                isDarkHeader ? 'text-amber-500' : 'text-amber-300'
              }`} />
            </button>
          )}
          </div>
        </div>
    </header>
  );
};
