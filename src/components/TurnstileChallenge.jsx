import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "topg-turnstile-script";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  const existing = document.getElementById(SCRIPT_ID);
  if (existing?.dataset.loaded === "true") return Promise.resolve(window.turnstile);

  return new Promise((resolve, reject) => {
    const script = existing || document.createElement("script");
    const onLoad = () => {
      script.dataset.loaded = "true";
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile did not load."));
    };
    const onError = () => reject(new Error("Turnstile could not load."));
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
}

export default function TurnstileChallenge({ siteKey, theme, resetKey, onTokenChange }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let disposed = false;
    onTokenChange("");
    if (!siteKey) return undefined;

    loadTurnstile()
      .then((turnstile) => {
        if (disposed || !containerRef.current) return;
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          action: "quote_submit",
          callback: (token) => {
            if (disposed) return;
            setStatus("verified");
            onTokenChange(token);
          },
          "expired-callback": () => {
            if (disposed) return;
            setStatus("expired");
            onTokenChange("");
          },
          "error-callback": () => {
            if (disposed) return;
            setStatus("error");
            onTokenChange("");
          },
        });
      })
      .catch(() => {
        if (disposed) return;
        setStatus("error");
        onTokenChange("");
      });

    return () => {
      disposed = true;
      if (widgetIdRef.current !== null && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [onTokenChange, resetKey, siteKey, theme]);

  const visibleStatus = siteKey ? status : "unavailable";
  const message = {
    loading: "Loading security verification…",
    expired: "Security verification expired. Please complete it again.",
    error: "Security verification could not load. Please refresh and try again.",
    unavailable: "Security verification is not configured. Please contact TOP-G Auto Seat directly.",
  }[visibleStatus];

  return <div className="tg-turnstile" aria-live="polite">
    <div className="tg-turnstile__widget" ref={containerRef} />
    {message ? <p className={visibleStatus === "error" || visibleStatus === "unavailable" ? "tg-turnstile__message is-error" : "tg-turnstile__message"}>{message}</p> : null}
  </div>;
}