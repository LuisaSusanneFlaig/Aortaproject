import { collectAbbreviations, renderIcon, renderMaterialIcon } from './icons.js';

export function renderReferenceText(value = '') {
    return value.replace(/https?:\/\/[^\s<]+|10\.\d{4,9}\/[-._;()/:A-Z0-9]+/gi, (match) => {
        const trailing = match.match(/[.,;:)]+$/)?.[0] || '';
        const target = trailing ? match.slice(0, -trailing.length) : match;
        const href = target.startsWith('http') ? target : `https://doi.org/${target}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${target}</a>${trailing}`;
    });
}

export function renderReferenceDisclosure(value = '') {
    return `
        <details class="section-reference source-disclosure">
            <summary class="source-toggle">
                <span class="source-toggle-show">${renderMaterialIcon('medical_information')}</span>
                <span class="source-toggle-hide">Hide sources</span>
            </summary>
            <div class="source-box">${renderReferenceText(value)}</div>
        </details>
    `;
}

export function renderBasicElement(element) {
    switch (element.type) {
        case 'heading': return `<h3 class="info-heading">${element.text || 'New heading'}</h3>`;
        case 'text': return `<p class="info-text">${element.text || 'New text'}</p>`;
        case 'pullQuote': return `<blockquote class="story-pull-quote">${element.text || ''}</blockquote>`;
        case 'image': return `<figure class="info-image"><img src="${element.src}" alt="${element.alt || ''}" style="aspect-ratio: ${element.aspect || '16 / 9'}"></figure>`;
        case 'video': return `<div class="info-video"><div class="video-container"><iframe src="${element.url}" frameborder="0" allowfullscreen></iframe></div></div>`;
        case 'stat': {
            const legends = collectAbbreviations(`${element.icon} ${element.label} ${element.text}`);
            return `<div class="stats-box stats-box-extra"><div class="stats-icon">${renderIcon(element.icon)}</div><div class="stats-copy"><strong>${element.label || 'Info:'}</strong><span>${element.text || 'New information'}</span>${legends.length ? `<small class="abbr-legend">${legends.join(' - ')}</small>` : ''}</div></div>`;
        }
        case 'closingStatement': return `<blockquote class="closing-statement">${element.text || ''}</blockquote>`;
        case 'reference': return renderReferenceDisclosure(element.text || '');
        case 'iconGrid': return `<div class="icon-grid">${(element.items || []).map((item) => `<div class="icon-item"><div class="icon-placeholder">${renderIcon(item.icon)}</div><span>${item.label}</span></div>`).join('')}</div>`;
        case 'iconImages': return `<div class="icon-list">${(element.items || []).map((image) => `<img src="${image.src}" alt="${image.alt}" class="icon-image">`).join('')}</div>`;
        default: return null;
    }
}
