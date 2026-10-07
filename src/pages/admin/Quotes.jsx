import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, Trash2 } from "lucide-react";
import Reveal from "../../components/motion/Reveal";
import { AdminError, AdminLoading } from "../../components/admin/AdminState";
import DeleteQuoteModal from "../../components/admin/DeleteQuoteModal";
import QuoteStatusBadge from "../../components/admin/QuoteStatusBadge";
import { deleteAdminQuote } from "../../lib/api";
import { formatDate, formatSubmittedDate, getInstallationLabel, getQuoteServiceNames, getStatusLabel, quoteStatuses } from "../../lib/quotes";
import { useAdminQuotes } from "../../hooks/useAdminQuotes";

export default function Quotes() {
  const { quotes, isLoading, error, retry, removeQuote } = useAdminQuotes();
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");

  const serviceLabel = (quote) => getQuoteServiceNames(quote).join(", ") || "Not specified";
  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return quotes.filter((quote) => {
      const matchesStatus = statusFilter === "ALL" || quote.status === statusFilter;
      const matchesSearch = !query || [quote.customerName, quote.phone, quote.carModel].some((value) => value?.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [quotes, search, statusFilter]);

  function openDelete(quote) {
    setDeleteError("");
    setQuoteToDelete(quote);
  }

  function closeDelete() {
    if (isDeleting) return;
    setQuoteToDelete(null);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (!quoteToDelete || isDeleting) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteAdminQuote(quoteToDelete.id);
      removeQuote(quoteToDelete.id);
      setQuoteToDelete(null);
      setSuccessMessage("Quote deleted permanently.");
    } catch {
      setDeleteError("We couldn't delete this quote. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return <section>
    <Reveal as="p" className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Quote management</Reveal>
    <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><Reveal as="h1" delay={60} className="text-[clamp(2rem,6vw,2.5rem)] font-black">QUOTE REQUESTS</Reveal><Reveal as="p" delay={120} className="mt-2 max-w-2xl leading-7 text-zinc-400">Review customer requests, check vehicle details, and keep every job moving.</Reveal></div>{!isLoading && !error ? <p className="text-sm font-semibold text-zinc-500">{quotes.length} total request{quotes.length === 1 ? "" : "s"}</p> : null}</div>
    <div className="mt-8 rounded-xl border border-white/10 bg-black p-4 sm:p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><label className="relative block min-w-0 lg:max-w-md lg:flex-1"><span className="sr-only">Search quotes</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, phone, or vehicle" className="min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 py-2 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/25" /></label><div className="flex items-center gap-2 text-sm font-semibold text-zinc-400"><SlidersHorizontal size={17} /> <span>Filter status</span></div></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1"><button type="button" onClick={() => setStatusFilter("ALL")} className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-black uppercase tracking-wide transition ${statusFilter === "ALL" ? "border-red-500 bg-red-500 text-white" : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"}`}>All</button>{quoteStatuses.map((status) => <button type="button" key={status} onClick={() => setStatusFilter(status)} className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-black uppercase tracking-wide transition ${statusFilter === status ? "border-red-500 bg-red-500 text-white" : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"}`}>{getStatusLabel(status)}</button>)}</div></div>
    <div className="mt-5">{successMessage ? <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm font-semibold text-emerald-200" role="status"><span>{successMessage}</span><button type="button" onClick={() => setSuccessMessage("")} className="text-xs font-black uppercase">Dismiss</button></div> : null}{isLoading ? <AdminLoading /> : null}{error ? <AdminError onRetry={retry} message="We couldn't load quote requests. Please try again." /> : null}{!isLoading && !error && quotes.length === 0 ? <div className="rounded-xl border border-dashed border-white/15 bg-black p-10 text-center text-zinc-400">No quote requests yet.</div> : null}{!isLoading && !error && quotes.length > 0 && filteredQuotes.length === 0 ? <div className="rounded-xl border border-dashed border-white/15 bg-black p-10 text-center text-zinc-400">No quotes match this filter.</div> : null}
      {!isLoading && !error && filteredQuotes.length > 0 ? <><div className="hidden overflow-hidden rounded-xl border border-white/10 bg-black lg:block"><div className="overflow-x-auto"><table className="w-full min-w-240 text-left"><thead className="bg-white/4 text-xs uppercase tracking-[0.16em] text-zinc-500"><tr><th className="px-5 py-4 font-black">Customer</th><th className="px-5 py-4 font-black">Vehicle</th><th className="px-5 py-4 font-black">Service / Material</th><th className="px-5 py-4 font-black">Installation</th><th className="px-5 py-4 font-black">Schedule</th><th className="px-5 py-4 font-black">Status</th><th className="px-5 py-4 font-black">Submitted</th><th className="px-5 py-4 font-black"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-white/8">{filteredQuotes.map((quote) => <tr key={quote.id} className="transition hover:bg-white/4"><td className="px-5 py-4 align-top"><Link to={`/admin/quotes/${quote.id}`} className="font-bold text-white transition hover:text-red-400">{quote.customerName}</Link><p className="mt-1 text-sm text-zinc-400">{quote.phone}</p>{quote.email ? <p className="mt-1 text-sm text-zinc-500">{quote.email}</p> : null}</td><td className="px-5 py-4 align-top text-sm text-zinc-300">{quote.carModel}<span className="mt-1 block text-zinc-500">{quote.yearModel}</span></td><td className="px-5 py-4 align-top text-sm text-zinc-300"><span className="block">{serviceLabel(quote)}</span><span className="mt-1 block text-zinc-500">{quote.material?.name || "Not specified"}</span></td><td className="px-5 py-4 align-top text-sm text-zinc-300">{getInstallationLabel(quote.installationType)}</td><td className="px-5 py-4 align-top text-sm text-zinc-300">{formatDate(quote.preferredDate)}</td><td className="px-5 py-4 align-top"><QuoteStatusBadge status={quote.status} /></td><td className="px-5 py-4 align-top text-sm text-zinc-400">{formatSubmittedDate(quote.createdAt)}</td><td className="px-5 py-4 align-top"><button type="button" onClick={() => openDelete(quote)} className="inline-flex size-9 items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label={`Delete quote from ${quote.customerName}`}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div></div>
        <div className="grid gap-3 lg:hidden">{filteredQuotes.map((quote) => <article key={quote.id} className="rounded-xl border border-white/10 bg-black p-4"><Link to={`/admin/quotes/${quote.id}`} className="block transition hover:text-red-400"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-black text-white">{quote.customerName}</h2><p className="mt-1 text-sm text-zinc-400">{quote.phone}</p></div><QuoteStatusBadge status={quote.status} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs font-bold uppercase tracking-wide text-zinc-600">Vehicle</p><p className="mt-1 text-zinc-300">{quote.carModel} · {quote.yearModel}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-zinc-600">Services</p><p className="mt-1 text-zinc-300">{serviceLabel(quote)}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-zinc-600">Material</p><p className="mt-1 text-zinc-300">{quote.material?.name || "Not specified"}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-zinc-600">Submitted</p><p className="mt-1 text-zinc-300">{formatDate(quote.createdAt)}</p></div></div></Link><div className="mt-4 border-t border-white/10 pt-3"><button type="button" onClick={() => openDelete(quote)} className="inline-flex min-h-9 items-center gap-2 text-xs font-black uppercase tracking-wide text-zinc-500 transition hover:text-red-400"><Trash2 size={15} /> Delete quote</button></div></article>)}</div></> : null}
    </div>
    <DeleteQuoteModal quote={quoteToDelete} isDeleting={isDeleting} error={deleteError} onCancel={closeDelete} onConfirm={confirmDelete} />
  </section>;
}