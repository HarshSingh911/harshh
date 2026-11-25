import React from 'react';
import { User, ChevronDown, ShieldCheck, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookingCategory, CurrencyCode } from '../data/travelData';
import { TripYeahLogo } from './TripYeahLogo';
import { CountryFlag } from './CountryFlag';

export type AppPageView =
  | 'home'
  | 'search-results'
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
  | 'about-us'
  | 'hostels'
  | 'experience-checkout'
  | 'holiday-checkout';

interface NavbarProps {
  activePage: AppPageView;
  activeCategory: BookingCategory;
  onSelectCategory: (cat: BookingCategory) => void;
  onNavigatePage: (page: AppPageView) => void;
  currency: CurrencyCode;
  language?: string;
  region?: string;
  onOpenLanguageModal: () => void;
  onOpenListProperty?: () => void;
  onOpenInsurance?: () => void;
  onOpenAuth: (redirectTarget?: AppPageView) => void;
  onOpenOffers?: () => void;
  tripsCount: number;
  userName: string | null;
  userRole?: 'user' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  activeCategory,
  onNavigatePage,
  currency,
  language = 'English',
  region = 'India',
  onOpenLanguageModal,
  onOpenAuth,
  userName,
  userRole = 'user',
}) => {
  const isSeamlessOceanHeader =
    (activePage === 'search-results' || activePage === 'checkout') &&
    ((activeCategory as string) === 'flights' ||
      (activeCategory as string) === 'hotels' ||
      (activeCategory as string) === 'cabs');

  // Front page (home), international planner, explore, influencers, trips, account, support, and ocean-header results/checkout have dark/scenic backgrounds behind the navbar
  const isDarkHeader =
    activePage === 'home' ||
    activePage === 'international-planner' ||
    activePage === 'explore' ||
    activePage === 'influencers' ||
    activePage === 'dining-club' ||
    activePage === 'trips' ||
    activePage === 'account' ||
    activePage === 'support' ||
    activePage === 'hostels' ||
    isSeamlessOceanHeader;

  const { t } = useTranslation();

  return (
    <header
      className={`relative z-40 w-full ${
        isSeamlessOceanHeader
          ? 'bg-transparent'
          : isDarkHeader
          ? 'bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-transparent'
          : 'bg-white border-b border-slate-100 shadow-xs'
      }`}
    >
      <div
        className={`h-16 flex items-center justify-between gap-4 ${
          isSeamlessOceanHeader
            ? 'w-full px-3 sm:px-5 lg:px-6'
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        }`}
      >
        {/* Left: Brand Logo Only - Perfectly leveled in one horizontal line with the header navigation */}
        <div className="flex items-center shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer group transition-transform active:scale-95"
            title="TripYehh — Home"
            aria-label="TripYehh Home"
          >
            <TripYeahLogo
              isDarkHeader={isDarkHeader}
              className="h-8.5 sm:h-9 md:h-[35px] w-auto -translate-y-1.5 md:-translate-y-[7px]"
            />
          </a>
        </div>

        {/* Right: All Header Options Grouped Together with Uniform Spacing */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 lg:gap-6 shrink-0">
          {/* 1. Help / Support Center */}
          <button
            type="button"
            onClick={() => onNavigatePage('support')}
            title="Open Support Center"
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkHeader
                ? activePage === 'support'
                  ? 'text-white underline underline-offset-4'
                  : 'text-white/90 hover:text-white'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <HelpCircle className={`w-4 h-4 ${isDarkHeader ? 'text-white' : 'text-slate-700'}`} />
            <span>{t('nav.help', 'Help')}</span>
          </button>

          {/* Divider between Help and Currency / Language Selector */}
          <span
            className={`inline-block text-sm font-light select-none ${
              isDarkHeader ? 'text-white/35' : 'text-slate-300'
            }`}
            aria-hidden="true"
          >
            |
          </span>

          {/* 5. Flag, Currency Code & Language Selector */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            title={t('modal.title', 'Change Region, Currency & Language')}
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkHeader
                ? 'text-white/85 hover:text-white'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <CountryFlag countryOrCode={region} className="w-5 h-3.5 sm:w-[22px] sm:h-[15px]" />
            <span className={`font-mono-tabular font-bold ${isDarkHeader ? 'text-white' : 'text-slate-900'}`}>{currency}</span>
            <span className={isDarkHeader ? 'text-white/60' : 'text-slate-400'}>|</span>
            <span className={`font-medium ${isDarkHeader ? 'text-white/90' : 'text-slate-700'}`}>{language}</span>
            <ChevronDown className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-white/70' : 'text-slate-400'}`} />
          </button>

          {/* Admin Portal button (when admin is signed in) */}
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
              <span className="hidden sm:inline">{t('nav.companyAdmin', 'Company Admin')}</span>
              <span className="sm:hidden">{t('nav.admin', 'Admin')}</span>
            </button>
          )}

          {/* 6. Login or Account Button */}
          {userName ? (
            <button
              type="button"
              onClick={() => onNavigatePage('account')}
              title={`Logged in as ${userName} - ${t('nav.accountSettings', 'Account Settings')}`}
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
              onClick={() => onOpenAuth()}
              title={t('nav.loginOrCreate', 'Log in')}
              className={`relative group h-10 sm:h-11 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-bold tracking-tight leading-normal shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center border ${
                isDarkHeader
                  ? 'bg-gradient-to-r from-white via-sky-50 to-blue-100 hover:from-white hover:to-sky-50 text-slate-950 border-white/80 shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_25px_rgba(56,189,248,0.35)]'
                  : 'bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-400/40 shadow-blue-600/30 hover:shadow-blue-600/40'
              }`}
            >
              <span className={`whitespace-nowrap leading-normal ${isDarkHeader ? 'text-slate-950 font-extrabold' : 'text-white font-bold'}`}>
                {t('nav.loginOrCreate', 'Log in')}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
