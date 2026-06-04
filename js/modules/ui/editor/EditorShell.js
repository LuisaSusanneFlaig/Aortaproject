import { stripTags } from '../../core/Utils.js';

/**
 * EditorShell defines the main layout and structure of the editor sidebar.
 * Modernized for May 2026 with 4 distinct tabs for maximum clarity.
 */
export class EditorShell {
    constructor({ storyConfig, onTabChange, onAction }) {
        this.storyConfig = storyConfig;
        this.onTabChange = onTabChange;
        this.onAction = onAction;
        this.isCollapsed = localStorage.getItem('editor-sidebar-collapsed') === 'true';
        this.element = this.createShell();
        this.statusTimer = null;
    }

    createShell() {
        const shell = document.createElement('aside');
        shell.className = `editor-panel${this.isCollapsed ? ' is-collapsed' : ''}`;
        shell.innerHTML = `
            <div class="editor-panel-head">
                <div class="editor-brand-block" style="display: flex; align-items: center; gap: 12px;">
                    <button type="button" class="editor-shell-toggle" data-editor-action="toggle-sidebar" title="Sidebar ein- oder ausklappen" aria-label="Sidebar ein- oder ausklappen">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div>
                        <strong>Story Editor</strong>
                        <span id="editor-story-title">${this.storyConfig.title}</span>
                    </div>
                </div>
                <div class="editor-head-actions">
                    <span class="editor-save-state" id="editor-save-state">Bereit</span>
                    <button type="button" class="editor-shell-close" data-editor-action="toggle-sidebar" title="Sidebar schließen" aria-label="Sidebar schließen">×</button>
                </div>
            </div>
            
            <div class="editor-tabs">
                <button type="button" class="editor-tab-btn is-active" data-tab="widgets" title="Elemente hinzufügen">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </button>
                <button type="button" class="editor-tab-btn" data-tab="navigator" title="Aktuelle Sektion">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><circle cx="4" cy="6" r="1"></circle><circle cx="4" cy="12" r="1"></circle><circle cx="4" cy="18" r="1"></circle></svg>
                </button>
                <button type="button" class="editor-tab-btn" data-tab="structure" title="Story Struktur">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </button>
                <button type="button" class="editor-tab-btn" data-tab="config" title="Einstellungen">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
            </div>

            <div class="editor-tab-content is-active" data-tab-id="widgets">
                <div class="editor-search-wrap">
                    <input type="text" id="editor-widget-search" placeholder="Elemente suchen...">
                </div>
                <div id="widgets-panel-root"></div>
            </div>

            <div class="editor-tab-content" data-tab-id="navigator">
                <div id="navigator-panel-root"></div>
            </div>

            <div class="editor-tab-content" data-tab-id="structure">
                <div id="section-panel-root"></div>
                <div id="navigation-panel-root" style="margin-top: 24px;"></div>
            </div>

            <div class="editor-tab-content" data-tab-id="config">
                <div class="editor-category-title">Projekt Einstellungen</div>
                <div class="editor-row">
                    <label>Story Titel</label>
                    <input type="text" id="editor-global-title" value="${this.storyConfig.title}" placeholder="Story Titel">
                </div>
                
                <div class="editor-category-title">Daten Management</div>
                <div class="editor-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button type="button" data-editor-action="reset-all" class="editor-btn-sm" style="border-color: rgba(255, 68, 68, 0.3); color: #ff6b6b; padding: 10px;">Reset Cache</button>
                    <button type="button" data-editor-action="export" class="editor-btn-sm" style="padding: 10px;">Export JSON</button>
                </div>
                <div class="editor-row">
                    <button type="button" data-editor-action="import-json" class="editor-btn-sm" style="width: 100%; padding: 10px;">Import JSON</button>
                </div>
                <div class="editor-row">
                    <button type="button" data-editor-action="delete-local-models" class="editor-btn-sm danger" style="width: 100%; padding: 10px;">Lokale 3D-Modelle löschen</button>
                </div>
            </div>

            <div class="editor-properties" id="editor-properties">
                <div class="editor-properties-head">
                    <button type="button" data-editor-action="close-properties" title="Zurück">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <strong>Eigenschaften</strong>
                </div>
                <div id="editor-property-form" class="property-form-content"></div>
            </div>

            <div class="editor-panel-footer" style="padding: 16px 20px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.08);">
                <button type="button" data-editor-action="save-local" style="width: 100%; background: var(--accent-red); color: #fff; border: 0; height: 42px; border-radius: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 68, 68, 0.2);">Publizieren</button>
            </div>
        `;

        this.setupEventListeners(shell);
        return shell;
    }

    setupEventListeners(shell) {
        shell.querySelectorAll('.editor-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.setActiveTab(tabId);
                if (this.onTabChange) this.onTabChange(tabId);
            });
        });

        shell.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-editor-action]');
            if (actionBtn) {
                const action = actionBtn.dataset.editorAction;
                this.onAction(action, actionBtn.dataset);
            }
        });

        const searchInput = shell.querySelector('#editor-widget-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const globalTitleInput = shell.querySelector('#editor-global-title');
        if (globalTitleInput) {
            globalTitleInput.addEventListener('change', (e) => {
                this.onAction('update-global-title', { value: e.target.value });
            });
        }
    }

    setActiveTab(tabId) {
        this.element.querySelectorAll('.editor-tab-btn').forEach(b => {
            b.classList.toggle('is-active', b.dataset.tab === tabId);
        });
        this.element.querySelectorAll('.editor-tab-content').forEach(c => {
            c.classList.toggle('is-active', c.dataset.tabId === tabId);
        });
    }

    setStatus(message, tone = 'neutral') {
        const saveState = this.element.querySelector('#editor-save-state');
        if (!saveState) return;
        saveState.textContent = message;
        saveState.dataset.tone = tone;
        if (this.statusTimer) clearTimeout(this.statusTimer);
        if (tone !== 'neutral') {
            this.statusTimer = setTimeout(() => {
                saveState.textContent = 'Bereit';
                saveState.dataset.tone = 'neutral';
            }, 2200);
        }
    }

    handleSearch(query) {
        const q = query.toLowerCase();
        const widgets = this.element.querySelectorAll('.editor-palette div[role="button"]');
        widgets.forEach(w => {
            const label = w.querySelector('.widget-label').textContent.toLowerCase();
            const type = w.dataset.editorDragType.toLowerCase();
            const matches = label.includes(q) || type.includes(q);
            w.style.display = matches ? 'flex' : 'none';
        });

        this.element.querySelectorAll('.editor-palette').forEach(palette => {
            const hasVisible = Array.from(palette.children).some(child => child.style.display !== 'none');
            const categoryTitle = palette.previousElementSibling;
            if (categoryTitle && categoryTitle.classList.contains('editor-category-title')) {
                categoryTitle.style.display = hasVisible ? 'flex' : 'none';
                palette.style.display = hasVisible ? 'grid' : 'none';
            }
        });
    }

    updateStoryTitle(title) {
        this.element.querySelector('#editor-story-title').textContent = title;
        const globalInput = this.element.querySelector('#editor-global-title');
        if (globalInput && globalInput.value !== title) globalInput.value = title;
    }

    setHasProperties(hasProps) {
        const propsPanel = this.element.querySelector('#editor-properties');
        if (propsPanel) propsPanel.classList.toggle('is-visible', hasProps);
    }

    setCollapsed(collapsed) {
        this.isCollapsed = collapsed;
        this.element.classList.toggle('is-collapsed', collapsed);
        localStorage.setItem('editor-sidebar-collapsed', String(collapsed));
    }
}
