// Loader for FlowVisAnalyzer streakline-particle .glb exports ("Points" representation).
//
// No dependencies. Returns plain typed arrays, so the result can be fed to any WebGL renderer (see
// viewer.html for a raw WebGL2 example). Deliberately a classic script rather than an ES module, so it
// also works from file:// (browsers block module imports there):
//   browser:  <script src="flowvis-glb-loader.js"></script>  ->  window.FlowVisGlbLoader.loadFlowVisGlb(...)
//   Node / bundlers:  const { loadFlowVisGlb } = require('./flowvis-glb-loader.js');
//
// What the file contains:
//   - Particles: ONE glTF POINTS primitive. Frame 0 positions are its POSITION attribute; frames 1..N-1
//     are morph targets, driven by a STEP-interpolated `weights` animation (one-hot per frame).
//   - Per-frame particle colours: NOT a glTF feature. A palette index per (frame, point) is stored in a
//     bufferView described by json.extras.FLOWVIS_particle_colors. The geometry's COLOR_0 is only frame 0.
//   - Optional: other (static) triangle meshes such as the vessel surface.

(function () {
'use strict';

const GLB_MAGIC = 0x46546c67, CHUNK_JSON = 0x4e4f534a, CHUNK_BIN = 0x004e4942;
const COMPONENTS = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
const TYPED = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
const NORMALIZE_DIVISOR = { 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 };

function parseGlbContainer(arrayBuffer) {
    const dv = new DataView(arrayBuffer);
    if (dv.getUint32(0, true) !== GLB_MAGIC) throw new Error('Not a .glb file');
    let json = null, bin = null, offset = 12;
    while (offset + 8 <= arrayBuffer.byteLength) {
        const length = dv.getUint32(offset, true), type = dv.getUint32(offset + 4, true);
        if (type === CHUNK_JSON) json = JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer, offset + 8, length)));
        else if (type === CHUNK_BIN) bin = new Uint8Array(arrayBuffer, offset + 8, length);
        offset += 8 + ((length + 3) & ~3);
    }
    return { json, bin };
}

/** Reads an accessor into a tightly packed typed array (copies; honours byteStride and `normalized`). */
function readAccessor(json, bin, index) {
    const acc = json.accessors[index];
    if (acc.sparse) throw new Error('Sparse accessors are not supported by this example loader');
    const n = COMPONENTS[acc.type], Typed = TYPED[acc.componentType];
    const view = json.bufferViews[acc.bufferView];
    const elemBytes = n * Typed.BYTES_PER_ELEMENT;
    const stride = view.byteStride || elemBytes;
    const start = bin.byteOffset + (view.byteOffset || 0) + (acc.byteOffset || 0);
    let out;
    if (stride === elemBytes && start % Typed.BYTES_PER_ELEMENT === 0) {
        out = new Typed(bin.buffer.slice(start, start + acc.count * elemBytes));
    } else {
        out = new Typed(acc.count * n);
        for (let i = 0; i < acc.count; i++) out.set(new Typed(bin.buffer.slice(start + i * stride, start + i * stride + elemBytes)), i * n);
    }
    if (acc.normalized && NORMALIZE_DIVISOR[acc.componentType]) {
        const d = NORMALIZE_DIVISOR[acc.componentType];
        out = Float32Array.from(out, v => Math.max(v / d, -1));
    }
    return out;
}

// --- minimal column-major mat4 helpers for node transforms ---
function mat4FromTRS(t = [0, 0, 0], r = [0, 0, 0, 1], s = [1, 1, 1]) {
    const [x, y, z, w] = r;
    return [
        (1 - 2 * (y * y + z * z)) * s[0], 2 * (x * y + z * w) * s[0], 2 * (x * z - y * w) * s[0], 0,
        2 * (x * y - z * w) * s[1], (1 - 2 * (x * x + z * z)) * s[1], 2 * (y * z + x * w) * s[1], 0,
        2 * (x * z + y * w) * s[2], 2 * (y * z - x * w) * s[2], (1 - 2 * (x * x + y * y)) * s[2], 0,
        t[0], t[1], t[2], 1
    ];
}
function mat4Mul(a, b) {
    const o = new Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
        o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
}

/** Every node that carries a mesh, with its world matrix (the scene graph is usually flat, but not guaranteed). */
function collectMeshNodes(json) {
    const out = [];
    const visit = (i, parent) => {
        const node = json.nodes[i];
        const world = mat4Mul(parent, node.matrix || mat4FromTRS(node.translation, node.rotation, node.scale));
        if (node.mesh !== undefined) out.push({ nodeIndex: i, node, world });
        for (const c of node.children || []) visit(c, world);
    };
    const identity = mat4FromTRS();
    const scene = json.scenes[json.scene ?? 0];
    for (const root of scene.nodes) visit(root, identity);
    return out;
}

/**
 * @param {ArrayBuffer} arrayBuffer  the raw .glb
 * @returns {{ json, surfaces: Array, particles: object|null }}
 */
