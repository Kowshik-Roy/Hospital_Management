import React from 'react';
import {
  FileText,
  Calendar,
  User,
  Stethoscope,
  Activity,
  Heart,
  Pill,
  Download,
  Printer
} from 'lucide-react';
import { MedicalRecordItem } from '../../types/patientModule';

interface MedicalHistoryProps {
  medicalRecords: MedicalRecordItem[];
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({ medicalRecords }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Electronic Medical Records (EMR)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Patient Medical History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete record of your clinical examinations, official diagnoses, treatment protocols, and physician notes.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print Summary</span>
        </button>
      </div>

      {medicalRecords.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700">No medical records documented yet.</p>
          <p>Clinical notes and diagnosis summaries will be logged here after doctor consultations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {medicalRecords.map((record) => (
            <div
              key={record.record_id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-teal-300 transition-all space-y-4"
            >
              {/* Header: Record ID, Doctor & Visit Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
                      Record ID: {record.record_id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{record.doctor_name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 w-fit">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Visit Date: <strong className="text-slate-800">{record.date}</strong></span>
                </div>
              </div>

              {/* Diagnosis & Treatment (Requested by User) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diagnosis */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clinical Diagnosis:</span>
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {record.diagnosis}
                  </p>
                </div>

                {/* Treatment Information */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-blue-600" />
                    <span>Treatment Information:</span>
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {record.treatment}
                  </p>
                </div>
              </div>

              {/* Doctor Notes */}
              {record.doctor_notes && (
                <div className="bg-teal-50/40 rounded-2xl p-4 border border-teal-200/70 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 block mb-1">
                    Physician's Clinical Observations & Advice:
                  </span>
                  <p className="text-slate-700 italic leading-relaxed">
                    "{record.doctor_notes}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
