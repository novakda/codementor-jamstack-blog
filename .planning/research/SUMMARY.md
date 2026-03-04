# Project Research Summary

**Project:** JAMstack Blog with Headless CMS (Codementor Tutorial)
**Domain:** Static site generation + Git-based CMS
**Researched:** 2026-03-04
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is a JAMstack blog built with Eleventy 3.x (static site generator) + Decap CMS (Git-based headless CMS) + Netlify (hosting/CI/CD). The recommended approach is straightforward: content stored as Markdown files with YAML frontmatter in Git, CMS provides browser-based editing UI, automated builds deploy static HTML to a global CDN. This architecture eliminates database/server complexity while providing version control for all content.

The main risks center around ecosystem deprecation: Decap CMS is no longer actively maintained (last meaningful update January 2026), and Netlify Identity (required for authentication) was deprecated in February 2026 but remains supported after community backlash. For this tutorial project, the stack remains functional and appropriate for learning. For production use beyond 2026, migration to Sveltia CMS (drop-in Decap replacement with active development) is strongly recommended.

Critical success factors: correct admin folder placement, explicit media path configuration, Node 18+ specification, and enabling both Netlify Identity AND Git Gateway (common oversight). The architecture has well-documented patterns, minimal dependencies, and clear separation between content management (CMS) and content rendering (Eleventy). Most pitfalls are configuration errors caught during initial deployment testing.

## Key Findings

### Recommended Stack

The Eleventy + Decap CMS + Netlify stack is technically sound but has ecosystem concerns. Eleventy 3.x is actively maintained with excellent documentation and a strong community. Decap CMS (formerly Netlify CMS) provides a functional Git-based editing experience via a React SPA loaded at `/admin`, but development has stagnated with security vulnerabilities going unaddressed. Netlify Identity handles authentication but was officially deprecated in February 2026, creating uncertainty for long-term projects.

**Core technologies:**
- **Eleventy 3.1.2**: Static site generation with Nunjucks templates — active development, flexible ESM/CommonJS support, battle-tested for JAMstack sites
- **Decap CMS 3.10.1**: Git-backed content editing UI — tutorial-compatible and functional, but unmaintained (consider Sveltia CMS for production)
- **Netlify**: Hosting + CI/CD + Git Gateway — automatic Eleventy detection, free tier sufficient, integrated authentication despite Identity deprecation
- **Netlify Identity + Git Gateway**: Authentication proxy — deprecated but supported, enables non-technical editors without GitHub accounts
- **Luxon 3.7.2**: Date formatting — already integrated in project for `postDate` filter

**Installation method:** CDN-based (no npm packages for CMS). Load Decap CMS via `<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js">` to avoid React peer dependency complexity.

**Version compatibility:** Eleventy 3.x works in both ESM and CommonJS modes. Current project uses CommonJS (`module.exports` syntax), which is fully supported and requires no migration.

### Expected Features

Content management via Git-backed CMS is well-established in the JAMstack ecosystem. Research identified clear table stakes, competitive differentiators, and anti-features to avoid.

**Must have (table stakes):**
- Content CRUD (create/read/update/delete) via browser UI — baseline CMS functionality
- Markdown editing with formatting toolbar — modern editors expect rich text, not raw HTML
- Image upload and media library — drag-and-drop with preview
- Authentication protecting `/admin` route — OAuth or Identity service
- Content preview panel — real-time rendering before publish
- Save drafts via Git commits — multi-session editing
- Collection schemas with frontmatter validation — title, date, author, image, SEO metadata
- Version control built-in — Git provides complete audit trail and rollback

**Should have (competitive):**
- Git-based workflow — differentiates from database-backed CMSs, provides version history
- Deploy previews — see changes on staging URL before merging to production
- Custom preview templates — match live site design in CMS preview panel
- Relation fields — link content across collections (e.g., author → posts)
- Media integrations (Cloudinary/Uploadcare) — offload image hosting and optimization

**Defer (v2+):**
- Editorial workflow (draft → review → publish stages) — adds complexity via branch/PR flow, only needed for multi-author teams with review requirements
- Localization/i18n — multi-language content management, no immediate need
- Open authoring — community contributions via fork-and-PR, conflicts with Netlify Identity auth
- Content scheduling — future-date publishing requires external build triggers
- Custom widgets — domain-specific field types, standard widgets likely sufficient

### Architecture Approach

The architecture follows JAMstack best practices: static content generation with Git as the database, browser-based admin interface, and edge CDN delivery. Content flows one direction at build time (Markdown → HTML), while editing flows through an authentication proxy (CMS → Git Gateway → GitHub API).

