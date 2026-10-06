import useTheme from "../../hooks/useTheme";
import { CENTER, DISC_RADIUS, HERO_THEME, PIECES, SCALE } from "./logoPieces";

function FallbackLogo({ className = "" }) {
  const { theme } = useTheme();
  const themeValues = HERO_THEME[theme];
  const radius = DISC_RADIUS * SCALE;

  return (
    <svg className={className} viewBox="0 200 2048 2048" role="img" aria-label="TOP-G logo" style={{ filter: themeValues.fallbackShadow, transition: "filter 300ms ease" }}>
      <circle cx={CENTER.x} cy={CENTER.y} r={radius} fill="#ffffff" stroke={themeValues.discEdgeCss} strokeWidth={theme === "light" ? 10 : 0} />
      {PIECES.map((piece, index) => (
        <polygon key={index} points={piece.map(([x, y]) => `${x},${y}`).join(" ")} fill="#e31b23" />
      ))}
    </svg>
  );
}

export default FallbackLogo;