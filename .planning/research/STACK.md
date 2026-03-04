# Stack Research: Decap CMS Integration

**Domain:** JAMstack blog with headless CMS
**Researched:** 2026-03-04
**Confidence:** MEDIUM-HIGH

## Executive Summary

The Eleventy + Decap CMS + Netlify stack is technically functional but has significant ecosystem concerns in 2026. Decap CMS is no longer actively maintained, Netlify Identity has been deprecated (though still supported), and the community has largely migrated to alternatives like Sveltia CMS. For a tutorial-following exercise, the stack works. For production use or long-term projects, alternatives should be strongly considered.

**Critical finding:** Netlify officially deprecated Netlify Identity in February 2026 but reversed course due to developer feedback. It remains supported but is not recommended for new projects. Decap CMS itself has stagnated with no active development.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @11ty/eleventy | 3.1.2 (current in project) | Static site generator | Already in use, stable, actively maintained, ESM/CommonJS flexible |
| decap-cms | ^3.0.0 (3.10.1 latest on npm) | Git-based headless CMS | Direct successor to Netlify CMS, tutorial-compatible, but NOT actively maintained |
| Netlify | Platform (latest) | Hosting + CI/CD + Git Gateway | Automatic Eleventy detection, free tier, integrated Git Gateway |
| Netlify Identity | Service (deprecated but supported) | Authentication for CMS | Required for Git Gateway, still functional, but deprecated |

**Confidence: HIGH** for Eleventy, **MEDIUM** for Decap CMS (functional but unmaintained), **MEDIUM** for Netlify Identity (deprecated status).

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| luxon | ^3.7.2 (current in project) | Date formatting | Already integrated for `postDate` filter |
| netlify-identity-widget | 1.9.2 | Auth UI for Netlify Identity | Required for CMS admin login (loaded via CDN) |
| markdown-it-eleventy-img | Latest | Image processing in markdown | Optional - only if using Eleventy Image plugin |

**Confidence: HIGH** for Luxon (already proven in codebase), **MEDIUM** for identity widget (old package, CDN-delivered).

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Eleventy Dev Server | Local preview | Built into Eleventy 3.x via `--serve` flag |
| Netlify CLI | Local Netlify dev environment | Optional - can test Netlify functions locally |
| eleventy-upgrade-help | Migration assistance | Only needed if converting to ESM |

## Installation

```bash
# CMS package (if using npm method instead of CDN)
npm install decap-cms-app --save

# No other packages required for basic Decap CMS integration
# The recommended approach is CDN-based (no npm install needed)
```

**Note:** For this project, the CDN approach is recommended (matching tutorial), which requires no npm packages. The CMS is loaded via `<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>`.

## Required Files for CMS Integration

### 1. Admin Directory Structure

```
src/admin/               # Or public/admin/ depending on build config
├── index.html          # CMS interface loader
└── config.yml          # CMS configuration
```

**Eleventy config addition:**
```javascript
eleventyConfig.addPassthroughCopy('./src/admin')
```

### 2. admin/index.html (CDN Method)

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

**Confidence: HIGH** - This is the official Decap CMS installation pattern, verified in official docs.

### 3. admin/config.yml (Example)

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "src/assets/blog"
public_folder: "/assets/blog"

