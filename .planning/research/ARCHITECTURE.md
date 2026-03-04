# Architecture Research

**Domain:** JAMstack Blog with Headless CMS
**Researched:** 2026-03-04
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Interaction Layer                       │
│  ┌──────────────────┐  ┌──────────────────────────────────────┐     │
│  │   CMS Admin UI   │  │     Static Site (End Users)          │     │
│  │   (/admin)       │  │     (Public Pages)                   │     │
│  └────────┬─────────┘  └──────────────────────────────────────┘     │
│           │                                                          │
├───────────┴──────────────────────────────────────────────────────────┤
│                      Authentication Layer                            │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Netlify Identity + Git Gateway (JWT-based auth)               │  │
│  └──────────────────────┬─────────────────────────────────────────┘  │
│                         │                                            │
├─────────────────────────┴────────────────────────────────────────────┤
│                      Content Management Layer                        │
│  ┌───────────────┐     ┌────────────────┐     ┌─────────────────┐   │
│  │  Decap CMS    │────▶│  Git Gateway   │────▶│  GitHub API     │   │
│  │  (React App)  │     │  (Auth Proxy)  │     │  (Git Backend)  │   │
│  └───────────────┘     └────────────────┘     └────────┬────────┘   │
│                                                         │            │
├─────────────────────────────────────────────────────────┴────────────┤
│                         Storage Layer                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │         Git Repository (GitHub/GitLab/Bitbucket)             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │    │
│  │  │  Markdown    │  │   Assets     │  │  Templates   │       │    │
│  │  │  + YAML      │  │  (Images)    │  │  (Nunjucks)  │       │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │    │
│  └───────────────────────────┬─────────────────────────────────┘    │
│                              │ (git push / webhook)                 │
├──────────────────────────────┴──────────────────────────────────────┤
│                        Build & Deploy Layer                          │
│  ┌────────────────┐     ┌────────────────┐     ┌─────────────────┐  │
│  │  Git Webhook   │────▶│  Netlify CI    │────▶│  Eleventy Build │  │
│  │  (Trigger)     │     │  (Orchestrator)│     │  (SSG Process)  │  │
│  └────────────────┘     └────────────────┘     └────────┬────────┘  │
│                                                          │           │
├──────────────────────────────────────────────────────────┴───────────┤
│                         Delivery Layer                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │            Netlify CDN (Global Edge Network)                 │    │
│  │            Serves: public/ directory (HTML, CSS, Assets)     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Decap CMS** | Browser-based content editing UI | React SPA loaded at `/admin`, interacts with Git backend via API |
| **Git Gateway** | Authentication proxy for Git operations | Netlify-hosted service that validates JWT tokens and proxies Git API calls |
| **Netlify Identity** | User authentication and management | JWT-based identity service with email invitations and role management |
| **GitHub API** | Git repository backend | Stores content as Markdown files with YAML frontmatter in repository |
| **Eleventy** | Static site generation | Reads Markdown, applies Nunjucks templates, outputs HTML to `public/` |
| **Netlify CI** | Build orchestration and hosting | Detects git pushes, runs build commands, deploys to CDN |
| **Netlify CDN** | Content delivery network | Serves pre-built static HTML/CSS/assets globally |

## Recommended Project Structure

```
project-root/
├── admin/                  # CMS admin panel (static files)
│   ├── index.html          # Decap CMS entry point (includes React CDN)
│   └── config.yml          # CMS configuration (backend, collections, fields)
├── src/                    # Eleventy source files
│   ├── _includes/          # Nunjucks templates and components
│   │   ├── base.njk        # Base layout
│   │   ├── article.njk     # Article layout
│   │   ├── header.njk      # Reusable header component
│   │   ├── footer.njk      # Reusable footer component
│   │   └── article-snippet.njk # Article preview component
│   ├── blog/               # Blog post content (Markdown)
│   │   ├── blog.json       # Directory data (layout, tags)
│   │   └── *.md            # Individual blog posts (frontmatter + content)
│   ├── assets/             # Static media files
│   │   ├── blog/           # Blog images
│   │   └── logo.svg        # Site branding
│   ├── style.css           # Site styling
│   ├── index.njk           # Homepage template
│   └── blog.njk            # Blog listing page template
├── public/                 # Build output directory (generated, not committed)
│   ├── admin/              # CMS files (passthrough from admin/)
│   ├── blog/               # Generated blog pages
│   │   └── [slug]/         # Individual article pages
│   │       └── index.html  # Article HTML
│   ├── assets/             # Copied static assets
│   ├── style.css           # Copied CSS
│   ├── index.html          # Generated homepage
│   └── blog/index.html     # Generated blog listing
├── eleventy.config.js      # Eleventy build configuration
├── netlify.toml            # Netlify build settings (optional, can use UI)
└── package.json            # Node dependencies and scripts
```

