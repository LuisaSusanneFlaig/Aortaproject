/**
 * Handles DOM-related concerns, UI interactions, and scroll/resize listeners.
 */
export class UIController {
    constructor(app, config) {
        this.app = app;
        this.config = config;
    }

    init() {
        console.info('[UIController] Initializing...');
        this.setupEventListeners();
        this.setupUI();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => this.app.requestRender(), { passive: true });
        
        const resizeObserver = new ResizeObserver(() => this.app.handleResize());
        resizeObserver.observe(document.getElementById('container3d'));

        document.addEventListener('visibilitychange', () => {
            this.app.isRendering = !document.hidden;
            if (this.app.isRendering) this.app.requestRender();
        });
    }

    setupUI() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu-mobile');
        if (navToggle && navMenu) navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    updateProgressBar(progress) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = `${progress * 100}%`;
    }

    updateNavLinks(sectionIndex, storyConfig, activeNavIndex) {
        const links = [...document.querySelectorAll('.nav-links a'), ...document.querySelectorAll('.nav-menu-mobile a')];
        links.forEach((link, index) => {
            link.classList.toggle('active', (index % (storyConfig.nav.length + 1)) === activeNavIndex);
        });
    }

    setActiveStep(sectionIndex, storySectionCount) {
        const steps = Array.from(document.querySelectorAll('#story .step'));
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === sectionIndex);
        });

        const activeStep = steps[sectionIndex];
        const scrollyLayout = document.querySelector('.scrolly-layout');
        if (scrollyLayout) {
            const textBox = activeStep?.querySelector('.text-box');
            scrollyLayout.classList.toggle('is-full-layout', activeStep?.classList.contains('layout-full'));
            scrollyLayout.classList.toggle('has-2-cols', textBox?.classList.contains('cols-2'));
        }
    }
}
