import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../motion/Reveal";

function SectionHeader({ action, className = "", headingId, label, subtitle, title, tone = "default" }) {
  return (
    <header className={`tg-section-header tg-section-header--${tone} ${className}`.trim()}>
      <div className="tg-section-header__copy">
        {label && <Reveal as="p" className="tg-section-header__label">{label}</Reveal>}
        <Reveal as="h2" id={headingId} delay={70} className="tg-section-header__title">{title}</Reveal>
        {subtitle && <Reveal as="p" delay={140} className="tg-section-header__subtitle">{subtitle}</Reveal>}
      </div>
      {action && <Reveal delay={160} className="tg-section-header__action"><Link to={action.to} className="tg-section-header__link">{action.label} <ArrowRight size={17} aria-hidden="true" /></Link></Reveal>}
    </header>
  );
}

export default SectionHeader;