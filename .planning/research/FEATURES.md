# Feature Research

**Domain:** JAMstack Blog with Headless CMS
**Researched:** 2026-03-04
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Content CRUD (Create, Read, Update, Delete) | Core CMS functionality - editors need to manage posts | LOW | Decap CMS provides this via Git-backed interface |
| Rich text editing | Modern editors expect WYSIWYG, not raw HTML | LOW | Markdown widget with formatting toolbar is standard |
| Image upload & management | Blog posts need hero images and inline media | MEDIUM | Media library with drag-and-drop upload |
| Content preview | Editors need to see content before publishing | MEDIUM | Real-time preview panel in CMS admin |
| Authentication | CMS admin must be protected from public access | LOW | OAuth via GitHub/GitLab/Bitbucket or Netlify Identity |
| Save drafts | Content creation happens over multiple sessions | LOW | Git-based workflow enables draft commits |
| Content validation | Required fields, format checking before publish | LOW | Field-level validation (required, pattern matching) |
| Responsive admin UI | CMS must work on desktop and tablet | LOW | React-based admin is responsive by default |
| Collection-based content types | Different content needs different schemas (posts vs pages) | LOW | Collections define content models with custom fields |
| Version control | Editorial changes need history and rollback capability | LOW | Built-in via Git backend - every change is a commit |
| Date/time formatting | Posts need publication dates in readable formats | LOW | DateTime widget with Day.js formatting |
| SEO metadata fields | Title, description, image for social sharing | LOW | Custom fields in frontmatter schema |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Git-based workflow | All content changes tracked in version control | MEDIUM | Differentiates from database-backed CMSs - full audit trail |
| No database required | Deploy as static files, no server/DB to manage | LOW | JAMstack architecture advantage - lower ops complexity |
| Editorial workflow (staged publishing) | Drafts → Review → Published with status tracking | MEDIUM | Three-stage workflow with PR-based review process |
| Open authoring | Community contributors without repo access | HIGH | Enables fork-and-PR workflow for external contributors |
| Custom preview templates | Match live site design in CMS preview | MEDIUM | React components for accurate preview rendering |
| Relation fields | Link content across collections (author → posts) | MEDIUM | Enables structured content relationships |
| Deploy previews | See changes on staging URL before merging | MEDIUM | Integration with Netlify/Vercel deploy previews |
| Localization support | Multi-language content management | HIGH | i18n field duplication and language-specific collections |
| Custom widgets | Extend CMS with domain-specific field types | HIGH | React components for specialized inputs (color picker, map, etc.) |
| Multiple Git backends | Choice of GitHub, GitLab, Bitbucket, Azure DevOps | LOW | Flexibility for enterprise Git platform requirements |
| Media integrations | Cloudinary, Uploadcare for external asset storage | MEDIUM | Offload media hosting to CDN services |
| Content scheduling | Future-date publishing with build triggers | MEDIUM | Requires external scheduler (Netlify scheduled builds) |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real-time collaborative editing | "Google Docs for CMS" sounds appealing | Git conflicts, merge complexity, operational cost of WebSockets | Editorial workflow with clear handoff stages |
| Database backend for content | "More flexible than flat files" | Adds hosting/ops complexity, loses Git benefits, breaks JAMstack simplicity | Stick with Git-backed flat files - proven pattern |
| User roles and permissions | Enterprise teams want granular access control | Complexity explosion, feature creep, Git already handles this | Use Git platform's native permissions (branch protection, team roles) |
| In-CMS analytics/metrics | "See page views in the admin" | Scope creep, tight coupling, maintenance burden | Link to external analytics (Google Analytics, Plausible) |
| Full media editor (crop, resize, filters) | "Let editors manipulate images in CMS" | Complex feature, browser limitations, better done pre-upload | Use external tools (Figma, Photoshop) or CDN transforms (Cloudinary) |
| Workflow automation (Slack, email notifications) | "Notify team on publish" | Maintenance burden, integration complexity | Use Git platform's native notifications (GitHub Actions, webhooks) |

## Feature Dependencies

```
[Content CRUD]
    └──requires──> [Authentication]
    └──requires──> [Collection Schema]

[Editorial Workflow]
    └──requires──> [Save Drafts]
    └──requires──> [Git Backend]
    └──enhances──> [Deploy Previews]

[Media Library]
    └──requires──> [Authentication]
    └──optional──> [Media Integrations] (Cloudinary, etc.)

[Content Preview]
    └──requires──> [Collection Schema]
    └──enhances──> [Custom Preview Templates]

[Open Authoring]
    └──requires──> [Git Backend]
    └──conflicts──> [Netlify Identity Auth] (requires OAuth via Git platform)

[Relation Fields]
    └──requires──> [Multiple Collections]
    └──enhances──> [Content CRUD]

[Custom Widgets]
    └──requires──> [React Knowledge]
    └──extends──> [Field Types]
```

### Dependency Notes

