# Loading FlowVisAnalyzer particle `.glb` exports (with per-frame colours)

- `flowvis-glb-loader.js`: dependency-free loader. It returns typed arrays per frame. Load it with a
  plain `<script>` tag (it exposes `window.FlowVisGlbLoader`), or with `require()` in Node and bundlers.
- `viewer.html`: minimal raw WebGL2 viewer using it. Open it directly (double-click), then choose or drop a
  `.glb`. When the folder is served over HTTP, `viewer.html?src=file.glb` also works.

```js
const { particles, surfaces } = FlowVisGlbLoader.loadFlowVisGlb(arrayBufferOfTheGlb);

const f = particles.frameAt(timeSeconds);        // loops over particles.duration
const xyz  = particles.positionsAt(f);           // Float32Array, pointCount*3 (apply particles.world)
const rgba = particles.colorsAt(f);              // Uint8Array,   pointCount*4, sRGB; A == 0 -> not alive
// upload both to vertex buffers when f changes; discard points with alpha 0
```

## Things that commonly go wrong

1. **The colour animation is not in the glTF animation.** glTF cannot animate per-point colours. The
   per-frame colours are a palette-index table described by `json.extras.FLOWVIS_particle_colors`.
   `COLOR_0` on the points only holds frame 0. A stock loader (three.js `GLTFLoader`, Babylon, Blender)
   shows the motion but the colours stay frozen.
2. **Morph targets are displacements.** A frame's position is `base + target[f-1]`, not `target[f-1]`.
   The weights animation is one-hot with STEP interpolation, so don't interpolate between frames.
3. **Dead particles have to be hidden.** A particle that isn't alive sits at its seed position in the
   geometry, with palette index 255 (`deadIndex`). If you draw it anyway, you get static clumps at the seeds.
4. **Many morph targets.** There is one target per frame (119 here), all on one `POINTS` primitive.
   Engines or shader paths that limit the number of active morph targets (older three.js, for
   example, allowed 8) may fail or drop frames. The loader computes positions on the CPU instead, which takes a few ms per frame.
5. **Coordinates are in scanner space (mm), not centred.** Frame the camera on the data bounds.
6. **The palette is sRGB** (0–255). If your renderer works in linear space, convert it before use.
