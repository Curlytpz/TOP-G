import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Images } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/motion/Reveal";
import BeforeAfterComparison from "../components/shared/BeforeAfterComparison";
import GalleryLightbox from "../components/shared/GalleryLightbox";
import { getPublicProject } from "../lib/api";

const typeLabel = (type) => ({ BEFORE: "Before", AFTER: "After", GALLERY: "Gallery" }[type] || "Project");

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const loadProject = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await getPublicProject(id);
      if (!response?.data || !Array.isArray(response.data.projectImages)) throw new Error("Malformed project response.");
      setProject(response.data);
      setSelectedIndex(0);
    } catch {
      setProject(null);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(loadProject, 0);
    return () => window.clearTimeout(timer);
  }, [loadProject]);

  const images = useMemo(() => (project?.projectImages || []).map((image, index) => ({
    ...image,
    src: image.imageUrl,
    alt: `${project.title} — ${typeLabel(image.imageType)} image ${index + 1}`,
  })), [project]);

  const selectedImage = images[selectedIndex];
  const beforeImage = images.find((image) => image.imageType === "BEFORE");
  const afterImage = images.find((image) => image.imageType === "AFTER");
  const gallery = isLightboxOpen && selectedImage
    ? { title: project.title, images, index: selectedIndex }
    : null;
  const vehicle = [project?.carModel, project?.yearModel].filter(Boolean).join(" · ");
  const goToImage = (direction) => {
    setSelectedIndex((current) => (current + direction + images.length) % images.length);
  };

  if (isLoading) {
    return <main className="tg-page tg-surface"><section className="tg-page-content"><div className="tg-page-container"><p className="tg-project-detail__state">Loading project...</p></div></section></main>;
  }

  if (hasError || !project) {
    return <main className="tg-page tg-surface"><section className="tg-page-content"><div className="tg-page-container tg-project-detail__error"><p className="tg-page-label">Our work</p><h1>Project unavailable.</h1><p>This project may be unpublished or no longer available.</p><div><button type="button" onClick={loadProject} className="tg-button-link">Try again</button><Link to="/gallery" className="tg-project-detail__back-link">Back to gallery</Link></div></div></section></main>;
  }

  return (
    <main className="tg-page tg-surface">
      <header className="tg-page-header">
        <div className="tg-page-container">
          <Reveal className="tg-breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/gallery">Our Work</Link><span aria-hidden="true">/</span><span>{project.title}</span></Reveal>
          <Reveal as="p" delay={60} className="tg-page-label">{vehicle || "TOP-G project"}</Reveal>
          <Reveal as="h1" delay={120} className="tg-page-title">{project.title}</Reveal>
          {project.description ? <Reveal as="p" delay={180} className="tg-page-subtitle">{project.description}</Reveal> : null}
        </div>
      </header>

      <section className="tg-page-content">
        <div className="tg-page-container">
          <div className="tg-project-detail__layout">
            <Reveal className="tg-project-detail__gallery">
              {selectedImage ? <>
                <div className="tg-project-detail__main-wrap">
                  <button type="button" className="tg-project-detail__main-image" onClick={() => setIsLightboxOpen(true)} aria-label={`Open ${selectedImage.alt} in fullscreen preview`}>
                    <img src={selectedImage.src} alt={selectedImage.alt} />
                    <span><Expand size={18} aria-hidden="true" /> Fullscreen</span>
                  </button>
                  {images.length > 1 ? <>
                    <button type="button" className="tg-project-detail__nav tg-project-detail__nav--previous" onClick={() => goToImage(-1)} aria-label="Previous project image"><ChevronLeft size={24} /></button>
                    <button type="button" className="tg-project-detail__nav tg-project-detail__nav--next" onClick={() => goToImage(1)} aria-label="Next project image"><ChevronRight size={24} /></button>
                    <p className="tg-project-detail__counter">{selectedIndex + 1} / {images.length}</p>
                  </> : null}
                </div>
                {images.length > 1 ? <div className="tg-project-detail__thumbnails" role="list" aria-label={`${project.title} images`}>{images.map((image, imageIndex) => <button type="button" role="listitem" key={image.id} onClick={() => setSelectedIndex(imageIndex)} className={`tg-project-detail__thumbnail ${selectedIndex === imageIndex ? "is-active" : ""}`} aria-label={`Show ${image.alt}`} aria-pressed={selectedIndex === imageIndex}><img src={image.src} alt="" loading="lazy" /><span>{typeLabel(image.imageType)}</span></button>)}</div> : null}
              </> : <div className="tg-project-detail__no-images"><Images size={24} aria-hidden="true" /><p>Project images are coming soon.</p></div>}
            </Reveal>

            <Reveal delay={100} className="tg-project-detail__details">
              <p className="tg-page-label">Project details</p>
              <dl className="tg-project-detail__facts">
                {vehicle ? <div><dt>Vehicle</dt><dd>{vehicle}</dd></div> : null}
                {project.material ? <div><dt>Material</dt><dd>{project.material.name}</dd></div> : null}
                <div><dt>Images</dt><dd>{images.length || "No"} {images.length === 1 ? "image" : "images"}</dd></div>
              </dl>
              {project.description ? <p className="tg-project-detail__description">{project.description}</p> : null}
              <Link to="/gallery" className="tg-project-detail__back-link"><ChevronLeft size={17} aria-hidden="true" /> Back to Our Work</Link>
            </Reveal>
          </div>

          {beforeImage && afterImage ? <Reveal delay={160} className="tg-project-detail__comparison-section"><div><p className="tg-page-label">Transformation</p><h2>Before &amp; after</h2><p>Drag the handle to compare the uploaded project photos.</p></div><BeforeAfterComparison before={beforeImage} after={afterImage} title={project.title} /></Reveal> : null}
        </div>
      </section>

      <GalleryLightbox gallery={gallery} onClose={() => setIsLightboxOpen(false)} onSelect={setSelectedIndex} />
    </main>
  );
}

export default ProjectDetail;
