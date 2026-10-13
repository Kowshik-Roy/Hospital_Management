import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Palette,
  PhoneCall,
  Save,
  RotateCcw,
  Check,
  Globe,
  Sparkles,
  ShieldCheck,
  Activity,
  Heart,
  Shield,
  Plus,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HospitalSettings, ThemeColor } from '../types/hospital';
import { Language } from '../i18n/translations';
import { PRESET_HOSPITALS } from '../data/hospitalData';

interface HospitalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HospitalSettings;
  onSaveSettings: (newSettings: HospitalSettings) => void;
  language: Language;
}

export const HospitalSettingsModal: React.FC<HospitalSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  language,
}) => {
  const [formData, setFormData] = useState<HospitalSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const colorThemes: Array<{ id: ThemeColor; name: string; hex: string }> = [
    { id: 'teal', name: 'Ocean Teal', hex: '#0d9488' },
    { id: 'blue', name: 'Sapphire Blue', hex: '#2563eb' },
    { id: 'indigo', name: 'Royal Indigo', hex: '#4f46e5' },
    { id: 'emerald', name: 'Medical Emerald', hex: '#059669' },
    { id: 'rose', name: 'Emergency Rose', hex: '#e11d48' },
    { id: 'amber', name: 'Clinical Amber', hex: '#d97706' },
  ];

  const handleApplyPreset = (presetSettings: HospitalSettings) => {
    setFormData({ ...presetSettings });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {language === 'bn' ? 'হাসপাতাল আইডেন্টিটি ও ব্র্যান্ডিং সেটিংস' : 'Hospital Whitelabel & Branding Settings'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'যেকোনো হাসপাতাল তাদের নাম, ঠিকানা ও জরুরি নাম্বার পরিবর্তন করতে পারে।' : 'Configure hospital name, hotline, address and theme colors.'}
            </p>
          </div>
        </div>

        {/* 1-Click Popular Presets */}
        <div className="mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-2">
            {language === 'bn' ? '১-ক্লিকে শীর্ষ হাসপাতালের ডেমো লোড করুন:' : '1-Click Presets for Bangladesh Hospitals:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_HOSPITALS.map((preset, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleApplyPreset(preset.settings)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 shadow-2xs transition-all"
              >
                {language === 'bn' ? preset.nameBn : preset.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hospital Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'হাসপাতালের নাম (ইংরেজি)' : 'Hospital Name (English)'}
              </label>
              <input
                type="text"
                required
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'হাসপাতালের নাম (বাংলা)' : 'Hospital Name (Bangla)'}
              </label>
              <input
                type="text"
                required
                value={formData.hospitalNameBn}
                onChange={(e) => setFormData({ ...formData, hospitalNameBn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'জরুরি হটলাইন' : 'Emergency Hotline'}
              </label>
              <input
                type="text"
                required
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'অ্যাম্বুলেন্স ফোন' : 'Ambulance Phone'}
              </label>
              <input
                type="text"
                required
                value={formData.ambulancePhone}
                onChange={(e) => setFormData({ ...formData, ambulancePhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'ট্যাক্স / ভ্যাট হার (%)' : 'VAT / Tax Rate (%)'}
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'হাসপাতালের পূর্ণ ঠিকানা' : 'Official Hospital Address'}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Theme Palette Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'bn' ? 'হাসপাতাল ব্র্যান্ড কালার থিম' : 'Brand Accent Color Theme'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {colorThemes.map((th) => (
                <button
                  type="button"
                  key={th.id}
                  onClick={() => setFormData({ ...formData, themeColor: th.id })}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    formData.themeColor === th.id
                      ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full shadow-2xs" style={{ backgroundColor: th.hex }} />
                  <span className="text-[10px] truncate max-w-full">{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? (language === 'bn' ? 'সংরক্ষিত!' : 'Saved!') : (language === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save Settings')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
