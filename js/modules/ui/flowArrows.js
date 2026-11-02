// Grow-and-reseed animation for the hand-drawn flow arrows of the
// illustration version (flowIllustration.arrows, rendered by
// js/components/flowArrowLayer.js).
//
// In every round, each arrow sends one seed along its path: the seed grows in
// with its head in front, travels, drains into the end of the path and fades.
// The next round seeds every arrow again. Arrows start in a chain that follows
// the flow: an arrow can wait until another one has arrived at its end or is
// done (data-after, data-at, data-delay, see flowArrowLayer.js); without that,
// arrows start one after another. With reduced motion, the arrows stand still.

const SVG_NS = 'http://www.w3.org/2000/svg';
const SPEED = 280; // drawing units per second; the drawings are about 850 units wide
const MIN_TRAVEL = 300; // ms for one seed to grow in, travel and drain
const MAX_TRAVEL = 2000; // ms
const STAGGER = 150; // ms between arrows without a timing of their own
const PAUSE = 350; // ms between two rounds
const HEAD = 'M-6.4 -6.4 L0 0 L-6.4 6.4';

let maskId = 0;

// A dashed arrow keeps its drawn dashes; the grow window is then a mask
// stroke along the guide instead of the dash pattern of the line itself.
function createArrow(layer, guide) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', 'flow-arrow-seed');
    group.style.setProperty('--arrow-color', guide.style.getPropertyValue('--arrow-color'));
    const line = document.createElementNS(SVG_NS, 'path');
    line.setAttribute('class', 'flow-arrow-line');
    let windowPath = line;
    if (guide.dataset.dashes) {
        line.setAttribute('d', guide.dataset.dashes);
        const mask = document.createElementNS(SVG_NS, 'mask');
        mask.id = `flow-arrow-mask-${++maskId}`;
        mask.setAttribute('maskUnits', 'userSpaceOnUse');
        const [x, y, width, height] = layer.getAttribute('viewBox').split(/\s+/).map(Number);
        Object.entries({ x, y, width, height }).forEach(([key, value]) => mask.setAttribute(key, value));
        windowPath = document.createElementNS(SVG_NS, 'path');
        windowPath.setAttribute('d', guide.getAttribute('d'));
        windowPath.setAttribute('class', 'flow-arrow-window');
        mask.append(windowPath);
        group.append(mask);
        line.setAttribute('mask', `url(#${mask.id})`);
    } else {
        line.setAttribute('d', guide.getAttribute('d'));
    }
    const head = document.createElementNS(SVG_NS, 'path');
    head.setAttribute('d', HEAD);
    head.setAttribute('class', 'flow-arrow-head');
    group.append(line, head);
    layer.append(group);
    const length = guide.getTotalLength();
    const trail = Math.min(length * 0.6, 150);
    const speed = SPEED * (Number(guide.dataset.speed) || 1);
    const travel = Math.min(MAX_TRAVEL, Math.max(MIN_TRAVEL, (length + trail) / speed * 1000));
    const size = Number(layer.style.getPropertyValue('--arrow-size')) || 1;
    return { guide, line: windowPath, head, group, length, trail, travel, size, start: 0 };
}

// Start time of every arrow within a round, from its timing.
function schedule(arrows) {
    arrows.forEach((arrow, index) => {
        const { after, at, delay } = arrow.guide.dataset;
        const previous = arrows[Number(after)];
        if (after === undefined || !previous || Number(after) >= index) {
            arrow.start = index * STAGGER;
            return;
        }
        const arrived = previous.start + previous.travel * previous.length / (previous.length + previous.trail);
        arrow.start = (at === 'done' ? previous.start + previous.travel : arrived) + (Number(delay) || 0);
    });
    return Math.max(...arrows.map((arrow) => arrow.start + arrow.travel)) + PAUSE;
}

function placeHead(arrow, at) {
    const point = arrow.guide.getPointAtLength(at);
    const behind = arrow.guide.getPointAtLength(Math.max(0, at - 2));
    const angle = Math.atan2(point.y - behind.y, point.x - behind.x) * 180 / Math.PI;
    // Inline style, because the page resets the transform attribute of SVG elements.
    arrow.head.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg) scale(${arrow.size})`;
}

function drawArrow(arrow, time) {
    const elapsed = time - arrow.start;
    if (elapsed < 0 || elapsed >= arrow.travel) {
        arrow.group.style.opacity = 0;
        return;
    }
    const travelled = elapsed / arrow.travel * (arrow.length + arrow.trail);
    const front = Math.min(travelled, arrow.length);
    const back = Math.max(0, travelled - arrow.trail);
    const fadeIn = Math.min(1, travelled / (arrow.trail * 0.25));
    const fadeOut = Math.min(1, (arrow.length - back) / arrow.trail);
    arrow.group.style.opacity = Math.min(fadeIn, fadeOut);
    arrow.line.style.strokeDasharray = `${front - back} ${arrow.length + arrow.trail}`;
    arrow.line.style.strokeDashoffset = -back;
    placeHead(arrow, front);
}

function setupLayer(layer, reduceMotion) {
    const arrows = [...layer.querySelectorAll('.flow-arrow-guide')]
        .filter((guide) => guide.getTotalLength() > 0)
        .map((guide) => createArrow(layer, guide));
    if (reduceMotion) {
        arrows.forEach((arrow) => placeHead(arrow, arrow.length));
        return null;
    }
    return { arrows, round: schedule(arrows), startedAt: performance.now() };
}

export function initFlowArrows(root = document) {
    const layers = [...root.querySelectorAll('[data-flow-arrows]')];
    if (!layers.length) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const sequences = new Map(layers.map((layer) => [layer, setupLayer(layer, reduceMotion)]));
    if (reduceMotion) return;

    const visible = new Set('IntersectionObserver' in window ? [] : layers);
    let frame = 0;
    const tick = (now) => {
        visible.forEach((layer) => {
            const sequence = sequences.get(layer);
            const time = (now - sequence.startedAt) % sequence.round;
            sequence.arrows.forEach((arrow) => drawArrow(arrow, time));
        });
        frame = visible.size ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
        if (!frame && visible.size) frame = requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    visible.delete(entry.target);
                    return;
                }
                // Coming into view starts a new round from the first arrow.
                if (!visible.has(entry.target)) sequences.get(entry.target).startedAt = performance.now();
                visible.add(entry.target);
            });
            start();
        });
        layers.forEach((layer) => observer.observe(layer));
    }
    start();
}
