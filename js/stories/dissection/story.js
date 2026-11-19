import { FLOW_LOOP_SECONDS, FLOW_SPEED, LOOP_SECONDS } from '../flowTiming.js';
import { healthyIllustrationArrows, healthyIllustrationLabels, healthyIllustrationSrc, healthyModelLabels } from '../healthyReferenceLabels.js';
import { miriamFlowArrows } from './flowArrows.js';

const flowModelBase = 'assets/models/flow/optimized/';

// 3D anchors: [x, y, z] fractions of the vessel wall box, shared by the anatomy,
// pathline and particle exports of this aorta. Pick new ones with ?pickLabels.
const miriamModelLabels = [
    { text: 'Aortic arch', anchor: [0.283, 0.857, 0.441], side: 'left' },
    { text: 'Entry tear (flap begins)', anchor: [0.628, 0.856, 0.785], side: 'right' },
    // Centers of the white (true) and red (false) lumen lines of the flow export.
    { text: 'True lumen', anchor: [0.775, 0.674, 0.618], side: 'right', behindFlap: true },
    { text: 'False lumen', anchor: [0.778, 0.62, 0.799], side: 'left' },
    { text: 'End of the flap', anchor: [0.42, 0.165, 0.615], side: 'left' }
];

// Image anchors: [x, y] fractions of the anatomy illustration; the flow
// animation is the same drawing at a smaller size.
const miriamIllustrationLabels = [
    { text: 'Aortic arch', anchor: [0.505, 0.298], side: 'left' },
    { text: 'Entry tear (flap begins)', anchor: [0.596, 0.298], side: 'right' },
    // The darker band drawn inside the wall is the false lumen.
    { text: 'True lumen', anchor: [0.695, 0.5], side: 'right' },
    { text: 'False lumen', anchor: [0.642, 0.5], side: 'left' },
    { text: 'End of the flap', anchor: [0.491, 0.786], side: 'left' }
];

// In the flow comparison the affected aorta labels only what the dissection flap changes;
// her aorta before the dissection, beside it, names the regions.
const miriamFlowFindings = ['Entry tear (flap begins)', 'True lumen', 'False lumen', 'End of the flap'];
const miriamFlowModelLabels = miriamModelLabels.filter((label) => miriamFlowFindings.includes(label.text));
// In the flow drawing, no arrow may cross a label. The texts sit left of the
// drawing (no room on the right in the side-by-side panel), so the true-lumen
// dot sits left of the white arrow, and the false-lumen dot lower down, where
// the false channel lies on the outer side and the red arrow is still away.
const miriamFlowIllustrationAnchors = {
    'True lumen': { anchor: [0.624, 0.5], side: 'left' },
    'False lumen': { anchor: [0.546, 0.619], side: 'left' }
};
const miriamFlowIllustrationLabels = miriamIllustrationLabels
    .filter((label) => miriamFlowFindings.includes(label.text))
    .map((label) => ({ ...label, ...miriamFlowIllustrationAnchors[label.text] }));