### Structure Rationale

- **admin/:** Separate from Eleventy source, passthrough-copied to `public/admin/` for CMS access at `/admin` route
- **src/_includes/:** Template components follow Nunjucks conventions with layout inheritance (base.njk ← article.njk)
- **src/blog/:** Content files organized by type; `blog.json` applies shared data (layout, tags) to all posts in directory
- **public/:** Generated at build time, ignored in `.gitignore`, served by Netlify CDN

## Architectural Patterns

### Pattern 1: Git-Based CMS (Content as Code)

**What:** Content stored as Markdown files with YAML frontmatter directly in Git repository, not in a separate database.

**When to use:** Static sites, content versioning requirements, developer-friendly workflows, JAMstack architectures.

**Trade-offs:**
- **Pros:** Version history for content, content/code same repository, no database to manage, offline editing possible, free hosting
- **Cons:** Not suitable for high-frequency edits (100+ posts/day), binary file storage inefficient, merge conflicts possible, limited relational data modeling

**Example:**
```yaml
---
title: "My Blog Post"
date: 2026-03-04
author: "John Doe"
image: "/assets/blog/post-image.jpg"
description: "A brief description"
tags:
  - post
  - featured
---
This is the **Markdown content** that appears after frontmatter.
```

### Pattern 2: Single-Page Admin Interface

**What:** CMS admin panel delivered as a static single-page React application, not a server-side application.

**When to use:** Git-based content workflows, static hosting environments, when authentication is handled externally.

**Trade-offs:**
- **Pros:** No admin backend to maintain, works with static hosting, client-side rendering, CDN-cacheable
- **Cons:** Requires JavaScript enabled, larger initial bundle size, limited to browser-based editing, dependent on external APIs

**Example:**
```html
<!-- admin/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### Pattern 3: Build-Triggered Deployment (Continuous Deployment)

**What:** Git commits automatically trigger build process and deployment to production without manual intervention.

**When to use:** All JAMstack sites, teams using Git workflows, static site generators.

**Trade-offs:**
- **Pros:** Automatic deployments, no manual build steps, instant content publishing, rollback via Git
- **Cons:** Build time affects publish speed (typically 1-3 minutes), build failures block publishing, potential for accidental live deployments

**Example:**
```yaml
# netlify.toml
[build]
  command = "eleventy"
  publish = "public"

[build.environment]
  NODE_VERSION = "18"
```

### Pattern 4: Authentication Proxy (Git Gateway)

**What:** Intermediary service that authenticates CMS users via JWT and proxies Git API calls without granting direct repository access.

**When to use:** Content editors without GitHub accounts, controlled access to repository, JAMstack sites with non-technical editors.

**Trade-offs:**
- **Pros:** No GitHub accounts needed for editors, granular access control, centralized user management, simplified onboarding
- **Cons:** Dependency on third-party service (Netlify Identity), vendor lock-in potential, service deprecation risk (Identity being deprecated)

**Example:**
```yaml
# admin/config.yml
backend:
  name: git-gateway
  branch: main

