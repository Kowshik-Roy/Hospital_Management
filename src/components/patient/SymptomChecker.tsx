import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Stethoscope,
  User,
  Clock,
  Thermometer,
  Heart,
  Brain,
  Wind,
  Zap,
  Shield,
  Info,
  CalendarPlus,
  FlaskConical,
  Pill,
  Eye,
  Bone,
  Baby,
} from 'lucide-react';
import { PatientAccount, SymptomCheckerRecord } from '../../types/patientModule';
import { PatientDB } from '../../services/patientService';

// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────
interface SymptomOption {
  id: string;
  label: string;
  icon: React.ElementType;
  category: string;
}

interface TriageResult {
  possibleCategory: string;
  recommendedDepartment: string;
  suggestedDoctor: string;
  urgencyLevel: 'Emergency' | 'Priority' | 'Normal';
  urgencyColor: string;
  guidance: string;
  additionalTips: string[];
}

interface SymptomCheckerProps {
  patient: PatientAccount;
  onBookAppointment: (specialization?: string) => void;
}

// ───────────────────────────────────────────────────────
// Symptom List (expandable chips)
// ───────────────────────────────────────────────────────
const SYMPTOM_OPTIONS: SymptomOption[] = [
  { id: 'fever', label: 'Fever', icon: Thermometer, category: 'General' },
  { id: 'headache', label: 'Headache', icon: Brain, category: 'Neurological' },
  { id: 'cough', label: 'Cough', icon: Wind, category: 'Respiratory' },
  { id: 'chest_pain', label: 'Chest Pain', icon: Heart, category: 'Cardiac' },
  { id: 'stomach_pain', label: 'Stomach Pain', icon: Activity, category: 'Digestive' },
  { id: 'dizziness', label: 'Dizziness', icon: Zap, category: 'Neurological' },
  { id: 'shortness_breath', label: 'Shortness of Breath', icon: Wind, category: 'Respiratory' },
  { id: 'body_pain', label: 'Body / Muscle Pain', icon: Bone, category: 'Musculoskeletal' },
  { id: 'vomiting', label: 'Vomiting / Nausea', icon: Activity, category: 'Digestive' },
  { id: 'rash', label: 'Skin Rash', icon: Shield, category: 'Dermatological' },
  { id: 'eye_pain', label: 'Eye Pain / Redness', icon: Eye, category: 'Ophthalmological' },
  { id: 'joint_pain', label: 'Joint Pain', icon: Bone, category: 'Musculoskeletal' },
  { id: 'fatigue', label: 'Extreme Fatigue', icon: Zap, category: 'General' },
  { id: 'sore_throat', label: 'Sore Throat', icon: Pill, category: 'ENT' },
  { id: 'runny_nose', label: 'Runny Nose', icon: Wind, category: 'ENT' },
  { id: 'pregnancy', label: 'Pregnancy Related', icon: Baby, category: 'Gynecology' },
];

