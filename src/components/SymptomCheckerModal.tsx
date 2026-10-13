import React, { useState } from 'react';
import {
  Sparkles,
  Stethoscope,
  X,
  AlertTriangle,
  ArrowRight,
  HeartPulse,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Department } from '../types/hospital';
import { Language } from '../i18n/translations';

interface SymptomCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onSelectDepartmentForBooking: (deptId: string) => void;
  language: Language;
}

export const SymptomCheckerModal: React.FC<SymptomCheckerModalProps> = ({
  isOpen,
  onClose,
  departments,
  onSelectDepartmentForBooking,
  language,
}) => {
  const [symptomText, setSymptomText] = useState('');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('male');
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<{
    recommendedDepartment: string;
    recommendedSpecialist: string;
    urgencyLevel: 'Emergency' | 'Priority' | 'Normal';
    guidance: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/symptom-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomText,
          language,
          age: patientAge,
          gender: patientGender,
        }),
      });

      if (!response.ok) throw new Error('Triage request failed');
      const data = await response.json();
      setTriageResult(data);
    } catch (err) {
      // Local fallback triage heuristic
      const lower = symptomText.toLowerCase();
      if (lower.includes('chest') || lower.includes('বুকে') || lower.includes('হার্ট')) {
        setTriageResult({
          recommendedDepartment: 'Cardiology',
          recommendedSpecialist: 'Cardiologist',
          urgencyLevel: 'Emergency',
          guidance: language === 'bn'
            ? 'বুকে ব্যথা বা অস্বস্তি জরুরি হতে পারে। অবিলম্বে জরুরি বিভাগে যোগাযোগ করুন।'
            : 'Chest discomfort may indicate an urgent cardiac issue. Please consult emergency care immediately.',
        });
      } else if (lower.includes('fever') || lower.includes('জ্বর') || lower.includes('কাশি')) {
        setTriageResult({
          recommendedDepartment: 'Medicine',
          recommendedSpecialist: 'General Physician / Pulmonologist',
          urgencyLevel: 'Priority',
          guidance: language === 'bn'
            ? 'সাধারণ মেডিসিন বা বক্ষব্যাধি বিশেষজ্ঞের পরামর্শ নিন এবং পর্যাপ্ত বিশ্রাম গ্রহণ করুন।'
            : 'Consult a General Medicine or Respiratory specialist and stay well hydrated.',
        });
      } else {
        setTriageResult({
          recommendedDepartment: 'Medicine',
          recommendedSpecialist: 'General Physician',
          urgencyLevel: 'Normal',
          guidance: language === 'bn'
            ? 'প্রাথমিক চেকআপের জন্য আমাদের জেনারেল মেডিসিন ওপিডি ক্লিনিকে অ্যাপয়েন্টমেন্ট নিন।'
            : 'Book a consultation with our General OPD clinic for evaluation.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold border border-cyan-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {language === 'bn' ? 'এআই লক্ষণ ট্রায়াজ ও গাইডেন্স' : 'AI Clinical Symptom Triage'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'লক্ষণ জানিয়ে সঠিক ডিপার্টমেন্ট ও ডাক্তার সুপারিশ পান।' : 'AI assistance to recommend clinical departments.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleTriageSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'বয়স' : 'Age'}
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'লিঙ্গ' : 'Gender'}
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="male">{language === 'bn' ? 'পুরুষ' : 'Male'}</option>
                <option value="female">{language === 'bn' ? 'মহিলা' : 'Female'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'আপনার শারীরিক সমস্যা বা লক্ষণসমূহ লিখুন' : 'Describe Symptoms'}
            </label>
            <textarea
              rows={3}
              required
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'যেমন: গত দুই দিন ধরে মাথায় প্রচণ্ড ব্যথা, সাথে বমি বমি ভাব এবং ক্লান্তি...'
                  : 'e.g. Severe headache for 2 days with nausea and dizziness...'
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !symptomText.trim()}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>{language === 'bn' ? 'এআই বিশ্লেষণ চলছে...' : 'Analyzing symptoms...'}</span>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>{language === 'bn' ? 'লক্ষণ ট্রায়াজ করুন' : 'Run AI Triage'}</span>
              </>
            )}
          </button>
        </form>

        {/* Triage Output */}
        {triageResult && (
          <div className="mt-5 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {language === 'bn' ? 'জরুরিতা লেভেল:' : 'Urgency Level:'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  triageResult.urgencyLevel === 'Emergency'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : triageResult.urgencyLevel === 'Priority'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {triageResult.urgencyLevel}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500">{language === 'bn' ? 'সুপারিশকৃত বিভাগ:' : 'Recommended Specialty:'}</span>
              <h4 className="text-sm font-bold text-slate-900">{triageResult.recommendedDepartment} ({triageResult.recommendedSpecialist})</h4>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              {triageResult.guidance}
            </p>

            <button
              onClick={() => {
                const dept = departments.find(
                  (d) => d.name.toLowerCase().includes(triageResult.recommendedDepartment.toLowerCase())
                );
                onClose();
                onSelectDepartmentForBooking(dept?.id || departments[0]?.id);
              }}
              className="w-full py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{language === 'bn' ? 'এই বিভাগে ডাক্তার বুক করুন' : 'Book Specialist Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
