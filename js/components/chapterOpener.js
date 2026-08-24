export function renderChapterOpener(chapter, sectionId) {
    if (!chapter || !sectionId) return '';
    const number = String(chapter.index + 1).padStart(2, '0');
    return `
        <header class="chapter-opener" id="chapter-${sectionId}" data-chapter-target="${sectionId}" aria-labelledby="chapter-${sectionId}-title">
            <div class="chapter-opener-inner">
                <span class="chapter-opener-eyebrow">Chapter ${number}</span>
                <h2 class="chapter-opener-title" id="chapter-${sectionId}-title">${chapter.label}</h2>
                <span class="chapter-opener-rule" aria-hidden="true"></span>
            </div>
        </header>
    `;
}
