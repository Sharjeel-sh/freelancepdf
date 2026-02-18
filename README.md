# FreelancePDF MVP

Production-minded MVP that converts a freelancer's PDF resume into a live portfolio website.

## Stack

- **Next.js 14 + Tailwind CSS** frontend + API backend
- **PDF parsing** via `pdf-parse` with section heuristics
- **Publishing** with free subdomain routing using Next middleware
- **Data persistence** in PostgreSQL (optional) with in-memory fallback

## Features

- PDF upload with MIME + file-size validation
- Automatic extraction of name, contact details, summary, skills, experience, projects, education, certifications
- Live responsive website preview
- Theme toggle (light/dark) + font style selector
- One-click publish to `https://<name>.freelancepdf.site` and fallback route `/p/<name>`
- SEO metadata on published pages
- Optional QR code generation for sharing

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Production notes

1. Point wildcard DNS `*.freelancepdf.site` to your deployment.
2. Set `NEXT_PUBLIC_APP_DOMAIN=freelancepdf.site`.
3. Provide `DATABASE_URL` for persistent published portfolios.
4. Add auth + ownership checks before allowing updates/deletes.
5. Add object storage (S3/R2) if you want to retain uploaded PDFs.

## API endpoints

- `POST /api/parse-pdf` accepts `multipart/form-data` with `pdf`
- `POST /api/publish` accepts extracted data + theme settings

## Performance and security

- PDF size capped at 8 MB.
- Strict file type checks.
- Parsing/generation runs in API route and preview updates immediately.
- Portfolio render is static-like and optimized for quick first load.
