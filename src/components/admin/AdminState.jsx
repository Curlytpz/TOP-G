export function AdminLoading({ label = "Loading quote requests..." }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-xl border border-white/10 bg-black p-6 text-sm font-semibold text-zinc-400">
      {label}
    </div>
  );
}

export function AdminError({ onRetry, message = "We couldn't load this information." }) {
  return (
    <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6">
      <p className="font-bold text-red-200">{message}</p>
      <button type="button" onClick={onRetry} className="mt-4 min-h-10 rounded-md border border-red-400/40 px-4 text-sm font-black text-red-100 transition hover:bg-red-500/15">
        Try again
      </button>
    </div>
  );
}
