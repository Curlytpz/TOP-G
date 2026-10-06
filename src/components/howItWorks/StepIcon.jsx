import VehicleIcon from "./icons/VehicleIcon";
import SwatchesIcon from "./icons/SwatchesIcon";
import QuoteIcon from "./icons/QuoteIcon";
import SeatIcon from "./icons/SeatIcon";

const iconComponents = {
  vehicle: VehicleIcon,
  swatches: SwatchesIcon,
  quote: QuoteIcon,
  seat: SeatIcon,
};

const fixedViewportIcons = new Set(["vehicle", "seat"]);

function StepIcon({ step, className = "", size = 112 }) {
  const iconStyle = { "--hiw-svg-size": `${size}px` };

  if (step.image) {
    return <img className={`hiw-step-icon ${className}`} src={step.image} alt="" style={iconStyle} aria-hidden="true" />;
  }

  const Icon = iconComponents[step.icon];

  if (fixedViewportIcons.has(step.icon)) {
    return (
      <span className={`hiw-step-icon hiw-step-icon--provided hiw-step-icon--${step.icon} ${className}`} style={iconStyle} aria-hidden="true">
        <Icon />
      </span>
    );
  }

  return <Icon className={`hiw-step-icon ${className}`} size={size} />;
}

export default StepIcon;