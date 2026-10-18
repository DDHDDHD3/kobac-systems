<div align="center">


## Run Locally

**Prerequisites:** Node.js and pnpm


1. Install dependencies:
   `pnpm install`
2. Create a local `.env` file beside `server.ts` (on PowerShell: `Copy-Item .env.example .env`).
3. Replace the `DATABASE_URL` example value with your Neon PostgreSQL connection string from the Neon dashboard. It must start with `postgresql://`. Do not share this URL or commit `.env`.
4. Optionally set `GEMINI_API_KEY` in the server-side `.env` file. Keep this key out of client-side `VITE_` variables and out of source control.
5. Optionally set unique `KOBAC_CEO_PASSWORD`, `KOBAC_CDSO_PASSWORD`, and `KOBAC_OPS_PASSWORD` values in `.env` to provision or update those initial staff accounts. Never commit real passwords.
6. Run the app on port 3000:
   `pnpm dev`

If `DATABASE_URL` is missing or still contains the example placeholders, the website shell still starts on port 3000, but database-backed API routes return HTTP 503 until a real connection string is configured. Check the configuration status at `http://localhost:3000/api/health`.

## Deploy to Vercel

Import `DDHDDHD3/kobac-systems` as a Vercel project with the repository root as the project root. The included Vercel configuration builds the Vite frontend, routes API requests to serverless functions, and forwards them to the Express app.

Set `DATABASE_URL` in the Vercel project's Environment Variables for Production and Preview deployments. Set `GEMINI_API_KEY` if the AI features should be enabled. Existing staff accounts keep their database passwords unless the optional `KOBAC_CEO_PASSWORD`, `KOBAC_CDSO_PASSWORD`, or `KOBAC_OPS_PASSWORD` variables are configured. Never put credentials in `VITE_` variables, commit them, or paste deployment tokens into chat. After changing environment variables, redeploy the project.

## Shared Application Data

Neon PostgreSQL is the source of truth for the Operations Portal and public website. The staff dashboard loads its CRM, projects, documents, contracts, reports, team, company settings, inquiries, and case studies from authenticated APIs. The public website reads published case studies, active team profiles, company contact details, and branding from the public bootstrap API. Staff can create, edit, publish, unpublish, and delete case studies in the dashboard's **Public Website Content** section; drafts are not returned by the public API. Saving dashboard changes refreshes both dashboard and public website data. Public endpoints are limited to website inquiries, project scoping, AI chat, and published website data.

The public AI assistant uses the company settings and published case studies from the database as its context. Private dashboard records are not supplied to the public AI assistant. If Gemini is unavailable or not configured, the chat returns an explicit service error rather than a simulated AI answer.

## Reports & Presentations

Signed-in staff can create, edit, and delete reports in the Operations Portal. Report records are stored in Neon and included in authenticated dashboard data. PDF-ready print views and CSV downloads use the latest available project, client, contract, and audit data.

## AI Project Scoping

The public AI Project Scoping Wizard uses `GEMINI_API_KEY` on the server to create a recommendation from the selected service, organization type, and submitted business challenge. Project inquiries are stored with their recommendation in the existing Communications & Inquiries workflow. Signed-in staff can review, assign, and update requests there; accepted requests can be converted into client and project records.
