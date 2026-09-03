import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Keep 3D mesh materials aligned with the UI accent token (--color-accent).
const MODEL_ACCENT = 0xb62413;

class InlineModelViewer {
    constructor(container) {
        this.container = container;
        this.isVisible = false;
        this.hasStarted = false;
        this.lastFrameTime = 0;
        this.animationAccumulator = 0;
        this.referenceModelDimension = null;
        this.animationFps = Math.max(1, Number(container.dataset.animationFps) || 30);
        this.animationSpeed = Math.max(0, Number(container.dataset.animationSpeed) || 1);
        this.framingScale = Number(container.dataset.framingScale) || null;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.startWhenNear();
    }

    startWhenNear() {
        this.visibilityTarget = this.container.closest('.step') || this.container;
        if (!('IntersectionObserver' in window)) {
            this.isVisible = true;
            this.init();
            return;
        }

        // Load the model well before the section is visible so its first render
        // does not arrive late while the user is already scrolling through it.
        this.visibilityObserver = new IntersectionObserver(([entry]) => {
            this.isVisible = entry.isIntersecting;
            if (entry.isIntersecting && !this.hasStarted) this.init();
            else if (entry.isIntersecting) this.startAnimationLoop();
        }, { rootMargin: '1200px 0px' });
        this.visibilityObserver.observe(this.visibilityTarget);
        if (this.container.dataset.preload === 'true') this.init();
    }

