# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — JAMstack Blog Tutorial

**Shipped:** 2026-03-05
**Phases:** 2 | **Plans:** 4 | **Sessions:** ~3

### What Was Built
- Decap CMS admin interface with 8-field blog collection mapped to existing frontmatter
- Netlify deployment with continuous deployment from GitHub
- Netlify Identity (invite-only) + Git Gateway for authenticated CMS access
- Full content pipeline: CMS edit → GitHub commit → Netlify auto-rebuild → live site

### What Worked
- Phased approach (test-repo first, then git-gateway) isolated issues effectively
- Guided walkthrough mode worked well — user learned each step while Claude provided context
- Milestone audit caught the unchecked requirements checkboxes before archival
- Tutorial translated cleanly from Netlify CMS to Decap CMS with minimal changes

### What Was Inefficient
- REQUIREMENTS.md checkboxes were never updated during execution (only caught at audit)
- Phase 2 was entirely manual (Netlify web UI) — no automation possible, but verification was limited to user confirmation
- Human verification items accumulated (10 browser-based tests) with no automated alternative

### Patterns Established
- CMS field names must exactly match existing frontmatter structure
- Identity widget must be site-wide (not just /admin) for invite email token handling
- Git Gateway requires explicit branch specification to avoid master/main mismatch
- addPassthroughCopy follows ./src/{folder} convention in Eleventy

### Key Lessons
1. When requirements are satisfied by external service configuration (not code), update traceability immediately — don't defer to audit
2. Test-repo → git-gateway phasing is effective for isolating CMS interface issues from auth complexity
3. Tutorial projects with external service dependencies (Netlify) require acceptance of "human verification pending" items — they can't be automated in CI

### Cost Observations
- Model mix: ~70% sonnet, ~20% haiku, ~10% opus (balanced profile)
- Sessions: ~3
- Notable: Phase 1 was fully automatable (~45 min); Phase 2 was user-paced due to Netlify web UI configuration

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~3 | 2 | Initial project — established guided walkthrough mode |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | N/A (tutorial) | N/A | 1 (decap-cms via CDN) |

### Top Lessons (Verified Across Milestones)

1. (Awaiting cross-milestone validation)
