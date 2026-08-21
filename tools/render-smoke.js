import { storyVersions } from '../js/modules/storyContent.js';
import { renderStoryPage } from '../js/modules/storyRenderer.js';

function createDocumentStub() {
    const nodes = {
        story: { innerHTML: '' },
        'nav-links': { innerHTML: '' }
    };
    const storyTitle = { textContent: '' };
    const mobileNav = { innerHTML: '' };

    return {
        body: { dataset: {} },
        getElementById(id) {
            return nodes[id] || null;
        },
        querySelector(selector) {
            if (selector === '[data-story-title]') return storyTitle;
            if (selector === '#nav-menu-mobile ul') return mobileNav;
            return null;
        },
        nodes,
        storyTitle,
        mobileNav
    };
}

export function smokeTestStoryRendering() {
    const errors = [];
    const previousDocument = globalThis.document;

    try {
        for (const [version, config] of Object.entries(storyVersions)) {
            const documentStub = createDocumentStub();
            globalThis.document = documentStub;

            try {
                renderStoryPage(config, version);
                const renderedSections = (documentStub.nodes.story.innerHTML.match(/<section class="step\b/g) || []).length;
                if (renderedSections !== config.sections.length) {
                    errors.push(`${version}: rendered ${renderedSections} of ${config.sections.length} sections`);
                }
                if (documentStub.storyTitle.textContent !== config.title) {
                    errors.push(`${version}: page title was not rendered`);
                }
            } catch (error) {
                errors.push(`${version}: renderer threw ${error.name}: ${error.message}`);
            }
        }
    } finally {
        if (previousDocument === undefined) delete globalThis.document;
        else globalThis.document = previousDocument;
    }

    return errors;
}

if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replace(/\\/g, '/')}`).href) {
    const errors = smokeTestStoryRendering();
    if (errors.length) {
        console.error(`Render smoke test failed with ${errors.length} error(s):`);
        errors.forEach((error) => console.error(`- ${error}`));
        process.exitCode = 1;
    } else {
        console.log(`Render smoke test passed: ${Object.keys(storyVersions).length} stories.`);
    }
}
