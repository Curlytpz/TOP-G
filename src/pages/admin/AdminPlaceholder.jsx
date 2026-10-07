export default function AdminPlaceholder({ title }) {
  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Admin management</p>
      <h1 className="mt-3 text-[clamp(2rem,6vw,2.5rem)] font-black">{title.toUpperCase()}</h1>
      <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-black p-8 text-zinc-400">
        {title} management will be available here in a future phase.
      </div>
    </section>
  );
}
