import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  MapPin,
  Sparkles,
  Plus,
  Image as ImageIcon,
  ShieldCheck,
  Trash2,
  Clock,
  Bed,
  Phone,
  Mail,
  User,
  Info,
} from 'lucide-react';
import { CurrencyCode, CURRENCY_RATES } from '../data/travelData';
import { submitPropertyListing, PropertyListing } from '../services/propertyService';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onPropertySubmitted?: (propertyName: string, city: string, type: string) => void;
  initialCity?: string;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  currency,
  onPropertySubmitted,
  initialCity = 'Goa',
}) => {
  const [propertyType, setPropertyType] = useState<PropertyListing['category']>('hotel');
  const [propertyName, setPropertyName] = useState<string>('');
  const [city, setCity] = useState<string>(initialCity);
  const [country, setCountry] = useState<string>('India');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('Deluxe Double Room');
  const [availableRooms, setAvailableRooms] = useState<number>(6);
  const [pricePerNight, setPricePerNight] = useState<string>('4500');
  const [checkInTime, setCheckInTime] = useState<string>('02:00 PM');
  const [checkOutTime, setCheckOutTime] = useState<string>('11:00 AM');
  
  // Photos
  const [photoInput, setPhotoInput] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  ]);

  // Host Details
  const [hostName, setHostName] = useState<string>('');
  const [hostPhone, setHostPhone] = useState<string>('');
  const [hostEmail, setHostEmail] = useState<string>('');

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([
    'Free High-Speed Wi-Fi',
    'Air Conditioning',
    'Free Breakfast',
    '24/7 Front Desk',
  ]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedPropertyId, setSubmittedPropertyId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const AVAILABLE_AMENITIES = [
    'Free High-Speed Wi-Fi',
    'Air Conditioning',
    'Free Breakfast',
    'Swimming Pool',
    'Parking Available',
    '24/7 Front Desk',
    'Balcony / Scenic View',
    'Pet Friendly',
    'Power Backup',
    'Restaurant / Room Service',
    'Airport Shuttle',
    'Daily Housekeeping',
  ];

  const PHOTO_PRESETS = [
    {
      name: 'Resort & Pool',
      url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Luxury Suite',
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Beachfront Villa',
      url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Boutique Room',
      url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleAddPhoto = () => {
    if (photoInput.trim() && !photos.includes(photoInput.trim())) {
      setPhotos([...photos, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos([...photos, url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim()) {
      setErrorMsg('Please enter your property name.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter the property city.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter the street address.');
      return;
    }
    if (!hostName.trim() || !hostPhone.trim()) {
      setErrorMsg('Please provide host name and contact phone number.');
      return;
    }

    const price = Number(pricePerNight);
    if (isNaN(price) || price <= 0) {
      setErrorMsg('Please enter a valid price per night.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const created = await submitPropertyListing({
        name: propertyName.trim(),
        category: propertyType,
        city: city.trim(),
        country: country.trim() || 'India',
        address: address.trim(),
        description:
          description.trim() ||
          `Experience comfort and warm hospitality at ${propertyName.trim()} located in ${city.trim()}. Ideal for leisure, families, and business travelers.`,
        photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
        roomType: roomType.trim() || 'Standard Room',
        basePriceInr: price,
        availableRooms: Number(availableRooms) || 5,
        checkInTime: checkInTime || '02:00 PM',
        checkOutTime: checkOutTime || '11:00 AM',
        ownerName: hostName.trim(),
        ownerEmail: hostEmail.trim(),
        ownerPhone: hostPhone.trim(),
        amenities: amenities.length > 0 ? amenities : ['Free Wi-Fi', 'Air Conditioning'],
      });

      setSubmittedPropertyId(created.id);
      setIsSubmitted(true);
      if (onPropertySubmitted) {
        onPropertySubmitted(propertyName.trim(), city.trim(), propertyType);
      }
    } catch (err: any) {
      setErrorMsg('Failed to submit property. Please check inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setPropertyName('');
    setAddress('');
    setDescription('');
    setHostName('');
    setHostPhone('');
    setHostEmail('');
    onClose();
  };

  const currencySymbol = CURRENCY_RATES[currency]?.symbol || '₹';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-5 sm:p-6 relative shrink-0">
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
              Verified Partner Onboarding
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            List Your Property on TripYeah
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-md">
            Add your hotel, villa, or homestay to our real travel marketplace. Listings are reviewed and approved by our team before going live.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Property Submitted for Admin Approval!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Congratulations! <strong>{propertyName}</strong> ({propertyType.toUpperCase()} in {city}) has been recorded in the database with status <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">Pending Approval</span>.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                <span className="text-slate-500">Listing ID:</span>
                <span className="font-mono-tabular font-bold text-slate-900">{submittedPropertyId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900">{city}, {country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Room Type:</span>
                <span className="font-semibold text-slate-900">{roomType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Base Price:</span>
                <span className="font-bold text-blue-700">{currencySymbol}{pricePerNight} / night</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Host Contact:</span>
                <span className="font-medium text-slate-900">{hostName} ({hostPhone})</span>
              </div>
            </div>
            <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-2xl max-w-md mx-auto text-left flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>Admin Approval Process:</strong> Open the Staff Admin Panel to review and click &ldquo;Approve Property&rdquo;. Once approved, this property will immediately appear in live customer searches for {city}!
              </p>
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
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* 1. Property Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Accommodation Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'hotel', label: 'Hotel' },
                  { id: 'villa', label: 'Villa' },
                  { id: 'homestay', label: 'Homestay' },
                  { id: 'resort', label: 'Resort' },
                  { id: 'hostel', label: 'Hostel' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPropertyType(type.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      propertyType === type.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Whispering Palms Beach Resort & Spa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Destination *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Goa, Manali, Jaipur, Dubai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India, UAE, Thailand"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Street Address & Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Candolim Beach Road, Near Fort Aguada, North Goa 403515"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property, views, highlights, and hospitality..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900"
                />
              </div>
            </div>

            {/* 3. Room & Pricing */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-blue-600" />
                Room Types &amp; Pricing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Room Type Name
                  </label>
                  <input
                    type="text"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    placeholder="e.g. Deluxe Balcony Suite"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Price per Night (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    placeholder="4500"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Available Rooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={availableRooms}
                    onChange={(e) => setAvailableRooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Standard Check-in Time
                  </label>
                  <input
                    type="text"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    placeholder="02:00 PM"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Standard Check-out Time
                  </label>
                  <input
                    type="text"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 4. Photos */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>4. Property Photos &amp; Images</span>
                <span className="text-[11px] font-normal text-slate-500">{photos.length} photos added</span>
              </label>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className="text-[11px] text-slate-500 mr-1">Quick presets:</span>
                {PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddPresetPhoto(preset.url)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>

              {/* Photo URL Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer shrink-0"
                >
                  Add Photo
                </button>
              </div>

              {/* Photos Thumbnails */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200">
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Amenities */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                5. Amenities Available
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_AMENITIES.map((item) => {
                  const isChecked = amenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-colors cursor-pointer ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-medium'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Contact Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                6. Property Owner / Travel Partner Contacts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="e.g. Vikram Singhal"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    placeholder="partner@hotel.com"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? 'Saving to Database...' : 'Submit Listing for Approval'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
