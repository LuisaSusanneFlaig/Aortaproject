# Project map

Use this file when you want to work manually or with a small/free LLM. It explains where things live without requiring the whole project in context.

## Run the project

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:8765`.

## Check before pushing

```powershell
npm run check
```

For visual work, also inspect the pages in the browser. The screenshot helper is:

```powershell
npm run screenshots
```

## Main editing areas

| What you want to change | Start here |
| --- | --- |
| Alex aneurysm story text/order | `js/stories/aneurysm/story.js` |
| Miriam dissection story text/order | `js/stories/dissection/story.js` |
| Visual styling values | `css/tokens.css` |
| Final visual overrides | `css/global.css`, `css/components/flat-*.css` |
| Split story layout | `css/components/split-story.css` |
| Chapter openers | `js/components/chapterOpener.js`, `css/components/chapter-opener.css` |
| Text, images, references | `js/components/basicElements.js` |
| Statistics plots | `js/components/dataVisuals.js` |
| Clinical infographics | `js/components/clinicalElements.js` |
| 3D model viewer | `js/modules/ui/InlineModelViewer.js` |
| 3D model labels | `inlineModel.labels` in the story files, `js/modules/ui/ModelLabels.js`, `css/components/model-labels.css` (open a story with `?pickLabels` and click the model to log an anchor) |
| Step infographics (scan to model, flow simulation) | `processSteps` elements in the story files, `js/components/processSteps.js`, `css/components/process-steps.css`; boundary planes in `js/modules/ui/boundaryPlanes.js` |
| Story validation | `js/stories/validateStory.js` |

## Live pages

| Page | File |
| --- | --- |
| Dashboard / story selection | `index.html` |
| Alex aneurysm story | `scrollytelling-aneurysm.html` |
| Miriam dissection story | `scrollytelling-dissection.html` |
| Shared ending with both outlooks | `ending.html`, `css/components/ending-page.css`, `css/components/ending-outlooks.css` |

## Assets

| Asset type | Folder |
| --- | --- |
| Story images and CT slices | `assets/story_images/` |
| Aorta surface models | `assets/models/` |
| Flow visualization GLBs | `assets/models/flow/` |
| FlowVisAnalyzer particle exports with per-frame colors | `assets/models/flow/dissection_particles_colored.glb`, read by `js/modules/ui/flowvisParticles.js` (loader in `vendor/flowvis/`). Do not run gltfpack on them: it drops the color table. |
| Third-party Three.js files | `vendor/three/` |

## Story structure

Each story file is declarative. Most edits should only touch fields like:

- `title`
- `text`
- `caption`
- `reference`
- `items`
- `src`
- `alt`

Avoid changing section `id` values unless you also update navigation and any matching CSS.

## Element types

Common story elements include:

- `text`
- `heading`
- `image`
- `reference`
- `symptomBars`
- `diagnosticPath`
- `treatmentDecision`
- `preventionTimeline`
- `imagingComparison`
- `modelPlaceholder`

When adding a new element type, register it in `js/stories/storySchema.js`, render it in `js/modules/storyRenderer.js`, and add the component renderer under `js/components/`.

## Study versions of the flow visuals

The menu dropdown "Visualization" (or `?view=illustration|lines|particles`) picks one version for every flow figure: hand-drawn illustrations, 3D pathlines or 3D particles. `js/modules/flowView.js` rewrites the story before rendering:

- A section with both `inlineModel` and `inlineIllustration` keeps only one of them.
- A `modelPlaceholder` keeps only its `flowIllustration` or the `flowVariants` entry whose `view` matches.
- Any story object can carry `flowViews: { illustration: {...}, particles: {...} }` to change its fields for one version; `null` removes a field.

How each version was made (from the CTA scan to the 3D model, then the simulation or the hand-drawn outline and arrows) is explained per version under "How this view was made" in the flow sections (`alex-flow-overview`, `s11`). The info popup in the first paragraph of those sections only says what the view is and is not (calculated or drawn, not measured).

`npm run check` validates and renders all three versions.

Animated flow arrows of the illustration version: export the Figma frame (drawing plus arrows) as SVG and run `node tools/extract-flow-arrows.js <frame.svg> js/stories/<story>/flowArrows.js <exportName>`. Pass the result as `flowIllustration.arrows` (or `healthyArrows`) with the still drawing as `src`; `js/modules/ui/flowArrows.js` grows and reseeds the arrows over it in rounds and shows them still with reduced motion. When each arrow starts is set with an optional `timing` list next to the arrows (see `js/components/flowArrowLayer.js`; Alex's flow section has an example); without it, the arrows start one after another in the Figma layer order.

Side-by-side sizes in the flow comparison: the 3D viewers scale every model to fill the view, so `framingScale` / `comparisonFramingScale` in `flowVariants` set how large each aorta appears; the drawings take `flowIllustration.scale` / `healthyScale` (below 1 shrinks one drawing). Keep the healthy and the affected aorta at a similar size when exports change.

## Current data sources

- Alex aneurysm case: VMR `0021_H_AO_MFS`, case `0129_0000`.
- Miriam dissection case: see source text in `js/stories/dissection/story.js`.
- Alex flow GLBs: `assets/models/flow/alex-marfan-pathlines-many.glb` and `assets/models/flow/alex-marfan-pathlines-sparse.glb`.
- Alex surface/CT export helper: `tools/export-new-aneurysm-assets.js`.

## Small LLM prompt

```text
Read PROJECT_MAP.md, AGENTS.md, and docs/EDITING_GUIDE.md.
Change only the files needed for: <task>.
Keep section IDs stable.
Do not edit unrelated files.
Run npm run check and summarize the result.
```
