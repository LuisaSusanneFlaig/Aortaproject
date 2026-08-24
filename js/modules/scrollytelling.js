import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { Loader } from './core/Loader.js';
import { FlowSystem } from './effects/FlowSystem.js';
import { PathlineSystem } from './effects/PathlineSystem.js';
import { ChartManager } from './ui/ChartManager.js';
import { ThemeManager } from './ui/ThemeManager.js';
import { renderStoryPage, getStoryVersion } from './storyRenderer.js';
import { storyVersions } from './storyContent.js';
import { initInlineModelViewers } from './ui/InlineModelViewer.js';
import { ScrollDirector } from './ui/ScrollDirector.js';
import { GsapSectionAnimator } from './ui/GsapSectionAnimator.js';
import * as Config from './core/Config.js';

/**
 * Main Scrollytelling Application.
 * Modernized for May 2026.
 */
class ScrollytellingApp {
    constructor() {
        this.version = getStoryVersion();
        this.usesEditorialScroll = ['dissection', 'aneurysm'].includes(this.version);
        this.loader = new Loader();
        this.chartManager = new ChartManager();
        this.themeManager = new ThemeManager();
        this.flowSystem = new FlowSystem(Config.settings);
        this.pathlineSystem = new PathlineSystem(Config.settings);
        
        this.sceneManager = null;
        this.storyConfig = null;
        this.storySectionCount = 0;
        
        this.customSectionGroups = new Map();
        this.baseScales = new Map();
        this.isRendering = true;
        this.isAnimating = false;
        this.currentSectionIdx = -1;
        this.smoothedSectionT = 0;
        this.smoothedCameraT = 0;
        this.smoothedSection = 0;
        this.transitionBlend = 0;
        this.transitionDirection = 1;
        this.previousSectionIdx = -1;
        this.cameraLerpState = { x: 0, y: 0, z: 0 };
        
        this.posCurve = new THREE.CatmullRomCurve3(Config.hotspots.map(h => h.pos));
        this.lookCurve = new THREE.CatmullRomCurve3(Config.hotspots.map(h => h.target));
    }

    async init() {
        console.info('[App] Initializing Scrollytelling App...');

        this.updateStory();
        this.usesSplitLayout = Boolean(document.querySelector('.story-split-shell'));
        this.inlineModelViewers = initInlineModelViewers();
        if (this.usesEditorialScroll) {
            this.scrollDirector = new ScrollDirector(document.getElementById('story'));
            this.scrollDirector.init();
            this.gsapSectionAnimator = new GsapSectionAnimator(document.getElementById('story'));
            this.gsapSectionAnimator.init();
        }
        if (this.usesSplitLayout) {
            this.chartManager.init();
            this.updateCameraScroll();
        } else {
            this._init3D();
        }
        this.setupUI();
        window.addEventListener('scroll', () => this.requestRender(), { passive: true });
        
        const resizeObserver = new ResizeObserver(() => this.handleResize());
        resizeObserver.observe(document.getElementById('container3d'));

        document.addEventListener('visibilitychange', () => {
            this.isRendering = !document.hidden;
            if (this.isRendering) this.requestRender();
        });
    }

    _init3D() {
        const container = document.getElementById('container3d');
        this.sceneManager = new SceneManager(container, Config.settings);
        
        const hasScrollBoundModels = this.storyConfig.sections.some(
            (section) => section.meshUrl || section.pathlinesUrl
        );
        if (hasScrollBoundModels) this.createVisualStatus();

        this.applyConfiguredSectionModels().then(() => {
            this.applyResponsiveAortaLayout();
            this.updateCameraScroll();
            this.requestRender();
            this.animate();
        });

        this.chartManager.init();
    }

