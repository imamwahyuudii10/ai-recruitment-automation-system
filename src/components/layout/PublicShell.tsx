import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

export function PublicShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="Hireloop careers home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-white">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                Hireloop
              </div>
              <div className="text-[11px] text-slate-500">Careers</div>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Public navigation"
          >
            <NavLink
              to="/careers"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Open roles
            </NavLink>
            <a
              href="#life"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Life at Hireloop
            </a>
            <a
              href="#values"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Values
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/admin"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Recruiter portal
            </Link>
            <a
              href="#open-roles"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View open roles
            </a>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link
                to="/careers"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Open roles
              </Link>
              <a
                href="#life"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Life at Hireloop
              </a>
              <a
                href="#values"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Values
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-medium text-slate-700">Hireloop Careers</p>
            <p className="mt-1 text-xs">
              A human-led hiring experience supported by intelligent automation.
            </p>
          </div>
          <p className="text-xs">
            © 2026 Hireloop. Equal opportunity employer.
          </p>
        </div>
      </footer>
    </div>
  );
}
