import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Receipt,
  MapPin,
  CalendarCheck,
  Search,
  Filter
} from 'lucide-react';
import { AppointmentRecord, AppointmentStatusType } from '../../types/patientModule';
import { PatientDB } from '../../services/patientService';

interface AppointmentHistoryProps {
  appointments: AppointmentRecord[];
  onAppointmentsChange: (updated: AppointmentRecord[]) => void;
  onBookNew: () => void;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
  appointments,
  onAppointmentsChange,
  onBookNew,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchesSearch =
      apt.appointment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmCancel = (id: string) => {
    try {
      const updated = PatientDB.cancelAppointment(id);
      // Sync with parent state
      onAppointmentsChange(PatientDB.getAppointments(updated.patient_id));

      // Call backend
      fetch(`/api/patient/appointments/${id}/cancel`, { method: 'PUT' }).catch(() => {});
      setCancelTargetId(null);
      if (selectedAppointment?.appointment_id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: 'Cancelled' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: AppointmentStatusType) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Filter Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Consultation Schedule
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Appointment History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and manage all your scheduled, completed, and pending doctor visits.
            </p>
          </div>

          <button
            onClick={onBookNew}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Doctor, or Specialization..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment History Table (Columns Requested by User) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No appointments found.</p>
            <p>You can schedule a new consultation with any available specialist doctor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Appointment ID</th>
                  <th className="py-3.5 px-5">Doctor Name</th>
                  <th className="py-3.5 px-5">Specialization</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Time</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((apt) => (
                  <tr key={apt.appointment_id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Column 1: Appointment ID */}
                    <td className="py-4 px-5 font-mono font-bold text-blue-700">
                      {apt.appointment_id}
                    </td>

                    {/* Column 2: Doctor Name */}
                    <td className="py-4 px-5 font-bold text-slate-900">
                      {apt.doctor_name}
                    </td>

                    {/* Column 3: Specialization */}
                    <td className="py-4 px-5 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                        {apt.specialization}
                      </span>
                    </td>

                    {/* Column 4: Date */}
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-600">
                      {apt.appointment_date}
                    </td>

                    {/* Column 5: Time */}
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-600">
                      {apt.appointment_time}
                    </td>

                    {/* Column 6: Status */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    {/* Column 7: Action (View Details, Cancel Appointment) */}
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Details</span>
                      </button>

                      {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => setCancelTargetId(apt.appointment_id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
                  {selectedAppointment.appointment_id}
                </span>
                <h3 className="text-base font-bold text-slate-900">Appointment Token Details</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{selectedAppointment.doctor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Specialization:</span>
                <span className="font-semibold text-slate-700">{selectedAppointment.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-mono font-bold text-slate-800">{selectedAppointment.appointment_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-mono font-bold text-slate-800">{selectedAppointment.appointment_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Fee:</span>
                <span className="font-mono font-bold text-teal-700">৳ {selectedAppointment.consultation_fee || 1000}</span>
              </div>
            </div>

            {selectedAppointment.symptoms && (
              <div className="text-xs">
                <span className="text-slate-500 font-semibold block mb-1">Reported Symptoms:</span>
                <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800">
                  {selectedAppointment.symptoms}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-5 py-2 rounded-xl font-bold text-xs bg-slate-900 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Confirmation Modal */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Appointment?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to cancel appointment <span className="font-mono font-bold text-rose-600">{cancelTargetId}</span>?
                This time slot will be released for other patients.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelTargetId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
