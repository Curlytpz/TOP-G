import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { AdminError, AdminLoading } from "../../components/admin/AdminState";
import { getAdminProjects } from "../../lib/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try { const response = await getAdminProjects(); setProjects(response.data || []); }
    catch { setError(true); } finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer); }, [load]);
  const shown = useMemo(() => projects.filter((p) => {
    const status = filter === "ALL" || (filter === "PUBLISHED" ? p.published : !p.published);
    const term = search.toLowerCase();
    return status && [p.title, p.carModel].some((value) => value?.toLowerCase().includes(term));
  }), [projects, filter, search]);

  return <section>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-red-500">Portfolio management</p><h1 className="mt-3 text-[clamp(2rem,6vw,2.5rem)] font-black">PROJECTS</h1><p className="mt-2 text-zinc-400">Create and publish gallery projects.</p></div><Link to="/admin/projects/new" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-black text-white"><Plus size={17} /> Add Project</Link></div>
    <div className="mt-8 rounded-xl border border-white/10 bg-black p-4"><label className="relative block max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or car model" className="min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 py-2 pl-10 pr-3 text-sm outline-none focus:border-red-500" /></label><div className="mt-3 flex gap-2">{["ALL", "PUBLISHED", "DRAFT"].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? "min-h-9 rounded-full border border-red-500 bg-red-500 px-3 text-xs font-black text-white" : "min-h-9 rounded-full border border-white/10 px-3 text-xs font-black text-zinc-400"}>{item[0] + item.slice(1).toLowerCase()}</button>)}</div></div>
    <div className="mt-5">{loading ? <AdminLoading label="Loading projects..." /> : null}{error ? <AdminError onRetry={load} message="We couldn't load projects." /> : null}{!loading && !error && projects.length === 0 ? <p className="rounded-xl border border-dashed border-white/15 bg-black p-10 text-center text-zinc-400">No projects yet.</p> : null}{!loading && !error && projects.length > 0 && shown.length === 0 ? <p className="rounded-xl border border-dashed border-white/15 bg-black p-10 text-center text-zinc-400">No projects match this filter.</p> : null}{!loading && !error && shown.length > 0 ? <div className="grid gap-3">{shown.map((p) => <Link key={p.id} to={"/admin/projects/" + p.id} className="rounded-xl border border-white/10 bg-black p-4 transition hover:border-red-500/50"><div className="flex flex-wrap justify-between gap-3"><strong>{p.title}</strong><span className={p.published ? "text-emerald-400" : "text-zinc-400"}>{p.published ? "Published" : "Draft"}</span></div><p className="mt-2 text-sm text-zinc-400">{p.carModel || "Vehicle not specified"} {p.yearModel ? "· " + p.yearModel : ""}</p><p className="mt-1 text-sm text-zinc-500">{p.material?.name || "No material selected"} · {new Date(p.createdAt).toLocaleDateString()}</p></Link>)}</div> : null}</div>
  </section>;
}