export const dissectionStory = {

    title: 'Aortic Dissection',
    nav: [
        { href: '#definition-statistics', label: 'Definition' },
        { href: '#s2', label: 'Anatomy' },
        { href: '#s8', label: 'Symptoms' },
        { href: '#s9', label: 'Diagnosis' },
        { href: '#s11', label: 'Prognosis' },
        { href: '#s13', label: 'Treatment' },
        { href: '#s17', label: 'Prevention' }
    ],
    sections: [
        {
            id: 'definition-statistics',
            title: 'Aortic Dissection in Numbers',
            scrollMode: 'sequence',
            className: 'statistics-overview',
            timelineLabel: 'Context',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Aortic dissection is rare, but rarity does not make it insignificant: a small number of cases can have extremely serious consequences. The circle chart on the left shows what rare means. The circle stands for 100,000 people; the five dots are the cases diagnosed each year, and the seven squares are an estimate of cases that may go undetected. What happens next depends strongly on where the dissection begins, as the pie chart below it shows. Type A, about 60–65% of cases, involves the first part of the aorta as it leaves the heart and usually requires immediate treatment. Type B, about 35–40% of cases, begins farther down, beyond the arteries leading to the head, and may follow a different treatment path. This makes aortic dissection an important example of how a single anatomical difference can fundamentally change a medical situation. Miriam\'s dissection is Type B, the red slice of the pie chart.',
                    infoPopup: {
                        title: 'estimate',
                        text: 'Dots: diagnosed cases per year, an average of studies worldwide. Squares: an estimate of undetected cases, based on autopsy data from one region of Germany. When a study in Berlin and Brandenburg also counted dissections near the heart that were found only at autopsy, it arrived at about 12 cases per 100,000 people.'
                    }
                },
                {
                    type: 'aorticStat',
                    variant: 'incidence'
                },
                {
                    type: 'aorticStat',
                    variant: 'split'
                },
                {
                    type: 'reference',
                    text: [
                        'Gouveia e Melo R, et al. A systematic review and meta-analysis of the incidence of acute aortic dissections in population-based studies. Journal of Vascular Surgery. 2022;75(2):709–720. https://doi.org/10.1016/j.jvs.2021.08.080',
                        'Kurz SD, et al. Insight into the incidence of acute aortic dissection in the German region of Berlin and Brandenburg. International Journal of Cardiology. 2017;241:326–329. https://doi.org/10.1016/j.ijcard.2017.05.024',
                        'Smedberg C, et al. Incidence, presentation and outcome of acute aortic dissection: results from a population-based study. Open Heart. 2024;11(1):e002595. https://doi.org/10.1136/openhrt-2023-002595'
                    ]
                }
            ]
        },
        {
            id: 's2',
            title: 'Aortic Anatomy',
            scrollMode: 'sticky',
            timelineLabel: 'Dissected aorta',
            className: 'model-section miriam-aorta-model-section',
            inlineIllustration: {
                src: 'assets/story_images/miriam_dissection_illustration.png',
                alt: 'Illustration of Miriam’s dissected aorta with a second channel within the vessel wall.',
                labels: miriamIllustrationLabels
            },
            inlineModel: {
                url: `${flowModelBase}dissection_anatomy.glb`,
                label: 'Miriam\'s dissected aorta',
                mode: 'flow',
                legend: false,
                rotationX: 0,
                rotationY: -1.5708,
                rotationZ: 0,
                framingScale: 0.9,
                rotationHint: true,
                labels: miriamModelLabels
            },
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Before the tear, Miriam\'s aorta was one continuous vessel with a single channel for blood. Its wall is built from three layers: the inner wall, a strong middle layer, and an outer layer. In a dissection, blood enters through a tear in the inner wall and pushes between the layers, splitting the wall apart.'
                },
                {
                    type: 'text',
                    text: 'The original channel is called the true lumen; the new channel inside the wall is called the false lumen. From that moment, the aorta is no longer just a pipe carrying blood downward. It has become a divided pathway.'
                },
                {
                    type: 'text',
                    text: 'In Miriam\'s aorta, blood leaves the heart and curves through the aortic arch as usual. Just beyond the arch, the entry tear marks where the flap begins. From there, the flap divides the aorta into the true and false lumen until it ends further down.'
                },
                {
                    type: 'reference',
                    text: [
                        'Wilson NM, et al. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. Journal of Medical Devices. 2013;7(4):040923. https://doi.org/10.1115/1.4025983. Dataset 0246_H_AO_AOD: pre-dissection aortic geometry and follow-up case material.',
                        'Bäumler K, et al. Assessment of Aortic Dissection Remodeling With Patient-Specific Fluid–Structure Interaction Models. IEEE Transactions on Biomedical Engineering. 2025;72(3):953–964. https://doi.org/10.1109/TBME.2024.3480362'
                    ]
                }
            ]
        },
        {
            id: 'how-to-read-blood-flow',
            // Dwell time is sent to SoSci (js/modules/studyMetrics.js).
            studyMetric: 'flow_read',
            title: 'How to Read Blood Flow',
            scrollMode: 'sticky',
            timelineLabel: 'Dissected aorta',
            className: 'model-section miriam-flow-reading-section',
            inlineIllustration: {
                src: healthyIllustrationSrc,
                arrows: healthyIllustrationArrows,
                alt: 'Animated illustration of blood flowing through Miriam\'s aorta before the dissection, from the heart through the arch and down the descending aorta.',
                labels: healthyIllustrationLabels
            },
            inlineModel: {
                url: 'assets/models/flow/Healthy_pathlines_2cycles.glb',
                label: 'Simulated blood flow through Miriam\'s aorta before the dissection, shown as colored lines',
                mode: 'flow',
                legend: false,
                rotationX: 0,
                rotationY: -1.5708,
                rotationZ: 0,
                // Pathlines and particles use the same framing and speed
                // (js/stories/flowTiming.js).
                framingScale: 0.92,
                animationFps: 20,
                animationSpeed: FLOW_SPEED,
                loopSeconds: LOOP_SECONDS,
                rotationHint: true,
                labels: healthyModelLabels,
                flowViews: {
                    particles: {
                        url: 'assets/models/flow/Healthy_pulsed_particles_2cycles.glb',
                        label: 'Simulated blood flow through Miriam\'s aorta before the dissection, shown as moving particles',
                        framingScale: 0.92,
                        animationSpeed: FLOW_SPEED
                    }
                }
            },
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Before we look at the blood flow in Miriam\'s dissected aorta, it helps to see how blood moved through it before the tear. This is Miriam\'s own aorta, scanned years before the dissection. Because of her Marfan syndrome, it was not a healthy aorta even then, but it still had a single channel. It shows where the blood travels on its way from the heart through the arch and down into the body.'
                },
                {
                    type: 'text',
                    text: 'In this aorta, blood moves as one orderly stream. This is called laminar flow. It is the baseline for the rest of Miriam\'s story: later, the same view shows what her divided aorta does to this order.',
                    infoPopup: {
                        title: 'laminar flow',
                        text: 'In laminar flow, blood moves in layers that slide past each other, usually fastest in the middle of the vessel and slower near the wall, with hardly any swirling.'
                    }
                },
                {
                    type: 'text',
                    text: 'Flow also matters for blood clots. Doctors use Virchow\'s triad to describe three conditions that make a clot more likely: slow or disturbed blood flow, a damaged vessel wall, and blood that clots more easily than usual. In the orderly flow of this aorta, blood keeps moving, so clots rarely form. After a dissection, two of the three can come together: blood can slow down and swirl in the false lumen, and the torn wall exposes layers that are normally hidden. The false lumen can then partly fill with clot. In type B dissections like Miriam\'s, a partly clotted false lumen has been linked to a higher risk later on, so doctors watch it closely.',
                    infoPopup: {
                        title: 'Virchow\'s triad',
                        text: 'Virchow\'s triad names three conditions that favour a blood clot (thrombus): slow or disturbed blood flow, injury to the vessel wall, and blood that clots more easily than usual. Usually several of them act together. The triad carries the name of the pathologist Rudolf Virchow, although he did not set it out in this form himself.'
                    }
                },
                {
                    type: 'reference',
                    text: [
                        'Bäumler K, Rolf-Pissarczyk M, Schussnig R, Fries TP, Mistelbauer G, Pfaller MR. 0246_H_AO_AOD (Version 1). Stanford Digital Repository. 2025. https://doi.org/10.25740/nj140cs3237. Pre-dissection aortic geometry of the same patient as Miriam\'s dissected aorta.',
                        'Wilson NM, et al. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. Journal of Medical Devices. 2013;7(4):040923. https://doi.org/10.1115/1.4025983',
                        'Bagot CN, Arya R. Virchow and his triad: a question of attribution. British Journal of Haematology. 2008;143(2):180–190. https://doi.org/10.1111/j.1365-2141.2008.07323.x',
                        'Tsai TT, Evangelista A, Nienaber CA, et al. Partial Thrombosis of the False Lumen in Patients with Acute Type B Aortic Dissection. New England Journal of Medicine. 2007;357(4):349–359. https://doi.org/10.1056/NEJMoa063232'
                    ]
                }
            ]
        },
        {
            id: 's8',
            title: 'Clinical Symptoms',
            scrollMode: 'sequence',
            timelineLabel: 'Acute',
            className: 'miriam-symptoms-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'A dissection like Miriam\'s usually announces itself with strong warning signs. The chart shows how often each warning sign was reported by 1,891 people with acute Type B dissection, the type Miriam has, in an international registry (IRAD). Still, no single sign proves a dissection, and a fainting episode, a normal heart tracing, or a normal chest X-ray cannot safely rule it in or out. Symptoms are only the first clue.'
                },
                {
                    type: 'symptomBars',
                    subtitle: '1,891 people with acute Type B dissection',
                    items: [
                        { icon: 'bolt', label: 'Severe or worst-ever pain', value: 88.7, color: '#c83c48', info: 'Many people describe the pain as tearing or ripping, unlike any pain they have felt before. It needs urgent medical assessment.' },
                        { icon: 'rib_cage', label: 'Chest or back pain', value: 88.7, color: '#c83c48', info: 'The pain can be felt in the chest, the back, or both. Its location alone cannot confirm a dissection. Type A dissections cause similar warning signs, with chest pain being more common there.' },
                        { icon: 'acute', label: 'Sudden onset', value: 85.4, color: '#c83c48', info: 'Dissection pain usually reaches its full strength within moments, unlike pain that builds up slowly. This abrupt start is a clinical clue.' },
                        { icon: 'blood_pressure', label: 'High blood pressure', value: 64.6, color: '#c83c48', info: 'High blood pressure strains the aortic wall over years and is one of the most common findings in people with Type B dissection.' },
                        { icon: 'hand_bones', label: 'Migrating pain', value: 16.8, color: '#c83c48', info: 'The pain seems to move as the tear extends along the aorta, for example from the chest toward the back or abdomen.' }
                    ]
                },
                {
                    type: 'text',
                    text: 'Not every dissection looks like this, though: the symptoms are often atypical. Some people mainly seem restless or agitated. Others show neurological signs such as confusion, fainting, weakness, or numbness, because the tear can reduce blood flow to the brain, the spinal cord, or a limb. Sometimes there is hardly any pain at all. Such presentations are easily mistaken for other illnesses, which is why a dissection can be missed at first.'
                },
                {
                    type: 'reference',
                    text: [
                        'Deutsche Gesellschaft für Gefäßchirurgie und Gefäßmedizin. S2k-Leitlinie Typ-B-Aortendissektion (section 5.1, table 4). AWMF-Register 004-034. 2022. https://register.awmf.org/assets/guidelines/004-034l_S2k_Typ_B_Aortendissektion_2022-05.pdf',
                        'Pape LA, et al. Presentation, Diagnosis, and Outcomes of Acute Aortic Dissection: 17-Year Trends From the International Registry of Acute Aortic Dissection. Journal of the American College of Cardiology. 2015;66(4):350–358. https://doi.org/10.1016/j.jacc.2015.05.029',
                        'Park SW, Hutchison S, Mehta RH, et al. Association of Painless Acute Aortic Dissection With Increased Mortality. Mayo Clinic Proceedings. 2004;79(10):1252–1257. https://doi.org/10.4065/79.10.1252'
                    ]
                }
            ]
        },
        {
            id: 's9',
            title: 'Diagnostic Procedures',
            scrollMode: 'sequence',
            timelineLabel: 'Acute',
            className: 'miriam-diagnosis-infographic-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'For Miriam, everything has to happen fast: a suspected dissection is an emergency. Before the scan, the team gathers quick clues at the bedside and from blood tests, including a test called D-dimer. These clues help judge how urgent the situation is and whether blood flow to the brain, kidneys, gut, or legs may be affected, but only imaging can confirm the diagnosis.',
                    infoPopup: {
                        title: 'D-dimer',
                        text: 'D-dimer is a protein fragment released when a blood clot breaks down. In people with a low likelihood of dissection, a negative result can help rule it out. But the test is non-specific: D-dimer is also raised by infection, cancer, sepsis, and many other conditions. A positive result therefore does not prove a tear, so the test is never used alone.'
                    }
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            icon: 'genetics_svg',
                            title: 'Marfan Risk',
                            info: 'Marfan syndrome or a known aortic disease makes clinicians think of a dissection earlier, because the condition weakens the aortic wall. The team therefore asks about it, and about when the pain began.'
                        },
                        {
                            icon: 'monitor_heart_svg',
                            title: 'Assessment',
                            info: 'Clinicians compare blood pressure and pulse strength between limbs and check for new weakness, confusion, fainting, or a painful or cool limb.'
                        },
                        {
                            icon: 'labs_svg',
                            title: 'Lab tests',
                            info: 'Tests of organ function show whether the kidneys, liver, or gut are getting enough blood.'
                        },
                        {
                            icon: 'radiology_aorta',
                            title: 'Aortic imaging',
                            info: 'Different imaging techniques can be used. The first choice is usually one that is fast and widely available; others are alternatives in some situations.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: [
                        'Isselbacher EM, et al. 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease. Circulation. 2022;146(24):e334–e482. https://doi.org/10.1161/CIR.0000000000001106',
                        'Deutsche Gesellschaft für Gefäßchirurgie und Gefäßmedizin. S2k-Leitlinie Typ-B-Aortendissektion (chapter 5). AWMF-Register 004-034. 2022. https://register.awmf.org/assets/guidelines/004-034l_S2k_Typ_B_Aortendissektion_2022-05.pdf'
                    ]
                }
            ]
        },
        {
            id: 's10',
            title: 'CTA Imaging',
            scrollMode: 'comparison',
            timelineLabel: 'Acute - CTA',
            className: 'evidence-section miriam-imaging-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'At this point, nobody knows yet which type of dissection Miriam has, and a Type A dissection is a race against time. The classic estimate is that without surgery, about 1 to 2 in every 100 people with Type A die per hour in the first two days. That is why the first scan is usually a CT: it takes only minutes, is available around the clock, and shows the whole aorta and its branches. An MRI shows the aorta just as well, but it takes much longer, is not always available at night, and makes it harder to watch over and treat an unstable patient during the scan. It can be used later, when time is no longer critical.'
                },
                {
                    type: 'text',
                    text: 'A CT angiogram (CTA) is a CT scan that shows the blood vessels. A contrast agent is injected into a vein in the arm while the scanner takes many thin X-ray images. The contrast makes blood inside the aorta visible. From these images, clinicians can follow the vessel through the chest and abdomen, identify the flap separating the two channels, measure the aorta, and check the branch vessels. The red marking was added during image editing to highlight Miriam\'s Type B dissection; it was not red in the original scan.'
                },
                {
                    type: 'image',
                    src: 'assets/story_images/miriam_cta.png',
                    alt: 'CTA image showing Miriam\'s Type B aortic dissection',
                    aspect: '3 / 4',
                    hotspots: [
                        {
                            x: '53%',
                            y: '15%',
                            title: 'Dissection flap',
                            text: 'The red line marks the flap in the aortic wall, where blood has entered the wall layers.'
                        },
                        {
                            x: '48%',
                            y: '42%',
                            title: 'End of dissection flap',
                            text: 'The highlighted widened region shows the altered aortic channel created by the dissection.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: [
                        'Harris KM, Nienaber CA, Peterson MD, et al. Early Mortality in Type A Acute Aortic Dissection: Insights From the International Registry of Acute Aortic Dissection. JAMA Cardiology. 2022;7(10):1009–1015. https://doi.org/10.1001/jamacardio.2022.2718',
                        'Isselbacher EM, et al. 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease. Circulation. 2022;146(24):e334–e482. https://doi.org/10.1161/CIR.0000000000001106'
                    ]
                }
            ]
        },
        {
            id: 's11',
            studyMetric: 'flow_prog',
            title: 'What the Flow Reveals',
            scrollMode: 'sticky',
            timelineLabel: 'Flow simulation',
            className: 'flow-research-section miriam-flow-section',
            flowViews: {
                illustration: { timelineLabel: 'Flow animation' }
            },
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Here, the simulated blood flow through both channels of Miriam\'s dissected aorta appears next to her aorta before the dissection, from earlier. Watch how the tear changes the route of the blood. The flow was not measured: it comes from a computer simulation (CFD) based on Miriam\'s CTA scan.',
                    // How the flow picture was made, per study version (js/modules/flowView.js).
                    infoPopup: {
                        title: 'simulated blood flow',
                        text: 'This flow comes from a CFD simulation (computational fluid dynamics): a computer calculates it from the shape of Miriam\'s aorta in the CTA scan. It is not measured flow, not blood recorded in Miriam\'s body, and not a prediction of her individual outcome. Every simulation rests on assumptions; the vessel wall, for example, is usually treated as rigid.'
                    },
                    flowViews: {
                        particles: {
                            infoPopup: {
                                title: 'simulated blood flow',
                                text: 'This flow comes from a CFD simulation (computational fluid dynamics): a computer calculates it from the shape of Miriam\'s aorta in the CTA scan. It is not measured flow, not blood recorded in Miriam\'s body, and not a prediction of her individual outcome. Every simulation rests on assumptions; the vessel wall, for example, is usually treated as rigid.'
                            }
                        },
                        illustration: {
                            text: 'Here, the animated drawing of the blood flow through both channels of Miriam\'s dissected aorta appears next to the drawing of her aorta before the dissection, from earlier. Watch how the tear changes the route of the blood.',
                            infoPopup: {
                                title: 'animated drawing',
                                text: 'This flow is drawn, not calculated or measured. It is not the result of a computer simulation, not blood recorded in Miriam\'s body and not a prediction of her individual outcome.'
                            }
                        }
                    }
                },
                {
                    type: 'modelPlaceholder',
                    id: 'flow-vis-subacute',
                    src: `${flowModelBase}dissection_lines_anim.glb`,
                    flowIllustration: {
                        // The arrows grow over the still drawing (js/modules/ui/flowArrows.js).
                        // Arrow 0 runs from the heart down the true channel; the branch
                        // arrows 1–3 and the two false-channel arrows 4–5 start when its
                        // head passes their start. The false-channel arrows move 25 %
                        // slower (speed 0.75 in flowArrows.js, the arrows named "langsam"
                        // in Figma) and lie above the see-through false channel.
                        src: 'assets/story_images/miriam_dissection_illustration.png',
                        arrows: {
                            ...miriamFlowArrows,
                            loopSeconds: FLOW_LOOP_SECONDS,
                            overlay: { src: 'assets/story_images/miriam_false_lumen_overlay.png', rect: [311, 187.65, 231, 529.7], opacity: 0.6 },
                            // Matches the line width of the healthy drawing, which is shown shrunk.
                            size: 1.4,
                            timing: [
                                {},
                                { after: 0, at: 'pass' },
                                { after: 0, at: 'pass' },
                                { after: 0, at: 'pass' },
                                { after: 0, at: 'pass' },
                                { after: 0, at: 'pass' }
                            ]
                        },
                        healthySrc: healthyIllustrationSrc,
                        healthyArrows: healthyIllustrationArrows,
                        // Position on screen, as fractions of the drawing's size (x right, y down).
                        shiftX: 0,
                        shiftY: -0.1,
                        healthyShiftX: 0,
                        healthyShiftY: 0,
                        // Miriam's aorta fills less of its drawing; the healthy one is
                        // shrunk so both appear at a similar size side by side.
                        healthyScale: 0.87,
                        healthyAlt: 'Illustration of blood flowing through Miriam\'s aorta before the dissection.',
                        alt: 'Illustration of an aortic dissection showing blood flow through the true and false channels.',
                        labels: miriamFlowIllustrationLabels,
                        healthyLabels: healthyIllustrationLabels
                    },
                    flowVariants: [
                        // Pathlines (compact grow/shrink export, js/modules/ui/flowLineReveal.js) and
                        // particles share framing, shift and speed, so switching keeps the aorta in place.
                        { view: 'lines', label: 'Pathlines', src: 'assets/models/flow/TBAD_pathlines_2cycles.glb', comparisonSrc: 'assets/models/flow/Healthy_pathlines_2cycles.glb', framingScale: 0.85, comparisonFramingScale: 0.8, rotationY: -1.5708, comparisonRotationY: -1.5708, shiftX: 0, shiftY: 0.1, comparisonShiftX: 0, comparisonShiftY: 0, animationFps: 20, animationSpeed: FLOW_SPEED, loopSeconds: LOOP_SECONDS },
                        { view: 'particles', label: 'Particle flow', src: 'assets/models/flow/TBAD_pulsed_particles_2cycles.glb', comparisonSrc: 'assets/models/flow/Healthy_pulsed_particles_2cycles.glb', framingScale: 0.85, comparisonFramingScale: 0.8, rotationY: -1.5708, comparisonRotationY: -1.5708, shiftX: 0, shiftY: 0.1, comparisonShiftX: 0, comparisonShiftY: 0, animationFps: 20, animationSpeed: FLOW_SPEED, loopSeconds: LOOP_SECONDS }
                    ],
                    modelMode: 'flow',
                    // All flow in the accent red (default flowColors); the "True lumen" and
                    // "False lumen" labels name the two channels.
                    labels: miriamFlowModelLabels,
                    healthyLabels: healthyModelLabels,
                    preload: true,
                    framingScale: 0.5,
                    animationFps: 20,
                    offsetX: 0,
                    offsetY: 0,
                    rotationHint: true,
                    alt: 'Animated particle paths representing flow through the aortic model',
                    eyebrow: '+1.5 months',
                    title: 'Flow-Vis - Subacute Phase'
                },
                {
                    type: 'text',
                    text: 'In Miriam\'s aorta, flow speed and direction vary across the vessel, and swirling areas may change the forces on her weakened wall, unlike the orderly laminar flow of her aorta before the dissection, beside it. This difference helps explain why blood movement matters for the treatment decisions that follow.'
                },
                // How the flow picture of each study version was made (js/modules/flowView.js).
                {
                    type: 'heading',
                    text: 'How this view was made'
                },
                {
                    type: 'text',
                    text: 'It starts with a CTA scan of Miriam\'s aorta: a follow-up scan, taken about six weeks after the dissection. From its slices, a 3D model of the inside of her aorta, with both channels, was built. For the CFD simulation (computational fluid dynamics), this space is divided into millions of tiny cells, the amount of blood that flows in and out is set, and a computer solves the equations of fluid motion in every cell over several heartbeats. The result is the speed and direction of the blood at every point and moment. Starting points are spread across the entrance of the aorta, and from each one this movement is followed step by step. The trail that a starting point leaves is a pathline: the route a tiny portion of blood would take.',
                    flowViews: {
                        particles: { text: 'It starts with a CTA scan of Miriam\'s aorta: a follow-up scan, taken about six weeks after the dissection. From its slices, a 3D model of the inside of her aorta, with both channels, was built. For the CFD simulation (computational fluid dynamics), this space is divided into millions of tiny cells, the amount of blood that flows in and out is set, and a computer solves the equations of fluid motion in every cell over several heartbeats. The result is the speed and direction of the blood at every point and moment. From these results, a flow-visualization program releases virtual particles at the entrance of the aorta and carries them along with this movement, frame by frame.' },
                        illustration: { text: 'It starts with a CTA scan of Miriam\'s aorta. From its slices, a 3D model of her aorta was built, and the outline, with the flap that divides it into two channels, was traced by hand from this model and then simplified: the shape and the two channels are kept, fine details of the vessel wall are left out. Her aorta before the dissection was drawn in the same way from its 3D model.' }
                    }
                },
                {
                    type: 'text',
                    text: 'In the animation, the lines grow as the heartbeat goes on. All lines are red, in Miriam\'s aorta and in her aorta before the dissection; the labels show where the true and the false lumen lie, so you can follow how the blood splits at the tear. You can turn both models. What you see stays a calculated picture, with the assumptions explained in the note on the simulated blood flow above.',
                    flowViews: {
                        particles: { text: 'Each dot is a marker, not a blood cell: where the dots crowd together, speed up or circle, the calculated flow does the same. All dots are red, in Miriam\'s aorta and in her aorta before the dissection; the labels show where the true and the false lumen lie, so you can follow how the blood splits at the tear. You can turn both models. What you see stays a calculated picture, with the assumptions explained in the note on the simulated blood flow above.' },
                        illustration: { text: 'The arrows were drawn by hand on top of the drawings to show the main direction of the blood: up from the heart, into the branches, around the arch and down through the body. In Miriam\'s aorta, one arrow follows the true channel. Two slower arrows swirl below the tear and follow the false channel until both channels meet again further down. On the page, the arrows grow from the heart downwards and then start again. Where they are placed, how long they are and how fast they move are design choices, not measurements.' }
                    }
                }
            ]
        },
        {
            id: 's13',
            title: 'Current-risk decision spectrum',
            scrollMode: 'sequence',
            timelineLabel: 'Acute',
            className: 'miriam-treatment-infographic-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Miriam\'s treatment hinges on one question: is the dissection causing complications? If not, she is treated in hospital with medicine and watched closely. If complications appear, the team may recommend repairing the aorta, for example with TEVAR, a stent graft placed from inside the aorta to cover the main tear.',
                    infoPopup: {
                        title: 'TEVAR',
                        text: 'TEVAR means thoracic endovascular aortic repair. Through an artery, usually in the groin, doctors guide a catheter carrying a fabric-covered metal stent graft to the chest aorta. Once opened, it lines the inside of the vessel and helps blood flow through the intended channel. Suitability depends on the tear\'s position, the branch vessels, and the strength of the aortic wall, so it is not suitable for every anatomy or every person.'
                    }
                },
                {
                    type: 'treatmentDecision',
                    variant: 'decisionMap',
                    axisStart: 'Lower urgency',
                    axisEnd: 'Higher urgency',
                    items: [
                        {
                            icon: 'prescriptions',
                            label: 'Uncomplicated Type B',
                            treatment: 'Medical therapy',
                            info: 'Medicines lower heart rate and blood pressure to reduce the force on the damaged wall. Pain relief and close checks of pulses, organ function, and repeat images complete the hospital care.'
                        },
                        {
                            icon: 'medical_services',
                            label: 'Complicated Type B',
                            treatment: 'Aortic treatment',
                            info: 'A dissection counts as complicated if blood flow to an organ is reduced, the aorta is enlarging or leaking, pain persists, or blood pressure cannot be controlled. Because of Miriam\'s Marfan syndrome, the team weighs TEVAR against open surgery with particular care.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: [
                        'Deutsche Gesellschaft für Gefäßchirurgie und Gefäßmedizin. S2k-Leitlinie Typ-B-Aortendissektion (treatment chapters). AWMF-Register 004-034. 2022. https://register.awmf.org/assets/guidelines/004-034l_S2k_Typ_B_Aortendissektion_2022-05.pdf',
                        'Isselbacher EM, et al. 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease. Circulation. 2022;146(24):e334–e482. https://doi.org/10.1161/CIR.0000000000001106'
                    ]
                }
            ]
        },
        {
            id: 's17',
            title: 'Prevention',
            scrollMode: 'sequence',
            timelineLabel: 'Long term',
            className: 'miriam-prevention-infographic-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'After the emergency, Miriam\'s care changes pace: from getting her through the acute phase to protecting her aorta for the long term, lowering the chance of further problems and finding changes early. Because she has Marfan syndrome, this follow-up lasts a lifetime, and because the condition is inherited, her family becomes part of the story too.'
                },
                {
                    type: 'preventionTimeline',
                    items: [
                        {
                            eyebrow: 'Every day',
                            title: 'Blood‑pressure control',
                            info: 'The most important part of aftercare: Miriam takes medicine every day to keep her blood pressure and heart rate low, and has them checked regularly. This reduces the force of each heartbeat on her weakened aorta.'
                        },
                        {
                            eyebrow: 'After the acute phase',
                            title: 'Rehabilitation',
                            info: 'Once the acute phase is over, a supervised program can help rebuild stamina and confidence step by step.'
                        },
                        {
                            eyebrow: 'In everyday life',
                            title: 'Movement',
                            icon: 'directions_walk',
                            info: 'Walking is encouraged: regular, relaxed walks keep Miriam fit without straining her aorta. What she avoids is heavy lifting, pressing, and sudden all-out effort, because they make blood pressure rise sharply.'
                        },
                        {
                            eyebrow: 'Long term',
                            title: 'Regular CT follow‑up',
                            info: 'Follow-up CT scans check whether the aorta is widening or the false lumen is changing. After a dissection treated with medicine alone, they are commonly done at about 1, 6, and 12 months, then yearly if stable. The schedule can change with findings.'
                        },
                        {
                            eyebrow: 'In the family',
                            title: 'Genetic risk',
                            info: 'Marfan syndrome is inherited, so relatives may share the risk even if they feel well. Genetic counseling can explain testing, and close relatives may be offered heart imaging to look for aortic enlargement.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: [
                        'Deutsche Gesellschaft für Gefäßchirurgie und Gefäßmedizin. S2k-Leitlinie Typ-B-Aortendissektion (follow-up and rehabilitation). AWMF-Register 004-034. 2022. https://register.awmf.org/assets/guidelines/004-034l_S2k_Typ_B_Aortendissektion_2022-05.pdf',
                        'Isselbacher EM, et al. 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease. Circulation. 2022;146(24):e334–e482. https://doi.org/10.1161/CIR.0000000000001106'
                    ]
                }
            ]
        }
    ]
};
