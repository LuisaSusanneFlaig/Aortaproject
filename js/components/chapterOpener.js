import { renderMaterialIcon } from './icons.js';

const chapterIconMap = {
    definition: 'fact_check', anatomy: 'monitor_heart', symptoms: 'warning',
    diagnosis: 'search', treatment: 'medical_services', prognosis: 'route', prevention: 'check_circle'
};

export function renderChapterOpener(chapter, sectionId) {
    if (!chapter || !sectionId) return '';
    const icon = chapterIconMap[chapter.label.toLowerCase()] || 'fact_check';
    const number = String(chapter.index + 1).padStart(2, '0');
    return `
        <header class="chapter-opener" id="chapter-${sectionId}" data-chapter-target="${sectionId}" aria-labelledby="chapter-${sectionId}-title">
            <div class="chapter-opener-inner">
                ${renderMaterialIcon(icon, 'chapter-opener-icon')}
                <span class="chapter-opener-eyebrow">Chapter ${number}</span>
                <h2 class="chapter-opener-title" id="chapter-${sectionId}-title">${chapter.label}</h2>
                <span class="chapter-opener-rule" aria-hidden="true"></span>
            </div>
        </header>
    `;
}
