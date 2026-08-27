import { demoApplicants, demoJobs } from "../data/demo";
import { supabase } from "../lib/supabase";
import type { Applicant, Job } from "../types";

export async function getApplicants(): Promise<Applicant[]> {
  if (!supabase) return demoApplicants;
  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return demoApplicants;
  return data as Applicant[];
}

export async function getApplicant(id: string): Promise<Applicant | null> {
  if (!supabase) return demoApplicants.find((a) => a.id === id) ?? null;
  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return demoApplicants.find((a) => a.id === id) ?? null;
  return data as Applicant;
}

export async function getJobs(): Promise<Job[]> {
  if (!supabase) return demoJobs;
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return demoJobs;
  return data as Job[];
}
