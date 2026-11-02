import { storyVersions } from '../js/modules/storyContent.js';
import { renderStoryPage } from '../js/modules/storyRenderer.js';
import { applyFlowView, flowViewOptions } from '../js/modules/flowView.js';

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
        const studyVersions = Object.entries(storyVersions).flatMap(([story, baseConfig]) =>
            flowViewOptions.map(({ id }) => [`${story}[view=${id}]`, applyFlowView(baseConfig, id), story]));
        for (const [version, config, story] of studyVersions) {
            const documentStub = createDocumentStub();
            globalThis.document = documentStub;

            try {
                renderStoryPage(config, story);
                const renderedSections = (documentStub.nodes.story.innerHTML.match(/<section class="step\b/g) || []).length;
                if (renderedSections !== config.sections.length) {
                    errors.push(`${version}: rendered ${renderedSections} of ${config.sections.length} sections`);
                }
                const visualColumns = (documentStub.nodes.story.innerHTML.match(/class="story-visual-column"/g) || []).length;
                const copyColumns = (documentStub.nodes.story.innerHTML.match(/class="story-copy-column"/g) || []).length;
                if (visualColumns !== config.sections.length || copyColumns !== config.sections.length) {
                    errors.push(`${version}: split layout rendered ${visualColumns} visual and ${copyColumns} copy columns for ${config.sections.length} sections`);
                }
                if (/data-flow-view="illustration"|class="flow-variant-controls"/.test(documentStub.nodes.story.innerHTML)) {
                    errors.push(`${version}: a flow figure still offers a switch between study versions`);
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
