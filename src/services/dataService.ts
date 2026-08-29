import { supabase } from "../lib/supabase";
import type { Applicant, Job } from "../types";

export async function getApplicants(): Promise<Applicant[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load applicants:", error);
    throw new Error("Unable to load applicants.");
  }

  return (data ?? []) as Applicant[];
}

export async function getApplicant(
  id: string,
): Promise<Applicant | null> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load applicant:", error);
    throw new Error("Unable to load applicant.");
  }

  return data as Applicant | null;
}

export async function getJobs(): Promise<Job[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load jobs:", error);
    throw new Error("Unable to load jobs.");
  }

  return (data ?? []) as Job[];
}