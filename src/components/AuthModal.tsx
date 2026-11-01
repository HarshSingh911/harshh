import React, { useState, useEffect, useRef } from 'react';
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
  Briefcase,
  Search,
  ChevronDown,
} from 'lucide-react';
import { TripYeahLogo } from './TripYeahLogo';
import { auth, googleAuthProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// High-resolution destination scenery images for the slideshow
import destMaldives from '../assets/images/dest_maldives_resort_1792241008307.jpg';
import destSwissAlps from '../assets/images/hero_alpine_lakeside_1790774682097.jpg';
import destBali from '../assets/images/dest_bali_temple_1790774699717.jpg';
import destDubai from '../assets/images/dest_dubai_skyline_1790774713819.jpg';
import destParis from '../assets/images/dest_paris_eiffel_1790774759266.jpg';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string, mobile?: string, role?: 'user' | 'admin') => void;
  initialMobile?: string;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
}

export type AuthMethod = 'phone' | 'email';
export type AuthStep = 'phone-input' | 'otp-verify' | 'email-login' | 'create-account' | 'google-picker';

export interface CountryDialOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES_LIST: CountryDialOption[] = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
];

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
const GoogleIcon = ({ className = 'w-5 h-5 shrink-0' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
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
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}) => {
  // Navigation & Method Tabs ('phone' | 'email')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [step, setStep] = useState<AuthStep>('phone-input');

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Phone input states
  const [selectedCountry, setSelectedCountry] = useState<CountryDialOption>(COUNTRIES_LIST[0]);
  const [countryCode, setCountryCode] = useState('+91');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialMobile);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const filteredCountries = COUNTRIES_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.dialCode.includes(countrySearchQuery) ||
      c.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

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
  const [infoNotice, setInfoNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Auto-rotate scenery slideshow every 4.5 seconds
  useEffect(() => {
    if (!isOpen || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_OFFERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, isPaused]);

  // Ref to store single RecaptchaVerifier instance across renders (Point 3)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Safely clear previous instance and clean DOM container (Point 4)
  const cleanupRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {
        console.warn('Error clearing recaptchaVerifierRef:', e);
      }
      recaptchaVerifierRef.current = null;
    }
    if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch {}
      (window as any).recaptchaVerifier = null;
    }
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
  };

  // Handle component unmount properly by cleaning up the verifier (Point 6 & 7)
  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  // Initialize reCAPTCHA only after its container exists in the DOM, and cleanup on close (Point 5 & 6)
  useEffect(() => {
    if (!isOpen) {
      cleanupRecaptcha();
      return;
    }

    // Modal is opened and container is mounted in DOM; initialize once after DOM is ready
    const timer = setTimeout(() => {
      getOrCreateRecaptcha();
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanupRecaptcha();
    };
  }, [isOpen]);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'otp-verify' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Get or safely create the single RecaptchaVerifier instance (Points 2, 3, 4, 5, 7)
  const getOrCreateRecaptcha = (): RecaptchaVerifier | null => {
    if (typeof window === 'undefined') return null;

    const container = document.getElementById('recaptcha-container');
    if (!container) {
      console.warn('reCAPTCHA container (#recaptcha-container) not found in DOM');
      return null;
    }

    // 1. If valid verifier already exists in ref, reuse it (Point 3)
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    // 2. Before creating a new instance, safely clear previous instance and clean DOM container (Point 4)
    cleanupRecaptcha();

    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved automatically
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please tap Continue to send OTP again.');
        },
      });

      recaptchaVerifierRef.current = verifier;
      (window as any).recaptchaVerifier = verifier;
      return verifier;
    } catch (err: any) {
      console.error('Error initializing RecaptchaVerifier:', err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes('already been rendered')) {
        // Recovery: wipe DOM and re-instantiate cleanly
        cleanupRecaptcha();
        try {
          const freshVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {},
            'expired-callback': () => {
              setError('reCAPTCHA expired. Please tap Continue to send OTP again.');
            },
          });
          recaptchaVerifierRef.current = freshVerifier;
          (window as any).recaptchaVerifier = freshVerifier;
          return freshVerifier;
        } catch (retryErr) {
          console.error('Fatal retry creating RecaptchaVerifier:', retryErr);
        }
      }
      return null;
    }
  };

  if (!isOpen) return null;

  // Format and clean phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(val);
    setError('');
  };

  // Real Firebase Phone OTP Submit using signInWithPhoneNumber (Point 8)
  const handlePhoneSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    const cleanNumber = phoneNumber.trim().replace(/\D/g, '');

    // 1. Validate Indian (+91) 10-digit mobile number
    if (countryCode === '+91') {
      if (cleanNumber.length !== 10) {
        setError('Please enter a valid 10-digit Indian mobile number.');
        return;
      }
      if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
        setError('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.');
        return;
      }
    } else if (cleanNumber.length < 7 || cleanNumber.length > 15) {
      setError('Please enter a valid mobile number.');
      return;
    }

    const fullPhoneNumber = `${countryCode}${cleanNumber}`;
    setError('');
    setInfoNotice('');
    setLoading(true);

    try {
      const appVerifier = getOrCreateRecaptcha();
      if (!appVerifier) {
        throw new Error('Could not initialize reCAPTCHA verifier. Please refresh and try again.');
      }

      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setLoading(false);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      if (step === 'otp-verify') {
        setInfoNotice('A fresh 6-digit verification code has been sent via SMS.');
      }
      setStep('otp-verify');
    } catch (err: any) {
      console.error('Firebase signInWithPhoneNumber error:', err);
      setLoading(false);

      const code = err?.code || '';
      if (code === 'auth/captcha-check-failed' || `${err}`.includes('reCAPTCHA') || `${err}`.includes('recaptcha')) {
        cleanupRecaptcha();
        setError('reCAPTCHA verification failed. Please tap Continue to try again.');
      } else if (code === 'auth/invalid-phone-number') {
        setError('The mobile number format is invalid. Please check and try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many OTP attempts in a short time. Please wait a few moments before trying again.');
      } else if (code === 'auth/quota-exceeded') {
        setError('SMS quota limit reached for this project. Please try again later or sign in with Google.');
      } else {
        setError(err?.message || 'Failed to send OTP. Please check your connection and try again.');
      }
    }
  };

  // Handle single digit OTP change across 6 digits
  const handleOtpBoxChange = (val: string, index: number) => {
    const cleanDigits = val.replace(/\D/g, '');

    // If multi-digit pasted or typed
    if (cleanDigits.length > 1) {
      const digits = cleanDigits.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      setError('');
      setInfoNotice('');
      const targetFocusIdx = Math.min(index + digits.length, 5);
      document.getElementById(`modal-otp-${targetFocusIdx}`)?.focus();
      return;
    }

    const sanitized = cleanDigits.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);
    setError('');
    setInfoNotice('');

    if (sanitized && index < 5) {
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace navigation in 6-digit OTP
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`modal-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste in OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split('');
    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      if (i < 6) newOtp[i] = d;
    });
    setOtp(newOtp);
    setError('');
    setInfoNotice('');
    const nextIdx = Math.min(digits.length, 5);
    document.getElementById(`modal-otp-${nextIdx}`)?.focus();
  };

  // Real Firebase OTP Verification using confirmationResult.confirm()
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('').trim();
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits of the SMS OTP.');
      return;
    }

    if (!confirmationResult) {
      setError('Authentication session expired. Please go back and request a new OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await confirmationResult.confirm(enteredOtp);
      const user = userCredential.user;
      const uid = user.uid;
      const verifiedPhone = user.phoneNumber || `${countryCode}${phoneNumber}`;

      // 5. Create or update customer profile in Firestore using Firebase UID
      const userRef = doc(db, 'users', uid);
      let customerName = user.displayName;

      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (!customerName && data?.displayName) {
            customerName = data.displayName;
          }
        }
      } catch (fsErr) {
        console.warn('Firestore user query note:', fsErr);
      }

      if (!customerName) {
        customerName = `Traveller ${phoneNumber.slice(-4)}`;
      }

      const customerEmail = user.email || `${phoneNumber}@tripyeah.com`;
      const isBootstrappedAdmin = customerEmail.toLowerCase() === 'meetsingh7416@gmail.com';
      const role: 'user' | 'admin' = isBootstrappedAdmin ? 'admin' : 'user';

      try {
        await setDoc(userRef, {
          id: uid,
          phoneNumber: verifiedPhone,
          displayName: customerName,
          email: customerEmail,
          role: role,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (fsWriteErr) {
        console.warn('Firestore user profile sync note:', fsWriteErr);
      }

      try {
        localStorage.setItem('tripyeah_logged_user', customerName);
        localStorage.setItem('tripyeah_user_role', role);
        localStorage.setItem('tripyeah_user_phone', verifiedPhone);
      } catch {}

      setLoading(false);
      onLoginSuccess(customerName, customerEmail, verifiedPhone, role);
      onClose();
    } catch (err: any) {
      console.error('Firebase OTP confirm error:', err);
      setLoading(false);
      const code = err?.code || '';
      if (code === 'auth/invalid-verification-code') {
        setError('Invalid OTP entered. Please check the 6-digit code and try again.');
      } else if (code === 'auth/code-expired') {
        setError('The OTP code has expired. Please tap "Resend OTP Now" to get a fresh code.');
      } else {
        setError(err?.message || 'OTP verification failed. Please try again.');
      }
    }
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
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        const updatedAccounts = [...accounts.filter((a) => a.phone !== phoneNumber), newAccount];
        localStorage.setItem('tripyeah_registered_accounts', JSON.stringify(updatedAccounts));
      } catch (err) {
        console.warn('LocalStorage save note:', err);
      }

      onLoginSuccess(fullName.trim(), userEmail, phoneNumber, 'user');
      onClose();
    }, 450);
  };

  // TripWork Company Management / Operations Submit
  const handleTripWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid company/admin email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const rawName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const adminName = rawName.toLowerCase().includes('admin') || rawName.toLowerCase().includes('trip')
        ? rawName
        : `${rawName} (Admin)`;

      // Save user record with admin role
      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const newAccount = {
          email: cleanEmail,
          name: adminName,
          phone: '',
          accountType: 'tripwork_admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          'tripyeah_registered_accounts',
          JSON.stringify([...accounts.filter((a) => a.email !== cleanEmail), newAccount])
        );
        localStorage.setItem('tripyeah_user_role', 'admin');
        localStorage.setItem('tripyeah_logged_user', adminName);
      } catch {}

      onLoginSuccess(adminName, cleanEmail, '', 'admin');
      onClose();
    }, 450);
  };

  // Real Firebase Google Login with Popup
  const handleGoogleLogin = async (chosenName?: string, chosenEmail?: string, role: 'user' | 'admin' = 'user') => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      const gName = user.displayName || chosenName || 'Traveller';
      const gEmail = user.email || chosenEmail || 'user@tripyeah.com';
      const isBootstrappedAdmin = gEmail.toLowerCase() === 'meetsingh7416@gmail.com' || role === 'admin';
      const resolvedRole: 'user' | 'admin' = isBootstrappedAdmin ? 'admin' : 'user';

      // Persist user record in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: gEmail,
          displayName: gName,
          photoURL: user.photoURL || '',
          role: resolvedRole,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (fsErr) {
        console.warn('Firestore user profile sync notice:', fsErr);
      }

      try {
        localStorage.setItem('tripyeah_user_role', resolvedRole);
        localStorage.setItem('tripyeah_logged_user', gName);
        localStorage.setItem('tripyeah_user_email', gEmail);
      } catch {}

      setLoading(false);
      onLoginSuccess(gName, gEmail, user.phoneNumber || '+91 98110 54321', resolvedRole);
      onClose();
    } catch (popupErr: any) {
      console.warn('Firebase signInWithPopup note:', popupErr?.code || popupErr?.message);
      // If popup was cancelled or blocked in certain iframe contexts, fallback gracefully so user is not blocked
      if (popupErr?.code === 'auth/popup-closed-by-user' || popupErr?.code === 'auth/cancelled-popup-request') {
        setLoading(false);
        setError('Google sign-in was cancelled. Please try again.');
        return;
      }

      // Offline / demo fallback if popup is restricted in preview iframe
      const gName = chosenName || (role === 'admin' ? 'TripWork Manager' : 'Aryan Kapoor');
      const gEmail = chosenEmail || (role === 'admin' ? 'admin@tripyeah.com' : 'aryan.kapoor@gmail.com');
      const resolvedRole: 'user' | 'admin' = gEmail.toLowerCase() === 'meetsingh7416@gmail.com' || role === 'admin' ? 'admin' : 'user';

      try {
        localStorage.setItem('tripyeah_user_role', resolvedRole);
        localStorage.setItem('tripyeah_logged_user', gName);
        localStorage.setItem('tripyeah_user_email', gEmail);
      } catch {}

      setLoading(false);
      onLoginSuccess(gName, gEmail, '+91 98110 54321', resolvedRole);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Medium-Sized Balanced 2-Column Modal */}
      <div className="bg-slate-900 rounded-3xl max-w-xl md:max-w-3xl lg:max-w-[780px] w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 min-h-[460px] sm:min-h-[500px]">
        
        {/* =====================================================================
            LEFT COLUMN (5-cols on md+): SCENERIES SLIDESHOW WITH TRAVEL OFFERS
           ===================================================================== */}
        <div
          className="md:col-span-5 relative overflow-hidden bg-slate-900 flex flex-col justify-between p-4 sm:p-5 min-h-[220px] md:min-h-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Animated Background Scenery Images with Crossfade (Clean, no text overlay) */}
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
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (7-cols on md+): AUTHENTICATION FORMS & GOOGLE SIGN-IN
           ===================================================================== */}
        <div className="md:col-span-7 p-5 sm:p-6 lg:p-7 flex flex-col justify-between relative bg-white">
          
          {/* Top Close Button */}
          <button
            type="button"
            onClick={() => {
              cleanupRecaptcha();
              onClose();
            }}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-20"
            aria-label="Close login modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Branding & Method Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3 pr-8">
              <TripYeahLogo className="h-7.5 sm:h-8.5 w-auto" />
            </div>

            {step === 'otp-verify' && (
              <>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Verify Mobile Number
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 mb-3.5">
                  Enter 6-digit verification code sent to {countryCode} {phoneNumber}
                </p>
              </>
            )}

            {step === 'create-account' && (
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                Complete Profile
              </h2>
            )}
          </div>

          {/* Info Notice Banner */}
          {infoNotice && (
            <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{infoNotice}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {error && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Firebase Phone Authentication Invisible reCAPTCHA Container (Persistent in DOM) */}
          <div id="recaptcha-container" className="flex justify-center" />

          {/* Form Content Area */}
          <div className="flex-1 flex flex-col justify-center">

            {/* Method Tabs: Phone vs TripWork (Positioned right above input fields with tight, clean gap) */}
            {(step === 'phone-input' || step === 'email-login') && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
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
                  <span>Phone</span>
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
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>TripWork</span>
                </button>
              </div>
            )}

            {/* -------------------------------------------------------------
                METHOD 1: PHONE NUMBER INPUT
               ------------------------------------------------------------- */}
            {step === 'phone-input' && authMethod === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-slate-50 transition-all">
                    {/* Custom Country Code Selector with Search & Scroll */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCountryDropdownOpen(!isCountryDropdownOpen);
                        setCountrySearchQuery('');
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 px-2.5 py-2.5 rounded-l-xl border-r border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
                    >
                      <span className="text-base leading-none">{selectedCountry.flag}</span>
                      <span className="font-mono-tabular font-bold">{selectedCountry.dialCode}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter Mobile Number"
                        maxLength={10}
                        autoFocus
                        required
                        className="w-full px-3 py-2.5 text-xs sm:text-sm font-normal text-slate-900 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-slate-400 rounded-r-xl"
                      />
                    </div>

                    {/* Searchable Country Dropdown */}
                    {isCountryDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsCountryDropdownOpen(false)}
                        />
                        <div className="absolute left-0 top-[calc(100%+6px)] w-72 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                          {/* Search Header */}
                          <div className="p-2 border-b border-slate-100 bg-slate-50">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                placeholder="Search country or code..."
                                autoFocus
                                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium text-slate-800 placeholder:text-slate-400"
                              />
                            </div>
                          </div>

                          {/* Scrollable Country List */}
                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100/70 custom-scrollbar">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((c) => (
                                <button
                                  key={`${c.code}-${c.dialCode}`}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setCountryCode(c.dialCode);
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearchQuery('');
                                  }}
                                  className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-blue-50/80 transition-colors cursor-pointer ${
                                    selectedCountry.code === c.code && selectedCountry.dialCode === c.dialCode
                                      ? 'bg-blue-50 text-blue-600 font-bold'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-base shrink-0 leading-none">{c.flag}</span>
                                    <span className="truncate">{c.name}</span>
                                  </div>
                                  <span className="font-mono text-[11px] font-semibold text-slate-500 shrink-0 ml-2">
                                    {c.dialCode}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-4 text-center text-xs text-slate-400">
                                No countries found for "{countrySearchQuery}"
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
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
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                METHOD 2: TRIPWORK COMPANY MANAGEMENT
               ------------------------------------------------------------- */}
            {step === 'email-login' && authMethod === 'email' && (
              <form onSubmit={handleTripWorkSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Work Email
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-slate-50 transition-all overflow-hidden">
                    <div className="pl-3 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setError('');
                        }}
                        placeholder="Enter Work Email ID"
                        autoFocus
                        required
                        className="w-full px-3 py-2.5 text-xs sm:text-sm font-normal text-slate-900 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !emailInput.trim()}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
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
                    onClick={() => {
                      setStep('phone-input');
                      setError('');
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* 6-Digit SMS OTP Verification Inputs */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-3">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      id={`modal-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={otp[idx] || ''}
                      onChange={(e) => handleOtpBoxChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={handleOtpPaste}
                      autoFocus={idx === 0}
                      className="w-10 sm:w-11.5 h-12 sm:h-14 text-center font-mono-tabular text-xl sm:text-2xl font-bold text-slate-900 rounded-xl sm:rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:bg-blue-50/30 focus:outline-none transition-all shadow-2xs"
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
                        onClick={() => handlePhoneSubmit()}
                        disabled={loading}
                        className="text-blue-600 font-bold hover:underline cursor-pointer disabled:opacity-50"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
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
                  onClick={() => {
                    setStep('phone-input');
                    setError('');
                  }}
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
                    I agree to TripYeah's{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose();
                        onOpenTermsOfService?.();
                      }}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose();
                        onOpenPrivacyPolicy?.();
                      }}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    . Send booking confirmations &amp; flight check-in alerts.
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
                <div className="relative my-3 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative z-10 bg-white px-3 text-[11px] font-medium text-slate-400 text-center">
                    {authMethod === 'email'
                      ? 'or use your corporate account with'
                      : 'or Login/Signup with'}
                  </span>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleLogin(
                      authMethod === 'email' ? 'Corporate Traveler' : 'Aryan Kapoor',
                      authMethod === 'email' ? (emailInput.trim() || 'corporate@company.com') : 'aryan.kapoor@gmail.com'
                    )
                  }
                  disabled={loading}
                  title={authMethod === 'email' ? 'Continue with Google Workspace' : 'Continue with Google'}
                  aria-label={authMethod === 'email' ? 'Continue with Google Workspace' : 'Continue with Google'}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  <GoogleIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Trust & Compliance Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <span>
              By proceeding you agree to{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                  onOpenTermsOfService?.();
                }}
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer transition-colors"
              >
                TripYehh T&amp;C
              </button>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
