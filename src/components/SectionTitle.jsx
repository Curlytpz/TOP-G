import Reveal from "./motion/Reveal";

function SectionTitle({ eyebrow, title, description, align = "left" }) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && <Reveal as="p" className="text-xs font-bold uppercase tracking-[0.28em] text-red-500">{eyebrow}</Reveal>}
      <Reveal as="h2" delay={70} className="mt-4 text-[clamp(2rem,6vw,3rem)] font-black uppercase leading-none tracking-tight text-white">{title}</Reveal>
      {description && <Reveal as="p" delay={140} className="mt-5 text-[clamp(1rem,2vw,1.125rem)] leading-7 text-zinc-400">{description}</Reveal>}
    </div>
  );
}

export default SectionTitle;