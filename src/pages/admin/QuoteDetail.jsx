import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CarFront, ClipboardList, Mail, Phone, Save, Trash2 } from "lucide-react";
import { AdminError, AdminLoading } from "../../components/admin/AdminState";
import DeleteQuoteModal from "../../components/admin/DeleteQuoteModal";
import QuoteStatusBadge from "../../components/admin/QuoteStatusBadge";
import { deleteAdminQuote, getAdminQuote, updateAdminQuoteStatus } from "../../lib/api";
import { formatDate, formatSubmittedDate, getInstallationLabel, getQuoteServiceNames, getStatusLabel, quoteStatuses } from "../../lib/quotes";
import { formatQuoteReference } from "../../lib/quoteReference";

function createMailtoHref(quote) {
  const subject = "TOP-G Auto Seat Quote";
  const message = `Hi ${quote.customerName},\n\nThank you for your quote request with TOP-G Auto Seat. We are reviewing your vehicle details and will be happy to assist you.\n\nRegards,\nTOP-G Auto Seat`;
  return `mailto:${encodeURIComponent(quote.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

function createTelephoneHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}
function DetailCard({ icon: Icon, label, children }) {
  return (
    <article className="rounded-xl border border-white/10 bg-black p-5">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-zinc-500"><Icon size={16} className="text-red-400" /> {label}</div>
      <div className="mt-4 text-sm leading-7 text-zinc-300">{children}</div>
    </article>
  );
}

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    try {
      const response = await getAdminQuote(id);
      setQuote(response.data);
      setSelectedStatus(response.data.status);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadQuote();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadQuote]);

  async function saveStatus() {
    if (!quote || selectedStatus === quote.status) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const response = await updateAdminQuoteStatus(quote.id, selectedStatus);
      setQuote(response.data);
      setSelectedStatus(response.data.status);
    } catch {
      setSaveError("We couldn't update this quote. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function openDeleteModal() {
    setDeleteError("");
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setDeleteError("");
    setIsDeleteModalOpen(false);
  }

  async function confirmDelete() {
    if (!quote || isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteAdminQuote(quote.id);
      navigate("/admin/quotes", {
        replace: true,
        state: { message: "Quote deleted permanently." },
      });
    } catch {
      setDeleteError("We couldn't delete this quote. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  const serviceNames = getQuoteServiceNames(quote);

  if (isLoading) return <AdminLoading label="Loading quote details..." />;
  if (error || !quote) return <AdminError onRetry={loadQuote} message="We couldn't load this quote. It may no longer be available." />;

  const emailHref = quote.email ? createMailtoHref(quote) : null;
  const phoneHref = quote.phone ? createTelephoneHref(quote.phone) : null;
  const quoteReference = formatQuoteReference(quote.id);

  return (
    <section>
      <Link to="/admin/quotes" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-white"><ArrowLeft size={17} /> Back to quotes</Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Quote request</p>
          <h1 className="mt-3 text-[clamp(2rem,6vw,2.5rem)] font-black">{quote.customerName}</h1>
          <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2"><span className="text-[.65rem] font-black uppercase tracking-[.16em] text-red-300">Quote ref</span><strong className="font-mono text-sm font-black tracking-[.08em] text-white">{quoteReference}</strong></div>
          <p className="mt-2 text-zinc-400">Submitted {formatSubmittedDate(quote.createdAt)}</p>
        </div>
        <QuoteStatusBadge status={quote.status} />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-5 md:grid-cols-2">
          <DetailCard icon={Phone} label="Customer details">
            <p className="font-bold text-white">{quote.customerName}</p>
            <p>{quote.phone}</p>
            {quote.email ? <p className="mt-1 break-all text-zinc-400">{quote.email}</p> : <p className="mt-1 text-zinc-500">No email provided</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {emailHref ? <a href={emailHref} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-black uppercase tracking-[0.08em] text-zinc-200 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/40"><Mail size={15} /> Send email</a> : null}
              {phoneHref ? <a href={phoneHref} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-black uppercase tracking-[0.08em] text-zinc-200 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/40"><Phone size={15} /> Call customer</a> : null}
            </div>
          </DetailCard>
          <DetailCard icon={CarFront} label="Vehicle details"><p className="font-bold text-white">{quote.carModel}</p><p>{quote.yearModel}</p></DetailCard>
          <DetailCard icon={ClipboardList} label="Requested services">{serviceNames.length ? <ul className="space-y-1 font-bold text-white">{serviceNames.map((name) => <li key={name}>{name}</li>)}</ul> : <p className="font-bold text-white">Not specified</p>}<p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Material</p><p className="mt-1">{quote.material?.name || "Not specified"}</p>{quote.material ? <p className="text-zinc-500">{quote.material.type} · {quote.material.warrantyYears}-year warranty</p> : null}</DetailCard>
          <DetailCard icon={CalendarDays} label="Installation & schedule"><p><span className="text-zinc-500">Installation: </span>{getInstallationLabel(quote.installationType)}</p><p className="mt-2"><span className="text-zinc-500">Preferred date: </span>{formatDate(quote.preferredDate)}</p><p className="mt-3 text-xs text-zinc-500">Preferred dates are requests and are not automatically confirmed.</p></DetailCard>
          <article className="rounded-xl border border-white/10 bg-black p-5 md:col-span-2"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-zinc-500"><Mail size={16} className="text-red-400" /> Customer notes</div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">{quote.notes || "No additional notes provided."}</p></article>
        </div>

        <aside className="self-start rounded-xl border border-white/10 bg-black p-5 xl:sticky xl:top-6">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-red-400">Update status</p>
          <label className="mt-5 block text-sm font-bold" htmlFor="quote-status">Current progress</label>
          <select id="quote-status" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} disabled={isSaving} className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/25 disabled:opacity-60">
            {quoteStatuses.map((status) => <option key={status} value={status}>{getStatusLabel(status)}</option>)}
          </select>
          {saveError ? <p className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm font-semibold text-red-200" role="alert">{saveError}</p> : null}
          <button type="button" onClick={saveStatus} disabled={isSaving || selectedStatus === quote.status} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-black text-white transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"><Save size={16} /> {isSaving ? "SAVING..." : "SAVE STATUS"}</button>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-zinc-500">Danger zone</p>
            <button type="button" onClick={openDeleteModal} disabled={isSaving || isDeleting} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-bold text-zinc-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"><Trash2 size={16} /> DELETE QUOTE</button>
          </div>
        </aside>
      </div>
      <DeleteQuoteModal quote={isDeleteModalOpen ? quote : null} isDeleting={isDeleting} error={deleteError} onCancel={closeDeleteModal} onConfirm={confirmDelete} />
    </section>
  );
}
