import React, { useState } from 'react';
import { X, Building2, CheckCircle2, MapPin, Sparkles, Plus, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { CurrencyCode, CURRENCY_RATES } from '../data/travelData';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onPropertySubmitted: (propertyName: string, city: string, type: string) => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  currency,
  onPropertySubmitted,
}) => {
  const [propertyType, setPropertyType] = useState<string>('Hotel');
  const [propertyName, setPropertyName] = useState<string>('');
  const [city, setCity] = useState<string>('Goa');
  const [address, setAddress] = useState<string>('');
  const [roomsCount, setRoomsCount] = useState<number>(10);
  const [pricePerNight, setPricePerNight] = useState<string>('4500');
  const [hostName, setHostName] = useState<string>('Rahul Sharma');
  const [hostPhone, setHostPhone] = useState<string>('+91 98765 43210');
  const [hostEmail, setHostEmail] = useState<string>('host@tripyeah.com');
  const [amenities, setAmenities] = useState<string[]>([
    'Free High-Speed Wi-Fi',
    'Air Conditioning',
    'Free Breakfast',
    'Swimming Pool',
  ]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const AVAILABLE_AMENITIES = [
    'Free High-Speed Wi-Fi',
    'Air Conditioning',
    'Free Breakfast',
    'Swimming Pool',
    'Parking Available',
    '24/7 Front Desk',
    'Balcony / Sea View',
    'Pet Friendly',
    'Power Backup',
  ];

  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim()) {
      setErrorMsg('Please enter your property name.');
      return;
    }
    setErrorMsg('');
    setIsSubmitted(true);
    onPropertySubmitted(propertyName.trim(), city, propertyType);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setPropertyName('');
    onClose();
  };

  const currencySymbol = CURRENCY_RATES[currency]?.symbol || '₹';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 border border-blue-400/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Partner with TripYeah
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            List Your Property on TripYeah
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-md">
            Reach millions of global travelers, zero joining fee, instant payouts &amp; verified guest bookings.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Property Listing Submitted!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Congratulations! <strong>{propertyName}</strong> ({propertyType} in {city}) has been received. Our partner onboarding team will verify your listing within 2 hours.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-md mx-auto text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Listing ID:</span>
                <span className="font-mono-tabular font-bold text-slate-900">TY-PROP-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Host Contact:</span>
                <span className="font-semibold text-slate-900">{hostPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Price:</span>
                <span className="font-bold text-blue-700">{currencySymbol}{pricePerNight} / night</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Property Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Hotel', 'Homestay / Villa', 'Resort', 'Apartment'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      propertyType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Name & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Sea Pearl Luxury Beach Resort"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Destination *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Goa">Goa, India</option>
                  <option value="New Delhi">New Delhi, India</option>
                  <option value="Mumbai">Mumbai, India</option>
                  <option value="Bengaluru">Bengaluru, India</option>
                  <option value="Jaipur">Jaipur, India</option>
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Bali">Bali, Indonesia</option>
                  <option value="Paris">Paris, France</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Calangute Beach Road, North Goa"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Rooms & Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Available Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Number(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Base Price / Night ({currencySymbol})
                </label>
                <input
                  type="text"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  placeholder="4500"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Key Amenities Provided
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_AMENITIES.map((item) => {
                  const has = amenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-colors ${
                        has
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border text-[9px] ${
                        has ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300'
                      }`}>
                        {has ? '✓' : ''}
                      </span>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Host Details */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Host / Property Manager Contact
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified TripYeah Host Guarantee &amp; 0% Commission for 30 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>List Property</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
