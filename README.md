# ScrollytellingBuilder

A hand-programmed medical scrollytelling application built with vanilla JavaScript, Three.js, and GSAP.

## Start

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:8765`. The development server disables browser caching, so source changes do not require cache-version updates.

## Verify

```powershell
npm run validate
npm run check
```

## Where to edit

| Task | File |
| --- | --- |
| Dissection content | `js/stories/dissection/story.js` |
| Aneurysm content | `js/stories/aneurysm/story.js` |
| Easy design values | `css/tokens.css` |
| Chapter opener | `js/components/chapterOpener.js`, `css/components/chapter-opener.css` |
| Basic text/image elements | `js/components/basicElements.js` |
| Data visualizations | `js/components/dataVisuals.js` |
| Clinical components | `js/components/clinicalElements.js` |
| Validation rules | `js/stories/validateStory.js` |

See [docs/EDITING_GUIDE.md](docs/EDITING_GUIDE.md) for recipes and [AGENTS.md](AGENTS.md) for coding-model guardrails.

## Architecture

Story files contain declarative data only. `js/modules/storyContent.js` exposes both stories through the stable `storyVersions` API. The page renderer assembles validated data from focused component renderers. CSS tokens and component files provide stable editing surfaces while the legacy stylesheet is reduced incrementally.
