import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  UserPlus,
  Bed,
  CalendarCheck,
  CheckCircle,
  XCircle,
  Plus,
  Activity,
  HeartPulse,
  Truck,
  TrendingUp,
  DollarSign,
  Receipt,
  Settings,
  Search,
  Filter,
  FileText,
  Clock,
  Sparkles,
  UserCheck,
  Droplets,
  CreditCard,
  Building
} from 'lucide-react';
import {
  Appointment,
  BedCategory,
  Department,
  Doctor,
  HospitalSettings,
  Invoice,
  Patient,
  PaymentStatus
} from '../types/hospital';
import { Language, translations } from '../i18n/translations';
import { BillingSystem } from './BillingSystem';

interface AdminPortalProps {
  language: Language;
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  bedCategories: BedCategory[];
  invoices: Invoice[];
  patients: Patient[];
  onAddDoctor: (newDoctor: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => void;
  onAddPatient: (newPatient: Patient) => void;
  onUpdateAppointmentStatus: (appointmentId: string, status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => void;
  onUpdateBedOccupancy: (bedId: string, delta: number) => void;
  hospitalSettings: HospitalSettings;
  onOpenSettingsModal: () => void;
  onSaveInvoice: (newInvoice: Invoice) => void;
  onUpdateInvoiceStatus: (
    invoiceId: string,
    paidAmount: number,
    status: PaymentStatus,
    paymentMethod: any
  ) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  language,
  doctors,
  departments,
  appointments,
  bedCategories,
  invoices,
  patients,
  onAddDoctor,
  onAddPatient,
  onUpdateAppointmentStatus,
  onUpdateBedOccupancy,
  hospitalSettings,
  onOpenSettingsModal,
  onSaveInvoice,
  onUpdateInvoiceStatus,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'patients' | 'doctors' | 'beds' | 'appointments'>('overview');

  // Form states
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('');
  const [newDoctorDept, setNewDoctorDept] = useState(departments[0]?.name || 'Cardiology');
  const [newDoctorFee, setNewDoctorFee] = useState<number>(1000);

  // New Patient Form state
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatName, setNewPatName] = useState('');
  const [newPatPhone, setNewPatPhone] = useState('');
  const [newPatAge, setNewPatAge] = useState<number>(30);
  const [newPatGender, setNewPatGender] = useState<'male' | 'female' | 'other'>('male');
  const [newPatBlood, setNewPatBlood] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');

  // Overall Financial stats
  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalDue = invoices.reduce((acc, curr) => acc + curr.dueAmount, 0);
  const totalBeds = bedCategories.reduce((acc, curr) => acc + curr.total, 0);
  const occupiedBeds = bedCategories.reduce((acc, curr) => acc + curr.occupied, 0);

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorName) return;

    onAddDoctor({
      name: newDoctorName,
      nameBn: newDoctorName,
      specialty: newDoctorSpecialty || 'Consultant Specialist',
      specialtyBn: newDoctorSpecialty || 'কনসালটেন্ট বিশেষজ্ঞ',
      departmentId: departments.find((d) => d.name === newDoctorDept)?.id || 'dept-1',
      degrees: 'MBBS, FCPS',
      experienceYears: 8,
      consultFee: newDoctorFee,
      availableDays: ['Saturday', 'Monday', 'Wednesday'],
      visitingHours: '05:00 PM - 09:00 PM',
      roomNo: 'Room 304, OPD Wing B',
      phone: '+880 1711-223344',
      isAvailableToday: true,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    });

