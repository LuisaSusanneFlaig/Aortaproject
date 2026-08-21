/**
 * Small, presentation-agnostic helpers shared by component renderers.
 */
export function clampPercent(value) {
    const numeric = Number.parseFloat(value);
    return Number.isNaN(numeric) ? 0 : Math.max(0, Math.min(100, numeric));
}
