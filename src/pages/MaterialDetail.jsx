import { useState } from "react";
import { ArrowLeft, ArrowRight, Expand, ShieldCheck } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import GalleryLightbox from "../components/shared/GalleryLightbox";
import Reveal from "../components/motion/Reveal";
import { getMaterialDetail } from "../data/materialDetails";

export default function MaterialDetail() {
  const { slug } = useParams();
  const material = getMaterialDetail(slug);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!material) return <Navigate to="/materials" replace />;

  const selectedImage = material.images[selectedIndex];
  const gallery = isLightboxOpen
    ? { title: material.name, images: material.images, index: selectedIndex }
    : null;

  return (
    <main className="tg-page tg-surface">
      <header className="tg-page-header">
        <div className="tg-page-container">
          <Reveal className="tg-breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/materials">Materials</Link><span aria-hidden="true">/</span>
            <span>{material.name}</span>
          </Reveal>
          <Reveal as="p" delay={60} className="tg-page-label">{material.type}</Reveal>
          <Reveal as="h1" delay={120} className="tg-page-title">{material.name}</Reveal>
          <Reveal as="p" delay={180} className="tg-page-subtitle">{material.intro}</Reveal>
          <Reveal delay={240} className="tg-material-detail__badge"><ShieldCheck size={17} aria-hidden="true" /> {material.warrantyYears}-Year Warranty</Reveal>
        </div>
      </header>

      <section className="tg-page-content">
        <div className="tg-page-container">
          <div className="tg-material-detail__grid">
            <Reveal className="tg-material-detail__gallery">
              <button type="button" className="tg-material-detail__main-image" onClick={() => setIsLightboxOpen(true)} aria-label={`Open ${selectedImage.alt} in preview`}>
                <img src={selectedImage.src} alt={selectedImage.alt} />
                <span><Expand size={18} aria-hidden="true" /> Open preview</span>
              </button>
              <div className="tg-material-detail__thumbnails" role="list" aria-label={`${material.name} gallery`}>
                {material.images.map((image, imageIndex) => (
                  <button type="button" key={image.alt} role="listitem" onClick={() => setSelectedIndex(imageIndex)} className={`tg-material-detail__thumbnail ${selectedIndex === imageIndex ? "is-active" : ""}`} aria-pressed={selectedIndex === imageIndex} aria-label={`Show image ${imageIndex + 1}: ${image.alt}`}>
                    <img src={image.src} alt="" />
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100} className="tg-material-detail__description">
              <p className="tg-page-label">Material details</p>
              <h2>Finish options for your interior.</h2>
              <p>{material.description}</p>
              <dl className="tg-material-detail__facts">
                <div><dt>Material type</dt><dd>{material.type}</dd></div>
                <div><dt>Warranty</dt><dd>{material.warrantyYears} years</dd></div>
                <div><dt>Available from</dt><dd>TOP-G Auto Seat</dd></div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={160} className="tg-material-detail__cta">
            <div><p className="tg-page-label">Plan your interior</p><h2>Ready to choose your finish?</h2></div>
            <div className="tg-material-detail__cta-actions">
              <Link to="/quote" className="tg-button-link">Get a Quote <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link to="/materials" className="tg-material-detail__secondary-link"><ArrowLeft size={17} aria-hidden="true" /> View Other Materials</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <GalleryLightbox gallery={gallery} onClose={() => setIsLightboxOpen(false)} onSelect={setSelectedIndex} />
    </main>
  );
}