    setIsAddDoctorOpen(false);
    setNewDoctorName('');
  };

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName || !newPatPhone) return;

    onAddPatient({
      id: `pat-${Date.now()}`,
      name: newPatName,
      phone: newPatPhone,
      email: `${newPatName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      age: newPatAge,
      gender: newPatGender,
      bloodGroup: newPatBlood,
      address: 'Dhaka, Bangladesh',
      emergencyContact: '+880 1711-999888',
      registeredDate: new Date().toISOString().split('T')[0],
      allergies: [],
      chronicDiseases: ['None Reported'],
    });

    setIsAddPatientOpen(false);
    setNewPatName('');
    setNewPatPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Module 3 Master Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-1">
                <span>{language === 'bn' ? 'মডিউল ৩: সিস্টেম অ্যাডমিনিস্ট্রেটর ফুল অ্যাক্সেস' : 'Module 3: Full Access System Command Center'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {language === 'bn' ? 'সুপার অ্যাডমিন কমান্ড ও ম্যানেজমেন্ট' : 'Hospital Enterprise Administration'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettingsModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 flex items-center gap-1.5 transition-all"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>{language === 'bn' ? 'হাসপাতাল সেটিংস' : 'Hospital Settings'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সার্বিক ড্যাশবোর্ড' : 'System Overview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'billing'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সেন্ট্রাল বিলিং কন্ট্রোল' : 'Central Billing & Invoices'}</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'patients'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? `রোগী ডাটাবেস (${patients.length})` : `Patients (${patients.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? `ডাক্তার প্যানেল (${doctors.length})` : `Doctors (${doctors.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('beds')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'beds'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'বেড ও আইসিইউ অকুপেন্সি' : 'ICU & Bed Tracking'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SYSTEM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Matrix Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">{language === 'bn' ? 'মোট সংগৃহীত রেভিনিউ' : 'Total Revenue'}</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {hospitalSettings.currency} {totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {language === 'bn' ? 'পরিশোধিত কালেকশন' : 'Collected via cash/cards'}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">{language === 'bn' ? 'মোট নিবন্ধিত রোগী' : 'Registered Patients'}</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {patients.length}
              </div>
              <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                {language === 'bn' ? 'ডিজিটাল ই-ফাইল সুরক্ষিত' : 'Secure E-Health Files'}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">{language === 'bn' ? 'বেড ও আইসিইউ অকুপেন্সি' : 'Bed Occupancy'}</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {occupiedBeds} / {totalBeds}
              </div>
              <div className="text-[11px] text-amber-600 font-semibold mt-1">
                {Math.round((occupiedBeds / (totalBeds || 1)) * 100)}% {language === 'bn' ? 'পূর্ণ' : 'occupied'}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">{language === 'bn' ? 'সক্রিয় বিশেষজ্ঞ ডাক্তার' : 'Active Specialists'}</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {doctors.length}
              </div>
              <div className="text-[11px] text-teal-600 font-semibold mt-1">
                {departments.length} {language === 'bn' ? 'টি ডিপার্টমেন্ট' : 'departments'}
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{language === 'bn' ? 'প্রশাসনিক দ্রুত অ্যাকশন' : 'Administrative Quick Actions'}</h4>
              <p className="text-xs text-slate-500">{language === 'bn' ? 'নতুন ডাক্তার নিয়োগ দিন অথবা সরাসরি রোগী নিবন্ধন করুন।' : 'Add new hospital staff or register patients.'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddPatientOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'নতুন রোগী নিবন্ধন' : 'Register Patient'}</span>
              </button>
              <button
                onClick={() => setIsAddDoctorOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'নতুন ডাক্তার যোগ করুন' : 'Add Doctor'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CENTRAL BILLING SYSTEM EMBED */}
      {activeTab === 'billing' && (
        <BillingSystem
          language={language}
          invoices={invoices}
          patients={patients}
          doctors={doctors}
          hospitalSettings={hospitalSettings}
          activeRole="admin"
          onSaveInvoice={onSaveInvoice}
          onUpdateInvoiceStatus={onUpdateInvoiceStatus}
        />
      )}

      {/* SUB-TAB 3: PATIENT DATABASE */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-in fade-in">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">{language === 'bn' ? 'হাসপাতালের সকল রোগীর ডাটাবেস' : 'Hospital Patient Database'}</h3>
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রোগী নিবন্ধন' : 'Add Patient'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">রোগী আইডি</th>
                  <th className="py-3 px-4">নাম ও বয়স</th>
                  <th className="py-3 px-4">মোবাইল</th>
                  <th className="py-3 px-4">ব্লাড গ্রুপ</th>
                  <th className="py-3 px-4">জরুরি যোগাযোগ</th>
                  <th className="py-3 px-4">ক্রনিক হিস্ট্রি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{p.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.name} ({p.age}y, {p.gender})</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{p.phone}</td>
                    <td className="py-3.5 px-4 font-bold text-teal-700">{p.bloodGroup}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{p.emergencyContact}</td>
                    <td className="py-3.5 px-4 text-slate-500">{p.chronicDiseases?.join(', ') || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DOCTORS DIRECTORY */}
      {activeTab === 'doctors' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{language === 'bn' ? 'ডাক্তার ও মেডিকেল স্টাফ প্যানেল' : 'Hospital Doctors & Clinical Roster'}</h3>
            <button
              onClick={() => setIsAddDoctorOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নতুন ডাক্তার নিয়োগ' : 'Add Doctor'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start gap-3.5">
                <img src={d.avatarUrl} alt={d.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{d.name}</h4>
                  <p className="text-xs text-teal-700 font-semibold">{d.specialty}</p>
                  <p className="text-[11px] text-slate-500">{d.degrees}</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1">Fee: {hospitalSettings.currency} {d.consultFee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: ICU & BED TRACKING */}
      {activeTab === 'beds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
          {bedCategories.map((bed) => {
            const vacant = bed.total - bed.occupied;
            const pct = Math.round((bed.occupied / bed.total) * 100);
            return (
              <div key={bed.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{language === 'bn' ? bed.nameBn : bed.name}</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {bed.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{vacant}</span>
                    <span className="text-xs text-slate-500"> / {bed.total} {language === 'bn' ? 'টি খালি' : 'vacant'}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{pct}% {language === 'bn' ? 'ভর্তি' : 'occupied'}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pct > 80 ? 'bg-rose-500' : 'bg-teal-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Counter buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">ভর্তি সমন্বয়:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateBedOccupancy(bed.id, -1)}
                      disabled={bed.occupied <= 0}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-bold disabled:opacity-30"
                    >
                      -১ রিলিজ
                    </button>
                    <button
                      onClick={() => onUpdateBedOccupancy(bed.id, 1)}
                      disabled={bed.occupied >= bed.total}
                      className="px-2.5 py-1 rounded bg-teal-600 text-white hover:bg-teal-700 font-bold disabled:opacity-30"
                    >
                      +১ ভর্তি
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD DOCTOR MODAL */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <h3 className="text-lg font-black text-slate-900 mb-4">{language === 'bn' ? 'নতুন ডাক্তার নিয়োগ' : 'Add New Doctor'}</h3>
            <form onSubmit={handleAddDoctorSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডাক্তারের নাম</label>
                <input
                  type="text"
                  required
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Mahmudul Hasan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">স্পেশালিটি</label>
                <input
                  type="text"
                  value={newDoctorSpecialty}
                  onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                  placeholder="e.g. Cardiologist & Electrophysiologist"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কনসালটেশন ফি (টাকা)</label>
                <input
                  type="number"
                  value={newDoctorFee}
                  onChange={(e) => setNewDoctorFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PATIENT MODAL */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <h3 className="text-lg font-black text-slate-900 mb-4">{language === 'bn' ? 'নতুন রোগী নিবন্ধন' : 'Register New Patient'}</h3>
            <form onSubmit={handleAddPatientSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রোগীর নাম</label>
                <input
                  type="text"
                  required
                  value={newPatName}
                  onChange={(e) => setNewPatName(e.target.value)}
                  placeholder="e.g. Mohammad Ali"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  required
                  value={newPatPhone}
                  onChange={(e) => setNewPatPhone(e.target.value)}
                  placeholder="+880 1712-000000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বয়স</label>
                  <input
                    type="number"
                    value={newPatAge}
                    onChange={(e) => setNewPatAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্লাড গ্রুপ</label>
                  <select
                    value={newPatBlood}
                    onChange={(e) => setNewPatBlood(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddPatientOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  নিবন্ধন সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
