// Developer panel: switch page, flow version and density, and switch the
// study pipeline on or off, without editing URLs.
// ALWAYS_VISIBLE = true (for now, for demos): on every page for everyone;
// the "Dev" heading folds it away. Set it to false before the study starts:
// then only ?dev opens it (remembered in this browser; ?dev=0 closes it for
// good), also during a SoSci run in that browser.
//
// Pipeline (js/studyConditions.js):
//   on   with a SoSci token the study flow runs: the code ?c= decides story
//        and view, the dashboard locks the other story, questionnaire buttons
//        lead to SoSci. The view and story buttons swap the code, so the run
//        keeps its token.
//   off  the token is ignored in this browser: both stories open, free view
//        choice (?view=), no questionnaire buttons. Remembered until switched
//        on again.
// "Start test run" opens the dashboard with a test token, which draws a
// random condition like SoSci's base questionnaire.
import { flowViewOptions, getFlowView } from './modules/flowView.js';
import { conditionCode, drawTestCondition, isStudyMode, pipelineOn, setPipeline, studyCondition } from './studyConditions.js';

// TODO before the study starts: false, so participants never see the panel.
const ALWAYS_VISIBLE = true;
const STORAGE_KEY = 'aorta-dev';
const STORIES = [
    { id: 'aneurysm', label: 'Alex' },
    { id: 'dissection', label: 'Miriam' }
];
const VIEW_LABELS = { illustration: 'Drawings', lines: 'Pathlines', particles: 'Particles' };
// Parameters of a study run that the panel's links keep.
const RUN_PARAMS = ['token', 'order', 'mode'];

function devModeOn() {
    if (ALWAYS_VISIBLE) return true;
    const value = new URLSearchParams(window.location.search).get('dev');
    try {
        if (value === '0') localStorage.removeItem(STORAGE_KEY);
        else if (value !== null) localStorage.setItem(STORAGE_KEY, '1');
        return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return value !== null && value !== '0';
    }
}

function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Story of the current page: the story page itself, else the study code.
function currentStory() {
    return document.body.dataset.storyVersion || studyCondition()?.story || null;
}

// Link to `page` ('index', 'ending' or a story id) in `view`.
function pageLink(page, view, budget) {
    const current = new URLSearchParams(window.location.search);
    const isStory = STORIES.some(({ id }) => id === page);
    let url;
    if (isStudyMode()) {
        url = new URL(isStory ? 'story.html' : `${page}.html`, window.location.href);
        RUN_PARAMS.forEach((name) => { if (current.get(name)) url.searchParams.set(name, current.get(name)); });
        url.searchParams.set('c', conditionCode(isStory ? page : (currentStory() || 'aneurysm'), view));
    } else {
        url = new URL(isStory ? `scrollytelling-${page}.html` : `${page}.html`, window.location.href);
        // The dashboard shows no flow, but remembers ?view= for the next story.
        url.searchParams.set('view', view);
        if (current.get('token')) url.searchParams.set('token', current.get('token'));
    }
    if (budget) url.searchParams.set('budget', budget);
    return `${url.pathname.split('/').pop()}${url.search}`;
}

function closeLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('dev', '0');
    return `${currentPage()}${url.search}`;
}

function button(href, label, active) {
    return `<a href="${href}"${active ? ' class="is-active" aria-current="true"' : ''}>${label}</a>`;
}

function renderPanel() {
    const page = currentPage();
    const pageId = page === 'story.html' || page.startsWith('scrollytelling-')
        ? document.body.dataset.storyVersion
        : page.replace('.html', '');
    const view = getFlowView();
    const budget = new URLSearchParams(window.location.search).get('budget');
    const hasToken = new URLSearchParams(window.location.search).has('token');
    const study = isStudyMode();

    const pageButtons = [{ id: 'index', label: 'Dashboard' }, ...STORIES, { id: 'ending', label: 'Ending' }]
        .map(({ id, label }) => button(pageLink(id, view, budget), label, id === pageId)).join('');
    const viewButtons = flowViewOptions
        .map(({ id }) => button(pageLink(pageId, id, budget), VIEW_LABELS[id] || id, id === view)).join('');
    const densityRow = STORIES.some(({ id }) => id === pageId)
        ? `<div class="dev-panel-row"><span>Density</span>${button(pageLink(pageId, view, null), 'Matched', budget !== 'full')}${button(pageLink(pageId, view, 'full'), 'Full', budget === 'full')}</div>`
        : '';
    const on = pipelineOn();
    const status = !on ? 'off' : (study ? `run ${new URLSearchParams(window.location.search).get('c') || '(no code)'}` : 'on, no token');

    const panel = document.createElement('details');
    panel.className = 'dev-panel';
    panel.open = true;
    panel.innerHTML = `
        <summary>Dev</summary>
        <div class="dev-panel-row"><span>Page</span>${pageButtons}</div>
        <div class="dev-panel-row"><span>View</span>${viewButtons}</div>
        ${densityRow}
        <div class="dev-panel-row"><span>Pipeline</span><button type="button" data-pipeline="on"${on ? ' class="is-active" aria-pressed="true"' : ' aria-pressed="false"'}>On</button><button type="button" data-pipeline="off"${on ? ' aria-pressed="false"' : ' class="is-active" aria-pressed="true"'}>Off</button><em>${status}</em></div>
        <div class="dev-panel-row"><span>Study</span><a href="index.html?token=test-dev">Start test run</a>${ALWAYS_VISIBLE ? '' : `<a href="${closeLink()}">Close dev</a>`}</div>`;
    panel.querySelectorAll('[data-pipeline]').forEach((control) => control.addEventListener('click', () => {
        setPipeline(control.dataset.pipeline === 'on');
        window.location.reload();
    }));
    if (hasToken && !on) panel.title = 'The token in the URL is ignored while the pipeline is off.';
    document.body.append(panel);
}

// A test token draws its condition first, so the panel shows the code.
if (devModeOn()) {
    drawTestCondition();
    renderPanel();
}
