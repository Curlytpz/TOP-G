import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GalleryLightbox from "../components/shared/GalleryLightbox";
import PageHeader from "../components/pageDesign/PageHeader";
import ServiceGalleryCard from "../components/shared/ServiceGalleryCard";
import Reveal from "../components/motion/Reveal";
import { services } from "../data/services";

function Services() {
  const [gallery, setGallery] = useState(null);
  const selectPhoto = useCallback((index) => setGallery((current) => (current ? { ...current, index } : current)), []);

  return (
    <main className="tg-page tg-surface">
      <PageHeader label="TOP-G services" pageName="Services" title="Finish the whole interior." description="Explore the confirmed automotive upholstery services available from TOP-G Auto Seat." />
      <section className="tg-page-content">
        <div className="tg-page-container">
          <div className="tg-card-grid tg-card-grid--services">
            {services.map((service, index) => <ServiceGalleryCard key={service.id} service={service} index={index} onOpenLightbox={setGallery} />)}
          </div>
          <Reveal className="tg-full-card tg-installation-card" delay={120}>
            <div><p className="tg-card-eyebrow">Installation options</p><p>Walk-ins and appointments are accepted. Most installations are completed by schedule, and home service installation is available.</p></div>
            <Link to="/quote" className="tg-text-link">Request a quote <ArrowRight size={17} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>
      <GalleryLightbox gallery={gallery} onClose={() => setGallery(null)} onSelect={selectPhoto} />
    </main>
  );
}

export default Services;