import React, { useState } from 'react';
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
} from 'lucide-react';

interface AccountSettingsPageProps {
  onSaveProfile: (name: string) => void;
  onNotify: (title: string, detail: string) => void;
}

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({
  onSaveProfile,
  onNotify,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('personal');
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [dob, setDob] = useState('14 Aug 1992');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [emergencyContact, setEmergencyContact] = useState(
    '+91 98765 00000 (Pooja Sharma - Spouse)'
  );
  const [homeAirport, setHomeAirport] = useState(
    'New Delhi - Indira Gandhi Intl (DEL, T3)'
  );
  const [billingAddress, setBillingAddress] = useState(
    'Flat 702, Skyline Residency, Golf Course Road, Sector 54, Gurugram, Haryana - 122002'
  );
  const [digiYatraEnabled, setDigiYatraEnabled] = useState(true);

  const [coTravelers, setCoTravelers] = useState([
    {
      initials: 'PS',
      name: 'Pooja Sharma',
      relation: 'Spouse',
      details: 'Adult · Female · 02 Feb 1994',
      idStatus: 'Passport Linked (**** 4120)',
      meal: 'Hindu Veg',
    },
    {
      initials: 'AS',
      name: 'Aarav Sharma',
      relation: 'Child',
      details: 'Child (Age 6) · Male · 18 May 2018',
      idStatus: 'Aadhaar Verified',
      meal: 'Child Meal',
    },
  ]);

  const handleAddCoTraveler = () => {
    if (!coTravelers.some((c) => c.initials === 'KS')) {
      setCoTravelers((prev) => [
        ...prev,
        {
          initials: 'KS',
          name: 'Kabir Sharma',
          relation: 'Parent',
          details: 'Senior Citizen · Male · 19 Nov 1962',
          idStatus: 'Passport Linked (**** 7719)',
          meal: 'Low Sodium Veg',
        },
      ]);
      onNotify('Co-Traveler Added', 'Kabir Sharma added to your passenger list.');
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-1">
              My Account &gt; Profile &amp; Settings
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Account Settings &amp; Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your personal profile, frequent co-travelers, login security,
              and saved payment methods.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onNotify('Public Explorer Profile', 'Rahul Sharma · Platinum Explorer')
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>View Public Profile</span>
          </button>
        </div>

        {/* Profile Summary Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-950 text-white font-display text-xl font-bold flex items-center justify-center">
                RS
              </div>
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center absolute -bottom-1 -right-1 border-2 border-white">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-bold text-slate-900">
                  {fullName}
                </h2>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  ✓ Verified Explorer
                </span>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Platinum Explorer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {email} · <span className="font-mono-tabular">{mobile}</span> ·{' '}
                <span className="text-blue-600 font-medium">Renews 31 Dec 2025</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-50/90 px-6 py-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-center">
              <span className="font-display text-lg font-bold font-mono-tabular text-blue-600 block">
                2,705
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                TRIPPOINTS
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <span className="font-display text-lg font-bold font-mono-tabular text-slate-900 block">
                14
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                TRIPS TAKEN
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <span className="font-display text-lg font-bold font-mono-tabular text-slate-900 block">
                ₹12,400
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                TOTAL SAVINGS
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 flex flex-wrap items-center gap-1.5">
          {[
            { id: 'personal', label: 'Personal Info', icon: User },
            {
              id: 'cotravelers',
              label: `Co-Travelers (Family & Friends) ${coTravelers.length}`,
              icon: Users,
            },
            { id: 'security', label: 'Login & Security', icon: Shield },
            { id: 'cards', label: 'Saved Cards & UPI', icon: CreditCard },
            { id: 'prefs', label: 'Travel Preferences', icon: Sliders },
            { id: 'privacy', label: 'Notifications & Privacy', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    Basic Personal Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Used for flight ticket bookings, hotel reservations, and
                    immigration checks.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  Matches Govt ID
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Legal Name (as on Passport)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Male', 'Female', 'Other'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                          gender === g
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-slate-50 border border-slate-200 text-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nationality
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 flex items-center justify-between">
                    <span>🇮🇳 Indian (Republic of India)</span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Primary Email
                    </label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      ✓ Verified
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Mobile Number
                    </label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      ✓ Verified
                    </span>
                  </div>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono-tabular font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Emergency Contact Person
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Home Airport &amp; City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={homeAirport}
                      onChange={(e) => setHomeAirport(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900"
                    />
                    <Plane className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Billing Address (for Flight Tax Invoices)
                </label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Travel Identity & DigiYatra */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs space-y-4">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Travel Identity, IDs &amp; Fast Clearance</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Store validated passport entries, biometric transit tokens, and
                  loyalty mileage.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Indian Passport
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Primary
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono-tabular mt-0.5">
                    Passport Number: **** 9821 · Valid until 12 Nov 2031
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onNotify('Passport Verified', 'Encrypted passport entry active.')
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      DigiYatra Biometric Pass
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Fast-Track Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Seamless facial clearance at DEL, BOM, BLR &amp; HYD security
                    gates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={digiYatraEnabled}
                  onChange={() => setDigiYatraEnabled((p) => !p)}
                  className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Air India Flying Returns
                    </div>
                    <div className="text-[11px] font-mono-tabular text-slate-500">
                      AI-88291044 · Gold
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      IndiGo 6E Rewards
                    </div>
                    <div className="text-[11px] font-mono-tabular text-slate-500">
                      6E-44918290 · Blue
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Saved Co-Travelers */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    Saved Co-Travelers
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instant 1-click traveler addition during bookings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCoTraveler}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New Co-Traveler</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {coTravelers.map((ct) => (
                  <div
                    key={ct.name}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {ct.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900">
                              {ct.name}
                            </h3>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {ct.relation}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{ct.details}</p>
                        </div>
                      </div>
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">✓ {ct.idStatus}</span>
                      <span className="text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        {ct.meal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/85 p-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                All verified changes are automatically synchronized across TripYeah
                mobile apps.
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setFullName('Rahul Sharma')}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveProfile(fullName);
                    onNotify(
                      'Profile Saved',
                      `Account settings updated for ${fullName}.`
                    );
                  }}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] text-xs font-bold text-white cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Security Health
                </h3>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Strong
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full border-4 border-blue-600 flex items-center justify-center font-mono-tabular font-bold text-sm text-slate-900 shrink-0">
                  85%
                </div>
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">
                    Shield Protection Level
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    2 recommendations remaining to achieve 100%.
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    ✓ 2-Factor Authentication (2FA)
                  </span>
                  <span className="font-bold text-blue-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">✓ Biometric Login on App</span>
                  <span className="font-bold text-blue-600">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Password last changed</span>
                  <span className="text-slate-400">42 days ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Seat &amp; Trip Defaults
                </h3>
                <span className="text-xs font-bold text-blue-600">Configure</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3 text-xs">
                <Armchair className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    FLIGHT SEAT
                  </span>
                  <strong>Window · Extra Legroom Row</strong>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3 text-xs">
                <Utensils className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    MEAL SELECTION
                  </span>
                  <strong>Pure Vegetarian (AVML)</strong>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3 text-xs">
                <Building2 className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    HOTEL PREFERENCES
                  </span>
                  <strong>High Floor · King Bed · Quiet Room</strong>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/60 flex items-center gap-3 text-xs">
                <FileText className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold block">
                    Corporate GSTIN Linked
                  </span>
                  <strong className="font-mono-tabular text-[11px]">
                    07AAAAA0000A1Z5 (TripYeah Ent.)
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-2xs space-y-2.5">
              <h3 className="font-display text-base font-bold text-slate-900">
                Data &amp; Privacy
              </h3>
              <button
                type="button"
                onClick={() =>
                  onNotify('Archive Downloaded', 'Saved Travel_Records.json')
                }
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Travel Records (JSON/PDF)</span>
                </span>
                <span>›</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onNotify(
                    'Account Protection Active',
                    'Complete active bookings before deactivation.'
                  )
                }
                className="w-full p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Deactivate or Delete Account</span>
                </span>
                <span>›</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
