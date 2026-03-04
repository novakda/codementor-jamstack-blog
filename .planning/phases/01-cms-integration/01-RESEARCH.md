# Phase 1: CMS Integration - Research

**Researched:** 2026-03-04
**Domain:** Decap CMS integration with Eleventy static site generator
**Confidence:** MEDIUM

## Summary

Decap CMS (formerly Netlify CMS, renamed February 2023) is a Git-based headless CMS that operates as a single-page React application served from the `/admin` route of a static site. It provides a user-friendly interface for editing markdown files and managing media uploads, with changes committed directly to the Git repository.

For Phase 1 (local CMS setup with test-repo backend), the integration requires three main components: (1) creating an admin folder with index.html that loads Decap CMS from CDN, (2) configuring a config.yml file that defines collections and fields matching the existing blog frontmatter structure, and (3) adding passthrough copy to the Eleventy config so the admin files are included in the build output.

**Primary recommendation:** Use test-repo backend for Phase 1 local testing to avoid Git/authentication complexity. Switch to git-gateway backend in Phase 2 for persistent storage and real deployment.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- "featured" presented as a boolean toggle switch in CMS (not part of a tag list)
- No additional tag fields beyond "featured" toggle — keep it simple for the tutorial
- "post" tag completely hidden from CMS — auto-applied by blog.json, no CMS involvement
- Author field defaults to "Kevin Powell" — pre-filled, editable per post
- Required fields: title and date only — minimum viable post for drafting
- Optional fields: author (has default), image, imageAlt, description
- Image uses Decap's built-in image widget with upload/browse capability
- imageAlt is a separate text field below the image widget
- Media uploads go to src/assets/blog/ — same folder as existing images
- Body editor uses rich text (WYSIWYG markdown editor with toolbar)
- One step at a time — Claude gives one instruction, explains WHY, waits for confirmation
- "What + Why" explanations — tell what to do AND explain why it works
- User creates all files themselves — Claude shows content, user creates in their editor
- Claude verifies each file after creation — reads it back to catch typos
- When errors occur, Claude guides user to fix it themselves (not direct fixes)
- Explain CMS/JAMstack concepts as they first appear (e.g., passthrough copy, backends)
- Begin with overview of all 5 steps (CMS-01 through CMS-05) before starting step 1
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CMS-01 | User creates /admin folder with index.html loading Decap CMS from CDN | CDN installation pattern from neat-starter, unpkg.com CDN URLs |
| CMS-02 | User creates config.yml defining Git backend and blog post collection | Backend configuration docs, test-repo backend for Phase 1 |
| CMS-03 | User configures collection fields matching existing frontmatter (title, author, date, tags, image, description, body) | Widget documentation (string, datetime, boolean, image, markdown), field configuration syntax |
| CMS-04 | User configures media_folder and public_folder paths for image uploads | Media configuration docs, path alignment with existing src/assets/blog/ structure |
| CMS-05 | User adds admin folder to Eleventy passthrough copy in eleventy.config.js | Eleventy addPassthroughCopy method, neat-starter passthrough pattern |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Decap CMS | 3.3.3+ (latest) | Git-based headless CMS | Official successor to Netlify CMS (renamed Feb 2023), active maintenance by PM TechHub |
| Eleventy | 3.1.2 (current) | Static site generator | Already in use, v3 introduced breaking config changes |
| unpkg.com CDN | latest | CDN delivery | Standard CDN for npm packages, no build step required |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| test-repo backend | built-in | Local ephemeral testing | Phase 1 only - no Git/auth setup required |
| git-gateway backend | built-in | Production Git backend | Phase 2 - enables persistent storage via Netlify Identity |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Decap CMS | Sveltia CMS | Drop-in Decap replacement with active maintenance, but adds learning curve for tutorial |
| Decap CMS | Tina CMS | Modern alternative with better DX, but requires significant config differences |
| test-repo backend | git-gateway from start | Cleaner for production, but requires Netlify Identity setup (Phase 2 scope) |
| CDN install | npm package | Greater control and customization, but adds build complexity for tutorial scope |

