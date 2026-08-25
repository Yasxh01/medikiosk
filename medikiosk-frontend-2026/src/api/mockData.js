export const mockPrakritiQuestions = [
  {
    id: 'pq_1',
    category: 'Physical Frame & Weight Gain Tendency',
    question: 'How would you describe your natural body build and weight tendency?',
    options: [
      { id: 'v1', dosha: 'VATA', text: 'Thin, light frame, difficult to gain weight, prominent joints' },
      { id: 'p1', dosha: 'PITTA', text: 'Medium, athletic, stable weight, prone to sweating' },
      { id: 'k1', dosha: 'KAPHA', text: 'Broad, sturdy build, gains weight easily, difficult to lose' },
    ]
  },
  {
    id: 'pq_2',
    category: 'Skin & Hair Characteristics',
    question: 'What is the baseline texture of your skin and hair?',
    options: [
      { id: 'v2', dosha: 'VATA', text: 'Dry, rough, cool skin; thin or frizzy hair prone to split ends' },
      { id: 'p2', dosha: 'PITTA', text: 'Warm, oily T-zone, reddish tone; early greying or thinning hair' },
      { id: 'k2', dosha: 'KAPHA', text: 'Smooth, soft, oily skin; thick, dark, and lustrous hair' },
    ]
  },
  {
    id: 'pq_3',
    category: 'Digestion & Appetite (Agni)',
    question: 'How does your digestive system and daily appetite behave?',
    options: [
      { id: 'v3', dosha: 'VATA', text: 'Irregular (Visham Agni) - fluctuating hunger, bloating, gas' },
      { id: 'p3', dosha: 'PITTA', text: 'Intense (Tikshna Agni) - sharp hunger, prone to acidity if meals delayed' },
      { id: 'k3', dosha: 'KAPHA', text: 'Slow & Steady (Manda Agni) - modest appetite, heavy post-meal feeling' },
    ]
  },
  {
    id: 'pq_4',
    category: 'Climate & Weather Tolerance',
    question: 'Which weather condition causes you the greatest physical discomfort?',
    options: [
      { id: 'v4', dosha: 'VATA', text: 'Cold, windy, and dry weather' },
      { id: 'p4', dosha: 'PITTA', text: 'Hot, humid summer sun and direct heat' },
      { id: 'k4', dosha: 'KAPHA', text: 'Cold, damp, cloudy, and wet weather' },
    ]
  }
];

