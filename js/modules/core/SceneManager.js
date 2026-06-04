import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
    constructor(container, settings) {
        this.container = container;
        this.settings = settings;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.autoClear = false;
        this.renderer.setScissorTest(true);
        this.renderer.setClearColor(settings.bgColor);
        container.appendChild(this.renderer.domElement);

        this.scene1 = new THREE.Scene();
        this.scene2 = new THREE.Scene();
        
        this.camera1 = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000);
        this.camera2 = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000);
        this.controls = new OrbitControls(this.camera1, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enableZoom = false; 
        this.controls.enablePan = false;

        this.setupLights();
        this.updateTheme(localStorage.getItem('theme') || 'dark');
    }

    updateTheme(theme) {
        const isLight = theme === 'light';
        const bgColor = isLight ? 0xf5f5f7 : 0x050505; // Slightly darker than 0x020203 for consistent dark
        const fogColor = isLight ? 0xf5f5f7 : 0x050505;
        
        this.scene1.background = new THREE.Color(bgColor);
        this.scene2.background = new THREE.Color(bgColor);
        this.scene1.fog = new THREE.FogExp2(fogColor, 0.00085);
        this.scene2.fog = new THREE.FogExp2(fogColor, 0.00085);
        
        if (this.ambientLight) {
            this.ambientLight.intensity = isLight ? this.settings.ambientIntensity * 1.5 : this.settings.ambientIntensity;
        }
    }

    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, this.settings.ambientIntensity);
        const hemi = new THREE.HemisphereLight(0x9edbff, 0x1b0f17, 1.15);
        const direct = new THREE.DirectionalLight(0xffffff, this.settings.directIntensity);
        direct.position.set(2, 2, 5);
        const fillLight = new THREE.DirectionalLight(0xff7777, 0.9);
        fillLight.position.set(-4, 1, -3);
        const rimLight = new THREE.DirectionalLight(0x66dfff, 1.25);
        rimLight.position.set(4, 5, -6);
        const accentLight = new THREE.PointLight(0xff6b6b, 1.8, 2200, 2);
        accentLight.position.set(-250, 220, 420);
        const coolLight = new THREE.PointLight(0x6ee7ff, 1.5, 2400, 2);
        coolLight.position.set(260, 180, 360);
        this.scene1.add(this.ambientLight, hemi, direct, fillLight, rimLight, accentLight, coolLight);
    }

    render(currentSection, width, height) {
        if (window.innerWidth <= 820) {
            const topH = Math.floor(height * 0.5), botH = height - topH;
            this.camera1.aspect = width / topH; this.camera1.updateProjectionMatrix();
            this.renderer.setViewport(0, botH, width, topH); this.renderer.setScissor(0, botH, width, topH);
            this.renderer.render(this.scene1, this.camera1);
            this.camera2.position.copy(this.camera1.position); this.camera2.quaternion.copy(this.camera1.quaternion);
            this.camera2.aspect = width / botH; this.camera2.updateProjectionMatrix();
            this.renderer.setViewport(0, 0, width, botH); this.renderer.setScissor(0, 0, width, botH);
            this.renderer.render(this.scene2, this.camera2);
            return;
        }

        this.camera1.aspect = width / height; this.camera1.updateProjectionMatrix();
        this.renderer.setViewport(0, 0, width, height); this.renderer.setScissor(0, 0, width, height);
        this.renderer.render(this.scene1, this.camera1);
    }

    resize(width, height) {
        this.renderer.setSize(width, height);
        this.camera1.aspect = width / height;
        this.camera1.updateProjectionMatrix();
        this.camera2.aspect = width / height;
        this.camera2.updateProjectionMatrix();
    }
}
