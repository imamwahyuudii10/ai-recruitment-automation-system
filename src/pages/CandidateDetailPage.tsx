import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { Button, Modal } from "../components/ui/Primitives";
import {
  RecommendationBadge,
  StatusBadge,
} from "../components/ui/StatusBadge";
import {
  getApplicant,
  getJobs,
} from "../services/dataService";
import { recordRecruiterDecision } from "../services/recruiterDecisionService";
import type {
  Applicant,
  Job,
  RecruiterDecision,
} from "../types";

export function CandidateDetailPage() {
  const { id } = useParams();

  const [candidate, setCandidate] =
    useState<Applicant | null>(null);

  const [job, setJob] =
    useState<Job | undefined>();

  const [tab, setTab] = useState<
    "overview" | "ai" | "resume" | "activity"
  >("overview");

  const [notes, setNotes] = useState("");

  const [decision, setDecision] =
    useState<RecruiterDecision | null>(null);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [decisionLoading, setDecisionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCandidate() {
      if (!id) {
        setError("Candidate ID is missing.");
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        setError("");

        const [candidateData, jobsData] =
          await Promise.all([
            getApplicant(id),
            getJobs(),
          ]);

        if (!active) return;

        if (!candidateData) {
          setError("Candidate not found.");
          return;
        }

        setCandidate(candidateData);

        setNotes(
          candidateData.recruiter_notes ?? "",
        );

        const matchedJob = jobsData.find(
          (item) =>
            item.id === candidateData.job_id,
        );

        setJob(matchedJob);
      } catch (err) {
        console.error(
          "Candidate detail loading error:",
          err,
        );

        if (!active) return;

        setError(
          "Unable to load candidate from Supabase.",
        );
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    }

    loadCandidate();

    return () => {
      active = false;
    };
  }, [id]);

  async function submit() {
    if (!decision || !candidate) return;

    setDecisionLoading(true);
    setMessage("");

    try {
      await recordRecruiterDecision({
        applicant_id: candidate.id,
        decision,
        notes,
      });

      const refreshedCandidate =
        await getApplicant(candidate.id);

      if (refreshedCandidate) {
        setCandidate(refreshedCandidate);

        setNotes(
          refreshedCandidate.recruiter_notes ??
            notes,
        );
      } else {
        setCandidate({
          ...candidate,
          status: decision,
          recruiter_decision: decision,
          recruiter_notes: notes,
        });
      }

      setMessage(
        decision === "APPROVED"
          ? "Candidate approved successfully."
          : "Candidate rejected successfully.",
      );

      setDecision(null);
    } catch (err) {
      console.error(
        "Recruiter decision error:",
        err,
      );

      setMessage(
        "Unable to record recruiter decision. Please try again.",
      );
    } finally {
      setDecisionLoading(false);
    }
  }

  if (pageLoading) {
    return <CandidateDetailLoading />;
  }

  if (error || !candidate) {
    return (
      <CandidateDetailError
        message={
          error ||
          "Candidate could not be loaded."
        }
      />
    );
  }

  const initials = candidate.full_name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b18] px-6 py-7 text-white shadow-xl shadow-slate-900/5 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_12%_12%,rgba(124,58,237,0.30)_0,transparent_28%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.18)_0,transparent_24%)]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-xl font-semibold">
              {initials}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                  {candidate.full_name}
                </h1>

                <StatusBadge
                  status={candidate.status}
                />
              </div>

              <p className="mt-2 text-sm text-slate-400">
                {job?.title ?? "Candidate"} ·{" "}
                {job?.department ??
                  "No department"}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {candidate.email}
                </span>

                {candidate.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {candidate.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <HeaderScoreMetric
              label="AI Match"
              score={candidate.ai_match_score}
            />

            <HeaderMetric
              label="Recommendation"
              value={
                candidate.ai_recommendation?.replace(
                  /_/g,
                  " ",
                ) ?? "Not analyzed"
              }
            />

            <HeaderMetric
              label="Decision"
              value={
                candidate.recruiter_decision?.replace(
                  /_/g,
                  " ",
                ) ??
                (candidate.status ===
                "PENDING_REVIEW"
                  ? "Pending"
                  : candidate.status.replace(
                      /_/g,
                      " ",
                    ))
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* TABS */}

            <div className="flex overflow-x-auto border-b border-slate-100 px-3">
              {(
                [
                  "overview",
                  "ai",
                  "resume",
                  "activity",
                ] as const
              ).map((item) => {
                const label =
                  item === "ai"
                    ? "AI Analysis"
                    : item === "resume"
                      ? "Resume"
                      : item === "activity"
                        ? "Activity"
                        : "Overview";

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setTab(item)
                    }
                    className={`relative px-4 py-4 text-sm font-semibold transition ${
                      tab === item
                        ? "text-violet-700"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {label}

                    {tab === item && (
                      <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-violet-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}

            <div className="p-5 sm:p-6">
              {tab === "overview" && (
                <Overview
                  candidate={candidate}
                  job={job}
                />
              )}

              {tab === "ai" && (
                <AIView
                  candidate={candidate}
                />
              )}

              {tab === "resume" && (
                <Resume
                  candidate={candidate}
                />
              )}

              {tab === "activity" && (
                <ActivityView
                  candidate={candidate}
                />
              )}
            </div>
          </section>
        </div>

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          {/* HUMAN REVIEW */}

          <section className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white">
            <div className="border-b border-violet-100 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
                  <UserRoundCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-500">
                    Human Review
                  </p>

                  <h2 className="font-semibold text-slate-950">
                    Recruiter Decision
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-violet-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-500">
                    AI recommendation
                  </span>

                  <RecommendationBadge
                    value={
                      candidate.ai_recommendation
                    }
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">
                    Match score
                  </span>

                  <MatchScoreBadge
                    score={
                      candidate.ai_match_score
                    }
                  />
                </div>
              </div>

              {candidate.status ===
              "PENDING_REVIEW" ? (
                <>
                  <label className="mt-5 block text-xs font-semibold text-slate-700">
                    Recruiter notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(
                        event.target.value,
                      )
                    }
                    rows={6}
                    placeholder="Add context for the final decision..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                  />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      onClick={() =>
                        setDecision(
                          "APPROVED",
                        )
                      }
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        setDecision(
                          "REJECTED",
                        )
                      }
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Final decision
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {candidate.recruiter_decision?.replace(
                      /_/g,
                      " ",
                    ) ??
                      candidate.status.replace(
                        /_/g,
                        " ",
                      )}
                  </p>

                  {candidate.recruiter_notes && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {
                        candidate.recruiter_notes
                      }
                    </p>
                  )}
                </div>
              )}

              {message && (
                <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  {message}
                </p>
              )}

              <div className="mt-5 flex gap-2 border-t border-violet-100 pt-4 text-[11px] leading-5 text-slate-500">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />

                <p>
                  AI analysis supports recruiter
                  review and does not replace human
                  judgment.
                </p>
              </div>
            </div>
          </section>

          {/* DECISION CONTROL */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />

              <h3 className="text-sm font-semibold text-slate-950">
                Decision Control
              </h3>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-500">
              <ControlLine
                label="AI screening"
                value={
                  candidate.ai_match_score !=
                  null
                    ? "Completed"
                    : "Pending"
                }
              />

              <ControlLine
                label="Human review"
                value={
                  candidate.status ===
                  "PENDING_REVIEW"
                    ? "Required"
                    : "Completed"
                }
              />

              <ControlLine
                label="Candidate email"
                value={
                  candidate.recruiter_decision
                    ? "Triggered by n8n"
                    : "Waiting for decision"
                }
              />
            </div>
          </section>
        </aside>
      </div>

      {/* =====================================================
          CONFIRM MODAL
      ====================================================== */}

      <Modal
        open={!!decision}
        title={
          decision === "APPROVED"
            ? "Approve candidate?"
            : "Reject candidate?"
        }
        onClose={() =>
          setDecision(null)
        }
      >
        <p className="text-sm leading-6 text-slate-600">
          This will update the candidate status
          and trigger automated candidate
          communication through your n8n
          workflow.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              setDecision(null)
            }
          >
            Cancel
          </Button>

          <Button
            variant={
              decision === "REJECTED"
                ? "danger"
                : "primary"
            }
            loading={decisionLoading}
            onClick={submit}
          >
            {decision === "APPROVED"
              ? "Confirm approval"
              : "Confirm rejection"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* =====================================================
   COLORED AI SCORE
===================================================== */

function MatchScoreBadge({
  score,
}: {
  score: number | null;
}) {
  if (score == null) {
    return (
      <span className="inline-flex min-w-[62px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-400">
        —
      </span>
    );
  }

  let classes = "";

  if (score >= 80) {
    classes =
      "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (score >= 60) {
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
   HEADER SCORE
===================================================== */

function HeaderScoreMetric({
  label,
  score,
}: {
  label: string;
  score: number | null;
}) {
  let scoreClass =
    "text-slate-400";

  if (score != null) {
    if (score >= 80) {
      scoreClass =
        "text-emerald-300";
    } else if (score >= 60) {
      scoreClass =
        "text-amber-300";
    } else {
      scoreClass =
        "text-rose-300";
    }
  }

  return (
    <div className="min-w-[130px] rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 font-mono text-lg font-bold ${scoreClass}`}
      >
        {score != null
          ? `${score}%`
          : "—"}
      </p>
    </div>
  );
}

/* =====================================================
   HEADER METRIC
===================================================== */

function HeaderMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[130px] rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 max-w-[170px] truncate text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   OVERVIEW
===================================================== */

function Overview({
  candidate,
  job,
}: {
  candidate: Applicant;
  job: Job | undefined;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard
          title="Candidate Information"
          icon={UserRoundCheck}
        >
          <dl className="space-y-4">
            <Row
              k="Email"
              v={candidate.email}
            />

            <Row
              k="Phone"
              v={
                candidate.phone ??
                "Not provided"
              }
            />

            <Row
              k="Applied"
              v={new Date(
                candidate.created_at,
              ).toLocaleString()}
            />

            <Row
              k="CV file"
              v={
                candidate.cv_file_name ??
                "Unavailable"
              }
            />
          </dl>
        </InfoCard>

        <InfoCard
          title="Position"
          icon={BriefcaseBusiness}
        >
          <dl className="space-y-4">
            <Row
              k="Role"
              v={
                job?.title ??
                "Not assigned"
              }
            />

            <Row
              k="Department"
              v={
                job?.department ??
                "Not available"
              }
            />

            <Row
              k="Job status"
              v={
                job?.status ??
                "Unknown"
              }
            />

            <Row
              k="Requirements"
              v={
                job?.requirements ??
                "No requirements available"
              }
            />
          </dl>
        </InfoCard>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />

          <h3 className="text-sm font-semibold text-slate-950">
            Screening Summary
          </h3>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {candidate.ai_summary ??
            "AI analysis has not been completed for this candidate yet."}
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   INFO CARD
===================================================== */

function InfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRoundCheck;
  children: import("react").ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>

        <h3 className="text-sm font-semibold text-slate-950">
          {title}
        </h3>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}

function Row({
  k,
  v,
}: {
  k: string;
  v: string;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {k}
      </dt>

      <dd className="mt-1.5 text-sm leading-6 text-slate-700">
        {v}
      </dd>
    </div>
  );
}

/* =====================================================
   AI ANALYSIS
===================================================== */

function AIView({
  candidate,
}: {
  candidate: Applicant;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600">
                AI Candidate Intelligence
              </p>
            </div>

            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Candidate Screening Analysis
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {candidate.ai_summary ??
                "AI analysis has not been completed yet."}
            </p>
          </div>

          <LargeMatchScore
            score={
              candidate.ai_match_score
            }
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <ListCard
          title="Detected Skills"
          items={
            candidate.ai_skills ??
            []
          }
          tone="neutral"
        />

        <ListCard
          title="Strengths"
          items={
            candidate.ai_strengths ??
            []
          }
          tone="positive"
        />

        <ListCard
          title="Potential Gaps"
          items={
            candidate.ai_gaps ??
            []
          }
          tone="warning"
        />
      </div>
    </div>
  );
}

function LargeMatchScore({
  score,
}: {
  score: number | null;
}) {
  let classes =
    "border-slate-200 bg-white text-slate-400";

  if (score != null) {
    if (score >= 80) {
      classes =
        "border-emerald-200 bg-emerald-50 text-emerald-700";
    } else if (score >= 60) {
      classes =
        "border-amber-200 bg-amber-50 text-amber-700";
    } else {
      classes =
        "border-rose-200 bg-rose-50 text-rose-700";
    }
  }

  return (
    <div
      className={`min-w-[140px] rounded-xl border px-5 py-4 text-center ${classes}`}
    >
      <p className="font-mono text-3xl font-bold">
        {score != null
          ? `${score}%`
          : "—"}
      </p>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70">
        Match Score
      </p>
    </div>
  );
}

/* =====================================================
   LIST CARD
===================================================== */

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone:
    | "neutral"
    | "positive"
    | "warning";
}) {
  const toneClasses = {
    neutral:
      "border-slate-200 bg-slate-50 text-slate-600",
    positive:
      "border-emerald-100 bg-emerald-50 text-emerald-800",
    warning:
      "border-amber-100 bg-amber-50 text-amber-800",
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-950">
        {title}
      </h3>

      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className={`rounded-lg border px-3 py-2.5 text-sm leading-5 ${toneClasses[tone]}`}
              >
                {item}
              </div>
            ),
          )
        ) : (
          <p className="text-sm text-slate-400">
            No data available.
          </p>
        )}
      </div>
    </section>
  );
}

