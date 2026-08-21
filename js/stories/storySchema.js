export const supportedElementTypes = new Set([
    'heading',
    'text',
    'pullQuote',
    'image',
    'video',
    'stat',
    'chart',
    'aorticStat',
    'aneurysmBurden',
    'aneurysmGrowth',
    'aneurysmSexRisk',
    'aneurysmRiskDrivers',
    'symptomBars',
    'diagnosticPath',
    'treatmentDecision',
    'treatmentSteps',
    'treatmentBalance',
    'preventionTimeline',
    'closingStatement',
    'imagingComparison',
    'modelPlaceholder',
    'pairedPrognosis',
    'reference',
    'iconGrid',
    'iconImages'
]);

export const supportedScrollModes = new Set([
    'flow',
    'sticky',
    'sequence',
    'comparison'
]);

export const storyShape = Object.freeze({
    story: ['title', 'nav', 'sections'],
    section: ['id', 'title', 'elements'],
    navigation: ['href', 'label'],
    element: ['type']
});
