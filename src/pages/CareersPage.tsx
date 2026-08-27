import {
  AlertCircle,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  FileSearch,
  FileText,
  Gauge,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRoundCheck,
  UsersRound,
  Workflow,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { demoJobs } from "../data/demo";
import {
  ApplicationSubmissionError,
  submitApplication,
} from "../services/applicationService";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function CareersPage() {
  const navigate = useNavigate();

  const openJobs = useMemo(
    () => demoJobs.filter((job) => job.status === "OPEN"),
    [],
  );

  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("ALL");

  const [application, setApplication] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobId: openJobs[0]?.id ?? "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [applicationError, setApplicationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const departments = [
    "ALL",
    ...Array.from(new Set(openJobs.map((job) => job.department))),
  ];

  const selectedJob = openJobs.find(
    (job) => job.id === application.jobId,
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return openJobs.filter((job) => {
      const matchesDepartment =
        department === "ALL" || job.department === department;

      const matchesQuery =
        !term ||
        [job.title, job.department, job.description]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesDepartment && matchesQuery;
    });
  }, [department, openJobs, query]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setApplicationError("");

    const selected = event.target.files?.[0] ?? null;

    if (!selected) {
      setCvFile(null);
      return;
    }

    const isPdf =
      selected.type === "application/pdf" ||
      selected.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      event.target.value = "";
      setCvFile(null);
      setApplicationError("Your CV must be a PDF file.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setCvFile(null);
      setApplicationError(
        "Please upload a PDF smaller than 5 MB.",
      );
      return;
    }

    setCvFile(selected);
  }

  async function handleApplicationSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setApplicationError("");

    if (
      !application.fullName.trim() ||
      !application.email.trim() ||
      !application.phone.trim() ||
      !application.jobId
    ) {
      setApplicationError(
        "Please complete all required fields.",
      );
      return;
    }

    if (!selectedJob) {
      setApplicationError(
        "Please choose an available position.",
      );
      return;
    }

    if (!cvFile) {
      setApplicationError(
        "Please attach your CV as a PDF.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitApplication({
        full_name: application.fullName.trim(),
        email: application.email.trim(),
        phone: application.phone.trim(),
        job_id: selectedJob.id,
        cv_file: cvFile,
      });

      navigate("/application-success", {
        state: {
          applicantId: result.applicant_id,
          jobTitle: selectedJob.title,
          candidateName: application.fullName.trim(),
        },
      });
    } catch (error) {
      if (
        error instanceof ApplicationSubmissionError &&
        error.code === "DUPLICATE_APPLICATION"
      ) {
        setApplicationError(
          "You have already applied for this position.",
        );
      } else if (
        error instanceof ApplicationSubmissionError &&
        error.errors?.length
      ) {
        setApplicationError(error.errors.join(" "));
      } else {
        setApplicationError(
          error instanceof Error
            ? error.message
            : "Unable to submit your application.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800 bg-[#050816] text-white">
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_18%_12%,rgba(99,102,241,0.42)_0,transparent_30%),radial-gradient(circle_at_82%_6%,rgba(14,165,233,0.30)_0,transparent_28%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered recruitment with human control
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Apply once.
              <span className="block text-violet-300">
                Let the workflow do the rest.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Submit your application and CV in minutes.
              Hireloop securely processes your resume, uses AI
              to support recruiter review, and keeps final
              hiring decisions human-led.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <HeroCheck text="Secure CV processing" />
              <HeroCheck text="AI-assisted screening" />
              <HeroCheck text="Human final decision" />
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#how-it-works"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                See how it works
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                to="/admin"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Recruiter portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleApplicationSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                  Start your application
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Apply in one step
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Complete the form and upload your latest CV.
                </p>
              </div>

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <DarkField
                label="Full name"
                value={application.fullName}
                onChange={(value) =>
                  setApplication((current) => ({
                    ...current,
                    fullName: value,
                  }))
                }
                placeholder="Your full name"
                autoComplete="name"
              />

              <DarkField
                label="Email"
                type="email"
                value={application.email}
                onChange={(value) =>
                  setApplication((current) => ({
                    ...current,
                    email: value,
                  }))
                }
                placeholder="you@example.com"
                autoComplete="email"
              />

              <DarkField
                label="Phone"
                value={application.phone}
                onChange={(value) =>
                  setApplication((current) => ({
                    ...current,
                    phone: value,
                  }))
                }
                placeholder="+62..."
                autoComplete="tel"
              />

              <label className="block">
                <span className="text-xs font-semibold text-slate-300">
                  Position
                </span>

                <select
                  required
                  value={application.jobId}
                  onChange={(event) =>
                    setApplication((current) => ({
                      ...current,
                      jobId: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                >
                  {openJobs.map((job) => (
                    <option
                      key={job.id}
                      value={job.id}
                    >
                      {job.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-slate-950/40 p-4 transition hover:border-violet-400/50 hover:bg-slate-950/60">
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="sr-only"
              />

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/5 text-slate-300">
                {cvFile ? (
                  <FileText className="h-5 w-5 text-emerald-300" />
                ) : (
                  <UploadCloud className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {cvFile
                    ? cvFile.name
                    : "Upload CV / Resume"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {cvFile
                    ? `${(cvFile.size / 1024).toFixed(0)} KB · PDF ready`
                    : "PDF only · maximum 5 MB"}
                </p>
              </div>
            </label>

            {applicationError && (
              <div className="mt-4 flex gap-3 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{applicationError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !openJobs.length}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting application…"
                : "Submit application"}
              {!submitting && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Human-led recruitment · AI-assisted review
            </div>
          </form>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            <Metric value="Seconds" label="Application capture" />
            <Metric value="AI-assisted" label="CV screening" />
            <Metric value="Human-led" label="Final decisions" />
            <Metric value="Automated" label="Candidate updates" />
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-b border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionEyebrow>How it works</SectionEyebrow>

          <div className="mt-3 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              From application to recruiter decision.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              One connected workflow handles the repetitive
              steps while recruiters keep control of the
              decision.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            <ProcessStep
              number="01"
              icon={FileText}
              title="Apply"
              text="Candidate submits details and a PDF resume."
            />
            <ProcessStep
              number="02"
              icon={FileSearch}
              title="Process CV"
              text="n8n retrieves, extracts, and normalizes resume data."
            />
            <ProcessStep
              number="03"
              icon={Bot}
              title="AI screening"
              text="Gemini evaluates fit, skills, strengths, and gaps."
            />
            <ProcessStep
              number="04"
              icon={UserRoundCheck}
              title="Human review"
              text="Recruiter reviews the evidence and decides."
              highlighted
            />
            <ProcessStep
              number="05"
              icon={Mail}
              title="Communicate"
              text="n8n sends the appropriate candidate email."
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#070b18] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <SectionEyebrow dark>
              AI candidate intelligence
            </SectionEyebrow>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              AI does the analysis.
              <span className="block text-violet-300">
                Recruiters stay in control.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              Candidate data is evaluated against role
              requirements and converted into structured
              decision support — not an automatic final hiring
              decision.
            </p>

            <div className="mt-7 space-y-3">
              <FeatureLine text="Match score and recommendation" />
              <FeatureLine text="Detected skills and experience" />
              <FeatureLine text="Candidate strengths and potential gaps" />
              <FeatureLine text="Human-in-the-loop approval or rejection" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs text-slate-400">
                  Candidate analysis
                </p>
                <p className="mt-1 font-semibold">
                  Backend Engineer
                </p>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                STRONG MATCH
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[150px_1fr]">
              <div className="rounded-xl bg-slate-950/70 p-5 text-center">
                <p className="font-mono text-5xl font-semibold">
                  92
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  AI Match Score
                </p>
              </div>

              <div className="space-y-3">
                <InsightBar
                  label="Technical skills"
                  value={94}
                />
                <InsightBar
                  label="Role relevance"
                  value={88}
                />
                <InsightBar
                  label="Experience"
                  value={82}
                />
                <InsightBar
                  label="Requirements"
                  value={91}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniInsight
                label="Skills"
                value="Node.js · PostgreSQL · REST"
              />
              <MiniInsight
                label="Strength"
                value="Backend API architecture"
              />
              <MiniInsight
                label="Gap"
                value="Enterprise scale exposure"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>
              Recruiter operations
            </SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              One dashboard for the full hiring pipeline.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Recruiters can monitor candidates, AI analysis,
              hiring status, jobs, and activity from one
              workspace.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <p className="ml-2 text-xs text-slate-400">
                Hireloop · Recruitment Overview
              </p>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-4">
              <DashboardStat
                icon={UsersRound}
                value="128"
                label="Applicants"
              />
              <DashboardStat
                icon={Gauge}
                value="76%"
                label="Avg. AI Match"
              />
              <DashboardStat
                icon={UserRoundCheck}
                value="14"
                label="Pending Review"
              />
              <DashboardStat
                icon={BriefcaseBusiness}
                value="6"
                label="Open Jobs"
              />
            </div>

            <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-slate-200">
              {[
                ["Ahmad Fauzan", "Backend Engineer", "75", "REVIEW", "PENDING REVIEW"],
                ["Sarah Wijaya", "Backend Engineer", "92", "STRONG MATCH", "APPROVED"],
                ["Rizky Pratama", "Frontend Engineer", "84", "STRONG MATCH", "AI ANALYZED"],
              ].map((row, index) => (
                <div
                  key={row[0]}
                  className={`grid gap-3 px-4 py-4 text-xs sm:grid-cols-[1.4fr_1.2fr_.5fr_1fr_1fr] sm:items-center ${
                    index ? "border-t border-slate-100" : ""
                  }`}
                >
                  <span className="font-semibold text-slate-900">
                    {row[0]}
                  </span>
                  <span className="text-slate-500">
                    {row[1]}
                  </span>
                  <span className="font-mono font-semibold">
                    {row[2]}
                  </span>
                  <span className="text-slate-600">
                    {row[3]}
                  </span>
                  <span className="text-slate-500">
                    {row[4]}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-right">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Open recruiter portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>
              Automation architecture
            </SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              One connected recruitment workflow.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Candidate experience, automation, AI, storage,
              recruiter review, and communication work as one
              system.
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-5">
            <ArchitectureCard
              icon={FileText}
              title="Capture"
              text="React application form"
            />
            <ArchitectureCard
              icon={Workflow}
              title="Automate"
              text="n8n workflow engine"
            />
            <ArchitectureCard
              icon={Database}
              title="Store"
              text="Supabase + PostgreSQL"
            />
            <ArchitectureCard
              icon={Bot}
              title="Analyze"
              text="Gemini candidate intelligence"
            />
            <ArchitectureCard
              icon={Mail}
              title="Respond"
              text="Automated Gmail communication"
            />
          </div>
        </div>
      </section>

      <section
        id="open-roles"
        className="border-y border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionEyebrow>
                Open positions
              </SectionEyebrow>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Find your next role
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Explore current opportunities or apply directly
                from the form at the top of this page.
              </p>
            </div>

            <p className="text-sm text-slate-500">
              {openJobs.length} open roles
            </p>
          </div>

          <div className="mt-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search roles, teams, or keywords"
                className="h-11 w-full rounded-lg border border-transparent bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </label>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            >
              {departments.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "ALL"
                    ? "All departments"
                    : item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {filtered.length ? (
              filtered.map((job, index) => (
                <article
                  key={job.id}
                  className={`grid gap-5 px-5 py-6 transition hover:bg-slate-50 sm:px-6 md:grid-cols-[1fr_auto] md:items-center ${
                    index
                      ? "border-t border-slate-200"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {job.title}
                      </h3>

                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        {job.department}
                      </span>
                    </div>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {job.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        Remote friendly
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                        Full-time
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setApplication((current) => ({
                          ...current,
                          jobId: job.id,
                        }));
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Apply now
                    </button>

                    <Link
                      to={`/careers/${job.id}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      View role
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <p className="font-medium text-slate-800">
                  No matching roles found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different keyword or department.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#050816] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Portfolio demo
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              See both sides of the hiring system.
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Apply as a candidate, then open the recruiter
              workspace to review the hiring pipeline.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950"
            >
              Submit application
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              to="/admin"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-semibold"
            >
              Recruiter portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function DarkField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-300">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
      />
    </label>
  );
}

function HeroCheck({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
      {text}
    </span>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SectionEyebrow({
  children,
  dark = false,
}: {
  children: import("react").ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
        dark ? "text-violet-300" : "text-indigo-600"
      }`}
    >
      {children}
    </p>
  );
}

function ProcessStep({
  number,
  icon: Icon,
  title,
  text,
  highlighted = false,
}: {
  number: string;
  icon: typeof FileText;
  title: string;
  text: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlighted
          ? "border-violet-200 bg-violet-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`grid h-9 w-9 place-items-center rounded-lg ${
            highlighted
              ? "bg-violet-100 text-violet-700"
              : "bg-white text-slate-700"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="font-mono text-xs text-slate-400">
          {number}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-semibold text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-xs leading-5 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function FeatureLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <CheckCircle2 className="h-4 w-4 text-violet-300" />
      {text}
    </div>
  );
}

function InsightBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          {label}
        </span>
        <span className="font-mono text-slate-200">
          {value}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-violet-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MiniInsight({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-300">
        {value}
      </p>
    </div>
  );
}

function DashboardStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof UsersRound;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Icon className="h-4 w-4 text-slate-500" />
      <p className="mt-4 text-2xl font-semibold text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

function ArchitectureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof FileText;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-5 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}
