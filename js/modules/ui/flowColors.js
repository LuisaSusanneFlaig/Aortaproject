import * as THREE from 'three';

// Colors for the flow exports (pathlines and particles), drawn unlit so the
// scene lights do not tint them. Set per viewer with data-flow-colors:
//   accent (default)  every line and particle in the accent red
//   lumen             dissection exports: their colors mark the two lumens
//                     (red = false lumen, white = true lumen); kept as two
//                     clean classes
//   region            accent red inside a sphere (data-flow-region), white
//                     elsewhere; tested on the animated position in the shader,
//                     so particles change color as they enter or leave it
const WHITE = 0xffffff;

function flowObjects(model) {
    const objects = [];
    model.traverse((child) => {
        if ((child.isMesh || child.isPoints) && !child.userData.isFlowSurface) objects.push(child);
    });
    return objects;
}

// Lines get an unlit material; points keep theirs so their size survives.
function unlitMaterial(object) {
    if (object.isPoints) return object.material;
    object.material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    return object.material;
}

function applyAccent(objects, accent) {
    objects.forEach((object) => {
        const material = unlitMaterial(object);
        material.color.set(accent);
        material.vertexColors = false;
        material.needsUpdate = true;
    });
}

// The dissection exports use a saturated red and a near-white; anything
// closer to the red counts as false lumen.
function applyLumen(objects, accent) {
    const falseLumen = new THREE.Color(accent);
    const trueLumen = new THREE.Color(WHITE);
    objects.forEach((object) => {
        const colors = object.geometry?.attributes?.color;
        const material = unlitMaterial(object);
        if (!colors) {
            material.color.set(accent);
            material.needsUpdate = true;
            return;
        }
        for (let index = 0; index < colors.count; index += 1) {
            const red = colors.getX(index);
            const saturation = red > 0 ? 1 - Math.min(colors.getY(index), colors.getZ(index)) / red : 0;
            const color = saturation > 0.5 ? falseLumen : trueLumen;
            colors.setXYZ(index, color.r, color.g, color.b);
        }
        colors.needsUpdate = true;
        material.color.set(WHITE);
        material.vertexColors = true;
        material.needsUpdate = true;
    });
}

// region: { center: [x, y, z] fractions of the vessel wall box, radius:
// fraction of its largest side }, the same frame as the label anchors.
function applyRegion(objects, accent, region, wallBox) {
    const size = wallBox.getSize(new THREE.Vector3());
    const worldCenter = new THREE.Vector3(
        wallBox.min.x + size.x * region.center[0],
        wallBox.min.y + size.y * region.center[1],
        wallBox.min.z + size.z * region.center[2]
    );
    const worldRadius = Math.max(size.x, size.y, size.z) * region.radius;
    objects.forEach((object) => {
        const material = unlitMaterial(object);
        material.color.set(WHITE);
        material.vertexColors = false;
        // Region in the object's own space, where the morphed position lives.
        const center = object.worldToLocal(worldCenter.clone());
        const radius = worldRadius / object.getWorldScale(new THREE.Vector3()).x;
        const uniforms = {
            flowRegion: { value: new THREE.Vector4(center.x, center.y, center.z, radius) },
            flowInside: { value: new THREE.Color(accent) },
            flowOutside: { value: new THREE.Color(WHITE) }
        };
        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, uniforms);
            shader.vertexShader = `varying vec3 vFlowPosition;\n${shader.vertexShader}`
                .replace('#include <morphtarget_vertex>', '#include <morphtarget_vertex>\nvFlowPosition = transformed;');
            shader.fragmentShader = `uniform vec4 flowRegion;\nuniform vec3 flowInside;\nuniform vec3 flowOutside;\nvarying vec3 vFlowPosition;\n${shader.fragmentShader}`
                .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = distance(vFlowPosition, flowRegion.xyz) <= flowRegion.w ? flowInside : flowOutside;');
        };
        material.customProgramCacheKey = () => 'flow-region';
        material.needsUpdate = true;
    });
}

function wallBoxOf(root) {
    const box = new THREE.Box3();
    root.updateMatrixWorld(true);
    root.traverse((child) => { if (child.isMesh && child.userData.isFlowSurface) box.expandByObject(child); });
    return box.isEmpty() ? box.setFromObject(root) : box;
}

export function parseFlowRegion(container) {
    try {
        const region = JSON.parse(container.dataset.flowRegion || 'null');
        return Array.isArray(region?.center) && Number.isFinite(region?.radius) ? region : null;
    } catch {
        return null;
    }
}

// root: the fitted, positioned model (its wall box is the region's frame).
export function applyFlowColors(root, mode, accent, region = null) {
    const objects = flowObjects(root);
    if (mode === 'lumen') applyLumen(objects, accent);
    else if (mode === 'region' && region) applyRegion(objects, accent, region, wallBoxOf(root));
    else applyAccent(objects, accent);
}
