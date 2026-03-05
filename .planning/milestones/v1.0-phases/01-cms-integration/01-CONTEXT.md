# Phase 1: CMS Integration - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure Decap CMS admin interface accessible at /admin that can edit blog posts locally. Includes creating admin files, configuring collection fields to match existing frontmatter, setting up media paths, and adding passthrough copy. Local testing uses ephemeral test-repo backend. Live deployment and authentication are Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Tag handling
- "featured" presented as a boolean toggle switch in CMS (not part of a tag list)
- No additional tag fields beyond "featured" toggle — keep it simple for the tutorial
- "post" tag completely hidden from CMS — auto-applied by blog.json, no CMS involvement
- Author field defaults to "Kevin Powell" — pre-filled, editable per post

### Field configuration
- Required fields: title and date only — minimum viable post for drafting
- Optional fields: author (has default), image, imageAlt, description
- Image uses Decap's built-in image widget with upload/browse capability
- imageAlt is a separate text field below the image widget
- Media uploads go to src/assets/blog/ — same folder as existing images
- Body editor uses rich text (WYSIWYG markdown editor with toolbar)

### Walkthrough delivery
- One step at a time — Claude gives one instruction, explains WHY, waits for confirmation
- "What + Why" explanations — tell what to do AND explain why it works
- User creates all files themselves — Claude shows content, user creates in their editor
- Claude verifies each file after creation — reads it back to catch typos
- When errors occur, Claude guides user to fix it themselves (not direct fixes)
- Explain CMS/JAMstack concepts as they first appear (e.g., passthrough copy, backends)
- Begin with overview of all 5 steps (CMS-01 through CMS-05) before starting step 1

### Local testing
- Use test-repo backend for Phase 1 — ephemeral, no git required
- Explain test-repo limitations upfront (no persistence, data resets on reload)
- Phase 2 will switch backend to git-gateway for real persistence
- Verification as guided walkthrough — Claude walks through each check one at a time
- Include image upload testing in Phase 1 to catch media_folder config issues early

### Claude's Discretion
- Exact CDN version of Decap CMS to use
- config.yml field ordering and formatting
- Slug configuration for new posts
- Any additional meta fields Decap CMS requires beyond the blog frontmatter

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Following the Kevin Powell JAMstack tutorial pattern with Decap CMS additions.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/blog/blog.json`: Auto-applies "post" tag and "article.njk" layout to all posts in src/blog/ — CMS config must NOT duplicate these
- `src/_includes/article.njk`: Article layout template — CMS preview should eventually match this (Phase 2+ concern)
- `src/_includes/article-snippet.njk`: Article preview component used on listing pages — uses description field

### Established Patterns
- Frontmatter structure: title, author, date, tags, image, imageAlt, description — CMS fields must match exactly
- Date format: ISO YYYY-MM-DD in frontmatter, formatted by postDate Luxon filter
- Image paths: /assets/blog/article-X.jpg pattern — media_folder must produce matching paths
- Blog post filenames: YYYY-MM-DD-slug.md convention

### Integration Points
- `eleventy.config.js`: Needs addPassthroughCopy('./src/admin') for CMS admin files
- `src/admin/index.html`: New file — loads Decap CMS from CDN
- `src/admin/config.yml`: New file — defines backend, collections, and media paths
- Build output: admin files must appear in public/admin/ after build

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-cms-integration*
*Context gathered: 2026-03-04*
