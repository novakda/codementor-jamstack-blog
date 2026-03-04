# JAMstack Blog Tutorial — Stack Evaluation

## What This Is

A JAMstack blog built with Eleventy and Decap CMS, following the Kevin Powell tutorial updated for current tools. This is both a learning exercise and an evaluation of the Eleventy + Decap CMS + Netlify stack for potential use on pattern158.solutions, a career portfolio site.

## Core Value

A working end-to-end JAMstack content pipeline: edit content in a CMS, auto-build via Netlify, publish as static HTML. Proving this workflow works is more important than the blog content itself.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. Inferred from existing codebase. -->

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

### Active

<!-- Current scope. Building toward these. -->

- [ ] Decap CMS integrated for browser-based content editing
- [ ] CMS admin panel accessible at /admin
- [ ] CMS configured to create/edit blog posts with all frontmatter fields
- [ ] Netlify Identity for CMS authentication
- [ ] Site deployed to Netlify with automatic builds on git push
- [ ] Netlify build configuration (netlify.toml or UI config)

### Out of Scope

<!-- Explicit boundaries. -->

- Career portfolio data pipeline — separate project after evaluation
- SQLite/structured data integration with Eleventy — future exploration, not this tutorial
- Custom domain setup — can be done later via Netlify settings
- Multiple content types beyond blog posts — tutorial scope only
- Advanced CMS features (editorial workflow, media library customization) — beyond tutorial

## Context

**Origin:** Kevin Powell's "Build a JAMstack blog" YouTube tutorial (https://www.youtube.com/watch?v=4wD00RT6d-g). The tutorial originally used Netlify CMS, which has been rebranded to Decap CMS. The code changes are minimal (package names and CDN URLs).

**Evaluation goals:** This project evaluates whether the Eleventy + CMS stack could work for pattern158.solutions, a career portfolio site. Key questions being tested:
1. Is Markdown with frontmatter a viable content foundation?
2. Does the CMS editing experience work well enough for regular content updates?
3. How smooth is the Netlify CI/CD pipeline?

**Future consideration:** The portfolio site would also need to integrate structured data from a SQLite database (clients, emails, technologies, testimonials). Eleventy's `_data/` directory system could potentially handle this, but that's out of scope for this tutorial project.

**Existing codebase:** Eleventy 3.x site is fully built — homepage, blog listing, article pages, CSS, templates. Only the CMS layer and deployment remain.

## Constraints

- **Stack**: Eleventy 3.x, Decap CMS, Netlify — following tutorial choices
- **Auth**: Netlify Identity — simplest integration for tutorial context
- **Scope**: Tutorial completion only — no portfolio features

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Decap CMS over alternatives | Direct successor to Netlify CMS, tutorial steps translate 1:1 | — Pending |
| Netlify Identity over GitHub OAuth | Built into Netlify, matches tutorial approach, simplest setup | — Pending |
| Tutorial scope only | Evaluate stack feasibility before investing in portfolio features | — Pending |

---
*Last updated: 2026-03-03 after initialization*
