import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const sourceRoot = process.argv[2] || 'C:/Users/LuisaF/Desktop/Aorten/Aneurysm/0021_H_AO_MFS';
const outputRoot = process.argv[3] || 'assets';

const modelSource = path.join(sourceRoot, 'Models', '0129_0000.vtp');
const imageSource = path.join(sourceRoot, 'Images', 'OSMSC0129-cm.vti');
const modelTarget = path.join(outputRoot, 'models', 'alex_aneurysm_aorta_0021.glb');
const axialTarget = path.join(outputRoot, 'story_images', 'alex_ct_axial_0021.png');
const coronalTarget = path.join(outputRoot, 'story_images', 'alex_ct_coronal_0021.png');

function align4(value) {
    return (value + 3) & ~3;
}

function padded(buffer, padByte = 0) {
    const targetLength = align4(buffer.length);
    if (targetLength === buffer.length) return buffer;
    return Buffer.concat([buffer, Buffer.alloc(targetLength - buffer.length, padByte)]);
}

function extractAppendedBase64(xml) {
    const startMarker = '<AppendedData encoding="base64">';
    const endMarker = '</AppendedData>';
    const start = xml.indexOf(startMarker);
    const end = xml.indexOf(endMarker, start);
    if (start === -1 || end === -1) throw new Error('Missing VTK appended data');
    const compact = xml.slice(start + startMarker.length, end).replace(/\s/g, '');
    const base64 = compact.startsWith('_') ? compact.slice(1) : compact;
    return base64;
}

function findNextOffset(xml, offset) {
    const offsets = [...xml.matchAll(/offset="(\d+)"/g)]
        .map((match) => Number(match[1]))
        .filter((value) => value > offset)
        .sort((a, b) => a - b);
    return offsets[0] ?? null;
}

function inflateVtkBlock(appendedBase64, offset, nextOffset = null) {
    const segment = nextOffset === null
        ? appendedBase64.slice(offset)
        : appendedBase64.slice(offset, nextOffset);
    const headerProbe = Buffer.from(segment, 'base64');
    const numberOfBlocks = headerProbe.readUInt32LE(0);
    const headerByteLength = (3 + numberOfBlocks) * 4;
    const headerCharLength = Math.ceil(headerByteLength / 3) * 4;
    const header = Buffer.from(segment.slice(0, headerCharLength), 'base64');
    const blockSize = header.readUInt32LE(4);
    const lastBlockSize = header.readUInt32LE(8);
    const compressedSizes = [];
    for (let index = 0; index < numberOfBlocks; index += 1) {
        compressedSizes.push(header.readUInt32LE(12 + index * 4));
    }

    const compressedPayload = Buffer.from(segment.slice(headerCharLength), 'base64');
    let cursor = 0;
    const blocks = compressedSizes.map((size, index) => {
        const compressed = compressedPayload.subarray(cursor, cursor + size);
        cursor += size;
        let inflated;
        try {
            inflated = zlib.inflateSync(compressed);
        } catch (error) {
            throw new Error(`Could not inflate VTK block at offset ${offset}, block ${index + 1}/${numberOfBlocks}, segment chars ${segment.length}, compressed ${compressed.length}/${size}, cursor ${cursor}: ${error.message}`);
        }
        const expected = index === numberOfBlocks - 1 ? lastBlockSize : blockSize;
        return inflated.subarray(0, expected);
    });
    return Buffer.concat(blocks);
}

function findDataArrayOffset(xml, sectionName, arrayName) {
    const sectionPattern = new RegExp(`<${sectionName}>[\\s\\S]*?<DataArray[^>]*Name="${arrayName}"[^>]*offset="(\\d+)"`, 'm');
    const match = xml.match(sectionPattern);
    if (!match) throw new Error(`Could not find ${sectionName}/${arrayName}`);
    return Number(match[1]);
}

function readInt64Numbers(buffer) {
    const count = Math.floor(buffer.length / 8);
    const values = new Array(count);
    for (let index = 0; index < count; index += 1) {
        values[index] = Number(buffer.readBigInt64LE(index * 8));
    }
    return values;
}

function triangulate(connectivity, offsets) {
    const indices = [];
    let start = 0;
    offsets.forEach((end) => {
        const vertexCount = end - start;
        for (let local = 1; local < vertexCount - 1; local += 1) {
            indices.push(connectivity[start], connectivity[start + local], connectivity[start + local + 1]);
        }
        start = end;
    });
    return new Uint32Array(indices);
}

