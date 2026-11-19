// Measures how densely each 3D flow export fills its aorta on screen and
// suggests the visual budgets for js/stories/flowBudget.js.
//
//   npm run dev                                  (in another terminal)
//   node tools/measure-flow-coverage.mjs         sweep budgets, suggest values
//   node tools/measure-flow-coverage.mjs verify  measure the budgets in flowBudget.js
//   node tools/measure-flow-coverage.mjs sizes   particles only, at the budgets in
//                                                flowBudget.js: coverage per particle
//                                                size (factor on PARTICLE_SIZE in
//                                                js/modules/ui/InlineModelViewer.js)
//
// Budgets are matched within each view: every pathline model to the sparsest
// pathline model, every particle model to the sparsest particle model. Tubes
// stay visible along their whole length, so pathlines cover about three times
// as much as particles; matching across views would leave only a handful of
// lines (the sweep prints that comparison too).
//
// Coverage = pixels drawn by pathlines or particles inside the aorta's
// silhouette / pixels of the silhouette, averaged over one loop
// (js/stories/flowTiming.js), including the empty phase of the particles.
// The models are measured in the comparison viewers of the blood-flow
// section at 1440 x 900, with the story's framing and rotation. Lines and
// particles are sized relative to the model, so the ratio barely depends on
// the window size.
import { chromium } from 'playwright';
import { LOOP_SECONDS } from '../js/stories/flowTiming.js';

const BASE = process.env.FLOW_BASE_URL || 'http://127.0.0.1:8765';
const MODE = process.argv[2] || 'sweep';
const VERIFY = MODE === 'verify';
const SIZES = MODE === 'sizes' ? [1, 1.5, 2, 2.5, 3, 4] : null;
const BUDGETS = [1, 0.8, 0.6, 0.45, 0.3, 0.2];
const SAMPLES = 25;

