import { FormEvent, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bed, Bell, Check,
  ChevronRight, ClipboardList, FileText, FlaskConical, HeartPulse, LayoutDashboard,
  LogOut, Menu, Package, Pill, Plus, Search, ShieldAlert, Syringe, UserRound,
  Users, X,
} from 'lucide-react';

type Section = 'overview' | 'patients' | 'vitals' | 'medication' | 'notes' | 'handover' | 'procedures' | 'labs' | 'emergency' | 'beds' | 'inventory' | 'notifications' | 'profile';
type PatientStatus = 'Stable' | 'Observation' | 'Critical' | 'Emergency';
type NursePatient = {
  id: string; name: string; age: number; gender: string; ward: string; bed: string;
  diagnosis: string; doctor: string; status: PatientStatus; allergies: string[];
  history: string; doctorNote: string;
};
type VitalRecord = {
  id: number; patientId: string; time: string; bp: string; heartRate: number;
  temperature: number; spo2: number; respiratoryRate: number; bloodSugar: number; pain: number;
};

interface NursePortalProps {
  name: string;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  onLogout: () => void;
}

const initialPatients: NursePatient[] = [
  { id: 'CP-1042', name: 'Ayesha Rahman', age: 58, gender: 'Female', ward: 'Medical · 2', bed: 'W-204', diagnosis: 'Community-acquired pneumonia', doctor: 'Dr. Ahmed Rahman', status: 'Observation', allergies: ['Penicillin'], history: 'Hypertension · admitted 12 Oct 2026', doctorNote: 'Monitor oxygen saturation every 2 hours. Encourage fluids as tolerated.' },
  { id: 'CP-1087', name: 'Nazmul Hasan', age: 67, gender: 'Male', ward: 'Medical · 2', bed: 'W-211', diagnosis: 'Type 2 diabetes · post-operative day 1', doctor: 'Dr. Farhana Yasmin', status: 'Stable', allergies: [], history: 'Type 2 diabetes · hypertension · admitted 11 Oct 2026', doctorNote: 'Check fasting glucose before breakfast. Mobilize with assistance.' },
  { id: 'CP-1103', name: 'Faria Karim', age: 42, gender: 'Female', ward: 'Medical · 2', bed: 'W-216', diagnosis: 'Acute exacerbation of asthma', doctor: 'Dr. Kamrul Hasan', status: 'Critical', allergies: ['Latex'], history: 'Asthma · previous ICU admission · admitted 13 Oct 2026', doctorNote: 'Escalate immediately if SpO₂ falls below 92%. Oxygen as prescribed.' },
  { id: 'CP-1116', name: 'Rafiq Uddin', age: 35, gender: 'Male', ward: 'Medical · 2', bed: 'W-219', diagnosis: 'Acute gastroenteritis', doctor: 'Dr. Nusrat Jahan', status: 'Stable', allergies: [], history: 'No significant history · admitted 13 Oct 2026', doctorNote: 'Maintain intake/output chart. Review hydration status each round.' },
];

const initialVitals: VitalRecord[] = [
  { id: 1, patientId: 'CP-1042', time: '08:00', bp: '128/82', heartRate: 92, temperature: 37.8, spo2: 94, respiratoryRate: 21, bloodSugar: 6.2, pain: 2 },
  { id: 2, patientId: 'CP-1042', time: '10:00', bp: '126/80', heartRate: 88, temperature: 37.5, spo2: 95, respiratoryRate: 19, bloodSugar: 6.0, pain: 2 },
  { id: 3, patientId: 'CP-1103', time: '08:15', bp: '138/86', heartRate: 108, temperature: 37.1, spo2: 89, respiratoryRate: 26, bloodSugar: 5.8, pain: 3 },
  { id: 4, patientId: 'CP-1103', time: '10:15', bp: '134/84', heartRate: 102, temperature: 37.0, spo2: 91, respiratoryRate: 23, bloodSugar: 5.9, pain: 2 },
];

const initialMeds = [
  { id: 1, patientId: 'CP-1042', medicine: 'Ceftriaxone', dose: '1 g', route: 'IV', time: '10:30 AM', status: 'Pending', note: '' },
  { id: 2, patientId: 'CP-1087', medicine: 'Metformin', dose: '500 mg', route: 'Oral', time: '11:00 AM', status: 'Pending', note: '' },
  { id: 3, patientId: 'CP-1103', medicine: 'Salbutamol', dose: '2.5 mg', route: 'Nebulization', time: '10:00 AM', status: 'Given', note: 'Tolerated well' },
  { id: 4, patientId: 'CP-1116', medicine: 'ORS', dose: '200 ml', route: 'Oral', time: '09:30 AM', status: 'Missed', note: 'Patient nauseated; physician informed' },
];

const initialProcedures = [
  { id: 1, patientId: 'CP-1042', task: 'IV line change', due: '11:30 AM', status: 'Pending' },
  { id: 2, patientId: 'CP-1087', task: 'Wound dressing', due: '12:00 PM', status: 'Pending' },
  { id: 3, patientId: 'CP-1103', task: 'Oxygen therapy review', due: '10:45 AM', status: 'Completed' },
  { id: 4, patientId: 'CP-1116', task: 'Intake / output chart', due: '01:00 PM', status: 'Pending' },
];

const initialNotifications = [
  { id: 1, text: 'Medication due: Ceftriaxone · Ayesha Rahman · 10:30 AM', time: '10 min ago', read: false },
  { id: 2, text: 'Abnormal vital: SpO₂ 89% · Faria Karim · W-216', time: '25 min ago', read: false },
  { id: 3, text: 'Lab result available: CBC · Ayesha Rahman', time: '1 hr ago', read: true },
  { id: 4, text: 'Doctor message: review glucose before lunch · Nazmul Hasan', time: '1 hr ago', read: true },
];

