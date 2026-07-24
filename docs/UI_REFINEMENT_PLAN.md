# RIFQ UI refinement plan

## Reference translation

The supplied infographic is a visual and content reference, not an application asset. Its reusable language is:

- four clearly separated phase families with a tinted border, soft wash, numbered marker, compact icon, and strong Arabic title;
- a repeated information order: phase → key need → DEVI → state/frame → practical actions;
- small, pill-shaped explanatory labels and a connected four-step cycle;
- rose, teal, amber, and lavender as phase semantics rather than decoration;
- D, E, V, and I as fixed cross-phase indicators with rose, amber, teal, and purple;
- white content surfaces, warm neutral canvas, hairline borders, gentle shadows, and restrained botanical cues.

## Component system

1. Add centralized UI metadata for phase numbers, icons, descriptions, semantic class names, and DEVI explanations.
2. Replace generic badges with `PhaseBadge` variants that expose phase number, icon, and accessible text.
3. Add `PhaseSummary` for the current phase, need, state, frame, and confidence.
4. Add `CycleTimeline` with four connected phase nodes, current state, cycle day, and accessible phase labels.
5. Refine `DeviChart` into four semantic vertical indicators with text equivalents.
6. Add `PhaseOverview` for onboarding and empty-data education.
7. Refine `ProfileCard` into an infographic-inspired compact dashboard module.
8. Add reusable recommendation-card and phase-legend presentation.

## Screen changes

- Dashboard: stronger greeting header, phase overview, refined independent profile cards.
- Profile detail: current-phase hero, cycle timeline, DEVI panel, needs, frame, and action groups.
- Calendar: phase legend, recorded/estimated distinction, and semantic date entries.
- Recommendations: phase-aware cards with time, budget, and category chips.
- Onboarding: four-phase explanation without reproducing the infographic.
- Mobile navigation: elevated, compact, safe-area-aware, and consistently rounded.

## Responsive and accessibility rules

- Preserve `lang="ar"` and `dir="rtl"`.
- Use logical CSS properties and mobile-first grids.
- Maintain 44px interactive targets, visible focus, semantic headings, and text alternatives.
- Never rely on color alone: phase name, number, icon, and status accompany every color.
- Keep motion optional and respect `prefers-reduced-motion`.
- Preserve privacy-mode concealment and all existing data/auth behavior.

## Validation

- Add component tests for phase badge, phase summary, timeline, DEVI indicators, and refined profile card.
- Run formatting, ESLint, strict TypeScript, unit/component tests, Playwright smoke tests, and production build through the existing branch CI gate.
