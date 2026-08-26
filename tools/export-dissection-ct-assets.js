import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const imageSource = process.argv[2];
const axialTarget = process.argv[3] || 'assets/story_images/miriam_cta_axial_0246.png';
const coronalTarget = process.argv[4] || 'assets/story_images/miriam_cta_coronal_0246.png';

if (!imageSource) throw new Error('Usage: node tools/export-dissection-ct-assets.js <input.vti> [axial.png] [coronal.png]');

function extractAppendedBase64(xml) {
    const startMarker = '<AppendedData encoding="base64">';
    const start = xml.indexOf(startMarker);
    const end = xml.indexOf('</AppendedData>', start);
    if (start === -1 || end === -1) throw new Error('Missing VTK appended data');
    const compact = xml.slice(start + startMarker.length, end).replace(/\s/g, '');
    return compact.startsWith('_') ? compact.slice(1) : compact;
}

function findNextOffset(xml, offset) {
    return [...xml.matchAll(/offset="(\d+)"/g)]
        .map((match) => Number(match[1]))
        .filter((value) => value > offset)
        .sort((a, b) => a - b)[0] ?? null;
}

function inflateVtkBlock(appendedBase64, offset, nextOffset = null) {
    const segment = nextOffset === null ? appendedBase64.slice(offset) : appendedBase64.slice(offset, nextOffset);
    const probe = Buffer.from(segment, 'base64');
    const numberOfBlocks = probe.readUInt32LE(0);
    const headerByteLength = (3 + numberOfBlocks) * 4;
    const headerCharLength = Math.ceil(headerByteLength / 3) * 4;
    const header = Buffer.from(segment.slice(0, headerCharLength), 'base64');
    const blockSize = header.readUInt32LE(4);
    const lastBlockSize = header.readUInt32LE(8);
    const compressedSizes = Array.from({ length: numberOfBlocks }, (_, index) => header.readUInt32LE(12 + index * 4));
    const payload = Buffer.from(segment.slice(headerCharLength), 'base64');
    let cursor = 0;
    return Buffer.concat(compressedSizes.map((size, index) => {
        const inflated = zlib.inflateSync(payload.subarray(cursor, cursor + size));
        cursor += size;
        const expected = index === numberOfBlocks - 1 ? lastBlockSize : blockSize;
        return inflated.subarray(0, expected);
    }));
}

function crc32(buffer) {
    let crc = ~0;
    for (const byte of buffer) {
        crc ^= byte;
        for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
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
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        pngChunk('IHDR', ihdr),
        pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
        pngChunk('IEND', Buffer.alloc(0))
    ]));
}

function windowValue(value, level = 180, width = 700) {
    return Math.max(0, Math.min(255, Math.round(((value - (level - width / 2)) / width) * 255)));
}

const xml = fs.readFileSync(imageSource, 'utf8');
const appended = extractAppendedBase64(xml);
const scalarMatch = xml.match(/<DataArray type="(Int16|Int32)" Name="([^"]+)"[^>]*offset="(\d+)"/);
if (!scalarMatch) throw new Error('Could not find a supported integer CT scalar array');
const scalarType = scalarMatch[1];
const offset = Number(scalarMatch[3]);
const bytesPerVoxel = scalarType === 'Int32' ? 4 : 2;
const extent = xml.match(/WholeExtent="(\d+) (\d+) (\d+) (\d+) (\d+) (\d+)"/).slice(1).map(Number);
const nx = extent[1] - extent[0] + 1;
const ny = extent[3] - extent[2] + 1;
const nz = extent[5] - extent[4] + 1;
const volume = inflateVtkBlock(appended, offset, findNextOffset(xml, offset));

const axialIndex = Math.round(nz * 0.5);
const axial = Buffer.alloc(nx * ny);
for (let y = 0; y < ny; y += 1) {
    for (let x = 0; x < nx; x += 1) {
        const source = ((axialIndex * ny + (ny - 1 - y)) * nx + x) * bytesPerVoxel;
        const value = scalarType === 'Int32' ? volume.readInt32LE(source) : volume.readInt16LE(source);
        axial[y * nx + x] = windowValue(value);
    }
}
writeGrayscalePng(axialTarget, nx, ny, axial);

const coronalIndex = Math.round(ny * 0.5);
const coronalScale = 2;
const coronal = Buffer.alloc(nx * nz * coronalScale);
for (let z = 0; z < nz; z += 1) {
    for (let repeat = 0; repeat < coronalScale; repeat += 1) {
        const targetY = (nz - 1 - z) * coronalScale + repeat;
        for (let x = 0; x < nx; x += 1) {
            const source = ((z * ny + coronalIndex) * nx + x) * bytesPerVoxel;
            const value = scalarType === 'Int32' ? volume.readInt32LE(source) : volume.readInt16LE(source);
            coronal[targetY * nx + x] = windowValue(value);
        }
    }
}
writeGrayscalePng(coronalTarget, nx, nz * coronalScale, coronal);
console.log(`Wrote ${axialTarget} and ${coronalTarget} from ${nx}x${ny}x${nz} CT volume`);
