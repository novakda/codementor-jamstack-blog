# Phase 2: Netlify Deployment - Research

**Researched:** 2026-03-04
**Domain:** Netlify static site deployment, Netlify Identity authentication, Git Gateway CMS backend
**Confidence:** HIGH

## Summary

Phase 2 deploys an Eleventy blog to Netlify with authenticated CMS access. The deployment follows Kevin Powell's JAMstack tutorial pattern, substituting Decap CMS for the legacy Netlify CMS. The technical stack is mature and well-documented: Netlify provides automatic framework detection for Eleventy, Netlify Identity offers zero-config authentication via a simple script tag, and Git Gateway bridges Identity users to GitHub repository access without requiring GitHub accounts.

**Critical 2026 context:** Netlify Identity was briefly deprecated in early 2026 but reversed after community feedback. The service remains fully supported with no required migrations. Decap CMS is unmaintained as of January 2026 but functional. For this tutorial project, the stack works as designed. For production, Sveltia CMS (drop-in Decap replacement) is the recommended migration path.

**Primary recommendation:** Deploy first with test-repo backend to verify site builds correctly, then switch to git-gateway before configuring Identity. Add Identity widget to base.njk for site-wide coverage and include invite token redirect script to handle Netlify's email flow. Match Kevin Powell tutorial steps closely with Decap-specific substitutions.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Identity Widget Placement**: Add Netlify Identity widget script to `<head>` in `src/_includes/base.njk` (all pages)
- **CDN Source**: Use unpkg latest CDN (matches existing Decap CMS pattern in admin/index.html)
- **Redirect Script**: Add inline redirect script in base.njk that checks for invite tokens and redirects to /admin/
- **Admin Index Widget**: Adding the Identity widget to admin/index.html is part of the tutorial walkthrough (user does it during execution, not pre-configured)
- **Backend Switch Timing**: Deploy site first with test-repo to verify it works on Netlify, THEN switch backend to git-gateway before setting up Identity
- **Backend Configuration**: Replace `test-repo` with `git-gateway` in `src/admin/config.yml`, add explicit `branch: main` to backend config
- **Deployment Method**: Use Netlify web UI to import from GitHub (matches tutorial)
- **Repository Status**: Repo is already on GitHub — no repo setup needed
- **Build Settings Verification**: Explicitly verify build settings: build command `npm run build`, publish directory `public/`
- **Walkthrough Style**: Match Kevin Powell's tutorial steps as closely as possible, using Decap CMS instead of Netlify CMS
- **UI Navigation**: Detailed navigation paths for Netlify UI steps (e.g., "Go to Site Settings > Identity > Enable Identity")
- **Code Explanation**: Code changes show exact code AND explain what each line does (educational approach)
- **Verification Checkpoints**: Verification checkpoint after each major step ("you should see...")

### Claude's Discretion
- Exact wording of verification checkpoint descriptions
- Order of minor sub-steps within each major step
- Troubleshooting guidance if a step fails

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEP-01 | User deploys site to Netlify from Git repository | Standard Stack: Netlify CLI/UI deployment; Architecture Patterns: GitHub continuous deployment workflow |
| DEP-02 | User enables Netlify Identity on the deployed site | Standard Stack: Netlify Identity service; Code Examples: Enable via Project configuration > Identity |
| DEP-03 | User enables Git Gateway in Netlify Identity settings | Standard Stack: Git Gateway integration; Architecture Patterns: Git Gateway + Identity authentication flow |
| DEP-04 | User adds Netlify Identity widget script to site HTML | Standard Stack: netlify-identity-widget CDN script; Code Examples: Script tag placement, redirect handling |
| DEP-05 | User tests CMS login and creates/edits a post through the admin panel | Architecture Patterns: Invite-only registration workflow; Common Pitfalls: Invite token redirect issues |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Netlify | Platform | Static site hosting with continuous deployment | Industry standard JAMstack platform, automatic Eleventy detection, Git integration built-in |
| Netlify Identity | Built-in | User authentication and management | Zero-config authentication backed by GoTrue API, integrates with Git Gateway for CMS access |
| Git Gateway | Built-in | Proxy API for Git provider access | Enables CMS users to commit without GitHub accounts, official Netlify open-source project |
| netlify-identity-widget | v1 (latest) | Pre-built authentication UI | Zero-config drop-in widget, handles signup/login/recovery flows automatically |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gotrue-js | Latest | Custom authentication flows | When Identity widget doesn't meet custom UI requirements (not needed for tutorial) |
| Netlify CLI | Latest | Local testing and manual deploys | Optional for this phase (UI deployment sufficient), useful for troubleshooting |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Netlify Identity | Auth0 extension | More features but complex setup; Netlify now offers Auth0 extension but Identity remains supported |
| Git Gateway | Direct GitHub OAuth | Users need GitHub accounts; defeats purpose of lowering CMS access barrier |
| Netlify hosting | Vercel, Cloudflare Pages | Similar capabilities but different Identity/CMS integration patterns |

