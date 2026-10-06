import { useEffect, useRef, useState } from "react";
import StepIcon from "./StepIcon";
import { howItWorksSteps } from "./steps";
import SectionHeader from "../shared/SectionHeader";

function HowItWorks() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`how-it-works-section ${isVisible ? "is-visible" : ""}`} aria-labelledby="how-it-works-title">
      <div className="tg-page-container">
        <SectionHeader headingId="how-it-works-title" label="How it works" title="A clear route to your custom interior." subtitle="Four steps from first message to a finished interior." action={{ to: "/quote", label: "Get a quote" }} />
        <div className="how-it-works-timeline">
          <div className="how-it-works-rail" aria-hidden="true" />
          <ol className="how-it-works-list">
            {howItWorksSteps.map((step, index) => (
              <li key={step.number} className="how-it-works-step" tabIndex="0" style={{ "--hiw-delay": `${index * 90}ms` }}>
                <div className="how-it-works-visual" aria-hidden="true"><StepIcon step={step} size={112} /><span className="how-it-works-contact-shadow" /></div>
                <div className="how-it-works-node-row" aria-hidden="true"><span className="how-it-works-node" /><span className="how-it-works-number">{step.number}</span></div>
                <div className="how-it-works-content"><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;