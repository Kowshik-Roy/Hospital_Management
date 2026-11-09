import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bed,
  Bell,
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  CreditCard,
  FileText,
  HeartPulse,
  Hospital,
  Landmark,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  PhoneCall,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  Link,
  useNavigate,
} from 'react-router-dom';
import { OperationsPortal, OperationsRole } from './components/OperationsPortal';
import { PatientCarePortal } from './components/PatientCarePortal';
import { DoctorClinicalPortal } from './components/DoctorClinicalPortal';
import { AdminCommandPortal } from './components/AdminCommandPortal';
import { AiChatbot } from './components/AiChatbot';
import { AppointmentModal } from './components/AppointmentModal';
import { SymptomCheckerModal } from './components/SymptomCheckerModal';
import { DOCTORS_DATA, DEPARTMENTS_DATA, DEFAULT_HOSPITAL_SETTINGS } from './data/hospitalData';

const NursePortal = lazy(() => import('./components/NursePortal').then(({ NursePortal: portal }) => ({ default: portal })));
const ReceptionistPortal = lazy(() => import('./components/ReceptionistPortal').then(({ ReceptionistPortal: portal }) => ({ default: portal })));
const AccountantPortal = lazy(() => import('./components/AccountantPortal').then(({ AccountantPortal: portal }) => ({ default: portal })));
const LaboratoryPortal = lazy(() => import('./components/LaboratoryPortal').then(({ LaboratoryPortal: portal }) => ({ default: portal })));

type Role = 'patient' | 'doctor' | OperationsRole;
type Language = 'en' | 'bn';

type UserSession = {
  role: Role;
  name: string;
  email: string;
}

