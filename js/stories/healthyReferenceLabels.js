// Labels for the healthy reference aorta, shared by both stories.
// 3D anchors: [x, y, z] fractions of the vessel wall box of the healthy flow
// exports (lines and particles share it). Pick new ones with ?pickLabels.
export const healthyModelLabels = [
    { text: 'Aortic root', anchor: [0.17, 0.64, 0.249], side: 'left' },
    { text: 'Aortic arch', anchor: [0.732, 0.83, 0.748], side: 'right' }
];

// Image anchors: [x, y] fractions of healthy_flow_illustration.gif.
export const healthyIllustrationLabels = [
    { text: 'Aortic root', anchor: [0.31, 0.396], side: 'left' },
    { text: 'Aortic arch', anchor: [0.562, 0.247], side: 'right' }
];