const DURATION_OPTIONS = ['Less than 24 hours', '1–3 days', '4–7 days', '1–2 weeks', 'More than 2 weeks'];
const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild', desc: 'Manageable, daily routine unaffected', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'moderate', label: 'Moderate', desc: 'Affecting daily routine somewhat', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'severe', label: 'Severe', desc: 'Significantly limiting daily activities', color: 'text-rose-700 bg-rose-50 border-rose-200' },
];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ───────────────────────────────────────────────────────
// Local AI Triage Engine (heuristic, offline-capable)
// ───────────────────────────────────────────────────────
function runLocalTriage(
  selectedSymptoms: string[],
  additionalSymptoms: string,
  severity: string,
  existingDiseases: string,
  age: number
): TriageResult {
  const all = [...selectedSymptoms, additionalSymptoms.toLowerCase()].join(' ');

  const has = (kw: string) => all.includes(kw);

  // Emergency conditions
  if (has('chest_pain') || has('chest pain') || has('heart')) {
    return {
      possibleCategory: 'Possible Cardiac Event',
      recommendedDepartment: 'Cardiology / Emergency',
      suggestedDoctor: 'Cardiologist / Emergency Physician',
      urgencyLevel: 'Emergency',
      urgencyColor: 'rose',
      guidance:
        'Chest pain combined with other symptoms can indicate a serious cardiac event. Please proceed to the Emergency Department immediately. Do not drive yourself.',
      additionalTips: [
        'Call 999 / ambulance immediately',
        'Sit down and rest; avoid exertion',
        'Chew an aspirin (325 mg) if not allergic',
        'Loosen tight clothing',
      ],
    };
  }

  if (has('shortness_breath') && (has('chest_pain') || severity === 'severe')) {
    return {
      possibleCategory: 'Acute Respiratory Distress',
      recommendedDepartment: 'Emergency / Pulmonology',
      suggestedDoctor: 'Pulmonologist / Emergency Physician',
      urgencyLevel: 'Emergency',
      urgencyColor: 'rose',
      guidance:
        'Severe shortness of breath is a medical emergency. Seek immediate care at the nearest Emergency Department.',
      additionalTips: ['Call emergency services immediately', 'Stay calm and avoid physical exertion', 'Sit upright to ease breathing'],
    };
  }

  if (has('dizziness') && has('headache') && severity === 'severe') {
    return {
      possibleCategory: 'Possible Neurological Emergency (Stroke Risk)',
      recommendedDepartment: 'Neurology / Emergency',
      suggestedDoctor: 'Neurologist / Emergency Physician',
      urgencyLevel: 'Emergency',
      urgencyColor: 'rose',
      guidance:
        'Sudden severe headache with dizziness can signal a neurological emergency. Seek immediate evaluation at the Emergency Department. Time is critical.',
      additionalTips: [
        'Note the exact time symptoms started',
        'Do not eat or drink anything',
        'Lay the patient on their side if unconscious',
        'Call emergency services immediately',
      ],
    };
  }

  // Respiratory (fever + cough + body pain)
  if (has('fever') && (has('cough') || has('body_pain') || has('shortness_breath'))) {
    const isHighRisk = existingDiseases.toLowerCase().includes('diabet') ||
      existingDiseases.toLowerCase().includes('asthm') || age > 60;
    return {
      possibleCategory: 'Respiratory Infection (Possible Flu / Pneumonia)',
      recommendedDepartment: 'Medicine (General)',
      suggestedDoctor: 'General Physician / Pulmonologist',
      urgencyLevel: isHighRisk ? 'Priority' : 'Normal',
      urgencyColor: isHighRisk ? 'amber' : 'emerald',
      guidance:
        'Your symptoms suggest a respiratory infection. Rest, stay hydrated, and consult a physician. If symptoms worsen rapidly, visit the Emergency Department.',
      additionalTips: [
        'Drink 8–10 glasses of water daily',
        'Rest and avoid strenuous activities',
        'Take fever-reducing medication if temperature exceeds 38.5°C',
        'Wear a mask to prevent spread to others',
      ],
    };
  }

  // Digestive
  if (has('stomach_pain') || has('vomiting')) {
    return {
      possibleCategory: 'Gastrointestinal Disorder',
      recommendedDepartment: 'Gastroenterology / Medicine',
      suggestedDoctor: 'Gastroenterologist / General Physician',
      urgencyLevel: severity === 'severe' ? 'Priority' : 'Normal',
      urgencyColor: severity === 'severe' ? 'amber' : 'emerald',
      guidance:
        'Stomach pain and nausea/vomiting are common gastrointestinal symptoms. Stay hydrated and avoid heavy meals. See a physician if pain persists or worsens.',
      additionalTips: [
        'Stay hydrated with ORS (oral rehydration solution)',
        'Avoid spicy, fatty, or fried foods',
        'Eat small, bland meals (rice, toast, bananas)',
        'Monitor for blood in stool or vomit',
      ],
    };
  }

  // Neurology (isolated headache / dizziness)
  if (has('headache') || has('dizziness')) {
    return {
      possibleCategory: 'Neurological / Tension-Related Condition',
      recommendedDepartment: 'Neurology / Medicine',
      suggestedDoctor: 'Neurologist / General Physician',
      urgencyLevel: severity === 'severe' ? 'Priority' : 'Normal',
      urgencyColor: severity === 'severe' ? 'amber' : 'emerald',
      guidance:
        'Headache and dizziness can result from tension, dehydration, hypertension, or migraine. A neurological evaluation is recommended if recurring.',
      additionalTips: [
        'Drink plenty of water',
        'Rest in a quiet, dark room',
        'Check your blood pressure if possible',
        'Avoid screens and bright lights temporarily',
      ],
    };
  }

  // ENT
  if (has('sore_throat') || has('runny_nose') || has('cough')) {
    return {
      possibleCategory: 'Upper Respiratory Tract Infection (Cold / Sinusitis)',
      recommendedDepartment: 'ENT (Ear, Nose & Throat)',
      suggestedDoctor: 'ENT Specialist / General Physician',
      urgencyLevel: 'Normal',
      urgencyColor: 'emerald',
      guidance:
        'Common cold or upper respiratory infection symptoms detected. Rest, fluids, and OTC medications can help. See an ENT specialist if symptoms persist beyond 10 days.',
      additionalTips: [
        'Gargle with warm salt water for sore throat',
        'Use saline nasal spray for congestion',
        'Steam inhalation can relieve symptoms',
        'Avoid cold drinks and ice cream',
      ],
    };
  }

  // Skin
  if (has('rash')) {
    return {
      possibleCategory: 'Dermatological Condition (Skin Disorder)',
      recommendedDepartment: 'Dermatology',
      suggestedDoctor: 'Dermatologist',
      urgencyLevel: 'Normal',
      urgencyColor: 'emerald',
      guidance:
        'Skin rashes can be caused by allergies, infections, or other skin conditions. A dermatologist can perform a proper diagnosis and recommend treatment.',
      additionalTips: [
        'Avoid scratching the affected area',
        'Apply a cool, damp cloth for relief',
        'Avoid known allergens',
        'Note any new foods, medications, or substances introduced recently',
      ],
    };
  }

  // Musculoskeletal
  if (has('joint_pain') || has('body_pain')) {
    return {
      possibleCategory: 'Musculoskeletal / Rheumatological Condition',
      recommendedDepartment: 'Orthopedics / Rheumatology',
      suggestedDoctor: 'Orthopedic Surgeon / Rheumatologist',
      urgencyLevel: severity === 'severe' ? 'Priority' : 'Normal',
      urgencyColor: severity === 'severe' ? 'amber' : 'emerald',
      guidance:
        'Joint and muscle pain can indicate arthritis, injury, or other musculoskeletal conditions. Rest the affected area and see a specialist for proper diagnosis.',
      additionalTips: [
        'Rest the affected joint or muscle',
        'Apply ice for the first 48 hours, then heat',
        'Avoid activities that worsen the pain',
        'Consider anti-inflammatory medication with doctor approval',
      ],
    };
  }

  // Eye
  if (has('eye_pain')) {
    return {
      possibleCategory: 'Ophthalmological Condition (Eye Disorder)',
      recommendedDepartment: 'Ophthalmology',
      suggestedDoctor: 'Ophthalmologist',
      urgencyLevel: 'Normal',
      urgencyColor: 'emerald',
      guidance:
        'Eye pain or redness should be evaluated by an ophthalmologist to rule out serious conditions like glaucoma, conjunctivitis, or corneal issues.',
      additionalTips: [
        'Do not rub your eyes',
        'Rinse with clean water if irritant exposure occurred',
        'Avoid wearing contact lenses until evaluated',
        'Avoid bright screens and outdoor glare',
      ],
    };
  }

  // Gynecology
  if (has('pregnancy')) {
    return {
      possibleCategory: 'Gynecological / Obstetric Condition',
      recommendedDepartment: 'Gynecology & Obstetrics',
      suggestedDoctor: 'Gynecologist / Obstetrician',
      urgencyLevel: 'Normal',
      urgencyColor: 'emerald',
      guidance:
        'Any symptoms during pregnancy should be promptly evaluated by a gynecologist or obstetrician to ensure the health of both mother and baby.',
      additionalTips: [
        'Track fetal movement daily',
        'Stay well-hydrated and eat nutritious meals',
        'Avoid self-medication without doctor approval',
        'Attend all scheduled prenatal checkups',
      ],
    };
  }

  // General fever
  if (has('fever') || has('fatigue')) {
    return {
      possibleCategory: 'General Viral / Bacterial Infection',
      recommendedDepartment: 'Medicine (General)',
      suggestedDoctor: 'General Physician',
      urgencyLevel: 'Normal',
      urgencyColor: 'emerald',
      guidance:
        'General fever and fatigue often indicate viral or bacterial infections. Rest, hydration, and a General Physician consultation are recommended.',
      additionalTips: [
        'Monitor your temperature every 4 hours',
        'Drink plenty of fluids',
        'Take paracetamol for fever if temperature is above 38.5°C',
        'Seek care if fever persists more than 3 days',
      ],
    };
  }

  // Default fallback
  return {
    possibleCategory: 'General Health Concern',
    recommendedDepartment: 'Medicine (General / OPD)',
    suggestedDoctor: 'General Physician',
    urgencyLevel: 'Normal',
    urgencyColor: 'emerald',
    guidance:
      'Based on your described symptoms, a consultation with a General Physician is recommended for proper evaluation and diagnosis.',
    additionalTips: [
      'Monitor your symptoms closely',
      'Maintain adequate rest and hydration',
      'Note any changes in symptoms before your appointment',
      'Bring a list of current medications to your consultation',
    ],
  };
}

