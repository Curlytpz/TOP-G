import { Menu, X, ArrowUpRight, Moon, Sun } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { navigation } from "../data/business";
import useTheme from "../hooks/useTheme";

const navLinkClass = ({ isActive }) => `text-sm font-bold transition hover:text-red-400 ${isActive ? "text-red-500" : "text-zinc-300"}`;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return <button type="button" onClick={toggleTheme} className="theme-toggle grid h-11 w-11 place-items-center rounded-sm border border-white/15 text-white" aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"} title={isDark ? "Switch to light theme" : "Switch to dark theme"}>{isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-navbar fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" onClick={closeMenu} className="group flex min-w-0 items-baseline gap-1.5 sm:gap-2" aria-label="TOP-G Auto Seat home"><span className="text-xl font-black italic tracking-tighter text-white sm:text-2xl">TOP-G</span><span className="text-[10px] font-black tracking-[0.13em] text-red-500 sm:text-xs sm:tracking-[0.16em]">AUTO SEAT</span></Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">{navigation.map((item) => <NavLink key={item.to} to={item.to} className={navLinkClass}>{item.label}</NavLink>)}<ThemeToggle /><Link to="/quote" className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-sm bg-red-600 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-500">Get a Quote<ArrowUpRight size={16} /></Link></nav>
        <div className="flex shrink-0 items-center gap-2 lg:hidden"><ThemeToggle /><button type="button" className="grid h-11 w-11 place-items-center rounded-sm border border-white/15 text-white" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen}>{isOpen ? <X size={20} /> : <Menu size={21} />}</button></div>
      </div>
      {isOpen && <nav className="site-mobile-menu max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-white/10 bg-zinc-950 px-4 py-4 sm:px-5 sm:py-5 lg:hidden" aria-label="Mobile navigation"><div className="mx-auto flex max-w-7xl flex-col gap-1">{navigation.map((item) => <NavLink key={item.to} to={item.to} onClick={closeMenu} className={({ isActive }) => `flex min-h-11 items-center rounded-md px-3 py-3 text-base font-bold ${isActive ? "bg-red-500/10 text-red-400" : "text-zinc-200"}`}>{item.label}</NavLink>)}<Link to="/quote" onClick={closeMenu} className="mt-3 flex min-h-12 items-center justify-center rounded-sm bg-red-600 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-white">Get a Quote</Link></div></nav>}
    </header>
  );
}

export default Navbar;