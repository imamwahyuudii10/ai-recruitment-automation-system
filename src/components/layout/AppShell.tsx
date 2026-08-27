import {
  Activity as ActivityIcon,
  Bell,
  Bot,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

const nav = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/candidates",
    label: "Candidates",
    icon: Users,
  },
  {
    to: "/admin/jobs",
    label: "Jobs",
    icon: BriefcaseBusiness,
  },
  {
    to: "/admin/ai-insights",
    label: "AI Insights",
    icon: Sparkles,
  },
  {
    to: "/admin/activity",
    label: "Activity",
    icon: ActivityIcon,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

function SidebarContent({
  collapsed,
  close,
}: {
  collapsed: boolean;
  close?: () => void;
}) {
  return (
    <>
      {/* Brand */}

      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
          <Bot className="h-5 w-5" />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white">
              Hireloop
            </p>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Recruitment OS
            </p>
          </div>
        )}

        {close && (
          <button
            type="button"
            onClick={close}
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Workspace Label */}

      {!collapsed && (
        <div className="px-4 pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Workspace
          </p>
        </div>
      )}

      {/* Navigation */}

      <nav className="space-y-1.5 p-3">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={close}
            end={to === "/admin"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              [
                "group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                isActive
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4 shrink-0" />

            {!collapsed && (
              <span className="truncate">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}

      <div className="mt-auto border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.07] p-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />

                <p className="text-xs font-semibold text-violet-200">
                  AI-assisted hiring
                </p>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                AI provides candidate intelligence.
                Recruiters make every final decision.
              </p>
            </div>

            <NavLink
              to="/"
              className="flex h-10 items-center justify-between rounded-lg px-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <span>
                Candidate site
              </span>

              <ExternalLink className="h-3.5 w-3.5" />
            </NavLink>
          </div>
        ) : (
          <NavLink
            to="/"
            title="Candidate site"
            className="grid h-10 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </NavLink>
        )}
      </div>
    </>
  );
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);

  const location = useLocation();

  const current =
    nav.find((item) =>
      item.to === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(item.to),
    )?.label ?? "Workspace";

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* Desktop Sidebar */}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-900 bg-[#070b18] transition-[width] duration-200 lg:flex",
          collapsed
            ? "w-[76px]"
            : "w-[248px]",
        ].join(" ")}
      >
        <SidebarContent collapsed={collapsed} />

        <button
          type="button"
          onClick={() =>
            setCollapsed((value) => !value)
          }
          className="absolute -right-3.5 top-24 grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-slate-950"
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar */}

      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobile(false)}
          />

          <aside className="absolute inset-y-0 left-0 flex w-[290px] flex-col bg-[#070b18] shadow-2xl">
            <SidebarContent
              collapsed={false}
              close={() => setMobile(false)}
            />
          </aside>
        </div>
      )}

      {/* Workspace */}

      <div
        className={
          collapsed
            ? "lg:pl-[76px]"
            : "lg:pl-[248px]"
        }
      >
        {/* Topbar */}

        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[76px] items-center gap-4 px-4 md:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobile(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Current Area */}

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <span>
                  Recruiter Workspace
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span className="text-violet-600">
                  Demo
                </span>
              </div>

              <p className="mt-1 truncate text-base font-semibold tracking-tight text-slate-950">
                {current}
              </p>
            </div>

            {/* Search */}

            <div className="ml-auto hidden w-full max-w-[360px] md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  placeholder="Search candidates, jobs..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </div>
            </div>

            {/* Notification */}

            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500 ring-2 ring-white" />
            </button>

            {/* Recruiter */}

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-white">
                <CircleUserRound className="h-4 w-4" />
              </div>

              <div className="hidden pr-1 sm:block">
                <p className="text-xs font-semibold text-slate-900">
                  Recruiter
                </p>

                <p className="text-[10px] text-slate-400">
                  Demo Workspace
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}

        <main className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}