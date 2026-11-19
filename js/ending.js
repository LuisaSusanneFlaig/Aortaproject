// Fills the outlooks of ending.html with the text for the flow version the
// reader saw: the condition code ?c= in the study, else ?view= (js/modules/flowView.js).
import { getFlowView } from './modules/flowView.js';
import { endingOutlooks } from './stories/endingOutlooks.js';
import { initSosciReturnLinks } from './studyFlow.js';
import './devPanel.js';

// "Continue to the final questions": back to SoSci with the token.
initSosciReturnLinks(null, document, () => ({ step: 'ending' }));

const copy = endingOutlooks[getFlowView() === 'illustration' ? 'illustration' : 'simulation'];

document.querySelectorAll('[data-ending-flow]').forEach((paragraph) => {
    const label = document.createElement('strong');
    label.textContent = copy.label;
    paragraph.replaceChildren(label, ` ${copy[paragraph.dataset.endingFlow]}`);
});
const summary = document.querySelector('[data-ending-summary]');
if (summary) summary.textContent = copy.summary;