export const mockDoctorQueue = [
  {
    id: 'PAT-901',
    tokenNumber: 'EMERG-001',
    name: 'Ramesh Sharma',
    age: 52,
    gender: 'Male',
    abhaId: 'ABHA-9921-4820-1102',
    arrivalTime: '09:42 AM',
    urgency: 'RED_FLAG',
    mode: 'ALLOPATHY',
    llmVerdict: {
      workingImpression: 'Acute Coronary Syndrome (Suspected NSTEMI) with Vascular Dyslipidemia',
      confidenceScore: 96.4,
      urgencyLevel: 'CRITICAL_STAT',
      riskScore: { name: 'HEART Score', score: '7 / 10', level: 'HIGH_RISK' },
      differentialDiagnoses: [
        { condition: 'Acute Non-ST Elevation Myocardial Infarction (NSTEMI)', probability: 78, reasoning: 'Severe retrosternal crushing pain radiating to left arm & jaw with diaphoresis in patient with prior LAD stent.' },
        { condition: 'Unstable Angina Pectoris (Braunwald Class III)', probability: 16, reasoning: 'Persistent rest pain worsening on exertion; requires immediate serial troponin ruling.' },
        { condition: 'Gastroesophageal Reflux with Esophageal Spasm', probability: 6, reasoning: 'Retrosternal location, but classical radicular signs and diaphoresis strongly favor cardiac etiology.' }
      ],
      clinicalEvidence: [
        'SOCRATES: 8/10 crushing retrosternal pressure radiating to left arm, neck, and jaw with diaphoresis.',
        'OCR Discharge Summary: Prior anterior wall ischemia with PTCA stent to LAD in 2021.',
        'OCR Lab Panel: HbA1c 8.4% (Uncontrolled Glycemia) & LDL 168 mg/dL (Atherogenic dyslipidemia).'
      ],
      recommendedOrders: [
        'STAT 12-Lead Electrocardiogram (ECG) within 10 minutes',
        'High-Sensitivity Cardiac Troponin-I (hs-cTnI) at 0h and 3h',
        'Emergency Cardiology Bedside Consultation',
        'Chewable Aspirin 300mg + Clopidogrel 300mg loading dose per protocol'
      ],
      icd10Codes: ['I21.4 (Acute NSTEMI)', 'I25.10 (Atherosclerotic CAD)', 'E78.5 (Dyslipidemia)']
    },
    summary: {
      chiefComplaint: { text: 'Acute retrosternal crushing chest pain radiating to left arm', tag: 'stated' },
      socrates: {
        site: { text: 'Retrosternal chest', tag: 'stated' },
        onset: { text: 'Sudden onset within last 2 hours', tag: 'stated' },
        character: { text: 'Crushing heavy pressure', tag: 'stated' },
        radiation: { text: 'Radiates to left arm, neck, and jaw', tag: 'stated' },
        associations: { text: 'Diaphoresis and shortness of breath', tag: 'stated' },
        timing: { text: 'Continuous since morning; worsens on minimal exertion', tag: 'stated' },
        exacerbating: { text: 'Physical movement worsens pain; no relief on rest', tag: 'stated' },
        severity: { text: '8 / 10', tag: 'stated' }
      },
      pastMedical: { text: 'Prior anterior wall ischemia (stent in LAD, 2021)', tag: 'stated' },
      allergies: { text: 'No known drug allergies reported', tag: 'inferred' },
      familyHistory: { text: 'Father had early CAD at age 50', tag: 'stated' },
      reviewOfSystems: { text: 'No syncope, no palpitations reported', tag: 'missing' }
    },
    prakriti: null,
    documents: [
      {
        id: 'doc_1',
        name: 'Fortis_Discharge_Summary_2021.pdf',
        date: '2021-11-12',
        diagnoses: ['Coronary Artery Disease', 'Post-PTCA to LAD'],
        medications: ['Ecosprin 75mg OD', 'Atorvastatin 40mg HS', 'Metoprolol 25mg BD'],
        abnormalLabs: []
      },
      {
        id: 'doc_2',
        name: 'Lab_Report_Lipid_Profile.pdf',
        date: '2026-03-01',
        diagnoses: ['Dyslipidemia'],
        medications: [],
        abnormalLabs: [
          { test: 'HbA1c', value: '8.4%', normalRange: '4.0 - 5.6%', status: 'HIGH' },
          { test: 'LDL Cholesterol', value: '168 mg/dL', normalRange: '< 100 mg/dL', status: 'HIGH' }
        ]
      }
    ],
    mockFhir: {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: '2026-08-22T09:42:00Z',
      entry: [
        { resource: { resourceType: 'Composition', status: 'preliminary', title: 'Pre-Consultation Clinical Intake' } },
        { resource: { resourceType: 'Condition', code: { text: 'Acute Chest Pain' }, verificationStatus: 'provisional' } },
        { resource: { resourceType: 'MedicationStatement', status: 'active', medicationCodeableConcept: { text: 'Ecosprin 75mg' } } }
      ]
    }
  },
  {
    id: 'PAT-902',
    tokenNumber: 'AYUSH-102',
    name: 'Sunita Devi',
    age: 46,
    gender: 'Female',
    abhaId: 'ABHA-3310-7712-9014',
    arrivalTime: '09:50 AM',
    urgency: 'ROUTINE',
    mode: 'AYURVEDA',
    llmVerdict: {
      workingImpression: 'Sandhivata (Degenerative Knee Osteoarthritis) with Vata-Ama Lakshana & Hyperuricemia',
      confidenceScore: 94.2,
      urgencyLevel: 'ROUTINE',
      riskScore: { name: 'Kellgren-Lawrence', score: 'Grade II', level: 'MODERATE' },
      differentialDiagnoses: [
        { condition: 'Sandhivata (Primary Knee Osteoarthritis)', probability: 82, reasoning: 'Crepitus, morning stiffness (Stambha) resolving after activity, cold climate aggravation, Vata-Pitta Prakriti.' },
        { condition: 'Amavata (Rheumatoid / Inflammatory Joint Arthropathy)', probability: 12, reasoning: 'Associated Vishama Agni and post-meal heaviness indicative of Ama accumulation.' },
        { condition: 'Vatarakta (Gouty Joint Arthritis)', probability: 6, reasoning: 'Elevated Serum Uric Acid (7.2 mg/dL) noted on laboratory profile.' }
      ],
      clinicalEvidence: [
        'SOCRATES: Bilateral knee joint dull ache, morning stiffness, cold weather exacerbation.',
        'Prakriti Assessment: Vata (50%) - Pitta (35%) dominance with Vishama Agni.',
        'OCR Documents: Knee X-Ray shows medial joint space narrowing; Serum Uric Acid is 7.2 mg/dL.'
      ],
      recommendedOrders: [
        'Deepana-Pachana protocol (Panchakola Phanta) to clear Ama',
        'Sthanika Janu Abhyanga with Mahanarayana Taila followed by Nadi Sweda',
        'Serum Rheumatoid Factor (RF) & Anti-CCP antibody titration',
        'Dietary modification: Purine restriction & avoid cold-heavy foods'
      ],
      icd10Codes: ['M17.0 (Bilateral Primary Knee Osteoarthritis)', 'E79.0 (Hyperuricemia)']
    },
    summary: {
      chiefComplaint: { text: 'Chronic bilateral knee joint pain with severe morning stiffness and Vishama Agni', tag: 'stated' },
      socrates: {
        site: { text: 'Bilateral knee joints and lower back', tag: 'stated' },
        onset: { text: 'Gradual onset over past 6 months', tag: 'stated' },
        character: { text: 'Dull ache with stiffness (Stambha)', tag: 'stated' },
        radiation: { text: 'No radiation to lower extremities', tag: 'stated' },
        associations: { text: 'Post-meal heaviness (Gaurava), constipation', tag: 'stated' },
        timing: { text: 'Aggravated in early morning and rainy/cold climate', tag: 'stated' },
        exacerbating: { text: 'Cold water exposure, heavy dairy foods', tag: 'stated' },
        severity: { text: '5 / 10', tag: 'stated' }
      },
      pastMedical: { text: 'No prior surgeries', tag: 'stated' },
      allergies: { text: 'Penicillin allergy noted', tag: 'stated' },
      familyHistory: { text: 'Mother had severe osteoarthritis', tag: 'inferred' },
      reviewOfSystems: { text: 'No fever or sudden weight loss', tag: 'missing' }
    },
    prakriti: {
      dominant: 'Vata-Pitta',
      scores: { VATA: 50, PITTA: 35, KAPHA: 15 },
      agni: 'Visham Agni (Irregular Digestive Capacity)',
      koshtha: 'Krura Koshtha (Hard bowel tendency)',
      recommendation: 'Deepana-Pachana drugs indicated to clear Ama before Shamana'
    },
    documents: [
      {
        id: 'doc_3',
        name: 'Knee_XRay_Bilateral.pdf',
        date: '2025-10-10',
        diagnoses: ['Grade II Osteoarthritis (Sandhivata signs)'],
        medications: ['Shallaki 500mg BD', 'Yograj Guggulu 2 tabs BD'],
        abnormalLabs: [
          { test: 'Serum Uric Acid', value: '7.2 mg/dL', normalRange: '2.4 - 6.0 mg/dL', status: 'HIGH' }
        ]
      }
    ],
    mockFhir: {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: '2026-08-22T09:50:00Z',
      entry: [
        { resource: { resourceType: 'Composition', status: 'preliminary', title: 'AYUSH Dashavidha Intake Summary' } },
        { resource: { resourceType: 'Condition', code: { text: 'Sandhivata / Amavata' }, verificationStatus: 'provisional' } }
      ]
    }
  },
  {
    id: 'PAT-903',
    tokenNumber: 'OPD-305',
    name: 'Ananya Sengupta',
    age: 28,
    gender: 'Female',
    abhaId: 'ABHA-7182-9904-1234',
    arrivalTime: '10:05 AM',
    urgency: 'ROUTINE',
    mode: 'ALLOPATHY',
    llmVerdict: {
      workingImpression: 'Episodic Migraine with Typical Visual Aura (ICHD-3 1.2.1)',
      confidenceScore: 97.8,
      urgencyLevel: 'ROUTINE',
      riskScore: { name: 'MIDAS Score', score: 'Grade II (Moderate)', level: 'MODERATE' },
      differentialDiagnoses: [
        { condition: 'Migraine with Visual Aura', probability: 88, reasoning: 'Classic scintillating scotoma preceding unilateral throbbing headache, photophobia, and positive maternal history.' },
        { condition: 'Tension-Type Headache with Secondary Eye Strain', probability: 8, reasoning: 'Screen trigger present, but pulsating nature and nausea favor migraine.' },
        { condition: 'Cluster Headache', probability: 4, reasoning: 'Unilateral retro-orbital site, but duration (6-12h) and lack of autonomic rhinorrhea exclude classic cluster.' }
      ],
      clinicalEvidence: [
        'SOCRATES: Right fronto-temporal pulsating pain (7/10), nausea, photophobia, visual aura.',
        'Family History: Maternal chronic migraines confirmed.',
        'OCR Documents: Brain MRI is completely normal (excludes secondary intracranial pathology).'
      ],
      recommendedOrders: [
        'Acute abortive therapy: Triptan (Zolmitriptan 2.5mg) at aura onset',
        'Prophylactic assessment: Consider Topiramate or Propranolol if frequency exceeds 4 attacks/month',
        'Headache diary logging via digital PHR',
        'Screen ergonomics and blue-light filter prescription'
      ],
      icd10Codes: ['G43.109 (Migraine with aura, not intractable)']
    },
    summary: {
      chiefComplaint: { text: 'Throbbing unilateral hemicranial headache with visual scintillating scotoma', tag: 'stated' },
      socrates: {
        site: { text: 'Right fronto-temporal cranial region', tag: 'stated' },
        onset: { text: 'Began 4 hours ago following visual aura', tag: 'stated' },
        character: { text: 'Pulsatile and throbbing', tag: 'stated' },
        radiation: { text: 'Radiates to retro-orbital right eye', tag: 'stated' },
        associations: { text: 'Nausea, photophobia, and phonophobia', tag: 'stated' },
        timing: { text: 'Episodes occur 2-3 times per month, lasts 6-12 hours', tag: 'stated' },
        exacerbating: { text: 'Bright screen light and loud sounds worsen; dark room relieves', tag: 'stated' },
        severity: { text: '7 / 10', tag: 'stated' }
      },
      pastMedical: { text: 'Episodic migraine without aura diagnosed in 2022', tag: 'stated' },
      allergies: { text: 'NKDA (No Known Drug Allergies)', tag: 'stated' },
      familyHistory: { text: 'Maternal history of chronic migraines', tag: 'stated' },
      reviewOfSystems: { text: 'No neck rigidity, no motor weakness', tag: 'stated' }
    },
    prakriti: null,
    documents: [
      {
        id: 'doc_4',
        name: 'Brain_MRI_Screening.pdf',
        date: '2024-05-18',
        diagnoses: ['Normal Brain MRI • No intracranial space-occupying lesion'],
        medications: ['Naproxen 500mg SOS', 'Zolmitriptan 2.5mg PRN'],
        abnormalLabs: []
      }
    ],
    mockFhir: {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: '2026-08-22T10:05:00Z',
      entry: [
        { resource: { resourceType: 'Composition', status: 'final', title: 'Neurological OPD Intake' } },
        { resource: { resourceType: 'Condition', code: { text: 'Migraine with Aura' }, verificationStatus: 'confirmed' } }
      ]
    }
  },
  {
    id: 'PAT-904',
    tokenNumber: 'OPD-306',
    name: 'Mohammed Farooq',
    age: 61,
    gender: 'Male',
    abhaId: 'ABHA-4419-5502-8871',
    arrivalTime: '10:15 AM',
    urgency: 'ROUTINE',
    mode: 'ALLOPATHY',
    llmVerdict: {
      workingImpression: 'Diabetic Distal Sensorimotor Polyneuropathy (DSPN) & Stage 2 Chronic Kidney Disease',
      confidenceScore: 95.6,
      urgencyLevel: 'ROUTINE',
      riskScore: { name: 'TCNS (Toronto Neuropathy)', score: '8 / 19', level: 'MODERATE_NEUROPATHY' },
      differentialDiagnoses: [
        { condition: 'Diabetic Distal Sensorimotor Polyneuropathy (DSPN)', probability: 84, reasoning: 'Symmetrical burning feet paresthesias in stocking distribution, worse at night in patient with 8-year history of Type 2 Diabetes.' },
        { condition: 'Vitamin B12 Deficiency Neuropathy', probability: 10, reasoning: 'Common in long-term Metformin therapy; requires serum B12 and homocysteine confirmation.' },
        { condition: 'Lumbar Canal Stenosis / Radiculopathy', probability: 6, reasoning: 'Symptoms bilateral and non-dermatomal; lack of lower back shooting pain makes radiculopathy less likely.' }
      ],
      clinicalEvidence: [
        'SOCRATES: Bilateral tingling, burning sensations extending to mid-calf, nocturia x3.',
        'OCR Labs: Marked Hyperglycemia (FBS 184 mg/dL), Poor Glycemic Control (HbA1c 9.1%), eGFR 68 mL/min.',
        'Medications: Metformin 1000mg BD x 8 years.'
      ],
      recommendedOrders: [
        '10g Semmes-Weinstein Monofilament Sensory Testing + Biothesiometry',
        'Serum Vitamin B12 & Methylmalonic Acid Level testing',
        'Spot Urine Albumin-to-Creatinine Ratio (UACR) for nephropathy staging',
        'Intensify glycemic regimen (consider SGLT2i / DPP4i addition per eGFR) & optimize Pregabalin'
      ],
      icd10Codes: ['E11.42 (Type 2 DM with diabetic polyneuropathy)', 'N18.2 (CKD Stage 2)']
    },
    summary: {
      chiefComplaint: { text: 'Bilateral burning sensation in soles with post-prandial fatigue and polyuria', tag: 'stated' },
      socrates: {
        site: { text: 'Bilateral plantar feet and distal toes', tag: 'stated' },
        onset: { text: 'Insidious onset over last 3 months', tag: 'stated' },
        character: { text: 'Tingling, burning paresthesia (Glove & Stocking)', tag: 'stated' },
        radiation: { text: 'Extends up to mid-calf bilaterally', tag: 'stated' },
        associations: { text: 'Nocturia x3, blurred vision when fatigued', tag: 'stated' },
        timing: { text: 'Constant burning sensation, worse at night in bed', tag: 'stated' },
        exacerbating: { text: 'Prolonged standing increases numbness', tag: 'stated' },
        severity: { text: '6 / 10', tag: 'stated' }
      },
      pastMedical: { text: 'Type 2 Diabetes Mellitus x 8 years, Essential Hypertension', tag: 'stated' },
      allergies: { text: 'Sulfonamide allergy (rash)', tag: 'stated' },
      familyHistory: { text: 'Both parents had Type 2 Diabetes and Hypertension', tag: 'stated' },
      reviewOfSystems: { text: 'No foot ulceration, peripheral pulses palpable', tag: 'stated' }
    },
    prakriti: null,
    documents: [
      {
        id: 'doc_5',
        name: 'Endocrinology_Quarterly_Labs.pdf',
        date: '2026-02-20',
        diagnoses: ['Type 2 Diabetes Mellitus', 'Diabetic Distal Neuropathy', 'Stage 1 Hypertension'],
        medications: ['Metformin 1000mg BD', 'Telmisartan 40mg OD', 'Pregabalin 75mg HS'],
        abnormalLabs: [
          { test: 'Fasting Blood Sugar (FBS)', value: '184 mg/dL', normalRange: '70 - 99 mg/dL', status: 'HIGH' },
          { test: 'HbA1c', value: '9.1%', normalRange: '4.0 - 5.6%', status: 'HIGH' },
          { test: 'eGFR', value: '68 mL/min/1.73m²', normalRange: '> 90 mL/min', status: 'LOW' }
        ]
      }
    ],
    mockFhir: {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: '2026-08-22T10:15:00Z',
      entry: [
        { resource: { resourceType: 'Composition', status: 'final', title: 'Diabetic Endocrine Review' } },
        { resource: { resourceType: 'Condition', code: { text: 'Diabetic Peripheral Neuropathy' }, verificationStatus: 'confirmed' } }
      ]
    }
  }
];