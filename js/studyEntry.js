// story.html: picks the story from the condition code before the app starts
// (js/studyConditions.js). The readable story pages already name their story.
// A test token without a code draws a condition first.
import { applyStudyStory, drawTestCondition } from './studyConditions.js';

drawTestCondition();
applyStudyStory();
