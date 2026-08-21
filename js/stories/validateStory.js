import { supportedElementTypes, supportedScrollModes } from './storySchema.js';

function addError(errors, path, message) {
    errors.push(`${path}: ${message}`);
}

function validateElement(element, path, errors) {
    if (!element || typeof element !== 'object') {
        addError(errors, path, 'element must be an object');
        return;
    }

    if (!supportedElementTypes.has(element.type)) {
        addError(errors, `${path}.type`, `unsupported element type "${element.type ?? ''}"`);
    }

    if (element.type === 'image') {
        if (!element.src) addError(errors, `${path}.src`, 'image source is required');
        if (!element.alt?.trim()) addError(errors, `${path}.alt`, 'meaningful alternative text is required');
    }

    if (element.type === 'imagingComparison') {
        (element.items || []).forEach((item, index) => {
            if (!item.src) addError(errors, `${path}.items[${index}].src`, 'image source is required');
            if (!item.alt?.trim()) addError(errors, `${path}.items[${index}].alt`, 'alternative text is required');
        });
    }

    if (element.type === 'symptomBars') {
        (element.items || []).forEach((item, index) => {
            const value = Number(item.value);
            if (!Number.isFinite(value) || value < 0 || value > 100) {
                addError(errors, `${path}.items[${index}].value`, 'must be a number between 0 and 100');
            }
        });
    }

    if (element.type === 'modelPlaceholder' && element.src && !element.alt?.trim()) {
        addError(errors, `${path}.alt`, 'animated model alternative text is required');
    }
}

export function validateStory(story, storyKey = 'story') {
    const errors = [];

    if (!story || typeof story !== 'object') {
        return [`${storyKey}: story must be an object`];
    }

    if (!story.title?.trim()) addError(errors, `${storyKey}.title`, 'title is required');
    if (!Array.isArray(story.nav)) addError(errors, `${storyKey}.nav`, 'must be an array');
    if (!Array.isArray(story.sections)) addError(errors, `${storyKey}.sections`, 'must be an array');
    if (!Array.isArray(story.sections)) return errors;

    const ids = new Set();
    story.sections.forEach((section, sectionIndex) => {
        const path = `${storyKey}.sections[${sectionIndex}]`;
        if (!section?.id?.trim()) {
            addError(errors, `${path}.id`, 'stable section ID is required');
        } else if (ids.has(section.id)) {
            addError(errors, `${path}.id`, `duplicate section ID "${section.id}"`);
        } else {
            ids.add(section.id);
        }

        if (!section?.title?.trim()) addError(errors, `${path}.title`, 'title is required');
        if (section.scrollMode && !supportedScrollModes.has(section.scrollMode)) {
            addError(errors, `${path}.scrollMode`, `unsupported mode "${section.scrollMode}"`);
        }
        if (!Array.isArray(section?.elements)) {
            addError(errors, `${path}.elements`, 'must be an array');
        } else {
            section.elements.forEach((element, elementIndex) => {
                validateElement(element, `${path}.elements[${elementIndex}]`, errors);
            });
        }
    });

    (story.nav || []).forEach((item, navIndex) => {
        const path = `${storyKey}.nav[${navIndex}]`;
        if (!item?.label?.trim()) addError(errors, `${path}.label`, 'label is required');
        if (!item?.href?.startsWith('#')) {
            addError(errors, `${path}.href`, 'chapter links must start with #');
            return;
        }
        const target = item.href.slice(1);
        if (!ids.has(target)) addError(errors, `${path}.href`, `missing section target "${target}"`);
    });

    return errors;
}

export function collectStoryAssets(story) {
    const assets = [];
    const add = (value, path) => {
        if (typeof value === 'string' && value.startsWith('assets/')) {
            assets.push({ path, value: value.split('?')[0] });
        }
    };

    story.sections.forEach((section, sectionIndex) => {
        const sectionPath = `sections[${sectionIndex}]`;
        add(section.inlineModel?.url, `${sectionPath}.inlineModel.url`);
        add(section.meshUrl, `${sectionPath}.meshUrl`);
        add(section.pathlinesUrl, `${sectionPath}.pathlinesUrl`);
        section.elements.forEach((element, elementIndex) => {
            const elementPath = `${sectionPath}.elements[${elementIndex}]`;
            add(element.src, `${elementPath}.src`);
            (element.items || []).forEach((item, itemIndex) => {
                add(item.src, `${elementPath}.items[${itemIndex}].src`);
            });
        });
    });

    return assets;
}
