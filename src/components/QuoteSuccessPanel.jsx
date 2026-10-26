import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatQuoteReference } from "../lib/quoteReference";

export default function QuoteSuccessPanel({ quoteId }) {
  const quoteReference = formatQuoteReference(quoteId);

  return (
    <section className="tg-quote-success-panel" aria-live="polite">
      <span className="tg-quote-success-panel__icon">
        <CheckCircle2 size={28} aria-hidden="true" />
      </span>

      <p className="tg-quote-kicker">Request saved</p>
      <h2>Quote request received</h2>

      <p>
        We’ve received your vehicle details. TOP-G Auto Seat will review
        your request. Please save your quote reference for follow-up.
      </p>

      <div className="tg-quote-reference">
        <span>Quote reference</span>
        <strong>{quoteReference}</strong>
      </div>

      <div className="tg-quote-success-panel__actions">
        <Link
          to="/"
          className="tg-quote-home-link"
          style={{ gridColumn: "1 / -1", width: "100%" }}
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}