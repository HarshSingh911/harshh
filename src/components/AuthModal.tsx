import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Lock,
  User,
  Mail,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  KeyRound,
  Tag,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Percent,
  Gift,
  Compass,
} from 'lucide-react';
import { TripYeahLogo } from './TripYeahLogo';

// High-resolution destination scenery images for the slideshow
import destMaldives from '../assets/images/dest_maldives_resort_1792241008307.jpg';
import destSwissAlps from '../assets/images/hero_alpine_lakeside_1790774682097.jpg';
import destBali from '../assets/images/dest_bali_temple_1790774699717.jpg';
import destDubai from '../assets/images/dest_dubai_skyline_1790774713819.jpg';
import destParis from '../assets/images/dest_paris_eiffel_1790774759266.jpg';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string, mobile?: string) => void;
  initialMobile?: string;
}

export type AuthMethod = 'phone' | 'email';
export type AuthStep = 'phone-input' | 'otp-verify' | 'email-login' | 'create-account' | 'google-picker';

// Curated Slideshow Sceneries with Exclusive Member Travel Offers
const SLIDESHOW_OFFERS = [
  {
    id: 'maldives',
    image: destMaldives,
    destination: 'Maldives',
    country: 'Indian Ocean Paradise',
    badge: 'MEMBER EXCLUSIVE',
    badgeColor: 'bg-emerald-500/90 text-white',
    offerTitle: 'FLAT 25% OFF On Overwater Luxury Villas',
    offerDescription: 'Unlock private pool water villas with complimentary speedboat airport transfers & daily floating breakfast.',
    promoCode: 'MALDIVES25',
    savings: 'Save up to ₹18,000',
  },
  {
    id: 'swiss',
    image: destSwissAlps,
    destination: 'Swiss Alps & Glaciers',
    country: 'Switzerland',
    badge: 'SUMMER SPECIAL',
    badgeColor: 'bg-cyan-500/90 text-white',
    offerTitle: 'SAVE ₹6,000 On International Flights',
    offerDescription: 'Zero convenience fee on direct flights from Delhi/Mumbai with 100% free date change protection.',
    promoCode: 'GLOBALFLY',
    savings: 'Save ₹6,000 on Roundtrips',
  },
  {
    id: 'bali',
    image: destBali,
    destination: 'Bali Clifftops & Ubud',
    country: 'Indonesia',
    badge: 'HOT HOLIDAY DEAL',
    badgeColor: 'bg-rose-500/90 text-white',
    offerTitle: 'BUY 1 GET 1 FREE Resort Stays',
    offerDescription: 'Book 3 nights in Ubud rainforest or Seminyak beach club resort and get 2 nights free in Nusa Penida.',
    promoCode: 'BALIBOGO',
    savings: 'Value ₹22,500 Free',
  },
  {
    id: 'dubai',
    image: destDubai,
    destination: 'Dubai Skyline & Marina',
    country: 'United Arab Emirates',
    badge: 'CITY BREAK',
    badgeColor: 'bg-amber-500/90 text-white',
    offerTitle: 'FREE Burj Khalifa Top Deck Tickets',
    offerDescription: 'Includes VIP fast-track tickets to Level 124 + premium 4x4 red dune desert safari on all 4N packages.',
    promoCode: 'BURJFREE',
    savings: 'Save ₹7,200',
  },
  {
    id: 'paris',
    image: destParis,
    destination: 'Paris & Seine Riverfront',
    country: 'France',
    badge: 'ROMANTIC ESCAPE',
    badgeColor: 'bg-purple-500/90 text-white',
    offerTitle: 'FLAT ₹5,000 Instant Cash Voucher',
    offerDescription: 'Earn 3x TripPoints + instant ₹5,000 off on flights & charming boutique Montmartre hotel bookings.',
    promoCode: 'PARISNOW',
    savings: 'Instant ₹5,000 Discount',
  },
];

