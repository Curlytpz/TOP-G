import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/pageDesign/PageHeader";
import Reveal from "../components/motion/Reveal";
import { business } from "../data/business";

function About() {
  const facts = [["Location", business.location], ["Hours", business.businessHours], ["Warranty", business.warranty], ["Home service", "Available"]];
  return (
    <main className="tg-page tg-surface">
      <PageHeader label="About TOP-G" pageName="About" title="A custom approach to automotive comfort." description="TOP-G Auto Seat creates custom automotive seat covers and interior upholstery work for drivers in Pampanga and beyond." />
      <section className="tg-page-content">
        <div className="tg-page-container tg-about-layout">
          <Reveal className="tg-about-copy">
            <p className="tg-about-lead">Your vehicle is personal. Its interior should feel that way too.</p>
            <p>From material choice to custom logo details, TOP-G Auto Seat provides a starting point for a more considered interior.</p>
            <Link to="/services" className="tg-text-link">Explore services <ArrowRight size={17} aria-hidden="true" /></Link>
          </Reveal>
          <div className="tg-fact-grid" aria-label="TOP-G Auto Seat at a glance">
            {facts.map(([label, value], index) => <Reveal key={label} className="tg-fact-card" delay={index * 75}><p>{label}</p><strong>{value}</strong></Reveal>)}
          </div>
          <Reveal as="aside" className="tg-find-card" delay={180}>
            <p className="tg-card-eyebrow">Find TOP-G</p>
            <p className="tg-find-row"><MapPin size={19} aria-hidden="true" /><span>{business.location}<small>{business.locationLandmark}<br />{business.locationNote}</small></span></p>
            <p className="tg-find-row"><Phone size={19} aria-hidden="true" /><span>{business.phoneNumbers.join(" / ")}</span></p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default About;