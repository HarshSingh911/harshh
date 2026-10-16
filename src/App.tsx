/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import {
  BookedTrip,
  BookingCategory,
  CITIES,
  CityOption,
  CurrencyCode,
  DestinationPlace,
  formatPrice,
  PromoOffer,
  TripType,
} from './data/travelData';
import { AppPageView, Navbar } from './components/Navbar';
import { HeroSearchSection } from './components/HeroSearchSection';
import { ShowcaseSections } from './components/ShowcaseSections';
import { InteractiveModals } from './components/InteractiveModals';
import { FlightSearchResultsPage } from './components/FlightSearchResultsPage';
import { ExperiencesSearchResultsPage } from './components/ExperiencesSearchResultsPage';
import { CheckoutPaymentPage } from './components/CheckoutPaymentPage';
import { TripsDashboardPage } from './components/TripsDashboardPage';
import { AccountSettingsPage } from './components/AccountSettingsPage';
import { AdminPanel } from './components/AdminPanel';
import { InternationalPlannerPage } from './components/InternationalPlannerPage';
import {
  ActiveCredentialModal,
  CredentialModals,
} from './components/CredentialModals';
import { Footer } from './components/Footer';
import { LanguageRegionModal } from './components/LanguageRegionModal';
import { ListPropertyModal } from './components/ListPropertyModal';
import { TravelInsuranceModal } from './components/TravelInsuranceModal';

