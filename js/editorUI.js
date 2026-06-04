import { stripTags, cloneConfig, setDeepValue } from './core/Utils.js';
import { EditorState } from './editorState.js';
import { EditorShell } from './ui/editor/EditorShell.js';
import { SectionPanel } from './ui/editor/SectionPanel.js';
import { WidgetPanel } from './ui/editor/WidgetPanel.js';
import { SectionNavigator } from './ui/editor/SectionNavigator.js';
import { ModelPanel } from './ui/editor/ModelPanel.js';
import { NavigationPanel } from './ui/editor/NavigationPanel.js';
import { PropertyEditor } from './ui/editor/PropertyEditor.js';
import { DragDropManager } from './ui/editor/DragDropManager.js';

/**
 * EditorUI Orchestrator.
 * Modernized for May 2026.
 */
export function initEditorUI({
    version,
    storyConfig: initialStoryConfig,
    editorState,
    modelOptions,
    getCurrentSection,
    setSectionModel,
    setSectionModelFile,
    resetSectionModel,
    exportState
}) {
    let active = localStorage.getItem('editor-mode-active') === 'true';
    let storyConfig = initialStoryConfig;
    let state = editorState.state;
    let activeElementInfo = null;

    const handleAction = async (action, data) => {
        const sectionIndex = data.sectionIndex !== undefined ? Number(data.sectionIndex) : getCurrentSectionIndex();

        switch (action) {
            case 'change-section':
                updatePanelForSection(Number(data.sectionIndex));
                scrollToSection(Number(data.sectionIndex));
                break;
            case 'change-layout':
                handleLayoutChange(sectionIndex, data.layout);
                break;
            case 'change-columns':
                handleColumnsChange(sectionIndex, data.columns);
                break;
            case 'upload-mesh':
                if (data.file) {
                    const sIdx = data.sectionIndex !== undefined ? Number(data.sectionIndex) : getCurrentSectionIndex();
                    if (window.app && window.app.setSectionUploadedMesh) {
                        await window.app.setSectionUploadedMesh(sIdx, URL.createObjectURL(data.file), data.file.name);
                    }
                    await editorState.writeUploadedModel(sIdx, data.file, 'mesh');
                    editorState.updatePath(`uploadedMesh.${sIdx}`, { name: data.file.name });
                    shell.setStatus('Mesh hochgeladen', 'saved');
                }
                break;
            case 'upload-pathlines':
                if (data.file) {
                    const sIdx = data.sectionIndex !== undefined ? Number(data.sectionIndex) : getCurrentSectionIndex();
                    if (window.app && window.app.setSectionUploadedPathlines) {
                        await window.app.setSectionUploadedPathlines(sIdx, URL.createObjectURL(data.file), data.file.name);
                    }
                    await editorState.writeUploadedModel(sIdx, data.file, 'pathlines');
                    editorState.updatePath(`uploadedPathlines.${sIdx}`, { name: data.file.name });
                    shell.setStatus('Pathlines hochgeladen', 'saved');
                }
                break;
            case 'delete-mesh':
                {
                    const sIdx = data.sectionIndex !== undefined ? Number(data.sectionIndex) : getCurrentSectionIndex();
                    if (window.app && window.app.removeSectionUploadedMesh) {
                        window.app.removeSectionUploadedMesh(sIdx);
                    }
                    await editorState.deleteUploadedModel(sIdx, 'mesh');
                    editorState.updatePath(`uploadedMesh.${sIdx}`, null);
                    shell.setStatus('Mesh entfernt', 'saved');
                }
                break;
            case 'delete-pathlines':
                {
                    const sIdx = data.sectionIndex !== undefined ? Number(data.sectionIndex) : getCurrentSectionIndex();
                    if (window.app && window.app.removeSectionUploadedPathlines) {
                        window.app.removeSectionUploadedPathlines(sIdx);
                    }
                    await editorState.deleteUploadedModel(sIdx, 'pathlines');
                    editorState.updatePath(`uploadedPathlines.${sIdx}`, null);
                    shell.setStatus('Pathlines entfernt', 'saved');
                }
                break;
            case 'upload-combined':
                await handleModelFile(null, data.files);
                break;
            case 'upload-model':
                await handleModelFile(data.file);
                break;
            case 'add-section':
                addSection();
                break;
            case 'edit-section':
                openProperties(null, Number(data.sectionIndex));
                break;
            case 'jump-section':
                updatePanelForSection(Number(data.sectionIndex));
                scrollToSection(Number(data.sectionIndex));
                break;
            case 'duplicate-section':
                duplicateSection(Number(data.sectionIndex));
                break;
            case 'delete-section':
                deleteSection(Number(data.sectionIndex));
                break;
            case 'add-nav-item':
                addNavItem();
                break;
            case 'delete-nav-item':
                deleteNavItem(Number(data.navIndex));
                break;
            case 'update-nav-item':
                updateNavItem(data.index, data.prop, data.value);
                break;
            case 'update-global-title':
                editorState.updatePath('title', data.value);
                shell.setStatus('Titel aktualisiert', 'saved');
                break;
            case 'update-flow-setting':
                editorState.updatePath(data.path, data.value);
                shell.setStatus('Asset aktualisiert', 'saved');
                break;
            case 'edit-properties':
                openProperties(Number(data.elementIndex), sectionIndex);
                break;
            case 'delete-element':
                deleteElement(sectionIndex, Number(data.elementIndex));
                closeProperties();
                break;
            case 'close-properties':
                closeProperties();
                break;
            case 'open-assets-tab':
                closeProperties();
                shell.setActiveTab('assets');
                updatePanelForSection(sectionIndex);
                break;
            case 'save-local':
                harvestCurrentEdits();
                editorState.writeState(editorState.state);
                shell.setStatus('Sichtbar publiziert!', 'saved');
                break;
            case 'export':
                handleExport();
                break;
            case 'import-json':
                importInput.click();
                break;
            case 'hard-reset':
                if (confirm('Wirklich ALLES löschen, inkl. der Datenbank? Die Seite wird neu geladen.')) {
                    await EditorState.deleteDatabase();
                    editorState.removeState();
                    window.location.reload();
                }
                break;
            case 'reset-all-titles':
                if (confirm('Wirklich alles außer den Sektionstiteln zurücksetzen?')) {
                    const nextState = cloneConfig(editorState.state);
                    
                    // Clear sections data
                    if (nextState.sections) {
                        nextState.sections = nextState.sections.map(s => ({ title: s.title }));
                    }
                    if (nextState.extraSections) {
                        nextState.extraSections = nextState.extraSections.map(s => ({ title: s.title }));
                    }
                    
                    // Clear models, uploads, etc.
                    nextState.models = {};
                    nextState.uploadedModels = {};
                    nextState.uploadedMesh = {};
                    nextState.uploadedPathlines = {};
                    
                    updateState(nextState, 'Daten zurückgesetzt (Titel erhalten)');
                    editorState.deleteUploadedModelsForVersion().then(() => window.location.reload());
                }
                break;
            case 'reset-all':
                if (confirm('Alle lokalen Aenderungen loeschen?')) {
                    editorState.removeState();
                    editorState.deleteUploadedModelsForVersion().finally(() => window.location.reload());
                }
                break;
            case 'add-heading': addElementToSection(sectionIndex, 'heading'); break;
            case 'add-text': addElementToSection(sectionIndex, 'text'); break;
            case 'add-image': addElementToSection(sectionIndex, 'image'); break;
            case 'add-video': addElementToSection(sectionIndex, 'video'); break;
            case 'add-stat': addElementToSection(sectionIndex, 'stat'); break;
            case 'add-meter': addElementToSection(sectionIndex, 'meter'); break;
            case 'add-bars': addElementToSection(sectionIndex, 'bars'); break;
            case 'add-split': addElementToSection(sectionIndex, 'split'); break;
            case 'add-d3-barchart': addElementToSection(sectionIndex, 'barchart'); break;
            case 'add-d3-piechart': addElementToSection(sectionIndex, 'piechart'); break;
            case 'add-d3-treemap': addElementToSection(sectionIndex, 'treemap'); break;
            case 'add-d3-animated-treemap': addElementToSection(sectionIndex, 'animated-treemap'); break;
        }
    }

    // Components
    let shell, widgetPanel, sectionNavigator, modelPanel, sectionPanel, navigationPanel, propertyEditor, dragDropManager;

    const toggle = document.querySelector('.editor-toggle');
    const quickToolbar = createQuickToolbar();
    document.body.appendChild(quickToolbar);

    // Initialization
    shell = new EditorShell({
        storyConfig,
        onTabChange: () => syncPanel(),
        onAction: handleAction
    });
    document.body.appendChild(shell.element);
    
    // Set initial visibility
    shell.element.style.display = active ? 'flex' : 'none';

    widgetPanel = new WidgetPanel({
        container: shell.element.querySelector('#widgets-panel-root'),
        onAction: handleAction
    });

    sectionNavigator = new SectionNavigator({
        container: shell.element.querySelector('#navigator-panel-root'),
        modelOptions,
        onAction: handleAction
    });

    modelPanel = new ModelPanel({
        container: shell.element.querySelector('#model-panel-root'),
        editorState,
        onAction: handleAction
    });

    sectionPanel = new SectionPanel({
        container: shell.element.querySelector('#section-panel-root'),
        onAction: handleAction
    });

    navigationPanel = new NavigationPanel({
        container: shell.element.querySelector('#navigation-panel-root'),
        onAction: handleAction
    });

    propertyEditor = new PropertyEditor({
        container: shell.element.querySelector('#editor-property-form'),
        editorState,
        onAction: handleAction
    });

    dragDropManager = new DragDropManager({
        shell: shell.element,
        editorState,
        onDrop: handleDrop
    });

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';
    shell.element.appendChild(importInput);
    importInput.addEventListener('change', handleImport);

    function handleDrop(data) {
        if (data.target === 'story') {
            if (data.kind === 'palette') {
                const step = document.getElementById(`s${data.toSectionIndex + 1}`);
                const basePath = step?.dataset.editBasePath;
                if (!basePath) return;
                const elements = editorState.getValue(`${basePath}.elements`) || [];
                const nextElements = [...elements];
                nextElements.splice(data.toInsertIndex ?? elements.length, 0, createElement(data.type));
                editorState.updatePath(`${basePath}.elements`, nextElements);
                shell.setStatus('Element abgelegt', 'saved');
            } else if (data.kind === 'element') {
                moveElement(data.fromSectionIndex, data.elementIndex, data.toSectionIndex, data.toInsertIndex);
            }
        } else if (data.target === 'panel-elements') {
            if (data.kind === 'palette') {
                addElementToSection(getCurrentSectionIndex(), data.type, data.toInsertIndex);
            } else {
                moveElement(data.fromSectionIndex, data.elementIndex, getCurrentSectionIndex(), data.toInsertIndex);
            }
        } else if (data.target === 'panel-sections') {
            reorderSections(data.fromIndex, data.toIndex ?? storyConfig.sections.length - 1);
        }
    }

    function getCurrentSectionIndex() {
        const select = shell.element.querySelector('#editor-section-select');
        return select ? Number(select.value) : getCurrentSection();
    }

    function updatePanelForSection(sectionIndex) {
        sectionNavigator.update(storyConfig, sectionIndex, editorState);
        modelPanel.update(storyConfig, sectionIndex);
        sectionPanel.update(storyConfig, sectionIndex, editorState);
    }

    function syncPanel() {
        const sectionIndex = getCurrentSection();
        updatePanelForSection(sectionIndex);
        navigationPanel.update(storyConfig);
    }

    function scrollToSection(index) {
        const step = document.getElementById(`s${index + 1}`);
        if (step) step.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async function handleColumnsChange(sectionIndex, columns) {
        const nextState = cloneConfig(editorState.state);
        const sectionId = storyConfig.sections[sectionIndex]?.__sectionId || `base:${sectionIndex}`;
        const [kind, rawIdx] = sectionId.split(':');
        const sourceIdx = Number(rawIdx);

        if (kind === 'extra') {
            if (!nextState.extraSections) nextState.extraSections = [];
            if (!nextState.extraSections[sourceIdx]) nextState.extraSections[sourceIdx] = cloneConfig(storyConfig.sections[sectionIndex]);
            nextState.extraSections[sourceIdx].columns = columns;
        } else {
            if (!nextState.sections) nextState.sections = [];
            if (!nextState.sections[sourceIdx]) nextState.sections[sourceIdx] = {};
            nextState.sections[sourceIdx].columns = columns;
        }
        updateState(nextState, 'Spalten aktualisiert');
    }

    async function handleLayoutChange(sectionIndex, layout) {
        const nextState = cloneConfig(editorState.state);
        const sectionId = storyConfig.sections[sectionIndex]?.__sectionId || `base:${sectionIndex}`;
        const [kind, rawIdx] = sectionId.split(':');
        const sourceIdx = Number(rawIdx);

        if (kind === 'extra') {
            if (!nextState.extraSections) nextState.extraSections = [];
            if (!nextState.extraSections[sourceIdx]) nextState.extraSections[sourceIdx] = cloneConfig(storyConfig.sections[sectionIndex]);
            nextState.extraSections[sourceIdx].layout = layout;
        } else {
            if (!nextState.sections) nextState.sections = [];
            if (!nextState.sections[sourceIdx]) nextState.sections[sourceIdx] = {};
            nextState.sections[sourceIdx].layout = layout;
        }
        updateState(nextState, 'Layout aktualisiert');
    }

    async function handleModelChange(sectionIndex, modelId) {
        const nextState = cloneConfig(editorState.state);
        if (!nextState.models) nextState.models = {};
        if (!nextState.uploadedModels) nextState.uploadedModels = {};

        if (modelId === '__uploaded') {
            shell.setStatus('GLB ablegen', 'dirty');
            return;
        }

        if (modelId) {
            nextState.models[sectionIndex] = modelId;
            delete nextState.uploadedModels[sectionIndex];
            await editorState.deleteUploadedModel(sectionIndex);
            await setSectionModel(sectionIndex, modelId);
        } else {
            delete nextState.models[sectionIndex];
            delete nextState.uploadedModels[sectionIndex];
            await editorState.deleteUploadedModel(sectionIndex);
            resetSectionModel(sectionIndex);
        }
        updateState(nextState, 'Modell aktualisiert');
    }

    async function handleModelFile(file, multipleFiles = null) {
        const files = multipleFiles || (file ? [file] : []);
        if (files.length === 0) return;

        const sectionIndex = getCurrentSectionIndex();
        
        let meshFile = null;
        let pathlinesFile = null;

        if (files.length === 1) {
            const name = files[0].name.toLowerCase();
            if (name.includes('path') || name.includes('line') || name.includes('flow')) {
                pathlinesFile = files[0];
            } else {
                meshFile = files[0];
            }
        } else {
            files.forEach(f => {
                const name = f.name.toLowerCase();
                if (name.includes('path') || name.includes('line') || name.includes('flow')) {
                    pathlinesFile = f;
                } else if (name.includes('mesh') || name.includes('wall') || name.includes('organ')) {
                    meshFile = f;
                }
            });

            if (!meshFile && !pathlinesFile && files.length >= 2) {
                meshFile = files[0]; pathlinesFile = files[1];
            }
        }

        if (meshFile) {
            if (window.app && window.app.setSectionUploadedMesh) {
                await window.app.setSectionUploadedMesh(sectionIndex, URL.createObjectURL(meshFile), meshFile.name);
            }
            await editorState.writeUploadedModel(sectionIndex, meshFile, 'mesh');
            editorState.updatePath(`uploadedMesh.${sectionIndex}`, { name: meshFile.name });
        }

        if (pathlinesFile) {
            if (window.app && window.app.setSectionUploadedPathlines) {
                await window.app.setSectionUploadedPathlines(sectionIndex, URL.createObjectURL(pathlinesFile), pathlinesFile.name);
            }
            await editorState.writeUploadedModel(sectionIndex, pathlinesFile, 'pathlines');
            editorState.updatePath(`uploadedPathlines.${sectionIndex}`, { name: pathlinesFile.name });
        }

        shell.setStatus('Modelle verarbeitet', 'saved');
    }

    function openProperties(elementIndex, sectionIndex) {
        const section = storyConfig.sections[sectionIndex];
        const element = elementIndex !== null ? section?.elements?.[elementIndex] : null;
        
        if (elementIndex !== null && !element) return;
        
        shell.setHasProperties(true);
        propertyEditor.render(element, elementIndex, sectionIndex, storyConfig);
    }

    function closeProperties() {
        shell.setHasProperties(false);
    }

    function updateState(nextState, message = 'Gespeichert') {
        harvestCurrentEdits();
        editorState.writeState(nextState);
        shell.setStatus(message, 'saved');
    }

    function harvestCurrentEdits() {
        document.querySelectorAll('[data-edit-path]').forEach(node => {
            if (active && node.contentEditable === 'true') {
                const path = node.dataset.editPath;
                const value = node.innerHTML.trim();
                if (editorState.getValue(path) !== value) {
                    setDeepValue(editorState.state, path, value);
                }
            }
        });
    }

    function createElement(type) {
        const presets = {
            heading: { type: 'heading', text: 'Neue Überschrift' },
            text: { type: 'text', text: 'Neuer Infotext' },
            image: { type: 'image', src: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800', alt: 'Aorta', caption: 'Bildunterschrift' },
            video: { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'Video Titel' },
            stat: { type: 'stat', icon: 'A', label: 'Info:', text: 'Zusatzinformation' },
            meter: { type: 'chart', chartType: 'meter', label: 'Messwert', value: 75, caption: 'Details' },
            bars: { type: 'chart', chartType: 'bars', label: 'Vergleich', items: [{ label: 'A', value: 40 }, { label: 'B', value: 80 }] },
            split: { type: 'chart', chartType: 'split', label: 'Aufteilung', items: [{ label: 'Teil 1', value: 50 }, { label: 'Teil 2', value: 50 }] },
            barchart: { type: 'chart', chartType: 'barchart', label: 'D3 Balken', items: [{ label: 'Jan', value: 30 }, { label: 'Feb', value: 50 }, { label: 'Mrz', value: 80 }] },
            piechart: { type: 'chart', chartType: 'piechart', label: 'D3 Pie', items: [{ label: 'X', value: 20 }, { label: 'Y', value: 30 }, { label: 'Z', value: 50 }] },
            treemap: { type: 'chart', chartType: 'treemap', label: 'D3 Treemap', items: [{ label: 'A', value: 100 }, { label: 'B', value: 50 }, { label: 'C', value: 30 }] },
            'animated-treemap': { type: 'chart', chartType: 'animated-treemap', label: 'D3 Animated Treemap', items: [] }
        };
        return presets[type] || presets.text;
    }

    function addElementToSection(sectionIndex, type, insertIndex = null) {
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const elements = getCurrentElements(nextState, sectionIndex);
        const nextIndex = insertIndex === null ? elements.length : Math.max(0, Math.min(insertIndex, elements.length));
        elements.splice(nextIndex, 0, createElement(type));
        getMutableSection(nextState, sectionIndex).elements = elements;
        updateState(nextState, 'Element hinzugefuegt');
    }

    function addSection() {
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const nextNum = storyConfig.sections.length + 1;
        nextState.extraSections = [...(nextState.extraSections || []), {
            title: `${nextNum}. Neue Sektion`,
            elements: [{ type: 'heading', text: 'Inhalt strukturieren' }]
        }];
        nextState.sectionOrder = [...getSectionOrder(), `extra:${nextState.extraSections.length - 1}`];
        updateState(nextState, 'Sektion hinzugefuegt');
    }

    function deleteElement(sectionIndex, elementIndex) {
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const currentElements = getCurrentElements(nextState, sectionIndex);
        getMutableSection(nextState, sectionIndex).elements = currentElements.filter((_, i) => i !== elementIndex);
        updateState(nextState, 'Element entfernt');
    }

    function moveElement(fromSectionIdx, elementIndex, toSectionIdx, insertIdx = null) {
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const fromElements = getCurrentElements(nextState, fromSectionIdx);
        const [element] = fromElements.splice(elementIndex, 1);
        if (!element) return;
        const same = fromSectionIdx === toSectionIdx;
        const toElements = same ? fromElements : getCurrentElements(nextState, toSectionIdx);
        let targetIdx = insertIdx === null ? toElements.length : Math.max(0, Math.min(insertIdx, toElements.length));
        if (same && insertIdx !== null && elementIndex < targetIdx) targetIdx -= 1;
        toElements.splice(targetIdx, 0, element);
        getMutableSection(nextState, fromSectionIdx).elements = fromElements;
        getMutableSection(nextState, toSectionIdx).elements = toElements;
        updateState(nextState, 'Element verschoben');
    }

    function duplicateElement(sectionIdx, elementIdx) {
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const elements = getCurrentElements(nextState, sectionIdx);
        if (elements[elementIdx]) elements.splice(elementIdx + 1, 0, cloneConfig(elements[elementIdx]));
        getMutableSection(nextState, sectionIdx).elements = elements;
        updateState(nextState, 'Element dupliziert');
    }

    function reorderSections(fromIdx, toIdx) {
        if (fromIdx === toIdx) return;
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const order = getSectionOrder();
        const [id] = order.splice(fromIdx, 1);
        order.splice(Math.max(0, Math.min(toIdx, order.length)), 0, id);
        nextState.sectionOrder = order;
        updateState(nextState, 'Struktur geaendert');
    }

    function duplicateSection(idx) {
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const order = getSectionOrder();
        const sectionId = order[idx];
        const [kind, rawIdx] = sectionId.split(':');
        const sourceIdx = Number(rawIdx);
        const original = kind === 'extra' ? nextState.extraSections[sourceIdx] : storyConfig.sections[idx];
        
        if (!nextState.extraSections) nextState.extraSections = [];
        nextState.extraSections.push(cloneConfig(original));
        order.splice(idx + 1, 0, `extra:${nextState.extraSections.length - 1}`);
        nextState.sectionOrder = order;
        updateState(nextState, 'Sektion kopiert');
    }

    function deleteSection(idx) {
        if (!confirm('Sektion loeschen?')) return;
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        const order = getSectionOrder();
        order.splice(idx, 1);
        nextState.sectionOrder = order;
        updateState(nextState, 'Sektion entfernt');
    }

    function addNavItem() {
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        if (!nextState.nav) nextState.nav = storyConfig.nav.map(n => ({ ...n }));
        nextState.nav.push({ href: '#s1', label: 'Neues Kapitel' });
        updateState(nextState, 'Navigation erweitert');
    }

    function deleteNavItem(idx) {
        if (!confirm('Kapitel loeschen?')) return;
        harvestCurrentEdits();
        const nextState = cloneConfig(editorState.state);
        if (!nextState.nav) nextState.nav = storyConfig.nav.map(n => ({ ...n }));
        nextState.nav.splice(idx, 1);
        updateState(nextState, 'Navigation gekuerzt');
    }

    function updateNavItem(idx, prop, value) {
        const nextState = cloneConfig(editorState.state);
        if (!nextState.nav) nextState.nav = storyConfig.nav.map(n => ({ ...n }));
        if (prop === 'label') nextState.nav[idx].label = value;
        if (prop === 'target') nextState.nav[idx].href = value;
        updateState(nextState, 'Link aktualisiert');
    }

    function getSectionOrder() {
        return storyConfig.sections.map(s => s.__sectionId || `base:${storyConfig.sections.indexOf(s)}`);
    }

    function getMutableSection(nextState, sectionIdx) {
        const sectionId = storyConfig.sections[sectionIdx]?.__sectionId || `base:${sectionIdx}`;
        const [kind, rawIdx] = sectionId.split(':');
        const sourceIdx = Number(rawIdx);
        if (kind === 'extra') {
            if (!nextState.extraSections) nextState.extraSections = [];
            if (!nextState.extraSections[sourceIdx]) nextState.extraSections[sourceIdx] = cloneConfig(storyConfig.sections[sectionIdx]);
            return nextState.extraSections[sourceIdx];
        }
        if (!nextState.sections) nextState.sections = [];
        if (!nextState.sections[sourceIdx]) nextState.sections[sourceIdx] = {};
        return nextState.sections[sourceIdx];
    }

    function getCurrentElements(nextState, sectionIdx) {
        const mutable = getMutableSection(nextState, sectionIdx);
        return [...(mutable.elements || storyConfig.sections[sectionIdx]?.elements || [])];
    }

    function setActive(nextActive) {
        active = nextActive;
        localStorage.setItem('editor-mode-active', String(active));
        document.body.classList.toggle('editor-mode', active);
        toggle?.setAttribute('aria-pressed', String(active));
        
        // Ensure sidebar visibility matches active state
        if (shell && shell.element) {
            shell.element.style.display = active ? 'flex' : 'none';
        }

        setupEditableListeners();
        syncPanel();
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }

    function setupEditableListeners() {
        document.querySelectorAll('[data-edit-path]').forEach((node) => {
            node.contentEditable = active ? 'true' : 'false';
            node.spellcheck = active;
            const newNode = node.cloneNode(true);
            node.parentNode.replaceChild(newNode, node);
            newNode.addEventListener('click', (event) => {
                if (!active) return;
                event.preventDefault(); event.stopPropagation();
                document.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));
                newNode.closest('[data-editor-element]')?.classList.add('is-selected');
                showQuickToolbar(newNode);
            });
            newNode.addEventListener('blur', () => active && saveEditableValue(newNode));
            newNode.addEventListener('input', () => active && shell.setStatus('Änderung...', 'dirty'));
        });

        document.querySelectorAll('.text-box').forEach(box => {
            if (active) {
                box.addEventListener('click', (e) => {
                    // Prevent triggering when clicking inside an actual element, or directly editable text
                    if (e.target.closest('[data-editor-element]') || e.target.closest('[data-edit-path]')) return;
                    
                    e.stopPropagation();
                    
                    // Remove selection from previous
                    document.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));
                    
                    // Add selection to this one
                    box.classList.add('is-selected');
                    
                    const sectionIdx = Number(box.closest('.step').dataset.sectionIndex);
                    
                    // Open properties for the section itself
                    shell.setActiveTab('navigator');
                    updatePanelForSection(sectionIdx);
                    openProperties(null, sectionIdx); // null indicates section-level edit
                });
            }
        });

        document.querySelectorAll('[data-editor-element]').forEach((node) => {
            if (active) {
                const step = node.closest('.step');
                const sIdx = Number(step.dataset.sectionIndex);
                const eIdx = Number(node.dataset.editorElement);
                dragDropManager.setupStoryElementDraggable(node, sIdx, eIdx);
                node.addEventListener('click', (e) => {
                    const actionBtn = e.target.closest('[data-editor-action]');
                    if (actionBtn) {
                        e.stopPropagation();
                        handleAction(actionBtn.dataset.editorAction, { ...actionBtn.dataset, elementIndex: eIdx, sectionIndex: sIdx });
                        return;
                    }

                    // If user clicks the wrapper itself (info card), open section properties
                    if (e.target.closest('.element-wrapper') && !e.target.closest('[data-edit-path]')) {
                        e.stopPropagation();
                        document.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));
                        node.classList.add('is-selected');
                        shell.setActiveTab('navigator');
                        updatePanelForSection(sIdx);
                        openProperties(null, sIdx); // null indicates section-level edit
                        return;
                    }

                    e.stopPropagation();
                    document.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));
                    node.classList.add('is-selected');
                    shell.setActiveTab('navigator');
                    updatePanelForSection(sIdx);
                    openProperties(eIdx, sIdx);
                });
            } else node.draggable = false;
        });
    }

    function saveEditableValue(element) {
        editorState.updatePath(element.dataset.editPath, element.innerHTML.trim());
    }

    function createQuickToolbar() {
        const tb = document.createElement('div');
        tb.className = 'editor-quick-toolbar';
        tb.innerHTML = `
            <button type="button" data-quick-action="edit">✎</button>
            <button type="button" data-quick-action="duplicate">❐</button>
            <button type="button" data-quick-action="move-up">↑</button>
            <button type="button" data-quick-action="move-down">↓</button>
            <button type="button" data-quick-action="delete">×</button>
        `;
        tb.addEventListener('click', handleQuickAction);
        return tb;
    }

    function showQuickToolbar(node) {
        const path = node.dataset.editPath || node.closest('[data-edit-path]')?.dataset.editPath;
        if (!path) return;
        const parts = path.split('.');
        let sIdx = -1, eIdx = -1;
        if (parts[0] === 'sections' || parts[0] === 'extraSections') {
            const rawIdx = Number(parts[1]);
            sIdx = parts[0] === 'sections' ? storyConfig.sections.findIndex(s => s.__baseIndex === rawIdx) : storyConfig.sections.findIndex(s => s.__extraIndex === rawIdx);
            if (sIdx === -1) sIdx = rawIdx;
            if (parts[2] === 'elements') eIdx = Number(parts[3]);
        }
        activeElementInfo = { node, path, sectionIndex: sIdx, elementIndex: eIdx };
        const rect = node.getBoundingClientRect();
        quickToolbar.style.display = 'flex';
        quickToolbar.style.top = `${window.scrollY + rect.top - 40}px`;
        quickToolbar.style.left = `${rect.left}px`;
    }

    function handleQuickAction(event) {
        const action = event.target.closest('[data-quick-action]')?.dataset.quickAction;
        if (!action || !activeElementInfo) return;
        const { sectionIndex, elementIndex, node } = activeElementInfo;
        if (action === 'edit') { if (elementIndex >= 0) openProperties(elementIndex, sectionIndex); else node.focus(); }
        if (action === 'duplicate' && elementIndex >= 0) duplicateElement(sectionIndex, elementIndex);
        if (action === 'move-up' && elementIndex > 0) moveElement(sectionIndex, elementIndex, sectionIndex, elementIndex - 1);
        if (action === 'move-down') moveElement(sectionIndex, elementIndex, sectionIndex, elementIndex + 1);
        if (action === 'delete' && elementIndex >= 0) deleteElement(sectionIndex, elementIndex);
        quickToolbar.style.display = 'none';
    }

    function handleExport() {
        const data = JSON.stringify(exportState(), null, 2);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
        a.download = `scrollytelling-export.json`;
        a.click();
    }

    function handleImport(e) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const newState = JSON.parse(event.target.result);
            if (newState.changes) {
                editorState.writeState(newState.changes);
                window.location.reload();
            }
        };
        reader.readAsText(e.target.files[0]);
    }

    editorState.on('change', (newState) => {
        state = newState;
        storyConfig = editorState.getEffectiveConfig();
        shell.updateStoryTitle(storyConfig.title);
        syncPanel();
        setupEditableListeners();
    });

    toggle?.addEventListener('click', () => setActive(!active));
    window.addEventListener('scroll', () => { syncPanel(); quickToolbar.style.display = 'none'; }, { passive: true });
    document.addEventListener('click', (e) => { if (!quickToolbar.contains(e.target) && !e.target.hasAttribute('data-edit-path')) quickToolbar.style.display = 'none'; });

    setActive(active);
}
