import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { BookingCategory } from '../data/travelData';
import { AppPageView } from './Navbar';
import { TripYeahLogo } from './TripYeahLogo';

export const SOCIAL_PROFILES = [
  {
    name: 'Instagram',
    handle: '@tripyeah',
    url: 'https://www.instagram.com/tripyeah',
    icon: Instagram,
    hoverBg: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent',
    textHover: 'hover:text-pink-600',
  },
  {
    name: 'Facebook',
    handle: 'facebook.com/tripyeah',
    url: 'https://www.facebook.com/tripyeah',
    icon: Facebook,
    hoverBg: 'hover:bg-[#1877F2] hover:text-white hover:border-transparent',
    textHover: 'hover:text-[#1877F2]',
  },
  {
    name: 'Twitter',
    handle: '@tripyeah',
    url: 'https://twitter.com/tripyeah',
    icon: Twitter,
    hoverBg: 'hover:bg-[#1DA1F2] hover:text-white hover:border-transparent',
    textHover: 'hover:text-[#1DA1F2]',
  },
  {
    name: 'LinkedIn',
    handle: 'linkedin.com/company/tripyeah',
    url: 'https://www.linkedin.com/company/tripyeah',
    icon: Linkedin,
    hoverBg: 'hover:bg-[#0A66C2] hover:text-white hover:border-transparent',
    textHover: 'hover:text-[#0A66C2]',
  },
];

interface FooterProps {
  onSelectCategory: (cat: BookingCategory) => void;
  onNavigatePage: (page: AppPageView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigatePage,
}) => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 mb-1"
            >
              <TripYeahLogo
                isDarkHeader={false}
                className="h-8 w-auto"
              />
            </a>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Smart, high-velocity travel platform engineered for digital nomads,
              spontaneous wanderers, and global business travelers.
            </p>
            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Follow TripYeah
              </span>
              <div className="flex items-center gap-2.5">
                {SOCIAL_PROFILES.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${social.name} (${social.handle})`}
                      aria-label={`TripYeah on ${social.name}`}
                      className={`w-9 h-9 rounded-full bg-slate-100 hover:shadow-md border border-slate-200/80 text-slate-600 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 ${social.hoverBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Bookings */}
          <div className="md:col-span-2 space-y-2.5 text-xs">
            <h4 className="font-display font-bold text-slate-900 text-sm">
              Bookings
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('flights');
                    onNavigatePage('search-results');
                  }}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Flights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('trains')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Trains
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('hotels');
                    onNavigatePage('search-results');
                  }}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Hotels &amp; Stays
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('buses')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Buses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('cabs')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Airport Cabs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="md:col-span-2 space-y-2.5 text-xs">
            <h4 className="font-display font-bold text-slate-900 text-sm">
              Company
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('about-us')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('account')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('trips')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Newsroom
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('influencers')}
                  className="hover:text-rose-600 font-semibold text-rose-500 cursor-pointer flex items-center gap-1"
                >
                  <span>Influencers &amp; Creators</span>
                  <span className="text-[9px] bg-rose-100 text-rose-700 px-1 py-0.2 rounded font-bold">New</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('checkout')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Partner Network
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Legal */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <h4 className="font-display font-bold text-slate-900 text-sm">
              Support &amp; Legal
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('support')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Support Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('privacy-policy')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('terms-of-service')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('account')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Trust &amp; Security
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 TripYeah Inc. All rights reserved.</p>

          {/* Social Profiles Quick Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden md:inline">Connect:</span>
            {SOCIAL_PROFILES.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={`bottom-${social.name}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${social.name} (${social.handle})`}
                  aria-label={social.name}
                  className={`w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors ${social.textHover}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigatePage('privacy-policy')}
              className="hover:text-slate-700 cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => onNavigatePage('terms-of-service')}
              className="hover:text-slate-700 cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => onNavigatePage('trips')}
              className="hover:text-slate-700 cursor-pointer"
            >
              Help Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
