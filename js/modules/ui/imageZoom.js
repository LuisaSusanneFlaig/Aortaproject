// Opens a story image at its original size in a modal dialog. Triggered by
// any button with data-zoom-src (e.g. the + on zoomable process-step images);
// the dialog is shared and created on first use.
let dialog = null;

function createDialog() {
    const element = document.createElement('dialog');
    element.className = 'image-zoom-dialog';
    element.innerHTML = `
        <button class="image-zoom-close" type="button" aria-label="Close enlarged image">×</button>
        <div class="image-zoom-frame"><img alt=""></div>`;
    element.querySelector('.image-zoom-close').addEventListener('click', () => element.close());
    // A click on the dark area around the image closes the dialog.
    element.addEventListener('click', (event) => {
        if (event.target === element || event.target.classList.contains('image-zoom-frame')) element.close();
    });
    document.body.appendChild(element);
    return element;
}

export function initImageZoom() {
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-zoom-src]');
        if (!trigger) return;
        dialog = dialog || createDialog();
        const image = dialog.querySelector('img');
        image.src = trigger.dataset.zoomSrc;
        image.alt = trigger.dataset.zoomAlt || '';
        dialog.showModal();
    });
}
