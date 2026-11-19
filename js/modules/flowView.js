// Study versions of the flow visuals. Every flow figure shows either the
// hand-drawn illustrations or one of the two 3D visualizations, without a
// switch inside the figure. The version is chosen with the URL:
//   ?view=illustration | ?view=lines (default) | ?view=particles
// Outside the study the last choice is remembered in this browser, so it
// carries over to the other story and the ending. In study mode (a SoSci case
// token in the URL, ?token=…) only the condition code ?c= counts
// (js/studyConditions.js): ?view= and a saved choice are ignored, so a link
// with a missing or unknown code shows the default and the return link
// reports what was shown (js/studyFlow.js).
import { isStudyMode, studyCondition } from '../studyConditions.js';

export const flowViewOptions = [
    { id: 'illustration' },
    { id: 'lines' },
    { id: 'particles' }
];

const defaultView = 'lines';
const storageKey = 'aorta-flow-view';
const isFlowView = (view) => flowViewOptions.some((option) => option.id === view);

function rememberFlowView(view) {
    try { localStorage.setItem(storageKey, view); } catch { /* storage blocked: the URL still carries the view */ }
}

export function getFlowView() {
    if (isStudyMode()) return studyCondition()?.view || defaultView;
    const requested = new URLSearchParams(window.location.search).get('view');
    if (isFlowView(requested)) {
        rememberFlowView(requested);
        return requested;
    }
    try {
        const saved = localStorage.getItem(storageKey);
        if (isFlowView(saved)) return saved;
    } catch { /* storage blocked */ }
    return defaultView;
}

// Story data can change any object per view with flowViews: { particles: {...} };
// a null value there removes the key.
function resolveOverrides(value, view) {
    if (Array.isArray(value)) return value.map((item) => resolveOverrides(item, view));
    if (!value || typeof value !== 'object') return value;
    const { flowViews, ...rest } = value;
    const merged = { ...rest, ...(flowViews?.[view] || {}) };
    return Object.fromEntries(Object.entries(merged)
        .filter(([, entry]) => entry !== null)
        .map(([key, entry]) => [key, resolveOverrides(entry, view)]));
}

function applyToElement(element, view) {
    if (element.type !== 'modelPlaceholder' || !element.flowVariants?.length) return element;
    if (view === 'illustration' && element.flowIllustration) {
        const { src, flowVariants, ...illustrationOnly } = element;
        return illustrationOnly;
    }
    const { flowIllustration, ...modelOnly } = element;
    const variant = element.flowVariants.find((candidate) => candidate.view === view) || element.flowVariants[0];
    return { ...modelOnly, flowVariants: [variant] };
}

function applyToSection(section, view) {
    const result = { ...section, elements: (section.elements || []).map((element) => applyToElement(element, view)) };
    if (result.inlineModel && result.inlineIllustration) {
        if (view === 'illustration') delete result.inlineModel;
        else delete result.inlineIllustration;
    }
    return result;
}

export function applyFlowView(story, view = defaultView) {
    const resolved = resolveOverrides(story, view);
    return { ...resolved, sections: resolved.sections.map((section) => applyToSection(section, view)) };
}
