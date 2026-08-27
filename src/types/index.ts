export type ApplicantStatus =
  | "NEW"
  | "PROCESSED"
  | "AI_ANALYZED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "NOT_QUALIFIED";
export type AIRecommendation = "STRONG_MATCH" | "REVIEW" | "NOT_QUALIFIED";
export type RecruiterDecision = "APPROVED" | "REJECTED";

export interface Applicant {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: ApplicantStatus;
  cv_url: string | null;
  cv_file_name: string | null;
  cv_text: string | null;
  ai_match_score: number | null;
  ai_recommendation: AIRecommendation | null;
  ai_summary: string | null;
  ai_skills: string[];
  ai_strengths: string[];
  ai_gaps: string[];
  recruiter_decision: RecruiterDecision | null;
  recruiter_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED" | "DRAFT";
  created_at: string;
  updated_at: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: "Candidate" | "AI System" | "Automation" | "Recruiter";
  kind: "application" | "cv" | "ai" | "decision" | "email";
}
