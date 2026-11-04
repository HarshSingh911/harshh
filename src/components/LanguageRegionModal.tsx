import React, { useState, useEffect } from 'react';
import { X, Check, Globe, DollarSign, MapPin, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CurrencyCode, CURRENCY_RATES } from '../data/travelData';
import { applyDocumentLanguageAndDir } from '../i18n/formatters';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export interface RegionOption {
  code: string;
  name: string;
  flag: string;
  suggestedCurrency: CurrencyCode;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
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
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'language' | 'region' | 'currency'>('currency');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [selectedRegion, setSelectedRegion] = useState(currentRegion);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(currentCurrency);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep state synced with currentLanguage if it changes from outside
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    setSelectedCurrency(currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    setSelectedRegion(currentRegion);
  }, [currentRegion]);

  if (!isOpen) return null;

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLanguage(lang.name);
    i18n.changeLanguage(lang.code);
    applyDocumentLanguageAndDir(lang.code);
  };

  const handleSave = () => {
    const langObj = LANGUAGES.find((l) => l.name === selectedLanguage || l.code === selectedLanguage);
    const code = langObj ? langObj.code : 'en';
    i18n.changeLanguage(code);
    applyDocumentLanguageAndDir(code);
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
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-md sm:max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[82vh] animate-modal-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{t('modal.title', 'Language, Region & Currency')}</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t('modal.subtitle', 'Select your currency, region and language preferences')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 px-4 gap-2 sm:gap-3 bg-slate-50/70">
          <button
            type="button"
            onClick={() => {
              setActiveTab('currency');
              setSearchQuery('');
            }}
            className={`py-2 sm:py-2.5 text-xs font-bold flex items-center gap-1 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'currency'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t('modal.currency', 'Currency')} ({selectedCurrency})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('region');
              setSearchQuery('');
            }}
            className={`py-2 sm:py-2.5 text-xs font-bold flex items-center gap-1 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'region'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('modal.region', 'Region')} ({currentRegionObj.flag} {selectedRegion})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('language');
              setSearchQuery('');
            }}
            className={`py-2 sm:py-2.5 text-xs font-bold flex items-center gap-1 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'language'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('modal.language', 'Language')} ({selectedLanguage})</span>
          </button>
        </div>

        {/* Search bar inside modal */}
        <div className="p-2.5 sm:p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t('modal.searchPlaceholder', 'Search')} ${activeTab}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 max-h-[300px] custom-scrollbar">
          {activeTab === 'currency' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currencyList.map((curr) => {
                const isSelected = selectedCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="font-mono-tabular px-1.5 py-0.5 rounded bg-slate-100 text-[11px] text-blue-700 font-extrabold">
                          {curr.symbol.trim()}
                        </span>
                        <span>{curr.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {curr.code === 'INR' && 'Indian Rupee (Default)'}
                        {curr.code === 'USD' && 'United States Dollar'}
                        {curr.code === 'EUR' && 'Euro (EU Standard)'}
                        {curr.code === 'AED' && 'UAE Dirham'}
                        {curr.code === 'GBP' && 'British Pound'}
                        {curr.code === 'SGD' && 'Singapore Dollar'}
                        {curr.code === 'CAD' && 'Canadian Dollar'}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'region' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{r.flag}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{r.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {t('modal.currency', 'Currency')}: {r.suggestedCurrency}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'language' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLanguages.map((l) => {
                const isSelected = selectedLanguage === l.name || selectedLanguage === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSelectLanguage(l)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{l.flag}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{l.name}</div>
                        <div className="text-[11px] text-slate-500">{l.nativeName}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 sm:py-3 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-600 text-center sm:text-left">
            {t('modal.active', 'Active')}: <strong className="text-slate-900">{selectedLanguage}</strong> ·{' '}
            <strong className="text-slate-900">{currentRegionObj.flag} {selectedRegion}</strong> ·{' '}
            <strong className="text-blue-700 font-bold">{selectedCurrency}</strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('modal.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {t('modal.applyPreferences', 'Apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
