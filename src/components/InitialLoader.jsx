import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import FallbackLogo from "./hero/FallbackLogo";

const DISPLAY_DURATION = 850;
const FADE_DURATION = 280;

function InitialLoader() {
  const { theme } = useTheme();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const displayDuration = reducedMotion ? 80 : DISPLAY_DURATION;
    const fadeDuration = reducedMotion ? 0 : FADE_DURATION;
    const leaveTimer = window.setTimeout(() => setIsLeaving(true), displayDuration);
    const removeTimer = window.setTimeout(() => setIsVisible(false), displayDuration + fadeDuration + 120);
    return () => { window.clearTimeout(leaveTimer); window.clearTimeout(removeTimer); };
  }, []);

  if (!isVisible) return null;
  return <div className={`topg-initial-loader ${isLeaving ? "is-leaving" : ""}`} data-theme={theme} role="status" aria-label="Loading TOP-G Auto Seat"><div className="topg-initial-loader__glow" aria-hidden="true" /><div className="relative flex flex-col items-center px-6 text-center"><FallbackLogo className="topg-initial-loader__logo w-28 sm:w-36" /><p className="topg-initial-loader__caption">TOP-G AUTO SEAT</p><span className="topg-initial-loader__line" aria-hidden="true"><span /></span></div></div>;
}

export default InitialLoader;