**Major components:**
1. **Decap CMS (React SPA)** — Browser-based editing UI served at `/admin`, communicates with Git via Gateway, no direct repository access
2. **Git Gateway + Netlify Identity** — Authentication proxy validates JWT tokens and proxies Git API calls, enabling editors without GitHub accounts
3. **GitHub repository** — Single source of truth for both content (Markdown + frontmatter) and code (templates, config), triggers builds on push
4. **Eleventy (SSG)** — Build-time transformer reads Markdown, applies Nunjucks templates, outputs static HTML to `public/` directory
5. **Netlify CI/CD** — Detects Git pushes via webhook, runs `npm install && eleventy`, deploys `public/` to global CDN (1-3 minute latency)
6. **Netlify CDN** — Serves pre-built static assets globally, no server-side rendering or database queries

**Key architectural patterns:**
- **Content as Code:** Markdown files with YAML frontmatter stored in Git, not a separate database
- **Single-Page Admin:** CMS is a static React app (not a server), loaded via CDN at `/admin`
- **Build-Triggered Deployment:** Git commits automatically trigger build and deploy, no manual intervention
- **Authentication Proxy:** Git Gateway sits between CMS and GitHub API, managing credentials and access control

**Critical structural requirements:**
- `admin/` folder in project root (not build output), copied to `public/admin/` via passthrough
- `src/_includes/` for Nunjucks templates with layout inheritance
- `src/blog/` for Markdown posts with `blog.json` directory data file
- `public/` as build output (generated, ignored in `.gitignore`)

### Critical Pitfalls

Research identified 7 critical pitfalls, mostly configuration errors caught during initial setup and deployment testing.

1. **Admin folder in build output directory** — Developers place `admin/` in `_site/` (build output) instead of project root, causing files to be deleted on rebuild. Fix: Create `admin/` in project root and use `eleventyConfig.addPassthroughCopy("admin")` to copy to output.

2. **Cloudflare proxy blocking Netlify Identity** — When custom domain routes through Cloudflare proxy (orange cloud), `/.netlify/identity/*` endpoints return 405 errors. Fix: Disable Cloudflare proxy (DNS-only mode) or access admin at `yoursite.netlify.app` instead of custom domain.

3. **Missing Git Gateway activation** — Developers enable Netlify Identity but forget Git Gateway, causing "API_ERROR" on save/publish. Fix: Enable both Identity AND Git Gateway in Netlify settings (two separate steps).

4. **Eleventy 3.x ESM/Node version mismatch** — Netlify builds fail if Node < 18 or `package.json` missing `"type": "module"` (if using ESM). Fix: Specify Node 20 in `netlify.toml` or `.nvmrc`, ensure module type matches config file syntax.

5. **media_folder and public_folder path mismatches** — Uploaded images have broken paths because Decap adds leading `/` to `media_folder` when `public_folder` is unset. Fix: Explicitly configure both: `media_folder: "src/assets/blog"` and `public_folder: "/assets/blog"`.

6. **Netlify Identity widget script not loaded** — Authentication fails if widget script missing from home page or `/admin` page. Fix: Include `<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>` on both pages.

7. **.gitignore node_modules pattern breaks build plugins** — When using Netlify build plugins, `node_modules` pattern doesn't ignore `.netlify/plugins/node_modules/`, causing conflicts. Fix: Change pattern to `**/node_modules/**` (official Netlify recommendation).

## Implications for Roadmap

Based on research, the integration is straightforward with two distinct phases: CMS configuration (no deployment needed), then Netlify deployment (unlocks authentication). The project already has a working Eleventy site with templates and content, so only CMS integration and deployment remain.

### Phase 1: CMS Integration (Local Development)
**Rationale:** CMS can be configured and tested locally without Netlify account, using test backend. This isolates configuration issues from deployment complexity. Admin folder structure, collection schemas, and media paths can be validated before authentication concerns arise.

**Delivers:**
- `admin/` folder with `index.html` and `config.yml`
- Collection schema matching existing blog post structure
- Passthrough copy configuration in `eleventy.config.js`
- Media folder paths aligned with existing asset structure
- Local testing via test backend (`backend: name: test-repo`)

**Addresses features:**
- Content CRUD structure (collection definition)
- Markdown editing (widget configuration)
- Image upload configuration (media paths)
- Content preview (default preview, custom template optional)

