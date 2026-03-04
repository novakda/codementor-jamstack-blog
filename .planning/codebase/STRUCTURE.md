# Codebase Structure

**Analysis Date:** 2026-03-03

## Directory Layout

```
codementor-jamstack-blog/
├── src/                          # Source files for build
│   ├── _includes/                # Reusable template components
│   ├── assets/                   # Static media (images, icons)
│   ├── blog/                      # Blog post content and metadata
│   ├── index.njk                 # Homepage template
│   ├── blog.njk                  # Blog listing template
│   └── style.css                 # Global stylesheet
├── public/                        # Generated static site (build output)
├── design-files/                 # Design assets and reference files
├── eleventy.config.js            # Build configuration
├── package.json                  # Project metadata and dependencies
└── package-lock.json             # Dependency lock file
```

## Directory Purposes

**src/:**
- Purpose: Source files for static site generation
- Contains: Templates, content, styles, and assets
- Key files: `index.njk`, `blog.njk`, `style.css`, `eleventy.config.js`

**src/_includes/:**
- Purpose: Reusable template components and layouts
- Contains: Nunjucks template files for page structure and components
- Key files: `base.njk` (root layout), `article.njk` (article layout), `header.njk`, `footer.njk`, `article-snippet.njk` (article preview component)

**src/blog/:**
- Purpose: Blog post content and collection configuration
- Contains: Markdown files with front matter metadata, and `blog.json` configuration
- Key files:
  - `blog.json`: Assigns layout and tags to all blog posts in this directory
  - `YYYY-MM-DD-slug.md`: Individual blog post files with metadata and content

**src/assets/:**
- Purpose: Static media files
- Contains: Images and icons used by pages
- Key files: `logo.svg`, `blog/` subdirectory with article images

**public/:**
- Purpose: Generated output (final static site)
- Contains: Built HTML files, CSS, and copied assets
- Generated: Yes - created by build process
- Committed: No - excluded from git

**eleventy.config.js:**
- Purpose: Build system configuration
- Contains: Directory mappings, passthrough copy rules, custom filters
- Responsibilities: Configure input/output directories, add date filters, set up asset passthrough

**design-files/:**
- Purpose: Reference materials and design assets
- Contains: Figma design file and design previews
- Used by: Manual reference during development (not part of build)

## Key File Locations

**Entry Points:**
- `src/index.njk`: Homepage - renders featured articles section
- `src/blog.njk`: Blog listing page - displays all blog posts
- `src/blog/*.md`: Individual blog post files - each generates a full article page

**Configuration:**
- `eleventy.config.js`: Eleventy build configuration with filters and passthrough rules
- `src/blog/blog.json`: Directory-level config assigning layout and default tags to posts
- `package.json`: Project metadata, scripts, and dependencies

**Core Logic:**
- `src/_includes/base.njk`: Root HTML document structure with header/footer
- `src/_includes/article.njk`: Article page layout extending base layout
- `src/_includes/article-snippet.njk`: Article preview component (used in listing pages)
- `src/_includes/header.njk`: Navigation header with logo and menu
- `src/_includes/footer.njk`: Footer with logo and copyright

**Styling:**
- `src/style.css`: Complete stylesheet with CSS variables, responsive design, and component styles

**Testing:**
- Not applicable - static site generator has no test infrastructure

## Naming Conventions

**Files:**
- **Template files:** `.njk` extension (Nunjucks), lowercase with hyphens: `article-snippet.njk`, `base.njk`
- **Markdown files:** `.md` extension, prefixed with ISO date for sort ordering: `2021-05-01-my-first-article.md`
- **Config files:** `.json` extension: `blog.json`, `package.json`
- **Root config:** `.js` extension: `eleventy.config.js`

**Directories:**
- **Directories:** Lowercase with underscores for private/special: `_includes/` (Eleventy convention)
- **Directories:** Lowercase with hyphens for content: `src/assets/`, `design-files/`

**Front Matter Fields:**
- `title`: Article heading
- `author`: Author name
- `date`: Publication date (ISO format YYYY-MM-DD)
- `tags`: Array of tags (e.g., `["post", "featured"]`)
- `image`: URL path to featured image (e.g., `/assets/blog/article-1.jpg`)
- `imageAlt`: Alt text for featured image
- `description`: Short preview text for article listings
- `layout`: Template file to use (e.g., `article.njk`)

## Where to Add New Code

**New Blog Post:**
- Create file: `src/blog/YYYY-MM-DD-slug.md`
- Add front matter: `title`, `author`, `date`, `tags` (must include `"post"`), `image`, `imageAlt`, `description`
- Add content: Markdown after front matter
- Layout: Inherited from `src/blog/blog.json` as `article.njk`
- Output: Generates `public/blog/slug/index.html`

**New Page (e.g., About):**
- Create file: `src/about.njk`
- Add front matter: `title` and `layout: "base.njk"`
- Add content: HTML/Nunjucks template markup
- Output: Generates `public/about/index.html`

**New Component/Include:**
- Create file: `src/_includes/component-name.njk`
- Define: Reusable template snippet (usually iterates over data or displays conditional markup)
- Use: Include in other templates via `{% include 'component-name.njk' %}`

**New Filter:**
- Edit: `eleventy.config.js`
- Add: `eleventyConfig.addFilter("filterName", function(value) { return processed; })`
- Use: In templates via `{{ value | filterName }}`

**New Styles:**
- Edit: `src/style.css`
- Add: New CSS rules (uses CSS custom properties/variables defined at :root)
- Note: CSS is monolithic; no CSS preprocessing is configured

**New Assets:**
- Add: Files to `src/assets/` in appropriate subdirectory (e.g., `src/assets/blog/`)
- Configure: If new top-level asset directory, add passthrough copy rule in `eleventy.config.js`
- Reference: In templates as `/assets/path/to/file`

## Special Directories

**_includes/:**
- Purpose: Eleventy convention for template components and layouts
- Generated: No - manually created
- Committed: Yes - part of source

**public/:**
- Purpose: Build output directory
- Generated: Yes - created by `npm run build` or `npm start`
- Committed: No - git ignored

**.planning/codebase/:**
- Purpose: Documentation and planning documents
- Generated: No (manually created by analysis tools)
- Committed: Yes - for team reference

## File Size Reference

As of 2026-03-03:
- `src/style.css`: ~10KB (includes extensive CSS reset and responsive design)
- `eleventy.config.js`: ~500 bytes (minimal configuration)
- Blog post files: 2-5KB each (Markdown content)
- Generated HTML pages: 5-15KB each (minification not configured)

---

*Structure analysis: 2026-03-03*
