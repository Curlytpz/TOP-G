import { Link } from "react-router-dom";
import Reveal from "./motion/Reveal";

function ProjectCard({ project, index = 0, linkToProject = false }) {
  const position = String(index + 1).padStart(2, "0");
  const featured = index === 0;
  const beforeImage = project.projectImages?.find((image) => image.imageType === "BEFORE");
  const afterImage = project.projectImages?.find((image) => image.imageType === "AFTER");
  const galleryImage = project.projectImages?.find((image) => image.imageType === "GALLERY");
  const image = project.image || afterImage?.imageUrl || galleryImage?.imageUrl || beforeImage?.imageUrl;
  const category = project.category || [project.carModel, project.yearModel, project.material?.name].filter(Boolean).join(" · ") || "TOP-G project";
  const imageCount = project.projectImages?.length || (image ? 1 : 0);

  const content = (
    <div className={`relative min-h-[19rem] overflow-hidden sm:min-h-72 ${featured ? "lg:min-h-[38rem]" : ""}`}>
      {image ? <img src={image} alt={project.alt || project.title} loading="lazy" decoding="async" className="motion-reveal-image h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-full w-full place-items-center bg-zinc-800 px-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">Project image coming soon</div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/5" />
      {beforeImage && afterImage ? <span className="absolute left-4 top-3 rounded-full bg-black/75 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-white backdrop-blur sm:left-6 sm:top-4">Before / After</span> : null}
      {imageCount > 0 ? <span className="absolute bottom-5 right-5 rounded-full bg-black/75 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-white backdrop-blur sm:bottom-6 sm:right-6" aria-label={`${imageCount} project images`}>1 / {imageCount}</span> : null}
      <span className="absolute right-4 top-3 text-4xl font-black italic text-white/50 sm:right-6 sm:top-4 sm:text-5xl">{position}</span>
      <div className="absolute inset-x-0 bottom-0 p-5 pt-24 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300 drop-shadow">{category}</p><h3 className="mt-2 text-lg font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.9)] sm:text-xl">{project.title}</h3>{project.description ? <p className="mt-2 line-clamp-2 text-sm text-zinc-100 drop-shadow-[0_1px_5px_rgba(0,0,0,.95)]">{project.description}</p> : null}</div>
    </div>
  );

  return (
    <Reveal as="article" delay={Math.min(index, 5) * 75} className={`project-card group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}>
      {linkToProject ? <Link to={`/gallery/${project.id}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950" aria-label={`View ${project.title} project gallery`}>{content}</Link> : content}
    </Reveal>
  );
}

export default ProjectCard;
