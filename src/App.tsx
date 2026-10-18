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
import { CheckoutItem, CheckoutPaymentPage } from './components/CheckoutPaymentPage';
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
import { HotelDetailsPage } from './components/HotelDetailsPage';
import { ExplorePage } from './components/ExplorePage';
import { InfluencersPage } from './components/InfluencersPage';

export default function App() {
  // Active Multi-Page View ('home' | 'search-results' | 'hotel-details' | 'checkout' | 'trips' | 'account')
  const [activePage, setActivePage] = useState<AppPageView>('home');
  const [selectedHotelForDetails, setSelectedHotelForDetails] = useState<any>(null);

  // Primary Search State (initialized to New Delhi -> Goa)
  const [activeCategory, setActiveCategory] = useState<BookingCategory>('flights');
  const [fromCity, setFromCity] = useState<CityOption>(CITIES[0]); // New Delhi (DEL)
  const [toCity, setToCity] = useState<CityOption>(CITIES[1]); // Goa (GOI)
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [dummyTripType, setDummyTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-15');
  const [returnDate, setReturnDate] = useState<string>('2026-10-19');
  const [studentFare, setStudentFare] = useState<boolean>(false);
  const [travellers, setTravellers] = useState<number>(1);
  const [cabinClass, setCabinClass] = useState<string>('Economy');

  // Display & User State
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [language, setLanguage] = useState<string>('English');
  const [region, setRegion] = useState<string>('India');
  const [userName, setUserName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('tripyeah_logged_user');
    } catch {
      return null;
    }
  });
  const [activePromo, setActivePromo] = useState<PromoOffer | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem>({
    title: 'IndiGo 6E-2134 (DEL → GOI)',
    code: '6E-2134',
    category: 'flights',
    priceInr: 5850,
    depTime: '06:15',
    arrTime: '08:30',
    duration: '2h 15m',
    fromCity: 'New Delhi (DEL)',
    toCity: 'Goa (GOI)',
    travelDate: '18 Oct 2026',
    travellers: 1,
    cabinClass: 'Economy',
    airline: 'IndiGo',
    flightNo: '6E-2134',
  });

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

  // Booked Trips State with localStorage persistence
  const [bookedTrips, setBookedTrips] = useState<BookedTrip[]>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_booked_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [
      {
        bookingId: 'TY-8841-GOA',
        bookingReference: 'TY-GOA-9021',
        category: 'holidays',
        title: 'Goa Beachfront Escape & Flights',
        routeSummary: 'New Delhi (DEL) → Goa (GOI)',
        dateSummary: '16 Oct – 19 Oct 2026',
        departureDate: '2026-10-16',
        returnDate: '2026-10-19',
        destinationCity: 'Goa',
        travellers: 2,
        cabinOrRoom: 'Premium Beachfront Suite + IndiGo 6E-2134',
        totalPaidInr: 34845,
        studentFareApplied: false,
        status: 'Confirmed',
        bookedAt: '2026-10-14',
        passengers: [
          { name: 'Rahul Sharma', age: 31, gender: 'Male', seatOrBerth: '12B (Extra Legroom)' },
          { name: 'Pooja Sharma', age: 29, gender: 'Female', seatOrBerth: '12C (Aisle)' },
        ],
        carrierOrHotel: 'The Grand Azure Beachfront Resort & IndiGo Airlines',
        pnr: 'TY-6E-8841',
        paymentMode: 'UPI / HDFC Net Banking',
        hasInsurance: true,
        policyNumber: 'TP-99214-DELGOI',
        hotelCheckInTime: '02:00 PM',
        hotelCheckOutTime: '11:00 AM',
        flightDepTime: '06:15 AM (DEL)',
        flightArrTime: '08:30 AM (GOI)',
        flightDuration: '2h 15m (Non-stop)',
        flightCode: 'IndiGo 6E-2134',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tripyeah_booked_trips', JSON.stringify(bookedTrips));
    } catch {}
  }, [bookedTrips]);

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
    setCheckoutItem({
      title: `4N/5D ${dest.name} Luxury Holiday Package`,
      code: `PKG-${dest.id.toUpperCase()}`,
      category: 'holidays',
      priceInr: (dest.startingFareInr || 18500) * 2,
      depTime: '10:00 AM Departure',
      arrTime: '02:00 PM Check-in',
      duration: '4 Nights / 5 Days',
      fromCity: 'New Delhi (DEL)',
      toCity: `${dest.name} (${dest.cityCode})`,
      travelDate: departureDate,
      travellers: 2,
      holidayTheme: `${dest.name} Getaway`,
    });
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
      <main className={`flex-1 ${(activePage === 'home' || activePage === 'international-planner' || activePage === 'influencers') ? '-mt-16' : ''}`}>
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
              dummyTripType={dummyTripType}
              onChangeDummyTripType={setDummyTripType}
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
              onOpenTripAI={() => navigateTo('international-planner')}
              onOpenExplorePage={() => navigateTo('explore')}
              onOpenInfluencersPage={() => navigateTo('influencers')}
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
              onStartExploring={() => navigateTo('explore')}
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
              setCheckoutItem({
                ...item,
                fromCity: fromCity.city,
                toCity: toCity.city,
                travelDate: departureDate,
                travellers: 1,
              });
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
            dummyTripType={dummyTripType}
            departureDate={departureDate}
            returnDate={returnDate}
            travellers={travellers}
            cabinClass={cabinClass}
            currency={currency}
            onChangeTripType={setTripType}
            onChangeDummyTripType={setDummyTripType}
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
              setCheckoutItem({
                ...item,
                fromCity: item.fromCity || `${fromCity.city} (${fromCity.code})`,
                toCity: item.toCity || `${toCity.city} (${toCity.code})`,
                travelDate: departureDate,
                returnDate: returnDate,
                travellers: item.travellers || travellers,
                cabinClass: cabinClass,
              });
              navigateTo('checkout');
            }}
            onSelectHotelForDetails={(hotel) => {
              setSelectedHotelForDetails(hotel);
              navigateTo('hotel-details');
            }}
            onNotify={handleNotify}
          />
        )}

        {/* HOTEL DETAILS & ROOM SELECTION PAGE */}
        {activePage === 'hotel-details' && (
          <HotelDetailsPage
            hotel={selectedHotelForDetails}
            currency={currency}
            checkInDate={departureDate}
            checkOutDate={returnDate}
            travellers={travellers}
            cabinClass={cabinClass}
            onBack={() => navigateTo('search-results')}
            onSelectRoomForCheckout={(selectedRoom, hotelItem, mealPlan) => {
              setCheckoutItem({
                title: `${hotelItem.name} (${selectedRoom.name})`,
                code: `${hotelItem.id}-${selectedRoom.id}`,
                depTime: 'Check-in: 02:00 PM',
                arrTime: 'Check-out: 11:00 AM',
                duration: '1 Night Stay',
                priceInr: selectedRoom.priceInr,
                category: 'hotels',
                hotelName: hotelItem.name,
                hotelLocation: hotelItem.location,
                roomType: `${selectedRoom.name} (${selectedRoom.bedType} · ${mealPlan})`,
                fromCity: `${fromCity.city} (${fromCity.code})`,
                toCity: `${toCity.city} (${toCity.code})`,
                travelDate: departureDate,
                returnDate: returnDate,
                travellers: travellers,
                cabinClass: cabinClass,
              });
              navigateTo('checkout');
            }}
            onNotify={handleNotify}
          />
        )}

        {/* IMAGE 2: CHECKOUT, PASSENGER DETAILS, TRIPPROTECT 360 & PAYMENT PAGE */}
        {activePage === 'checkout' && (
          <CheckoutPaymentPage
            currency={currency}
            item={checkoutItem}
            onBackToResults={() => navigateTo('search-results')}
            onConfirmPayment={(newBooking, leadName) => {
              setUserName(leadName);
              setBookedTrips((prev) => [newBooking, ...prev]);
              setBannerMessage({
                title: `Booking Confirmed! (Ref: ${newBooking.bookingReference || newBooking.bookingId || 'IRCTC-CONFIRMED'})`,
                detail: `Payment of ${formatPrice(
                  newBooking.totalPaidInr,
                  currency
                )} verified for ${newBooking.title}. Your e-ticket & voucher are ready.`,
                type: 'success',
              });
            }}
            onGoToTrips={() => navigateTo('trips')}
            onNotify={handleNotify}
          />
        )}

        {/* IMAGE 3: MY TRIPS & MEMBER DASHBOARD PAGE */}
        {activePage === 'trips' && (
          <TripsDashboardPage
            currency={currency}
            bookedTrips={bookedTrips}
            onUpdateBookedTrips={setBookedTrips}
            onBookNewTrip={() => navigateTo('home')}
            onOpenCredentialModal={(modal) => setActiveCredentialModal(modal)}
            onNavigateToProfile={() => navigateTo('account')}
            onNavigateToSearch={(category, destination) => {
              if (category) setActiveCategory(category);
              if (destination) {
                const found = CITIES.find((c) =>
                  destination.toLowerCase().includes(c.city.toLowerCase()) ||
                  c.city.toLowerCase().includes(destination.toLowerCase())
                );
                if (found) setToCity(found);
              }
              navigateTo('search-results');
            }}
            onNotify={handleNotify}
          />
        )}

        {/* IMAGE 7: ACCOUNT SETTINGS & PREFERENCES PORTAL */}
        {activePage === 'account' && (
          <AccountSettingsPage
            userName={userName}
            onSaveProfile={(name) => {
              setUserName(name);
              try {
                localStorage.setItem('tripyeah_logged_user', name);
              } catch {}
            }}
            onLogout={() => {
              setUserName(null);
              try {
                localStorage.removeItem('tripyeah_logged_user');
              } catch {}
              handleNotify('Signed Out', 'You have been signed out successfully.', 'info');
              navigateTo('home');
            }}
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

        {/* EXPLORE DESTINATIONS: 12 THEME CARDS, 5 HORIZONTAL CAROUSELS, DETAIL MODAL */}
        {activePage === 'explore' && (
          <ExplorePage
            onBackToHome={() => navigateTo('home')}
            currency={currency}
            onBookFlightToDestination={(cityName) => {
              const matchedCity = CITIES.find(
                (c) =>
                  c.city.toLowerCase().includes(cityName.toLowerCase()) ||
                  cityName.toLowerCase().includes(c.city.toLowerCase())
              );
              if (matchedCity) {
                setToCity(matchedCity);
              }
              setActiveCategory('flights');
              navigateTo('search-results');
            }}
            onOpenAIPlanner={() => {
              navigateTo('international-planner');
            }}
          />
        )}

        {/* INFLUENCERS & CREATOR CLUB PAGE */}
        {activePage === 'influencers' && (
          <InfluencersPage
            currency={currency}
            userName={userName}
            onBackToHome={() => navigateTo('home')}
            onNotify={handleNotify}
            onOpenExplore={() => navigateTo('explore')}
            onPlanTrip={(dest) => {
              const destLower = dest.toLowerCase();
              if (
                destLower.includes('japan') ||
                destLower.includes('switzerland') ||
                destLower.includes('dubai') ||
                destLower.includes('bali') ||
                destLower.includes('paris') ||
                destLower.includes('thailand')
              ) {
                navigateTo('international-planner');
                handleNotify(
                  `Opening International Planner: ${dest}`,
                  `AI itinerary, verified visa rules & budgets loaded for ${dest}.`,
                  'success'
                );
              } else {
                const matchedCity = CITIES.find(
                  (c) =>
                    c.city.toLowerCase().includes(destLower) ||
                    destLower.includes(c.city.toLowerCase())
                );
                if (matchedCity) {
                  setToCity(matchedCity);
                }
                setActiveCategory('flights');
                navigateTo('search-results');
                handleNotify(
                  `Flights to ${dest}`,
                  `Showing fastest flights and best fares for your ${dest} trip.`,
                  'success'
                );
              }
            }}
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
          try {
            localStorage.setItem('tripyeah_logged_user', name);
          } catch {}
          handleNotify('Account Verified!', `Welcome, ${name}! Your TripYeah account is active.`, 'success');
          navigateTo('account');
        }}
        onLogout={() => {
          setUserName(null);
          try {
            localStorage.removeItem('tripyeah_logged_user');
          } catch {}
          handleNotify('Signed Out', 'You have been signed out successfully.', 'info');
          navigateTo('home');
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
