import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// ==========================================
// CUTE VECTOR PRODUCE ARTWORK (SVG)
// ==========================================

export const CuteTomatoSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="tomato-body" cx="36%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#ff7070" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="85%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </radialGradient>
      <linearGradient id="tomato-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#4d7c0f" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="30" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M50 24C33 24 20 37 20 54C20 73 34 85 50 85C66 85 80 73 80 54C80 37 67 24 50 24Z" fill="url(#tomato-body)" />
    <path d="M32 36C26 43 25 54 28 62C27 52 30 42 37 36C39 34 37 32 32 36Z" fill="#ffffff" fillOpacity="0.45" />
    <circle cx="36" cy="34" r="3" fill="#ffffff" fillOpacity="0.6" />
    <path d="M50 25C50 18 47 12 43 9C44 14 47 19 48 24Z" fill="#3f6212" />
    <path d="M50 24L56 16L53 23L64 21L55 26L62 31L53 28L52 35L48 28L42 33L46 26L36 24L46 22L43 16L50 24Z" fill="url(#tomato-leaf)" />
  </svg>
);

export const CuteCarrotSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="carrot-body" x1="20%" y1="20%" x2="80%" y2="80%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
      <linearGradient id="carrot-top" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#65a30d" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>
    </defs>
    <path d="M50 32C45 20 36 12 28 10C35 18 41 26 46 32Z" fill="url(#carrot-top)" />
    <path d="M50 30C50 15 52 8 50 4C54 11 54 20 52 30Z" fill="#4d7c0f" />
    <path d="M52 32C58 21 68 14 76 12C68 20 61 27 55 33Z" fill="url(#carrot-top)" />
    <path d="M38 34C35 34 33 37 34 40C37 54 44 76 48 92C49 95 53 95 54 92C58 76 65 54 68 40C69 37 67 34 64 34C55 35 47 35 38 34Z" fill="url(#carrot-body)" />
    <path d="M40 45C44 46 48 46 52 45" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
    <path d="M47 56C52 57 58 57 62 55" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
    <path d="M43 68C47 69 52 69 55 68" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
    <path d="M39 38C38 48 42 66 45 74" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.45" />
  </svg>
);

export const CutePotatoSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="potato-body" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#facc15" />
        <stop offset="65%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="85" rx="32" ry="7" fill="#000000" fillOpacity="0.09" />
    <path d="M26 48C24 33 36 22 52 22C68 22 80 30 80 46C80 64 70 78 52 78C32 78 28 64 26 48Z" fill="url(#potato-body)" />
    <path d="M35 38C37 38 39 40 37 41C35 41 34 39 35 38Z" fill="#713f12" fillOpacity="0.75" />
    <path d="M62 36C65 37 66 39 64 40C62 40 61 38 62 36Z" fill="#713f12" fillOpacity="0.75" />
    <path d="M44 58C47 59 48 61 46 62C44 62 43 60 44 58Z" fill="#713f12" fillOpacity="0.75" />
    <circle cx="50" cy="46" r="1.5" fill="#a16207" fillOpacity="0.6" />
    <circle cx="56" cy="52" r="1.2" fill="#a16207" fillOpacity="0.6" />
    <path d="M36 32C42 27 52 26 60 28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.4" />
  </svg>
);

export const CuteOnionSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="onion-body" cx="42%" cy="40%" r="62%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="35%" stopColor="#e11d48" />
        <stop offset="75%" stopColor="#9f1239" />
        <stop offset="100%" stopColor="#4c0519" />
      </radialGradient>
      <linearGradient id="onion-sprout" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#4d7c0f" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>
    </defs>
    <path d="M46 84C45 88 43 92 42 94" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M50 85C50 89 51 93 50 95" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M54 84C55 88 57 91 59 93" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M49 24C48 16 46 10 43 6C47 11 50 17 51 24Z" fill="url(#onion-sprout)" />
    <path d="M51 24C53 17 57 12 61 8C59 13 56 18 53 24Z" fill="#65a30d" />
    <path d="M50 22C32 28 20 45 20 60C20 74 34 85 50 85C66 85 80 74 80 60C80 45 68 28 50 22Z" fill="url(#onion-body)" />
    <path d="M38 29C29 40 28 66 38 79" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.25" fill="none" />
    <path d="M50 24C44 38 44 68 50 84" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
    <path d="M30 46C28 53 29 62 33 68" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.45" />
  </svg>
);

