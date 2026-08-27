import {
  Bell,
  Bot,
  Building2,
  CheckCircle2,
  ExternalLink,
  Plug,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";

const sections = [
  {
    title: "Organization",
    description:
      "Company profile, hiring defaults, and workspace preferences.",
    icon: Building2,
    status: "Ready",
  },
  {
    title: "Recruitment Preferences",
    description:
      "Configure review behavior and candidate workflow defaults.",
    icon: Settings2,
    status: "Foundation",
  },
  {
    title: "AI Screening",
    description:
      "Control how AI-assisted analysis is presented to recruiters.",
    icon: Bot,
    status: "Active",
  },
  {
    title: "Notifications",
    description:
      "Choose operational alerts and recruitment notifications.",
    icon: Bell,
    status: "Foundation",
  },
  {
    title: "Integrations",
    description:
      "Supabase, n8n, Gmail, and future recruitment integrations.",
    icon: Plug,
    status: "Connected",
  },
  {
    title: "Account",
    description:
      "Recruiter profile, workspace access, and account preferences.",
    icon: UserRound,
    status: "Ready",
  },
] as const;

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b18] px-6 py-7 text-white shadow-xl shadow-slate-900/5 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_12%_12%,rgba(124,58,237,0.30)_0,transparent_28%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.18)_0,transparent_24%)]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Settings2 className="h-3.5 w-3.5" />
              Workspace Configuration
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Configure recruitment preferences, AI-assisted
              screening foundations, integrations, and workspace
              behavior.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <HeaderMetric
              label="Workspace"
              value="Demo"
            />

            <HeaderMetric
              label="AI"
              value="Active"
            />

            <HeaderMetric
              label="Automation"
              value="Ready"
            />
          </div>
        </div>
      </section>

      {/* SYSTEM STATUS */}

      <section className="grid gap-4 md:grid-cols-3">
        <SystemCard
          icon={Workflow}
          title="Automation Engine"
          value="Operational"
          description="n8n workflow foundations are configured for the recruitment lifecycle."
        />

        <SystemCard
          icon={Sparkles}
          title="AI Screening"
          value="Active"
          description="AI-assisted candidate intelligence supports recruiter review."
        />

        <SystemCard
          icon={ShieldCheck}
          title="Human Control"
          value="Enabled"
          description="Final hiring decisions remain recruiter-led."
        />
      </section>

      {/* SETTINGS GRID */}

      <section className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <article
              key={section.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-violet-50 group-hover:text-violet-700">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-semibold text-slate-950">
                      {section.title}
                    </h2>

                    <StatusPill
                      value={section.status}
                    />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {section.description}
                  </p>

                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-400"
                  >
                    Configuration coming soon
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* INTEGRATION STACK */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600">
            Integration Stack
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Recruitment Infrastructure
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Core services powering the application,
            automation, AI analysis, and communication flow.
          </p>
        </div>

        <div className="grid gap-px bg-slate-100 md:grid-cols-4">
          <IntegrationCard
            title="Supabase"
            subtitle="Database + Storage"
            status="Connected"
          />

          <IntegrationCard
            title="n8n"
            subtitle="Workflow Automation"
            status="Connected"
          />

          <IntegrationCard
            title="Gemini"
            subtitle="AI Candidate Analysis"
            status="Active"
          />

          <IntegrationCard
            title="Gmail"
            subtitle="Candidate Communication"
            status="Connected"
          />
        </div>
      </section>

      {/* DEMO NOTICE */}

      <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-violet-950">
                Portfolio Demo Workspace
              </p>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-violet-800">
                Settings are intentionally presented as product
                foundations. Production configuration should be
                connected only where backend capability exists.
              </p>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            Candidate site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}

function HeaderMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[100px] rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function SystemCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: typeof Workflow;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {value}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatusPill({
  value,
}: {
  value: string;
}) {
  const tone =
    value === "Active" || value === "Connected"
      ? "bg-emerald-50 text-emerald-700"
      : value === "Ready"
        ? "bg-sky-50 text-sky-700"
        : "bg-slate-100 text-slate-500";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${tone}`}
    >
      {value}
    </span>
  );
}

function IntegrationCard({
  title,
  subtitle,
  status,
}: {
  title: string;
  subtitle: string;
  status: string;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
          <Plug className="h-4 w-4" />
        </div>

        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
        {status}
      </p>
    </div>
  );
}