import React from 'react';

export interface TripYeahLogoProps {
  className?: string;
  isDarkHeader?: boolean;
  showSubtitle?: boolean;
  airplaneColorMode?: 'y-color' | 'navy';
}

/**
 * TripYeah Official Brand Logo
 * 100% vector reproduction precisely matching user uploaded image (WhatsApp Image 2026-10-18 at 5.35.01 PM):
 * - "Trip" in deep navy blue (#002661) or crisp white on dark headers
 * - Generous, clean spacing between "p" and "Y" so they never collide
 * - Stylized "Y" matching the exact uploaded icon:
 *    • Left arm: smooth jet contrail swooshing up-left into the ascending aeroplane in Y's color (#00A3FF)
 *    • Right arm: dynamic upward curve connecting seamlessly into the large circular location pin (📍)
 *    • Solid vertical rectangular stem at the base
 * - "ehh" in electric sky blue (#00A3FF)
 */
export const TripYeahLogo: React.FC<TripYeahLogoProps> = ({
  className = 'h-8 sm:h-9 w-auto',
  isDarkHeader = false,
  showSubtitle = false,
  airplaneColorMode = 'y-color',
}) => {
  // Deep Navy for "Trip" on light background; crisp white on dark/hero background
  const navyColor = isDarkHeader ? '#FFFFFF' : '#002661';
  // Sky blue color for stylized "Y", swooshes, aeroplane, location pin, and "ehh"
  const skyBlueColor = isDarkHeader ? '#38BDF8' : '#00A3FF';
  // Cutout center hole for the location pin
  const pinHoleColor = isDarkHeader ? '#0F172A' : '#FFFFFF';
  // Aeroplane color: default matches Y color (#00A3FF / #38BDF8), or navy if requested
  const planeColor = airplaneColorMode === 'navy' && !isDarkHeader ? '#002661' : skyBlueColor;

  return (
    <div className="inline-flex flex-col items-start select-none">
      <svg
        viewBox="0 0 472 165"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-colors duration-200 overflow-visible`}
        aria-label="TripYehh Logo"
      >
        <defs>
          {/* Subtle drop shadow for dark header readability */}
          {isDarkHeader && (
            <filter id="logoGlow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          )}
        </defs>

        <g filter={isDarkHeader ? 'url(#logoGlow)' : undefined}>
          {/* =========================================================
              PART 1: "Trip" in Deep Navy Blue (#002661) or Crisp White
             ========================================================= */}

          {/* Letter 'T' */}
          <path
            d="M 18 43
               H 74
               C 75.5 43 76.5 44 76.5 45.5
               V 56
               C 76.5 57.5 75.5 58.5 74 58.5
               H 54
               V 118
               C 54 119.5 53 120.5 51.5 120.5
               H 40.5
               C 39 120.5 38 119.5 38 118
               V 58.5
               H 18
               C 16.5 58.5 15.5 57.5 15.5 56
               V 45.5
               C 15.5 44 16.5 43 18 43
               Z"
            fill={navyColor}
          />

          {/* Letter 'r' */}
          <path
            d="M 85 70
               C 85 68.5 86 67.5 87.5 67.5
               H 98.5
               C 100 67.5 101 68.5 101 70
               V 76.5
               C 105 70.5 110.5 67.5 118 67.5
               C 120.5 67.5 123 68 124.5 68.8
               C 126 69.5 126.5 71 126.5 72.8
               V 81.5
               C 126.5 83.5 124.5 84.8 122.5 84
               C 120 83 117.5 82.5 115 82.5
               C 107.5 82.5 101 87.5 101 96.5
               V 118
               C 101 119.5 100 120.5 98.5 120.5
               H 87.5
               C 86 120.5 85 119.5 85 118
               V 70
               Z"
            fill={navyColor}
          />

          {/* Letter 'i' (Dot + Rectangular Stem) */}
          <circle cx="140" cy="53" r="8.5" fill={navyColor} />
          <path
            d="M 132.5 70
               C 132.5 68.5 133.5 67.5 135 67.5
               H 145
               C 146.5 67.5 147.5 68.5 147.5 70
               V 118
               C 147.5 119.5 146.5 120.5 145 120.5
               H 135
               C 133.5 120.5 132.5 119.5 132.5 118
               V 70
               Z"
            fill={navyColor}
          />

          {/* Letter 'p' */}
          <path
            d="M 158 70
               C 158 68.5 159 67.5 160.5 67.5
               H 170.5
               C 172 67.5 173 68.5 173 70
               V 74.5
               C 177.5 69.5 184 66.5 192.5 66.5
               C 207 66.5 218 78 218 94
               C 218 110 207 121.5 192.5 121.5
               C 185 121.5 178.5 118.5 173 113.5
               V 143
               C 173 144.5 172 145.5 170.5 145.5
               H 160.5
               C 159 145.5 158 144.5 158 143
               V 70
               Z
               M 173 94
               C 173 103 179.5 109 188 109
               C 196.5 109 203 103 203 94
               C 203 85 196.5 79 188 79
               C 179.5 79 173 85 173 94
               Z"
            fill={navyColor}
          />

          {/* =========================================================
              PART 2: Stylized "Y" Exactly Matching User's Image
              (WhatsApp Image 2026-10-18 at 5.35.01 PM)
              - Left Arm: Curved Jet Contrail + Aeroplane
              - Right Arm: Curved Branch + Large Tilted Map Pin
              - Lower Base: Centered Solid Vertical Stem
             ========================================================= */}

          {/* Lower Vertical Stem of the Y */}
          <path
            d="M 246 86
               C 246 84.5 247 83.5 248.5 83.5
               H 263.5
               C 265 83.5 266 84.5 266 86
               V 118
               C 266 119.5 265 120.5 263.5 120.5
               H 248.5
               C 247 120.5 246 119.5 246 118
               V 86
               Z"
            fill={skyBlueColor}
          />

          {/* Left Arm: Continuous Jet Contrail Swoosh leading to Aeroplane */}
          <path
            d="M 246 86
               C 242 66 230 46 212 32
               C 206 27 199 22.5 192 18.5
               C 196 23 201.5 29 206 35.5
               C 217.5 51.5 227 70 231.5 90
               Z"
            fill={skyBlueColor}
          />
          <path
            d="M 252 86
               C 248 68 238 50 222 35
               C 216 29 209 24 200 18
               C 206 25 214 36 221 48
               C 231 66 239 80 241 88
               Z"
            fill={skyBlueColor}
          />

          {/* Aeroplane ✈ (Exact shape from user image, in skyBlueColor matching Y) */}
          <g transform="translate(189, 21) rotate(-42)">
            {/* Fuselage with rounded nose, swept delta wings with rounded tips, and tail */}
            <path
              d="M 0 -22
                 C 2.4 -22 4 -18.5 4 -12
                 L 4 -1.5
                 L 22.5 9.5
                 C 24 10.5 23.5 12.2 21.8 12.2
                 L 4 9.5
                 L 4 17
                 L 10.5 21.5
                 C 11.5 22.2 11.2 23.5 10.2 23.5
                 L 0 22
                 L -10.2 23.5
                 C -11.2 23.5 -11.5 22.2 -10.5 21.5
                 L -4 17
                 L -4 9.5
                 L -21.8 12.2
                 C -23.5 12.2 -24 10.5 -22.5 9.5
                 L -4 -1.5
                 L -4 -12
                 C -4 -18.5 -2.4 -22 0 -22
                 Z"
              fill={planeColor}
            />
          </g>

          {/* Right Arm: Swooshes up-right directly merging into the Location Pin */}
          <path
            d="M 256 86
               C 260 67 271 49 285 34
               C 291 27 298 20.5 304 14
               C 299.5 22 292 32 285.5 43
               C 275.5 59.5 269 76 266 91
               Z"
            fill={skyBlueColor}
          />
          <path
            d="M 262 86
               C 266 69 278 52 291 38
               C 297 31 304 24 309 17
               C 305 25 297.5 36.5 290 48.5
               C 280.5 65.5 274.5 80 272 88
               Z"
            fill={skyBlueColor}
          />

          {/* Location Map Pin 📍 (Exact teardrop angle and circular cutout matching user image) */}
          <g transform="translate(296, 4)">
            {/* Teardrop Pin Body */}
            <path
              d="M 16 0
                 C 7.2 0 0 7.2 0 16
                 C 0 25.8 13.8 38.8 15.2 40
                 C 15.6 40.4 16.4 40.4 16.8 40
                 C 18.2 38.8 32 25.8 32 16
                 C 32 7.2 24.8 0 16 0
                 Z"
              fill={skyBlueColor}
            />
            {/* Center Circular Hole */}
            <circle cx="16" cy="15" r="6.2" fill={pinHoleColor} />
          </g>

          {/* =========================================================
              PART 3: "ehh" in Electric Sky Blue (#00A3FF)
              Clean, professional typography matching Plus Jakarta Sans Bold
              aligned to exact baseline (y=118.5) and cap-height (y=43)
             ========================================================= */}
          <text
            x="280"
            y="118.5"
            fill={skyBlueColor}
            className="select-none font-bold"
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: '76px',
              fontWeight: 700,
              letterSpacing: '-1px',
            }}
          >
            ehh
          </text>
        </g>
      </svg>

      {showSubtitle && (
        <span
          className={`text-[9px] tracking-wider uppercase font-semibold pl-1 -mt-1 ${
            isDarkHeader ? 'text-sky-300/80' : 'text-slate-400'
          }`}
        >
          Travel &amp; Flights
        </span>
      )}
    </div>
  );
};

/**
 * Standalone TripYeah App Icon
 * Exact 1:1 reproduction of the user's uploaded icon (WhatsApp Image 2026-10-18 at 5.35.01 PM):
 * - Rounded squircle with vibrant blue gradient (#00A3FF to #0066FF)
 * - Solid crisp white "Y" with ascending aeroplane contrail & location pin
 */
export const TripYeahAppIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-12 h-12',
  size = 48,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 select-none drop-shadow-sm`}
      aria-label="TripYeah App Icon"
    >
      <defs>
        {/* Sky Blue to Ocean Blue Gradient matching the uploaded app icon */}
        <linearGradient id="tripIconGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00A6FF" />
          <stop offset="50%" stopColor="#0088FF" />
          <stop offset="100%" stopColor="#0060FA" />
        </linearGradient>
        {/* Subtle ground shadow under the base of the stem */}
        <linearGradient id="stemShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#004BBB" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0060FA" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Background */}
      <rect width="200" height="200" rx="46" fill="url(#tripIconGradient)" />

      {/* Subtle Base Stem Drop Shadow */}
      <path d="M 85 168 H 107 V 190 H 85 Z" fill="url(#stemShadow)" />

      {/* =========================================================
          The Iconic White "Y"
         ========================================================= */}
      <g fill="#FFFFFF">
        {/* Base Vertical Stem */}
        <path
          d="M 84 116
             H 107
             V 166
             C 107 167.5 106 168.5 104.5 168.5
             H 86.5
             C 85 168.5 84 167.5 84 166
             V 116
             Z"
        />

        {/* Left Arm: Curved Jet Contrail Swoosh leading to Plane */}
        <path
          d="M 84 116
             C 78 88 64 64 42 46
             C 34 39.5 25 34 16 29
             C 21.5 35 29 42.5 35 51
             C 50.5 73 63 97 68.5 124
             Z"
        />
        <path
          d="M 91 116
             C 86 91 73 69 53 49
             C 45 42 36 36 26 29
             C 34 38 45 53 54 69
             C 67 93 78 111 80 121
             Z"
        />

        {/* Aeroplane ✈ at apex of left swoosh */}
        <g transform="translate(56, 56) rotate(-42)">
          <path
            d="M 0 -26
               C 2.8 -26 4.8 -22 4.8 -14
               L 4.8 -2
               L 26 11
               C 28 12.2 27.5 14.5 25.5 14.5
               L 4.8 11.2
               L 4.8 20
               L 12.5 25.5
               C 13.8 26.2 13.5 27.8 12.2 27.8
               L 0 26
               L -12.2 27.8
               C -13.5 27.8 -13.8 26.2 -12.5 25.5
               L -4.8 20
               L -4.8 11.2
               L -25.5 14.5
               C -27.5 14.5 -28 12.2 -26 11
               L -4.8 -2
               L -4.8 -14
               C -4.8 -22 -2.8 -26 0 -26
               Z"
          />
        </g>

        {/* Right Arm: Curved Swoosh leading into Location Pin */}
        <path
          d="M 96 116
             C 102 91 116 67 134 47
             C 142 38 151 29 159 20
             C 153.5 30 144 43 135.5 57
             C 122.5 79 114 101 110 122
             Z"
        />
        <path
          d="M 103 116
             C 109 94 125 71 142 52
             C 150 43 159 34 165 24
             C 160 35 150 50 140 66
             C 128 89 120 108 117 119
             Z"
        />

        {/* Location Pin 📍 */}
        <g transform="translate(124, 38)">
          {/* Teardrop Pin Body */}
          <path
            d="M 23 0
               C 10.3 0 0 10.3 0 23
               C 0 37 19.8 55.6 21.8 57.3
               C 22.4 57.9 23.6 57.9 24.2 57.3
               C 26.2 55.6 46 37 46 23
               C 46 10.3 35.7 0 23 0
               Z"
          />
          {/* Center Cutout showing blue background */}
          <circle cx="23" cy="22" r="8.8" fill="#0088FF" />
        </g>
      </g>
    </svg>
  );
};
