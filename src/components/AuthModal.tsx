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
  Smartphone,
  RefreshCw,
  KeyRound,
} from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string, mobile?: string) => void;
  initialMobile?: string;
}

export type AuthStep = 'phone-input' | 'otp-verify' | 'create-account' | 'password-login';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMobile = '',
}) => {
  // Navigation step state
  const [step, setStep] = useState<AuthStep>('phone-input');

  // Input states
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(initialMobile);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & error states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'otp-verify' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Format and clean phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(val);
    setError('');
  };

  // Step 1: Submit Phone Number
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate OTP dispatch
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

    // Auto-focus next input
    if (sanitized && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace in OTP
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Helper quick-fill demo OTP
  const handleQuickFillOtp = () => {
    setOtp(['8', '8', '2', '1']);
    setError('');
  };

  // Step 2: Verify OTP
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
      // Check if user already exists in saved accounts
      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const existing = accounts.find((acc) => acc.phone === phoneNumber);

        if (existing) {
          // Existing user login successful!
          onLoginSuccess(existing.name || 'Explorer', existing.email || `${phoneNumber}@tripyeah.com`, phoneNumber);
          onClose();
        } else {
          // New user -> proceed to create account screen
          setStep('create-account');
        }
      } catch {
        setStep('create-account');
      }
    }, 400);
  };

  // Step 3: Create Account (Name, Email & Password)
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
      const userEmail = email.trim() || `${phoneNumber}@tripyeah.com`;

      // Save to registered accounts list in localStorage
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

        // Save default profile
        const defaultProfile = {
          fullName: fullName.trim(),
          mobile: `${countryCode} ${phoneNumber}`,
          email: userEmail,
          gender: 'Male',
          dob: '15 Aug 1996',
          nationality: 'Indian',
          maritalStatus: 'Single',
          anniversary: '',
          city: 'New Delhi',
          state: 'Delhi',
          passportNumber: 'Z' + Math.floor(1000000 + Math.random() * 9000000),
          passportExpiry: '2034-08-15',
          panNumber: 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'F',
          insurancePreference: 'Comprehensive International TripProtect (Schengen & Worldwide)',
          frequentFlyers: [
            { id: 'ff-1', airline: 'Air India', program: 'Flying Returns', number: 'AI-8839201' },
            { id: 'ff-2', airline: 'IndiGo', program: '6E Rewards', number: '6E-4491023' },
          ],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          bannerUrl: '/assets/images/hero_alpine_lakeside_1790774682097.jpg',
        };
        localStorage.setItem('tripyeah_user_profile', JSON.stringify(defaultProfile));
      } catch (err) {
        console.warn('LocalStorage save note:', err);
      }

      onLoginSuccess(fullName.trim(), userEmail, phoneNumber);
      onClose();
    }, 450);
  };

  // Alternative: Direct Password Login for existing users
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        const storedAccountsStr = localStorage.getItem('tripyeah_registered_accounts');
        const accounts: any[] = storedAccountsStr ? JSON.parse(storedAccountsStr) : [];
        const user = accounts.find((a) => a.phone === phoneNumber);

        if (user && user.password === loginPassword) {
          onLoginSuccess(user.name, user.email, phoneNumber);
          onClose();
        } else if (loginPassword === '123456' || loginPassword === 'password') {
          // Demo fallback
          onLoginSuccess('Aarav Sharma', `${phoneNumber}@tripyeah.com`, phoneNumber);
          onClose();
        } else {
          setError('Incorrect password or account not found. Try OTP login.');
        }
      } catch {
        onLoginSuccess('Aarav Sharma', `${phoneNumber}@tripyeah.com`, phoneNumber);
        onClose();
      }
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200/90 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-[#1E2452] via-[#2563EB] to-indigo-700 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
              TY
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-sky-200">
              TripYeah Member Access
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-white">
            {step === 'phone-input' && 'Login / Register'}
            {step === 'otp-verify' && 'Enter Verification Code'}
            {step === 'create-account' && 'Create Your Account'}
            {step === 'password-login' && 'Sign In with Password'}
          </h3>
          <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
            {step === 'phone-input' && 'Enter your mobile number to unlock lowest member fares & instant bookings.'}
            {step === 'otp-verify' && `We've sent a 4-digit OTP to ${countryCode} ${phoneNumber}`}
            {step === 'create-account' && 'Set up your name & password to complete your TripYeah profile.'}
            {step === 'password-login' && 'Enter your password to sign in to your TripYeah account.'}
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-1.5 mt-4">
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 'phone-input' ? 'w-8 bg-white' : 'w-3 bg-white/40'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 'otp-verify' ? 'w-8 bg-white' : 'w-3 bg-white/40'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 'create-account' ? 'w-8 bg-white' : 'w-3 bg-white/40'
              }`}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'phone-input' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-slate-50 transition-all overflow-hidden">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-slate-100/90 text-xs sm:text-sm font-bold text-slate-800 px-3 py-3 border-r border-slate-300 focus:outline-none cursor-pointer"
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
                      className="w-full px-3.5 py-3 text-sm font-bold text-slate-900 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-slate-400 font-mono-tabular"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>An OTP will be sent for instant number verification</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue with Mobile OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('password-login');
                  }}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Login with Password</span>
                </button>
                <span className="text-slate-400 text-[11px]">100% Safe &amp; Verified</span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp-verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Enter 4-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('phone-input')}
                    className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 my-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => handleOtpBoxChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      autoFocus={idx === 0}
                      className="w-14 h-14 text-center font-mono-tabular text-2xl font-bold text-slate-900 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:bg-blue-50/30 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
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
                    className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  >
                    ⚡ Demo Auto-Fill (8821)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length < 4}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Back to Mobile Entry
              </button>
            </form>
          )}

          {/* STEP 3: CREATE ACCOUNT (NAME & PASSWORD) */}
          {step === 'create-account' && (
            <form onSubmit={handleCreateAccountSubmit} className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Verified Mobile: <strong className="text-slate-900 font-mono-tabular">{countryCode} {phoneNumber}</strong>
                </span>
                <span className="text-emerald-700 bg-emerald-100/80 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (as on Passport / Aadhaar) *
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
                  Email Address (for e-Tickets &amp; Invoices)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                {password && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        password.length < 6
                          ? 'bg-rose-400'
                          : password.length < 9
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-slate-500 font-medium text-[10px]">
                      {password.length < 6 ? 'Too short' : password.length < 9 ? 'Medium strength' : 'Strong'}
                    </span>
                  </div>
                )}
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
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-[11px] text-slate-500 leading-tight">
                  I agree to TripYeah's Terms of Service and Privacy Policy. Send booking confirmations &amp; flight web check-in reminders.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !fullName.trim() || !password}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
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

          {/* STEP 4: PASSWORD LOGIN (FOR EXISTING USERS) */}
          {step === 'password-login' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Registered Mobile Number
                </label>
                <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 overflow-hidden">
                  <span className="bg-slate-100 text-xs font-bold text-slate-700 px-3 py-3 border-r border-slate-300">
                    {countryCode}
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                    className="w-full px-3.5 py-3 text-sm font-bold text-slate-900 bg-transparent focus:outline-none font-mono-tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-9 pr-10 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep('phone-input');
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password? Use OTP Login
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !phoneNumber || !loginPassword}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('phone-input');
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to OTP Login / Register
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
