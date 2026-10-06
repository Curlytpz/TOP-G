import { lazy, Suspense } from "react";
import useTheme from "../hooks/useTheme";
import FallbackLogo from "./hero/FallbackLogo";
import { HERO_THEME } from "./hero/logoPieces";

const LogoBuildHero = lazy(() => import("./hero/LogoBuildHero"));

function HeroFallback() {
  const { theme } = useTheme();
  const themeValues = HERO_THEME[theme];

  return <section className="topg-hero mt-20 grid min-h-[calc(100svh-5rem)] place-items-center overflow-hidden px-5 sm:px-6" style={{ "--hero-background": themeValues.background, "--hero-grid-line": themeValues.gridLine, "--hero-label": themeValues.label, "--hero-headline": themeValues.headline, "--hero-paragraph": themeValues.paragraph }}><FallbackLogo className="w-52 sm:w-72" /></section>;
}

function Hero() {
  return <Suspense fallback={<HeroFallback />}><LogoBuildHero /></Suspense>;
}

export default Hero;