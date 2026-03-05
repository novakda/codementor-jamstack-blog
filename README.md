# JAMStack Personal Blog

A completed JAMstack blog built following Kevin Powell's tutorial, using Decap CMS instead of Netlify CMS. This project demonstrates a full end-to-end content management pipeline: edit content in a CMS interface, auto-build via Netlify, and publish as static HTML.

**Live site:** [tangerine-ganache-973e48.netlify.app](https://tangerine-ganache-973e48.netlify.app)

## What This Project Is

This repository follows [Kevin Powell's JAMstack blog tutorial](https://youtu.be/4wD00RT6d-g) for the [Codementor DevProjects Challenge](https://www.codementor.io/projects/web/create-a-fast-and-secure-blog-using-jamstack-c93coupnxb). The original tutorial used Netlify CMS, which has since been forked by the community into Decap CMS. This implementation uses Decap CMS as the direct successor to maintain the same architecture and workflow.

The project started with Kevin Powell's starter files (HTML templates, CSS, sample blog posts, and design assets) and added the CMS integration and deployment infrastructure to create a working JAMstack content pipeline.

## How It Was Built: Claude Code as a Learning Partner

This project was built with a deliberate learning approach. Rather than using Claude Code to automatically generate the implementation, the user employed Claude as an interactive instructor to understand JAMstack architecture hands-on.

**The approach:**
- Claude explained each step and configuration choice
- The user typed all code changes manually
- This method prioritizes understanding over speed — learning the "why" behind each decision

**Phase 1 (CMS Setup):** Claude guided the creation of admin files with detailed explanations of each configuration option in the CMS setup.

**Phase 2 (Netlify Deployment):** Entirely manual. The user configured Netlify services (hosting, Identity, Git Gateway) through the web UI and made all code changes by hand, with Claude walking through each step and explaining the purpose.

This hands-on approach provides deeper understanding of how the JAMstack pieces fit together than simply receiving working code.

## What Changed From the Original Tutorial

Beyond Kevin Powell's starter files, the following was added:

- Replaced Netlify CMS with Decap CMS (loaded via CDN from unpkg, no npm dependency)
- Created `/admin/` directory with `index.html` (CMS loader page) and `config.yml` (CMS configuration)
- Configured blog collection fields matching existing frontmatter: title, author, date, tags, image, imageAlt, description, body
- Added Eleventy passthrough copy rule for the admin folder in `eleventy.config.js`
- Added Netlify Identity widget to base template (`src/_includes/base.njk`) for authentication
- Added login redirect script to route authenticated users to `/admin/` automatically
- Configured Git Gateway backend with explicit `branch: main` setting
- Enabled invite-only registration via Netlify Identity to prevent unauthorized CMS access

## Content Pipeline

The complete workflow:

1. Log in at `/admin/` using Netlify Identity
2. Create or edit blog posts in the Decap CMS interface
3. CMS commits changes to GitHub repository via Git Gateway
4. Netlify detects the commit and automatically rebuilds the site
5. Updated content appears live on the deployed site

This demonstrates the core JAMstack benefit: content editors get a CMS interface while the site remains static HTML with no server-side rendering.

## Ecosystem Note

Decap CMS has been unmaintained since January 2026. Netlify Identity experienced a brief deprecation announcement in February 2026 that was reversed after community feedback. For this tutorial project, everything remains functional. For production use, [Sveltia CMS](https://github.com/sveltia/sveltia-cms) is recommended as a drop-in replacement for Decap CMS.

## Original Tutorial

These starter files were created by [Kevin Powell](https://kevinpowell.co) for the Codementor DevProjects Challenge: [Create a fast and secure blog using JAMStack](https://www.codementor.io/projects/web/create-a-fast-and-secure-blog-using-jamstack-c93coupnxb).

You can [watch the full tutorial video](https://youtu.be/4wD00RT6d-g) to see how Kevin builds a blog site using Eleventy, Netlify, and Netlify CMS.

**What the starter files contain:**

- Finished HTML page layouts that can be broken into templates and partials
- Complete CSS styling for the blog
- 5 sample blog articles written in Markdown with Front Matter
- Images and logo assets
- Design files (Figma file and JPG) if you want to build from scratch

The `src` folder structure:
- HTML files as base templates
- CSS file for styling
- `blog/` folder with article markdown files
- `assets/` folder with images and logo

## Tech Stack

- Eleventy (11ty) - Static site generator
- Decap CMS - Content management interface
- Netlify - Hosting, Identity authentication, Git Gateway
- Nunjucks - Template language