# Git Gateway validates JWT from Netlify Identity, then proxies to GitHub API
```

## Data Flow

### Content Creation Flow

```
1. Editor navigates to /admin
2. Netlify Identity authenticates user (JWT token)
3. Decap CMS loads in browser (React app)
4. Editor creates/edits content in UI
5. CMS sends content to Git Gateway (with JWT)
6. Git Gateway validates JWT, proxies to GitHub API
7. GitHub receives commit with new/updated Markdown file
8. Git webhook notifies Netlify of new commit
9. Netlify CI pulls latest code from repository
10. Netlify runs: npm install && eleventy
11. Eleventy processes Markdown → HTML
12. Netlify deploys public/ directory to CDN
13. Updated site live at production URL
```

### Static Site Build Flow

```
1. Eleventy scans src/ directory
2. Front matter parsed from Markdown files
3. Collections built based on tags (post, featured)
4. Nunjucks templates applied to content
5. Custom filters executed (e.g., postDate via Luxon)
6. HTML generated for each page/post
7. Assets copied via passthrough rules
8. Output written to public/ directory
9. Build complete (exit code 0)
```

### Authentication Flow

```
1. User visits /admin
2. Decap CMS loads Netlify Identity widget
3. User enters email
4. Netlify sends invite/login email
5. User clicks link, creates password (first time)
6. Netlify Identity issues JWT token
7. Token stored in browser (localStorage)
8. CMS includes JWT in all API requests
9. Git Gateway validates token signature
10. On valid token, proxies request to GitHub
11. On invalid/expired token, returns 401
```

### Key Data Flows

1. **Content to Publication:** Markdown in Git → Eleventy build → HTML on CDN (one-way flow at build time)
2. **Editor to Repository:** CMS UI → Git Gateway (auth) → GitHub API → Repository (one commit per save)
3. **Build Trigger:** Git push → Webhook → Netlify CI → Build → Deploy (automatic, ~1-3 min latency)

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Standard architecture works perfectly. Single Netlify site, basic CDN caching, simple build process. |
| **1k-100k users** | Optimize build times (incremental builds, caching). Consider image CDN (Cloudinary/imgix) for media-heavy sites. Monitor build minutes quota on Netlify. |
| **100k+ users** | CDN handles traffic well (Netlify global edge). Potential bottlenecks: build time (large # of pages), Git repository size (many large images). Solutions: separate media storage, build-time page limits, static generation pagination. |

### Scaling Priorities

1. **First bottleneck:** Build time increases linearly with content volume. Eleventy can rebuild 1000+ pages in seconds, but 10,000+ pages may take minutes.
   - **Fix:** Implement incremental builds, use pagination for large collections, cache build artifacts

2. **Second bottleneck:** Git repository size grows with binary assets (images, PDFs). Large repos slow clone times during builds.
   - **Fix:** Use external media hosting (Cloudinary, imgix, S3), implement Git LFS for large files, aggressive image compression

## Anti-Patterns

### Anti-Pattern 1: Storing Large Media in Git Repository

**What people do:** Upload full-resolution images (5MB+ each) directly to Git repository via CMS.

**Why it's wrong:** Bloats repository size, slows clone times during builds, inefficient for versioning binary data, wastes Netlify bandwidth.

**Do this instead:** Configure `media_library` in `config.yml` to use external media service (Cloudinary, Uploadcare), or implement aggressive image compression pipeline at build time.

### Anti-Pattern 2: Direct GitHub Backend (Bypassing Git Gateway)

**What people do:** Configure Decap CMS with `backend: name: github` requiring all editors to have GitHub accounts with repository write access.

**Why it's wrong:** Security risk (editors can delete entire codebase), poor editor experience (GitHub login required), no centralized user management, direct repository access not auditable.

**Do this instead:** Use Git Gateway with Netlify Identity for non-technical editors. Reserve direct GitHub access only for developers who need code-level access.

### Anti-Pattern 3: Committing Build Output to Repository

**What people do:** Track `public/` or `_site/` directory in Git alongside source files.

**Why it's wrong:** Duplicates content (source + output), massive repository bloat, merge conflicts on generated files, confuses source of truth.

**Do this instead:** Add `public/` to `.gitignore`, let Netlify build on-demand from source. Repository contains only source files.

### Anti-Pattern 4: Manual Production Deployments

**What people do:** Build locally (`npm run build`), manually upload `public/` directory to hosting via FTP/SSH.

**Why it's wrong:** Loses continuous deployment benefits, error-prone manual process, no build history, different local environments cause inconsistencies.

**Do this instead:** Connect Git repository to Netlify, enable automatic deployments on push to main branch. Use branch deploys for staging/preview.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **GitHub** | Git API via Git Gateway | Stores content, triggers webhooks. GitLab/Bitbucket also supported. |
| **Netlify Identity** | JWT authentication | DEPRECATED as of 2026. Consider DecapBridge or GitHub OAuth as alternatives. |
| **Netlify CDN** | HTTP/HTTPS content delivery | Automatic, handles caching headers, supports custom domains. |
| **Cloudinary (optional)** | Media library integration | External image hosting, transformations, reduces Git repo size. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Eleventy ↔ Decap CMS** | Indirect (via Git repository) | CMS writes Markdown, Eleventy reads during build. No direct API. |
| **Decap CMS ↔ Git Gateway** | HTTPS API (POST with JWT) | RESTful JSON API, authenticated via Netlify Identity token. |
| **Git Gateway ↔ GitHub** | GitHub REST API v3 | Proxied requests, Git Gateway adds GitHub credentials. |
| **Netlify CI ↔ Git Repository** | Git clone via SSH/HTTPS | Pulls source code at start of each build. |

## Build Order and Dependencies

### Suggested Implementation Sequence

**Phase 1: Foundation (Existing)**
- Eleventy static site with templates
- Markdown content with frontmatter
- Local build and preview working
- Git repository initialized

**Phase 2: CMS Integration (No deployment required)**
- Create `admin/` folder with `index.html` and `config.yml`
- Configure collections matching existing content structure
- Add passthrough copy to Eleventy config
- Test CMS locally with test backend (`backend: name: test-repo`)

**Phase 3: Authentication Setup (Requires Netlify account)**
- Deploy site to Netlify (even without CMS working)
- Enable Netlify Identity in site settings
- Configure registration as "Invite only"
- Enable Git Gateway in Identity settings
- Invite first user (yourself)

**Phase 4: CMS Connection (All dependencies met)**
- Update `config.yml` backend to `git-gateway`
- Add Netlify Identity widget script to site HTML
- Commit and push to trigger Netlify build
- Test `/admin` route with authenticated user
- Create test post via CMS, verify commit appears in GitHub

**Phase 5: Production Readiness**
- Configure email templates for Identity (password reset, invitation)
- Set up custom domain (optional)
- Add editor users via Netlify Identity invitations
- Document editorial workflow for team

### Dependency Chain

```
Git Repository (GitHub)
  ↓ (must exist before)
