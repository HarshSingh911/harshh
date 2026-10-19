import React, { useEffect, useRef, useState, useCallback } from 'react';

export type SmileCharacterState =
  | 'idle'
  | 'near'
  | 'far'
  | 'happy'
  | 'thinking'
  | 'speaking'
  | 'greeting';

interface SmileAnimeCompanionProps {
  size?: 'launcher' | 'chat-header' | 'stage';
  isChatOpen?: boolean;
  isThinking?: boolean;
  isSpeaking?: boolean;
  manualState?: SmileCharacterState;
  showSpeechBubble?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SmileAnimeCompanion: React.FC<SmileAnimeCompanionProps> = ({
  size = 'launcher',
  isChatOpen = false,
  isThinking = false,
  isSpeaking = false,
  manualState,
  showSpeechBubble = false,
  onClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion and tracking states
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [proximity, setProximity] = useState<'near' | 'normal' | 'far'>('normal');
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [speakingFrame, setSpeakingFrame] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Effective character state
  const effectiveState: SmileCharacterState =
    manualState ||
    (isThinking
      ? 'thinking'
      : isSpeaking
      ? 'speaking'
      : isHovered || proximity === 'near'
      ? 'happy'
      : proximity === 'far'
      ? 'far'
      : 'idle');

  // 1. Natural Blinking Loop (Varied 3.5s to 5.5s intervals)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const scheduleBlink = () => {
      const delay = Math.random() * 2000 + 3500;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // 2. Speaking Animation Loop (phonetic mouth movement)
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setSpeakingFrame((prev) => (prev + 1) % 4);
    }, 130);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // 3. Mouse & Cursor Tracking + Proximity Calculation
  useEffect(() => {
    let animationFrameId: number;
    let targetPupilX = 0;
    let targetPupilY = 0;

    let currentPupilX = 0;
    let currentPupilY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      // Proximity determination
      if (distance < 240) {
        setProximity('near');
      } else if (distance > 680) {
        setProximity('far');
      } else {
        setProximity('normal');
      }

      // Max eye pupil displacement (only eyes move within sockets)
      const maxDisplacement = 4.0;
      const angle = Math.atan2(deltaY, deltaX);
      const intensity = Math.min(distance / 200, 1);

      targetPupilX = Math.cos(angle) * maxDisplacement * intensity;
      targetPupilY = Math.sin(angle) * maxDisplacement * intensity;
    };

    // Smooth Lerp loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      currentPupilX = lerp(currentPupilX, targetPupilX, 0.12);
      currentPupilY = lerp(currentPupilY, targetPupilY, 0.12);

      setPupilOffset({ x: currentPupilX, y: currentPupilY });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Compute dimensions based on size variant
  let containerDimensions = 'w-16 h-16';
  let svgViewSize = 240;

  if (size === 'launcher') {
    containerDimensions = 'w-16 h-16 sm:w-[68px] sm:h-[68px]';
  } else if (size === 'chat-header') {
    containerDimensions = 'w-11 h-11';
  } else if (size === 'stage') {
    containerDimensions = 'w-32 h-32 sm:w-36 sm:h-36';
  }

  // Expression overrides
  const isHappy = effectiveState === 'happy';
  const isThoughtful = effectiveState === 'thinking';
  const isFar = effectiveState === 'far';

  // Thinking pupil override: looks up and to right
  const effectivePupilX = isThoughtful ? 2.8 : pupilOffset.x;
  const effectivePupilY = isThoughtful ? -3.2 : pupilOffset.y;

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none flex items-center justify-center ${containerDimensions} ${className}`}
    >
      {/* Speech Bubble (Near / Far / Launcher) */}
      {showSpeechBubble && !isChatOpen && (
        <div
          className={`absolute -top-10 left-0 sm:left-2 transform pointer-events-none transition-all duration-300 z-30 whitespace-nowrap bg-white text-slate-800 text-[11px] font-bold py-1 px-3 rounded-full shadow-lg border border-cyan-100 flex items-center gap-1.5 ${
            proximity === 'near' || isHovered
              ? 'opacity-100 translate-y-0 scale-100'
              : proximity === 'far'
              ? 'opacity-85 translate-y-1 scale-95'
              : 'opacity-0 translate-y-2 scale-90'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            {proximity === 'near' || isHovered
              ? 'Hey! Need help planning a trip?'
              : "I'm here whenever you need me!"}
          </span>
          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-r border-b border-cyan-100 transform rotate-45" />
        </div>
      )}

