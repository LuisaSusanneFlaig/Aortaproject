import { storyVersions } from './storyContent.js';
import { renderBasicElement } from '../components/basicElements.js';
import { renderChapterOpener } from '../components/chapterOpener.js';
import {
    renderAneurysmBurden,
    renderAneurysmGrowth,
    renderAneurysmRiskDrivers,
    renderAneurysmSexRisk,
    renderAorticStatGraphic,
    renderChart
} from '../components/dataVisuals.js';
import {
    renderDiagnosticPath,
    renderImagingComparison,
    renderModelPlaceholder,
    renderPairedPrognosis,
    renderPreventionTimeline,
    renderSymptomBars,
    renderTreatmentBalance,
    renderTreatmentDecision,
    renderTreatmentSteps
} from '../components/clinicalElements.js';

/**
 * StoryRenderer converts validated story configuration into HTML.
 * Component-specific rendering lives in ../components/.
 */

function getPresentationType(section = {}) {
    if (section.columns === '2' || section.inlineModel) return 'media';

    const elementTypes = new Set((section.elements || []).map((element) => element.type));
    const mediaTypes = ['image', 'video', 'imagingComparison', 'modelPlaceholder'];
    const dataTypes = [
        'chart', 'aorticStat', 'symptomBars', 'diagnosticPath', 'treatmentDecision',
        'treatmentSteps', 'treatmentBalance', 'preventionTimeline', 'aneurysmBurden',
        'aneurysmGrowth', 'aneurysmSexRisk', 'aneurysmRiskDrivers', 'pairedPrognosis'
    ];

    if (mediaTypes.some((type) => elementTypes.has(type))) return 'media';
    if (dataTypes.some((type) => elementTypes.has(type))) return 'data';
    return 'text';
}

const narrativeElementTypes = new Set([
    'heading', 'text', 'pullQuote', 'closingStatement', 'reference'
]);

function isNarrativeElement(element = {}) {
    return narrativeElementTypes.has(element.type);
}

function renderElement(element, index) {
    let content = renderBasicElement(element);
    if (content === null) switch (element.type) {
            case 'chart':
                content = renderChart(element);
                break;
            case 'aorticStat':
                content = renderAorticStatGraphic(element);
                break;
            case 'aneurysmBurden':
                content = renderAneurysmBurden(element);
                break;
            case 'aneurysmGrowth':
                content = renderAneurysmGrowth(element);
                break;
            case 'aneurysmSexRisk':
                content = renderAneurysmSexRisk(element);
                break;
            case 'aneurysmRiskDrivers':
                content = renderAneurysmRiskDrivers(element);
                break;
            case 'symptomBars':
                content = renderSymptomBars(element);
                break;
            case 'diagnosticPath':
                content = renderDiagnosticPath(element);
                break;
            case 'treatmentDecision':
                content = renderTreatmentDecision(element);
                break;
            case 'treatmentSteps':
                content = renderTreatmentSteps(element);
                break;
            case 'treatmentBalance':
                content = renderTreatmentBalance(element);
                break;
            case 'preventionTimeline':
                content = renderPreventionTimeline(element);
                break;
            case 'imagingComparison':
                content = renderImagingComparison(element);
                break;
            case 'modelPlaceholder':
                content = renderModelPlaceholder(element);
                break;
            case 'pairedPrognosis':
                content = renderPairedPrognosis(element);
                break;
            default:
                content = '';
    }

    return `<div class="element-wrapper element-${element.type}" data-scroll-item data-scroll-index="${index}">${content}</div>`;
}

function renderElements(elements = [], predicate = () => true) {
    return elements
        .map((element, index) => ({ element, index }))
        .filter(({ element }) => predicate(element))
        .map(({ element, index }) => renderElement(element, index))
        .join('');
}

function renderPlaceholder(section) {
    if (!section.placeholderId) return '';
    return `
        <div class="placeholder-box" id="${section.placeholderId}">
            <i>${section.placeholderText || '3D model placeholder'}</i>
        </div>
    `;
}

function renderInlineModel(model) {
    if (!model?.url) return '';
    const label = model.label || '3D model';
    const modelMode = model.mode || 'layers';
    const legend = model.legend === false ? '' : `
        <div class="wall-layer-legend" aria-label="Legend of aortic wall layers">
            <span><i class="intima"></i>Intima</span>
            <span><i class="media"></i>Media</span>
            <span><i class="adventitia"></i>Adventitia</span>
        </div>`;
    return `
        <figure class="inline-model-figure">
            <div class="inline-model-viewer" data-inline-model data-model-url="${model.url}" data-model-mode="${modelMode}" role="img" aria-label="${label}">
                <div class="inline-model-loading" aria-hidden="true"></div>
            </div>
            <div class="inline-model-meta">
                <figcaption>${label}</figcaption>
                ${legend}
            </div>
        </figure>
    `;
}

