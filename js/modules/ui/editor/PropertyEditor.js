import { iconLibrary } from '../../storyRenderer.js';

/**
 * PropertyEditor renders the inspector window for sections and elements.
 */
export class PropertyEditor {
    constructor({ container, editorState, onAction }) {
        this.container = container;
        this.editorState = editorState;
        this.onAction = onAction;
        this.activeTab = 'content';
    }

    render(element, elementIndex, sectionIndex, storyConfig) {
        this.element = element;
        this.elementIndex = elementIndex;
        this.sectionIndex = sectionIndex;
        this.storyConfig = storyConfig;

        const isSection = element === null;
        const section = storyConfig.sections[sectionIndex];
        const basePath = Number.isInteger(section.__extraIndex)
            ? `extraSections.${section.__extraIndex}${isSection ? '' : `.elements.${elementIndex}`}`
            : `sections.${section.__baseIndex ?? sectionIndex}${isSection ? '' : `.elements.${elementIndex}`}`;

        this.container.innerHTML = `
            <div class="property-window-shell">
                <div class="property-window-head">
                    <div class="property-window-title">
                        <span class="property-window-kicker">${isSection ? 'Sektion' : 'Element'}</span>
                        <strong>${isSection ? 'Eigenschaften der Sektion' : 'Element-Eigenschaften'}</strong>
                    </div>
                    <div class="editor-tabs property-tabs">
                        <button type="button" class="editor-tab-btn ${this.activeTab === 'content' ? 'is-active' : ''}" data-prop-tab="content">${isSection ? 'Allgemein' : 'Inhalt'}</button>
                        <button type="button" class="editor-tab-btn ${this.activeTab === 'style' ? 'is-active' : ''}" data-prop-tab="style">Stil</button>
                    </div>
                </div>
                <div class="property-window-body">
                    ${isSection
                        ? (this.activeTab === 'content' ? this.renderSectionContentTab(basePath) : this.renderSectionStyleTab(basePath))
                        : (this.activeTab === 'content' ? this.renderContentTab(basePath) : this.renderStyleTab(basePath))}
                </div>
            </div>
        `;

        this.setupEventListeners(basePath);
    }

