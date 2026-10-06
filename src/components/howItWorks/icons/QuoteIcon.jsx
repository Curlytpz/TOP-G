import { useId } from "react";

function QuoteIcon({ className = "", size = 112 }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 160 130" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-paper`} x1="45" y1="19" x2="111" y2="111" gradientUnits="userSpaceOnUse"><stop stopColor="var(--hiw-icon-paper)" /><stop offset=".7" stopColor="var(--hiw-icon-paper-deep)" /><stop offset="1" stopColor="var(--hiw-icon-steel-light)" /></linearGradient>
        <linearGradient id={`${id}-pen`} x1="106" y1="84" x2="135" y2="108" gradientUnits="userSpaceOnUse"><stop stopColor="var(--hiw-icon-red-light)" /><stop offset=".55" stopColor="var(--hiw-icon-red)" /><stop offset="1" stopColor="var(--hiw-icon-graphite)" /></linearGradient>
        <filter id={`${id}-soft`} x="-35%" y="-30%" width="180%" height="180%"><feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="var(--hiw-icon-shadow)" /></filter>
      </defs>
      <g filter={`url(#${id}-soft)`}>
        <path d="M42 18h55l20 20v67c0 6-4 10-10 10H42c-6 0-10-4-10-10V28c0-6 4-10 10-10Z" fill={`url(#${id}-paper)`} />
        <path d="M97 18v16c0 4 3 7 7 7h13" fill="var(--hiw-icon-steel-light)" /><path d="m97 18 20 20" stroke="var(--hiw-icon-highlight)" strokeWidth="2" />
        <path d="M48 50h46M48 62h38M48 74h31" stroke="var(--hiw-icon-graphite)" strokeLinecap="round" strokeOpacity=".56" strokeWidth="4" />
        <path d="M48 88h24" stroke="var(--hiw-icon-red-light)" strokeLinecap="round" strokeWidth="4" />
        <circle cx="94" cy="86" r="13" fill="var(--hiw-icon-red)" /><path d="m88 86 4 4 8-9" stroke="var(--hiw-icon-highlight)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <g transform="rotate(-39 119 99)"><rect x="113" y="77" width="12" height="43" rx="6" fill={`url(#${id}-pen)`} /><path d="M119 75v8" stroke="var(--hiw-icon-highlight)" strokeLinecap="round" strokeWidth="3" /><path d="m113 120 6 8 6-8" fill="var(--hiw-icon-graphite)" /></g>
        <path d="M41 29c11-7 29-8 41-4" stroke="var(--hiw-icon-highlight)" strokeLinecap="round" strokeOpacity=".65" strokeWidth="3" />
      </g>
    </svg>
  );
}

export default QuoteIcon;