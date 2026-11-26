// Fills the outlooks of ending.html with the text for the flow version the
// reader saw: the condition code ?c= in the study, else ?view= (js/modules/flowView.js).
import { getFlowView } from './modules/flowView.js';
import { endingOutlooks } from './stories/endingOutlooks.js';
import { initSosciReturnLinks, sosciFinalUrl } from './studyFlow.js';
import { isStudyMode } from './studyConditions.js';
import './devPanel.js';

// "Continue to the final questions": the final SoSci questionnaire (qnr4).
// The ending has no lock: SoSci links to it after the second story block.
// Outside the study (no token, or pipeline off) the button is hidden.
if (isStudyMode()) initSosciReturnLinks(document, sosciFinalUrl);
else document.querySelectorAll('[data-sosci-return]').forEach((link) => { link.style.display = 'none'; });

const copy = endingOutlooks[getFlowView() === 'illustration' ? 'illustration' : 'simulation'];

document.querySelectorAll('[data-ending-flow]').forEach((paragraph) => {
    const label = document.createElement('strong');
    label.textContent = copy.label;
    paragraph.replaceChildren(label, ` ${copy[paragraph.dataset.endingFlow]}`);
});
const summary = document.querySelector('[data-ending-summary]');
if (summary) summary.textContent = copy.summary;
