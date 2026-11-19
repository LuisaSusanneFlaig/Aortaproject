// Study conditions behind opaque codes, so participants cannot read or switch
// the story or the flow version in a URL.
//
// SoSci links to story.html?token=<caseToken()>&c=<code> for each story and to
// ending.html?token=…&c=<code of the second story> for the ending. The same
// table belongs in the SoSci questionnaire (to build the links and to decode
// the `shown` value the return links send back, js/studyFlow.js).
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

// story.html carries no story: take it from the code before the page renders.
export function applyStudyStory(body = document.body) {
    if (body.dataset.storyVersion) return;
    const story = studyCondition()?.story || 'aneurysm';
    body.dataset.storyVersion = story;
    document.title = STORY_TITLES[story];
}