    renderSectionContentTab(basePath) {
        const section = this.storyConfig.sections[this.sectionIndex];

        return `
            <div class="property-card">
                <div class="property-card-head">
                    <strong>Grunddaten</strong>
                    <span>Titel und Struktur</span>
                </div>
                <div class="editor-row">
                    <label>Sektionstitel</label>
                    <input type="text" data-prop-path="${basePath}.title" value="${section.title || ''}">
                </div>
            </div>

            <div class="property-card">
                <div class="property-card-head">
                    <strong>Layout & Struktur</strong>
                    <span>Ansicht der Karte</span>
                </div>
                <div class="editor-row">
                    <label>Layout</label>
                    <select data-prop-path="${basePath}.layout">
                        <option value="split" ${section.layout === 'split' ? 'selected' : ''}>Geteilt (3D + Text)</option>
                        <option value="full" ${section.layout === 'full' ? 'selected' : ''}>Einspaltig (Nur Text)</option>
                    </select>
                </div>
                <div class="editor-row">
                    <label>Inhalt-Spalten</label>
                    <select data-prop-path="${basePath}.columns">
                        <option value="1" ${section.columns === '1' ? 'selected' : ''}>1 Spalte</option>
                        <option value="2" ${section.columns === '2' ? 'selected' : ''}>2 Spalte</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderSectionStyleTab(basePath) {
        const section = this.storyConfig.sections[this.sectionIndex];
        const state = this.editorState.state;
        const style = section.style || {};
        const meshStyle = section.meshStyle || { opacity: 100, color: '#ffffff', posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0 };
        const pathStyle = section.pathStyle || { opacity: 100, color: '#ffffff', posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0 };
        const meshCoupled = section.meshCoupled !== false;
        
        const meshFile = state.uploadedMesh?.[this.sectionIndex]?.name;
        const pathlinesFile = state.uploadedPathlines?.[this.sectionIndex]?.name;

        const renderTransformControls = (prefix, data, label) => `
            <div class="property-card">
                <div class="property-card-head">
                    <strong>${label} Transformation</strong>
                    <span>Position und Rotation</span>
                </div>
                <div class="editor-grid-3">
                    <div class="editor-row mini">
                        <label>Pos X</label>
                        <input type="number" data-prop-path="${basePath}.${prefix}.posX" value="${data.posX || 0}" step="10">
                    </div>
                    <div class="editor-row mini">
                        <label>Pos Y</label>
                        <input type="number" data-prop-path="${basePath}.${prefix}.posY" value="${data.posY || 0}" step="100">
                    </div>
                    <div class="editor-row mini">
                        <label>Pos Z</label>
                        <input type="number" data-prop-path="${basePath}.${prefix}.posZ" value="${data.posZ || 0}" step="10">
                    </div>
                </div>
                <div class="editor-grid-3">
                    <div class="editor-row mini">
                        <label>Rot X°</label>
                        <input type="number" data-prop-path="${basePath}.${prefix}.rotX" value="${data.rotX || 0}">
                    </div>
                    <div class="editor-row mini">
                        <label>Rot Y°</label>
                        <input type="number" data-prop-path="${basePath}.${prefix}.rotY" value="${data.rotY || 0}">
                    </div>
                    <div class="editor-row mini">
                        <label>Rot Z°</label>
                        <input type="number" data-prop-path="${basePath}.${prefix}.rotZ" value="${data.rotZ || 0}">
                    </div>
                </div>
            </div>
        `;

        const flowSettings = section.flowSettings || {};

        return `
            <div class="property-card">
                <div class="property-card-head">
                    <strong>3D Assets & Kopplung</strong>
                    <span>Dateien und Synchronisation</span>
                </div>
                <div class="editor-row">
                    <label>Mesh ${meshFile ? `<span class="inline-file-name">(${meshFile})</span>` : '<span class="inline-file-name">(keins)</span>'}</label>
                    <input type="file" data-action="upload-mesh" data-section-index="${this.sectionIndex}" accept=".glb">
                    <button type="button" class="editor-btn-sm" data-action="delete-mesh" data-section-index="${this.sectionIndex}" ${meshFile ? '' : 'disabled'}>Löschen</button>
                </div>
                <div class="editor-row">
                    <label>Pathlines ${pathlinesFile ? `<span class="inline-file-name">(${pathlinesFile})</span>` : '<span class="inline-file-name">(keins)</span>'}</label>
                    <input type="file" data-action="upload-pathlines" data-section-index="${this.sectionIndex}" accept=".glb">
                    <button type="button" class="editor-btn-sm" data-action="delete-pathlines" data-section-index="${this.sectionIndex}" ${pathlinesFile ? '' : 'disabled'}>Löschen</button>
                </div>
                <div class="editor-switch-row" style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                    <div>
                        <strong>Transformationen koppeln</strong>
                        <small>Mesh & Pathlines zusammen bewegen</small>
                    </div>
                    <input type="checkbox" data-prop-path="${basePath}.meshCoupled" id="mesh-coupled-toggle" ${meshCoupled ? 'checked' : ''}>
                </div>
            </div>

            ${meshCoupled 
                ? renderTransformControls('meshStyle', meshStyle, 'Gemeinsame') 
                : renderTransformControls('meshStyle', meshStyle, 'Mesh')}
            
            ${!meshCoupled ? renderTransformControls('pathStyle', pathStyle, 'Pathlines') : ''}

            <div class="property-card">
                <div class="property-card-head">
                    <strong>Allgemeiner Stil</strong>
                    <span>Fläche und Kontrast</span>
                </div>
                <div class="editor-row range-row">
                    <label>Hintergrund-Transparenz <output>${style.opacity !== undefined ? style.opacity : 80}%</output></label>
                    <input type="range" data-prop-path="${basePath}.style.opacity" min="0" max="100" value="${style.opacity !== undefined ? style.opacity : 80}">
                </div>
                <div class="editor-row range-row">
                    <label>Hintergrund-Unschärfe (Blur) <output>${style.blur !== undefined ? style.blur : 18}px</output></label>
                    <input type="range" data-prop-path="${basePath}.style.blur" min="0" max="40" value="${style.blur !== undefined ? style.blur : 18}">
                </div>
                <div class="editor-row range-row">
                    <label>Karten-Breite (px) <output>${style.width || 520}px</output></label>
                    <input type="range" data-prop-path="${basePath}.style.width" min="300" max="1200" value="${style.width || 520}" step="10">
                </div>
            </div>

            <div class="property-card">
                <div class="property-card-head">
                    <strong>Flow-Visualisierung</strong>
                    <span>Glyphen und Streamlines</span>
                </div>
                
                <div class="editor-row">
                    <label>Glyph-Typ</label>
                    <select data-prop-path="${basePath}.flowSettings.glyphType">
                        <option value="Cone" ${flowSettings.glyphType === 'Cone' ? 'selected' : ''}>Kegel (Standard)</option>
                        <option value="Sphere" ${flowSettings.glyphType === 'Sphere' ? 'selected' : ''}>Kugel</option>
                        <option value="Box" ${flowSettings.glyphType === 'Box' ? 'selected' : ''}>Box</option>
                        <option value="Arrow" ${flowSettings.glyphType === 'Arrow' ? 'selected' : ''}>Pfeil</option>
                    </select>
                </div>
                <div class="editor-row">
                    <label>Glyph-Größe</label>
                    <input type="number" data-prop-path="${basePath}.flowSettings.glyphSize" value="${flowSettings.glyphSize || 1.5}" step="0.1">
                </div>
                <div class="editor-row">
                    <label>Anzahl Glyphen</label>
                    <input type="number" data-prop-path="${basePath}.flowSettings.count" value="${flowSettings.count || 800}" step="100">
                </div>
                <div class="editor-row range-row">
                    <label>Geschwindigkeit <output>${flowSettings.speedMultiplier || 0.5}</output></label>
                    <input type="range" data-prop-path="${basePath}.flowSettings.speedMultiplier" min="0" max="2" value="${flowSettings.speedMultiplier || 0.5}" step="0.1">
                </div>
                <div class="editor-row range-row">
                    <label>Turbulenz <output>${flowSettings.turbulence || 0.2}</output></label>
                    <input type="range" data-prop-path="${basePath}.flowSettings.turbulence" min="0" max="5" value="${flowSettings.turbulence || 0.2}" step="0.1">
                </div>
                <div class="editor-row">
                    <label>Bewegungs-Modus</label>
                    <select data-prop-path="${basePath}.flowSettings.moveMode">
                        <option value="Spline" ${flowSettings.moveMode === 'Spline' ? 'selected' : ''}>Spline (Glatte Kurve)</option>
                        <option value="Linear" ${flowSettings.moveMode === 'Linear' ? 'selected' : ''}>Linear (Punkt zu Punkt)</option>
                        <option value="Step" ${flowSettings.moveMode === 'Step' ? 'selected' : ''}>Step (Diskret)</option>
                    </select>
                </div>
                
                <div style="margin: 15px 0; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                    <strong>Streamlines (Pfadlinien)</strong>
                </div>
                
                <div class="editor-switch-row">
                    <div>
                        <strong>Pfade anzeigen</strong>
                    </div>
                    <input type="checkbox" data-prop-path="${basePath}.flowSettings.showPaths" ${flowSettings.showPaths ? 'checked' : ''}>
                </div>
                <div class="editor-row">
                    <label>Pfad-Stil</label>
                    <select data-prop-path="${basePath}.flowSettings.pathStyle">
                        <option value="Line" ${flowSettings.pathStyle === 'Line' ? 'selected' : ''}>Einfache Linie</option>
                        <option value="Tube" ${flowSettings.pathStyle === 'Tube' ? 'selected' : ''}>Röhre (3D)</option>
                        <option value="Flow" ${flowSettings.pathStyle === 'Flow' ? 'selected' : ''}>Fließend (Animiert)</option>
                        <option value="Comets" ${flowSettings.pathStyle === 'Comets' ? 'selected' : ''}>Kometen (Stark animiert)</option>
                    </select>
                </div>
                <div class="editor-row range-row">
                    <label>Pfad-Breite <output>${flowSettings.pathWidth || 1.2}</output></label>
                    <input type="range" data-prop-path="${basePath}.flowSettings.pathWidth" min="0.1" max="5" value="${flowSettings.pathWidth || 1.2}" step="0.1">
                </div>
                <div class="editor-row">
                    <label>Pfad-Farbe</label>
                    <input type="color" data-prop-path="${basePath}.flowSettings.pathColor" value="${flowSettings.pathColor || '#ffffff'}">
                </div>
            </div>

            <div class="property-card">
                <div class="property-card-head">
                    <strong>Mesh Material</strong>
                    <span>Farbe und Sichtbarkeit</span>
                </div>
                <div class="editor-row">
                    <label>Farbe</label>
                    <input type="color" data-prop-path="${basePath}.meshStyle.color" value="${meshStyle.color || '#ffffff'}">
                </div>
                <div class="editor-row range-row">
                    <label>Transparenz (%) <output>${meshStyle.opacity !== undefined ? meshStyle.opacity : 100}%</output></label>
                    <input type="range" data-prop-path="${basePath}.meshStyle.opacity" min="0" max="100" value="${meshStyle.opacity !== undefined ? meshStyle.opacity : 100}">
                </div>
            </div>

            <div class="property-card">
                <div class="property-card-head">
                    <strong>Pathlines Material</strong>
                    <span>Farbe und Sichtbarkeit</span>
                </div>
                <div class="editor-row">
                    <label>Farbe</label>
                    <input type="color" data-prop-path="${basePath}.pathStyle.color" value="${pathStyle.color || '#ffffff'}">
                </div>
                <div class="editor-row range-row">
                    <label>Transparenz (%) <output>${pathStyle.opacity !== undefined ? pathStyle.opacity : 100}%</output></label>
                    <input type="range" data-prop-path="${basePath}.pathStyle.opacity" min="0" max="100" value="${pathStyle.opacity !== undefined ? pathStyle.opacity : 100}">
                </div>
            </div>

            <div class="property-card">
                <div class="property-card-head">
                    <strong>Erweiterte Modell-Optionen</strong>
                    <span>Visuelle Effekte</span>
                </div>
                <div class="editor-switch-row">
                    <div>
                        <strong>Wireframe</strong>
                        <small>Gittermodell anzeigen</small>
                    </div>
                    <input type="checkbox" data-prop-path="${basePath}.meshStyle.wireframe" ${meshStyle.wireframe ? 'checked' : ''}>
                </div>
                <div class="editor-switch-row">
                    <div>
                        <strong>Ghost-Modus</strong>
                        <small>Röntgen-Effekt (X-Ray)</small>
                    </div>
                    <input type="checkbox" data-prop-path="${basePath}.meshStyle.ghosting" ${meshStyle.ghosting ? 'checked' : ''}>
                </div>
                <div class="editor-switch-row">
                    <div>
                        <strong>Auto-Rotation</strong>
                        <small>Modell langsam drehen</small>
                    </div>
                    <input type="checkbox" data-prop-path="${basePath}.meshStyle.autoRotate" ${meshStyle.autoRotate ? 'checked' : ''}>
                </div>
            </div>
        `;
    }

    renderContentTab(basePath) {
        const element = this.element;
        let html = '';

        if (['text', 'heading', 'quote'].includes(element.type)) {
            html += `
                <div class="property-card">
                    <div class="property-card-head">
                        <strong>Textinhalt</strong>
                        <span>Editierbarer Inhalt</span>
                    </div>
                    <div class="editor-row">
                        <label>Inhalt</label>
                        <textarea data-prop-path="${basePath}.text">${element.text || ''}</textarea>
                    </div>
                </div>
            `;
            if (element.type === 'quote') {
                html += `
                    <div class="property-card">
                        <div class="property-card-head">
                            <strong>Quelle</strong>
                            <span>Zitierangabe</span>
                        </div>
                        <div class="editor-row">
                            <label>Quelle</label>
                            <input type="text" data-prop-path="${basePath}.author" value="${element.author || ''}">
                        </div>
                    </div>
                `;
            }
        } else if (element.type === 'image') {
            html += `
                <div class="property-card">
                    <div class="property-card-head">
                        <strong>Bild</strong>
                        <span>Quelle und Beschreibung</span>
                    </div>
                    <div class="editor-row">
                        <label>Bild URL</label>
                        <input type="text" data-prop-path="${basePath}.src" value="${element.src || ''}">
                    </div>
                    <div class="editor-row">
                        <label>Unterschrift</label>
                        <input type="text" data-prop-path="${basePath}.caption" value="${element.caption || ''}">
                    </div>
                </div>
            `;
        } else if (element.type === 'video') {
            html += `
                <div class="property-card">
                    <div class="property-card-head">
                        <strong>Video</strong>
                        <span>Embed URL</span>
                    </div>
                    <div class="editor-row">
                        <label>Embed URL</label>
                        <input type="text" data-prop-path="${basePath}.url" value="${element.url || ''}">
                    </div>
                </div>
            `;
        } else if (element.type === 'stat') {
            html += `
                <div class="property-card">
                    <div class="property-card-head">
                        <strong>Stat-Karte</strong>
                        <span>Icon und Text</span>
                    </div>
                    <div class="editor-row">
                        <label>Icon</label>
                        <div class="editor-icon-picker">
                            ${Object.keys(iconLibrary).map(name => `
                                <button type="button" class="icon-picker-btn ${element.icon === name ? 'is-active' : ''}" data-prop-path="${basePath}.icon" data-value="${name}" title="${name}" aria-label="${name}">
                                    <svg viewBox="0 0 24 24">${iconLibrary[name]}</svg>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="editor-row">
                        <label>Label</label>
                        <input type="text" data-prop-path="${basePath}.label" value="${element.label || ''}">
                    </div>
                    <div class="editor-row">
                        <label>Beschreibung</label>
                        <textarea data-prop-path="${basePath}.text">${element.text || ''}</textarea>
                    </div>
                </div>
            `;
        } else if (element.type === 'chart') {
            html += `
                <div class="property-card">
                    <div class="property-card-head">
                        <strong>Diagramm</strong>
                        <span>Titel</span>
                    </div>
                    <div class="editor-row">
                        <label>Titel</label>
                        <input type="text" data-prop-path="${basePath}.label" value="${element.label || ''}">
                    </div>
                </div>
            `;
            if (element.chartType === 'meter') {
                html += `
                    <div class="property-card">
                        <div class="property-card-head">
                            <strong>Wert</strong>
                            <span>Meter</span>
                        </div>
                        <div class="editor-row">
                            <label>Wert (%)</label>
                            <input type="number" data-prop-path="${basePath}.value" value="${element.value || 0}" min="0" max="100">
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="property-card">
                        <div class="property-card-head">
                            <strong>Datenpunkte</strong>
                            <button type="button" class="add-chart-item editor-btn-sm" data-path="${basePath}.items">+ Punkt</button>
                        </div>
                        <div class="chart-items-list">
                            ${(element.items || []).map((item, idx) => `
                                <div class="chart-item-editor">
                                    <button type="button" class="delete-chart-item" data-path="${basePath}.items" data-index="${idx}" aria-label="Punkt löschen">&times;</button>
                                    <div class="editor-row">
                                        <label>Label</label>
                                        <input type="text" data-prop-path="${basePath}.items.${idx}.label" value="${item.label || ''}">
                                    </div>
                                    <div class="editor-row">
                                        <label>Wert</label>
                                        <input type="number" data-prop-path="${basePath}.items.${idx}.value" value="${item.value || 0}">
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }

        return html || '<div class="editor-empty-state">Keine inhaltlichen Optionen vorhanden.</div>';
    }

    renderStyleTab(basePath) {
        const element = this.element;
        let html = `
            <div class="property-card">
                <div class="property-card-head">
                    <strong>Ausrichtung</strong>
                    <span>Text-Alignment</span>
                </div>
                <div class="editor-segment-row">
                    <button type="button" class="editor-style-btn" data-prop-path="${basePath}.align" data-value="left">Links</button>
                    <button type="button" class="editor-style-btn" data-prop-path="${basePath}.align" data-value="center">Mitte</button>
                    <button type="button" class="editor-style-btn" data-prop-path="${basePath}.align" data-value="right">Rechts</button>
                </div>
            </div>
        `;

        if (element.type === 'chart' || element.type === 'stat') {
            html += `
                <div class="property-card">
                    <div class="property-card-head">
                        <strong>Farbe & Form</strong>
                        <span>Visuelles Styling</span>
                    </div>
                    <div class="editor-row">
                        <label>Akzentfarbe</label>
                        <input type="color" data-prop-path="${basePath}.color" value="${element.color || '#ff4444'}">
                    </div>
                    <div class="editor-switch-row compact">
                        <div>
                            <strong>Abgerundet</strong>
                            <small>Weichere Ecken für das Element</small>
                        </div>
                        <input type="checkbox" data-prop-path="${basePath}.rounded" id="style-rounded" ${element.rounded ? 'checked' : ''}>
                    </div>
                </div>
            `;
        }

        return html;
    }

    setupEventListeners(basePath) {
        this.container.querySelectorAll('[data-prop-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeTab = btn.dataset.propTab;
                this.render(this.element, this.elementIndex, this.sectionIndex, this.storyConfig);
            });
        });

