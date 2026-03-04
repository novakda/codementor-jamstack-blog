# Pitfalls Research

**Domain:** JAMstack Blog with Eleventy 3.x + Decap CMS + Netlify
**Researched:** 2026-03-04
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Admin Folder in Build Output Directory

**What goes wrong:**
Developers add the `admin/` folder directly to `_site/` (Eleventy's build output) instead of the project root. This causes the admin interface files to be deleted on every build or fail to be tracked in git properly.

**Why it happens:**
Decap CMS documentation suggests "create an admin folder in the place where static files go, with _site/ suggested for Eleventy." This is misleading—_site/ is the *output* folder, not the *source* folder.

**How to avoid:**
1. Create `admin/` folder in your project root (alongside `src/`)
2. Add passthrough copy in `eleventy.config.js`:
   ```js
   eleventyConfig.addPassthroughCopy("admin");
   ```
3. This copies admin files to `_site/admin/` during build

**Warning signs:**
- Admin interface works locally but breaks after deployment
- Git doesn't track admin folder changes
- Admin files disappear after running build command

**Phase to address:**
Phase 1 (CMS Integration) — Set up correct folder structure immediately during initial Decap CMS installation.

---

### Pitfall 2: Cloudflare Proxy Blocking Netlify Identity

**What goes wrong:**
When your custom domain routes through Cloudflare's proxy (orange cloud mode), authentication requests to `/.netlify/identity/*` endpoints get intercepted before reaching Netlify. Cloudflare returns a 405 "Method Not Allowed" error because it doesn't recognize these endpoints.

**Why it happens:**
Netlify Identity requires direct access to Netlify's servers, but Cloudflare's proxy sits between your domain and Netlify, blocking these authentication endpoints.

**How to avoid:**
**Option 1 (Recommended):** Disable Cloudflare proxy
- In Cloudflare DNS settings, click the orange cloud to switch to "DNS only" (gray cloud)
- This bypasses Cloudflare's proxy while keeping DNS management

**Option 2:** Use Netlify subdomain for admin
- Keep your main site on custom domain with Cloudflare
- Access CMS admin at `yoursite.netlify.app/admin` instead of `yourdomain.com/admin`
- Redirect admin traffic using permanent redirect

**Warning signs:**
- CMS login works on `yoursite.netlify.app` but fails on custom domain
- Browser console shows 405 errors on `/.netlify/identity/*` endpoints
- Authentication succeeds locally but fails in production

**Phase to address:**
Phase 2 (Netlify Deployment) — Verify authentication before enabling custom domain. Test both subdomain and custom domain scenarios.

---

### Pitfall 3: Missing Git Gateway Activation

**What goes wrong:**
Developers enable Netlify Identity but forget to enable Git Gateway, causing "Failed to persist entry: API_ERROR" when trying to save or publish content in the CMS.

**Why it happens:**
Netlify Identity and Git Gateway are separate features. Identity handles authentication, but Git Gateway is what allows the CMS to commit changes to your repository. Both must be enabled.

**How to avoid:**
1. Enable Netlify Identity: Site settings → Identity → Enable Identity
2. **Also enable Git Gateway:** Site settings → Identity → Services → Git Gateway → Enable Git Gateway
3. Verify Git Gateway shows as "Enabled" in settings
4. Set registration to "Invite only" (prevents spam accounts)

**Warning signs:**
- Users can log into CMS but cannot save drafts or publish
- Console shows API_ERROR or "Not Found" errors when saving
- CMS interface loads but all save operations fail

**Phase to address:**
Phase 2 (Netlify Deployment) — Enable both services together during initial Netlify configuration. Create checklist to verify both are active.

---

### Pitfall 4: Eleventy 3.x ESM Module Compatibility on Netlify

**What goes wrong:**
Eleventy 3.x requires ESM modules, but Netlify's build environment may use older Node versions or CommonJS configuration, causing errors like "`require("@11ty/eleventy")` is incompatible with Eleventy v3 and this version of Node."

**Why it happens:**
Eleventy 3.x made a breaking change to require ESM modules. If your `package.json` doesn't specify `"type": "module"` or you're using Node < 18, the build fails. Additionally, if you're using `require()` in config files, it won't work with v3.

**How to avoid:**
1. Add to `package.json`:
   ```json
   {
     "type": "module"
   }
   ```
2. Specify Node version in `netlify.toml`:
   ```toml
   [build.environment]
     NODE_VERSION = "20"
   ```
   or create `.nvmrc`:
   ```
   20
   ```
3. Use dynamic imports in config if mixing module types:
   ```js
   export default async function(eleventyConfig) {
     const plugin = await import('./plugin.js');
   }
   ```

**Warning signs:**
- Build succeeds locally but fails on Netlify
- Error mentions "require() is incompatible with Eleventy v3"
- Build log shows Node version < 18

**Phase to address:**
Phase 2 (Netlify Deployment) — Configure Node version and module type immediately when setting up Netlify build. Test deploy before adding CMS.

---

### Pitfall 5: media_folder and public_folder Path Mismatches

**What goes wrong:**
Images uploaded through Decap CMS have broken paths in generated markdown. The CMS saves images to one location but generates markdown references pointing to a different location, resulting in broken image links.

**Why it happens:**
Decap CMS uses `media_folder` (where files are saved in the repo) and `public_folder` (the URL path in published site). If `public_folder` is not set, Decap automatically adds a leading `/` to `media_folder`, which may not match your site's actual path structure.

**How to avoid:**
Set both paths explicitly in `config.yml`:
```yaml
# Where files are saved in repo (relative to repo root)
media_folder: "src/assets/blog"

# URL path in published site (relative to site root)
public_folder: "/assets/blog"
```

**Common scenarios:**
- If your build copies `src/assets/` to `_site/assets/`, use `public_folder: "/assets/blog"`
- If using absolute paths, ensure they match your Eleventy passthrough copy configuration
- For per-collection media folders, still provide a global `media_folder` to avoid validation errors

**Warning signs:**
- Images upload successfully but don't appear in preview
- Published posts show broken image links
- Image paths in markdown don't match actual file locations
- Browser 404 errors on image URLs

**Phase to address:**
Phase 1 (CMS Integration) — Configure media paths immediately when creating `config.yml`. Test with a sample image upload before moving to production.

---

### Pitfall 6: Netlify Identity Widget Script Loading Issues

**What goes wrong:**
The Netlify Identity widget script fails to load, loads too late, or causes page blocking. Users cannot authenticate or experience slow page loads.

**Why it happens:**
The identity widget is a 160kb script that blocks rendering when placed in `<head>`. If loaded async/defer, race conditions occur where `window.netlifyIdentity` isn't available when dependent code runs. If omitted from the home page, authentication breaks entirely.

**How to avoid:**
**Required placement:** Include widget on two pages only:
1. Site home page (`/index.html` or `src/index.njk`)
2. CMS admin page (`/admin/index.html`)

**Correct implementation:**
```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

Place in `<head>` for simplicity, or in footer with this initialization:
```html
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

**Warning signs:**
- Login modal doesn't appear when accessing `/admin`
- Console error: `netlifyIdentity is not defined`
- Users can't authenticate despite Identity being enabled
- Page load performance drops significantly

**Phase to address:**
Phase 2 (Netlify Deployment) — Add widget scripts during Identity setup. Test authentication flow before proceeding.

---

### Pitfall 7: .gitignore Node Modules Pattern Breaks Netlify Build Plugins

**What goes wrong:**
When using Netlify build plugins (like cache busting or image optimization), builds fail because both Eleventy and the plugins try to use `.netlify/plugins/node_modules/`, causing conflicts.

**Why it happens:**
The default `.gitignore` pattern `node_modules` doesn't ignore nested node_modules in `.netlify/plugins/`. Eleventy and build plugins both install dependencies there, causing version conflicts.

**How to avoid:**
Update `.gitignore`:
```diff
- node_modules
+ **/node_modules/**
```

This pattern ignores node_modules at any depth, preventing the conflict.

**Warning signs:**
- Build fails with "Module not found" errors
- Build log shows conflicts in `.netlify/plugins/node_modules/`
- Local builds succeed but Netlify builds fail
- Error mentions "cannot find module" in plugin directory

**Phase to address:**
Phase 2 (Netlify Deployment) — Update .gitignore before enabling any Netlify build plugins. This is a **required change** per Netlify's Eleventy documentation.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `| safe` filter on markdown content | Allows HTML in markdown | XSS vulnerability if content becomes user-generated | Only if all content is trusted and authored by site owner |
| Skipping Netlify Identity registration restriction | Faster setup | Potential spam accounts and unexpected Netlify charges | Never — always set to "Invite only" |
| Hardcoding media paths instead of using config | Faster initial setup | Breaks when folder structure changes, harder to migrate | Never — always use config.yml settings |
| Omitting Node version specification | One less config file | Build breaks when Netlify updates default Node version | Never with Eleventy 3.x |
| Using protocol-relative URLs (`//domain.com`) | Works on HTTP and HTTPS | Fails on Cloudflare, mixed content warnings | Never — always use explicit HTTPS |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Netlify Identity + Custom Domain | Assuming it works like on .netlify.app subdomain | Test authentication on custom domain separately; check for Cloudflare proxy conflicts |
| Decap CMS config.yml | Placing in wrong directory or using wrong paths | Must be at `/admin/config.yml` in output (use passthrough copy) |
| Git Gateway | Only enabling Identity, not Git Gateway | Enable both Identity AND Git Gateway in Netlify settings |
| Image uploads | Using default media_folder without public_folder | Explicitly set both to match your Eleventy passthrough config |
| Eleventy 3.x on Netlify | Assuming default Node version works | Always specify Node 18+ in netlify.toml or .nvmrc |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading Identity widget on all pages | 160kb added to every page load | Only load on home page and /admin page | Immediately — impacts all users |
| No image optimization pipeline | Large blog images (50-130kb each) | Use `@11ty/eleventy-img` plugin with Decap | Noticeable with 10+ images |
| Missing cache busting | Users see stale CSS/JS after updates | Add Eleventy Auto Cache Buster plugin | After first CSS/JS update |
| Building all posts on every deploy | Slow builds as post count grows | Enable incremental builds for large sites | 100+ posts |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Registration set to "Open" instead of "Invite only" | Anyone can create accounts; spam accounts incur Netlify charges | Always set Identity to "Invite only" mode |
| No Content Security Policy | Malicious scripts can execute if content is compromised | Add CSP headers in netlify.toml or meta tags |
| Using `| safe` filter without sanitization | XSS vulnerability if content source changes | Remove `| safe` or add HTML sanitization library |
| Committing admin credentials in config | Credentials exposed in public repos | Use environment variables for any sensitive data |
| Missing HTTPS enforcement | Man-in-the-middle attacks on authentication | Enable HTTPS-only in Netlify settings |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Poor mobile CMS experience | Decap CMS requires horizontal scrolling on mobile | Add CSS override for mobile responsiveness (see cassey.dev article) |
| No preview template styling | CMS preview looks nothing like published site | Register stylesheets and create custom preview templates |
| Missing required fields in CMS | Users can save drafts but can't publish | Define all required fields in config.yml with validation |
| Broken images in CMS preview | Authors can't verify images uploaded correctly | Test media_folder/public_folder config with sample upload |
| Confusing slug/filename patterns | Inconsistent file naming breaks organization | Use consistent slug template: `{{year}}-{{month}}-{{day}}-{{slug}}` |

## "Looks Done But Isn't" Checklist

When CMS appears to work but critical pieces are missing:

- [ ] **Authentication:** Can you log in on both .netlify.app subdomain AND custom domain?
- [ ] **Git Gateway:** Is Git Gateway enabled (not just Identity)? Verify in Netlify settings.
- [ ] **Image Paths:** Upload test image — does it appear in preview? Does markdown show correct path?
- [ ] **Registration:** Is Identity set to "Invite only"? Verify you can't register without invite.
- [ ] **Node Version:** Is Node 18+ specified in netlify.toml or .nvmrc?
- [ ] **Passthrough Copy:** Is admin/ folder configured for passthrough? Check _site/admin/ exists after build.
- [ ] **Identity Widget:** Is widget script on home page AND admin page? Check both locations.
- [ ] **.gitignore:** Is pattern `**/node_modules/**` (not just `node_modules`)? Verify if using plugins.
- [ ] **Module Type:** Is `"type": "module"` in package.json for Eleventy 3.x?
- [ ] **Media Config:** Are both media_folder AND public_folder set in config.yml?

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Admin folder in wrong location | LOW | Move folder to root, add passthrough copy, redeploy |
| Cloudflare proxy blocking | LOW | Disable proxy (DNS-only mode) or use redirect to .netlify.app |
| Missing Git Gateway | LOW | Enable in Netlify settings, refresh CMS admin |
| Node version mismatch | LOW | Add netlify.toml with NODE_VERSION=20, redeploy |
| Broken image paths | MEDIUM | Fix config.yml paths, re-upload all images through CMS |
| No ESM modules | MEDIUM | Add "type": "module" to package.json, convert configs |
| Unsafe content filters | HIGH | Audit all `| safe` uses, add sanitization, review all content |
| Open registration | MEDIUM | Change to "Invite only", delete unauthorized users, review Netlify bill |
| Editorial workflow errors | MEDIUM | Delete conflicting cms branch, verify Git Gateway, test with new draft |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Admin folder placement | Phase 1: CMS Integration | Check `_site/admin/` exists after build; verify git tracks admin/ |
| media_folder/public_folder paths | Phase 1: CMS Integration | Upload test image, verify preview shows image, check markdown path |
| Module type and Node version | Phase 2: Deployment | Build succeeds on Netlify with same Node version as local |
| Git Gateway missing | Phase 2: Deployment | Create test post in CMS, verify commit appears in repo |
| Cloudflare proxy blocking | Phase 2: Deployment | Test login on custom domain, check browser console for 405 errors |
| Identity widget placement | Phase 2: Deployment | Test authentication flow, verify widget loads on both pages |
| .gitignore pattern | Phase 2: Deployment | If using plugins, verify build succeeds without module conflicts |
| Registration security | Phase 2: Deployment | Verify "Invite only" is enabled before announcing CMS access |

## Domain-Specific Wisdom

### Decap CMS is Netlify CMS Renamed

Many tutorials reference "Netlify CMS" — they're the same product. Package names changed:
- Old: `netlify-cms-app`
- New: `decap-cms-app`

CDN URLs also changed. Use Decap documentation for current references.

### Netlify Identity is Deprecated

As of 2026, Netlify is deprecating Identity in favor of Auth0. For new projects:
- **For tutorial/learning:** Netlify Identity still works, tutorial is still valid
- **For production:** Consider alternative auth (GitHub OAuth, Auth0) for long-term support
- **Migration path:** Expect to migrate away from Netlify Identity eventually

### Editorial Workflow Adds Complexity

Editorial workflow enables draft → review → publish flow using git branches and pull requests. Common issues:
- **Branch conflicts:** If a `cms` branch already exists, workflow fails
- **Pull request failures:** Workflow creates branches but not PRs
- **Draft loading issues:** Fields don't load properly in review tab

**Recommendation:** Skip editorial workflow for simple blogs. Enable only if multiple editors need review process.

### Slug Configuration and File Dates

When using `slug: "{{year}}-{{month}}-{{day}}-{{slug}}"`, the date comes from *today* when creating the post, not from the frontmatter date field. This causes issues when scheduling posts for future dates.

**Workaround:** Manually adjust filenames for scheduled posts, or accept that filename date != frontmatter date.

### markdown-it-eleventy-img Issues

If using `@11ty/eleventy-img` to optimize markdown images:
- The plugin may stumble on absolute paths from Decap
- Images optimize locally but not on Netlify (missing dependencies)
- Decap's markdown widget doesn't support `sizes` attribute needed for responsive images

**Solution:** Use `eleventyImageTransformPlugin` with `defaultAttributes` instead of customizing widgets.

## Sources

### Primary Research Sources

- [Adding Decap CMS to 11ty](https://cassey.dev/adding-decap-cms-to-11ty/) — Detailed setup guide with common mistakes
- [Decap CMS with Netlify: Git Gateway, Build Hooks, and the Cloudflare Gotcha](https://dylanbochman.com/blog/2026-01-15-decap-cms-netlify-setup-guide/) — Critical Cloudflare proxy issue
- [My Decap CMS setup with 11ty hosted on Cloudflare Pages](https://www.patrickgrey.co.uk/notes/2024-09-21-my-decap-cms-setup-with-11ty-hosted-on-cloudflare-pages/) — Image handling and caching issues
- [Eleventy on Netlify | Netlify Docs](https://docs.netlify.com/build/frameworks/framework-setup-guides/eleventy/) — Official build plugin node_modules fix

### Configuration Documentation

- [Configuration Options | Decap CMS](https://decapcms.org/docs/configuration-options/) — Official config reference
- [Choosing a Backend | Decap CMS](https://decapcms.org/docs/choosing-a-backend/) — Backend and Git Gateway setup
- [Git Gateway | Decap CMS](https://decapcms.org/docs/git-gateway-backend/) — Git Gateway specifics
- [Authenticate users with Netlify Identity | Netlify Docs](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/) — Identity setup guide

### Issue Trackers and Forums

- [media_folder/public_folder absolute paths issue](https://github.com/decaporg/decap-cms/issues/3053) — Path configuration bugs
- [Editorial workflow API errors](https://github.com/decaporg/decap-cms/issues/3202) — Draft/publish failures
- [Netlify deploys fail while local builds succeed](https://github.com/11ty/eleventy/issues/1557) — Node version mismatches
- [eleventy-img optimization issues on Netlify](https://answers.netlify.com/t/netlifycms-eleventy-eleventy-img-works-locally-but-optimized-images-dont-get-created-on-netlify/86798) — Image optimization failures
- [Netlify Identity is being deprecated](https://github.com/decaporg/decap-cms/discussions/7419) — Future of authentication

### Community Guides

- [Creating or Changing Slugs in DecapCMS](https://www.bastianmoritz.com/doc/creating-or-changing-slugs-in-decapcms-formerly-netlify-cms/) — Slug configuration patterns
- [Configuration tips for Netlify CMS](https://matthewshields.co.uk/configuration-tips-for-netlify-cms) — Best practices
- [DRY Netlify CMS config with Manual Initialization](https://mrkaluzny.com/blog/dry-decap-cms-config-with-manual-initialization/) — JS config alternative to YAML

---
*Pitfalls research for: JAMstack Blog with Eleventy 3.x + Decap CMS + Netlify*
*Researched: 2026-03-04*
