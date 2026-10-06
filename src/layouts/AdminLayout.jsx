import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import PageTransition from "../components/motion/PageTransition";

function AdminLayout() {
  return (
    <div className="admin-shell min-h-screen overflow-x-clip bg-zinc-950 text-white">
      <header className="admin-header border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <Link to="/" className="min-w-0 text-lg font-black italic tracking-tight sm:text-xl">TOP-G <span className="text-red-500">ADMIN</span></Link>
          <Link to="/" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"><ArrowLeft size={16} /> Public site</Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-6 sm:py-10 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
        <aside className="admin-panel self-start rounded-xl border border-white/10 bg-black p-3 md:sticky md:top-6">
          <Link to="/admin" className="flex min-h-11 items-center gap-3 rounded-md bg-red-500/10 px-3 py-3 text-sm font-bold text-red-400"><LayoutDashboard size={18} /> Dashboard</Link>
        </aside>
        <main className="min-w-0"><PageTransition><Outlet /></PageTransition></main>
      </div>
    </div>
  );
}

export default AdminLayout;