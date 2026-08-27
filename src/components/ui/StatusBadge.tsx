import type { AIRecommendation, ApplicantStatus } from "../../types";

const statusStyles: Record<ApplicantStatus, string> = {
  NEW: "bg-slate-100 text-slate-700 ring-slate-200",
  PROCESSED: "bg-sky-50 text-sky-700 ring-sky-200",
  AI_ANALYZED: "bg-violet-50 text-violet-700 ring-violet-200",
  PENDING_REVIEW: "bg-amber-50 text-amber-800 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
  NOT_QUALIFIED: "bg-slate-100 text-slate-600 ring-slate-200",
};

const recommendationStyles: Record<AIRecommendation, string> = {
  STRONG_MATCH: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REVIEW: "bg-amber-50 text-amber-800 ring-amber-200",
  NOT_QUALIFIED: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({
  status,
}: {
  status: ApplicantStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function RecommendationBadge({
  value,
}: {
  value: AIRecommendation | null;
}) {
  if (!value) {
    return (
      <span className="text-xs text-slate-400">
        Not analyzed
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${recommendationStyles[value]}`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

export function ScoreBadge({
  score,
}: {
  score: number | null;
}) {
  if (score == null) {
    return (
      <span className="text-sm text-slate-400">
        —
      </span>
    );
  }

  const label =
    score >= 85
      ? "Strong"
      : score >= 65
        ? "Review"
        : "Low";

  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-sm font-semibold text-slate-900">
        {score}
      </span>

      <span className="text-xs text-slate-500">
        {label}
      </span>
    </span>
  );
}