import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Search,
  CalendarPlus,
  CalendarCheck,
  FileText,
  Pill,
  Activity,
  Receipt,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ShieldCheck,
  Heart,
  Droplet,
  Bell,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Scan
} from 'lucide-react';
import {
  AppointmentRecord,
  BillingRecord,
  DoctorItem,
  MedicalRecordItem,
  PatientAccount,
  PatientSidebarTab,
  PrescriptionRecord,
  TestReportRecord
} from '../../types/patientModule';
import { PatientDB } from '../../services/patientService';
import { PatientOverview } from './PatientOverview';
import { PatientProfile } from './PatientProfile';
import { DoctorSearch } from './DoctorSearch';
import { AppointmentBookingWizard } from './AppointmentBookingWizard';
import { AppointmentHistory } from './AppointmentHistory';
import { MedicalHistory } from './MedicalHistory';
import { PrescriptionList } from './PrescriptionList';
import { TestReportList } from './TestReportList';
import { BillingList } from './BillingList';
import { SymptomChecker } from './SymptomChecker';

interface PatientDashboardProps {
  currentPatient: PatientAccount;
  onLogout: () => void;
  onSwitchPortal?: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentPatient: initialPatient,
  onLogout,
  onSwitchPortal,
}) => {
  const [patient, setPatient] = useState<PatientAccount>(initialPatient);
  const [activeTab, setActiveTab] = useState<PatientSidebarTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleSelectTab = (tab: PatientSidebarTab) => {
    setActiveTab(tab);
    if (!isPinned) {
      setIsSidebarOpen(false);
    }
  };

  // Core Data States
  const [doctors, setDoctors] = useState<DoctorItem[]>(() => PatientDB.getDoctors());
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(() =>
    PatientDB.getAppointments(patient.patient_id)
  );
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordItem[]>(() =>
    PatientDB.getMedicalRecords(patient.patient_id)
  );
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(() =>
    PatientDB.getPrescriptions(patient.patient_id)
  );
  const [testReports, setTestReports] = useState<TestReportRecord[]>(() =>
    PatientDB.getTestReports(patient.patient_id)
  );
  const [bills, setBills] = useState<BillingRecord[]>(() =>
    PatientDB.getBills(patient.patient_id)
  );

  // Pre-selected doctor if navigating from "Find Doctor" -> "Book Appointment"
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>(undefined);

  // Sync data whenever active patient changes
  useEffect(() => {
    setPatient(initialPatient);
    setAppointments(PatientDB.getAppointments(initialPatient.patient_id));
    setMedicalRecords(PatientDB.getMedicalRecords(initialPatient.patient_id));
    setPrescriptions(PatientDB.getPrescriptions(initialPatient.patient_id));
    setTestReports(PatientDB.getTestReports(initialPatient.patient_id));
    setBills(PatientDB.getBills(initialPatient.patient_id));
  }, [initialPatient]);

  // Handler: When doctor selected from DoctorSearch
  const handleSelectDoctorForBooking = (doc: DoctorItem) => {
    setBookingDoctorId(doc.doctor_id);
    setActiveTab('book_appointment');
  };

  // Handler: When appointment is booked successfully
  const handleAppointmentBooked = (newApt: AppointmentRecord) => {
    setAppointments(PatientDB.getAppointments(patient.patient_id));
    setBills(PatientDB.getBills(patient.patient_id));
    setBookingDoctorId(undefined);
    setActiveTab('appointments');
  };

  // 10 EXACT SIDEBAR MENU ITEMS REQUESTED BY USER:
  // 1. Dashboard
  // 2. My Profile
  // 3. Find Doctor
  // 4. Book Appointment
  // 5. My Appointments
  // 6. Medical History
  // 7. Prescription
  // 8. Test Reports
  // 9. Billing
  // 10. Logout
  const menuItems = [
    {
      id: 'dashboard' as PatientSidebarTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'profile' as PatientSidebarTab,
      label: 'My Profile',
      icon: User,
      badge: null,
    },
    {
      id: 'find_doctor' as PatientSidebarTab,
      label: 'Find Doctor',
      icon: Search,
      badge: doctors.length.toString(),
    },
    {
      id: 'book_appointment' as PatientSidebarTab,
      label: 'Book Appointment',
      icon: CalendarPlus,
      badge: 'New',
    },
    {
      id: 'appointments' as PatientSidebarTab,
      label: 'My Appointments',
      icon: CalendarCheck,
      badge: appointments.length.toString(),
    },
    {
      id: 'medical_history' as PatientSidebarTab,
      label: 'Medical History',
      icon: FileText,
      badge: medicalRecords.length.toString(),
    },
    {
      id: 'prescriptions' as PatientSidebarTab,
      label: 'Prescription',
      icon: Pill,
      badge: prescriptions.length.toString(),
    },
    {
      id: 'test_reports' as PatientSidebarTab,
      label: 'Test Reports',
      icon: Activity,
      badge: testReports.length.toString(),
    },
    {
      id: 'billing' as PatientSidebarTab,
      label: 'Billing',
      icon: Receipt,
      badge: bills.filter((b) => b.payment_status === 'Pending').length > 0 ? 'Due' : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'symptom_checker' as PatientSidebarTab,
      label: 'AI Symptom Checker',
      icon: Scan,
      badge: 'AI',
      badgeColor: 'bg-blue-600 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-['Plus_Jakarta_Sans',sans-serif] selection:bg-teal-500 selection:text-white">
      {/* Menu Backdrop for all screens */}
      {isSidebarOpen && !isPinned && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* ======================================================== */}
      {/* SIDEBAR NAVIGATION (10 Items) */}
      {/* ======================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 shadow-2xl ${
          isPinned ? 'lg:translate-x-0' : ''
        } ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Hospital Brand Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
                <Heart className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
                  CarePulse Hospital
                </h1>
                <p className="text-[10px] font-bold text-teal-700">Patient Health Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPinned((prev) => !prev)}
                className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  isPinned ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={isPinned ? 'পিন আনলক করুন (ক্লিক করলে সরে যাবে)' : 'সাইডবার স্থায়ী পিন করুন'}
              >
                <span>{isPinned ? '📌 পিন্ড' : '📌 পিন'}</span>
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="নেভিগেশন বার বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Patient Quick Card */}
          <div className="p-4 mx-4 my-3 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200/80 flex items-center gap-3">
            <div className="relative">
              <img
                src={patient.avatar_url}
                alt={patient.name}
                className="w-11 h-11 rounded-xl object-cover border-2 border-teal-500 shadow-xs shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full text-[8px] font-black uppercase bg-teal-600 text-white">
                {patient.blood_group}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-blue-700 uppercase block">
                {patient.patient_id}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate">{patient.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">{patient.phone}</p>
            </div>
          </div>

          {/* 10 Sidebar Navigation Menu Items */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-blue-700 text-white shadow-md shadow-teal-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.badgeColor ||
                        (isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Item 10: Logout */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-200"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span>10. Logout</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isPinned ? 'lg:pl-72' : 'pl-0'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all"
              title="নেভিগেশন মেনু খুলুন / বন্ধ করুন"
            >
              <Menu className="w-4 h-4" />
              <span>{isSidebarOpen ? 'মেনু বন্ধ' : 'মেনু ও নেভিগেশন'}</span>
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 capitalize flex items-center gap-2">
                <span>
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'profile' && 'My Profile & Security'}
                  {activeTab === 'find_doctor' && 'Specialist Doctor Search'}
                  {activeTab === 'book_appointment' && 'Book New Appointment'}
                  {activeTab === 'appointments' && 'Appointment Records & History'}
                  {activeTab === 'medical_history' && 'Electronic Medical History'}
                  {activeTab === 'prescriptions' && 'Active Doctor Prescriptions'}
                  {activeTab === 'test_reports' && 'Diagnostic Lab Test Reports'}
                  {activeTab === 'billing' && 'Billing & Financial Invoices'}
                  {activeTab === 'symptom_checker' && 'AI Symptom Checker & Guidance'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CarePulse OPD Services Active</span>
            </div>

            <button
              onClick={() => {
                setBookingDoctorId(undefined);
                setActiveTab('book_appointment');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Appointment</span>
            </button>
          </div>
        </header>

        {/* Dynamic Screen View Based on Active Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Tab 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <PatientOverview
              patient={patient}
              appointments={appointments}
              bills={bills}
              medicalRecords={medicalRecords}
              prescriptions={prescriptions}
              testReports={testReports}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onBookAppointment={() => {
                setBookingDoctorId(undefined);
                setActiveTab('book_appointment');
              }}
            />
          )}

          {/* Tab 2: My Profile */}
          {activeTab === 'profile' && (
            <PatientProfile
              patient={patient}
              onUpdatePatient={(updated) => setPatient(updated)}
            />
          )}

          {/* Tab 3: Find Doctor */}
          {activeTab === 'find_doctor' && (
            <DoctorSearch
              doctors={doctors}
              onSelectDoctorForBooking={handleSelectDoctorForBooking}
            />
          )}

          {/* Tab 4: Book Appointment */}
          {activeTab === 'book_appointment' && (
            <AppointmentBookingWizard
              patient={patient}
              doctors={doctors}
              preSelectedDoctorId={bookingDoctorId}
              onAppointmentBooked={handleAppointmentBooked}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {/* Tab 5: My Appointments */}
          {activeTab === 'appointments' && (
            <AppointmentHistory
              appointments={appointments}
              onAppointmentsChange={setAppointments}
              onBookNew={() => {
                setBookingDoctorId(undefined);
                setActiveTab('book_appointment');
              }}
            />
          )}

          {/* Tab 6: Medical History */}
          {activeTab === 'medical_history' && (
            <MedicalHistory medicalRecords={medicalRecords} />
          )}

          {/* Tab 7: Prescription */}
          {activeTab === 'prescriptions' && (
            <PrescriptionList patient={patient} prescriptions={prescriptions} />
          )}

          {/* Tab 8: Test Reports */}
          {activeTab === 'test_reports' && (
            <TestReportList patient={patient} testReports={testReports} />
          )}

          {/* Tab 9: Billing */}
          {activeTab === 'billing' && (
            <BillingList
              patient={patient}
              bills={bills}
              onBillsChange={setBills}
            />
          )}

          {/* Tab 10: AI Symptom Checker */}
          {activeTab === 'symptom_checker' && (
            <SymptomChecker
              patient={patient}
              onBookAppointment={(specialization) => {
                setBookingDoctorId(undefined);
                setActiveTab('book_appointment');
              }}
            />
          )}
        </main>
      </div>

      {/* Tab 10 / Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Patient Logout</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to end your current session? You will be redirected to the secure login page.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  onLogout();
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