**Installation:**
```bash
# No installation needed for Phase 1 - CDN-based approach
# Files are created manually, no npm packages to install
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── admin/               # Decap CMS files (NEW in Phase 1)
│   ├── index.html      # Loads CMS from CDN
│   └── config.yml      # CMS configuration
├── assets/
│   └── blog/           # Image uploads (EXISTING - CMS writes here)
├── blog/               # Blog posts (EXISTING - CMS reads/writes here)
│   ├── blog.json       # Auto-applies "post" tag and layout
│   └── *.md            # Individual blog posts
└── _includes/          # Templates (EXISTING)
    └── article.njk     # Blog post layout

public/                 # Build output (Eleventy v3)
├── admin/              # CMS files copied here
│   ├── index.html
│   └── config.yml
└── assets/
    └── blog/           # Images accessible at /assets/blog/
```

### Pattern 1: Admin Folder Setup
**What:** Create a dedicated admin folder in the source directory with two files: index.html (CMS loader) and config.yml (CMS configuration).
**When to use:** Every Decap CMS installation - this is the standard approach.
**Example:**
```html
<!-- src/admin/index.html -->
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
</head>
<body>
  <!-- Load Decap CMS from CDN -->
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

**Source:** Pattern adapted from neat-starter (https://github.com/surjithctly/neat-starter), updated for Decap CMS (was using Netlify CMS 2.x).

### Pattern 2: Test-Repo Backend for Local Development
**What:** Configure backend with `name: test-repo` to create an ephemeral in-memory Git repository for testing without authentication.
**When to use:** Local development, learning CMS configuration, testing field layouts before connecting real Git backend.
**Example:**
```yaml
# src/admin/config.yml
backend:
  name: test-repo

media_folder: "src/assets/blog"
public_folder: "/assets/blog"

collections:
  - name: "blog"
    label: "Blog"
    folder: "src/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
```

**Source:** Decap CMS test-repo backend documentation (https://decapcms.org/docs/test-backend/)

**IMPORTANT LIMITATION:** Test-repo backend data is ephemeral - all changes disappear on page reload. It cannot access existing files on disk, so you won't see current blog posts when testing. It's purely for testing the CMS interface and configuration.

### Pattern 3: Folder Collections with Slug Templates
**What:** Use slug configuration to control generated filenames for new posts, matching the existing YYYY-MM-DD-slug.md pattern.
**When to use:** Blog posts and other content where date-based filenames are desired.
**Example:**
```yaml
collections:
  - name: "blog"
    label: "Blog"
    folder: "src/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"  # Generates: 2026-03-04-my-post-title.md
    fields:
      - {label: "Title", name: "title", widget: "string"}
```

**Source:** Decap CMS configuration options documentation (https://decapcms.org/docs/configuration-options/)

**Available slug template tags:**
- `{{slug}}` - URL-safe version of identifier field (usually title)
- `{{year}}`, `{{month}}`, `{{day}}` - Date parts from date field
- `{{hour}}`, `{{minute}}`, `{{second}}` - Time parts from datetime field
- `{{fields.fieldname}}` - Value from any field

### Pattern 4: Widget Configuration for Existing Frontmatter
**What:** Map each frontmatter field to the appropriate Decap CMS widget type, ensuring CMS-generated content matches hand-written post structure.
**When to use:** Integrating CMS with existing content - field names and types must match exactly.
**Example:**
```yaml
fields:
  - {label: "Title", name: "title", widget: "string", required: true}
  - {label: "Author", name: "author", widget: "string", default: "Kevin Powell"}
  - {label: "Date", name: "date", widget: "datetime", required: true}
  - {label: "Featured", name: "featured", widget: "boolean", default: false}
  - {label: "Image", name: "image", widget: "image", required: false}
  - {label: "Image Alt", name: "imageAlt", widget: "string", required: false}
  - {label: "Description", name: "description", widget: "text", required: false}
  - {label: "Body", name: "body", widget: "markdown"}