**Installation:**
No npm packages required for this phase. All dependencies loaded via CDN:
```html
<!-- Netlify Identity Widget -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>

<!-- Already present in admin/index.html -->
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
```

## Architecture Patterns

### Recommended Project Structure

Existing structure already optimal:
```
src/
├── _includes/
│   └── base.njk          # Identity widget goes here (site-wide)
├── admin/
│   ├── index.html        # CMS UI page (add Identity widget during tutorial)
│   └── config.yml        # Backend switch: test-repo → git-gateway
└── blog/                 # Content managed by CMS

eleventy.config.js        # Already has admin passthrough copy
package.json              # Build command: npm run build → eleventy
```

No structural changes needed. All modifications are in-place edits.

### Pattern 1: Netlify Continuous Deployment Flow

**What:** Git push triggers automatic build and deploy
**When to use:** Standard for all Netlify-hosted JAMstack sites
**Flow:**
1. User connects GitHub repository via Netlify UI
2. Netlify detects Eleventy framework (build command: `eleventy`, publish dir: `_site`)
3. On git push to main branch: webhook → build → deploy
4. Build runs `npm install && npm run build` in isolated container
5. Output directory contents published to CDN

**Configuration:**
- **Build command:** `npm run build` (runs `eleventy` from package.json)
- **Publish directory:** `public` (from eleventy.config.js output config)
- **Production branch:** `main`

**Source:** [Netlify Docs: Eleventy on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/eleventy/)

### Pattern 2: Netlify Identity Widget Integration

**What:** Zero-config authentication UI loaded via script tag
**When to use:** When you need user authentication without custom UI
**Implementation:**
```html
<!-- In src/_includes/base.njk <head> -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

Widget automatically:
- Attaches to `window.netlifyIdentity`
- Provides modal UI for login/signup/recovery
- Manages JWT tokens (1-hour expiry, auto-refresh)
- Stores site URL in localStorage for local dev

**Source:** [GitHub: netlify-identity-widget](https://github.com/netlify/netlify-identity-widget)

### Pattern 3: Invite Token Redirect Handling

**What:** JavaScript redirect to fix Netlify's email invite flow
**Why needed:** Netlify invite emails link to `/#invite_token=xxx` instead of `/admin/#invite_token=xxx`
**Implementation:**
```html
<!-- In src/_includes/base.njk before </body> -->
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

Alternative approach (check for token in URL hash):
```javascript
const currentHash = window.location.hash;
if (currentHash.includes("invite_token") || currentHash.includes("confirmation_token") || currentHash.includes("recovery_token")) {
  window.location.href = "/admin/" + currentHash;
}
```

**Why both patterns exist:** First redirects after login event (cleaner), second redirects immediately if token detected (handles edge cases).

**Source:** [Netlify Support Forums: Invite Token Redirect](https://answers.netlify.com/t/redirecting-from-invite-token-to-admin-invite-token/51661)

### Pattern 4: Git Gateway Backend Configuration

**What:** Decap CMS backend that uses Netlify Identity + Git Gateway instead of direct GitHub auth
**When to use:** When CMS users shouldn't need GitHub accounts
**Configuration:**
```yaml
# src/admin/config.yml
backend:
  name: git-gateway
  branch: main  # Explicit branch required
