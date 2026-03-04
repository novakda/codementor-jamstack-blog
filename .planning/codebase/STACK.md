# Technology Stack

**Analysis Date:** 2026-03-03

## Languages

**Primary:**
- HTML - Markup generation via Nunjucks templating
- CSS - Styling (handwritten, located in `src/style.css`)
- Markdown - Blog post content, compiled to HTML
- JavaScript - Build tooling and templating filters

## Runtime

**Environment:**
- Node.js - No specific version constraint defined in project

**Package Manager:**
- npm - Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- @11ty/Eleventy v3.1.2 - Static site generator for JAMStack blog

**Templating:**
- Nunjucks (via Eleventy) - Template language for layouts and includes

**Utilities:**
- Luxon v3.7.2 - Date/time formatting library for blog post date filter

## Key Dependencies

**Build/Static Generation:**
- @11ty/eleventy v3.1.2 - Core JAMStack static site generator
  - Includes: eleventy-dev-server for local development
  - Includes: eleventy-plugin-bundle for asset bundling
  - Includes: posthtml-urls for URL rewriting

**Date/Time:**
- luxon v3.7.2 - Modern JavaScript date library
  - Used in: `eleventy.config.js` for date formatting via `postDate` filter
  - Enables locale-aware date formatting (e.g., "Mar 3, 2026")

## Configuration

**Build Config:**
- `eleventy.config.js` - Main Eleventy configuration
  - Input directory: `src/`
  - Output directory: `public/`
  - Pass-through copy: CSS file and assets directory
  - Custom filters: `postDate` filter for formatting dates

**Templates:**
- Nunjucks files (`.njk`) located in `src/` and `src/_includes/`
- Base layouts in `src/_includes/` (base, article, footer, header, article-snippet)
- Page layouts in `src/` (blog.njk, index.njk)

**Blog Posts:**
- Markdown files with YAML Front Matter in `src/blog/`
- Configuration in `src/blog/blog.json` - Sets default layout (`article.njk`) and tags (`post`)

## Environment Configuration

**Environment Variables:**
- No environment configuration currently used
- No .env files present in project

**Development:**
- Start dev server: `npm start` runs `eleventy --serve`
- Build for production: `npm run build` runs `eleventy`

## Platform Requirements

**Development:**
- Node.js with npm
- No specific version constraints defined

**Production:**
- Static hosting (e.g., Netlify, GitHub Pages, any CDN)
- No runtime dependencies required
- Generated output is pure static HTML/CSS/assets

**Build Output:**
- `public/` directory contains compiled static site
- All pages pre-rendered at build time
- No server-side processing required

---

*Stack analysis: 2026-03-03*
