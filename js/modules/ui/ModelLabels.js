import * as THREE from 'three';

// Anchors are stored as [x, y, z] fractions of the fitted model's bounding
// box, so the same values survive re-framing and switching model exports.
// They sit on the vessel's centerline: a ray from the camera then crosses
// exactly one wall (the vessel's own) unless another segment is in front.
const OCCLUSION_CHECK_INTERVAL = 120;
const DUPLICATE_HIT_DISTANCE = 0.002;
// Matches the text offset in css/components/model-labels.css.
const LABEL_TEXT_OFFSET = 29;
const LABEL_EDGE_MARGIN = 8;
const LABEL_GAP = 4;
const LABEL_SHIFT_STEP = 2;
// Up to this many text heights; the line then tilts to reach the text.
const LABEL_MAX_SHIFT = 2.5;
// Matches the dot radius and line length in model-labels.css.
const LABEL_DOT_RADIUS = 5;
const LABEL_LINE_LENGTH = 24;

// Text size is fixed per label; measured once it is rendered, so the
// per-frame layout of the 3D labels does not force a reflow.
function textSize(element) {
    if (!element.labelSize?.width) {
        const text = element.lastChild;
        element.labelSize = { width: text.offsetWidth, height: text.offsetHeight };
    }
    return element.labelSize;
}

// Places labels in order. Each takes its authored side when the text fits in
// the box and covers neither a text placed before it nor another label's dot,
// else the other side. If both are blocked, the text moves up or down and the
// line tilts to reach it.
// items: [{ element, x, y, side, hidden }], x/y in px within the box.
function layoutLabels(items, width) {
    const visible = items.filter((item) => !item.hidden);
    const placed = visible.map((item) => ({
        left: item.x - LABEL_DOT_RADIUS,
        right: item.x + LABEL_DOT_RADIUS,
        top: item.y - LABEL_DOT_RADIUS,
        bottom: item.y + LABEL_DOT_RADIUS,
        owner: item
    }));
    visible.forEach((item) => {
        const { width: textWidth, height: textHeight } = textSize(item.element);
        const rect = (left, shift) => {
            const start = left ? item.x - LABEL_TEXT_OFFSET - textWidth : item.x + LABEL_TEXT_OFFSET;
            return { left: start, right: start + textWidth, top: item.y - textHeight / 2 + shift, bottom: item.y + textHeight / 2 + shift };
        };
        const fits = (box) => box.left >= LABEL_EDGE_MARGIN && box.right <= width - LABEL_EDGE_MARGIN;
        const free = (box) => placed.every((other) => other.owner === item
            || box.right + LABEL_GAP <= other.left || box.left >= other.right + LABEL_GAP
            || box.bottom + LABEL_GAP <= other.top || box.top >= other.bottom + LABEL_GAP);
        const sides = item.side === 'left' ? [true, false] : [false, true];
        const shifts = [0];
        for (let shift = LABEL_SHIFT_STEP; shift <= textHeight * LABEL_MAX_SHIFT; shift += LABEL_SHIFT_STEP) shifts.push(-shift, shift);
        let choice = null;
        for (const shift of shifts) {
            const left = sides.find((side) => fits(rect(side, shift)) && free(rect(side, shift)));
            if (left !== undefined) {
                choice = { left, shift };
                break;
            }
        }
        if (!choice) choice = { left: sides.find((side) => fits(rect(side, 0))) ?? sides[0], shift: 0 };
        placed.push({ ...rect(choice.left, choice.shift), owner: null });
        item.element.classList.toggle('model-label--left', choice.left);
        item.element.style.setProperty('--label-shift', `${choice.shift}px`);
        item.element.style.setProperty('--label-line-length', `${Math.hypot(LABEL_LINE_LENGTH, choice.shift)}px`);
        item.element.style.setProperty('--label-line-angle', `${Math.atan2(choice.shift, LABEL_LINE_LENGTH) * (choice.left ? -1 : 1)}rad`);
    });
}

