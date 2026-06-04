import { stripTags } from '../../core/Utils.js';

/**
 * NavigationPanel handles the chapter links in the navbar.
 * Modernized for May 2026.
 */
export class NavigationPanel {
    constructor({ container, onAction }) {
        this.container = container;
        this.onAction = onAction;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="editor-nav-builder">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <strong style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.6);">Kapitel-Navigation</strong>
                    <button type="button" data-editor-action="add-nav-item" class="editor-btn-sm">+ Kapitel</button>
                </div>
                <div id="editor-nav-list" class="editor-nav-list"></div>
            </div>
        `;
    }

    update(storyConfig) {
        const navList = this.container.querySelector('#editor-nav-list');
        if (!navList) return;

        const navItems = storyConfig.nav || [];
        navList.innerHTML = navItems.map((item, index) => {
            const targetSectionMatch = item.href?.match(/#s(\d+)/);
            const targetIndex = targetSectionMatch ? parseInt(targetSectionMatch[1], 10) - 1 : 0;
            
            return `
                <div class="editor-nav-card" data-nav-index="${index}">
                    <div class="nav-card-row">
                        <input type="text" value="${item.label}" data-nav-prop="label" placeholder="Kapitel Name">
                        <button type="button" data-editor-action="delete-nav-item" data-nav-index="${index}" class="nav-delete-btn">&times;</button>
                    </div>
                    <div class="nav-card-row">
                        <label>Springe zu:</label>
                        <select data-nav-prop="target">
                            ${storyConfig.sections.map((s, i) => `
                                <option value="#s${i + 1}" ${targetIndex === i ? 'selected' : ''}>Sektion ${i + 1}: ${stripTags(s.title).slice(0, 24)}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            `;
        }).join('');

        // Wire up individual item changes
        navList.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('change', () => {
                const navIndex = parseInt(input.closest('[data-nav-index]').dataset.navIndex, 10);
                const prop = input.dataset.navProp;
                this.onAction('update-nav-item', { 
                    index: navIndex, 
                    prop, 
                    value: input.value 
                });
            });
        });
    }
}
