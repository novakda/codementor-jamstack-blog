# Roadmap: JAMstack Blog Tutorial

## Overview

This roadmap guides you through completing the Kevin Powell JAMstack blog tutorial, adding Decap CMS for browser-based content editing and deploying to Netlify. The Eleventy site already works locally with templates, styling, and blog posts. You'll configure the CMS admin interface locally, then deploy to Netlify and enable authentication so the CMS can commit changes via Git Gateway.

## Phases

**Phase Numbering:**
- Integer phases (1, 2): Planned tutorial completion work
- Decimal phases (1.1, 1.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: CMS Integration** - Configure Decap CMS admin interface and test locally
- [ ] **Phase 2: Netlify Deployment** - Deploy site and enable authentication for live CMS

## Phase Details

### Phase 1: CMS Integration
**Goal**: You have a working CMS admin interface accessible at /admin that can edit blog posts locally
**Depends on**: Nothing (first phase)
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04, CMS-05
**Success Criteria** (what must be TRUE):
  1. You can access /admin in your browser after running `npx @11ty/eleventy --serve`
  2. The CMS loads successfully showing the blog post collection
  3. The collection fields match your existing frontmatter structure (title, author, date, tags, image, description, body)
  4. You can upload a test image and the path matches your existing asset structure
  5. The admin folder persists through rebuilds (not deleted)
**Plans**: TBD

Plans:
- TBD

### Phase 2: Netlify Deployment
**Goal**: You have a live site with authenticated CMS that commits changes to your repository
**Depends on**: Phase 1
**Requirements**: DEP-01, DEP-02, DEP-03, DEP-04, DEP-05
**Success Criteria** (what must be TRUE):
  1. Your site is deployed and accessible at a .netlify.app URL
  2. The site auto-rebuilds when you push commits to your repository
  3. You can access /admin on the live site and see a login prompt
  4. You can log in with an invited email address using Netlify Identity
  5. You can create or edit a blog post through the CMS and see the commit appear in your repository
**Plans**: TBD

Plans:
- TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. CMS Integration | 0/TBD | Not started | - |
| 2. Netlify Deployment | 0/TBD | Not started | - |
