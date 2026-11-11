import * as THREE from 'three';

// Turns the models of one camera sync group together (data-camera-sync-group,
// the reference and the affected aorta of a flow comparison). When the orbit
// controls of one viewer turn its camera (dragging, or the damped glide
// afterwards), the other cameras take the same turn, measured from each
// camera's own start angles, around their own targets. Only rotation is
// shared; every model keeps its own framing and screen shift.
//
// InlineModelViewer calls syncCamera() every frame after controls.update().
// The controls' change event is not enough: it skips the tiny steps at the end
// of the damped glide, and the views would drift apart by a degree or two.

const groups = new Map(); // group name -> Set of viewers
const offset = new THREE.Vector3();
const spherical = new THREE.Spherical();
const SAME = 1e-6; // radians

function angles(viewer) {
    return { azimuth: viewer.controls.getAzimuthalAngle(), polar: viewer.controls.getPolarAngle() };
}

// Only viewers with a loaded model take part: while a model loads, its camera
// is being framed (InlineModelViewer adds is-loaded afterwards).
function isReady(viewer) {
    return viewer.camera && viewer.cameraSync?.start && viewer.container.classList.contains('is-loaded');
}

// Turn the camera of `viewer` to the given orbit angles around its target.
function turnTo(viewer, azimuth, polar) {
    const { camera, controls } = viewer;
    offset.copy(camera.position).sub(controls.target);
    spherical.setFromVector3(offset);
    spherical.theta = azimuth;
    spherical.phi = THREE.MathUtils.clamp(polar,
        Math.max(controls.minPolarAngle, 0.0001), Math.min(controls.maxPolarAngle, Math.PI - 0.0001));
    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
    // What this viewer will read back on its next update; not its own turn.
    viewer.cameraSync.last = { azimuth: spherical.theta, polar: spherical.phi };
}

export function joinCameraSync(viewer, groupName) {
    if (!groupName || !viewer.controls) return;
    if (!groups.has(groupName)) groups.set(groupName, new Set());
    groups.get(groupName).add(viewer);
    viewer.cameraSync = { group: groupName, start: null, last: null };
}

// A new model resets the camera (InlineModelViewer.loadModel); its start
// angles are measured again from the new position.
export function resetCameraSync(viewer) {
    if (!viewer.cameraSync) return;
    const now = angles(viewer);
    viewer.cameraSync.start = now;
    viewer.cameraSync.last = now;
}

// If this viewer turned on its own since the last frame, turn the others.
export function syncCamera(viewer) {
    if (!viewer.cameraSync || !isReady(viewer)) return;
    const sync = viewer.cameraSync;
    const now = angles(viewer);
    // The azimuth wraps at ±180°, so compare it as the shortest turn.
    const azimuthStep = Math.atan2(Math.sin(now.azimuth - sync.last.azimuth), Math.cos(now.azimuth - sync.last.azimuth));
    if (Math.abs(azimuthStep) < SAME && Math.abs(now.polar - sync.last.polar) < SAME) return;
    sync.last = now;
    const turned = { azimuth: now.azimuth - sync.start.azimuth, polar: now.polar - sync.start.polar };
    groups.get(sync.group).forEach((other) => {
        if (other === viewer || !isReady(other)) return;
        const { start } = other.cameraSync;
        turnTo(other, start.azimuth + turned.azimuth, start.polar + turned.polar);
    });
}
