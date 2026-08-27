# Hireloop — AI Recruitment & Applicant Tracking System

Production-style recruitment platform with two browser experiences:

- **Candidate Portal** — careers, open roles, job detail, application form, PDF CV upload, and submission confirmation.
- **Recruitment OS** — recruiter dashboard, candidates, candidate AI analysis, jobs, insights, activity, and recruiter decisions.

The intended backend is Supabase + n8n + Gemini + Gmail.

## Public candidate routes

- `/careers`
- `/careers/:jobId`
- `/apply/:jobId`
- `/application-success`

## Recruiter routes

- `/`
- `/candidates`
- `/candidates/:id`
- `/jobs`
- `/ai-insights`
- `/activity`
- `/settings`

## Stack

React, Vite, TypeScript, Tailwind CSS, React Router, Lucide React, Supabase JS.

## Environment

Copy `.env.example` to `.env` and configure:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APPLICATION_CAPTURE_WEBHOOK_URL=
VITE_RECRUITER_DECISION_WEBHOOK_URL=
```

`VITE_APPLICATION_CAPTURE_WEBHOOK_URL` should point to the production n8n Application Capture webhook. The application form sends multipart/form-data using these field names:

- `full_name`
- `email`
- `phone`
- `job_id`
- `cv_file`

`VITE_RECRUITER_DECISION_WEBHOOK_URL` receives recruiter decisions as JSON.

## Run

```bash
npm install
npm run dev
```

Open the recruiter interface at `http://localhost:5173/` and the candidate portal at `http://localhost:5173/careers`.

## Production build

```bash
npm run build
npm run preview
```

## Backend contracts

Candidate application:

```text
POST VITE_APPLICATION_CAPTURE_WEBHOOK_URL
Content-Type: multipart/form-data
```

Recruiter decision:

```json
{
  "applicant_id": "...",
  "decision": "APPROVED",
  "notes": "Strong technical fit. Proceed to interview."
}
```

## Current data behavior

The recruiter views and public job listings currently use the typed demo dataset for presentation. The application form itself is ready to call the real n8n Application Capture production webhook when the env variable is configured.

## Security

Never expose Supabase service-role keys, Gmail credentials, Gemini keys, or private n8n secrets in frontend environment variables.
