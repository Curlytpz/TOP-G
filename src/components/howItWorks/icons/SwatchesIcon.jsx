import { useId } from "react";

function SwatchesIcon({ className = "", size = 112 }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 160 130" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-red`} x1="29" y1="35" x2="92" y2="111" gradientUnits="userSpaceOnUse"><stop stopColor="var(--hiw-icon-red-light)" /><stop offset="1" stopColor="var(--hiw-icon-red-deep)" /></linearGradient>
        <linearGradient id={`${id}-weave`} x1="55" y1="24" x2="112" y2="105" gradientUnits="userSpaceOnUse"><stop stopColor="var(--hiw-icon-steel-light)" /><stop offset="1" stopColor="var(--hiw-icon-steel)" /></linearGradient>
        <linearGradient id={`${id}-dark`} x1="78" y1="22" x2="136" y2="99" gradientUnits="userSpaceOnUse"><stop stopColor="var(--hiw-icon-graphite-light)" /><stop offset="1" stopColor="var(--hiw-icon-graphite)" /></linearGradient>
        <filter id={`${id}-soft`} x="-30%" y="-25%" width="170%" height="170%"><feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="var(--hiw-icon-shadow)" /></filter>
      </defs>
      <g filter={`url(#${id}-soft)`}>
        <g transform="rotate(-16 58 73)"><rect x="27" y="33" width="58" height="75" rx="10" fill={`url(#${id}-red)`} /><path d="M34 43c15-7 33-8 44-2" stroke="var(--hiw-icon-highlight)" strokeLinecap="round" strokeOpacity=".55" strokeWidth="4" /><path d="M34 96h43" stroke="var(--hiw-icon-red-deep)" strokeWidth="2" /></g>
        <g transform="rotate(-2 82 66)"><rect x="52" y="21" width="60" height="80" rx="10" fill={`url(#${id}-weave)`} /><path d="m61 36 42 51M75 27l30 37M57 55l37 45" stroke="var(--hiw-icon-highlight)" strokeOpacity=".45" strokeWidth="2" /><path d="m60 29 44 60" stroke="var(--hiw-icon-graphite)" strokeDasharray="3 3" strokeOpacity=".6" strokeWidth="2" /></g>
        <g transform="rotate(13 105 64)"><rect x="82" y="26" width="54" height="74" rx="10" fill={`url(#${id}-dark)`} /><path d="M91 39c12-7 27-6 37 1" stroke="var(--hiw-icon-highlight)" strokeLinecap="round" strokeOpacity=".5" strokeWidth="3" /><path d="M91 80h35" stroke="var(--hiw-icon-red-light)" strokeDasharray="3 3" strokeWidth="2" /></g>
        <circle cx="54" cy="101" r="4" fill="var(--hiw-icon-highlight)" /><circle cx="120" cy="91" r="3" fill="var(--hiw-icon-red-light)" />
      </g>
    </svg>
  );
}

export default SwatchesIcon;