import { renderReferenceDisclosure } from './basicElements.js';
import { renderAneurysmGrowth, renderAneurysmSexRisk } from './dataVisuals.js';
import { renderMaterialIcon } from './icons.js';
import { clampPercent } from './renderUtils.js';

let symptomInfoId = 0;
let diagnosticInfoId = 0;
let decisionInfoId = 0;
let preventionInfoId = 0;

const renderVisualIcon = (icon, className = 'story-inline-icon') => renderMaterialIcon(
    icon,
    `${className} visual-icon-shine-target`
).replace(
    '</span>',
    '<span class="visual-icon-shine" aria-hidden="true"></span></span>'
);

export function renderSymptomBars(element = {}) {
    const items = element.items || [];
    return `
        <div class="symptom-stat-card">
            <div class="diagnosis-card-head">
                ${element.title ? `<strong>${element.title}</strong>` : ''}
                <span>${element.subtitle || ''}</span>
            </div>
            <div class="symptom-bars">
                ${items.map((item, index) => {
                    const displayValue = Math.round(item.value);
                    const infoId = item.info ? `symptom-info-${++symptomInfoId}` : '';
                    const icon = item.icon
                        ? (item.info
                            ? `<button class="symptom-row-icon symptom-info-trigger" type="button" aria-label="More information about ${item.label}" aria-expanded="false" aria-controls="${infoId}">${renderMaterialIcon(item.icon, 'story-inline-icon').replace('</span>', '<span class="symptom-button-shine" aria-hidden="true"></span></span>')}</button>`
                            : `<span class="symptom-row-icon">${renderVisualIcon(item.icon)}</span>`)
                        : '';
                    return `
                    <div class="symptom-row" style="--row-index:${index}">
                        ${icon}
                        <div class="symptom-row-label">
                            <span>${item.label}</span>
                            <strong>${displayValue}%</strong>
                        </div>
                        <div class="symptom-track" role="img" aria-label="${item.label}: ${displayValue} percent">
                            <span style="width: ${clampPercent(item.value)}%; background: ${item.color || 'var(--color-accent)'}"></span>
                        </div>
                        ${item.info ? `<div class="symptom-info-box" id="${infoId}" hidden>${item.info}</div>` : ''}
                    </div>
                `;
                }).join('')}
            </div>
            ${element.note ? `<p class="symptom-note">${element.note}</p>` : ''}
        </div>
    `;
}

export function renderDiagnosticPath(element = {}) {
    const icons = ['search', 'monitor_heart', 'biotech', 'radiology'];
    const customIcons = new Set(['radiology_aorta', 'genetics_svg', 'monitor_heart_svg', 'labs_svg', 'event_available_svg', 'compare_svg']);
    const renderDiagnosticIcon = (icon) => customIcons.has(icon)
        ? `<span class="diagnostic-custom-icon diagnostic-custom-icon-${icon} diagnostic-shine-target" aria-hidden="true"><span class="diagnostic-button-shine" aria-hidden="true"></span></span>`
        : renderMaterialIcon(icon, 'story-inline-icon diagnostic-shine-target').replace(
            '</span>',
            '<span class="diagnostic-button-shine" aria-hidden="true"></span></span>'
        );
    const infoBoxes = [];
    const renderDiagnosticItem = (item, index) => {
        const infoId = item.info ? `diagnostic-info-${++diagnosticInfoId}` : '';
        if (item.info) infoBoxes.push(`<div class="symptom-info-box diagnostic-info-box" id="${infoId}" hidden>${item.info}</div>`);
        const icon = renderDiagnosticIcon(item.icon || icons[index] || 'fact_check');
        const trigger = item.info
            ? `<button class="diagnostic-info-trigger" type="button" aria-label="More information about ${item.title}" aria-expanded="false" aria-controls="${infoId}">${icon}</button>`
            : icon;
        return `
                <li style="--row-index:${index}">
                    <span class="diagnostic-step-index">${index + 1}</span>
                    <div>
                        <strong>${trigger}${item.title}</strong>
                        ${item.text ? `<p>${item.text}</p>` : ''}
                    </div>
                </li>
            `;
    };
    return `
        <ol class="diagnostic-path">
            ${(element.items || []).map(renderDiagnosticItem).join('')}
        </ol>
        ${infoBoxes.length ? `<div class="diagnostic-info-row">${infoBoxes.join('')}</div>` : ''}
    `;
}

