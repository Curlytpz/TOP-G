import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MaterialGalleryCard from "../components/shared/MaterialGalleryCard";
import GalleryLightbox from "../components/shared/GalleryLightbox";
import PageHeader from "../components/pageDesign/PageHeader";
import Reveal from "../components/motion/Reveal";
import { materials } from "../data/materials";

function Materials() {
  const [gallery, setGallery] = useState(null);
  const selectPhoto = useCallback((index) => setGallery((current) => current ? { ...current, selectedIndex: index } : current), []);

  return (
    <main className="tg-page tg-surface">
      <PageHeader label="Material collection" pageName="Materials" title="Choose the character of your cabin." description="Choose from TOP-G's confirmed leather lines, then discuss the right finish for your vehicle during your quote consultation." />
      <section className="tg-page-content">
        <div className="tg-page-container">
          <div className="tg-card-grid tg-card-grid--materials">{materials.map((material, index) => <MaterialGalleryCard key={material.id} material={material} index={index} onOpenLightbox={setGallery} />)}</div>
          <Reveal className="tg-full-card tg-material-note" delay={120}>
            <p>Not sure which material is right for your build? Start a quote and discuss the desired look for your vehicle.</p>
            <Link to="/quote" className="tg-text-link">Get a quote <ArrowRight size={17} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>
      <GalleryLightbox gallery={gallery} onClose={() => setGallery(null)} onSelect={selectPhoto} />
    </main>
  );
}

export default Materials;