        this.container.querySelectorAll('input[type="file"][data-action], button[data-action]').forEach(input => {
            input.addEventListener('click', () => {
                const action = input.dataset.action;
                if (!action) return;
                const sectionIndex = Number(input.dataset.sectionIndex);
                if (action.startsWith('delete-') || action.startsWith('toggle-')) {
                    this.onAction(action, { sectionIndex });
                }
            });
            if (input.tagName === 'INPUT') {
                input.addEventListener('change', () => {
                    if (input.files?.length) {
                        this.onAction(input.dataset.action, {
                            file: input.files[0],
                            sectionIndex: Number(input.dataset.sectionIndex)
                        });
                    }
                });
            }
        });

        this.container.querySelectorAll('input:not([type="file"]), textarea, select').forEach(input => {
            const isImmediate = input.type === 'range' || input.type === 'number' || input.tagName === 'SELECT';

            input.addEventListener(isImmediate ? 'input' : 'change', () => {
                const output = input.closest('.editor-row')?.querySelector('output');
                if (output) {
                    const suffix = input.type === 'range' && input.dataset.propPath?.includes('opacity') ? '%' : 
                                   input.type === 'range' && input.dataset.propPath?.includes('blur') ? 'px' : 
                                   input.type === 'range' && input.dataset.propPath?.includes('width') ? 'px' : '';
                    output.textContent = `${input.value}${suffix}`;
                }

                const path = input.dataset.propPath;
                if (!path) return;
                const value = input.type === 'checkbox'
                    ? input.checked
                    : (input.type === 'number' || input.type === 'range' ? Number(input.value) : input.value);
                
                // Handle Coupling Synchronization (Position & Rotation)
                if (path.includes('meshStyle.') || path.includes('pathStyle.')) {
                    const section = this.storyConfig.sections[this.sectionIndex];
                    const meshCoupled = section.meshCoupled !== false;
                    
                    if (meshCoupled) {
                        const parts = path.split('.');
                        const prop = parts[parts.length - 1];
                        const transformProps = ['posX', 'posY', 'posZ', 'rotX', 'rotY', 'rotZ'];
                        
                        if (transformProps.includes(prop)) {
                            const otherPrefix = path.includes('meshStyle') ? 'pathStyle' : 'meshStyle';
                            const pathPrefix = parts.slice(0, -2).join('.');
                            const otherPath = `${pathPrefix}.${otherPrefix}.${prop}`;
                            
                            this.editorState.updatePath(path, value);
                            this.editorState.updatePath(otherPath, value);
                            return;
                        }
                    }
                }

                this.editorState.updatePath(path, value);
                if ((!isImmediate && path.split('.').length <= 2) || path.includes('meshCoupled')) {
                    this.render(this.element, this.elementIndex, this.sectionIndex, this.storyConfig);
                }
            });
        });

        this.container.querySelectorAll('.icon-picker-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.editorState.updatePath(btn.dataset.propPath, btn.dataset.value);
                this.render(this.element, this.elementIndex, this.sectionIndex, this.storyConfig);
            });
        });

        this.container.querySelector('.add-chart-item')?.addEventListener('click', (e) => {
            const path = e.target.dataset.path;
            const current = this.editorState.getValue(path) || [];
            this.editorState.updatePath(path, [...current, { label: 'Neu', value: 50, color: '#ff4444' }]);
            this.render(this.element, this.elementIndex, this.sectionIndex, this.storyConfig);
        });

        this.container.querySelectorAll('.delete-chart-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const path = btn.dataset.path;
                const idx = parseInt(btn.dataset.index, 10);
                const current = this.editorState.getValue(path) || [];
                this.editorState.updatePath(path, current.filter((_, i) => i !== idx));
                this.render(this.element, this.elementIndex, this.sectionIndex, this.storyConfig);
            });
        });
    }
}
