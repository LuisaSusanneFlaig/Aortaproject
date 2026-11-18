// Plays the grow/shrink animation of a FlowVisAnalyzer "compact" line export
// (assets/models/flow/glb-line-reveal/ has the original helper and README).
//
// The file stores the tubes once, with two values per vertex (_LINE_T: place
// along the line, _CURVE_FRAC: the line's index / line count) and the timing
// in the mesh's extras, FLOWVIS_line_reveal { loopSeconds, stagger }. Per
// fragment:
//   progress = (2 * seconds / loopSeconds) mod 2   (0..1 grow, 1..2 shrink)
//   p        = (progress + curveFrac * stagger * 2) mod 2
//   draw where max(0, p - 1) <= lineT <= min(p, 1), discard otherwise
//
// createLineRevealPlayer() returns a player with the parts of
// THREE.AnimationMixer the viewer uses (timeScale, update, setTime,
// stopAllAction), so frame rate, sync groups and reduced motion work as for
// the animated (morph target) exports.

const EXTRAS_KEY = 'FLOWVIS_line_reveal';

function revealMeshes(root) {
    const meshes = [];
    root.traverse((object) => {
        if (object.isMesh && object.userData?.[EXTRAS_KEY]) meshes.push(object);
    });
    return meshes;
}

// GLTFLoader lower-cases custom attributes (_LINE_T -> _line_t); WebGL
// reserves some names starting with "_", so the shader reads plain names.
function bindAttributes(geometry) {
    const lineT = geometry.getAttribute('_line_t');
    const curveFrac = geometry.getAttribute('_curve_frac');
    if (!lineT || !curveFrac) return false;
    geometry.setAttribute('lineT', lineT);
    geometry.setAttribute('curveFrac', curveFrac);
    return true;
}

// Call after any material replacement (flowColors.js), or the patch is lost.
function patchMaterial(material, uniforms) {
    const previous = material.onBeforeCompile;
    const previousKey = material.customProgramCacheKey?.bind(material);
    material.onBeforeCompile = (shader, renderer) => {
        previous?.(shader, renderer);
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nattribute float lineT;\nattribute float curveFrac;\nvarying float vLineT;\nvarying float vCurveFrac;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLineT = lineT;\nvCurveFrac = curveFrac;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform float uRevealProgress;\nuniform float uRevealStagger;\nvarying float vLineT;\nvarying float vCurveFrac;')
            .replace('#include <clipping_planes_fragment>', [
                '#include <clipping_planes_fragment>',
                'float revealP = mod(uRevealProgress + vCurveFrac * uRevealStagger * 2.0, 2.0);',
                'if (vLineT < max(0.0, revealP - 1.0) || vLineT > min(revealP, 1.0)) discard;'
            ].join('\n'));
    };
    material.customProgramCacheKey = () => `flowvis-line-reveal:${previousKey ? previousKey() : ''}`;
    material.needsUpdate = true;
}

/**
 * Patches every compact line mesh under `root`; null if there is none.
 * `loopSeconds` (optional) replaces the file's cycle length, e.g. to keep the
 * lines in step with an animated export next to them.
 */
export function createLineRevealPlayer(root, { loopSeconds = null } = {}) {
    const controllers = revealMeshes(root)
        .filter((mesh) => bindAttributes(mesh.geometry))
        .map((mesh) => {
            const meta = mesh.userData[EXTRAS_KEY];
            const uniforms = {
                uRevealProgress: { value: 1 },
                uRevealStagger: { value: meta.stagger || 0 }
            };
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => patchMaterial(material, uniforms));
            return { cycle: loopSeconds > 0 ? loopSeconds : meta.loopSeconds, uniforms };
        });
    if (!controllers.length) return null;

    const player = {
        timeScale: 1,
        time: 0,
        render() {
            controllers.forEach(({ cycle, uniforms }) => {
                uniforms.uRevealProgress.value = cycle > 0 ? (2 * player.time / cycle) % 2 : 1;
            });
        },
        update(delta) {
            player.time += delta * player.timeScale;
            player.render();
        },
        setTime(time) {
            player.time = time * player.timeScale;
            player.render();
        },
        // Reduced motion: every line drawn in full and kept still.
        showComplete() {
            controllers.forEach(({ uniforms }) => { uniforms.uRevealProgress.value = 1; });
        },
        stopAllAction() {}
    };
    return player;
}