const translations = {
  en: {
    nav: [
      { label: 'Home', href: '#top' },
      { label: 'About Hospital', href: '#about' },
      { label: 'Departments', href: '#departments' },
      { label: 'Doctors', href: '#doctors' },
      { label: 'Services', href: '#services' },
      { label: 'Facilities', href: '#facilities' },
      { label: 'Emergency', href: '#emergency' },
      { label: 'Contact', href: '#contact' },
    ],
    public: {
      badge: 'Trusted by 30,000+ patients every year',
      headline: 'Advanced Healthcare Solutions with Compassion and Technology',
      subheadline: 'CarePulse Hospital delivers modern diagnostics, expert specialists, and seamless digital healthcare experiences for families, patients, and clinicians.',
      primaryButton: 'Book Appointment',
      secondaryButton: 'Contact Us',
      login: 'Login',
      openPortal: 'Open Portal',
      logout: 'Logout',
      backHome: 'Back Home',
      home: 'Home',
    },
    login: {
      header: 'Choose your hospital portal',
      subheader: 'Separate access for patients, doctors, and hospital management teams.',
      patient: 'Patient Login',
      doctor: 'Doctor Login',
      admin: 'Hospital Management Login',
      nurse: 'Nurse Login',
      receptionist: 'Receptionist Login',
      accountant: 'Accountant / Billing Login',
      laboratory: 'Laboratory Login',
      pharmacy: 'Pharmacy Login',
      patientDesc: 'Book appointments, view history, prescriptions, test reports, and billing information.',
      doctorDesc: 'Manage appointments, search patients, create prescriptions, and upload reports.',
      adminDesc: 'Manage doctors, patients, billing, hospital services, and system settings.',
      nurseDesc: 'Ward-scoped patient care, vital charting, medication administration, and shift handover.',
      receptionistDesc: 'Register patients, manage appointments and queues, coordinate admissions, and support front-desk communication.',
      accountantDesc: 'Track invoices, payments, insurance claims, and hospital expenses.',
      laboratoryDesc: 'Track specimens, enter results, manage verification, critical alerts, reports, inventory, and lab billing.',
      pharmacyDesc: 'Manage medicine stock, purchases, dispensing, and expiry alerts.',
      patientAction: 'Login as Patient',
      doctorAction: 'Login as Doctor',
      adminAction: 'Login as Management',
      staffAction: 'Open staff portal',
      secureAccess: 'Secure Access',
      roleAccess: 'Role Access',
      backHome: 'Back Home',
      adminEmail: 'Admin email',
      adminPassword: 'Password',
      adminSubmit: 'Sign in to Management Portal',
      adminCancel: 'Back to portal options',
      adminInvalid: 'Incorrect admin email or password.',
      adminDemo: 'Demo access: admin@carepulse.bd / Admin@123',
    },
    patient: {
      welcome: 'Welcome back',
      portal: 'Patient Portal',
      upcoming: 'Upcoming appointment',
      previous: 'Previous visits',
      prescription: 'Latest prescription',
      reports: 'Recent reports',
      bills: 'Pending bills',
      profile: 'My profile',
      recentPrescription: 'Recent prescription',
      recentReports: 'Recent test reports',
      pendingBills: 'Pending bills',
      cardTitle: 'Cardiology review',
      cardDoctor: 'Dr. Ayesha Rahman',
      token: 'Token #12',
    },
    doctor: {
      portal: 'Doctor Portal',
      search: 'Patient search',
      searchPlaceholder: 'Search by patient ID, name, or phone number',
      action: 'Search Patient',
      info: 'Patient information',
      diagnosis: 'Add diagnosis',
      prescription: 'Create prescription',
      notes: 'Medical notes',
      tests: 'Recommend tests',
      save: 'Save consultation',
    },
    admin: {
      portal: 'Hospital Management',
      overview: 'Performance overview',
      profile: 'Hospital profile',
      doctorMgmt: 'Doctor management',
      billing: 'Billing and payments',
      totalPatients: 'Total patients',
      revenue: 'Revenue',
      appointments: 'Appointments',
      departments: 'Departments',
    },
    common: {
      logout: 'Logout',
      openPortal: 'Open Portal',
      home: 'Home',
      about: 'About Hospital',
      departments: 'Departments',
      doctors: 'Doctors',
      services: 'Services',
      facilities: 'Facilities',
      contact: 'Contact',
      language: 'BN',
    },
  },
  bn: {
    nav: [
      { label: 'হোম', href: '#top' },
      { label: 'হাসপাতাল সম্পর্কে', href: '#about' },
      { label: 'বিভাগ', href: '#departments' },
      { label: 'ডাক্তার', href: '#doctors' },
      { label: 'সেবা', href: '#services' },
      { label: 'পরিকাঠামো', href: '#facilities' },
      { label: 'জরুরি সেবা', href: '#emergency' },
      { label: 'যোগাযোগ', href: '#contact' },
    ],
    public: {
      badge: 'প্রতি বছর ৩০,০০০+ রোগী আমাদের উপর আস্থা রাখেন',
      headline: 'সহমর্মিতা ও প্রযুক্তিতে উন্নত স্বাস্থ্যসেবা',
      subheadline: 'কেয়ারপালস হাসপাতাল আধুনিক ডায়াগনস্টিকস, বিশেষজ্ঞ চিকিৎসক এবং ব্যতিক্রমী ডিজিটাল স্বাস্থ্যসেবা নিশ্চিত করে।',
      primaryButton: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      secondaryButton: 'যোগাযোগ করুন',
      login: 'লগইন',
      openPortal: 'পোর্টাল খুলুন',
      logout: 'লগআউট',
      backHome: 'হোমে ফিরে যান',
      home: 'হোম',
    },
    login: {
      header: 'আপনার হাসপাতাল পোর্টাল নির্বাচন করুন',
      subheader: 'রোগী, ডাক্তার ও হাসপাতাল ম্যানেজমেন্টের জন্য আলাদা অ্যাক্সেস।',
      patient: 'রোগী লগইন',
      doctor: 'ডাক্তার লগইন',
      admin: 'হাসপাতাল ম্যানেজমেন্ট লগইন',
      nurse: 'নার্স লগইন',
      receptionist: 'রিসেপশনিস্ট লগইন',
      accountant: 'হিসাবরক্ষক / বিলিং লগইন',
      laboratory: 'ল্যাবরেটরি লগইন',
      pharmacy: 'ফার্মেসি লগইন',
      patientDesc: 'অ্যাপয়েন্টমেন্ট বুক, মেডিকেল হিস্ট্রি, প্রেসক্রিপশন, টেস্ট রিপোর্ট ও বিলিং দেখুন।',
      doctorDesc: 'অ্যাপয়েন্টমেন্ট পরিচালনা, রোগী খুঁজুন, প্রেসক্রিপশন লিখুন ও রিপোর্ট আপলোড করুন।',
      adminDesc: 'ডাক্তার, রোগী, বিলিং, হাসপাতাল পরিষেবা ও সেটিংস পরিচালনা করুন।',
      nurseDesc: 'ওয়ার্ডভিত্তিক রোগী সেবা, ভাইটাল পর্যবেক্ষণ, ওষুধ প্রদান ও শিফট হ্যান্ডওভার পরিচালনা করুন।',
      receptionistDesc: 'রোগী নিবন্ধন, অ্যাপয়েন্টমেন্ট ও কিউ পরিচালনা, ভর্তি সমন্বয় এবং ফ্রন্ট-ডেস্ক যোগাযোগ করুন।',
      accountantDesc: 'ইনভয়েস, পেমেন্ট, ইনস্যুরেন্স দাবি ও হাসপাতালের খরচ ট্র্যাক করুন।',
      laboratoryDesc: 'নমুনা ট্র্যাক, ফলাফল এন্ট্রি ও যাচাই, জরুরি সতর্কতা, রিপোর্ট, ইনভেন্টরি ও ল্যাব বিলিং পরিচালনা করুন।',
      pharmacyDesc: 'ওষুধের মজুত, ক্রয়, বিতরণ ও মেয়াদ শেষের সতর্কতা পরিচালনা করুন।',
      patientAction: 'রোগী হিসেবে লগইন',
      doctorAction: 'ডাক্তার হিসেবে লগইন',
      adminAction: 'ম্যানেজমেন্ট হিসেবে লগইন',
      staffAction: 'স্টাফ পোর্টাল খুলুন',
      secureAccess: 'নিরাপদ অ্যাক্সেস',
      roleAccess: 'রোল অ্যাক্সেস',
      backHome: 'হোমে ফিরে যান',
      adminEmail: 'অ্যাডমিন ইমেইল',
      adminPassword: 'পাসওয়ার্ড',
      adminSubmit: 'ম্যানেজমেন্ট পোর্টালে প্রবেশ করুন',
      adminCancel: 'পোর্টাল বিকল্পে ফিরে যান',
      adminInvalid: 'অ্যাডমিন ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।',
      adminDemo: 'ডেমো অ্যাক্সেস: admin@carepulse.bd / Admin@123',
    },
    patient: {
      welcome: 'স্বাগতম',
      portal: 'রোগী পোর্টাল',
      upcoming: 'আসন্ন অ্যাপয়েন্টমেন্ট',
      previous: 'পূর্ববর্তী ভিজিট',
      prescription: 'সর্বশেষ প্রেসক্রিপশন',
      reports: 'সাম্প্রতিক রিপোর্ট',
      bills: 'বকেয়া বিল',
      profile: 'আমার প্রোফাইল',
      recentPrescription: 'সাম্প্রতিক প্রেসক্রিপশন',
      recentReports: 'সাম্প্রতিক টেস্ট রিপোর্ট',
      pendingBills: 'বকেয়া বিল',
      cardTitle: 'কার্ডিওলজি রিভিউ',
      cardDoctor: 'ডাঃ আয়েশা রহমান',
      token: 'টোকেন #১২',
    },
    doctor: {
      portal: 'ডাক্তার পোর্টাল',
      search: 'রোগী খুঁজুন',
      searchPlaceholder: 'রোগীর আইডি, নাম বা ফোন দিয়ে খুঁজুন',
      action: 'রোগী খুঁজুন',
      info: 'রোগীর তথ্য',
      diagnosis: 'ডায়াগনোসিস যোগ করুন',
      prescription: 'প্রেসক্রিপশন তৈরি করুন',
      notes: 'মেডিকেল নোট',
      tests: 'টেস্টের সাজেশন',
      save: 'কনসালটেশন সংরক্ষণ করুন',
    },
    admin: {
      portal: 'হাসপাতাল ম্যানেজমেন্ট',
      overview: 'পারফরম্যান্স ওভারভিউ',
      profile: 'হাসপাতাল প্রোফাইল',
      doctorMgmt: 'ডাক্তার ম্যানেজমেন্ট',
      billing: 'বিলিং ও পেমেন্ট',
      totalPatients: 'মোট রোগী',
      revenue: 'রাজস্ব',
      appointments: 'অ্যাপয়েন্টমেন্ট',
      departments: 'বিভাগ',
    },
    common: {
      logout: 'লগআউট',
      openPortal: 'পোর্টাল খুলুন',
      home: 'হোম',
      about: 'হাসপাতাল সম্পর্কে',
      departments: 'বিভাগ',
      doctors: 'ডাক্তার',
      services: 'সেবা',
      facilities: 'পরিকাঠামো',
      contact: 'যোগাযোগ',
      language: 'EN',
    },
  },
} as const;

const departmentData = [
  { name: 'Cardiology', nameBn: 'হৃদরোগ বিভাগ', icon: HeartPulse, description: 'Advanced heart care and preventive screening.', descriptionBn: 'উন্নত হৃদরোগ চিকিৎসা ও প্রতিরোধমূলক পরীক্ষা।' },
  { name: 'Neurology', nameBn: 'নিউরোলজি', icon: Stethoscope, description: 'Brain, spine, and nervous system treatment plans.', descriptionBn: 'মস্তিষ্ক, মেরুদণ্ড ও স্নায়ুতন্ত্রের চিকিৎসা।' },
  { name: 'Orthopedics', nameBn: 'অর্থোপেডিকস', icon: Activity, description: 'Joint, bone, and mobility rehabilitation services.', descriptionBn: 'হাড়, জয়েন্ট ও চলনক্ষমতার পুনর্বাসন সেবা।' },
  { name: 'Surgery', nameBn: 'সার্জারি', icon: Activity, description: 'Safe surgical care supported by modern operating theatres.', descriptionBn: 'আধুনিক অপারেশন থিয়েটারে নিরাপদ শল্যচিকিৎসা।' },
  { name: 'General Medicine', nameBn: 'মেডিসিন', icon: Hospital, description: 'Primary care and chronic disease management.', descriptionBn: 'প্রাথমিক চিকিৎসা ও দীর্ঘমেয়াদি রোগ ব্যবস্থাপনা।' },
  { name: 'Pediatrics', nameBn: 'শিশু বিভাগ', icon: User, description: 'Family-focused care for infants, children, and teens.', descriptionBn: 'শিশু ও কিশোরদের জন্য পরিবারকেন্দ্রিক চিকিৎসা।' },
  { name: 'Dental', nameBn: 'ডেন্টাল', icon: Activity, description: 'Preventive and restorative oral healthcare.', descriptionBn: 'প্রতিরোধমূলক ও পুনর্গঠনমূলক মুখের স্বাস্থ্যসেবা।' },
  { name: 'ICU', nameBn: 'আইসিইউ', icon: ShieldCheck, description: 'Round-the-clock critical care and patient monitoring.', descriptionBn: '২৪ ঘণ্টা নিবিড় পরিচর্যা ও রোগী পর্যবেক্ষণ।' },
];

