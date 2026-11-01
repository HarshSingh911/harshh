/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
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
  EXPERIENCES_DATA,
  ExperienceItem,
} from './data/travelData';
import { AppPageView, Navbar } from './components/Navbar';
import { HeroSearchSection } from './components/HeroSearchSection';
import { ShowcaseSections } from './components/ShowcaseSections';
import { InteractiveModals } from './components/InteractiveModals';
import { FlightSearchResultsPage } from './components/FlightSearchResultsPage';
import { ExperiencesSearchResultsPage } from './components/ExperiencesSearchResultsPage';
import { AttractionCheckoutPage } from './components/AttractionCheckoutPage';
import { HolidayCheckoutPage } from './components/HolidayCheckoutPage';
import { HolidayPackageDetails, HOLIDAY_PACKAGES_DATA } from './data/holidayPackagesData';
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
import { DiningClubPage } from './components/DiningClubPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { SupportCenterPage } from './components/SupportCenterPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { AboutUsPage } from './components/AboutUsPage';
import { HostelsPage } from './components/HostelsPage';
import { SmileAIAssistant, SmileSuggestedSearch } from './components/SmileAIAssistant';
import { auth, db, testFirestoreConnection } from './lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { saveTripToFirestore, subscribeToUserTrips } from './services/tripService';