export const CuteAppleSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="apple-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="75%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="28" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M50 26C52 18 56 12 62 8C59 14 55 19 51 26Z" fill="#78350f" />
    <path d="M52 20C62 14 74 16 78 22C68 25 58 24 52 20Z" fill="#62ab00" />
    <path d="M50 32C42 24 24 24 22 44C20 62 34 82 50 84C66 82 80 62 78 44C76 24 58 24 50 32Z" fill="url(#apple-body)" />
    <path d="M32 38C26 46 26 56 29 64C28 54 30 44 38 38C40 36 37 34 32 38Z" fill="#ffffff" fillOpacity="0.45" />
    <circle cx="36" cy="36" r="2.8" fill="#ffffff" fillOpacity="0.6" />
  </svg>
);

export const CuteChiliSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chili-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4d4d" />
        <stop offset="40%" stopColor="#e11d48" />
        <stop offset="85%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    <path d="M36 22C32 15 28 10 21 8C27 12 31 16 35 23Z" fill="#4d7c0f" />
    <path d="M30 22C35 20 43 23 48 27C44 29 40 28 36 30C34 27 32 26 30 22Z" fill="#62ab00" />
    <path d="M34 26C45 28 55 35 62 46C70 58 72 72 67 84C64 90 56 94 51 92C55 86 58 76 56 66C52 52 42 40 33 34C31 31 31 28 34 26Z" fill="url(#chili-body)" />
    <path d="M40 32C48 38 56 48 60 60C62 67 62 74 59 80" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.45" />
  </svg>
);

export const CuteAvocadoSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="avocado-pit" cx="35%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#a16207" />
        <stop offset="45%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </radialGradient>
      <linearGradient id="avocado-flesh" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ecfccb" />
        <stop offset="70%" stopColor="#bef264" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>
    </defs>
    <path d="M50 14C38 14 30 28 26 44C20 64 28 86 50 86C72 86 80 64 74 44C70 28 62 14 50 14Z" fill="#14532d" />
    <path d="M50 19C40 19 33 30 30 45C25 62 32 81 50 81C68 81 75 62 70 45C67 30 60 19 50 19Z" fill="url(#avocado-flesh)" />
    <circle cx="50" cy="58" r="15" fill="url(#avocado-pit)" />
    <ellipse cx="46" cy="53" rx="3.5" ry="2" fill="#ffffff" fillOpacity="0.55" transform="rotate(-30 46 53)" />
  </svg>
);

export const CuteStrawberrySvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="berry-body" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="40%" stopColor="#f43f5e" />
        <stop offset="85%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#9f1239" />
      </radialGradient>
    </defs>
    <path d="M50 28C34 28 24 40 25 56C26 72 42 88 50 90C58 88 74 72 75 56C76 40 66 28 50 28Z" fill="url(#berry-body)" />
    <path d="M50 28L54 18L52 26L64 23L56 29L65 34L54 32L53 40L48 32L40 36L45 29L36 25L47 26L45 18L50 28Z" fill="#62ab00" />
    <path d="M50 24C50 16 48 10 44 8" stroke="#3f6212" strokeWidth="2" strokeLinecap="round" />
    <circle cx="42" cy="42" r="1.5" fill="#fef08a" />
    <circle cx="58" cy="43" r="1.5" fill="#fef08a" />
    <circle cx="50" cy="50" r="1.5" fill="#fef08a" />
    <circle cx="36" cy="56" r="1.5" fill="#fef08a" />
    <circle cx="64" cy="56" r="1.5" fill="#fef08a" />
    <circle cx="44" cy="65" r="1.5" fill="#fef08a" />
    <circle cx="56" cy="65" r="1.5" fill="#fef08a" />
    <circle cx="50" cy="76" r="1.5" fill="#fef08a" />
    <path d="M32 40C28 47 28 55 31 62" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
  </svg>
);

