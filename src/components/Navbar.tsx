import React from 'react';
import { Building2, Luggage, Sparkles, Globe, User, ChevronDown } from 'lucide-react';
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
  onOpenAuth: () => void;
  tripsCount: number;
  userName: string | null;
}

const NAV_ITEMS: { id: BookingCategory; label: string }[] = [
  { id: 'flights', label: 'Flights' },
  { id: 'trains', label: 'Trains' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'buses', label: 'Buses' },
  { id: 'cabs', label: 'Cabs' },
  { id: 'holidays', label: 'Holidays' },
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

  // Categories should ONLY show in top row after searching (search-results page),
  // on front page (home) they are hidden to keep the header clean and uncluttered.
  const isSearchResultsPage = activePage === 'search-results';

  return (
    <header
      className={`relative z-40 w-full ${
        isDarkHeader
          ? 'bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-transparent'
          : 'bg-white'
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

        {/* Zone 2: Conditional Navigation / Middle Section */}
        {isSearchResultsPage ? (
          /* ONLY SHOWN AFTER SEARCH: 6 Category Buttons in top navigation row */
          <nav
            aria-label="Travel search categories"
            className="hidden md:flex items-center gap-1.5 lg:gap-2.5 text-xs lg:text-sm font-medium text-slate-600 animate-fadeIn"
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
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        ) : (
          /* ON FRONT PAGE (HOME): The categories are NOT duplicated here.
             Instead, we highlight "List Your Property" and "Trip AI" (shorter name) */
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* List Your Property — clean & borderless like My Trips */}
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

            {/* International Planner "Trip AI" — clean & borderless like My Trips */}
            <button
              type="button"
              onClick={() => onNavigatePage('international-planner')}
              title="Open International Trip AI Planner"
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
                isDarkHeader
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isDarkHeader ? 'text-amber-300 animate-pulse' : 'text-indigo-600'}`} />
              <span>Trip AI</span>
            </button>
          </div>
        )}

        {/* Zone 3: Global Actions: List Property, Trip AI (if search-results), Language/Currency, My Trips, Login/Account */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Trip AI shortcut if on search-results page */}
          {isSearchResultsPage && (
            <button
              type="button"
              onClick={() => onNavigatePage('international-planner')}
              title="Open International Trip AI Planner"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Trip AI</span>
            </button>
          )}

          {/* Mobile shortcut for Trip AI — clean & borderless */}
          <button
            type="button"
            onClick={() => onNavigatePage('international-planner')}
            className={`md:hidden px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              isDarkHeader
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-amber-300' : 'text-indigo-600'}`} />
            <span>Trip AI</span>
          </button>

          {/* List Your Property shortcut on search page */}
          {isSearchResultsPage && (
            <button
              type="button"
              onClick={onOpenListProperty}
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>List Property</span>
            </button>
          )}

          {/* Language, Region & Currency Selector — clean & borderless like My Trips */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            title="Change Language, Region & Currency"
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkHeader
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <Globe className={`w-4 h-4 ${isDarkHeader ? 'text-sky-300' : 'text-slate-500'}`} />
            <span className={`hidden sm:inline ${isDarkHeader ? 'text-white/90' : 'text-slate-800'}`}>{langCode} ·</span>
            <span>{regionFlag}</span>
            <span className={`font-mono-tabular font-bold ${isDarkHeader ? 'text-white' : 'text-slate-900'}`}>{currency}</span>
            <ChevronDown className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-white/70' : 'text-slate-400'}`} />
          </button>

          {/* My Trips */}
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

          {/* STYLISH Login or Create Account Button */}
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
      </div>
    </header>
  );
};
