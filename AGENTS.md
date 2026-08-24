# Repository instructions for coding models

This project is intentionally organized for small-context coding models and manual editing.

## Start here

- Project map for humans and small/free LLMs: `PROJECT_MAP.md`.
- Content: `js/stories/dissection/story.js` or `js/stories/aneurysm/story.js`.
- Basic HTML elements: `js/components/basicElements.js`.
- Data graphics: `js/components/dataVisuals.js`.
- Clinical paths and treatment components: `js/components/clinicalElements.js`.
- Chapter markup: `js/components/chapterOpener.js`.
- Split story layout: `css/components/split-story.css`.
- Easy visual adjustments: `css/tokens.css`.
- Component CSS: `css/components/`.

## Guardrails

1. Keep section IDs stable unless navigation and ID-specific CSS are updated together.
2. Do not add query-string cache versions; `npm run dev` disables caching.
3. Do not put story copy in renderer modules or HTML entry points.
4. Register every new element `type` in `js/stories/storySchema.js` and add its renderer.
5. Every story image requires meaningful `alt` text.
6. Do not generalize abdominal-aortic evidence to thoracic or Marfan-associated disease.
7. Prefer a focused file over extending a file beyond roughly 500 lines.
8. Preserve reduced-motion behavior for every new animation.

## Required verification

Run `npm run check` after every change. For visual changes, also run `npm run dev` and inspect both story pages at desktop and mobile widths.
