import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../motion/Reveal";
import { getGalleryImages, getGallerySlots } from "./galleryImages";
import MediaStack from "./MediaStack";

function MaterialGalleryCard({ material, index, onOpenLightbox }) {
  const [isOpen, setIsOpen] = useState(false);
  const folder = `materials/${material.slug}`;
  const images = useMemo(() => getGalleryImages(folder), [folder]);
  const slots = useMemo(() => getGallerySlots(folder, material.title), [folder, material.title]);
  const openPhoto = (slotIndex) => { if (images.length && onOpenLightbox) onOpenLightbox({ images: images.slice(0, 3).map((src, imageIndex) => ({ src, alt: `${material.title} sample ${imageIndex + 1}` })), index: Math.min(slotIndex, images.length - 1), title: material.title }); };
  return <Reveal as="article" delay={index * 90} className={`tg-card tg-material-card ${isOpen ? "is-expanded" : ""}`} data-gallery-card data-gallery-open={isOpen ? "true" : "false"}><button type="button" className="tg-gallery-toggle" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} ${material.title} photo stack`}><span>{isOpen ? "Close photos" : "View photos"}</span></button><div className="tg-card-media"><MediaStack slots={slots} variant={`material-${material.slug}`} isOpen={isOpen} onPhotoOpen={openPhoto} /></div><div className="tg-card-content"><p className="tg-warranty-badge">{material.type.toUpperCase()}</p><h2>{material.title}</h2><p>{material.description}</p><div className="tg-card-action" aria-hidden="true">Explore material <ArrowUpRight size={17} /></div></div></Reveal>;
}
export default MaterialGalleryCard;