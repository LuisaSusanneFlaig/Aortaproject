// Grow-and-reseed animation for the hand-drawn flow arrows of the
// illustration version (flowIllustration.arrows, rendered by
// js/components/flowArrowLayer.js).
//
// In every round, each arrow sends one seed along its path: the seed grows in
// with its head in front, travels, drains into the end of the path and fades.
// The next round seeds every arrow again. Arrows start in a chain that follows
// the flow: an arrow can wait until another one has arrived at its end or is
// done, or until its head passes the start of the waiting arrow (data-after,
// data-at, data-delay, see flowArrowLayer.js); without that,
// arrows start one after another. With reduced motion, the arrows stand still.

const SVG_NS = 'http://www.w3.org/2000/svg';
const SPEED = 280; // drawing units per second; the drawings are about 850 units wide
const MIN_TRAVEL = 300; // ms for one seed to grow in, travel and drain
const MAX_TRAVEL = 2000; // ms
const STAGGER = 150; // ms between arrows without a timing of their own
const PAUSE = 350; // ms between two rounds
const HEAD = 'M-6.4 -6.4 L0 0 L-6.4 6.4';

let maskId = 0;

function svgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
}

// A mask over the whole drawing with the given content.
function createMask(layer, ...content) {
    const [x, y, width, height] = layer.getAttribute('viewBox').split(/\s+/).map(Number);
    const mask = svgElement('mask', { id: `flow-arrow-mask-${++maskId}`, maskUnits: 'userSpaceOnUse', x, y, width, height });
    mask.append(...content);
    return mask;
}

// One tint rectangle "x y width height rotate radius", turned around x/y as
// in Figma. Inline style, because the page resets the transform attribute.
function tintRect(values, fill) {
    const [x, y, width, height, rotate = 0, radius = 0] = values.trim().split(/\s+/).map(Number);
    const rect = svgElement('rect', { x: 0, y: 0, width, height, rx: radius, fill });
    rect.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    return rect;
}

// Tint (data-tint-rects, data-tint-color): a mask that hides the plain arrows
// inside the rectangles and a clip that shows the tinted copy only there.
function createTint(layer) {
    if (!layer.dataset.tintRects) return null;
    const rects = layer.dataset.tintRects.split(';');
    const [vx, vy, vw, vh] = layer.getAttribute('viewBox').split(/\s+/).map(Number);
    const outside = createMask(layer,
        svgElement('rect', { x: vx, y: vy, width: vw, height: vh, fill: '#fff' }),
        ...rects.map((values) => tintRect(values, '#000')));
    const inside = svgElement('clipPath', { id: `flow-arrow-clip-${++maskId}` });
    inside.append(...rects.map((values) => tintRect(values)));
    layer.append(outside, inside);
    return { outside: outside.id, inside: inside.id, color: layer.dataset.tintColor };
}

// A dashed arrow keeps its drawn dashes; the grow window is then a mask
// stroke along the guide instead of the dash pattern of the line itself.
// With a tint, every arrow is drawn twice: plain outside the tint rectangle
// and in the tint colour inside it.
function createArrow(layer, guide, tint) {
    const group = svgElement('g', { class: 'flow-arrow-seed' });
    group.style.setProperty('--arrow-color', guide.style.getPropertyValue('--arrow-color'));
    const windows = [];
    const heads = [];
    let dashMask = null;
    if (guide.dataset.dashes) {
        const windowPath = svgElement('path', { d: guide.getAttribute('d'), class: 'flow-arrow-window' });
        dashMask = createMask(layer, windowPath);
        group.append(dashMask);
        windows.push(windowPath);
    }
    const addCopy = (parent) => {
        const line = svgElement('path', { class: 'flow-arrow-line' });
        if (dashMask) {
            line.setAttribute('d', guide.dataset.dashes);
            line.setAttribute('mask', `url(#${dashMask.id})`);
        } else {
            line.setAttribute('d', guide.getAttribute('d'));
            windows.push(line);
        }
        const head = svgElement('path', { d: HEAD, class: 'flow-arrow-head' });
        heads.push(head);
        parent.append(line, head);
    };
    if (tint) {
        // Inline styles, because page CSS resets clip-path inside scroll items.
        const plain = svgElement('g');
        plain.style.mask = `url(#${tint.outside})`;
        const tinted = svgElement('g');
        tinted.style.clipPath = `url(#${tint.inside})`;
        tinted.style.setProperty('--arrow-color', tint.color);
        addCopy(plain);
        addCopy(tinted);
        group.append(plain, tinted);
    } else {
        addCopy(group);
    }
    // Below the overlay (if any), unless the arrow lies above it.
    const overlay = layer.querySelector('.flow-arrow-overlay');
    if (overlay && !('aboveOverlay' in guide.dataset)) overlay.before(group);
    else layer.append(group);
    const length = guide.getTotalLength();
    const trail = Math.min(length * 0.6, 150);
    const speed = SPEED * (Number(guide.dataset.speed) || 1);
    const maxTravel = Number(guide.dataset.maxTravel) || MAX_TRAVEL;
    const travel = Math.min(maxTravel, Math.max(MIN_TRAVEL, (length + trail) / speed * 1000));
    const size = Number(layer.style.getPropertyValue('--arrow-size')) || 1;
    // ms per drawing unit; `meet` (see schedule) gives the part up to the
    // meeting point a pace of its own.
    return { guide, windows, heads, group, length, trail, travel, size, start: 0, pace: travel / (length + trail), meet: null };
}

