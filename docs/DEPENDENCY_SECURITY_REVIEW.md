# Dependency security review

**Review date:** 2026-07-24  
**Branch:** `codex/create-ui-refinement-branch-and-plan`

## Executive summary

The initial `npm audit` reported three vulnerable package entries at high severity:
the direct production dependency `next` (because of its transitive dependencies),
and the transitive production packages `postcss` and `sharp`. The underlying
findings are two PostCSS advisories and one Sharp advisory.

The smallest compatible change is an npm override from Next's pinned PostCSS
8.4.31 to 8.5.22. PostCSS 8.5.22 remains on major version 8 and fixes both
PostCSS advisories. No application framework or test-tool versions were changed.
After that change, `npm audit` reports two high-severity vulnerable package
entries (`next` and `sharp`) representing the one unresolved Sharp advisory.

Sharp 0.35.0 is the first fixed release, but this repository's Next.js 15.5.21
declares `sharp: ^0.34.3`. Moving from Sharp 0.34.x to 0.35.x is a potentially
breaking pre-1.0 minor upgrade and falls outside Next's declared compatible
range, so it was deliberately not forced.

## Findings

| Advisory                                                                                                                                                                      | Affected package | Installed before review | First fixed version | Dependency path                                     | Dependency class                                                | Application use and exposure                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------: | ------------------: | --------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) — XSS through an unescaped `</style>` in CSS stringify output                                        | `postcss`        |                  8.4.31 |              8.5.10 | `rifq-app > next@15.5.21 > postcss@8.4.31`          | Production (transitive; Next is a direct production dependency) | The application imports `src/app/globals.css`, so CSS processing is used during the build. The vulnerable runtime pattern is not used: repository-controlled CSS is processed and the application does not accept or stringify attacker-supplied CSS.                         |
| [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) — arbitrary file read/information disclosure through an attacker-controlled CSS `sourceMappingURL`   | `postcss`        |                  8.4.31 |              8.5.12 | `rifq-app > next@15.5.21 > postcss@8.4.31`          | Production (transitive; Next is a direct production dependency) | The CSS build path is active, but its inputs are source-controlled local files. No feature accepts untrusted CSS or untrusted source-map comments, so the vulnerable attacker-controlled input path is not exposed.                                                           |
| [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) — inherited libvips vulnerabilities (CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591) | `sharp`          |                  0.34.5 |              0.35.0 | `rifq-app > next@15.5.21 > sharp@0.34.5` (optional) | Production (transitive optional dependency)                     | Sharp can be reached through Next.js image optimization, but this application has no `next/image` import, no direct Sharp import, and no image-optimization route usage in its source. The affected image-processing path is therefore not currently used by the application. |

`npm audit` also lists `next` as a high-severity affected package. That is an
aggregate/effect entry, not a fourth advisory: Next brings the vulnerable
PostCSS and Sharp packages into the production dependency graph.

## Remediation decision

### Applied: PostCSS 8.5.22 override

The root `overrides` entry resolves all installed PostCSS copies to 8.5.22. This
is the latest available PostCSS 8 release observed during the review, is above
both fixed-version thresholds, and is a same-major change. It avoids changing
Next.js, React, Supabase, Vitest, Playwright, or TypeScript.

### Deferred: Sharp 0.35.x

Do **not** add a Sharp override yet. The exact security upgrade is
`sharp@0.35.0` or newer (the reviewed current release is `sharp@0.35.3`), but
Next.js 15.5.21 only declares compatibility with `^0.34.3`. Even the reviewed
current Next.js 16.2.11 release declares `sharp: ^0.34.5`, so a Next.js major
upgrade alone does not provide a supported fix.

Recommended follow-up: upgrade to a Next.js release that explicitly permits
Sharp 0.35.x, then resolve Sharp to at least 0.35.0 (prefer the then-current
patched 0.35.x release) and rerun the complete validation suite. If an earlier
remediation is required, separately test the exact override
`"sharp": "0.35.3"` as a breaking compatibility change; it must not be treated
as a routine non-breaking security update.

The practical risk of postponement is low for the current code because the
application does not invoke Next image optimization. Risk becomes material if
`next/image`, the optimizer endpoint, or direct Sharp processing is added,
especially when processing attacker-controlled image content. Until a supported
upgrade exists, keep those paths disabled/unintroduced and reassess the lockfile
when Next.js or Sharp changes.

## Audit result

- Before: 3 high-severity vulnerable package entries (`next`, `postcss`,
  `sharp`), encompassing the three advisories in the table.
- After: 2 high-severity vulnerable package entries (`next`, `sharp`), both
  attributable to the one deferred Sharp advisory.
- No development-only advisories were found. All findings enter through the
  production dependency graph, although Sharp is optional and its affected path
  is unused by current application code.

## Review and validation commands

The dependency graph and application usage were examined with `npm audit
--json`, `npm explain`, `npm ls`, `npm view`, and targeted `rg` searches. No
environment-variable values were printed. The final validation results are
recorded in the commit/PR report produced with this review.