function loadFlowVisGlb(arrayBuffer) {
    const { json, bin } = parseGlbContainer(arrayBuffer);
    const table = json.extras && json.extras.FLOWVIS_particle_colors;
    const meshNodes = collectMeshNodes(json);

    const surfaces = [];
    let particles = null;

    for (const { nodeIndex, node, world } of meshNodes) {
        for (const prim of json.meshes[node.mesh].primitives) {
            const mode = prim.mode ?? 4;
            const isParticleCloud = mode === 0 && prim.targets && (!table || !table.meshName || table.meshName === node.name);
            if (isParticleCloud && !particles) {
                particles = buildParticles(json, bin, prim, nodeIndex, node, world, table);
            } else if (mode === 4) {
                const mat = json.materials?.[prim.material]?.pbrMetallicRoughness;
                surfaces.push({
                    name: node.name || json.meshes[node.mesh].name || `mesh_${node.mesh}`,
                    world,
                    positions: readAccessor(json, bin, prim.attributes.POSITION),
                    normals: prim.attributes.NORMAL !== undefined ? readAccessor(json, bin, prim.attributes.NORMAL) : null,
                    colors: prim.attributes.COLOR_0 !== undefined ? readAccessor(json, bin, prim.attributes.COLOR_0) : null,
                    colorComponents: prim.attributes.COLOR_0 !== undefined ? COMPONENTS[json.accessors[prim.attributes.COLOR_0].type] : 0,
                    // Indices may be Uint32 — needs WebGL2 (or OES_element_index_uint in WebGL1).
                    indices: prim.indices !== undefined ? readAccessor(json, bin, prim.indices) : null,
                    baseColor: mat?.baseColorFactor || [1, 1, 1, 1]
                });
            }
        }
    }
    return { json, surfaces, particles };
}

function buildParticles(json, bin, prim, nodeIndex, node, world, table) {
    const base = readAccessor(json, bin, prim.attributes.POSITION);
    const pointCount = base.length / 3;
    // glTF morph targets are DISPLACEMENTS from the base, not absolute positions.
    const targets = prim.targets.map(t => readAccessor(json, bin, t.POSITION));

    // The weights animation: STEP sampler, keyframe k -> weight vector k (targets.length floats each).
    let keyTimes = null, keyWeights = null;
    for (const anim of json.animations || []) {
        const ch = anim.channels.find(c => c.target.node === nodeIndex && c.target.path === 'weights');
        if (!ch) continue;
        const s = anim.samplers[ch.sampler];
        keyTimes = readAccessor(json, bin, s.input);
        keyWeights = readAccessor(json, bin, s.output);
        break;
    }
    if (!keyTimes) throw new Error('Particle cloud has morph targets but no weights animation');
    const frameCount = keyTimes.length;

    let indices = null;
    if (table) {
        if (table.pointCount !== pointCount || table.frameCount !== frameCount) {
            throw new Error(`Colour table (${table.pointCount} pts x ${table.frameCount} frames) does not match geometry (${pointCount} x ${frameCount})`);
        }
        const view = json.bufferViews[table.bufferView];
        indices = new Uint8Array(bin.buffer, bin.byteOffset + (view.byteOffset || 0), view.byteLength);
    }
    // Without a table (older export, or a stock-viewer-only file) the frame-0 COLOR_0 is all we have.
    const staticColor = prim.attributes.COLOR_0 !== undefined ? readAccessor(json, bin, prim.attributes.COLOR_0) : null;
    // Use the table's times when present (they start at exactly 0; the animation input may be off by float noise).
    const times = table ? Float32Array.from(table.times) : keyTimes;
    const duration = times[frameCount - 1];

    return {
        name: node.name,
        world,
        pointCount,
        frameCount,
        times,
        duration,
        field: table?.field ?? null,
        labels: table?.labels ?? null,
        palette: table?.palette ?? null,   // flat sRGB 0-255 triples
        deadIndex: table?.deadIndex ?? 255,

        /** Frame to show at time t (seconds). STEP interpolation: last keyframe at or before t; loops. */
        frameAt(t) {
            t = ((t % duration) + duration) % duration;
            let lo = 0, hi = frameCount - 1;
            while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (times[mid] <= t) lo = mid; else hi = mid - 1; }
            return lo;
        },

        /** Absolute positions (in the node's local space; apply `world`) for one frame. */
        positionsAt(frame, out = new Float32Array(pointCount * 3)) {
            out.set(base);
            const w0 = frame * targets.length;
            for (let k = 0; k < targets.length; k++) {
                const w = keyWeights[w0 + k];
                if (w === 0) continue;
                const d = targets[k];
                for (let i = 0; i < out.length; i++) out[i] += w * d[i];
            }
            return out;
        },

        /**
         * RGBA bytes for one frame. A = 0 means "particle not alive at this frame": dead points are parked at
         * their seed position in the geometry, so they MUST be hidden (discard / skip), not just drawn black.
         * RGB is sRGB, i.e. display-ready; convert to linear if your renderer does colour management.
         */
        colorsAt(frame, out = new Uint8Array(pointCount * 4)) {
            if (!indices) {
                for (let p = 0; p < pointCount; p++) {
                    for (let c = 0; c < 3; c++) out[p * 4 + c] = staticColor ? Math.round(staticColor[p * 3 + c] * 255) : 255;
                    out[p * 4 + 3] = 255;
                }
                return out;
            }
            const row = frame * pointCount, pal = table.palette, dead = table.deadIndex;
            for (let p = 0; p < pointCount; p++) {
                const idx = indices[row + p];
                if (idx === dead) { out[p * 4 + 3] = 0; continue; }
                out[p * 4] = pal[idx * 3]; out[p * 4 + 1] = pal[idx * 3 + 1]; out[p * 4 + 2] = pal[idx * 3 + 2];
                out[p * 4 + 3] = 255;
            }
            return out;
        },

        /** Raw palette index per point (label fields: `labels[index]` is the segmentation label). */
        paletteIndicesAt(frame) {
            return indices ? indices.subarray(frame * pointCount, (frame + 1) * pointCount) : null;
        }
    };
}

const api = { loadFlowVisGlb, parseGlbContainer };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else globalThis.FlowVisGlbLoader = api;
})();