// Labels on flat images (js/components/imageLabels.js) use the same layout.
// Placed whenever the image changes size, which includes a hidden
// illustration being shown.
export function initImageLabels(root = document) {
    const observer = new ResizeObserver((entries) => entries.forEach(({ target }) => placeImageLabels(target)));
    root.querySelectorAll('.labelled-image').forEach((image) => observer.observe(image));
}

function placeImageLabels(image) {
    const bounds = (image.closest('.flow-illustration-panel, .inline-model-illustration') || image).getBoundingClientRect();
    if (!bounds.width) return;
    const items = [...image.querySelectorAll('.model-label')].map((element) => {
        const anchor = element.getBoundingClientRect();
        return { element, x: anchor.left - bounds.left, y: anchor.top - bounds.top, side: element.dataset.side };
    });
    layoutLabels(items, bounds.width);
}

export function parseModelLabels(container) {
    try {
        const labels = JSON.parse(container.dataset.modelLabels || '[]');
        return Array.isArray(labels) ? labels.filter((label) => label?.text && Array.isArray(label.anchor)) : [];
    } catch (error) {
        console.error('[ModelLabels] Invalid label data', error);
        return [];
    }
}

export class ModelLabels {
    constructor(container, labels) {
        this.container = container;
        this.labels = labels;
        this.raycaster = new THREE.Raycaster();
        this.lastCameraPosition = new THREE.Vector3(Infinity, Infinity, Infinity);
        this.lastOcclusionCheck = 0;
        this.layer = document.createElement('div');
        this.layer.className = 'model-label-layer';
        this.layer.setAttribute('aria-hidden', 'true');
        container.append(this.layer);
        this.setLabels(labels);
        if (new URLSearchParams(window.location.search).has('pickLabels')) this.enablePicking();
    }

    // Replaces the labels and the key below the viewer; anchors are resolved
    // against the next model passed to attach().
    setLabels(labels) {
        this.detach();
        this.labels = labels;
        this.elements = labels.map((label, index) => {
            const element = document.createElement('span');
            element.className = 'model-label';
            element.innerHTML = '<span class="model-label-dot"></span><span class="model-label-line"></span><span class="model-label-text"></span>';
            element.firstChild.textContent = String(index + 1);
            element.lastChild.textContent = label.text;
            return element;
        });
        this.layer.replaceChildren(...this.elements);

        const key = this.container.closest('.flow-comparison-panel')?.querySelector('.model-label-key')
            || this.container.closest('.inline-model-figure')?.querySelector('.inline-model-meta .model-label-key');
        if (!key) return;
        key.replaceChildren(...labels.map((label, index) => {
            const item = document.createElement('li');
            item.innerHTML = '<span class="model-label-key-number" aria-hidden="true"></span>';
            item.firstChild.textContent = String(index + 1);
            item.append(label.text);
            return item;
        }));
        key.hidden = !labels.length;
    }

    attach(modelRoot, camera) {
        this.modelRoot = modelRoot;
        this.camera = camera;
        modelRoot.updateMatrixWorld(true);
        // Flow exports also contain pathlines or particles; only the vessel
        // wall counts, both for the anchor frame (so anatomy, pathline and
        // particle exports of one aorta share anchors) and for occlusion.
        const meshes = [];
        modelRoot.traverse((child) => { if (child.isMesh) meshes.push(child); });
        const flowSurfaces = meshes.filter((mesh) => mesh.userData.isFlowSurface);
        this.wallMeshes = flowSurfaces.length ? flowSurfaces : meshes;
        this.frame = new THREE.Box3();
        this.wallMeshes.forEach((mesh) => this.frame.expandByObject(mesh));
        const size = this.frame.getSize(new THREE.Vector3());
        this.modelSize = Math.max(size.x, size.y, size.z) || 1;
        this.anchors = this.labels.map(({ anchor }) => modelRoot.worldToLocal(new THREE.Vector3(
            this.frame.min.x + size.x * anchor[0],
            this.frame.min.y + size.y * anchor[1],
            this.frame.min.z + size.z * anchor[2]
        )));
        this.occludedState = this.labels.map(() => false);
        this.lastCameraPosition.set(Infinity, Infinity, Infinity);
        this.layer.classList.add('is-ready');
    }

