# Playing FlowVisAnalyzer "compact" grow/shrink line exports

FlowVisAnalyzer can export lines with the grow/shrink animation in two ways (export panel, **Grow/shrink lines**):

| | Animated (default) | Compact |
|---|---|---|
| What is stored | the tubes + one full copy of every vertex per frame (glTF morph targets) | the tubes once + two numbers per vertex + the timing |
| Size (87 pathlines, 1.14 M vertices, 120 frames) | 1.6 GB | 77 MB (incl. the 12 MB vessel surface) |
| Plays in | any glTF viewer | a viewer with the reveal code below; other viewers show the lines static and complete |

- `flowvis-line-reveal.js`: a three.js helper (ES module, ~80 lines) that plays a compact file.
- `viewer.html`: a minimal three.js page using it. It must be served over HTTP (it loads the helper as a module).
  Choose or drop a `.glb`, or open `viewer.html?src=file.glb`.

## Using it in a three.js site

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { enableLineReveal } from './flowvis-line-reveal.js';

const gltf = await new GLTFLoader().loadAsync('export.glb');
scene.add(gltf.scene);                       // keep the root node: it scales millimetres to metres
const reveal = enableLineReveal(gltf.scene); // patches the line meshes' materials
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
    reveal.update(clock.getElapsedTime());   // seconds; 0 = all lines empty, starting to grow
    renderer.render(scene, camera);
});
```

`enableLineReveal(root, { speed })` plays faster or slower (1 = as exported); `{ progress }` (0..2) freezes the
cycle at one point. Nothing else changes: lighting, camera and the rest of the scene are your site's.

## What the file contains

The line mesh's node has `extras.FLOWVIS_line_reveal` (three.js: `mesh.userData.FLOWVIS_line_reveal`):

```json
{ "version": 1, "loopSeconds": 6.67, "stagger": 0, "lineCount": 87,
  "attributes": { "lineT": "_LINE_T", "curveFrac": "_CURVE_FRAC" }, "rule": "…", "note": "…" }
```

and two custom vertex attributes on the mesh, both `FLOAT`, one value per vertex:

| Attribute | Meaning |
|---|---|
| `_LINE_T` | Position along its line: the point's index divided by the point count of the **longest** line. A shorter line ends below 1 (it finishes early and waits, as in FlowVisAnalyzer). |
| `_CURVE_FRAC` | The line's index / the number of lines. Only matters when `stagger` > 0 (lines then run out of step). |

The rest is standard glTF: `POSITION`, `NORMAL`, `COLOR_0` (8-bit, the colour map baked per vertex), triangle
indices, and a `MeshStandardMaterial`-style PBR material (roughness 0.4, metalness 0, double-sided, vertex colours,
the dataset's opacity). The `.glb` also carries `FLOWVIS_provenance` (how the lines were made, see
`docs/formats/flowvis-provenance.md`); the structure of kind `line-reveal-compact` repeats the timing as `reveal`.

## The rule (for any engine)

Per fragment, with `seconds` the playback time:

```
progress = (2 * seconds / loopSeconds) mod 2            // one cycle = grow (0..1) then shrink (1..2)
p        = (progress + curveFrac * stagger * 2) mod 2
tail     = max(0, p - 1)
head     = min(p, 1)
draw the fragment if tail <= lineT <= head, otherwise discard it
```

`lineT` and `curveFrac` are interpolated from the vertices (they are constant around a tube ring, so the cut is
a clean ring). In three.js the helper does this with `onBeforeCompile`, the same patch FlowVisAnalyzer uses
on screen (`src/pipeline/line-reveal.js`).

## Matching the animated export exactly

To look like the animated (morph target) export of the same lines:

1. **Keep the scene graph as loaded.** The root node `flowvis_mm_to_m` scales the millimetre geometry by 0.001;
   the line mesh is already in world space under it.
2. **Use the file's material.** GLTFLoader builds it from the file (PBR, roughness 0.4, metalness 0,
   double-sided, vertex colours). Don't replace it; the helper only adds the discard. `COLOR_0` is read as
   linear colour, as glTF requires; the animated export stores the same colours (as floats instead of bytes, a
   difference of at most 1/255 per channel).
3. **Use the file's timing.** `loopSeconds` and `stagger` from the extras; time 0 = all lines empty.
4. **Render one draw call.** All lines are one mesh (1.1 M vertices here); no instancing or sorting needed.
   With an opacity below 1 the material is transparent like in the animated export.

What will still differ, by design:

- **Between frames the compact version is smoother.** The animated export holds 120 sampled states and blends
  between neighbours; the compact rule is evaluated at every rendered frame. At the 120 sampled times the
  visible part of every line is the same. Measured on the export above (24 frames, three.js, same camera):
  identical vertex positions, 7–15 of ~8,700 lit pixels differ, all at the line tips.
- **The tip.** The animated export pulls hidden vertices onto the tip, closing the tube; the compact rule cuts
  it, so you can look into the tube end from close up (the material is double-sided, so it shows its inside
  colour rather than a hole).
- **The first moment.** The animated export already shows its first frame (2/120 of the cycle) at time 0; the
  compact one starts from empty. A shift of 1/60 of the loop at the very start, nothing after.

## Things that commonly go wrong

1. **Attribute names.** three.js `GLTFLoader` lower-cases custom attributes (`_LINE_T` → `_line_t`). WebGL
   reserves some names starting with `_`, so the helper re-registers them as `lineT` / `curveFrac` for the shader.
2. **Program caching.** If you patch several materials differently, give each patched material its own
   `customProgramCacheKey`, or three.js may reuse an unpatched program.
3. **Material replaced after loading** (e.g. a site-wide material override): apply `enableLineReveal` after it,
   or the patch is lost.
4. **Nothing animates:** check that `reveal.meshes.length` is 1 or more. A file exported with "Animated" has no
   reveal attributes; it plays with three.js's `AnimationMixer` instead.
