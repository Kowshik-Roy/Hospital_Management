import React, { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  Download,
  Eye,
  CheckCircle2,
  Activity,
  FileText,
  Printer,
  Sparkles,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { PatientAccount, TestReportRecord } from '../../types/patientModule';

interface TestReportListProps {
  patient: PatientAccount;
  testReports: TestReportRecord[];
}

export const TestReportList: React.FC<TestReportListProps> = ({
  patient,
  testReports,
}) => {
  const [activeReport, setActiveReport] = useState<TestReportRecord | null>(null);

  const handleDownload = (report: TestReportRecord) => {
    // Generate simulated downloadable file
    const element = document.createElement('a');
    const file = new Blob(
      [
        `============================================================\nCAREPULSE HOSPITAL & MEDICAL CENTER - DIAGNOSTIC REPORT\n============================================================\nReport ID: ${report.report_id}\nPatient Name: ${patient.name} (${patient.patient_id})\nTest Name: ${report.test_name}\nTest Date: ${report.test_date}\nStatus: ${report.status}\nPhysician Recommendation: ${report.doctor_recommendation}\n\nClinical Results Summary:\n${report.result_summary}\n============================================================\nVerified by Clinical Pathology Department\n`,
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = report.file_name || `${report.test_name.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Laboratory & Diagnostic Center
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Pathology & Radiology Test Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access verified lab outcomes, imaging scans, reference ranges, and doctor recommendations.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
          Total Reports Available: <strong className="text-teal-700">{testReports.length}</strong>
        </div>
      </div>

      {testReports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-2">
          <Activity className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700">No diagnostic reports uploaded yet.</p>
          <p>Lab test results will be published here upon completion by the pathology team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testReports.map((report) => (
            <div
              key={report.report_id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Report ID & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    ID: {report.report_id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {report.status}
                  </span>
                </div>

                {/* Test Name & Date (Requested by User) */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200 shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {report.test_name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-teal-600" />
                      <span>Test Date: {report.test_date}</span>
                    </p>
                  </div>
                </div>

                {/* Doctor Recommendation (Requested by User) */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px] mb-0.5">
                      Doctor Recommendation:
                    </span>
                    <p className="text-slate-800 text-[11px] font-medium leading-relaxed">
                      {report.doctor_recommendation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 font-semibold block text-[11px] mb-0.5">
                      Result Summary:
                    </span>
                    <p className="text-slate-900 font-mono text-[11px] bg-white p-2 rounded-xl border border-slate-200">
                      {report.result_summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Details & Download */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setActiveReport(report)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleDownload(report)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Report View Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-teal-700 uppercase">
                  CarePulse Diagnostic Laboratories
                </span>
                <h3 className="text-lg font-black text-slate-900">{activeReport.test_name}</h3>
                <p className="text-xs text-slate-500 font-mono">Report Token: {activeReport.report_id}</p>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{patient.name} ({patient.patient_id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Test Date:</span>
                <span className="font-mono font-bold text-slate-850">{activeReport.test_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pathology Status:</span>
                <span className="font-bold text-emerald-700 uppercase">{activeReport.status}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-1">Doctor Recommendation:</span>
                <p className="bg-teal-50/50 p-3 rounded-xl border border-teal-200 text-teal-950 font-medium">
                  {activeReport.doctor_recommendation}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Diagnostic Biomarker Findings:</span>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-800 font-mono leading-relaxed">
                  {activeReport.result_summary}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Certified by CarePulse Pathology QA</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(activeReport)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => setActiveReport(null)}
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
