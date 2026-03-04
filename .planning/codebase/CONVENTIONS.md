# Coding Conventions

**Analysis Date:** 2026-03-03

## Naming Patterns

**Files:**
- Nunjucks templates (`.njk`): lowercase with hyphens for multi-word names
  - `article-snippet.njk`, `article.njk`, `base.njk`, `footer.njk`, `header.njk`
- Markdown blog posts: date-first format with slugified title
  - `2026-03-03-look-ma-no-html.md`, `2021-05-01-my-first-article.md`
- Configuration files: `eleventy.config.js`, `blog.json`
- CSS: single file `style.css` (not scoped/modular)
- Directories: lowercase hyphens
  - `_includes/`, `blog/`, `assets/`

**HTML Classes (CSS):**
- BEM-like convention: block `__` element `--` modifier
  - `.page-header`, `.page-header__content`, `.nav-list`
  - `.btn`, `.btn--primary`, `.btn--neutral`
  - `.snippet`, `.snippet__title`, `.snippet__meta`, `.snippet__image`, `.snippet__body`
  - `.main-article`, `.main-article__figure`
- Utility classes: descriptive names
  - `.flow`, `.container`, `.container--narrow`, `.flex-group`, `.text-center`
  - `.section`, `.section-title`, `.article-title`

**CSS Custom Properties (Variables):**
- Two-segment scale naming: `--fs-300` through `--fs-700`, `--fw-400/700/900`, `--clr-primary-200` through `--clr-primary-500`
- Semantic naming with prefixes:
  - `--fs-*`: font size
  - `--ff-*`: font family
  - `--fw-*`: font weight
  - `--clr-*`: color
  - `--gap`, `--flow-spacer`, `--logo-color`: utility-specific variables

**Variables in Nunjucks:**
- camelCase: `dateObj`, `eleventyConfig`
- Template data variables: lowercase with hyphens in YAML frontmatter
  - `title`, `author`, `description`, `image`, `imageAlt`, `date`, `tags`, `layout`

**Functions:**
- JavaScript functions: camelCase
  - `addPassthroughCopy()`, `addFilter()` (Eleventy API)
- Filter functions: descriptive, lowercase
  - `postDate` (in `eleventy.config.js`)

## Code Style

**Formatting:**
- No linter or formatter configuration present (no `.eslintrc*`, `.prettierrc`, `biome.json`)
- Spacing and indentation follows manual conventions observed:
  - JavaScript: 4-space indentation (in `eleventy.config.js`)
  - Nunjucks templates: 2-space indentation
  - CSS: 2-space indentation with consistent property ordering
  - HTML/SVG inline: inline formatting with minimal extra spacing

**Linting:**
- Not configured. No ESLint or similar tooling detected.

## Import Organization

**JavaScript/CommonJS:**
- Module imports at top of file
- Example from `eleventy.config.js`:
  ```javascript
  const {DateTime} = require('luxon')

  module.exports = function(eleventyConfig) {
    // config
  }
  ```
- Eleventy API methods called on `eleventyConfig` object passed to function

**Nunjucks Includes:**
- Include order in templates: headers before main content, footers after
  - Base layout includes `header.njk` before `<main>`, then `footer.njk` after
  - `blog.njk` iterates `collections.post` and includes `article-snippet.njk`
- Use of `safe` filter for rendered markdown/content:
  - `{{ content | safe }}`
  - `{{ post.data.description }}` (unfiltered for plain text)

**Path Resolution:**
- Root-relative paths: `/style.css`, `/assets/`, `/blog/`
- Template relative includes: `{% include 'header.njk' %}` (from `_includes/`)
- No alias or path import system in use

## Error Handling

**Patterns:**
- No explicit error handling detected in source code
- Eleventy build failures would surface through CLI output
- Template data validation happens implicitly (missing data renders as empty)
- Date filtering gracefully handles Date objects via Luxon library

**Comments:**
- Inline code comment: `// NOTE: Config differs from tutorial...` in `eleventy.config.js`
- HTML comments for commented-out code: seen in `blog.njk` (lines 15-36 contain old HTML snippet wrapped in `{# #}` Nunjucks comment syntax)

## Comments

**When to Comment:**
- Inline comments explain deviations from expected patterns or tutorials (see `eleventy.config.js`)
- Commented-out code preserved for reference (old template in `blog.njk`)
- CSS reset section includes source attribution: `/* RESET - source: https://piccalil.li/blog/a-modern-css-reset */`

**JSDoc/TSDoc:**
- Not used. No TypeScript or complex function documentation present.

## Module Design

**Exports:**
- Eleventy config exports single function: `module.exports = function(eleventyConfig) { ... }`
- Nunjucks templates are not exported; they are discovered and processed by Eleventy

**Barrel Files:**
- `blog.json` acts as directory-level config, applying layout and tags to all posts in `src/blog/`
- No index files or barrel exports pattern detected

**Filter Registration:**
- Filters registered via `eleventyConfig.addFilter(name, function)` in main config
- Example: `postDate` filter defined inline and applied in templates via pipe syntax
  ```javascript
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })
  ```

## CSS Architecture

**Organization:**
- Single monolithic `style.css` file organized by section with clear comments
- Section order:
  1. CSS Variables (design tokens)
  2. Media queries for responsive scaling
  3. Reset/Normalize (source attributed)
  4. General styling (body, headings, etc.)
  5. Utility classes
  6. Component sections (Header, Footer, Homepage, Article page, snippets)
  7. Button variants

**Design Tokens:**
- All colors, fonts, and sizes exposed as CSS custom properties
- Values use HSLA for colors (enables `currentColor` overrides)
- Responsive scaling via media query breakpoint at `35em` and `45em`

**Component Classes:**
- Utility-first approach with component blocks
- Mix of Tailwind-like utilities (`.flow`, `.container`, `.flex-group`) and semantic components (`.snippet`, `.btn`)

## Template Patterns

**Frontmatter (YAML):**
- Post metadata in YAML frontmatter: `title`, `author`, `description`, `image`, `imageAlt`, `date`
- Directory-level config in `blog.json`: applies `tags`, `layout` to all files in directory
- Base layout specified per-page: `layout: 'base.njk'`

**Nunjucks Control Flow:**
- Loop syntax: `{% for post in collections.post %}...{% endfor %}`
- Conditional comments: `{# ... #}`
- Filters applied via pipe: `{{ date | postDate }}`
- Variable rendering: `{{ variable }}`, `{{ object.property }}`

---

*Convention analysis: 2026-03-03*
