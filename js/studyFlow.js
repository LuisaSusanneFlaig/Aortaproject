// Links between the app and the SoSci questionnaires.
//
// Questionnaires (all at SOSCI_BASE, chosen with ?q=):
//   base   consent and pre-questions; randomizes the story order and the view
//   qnr2   questions after the aneurysm story (Alex)
//   qnr3   questions after the dissection story (Miriam)
//   qnr4   final questions, debrief, Prolific completion
//
// Study flow (no dashboard, no free story choice). Story and view are never
// named in a URL; an opaque condition code stands for both
// (js/studyConditions.js), so participants cannot read or switch them:
//   base         -> index.html?token=T&order=O&c=<code of story 1>
//                   (dashboard: only story 1 can be started, the other is
//                   greyed out; its link opens story.html with T, O and the code)
//   story 1      -> qnr2|qnr3 ?token=T&order=O&shown=<code>&next=<code>&<usage data>
//   qnr2|qnr3    -> story.html?token=T&order=O&c=<next>          (after story 1)
//   story 2      -> the other of qnr2|qnr3 (same parameters)
//   qnr2|qnr3    -> ending.html?token=T&order=O&c=<next>         (after story 2)
//   ending       -> qnr4 ?token=T&order=O&shown=<code>
//   qnr4         -> Prolific completion
// T = SoSci caseToken() of the base case (never the Prolific ID); the four
// datasets are merged by it. O = 1 (Alex first) or 2 (Miriam first); the app
// only passes it on.
//   shown  code of the story and view this page actually rendered, so a lost
//          or wrong code shows up in the data
//   next   code of the other story in the same view: SoSci links to it
//          unchanged, so the view cannot change between story 1 and story 2
//          (the ending accepts any code of the view)
// Usage data after a story: js/modules/studyMetrics.js. None of the
// parameter names is reserved by SoSci (q, i, r, s, ref, rnd, pretest,
// password). The button at the end of a story appears once every blood-flow
// section has been in view (js/modules/scrollytelling.js).
//
// Testing without SoSci's randomizer: open index.html?token=test (any token
// starting with "test"); the app draws view and order (js/studyConditions.js).
import { getFlowView } from './modules/flowView.js';
import { conditionCode, drawTestCondition, firstStory, isStudyMode, isTestToken, studyCondition } from './studyConditions.js';

export const SOSCI_BASE = 'https://befragungen.ovgu.de/TheAortaProject/';
// Questionnaire after each story; qnr4 after the ending.
const SOSCI_QUESTIONNAIRES = { aneurysm: 'qnr2', dissection: 'qnr3' };
const SOSCI_FINAL = 'qnr4';

// Pretest links of the questionnaires (SoSci: "Pretest", valid until
// 09.12.2026; renew them there and paste the new codes here). They replace
// ?q=… while the questionnaires are not yet active. Pretest mode is on with
// ?mode=pretest (append it in base's redirect while testing) or a test token
// (?token=test…), and stays on for the rest of the run in this browser tab.
const SOSCI_PRETEST = {
    base: 'JmfDFpCrfIYF5zgKjwkoAY2L',
    qnr2: 'uMghchXSVYiRL9HE5MdBIQyU',
    qnr3: 'qd3wNFBcxjWDEbPGnQLT1o1r',
    qnr4: 'Vd3UHw9MFyHSWAU6BLS25aUf'
};
const PRETEST_KEY = 'aorta-pretest';

// Parameters every app page passes on to the next app page.
const CARRIED_PARAMS = ['token', 'order', 'c', 'view', 'mode'];
// Parameters every link back to SoSci carries from the current URL.
const SOSCI_PARAMS = ['token', 'order', 'mode'];
const STORY_IDS = ['aneurysm', 'dissection'];

function currentParams() {
    return new URLSearchParams(window.location.search);
}

// Adds token, order and code (or view) of the current page to a link to another app page.
export function withStudyParams(href) {
    const url = new URL(href, window.location.href);
    const params = currentParams();
    CARRIED_PARAMS.forEach((name) => {
        const value = params.get(name);
        if (value) url.searchParams.set(name, value);
    });
    return `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
}

export function isPretest() {
    const on = currentParams().get('mode') === 'pretest' || isTestToken();
    try {
        if (on) sessionStorage.setItem(PRETEST_KEY, '1');
        return on || sessionStorage.getItem(PRETEST_KEY) === '1';
    } catch {
        return on;
    }
}

function sosciUrl(questionnaire, values) {
    const url = new URL(SOSCI_BASE);
    if (isPretest()) url.searchParams.set('act', SOSCI_PRETEST[questionnaire]);
    else url.searchParams.set('q', questionnaire);
    const params = currentParams();
    SOSCI_PARAMS.forEach((name) => {
        const value = params.get(name);
        if (value) url.searchParams.set(name, value);
    });
    Object.entries(values).forEach(([name, value]) => url.searchParams.set(name, value));
    return url.href;
}

// After a story: its questionnaire, with the codes of this story and the next
// page, plus extra parameters such as the usage data.
export function sosciReturnUrl(story, extra = {}) {
    const view = getFlowView();
    const other = STORY_IDS.find((id) => id !== story);
    return sosciUrl(SOSCI_QUESTIONNAIRES[story] || SOSCI_FINAL, {
        shown: conditionCode(story, view),
        next: conditionCode(other, view),
        ...extra
    });
}

// After the ending: the final questionnaire.
export function sosciFinalUrl() {
    return sosciUrl(SOSCI_FINAL, { shown: conditionCode(null, getFlowView()) });
}

// Points every [data-sosci-return] link in `root` to `getUrl()`, asked again
// right before the link is followed so it carries the values of that moment.
export function initSosciReturnLinks(root, getUrl) {
    root.querySelectorAll('[data-sosci-return]').forEach((link) => {
        const update = () => link.setAttribute('href', getUrl());
        update();
        ['pointerdown', 'focus', 'click'].forEach((type) => link.addEventListener(type, update));
    });
}

// Dashboard. In study mode (token) the code's story is the only one that can
// be started; its link goes to story.html with token, order and code, so the
// story name never shows in the URL. The other story is greyed out: "available
// after the first questionnaire", or "already read" when SoSci links to the
// dashboard for the second story. A test token without a code draws one first
// (js/studyConditions.js). Outside the study both stories stay open; the old
// ?first=<story> still locks the other one.
export function initStoryLinks(root = document) {
    drawTestCondition();
    const params = currentParams();
    const condition = isStudyMode() ? studyCondition() : null;
    const first = params.get('first');
    const assigned = condition?.story || (STORY_IDS.includes(first) ? first : null);
    const secondStory = condition && firstStory() && firstStory() !== condition.story;
    root.querySelectorAll('[data-study-link]').forEach((link) => {
        if (assigned && link.dataset.story !== assigned) {
            lockStoryLink(link, secondStory ? 'Already read' : 'Available after the first questionnaire');
            return;
        }
        link.setAttribute('href', withStudyParams(condition ? 'story.html' : link.getAttribute('href')));
    });
    // The logo leads back to this dashboard, with the same parameters.
    if (isStudyMode()) {
        root.querySelectorAll('a.nav-logo').forEach((link) => link.setAttribute('href', withStudyParams('index.html')));
    }
}

function lockStoryLink(link, text) {
    const locked = document.createElement('span');
    locked.className = 'story-link-locked';
    locked.textContent = text;
    link.closest('.story-entry')?.classList.add('is-locked');
    link.replaceWith(locked);
}
