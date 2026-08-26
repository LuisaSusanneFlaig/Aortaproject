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
                    alt: 'Portrait of Miriam'
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
                    text: 'Miriam\'s story starts when pain turns a hidden weakness into an emergency. The first task is to understand what has happened inside the vessel wall; the next is to follow how that injured aorta changes over months and years.'
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
                    text: 'Aortic dissection is rare, but when it happens, it changes the situation within minutes. Only a few people out of 100,000 are diagnosed each year, and some cases are missed until after death. The classification helps explain the urgency. Type A involves the first part of the aorta as it leaves the heart and is usually the most immediately dangerous. Type B begins farther down, after the arteries to the head and arms. For Miriam, the key idea is that one tear can create two competing paths for blood.'
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
                label: 'Miriam\'s aorta before the dissection',
                mode: 'surface',
                legend: false
            },
            paragraphs: [],
            elements: [

                {
                    type: 'text',
                    text: 'Before the tear, Miriam\'s aorta can be understood as one continuous vessel with one main open channel for blood, called the lumen. Seeing it as a single surface makes the later change easier to grasp: the emergency is not that a new vessel appears, but that blood forces a new route inside the existing wall.'
                },
                {
                    type: 'text',
                    text: 'When dissection occurs, blood enters through a tear and separates layers of the vessel wall. The original channel is called the true lumen; the new channel inside the wall is called the false lumen. From that moment, the aorta is no longer just a pipe carrying blood downward. It has become a divided pathway.'
                },
                {
                    type: 'reference',
                    text: 'Anatomy and case source: VMR dataset 0246_H_AO_AOD, pre-dissection aortic geometry and follow-up case material; patient course described in Baeumler et al., IEEE TBME 2025, DOI 10.1109/TBME.2024.3480362.'
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
                    text: 'Miriam\'s pain fits a pattern doctors are trained to take seriously. Many people with acute Type B dissection report severe chest or back pain, often beginning suddenly. High blood pressure is also common. Migrating pain means the pain seems to move as the tear extends along the aorta. A fainting episode, a normal heart tracing, or a normal chest X-ray cannot safely rule the disease in or out, so symptoms are only the first clue.'
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
                    text: 'From the first suspicion, the team has to move quickly. They ask whether Miriam has risk factors such as Marfan syndrome or known aortic disease. They examine the pattern of pain, pulses, blood pressure differences, and signs from the brain or limbs. A lab test may include D-dimer, a blood marker that rises when clots are being broken down; in carefully selected low-risk patients it can help rule out dissection, but it cannot prove the diagnosis. The decisive step is imaging. ECG-gated CT is timed to the heartbeat, reducing motion blur so the tear, its length, and possible complications can be seen.'
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
                    text: 'The images make the tear visible. CT angiography, or CTA, is a CT scan taken while contrast dye fills the blood space of the aorta. In Miriam\'s case it shows a Type B dissection starting just after the left subclavian artery and extending toward the diaphragm. The red overlay marks the reconstructed vessel wall. The 4D-flow MRI image comes from a flexible physical model built from the same anatomy, so it shows flow behavior in a controlled experiment rather than a direct scan inside Miriam\'s body.'
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
                    text: 'Treatment depends on how stable the situation is right now. If pain and blood pressure are controlled and the organs are still receiving blood, care usually begins with medication, close monitoring, and repeat imaging. If complications appear, doctors may need to redirect flow with an endovascular repair, often called TEVAR. TEVAR places a stent graft inside the aorta through blood vessels, usually without opening the chest.'
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
                    ]
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
                    text: 'After the acute event, Miriam\'s aorta carries blood through two spaces instead of one. The original channel is the true lumen; the new channel inside the wall is the false lumen. The moving particles trace simulated blood flow through both channels, making clear that the dissection is not only a line on an image. It changes the route of circulation.'
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
                    text: 'Some paths are faster, other zones are slower, and parts of the flow swirl. These patterns can change the forces on the vessel wall. They do not tell us exactly what will happen to Miriam, but they explain why blood movement still matters after the first emergency has passed.'
                },
                {
                    type: 'reference',
                    text: 'Context: patient-specific simulation based on the subacute CTA anatomy. The flow shown is a model calculation, not a direct measurement in Miriam\'s body. Source: Zimmermann et al. (2023), DOI 10.1038/s41598-023-49942-0.'
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
                    text: 'For Miriam, prevention means protecting an aorta that has already been injured. Blood pressure control reduces force on the wall. Rehabilitation helps her return to activity in a supervised way. Dosed activity means exercise is adapted so blood pressure does not spike unpredictably. Whole-aorta imaging means CT or MRI follow-up checks the entire vessel, not only the first tear. Genetic risk matters because Marfan syndrome can affect family members too.'
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
                    text: 'Miriam\'s future cannot be decided from one scan or one simulation. What remains after the emergency is a long relationship with follow-up care. The aorta is a living vessel, its shape can change, and blood flow can keep influencing the wall long after the first tear.'
                },
                {
                    type: 'closingStatement',
                    text: 'The story ends with follow-up, not certainty.'
                }
            ]
        }
    ]
};
