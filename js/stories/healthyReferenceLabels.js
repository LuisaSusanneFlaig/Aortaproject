import { healthyFlowArrows } from './healthyFlowArrows.js';

// Labels and drawing of the healthy reference aorta, shared by both stories.
// 3D anchors: [x, y, z] fractions of the vessel wall box of the healthy flow
// exports (lines and particles share it). Pick new ones with ?pickLabels.
export const healthyModelLabels = [
    { text: 'Aortic root', anchor: [0.17, 0.64, 0.249], side: 'left' },
    { text: 'Aortic arch', anchor: [0.732, 0.83, 0.748], side: 'right' }
];

// Image anchors: [x, y] fractions of healthy_aorta_illustration.png.
export const healthyIllustrationLabels = [
    { text: 'Aortic root', anchor: [0.31, 0.396], side: 'left' },
    { text: 'Aortic arch', anchor: [0.562, 0.247], side: 'right' }
];

// Still drawing; the arrows grow over it (js/modules/ui/flowArrows.js).
export const healthyIllustrationSrc = 'assets/story_images/healthy_aorta_illustration.png';

// Order as in Figma: 1 ascending aorta, 2a–2c branches, 3 aortic arch,
// 4–6 descending aorta. The branches and the arch start when arrow 1 arrives,
// 4 when the arch arrow arrives, so the flow runs on without a pause.
export const healthyIllustrationArrows = {
    ...healthyFlowArrows,
    timing: [
        {},
        { after: 0 },
        { after: 0, delay: 75 },
        { after: 0, delay: 150 },
        { after: 0 },
        { after: 4 },
        { after: 5 },
        { after: 6 }
    ]
};