// NEW CUTE PRODUCE SVGS

export const CuteBroccoliSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="broccoli-stem" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#84cc16" />
        <stop offset="50%" stopColor="#a3e635" />
        <stop offset="100%" stopColor="#65a30d" />
      </linearGradient>
      <radialGradient id="broccoli-head" cx="40%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="40%" stopColor="#22c55e" />
        <stop offset="75%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#14532d" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="26" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M42 52L40 85C40 88 60 88 60 85L58 52Z" fill="url(#broccoli-stem)" />
    <path d="M47 62C47 70 48 78 47 84" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" />
    <circle cx="34" cy="46" r="14" fill="url(#broccoli-head)" />
    <circle cx="66" cy="46" r="14" fill="url(#broccoli-head)" />
    <circle cx="50" cy="36" r="17" fill="url(#broccoli-head)" />
    <circle cx="36" cy="30" r="13" fill="url(#broccoli-head)" />
    <circle cx="64" cy="30" r="13" fill="url(#broccoli-head)" />
    <circle cx="50" cy="22" r="12" fill="url(#broccoli-head)" />
    <path d="M42 22C46 18 54 18 58 22" stroke="#bbf7d0" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
    <circle cx="34" cy="26" r="2" fill="#ffffff" fillOpacity="0.5" />
    <circle cx="62" cy="26" r="2" fill="#ffffff" fillOpacity="0.5" />
  </svg>
);

export const CuteEggplantSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="eggplant-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="35%" stopColor="#9333ea" />
        <stop offset="75%" stopColor="#6b21a8" />
        <stop offset="100%" stopColor="#3b0764" />
      </radialGradient>
      <linearGradient id="eggplant-calyx" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#4d7c0f" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="26" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M46 26C38 32 30 52 30 68C30 82 40 88 52 88C66 88 74 78 72 64C70 48 58 28 50 24Z" fill="url(#eggplant-body)" />
    <path d="M48 24C46 16 42 12 36 10C40 14 44 19 46 24Z" fill="#3f6212" stroke="#3f6212" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M48 22L42 32L47 30L44 38L50 33L54 39L55 31L62 33L54 26Z" fill="url(#eggplant-calyx)" />
    <path d="M38 45C34 54 34 68 40 76" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.45" />
    <circle cx="43" cy="38" r="2.5" fill="#ffffff" fillOpacity="0.55" />
  </svg>
);

export const CuteCornSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="corn-cob" x1="20%" y1="20%" x2="80%" y2="80%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#facc15" />
        <stop offset="80%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <linearGradient id="corn-husk-l" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4d7c0f" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>
      <linearGradient id="corn-husk-r" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#3f6212" />
        <stop offset="100%" stopColor="#65a30d" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="24" ry="5" fill="#000000" fillOpacity="0.10" />
    <path d="M38 32C38 18 62 18 62 32C64 48 64 68 58 84C55 88 45 88 42 84C36 68 36 48 38 32Z" fill="url(#corn-cob)" />
    <path d="M42 34C46 35 54 35 58 34M40 44C45 45 55 45 60 44M39 54C45 55 55 55 61 54M40 64C46 65 54 65 60 64M42 74C46 75 54 75 58 74" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M46 26V80M54 26V80" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 3" />
    <path d="M34 84C28 66 30 46 24 38C32 46 36 64 42 84Z" fill="url(#corn-husk-l)" />
    <path d="M66 84C72 66 70 46 76 38C68 46 64 64 58 84Z" fill="url(#corn-husk-r)" />
    <path d="M44 26C42 36 43 52 45 64" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.45" />
  </svg>
);

