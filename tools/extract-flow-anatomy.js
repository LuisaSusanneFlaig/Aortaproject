import fs from 'node:fs';
import { MeshoptDecoder } from '../vendor/three/addons/libs/meshopt_decoder.module.js';

// Extract only vessel-wall accessors, since the optimized exports share large
// compressed buffer views with the animation. Keep source materials and transforms.
await MeshoptDecoder.ready;
for (const name of ['aneurysm', 'dissection']) {
    const input = fs.readFileSync(`assets/models/flow/optimized/${name}_lines_anim.glb`);
    const jsonLength = input.readUInt32LE(12);
    const source = JSON.parse(input.subarray(20, 20 + jsonLength));
    const binary = input.subarray(28 + jsonLength);
    const wallNodes = source.nodes.filter(node => node.mesh !== undefined &&
        source.meshes[node.mesh].primitives.every(primitive =>
            source.materials[primitive.material]?.pbrMetallicRoughness?.baseColorFactor?.[3] <= 0.3));
    if (wallNodes.length !== 1) throw new Error(`Expected one wall mesh in ${name}`);
    const node = structuredClone(wallNodes[0]);
    if (!source.scenes[source.scene || 0].nodes.includes(source.nodes.indexOf(wallNodes[0]))) {
        throw new Error('Wall transform must be at scene root');
    }
    const mesh = structuredClone(source.meshes[node.mesh]);
    const output = { asset: { version: '2.0' }, scene: 0, scenes: [{ nodes: [0] }],
        nodes: [{ ...node, mesh: 0 }], meshes: [mesh], materials: source.materials,
        accessors: [], bufferViews: [], buffers: [],
        extensionsUsed: ['KHR_mesh_quantization'], extensionsRequired: ['KHR_mesh_quantization'] };
    const decoded = new Map();
    const remapped = new Map();
    const chunks = [];
    let offset = 0;
    const copyAccessor = index => {
        if (remapped.has(index)) return remapped.get(index);
        const accessor = source.accessors[index];
        const view = source.bufferViews[accessor.bufferView];
        if (!decoded.has(accessor.bufferView)) {
            const ext = view.extensions?.EXT_meshopt_compression;
            if (!ext) throw new Error('Expected meshopt source data');
            const bytes = new Uint8Array(ext.count * ext.byteStride);
            MeshoptDecoder.decodeGltfBuffer(bytes, ext.count, ext.byteStride,
                binary.subarray(ext.byteOffset, ext.byteOffset + ext.byteLength), ext.mode, ext.filter);
            decoded.set(accessor.bufferView, bytes);
        }
        const componentSize = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 }[accessor.componentType];
        const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type];
        const stride = view.byteStride || componentSize * components;
        const start = accessor.byteOffset || 0;
        const data = Buffer.from(decoded.get(accessor.bufferView).subarray(start, start + accessor.count * stride));
        const next = output.accessors.length;
        output.accessors.push({ ...accessor, bufferView: output.bufferViews.length, byteOffset: 0 });
        output.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: data.length,
            ...(view.byteStride ? { byteStride: view.byteStride } : {}), target: view.target });
        const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4);
        data.copy(padded); chunks.push(padded); offset += padded.length;
        remapped.set(index, next);
        return next;
    };
    for (const primitive of mesh.primitives) {
        primitive.attributes = Object.fromEntries(Object.entries(primitive.attributes).map(([key, index]) => [key, copyAccessor(index)]));
        primitive.indices = copyAccessor(primitive.indices);
    }
    output.buffers = [{ byteLength: offset }];
    const json = Buffer.from(JSON.stringify(output));
    const paddedJson = Buffer.alloc(Math.ceil(json.length / 4) * 4, 32); json.copy(paddedJson);
    const header = Buffer.alloc(20);
    header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4);
    header.writeUInt32LE(28 + paddedJson.length + offset, 8);
    header.writeUInt32LE(paddedJson.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
    const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(offset, 0); binHeader.writeUInt32LE(0x004e4942, 4);
    const result = Buffer.concat([header, paddedJson, binHeader, ...chunks]);
    fs.writeFileSync(`assets/models/flow/optimized/${name}_anatomy.glb`, result);
    console.log(`${name}: ${input.length} -> ${result.length} bytes; wall only, no animations`);
}
