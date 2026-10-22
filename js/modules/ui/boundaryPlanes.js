import * as THREE from 'three';

// Draws cross-section discs at the vessel ends: the planes where a flow
// simulation sets its inflow and outflow boundary conditions. Each plane is
// given in story data as `at` (on the plane) and `toward` (a point further
// inside the vessel, which sets the plane's orientation), both [x, y, z]
// fractions of the model's bounding box like label anchors. The disc radius
// is measured by casting rays from the centre to the vessel wall.
const RADIUS_RAYS = 16;
const FALLBACK_RADIUS = 0.03;
const DISC_SCALE = 1.15;

function toWorld(anchor, frame, size) {
    return new THREE.Vector3(...anchor.map((value, axis) => frame.min.getComponent(axis) + size.getComponent(axis) * value));
}

function measureRadius(center, normal, walls, fallback) {
    const raycaster = new THREE.Raycaster();
    const tangent = new THREE.Vector3(1, 0, 0);
    if (Math.abs(tangent.dot(normal)) > 0.9) tangent.set(0, 1, 0);
    tangent.cross(normal).normalize();
    const distances = [];
    for (let ray = 0; ray < RADIUS_RAYS; ray += 1) {
        const direction = tangent.clone().applyAxisAngle(normal, (ray / RADIUS_RAYS) * Math.PI * 2);
        raycaster.set(center, direction);
        const hit = raycaster.intersectObjects(walls, false)[0];
        if (hit) distances.push(hit.distance);
    }
    if (distances.length < RADIUS_RAYS / 2) return fallback;
    distances.sort((a, b) => a - b);
    // Upper quartile: a few rays may hit inner structures such as the flap.
    return distances[Math.floor(distances.length * 0.75)];
}

export function addBoundaryPlanes(modelRoot, planes, { inflowColor, outflowColor }) {
    modelRoot.updateMatrixWorld(true);
    const frame = new THREE.Box3().setFromObject(modelRoot);
    const size = frame.getSize(new THREE.Vector3());
    const walls = [];
    modelRoot.traverse((child) => { if (child.isMesh) walls.push(child); });

    return planes
        .filter((plane) => Array.isArray(plane.at) && Array.isArray(plane.toward))
        .map((plane) => {
            const center = toWorld(plane.at, frame, size);
            const normal = toWorld(plane.toward, frame, size).sub(center).normalize();
            const radius = measureRadius(center, normal, walls, Math.max(size.x, size.y, size.z) * FALLBACK_RADIUS);
            const isInflow = plane.type === 'inflow';
            const color = isInflow ? inflowColor : outflowColor;
            const material = (opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false });
            // Slightly wider than the lumen with a solid rim, so the plane
            // still reads when it is seen at a flat angle.
            const disc = new THREE.Mesh(new THREE.CircleGeometry(radius * DISC_SCALE, 48), material(0.7));
            disc.add(new THREE.Mesh(new THREE.RingGeometry(radius * DISC_SCALE, radius * DISC_SCALE * 1.18, 48), material(1)));
            disc.name = isInflow ? 'InflowPlane' : 'OutflowPlane';
            disc.position.copy(modelRoot.worldToLocal(center.clone()));
            disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
            disc.renderOrder = 2;
            modelRoot.add(disc);
            return disc;
        });
}
