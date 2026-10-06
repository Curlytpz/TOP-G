import { useRef, useState } from "react";
import { Check, Copy, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import PageHeader from "../components/pageDesign/PageHeader";
import Reveal from "../components/motion/Reveal";
import { business } from "../data/business";

const mapQuery = "Bab Meokja Samgyupsal, Sitio Visitas, Sta. Maria, Mexico, Pampanga";
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

function CopyValueButton({ label, value, onCopy, copied }) {
  return <button type="button" className="tg-copy-button" onClick={() => onCopy(label, value)}>{copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copied ? "Copied" : "Copy"}</button>;
}

function Contact() {
  const [copied, setCopied] = useState("");
  const timer = useRef();
  const copyValue = async (label, value) => {
    try { await navigator.clipboard.writeText(value); } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value; textarea.style.position = "fixed"; textarea.style.opacity = "0";
      document.body.append(textarea); textarea.select(); document.execCommand("copy"); textarea.remove();
    }
    setCopied(label); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setCopied(""), 1800);
  };
  return (
    <main className="tg-page tg-surface">
      <PageHeader label="Contact TOP-G" pageName="Contact" title="Let’s talk about your ride." description="For seat covers, interior upholstery, and installation queries, contact TOP-G Auto Seat directly." />
      <section className="tg-page-content">
        <div className="tg-page-container tg-contact-layout">
          <div className="tg-contact-stack">
            <Reveal as="article" className="tg-contact-card"><Phone className="tg-contact-icon" size={23} aria-hidden="true" /><p className="tg-card-eyebrow">Call or message</p><div className="tg-contact-values">{business.phoneNumbers.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>)}</div><CopyValueButton label="Phone numbers" value={business.phoneNumbers.join(" / ")} onCopy={copyValue} copied={copied === "Phone numbers"} /></Reveal>
            <Reveal as="article" className="tg-contact-card" delay={90}><Mail className="tg-contact-icon" size={23} aria-hidden="true" /><p className="tg-card-eyebrow">Email</p><div className="tg-contact-values"><a href={`mailto:${business.email}`}>{business.email}</a></div><CopyValueButton label="Email address" value={business.email} onCopy={copyValue} copied={copied === "Email address"} /></Reveal>
          </div>
          <Reveal as="article" className="tg-map-card" delay={150}>
            <MapPin className="tg-contact-icon" size={23} aria-hidden="true" /><p className="tg-card-eyebrow">Shop location</p><p className="tg-map-address">{business.location}</p><p className="tg-map-landmark">{business.locationLandmark}<br />{business.locationNote}</p><p className="tg-map-hours">Business hours: {business.businessHours}</p>
            <iframe title="TOP-G Auto Seat location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} />
            <a href={mapUrl} target="_blank" rel="noreferrer" className="tg-text-link">Open in Google Maps <ExternalLink size={16} aria-hidden="true" /></a>
          </Reveal>
          <p className="sr-only" aria-live="polite">{copied ? `${copied} copied to clipboard.` : ""}</p>
        </div>
      </section>
    </main>
  );
}

export default Contact;