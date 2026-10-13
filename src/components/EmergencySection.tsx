import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Truck,
  Droplet,
  CheckCircle,
  Clock,
  Activity,
  AlertCircle
} from 'lucide-react';
import { BedCategory, HospitalSettings } from '../types/hospital';
import { Language, translations } from '../i18n/translations';
import { BLOOD_BANK_DATA, AMBULANCE_FLEET } from '../data/hospitalData';

interface EmergencySectionProps {
  language: Language;
  bedCategories: BedCategory[];
  hospitalSettings: HospitalSettings;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  language,
  bedCategories,
  hospitalSettings,
}) => {
  const t = translations[language];

  const icu = bedCategories.find((b) => b.type === 'icu');
  const icuAvailable = icu ? icu.total - icu.occupied : 6;

  const readyAmbulances = AMBULANCE_FLEET.filter((a) => a.status === 'ready').length;

  return (
    <section aria-label="Emergency and Trauma Center" className="bg-gradient-to-br from-rose-50/80 via-white to-slate-50/90 rounded-2xl border-2 border-rose-200/90 p-5 lg:p-7 shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Top indicator stripe with glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 shadow-xs" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>24/7 EMERGENCY &amp; CASUALTY UNIT</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.emergencyBannerTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.emergencyBannerText}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`tel:${hospitalSettings.hotline}`}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>
                {language === 'bn' ? `হটলাইন কল করুন (${hospitalSettings.hotline})` : `Call Hotline (${hospitalSettings.hotline})`}
              </span>
            </a>

            <a
              href={`tel:${hospitalSettings.ambulancePhone}`}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-2 transition-all"
            >
              <Truck className="w-4 h-4 text-rose-600" />
              <span>
                {language === 'bn' ? `অ্যাম্বুলেন্স ডিসপ্যাচ (${hospitalSettings.ambulancePhone})` : `Ambulance Fleet (${hospitalSettings.ambulancePhone})`}
              </span>
            </a>
          </div>
        </div>

        {/* Real-time Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          {/* ICU Bed Availability */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase">{t.statsIcuAvailable}</span>
              <HeartPulse className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{icuAvailable}</span>
              <span className="text-xs text-slate-500 font-medium">
                / {icu?.total || 10} {language === 'bn' ? 'টি খালি' : 'vacant'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
              <CheckCircle className="w-3 h-3" />
              <span>{language === 'bn' ? 'সরাসরি ভর্তি চালু' : 'Admissions open'}</span>
            </div>
          </div>

          {/* Ambulances on duty */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase">{t.statsAmbulanceReady}</span>
              <Truck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{readyAmbulances}</span>
              <span className="text-xs text-slate-500 font-medium">
                / {AMBULANCE_FLEET.length} {language === 'bn' ? 'টি প্রস্তুত' : 'ready'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-teal-600 font-semibold">
              <Clock className="w-3 h-3" />
              <span>{language === 'bn' ? '১০-১৫ মিনিট রেসপন্স' : '10-15 min ETA'}</span>
            </div>
          </div>

          {/* Blood Bank Quick Check */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase">{t.bloodBankStatus}</span>
              <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {BLOOD_BANK_DATA.filter((b) => b.unitsAvailable > 0).length}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {BLOOD_BANK_DATA.length} {language === 'bn' ? 'গ্রুপ মজুত' : 'groups in stock'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-semibold">
              <span>O-, A+, B+, AB+ {language === 'bn' ? 'উপলব্ধ' : 'available'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