// Time after its start at which the head of `arrow` has travelled `distance`.
function timeAt(arrow, distance) {
    const { meet, pace } = arrow;
    if (!meet) return distance * pace;
    if (distance <= meet.distance) return distance / meet.distance * meet.time;
    return meet.time + (distance - meet.distance) * pace;
}

// Distance the head of `arrow` has travelled `time` after its start.
function distanceAt(arrow, time) {
    const { meet, pace } = arrow;
    if (!meet) return time / pace;
    if (time <= meet.time) return time / meet.time * meet.distance;
    return meet.distance + (time - meet.time) / pace;
}

// Distance along `arrow` to the point of its path closest to `point`.
function distanceTo(arrow, point) {
    let best = 0;
    let bestGap = Infinity;
    for (let at = 0; at <= arrow.length; at += 2) {
        const p = arrow.guide.getPointAtLength(at);
        const gap = Math.hypot(p.x - point.x, p.y - point.y);
        if (gap < bestGap) {
            bestGap = gap;
            best = at;
        }
    }
    return best;
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
        const headAt = (distance) => previous.start + timeAt(previous, distance);
        if (at === 'pass') {
            arrow.start = headAt(distanceTo(previous, arrow.guide.getPointAtLength(0))) + (Number(delay) || 0);
        } else {
            arrow.start = (at === 'done' ? previous.start + previous.travel : headAt(previous.length)) + (Number(delay) || 0);
        }
        // data-meet "x y": reach that point together with the previous arrow's head.
        if (arrow.guide.dataset.meet) {
            const [x, y] = arrow.guide.dataset.meet.split(/\s+/).map(Number);
            const time = headAt(distanceTo(previous, { x, y })) - arrow.start;
            const distance = distanceTo(arrow, { x, y });
            if (time > 0 && distance > 0) {
                arrow.meet = { distance, time };
                arrow.travel = time + (arrow.length + arrow.trail - distance) * arrow.pace;
            }
        }
    });
    return Math.max(...arrows.map((arrow) => arrow.start + arrow.travel)) + PAUSE;
}

function placeHead(arrow, at) {
    const point = arrow.guide.getPointAtLength(at);
    const behind = arrow.guide.getPointAtLength(Math.max(0, at - 2));
    const angle = Math.atan2(point.y - behind.y, point.x - behind.x) * 180 / Math.PI;
    // Inline style, because the page resets the transform attribute of SVG elements.
    const transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg) scale(${arrow.size})`;
    arrow.heads.forEach((head) => { head.style.transform = transform; });
}

function drawArrow(arrow, time) {
    const elapsed = time - arrow.start;
    if (elapsed < 0 || elapsed >= arrow.travel) {
        arrow.group.style.opacity = 0;
        return;
    }
    const travelled = distanceAt(arrow, elapsed);
    const front = Math.min(travelled, arrow.length);
    const back = Math.max(0, travelled - arrow.trail);
    const fadeIn = Math.min(1, travelled / (arrow.trail * 0.25));
    const fadeOut = Math.min(1, (arrow.length - back) / arrow.trail);
    arrow.group.style.opacity = Math.min(fadeIn, fadeOut);
    arrow.windows.forEach((window) => {
        window.style.strokeDasharray = `${front - back} ${arrow.length + arrow.trail}`;
        window.style.strokeDashoffset = -back;
    });
    placeHead(arrow, front);
}

function setupLayer(layer, reduceMotion) {
    const guides = [...layer.querySelectorAll('.flow-arrow-guide')]
        .filter((guide) => guide.getTotalLength() > 0);
    const tint = createTint(layer);
    const arrows = guides.map((guide) => createArrow(layer, guide, tint));
    if (reduceMotion) {
        arrows.forEach((arrow) => placeHead(arrow, arrow.length));
        return null;
    }
    return { arrows, round: schedule(arrows), time: 0, last: null };
}

// data-playback-speed on the layer (the "Speed adjustment" slider) slows the
// whole sequence down, so the timing between the arrows stays the same.
function advance(layer, sequence, now) {
    const speed = Number(layer.dataset.playbackSpeed) || 1;
    if (sequence.last !== null) sequence.time = (sequence.time + (now - sequence.last) * speed) % sequence.round;
    sequence.last = now;
    return sequence.time;
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
            const time = advance(layer, sequence, now);
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
                if (!visible.has(entry.target)) Object.assign(sequences.get(entry.target), { time: 0, last: null });
                visible.add(entry.target);
            });
            start();
        });
        layers.forEach((layer) => observer.observe(layer));
    }
    start();
}
