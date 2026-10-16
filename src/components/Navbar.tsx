import React from 'react';
import { Building2, Luggage, Sparkles, Globe, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { BookingCategory, CurrencyCode, CURRENCY_RATES } from '../data/travelData';

export type AppPageView =
  | 'home'
  | 'search-results'
  | 'checkout'
  | 'trips'
  | 'account'
  | 'admin'
  | 'international-planner';

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
  tripsCount: number;
  userName: string | null;
}

const NAV_ITEMS: { id: BookingCategory; label: string }[] = [
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'trains', label: 'Trains' },
  { id: 'buses', label: 'Buses' },
  { id: 'cabs', label: 'Cabs' },
  { id: 'holidays', label: 'Holidays' },
  { id: 'experiences', label: 'Tours & Experiences' },
];

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
  tripsCount,
  userName,
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

  // Front page (home) and international planner have scenic backgrounds behind the navbar
  const isDarkHeader = activePage === 'home' || activePage === 'international-planner';

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
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-display text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer group transition-colors ${
              isDarkHeader ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span className="w-8 h-8 rounded-xl bg-[#2563EB] group-hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-colors">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21.426 2.574a1.25 1.25 0 0 0-1.32-.24L2.856 9.584a1.25 1.25 0 0 0 .06 2.333l7.02 2.34 2.34 7.02a1.25 1.25 0 0 0 2.333.06l7.05-17.25a1.25 1.25 0 0 0-.233-1.513Z" />
              </svg>
            </span>
            <span className={isDarkHeader ? 'drop-shadow-sm' : ''}>TripYeah</span>
          </a>
        </div>

        {/* Zone 2: Navigation Categories */}
        {isSearchResultsPage ? (
          /* ONLY SHOWN AFTER SEARCH: Flights, Hotels, Trains, etc. Category Buttons */
          <nav
            aria-label="Travel search categories"
            className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 text-xs sm:text-sm font-medium text-slate-600 overflow-x-auto no-scrollbar py-1"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectCategory(item.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                      : 'hover:text-slate-900 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        ) : (
          /* ON FRONT PAGE (HOME): List Your Property & Travel Insurance */
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              type="button"
              onClick={onOpenListProperty}
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
                isDarkHeader
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className={`w-4 h-4 ${isDarkHeader ? 'text-sky-300' : 'text-blue-600'}`} />
              <span>List Your Property</span>
            </button>

            {/* Travel Insurance Option right after List Your Property */}
            <button
              type="button"
              onClick={onOpenInsurance}
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
                isDarkHeader
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isDarkHeader ? 'text-emerald-300' : 'text-emerald-600'}`} />
              <span>Travel Insurance</span>
            </button>
          </div>
        )}

        {/* Zone 3: Right Side Actions */}
        {isSearchResultsPage ? (
          /* ON SEARCH RESULTS: Strictly ONLY the front page's Login or Create Account option (No Trip AI, No clutter) */
          <div className="flex items-center gap-2 shrink-0">
            {userName ? (
              <button
                type="button"
                onClick={() => onNavigatePage('account')}
                title={`Logged in as ${userName} - Account Settings`}
                className="relative group px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 bg-gradient-to-r from-[#111827] to-slate-800 text-white border border-slate-700 shadow-slate-900/20"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <User className="w-3 h-3" />
                </span>
                <span>{userName}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                title="Login or Create a TripYeah Account"
                className="relative group overflow-hidden px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-tight shadow-md hover:shadow-xl active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white border border-blue-400/40 shadow-blue-600/30 hover:shadow-blue-600/40"
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform bg-white/20 text-white">
                  <User className="w-3 h-3" />
                </span>
                <span className="font-bold">
                  Login or Create Account
                </span>
                <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:rotate-12 text-amber-300" />
              </button>
            )}
          </div>
        ) : (
          /* ON FRONT PAGE (HOME): Global Actions: My Trips -> Flag Currency & Language -> Login/Account */
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* 1. My Trips */}
            <button
              type="button"
              onClick={() => onNavigatePage('trips')}
              title="View My Booked Trips"
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'trips'
                  ? 'bg-blue-600 text-white font-bold'
                  : isDarkHeader
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              <Luggage className={`w-4 h-4 ${isDarkHeader ? 'text-sky-300' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">My Trips</span>
              {tripsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[11px] font-bold leading-none">
                  {tripsCount}
                </span>
              )}
            </button>

            {/* 2. Flag, Currency Code & Language Selector (placed right before Login) */}
            <button
              type="button"
              onClick={onOpenLanguageModal}
              title="Change Region, Currency & Language"
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl whitespace-nowrap shrink-0 cursor-pointer border ${
                isDarkHeader
                  ? 'text-white/95 border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-xs'
                  : 'text-slate-700 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-blue-600'
              }`}
            >
              <span className="text-sm sm:text-base leading-none">{regionFlag}</span>
              <span className={`font-mono-tabular font-bold ${isDarkHeader ? 'text-white' : 'text-slate-900'}`}>{currency}</span>
              <span className={isDarkHeader ? 'text-white/60' : 'text-slate-400'}>&</span>
              <span className={`font-medium ${isDarkHeader ? 'text-white/90' : 'text-slate-700'}`}>{language}</span>
              <ChevronDown className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-white/70' : 'text-slate-400'}`} />
            </button>

            {/* Front Page Login or Create Account Button */}
            {userName ? (
              <button
                type="button"
                onClick={() => onNavigatePage('account')}
                title={`Logged in as ${userName} - Account Settings`}
                className={`relative group px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 border ${
                  isDarkHeader
                    ? 'bg-gradient-to-r from-white via-slate-50 to-blue-50 text-slate-900 border-white/60 shadow-white/15'
                    : 'bg-gradient-to-r from-[#111827] to-slate-800 text-white border-slate-700 shadow-slate-900/20'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <User className="w-3 h-3" />
                </span>
                <span>{userName}</span>
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
        )}
      </div>
    </header>
  );
};