const doctorData = [
  { name: 'Dr. Ayesha Rahman', specialty: 'Cardiologist', experience: '12 years', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dr. Safwan Karim', specialty: 'Neurologist', experience: '10 years', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dr. Nabila Islam', specialty: 'Pediatrician', experience: '9 years', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dr. Mehedi Hasan', specialty: 'Orthopedic Surgeon', experience: '14 years', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
];

const testimonials = [
  { name: 'Rafique Ahmed', quote: 'The staff was compassionate and the digital appointment system saved me a lot of time. Truly world-class care.' },
  { name: 'Shamsun Nahar', quote: 'From emergency care to follow-up visits, CarePulse gave my family quick access to specialists and clear guidance.' },
  { name: 'Tanvir Hossain', quote: 'The doctor communication, billing clarity, and hospital environment are exceptional. I highly recommend it.' },
];

const patientRecords = [
  { id: 'PT-1001', name: 'Ayesha Rahman', age: 31, gender: 'Female', blood: 'O+', history: 'Asthma, seasonal allergies', lastVisit: '2026-10-11' },
  { id: 'PT-1002', name: 'Nazmul Hasan', age: 42, gender: 'Male', blood: 'A+', history: 'Hypertension, recovery from knee surgery', lastVisit: '2026-10-07' },
  { id: 'PT-1003', name: 'Faria Karim', age: 27, gender: 'Female', blood: 'B+', history: 'No major conditions', lastVisit: '2026-10-05' },
];

const homeNav = [
  { label: 'Home', href: '#top' },
  { label: 'About Hospital', href: '#about' },
  { label: 'Departments', href: '#departments' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Services', href: '#services' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Contact', href: '#contact' },
];

const getStoredSession = (): UserSession | null => {
  try {
    const raw = localStorage.getItem('carepulse_hospital_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ role, user, children }: { role: Role; user: UserSession | null; children: React.ReactNode }) => {
  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppShell = () => {
  const [user, setUser] = useState<UserSession | null>(getStoredSession);
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('carepulse_language') === 'bn' ? 'bn' : 'en');

  useEffect(() => {
    if (user) {
      localStorage.setItem('carepulse_hospital_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('carepulse_hospital_session');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('carepulse_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const handleLogin = (role: Role) => {
    const sessionMap: Record<Role, UserSession> = {
      patient: { role: 'patient', name: 'Rahim Uddin', email: 'rahim@carepulse.bd' },
      doctor: { role: 'doctor', name: 'Dr. Ahmed Rahman', email: 'ahmed.rahman@carepulse.bd' },
      admin: { role: 'admin', name: 'Hospital Admin', email: 'admin@carepulse.bd' },
      nurse: { role: 'nurse', name: 'Nusrat Jahan', email: 'nurse@carepulse.bd' },
      receptionist: { role: 'receptionist', name: 'Sadia Islam', email: 'reception@carepulse.bd' },
      accountant: { role: 'accountant', name: 'Tanvir Ahmed', email: 'accounts@carepulse.bd' },
      laboratory: { role: 'laboratory', name: 'Lab Technician', email: 'lab@carepulse.bd' },
      pharmacy: { role: 'pharmacy', name: 'Pharmacist', email: 'pharmacy@carepulse.bd' },
    };
    setUser(sessionMap[role]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<PublicHomePage user={user} onLogout={handleLogout} language={language} onToggleLanguage={setLanguage} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} user={user} language={language} onToggleLanguage={setLanguage} />} />
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient" user={user}>
            <PatientCarePortal name={user?.name ?? ''} email={user?.email ?? ''} onLogout={handleLogout} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor" user={user}>
            <DoctorClinicalPortal name={user?.name ?? ''} email={user?.email ?? ''} onLogout={handleLogout} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="admin" user={user}>
          <AdminCommandPortal name={user?.name ?? ''} email={user?.email ?? ''} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/nurse/dashboard" element={
        <ProtectedRoute role="nurse" user={user}>
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-600">Loading Nurse Portal…</div>}>
            <NursePortal name={user?.name ?? ''} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} onLogout={handleLogout} />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/receptionist/dashboard" element={
        <ProtectedRoute role="receptionist" user={user}>
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-600">Loading Reception Portal…</div>}>
            <ReceptionistPortal name={user?.name ?? ''} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} onLogout={handleLogout} />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/accountant/dashboard" element={
        <ProtectedRoute role="accountant" user={user}>
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-600">Loading Billing Portal…</div>}>
            <AccountantPortal name={user?.name ?? ''} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} onLogout={handleLogout} />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/laboratory/dashboard" element={
        <ProtectedRoute role="laboratory" user={user}>
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-600">Loading Laboratory Portal…</div>}>
            <LaboratoryPortal name={user?.name ?? ''} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} onLogout={handleLogout} />
          </Suspense>
        </ProtectedRoute>
      } />
      {(['pharmacy'] as OperationsRole[]).map((role) => (
        <Route key={role} path={`/${role}/dashboard`} element={
          <ProtectedRoute role={role} user={user}>
            <OperationsPortal role={role} name={user?.name ?? ''} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const PublicHomePage = ({ user, onLogout, language, onToggleLanguage }: { user: UserSession | null; onLogout: () => void; language: Language; onToggleLanguage: (value: Language) => void }) => {
  const navigate = useNavigate();
  const locale = translations[language];

  // Interactive Modals State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [activeDoctorDept, setActiveDoctorDept] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroStats = language === 'en'
    ? [
        { label: 'Emergency Response', value: '< 10 min' },
        { label: 'Verified Specialists', value: '45+' },
        { label: 'Patient Satisfaction', value: '98.5%' },
        { label: 'ICU & CCU Beds', value: '32 Units' },
      ]
    : [
        { label: 'জরুরি রেসপন্স', value: '< ১০ মিনিট' },
        { label: 'বিশেষজ্ঞ চিকিৎসক', value: '৪৫+' },
        { label: 'রোগী সন্তুষ্টি', value: '৯৮.৫%' },
        { label: 'আইসিইউ ও সিসিইউ বেড', value: '৩২টি ইউনিট' },
      ];

  const emergencyCards = language === 'en'
    ? [
        { label: 'ICU/CCU Beds', value: '14 Available', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' },
        { label: 'Emergency Ambulance', value: '4 On Standby', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-200' },
        { label: 'Emergency Hotline', value: '16263', color: 'bg-rose-500/15 border-rose-500/30 text-rose-200' },
        { label: 'Blood Bank', value: 'All Groups Active', color: 'bg-amber-500/15 border-amber-500/30 text-amber-200' },
      ]
    : [
        { label: 'আইসিইউ/সিসিইউ বেড', value: '১৪টি খালি আছে', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' },
        { label: 'জরুরি অ্যাম্বুলেন্স', value: '৪টি প্রস্তুত আছে', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-200' },
        { label: 'জরুরি হটলাইন', value: '১৬২৬৩', color: 'bg-rose-500/15 border-rose-500/30 text-rose-200' },
        { label: 'ব্লাড ব্যাংক', value: 'সব গ্রুপ সচল', color: 'bg-amber-500/15 border-amber-500/30 text-amber-200' },
      ];

  const aboutCards = language === 'en'
    ? [
        { icon: Hospital, title: 'Our Mission', text: 'To deliver compassionate, ethically grounded, and precision-driven healthcare using modern diagnostic systems and verified medical expertise.' },
        { icon: Landmark, title: 'Our Vision', text: 'To build Bangladesh’s premier integrated digital healthcare hub, setting new standards for patient outcomes and rapid medical access.' },
      ]
    : [
        { icon: Hospital, title: 'আমাদের মিশন', text: 'উন্নত রোগ নির্ণয় ব্যবস্থা ও বিশেষজ্ঞ চিকিৎসকদের সমন্বয়ে মানবিক, নৈতিক ও বিশ্বমানের স্বাস্থ্যসেবা নিশ্চিত করা।' },
        { icon: Landmark, title: 'আমাদের ভিশন', text: 'বাংলাদেশের শীর্ষস্থানীয় একীভূত ডিজিটাল হাসপাতাল ও স্বাস্থ্যসেবা হাব হিসেবে নিজেকে প্রতিষ্ঠিত করা।' },
      ];

  const serviceCards = language === 'en'
    ? [
        { title: 'Outpatient Care (OPD)', text: 'Fast-track specialist consultations, digital queue tokens, and integrated follow-ups.' },
        { title: 'Advanced Diagnostics', text: '24/7 fully automated pathology, 3T MRI, 128-Slice CT scan, and digital X-ray.' },
        { title: 'Inpatient & Critical Care', text: 'Clean private cabins, specialized ICU/CCU support, and round-the-clock nursing care.' },
        { title: 'Instant Online Booking', text: 'Real-time verified slot booking with automated SMS & digital printable token.' },
        { title: 'Digital EMR & Prescriptions', text: 'Lifetime access to physician-signed digital prescriptions and lab reports.' },
        { title: 'Ambulance & Trauma Fleet', text: 'GPS-tracked ICU ambulance fleet equipped with mobile ventilators and oxygen.' },
      ]
    : [
        { title: 'আউটপেশেন্ট কেয়ার (OPD)', text: 'দ্রুত বিশেষজ্ঞ চিকিৎসকের পরামর্শ, ডিজিটাল কিউ টোকেন এবং ফলোআপ সেবা।' },
        { title: 'উন্নত ডায়াগনস্টিকস', text: '২৪/৭ অটোমেটেড প্যাথলজি, ৩টি এমআরআই, ১২৮-স্লাইস সিটি স্ক্যান ও ডিজিটাল এক্স-রে।' },
        { title: 'ইনপেশেন্ট ও ক্রিটিক্যাল কেয়ার', text: 'অভিজাত প্রাইভেট কেবিন, সার্বক্ষণিক আইসিইউ/সিসিইউ ও সার্বক্ষণিক নার্সিং কেয়ার।' },
        { title: 'অনলাইন অ্যাপয়েন্টমেন্ট', text: 'মুহূর্তেই সময় বুক করুন এবং ডিজিটাল প্রিন্টযোগ্য টোকেন ও এসএমএস নিশ্চিতকরণ পান।' },
        { title: 'ডিজিটাল প্রেসক্রিপশন ও EMR', text: 'অনলাইন পোর্টাল থেকে যেকোনো সময় আপনার সকল প্রেসক্রিপশন ও রিপোর্ট দেখুন।' },
        { title: 'অ্যাম্বুলেন্স ও ট্রমা সেবা', text: 'জিপিএস ট্র্যাকিং, ভেন্টিলেটর ও অক্সিজেন সুবিধাসহ সার্বক্ষণিক অ্যাম্বুলেন্স বহর।' },
      ];

  const filteredDoctors = activeDoctorDept === 'all'
    ? DOCTORS_DATA
    : DOCTORS_DATA.filter(doc => doc.departmentId === activeDoctorDept);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. TOP 24/7 EMERGENCY & AI TICKER BAR */}
      <div className="bg-slate-950 text-slate-200 text-xs px-4 py-2 border-b border-slate-800 shadow-inner">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>{language === 'bn' ? 'জরুরি হটলাইন:' : '24/7 Hotline:'}</span>
              <a href="tel:16263" className="text-white hover:underline font-mono font-extrabold text-xs">16263</a>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span>{language === 'bn' ? 'আইসিইউ বেড:' : 'ICU Beds:'}</span>
              <span className="text-emerald-400 font-semibold">{language === 'bn' ? '১৪টি খালি' : '14 Available'}</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <span>{language === 'bn' ? 'জরুরি অ্যাম্বুলেন্স:' : 'Ambulance:'}</span>
              <span className="text-cyan-300 font-mono font-semibold">+880 1711-999888</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSymptomModalOpen(true)}
              className="flex items-center gap-1.5 text-[11px] text-cyan-300 hover:text-white font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 hover:border-cyan-500 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{language === 'bn' ? 'AI লক্ষণ পরীক্ষা' : 'AI Symptom Triage'}</span>
            </button>
            <div className="h-3 w-px bg-slate-800 hidden sm:block" />
            <button
              onClick={() => onToggleLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 hover:bg-slate-700 text-teal-300 transition"
            >
              {language === 'en' ? 'বাংলা' : 'ENGLISH'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. STICKY GLASSMORPHIC HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-xs transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-600/25 group-hover:scale-105 transition-transform">
              <HeartPulse className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-lg font-black tracking-tight text-slate-900">CarePulse</p>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-teal-100 text-teal-800">Hospital</span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700">Healthcare Information System</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 text-xs font-bold text-slate-600 lg:flex">
            {(translations[language].nav).map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-teal-700 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-600 after:transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Direct Booking Modal Button */}
            <button
              onClick={() => {
                setSelectedDoctorId(undefined);
                setIsBookingModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 hover:scale-[1.02] transition cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{locale.public.primaryButton}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/${user.role}/dashboard`)}
                  className="rounded-full border border-teal-600 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 transition cursor-pointer"
                >
                  {locale.public.openPortal}
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  {locale.public.logout}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:border-teal-500 hover:text-teal-700 transition"
              >
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>{locale.public.login}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-2">
            {(translations[language].nav).map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSelectedDoctorId(undefined);
                  setIsBookingModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white shadow-sm"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>{locale.public.primaryButton}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* 3. HERO SECTION WITH MESH GRADIENT & LIVE STATUS */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-50/70 via-white to-sky-50/60 py-12 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.12),transparent_35%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 items-center">
            {/* Left Content */}
            <div>
              {/* Trust Pill */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/90 bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-teal-800 shadow-sm">
                <BadgeCheck className="h-4 w-4 text-teal-600" />
                <span>{locale.public.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                {locale.public.headline}
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                {locale.public.subheadline}
              </p>

              {/* Quick Action CTAs */}
              <div className="mt-8 flex flex-wrap gap-3.5 items-center">
                <button
                  onClick={() => {
                    setSelectedDoctorId(undefined);
                    setIsBookingModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-teal-700/25 hover:shadow-2xl hover:shadow-teal-700/35 hover:-translate-y-0.5 transition cursor-pointer"
                >
                  <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{locale.public.primaryButton}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setIsSymptomModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-teal-300/80 bg-white/90 backdrop-blur-md px-5 py-3.5 text-sm sm:text-base font-bold text-teal-800 shadow-xs hover:border-teal-500 hover:bg-teal-50/50 transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-teal-600 animate-pulse" />
                  <span>{language === 'en' ? 'AI Symptom Checker' : 'AI লক্ষণ মূল্যায়ন'}</span>
                </button>

                <a
                  href="#doctors"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm sm:text-base font-bold text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  {language === 'en' ? 'Find Doctor' : 'ডাক্তার খুঁজুন'}
                </a>

                <a
                  href="tel:16263"
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-5 py-3.5 text-sm sm:text-base font-bold text-rose-800 hover:bg-rose-100 transition"
                >
                  <PhoneCall className="h-4 w-4 text-rose-600" />
                  <span>16263</span>
                </a>
              </div>

              {/* Stats Bar */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200/90 bg-white/80 p-3.5 shadow-xs backdrop-blur-sm">
                    <p className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Live Emergency Command Center */}
            <div id="emergency" className="relative scroll-mt-24">
              <div className="rounded-[32px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
                <div className="rounded-[26px] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-5 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                        {language === 'en' ? '24/7 Command Center' : '২৪/৭ কমান্ড সেন্টার'}
                      </span>
                      <h2 className="mt-1 text-2xl font-black">
                        {language === 'en' ? 'Live Hospital Status' : 'হাসপাতাল লাইভ স্ট্যাটাস'}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>{language === 'en' ? 'Active' : 'সচল'}</span>
                    </div>
                  </div>

                  {/* Status Metrics */}
                  <div className="mt-5 space-y-3">
                    {emergencyCards.map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 border backdrop-blur-md ${item.color}`}
                      >
                        <span className="text-xs font-semibold">{item.label}</span>
                        <span className="font-extrabold text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Hotline Call Card */}
                  <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-300 font-medium">
                        {language === 'en' ? 'Emergency Dispatch Ambulance' : 'জরুরি অ্যাম্বুলেন্স প্রেরণ'}
                      </p>
                      <p className="text-base font-extrabold text-white font-mono">16263 / 999</p>
                    </div>
                    <a
                      href="tel:16263"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Call Now' : 'কল করুন'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ABOUT SECTION */}
        <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                <Hospital className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'About CarePulse Hospital' : 'কেয়ারপালস হাসপাতাল সম্পর্কে'}</span>
              </div>
              <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                {language === 'en' ? 'A modern healthcare destination rooted in trust.' : 'বিশ্বাসের ওপর ভিত্তি করে আধুনিক স্বাস্থ্যসেবা গন্তব্য।'}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'CarePulse Hospital combines compassionate clinicians, advanced infrastructure, and intelligent digital systems to provide safe, patient-first healthcare for every age and condition.'
                  : 'কেয়ারপালস হাসপাতাল হৃদয়বান চিকিৎসক, আধুনিক অবকাঠামো ও দক্ষ ডিজিটাল সিস্টেম মিলিয়ে প্রতিটি বয়স ও শর্তের রোগীর জন্য নিরাপদ, রোগী-কেন্দ্রিক স্বাস্থ্যসেবা নিশ্চিত করে।'}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(language === 'en'
                  ? [['45+', 'Doctors'], ['8', 'Centres'], ['240', 'Beds'], ['24/7', 'Emergency']]
                  : [['৪৫+', 'ডাক্তার'], ['৮', 'সেন্টার'], ['২৪০', 'বেড'], ['২৪/৭', 'জরুরি সেবা']]
                ).map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
                    <p className="text-xl font-black text-teal-700">{value}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {aboutCards.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                    <item.icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. SPECIALIZED DEPARTMENTS SHOWCASE */}
        <section id="departments" className="bg-slate-100/70 py-16 border-y border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                {language === 'en' ? 'Clinical Excellence' : 'চিকিৎসা উৎকর্ষ'}
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                {language === 'en' ? 'Focused Care Across Major Disciplines' : 'বিশেষায়িত চিকিৎসা কেন্দ্রসমূহ'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {language === 'en' ? 'Equipped with precision medical tech and board-certified specialists.' : 'সর্বাধুনিক প্রযুক্তি এবং বোর্ড-প্রত্যয়িত বিশেষজ্ঞদের দ্বারা পরিচালিত।'}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {DEPARTMENTS_DATA.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:-translate-y-1 hover:shadow-lg hover:border-teal-400 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-cyan-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {dept.totalDoctors} {language === 'bn' ? 'চিকিৎসক' : 'Doctors'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {language === 'bn' ? dept.nameBn : dept.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {language === 'bn' ? dept.descriptionBn : dept.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                    <span>{dept.headDoctor}</span>
                    <button
                      onClick={() => {
                        setSelectedDoctorId(undefined);
                        setIsBookingModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-teal-700 transition"
                      title="অ্যাপয়েন্টমেন্ট বুক করুন"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. DOCTORS DIRECTORY WITH REAL-TIME BOOKING */}
        <section id="doctors" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                {language === 'en' ? 'Our Specialists' : 'বিশেষজ্ঞ চিকিৎসকবৃন্দ'}
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-900">
                {language === 'en' ? 'Book Direct Consultations' : 'অনলাইন ডাক্তারের সিরিয়াল বুকিং'}
              </h2>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveDoctorDept('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  activeDoctorDept === 'all'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {language === 'en' ? 'All Specialists' : 'সকল বিশেষজ্ঞ'}
              </button>
              {DEPARTMENTS_DATA.slice(0, 4).map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setActiveDoctorDept(dept.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    activeDoctorDept === dept.id
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? dept.name.split(' ')[0] : dept.nameBn.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs hover:-translate-y-1.5 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full bg-slate-100">
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-extrabold text-amber-500 shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      <span>{doctor.rating}</span>
                    </div>
                    {doctor.isAvailableToday && (
                      <div className="absolute bottom-3 left-3 bg-emerald-600/90 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs">
                        {language === 'bn' ? 'আজ উপস্থিত' : 'Available Today'}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                      {language === 'bn' ? doctor.specialtyBn : doctor.specialty}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-slate-900 leading-snug">
                      {language === 'bn' ? doctor.nameBn : doctor.name}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">{doctor.degrees}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-700">
                      🕒 {doctor.visitingHours}
                    </p>
                    <p className="mt-1 text-xs font-mono font-bold text-blue-700">
                      ৳ {doctor.consultFee.toLocaleString()} BDT
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setSelectedDoctorId(doctor.id);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Book Appointment' : 'সিরিয়াল বুক করুন'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. SERVICES SECTION */}
        <section id="services" className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                {language === 'en' ? 'Healthcare Services' : 'হাসপাতাল পরিষেবা'}
              </span>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                {language === 'en' ? 'Integrated Support From Diagnosis to Recovery' : 'রোগ নির্ণয় থেকে সুস্থতা পর্যন্ত একীভূত যত্ন'}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {serviceCards.map((service) => (
                <div key={service.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-300">{service.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CONTACT & INQUIRY SECTION */}
        <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] items-center">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                  {language === 'en' ? 'Connect With Us' : 'যোগাযোগ করুন'}
                </span>
                <h2 className="mt-3 text-3xl font-black text-slate-900">
                  {language === 'en' ? 'Visit CarePulse Medical Center' : 'কেয়ারপালস মেডিকেল সেন্টারে যোগাযোগ'}
                </h2>
                <div className="mt-6 space-y-4 text-slate-600 text-sm">
                  <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-teal-600 shrink-0" /> Plot 18, Road 7, Dhanmondi, Dhaka-1205</div>
                  <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-teal-600 shrink-0" /> Hotline: 16263 | Ambulance: +880 1711-999888</div>
                  <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-teal-600 shrink-0" /> help@carepulsehospital.org</div>
                  <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-teal-600 shrink-0" /> OPD: 08:00 AM - 10:00 PM | Emergency: 24/7</div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'en' ? 'Request Immediate Call Back' : 'জরুরি কল ব্যাক অনুরোধ'}
                </h3>
                <div className="mt-4 space-y-3.5">
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 shadow-2xs"
                    placeholder={language === 'en' ? 'Patient Name' : 'রোগীর নাম'}
                  />
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 shadow-2xs"
                    placeholder={language === 'en' ? 'Contact Phone (e.g. 01712-345678)' : 'মোবাইল নম্বর'}
                  />
                  <textarea
                    className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 shadow-2xs"
                    placeholder={language === 'en' ? 'Briefly describe condition or doctor preference' : 'সমস্যা বা পছন্দের ডাক্তারের নাম লিখুন'}
                  />
                  <button
                    onClick={() => alert(language === 'bn' ? 'ধন্যবাদ! আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।' : 'Thank you! Our care representative will contact you shortly.')}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-md shadow-teal-600/20 hover:shadow-lg transition cursor-pointer"
                  >
                    {language === 'en' ? 'Send Request' : 'অনুরোধ পাঠান'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-400 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-teal-400" />
              <p className="text-lg font-black text-white">CarePulse Hospital Information System</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'en' ? 'Govt. DGHS Reg: DGHS-REG-2024-8971 | 24/7 Precision Digital Care' : 'সরকারি রেজি: DGHS-REG-2024-8971 | ২৪/৭ ডিজিটাল স্বাস্থ্যসেবা'}
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#about" className="hover:text-white transition">{language === 'en' ? 'About' : 'সম্পর্কে'}</a>
            <a href="#departments" className="hover:text-white transition">{language === 'en' ? 'Departments' : 'বিভাগ'}</a>
            <a href="#doctors" className="hover:text-white transition">{language === 'en' ? 'Doctors' : 'ডাক্তার'}</a>
            <a href="#contact" className="hover:text-white transition">{language === 'en' ? 'Contact' : 'যোগাযোগ'}</a>
          </div>
        </div>
      </footer>

      {/* 10. FLOATING AI MEDICAL CHATBOT (CarePulse AI) */}
      <AiChatbot
        language={language}
        doctors={DOCTORS_DATA}
        onOpenBookingModal={(docId) => {
          setSelectedDoctorId(docId);
          setIsBookingModalOpen(true);
        }}
      />

      {/* 11. INTERACTIVE APPOINTMENT MODAL */}
      <AppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctors={DOCTORS_DATA}
        initialDoctorId={selectedDoctorId}
        onBookAppointment={(newApt) => {
          console.log('Booked Appointment:', newApt);
        }}
        language={language}
        hospitalSettings={DEFAULT_HOSPITAL_SETTINGS}
      />

      {/* 12. INTERACTIVE AI SYMPTOM TRIAGE MODAL */}
      <SymptomCheckerModal
        isOpen={isSymptomModalOpen}
        onClose={() => setIsSymptomModalOpen(false)}
        departments={DEPARTMENTS_DATA}
        onSelectDepartmentForBooking={() => {
          setIsSymptomModalOpen(false);
          setIsBookingModalOpen(true);
        }}
        language={language}
      />
    </div>
  );
};

const LoginPage = ({ onLogin, user, language, onToggleLanguage }: { onLogin: (role: Role) => void; user: UserSession | null; language: Language; onToggleLanguage: (value: Language) => void }) => {
  const navigate = useNavigate();
  const locale = translations[language];
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const loginOptions = [
    {
      role: 'patient' as Role,
      title: locale.login.patient,
      icon: User,
      description: locale.login.patientDesc,
      features: language === 'en' ? ['Book appointment', 'View medical history', 'View prescriptions', 'View billing'] : ['অ্যাপয়েন্টমেন্ট বুক', 'মেডিকেল হিস্ট্রি দেখুন', 'প্রেসক্রিপশন দেখুন', 'বিলিং দেখুন'],
      action: locale.login.patientAction,
    },
    {
      role: 'doctor' as Role,
      title: locale.login.doctor,
      icon: Stethoscope,
      description: locale.login.doctorDesc,
      features: language === 'en' ? ['Manage appointments', 'Search patients', 'Create prescriptions', 'Upload reports'] : ['অ্যাপয়েন্টমেন্ট পরিচালনা', 'রোগী খুঁজুন', 'প্রেসক্রিপশন লিখুন', 'রিপোর্ট আপলোড'],
      action: locale.login.doctorAction,
    },
    {
      role: 'admin' as Role,
      title: locale.login.admin,
      icon: Building2,
      description: locale.login.adminDesc,
      features: language === 'en' ? ['Manage hospital', 'Doctor management', 'Billing system', 'System settings'] : ['হাসপাতাল পরিচালনা', 'ডাক্তার ম্যানেজমেন্ট', 'বিলিং সিস্টেম', 'সিস্টেম সেটিংস'],
      action: locale.login.adminAction,
    },
    {
      role: 'nurse' as Role,
      title: locale.login.nurse,
      icon: Activity,
      description: locale.login.nurseDesc,
      features: language === 'en' ? ['Assigned patients', 'Vital charting & alerts', 'Medication & procedures', 'Notes & shift handover'] : ['বরাদ্দকৃত রোগী', 'ভাইটাল ও সতর্কতা', 'ওষুধ ও প্রক্রিয়া', 'নোট ও শিফট হ্যান্ডওভার'],
      action: locale.login.staffAction,
    },
    {
      role: 'receptionist' as Role,
      title: locale.login.receptionist,
      icon: CalendarDays,
      description: locale.login.receptionistDesc,
      features: language === 'en' ? ['Patient registration & search', 'Appointments & check-in', 'Queue & admission coordination', 'Emergency & communication'] : ['রোগী নিবন্ধন ও অনুসন্ধান', 'অ্যাপয়েন্টমেন্ট ও চেক-ইন', 'কিউ ও ভর্তি সমন্বয়', 'জরুরি সেবা ও যোগাযোগ'],
      action: locale.login.staffAction,
    },
    {
      role: 'accountant' as Role,
      title: locale.login.accountant,
      icon: Wallet,
      description: locale.login.accountantDesc,
      features: language === 'en' ? ['Invoices', 'Payment tracking', 'Insurance claims', 'Financial reports'] : ['ইনভয়েস', 'পেমেন্ট ট্র্যাকিং', 'ইনস্যুরেন্স দাবি', 'আর্থিক প্রতিবেদন'],
      action: locale.login.staffAction,
    },
    {
      role: 'laboratory' as Role,
      title: locale.login.laboratory,
      icon: Activity,
      description: locale.login.laboratoryDesc,
      features: language === 'en' ? ['Test & sample tracking', 'Result entry & verification', 'Critical result alerts', 'Reports & billing hand-off'] : ['টেস্ট ও নমুনা ট্র্যাকিং', 'ফলাফল এন্ট্রি ও যাচাই', 'জরুরি ফলাফল সতর্কতা', 'রিপোর্ট ও বিলিং'],
      action: locale.login.staffAction,
    },
    {
      role: 'pharmacy' as Role,
      title: locale.login.pharmacy,
      icon: ShieldCheck,
      description: locale.login.pharmacyDesc,
      features: language === 'en' ? ['Medicine stock', 'Prescription dispensing', 'Purchases', 'Expiry alerts'] : ['ওষুধের মজুত', 'প্রেসক্রিপশন অনুযায়ী বিতরণ', 'ক্রয়', 'মেয়াদ সতর্কতা'],
      action: locale.login.staffAction,
    },
  ];

  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">CarePulse</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{locale.login.secureAccess}</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleLanguage(language === 'en' ? 'bn' : 'en')}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300"
            >
              {language === 'en' ? 'BN' : 'EN'}
            </button>
            <Link to="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              {locale.login.backHome}
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">{locale.login.roleAccess}</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-5xl">{locale.login.header}</h1>
          <p className="mt-4 text-lg text-slate-600">{locale.login.subheader}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loginOptions.map(({ role, title, icon: Icon, description, features, action }) => (
            <div
              key={role}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 text-teal-700 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {role}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">{title}</h2>
                <p className="mt-2 text-xs leading-5 text-slate-500 line-clamp-2">{description}</p>

                <ul className="mt-4 space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
                  {features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                {role === 'admin' && adminLoginOpen ? (
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (adminEmail.trim().toLowerCase() !== 'admin@carepulse.bd' || adminPassword !== 'Admin@123') {
                        setAdminLoginError(locale.login.adminInvalid);
                        return;
                      }
                      setAdminLoginError('');
                      onLogin('admin');
                      navigate('/admin/dashboard');
                    }}
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="admin-email">{locale.login.adminEmail}</label>
                      <input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        required
                        value={adminEmail}
                        onChange={(event) => setAdminEmail(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition focus:border-teal-500"
                        placeholder="admin@carepulse.bd"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="admin-password">{locale.login.adminPassword}</label>
                      <input
                        id="admin-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={adminPassword}
                        onChange={(event) => setAdminPassword(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition focus:border-teal-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminEmail('admin@carepulse.bd');
                          setAdminPassword('Admin@123');
                        }}
                        className="text-teal-700 hover:underline font-bold"
                      >
                        ⚡ Auto-fill Demo
                      </button>
                    </div>

                    {adminLoginError && <p role="alert" className="text-xs font-semibold text-rose-600">{adminLoginError}</p>}

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:shadow-lg transition cursor-pointer"
                    >
                      <span>{locale.login.adminSubmit}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAdminLoginOpen(false); setAdminLoginError(''); }}
                      className="w-full py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      {locale.login.adminCancel}
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      if (role === 'admin') {
                        setAdminLoginOpen(true);
                        return;
                      }
                      onLogin(role);
                      navigate(`/${role}/dashboard`);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md hover:scale-[1.01] transition cursor-pointer"
                  >
                    <span>{action}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const pageShell = (label: string, children: React.ReactNode, user: UserSession, onLogout: () => void, language: Language, onToggleLanguage: (value: Language) => void) => {
  const navMap = {
    patient: [
      { label: 'Dashboard', icon: LayoutGrid },
      { label: 'My Profile', icon: User },
      { label: 'Find Doctor', icon: Search },
      { label: 'Book Appointment', icon: CalendarDays },
      { label: 'My Appointments', icon: CalendarDays },
      { label: 'Medical History', icon: FileText },
      { label: 'Prescription', icon: FileText },
      { label: 'Test Reports', icon: Activity },
      { label: 'Billing', icon: Wallet },
      { label: 'Notifications', icon: Bell },
    ],
    doctor: [
      { label: 'Dashboard', icon: LayoutGrid },
      { label: 'My Profile', icon: User },
      { label: "Today's Appointments", icon: CalendarDays },
      { label: 'Patient Search', icon: Search },
      { label: 'Patient History', icon: FileText },
      { label: 'Prescription', icon: FileText },
      { label: 'Medical Reports', icon: Activity },
      { label: 'Messages', icon: Bell },
    ],
    admin: [
      { label: 'Dashboard', icon: LayoutGrid },
      { label: 'Hospital Profile', icon: Building2 },
      { label: 'Doctor Management', icon: Users },
      { label: 'Patient Management', icon: Users },
      { label: 'Appointment Management', icon: CalendarDays },
      { label: 'Billing System', icon: CreditCard },
      { label: 'Payment Management', icon: Wallet },
      { label: 'Laboratory Management', icon: Activity },
      { label: 'Pharmacy Management', icon: ShieldCheck },
      { label: 'Staff Management', icon: Users },
      { label: 'Reports & Analytics', icon: Activity },
      { label: 'Settings', icon: Building2 },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-r border-slate-200 bg-slate-900 text-slate-100 lg:max-w-[280px]">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-black text-white">CarePulse</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
              </div>
            </div>
            <button
              onClick={() => onToggleLanguage(language === 'en' ? 'bn' : 'en')}
              className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-bold text-slate-200 lg:hidden"
            >
              {language === 'en' ? 'BN' : 'EN'}
            </button>
          </div>

          <div className="space-y-2 p-4">
            {navMap[user.role as keyof typeof navMap].map(({ label: itemLabel, icon: Icon }) => (
              <button
                key={itemLabel}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  itemLabel === 'Dashboard' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {itemLabel}
              </button>
            ))}

            <button
              onClick={onLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              {translations[language].common.logout}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">{translations[language].patient.welcome}</p>
              <h1 className="mt-1 text-2xl font-black text-slate-900">{user.name}</h1>
            </div>
            <button
              onClick={() => onToggleLanguage(language === 'en' ? 'bn' : 'en')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300"
            >
              {language === 'en' ? 'BN' : 'EN'}
            </button>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Portal</p>
                <p className="font-bold text-slate-900">{label}</p>
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

const PatientDashboard = ({ user, onLogout, language, onToggleLanguage }: { user: UserSession; onLogout: () => void; language: Language; onToggleLanguage: (value: Language) => void }) => {
  const locale = translations[language];
  const appointments = [
    { title: 'Cardiology Review', date: '2026-10-18', time: '09:30 AM', doctor: 'Dr. Ayesha Rahman' },
    { title: 'Lab Follow-up', date: '2026-10-21', time: '11:00 AM', doctor: 'Dr. Nabila Islam' },
  ];

  return pageShell(locale.patient.portal, (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: locale.patient.upcoming, value: '1', tone: 'bg-teal-50 text-teal-700' },
          { label: locale.patient.previous, value: '08', tone: 'bg-cyan-50 text-cyan-700' },
          { label: locale.patient.prescription, value: '3', tone: 'bg-indigo-50 text-indigo-700' },
          { label: locale.patient.reports, value: '2', tone: 'bg-amber-50 text-amber-700' },
          { label: locale.patient.bills, value: 'BDT 2,450', tone: 'bg-rose-50 text-rose-700' },
        ].map((card) => (
          <div key={card.label} className={`rounded-3xl border border-slate-200 p-5 ${card.tone}`}>
            <p className="text-xs font-bold uppercase tracking-[0.18em]">{card.label}</p>
            <p className="mt-3 text-2xl font-black">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">{locale.patient.upcoming}</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Confirmed</span>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">{locale.patient.cardTitle}</p>
                <h3 className="mt-2 text-2xl font-black">{locale.patient.cardDoctor}</h3>
              </div>
              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{locale.patient.token}</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-cyan-50">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Oct 18, 2026</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> 09:30 AM</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Previous visits</p>
              <p className="mt-2 text-xl font-black text-slate-900">08</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Latest prescription</p>
              <p className="mt-2 text-xl font-black text-slate-900">3 meds</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Recent reports</p>
              <p className="mt-2 text-xl font-black text-slate-900">2 files</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">{locale.patient.profile}</h2>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-700">AR</div>
            <div>
              <p className="font-black text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-600">Patient ID: PT-1001</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5"><span>Blood Group</span><span className="font-bold text-slate-900">O+</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5"><span>Gender</span><span className="font-bold text-slate-900">Female</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5"><span>Last Visit</span><span className="font-bold text-slate-900">Oct 11</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">{locale.patient.recentPrescription}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="rounded-2xl bg-slate-50 p-3">Amlodipine 5mg — once daily after meals</li>
            <li className="rounded-2xl bg-slate-50 p-3">Vitamin D3 — one tablet weekly</li>
          </ul>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">{locale.patient.recentReports}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="rounded-2xl bg-slate-50 p-3">CBC report — Normal</li>
            <li className="rounded-2xl bg-slate-50 p-3">ECG — Reviewed by cardiology</li>
          </ul>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">{locale.patient.pendingBills}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="rounded-2xl bg-slate-50 p-3">Consultation fee — BDT 1,750</li>
            <li className="rounded-2xl bg-slate-50 p-3">Diagnostic tests — BDT 700</li>
          </ul>
        </div>
      </div>
    </div>
  ), user, onLogout, language, onToggleLanguage);
};

const DoctorDashboard = ({ user, onLogout, language, onToggleLanguage }: { user: UserSession; onLogout: () => void; language: Language; onToggleLanguage: (value: Language) => void }) => {
  const locale = translations[language];
  const [query, setQuery] = useState('');
  const [patient, setPatient] = useState(patientRecords[0]);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('Amlodipine 5mg once daily after meals');
  const [notes, setNotes] = useState('Patient advised rest and hydration. Follow-up in 7 days.');

  const handleSearch = () => {
    const found = patientRecords.find((record) =>
      record.id.toLowerCase() === query.toLowerCase() ||
      record.name.toLowerCase().includes(query.toLowerCase()) ||
      record.id.includes(query)
    );
    if (found) {
      setPatient(found);
    }
  };

  return pageShell(locale.doctor.portal, (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">{locale.doctor.search}</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={locale.doctor.searchPlaceholder}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          />
          <button onClick={handleSearch} className="rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-5 py-3 text-sm font-bold text-white">{locale.doctor.action}</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">{locale.doctor.info}</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5"><span>Name</span><span className="font-bold text-slate-900">{patient.name}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5"><span>Age</span><span className="font-bold text-slate-900">{patient.age}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5"><span>Gender</span><span className="font-bold text-slate-900">{patient.gender}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5"><span>Blood Group</span><span className="font-bold text-slate-900">{patient.blood}</span></div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3"><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Medical history</span><p className="mt-2 font-bold text-slate-900">{patient.history}</p></div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3"><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Previous reports</span><p className="mt-2 font-bold text-slate-900">CBC Report, ECG Review</p></div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3"><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Previous prescriptions</span><p className="mt-2 font-bold text-slate-900">Amlodipine, Vitamin D3</p></div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Clinical note</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{locale.doctor.diagnosis}</label>
              <textarea value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} className="min-h-[110px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500" placeholder="Document diagnosis and notes..." />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{locale.doctor.prescription}</label>
              <textarea value={prescription} onChange={(event) => setPrescription(event.target.value)} className="min-h-[90px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{locale.doctor.notes}</label>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-[90px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{locale.doctor.tests}</label>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500" defaultValue="CBC, Lipid Profile, ECG" />
            </div>

            <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-5 py-3 text-sm font-bold text-white">{locale.doctor.save}</button>
          </div>
        </div>
      </div>
    </div>
  ), user, onLogout, language, onToggleLanguage);
};

const AdminDashboard = ({ user, onLogout, language, onToggleLanguage }: { user: UserSession; onLogout: () => void; language: Language; onToggleLanguage: (value: Language) => void }) => {
  const locale = translations[language];
  const metrics = [
    { label: 'Total patients', value: '12,480', color: 'bg-cyan-50 text-cyan-700' },
    { label: 'Revenue', value: 'BDT 8.4M', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Appointments', value: '1,290', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Departments', value: '16', color: 'bg-amber-50 text-amber-700' },
  ];

  return pageShell(locale.admin.portal, (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className={`rounded-[28px] border border-slate-200 p-5 ${item.color}`}>
            <p className="text-xs font-bold uppercase tracking-[0.18em]">{item.label}</p>
            <p className="mt-3 text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Performance overview</h2>
          <div className="mt-6 flex h-52 items-end gap-3">
            {[48, 70, 54, 82, 66, 92, 78].map((height, index) => (
              <div key={height} className="flex flex-1 flex-col items-center gap-3">
                <div className="w-full rounded-t-2xl bg-gradient-to-t from-teal-600 to-cyan-500" style={{ height: `${height}%` }} />
                <span className="text-xs font-semibold text-slate-500">{['M','T','W','T','F','S','S'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Hospital profile</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 px-3 py-3"><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Hospital name</span><p className="mt-2 font-bold text-slate-900">CarePulse Hospital</p></div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3"><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Address</span><p className="mt-2 font-bold text-slate-900">24 CarePulse Avenue, Dhaka</p></div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3"><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Contact</span><p className="mt-2 font-bold text-slate-900">+880 1712 345678</p></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Doctor management</h3>
          <div className="mt-4 space-y-3">
            {['Add doctor', 'Edit doctor', 'Delete doctor', 'Manage doctor schedule'].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Billing and payments</h3>
          <div className="mt-4 space-y-3">
            {['Generate invoices', 'Track payments', 'View transaction history'].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ), user, onLogout, language, onToggleLanguage);
};

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;

const LayoutGrid = () => <Activity className="h-4 w-4" />;
