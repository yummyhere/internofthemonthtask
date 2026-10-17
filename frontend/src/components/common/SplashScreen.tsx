import React, { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onDone }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 3000);
    const t2 = setTimeout(() => onDone(), 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`sp-root${leaving ? ' sp-leaving' : ''}`}>
      {/* ── All splash-scoped styles ── */}
      <style>{`
        /* ── Layout ── */
        .sp-root {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background-color: #ffffff;
          background-image:
            repeating-linear-gradient(
              0deg, transparent 0px, transparent 18px,
              rgba(142,198,138,0.15) 18px, rgba(142,198,138,0.15) 36px
            ),
            repeating-linear-gradient(
              90deg, transparent 0px, transparent 18px,
              rgba(142,198,138,0.15) 18px, rgba(142,198,138,0.15) 36px
            );
          animation: spIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sp-leaving {
          animation: spOut 0.65s cubic-bezier(0.22,1,0.36,1) forwards !important;
        }

        /* ── Enter / Leave ── */
        @keyframes spIn {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.94); }
        }

        /* ── Tomato bobs gently ── */
        .sp-char {
          filter: drop-shadow(0 18px 28px rgba(220,38,38,0.22));
          animation: spBob 2.2s ease-in-out infinite;
        }
        @keyframes spBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-12px); }
        }

        /* ── Eyes blink ── */
        .sp-eye {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: spBlink 3.2s ease-in-out infinite;
        }
        @keyframes spBlink {
          0%,  80%, 100% { transform: scaleY(1); }
          85%, 88%       { transform: scaleY(0.06); }
          92%            { transform: scaleY(1.1); }
        }

        /* ── Left pupil looks around ── */
        .sp-pupil-l {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: spLookL 3.2s ease-in-out infinite;
        }
        @keyframes spLookL {
          0%,  12%  { transform: translate(0px, 0px); }
          22%,  38% { transform: translate(-6px, 1px); }  /* look left */
          48%,  60% { transform: translate(0px, 0px); }
          70%,  78% { transform: translate(5px, 1px); }   /* look right */
          88%, 100% { transform: translate(0px, 0px); }
        }

        /* ── Right pupil (slightly offset phase) ── */
        .sp-pupil-r {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: spLookR 3.2s ease-in-out infinite;
        }
        @keyframes spLookR {
          0%,  12%  { transform: translate(0px, 0px); }
          22%,  38% { transform: translate(-6px, 1px); }
          48%,  60% { transform: translate(0px, 0px); }
          70%,  78% { transform: translate(5px, 1px); }
          88%, 100% { transform: translate(0px, 0px); }
        }

        /* ── Brand ── */
        .sp-brand {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem; font-weight: 800;
          color: #203a27; letter-spacing: -0.025em;
          margin-top: 1.4rem;
          animation: spFadeUp 0.55s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sp-brand em { color: #62ab00; font-style: normal; }

        .sp-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          color: #5a7a5f; margin-top: 0.3rem; margin-bottom: 1.5rem;
          animation: spFadeUp 0.55s 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes spFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Bouncing dots ── */
        .sp-dots {
          display: flex; gap: 7px;
          animation: spFadeUp 0.55s 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sp-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #62ab00;
          animation: spDot 1.1s ease-in-out infinite;
        }
        .sp-dot:nth-child(2) { animation-delay: 0.18s; }
        .sp-dot:nth-child(3) { animation-delay: 0.36s; }
        @keyframes spDot {
          0%,100% { transform: translateY(0);   opacity: 0.45; }
          50%     { transform: translateY(-9px); opacity: 1;   }
        }
      `}</style>

      {/* ── Cute Tomato Character ── */}
      <svg
        className="sp-char"
        viewBox="0 0 160 175"
        width="230"
        height="251"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="spBodyG" cx="36%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="#ff8888" />
            <stop offset="28%"  stopColor="#ef4444" />
            <stop offset="70%"  stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </radialGradient>
          <radialGradient id="spSpecG" cx="28%" cy="25%" r="52%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="80" cy="166" rx="48" ry="9" fill="#000" fillOpacity="0.09" />

        {/* ── Body ── */}
        <path
          d="M80 32C50 32 24 56 24 88C24 124 50 158 80 158C110 158 136 124 136 88C136 56 110 32 80 32Z"
          fill="url(#spBodyG)"
        />
        {/* Specular gloss layer */}
        <path
          d="M80 32C50 32 24 56 24 88C24 124 50 158 80 158C110 158 136 124 136 88C136 56 110 32 80 32Z"
          fill="url(#spSpecG)"
        />

        {/* ── Calyx (green star cap) ── */}
        {/* Center calyx */}
        <circle cx="80" cy="33" r="5" fill="#3f6212" />
        {/* 5 petals fanning out */}
        <path d="M80 33 L82 18 L80 28 L78 18 Z" fill="#62ab00" />
        <path d="M80 33 L96 22 L83 30 L94 26 Z" fill="#62ab00" />
        <path d="M80 33 L90 46 L80 36 L88 48 Z" fill="#4d7c0f" />
        <path d="M80 33 L70 46 L80 36 L72 48 Z" fill="#4d7c0f" />
        <path d="M80 33 L64 22 L77 30 L66 26 Z" fill="#62ab00" />
        {/* Stem */}
        <path d="M80 33C79 24 77 17 74 12C77 18 80 24 81 33Z" fill="#3f6212" />

        {/* ── LEFT EYE ── */}
        <g className="sp-eye">
          {/* Sclera white */}
          <circle cx="61" cy="102" r="16" fill="white" />
          <circle cx="61" cy="102" r="16" fill="none" stroke="#e0e0e0" strokeWidth="0.8"/>
          {/* Pupil (moves left/right) */}
          <circle className="sp-pupil-l" cx="61" cy="102" r="9" fill="#111111" />
          {/* Tiny shine dot */}
          <circle cx="55.5" cy="96.5" r="3.5" fill="white" />
          <circle cx="57" cy="97.5" r="1.2" fill="white" fillOpacity="0.6" />
        </g>

        {/* ── RIGHT EYE ── */}
        <g className="sp-eye">
          {/* Sclera white */}
          <circle cx="91" cy="102" r="16" fill="white" />
          <circle cx="91" cy="102" r="16" fill="none" stroke="#e0e0e0" strokeWidth="0.8"/>
          {/* Pupil (moves left/right) */}
          <circle className="sp-pupil-r" cx="91" cy="102" r="9" fill="#111111" />
          {/* Tiny shine dot */}
          <circle cx="85.5" cy="96.5" r="3.5" fill="white" />
          <circle cx="87" cy="97.5" r="1.2" fill="white" fillOpacity="0.6" />
        </g>

        {/* ── Rosy cheeks ── */}
        <ellipse cx="40" cy="120" rx="12" ry="8" fill="#f87171" fillOpacity="0.30" />
        <ellipse cx="120" cy="120" rx="12" ry="8" fill="#f87171" fillOpacity="0.30" />

        {/* ── Big gloss highlight (top-left) ── */}
        <path
          d="M40 56C34 66 31 78 33 92"
          stroke="white" strokeWidth="5"
          strokeLinecap="round" strokeOpacity="0.48"
        />
        <ellipse
          cx="42" cy="50" rx="6" ry="5"
          fill="white" fillOpacity="0.48"
          transform="rotate(-25 42 50)"
        />
      </svg>

      {/* ── Brand ── */}
      <p className="sp-brand">
        Vegist<em>*</em>
      </p>
      <p className="sp-sub">Harvesting your freshness…</p>

      {/* ── Loading dots ── */}
      <div className="sp-dots">
        <div className="sp-dot" />
        <div className="sp-dot" />
        <div className="sp-dot" />
      </div>
    </div>
  );
};