collections:
  - name: "blog"
    label: "Blog"
    folder: "src/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Layout", name: "layout", widget: "hidden", default: "article"}
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "string"}
      - {label: "Author", name: "author", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Tags", name: "tags", widget: "list", default: ["post"]}
      - {label: "Featured Image", name: "image", widget: "image"}
      - {label: "Image Alt", name: "imageAlt", widget: "string"}
      - {label: "Body", name: "body", widget: "markdown"}
```

**Note:** Adjust paths to match existing project structure. Current project uses `src/blog/` for posts and `src/assets/` for images.

### 4. netlify.toml (Deployment Config)

```toml
[build]
  publish = "public"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Confidence: HIGH** - Standard Netlify configuration for Eleventy sites.

## Netlify Setup Steps

**1. Enable Identity**
- Netlify Dashboard → Site Settings → Identity → Enable Identity
- Registration preferences: "Invite only" (recommended for CMS access control)

**2. Enable Git Gateway**
- Identity settings → Services → Git Gateway → Enable Git Gateway
- Authenticates with GitHub/GitLab and generates API access token

**3. Invite Users**
- Identity tab → Invite users
- Send invite emails to CMS editors

**4. Optional: External Providers**
- Add GitHub, Google, etc. as OAuth providers for login
- Settings → Identity → External providers

**Confidence: HIGH** - Official Netlify documentation, verified in multiple 2026 sources.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Decap CMS (tutorial scope) | **Sveltia CMS** | **Production projects** - Drop-in replacement, actively maintained, modern UI, better i18n |
| Decap CMS | **Tina CMS** | Visual editing preferred, React-based sites, local-first workflow |
| Decap CMS | **Keystatic** | TypeScript projects, Markdoc support, React/Next.js integration |
| Decap CMS | **Sitepins** | Zero-config preference, managed service |
| Netlify Identity | **Auth0 via Netlify Extension** | Long-term projects, enterprise auth needs, SSO/MFA required |
| Netlify Identity | **GitHub OAuth (direct)** | Simple use case, all editors have GitHub accounts |

**Critical recommendation:** For this tutorial project, use Decap CMS as specified. For production projects or long-term use, **strongly consider Sveltia CMS** as a maintained alternative.

**Confidence: HIGH** - Based on extensive 2026 ecosystem research showing Decap stagnation and Sveltia adoption.

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Netlify CMS npm package | Deprecated, renamed to Decap CMS in 2023 | `decap-cms` or `decap-cms-app` |
| `decap-cms-app` without React | Requires React/React-DOM as peer dependencies | Use CDN method or `decap-cms` package |
| Hardcoded CDN versions (e.g., @3.1.0) | Locks you to specific version, misses patches | Use `@^3.0.0` for automatic patch updates |
| Netlify Identity for new production projects | Deprecated as of Feb 2026, uncertain future | Auth0 extension, or wait for Netlify's replacement |
| Manual Git commits from CMS | Decap handles this via Git Gateway | Never bypass Git Gateway |

**Confidence: HIGH** - Based on official deprecation notices and npm package status.

## Stack Patterns by Variant

### Pattern 1: CDN-Based CMS (Recommended for Tutorial)

**When:** Following tutorials, simple setup, no build pipeline for CMS
**Use:**
- Decap CMS via unpkg CDN (`<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js">`)
- Netlify Identity Widget via CDN (`<script src="https://identity.netlify.com/v1/netlify-identity-widget.js">`)
- No npm packages for CMS

**Because:**
- Zero npm dependencies for CMS layer
- Matches tutorial approach exactly
- Simpler mental model (CMS = admin interface, not build dependency)

### Pattern 2: npm-Based CMS (For Custom Extensions)

**When:** Need to customize CMS, add custom widgets, extend functionality
**Use:**
- `npm install decap-cms-app`
- Manual CMS initialization: `CMS.init()`
- React + React-DOM as peer dependencies

**Because:**
- Allows custom preview templates
- Enables custom widgets
- Better for advanced CMS customization

### Pattern 3: Sveltia CMS Migration (Production Alternative)

**When:** Production project, need active maintenance, want modern UI
**Use:**
- Sveltia CMS (drop-in Decap replacement)
- Same `config.yml` structure
- Better performance and UX

**Because:**
- Decap CMS is unmaintained
- Sveltia has active development
- Reuses existing Decap config with minimal changes

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Eleventy 3.1.2 | decap-cms@^3.0.0 | Fully compatible, no issues |
| Eleventy 3.x (ESM mode) | decap-cms@^3.0.0 | Compatible - CMS is loaded in browser, not Node.js |
| Eleventy 3.x (CommonJS) | decap-cms@^3.0.0 | Compatible - current project config |
| Netlify Identity Widget 1.9.2 | Git Gateway (latest) | Compatible but widget hasn't been updated in 4 years |
| Node.js 18+ | Eleventy 3.x | Required minimum version |

**Important:** Eleventy 3.x supports both ESM and CommonJS. Current project uses CommonJS (`"type": "commonjs"`), which is fully supported. No migration to ESM required for CMS integration.

## Eleventy 3.x Configuration Notes

**Current project status:**
- ✅ Using Eleventy 3.1.2
- ✅ Using CommonJS (module.exports syntax)
- ✅ No migration needed for Decap CMS integration

**If migrating to ESM in future:**
- Change `"type": "commonjs"` to `"type": "module"` in package.json
- Replace `module.exports` with `export default` in eleventy.config.js
- Replace `require()` with `import` statements
- Use `eleventy-upgrade-help` plugin to identify issues

**Confidence: HIGH** - Current CommonJS setup is stable and recommended for tutorial context.

## Critical Gotchas

### 1. Cloudflare Proxy Conflict
**Problem:** If using Cloudflare proxy on custom domain, `/.netlify/identity/*` requests return 405 errors
**Solution:** Redirect `/admin` traffic to `yoursite.netlify.app` subdomain where Identity functions properly
**Source:** [Decap CMS with Netlify: Git Gateway, Build Hooks, and the Cloudflare Gotcha](https://dylanbochman.com/blog/2026-01-15-decap-cms-netlify-setup-guide/)
**Confidence: HIGH**

### 2. .gitignore for Netlify Build Plugins
**Problem:** Netlify build plugins and Eleventy both try to use `.netlify/plugins/node_modules/`, causing build errors
**Solution:** Change `node_modules` to `**/node_modules/**` in `.gitignore`
**Source:** [Eleventy on Netlify - Official Docs](https://docs.netlify.com/build/frameworks/framework-setup-guides/eleventy/)
**Confidence: HIGH**

### 3. Media Folder vs Public Folder Paths
**Problem:** Decap adds slash prefix to `media_folder` when using as `public_folder`, breaking image paths
**Solution:** Explicitly set both `media_folder` (repo path) and `public_folder` (URL path) in config.yml
**Example:**
```yaml
media_folder: "src/assets/blog"  # Where files are saved in repo
public_folder: "/assets/blog"    # Path in generated HTML
```
**Source:** [Adding Decap CMS to 11ty](https://cassey.dev/adding-decap-cms-to-11ty/)
**Confidence: HIGH**

### 4. Identity Widget on Main Site
**Problem:** Users get logged out or can't access CMS after navigating away from `/admin`
**Solution:** Add Netlify Identity Widget script to your main site's `index.html` as well:
```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```
**Confidence: MEDIUM** (common pattern in tutorials, but not always required depending on workflow)

## Ecosystem Health Assessment (2026)

### Eleventy
- **Status:** ✅ Actively maintained
- **Latest release:** 3.1.2 (current in project)
- **Ecosystem:** Strong, growing, excellent documentation
- **Recommendation:** Excellent choice for static sites

### Decap CMS
- **Status:** ⚠️ No longer actively maintained
- **Latest release:** 3.10.1 (January 8, 2026)
- **Community:** Stagnant, community migrating to alternatives
- **Critical issues:** Security vulnerabilities and bugs going unaddressed
- **Recommendation:** OK for tutorial/learning, avoid for production

### Netlify Identity
- **Status:** ⚠️ Deprecated (February 2026), but still supported
- **Future:** Uncertain - Netlify recommends Auth0 extension for new projects
- **Widget:** Last updated 4 years ago (1.9.2)
- **Recommendation:** Functional but not recommended for new long-term projects

### Sveltia CMS (Alternative)
- **Status:** ✅ Actively maintained
- **Migration:** Drop-in replacement for Decap
- **Advantages:** Modern UI, better performance, built-in i18n
- **Recommendation:** Strongly recommended for production use

## Sources

### Official Documentation (HIGH Confidence)
- [Decap CMS Installation](https://decapcms.org/docs/install-decap-cms/) - Installation methods and CDN usage
- [Decap CMS Git Gateway Backend](https://decapcms.org/docs/git-gateway-backend/) - Git Gateway configuration
- [Eleventy Official Docs](https://www.11ty.dev/docs/config/) - Configuration and ESM support
- [Netlify Eleventy Guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/eleventy/) - Deployment settings
- [Netlify Identity Docs](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/) - Authentication setup

### npm Packages (HIGH Confidence)
- [decap-cms on npm](https://www.npmjs.com/package/decap-cms) - Latest version: 3.10.1
- [decap-cms-app on npm](https://www.npmjs.com/package/decap-cms-app) - For extensions: 3.9.0
- [netlify-identity-widget on npm](https://www.npmjs.com/package/netlify-identity-widget) - Version 1.9.2

### Community Resources (MEDIUM Confidence)
- [Adding Decap CMS to 11ty](https://cassey.dev/adding-decap-cms-to-11ty/) - Practical integration guide
- [Decap CMS with Netlify Setup Guide](https://dylanbochman.com/blog/2026-01-15-decap-cms-netlify-setup-guide/) - January 2026, Cloudflare gotcha
- [Upgrading to Eleventy v3](https://markllobrera.com/posts/upgrading-eleventy-v3/) - ESM migration guide
- [Max Böck - Eleventy v3 Update](https://mxb.dev/blog/eleventy-v3-update/) - ESM conversion experience

### Deprecation & Alternatives (HIGH Confidence)
- [Netlify Identity Deprecation Notice](https://www.netlify.com/changelog/deprecation-netlify-identity/) - Official announcement
- [Sveltia CMS - Successor to Netlify CMS](https://sveltiacms.app/en/docs/successor-to-netlify-cms) - Alternative CMS
- [GitHub Discussion: Netlify Identity Deprecation Impact](https://github.com/decaporg/decap-cms/discussions/7419) - Community response

### Ecosystem Analysis (MEDIUM Confidence)
- [6 Best Decap CMS Alternatives in 2026](https://sitepins.com/blog/decapcms-alternatives) - Market overview
- [I Was Happy With Decap CMS. Then I Discovered Sveltia](https://dubasipavankumar.com/blog/sveltia-cms-migration-decap-replacement/) - Migration case study

---
*Stack research for: JAMstack blog with Decap CMS integration*
*Researched: 2026-03-04*
*Researcher: gsd-project-researcher agent*