function renderVisualFallback(section, sectionIndex) {
    const number = String(sectionIndex + 1).padStart(2, '0');
    return `
        <div class="story-visual-fallback" aria-hidden="true">
            <span>${number}</span>
            <strong>${section.title}</strong>
        </div>
    `;
}

function renderSections(sections = [], navItems = []) {
    const chapters = new Map(
        navItems
            .map((item, index) => item.href?.startsWith('#')
                ? [item.href.slice(1), { index, label: item.label }]
                : null)
            .filter(Boolean)
    );
    const chapterIds = new Set(chapters.keys());

    return sections.map((section, index) => {
        const layoutClass = section.layout === 'full' ? ' layout-full' : '';
        const customClass = section.className ? ` ${section.className}` : '';
        const chapterClass = chapterIds.has(section.id) ? ' chapter-start' : ' chapter-continuation';
        const chapter = chapters.get(section.id);
        const scrollMode = section.scrollMode || 'flow';
        const presentationClass = ` content-${getPresentationType(section)}`;
        const style = section.style || {};
        const visualElements = renderElements(section.elements, (element) => !isNarrativeElement(element));
        const visualContent = [
            section.layout !== 'full' ? renderPlaceholder(section) : '',
            renderInlineModel(section.inlineModel),
            visualElements
        ].filter(Boolean).join('');
        const narrativeContent = renderElements(section.elements, isNarrativeElement);
        
        const customStyle = [
            style.opacity !== undefined ? `background-color: rgba(12, 12, 14, ${style.opacity / 100});` : '',
            style.blur !== undefined ? `backdrop-filter: blur(${style.blur}px);` : '',
            style.width ? `width: min(${style.width}px, 100%);` : '',
            style.textAlign ? `text-align: ${style.textAlign};` : ''
        ].filter(Boolean).join(' ');

        return `
            ${chapter ? renderChapterOpener(chapter, section.id || `s${index + 1}`) : ''}
            <section class="step${layoutClass}${customClass}${chapterClass}" id="${section.id || `s${index + 1}`}" data-section-index="${index}" data-scroll-mode="${scrollMode}">
                <div class="text-box story-split-shell${presentationClass}" style="${customStyle}">
                    <aside class="story-visual-column" aria-label="Visual for ${section.title}">
                        <div class="story-visual-column-inner">
                            ${visualContent || renderVisualFallback(section, index)}
                        </div>
                    </aside>
                    <div class="story-copy-column">
                        <h2>${section.title}</h2>
                        ${narrativeContent}
                    </div>
                </div>
            </section>
        `;
    }).join('');
}

export function getStoryVersion() {
    const requestedVersion = document.body.dataset.storyVersion || 'aneurysm';
    return storyVersions[requestedVersion] ? requestedVersion : 'aneurysm';
}

export function renderStoryPage(providedConfig = null, providedVersion = null) {
    const version = providedVersion || getStoryVersion();
    const config = providedConfig || storyVersions[version];
    const story = document.getElementById('story');
    const pageTitle = document.querySelector('[data-story-title]');

    if (story) {
        story.innerHTML = renderSections(config.sections, config.nav);
    }
    if (pageTitle) pageTitle.textContent = config.title;
    
    // Nav links rendering
    const desktopNav = document.getElementById('nav-links');
    const mobileNav = document.querySelector('#nav-menu-mobile ul');
    const sectionIds = new Set(config.sections.map((section) => section.id).filter(Boolean));
    const linksMarkup = [
        ...config.nav.map((item) => {
            const targetId = item.href?.startsWith('#') ? item.href.slice(1) : '';
            const href = sectionIds.has(targetId) ? `#chapter-${targetId}` : item.href;
            return `<li><a href="${href}" data-section-target="${targetId}">${item.label}</a></li>`;
        }),
        `<li><a href="index.html">Dashboard</a></li>`
    ].join('');

    if (desktopNav) desktopNav.innerHTML = linksMarkup;
    if (mobileNav) mobileNav.innerHTML = linksMarkup;

    return config;
}
