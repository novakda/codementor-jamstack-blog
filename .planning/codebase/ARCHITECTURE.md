# Architecture

**Analysis Date:** 2026-03-03

## Pattern Overview

**Overall:** Static Site Generation (SSG) with JAMStack architecture built on Eleventy.

**Key Characteristics:**
- Pre-built HTML at build time, no runtime server required
- Content-driven with Markdown articles and front matter metadata
- Template-based page generation using Nunjucks templating language
- Separation of templates, content, and styling
- Asset passthrough for CSS and images

## Layers

**Template Layer:**
- Purpose: Define page layouts and structure
- Location: `src/_includes/`
- Contains: Base layout, component templates (header, footer, article snippets), article layout
- Depends on: Front matter data from Markdown files
- Used by: Page files and Markdown articles for rendering

**Content Layer:**
- Purpose: Provide blog post content and metadata
- Location: `src/blog/`
- Contains: Markdown files with front matter (title, date, author, image, description, tags)
- Depends on: Nothing - serves as source data
- Used by: Template layer via collections and data from blog.json

**Page Layer:**
- Purpose: Define pages that use templates to generate output
- Location: `src/index.njk`, `src/blog.njk`
- Contains: Page-specific templates that reference layout templates and iterate over collections
- Depends on: Template layer and collections data
- Used by: Build process to generate final HTML

**Configuration Layer:**
- Purpose: Configure build process and add filters/plugins
- Location: `eleventy.config.js`
- Contains: Passthrough copy rules, custom Luxon date filter, directory configuration
- Depends on: Eleventy and Luxon libraries
- Used by: Build system during generation

**Styling Layer:**
- Purpose: Provide visual presentation
- Location: `src/style.css`
- Contains: CSS variables, responsive design, component styles
- Depends on: Nothing
- Used by: All HTML templates via base layout

**Asset Layer:**
- Purpose: Store static media
- Location: `src/assets/`
- Contains: Blog images, logo SVG
- Depends on: Nothing
- Used by: Article templates and layouts for images/branding

## Data Flow

**Build-Time Flow:**

1. **Eleventy reads source files** - Scans `src/` directory for template and content files
2. **Front matter parsing** - Extracts metadata (title, date, author, tags, image) from Markdown files
3. **Collection building** - Creates collections from tagged content (e.g., `tags: "post"` and `tags: "featured"`)
4. **Template rendering** - Applies Nunjucks templates to content
5. **Filter application** - Processes content through custom filters (e.g., `postDate` filter using Luxon)
6. **Static generation** - Produces final HTML files in `public/` directory
7. **Asset copying** - Copies CSS and assets via passthrough copy rules

**Rendering Process for Blog Posts:**

1. Markdown file in `src/blog/` with front matter metadata
2. `blog.json` (adjacent directory config) assigns `layout: "article.njk"` and tag `"post"`
3. `article.njk` layout extends `base.njk` with article-specific markup
4. `article.njk` renders title, image, and processed content (markdown → HTML)
5. `base.njk` wraps in document structure with header and footer
6. Final HTML written to `public/blog/[slug]/index.html`

**Collection-Based Rendering:**

1. **Featured articles page** (`src/index.njk`):
   - Iterates over `collections.featured` (articles with `featured` tag)
   - Uses `article-snippet.njk` to render each article preview
   - Displays image, title link, author/date, description, and "Continue Reading" button

2. **Blog listing page** (`src/blog.njk`):
   - Iterates over `collections.post` (all articles with `post` tag)
   - Uses same `article-snippet.njk` component
   - Shows recent articles in collection order

**State Management:**

No runtime state. All state is:
- **Build-time static:** Collections computed once during build
- **Client-side static:** Rendered HTML delivered as-is to browser
- **Data-driven:** Front matter in Markdown files is single source of truth

## Key Abstractions

**Collection:**
- Purpose: Group related content by tags
- Examples: `collections.post` (all blog articles), `collections.featured` (featured articles)
- Pattern: Eleventy automatically creates collections from file tags in front matter

**Template Components:**
- Purpose: Reusable layout fragments
- Examples: `article-snippet.njk`, `header.njk`, `footer.njk`
- Pattern: Included via `{% include %}` in other templates; pass post data as context

**Front Matter:**
- Purpose: Metadata for content files
- Examples: Title, author, date, tags, image URL, description
- Pattern: YAML block at start of Markdown files; accessible as `post.data.*` in templates

**Layout Chain:**
- Purpose: Composition through inheritance
- Pattern: Content → specific layout (article.njk) → base layout (base.njk) → final HTML
- Flow: Markdown with `layout: "article.njk"` → article.njk contains `layout: "base.njk"`

**Custom Filters:**
- Purpose: Transform data in templates
- Examples: `postDate` filter formats dates from JS Date objects to readable strings using Luxon
- Pattern: Registered in `eleventy.config.js` via `eleventyConfig.addFilter(name, function)`

## Entry Points

**Homepage:**
- Location: `src/index.njk`
- Triggers: Eleventy processes .njk files in src root
- Responsibilities: Display hero section, featured articles section, navigation to blog

**Blog List Page:**
- Location: `src/blog.njk`
- Triggers: Eleventy processes .njk files in src root
- Responsibilities: Display all blog articles as list of snippets with pagination-style display

**Individual Article Pages:**
- Location: `src/blog/*.md`
- Triggers: Eleventy processes Markdown files with front matter
- Responsibilities: Display full article content with title, image, formatted article body

**Build Execution:**
- Entry: `eleventy.config.js`
- Triggers: `npm start` (watch mode) or `npm run build`
- Responsibilities: Configure build system, define input/output directories, register filters, apply passthrough rules

## Error Handling

**Strategy:** No explicit error handling - JAMStack philosophy relies on build-time validation.

**Patterns:**
- Missing images: Would not cause build failure (HTML includes broken image references)
- Missing templates: Eleventy would error during build if layout referenced in front matter doesn't exist
- Invalid markdown: Builds successfully but may produce unexpected HTML rendering
- Missing collections: Templates safely handle empty collections with empty iteration

## Cross-Cutting Concerns

**Logging:** No logging framework - relies on Eleventy's console output during build

**Validation:**
- Front matter schema is implicit in usage (no schema validation)
- Content validation happens only at template rendering time if fields are accessed

**Authentication:** Not applicable - static output requires no authentication

**URL Structure:**
- Homepage: `/` (from `src/index.njk` → `public/index.html`)
- Blog list: `/blog/` (from `src/blog.njk` → `public/blog/index.html`)
- Articles: `/blog/[slug]/` (from `src/blog/YYYY-MM-DD-slug.md` → `public/blog/slug/index.html`)
- Assets: `/assets/[type]/[file]` (from passthrough copy of `src/assets/`)

---

*Architecture analysis: 2026-03-03*
