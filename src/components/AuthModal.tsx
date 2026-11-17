import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { TripYeahLogo } from './TripYeahLogo';
import { useTranslation } from 'react-i18next';
import {
  auth,
  googleAuthProvider,
  appleAuthProvider,
  facebookAuthProvider,
  db,
} from '../lib/firebase';
import { signInWithPopup, AuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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

export type AuthMethod = 'email';
export type AuthStep = 'email-login';

// Curated Slideshow Sceneries
const SLIDESHOW_OFFERS = [
  { id: 'maldives', image: destMaldives, destination: 'Maldives' },
  { id: 'swiss', image: destSwissAlps, destination: 'Swiss Alps & Glaciers' },
  { id: 'bali', image: destBali, destination: 'Bali Clifftops & Ubud' },
  { id: 'dubai', image: destDubai, destination: 'Dubai Skyline & Marina' },
  { id: 'paris', image: destParis, destination: 'Paris & Seine Riverfront' },
];

// Google Logo SVG
const GoogleIcon = ({ className = 'w-5 h-5 shrink-0' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
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

// Apple Logo SVG
const AppleIcon = ({ className = 'w-5 h-5 shrink-0' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
  </svg>
);

// Facebook Logo SVG
const FacebookIcon = ({ className = 'w-5 h-5 shrink-0' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.099 24 12.073z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}) => {
  const { t } = useTranslation();

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Email input state
  const [emailInput, setEmailInput] = useState('');

  // Status & loading states
  const [error, setError] = useState('');
  const [infoNotice, setInfoNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'email' | 'google' | 'apple' | 'facebook' | null>(null);

  // Auto-rotate scenery slideshow every 4.5 seconds
  useEffect(() => {
    if (!isOpen || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_OFFERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, isPaused]);

  if (!isOpen) return null;

  // Email Login Submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setInfoNotice('');
    setLoading(true);
    setActiveProvider('email');

    setTimeout(() => {
      setLoading(false);
      setActiveProvider(null);
      const rawName = cleanEmail
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const isBootstrappedAdmin = cleanEmail.toLowerCase() === 'meetsingh7416@gmail.com';
      const userName = rawName || 'Traveller';
      const resolvedRole: 'user' | 'admin' = isBootstrappedAdmin ? 'admin' : 'user';

      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const newAccount = {
          email: cleanEmail,
          name: userName,
          phone: '',
          accountType: 'email_user',
          role: resolvedRole,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          'tripyeah_registered_accounts',
          JSON.stringify([...accounts.filter((a) => a.email !== cleanEmail), newAccount])
        );
        localStorage.setItem('tripyeah_user_role', resolvedRole);
        localStorage.setItem('tripyeah_logged_user', userName);
        localStorage.setItem('tripyeah_user_email', cleanEmail);
      } catch {}

      onLoginSuccess(userName, cleanEmail, '', resolvedRole);
      onClose();
    }, 350);
  };

  // Real Firebase Social Login with Popup (Google, Apple, Facebook)
  const handleSocialLogin = async (providerKey: 'google' | 'apple' | 'facebook') => {
    if (loading) return;
    setLoading(true);
    setActiveProvider(providerKey);
    setError('');
    setInfoNotice('');

    const providerMap: Record<'google' | 'apple' | 'facebook', AuthProvider> = {
      google: googleAuthProvider,
      apple: appleAuthProvider,
      facebook: facebookAuthProvider,
    };

    const providerLabelMap: Record<'google' | 'apple' | 'facebook', string> = {
      google: 'Google',
      apple: 'Apple',
      facebook: 'Facebook',
    };

    const selectedProvider = providerMap[providerKey];
    const providerLabel = providerLabelMap[providerKey];

    try {
      const result = await signInWithPopup(auth, selectedProvider);
      const user = result.user;
      const resolvedEmail = user.email || '';
      const resolvedName =
        user.displayName ||
        resolvedEmail.split('@')[0] ||
        `${providerLabel} Traveller`;
      const isBootstrappedAdmin = resolvedEmail.toLowerCase() === 'meetsingh7416@gmail.com';
      const resolvedRole: 'user' | 'admin' = isBootstrappedAdmin ? 'admin' : 'user';

      // Persist user record in Firestore
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            id: user.uid,
            email: resolvedEmail,
            displayName: resolvedName,
            photoURL: user.photoURL || '',
            provider: providerKey,
            role: resolvedRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn('Firestore user profile sync notice:', fsErr);
      }

      try {
        localStorage.setItem('tripyeah_user_role', resolvedRole);
        localStorage.setItem('tripyeah_logged_user', resolvedName);
        if (resolvedEmail) {
          localStorage.setItem('tripyeah_user_email', resolvedEmail);
        }
        if (user.phoneNumber) {
          localStorage.setItem('tripyeah_user_phone', user.phoneNumber);
        }
      } catch {}

      setLoading(false);
      setActiveProvider(null);
      onLoginSuccess(resolvedName, resolvedEmail, user.phoneNumber || '', resolvedRole);
      onClose();
    } catch (popupErr: any) {
      console.warn(`Firebase ${providerLabel} signInWithPopup error:`, popupErr?.code || popupErr?.message);
      setLoading(false);
      setActiveProvider(null);

      const errCode = popupErr?.code || '';
      if (errCode === 'auth/popup-closed-by-user' || errCode === 'auth/cancelled-popup-request') {
        setError(`${providerLabel} sign-in popup was closed. Please try again.`);
      } else if (errCode === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (
        errCode === 'auth/operation-not-allowed' ||
        errCode === 'auth/configuration-not-found' ||
        errCode === 'auth/invalid-credential'
      ) {
        setError(
          `${providerLabel} sign-in is not yet enabled in Firebase Console (Authentication → Sign-in method → ${providerLabel}). Please enable it or continue with Email / Google.`
        );
      } else if (errCode === 'auth/account-exists-with-different-credential') {
        setError(
          'An account already exists with this email using another login method. Please sign in with Google or Email.'
        );
      } else if (errCode === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase Console. Please sign in using Email.');
      } else {
        setError(popupErr?.message || `${providerLabel} sign-in could not be completed. Please try again.`);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Login or Create Account"
    >
      {/* Medium-Sized Balanced 2-Column Modal (Original Normal Size) */}
      <div className="bg-slate-900 rounded-3xl max-w-xl md:max-w-3xl lg:max-w-[780px] w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 min-h-[460px] sm:min-h-[500px]">
        {/* =====================================================================
            LEFT COLUMN (5-cols on md+): SCENERIES SLIDESHOW
           ===================================================================== */}
        <div
          className="md:col-span-5 relative overflow-hidden bg-slate-900 flex flex-col justify-between p-4 sm:p-5 min-h-[220px] md:min-h-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
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
            RIGHT COLUMN (7-cols on md+): EMAIL LOGIN & SOCIAL PROVIDERS
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

          {/* Top Branding */}
          <div>
            <div className="flex items-center justify-between mb-3 pr-8">
              <TripYeahLogo className="h-7.5 sm:h-8.5 w-auto" />
            </div>
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
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Content Area */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Email Tab Pill */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
              <div className="flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-white text-blue-600 shadow-2xs">
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </div>
            </div>

            {/* EMAIL LOGIN FORM */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="auth-email-input"
                  className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
                >
                  EMAIL ADDRESS
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-slate-50 transition-all overflow-hidden">
                  <div className="pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      id="auth-email-input"
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter Email Address"
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
                {loading && activeProvider === 'email' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t('auth.continue', 'Continue')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* SOCIAL LOGIN BUTTONS: ICON ONLY (GOOGLE, APPLE & FACEBOOK) */}
            <div className="mt-3.5 space-y-2.5">
              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative z-10 bg-white px-3 text-[11px] font-medium text-slate-400 text-center">
                  {t('auth.orContinueWith', 'or Login/Signup with')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Google (icon only) */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  title="Continue with Google"
                  aria-label="Continue with Google"
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading && activeProvider === 'google' ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />
                  ) : (
                    <GoogleIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Apple (icon only) */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={loading}
                  title="Continue with Apple"
                  aria-label="Continue with Apple"
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-98 disabled:opacity-50 text-slate-900"
                >
                  {loading && activeProvider === 'apple' ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />
                  ) : (
                    <AppleIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Facebook (icon only) */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                  title="Continue with Facebook"
                  aria-label="Continue with Facebook"
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-blue-300 hover:bg-blue-50/40 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading && activeProvider === 'facebook' ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  ) : (
                    <FacebookIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
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
