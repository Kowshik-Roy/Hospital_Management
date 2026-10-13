import React, { useState } from 'react';
import {
  Stethoscope,
  Clock,
  CheckCircle2,
  FilePlus,
  AlertCircle,
  Save,
  User,
  Activity,
  Plus,
  FileText,
  Calendar,
  X,
  Phone,
  Droplet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Appointment, Doctor } from '../types/hospital';
import { Language, translations } from '../i18n/translations';

interface DoctorPortalProps {
  language: Language;
  doctors: Doctor[];
  appointments: Appointment[];
  onUpdateAppointmentStatus: (appointmentId: string, status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => void;
  onSavePrescription: (
    appointmentId: string,
    notes: string,
    medicines?: Array<{ name: string; dosage: string; instruction: string; duration: string }>
  ) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  language,
  doctors,
  appointments,
  onUpdateAppointmentStatus,
  onSavePrescription,
}) => {
  const t = translations[language];
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [editingPrescriptionApt, setEditingPrescriptionApt] = useState<Appointment | null>(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [medicineList, setMedicineList] = useState<
    Array<{ name: string; dosage: string; instruction: string; duration: string }>
  >([
    { name: '', dosage: '1 tablet', instruction: 'After meal', duration: '7 days' },
  ]);

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Filter appointments for this doctor
  const doctorAppointments = appointments.filter((a) => a.doctorId === currentDoctor?.id);
  const pendingOrConfirmed = doctorAppointments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled');
  const completedApts = doctorAppointments.filter((a) => a.status === 'completed');

  const handleOpenPrescriptionModal = (apt: Appointment) => {
    setEditingPrescriptionApt(apt);
    setPrescriptionText(apt.prescriptionNotes || '');
    if (apt.medicines && apt.medicines.length > 0) {
      setMedicineList(apt.medicines);
    } else {
      setMedicineList([
        { name: '', dosage: '1 tablet', instruction: 'After meal', duration: '7 days' },
      ]);
    }
  };

  const handleAddMedicineRow = () => {
    setMedicineList((prev) => [
      ...prev,
      { name: '', dosage: '1 tablet', instruction: 'After meal', duration: '5 days' },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    setMedicineList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSavePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrescriptionApt) return;

    const validMeds = medicineList.filter((m) => m.name.trim().length > 0);
    onSavePrescription(editingPrescriptionApt.id, prescriptionText, validMeds);
    setEditingPrescriptionApt(null);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Module 2 Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-1">
                <span>{language === 'bn' ? 'মডিউল ২: হাসপাতাল ম্যানেজমেন্ট ও ওপিডি চেম্বার' : 'Module 2: Hospital Management & OPD Suite'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {language === 'bn' ? 'চিকিৎসক কনসালটেশন কিউ ও ই-প্রেসক্রিপশন' : 'Doctor Consultation & E-Prescriptions'}
              </h2>
            </div>
          </div>

          {/* Select Doctor Profile */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 pl-1">
              {language === 'bn' ? 'ডাক্তার নির্বাচন:' : 'Duty Doctor:'}
            </span>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-800 focus:outline-none cursor-pointer"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor KPIs */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {language === 'bn' ? 'আজকের মোট সিরিয়াল' : 'Today Queue'}
            </span>
            <div className="text-xl font-black text-slate-900 mt-1 font-mono">
              {doctorAppointments.length}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {language === 'bn' ? 'অপেক্ষমাণ রোগী' : 'Waiting Queue'}
            </span>
            <div className="text-xl font-black text-amber-600 mt-1 font-mono">
              {pendingOrConfirmed.length}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {language === 'bn' ? 'সম্পন্ন কনসালটেশন' : 'Completed OPD'}
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1 font-mono">
              {completedApts.length}
            </div>
          </div>
        </div>
      </div>

      {/* OPD Waiting Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{language === 'bn' ? 'রোগী দেখার তালিকা ও প্রেসক্রিপশন কাউন্টার' : 'Patient OPD Consultation Queue'}</span>
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {pendingOrConfirmed.length} {language === 'bn' ? 'জন অপেক্ষায়' : 'waiting'}
          </span>
        </div>

        {pendingOrConfirmed.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-bold text-slate-700">
              {language === 'bn' ? 'সকল রোগী দেখা সম্পন্ন হয়েছে' : 'No patients currently waiting in queue'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">টোকেন নং</th>
                  <th className="py-3 px-4">রোগীর নাম ও বয়স</th>
                  <th className="py-3 px-4">মোবাইল</th>
                  <th className="py-3 px-4">সময়সূচী</th>
                  <th className="py-3 px-4">লক্ষণ ও নোট</th>
                  <th className="py-3 px-4 text-right">প্রেসক্রিপশন অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pendingOrConfirmed.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      #{apt.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {apt.patientName} ({apt.patientAge}y, {apt.patientGender})
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                      {apt.patientPhone}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {apt.date} • {apt.timeSlot}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                      {apt.symptoms || 'General Checkup'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenPrescriptionModal(apt)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs inline-flex items-center gap-1.5"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'প্রেসক্রিপশন লিখুন' : 'Write Prescription'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRESCRIPTION WRITER MODAL */}
      {editingPrescriptionApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in">
            <button
              onClick={() => setEditingPrescriptionApt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {language === 'bn' ? 'ডিজিটাল ই-প্রেসক্রিপশন প্যাড' : 'Digital E-Prescription Pad'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {editingPrescriptionApt.patientName} (Token #{editingPrescriptionApt.ticketNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Dr. {currentDoctor.name} ({currentDoctor.specialty})
              </p>
            </div>

            <form onSubmit={handleSavePrescriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'ক্লিনিক্যাল ডায়াগনোসিস ও ডাক্তারের পরামর্শ' : 'Clinical Diagnosis & Advice'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder={language === 'bn' ? 'রোগ নির্ণয়, খাদ্যাভ্যাস ও বিশ্রাম সম্পর্কিত পরামর্শ লিখুন...' : 'Write diagnosis and instructions...'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">
                    {language === 'bn' ? 'ওষুধের তালিকা (Rx)' : 'Prescribed Medicines (Rx)'}
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ওষুধ যোগ করুন' : 'Add Medicine'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {medicineList.map((med, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          placeholder="Medicine Name (e.g. Napa Extra 500mg)"
                          className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          placeholder="1+0+1"
                          className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                          placeholder="7 Days"
                          className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(idx)}
                        disabled={medicineList.length === 1}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPrescriptionApt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                >
                  {language === 'bn' ? 'প্রেসক্রিপশন সেভ করুন ও সম্পূর্ণ করুন' : 'Save Prescription & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
