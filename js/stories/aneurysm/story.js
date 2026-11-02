import { healthyIllustrationArrows, healthyIllustrationLabels, healthyIllustrationSrc, healthyModelLabels } from '../healthyReferenceLabels.js';
import { alexFlowArrows } from './flowArrows.js';

const flowModelBase = 'assets/models/flow/optimized/';

// 3D anchors: [x, y, z] fractions of the vessel wall box, shared by the anatomy,
// pathline and particle exports of this aorta. Pick new ones with ?pickLabels.
const alexModelLabels = [
    { text: 'Aortic root', anchor: [0.198, 0.53, 0.47], side: 'left' },
    { text: 'Aortic arch', anchor: [0.599, 0.734, 0.76], side: 'left' },
    { text: 'Widened section (aneurysm)', anchor: [0.87, 0.657, 0.766], side: 'right' }
];

// Image anchors: [x, y] fractions of the anatomy illustration; the flow
// animation is the same drawing at a smaller size.
const alexIllustrationLabels = [
    { text: 'Aortic root', anchor: [0.375, 0.51], side: 'left' },
    { text: 'Aortic arch', anchor: [0.5, 0.327], side: 'left' },
    { text: 'Widened section (aneurysm)', anchor: [0.66, 0.41], side: 'right' }
];

// In the flow comparison the affected aorta labels only what the aneurysm changes;
// the healthy aorta beside it names the regions.
const alexFlowFindings = ['Widened section (aneurysm)'];
const alexFlowModelLabels = alexModelLabels.filter((label) => alexFlowFindings.includes(label.text));
const alexFlowIllustrationLabels = alexIllustrationLabels.filter((label) => alexFlowFindings.includes(label.text));

