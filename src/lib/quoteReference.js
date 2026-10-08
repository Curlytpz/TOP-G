export function formatQuoteReference(quoteId) {
  const suffix = String(quoteId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return suffix ? `TG-${suffix}` : "TG-REQUEST";
}