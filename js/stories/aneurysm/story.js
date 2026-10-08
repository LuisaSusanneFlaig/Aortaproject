const flowModelBase = ['localhost', '127.0.0.1'].includes(globalThis.location?.hostname)
    ? 'assets/models/flow/optimized/'
    : 'https://media.githubusercontent.com/media/LuisaSusanneFlaig/Aortaproject/refs/heads/changes-to-version-1/assets/models/flow/optimized/';

export const aneurysmStory = {

    title: 'Aortic Aneurysm',
    nav: [
        { href: '#definition-statistics', label: 'Definition' },
        { href: '#anatomie', label: 'Anatomy' },
        { href: '#symptome', label: 'Symptoms' },
        { href: '#diagnose-procedure', label: 'Diagnosis' },
        { href: '#behandlung', label: 'Treatment' },
        { href: '#alex-flow-overview', label: 'Prognosis' },
        { href: '#praevention', label: 'Prevention' }
    ],
    sections: [
        {
            id: 'definition',
            title: 'Aneurysm Story',
            timelineLabel: 'Alex - age 18',
            className: 'story-intro aneurysm-intro',
            columns: '2',
            scrollMode: 'sticky',
            elements: [
                {
                    type: 'image',
                    src: 'assets/story_images/alex_portrait_photoreal_v1.png',
                    aspect: '4 / 5',
                    alt: 'Portrait of Alex'
                },
                {
                    type: 'pullQuote',
                    text: 'Alex is 18 when a known risk becomes a visible finding.'
                },
                {
                    type: 'text',
                    text: 'Alex lives with Marfan syndrome, an inherited condition that can weaken connective tissue. The aorta, the large artery that carries blood away from the heart, depends on strong connective tissue in its wall. When that wall stretches and widens, the enlargement is called an aortic aneurysm.',
                    infoPopup: {
                        title: 'Marfan syndrome',
                        text: 'Marfan syndrome is relatively rare, affecting about 1 in 5,000 to 10,000 people. It can affect different parts of the body, including the skeleton, eyes, heart, and blood vessels People with Marfan syndrome are often taller than average, with long arms and legs and slender hands and feet.'
                    }
                },
                {
                    type: 'text',
                    text: 'His story begins before an emergency. A planned scan turns an invisible risk into a shape doctors can measure, compare, and follow. From there, the central question is simple: when is careful observation enough, and when should treatment be discussed before the blood vessel becomes at risk of tearing?'
                }
            ]
        },
        {
            id: 'definition-statistics',
            title: 'Aortic Aneurysm in Numbers',
            className: 'aneurysm-burden-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'Before Alex\'s scan becomes personal, the statistics set the wider scene. More people worldwide are dying with aortic aneurysm than in earlier decades, partly because populations are growing and aging. At the same time, after adjusting for age, the risk of death is decreasing (standardized death rate). This shows that diagnostics and treatment methods are improving. The values for 2030 are estimates, not measurements.',
                    infoPopup: {
                        title: 'standardized death rate',
                        text: 'A standardized mortality rate adjusts mortality figures to a common population structure, often by age, so populations or years can be compared more fairly. It estimates the death rate that would be seen if the population had the same age distribution as the reference population.'
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
            inlineModel: {
                url: 'assets/models/alex_aneurysm_aorta_0021.glb',
                label: 'Patient-specific aortic geometry of Alex',
                mode: 'surface',
                legend: false,
                rotationHint: true
            },
            elements: [
                {
                    type: 'text',
                    text: 'Alex\'s aorta is shown here as a 3D model. The actual shape of his aorta is captured using CTA imaging. The model you can see on the left is then extracted from that imaging. In Marfan syndrome, doctors follow that shape over time because a weakened wall can widen gradually. A single scan matters, but the trend matters even more: diameter, growth, and location are compared across follow-up visits.',
                    infoPopup: {
                        title: 'CTA',
                        text: 'Software combines the CTA scan slices into a 3D model, allowing the aorta to be viewed from different angles rather than as a single cross-section.'
                    }
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
                    text: 'The difficult part of a thoracic aortic aneurysm is that it can stay quiet for a long time. Clinical sources describe most people as having no symptoms before an sudden serious event; one review gives roughly 95% without warning signs and about 5% with symptoms beforehand. If the widened vessel presses on nearby parts of the body , it may cause chest or back pain, a change in the voice, trouble swallowing, or shortness of breath. Sudden severe pain, fainting, breathlessness, or neurological symptoms can signal a tear in the wall of the aorta or a burst blood vessel.',
                    infoPopup: {
                        title: 'thoracic aortic aneurysm',
                        text: 'A thoracic aortic aneurysm is a bulge or widening in the part of the aorta that runs through the chest.'
                    }
                },
                {
                    type: 'symptomBars',
                    subtitle: 'Thoracic aortic aneurysm',
                    items: [
                        {
                            icon: 'block',
                            label: 'No symptoms',
                            value: 95,
                            info: 'Many thoracic aortic aneurysms grow without noticeable symptoms. This is why regular imaging can be important: it may identify changes before the aneurysm causes an emergency.'
                        },
                        {
                            icon: 'sick',
                            label: 'Symptoms before acute event',
                            value: 5,
                            info: 'A small proportion of people may notice symptoms before an acute event. Chest or back pain, shortness of breath, trouble swallowing, or a changed voice should be assessed promptly, especially when an aortic aneurysm is already known.'
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
                    text: 'Because Alex has Marfan syndrome, doctors check his aorta even when he feels well: widening may cause no symptoms. They measure the aortic root and ascending aorta, assess the aortic valve, and compare each result with earlier scans. The change over time matters as much as one measurement. The team also considers family history, body size, and how quickly the aorta is growing when planning the next scan or specialist review.',
                    infoPopup: {
                        title: 'valve findings',
                        text: 'Heart valves act like one-way doors that keep blood moving through the heart in the right direction. The aortic valve sits between the heart’s main pumping chamber and the aorta, and scans can show whether it is opening and closing normally.'
                    }
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            icon: 'genetics_svg',
                            title: 'Marfan risk',
                            info: 'Marfan syndrome can weaken the aortic wall. Regular checks can find enlargement before it causes symptoms; feeling well does not show whether the aorta has changed.'
                        },
                        {
                            icon: 'event_available_svg',
                            title: 'Surveillance',
                            info: 'The first heart ultrasound measures the aortic root and ascending aorta. A repeat study after about six months can show the growth rate; if measurements are stable, yearly ultrasound is commonly used. CT or MRI may be needed when ultrasound cannot show the aorta clearly or to assess more of it.'
                        },
                        {
                            icon: 'radiology_aorta',
                            title: 'CTA imaging',
                            info: 'CTA combines many X-ray views with contrast injected into a vein. The images show the aorta’s course and branches and let radiologists measure its widest points. Consistent measurement methods make comparisons between scans more useful.'
                        },
                        {
                            icon: 'compare_svg',
                            title: 'Aortic review',
                            info: 'The team checks whether the aorta is stable or growing, reviews the family history and valve, and relates the measurements to Alex’s body size. These details help set the follow-up interval and decide when an aortic specialist should discuss treatment.'
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
                    text: 'For a CT angiogram (CTA), a small tube is placed in a vein, usually in the arm, and iodine contrast is injected while the scanner takes a rapid series of X-ray images. The contrast makes blood-filled spaces stand out, so the team can trace the aorta, see its branches, and measure its diameter. A computer can combine the thin image slices into views from different angles. The aorta is colored red here during image editing; it was not red in the original scan.'
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
            id: 'behandlung',
            title: 'Current-risk decision spectrum',
            className: 'alex-treatment-infographic-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'This is a choice based on changing risk, not a fixed timeline. If Alex’s measurements are stable, the team continues planned scans and medical follow-up. Faster growth, a close relative who had a dissection, or other risk features can lead to an earlier discussion with a specialist aortic team. For Marfan syndrome, guidelines recommend surgery when the aortic root reaches 5.0 cm; surgery may be considered from 4.5 cm when specific high-risk features are present. These figures apply to the aortic root—not every part of the aorta—and are not a decision rule by themselves. Growth rate, body size, family history, valve findings, overall health, and the risks and benefits of surgery are considered together.'
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
                            info: 'If repeat measurements show little or no growth, follow-up imaging and visits continue at an interval chosen for Alex. Regular review matters because a change can happen before symptoms appear.'
                        },
                        {
                            icon: 'expand',
                            label: 'Faster growth or added risk',
                            treatment: 'Appointment at an aortic center',
                            info: 'A faster increase in size, family history of early dissection, or other high-risk findings may prompt earlier review by a team experienced in inherited aortic disease. The team confirms measurements and discusses options; it does not mean surgery is automatic.'
                        },
                        {
                            icon: 'surgical',
                            label: 'Point at which treatment is recommended',
                            treatment: 'Aortic repair',
                            info: 'If the balance of risk favors repair, surgeons replace the enlarged aortic root and sometimes the ascending aorta. In selected patients the natural aortic valve can be preserved; in others it is repaired or replaced. The approach is planned by an experienced multidisciplinary team before an emergency develops.'
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
            id: 'alex-flow-overview',
            title: 'Flow in Alex\'s Aorta',
            className: 'flow-research-section alex-flow-section',
            scrollMode: 'sticky',
            elements: [
                {
                    type: 'text',
                    text: 'In the aorta, shape and blood flow are tightly connected. This model shows simulated blood flow through Alex’s aorta. It illustrates changes in speed and direction, especially where the vessel widens or curves. It is not a real-time scan, but a simulation based on his anatomy.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-overview-model',
                    src: `${flowModelBase}aneurysm_lines_anim.glb`,
                    flowVariants: [
                        { label: 'Pathlines', src: `${flowModelBase}aneurysm_lines_anim.glb`, framingScale: 0.29, rotationY: 1.5708, animationFps: 20, animationSpeed: 1 },
                        { label: 'Particle flow', src: `${flowModelBase}aneurysm_particles_anim.glb`, framingScale: 0.35, rotationY: 1.5708, animationFps: 20, animationSpeed: 0.5 },
                        { label: 'Healthy laminar flow · pathlines', src: `${flowModelBase}healthy_lines_anim.glb`, framingScale: 0.29, rotationY: -1.5708, animationFps: 20, animationSpeed: 1, showInfoPopup: false },
                        { label: 'Healthy laminar flow · particles', src: `${flowModelBase}healthy_particle_anim.glb`, framingScale: 0.35, rotationY: -1.5708, animationFps: 20, animationSpeed: 0.5, showInfoPopup: false }
                    ],
                    modelMode: 'flow',
                    preload: true,
                    animationFps: 20,
                    framingScale: 0.3,
                    alt: 'Animated pathlines representing simulated blood flow through Alex\'s Marfan-associated aneurysm model',
                    eyebrow: 'Patient-specific simulation',
                    title: 'Flow-Vis - Overall Flow',
                    infoPopup: {
                        title: 'About this simulation',
                        text: 'Alex\'s aortic anatomy is reconstructed from medical imaging and divided into a computational mesh. Software calculates blood movement through that geometry, including how blood enters the aorta and leaves through its branches. The calculated results are then rendered as a 3D animation; color and motion help show flow direction and relative speed. This is simulated data, not blood recorded in the body or a prediction of Alex\'s individual outcome.'
                    },
                    rotationHint: true
                },
                {
                    type: 'text',
                    text: 'The important point is not only where the aorta is wide, but how the wider shape reorganizes flow. Blood accelerates in the arch and can swirl in the enlargement, forming a vortex. This differs from the smoother, more orderly movement called laminar flow. For comparison, the healthy-flow reference uses a separate healthy aortic anatomy; it does not show Alex\'s aorta. These patterns matter because the vessel wall is exposed to the flow with every heartbeat.',
                    infoPopup: {
                        title: 'laminar flow',
                        text: 'Laminar flow moves in smooth layers, with little mixing or crosswise swirling between them. It can occur in the bloodstream and is an orderly flow that may become turbulent when disturbances grow beyond a critical point.'
                    }
                },
                {
                    type: 'reference',
                    text: 'Data basis: open VMR dataset 0021_H_AO_MFS, case 0129_0000, with CT-based geometry and simulation files. Methods reference: Wilson NM, Ortiz AK, Johnson AB. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. J Med Devices. 2013;7(4):040923. DOI: 10.1115/1.4025983.'
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
                            info: 'Follow-up imaging tracks aortic size and shape over time. Comparing scans helps the care team identify meaningful changes early.'
                        },
                        {
                            eyebrow: 'In the family',
                            title: 'Genetic risk',
                            info: 'Inherited connective-tissue conditions can affect relatives. Genetic counseling and family assessment can help determine who may benefit from follow-up.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Sources: 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease, recommendations on Marfan syndrome, medical therapy, activity, surveillance imaging, and genetic evaluation. DOI: 10.1161/CIR.0000000000001106.'
                }
            ]
        },
        {
            id: 'praevention-marfan',
            title: 'Alex\'s Outlook',
            className: 'alex-outlook-section alex-consultation-section',
            scrollMode: 'sequence',
            columns: '2',
            elements: [
                {
                    type: 'image',
                    src: 'assets/story_images/alex_doctor_talk_photoreal_v1.png',
                    aspect: '3 / 2',
                    alt: 'Alex talks with a doctor about long-term aortic follow-up'
                },
                {
                    type: 'text',
                    text: 'Alex leaves the scan with a plan rather than a final answer. His future depends on regular imaging, attention to warning signs, and decisions made early enough to avoid an emergency. The flow view cannot predict what will happen to him, but it makes the need for careful follow-up easier to understand.'
                },
                {
                    type: 'closingStatement',
                    text: 'The story ends with observation, not certainty.'
                }
            ]
        }
    ]
};
