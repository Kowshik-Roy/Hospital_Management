import React from 'react';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Receipt,
  Clock,
  ArrowRight,
  User,
  Stethoscope,
  FileText,
  CreditCard,
  AlertCircle,
  Activity,
  Heart,
  Droplet,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  AppointmentRecord,
  BillingRecord,
  MedicalRecordItem,
  PatientAccount,
  PatientSidebarTab,
  PrescriptionRecord,
  TestReportRecord
} from '../../types/patientModule';

interface PatientOverviewProps {
  patient: PatientAccount;
  appointments: AppointmentRecord[];
  bills: BillingRecord[];
  medicalRecords: MedicalRecordItem[];
  prescriptions: PrescriptionRecord[];
  testReports: TestReportRecord[];
  onNavigateTab: (tab: PatientSidebarTab) => void;
  onBookAppointment: () => void;
}

export const PatientOverview: React.FC<PatientOverviewProps> = ({
  patient,
  appointments,
  bills,
  medicalRecords,
  prescriptions,
  testReports,
  onNavigateTab,
  onBookAppointment,
}) => {
  // 1. Total Appointments
  const totalAppointmentsCount = appointments.length;

  // 2. Upcoming Appointment
  const upcomingApt = appointments
    .filter((a) => a.status === 'Confirmed' || a.status === 'Pending')
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0];

  // 3. Completed Visits
  const completedVisitsCount = appointments.filter((a) => a.status === 'Completed').length + medicalRecords.length;

  // 4. Pending Bills
  const pendingBills = bills.filter((b) => b.payment_status === 'Pending');
  const pendingTotalAmount = pendingBills.reduce((acc, curr) => acc + curr.amount, 0);

  // Combined Recent Activity Items
  const activities = [
    ...appointments.map((a) => ({
      id: a.appointment_id,
      type: 'appointment',
      title: `Appointment with ${a.doctor_name}`,
      subtitle: `${a.specialization} • ${a.appointment_time}`,
      date: a.appointment_date,
      badge: a.status,
      badgeColor:
        a.status === 'Confirmed'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : a.status === 'Completed'
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : a.status === 'Cancelled'
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Calendar,
      iconColor: 'text-blue-600 bg-blue-50',
    })),
    ...prescriptions.map((p) => ({
      id: p.prescription_id,
      type: 'prescription',
      title: `Prescription: ${p.medicine}`,
      subtitle: `Prescribed by ${p.doctor_name} (${p.duration})`,
      date: p.prescription_date,
      badge: 'Active Rx',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: FileText,
      iconColor: 'text-teal-600 bg-teal-50',
    })),
    ...testReports.map((r) => ({
      id: r.report_id,
      type: 'report',
      title: `Diagnostic Report: ${r.test_name}`,
      subtitle: r.doctor_recommendation,
      date: r.test_date,
      badge: r.status,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Activity,
      iconColor: 'text-indigo-600 bg-indigo-50',
    })),
    ...bills.map((b) => ({
      id: b.bill_id,
      type: 'billing',
      title: `Hospital Invoice #${b.invoice_number}`,
      subtitle: `Amount: ৳${b.amount.toLocaleString()} • ${b.payment_method || 'Unpaid'}`,
      date: b.date,
      badge: b.payment_status,
      badgeColor:
        b.payment_status === 'Paid'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Receipt,
      iconColor: 'text-emerald-600 bg-emerald-50',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-teal-700 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-teal-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Patient Health Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {patient.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Your centralized digital health dashboard. Manage doctor appointments, view diagnosis
              prescriptions, check laboratory reports, and clear hospital bills securely.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBookAppointment}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-teal-800 hover:bg-teal-50 shadow-md transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigateTab('find_doctor')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/15 hover:bg-white/25 border border-white/25 text-white backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-teal-200" />
              <span>Find Doctor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 OVERVIEW METRIC CARDS (Requested by User) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Appointments */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              All Time
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Total Appointments</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
            {totalAppointmentsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>View booking history</span>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 2: Upcoming Appointment */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold border border-teal-100 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Scheduled
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Upcoming Appointment</span>
          <div className="text-sm font-bold text-slate-900 mt-1 truncate">
            {upcomingApt ? upcomingApt.doctor_name : 'No upcoming visit'}
          </div>
          <p className="text-[11px] text-teal-700 font-mono mt-0.5 font-semibold">
            {upcomingApt ? `${upcomingApt.appointment_date} at ${upcomingApt.appointment_time}` : 'Click to schedule now'}
          </p>
        </div>

        {/* Card 3: Completed Visits */}
        <div
          onClick={() => onNavigateTab('medical_history')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Recorded
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Completed Visits</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
            {completedVisitsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Medical examination history</span>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 4: Pending Bills */}
        <div
          onClick={() => onNavigateTab('billing')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border group-hover:scale-105 transition-transform ${
                pendingTotalAmount > 0
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}
            >
              <Receipt className="w-6 h-6" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                pendingTotalAmount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {pendingBills.length} Pending
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Pending Bills</span>
          <div
            className={`text-2xl font-black font-mono mt-0.5 ${
              pendingTotalAmount > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            ৳ {pendingTotalAmount.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            {pendingTotalAmount > 0 ? 'Click to pay online' : 'All invoices settled'}
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Main Grid: Upcoming Card + Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activity Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Recent Activity Timeline</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological history of appointments, prescriptions, diagnostic results & invoices.
                </p>
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No recent activity recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activities.slice(0, 6).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor} border border-slate-200/50`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider block sm:inline-block ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Patient Medical Profile Summary Card & Quick Actions */}
        <div className="space-y-6">
          {/* Patient Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={patient.avatar_url}
                alt={patient.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {patient.patient_id}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{patient.name}</h4>
                <p className="text-xs text-slate-500">{patient.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Blood Group</span>
                <span className="text-sm font-black text-rose-600 font-mono">{patient.blood_group}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Gender</span>
                <span className="text-sm font-bold text-slate-800">{patient.gender}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Date of Birth</span>
                <span className="text-xs font-semibold text-slate-800 font-mono">{patient.dob}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Phone</span>
                <span className="text-xs font-semibold text-slate-800 font-mono">{patient.phone}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('profile')}
              className="w-full py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center justify-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile & Password</span>
            </button>
          </div>

          {/* Quick Doctor Consultation Prompt */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl border border-teal-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Healthcare Reminder</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintain regular follow-ups with your cardiologist and general physician for preventative
              wellness and vital tracking.
            </p>
            <button
              onClick={() => onNavigateTab('find_doctor')}
              className="w-full py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Consult Available Doctors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