function computeNormals(positions, indices) {
    const normals = new Float32Array(positions.length);
    for (let index = 0; index < indices.length; index += 3) {
        const ia = indices[index] * 3;
        const ib = indices[index + 1] * 3;
        const ic = indices[index + 2] * 3;
        const ax = positions[ia];
        const ay = positions[ia + 1];
        const az = positions[ia + 2];
        const bx = positions[ib];
        const by = positions[ib + 1];
        const bz = positions[ib + 2];
        const cx = positions[ic];
        const cy = positions[ic + 1];
        const cz = positions[ic + 2];
        const abx = bx - ax;
        const aby = by - ay;
        const abz = bz - az;
        const acx = cx - ax;
        const acy = cy - ay;
        const acz = cz - az;
        const nx = aby * acz - abz * acy;
        const ny = abz * acx - abx * acz;
        const nz = abx * acy - aby * acx;
        [ia, ib, ic].forEach((vertex) => {
            normals[vertex] += nx;
            normals[vertex + 1] += ny;
            normals[vertex + 2] += nz;
        });
    }
    for (let index = 0; index < normals.length; index += 3) {
        const nx = normals[index];
        const ny = normals[index + 1];
        const nz = normals[index + 2];
        const length = Math.hypot(nx, ny, nz) || 1;
        normals[index] = nx / length;
        normals[index + 1] = ny / length;
        normals[index + 2] = nz / length;
    }
    return normals;
}

function floatBuffer(view) {
    return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
}

function accessorMinMax(positions) {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let index = 0; index < positions.length; index += 3) {
        for (let axis = 0; axis < 3; axis += 1) {
            const value = positions[index + axis];
            min[axis] = Math.min(min[axis], value);
            max[axis] = Math.max(max[axis], value);
        }
    }
    return { min, max };
}

function writeGlb(target, positions, normals, indices) {
    const buffers = [floatBuffer(positions), floatBuffer(normals), Buffer.from(indices.buffer)];
    let byteOffset = 0;
    const bufferViews = buffers.map((source, index) => {
        const view = {
            buffer: 0,
            byteOffset,
            byteLength: source.length,
            target: index === 2 ? 34963 : 34962
        };
        byteOffset += align4(source.length);
        return view;
    });
    const bin = Buffer.concat(buffers.map(padded));
    const { min, max } = accessorMinMax(positions);
    const gltf = {
        asset: { version: '2.0', generator: 'ScrollytellingBuilder VTP exporter' },
        scenes: [{ nodes: [0] }],
        scene: 0,
        nodes: [{ mesh: 0, name: 'VMR_0021_Aneurysm_Aorta' }],
        meshes: [{
            primitives: [{
                attributes: { POSITION: 0, NORMAL: 1 },
                indices: 2,
                material: 0
            }]
        }],
        materials: [{
            name: 'Aorta_Red',
            pbrMetallicRoughness: {
                baseColorFactor: [0.72, 0.08, 0.14, 1],
                roughnessFactor: 0.52,
                metallicFactor: 0.02
            }
        }],
        buffers: [{ byteLength: bin.length }],
        bufferViews,
        accessors: [
            { bufferView: 0, componentType: 5126, count: positions.length / 3, type: 'VEC3', min, max },
            { bufferView: 1, componentType: 5126, count: normals.length / 3, type: 'VEC3' },
            { bufferView: 2, componentType: 5125, count: indices.length, type: 'SCALAR' }
        ]
    };

    const json = padded(Buffer.from(JSON.stringify(gltf)), 0x20);
    const totalLength = 12 + 8 + json.length + 8 + bin.length;
    const header = Buffer.alloc(12);
    header.writeUInt32LE(0x46546c67, 0);
    header.writeUInt32LE(2, 4);
    header.writeUInt32LE(totalLength, 8);
    const jsonHeader = Buffer.alloc(8);
    jsonHeader.writeUInt32LE(json.length, 0);
    jsonHeader.writeUInt32LE(0x4e4f534a, 4);
    const binHeader = Buffer.alloc(8);
    binHeader.writeUInt32LE(bin.length, 0);
    binHeader.writeUInt32LE(0x004e4942, 4);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.concat([header, jsonHeader, json, binHeader, bin]));
}

