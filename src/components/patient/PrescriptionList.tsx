import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Clock,
  Printer,
  Download,
  AlertCircle,
  Eye,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PatientAccount, PrescriptionRecord } from '../../types/patientModule';

interface PrescriptionListProps {
  patient: PatientAccount;
  prescriptions: PrescriptionRecord[];
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  patient,
  prescriptions,
}) => {
  const [selectedRx, setSelectedRx] = useState<PrescriptionRecord | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
            Digital E-Prescriptions
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Doctor Prescriptions & Medications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View active drug regimens, precise dosage timings, course durations, and physician instructions.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print All Rx</span>
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-2">
          <Pill className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700">No prescriptions recorded yet.</p>
          <p>Medications prescribed by attending doctors will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prescriptions.map((rx) => (
            <div
              key={rx.prescription_id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Prescription Top Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Rx ID: {rx.prescription_id}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-teal-600" />
                    <span>{rx.prescription_date}</span>
                  </span>
                </div>

                {/* Medicine Name (Requested by User) */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200 shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {rx.medicine}
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" />
                      <span>{rx.doctor_name}</span>
                    </p>
                  </div>
                </div>

                {/* Dosage & Duration Grid (Requested by User) */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Dosage:</span>
                    <span className="font-bold text-slate-900 font-mono">{rx.dosage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-bold text-blue-700">{rx.duration}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 block text-[11px] font-semibold mb-1">
                      Instructions:
                    </span>
                    <p className="text-slate-800 italic bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                      "{rx.instructions}"
                    </p>
                  </div>
                </div>
              </div>

              {/* View / Print Single Prescription */}
              <button
                onClick={() => setSelectedRx(rx)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                <span>View Formal Prescription Sheet</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Official Rx Slip Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6">
            {/* Hospital Rx Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-teal-700 uppercase">
                  CarePulse Healthcare System
                </span>
                <h3 className="text-lg font-black text-slate-900">Official Medical Prescription</h3>
                <p className="text-xs text-slate-500 font-mono">Prescription Token: {selectedRx.prescription_id}</p>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Patient & Doctor Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-bold text-slate-900">{patient.name} ({patient.patient_id})</span>
                <span className="text-[11px] text-slate-500 block">Blood Group: {patient.blood_group}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Prescribing Physician:</span>
                <span className="font-bold text-teal-800">{selectedRx.doctor_name}</span>
                <span className="text-[11px] font-mono text-slate-500 block">Date: {selectedRx.prescription_date}</span>
              </div>
            </div>

            {/* Rx Content */}
            <div className="space-y-3">
              <div className="text-2xl font-serif font-black text-teal-700">℞</div>
              <div className="bg-teal-50/40 p-4 rounded-2xl border border-teal-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>{selectedRx.medicine}</span>
                  <span className="text-xs font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                    {selectedRx.duration}
                  </span>
                </div>
                <div className="text-slate-700 font-medium">
                  <strong>Dosage:</strong> {selectedRx.dosage}
                </div>
                <div className="text-slate-700 pt-1 border-t border-teal-200/50">
                  <strong>Instructions:</strong> {selectedRx.instructions}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Digitally signed & verified by CarePulse Hospital</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Rx</span>
                </button>
                <button
                  onClick={() => setSelectedRx(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
