// Developer panel: switch story, flow version and density without editing
// URLs. Open it with ?dev on any story page or the ending (remembered in this
// browser; ?dev=0 closes it for good). Never shown in study mode (a SoSci
// case token in the URL), so participants cannot reach it from their links.
// "Participant view" opens the current story and version the way SoSci
// links to it (story.html with its condition code, js/studyConditions.js).
import { flowViewOptions, getFlowView } from './modules/flowView.js';
import { conditionCode, isStudyMode } from './studyConditions.js';

const STORAGE_KEY = 'aorta-dev';
const STORIES = [
    { id: 'aneurysm', label: 'Alex' },
    { id: 'dissection', label: 'Miriam' }
];
const VIEW_LABELS = { illustration: 'Drawings', lines: 'Pathlines', particles: 'Particles' };

function devModeOn() {
    const value = new URLSearchParams(window.location.search).get('dev');
    try {
        if (value === '0') localStorage.removeItem(STORAGE_KEY);
        else if (value !== null) localStorage.setItem(STORAGE_KEY, '1');
        return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return value !== null && value !== '0';
    }
}

function pageLink(page, changes = {}) {
    const url = new URL(page, window.location.href);
    const current = new URLSearchParams(window.location.search);
    const view = changes.view || getFlowView();
    url.searchParams.set('view', view);
    const budget = 'budget' in changes ? changes.budget : current.get('budget');
    if (budget) url.searchParams.set('budget', budget);
    return `${url.pathname.split('/').pop()}${url.search}`;
}

function button(href, label, active) {
    return `<a href="${href}"${active ? ' class="is-active" aria-current="true"' : ''}>${label}</a>`;
}

function renderPanel() {
    const story = document.body.dataset.storyVersion || null;
    const view = getFlowView();
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const fullDensity = new URLSearchParams(window.location.search).get('budget') === 'full';
    const storyButtons = STORIES.map(({ id, label }) => button(pageLink(`scrollytelling-${id}.html`), label, id === story)).join('')
        + button(pageLink('ending.html'), 'Ending', page === 'ending.html');
    const viewButtons = flowViewOptions.map(({ id }) => button(pageLink(page, { view: id }), VIEW_LABELS[id] || id, id === view)).join('');
    const densityButtons = story
        ? `<div class="dev-panel-row"><span>Density</span>${button(pageLink(page, { budget: null }), 'Matched', !fullDensity)}${button(pageLink(page, { budget: 'full' }), 'Full', fullDensity)}</div>`
        : '';
    const code = conditionCode(story, view);
    const participant = story && code ? `story.html?token=dev-preview&order=1&c=${code}` : `ending.html?token=dev-preview&order=1&c=${code}`;

    const panel = document.createElement('details');
    panel.className = 'dev-panel';
    panel.open = true;
    panel.innerHTML = `
        <summary>Dev</summary>
        <div class="dev-panel-row"><span>Page</span>${storyButtons}</div>
        <div class="dev-panel-row"><span>View</span>${viewButtons}</div>
        ${densityButtons}
        <div class="dev-panel-row"><span>Study</span><a href="${participant}" title="Code ${code}">Participant view</a><a href="${pageLink(page)}&dev=0">Close dev</a></div>`;
    document.body.append(panel);
}

if (!isStudyMode() && devModeOn()) renderPanel();
