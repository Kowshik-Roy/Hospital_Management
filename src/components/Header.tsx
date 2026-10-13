import React from 'react';
import {
  Activity,
  User,
  Stethoscope,
  ShieldAlert,
  CalendarCheck,
  Receipt,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
  Clock,
  PhoneCall,
  BedDouble,
  Building2,
  FileText
} from 'lucide-react';
import { AuthUser, HospitalSettings, UserRole } from '../types/hospital';
import { Language, translations } from '../i18n/translations';

export type MainNavModule = 'patient' | 'doctor' | 'admin' | 'billing' | 'emergency';

interface HeaderProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenBookingModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenSymptomChecker: () => void;
  onOpenBillingTab: () => void;
  isBillingTabActive: boolean;
  hospitalSettings: HospitalSettings;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  activeRole,
  onChangeRole,
  onOpenBookingModal,
  onOpenSettingsModal,
  onOpenSymptomChecker,
  onOpenBillingTab,
  isBillingTabActive,
  hospitalSettings,
  currentUser,
  onLogout,
}) => {
  const t = translations[language];

  const displayName = language === 'bn'
    ? (hospitalSettings.hospitalNameBn || hospitalSettings.hospitalName)
    : hospitalSettings.hospitalName;

  const displayTagline = language === 'bn'
    ? (hospitalSettings.taglineBn || hospitalSettings.tagline)
    : hospitalSettings.tagline;

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Top Utility & Emergency Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{language === 'bn' ? 'জরুরি হটলাইন:' : '24/7 Hotline:'}</span>
            <a href={`tel:${hospitalSettings.hotline}`} className="text-white hover:underline font-mono font-bold">
              {hospitalSettings.hotline}
            </a>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <span>{language === 'bn' ? 'অ্যাম্বুলেন্স:' : 'Ambulance:'}</span>
            <span className="text-slate-200 font-mono font-semibold">{hospitalSettings.ambulancePhone}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-slate-400">
            <span>{language === 'bn' ? 'অনুমোদন নং:' : 'Govt Reg:'}</span>
            <span className="text-teal-300 font-mono text-[10px]">{hospitalSettings.licenseNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick AI Triage button */}
          <button
            onClick={onOpenSymptomChecker}
            className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 font-medium px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{language === 'bn' ? 'AI লক্ষণ পরীক্ষা' : 'AI Triage'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded border border-slate-700 text-[11px]">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                language === 'en' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('bn')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                language === 'bn' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* Main Hospital Branding & System Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Hospital Brand identity */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center shadow-md shadow-teal-600/20 text-white shrink-0">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 truncate">
                    {displayName}
                  </h1>
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 uppercase shrink-0">
                    HIS / EMR
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate max-w-sm lg:max-w-md">
                  {displayTagline}
                </p>
              </div>
            </div>

            {/* Mobile Settings Trigger (Admin Only) */}
            {currentUser?.role === 'admin' && (
              <div className="md:hidden flex items-center gap-1.5">
                <button
                  onClick={onOpenSettingsModal}
                  title="Hospital Settings"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Global Actions & Authenticated User Profile */}
          <div className="flex items-center flex-wrap gap-2.5 justify-end w-full md:w-auto">
            {/* Appointment Booking Action */}
            <button
              onClick={onOpenBookingModal}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t.bookAppointmentBtn}</span>
            </button>

            {/* Hospital Whitelabel Settings (Admin Only) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenSettingsModal}
                title={language === 'bn' ? 'হাসপাতালের নাম ও সেটিংস পরিবর্তন করুন' : 'Change hospital settings & branding'}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold transition-all"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>{language === 'bn' ? 'হাসপাতাল সেটিংস' : 'Hospital Settings'}</span>
              </button>
            )}

            {/* Current Logged In User Profile Chip & Log Out */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-slate-50 pl-2.5 pr-1.5 py-1 rounded-lg border border-slate-200 text-xs">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-800 text-[11px] leading-tight max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-slate-500 capitalize leading-tight">
                    {currentUser.role === 'admin'
                      ? (language === 'bn' ? 'অ্যাডমিন' : 'Admin')
                      : currentUser.role === 'doctor'
                      ? (language === 'bn' ? 'ম্যানেজমেন্ট' : 'Management')
                      : currentUser.role === 'cashier'
                      ? (language === 'bn' ? 'ক্যাশিয়ার' : 'Cashier')
                      : (language === 'bn' ? 'রোগী' : 'Patient')}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title={language === 'bn' ? 'লগইন পেজে যান / লগআউট' : 'Switch role / Logout'}
                  className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ROLE-ISOLATED PORTAL HEADER BAR (Strict Role Permissions) */}
        {currentUser?.role === 'patient' && (
          <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-teal-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'bn' ? '১. রোগী স্বাস্থ্য পোর্টাল ও ই-ফাইল' : '1. Patient Health Portal & EMR Records'}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>{language === 'bn' ? 'রোগী আইডি:' : 'Patient ID:'}</span>
              <span className="font-mono font-bold text-teal-700 bg-slate-100 px-2 py-0.5 rounded">{currentUser.patientId || 'PAT-1001'}</span>
            </div>
          </div>
        )}

        {currentUser?.role === 'doctor' && (
          <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-800 font-bold">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'bn' ? '২. হাসপাতাল ম্যানেজমেন্ট ও ওপিডি চেম্বার' : '2. Hospital Management & OPD Doctor Chamber'}</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
              {language === 'bn' ? 'ওপিডি কনসালটেশন কিউ সক্রিয়' : 'OPD Consultation Active'}
            </span>
          </div>
        )}

        {currentUser?.role === 'admin' && (
          <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-800 font-bold">
              <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === 'bn' ? '৩. অ্যাডমিন সুপার কন্ট্রোল কমান্ড সেন্টার' : '3. Hospital Super Administrator Command Center'}</span>
              </span>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              {language === 'bn' ? 'মাস্টার অ্যাডমিন অ্যাক্সেস' : 'Master Admin Access'}
            </span>
          </div>
        )}

        {currentUser?.role === 'cashier' && (
          <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? '৪. হাসপাতাল বিলিং ও সেন্ট্রাল ক্যাশ কাউন্টার' : '4. Hospital Dedicated Billing & Cashier Desk'}</span>
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              {language === 'bn' ? 'পিওএস ও মানি রিসিপ্ট' : 'POS Cashier Online'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
