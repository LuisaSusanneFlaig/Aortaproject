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
//   sec_s, sec_n          seconds on screen and number of entries for every
//                         story section, comma-separated in story order
//                         (section 1 first; same rule as flow_read: the
//                         section under the middle of the window, tab in the
//                         foreground)
//   max_sec               furthest section reached (1-based; reached = its
//                         top has passed the middle of the window)
//   completed             1 = the last section was reached, 0 = not
//   drags, drag_s         how often the 3D views were turned by dragging,
//                         and the seconds spent dragging (all views together)
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
// The return link also carries `shown`, the code of the story and view
// that were rendered (js/studyFlow.js).
// flowSeen(): true once every blood-flow section has been entered; the
// questionnaire button waits for it (also fires 'study-flow-seen' on document).
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
            return {
                seconds: saved.seconds || {}, opens: saved.opens || {}, entries: saved.entries || {},
                sectionSeconds: saved.sectionSeconds || {}, sectionEntries: saved.sectionEntries || {},
                maxSection: saved.maxSection || 0, drags: saved.drags || 0, dragMs: saved.dragMs || 0
            };
        }
    } catch { /* storage blocked */ }
    return { seconds: {}, opens: {}, entries: {}, sectionSeconds: {}, sectionEntries: {}, maxSection: 0, drags: 0, dragMs: 0 };
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

    // Dwell time: milliseconds per metric and per section, added up on every tick.
    const sections = [...root.querySelectorAll('[data-study-metric]')];
    const steps = [...root.querySelectorAll('#story .step')];
    const stepKey = (step, index) => step.id || `s${index + 1}`;
    let inView = null;
    let current = null;
    let stepInView = null;
    let currentStep = null;
    let visible = false;
    let last = performance.now();
    let seenAnnounced = false;
    const flowSeen = () => sections.every((section) => (data.entries[section.dataset.studyMetric] || 0) > 0);
    const underMiddle = (element) => {
        const rect = element.getBoundingClientRect();
        const middle = window.innerHeight / 2;
        return rect.top <= middle && rect.bottom >= middle;
    };
    const sectionInView = () => sections.find(underMiddle)?.dataset.studyMetric || null;
    const stepIndexInView = () => steps.findIndex(underMiddle);
    const tick = () => {
        const now = performance.now();
        const elapsed = now - last;
        if (visible) data.seconds.story_total = (data.seconds.story_total || 0) + elapsed;
        if (current) data.seconds[current] = (data.seconds[current] || 0) + elapsed;
        if (currentStep) data.sectionSeconds[currentStep] = (data.sectionSeconds[currentStep] || 0) + elapsed;
        last = now;
        visible = document.visibilityState === 'visible';
        // An entry counts when the section comes under the middle of the
        // window, not when the tab comes back to the foreground.
        const next = sectionInView();
        if (next && next !== inView) data.entries[next] = (data.entries[next] || 0) + 1;
        inView = next;
        current = visible ? inView : null;
        if (!seenAnnounced && flowSeen()) {
            seenAnnounced = true;
            document.dispatchEvent(new CustomEvent('study-flow-seen'));
        }
        const index = stepIndexInView();
        const nextStep = index >= 0 ? stepKey(steps[index], index) : null;
        if (nextStep && nextStep !== stepInView) data.sectionEntries[nextStep] = (data.sectionEntries[nextStep] || 0) + 1;
        stepInView = nextStep;
        currentStep = visible ? stepInView : null;
        // Furthest section whose top has passed the middle of the window.
        const middle = window.innerHeight / 2;
        steps.forEach((step, stepIndex) => {
            if (step.getBoundingClientRect().top <= middle) data.maxSection = Math.max(data.maxSection, stepIndex + 1);
        });
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

    // 3D views: drags by the reader (events from js/modules/ui/InlineModelViewer.js).
    let dragStart = null;
    root.addEventListener('model-drag-start', () => {
        data.drags += 1;
        dragStart = performance.now();
        save();
    });
    root.addEventListener('model-drag-end', () => {
        if (dragStart === null) return;
        data.dragMs += performance.now() - dragStart;
        dragStart = null;
        save();
    });

    return {
        flowSeen,
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
            params.sec_s = steps.map((step, index) => Math.round((data.sectionSeconds[stepKey(step, index)] || 0) / 1000)).join(',');
            params.sec_n = steps.map((step, index) => data.sectionEntries[stepKey(step, index)] || 0).join(',');
            params.max_sec = String(data.maxSection);
            params.completed = steps.length && data.maxSection >= steps.length ? '1' : '0';
            params.drags = String(data.drags);
            params.drag_s = String(Math.round(data.dragMs / 1000));
            params.info = Object.entries(data.opens).map(([name, count]) => `${name}:${count}`).join(',');
            Object.assign(params, modelParams(sections));
            params.reduced_motion = reducedMotion ? '1' : '0';
            params.device = deviceType(width);
            params.vw = String(width);
            return params;
        }
    };
}