- **Editorial Workflow requires Git Backend:** Three-stage workflow (drafts → review → published) maps to Git branches and pull requests
- **Open Authoring conflicts with Netlify Identity:** Open auth uses OAuth flow; Netlify Identity is separate system
- **Custom Widgets require React:** Decap CMS admin is React-based; custom widgets are React components
- **Deploy Previews enhance Editorial Workflow:** Review stage benefits from seeing changes on staging URL
- **Media Integrations are optional:** Can use Git-based media storage or external CDN services

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] Content CRUD — Create, edit, delete blog posts via admin UI
- [x] Markdown editing — Rich text with formatting toolbar
- [x] Image upload — Media library for hero images
- [x] Authentication — Netlify Identity to protect /admin
- [x] Content preview — Real-time preview panel
- [x] Save drafts — Git commits enable draft state
- [x] Collection schema — Blog post content type with title, date, author, image, body
- [x] SEO metadata — Title, description, image fields for social sharing
- [ ] Deployment integration — Auto-build on commit via Netlify

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Editorial workflow — Three-stage publishing with review process (trigger: multi-author workflow needed)
- [ ] Media integration — Cloudinary for image optimization and CDN (trigger: image performance issues)
- [ ] Custom preview template — Match live site design in preview panel (trigger: preview accuracy complaints)
- [ ] Relation fields — Author collection linked to posts (trigger: multiple authors with bios)
- [ ] Content validation — Pattern matching for URLs, required field enforcement (trigger: content quality issues)

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Localization — Multi-language content (why defer: no immediate need, adds complexity)
- [ ] Open authoring — Community contributions (why defer: need established content workflow first)
- [ ] Custom widgets — Domain-specific field types (why defer: standard widgets likely sufficient)
- [ ] Content scheduling — Future-date publishing (why defer: manual publishing is manageable at low volume)
- [ ] Multiple collections — Pages, authors, categories (why defer: blog-only scope for MVP)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Content CRUD | HIGH | LOW | P1 |
| Markdown editing | HIGH | LOW | P1 |
| Image upload | HIGH | MEDIUM | P1 |
| Authentication | HIGH | LOW | P1 |
| Content preview | HIGH | MEDIUM | P1 |
| Save drafts | HIGH | LOW | P1 |
| Collection schema | HIGH | LOW | P1 |
| Deployment integration | HIGH | LOW | P1 |
| Editorial workflow | MEDIUM | MEDIUM | P2 |
| Media integration (CDN) | MEDIUM | MEDIUM | P2 |
| Custom preview template | MEDIUM | MEDIUM | P2 |
| Relation fields | MEDIUM | MEDIUM | P2 |
| Content validation | MEDIUM | LOW | P2 |
| Localization | LOW | HIGH | P3 |
| Open authoring | LOW | HIGH | P3 |
| Custom widgets | LOW | HIGH | P3 |
| Content scheduling | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch (table stakes)
- P2: Should have, add when possible (differentiators)
- P3: Nice to have, future consideration (advanced/edge cases)

## Competitor Feature Analysis

| Feature | Decap CMS (Git-based) | Contentful (API-first) | Strapi (Self-hosted) | Our Approach |
|---------|----------------------|----------------------|---------------------|--------------|
| Content Storage | Git repository | Proprietary database | PostgreSQL/MySQL | Git (Decap) - version control built-in |
| Authentication | OAuth or Netlify Identity | Contentful users | Built-in user system | Netlify Identity - simplest for tutorial |
| Media Management | Git or external (Cloudinary) | Contentful CDN | Local or S3 | Git initially, Cloudinary for scale |
| Preview | React components | Contentful preview API | Custom implementation | Decap default preview, custom later |
| Workflow | Git-based editorial flow | Built-in stages | Role-based approval | Git-based - leverages existing tools |
| Hosting | Static files (any host) | Contentful SaaS | Self-hosted server | Netlify - integrated with Decap CMS |
| API | No API (static builds) | REST + GraphQL | REST + GraphQL | No API needed - static output |
| Pricing | Free (open source) | Free tier + paid plans | Free (self-host cost) | Free - open source + Netlify free tier |

**Competitive positioning:** Decap CMS trades API flexibility for operational simplicity. Contentful/Strapi are better for multi-channel publishing (mobile apps, IoT); Decap excels for static sites where build-time is acceptable.

## Sources

- **Decap CMS Documentation** (https://decapcms.org/docs/) - MEDIUM confidence
  - Core features: Intro page confirmed Git-based workflow, React admin, rich-text editing, media uploads
  - Widget types: 16 built-in widgets documented including Markdown, Image, DateTime, Relation
  - Configuration: Backend options (GitHub, GitLab, Bitbucket), collection types, media folder config
  - NOTE: Some documentation URLs returned 404 (editorial workflow, beta features) - likely documentation restructuring

- **Training data (JAMstack ecosystem knowledge)** - LOW confidence
  - Competitor positioning based on 2024 knowledge of Contentful, Strapi, Sanity
  - Editorial workflow stages inferred from Git-based CMS patterns
  - Anti-features based on historical CMS complexity pitfalls
  - FLAGGED: Competitor feature details need verification with current product documentation (WebFetch failed for Strapi, Sanity, Contentful)

- **Project context** (PROJECT.md, ARCHITECTURE.md) - HIGH confidence
  - Tutorial scope: Eleventy 3.x + Decap CMS + Netlify deployment
  - Existing implementation: Blog posts, templates, styling already complete
  - Remaining scope: CMS integration and deployment only

---
*Feature research for: JAMstack Blog with Headless CMS*
*Researched: 2026-03-04*
