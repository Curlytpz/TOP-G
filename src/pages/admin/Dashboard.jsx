import { FileText, Image, Layers, Wrench } from "lucide-react";
import Reveal from "../../components/motion/Reveal";

const cards = [
  { label: "Quote requests", value: "—", icon: FileText },
  { label: "Materials", value: "3", icon: Layers },
  { label: "Services", value: "8", icon: Wrench },
  { label: "Project images", value: "—", icon: Image },
];

function Dashboard() {
  return (
    <section>
      <Reveal as="p" className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Admin dashboard</Reveal>
      <Reveal as="h1" delay={70} className="mt-3 text-[clamp(2rem,6vw,2.5rem)] font-black">TOP-G overview</Reveal>
      <Reveal as="p" delay={140} className="mt-3 max-w-xl leading-7 text-zinc-400">This is a starter dashboard shell. Data management and authentication are intentionally not connected yet.</Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }, index) => <Reveal as="article" key={label} delay={index * 90} className="admin-card min-w-0 rounded-xl border border-white/10 bg-black p-5"><Icon className="text-red-500" size={20} /><p className="mt-8 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-zinc-500">{label}</p></Reveal>)}
      </div>
    </section>
  );
}

export default Dashboard;