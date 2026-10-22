import React from 'react';
import tropicalPlannerHero from '../assets/images/tropical_planner_hero_1792686268357.jpg';

interface GhibliHeroSceneryProps {
  startDate?: string;
  className?: string;
}

export const GhibliHeroScenery: React.FC<GhibliHeroSceneryProps> = ({
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 overflow-visible pointer-events-none select-none ${className}`}>
      {/* ===================================================================
          1. MAIN BACKGROUND ILLUSTRATION WITH INTEGRATED TREE WIND SWAY
      =================================================================== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Tropical Landscape Art */}
        <img
          src={tropicalPlannerHero}
          alt="Tropical Island Travel Paradise"
          className="w-full h-full object-cover object-center scale-100"
        />

        {/* Left Palm Trees Cluster Swaying in Ocean Breeze (Animates the painted trees on the left) */}
        <div
          className="absolute top-0 left-0 w-[35%] h-[55%] overflow-hidden pointer-events-none origin-top-left"
          style={{
            animation: 'palmLeavesWindSwayLeft 5s ease-in-out infinite alternate',
          }}
        >
          <img
            src={tropicalPlannerHero}
            alt=""
            className="w-full h-full object-cover object-left-top scale-100 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
            style={{
              clipPath: 'polygon(0% 0%, 95% 0%, 75% 65%, 25% 95%, 0% 100%)',
            }}
          />
        </div>

        {/* Right Palm Trees Cluster Swaying in Ocean Breeze (Animates the painted trees on the right) */}
        <div
          className="absolute top-0 right-0 w-[35%] h-[55%] overflow-hidden pointer-events-none origin-top-right"
          style={{
            animation: 'palmLeavesWindSwayRight 5.6s ease-in-out infinite alternate',
          }}
        >
          <img
            src={tropicalPlannerHero}
            alt=""
            className="w-full h-full object-cover object-right-top scale-100 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
            style={{
              clipPath: 'polygon(5% 0%, 100% 0%, 100% 100%, 75% 95%, 25% 65%)',
            }}
          />
        </div>

        {/* Glistening Sunlight Sparkles on the Painted Water Surface */}
        <div className="absolute top-[48%] left-[45%] w-[25%] h-[15%] pointer-events-none">
          {[
            { left: '20%', top: '35%', delay: '0s' },
            { left: '50%', top: '20%', delay: '0.8s' },
            { left: '75%', top: '45%', delay: '1.4s' },
            { left: '35%', top: '65%', delay: '0.5s' },
          ].map((spark, idx) => (
            <div
              key={idx}
              className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]"
              style={{
                left: spark.left,
                top: spark.top,
                animation: 'paintedWaterShimmer 2.4s ease-in-out infinite',
                animationDelay: spark.delay,
              }}
            />
          ))}
        </div>

        {/* ===================================================================
            2. THE BOAT PAINTED IN THE BACKGROUND COMING ALIVE ("jo peeche boat bni hui h wo chale")
            Positioned directly over the painted sailboat (~61% from left, ~51.5% from top)
        =================================================================== */}
        <div
          className="absolute top-[51%] left-[60.5%] z-10 pointer-events-none"
          style={{
            animation: 'bgSailBoatSway 10s ease-in-out infinite',
          }}
        >
          <div className="relative">
            {/* Subtle water wake ripple under the sailboat's hull */}
            <div
              className="absolute bottom-0 -left-2 w-10 h-1.5 rounded-full bg-cyan-200/50 blur-[0.8px]"
              style={{
                animation: 'bgBoatWakePulse 3s ease-in-out infinite',
              }}
            />

            {/* Matching Stylized Sailboat identical to the painting */}
            <svg
              width="26"
              height="30"
              viewBox="0 0 32 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
            >
              {/* Wooden Hull */}
              <path
                d="M4 27 C8 31, 24 31, 28 27 L25 31 C20 33, 10 33, 7 31 Z"
                fill="#854D0E"
                stroke="#451A03"
                strokeWidth="0.8"
              />
              {/* White Hull Top Rail */}
              <path d="M4 27 L28 27" stroke="#FEF3C7" strokeWidth="0.8" strokeLinecap="round" />

              {/* Mast */}
              <line x1="16" y1="4" x2="16" y2="27" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />

              {/* Main Sail (White Canvas matching illustration) */}
              <path
                d="M16 6 C21 11, 25 18, 25 25 L16 25 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="0.7"
              />

              {/* Jib Sail (Front Triangular Sail) */}
              <path
                d="M15 8 C11 13, 8 20, 7 25 L15 25 Z"
                fill="#F8FAFC"
                stroke="#94A3B8"
                strokeWidth="0.7"
              />

              {/* Tiny Pennant Flag on Top */}
              <path d="M16 4 L20 6 L16 8 Z" fill="#EF4444" />
            </svg>
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. CASCADING WATER POURING DOWN TO BALI SECTION ("pani beh k neech gire bali wagera jo likha h waha")
          Flows over the bottom rim of the hero banner downward toward the "Bali • Indonesia" header
      =================================================================== */}
      <div className="absolute -bottom-6 sm:-bottom-8 left-0 right-0 h-14 sm:h-16 pointer-events-none z-20 overflow-visible">
        {/* Waterfall streams flowing down over the bottom rim */}
        <div className="relative w-full h-full flex justify-between px-4 sm:px-12 md:px-20 overflow-visible">
          {[
            { left: '10%', width: '42px', delay: '0s', opacity: 0.75 },
            { left: '20%', width: '60px', delay: '0.35s', opacity: 0.85 },
            { left: '35%', width: '52px', delay: '0.7s', opacity: 0.8 },
            { left: '50%', width: '70px', delay: '0.2s', opacity: 0.9 },
            { left: '65%', width: '48px', delay: '1.0s', opacity: 0.8 },
            { left: '78%', width: '62px', delay: '0.5s', opacity: 0.85 },
            { left: '90%', width: '40px', delay: '0.85s', opacity: 0.75 },
          ].map((stream, idx) => (
            <div
              key={idx}
              className="absolute top-0 h-full overflow-visible"
              style={{
                left: stream.left,
                width: stream.width,
              }}
            >
              {/* Flowing Water Ribbon pouring downward */}
              <div
                className="w-full h-full rounded-b-2xl shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
                style={{
                  background: 'linear-gradient(180deg, rgba(56,189,248,0.85) 0%, rgba(14,165,233,0.6) 60%, rgba(255,255,255,0.8) 100%)',
                  filter: 'blur(0.4px)',
                  opacity: stream.opacity,
                  animation: 'waterfallFlowDown 1.7s linear infinite',
                  animationDelay: stream.delay,
                }}
              />

              {/* Water Splash / Mist Ripple at the bottom landing point right above Bali title */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 rounded-full bg-sky-200/80 shadow-[0_0_8px_rgba(56,189,248,0.6)] blur-[0.8px]"
                style={{
                  animation: 'waterMistRipple 1.7s ease-in-out infinite',
                  animationDelay: stream.delay,
                }}
              />
            </div>
          ))}

          {/* Soft crystalline water curtain spanning the entire bottom border */}
          <svg
            className="absolute -top-1 left-0 w-full h-10 opacity-75 drop-shadow-[0_4px_6px_rgba(14,165,233,0.2)]"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,28 350,8 500,24 C650,38 850,12 1000,26 C1100,34 1180,14 1200,20 L1200,40 L0,40 Z"
              fill="url(#waterfallGradient)"
            />
            <defs>
              <linearGradient id="waterfallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
                <stop offset="65%" stopColor="#7DD3FC" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};
