import { renderReferenceDisclosure } from './basicElements.js';
import { renderAneurysmGrowth, renderAneurysmSexRisk } from './dataVisuals.js';
import { renderMaterialIcon } from './icons.js';
import { clampPercent } from './renderUtils.js';


export function renderSymptomBars(element = {}) {
    const items = element.items || [];
    return `
        <div class="symptom-stat-card">
            <div class="diagnosis-card-head">
                <strong>${element.title || 'Symptoms'}</strong>
                <span>${element.subtitle || ''}</span>
            </div>
            <div class="symptom-bars">
                ${items.map((item, index) => `
                    <div class="symptom-row" style="--row-index:${index}">
                        ${item.icon ? `<span class="symptom-row-icon">${renderMaterialIcon(item.icon, 'story-inline-icon')}</span>` : ''}
                        <div class="symptom-row-label">
                            <span>${item.label}</span>
                            <strong>${item.value}%</strong>
                        </div>
                        <div class="symptom-track" role="img" aria-label="${item.label}: ${item.value} percent">
                            <span style="width: ${clampPercent(item.value)}%; background: ${item.color || 'var(--color-accent)'}"></span>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${element.note ? `<p class="symptom-note">${element.note}</p>` : ''}
        </div>
    `;
}

export function renderDiagnosticPath(element = {}) {
    const icons = ['search', 'monitor_heart', 'biotech', 'radiology'];
    return `
        <ol class="diagnostic-path">
            ${(element.items || []).map((item, index) => `
                <li style="--row-index:${index}">
                    <span class="diagnostic-step-index">${index + 1}</span>
                    <div>
                        <strong>${renderMaterialIcon(item.icon || icons[index] || 'fact_check', 'story-inline-icon')}${item.title}</strong>
                        ${item.text ? `<p>${item.text}</p>` : ''}
                    </div>
                </li>
            `).join('')}
        </ol>
    `;
}

export function renderTreatmentDecision(element = {}) {
    if (element.variant === 'decisionMap') {
        const items = element.items || [];
        const inputs = element.inputs || [];
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
                            <span class="decision-map-marker">${renderMaterialIcon(item.icon || 'fact_check', 'story-inline-icon')}</span>
                            <div class="decision-map-finding">
                                <small>${item.label}</small>
                                <strong>${item.treatment}</strong>
                            </div>
                            ${item.text ? `<p>${item.text}</p>` : ''}
                        </section>
                    `).join('')}
                </div>
                ${element.caption ? `<figcaption>${element.caption}</figcaption>` : ''}
            </figure>
        `;
    }

    return `
        <div class="treatment-decision">
            ${(element.items || []).map((item, index) => `
                <section class="treatment-decision-row" style="--row-index:${index}">
                    ${item.icon ? `<span class="treatment-decision-badge">${renderMaterialIcon(item.icon, 'story-inline-icon')}</span>` : ''}
                    <div>
                        <small>${renderMaterialIcon('fact_check', 'story-inline-icon')}Finding</small>
                        <strong>${item.label}</strong>
                    </div>
                    <div>
                        <small>${renderMaterialIcon('medical_services', 'story-inline-icon')}Treatment</small>
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
                    <strong>${renderMaterialIcon(icons[index] || 'medical_services', 'story-inline-icon')}${item.title}</strong>
                    <p>${item.text}</p>
                </li>
            `).join('')}
        </ol>
    `;
}

export function renderTreatmentBalance(element = {}) {
    const renderList = (title, items, className, icon) => `
        <section class="treatment-balance-column ${className}">
            <h3>${renderMaterialIcon(icon, 'story-inline-icon')}${title}</h3>
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
    const icons = ['blood_pressure', 'medical_services', 'fitness_center', 'calendar_month', 'genetics'];
    return `
        <ol class="prevention-timeline">
            ${(element.items || []).map((item, index) => `
                <li style="--row-index:${index}">
                    <span class="prevention-node" aria-hidden="true"></span>
                    <div class="prevention-copy">
                        <small>${item.eyebrow || ''}</small>
                        <strong>${renderMaterialIcon(icons[index] || 'check_circle', 'story-inline-icon')}${item.title || ''}</strong>
                        ${item.text ? `<p>${item.text}</p>` : ''}
                    </div>
                </li>
            `).join('')}
        </ol>
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
                    ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ''}
                </figure>
            `).join('')}
        </div>
    `;
}

export function renderModelPlaceholder(element = {}) {
    const viewerAttributes = element.src
        ? ` data-inline-model data-model-url="${element.src}" data-model-mode="${element.modelMode || 'flow'}" data-animation-fps="${element.animationFps || 30}"`
        : '';
    const accessibleLabel = element.alt || element.title || 'Animated flow model';
    return `
        <figure class="model-placeholder" id="${element.id || ''}">
            <div class="model-placeholder-stage${element.src ? ' inline-model-viewer' : ''}"${viewerAttributes} role="img" aria-label="${accessibleLabel}">
                ${element.src
                    ? '<div class="inline-model-loading" aria-hidden="true"></div><span class="inline-model-error">Animation unavailable</span>'
                    : '<span>GLTF / ANIMATION</span>'}
            </div>
            <figcaption>
                ${element.eyebrow ? `<small>${element.eyebrow}</small>` : ''}
                <strong>${element.title || 'Flow visualization'}</strong>
                ${element.text ? `<p>${element.text}</p>` : ''}
            </figcaption>
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
