import { useCallback, useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import ProjectCard from "../components/ProjectCard";
import { getPublicProjects } from "../lib/api";

function Gallery() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    try {
      const response = await getPublicProjects();
      if (!response || !Array.isArray(response.data)) throw new Error("Malformed projects response.");
      setProjects(response.data);
      setError(false);
    } catch {
      setProjects([]);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return <>
    <section className="border-b border-white/10 bg-zinc-950 px-5 pb-12 pt-28 sm:px-6 sm:pb-20 sm:pt-36"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Our work" title="Built to be seen." description="A selection of TOP-G Auto Seat custom upholstery projects." /></div></section>
    <section className="bg-black px-5 py-14 sm:px-6 sm:py-20 lg:py-24"><div className="mx-auto max-w-7xl">
      {isLoading ? <p className="rounded-xl border border-white/10 bg-zinc-900 p-8 text-zinc-400">Loading projects...</p> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-red-100"><p>We couldn't load projects right now.</p><button type="button" onClick={load} className="mt-4 border border-red-400/50 px-4 py-2 text-sm font-bold">Try again</button></div> : null}
      {!isLoading && !error && projects.length === 0 ? <p className="rounded-xl border border-dashed border-white/15 bg-zinc-900 p-10 text-center text-zinc-400">No published projects yet.</p> : null}
      {!isLoading && !error && projects.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} linkToProject />)}</div> : null}
    </div></section>
  </>;
}

export default Gallery;
