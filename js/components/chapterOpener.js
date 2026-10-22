// The brush stroke from the dashboard header, revealed from left to right by
// GsapSectionAnimator. Filter and clip ids are per opener so they stay unique.
function renderChapterArt(sectionId) {
    return `
        <svg class="chapter-opener-art" aria-hidden="true" focusable="false" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <defs>
                <filter id="chapter-art-noise-${sectionId}" x="-20%" y="-15%" width="500%" height="500%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.08" numOctaves="2" seed="17" result="noise"></feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
                </filter>
                <clipPath id="chapter-art-reveal-${sectionId}" clipPathUnits="userSpaceOnUse">
                    <rect class="chapter-opener-art-reveal" x="-160" y="0" width="0" height="408"></rect>
                </clipPath>
            </defs>
            <g filter="url(#chapter-art-noise-${sectionId})" transform="translate(0 146)">
                <image href="assets/vector-1.svg" x="-160" y="0" width="1200" height="408" preserveAspectRatio="none" clip-path="url(#chapter-art-reveal-${sectionId})"></image>
            </g>
        </svg>`;
}

export function renderChapterOpener(chapter, sectionId) {
    if (!chapter || !sectionId) return '';
    const number = String(chapter.index + 1).padStart(2, '0');
    return `
        <header class="chapter-opener" id="chapter-${sectionId}" data-chapter-target="${sectionId}" aria-labelledby="chapter-${sectionId}-title">
            ${renderChapterArt(sectionId)}
            <div class="chapter-opener-inner">
                <span class="chapter-opener-eyebrow">Chapter ${number}</span>
                <h2 class="chapter-opener-title" id="chapter-${sectionId}-title">${chapter.label}</h2>
                <span class="chapter-opener-rule" aria-hidden="true"></span>
            </div>
        </header>
    `;
}
