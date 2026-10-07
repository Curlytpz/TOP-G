import { CalendarCheck, CheckCircle2, Clock3, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../../components/motion/Reveal";
import { AdminError, AdminLoading } from "../../components/admin/AdminState";
import QuoteStatusBadge from "../../components/admin/QuoteStatusBadge";
import { formatSubmittedDate } from "../../lib/quotes";
import { useAdminQuotes } from "../../hooks/useAdminQuotes";

function countStatus(quotes, statuses) {
  return quotes.filter((quote) => statuses.includes(quote.status)).length;
}

export default function Dashboard() {
  const { quotes, isLoading, error, retry } = useAdminQuotes();
  const cards = [
    { label: "New Quotes", value: countStatus(quotes, ["NEW"]), icon: FileText },
    { label: "Contacted / Pending", value: countStatus(quotes, ["CONTACTED", "QUOTED", "IN_PROGRESS"]), icon: Clock3 },
    { label: "Scheduled", value: countStatus(quotes, ["SCHEDULED"]), icon: CalendarCheck },
    { label: "Completed", value: countStatus(quotes, ["COMPLETED"]), icon: CheckCircle2 },
  ];
  const recentQuotes = quotes.slice(0, 5);

  return (
    <section>
      <Reveal as="p" className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Admin dashboard</Reveal>
      <Reveal as="h1" delay={70} className="mt-3 text-[clamp(2rem,6vw,2.5rem)] font-black">TOP-G OVERVIEW</Reveal>
      <Reveal as="p" delay={140} className="mt-3 max-w-xl leading-7 text-zinc-400">Keep track of current quote activity and respond to new vehicle requests quickly.</Reveal>

      {isLoading ? <div className="mt-8"><AdminLoading label="Loading quote overview..." /></div> : null}
      {error ? <div className="mt-8"><AdminError onRetry={retry} message="We couldn't load the quote overview. Please try again." /></div> : null}

      {!isLoading && !error ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ label, value, icon: Icon }, index) => (
              <Reveal as="article" key={label} delay={index * 90} className="admin-card min-w-0 rounded-xl border border-white/10 bg-black p-5">
                <Icon className="text-red-500" size={20} />
                <p className="mt-8 text-3xl font-black">{value}</p>
                <p className="mt-1 text-sm text-zinc-500">{label}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-black">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div><h2 className="font-black">RECENT QUOTE REQUESTS</h2><p className="mt-1 text-sm text-zinc-500">Latest five submissions</p></div>
              <Link to="/admin/quotes" className="text-sm font-black text-red-400 transition hover:text-red-300">View all quotes</Link>
            </div>
            {recentQuotes.length === 0 ? <p className="p-6 text-sm text-zinc-400">No quote requests yet.</p> : (
              <div className="divide-y divide-white/8">
                {recentQuotes.map((quote) => (
                  <Link key={quote.id} to={`/admin/quotes/${quote.id}`} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-white/4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0"><p className="font-bold text-white">{quote.customerName}</p><p className="mt-1 truncate text-sm text-zinc-500">{quote.carModel} · {quote.yearModel} <span className="mx-1">·</span> {formatSubmittedDate(quote.createdAt)}</p></div>
                    <QuoteStatusBadge status={quote.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
