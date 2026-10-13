import React, { useState, useEffect } from 'react';
import {
  X,
  CalendarCheck,
  User,
  Phone,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Appointment, Doctor, HospitalSettings } from '../types/hospital';
import { Language, translations } from '../i18n/translations';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  initialDoctorId?: string;
  onBookAppointment: (newAppointment: Appointment) => void;
  language: Language;
  hospitalSettings: HospitalSettings;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  doctors,
  initialDoctorId,
  onBookAppointment,
  language,
  hospitalSettings,
}) => {
  const t = translations[language];

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || doctors[0]?.id || ''
  );
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number>(30);
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('06:00 PM');
  const [symptoms, setSymptoms] = useState('');
  const [bookedTicket, setBookedTicket] = useState<string | null>(null);

  useEffect(() => {
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
    }
  }, [initialDoctorId]);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    const generatedToken = `TK-${Math.floor(100 + Math.random() * 900)}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      departmentName: selectedDoctor.specialty,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge,
      patientGender,
      date: preferredDate,
      timeSlot: preferredTime,
      ticketNumber: generatedToken,
      status: 'confirmed',
      fee: selectedDoctor.consultFee,
      roomNo: selectedDoctor.roomNo,
      symptoms: symptoms.trim() || 'Routine medical consultation',
    };

    onBookAppointment(newAppointment);
    setBookedTicket(generatedToken);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const handleResetAndClose = () => {
    setBookedTicket(null);
    setPatientName('');
    setPatientPhone('');
    setSymptoms('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        {bookedTicket ? (
          /* Confirmation Ticket Card */
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত হয়েছে!' : 'Appointment Confirmed!'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {language === 'bn' ? 'রোগী সিরিয়াল টোকেন' : 'Patient Serial Token'}
              </h3>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-teal-400 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs text-slate-500">{language === 'bn' ? 'টোকেন নাম্বার:' : 'Token No:'}</span>
                <span className="text-lg font-black text-teal-700 font-mono">#{bookedTicket}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'bn' ? 'রোগীর নাম:' : 'Patient:'}</span>
                <span className="font-bold text-slate-900">{patientName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'bn' ? 'চিকিৎসক:' : 'Doctor:'}</span>
                <span className="font-bold text-slate-900">{selectedDoctor.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'bn' ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
                <span className="font-mono text-slate-800">{preferredDate} ({preferredTime})</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                <span className="text-slate-500">{language === 'bn' ? 'ওপিডি ফি:' : 'OPD Fee:'}</span>
                <span className="font-bold text-teal-700 font-mono">{hospitalSettings.currency} {selectedDoctor.consultFee}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              {language === 'bn'
                ? 'এই অ্যাপয়েন্টমেন্টের জন্য বিলিং সিস্টেমে একটি ইনভয়েস স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।'
                : 'An OPD consultation invoice has been automatically generated in the Billing System.'}
            </p>

            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
            >
              {language === 'bn' ? 'ঠিক আছে / বন্ধ করুন' : 'Done & Close'}
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {language === 'bn' ? 'ওপিডি ডাক্তার সিরিয়াল' : 'Doctor OPD Booking'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {language === 'bn' ? 'ডাক্তার অ্যাপয়েন্টমেন্ট বুকিং ফরম' : 'Book Specialist Appointment'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'বিশেষজ্ঞ ডাক্তার নির্বাচন' : 'Select Specialist Doctor'}
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} ({hospitalSettings.currency} {d.consultFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'রোগীর পূর্ণ নাম' : 'Patient Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Rahima Begum"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'বয়স' : 'Age'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'লিঙ্গ' : 'Gender'}
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="male">{language === 'bn' ? 'পুরুষ' : 'Male'}</option>
                    <option value="female">{language === 'bn' ? 'মহিলা' : 'Female'}</option>
                    <option value="other">{language === 'bn' ? 'অন্যান্য' : 'Other'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'তারিখ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'পছন্দের সময়' : 'Time Slot'}
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="10:00 AM">10:00 AM (Morning Shift)</option>
                    <option value="12:00 PM">12:00 PM (Noon Shift)</option>
                    <option value="05:00 PM">05:00 PM (Evening Shift)</option>
                    <option value="07:00 PM">07:00 PM (Night Shift)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'শারীরিক লক্ষণ ও অসুস্থতার বিবরণ' : 'Symptoms or Reason for Visit'}
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: ৩ দিন ধরে তীব্র জ্বর ও কাশি...' : 'e.g. High fever for 3 days and headache...'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
                >
                  {language === 'bn' ? 'সিরিয়াল নিশ্চিত করুন' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