      {/* Main Anime SVG Character Graphic */}
      <svg
        viewBox={`0 0 ${svgViewSize} ${svgViewSize}`}
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <radialGradient id={`smile-bg-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </radialGradient>
          <radialGradient id={`iris-grad-${size}`} cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="90%" stopColor="#082b59" />
          </radialGradient>
          <radialGradient id={`blush-grad-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity={isHappy ? 0.7 : 0.4} />
            <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`hoodie-grad-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <filter id={`shadow-${size}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#082b59" floodOpacity={0.12} />
          </filter>
        </defs>

        {/* Back Hair */}
        <path
          d="M 68 110 C 60 160 70 200 85 220 L 155 220 C 170 200 180 160 172 110 Z"
          fill="#18181b"
        />

        {/* White Cozy Hoodie Shoulders & Chest */}
        <g filter={`url(#shadow-${size})`}>
          <path
            d="M 64 165 C 55 180 40 220 35 240 L 205 240 C 200 220 185 180 176 165 C 160 178 140 185 120 185 C 100 185 80 178 64 165 Z"
            fill={`url(#hoodie-grad-${size})`}
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          {/* Light-Cyan Zipper Track */}
          <path d="M 120 182 L 120 240" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="117.5" y="184" width="5" height="8" rx="1.5" fill="#082b59" />

          {/* Drawstrings with cyan tips */}
          <path
            d="M 102 184 Q 98 205 100 216"
            stroke="#cbd5e1"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="100" cy="217" r="2.5" fill="#06b6d4" />
          <path
            d="M 138 184 Q 142 205 140 216"
            stroke="#cbd5e1"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="140" cy="217" r="2.5" fill="#06b6d4" />

          {/* Hoodie Collar Fold */}
          <path
            d="M 78 160 Q 95 182 120 183 Q 145 182 162 160 Q 142 166 120 166 Q 98 166 78 160 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        </g>

        {/* Neck */}
        <path d="M 108 140 L 108 165 Q 120 170 132 165 L 132 140 Z" fill="#fde2d2" />
        <path
          d="M 108 145 Q 120 152 132 145 L 132 140 L 108 140 Z"
          fill="#f9c7af"
          opacity="0.5"
        />

        {/* Head / Face */}
        <path
          d="M 76 96 C 76 68 95 54 120 54 C 145 54 164 68 164 96 C 164 124 150 148 120 150 C 90 148 76 124 76 96 Z"
          fill="#fef0e7"
        />

        {/* Cheeks Blush */}
        <ellipse cx="90" cy="118" rx="11" ry="6" fill={`url(#blush-grad-${size})`} />
        <ellipse cx="150" cy="118" rx="11" ry="6" fill={`url(#blush-grad-${size})`} />

        {/* Nose */}
        <circle cx="120" cy="115" r="1.3" fill="#e79c88" />

        {/* Dynamic Mouth */}
        {isSpeaking ? (
          // Animated phonetic speaking mouth shapes
          speakingFrame === 0 ? (
            <ellipse cx="120" cy="130" rx="5" ry="3.5" fill="#be5a58" />
          ) : speakingFrame === 1 ? (
            <path
              d="M 114 127 Q 120 136 126 127 Z"
              fill="#be5a58"
              stroke="#be5a58"
              strokeWidth="1.5"
            />
          ) : speakingFrame === 2 ? (
            <ellipse cx="120" cy="130" rx="3.5" ry="4.5" fill="#be5a58" />
          ) : (
            <path
              d="M 115 128 Q 120 133 125 128"
              stroke="#be5a58"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )
        ) : isHappy ? (
          // Joyful open smile
          <path
            d="M 112 125 Q 120 136 128 125 Z"
            fill="#be5a58"
            stroke="#9f3a38"
            strokeWidth="1.5"
          />
        ) : isThoughtful ? (
          // Cute thoughtful pout
          <path
            d="M 116 128 Q 121 125 126 128"
            stroke="#be5a58"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : isFar ? (
          // Slight compassionate subtle smile
          <path
            d="M 115 127 Q 120 131 125 127"
            stroke="#be5a58"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Standard gentle friendly smile
          <path
            d="M 113 126 Q 120 133 127 126"
            stroke="#be5a58"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Eyes: Blinking vs Natural vs Crescent Happy */}
        {isBlinking ? (
          // Blinking closed eye strokes
          <g>
            <path
              d="M 85 104 Q 96 109 107 104"
              stroke="#18181b"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 133 104 Q 144 109 155 104"
              stroke="#18181b"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : isHappy && isHovered ? (
          // Happy anime crescent smiling eyes (^ _ ^)
          <g>
            {/* Left Happy Crescent */}
            <path
              d="M 85 104 Q 96 93 107 104"
              stroke="#18181b"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Happy Crescent */}
            <path
              d="M 133 104 Q 144 93 155 104"
              stroke="#18181b"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          // Full Expressive Eyes with Pupil Cursor Tracking
          <g>
            {/* LEFT EYE */}
            <g id="companion-left-eye">
              {/* Eyebrow */}
              <path
                d={isThoughtful ? 'M 85 86 Q 98 81 106 87' : 'M 86 89 Q 98 84 105 88'}
                stroke="#27272a"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Eyelash / top fold */}
              <path
                d="M 84 99 Q 96 92 108 97"
                stroke="#18181b"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Sclera */}
              <path
                d="M 87 99 C 87 96 105 96 105 99 C 105 114 87 114 87 99 Z"
                fill="#ffffff"
              />
              {/* Iris (Dynamic Cursor Tracking) */}
              <ellipse
                cx={96 + effectivePupilX}
                cy={104 + effectivePupilY}
                rx="7.5"
                ry="8"
                fill={`url(#iris-grad-${size})`}
              />
              {/* Pupil */}
              <ellipse
                cx={96 + effectivePupilX}
                cy={104 + effectivePupilY}
                rx="4"
                ry="4.5"
                fill="#082b59"
              />
              {/* Catchlight Sparks */}
              <circle
                cx={93.5 + effectivePupilX * 0.7}
                cy={101 + effectivePupilY * 0.7}
                r="2.4"
                fill="#ffffff"
              />
              <circle
                cx={98 + effectivePupilX * 0.7}
                cy={106.5 + effectivePupilY * 0.7}
                r="1.2"
                fill="#ffffff"
              />
              {/* Bottom eye line */}
              <path
                d="M 89 111 Q 97 113 103 110"
                stroke="#71717a"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* RIGHT EYE */}
            <g id="companion-right-eye">
              {/* Eyebrow */}
              <path
                d={isThoughtful ? 'M 134 85 Q 143 80 155 87' : 'M 135 88 Q 142 84 154 89'}
                stroke="#27272a"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Eyelash / top fold */}
              <path
                d="M 132 97 Q 144 92 156 99"
                stroke="#18181b"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Sclera */}
              <path
                d="M 135 99 C 135 96 153 96 153 99 C 153 114 135 114 135 99 Z"
                fill="#ffffff"
              />
              {/* Iris (Dynamic Cursor Tracking) */}
              <ellipse
                cx={144 + effectivePupilX}
                cy={104 + effectivePupilY}
                rx="7.5"
                ry="8"
                fill={`url(#iris-grad-${size})`}
              />
              {/* Pupil */}
              <ellipse
                cx={144 + effectivePupilX}
                cy={104 + effectivePupilY}
                rx="4"
                ry="4.5"
                fill="#082b59"
              />
              {/* Catchlight Sparks */}
              <circle
                cx={141.5 + effectivePupilX * 0.7}
                cy={101 + effectivePupilY * 0.7}
                r="2.4"
                fill="#ffffff"
              />
              <circle
                cx={146 + effectivePupilX * 0.7}
                cy={106.5 + effectivePupilY * 0.7}
                r="1.2"
                fill="#ffffff"
              />
              {/* Bottom eye line */}
              <path
                d="M 137 110 Q 143 113 151 111"
                stroke="#71717a"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        )}

        {/* Front Hair with Natural Bangs & Highlights */}
        <g id="companion-front-hair">
          {/* Top Volume */}
          <path
            d="M 72 90 C 70 50 90 35 120 35 C 150 35 170 50 168 90 C 160 62 145 48 120 48 C 95 48 80 62 72 90 Z"
            fill="#18181b"
          />
          {/* Gloss Highlight Band */}
          <path
            d="M 82 58 Q 120 49 158 58 Q 145 52 120 52 Q 95 52 82 58 Z"
            fill="#52525b"
            opacity="0.65"
          />
          {/* Left Bangs */}
          <path
            d="M 70 85 C 68 120 74 145 78 152 C 80 148 82 130 82 110 C 82 95 78 88 70 85 Z"
            fill="#18181b"
          />
          <path
            d="M 80 82 C 86 100 90 108 92 106 C 94 98 90 85 85 80 Z"
            fill="#27272a"
          />
          {/* Center Fringe Bangs */}
          <path
            d="M 88 75 C 98 96 104 102 106 101 C 108 92 102 78 95 72 Z"
            fill="#18181b"
          />
          <path
            d="M 103 72 C 114 97 122 104 124 102 C 126 92 120 76 112 70 Z"
            fill="#27272a"
          />
          <path
            d="M 122 71 C 132 96 140 101 142 99 C 143 90 136 76 128 70 Z"
            fill="#18181b"
          />
          {/* Right Bangs */}
          <path
            d="M 170 85 C 172 120 166 145 162 152 C 160 148 158 130 158 110 C 158 95 162 88 170 85 Z"
            fill="#18181b"
          />
          <path
            d="M 160 82 C 154 100 150 108 148 106 C 146 98 150 85 155 80 Z"
            fill="#27272a"
          />
        </g>

        {/* Cyan Hairpin Accessory */}
        <path d="M 74 74 L 84 66" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
        <path d="M 74 66 L 84 74" stroke="#082b59" strokeWidth="2.5" strokeLinecap="round" />

        {/* Thinking State Sparkle Cloud */}
        {isThoughtful && (
          <g className="animate-pulse">
            <circle cx="175" cy="50" r="3" fill="#38bdf8" />
            <circle cx="185" cy="40" r="5" fill="#0284c7" />
            <circle cx="198" cy="28" r="7" fill="#082b59" />
            <text x="194" y="32" fill="#ffffff" fontSize="8" fontWeight="bold">?</text>
          </g>
        )}
      </svg>
    </div>
  );
};
