import * as Config from '../../core/Config.js';

export class ModelPanel {
    constructor({ container, editorState, onAction }) {
        this.container = container;
        this.editorState = editorState;
        this.onAction = onAction;
    }

    render(sectionIndex, storyConfig) {
        this.sectionIndex = sectionIndex;
        this.storyConfig = storyConfig;
        const section = storyConfig.sections[sectionIndex];
        const flowSettings = section.flowSettings || {};
        const style = section.style || {};
        
        const state = this.editorState.state;
        const meshFile = state.uploadedMesh?.[sectionIndex]?.name;
        const pathlinesFile = state.uploadedPathlines?.[sectionIndex]?.name;

        this.container.innerHTML = `
            <div class="editor-category-title">3D Modell Upload</div>
            
            <div class="editor-row">
                <label>Organ-Mesh (GLB)</label>
                <div class="upload-dropzone" data-action="upload-mesh" id="model-mesh-zone" style="margin-bottom: 5px;">
                    <input type="file" accept=".glb" id="model-mesh-input" style="display:none;">
                    <label for="model-mesh-input" style="cursor:pointer; display:block; padding:20px; border:2px dashed #444; text-align:center;">
                        ${meshFile || 'Mesh ablegen'}
                    </label>
                </div>
                ${meshFile ? `<button type="button" data-editor-action="delete-mesh" data-section-index="${sectionIndex}" style="font-size: 0.7rem; width: 100%;">Mesh löschen</button>` : ''}
            </div>

            <div class="editor-row" style="margin-top: 15px;">
                <label>Pathlines (GLB)</label>
                <div class="upload-dropzone" data-action="upload-pathlines" id="model-path-zone" style="margin-bottom: 5px;">
                    <input type="file" accept=".glb" id="model-path-input" style="display:none;">
                    <label for="model-path-input" style="cursor:pointer; display:block; padding:20px; border:2px dashed #444; text-align:center;">
                        ${pathlinesFile || 'Pathlines ablegen'}
                    </label>
                </div>
                ${pathlinesFile ? `<button type="button" data-editor-action="delete-pathlines" data-section-index="${sectionIndex}" style="font-size: 0.7rem; width: 100%;">Pathlines löschen</button>` : ''}
            </div>
            
            <div class="editor-category-title">Darstellung & Animation</div>
            <div class="editor-row">
                <label>Mesh Deckkraft</label>
                <input type="range" data-prop-path="style.meshOpacity" min="0" max="1" step="0.01" value="${style.meshOpacity ?? 0.12}">
            </div>
            <div class="editor-row">
                <label>Flow Tempo</label>
                <input type="range" data-prop-path="flowSettings.speedMultiplier" min="0" max="5" step="0.1" value="${flowSettings.speedMultiplier || 0.5}">
            </div>
            <div class="editor-row" style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" data-prop-path="flowSettings.usePulse" id="flow-pulse-model" ${flowSettings.usePulse ? 'checked' : ''}>
                <label for="flow-pulse-model" style="margin: 0; text-transform: none;">Herz-Puls simulieren</label>
            </div>
            ${flowSettings.usePulse ? `
                <div class="editor-row">
                    <label>Herzschlag (BPM)</label>
                    <input type="number" data-prop-path="flowSettings.bpm" value="${flowSettings.bpm || 60}">
                </div>
            ` : ''}

            <div class="editor-category-title">Erweiterte Flow-Optionen</div>
            <div class="editor-row">
                <label>Partikel-Effekt</label>
                <select data-prop-path="flowSettings.particleEffect">
                    <option value="None" ${flowSettings.particleEffect === 'None' ? 'selected' : ''}>Standard</option>
                    <option value="Pulse" ${flowSettings.particleEffect === 'Pulse' ? 'selected' : ''}>Pulsierend</option>
                    <option value="BloodFlow" ${flowSettings.particleEffect === 'BloodFlow' ? 'selected' : ''}>Blutfluss</option>
                </select>
            </div>
            <div class="editor-row">
                <label>Render Modus</label>
                <select data-prop-path="flowSettings.renderMode">
                    <option value="Glyph" ${flowSettings.renderMode === 'Glyph' ? 'selected' : ''}>Pfeile (Glyphs)</option>
                    <option value="Particle" ${flowSettings.renderMode === 'Particle' ? 'selected' : ''}>Partikel (Blutfluss)</option>
                </select>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const zones = [
            { id: 'model-mesh-zone', input: 'model-mesh-input', action: 'upload-mesh' },
            { id: 'model-path-zone', input: 'model-path-input', action: 'upload-pathlines' }
        ];

        zones.forEach(z => {
            const zone = this.container.querySelector(`#${z.id}`);
            const input = this.container.querySelector(`#${z.input}`);
            
            if (!zone || !input) return;

            zone.addEventListener('click', () => input.click());
            input.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.onAction(z.action, { sectionIndex: this.sectionIndex, file: e.target.files[0] });
                }
            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                if (e.dataTransfer.files.length > 0) {
                    this.onAction(z.action, { sectionIndex: this.sectionIndex, file: e.dataTransfer.files[0] });
                }
            });
        });

        this.container.querySelectorAll('button[data-editor-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.onAction(btn.dataset.editorAction, { sectionIndex: this.sectionIndex });
            });
        });

        this.container.querySelectorAll('input[type="range"], input[type="number"], input[type="checkbox"], select').forEach(input => {
            input.addEventListener('change', () => {
                const path = input.dataset.propPath;
                if (!path) return;
                const fullPath = `sections.${this.sectionIndex}.${path}`;
                let value = input.type === 'checkbox' ? input.checked : (input.type === 'number' || input.type === 'range' ? Number(input.value) : input.value);
                this.onAction('update-flow-setting', { path: fullPath, value });
            });
        });
    }

    update(storyConfig, sectionIndex) {
        this.render(sectionIndex, storyConfig);
    }
}
