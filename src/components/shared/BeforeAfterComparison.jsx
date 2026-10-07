import { useCallback, useRef, useState } from "react";

const clamp = (value) => Math.min(100, Math.max(0, value));

function BeforeAfterComparison({ before, after, title }) {
  const trackRef = useRef(null);
  const [position, setPosition] = useState(50);

  const updatePosition = useCallback((clientX) => {
    const track = trackRef.current;
    if (!track) return;
    const { left, width } = track.getBoundingClientRect();
    if (width) setPosition(clamp(((clientX - left) / width) * 100));
  }, []);

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updatePosition(event.clientX);
  };

  const handleKeyDown = (event) => {
    const nextPosition = {
      ArrowLeft: position - 5,
      ArrowRight: position + 5,
      Home: 0,
      End: 100,
    }[event.key];

    if (nextPosition === undefined) return;
    event.preventDefault();
    setPosition(clamp(nextPosition));
  };

  return (
    <div className="tg-before-after" ref={trackRef}>
      <img src={after.src} alt={after.alt} loading="lazy" />
      <div className="tg-before-after__before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={before.src} alt="" aria-hidden="true" />
      </div>
      <span className="tg-before-after__label tg-before-after__label--before">Before</span>
      <span className="tg-before-after__label tg-before-after__label--after">After</span>
      <div className="tg-before-after__divider" style={{ left: `${position}%` }} aria-hidden="true" />
      <button
        type="button"
        className="tg-before-after__handle"
        style={{ left: `${position}%` }}
        role="slider"
        aria-label={`Compare before and after photos for ${title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture?.(event.pointerId)) updatePosition(event.clientX);
        }}
      >
        <span aria-hidden="true">↔</span>
      </button>
    </div>
  );
}

export default BeforeAfterComparison;