    detach() {
        this.modelRoot = null;
        this.layer.classList.remove('is-ready');
    }

    setDragging(isDragging) {
        this.layer.classList.toggle('is-dragging', isDragging);
    }

    update(frameTime) {
        if (!this.modelRoot || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const cameraMoved = this.camera.position.distanceToSquared(this.lastCameraPosition) > 1e-8;
        const checkOcclusion = cameraMoved && frameTime - this.lastOcclusionCheck > OCCLUSION_CHECK_INTERVAL;
        if (checkOcclusion) {
            this.lastOcclusionCheck = frameTime;
            this.lastCameraPosition.copy(this.camera.position);
        }

        const items = this.anchors.map((localAnchor, index) => {
            const worldAnchor = this.modelRoot.localToWorld(localAnchor.clone());
            if (checkOcclusion) this.occludedState[index] = this.isOccluded(worldAnchor, this.labels[index]);
            const projected = worldAnchor.project(this.camera);
            const element = this.elements[index];
            const x = ((projected.x + 1) / 2) * width;
            const y = ((1 - projected.y) / 2) * height;
            const hidden = this.occludedState[index] || projected.z > 1;
            element.style.transform = `translate(${x}px, ${y}px)`;
            element.classList.toggle('is-occluded', hidden);
            return { element, x, y, side: this.labels[index].side, hidden };
        });
        layoutLabels(items, width);
    }

    // A label is hidden when more walls than its own lie in front of it. An
    // anchor in the true lumen of a dissection (behindFlap) also sits behind
    // the flap when seen from the false-lumen side.
    isOccluded(worldAnchor, label) {
        const direction = worldAnchor.clone().sub(this.camera.position);
        const distance = direction.length();
        this.raycaster.set(this.camera.position, direction.normalize());
        this.raycaster.far = distance;
        return this.wallHits().length > (label?.behindFlap ? 2 : 1);
    }

    wallHits() {
        const minimumGap = this.modelSize * DUPLICATE_HIT_DISTANCE;
        return this.raycaster.intersectObjects(this.wallMeshes, false)
            .filter((intersection) => intersection.object.visible)
            .filter((intersection, index, hits) => index === 0 || intersection.distance - hits[index - 1].distance > minimumGap);
    }

    // Authoring helper: open a story with ?pickLabels and click the model to
    // log an anchor that can be pasted into the story's `labels` list. The
    // anchor is the midpoint between the near and far wall under the pointer.
    enablePicking() {
        let pointerStart = null;
        this.container.addEventListener('pointerdown', (event) => {
            pointerStart = { x: event.clientX, y: event.clientY };
        });
        this.container.addEventListener('pointerup', (event) => {
            if (!this.modelRoot || !pointerStart) return;
            if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 4) return;
            const bounds = this.container.getBoundingClientRect();
            const pointer = new THREE.Vector2(
                ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
                -((event.clientY - bounds.top) / bounds.height) * 2 + 1
            );
            this.raycaster.far = Infinity;
            this.raycaster.setFromCamera(pointer, this.camera);
            const [nearWall, farWall] = this.wallHits();
            if (!nearWall) return;
            const point = farWall ? nearWall.point.clone().lerp(farWall.point, 0.5) : nearWall.point;
            const size = this.frame.getSize(new THREE.Vector3());
            const anchor = ['x', 'y', 'z'].map((axis) => Number(((point[axis] - this.frame.min[axis]) / (size[axis] || 1)).toFixed(3)));
            console.log(`[ModelLabels] anchor: [${anchor.join(', ')}]`);
        });
    }
}
