import { Link } from "react-router-dom";
import Reveal from "../motion/Reveal";

function PageHeader({ label, pageName, title, description }) {
  return (
    <header className="tg-page-header">
      <div className="tg-page-container">
        <Reveal className="tg-breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{pageName}</span></Reveal>
        <Reveal as="p" delay={60} className="tg-page-label">{label}</Reveal>
        <Reveal as="h1" delay={120} className="tg-page-title">{title}</Reveal>
        <Reveal as="p" delay={180} className="tg-page-subtitle">{description}</Reveal>
      </div>
    </header>
  );
}

export default PageHeader;