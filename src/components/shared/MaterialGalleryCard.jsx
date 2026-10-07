import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../motion/Reveal";
import { getGalleryImages } from "./galleryImages";
import MediaStack from "./MediaStack";

function MaterialGalleryCard({ material, index, onOpenLightbox, galleryImages }) {
  const [isOpen, setIsOpen] = useState(false);
  const folder = `materials/${material.slug}`;
  const images = useMemo(
    () => galleryImages ?? getGalleryImages(folder),
    [folder, galleryImages],
  );
  const slots = useMemo(() => Array.from(
    { length: 3 },
    (_, imageIndex) => ({
      alt: `${material.title} sample ${imageIndex + 1}`,
      isPlaceholder: !images[imageIndex] && !images[0],
      src: images[imageIndex] ?? images[0] ?? null,
    }),
  ), [images, material.title]);
  const openPhoto = (slotIndex) => {
    if (images.length && onOpenLightbox) {
      onOpenLightbox({
        images: images.slice(0, 3).map((src, imageIndex) => ({
          src,
          alt: `${material.title} sample ${imageIndex + 1}`,
        })),
        index: Math.min(slotIndex, images.length - 1),
        title: material.title,
      });
    }
  };

  return (
    <Reveal as="article" delay={index * 90} className={`tg-card tg-material-card ${isOpen ? "is-expanded" : ""}`} data-gallery-card data-gallery-open={isOpen ? "true" : "false"}>
      <button type="button" className="tg-gallery-toggle" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} ${material.title} photo stack`}>
        <span>{isOpen ? "Close photos" : "View photos"}</span>
      </button>
      <div className="tg-card-media"><MediaStack slots={slots} variant={`material-${material.slug}`} isOpen={isOpen} onPhotoOpen={openPhoto} /></div>
      <div className="tg-card-content">
        <p className="tg-warranty-badge">{material.type.toUpperCase()}</p>
        <h2>{material.title}</h2>
        <p>{material.description}</p>
        <Link to={`/materials/${material.slug}`} className="tg-card-action">Explore material <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </Reveal>
  );
}

export default MaterialGalleryCard;
