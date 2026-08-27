import {
  ArrowRight,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { demoApplicants, demoJobs } from "../data/demo";
import {
  RecommendationBadge,
  ScoreBadge,
  StatusBadge,
} from "../components/ui/StatusBadge";

export function CandidatesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [recommendation, setRecommendation] = useState("ALL");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return demoApplicants.filter((applicant) => {
      const job = demoJobs.find(
        (item) => item.id === applicant.job_id,
      );

      const matchesSearch =
        !term ||
        [
          applicant.full_name,
          applicant.email,
          job?.title ?? "",
          job?.department ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        status === "ALL" || applicant.status === status;

      const matchesRecommendation =
        recommendation === "ALL" ||
        applicant.ai_recommendation === recommendation;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRecommendation
      );
    });
  }, [query, status, recommendation]);

  const pendingReview = demoApplicants.filter(
    (item) => item.status === "PENDING_REVIEW",
  ).length;

  const strongMatches = demoApplicants.filter(
    (item) => item.ai_recommendation === "STRONG_MATCH",
  ).length;

  const analyzed = demoApplicants.filter(
    (item) => item.ai_match_score != null,
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b18] px-6 py-7 text-white shadow-xl shadow-slate-900/5 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_10%_10%,rgba(124,58,237,0.28)_0,transparent_27%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.18)_0,transparent_25%)]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Users className="h-3.5 w-3.5" />
              Candidate Operations
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Candidates
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review every applicant from initial capture to AI
              screening and final recruiter decision.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
            <HeaderMetric
              label="Total"
              value={demoApplicants.length}
            />
            <HeaderMetric
              label="Pending"
              value={pendingReview}
            />
            <HeaderMetric
              label="Strong Match"
              value={strongMatches}
            />
          </div>
        </div>
      </section>

      {/* FILTERS */}

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600">
                Candidate Directory
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Hiring Pipeline
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and filter candidates by workflow stage
                and AI recommendation.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              {analyzed} candidates analyzed by AI
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-b border-slate-100 p-4 lg:grid-cols-[minmax(280px,1fr)_220px_220px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search name, email, role..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
            />
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
          >
            <option value="ALL">
              All statuses
            </option>
            <option value="NEW">
              New
            </option>
            <option value="AI_ANALYZED">
              AI Analyzed
            </option>
            <option value="PENDING_REVIEW">
              Pending Review
            </option>
            <option value="APPROVED">
              Approved
            </option>
            <option value="REJECTED">
              Rejected
            </option>
            <option value="NOT_QUALIFIED">
              Not Qualified
            </option>
          </select>

          <select
            value={recommendation}
            onChange={(event) =>
              setRecommendation(event.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
          >
            <option value="ALL">
              All AI recommendations
            </option>
            <option value="STRONG_MATCH">
              Strong Match
            </option>
            <option value="REVIEW">
              Review
            </option>
            <option value="NOT_QUALIFIED">
              Not Qualified
            </option>
          </select>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            More filters
          </button>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.13em] text-slate-400">
              <tr>
                <th className="px-5 py-3.5">
                  Candidate
                </th>
                <th className="px-4 py-3.5">
                  Position
                </th>
                <th className="px-4 py-3.5">
                  AI Match
                </th>
                <th className="px-4 py-3.5">
                  Recommendation
                </th>
                <th className="px-4 py-3.5">
                  Status
                </th>
                <th className="px-4 py-3.5">
                  Applied
                </th>
                <th className="px-5 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((applicant) => {
                const job = demoJobs.find(
                  (item) =>
                    item.id === applicant.job_id,
                );

                const initials = applicant.full_name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("");

                return (
                  <tr
                    key={applicant.id}
                    className="group transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <Link
                            to={`/admin/candidates/${applicant.id}`}
                            className="truncate text-sm font-semibold text-slate-900 transition hover:text-violet-600"
                          >
                            {applicant.full_name}
                          </Link>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {job?.title ?? "Unassigned"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {job?.department ??
                          "No department"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <ScoreBadge
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
                        status={applicant.status}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-600">
                        {new Date(
                          applicant.created_at,
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Application received
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/candidates/${applicant.id}`}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                      >
                        Review
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* EMPTY */}

        {!filtered.length && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500">
              <Filter className="h-5 w-5" />
            </div>

            <p className="mt-4 font-semibold text-slate-900">
              No candidates found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter
              criteria.
            </p>
          </div>
        )}

        {/* FOOTER */}

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span>
              {filtered.length} candidates shown
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span className="hidden sm:inline">
              {demoApplicants.length} total in workspace
            </span>
          </div>

          <div className="flex items-center gap-2">
            <UserRoundCheck className="h-3.5 w-3.5 text-violet-500" />
            Human review remains the final decision
          </div>
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
    <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}