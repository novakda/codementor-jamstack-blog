# External Integrations

**Analysis Date:** 2026-03-03

## APIs & External Services

**None Detected**

This is a static site generator project with no external API integrations currently configured.

## Data Storage

**Databases:**
- None - Static site generator with no database

**File Storage:**
- Local filesystem only
  - Blog posts: Markdown files in `src/blog/`
  - Assets: Images and logos in `src/assets/`
  - Styles: CSS file in `src/style.css`

**Caching:**
- None - Eleventy generates static files; caching handled by CDN/web server

## Authentication & Identity

**Auth Provider:**
- None - Static site with no authentication

## Monitoring & Observability

**Error Tracking:**
- None - Static site generation, no runtime errors to track

**Logs:**
- Console output only during build process
- Eleventy dev server logs in development mode (`npm start`)

## CI/CD & Deployment

**Hosting:**
- Not specified in project configuration
- Supports any static hosting: Netlify, GitHub Pages, AWS S3, etc.
- README mentions Netlify as tutorial reference

**CI Pipeline:**
- Not configured in project
- Can be added via GitHub Actions, Netlify builds, or other CI services
- Build command: `npm run build`
- Output directory: `public/`

## Environment Configuration

**Required env vars:**
- None - Project requires no environment variables

**Secrets location:**
- Not applicable - No external services or secrets

## Webhooks & Callbacks

**Incoming:**
- None - Static site generator with no server

**Outgoing:**
- None - No external API calls

## Build Process

**Static Site Generation:**
- Eleventy processes input from `src/` directory
- Converts Nunjucks templates and Markdown to HTML
- Outputs to `public/` directory
- Can be deployed directly from `public/` to any static hosting

**Local Development:**
- Eleventy dev server watches for file changes
- Live reload enabled for development workflow
- Command: `npm start`

---

*Integration audit: 2026-03-03*
