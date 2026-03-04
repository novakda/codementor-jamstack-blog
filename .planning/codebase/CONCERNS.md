# Codebase Concerns

**Analysis Date:** 2026-03-03

## Tech Debt

**Unsafe Content Rendering:**
- Issue: The `| safe` filter is used to render markdown content directly into HTML without escaping or sanitization
- Files: `src/_includes/article.njk`, `src/_includes/base.njk`
- Impact: User-supplied or malicious markdown content could potentially include HTML/JavaScript that executes in the browser. While the current blog posts are trusted, this creates a vulnerability for any future content management system or user-generated content features.
- Fix approach: Remove the `| safe` filter if markdown already handles HTML escaping properly. If raw HTML must be supported in markdown, implement a content security policy (CSP) and/or use a sanitization library like `sanitize-html` to strip dangerous tags while preserving safe HTML.

**External Placeholder Image Dependency:**
- Issue: Homepage uses `unsplash.it` (now `picsum.photos`) for placeholder image at `//unsplash.it/510`
- Files: `src/index.njk` (line 27)
- Impact: Site appearance breaks if the external service is unavailable. The service is also deprecated and may be removed. The broken protocol (`//unsplash.it`) relies on current page protocol (HTTP/HTTPS) which can cause mixed content warnings on HTTPS sites.
- Fix approach: Replace with a locally-stored placeholder image in `src/assets/`. Remove protocol-relative URL and use explicit HTTPS path.

## Known Bugs

**Missing Required Frontmatter Fields:**
- Bug: Blog post `src/blog/2026-03-03-look-ma-no-html.md` is missing critical frontmatter fields
- Symptoms: The article will fail to render properly on the blog page because required fields (`date`, `image`, `imageAlt`, `tags`) are undefined
- Files: `src/blog/2026-03-03-look-ma-no-html.md`
- Trigger: View the article on the blog list page or individual article page
- Workaround: Add missing frontmatter fields to the article before deployment:
  ```yaml
  date: 2026-03-03
  image: /assets/blog/article-1.jpg  # or appropriate image path
  imageAlt: Descriptive alt text
  tags: ["post"]
  ```

**Inconsistent Frontmatter Format:**
- Bug: Blog posts use inconsistent array syntax for `tags` field
- Symptoms: May cause unexpected behavior if tag filtering is case-sensitive or format-specific
- Files: `src/blog/2021-05-01-my-first-article.md` (double quotes), `src/blog/2021-05-28-my-third-article.md` (single quotes)
- Trigger: Tag-based filtering or querying
- Workaround: Standardize all `tags` fields to use consistent syntax (recommend double quotes: `["post", "featured"]`)

**Missing Author in Non-Featured Articles:**
- Bug: Article `src/blog/2021-06-01-my-fourth-article.md` lacks the `tags` field entirely
- Symptoms: It won't appear in the featured articles collection, but will appear in the general post collection. This may be intentional but is inconsistent with other articles.
- Files: `src/blog/2021-06-01-my-fourth-article.md`
- Trigger: Listing featured articles
- Workaround: Explicitly set `tags: ["post"]` if not featured, or `tags: ["post", "featured"]` if it should appear

## Security Considerations

**Content Security Policy Not Implemented:**
- Risk: Without CSP headers, malicious scripts could execute even if injected through markdown or other content vectors
- Files: `src/_includes/base.njk` (missing CSP meta tag)
- Current mitigation: Trust-based approach (content comes from trusted author only)
- Recommendations: Add CSP header in static server configuration and/or CSP meta tag:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
  ```

**Mixed Content Warning Risk:**
- Risk: Protocol-relative URL (`//unsplash.it/510`) can cause mixed content warnings on HTTPS sites and fail to load on HTTP sites
- Files: `src/index.njk` (line 27)
- Current mitigation: None
- Recommendations: Switch to explicit HTTPS or local image URL

**No Input Validation on Blog Post Frontmatter:**
- Risk: Templates assume all frontmatter fields are present and valid. Missing or malformed data could cause rendering errors or security issues.
- Files: `src/_includes/article-snippet.njk`, `src/_includes/article.njk`, `src/blog/blog.json`
- Current mitigation: None
- Recommendations: Add null/undefined checks in templates or use default values, e.g., `{{ post.data.image or '/assets/default.jpg' }}`

## Performance Bottlenecks

**Large Image Assets:**
- Problem: Blog images in `/src/assets/blog/` range from 52KB to 132KB each
- Files: `src/assets/blog/article-*.jpg`
- Cause: Images are not optimized for web (no compression, no responsive variants, no WebP format)
- Improvement path:
  1. Use image optimization tools (e.g., ImageMagick, Sharp, or online services) to reduce file sizes by 50-70%
  2. Generate multiple sizes for responsive images
  3. Convert to modern formats (WebP with JPEG fallback)
  4. Consider lazy loading for images below the fold

