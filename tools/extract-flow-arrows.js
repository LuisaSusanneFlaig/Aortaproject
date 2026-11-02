// Turns a Figma SVG export of a flow drawing (frame with the drawing and its
// arrows) into a data module for js/modules/ui/flowArrows.js.
//
// Figma exports every arrow as the outline of its stroke: two parallel sides,
// a cap and a separate head. The tool pairs each side segment with its
// partner on the other side and averages them, which gives the centre line
// the animation grows along. The head is drawn again by the animation.
//
// Usage: node tools/extract-flow-arrows.js <figma.svg> <out.js> <exportName>
import { readFile, writeFile } from 'node:fs/promises';

const MIN_SEGMENT = 1.5; // side pieces shorter than this are caps and joints
const PAIR_TOLERANCE = 3.2; // the sides of a 2 px stroke lie about 2 px apart
const CHAIN_TOLERANCE = 2;

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const average = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function parsePath(d) {
    const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g);
    const subpaths = [];
    let current = [0, 0];
    let start = [0, 0];
    let command = '';
    let index = 0;
    const number = () => Number(tokens[index++]);
    const point = () => [number(), number()];
    while (index < tokens.length) {
        if (/[a-zA-Z]/.test(tokens[index])) command = tokens[index++];
        if (command !== command.toUpperCase()) throw new Error(`Relative command "${command}" is not supported`);
        const segments = subpaths.at(-1);
        if (command === 'M') {
            current = start = point();
            subpaths.push([]);
            command = 'L';
        } else if (command === 'L' || command === 'H' || command === 'V') {
            const next = command === 'L' ? point() : command === 'H' ? [number(), current[1]] : [current[0], number()];
            segments.push({ type: 'L', p0: current, p1: next });
            current = next;
        } else if (command === 'C') {
            const c1 = point();
            const c2 = point();
            const next = point();
            segments.push({ type: 'C', p0: current, c1, c2, p1: next });
            current = next;
        } else if (command === 'Z') {
            current = start;
        } else {
            throw new Error(`Command "${command}" is not supported`);
        }
    }
    return subpaths;
}

const reverse = (segment) => segment.type === 'C'
    ? { type: 'C', p0: segment.p1, c1: segment.c2, c2: segment.c1, p1: segment.p0 }
    : { type: 'L', p0: segment.p1, p1: segment.p0 };

function centreSegments(sides) {
    const used = new Set();
    const centres = [];
    sides.forEach((side, sideIndex) => {
        if (used.has(sideIndex)) return;
        let best = -1;
        let bestScore = Infinity;
        sides.forEach((other, otherIndex) => {
            if (otherIndex === sideIndex || used.has(otherIndex) || other.type !== side.type) return;
            const startGap = distance(side.p0, other.p1);
            const endGap = distance(side.p1, other.p0);
            if (startGap > PAIR_TOLERANCE || endGap > PAIR_TOLERANCE) return;
            if (startGap + endGap < bestScore) {
                bestScore = startGap + endGap;
                best = otherIndex;
            }
        });
        if (best === -1) return;
        used.add(sideIndex).add(best);
        const partner = reverse(sides[best]);
        centres.push(side.type === 'C'
            ? { type: 'C', p0: average(side.p0, partner.p0), c1: average(side.c1, partner.c1), c2: average(side.c2, partner.c2), p1: average(side.p1, partner.p1) }
            : { type: 'L', p0: average(side.p0, partner.p0), p1: average(side.p1, partner.p1) });
    });
    return centres;
}

const startTangent = (segment) => {
    const towards = segment.type === 'C' && distance(segment.p0, segment.c1) > 0.01 ? segment.c1 : segment.p1;
    const length = distance(segment.p0, towards) || 1;
    return [(towards[0] - segment.p0[0]) / length, (towards[1] - segment.p0[1]) / length];
};
const endTangent = (segment) => {
    const reversed = startTangent(reverse(segment));
    return [-reversed[0], -reversed[1]];
};