export const CuteLemonSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="lemon-body" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="35%" stopColor="#fde047" />
        <stop offset="75%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
      <linearGradient id="lemon-leaf" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4d7c0f" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="28" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M50 22C46 14 36 10 30 12C32 18 40 24 50 22Z" fill="url(#lemon-leaf)" />
    <path d="M50 22C52 18 55 14 60 12" stroke="#3f6212" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 20C66 22 82 34 82 54C82 74 66 84 50 84C34 84 18 74 18 54C18 34 34 22 50 20Z" fill="url(#lemon-body)" />
    <path d="M82 54C86 54 88 52 86 50C84 52 83 53 82 54Z" fill="#ca8a04" />
    <path d="M18 54C14 54 12 52 14 50C16 52 17 53 18 54Z" fill="#ca8a04" />
    <path d="M34 34C28 42 27 54 31 64" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
    <circle cx="38" cy="34" r="2.5" fill="#ffffff" fillOpacity="0.65" />
  </svg>
);

export const CuteBellPepperSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="pepper-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#fed7aa" />
        <stop offset="30%" stopColor="#fb923c" />
        <stop offset="75%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </radialGradient>
      <linearGradient id="pepper-stem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#4d7c0f" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="28" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M50 25C48 16 54 10 50 6C56 10 56 18 52 25Z" fill="url(#pepper-stem)" />
    <path d="M28 32C22 42 22 72 32 82C38 88 48 88 50 82C52 88 62 88 68 82C78 72 78 42 72 32C66 22 56 26 50 26C44 26 34 22 28 32Z" fill="url(#pepper-body)" />
    <path d="M38 32C42 46 42 68 38 78" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M62 32C58 46 58 68 62 78" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M30 38C26 46 26 58 30 68" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.45" />
    <circle cx="35" cy="36" r="2.5" fill="#ffffff" fillOpacity="0.6" />
  </svg>
);

export const CuteMushroomSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="mush-cap" cx="42%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="80%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </radialGradient>
      <linearGradient id="mush-stem" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="28" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M40 52C38 68 36 82 42 86C46 88 54 88 58 86C64 82 62 68 60 52Z" fill="url(#mush-stem)" />
    <path d="M48 62C48 70 48 78 48 84" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
    <path d="M50 20C26 20 16 42 16 54C16 58 84 58 84 54C84 42 74 20 50 20Z" fill="url(#mush-cap)" />
    <ellipse cx="34" cy="34" rx="5" ry="4" fill="#ffffff" fillOpacity="0.85" />
    <ellipse cx="62" cy="32" rx="6" ry="4.5" fill="#ffffff" fillOpacity="0.85" />
    <circle cx="50" cy="42" r="4" fill="#ffffff" fillOpacity="0.85" />
    <circle cx="24" cy="48" r="3" fill="#ffffff" fillOpacity="0.75" />
    <circle cx="74" cy="48" r="3" fill="#ffffff" fillOpacity="0.75" />
    <path d="M38 24C44 22 56 22 64 24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
  </svg>
);

export const CuteOrangeSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="orange-body" cx="36%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#fed7aa" />
        <stop offset="30%" stopColor="#fb923c" />
        <stop offset="75%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </radialGradient>
      <linearGradient id="orange-leaf" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4d7c0f" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="28" ry="6" fill="#000000" fillOpacity="0.10" />
    <path d="M50 26C52 18 58 12 66 10C64 16 60 22 52 26Z" fill="url(#orange-leaf)" />
    <path d="M50 26C44 20 38 18 32 18C34 24 40 28 48 26Z" fill="#65a30d" />
    <circle cx="50" cy="26" r="2.5" fill="#78350f" />
    <circle cx="50" cy="56" r="30" fill="url(#orange-body)" />
    <path d="M32 42C26 50 26 62 30 70" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeOpacity="0.45" />
    <circle cx="36" cy="40" r="2.5" fill="#ffffff" fillOpacity="0.6" />
    <circle cx="62" cy="50" r="1.2" fill="#c2410c" fillOpacity="0.5" />
    <circle cx="58" cy="64" r="1.2" fill="#c2410c" fillOpacity="0.5" />
  </svg>
);