export default function App() {
  // Active Multi-Page View ('home' | 'search-results' | 'hotel-details' | 'checkout' | 'trips' | 'account' | 'experience-checkout')
  const [activePage, setActivePage] = useState<AppPageView>('home');
  const [selectedHotelForDetails, setSelectedHotelForDetails] = useState<any>(null);
  const [selectedExperienceForCheckout, setSelectedExperienceForCheckout] = useState<ExperienceItem | null>(null);
  const [selectedHolidayPackageForCheckout, setSelectedHolidayPackageForCheckout] = useState<HolidayPackageDetails | null>(null);

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
  const [hotelMode, setHotelMode] = useState<'overnight' | 'hourly' | 'villas' | 'hostels'>('overnight');

  // Cab Specific Pickup & Drop Points (Google Maps Grounded)
  const [cabPickupPoint, setCabPickupPoint] = useState<string>('Indira Gandhi International Airport (Terminal 3)');
  const [cabDropPoint, setCabDropPoint] = useState<string>('Connaught Place (Inner & Outer Circle)');
  const [cabPickupMapsUrl, setCabPickupMapsUrl] = useState<string>(
    'https://www.google.com/maps/search/?api=1&query=Indira+Gandhi+International+Airport+Terminal+3+New+Delhi'
  );
  const [cabDropMapsUrl, setCabDropMapsUrl] = useState<string>(
    'https://www.google.com/maps/search/?api=1&query=Connaught+Place+New+Delhi'
  );

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
  const [userRole, setUserRole] = useState<'user' | 'admin'>(() => {
    try {
      return (localStorage.getItem('tripyeah_user_role') as 'user' | 'admin') || 'user';
    } catch {
      return 'user';
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
    isRoundTrip: false,
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
  // Open Login / Register modal automatically on website open as requested
  // Show auth modal on initial open unless user already has an active session
  const [showAuthModal, setShowAuthModal] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('tripyeah_logged_user');
    } catch {
      return false;
    }
  });

  // Track pending page to open after user logs in (e.g. if unauthenticated user clicks 'My Trips')
  const pendingRedirectRef = useRef<AppPageView | null>(null);
  const [pendingRedirectAfterLogin, setPendingRedirectAfterLogin] = useState<AppPageView | null>(null);

  // Booked Trips State with localStorage persistence
  const [bookedTrips, setBookedTrips] = useState<BookedTrip[]>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_booked_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tripyeah_booked_trips', JSON.stringify(bookedTrips));
    } catch {}
  }, [bookedTrips]);

  // Test Firestore connection on boot and listen for Firebase Auth state changes
  useEffect(() => {
    testFirestoreConnection();

    let unsubTrips: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setShowAuthModal(false);
        let displayName = user.displayName;

        // If phone auth user with no displayName yet, check Firestore or construct friendly name
        if (!displayName && user.phoneNumber) {
          displayName = `Traveller (${user.phoneNumber.slice(-4)})`;
        } else if (!displayName && user.email) {
          displayName = user.email.split('@')[0];
        } else if (!displayName) {
          displayName = 'Traveller';
        }

        // Check Firestore user doc for stored custom name
        try {
          const userDocSnap = await getDoc(doc(db, 'users', user.uid));
          if (userDocSnap.exists() && userDocSnap.data()?.displayName) {
            displayName = userDocSnap.data()?.displayName;
          }
        } catch {}

        const isBootstrappedAdmin = user.email?.toLowerCase() === 'meetsingh7416@gmail.com';
        const finalDisplayName = displayName || 'Traveller';
        setUserName(finalDisplayName);
        if (isBootstrappedAdmin) {
          setUserRole('admin');
          try {
            localStorage.setItem('tripyeah_user_role', 'admin');
          } catch {}
        }
        try {
          localStorage.setItem('tripyeah_logged_user', finalDisplayName);
          if (user.phoneNumber) {
            localStorage.setItem('tripyeah_user_phone', user.phoneNumber);
          }
        } catch {}

        // Subscribe to user's trips stored in Firestore
        unsubTrips = subscribeToUserTrips(user.uid, (remoteTrips) => {
          if (remoteTrips && remoteTrips.length > 0) {
            setBookedTrips((prev) => {
              const remoteIds = new Set(remoteTrips.map((t) => t.bookingId || t.id || ''));
              const localOnly = prev.filter((p) => !remoteIds.has(p.bookingId || p.id || ''));
              return [...remoteTrips, ...localOnly];
            });
          }
        });

        // If user requested a protected page like 'trips', redirect once authenticated
        const target = pendingRedirectRef.current;
        if (target) {
          pendingRedirectRef.current = null;
          setPendingRedirectAfterLogin(null);
          setActivePage(target);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubTrips) unsubTrips();
    };
  }, []);

  const handleAddNewTrip = (newTrip: BookedTrip) => {
    setBookedTrips((prev) => [newTrip, ...prev]);
    saveTripToFirestore(newTrip).catch((err) => {
      console.warn('Trip Firestore sync notice:', err);
    });
  };

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
    } else if (path.includes('/terms-of-service') || params.get('page') === 'terms-of-service' || path.includes('/terms')) {
      setActivePage('terms-of-service');
    } else if (path.includes('/about-us') || params.get('page') === 'about-us' || path.includes('/about')) {
      setActivePage('about-us');
    } else if (path.includes('/privacy-policy') || params.get('page') === 'privacy-policy' || path.includes('/privacy')) {
      setActivePage('privacy-policy');
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

  const handleOpenAuth = (redirectTarget?: AppPageView) => {
    if (redirectTarget) {
      pendingRedirectRef.current = redirectTarget;
      setPendingRedirectAfterLogin(redirectTarget);
      setBannerMessage({
        title: 'Login Required',
        detail: 'Please sign in or create an account to view and manage your booked trips.',
        type: 'info',
      });
    }
    setShowAuthModal(true);
  };

  const navigateTo = (page: AppPageView) => {
    if (page === 'trips' && !userName && !auth.currentUser) {
      pendingRedirectRef.current = 'trips';
      setPendingRedirectAfterLogin('trips');
      setShowAuthModal(true);
      setBannerMessage({
        title: 'Login Required',
        detail: 'Please sign in or create an account to view and manage your booked trips.',
        type: 'info',
      });
      return;
    }
    if (page === 'account' && !userName && !auth.currentUser) {
      pendingRedirectRef.current = 'account';
      setPendingRedirectAfterLogin('account');
      setShowAuthModal(true);
      setBannerMessage({
        title: 'Login Required',
        detail: 'Please sign in to access your account profile and preferences.',
        type: 'info',
      });
      return;
    }
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

  const handleSmileHandoffSearch = (searchData: SmileSuggestedSearch) => {
    // 1. If category is international-planner, navigate directly to planner
    if (searchData.category === 'international-planner') {
      navigateTo('international-planner');
      handleNotify(
        'SMILE Planner Handoff',
        `Loaded itinerary planner for ${searchData.toCity || 'International Destination'}.`,
        'success'
      );
      return;
    }

    // 2. Set activeCategory
    setActiveCategory(searchData.category as BookingCategory);

    // 3. Match fromCity & toCity from CITIES
    const foundFrom = CITIES.find(
      (c) =>
        c.code.toLowerCase() === (searchData.fromCode || '').toLowerCase() ||
        c.city.toLowerCase() === (searchData.fromCity || '').toLowerCase()
    );
    const foundTo = CITIES.find(
      (c) =>
        c.code.toLowerCase() === (searchData.toCode || '').toLowerCase() ||
        c.city.toLowerCase() === (searchData.toCity || '').toLowerCase()
    );

    if (foundFrom) {
      setFromCity(foundFrom);
    }
    if (foundTo) {
      setToCity(foundTo);
    } else if (searchData.toCity) {
      setToCity({
        city: searchData.toCity,
        code: searchData.toCode || searchData.toCity.slice(0, 3).toUpperCase(),
        stationCode: searchData.toCode || searchData.toCity.slice(0, 3).toUpperCase(),
        country: 'International',
        airportName: `${searchData.toCity} International Airport`,
        popularTag: 'SMILE Pick',
      });
    }

    if (searchData.departureDate) {
      setDepartureDate(searchData.departureDate);
    }
    if (searchData.travellers) {
      setTravellers(searchData.travellers);
    }

    navigateTo('search-results');
    handleNotify(
      'SMILE Search Active',
      `Prefilled live search for ${searchData.category.toUpperCase()} to ${searchData.toCity} (${searchData.toCode || ''}).`,
      'success'
    );
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
        onOpenAuth={handleOpenAuth}
        onOpenOffers={() => setShowOffersModal(true)}
        tripsCount={bookedTrips.length}
        userName={userName}
        userRole={userRole}
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
      <main className={`flex-1 ${(activePage === 'home' || activePage === 'international-planner' || activePage === 'influencers' || activePage === 'explore' || activePage === 'dining-club' || activePage === 'trips' || activePage === 'account' || activePage === 'support' || activePage === 'hostels') ? '-mt-16' : ''}`}>
        {activePage === 'home' && (
          <>
            <HeroSearchSection
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              fromCity={fromCity}
              toCity={toCity}
              cabPickupPoint={cabPickupPoint}
              cabDropPoint={cabDropPoint}
              cabPickupMapsUrl={cabPickupMapsUrl}
              cabDropMapsUrl={cabDropMapsUrl}
              onChangeCabPickupPoint={(pt, url) => {
                setCabPickupPoint(pt);
                if (url) setCabPickupMapsUrl(url);
              }}
              onChangeCabDropPoint={(pt, url) => {
                setCabDropPoint(pt);
                if (url) setCabDropMapsUrl(url);
              }}
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
              hotelMode={hotelMode}
              onChangeHotelMode={setHotelMode}
              onTriggerSearch={handleTriggerSearch}
              onOpenTripAI={() => navigateTo('international-planner')}
              onOpenExplorePage={() => navigateTo('explore')}
              onOpenInfluencersPage={() => navigateTo('influencers')}
              onOpenDiningClubPage={() => navigateTo('dining-club')}
              onOpenHostelsPage={() => navigateTo('hostels')}
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
            onSelectExperienceForCheckout={(experience) => {
              setSelectedExperienceForCheckout(experience);
              navigateTo('experience-checkout');
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
            cabPickupPoint={cabPickupPoint}
            cabDropPoint={cabDropPoint}
            cabPickupMapsUrl={cabPickupMapsUrl}
            cabDropMapsUrl={cabDropMapsUrl}
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
            onChangeCabPickupPoint={(pt, url) => {
              setCabPickupPoint(pt);
              if (url) setCabPickupMapsUrl(url);
            }}
            onChangeCabDropPoint={(pt, url) => {
              setCabDropPoint(pt);
              if (url) setCabDropMapsUrl(url);
            }}
            onChangeDepartureDate={setDepartureDate}
            onChangeReturnDate={setReturnDate}
            onChangeTravellers={(count, cabin) => {
              setTravellers(count);
              setCabinClass(cabin);
            }}
            onChangeCategory={setActiveCategory}
            hotelMode={hotelMode}
            onChangeHotelMode={setHotelMode}
            onModifySearch={() => navigateTo('home')}
            onOpenHostelsPage={() => navigateTo('hostels')}
            onSelectHolidayForCheckout={(pkg) => {
              const matched = HOLIDAY_PACKAGES_DATA.find(
                (p) => p.id === pkg.id || p.title.toLowerCase().includes(pkg.title.toLowerCase())
              ) || HOLIDAY_PACKAGES_DATA[0];
              setSelectedHolidayPackageForCheckout(matched);
              navigateTo('holiday-checkout');
            }}
            onSelectFlightOrStayForCheckout={(item) => {
              if (item.category === 'holidays') {
                const matched = HOLIDAY_PACKAGES_DATA.find(
                  (p) => p.id === item.code || p.title.toLowerCase().includes(item.title.toLowerCase())
                ) || HOLIDAY_PACKAGES_DATA[0];
                setSelectedHolidayPackageForCheckout(matched);
                navigateTo('holiday-checkout');
                return;
              }
              const isRT = Boolean(
                item.isRoundTrip ??
                (tripType === 'round-trip' || (tripType === 'dummy-flights' && dummyTripType === 'round-trip'))
              );
              setCheckoutItem({
                ...item,
                fromCity: item.fromCity || (item.category === 'cabs' ? (item.cabPickupPoint || cabPickupPoint) : `${fromCity.city} (${fromCity.code})`),
                toCity: item.toCity || (item.category === 'cabs' ? (item.cabDropPoint || cabDropPoint) : `${toCity.city} (${toCity.code})`),
                cabPickupPoint: item.cabPickupPoint || cabPickupPoint,
                cabDropPoint: item.cabDropPoint || cabDropPoint,
                cabPickupMapsUrl: item.cabPickupMapsUrl || cabPickupMapsUrl,
                cabDropMapsUrl: item.cabDropMapsUrl || cabDropMapsUrl,
                travelDate: item.travelDate || departureDate,
                returnDate: isRT ? (item.returnDate || returnDate) : undefined,
                isRoundTrip: isRT,
                travellers: item.travellers || travellers,
                cabinClass: item.cabinClass || cabinClass,
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

        {/* HOLIDAY CHECKOUT PAGE WITH IMAGES, DAY-WISE ITINERARY, TRANSFERS, STAY, FOOD, POLICIES & PAN DETAILS */}
        {activePage === 'holiday-checkout' && (
          <HolidayCheckoutPage
            holidayPackage={selectedHolidayPackageForCheckout || HOLIDAY_PACKAGES_DATA[0]}
            currency={currency}
            selectedDate={departureDate}
            onBack={() => navigateTo('search-results')}
            onCompleteBooking={(newTrip) => {
              handleAddNewTrip(newTrip);
            }}
            onNotify={handleNotify}
            onNavigateTrips={() => navigateTo('trips')}
          />
        )}

        {/* ATTRACTION CHECKOUT PAGE WITH IMAGES, HIGHLIGHTS, ACTIVITY OPTIONS & INFO */}
        {activePage === 'experience-checkout' && (
          <AttractionCheckoutPage
            experience={selectedExperienceForCheckout || EXPERIENCES_DATA[0]}
            currency={currency}
            selectedDate={departureDate}
            onBack={() => navigateTo('search-results')}
            onCompleteBooking={(newTrip) => {
              handleAddNewTrip(newTrip);
            }}
            onNotify={handleNotify}
            onNavigateTrips={() => navigateTo('trips')}
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
              handleAddNewTrip(newBooking);
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
            userName={userName}
            onOpenAuth={() => handleOpenAuth('trips')}
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
            onLogout={async () => {
              try {
                await fbSignOut(auth);
              } catch {}
              setUserName(null);
              setUserRole('user');
              try {
                localStorage.removeItem('tripyeah_logged_user');
                localStorage.removeItem('tripyeah_user_role');
                localStorage.removeItem('tripyeah_user_email');
              } catch {}
              handleNotify('Signed Out', 'You have been signed out successfully.', 'info');
              navigateTo('home');
            }}
            onNotify={handleNotify}
            onNavigateToPrivacyPolicy={() => navigateTo('privacy-policy')}
            onNavigateToTermsOfService={() => navigateTo('terms-of-service')}
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

        {/* DINING CLUB: LUXURY FINE DINING SEAT BOOKING, GOURMET FOOD ORDERS, GROUP PARTIES & VIP CLUB TICKETS */}
        {activePage === 'dining-club' && (
          <DiningClubPage
            currency={currency}
            userName={userName}
            onBackToHome={() => navigateTo('home')}
            onNotify={handleNotify}
          />
        )}

        {/* TRIPYEAH PRIVACY POLICY FULL DOCUMENT */}
        {activePage === 'privacy-policy' && (
          <PrivacyPolicyPage
            onBackToHome={() => navigateTo('home')}
            onOpenSupport={() => navigateTo('support')}
            onOpenTermsOfService={() => navigateTo('terms-of-service')}
          />
        )}

        {/* CUSTOMER SUPPORT CENTER PAGE */}
        {activePage === 'support' && (
          <SupportCenterPage
            onBackToHome={() => navigateTo('home')}
            onNavigatePage={navigateTo}
            bookedTrips={bookedTrips}
            userName={userName}
            currency={currency}
            onOpenInsurance={() => setShowInsuranceModal(true)}
            onOpenOffers={() => setShowOffersModal(true)}
            onOpenAuth={() => setShowAuthModal(true)}
            onNotify={handleNotify}
          />
        )}

        {/* TRIPYEAH TERMS OF SERVICE COMPREHENSIVE LEGAL DOCUMENT */}
        {activePage === 'terms-of-service' && (
          <TermsOfServicePage
            onBackToHome={() => navigateTo('home')}
            onNavigatePage={navigateTo}
            onOpenSupport={() => navigateTo('support')}
            onOpenPrivacyPolicy={() => navigateTo('privacy-policy')}
          />
        )}

        {/* TRIP YEHH ABOUT US & FOUNDER'S VISION PAGE */}
        {activePage === 'about-us' && (
          <AboutUsPage
            onBackToHome={() => navigateTo('home')}
            onNavigatePage={navigateTo}
            onOpenSupport={() => navigateTo('support')}
          />
        )}

        {/* HOSTELS & BACKPACKER STAYS PAGE (THE HOSTELLER, GOSTOPS, ZOSTEL, MADPACKERS) */}
        {activePage === 'hostels' && (
          <HostelsPage
            currency={currency}
            onBackToHome={() => navigateTo('home')}
            onSelectHostelForCheckout={(checkoutSummary) => {
              setCheckoutItem(checkoutSummary);
              navigateTo('checkout');
            }}
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
        onLoginSuccess={(name, email, role) => {
          setUserName(name);
          const activeRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');
          setUserRole(activeRole);
          try {
            localStorage.setItem('tripyeah_logged_user', name);
            localStorage.setItem('tripyeah_user_role', activeRole);
          } catch {}
          const target = pendingRedirectRef.current || pendingRedirectAfterLogin;
          pendingRedirectRef.current = null;
          setPendingRedirectAfterLogin(null);

          if (activeRole === 'admin') {
            handleNotify(
              'TripWork Company Portal Active',
              `Welcome, ${name}! TripYeah management mode enabled. Managing bookings, fares, inventory & operations.`,
              'success'
            );
            navigateTo('admin');
          } else if (target) {
            handleNotify(
              'Welcome Back!',
              `Welcome, ${name}! Opening your ${target === 'trips' ? 'booked trips' : target}.`,
              'success'
            );
            navigateTo(target);
          } else {
            handleNotify('Account Verified!', `Welcome, ${name}! Your TripYeah account is active.`, 'success');
            navigateTo('account');
          }
        }}
        onLogout={() => {
          setUserName(null);
          setUserRole('user');
          try {
            localStorage.removeItem('tripyeah_logged_user');
            localStorage.removeItem('tripyeah_user_role');
          } catch {}
          handleNotify('Signed Out', 'You have been signed out successfully.', 'info');
          navigateTo('home');
        }}
        onOpenPrivacyPolicy={() => {
          setShowAuthModal(false);
          navigateTo('privacy-policy');
        }}
        onOpenTermsOfService={() => {
          setShowAuthModal(false);
          navigateTo('terms-of-service');
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

      {/* SMILE — TripYehh's Personal AI Travel Assistant */}
      <SmileAIAssistant
        activeCategory={activeCategory}
        fromCity={fromCity}
        toCity={toCity}
        departureDate={departureDate}
        travellers={travellers}
        currency={currency}
        onHandoffSearch={handleSmileHandoffSearch}
        onNotify={handleNotify}
      />
    </div>
  );
}