// Google Logo SVG
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMobile = '',
}) => {
  // Navigation & Method Tabs ('phone' | 'email')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [step, setStep] = useState<AuthStep>('phone-input');

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Phone input states
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(initialMobile);
  const [otp, setOtp] = useState(['', '', '', '']);

  // Email input states
  const [emailInput, setEmailInput] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isEmailSignUp, setIsEmailSignUp] = useState(false);
  const [emailFullName, setEmailFullName] = useState('');

  // Create account states
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Status & loading states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Auto-rotate scenery slideshow every 4.5 seconds
  useEffect(() => {
    if (!isOpen || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_OFFERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, isPaused]);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'otp-verify' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Handle slide copy promo code
  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Format and clean phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(val);
    setError('');
  };

  // Phone OTP Submit
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setCountdown(30);
      setOtp(['', '', '', '']);
      setStep('otp-verify');
    }, 450);
  };

  // Handle single digit OTP change
  const handleOtpBoxChange = (val: string, index: number) => {
    const sanitized = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);
    setError('');

    if (sanitized && index < 3) {
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace in OTP
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`modal-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Quick-fill demo OTP
  const handleQuickFillOtp = () => {
    setOtp(['8', '8', '2', '1']);
    setError('');
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setError('Please enter all 4 digits of the OTP.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const existing = accounts.find((acc) => acc.phone === phoneNumber);

        if (existing) {
          onLoginSuccess(existing.name || 'Rahul Sharma', existing.email || `${phoneNumber}@tripyeah.com`, phoneNumber);
          onClose();
        } else {
          setStep('create-account');
        }
      } catch {
        setStep('create-account');
      }
    }, 400);
  };

  // Create Account Submit
  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to TripYeah Terms of Service.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userEmail = `${phoneNumber}@tripyeah.com`;

      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const newAccount = {
          phone: phoneNumber,
          name: fullName.trim(),
          email: userEmail,
          password: password,
          createdAt: new Date().toISOString(),
        };
        const updatedAccounts = [...accounts.filter((a) => a.phone !== phoneNumber), newAccount];
        localStorage.setItem('tripyeah_registered_accounts', JSON.stringify(updatedAccounts));
      } catch (err) {
        console.warn('LocalStorage save note:', err);
      }

      onLoginSuccess(fullName.trim(), userEmail, phoneNumber);
      onClose();
    }, 450);
  };

  // Email Login / Sign Up Submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!emailPassword || emailPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (isEmailSignUp && !emailFullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userNameCalculated = isEmailSignUp
        ? emailFullName.trim()
        : emailInput.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      // Save user record
      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const newAccount = {
          email: emailInput.trim(),
          name: userNameCalculated,
          phone: '+91 98765 43210',
          password: emailPassword,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('tripyeah_registered_accounts', JSON.stringify([...accounts, newAccount]));
      } catch {}

      onLoginSuccess(userNameCalculated, emailInput.trim(), '+91 98765 43210');
      onClose();
    }, 450);
  };

  // Google 1-Click Login Simulation
  const handleGoogleLogin = (chosenName?: string, chosenEmail?: string) => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const gName = chosenName || 'Aryan Kapoor';
      const gEmail = chosenEmail || 'aryan.kapoor@gmail.com';

      // Save to registered accounts
      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const newAccount = {
          name: gName,
          email: gEmail,
          phone: '+91 98110 54321',
          provider: 'google',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('tripyeah_registered_accounts', JSON.stringify([...accounts, newAccount]));
      } catch {}

      onLoginSuccess(gName, gEmail, '+91 98110 54321');
      onClose();
    }, 500);
  };

  const activeSlideData = SLIDESHOW_OFFERS[currentSlide];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Medium-Sized Balanced 2-Column Modal */}
      <div className="bg-white rounded-3xl max-w-xl md:max-w-3xl lg:max-w-[780px] w-full overflow-hidden shadow-2xl border border-slate-200/90 relative animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 min-h-[460px] sm:min-h-[500px]">
        
        {/* =====================================================================
            LEFT COLUMN (5-cols on md+): SCENERIES SLIDESHOW WITH TRAVEL OFFERS
           ===================================================================== */}
        <div
          className="md:col-span-5 relative overflow-hidden bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-5 lg:p-6 min-h-[220px] md:min-h-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Animated Background Scenery Images with Crossfade */}
          <div className="absolute inset-0 z-0">
            {SLIDESHOW_OFFERS.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.destination}
                  className="w-full h-full object-cover object-center contrast-105 saturate-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}

            {/* Dark Cinematic Gradient Vignette so Text & Offers are 100% Readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/30 pointer-events-none" />
          </div>

          {/* Top Brand Tag & Slideshow Progress */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner border border-white/25">
                TY
              </span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-cyan-300 drop-shadow-sm">
                TripYeah Member Club
              </span>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {SLIDESHOW_OFFERS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide ? 'w-5 bg-cyan-400' : 'w-1.5 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Middle: Active Slide Destination & Discount Voucher Overlay */}
          <div className="relative z-10 my-auto py-3 sm:py-4 space-y-2.5">
            {/* Offer Badge & Destination Pill */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${activeSlideData.badgeColor}`}>
                {activeSlideData.badge}
              </span>
              <span className="text-[10px] font-semibold text-slate-200 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/15">
                <Compass className="w-3 h-3 text-cyan-400" />
                <span>{activeSlideData.destination}</span>
              </span>
            </div>

            {/* Dynamic Offer Title */}
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow-md">
              {activeSlideData.offerTitle}
            </h3>

            {/* Offer Description */}
            <p className="text-xs text-slate-200/90 leading-relaxed max-w-sm drop-shadow-sm font-medium line-clamp-2">
              {activeSlideData.offerDescription}
            </p>

            {/* Interactive Coupon Box */}
            <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-slate-300 block tracking-wider leading-none">
                    Use Promo Code
                  </span>
                  <span className="font-mono text-xs font-extrabold text-cyan-300 tracking-wider">
                    {activeSlideData.promoCode}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(activeSlideData.promoCode)}
                className="px-2.5 py-1 rounded-lg bg-white text-slate-900 text-[11px] font-bold hover:bg-cyan-50 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs active:scale-95"
              >
                {copiedCode === activeSlideData.promoCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Slideshow Controls & Trust Benefit */}
          <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-medium">
              <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>₹1,000 Welcome Voucher</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDESHOW_OFFERS.length) % SLIDESHOW_OFFERS.length)}
                className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Previous Offer Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_OFFERS.length)}
                className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Next Offer Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (7-cols on md+): AUTHENTICATION FORMS & GOOGLE SIGN-IN
           ===================================================================== */}
        <div className="md:col-span-7 p-5 sm:p-6 lg:p-7 flex flex-col justify-between relative bg-white">
          
          {/* Top Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-20"
            aria-label="Close login modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Branding & Method Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2 pr-8">
              <TripYeahLogo className="h-6 sm:h-7 w-auto" />
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {step === 'otp-verify'
                ? 'Verify Mobile Number'
                : step === 'create-account'
                ? 'Complete Profile'
                : authMethod === 'email'
                ? isEmailSignUp
                  ? 'Create Account with Email'
                  : 'Welcome Back! Sign In'
                : 'Login or Create Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 mb-3.5">
              {step === 'otp-verify'
                ? `Enter 4-digit code sent to ${countryCode} ${phoneNumber}`
                : 'Access lowest member fares, free date changes & instant refunds.'}
            </p>

            {/* Method Tabs: Phone Number vs Email ID (Only visible on initial step) */}
            {(step === 'phone-input' || step === 'email-login') && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setStep('phone-input');
                    setError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setStep('email-login');
                    setError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email ID</span>
                </button>
              </div>
            )}
          </div>

          {/* Error Message Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Content Area */}
          <div className="flex-1 flex flex-col justify-center">

            {/* -------------------------------------------------------------
                METHOD 1: PHONE NUMBER INPUT
               ------------------------------------------------------------- */}
            {step === 'phone-input' && authMethod === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-slate-50 transition-all overflow-hidden">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-slate-100/90 text-xs font-bold text-slate-800 px-2.5 py-2.5 border-r border-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        autoFocus
                        required
                        className="w-full px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-slate-400 font-mono-tabular"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Instant 4-digit OTP will be dispatched via SMS &amp; WhatsApp</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue with Mobile OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                METHOD 2: EMAIL LOGIN & PASSWORD
               ------------------------------------------------------------- */}
            {step === 'email-login' && authMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                {isEmailSignUp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emailFullName}
                        onChange={(e) => setEmailFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        required
                        autoFocus
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      required
                      autoFocus={!isEmailSignUp}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password *
                    </label>
                    {!isEmailSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMethod('phone');
                          setStep('phone-input');
                        }}
                        className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showEmailPassword ? 'text' : 'password'}
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showEmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !emailInput || !emailPassword}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{isEmailSignUp ? 'Create Account & Sign In' : 'Sign In with Email'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1 text-xs text-slate-600">
                  {isEmailSignUp ? (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsEmailSignUp(false)}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </span>
                  ) : (
                    <span>
                      New to TripYeah?{' '}
                      <button
                        type="button"
                        onClick={() => setIsEmailSignUp(true)}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Create Account
                      </button>
                    </span>
                  )}
                </div>
              </form>
            )}

            {/* -------------------------------------------------------------
                STEP 2: OTP VERIFICATION
               ------------------------------------------------------------- */}
            {step === 'otp-verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                  <span className="text-slate-700">
                    OTP sent to <strong className="font-mono text-slate-900">{countryCode} {phoneNumber}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('phone-input')}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 my-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`modal-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => handleOtpBoxChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      autoFocus={idx === 0}
                      className="w-13 h-14 text-center font-mono-tabular text-2xl font-bold text-slate-900 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:bg-blue-50/30 focus:outline-none transition-all shadow-2xs"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {countdown > 0 ? (
                      `Resend OTP in ${countdown}s`
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCountdown(30);
                          setError('');
                        }}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickFillOtp}
                    className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    ⚡ Demo Auto-Fill (8821)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 4}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify &amp; Continue</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone-input')}
                  className="w-full py-1 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Back to Number Entry
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                STEP 3: CREATE ACCOUNT (NAME & PASSWORD)
               ------------------------------------------------------------- */}
            {step === 'create-account' && (
              <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name (as on Gov ID) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      autoFocus
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agree-terms-check"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="agree-terms-check" className="text-[11px] text-slate-500 leading-tight">
                    I agree to TripYeah's Terms of Service and Privacy Policy. Send booking confirmations &amp; flight check-in alerts.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !fullName.trim() || !password}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Create Account &amp; Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                GOOGLE 1-CLICK SOCIAL LOGIN BUTTON (Always accessible)
               ------------------------------------------------------------- */}
            {(step === 'phone-input' || step === 'email-login') && (
              <div className="mt-3.5 space-y-2.5">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative">
                    Or continue with
                  </span>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={() => handleGoogleLogin('Aryan Kapoor', 'aryan.kapoor@gmail.com')}
                  disabled={loading}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-bold text-slate-700 text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                {/* One-Click Demo Explorer Sign In */}
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <span className="text-[10px] text-slate-400">Quick Test:</span>
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin('Rahul Sharma', 'rahul.sharma@example.com')}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    ⚡ Demo Account (Rahul)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Trust & Compliance Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL Encrypted</span>
            </span>
            <span>By proceeding you agree to TripYeah T&amp;C</span>
          </div>

        </div>
      </div>
    </div>
  );
};
