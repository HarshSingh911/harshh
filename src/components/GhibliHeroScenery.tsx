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
      </div>
    </div>
  );
};
