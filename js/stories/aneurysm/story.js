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
            title: 'Alex',
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
                    text: 'Alex lives with Marfan syndrome, an inherited condition that can weaken connective tissue. The aorta, the large artery that carries blood away from the heart, depends on strong connective tissue in its wall. When that wall stretches and widens, the enlargement is called an aortic aneurysm.'
                },
                {
                    type: 'text',
                    text: 'His story begins before an emergency. A planned scan turns an invisible risk into a shape doctors can measure, compare, and follow. From there, the central question is simple: when is careful observation enough, and when should treatment be discussed before the vessel becomes unstable?'
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
                    text: 'Before Alex\'s scan becomes personal, the statistics set the wider scene. More people worldwide are dying with aortic aneurysm than in earlier decades, partly because populations are growing and aging. At the same time, the age-standardized death rate has fallen, which means the risk after adjusting for age has improved. The values for 2030 are projections, not measurements. Alex\'s story then narrows this global picture to one vessel, one body, and one set of decisions.'
                },
                {
                    type: 'aneurysmBurden',
                    title: 'More deaths, lower age-standardized rate'
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
                legend: false
            },
            elements: [
                {
                    type: 'text',
                    text: 'Alex\'s aorta is not a textbook diagram. Its shape comes from CT imaging, where the vessel wall can be reconstructed as a three-dimensional surface. In Marfan syndrome, doctors follow that shape over time because a weakened wall can widen gradually. A single scan matters, but the trend matters even more: diameter, growth, and location are compared across follow-up visits.'
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
                    text: 'The difficult part of a thoracic aortic aneurysm is that it can stay quiet for a long time. Clinical sources describe most people as having no symptoms before an acute event; one review gives roughly 95% without warning signs and about 5% with symptoms beforehand. If the widened vessel presses on nearby structures, it may cause chest or back pain, hoarseness, trouble swallowing, or shortness of breath. Sudden severe pain, fainting, breathlessness, or neurological symptoms can signal dissection or rupture. For Alex, the important clue is imaging rather than pain.'
                },
                {
                    type: 'symptomBars',
                    title: 'Typical warning pattern',
                    subtitle: 'Thoracic aortic aneurysm',
                    items: [
                        {
                            icon: 'monitor_heart',
                            label: 'No symptoms',
                            value: 95
                        },
                        {
                            icon: 'warning',
                            label: 'Symptoms before acute event',
                            value: 5
                        }
                    ],
                    note: 'Alex has no documented symptoms; these percentages are general context, not a personal prediction.'
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
                    text: 'Alex does not enter the story through sudden pain. His diagnosis pathway begins with known inherited risk. In Marfan syndrome, the aorta is checked before symptoms appear because enlargement can be silent. Planned imaging measures the aortic diameter over time, then the care team compares it with earlier scans, growth rate, family history, valve findings, and body size.'
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            icon: 'genetics',
                            title: 'Known Marfan risk'
                        },
                        {
                            icon: 'calendar_month',
                            title: 'Planned surveillance'
                        },
                        {
                            icon: 'radiology',
                            title: 'CT or MRI measurement'
                        },
                        {
                            icon: 'monitor_heart',
                            title: 'Aortic team review'
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
            title: 'CT Imaging',
            className: 'evidence-section alex-imaging-section',
            scrollMode: 'comparison',
            elements: [
                {
                    type: 'text',
                    text: 'The CT images let doctors look at Alex\'s chest from more than one direction. CT, or computed tomography, creates cross-sectional X-ray images, and contrast dye makes the blood-filled aorta appear bright. In the axial view, the body is seen as a horizontal slice, with the aorta appearing as a round bright structure in front of the spine. In the coronal view, the body is seen from the front, so the heart, ascending aorta, arch, and head-and-arm branches can be followed together.'
                },
                {
                    type: 'imagingComparison',
                    items: [
                        {
                            modality: 'Axial-CT',
                            src: 'assets/story_images/alex_ct_axial_0021.png',
                            alt: 'Axial CT slice through Alex\'s chest with contrast-enhanced aorta in cross-section'
                        },
                        {
                            modality: 'Coronal CT',
                            src: 'assets/story_images/alex_ct_coronal_0021.png',
                            alt: 'Coronal CT reconstruction of Alex\'s chest with heart, ascending aorta, and aortic arch'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Image source: CT volume OSMSC0129-cm.vti from the Vascular Model Repository 0021_H_AO_MFS, case 0129_0000; axial and coronal reconstructions exported from the original VTI volume.'
                }
            ]
        },
        {
            id: 'behandlung',
            title: 'Observe or Intervene',
            className: 'alex-treatment-infographic-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'The treatment spectrum is not a timeline. It shows how the current level of risk can shift the decision from continued monitoring toward planned repair. If the aortic diameter and growth remain stable, doctors usually continue surveillance. Faster growth or added risk features can bring Alex to an aortic center earlier. If a treatment threshold is reached, elective replacement means planned surgery before an emergency occurs. Guidelines for Marfan-associated aortic root disease use diameter thresholds, often 5.0 cm or sometimes 4.5 cm with added risk factors, but Alex\'s dataset does not include a diameter series or documented treatment.'
                },
                {
                    type: 'treatmentDecision',
                    variant: 'decisionMap',
                    title: 'Current-risk decision spectrum',
                    axisStart: 'Lower urgency',
                    axisEnd: 'Higher urgency',
                    items: [
                        {
                            icon: 'monitor_heart',
                            label: 'Stable diameter and growth',
                            treatment: 'Continue monitoring'
                        },
                        {
                            icon: 'radiology',
                            label: 'Faster growth or added risk',
                            treatment: 'Earlier aortic center review'
                        },
                        {
                            icon: 'medical_services',
                            label: 'Treatment threshold reached',
                            treatment: 'Elective replacement'
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
                    text: 'In the enlarged aorta, shape and movement belong together. The streamlines trace how blood may travel through Alex\'s CT-based vessel geometry. Color and motion make changes in speed and direction easier to see, especially where the vessel widens or curves. This is not a real-time scan of blood inside Alex, but a model built from his anatomy.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-overview-model',
                    src: 'assets/models/flow/marfan_lines_animation_fixed_optimized_s60.glb',
                    modelMode: 'flow',
                    animationFps: 20,
                    framingScale: 0.3,
                    alt: 'Animated pathlines representing simulated blood flow through Alex\'s Marfan-associated aneurysm model',
                    eyebrow: 'Patient-specific simulation',
                    title: 'Flow-Vis - Overall Flow'
                },
                {
                    type: 'text',
                    text: 'The important point is not only where the aorta is wide, but how the wider shape reorganizes movement. Blood can accelerate through curved regions and then spread or swirl inside the enlargement. Those patterns matter because the vessel wall is exposed to the flow with every heartbeat.'
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
                },
                {
                    type: 'reference',
                    text: 'Sources: ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease (2022), sections on Marfan syndrome and surveillance imaging; VMR dataset 0021_H_AO_MFS, case 0129_0000.'
                }
            ]
        }
    ]
};
