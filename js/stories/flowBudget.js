// Visual budget of the 3D flow exports: the share of pathlines or particles
// each file shows (1 = all). The values are chosen so that every pathline and
// particle model covers the same share of its aorta on screen, averaged over
// one loop, matched to the sparsest model at full budget (Oeltze et al.).
// Measured with tools/measure-flow-coverage.mjs; rerun it after replacing an
// export and copy its suggested values here.
//
// Keyed by file name, so the reference aorta has the same budget in both
// stories. The kept lines and particles are a fixed random selection
// (js/modules/ui/flowLineReveal.js, js/modules/ui/flowvisParticles.js).
// ?budget=full on a story page shows every line and particle (pilot check).
export const FLOW_BUDGETS = {
    // Pathlines, matched to Miriam (39.8 % at full budget):
    'Healthy_pathlines_2cycles.glb': 0.55, // 44 of 80 lines
    'Aneurism_pathlines_2cycles.glb': 0.46, // 52 of 112 lines
    'TBAD_pathlines_2cycles.glb': 1, // all 87 lines
    // Particles, matched to the reference aorta (16.1 % at full budget):
    'Healthy_pulsed_particles_2cycles.glb': 1,
    'Aneurism_pulsed_particles_2cycles.glb': 0.47,
    'TBAD_pulsed_particles_2cycles.glb': 0.86
};

export function flowBudget(modelUrl) {
    if (new URLSearchParams(window.location.search).get('budget') === 'full') return 1;
    const name = decodeURIComponent(String(modelUrl).split('/').pop());
    const budget = FLOW_BUDGETS[name];
    return Number.isFinite(budget) && budget > 0 ? Math.min(1, budget) : 1;
}
