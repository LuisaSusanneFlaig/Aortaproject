const flowModelBase = 'assets/models/flow/optimized/';

export const aneurysmStory = {

    title: 'Aortic Aneurysm',
    nav: [
        { href: '#definition-statistics', label: 'Definition' },
        { href: '#anatomie', label: 'Anatomy' },
        { href: '#symptome', label: 'Symptoms' },
        { href: '#diagnose-procedure', label: 'Diagnosis' },
        { href: '#alex-simulation-method', label: 'Prognosis' },
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
                    text: 'Before Alex\'s scan becomes personal, the two charts on the left set the wider scene. The left chart, “Deaths”, shows that more people worldwide are dying with aortic aneurysm than in earlier decades: its line rises by 74%, from 88,353 in 1990 to 153,927 in 2021. This is partly because populations are growing and aging. The right chart, “Standardized death rate per 100,000”, shows the opposite trend. A standardized death rate adjusts for age, and by this measure the risk of dying fell by 27%, from 2.54 to 1.86 per 100,000 people. This suggests that diagnostics and treatment methods are improving. In both charts, the dotted line to 2030 is a projection, not a measurement.',
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
                alt: 'Illustration of Alex’s aortic arch and descending aorta, with widening in the arch.'
            },
            inlineModel: {
                url: `${flowModelBase}aneurysm_anatomy.glb`,
                label: 'Patient-specific aortic geometry of Alex',
                mode: 'flow',
                rotationY: 1.5708,
                framingScale: 0.72,
                legend: false,
                rotationHint: true,
                labels: [
                    { text: 'Aortic root', anchor: [0.198, 0.53, 0.47], side: 'left' },
                    { text: 'Ascending aorta', anchor: [0.194, 0.592, 0.439], side: 'left' },
                    { text: 'Aortic arch', anchor: [0.599, 0.734, 0.76], side: 'left' },
                    { text: 'Widened section (aneurysm)', anchor: [0.87, 0.657, 0.766], side: 'right' },
                    { text: 'Descending aorta', anchor: [0.83, 0.455, 0.697], side: 'right' }
                ]
            },
            elements: [
                {
                    type: 'text',
                    text: 'Alex has Marfan syndrome, an inherited weakness of the connective tissue that can also affect the wall of the aorta. His aorta is shown here. It has widened in the thoracic part. That\'s why it is called a thoracic aortic aneurysm.'
                },
                {
                    type: 'text',
                    text: 'The labels in the model follow the path of the blood. It leaves the heart through the aortic valve into the aortic root, the first, slightly wider part of the aorta. From there it rises through the ascending aorta, curves through the aortic arch, and flows down the descending aorta. The widened section, the aneurysm, sits where the arch turns downward.'
                },
                {
                    type: 'reference',
                    text: '3D geometry and case data: Vascular Model Repository 0021_H_AO_MFS, case 0129_0000. Clinical data file documents male sex, age 18, weight 59 kg, height 185.42 cm, heart rate 51 beats/min, and cuff pressures 110/67.'
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
                    text: 'The difficult part of a thoracic aortic aneurysm is that it can stay quiet for a long time. Clinical sources describe most people as having no symptoms before a sudden serious event; one review gives roughly 95% without warning signs and about 5% with symptoms beforehand. If the widened vessel presses on nearby parts of the body, it may cause chest or back pain, a change in the voice, trouble swallowing, or shortness of breath. Sudden severe pain, fainting, breathlessness, or neurological symptoms can signal a tear in the wall of the aorta or a burst blood vessel.'
                },
                {
                    type: 'symptomBars',
                    subtitle: 'Thoracic aortic aneurysm',
                    items: [
                        {
                            icon: 'block',
                            label: 'No symptoms',
                            value: 95,
                            info: 'Many thoracic aortic aneurysms grow without noticeable symptoms, sometimes for years.'
                        },
                        {
                            icon: 'sick',
                            label: 'Symptoms before acute event',
                            value: 5,
                            info: 'A small proportion of people notice symptoms before an acute event. They should be assessed promptly, especially when an aortic aneurysm is already known.'
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
                    text: 'Because Alex has Marfan syndrome, doctors check his aorta regularly, even when he feels well. They measure the aortic root and ascending aorta, assess the aortic valve, and compare each result with earlier scans. The change over time matters as much as one measurement. The team also considers family history, body size, and how quickly the aorta is growing when planning the next scan or specialist review.',
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
                            info: 'Marfan syndrome can weaken the aortic wall.'
                        },
                        {
                            icon: 'event_available_svg',
                            title: 'Surveillance',
                            info: 'Regular checks can find enlargement before it causes symptoms.'
                        },
                        {
                            icon: 'radiology_aorta',
                            title: 'Imaging',
                            info: 'The images show the aorta’s course and branches and let radiologists measure its widest points.'
                        },
                        {
                            icon: 'compare_svg',
                            title: 'Aortic review',
                            info: 'The team decides whether the aorta is stable or growing and when the next scan or specialist review is due.'
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
                    text: 'A CT angiogram (CTA) is a CT scan that shows the blood vessels. A contrast agent is injected into a vein in the arm while the scanner takes a rapid series of X-ray images. The contrast makes the blood inside the vessels stand out, so the team can trace the aorta, see its branches, and measure its diameter. The aorta is colored red here during image editing; it was not red in the original scan.'
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
                        text: 'The widened section of Alex\'s thoracic aorta is the finding being measured and followed over time.'
                    }
                }
            ]
        },
        {
            id: 'alex-scan-to-model',
            title: 'From Scan to 3D Model',
            className: 'scan-to-model-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'A CTA is not one single picture but a stack of hundreds of thin images, called slices. On a computer, software traces the outline of the aorta in each slice and joins these outlines into a three-dimensional model. This is how the model of Alex\'s aorta shown earlier was built, and it is also the starting point for the flow simulation later in the story.'
                },
                {
                    type: 'processSteps',
                    label: 'From CTA slices to a 3D model of Alex\'s aorta',
                    steps: [
                        {
                            title: 'CT scanner',
                            text: 'The patient lies on a table that moves through the ring of the scanner.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/ct_scanner.png', alt: 'A CT scanner with its ring and patient table' }
                        },
                        {
                            title: 'CTA slices',
                            text: 'The scan is a stack of thin images through the chest.',
                            visual: { kind: 'slices', src: 'assets/story_images/alex_cta_sagittal.png', aspect: '1212 / 1193', alt: 'Alex\'s sagittal CTA image with the aorta highlighted in red, shown as the front image of a stack of slices' }
                        },
                        {
                            title: 'Software',
                            text: 'On a computer, software traces the aorta in every slice and joins the outlines.',
                            visual: { kind: 'icon', icon: 'computer' }
                        },
                        {
                            title: '3D model',
                            text: 'Alex\'s aorta as a model that can be turned and used for a flow simulation.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/alex_model.png', alt: '3D model of Alex\'s aorta built from the CTA slices' }
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'CT scanner 3D model: “CT Scanner” by Ng Jun Wei, https://skfb.ly/ornOu, licensed under Creative Commons Attribution 4.0, http://creativecommons.org/licenses/by/4.0/. CTA image and aortic model: Vascular Model Repository 0021_H_AO_MFS, case 0129_0000.'
                }
            ]
        },
        {
            id: 'alex-simulation-method',
            title: 'How the Flow Is Simulated',
            scrollMode: 'sequence',
            className: 'simulation-method-section',
            elements: [
                {
                    type: 'text',
                    text: 'To simulate the flow, the 3D model is divided into a computational mesh. Software then calculates how blood moves through this geometry, from where it enters the aorta to where it leaves through its branches.'
                },
                {
                    type: 'text',
                    text: 'The results are rendered as a 3D animation; color and motion help show flow direction and relative speed. This is simulated data, not blood recorded in the body or a prediction of Alex\'s individual outcome.'
                },
                {
                    type: 'text',
                    text: 'Every simulation rests on assumptions. The vessel wall is usually treated as rigid, although real vessels stretch with every heartbeat. Inflow and outflow are based on measurements, population averages or estimates, and small differences in how the aorta is traced in the scan can change the result. Above all, the flow is calculated, not measured: 4D-flow MRI can measure blood flow in the body, but with less detail.'
                },
                {
                    type: 'processSteps',
                    label: 'How a flow simulation is built from Alex\'s 3D model',
                    steps: [
                        {
                            title: 'Mesh',
                            text: 'The 3D model is divided into many small elements, where the flow is calculated.',
                            visual: { kind: 'image', src: 'assets/story_images/alex_mesh_closeup.png', alt: 'Close-up of the wall of Alex\'s aortic model, divided into a mesh of small triangles' }
                        },
                        {
                            title: 'In- and outflow',
                            text: 'At each open end, the team sets how blood enters from the heart and leaves the model. The red planes mark these openings.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/alex_planes.png', alt: 'Alex\'s aortic model with red planes at the inflow in the aortic root and at the outflows of the branches and the descending aorta' }
                        },
                        {
                            title: 'Calculation',
                            text: 'A computer solves the equations of fluid motion for every element, step by step in time.',
                            visual: { kind: 'icon', icon: 'calculate' }
                        },
                        {
                            title: 'Visualization',
                            text: 'The results become pathlines that show where blood moves and how fast.',
                            visual: { kind: 'image', fit: 'contain', src: 'assets/story_images/process/alex_pathlines.png', alt: 'Pathlines of the simulated blood flow in Alex\'s aorta' }
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Simulation steps and assumptions: Kamada H, Nakamura M, Ota H, Higuchi S, Takase K. Blood flow analysis with computational fluid dynamics and 4D-flow MRI for vascular diseases. J Cardiol. 2022;80:386–396. DOI 10.1016/j.jjcc.2022.05.007. Methods reference: Wilson NM, Ortiz AK, Johnson AB. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. J Med Devices. 2013;7(4):040923. DOI: 10.1115/1.4025983. Data basis: VMR dataset 0021_H_AO_MFS, case 0129_0000.'
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
                    text: 'In the aorta, shape and blood flow are tightly connected. This model shows simulated blood flow through Alex’s aorta. It illustrates changes in speed and direction, especially where the vessel widens or curves.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-overview-model',
                    src: `${flowModelBase}aneurysm_lines_anim.glb`,
                    flowIllustration: {
                        type: 'video',
                        src: 'assets/story_images/aneurysm_flow_illustration.gif',
                        healthySrc: 'assets/story_images/healthy_flow_illustration.gif',
                        healthyAlt: 'Illustration of blood flowing through a healthy aorta.',
                        alt: 'Illustration of the aorta showing blood flow through the arch and descending vessel.'
                    },
                    flowVariants: [
                        { label: 'Pathlines', src: `${flowModelBase}aneurysm_lines_anim.glb`, comparisonSrc: `${flowModelBase}healthy_lines_anim.glb`, framingScale: 0.29, comparisonFramingScale: 0.29, rotationY: 1.5708, comparisonRotationY: -1.5708, animationFps: 20, animationSpeed: 1 },
                        { label: 'Particle flow', src: `${flowModelBase}aneurysm_particles_anim.glb`, comparisonSrc: `${flowModelBase}healthy_particle_anim.glb`, framingScale: 0.35, comparisonFramingScale: 0.35, rotationY: 1.5708, comparisonRotationY: -1.5708, animationFps: 20, animationSpeed: 0.5 }
                    ],
                    modelMode: 'flow',
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
                    text: 'The important point is not only where the aorta is wide, but how the wider shape reorganizes flow. Blood accelerates in the arch and can swirl in the enlargement, forming a vortex. This differs from the smoother, more orderly movement called laminar flow. For comparison, the healthy-flow reference uses a separate healthy aortic anatomy; it does not show Alex\'s aorta. These patterns matter because the vessel wall is exposed to the flow with every heartbeat.',
                    infoPopup: {
                        title: 'laminar flow',
                        text: 'In laminar flow, blood moves smoothly in one direction and swirls only very little; no large swirls form. When the flow is disturbed, for example where the vessel widens or splits, larger swirls can develop.'
                    }
                },
                {
                    type: 'reference',
                    text: 'Data basis: open VMR dataset 0021_H_AO_MFS, case 0129_0000, with CT-based geometry and simulation files. Methods reference: Wilson NM, Ortiz AK, Johnson AB. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. J Med Devices. 2013;7(4):040923. DOI: 10.1115/1.4025983.'
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
                    text: 'This is a choice based on changing risk, not a fixed timeline. If Alex’s measurements are stable, the team continues planned scans and medical follow-up. Faster growth or other risk features can lead to an earlier discussion with a specialist aortic team. For Marfan syndrome, guidelines recommend surgery when the aortic root reaches 5.0 cm; surgery may be considered from 4.5 cm when specific high-risk features are present. These figures apply to the aortic root—not every part of the aorta—and are not a decision rule by themselves. Growth rate, body size, family history, valve findings, overall health, and the risks and benefits of surgery are considered together.'
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
                            info: 'If repeat measurements show little or no growth, follow-up imaging and visits continue at an interval chosen for Alex.'
                        },
                        {
                            icon: 'expand',
                            label: 'Faster growth or added risk',
                            treatment: 'Appointment at an aortic center',
                            info: 'A faster increase in size, family history, or other high-risk findings may prompt earlier review by a team experienced in inherited aortic disease. The team confirms measurements and discusses options; it does not mean surgery is automatic.'
                        },
                        {
                            icon: 'surgical',
                            label: 'Point at which treatment is recommended',
                            treatment: 'Aortic repair',
                            info: 'If the balance of risk favors repair, surgeons replace the enlarged aortic root and sometimes the ascending aorta. In selected patients the natural aortic valve can be preserved; in others it is repaired or replaced.'
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
                    text: 'Alex cannot prevent Marfan syndrome itself, but he can reduce stress on the aortic wall and keep dangerous changes from going unnoticed. Long-term care means controlling blood pressure, taking medication when prescribed, adapting intense physical activity, returning for regular imaging, and including family or genetic care because inherited aortic risk can affect relatives too.'
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