export function renderTreatmentDecision(element = {}) {
    if (element.variant === 'decisionMap') {
        const items = element.items || [];
        const inputs = element.inputs || [];
        const infoBoxes = [];
        return `
            <figure class="treatment-decision-map" aria-label="${element.title || 'Treatment decision map'}">
                ${element.title ? `<div class="decision-spectrum-heading">${element.title}</div>` : ''}
                ${inputs.length ? `<div class="decision-map-inputs" aria-label="Decision inputs">
                    ${inputs.map((input) => `
                        <span>${input.label}</span>
                    `).join('')}
                </div>` : ''}
                <div class="decision-map-axis" aria-hidden="true">
                    <span class="axis-label axis-label-left">${element.axisStart || 'Observe'}</span>
                    <span class="axis-line"><span class="axis-arrow"></span></span>
                    <span class="axis-label axis-label-right">${element.axisEnd || 'Intervene'}</span>
                </div>
                <div class="decision-map-zones">
                    ${items.map((item, index) => `
                        <section class="decision-map-zone" style="--row-index:${index}">
                            ${item.info
                                ? (() => {
                                    const infoId = `decision-info-${++decisionInfoId}`;
                                    infoBoxes.push(`<div class="symptom-info-box decision-info-box" id="${infoId}" hidden>${item.info}</div>`);
                                    return `<button class="decision-map-marker decision-info-trigger" type="button" aria-label="More information about ${item.label}" aria-expanded="false" aria-controls="${infoId}">${renderVisualIcon(item.icon || 'fact_check')}</button>`;
                                })()
                                : `<span class="decision-map-marker">${renderVisualIcon(item.icon || 'fact_check')}</span>`}
                            <div class="decision-map-finding">
                                <span class="decision-map-label">${item.label}</span>
                                <span class="decision-map-arrow" aria-hidden="true">↓</span>
                                <strong>${item.treatment}</strong>
                            </div>
                            ${item.text ? `<p>${item.text}</p>` : ''}
                        </section>
                    `).join('')}
                </div>
                ${infoBoxes.length ? `<div class="decision-info-row">${infoBoxes.join('')}</div>` : ''}
            </figure>
        `;
    }

    return `
        <div class="treatment-decision">
            ${(element.items || []).map((item, index) => `
                <section class="treatment-decision-row" style="--row-index:${index}">
                    ${item.icon ? `<span class="treatment-decision-badge">${renderVisualIcon(item.icon)}</span>` : ''}
                    <div>
                        <small>${renderVisualIcon('fact_check')}Finding</small>
                        <strong>${item.label}</strong>
                    </div>
                    <div>
                        <small>${renderVisualIcon('medical_services')}Treatment</small>
                        <strong>${item.treatment}</strong>
                        <p>${item.text}</p>
                    </div>
                </section>
            `).join('')}
        </div>
    `;
}

export function renderTreatmentSteps(element = {}) {
    const icons = ['route', 'search', 'medical_services', 'monitor_heart'];
    return `
        <ol class="treatment-steps">
            ${(element.items || []).map((item, index) => `
                <li style="--row-index:${index}">
                    <span>${index + 1}</span>
                    <strong>${renderVisualIcon(icons[index] || 'medical_services')}${item.title}</strong>
                    <p>${item.text}</p>
                </li>
            `).join('')}
        </ol>
    `;
}

export function renderTreatmentBalance(element = {}) {
    const renderList = (title, items, className, icon) => `
        <section class="treatment-balance-column ${className}">
            <h3>${renderVisualIcon(icon)}${title}</h3>
            <ul>${(items || []).map((item) => `<li>${item}</li>`).join('')}</ul>
        </section>
    `;

    return `
        <div class="treatment-balance">
            ${renderList('Potential benefits', element.benefits, 'is-benefit', 'check_circle')}
            ${renderList('Potential risks', element.risks, 'is-risk', 'warning')}
        </div>
    `;
}

