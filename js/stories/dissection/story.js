const flowModelBase = 'assets/models/flow/optimized/';

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
                alt: 'Illustration of Miriam’s dissected aorta with a second channel within the vessel wall.'
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
                labels: [
                    { text: 'Ascending aorta', anchor: [0.131, 0.72, 0.264], side: 'left' },
                    { text: 'Aortic arch', anchor: [0.283, 0.857, 0.441], side: 'left' },
                    { text: 'Entry tear (flap begins)', anchor: [0.628, 0.856, 0.785], side: 'right' },
                    { text: 'True and false lumen', anchor: [0.888, 0.645, 0.791], side: 'right' },
                    { text: 'Descending aorta', anchor: [0.677, 0.422, 0.798], side: 'right' },
                    { text: 'End of the flap', anchor: [0.42, 0.165, 0.615], side: 'left' }
                ]
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
                    text: 'The labels in the model trace this route. Blood leaves the heart through the ascending aorta and curves through the aortic arch. Just beyond the arch, the entry tear marks where the flap begins. From there, the flap divides the descending aorta into the true and false lumen until it ends further down.'
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
            inlineModel: {
                url: `${flowModelBase}healthy_lines_anim.glb`,
                label: 'Simulated blood flow through a healthy reference aorta, shown as colored lines',
                mode: 'flow',
                legend: false,
                sourceColors: true,
                speedLegend: true,
                rotationX: 0,
                rotationY: -1.5708,
                rotationZ: 0,
                framingScale: 0.4,
                animationFps: 20,
                animationSpeed: 1,
                rotationHint: true
            },
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Before we look at the blood flow in Miriam\'s aorta, it helps to learn how blood flow is shown in this story. The model shows a healthy aorta from a separate reference case, not Miriam\'s. Each line traces the path that blood takes through the vessel, and its color shows how fast the blood moves there.'
                },
                {
                    type: 'text',
                    text: 'In a healthy aorta, the lines run side by side, smooth and orderly, from the heart through the arch and down into the body. This is called laminar flow. Later in the story, the same kind of image shows how a dissection disturbs this order.',
                    infoPopup: {
                        title: 'laminar flow',
                        text: 'In laminar flow, blood moves smoothly in one direction and swirls only very little; no large swirls form. When the flow is disturbed, for example where the vessel widens or splits, larger swirls can develop.'
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
                    text: 'The chart shows how often each warning sign was reported by 1,891 people with acute Type B dissection in an international registry (IRAD). Most of them had severe chest or back pain, often beginning suddenly. High blood pressure is also common. Migrating pain means the pain seems to move as the tear extends along the aorta. A fainting episode, a normal heart tracing, or a normal chest X-ray cannot safely rule the disease in or out, so symptoms are only the first clue. Type A dissections cause similar warning signs, with chest pain being more common there.'
                },
                {
                    type: 'symptomBars',
                    subtitle: '1,891 people with acute Type B dissection',
                    items: [
                        { icon: 'bolt', label: 'Severe or worst-ever pain', value: 88.7, color: '#c83c48', info: 'A sudden, severe pain in the chest or back is an important warning sign. It can feel different from usual pain and needs urgent medical assessment.' },
                        { icon: 'rib_cage', label: 'Chest or back pain', value: 88.7, color: '#c83c48', info: 'Pain can be felt in the chest, back, or both. Its location alone cannot confirm a dissection, but it helps clinicians decide how urgently to investigate.' },
                        { icon: 'acute', label: 'Sudden onset', value: 85.4, color: '#c83c48', info: 'Dissection pain often begins abruptly. A sudden onset is a clinical clue.' },
                        { icon: 'blood_pressure', label: 'High blood pressure', value: 64.6, color: '#c83c48', info: 'High blood pressure can increase stress on the aortic wall.' },
                        { icon: 'hand_bones', label: 'Migrating pain', value: 16.8, color: '#c83c48', info: 'Migrating pain can move from the chest toward the back or abdomen as the dissection extends.' }
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
                    text: 'A suspected dissection is an emergency, so assessment and imaging happen quickly. The team asks when the pain began and whether Miriam has Marfan syndrome or known aortic disease, checks blood pressure and pulses in the limbs, and looks for signs that blood flow to the brain, kidneys, gut, or legs may be affected. These clues help judge urgency but cannot confirm the diagnosis. In selected people with a low likelihood of dissection, a D-dimer blood test may help rule it out; it is not used alone and a positive result does not prove a tear.',
                    infoPopup: {
                        title: 'D-dimer',
                        text: 'D-dimer is a small protein fragment. A blood test can help assess the likelihood of clot-related disease: a negative result can help rule it out in people with a low clinical probability, while a positive result can have other causes and usually needs further testing.'
                    }
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            icon: 'genetics_svg',
                            title: 'Marfan Risk',
                            info: 'Miriam’s Marfan syndrome is an inherited risk factor clinicians consider.'
                        },
                        {
                            icon: 'monitor_heart_svg',
                            title: 'Assessment',
                            info: 'Clinicians compare blood pressure and pulse strength between limbs and check for new weakness, confusion, fainting, or a painful or cool limb.'
                        },
                        {
                            icon: 'labs_svg',
                            title: 'Lab tests',
                            info: 'Blood tests can include D-dimer and tests of organ function, which show whether the kidneys, liver, or gut are affected.'
                        },
                        {
                            icon: 'radiology_aorta',
                            title: 'Aortic imaging',
                            info: 'The team looks for the wall flap and both channels, maps how far they extend, measures the aorta, and checks whether blood flow to organs is reduced or there are signs of bleeding.'
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
                    text: 'A CTA is not one single picture but a stack of hundreds of thin images, called slices. On a computer, software traces the outline of the aorta in each slice and joins these outlines into a three-dimensional model. In Miriam\'s case, the model also has to capture the flap that divides the aorta into two channels. This is how the model shown earlier was built, and it is also the starting point for the flow simulation later in the story.'
                },
                {
                    type: 'processSteps',
                    label: 'From CTA slices to a 3D model of Miriam\'s aorta',
                    steps: [
                        {
                            title: 'CT scanner',
                            text: 'The patient lies on a table that moves through the ring of the scanner.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/ct_scanner.png', alt: 'A CT scanner with its ring and patient table' }
                        },
                        {
                            title: 'CTA slices',
                            text: 'The scan is a stack of thin images through the chest.',
                            visual: { kind: 'slices', src: 'assets/story_images/miriam_cta.png', aspect: '955 / 1280', alt: 'Miriam\'s CTA image with the dissected aorta highlighted in red, shown as the front image of a stack of slices' }
                        },
                        {
                            title: 'Software',
                            text: 'On a computer, software traces the aorta in every slice and joins the outlines.',
                            visual: { kind: 'icon', icon: 'computer' }
                        },
                        {
                            title: '3D model',
                            text: 'Miriam\'s aorta as a model that can be turned and used for a flow simulation.',
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
                    text: 'To simulate the flow, the 3D model is divided into a computational mesh that includes both channels. Software then calculates how blood moves through this geometry, from where it enters the aorta to where it leaves through its branches.'
                },
                {
                    type: 'text',
                    text: 'The results are shown as the moving lines introduced earlier: each line follows the path of the blood, and its color shows the speed. This is simulated data, not blood recorded in the body or a prediction of Miriam\'s individual outcome.'
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
                            text: 'The 3D model is divided into many small elements, where the flow is calculated.',
                            visual: { kind: 'image', src: 'assets/story_images/miriam_mesh_closeup.png', alt: 'Close-up of the wall of Miriam\'s aortic model, divided into a mesh of small triangles' }
                        },
                        {
                            title: 'In- and outflow',
                            text: 'At each open end, the team sets how blood enters from the heart and leaves the model. The red planes mark these openings.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/miriam_planes.png', alt: 'Miriam\'s aortic model with red planes at the inflow in the ascending aorta and at the outflows of the other open ends' }
                        },
                        {
                            title: 'Calculation',
                            text: 'A computer solves the equations of fluid motion for every element, step by step in time.',
                            visual: { kind: 'icon', icon: 'calculate' }
                        },
                        {
                            title: 'Visualization',
                            text: 'The results become pathlines that show where blood moves and how fast.',
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
                    text: 'This simulation shows how blood moves through both channels of Miriam\'s dissected aorta. It illustrates how the tear changes the route of circulation. The simulation is based on a follow-up CTA taken about six weeks after the dissection.'
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
                        alt: 'Illustration of an aortic dissection showing blood flow through the true and false channels.'
                    },
                    flowVariants: [
                        { label: 'Pathlines', src: `${flowModelBase}dissection_lines_anim.glb`, comparisonSrc: `${flowModelBase}healthy_lines_anim.glb`, framingScale: 0.75, comparisonFramingScale: 0.29, rotationY: -1.5708, comparisonRotationY: -1.5708, animationFps: 20, animationSpeed: 1 },
                        { label: 'Particle flow', src: `${flowModelBase}dissection_particles_anim.glb`, comparisonSrc: `${flowModelBase}healthy_particle_anim.glb`, framingScale: 0.35, comparisonFramingScale: 0.35, rotationY: -1.5708, comparisonRotationY: -1.5708, animationFps: 20, animationSpeed: 0.5 }
                    ],
                    modelMode: 'flow',
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
                    text: 'Flow speed and direction vary across the vessel, and swirling areas may change the forces on the wall. The healthy comparison view uses the same reference aorta as before, with its orderly laminar flow. The difference helps explain why blood movement matters for the treatment decisions that follow.'
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
                    text: 'Treatment depends on whether the dissection is causing complications. For an uncomplicated Type B dissection, the first step is usually hospital care with medicine to lower heart rate and blood pressure, pain relief, and close checks of pulses, organ function, and repeat images. If blood flow to an organ is reduced, the aorta is enlarging or leaking, pain persists, or blood pressure cannot be controlled, the team may recommend repair. A common option is TEVAR, a stent graft placed from inside the aorta to cover the main tear. It is not suitable for every anatomy or every person.',
                    infoPopup: {
                        title: 'TEVAR',
                        text: 'TEVAR means thoracic endovascular aortic repair. Through an artery, usually in the groin, doctors guide a catheter carrying a fabric-covered metal stent graft to the chest aorta. Once opened, it lines the inside of the vessel and covers the main tear, helping blood flow through the intended channel. Suitability depends on the tear\'s position, branch vessels, and the strength of the aortic wall; people with Marfan syndrome may need a different balance of endovascular and open repair.'
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
                            info: 'Without complications, treatment begins in hospital with medicines and close monitoring. Repeat imaging checks whether the dissection changes.'
                        },
                        {
                            icon: 'medical_services',
                            label: 'Complicated Type B',
                            treatment: 'Aortic treatment',
                            info: 'With complications, the aortic team weighs urgent repair, with TEVAR or open surgery. The choice depends on the anatomy and on Miriam\'s connective-tissue disease.'
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
                    text: 'After the emergency, care shifts to lowering the chance of further aortic problems and finding change early. Long-term blood-pressure and heart-rate medicines reduce strain on the wall; the care team adjusts them to the person and checks for side effects. Repeat imaging looks for enlargement or other changes in the dissected area and the rest of the aorta. Activity is usually returned to gradually, with a clinician or rehabilitation team advising what level is appropriate and which heavy straining to avoid. Because Miriam has Marfan syndrome, follow-up is lifelong and close relatives may be offered genetic counseling and aortic assessment.'
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
