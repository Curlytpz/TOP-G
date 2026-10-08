import { useState } from "react";
import { Check, CheckCircle2, Copy, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatQuoteReference } from "../lib/quoteReference";

export default function QuoteSuccessPanel({ quoteId }) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const messengerUrl = (import.meta.env.VITE_MESSENGER_URL || "https://www.facebook.com/share/19eix9M81x/").trim();
  const quoteReference = formatQuoteReference(quoteId);
  const messengerMessage = "Hi TOP-G, I just submitted quote request " + quoteReference + " for my vehicle.";

  const copyMessage = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(messengerMessage);
      } else {
        const copyField = document.createElement("textarea");
        copyField.value = messengerMessage;
        copyField.setAttribute("readonly", "");
        copyField.style.position = "fixed";
        copyField.style.opacity = "0";
        document.body.appendChild(copyField);
        copyField.select();
        document.execCommand("copy");
        copyField.remove();
      }
      setCopyError("");
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setCopyError("We couldn't copy the message. Please select and copy it manually.");
    }
  };

  return (
    <section className="tg-quote-success-panel" aria-live="polite">
      <span className="tg-quote-success-panel__icon"><CheckCircle2 size={28} aria-hidden="true" /></span>
      <p className="tg-quote-kicker">Request saved</p>
      <h2>Quote request received</h2>
      <p>We’ve received your vehicle details. TOP-G Auto Seat will review your request. For faster assistance, continue the conversation with us on Messenger.</p>
      <div className="tg-quote-reference"><span>Quote reference</span><strong>{quoteReference}</strong></div>
      <div className="tg-quote-success-panel__actions">
        <a className="tg-quote-messenger-link" href={messengerUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Continue on Facebook Messenger</a>
        <Link to="/" className="tg-quote-home-link">Back to Home</Link>
      </div>
      <div className="tg-quote-copy-message"><p>{messengerMessage}</p><button type="button" onClick={copyMessage}>{isCopied ? <><Check size={16} aria-hidden="true" /> Copied</> : <><Copy size={16} aria-hidden="true" /> Copy Message</>}</button></div>
      {copyError ? <p className="tg-quote-messenger-note is-error" role="alert">{copyError}</p> : null}
    </section>
  );
}
