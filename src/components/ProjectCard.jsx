import Reveal from "./motion/Reveal";

function ProjectCard({ project, index = 0 }) {
  const position = String(index + 1).padStart(2, "0");
  const featured = index === 0;

  return (
    <Reveal as="article" delay={Math.min(index, 5) * 75} className={`project-card group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}>
      <div className={`relative min-h-[19rem] overflow-hidden sm:min-h-72 ${featured ? "lg:min-h-[38rem]" : ""}`}>
        <img src={project.image} alt={project.alt} loading={index > 2 ? "lazy" : "eager"} className="motion-reveal-image h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <span className="absolute right-4 top-3 text-4xl font-black italic text-white/40 sm:right-6 sm:top-4 sm:text-5xl">{position}</span>
        <div className="absolute inset-x-0 bottom-0 p-5 pt-24 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">{project.category}</p><h3 className="mt-2 text-lg font-black text-white sm:text-xl">{project.title}</h3></div>
      </div>
    </Reveal>
  );
}

export default ProjectCard;