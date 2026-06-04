import { stripTags } from '../../core/Utils.js';

/**
 * SectionNavigator handles the elements and settings of the currently active section.
 * Modernized for May 2026.
 */
export class SectionNavigator {
    constructor({ container, modelOptions, onAction }) {
        this.container = container;
        this.modelOptions = modelOptions;
        this.onAction = onAction;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div id="editor-active-section-info"></div>
            
            <div class="editor-row">
                <label>Sektion wechseln</label>
                <select id="editor-section-select"></select>
            </div>

            <div class="editor-category-title">3D-Modell & Assets</div>
            <div class="editor-row">
                <label>Modell</label>
                <select id="editor-model-select"></select>
            </div>
            
            <div class="editor-row">
                <label>Layout</label>
                <select id="editor-layout-select">
                    <option value="split">Geteilt (3D + Text)</option>
                    <option value="full">Einspaltig (Nur Text)</option>
                </select>
            </div>

            <div class="editor-row">
                <label>Inhalt-Spalten</label>
                <select id="editor-columns-select">
                    <option value="1">1 Spalte</option>
                    <option value="2">2 Spalten</option>
                </select>
            </div>
            
            <div class="editor-category-title">3D-Modell & Pathlines (Import)</div>
            
            <div class="editor-row">
                <label>mesh.glb</label>
                <div class="editor-upload" data-action="upload-mesh" id="upload-mesh-zone" tabindex="0" role="button">
                    <input id="input-mesh" type="file" accept=".glb" style="display:none">
                    <span>Mesh Datei wählen</span>
                </div>
            </div>

            <div class="editor-row">
                <label>pathlines.glb</label>
                <div class="editor-upload" data-action="upload-pathlines" id="upload-path-zone" tabindex="0" role="button">
                    <input id="input-path" type="file" accept=".glb" style="display:none">
                    <span>Pathlines Datei wählen</span>
                </div>
            </div>

            <div id="editor-asset-status"></div>

            <div class="editor-category-title">Elemente in Sektion</div>
            <div class="editor-elements" id="section-elements-list"></div>
        `;

        this.setupEventListeners();
        this.populateModelSelect();
    }

    setupEventListeners() {
        const sectionSelect = this.container.querySelector('#editor-section-select');
        sectionSelect?.addEventListener('change', () => {
            this.onAction('change-section', { sectionIndex: sectionSelect.value });
        });

        const modelSelect = this.container.querySelector('#editor-model-select');
        modelSelect?.addEventListener('change', () => {
            this.onAction('change-model', { modelId: modelSelect.value });
        });

        const layoutSelect = this.container.querySelector('#editor-layout-select');
        layoutSelect?.addEventListener('change', () => {
            this.onAction('change-layout', { layout: layoutSelect.value });
        });

        const columnsSelect = this.container.querySelector('#editor-columns-select');
        columnsSelect?.addEventListener('change', () => {
            this.onAction('change-columns', { columns: columnsSelect.value });
        });

        // Upload Zones
        const zones = [
            { id: 'upload-mesh-zone', input: 'input-mesh', action: 'upload-mesh' },
            { id: 'upload-path-zone', input: 'input-path', action: 'upload-pathlines' }
        ];

        zones.forEach(z => {
            const zone = this.container.querySelector(`#${z.id}`);
            const input = this.container.querySelector(`#${z.input}`);
            
            zone?.addEventListener('click', () => input.click());
            input?.addEventListener('change', () => {
                if (input.files?.length) {
                    this.onAction(z.action, { file: input.files[0] });
                }
            });

            zone?.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone?.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            zone?.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                if (e.dataTransfer.files?.length) {
                    this.onAction(z.action, { file: e.dataTransfer.files[0] });
                }
            });
        });
    }

    populateModelSelect() {
        const modelSelect = this.container.querySelector('#editor-model-select');
        if (!modelSelect) return;
        
        modelSelect.innerHTML = '';
        [{ id: '', label: 'Standardmodell' }, ...this.modelOptions].forEach((model) => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.label;
            modelSelect.appendChild(option);
        });
        const uploadedOption = document.createElement('option');
        uploadedOption.value = '__uploaded';
        uploadedOption.textContent = 'Hochgeladene GLB';
        modelSelect.appendChild(uploadedOption);
    }

    update(storyConfig, activeSectionIndex, editorState) {
        const sectionSelect = this.container.querySelector('#editor-section-select');
        const modelSelect = this.container.querySelector('#editor-model-select');
        const info = this.container.querySelector('#editor-active-section-info');
        const status = this.container.querySelector('#editor-asset-status');
        const list = this.container.querySelector('#section-elements-list');

        if (sectionSelect) {
            sectionSelect.innerHTML = storyConfig.sections.map((section, index) => `
                <option value="${index}" ${index === activeSectionIndex ? 'selected' : ''}>
                    ${index + 1}. ${stripTags(section.title).slice(0, 30)}
                </option>
            `).join('');
        }

        const section = storyConfig.sections[activeSectionIndex];
        
        const layoutSelect = this.container.querySelector('#editor-layout-select');
        if (layoutSelect) {
            layoutSelect.value = section.layout || 'split';
        }

        const columnsSelect = this.container.querySelector('#editor-columns-select');
        if (columnsSelect) {
            columnsSelect.value = section.columns || '1';
        }

        if (info) {
            const title = stripTags(section?.title) || `Sektion ${activeSectionIndex + 1}`;
            info.innerHTML = `
                <div style="background: rgba(255, 68, 68, 0.08); border-left: 3px solid var(--accent-red); padding: 12px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
                    <span style="font-size: 0.6rem; text-transform: uppercase; color: var(--accent-red); font-weight: 800; display: block; margin-bottom: 4px; letter-spacing: 1px;">Aktive Sektion</span>
                    <strong style="font-size: 0.9rem; color: #fff; display: block; line-height: 1.2;">${title.replace(/^\d+\.\s*/, '')}</strong>
                </div>
            `;
        }

        const state = editorState.state;
        const meshFile = state.uploadedMesh?.[activeSectionIndex]?.name;
        const pathlinesFile = state.uploadedPathlines?.[activeSectionIndex]?.name;

        if (modelSelect) {
            modelSelect.value = (meshFile || pathlinesFile) ? '__uploaded' : state.models?.[activeSectionIndex] || '';
        }
        
        if (status) {
            status.innerHTML = `
                <div style="margin-top: 10px; font-size: 0.75rem; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: ${meshFile ? '#00ff44' : '#888'};">● mesh.glb: ${meshFile || 'Fehlt'}</span>
                        ${meshFile ? `<button type="button" data-editor-action="delete-mesh" data-section-index="${activeSectionIndex}" style="font-size: 0.6rem; padding: 1px 4px; background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); color: #ff4444; border-radius: 3px; cursor: pointer;">Löschen</button>` : ''}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: ${pathlinesFile ? '#00ff44' : '#888'};">● pathlines.glb: ${pathlinesFile || 'Fehlt'}</span>
                        ${pathlinesFile ? `<button type="button" data-editor-action="delete-pathlines" data-section-index="${activeSectionIndex}" style="font-size: 0.6rem; padding: 1px 4px; background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); color: #ff4444; border-radius: 3px; cursor: pointer;">Löschen</button>` : ''}
                    </div>
                </div>
            `;
        }

        if (list) {
            this.renderElementList(list, section?.elements || []);
        }
    }

    renderElementList(container, elements) {
        if (!elements.length) {
            container.innerHTML = '<p style="font-size: 0.75rem; opacity: 0.3; padding: 20px; text-align: center; border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px;">Keine Elemente vorhanden.</p>';
            return;
        }

        container.innerHTML = elements.map((element, index) => `
            <div class="editor-element-item" draggable="true" data-element-index="${index}">
                <span class="editor-drag-handle">⠿</span>
                <span class="element-label-text">${this.getElementLabel(element)}</span>
                <div class="element-item-actions">
                    <button type="button" data-editor-action="edit-properties" data-element-index="${index}" title="Bearbeiten">✎</button>
                    <button type="button" data-editor-action="delete-element" data-element-index="${index}" title="Löschen" class="delete">×</button>
                </div>
            </div>
        `).join('');
    }

    getElementLabel(element) {
        if (!element) return 'Element';
        const typeLabels = { heading: 'H', text: 'T', quote: 'Q', image: 'I', video: 'V', stat: 'S', chart: 'C' };
        let content = '';
        if (['heading', 'text', 'quote'].includes(element.type)) content = stripTags(element.text).slice(0, 24);
        else if (['image', 'video'].includes(element.type)) content = element.caption || element.alt || '';
        else content = element.label || '';
        
        return `<small style="color: var(--accent-red); font-weight: 800; margin-right: 6px;">${typeLabels[element.type] || '?'}</small> ${content || element.type}`;
    }
}
