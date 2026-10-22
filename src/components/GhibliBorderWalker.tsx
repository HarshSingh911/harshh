import React, { useState, useEffect, useRef } from 'react';

interface GhibliBorderWalkerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const GhibliBorderWalker: React.FC<GhibliBorderWalkerProps> = ({ containerRef }) => {
  // Position along the top border line in pixels
  const [posX, setPosX] = useState<number>(80);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [actionState, setActionState] = useState<'walking' | 'running' | 'happy' | 'idle' | 'spinning'>('walking');
  const [bubbleEmote, setBubbleEmote] = useState<string | null>(null);
  const [clickSparks, setClickSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Internal physics refs to avoid re-renders on every animation frame
  const stateRef = useRef({
    posX: 80,
    targetX: 80,
    isNear: false,
    patrolDir: 1, // 1 = right, -1 = left
    pauseUntil: 0,
    stepCycle: 0,
    isSpinning: false,
  });

  // Track cursor position relative to container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const margin = 90; // "aspas ya ander" (within 90px around the box)

      const isInsideOrNear =
        e.clientX >= rect.left - margin &&
        e.clientX <= rect.right + margin &&
        e.clientY >= rect.top - margin &&
        e.clientY <= rect.bottom + margin;

      stateRef.current.isNear = isInsideOrNear;

      if (isInsideOrNear) {
        // Clamp target X to sit safely within the border width
        const rawLocalX = e.clientX - rect.left;
        const clampedTarget = Math.max(35, Math.min(rect.width - 35, rawLocalX));
        stateRef.current.targetX = clampedTarget;
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [containerRef]);

  // Main 60fps Animation Loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const container = containerRef.current;
      if (!container) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const rect = container.getBoundingClientRect();
      const boxWidth = rect.width;
      const s = stateRef.current;

      if (s.isSpinning) {
        animId = requestAnimationFrame(tick);
        return;
      }

      if (s.isNear) {
        // CURSOR IS NEAR / INSIDE: Chase the cursor!
        const dx = s.targetX - s.posX;
        const dist = Math.abs(dx);

        if (dist > 12) {
          // Running gently and softly toward cursor ('thoda halke halke bhaage')
          const dir = dx > 0 ? 1 : -1;
          const chaseSpeed = Math.min(2.4, Math.max(0.9, dist * 0.045));
          s.posX += dir * chaseSpeed;
          s.stepCycle += 0.16;

          setFacing(dir > 0 ? 'right' : 'left');
          setActionState('running');
          setBubbleEmote('✨');
        } else {
          // Reached cursor! Happy hop & idle
          s.stepCycle = 0;
          setActionState('happy');
          setBubbleEmote('❤️');
        }
      } else {
        // IDLE STATE: Leisurely patrol along the top border line
        if (now < s.pauseUntil) {
          setActionState('idle');
          setBubbleEmote(null);
        } else {
          const minX = 35;
          const maxX = Math.max(minX + 80, boxWidth - 35);

          s.posX += s.patrolDir * 0.75; // gentle, relaxed walking pace
          s.stepCycle += 0.10;

          setFacing(s.patrolDir > 0 ? 'right' : 'left');
          setActionState('walking');
          setBubbleEmote(null);

          // Reached border limits: pause, look around, turn back
          if (s.posX >= maxX) {
            s.posX = maxX;
            s.patrolDir = -1;
            s.pauseUntil = now + 1600; // pause for 1.6s
            setActionState('idle');
          } else if (s.posX <= minX) {
            s.posX = minX;
            s.patrolDir = 1;
            s.pauseUntil = now + 1600;
            setActionState('idle');
          }
        }
      }

      setPosX(s.posX);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [containerRef]);

  // Interactive Click: Ghibli character giggles, spins 360°, and bursts hearts!
  const handleClickCharacter = (e: React.MouseEvent) => {
    e.stopPropagation();
    stateRef.current.isSpinning = true;
    setActionState('spinning');
    setBubbleEmote('🎵');

    // Create burst sparks
    const newSparks = [
      { id: Date.now() + 1, x: -16, y: -20 },
      { id: Date.now() + 2, x: 0, y: -28 },
      { id: Date.now() + 3, x: 16, y: -20 },
    ];
    setClickSparks(newSparks);

    setTimeout(() => {
      setClickSparks([]);
      stateRef.current.isSpinning = false;
      setActionState('happy');
    }, 700);
  };

  const isLeft = facing === 'left';
  const isMoving = actionState === 'walking' || actionState === 'running';

