import { renderMaterialIcon } from './icons.js';

// Infographic: CT scanner -> stack of CTA slices -> computer and software ->
// the patient's live 3D model. All copy (step titles, texts, alt text) comes
// from the story data.
const SLICE_COUNT = 6;

function renderSliceStack(element) {
    const slices = Array.from({ length: SLICE_COUNT }, (_, index) => {
        const isTop = index === SLICE_COUNT - 1;
        return `<img class="scan-slice" src="${element.sliceSrc}" alt="${isTop ? element.sliceAlt : ''}" style="--slice-index:${index}"${isTop ? '' : ' aria-hidden="true"'}>`;
    }).join('');
    return `<div class="scan-slice-stack" style="--slice-aspect:${element.sliceAspect || '1 / 1'}">${slices}</div>`;
}

function renderModelStage(model = {}, defaultMode) {
    const attribute = (key, name) => Number.isFinite(model[key]) ? ` data-${name}="${model[key]}"` : '';
    return `
        <div class="inline-model-viewer scan-to-model-viewer" data-inline-model data-model-url="${model.url}" data-model-mode="${model.mode || defaultMode}"${attribute('rotationX', 'rotation-x')}${attribute('rotationY', 'rotation-y')}${attribute('rotationZ', 'rotation-z')}${attribute('framingScale', 'framing-scale')} role="img" aria-label="${model.label || ''}">
            <div class="inline-model-loading" aria-hidden="true"></div>
        </div>`;
}

export function renderScanToModel(element = {}) {
    const steps = element.steps || [];
    const stages = [
        renderModelStage(element.scanner, 'textured'),
        renderSliceStack(element),
        `<div class="scan-to-model-software">${renderMaterialIcon('computer')}</div>`,
        renderModelStage(element.model, 'flow')
    ];
    const items = steps.slice(0, stages.length).map((step, index) => `
        <li class="scan-to-model-step scan-to-model-step-${index + 1}">
            <div class="scan-to-model-stage">${stages[index]}</div>
            <h3><span class="scan-to-model-number" aria-hidden="true">${index + 1}</span>${step.title || ''}</h3>
            <p>${step.text || ''}</p>
            ${index < stages.length - 1 ? `<span class="scan-to-model-arrow" aria-hidden="true">${renderMaterialIcon('arrow_forward')}</span>` : ''}
        </li>`).join('');
    return `
        <figure class="scan-to-model"${element.label ? ` aria-label="${element.label}"` : ''}>
            <ol class="scan-to-model-steps">${items}</ol>
            ${element.caption ? `<figcaption>${element.caption}</figcaption>` : ''}
        </figure>`;
}
