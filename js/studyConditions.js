// Study conditions behind opaque codes, so participants cannot read or switch
// the story or the flow version in a URL.
//
// SoSci's base questionnaire links to the dashboard,
// index.html?token=<caseToken()>&order=O&c=<code of story 1>, where only that
// story can be started (js/studyFlow.js); every later page gets its code from the `next` value the app
// sends back (js/studyFlow.js), so SoSci needs this table only for the first
// link and to decode `shown` in the data.
//
// Study mode = a SoSci case token in the URL. There, only `c` decides; ?view=
// and a version saved in the browser are ignored (js/modules/flowView.js).
// Without a token the readable pages and ?view= keep working, and ?dev opens
// the developer panel (js/devPanel.js).
export const STUDY_CODES = {
    q7m2xk: { story: 'aneurysm', view: 'illustration' },
    h4tz9p: { story: 'aneurysm', view: 'lines' },
    w8cn3r: { story: 'aneurysm', view: 'particles' },
    b2vf6y: { story: 'dissection', view: 'illustration' },
    k9dj5s: { story: 'dissection', view: 'lines' },
    m3xg8e: { story: 'dissection', view: 'particles' }
};

const STORY_TITLES = {
    aneurysm: 'Aorta Project - Aortic Aneurysm',
    dissection: 'Aorta Project - Aortic Dissection'
};

function params() {
    return new URLSearchParams(window.location.search);
}

export function isStudyMode() {
    return params().has('token');
}

// { story, view } of ?c=, or null when the code is missing or unknown.
export function studyCondition() {
    const code = params().get('c');
    return Object.hasOwn(STUDY_CODES, code || '') ? STUDY_CODES[code] : null;
}

// Code of a story / view pair; with story null, the code in the URL if its
// view matches (ending page), else the first code of that view.
export function conditionCode(story, view) {
    const current = params().get('c');
    if (!story && STUDY_CODES[current]?.view === view) return current;
    return Object.keys(STUDY_CODES).find((code) => STUDY_CODES[code].view === view
        && (!story || STUDY_CODES[code].story === story)) || '';
}

// Test runs without SoSci's randomizer: a token that starts with "test"
// (e.g. ?token=test1) and comes without a valid code gets a random view and,
// unless ?order= is given, a random story order, like SoSci's draw in base.
// The draw is written into the URL (c and order), so the rest of the flow and
// the return links behave as for a participant. Opening the start link again
// draws again. Real case tokens always come with a code, so they never draw.
const TEST_TOKEN = /^test/i;
const STORY_FOR_ORDER = { 1: 'aneurysm', 2: 'dissection' };

export function isTestToken() {
    return TEST_TOKEN.test(params().get('token') || '');
}

export function drawTestCondition() {
    if (!isTestToken() || studyCondition()) return;
    const url = new URL(window.location.href);
    const pick = (list) => list[Math.floor(Math.random() * list.length)];
    const order = STORY_FOR_ORDER[url.searchParams.get('order')] ? url.searchParams.get('order') : pick(['1', '2']);
    const view = pick(['illustration', 'lines', 'particles']);
    const code = Object.keys(STUDY_CODES).find((key) => STUDY_CODES[key].story === STORY_FOR_ORDER[order]
        && STUDY_CODES[key].view === view);
    url.searchParams.set('order', order);
    url.searchParams.set('c', code);
    window.history.replaceState(null, '', url);
}

// Story that comes first for ?order= (1 = Alex, 2 = Miriam), or null.
export function firstStory() {
    return STORY_FOR_ORDER[params().get('order')] || null;
}

// story.html carries no story: take it from the code before the page renders.
export function applyStudyStory(body = document.body) {
    if (body.dataset.storyVersion) return;
    const story = studyCondition()?.story || 'aneurysm';
    body.dataset.storyVersion = story;
    document.title = STORY_TITLES[story];
}
