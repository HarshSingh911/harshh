import React, { useState } from 'react';
import { X, Check, Globe, DollarSign, MapPin, Search } from 'lucide-react';
import { CurrencyCode, CURRENCY_RATES } from '../data/travelData';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export interface RegionOption {
  code: string;
  name: string;
  flag: string;
  suggestedCurrency: CurrencyCode;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English (US)', nativeName: 'English' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (IN)' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
];

export const REGIONS: RegionOption[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', suggestedCurrency: 'INR' },
  { code: 'US', name: 'United States', flag: '🇺🇸', suggestedCurrency: 'USD' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', suggestedCurrency: 'AED' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', suggestedCurrency: 'GBP' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', suggestedCurrency: 'EUR' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', suggestedCurrency: 'SGD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', suggestedCurrency: 'CAD' },
];

interface LanguageRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  currentRegion: string;
  currentCurrency: CurrencyCode;
  onSavePreferences: (language: string, region: string, currency: CurrencyCode) => void;
}

export const LanguageRegionModal: React.FC<LanguageRegionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  currentRegion,
  currentCurrency,
  onSavePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'language' | 'region' | 'currency'>('currency');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [selectedRegion, setSelectedRegion] = useState(currentRegion);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(currentCurrency);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences(selectedLanguage, selectedRegion, selectedCurrency);
    onClose();
  };

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRegions = REGIONS.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currencyList = (Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => ({
    code,
    ...CURRENCY_RATES[code],
  })).filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRegionObj = REGIONS.find((r) => r.name === selectedRegion) || REGIONS[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Language, Region &amp; Currency</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize your booking experience, regional offers, and pricing
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 px-5 gap-4 bg-slate-50/70">
          <button
            type="button"
            onClick={() => {
              setActiveTab('currency');
              setSearchQuery('');
            }}
            className={`py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'currency'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Currency ({selectedCurrency})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('region');
              setSearchQuery('');
            }}
            className={`py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'region'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Region ({currentRegionObj.flag} {selectedRegion})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('language');
              setSearchQuery('');
            }}
            className={`py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'language'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Language ({selectedLanguage})</span>
          </button>
        </div>

        {/* Search bar inside modal */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'currency' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currencyList.map((curr) => {
                const isSelected = selectedCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="font-mono-tabular px-1.5 py-0.5 rounded bg-slate-100 text-xs text-blue-700 font-extrabold">
                          {curr.symbol.trim()}
                        </span>
                        <span>{curr.label}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {curr.code === 'INR' && 'Indian Rupee (Default)'}
                        {curr.code === 'USD' && 'United States Dollar'}
                        {curr.code === 'EUR' && 'Euro (EU Standard)'}
                        {curr.code === 'AED' && 'United Arab Emirates Dirham'}
                        {curr.code === 'GBP' && 'British Pound Sterling'}
                        {curr.code === 'SGD' && 'Singapore Dollar'}
                        {curr.code === 'CAD' && 'Canadian Dollar'}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'region' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredRegions.map((r) => {
                const isSelected = selectedRegion === r.name;
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => {
                      setSelectedRegion(r.name);
                      setSelectedCurrency(r.suggestedCurrency);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.flag}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{r.name}</div>
                        <div className="text-xs text-slate-500">
                          Auto-sets currency to {r.suggestedCurrency}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'language' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredLanguages.map((l) => {
                const isSelected = selectedLanguage === l.name;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setSelectedLanguage(l.name)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">{l.name}</div>
                      <div className="text-xs text-slate-500">{l.nativeName}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            Active: <strong className="text-slate-900">{selectedLanguage}</strong> ·{' '}
            <strong className="text-slate-900">{currentRegionObj.flag} {selectedRegion}</strong> ·{' '}
            <strong className="text-blue-700 font-bold">{selectedCurrency}</strong>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Apply Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
