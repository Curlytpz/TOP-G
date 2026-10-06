import { useId } from 'react';

export default function SeatIcon({ size = 112, className = '' }) {
  const u = useId().replace(/:/g, '');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
    <defs>
    <linearGradient id={`${u}red`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8f0c13"/><stop offset=".25" stopColor="#e31b23"/><stop offset=".5" stopColor="#ff4a52"/><stop offset=".75" stopColor="#e31b23"/><stop offset="1" stopColor="#7d0a10"/></linearGradient>
    <linearGradient id={`${u}redv`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".28"/><stop offset=".4" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".3"/></linearGradient>
    <linearGradient id={`${u}ins`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1a1b20"/><stop offset=".5" stopColor="#3a3c44"/><stop offset="1" stopColor="#17181c"/></linearGradient>
    <pattern id={`${u}dia`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H8M0 0V8" stroke="#8b8e98" strokeWidth=".7" opacity=".55"/></pattern>
    <filter id={`${u}blur`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>
    <ellipse cx="64" cy="117" rx="40" ry="4.5" style={{ fill: 'var(--icon-shadow, rgba(0,0,0,.4))' }} filter={`url(#${u}blur)`}/>
    <path d="M40 104 L88 104 L92 114 Q92 116 90 116 L38 116 Q36 116 36 114 Z" fill="#2a2b31"/>
    <path d="M40 104 L88 104 L89 107 L39 107 Z" fill="#555862"/>
    <path d="M44 8 Q64 4 84 8 Q92 10 94 20 L98 66 Q99 74 95 80 L33 80 Q29 74 30 66 L34 20 Q36 10 44 8 Z" fill={`url(#${u}red)`}/>
    <path d="M44 8 Q64 4 84 8 Q92 10 94 20 L98 66 Q99 74 95 80 L33 80 Q29 74 30 66 L34 20 Q36 10 44 8 Z" fill={`url(#${u}redv)`}/>
    <path d="M48 14 Q64 11 80 14 Q84 15 84 20 L83 32 Q64 36 45 32 L44 20 Q44 15 48 14 Z" fill={`url(#${u}ins)`}/>
    <path d="M48 14 Q64 11 80 14 Q84 15 84 20 L83 32 Q64 36 45 32 L44 20 Q44 15 48 14 Z" fill={`url(#${u}dia)`}/>
    <path d="M48 14 Q64 11 80 14 Q84 15 84 20 L83 32 Q64 36 45 32 L44 20 Q44 15 48 14 Z" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2.5 2.5" opacity=".75"/>
    <path d="M46 40 Q64 37 82 40 L85 70 Q64 76 43 70 Z" fill={`url(#${u}ins)`}/>
    <path d="M46 40 Q64 37 82 40 L85 70 Q64 76 43 70 Z" fill={`url(#${u}dia)`}/>
    <path d="M46 40 Q64 37 82 40 L85 70 Q64 76 43 70 Z" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2.5 2.5" opacity=".75"/>
    <path d="M26 82 Q64 74 102 82 Q108 84 107 92 L104 102 Q64 110 24 102 L21 92 Q20 84 26 82 Z" fill={`url(#${u}red)`}/>
    <path d="M26 82 Q64 74 102 82 Q108 84 107 92 L104 102 Q64 110 24 102 L21 92 Q20 84 26 82 Z" fill={`url(#${u}redv)`}/>
    <path d="M40 84 Q64 79 88 84 L90 95 Q64 101 38 95 Z" fill={`url(#${u}ins)`}/>
    <path d="M40 84 Q64 79 88 84 L90 95 Q64 101 38 95 Z" fill={`url(#${u}dia)`}/>
    <path d="M40 84 Q64 79 88 84 L90 95 Q64 101 38 95 Z" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2.5 2.5" opacity=".75"/>
    <path d="M38 18 L36 56" stroke="#fff" strokeWidth="2" opacity=".35" strokeLinecap="round"/>
    <path d="M98 12 l1.8 4.2 4.2 1.8 -4.2 1.8 -1.8 4.2 -1.8 -4.2 -4.2 -1.8 4.2 -1.8z" fill="#fff"/>
    <path d="M108 26 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1z" fill="#ff7a80"/>
    </svg>
    
  );
}
