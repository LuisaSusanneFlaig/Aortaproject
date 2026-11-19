// Links between the app and the SoSci questionnaire.
//
// Study flow (no dashboard, no free story choice): SoSci randomizes the view
// and the story order and links straight to each story with an opaque
// condition code (js/studyConditions.js), so neither the story nor the view
// can be read or switched in the URL:
//   story.html?token=<caseToken()>&c=<code>
// first to story 1, after the story-1 block to story 2, and after the
// story-2 block to ending.html?token=…&c=<code of story 2>.
//
// After each story and after the ending, the button with data-sosci-return
// goes back to SoSci with the case token as `i` (SoSci resumes the same
// interview with ?i=…), plus
//   always:          shown=<code> of the story and view this page actually
//                    rendered (ending: of the view), so a lost or wrong code
//                    shows up in the data; SoSci decodes it with the same
//                    table and picks the story block from it
//   after a story:   the usage data (js/modules/studyMetrics.js)
//   after the ending: step=ending (SoSci shows the end block)
// The story pages have no link to the dashboard. The button at the end of a
// story appears once every blood-flow section has been in view
// (js/modules/scrollytelling.js, js/modules/studyMetrics.js).
//
// Fallback, not used in the study flow: index.html?…&first=aneurysm|dissection
// opens the dashboard with only the `first` story available; the other is
// greyed out. Without `first` (outside the study) both stories stay open.
import { getFlowView } from './modules/flowView.js';
import { conditionCode } from './studyConditions.js';

// PLACEHOLDER: replace with the questionnaire link, e.g.
// 'https://www.soscisurvey.de/<project>/', once the SoSci questionnaire exists.
export const SOSCI_RETURN_URL = 'https://www.soscisurvey.de/PLACEHOLDER/';

// Parameters every app page passes on to the next app page.
const CARRIED_PARAMS = ['token', 'c', 'view'];
// SoSci reads the case token from ?i= to resume the interview.
const SOSCI_TOKEN_PARAM = 'i';
const STORY_IDS = ['aneurysm', 'dissection'];

function currentParams() {
    return new URLSearchParams(window.location.search);
}

// Adds token and view of the current page to a link to another app page.
export function withStudyParams(href) {
    const url = new URL(href, window.location.href);
    const params = currentParams();
    CARRIED_PARAMS.forEach((name) => {
        const value = params.get(name);
        if (value) url.searchParams.set(name, value);
    });
    return `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
}

// Link back to SoSci with the token and the code of what was shown, plus extra
// parameters such as the usage data of js/modules/studyMetrics.js.
export function sosciReturnUrl(story = null, extra = {}) {
    if (!SOSCI_RETURN_URL) return '';
    const url = new URL(SOSCI_RETURN_URL);
    const token = currentParams().get('token');
    if (token) url.searchParams.set(SOSCI_TOKEN_PARAM, token);
    url.searchParams.set('shown', conditionCode(story, getFlowView()));
    Object.entries(extra).forEach(([name, value]) => url.searchParams.set(name, value));
    return url.href;
}

// `getExtra` (optional) is asked again right before the link is followed,
// so the link carries the values of that moment.
export function initSosciReturnLinks(story = null, root = document, getExtra = () => ({})) {
    root.querySelectorAll('[data-sosci-return]').forEach((link) => {
        const update = () => link.setAttribute('href', sosciReturnUrl(story, getExtra()));
        update();
        ['pointerdown', 'focus', 'click'].forEach((type) => link.addEventListener(type, update));
    });
}

// Dashboard: the story links keep token and view. With ?first=<story> (set
// by SoSci's randomizer) only that story can be started; the other link is
// locked until SoSci links to it after the first questionnaire block.
export function initStoryLinks(root = document) {
    const first = currentParams().get('first');
    const assigned = STORY_IDS.includes(first) ? first : null;
    root.querySelectorAll('[data-study-link]').forEach((link) => {
        if (assigned && link.dataset.story !== assigned) {
            lockStoryLink(link);
            return;
        }
        link.setAttribute('href', withStudyParams(link.getAttribute('href')));
    });
}

function lockStoryLink(link) {
    const locked = document.createElement('span');
    locked.className = 'story-link-locked';
    locked.textContent = 'Available after the first questionnaire';
    link.closest('.story-entry')?.classList.add('is-locked');
    link.replaceWith(locked);
}