    refreshFlowSystems() {
        this.customSectionGroups.forEach((group, sectionIdx) => {
            if (!group.userData.flow) return;
            
            const sectionConfig = this.storyConfig.sections[sectionIdx];
            const flowSettings = { ...Config.settings, ...sectionConfig?.flowSettings };
            
            // Rebuild if count or glyph size changed (FlowSystem)
            const currentFlow = group.userData.flow;
            const needsFlowRebuild = currentFlow.lastCount !== flowSettings.count || 
                                    currentFlow.lastGlyphSize !== flowSettings.glyphSize ||
                                    currentFlow.lastGlyphType !== flowSettings.glyphType;
            
            if (needsFlowRebuild) {
                if (currentFlow.system) group.remove(currentFlow.system);
                
                const newFlow = { system: null, data: [], paths: currentFlow.paths };
                const tempFlowSystem = new FlowSystem(flowSettings);
                tempFlowSystem.createSystem(newFlow, group);
                
                if (newFlow.system) {
                    newFlow.system.name = "FlowSystem";
                    newFlow.system.renderOrder = 1001;
                }
                
                group.userData.flow.system = newFlow.system;
                group.userData.flow.data = newFlow.data;
                group.userData.flow.lastCount = flowSettings.count;
                group.userData.flow.lastGlyphSize = flowSettings.glyphSize;
                group.userData.flow.lastGlyphType = flowSettings.glyphType;
            }

            // Rebuild PathlineSystem if style or width changed
            if (group.userData.flow.pathlineSystem) {
                const ps = group.userData.flow.pathlineSystem;
                const needsPathRebuild = ps.settings.pathStyle !== flowSettings.pathStyle ||
                                        ps.settings.pathWidth !== flowSettings.pathWidth ||
                                        ps.settings.showPaths !== flowSettings.showPaths ||
                                        ps.settings.pathColor !== flowSettings.pathColor ||
                                        ps.settings.pathOpacity !== flowSettings.pathOpacity;
                
                if (needsPathRebuild) {
                    ps.settings = flowSettings;
                    ps.rebuildPaths(group.userData.flow.paths, group);
                }
            }
        });
    }

    updateStory() {
        this.storyConfig = renderStoryPage(storyVersions[this.version], this.version);
        this.storySectionCount = this.storyConfig.sections.length;
    }

    handleResize() {
        if (!this.sceneManager) return;
        const width = this.sceneManager.container.clientWidth;
        const height = this.sceneManager.container.clientHeight;
        this.sceneManager.resize(width, height);
        this.applyResponsiveAortaLayout(this.getScrollState().currentSection);
        this.requestRender();
    }

    // --- 3D Helper Methods ---