  return (
    <div
      style={{
        left: `${posX}px`,
        top: '-32px', // Paws walk directly on the top border line
        transform: `translateX(-50%)`,
      }}
      className="absolute z-40 select-none pointer-events-auto cursor-pointer group transition-transform duration-75"
      onClick={handleClickCharacter}
      title="Little Ghibli Spirit! Move your mouse or click me!"
    >
      {/* Little Emotion Emote Bubble */}
      {bubbleEmote && (
        <div
          className={`absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-white/95 border border-[#84532B]/50 shadow-xs text-[11px] leading-none pointer-events-none transition-all ${
            actionState === 'running' ? 'animate-bounce text-amber-500' : 'text-rose-500'
          }`}
        >
          {bubbleEmote}
        </div>
      )}

      {/* Click Sparkles Effect */}
      {clickSparks.map((spark) => (
        <span
          key={spark.id}
          style={{ transform: `translate(${spark.x}px, ${spark.y}px)` }}
          className="absolute top-0 left-1/2 text-xs pointer-events-none animate-ping text-pink-400"
        >
          🌸
        </span>
      ))}

      {/* The Animated Chibi-Totoro Character */}
      <div
        className={`relative transition-transform ${
          actionState === 'spinning'
            ? 'animate-spin'
            : actionState === 'happy'
            ? 'animate-bounce'
            : ''
        }`}
        style={{
          transform: `${isLeft ? 'scaleX(-1)' : 'scaleX(1)'} ${
            actionState === 'running' ? 'rotate(5deg)' : ''
          }`,
        }}
      >
        <svg
          width="40"
          height="44"
          viewBox="0 0 44 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_6px_rgba(132,83,43,0.25)]"
        >
          {/* Back Leaf Hat on head */}
          <g className={isMoving ? 'animate-pulse' : ''}>
            <path
              d="M22 14c-4-8-12-6-10-1 2 4 8 3 10 1z"
              fill="#22C55E"
              stroke="#15803D"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M22 14c2-4 5-6 8-4" stroke="#15803D" strokeWidth="1" strokeLinecap="round" />
            <circle cx="22" cy="14" r="1.5" fill="#15803D" />
          </g>

          {/* Ears */}
          <path
            d="M14 18C13 10 16 5 18 5s2 5 0 13"
            fill="#FFFDF8"
            stroke="#78350F"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M16 8c-0.5 3-0.5 6 0 8" stroke="#FBCFE8" strokeWidth="1.2" strokeLinecap="round" />

          <path
            d="M26 18c-1-8 2-13 4-13s2 5 0 13"
            fill="#FFFDF8"
            stroke="#78350F"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M28 8c0 3 0 6-0.5 8" stroke="#FBCFE8" strokeWidth="1.2" strokeLinecap="round" />

          {/* Round Body (Soft Pearlescent White) */}
          <ellipse
            cx="22"
            cy="29"
            rx="14"
            ry="14"
            fill="#FFFDF8"
            stroke="#78350F"
            strokeWidth="1.8"
          />

          {/* Fluffy tummy highlight */}
          <ellipse cx="22" cy="31" rx="10" ry="9" fill="#FFF9ED" />

          {/* Totoro tummy chevrons (tiny marks) */}
          <path d="M19 28l1.5-1.5L22 28M22 28l1.5-1.5L25 28" stroke="#A16207" strokeWidth="1" strokeLinecap="round" />
          <path d="M20.5 32l1.5-1.5L23.5 32" stroke="#A16207" strokeWidth="1" strokeLinecap="round" />

          {/* Eyes (Anime Ghibli style) */}
          {actionState === 'happy' ? (
            // Happy crescent eyes: ^ ^
            <g stroke="#451A03" strokeWidth="1.8" strokeLinecap="round">
              <path d="M16 23c1.5-2 3.5-2 5 0" />
              <path d="M23 23c1.5-2 3.5-2 5 0" />
            </g>
          ) : (
            // Wide curious round eyes
            <g>
              <circle cx="18" cy="22" r="3" fill="#FFFFFF" stroke="#78350F" strokeWidth="1.2" />
              <circle cx="18.5" cy="22" r="1.8" fill="#451A03" />
              <circle cx="19" cy="21.3" r="0.7" fill="#FFFFFF" />

              <circle cx="26" cy="22" r="3" fill="#FFFFFF" stroke="#78350F" strokeWidth="1.2" />
              <circle cx="26.5" cy="22" r="1.8" fill="#451A03" />
              <circle cx="27" cy="21.3" r="0.7" fill="#FFFFFF" />
            </g>
          )}

          {/* Tiny Cute Nose */}
          <circle cx="22" cy="23.5" r="0.9" fill="#78350F" />

          {/* Whisker dots / whiskers */}
          <circle cx="13" cy="24" r="0.6" fill="#78350F" />
          <circle cx="31" cy="24" r="0.6" fill="#78350F" />

          {/* Rosy Pink Blush Cheeks */}
          <circle cx="14" cy="26" r="2.2" fill="#F472B6" opacity="0.6" />
          <circle cx="30" cy="26" r="2.2" fill="#F472B6" opacity="0.6" />

          {/* Little Scampering Feet (soft gentle patter) */}
          <g>
            {/* Left foot */}
            <ellipse
              cx={isMoving ? 16 + Math.sin(Date.now() / 120) * 2.5 : 17}
              cy={isMoving ? 42 - Math.abs(Math.cos(Date.now() / 120)) * 1.8 : 42}
              rx="3"
              ry="2"
              fill="#FDE68A"
              stroke="#78350F"
              strokeWidth="1.2"
            />
            {/* Right foot */}
            <ellipse
              cx={isMoving ? 27 - Math.sin(Date.now() / 120) * 2.5 : 26}
              cy={isMoving ? 42 - Math.abs(Math.sin(Date.now() / 120)) * 1.8 : 42}
              rx="3"
              ry="2"
              fill="#FDE68A"
              stroke="#78350F"
              strokeWidth="1.2"
            />
          </g>

          {/* Tiny Tail */}
          <circle cx="9" cy="33" r="2.5" fill="#FFFDF8" stroke="#78350F" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
  );
};
