import { cloneConfig, setDeepValue } from './core/Utils.js';
import { chartPresets } from './storyRenderer.js';

const STORAGE_PREFIX = 'aorta-story-editor';
const DB_NAME = 'aorta-story-editor-assets';
const DB_VERSION = 1;
const MODEL_STORE = 'models';
const WINDOW_STATE_PREFIX = 'aorta-editor-state:';

/**
 * EditorState handles the persistent state of the scrollytelling content.
 * Modernized for May 2026 using EventTarget for native event handling.
 */
export class EditorState extends EventTarget {
    constructor(version, baseConfig) {
        super();
        this.version = version;
        this.baseConfig = baseConfig;
        this.memoryState = new Map();
        this.state = this.readState();
    }

    /**
     * Helper to emit change events.
     * @param {string} type 
     * @param {any} detail 
     */
    emit(type, detail) {
        this.dispatchEvent(new CustomEvent(type, { detail }));
    }

    /**
     * Compatibility layer for old .on() syntax.
     * @param {string} type 
     * @param {Function} callback 
     */
    on(type, callback) {
        this.addEventListener(type, (event) => callback(event.detail));
    }

    getStorageKey() {
        return `${STORAGE_PREFIX}:${this.version}`;
    }

    readState() {
        const key = this.getStorageKey();
        try {
            if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem(key);
                if (stored) return JSON.parse(stored);
            }
            
            // Fallback to memory or window.name
            return this.memoryState.get(key) || this._readWindowState()[key] || {};
        } catch (error) {
            console.warn('[EditorState] Failed to read state:', error);
            return {};
        }
    }

    writeState(state) {
        const key = this.getStorageKey();
        this.state = cloneConfig(state);
        this.memoryState.set(key, this.state);
        
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(this.state));
            } else {
                const windowState = this._readWindowState();
                windowState[key] = this.state;
                this._writeWindowState(windowState);
            }
        } catch (error) {
            console.warn('[EditorState] Failed to write state:', error);
        }
        
        this.emit('change', this.state);
    }

    getValue(path) {
        return this._getDeepValue(this.state, path);
    }

    updatePath(path, value) {
        const nextState = cloneConfig(this.state);
        setDeepValue(nextState, path, value);
        this.writeState(nextState);
    }

    removeState() {
        const key = this.getStorageKey();
        this.memoryState.delete(key);
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        } else {
            const windowState = this._readWindowState();
            delete windowState[key];
            this._writeWindowState(windowState);
        }
        this.state = {};
        this.emit('change', this.state);
    }

    // --- IndexedDB for large assets (Models) ---

    async writeUploadedModel(sectionIndex, file, type = 'model') {
        const db = await this._openDb();
        const key = this.getModelKey(sectionIndex, type);

        return new Promise((resolve, reject) => {
            const tx = db.transaction(MODEL_STORE, 'readwrite');
            tx.objectStore(MODEL_STORE).put({
                key,
                version: this.version,
                sectionIndex,
                modelType: type,
                name: file.name,
                size: file.size,
                mimeType: file.type || 'model/gltf-binary',
                updatedAt: new Date().toISOString(),
                file
            });
            tx.oncomplete = () => {
                db.close();
                this.emit('model-upload', { sectionIndex, file });
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(tx.error);
            };
        });
    }

    async deleteUploadedModel(sectionIndex, type = 'model') {
        const db = await this._openDb();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(MODEL_STORE, 'readwrite');
            tx.objectStore(MODEL_STORE).delete(this.getModelKey(sectionIndex, type));
            tx.objectStore(MODEL_STORE).delete(this.getLegacyModelKey(sectionIndex));
            tx.oncomplete = () => {
                db.close();
                this.emit('model-delete', { sectionIndex });
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(tx.error);
            };
        });
    }

    async getUploadedModelUrl(sectionIndex, type = 'model') {
        const db = await this._openDb();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(MODEL_STORE, 'readonly');
            const store = tx.objectStore(MODEL_STORE);
            const request = store.get(this.getModelKey(sectionIndex, type));
            request.onsuccess = () => {
                const found = request.result || null;
                if (found) {
                    db.close();
                    resolve({ ...found, url: URL.createObjectURL(found.file), type: found.modelType || found.type || type });
                    return;
                }
                const legacyRequest = store.get(this.getLegacyModelKey(sectionIndex));
                legacyRequest.onsuccess = () => {
                    db.close();
                    const entry = legacyRequest.result;
                    resolve(entry ? { ...entry, url: URL.createObjectURL(entry.file), type: entry.modelType || entry.type || type } : null);
                };
                legacyRequest.onerror = () => {
                    db.close();
                    reject(legacyRequest.error);
                };
            };
            request.onerror = () => {
                db.close();
                reject(request.error);
            };
        });
    }

    async getUploadedModelEntries() {
        const db = await this._openDb();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(MODEL_STORE, 'readonly');
            const request = tx.objectStore(MODEL_STORE).getAll();
            request.onsuccess = () => {
                db.close();
                resolve((request.result || []).filter((entry) => entry.version === this.version).map((entry) => ({
                    ...entry,
                    type: entry.modelType || entry.type || 'model'
                })));
            };
            request.onerror = () => {
                db.close();
                reject(request.error);
            };
        });
    }

    async deleteUploadedModelsForVersion() {
        const entries = await this.getUploadedModelEntries();
        await Promise.all(entries.map((entry) => this.deleteUploadedModel(entry.sectionIndex, entry.type || 'model')));
    }

    async deleteAllUploadedModels() {
        const db = await this._openDb();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(MODEL_STORE, 'readwrite');
            tx.objectStore(MODEL_STORE).clear();
            tx.oncomplete = () => {
                db.close();
                this.emit('model-delete-all', {});
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(tx.error);
            };
        });
    }

    getModelKey(sectionIndex, type = 'model') {
        return `${this.version}:${sectionIndex}:${type}`;
    }

    getLegacyModelKey(sectionIndex) {
        return `${this.version}:${sectionIndex}`;
    }

    /**
     * Merges base config with local overrides to get the final rendered state.
     */
    getEffectiveConfig() {
        const state = this.state;
        const config = cloneConfig(this.baseConfig);

        if (state.title) config.title = state.title;
        if (state.nav) config.nav = state.nav;

        // Apply section overrides and transform to unified element structure
        const transformSection = (section, index, override = {}) => {
            const merged = { ...section, ...override };
            
            // If the override has elements, we use them directly
            if (override.elements) {
                merged.elements = override.elements;
            } else {
                // Otherwise we build them from legacy properties and presets
                merged.elements = this._buildElementsFromLegacy(section, index, override);
            }

            // Cleanup legacy properties
            ['paragraphs', 'statIcon', 'statLabel', 'statText', 'chart', 'iconGrid', 'iconImages'].forEach(prop => delete merged[prop]);
            
            return merged;
        };

        if (state.sections) {
            config.sections = config.sections.map((section, index) => ({
                ...transformSection(section, index, state.sections[index]),
                __sectionId: `base:${index}`,
                __baseIndex: index
            }));
        } else {
            config.sections = config.sections.map((section, index) => ({
                ...transformSection(section, index),
                __sectionId: `base:${index}`,
                __baseIndex: index
            }));
        }

        // Add extra sections
        if (state.extraSections?.length) {
            config.sections.push(...state.extraSections.map((section, index) => ({
                ...section,
                __sectionId: `extra:${index}`,
                __extraIndex: index
            })));
        }

        // Apply custom section ordering
        if (state.sectionOrder?.length) {
            const byId = Object.fromEntries(config.sections.map(s => [s.__sectionId, s]));
            config.sections = state.sectionOrder.map(id => byId[id]).filter(Boolean);
        }

        return config;
    }

    // --- Private Helpers ---

    _getDeepValue(target, path) {
        if (!path) return undefined;
        const keys = path.split('.');
        let cursor = target;
        for (const key of keys) {
            if (cursor?.[key] === undefined) return undefined;
            cursor = cursor[key];
        }
        return cursor;
    }

    _buildElementsFromLegacy(section, index, override) {
        const elements = [];
        
        // Paragraphs to text elements
        const paragraphs = override.paragraphs || section.paragraphs || [];
        paragraphs.forEach(text => elements.push({ type: 'text', text }));

        // Stat box
        const statIcon = override.statIcon || section.statIcon;
        if (statIcon) {
            elements.push({
                type: 'stat',
                icon: statIcon,
                label: override.statLabel || section.statLabel,
                text: override.statText || section.statText
            });
        }

        // Charts from presets
        const presetChart = chartPresets[this.version]?.[index];
        if (presetChart) elements.push({ ...presetChart });

        // Icon Grids & Images
        if (section.iconGrid) elements.push({ type: 'iconGrid', items: section.iconGrid });
        if (section.iconImages) elements.push({ type: 'iconImages', items: section.iconImages });

        // Existing elements
        if (section.elements) elements.push(...section.elements);

        return elements;
    }

    _readWindowState() {
        if (typeof window === 'undefined' || !window.name?.startsWith(WINDOW_STATE_PREFIX)) return {};
        try {
            return JSON.parse(window.name.slice(WINDOW_STATE_PREFIX.length)) || {};
        } catch {
            return {};
        }
    }

    _writeWindowState(state) {
        if (typeof window !== 'undefined') {
            window.name = `${WINDOW_STATE_PREFIX}${JSON.stringify(state)}`;
        }
    }

    _openDb() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(MODEL_STORE)) {
                    db.createObjectStore(MODEL_STORE, { keyPath: 'key' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
