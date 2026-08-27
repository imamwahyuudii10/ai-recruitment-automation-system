export interface ApplicationPayload {
  full_name: string;
  email: string;
  phone: string;
  job_id: string;
  cv_file: File;
}

export interface ApplicationResponse {
  success: boolean;
  message?: string;
  applicant_id?: string;
  code?: string;
  errors?: string[];
}

export class ApplicationSubmissionError extends Error {
  code?: string;
  errors?: string[];
  status?: number;

  constructor(
    message: string,
    options?: { code?: string; errors?: string[]; status?: number },
  ) {
    super(message);
    this.name = "ApplicationSubmissionError";
    this.code = options?.code;
    this.errors = options?.errors;
    this.status = options?.status;
  }
}

export async function submitApplication(
  payload: ApplicationPayload,
): Promise<ApplicationResponse> {
  const url = import.meta.env.VITE_APPLICATION_CAPTURE_WEBHOOK_URL as
    string | undefined;
  if (!url) {
    throw new ApplicationSubmissionError(
      "Application endpoint is not configured.",
    );
  }

  const formData = new FormData();
  formData.append("full_name", payload.full_name);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("job_id", payload.job_id);
  formData.append("cv_file", payload.cv_file);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    const body = (await response
      .json()
      .catch(() => ({}))) as ApplicationResponse;
    if (!response.ok || body.success === false) {
      throw new ApplicationSubmissionError(
        body.message || "Unable to submit application.",
        { code: body.code, errors: body.errors, status: response.status },
      );
    }
    return body;
  } catch (error) {
    if (error instanceof ApplicationSubmissionError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApplicationSubmissionError(
        "The request timed out. Please try again.",
      );
    }
    throw new ApplicationSubmissionError(
      "We could not submit your application. Please try again.",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}
