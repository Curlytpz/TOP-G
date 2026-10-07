import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import nylexGermanLeather from "../assets/materials-real/nylex-german-leather.webp";
import nylexGermanLeatherMiddle from "../assets/materials-real/nylex-german-leather-middle.webp";
import montecarloItalianLeather1 from "../assets/materials-real/montecarlo-italian-leather-1.webp";
import montecarloItalianLeather2 from "../assets/materials-real/montecarlo-italian-leather-2.webp";
import montecarloItalianLeather3 from "../assets/materials-real/montecarlo-italian-leather-3.webp";
import copperItalianLeather1 from "../assets/materials-real/copper-italian-leather-1.webp";
import copperItalianLeather2 from "../assets/materials-real/copper-italian-leather-2.webp";
import copperItalianLeather3 from "../assets/materials-real/copper-italian-leather-3.webp";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import HowItWorks from "../components/howItWorks/HowItWorks";
import Reveal from "../components/motion/Reveal";
import SectionHeader from "../components/shared/SectionHeader";
import MaterialGalleryCard from "../components/shared/MaterialGalleryCard";
import ServiceGalleryCard from "../components/shared/ServiceGalleryCard";
import GalleryLightbox from "../components/shared/GalleryLightbox";
import { materials } from "../data/materials";
import { services } from "../data/services";
import { inclusions } from "../data/inclusions";
import { projects } from "../data/projects";
import { testimonials, whyChoose } from "../data/homepage";

const homepageMaterialPhotos = {
  nylex: [
    nylexGermanLeather,
    nylexGermanLeatherMiddle,
    nylexGermanLeather,
  ],
  montecarlo: [
    montecarloItalianLeather1,
    montecarloItalianLeather2,
    montecarloItalianLeather3,
  ],
  copper: [
    copperItalianLeather1,
    copperItalianLeather2,
    copperItalianLeather3,
  ],
};

function Home() {
  const [gallery, setGallery] = useState(null);
  const selectPhoto = useCallback((index) => setGallery((current) => current ? { ...current, index } : current), []);

  return (
    <main className="tg-home tg-surface">
      <Hero />
      <section className="tg-home-section tg-home-section--band"><div className="tg-page-container"><SectionHeader label="Premium materials" title="Choose your finish." subtitle="Three confirmed material lines give your custom interior a starting point." action={{ to: "/materials", label: "All materials" }} /><div className="tg-card-grid tg-card-grid--materials tg-home-card-grid">{materials.map((material, index) => <MaterialGalleryCard key={material.id} material={material} index={index} galleryImages={homepageMaterialPhotos[material.slug]} onOpenLightbox={setGallery} />)}</div></div></section>
      <section className="tg-home-section tg-home-section--page"><div className="tg-page-container"><SectionHeader label="What we do" title="The interior, redefined." subtitle="From customized seat covers to the finishing details that make your car feel like yours." action={{ to: "/services", label: "View services" }} /><div className="tg-card-grid tg-card-grid--services tg-home-card-grid">{services.slice(0, 8).map((service, index) => <ServiceGalleryCard key={service.id} service={service} index={index} onOpenLightbox={setGallery} />)}</div></div></section>
      <section className="tg-home-section tg-home-section--page"><Reveal className="tg-red-band tg-page-container"><div className="tg-red-band-grid"><div><SectionHeader tone="inverse" label="Package inclusions" title="More in every detail." subtitle="A selection of confirmed package inclusions, designed to complete your custom interior experience." /><div className="tg-red-band-meta"><ShieldCheck size={21} aria-hidden="true" /> Includes {inclusions.length} listed items</div></div><div className="tg-red-band-list">{inclusions.map((item) => <div key={item}><span><Check size={15} aria-hidden="true" /></span>{item}</div>)}</div></div></Reveal></section>
      <section className="tg-home-section tg-home-section--band"><div className="tg-page-container"><SectionHeader label="Why TOP-G" title="Made to stand apart." subtitle="A straightforward, customer-led approach to upgrading your automotive interior." /><div className="tg-home-why-grid">{whyChoose.map((item, index) => <Reveal as="article" key={item.value} delay={index * 90} className="tg-card tg-home-why-card"><p className="tg-card-number">{item.value}</p><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></div></section>
      <section className="tg-home-section tg-home-section--page"><div className="tg-page-container"><SectionHeader label="Our work" title="The next transformation could be yours." subtitle="A selection of supplied TOP-G Auto Seat custom upholstery projects." action={{ to: "/gallery", label: "Open gallery" }} /><div className="tg-home-project-grid">{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></div></section>
      <HowItWorks />
      {testimonials.length > 0 && <section className="tg-home-section tg-home-section--page"><div className="tg-page-container"><SectionHeader label="Testimonials" title="The stories belong to our customers." /><div className="tg-home-testimonial-grid">{testimonials.map((testimonial, index) => <Reveal as="article" key={testimonial.id} delay={index * 90} className="tg-card"><p>{testimonial.quote}</p><strong>{testimonial.name}</strong></Reveal>)}</div></div></section>}
      <section className="tg-home-section tg-home-section--page"><Reveal className="tg-red-band tg-red-band--cta tg-page-container"><Sparkles size={28} aria-hidden="true" /><div className="tg-red-band-cta-row"><SectionHeader tone="inverse" label="Ready when you are" title="Bring your vision to the driver’s seat." /><Link to="/quote" className="tg-red-band-button">Get a Quote <ArrowRight size={18} aria-hidden="true" /></Link></div></Reveal></section>
      <GalleryLightbox gallery={gallery} onClose={() => setGallery(null)} onSelect={selectPhoto} />
    </main>
  );
}

export default Home;
