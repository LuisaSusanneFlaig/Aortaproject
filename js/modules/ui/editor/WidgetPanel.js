import { iconLibrary } from '../../storyRenderer.js';

/**
 * WidgetPanel handles the palette of addable elements.
 * Modernized for May 2026.
 */
export class WidgetPanel {
    constructor({ container, onAction }) {
        this.container = container;
        this.onAction = onAction;
        this.collapsedCategories = new Set();
        this.render();
    }

    render() {
        this.container.innerHTML = `
            ${this.renderCategory('Basis', [
                { action: 'add-heading', type: 'heading', icon: iconLibrary.summary, label: 'Überschrift' },
                { action: 'add-text', type: 'text', icon: iconLibrary.summary, label: 'Text Editor' }
            ])}

            ${this.renderCategory('Medien', [
                { action: 'add-image', type: 'image', icon: iconLibrary.scan, label: 'Bild' },
                { action: 'add-video', type: 'video', icon: iconLibrary.scan, label: 'Video' }
            ])}

            ${this.renderCategory('Daten & Charts', [
                { action: 'add-stat', type: 'stat', icon: iconLibrary.pressure, label: 'Statistik' },
                { action: 'add-meter', type: 'meter', icon: iconLibrary.alert, label: 'Tacho' },
                { action: 'add-bars', type: 'bars', icon: iconLibrary.flow, label: 'Balken' },
                { action: 'add-d3-barchart', type: 'barchart', icon: iconLibrary.flow, label: 'D3 Balken' },
                { action: 'add-d3-piechart', type: 'piechart', icon: iconLibrary.heart, label: 'Pie Chart' },
                { action: 'add-d3-treemap', type: 'treemap', icon: iconLibrary.summary, label: 'Treemap' },
                { action: 'add-d3-animated-treemap', type: 'animated-treemap', icon: iconLibrary.flow, label: 'Anim. Treemap' }
            ])}
        `;

        this.setupEventListeners();
    }

    renderCategory(title, widgets) {
        const isCollapsed = this.collapsedCategories.has(title);
        return `
            <div class="editor-category-title ${isCollapsed ? 'is-collapsed' : ''}" data-category="${title}">
                ${title}
            </div>
            <div class="editor-palette" style="${isCollapsed ? 'display: none;' : ''}">
                ${widgets.map(w => this.createWidget(w.action, w.type, w.icon, w.label)).join('')}
            </div>
        `;
    }

    createWidget(action, type, iconPath, label) {
        return `
            <div role="button" tabindex="0" draggable="true" 
                 data-editor-action="${action}" data-editor-drag-type="${type}" title="${label}">
                <div class="widget-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconPath}</svg>
                </div>
                <div class="widget-label">${label}</div>
            </div>
        `;
    }

    setupEventListeners() {
        this.container.querySelectorAll('.editor-category-title[data-category]').forEach(title => {
            title.addEventListener('click', () => {
                const name = title.dataset.category;
                if (this.collapsedCategories.has(name)) this.collapsedCategories.delete(name);
                else this.collapsedCategories.add(name);
                this.render();
            });
        });
    }
}