export const CuteGrapeSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="grape-berry" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#e9d5ff" />
        <stop offset="35%" stopColor="#c084fc" />
        <stop offset="75%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#581c87" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="24" ry="5" fill="#000000" fillOpacity="0.10" />
    <path d="M50 22C48 15 45 10 40 6" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 20C58 14 66 16 68 22C60 24 54 22 50 20Z" fill="#84cc16" />
    <circle cx="40" cy="32" r="9" fill="url(#grape-berry)" />
    <circle cx="58" cy="32" r="9" fill="url(#grape-berry)" />
    <circle cx="32" cy="46" r="9" fill="url(#grape-berry)" />
    <circle cx="50" cy="45" r="9.5" fill="url(#grape-berry)" />
    <circle cx="68" cy="46" r="9" fill="url(#grape-berry)" />
    <circle cx="41" cy="59" r="9" fill="url(#grape-berry)" />
    <circle cx="59" cy="59" r="9" fill="url(#grape-berry)" />
    <circle cx="50" cy="71" r="8.5" fill="url(#grape-berry)" />
    <circle cx="50" cy="81" r="6.5" fill="url(#grape-berry)" />
    <circle cx="38" cy="29" r="2" fill="#ffffff" fillOpacity="0.6" />
    <circle cx="48" cy="42" r="2.2" fill="#ffffff" fillOpacity="0.6" />
    <circle cx="39" cy="56" r="1.8" fill="#ffffff" fillOpacity="0.6" />
  </svg>
);

// ==========================================
// SINGLE FLOATING ITEM — click wiggle + tooltip
// ==========================================

interface FloatingItemProps {
  name: string;
  tagline: string;
  animClass: string;
  delay?: string;
  size?: string;
  tooltipDir?: 'left' | 'right';
  children: React.ReactNode;
}

const FloatingItem: React.FC<FloatingItemProps> = ({
  name,
  tagline,
  animClass,
  delay = '0s',
  size = 'w-14 h-14',
  tooltipDir = 'right',
  children,
}) => {
  const [wiggling, setWiggling] = useState(false);

  const handleClick = () => {
    setWiggling(true);
    setTimeout(() => setWiggling(false), 650);
  };

  const tooltipClass =
    tooltipDir === 'right'
      ? 'left-full ml-3'
      : 'right-full mr-3';

  return (
    <div className="relative group select-none">
      <div
        onClick={handleClick}
        className={[
          animClass,
          wiggling ? 'animate-veggie-wiggle' : '',
          'transition-transform duration-300 hover:scale-125 cursor-pointer',
          'filter drop-shadow-md hover:drop-shadow-xl',
          size,
        ].join(' ')}
        style={{ animationDelay: delay }}
        title={name}
      >
        {children}
      </div>

      {/* Tooltip */}
      <div
        className={[
          'absolute top-1/2 -translate-y-1/2 pointer-events-none z-50',
          'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100',
          'transition-all duration-200 whitespace-nowrap',
          'bg-white border border-emerald-100 shadow-xl rounded-xl px-3 py-1.5',
          tooltipClass,
        ].join(' ')}
      >
        <p className="text-xs font-bold text-[#203a27] leading-tight">{name}</p>
        <p className="text-[10px] text-[#62ab00] font-medium leading-tight">{tagline}</p>
      </div>
    </div>
  );
};

