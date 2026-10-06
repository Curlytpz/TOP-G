import { useId } from 'react';

export default function VehicleIcon({ size = 112, className = '' }) {
  const u = useId().replace(/:/g, '');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
    <defs>
    <linearGradient id={`${u}body`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff5a5f"/><stop offset=".3" stopColor="#e31b23"/><stop offset=".75" stopColor="#a50f16"/><stop offset="1" stopColor="#5e0810"/></linearGradient>
    <linearGradient id={`${u}glass`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a6272"/><stop offset=".5" stopColor="#181b22"/><stop offset="1" stopColor="#0a0b0e"/></linearGradient>
    <radialGradient id={`${u}rim`} cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#f6f6f8"/><stop offset=".55" stopColor="#a3a7b0"/><stop offset="1" stopColor="#50545c"/></radialGradient>
    <filter id={`${u}blur`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>
    <ellipse cx="64" cy="103" rx="56" ry="4.5" style={{ fill: 'var(--icon-shadow, rgba(0,0,0,.4))' }} filter={`url(#${u}blur)`}/>
    <path d="M12 70 L13.5 70 L14.5 78 L12.5 78 Z M24 68 L25.5 68 L26 74 L24.5 74 Z" fill="#1b1c21"/>
    <path d="M5 68 Q15 66 30 66.5 L30 70 Q15 69.5 5 71 Z" fill="#26272d"/>
    <path d="M5 68 Q15 66 30 66.5" stroke="#8a8d97" strokeWidth="1" fill="none" opacity=".7"/>
    <path d="M8 91 L7 82 Q7 77 13 75 L32 69 Q44 65 54 58 Q58 54 64 53 L78 53 Q84 53 89 57 L98 64 L119 70 Q125 72 126 79 L127 88 Q127 91 123 91 Z" fill={`url(#${u}body)`}/>
    <path d="M7 85 L127 85 L127 88 Q127 91 123 91 L8 91 Z" fill="#000" opacity=".3"/>
    <path d="M45 69 Q54 64 59.5 58 Q61.5 56 65 56 L77 56 Q81 56 84 59 L92 66 Z" fill={`url(#${u}glass)`}/>
    <path d="M69 56 L69 67" stroke="#c8141b" strokeWidth="2.2"/>
    <path d="M62 57 L67 57 L58 65 L52 66 Z" fill="#fff" opacity=".13"/>
    <path d="M78 73 L91 75 L89 83 L78 81 Z" fill="#14151a"/>
    <path d="M80 76 L89 77.2 M79.6 78.6 L88.4 79.8" stroke="#3a3c45" strokeWidth="1" />
    <path d="M48 70 L48 85 M75 68 L75 72" stroke="#6e0910" strokeWidth="1.2" opacity=".7" fill="none"/>
    <rect x="56" y="72" width="8" height="2" rx="1" fill="#f1f1f3" opacity=".85"/>
    <path d="M12 77 Q30 71 44 66 Q54 61 60 56 Q62 54 66 54" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".5" strokeLinecap="round"/>
    <path d="M101 67 L118 72.5" stroke="#fff" strokeWidth="1.6" opacity=".45" strokeLinecap="round"/>
    <path d="M12 80 L120 82" stroke="#ff8a8e" strokeWidth="1" opacity=".5"/>
    <path d="M110 71.5 L122 75 Q124 76 123.5 78 L109 75.5 Z" fill="#fff6d0"/>
    <path d="M7 78 L7 82 L15 81 L15 76 Z" fill="#ff9a9a"/>
    <path d="M118 86 L127 86 L127 88 L118 88 Z" fill="#14151a"/>
    <circle cx="32" cy="89" r="14.6" fill="#131418"/>
    <circle cx="98" cy="89" r="14.6" fill="#131418"/>
    <g><circle cx="32" cy="89" r="12.6" fill="#1b1c21"/><path d="M23 84 A10 10 0 0 1 35 79" stroke="#e31b23" strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx="32" cy="89" r="9.4" fill={`url(#${u}rim)`}/>
    <g stroke="#464950" strokeWidth="2" strokeLinecap="round"><path d="M32 89 L32 80.5 M32 89 L39.3 84.8 M32 89 L39.3 93.2 M32 89 L32 97.5 M32 89 L24.7 93.2 M32 89 L24.7 84.8"/></g>
    <circle cx="32" cy="89" r="2.3" fill="#e6e7ea"/></g>
    <g><circle cx="98" cy="89" r="12.6" fill="#1b1c21"/><path d="M89 84 A10 10 0 0 1 101 79" stroke="#e31b23" strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx="98" cy="89" r="9.4" fill={`url(#${u}rim)`}/>
    <g stroke="#464950" strokeWidth="2" strokeLinecap="round"><path d="M98 89 L98 80.5 M98 89 L105.3 84.8 M98 89 L105.3 93.2 M98 89 L98 97.5 M98 89 L90.7 93.2 M98 89 L90.7 84.8"/></g>
    <circle cx="98" cy="89" r="2.3" fill="#e6e7ea"/></g>
    </svg>
    
  );
}
