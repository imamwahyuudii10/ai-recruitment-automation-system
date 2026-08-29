import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Gauge,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  RecommendationBadge,
  StatusBadge,
} from "../components/ui/StatusBadge";
import {
  getApplicants,
  getJobs,
} from "../services/dataService";
import type {
  Applicant,
  Job,
} from "../types";

export function DashboardPage() {
  const [applicants, setApplicants] =
    useState<Applicant[]>([]);

  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          applicantData,
          jobData,
        ] = await Promise.all([
          getApplicants(),
          getJobs(),
        ]);

        if (!active) return;

        setApplicants(
          applicantData,
        );

        setJobs(
          jobData,
        );
      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err,
        );

        if (!active) return;

        setError(
          "Unable to load dashboard data from Supabase.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const total =
      applicants.length;

    const pending =
      applicants.filter(
        (applicant) =>
          applicant.status ===
          "PENDING_REVIEW",
      ).length;

    const approved =
      applicants.filter(
        (applicant) =>
          applicant.status ===
          "APPROVED",
      ).length;

    const rejected =
      applicants.filter(
        (applicant) =>
          applicant.status ===
          "REJECTED",
      ).length;

    const analyzedApplicants =
      applicants.filter(
        (applicant) =>
          applicant.ai_match_score !=
          null,
      );

    const scores =
      analyzedApplicants
        .map(
          (applicant) =>
            applicant.ai_match_score,
        )
        .filter(
          (
            value,
          ): value is number =>
            value != null,
        );

    const avg =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (
                sum,
                score,
              ) => sum + score,
              0,
            ) /
              scores.length,
          )
        : 0;

    const openJobs =
      jobs.filter(
        (job) =>
          job.status === "OPEN",
      ).length;

    const strongMatches =
      applicants.filter(
        (applicant) =>
          applicant.ai_recommendation ===
          "STRONG_MATCH",
      ).length;

    const gapCounts =
      applicants
        .flatMap(
          (applicant) =>
            applicant.ai_gaps ??
            [],
        )
        .reduce<
          Record<
            string,
            number
          >
        >(
          (
            map,
            gap,
          ) => {
            map[gap] =
              (map[gap] ??
                0) + 1;

            return map;
          },
          {},
        );

    const mostCommonGap =
      Object.entries(
        gapCounts,
      ).sort(
        (a, b) =>
          b[1] - a[1],
      )[0]?.[0] ??
      "No data";

    return {
      total,
      pending,
      approved,
      rejected,
      analyzed:
        analyzedApplicants.length,
      avg,
      openJobs,
      strongMatches,
      mostCommonGap,
    };
  }, [
    applicants,
    jobs,
  ]);

  const stats = [
    {
      label:
        "Total Applicants",
      value:
        metrics.total,
      description:
        "Across active hiring pipelines",
      icon: Users,
    },
    {
      label:
        "Pending Review",
      value:
        metrics.pending,
      description:
        "Waiting for recruiter decision",
      icon: Clock3,
    },
    {
      label: "Approved",
      value:
        metrics.approved,
      description:
        "Candidates moved forward",
      icon:
        CheckCircle2,
    },
    {
      label: "Rejected",
      value:
        metrics.rejected,
      description:
        "Final decisions recorded",
      icon: XCircle,
    },
    {
      label:
        "Avg AI Match",
      value: `${metrics.avg}%`,
      description: `${metrics.analyzed} candidates analyzed`,
      icon: Gauge,
    },
    {
      label: "Open Jobs",
      value:
        metrics.openJobs,
      description:
        "Currently accepting applications",
      icon:
        BriefcaseBusiness,
    },
  ];

  const pipeline = [
    {
      label: "New",
      value:
        applicants.filter(
          (applicant) =>
            applicant.status ===
            "NEW",
        ).length,
    },
    {
      label:
        "AI Analyzed",
      value:
        applicants.filter(
          (applicant) =>
            applicant.status ===
            "AI_ANALYZED",
        ).length,
    },
    {
      label:
        "Pending Review",
      value:
        metrics.pending,
    },
    {
      label: "Approved",
      value:
        metrics.approved,
    },
    {
      label: "Rejected",
      value:
        metrics.rejected,
    },
  ];

  const maxPipeline =
    Math.max(
      ...pipeline.map(
        (item) =>
          item.value,
      ),
      1,
    );

  if (loading) {
    return (
      <DashboardLoading />
    );
  }

  if (error) {
    return (
      <DashboardError
        message={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b18] px-6 py-7 text-white shadow-xl shadow-slate-900/5 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_10%,rgba(124,58,237,0.30)_0,transparent_28%),radial-gradient(circle_at_88%_15%,rgba(14,165,233,0.20)_0,transparent_26%)]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />

              AI Recruitment Operations
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Recruitment Command Center
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Monitor candidate intake,
              AI screening, recruiter
              review, and hiring decisions
              from one operational
              workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                Review queue
              </p>

              <p className="mt-1 text-xl font-semibold">
                {
                  metrics.pending
                }
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                Strong AI matches
              </p>

              <p className="mt-1 text-xl font-semibold">
                {
                  metrics.strongMatches
                }
              </p>
            </div>

            <Link
              to="/admin/candidates"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Review candidates

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* KPI */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map(
          ({
            label,
            value,
            description,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>

                <TrendingUp className="h-4 w-4 text-slate-300 transition group-hover:text-violet-500" />
              </div>

              <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                {value}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-700">
                {label}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                {description}
              </p>
            </div>
          ),
        )}
      </section>

      {/* MAIN */}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        {/* RECENT CANDIDATES */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600">
                Live pipeline
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Recent Candidates
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest applicants and AI
                screening outcomes
              </p>
            </div>

            <Link
              to="/admin/candidates"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all candidates

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {applicants.length >
          0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    <tr>
                      <th className="px-5 py-3">
                        Candidate
                      </th>

                      <th className="px-4 py-3">
                        Position
                      </th>

                      <th className="px-4 py-3">
                        AI Match
                      </th>

                      <th className="px-4 py-3">
                        Recommendation
                      </th>

                      <th className="px-4 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {applicants
                      .slice(
                        0,
                        5,
                      )
                      .map(
                        (
                          applicant,
                        ) => {
                          const job =
                            jobs.find(
                              (
                                item,
                              ) =>
                                item.id ===
                                applicant.job_id,
                            );

                          const initials =
                            applicant.full_name
                              .split(
                                " ",
                              )
                              .map(
                                (
                                  part,
                                ) =>
                                  part[0],
                              )
                              .slice(
                                0,
                                2,
                              )
                              .join(
                                "",
                              );

                          return (
                            <tr
                              key={
                                applicant.id
                              }
                              className="transition hover:bg-slate-50/80"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                    {
                                      initials
                                    }
                                  </div>

                                  <div className="min-w-0">
                                    <Link
                                      to={`/admin/candidates/${applicant.id}`}
                                      className="font-semibold text-slate-900 transition hover:text-indigo-600"
                                    >
                                      {
                                        applicant.full_name
                                      }
                                    </Link>

                                    <p className="truncate text-xs text-slate-400">
                                      {
                                        applicant.email
                                      }
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {job?.title ??
                                  "Unassigned"}
                              </td>

                              {/* COLORED AI SCORE */}

                              <td className="px-4 py-4">
                                <MatchScoreBadge
                                  score={
                                    applicant.ai_match_score
                                  }
                                />
                              </td>

                              <td className="px-4 py-4">
                                <RecommendationBadge
                                  value={
                                    applicant.ai_recommendation
                                  }
                                />
                              </td>

                              <td className="px-4 py-4">
                                <StatusBadge
                                  status={
                                    applicant.status
                                  }
                                />
                              </td>
                            </tr>
                          );
                        },
                      )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                <p className="text-xs text-slate-400">
                  {
                    applicants.length
                  }{" "}
                  candidates in workspace
                </p>

                <p className="text-xs font-medium text-slate-500">
                  Human decision required
                  before final outcome
                </p>
              </div>
            </>
          ) : (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-4 text-sm font-semibold text-slate-800">
                No applicants yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                New applications will
                appear here
                automatically.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">
          {/* AI INTELLIGENCE */}

          <div className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white">
            <div className="border-b border-violet-100 px-5 py-5">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-700">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-500">
                    AI Intelligence
                  </p>

                  <h2 className="font-semibold text-slate-950">
                    Recruitment Signals
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <Insight
                label="Waiting for human review"
                value={String(
                  metrics.pending,
                )}
              />

              <Insight
                label="Strong AI match candidates"
                value={String(
                  metrics.strongMatches,
                )}
              />

              <Insight
                label="Average candidate match"
                value={`${metrics.avg}%`}
              />

              <Insight
                label="Most common candidate gap"
                value={
                  metrics.mostCommonGap
                }
              />

              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs leading-5 text-violet-800">
                  AI provides structured
                  decision support.
                  Recruiters remain
                  responsible for every
                  final hiring decision.
                </p>
              </div>

              <Link
                to="/admin/ai-insights"
                className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-800"
              >
                Open AI Insights

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* PIPELINE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-slate-600" />

              <h2 className="font-semibold text-slate-950">
                Hiring Pipeline
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Candidate distribution by
              workflow stage
            </p>

            <div className="mt-6 space-y-5">
              {pipeline.map(
                (item) => {
                  const width =
                    Math.max(
                      (item.value /
                        maxPipeline) *
                        100,
                      item.value
                        ? 10
                        : 0,
                    );

                  return (
                    <div
                      key={
                        item.label
                      }
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">
                          {
                            item.label
                          }
                        </span>

                        <span className="font-mono text-xs font-semibold text-slate-500">
                          {
                            item.value
                          }
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-800"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AUTOMATION HEALTH */}

      <section className="grid gap-4 md:grid-cols-3">
        <OperationalCard
          icon={Workflow}
          title="Automation Pipeline"
          value="Operational"
          description="Application capture, CV processing, and decision routing."
        />

        <OperationalCard
          icon={Sparkles}
          title="AI Screening"
          value="Active"
          description="Candidate intelligence available for recruiter review."
        />

        <OperationalCard
          icon={
            CheckCircle2
          }
          title="Human Control"
          value="Enabled"
          description="Final hiring decisions remain recruiter-led."
        />
      </section>
    </div>
  );
}

/* =====================================================
   AI MATCH SCORE
===================================================== */

function MatchScoreBadge({
  score,
}: {
  score:
    | number
    | null;
}) {
  if (score == null) {
    return (
      <span className="inline-flex min-w-[62px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-400">
        —
      </span>
    );
  }

  let classes =
    "";

  if (score >= 80) {
    classes =
      "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (
    score >= 60
  ) {
    classes =
      "border-amber-200 bg-amber-50 text-amber-700";
  } else {
    classes =
      "border-rose-200 bg-rose-50 text-rose-700";
  }

  return (
    <span
      className={`inline-flex min-w-[62px] items-center justify-center rounded-lg border px-3 py-1.5 font-mono text-xs font-bold ${classes}`}
    >
      {score}%
    </span>
  );
}

/* =====================================================
   INSIGHT
===================================================== */

function Insight({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-violet-100 pb-4 last:border-0 last:pb-0">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   OPERATION CARD
===================================================== */

function OperationalCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon:
    typeof Workflow;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
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

/* =====================================================
   LOADING
===================================================== */

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({
          length: 6,
        }).map(
          (
            _,
            index,
          ) => (
            <div
              key={
                index
              }
              className="h-40 animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>

      <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

/* =====================================================
   ERROR
===================================================== */

function DashboardError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
      <p className="font-semibold text-rose-900">
        Dashboard data unavailable
      </p>

      <p className="mt-2 text-sm text-rose-700">
        {message}
      </p>
    </div>
  );
}