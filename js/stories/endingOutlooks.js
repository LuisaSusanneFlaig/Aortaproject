// Copy of the shared ending (ending.html, filled by js/ending.js). The text
// follows the flow version the reader saw (?view=, see js/modules/flowView.js):
// the 3D views (pathlines and particles) share one text, the illustrations
// have their own.
export const endingOutlooks = {
    simulation: {
        label: 'In the simulation',
        alex: 'Most blood passes quickly through Alex\'s widened aortic arch. Slower blood near the wall of the bulge swirls into a vortex instead of flowing smoothly.',
        miriam: 'Most blood continues down the true lumen. Some enters the false lumen through the tear and circles there.',
        summary: 'Neither simulation predicts how Alex\'s or Miriam\'s story will continue. What both show is the same link: when the shape of the aorta changes, the flow inside it changes too, and the wall is exposed to that flow with every heartbeat. Making this invisible flow visible helps explain why both of them need long-term follow-up.'
    },
    illustration: {
        label: 'In the drawing',
        alex: 'Most blood passes quickly through Alex\'s widened aortic arch. Slower blood near the wall of the bulge swirls instead of flowing smoothly.',
        miriam: 'Most blood continues down the true lumen. Some enters the false lumen through the tear and circles there.',
        summary: 'Neither drawing predicts how Alex\'s or Miriam\'s story will continue. What both show is the same link: when the shape of the aorta changes, the flow inside it changes too, and the wall is exposed to that flow with every heartbeat. Showing this invisible flow helps explain why both of them need long-term follow-up.'
    }
};