    async init() {
        if (this.hasStarted) return;
        this.hasStarted = true;
        const modelUrl = this.container.dataset.modelUrl;
        if (!modelUrl) return;
        const modelMode = this.container.dataset.modelMode || 'layers';

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 10000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: modelMode !== 'flow',
            alpha: true,
            powerPreference: 'high-performance'
        });
        const pixelRatioLimit = window.innerWidth <= 820 ? 1.25 : 1.5;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioLimit));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.localClippingEnabled = true;
        this.container.prepend(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;

        const rotationHint = this.container.querySelector('.inline-model-360-hint');
        if (rotationHint) {
            let hintTimer;
            this.controls.addEventListener('start', () => {
                window.clearTimeout(hintTimer);
                rotationHint.classList.add('is-hidden');
            });
            this.controls.addEventListener('end', () => {
                window.clearTimeout(hintTimer);
                hintTimer = window.setTimeout(() => {
                    rotationHint.classList.remove('is-hidden');
                }, 2000);
            });
        }

        this.scene.add(
            new THREE.HemisphereLight(0xd9f3ff, 0x240b10, 2.2),
            this.createDirectionalLight(0xffffff, 3.2, 4, 5, 7),
            this.createDirectionalLight(0xff6b73, 2.4, -5, 1, 3),
            this.createDirectionalLight(0x6edfff, 2.0, 3, 2, -5)
        );

        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.container);
        this.resize();

        try {
            await this.loadModel(modelUrl);
        } catch (error) {
            this.container.classList.add('has-error');
            console.error('[InlineModelViewer] Model could not be loaded', modelUrl, error);
        }
    }

    async loadModel(modelUrl) {
        const modelMode = this.container.dataset.modelMode || 'layers';
        this.framingScale = Number(this.container.dataset.framingScale) || null;
        this.animationFps = Math.max(1, Number(this.container.dataset.animationFps) || 30);
        this.animationSpeed = Math.max(0, Number(this.container.dataset.animationSpeed) || 1);
        const gltf = await new GLTFLoader().loadAsync(modelUrl);
            this.originalModel = gltf.scene;
            if (modelMode === 'flow') this.markTransparentSourceMeshes(this.originalModel);
            if (modelMode === 'surface') this.applySurfaceMaterial(this.originalModel);
            this.prepareMaterials(this.originalModel);
            if (modelMode === 'flow') this.applyTransparentFlowSurfaceMaterial(this.originalModel);
            if (modelMode === 'flow') this.applyFlowAccentColor(this.originalModel);
            this.layeredModel = modelMode === 'layers'
                ? this.createLayeredModel(this.originalModel)
                : null;
            this.model = this.layeredModel || this.originalModel;
            this.scene.add(this.model);
            this.fitModel(this.model, modelMode);
            if (modelMode === 'surface' || modelMode === 'flow') {
                this.rotationPivot = new THREE.Group();
                this.rotationPivot.name = 'ScrollRotationPivot';
                this.scene.remove(this.model);
                this.rotationPivot.add(this.model);
                // Re-center the mesh inside the pivot so Y rotation happens
                // around the visible model rather than its source-file origin.
                this.model.updateMatrixWorld(true);
                const pivotCenter = new THREE.Box3().setFromObject(this.model).getCenter(new THREE.Vector3());
                this.model.position.sub(pivotCenter);
                // Offsets are normalized to the model's reference dimension so
                // the same values remain useful for both flow exports.
                this.rotationPivot.position.set(
                    (Number(this.container.dataset.offsetX) || 0) * this.referenceModelDimension,
                    (Number(this.container.dataset.offsetY) || 0) * this.referenceModelDimension,
                    0
                );
                this.scene.add(this.rotationPivot);
            }
            this.instancedGroups = modelMode === 'flow'
                ? this.collapseRepeatedMeshes(this.originalModel)
                : [];
            this.setupAnimation(gltf.animations || []);
            this.container.classList.add('is-loaded');
            this.container.dispatchEvent(new CustomEvent('inline-model-ready'));
            this.startAnimationLoop();
    }

    async switchModel(modelUrl, options = {}) {
        if (!modelUrl || modelUrl === this.container.dataset.modelUrl) return;
        this.container.dataset.modelUrl = modelUrl;
        Object.entries(options).forEach(([key, value]) => {
            const attribute = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
            this.container.setAttribute(`data-${attribute}`, String(value));
        });
        if (options.framingScale !== undefined) this.framingScale = options.framingScale;
        if (options.animationFps !== undefined) this.animationFps = Math.max(1, options.animationFps);
        if (options.animationSpeed !== undefined) this.animationSpeed = Math.max(0, options.animationSpeed);
        if (!this.hasStarted || !this.scene) return;

        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
        this.mixer?.stopAllAction();

        const modelRoot = this.rotationPivot || this.model;
        if (modelRoot) this.scene.remove(modelRoot);
        this.instancedGroups?.forEach(({ instancedMesh }) => this.scene.remove(instancedMesh));
        this.disposeObject(this.originalModel);
        this.instancedGroups = [];
        this.originalModel = null;
        this.layeredModel = null;
        this.model = null;
        this.rotationPivot = null;
        this.mixer = null;
        this.animationAccumulator = 0;
        this.container.classList.remove('is-loaded', 'has-error');
        await this.loadModel(modelUrl);
    }

    disposeObject(object) {
        object?.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.filter(Boolean).forEach((material) => {
                Object.values(material).forEach((value) => value?.isTexture && value.dispose());
                material.dispose();
            });
        }
        );
    }

    createDirectionalLight(color, intensity, x, y, z) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(x, y, z);
        return light;
    }

    markTransparentSourceMeshes(model) {
        model.traverse((child) => {
            if (!child.isMesh || !child.material) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            const transparentMaterial = materials.find((material) => material.transparent || material.opacity < 0.95);
            // The GLBs use a very low-opacity mesh for the vessel wall and a
            // higher-opacity mesh for the color-scaled pathlines. Only the
            // former should receive the uniform wall material.
            if (!transparentMaterial || transparentMaterial.opacity > 0.3) return;
            child.userData.isFlowSurface = true;
        });
    }

    prepareMaterials(model) {
        model.traverse((child) => {
            if ((!child.isMesh && !child.isPoints) || !child.material) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
                if (child.geometry?.attributes?.color) material.vertexColors = true;
                material.side = THREE.DoubleSide;
                material.transparent = false;
                material.opacity = 1;
                material.roughness = Math.max(material.roughness ?? 0.55, 0.42);
                material.metalness = Math.min(material.metalness ?? 0, 0.08);
                material.needsUpdate = true;
            });
        });
    }

    applyFlowAccentColor(model) {
        model.traverse((child) => {
            if (child.userData.isFlowSurface || (!child.isMesh && !child.isPoints && !child.isLine)) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.filter(Boolean).forEach((material) => {
                material.color?.set(MODEL_ACCENT);
                material.vertexColors = false;
                material.needsUpdate = true;
            });
        });
    }

    applyTransparentFlowSurfaceMaterial(model) {
        model.traverse((child) => {
            if (!child.isMesh || !child.userData.isFlowSurface) return;
            if (child.geometry && !child.geometry.attributes.normal) child.geometry.computeVertexNormals();
            child.material = new THREE.MeshStandardMaterial({
                color: MODEL_ACCENT,
                roughness: 0.64,
                metalness: 0.02,
                emissive: MODEL_ACCENT,
                emissiveIntensity: 0.08,
                transparent: true,
                opacity: 0.16,
                depthWrite: false,
                side: THREE.DoubleSide
            });
            child.renderOrder = -1;
        });
    }

    setupAnimation(clips) {
        if (!clips.length) return;
        this.mixer = new THREE.AnimationMixer(this.originalModel);
        this.mixer.timeScale = this.animationSpeed;
        clips.forEach((clip) => this.mixer.clipAction(clip).play());
        if (this.reducedMotion) this.mixer.setTime(0);
        this.syncInstancedMeshes();
    }

    collapseRepeatedMeshes(model) {
        const meshGroups = new Map();
        model.traverse((child) => {
            if (!child.isMesh || Array.isArray(child.material)) return;
            const key = `${child.geometry.uuid}:${child.material.uuid}`;
            if (!meshGroups.has(key)) meshGroups.set(key, []);
            meshGroups.get(key).push(child);
        });

        return [...meshGroups.values()]
            .filter((sources) => sources.length >= 100)
            .map((sources) => {
                const instancedMesh = new THREE.InstancedMesh(
                    sources[0].geometry,
                    sources[0].material,
                    sources.length
                );
                instancedMesh.name = `${sources[0].name || 'Particle'}Instances`;
                instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                instancedMesh.frustumCulled = false;
                sources.forEach((source) => { source.visible = false; });
                this.scene.add(instancedMesh);
                return { sources, instancedMesh };
            });
    }

    syncInstancedMeshes() {
        if (!this.instancedGroups?.length) return;
        this.originalModel.updateMatrixWorld(true);
        this.instancedGroups.forEach(({ sources, instancedMesh }) => {
            sources.forEach((source, index) => {
                instancedMesh.setMatrixAt(index, source.matrixWorld);
            });
            instancedMesh.instanceMatrix.needsUpdate = true;
        });
    }

    applySurfaceMaterial(model) {
        model.traverse((child) => {
            if (!child.isMesh) return;
            if (child.geometry && !child.geometry.attributes.normal) child.geometry.computeVertexNormals();
            child.material = new THREE.MeshStandardMaterial({
                color: MODEL_ACCENT,
                roughness: 0.44,
                metalness: 0.02,
                emissive: MODEL_ACCENT,
                emissiveIntensity: 0.42,
                side: THREE.DoubleSide
            });
        });
    }

    createLayeredModel(model) {
        model.updateMatrixWorld(true);
        const sourceMeshes = [];
        model.traverse((child) => {
            if (child.isMesh && child.geometry?.attributes?.position) sourceMeshes.push(child);
        });
        const source = sourceMeshes.sort(
            (a, b) => b.geometry.attributes.position.count - a.geometry.attributes.position.count
        )[0];
        if (!source) return null;

        const baseGeometry = source.geometry.clone();
        baseGeometry.applyMatrix4(source.matrixWorld);
        baseGeometry.computeVertexNormals();

        const size = new THREE.Box3().setFromBufferAttribute(baseGeometry.attributes.position)
            .getSize(new THREE.Vector3());
        const layerGap = Math.max(size.x, size.y, size.z) * 0.011;
        const cutStep = size.x * 0.13;
        const layers = [
            { name: 'Intima', color: MODEL_ACCENT, offset: layerGap, roughness: 0.38, cut: cutStep },
            { name: 'Media', color: MODEL_ACCENT, offset: 0, roughness: 0.5, cut: 0 },
            { name: 'Adventitia', color: MODEL_ACCENT, offset: -layerGap, roughness: 0.66, cut: -cutStep }
        ];

        const group = new THREE.Group();
        group.name = 'AorticWallLayers';
        layers.forEach((layer, index) => {
            const geometry = this.offsetGeometry(baseGeometry, layer.offset);
            const material = new THREE.MeshStandardMaterial({
                color: layer.color,
                roughness: layer.roughness,
                metalness: 0.02,
                emissive: layer.color,
                emissiveIntensity: 0.08,
                side: THREE.DoubleSide,
                clippingPlanes: [new THREE.Plane(new THREE.Vector3(1, 0, 0), layer.cut)],
                clipShadows: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = layer.name;
            mesh.renderOrder = index;
            group.add(mesh);
        });

        return group;
    }

    offsetGeometry(sourceGeometry, distance) {
        const geometry = sourceGeometry.clone();
        const positions = geometry.attributes.position;
        const normals = geometry.attributes.normal;
        for (let index = 0; index < positions.count; index += 1) {
            positions.setXYZ(
                index,
                positions.getX(index) + normals.getX(index) * distance,
                positions.getY(index) + normals.getY(index) * distance,
                positions.getZ(index) + normals.getZ(index) * distance
            );
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        return geometry;
    }

    fitModel(model, modelMode = 'layers') {
        const configuredRotation = (axis, fallback) => {
            const value = Number(this.container.dataset[`rotation${axis}`]);
            return Number.isFinite(value) ? value : fallback;
        };
        const defaultRotation = modelMode === 'flow'
            ? { x: 0, y: Math.PI / 2, z: 0 }
            : { x: -Math.PI / 2, y: 0, z: modelMode === 'surface' ? Math.PI / 2 : 0 };
        model.rotation.set(
            configuredRotation('X', defaultRotation.x),
            configuredRotation('Y', defaultRotation.y),
            configuredRotation('Z', defaultRotation.z)
        );
        model.updateMatrixWorld(true);

        let box = new THREE.Box3().setFromObject(model);
        let size = box.getSize(new THREE.Vector3());
        const sourceMaxDimension = Math.max(size.x, size.y, size.z) || 1;
        if (!this.referenceModelDimension) this.referenceModelDimension = sourceMaxDimension;
        model.scale.multiplyScalar(this.referenceModelDimension / sourceMaxDimension);
        model.updateMatrixWorld(true);

        box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        size = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const distance = maxDimension / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
        const framingScale = this.framingScale || (modelMode === 'surface' ? 0.72 : modelMode === 'flow' ? 0.38 : 1);
        const framingDistance = distance * framingScale;
        this.cameraDistance = framingDistance;
        this.camera.position.set(
            framingDistance * 0.58,
            framingDistance * 0.08,
            framingDistance * 1.14
        );
        this.camera.near = Math.max(distance / 100, 0.01);
        this.camera.far = distance * 20;
        this.camera.updateProjectionMatrix();
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    resize() {
        if (!this.renderer || !this.camera) return;
        const width = Math.max(this.container.clientWidth, 1);
        const height = Math.max(this.container.clientHeight, 1);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    startAnimationLoop() {
        if (this.animationFrame || !this.isVisible || !this.renderer) return;
        this.lastFrameTime = 0;
        this.animationFrame = requestAnimationFrame((frameTime) => this.animate(frameTime));
    }

    animate(frameTime = 0) {
        this.animationFrame = null;
        if (!this.isVisible) return;
        const delta = this.lastFrameTime
            ? Math.min((frameTime - this.lastFrameTime) / 1000, 0.1)
            : 0;
        this.lastFrameTime = frameTime;

        if (this.mixer && !this.reducedMotion) {
            this.animationAccumulator += delta;
            const animationInterval = 1 / this.animationFps;
            if (this.animationAccumulator >= animationInterval) {
                this.mixer.update(this.animationAccumulator);
                this.animationAccumulator = 0;
                this.syncInstancedMeshes();
            }
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.animationFrame = requestAnimationFrame((nextFrameTime) => this.animate(nextFrameTime));
    }
}

export function initInlineModelViewers() {
    return [...document.querySelectorAll('[data-inline-model]')]
        .filter((container) => !container.inlineModelViewer)
        .map((container) => {
            container.inlineModelViewer = new InlineModelViewer(container);
            return container.inlineModelViewer;
        });
}
