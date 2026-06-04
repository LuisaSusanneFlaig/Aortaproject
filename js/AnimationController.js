/**
 * Manages the requestAnimationFrame loop, animation triggers, and rendering.
 */
export class AnimationController {
    constructor(app, config) {
        this.app = app;
        this.config = config;
        this.isAnimating = false;
    }

    requestRender() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        requestAnimationFrame(() => this.animate());
    }

    animate() {
        if (!this.app.isRendering || !this.app.sceneManager) {
            this.isAnimating = false;
            return;
        }
        
        const scrollState = this.app.updateCameraScroll();
        const { currentSection, sectionT } = scrollState;

        // Controls update
        if (currentSection === 4) {
            this.app.sceneManager.controls.minAzimuthAngle = -0.16;
            this.app.sceneManager.controls.maxAzimuthAngle = 0.16;
        } else {
            this.app.sceneManager.controls.minAzimuthAngle = -Infinity;
            this.app.sceneManager.controls.maxAzimuthAngle = Infinity;
        }

        const moved = this.app.sceneManager.controls.update();

        // Performance & Visibility State Update
        if (currentSection !== this.app.currentSectionIdx) {
            this.app.currentSectionIdx = currentSection;
            this.app.applyResponsiveAortaLayout(currentSection);
            this.app.update3DVisibility(currentSection);
        }

        // Entrance Animation & Pulse
        const animFactor = Math.min(1, 0.25 + sectionT * 1.4); 
        const allGroups = [...this.app.customSectionGroups.values()];

        allGroups.forEach(group => {
            if (group && group.visible) {
                const base = this.app.baseScales.get(group) || 1;
                const pulse = 1 + Math.sin(sectionT * Math.PI) * 0.035;
                group.scale.setScalar(base * (0.92 + 0.08 * animFactor) * pulse);
                group.traverse(child => {
                    if (child.isMesh && child.material) {
                        const materials = Array.isArray(child.material) ? child.material : [child.material];
                        materials.forEach((material) => {
                            if (!material.transparent) return;
                            const originalOpacity = (child.name === "AortaWall") ? this.config.settings.aortaOpacity : Math.max(material.opacity || 0.72, 0.72);
                            material.opacity = Math.max(0.18, originalOpacity * animFactor);
                        });
                    }
                });
            }
        });

        // Flow updates
        let continueLoop = moved;

        // Update custom flow systems
        this.app.customFlowSystems.forEach((entry, sectionId) => {
            if (entry.flow.system?.visible) {
                entry.system.updateFlow(entry.flow, this.app.currentPulse);
                if (entry.flow.pathlineSystem) {
                    entry.flow.pathlineSystem.update(this.config.settings.speedMultiplier, this.app.currentPulse);
                }
                continueLoop = true;
            }
        });

        // Render
        const width = this.app.sceneManager.container.clientWidth;
        const height = this.app.sceneManager.container.clientHeight;
        this.app.sceneManager.render(currentSection, width, height);

        if (continueLoop) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }
}
