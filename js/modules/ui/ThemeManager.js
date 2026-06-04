/**
 * ThemeManager handles switching between light and dark modes.
 */
export class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createToggle());
        } else {
            this.createToggle();
        }
    }

    applyTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('theme', this.theme);

        // Update 3D scene if it exists, otherwise retry
        if (window.app && window.app.sceneManager) {
            window.app.sceneManager.updateTheme(this.theme);
        } else {
            setTimeout(() => this.applyTheme(), 200);
        }
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
    }

    createToggle() {
        if (document.querySelector('.theme-toggle')) return; // Already exists

        const navRight = document.querySelector('.navbar-right');
        if (!navRight) {
            // Retry once after a short delay if navbar is slow to render (e.g. storyRenderer)
            setTimeout(() => this.createToggle(), 100);
            return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        btn.setAttribute('aria-label', 'Farbschema umschalten');
        btn.innerHTML = `
            <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
        
        btn.addEventListener('click', () => this.toggle());
        
        // Ensure it's placed correctly at the start of navbar-right
        navRight.insertBefore(btn, navRight.firstChild);
    }
}