    enhanceModelMaterials(group, color = 0xffffff) {
        if (!group) return;
        group.traverse((child) => {
            // Skip flow systems and their children to maintain their custom materials
            if (child.name === "FlowSystem" || (child.parent && child.parent.name === "FlowSystem")) return;
            if (!child.isMesh || !child.material) return;
            
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
                material.side = THREE.DoubleSide;
                material.transparent = true;
                material.opacity = Math.max(material.opacity || 0, child.name === 'AortaWall' ? Config.settings.aortaOpacity : 0.72);
                if (material.color) material.color.lerp(new THREE.Color(color), 0.24);
                if (material.emissive) {
                    material.emissive = new THREE.Color(color);
                    material.emissiveIntensity = child.name === 'AortaWall' ? 0.08 : 0.04;
                }
                material.needsUpdate = true;
            });
        });
    }

    applyResponsiveAortaLayout(section = 0) {
        if (!this.sceneManager) return;
        
        const width = this.sceneManager.container.clientWidth;
        const mobilePortrait = width <= 820;
        const yTarget = mobilePortrait ? 100 : 200; 
        const fitSize = mobilePortrait ? 420 : 620;

        const allGroups = [...this.customSectionGroups.values()];

        allGroups.forEach((group) => {
            if (!group || group.children.length === 0) return;
            
            group.position.set(0, 0, 0);
            group.scale.setScalar(1);

            const editorModelId = group.userData?.editorModelId;
            const editorKeepsNativeRotation = ['uploaded'].includes(editorModelId);

            if (editorKeepsNativeRotation) {
                group.rotation.set(0, 0, 0);
            } else {
                group.rotation.set(-Math.PI * 0.5, 0, 0);
            }
            
            const box = new THREE.Box3().setFromObject(group);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            let targetScale = fitSize / maxDim;
            group.scale.setScalar(targetScale);
            this.baseScales.set(group, targetScale);

            const finalBox = new THREE.Box3().setFromObject(group);
            const center = finalBox.getCenter(new THREE.Vector3());
            
            group.position.x = -center.x;
            group.position.y = yTarget - center.y;
            group.position.z = -center.z;

            // Frustum check & safety scaling
            const cameraDistance = this.sceneManager.camera1.position.distanceTo(group.position);
            const fov = this.sceneManager.camera1.fov * (Math.PI / 180);
            const visibleHeight = 2 * Math.tan(fov / 2) * cameraDistance;
            const visibleWidth = visibleHeight * this.sceneManager.camera1.aspect;

            const groupSize = finalBox.getSize(new THREE.Vector3());
            const paddingFactor = 0.85;

            if (groupSize.x > visibleWidth * paddingFactor || groupSize.y > visibleHeight * paddingFactor) {
                const scaleDown = Math.min(
                    (visibleWidth * paddingFactor) / groupSize.x,
                    (visibleHeight * paddingFactor) / groupSize.y
                );
                group.scale.multiplyScalar(scaleDown);
                this.baseScales.set(group, targetScale * scaleDown);
            }
        });
    }

    // --- Animation & Rendering ---

    requestRender() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        requestAnimationFrame(() => this.animate());
    }

    animate() {
        if (!this.isRendering) {
            this.isAnimating = false;
            return;
        }

        if (!this.sceneManager) {
            const { currentSection } = this.updateCameraScroll();
            this.currentSectionIdx = currentSection;
            this.isAnimating = false;
            return;
        }
        
        const scrollState = this.updateCameraScroll();
        const { currentSection, sectionT, cameraT } = scrollState;

        const sectionChanged = currentSection !== this.currentSectionIdx;
        if (sectionChanged) {
            this.transitionDirection = currentSection > this.currentSectionIdx ? 1 : -1;
            this.transitionBlend = 0;
        }
        this.transitionBlend = Math.min(1, this.transitionBlend + 0.03);
        this.smoothedSectionT += (sectionT - this.smoothedSectionT) * 0.12;
        this.smoothedCameraT += (cameraT - this.smoothedCameraT) * 0.08;
        this.smoothedSection += (currentSection - this.smoothedSection) * 0.08;

        const moved = this.sceneManager.controls.update();

        // Performance & Visibility State Update
        if (sectionChanged) {
            const prevSection = this.currentSectionIdx;
            this.currentSectionIdx = currentSection;
            this.previousSectionIdx = prevSection;
            this.applyResponsiveAortaLayout(currentSection);
            this.update3DVisibility(currentSection, prevSection);
            this.setActiveStep(currentSection);
        }

        // Entrance Animation & Pulse
        const edgeBlend = THREE.MathUtils.smoothstep(this.smoothedSectionT, 0.06, 0.94);
        const animFactor = Math.min(1, 0.18 + edgeBlend * 1.6);
        const crossfade = THREE.MathUtils.smootherstep(this.transitionBlend, 0, 1);

        this.customSectionGroups.forEach((group, sIdx) => {
            if (group && group.visible) {
                const sectionConfig = this.storyConfig.sections[sIdx];
                const meshStyle = sectionConfig?.meshStyle || { opacity: 100, color: '#ffffff', rotationY: 0 };
                const pathStyle = sectionConfig?.pathStyle || { opacity: 100, color: '#ffffff', rotationY: 0 };
                const isCurrent = sIdx === currentSection;
                const isPrevious = sIdx === this.previousSectionIdx;
                const fade = isCurrent ? crossfade : (isPrevious ? (1 - crossfade) : 1);
                const depthFade = THREE.MathUtils.smoothstep(this.smoothedCameraT, 0.0, 1.0);

                const base = this.baseScales.get(group) || 1;
                const pulse = 1 + Math.sin(this.smoothedSectionT * Math.PI) * 0.022;
                group.scale.setScalar(base * (0.9 + 0.1 * animFactor) * pulse * (0.98 + crossfade * 0.02));
                this._applyGroupFade(group, fade * (0.9 + depthFade * 0.1));

                const meshContainer = group.getObjectByName("MeshContainer");
                if (meshContainer) {
                    meshContainer.position.set(
                        meshStyle.posX || 0,
                        meshStyle.posY || 0,
                        meshStyle.posZ || 0
                    );
                    
                    // Apply Auto-Rotation
                    if (meshStyle.autoRotate) {
                        meshContainer.rotation.y += 0.005;
                    } else {
                        meshContainer.rotation.set(
                            (meshStyle.rotX || 0) * (Math.PI / 180),
                            (meshStyle.rotY || 0) * (Math.PI / 180),
                            (meshStyle.rotZ || 0) * (Math.PI / 180)
                        );
                    }
                    
                    const meshCoupled = sectionConfig.meshCoupled !== false;
                    this._applySubstyle(meshContainer, meshStyle, meshCoupled ? animFactor : 1);
                }

                if (group.userData.flow?.system) {
                    const flow = group.userData.flow;
                    const flowSystem = flow.system;
                    const meshCoupled = sectionConfig.meshCoupled !== false;
                    
                    // Enforce coupling: Use mesh transformation if coupled
                    const targetStyle = meshCoupled ? meshStyle : pathStyle;

                    // Sync Flow System (Glyphs)
                    flowSystem.position.set(
                        targetStyle.posX || 0,
                        targetStyle.posY || 0,
                        targetStyle.posZ || 0
                    );
                    flowSystem.rotation.set(
                        (targetStyle.rotX || 0) * (Math.PI / 180),
                        (targetStyle.rotY || 0) * (Math.PI / 180),
                        (targetStyle.rotZ || 0) * (Math.PI / 180)
                    );

                    // Sync Pathline System (Streamlines)
                    if (flow.pathlineSystem?.pathLinesGroup) {
                        const psGroup = flow.pathlineSystem.pathLinesGroup;
                        psGroup.position.copy(flowSystem.position);
                        psGroup.rotation.copy(flowSystem.rotation);
                    }

                    this._applySubstyle(flowSystem, pathStyle, animFactor);
                }
            }
        });

        // Flow updates
        let continueLoop = moved;
        
        const timeSec = performance.now() * 0.001;
        const getPulse = (bpm = 60) => {
            const period = 60 / bpm;
            const t = (timeSec % period) / period;
            return Math.pow(Math.sin(t * Math.PI), 2) * 0.7 + Math.pow(Math.sin(t * Math.PI * 2), 4) * 0.3;
        };

        // Update custom flows
        this.customSectionGroups.forEach((group, sectionIdx) => {
            if (group.visible && group.userData.flow) {
                const sectionConfig = this.storyConfig.sections[sectionIdx];
                const flowSettings = { ...Config.settings, ...sectionConfig?.flowSettings };
                const pulse = flowSettings.usePulse ? (0.2 + 0.8 * getPulse(flowSettings.bpm || 60)) : 1.0;
                
                this.flowSystem.updateFlow(group.userData.flow, pulse, flowSettings);
                
                if (group.userData.flow.pathlineSystem) {
                    group.userData.flow.pathlineSystem.update(flowSettings.speedMultiplier, pulse);
                }
                
                continueLoop = true;
            }
        });

        // Render
        const width = this.sceneManager.container.clientWidth;
        const height = this.sceneManager.container.clientHeight;
        this.sceneManager.render(currentSection, width, height);

        if (continueLoop) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }

    _applySubstyle(group, style, animFactor) {
        const color = new THREE.Color(style.color || '#ffffff');
        const targetOpacity = (style.opacity !== undefined ? style.opacity : 100) / 100;

        group.traverse(child => {
            if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material) => {
                    material.color.lerp(color, 0.1); 
                    material.transparent = true;
                    material.opacity = Math.max(0.05, targetOpacity * animFactor);
                    
                    // Apply Advanced Options
                    material.wireframe = !!style.wireframe;
                    if (style.ghosting) {
                        material.depthWrite = false;
                        material.side = THREE.DoubleSide;
                    } else {
                        material.depthWrite = true;
                        material.side = THREE.FrontSide;
                    }
                    material.needsUpdate = true;
                });
            }
        });
    }

    updateCameraScroll() {
        const scrollState = this.getScrollState();
        const h = window.innerHeight;

        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - h)));
            progressBar.style.width = `${progress * 100}%`;
        }

        if (!this.usesEditorialScroll) {
            this.posCurve.getPoint(scrollState.cameraT, this.sceneManager.camera1.position);
            this.lookCurve.getPoint(scrollState.cameraT, this.sceneManager.controls.target);

            if (window.innerWidth <= 820) {
                this.sceneManager.camera1.position.lerp(new THREE.Vector3(0, 70, 850), 0.65);
                this.sceneManager.controls.target.lerp(new THREE.Vector3(0, 90, 0), 0.65);
            }
        }
        
        this.setActiveStep(scrollState.currentSection);
        this.updateChapterTransitionState();
        this.updateNavLinks(scrollState.currentSection);
        this.updateVisualStatus(scrollState.currentSection);

        return scrollState;
    }

    getScrollState() {
        const steps = Array.from(document.querySelectorAll('#story .step'));
        if (!steps.length) return { currentSection: 0, sectionT: 0, cameraT: 0 };

        const marker = window.innerHeight * (this.usesEditorialScroll ? 0.34 : (window.innerWidth <= 820 ? 0.62 : 0.5));
        const activeGsapSection = steps.findIndex((step) => {
            const rect = step.getBoundingClientRect();
            return step.classList.contains('is-gsap-active') && rect.top <= marker && rect.bottom >= marker;
        });
        let currentSection = activeGsapSection;

        if (currentSection < 0) {
            let smallestDistance = Infinity;
            currentSection = 0;

            steps.forEach((step, index) => {
                const rect = step.getBoundingClientRect();
                const containsMarker = rect.top <= marker && rect.bottom >= marker;
                const distance = containsMarker ? 0 : Math.min(Math.abs(rect.top - marker), Math.abs(rect.bottom - marker));

                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    currentSection = index;
                }
            });
        }

        const activeStep = steps[currentSection];
        const gsapProgress = Number.parseFloat(activeStep.dataset.gsapProgress);
        const start = activeStep.offsetTop;
        const range = Math.max(1, activeStep.offsetHeight - window.innerHeight * 0.4);
        const fallbackProgress = Math.max(0, Math.min(1, (window.scrollY - start + window.innerHeight * 0.28) / range));
        const rawSectionT = Number.isFinite(gsapProgress) && activeStep.classList.contains('is-gsap-active')
            ? gsapProgress
            : fallbackProgress;
        const sectionT = THREE.MathUtils.smootherstep(rawSectionT, 0, 1);
        const cameraT = Math.max(0, Math.min(1, (currentSection + sectionT) / Math.max(1, this.storySectionCount - 1)));

        return { currentSection, sectionT, cameraT };
    }

    // --- UI Helpers ---

    updateChapterTransitionState() {
        const marker = window.innerHeight * 0.5;
        const hasChapterAtMarker = Array.from(document.querySelectorAll('.chapter-opener')).some((opener) => {
            const rect = opener.getBoundingClientRect();
            return rect.top <= marker && rect.bottom >= marker;
        });

        document.body.classList.toggle('is-chapter-transition-active', hasChapterAtMarker);
    }

    setActiveStep(sectionIndex) {
        const steps = document.querySelectorAll('#story .step');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === sectionIndex);
        });

        const activeStep = steps[sectionIndex];
        activeStep?.classList.add('is-revealed');
        const scrollyLayout = document.querySelector('.scrolly-layout');
        if (scrollyLayout && !this.usesEditorialScroll) {
            const textBox = activeStep?.querySelector('.text-box');
            scrollyLayout.classList.toggle('is-full-layout', activeStep?.classList.contains('layout-full'));
            scrollyLayout.classList.toggle('has-2-cols', textBox?.classList.contains('cols-2'));
        }
    }

    updateNavLinks(sectionIndex) {
        const navItems = this.storyConfig.nav || [];
        let activeNavIndex = -1;
        
        navItems.forEach((item, index) => {
            if (!item.href) return;
            const targetId = item.href.startsWith('#') ? item.href.slice(1) : '';
            const targetIndex = this.storyConfig.sections.findIndex((section) => section.id === targetId);
            if (targetIndex !== -1 && targetIndex <= sectionIndex) activeNavIndex = index;
        });

        const links = [...document.querySelectorAll('.nav-links a'), ...document.querySelectorAll('.nav-menu-mobile a')];
        links.forEach((link, index) => {
            link.classList.toggle('active', (index % (navItems.length + 1)) === activeNavIndex);
        });
    }

    updateVisualStatus(sectionIndex) {
        if (!this.visualStatusLabel || !this.visualStatusTitle) return;
        
        const sectionConfig = this.storyConfig.sections[sectionIndex];
        if (sectionConfig?.layout === 'full') {
            this.visualStatusLabel.parentElement.style.opacity = '0';
            this.visualStatusLabel.parentElement.style.pointerEvents = 'none';
        } else {
            this.visualStatusLabel.parentElement.style.opacity = '1';
            this.visualStatusLabel.parentElement.style.pointerEvents = 'auto';
            this.visualStatusLabel.textContent = `${this.storyConfig.title} · ${sectionIndex + 1}/${this.storySectionCount}`;
            this.visualStatusTitle.textContent = sectionConfig?.meshLabel || sectionConfig?.title || Config.sectionVisualLabels[sectionIndex] || 'Interaktive 3D-Ansicht';
        }
    }

    createVisualStatus() {
        const rightColumn = document.querySelector('.right-column');
        if (!rightColumn) return;

        const status = document.createElement('div');
        status.className = 'visual-status';
        status.innerHTML = `
            <span class="visual-status-label">${this.storyConfig.title}</span>
            <span class="visual-status-title">3D-Modell wird geladen</span>
        `;
        rightColumn.appendChild(status);
        this.visualStatusLabel = status.querySelector('.visual-status-label');
        this.visualStatusTitle = status.querySelector('.visual-status-title');
    }

    setupUI() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu-mobile');
        if (navToggle && navMenu) navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    async setSectionMesh(sectionIndex, url, label) {
        let group = this.customSectionGroups.get(sectionIndex);
        if (!group) {
            group = new THREE.Group();
            group.visible = false;
            group.userData.modelId = label || url;
            this.sceneManager.scene1.add(group);
            this.customSectionGroups.set(sectionIndex, group);
        }

        // Remove existing mesh container if any
        const existingMeshContainer = group.getObjectByName("MeshContainer");
        if (existingMeshContainer) group.remove(existingMeshContainer);

        const gltf = await this.loader.loadModel(url);
        if (gltf) {
            const meshScene = gltf.scene;
            meshScene.name = "MeshContainer";
            meshScene.renderOrder = 1000;
            meshScene.visible = true;
            meshScene.traverse((child) => {
                if (!child.isMesh || !child.material) return;
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material) => {
                    material.transparent = true;
                    material.opacity = Math.max(material.opacity ?? 1, 0.95);
                    material.depthTest = true;
                    material.depthWrite = true;
                    material.side = THREE.DoubleSide;
                    if (material.color) {
                        material.color = material.color.clone().multiplyScalar(1.0);
                    }
                    material.needsUpdate = true;
                });
                child.frustumCulled = false;
                child.visible = true;
            });
            group.add(meshScene);
            group.userData.meshCoupled = true;
            this.applyResponsiveAortaLayout();
            console.info('[App] Mesh GLB loaded', { sectionIndex, label });
        } else {
            console.warn('[App] Mesh GLB could not be loaded', { sectionIndex, label, url });
        }
    }

    async setSectionPathlines(sectionIndex, url, label) {
        let group = this.customSectionGroups.get(sectionIndex);
        if (!group) {
            group = new THREE.Group();
            group.visible = false;
            group.userData.modelId = label || url;
            this.sceneManager.scene1.add(group);
            this.customSectionGroups.set(sectionIndex, group);
        }

        const gltf = await this.loader.loadModel(url);
        if (gltf) {
            const paths = this.loader.processPathlines(gltf.scene);
            if (paths.length > 0) {
                // If there's an existing flow system for this group, remove it
                if (group.userData.flow?.system) {
                    group.remove(group.userData.flow.system);
                }
                if (group.userData.flow?.pathlineSystem?.pathLinesGroup) {
                    group.remove(group.userData.flow.pathlineSystem.pathLinesGroup);
                }

                const flowSettings = { ...Config.settings, ...this.storyConfig.sections[sectionIndex]?.flowSettings };
                const flow = { system: null, data: [], paths: paths };
                this.flowSystem.createSystem(flow, group);
                
                const pathlineSystem = new PathlineSystem(flowSettings);
                pathlineSystem.rebuildPaths(paths, group);
                flow.pathlineSystem = pathlineSystem;
                flow.lastCount = flowSettings.count;
                flow.lastGlyphSize = flowSettings.glyphSize;

                if (flow.system) flow.system.name = "FlowSystem";
                if (flow.system) flow.system.renderOrder = 1001;
                group.userData.flow = flow;
                
                this.applyResponsiveAortaLayout();
            }
        }
    }

    async applyConfiguredSectionModels() {
        await Promise.all(this.storyConfig.sections.map(async (section, index) => {
            if (section.meshUrl) {
                await this.setSectionMesh(index, section.meshUrl, section.meshLabel || section.title);
            }
            if (section.pathlinesUrl) {
                await this.setSectionPathlines(index, section.pathlinesUrl, section.pathlinesLabel || section.title);
            }
        }));
    }

    update3DVisibility(section, previousSection = -1) {
        this.customSectionGroups.forEach((group, sIdx) => {
            const sectionConfig = this.storyConfig.sections[sIdx];
            // Strict Isolation: Only show if it's the EXACT current section
            // AND layout is not full AND it's not explicitly disabled
            const isCurrent = sIdx === section;
            const isVisible = isCurrent && 
                              sectionConfig?.layout !== 'full' && 
                              sectionConfig?.showModel !== false;
            
            group.visible = isVisible;

            if (isVisible) {
                group.traverse((child) => {
                    if (child.isMesh || child.isLine || child.isPoints) {
                        child.renderOrder = child.name === 'FlowSystem' ? 1001 : 1000;
                    }
                });
            }
        });
    }

    _applyGroupFade(group, opacityFactor) {
        const clamped = Math.max(0, Math.min(1, opacityFactor));
        group.traverse((child) => {
            if (child.name === "FlowSystem" || (child.parent && child.parent.name === "FlowSystem")) return;
            if (!child.isMesh || !child.material) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
                if (material.transparent === false) material.transparent = true;
                const baseOpacity = material.userData?.baseOpacity ?? material.opacity ?? 1;
                material.userData = material.userData || {};
                if (material.userData.baseOpacity === undefined) material.userData.baseOpacity = baseOpacity;
                const easedFade = THREE.MathUtils.smootherstep(clamped, 0, 1);
                material.opacity = material.userData.baseOpacity * easedFade;
                if (material.emissive) {
                    const emissiveBoost = 0.25 + easedFade * 0.75;
                    material.emissiveIntensity = (material.userData.baseEmissiveIntensity ?? material.emissiveIntensity ?? 0.1) * emissiveBoost;
                }
                material.needsUpdate = true;
            });
        });
        if (group.userData.flow?.system?.material) {
            const mat = group.userData.flow.system.material;
            const baseOpacity = mat.userData?.baseOpacity ?? mat.opacity ?? 1;
            mat.userData = mat.userData || {};
            if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = baseOpacity;
            mat.opacity = mat.userData.baseOpacity * THREE.MathUtils.smootherstep(clamped, 0, 1);
            mat.needsUpdate = true;
        }
    }
}

// Start App
const app = new ScrollytellingApp();
window.app = app; 
app.init();
