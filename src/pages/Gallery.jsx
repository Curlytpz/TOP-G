import SectionTitle from "../components/SectionTitle";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

function Gallery() {
  return <><section className="border-b border-white/10 bg-zinc-950 px-5 pb-12 pt-28 sm:px-6 sm:pb-20 sm:pt-36"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Our work" title="Built to be seen." description="A selection of supplied TOP-G Auto Seat custom upholstery projects." /></div></section><section className="bg-black px-5 py-14 sm:px-6 sm:py-20 lg:py-24"><div className="mx-auto max-w-7xl"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></div></section></>;
}

export default Gallery;