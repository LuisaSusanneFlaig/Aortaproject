/**
 * Utility functions for the Scrollytelling Builder.
 * Modernized for May 2026 standards.
 */

/**
 * Strips HTML tags from a string safely.
 * @param {string} value 
 * @returns {string}
 */
export function stripTags(value = '') {
    if (typeof value !== 'string') return '';
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent || '';
}

/**
 * Creates a deep copy of an object using structuredClone.
 * @param {any} config 
 * @returns {any}
 */
export function cloneConfig(config) {
    if (config === undefined) return undefined;
    try {
        return structuredClone(config);
    } catch (e) {
        // Fallback for objects that cannot be cloned by structuredClone (e.g. contains functions)
        console.warn('structuredClone failed, falling back to JSON clone', e);
        return JSON.parse(JSON.stringify(config));
    }
}

/**
 * Sets a value at a deep path in an object.
 * @param {object} target 
 * @param {string} path 
 * @param {any} value 
 */
export function setDeepValue(target, path, value) {
    if (!path) return;
    
    const keys = path.split('.');
    let cursor = target;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        
        if (cursor[key] === undefined || cursor[key] === null || typeof cursor[key] !== 'object') {
            const nextKey = keys[i + 1];
            cursor[key] = /^\d+$/.test(nextKey) ? [] : {};
        }
        cursor = cursor[key];
    }
    
    const lastKey = keys[keys.length - 1];
    console.debug(`[Utils] Setting path "${path}" to:`, value);
    cursor[lastKey] = value;
}

/**
 * Debounce function for performance optimization.
 * @param {Function} fn 
 * @param {number} delay 
 * @returns {Function}
 */
export function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}
