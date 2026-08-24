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
| Final visual overrides | `css/components/flat-visuals.css` |
| Split story layout | `css/components/split-story.css` |
| Chapter openers | `js/components/chapterOpener.js`, `css/components/chapter-opener.css` |
| Text, images, references | `js/components/basicElements.js` |
| Statistics plots | `js/components/dataVisuals.js` |
| Clinical infographics | `js/components/clinicalElements.js` |
| 3D model viewer | `js/modules/ui/InlineModelViewer.js` |
| Story validation | `js/stories/validateStory.js` |

## Live pages

| Page | File |
| --- | --- |
| Dashboard / story selection | `index.html` |
| Alex aneurysm story | `scrollytelling-aneurysm.html` |
| Miriam dissection story | `scrollytelling-dissection.html` |
| Imprint | `impressum.html` |
| Privacy policy | `datenschutz.html` |

## Assets

| Asset type | Folder |
| --- | --- |
| Story images and CT slices | `assets/story_images/` |
| Aorta surface models | `assets/models/` |
| Flow visualization GLBs | `assets/models/flow/` |
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