**No Build-Time Image Optimization:**
- Problem: Eleventy config does not include any image processing pipeline
- Files: `eleventy.config.js`
- Cause: Images are passed through as-is without optimization
- Improvement path: Integrate `@11ty/eleventy-img` plugin to automatically generate optimized variants at build time

## Fragile Areas

**Blog Post Collection Filtering:**
- Files: `src/blog.njk`, `src/index.njk` (uses `collections.post` and `collections.featured`)
- Why fragile: Relies entirely on consistent frontmatter structure. If a post lacks the `tags` field or has the wrong tag value, it silently fails to appear in collections without error messages.
- Safe modification: Always validate that new articles include required frontmatter: `title`, `author`, `date`, `tags` (with "post" value), `image`, `imageAlt`, `description`
- Test coverage: No automated validation of blog post structure

**Date Filtering:**
- Files: `eleventy.config.js` (lines 10-12), `src/_includes/article-snippet.njk` (line 13)
- Why fragile: Uses `luxon` library to format dates. If a blog post has invalid date format or is missing the `date` field, the date filter will fail silently or output unexpected text.
- Safe modification: Ensure all blog posts have valid ISO 8601 date format (YYYY-MM-DD) and the `date` field is always present
- Test coverage: No automated tests for date formatting edge cases

**Template Include Chain:**
- Files: `src/_includes/base.njk` → includes `header.njk` and `footer.njk`
- Why fragile: Deep nesting of includes makes it hard to trace where content comes from. Changes to base layout affect all pages globally.
- Safe modification: Document the template hierarchy. Consider adding comments in templates to show the include chain.
- Test coverage: No tests for layout rendering

## Scaling Limits

**Build Time with Growing Blog:**
- Current capacity: 6 blog posts build instantly
- Limit: Eleventy will need to process all Markdown files every build. With hundreds of posts, build times will increase linearly.
- Scaling path: Consider implementing incremental builds or pagination. Eleventy v3 supports `incremental: true` flag for faster rebuilds.

**Static File Generation:**
- Current capacity: All content fits in a few KB
- Limit: No file size limits in current setup, but serving large static sites becomes inefficient beyond a few MB
- Scaling path: Add a CDN (e.g., Cloudflare) to cache and compress static assets

## Dependencies at Risk

**Luxon for Date Handling:**
- Risk: Single point of dependency for date formatting. If Luxon has a breaking change or bug, all date display breaks
- Impact: Date formatting across the site would break
- Migration plan: Date formatting is isolated to `eleventy.config.js` line 10-12. Could easily swap for native JavaScript `Intl.DateTimeFormat` API or `date-fns`

**@11ty/eleventy Major Version Dependency:**
- Risk: Currently locked to v3.1.2 via caret (`^3.1.2`). A breaking change in v4.x would require updates
- Impact: New versions may have different APIs or configuration requirements
- Migration plan: Keep Node.js and Eleventy updated as a group. Consider pinning to exact version (`3.1.2` without caret) for production stability if this is a critical site

## Missing Critical Features

**No Search Functionality:**
- Problem: Users cannot search for articles by title or content
- Blocks: Discoverability of blog posts beyond featured articles

**No RSS Feed:**
- Problem: Blog has no RSS feed generation
- Blocks: Readers cannot subscribe to updates; search engines have limited feed data

**No Breadcrumbs:**
- Problem: Articles lack navigation breadcrumbs
- Blocks: Users on article pages can't easily navigate back to blog root

**No Pagination:**
- Problem: Blog page loads all posts at once
- Blocks: Site will become slow as blog grows; no way to separate older posts

**No Related Articles Section:**
- Problem: No recommendation system for readers
- Blocks: Users can't discover related content

**No Comments System:**
- Problem: No way for readers to provide feedback
- Blocks: No reader engagement mechanism

## Test Coverage Gaps

**No Automated Tests:**
- What's not tested: Blog post frontmatter validation, template rendering, date formatting, image path validation, layout rendering
- Files: No test files found in project (no `*.test.js`, `*.spec.js`, or test directory)
- Risk: Breaking changes could go undetected. Adding new features requires manual testing only.
- Priority: High - At minimum, add:
  1. Unit test for `postDate` filter with various date formats
  2. Validation test for required blog post frontmatter fields
  3. Integration tests for template rendering
  4. Link validation test (ensure referenced images exist)

**No Linting Configuration:**
- What's not tested: Code quality, style consistency, unused dependencies
- Files: No `.eslintrc`, `.prettierrc`, or similar config found
- Risk: Code quality drift over time; no enforcement of style standards
- Priority: Medium - Add ESLint and Prettier configuration for JavaScript/Nunjucks

**No Build Validation:**
- What's not tested: Build success/failure, broken links, missing assets
- Files: No build validation in CI/CD pipeline detected
- Risk: Broken sites can be deployed without notice
- Priority: High - Add post-build validation script to check for:
  1. Broken internal links
  2. Missing image files
  3. Empty or invalid frontmatter

---

*Concerns audit: 2026-03-03*
