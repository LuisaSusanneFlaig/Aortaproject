// Links between the app and the SoSci questionnaire.
//
// SoSci opens the dashboard with ?token=…&view=…; the participant picks a
// story there. After each story and after the ending, the button with
// data-sosci-return goes back to SoSci with the token, and after a story
// also with story=aneurysm|dissection, so SoSci knows which story was seen
// and links straight to the other one (or to the ending after both).
//
// SOSCI_RETURN_URL is still empty; until it is set, the buttons stay empty.
export const SOSCI_RETURN_URL = '';

// Parameters every app page passes on to the next app page.
const CARRIED_PARAMS = ['token', 'view'];

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

// Link back to SoSci with the token (and the story just seen), plus extra
// parameters such as the usage data of js/modules/studyMetrics.js.
export function sosciReturnUrl(story = null, extra = {}) {
    if (!SOSCI_RETURN_URL) return '';
    const url = new URL(SOSCI_RETURN_URL);
    const token = currentParams().get('token');
    if (token) url.searchParams.set('token', token);
    if (story) url.searchParams.set('story', story);
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

// Dashboard: the story links keep token and view.
export function initStoryLinks(root = document) {
    root.querySelectorAll('[data-study-link]').forEach((link) => {
        link.setAttribute('href', withStudyParams(link.getAttribute('href')));
    });
}
