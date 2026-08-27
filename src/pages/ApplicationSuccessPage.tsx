import { ArrowRight, CheckCircle2, Clock3, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function ApplicationSuccessPage() {
  const location = useLocation();
  const state = location.state as {
    applicantId?: string;
    jobTitle?: string;
    candidateName?: string;
  } | null;

  return (
    <div className="bg-slate-50">
      <div className="mx-auto flex min-h-[72vh] max-w-3xl items-center px-5 py-16 sm:px-6">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Application submitted
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Thank you
            {state?.candidateName
              ? `, ${state.candidateName.split(" ")[0]}`
              : ""}
            .
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Your application{state?.jobTitle ? ` for ${state.jobTitle}` : ""}{" "}
            has been received. Our recruitment workflow will process your CV and
            prepare it for recruiter review.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <Clock3 className="h-4 w-4 text-slate-500" />
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Application processing
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your resume is validated, processed, and prepared for review.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <Mail className="h-4 w-4 text-slate-500" />
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Candidate communication
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                If a recruiter records a final decision, communication is sent
                through the hiring workflow.
              </p>
            </div>
          </div>
          {state?.applicantId && (
            <p className="mt-6 font-mono text-[11px] text-slate-400">
              Application ID: {state.applicantId}
            </p>
          )}
          <div className="mt-8">
            <Link
              to="/careers"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Explore more roles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
