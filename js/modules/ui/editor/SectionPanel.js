import { stripTags } from '../../core/Utils.js';

/**
 * SectionPanel handles the overall structure of the story.
 */
export class SectionPanel {
    constructor({ container, onAction }) {
        this.container = container;
        this.onAction = onAction;
        this.targetSectionIndex = -1;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="editor-section-builder">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <strong style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.6);">Story Struktur</strong>
                    <button type="button" data-editor-action="add-section" class="editor-btn-sm">+ Neue Sektion</button>
                </div>
                <div class="editor-sections-list" id="editor-sections"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const uploadBtn = e.target.closest('[data-upload-section]');
            if (uploadBtn) {
                this.targetSectionIndex = Number(uploadBtn.dataset.uploadSection);
                this.onAction(uploadBtn.dataset.uploadAction, {
                    sectionIndex: this.targetSectionIndex
                });
                return;
            }
        });
    }

    update(storyConfig, activeSectionIndex, editorState) {
        const sectionList = this.container.querySelector('#editor-sections');
        if (!sectionList) return;

        const state = editorState ? editorState.state : {};

        sectionList.innerHTML = storyConfig.sections.map((section, index) => {
            const isActive = index === activeSectionIndex;
            const title = stripTags(section.title).replace(/^\d+\.\s*/, '') || 'Unbenannte Sektion';
            const meshFile = state.uploadedMesh?.[index]?.name;
            const pathlinesFile = state.uploadedPathlines?.[index]?.name;

            return `
                <div class="editor-section-item ${isActive ? 'is-active' : ''}" draggable="true" data-section-index="${index}">
                    <div class="section-drag-handle">⠿</div>
                    <div class="section-info" data-editor-action="jump-section" data-section-index="${index}">
                        <span class="section-number">${index + 1}</span>
                        <span class="section-title">${title}</span>
                    </div>
                    <div class="section-upload-status" style="display:flex; flex-direction:column; gap:2px; margin-right:8px; min-width:140px;">
                        <span class="section-upload-pill ${meshFile ? 'has-file' : ''}">Mesh: ${meshFile || '-'}</span>
                        <span class="section-upload-pill ${pathlinesFile ? 'has-file' : ''}">Pathlines: ${pathlinesFile || '-'}</span>
                    </div>
                    <div class="section-actions">
                        <button type="button" data-editor-action="duplicate-section" data-section-index="${index}" title="Duplizieren">␣</button>
                        <button type="button" data-editor-action="delete-section" data-section-index="${index}" title="Löschen" class="delete">&times;</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}
