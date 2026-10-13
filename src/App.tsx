import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bed,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
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
  Search,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  Wallet,
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

  const heroStats = language === 'en'
    ? [
        { label: 'Emergency Cases', value: '24/7' },
        { label: 'Specialists', value: '40+' },
        { label: 'Patient Satisfaction', value: '96%' },
      ]
    : [
        { label: 'জরুরি কেস', value: '২৪/৭' },
        { label: 'বিশেষজ্ঞ', value: '৪০+' },
        { label: 'রোগী সন্তুষ্টি', value: '৯৬%' },
      ];

  const emergencyCards = language === 'en'
    ? [
        { label: 'ICU Beds', value: '12 available', color: 'bg-emerald-500/15 text-emerald-200' },
        { label: 'Ambulance', value: 'On standby', color: 'bg-cyan-500/15 text-cyan-200' },
        { label: 'Emergency Hotline', value: '16263', color: 'bg-orange-500/15 text-orange-200' },
      ]
    : [
        { label: 'আইসিইউ বেড', value: '১২টি আছে', color: 'bg-emerald-500/15 text-emerald-200' },
        { label: 'অ্যাম্বুলেন্স', value: 'স্ট্যান্ডবাইতে', color: 'bg-cyan-500/15 text-cyan-200' },
        { label: 'ইমার্জেন্সি হটলাইন', value: '১৬২৬৩', color: 'bg-orange-500/15 text-orange-200' },
      ];

  const aboutCards = language === 'en'
    ? [
        { icon: Hospital, title: 'Mission', text: 'To provide high-quality, accessible, and human-centered care that improves health outcomes.' },
        { icon: Landmark, title: 'Vision', text: 'To become the leading digital hospital network recognized for excellence and innovation.' },
      ]
    : [
        { icon: Hospital, title: 'মিশন', text: 'উচ্চমানের, সহজলভ্য ও মানবকেন্দ্রিক সেবা প্রদান করে স্বাস্থ্য ফলাফল উন্নত করা।' },
        { icon: Landmark, title: 'ভিশন', text: 'অভিজ্ঞতা ও উদ্ভাবনের মাধ্যমে দেশনেতৃস্থানীয় ডিজিটাল হাসপাতাল নেটওয়ার্কে পরিণত হওয়া।' },
      ];

  const serviceCards = language === 'en'
    ? [
        { title: 'Outpatient Care', text: 'Fast access to specialist consultations, follow-ups, and treatment planning.' },
        { title: 'Diagnostics', text: 'Advanced lab services, imaging, and pathology with reliable turnaround times.' },
        { title: 'Inpatient Services', text: 'Comfortable rooms, ICU support, and safe patient monitoring for recovery.' },
        { title: 'Online Appointment', text: 'Book verified specialist visits and receive a digital token.' },
        { title: 'Digital Prescription', text: 'Access your clinician-approved treatment plan from your portal.' },
        { title: 'Ambulance & Emergency', text: 'Rapid emergency response and ambulance coordination, day and night.' },
      ]
    : [
        { title: 'আউটপেশেন্ট কেয়ার', text: 'দ্রুত বিশেষজ্ঞ পরামর্শ, ফলোআপ ও চিকিৎসা পরিকল্পনা।' },
        { title: 'ডায়াগনস্টিকস', text: 'উন্নত ল্যাব, ইমেজিং ও প্যাথলজি সেবার নির্ভরযোগ্য টার্নারাউন্ড সময়।' },
        { title: 'ইনপেশেন্ট সেবা', text: 'আরামদায়ক রুম, আইসিইউ সাপোর্ট ও নিরাপদ রিকভারি মনিটরিং।' },
        { title: 'অনলাইন অ্যাপয়েন্টমেন্ট', text: 'বিশেষজ্ঞ চিকিৎসকের সময় বুক করুন এবং ডিজিটাল টোকেন পান।' },
        { title: 'ডিজিটাল প্রেসক্রিপশন', text: 'পোর্টাল থেকে চিকিৎসকের অনুমোদিত চিকিৎসা পরিকল্পনা দেখুন।' },
        { title: 'অ্যাম্বুলেন্স ও জরুরি সেবা', text: 'দিনরাত দ্রুত জরুরি সেবা ও অ্যাম্বুলেন্স সমন্বয়।' },
      ];

  const facilityItems = language === 'en'
    ? [
        'Advanced ICU and CCU capabilities',
        'Digital medical records and appointment tracking',
        'Modern pharmacy and pathology support',
        'Round-the-clock emergency and ambulance services',
      ]
    : [
        'উন্নত আইসিইউ ও সিসিইউ সুবিধা',
        'ডিজিটাল মেডিকেল রেকর্ড ও অ্যাপয়েন্টমেন্ট ট্র্যাকিং',
        'আধুনিক ফার্মেসি ও প্যাথলজি সাপোর্ট',
        '২৪/৭ ইমার্জেন্সি ও অ্যাম্বুলেন্স সেবা',
      ];

  const facilityStats = language === 'en'
    ? [
        { label: 'ICU Beds', value: '18', icon: Bed },
        { label: 'Outpatient Visits', value: '8k+', icon: Users },
        { label: 'Lab Tests', value: '32k+', icon: FileText },
        { label: 'Emergency Response', value: '24/7', icon: Clock3 },
      ]
    : [
        { label: 'আইসিইউ বেড', value: '১৮', icon: Bed },
        { label: 'আউটপেশেন্ট ভিজিট', value: '৮k+', icon: Users },
        { label: 'ল্যাব টেস্ট', value: '৩২k+', icon: FileText },
        { label: 'ইমার্জেন্সি রেসপন্স', value: '২৪/৭', icon: Clock3 },
      ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/20">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-900">CarePulse</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700">Hospital & Wellness</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            {(translations[language].nav).map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-teal-700">{item.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleLanguage(language === 'en' ? 'bn' : 'en')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300"
            >
              {language === 'en' ? 'BN' : 'EN'}
            </button>
            {user ? (
              <>
                <button
                  onClick={() => navigate(`/${user.role}/dashboard`)}
                  className="hidden rounded-full border border-teal-600 px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-50 sm:inline-flex"
                >
                  {locale.public.openPortal}
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {locale.public.logout}
                </button>
              </>
            ) : (
              <Link to="/login" className="inline-flex items-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition hover:shadow-xl">
                {locale.public.login}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
                <BadgeCheck className="h-4 w-4" />
                {locale.public.badge}
              </div>

              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {locale.public.headline}
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-600">
                {locale.public.subheadline}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-600/30 transition hover:translate-y-[-1px]">
                  {locale.public.primaryButton} <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#doctors" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-base font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
                  {language === 'en' ? 'Find Doctor' : 'ডাক্তার খুঁজুন'}
                </a>
                <a href="tel:16263" className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-6 py-3.5 text-base font-bold text-rose-800 transition hover:border-rose-300 hover:bg-rose-100">
                  {language === 'en' ? 'Emergency Contact' : 'জরুরি যোগাযোগ'}
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="emergency" className="relative scroll-mt-24">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                <div className="rounded-[24px] bg-gradient-to-br from-slate-900 via-sky-900 to-teal-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">{language === 'en' ? '24/7 Medical Care' : '২৪/৭ মেডিকেল কেয়ার'}</p>
                      <h2 className="mt-2 text-3xl font-black">{language === 'en' ? 'Emergency Response' : 'ইমার্জেন্সি রেসপন্স'}</h2>
                    </div>
                    <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200">{language === 'en' ? 'Live' : 'লাইভ'}</div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {emergencyCards.map((item) => (
                      <div key={item.label} className={`flex items-center justify-between rounded-2xl px-4 py-3 ${item.color}`}>
                        <span className="text-sm font-semibold">{item.label}</span>
                        <span className="font-black">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">{language === 'en' ? 'About CarePulse' : 'কেয়ারপালস সম্পর্কে'}</p>
              <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">{language === 'en' ? 'A modern healthcare destination rooted in trust.' : 'বিশ্বাসের ওপর ভিত্তি করে আধুনিক স্বাস্থ্যসেবা গন্তব্য।'}</h2>
              <p className="mt-5 text-lg text-slate-600">
                {language === 'en'
                  ? 'CarePulse Hospital combines compassionate clinicians, advanced infrastructure, and efficient digital systems to provide safe, patient-first healthcare for every age and condition.'
                  : 'কেয়ারপালস হাসপাতাল হৃদয়বান চিকিৎসক, আধুনিক অবকাঠামো ও দক্ষ ডিজিটাল সিস্টেম মিলিয়ে প্রতিটি বয়স ও শর্তের রোগীর জন্য নিরাপদ, রোগী-কেন্দ্রিক স্বাস্থ্যসেবা প্রদান করে।'}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(language === 'en'
                  ? [['40+', 'Doctors'], ['8', 'Departments'], ['240', 'Beds'], ['24/7', 'Emergency']]
                  : [['৪০+', 'ডাক্তার'], ['৮', 'বিভাগ'], ['২৪০', 'বেড'], ['২৪/৭', 'জরুরি সেবা']]
                ).map(([value, label]) => <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xl font-black text-teal-800">{value}</p><p className="mt-1 text-xs font-medium text-slate-600">{label}</p></div>)}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {aboutCards.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="departments" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">{language === 'en' ? 'Departments' : 'বিভাগ'}</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900">{language === 'en' ? 'Focused care across major medical disciplines' : 'প্রধান চিকিৎসা শাখায় বিশেষায়িত যত্ন'}</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {departmentData.map(({ name, nameBn, icon: Icon, description, descriptionBn }) => (
                <div key={name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{language === 'en' ? name : nameBn}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{language === 'en' ? description : descriptionBn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="doctors" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">{language === 'en' ? 'Doctors' : 'ডাক্তার'}</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">{language === 'en' ? 'Meet the specialists behind every recovery' : 'প্রতিটি সুস্থতার পেছনে থাকা বিশেষজ্ঞদের সাক্ষাৎ'}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {doctorData.map((doctor) => (
              <div key={doctor.name} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img src={doctor.image} alt={doctor.name} className="h-64 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{doctor.specialty}</p>
                  <h3 className="mt-2 text-xl font-black text-slate-900">{doctor.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{doctor.experience} {language === 'en' ? 'of clinical experience' : 'ক্লিনিক্যাল অভিজ্ঞতা'}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">{language === 'en' ? 'Available today' : 'আজ চেম্বার করবেন'}</p>
                  <div className="mt-4 flex gap-2">
                    <a href="#contact" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-bold text-slate-700 hover:border-teal-600 hover:text-teal-700">{language === 'en' ? 'View Profile' : 'প্রোফাইল'}</a>
                    <Link to="/login" className="flex-1 rounded-lg bg-teal-700 px-3 py-2 text-center text-xs font-bold text-white hover:bg-teal-800">{language === 'en' ? 'Book Appointment' : 'অ্যাপয়েন্টমেন্ট'}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="bg-gradient-to-br from-slate-900 to-sky-950 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">{language === 'en' ? 'Services' : 'সেবা'}</p>
              <h2 className="mt-3 text-3xl font-black">{language === 'en' ? 'Integrated support from diagnosis to recovery' : 'রোগ নির্ণয় থেকে সুস্থতার জন্য একীভূত সহায়তা'}</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {serviceCards.map((service) => (
                <div key={service.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-200">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{service.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="facilities" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">{language === 'en' ? 'Facilities' : 'পরিকাঠামো'}</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">{language === 'en' ? 'Designed for comfort, safety, and precision' : 'আরাম, নিরাপত্তা ও নির্ভুলতার জন্য ডিজাইন'}</h2>

              <div className="mt-6 space-y-4">
                {facilityItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-4 w-4" /></div>
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {facilityStats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700"><Icon className="h-5 w-5" /></div>
                    <p className="text-2xl font-black text-slate-900">{value}</p>
                    <p className="mt-1 text-sm text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">{language === 'en' ? 'Testimonials' : 'রোগীর অভিজ্ঞতা'}</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">{language === 'en' ? 'Patients trust CarePulse for life-changing care' : 'রোগীরা জীবন বদলানো সেবার জন্য কেয়ারপালসের উপর আস্থা রাখেন'}</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-1 text-amber-400">★★★★★</div>
                  <p className="text-base leading-7 text-slate-700">“{item.quote}”</p>
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">{language === 'en' ? 'Contact' : 'যোগাযোগ'}</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900">{language === 'en' ? 'Visit or connect with our care team' : 'আমাদের যত্ন টিমকে দেখে বা সংযুক্ত হন'}</h2>
                <div className="mt-6 space-y-4 text-slate-600">
                  <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-teal-700" /> 24 CarePulse Avenue, Dhaka 1212</div>
                  <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-teal-700" /> +880 1712 345678</div>
                  <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-teal-700" /> hello@carepulse.bd</div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <h3 className="text-xl font-black text-slate-900">{language === 'en' ? 'Book a consultation' : 'কনসালটেশন বুক করুন'}</h3>
                <div className="mt-5 space-y-4">
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-teal-500" placeholder={language === 'en' ? 'Full name' : 'পুরো নাম'} />
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500" placeholder={language === 'en' ? 'Email address' : 'ইমেইল ঠিকানা'} />
                  <textarea className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500" placeholder={language === 'en' ? 'Tell us how we can help' : 'আমরা কীভাবে সহায়তা করতে পারি তা লিখুন'} />
                  <button className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-teal-600/20">{language === 'en' ? 'Send Enquiry' : 'অনুসন্ধা পাঠান'}</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xl font-black text-white">CarePulse Hospital</p>
            <p className="mt-2 text-sm text-slate-400">{language === 'en' ? 'Modern healthcare for a healthier community.' : 'সুস্থ সমাজের জন্য আধুনিক স্বাস্থ্যসেবা।'}</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <a href="#about" className="transition hover:text-white">{language === 'en' ? 'About' : 'সম্পর্কে'}</a>
            <a href="#departments" className="transition hover:text-white">{language === 'en' ? 'Departments' : 'বিভাগ'}</a>
            <a href="#contact" className="transition hover:text-white">{language === 'en' ? 'Contact' : 'যোগাযোগ'}</a>
          </div>
        </div>
      </footer>
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

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {loginOptions.map(({ role, title, icon: Icon, description, features, action }) => (
            <div key={role} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 text-teal-700">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {role === 'admin' && adminLoginOpen ? (
                <form
                  className="mt-6 space-y-3"
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
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="admin-email">{locale.login.adminEmail}</label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={adminEmail}
                    onChange={(event) => setAdminEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                    placeholder="admin@carepulse.bd"
                  />
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="admin-password">{locale.login.adminPassword}</label>
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={adminPassword}
                    onChange={(event) => setAdminPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-slate-500">{locale.login.adminDemo}</p>
                  {adminLoginError && <p role="alert" className="text-sm font-semibold text-rose-600">{adminLoginError}</p>}
                  <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-teal-600/20 transition hover:translate-y-[-1px]">
                    {locale.login.adminSubmit}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => { setAdminLoginOpen(false); setAdminLoginError(''); }} className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
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
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-teal-600/20 transition hover:translate-y-[-1px]"
                >
                  {action}
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
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
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;

const LayoutGrid = () => <Activity className="h-4 w-4" />;
