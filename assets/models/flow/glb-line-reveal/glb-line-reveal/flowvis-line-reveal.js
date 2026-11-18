// Plays the grow/shrink line animation of a FlowVisAnalyzer "compact" .glb export in three.js.
//
// The export stores the tubes once, with two extra values per vertex (custom glTF attributes):
//   _LINE_T      position along its line: point index / the longest line's point count (0..1)
//   _CURVE_FRAC  the line's index / the number of lines (spreads the lines over the cycle, "stagger")
// and the timing in the mesh node's extras, FLOWVIS_line_reveal: { loopSeconds, stagger, ... }.
// The animation is a rule, evaluated per fragment — the same shader patch FlowVisAnalyzer draws with
// (src/pipeline/line-reveal.js):
//   progress = (2 * seconds / loopSeconds) mod 2
//   p        = (progress + curveFrac * stagger * 2) mod 2
//   draw where max(0, p - 1) <= lineT <= min(p, 1), discard otherwise
// First half of the cycle the line grows from its start, second half it shrinks from its start.
//
// Usage (three.js r150+, GLTFLoader):
//   const gltf = await new GLTFLoader().loadAsync('export.glb');
//   scene.add(gltf.scene);
//   const reveal = enableLineReveal(gltf.scene);          // finds and patches every compact line mesh
//   renderer.setAnimationLoop(() => { reveal.update(clock.getElapsedTime()); renderer.render(scene, camera); });

export const EXTRAS_KEY = 'FLOWVIS_line_reveal';

/** The meshes of `root` that carry a compact grow/shrink export (their node extras hold EXTRAS_KEY). */
export function findLineRevealMeshes(root) {
    const out = [];
    root.traverse((o) => { if (o.isMesh && o.userData && o.userData[EXTRAS_KEY]) out.push(o); });
    return out;
}

// GLTFLoader lower-cases custom attribute names (_LINE_T -> _line_t). WebGL reserves some names that start
// with an underscore, so the shader reads them under plain names.
function bindAttributes(geometry) {
    const lineT = geometry.getAttribute('_line_t');
    const curveFrac = geometry.getAttribute('_curve_frac');
    if (!lineT || !curveFrac) throw new Error('This mesh has no _LINE_T / _CURVE_FRAC attributes.');
    geometry.setAttribute('lineT', lineT);
    geometry.setAttribute('curveFrac', curveFrac);
}

function patchMaterial(material, uniforms) {
    const previous = material.onBeforeCompile;
    material.onBeforeCompile = (shader, renderer) => {
        if (previous) previous(shader, renderer);
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nattribute float lineT;\nattribute float curveFrac;\nvarying float vLineT;\nvarying float vCurveFrac;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLineT = lineT;\nvCurveFrac = curveFrac;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform float uProgress;\nuniform float uStagger;\nvarying float vLineT;\nvarying float vCurveFrac;')
            .replace('#include <clipping_planes_fragment>', [
                '#include <clipping_planes_fragment>',
                'float revealP = mod(uProgress + vCurveFrac * uStagger * 2.0, 2.0);',
                'if (vLineT < max(0.0, revealP - 1.0) || vLineT > min(revealP, 1.0)) discard;'
            ].join('\n'));
    };
    // A distinct program for the patched material (three.js caches programs by this key).
    material.customProgramCacheKey = () => 'flowvis-line-reveal';
    material.needsUpdate = true;
}

/**
 * Patches every compact line mesh under `root`. Returns { meshes, update(seconds) }: call update() every
 * frame with the elapsed time in seconds (any clock; 0 = every line empty, starting to grow).
 * `options.speed` scales time (1 = as exported); `options.progress` (0..2) freezes the cycle at that point.
 */
export function enableLineReveal(root, options = {}) {
    const meshes = findLineRevealMeshes(root);
    const controllers = meshes.map((mesh) => {
        const meta = mesh.userData[EXTRAS_KEY];
        bindAttributes(mesh.geometry);
        const uniforms = { uProgress: { value: 0 }, uStagger: { value: meta.stagger || 0 } };
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of materials) patchMaterial(m, uniforms);
        return { mesh, meta, uniforms };
    });
    return {
        meshes,
        update(seconds) {
            for (const { meta, uniforms } of controllers) {
                if (options.progress != null) { uniforms.uProgress.value = options.progress; continue; }
                const t = seconds * (options.speed ?? 1);
                uniforms.uProgress.value = meta.loopSeconds > 0 ? (2 * t / meta.loopSeconds) % 2 : 1;
            }
        }
    };
}
