# Requirements: JAMstack Blog Tutorial

**Defined:** 2026-03-03
**Core Value:** Complete the Kevin Powell JAMstack tutorial CMS setup using Decap CMS, learning each step hands-on.

**Mode:** Guided walkthrough — Claude instructs, user implements.

## v1 Requirements

Requirements for tutorial completion. User performs each step with guidance.

### CMS Setup

- [ ] **CMS-01**: User creates /admin folder with index.html loading Decap CMS from CDN
- [ ] **CMS-02**: User creates config.yml defining Git backend and blog post collection
- [ ] **CMS-03**: User configures collection fields matching existing frontmatter (title, author, date, tags, image, description, body)
- [ ] **CMS-04**: User configures media_folder and public_folder paths for image uploads
- [ ] **CMS-05**: User adds admin folder to Eleventy passthrough copy in eleventy.config.js

### Deployment

- [ ] **DEP-01**: User deploys site to Netlify from Git repository
- [ ] **DEP-02**: User enables Netlify Identity on the deployed site
- [ ] **DEP-03**: User enables Git Gateway in Netlify Identity settings
- [ ] **DEP-04**: User adds Netlify Identity widget script to site HTML
- [ ] **DEP-05**: User tests CMS login and creates/edits a post through the admin panel

## v2 Requirements

Deferred — not part of the tutorial.

- **ENH-01**: Custom preview templates matching live site design
- **ENH-02**: Editorial workflow (draft → review → publish)
- **ENH-03**: Invite-only registration for security hardening
- **ENH-04**: Custom domain configuration

## Out of Scope

| Feature | Reason |
|---------|--------|
| Automated implementation by Claude | User wants to learn by doing — guided, not automated |
| Sveltia CMS migration | Future consideration after tutorial evaluation |
| Career portfolio data pipeline | Separate project for pattern158.solutions |
| Production hardening | Tutorial scope only |
| Custom CMS widgets | Beyond tutorial scope |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMS-01 | Phase 1 | Pending |
| CMS-02 | Phase 1 | Pending |
| CMS-03 | Phase 1 | Pending |
| CMS-04 | Phase 1 | Pending |
| CMS-05 | Phase 1 | Pending |
| DEP-01 | Phase 2 | Pending |
| DEP-02 | Phase 2 | Pending |
| DEP-03 | Phase 2 | Pending |
| DEP-04 | Phase 2 | Pending |
| DEP-05 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0

---
*Requirements defined: 2026-03-03*
*Last updated: 2026-03-03 after initial definition*
