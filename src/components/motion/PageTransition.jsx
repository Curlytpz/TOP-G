import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageTransition({ children }) {
  const { hash, pathname, search } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return <div key={`${pathname}${search}`} className="page-transition">{children}</div>;
}

export default PageTransition;