```

**Source:** Decap CMS widgets documentation (https://decapcms.org/docs/widgets/)

**Key widget types:**
- `string` - Single-line text input
- `text` - Multi-line text input (plain text)
- `markdown` - Rich text editor with toolbar (WYSIWYG)
- `datetime` - Date/time picker with calendar
- `boolean` - Toggle switch (true/false)
- `image` - File upload with media library browser

**Widget options:**
- `required: false` - Makes field optional (defaults to true)
- `default: "value"` - Pre-fills field for new entries
- `hint: "text"` - Helper text below widget

### Pattern 5: Eleventy Passthrough Copy for Admin Files
**What:** Use `addPassthroughCopy` to copy admin folder from src to output directory without processing.
**When to use:** Static assets that don't need Eleventy transformation (CSS, JS, images, admin files).
**Example:**
```javascript
// eleventy.config.js
module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/admin')
    // ... other config

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}
```

**Source:** Eleventy passthrough copy documentation, neat-starter implementation pattern

**Result:** Admin files are copied to `public/admin/`, accessible at `/admin` when serving the site.

### Pattern 6: Media Folder Path Alignment
**What:** Configure media_folder to match existing asset structure, and public_folder to match the URL path used in frontmatter.
**When to use:** Integrating CMS with existing content that has established image path conventions.
**Example:**
```yaml
media_folder: "src/assets/blog"    # Where uploads are saved in source
public_folder: "/assets/blog"      # URL path in frontmatter (no "src/")

