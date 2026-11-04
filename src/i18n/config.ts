/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from './translations';
import { applyDocumentLanguageAndDir } from './formatters';

// Determine initial saved language or default to English ('en')
const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem('tripyeah_lang');
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
  } catch {}
  return 'en';
};

const initialLang = getSavedLanguage();

// Build resources object for i18next
const resources = Object.keys(TRANSLATIONS).reduce((acc, langKey) => {
  acc[langKey] = {
    translation: TRANSLATIONS[langKey],
  };
  return acc;
}, {} as Record<string, { translation: any }>);

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
});

// Sync initial HTML document direction and lang
applyDocumentLanguageAndDir(initialLang);

// Listen to language changes to persist in localStorage and sync HTML dir
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('tripyeah_lang', lng);
  } catch {}
  applyDocumentLanguageAndDir(lng);
});

export default i18n;