// Orders the centre pieces from the tail to the head. The walk starts at the
// head, which the arrowhead marks reliably, and is reversed at the end. Where
// the line crosses itself, the piece that continues the current direction is
// taken. A dashed arrow has gaps; the next dash is the nearest remaining piece
// and is marked with `gapBefore`.
function chain(centres, tip) {
    const ends = centres.flatMap((segment) => [segment.p0, segment.p1]);
    const remaining = [...centres];
    const ordered = [];
    let position = ends.sort((a, b) => distance(a, tip) - distance(b, tip))[0];
    let direction = null;
    while (remaining.length) {
        let candidates = remaining.flatMap((segment) => [
            distance(segment.p0, position) < CHAIN_TOLERANCE ? { segment, oriented: segment } : null,
            distance(segment.p1, position) < CHAIN_TOLERANCE ? { segment, oriented: reverse(segment) } : null
        ]).filter(Boolean);
        let gapBefore = false;
        if (!candidates.length) {
            const nearest = remaining.flatMap((segment) => [
                { segment, oriented: segment, gap: distance(segment.p0, position) },
                { segment, oriented: reverse(segment), gap: distance(segment.p1, position) }
            ]).sort((a, b) => a.gap - b.gap)[0];
            candidates = [nearest];
            gapBefore = true;
        }
        // Without a direction yet (the first piece), the nearest piece wins.
        const alignment = ({ oriented }) => {
            if (!direction) return -distance(oriented.p0, position);
            const next = startTangent(oriented);
            return direction[0] * next[0] + direction[1] * next[1];
        };
        const { segment, oriented } = candidates.sort((a, b) => alignment(b) - alignment(a))[0];
        remaining.splice(remaining.indexOf(segment), 1);
        ordered.push({ ...oriented, gapBefore });
        position = oriented.p1;
        direction = endTangent(oriented);
    }
    // Head-first to tail-first; a gap before piece i lies after it once reversed.
    return ordered.map((segment, index) => ({
        ...reverse(segment),
        gapBefore: ordered[index + 1]?.gapBefore || false
    })).reverse();
}

const format = (point) => point.map((value) => Number(value.toFixed(1))).join(' ');

// `bridgeGaps` joins the dashes of a dashed arrow with straight lines (the
// guide the animation grows along); otherwise each dash starts a subpath.
function toPathData(segments, bridgeGaps = true) {
    return `M${format(segments[0].p0)} ${segments.map((segment) => {
        const start = segment.gapBefore ? `${bridgeGaps ? 'L' : 'M'}${format(segment.p0)} ` : '';
        return start + (segment.type === 'C'
            ? `C${format(segment.c1)} ${format(segment.c2)} ${format(segment.p1)}`
            : `L${format(segment.p1)}`);
    }).join(' ')}`;
}

async function main() {
    const [input, output, exportName] = process.argv.slice(2);
    if (!input || !output || !exportName) {
        console.error('Usage: node tools/extract-flow-arrows.js <figma.svg> <out.js> <exportName>');
        process.exit(1);
    }
    const svg = await readFile(input, 'utf8');
    // The arrows are placed over the drawing: the rect filled with the image
    // (it can sit inside the frame, for example to leave room for a shadow).
    const [, width, height] = svg.match(/<svg[^>]*viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const imageRect = svg.match(/<rect([^>]*)fill="url\(#pattern/)?.[1] || '';
    const rectValue = (name, fallback) => imageRect.match(new RegExp(`\\b${name}="([\\d.]+)"`))?.[1] || fallback;
    const viewBox = [rectValue('x', 0), rectValue('y', 0), rectValue('width', width), rectValue('height', height)].join(' ');
    const arrows = [...svg.matchAll(/<path d="([^"]+)" fill="([^"]+)"/g)].map(([, d, fill]) => {
        const subpaths = parsePath(d);
        const head = subpaths.pop();
        const sides = subpaths.flat().filter((segment) => distance(segment.p0, segment.p1) > MIN_SEGMENT);
        const tip = head[0].p0;
        const centreLine = chain(centreSegments(sides), tip);
        const dashed = centreLine.some((segment) => segment.gapBefore);
        return {
            d: toPathData(centreLine),
            dashes: dashed ? toPathData(centreLine, false) : null,
            color: fill === 'white' ? '#ffffff' : fill.toLowerCase()
        };
    });
    const lines = arrows.map(({ d, dashes, color }) => `        { color: '${color}', d: '${d}'${dashes ? `,\n          dashes: '${dashes}'` : ''} }`).join(',\n');
    await writeFile(output, `// Generated by tools/extract-flow-arrows.js from a Figma export; do not edit by hand.
// Centre lines of the hand-drawn arrows in the coordinates of the drawing.
export const ${exportName} = {
    viewBox: '${viewBox}',
    arrows: [
${lines}
    ]
};
`);
    console.log(`Wrote ${arrows.length} arrows to ${output}`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
