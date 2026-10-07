import { getStatusClassName, getStatusLabel } from "../../lib/quotes";

export default function QuoteStatusBadge({ status }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${getStatusClassName(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
