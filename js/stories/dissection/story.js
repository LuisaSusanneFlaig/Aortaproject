export const dissectionStory = {

    title: 'Aortic Dissection',
    nav: [
        { href: '#s1', label: 'Definition' },
        { href: '#s2', label: 'Anatomy' },
        { href: '#s8', label: 'Symptoms' },
        { href: '#s9', label: 'Diagnosis' },
        { href: '#s13', label: 'Treatment' },
        { href: '#s11', label: 'Prognosis' },
        { href: '#s17', label: 'Prevention' }
    ],
    sections: [
        {
            id: 's1',
            title: 'Miriam',
            scrollMode: 'sticky',
            timelineLabel: 'Miriam - age 25',
            className: 'story-intro',
            columns: '2',
            paragraphs: [],
            elements: [
                {
                    type: 'image',
                    src: 'assets/story_images/miriam_portrait_photoreal_v1.png',
                    eyebrow: 'Patient story',
                    aspect: '4 / 5',
                    alt: 'Portrait of Miriam',
                    caption: 'Miriam is a fictional character based on an open aortic dissection dataset.'
                },
                {
                    type: 'pullQuote',
                    text: 'Miriam is 25 when the pain begins.'
                },
                {
                    type: 'text',
                    text: 'She lives with Marfan syndrome, a connective tissue disorder that can make the aorta more vulnerable. In her case, the inner layer of the main artery tears: an aortic dissection.'
                },
                {
                    type: 'text',
                    text: 'What follows is not a single diagnosis, but a long-term story. Her aorta is followed for years: before the dissection, shortly afterward, and into the chronic phase.'
                },
                {
                    type: 'stat',
                    icon: 'CT',
                    label: 'Medical basis',
                    text: 'Open dataset: female patient with Marfan syndrome, acute aortic dissection, and CT follow-up over seven years.'
                }
            ]
        },
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
                    text: 'Aortic dissection is rare. Because not every case is recognized during life, routine data may underestimate how often it truly occurs.'
                },
                {
                    type: 'aorticStat',
                    variant: 'incidence',
                    title: 'Rare - and partly hidden',
                    caption: 'Routine estimates are about 4-6 acute aortic dissections per 100,000 people per year. Data that include autopsy findings may be higher.'
                },
                {
                    type: 'aorticStat',
                    variant: 'split',
                    title: 'Two paths after the same tear',
                    caption: 'The Stanford classification distinguishes dissections by whether the ascending aorta is involved. Population-based cohorts show roughly 60-65 percent Type A and 35-40 percent Type B, with higher early mortality in Type A.'
                }
            ]
        },
        {
            id: 's2',
            title: 'Healthy Anatomy',
            scrollMode: 'sticky',
            timelineLabel: 'Before the event',
            className: 'model-section',
            inlineModel: {
                url: 'assets/models/miriam_pre_dissection_aorta.gltf',
                label: 'Miriam\'s aorta before the dissection'
            },
            paragraphs: [],
            elements: [

                {
                    type: 'text',
                    text: 'The vessel wall has three layers. The intima lies on the inside, the strong media in the middle, and the adventitia on the outside. As long as these layers hold together, blood flows through a single lumen.'
                },
                {
                    type: 'text',
                    text: 'In an aortic dissection, blood enters the vessel wall through a tear. This creates a second, false channel alongside the normal blood pathway.'
                },
                {
                    type: 'stat',
                    icon: 'A',
                    label: 'Orientation',
                    text: 'The aorta runs from the heart through the aortic arch, chest, and abdomen. Imaging shows which section is affected by the dissection.'
                }
            ]
        },
        {
            id: 's3',
            title: 'Causes',
            scrollMode: 'flow',
            timelineLabel: 'Predisposition',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'In Miriam, several layers come together: a vulnerable vessel wall, a sudden tear, and blood flow that continues to remodel the aorta afterward. Together, they form a cause-and-effect chain.'
                }
            ]
        },
        {
            id: 's8',
            title: 'Clinical Symptoms',
            scrollMode: 'sequence',
            timelineLabel: 'Acute',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Medically, these signs typically raise suspicion of an acute aortic dissection.'
                },
                {
                    type: 'symptomBars',
                    title: 'Acute Type B Dissection',
                    subtitle: 'IRAD: 1,891 of 5,638 acute dissections',
                    items: [
                        { label: 'Severe or worst-ever pain', value: 88.7, color: '#c83c48' },
                        { label: 'Chest or back pain', value: 88.7, color: '#c83c48' },
                        { label: 'Sudden onset', value: 85.4, color: '#c83c48' },
                        { label: 'High blood pressure', value: 64.6, color: '#c83c48' },
                        { label: 'Migrating pain', value: 16.8, color: '#c83c48' }
                    ],
                    note: 'Syncope was observed in 2-6%. A normal ECG or chest X-ray does not rule out dissection.'
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
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'No single observation makes the diagnosis. Risk profile, symptoms, examination, and laboratory findings together determine how quickly the aorta must be assessed with imaging.'
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            title: 'Recognize risk',
                            text: 'Marfan syndrome, family history, or known aortic disease increase the pre-test probability.'
                        },
                        {
                            title: 'Clinical assessment',
                            text: 'Pain onset, pulses, blood pressure differences, and neurological deficits are examined deliberately.'
                        },
                        {
                            title: 'Interpret lab tests',
                            text: 'D-dimer can help rule out dissection in suitable low-risk settings, but it does not confirm the diagnosis.'
                        },
                        {
                            title: 'Image the aorta',
                            text: 'ECG-gated CT angiography shows the tear, its extent, and possible complications.'
                        }
                    ]
                },
                {
                    type: 'stat',
                    icon: 'Lab',
                    label: 'D-Dimer',
                    text: 'Sensitivity is about 94-95%; specificity in the cited cohorts is about 57-69%. The test is therefore not standalone proof.'
                },
                {
                    type: 'stat',
                    icon: 'CT',
                    label: 'Key imaging',
                    text: 'The S2k guideline names ECG-gated multislice CT as the most important examination for diagnosis and treatment planning.'
                },
                {
                    type: 'reference',
                    text: 'Sources: S2k guideline on Type B aortic dissection (2022), chapter 5; POSTPRINT review on acute aortic dissection.'
                }
            ]
        },
        {
            id: 's9-consultation',
            title: 'Discussing the Findings',
            className: 'miriam-consultation-section',
            columns: '2',
            elements: [
                {
                    type: 'image',
                    src: 'assets/story_images/miriam_consultation_photoreal_v1.png',
                    aspect: '3 / 2',
                    alt: 'Miriam discusses imaging of her aorta with a physician',
                    caption: 'Fictionalized discussion of findings. The conversation shown is not part of the open dataset.'
                },
                {
                    type: 'text',
                    text: 'In the consultation, symptoms and measurements become concrete images. The physician explains which part of Miriam\'s aorta is affected and why the entire vessel path now needs careful assessment.'
                },

            ]
        },
        {
            id: 's10',
            title: 'Imaging',
            scrollMode: 'comparison',
            timelineLabel: 'Acute - CTA',
            className: 'evidence-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'In CT angiography, suspicion becomes a concrete diagnosis: Miriam has an acute, uncomplicated Type B aortic dissection.'
                },
                {
                    type: 'stat',
                    icon: 'A',
                    label: 'Extent',
                    text: 'From the segment just behind the left subclavian artery to just below the diaphragm.'
                },
                {
                    type: 'stat',
                    icon: 'CT',
                    label: 'Entry and exit',
                    text: 'The entry tear lies just behind the left subclavian artery; the exit tear is above the origin of the celiac artery.'
                },
                {
                    type: 'imagingComparison',
                    items: [
                        {
                            modality: 'CTA',
                            src: 'assets/story_images/miriam_cta_wall_overlay.jpg',
                            alt: 'Coronal CTA image of the patient-specific Type B aortic dissection with red digital wall segmentation',
                            caption: 'Patient-specific CTA. The red structure is the overlaid digital wall model.'
                        },
                        {
                            modality: '4D-flow MRI',
                            src: 'assets/story_images/miriam_4d_flow_mri.jpg',
                            alt: '4D-flow MRI streamlines in the original Type B dissection model with true and false lumen',
                            caption: 'In-vitro MRI in the perfused original model. FL = false lumen, TL = true lumen.'
                        }
                    ]
                },
                {
                    type: 'text',
                    text: 'The CTA shows the patient-specific anatomy. For 4D-flow MRI, a flexible model was built from the same subacute Type B anatomy and examined in a controlled flow circuit. The MRI image is therefore a flow measurement in the model, not a direct scan of Miriam.'
                },
                {
                    type: 'reference',
                    text: 'Image source: Zimmermann et al., Scientific Reports 2023, figs. 1 and 3, DOI 10.1038/s41598-023-49942-0, CC BY 4.0. Patient reference: Baeumler et al. (2025) and VMR dataset 0246_H_AO_AOD.'
                }
            ]
        },
        {
            id: 's13',
            title: 'Acute Treatment',
            scrollMode: 'sequence',
            timelineLabel: 'Acute',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Treatment begins as soon as the diagnosis is made. The focus is effective pain control and controlled lowering of blood pressure and heart rate. This reduces mechanical stress on the injured aortic wall.'
                },
                {
                    type: 'heading',
                    text: 'The findings determine the path'
                },
                {
                    type: 'treatmentDecision',
                    items: [
                        {
                            label: 'Uncomplicated Type B dissection',
                            treatment: 'Medical therapy',
                            text: 'Close clinical monitoring, consistent blood pressure control, and repeated imaging. This matches the initially documented management for Miriam.'
                        },
                        {
                            label: 'Complicated Type B dissection',
                            treatment: 'Endovascular treatment',
                            text: 'In cases of rupture, reduced organ perfusion, persistent pain, or uncontrolled blood pressure, TEVAR is pursued in suitable patients.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Source: S2k guideline on Type B aortic dissection (2022), chapters 6 and 7. Miriam reference: VMR dataset 0246_H_AO_AOD.'
                }
            ]
        },
        {
            id: 's14',
            title: 'How TEVAR Works',
            scrollMode: 'sequence',
            timelineLabel: 'Treatment',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'TEVAR stands for Thoracic Endovascular Aortic Repair. A stent graft is advanced through an artery in the groin into the thoracic aorta. The prosthesis supports the aorta from the inside and covers the proximal entry tear.'
                },
                {
                    type: 'treatmentSteps',
                    items: [
                        { title: 'Access', text: 'A catheter guides the folded stent graft through the iliac arteries to the aorta.' },
                        { title: 'Positioning', text: 'The prosthesis is aligned so that it securely covers the relevant entry tear.' },
                        { title: 'Deployment', text: 'The stent graft opens and creates a new, stable flow path in the true lumen.' },
                        { title: 'Remodeling', text: 'Inflow into the false lumen may decrease; thrombosis and regression are encouraged.' }
                    ]
                },
                {
                    type: 'image',
                    src: 'assets/story_images/tevar_before_after_v1.png',
                    eyebrow: 'Treatment - TEVAR',
                    alt: 'Medical before-and-after illustration of a Type B aortic dissection before and after TEVAR',
                    caption: 'Left: dissected aorta with true and false lumen. Right: the stent graft covers the proximal entry tear, stabilizes the true lumen, and reduces inflow into the false lumen.'
                },
                {
                    type: 'reference',
                    text: 'Original medical illustration based on the TEVAR principle described in the S2k guideline on Type B aortic dissection (2022). The image explains the general procedure and does not claim that Miriam underwent an intervention.'
                }
            ]
        },
        {
            id: 's15',
            title: 'Benefits and Risks',
            scrollMode: 'flow',
            timelineLabel: 'Decision',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'The decision for an intervention is a balance. The goal is not only to technically seal a tear, but also to maintain stable organ perfusion and support favorable long-term remodeling of the aorta.'
                },
                {
                    type: 'treatmentBalance',
                    benefits: [
                        'Sealing the proximal entry tear',
                        'Stabilizing the true lumen',
                        'Improving threatened organ perfusion',
                        'Chance of favorable aortic remodeling'
                    ],
                    risks: [
                        'Endoleak or persistent perfusion of the false lumen',
                        'Vessel injury or stroke',
                        'Spinal ischemia with neurological deficits',
                        'Further follow-up and possible reinterventions'
                    ]
                },
                {
                    type: 'reference',
                    text: 'Source: S2k guideline on Type B aortic dissection (2022), recommendations on endovascular therapy and follow-up.'
                }
            ]
        },
        {
            id: 's11',
            title: 'Course',
            scrollMode: 'sticky',
            timelineLabel: '+1.5 months',
            className: 'flow-research-section miriam-flow-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'The tears divide blood flow between Miriam\'s true and false lumen.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'flow-vis-subacute',
                    src: 'assets/models/flow/miriam-particles-points.glb',
                    modelMode: 'flow',
                    animationFps: 20,
                    alt: 'Animated particle paths representing flow through the aortic model',
                    eyebrow: '+1.5 months',
                    title: 'Flow-Vis - Subacute Phase',
                    text: 'Animated particle paths visualize flow through the model of the true and false lumen.'
                },
                {
                    type: 'text',
                    text: 'The simulation reveals how velocity and vortices differ between the two channels.'
                },
                {
                    type: 'reference',
                    text: 'Context: patient-specific simulation based on the subacute CTA anatomy. The flow shown is a model calculation, not a direct measurement in Miriam\'s body. Source: Zimmermann et al. (2023), DOI 10.1038/s41598-023-49942-0.'
                }
            ]
        },
        {
            id: 's12',
            title: 'Chronic Phase',
            scrollMode: 'sticky',
            timelineLabel: '+36 / +64 months',
            className: 'flow-research-section miriam-flow-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'At 36 and 64 months, the true and false lumen remain separated and the false lumen remains open.'
                },
                {
                    type: 'text',
                    text: 'Imaging records gradual and eventually marked enlargement: the vessel is still remodeling.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'flow-vis-chronic',
                    src: 'assets/models/flow/miriam-particles-spheres.glb',
                    modelMode: 'flow',
                    animationFps: 15,
                    alt: 'Animated spherical particles representing long-term flow through the aortic model',
                    eyebrow: '+36 / +64 months',
                    title: 'Flow-Vis - Chronic Remodeling',
                    text: 'Animated spherical particles visualize long-term flow through the remodeled vessel model.'
                },
                {
                    type: 'text',
                    text: 'Slow and recirculating flow may contribute to enlargement, but the model cannot predict Miriam\'s individual course.'
                },
                {
                    type: 'reference',
                    text: 'Patient course: Baeumler et al., IEEE TBME 2025, DOI 10.1109/TBME.2024.3480362; VMR dataset 0246_H_AO_AOD.'
                }
            ]
        },
        {
            id: 's17',
            title: 'The Aorta Remains a Lifelong Task',
            scrollMode: 'sequence',
            timelineLabel: 'Long term',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'After an aortic dissection, prevention does not mean eliminating every risk. It aims to reduce stress on the aorta, detect changes early, and prevent further complications as much as possible.'
                },
                {
                    type: 'preventionTimeline',
                    items: [
                        {
                            eyebrow: 'Today',
                            title: 'Control blood pressure',
                            text: 'Take prescribed medication regularly and define the personal target range together with the treatment team.'
                        },
                        {
                            eyebrow: 'After the acute phase',
                            title: 'Use rehabilitation',
                            text: 'Vascular rehabilitation helps assess physical capacity and blood pressure response in a controlled way.'
                        },
                        {
                            eyebrow: 'In everyday life',
                            title: 'Dose exertion',
                            text: 'Physical activity is adapted individually. The goal is regular activity without uncontrolled blood pressure peaks.'
                        },
                        {
                            eyebrow: 'Long term',
                            title: 'Monitor the entire aorta',
                            text: 'CT or MRI follow-up is performed according to a physician-defined plan and should be acquired and measured as consistently as possible.'
                        },
                        {
                            eyebrow: 'In the family',
                            title: 'Clarify genetic risk',
                            text: 'In Marfan syndrome, genetic counseling and screening of first-degree relatives are important parts of preventive care.'
                        }
                    ]
                },
                {
                    type: 'closingStatement',
                    text: 'Prevention here means controlling stress, detecting changes early, and acting in time.'
                },
                {
                    type: 'reference',
                    text: 'Sources: S2k guideline on Type B aortic dissection (AWMF 004-034, 2022), chapters on rehabilitation and follow-up; ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease (2022), recommendations on imaging, genetics, and family screening.'
                }
            ]
        }
    ]
};
