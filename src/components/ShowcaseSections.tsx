import React from 'react';
import { ArrowRight, Plane, Building2, Palmtree } from 'lucide-react';
import {
  ASSETS,
  BookingCategory,
  CurrencyCode,
  DestinationPlace,
  formatPrice,
  PLATFORM_SERVICES,
  PROMO_OFFERS,
  PromoOffer,
  TOP_DESTINATIONS,
} from '../data/travelData';
import { SafeImage } from './SafeImage';

interface ShowcaseSectionsProps {
  currency: CurrencyCode;
  onSelectDestination: (dest: DestinationPlace) => void;
  onOpenAllDestinations: () => void;
  onOpenOffersModal: () => void;
  onApplyOfferAndSearch: (offer: PromoOffer) => void;
  onSelectPlatformService: (category: BookingCategory) => void;
  onStartExploring: () => void;
}

export const ShowcaseSections: React.FC<ShowcaseSectionsProps> = ({
  currency,
  onSelectDestination,
  onOpenAllDestinations,
  onOpenOffersModal,
  onApplyOfferAndSearch,
  onSelectPlatformService,
  onStartExploring,
}) => {
  return (
    <div className="w-full">
      {/* SECTION 1: TOP DESTINATIONS — Popular Places to Explore */}
      <section
        id="destinations"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10"
      >
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-blue-600 mb-1">
              Top Destinations
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Popular Places to{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#6366F1] bg-clip-text text-transparent">
                Explore
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenAllDestinations}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-indigo-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TOP_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDestination(dest);
                }
              }}
              role="button"
              tabIndex={0}
              className="group relative h-[250px] sm:h-[265px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <SafeImage
                src={dest.image}
                alt={`${dest.name} — ${dest.subtitle}`}
                fallbackTitle={dest.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />

              {/* Measured Scrim Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"
                aria-hidden="true"
              />

              {/* Top Right Starting Price */}
              <div className="absolute top-3 right-3 text-xs font-mono-tabular font-semibold text-white/95 bg-slate-950/45 backdrop-blur-xs px-2.5 py-1 rounded-md">
                From {formatPrice(dest.startingFareInr, currency)}
              </div>

              {/* Bottom Info & Circular Arrow Button */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-white leading-snug truncate">
                    {dest.name}
                  </h3>
                  <p className="text-[11px] text-slate-200/90 truncate mt-0.5">
                    {dest.subtitle}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: LIMITED TIME OFFERS — Travel Deals You'll Love */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative rounded-[28px] overflow-hidden shadow-md border border-slate-200/60">
          {/* Background Coastal Mountain Scenery */}
          <div className="absolute inset-0">
            <SafeImage
              src={ASSETS.heroAlpine}
              alt="Scenic coastal mountain twilight view for exclusive travel offers"
              fallbackTitle="Travel Deals"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0A2558]/95 via-[#133876]/80 to-slate-900/45"
              aria-hidden="true"
            />
          </div>

          {/* Content Grid */}
          <div className="relative z-10 p-6 sm:p-10 lg:px-12 lg:py-11 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Offer Copy */}
            <div className="lg:col-span-5 text-white">
              <p className="text-xs font-semibold tracking-[0.16em] text-sky-200 mb-2">
                Limited Time Offers
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
                Travel Deals You’ll Love
              </h2>
              <p className="text-sm sm:text-base text-slate-100/90 mb-6 max-w-md leading-relaxed">
                Exclusive discounts on flights, hotels and holiday packages.
              </p>
              <button
                type="button"
                onClick={onOpenOffersModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm shadow-md transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View Offers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right 3 White Offer Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {PROMO_OFFERS.map((offer, index) => {
                const Icon =
                  offer.category === 'flights'
                    ? Plane
                    : offer.category === 'hotels'
                    ? Building2
                    : Palmtree;

                const iconBoxStyles =
                  index === 0
                    ? 'bg-blue-50 text-blue-600'
                    : index === 1
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-rose-50 text-rose-500';

                const discountColor =
                  index === 1 ? 'text-slate-900' : 'text-[#2563EB]';

                return (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => onApplyOfferAndSearch(offer)}
                    className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-2xl p-5 text-left shadow-lg hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between cursor-pointer group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${iconBoxStyles} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">
                        {offer.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {offer.subLabel}
                      </div>
                      <div
                        className={`font-display text-2xl font-bold tracking-tight mt-0.5 font-mono-tabular ${discountColor}`}
                      >
                        {offer.discountHeadline}
                      </div>
                      <div className="text-[11px] font-mono-tabular text-slate-400 group-hover:text-indigo-600 mt-2 transition-colors">
                        Code: {offer.code} →
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PLAN YOUR TRIP — Everything You Need, One Platform */}
      <section
        id="platform-services"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14"
      >
        <div className="mb-7">
          <p className="text-xs font-semibold tracking-wider text-blue-600 mb-1">
            Plan Your Trip
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Everything You Need,{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#6366F1] bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Flights, hotels, trains, cabs, holiday packages and more – all in one place.
          </p>
        </div>

        {/* 5 Horizontal Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PLATFORM_SERVICES.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectPlatformService(service.id)}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all text-left group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                <SafeImage
                  src={service.image}
                  alt={service.title}
                  fallbackTitle={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {service.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 4: BOTTOM INSPIRATIONAL BANNER — Make Memories Around the World */}
      <section className="relative w-full overflow-hidden mt-2">
        {/* Diagonal / Mountain Contour Top Edge Divider */}
        <div className="relative w-full h-[380px] sm:h-[430px] lg:h-[460px]">
          <SafeImage
            src={ASSETS.mountainTraveler}
            alt="Traveler with backpack sitting on a rocky ridge overlooking snow-capped mountain peaks"
            fallbackTitle="Make Memories Around the World"
            className="w-full h-full object-cover object-center"
          />

          {/* Top Slanted White Cutout SVG matching the screenshot */}
          <svg
            className="absolute top-0 left-0 w-full h-10 sm:h-14 text-[#F8FAFC] fill-current pointer-events-none z-10"
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 L1440,0 L1440,18 L740,62 L0,12 Z" />
          </svg>

          {/* Dark Left Scrim for Crisp Headline Contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/25"
            aria-hidden="true"
          />

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col sm:flex-row items-start sm:items-center justify-between pt-12 pb-8 gap-8">
            {/* Left CTA Block */}
            <div className="max-w-lg">
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-4">
                Make Memories
                <br />
                <span className="text-[#4F75FF]">Around the World</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed mb-7">
                From weekend getaways to once-in-a-lifetime adventures, TripYeah is
                with you at every step.
              </p>
              <button
                type="button"
                onClick={onStartExploring}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Hand-Lettered Travel Motto SVG ("Good Trips Better Stories") */}
            <div className="hidden md:flex flex-col items-end justify-end self-end pb-4 pr-2 select-none">
              <div className="text-white/95 -rotate-6 text-right font-display italic tracking-wide leading-tight drop-shadow-md">
                <span className="block text-2xl sm:text-3xl font-semibold">
                  Good
                </span>
                <span className="block text-2xl sm:text-3xl font-semibold">
                  Trips
                </span>
                <span className="block text-2xl sm:text-3xl font-semibold">
                  Better
                </span>
                <span className="block text-2xl sm:text-3xl font-semibold">
                  Stories
                </span>
              </div>
              <svg
                className="w-20 h-14 text-white/90 mt-1 mr-2"
                viewBox="0 0 100 70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 58 C 45 62, 75 45, 84 12" />
                <path d="M74 18 L 84 12 L 89 23" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