# Existing posts use: image: /assets/blog/article-1.jpg
# CMS uploads will generate: image: /assets/blog/uploaded-image.jpg
# Both resolve to same location after build copies src/assets/ → public/assets/
```

**Source:** Decap CMS media configuration documentation, existing project structure analysis

**CRITICAL:** The public_folder path must match what's already in your frontmatter. Existing posts use `/assets/blog/`, so CMS must use the same pattern for consistency.

### Pattern 7: Hidden Tag Auto-Application via Directory Data
**What:** Use Eleventy directory data files (blog.json) to auto-apply tags/layout to all posts in a folder, keeping CMS config simpler.
**When to use:** Values that should be consistent across all collection entries (e.g., content type tag, layout template).
**Example:**
```json
// src/blog/blog.json (EXISTING - already does this)
{
    "tags": "post",
    "layout": "article.njk"
}
```

**CMS configuration impact:** Don't create a "tags" field for the "post" tag in config.yml - it's auto-applied by blog.json. Only expose the "featured" toggle.

**Source:** Existing project pattern, Eleventy directory data files documentation

**Result:** All posts get "post" tag automatically. CMS only manages the "featured" flag, which adds to the tags array when enabled.

### Anti-Patterns to Avoid
- **Don't duplicate blog.json values in CMS config:** The "post" tag and "article.njk" layout are already auto-applied by blog.json. Creating CMS fields for these would cause conflicts or redundancy.
- **Don't use relative paths in public_folder:** Use absolute paths like `/assets/blog` not `assets/blog` or `../assets/blog`. Existing posts use absolute paths, CMS must match.
- **Don't use forward slashes in Windows paths for media_folder:** Use `src/assets/blog` not `src\assets\blog`. Decap CMS expects forward slashes even on Windows.
- **Don't put config.yml in root:** Place it in `src/admin/config.yml` alongside index.html, not in project root. Passthrough copy expects this structure.
- **Don't load both Netlify CMS and Decap CMS:** They're the same product (renamed). Use `decap-cms@^3.0.0`, not old `netlify-cms@^2.0.0`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File upload handling | Custom image upload form with file validation | Decap CMS image widget | Built-in media library, file type validation, path management, thumbnail preview |
| Markdown editing | Basic textarea with manual markdown syntax | Decap CMS markdown widget | WYSIWYG toolbar, preview pane, keyboard shortcuts, proper formatting |
| Git commit workflow | Custom forms that write files + manual commits | Decap CMS backend | Handles authentication, commit messages, branch management, conflict resolution |
| Date/time input | Text input with manual YYYY-MM-DD entry | Decap CMS datetime widget | Calendar picker, format validation, timezone handling, ISO date output |
| Form validation | Manual required field checking | Decap CMS `required` option | Per-field validation, clear error messages, prevents submission until valid |
| Media path configuration | Hardcoded paths in upload handlers | media_folder + public_folder config | Environment-independent, matches existing conventions, centralized configuration |

**Key insight:** Decap CMS abstracts the complexity of Git-based content management. Edge cases like conflict resolution, authentication token management, media library state, and cross-browser file upload behavior are all handled by the CMS. Building this yourself would require hundreds of hours and ongoing maintenance.

## Common Pitfalls

### Pitfall 1: media_folder vs public_folder Confusion
**What goes wrong:** Images upload successfully but show broken image icons in CMS preview, or frontmatter has wrong paths.
**Why it happens:**
- `media_folder` is where files are physically saved in the repository (e.g., `src/assets/blog`)
- `public_folder` is the URL path written to frontmatter (e.g., `/assets/blog/image.jpg`)
- These are different because build tools (like Eleventy) transform `src/` to `public/` during build
**How to avoid:**
1. Check existing posts to see what image paths they use (e.g., `/assets/blog/article-1.jpg`)
2. Set public_folder to match that exact pattern (`/assets/blog`)
3. Set media_folder to the source location before build (`src/assets/blog`)
4. Test by uploading an image and checking the generated frontmatter matches existing pattern
**Warning signs:**
- CMS preview shows broken images after upload
- Generated frontmatter has paths like `src/assets/blog/image.jpg` instead of `/assets/blog/image.jpg`
- Images work in CMS but break on published site (or vice versa)

### Pitfall 2: Forgetting Passthrough Copy
**What goes wrong:** `/admin` route returns 404 when viewing the built site, even though admin files exist in `src/admin/`.
**Why it happens:** Eleventy only processes files it knows about. Without `addPassthroughCopy('./src/admin')`, the admin folder is ignored during build and never appears in the output directory.
**How to avoid:**
1. Add passthrough copy to eleventy.config.js for the admin folder
2. Run build and verify `public/admin/index.html` and `public/admin/config.yml` exist
3. Test by visiting `http://localhost:8080/admin/` during dev server
**Warning signs:**
- Admin files exist in `src/admin/` but not in `public/admin/` after build
- Browser console shows 404 errors for `/admin/`
- CMS loads locally during development but not after deployment

### Pitfall 3: test-repo Backend Expectations
**What goes wrong:** Users expect to see existing blog posts in the CMS when using test-repo backend, but the collection is empty.
**Why it happens:** test-repo is a completely in-memory backend that doesn't connect to the local filesystem or any Git repository. It's purely for testing the CMS UI, not for editing existing content.
**How to avoid:**
1. Explain upfront that test-repo is ephemeral and won't show existing posts
2. Frame Phase 1 as "testing the CMS interface works correctly"
3. Mention that existing content will appear once switching to git-gateway backend in Phase 2
4. Use test-repo for verifying field configuration, upload testing, and UI layout only
**Warning signs:**
- User reports "my blog posts don't show up in the CMS"
- User creates test content and is confused when it disappears after refresh
- User tries to edit an existing post but can't find it in the CMS

