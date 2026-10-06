import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../motion/Reveal";
import { getGalleryImages, getGallerySlots } from "./galleryImages";
import MediaStack from "./MediaStack";

function ServiceGalleryCard({ onOpenLightbox, service, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const folder = `services/${service.slug}`;
  const images = useMemo(() => getGalleryImages(folder), [folder]);
  const slots = useMemo(() => getGallerySlots(folder, service.title), [folder, service.title]);
  const openPhoto = (slotIndex) => { if (images.length && onOpenLightbox) onOpenLightbox({ images: images.slice(0, 3).map((src, imageIndex) => ({ src, alt: `${service.title} sample ${imageIndex + 1}` })), index: Math.min(slotIndex, images.length - 1), title: service.title }); };
  return <Reveal as="article" delay={index * 90} className={`tg-card tg-service-card ${isOpen ? "is-expanded" : ""}`} data-gallery-card data-gallery-open={isOpen ? "true" : "false"}><button type="button" className="tg-gallery-toggle" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} ${service.title} photo stack`}><span>{isOpen ? "Close photos" : "View photos"}</span></button><div className="tg-card-media"><MediaStack slots={slots} variant={service.slug} isOpen={isOpen} onPhotoOpen={openPhoto} /></div><div className="tg-card-content"><p className="tg-card-number">{String(index + 1).padStart(2, "0")}</p><h2>{service.title}</h2><p>{service.description}</p><Link to="/quote" className="tg-card-action">Get a quote <ArrowUpRight size={17} aria-hidden="true" /></Link></div></Reveal>;
}
export default ServiceGalleryCard;