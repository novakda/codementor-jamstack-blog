# JAMstack Blog Tutorial — Stack Evaluation

## What This Is

A JAMstack blog built with Eleventy and Decap CMS, following the Kevin Powell tutorial updated for current tools. Completed as both a learning exercise and an evaluation of the Eleventy + Decap CMS + Netlify stack for potential use on pattern158.solutions, a career portfolio site. Live at tangerine-ganache-973e48.netlify.app.

## Core Value

A working end-to-end JAMstack content pipeline: edit content in a CMS, auto-build via Netlify, publish as static HTML. Proving this workflow works is more important than the blog content itself.

## Requirements

### Validated

- ✓ Static site generation with Eleventy 3.x — existing
- ✓ Blog posts authored in Markdown with YAML frontmatter — existing
- ✓ Nunjucks template system with layout inheritance (base → article) — existing
- ✓ Homepage with featured articles section — existing
- ✓ Blog listing page showing all posts — existing
- ✓ Individual article pages with title, image, author, date, content — existing
- ✓ Reusable template components (header, footer, article-snippet) — existing
- ✓ Date formatting via Luxon postDate filter — existing
- ✓ CSS styling with custom properties and responsive design — existing
- ✓ Asset passthrough for images and static files — existing
- ✓ Decap CMS integrated for browser-based content editing — v1.0
- ✓ CMS admin panel accessible at /admin — v1.0
- ✓ CMS configured to create/edit blog posts with all frontmatter fields — v1.0
- ✓ Netlify Identity for CMS authentication — v1.0
- ✓ Site deployed to Netlify with automatic builds on git push — v1.0
- ✓ Netlify build configuration (npm run build, public directory) — v1.0

### Active

(None — tutorial scope complete. New requirements would come from a future milestone.)

### Out of Scope

- Career portfolio data pipeline — separate project after evaluation
- SQLite/structured data integration with Eleventy — future exploration, not this tutorial
- Custom domain setup — can be done later via Netlify settings
- Multiple content types beyond blog posts — tutorial scope only
- Advanced CMS features (editorial workflow, media library customization) — beyond tutorial
- Sveltia CMS migration — future consideration after tutorial evaluation

## Context

**Shipped v1.0** with 4,263 LOC across HTML, Nunjucks, CSS, JS, YAML, and Markdown.
Tech stack: Eleventy 3.x, Decap CMS (CDN-loaded), Netlify, Netlify Identity, Git Gateway.
Live site: tangerine-ganache-973e48.netlify.app

**Evaluation findings:**
1. Markdown with frontmatter works well as content foundation
2. CMS editing experience is functional for blog posts
3. Netlify CI/CD pipeline is smooth (push → build → deploy in seconds)
4. Content pipeline works end-to-end: CMS edit → GitHub commit → auto-rebuild

**Ecosystem concerns:**
- Decap CMS unmaintained since January 2026. Sveltia CMS is the recommended migration path.
- Netlify Identity deprecation was reversed after community feedback but remains a risk.
- For production use, evaluate alternative auth and CMS options.

## Constraints

- **Stack**: Eleventy 3.x, Decap CMS, Netlify — following tutorial choices
- **Auth**: Netlify Identity — simplest integration for tutorial context
- **Scope**: Tutorial completion only — no portfolio features

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Decap CMS over alternatives | Direct successor to Netlify CMS, tutorial steps translate 1:1 | ✓ Good — worked as drop-in replacement |
| Netlify Identity over GitHub OAuth | Built into Netlify, matches tutorial approach, simplest setup | ✓ Good — invite-only provides security |
| Tutorial scope only | Evaluate stack feasibility before investing in portfolio features | ✓ Good — evaluation complete |
| CDN-loaded CMS (no npm install) | Simplest approach for tutorial | ✓ Good — no dependency management |
| test-repo → git-gateway phasing | Isolate CMS interface testing from auth complexity | ✓ Good — caught issues separately |
| Identity widget site-wide | Required for invite email token detection on homepage | ✓ Good — invite flow works |
| Invite-only registration | CMS grants write access to repo; open registration too risky | ✓ Good — security appropriate |
| Explicit branch: main in git-gateway | Prevents default 'master' branch mismatch | ✓ Good — prevented silent failures |

---
*Last updated: 2026-03-05 after v1.0 milestone*