### Pitfall 4: Boolean Widget Tag Handling
**What goes wrong:** "featured" appears as both a boolean field AND in a tags list, causing confusion or duplicate tags in frontmatter.
**Why it happens:** Existing posts use `tags: ["post", "featured"]` array syntax. If you create both a boolean widget named "featured" and a list widget named "tags" containing "featured", Decap CMS doesn't know how to reconcile them.
**How to avoid:**
1. For this project: use a boolean widget named "featured" (not "tags")
2. When featured=true, the boolean widget writes `featured: true` to frontmatter (not `tags: ["featured"]`)
3. Template code must check for both: `"featured" in tags or featured == true`
4. Alternatively (more complex): use relation widgets or custom widgets to manage tag arrays properly
5. For tutorial simplicity: ONLY use the boolean toggle, accept that it's a different format than existing posts
**Warning signs:**
- Frontmatter has both `featured: true` and `tags: ["featured"]`
- Some posts use boolean, some use tag array - inconsistent
- Template code doesn't find "featured" posts because it only checks tags array

**DECISION FOR THIS PROJECT (from CONTEXT.md):** Use boolean widget. Accept that CMS-created posts will have `featured: true/false` while old posts have `tags: ["featured"]`. Template must handle both patterns.

### Pitfall 5: Wrong CDN Version
**What goes wrong:** Using old Netlify CMS CDN URL (`netlify-cms@^2.0.0`) instead of Decap CMS URL (`decap-cms@^3.0.0`).
**Why it happens:** Many tutorials and examples predate the February 2023 rename from Netlify CMS to Decap CMS.
**How to avoid:**
1. Use `https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js` (current name)
2. Avoid `https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js` (old name, no longer maintained)
3. Check script tag in index.html to confirm it says "decap-cms" not "netlify-cms"
**Warning signs:**
- Following an old tutorial that says "Netlify CMS"
- Script URL says `netlify-cms` instead of `decap-cms`
- CMS loads but uses outdated UI or missing features from v3

### Pitfall 6: Slug Template Date Field Mismatch
**What goes wrong:** Filename slug uses `{{year}}-{{month}}-{{day}}` but the collection has no date field, causing CMS to generate filenames like `--my-post.md`.
**Why it happens:** Slug templates pull from collection fields. If you reference date parts but have no datetime/date widget, there's no data to pull from.
**How to avoid:**
1. When using date-based slugs, ensure collection has a date or datetime field
2. Slug template date tags pull from the configured date field (default: field named "date")
3. Test by creating a new post and verifying filename matches expected pattern
**Warning signs:**
- Generated filenames have missing date parts: `--article-name.md` or `-03-04-article.md`
- CMS throws errors when saving new posts
- Date field exists but has wrong widget type (string instead of datetime)

## Code Examples

Verified patterns from official sources:

### Complete admin/index.html (CDN Installation)
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Content Manager</title>
</head>
<body>
  <!-- Load Decap CMS -->
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

