import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { business, navigation } from "../data/business";

const footerLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Warranty & Service Terms", to: "/warranty" },
  { label: "Contact", to: "/contact" },
];

function Footer() {
  return (
    <footer className="site-footer border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:px-6 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.25fr_.7fr_.85fr_1fr] lg:gap-10">
        <div><Link to="/" className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1"><span className="text-3xl font-black italic tracking-tighter">TOP-G</span><span className="text-xs font-black tracking-[0.17em] text-red-500">AUTO SEAT</span></Link><p className="mt-5 max-w-sm leading-7 text-zinc-400">Custom automotive upholstery with a premium, personalized finish.</p><Link to="/quote" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-black uppercase tracking-wide text-red-400 hover:text-red-300">Start your quote <ArrowUpRight size={16} /></Link></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Explore</p><div className="mt-5 grid gap-3">{navigation.map((item) => <Link key={item.to} to={item.to} className="inline-flex min-h-8 items-center text-sm font-semibold text-zinc-300 hover:text-white">{item.label}</Link>)}</div></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Legal & help</p><nav aria-label="Legal and help"><div className="mt-5 grid gap-3">{footerLinks.map((item) => <Link key={item.to} to={item.to} className="inline-flex min-h-8 items-center text-sm font-semibold text-zinc-300 hover:text-white">{item.label}</Link>)}</div></nav></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Visit & Contact</p><div className="mt-5 grid gap-4 text-sm leading-6 text-zinc-300"><p className="flex gap-3"><MapPin className="mt-1 shrink-0 text-red-500" size={17} /><span>{business.location}<br /><span className="text-zinc-400">{business.locationLandmark}<br />{business.locationNote}</span></span></p><p className="flex gap-3"><Phone className="mt-1 shrink-0 text-red-500" size={17} /><span>{business.phoneNumbers.join(" / ")}</span></p><a className="flex min-w-0 gap-3 break-all hover:text-white" href={`mailto:${business.email}`}><Mail className="mt-1 shrink-0 text-red-500" size={17} /><span>{business.email}</span></a></div></div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 sm:px-6"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:justify-between"><span>© {business.name}. All rights reserved.</span><span>Business hours: {business.businessHours}</span></div></div>
    </footer>
  );
}

export default Footer;