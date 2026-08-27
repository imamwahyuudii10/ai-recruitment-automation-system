import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Sparkles,
  Users,
} from "lucide-react";
import { demoApplicants, demoJobs } from "../data/demo";
import {
  RecommendationBadge,
  StatusBadge,
} from "../components/ui/StatusBadge";

export function JobsPage() {
  const openJobs = demoJobs.filter((job) => job.status === "OPEN").length;

  const totalApplicants = demoApplicants.length;

  const pendingReview = demoApplicants.filter(
    (applicant) => applicant.status === "PENDING_REVIEW",
  ).length;

  const strongMatches = demoApplicants.filter(
    (applicant) => applicant.ai_recommendation === "STRONG_MATCH",
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b18] px-6 py-7 text-white shadow-xl shadow-slate-900/5 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_12%_12%,rgba(124,58,237,0.30)_0,transparent_28%),radial-gradient(circle_at_88%_18%,rgba(14,165,233,0.18)_0,transparent_24%)]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Job Operations
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Jobs
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage open positions and monitor candidate pipelines,
              AI screening outcomes, and recruiter review queues.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeaderMetric label="Open Jobs" value={openJobs} />
            <HeaderMetric label="Applicants" value={totalApplicants} />
            <HeaderMetric label="Pending" value={pendingReview} />
            <HeaderMetric label="Strong Match" value={strongMatches} />
          </div>
        </div>
      </section>

      {/* SECTION HEADER */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600">
            Hiring Portfolio
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Active Positions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Candidate activity and AI-assisted hiring signals for every role.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          AI screening enabled
        </div>
      </section>

      {/* JOB CARDS */}

      <section className="grid gap-5 xl:grid-cols-3">
        {demoJobs.map((job) => {
          const applicants = demoApplicants.filter(
            (applicant) => applicant.job_id === job.id,
          );

          const pending = applicants.filter(
            (applicant) => applicant.status === "PENDING_REVIEW",
          ).length;

          const approved = applicants.filter(
            (applicant) => applicant.status === "APPROVED",
          ).length;

          const strong = applicants.filter(
            (applicant) =>
              applicant.ai_recommendation === "STRONG_MATCH",
          ).length;

          const analyzed = applicants.filter(
            (applicant) => applicant.ai_match_score != null,
          );

          const averageScore =
            analyzed.length > 0
              ? Math.round(
                  analyzed.reduce(
                    (sum, applicant) =>
                      sum + (applicant.ai_match_score ?? 0),
                    0,
                  ) / analyzed.length,
                )
              : 0;

          return (
            <article
              key={job.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* CARD TOP */}

              <div className="border-b border-slate-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                    <BriefcaseBusiness className="h-4 w-4" />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      job.status === "OPEN"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  {job.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-violet-600">
                  {job.department}
                </p>

                <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
                  {job.description}
                </p>
              </div>

              {/* METRICS */}

              <div className="grid grid-cols-2 gap-px bg-slate-100">
                <JobMetric
                  icon={Users}
                  label="Applicants"
                  value={applicants.length}
                />

                <JobMetric
                  icon={Clock3}
                  label="Pending Review"
                  value={pending}
                />

                <JobMetric
                  icon={Sparkles}
                  label="Strong Match"
                  value={strong}
                />

                <JobMetric
                  icon={CheckCircle2}
                  label="Approved"
                  value={approved}
                />
              </div>

              {/* AI SCORE */}

              <div className="p-5">
                <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-500">
                        AI Screening
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        Average candidate match
                      </p>
                    </div>

                    <p className="font-mono text-2xl font-semibold text-violet-700">
                      {analyzed.length ? `${averageScore}%` : "—"}
                    </p>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-violet-100">
                    <div
                      className="h-full rounded-full bg-violet-600"
                      style={{
                        width: analyzed.length
                          ? `${averageScore}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* RECENT CANDIDATES */}

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700">
                      Candidate Pipeline
                    </p>

                    <span className="text-[11px] text-slate-400">
                      {applicants.length} total
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {applicants.slice(0, 2).map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {applicant.full_name}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-slate-400">
                            {applicant.email}
                          </p>
                        </div>

                        <StatusBadge status={applicant.status} />
                      </div>
                    ))}

                    {!applicants.length && (
                      <div className="rounded-lg border border-dashed border-slate-200 px-3 py-5 text-center">
                        <p className="text-xs text-slate-400">
                          No applicants yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  View job pipeline
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* PIPELINE SUMMARY */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600">
              Portfolio Signals
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              Hiring Performance
            </h2>
          </div>

          <span className="text-xs text-slate-400">
            Across all current positions
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <SummaryCard
            label="Applications"
            value={totalApplicants}
            description="Candidates captured"
          />

          <SummaryCard
            label="Human Review"
            value={pendingReview}
            description="Needs recruiter decision"
          />

          <SummaryCard
            label="AI Strong Match"
            value={strongMatches}
            description="High-fit candidates"
          />

          <SummaryCard
            label="Open Positions"
            value={openJobs}
            description="Accepting applications"
          />
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
  value: number;
}) {
  return (
    <div className="min-w-[100px] rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function JobMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white p-4">
      <Icon className="h-3.5 w-3.5 text-slate-400" />

      <p className="mt-3 text-lg font-semibold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-2xl font-semibold text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {description}
      </p>
    </div>
  );
}