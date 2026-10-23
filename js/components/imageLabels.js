// Labels on flat images and animations, in the look of the 3D model labels
// (css/components/model-labels.css). Anchors are [x, y] fractions of the
// image, so the image must sit in a box of exactly its own size
// (.labelled-image).

export function renderLabelKey(labels = [], ariaLabel = 'Labelled parts') {
    if (!labels.length) return '';
    return `
        <ol class="model-label-key" aria-label="${ariaLabel}">
            ${labels.map((item, index) => `<li><span class="model-label-key-number" aria-hidden="true">${index + 1}</span>${item.text}</li>`).join('')}
        </ol>`;
}

export function renderImageLabelLayer(labels = []) {
    if (!labels.length) return '';
    const markers = labels.map((label, index) => `
        <span class="model-label${label.side === 'left' ? ' model-label--left' : ''}" data-side="${label.side || 'right'}" style="left: ${label.anchor[0] * 100}%; top: ${label.anchor[1] * 100}%;"><span class="model-label-dot">${index + 1}</span><span class="model-label-line"></span><span class="model-label-text">${label.text}</span></span>`).join('');
    return `<div class="model-label-layer is-ready" aria-hidden="true">${markers}</div>`;
}

// `media` is the finished <img> or <video> markup.
export function renderLabelledImage(media, labels = [], keyLabel = 'Labelled parts of the illustration') {
    if (!labels.length) return media;
    return `
        <div class="labelled-image">
            ${media}
            ${renderImageLabelLayer(labels)}
        </div>
        ${renderLabelKey(labels, keyLabel)}`;
}
