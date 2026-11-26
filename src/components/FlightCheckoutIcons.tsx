import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * Monochrome line-art icon for 24/7 priority desk, matching front-page Lucide stroke style (no color fills).
 */
export const PriorityDeskIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Service desk counter */}
    <path d="M3 19h18" />
    <path d="M5 19v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
    {/* Bell / concierge dome */}
    <path d="M8 14a4 4 0 0 1 8 0" />
    <path d="M12 8v2" />
    <path d="M10.5 8h3" />
    {/* Subtle agent headset arc above desk */}
    <path d="M6.5 11.5V10a5.5 5.5 0 0 1 11 0v1.5" />
  </svg>
);

/**
 * Monochrome line-art icon for Cabin bag (compact overhead carry-on trolley), no color fills.
 */
export const CabinBagIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Telescopic top handle */}
    <path d="M9.5 6V3.5A1.5 1.5 0 0 1 11 2h2a1.5 1.5 0 0 1 1.5 1.5V6" />
    {/* Compact carry-on body */}
    <rect x="6.5" y="6" width="11" height="14" rx="2" />
    {/* Front zipper pocket */}
    <path d="M9.5 10.5h5" />
    <path d="M9.5 14h5" />
    {/* Base feet/wheels */}
    <path d="M8.5 20v1.5" />
    <path d="M15.5 20v1.5" />
  </svg>
);

/**
 * Monochrome line-art icon for Check-in bag (large checked suitcase with strap & wheels), no color fills.
 */
export const CheckInBagIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Top carry handle */}
    <path d="M9 6V4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v2" />
    {/* Large checked suitcase body */}
    <rect x="4" y="6" width="16" height="13.5" rx="2.2" />
    {/* Vertical luggage straps */}
    <path d="M8.5 6v13.5" />
    <path d="M15.5 6v13.5" />
    {/* Center buckle latch */}
    <path d="M10.5 11.5h3" />
    {/* Dual spinner wheels */}
    <circle cx="7.5" cy="21" r="1" />
    <circle cx="16.5" cy="21" r="1" />
  </svg>
);

/**
 * Monochrome line-art icon for Small personal bag (underseat tote/handbag), no color fills.
 */
export const PersonalBagIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Tote / handbag handles */}
    <path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    {/* Underseat bag body */}
    <path d="M5 9h14l1 10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L5 9Z" />
    {/* Horizontal pocket seam */}
    <path d="M8.5 13.5h7" />
  </svg>
);

/**
 * Monochrome line-art icon for Self-transfer / Baggage re-check, matching front-page stroke style (no color fills).
 */
export const SelfTransferIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Suitcase handle */}
    <path d="M6.5 7V4.5A1.5 1.5 0 0 1 8 3h2a1.5 1.5 0 0 1 1.5 1.5V7" />
    {/* Suitcase body */}
    <rect x="4" y="7" width="10" height="12.5" rx="2" />
    {/* Suitcase center strap */}
    <path d="M9 7v12.5" />
    {/* Suitcase feet */}
    <path d="M6.5 19.5V21" />
    <path d="M11.5 19.5V21" />
    {/* Bidirectional transfer arrows beside suitcase */}
    <path d="M16 9.5h5" />
    <path d="M19 7.5 21 9.5 19 11.5" />
    <path d="M21 16h-5" />
    <path d="M18 14 16 16l2 2" />
  </svg>
);

/**
 * Monochrome line-art icon for UPI payment support (smartphone/QR badge), no color fills.
 */
export const UpiPayIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="6" y="2.5" width="12" height="19" rx="2.2" />
    <path d="M10.5 18.5h3" />
    <path d="m10 8.5 3.5 3-3.5 3" />
    <path d="m13 8.5 3.5 3-3.5 3" />
  </svg>
);

/**
 * Monochrome line-art icon for Instant confirmation / e-ticket, no color fills.
 */
export const InstantConfirmIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M13 2 4.5 13.5H12l-1 8.5 8.5-11.5H12L13 2Z" />
  </svg>
);

/**
 * Monochrome line-art icon for Free 24h cancellation, no color fills.
 */
export const FreeCancelIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 21a9 9 0 1 0-6.36-2.64" />
    <path d="M3 12h3" />
    <path d="m9.5 12 1.8 1.8L15 10" />
  </svg>
);

/**
 * Monochrome line-art icon for aircraft seat layout, no color fills.
 */
export const SeatLayoutIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 4v9a2 2 0 0 0 2 2h7" />
    <path d="M7 15v4" />
    <path d="M16 15v4" />
    <path d="M5 19h14" />
    <path d="M10.5 11.5h5" />
  </svg>
);

/**
 * Clean Airline Logo Mark used inside the Outbound / Return Journey card.
 */
export const AirlineLogoMark: React.FC<{
  badgeCode: string;
  badgeBg?: string;
  airlineName?: string;
  size?: 'sm' | 'lg';
}> = ({ badgeCode, badgeBg = 'bg-blue-600', airlineName, size = 'lg' }) => {
  const code = (badgeCode || airlineName?.slice(0, 2) || 'FL').toUpperCase();
  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${badgeBg} text-white font-extrabold text-[9px] tracking-tight shrink-0 shadow-2xs`}
        title={airlineName}
      >
        {code}
      </span>
    );
  }

  return (
    <div
      className={`w-11 h-11 rounded-xl ${badgeBg} text-white flex flex-col items-center justify-center shadow-xs shrink-0`}
      title={airlineName}
    >
      <span className="font-extrabold text-xs tracking-wider leading-none">{code}</span>
    </div>
  );
};
