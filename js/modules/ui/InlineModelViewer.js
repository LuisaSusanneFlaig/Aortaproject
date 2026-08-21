import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class InlineModelViewer {
    constructor(container) {
        this.container = container;
        this.isVisible = false;
        this.hasStarted = false;
        this.lastFrameTime = 0;
        this.animationAccumulator = 0;
        this.animationFps = Math.max(1, Number(container.dataset.animationFps) || 30);
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.startWhenNear();
    }

    startWhenNear() {
        if (!('IntersectionObserver' in window)) {
            this.isVisible = true;
            this.init();
            return;
        }

        this.visibilityObserver = new IntersectionObserver(([entry]) => {
            this.isVisible = entry.isIntersecting;
            if (entry.isIntersecting && !this.hasStarted) this.init();
            else if (entry.isIntersecting) this.startAnimationLoop();
        }, { rootMargin: '320px' });
        this.visibilityObserver.observe(this.container);
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
            const gltf = await new GLTFLoader().loadAsync(modelUrl);
            this.originalModel = gltf.scene;
            if (modelMode === 'surface') this.applySurfaceMaterial(this.originalModel);
            this.prepareMaterials(this.originalModel);
            this.layeredModel = modelMode === 'layers'
                ? this.createLayeredModel(this.originalModel)
                : null;
            this.model = this.layeredModel || this.originalModel;
            this.scene.add(this.model);
            this.fitModel(this.model, modelMode);
            this.instancedGroups = modelMode === 'flow'
                ? this.collapseRepeatedMeshes(this.originalModel)
                : [];
            this.setupAnimation(gltf.animations || []);
            this.container.classList.add('is-loaded');
            this.startAnimationLoop();
        } catch (error) {
            this.container.classList.add('has-error');
            console.error('[InlineModelViewer] Model could not be loaded', modelUrl, error);
        }
    }

    createDirectionalLight(color, intensity, x, y, z) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(x, y, z);
        return light;
    }

    prepareMaterials(model) {
        model.traverse((child) => {
            if ((!child.isMesh && !child.isPoints) || !child.material) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
                material.side = THREE.DoubleSide;
                material.transparent = false;
                material.opacity = 1;
                material.roughness = Math.max(material.roughness ?? 0.55, 0.42);
                material.metalness = Math.min(material.metalness ?? 0, 0.08);
                material.needsUpdate = true;
            });
        });
    }

    setupAnimation(clips) {
        if (!clips.length) return;
        this.mixer = new THREE.AnimationMixer(this.originalModel);
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
            child.material = new THREE.MeshStandardMaterial({
                color: 0xc83c48,
                roughness: 0.52,
                metalness: 0.02,
                emissive: 0x3d0c12,
                emissiveIntensity: 0.16,
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
            { name: 'Intima', color: 0x69c8dc, offset: layerGap, roughness: 0.38, cut: cutStep },
            { name: 'Media', color: 0xcf3550, offset: 0, roughness: 0.5, cut: 0 },
            { name: 'Adventitia', color: 0xe3b357, offset: -layerGap, roughness: 0.66, cut: -cutStep }
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
        model.rotation.set(-Math.PI / 2, 0, modelMode === 'surface' ? Math.PI / 2 : 0);
        model.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const distance = maxDimension / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
        const framingScale = modelMode === 'surface' ? 0.72 : modelMode === 'flow' ? 0.62 : 1;
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