// ==========================================
// PRODUCE CATALOG FOR SCROLLING GUTTERS
// ==========================================

interface ProduceTemplate {
  name: string;
  tagline: string;
  svg: React.ReactNode;
}

const LEFT_PRODUCE_POOL: ProduceTemplate[] = [
  {
    name: 'Roma Tomato',
    tagline: '100% Organic & Juicy',
    svg: <CuteTomatoSvg className="w-full h-full" />,
  },
  {
    name: 'Fresh Broccoli',
    tagline: 'Farm Fresh & Crunchy',
    svg: <CuteBroccoliSvg className="w-full h-full" />,
  },
  {
    name: 'Honey Apple',
    tagline: 'Crisp & Orchard-Fresh',
    svg: <CuteAppleSvg className="w-full h-full" />,
  },
  {
    name: 'Golden Sweetcorn',
    tagline: 'Sweet & Sun-Basked',
    svg: <CuteCornSvg className="w-full h-full" />,
  },
  {
    name: 'Hass Avocado',
    tagline: 'Nutrient-Rich Superfood',
    svg: <CuteAvocadoSvg className="w-full h-full" />,
  },
  {
    name: 'Royal Eggplant',
    tagline: 'Tender & Glossy',
    svg: <CuteEggplantSvg className="w-full h-full" />,
  },
  {
    name: 'Garden Chili',
    tagline: 'Handpicked & Vibrant',
    svg: <CuteChiliSvg className="w-full h-full" />,
  },
  {
    name: 'Ripe Orange',
    tagline: 'Packed with Vitamin C',
    svg: <CuteOrangeSvg className="w-full h-full" />,
  },
];

const RIGHT_PRODUCE_POOL: ProduceTemplate[] = [
  {
    name: 'Sweet Carrot',
    tagline: 'Crisp Earth Goodness',
    svg: <CuteCarrotSvg className="w-full h-full" />,
  },
  {
    name: 'Sunshine Lemon',
    tagline: 'Zesty & Refreshing',
    svg: <CuteLemonSvg className="w-full h-full" />,
  },
  {
    name: 'Golden Potato',
    tagline: 'Naturally Farm-Grown',
    svg: <CutePotatoSvg className="w-full h-full" />,
  },
  {
    name: 'Crisp Bell Pepper',
    tagline: 'Crunchy & Sweet',
    svg: <CuteBellPepperSvg className="w-full h-full" />,
  },
  {
    name: 'Farm Onion',
    tagline: 'Aromatic & Organic',
    svg: <CuteOnionSvg className="w-full h-full" />,
  },
  {
    name: 'Woodland Mushroom',
    tagline: 'Earthy & Savory',
    svg: <CuteMushroomSvg className="w-full h-full" />,
  },
  {
    name: 'Sweet Strawberry',
    tagline: 'Sun-Ripened Sweetness',
    svg: <CuteStrawberrySvg className="w-full h-full" />,
  },
  {
    name: 'Royal Table Grapes',
    tagline: 'Bursting with Flavor',
    svg: <CuteGrapeSvg className="w-full h-full" />,
  },
];

// ==========================================
// MAIN EXPORT — Natural scroll-with-page gutters
// ==========================================

/**
 * Renders left and right gutter produce that SCROLL NATURALLY WITH THE PAGE.
 * When the user scrolls down, existing items scroll up and exit the screen,
 * and NEW items appear continuously down the entire height of the document!
 *
 * Items are arranged in an alternating zigzag pattern with organic floats.
 */
