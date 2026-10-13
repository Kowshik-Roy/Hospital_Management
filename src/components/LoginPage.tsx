import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  Building2,
  Activity,
  FileText,
  CreditCard,
  ShieldCheck,
  Heart,
  Receipt,
  Bed,
  Check,
  BadgeCheck
} from 'lucide-react';
import { AuthUser, HospitalSettings, UserRole } from '../types/hospital';
import { Language, translations } from '../i18n/translations';
import { PRESET_AUTH_USERS } from '../data/hospitalData';

interface LoginPageProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  hospitalSettings: HospitalSettings;
  onLogin: (user: AuthUser) => void;
  onOpenSettingsModal?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  onToggleLanguage,
  hospitalSettings,
  onLogin,
  onOpenSettingsModal,
}) => {
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin' | 'cashier'>('patient');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const activeHospitalTitle = language === 'bn'
    ? (hospitalSettings.hospitalNameBn || hospitalSettings.hospitalName)
    : hospitalSettings.hospitalName;

  const activeHospitalTagline = language === 'bn'
    ? (hospitalSettings.taglineBn || hospitalSettings.tagline)
    : hospitalSettings.tagline;

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = PRESET_AUTH_USERS[selectedRole];
    const userToLogin: AuthUser = {
      id: `user-${Date.now()}`,
      role: selectedRole,
      name: fullName.trim() || preset.name,
      nameBn: fullName.trim() || preset.nameBn,
      email: emailOrPhone.includes('@') ? emailOrPhone : preset.email,
      phone: emailOrPhone.startsWith('+') || emailOrPhone.startsWith('01') ? emailOrPhone : preset.phone,
      title: selectedRole === 'admin'
        ? (language === 'bn' ? 'সুপার অ্যাডমিন' : 'Hospital Super Administrator')
        : selectedRole === 'doctor'
        ? (language === 'bn' ? 'হাসপাতাল ম্যানেজমেন্ট ও চিকিৎসক' : 'Clinical Management & Doctor')
        : selectedRole === 'cashier'
        ? (language === 'bn' ? 'হাসপাতাল বিলিং ও ক্যাশ কাউন্টার' : 'Hospital Billing & POS Cashier')
        : (language === 'bn' ? 'নিবন্ধিত রোগী' : 'Registered Patient'),
      patientId: selectedRole === 'patient' ? 'pat-1' : undefined,
      doctorId: selectedRole === 'doctor' ? 'doc-2' : undefined,
      avatarUrl: preset.avatarUrl,
    };
    onLogin(userToLogin);
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = (role: 'patient' | 'doctor' | 'admin' | 'cashier') => {
    const preset = PRESET_AUTH_USERS[role];
    onLogin(preset);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-600/20 text-white">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate max-w-[200px] sm:max-w-none">
              {activeHospitalTitle}
            </h1>
            <p className="text-[11px] text-teal-700 font-semibold">
              {language === 'bn' ? 'হাসপাতাল ইনফরমেশন ও ম্যানেজমেন্ট সিস্টেম (HIS)' : 'Hospital Information System (HIS)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSettingsModal && (
            <button
              onClick={onOpenSettingsModal}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">{language === 'bn' ? 'হাসপাতাল সেটিংস' : 'Hospital Settings'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                language === 'en' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('bn')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                language === 'bn' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col justify-center">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নিরাপদ হেলথকেয়ার অথেনটিকেশন পোর্টাল' : 'Secure Healthcare Access Portal'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'হাসপাতাল অ্যাকাউন্টে লগইন করুন' : 'Sign in to Healthcare Portal'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'bn'
              ? 'রোগী, হাসপাতাল ব্যবস্থাপনা এবং সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য পৃথক ডেডিকেটেড লগইন পোর্টাল।'
              : 'Dedicated access portals for Patients, Hospital Management & Super Administrators.'}
          </p>
        </div>

        {/* 4 DISTINCT ROLE LOGIN CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: PATIENT PORTAL */}
          <div
            onClick={() => setSelectedRole('patient')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
              selectedRole === 'patient'
                ? 'border-teal-600 shadow-md ring-2 ring-teal-600/10'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  {language === 'bn' ? '১. রোগী পোর্টাল' : 'Portal 1'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'bn' ? 'রোগী লগইন' : 'Patient Portal'}
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {language === 'bn'
                  ? 'রোগীর ব্যক্তিগত স্বাস্থ্য প্রোফাইল, ডাক্তার অ্যাপয়েন্টমেন্ট, প্রেসক্রিপশন ও বিলিং হিস্ট্রি।'
                  : 'Access personal health records, doctor appointments, e-prescriptions & invoice receipts.'}
              </p>

              {/* Patient Features */}
              <ul className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{language === 'bn' ? 'রোগীর পূর্ণ বিবরণ ও ব্লাড গ্রুপ' : 'Full Patient Details & Blood Group'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{language === 'bn' ? 'ডাক্তার অ্যাপয়েন্টমেন্ট শিডিউলিং' : 'Specialist Doctor Appointments'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{language === 'bn' ? 'বিল ও বিকাশ/কার্ড দিয়ে পরিশোধ' : 'Bills & Online Payments'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickDemoLogin('patient');
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{language === 'bn' ? 'রোগী হিসেবে ১-ক্লিক প্রবেশ' : '1-Click Patient Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: HOSPITAL MANAGEMENT & CLINICAL DOCTORS */}
          <div
            onClick={() => setSelectedRole('doctor')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
              selectedRole === 'doctor'
                ? 'border-blue-600 shadow-md ring-2 ring-blue-600/10'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {language === 'bn' ? '২. ম্যানেজমেন্ট' : 'Portal 2'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'bn' ? 'হাসপাতাল ম্যানেজমেন্ট ও ডক্টর' : 'Hospital Management'}
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {language === 'bn'
                  ? 'ওপিডি চেম্বার, রোগী দেখা, ডিজিটাল প্রেসক্রিপশন ও ওষুধের ডোজ নির্দেশিকা।'
                  : 'Manage OPD consultation queues, write e-prescriptions, and review clinical logs.'}
              </p>

              {/* Management Features */}
              <ul className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{language === 'bn' ? 'ওপিডি কনসালটেশন কিউ' : 'Daily OPD consultation queue'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{language === 'bn' ? 'ডিজিটাল প্রেসক্রিপশন ও ড্রাগ' : 'E-Prescription & drug dosages'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{language === 'bn' ? 'হাসপাতাল রোগীর ক্লিনিক্যাল হিস্ট্রি' : 'Patient clinical files'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickDemoLogin('doctor');
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{language === 'bn' ? 'ম্যানেজমেন্ট হিসেবে প্রবেশ' : '1-Click Management'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: ADMIN PORTAL */}
          <div
            onClick={() => setSelectedRole('admin')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
              selectedRole === 'admin'
                ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {language === 'bn' ? '৩. অ্যাডমিন কন্ট্রোল' : 'Portal 3'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'bn' ? 'অ্যাডমিন সুপার কন্ট্রোল' : 'Super Administrator'}
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {language === 'bn'
                  ? 'হাসপাতাল অ্যানালিটিক্স, ডাক্তার রোস্টার, আইসিইউ ও বেড ট্র্যাকিং এবং সেটিংস।'
                  : 'Master control over hospital analytics, doctor rosters, ICU beds, and settings.'}
              </p>

              {/* Admin Features */}
              <ul className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{language === 'bn' ? 'এক্সিকিউটিভ ড্যাশবোর্ড স্ট্যাটাস' : 'Executive Hospital Stats'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{language === 'bn' ? 'আইসিইউ বেড ও ডাক্তার ম্যানেজমেন্ট' : 'ICU Bed & Doctor Management'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{language === 'bn' ? 'হাসপাতাল ব্র্যান্ডিং ও সেটিংস' : 'Hospital Branding & Settings'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickDemoLogin('admin');
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{language === 'bn' ? 'অ্যাডমিন হিসেবে প্রবেশ' : '1-Click Admin Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: BILLING & CASH COUNTER */}
          <div
            onClick={() => setSelectedRole('cashier')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
              selectedRole === 'cashier'
                ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {language === 'bn' ? '৪. বিলিং কাউন্টার' : 'Portal 4'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'bn' ? 'বিলিং ও ক্যাশ কাউন্টার' : 'Billing & Cashier'}
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {language === 'bn'
                  ? 'হাসপাতাল পিওএস ইনভয়েস তৈরি, ক্যাশ/বিকাশ বিল সংগ্রহ ও অফিসিয়াল মানি রিসিপ্ট প্রিন্ট।'
                  : 'Hospital POS invoicing, payment collection via cash/bKash/card, and official receipt print.'}
              </p>

              {/* Cashier Features */}
              <ul className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? 'পিওএস ইনভয়েস জেনারেটর' : 'Fast POS invoice generation'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? 'বিকাশ, নগদ, কার্ড ও ক্যাশ' : 'Multi-channel payment gateway'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? 'অফিসিয়াল মানি রিসিপ্ট প্রিন্ট' : 'Print official money receipts'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickDemoLogin('cashier');
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{language === 'bn' ? 'ক্যাশিয়ার হিসেবে প্রবেশ' : '1-Click Cashier Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Role Form Login */}
        <div className="max-w-md mx-auto w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {language === 'bn' ? 'নির্ধারিত লগইন রোল:' : 'Current Role Selected:'}
              </span>
              <h4 className="text-sm font-bold text-slate-900 capitalize flex items-center gap-1.5">
                {selectedRole === 'patient' && <User className="w-4 h-4 text-teal-600" />}
                {selectedRole === 'doctor' && <Stethoscope className="w-4 h-4 text-blue-600" />}
                {selectedRole === 'admin' && <ShieldAlert className="w-4 h-4 text-indigo-600" />}
                {selectedRole === 'cashier' && <Receipt className="w-4 h-4 text-emerald-600" />}
                <span>
                  {selectedRole === 'patient'
                    ? (language === 'bn' ? 'রোগী অ্যাকাউন্ট' : 'Patient Account')
                    : selectedRole === 'doctor'
                    ? (language === 'bn' ? 'হাসপাতাল ম্যানেজমেন্ট ও ডক্টর' : 'Hospital Management')
                    : selectedRole === 'admin'
                    ? (language === 'bn' ? 'অ্যাডমিনিস্ট্রেটর' : 'Administrator')
                    : (language === 'bn' ? 'বিলিং ও ক্যাশ কাউন্টার' : 'Billing & Cashier')}
                </span>
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
              {isRegisterMode ? (language === 'bn' ? 'নতুন নিবন্ধন' : 'Sign Up') : (language === 'bn' ? 'সাইন ইন' : 'Sign In')}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'e.g. Dr. Aminul Islam / Rahima Begum'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email Address or Mobile'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@carepulse.hospital'
                      : selectedRole === 'doctor'
                      ? 'doctor@carepulse.hospital'
                      : '+880 1712-345678 / patient@carepulse.hospital'
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                {!isRegisterMode && (
                  <span className="text-[11px] text-teal-600 font-medium cursor-pointer hover:underline">
                    {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot?'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md text-white flex items-center justify-center gap-2 transition-all mt-4 ${
                selectedRole === 'patient'
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                  : selectedRole === 'doctor'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              <span>
                {isRegisterMode
                  ? (language === 'bn' ? 'নিবন্ধন সম্পন্ন করুন' : 'Complete Registration')
                  : (language === 'bn' ? 'লগইন করুন' : 'Sign In Now')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            {isRegisterMode ? (
              <span>
                {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-teal-600 font-bold hover:underline"
                >
                  {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
                </button>
              </span>
            ) : (
              <span>
                {language === 'bn' ? 'নতুন রোগী হিসেবে অ্যাকাউন্ট করতে চান? ' : 'Need a new patient account? '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-teal-600 font-bold hover:underline"
                >
                  {language === 'bn' ? 'নিবন্ধন করুন' : 'Create Account'}
                </button>
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 text-center">
        <p>
          {activeHospitalTitle} • {hospitalSettings.address} • Hotline: {hospitalSettings.hotline}
        </p>
      </footer>
    </div>
  );
};
