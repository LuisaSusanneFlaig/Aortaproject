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

    if (element.type === 'processSteps') {
        (element.steps || []).forEach((step, stepIndex) => {
            const visual = step.visual || {};
            const visualPath = `${path}.steps[${stepIndex}].visual`;
            if (!step.title?.trim()) addError(errors, `${path}.steps[${stepIndex}].title`, 'step title is required');
            if (visual.kind === 'image' && !visual.src) addError(errors, `${visualPath}.src`, 'image is required');
            if (visual.kind === 'image' && !visual.alt?.trim()) addError(errors, `${visualPath}.alt`, 'meaningful alternative text is required');
            if (visual.kind === 'slices' && !visual.src) addError(errors, `${visualPath}.src`, 'slice image is required');
            if (visual.kind === 'slices' && !visual.alt?.trim()) addError(errors, `${visualPath}.alt`, 'meaningful alternative text is required');
            if (visual.kind === 'model' && !visual.url) addError(errors, `${visualPath}.url`, '3D model URL is required');
            if (visual.kind === 'model' && !visual.label?.trim()) addError(errors, `${visualPath}.label`, 'accessible model label is required');
        });
    }

    if (element.type === 'modelPlaceholder' && element.src && !element.alt?.trim()) {
        addError(errors, `${path}.alt`, 'animated model alternative text is required');
    }

    if (element.type === 'modelPlaceholder') {
        validateLabels(element.labels, `${path}.labels`, 3, errors);
        validateLabels(element.healthyLabels, `${path}.healthyLabels`, 3, errors);
        validateLabels(element.flowIllustration?.labels, `${path}.flowIllustration.labels`, 2, errors);
        validateLabels(element.flowIllustration?.healthyLabels, `${path}.flowIllustration.healthyLabels`, 2, errors);
        validateArrows(element.flowIllustration?.arrows, `${path}.flowIllustration.arrows`, errors);
        validateArrows(element.flowIllustration?.healthyArrows, `${path}.flowIllustration.healthyArrows`, errors);
        if (element.flowColors && !['accent', 'lumen', 'region'].includes(element.flowColors)) {
            addError(errors, `${path}.flowColors`, 'must be "accent", "lumen", or "region"');
        }
        if (element.flowColors === 'region') {
            const region = element.flowRegion;
            const center = region?.center;
            if (!Array.isArray(center) || center.length !== 3 || center.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
                addError(errors, `${path}.flowRegion.center`, 'must be three numbers between 0 and 1');
            }
            if (!Number.isFinite(region?.radius) || region.radius <= 0) addError(errors, `${path}.flowRegion.radius`, 'must be a positive number');
        }
    }
}

