import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Reveal({ as: Element = "div", children, className = "", delay = 0, ...props }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion()) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.unobserve(entry.target);
    }, { rootMargin: "0px 0px -8%", threshold: 0.12 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <Element ref={elementRef} className={`motion-reveal ${className}`} data-revealed={isVisible} style={{ "--motion-delay": `${delay}ms` }} {...props}>{children}</Element>;
}

export default Reveal;