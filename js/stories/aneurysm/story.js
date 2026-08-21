export const aneurysmStory = {

    title: 'Aortic Aneurysm',
    nav: [
        { href: '#definition', label: 'Definition' },
        { href: '#anatomie', label: 'Anatomy' },
        { href: '#symptome', label: 'Symptoms' },
        { href: '#diagnose', label: 'Diagnosis' },
        { href: '#behandlung', label: 'Treatment' },
        { href: '#prognose', label: 'Prognosis' },
        { href: '#praevention', label: 'Prevention' }
    ],
    sections: [
        {
            id: 'definition',
            title: 'Alex',
            timelineLabel: 'Alex - age 25',
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
                    text: 'Alex is 25 when a known risk becomes a visible finding.'
                },
                {
                    type: 'text',
                    text: 'He lives with Marfan syndrome. This inherited connective tissue disorder can weaken the wall of the aorta and promote enlargement even at a young age.'
                },
                {
                    type: 'text',
                    text: 'From here, the story follows the question that will accompany Alex going forward: Where is his aorta enlarging, how is it changing, and when does observation become treatment?'
                },
                {
                    type: 'stat',
                    icon: 'CT',
                    label: 'Medical basis',
                    text: 'Open Vascular Model Repository dataset: male, 25 years old, Marfan syndrome, CT imaging, and no documented intervention.'
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
                    text: 'Since 1990, the absolute number of deaths has risen markedly. At the same time, the age-standardized mortality rate has fallen. An older and larger world population therefore carries more cases, even though age-adjusted risk is declining.'
                },
                {
                    type: 'aneurysmBurden',
                    title: 'More deaths, lower age-standardized rate',
                    caption: 'Global trend 1990-2021; 2030 is a model projection.'
                },
                {
                    type: 'reference',
                    text: 'Source: Zhuo et al. Global burden of aortic aneurysm and its attributable risk factors from 1990 to 2021, with projections to 2030. Internal and Emergency Medicine, 2025. Data: Global Burden of Disease 2021.'
                }
            ]
        },
        {
            id: 'anatomie',
            title: 'Alex\'s Aorta',
            className: 'model-section alex-aorta-model-section',
            scrollMode: 'sticky',
            inlineModel: {
                url: 'assets/models/alex_aneurysm_aorta.glb',
                label: 'Patient-specific aortic geometry of Alex',
                mode: 'surface',
                legend: false
            },
            elements: [
                {
                    type: 'text',
                    text: 'In Marfan syndrome, the connective tissue of the aortic wall can be weakened. For that reason, shape and diameter are not assessed only once, but compared during regular follow-up.'
                },
                {
                    type: 'reference',
                    text: '3D geometry and case data: Vascular Model Repository 0027_H_AO_MFS. Documented: Marfan syndrome, CT imaging, and no intervention.'
                }
            ]
        },
        {
            id: 'symptome',
            title: 'Long Without Warning Signs',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: ' A central difficulty of thoracic aortic aneurysms is that they often remain asymptomatic for a long time and become visible only through targeted or incidental imaging.'
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            title: 'No symptoms',
                            text: 'Enlargement can exist without being noticeable in everyday life. In Marfan syndrome, regular imaging is therefore more important than waiting for symptoms.'
                        },
                        {
                            title: 'Pressure on neighboring structures',
                            text: 'Depending on location and size, chest or back pain, hoarseness, difficulty swallowing, or shortness of breath may occur.'
                        },
                        {
                            title: 'Acute warning sign',
                            text: 'Sudden severe chest or back pain, fainting, shortness of breath, or neurological deficits may point to dissection or rupture.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Source: ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease (2022), sections on thoracic aneurysms and acute aortic syndromes. No symptoms are documented for Alex.'
                }
            ]
        },
        {
            id: 'diagnose',
            title: 'The Diagnosis',
            className: 'alex-consultation-section',
            columns: '2',
            elements: [
                {
                    type: 'image',
                    src: 'assets/story_images/alex_doctor_talk_photoreal_v1.png',
                    aspect: '3 / 2',
                    alt: 'Alex talks with a doctor about his aorta',
                    caption: 'Fictionalized discussion of findings. The conversation shown is not part of the open dataset.'
                },
                {
                    type: 'text',
                    text: 'In the consultation, the CT scan becomes a long-term task: Alex lives with Marfan syndrome. His aorta must therefore be measured regularly to detect enlargement early and assess its growth.'
                },
                {
                    type: 'stat',
                    icon: 'CT',
                    label: 'Documented finding',
                    text: 'Marfan syndrome, male, 25 years old, CT imaging; no intervention is documented in the open dataset.'
                },
                {
                    type: 'reference',
                    text: 'Source: Vascular Model Repository, Specifications Document 0027_H_AO_MFS, last updated July 24, 2023.'
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
                    text: 'The original CT volume can be viewed from different directions. Two orthogonal views connect the individual cross-section with the spatial course of the aorta.'
                },
                {
                    type: 'imagingComparison',
                    items: [
                        {
                            modality: 'Axial-CT',
                            src: 'assets/story_images/alex_ct_axial.png',
                            alt: 'Axial CT slice through Alex\'s chest with contrast-enhanced aorta in cross-section',
                            caption: 'Axial CT slice. The contrast-enhanced aorta appears as a bright round vessel structure in front of the spine.'
                        },
                        {
                            modality: 'Coronal CT',
                            src: 'assets/story_images/alex_ct_coronal.png',
                            alt: 'Coronal CT reconstruction of Alex\'s chest with heart, ascending aorta, and aortic arch',
                            caption: 'Coronal reconstruction. It shows the course from the heart through the ascending aorta to the supra-aortic branches.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Image source: CT volume OSMSC0176-cm.vti from the Vascular Model Repository 0027_H_AO_MFS; original axial and coronal reconstruction. Case document last updated July 24, 2023.'
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
                    text: 'The patient-specific simulation shows how blood moves through Alex\'s enlarged aorta.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-overview-model',
                    eyebrow: 'Patient-specific simulation',
                    title: 'Flow-Vis - Overall Flow',
                    text: 'Placeholder for the animated GLTF with streamlines and velocity distribution in Alex\'s aortic geometry.'
                },
                {
                    type: 'text',
                    text: 'Follow the acceleration through the arch and the reorganization of flow inside the enlargement.'
                },
                {
                    type: 'reference',
                    text: 'Data basis: open VMR dataset 0027_H_AO_MFS with CT-based geometry and simulation files. The flow visualization is a model calculation, not a direct measurement in Alex\'s body.'
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
                    text: 'A closer view reveals vortices, reverse flow, and changing velocities inside the enlargement.'
                },
                {
                    type: 'modelPlaceholder',
                    id: 'alex-flow-focus-model',
                    eyebrow: 'Detailed view of the same simulation',
                    title: 'Flow-Vis - Aneurysm Focus',
                    text: 'Placeholder for the animated GLTF with a local focus on vortices, flow separation, and near-wall flow.'
                },
                {
                    type: 'text',
                    text: 'These patterns describe the mechanical environment, but they cannot predict growth or treatment timing.'
                },
                {
                    type: 'reference',
                    text: 'Context: second camera perspective of the same patient-specific VMR simulation 0027_H_AO_MFS; no additional examination and no documented follow-up measurement.'
                }
            ]
        },
        {
            id: 'behandlung',
            title: 'Observe or Intervene',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'In Marfan syndrome, treatment begins long before an operation. Medication, blood pressure control, and repeated imaging aim to limit stress on the aortic wall and identify the right time for a planned intervention.'
                },
                {
                    type: 'treatmentDecision',
                    items: [
                        {
                            label: 'Stable finding',
                            treatment: 'Continue monitoring',
                            text: 'If diameter and growth remain unremarkable, therapy and imaging intervals are continued individually.'
                        },
                        {
                            label: 'Growth or additional risk factors',
                            treatment: 'Consult an aortic center earlier',
                            text: 'Rapid growth, a family history of dissection, or unfavorable vessel shape can move the decision earlier.'
                        },
                        {
                            label: 'Surgical threshold reached',
                            treatment: 'Elective replacement',
                            text: 'For the Marfan-associated aortic root, the ACC/AHA guideline recommends planned replacement from 5.0 cm; from 4.5 cm it may be reasonable with additional high-risk features in an experienced center.'
                        }
                    ]
                },
                {
                    type: 'text',
                    text: 'These thresholds cannot be applied to Alex: his open dataset documents neither aortic diameter nor follow-up. The decision graphic therefore explains the general clinical pathway.'
                },
                {
                    type: 'reference',
                    text: 'Source: ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease (2022), sections 6.1.2.2.2 and 6.1.2.2.3. Decisions are patient-specific in a multidisciplinary aortic team.'
                }
            ]
        },
        {
            id: 'behandlung-operation',
            title: 'When Surgery Is Performed',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'The goal of elective intervention is to replace the at-risk aortic root and ascending segment before dissection or rupture occurs. In Marfan syndrome, this is usually open cardiac surgery.'
                },
                {
                    type: 'treatmentSteps',
                    items: [
                        {
                            title: 'Planning',
                            text: 'CT, MRI, and echocardiography determine extent, growth, and aortic valve function. An aortic team discusses timing and procedure.'
                        },
                        {
                            title: 'Aortic root replacement',
                            text: 'The enlarged vessel segment is removed and replaced with a vascular graft; the coronary arteries are reattached.'
                        },
                        {
                            title: 'Valve strategy',
                            text: 'If the patient\'s own aortic valve is suitable, it can be preserved. Otherwise, a valve-containing prosthesis is used.'
                        },
                        {
                            title: 'Continue follow-up',
                            text: 'Even after successful surgery, the remaining aorta still needs monitoring because more distant segments can change later.'
                        }
                    ]
                },
                {
                    type: 'reference',
                    text: 'Source: ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease (2022), recommendations on prophylactic aortic root replacement in Marfan syndrome.'
                }
            ]
        },
        {
            id: 'behandlung-abwaegung',
            title: 'Benefits and Risks',
            scrollMode: 'flow',
            elements: [
                {
                    type: 'text',
                    text: 'A planned intervention shifts the risk: it is meant to prevent a later acute event, but it is itself major surgery. Anatomy, growth, life expectancy, and personal priorities are therefore assessed together.'
                },
                {
                    type: 'treatmentBalance',
                    benefits: [
                        'Prevent Type A dissection and rupture',
                        'Perform the procedure under planned conditions',
                        'Preserve the patient\'s own aortic valve in suitable cases',
                        'Improve long-term prognosis with timely replacement'
                    ],
                    risks: [
                        'Bleeding, infection, or stroke',
                        'Complications involving the coronary arteries or aortic valve',
                        'Lifelong anticoagulation if a mechanical valve is used',
                        'Lifelong monitoring of the remaining aorta'
                    ]
                },
                {
                    type: 'reference',
                    text: 'Context based on ACC/AHA 2022. The graphic explains the general balance and does not claim that Alex underwent an intervention.'
                }
            ]
        },
        {
            id: 'prognose',
            title: 'What Follow-up Can Show',
            className: 'aneurysm-prognosis-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'For a Marfan-associated aneurysm, prognosis cannot be read from one image or one diameter alone. Comparable examinations over time show whether the aortic root or another segment is enlarging and whether the pace of change affects treatment planning.'
                },
                {
                    type: 'diagnosticPath',
                    items: [
                        {
                            title: 'Establish a baseline',
                            text: 'Echocardiography measures the aortic root and ascending aorta. CT or MRI can assess segments that are not seen completely on ultrasound.'
                        },
                        {
                            title: 'Compare like with like',
                            text: 'Follow-up is most useful when the same anatomical landmarks and a consistent measurement method are used.'
                        },
                        {
                            title: 'Look beyond diameter',
                            text: 'Growth rate, family history, aortic shape, valve function, symptoms, and plans such as pregnancy can change the individual risk assessment.'
                        },
                        {
                            title: 'Review the whole aorta',
                            text: 'Marfan syndrome can affect more than the aortic root, so surveillance continues along the remaining thoracic and abdominal aorta.'
                        }
                    ]
                },
                {
                    type: 'text',
                    text: 'Alex\'s open dataset provides a CT-based geometry but no documented diameter series or follow-up outcome. It therefore cannot support a claim about his growth rate or personal rupture risk.'
                },
                {
                    type: 'reference',
                    text: 'Source: 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease, recommendations on Marfan syndrome, surveillance imaging, and prophylactic aortic root surgery. DOI: 10.1161/CIR.0000000000001106. Clinical decisions require an individual assessment by an aortic team.'
                }
            ]
        },
        {
            id: 'praevention',
            title: 'Which Risk Drivers Are Changing',
            className: 'aneurysm-risk-section',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'The share of deaths attributed to smoking fell markedly between 1990 and 2019. The share attributed to high systolic blood pressure decreased less strongly and was slightly higher than smoking by 2019.'
                },
                {
                    type: 'aneurysmRiskDrivers',
                    title: 'The leading attributed risk factor is shifting',
                    caption: 'Share of global aortic aneurysm deaths attributed to each risk factor.'
                },
                {
                    type: 'reference',
                    text: 'Source: Krafcik et al. Changes in global mortality from aortic aneurysm. Journal of Vascular Surgery, 2024. Analysis of Global Burden of Disease data 1990-2019.'
                }
            ]
        },
        {
            id: 'praevention-marfan',
            title: 'Alex\'s Everyday Plan',
            scrollMode: 'sequence',
            elements: [
                {
                    type: 'text',
                    text: 'Marfan syndrome is a genetic disease. Prevention therefore means limiting mechanical stress on the aorta, detecting changes early, and making decisions before an emergency occurs.'
                },
                {
                    type: 'preventionTimeline',
                    items: [
                        {
                            eyebrow: 'Daily',
                            title: 'Blood pressure and medication',
                            text: 'Beta blockers or angiotensin receptor blockers can reduce stress on the aortic root. Selection and dose belong in medical care.'
                        },
                        {
                            eyebrow: 'During activity',
                            title: 'Control exertion individually',
                            text: 'Light to moderate aerobic activity can be useful. Intense isometric strain, breath-holding during effort, and maximal lifting should be avoided or specifically clarified with a physician.'
                        },
                        {
                            eyebrow: 'Over time',
                            title: 'Comparable imaging',
                            text: 'After the baseline examination, growth is usually checked after about six months; if the aorta remains stable, annual imaging is typical in Marfan syndrome.'
                        },
                        {
                            eyebrow: 'In the family',
                            title: 'Discuss genetics',
                            text: 'Marfan syndrome is inherited in an autosomal dominant pattern. Genetic counseling and screening of close relatives can identify other at-risk people early.'
                        },
                        {
                            eyebrow: 'In an emergency',
                            title: 'Take warning signs seriously',
                            text: 'Sudden worst-ever chest or back pain, shortness of breath, fainting, or neurological deficits require immediate medical help.'
                        }
                    ]
                },
                {
                    type: 'closingStatement',
                    text: 'Alex\'s future is not in the dataset. His story therefore ends not with an answer, but with a reliable plan for the next follow-up.'
                },
                {
                    type: 'reference',
                    text: 'Sources: ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease (2022), sections on Marfan syndrome, imaging, medical therapy, and physical activity; VMR dataset 0027_H_AO_MFS.'
                }
            ]
        }
    ]
};

