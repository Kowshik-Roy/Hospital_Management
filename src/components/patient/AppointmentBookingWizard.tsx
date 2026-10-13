import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  ShieldCheck,
  MapPin,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { AppointmentRecord, DoctorItem, PatientAccount } from '../../types/patientModule';
import { PatientDB } from '../../services/patientService';

interface AppointmentBookingWizardProps {
  patient: PatientAccount;
  doctors: DoctorItem[];
  preSelectedDoctorId?: string;
  onAppointmentBooked: (newAppointment: AppointmentRecord) => void;
  onCancel: () => void;
}

export const AppointmentBookingWizard: React.FC<AppointmentBookingWizardProps> = ({
  patient,
  doctors,
  preSelectedDoctorId,
  onAppointmentBooked,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(preSelectedDoctorId ? 2 : 1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preSelectedDoctorId || (doctors[0]?.doctor_id ?? '')
  );

  // Available dates for the next 14 days
  const today = new Date();
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].iso);

  // Available Time Slots
  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDoctor = doctors.find((d) => d.doctor_id === selectedDoctorId) || doctors[0];

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create via local persistent service
      const newApt = PatientDB.createAppointment(
        patient.patient_id,
        selectedDoctor.doctor_id,
        selectedDate,
        selectedTimeSlot,
        symptoms.trim() || 'General OPD Consultation'
      );

      // 2. Call backend Express endpoint asynchronously
      fetch('/api/patient/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patient.patient_id,
          doctor_id: selectedDoctor.doctor_id,
          appointment_date: selectedDate,
          appointment_time: selectedTimeSlot,
          symptoms: symptoms.trim(),
        }),
      }).catch(() => {});

      setIsSubmitting(false);
      onAppointmentBooked(newApt);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to book appointment. Please try again.');
    }
  };

  const steps = [
    { num: 1, label: 'Select Doctor' },
    { num: 2, label: 'Available Date' },
    { num: 3, label: 'Time Slot' },
    { num: 4, label: 'Confirm Booking' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
            Appointment Booking System
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Book Specialist Doctor Appointment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow the 4-step booking workflow to confirm your OPD consultation schedule.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((s) => (
          <div
            key={s.num}
            onClick={() => {
              if (s.num < currentStep) setCurrentStep(s.num);
            }}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
              currentStep === s.num
                ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                : currentStep > s.num
                ? 'bg-slate-50 border-slate-200 text-slate-700 cursor-pointer hover:bg-slate-100'
                : 'bg-white border-slate-100 text-slate-400 opacity-60'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === s.num
                  ? 'bg-teal-600 text-white'
                  : currentStep > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                Step {s.num}
              </span>
              <span className="text-xs font-bold truncate block">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Select Doctor */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Choose Your Preferred Specialist</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {doctors.map((doc) => (
              <div
                key={doc.doctor_id}
                onClick={() => setSelectedDoctorId(doc.doctor_id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedDoctorId === doc.doctor_id
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <img
                  src={doc.avatar_url}
                  alt={doc.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {doc.specialization}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">{doc.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Fee: ৳{doc.consultation_fee} • {doc.available_time}
                  </p>
                </div>
                {selectedDoctorId === doc.doctor_id && (
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md flex items-center gap-2 transition-all"
            >
              <span>Continue to Select Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Available Date */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Select Consultation Date (Next 14 Days)</span>
            </h3>
            <span className="text-xs text-teal-700 font-bold">
              Doctor: {selectedDoctor.name} ({selectedDoctor.specialization})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {dateOptions.map((opt) => (
              <button
                key={opt.iso}
                type="button"
                onClick={() => setSelectedDate(opt.iso)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedDate === opt.iso
                    ? 'border-teal-600 bg-teal-600 text-white shadow-md scale-102 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] font-bold uppercase block opacity-80">
                  {opt.dayName}
                </span>
                <span className="text-sm font-black block mt-0.5">{opt.formatted}</span>
                <span className="text-[9px] block mt-1 opacity-70 font-mono">{opt.iso}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md flex items-center gap-2 transition-all"
            >
              <span>Continue to Select Time Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Time Slot */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Select Available Time Slot</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Date: <strong className="text-slate-800">{selectedDate}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTimeSlot(slot)}
                className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between ${
                  selectedTimeSlot === slot
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{slot}</span>
                {selectedTimeSlot === slot && (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Optional Symptoms / Reason for Visit */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Symptoms / Reason for Visit (Optional)
            </label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Briefly describe your symptoms (e.g. chest pain, routine follow-up, knee ache)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md flex items-center gap-2 transition-all"
            >
              <span>Review & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Confirm Appointment */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Confirm Appointment Information</span>
          </h3>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Patient ID & Name:</span>
                <span className="font-bold text-slate-900">
                  {patient.name} ({patient.patient_id})
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Phone: {patient.phone}</p>
              </div>

              <div>
                <span className="text-slate-500 block">Doctor ID & Name:</span>
                <span className="font-bold text-slate-900">
                  {selectedDoctor.name} ({selectedDoctor.doctor_id})
                </span>
                <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                  Specialization: {selectedDoctor.specialization}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block">Appointment Date:</span>
                <span className="font-bold font-mono text-slate-900">{selectedDate}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Appointment Time:</span>
                <span className="font-bold font-mono text-slate-900">{selectedTimeSlot}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Consultation Fee:</span>
                <span className="font-black font-mono text-teal-700 text-sm">
                  ৳ {selectedDoctor.consultation_fee}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Initial Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmed
                </span>
              </div>
            </div>

            {symptoms && (
              <div className="pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500 block font-semibold mb-0.5">Reported Symptoms:</span>
                <p className="text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                  {symptoms}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Appointment...</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
