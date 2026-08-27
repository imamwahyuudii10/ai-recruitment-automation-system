import type { RecruiterDecision } from "../types";

export interface RecruiterDecisionPayload {
  applicant_id: string;
  decision: RecruiterDecision;
  notes: string;
}
export interface RecruiterDecisionResponse {
  success: boolean;
  code: string;
  message: string;
  applicant_id: string;
  decision: RecruiterDecision;
  status: RecruiterDecision;
}

let inFlight = false;
export async function recordRecruiterDecision(
  payload: RecruiterDecisionPayload,
): Promise<RecruiterDecisionResponse> {
  const url = import.meta.env.VITE_RECRUITER_DECISION_WEBHOOK_URL as
    string | undefined;
  if (!url) {
    await new Promise((r) => setTimeout(r, 650));
    return {
      success: true,
      code: "DEMO_DECISION_RECORDED",
      message: "Decision recorded in demo mode.",
      applicant_id: payload.applicant_id,
      decision: payload.decision,
      status: payload.decision,
    };
  }
  if (inFlight)
    throw new Error("A recruiter decision is already being submitted.");
  inFlight = true;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(`Decision request failed with status ${response.status}`);
    return (await response.json()) as RecruiterDecisionResponse;
  } finally {
    clearTimeout(timer);
    inFlight = false;
  }
}
