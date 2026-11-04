/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyCode, CURRENCY_RATES } from '../data/travelData';

export const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ar: 'ar-SA',
  ru: 'ru-RU',
  pt: 'pt-BR',
  th: 'th-TH',
};

/**
 * Returns text direction ('rtl' for Arabic, 'ltr' for others)
 */
export function getLanguageDir(langCode: string): 'rtl' | 'ltr' {
  return langCode === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Applies language and direction to the root HTML document element
 */
export function applyDocumentLanguageAndDir(langCode: string): void {
  if (typeof document !== 'undefined') {
    const dir = getLanguageDir(langCode);
    document.documentElement.lang = langCode;
    document.documentElement.dir = dir;
    if (dir === 'rtl') {
      document.documentElement.classList.add('is-rtl');
    } else {
      document.documentElement.classList.remove('is-rtl');
    }
  }
}

/**
 * Formats a localized date string according to the active language
 */
export function formatDateWithLocale(
  dateInput: string | Date,
  langCode: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);
    const locale = LOCALE_MAP[langCode] || 'en-US';
    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats numbers with localized digit grouping and symbols
 */
export function formatNumberWithLocale(
  num: number,
  langCode: string = 'en'
): string {
  try {
    const locale = LOCALE_MAP[langCode] || 'en-US';
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return String(num);
  }
}

/**
 * Formats prices localized by currency and active language
 */
export function formatPriceWithLocale(
  amountInr: number,
  currency: CurrencyCode = 'INR',
  langCode: string = 'en'
): string {
  const rateObj = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
  const converted = Math.round(amountInr * rateObj.rate);
  const locale = LOCALE_MAP[langCode] || 'en-US';

  try {
    const formattedNum = new Intl.NumberFormat(locale).format(converted);
    if (langCode === 'ar') {
      return `${formattedNum} ${rateObj.symbol.trim()}`;
    }
    return `${rateObj.symbol.trim()}${rateObj.symbol.endsWith(' ') ? ' ' : ''}${formattedNum}`;
  } catch {
    return `${rateObj.symbol}${converted}`;
  }
}
