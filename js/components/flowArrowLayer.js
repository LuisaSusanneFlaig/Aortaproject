// SVG layer with the hand-drawn flow arrows that lies over a flow drawing.
// The paths are only guides; js/modules/ui/flowArrows.js grows the visible
// arrows along them. Arrow data comes from tools/extract-flow-arrows.js.
//
// `arrowSet.timing` (optional) lists one entry per arrow, in the same order:
// { after: index of an earlier arrow, at: 'arrive' (its head reached the end,
// the default), 'done' (it has drained) or 'pass' (its head passes the start
// of this arrow, for branches), delay: extra ms, meet: [x, y] (the head
// reaches this point together with the head of the `after` arrow, e.g. where
// two channels reunite; after it, the arrow moves at the normal speed) }.
// `arrow.maxTravel` (optional) raises the 2 s limit for one seed, so a long
// arrow keeps the speed of the others.
// `arrowSet.tint` (optional) { color, rects: [[x, y, width, height, rotate,
// radius], ...] } draws the arrows in that colour inside the rectangles, e.g.
// red in a widened section. The values are those of the Figma rectangles:
// `rotate` (degrees, turning around x/y) and `radius` may be left out.
export function renderFlowArrowLayer(arrowSet) {
    if (!arrowSet?.arrows?.length) return '';
    const guides = arrowSet.arrows.map((arrow, index) => {
        const timing = arrowSet.timing?.[index] || {};
        const data = [
            Number.isFinite(arrow.speed) ? ` data-speed="${arrow.speed}"` : '',
            Number.isFinite(arrow.maxTravel) ? ` data-max-travel="${arrow.maxTravel}"` : '',
            arrow.dashes ? ` data-dashes="${arrow.dashes}"` : '',
            arrow.aboveOverlay ? ' data-above-overlay' : '',
            Number.isInteger(timing.after) ? ` data-after="${timing.after}"` : '',
            timing.at ? ` data-at="${timing.at}"` : '',
            Number.isFinite(timing.delay) ? ` data-delay="${timing.delay}"` : '',
            timing.meet ? ` data-meet="${timing.meet.join(' ')}"` : ''
        ].join('');
        return `<path class="flow-arrow-guide" d="${arrow.d}" style="--arrow-color: ${arrow.color || '#ffffff'}"${data}></path>`;
    }).join('');
    // `size` scales line width and arrowheads, for drawings shown smaller than others.
    const size = Number.isFinite(arrowSet.size) ? ` style="--arrow-size: ${arrowSet.size}"` : '';
    const tint = arrowSet.tint ? ` data-tint-color="${arrowSet.tint.color}" data-tint-rects="${arrowSet.tint.rects.map((rect) => rect.join(' ')).join(';')}"` : '';
    return `<svg class="flow-arrow-layer" viewBox="${arrowSet.viewBox}"${size}${tint} data-flow-arrows aria-hidden="true" focusable="false">${guides}${renderOverlay(arrowSet)}</svg>`;
}

// `arrowSet.overlay` (optional) { src, rect: [x, y, width, height], opacity }:
// a part of the drawing that lies above the arrows, e.g. a see-through false
// channel. The animation puts the arrows below it, except those with
// `arrow.aboveOverlay`.
function renderOverlay({ overlay }) {
    if (!overlay) return '';
    const [x, y, width, height] = overlay.rect;
    // Inline style, because the page resets opacity inside scroll items.
    const opacity = Number.isFinite(overlay.opacity) ? ` style="opacity: ${overlay.opacity}"` : '';
    return `<image class="flow-arrow-overlay" href="${overlay.src}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="none"${opacity}></image>`;
}
