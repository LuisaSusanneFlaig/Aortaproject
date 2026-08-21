export const iconLibrary = {
    aorta: '<path d="M12 3c3 2 5 5 5 9 0 5-3 9-5 9s-5-4-5-9c0-4 2-7 5-9Z"/><path d="M12 8v11"/><path d="M9 11c2 1 4 1 6 0"/>',
    patient: '<circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>',
    alert: '<path d="m21 16-8.5-14-8.5 14a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3Z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    anatomy: '<path d="M12 2v20"/><path d="M8 5c-2 1-3 3-3 5 0 4 3 7 7 7"/><path d="M16 5c2 1 3 3 3 5 0 4-3 7-7 7"/>',
    split: '<path d="M12 3v18"/><path d="M6 8c3 0 3 3 6 3s3-3 6-3"/><path d="M6 16c3 0 3-3 6-3s3 3 6 3"/>',
    dna: '<path d="M17 3c0 6-10 6-10 12 0 2 1 4 3 6"/><path d="M7 3c0 6 10 6 10 12 0 2-1 4-3 6"/><path d="M8 7h8"/><path d="M8 17h8"/>',
    pressure: '<path d="M12 14a3 3 0 1 0-3-3"/><path d="M19 11a7 7 0 1 0-14 0"/><path d="M12 14v7"/><path d="M8 21h8"/>',
    symptom: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    scan: '<path d="M4 7V5a1 1 0 0 1 1-1h2"/><path d="M17 4h2a1 1 0 0 1 1 1v2"/><path d="M20 17v2a1 1 0 0 1-1 1h-2"/><path d="M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M7 12h10"/>',
    flow: '<path d="M4 12c4-6 8 6 12 0 1-2 2-3 4-3"/><path d="M4 17c4-6 8 6 12 0 1-2 2-3 4-3"/>',
    therapy: '<path d="M10 21h4"/><path d="M12 17v4"/><path d="M8 3h8v8a4 4 0 0 1-8 0V3Z"/><path d="M9 7h6"/>',
    success: '<path d="M20 6 9 17l-5-5"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-10 3.5C2 13 12 21 12 21s3.5-2.8 7-7Z"/>',
    summary: '<path d="M4 4h16v16H4z"/><path d="M8 9h8"/><path d="M8 13h6"/><path d="M8 17h4"/>'
};

const statIconMap = {
    A: 'aorta', R: 'patient', '!': 'alert', '3D': 'anatomy', X: 'split', DNA: 'dna', BP: 'pressure',
    S: 'symptom', CT: 'scan', US: 'scan', M: 'scan', F: 'flow', I: 'split', Rx: 'therapy',
    OP: 'therapy', EV: 'therapy', '%': 'success', N: 'success', H: 'heart', '*': 'summary', '5.5': 'alert'
};

const materialIconMap = {
    R: 'person', '!': 'warning', DNA: 'genetics', BP: 'blood_pressure', S: 'monitor_heart',
    CT: 'radiology', US: 'radiology', M: 'radiology', Lab: 'biotech', Rx: 'medication',
    OP: 'medical_services', EV: 'medical_services', '%': 'check_circle', N: 'fact_check',
    '*': 'fact_check', '5.5': 'warning'
};

const abbreviationLegend = {
    BD: 'blood pressure', CT: 'computed tomography', DNA: 'genetic information',
    EVAR: 'endovascular aortic repair', OP: 'operation', Rx: 'medical therapy',
    US: 'ultrasound', Gen: 'genetic factors', Lab: 'laboratory values'
};

export function renderMaterialIcon(name, className = '') {
    return `<span class="material-symbols-rounded story-material-icon ${className}" aria-hidden="true">${name}</span>`;
}

export function renderIcon(key) {
    const materialIcon = materialIconMap[key];
    if (materialIcon) return renderMaterialIcon(materialIcon);
    const iconName = iconLibrary[key] ? key : (statIconMap[key] || 'summary');
    return `<svg class="stat-icon-svg" viewBox="0 0 24 24" aria-hidden="true">${iconLibrary[iconName]}</svg>`;
}

export function collectAbbreviations(source = '') {
    return Object.entries(abbreviationLegend)
        .filter(([abbr]) => new RegExp(`(^|[^A-Za-zÄÖÜäöü])${abbr}([^A-Za-zÄÖÜäöü]|$)`).test(source))
        .map(([abbr, meaning]) => `${abbr} = ${meaning}`);
}
