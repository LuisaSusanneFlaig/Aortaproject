import { healthyIllustrationLabels, healthyModelLabels } from '../healthyReferenceLabels.js';

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
// the healthy aorta beside it names the regions.
const miriamFlowFindings = ['Entry tear (flap begins)', 'True lumen', 'False lumen', 'End of the flap'];
const miriamFlowModelLabels = miriamModelLabels.filter((label) => miriamFlowFindings.includes(label.text));
const miriamFlowIllustrationLabels = miriamIllustrationLabels.filter((label) => miriamFlowFindings.includes(label.text));

export const dissectionStory = {

    title: 'Aortic Dissection',
    nav: [
        { href: '#definition-statistics', label: 'Definition' },
        { href: '#s2', label: 'Anatomy' },
        { href: '#s8', label: 'Symptoms' },
        { href: '#s9', label: 'Diagnosis' },
        { href: '#miriam-simulation-method', label: 'Prognosis' },
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
                    text: 'Aortic dissection is rare, but rarity does not make it insignificant: a small number of cases can have extremely serious consequences. The circle chart on the left shows what rare means. The circle stands for 100,000 people worldwide; the five dots are diagnosed cases, and the seven squares are cases that may go undetected. What happens next depends strongly on where the dissection begins, as the pie chart below it shows. Type A, about 60–65% of cases, involves the first part of the aorta as it leaves the heart and usually requires immediate treatment. Type B, about 35–40% of cases, begins farther down, beyond the arteries leading to the head, and may follow a different treatment path. This makes aortic dissection an important example of how a single anatomical difference can fundamentally change a medical situation. Miriam\'s dissection is Type B, the red slice of the pie chart.'
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
                    text: 'Context sources: Gouveia e Melo et al.; Kurz et al.; Wundram et al.; Obel et al.; Smedberg et al.; clinical guideline summaries.'
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
                    text: 'Anatomy and case source: VMR dataset 0246_H_AO_AOD, pre-dissection aortic geometry and follow-up case material; patient course described in Baeumler et al., IEEE TBME 2025, DOI 10.1109/TBME.2024.3480362.'
                }
            ]
        },
        {
            id: 'how-to-read-blood-flow',
            title: 'How to Read Blood Flow',
            scrollMode: 'sticky',
            timelineLabel: 'Dissected aorta',
            className: 'model-section miriam-flow-reading-section',
            inlineIllustration: {
                src: 'assets/story_images/healthy_flow_illustration.gif',
                alt: 'Animated illustration of blood flowing smoothly through a healthy aorta, from the heart through the arch and down the descending aorta.',
                labels: healthyIllustrationLabels
            },
            inlineModel: {
                url: `${flowModelBase}healthy_lines_anim.glb`,
                label: 'Simulated blood flow through a healthy reference aorta, shown as colored lines',
                mode: 'flow',
                legend: false,
                rotationX: 0,
                rotationY: -1.5708,
                rotationZ: 0,
                framingScale: 0.4,
                animationFps: 20,
                animationSpeed: 1,
                rotationHint: true,
                labels: healthyModelLabels
            },
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Before we look at the blood flow in Miriam\'s aorta, it helps to see how blood moves through a healthy one. This aorta comes from a separate reference case, not from Miriam. It shows where the blood travels on its way from the heart through the arch and down into the body.'
                },
                {
                    type: 'text',
                    text: 'In a healthy aorta, blood moves as one orderly stream. This is called laminar flow. It is the baseline for the rest of Miriam\'s story: later, the same view shows what her divided aorta does to this order.',
                    infoPopup: {
                        title: 'laminar flow',
                        text: 'In laminar flow, blood moves in layers that slide past each other, usually fastest in the middle of the vessel and slower near the wall, with hardly any swirling. Where a vessel suddenly widens, narrows, or splits, this order can break up into swirls.'
                    }
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
                    text: 'Unlike an aneurysm, a dissection like Miriam\'s usually announces itself with strong warning signs. The chart shows how often each warning sign was reported by 1,891 people with acute Type B dissection, the type Miriam has, in an international registry (IRAD). Still, no single sign proves a dissection, and a fainting episode, a normal heart tracing, or a normal chest X-ray cannot safely rule it in or out. Symptoms are only the first clue.'
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
                    type: 'reference',
                    text: 'Source: S2k guideline on Type B aortic dissection (2022), section 5.1 and table 4; IRAD data.'
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
                        text: 'D-dimer is a protein fragment released when a blood clot breaks down. In people with a low likelihood of dissection, a negative result can help rule it out. A positive result has many other causes and does not prove a tear, so the test is never used alone.'
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
                            info: 'CT angiography is usually the first choice because it is fast and widely available. Ultrasound through the esophagus or MRI are alternatives in some situations.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Sources: [2022 ACC/AHA Aortic Disease Guideline](https://doi.org/10.1161/CIR.0000000000001106), acute aortic syndrome diagnosis and imaging; [2022 German S2k Guideline on Type B Aortic Dissection](https://register.awmf.org/assets/guidelines/004-034l_S2k_Typ_B_Aortendissektion_2022-05.pdf), chapter 5.'
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
                }
            ]
        },
        {
            id: 'miriam-scan-to-model',
            title: 'From Scan to 3D Model',
            scrollMode: 'sequence',
            timelineLabel: 'Acute - CTA',
            className: 'scan-to-model-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Miriam\'s scan does more than confirm the diagnosis. It is also the raw material for a 3D model of her divided aorta, including the flap between the two channels: the model you explored earlier, and the starting point for the flow simulation later in the story.'
                },
                {
                    type: 'processSteps',
                    label: 'From CTA slices to a 3D model of Miriam\'s aorta',
                    steps: [
                        {
                            title: 'CT scanner',
                            text: 'The patient lies on a table that moves through the ring of the scanner. The contrast agent is timed so that it reaches the aorta while the images are taken.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/ct_scanner.png', alt: 'A CT scanner with its ring and patient table' }
                        },
                        {
                            title: 'CTA slices',
                            text: 'A CTA is not one picture but a stack of hundreds of thin images through the chest, called slices, often less than a millimeter apart.',
                            visual: { kind: 'slices', src: 'assets/story_images/miriam_cta.png', aspect: '955 / 1280', alt: 'Miriam\'s CTA image with the dissected aorta highlighted in red, shown as the front image of a stack of slices' }
                        },
                        {
                            title: 'Software',
                            text: 'Software marks the aorta in every slice, a step called segmentation, and joins the outlines into a surface. In a dissection, the thin flap between the channels has to be traced as well. A person checks and corrects the result.',
                            visual: { kind: 'placeholder' }
                        },
                        {
                            title: '3D model',
                            text: 'The surface is smoothed and its branches are cut to open ends, so the model can be turned on screen and used for a flow simulation.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/miriam_model.png', alt: '3D model of Miriam\'s aorta built from the CTA slices' }
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'CT scanner 3D model: “CT Scanner” by Ng Jun Wei, https://skfb.ly/ornOu, licensed under Creative Commons Attribution 4.0, http://creativecommons.org/licenses/by/4.0/. CTA image and aortic model: VMR dataset 0246_H_AO_AOD.'
                }
            ]
        },
        {
            id: 'miriam-simulation-method',
            title: 'How the Flow Is Simulated',
            scrollMode: 'sequence',
            timelineLabel: 'Flow simulation',
            className: 'simulation-method-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'The 3D model shows the shape of Miriam\'s divided aorta, but not how blood moves through its two channels. For that, the team runs a computer simulation of the blood flow through her model. The result is simulated data, not blood recorded in Miriam\'s body and not a prediction of her individual outcome.'
                },
                {
                    type: 'text',
                    text: 'Every simulation rests on assumptions. The vessel wall is usually treated as rigid, although real vessels stretch with every heartbeat. Inflow and outflow are based on measurements, population averages or estimates, and small differences in how the aorta is traced in the scan can change the result. Above all, the flow is calculated, not measured: 4D-flow MRI can measure blood flow in the body, but with less detail.'
                },
                {
                    type: 'processSteps',
                    label: 'How a flow simulation is built from Miriam\'s 3D model',
                    steps: [
                        {
                            title: 'Mesh',
                            text: 'The inside of the model, both channels included, is divided into a computational mesh of often millions of tiny cells. A finer mesh captures more detail but takes longer to calculate.',
                            visual: { kind: 'image', src: 'assets/story_images/alex_mesh_closeup.png', alt: 'Close-up of the wall of an aortic model, divided into a mesh of small triangles' }
                        },
                        {
                            title: 'In- and outflow',
                            text: 'At the inlet, the team sets how much blood the heart pumps during a heartbeat; at each outlet, how blood leaves the model. The red planes mark these openings.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/miriam_planes.png', alt: 'Miriam\'s aortic model with red planes at the inflow in the ascending aorta and at the outflows of the other open ends' }
                        },
                        {
                            title: 'Calculation',
                            text: 'A computer solves the equations of fluid motion in every cell, in many small time steps over several heartbeats, until the result repeats from beat to beat.',
                            visual: { kind: 'placeholder' }
                        },
                        {
                            title: 'Visualization',
                            text: 'The result is a speed and direction for every cell at every moment. To make it readable, it is turned into views that show where the blood goes and how fast it moves.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/miriam_pathlines.png', alt: 'Pathlines of the simulated blood flow in Miriam\'s aorta' }
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Simulation steps and assumptions: Kamada H, Nakamura M, Ota H, Higuchi S, Takase K. Blood flow analysis with computational fluid dynamics and 4D-flow MRI for vascular diseases. J Cardiol. 2022;80:386–396. DOI 10.1016/j.jjcc.2022.05.007. Methods reference: Wilson NM, Ortiz AK, Johnson AB. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. J Med Devices. 2013;7(4):040923. DOI: 10.1115/1.4025983. Simulation source: Zimmermann et al. (2023), DOI 10.1038/s41598-023-49942-0.'
                }
            ]
        },
        {
            id: 's11',
            title: 'What the Flow Reveals',
            scrollMode: 'sticky',
            timelineLabel: 'Flow simulation',
            className: 'flow-research-section miriam-flow-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Here, the simulated blood flow through both channels of Miriam\'s dissected aorta appears next to the healthy reference aorta from earlier. Watch how the tear changes the route of the blood. The simulation is based on a follow-up CTA taken about six weeks after the dissection.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'flow-vis-subacute',
                    src: `${flowModelBase}dissection_lines_anim.glb`,
                    flowIllustration: {
                        type: 'video',
                        src: 'assets/story_images/dissection_flow_illustration.gif',
                        healthySrc: 'assets/story_images/healthy_flow_illustration.gif',
                        healthyAlt: 'Illustration of blood flowing through a healthy aorta.',
                        alt: 'Illustration of an aortic dissection showing blood flow through the true and false channels.',
                        labels: miriamFlowIllustrationLabels,
                        healthyLabels: healthyIllustrationLabels
                    },
                    flowVariants: [
                        { label: 'Pathlines', src: `${flowModelBase}dissection_lines_anim.glb`, comparisonSrc: `${flowModelBase}healthy_lines_anim.glb`, framingScale: 0.75, comparisonFramingScale: 0.29, rotationY: -1.5708, comparisonRotationY: -1.5708, animationFps: 20, animationSpeed: 1 },
                        { label: 'Particle flow', src: `${flowModelBase}dissection_particles_anim.glb`, comparisonSrc: `${flowModelBase}healthy_particle_anim.glb`, framingScale: 0.35, comparisonFramingScale: 0.35, rotationY: -1.5708, comparisonRotationY: -1.5708, animationFps: 20, animationSpeed: 0.5 }
                    ],
                    modelMode: 'flow',
                    // The dissection exports mark the false lumen red and the true lumen white;
                    // the "True lumen" and "False lumen" labels name them.
                    flowColors: 'lumen',
                    labels: miriamFlowModelLabels,
                    healthyLabels: healthyModelLabels,
                    preload: true,
                    framingScale: 0.75,
                    animationFps: 20,
                    offsetX: 0,
                    offsetY: 0,
                    rotationHint: true,
                    alt: 'Animated particle paths representing flow through the aortic model',
                    eyebrow: '+1.5 months',
                    title: 'Flow-Vis - Subacute Phase',
                    infoPopup: {
                        title: 'Animation speed'
                    }
                },
                {
                    type: 'text',
                    text: 'In Miriam\'s aorta, flow speed and direction vary across the vessel, and swirling areas may change the forces on her weakened wall, unlike the orderly laminar flow of the healthy aorta beside it. This difference helps explain why blood movement matters for the treatment decisions that follow.'
                },
                {
                    type: 'reference',
                    text: 'Context: patient-specific simulation based on the subacute CTA anatomy. Source: Zimmermann et al. (2023), DOI 10.1038/s41598-023-49942-0. Methods reference: Wilson NM, Ortiz AK, Johnson AB. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. J Med Devices. 2013;7(4):040923. DOI: 10.1115/1.4025983.'
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
                    text: 'Sources: [2022 German S2k Guideline on Type B Aortic Dissection](https://register.awmf.org/assets/guidelines/004-034l_S2k_Typ_B_Aortendissektion_2022-05.pdf), treatment chapters; [2022 ACC/AHA Aortic Disease Guideline](https://doi.org/10.1161/CIR.0000000000001106), acute aortic syndrome management. Miriam case: VMR dataset 0246_H_AO_AOD.'
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
                            eyebrow: 'Today',
                            title: 'Blood pressure',
                            info: 'Medicine keeps blood pressure and heart rate low every day, reducing the force of each heartbeat on the aorta.'
                        },
                        {
                            eyebrow: 'After the acute phase',
                            title: 'Rehabilitation',
                            info: 'Once the acute phase is over, a supervised program can help rebuild stamina and confidence step by step.'
                        },
                        {
                            eyebrow: 'In everyday life',
                            title: 'Dosed activity',
                            info: 'Gentle, regular activity may be encouraged, while sudden maximal effort and heavy straining can cause sharp blood-pressure rises.'
                        },
                        {
                            eyebrow: 'Long term',
                            title: 'Regular imaging',
                            info: 'After a dissection treated with medicine alone, guideline follow-up commonly includes imaging at about 1, 6, and 12 months, then yearly if stable. The schedule can change with findings.'
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
                    text: 'Sources: [2022 German S2k Guideline on Type B Aortic Dissection](https://register.awmf.org/assets/guidelines/004-034l_S2k_Typ_B_Aortendissektion_2022-05.pdf), follow-up and rehabilitation; [2022 ACC/AHA Aortic Disease Guideline](https://doi.org/10.1161/CIR.0000000000001106), imaging after dissection, Marfan syndrome, and family assessment.'
                }
            ]
        }
    ]
};
