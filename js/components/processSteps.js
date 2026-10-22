import { renderMaterialIcon } from './icons.js';

// Step-by-step infographic (e.g. scan -> 3D model, 3D model -> flow simulation).
// Each step has a title, a text and a visual; all copy comes from story data.
const SLICE_COUNT = 6;

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
    const items = steps.map((step, index) => {
        const renderVisual = visualRenderers[step.visual?.kind];
        return `
        <li class="process-step">
            <div class="process-stage">${renderVisual ? renderVisual(step.visual) : ''}</div>
            <h3><span class="process-number" aria-hidden="true">${index + 1}</span>${step.title || ''}</h3>
            <p>${step.text || ''}</p>
            ${index < steps.length - 1 ? `<span class="process-arrow" aria-hidden="true">${renderMaterialIcon('arrow_forward')}</span>` : ''}
        </li>`;
    }).join('');
    const notes = element.notes?.items?.length ? `
            <aside class="process-notes">
                ${element.notes.title ? `<h3>${element.notes.title}</h3>` : ''}
                <ul>${element.notes.items.map((item) => `<li>${item}</li>`).join('')}</ul>
            </aside>` : '';
    return `
        <figure class="process-steps"${element.label ? ` aria-label="${element.label}"` : ''}>
            <ol class="process-step-list" style="--process-columns:${Math.max(steps.length, 1)}">${items}</ol>
            ${notes}
        </figure>`;
}
