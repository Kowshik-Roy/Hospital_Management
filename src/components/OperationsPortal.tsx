import { useMemo, useState } from 'react';
import {
  Activity,
  Bed,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Package,
  Pill,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';

export type OperationsRole = 'admin' | 'nurse' | 'receptionist' | 'accountant' | 'laboratory' | 'pharmacy';
export type PortalLanguage = 'en' | 'bn';

interface OperationsPortalProps {
  role: OperationsRole;
  name: string;
  language: PortalLanguage;
  onToggleLanguage: () => void;
  onLogout: () => void;
}

type WorkItem = { id: number; primary: string; detail: string; status: string };

const roleCopy = {
  en: {
    admin: 'Hospital Management', nurse: 'Nurse Portal', receptionist: 'Reception Portal',
    accountant: 'Billing & Accounts', laboratory: 'Laboratory Portal', pharmacy: 'Pharmacy Portal',
    dashboard: 'Dashboard', welcome: 'Good day', search: 'Search records', searchHint: 'Search this work queue',
    status: 'Status', action: 'Update', add: 'Add record', updated: 'Record updated', logout: 'Sign out',
    assigned: 'Assigned patients', queue: 'Today’s queue', pending: 'Pending work', available: 'Available beds',
    admissions: 'Admissions', revenue: 'Collections today', tests: 'Tests in process', stock: 'Low-stock items',
    invoices: 'Outstanding invoices', alerts: 'Priority alerts', activity: 'Recent activity',
    vitalTitle: 'Record patient observations', patient: 'Patient / record', temperature: 'Temperature °C',
    bloodPressure: 'Blood pressure', oxygen: 'Oxygen %', saveVitals: 'Save observations',
    modules: 'Hospital operations', noResults: 'No matching records.', empty: 'No records in this queue.',
  },
  bn: {
    admin: 'হাসপাতাল ব্যবস্থাপনা', nurse: 'নার্স পোর্টাল', receptionist: 'রিসেপশন পোর্টাল',
    accountant: 'বিলিং ও হিসাব', laboratory: 'ল্যাবরেটরি পোর্টাল', pharmacy: 'ফার্মেসি পোর্টাল',
    dashboard: 'ড্যাশবোর্ড', welcome: 'শুভেচ্ছা', search: 'রেকর্ড খুঁজুন', searchHint: 'এই তালিকায় খুঁজুন',
    status: 'অবস্থা', action: 'আপডেট', add: 'রেকর্ড যোগ করুন', updated: 'রেকর্ড আপডেট হয়েছে', logout: 'সাইন আউট',
    assigned: 'বরাদ্দকৃত রোগী', queue: 'আজকের কিউ', pending: 'বাকি কাজ', available: 'খালি বেড',
    admissions: 'ভর্তি', revenue: 'আজকের আদায়', tests: 'প্রক্রিয়াধীন টেস্ট', stock: 'কম স্টকের পণ্য',
    invoices: 'বকেয়া ইনভয়েস', alerts: 'জরুরি সতর্কতা', activity: 'সাম্প্রতিক কার্যক্রম',
    vitalTitle: 'রোগীর পর্যবেক্ষণ নথিভুক্ত করুন', patient: 'রোগী / রেকর্ড', temperature: 'তাপমাত্রা °C',
    bloodPressure: 'রক্তচাপ', oxygen: 'অক্সিজেন %', saveVitals: 'পর্যবেক্ষণ সংরক্ষণ',
    modules: 'হাসপাতাল কার্যক্রম', noResults: 'মিল থাকা রেকর্ড নেই।', empty: 'এই তালিকায় কোনো রেকর্ড নেই।',
  },
} as const;

const labels = {
  en: {
    overview: 'Overview', profile: 'Profile', departments: 'Departments', doctors: 'Doctor management',
    patients: 'Patient management', staff: 'Staff management', appointments: 'Appointments & queue',
    admissions: 'Admissions', discharge: 'Discharge', beds: 'Beds & wards', theatre: 'Operation theatre',
    laboratory: 'Laboratory', pharmacy: 'Pharmacy', inventory: 'Inventory', billing: 'Billing',
    finance: 'Financial reports', hr: 'HR & attendance', analytics: 'Analytics', settings: 'System settings',
    assigned: 'Assigned patients', medication: 'Medication schedule', monitoring: 'Vital monitoring',
    alerts: 'Emergency alerts', registration: 'Patient registration', queue: 'Queue management',
    schedule: 'Doctor schedule', invoices: 'Invoices & payments', insurance: 'Insurance claims', expenses: 'Expenses',
    testQueue: 'Test queue', collection: 'Sample collection', results: 'Results & reports',
    stock: 'Medicine inventory', purchases: 'Purchases', sales: 'Sales & dispensing', expiry: 'Expiry & alerts',
  },
  bn: {
    overview: 'সারসংক্ষেপ', profile: 'প্রোফাইল', departments: 'বিভাগ', doctors: 'ডাক্তার ব্যবস্থাপনা',
    patients: 'রোগী ব্যবস্থাপনা', staff: 'কর্মী ব্যবস্থাপনা', appointments: 'অ্যাপয়েন্টমেন্ট ও কিউ',
    admissions: 'ভর্তি', discharge: 'ছাড়পত্র', beds: 'বেড ও ওয়ার্ড', theatre: 'অপারেশন থিয়েটার',
    laboratory: 'ল্যাবরেটরি', pharmacy: 'ফার্মেসি', inventory: 'ইনভেন্টরি', billing: 'বিলিং',
    finance: 'আর্থিক প্রতিবেদন', hr: 'এইচআর ও উপস্থিতি', analytics: 'অ্যানালিটিক্স', settings: 'সিস্টেম সেটিংস',
    assigned: 'বরাদ্দকৃত রোগী', medication: 'ওষুধের সময়সূচি', monitoring: 'ভাইটাল পর্যবেক্ষণ',
    alerts: 'জরুরি সতর্কতা', registration: 'রোগী নিবন্ধন', queue: 'কিউ ব্যবস্থাপনা',
    schedule: 'ডাক্তারের সময়সূচি', invoices: 'ইনভয়েস ও পেমেন্ট', insurance: 'ইনস্যুরেন্স দাবি', expenses: 'খরচ',
    testQueue: 'টেস্ট কিউ', collection: 'নমুনা সংগ্রহ', results: 'ফলাফল ও রিপোর্ট',
    stock: 'ওষুধের মজুত', purchases: 'ক্রয়', sales: 'বিক্রয় ও ওষুধ বিতরণ', expiry: 'মেয়াদ ও সতর্কতা',
  },
} as const;

const moduleKeys: Record<OperationsRole, (keyof typeof labels.en)[]> = {
  admin: ['overview', 'profile', 'departments', 'doctors', 'patients', 'staff', 'appointments', 'admissions', 'discharge', 'beds', 'theatre', 'laboratory', 'pharmacy', 'inventory', 'billing', 'finance', 'hr', 'analytics', 'settings'],
  nurse: ['overview', 'assigned', 'monitoring', 'medication', 'alerts'],
  receptionist: ['overview', 'registration', 'appointments', 'queue', 'schedule'],
  accountant: ['overview', 'invoices', 'insurance', 'expenses', 'finance'],
  laboratory: ['overview', 'testQueue', 'collection', 'results'],
  pharmacy: ['overview', 'stock', 'purchases', 'sales', 'expiry'],
};

const moduleIcons = [LayoutDashboard, Building2, Users, Stethoscope, UserRound, Users, CalendarDays, UserRound, CheckCircle2, Bed, Activity, FlaskConical, Pill, Package, Wallet, Wallet, ClipboardList, Activity, Settings];

const initialItems: Record<OperationsRole, WorkItem[]> = {
  admin: [
    { id: 1, primary: 'OPD appointment queue', detail: '42 appointments scheduled today', status: 'In progress' },
    { id: 2, primary: 'Medical ward occupancy', detail: '72 of 96 beds occupied', status: 'Monitoring' },
    { id: 3, primary: 'Laboratory turnaround', detail: '8 reports awaiting review', status: 'Needs attention' },
    { id: 4, primary: 'Pharmacy stock alert', detail: '4 medicines below reorder level', status: 'Needs attention' },
  ],
  nurse: [
    { id: 1, primary: 'Ayesha Rahman · W-204', detail: 'Medication due · 10:30 AM', status: 'Due' },
    { id: 2, primary: 'Nazmul Hasan · W-211', detail: 'Vitals check · 11:00 AM', status: 'Scheduled' },
    { id: 3, primary: 'Faria Karim · ICU-08', detail: 'Oxygen review · 11:15 AM', status: 'Priority' },
  ],
  receptionist: [
    { id: 1, primary: 'Ayesha Rahman · CP-1042', detail: 'Cardiology · 09:30 AM', status: 'Checked in' },
    { id: 2, primary: 'Nazmul Hasan · CP-1043', detail: 'Neurology · 10:00 AM', status: 'Waiting' },
    { id: 3, primary: 'Faria Karim · CP-1044', detail: 'Pediatrics · 10:30 AM', status: 'Confirmed' },
  ],
  accountant: [
    { id: 1, primary: 'INV-2026-104 · Ayesha Rahman', detail: 'Consultation · BDT 1,750 due', status: 'Pending' },
    { id: 2, primary: 'INV-2026-105 · Nazmul Hasan', detail: 'Laboratory · BDT 3,200 due', status: 'Partial' },
    { id: 3, primary: 'INS-2026-028 · Faria Karim', detail: 'Insurance claim · BDT 8,400', status: 'Review' },
  ],
  laboratory: [
    { id: 1, primary: 'LAB-2081 · CBC', detail: 'Ayesha Rahman · Sample received', status: 'Processing' },
    { id: 2, primary: 'LAB-2082 · Lipid profile', detail: 'Nazmul Hasan · Collection pending', status: 'Pending' },
    { id: 3, primary: 'LAB-2083 · ECG', detail: 'Faria Karim · Report ready', status: 'Ready' },
  ],
  pharmacy: [
    { id: 1, primary: 'Amoxicillin 500mg', detail: 'Stock 12 · Reorder at 20', status: 'Low stock' },
    { id: 2, primary: 'Saline 0.9%', detail: 'Stock 86 · Expires 2027-02', status: 'Available' },
    { id: 3, primary: 'Insulin glargine', detail: 'Stock 6 · Cold storage', status: 'Priority' },
  ],
};

const metrics: Record<OperationsRole, (keyof typeof roleCopy.en)[]> = {
  admin: ['assigned', 'queue', 'available', 'alerts'],
  nurse: ['assigned', 'pending', 'available', 'alerts'],
  receptionist: ['queue', 'admissions', 'pending', 'available'],
  accountant: ['revenue', 'invoices', 'pending', 'alerts'],
  laboratory: ['tests', 'pending', 'activity', 'alerts'],
  pharmacy: ['stock', 'pending', 'activity', 'alerts'],
};

const metricValues: Record<OperationsRole, string[]> = {
  admin: ['1,248', '42', '24', '4'], nurse: ['18', '6', '24', '2'],
  receptionist: ['42', '7', '11', '24'], accountant: ['৳ 1.28L', '28', '৳ 42K', '3'],
  laboratory: ['16', '8', '12', '2'], pharmacy: ['4', '12', '86', '3'],
};

export function OperationsPortal({ role, name, language, onToggleLanguage, onLogout }: OperationsPortalProps) {
  const copy = roleCopy[language];
  const moduleNames = labels[language];
  const [activeModule, setActiveModule] = useState<keyof typeof labels.en>('overview');
  const [items, setItems] = useState(initialItems[role]);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [vitalSaved, setVitalSaved] = useState(false);
  const roleName = copy[role];
  const roleModules = moduleKeys[role];
  const visibleItems = useMemo(() => items.filter((item) => `${item.primary} ${item.detail} ${item.status}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const currentModuleIndex = roleModules.indexOf(activeModule);
  const Icon = moduleIcons[Math.max(0, currentModuleIndex) % moduleIcons.length];

  const updateItem = (id: number) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: item.status === 'Completed' ? 'In progress' : 'Completed' } : item));
    setNotice(copy.updated);
  };

  const addItem = () => {
    const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
    const primary = role === 'receptionist' ? `New patient · REG-${String(nextId + 1000)}` : role === 'laboratory' ? `LAB-${String(nextId + 2080)} · New test order` : role === 'pharmacy' ? `New stock item · SKU-${String(nextId + 400)}` : `New ${moduleNames[activeModule].toLowerCase()} record`;
    setItems((current) => [{ id: nextId, primary, detail: language === 'en' ? 'Created just now' : 'এইমাত্র তৈরি', status: language === 'en' ? 'New' : 'নতুন' }, ...current]);
    setNotice(copy.updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="w-full shrink-0 bg-slate-950 text-slate-100 lg:min-h-screen lg:w-[264px]">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 text-white"><Activity className="h-5 w-5" /></div>
          <div><p className="font-black">CarePulse</p><p className="text-xs text-slate-400">{roleName}</p></div>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1">
          {roleModules.map((key, index) => {
            const ModuleIcon = moduleIcons[index % moduleIcons.length];
            return <button key={key} onClick={() => { setActiveModule(key); setNotice(''); }} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition lg:w-full ${activeModule === key ? 'bg-teal-500 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><ModuleIcon className="h-4 w-4 shrink-0" />{moduleNames[key]}</button>;
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" />{copy.logout}</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold text-teal-700">{copy.welcome}, {name}</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">{moduleNames[activeModule]}</h1></div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleLanguage} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold">{language === 'en' ? 'বাংলা' : 'EN'}</button>
            <button onClick={onLogout} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold lg:hidden"><LogOut className="h-4 w-4" />{copy.logout}</button>
            <span className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold sm:flex"><ShieldCheck className="h-4 w-4 text-teal-700" />{roleName}</span>
          </div>
        </header>

        {activeModule === 'overview' && <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics[role].map((key, index) => <div key={key} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">{copy[key]}</p><p className="mt-2 text-2xl font-black">{metricValues[role][index]}</p></div>)}
        </section>}

        {role === 'nurse' && (activeModule === 'monitoring' || activeModule === 'assigned') && <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">{copy.vitalTitle}</h2>
          <form onSubmit={(event) => { event.preventDefault(); setVitalSaved(true); setNotice(copy.updated); }} className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm font-medium">{copy.patient}<input required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" placeholder="Patient ID" /></label>
            <label className="text-sm font-medium">{copy.temperature}<input required type="number" step="0.1" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" placeholder="36.8" /></label>
            <label className="text-sm font-medium">{copy.bloodPressure}<input required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" placeholder="120/80" /></label>
            <label className="text-sm font-medium">{copy.oxygen}<input required type="number" min="0" max="100" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" placeholder="98" /></label>
            <button className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white sm:col-span-2 xl:col-span-4">{copy.saveVitals}</button>
          </form>
          {vitalSaved && <p role="status" className="mt-3 text-sm font-medium text-teal-700">{copy.updated}</p>}
        </section>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-5">
            <div><h2 className="font-bold">{activeModule === 'overview' ? copy.activity : moduleNames[activeModule]}</h2><p className="mt-1 text-sm text-slate-500">{copy.modules} · {roleName}</p></div>
            <div className="flex w-full gap-2 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchHint} className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-600" /></label>
              {role !== 'nurse' && role !== 'accountant' && <button onClick={addItem} title={copy.add} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-700 text-white hover:bg-teal-800"><Plus className="h-4 w-4" /></button>}
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {visibleItems.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5"><div className="flex min-w-0 items-start gap-3"><div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700"><Icon className="h-4 w-4" /></div><div className="min-w-0"><h3 className="truncate font-semibold">{item.primary}</h3><p className="mt-1 text-sm text-slate-500">{item.detail}</p></div></div><div className="ml-12 flex items-center gap-2 sm:ml-0"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{item.status}</span><button onClick={() => updateItem(item.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold hover:border-teal-600 hover:text-teal-700">{copy.action}</button></div></article>)}
            {visibleItems.length === 0 && <p className="p-8 text-center text-sm text-slate-500">{query ? copy.noResults : copy.empty}</p>}
          </div>
          {notice && <p role="status" className="border-t border-slate-200 bg-teal-50 px-5 py-3 text-sm font-medium text-teal-800">{notice}</p>}
        </section>
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Bell className="h-3.5 w-3.5" />{language === 'en' ? 'Demo workspace · operational records are local to this session.' : 'ডেমো ওয়ার্কস্পেস · কার্যক্রমের রেকর্ড এই সেশনে সংরক্ষিত।'}</p>
      </main>
    </div>
  );
}