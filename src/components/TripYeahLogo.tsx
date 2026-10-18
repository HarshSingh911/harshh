import React from 'react';

interface TripYeahLogoProps {
  className?: string;
  isDarkHeader?: boolean;
  showSubtitle?: boolean;
}

/**
 * TripYeah Official Brand Logo
 * Pixel-accurate vector implementation matching the official brand identity:
 * - "Trip" in deep navy blue (#0A255A) or crisp white on dark headers
 * - Stylized "Y" in electric sky blue (#00A3FF) featuring:
 *    • Left wing swooshing up into an ascending navy/white airplane (✈)
 *    • Right wing curving up into an electric sky blue location map pin (📍)
 * - "ehh" in electric sky blue (#00A3FF)
 */
export const TripYeahLogo: React.FC<TripYeahLogoProps> = ({
  className = 'h-8 sm:h-9 w-auto',
  isDarkHeader = false,
  showSubtitle = false,
}) => {
  // Navy color for "Trip" and Airplane on light background; crisp white on dark/hero background
  const navyColor = isDarkHeader ? '#FFFFFF' : '#0B2253';
  // Sky blue color for the stylized "Y", contrail, location pin, and "ehh"
  const skyBlueColor = isDarkHeader ? '#38BDF8' : '#00A3FF';
  const pinHoleColor = isDarkHeader ? '#0F172A' : '#FFFFFF';

  return (
    <div className="inline-flex flex-col items-start select-none">
      <svg
        viewBox="0 0 340 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-colors duration-200 overflow-visible`}
        aria-label="TripYeah Logo"
      >
        <defs>
          {/* Subtle drop shadow for dark header readability */}
          {isDarkHeader && (
            <filter id="logoGlow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
            </filter>
          )}
        </defs>

        <g filter={isDarkHeader ? 'url(#logoGlow)' : undefined}>
          {/* =========================================================
              PART 1: "Trip" in Deep Navy Blue (or Crisp White)
              Extra-bold, rounded modern sans geometry
             ========================================================= */}
          {/* Letter 'T' */}
          <path
            d="M12 28 H54 C55.5 28 56.5 29 56.5 30.5 V37 C56.5 38.5 55.5 39.5 54 39.5 H41 V69.5 C41 71 40 72 38.5 72 H29.5 C28 72 27 71 27 69.5 V39.5 H12 C10.5 39.5 9.5 38.5 9.5 37 V30.5 C9.5 29 10.5 28 12 28 Z"
            fill={navyColor}
          />

          {/* Letter 'r' */}
          <path
            d="M62 40 C62 38.5 63 37.5 64.5 37.5 H72 C73.5 37.5 74.5 38.5 74.5 40 V44 C77.5 40 81.5 38 87 38 C88.5 38 90.5 38.3 92 38.8 C93 39.2 93.5 40.2 93.5 41.5 V47.5 C93.5 49 92 50 90.5 49.5 C88.5 49 86.5 48.8 84.5 48.8 C79.5 48.8 75 52 75 58 V69.5 C75 71 74 72 72.5 72 H64.5 C63 72 62 71 62 69.5 V40 Z"
            fill={navyColor}
          />

          {/* Letter 'i' (Stem + Solid Circle Dot) */}
          <circle cx="103" cy="30" r="6" fill={navyColor} />
          <path
            d="M97.5 40 C97.5 38.5 98.5 37.5 100 37.5 H106 C107.5 37.5 108.5 38.5 108.5 40 V69.5 C108.5 71 107.5 72 106 72 H100 C98.5 72 97.5 71 97.5 69.5 V40 Z"
            fill={navyColor}
          />

          {/* Letter 'p' */}
          <path
            d="M117 40 C117 38.5 118 37.5 119.5 37.5 H126.5 C128 37.5 129 38.5 129 40 V43.5 C132.5 39.8 137.5 37.5 143.5 37.5 C154 37.5 162 45.2 162 55.5 C162 65.8 154 73.5 143.5 73.5 C138 73.5 133 71.5 129.5 68 V84 C129.5 85.5 128.5 86.5 127 86.5 H119.5 C118 86.5 117 85.5 117 84 V40 Z M129 55.5 C129 61.5 133.5 65.5 139.5 65.5 C145.5 65.5 150 61.5 150 55.5 C150 49.5 145.5 45.5 139.5 45.5 C133.5 45.5 129 49.5 129 55.5 Z"
            fill={navyColor}
          />

          {/* =========================================================
              PART 2: Stylized "Y" with Contrail, Airplane & Map Pin
             ========================================================= */}

          {/* Left Wing Swoosh (Ascending Contrail to Airplane) */}
          <path
            d="M172 68 C169 52 162 38 151 26 C148 22.8 144.5 19.5 141 16.5 C143.5 19 146.5 22.5 149 26.5 C157 37 163 51 165 67 Z"
            fill={skyBlueColor}
          />
          <path
            d="M176 68 C173 53 167 40 157 28 C153.5 23.8 149.5 19.8 145 16 C149 21 154.5 28.5 159 37 C166 49.5 170.5 60 172 68 Z"
            fill={skyBlueColor}
          />

          {/* Airplane ✈ at apex of left swoosh */}
          <g transform="translate(133, 4) rotate(-38)">
            {/* Fuselage */}
            <path
              d="M12 0 C13.8 0 15 1.5 15 3.5 L14.2 19 L16.8 24 C16.8 24.8 16 25.5 15.2 25 L10.8 23.5 L10 25.5 C9.8 26 9.2 26.5 8.6 26.5 C8 26.5 7.4 26 7.2 25.5 L6.4 23.5 L2 25 C1.2 25.5 0.4 24.8 0.4 24 L3 19 L2.2 3.5 C2.2 1.5 3.4 0 5.2 0 Z"
              fill={navyColor}
            />
            {/* Main Wings */}
            <path
              d="M8.6 7 L23 15.5 C24 16.2 23.8 17.5 22.6 17.5 L8.6 13.5 L-5.4 17.5 C-6.6 17.5 -6.8 16.2 -5.8 15.5 L8.6 7 Z"
              fill={navyColor}
            />
            {/* Tail Horizontal Stabilizer */}
            <path
              d="M8.6 20.5 L15.5 24 C16.2 24.5 16 25.5 15.2 25.5 L8.6 24.2 L2 25.5 C1.2 25.5 1 24.5 1.7 24 L8.6 20.5 Z"
              fill={navyColor}
            />
          </g>

          {/* Right Wing Swoosh (Leading up to Location Pin) */}
          <path
            d="M174 68 C176 56 182 45 191 35 C196 29 201 23 204.5 18 C202 23 197 30 192 38 C186 48 181.5 58 180 68 Z"
            fill={skyBlueColor}
          />
          <path
            d="M178 68 C181 56 188 45 197 36 C201.5 30.5 206 25 208.5 20 C205.5 25.5 200.5 33 195 41 C188 51.5 183.5 60 182 68 Z"
            fill={skyBlueColor}
          />

          {/* Lower Stem of the Y */}
          <path
            d="M170.5 64 C170.5 63 171.5 62 172.5 62 H181.5 C182.5 62 183.5 63 183.5 64 V75.5 C183.5 76.5 182.5 77.5 181.5 77.5 H172.5 C171.5 77.5 170.5 76.5 170.5 75.5 V64 Z"
            fill={skyBlueColor}
          />

          {/* Location Map Pin 📍 at apex of right wing */}
          <g transform="translate(201, 2)">
            {/* Teardrop Pin */}
            <path
              d="M11 0 C4.9 0 0 4.9 0 11 C0 17.8 9.5 26.8 10.4 27.6 C10.8 28 11.2 28 11.6 27.6 C12.5 26.8 22 17.8 22 11 C22 4.9 17.1 0 11 0 Z"
              fill={skyBlueColor}
            />
            {/* Inner White Cutout Hole */}
            <circle cx="11" cy="10" r="4.3" fill={pinHoleColor} />
          </g>

          {/* =========================================================
              PART 3: "ehh" in Electric Sky Blue
             ========================================================= */}
          {/* Letter 'e' (Tucked snugly in the Y fork) */}
          <path
            d="M196 55 C196 46 202 38 211 38 C220 38 226 44.5 226 55 C226 56 225.5 56.5 224.5 56.5 H206.5 C207 62 210.5 65.5 215.5 65.5 C219 65.5 222 64 224 61.5 C224.8 60.5 226 60.5 227 61.2 L229.5 63.5 C230.5 64.5 230.2 65.8 229 67 C225.5 71 221 73.5 215 73.5 C203.5 73.5 196 66 196 55 Z M215.5 45.5 C210.5 45.5 207 48.5 206.5 51.5 H224.5 C224.5 48.5 221 45.5 215.5 45.5 Z"
            fill={skyBlueColor}
          />

          {/* Letter 'h' (First h) */}
          <path
            d="M234 26 C234 24.5 235 23.5 236.5 23.5 H243.5 C245 23.5 246 24.5 246 26 V44 C249 40 253.5 38 259.5 38 C269 38 274 44 274 54 V69.5 C274 71 273 72 271.5 72 H264.5 C263 72 262 71 262 69.5 V55 C262 49.5 259 47 254 47 C249 47 245 50.5 245 57 V69.5 C245 71 244 72 242.5 72 H235.5 C234 72 234 71 234 69.5 V26 Z"
            fill={skyBlueColor}
          />

          {/* Letter 'h' (Second h) */}
          <path
            d="M280 26 C280 24.5 281 23.5 282.5 23.5 H289.5 C291 23.5 292 24.5 292 26 V44 C295 40 299.5 38 305.5 38 C315 38 320 44 320 54 V69.5 C320 71 319 72 317.5 72 H310.5 C309 72 308 71 308 69.5 V55 C308 49.5 305 47 300 47 C295 47 291 50.5 291 57 V69.5 C291 71 290 72 288.5 72 H281.5 C280 72 280 71 280 69.5 V26 Z"
            fill={skyBlueColor}
          />
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
