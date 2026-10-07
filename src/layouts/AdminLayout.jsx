import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft, FolderKanban, LayoutDashboard, LogOut, MessageSquareQuote, Star, Wrench, Layers } from "lucide-react";
import PageTransition from "../components/motion/PageTransition";
import { useAuth } from "../hooks/useAuth";

const navigation = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/quotes", label: "Quotes", icon: MessageSquareQuote },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/materials", label: "Materials", icon: Layers },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
];

function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-shell min-h-screen overflow-x-clip bg-zinc-950 text-white">
      <header className="admin-header border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <Link to="/" className="min-w-0 text-lg font-black italic tracking-tight sm:text-xl">TOP-G <span className="text-red-500">ADMIN</span></Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-40 truncate text-sm font-semibold text-zinc-400 sm:block">{admin?.name}</span>
            <Link to="/" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-white"><ArrowLeft size={16} /> Public site</Link>
            <button type="button" onClick={handleLogout} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-white/10 px-3 text-sm font-bold text-zinc-300 transition hover:border-red-500/50 hover:text-white">
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-6 sm:py-10 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
        <aside className="admin-panel self-start rounded-xl border border-white/10 bg-black p-3 md:sticky md:top-6">
          <nav className="grid gap-1" aria-label="Admin navigation">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-sm font-bold transition ${isActive ? "bg-red-500/10 text-red-400" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0"><PageTransition><Outlet /></PageTransition></main>
      </div>
    </div>
  );
}

export default AdminLayout;