// Arrow sets come from tools/extract-flow-arrows.js.
function validateArrows(arrowSet, arrowsPath, errors) {
    if (!arrowSet) return;
    if (!/^[\d.]+ [\d.]+ [\d.]+ [\d.]+$/.test(arrowSet.viewBox || '')) addError(errors, `${arrowsPath}.viewBox`, 'must be "x y width height"');
    if (!arrowSet.arrows?.length) addError(errors, `${arrowsPath}.arrows`, 'at least one arrow is required');
    (arrowSet.arrows || []).forEach((arrow, arrowIndex) => {
        if (!/^M[\d.\s-]+[LC]/.test(arrow?.d || '')) addError(errors, `${arrowsPath}.arrows[${arrowIndex}].d`, 'must be path data starting with M');
    });
    if (arrowSet.tint) {
        const { color, rects } = arrowSet.tint;
        if (!/^#[\da-f]{3,8}$/i.test(color || '')) addError(errors, `${arrowsPath}.tint.color`, 'must be a hex colour');
        if (!rects?.length) addError(errors, `${arrowsPath}.tint.rects`, 'at least one rectangle is required');
        (rects || []).forEach((rect, rectIndex) => {
            if (!Array.isArray(rect) || rect.length < 4 || rect.length > 6 || rect.some((value) => !Number.isFinite(value))) {
                addError(errors, `${arrowsPath}.tint.rects[${rectIndex}]`, 'must be [x, y, width, height, rotate?, radius?]');
            }
        });
    }
    if (arrowSet.overlay) {
        const { src, rect } = arrowSet.overlay;
        if (!src) addError(errors, `${arrowsPath}.overlay.src`, 'image source is required');
        if (!Array.isArray(rect) || rect.length !== 4 || rect.some((value) => !Number.isFinite(value))) addError(errors, `${arrowsPath}.overlay.rect`, 'must be [x, y, width, height]');
    }
    (arrowSet.timing || []).forEach((timing, timingIndex) => {
        const timingPath = `${arrowsPath}.timing[${timingIndex}]`;
        if (timing.after !== undefined && !(Number.isInteger(timing.after) && timing.after >= 0 && timing.after < timingIndex)) addError(errors, `${timingPath}.after`, 'must be the index of an earlier arrow');
        if (timing.at !== undefined && !['arrive', 'done', 'pass'].includes(timing.at)) addError(errors, `${timingPath}.at`, 'must be "arrive", "done" or "pass"');
        if (timing.meet !== undefined && !(Array.isArray(timing.meet) && timing.meet.length === 2 && timing.meet.every(Number.isFinite) && Number.isInteger(timing.after))) addError(errors, `${timingPath}.meet`, 'must be [x, y] together with "after"');
    });
}

// 3D labels anchor to [x, y, z] of the model's wall box, image labels to [x, y] of the image.
function validateLabels(labels, labelsPath, axes, errors) {
    (labels || []).forEach((label, labelIndex) => {
        const labelPath = `${labelsPath}[${labelIndex}]`;
        if (!label?.text?.trim()) addError(errors, `${labelPath}.text`, 'label text is required');
        const anchor = label?.anchor;
        if (!Array.isArray(anchor) || anchor.length !== axes || anchor.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
            addError(errors, `${labelPath}.anchor`, `must be ${axes === 3 ? 'three' : 'two'} numbers between 0 and 1`);
        }
    });
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
        validateLabels(section.inlineModel?.labels, `${path}.inlineModel.labels`, 3, errors);
        validateLabels(section.inlineModel?.flowView?.labels, `${path}.inlineModel.flowView.labels`, 3, errors);
        validateLabels(section.inlineIllustration?.labels, `${path}.inlineIllustration.labels`, 2, errors);
        validateArrows(section.inlineIllustration?.arrows, `${path}.inlineIllustration.arrows`, errors);
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
        add(section.inlineIllustration?.src, `${sectionPath}.inlineIllustration.src`);
        add(section.meshUrl, `${sectionPath}.meshUrl`);
        add(section.pathlinesUrl, `${sectionPath}.pathlinesUrl`);
        section.elements.forEach((element, elementIndex) => {
            const elementPath = `${sectionPath}.elements[${elementIndex}]`;
            add(element.src, `${elementPath}.src`);
            (element.items || []).forEach((item, itemIndex) => {
                add(item.src, `${elementPath}.items[${itemIndex}].src`);
            });
            (element.steps || []).forEach((step, stepIndex) => {
                add(step.visual?.src || step.visual?.url, `${elementPath}.steps[${stepIndex}].visual`);
            });
            (element.flowVariants || []).forEach((variant, variantIndex) => {
                add(variant.src, `${elementPath}.flowVariants[${variantIndex}].src`);
                add(variant.comparisonSrc, `${elementPath}.flowVariants[${variantIndex}].comparisonSrc`);
            });
            add(element.flowIllustration?.src, `${elementPath}.flowIllustration.src`);
            add(element.flowIllustration?.healthySrc, `${elementPath}.flowIllustration.healthySrc`);
            add(element.flowIllustration?.arrows?.overlay?.src, `${elementPath}.flowIllustration.arrows.overlay.src`);
        });
    });

    return assets;
}