/* =====================================================
   RESUME
===================================================== */

function Resume({
  candidate,
}: {
  candidate: Applicant;
}) {
  function openResume() {
    if (!candidate.cv_url) return;

    window.open(
      candidate.cv_url,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600">
            Candidate Resume
          </p>

          <h3 className="mt-1 font-semibold text-slate-950">
            {candidate.cv_file_name ??
              "Resume"}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Extracted and normalized CV text
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={openResume}
          disabled={!candidate.cv_url}
        >
          <FileText className="h-4 w-4" />
          Open CV
        </Button>
      </div>

      <div className="p-5">
        <pre className="max-h-[640px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 font-sans text-sm leading-7 text-slate-700">
          {candidate.cv_text ??
            "Resume text is not available yet."}
        </pre>
      </div>
    </section>
  );
}

/* =====================================================
   ACTIVITY
===================================================== */

function ActivityView({
  candidate,
}: {
  candidate: Applicant;
}) {
  const activities = [
    {
      id: "application",
      title: "Application received",
      description:
        "Candidate application was captured and stored in the recruitment system.",
      timestamp: candidate.created_at,
      actor: "Application Capture",
    },

    ...(candidate.ai_match_score != null
      ? [
          {
            id: "ai-analysis",
            title: "AI screening completed",
            description: `Candidate received a ${candidate.ai_match_score}% match score${
              candidate.ai_recommendation
                ? ` with ${candidate.ai_recommendation.replace(
                    /_/g,
                    " ",
                  )} recommendation`
                : ""
            }.`,
            timestamp:
              candidate.updated_at ??
              candidate.created_at,
            actor: "AI Screening Workflow",
          },
        ]
      : []),

    ...(candidate.recruiter_decision
      ? [
          {
            id: "recruiter-decision",
            title:
              candidate.recruiter_decision ===
              "APPROVED"
                ? "Candidate approved"
                : "Candidate rejected",
            description:
              candidate.recruiter_notes ||
              "Recruiter completed the final candidate review.",
            timestamp:
              candidate.updated_at ??
              candidate.created_at,
            actor: "Recruiter",
          },
        ]
      : []),
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600">
          Audit Timeline
        </p>

        <h3 className="mt-1 font-semibold text-slate-950">
          Candidate Activity
        </h3>
      </div>

      <div className="mt-6 space-y-6">
        {activities.map(
          (event, index) => (
            <div
              key={event.id}
              className="relative flex gap-4"
            >
              <div className="relative z-10 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white">
                <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
              </div>

              {index <
                activities.length - 1 && (
                <div className="absolute left-[17px] top-9 h-[calc(100%+8px)] w-px bg-slate-200" />
              )}

              <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {event.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {event.description}
                    </p>
                  </div>

                  <p className="shrink-0 text-[11px] text-slate-400">
                    {new Date(
                      event.timestamp,
                    ).toLocaleString()}
                  </p>
                </div>

                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Actor · {event.actor}
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

/* =====================================================
   CONTROL
===================================================== */

function ControlLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span>{label}</span>

      <span className="font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}

/* =====================================================
   LOADING
===================================================== */

function CandidateDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="h-[600px] animate-pulse rounded-2xl bg-slate-200" />

        <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}

/* =====================================================
   ERROR
===================================================== */

function CandidateDetailError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
      <p className="font-semibold text-rose-900">
        Candidate unavailable
      </p>

      <p className="mt-2 text-sm text-rose-700">
        {message}
      </p>
    </div>
  );
}