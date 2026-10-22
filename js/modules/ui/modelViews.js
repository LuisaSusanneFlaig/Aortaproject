// Switches an inline model between the views rendered by storyRenderer
// (for example anatomy and blood flow) when a view button is pressed.
export function switchInlineModelView(button) {
    const figure = button.closest('.inline-model-figure');
    const stage = figure?.querySelector('[data-inline-model]');
    const viewer = stage?.inlineModelViewer;
    if (!viewer) return;

    let view;
    try {
        view = JSON.parse(button.dataset.modelView);
    } catch (error) {
        console.error('[modelViews] Invalid view data', error);
        return;
    }

    const { url, label, labels = [], ...options } = view;
    if (label) stage.setAttribute('aria-label', label);
    stage.dataset.modelLabels = JSON.stringify(labels);
    if (url !== stage.dataset.modelUrl) viewer.labels?.setLabels(labels);
    viewer.switchModel(url, options);
}
