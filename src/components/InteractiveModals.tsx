import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Plane,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  BookedTrip,
  CurrencyCode,
  DestinationPlace,
  formatPrice,
  PROMO_OFFERS,
  PromoOffer,
  TOP_DESTINATIONS,
} from '../data/travelData';
import { SafeImage } from './SafeImage';
import { AuthModal } from './AuthModal';

interface InteractiveModalsProps {
  currency: CurrencyCode;
  selectedDestination: DestinationPlace | null;
  onCloseDestination: () => void;
  onSearchFlightsToDestination: (dest: DestinationPlace) => void;
  onBookDestinationPackage: (dest: DestinationPlace) => void;

  showAllDestinationsModal: boolean;
  onCloseAllDestinationsModal: () => void;

  showOffersModal: boolean;
  onCloseOffersModal: () => void;
  activePromo: PromoOffer | null;
  onApplyPromo: (offer: PromoOffer) => void;

  showTripsModal: boolean;
  onCloseTripsModal: () => void;
  bookedTrips: BookedTrip[];
  onCancelTrip: (bookingId: string) => void;

  showAuthModal: boolean;
  onCloseAuthModal: () => void;
  userName: string | null;
  onLoginSuccess: (name: string, email: string, role?: 'user' | 'admin') => void;
  onLogout: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
}

