import * as THREE from 'three';
// Classic script: sets globalThis.FlowVisGlbLoader (see its header comment).
import '../../../vendor/flowvis/flowvis-glb-loader.js';

// FlowVisAnalyzer particle exports keep the per-frame particle colors in a
// palette table (json.extras.FLOWVIS_particle_colors) that GLTFLoader ignores,
// so these files are read with the FlowVis loader instead. Positions and
// colors are rebuilt on the CPU for the frame being shown.

export function isFlowVisParticleGlb(arrayBuffer) {
    try {
        const { json } = globalThis.FlowVisGlbLoader.parseGlbContainer(arrayBuffer);
        return Boolean(json?.extras?.FLOWVIS_particle_colors);
    } catch {
        return false;
    }
}

function applyWorld(object, world) {
    object.matrix.fromArray(world);
    object.matrix.decompose(object.position, object.quaternion, object.scale);
}

function createSurface(surface) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(surface.positions, 3));
    if (surface.normals) geometry.setAttribute('normal', new THREE.BufferAttribute(surface.normals, 3));
    if (surface.indices) geometry.setIndex(new THREE.BufferAttribute(surface.indices, 1));
    const [r, g, b, a] = surface.baseColor;
    // The export's low-opacity wall is what markTransparentSourceMeshes looks for.
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace),
        transparent: a < 1,
        opacity: a,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = surface.name;
    applyWorld(mesh, surface.world);
    return mesh;
}

// Mirrors the parts of THREE.AnimationMixer the viewer uses (timeScale,
// update, setTime, stopAllAction), so speed, frame rate, sync groups and
// reduced motion work as they do for regular glTF animations.
class FlowVisParticleAnimation {
    constructor(particles, points) {
        this.particles = particles;
        this.points = points;
        this.time = 0;
        this.timeScale = 1;
        this.frame = -1;
        // Palette in linear RGB, since the renderer treats vertex colors as linear.
        const palette = particles.palette || [255, 255, 255];
        this.palette = [];
        for (let index = 0; index < palette.length; index += 3) {
            this.palette.push(new THREE.Color().setRGB(palette[index] / 255, palette[index + 1] / 255, palette[index + 2] / 255, THREE.SRGBColorSpace));
        }
        this.showFrame(0);
    }

    update(delta) {
        this.time += delta * this.timeScale;
        this.showFrame(this.particles.frameAt(this.time));
    }

    setTime(time) {
        this.time = time * this.timeScale;
        this.showFrame(this.particles.frameAt(this.time));
    }

    stopAllAction() {}

    showFrame(frame) {
        if (frame === this.frame) return;
        this.frame = frame;
        const { position, color } = this.points.geometry.attributes;
        this.particles.positionsAt(frame, position.array);
        position.needsUpdate = true;

        const indices = this.particles.paletteIndicesAt(frame);
        const colors = color.array;
        for (let point = 0; point < this.particles.pointCount; point += 1) {
            const offset = point * 4;
            const paletteColor = indices ? this.palette[indices[point]] : this.palette[0];
            // Dead particles sit at their seed position; alpha 0 hides them.
            if (!paletteColor) {
                colors[offset + 3] = 0;
                continue;
            }
            colors[offset] = paletteColor.r;
            colors[offset + 1] = paletteColor.g;
            colors[offset + 2] = paletteColor.b;
            colors[offset + 3] = 1;
        }
        color.needsUpdate = true;
    }
}

function createParticles(particles) {
    const geometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(particles.positionsAt(0), 3);
    position.setUsage(THREE.DynamicDrawUsage);
    const color = new THREE.BufferAttribute(new Float32Array(particles.pointCount * 4), 4);
    color.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', position);
    geometry.setAttribute('color', color);
    const material = new THREE.PointsMaterial({ vertexColors: true, alphaTest: 0.5 });
    const points = new THREE.Points(geometry, material);
    points.name = particles.name || 'FlowVisParticles';
    // The palette already encodes the flow colors; flowColors.js leaves them alone.
    points.userData.hasExportColors = true;
    // Positions move every frame, so the frame-0 bounds are not reliable for culling.
    points.frustumCulled = false;
    applyWorld(points, particles.world);
    return points;
}

// Returns { scene, animation } shaped like the GLTFLoader result the viewer uses.
export function createFlowVisParticleModel(arrayBuffer) {
    const { particles, surfaces } = globalThis.FlowVisGlbLoader.loadFlowVisGlb(arrayBuffer);
    const scene = new THREE.Group();
    scene.name = 'FlowVisExport';
    surfaces.forEach((surface) => scene.add(createSurface(surface)));
    let animation = null;
    if (particles) {
        const points = createParticles(particles);
        scene.add(points);
        animation = new FlowVisParticleAnimation(particles, points);
    }
    return { scene, animation };
}