```

**Prerequisites:**
1. Netlify Identity enabled on site
2. Git Gateway enabled in Identity settings
3. Identity widget present in admin/index.html

**How it works:**
1. User logs in via Identity widget → receives JWT
2. CMS sends API requests to `/.netlify/git/github/*` with JWT
3. Git Gateway validates JWT, proxies to GitHub API with PAT
4. Commits appear in GitHub as authored by Git Gateway, user metadata in commit message

**Source:** [Decap CMS Docs: Git Gateway Backend](https://decapcms.org/docs/git-gateway-backend/)

### Pattern 5: Two-Phase Deployment (Test-Repo → Git-Gateway)

**What:** Deploy with test-repo first, verify build works, then switch to git-gateway
**Why:** Isolates build issues from authentication issues
**Steps:**
1. Initial deploy with `backend: name: test-repo` (Phase 1 state)
2. Verify site builds and deploys successfully to `.netlify.app` URL
3. Test CMS loads at `/admin` (should work locally, shows error on deployed site)
4. Switch to `backend: name: git-gateway, branch: main`
5. Enable Identity + Git Gateway
6. Test CMS login on deployed site

**Benefit:** If deployment fails, you know it's a build issue, not an authentication configuration issue.

### Anti-Patterns to Avoid

- **Adding Identity widget only to /admin:** Invite emails link to root domain; widget must be site-wide for token handling
- **Switching to git-gateway before verifying deployment:** Conflates build and auth issues, harder to debug
- **Using test-repo in production:** Backend works locally but not on deployed site (no GitHub auth flow)
- **Forgetting explicit branch in config:** Git Gateway defaults to `master` branch; most repos use `main`
- **Setting registration to "Open" immediately:** Use invite-only for tutorial to prevent spam signups

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| User authentication | Custom JWT system | Netlify Identity | Handles signup, email verification, password recovery, token refresh, external providers |
| GitHub API access for non-GitHub users | Custom OAuth proxy | Git Gateway | Manages PATs, rate limiting, permission scoping, commit attribution |
| Login/signup UI | Custom forms | netlify-identity-widget | Handles accessibility, validation, error states, token management, multiple auth flows |
| Email templates for auth flow | Custom email service | Netlify Identity built-in | Invite, confirmation, recovery emails with proper token handling |
| Token expiry/refresh | Manual JWT refresh logic | Identity widget auto-refresh | Widget calls `refresh()` automatically, handles edge cases |

**Key insight:** Authentication is deceptively complex. Edge cases include token refresh race conditions, email verification timing, password recovery flows, cross-domain cookies, CORS preflight, external provider state management. Netlify Identity encapsulates years of production-hardened patterns.

## Common Pitfalls

### Pitfall 1: Cloudflare Proxy Interference

**What goes wrong:** CMS login works on `yoursite.netlify.app` but returns 405 errors on custom domains proxied through Cloudflare
**Why it happens:** Cloudflare proxy blocks POST requests to `/.netlify/identity/*` endpoints
**How to avoid:**
- Test on `.netlify.app` domain first before adding custom domain
- If using Cloudflare, disable proxy (DNS-only) or create Page Rule to bypass cache for `/.netlify/*`
**Warning signs:** Login works locally and on Netlify subdomain but fails on custom domain; 405 Method Not Allowed in network console

**Source:** [Dylan Bochman: Decap CMS Netlify Setup Guide](https://dylanbochman.com/blog/2026-01-15-decap-cms-netlify-setup-guide/)

### Pitfall 2: Invite Token Not Reaching /admin

**What goes wrong:** User clicks "Accept Invite" link in email, lands on homepage instead of CMS login
**Why it happens:** Netlify invite emails link to `https://yoursite.com/#invite_token=xxx` but CMS needs `https://yoursite.com/admin/#invite_token=xxx`
**How to avoid:** Add redirect script to base.njk that detects tokens and redirects to /admin/
**Warning signs:** User reports "clicked invite link but nothing happened"; URL has `#invite_token` at root, not `/admin/`

**Solution patterns:**
1. Token-detecting redirect (immediate): checks URL hash for `invite_token|confirmation_token|recovery_token`, redirects to `/admin/ + hash`
2. Login event redirect (cleaner): listens for `netlifyIdentity.on("login")`, redirects to `/admin/` after successful auth

### Pitfall 3: Build Command Mismatch

**What goes wrong:** Site builds locally but fails on Netlify with "command not found" or dependency errors
**Why it happens:**
- Local build uses globally installed packages; Netlify build runs in clean container
- Package.json missing from repository
- Build command references script not in package.json
- Case-sensitive filename mismatches (works on macOS/Windows, fails on Linux Netlify builders)
**How to avoid:**
- Verify `package.json` in repository root with correct scripts
- Use `npm run build`, not global commands like `eleventy` (unless eleventy is in PATH)
- Match local build command exactly: if you run `npm install && npm run build` locally, Netlify should too
- Test build in clean directory: `rm -rf node_modules && npm install && npm run build`
**Warning signs:** Error logs show "command not found" or "module not found"; build works locally

**Source:** [Netlify Docs: Build Troubleshooting](https://docs.netlify.com/build/configure-builds/troubleshooting-tips/)

### Pitfall 4: Wrong Publish Directory

**What goes wrong:** Build succeeds but deployed site is blank or shows 404 errors
**Why it happens:** Netlify looks for built files in `_site` (Eleventy default) but project outputs to `public` (customized in eleventy.config.js)
**How to avoid:**
- Check `eleventy.config.js` for output directory configuration
- Match Netlify publish directory setting to actual build output
- Verify with local build: run `npm run build`, check which directory contains `index.html`
**Warning signs:** Build logs show "success" but site displays "Page Not Found"; deploy summary shows "0 files uploaded" or uploads source files instead of built HTML

**Example from this project:**
```javascript
// eleventy.config.js
return {
  dir: {
    input: "src",
    output: "public"  // ← Publish directory must be "public", not "_site"
  }
};
```

### Pitfall 5: Git Gateway Not Enabled

**What goes wrong:** CMS loads but login fails with "Error loading the CMS" or "Failed to load Git Gateway"
**Why it happens:** Switched `config.yml` to `git-gateway` backend but didn't enable Git Gateway service in Netlify UI
**How to avoid:**
1. Enable Netlify Identity first: Project configuration > Identity > Enable Identity
2. Enable Git Gateway second: Project configuration > Identity > Services > Git Gateway > Enable
3. Verify both show "Enabled" status before testing CMS login
**Warning signs:** CMS shows error message about Git Gateway; browser console shows 404 errors for `/.netlify/git/` endpoints

**Source:** [Netlify Docs: Git Gateway](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/)

### Pitfall 6: Forgetting Branch Configuration

**What goes wrong:** CMS login works but commits don't appear in repository, or appear on wrong branch
**Why it happens:** Git Gateway defaults to `master` branch; most modern repos use `main`
**How to avoid:** Explicitly set branch in config.yml:
```yaml
backend:
  name: git-gateway
  branch: main  # Don't omit this
```
**Warning signs:** CMS shows "Changes saved" but GitHub shows no new commits; commits appear on `master` branch instead of `main`

### Pitfall 7: Testing CMS Before Invite Acceptance

**What goes wrong:** User tries to log in to CMS but gets "No user found" or "Invalid credentials" error
**Why it happens:** Netlify Identity invite-only mode requires accepting invite email before first login
**How to avoid:**
1. Invite user via Netlify UI (Project configuration > Identity > Users > Invite users)
2. Wait for invite email (check spam folder)
3. Click "Accept the invite" link in email
4. Complete password setup on Netlify-hosted page
5. THEN attempt CMS login
**Warning signs:** User never received invite email; user received email but didn't complete password setup; error message "No user found"

## Code Examples

Verified patterns from official sources:

### Netlify Identity Widget - Base Template Integration

```html
<!-- src/_includes/base.njk -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <link rel="stylesheet" href="/style.css">
    <!-- Netlify Identity Widget -->
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    {% include 'header.njk' %}
    <main>
    {{ content | safe }}
    </main>
    {% include 'footer.njk' %}

    <!-- Redirect users to /admin after login -->
    <script>
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }
    </script>
  </body>
</html>
```

**What each part does:**
- **Script in `<head>`**: Loads Identity widget, attaches to `window.netlifyIdentity` global
- **`on("init")` listener**: Fires when widget initializes, receives current user or null
- **`if (!user)` check**: Only set up login listener if user not already logged in (prevents redirect loop)
- **`on("login")` listener**: Fires after successful authentication
- **Redirect to `/admin/`**: Sends authenticated user to CMS interface

**Source:** [Netlify Support Forums: Login Redirect](https://answers.netlify.com/t/redirecting-from-invite-token-to-admin-invite-token/51661)

### Decap CMS Admin Page with Identity Widget

```html
<!-- src/admin/index.html -->
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Content Manager</title>
  <!-- Netlify Identity Widget (added during tutorial) -->
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <!-- Decap CMS -->
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

**What each part does:**
- **Identity widget script**: Required for git-gateway backend authentication
- **Decap CMS script**: Loads CMS UI, reads config.yml, initializes backend
- **`noindex` meta tag**: Prevents search engines from indexing admin page

**Source:** [Decap CMS Docs: Add to Your Site](https://decapcms.org/docs/add-to-your-site/)

### Git Gateway Backend Configuration

```yaml
# src/admin/config.yml
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
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Author", name: "author", widget: "string", default: "Kevin Powell", required: false }
      - { label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false, required: true }
      - { label: "Featured", name: "featured", widget: "boolean", default: false, required: false }
      - { label: "Image", name: "image", widget: "image", required: false }
      - { label: "Image Alt Text", name: "imageAlt", widget: "string", required: false }
      - { label: "Description", name: "description", widget: "text", required: false }
      - { label: "Body", name: "body", widget: "markdown" }
```

**Changes from test-repo:**
- **`name: test-repo`** → **`name: git-gateway`**: Switches from local-only testing to authenticated GitHub access via Netlify proxy
- **Added `branch: main`**: Explicitly targets main branch (git-gateway defaults to master)

**What this enables:**
- CMS users authenticate via Netlify Identity (not GitHub accounts)
- Git Gateway proxies commits to GitHub using Netlify's service account
- Commits appear in GitHub with user's email from Identity profile

**Source:** [Decap CMS Docs: Git Gateway Backend](https://decapcms.org/docs/git-gateway-backend/)

### Invite Token Hash Redirect (Alternative Pattern)

```html
<!-- Alternative: immediate redirect on page load -->
<script>
  const currentHash = window.location.hash;
  if (currentHash.includes("invite_token") ||
      currentHash.includes("confirmation_token") ||
      currentHash.includes("recovery_token")) {
    window.location.href = "/admin/" + currentHash;
  }
</script>
```

**When to use:** If login event redirect doesn't fire reliably
**Tradeoff:** Redirects all token types (invite, confirmation, recovery) to /admin; login event pattern only redirects after authentication

**Source:** [Netlify Community Discussion: Invite Redirect](https://github.com/decaporg/decap-cms/discussions/7339)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Netlify CMS | Decap CMS | January 2023 | Name change only; Decap is direct fork maintaining compatibility |
| test-repo backend | git-gateway backend | N/A (different use cases) | test-repo for local dev, git-gateway for production with authentication |
| Netlify Identity active development | Maintenance mode | Feb 2026 (deprecation announced then reversed) | Service remains supported but not actively enhanced; Auth0 extension available for new projects |
| Manual OAuth configuration | Identity widget + Git Gateway | N/A (always recommended) | Abstracts OAuth complexity, reduces security surface |

**Deprecated/outdated:**
- **Netlify CMS package name**: Use `decap-cms` not `netlify-cms` (package unmaintained, but name still works via redirect)
- **master branch default**: Modern repos use `main`; always specify `branch: main` in git-gateway config
- **CI=false flag**: Netlify build troubleshooting used to recommend `CI=false` but this doesn't work; use `CI=''` (empty string)
- **Cloudflare Full SSL**: If using Cloudflare, "Full" mode can break Netlify Identity; use "Full (strict)" or disable proxy for `/.netlify/*` paths

**Current as of 2026:**
- Netlify Identity continues as supported service (deprecation reversed Feb 19, 2026)
- Decap CMS unmaintained but functional; Sveltia CMS recommended for new projects (drop-in replacement)
- Git Gateway marked "deprecated" in docs but continues to function with no removal timeline

**Sources:**
- [Netlify Changelog: Identity Deprecation Reversal](https://www.netlify.com/changelog/deprecation-netlify-identity/)
- [Decap CMS GitHub: Maintenance Status](https://github.com/decaporg/decap-cms/discussions/7419)

## Open Questions

1. **Does Eleventy output to `_site` or `public` in this project?**
   - What we know: Default Eleventy outputs to `_site`, but projects can customize via eleventy.config.js
   - What's unclear: Need to check eleventy.config.js `return { dir: { output: "..." } }` setting
   - Recommendation: Verify output directory in config before setting Netlify publish directory; test with local build (`npm run build`) to see which directory gets created

2. **Should registration be invite-only or open?**
   - What we know: Tutorial context uses invite workflow; open registration easier for demo but allows spam
   - What's unclear: User preference not specified
   - Recommendation: Start with invite-only (safer, matches tutorial walkthrough), can switch to open later if desired

3. **Should external providers (GitHub, Google) be enabled?**
   - What we know: Identity supports external OAuth providers; tutorial uses email/password
   - What's unclear: Whether user wants social login options
   - Recommendation: Start with email/password only (simpler, matches tutorial), can add providers post-tutorial if desired

## Sources

### Primary (HIGH confidence)

- [Netlify Docs: Netlify Identity Overview](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/) - Identity service capabilities and setup
- [Netlify Docs: Git Gateway](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/) - Git Gateway configuration and API
- [Netlify Docs: Eleventy on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/eleventy/) - Framework detection and build settings
- [Netlify Docs: Registration and Login](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/registration-login/) - Registration modes and user management
- [Netlify Docs: Build Troubleshooting](https://docs.netlify.com/build/configure-builds/troubleshooting-tips/) - Common build failures and solutions
- [GitHub: netlify-identity-widget](https://github.com/netlify/netlify-identity-widget) - Widget installation and configuration
- [Decap CMS Docs: Git Gateway Backend](https://decapcms.org/docs/git-gateway-backend/) - Backend configuration for Decap CMS
- [Netlify Changelog: Identity Deprecation Reversal](https://www.netlify.com/changelog/deprecation-netlify-identity/) - February 2026 policy change

### Secondary (MEDIUM confidence)

- [Dylan Bochman: Decap CMS Netlify Setup Guide](https://dylanbochman.com/blog/2026-01-15-decap-cms-netlify-setup-guide/) - January 2026 walkthrough with Cloudflare pitfall documentation
- [Netlify Support Forums: Invite Token Redirect](https://answers.netlify.com/t/redirecting-from-invite-token-to-admin-invite-token/51661) - Community solutions for invite flow
- [Netlify Support Forums: Build Problems Guide](https://answers.netlify.com/t/support-guide-frequently-encountered-problems-during-builds/213) - Compiled troubleshooting patterns
- [WebSearch: Netlify deployment 2026](https://www.netlify.com/blog/) - Platform capabilities and 2026 developer expectations
- [WebSearch: Decap CMS Netlify 2026](https://github.com/decaporg/decap-cms/discussions/7419) - Ecosystem status and maintenance discussions

### Tertiary (LOW confidence)

None — all findings verified against official documentation or dated 2026 sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Netlify docs, official Decap docs, verified GitHub repos
- Architecture: HIGH - Patterns from official documentation with working code examples
- Pitfalls: MEDIUM-HIGH - Mix of official troubleshooting docs (HIGH) and community-reported issues with solutions (MEDIUM)

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (30 days) — Netlify Identity and Git Gateway are stable maintenance-mode services, Eleventy build patterns are mature, Decap CMS is frozen (unmaintained but unchanging)