export const FloatingProduceGutters: React.FC = () => {
  const asideRef = useRef<HTMLElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    const updateHeight = () => {
      if (asideRef.current) {
        const parent = asideRef.current.parentElement;
        const h = parent ? parent.clientHeight : asideRef.current.clientHeight;
        if (h > 0) {
          setContentHeight(h);
        }
      }
    };

    updateHeight();

    const parent = asideRef.current?.parentElement;
    let ro: ResizeObserver | null = null;
    if (parent) {
      ro = new ResizeObserver(() => {
        updateHeight();
      });
      ro.observe(parent);
    }

    window.addEventListener('resize', updateHeight);

    const t1 = setTimeout(updateHeight, 100);
    const t2 = setTimeout(updateHeight, 500);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateHeight);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location.pathname]);

  // Spacing between items down the content:
  const ITEM_SPACING = 360;
  const START_TOP = 40;       // start near top of main content
  const BOTTOM_BUFFER = 60;   // keep strictly above footer
  const availableHeight = Math.max(0, contentHeight - START_TOP - BOTTOM_BUFFER);
  const itemCount = Math.max(1, Math.floor(availableHeight / ITEM_SPACING));

  // Build Left side items (alternating zigzag: outer edge <-> inward)
  const leftFloatClasses = ['animate-float-left-1', 'animate-float-left-2', 'animate-float-left-3'];
  const leftItems = Array.from({ length: itemCount }, (_, i) => {
    const template = LEFT_PRODUCE_POOL[i % LEFT_PRODUCE_POOL.length];
    const topPx = START_TOP + i * ITEM_SPACING;
    const isEven = i % 2 === 0;
    const leftPct = isEven ? '10%' : '64%'; // zigzag
    const animClass = leftFloatClasses[i % leftFloatClasses.length];
    const delay = `${((i * 0.8) % 4).toFixed(1)}s`;

    return {
      ...template,
      key: `left-${template.name}-${i}`,
      topPx,
      leftPct,
      animClass,
      delay,
    };
  });

  // Build Right side items (alternating zigzag: inward <-> outer edge)
  const rightFloatClasses = ['animate-float-right-1', 'animate-float-right-2', 'animate-float-right-3'];
  const rightItems = Array.from({ length: itemCount }, (_, i) => {
    const template = RIGHT_PRODUCE_POOL[i % RIGHT_PRODUCE_POOL.length];
    const topPx = START_TOP + i * ITEM_SPACING;
    const isEven = i % 2 === 0;
    const leftPct = isEven ? '58%' : '8%'; // zigzag (from right column)
    const animClass = rightFloatClasses[i % rightFloatClasses.length];
    const delay = `${((i * 1.1) % 4.5).toFixed(1)}s`;

    return {
      ...template,
      key: `right-${template.name}-${i}`,
      topPx,
      leftPct,
      animClass,
      delay,
    };
  });

  return (
    <aside
      ref={asideRef}
      aria-label="Decorative organic produce"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 hidden xl:block overflow-hidden"
    >
      {/* ——— LEFT GUTTER ——— */}
      <div className="absolute left-0 top-0 bottom-0 w-24 2xl:w-28">
        {leftItems.map((item) => (
          <div
            key={item.key}
            className="absolute pointer-events-auto"
            style={{ top: `${item.topPx}px`, left: item.leftPct }}
          >
            <FloatingItem
              name={item.name}
              tagline={item.tagline}
              animClass={item.animClass}
              delay={item.delay}
              size="w-14 h-14"
              tooltipDir="right"
            >
              {item.svg}
            </FloatingItem>
          </div>
        ))}
      </div>

      {/* ——— RIGHT GUTTER ——— */}
      <div className="absolute right-0 top-0 bottom-0 w-24 2xl:w-28">
        {rightItems.map((item) => (
          <div
            key={item.key}
            className="absolute pointer-events-auto"
            style={{ top: `${item.topPx}px`, left: item.leftPct }}
          >
            <FloatingItem
              name={item.name}
              tagline={item.tagline}
              animClass={item.animClass}
              delay={item.delay}
              size="w-14 h-14"
              tooltipDir="left"
            >
              {item.svg}
            </FloatingItem>
          </div>
        ))}
      </div>
    </aside>
  );
};

export const HeroEdgeVeggieAccents: React.FC = () => null;
