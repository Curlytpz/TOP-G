import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLogin() {
  const { admin, isLoading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const destination = location.state?.from || "/admin";

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 px-5 text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">
        Checking secure session...
      </main>
    );
  }

  if (admin) {
    return <Navigate to={destination} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(destination, { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 shadow-2xl shadow-black/40 sm:p-8">
        <a href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-white">
          <ArrowLeft size={16} /> Back to public site
        </a>
        <div className="mb-8">
          <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-full bg-red-500/15 text-red-400">
            <LockKeyhole size={20} />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">TOP-G Auto Seat</p>
          <h1 className="mt-2 text-3xl font-black italic tracking-tight">ADMIN ACCESS</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Sign in to access the protected management area.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 w-full rounded-lg border border-white/15 bg-zinc-900 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/25"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-12 w-full rounded-lg border border-white/15 bg-zinc-900 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/25"
              placeholder="Enter your password"
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300" role="alert">
              {error}
            </p>
          ) : null}

          <button
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-black tracking-wide text-white transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-65"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </section>
    </main>
  );
}
