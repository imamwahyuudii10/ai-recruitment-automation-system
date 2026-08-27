import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { demoJobs } from "../data/demo";

export function PublicJobDetailPage() {
  const { jobId } = useParams();
  const job = demoJobs.find(
    (item) => item.id === jobId && item.status === "OPEN",
  );

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-2xl font-semibold">Position not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This role may be closed or no longer available.
        </p>
        <Link
          to="/careers"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to careers
        </Link>
      </div>
    );
  }

  const requirements = job.requirements
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            All open roles
          </Link>
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {job.department}
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {job.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Remote friendly
                </span>
                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Full-time
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  Apply anytime while open
                </span>
              </div>
            </div>
            <Link
              to={`/apply/${job.id}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply for this role <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
          <div className="space-y-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <JobSection title="About the role">
              <p>{job.description}</p>
              <p>
                You will work with a cross-functional team to ship reliable
                product experiences, improve operational systems, and raise the
                quality bar of the platform.
              </p>
            </JobSection>
            <JobSection title="What you'll do">
              <ul className="space-y-3">
                {[
                  "Build and improve production systems with clear ownership and measurable outcomes.",
                  "Collaborate with product, design, and operations partners to turn ambiguous problems into practical solutions.",
                  "Improve reliability, maintainability, and developer experience across the systems you touch.",
                  "Document decisions and help the team scale knowledge through clear communication.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </JobSection>
            <JobSection title="What we're looking for">
              <ul className="space-y-3">
                {requirements.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </JobSection>
            <JobSection title="Our hiring approach">
              <p>
                We use automation and AI-assisted analysis to help our
                recruitment team organize applications efficiently. Final hiring
                decisions are always made by people, and every candidate is
                assessed in context.
              </p>
            </JobSection>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Interested?
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">
                Take the next step.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Submit your details and CV. The application usually takes less
                than five minutes.
              </p>
              <Link
                to={`/apply/${job.id}`}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Apply now <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-xs leading-5 text-slate-400">
                Please submit a PDF resume. Duplicate applications for the same
                role may be rejected automatically.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function JobSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
        {children}
      </div>
    </section>
  );
}
