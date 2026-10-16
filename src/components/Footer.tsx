import React from 'react';
import { Globe, Hash, MessageSquare } from 'lucide-react';
import { BookingCategory } from '../data/travelData';
import { AppPageView } from './Navbar';

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
              className="font-display text-xl font-bold text-slate-900 flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M21.426 2.574a1.25 1.25 0 0 0-1.32-.24L2.856 9.584a1.25 1.25 0 0 0 .06 2.333l7.02 2.34 2.34 7.02a1.25 1.25 0 0 0 2.333.06l7.05-17.25a1.25 1.25 0 0 0-.233-1.513Z" />
                </svg>
              </span>
              <span>TripYeah</span>
            </a>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Smart, high-velocity travel platform engineered for digital nomads,
              spontaneous wanderers, and global business travelers.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onNavigatePage('home')}
                aria-label="Global portal"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage('search-results')}
                aria-label="Explore channels"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <Hash className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage('trips')}
                aria-label="Concierge support"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
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
                  onClick={() => onNavigatePage('home')}
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
                  onClick={() => onNavigatePage('trips')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Support Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('account')}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('account')}
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
          <p>© 2025 TripYeah Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigatePage('account')}
              className="hover:text-slate-700 cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => onNavigatePage('account')}
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
