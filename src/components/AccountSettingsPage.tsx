import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  Shield,
  CreditCard,
  Sliders,
  Bell,
  Eye,
  Calendar,
  Lock,
  Plane,
  ShieldCheck,
  Edit2,
  UserPlus,
  Download,
  Trash2,
  Armchair,
  Utensils,
  Building2,
  FileText,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  KeyRound,
  LogOut,
  Smartphone,
  Laptop,
  Tablet,
  MapPin,
  Heart,
  Plus,
  X,
  Sparkles,
  AlertCircle,
  Check,
  Award,
  Globe,
  Share2,
  ExternalLink,
} from 'lucide-react';

export interface CoTraveller {
  id: string;
  name: string;
  relation: 'Spouse' | 'Child' | 'Parent' | 'Friend' | 'Colleague';
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  passportNumber: string;
  idStatus: string;
  meal: string;
  seatPreference: 'Window' | 'Aisle' | 'Any';
}

export interface FrequentFlyerCard {
  id: string;
  airline: string;
  program: string;
  membershipNumber: string;
  tier: string;
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserProfileData {
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  nationality: string;
  maritalStatus: 'Single' | 'Married' | 'Other';
  anniversary: string;
  city: string;
  state: string;
  mobile: string;
  email: string;
  passportNumber: string;
  passportExpiry: string;
  passportIssuingCountry: string;
  panNumber: string;
  insurancePreference: string;
  insuranceNominee: string;
  insuranceNomineeRelation: string;
  hasPreExistingCondition: boolean;
  avatarUrl: string;
  bannerUrl: string;
}

interface AccountSettingsPageProps {
  userName?: string | null;
  onSaveProfile: (name: string) => void;
  onLogout?: () => void;
  onNotify: (title: string, detail: string, type?: 'success' | 'info') => void;
  onNavigateToPrivacyPolicy?: () => void;
  onNavigateToTermsOfService?: () => void;
}

// Preset Wallpaper choices (Compact, elegant travel banners)
const CURATED_WALLPAPERS = [
  {
    id: 'alpine',
    title: 'Swiss Alpine Lakeside',
    url: '/assets/images/hero_alpine_lakeside_1790774682097.jpg',
  },
  {
    id: 'mountain',
    title: 'Mountain Traveler Vista',
    url: '/assets/images/banner_mountain_traveler_1790774776035.jpg',
  },
  {
    id: 'bali',
    title: 'Bali Water Temple & Sunrise',
    url: '/assets/images/dest_bali_temple_17907699717.jpg',
    fallback: '/assets/images/hero_santorini_couple_1790778151559.jpg',
  },
  {
    id: 'dubai',
    title: 'Dubai Twilight Skyline',
    url: '/assets/images/dest_dubai_skyline_1790774713819.jpg',
  },
  {
    id: 'paris',
    title: 'Paris Eiffel Tower & Boulevards',
    url: '/assets/images/dest_paris_eiffel_1790774759266.jpg',
  },
];

// Preset Avatar choices
const AVATAR_PRESETS = [
  { id: 'av-1', label: 'Classic Traveller', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-2', label: 'Executive Wanderer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-3', label: 'Adventurer Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-4', label: 'Global Backpacker', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-5', label: 'Cultural Explorer', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-6', label: 'Pilot Casual', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
];

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({
  userName,
  onSaveProfile,
  onLogout,
  onNotify,
  onNavigateToPrivacyPolicy,
  onNavigateToTermsOfService,
}) => {
  // 5 Active Sidebar Options requested:
  // 'my-profile' | 'co-travellers' | 'logged-in-devices' | 'reset-password' | 'logout'
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'my-profile' | 'co-travellers' | 'logged-in-devices' | 'reset-password' | 'logout'
  >('my-profile');

  // Edit Mode toggle for My Profile
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Profile Data State
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_user_profile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      fullName: userName || 'Aryan Kapoor',
      gender: 'Male',
      dob: '1992-08-14',
      nationality: 'Indian',
      maritalStatus: 'Married',
      anniversary: '2019-11-28',
      city: 'Gurugram',
      state: 'Haryana',
      mobile: '+91 98765 43210',
      email: userName ? `${userName.toLowerCase().replace(/\s+/g, '.')}@example.com` : 'aryan.kapoor@gmail.com',
      passportNumber: 'Z4829105',
      passportExpiry: '2032-10-15',
      passportIssuingCountry: 'Republic of India',
      panNumber: 'ABCDE1234F',
      insurancePreference: 'Comprehensive International TripProtect (Schengen & Worldwide)',
      insuranceNominee: 'Pooja Sharma',
      insuranceNomineeRelation: 'Spouse',
      hasPreExistingCondition: false,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bannerUrl: '/assets/images/hero_alpine_lakeside_1790774682097.jpg',
    };
  });

  // Wallpaper & Avatar modal pickers
  const [showWallpaperPicker, setShowWallpaperPicker] = useState<boolean>(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [customWallpaperInput, setCustomWallpaperInput] = useState<string>('');
  const [customAvatarInput, setCustomAvatarInput] = useState<string>('');

  // Frequent Flyer memberships
  const [frequentFlyers, setFrequentFlyers] = useState<FrequentFlyerCard[]>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_frequent_flyers');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      { id: 'ff-1', airline: 'Air India', program: 'Flying Returns', membershipNumber: 'AI-9948201', tier: 'Gold Maharaja' },
      { id: 'ff-2', airline: 'IndiGo', program: '6E Rewards', membershipNumber: '6E-7728104', tier: 'Titanium' },
      { id: 'ff-3', airline: 'Singapore Airlines', program: 'KrisFlyer', membershipNumber: 'KF-4481029', tier: 'Elite Silver' },
    ];
  });
  const [showAddFlyerModal, setShowAddFlyerModal] = useState<boolean>(false);
  const [newFlyerAirline, setNewFlyerAirline] = useState<string>('Air India');
  const [newFlyerProgram, setNewFlyerProgram] = useState<string>('Flying Returns');
  const [newFlyerNumber, setNewFlyerNumber] = useState<string>('');
  const [newFlyerTier, setNewFlyerTier] = useState<string>('Member');

  // Co-Travellers state
  const [coTravellers, setCoTravellers] = useState<CoTraveller[]>(() => {
    try {
      const stored = localStorage.getItem('tripyeah_co_travellers');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'cotrav-1',
        name: 'Pooja Sharma',
        relation: 'Spouse',
        gender: 'Female',
        dob: '1994-02-02',
        passportNumber: 'Z8810294',
        idStatus: 'Passport Linked (Exp: 2031)',
        meal: 'Hindu Vegetarian',
        seatPreference: 'Window',
      },
      {
        id: 'cotrav-2',
        name: 'Aarav Sharma',
        relation: 'Child',
        gender: 'Male',
        dob: '2018-05-18',
        passportNumber: 'Z1193840',
        idStatus: 'Aadhaar & Minor Passport Linked',
        meal: 'Child Meal',
        seatPreference: 'Aisle',
      },
      {
        id: 'cotrav-3',
        name: 'Kabir Sharma',
        relation: 'Parent',
        gender: 'Male',
        dob: '1962-11-19',
        passportNumber: 'Z7719203',
        idStatus: 'Senior Citizen Passport Linked',
        meal: 'Low Sodium Diabetic Meal',
        seatPreference: 'Aisle',
      },
    ];
  });
  const [editingCoTraveller, setEditingCoTraveller] = useState<CoTraveller | null>(null);
  const [showCoTravellerModal, setShowCoTravellerModal] = useState<boolean>(false);

  // Logged In Devices Sessions state
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([
    {
      id: 'sess-1',
      deviceName: 'Chrome on macOS (Apple M3 Pro)',
      deviceType: 'desktop',
      browser: 'Chrome 126.0 (Macintosh; Intel Mac OS X)',
      location: 'New Delhi, India',
      ip: '103.21.58.14',
      lastActive: 'Active Now',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      deviceName: 'TripYeah Mobile App (iOS 18.2)',
      deviceType: 'mobile',
      browser: 'TripYeah Native App · iPhone 15 Pro',
      location: 'Gurugram, India',
      ip: '49.36.128.45',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      deviceName: 'Safari on iPad Pro (12.9-inch)',
      deviceType: 'tablet',
      browser: 'Safari Mobile 17.5',
      location: 'Mumbai, India',
      ip: '115.98.24.89',
      lastActive: 'Yesterday, 07:45 PM',
      isCurrent: false,
    },
  ]);

  // Reset Password State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPw, setShowCurrentPw] = useState<boolean>(false);
  const [showNewPw, setShowNewPw] = useState<boolean>(false);
  const [showConfirmPw, setShowConfirmPw] = useState<boolean>(false);
  const [pwError, setPwError] = useState<string>('');

  // Persist Profile changes to LocalStorage
  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profile.fullName.trim()) {
      onNotify('Name Required', 'Please enter your full legal name.', 'info');
      return;
    }
    try {
      localStorage.setItem('tripyeah_user_profile', JSON.stringify(profile));
    } catch (err) {
      console.warn('Profile save note:', err);
    }
    onSaveProfile(profile.fullName);
    setIsEditingProfile(false);
    onNotify('Profile Updated', 'Your profile and travel document preferences have been saved.', 'success');
  };

  // Persist Co-Travellers changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tripyeah_co_travellers', JSON.stringify(coTravellers));
    } catch (err) {
      console.warn('Co-Traveller save note:', err);
    }
  }, [coTravellers]);

  // Persist Frequent Flyers
  useEffect(() => {
    try {
      localStorage.setItem('tripyeah_frequent_flyers', JSON.stringify(frequentFlyers));
    } catch (err) {
      console.warn('Frequent Flyers save note:', err);
    }
  }, [frequentFlyers]);

  // Co-Traveller Add / Edit Save
  const handleSaveCoTraveller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoTraveller || !editingCoTraveller.name.trim()) return;

    if (coTravellers.some((c) => c.id === editingCoTraveller.id)) {
      setCoTravellers((prev) =>
        prev.map((c) => (c.id === editingCoTraveller.id ? editingCoTraveller : c))
      );
      onNotify('Co-Traveller Updated', `${editingCoTraveller.name}'s details saved.`, 'success');
    } else {
      setCoTravellers((prev) => [editingCoTraveller, ...prev]);
      onNotify('Co-Traveller Added', `${editingCoTraveller.name} added to your travel group.`, 'success');
    }
    setShowCoTravellerModal(false);
    setEditingCoTraveller(null);
  };

  // Co-Traveller Delete
  const handleDeleteCoTraveller = (id: string, name: string) => {
    setCoTravellers((prev) => prev.filter((c) => c.id !== id));
    onNotify('Co-Traveller Removed', `${name} has been removed from your co-travellers list.`, 'info');
  };

  // Add Frequent Flyer Card
  const handleAddFrequentFlyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlyerNumber.trim()) return;

    const newCard: FrequentFlyerCard = {
      id: `ff-${Date.now()}`,
      airline: newFlyerAirline,
      program: newFlyerProgram,
      membershipNumber: newFlyerNumber.trim(),
      tier: newFlyerTier,
    };
    setFrequentFlyers((prev) => [...prev, newCard]);
    setNewFlyerNumber('');
    setShowAddFlyerModal(false);
    onNotify('Loyalty Program Linked', `${newFlyerAirline} (${newFlyerNumber}) linked to your account.`, 'success');
  };

  // Remove Frequent Flyer Card
  const handleRemoveFrequentFlyer = (id: string, airline: string) => {
    setFrequentFlyers((prev) => prev.filter((f) => f.id !== id));
    onNotify('Loyalty Card Removed', `${airline} card removed.`, 'info');
  };

  // Log Out from Session
  const handleTerminateSession = (sessionId: string, deviceName: string) => {
    setDeviceSessions((prev) => prev.filter((s) => s.id !== sessionId));
    onNotify('Session Terminated', `Signed out from ${deviceName}.`, 'info');
  };

  // Log Out from All Other Devices
  const handleLogoutAllOtherDevices = () => {
    setDeviceSessions((prev) => prev.filter((s) => s.isCurrent));
    onNotify('All Other Devices Logged Out', 'Your account is now only active on this current browser session.', 'success');
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPwError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match. Please verify.');
      return;
    }

    setPwError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onNotify('Password Changed Successfully', 'Your account password has been updated. Please use the new password for future logins.', 'success');
  };

  // Handle Complete Account Logout
  const handleAccountLogout = () => {
    if (onLogout) {
      onLogout();
      onNotify('Logged Out', 'You have been safely signed out of TripYeah.', 'info');
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      {/* ===================================================================
          1. TOP WALLPAPER BANNER WITH PROFILE PICTURE ON TOP
      =================================================================== */}
      <div className="relative w-full min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] bg-slate-950 overflow-hidden flex flex-col justify-end pt-24 pb-8 sm:pb-10">
        {/* Banner Image */}
        <img
          src={profile.bannerUrl}
          alt="Profile Wallpaper"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/images/hero_alpine_lakeside_1790774682097.jpg';
          }}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-90 contrast-105"
        />

        {/* Top Vignette Scrim for Navbar / Brand Logo Clarity */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/80 via-slate-950/35 to-transparent pointer-events-none" />

        {/* Dark Bottom Gradient for Text & Profile Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

        {/* Profile Picture, Name, Number & Email ON TOP OF WALLPAPER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Profile Picture set over wallpaper */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl p-1 bg-white/20 backdrop-blur-md shadow-2xl ring-4 ring-white/80 overflow-hidden shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            </div>

            {/* In front of Profile Picture: Name, Below it Number with emoji & Email with emoji */}
            <div className="min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md truncate">
                {profile.fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm md:text-base text-white/95 font-semibold drop-shadow-sm mt-1 sm:mt-1.5">
                <span>📱 {profile.mobile}</span>
                <span className="text-white/60">·</span>
                <span className="truncate">✉️ {profile.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. MAIN 2-COLUMN LAYOUT: LEFT SIDEBAR + RIGHT CONTENT AREA
      =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =================================================================
              LEFT SIDEBAR: 5 EXACT REQUESTED OPTIONS
              1. My Profile
              2. Co-Travellers
              3. Logged In Devices
              4. Reset Password
              5. Logout
          ================================================================= */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-3 shadow-xs space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Account Navigation
              </div>

              {/* 1. My Profile */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('my-profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSidebarTab === 'my-profile'
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeSidebarTab === 'my-profile'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  Verified
                </span>
              </button>

              {/* 2. Co-Travellers */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('co-travellers')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSidebarTab === 'co-travellers'
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Co-Travellers</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeSidebarTab === 'co-travellers'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {coTravellers.length}
                </span>
              </button>

              {/* 3. Logged In Devices */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('logged-in-devices')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSidebarTab === 'logged-in-devices'
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4" />
                  <span>Logged In Devices</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {/* 4. Reset Password */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('reset-password')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSidebarTab === 'reset-password'
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4" />
                  <span>Reset Password</span>
                </div>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* 5. Privacy Policy */}
              {onNavigateToPrivacyPolicy && (
                <button
                  type="button"
                  onClick={onNavigateToPrivacyPolicy}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Privacy Policy</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}

              {/* Terms of Service */}
              {onNavigateToTermsOfService && (
                <button
                  type="button"
                  onClick={onNavigateToTermsOfService}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Terms of Service</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}

              {/* Divider */}
              <div className="pt-2 border-t border-slate-100" />

              {/* 5. Logout */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('logout')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSidebarTab === 'logout'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </button>
            </div>

            {/* Loyalty Membership Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                  TripYeah Club
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="font-display text-base font-bold text-white">Platinum Prime Tier</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Enjoy zero convenience fees, priority web check-in, and complimentary flight seat selection.
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>Validity: 31 Dec 2026</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
            </div>
          </aside>

          {/* =================================================================
              RIGHT COLUMN CONTENT: DEPENDS ON ACTIVE SIDEBAR TAB
          ================================================================= */}
          <main className="lg:col-span-9 space-y-6">
            {/* ===============================================================
                OPTION 1: MY PROFILE (Full requested fields & sections)
            =============================================================== */}
            {activeSidebarTab === 'my-profile' && (
              <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                      My Profile &amp; Travel Documents
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Personal info, government identification, insurance preferences &amp; frequent flyer details.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditingProfile ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-section 1: Personal Information */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          Basic Personal Information
                        </h3>
                        <p className="text-xs text-slate-500">
                          Used for flight boarding passes, train bookings, and hotel check-in.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Matches Govt ID
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name (as on Passport) *
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['Male', 'Female', 'Other'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            disabled={!isEditingProfile}
                            onClick={() => setProfile({ ...profile, gender: g })}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              profile.gender === g
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                            } ${!isEditingProfile ? 'cursor-default opacity-85' : 'cursor-pointer'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Date of Birth (DOB)
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          disabled={!isEditingProfile}
                          value={profile.dob}
                          onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                            isEditingProfile
                              ? 'bg-white border-blue-500 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nationality
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.nationality}
                        onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Marital Status */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Marital Status
                      </label>
                      <select
                        disabled={!isEditingProfile}
                        value={profile.maritalStatus}
                        onChange={(e) => setProfile({ ...profile, maritalStatus: e.target.value as any })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900 cursor-pointer'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Anniversary (if Married) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Anniversary Date {profile.maritalStatus === 'Married' ? '(Special Perks)' : ''}
                      </label>
                      <input
                        type="date"
                        disabled={!isEditingProfile || profile.maritalStatus !== 'Married'}
                        value={profile.anniversary}
                        onChange={(e) => setProfile({ ...profile, anniversary: e.target.value })}
                        placeholder="Select date"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          profile.maritalStatus !== 'Married'
                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                            : isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-section 2: Contact & Address Information */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          Contact Details &amp; Address
                        </h3>
                        <p className="text-xs text-slate-500">
                          For ticket SMS, WhatsApp flight alerts, and GST billing.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ Instant Alerts Enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mobile Number (SMS &amp; WhatsApp)
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.mobile}
                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border font-mono-tabular ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address (e-Tickets)
                      </label>
                      <input
                        type="email"
                        disabled={!isEditingProfile}
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        State / UT
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-section 3: Government Identification & Travel Docs */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          Passport &amp; Government Identification
                        </h3>
                        <p className="text-xs text-slate-500">
                          Mandatory for international flights, visa applications, and tax compliance (TCS).
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                      Encrypted 256-Bit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Passport Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.passportNumber}
                        onChange={(e) => setProfile({ ...profile, passportNumber: e.target.value.toUpperCase() })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border font-mono-tabular uppercase ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Passport Expiry */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Passport Expiry Date
                      </label>
                      <input
                        type="date"
                        disabled={!isEditingProfile}
                        value={profile.passportExpiry}
                        onChange={(e) => setProfile({ ...profile, passportExpiry: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* PAN Card Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          PAN Card Number (TCS Exemption)
                        </label>
                        <span className="text-[10px] font-bold text-emerald-600">Valid</span>
                      </div>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        maxLength={10}
                        value={profile.panNumber}
                        onChange={(e) => setProfile({ ...profile, panNumber: e.target.value.toUpperCase() })}
                        placeholder="ABCDE1234F"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border font-mono-tabular uppercase ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-section 4: Travel Insurance Preferences */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          Travel Insurance &amp; Emergency Preferences
                        </h3>
                        <p className="text-xs text-slate-500">
                          Default insurance riders auto-applied during international and domestic checkouts.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Cashless Hospitalization
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Insurance Plan Preference */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Preferred Coverage Tier
                      </label>
                      <select
                        disabled={!isEditingProfile}
                        value={profile.insurancePreference}
                        onChange={(e) => setProfile({ ...profile, insurancePreference: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900 cursor-pointer'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="Comprehensive International TripProtect (Schengen & Worldwide)">
                          Comprehensive International TripProtect ($100k Medical, Schengen Compliant)
                        </option>
                        <option value="Domestic Express TripProtect (Baggage + Medical ₹5 Lakh)">
                          Domestic Express TripProtect (Baggage + Medical ₹5 Lakh)
                        </option>
                        <option value="Senior Citizen Special Care Plan (Zero Deductible)">
                          Senior Citizen Special Care Plan (Zero Deductible)
                        </option>
                        <option value="Extreme & Adventure Sports Rider Included">
                          Extreme &amp; Adventure Sports Rider Included
                        </option>
                      </select>
                    </div>

                    {/* Nominee Details */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Insurance Claim Nominee Name
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.insuranceNominee}
                        onChange={(e) => setProfile({ ...profile, insuranceNominee: e.target.value })}
                        placeholder="Nominee Full Name"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
                          isEditingProfile
                            ? 'bg-white border-blue-500 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-section 5: Frequent Flyer & Airline Loyalty Details */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <Plane className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          Frequent Flyer &amp; Airline Loyalty Cards
                        </h3>
                        <p className="text-xs text-slate-500">
                          Earn airline miles automatically on every flight ticket booked via TripYeah.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddFlyerModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Loyalty Card</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {frequentFlyers.map((flyer) => (
                      <div
                        key={flyer.id}
                        className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/90 relative group hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-display font-bold text-sm text-slate-900">
                            {flyer.airline}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                            {flyer.tier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{flyer.program}</p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="font-mono-tabular text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200">
                            {flyer.membershipNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFrequentFlyer(flyer.id, flyer.airline)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="Remove card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button Bar (if editing) */}
                {isEditingProfile && (
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save All Changes</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ===============================================================
                OPTION 2: CO-TRAVELLERS (Add / Edit / Delete Functionality)
            =============================================================== */}
            {activeSidebarTab === 'co-travellers' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                      Co-Travellers (Family &amp; Friends)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Save frequent passengers to auto-fill ticket details in 1-click during flight, train &amp; hotel bookings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCoTraveller({
                        id: `cotrav-${Date.now()}`,
                        name: '',
                        relation: 'Friend',
                        gender: 'Male',
                        dob: '1995-01-01',
                        passportNumber: '',
                        idStatus: 'Passport / Aadhaar',
                        meal: 'Standard Veg',
                        seatPreference: 'Window',
                      });
                      setShowCoTravellerModal(true);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add New Co-Traveller</span>
                  </button>
                </div>

                {/* Co-Traveller Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coTravellers.map((traveller) => (
                    <div
                      key={traveller.id}
                      className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-display font-bold text-sm flex items-center justify-center shadow-md">
                              {traveller.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-display font-bold text-base text-slate-900">
                                {traveller.name}
                              </h3>
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                {traveller.relation} · {traveller.gender}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCoTraveller({ ...traveller });
                                setShowCoTravellerModal(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Co-Traveller"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCoTraveller(traveller.id, traveller.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Co-Traveller"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Date of Birth:</span>
                            <span className="font-semibold text-slate-800">{traveller.dob}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Govt ID / Passport:</span>
                            <span className="font-mono-tabular font-semibold text-slate-800">
                              {traveller.passportNumber || 'Not Linked'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Meal Preference:</span>
                            <span className="font-semibold text-slate-800">{traveller.meal}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Seat Preference:</span>
                            <span className="font-semibold text-slate-800">{traveller.seatPreference}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          ✓ Auto-Fill Ready
                        </span>
                        <span className="text-slate-400">{traveller.idStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===============================================================
                OPTION 3: LOGGED IN DEVICES (Sessions & Security)
            =============================================================== */}
            {activeSidebarTab === 'logged-in-devices' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                      Logged In Devices &amp; Active Sessions
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Review all devices currently authenticated with your TripYeah account.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogoutAllOtherDevices}
                    className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out From All Other Devices</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {deviceSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        session.isCurrent ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            session.deviceType === 'desktop'
                              ? 'bg-blue-50 text-blue-600'
                              : session.deviceType === 'mobile'
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {session.deviceType === 'desktop' && <Laptop className="w-6 h-6" />}
                          {session.deviceType === 'mobile' && <Smartphone className="w-6 h-6" />}
                          {session.deviceType === 'tablet' && <Tablet className="w-6 h-6" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                              {session.deviceName}
                            </h3>
                            {session.isCurrent && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>This Device (Active Now)</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{session.browser}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {session.location}
                            </span>
                            <span>·</span>
                            <span className="font-mono-tabular">IP: {session.ip}</span>
                            <span>·</span>
                            <span className="font-medium text-slate-600">{session.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleTerminateSession(session.id, session.deviceName)}
                          className="px-4 py-2 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          Log Out Device
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===============================================================
                OPTION 4: RESET PASSWORD (Functionality)
            =============================================================== */}
            {activeSidebarTab === 'reset-password' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                    Reset Account Password
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Ensure your account is protected with a strong password containing letters, numbers, and symbols.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs max-w-xl">
                  {pwError && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{pwError}</span>
                    </div>
                  )}

                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            setPwError('');
                          }}
                          placeholder="Enter current password"
                          required
                          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPwError('');
                          }}
                          placeholder="At least 6 characters"
                          required
                          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      {newPassword && (
                        <div className="mt-1 flex items-center gap-2">
                          <div
                            className={`h-1.5 flex-1 rounded-full ${
                              newPassword.length < 6
                                ? 'bg-rose-500'
                                : newPassword.length < 9
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="text-[11px] text-slate-500 font-medium">
                            {newPassword.length < 6
                              ? 'Weak'
                              : newPassword.length < 9
                              ? 'Medium'
                              : 'Strong password'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPw ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPwError('');
                          }}
                          placeholder="Re-type new password"
                          required
                          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!currentPassword || !newPassword || !confirmPassword}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Update Account Password</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ===============================================================
                OPTION 5: LOGOUT CONFIRMATION
            =============================================================== */}
            {activeSidebarTab === 'logout' && (
              <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs max-w-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <LogOut className="w-6 h-6" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Are you sure you want to sign out?
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Signing out will end your active session on this device. You will need to log back in using your mobile number or password to manage bookings and member perks.
                </p>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab('my-profile')}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Stay Signed In
                  </button>
                  <button
                    type="button"
                    onClick={handleAccountLogout}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 cursor-pointer"
                  >
                    Confirm Sign Out
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===================================================================
          MODAL: AVATAR PICKER (Choose or custom URL)
      =================================================================== */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Choose Profile Photo
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {AVATAR_PRESETS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    setProfile((prev) => ({ ...prev, avatarUrl: av.url }));
                    setShowAvatarPicker(false);
                    onNotify('Profile Picture Updated', `Avatar set to ${av.label}.`, 'success');
                  }}
                  className="group relative rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-blue-600 aspect-square cursor-pointer transition-all"
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 text-[10px] text-white font-semibold py-0.5 text-center">
                    {av.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Or enter custom image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarInput.trim()) {
                      setProfile((prev) => ({ ...prev, avatarUrl: customAvatarInput.trim() }));
                      setCustomAvatarInput('');
                      setShowAvatarPicker(false);
                      onNotify('Custom Avatar Set', 'Your profile picture has been updated.', 'success');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD / EDIT CO-TRAVELLER
      =================================================================== */}
      {showCoTravellerModal && editingCoTraveller && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-display text-xl font-bold text-slate-900">
                {coTravellers.some((c) => c.id === editingCoTraveller.id)
                  ? 'Edit Co-Traveller'
                  : 'Add New Co-Traveller'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCoTravellerModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoTraveller} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (as on Govt ID / Passport) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCoTraveller.name}
                  onChange={(e) =>
                    setEditingCoTraveller({ ...editingCoTraveller, name: e.target.value })
                  }
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={editingCoTraveller.relation}
                    onChange={(e) =>
                      setEditingCoTraveller({
                        ...editingCoTraveller,
                        relation: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={editingCoTraveller.gender}
                    onChange={(e) =>
                      setEditingCoTraveller({
                        ...editingCoTraveller,
                        gender: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editingCoTraveller.dob}
                    onChange={(e) =>
                      setEditingCoTraveller({ ...editingCoTraveller, dob: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Passport / Govt ID
                  </label>
                  <input
                    type="text"
                    value={editingCoTraveller.passportNumber}
                    onChange={(e) =>
                      setEditingCoTraveller({
                        ...editingCoTraveller,
                        passportNumber: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. Z9918230"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold uppercase font-mono-tabular focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meal Preference
                  </label>
                  <select
                    value={editingCoTraveller.meal}
                    onChange={(e) =>
                      setEditingCoTraveller({ ...editingCoTraveller, meal: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Hindu Vegetarian">Hindu Vegetarian</option>
                    <option value="Asian Veg / Jain Meal">Asian Veg / Jain Meal</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Diabetic / Low Calorie">Diabetic / Low Calorie</option>
                    <option value="Child Meal">Child Meal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seat Preference
                  </label>
                  <select
                    value={editingCoTraveller.seatPreference}
                    onChange={(e) =>
                      setEditingCoTraveller({
                        ...editingCoTraveller,
                        seatPreference: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Window">Window Seat</option>
                    <option value="Aisle">Aisle Seat</option>
                    <option value="Any">No Preference</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCoTravellerModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 cursor-pointer"
                >
                  Save Co-Traveller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD FREQUENT FLYER LOYALTY CARD
      =================================================================== */}
      {showAddFlyerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Link Airline Frequent Flyer Card
              </h3>
              <button
                type="button"
                onClick={() => setShowAddFlyerModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFrequentFlyer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Airline Carrier
                </label>
                <select
                  value={newFlyerAirline}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewFlyerAirline(val);
                    if (val === 'Air India') setNewFlyerProgram('Flying Returns');
                    else if (val === 'IndiGo') setNewFlyerProgram('6E Rewards');
                    else if (val === 'Emirates') setNewFlyerProgram('Skywards');
                    else if (val === 'Singapore Airlines') setNewFlyerProgram('KrisFlyer');
                    else if (val === 'Qatar Airways') setNewFlyerProgram('Privilege Club');
                    else if (val === 'British Airways') setNewFlyerProgram('Executive Club');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Air India">Air India</option>
                  <option value="IndiGo">IndiGo</option>
                  <option value="Singapore Airlines">Singapore Airlines</option>
                  <option value="Emirates">Emirates</option>
                  <option value="Qatar Airways">Qatar Airways</option>
                  <option value="British Airways">British Airways</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loyalty Program Name
                </label>
                <input
                  type="text"
                  value={newFlyerProgram}
                  onChange={(e) => setNewFlyerProgram(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Membership Number *
                </label>
                <input
                  type="text"
                  required
                  value={newFlyerNumber}
                  onChange={(e) => setNewFlyerNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. AI-9948201"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold font-mono-tabular uppercase focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tier Status
                </label>
                <input
                  type="text"
                  value={newFlyerTier}
                  onChange={(e) => setNewFlyerTier(e.target.value)}
                  placeholder="e.g. Gold, Platinum, Silver"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFlyerModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 cursor-pointer"
                >
                  Save Loyalty Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
