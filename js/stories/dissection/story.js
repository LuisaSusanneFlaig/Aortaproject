const flowModelBase = 'assets/models/flow/optimized/';

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
            title: 'Dissection Story',
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
                    text: 'Miriam lives with Marfan syndrome. This condition can weaken connective tissue, including the wall of the aorta: the large artery that carries blood from the heart to the body. Her story begins when the inner lining of that artery tears. Blood then pushes into the wall itself and creates a second channel. This is called an aortic dissection, and it can be life-threatening.',
                    infoPopup: {
                        title: 'Marfan syndrome',
                        text: 'Marfan syndrome is an inherited connective-tissue condition, often caused by changes in the FBN1 gene. Because connective tissue helps support the aortic wall, the aorta can gradually widen and is monitored over time. The condition can affect several body systems and varies from person to person.'
                    }
                },
                {
                    type: 'text',
                    text: 'The first task is to understand what has happened inside the vessel wall; the next is to follow how that injured aorta changes over months and years.'
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
                    text: 'Aortic dissection is rare, but rarity does not make it insignificant. It is a condition in which a small number of cases can have extremely serious consequences. Symptoms can resemble those of other conditions, and some dissections may initially go undetected. What happens next depends strongly on where the dissection begins. Type A involves the first part of the aorta as it leaves the heart and usually requires immediate treatment. Type B begins farther down, beyond the arteries leading to the head, and may follow a different treatment path. This makes aortic dissection an important example of how a single anatomical difference can fundamentally change a medical situation.'
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
            title: 'Healthy Anatomy',
            scrollMode: 'sticky',
            timelineLabel: 'Before the event',
            className: 'model-section miriam-aorta-model-section',
            inlineModel: {
                url: 'assets/models/miriam_pre_dissection_aorta.gltf',
                label: 'Miriam\'s aorta before the dissection',
                mode: 'surface',
                legend: false,
                rotationX: -1.5,
                rotationY: 0.2,
                rotationZ: Math.PI / 2,
                framingScale: 0.9,
                rotationHint: true
            },
            paragraphs: [],
            elements: [

                {
                    type: 'text',
                    text: 'Before the tear, Miriam\'s aorta is one continuous vessel with a single channel for blood. Seeing it as one surface makes the later change easier to grasp: the emergency is not that a new vessel appears, but that blood forces a second route inside the existing wall.'
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
                    text: ' Many people with acute Type B dissection report severe chest or back pain, often beginning suddenly. High blood pressure is also common. Migrating pain means the pain seems to move as the tear extends along the aorta. A fainting episode, a normal heart tracing, or a normal chest X-ray cannot safely rule the disease in or out, so symptoms are only the first clue.'
                },
                {
                    type: 'symptomBars',
                    subtitle: '1,891 of 5,638 acute dissections',
                    items: [
                        { icon: 'bolt', label: 'Severe or worst-ever pain', value: 88.7, color: '#c83c48', info: 'A sudden, severe pain in the chest or back is an important warning sign. It can feel different from usual pain and needs urgent medical assessment.' },
                        { icon: 'rib_cage', label: 'Chest or back pain', value: 88.7, color: '#c83c48', info: 'Pain can be felt in the chest, back, or both. Its location alone cannot confirm a dissection, but it helps clinicians decide how urgently to investigate.' },
                        { icon: 'acute', label: 'Sudden onset', value: 85.4, color: '#c83c48', info: 'Dissection pain often begins abruptly. A sudden onset is a clinical clue, but other conditions can also cause sudden pain.' },
                        { icon: 'blood_pressure', label: 'High blood pressure', value: 64.6, color: '#c83c48', info: 'High blood pressure can increase stress on the aortic wall. A normal reading does not rule out dissection, especially after pain or treatment has changed the pressure.' },
                        { icon: 'hand_bones', label: 'Migrating pain', value: 16.8, color: '#c83c48', info: 'Migrating pain can move from the chest toward the back or abdomen as the dissection extends. This pattern is a clue, not a diagnosis by itself.' }
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
                    text: 'A suspected dissection is an emergency, so assessment and imaging happen quickly. The team asks when the pain began and whether Miriam has Marfan syndrome or known aortic disease, checks blood pressure and pulses in the limbs, and looks for signs that blood flow to the brain, kidneys, gut, or legs may be affected. These clues help judge urgency but cannot confirm the diagnosis. In selected people with a low likelihood of dissection, a D-dimer blood test may help rule it out; it is not used alone and a positive result does not prove a tear. CT angiography is usually the key test: it shows where the tear begins, how far the split extends, and whether branch arteries or organs may be affected.',
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
                            info: 'Miriam’s Marfan syndrome is an inherited risk factor clinicians consider when assessing sudden chest or back pain.'
                        },
                        {
                            icon: 'monitor_heart_svg',
                            title: 'Assessment',
                            info: 'Clinicians compare blood pressure and pulse strength between limbs and check for new weakness, confusion, fainting, or a painful or cool limb. A difference can suggest that a branch artery is affected, but normal findings do not rule out dissection.'
                        },
                        {
                            icon: 'labs_svg',
                            title: 'Lab tests',
                            info: 'Blood tests can include D-dimer and tests of organ function. D-dimer may help rule out dissection only in selected low-risk cases; it cannot confirm the diagnosis, and other illnesses can raise it.'
                        },
                        {
                            icon: 'radiology_aorta',
                            title: 'Aortic imaging',
                            info: 'CTA images the aorta and its major branches. The team looks for the wall flap and both channels, maps how far they extend, measures the aorta, and checks whether blood flow to organs is reduced or there are signs of bleeding.'
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
                    text: 'For a CT angiogram (CTA), contrast is injected through a small tube in a vein while a fast CT scanner takes many thin X-ray images. The contrast makes blood inside the aorta visible. From the image slices, clinicians can follow the vessel through the chest and abdomen, identify the flap separating the two channels, measure the aorta, and check the branch vessels. The red marking was added during image editing to highlight Miriam\'s Type B dissection; it was not red in the original scan.'
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
            id: 's13',
            title: 'Current-risk decision spectrum',
            scrollMode: 'sequence',
            timelineLabel: 'Acute',
            className: 'miriam-treatment-infographic-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'Treatment depends on whether the dissection is causing complications. For an uncomplicated Type B dissection, the first step is usually hospital care with medicine to lower heart rate and blood pressure, pain relief, and close checks of pulses, organ function, and repeat images. If blood flow to an organ is reduced, the aorta is enlarging or leaking, pain persists, or blood pressure cannot be controlled, the team may recommend repair. TEVAR places a fabric-covered support (stent graft) inside the aorta through an artery, usually in the groin, to cover the main tear and redirect blood. It is not suitable for every anatomy or every person; Marfan syndrome and other connective-tissue conditions can affect whether an endovascular repair or open surgery is preferred.',
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
                            info: 'If there is no rupture, organ blood-flow problem, ongoing severe pain, or uncontrolled blood pressure, treatment generally begins with medicines in hospital. The team controls heart rate and blood pressure, treats pain, watches organ function, and repeats imaging to check for change.'
                        },
                        {
                            icon: 'medical_services',
                            label: 'Complicated Type B',
                            treatment: 'Aortic treatment',
                            info: 'A blocked branch artery, reduced blood supply to an organ, bleeding or rupture, ongoing pain, or blood pressure that remains high despite treatment can make the dissection complicated. The aortic team then weighs urgent repair options, including TEVAR or open surgery, based on anatomy and connective-tissue disease.'
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
            id: 's11',
            title: 'After the Acute Event',
            scrollMode: 'sticky',
            timelineLabel: '+1.5 months',
            className: 'flow-research-section miriam-flow-section',
            paragraphs: [],
            elements: [
                {
                    type: 'text',
                    text: 'After the acute event, this simulation shows how blood moves through both channels of Miriam\'s dissected aorta. It illustrates how the tear changes the route of circulation.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'flow-vis-subacute',
                    src: `${flowModelBase}dissection_lines_anim.glb`,
                    flowVariants: [
                        { label: 'Pathlines', src: `${flowModelBase}dissection_lines_anim.glb`, framingScale: 0.75, rotationY: -1.5708, animationFps: 20, animationSpeed: 1 },
                        { label: 'Particle flow', src: `${flowModelBase}dissection_particles_anim.glb`, framingScale: 0.35, rotationY: -1.5708, animationFps: 20, animationSpeed: 0.5 },
                        { label: 'Healthy laminar flow · pathlines', src: `${flowModelBase}healthy_lines_anim.glb`, framingScale: 0.29, rotationY: -1.5708, animationFps: 20, animationSpeed: 1, showInfoPopup: false },
                        { label: 'Healthy laminar flow · particles', src: `${flowModelBase}healthy_particle_anim.glb`, framingScale: 0.35, rotationY: -1.5708, animationFps: 20, animationSpeed: 0.5, showInfoPopup: false }
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
                        title: 'About this simulation',
                        text: 'Miriam\'s dissected aorta is reconstructed from medical imaging and divided into a computational mesh that includes both channels. Software calculates blood movement through that geometry, including how blood enters the aorta and leaves through its branches. The calculated results are then rendered as a 3D animation; color and motion help show flow direction and relative speed. This is simulated data, not blood recorded in the body or a prediction of Miriam\'s individual outcome.'
                    }
                },
                {
                    type: 'text',
                    text: 'Flow speed and direction vary across the vessel, and swirling areas may change the forces on the wall. For comparison, the healthy-flow reference uses a separate healthy aortic anatomy to illustrate general laminar flow; it does not represent Miriam\'s dissected aorta. This patient-specific model cannot predict Miriam\'s individual outcome, but it shows why blood movement still matters after the first emergency.'
                },
                {
                    type: 'reference',
                    text: 'Context: patient-specific simulation based on the subacute CTA anatomy. Source: Zimmermann et al. (2023), DOI 10.1038/s41598-023-49942-0. Methods reference: Wilson NM, Ortiz AK, Johnson AB. The Vascular Model Repository: A Public Resource of Medical Imaging Data and Blood Flow Simulation Results. J Med Devices. 2013;7(4):040923. DOI: 10.1115/1.4025983.'
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
                    text: 'After the emergency, care shifts to lowering the chance of further aortic problems and finding change early. Long-term blood-pressure and heart-rate medicines reduce strain on the wall; the care team adjusts them to the person and checks for side effects. Repeat imaging—often CTA or MRI—looks for enlargement or other changes in the dissected area and the rest of the aorta. Activity is usually returned to gradually, with a clinician or rehabilitation team advising what level is appropriate and which heavy straining to avoid. Because Miriam has Marfan syndrome, follow-up is lifelong and close relatives may be offered genetic counseling and aortic assessment.'
                },
                {
                    type: 'preventionTimeline',
                    items: [
                        {
                            eyebrow: 'Today',
                            title: 'Blood pressure',
                            info: 'Long-term medicine is commonly used to keep blood pressure and heart rate under control, reducing the force of each heartbeat on the aorta. The exact targets and medicines are set by Miriam\'s clinicians; she should not change a dose without them.'
                        },
                        {
                            eyebrow: 'After the acute phase',
                            title: 'Rehabilitation',
                            info: 'Once the acute phase is over, a supervised program can help rebuild stamina and confidence step by step. The team adapts the plan to symptoms, blood pressure, imaging, and any treatment she received.'
                        },
                        {
                            eyebrow: 'In everyday life',
                            title: 'Dosed activity',
                            info: 'Gentle, regular activity may be encouraged, while sudden maximal effort and heavy straining can cause sharp blood-pressure rises. Safe activities and intensity vary; Miriam\'s aortic team should give advice for her situation.'
                        },
                        {
                            eyebrow: 'Long term',
                            title: 'Regular imaging',
                            info: 'After a dissection treated with medicine alone, guideline follow-up commonly includes CT or MRI at about 1, 6, and 12 months, then yearly if stable. The schedule can change with findings. Imaging checks the dissected segment and the remaining aorta for enlargement or new problems.'
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
