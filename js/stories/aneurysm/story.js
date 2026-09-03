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
                        text: 'CT angiography uses computed tomography, often with iodinated contrast injected into a vein, to visualize blood vessels. Computer processing combines the scan slices into detailed, freely viewable 3D images.'
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
                            value: 5
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
                    text: 'Alex diagnosis pathway begins with known inherited risk. In Marfan syndrome, the aorta is checked before symptoms appear because enlargement can be silent. Planned imaging measures the aortic diameter over time, then the care team compares it with earlier scans, growth rate, family history, valve findings, and body size.',
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
                            info: 'Marfan syndrome can weaken the connective tissue in the aortic wall. That inherited risk is why Alex needs aortic follow-up even when he feels well.'
                        },
                        {
                            icon: 'event_available_svg',
                            title: 'Surveillance',
                            info: 'Surveillance means planned follow-up visits and imaging. Comparing measurements over time helps the care team see whether the aorta is stable or changing.'
                        },
                        {
                            icon: 'radiology_aorta',
                            title: 'CTA imaging',
                            info: 'CT angiography combines computed tomography with contrast dye to show the aorta clearly. It helps measure the vessel and map its shape.'
                        },
                        {
                            icon: 'compare_svg',
                            title: 'Aortic review',
                            info: 'The team reviews the latest measurement alongside earlier scans, growth rate, family history, valve findings, and body size before deciding what happens next.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Source: 2022 ACC/AHA Aortic Disease Guideline, Marfan imaging and risk assessment recommendations. DOI: 10.1161/CIR.0000000000001106. Alex case: VMR dataset 0021_H_AO_MFS, case 0129_0000.'
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
                    text: 'The CT angiography (CTA) image shows Alex\'s chest from the side. CTA uses computed tomography and contrast dye to make the blood-filled aorta appear bright, helping doctors assess its shape and size.'
                },
                {
                    type: 'image',
                    src: 'assets/story_images/alex_cta_sagittal.png',
                    alt: 'Sagittal CTA image of Alex\'s chest with the thoracic aorta highlighted in red',
                    aspect: '1 / 1',
                    hotspot: {
                        x: '60%',
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
                    text: 'The treatment spectrum is not a timeline. It shows how the current level of risk can shift the decision from continued monitoring toward planned repair. If the aortic diameter and growth remain stable, doctors usually continue surveillance. Faster growth or added risk features can bring Alex to an aortic center earlier. If the point at which treatment is recommended is reached, aortic repair means planned surgery before an emergency occurs. Guidelines for Marfan-associated aortic root disease use diameter thresholds, often 5.0 cm or sometimes 4.5 cm with added risk factors.'
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
                            treatment: 'Continue monitoring'
                        },
                        {
                            icon: 'expand',
                            label: 'Faster growth or added risk',
                            treatment: 'Appointment at an aortic center'
                        },
                        {
                            icon: 'surgical',
                            label: 'Point at which treatment is recommended',
                            treatment: 'Aortic repair'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Source: 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease, recommendations on Marfan syndrome, prophylactic aortic surgery thresholds, surveillance, and risk modifiers. DOI: 10.1161/CIR.0000000000001106. Alex case: VMR dataset 0021_H_AO_MFS, case 0129_0000.'
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
                    text: 'In the aorta, shape and blood flow are tightly connected. The lines you can see on the left show how the blood flows in Alex’s aorta. Color and motion make changes in speed and direction easier to see, especially where the blood vessel widens or curves. This is not a real-time scan of blood inside Alex, but a model built from his anatomy.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-overview-model',
                    src: 'assets/models/flow/aneurysm_lines_anim.glb',
                    flowVariants: [
                        { label: 'Pathlines', src: 'assets/models/flow/aneurysm_lines_anim.glb', framingScale: 0.29, rotationY: 1.5708, animationFps: 20, animationSpeed: 1 },
                        { label: 'Particle flow', src: 'assets/models/flow/aneurysm_particles_anim.glb', framingScale: 0.35, rotationY: 1.5708, animationFps: 20, animationSpeed: 0.5 }
                    ],
                    modelMode: 'flow',
                    preload: true,
                    animationFps: 20,
                    framingScale: 0.3,
                    alt: 'Animated pathlines representing simulated blood flow through Alex\'s Marfan-associated aneurysm model',
                    eyebrow: 'Patient-specific simulation',
                    title: 'Flow-Vis - Overall Flow',
                    rotationHint: true
                },
                {
                    type: 'text',
                    text: 'The important point is not only where the aorta is wide, but how the wider shape reorganizes flow. Blood accelerates in the arch and creates a string swirling flow in the enlargement, called a vortex or turbulent flow. This differs from the organized, straight flow in healthy aortas called laminar flow. Those patterns matter because the vessel wall is exposed to the flow with every heartbeat.',
                    infoPopup: {
                        title: 'laminar flow',
                        text: 'Laminar flow moves in smooth layers, with little mixing or crosswise swirling between them. It can occur in the bloodstream and is an orderly flow that may become turbulent when disturbances grow beyond a critical point.'
                    }
                },
                {
                    type: 'reference',
                    text: 'Data basis: open VMR dataset 0021_H_AO_MFS, case 0129_0000, with CT-based geometry and simulation files. The flow visualization is a model calculation, not a direct measurement in Alex\'s body.'
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
                            title: 'Blood pressure'
                        },
                        {
                            eyebrow: 'With the care team',
                            title: 'Medication'
                        },
                        {
                            eyebrow: 'In activity',
                            title: 'Adapted exertion'
                        },
                        {
                            eyebrow: 'Long term',
                            title: 'Regular imaging'
                        },
                        {
                            eyebrow: 'In the family',
                            title: 'Genetic risk'
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
