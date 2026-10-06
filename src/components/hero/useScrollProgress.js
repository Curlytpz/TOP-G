import { useEffect, useRef } from "react";

const clamp = (value) => Math.min(1, Math.max(0, value));

function useScrollProgress(trackRef, enabled = true) {
  const progressRef = useRef(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) {
      progressRef.current = 1;
      return undefined;
    }

    let animationFrame;
    let target = 0;
    let current = progressRef.current;

    const updateTarget = () => {
      const track = trackRef.current;
      if (!track) return;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const maximum = Math.max(1, track.offsetHeight - window.innerHeight);
      target = clamp((window.scrollY - trackTop) / maximum);
    };

    const tick = () => {
      current += (target - current) * 0.1;
      progressRef.current = current;
      animationFrame = window.requestAnimationFrame(tick);
    };

    updateTarget();
    animationFrame = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, [enabled, trackRef]);

  return progressRef;
}

export default useScrollProgress;