export default function App() {
  // Active Multi-Page View ('home' | 'search-results' | 'checkout' | 'trips' | 'account')
  const [activePage, setActivePage] = useState<AppPageView>('home');

  // Primary Search State (initialized to New Delhi -> Goa)
  const [activeCategory, setActiveCategory] = useState<BookingCategory>('flights');
  const [fromCity, setFromCity] = useState<CityOption>(CITIES[0]); // New Delhi (DEL)
  const [toCity, setToCity] = useState<CityOption>(CITIES[1]); // Goa (GOI)
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-15');
  const [returnDate, setReturnDate] = useState<string>('2026-10-19');
  const [studentFare, setStudentFare] = useState<boolean>(false);
  const [travellers, setTravellers] = useState<number>(1);
  const [cabinClass, setCabinClass] = useState<string>('Economy');

  // Display & User State
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [language, setLanguage] = useState<string>('English');
  const [region, setRegion] = useState<string>('India');
  const [userName, setUserName] = useState<string | null>(null);
  const [activePromo, setActivePromo] = useState<PromoOffer | null>(null);
  const [selectedCheckoutOptionTitle, setSelectedCheckoutOptionTitle] =
    useState<string>('IndiGo 6E-2134');

  // Modals State (Images 4, 5, 6 + Destination/Offer Modals on Home)
  const [activeCredentialModal, setActiveCredentialModal] =
    useState<ActiveCredentialModal>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationPlace | null>(null);
  const [showAllDestinationsModal, setShowAllDestinationsModal] =
    useState<boolean>(false);
  const [showOffersModal, setShowOffersModal] = useState<boolean>(false);
  const [showLanguageRegionModal, setShowLanguageRegionModal] =
    useState<boolean>(false);
  const [showListPropertyModal, setShowListPropertyModal] =
    useState<boolean>(false);
  const [showInsuranceModal, setShowInsuranceModal] =
    useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Booked Trips State
  const [bookedTrips, setBookedTrips] = useState<BookedTrip[]>([
    {
      bookingId: 'TY-8841-GOA',
      category: 'holidays',
      title: 'Goa Beachfront Escape & Flights',
      routeSummary: 'New Delhi (DEL) → Goa (GOI)',
      dateSummary: '16 Oct – 19 Oct 2025',
      travellers: 2,
      cabinOrRoom: 'Premium Beachfront Suite + IndiGo 6E-2134',
      totalPaidInr: 34845,
      studentFareApplied: false,
      status: 'Confirmed',
      bookedAt: '2025-10-14',
    },
  ]);

  // Contextual Toast Notification State
  const [bannerMessage, setBannerMessage] = useState<{
    title: string;
    detail: string;
    type: 'success' | 'info';
  } | null>(null);

  // Secret MakeMyTrip-Style Staff Entry (/admin, ?portal=admin, or Ctrl+Shift+A)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    if (path.includes('/admin') || params.has('admin') || params.get('portal') === 'admin') {
      setActivePage('admin');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret staff combination: Ctrl + Shift + A (or Cmd + Shift + A)
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActivePage((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (page: AppPageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleTriggerSearch = () => {
    navigateTo('search-results');
  };

  const handleSelectCategoryFromNav = (cat: BookingCategory) => {
    setActiveCategory(cat);
    if (activePage !== 'home' && activePage !== 'search-results') {
      navigateTo('home');
    }
  };

  const handleApplyOfferAndSearch = (offer: PromoOffer) => {
    setActivePromo(offer);
    setActiveCategory(offer.category);
    setBannerMessage({
      title: `Promo Code ${offer.code} Applied`,
      detail: `${offer.discountHeadline} discount unlocked on ${offer.label.toLowerCase()}.`,
      type: 'success',
    });
    navigateTo('search-results');
  };

  const handleSearchFlightsToDestination = (dest: DestinationPlace) => {
    const matchedCity = CITIES.find((c) => c.code === dest.cityCode);
    if (matchedCity) {
      if (fromCity.code === matchedCity.code) {
        setFromCity(CITIES[0]);
      }
      setToCity(matchedCity);
    }
    setActiveCategory('flights');
    setSelectedDestination(null);
    navigateTo('search-results');
  };

  const handleBookDestinationPackage = (dest: DestinationPlace) => {
    setSelectedDestination(null);
    setSelectedCheckoutOptionTitle(`4N/5D ${dest.name} Luxury Getaway`);
    navigateTo('checkout');
  };

  const handleNotify = (title: string, detail: string, type: 'success' | 'info' = 'info') => {
    setBannerMessage({
      title,
      detail,
      type,
    });
  };

  const handlePlannerBook = (
    destinationCityCode: string,
    category: 'flights' | 'hotels' | 'holidays'
  ) => {
    const matched = CITIES.find((c) => c.code === destinationCityCode);
    if (matched) {
      if (fromCity.code === matched.code) {
        setFromCity(CITIES[0]); // DEL
      }
      setToCity(matched);
    }
    setActiveCategory(category);
    navigateTo('search-results');
  };

  if (activePage === 'admin') {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100">
        <AdminPanel
          currency={currency}
          bookedTrips={bookedTrips}
          onUpdateTrips={setBookedTrips}
          onExitAdmin={() => navigateTo('home')}
          onNotify={handleNotify}
        />
        {/* Contextual Notification Toast */}
        {bannerMessage && (
          <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-4 flex items-start gap-3">
            {bannerMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-white">
                {bannerMessage.title}
              </p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {bannerMessage.detail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Sticky Top Bar with Quick Page Switcher */}
      <Navbar
        activePage={activePage}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategoryFromNav}
        onNavigatePage={navigateTo}
        currency={currency}
        language={language}
        region={region}
        onOpenLanguageModal={() => setShowLanguageRegionModal(true)}
        onOpenListProperty={() => setShowListPropertyModal(true)}
        onOpenInsurance={() => setShowInsuranceModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        tripsCount={bookedTrips.length}
        userName={userName}
      />

      {/* Contextual Notification Toast */}
      {bannerMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-4 flex items-start gap-3">
          {bannerMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-white">
              {bannerMessage.title}
            </p>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {bannerMessage.detail}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBannerMessage(null)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className={`flex-1 ${(activePage === 'home' || activePage === 'international-planner') ? '-mt-16' : ''}`}>
        {activePage === 'home' && (
          <>
            <HeroSearchSection
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              fromCity={fromCity}
              toCity={toCity}
              onChangeFromCity={(city) => setFromCity(city)}
              onChangeToCity={(city) => setToCity(city)}
              onSwapCities={handleSwapCities}
              tripType={tripType}
              onChangeTripType={setTripType}
              departureDate={departureDate}
              returnDate={returnDate}
              onChangeDepartureDate={setDepartureDate}
              onChangeReturnDate={setReturnDate}
              studentFare={studentFare}
              onToggleStudentFare={() => setStudentFare((prev) => !prev)}
              travellers={travellers}
              cabinClass={cabinClass}
              onChangeTravellers={(count, cabin) => {
                setTravellers(count);
                setCabinClass(cabin);
              }}
              onTriggerSearch={handleTriggerSearch}
              onSelectTrustPillar={(title, detail) =>
                setBannerMessage({
                  title: `TripYeah Guarantee: ${title}`,
                  detail,
                  type: 'info',
                })
              }
            />

            <ShowcaseSections
              currency={currency}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              onOpenAllDestinations={() => setShowAllDestinationsModal(true)}
              onOpenOffersModal={() => setShowOffersModal(true)}
              onApplyOfferAndSearch={handleApplyOfferAndSearch}
              onSelectPlatformService={(cat) => {
                setActiveCategory(cat);
                navigateTo('search-results');
              }}
              onStartExploring={() => navigateTo('search-results')}
            />
          </>
        )}

        {/* TOURS & EXPERIENCES / ACTIVITIES SEARCH RESULTS PAGE */}
        {activePage === 'search-results' && activeCategory === 'experiences' && (
          <ExperiencesSearchResultsPage
            destinationCity={toCity}
            selectedDate={departureDate}
            currency={currency}
            onChangeDestination={setToCity}
            onChangeDate={setDepartureDate}
            onModifySearch={() => navigateTo('home')}
            onSelectExperienceForCheckout={(item) => {
              setSelectedCheckoutOptionTitle(item.title);
              navigateTo('checkout');
            }}
            onNotify={handleNotify}
          />
        )}

        {/* FLIGHT, HOTEL, TRAIN, BUS, CAB & HOLIDAY SEARCH RESULTS PAGE */}
        {activePage === 'search-results' && activeCategory !== 'experiences' && (
          <FlightSearchResultsPage
            activeCategory={activeCategory}
            fromCity={fromCity}
            toCity={toCity}
            tripType={tripType}
            departureDate={departureDate}
            returnDate={returnDate}
            travellers={travellers}
            cabinClass={cabinClass}
            currency={currency}
            onChangeTripType={setTripType}
            onChangeFromCity={setFromCity}
            onChangeToCity={setToCity}
            onChangeDepartureDate={setDepartureDate}
            onChangeReturnDate={setReturnDate}
            onChangeTravellers={(count, cabin) => {
              setTravellers(count);
              setCabinClass(cabin);
            }}
            onChangeCategory={setActiveCategory}
            onModifySearch={() => navigateTo('home')}
            onSelectFlightOrStayForCheckout={(item) => {
              setSelectedCheckoutOptionTitle(item.title);
              navigateTo('checkout');
            }}
            onNotify={handleNotify}
          />
        )}

        {/* IMAGE 2: CHECKOUT, PASSENGER DETAILS, TRIPPROTECT 360 & PAYMENT PAGE */}
        {activePage === 'checkout' && (
          <CheckoutPaymentPage
            currency={currency}
            selectedOptionTitle={selectedCheckoutOptionTitle}
            onBackToResults={() => navigateTo('search-results')}
            onConfirmPayment={(totalPaidInr, leadName) => {
              setUserName(leadName);
              setBannerMessage({
                title: 'Booking Confirmed! (Ref: TY-8841-GOA)',
                detail: `Payment of ${formatPrice(
                  totalPaidInr,
                  currency
                )} verified. Digital boarding passes & hotel voucher are ready.`,
                type: 'success',
              });
              navigateTo('trips');
            }}
            onNotify={handleNotify}
          />
        )}

        {/* IMAGE 3: MY TRIPS & MEMBER DASHBOARD PAGE */}
        {activePage === 'trips' && (
          <TripsDashboardPage
            currency={currency}
            bookedTrips={bookedTrips}
            onBookNewTrip={() => navigateTo('home')}
            onOpenCredentialModal={(modal) => setActiveCredentialModal(modal)}
            onNavigateToProfile={() => navigateTo('account')}
            onNotify={handleNotify}
          />
        )}

        {/* IMAGE 7: ACCOUNT SETTINGS & PREFERENCES PORTAL */}
        {activePage === 'account' && (
          <AccountSettingsPage
            onSaveProfile={(name) => setUserName(name)}
            onNotify={handleNotify}
          />
        )}

        {/* INTERNATIONAL PLANNER: AI ITINERARY, VISA, BUDGET, CHECKLIST & MAP */}
        {activePage === 'international-planner' && (
          <InternationalPlannerPage
            currency={currency}
            onNavigateToCategory={(cat, from, to) => {
              setActiveCategory(cat);
              if (from) setFromCity(from);
              if (to) setToCity(to);
              navigateTo('search-results');
            }}
            onBookFlightOrHotel={handlePlannerBook}
            onNotify={handleNotify}
          />
        )}
      </main>

      {/* IMAGES 4, 5, 6: BOARDING PASS, HOTEL VOUCHER, & CANCEL/REFUND MODALS */}
      <CredentialModals
        activeModal={activeCredentialModal}
        onClose={() => setActiveCredentialModal(null)}
        onConfirmCancellation={(refundAmountInr, reason) => {
          setActiveCredentialModal(null);
          setBannerMessage({
            title: 'Cancellation & Instant Refund Initiated',
            detail: `₹${refundAmountInr.toLocaleString(
              'en-IN'
            )} is being refunded to your original payment source (${reason}).`,
            type: 'info',
          });
        }}
        onNotify={handleNotify}
      />

      {/* Home Page Destination & Offers Modals */}
      <InteractiveModals
        currency={currency}
        selectedDestination={selectedDestination}
        onCloseDestination={() => setSelectedDestination(null)}
        onSearchFlightsToDestination={handleSearchFlightsToDestination}
        onBookDestinationPackage={handleBookDestinationPackage}
        showAllDestinationsModal={showAllDestinationsModal}
        onCloseAllDestinationsModal={() => setShowAllDestinationsModal(false)}
        showOffersModal={showOffersModal}
        onCloseOffersModal={() => setShowOffersModal(false)}
        activePromo={activePromo}
        onApplyPromo={handleApplyOfferAndSearch}
        showTripsModal={false}
        onCloseTripsModal={() => {}}
        bookedTrips={bookedTrips}
        onCancelTrip={() => {}}
        showAuthModal={showAuthModal}
        onCloseAuthModal={() => setShowAuthModal(false)}
        userName={userName}
        onLoginSuccess={(name) => {
          setUserName(name);
          handleNotify('Welcome Back!', `Signed in as ${name}`, 'success');
        }}
        onLogout={() => {
          setUserName(null);
          handleNotify('Signed Out', 'You have been signed out successfully.', 'info');
        }}
      />

      {/* Language, Region & Currency Selector Modal */}
      <LanguageRegionModal
        isOpen={showLanguageRegionModal}
        onClose={() => setShowLanguageRegionModal(false)}
        currentLanguage={language}
        currentRegion={region}
        currentCurrency={currency}
        onSavePreferences={(newLang, newReg, newCurr) => {
          setLanguage(newLang);
          setRegion(newReg);
          setCurrency(newCurr);
          handleNotify(
            'Preferences Updated',
            `Region: ${newReg} · Language: ${newLang} · Currency: ${newCurr}`,
            'success'
          );
        }}
      />

      {/* List Your Property Modal */}
      <ListPropertyModal
        isOpen={showListPropertyModal}
        onClose={() => setShowListPropertyModal(false)}
        currency={currency}
        onPropertySubmitted={(propName, propCity, propType) => {
          handleNotify(
            'Listing Received!',
            `${propName} (${propType} in ${propCity}) has been sent for verification. Our host relations team will call you shortly.`,
            'success'
          );
        }}
      />

      {/* Travel Insurance Modal */}
      <TravelInsuranceModal
        isOpen={showInsuranceModal}
        onClose={() => setShowInsuranceModal(false)}
        currency={currency}
        onNotify={handleNotify}
      />

      {/* Clean 4-Column Footer */}
      <Footer
        onSelectCategory={handleSelectCategoryFromNav}
        onNavigatePage={navigateTo}
      />
    </div>
  );
}