**Avoids pitfalls:**
- Admin folder in build output (pitfall #1) — caught by local build testing
- media_folder/public_folder mismatches (pitfall #5) — validated with test image upload
- Module type/Node version issues (pitfall #4) — verified by successful local builds

**Research flag:** SKIP RESEARCH — well-documented pattern, official Decap CMS docs provide complete configuration reference, multiple tutorial walkthroughs available.

### Phase 2: Netlify Deployment & Authentication
**Rationale:** Deployment must happen before authentication can be configured (Identity/Git Gateway only available on deployed sites). All authentication-related pitfalls surface here. This phase unlocks live CMS functionality but requires careful attention to authentication flow and service activation.

**Delivers:**
- Site deployed to Netlify with automatic build detection
- Netlify Identity enabled with "Invite only" registration
- Git Gateway enabled (separate from Identity)
- Netlify Identity widget script added to site pages
- `.gitignore` updated for build plugin compatibility
- Node version specified in `netlify.toml` or `.nvmrc`
- First user invited and authentication tested

**Addresses features:**
- Authentication protecting `/admin`
- Save drafts (Git commits via Gateway)
- Deployment integration (auto-build on commit)
- Version control (built-in via Git)

**Avoids pitfalls:**
- Missing Git Gateway (pitfall #3) — checklist ensures both Identity AND Gateway enabled
- Cloudflare proxy blocking (pitfall #2) — test authentication on both subdomain and custom domain
- Identity widget not loaded (pitfall #6) — widget script added to home and admin pages
- .gitignore pattern breaking plugins (pitfall #7) — updated before enabling plugins
- Node version mismatches (pitfall #4) — specified in deployment config

**Research flag:** SKIP RESEARCH — standard Netlify deployment pattern, well-documented in both Eleventy and Netlify official docs, no novel integration patterns.

### Phase 3: Production Hardening (Optional Enhancement)
**Rationale:** Once basic CMS workflow is validated, optional enhancements improve editor experience and site performance. These are not essential for tutorial completion but represent production-ready patterns. Defer until core functionality proven.

**Delivers:**
- Custom preview template matching live site design
- Image optimization pipeline (Eleventy Image plugin or Cloudinary)
- Custom domain configuration (if not using .netlify.app)
- Email template customization for Identity invitations
- Content Security Policy headers
- Additional editor invitations and workflow documentation

**Addresses features:**
- Custom preview templates (differentiator)
- Media integrations (differentiator, if using Cloudinary)
- Deploy previews (optional, Netlify provides by default)

**Research flag:** SKIP RESEARCH — these are polish items with established patterns, not architecturally complex.

### Phase Ordering Rationale

- **CMS before Deployment:** Admin folder structure and collection configuration can be tested locally with test backend, isolating config errors from authentication complexity. This reduces cognitive load during deployment when multiple moving pieces (Identity, Gateway, webhooks) come online simultaneously.

- **Authentication after Deployment:** Netlify Identity and Git Gateway only exist on deployed sites, creating hard dependency. Attempting authentication setup before deployment creates confusion and wasted effort.

- **Hardening deferred:** Custom preview templates, image optimization, and custom domains don't impact core CMS functionality. These enhancements can be added incrementally after validating basic edit → commit → deploy flow.

**Dependency chain from research:**
```
Git Repository (exists)
  → Eleventy Site (working locally, exists)
  → CMS Config (Phase 1)
  → Deploy to Netlify (Phase 2 prerequisite)
  → Enable Netlify Identity (Phase 2)
  → Enable Git Gateway (Phase 2, depends on Identity)
  → Configure CMS backend switch to git-gateway (Phase 2)
  → Add Identity widget (Phase 2)
  → Invite users (Phase 2)
  → Production enhancements (Phase 3, optional)
```

**Pitfall avoidance through phasing:**
- Configuration pitfalls (#1, #5) caught in Phase 1 local testing
- Authentication pitfalls (#2, #3, #6) addressed in Phase 2 checklist
- Deployment pitfalls (#4, #7) resolved before authentication layer

### Research Flags

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (CMS Integration):** Decap CMS configuration is well-documented with official docs, multiple tutorials, and reference implementations. Collection schema mapping to existing Eleventy structure is straightforward.
- **Phase 2 (Deployment):** Netlify deployment for Eleventy is automatic (framework detection), and Identity/Git Gateway setup follows official Netlify documentation. No novel integration patterns.
- **Phase 3 (Hardening):** All optional enhancements (custom previews, image optimization, CSP) have established patterns documented in Eleventy and Netlify guides.

**No phases require deeper research.** The architecture is well-traveled, documentation is comprehensive, and research has already identified and documented all major pitfalls. Implementation can proceed directly from research findings.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | Eleventy/Netlify documentation is HIGH confidence (official, current). Decap CMS confidence is MEDIUM due to maintenance status, but tutorial use case is validated by recent (2026) community implementations. Netlify Identity deprecation documented but service still functional. |
| Features | MEDIUM | Official Decap docs provided core feature list (HIGH confidence), but some advanced features (editorial workflow, open authoring) returned 404s suggesting documentation gaps. MVP feature set is well-established. Competitor positioning based on training data (LOW confidence, flagged for validation). |
| Architecture | HIGH | Multiple official sources (Decap CMS docs, Netlify docs, Eleventy docs) plus verified community implementations. Data flows, component boundaries, and integration patterns are well-documented. Reference implementations (GitHub repos) confirm patterns. |
| Pitfalls | HIGH | Seven critical pitfalls sourced from recent (2024-2026) blog posts, official Netlify docs, and GitHub issue trackers. Each pitfall has documented symptoms, prevention, and recovery. Cloudflare proxy issue confirmed in multiple independent sources. |

**Overall confidence:** MEDIUM-HIGH

Research provides strong foundation for implementation. Primary uncertainty is long-term ecosystem viability (Decap maintenance, Identity deprecation), not technical feasibility. For tutorial scope, stack is appropriate and well-understood.

### Gaps to Address

**Ecosystem deprecation timeline** — Netlify Identity deprecated February 2026 but reversed course due to developer feedback. Unclear when/if it will be removed entirely. Decap CMS stagnant since January 2026 with security issues unaddressed.

**Handling:** For tutorial project, proceed with current stack (matches tutorial and is functional). Document Sveltia CMS as migration path for production use. Add README note about ecosystem status for future readers.

**Competitor feature verification** — FEATURES.md flags Contentful, Strapi, and Sanity competitor details as LOW confidence (WebFetch failed, based on training data).

**Handling:** Not critical for implementation since this is a Decap-focused tutorial, not a CMS comparison project. If building CMS decision matrix later, revisit with manual research.

**Editorial workflow complexity** — PITFALLS.md notes common issues (branch conflicts, PR failures, field loading) but research didn't deep-dive this feature since MVP defers it.

**Handling:** Phase 1 and 2 skip editorial workflow (use simple Git commits). If Phase 3 adds it, trigger `/gsd:research-phase` for editorial workflow specifics.

**Custom preview template implementation** — ARCHITECTURE.md mentions React components for preview but doesn't detail implementation.

**Handling:** Phase 3 item, not blocking. If implemented, reference official Decap CMS customization docs or community examples.

## Sources

### Primary (HIGH confidence)
- **Decap CMS Official Documentation** (https://decapcms.org/docs/) — Installation methods, configuration options, Git Gateway backend, widget types. Some documentation URLs returned 404 (editorial workflow, beta features), suggesting documentation restructuring.
- **Netlify Official Documentation** (https://docs.netlify.com/) — Eleventy framework guide, Identity overview, Git Gateway architecture, build hooks.
- **Eleventy Official Documentation** (https://www.11ty.dev/docs/) — Configuration, CMS integration, deployment patterns.
- **npm Package Registry** — Decap CMS 3.10.1 (latest, published 2026-01-08), netlify-identity-widget 1.9.2 (last update 4 years ago), Luxon 3.7.2.

### Secondary (MEDIUM confidence)
- **Adding Decap CMS to 11ty** (Cassey Lottman, https://cassey.dev/adding-decap-cms-to-11ty/) — Practical integration guide with media path gotcha documentation.
- **Decap CMS with Netlify: Git Gateway, Build Hooks, and the Cloudflare Gotcha** (Dylan Bochman, 2026-01-15) — Critical Cloudflare proxy issue with reproduction steps.
- **My Decap CMS setup with 11ty** (Patrick Grey, 2024-09-21) — Admin folder structure pattern and Cloudflare Pages variant.
- **Building a Blog CMS with Decap CMS** (DasRoot, 2026-01) — Complete setup walkthrough.
- **Netlify Identity deprecation discussion** (GitHub decaporg/decap-cms #7419) — Community response to deprecation, official announcements.
- **GitHub reference implementations** — eleventy-netlify-boilerplate (danurbanowicz), eleventy-netlify-starter-blueprint (OleksiiBrylin).

### Tertiary (LOW confidence)
- **Competitor feature analysis** (Contentful, Strapi, Sanity) — Based on 2024 training data, WebFetch failed for current docs. Flagged for verification if needed.
- **Sveltia CMS migration case studies** — Community blog posts about Decap → Sveltia migration, useful for future reference.

### Project Context (HIGH confidence)
- **PROJECT.md, existing codebase** — Current implementation uses Eleventy 3.1.2 (CommonJS mode), Luxon for date filtering, blog posts in `src/blog/`, templates in `src/_includes/`. CMS integration and deployment are remaining scope.

---
*Research completed: 2026-03-04*
*Ready for roadmap: yes*