function exportModel() {
    const xml = fs.readFileSync(modelSource, 'utf8');
    const appended = extractAppendedBase64(xml);
    const pointsOffset = findDataArrayOffset(xml, 'Points', 'Points');
    const polysStart = xml.indexOf('<Polys>');
    const polysEnd = xml.indexOf('</Polys>', polysStart);
    const polysXml = xml.slice(polysStart, polysEnd);
    const connectivityOffset = Number(polysXml.match(/Name="connectivity"[^>]*offset="(\d+)"/)[1]);
    const offsetsOffset = Number(polysXml.match(/Name="offsets"[^>]*offset="(\d+)"/)[1]);

    const pointsBuffer = inflateVtkBlock(appended, pointsOffset, findNextOffset(xml, pointsOffset));
    const positions = new Float32Array(
        pointsBuffer.buffer,
        pointsBuffer.byteOffset,
        pointsBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
    );
    const connectivity = readInt64Numbers(inflateVtkBlock(appended, connectivityOffset, findNextOffset(xml, connectivityOffset)));
    const offsets = readInt64Numbers(inflateVtkBlock(appended, offsetsOffset, findNextOffset(xml, offsetsOffset)));
    const indices = triangulate(connectivity, offsets);
    const normals = computeNormals(positions, indices);
    writeGlb(modelTarget, positions, normals, indices);
    console.log(`Wrote ${modelTarget} (${positions.length / 3} points, ${indices.length / 3} triangles)`);
}

function crc32(buffer) {
    let crc = ~0;
    for (const byte of buffer) {
        crc ^= byte;
        for (let bit = 0; bit < 8; bit += 1) {
            crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
        }
    }
    return ~crc >>> 0;
}

function pngChunk(type, data) {
    const typeBuffer = Buffer.from(type);
    const chunk = Buffer.concat([typeBuffer, data]);
    const output = Buffer.alloc(12 + data.length);
    output.writeUInt32BE(data.length, 0);
    typeBuffer.copy(output, 4);
    data.copy(output, 8);
    output.writeUInt32BE(crc32(chunk), 8 + data.length);
    return output;
}

function writeGrayscalePng(target, width, height, pixels) {
    const raw = Buffer.alloc((width + 1) * height);
    for (let y = 0; y < height; y += 1) {
        raw[y * (width + 1)] = 0;
        pixels.copy(raw, y * (width + 1) + 1, y * width, (y + 1) * width);
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 0;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        pngChunk('IHDR', ihdr),
        pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
        pngChunk('IEND', Buffer.alloc(0))
    ]));
}

function windowValue(value, level = 180, width = 700) {
    const low = level - width / 2;
    return Math.max(0, Math.min(255, Math.round(((value - low) / width) * 255)));
}

function exportCtImages() {
    const xml = fs.readFileSync(imageSource, 'utf8');
    const appended = extractAppendedBase64(xml);
    const offset = Number(xml.match(/Name="ImageScalars"[^>]*offset="(\d+)"/)[1]);
    const extent = xml.match(/WholeExtent="(\d+) (\d+) (\d+) (\d+) (\d+) (\d+)"/).slice(1).map(Number);
    const nx = extent[1] - extent[0] + 1;
    const ny = extent[3] - extent[2] + 1;
    const nz = extent[5] - extent[4] + 1;
    const volume = inflateVtkBlock(appended, offset, findNextOffset(xml, offset));

    const axialIndex = Math.round(nz * 0.33);
    const axial = Buffer.alloc(nx * ny);
    for (let y = 0; y < ny; y += 1) {
        for (let x = 0; x < nx; x += 1) {
            const source = ((axialIndex * ny + (ny - 1 - y)) * nx + x) * 2;
            axial[y * nx + x] = windowValue(volume.readInt16LE(source));
        }
    }
    writeGrayscalePng(axialTarget, nx, ny, axial);

    const coronalIndex = Math.round(ny * 0.62);
    const coronalScale = 2;
    const coronalHeight = nz * coronalScale;
    const coronal = Buffer.alloc(nx * coronalHeight);
    for (let z = 0; z < nz; z += 1) {
        for (let repeat = 0; repeat < coronalScale; repeat += 1) {
            const targetY = (nz - 1 - z) * coronalScale + repeat;
            for (let x = 0; x < nx; x += 1) {
                const source = ((z * ny + coronalIndex) * nx + x) * 2;
                coronal[targetY * nx + x] = windowValue(volume.readInt16LE(source));
            }
        }
    }
    writeGrayscalePng(coronalTarget, nx, coronalHeight, coronal);
    console.log(`Wrote ${axialTarget} and ${coronalTarget} from ${nx}x${ny}x${nz} CT volume`);
}

exportModel();
exportCtImages();
