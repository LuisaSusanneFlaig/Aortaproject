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
                    alt: 'Portrait of Alex',
                    caption: 'Alex is a fictional character based on an open aortic dataset on Marfan syndrome.'
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
                    text: 'The portrait is fictional, but the anatomy now comes from the open VMR 0021_H_AO_MFS dataset. It documents case 0129_0000, an 18-year-old male Marfan patient with CT imaging and simulation data. The visuals use that case to ask a beginner-friendly question: what does the enlarged vessel look like, how does blood move through it, and when might doctors keep watching versus treating?'
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
                    text: 'This chart gives context before Alex\'s individual anatomy appears. The left plot shows that the absolute number of deaths linked to aortic aneurysm has increased globally. The right plot shows that the age-standardized death rate has gone down, meaning the risk after adjusting for age has decreased. The 2030 values are projections, not measurements. The chart is background: the rest of the story focuses on how one person\'s aortic shape changes blood flow.'
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
                    text: 'The 3D model shows Alex\'s aorta as a patient-specific surface. Instead of looking at a textbook vessel, the viewer sees the actual shape reconstructed from CT data. In Marfan syndrome, doctors watch the aorta over time because a weakened wall can enlarge gradually. Shape and diameter are therefore compared across follow-up visits, not judged from one view alone.'
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
                    text: 'The symptom infographic explains why thoracic aortic aneurysms can be hard to notice. External clinical sources describe most people with thoracic aneurysm as having no symptoms; one review states that only about 5% have symptoms before an acute event, while the other 95% may first become aware of the disease when a serious complication happens. If an aneurysm does press on nearby structures, it can cause chest or back pain, hoarseness, swallowing difficulty, or shortness of breath. Sudden severe pain, fainting, shortness of breath, or neurological symptoms can warn of dissection or rupture. No symptoms are documented for Alex, so imaging is the main clue in his dataset.'
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
                    text: 'The two CT images show the same body from different directions. CT, or computed tomography, creates cross-sectional X-ray images. Contrast dye makes the blood-filled aorta appear bright. The axial view is like looking at a horizontal slice through the chest; the aorta appears as a round bright structure in front of the spine. The coronal view is like looking from the front; it shows the heart, the ascending aorta, the arch, and the branches that supply the head and arms.'
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
                    ],
                    caption: 'The arrow shows clinical urgency at the current assessment, not progression through time.'
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
                    text: 'After the clinical decision frame, the flow visualization shows why Alex\'s vessel shape matters mechanically. The simulation uses Alex\'s CT-based aortic shape as the container for moving streamlines. These lines represent the path blood may take through the enlarged vessel. Color and motion help show where flow speeds up, slows down, or changes direction. This is not a scan of blood inside Alex in real time; it is a model built from his anatomy.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-overview-model',
                    src: 'assets/models/flow/alex-marfan-pathlines-many.glb',
                    modelMode: 'flow',
                    animationFps: 20,
                    alt: 'Animated pathlines representing simulated blood flow through Alex\'s Marfan-associated aneurysm model',
                    eyebrow: 'Patient-specific simulation',
                    title: 'Flow-Vis - Overall Flow'
                },
                {
                    type: 'text',
                    text: 'As you follow the animation, the important point is not only where the aorta is wide, but how the wider shape reorganizes movement. Blood can accelerate through curved regions and then spread or swirl inside the enlargement. That mechanical environment is what the application wants the viewer to inspect.'
                },
                {
                    type: 'reference',
                    text: 'Data basis: open VMR dataset 0021_H_AO_MFS, case 0129_0000, with CT-based geometry and simulation files. The flow visualization is a model calculation, not a direct measurement in Alex\'s body.'
                }
            ]
        },
        {
            id: 'alex-flow-focus',
            title: 'Inside the Enlarged Segment',
            className: 'flow-research-section alex-flow-section',
            scrollMode: 'sticky',
            elements: [
                {
                    type: 'text',
                    text: 'The close-up view explains the flow terms used in the visual. A vortex is a swirling pattern. Reverse flow means some blood briefly moves opposite the main direction. Flow separation means the stream pulls away from the wall instead of staying smooth along it. Near-wall flow matters because the vessel wall is the tissue that may continue to stretch.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-focus-model',
                    src: 'assets/models/flow/alex-marfan-pathlines-sparse.glb',
                    modelMode: 'flow',
                    animationFps: 20,
                    alt: 'Animated sparse pathlines showing focused simulated blood flow inside Alex\'s enlarged aortic segment',
                    eyebrow: 'Detailed view of the same simulation',
                    title: 'Flow-Vis - Aneurysm Focus'
                },
                {
                    type: 'text',
                    text: 'These patterns help describe the forces acting inside the enlarged segment. They do not predict Alex\'s future by themselves. Doctors still need measurements, symptoms, family history, and follow-up imaging before deciding whether observation is enough or treatment should be discussed.'
                },
                {
                    type: 'reference',
                    text: 'Context: second camera perspective of the same patient-specific VMR simulation from 0021_H_AO_MFS, case 0129_0000; no additional examination and no documented follow-up measurement.'
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
                    text: 'The prevention infographic keeps the focus on Alex rather than returning to population statistics. Marfan syndrome itself cannot be prevented, but stress on the aortic wall can be reduced and dangerous changes can be caught earlier. The main goals are blood pressure control, medication when prescribed, adapted activity, regular imaging, and family or genetic care because inherited aortic risk can affect relatives too.'
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
                    text: 'The final image returns from the simulation to the patient conversation. Alex\'s future is not contained in the dataset. What remains is the practical outlook: regular imaging, attention to warning signs, and decisions made early enough to avoid an emergency. The flow visual does not predict his future, but it gives a clearer way to see why the enlarged vessel needs careful follow-up.'
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