export function renderPreventionTimeline(element = {}) {
    const icons = ['blood_pressure', 'prescriptions', 'fitness_center', 'calendar_month', 'genetics'];
    const infoBoxes = [];
    return `
        <ol class="prevention-timeline">
            ${(element.items || []).map((item, index) => {
                const infoId = item.info ? `prevention-info-${++preventionInfoId}` : '';
                if (item.info) infoBoxes.push(`<div class="symptom-info-box prevention-info-box" id="${infoId}" hidden>${item.info}</div>`);
                return `
                <li style="--row-index:${index}">
                    <span class="prevention-node" aria-hidden="true"></span>
                    <div class="prevention-copy">
                        ${item.info
                            ? `<button class="prevention-info-trigger" type="button" aria-label="More information about ${item.title || 'this prevention step'}" aria-expanded="false" aria-controls="${infoId}">${renderVisualIcon(icons[index] || 'check_circle')}${item.title || ''}</button>`
                            : `<strong>${renderVisualIcon(icons[index] || 'check_circle')}${item.title || ''}</strong>`}
                        ${item.text ? `<p>${item.text}</p>` : ''}
                    </div>
                </li>
                `;
            }).join('')}
        </ol>
        ${infoBoxes.length ? `<div class="prevention-info-row">${infoBoxes.join('')}</div>` : ''}
    `;
}

export function renderImagingComparison(element = {}) {
    return `
        <div class="imaging-comparison">
            ${(element.items || []).map((item) => `
                <figure class="imaging-panel">
                    <div class="imaging-panel-media">
                        <span class="imaging-modality">${item.modality || 'Imaging'}</span>
                        <img src="${item.src}" alt="${item.alt || ''}" loading="lazy">
                    </div>
                </figure>
            `).join('')}
        </div>
    `;
}

export function renderModelPlaceholder(element = {}) {
    const framingAttribute = element.framingScale
        ? ` data-framing-scale="${element.framingScale}"`
        : '';
    const offsetAttribute = (key) => Number.isFinite(element[key])
        ? ` data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${element[key]}"`
        : '';
    const viewerAttributes = element.src
        ? ` data-inline-model data-model-url="${element.src}" data-model-mode="${element.modelMode || 'flow'}" data-animation-fps="${element.animationFps || 30}"${element.preload ? ' data-preload="true"' : ''}${framingAttribute}${offsetAttribute('offsetX')}${offsetAttribute('offsetY')}`
        : '';
    const accessibleLabel = element.alt || element.title || 'Animated flow model';
    const flowVariants = element.flowVariants || [];
    const variantAttribute = (variant, key) => Number.isFinite(variant[key])
        ? ` data-flow-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${variant[key]}"`
        : '';
    const flowControls = flowVariants.length > 1 ? `
            <div class="flow-variant-controls" role="group" aria-label="Choose flow visualization">
                ${flowVariants.map((variant, index) => `
                    <button class="flow-variant-button${index === 0 ? ' active' : ''}" type="button" data-flow-url="${variant.src}"${variantAttribute(variant, 'framingScale')}${variantAttribute(variant, 'offsetX')}${variantAttribute(variant, 'offsetY')}${variantAttribute(variant, 'rotationX')}${variantAttribute(variant, 'rotationY')}${variantAttribute(variant, 'rotationZ')}${variantAttribute(variant, 'animationFps')}${variantAttribute(variant, 'animationSpeed')} aria-pressed="${index === 0}">${variant.label || ('View ' + (index + 1))}</button>
                `).join('')}
            </div>` : '';
    return `
        <figure class="model-placeholder" id="${element.id || ''}">
            <div class="model-placeholder-stage${element.src ? ' inline-model-viewer' : ''}"${viewerAttributes}${flowVariants.length > 1 ? ' data-flow-switch' : ''} role="img" aria-label="${accessibleLabel}">
                ${element.src
                    ? `${element.rotationHint ? '<span class="inline-model-360-hint material-symbols-rounded story-material-icon" aria-hidden="true">360</span>' : ''}<div class="inline-model-loading" aria-hidden="true"></div><span class="inline-model-error">Animation unavailable</span>`
                    : '<span>GLTF / ANIMATION</span>'}
            </div>
            ${flowControls}
            ${element.note ? `<p class="symptom-note model-placeholder-note">${element.note}</p>` : ''}
        </figure>
    `;
}

export function renderPairedPrognosis(element = {}) {
    const renderGraphic = (graphic = {}) => {
        if (graphic.type === 'aneurysmGrowth') return renderAneurysmGrowth(graphic);
        if (graphic.type === 'aneurysmSexRisk') return renderAneurysmSexRisk(graphic);
        return '';
    };

    return `
        <div class="paired-prognosis">
            ${(element.panels || []).map((panel, index) => `
                <section class="paired-prognosis-panel" style="--panel-index:${index}">
                    ${panel.text ? `<p class="info-text">${panel.text}</p>` : ''}
                    ${renderGraphic(panel.graphic)}
                    ${panel.reference ? renderReferenceDisclosure(panel.reference) : ''}
                </section>
            `).join('')}
        </div>
    `;
}
