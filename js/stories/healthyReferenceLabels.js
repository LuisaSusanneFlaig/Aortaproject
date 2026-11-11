import { healthyFlowArrows } from './healthyFlowArrows.js';

// Labels and drawing of the reference aorta, shared by both stories. It is the
// pre-dissection geometry of dataset 0246_H_AO_AOD: Miriam's own aorta before
// the dissection (Marfan syndrome), so the story texts must not call it healthy.
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

// One arrow runs from the heart around the arch and down the body; each
// branch arrow starts when its head passes the branch.
export const healthyIllustrationArrows = {
    ...healthyFlowArrows,
    size: 1.6, // line width and arrowheads (1 = 2 px in drawing units)
    timing: [
        {},
        { after: 0, at: 'pass' },
        { after: 0, at: 'pass' },
        { after: 0, at: 'pass' }
    ]
};
