import { useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteProjectModal({ project, isDeleting, error, onCancel, onConfirm }) {
  useEffect(() => {
    if (!project) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleting, onCancel, project]);

  if (!project) return null;

  const vehicle = [project.carModel, project.yearModel].filter(Boolean).join(" · ") || "Vehicle not specified";

  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeleting) onCancel(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="delete-project-title" aria-describedby="delete-project-description" className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-950 p-5 shadow-2xl sm:p-6">
      <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-400"><AlertTriangle size={20} /></span><div><h2 id="delete-project-title" className="text-xl font-black text-white">Delete project?</h2><p id="delete-project-description" className="mt-2 text-sm leading-6 text-zinc-400">Delete this project permanently? This action cannot be undone.</p></div></div>
      <dl className="mt-5 rounded-lg border border-white/10 bg-black p-4 text-sm"><div><dt className="text-xs font-black uppercase tracking-[.12em] text-zinc-500">Project</dt><dd className="mt-1 font-bold text-white">{project.title}</dd></div><div className="mt-3"><dt className="text-xs font-black uppercase tracking-[.12em] text-zinc-500">Vehicle</dt><dd className="mt-1 text-zinc-300">{vehicle}</dd></div></dl>
      {error ? <p className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm font-semibold text-red-200" role="alert">{error}</p> : null}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" autoFocus disabled={isDeleting} onClick={onCancel} className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-black text-white transition hover:border-white/35 disabled:opacity-60">Cancel</button><button type="button" disabled={isDeleting} onClick={onConfirm} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-60"><Trash2 size={16} /> {isDeleting ? "DELETING..." : "DELETE PERMANENTLY"}</button></div>
    </section>
  </div>;
}
