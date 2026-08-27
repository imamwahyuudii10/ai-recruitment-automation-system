import { useMemo, useState } from "react";
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
import { demoActivity, demoApplicants, demoJobs } from "../data/demo";
import { Button, Modal } from "../components/ui/Primitives";
import {
  RecommendationBadge,
  ScoreBadge,
  StatusBadge,
} from "../components/ui/StatusBadge";
import { recordRecruiterDecision } from "../services/recruiterDecisionService";
import type { Applicant, Job, RecruiterDecision } from "../types";

export function CandidateDetailPage() {
  const { id } = useParams();

  const base = useMemo(
    () => demoApplicants.find((a) => a.id === id) ?? demoApplicants[0],
    [id],
  );

  const [candidate, setCandidate] = useState(base);
  const [tab, setTab] = useState<"overview" | "ai" | "resume" | "activity">(
    "overview",
  );
  const [notes, setNotes] = useState(candidate.recruiter_notes ?? "");
  const [decision, setDecision] = useState<RecruiterDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const job = demoJobs.find((j) => j.id === candidate.job_id);

  const initials = candidate.full_name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("");

  async function submit() {
    if (!decision) return;

    setLoading(true);
    setMessage("");

    try {
      await recordRecruiterDecision({
        applicant_id: candidate.id,
        decision,
        notes,
      });

      setCandidate({
        ...candidate,
        status: decision,
        recruiter_decision: decision,
        recruiter_notes: notes,
      });

      setMessage(
        `Candidate ${decision === "APPROVED" ? "approved" : "rejected"} successfully.`,
      );
      setDecision(null);
    } catch {
      setMessage("Unable to record recruiter decision. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
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
                <StatusBadge status={candidate.status} />
              </div>

              <p className="mt-2 text-sm text-slate-400">
                {job?.title ?? "Candidate"} · {job?.department ?? "No department"}
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
            <HeaderMetric
              label="AI Match"
              value={
                candidate.ai_match_score != null
                  ? `${candidate.ai_match_score}%`
                  : "—"
              }
            />
            <HeaderMetric
              label="Recommendation"
              value={
                candidate.ai_recommendation?.replace(/_/g, " ") ??
                "Not analyzed"
              }
            />
            <HeaderMetric
              label="Decision"
              value={
                candidate.recruiter_decision?.replace(/_/g, " ") ??
                (candidate.status === "PENDING_REVIEW"
                  ? "Pending"
                  : candidate.status.replace(/_/g, " "))
              }
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex overflow-x-auto border-b border-slate-100 px-3">
              {(["overview", "ai", "resume", "activity"] as const).map((item) => {
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
                    onClick={() => setTab(item)}
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

            <div className="p-5 sm:p-6">
              {tab === "overview" && <Overview candidate={candidate} job={job} />}
              {tab === "ai" && <AIView candidate={candidate} />}
              {tab === "resume" && <Resume candidate={candidate} />}
              {tab === "activity" && <ActivityView />}
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
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
                  <RecommendationBadge value={candidate.ai_recommendation} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">Match score</span>
                  <ScoreBadge score={candidate.ai_match_score} />
                </div>
              </div>

              {candidate.status === "PENDING_REVIEW" ? (
                <>
                  <label className="mt-5 block text-xs font-semibold text-slate-700">
                    Recruiter notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                    placeholder="Add context for the final decision..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                  />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button onClick={() => setDecision("APPROVED")}>
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => setDecision("REJECTED")}
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
                    {candidate.recruiter_decision?.replace(/_/g, " ") ??
                      candidate.status.replace(/_/g, " ")}
                  </p>

                  {candidate.recruiter_notes && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {candidate.recruiter_notes}
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
                  AI analysis supports recruiter review and does not replace
                  human judgment.
                </p>
              </div>
            </div>
          </section>

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
                value={candidate.ai_match_score != null ? "Completed" : "Pending"}
              />
              <ControlLine
                label="Human review"
                value={
                  candidate.status === "PENDING_REVIEW"
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

      <Modal
        open={!!decision}
        title={
          decision === "APPROVED"
            ? "Approve candidate?"
            : "Reject candidate?"
        }
        onClose={() => setDecision(null)}
      >
        <p className="text-sm leading-6 text-slate-600">
          This will update the candidate status and trigger automated candidate
          communication through your n8n workflow.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDecision(null)}>
            Cancel
          </Button>

          <Button
            variant={decision === "REJECTED" ? "danger" : "primary"}
            loading={loading}
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
        <InfoCard title="Candidate Information" icon={UserRoundCheck}>
          <dl className="space-y-4">
            <Row k="Email" v={candidate.email} />
            <Row k="Phone" v={candidate.phone ?? "Not provided"} />
            <Row
              k="Applied"
              v={new Date(candidate.created_at).toLocaleString()}
            />
            <Row k="CV file" v={candidate.cv_file_name ?? "Unavailable"} />
          </dl>
        </InfoCard>

        <InfoCard title="Position" icon={BriefcaseBusiness}>
          <dl className="space-y-4">
            <Row k="Role" v={job?.title ?? "Not assigned"} />
            <Row k="Department" v={job?.department ?? "Not available"} />
            <Row k="Job status" v={job?.status ?? "Unknown"} />
            <Row
              k="Requirements"
              v={job?.requirements ?? "No requirements available"}
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

      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
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

function AIView({ candidate }: { candidate: Applicant }) {
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

          <div className="rounded-xl border border-violet-100 bg-white px-5 py-4 text-center">
            <p className="font-mono text-3xl font-semibold text-slate-950">
              {candidate.ai_match_score ?? "—"}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Match Score
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <ListCard
          title="Detected Skills"
          items={candidate.ai_skills}
          tone="neutral"
        />
        <ListCard
          title="Strengths"
          items={candidate.ai_strengths}
          tone="positive"
        />
        <ListCard
          title="Potential Gaps"
          items={candidate.ai_gaps}
          tone="warning"
        />
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "positive" | "warning";
}) {
  const toneClasses = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    positive: "border-emerald-100 bg-emerald-50 text-emerald-800",
    warning: "border-amber-100 bg-amber-50 text-amber-800",
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-950">
        {title}
      </h3>

      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className={`rounded-lg border px-3 py-2.5 text-sm leading-5 ${toneClasses[tone]}`}
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No data available.
          </p>
        )}
      </div>
    </section>
  );
}

function Resume({ candidate }: { candidate: Applicant }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600">
            Candidate Resume
          </p>
          <h3 className="mt-1 font-semibold text-slate-950">
            {candidate.cv_file_name ?? "Resume"}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Extracted and normalized CV text
          </p>
        </div>

        <Button variant="secondary">
          <FileText className="h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="p-5">
        <pre className="max-h-[640px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 font-sans text-sm leading-7 text-slate-700">
          {candidate.cv_text ?? "Resume text is not available yet."}
        </pre>
      </div>
    </section>
  );
}

function ActivityView() {
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
        {demoActivity.slice(0, 4).map((event, index) => (
          <div key={event.id} className="relative flex gap-4">
            <div className="relative z-10 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white">
              <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            </div>

            {index < 3 && (
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
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>

              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Actor · {event.actor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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