export const InteractiveModals: React.FC<InteractiveModalsProps> = ({
  currency,
  selectedDestination,
  onCloseDestination,
  onSearchFlightsToDestination,
  onBookDestinationPackage,
  showAllDestinationsModal,
  onCloseAllDestinationsModal,
  showOffersModal,
  onCloseOffersModal,
  activePromo,
  onApplyPromo,
  showTripsModal,
  onCloseTripsModal,
  bookedTrips,
  onCancelTrip,
  showAuthModal,
  onCloseAuthModal,
  userName,
  onLoginSuccess,
  onLogout,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}) => {
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = authEmail.trim();
    const trimmedName = authName.trim() || trimmedEmail.split('@')[0];
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setAuthError('Please enter a valid email address to continue.');
      return;
    }
    setAuthError('');
    onLoginSuccess(trimmedName, trimmedEmail);
    onCloseAuthModal();
  };

  return (
    <>
      {/* 1. DESTINATION EXPLORER MODAL */}
      {selectedDestination && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dest-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="relative h-64 w-full">
              <SafeImage
                src={selectedDestination.image}
                alt={selectedDestination.name}
                fallbackTitle={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
              <button
                type="button"
                onClick={onCloseDestination}
                aria-label="Close destination details"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/65 text-white hover:bg-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-sky-300 font-semibold">
                    {selectedDestination.country} · {selectedDestination.subtitle}
                  </p>
                  <h3
                    id="dest-modal-title"
                    className="font-display text-3xl font-bold text-white"
                  >
                    {selectedDestination.name}
                  </h3>
                </div>
                <div className="text-right text-white">
                  <span className="block text-xs text-slate-300">
                    Packages starting at
                  </span>
                  <span className="font-mono-tabular text-2xl font-bold">
                    {formatPrice(selectedDestination.startingFareInr, currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Unboxed Metadata Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 border-b border-slate-100 pb-4">
                <span>Flight Time: {selectedDestination.flightTime}</span>
                <span aria-hidden="true">·</span>
                <span>Best Season: {selectedDestination.bestSeason}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedDestination.visaPolicy}</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedDestination.description}
              </p>

              {/* Highlights */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2.5">
                  Included Experiences & Highlights
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {selectedDestination.highlights.map((hl) => (
                    <li key={hl} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curated 3-Day Preview */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-900 mb-2.5">
                  Sample Itinerary Preview
                </h4>
                <div className="space-y-2">
                  {selectedDestination.itineraryPreview.map((step) => (
                    <div
                      key={step.day}
                      className="flex items-baseline gap-3 text-xs"
                    >
                      <span className="font-mono-tabular font-semibold text-indigo-600 shrink-0">
                        {step.day}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900">
                          {step.title}
                        </span>
                        <span className="text-slate-500"> — {step.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSearchFlightsToDestination(selectedDestination)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 hover:border-indigo-600 text-slate-800 hover:text-indigo-600 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Search Flights to {selectedDestination.name}
                </button>
                <button
                  type="button"
                  onClick={() => onBookDestinationPackage(selectedDestination)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:brightness-105 text-white text-xs sm:text-sm font-semibold shadow-md transition-all whitespace-nowrap cursor-pointer"
                >
                  Book 4N/5D Holiday ({formatPrice(selectedDestination.startingFareInr, currency)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ALL DESTINATIONS CATALOG MODAL */}
      {showAllDestinationsModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="all-dest-title"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <p className="text-xs font-semibold text-blue-600">
                  Global Destination Directory
                </p>
                <h3
                  id="all-dest-title"
                  className="font-display text-2xl font-bold text-slate-900"
                >
                  Explore Curated Destinations
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseAllDestinationsModal}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOP_DESTINATIONS.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => {
                    onCloseAllDestinationsModal();
                    onSearchFlightsToDestination(dest);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onCloseAllDestinationsModal();
                      onSearchFlightsToDestination(dest);
                    }
                  }}
                  className="group flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <SafeImage
                      src={dest.image}
                      alt={dest.name}
                      fallbackTitle={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-base font-bold text-slate-900 truncate">
                        {dest.name}
                      </h4>
                      <span className="font-mono-tabular text-xs font-bold text-indigo-600">
                        {formatPrice(dest.startingFareInr, currency)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {dest.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {dest.flightTime} · {dest.visaPolicy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. OFFERS & PROMO CODES MODAL */}
      {showOffersModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offers-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="offers-modal-title"
                    className="font-display text-xl font-bold text-slate-900"
                  >
                    Exclusive TripYeah Offers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any offer to apply its promo code directly to your search
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseOffersModal}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {PROMO_OFFERS.map((offer) => {
                const isApplied = activePromo?.id === offer.id;
                return (
                  <div
                    key={offer.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-lg font-bold text-indigo-600">
                          {offer.label} {offer.discountHeadline}
                        </span>
                        <span className="font-mono-tabular text-xs font-semibold text-slate-700">
                          · Code: {offer.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {offer.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {offer.validUntil} · Max savings ₹
                        {offer.maxDiscountInr.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyPromo(offer);
                        onCloseOffersModal();
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      {isApplied ? 'Applied ✓' : 'Apply & Search'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. MY TRIPS MODAL / DRAWER */}
      {showTripsModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trips-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3
                  id="trips-modal-title"
                  className="font-display text-xl font-bold text-slate-900"
                >
                  My Trips & Bookings ({bookedTrips.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage confirmed itineraries, view PNRs, or request instant refunds
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseTripsModal}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {bookedTrips.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Plane className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">
                    No active trips booked yet
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Use the search bar above or explore Bali, Dubai, Singapore,
                    Bangkok, and Paris to book your next itinerary.
                  </p>
                </div>
              ) : (
                bookedTrips.map((trip) => (
                  <div
                    key={trip.bookingId}
                    className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{trip.status}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular text-slate-500">
                          PNR: {trip.bookingId}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {trip.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.routeSummary}</span>
                        <span aria-hidden="true">·</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.dateSummary}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {trip.travellers}{' '}
                        {trip.travellers === 1 ? 'Traveller' : 'Travellers'} ·{' '}
                        {trip.cabinOrRoom}
                        {trip.promoApplied ? ` · Promo ${trip.promoApplied}` : ''}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="font-mono-tabular text-lg font-bold text-slate-900">
                        {formatPrice(trip.totalPaidInr, currency)}
                      </div>
                      <button
                        type="button"
                        onClick={() => onCancelTrip(trip.bookingId)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Easy Cancel</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. LOGIN / SIGN UP MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={onCloseAuthModal}
        onLoginSuccess={(name, email, mobile, role) => {
          onLoginSuccess(name, email, role);
        }}
        onOpenPrivacyPolicy={onOpenPrivacyPolicy}
        onOpenTermsOfService={onOpenTermsOfService}
      />
    </>
  );
};
