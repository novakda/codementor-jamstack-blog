# Phase 2: Netlify Deployment - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Deploy the Eleventy blog to Netlify with authenticated CMS access via Netlify Identity and Git Gateway. User follows Kevin Powell's JAMstack tutorial steps, substituting Decap CMS for the legacy Netlify CMS. This is a guided walkthrough — Claude instructs, user implements.

</domain>

<decisions>
## Implementation Decisions

### Identity Widget Placement
- Add Netlify Identity widget script to `<head>` in `src/_includes/base.njk` (all pages)
- Use unpkg latest CDN (matches existing Decap CMS pattern in admin/index.html)
- Add inline redirect script in base.njk that checks for invite tokens and redirects to /admin/
- Adding the Identity widget to admin/index.html is part of the tutorial walkthrough (user does it during execution, not pre-configured)

### CMS Backend Switch
- Replace `test-repo` with `git-gateway` in `src/admin/config.yml`
- Add explicit `branch: main` to backend config
- Timing: deploy site first with test-repo to verify it works on Netlify, THEN switch backend to git-gateway before setting up Identity

### Deployment Connection
- Use Netlify web UI to import from GitHub (matches tutorial)
- Repo is already on GitHub — no repo setup needed
- Explicitly verify build settings: build command `npm run build`, publish directory `public/`

### Walkthrough Granularity
- Match Kevin Powell's tutorial steps as closely as possible, using Decap CMS instead of Netlify CMS
- Detailed navigation paths for Netlify UI steps (e.g., "Go to Site Settings > Identity > Enable Identity")
- Code changes: show exact code AND explain what each line does (educational approach)
- Verification checkpoint after each major step ("you should see...")

### Claude's Discretion
- Exact wording of verification checkpoint descriptions
- Order of minor sub-steps within each major step
- Troubleshooting guidance if a step fails

</decisions>

<specifics>
## Specific Ideas

- "As much as possible, match the steps in Kevin Powell's tutorial, using Decap instead of Netlify CMS"
- Deploy first with test-repo backend to verify site works, then switch to git-gateway — two-phase approach
- User wants to type code changes themselves (learn by doing) with explanations of WHY each line exists
- Include "you should see..." checkpoints after each major action to catch issues early

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/admin/index.html`: Standalone CMS page loading Decap CMS from CDN — needs Identity widget added
- `src/admin/config.yml`: CMS configuration with test-repo backend — needs git-gateway switch
- `src/_includes/base.njk`: Root HTML layout for all pages — Identity widget and redirect script go here

### Established Patterns
- CDN script loading: admin/index.html uses `unpkg.com/decap-cms@^3.0.0` — Identity widget should follow same unpkg pattern
- Passthrough copy: `src/admin` already configured in `eleventy.config.js` — no build config changes needed
- Nunjucks layouts: base.njk is the root layout, article.njk extends it — widget in base.njk covers all pages

### Integration Points
- `eleventy.config.js`: Already has `src/admin` passthrough copy — no changes needed
- `src/_includes/base.njk` `<head>` section: Where Identity widget script tag goes
- `src/admin/config.yml` backend section: Where git-gateway config replaces test-repo

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-netlify-deployment*
*Context gathered: 2026-03-04*
