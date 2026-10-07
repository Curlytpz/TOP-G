import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";
import Reveal from "../motion/Reveal";
import { business } from "../../data/business";

function LegalPage({ content }) {
  return (
    <main className="tg-page tg-surface tg-legal">
      <PageHeader label={content.label} pageName={content.pageName} title={content.title} description={content.description} />
      <section className="tg-page-content">
        <div className="tg-page-container tg-legal-layout">
          <Reveal as="p" className="tg-legal-updated">{content.lastUpdated}</Reveal>
          <div className="tg-legal-sections">
            {content.sections.map((section, index) => (
              <Reveal as="article" key={section.title} delay={index * 55} className="tg-legal-section">
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
                {section.contact ? <address><strong>TOP-G Auto Seat</strong><a href={`mailto:${business.email}`}>{business.email}</a><span>{business.phoneNumbers.join(" / ")}</span><span>{business.location}</span><Link to="/contact">Visit the contact page</Link></address> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default LegalPage;