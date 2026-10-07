import { useCallback, useEffect, useState } from "react";
import { getAdminQuotes } from "../lib/api";

export function useAdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    try {
      const response = await getAdminQuotes();
      setQuotes(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadQuotes();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadQuotes]);

  const removeQuote = useCallback((quoteId) => {
    setQuotes((current) => current.filter((quote) => quote.id !== quoteId));
  }, []);

  return { quotes, isLoading, error, retry: loadQuotes, removeQuote };
}
