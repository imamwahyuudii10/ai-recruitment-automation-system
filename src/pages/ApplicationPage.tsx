import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { demoJobs } from "../data/demo";
import {
  ApplicationSubmissionError,
  submitApplication,
} from "../services/applicationService";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ApplicationPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = useMemo(
    () => demoJobs.find((item) => item.id === jobId && item.status === "OPEN"),
    [jobId],
  );
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-2xl font-semibold">Position not found</h1>
        <Link
          to="/careers"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to careers
        </Link>
      </div>
    );
  }

  function updateFile(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return setFile(null);
    if (
      selected.type !== "application/pdf" &&
      !selected.name.toLowerCase().endsWith(".pdf")
    ) {
      event.target.value = "";
      setFile(null);
      return setError("Your CV must be a PDF file.");
    }
    if (selected.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setFile(null);
      return setError("Please upload a PDF smaller than 5 MB.");
    }
    setFile(selected);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    // TypeScript-safe guard: the selected job may no longer exist
    // or may no longer be open by the time the form is submitted.
    if (!job) {
      setError("This position is no longer available.");
      return;
    }
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    )
      return setError("Please complete all required fields.");
    if (!file) return setError("Please attach your CV as a PDF.");

    setLoading(true);
    try {
      const result = await submitApplication({
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        job_id: job.id,
        cv_file: file,
      });
      navigate("/application-success", {
        state: {
          applicantId: result.applicant_id,
          jobTitle: job.title,
          candidateName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        },
      });
    } catch (submitError) {
      if (
        submitError instanceof ApplicationSubmissionError &&
        submitError.code === "DUPLICATE_APPLICATION"
      ) {
        setError("You have already applied for this position.");
      } else if (
        submitError instanceof ApplicationSubmissionError &&
        submitError.errors?.length
      ) {
        setError(submitError.errors.join(" "));
      } else {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to submit application.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          to={`/careers/${job.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {job.title}
        </Link>
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="border-b border-slate-100 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Application
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Apply for {job.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tell us how to reach you and attach your latest CV. Required
                fields are marked below.
              </p>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field
                label="First name"
                required
                value={form.firstName}
                onChange={(value) =>
                  setForm((current) => ({ ...current, firstName: value }))
                }
                autoComplete="given-name"
              />
              <Field
                label="Last name"
                required
                value={form.lastName}
                onChange={(value) =>
                  setForm((current) => ({ ...current, lastName: value }))
                }
                autoComplete="family-name"
              />
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({ ...current, email: value }))
                }
                autoComplete="email"
              />
              <Field
                label="Phone"
                required
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({ ...current, phone: value }))
                }
                autoComplete="tel"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-800">
                CV / Resume <span className="text-rose-500">*</span>
              </label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-9 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={updateFile}
                  className="sr-only"
                />
                {file ? (
                  <>
                    <FileText className="h-7 w-7 text-emerald-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(file.size / 1024).toFixed(0)} KB · PDF selected
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-7 w-7 text-slate-500" />
                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      Upload your CV
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      PDF only · maximum 5 MB
                    </p>
                  </>
                )}
              </label>
            </div>

            {error && (
              <div className="mt-5 flex gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-xs leading-5 text-slate-400">
                By submitting, you confirm the information provided is accurate
                and may be used for recruitment purposes.
              </p>
              <button
                disabled={loading}
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting application…" : "Submit application"}
              </button>
            </div>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Role
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">
                {job.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {job.department} · Remote friendly · Full-time
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  What happens next
                </h3>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  "Application received and validated",
                  "CV securely processed",
                  "AI-assisted screening supports review",
                  "Recruiter makes the final decision",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 text-xs leading-5 text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
      />
    </label>
  );
}
