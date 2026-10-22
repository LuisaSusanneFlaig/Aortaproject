import { renderMaterialIcon } from './icons.js';

// Step-by-step infographic (e.g. scan -> 3D model, 3D model -> flow simulation).
// Each step has a title, a text and a visual; all copy comes from story data.
// The step text stays hidden until the + badge on its visual is clicked, like
// the info boxes of the diagnosis path.
const SLICE_COUNT = 6;
let processInfoId = 0;

function renderSlices(visual) {
    const slices = Array.from({ length: SLICE_COUNT }, (_, index) => {
        const isFront = index === SLICE_COUNT - 1;
        return `<img class="process-slice" src="${visual.src}" alt="${isFront ? visual.alt : ''}" style="--slice-index:${index}"${isFront ? '' : ' aria-hidden="true"'}>`;
    }).join('');
    return `<div class="process-slice-stack" style="--slice-aspect:${visual.aspect || '1 / 1'}">${slices}</div>`;
}

function renderModel(visual) {
    const attribute = (key) => Number.isFinite(visual[key])
        ? ` data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${visual[key]}"`
        : '';
    const options = ['rotationX', 'rotationY', 'rotationZ', 'framingScale', 'animationFps', 'animationSpeed'].map(attribute).join('')
        + (Array.isArray(visual.boundaryPlanes) ? ` data-boundary-planes="${JSON.stringify(visual.boundaryPlanes).replace(/"/g, '&quot;')}"` : '');
    return `
        <div class="inline-model-viewer process-viewer" data-inline-model data-model-url="${visual.url}" data-model-mode="${visual.mode || 'flow'}"${options} role="img" aria-label="${visual.label || ''}">
            <div class="inline-model-loading" aria-hidden="true"></div>
        </div>`;
}

const visualRenderers = {
    model: renderModel,
    slices: renderSlices,
    icon: (visual) => `<div class="process-icon">${renderMaterialIcon(visual.icon || 'computer')}</div>`
};

export function renderProcessSteps(element = {}) {
    const steps = element.steps || [];
    const infoBoxes = [];
    const items = steps.map((step, index) => {
        const renderVisual = visualRenderers[step.visual?.kind];
        let trigger = '';
        if (step.text) {
            const infoId = `process-info-${++processInfoId}`;
            infoBoxes.push(`<div class="symptom-info-box process-info-box" id="${infoId}" hidden><strong>${step.title || ''}</strong> ${step.text}</div>`);
            trigger = `<button class="process-info-trigger" type="button" aria-label="More information about ${step.title || `step ${index + 1}`}" aria-expanded="false" aria-controls="${infoId}">+</button>`;
        }
        return `
        <li class="process-step">
            <div class="process-stage">${renderVisual ? renderVisual(step.visual) : ''}${trigger}</div>
            <h3><span class="process-number" aria-hidden="true">${index + 1}</span>${step.title || ''}</h3>
            ${index < steps.length - 1 ? `<span class="process-arrow" aria-hidden="true">${renderMaterialIcon('arrow_forward')}</span>` : ''}
        </li>`;
    }).join('');
    return `
        <figure class="process-steps"${element.label ? ` aria-label="${element.label}"` : ''}>
            <ol class="process-step-list" style="--process-columns:${Math.max(steps.length, 1)}">${items}</ol>
            ${infoBoxes.length ? `<div class="process-info-row">${infoBoxes.join('')}</div>` : ''}
        </figure>`;
}