const initialLabs = [
  { id: 'LAB-2081', patientId: 'CP-1042', test: 'Complete blood count (CBC)', ordered: '09:10 AM', status: 'Result available' },
  { id: 'LAB-2082', patientId: 'CP-1087', test: 'Fasting blood glucose', ordered: '10:00 AM', status: 'Sample collected' },
  { id: 'LAB-2083', patientId: 'CP-1103', test: 'Arterial blood gas (ABG)', ordered: '10:20 AM', status: 'Processing' },
  { id: 'LAB-2084', patientId: 'CP-1116', test: 'Electrolytes', ordered: '10:45 AM', status: 'Test ordered' },
];

const navigation: { id: Section; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard }, { id: 'patients', label: 'Patients', icon: Users },
  { id: 'vitals', label: 'Vital Signs', icon: HeartPulse }, { id: 'medication', label: 'Medication', icon: Pill },
  { id: 'notes', label: 'Nursing Notes', icon: FileText }, { id: 'handover', label: 'Shift Handover', icon: ClipboardList },
  { id: 'procedures', label: 'Procedures', icon: Syringe }, { id: 'labs', label: 'Lab Tracking', icon: FlaskConical },
  { id: 'emergency', label: 'Emergency', icon: ShieldAlert }, { id: 'beds', label: 'Bed Management', icon: Bed },
  { id: 'inventory', label: 'Inventory', icon: Package }, { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

const localDate = () => new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export function NursePortal({ name, language, onToggleLanguage, onLogout }: NursePortalProps) {
  const [section, setSection] = useState<Section>('overview');
  const [patients, setPatients] = useState(initialPatients);
  const [vitals, setVitals] = useState(initialVitals);
  const [medications, setMedications] = useState(initialMeds);
  const [procedures, setProcedures] = useState(initialProcedures);
  const [labs, setLabs] = useState(initialLabs);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notes, setNotes] = useState<Array<{ id: number; patientId: string; text: string; time: string }>>([]);
  const [handovers, setHandovers] = useState<Array<{ id: number; patientId: string; condition: string; pending: string; instructions: string; from: string; to: string }>>([
    { id: 1, patientId: 'CP-1103', condition: 'Wheezing improved after nebulization; SpO₂ 91% on oxygen.', pending: 'Repeat respiratory assessment at 12:00 PM.', instructions: 'Escalate if saturation falls below 92%.', from: 'Night shift', to: 'Morning shift' },
  ]);
  const [requests, setRequests] = useState<Array<{ id: number; item: string; quantity: number; status: string }>>([]);
  const [activePatientId, setActivePatientId] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [detailPatient, setDetailPatient] = useState<NursePatient | null>(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [missedDoseId, setMissedDoseId] = useState<number | null>(null);
  const [missedReason, setMissedReason] = useState('');
  const [noteForm, setNoteForm] = useState({ patientId: initialPatients[0].id, text: '' });
  const [vitalForm, setVitalForm] = useState({ patientId: initialPatients[0].id, bp: '', heartRate: '', temperature: '', spo2: '', respiratoryRate: '', bloodSugar: '', pain: '0' });

  const bn = language === 'bn';
  const labels = navigation.reduce<Record<Section, string>>((result, item) => {
    result[item.id] = item.label;
    return result;
  }, {} as Record<Section, string>);
  const filteredPatients = useMemo(() => patients.filter((patient) =>
    `${patient.name} ${patient.id} ${patient.ward} ${patient.bed} ${patient.diagnosis}`.toLowerCase().includes(search.toLowerCase())), [patients, search]);
  const pendingMeds = medications.filter((item) => item.status === 'Pending').length;
  const pendingProcedures = procedures.filter((item) => item.status === 'Pending').length;
  const unreadCount = notifications.filter((item) => !item.read).length;
  const latestForPatient = (patientId: string) => [...vitals].reverse().find((record) => record.patientId === patientId);
  const latestCritical = patients.map((patient) => latestForPatient(patient.id)).find((record): record is VitalRecord => Boolean(record && record.spo2 < 90));
  const patientName = (id: string) => patients.find((patient) => patient.id === id)?.name ?? id;

  const notify = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const submitVital = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const record: VitalRecord = {
      id: Date.now(), patientId: vitalForm.patientId, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      bp: vitalForm.bp, heartRate: Number(vitalForm.heartRate), temperature: Number(vitalForm.temperature),
      spo2: Number(vitalForm.spo2), respiratoryRate: Number(vitalForm.respiratoryRate),
      bloodSugar: Number(vitalForm.bloodSugar), pain: Number(vitalForm.pain),
    };
    setVitals((current) => [...current, record]);
    if (record.spo2 < 90) {
      setPatients((current) => current.map((patient) => patient.id === record.patientId ? { ...patient, status: 'Emergency' } : patient));
      setNotifications((current) => [{ id: record.id, text: `RED ALERT: SpO₂ ${record.spo2}% · ${patientName(record.patientId)} · notify assigned doctor, ICU and nurse supervisor`, time: 'Just now', read: false }, ...current]);
      notify(bn ? 'জরুরি সতর্কতা তৈরি হয়েছে — দায়িত্বপ্রাপ্ত চিকিৎসক, ICU ও নার্স সুপারভাইজারকে জানান।' : 'RED ALERT: SpO₂ below 90%. Notify the assigned doctor, ICU team and nurse supervisor immediately.');
    } else {
      notify(bn ? 'ভাইটাল রেকর্ড সংরক্ষিত হয়েছে।' : 'Vital record saved.');
    }
    setVitalForm((current) => ({ ...current, bp: '', heartRate: '', temperature: '', spo2: '', respiratoryRate: '', bloodSugar: '', pain: '0' }));
  };

  const markMedication = (id: number, status: 'Given' | 'Missed', reason = '') => {
    setMedications((current) => current.map((item) => item.id === id ? { ...item, status, note: reason || item.note } : item));
    setMissedDoseId(null);
    setMissedReason('');
    notify(status === 'Given' ? 'Administration recorded in this demo workspace.' : 'Missed dose and reason recorded.');
  };

  const submitNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotes((current) => [{ id: Date.now(), patientId: noteForm.patientId, text: noteForm.text, time: new Date().toLocaleString() }, ...current]);
    setNoteForm((current) => ({ ...current, text: '' }));
    notify('Nursing note saved with your name and timestamp.');
  };

  const submitHandover = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setHandovers((current) => [{
      id: Date.now(), patientId: String(data.get('patientId')), condition: String(data.get('condition')),
      pending: String(data.get('pending')), instructions: String(data.get('instructions')),
      from: 'Morning shift', to: 'Evening shift',
    }, ...current]);
    event.currentTarget.reset();
    notify('Shift handover saved for the incoming team.');
  };

  const raiseEmergency = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = Date.now();
    const patientId = String(data.get('patientId'));
    const reason = String(data.get('reason'));
    setNotifications((current) => [{ id, text: `EMERGENCY: ${patientName(patientId)} · ${patients.find((patient) => patient.id === patientId)?.bed} · ${reason} · notify doctor, ICU, ED and supervisor`, time: 'Just now', read: false }, ...current]);
    setEmergencyOpen(false);
    notify('Emergency alert recorded. Contact the clinical response team directly now.');
  };

  const saveInventoryRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setRequests((current) => [...current, { id: Date.now(), item: String(data.get('item')), quantity: Number(data.get('quantity')), status: 'Requested' }]);
    event.currentTarget.reset();
    notify('Inventory request submitted for store approval.');
  };

  const sectionTitle = labels[section];

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-800 lg:flex">
      <aside className={`${mobileNavOpen ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-40 w-[270px] overflow-y-auto bg-[#10283f] text-white lg:sticky lg:top-0 lg:block lg:h-screen`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500"><Activity className="h-5 w-5" /></div>
          <div><p className="font-black tracking-wide">CarePulse</p><p className="text-xs text-slate-400">Nursing Services</p></div>
          <button className="ml-auto lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Assigned shift</p>
          <p className="mt-1 text-sm font-semibold">Medical Ward · 2</p><p className="text-xs text-slate-400">Morning shift · 07:00–15:00</p>
        </div>
        <nav className="space-y-1 p-3">
          {navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setMobileNavOpen(false); setSearch(''); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${section === id ? 'bg-teal-500 text-white shadow-lg shadow-teal-950/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            <Icon className="h-[17px] w-[17px] shrink-0" /><span className="flex-1">{bn ? ({ overview: 'ড্যাশবোর্ড', patients: 'রোগী', vitals: 'ভাইটাল সাইন', medication: 'ওষুধ', notes: 'নার্সিং নোট', handover: 'শিফট হ্যান্ডওভার', procedures: 'প্রক্রিয়া', labs: 'ল্যাব ট্র্যাকিং', emergency: 'জরুরি অবস্থা', beds: 'বেড ব্যবস্থাপনা', inventory: 'ইনভেন্টরি', notifications: 'নোটিফিকেশন', profile: 'প্রোফাইল' } as Record<Section, string>)[id] : label}</span>
            {id === 'notifications' && unreadCount > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold">{unreadCount}</span>}
          </button>)}
        </nav>
        <div className="mt-5 border-t border-white/10 p-3"><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10"><LogOut className="h-4 w-4" />{bn ? 'সাইন আউট' : 'Sign out'}</button></div>
      </aside>
      {mobileNavOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div><p className="hidden text-xs text-slate-500 sm:block">{localDate()}</p><h1 className="text-lg font-bold text-slate-800 sm:text-xl">{bn ? ({ overview: 'নার্স ড্যাশবোর্ড', patients: 'আমার রোগীরা', vitals: 'ভাইটাল সাইন পর্যবেক্ষণ', medication: 'মেডিকেশন অ্যাডমিনিস্ট্রেশন', notes: 'নার্সিং নোট', handover: 'শিফট হ্যান্ডওভার', procedures: 'প্রক্রিয়া চেকলিস্ট', labs: 'ল্যাব ট্র্যাকিং', emergency: 'জরুরি সতর্কতা', beds: 'বেড ব্যবস্থাপনা', inventory: 'ইনভেন্টরি অনুরোধ', notifications: 'নোটিফিকেশন সেন্টার', profile: 'নার্স প্রোফাইল' } as Record<Section, string>)[section] : sectionTitle}</h1></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onToggleLanguage} className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold text-slate-600 hover:border-teal-400">{bn ? 'EN' : 'বাংলা'}</button>
            <button onClick={() => setSection('notifications')} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell className="h-5 w-5" />{unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}</button>
            <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex"><div className="grid h-9 w-9 place-items-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><p className="text-sm font-semibold">{name}</p><p className="text-[11px] text-slate-500">Registered Nurse</p></div></div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {latestCritical && <button onClick={() => { setSection('vitals'); setVitalForm((current) => ({ ...current, patientId: latestCritical.patientId })); }} className="mb-5 flex w-full items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-left text-rose-900">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" /><span><strong className="block text-sm">RED ALERT · SpO₂ below 90%</strong><span className="mt-1 block text-xs">{patientName(latestCritical.patientId)} · {latestCritical.spo2}% at {latestCritical.time} — escalate to the assigned doctor, ICU team and nurse supervisor.</span></span><ChevronRight className="ml-auto h-5 w-5 shrink-0" />
          </button>}

          {section === 'overview' && <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-slate-500">Your Medical Ward · 2 assignment</p><h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">Good morning, {name.split(' ')[0]}</h2><p className="mt-1 text-sm text-slate-500">Here is your ward at a glance for this shift.</p></div><span className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">07:00 AM – 03:00 PM · On duty</span></div>
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
              {[
                { label: 'Assigned patients', value: patients.length, detail: 'Medical Ward · 2', icon: Users, tone: 'teal' },
                { label: 'Critical patients', value: patients.filter((patient) => patient.status === 'Critical' || patient.status === 'Emergency').length, detail: 'Needs close monitoring', icon: HeartPulse, tone: 'rose' },
                { label: 'Pending medications', value: pendingMeds, detail: 'Due this shift', icon: Pill, tone: 'blue' },
                { label: 'Pending procedures', value: pendingProcedures, detail: 'Scheduled tasks', icon: ClipboardList, tone: 'amber' },
                { label: 'Emergency alerts', value: notifications.filter((item) => !item.read && /alert|emergency|abnormal vital/i.test(item.text)).length, detail: 'Requires attention', icon: ShieldAlert, tone: 'rose' },
                { label: 'Available beds', value: 4, detail: 'Ward capacity: 8', icon: Bed, tone: 'violet' },
              ].map(({ label, value, detail, icon: Icon, tone }) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
                <div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${tone === 'rose' ? 'bg-rose-50 text-rose-600' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : tone === 'blue' ? 'bg-blue-50 text-blue-700' : tone === 'violet' ? 'bg-violet-50 text-violet-700' : 'bg-teal-50 text-teal-700'}`}><Icon className="h-[18px] w-[18px]" /></div>
                <p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 truncate text-[10px] text-slate-400">{detail}</p>
              </article>)}
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h3 className="font-bold">My Patients</h3><p className="mt-0.5 text-xs text-slate-500">Assigned to your ward and shift</p></div><button onClick={() => setSection('patients')} className="text-xs font-bold text-teal-700">View all <ChevronRight className="inline h-4 w-4" /></button></div>
                <div className="divide-y divide-slate-100">{patients.slice(0, 4).map((patient) => <PatientRow key={patient.id} patient={patient} latest={latestForPatient(patient.id)} onDetails={() => setDetailPatient(patient)} />)}</div>
              </section>
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4"><h3 className="font-bold">Shift priorities</h3><p className="mt-0.5 text-xs text-slate-500">Tasks that need follow-up</p></div>
                <div className="space-y-4 p-5">{[
                  { icon: Pill, title: 'Medication round', detail: `${pendingMeds} pending administration`, action: 'Open MAR', section: 'medication' as Section, color: 'text-blue-700 bg-blue-50' },
                  { icon: ClipboardList, title: 'Care procedures', detail: `${pendingProcedures} tasks remain`, action: 'View tasks', section: 'procedures' as Section, color: 'text-amber-700 bg-amber-50' },
                  { icon: FlaskConical, title: 'Lab reports', detail: '1 result available for review', action: 'Track tests', section: 'labs' as Section, color: 'text-violet-700 bg-violet-50' },
                ].map((task) => <div key={task.title} className="flex items-center gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${task.color}`}><task.icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{task.title}</p><p className="text-xs text-slate-500">{task.detail}</p></div><button onClick={() => setSection(task.section)} className="text-[11px] font-bold text-teal-700">{task.action}</button></div>)}</div>
                <button onClick={() => setEmergencyOpen(true)} className="mx-5 mb-5 flex w-[calc(100%-2.5rem)] items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700"><ShieldAlert className="h-4 w-4" />Raise emergency alert</button>
              </section>
            </div>
          </>}

          {section === 'patients' && <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold">Assigned Patients</h2><p className="mt-1 text-sm text-slate-500">Patients assigned to Medical Ward · 2 · Morning shift</p></div><SearchBox value={search} onChange={setSearch} /></div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{filteredPatients.map((patient) => <PatientCard key={patient.id} patient={patient} latest={latestForPatient(patient.id)} onDetails={() => setDetailPatient(patient)} />)}</div>
            {filteredPatients.length === 0 && <EmptyState text="No assigned patients match your search." />}
          </section>}

          {section === 'vitals' && <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Record vital signs</h2><p className="mt-1 text-xs text-slate-500">Document a complete observation set for an assigned patient.</p>
              <form onSubmit={submitVital} className="mt-4 grid gap-3 sm:grid-cols-2">
                <SelectField label="Patient" value={vitalForm.patientId} onChange={(value) => setVitalForm((current) => ({ ...current, patientId: value }))} options={patients.map((patient) => [patient.id, `${patient.name} · ${patient.bed}`])} />
                <InputField label="Blood pressure (mmHg)" value={vitalForm.bp} onChange={(value) => setVitalForm((current) => ({ ...current, bp: value }))} placeholder="120/80" required pattern="[0-9]{2,3}/[0-9]{2,3}" />
                <InputField label="Heart rate (bpm)" value={vitalForm.heartRate} onChange={(value) => setVitalForm((current) => ({ ...current, heartRate: value }))} type="number" min="20" max="250" placeholder="72" required />
                <InputField label="Temperature (°C)" value={vitalForm.temperature} onChange={(value) => setVitalForm((current) => ({ ...current, temperature: value }))} type="number" min="30" max="45" step="0.1" placeholder="36.8" required />
                <InputField label="SpO₂ (%)" value={vitalForm.spo2} onChange={(value) => setVitalForm((current) => ({ ...current, spo2: value }))} type="number" min="0" max="100" placeholder="98" required />
                <InputField label="Respiratory rate (/min)" value={vitalForm.respiratoryRate} onChange={(value) => setVitalForm((current) => ({ ...current, respiratoryRate: value }))} type="number" min="1" max="80" placeholder="16" required />
                <InputField label="Blood sugar (mmol/L)" value={vitalForm.bloodSugar} onChange={(value) => setVitalForm((current) => ({ ...current, bloodSugar: value }))} type="number" min="0" max="60" step="0.1" placeholder="5.5" required />
                <InputField label="Pain score (0–10)" value={vitalForm.pain} onChange={(value) => setVitalForm((current) => ({ ...current, pain: value }))} type="number" min="0" max="10" required />
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 sm:col-span-2"><Plus className="h-4 w-4" />Save vital record</button>
              </form>
              <p className="mt-3 text-[11px] text-slate-500">SpO₂ below 90% triggers an on-screen red alert in this demo. Follow your hospital escalation protocol.</p>
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="font-bold">SpO₂ trend</h2><p className="mt-1 text-xs text-slate-500">{patientName(vitalForm.patientId)} · recent readings</p></div><VitalChart records={vitals.filter((record) => record.patientId === vitalForm.patientId)} /><div className="mt-5 space-y-2">{[...vitals].reverse().filter((record) => record.patientId === vitalForm.patientId).slice(0, 5).map((record) => <div key={record.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"><span className="text-slate-500">{record.time} · BP {record.bp} · HR {record.heartRate}</span><strong className={record.spo2 < 90 ? 'text-rose-600' : 'text-slate-800'}>SpO₂ {record.spo2}%</strong></div>)}</div></section>
          </div>}

          {section === 'medication' && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5"><h2 className="font-bold">Medication Administration Record</h2><p className="mt-1 text-xs text-slate-500">Medication orders shown for your assigned patients only.</p></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr>{['Patient', 'Medicine', 'Dose · Route', 'Scheduled', 'Status', 'Nurse action'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">
              {medications.map((item) => <tr key={item.id}><td className="px-4 py-3"><p className="font-semibold">{patientName(item.patientId)}</p><p className="text-xs text-slate-500">{patients.find((patient) => patient.id === item.patientId)?.bed}</p></td><td className="px-4 py-3 font-medium">{item.medicine}</td><td className="px-4 py-3">{item.dose}<p className="text-xs text-slate-500">{item.route}</p></td><td className="px-4 py-3">{item.time}</td><td className="px-4 py-3"><StatusBadge status={item.status} />{item.note && <p className="mt-1 max-w-48 text-[10px] text-slate-500">{item.note}</p>}</td><td className="px-4 py-3">{item.status === 'Pending' ? <div className="flex gap-2"><button onClick={() => markMedication(item.id, 'Given')} className="rounded-md bg-teal-700 px-2.5 py-1.5 text-xs font-bold text-white">Given</button><button onClick={() => setMissedDoseId(item.id)} className="rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-700">Missed</button></div> : <span className="text-xs text-slate-400">Recorded</span>}</td></tr>)}
            </tbody></table></div>
            {missedDoseId !== null && <form onSubmit={(event) => { event.preventDefault(); if (!missedReason.trim()) return; markMedication(missedDoseId, 'Missed', missedReason.trim()); }} className="flex flex-wrap items-end gap-3 border-t border-slate-100 bg-rose-50 p-4"><label className="min-w-56 flex-1 text-xs font-semibold text-slate-700">Reason for missed dose<input required value={missedReason} onChange={(event) => setMissedReason(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal" placeholder="Document the reason" /></label><button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white">Save reason</button><button type="button" onClick={() => setMissedDoseId(null)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Cancel</button></form>}
          </section>}

          {section === 'notes' && <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">New nursing documentation</h2><p className="mt-1 text-xs text-slate-500">Record observations, symptoms, response, wound/dressing or shift notes.</p><form onSubmit={submitNote} className="mt-4 space-y-3"><SelectField label="Patient" value={noteForm.patientId} onChange={(value) => setNoteForm((current) => ({ ...current, patientId: value }))} options={patients.map((patient) => [patient.id, `${patient.name} · ${patient.bed}`])} /><label className="block text-xs font-semibold text-slate-700">Observation / treatment response / wound care<textarea required minLength={4} rows={5} value={noteForm.text} onChange={(event) => setNoteForm((current) => ({ ...current, text: event.target.value }))} className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-teal-600" placeholder="Document objective findings and care provided..." /></label><div className="flex items-center justify-between text-[11px] text-slate-500"><span>Signed electronically by {name}</span><span>{new Date().toLocaleString()}</span></div><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Save signed note</button></form></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Recent nursing notes</h2><p className="mt-1 text-xs text-slate-500">This shift · assigned patient records</p></div><div className="divide-y divide-slate-100">{notes.length === 0 ? <EmptyState text="No nursing notes have been added this session." /> : notes.map((note) => <article key={note.id} className="p-5"><div className="flex justify-between gap-3"><p className="font-semibold">{patientName(note.patientId)}</p><time className="text-[11px] text-slate-400">{note.time}</time></div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{note.text}</p><p className="mt-3 text-[11px] font-semibold text-teal-700">Electronically signed · {name}</p></article>)}</div></section></div>}

          {section === 'handover' && <div className="grid gap-5 xl:grid-cols-[1fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Submit shift handover</h2><p className="mt-1 text-xs text-slate-500">Summarize each patient's condition and outstanding care for the incoming nurse.</p><form onSubmit={submitHandover} className="mt-4 space-y-3"><SelectField label="Patient" name="patientId" options={patients.map((patient) => [patient.id, `${patient.name} · ${patient.bed}`])} /><TextAreaField label="Patient condition" name="condition" required /><TextAreaField label="Pending medication / tests" name="pending" required /><TextAreaField label="Important instructions" name="instructions" required /><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Save handover</button></form></section><section><h2 className="mb-3 font-bold">Handover board</h2><div className="space-y-3">{handovers.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-teal-700">{item.from} <ChevronRight className="inline h-3 w-3" /> {item.to}</span><span className="text-xs text-slate-400">{patientName(item.patientId)}</span></div><HandoverLine title="Condition" text={item.condition} /><HandoverLine title="Pending" text={item.pending} /><HandoverLine title="Instructions" text={item.instructions} /></article>)}</div></section></div>}

          {section === 'procedures' && <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Procedure checklist</h2><p className="mt-1 text-xs text-slate-500">Assigned bedside care tasks for the current shift.</p></div><div className="divide-y divide-slate-100">{procedures.map((procedure) => <div key={procedure.id} className="flex flex-wrap items-center gap-3 p-4 sm:px-5"><div className={`grid h-9 w-9 place-items-center rounded-lg ${procedure.status === 'Completed' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>{procedure.status === 'Completed' ? <Check className="h-4 w-4" /> : <Syringe className="h-4 w-4" />}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{procedure.task}</p><p className="text-xs text-slate-500">{patientName(procedure.patientId)} · {procedure.due}</p></div><StatusBadge status={procedure.status} /><button onClick={() => setProcedures((current) => current.map((item) => item.id === procedure.id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-teal-800">{procedure.status === 'Completed' ? 'Reopen' : 'Complete'}</button></div>)}</div></section>}

          {section === 'labs' && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Laboratory test tracking</h2><p className="mt-1 text-xs text-slate-500">Demo statuses only — results are not connected to a live Laboratory Portal.</p></div><div className="divide-y divide-slate-100">{labs.map((lab) => <article key={lab.id} className="flex flex-wrap items-center gap-3 p-4 sm:px-5"><div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-700"><FlaskConical className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{lab.test}</p><p className="text-xs text-slate-500">{lab.id} · {patientName(lab.patientId)} · Ordered {lab.ordered}</p></div><StatusBadge status={lab.status} /><button onClick={() => { setLabs((current) => current.map((item) => item.id === lab.id ? { ...item, status: ['Test ordered', 'Sample collected', 'Processing', 'Result available'][Math.min(['Test ordered', 'Sample collected', 'Processing', 'Result available'].indexOf(item.status) + 1, 3)] } : item)); notify('Lab tracking status updated locally.'); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold">Update</button></article>)}</div></section>}

          {section === 'emergency' && <section className="rounded-xl border border-rose-200 bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><ShieldAlert className="h-6 w-6" /></div><div><h2 className="font-bold">Emergency response</h2><p className="mt-1 text-sm text-slate-500">Raise and document a bedside emergency. This demo does not dispatch real notifications; call the hospital response team directly.</p></div></div><button onClick={() => setEmergencyOpen(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-3 font-bold text-white hover:bg-rose-700 sm:w-auto"><AlertTriangle className="h-5 w-5" />Emergency Alert</button><div className="mt-6 border-t border-slate-100 pt-5"><h3 className="mb-3 font-bold">Recent alerts</h3>{notifications.filter((item) => /emergency|alert|red alert/i.test(item.text)).map((item) => <p key={item.id} className="mb-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{item.text}</p>)}</div></section>}

          {section === 'beds' && <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Medical Ward · 2 beds</h2><p className="mt-1 text-xs text-slate-500">Current bed assignment snapshot · demo data</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{patients.map((patient) => <div key={patient.id} className="rounded-lg border border-rose-100 bg-rose-50 p-3"><Bed className="mb-2 h-4 w-4 text-rose-600" /><p className="text-sm font-bold">{patient.bed}</p><p className="truncate text-xs text-slate-600">{patient.name}</p><span className="mt-2 inline-block text-[10px] font-semibold text-rose-700">Occupied</span></div>)}{['W-201', 'W-202', 'W-203', 'W-205'].map((bed) => <div key={bed} className="rounded-lg border border-teal-100 bg-teal-50 p-3"><Bed className="mb-2 h-4 w-4 text-teal-700" /><p className="text-sm font-bold">{bed}</p><p className="text-xs text-slate-600">Available</p><span className="mt-2 inline-block text-[10px] font-semibold text-teal-700">Ready</span></div>)}</div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Bed actions</h2><p className="mt-1 text-xs text-slate-500">Requests require confirmation by the responsible hospital team.</p><div className="mt-4 space-y-3"><button onClick={() => notify('Bed transfer request recorded locally for ward coordination.')} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left text-sm font-semibold hover:border-teal-500"><ArrowUpRight className="h-4 w-4 text-teal-700" />Request patient bed transfer</button><button onClick={() => notify('Discharge preparation checklist opened for the assigned care team.')} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left text-sm font-semibold hover:border-teal-500"><ArrowDownRight className="h-4 w-4 text-blue-700" />Start discharge preparation</button></div></section></div>}

          {section === 'inventory' && <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Request ward supplies</h2><p className="mt-1 text-xs text-slate-500">Request → store approval → delivery</p><form onSubmit={saveInventoryRequest} className="mt-4 space-y-3"><label className="block text-xs font-semibold text-slate-700">Supply item<select name="item" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal">{['Syringe', 'Examination gloves', 'Normal saline', 'Dressing materials', 'IV cannula', 'Other'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-xs font-semibold text-slate-700">Quantity<input name="quantity" type="number" min="1" max="500" defaultValue="10" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal" /></label><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Submit request</button></form></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Request status</h2></div><div className="divide-y divide-slate-100">{requests.length === 0 ? <EmptyState text="No supply requests created this session." /> : requests.map((request) => <div key={request.id} className="flex items-center justify-between p-4"><div><p className="text-sm font-semibold">{request.item} <span className="text-slate-500">× {request.quantity}</span></p><p className="text-xs text-slate-500">Request #{request.id.toString().slice(-5)}</p></div><StatusBadge status={request.status} /></div>)}</div></section></div>}

          {section === 'notifications' && <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-bold">Notification center</h2><p className="mt-1 text-xs text-slate-500">{unreadCount} unread · current browser session</p></div><button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} className="text-xs font-bold text-teal-700">Mark all read</button></div><div className="divide-y divide-slate-100">{notifications.map((item) => <button key={item.id} onClick={() => setNotifications((current) => current.map((notification) => notification.id === item.id ? { ...item, read: true } : notification))} className={`flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50 ${item.read ? '' : 'bg-teal-50/40'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.read ? 'bg-slate-300' : 'bg-teal-600'}`} /><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.text}</span><span className="mt-1 block text-xs text-slate-400">{item.time}</span></span>{!item.read && <span className="text-[10px] font-bold text-teal-700">NEW</span>}</button>)}</div></section>}

          {section === 'profile' && <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-xl font-bold text-teal-700">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><h2 className="text-lg font-bold">{name}</h2><p className="text-sm text-slate-500">Registered Nurse · Medical Ward · 2</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><ProfileField label="Assigned ward" value="Medical · 2" /><ProfileField label="Current shift" value="Morning · 07:00–15:00" /><ProfileField label="Assigned patients" value={`${patients.length} patients`} /><ProfileField label="Access scope" value="Assigned ward and shift only" /></div><p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demo environment: this portal uses sample patient data held in browser memory for this session. No real patient data, clinical notification or hospital-system integration is active.</p></section>}

          {notice && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-lg border border-teal-200 bg-white px-4 py-3 text-sm font-medium text-teal-900 shadow-xl">{notice}</div>}
        </div>
      </main>

      {detailPatient && <PatientDetails patient={detailPatient} vitals={vitals.filter((record) => record.patientId === detailPatient.id)} medication={medications.filter((item) => item.patientId === detailPatient.id)} notes={notes.filter((note) => note.patientId === detailPatient.id)} onClose={() => setDetailPatient(null)} />}
      {emergencyOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEmergencyOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="emergency-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 id="emergency-title" className="text-lg font-bold text-rose-700">Raise emergency alert</h2><p className="mt-1 text-sm text-slate-500">Record patient and reason. Also activate your facility's emergency response protocol.</p></div><button onClick={() => setEmergencyOpen(false)} aria-label="Close dialog"><X className="h-5 w-5 text-slate-500" /></button></div><form onSubmit={raiseEmergency} className="mt-5 space-y-4"><SelectField label="Patient" name="patientId" options={patients.map((patient) => [patient.id, `${patient.name} · ${patient.bed}`])} /><label className="block text-xs font-semibold text-slate-700">Reason<textarea name="reason" required minLength={4} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" placeholder="Describe the emergency" /></label><p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800">Demo only: alerts are recorded in this browser. No doctor, ICU, ED or supervisor is contacted.</p><button className="w-full rounded-lg bg-rose-600 px-4 py-3 font-bold text-white">Record emergency alert</button></form></section></div>}
    </div>
  );
}

function PatientRow({ patient, latest, onDetails }: { patient: NursePatient; latest?: VitalRecord; onDetails: () => void }) {
  return <article className="flex flex-wrap items-center gap-3 px-5 py-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">{patient.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{patient.name}</p><StatusBadge status={patient.status} /></div><p className="mt-1 truncate text-xs text-slate-500">{patient.id} · {patient.bed} · {patient.diagnosis}</p></div><div className="hidden text-right sm:block"><p className="text-xs font-semibold">{latest ? `SpO₂ ${latest.spo2}%` : 'No recent vitals'}</p><p className="text-[10px] text-slate-400">{latest ? `${latest.time} · HR ${latest.heartRate}` : patient.ward}</p></div><button onClick={onDetails} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-teal-800 hover:border-teal-500">View details</button></article>;
}

function PatientCard({ patient, latest, onDetails }: { patient: NursePatient; latest?: VitalRecord; onDetails: () => void }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-2"><div><p className="font-bold">{patient.name}</p><p className="mt-1 text-xs text-slate-500">{patient.id} · {patient.age} y · {patient.gender}</p></div><StatusBadge status={patient.status} /></div><div className="my-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-xs"><div><span className="block text-slate-400">Ward / bed</span><strong className="mt-1 block">{patient.ward} · {patient.bed}</strong></div><div><span className="block text-slate-400">Assigned doctor</span><strong className="mt-1 block truncate">{patient.doctor}</strong></div></div><p className="text-xs text-slate-400">Current diagnosis</p><p className="mt-1 text-sm font-medium">{patient.diagnosis}</p><p className="mt-3 text-xs text-slate-500">{latest ? `Recent vitals · BP ${latest.bp} · HR ${latest.heartRate} · SpO₂ ${latest.spo2}%` : 'No vitals recorded this shift'}</p><button onClick={onDetails} className="mt-4 w-full rounded-lg border border-teal-200 py-2 text-sm font-bold text-teal-800 hover:bg-teal-50">View patient details</button></article>;
}

function PatientDetails({ patient, vitals, medication, notes, onClose }: { patient: NursePatient; vitals: VitalRecord[]; medication: typeof initialMeds; notes: Array<{ id: number; patientId: string; text: string; time: string }>; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="patient-detail-title" className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5"><div><p className="text-xs font-semibold text-teal-700">Patient record · {patient.id}</p><h2 id="patient-detail-title" className="mt-1 text-xl font-bold">{patient.name}</h2></div><button onClick={onClose} aria-label="Close patient details" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="space-y-5 p-5"><div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">{patient.age} y · {patient.gender} · {patient.ward} · {patient.bed}<StatusBadge status={patient.status} /></div><DetailBlock title="Current diagnosis" text={patient.diagnosis} /><DetailBlock title="Medical history" text={patient.history} /><DetailBlock title="Allergies" text={patient.allergies.length ? patient.allergies.join(', ') : 'No known allergies recorded'} alert={patient.allergies.length > 0} /><DetailBlock title="Assigned doctor notes" text={patient.doctorNote} /><div><h3 className="mb-2 text-sm font-bold">Recent vital history</h3>{vitals.length ? [...vitals].reverse().map((vital) => <p key={vital.id} className="mb-1 rounded-lg bg-slate-50 p-3 text-xs">Today {vital.time} · BP {vital.bp} · HR {vital.heartRate} · Temp {vital.temperature}°C · SpO₂ {vital.spo2}% · RR {vital.respiratoryRate}</p>) : <p className="text-sm text-slate-500">No recent vital records.</p>}</div><div><h3 className="mb-2 text-sm font-bold">Medication list</h3>{medication.length ? medication.map((item) => <p key={item.id} className="mb-1 rounded-lg bg-slate-50 p-3 text-xs">{item.medicine} · {item.dose} · {item.route} · {item.status}</p>) : <p className="text-sm text-slate-500">No medication orders in this demo.</p>}</div><DetailBlock title="Laboratory reports" text="See Lab Tracking for sample statuses. Live laboratory reports are not connected." /><div><h3 className="mb-2 text-sm font-bold">Nursing notes</h3>{notes.length ? notes.map((note) => <p key={note.id} className="mb-2 rounded-lg bg-slate-50 p-3 text-sm">{note.text}<span className="mt-2 block text-[11px] text-slate-400">{note.time}</span></p>) : <p className="text-sm text-slate-500">No nursing notes in this session.</p>}</div></div></section></div>;
}

function DetailBlock({ title, text, alert = false }: { title: string; text: string; alert?: boolean }) {
  return <div className={`rounded-lg p-4 ${alert ? 'border border-rose-100 bg-rose-50' : 'bg-slate-50'}`}><h3 className={`text-xs font-bold uppercase tracking-wide ${alert ? 'text-rose-700' : 'text-slate-500'}`}>{title}</h3><p className={`mt-1 text-sm leading-6 ${alert ? 'text-rose-900' : 'text-slate-800'}`}>{text}</p></div>;
}

function VitalChart({ records }: { records: VitalRecord[] }) {
  const data = records.slice(-8);
  if (data.length < 2) return <div className="grid h-36 place-items-center rounded-lg bg-slate-50 text-xs text-slate-500">Add at least two readings to view a trend.</div>;
  const points = data.map((record, index) => `${24 + index * (252 / (data.length - 1))},${122 - ((record.spo2 - 80) / 20) * 100}`).join(' ');
  return <div className="rounded-lg bg-slate-50 p-3"><svg viewBox="0 0 300 150" role="img" aria-label="SpO2 trend chart" className="h-36 w-full"><line x1="24" y1="22" x2="276" y2="22" stroke="#fecaca" strokeDasharray="4 4" /><line x1="24" y1="72" x2="276" y2="72" stroke="#e2e8f0" /><line x1="24" y1="122" x2="276" y2="122" stroke="#e2e8f0" /><text x="0" y="26" fill="#be123c" fontSize="9">100</text><text x="5" y="76" fill="#64748b" fontSize="9">90</text><text x="5" y="126" fill="#64748b" fontSize="9">80</text><polyline points={points} fill="none" stroke="#0f9f91" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{data.map((record, index) => <circle key={record.id} cx={24 + index * (252 / (data.length - 1))} cy={122 - ((record.spo2 - 80) / 20) * 100} r="4" fill={record.spo2 < 90 ? '#e11d48' : '#0f9f91'}><title>{record.time}: SpO₂ {record.spo2}%</title></circle>)}</svg><div className="flex justify-between text-[10px] text-slate-400">{data.map((record) => <span key={record.id}>{record.time}</span>)}</div></div>;
}

function StatusBadge({ status }: { status: string }) {
  const tone = /emergency|critical|missed|alert/i.test(status) ? 'bg-rose-50 text-rose-700' : /pending|observation|processing|ordered/i.test(status) ? 'bg-amber-50 text-amber-800' : /given|completed|stable|available|collected|requested/i.test(status) ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-700';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${tone}`}>{status}</span>;
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search assigned patients" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-600" /></label>;
}

function InputField({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void; type?: string; min?: string; max?: string; step?: string; placeholder?: string; required?: boolean; pattern?: string }) {
  return <label className="block text-xs font-semibold text-slate-700">{label}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600" /></label>;
}

function SelectField({ label, value, onChange, options, name }: { label: string; value?: string; onChange?: (value: string) => void; options: string[][]; name?: string }) {
  return <label className="block text-xs font-semibold text-slate-700">{label}<select name={name} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600">{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>;
}

function TextAreaField({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return <label className="block text-xs font-semibold text-slate-700">{label}<textarea name={name} required={required} minLength={required ? 3 : undefined} rows={2} className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" /></label>;
}

function HandoverLine({ title, text }: { title: string; text: string }) {
  return <div className="mb-2"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{title}</p><p className="mt-0.5 text-sm text-slate-700">{text}</p></div>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="p-8 text-center text-sm text-slate-500">{text}</div>;
}