export const aneurysmStory = {

    title: 'Aortic Aneurysm',
    nav: [
        { href: '#definition-statistics', label: 'Definition' },
        { href: '#anatomie', label: 'Anatomy' },
        { href: '#symptome', label: 'Symptoms' },
        { href: '#diagnose-procedure', label: 'Diagnosis' },
        { href: '#alex-flow-overview', label: 'Prognosis' },
        { href: '#behandlung', label: 'Treatment' },
        { href: '#praevention', label: 'Prevention' }
    ],
    sections: [
        {
            id: 'definition-statistics',
            title: 'Aortic Aneurysm in Numbers',
            className: 'aneurysm-burden-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'Before Alex\'s scan becomes personal, the two charts set the wider scene. The left chart, “Deaths”, shows that more people worldwide are dying with aortic aneurysm than in earlier decades: its line rises by 74%, from 88,353 in 1990 to 153,927 in 2021. This is partly because populations are growing and aging. The right chart shows the opposite trend: measured as a standardized death rate, the risk of dying fell by 27%, from 2.54 to 1.86 per 100,000 people. This suggests that diagnostics and treatment methods are improving. In both charts, the dotted line to 2030 is a projection, not a measurement.',
                    infoPopup: {
                        title: 'standardized death rate',
                        text: 'A standardized death rate adjusts death figures to a common population structure, often by age, so populations or years can be compared more fairly. It estimates the death rate that would be seen if the population had the same age distribution as the reference population.'
                    }
                },
                {
                    type: 'aneurysmBurden',
                },
                {
                    type: 'reference',
                    text: 'Context source: Zhuo et al. Global burden of aortic aneurysm and its attributable risk factors from 1990 to 2021, with projections to 2030. Internal and Emergency Medicine, 2025.'
                }
            ]
        },
        {
            id: 'anatomie',
            title: 'Alex\'s Aorta',
            className: 'model-section alex-aorta-model-section',
            scrollMode: 'sticky',
            inlineIllustration: {
                src: 'assets/story_images/alex_aneurysm_illustration.png',
                alt: 'Illustration of Alex’s aortic arch and descending aorta, with widening in the arch.',
                labels: alexIllustrationLabels
            },
            inlineModel: {
                url: `${flowModelBase}aneurysm_anatomy.glb`,
                label: 'Patient-specific aortic geometry of Alex',
                mode: 'flow',
                rotationY: 1.5708,
                framingScale: 0.72,
                legend: false,
                rotationHint: true,
                labels: alexModelLabels
            },
            elements: [
                {
                    type: 'text',
                    text: 'Alex has Marfan syndrome, an inherited weakness of the connective tissue that can also affect the wall of the aorta. His aorta is shown here. It has widened in the thoracic part. That\'s why it is called a thoracic aortic aneurysm.'
                },
                {
                    type: 'text',
                    text: 'Every heartbeat sends blood through the aortic valve into the aortic root, the first, slightly wider part of the aorta. From there it rises, curves through the aortic arch, and flows down into the body. In Alex\'s aorta, the widened section, the aneurysm, sits where the arch turns downward.'
                },
                {
                    type: 'reference',
                    text: '3D geometry and case data: Vascular Model Repository 0021_H_AO_MFS, case 0129_0000. Clinical data file documents male sex, age 18, weight 59 kg, height 185.42 cm, heart rate 51 beats/min, and cuff pressures 110/67.'
                }
            ]
        },
        {
            id: 'alex-how-to-read-blood-flow',
            title: 'How to Read Blood Flow',
            scrollMode: 'sticky',
            className: 'model-section alex-flow-reading-section',
            inlineIllustration: {
                src: healthyIllustrationSrc,
                arrows: healthyIllustrationArrows,
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
                labels: healthyModelLabels,
                flowViews: {
                    particles: {
                        url: `${flowModelBase}healthy_particle_anim.glb`,
                        label: 'Simulated blood flow through a healthy reference aorta, shown as moving particles',
                        framingScale: 0.35,
                        animationSpeed: 0.5
                    }
                }
            },
            elements: [
                {
                    type: 'text',
                    text: 'Before we look at the blood flow in Alex\'s aorta, it helps to see how blood moves through a healthy one. This aorta comes from a separate reference case, not from Alex. It shows where the blood travels on its way from the heart through the arch and down into the body.'
                },
                {
                    type: 'text',
                    text: 'In a healthy aorta, blood moves as one orderly stream. This is called laminar flow. It is the baseline for the rest of Alex\'s story: later, the same view shows what his widened aorta does to this order.',
                    infoPopup: {
                        title: 'laminar flow',
                        text: 'In laminar flow, blood moves in layers that slide past each other, usually fastest in the middle of the vessel and slower near the wall, with hardly any swirling. Where a vessel suddenly widens, narrows, or splits, this order can break up into swirls.'
                    }
                }
            ]
        },
        {
            id: 'symptome',
            title: 'Long Without Warning Signs',
            className: 'alex-symptoms-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'Alex feels well, and that is exactly what makes a thoracic aortic aneurysm difficult: it can stay quiet for a long time. Clinical sources describe most people as having no symptoms before a sudden serious event; one review gives roughly 95% without warning signs and about 5% with symptoms beforehand. For Alex, waiting for symptoms is therefore not an option.'
                },
                {
                    type: 'symptomBars',
                    subtitle: 'Thoracic aortic aneurysm',
                    items: [
                        {
                            icon: 'block',
                            label: 'No symptoms',
                            value: 95,
                            info: 'Without symptoms, an aneurysm is often found by chance, on a scan done for another reason, or through planned checks like Alex\'s.'
                        },
                        {
                            icon: 'sick',
                            label: 'Symptoms before acute event',
                            value: 5,
                            info: 'If the widened vessel presses on nearby parts of the body, it may cause chest or back pain, a change in the voice, trouble swallowing, or shortness of breath. Sudden severe pain, fainting, breathlessness, or neurological symptoms can signal a tear in the wall of the aorta or a burst blood vessel and need emergency care.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Sources for symptom percentages: Faiza Z, Sharman T. Thoracic Aorta Aneurysm. StatPearls, NCBI Bookshelf, last update May 1, 2023, https://www.ncbi.nlm.nih.gov/books/NBK554567/; Cikach F, Desai MY, Roselli EE, Kalahasti V. Thoracic aortic aneurysm: How to counsel, when to refer. Cleveland Clinic Journal of Medicine. 2018;85(6):481-492. DOI: 10.3949/ccjm.85a.17039. Alex case source: VMR dataset 0021_H_AO_MFS, case 0129_0000.'
                }
            ]
        },
        {
            id: 'diagnose-procedure',
            title: 'Surveillance Diagnosis',
            className: 'alex-diagnosis-infographic-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'Because Alex has Marfan syndrome, doctors check his aorta regularly, even when he feels well. At each visit they measure the aortic root and ascending aorta and look at the aortic valve. Every result adds to Alex\'s history, and the change over time matters as much as any single measurement.',
                    infoPopup: {
                        title: 'aortic valve',
                        text: 'Heart valves act like one-way doors that keep blood moving through the heart in the right direction. The aortic valve sits between the heart’s main pumping chamber and the aorta, and scans can show whether it is opening and closing normally.'
                    }
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            icon: 'genetics_svg',
                            title: 'Marfan risk',
                            info: 'Marfan syndrome affects fibrillin-1, a protein that gives connective tissue its strength. In the aorta, this makes the wall more likely to stretch, especially at the aortic root.'
                        },
                        {
                            icon: 'event_available_svg',
                            title: 'Surveillance',
                            info: 'For Marfan syndrome, guidelines recommend imaging at diagnosis and again about six months later to see how fast the aorta is growing, then at regular intervals, more often if it enlarges.'
                        },
                        {
                            icon: 'radiology_aorta',
                            title: 'Imaging',
                            info: 'Ultrasound of the heart usually measures the aortic root and valve. CT or MRI show the whole aorta, including parts that ultrasound cannot reach.'
                        },
                        {
                            icon: 'compare_svg',
                            title: 'Aortic review',
                            info: 'Measurements are compared with earlier scans and with Alex\'s body size, because a taller person can have a larger normal aorta. Family history and growth rate also shape when the next scan or specialist review is due.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Sources: [2022 ACC/AHA Aortic Disease Guideline](https://doi.org/10.1161/CIR.0000000000001106), Marfan imaging recommendations; [RadiologyInfo: CT Angiography](https://www.radiologyinfo.org/en/info/angioct). Alex case: VMR dataset 0021_H_AO_MFS, case 0129_0000.'
                }
            ]
        },
        {
            id: 'diagnose-bildgebung',
            title: 'CTA Imaging',
            className: 'evidence-section alex-imaging-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'To see Alex\'s whole aorta, the team uses a CT angiogram (CTA), a CT scan that shows the blood vessels. A contrast agent is injected into a vein in the arm while the scanner takes a rapid series of X-ray images. The contrast makes the blood inside the vessels stand out, so the team can trace the aorta, see its branches, and measure its diameter. The aorta is colored red here during image editing; it was not red in the original scan.'
                },
                {
                    type: 'text',
                    text: 'The same scan is the raw material for a 3D model of Alex\'s aorta: the model you explored earlier, and the starting point for the flow simulation later in the story. Software marks the aorta in every slice, a step called segmentation, and joins the outlines into a surface. A person checks and corrects the result.',
                    flowViews: {
                        illustration: { text: 'The same scan is the raw material for the drawings in this story. The outline of Alex\'s aorta was traced by hand from the scan and from the 3D model built from it. The drawing keeps the shape of his aorta, including the widened section, but leaves out the fine detail of the vessel wall.' }
                    }
                },
                {
                    type: 'image',
                    src: 'assets/story_images/alex_cta_sagittal.png',
                    alt: 'Sagittal CTA image of Alex\'s chest with the thoracic aorta highlighted in red',
                    aspect: '1 / 1',
                    hotspot: {
                        x: '52%',
                        y: '30%',
                        title: 'Thoracic aortic aneurysm',
                        text: 'The diameter is measured at right angles to the course of the vessel, so that a curved section is not measured too wide.'
                    }
                },
                {
                    type: 'reference',
                    text: 'CTA image and aortic model: Vascular Model Repository 0021_H_AO_MFS, case 0129_0000.'
                }
            ]
        },
        {
            id: 'alex-flow-overview',
            title: 'Flow in Alex\'s Aorta',
            className: 'flow-research-section alex-flow-section',
            scrollMode: 'sticky',
            elements: [
                {
                    type: 'text',
                    text: 'In the aorta, shape and blood flow are tightly connected. Here, the simulated blood flow through Alex’s aorta appears next to the healthy reference aorta from earlier. Watch for changes in speed and direction, especially where Alex\'s aorta widens or curves.',
                    // How the flow picture was made, per study version (js/modules/flowView.js).
                    infoPopup: {
                        title: 'simulated blood flow',
                        text: 'This flow is calculated, not measured. For the simulation, the inside of the 3D model of Alex\'s aorta is divided into millions of tiny cells. The team sets how much blood the heart pumps in and how it leaves through each open end, and a computer solves the equations of fluid motion in every cell over several heartbeats. The result is shown as pathlines: lines that follow the paths the blood takes. Every simulation rests on assumptions; the vessel wall, for example, is usually treated as rigid. It is not blood recorded in Alex\'s body and not a prediction of his individual outcome.'
                    },
                    flowViews: {
                        particles: {
                            infoPopup: {
                                title: 'simulated blood flow',
                                text: 'This flow is calculated, not measured. For the simulation, the inside of the 3D model of Alex\'s aorta is divided into millions of tiny cells. The team sets how much blood the heart pumps in and how it leaves through each open end, and a computer solves the equations of fluid motion in every cell over several heartbeats. The result is shown as moving particles that are carried along with the blood. Every simulation rests on assumptions; the vessel wall, for example, is usually treated as rigid. It is not blood recorded in Alex\'s body and not a prediction of his individual outcome.'
                            }
                        },
                        illustration: {
                            text: 'In the aorta, shape and blood flow are tightly connected. Here, the animated drawing of the blood flow through Alex’s aorta appears next to the drawing of the healthy reference aorta from earlier. Watch for changes in direction, especially where Alex\'s aorta widens or curves.',
                            infoPopup: {
                                title: 'animated drawing',
                                text: 'The arrows were drawn by hand on top of the drawing of Alex\'s aorta. On this page, each arrow grows in, travels along its path and fades out at its end, and the arrows follow one another along the path of the blood, from the heart downwards. Then the sequence starts again. This flow is not the result of a computer simulation: it is not calculated, not measured, and not blood recorded in Alex\'s body. Like every illustration, it rests on choices about which paths to show and where to simplify.'
                            }
                        }
                    }
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-overview-model',
                    src: `${flowModelBase}aneurysm_lines_anim.glb`,
                    flowIllustration: {
                        // The arrows grow over the still drawing (js/modules/ui/flowArrows.js).
                        src: 'assets/story_images/alex_aneurysm_illustration.png',
                        // Order as in Figma: 1 ascending aorta, 2a–2c branches, 3 swirl
                        // in the widened section, 4–6 descending aorta. The branches and
                        // the swirl start when arrow 1 arrives, 4 once the swirl is done.
                        arrows: {
                            ...alexFlowArrows,
                            // The drawing is shown smaller than the healthy one, so its arrows are thickened.
                            size: 1.3,
                            timing: [
                                {},
                                { after: 0 },
                                { after: 0, delay: 75 },
                                { after: 0, delay: 150 },
                                { after: 0 },
                                { after: 4, at: 'done' },
                                { after: 5 },
                                { after: 6 }
                            ]
                        },
                        healthySrc: healthyIllustrationSrc,
                        healthyArrows: healthyIllustrationArrows,
                        // Position on screen, as fractions of the drawing's size (x right, y down).
                        shiftX: 0,
                        shiftY: 0,
                        healthyShiftX: 0,
                        healthyShiftY: 0.1,
                        healthyAlt: 'Illustration of blood flowing through a healthy aorta.',
                        alt: 'Illustration of the aorta showing blood flow through the arch and descending vessel.',
                        labels: alexFlowIllustrationLabels,
                        healthyLabels: healthyIllustrationLabels
                    },
                    flowVariants: [
                        { view: 'lines', label: 'Pathlines', src: `${flowModelBase}aneurysm_lines_anim.glb`, comparisonSrc: `${flowModelBase}healthy_lines_anim.glb`, framingScale: 0.29, comparisonFramingScale: 0.29, rotationY: 1.5708, comparisonRotationY: -1.5708, shiftX: 0, shiftY: -0.15, comparisonShiftX: 0, comparisonShiftY: 0, animationFps: 20, animationSpeed: 1 },
                        { view: 'particles', label: 'Particle flow', src: `${flowModelBase}aneurysm_particles_anim.glb`, comparisonSrc: `${flowModelBase}healthy_particle_anim.glb`, framingScale: 0.37, comparisonFramingScale: 0.35, rotationY: 1.5708, comparisonRotationY: -1.5708, shiftX: 0, shiftY: -0.15, comparisonShiftX: 0, comparisonShiftY: 0, animationFps: 20, animationSpeed: 0.5 }
                    ],
                    modelMode: 'flow',
                    // Flow inside the widened section in red, the rest in white; the
                    // center is the anchor of the "Widened section" label.
                    flowColors: 'region',
                    flowRegion: { center: [0.87, 0.657, 0.766], radius: 0.12 },
                    labels: alexFlowModelLabels,
                    healthyLabels: healthyModelLabels,
                    preload: true,
                    animationFps: 20,
                    framingScale: 0.29,
                    alt: 'Animated pathlines representing simulated blood flow through Alex\'s Marfan-associated aneurysm model',
                    eyebrow: 'Patient-specific simulation',
                    title: 'Flow-Vis - Overall Flow',
                    infoPopup: {
                        title: 'Animation speed'
                    },
                    rotationHint: true
                },
                {
                    type: 'text',
                    text: 'The important point is not only where Alex\'s aorta is wide, but how the wider shape reorganizes the flow. Blood accelerates in the arch and can swirl in the enlargement, forming a vortex, unlike the orderly laminar flow of the healthy aorta beside it. These patterns matter because Alex\'s aortic wall is exposed to this flow with every heartbeat.'
                },
                {
                    type: 'reference',
                    text: 'Data basis: open VMR dataset 0021_H_AO_MFS, case 0129_0000, with CT-based geometry and simulation files. Methods reference: Wilson NM, Ortiz AK, Johnson AB. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. J Med Devices. 2013;7(4):040923. DOI: 10.1115/1.4025983. Simulation steps and assumptions: Kamada H, Nakamura M, Ota H, Higuchi S, Takase K. Blood flow analysis with computational fluid dynamics and 4D-flow MRI for vascular diseases. J Cardiol. 2022;80:386–396. DOI 10.1016/j.jjcc.2022.05.007.',
                    flowViews: {
                        illustration: { text: 'Drawings and animation made for this story, based on the 3D model of Alex\'s aorta. Geometry: Vascular Model Repository 0021_H_AO_MFS, case 0129_0000.' }
                    }
                }
            ]
        },
        {
            id: 'behandlung',
            title: 'Current-risk decision spectrum',
            className: 'alex-treatment-infographic-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'For Alex, treatment is not a fixed date but a decision that is revisited with every scan. As long as his aorta stays stable, careful watching is the treatment. If it grows faster, or reaches a size where the risk of a tear outweighs the risk of an operation, the team will recommend repair. No single number decides this: growth rate, body size, family history, valve findings, overall health, and the risks and benefits of surgery are weighed together.'
                },
                {
                    type: 'treatmentDecision',
                    variant: 'decisionMap',
                    axisStart: 'Lower urgency',
                    axisEnd: 'Higher urgency',
                    items: [
                        {
                            icon: 'circle_circle',
                            label: 'Stable diameter and growth',
                            treatment: 'Continue monitoring',
                            info: 'The follow-up interval is set for Alex individually. It becomes shorter as soon as a scan shows growth.'
                        },
                        {
                            icon: 'expand',
                            label: 'Faster growth or added risk',
                            treatment: 'Appointment at an aortic center',
                            info: 'An aortic center brings together surgeons, cardiologists, and imaging specialists experienced in inherited aortic disease. They confirm the measurements and discuss the options; a referral does not mean surgery is automatic.'
                        },
                        {
                            icon: 'surgical',
                            label: 'Point at which treatment is recommended',
                            treatment: 'Aortic repair',
                            info: 'For Marfan syndrome, guidelines recommend surgery when the aortic root reaches 5.0 cm; it may be considered from 4.5 cm when specific high-risk features are present. These figures apply to the aortic root, not every part of the aorta. Surgeons then replace the enlarged root and sometimes the ascending aorta; in selected patients the natural aortic valve can be preserved, in others it is repaired or replaced.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Source: [2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease](https://doi.org/10.1161/CIR.0000000000001106), Marfan surveillance and aortic-root surgery recommendations. Alex case: VMR dataset 0021_H_AO_MFS, case 0129_0000.'
                }
            ]
        },
        {
            id: 'praevention',
            title: 'Reducing Risk Over Time',
            className: 'aneurysm-risk-section alex-prevention-infographic-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'Alex cannot prevent Marfan syndrome itself, but he can reduce the stress on his aortic wall and make sure that dangerous changes do not go unnoticed. For him, prevention is not a single step but a set of habits that runs through his everyday life, his care, and his family.'
                },
                {
                    type: 'preventionTimeline',
                    items: [
                        {
                            eyebrow: 'Every day',
                            title: 'Blood pressure',
                            info: 'Keeping blood pressure controlled reduces stress on the aortic wall. Alex should follow the plan agreed with his care team and report concerns about side effects or unusually high readings.'
                        },
                        {
                            eyebrow: 'With the care team',
                            title: 'Medication',
                            info: 'Medication may be used to manage blood pressure and reduce strain on the aorta. The choice and dose depend on Alex’s wider health and should be reviewed with his clinicians.'
                        },
                        {
                            eyebrow: 'In activity',
                            title: 'Adapted exertion',
                            info: 'Activity recommendations are individualized. Avoiding sudden, extreme exertion can help limit sharp blood-pressure rises, while the care team defines what is safe.'
                        },
                        {
                            eyebrow: 'Long term',
                            title: 'Regular imaging',
                            info: 'Follow-up imaging tracks the size and shape of the aorta over time.'
                        },
                        {
                            eyebrow: 'In the family',
                            title: 'Genetic risk',
                            info: 'Genetic counseling and family assessment can help determine who may benefit from follow-up.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Sources: 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease, recommendations on Marfan syndrome, medical therapy, activity, surveillance imaging, and genetic evaluation. DOI: 10.1161/CIR.0000000000001106.'
                }
            ]
        }
    ]
};
