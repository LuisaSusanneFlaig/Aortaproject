export const dissectionStory = {

    title: 'Aortic Dissection',
    nav: [
        { href: '#definition-statistics', label: 'Definition' },
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
                    text: 'Miriam lives with Marfan syndrome. This condition can weaken connective tissue, including the wall of the aorta: the large artery that carries blood from the heart to the body. Her story begins when the inner lining of that artery tears. Blood then pushes into the wall itself. This is called an aortic dissection.'
                },
                {
                    type: 'text',
                    text: 'The portrait introduces a fictional character, but the medical shape comes from an open dataset. The VMR 0246_H_AO_AOD case follows a female Marfan patient with CT images before and after an acute dissection, and then through years of follow-up. The visuals in this story use that record to show how the vessel changes over time.'
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
                    text: 'This section gives the scale of the disease before Miriam\'s case becomes personal. The dot graphic shows that acute aortic dissection is uncommon: only a few people out of 100,000 are diagnosed each year, and some cases may be missed until after death. The branching graphic explains the main classification. Type A involves the first part of the aorta as it leaves the heart and is usually more immediately dangerous. Type B begins farther down, after the arteries to the head and arms. The key idea for the rest of the story is that one tear can create two competing paths for blood.'
                },
                {
                    type: 'aorticStat',
                    variant: 'incidence',
                    title: 'Rare - and partly hidden'
                },
                {
                    type: 'aorticStat',
                    variant: 'split',
                    title: 'Two paths after the same tear'
                },
                {
                    type: 'reference',
                    text: 'Context sources: Gouveia e Melo et al.; Kurz et al.; Wundram et al.; Obel et al.; Smedberg et al.; clinical guideline summaries.'
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
                    text: 'The 3D model shows Miriam\'s aorta before the dissection. A healthy aorta is a flexible tube with layered walls. The inner layer touches the blood, the middle layer gives strength, and the outer layer supports the vessel. When those layers stay together, blood has one open channel, called the lumen.'
                },
                {
                    type: 'text',
                    text: 'A dissection changes that simple tube into a split pathway. Blood enters through a tear in the inner layer and separates the wall from the inside. The original channel is called the true lumen; the new channel inside the wall is called the false lumen. The model helps orient the viewer before the later flow visuals show blood moving through both spaces.'
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
                    text: 'The symptom graphic turns clinical warning signs into a quick visual checklist. Many people with acute Type B dissection report severe chest or back pain, often starting suddenly. High blood pressure is also common. Migrating pain means the pain seems to move as the tear extends along the aorta. A fainting episode, a normal heart tracing, or a normal chest X-ray cannot safely rule the disease in or out, so symptoms are only the first clue.'
                },
                {
                    type: 'symptomBars',
                    title: 'Acute Type B Dissection',
                    subtitle: 'IRAD: 1,891 of 5,638 acute dissections',
                    items: [
                        { icon: 'warning', label: 'Severe or worst-ever pain', value: 88.7, color: '#c83c48' },
                        { icon: 'monitor_heart', label: 'Chest or back pain', value: 88.7, color: '#c83c48' },
                        { icon: 'warning', label: 'Sudden onset', value: 85.4, color: '#c83c48' },
                        { icon: 'blood_pressure', label: 'High blood pressure', value: 64.6, color: '#c83c48' },
                        { icon: 'route', label: 'Migrating pain', value: 16.8, color: '#c83c48' }
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
                    text: 'The numbered diagnostic graphic shows how doctors move from suspicion to proof. First they ask whether the patient has risk factors, such as Marfan syndrome or known aortic disease. Then they examine the pattern of pain, pulses, blood pressure differences, and signs from the brain or limbs. Lab tests may include D-dimer, a blood marker that rises when clots are being broken down; it can sometimes help rule out dissection in carefully selected low-risk cases, but it cannot confirm the diagnosis. The final step is imaging. ECG-gated CT is timed to the heartbeat, which reduces motion blur and shows the tear, its length, and complications.'
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            icon: 'warning',
                            title: 'Risk'
                        },
                        {
                            icon: 'monitor_heart',
                            title: 'Assessment'
                        },
                        {
                            icon: 'biotech',
                            title: 'Lab tests'
                        },
                        {
                            icon: 'radiology',
                            title: 'Aortic imaging'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Sources: S2k guideline on Type B aortic dissection (2022), chapter 5; POSTPRINT review on acute aortic dissection.'
                }
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
                    text: 'These two images explain where the diagnosis comes from and how it becomes a flow model. CT angiography, or CTA, is a CT scan taken while contrast dye makes the blood-filled aorta visible. In Miriam\'s case it shows a Type B dissection starting just after the left subclavian artery and extending toward the diaphragm. The red overlay marks the digital vessel wall. The 4D-flow MRI image is different: it was measured in a flexible physical model built from the same anatomy, so it shows flow behavior in a controlled model rather than a direct scan inside Miriam\'s body.'
                },
                {
                    type: 'imagingComparison',
                    items: [
                        {
                            modality: 'CTA',
                            src: 'assets/story_images/miriam_cta_wall_overlay.jpg',
                            alt: 'Coronal CTA image of the patient-specific Type B aortic dissection with red digital wall segmentation'
                        },
                        {
                            modality: '4D-flow MRI',
                            src: 'assets/story_images/miriam_4d_flow_mri.jpg',
                            alt: '4D-flow MRI streamlines in the original Type B dissection model with true and false lumen'
                        }
                    ]
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
            className: 'miriam-treatment-infographic-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'The treatment spectrum summarizes the first major decision, but it is not a timeline. It shows the current urgency of the situation. On the lower-urgency side, if pain and blood pressure are controlled and organs are still receiving blood, treatment usually focuses on medication, monitoring, and repeat imaging. On the higher-urgency side, if complications appear, doctors may need to redirect flow with an endovascular repair, often called TEVAR. TEVAR places a stent graft inside the aorta through blood vessels, usually without opening the chest.'
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
                            label: 'Uncomplicated Type B',
                            treatment: 'Medical therapy'
                        },
                        {
                            icon: 'medical_services',
                            label: 'Complicated Type B',
                            treatment: 'Endovascular treatment'
                        }
                    ],
                    caption: 'The arrow shows clinical urgency at the current assessment, not progression through time.'
                },
                {
                    type: 'reference',
                    text: 'Source: S2k guideline on Type B aortic dissection (2022), chapters 6 and 7. Miriam reference: VMR dataset 0246_H_AO_AOD.'
                }
            ]
        },
        {
            id: 's11',
            title: 'After the Acute Event',
            scrollMode: 'sticky',
            timelineLabel: '+1.5 months',
            className: 'flow-research-section miriam-flow-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'The flow visualization now shows what the diagnosis means mechanically. The tear has divided the aorta into a true lumen, the original channel, and a false lumen inside the wall. The moving particles represent simulated blood flow through both channels. They help the viewer see that the dissection is not just a line on an image; it changes how blood travels.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'flow-vis-subacute',
                    src: 'assets/models/flow/miriam-particles-points.glb',
                    modelMode: 'flow',
                    animationFps: 20,
                    alt: 'Animated particle paths representing flow through the aortic model',
                    eyebrow: '+1.5 months',
                    title: 'Flow-Vis - Subacute Phase'
                },
                {
                    type: 'text',
                    text: 'Faster paths, slower zones, and swirling motion are easier to notice in the animation than in a still scan. These patterns can change the forces on the vessel wall. The model does not tell us exactly what will happen to Miriam, but it explains why flow matters after the acute event.'
                },
                {
                    type: 'reference',
                    text: 'Context: patient-specific simulation based on the subacute CTA anatomy. The flow shown is a model calculation, not a direct measurement in Miriam\'s body. Source: Zimmermann et al. (2023), DOI 10.1038/s41598-023-49942-0.'
                }
            ]
        },
        {
            id: 's12',
            title: 'Long-term Remodeling',
            scrollMode: 'sticky',
            timelineLabel: '+36 / +64 months',
            className: 'flow-research-section miriam-flow-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'The chronic-phase visual moves the story from the emergency to long-term follow-up. Months and years later, the true and false lumen can remain separated. If the false lumen stays open, blood may continue to move through it instead of the vessel healing into one stable channel.'
                },
                {
                    type: 'text',
                    text: 'The animated spheres show simulated flow in the remodeled aorta after the vessel has changed shape. Follow-up imaging records that parts of the aorta enlarge over time. In plain terms, the wall is still adapting to the split pathway, and the visual helps connect that changing shape with the movement of blood.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'flow-vis-chronic',
                    src: 'assets/models/flow/miriam-particles-spheres.glb',
                    modelMode: 'flow',
                    animationFps: 15,
                    alt: 'Animated spherical particles representing long-term flow through the aortic model',
                    eyebrow: '+36 / +64 months',
                    title: 'Flow-Vis - Chronic Remodeling'
                },
                {
                    type: 'text',
                    text: 'Slow or circulating flow can be a sign that blood is lingering in parts of the vessel. That may matter for long-term enlargement, but this model is not a personal forecast. It is a way to inspect one possible mechanical explanation for why follow-up remains important.'
                },
                {
                    type: 'reference',
                    text: 'Patient course: Baeumler et al., IEEE TBME 2025, DOI 10.1109/TBME.2024.3480362; VMR dataset 0246_H_AO_AOD.'
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
                    text: 'The prevention infographic turns long-term care into five everyday goals. Blood pressure control reduces force on the injured wall. Rehabilitation helps a person return to activity in a supervised way. Dosed activity means exercise is adapted so blood pressure does not spike unpredictably. Whole-aorta imaging means CT or MRI follow-up checks the entire vessel, not only the first tear. Genetic risk matters because Marfan syndrome can affect family members too.'
                },
                {
                    type: 'preventionTimeline',
                    items: [
                        {
                            eyebrow: 'Today',
                            title: 'Blood pressure'
                        },
                        {
                            eyebrow: 'After the acute phase',
                            title: 'Rehabilitation'
                        },
                        {
                            eyebrow: 'In everyday life',
                            title: 'Dosed activity'
                        },
                        {
                            eyebrow: 'Long term',
                            title: 'Whole-aorta imaging'
                        },
                        {
                            eyebrow: 'In the family',
                            title: 'Genetic risk'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Sources: S2k guideline on Type B aortic dissection (AWMF 004-034, 2022), chapters on rehabilitation and follow-up; ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease (2022), recommendations on imaging, genetics, and family screening.'
                }
            ]
        },
        {
            id: 's18',
            title: 'Miriam\'s Outlook',
            scrollMode: 'sequence',
            timelineLabel: 'Outlook',
            className: 'miriam-consultation-section',
            columns: '2',
            paragraphs: [],
            elements: [
                {
                    type: 'image',
                    src: 'assets/story_images/miriam_consultation_photoreal_v1.png',
                    aspect: '3 / 2',
                    alt: 'Miriam discusses long-term aortic follow-up with a physician'
                },
                {
                    type: 'text',
                    text: 'The final image returns from the model to the patient story. Miriam\'s future cannot be decided from one scan or one simulation. What the visuals have shown is why follow-up is necessary: the aorta is a living vessel, its shape can change, and blood flow can keep influencing the wall long after the first emergency.'
                },
                {
                    type: 'closingStatement',
                    text: 'The story ends with follow-up, not certainty.'
                }
            ]
        }
    ]
};