// ───────────────────────────────────────────────────────
// Main Component
// ───────────────────────────────────────────────────────
export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ patient, onBookAppointment }) => {
  // Form state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [existingDiseases, setExistingDiseases] = useState('');
  const [allergies, setAllergies] = useState('');
  const [ageInput, setAgeInput] = useState(() => {
    if (patient.dob) {
      const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
      return String(age);
    }
    return '30';
  });
  const [gender, setGender] = useState<string>(patient.gender || 'Male');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0 && !additionalSymptoms.trim()) return;

    setIsLoading(true);
    setResult(null);
    setSavedId(null);

    // Simulate AI analysis delay
    await new Promise((r) => setTimeout(r, 2200));

    let triageResult: TriageResult;

    try {
      // Try server AI endpoint
      const response = await fetch('/api/ai/symptom-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: [...selectedSymptoms.map((s) => SYMPTOM_OPTIONS.find((o) => o.id === s)?.label || s), additionalSymptoms].filter(Boolean).join(', '),
          age: ageInput,
          gender,
          duration,
          severity,
          existingDiseases,
          allergies,
          language: 'en',
        }),
      });

      if (!response.ok) throw new Error('Server AI unavailable');

      const data = await response.json();
      triageResult = {
        possibleCategory: data.possibleCategory || data.category || 'General Health Concern',
        recommendedDepartment: data.recommendedDepartment || data.department || 'Medicine',
        suggestedDoctor: data.suggestedDoctor || data.recommendedSpecialist || 'General Physician',
        urgencyLevel: data.urgencyLevel || 'Normal',
        urgencyColor:
          data.urgencyLevel === 'Emergency'
            ? 'rose'
            : data.urgencyLevel === 'Priority'
            ? 'amber'
            : 'emerald',
        guidance: data.guidance || 'Please consult a physician.',
        additionalTips: data.additionalTips || [],
      };
    } catch {
      // Use local heuristic engine
      triageResult = runLocalTriage(
        selectedSymptoms,
        additionalSymptoms,
        severity,
        existingDiseases,
        parseInt(ageInput) || 30
      );
    }

    setResult(triageResult);
    setIsLoading(false);

    // Save to localStorage via PatientDB
    const record: SymptomCheckerRecord = {
      checker_id: `CHK-${Date.now()}`,
      patient_id: patient.patient_id,
      symptoms: [
        ...selectedSymptoms.map((s) => SYMPTOM_OPTIONS.find((o) => o.id === s)?.label || s),
        additionalSymptoms,
      ]
        .filter(Boolean)
        .join(', '),
      duration: duration || 'Not specified',
      severity: severity || 'Not specified',
      existing_diseases: existingDiseases,
      allergies,
      analysis_result: triageResult.possibleCategory,
      recommended_department: triageResult.recommendedDepartment,
      urgency_level: triageResult.urgencyLevel,
      created_date: new Date().toISOString().split('T')[0],
    };
    const id = PatientDB.saveSymptomCheck(record);
    setSavedId(id);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAdditionalSymptoms('');
    setDuration('');
    setSeverity('');
    setExistingDiseases('');
    setAllergies('');
    setResult(null);
    setSavedId(null);
  };

  // ── Urgency badge config ──
  const urgencyConfig = {
    Emergency: {
      bg: 'bg-rose-100 border-rose-300 text-rose-800',
      badge: 'bg-rose-600 text-white',
      icon: '🚨',
      pulse: 'animate-pulse',
    },
    Priority: {
      bg: 'bg-amber-50 border-amber-300 text-amber-800',
      badge: 'bg-amber-500 text-white',
      icon: '⚠️',
      pulse: '',
    },
    Normal: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      badge: 'bg-emerald-600 text-white',
      icon: '✅',
      pulse: '',
    },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-teal-600 to-emerald-500 p-6 text-white shadow-lg shadow-teal-500/20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner shrink-0">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider border border-white/30">
                AI Powered
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] text-white/70">Real-time Analysis</span>
            </div>
            <h1 className="text-xl font-black tracking-tight">AI Symptom Checker</h1>
            <p className="text-sm text-white/80 mt-0.5 leading-relaxed">
              Describe your symptoms and receive instant health guidance, department recommendations, and
              doctor specialization advice.
            </p>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="mt-4 relative flex items-start gap-2.5 bg-white/10 border border-white/20 rounded-2xl p-3.5 backdrop-blur-sm">
          <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/90 leading-relaxed">
            <span className="font-black text-amber-300">Medical Disclaimer:</span> This system provides
            health guidance only and does <span className="underline">not</span> replace professional
            medical diagnosis. Always consult a qualified physician for proper evaluation and treatment.
          </p>
        </div>
      </div>

      {/* ── Form + Result Layout ── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* ── LEFT: Input Form ── */}
        <div className="lg:col-span-3 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Patient Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Patient ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Patient ID</label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-700">
                    {patient.patient_id}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-rose-700">
                    {patient.blood_group || '—'}
                  </div>
                </div>
              </div>

              {/* Existing Diseases */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Existing Diseases / Medical Conditions{' '}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={existingDiseases}
                  onChange={(e) => setExistingDiseases(e.target.value)}
                  placeholder="e.g. Diabetes, Hypertension, Asthma..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Allergies */}
              <div className="mt-3">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Known Allergies <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Pollen, Dust, Shellfish..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Symptom Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                Select Your Symptoms
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Select all symptoms that apply. You can also add custom symptoms below.
              </p>

              <div className="flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedSymptoms.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleSymptom(opt.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all select-none ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-105'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {opt.label}
                      {isSelected && (
                        <CheckCircle2 className="w-3 h-3 ml-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Additional symptoms */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Additional Symptoms or Description
                </label>
                <textarea
                  rows={3}
                  value={additionalSymptoms}
                  onChange={(e) => setAdditionalSymptoms(e.target.value)}
                  placeholder="Describe any other symptoms in detail, e.g. sharp pain when breathing, numbness in left arm..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none leading-relaxed"
                />
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="mt-3 p-2.5 bg-teal-50 rounded-xl border border-teal-200 text-[11px] text-teal-700 font-semibold">
                  ✓ {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected:{' '}
                  {selectedSymptoms
                    .map((id) => SYMPTOM_OPTIONS.find((o) => o.id === id)?.label)
                    .join(', ')}
                </div>
              )}
            </div>

            {/* Duration + Severity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Duration & Severity
              </h3>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Symptom Duration</label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                        duration === d
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {SEVERITY_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSeverity(s.value)}
                      className={`p-3 rounded-xl text-left border-2 transition-all ${
                        severity === s.value
                          ? s.color + ' border-current shadow-sm scale-105'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-black">{s.label}</div>
                      <div className="text-[10px] leading-tight mt-0.5 opacity-80">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit / Reset */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || (selectedSymptoms.length === 0 && !additionalSymptoms.trim())}
                className="flex-1 py-3 rounded-2xl text-sm font-black bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white shadow-lg shadow-teal-600/25 disabled:opacity-40 transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    <span>AI Analyzing Symptoms...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>

              {result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-2xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-2 border border-slate-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── RIGHT: Results Panel ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-slate-100 rounded" />
                <div className="h-2.5 bg-slate-100 rounded w-5/6" />
                <div className="h-2.5 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl" />
                ))}
              </div>
              <div className="text-center py-4">
                <div className="inline-flex flex-col items-center gap-2 text-teal-600">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-teal-700">AI analyzing your symptoms...</p>
                  <p className="text-[10px] text-slate-400">
                    Evaluating {selectedSymptoms.length + (additionalSymptoms ? 1 : 0)} symptom inputs
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis Result */}
          {result && !isLoading && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {/* Urgency Alert */}
              <div
                className={`rounded-2xl border-2 p-4 flex items-center gap-3 ${
                  urgencyConfig[result.urgencyLevel].bg
                } ${urgencyConfig[result.urgencyLevel].pulse}`}
              >
                <span className="text-2xl">{urgencyConfig[result.urgencyLevel].icon}</span>
                <div>
                  <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">
                    Urgency Level
                  </div>
                  <div className="text-sm font-black">{result.urgencyLevel}</div>
                  {result.urgencyLevel === 'Emergency' && (
                    <div className="text-[11px] font-semibold mt-0.5">
                      Please seek immediate medical attention!
                    </div>
                  )}
                </div>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    urgencyConfig[result.urgencyLevel].badge
                  }`}
                >
                  {result.urgencyLevel}
                </span>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 border border-blue-100">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Possible Category
                  </div>
                  <div className="text-xs font-black text-slate-800 leading-tight">
                    {result.possibleCategory}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 border border-teal-100">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Recommended Dept.
                  </div>
                  <div className="text-xs font-black text-slate-800 leading-tight">
                    {result.recommendedDepartment}
                  </div>
                </div>

                <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Suggested Doctor Specialization
                  </div>
                  <div className="text-xs font-black text-slate-800 leading-tight">
                    {result.suggestedDoctor}
                  </div>
                </div>
              </div>

              {/* Guidance */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  Clinical Guidance
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{result.guidance}</p>
              </div>

              {/* Additional Tips */}
              {result.additionalTips.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    Health Tips & Self-Care
                  </h4>
                  <ul className="space-y-2">
                    {result.additionalTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Book Appointment CTA */}
              <button
                onClick={() => onBookAppointment(result.suggestedDoctor)}
                className="w-full py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2.5 transition-all active:scale-95"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Book Appointment Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {savedId && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Analysis saved to your health records (ID: {savedId})</span>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  This system provides health guidance only and does not replace professional medical
                  diagnosis. Please consult a qualified physician for proper evaluation and treatment.
                </span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && !isLoading && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center mx-auto mb-4 border border-teal-200">
                <Sparkles className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-sm font-black text-slate-800 mb-2">AI Analysis Results</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Select your symptoms and click <span className="font-bold text-teal-600">"Analyze with AI"</span> to receive
                personalized health guidance and department recommendations.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                {[
                  { icon: '🏥', label: 'Department Recommendation' },
                  { icon: '👨‍⚕️', label: 'Doctor Specialization' },
                  { icon: '⚡', label: 'Urgency Assessment' },
                  { icon: '💡', label: 'Health Tips & Guidance' },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100"
                  >
                    <span className="text-base">{f.icon}</span>
                    <span className="font-semibold leading-tight">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
