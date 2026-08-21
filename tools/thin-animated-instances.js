import { readFile, writeFile } from 'node:fs/promises';

function readGlb(buffer) {
    if (buffer.readUInt32LE(0) !== 0x46546c67 || buffer.readUInt32LE(4) !== 2) {
        throw new Error('Expected a binary glTF 2.0 file');
    }

    const jsonLength = buffer.readUInt32LE(12);
    const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8').trim());
    const binaryHeaderOffset = 20 + jsonLength;
    const binaryLength = buffer.readUInt32LE(binaryHeaderOffset);
    const binary = buffer.subarray(binaryHeaderOffset + 8, binaryHeaderOffset + 8 + binaryLength);
    return { json, binary };
}

function writeGlb(json, binary) {
    const rawJson = Buffer.from(JSON.stringify(json));
    const jsonPadding = (4 - (rawJson.length % 4)) % 4;
    const jsonBuffer = Buffer.concat([rawJson, Buffer.alloc(jsonPadding, 0x20)]);
    const binaryPadding = (4 - (binary.length % 4)) % 4;
    const binaryBuffer = Buffer.concat([binary, Buffer.alloc(binaryPadding)]);
    const output = Buffer.alloc(12 + 8 + jsonBuffer.length + 8 + binaryBuffer.length);

    output.writeUInt32LE(0x46546c67, 0);
    output.writeUInt32LE(2, 4);
    output.writeUInt32LE(output.length, 8);
    output.writeUInt32LE(jsonBuffer.length, 12);
    output.writeUInt32LE(0x4e4f534a, 16);
    jsonBuffer.copy(output, 20);
    const binaryHeaderOffset = 20 + jsonBuffer.length;
    output.writeUInt32LE(binaryBuffer.length, binaryHeaderOffset);
    output.writeUInt32LE(0x004e4942, binaryHeaderOffset + 4);
    binaryBuffer.copy(output, binaryHeaderOffset + 8);
    return output;
}

export function thinAnimatedInstances(json, stride = 6) {
    const scene = json.scenes?.[json.scene || 0];
    const parentIndex = scene?.nodes
        ?.filter((index) => json.nodes[index]?.children?.length)
        .sort((a, b) => json.nodes[b].children.length - json.nodes[a].children.length)[0];
    const particleNodes = parentIndex === undefined ? [] : json.nodes[parentIndex].children;
    if (!particleNodes.length) throw new Error('No animated instance group found');

    const retainedParticles = particleNodes.filter((_, index) => index % stride === 0);
    const retainedSet = new Set(retainedParticles);
    const structuralNodes = new Set(scene.nodes.filter((index) => index !== parentIndex));
    structuralNodes.add(parentIndex);
    retainedParticles.forEach((index) => {
        structuralNodes.add(index);
        (json.nodes[index].children || []).forEach((child) => structuralNodes.add(child));
    });

    const nodeIndices = [...structuralNodes].sort((a, b) => a - b);
    const nodeMap = new Map(nodeIndices.map((oldIndex, newIndex) => [oldIndex, newIndex]));
    json.nodes = nodeIndices.map((oldIndex) => {
        const node = structuredClone(json.nodes[oldIndex]);
        if (oldIndex === parentIndex) node.children = retainedParticles.map((index) => nodeMap.get(index));
        else if (node.children) node.children = node.children.map((index) => nodeMap.get(index));
        return node;
    });
    scene.nodes = scene.nodes.map((index) => nodeMap.get(index));

    (json.animations || []).forEach((animation) => {
        const channels = animation.channels.filter((channel) => retainedSet.has(channel.target.node));
        const usedSamplers = [...new Set(channels.map((channel) => channel.sampler))];
        const samplerMap = new Map(usedSamplers.map((oldIndex, newIndex) => [oldIndex, newIndex]));
        animation.samplers = usedSamplers.map((index) => animation.samplers[index]);
        animation.channels = channels.map((channel) => ({
            ...channel,
            sampler: samplerMap.get(channel.sampler),
            target: { ...channel.target, node: nodeMap.get(channel.target.node) }
        }));
    });

    return { sourceCount: particleNodes.length, retainedCount: retainedParticles.length };
}

if (process.argv[1] && process.argv[2] && process.argv[3]) {
    const stride = Math.max(2, Number(process.argv[4]) || 6);
    const source = await readFile(process.argv[2]);
    const { json, binary } = readGlb(source);
    const result = thinAnimatedInstances(json, stride);
    await writeFile(process.argv[3], writeGlb(json, binary));
    console.log(`Retained ${result.retainedCount} of ${result.sourceCount} animated instances.`);
}
