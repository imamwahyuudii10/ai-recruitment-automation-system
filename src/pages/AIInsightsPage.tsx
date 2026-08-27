import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Gauge,
  Sparkles,
  Target,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { demoApplicants } from "../data/demo";

export function AIInsightsPage() {
  const analyzed = demoApplicants.filter(
    (applicant) => applicant.ai_match_score != null,
  );

  const highMatch = analyzed.filter(
    (applicant) => (applicant.ai_match_score ?? 0) >= 80,
  ).length;

  const review = demoApplicants.filter(
    (applicant) => applicant.ai_recommendation === "REVIEW",
  ).length;

  const strongMatch = demoApplicants.filter(
    (applicant) => applicant.ai_recommendation === "STRONG_MATCH",
  ).length;

  const notQualified = demoApplicants.filter(
    (applicant) => applicant.ai_recommendation === "NOT_QUALIFIED",
  ).length;

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

  const skills = Object.entries(
    analyzed
      .flatMap((applicant) => applicant.ai_skills)
      .reduce<Record<string, number>>(
        (map, skill) => ({
          ...map,
          [skill]: (map[skill] ?? 0) + 1,
        }),
        {},
      ),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  const recommendationTotal = Math.max(
    strongMatch + review + notQualified,
    1,
  );

  const recommendationData = [
    {
      label: "Strong Match",
      value: strongMatch,
      percent: (strongMatch / recommendationTotal) * 100,
      tone: "emerald",
    },
    {
      label: "Review",
      value: review,
      percent: (review / recommendationTotal) * 100,
      tone: "amber",
    },
    {
      label: "Not Qualified",
      value: notQualified,
      percent: (notQualified / recommendationTotal) * 100,
      tone: "slate",
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b18] px-6 py-7 text-white shadow-xl shadow-slate-900/5 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_12%_12%,rgba(124,58,237,0.32)_0,transparent_28%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.18)_0,transparent_24%)]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI Candidate Intelligence
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              AI Insights
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Operational intelligence from AI-assisted candidate
              screening, match analysis, skills detection, and hiring
              recommendations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <HeaderMetric
              label="Analyzed"
              value={analyzed.length}
            />

            <HeaderMetric
              label="Strong Match"
              value={strongMatch}
            />

            <HeaderMetric
              label="Human Review"
              value={review}
            />
          </div>
        </div>
      </section>

      {/* KPI */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Gauge}
          label="Average Match Score"
          value={`${averageScore}%`}
          description="Across AI-analyzed candidates"
        />

        <MetricCard
          icon={Target}
          label="High Match Candidates"
          value={highMatch}
          description="Candidates scoring 80 or above"
        />

        <MetricCard
          icon={UserRoundCheck}
          label="Requires Human Review"
          value={review}
          description="Recruiter judgment required"
        />

        <MetricCard
          icon={Users}
          label="Analyzed Candidates"
          value={analyzed.length}
          description="Completed AI screening"
        />
      </section>

      {/* MAIN CONTENT */}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        {/* SKILLS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
                <BrainCircuit className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-500">
                  Skill Intelligence
                </p>

                <h2 className="font-semibold text-slate-950">
                  Top Detected Skills
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Most frequently identified candidate skills.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-5">
              {skills.map(([skill, count], index) => {
                const max = Math.max(
                  ...skills.map(([, value]) => value),
                  1,
                );

                const width = Math.max(
                  (count / max) * 100,
                  8,
                );

                return (
                  <div key={skill}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 font-mono text-[10px] font-semibold text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          {skill}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {!skills.length && (
                <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No AI skill data yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Skills will appear after candidates are analyzed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECOMMENDATION DISTRIBUTION */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <Target className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Recommendation Distribution
              </p>

              <h2 className="font-semibold text-slate-950">
                AI Screening Outcomes
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {recommendationData.map((item) => (
              <RecommendationRow
                key={item.label}
                label={item.label}
                value={item.value}
                percent={item.percent}
                tone={item.tone}
              />
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50 p-4">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

              <p className="text-xs leading-5 text-violet-800">
                Recommendations are generated as decision support.
                Recruiters remain responsible for every final hiring
                decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GAPS + HIGH MATCH */}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-600">
              Candidate Risk Signals
            </p>

            <h2 className="mt-1 font-semibold text-slate-950">
              Common Candidate Gaps
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recurring weaknesses detected during screening.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                label: "Minimum years of professional experience",
                count: 3,
              },
              {
                label: "Enterprise design-system ownership",
                count: 2,
              },
              {
                label: "Advanced infrastructure exposure",
                count: 1,
              },
            ].map((gap) => (
              <div
                key={gap.label}
                className="flex items-center justify-between gap-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                  <p className="text-sm leading-5 text-amber-900">
                    {gap.label}
                  </p>
                </div>

                <span className="grid h-7 min-w-7 place-items-center rounded-lg bg-white px-2 font-mono text-xs font-semibold text-amber-700">
                  {gap.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
              High Potential
            </p>

            <h2 className="mt-1 font-semibold text-slate-950">
              High Match Candidates
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Candidates with strong AI-assisted screening results.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {analyzed
              .filter(
                (applicant) =>
                  (applicant.ai_match_score ?? 0) >= 80,
              )
              .sort(
                (a, b) =>
                  (b.ai_match_score ?? 0) -
                  (a.ai_match_score ?? 0),
              )
              .slice(0, 4)
              .map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {applicant.full_name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {applicant.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg font-semibold text-emerald-700">
                      {applicant.ai_match_score}
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      Match
                    </p>
                  </div>
                </div>
              ))}

            {!highMatch && (
              <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
                <p className="text-sm text-slate-400">
                  No high-match candidates yet.
                </p>
              </div>
            )}
          </div>

          <Link
            to="/admin/candidates"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-800"
          >
            Review candidate pipeline
            <ArrowRight className="h-4 w-4" />
          </Link>
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
    <div className="min-w-[110px] rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Gauge;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>

        <Sparkles className="h-4 w-4 text-violet-300" />
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function RecommendationRow({
  label,
  value,
  percent,
  tone,
}: {
  label: string;
  value: number;
  percent: number;
  tone: "emerald" | "amber" | "slate";
}) {
  const barClass = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    slate: "bg-slate-500",
  }[tone];

  const badgeClass = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  }[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeClass}`}
          >
            {label}
          </span>
        </div>

        <span className="font-mono text-xs font-semibold text-slate-500">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{
            width: `${Math.max(
              percent,
              value ? 8 : 0,
            )}%`,
          }}
        />
      </div>
    </div>
  );
}