**Source:** Adapted from neat-starter (https://github.com/surjithctly/neat-starter), updated for Decap CMS v3

**Notes:**
- `noindex` meta tag prevents search engines from indexing admin panel
- No additional scripts needed for basic functionality
- CMS automatically looks for `/admin/config.yml` relative to this file

### Complete config.yml for Blog Collection
```yaml
# Backend configuration
backend:
  name: test-repo  # Phase 1: ephemeral local testing
  # name: git-gateway  # Phase 2: real Git backend with authentication

# Media upload paths
media_folder: "src/assets/blog"  # Where files are saved in source
public_folder: "/assets/blog"    # URL path written to frontmatter

# Collections
collections:
  - name: "blog"
    label: "Blog"
    folder: "src/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Author", name: "author", widget: "string", default: "Kevin Powell", required: false}
      - {label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", required: true}
      - {label: "Featured", name: "featured", widget: "boolean", default: false, required: false}
      - {label: "Image", name: "image", widget: "image", required: false}
      - {label: "Image Alt Text", name: "imageAlt", widget: "string", required: false}
      - {label: "Description", name: "description", widget: "text", required: false}
      - {label: "Body", name: "body", widget: "markdown"}
```

**Source:** Synthesized from Decap CMS configuration docs + neat-starter pattern + project requirements

**Key decisions:**
- `format: "YYYY-MM-DD"` on datetime widget outputs ISO date matching existing posts
- No "tags" or "layout" fields - those are auto-applied by blog.json
- "featured" is boolean (not part of tags array) - creates `featured: true/false` in frontmatter
- required fields limited to title and date only (user decision)
- slug template matches existing YYYY-MM-DD-slug.md pattern

### Eleventy Config with Passthrough Copy
```javascript
// eleventy.config.js
const {DateTime} = require('luxon')

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/style.css')
    eleventyConfig.addPassthroughCopy('./src/assets')
    eleventyConfig.addPassthroughCopy('./src/admin')  // NEW: Copy admin folder

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
    })

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}
```

**Source:** Existing project config + standard Eleventy passthrough pattern

**What changed:** Single line added to copy admin folder. This ensures `src/admin/` contents appear in `public/admin/` after build.

### DateTime Widget with ISO Date Format
```yaml
- label: "Date"
  name: "date"
  widget: "datetime"
  format: "YYYY-MM-DD"  # Outputs: 2026-03-04
  date_format: "YYYY-MM-DD"  # Calendar picker format
  time_format: false  # Hide time picker, date only
  required: true
```

**Source:** Decap CMS datetime widget documentation (https://decapcms.org/docs/widgets/)

**Options:**
- `format` - How date is written to frontmatter (use Day.js tokens)
- `date_format` - How date appears in calendar picker UI
- `time_format: false` - Omit time picker for date-only fields
- `picker_utc: false` - Use local timezone instead of UTC

### Image Widget with Media Library
```yaml
- label: "Featured Image"
  name: "image"
  widget: "image"
  required: false
  allow_multiple: false
  media_library:
    config:
      multiple: false
```

**Source:** Decap CMS image widget documentation

**Behavior:**
- Opens media library on click (shows previously uploaded images)
- "Upload" button saves to media_folder path
- Generates frontmatter: `image: /assets/blog/filename.jpg` (using public_folder path)
- Supports drag-and-drop upload

### Boolean Widget for Feature Toggle
```yaml
- label: "Featured"
  name: "featured"
  widget: "boolean"
  default: false
  required: false
```

**Source:** Decap CMS boolean widget documentation

**Output:**
- When toggled ON: `featured: true`
- When toggled OFF: `featured: false`
- UI: Toggle switch (not checkbox)

**NOTE:** This outputs boolean frontmatter, NOT a tags array. Existing posts use `tags: ["featured"]`. Template must handle both patterns:

```njk
{% if "featured" in tags or featured == true %}
  <!-- Featured post styling -->
{% endif %}
```

### Markdown Widget with Rich Text
```yaml
- label: "Body"
  name: "body"
  widget: "markdown"
  required: true
  buttons:
    - bold
    - italic
    - code
    - link
    - heading-one
    - heading-two
    - heading-three
    - quote
    - bulleted-list
    - numbered-list
  editor_components: []  # Disable shortcode widgets
  modes:
    - rich_text  # WYSIWYG mode
    - raw  # Raw markdown mode
```

**Source:** Decap CMS markdown widget documentation

**Features:**
- WYSIWYG toolbar with common formatting buttons
- Switch between rich text and raw markdown views
- Supports keyboard shortcuts (Ctrl+B for bold, etc.)
- Preview pane shows rendered markdown (can be disabled)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Netlify CMS | Decap CMS | February 2023 | Rename only - same codebase, CDN URLs updated |
| `netlify-cms` npm package | `decap-cms` npm package | v3.0.0 (2023) | Must use new package name, old package frozen |
| `netlify-cms.js` CDN | `decap-cms.js` CDN | v3.0.0 (2023) | Update script src in index.html |
| Editorial workflow enabled by default | Simple publish mode default | v2.0+ | Must explicitly enable editorial_workflow for draft/review/publish flow |
| Global config.yml in site root | Config in /admin folder | Best practice evolution | Cleaner separation, easier to manage |
| Passthrough copy individual files | Passthrough copy entire admin folder | Eleventy best practice | Simpler config, handles both index.html and config.yml |

**Deprecated/outdated:**
- **Netlify CMS name/package**: Use Decap CMS instead (same project, just renamed)
- **Pre-v3 CDN URLs**: Use `decap-cms@^3.0.0` not `netlify-cms@^2.0.0`
- **Git backend without auth**: Direct Git backend requires OAuth setup; use test-repo for local dev or git-gateway with Netlify Identity
- **Editing from site root without `/admin` route**: CMS expects to be accessed at `/admin/` path

**Current best practices (2026):**
- Use test-repo backend for local development/testing
- Use git-gateway + Netlify Identity for production (simplest auth)
- Load from unpkg.com CDN for quick setup (or npm install for advanced customization)
- Place admin files in `src/admin/` and use passthrough copy
- Version-pin CDN URL with caret (`^3.0.0`) to get patch updates but avoid breaking changes

## Open Questions

1. **Template Handling of Mixed Featured Format**
   - What we know: Boolean widget outputs `featured: true/false`, existing posts use `tags: ["featured"]`
   - What's unclear: Best way to handle this in Nunjucks templates without breaking existing posts
   - Recommendation: Update article template to check both patterns: `{% if "featured" in tags or featured == true %}`. Test with both old and new posts.

2. **Exact Decap CMS Version to Use**
   - What we know: Version 3.3.3 was latest as of Feb 2026, project is actively maintained
   - What's unclear: Whether to pin to specific version (3.3.3) or use caret range (^3.0.0) for auto-updates
   - Recommendation: Use `^3.0.0` for tutorial (gets patches/features), switch to pinned version for production

3. **Image Alt Text Required Status**
   - What we know: Accessibility best practice says alt text should be required, user wants it optional
   - What's unclear: Whether to enforce at CMS level or rely on developer discipline
   - Recommendation: Keep `required: false` for Phase 1 (tutorial scope), add validation in Phase 2+ for production

## Sources

### Primary (HIGH confidence)
- Decap CMS Configuration Options: https://decapcms.org/docs/configuration-options/ (backend, media, collections)
- Decap CMS Widgets: https://decapcms.org/docs/widgets/ (field types and options)
- Decap CMS Test Backend: https://decapcms.org/docs/test-backend/ (test-repo documentation)
- Decap CMS GitHub Repository: https://github.com/decaporg/decap-cms (version 3.3.3, maintenance status)
- Neat Starter Repository: https://github.com/surjithctly/neat-starter (Eleventy + Decap CMS working example)

### Secondary (MEDIUM confidence)
- Decap CMS Introduction: https://decapcms.org/docs/intro/ (overview, relationship to Netlify CMS)
- Decap CMS Basic Steps: https://decapcms.org/docs/basic-steps/ (installation workflow)
- Decap CMS Backends Overview: https://decapcms.org/docs/backends-overview/ (backend types)
- Eleventy Documentation: https://www.11ty.dev/docs/ (passthrough copy patterns)

### Tertiary (LOW confidence)
- Decap CMS GitHub Issues: https://github.com/decaporg/decap-cms/issues (common problems - 550 open issues, many unconfirmed)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Decap CMS is the established successor to Netlify CMS, version confirmed from GitHub
- Architecture patterns: HIGH - Verified from official docs + working example (neat-starter)
- Pitfalls: MEDIUM - Mix of documented issues and community reports, not all verified in official docs
- Widget configuration: HIGH - Directly from official widget documentation
- Test-repo backend: HIGH - Documented in official test backend page

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (30 days - Decap CMS is stable, slow-moving changes expected)

**Research limitations:**
- Could not access some Decap documentation URLs (404 errors on some /docs/* pages)
- Relied heavily on neat-starter example for practical implementation patterns
- Maintenance status concern: Project had period of low activity, now maintained by PM TechHub
- No direct Eleventy-specific Decap documentation found (generic static site generator approach)
