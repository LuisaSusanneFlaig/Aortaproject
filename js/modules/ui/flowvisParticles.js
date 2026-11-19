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
// `loopSeconds` (simulated seconds, js/stories/flowTiming.js): when longer
// than the export, the particles still in the aorta at its last frame
// dissolve within DISSOLVE_SECONDS and the aorta stays empty until the round
// ends, so every flow view repeats at the same pace.
const DISSOLVE_SECONDS = 0.2; // simulated seconds (0.4 s on screen at speed 0.5)
const DISSOLVE_STEPS = 8;

// Fixed pseudo-random order in which the particles dissolve.
function dissolveRank(point) {
    const x = Math.sin(point * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}

// Fixed pseudo-random order in which particles are left out by a visual
// budget (js/stories/flowBudget.js); independent of the dissolve order.
function budgetRank(point) {
    const x = Math.sin(point * 78.233 + 1.7) * 24634.6345;
    return x - Math.floor(x);
}

class FlowVisParticleAnimation {
    constructor(particles, points) {
        this.particles = particles;
        this.points = points;
        this.time = 0;
        this.timeScale = 1;
        this.loopSeconds = null;
        this.budget = 1;
        this.frame = -1;
        // Palette in linear RGB, since the renderer treats vertex colors as linear.
        const palette = particles.palette || [255, 255, 255];
        this.palette = [];
        for (let index = 0; index < palette.length; index += 3) {
            this.palette.push(new THREE.Color().setRGB(palette[index] / 255, palette[index + 1] / 255, palette[index + 2] / 255, THREE.SRGBColorSpace));
        }
        this.dissolve = 0;
        this.showFrame(0);
    }

    update(delta) {
        this.time += delta * this.timeScale;
        this.showTime(this.time);
    }

    setTime(time) {
        this.time = time * this.timeScale;
        this.showTime(this.time);
    }

    // Frame and dissolve step (0 = all particles shown, DISSOLVE_STEPS = none) at `time`.
    showTime(time) {
        const { duration, frameCount } = this.particles;
        if (!(this.loopSeconds > duration)) {
            this.showFrame(this.particles.frameAt(time));
            return;
        }
        const t = time % this.loopSeconds;
        if (t < duration) {
            this.showFrame(this.particles.frameAt(t), 0);
            return;
        }
        const step = Math.min(DISSOLVE_STEPS, Math.ceil((t - duration) / DISSOLVE_SECONDS * DISSOLVE_STEPS));
        this.showFrame(frameCount - 1, step);
    }

    // Share of the particles shown (0..1); the rest stay hidden throughout.
    setBudget(budget) {
        this.budget = budget > 0 ? Math.min(1, budget) : 1;
        this.frame = -1;
        this.showTime(this.time);
    }

    stopAllAction() {}

    showFrame(frame, dissolve = 0) {
        // userData.flowColor (set by flowColors.js) replaces the palette.
        const override = this.points.userData.flowColor || null;
        if (frame === this.frame && override === this.override && dissolve === this.dissolve) return;
        this.points.visible = dissolve < DISSOLVE_STEPS;
        if (!this.points.visible) {
            this.dissolve = dissolve;
            return;
        }
        this.frame = frame;
        this.override = override;
        this.dissolve = dissolve;
        const hidden = dissolve / DISSOLVE_STEPS;
        const { position, color } = this.points.geometry.attributes;
        this.particles.positionsAt(frame, position.array);
        position.needsUpdate = true;

        const indices = this.particles.paletteIndicesAt(frame);
        const colors = color.array;
        for (let point = 0; point < this.particles.pointCount; point += 1) {
            const offset = point * 4;
            const fromPalette = indices ? this.palette[indices[point]] : this.palette[0];
            const paletteColor = fromPalette && override ? override : fromPalette;
            // Dead particles sit at their seed position; alpha 0 hides them.
            if (!paletteColor || (hidden && dissolveRank(point) < hidden) || budgetRank(point) >= this.budget) {
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
