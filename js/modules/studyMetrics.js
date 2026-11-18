// Usage data for the study, sent back to SoSci with the "Go to questionnaire"
// button (js/studyFlow.js):
//   story_total           seconds the whole story page was viewed (tab in
//                         the foreground), from opening it to the button
//   flow_read, flow_prog  seconds the blood-flow sections were on screen
//                         (sections with studyMetric in the story data; a
//                         section counts while it lies under the middle of
//                         the window and the tab is in the foreground)
//   flow_read_n,          how often the reader entered that section
//   flow_prog_n           (1 = once; more = came back to it)
//   info                  how often each info window was opened, as
//                         "name:count,name:count" (only opened windows)
//   models_ok             1 = every 3D view in the blood-flow sections has
//                         loaded, 0 = at least one failed or is still
//                         loading, na = no 3D views (illustration version)
//   load_s                longest loading time of those 3D views, in seconds
//                         (one decimal; empty if none has loaded)
//   reduced_motion        1 = the system asks for reduced motion, so the
//                         flow animations and arrows stand still
//   device, vw            mobile / tablet / desktop and the window width in
//                         CSS pixels when the story was opened
// Counts and times survive a reload in the same tab (sessionStorage); the
// load values and the device describe the current page.

const TICK_MS = 1000;
const FLOW_METRICS = ['flow_read', 'flow_prog'];
const INFO_TRIGGERS = [
    '.inline-info-term', '.symptom-info-trigger', '.diagnostic-info-trigger', '.decision-info-trigger',
    '.prevention-info-trigger', '.image-hotspot', '.process-info-trigger'
].join(', ');
const INFO_DETAILS = 'details.story-info-popup, details.model-viewport-info-popup';

// Short, stable name of an info window, from its visible term or label.
function infoName(element) {
    const summary = element.matches('details') ? element.querySelector('summary') : null;
    const text = (summary ? (summary.textContent.trim() || summary.getAttribute('aria-label')) : null)
        || (element.matches('.inline-info-term') ? element.textContent : element.getAttribute('aria-label'))
        || element.textContent || 'info';
    return text
        .replace(/^(More|Show) information about /i, '')
        .normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        .slice(0, 30) || 'info';
}

function deviceType(width) {
    if (width <= 700) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}

function load(key) {
    try {
        const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
        if (saved && typeof saved === 'object') {
            return { seconds: saved.seconds || {}, opens: saved.opens || {}, entries: saved.entries || {} };
        }
    } catch { /* storage blocked */ }
    return { seconds: {}, opens: {}, entries: {} };
}

// 3D views in the blood-flow sections: loaded, failed and load times are
// noted by js/modules/ui/InlineModelViewer.js.
function modelParams(sections) {
    const viewers = sections.flatMap((section) => [...section.querySelectorAll('[data-inline-model]')])
        .map((container) => container.inlineModelViewer)
        .filter(Boolean);
    if (!viewers.length) return { models_ok: 'na', load_s: '' };
    const loaded = viewers.every((viewer) => viewer.loadEndedAt && !viewer.loadFailed);
    const times = viewers
        .filter((viewer) => viewer.loadStartedAt && viewer.loadEndedAt)
        .map((viewer) => (viewer.loadEndedAt - viewer.loadStartedAt) / 1000);
    return {
        models_ok: loaded ? '1' : '0',
        load_s: times.length ? Math.max(...times).toFixed(1) : ''
    };
}

export function initStudyMetrics(story, root = document) {
    const token = new URLSearchParams(window.location.search).get('token') || 'no-token';
    const storageKey = `aorta-study-${token}-${story}`;
    const data = load(storageKey);
    const save = () => {
        try { sessionStorage.setItem(storageKey, JSON.stringify(data)); } catch { /* storage blocked */ }
    };
    const width = window.innerWidth;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Dwell time: milliseconds per metric, added up on every tick.
    const sections = [...root.querySelectorAll('[data-study-metric]')];
    let inView = null;
    let current = null;
    let visible = false;
    let last = performance.now();
    const sectionInView = () => {
        const middle = window.innerHeight / 2;
        const section = sections.find((element) => {
            const rect = element.getBoundingClientRect();
            return rect.top <= middle && rect.bottom >= middle;
        });
        return section?.dataset.studyMetric || null;
    };
    const tick = () => {
        const now = performance.now();
        if (visible) data.seconds.story_total = (data.seconds.story_total || 0) + (now - last);
        if (current) data.seconds[current] = (data.seconds[current] || 0) + (now - last);
        last = now;
        visible = document.visibilityState === 'visible';
        // An entry counts when the section comes under the middle of the
        // window, not when the tab comes back to the foreground.
        const next = sectionInView();
        if (next && next !== inView) data.entries[next] = (data.entries[next] || 0) + 1;
        inView = next;
        current = visible ? inView : null;
        save();
    };
    ['scroll', 'resize'].forEach((type) => window.addEventListener(type, tick, { passive: true }));
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pagehide', tick);
    window.setInterval(tick, TICK_MS);
    tick();

    // Info windows: count every opening.
    const opened = (name) => {
        data.opens[name] = (data.opens[name] || 0) + 1;
        save();
    };
    new MutationObserver((mutations) => {
        mutations.forEach(({ target, attributeName }) => {
            if (attributeName === 'aria-expanded' && target.matches(INFO_TRIGGERS) && target.getAttribute('aria-expanded') === 'true') opened(infoName(target));
            if (attributeName === 'open' && target.matches(INFO_DETAILS) && target.open) opened(infoName(target));
        });
    }).observe(root.body || root, { subtree: true, attributes: true, attributeFilter: ['aria-expanded', 'open'] });

    return {
        // Parameters for the link back to SoSci.
        params() {
            tick();
            const params = {};
            ['story_total', ...FLOW_METRICS].forEach((metric) => {
                params[metric] = String(Math.round((data.seconds[metric] || 0) / 1000));
            });
            FLOW_METRICS.forEach((metric) => {
                params[`${metric}_n`] = String(data.entries[metric] || 0);
            });
            params.info = Object.entries(data.opens).map(([name, count]) => `${name}:${count}`).join(',');
            Object.assign(params, modelParams(sections));
            params.reduced_motion = reducedMotion ? '1' : '0';
            params.device = deviceType(width);
            params.vw = String(width);
            return params;
        }
    };
}
