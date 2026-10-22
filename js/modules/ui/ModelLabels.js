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

        const key = this.container.closest('.inline-model-figure')?.querySelector('.model-label-key');
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
        this.frame = new THREE.Box3().setFromObject(modelRoot);
        const size = this.frame.getSize(new THREE.Vector3());
        this.modelSize = Math.max(size.x, size.y, size.z) || 1;
        this.anchors = this.labels.map(({ anchor }) => modelRoot.worldToLocal(new THREE.Vector3(
            this.frame.min.x + size.x * anchor[0],
            this.frame.min.y + size.y * anchor[1],
            this.frame.min.z + size.z * anchor[2]
        )));
        // Flow exports also contain pathline meshes; only the vessel wall
        // should count when deciding whether a label is hidden.
        const meshes = [];
        modelRoot.traverse((child) => { if (child.isMesh) meshes.push(child); });
        const flowSurfaces = meshes.filter((mesh) => mesh.userData.isFlowSurface);
        this.wallMeshes = flowSurfaces.length ? flowSurfaces : meshes;
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

        this.anchors.forEach((localAnchor, index) => {
            const worldAnchor = this.modelRoot.localToWorld(localAnchor.clone());
            if (checkOcclusion) this.occludedState[index] = this.isOccluded(worldAnchor);
            const projected = worldAnchor.project(this.camera);
            const element = this.elements[index];
            const x = ((projected.x + 1) / 2) * width;
            element.style.transform = `translate(${x}px, ${((1 - projected.y) / 2) * height}px)`;
            element.classList.toggle('is-occluded', this.occludedState[index] || projected.z > 1);
            element.classList.toggle('model-label--left', this.placeOnLeft(this.labels[index], element, x, width));
        });
    }

    // Use the authored side unless the text would run past the viewer edge.
    placeOnLeft(label, element, x, width) {
        const reach = LABEL_TEXT_OFFSET + element.lastChild.offsetWidth;
        const fitsRight = x + reach <= width - LABEL_EDGE_MARGIN;
        const fitsLeft = x - reach >= LABEL_EDGE_MARGIN;
        return label.side === 'left' ? fitsLeft || !fitsRight : !fitsRight && fitsLeft;
    }

    isOccluded(worldAnchor) {
        const direction = worldAnchor.clone().sub(this.camera.position);
        const distance = direction.length();
        this.raycaster.set(this.camera.position, direction.normalize());
        this.raycaster.far = distance;
        return this.wallHits().length > 1;
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
