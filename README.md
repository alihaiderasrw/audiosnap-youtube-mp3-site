# AudioSnap - YouTube to MP3 Website Starter

Production-style Next.js starter based on the provided brief. It includes a polished responsive converter interface, server API layer, validation, simple rate limiting, SEO pages, legal pages, sitemap, robots.txt and a provider adapter.

## Important
This project does not implement scraping or restriction-bypass logic. The converter endpoint only works after you connect an authorized processing provider through `CONVERSION_API_URL` and `CONVERSION_API_KEY`.

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local` and fill in your real site URL and authorized provider details.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Production
- Deploy to Vercel, a Node.js server, or Docker-compatible hosting.
- Keep conversion secrets server-side only.
- Replace the in-memory API rate limiter with Redis/Upstash or your edge/WAF limiter for multi-instance deployments.
- Add a provider-specific adapter response mapper so `downloadUrl`, `title`, status and error codes are normalized.
- Add CSP, request body limits, observability, abuse reporting, analytics consent where applicable, and a privacy-compliant retention policy.

## SEO checklist
- Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin.
- Add unique long-form content to each landing page before indexing at scale.
- Avoid doorway pages and duplicate text.
- Add real blog routes as articles are published.
- Validate structured data in Google's testing tools.
- Submit `/sitemap.xml` in Search Console.

## Monetization
Ad slots can be added between sections, but avoid deceptive placements near the converter and never style ads as download buttons.
