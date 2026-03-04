# Testing Patterns

**Analysis Date:** 2026-03-03

## Test Framework

**Runner:**
- Not detected. No test framework configured.
- No test dependencies in `package.json`
- No `jest.config.*`, `vitest.config.*`, or similar test config files

**Assertion Library:**
- Not applicable - no testing framework installed

**Run Commands:**
```bash
npm run start              # Start dev server with file watching
npm run build              # Build static site
```

## Test File Organization

**Location:**
- No test files present in codebase
- No `__tests__/`, `tests/`, `spec/` directories

**Naming:**
- Not applicable - no test files found

**Structure:**
- Not applicable - no test files found

## Test Coverage

**Requirements:**
- No coverage requirements enforced
- No coverage configuration detected

## Testing Approach

**Current State:**
- This is a static site generator (JAMStack blog) using Eleventy with no dynamic application logic requiring unit tests
- Content is static markdown files with template rendering
- Configuration file (`eleventy.config.js`) is minimal (21 lines) and primarily configuration

**Manual Testing:**
- Development server available via `npm run start`
- Live reload during development enabled by Eleventy's built-in serve functionality
- Visual testing in browser during development

**Build Verification:**
- `npm run build` produces static output in `public/` directory
- No automated verification of build output

## What Would Be Testable (If Needed)

**Eleventy Filters:**
- The `postDate` filter in `eleventy.config.js` (lines 10-12) could be unit tested
  - Takes a Date object, returns formatted string via Luxon
  - Example test structure (if Jest were configured):
  ```javascript
  const {DateTime} = require('luxon')

  // Filter implementation
  const postDate = (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  }

  // Test case
  test('postDate formats date correctly', () => {
    const testDate = new Date('2026-03-03')
    const result = postDate(testDate)
    expect(result).toBe('Mar 3, 2026')
  })
  ```

**Template Rendering:**
- Collection filtering (featured vs. all posts)
- Markdown metadata parsing
- Layout composition and include resolution
- All handled by Eleventy, not custom code

## Dependencies for Testing

**If Testing Were Added:**
- Would need to add test framework (`jest`, `vitest`, or similar) to `devDependencies`
- Currently only `@11ty/eleventy` in devDependencies (no test tooling)

---

*Testing analysis: 2026-03-03*
