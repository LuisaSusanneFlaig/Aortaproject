// SVG layer with the hand-drawn flow arrows that lies over a flow drawing.
// The paths are only guides; js/modules/ui/flowArrows.js grows the visible
// arrows along them. Arrow data comes from tools/extract-flow-arrows.js.
//
// `arrowSet.timing` (optional) lists one entry per arrow, in the same order:
// { after: index of an earlier arrow, at: 'arrive' (its head reached the end,
// the default) or 'done' (it has drained), delay: extra ms }.
export function renderFlowArrowLayer(arrowSet) {
    if (!arrowSet?.arrows?.length) return '';
    const guides = arrowSet.arrows.map((arrow, index) => {
        const timing = arrowSet.timing?.[index] || {};
        const data = [
            Number.isFinite(arrow.speed) ? ` data-speed="${arrow.speed}"` : '',
            arrow.dashes ? ` data-dashes="${arrow.dashes}"` : '',
            Number.isInteger(timing.after) ? ` data-after="${timing.after}"` : '',
            timing.at ? ` data-at="${timing.at}"` : '',
            Number.isFinite(timing.delay) ? ` data-delay="${timing.delay}"` : ''
        ].join('');
        return `<path class="flow-arrow-guide" d="${arrow.d}" style="--arrow-color: ${arrow.color || '#ffffff'}"${data}></path>`;
    }).join('');
    // `size` scales line width and arrowheads, for drawings shown smaller than others.
    const size = Number.isFinite(arrowSet.size) ? ` style="--arrow-size: ${arrowSet.size}"` : '';
    return `<svg class="flow-arrow-layer" viewBox="${arrowSet.viewBox}"${size} data-flow-arrows aria-hidden="true" focusable="false">${guides}</svg>`;
}
