import { collectAbbreviations, renderIcon, renderMaterialIcon } from './icons.js';

let inlineInfoPopupId = 0;
let imageHotspotId = 0;

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
        case 'text': {
            const text = element.text || 'New text';
            if (!element.infoPopup?.title) return `<p class="info-text">${text}</p>`;
            const term = element.infoPopup.title;
            const termStart = text.indexOf(term);
            if (termStart === -1) return `<p class="info-text">${text}</p>`;
            const textAfterTerm = text.slice(termStart + term.length);
            const punctuation = textAfterTerm.match(/^[.,;:!?]+/)?.[0] || '';
            const popupId = `inline-info-popup-${++inlineInfoPopupId}`;
            const popup = `
                <button class="inline-info-term" type="button" aria-expanded="false" aria-controls="${popupId}">${term}${punctuation}</button>
            `;
            return `
                <div class="info-text-with-popup">
                    <p class="info-text">${text.slice(0, termStart)}${popup}${textAfterTerm.slice(punctuation.length)}</p>
                    <div class="inline-info-box" id="${popupId}" hidden>${element.infoPopup.text || ''}</div>
                </div>
            `;
        }
        case 'infoPopup': return `
            <details class="story-info-popup">
                <summary>${element.title || 'More information'}</summary>
                <div class="story-info-popup-content"><p>${element.text || ''}</p></div>
            </details>
        `;
        case 'pullQuote': return `<blockquote class="story-pull-quote">${element.text || ''}</blockquote>`;
        case 'image': {
            const hotspots = Array.isArray(element.hotspots)
                ? element.hotspots
                : (element.hotspot ? [element.hotspot] : []);
            const hotspotMarkup = hotspots.map((hotspot) => {
                const infoId = `image-hotspot-info-${++imageHotspotId}`;
                return `
                    <button class="image-hotspot" type="button" style="--x:${hotspot.x || '50%'}; --y:${hotspot.y || '50%'};" aria-label="Show information about ${hotspot.title || 'this finding'}" aria-expanded="false" aria-controls="${infoId}"></button>
                    <aside class="image-hotspot-popover" id="${infoId}" hidden>
                        <button class="image-hotspot-close" type="button" aria-label="Close information">×</button>
                        <h2>${hotspot.title || 'More information'}</h2>
                        <p>${hotspot.text || ''}</p>
                    </aside>
                `;
            }).join('');
            return `<figure class="info-image${hotspots.length ? ' has-image-hotspot' : ''}"><img src="${element.src}" alt="${element.alt || ''}" style="aspect-ratio: ${element.aspect || '16 / 9'}">${hotspotMarkup}</figure>`;
        }
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