async function measurePage(browser, story, view) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/scrollytelling-${story}.html?view=${view}`);
    await page.waitForTimeout(800);
    const selector = '.flow-comparison-viewers [data-inline-model]';
    const count = await page.evaluate((selector) => document.querySelectorAll(selector).length, selector);
    const results = [];
    for (let index = 0; index < count; index += 1) {
        await page.evaluate(async ({ selector, index }) => {
            const container = document.querySelectorAll(selector)[index];
            container.scrollIntoView({ block: 'center' });
            if (!container.classList.contains('is-loaded')) {
                container.inlineModelViewer.hasStarted = false;
                await container.inlineModelViewer.init();
            }
        }, { selector, index });
        await page.waitForFunction(({ selector, index }) => document.querySelectorAll(selector)[index].classList.contains('is-loaded'), { selector, index }, { timeout: 300000 });
        const result = await page.evaluate(async ({ selector, index, sizes, budgets, samples, loopSeconds }) => {
            const THREE = await import('three');
            const container = document.querySelectorAll(selector)[index];
            const viewer = container.inlineModelViewer;
            const { renderer, scene, camera, mixer } = viewer;
            const root = viewer.rotationPivot || viewer.model;
            const walls = [];
            const flows = [];
            const others = [];
            root.traverse((object) => {
                if (object.isPoints || (object.isMesh && object.geometry.getAttribute('lineT'))) flows.push(object);
                else if (object.isMesh && object.userData.isFlowSurface) walls.push(object);
                else if (object.isMesh || object.isLine) others.push(object);
            });
            viewer.instancedGroups?.forEach(({ instancedMesh }) => others.push(instancedMesh));
            const gl = renderer.getContext();
            const width = gl.drawingBufferWidth;
            const height = gl.drawingBufferHeight;
            const pixels = new Uint8Array(width * height * 4);
            const read = () => {
                renderer.render(scene, camera);
                gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                return pixels;
            };
            const visibility = new Map([...walls, ...flows, ...others].map((object) => [object, object.visible]));
            const materials = new Map(walls.map((wall) => [wall, wall.material]));
            const clear = { color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha() };
            renderer.setClearColor(0x000000, 0);
            if (viewer.animationFrame) cancelAnimationFrame(viewer.animationFrame);

            // Silhouette of the aorta wall.
            others.forEach((object) => { object.visible = false; });
            flows.forEach((object) => { object.visible = false; });
            const silhouette = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            walls.forEach((wall) => { wall.visible = true; wall.material = silhouette; });
            const mask = read().filter((_, offset) => offset % 4 === 3).map((alpha) => (alpha > 0 ? 1 : 0));
            const maskPixels = mask.reduce((sum, value) => sum + value, 0);

            // Flow pixels inside the silhouette, over one loop.
            walls.forEach((wall) => { wall.visible = false; wall.material = materials.get(wall); });
            flows.forEach((object) => { object.visible = true; });
            const coverageAt = () => {
                let total = 0;
                for (let sample = 0; sample < samples; sample += 1) {
                    // Players take real seconds and scale them by timeScale.
                    mixer.setTime((sample / samples) * loopSeconds / (mixer.timeScale || 1));
                    const frame = read();
                    let covered = 0;
                    for (let pixel = 0; pixel < mask.length; pixel += 1) {
                        if (mask[pixel] && frame[pixel * 4 + 3] > 0) covered += 1;
                    }
                    total += covered / maskPixels;
                }
                return total / samples;
            };
            const points = flows.filter((object) => object.isPoints);
            const baseSizes = points.map((object) => object.material.size);
            const setSize = (factor) => points.forEach((object, at) => { object.material.size = baseSizes[at] * factor; });
            const curve = sizes
                ? sizes.map((size) => { setSize(size); return { size, coverage: coverageAt() }; })
                : budgets
                ? budgets.map((budget) => { mixer.setBudget(budget); return { budget, coverage: coverageAt() }; })
                : [{ budget: null, coverage: coverageAt() }];
            if (budgets) mixer.setBudget(1);
            if (sizes) setSize(1);

            visibility.forEach((visible, object) => { object.visible = visible; });
            renderer.setClearColor(clear.color, clear.alpha);
            viewer.startAnimationLoop();
            const kind = flows.some((object) => object.isPoints) ? 'particles' : 'lines';
            return { file: decodeURIComponent(container.dataset.modelUrl.split('/').pop()), kind, maskPixels, curve };
        }, { selector, index, sizes: SIZES, budgets: VERIFY || SIZES ? null : BUDGETS, samples: SAMPLES, loopSeconds: LOOP_SECONDS });
        results.push(result);
        console.log(`${story}/${view}: ${result.file}  ${result.curve.map(({ size, budget, coverage }) => `${size ? `x${size}` : budget ?? 'set'}:${(coverage * 100).toFixed(1)}%`).join('  ')}`);
    }
    await page.close();
    return results;
}

// Budget at which the measured curve reaches `target` (linear between points).
function budgetFor(curve, target) {
    const points = [...curve].sort((a, b) => a.budget - b.budget);
    if (target <= points[0].coverage) return points[0].budget * target / points[0].coverage;
    for (let index = 1; index < points.length; index += 1) {
        const low = points[index - 1];
        const high = points[index];
        if (target <= high.coverage) {
            return low.budget + (high.budget - low.budget) * (target - low.coverage) / (high.coverage - low.coverage);
        }
    }
    return 1;
}

const browser = await chromium.launch();
const results = [];
for (const story of ['aneurysm', 'dissection']) {
    for (const view of SIZES ? ['particles'] : ['lines', 'particles']) results.push(...await measurePage(browser, story, view));
}
await browser.close();

// The reference aorta is measured in both stories; average its curves.
const byFile = new Map();
const kinds = new Map();
results.forEach(({ file, kind, curve }) => {
    const known = byFile.get(file);
    byFile.set(file, known ? known.map((point, index) => ({ ...point, coverage: (point.coverage + curve[index].coverage) / 2 })) : curve);
    kinds.set(file, kind);
});

if (SIZES) {
    console.log('\nParticle coverage per size factor (averaged over the stories for the reference):');
    byFile.forEach((curve, file) => console.log(`  ${file.padEnd(40)} ${curve.map(({ size, coverage }) => `x${size}: ${(coverage * 100).toFixed(1)}%`).join('  ')}`));
} else if (VERIFY) {
    console.log('\nCoverage with the budgets in js/stories/flowBudget.js:');
    byFile.forEach((curve, file) => console.log(`  ${file.padEnd(40)} ${(curve[0].coverage * 100).toFixed(1)}%`));
} else {
    const full = (curve) => curve.find((point) => point.budget === 1).coverage;
    const targets = {};
    byFile.forEach((curve, file) => {
        const kind = kinds.get(file);
        targets[kind] = Math.min(targets[kind] ?? 1, full(curve));
    });
    console.log(`\nTargets (sparsest model of each view at full budget): ${Object.entries(targets).map(([kind, value]) => `${kind} ${(value * 100).toFixed(1)}%`).join(', ')}`);
    console.log('Suggested FLOW_BUDGETS:');
    byFile.forEach((curve, file) => console.log(`    '${file}': ${Math.min(1, budgetFor(curve, targets[kinds.get(file)])).toFixed(2)},`));
}