Eleventy Site (working locally)
  ↓ (must exist before)
Deploy to Netlify
  ↓ (must be deployed before)
Enable Netlify Identity
  ↓ (must be enabled before)
Enable Git Gateway
  ↓ (must be enabled before)
Configure Decap CMS
  ↓ (must be configured before)
Add Identity Widget to Site
  ↓ (must be added before)
Invite Users
  ↓ (ready for)
Content Editing via CMS
```

**Critical path:** Cannot configure Git Gateway without Netlify Identity. Cannot use Decap CMS without Git Gateway. Must deploy to Netlify before enabling Identity (local development requires `backend: name: test-repo`).

## Component Boundaries (What Talks to What)

### Direct Communication (API Calls)
- **Decap CMS → Git Gateway** (authenticated HTTPS)
- **Git Gateway → GitHub API** (authenticated HTTPS)
- **Netlify Identity Widget → Netlify Identity API** (JWT exchange)
- **Netlify CI → GitHub** (git clone via SSH)

### Indirect Communication (Files)
- **Decap CMS → Eleventy** (via Markdown files in Git repository)
- **Eleventy → Netlify CDN** (via generated HTML in `public/` directory)

### Event-Driven Communication (Webhooks)
- **GitHub → Netlify** (push notification webhook triggers build)

### No Direct Communication
- **Decap CMS ↔ Eleventy** (completely decoupled, communicate only via Git repository)
- **Decap CMS ↔ Netlify CDN** (CMS doesn't know about hosting infrastructure)
- **Eleventy ↔ Netlify Identity** (SSG doesn't handle authentication)

## Important Considerations for 2026

### Netlify Identity Deprecation

**CRITICAL:** Netlify Identity (which Git Gateway depends on) is being deprecated. This impacts the standard authentication flow for Decap CMS.

**Alternatives:**
1. **DecapBridge** — Free service built specifically for Decap CMS as migration path from Netlify Identity
2. **GitHub OAuth Backend** — Use `backend: name: github` with GitHub authentication (requires editors have GitHub accounts)
3. **External OAuth Provider** — Implement custom OAuth2 backend with Netlify's External OAuth

**Recommendation for new projects:** Start with GitHub backend if editors are technical, or plan migration strategy if using Git Gateway. Monitor DecapBridge maturity for non-technical editor scenarios.

## Sources

### Official Documentation
- [Decap CMS Overview](https://decapcms.org/docs/intro/) — Core architecture, React app wrapper concept
- [Decap CMS Basic Steps](https://decapcms.org/docs/basic-steps/) — Integration steps and requirements
- [Decap CMS Configuration Options](https://decapcms.org/docs/configuration-options/) — Collections, frontmatter format, storage
- [Decap CMS Git Gateway Backend](https://decapcms.org/docs/git-gateway-backend/) — Authentication proxy pattern
- [Netlify Eleventy Framework Guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/eleventy/) — Build pipeline, auto-detection
- [Netlify Build Hooks](https://docs.netlify.com/build/configure-builds/build-hooks/) — Webhook-triggered builds
- [Netlify Identity Overview](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/) — JWT authentication
- [Netlify Git Gateway](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/) — Auth proxy architecture
- [Eleventy CMS Integration](https://www.11ty.dev/docs/cms/) — Official Eleventy CMS guidance
- [Eleventy Deployment](https://www.11ty.dev/docs/deployment/) — Deployment patterns

### Community Resources
- [Adding Decap CMS to 11ty (Cassey Lottman)](https://cassey.dev/adding-decap-cms-to-11ty/) — Step-by-step integration guide
- [My Decap CMS setup with 11ty (Patrick Grey, 2024-09-21)](https://www.patrickgrey.co.uk/notes/2024-09-21-my-decap-cms-setup-with-11ty-hosted-on-cloudflare-pages/) — Admin folder structure pattern
- [Decap CMS with Netlify Setup Guide (Dylan Bochman, 2026-01-15)](https://dylanbochman.com/blog/2026-01-15-decap-cms-netlify-setup-guide/) — Build hooks and Cloudflare considerations
- [Building a Blog CMS with Decap CMS (DasRoot, 2026-01)](https://dasroot.net/posts/2026/01/building-blog-cms-decap-netlify-cms/) — Complete setup walkthrough

### GitHub Reference Implementations
- [eleventy-netlify-boilerplate (danurbanowicz)](https://github.com/danurbanowicz/eleventy-netlify-boilerplate) — Battle-tested starter template
- [eleventy-netlify-starter-blueprint (OleksiiBrylin)](https://github.com/OleksiiBrylin/eleventy-netlify-starter-blueprint) — Modern boilerplate with Decap features
- [decap-cms repository](https://github.com/decaporg/decap-cms) — Official source code and documentation

### Deprecation Discussions
- [Netlify Identity deprecation discussion (GitHub #7419)](https://github.com/decaporg/decap-cms/discussions/7419) — Community response to Identity deprecation
- [Migrating away from Netlify Identity (Montagne Noire, 2026)](https://montagnenoirewebstudio.com/en/blog/migrating-netlify-identity/) — Migration strategies

---
*Architecture research for: JAMstack Blog with Eleventy + Decap CMS + Netlify*
*Researched: 2026-03-04*
*Confidence: HIGH (official documentation + multiple verified sources)*
