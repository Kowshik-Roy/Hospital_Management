import { FormEvent, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRightLeft, Bed, Bell, CalendarDays, Check, CheckCircle2, ChevronRight,
  Clock3, FileText, HeartPulse, LayoutDashboard, LogOut, Menu, MessageSquare, Phone,
  Plus, Printer, Search, ShieldCheck, UserPlus, Users, X,
} from 'lucide-react';
import { BED_CATEGORIES_DATA, DEPARTMENTS_DATA, DOCTORS_DATA, INITIAL_PATIENTS } from '../data/hospitalData';

type Section = 'overview' | 'patients' | 'registration' | 'appointments' | 'queue' | 'checkin' | 'admission' | 'emergency' | 'beds' | 'documents' | 'billing' | 'notifications' | 'profile' | 'communication' | 'referrals';
type PatientRecord = {
  id: string; mrn: string; name: string; dob: string; gender: string; phone: string; email: string;
  address: string; identity: string; bloodGroup: string; emergencyContact: string;
  allergies: string; history: string; registeredAt: string;
};
type AppointmentStatus = 'Scheduled' | 'Checked-in' | 'Waiting' | 'Completed' | 'Cancelled';
type AppointmentRecord = {
  id: string; patientId: string; patientName: string; doctorId: string; doctorName: string;
  department: string; date: string; time: string; status: AppointmentStatus; type: 'Booked' | 'Walk-in';
};
type QueueRecord = { id: number; token: string; appointmentId: string; patientName: string; doctorName: string; position: number; status: 'Waiting' | 'Called' | 'Skipped' };
type AdmissionRecord = { id: number; patientId: string; department: string; doctor: string; ward: string; bed: string; date: string; insurance: string; status: string };
type NotificationRecord = { id: number; title: string; detail: string; time: string; read: boolean; tone: string };
type UploadRecord = { id: number; patientId: string; fileName: string; category: string; time: string };
type ReferralRecord = { id: number; patientId: string; kind: string; hospital: string; doctor: string; reason: string; status: string };
type MessageRecord = { id: number; patientId: string; channel: string; message: string; time: string };
type PatientForm = { name: string; dob: string; gender: string; phone: string; email: string; address: string; identity: string; bloodGroup: string; emergencyContact: string; allergies: string; history: string };
type EmergencyForm = { name: string; age: string; gender: string; contact: string; condition: string; priority: string };

interface ReceptionistPortalProps {
  name: string;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  onLogout: () => void;
}

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const dateTime = () => new Date().toLocaleString();

const initialPatients: PatientRecord[] = INITIAL_PATIENTS.map((patient, index) => ({
  id: patient.id.toUpperCase(),
  mrn: `MRN-2025-${String(index + 101).padStart(4, '0')}`,
  name: patient.name,
  dob: new Date(new Date().getFullYear() - patient.age, 0, 1).toISOString().slice(0, 10),
  gender: patient.gender,
  phone: patient.phone,
  email: patient.email ?? '',
  address: patient.address,
  identity: '',
  bloodGroup: patient.bloodGroup,
  emergencyContact: patient.emergencyContact,
  allergies: patient.allergies?.join(', ') ?? '',
  history: patient.chronicDiseases?.join(', ') ?? '',
  registeredAt: patient.registeredDate,
}));

const initialAppointments: AppointmentRecord[] = [
  { id: 'APT-2601', patientId: 'PAT-1', patientName: 'Rahat Chowdhury', doctorId: 'doc-1', doctorName: DOCTORS_DATA[0].name, department: 'Cardiology & Heart Center', date: today(), time: '10:00 AM', status: 'Waiting', type: 'Booked' },
  { id: 'APT-2602', patientId: 'PAT-2', patientName: 'Shamima Nasrin', doctorId: 'doc-2', doctorName: DOCTORS_DATA[1].name, department: 'Neurology & Brain Sciences', date: today(), time: '10:30 AM', status: 'Scheduled', type: 'Booked' },
  { id: 'APT-2603', patientId: 'PAT-3', patientName: 'Aayan Ahmed', doctorId: 'doc-3', doctorName: DOCTORS_DATA[2].name, department: 'Pediatrics & Child Health', date: today(), time: '11:00 AM', status: 'Scheduled', type: 'Booked' },
  { id: 'APT-2604', patientId: 'PAT-4', patientName: 'Abdul Malek', doctorId: 'doc-4', doctorName: DOCTORS_DATA[3].name, department: 'Orthopedics & Spine Surgery', date: today(), time: '11:30 AM', status: 'Scheduled', type: 'Booked' },
  { id: 'APT-2605', patientId: 'PAT-1', patientName: 'Rahat Chowdhury', doctorId: 'doc-1', doctorName: DOCTORS_DATA[0].name, department: 'Cardiology & Heart Center', date: today(), time: '12:00 PM', status: 'Scheduled', type: 'Booked' },
  { id: 'APT-2606', patientId: 'PAT-2', patientName: 'Shamima Nasrin', doctorId: 'doc-2', doctorName: DOCTORS_DATA[1].name, department: 'Neurology & Brain Sciences', date: tomorrow(), time: '10:00 AM', status: 'Scheduled', type: 'Booked' },
];

const initialQueue: QueueRecord[] = [
  { id: 1, token: 'A101', appointmentId: 'APT-2601', patientName: 'Rahat Chowdhury', doctorName: DOCTORS_DATA[0].name, position: 1, status: 'Waiting' },
];

const initialNotifications: NotificationRecord[] = [
  { id: 1, title: 'New appointment', detail: 'Shamima Nasrin · Dr. Farhana Yasmin · 10:30 AM', time: '5 min ago', read: false, tone: 'blue' },
  { id: 2, title: 'Emergency arrival', detail: 'Trauma case registered at Emergency desk', time: '12 min ago', read: false, tone: 'rose' },
  { id: 3, title: 'Admission request', detail: 'PAT-4 · Orthopedics · awaiting management approval', time: '30 min ago', read: false, tone: 'amber' },
  { id: 4, title: 'Doctor schedule updated', detail: 'Dr. Tahmina Akter is available from 11:00 AM', time: '1 hr ago', read: true, tone: 'teal' },
  { id: 5, title: 'Payment pending', detail: 'Consultation fee · PAT-2 · ৳1,200', time: '1 hr ago', read: true, tone: 'amber' },
];

const navigation: { id: Section; label: string; icon: typeof Users }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard }, { id: 'patients', label: 'Patients', icon: Users },
  { id: 'registration', label: 'Registration', icon: UserPlus }, { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'queue', label: 'Queue Management', icon: Clock3 }, { id: 'checkin', label: 'Check-in', icon: CheckCircle2 },
  { id: 'admission', label: 'Admission', icon: Bed }, { id: 'emergency', label: 'Emergency', icon: HeartPulse },
  { id: 'beds', label: 'Bed Availability', icon: Bed }, { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'billing', label: 'Billing Support', icon: Printer }, { id: 'communication', label: 'Communication', icon: MessageSquare },
  { id: 'referrals', label: 'Referrals', icon: ArrowRightLeft }, { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: ShieldCheck },
];

export function ReceptionistPortal({ name, language, onToggleLanguage, onLogout }: ReceptionistPortalProps) {
  const [section, setSection] = useState<Section>('overview');
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [queue, setQueue] = useState(initialQueue);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([
    { id: 1, patientId: 'PAT-4', department: 'Orthopedics & Spine Surgery', doctor: DOCTORS_DATA[3].name, ward: 'Male General Ward', bed: 'W-112', date: today(), insurance: 'Pending verification', status: 'Awaiting approval' },
  ]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [documents, setDocuments] = useState<UploadRecord[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [emergencies, setEmergencies] = useState<Array<{ id: number; name: string; age: number; gender: string; contact: string; condition: string; priority: string; time: string }>>([
    { id: 1, name: 'Trauma case', age: 29, gender: 'Male', contact: '01700-000111', condition: 'Road traffic injury', priority: 'RED - Critical', time: '09:20 AM' },
    { id: 2, name: 'Walk-in patient', age: 54, gender: 'Female', contact: '01800-000222', condition: 'Acute chest discomfort', priority: 'YELLOW - Urgent', time: '09:45 AM' },
  ]);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [emergencyDialog, setEmergencyDialog] = useState(false);
  const [patientForm, setPatientForm] = useState<PatientForm>({ name: '', dob: '', gender: 'Female', phone: '', email: '', address: '', identity: '', bloodGroup: '', emergencyContact: '', allergies: '', history: '' });
  const [appointmentForm, setAppointmentForm] = useState({ patientId: '', doctorId: DOCTORS_DATA[0].id, date: today(), time: '10:00 AM', type: 'Booked' });
  const [emergencyForm, setEmergencyForm] = useState<EmergencyForm>({ name: '', age: '', gender: 'Male', contact: '', condition: '', priority: 'YELLOW - Urgent' });
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<string | null>(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const todayAppointments = appointments.filter((appointment) => appointment.date === today() && appointment.status !== 'Cancelled');
  const filteredPatients = useMemo(() => patients.filter((patient) =>
    `${patient.id} ${patient.mrn} ${patient.name} ${patient.phone}`.toLowerCase().includes(search.toLowerCase())), [patients, search]);
  const patientById = (patientId: string) => patients.find((patient) => patient.id === patientId);
  const patientName = (patientId: string) => patientById(patientId)?.name ?? 'Walk-in patient';
  const selectedDoctor = DOCTORS_DATA.find((doctor) => doctor.id === appointmentForm.doctorId) ?? DOCTORS_DATA[0];

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const addNotification = (title: string, detail: string, tone = 'teal') => {
    setNotifications((current) => [{ id: Date.now(), title, detail, time: 'Just now', read: false, tone }, ...current]);
  };

  const submitPatient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = `PAT-${String(1000 + patients.length + 1)}`;
    const record: PatientRecord = { ...patientForm, id, mrn: `MRN-${new Date().getFullYear()}-${String(1000 + patients.length + 1)}`, registeredAt: today() };
    setPatients((current) => [record, ...current]);
    setPatientForm({ name: '', dob: '', gender: 'Female', phone: '', email: '', address: '', identity: '', bloodGroup: '', emergencyContact: '', allergies: '', history: '' });
    addNotification('New patient registered', `${record.name} · ${record.id}`);
    showNotice(`Patient registered · ID ${record.id} · MRN ${record.mrn}`);
    setSection('patients');
  };

  const submitAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const patient = patientById(appointmentForm.patientId);
    if (!patient) return;
    const editing = appointmentToReschedule;
    const id = editing ?? `APT-${Date.now().toString().slice(-6)}`;
    const appointment: AppointmentRecord = {
      id, patientId: patient.id, patientName: patient.name, doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: DEPARTMENTS_DATA.find((department) => department.id === selectedDoctor.departmentId)?.name ?? 'General Medicine',
      date: appointmentForm.date, time: appointmentForm.time, status: 'Scheduled',
      type: appointmentForm.type as 'Booked' | 'Walk-in',
    };
    setAppointments((current) => editing ? current.map((item) => item.id === editing ? appointment : item) : [appointment, ...current]);
    if (appointment.type === 'Walk-in') addToQueue(appointment, false);
    addNotification(editing ? 'Appointment rescheduled' : 'New appointment', `${patient.name} · ${selectedDoctor.name} · ${appointment.time}`, 'blue');
    setAppointmentDialog(false);
    setAppointmentToReschedule(null);
    showNotice(editing ? 'Appointment rescheduled.' : `${appointment.type} appointment booked.`);
  };

  const addToQueue = (appointment: AppointmentRecord, notify = true) => {
    if (queue.some((item) => item.appointmentId === appointment.id && item.status !== 'Skipped')) return;
    const activeCount = queue.filter((item) => item.status !== 'Skipped').length;
    const next = Math.max(100, ...queue.map((item) => Number(item.token.slice(1)) || 0)) + 1;
    const queueEntry: QueueRecord = { id: Date.now(), token: `A${next}`, appointmentId: appointment.id, patientName: appointment.patientName, doctorName: appointment.doctorName, position: activeCount + 1, status: 'Waiting' };
    setQueue((current) => [...current, queueEntry]);
    if (notify) showNotice('Patient added to the waiting queue.');
  };

  const checkIn = (appointmentId: string) => {
    const appointment = appointments.find((item) => item.id === appointmentId);
    if (!appointment) return;
    if (appointment.status === 'Cancelled' || appointment.status === 'Completed') {
      showNotice('This appointment cannot be checked in.');
      return;
    }
    setAppointments((current) => current.map((item) => item.id === appointmentId ? { ...item, status: 'Waiting' } : item));
    addToQueue({ ...appointment, status: 'Waiting' });
  };

  const changeAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((current) => current.map((item) => item.id === appointmentId ? { ...item, status } : item));
    if (status === 'Cancelled') setQueue((current) => current.filter((item) => item.appointmentId !== appointmentId));
    showNotice(`Appointment marked ${status.toLowerCase()}.`);
  };

  const submitAdmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patientId = String(form.get('patientId'));
    const record: AdmissionRecord = {
      id: Date.now(), patientId, department: String(form.get('department')), doctor: String(form.get('doctor')),
      ward: String(form.get('ward')), bed: String(form.get('bed')), date: String(form.get('date')),
      insurance: String(form.get('insurance') || 'Self-pay'), status: 'Awaiting approval',
    };
    setAdmissions((current) => [record, ...current]);
    addNotification('Admission request', `${patientName(patientId)} · ${record.ward} · awaiting management approval`, 'amber');
    event.currentTarget.reset();
    showNotice('Admission request submitted for management approval.');
  };

  const submitEmergency = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const record = { ...emergencyForm, id: Date.now(), age: Number(emergencyForm.age), time: dateTime() };
    setEmergencies((current) => [record, ...current]);
    addNotification('Emergency patient arrival', `${record.name} · ${record.priority} · ${record.condition}`, 'rose');
    setEmergencyDialog(false);
    setEmergencyForm({ name: '', age: '', gender: 'Male', contact: '', condition: '', priority: 'YELLOW - Urgent' });
    showNotice('Emergency intake recorded. Alert the clinical response team directly now.');
  };

  const callNext = () => {
    const next = queue.find((item) => item.status === 'Waiting');
    if (!next) return showNotice('No waiting patient in the queue.');
    setQueue((current) => current.map((item) => item.id === next.id ? { ...item, status: 'Called' } : item));
    showNotice(`Calling ${next.token} · ${next.patientName}. Notify the assigned doctor directly.`);
  };

  const skipQueue = (id: number) => {
    setQueue((current) => current.map((item): QueueRecord => item.id === id ? { ...item, status: 'Skipped' } : item).map((item, index, all): QueueRecord => item.status === 'Waiting' ? { ...item, position: all.slice(0, index + 1).filter((entry) => entry.status === 'Waiting').length } : item));
    showNotice('Queue entry skipped.');
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patientId = String(form.get('patientId'));
    const record = { id: Date.now(), patientId, channel: String(form.get('channel')), message: String(form.get('message')), time: dateTime() };
    setMessages((current) => [record, ...current]);
    event.currentTarget.reset();
    showNotice('Message queued in the local demo. No SMS or email was sent.');
  };

  const uploadDocument = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get('file');
    if (!(file instanceof File) || !file.name) return;
    setDocuments((current) => [{ id: Date.now(), patientId: String(form.get('patientId')), fileName: file.name, category: String(form.get('category')), time: dateTime() }, ...current]);
    event.currentTarget.reset();
    showNotice('Document listed for this session only; file was not uploaded to a server.');
  };

  const openReschedule = (appointment: AppointmentRecord) => {
    setAppointmentToReschedule(appointment.id);
    setAppointmentForm({ patientId: appointment.patientId, doctorId: appointment.doctorId, date: appointment.date, time: appointment.time, type: appointment.type });
    setAppointmentDialog(true);
  };

  const createReferral = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record = { id: Date.now(), patientId: String(form.get('patientId')), kind: String(form.get('kind')), hospital: String(form.get('hospital')), doctor: String(form.get('doctor')), reason: String(form.get('reason')), status: 'Requested' };
    setReferrals((current) => [record, ...current]);
    event.currentTarget.reset();
    showNotice('Referral request documented.');
  };

  const openAppointment = (type: 'Booked' | 'Walk-in' = 'Booked') => {
    setAppointmentToReschedule(null);
    setAppointmentForm({ patientId: patients[0]?.id ?? '', doctorId: DOCTORS_DATA[0].id, date: today(), time: '10:00 AM', type });
    setAppointmentDialog(true);
  };

  const title = navigation.find((item) => item.id === section)?.label ?? 'Dashboard';
  const doctors = DOCTORS_DATA;

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-800 lg:flex">
      <aside className={`${mobileNavOpen ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-40 w-[270px] overflow-y-auto bg-[#10283f] text-white lg:sticky lg:top-0 lg:block lg:h-screen`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500"><HeartPulse className="h-5 w-5" /></div><div><p className="font-black tracking-wide">CarePulse</p><p className="text-xs text-slate-400">Front Desk Services</p></div><button className="ml-auto lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button></div>
        <div className="border-b border-white/10 px-5 py-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Reception desk</p><p className="mt-1 text-sm font-semibold">Main Lobby · Desk 01</p><p className="text-xs text-slate-400">Day shift · 08:00–16:00</p></div>
        <nav className="space-y-1 p-3">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setMobileNavOpen(false); setSearch(''); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${section === id ? 'bg-teal-500 text-white shadow-lg shadow-teal-950/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="h-[17px] w-[17px] shrink-0" /><span className="flex-1">{language === 'bn' ? bengaliNavigation[id] : label}</span>{id === 'notifications' && unreadCount > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold">{unreadCount}</span>}</button>)}</nav>
        <div className="mt-5 border-t border-white/10 p-3"><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10"><LogOut className="h-4 w-4" />{language === 'bn' ? 'সাইন আউট' : 'Sign out'}</button></div>
      </aside>
      {mobileNavOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><button onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div><p className="hidden text-xs text-slate-500 sm:block">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><h1 className="text-lg font-bold sm:text-xl">{language === 'bn' ? bengaliNavigation[section] : title}</h1></div></div><div className="flex items-center gap-2 sm:gap-3"><button onClick={onToggleLanguage} className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold text-slate-600 hover:border-teal-400">{language === 'bn' ? 'EN' : 'বাংলা'}</button><button onClick={() => setSection('notifications')} aria-label="Notifications" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell className="h-5 w-5" />{unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}</button><div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex"><div className="grid h-9 w-9 place-items-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><p className="text-sm font-semibold">{name}</p><p className="text-[11px] text-slate-500">Receptionist</p></div></div></div></header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {section === 'overview' && <ReceptionOverview name={name} appointments={todayAppointments} patients={patients} queue={queue} emergencies={emergencies} admissions={admissions} notifications={notifications} onNavigate={setSection} onNewPatient={() => setSection('registration')} onAppointment={() => openAppointment()} onEmergency={() => setEmergencyDialog(true)} onCallNext={callNext} />}
          {section === 'patients' && <PatientsSection patients={filteredPatients} search={search} setSearch={setSearch} onSelect={setSelectedPatient} />}
          {section === 'registration' && <RegistrationSection form={patientForm} setForm={setPatientForm} onSubmit={submitPatient} />}
          {section === 'appointments' && <AppointmentsSection appointments={appointments} search={search} setSearch={setSearch} onBook={() => openAppointment()} onWalkIn={() => openAppointment('Walk-in')} onCheckIn={checkIn} onCancel={(id) => changeAppointmentStatus(id, 'Cancelled')} onReschedule={openReschedule} doctors={doctors} onNotice={showNotice} />}
          {section === 'queue' && <QueueSection queue={queue} onCallNext={callNext} onSkip={skipQueue} onReassign={(id, doctorId) => { const doctor = doctors.find((item) => item.id === doctorId); if (!doctor) return; setQueue((current) => current.map((item) => item.id === id ? { ...item, doctorName: doctor.name } : item)); showNotice(`Queue reassigned to ${doctor.name}.`); }} doctors={doctors} />}
          {section === 'checkin' && <CheckInSection appointments={appointments} onCheckIn={checkIn} />}
          {section === 'admission' && <AdmissionSection patients={patients} admissions={admissions} onSubmit={submitAdmission} />}
          {section === 'emergency' && <EmergencySection emergencies={emergencies} onAdd={() => setEmergencyDialog(true)} />}
          {section === 'beds' && <BedSection />}
          {section === 'documents' && <DocumentsSection patients={patients} documents={documents} onSubmit={uploadDocument} />}
          {section === 'billing' && <BillingSection patients={patients} appointments={appointments} onPrint={() => window.print()} onNotice={showNotice} />}
          {section === 'communication' && <CommunicationSection patients={patients} messages={messages} onSubmit={sendMessage} />}
          {section === 'referrals' && <ReferralSection patients={patients} referrals={referrals} onSubmit={createReferral} />}
          {section === 'notifications' && <NotificationsSection notifications={notifications} onRead={(id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item))} onReadAll={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} />}
          {section === 'profile' && <ProfileSection name={name} />}
          {notice && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-lg border border-teal-200 bg-white px-4 py-3 text-sm font-medium text-teal-900 shadow-xl">{notice}</div>}
        </div>
      </main>
      {selectedPatient && <PatientProfileDrawer patient={selectedPatient} appointments={appointments.filter((item) => item.patientId === selectedPatient.id)} onClose={() => setSelectedPatient(null)} />}
      {appointmentDialog && <AppointmentDialog form={appointmentForm} setForm={setAppointmentForm} patients={patients} doctor={selectedDoctor} doctors={doctors} appointments={appointments} editingId={appointmentToReschedule} onSubmit={submitAppointment} onClose={() => { setAppointmentDialog(false); setAppointmentToReschedule(null); }} />}
      {emergencyDialog && <EmergencyDialog form={emergencyForm} setForm={setEmergencyForm} onSubmit={submitEmergency} onClose={() => setEmergencyDialog(false)} />}
    </div>
  );
}

const bengaliNavigation: Record<Section, string> = {
  overview: 'ড্যাশবোর্ড', patients: 'রোগী', registration: 'নিবন্ধন', appointments: 'অ্যাপয়েন্টমেন্ট',
  queue: 'কিউ ব্যবস্থাপনা', checkin: 'চেক-ইন', admission: 'ভর্তি', emergency: 'জরুরি সেবা',
  beds: 'বেড উপলভ্যতা', documents: 'ডকুমেন্ট', billing: 'বিলিং সহায়তা', communication: 'যোগাযোগ',
  referrals: 'রেফারেল', notifications: 'নোটিফিকেশন', profile: 'প্রোফাইল',
};

function ReceptionOverview({ name, appointments, patients, queue, emergencies, admissions, notifications, onNavigate, onNewPatient, onAppointment, onEmergency, onCallNext }: {
  name: string; appointments: AppointmentRecord[]; patients: PatientRecord[]; queue: QueueRecord[];
  emergencies: Array<{ id: number; name: string; priority: string }>; admissions: AdmissionRecord[];
  notifications: NotificationRecord[]; onNavigate: (section: Section) => void; onNewPatient: () => void;
  onAppointment: () => void; onEmergency: () => void; onCallNext: () => void;
}) {
  const pendingPayments = 2 + appointments.filter((appointment) => appointment.status === 'Waiting').length;
  const waiting = queue.filter((item) => item.status === 'Waiting').length;
  const stats = [
    { title: 'Total patients today', value: appointments.length + emergencies.length, hint: 'Visits & walk-ins', icon: Users, color: 'teal' },
    { title: 'New registrations', value: patients.filter((patient) => patient.registeredAt === today()).length, hint: 'Registered today', icon: UserPlus, color: 'blue' },
    { title: 'Appointments today', value: appointments.length, hint: 'Scheduled visits', icon: CalendarDays, color: 'violet' },
    { title: 'Waiting patients', value: waiting, hint: 'In live queue', icon: Clock3, color: 'amber' },
    { title: 'Emergency cases', value: emergencies.length + 2, hint: 'Triage team notified', icon: HeartPulse, color: 'rose' },
    { title: 'Admission requests', value: admissions.filter((item) => item.status !== 'Approved').length, hint: 'Awaiting approval', icon: Bed, color: 'blue' },
    { title: 'Pending payments', value: pendingPayments, hint: 'Billing follow-up', icon: Printer, color: 'amber' },
  ];
  return <>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-slate-500">Main Lobby · Front Desk</p><h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">Good morning, {name.split(' ')[0]}</h2><p className="mt-1 text-sm text-slate-500">Keep today's patient flow moving smoothly.</p></div><div className="flex flex-wrap gap-2"><button onClick={onNewPatient} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-bold text-white hover:bg-teal-800"><UserPlus className="h-4 w-4" />Register patient</button><button onClick={onAppointment} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold hover:border-teal-500"><Plus className="h-4 w-4" />Book appointment</button></div></div>
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 2xl:grid-cols-7">{stats.map((stat) => <article key={stat.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50"><div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${stat.color === 'rose' ? 'bg-rose-50 text-rose-600' : stat.color === 'amber' ? 'bg-amber-50 text-amber-700' : stat.color === 'blue' ? 'bg-blue-50 text-blue-700' : stat.color === 'violet' ? 'bg-violet-50 text-violet-700' : 'bg-teal-50 text-teal-700'}`}><stat.icon className="h-[18px] w-[18px]" /></div><p className="text-xs font-medium text-slate-500">{stat.title}</p><p className="mt-1 text-2xl font-bold">{stat.value}</p><p className="mt-1 text-[10px] text-slate-400">{stat.hint}</p></article>)}</div>
    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h3 className="font-bold">Today's appointments</h3><p className="mt-0.5 text-xs text-slate-500">Check in arrivals and keep the queue in sync</p></div><button onClick={() => onNavigate('appointments')} className="text-xs font-bold text-teal-700">View schedule <ChevronRight className="inline h-4 w-4" /></button></div><div className="divide-y divide-slate-100">{appointments.slice(0, 5).map((appointment) => <div key={appointment.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5"><div className="grid h-9 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">{appointment.time}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{appointment.patientName}</p><p className="truncate text-xs text-slate-500">{appointment.doctorName} · {appointment.department}</p></div><AppointmentBadge status={appointment.status} /><button onClick={() => onNavigate('checkin')} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-teal-800">Check-in</button></div>)}{appointments.length === 0 && <Empty text="No appointments scheduled today." />}</div></section>
      <div className="space-y-5"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-bold">Live queue</h3><p className="mt-0.5 text-xs text-slate-500">{waiting} waiting · token display local to this portal</p></div><button onClick={() => onNavigate('queue')} className="text-xs font-bold text-teal-700">Manage</button></div><div className="my-4 flex items-center gap-2">{queue.filter((item) => item.status === 'Waiting').slice(0, 3).map((item) => <span key={item.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold">{item.token}</span>)}{waiting === 0 && <span className="text-sm text-slate-500">Queue is clear</span>}</div><button onClick={onCallNext} className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800">Call next patient</button></section>
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-5"><div className="flex items-start justify-between"><div><h3 className="font-bold text-rose-900">Emergency desk</h3><p className="mt-1 text-xs text-rose-700">Fast-track emergency intake</p></div><HeartPulse className="h-5 w-5 text-rose-600" /></div><p className="my-3 text-sm font-semibold text-rose-900">{emergencies.length} new cases this session</p><button onClick={onEmergency} className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700">Quick emergency registration</button></section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-bold">Front desk alerts</h3><span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">{notifications.filter((item) => !item.read).length} new</span></div><div className="mt-3 space-y-3">{notifications.slice(0, 3).map((item) => <div key={item.id} className="flex gap-2"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.tone === 'rose' ? 'bg-rose-500' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-teal-500'}`} /><div><p className="text-xs font-semibold">{item.title}</p><p className="text-[10px] text-slate-500">{item.detail}</p></div></div>)}</div><button onClick={() => onNavigate('notifications')} className="mt-3 text-xs font-bold text-teal-700">Open notifications</button></section></div>
    </div>
  </>;
}

function PatientsSection({ patients, search, setSearch, onSelect }: { patients: PatientRecord[]; search: string; setSearch: (value: string) => void; onSelect: (patient: PatientRecord) => void }) {
  return <section><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold">Patient directory</h2><p className="mt-1 text-sm text-slate-500">Search by name, patient ID, MRN or phone. Clinical records are view-only here.</p></div><SearchInput value={search} onChange={setSearch} placeholder="Search patient, ID or phone" /></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr>{['Patient', 'Patient ID / MRN', 'Contact', 'Last registered', 'Profile'].map((item) => <th key={item} className="px-4 py-3 font-semibold">{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{patients.map((patient) => <tr key={patient.id}><td className="px-4 py-3"><p className="font-semibold">{patient.name}</p><p className="text-xs text-slate-500">{patient.gender} · {patient.bloodGroup || 'Blood group not recorded'}</p></td><td className="px-4 py-3"><p className="font-medium">{patient.id}</p><p className="text-xs text-slate-500">{patient.mrn}</p></td><td className="px-4 py-3">{patient.phone}</td><td className="px-4 py-3">{patient.registeredAt}</td><td className="px-4 py-3"><button onClick={() => onSelect(patient)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-teal-800">View profile</button></td></tr>)}</tbody></table></div>{patients.length === 0 && <Empty text="No matching patients found." />}</div></section>;
}

function RegistrationSection({ form, setForm, onSubmit }: { form: PatientForm; setForm: (value: (current: PatientForm) => PatientForm) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const field = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <section className="max-w-5xl"><div className="mb-5"><h2 className="text-xl font-bold">New patient registration</h2><p className="mt-1 text-sm text-slate-500">Enter patient-provided information. Medical history is informational only; do not edit clinical records.</p></div><form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><TextInput label="Full name" value={form.name} onChange={(value) => field('name', value)} required /><TextInput label="Date of birth" type="date" value={form.dob} onChange={(value) => field('dob', value)} required max={today()} /><SelectInput label="Gender" value={form.gender} onChange={(value) => field('gender', value)} options={['Female', 'Male', 'Other']} /><TextInput label="Phone number" type="tel" value={form.phone} onChange={(value) => field('phone', value)} required pattern="[+0-9 ()-]{7,20}" /><TextInput label="Email" type="email" value={form.email} onChange={(value) => field('email', value)} /><TextInput label="National ID / Passport" value={form.identity} onChange={(value) => field('identity', value)} /><SelectInput label="Blood group" value={form.bloodGroup} onChange={(value) => field('bloodGroup', value)} options={['Select blood group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} /><TextInput label="Emergency contact" type="tel" value={form.emergencyContact} onChange={(value) => field('emergencyContact', value)} required pattern="[+0-9 ()-]{7,20}" /><TextInput label="Address" value={form.address} onChange={(value) => field('address', value)} required /><TextInput label="Patient-reported allergies" value={form.allergies} onChange={(value) => field('allergies', value)} /><TextInput label="Previous medical history (patient reported)" value={form.history} onChange={(value) => field('history', value)} /><p className="rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-900 sm:col-span-2 lg:col-span-3">Patient ID and MRN are generated on submit. Existing patients should be searched by ID, phone or name before creating a new registration.</p></div><button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"><UserPlus className="h-4 w-4" />Create patient record</button></form></section>;
}

function AppointmentsSection({ appointments, search, setSearch, onBook, onWalkIn, onCheckIn, onCancel, onReschedule, doctors, onNotice }: {
  appointments: AppointmentRecord[]; search: string; setSearch: (value: string) => void; onBook: () => void; onWalkIn: () => void;
  onCheckIn: (id: string) => void; onCancel: (id: string) => void; onReschedule: (appointment: AppointmentRecord) => void;
  doctors: typeof DOCTORS_DATA; onNotice: (text: string) => void;
}) {
  const [date, setDate] = useState(today());
  const visible = appointments.filter((item) => `${item.patientName} ${item.doctorName} ${item.id}`.toLowerCase().includes(search.toLowerCase()));
  return <section><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold">Appointment management</h2><p className="mt-1 text-sm text-slate-500">Book, confirm, check in, reschedule and cancel visits.</p></div><div className="flex flex-wrap gap-2"><button onClick={onWalkIn} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold">Walk-in</button><button onClick={onBook} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-bold text-white"><Plus className="mr-1 inline h-4 w-4" />Book appointment</button></div></div><div className="mb-4 flex flex-wrap gap-3"><TextInput label="Schedule date" type="date" value={date} onChange={setDate} /><SearchInput value={search} onChange={setSearch} placeholder="Search appointments" /></div><div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]"><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr>{['Time / token', 'Patient', 'Doctor', 'Status', 'Actions'].map((item) => <th key={item} className="px-4 py-3 font-semibold">{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visible.filter((item) => item.date === date).map((item) => <tr key={item.id}><td className="px-4 py-3"><p className="font-bold">{item.time}</p><p className="text-xs text-slate-500">{item.id}</p></td><td className="px-4 py-3"><p className="font-semibold">{item.patientName}</p><p className="text-xs text-slate-500">{item.type}</p></td><td className="px-4 py-3">{item.doctorName}<p className="text-xs text-slate-500">{item.department}</p></td><td className="px-4 py-3"><AppointmentBadge status={item.status} /></td><td className="px-4 py-3"><div className="flex flex-wrap gap-1">{['Scheduled', 'Checked-in'].includes(item.status) && <button onClick={() => onCheckIn(item.id)} className="rounded-md bg-teal-700 px-2 py-1.5 text-[10px] font-bold text-white">Check-in</button>}{item.status !== 'Completed' && item.status !== 'Cancelled' && <button onClick={() => onReschedule(item)} className="rounded-md border border-slate-200 px-2 py-1.5 text-[10px] font-bold">Reschedule</button>}{item.status !== 'Cancelled' && item.status !== 'Completed' && <button onClick={() => onCancel(item.id)} className="rounded-md border border-rose-200 px-2 py-1.5 text-[10px] font-bold text-rose-700">Cancel</button>}</div></td></tr>)}</tbody></table></div>{visible.filter((item) => item.date === date).length === 0 && <Empty text="No appointments for this date." />}</div><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold">Doctor availability</h3><p className="mt-1 text-xs text-slate-500">Demo slot calendar · sample schedule only</p><div className="mt-4 space-y-4">{doctors.slice(0, 4).map((doctor) => <div key={doctor.id}><div className="mb-2 flex items-center justify-between gap-2"><p className="truncate text-xs font-semibold">{doctor.name}</p><span className="text-[10px] text-slate-400">{doctor.visitingHours}</span></div><div className="flex gap-1.5">{['10:00 AM', '10:30 AM', '11:00 AM'].map((slot, index) => <button key={`${doctor.id}-${slot}`} onClick={() => { const busy = appointments.some((item) => item.doctorId === doctor.id && item.date === date && item.time === slot && item.status !== 'Cancelled'); onNotice(`${doctor.name} · ${slot} · ${busy ? 'Booked' : 'Available'}`); }} className={`flex-1 rounded-md px-1 py-2 text-[9px] font-bold ${appointments.some((item) => item.doctorId === doctor.id && item.date === date && item.time === slot && item.status !== 'Cancelled') ? 'bg-rose-50 text-rose-700' : index === 1 ? 'bg-teal-50 text-teal-800' : 'bg-slate-50 text-slate-600'}`}>{slot}<span className="mt-0.5 block font-medium">{appointments.some((item) => item.doctorId === doctor.id && item.date === date && item.time === slot && item.status !== 'Cancelled') ? 'Booked' : 'Available'}</span></button>)}</div></div>)}</div></section></div></section>;
}

function QueueSection({ queue, onCallNext, onSkip, onReassign, doctors }: { queue: QueueRecord[]; onCallNext: () => void; onSkip: (id: number) => void; onReassign: (id: number, doctorId: string) => void; doctors: typeof DOCTORS_DATA }) {
  const active = queue.filter((item) => item.status !== 'Skipped');
  return <section><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold">Digital queue management</h2><p className="mt-1 text-sm text-slate-500">Queue tokens are local to this demo portal; doctor dashboards are not live-connected.</p></div><button onClick={onCallNext} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Call next patient</button></div><div className="mb-5 grid grid-cols-3 gap-3">{[['Waiting', active.filter((item) => item.status === 'Waiting').length], ['Called', active.filter((item) => item.status === 'Called').length], ['Total active', active.length]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="divide-y divide-slate-100">{active.map((item, index) => <article key={item.id} className="flex flex-wrap items-center gap-3 p-4 sm:px-5"><div className={`grid h-12 w-16 place-items-center rounded-lg font-black ${item.status === 'Called' ? 'bg-teal-100 text-teal-800' : 'bg-blue-50 text-blue-800'}`}>{item.token}</div><div className="min-w-0 flex-1"><p className="font-semibold">{item.patientName}</p><p className="text-xs text-slate-500">Position {index + 1} · {item.appointmentId}</p></div><select aria-label={`Reassign ${item.patientName}`} value={doctors.find((doctor) => doctor.name === item.doctorName)?.id ?? ''} onChange={(event) => onReassign(item.id, event.target.value)} className="max-w-48 rounded-lg border border-slate-200 px-2 py-2 text-xs">{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}</select><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status === 'Called' ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-800'}`}>{item.status}</span><button onClick={() => onSkip(item.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold">Skip</button></article>)}{active.length === 0 && <Empty text="No patients are currently queued." />}</div></div></section>;
}

function CheckInSection({ appointments, onCheckIn }: { appointments: AppointmentRecord[]; onCheckIn: (id: string) => void }) {
  const [verifiedAppointments, setVerifiedAppointments] = useState<string[]>([]);
  const todayItems = appointments.filter((item) => item.date === today() && item.status !== 'Cancelled');
  return <section><div className="mb-5"><h2 className="text-xl font-bold">Patient arrival & check-in</h2><p className="mt-1 text-sm text-slate-500">Verify identity against the appointment and mark arrival. Completed visit status is read-only from the Doctor Portal workflow.</p></div><div className="space-y-3">{todayItems.map((item) => <article key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700"><CalendarDays className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="font-semibold">{item.patientName}</p><p className="text-xs text-slate-500">{item.id} · {item.time} · {item.doctorName}</p></div><AppointmentBadge status={item.status} />{item.status === 'Scheduled' && <><label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={verifiedAppointments.includes(item.id)} onChange={(event) => setVerifiedAppointments((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} />Identity verified</label><button disabled={!verifiedAppointments.includes(item.id)} onClick={() => onCheckIn(item.id)} className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Mark arrival</button></>}{item.status === 'Waiting' && <span className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800">Identity verified · waiting</span>}{item.status === 'Completed' && <span className="text-xs text-slate-400">Visit completed</span>}</article>)}{todayItems.length === 0 && <Empty text="No patients are expected today." />}</div></section>;
}

function AdmissionSection({ patients, admissions, onSubmit }: { patients: PatientRecord[]; admissions: AdmissionRecord[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const wards = ['ICU', 'CCU', 'Male General Ward', 'Female General Ward', 'Emergency'];
  return <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Admission request</h2><p className="mt-1 text-xs text-slate-500">Receptionist submits request; management approves and coordinates bed/nurse allocation.</p><form onSubmit={onSubmit} className="mt-4 space-y-3"><SelectInput name="patientId" label="Patient" options={patients.map((patient) => `${patient.id} · ${patient.name}`)} values={patients.map((patient) => patient.id)} required /><SelectInput name="department" label="Department" options={DEPARTMENTS_DATA.map((department) => department.name)} required /><SelectInput name="doctor" label="Attending doctor" options={DOCTORS_DATA.map((doctor) => doctor.name)} required /><SelectInput name="ward" label="Requested ward" options={wards} required /><SelectInput name="bed" label="Preferred bed" options={['Any available bed', 'ICU-01', 'CCU-01', 'W-112', 'W-204', 'Cabin-304']} required /><TextInput name="date" label="Admission date" type="date" defaultValue={today()} required /><TextInput name="insurance" label="Insurance information" placeholder="Provider / policy / self-pay" /><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Submit for management approval</button></form></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Admission coordination</h2><p className="mt-1 text-xs text-slate-500">Requests · approval status · bed allocation</p></div><div className="divide-y divide-slate-100">{admissions.map((item) => <article key={item.id} className="p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">{patients.find((patient) => patient.id === item.patientId)?.name ?? item.patientId}</p><p className="text-xs text-slate-500">{item.department} · {item.date}</p></div><SimpleBadge text={item.status} /></div><div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2"><p>Doctor: {item.doctor}</p><p>Ward / bed: {item.ward} · {item.bed}</p><p>Insurance: {item.insurance}</p><p>Next: management approval → bed / nurse coordination</p></div></article>)}</div></section></div>;
}

function EmergencySection({ emergencies, onAdd }: { emergencies: Array<{ id: number; name: string; age: number; gender: string; contact: string; condition: string; priority: string; time: string }>; onAdd: () => void }) {
  return <section><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold">Emergency registration</h2><p className="mt-1 text-sm text-slate-500">Capture minimum arrival details and route immediately to clinical triage.</p></div><button onClick={onAdd} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white">Quick patient entry</button></div><div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"><AlertTriangle className="mr-2 inline h-4 w-4" />Red = Critical · Yellow = Urgent · Green = Normal. Demo entries do not alert Emergency, Doctor or Nurse systems; contact the clinical response team directly.</div><div className="space-y-3">{emergencies.map((item) => <article key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className={`grid h-10 w-10 place-items-center rounded-lg ${item.priority.startsWith('RED') ? 'bg-rose-50 text-rose-700' : item.priority.startsWith('GREEN') ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}><HeartPulse className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="font-semibold">{item.name} · {item.age} · {item.gender}</p><p className="text-xs text-slate-500">{item.condition} · Emergency contact {item.contact}</p></div><SimpleBadge text={item.priority} /><span className="text-xs text-slate-400">{item.time}</span></article>)}{emergencies.length === 0 && <Empty text="No emergency entries have been added this session." />}</div></section>;
}

function BedSection() {
  return <section><div className="mb-5"><h2 className="text-xl font-bold">Bed availability</h2><p className="mt-1 text-sm text-slate-500">View-only occupancy summary · sourced from demo hospital bed categories.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{BED_CATEGORIES_DATA.map((bed) => <article key={bed.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-bold">{bed.name}</p><p className="mt-1 text-xs text-slate-500">{bed.type.toUpperCase()}</p></div><Bed className="h-5 w-5 text-teal-700" /></div><div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] text-slate-500">Total</p><p className="mt-1 font-bold">{bed.total}</p></div><div className="rounded-lg bg-rose-50 p-2"><p className="text-[10px] text-rose-600">Occupied</p><p className="mt-1 font-bold text-rose-800">{bed.occupied}</p></div><div className="rounded-lg bg-teal-50 p-2"><p className="text-[10px] text-teal-700">Available</p><p className="mt-1 font-bold text-teal-900">{Math.max(0, bed.total - bed.occupied)}</p></div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.min(100, (bed.occupied / bed.total) * 100)}%` }} /></div></article>)}</div></section>;
}

function DocumentsSection({ patients, documents, onSubmit }: { patients: PatientRecord[]; documents: UploadRecord[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Patient document intake</h2><p className="mt-1 text-xs text-slate-500">File names are tracked in the browser only; secure EMR upload is not configured.</p><form onSubmit={onSubmit} className="mt-4 space-y-3"><SelectInput name="patientId" label="Patient" options={patients.map((patient) => `${patient.id} · ${patient.name}`)} values={patients.map((patient) => patient.id)} required /><SelectInput name="category" label="Document category" options={['Previous report', 'Referral document', 'Insurance paper', 'Patient ID document']} required /><label className="block text-xs font-semibold text-slate-700">Choose file<input name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-normal" /></label><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Add document record</button></form></section><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Recent document records</h2></div>{documents.length ? <div className="divide-y divide-slate-100">{documents.map((item) => <div key={item.id} className="flex items-center gap-3 p-4"><FileText className="h-5 w-5 text-blue-700" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.fileName}</p><p className="text-xs text-slate-500">{patients.find((patient) => patient.id === item.patientId)?.name} · {item.category}</p></div><time className="text-[10px] text-slate-400">{item.time}</time></div>)}</div> : <Empty text="No document records in this session." />}</section></div>;
}

function BillingSection({ patients, appointments, onPrint, onNotice }: { patients: PatientRecord[]; appointments: AppointmentRecord[]; onPrint: () => void; onNotice: (text: string) => void }) {
  const paymentRows = appointments.slice(0, 5);
  return <section><div className="mb-5"><h2 className="text-xl font-bold">Billing support</h2><p className="mt-1 text-sm text-slate-500">Consultation charge and payment follow-up only. Financial reports and payment editing are restricted.</p></div><div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">Reception access: view payment status, request an invoice and print a demo consultation receipt. Billing department handles payment posting and financial reports.</div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[660px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr>{['Patient', 'Appointment', 'Consultation fee', 'Payment status', 'Front desk action'].map((item) => <th key={item} className="px-4 py-3 font-semibold">{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{paymentRows.map((appointment) => { const doctor = DOCTORS_DATA.find((item) => item.id === appointment.doctorId); return <tr key={appointment.id}><td className="px-4 py-3 font-semibold">{patients.find((patient) => patient.id === appointment.patientId)?.name ?? appointment.patientName}</td><td className="px-4 py-3">{appointment.id}<p className="text-xs text-slate-500">{appointment.date} · {appointment.time}</p></td><td className="px-4 py-3">৳{doctor?.consultFee.toLocaleString() ?? '—'}</td><td className="px-4 py-3"><SimpleBadge text={appointment.status === 'Completed' ? 'Paid' : 'Pending'} /></td><td className="px-4 py-3"><button onClick={() => onNotice(`Billing request sent to billing desk for ${appointment.patientName}.`)} className="mr-2 rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold">Request invoice</button><button onClick={onPrint} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold"><Printer className="mr-1 inline h-3 w-3" />Print receipt</button></td></tr>; })}</tbody></table></div></div></section>;
}

function CommunicationSection({ patients, messages, onSubmit }: { patients: PatientRecord[]; messages: MessageRecord[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Communication center</h2><p className="mt-1 text-xs text-slate-500">Compose appointment or follow-up reminders. Delivery is simulated; no external message is sent.</p><form onSubmit={onSubmit} className="mt-4 space-y-3"><SelectInput name="patientId" label="Patient" options={patients.map((patient) => `${patient.id} · ${patient.name}`)} values={patients.map((patient) => patient.id)} required /><SelectInput name="channel" label="Channel" options={['SMS reminder', 'Appointment notification', 'Follow-up reminder', 'Email']} required /><label className="block text-xs font-semibold text-slate-700">Message<textarea name="message" minLength={4} maxLength={320} required rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" placeholder="Your appointment with Dr. Rahman is tomorrow at 10 AM." /></label><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Queue message</button></form></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Message activity</h2></div>{messages.length ? <div className="divide-y divide-slate-100">{messages.map((item) => <article key={item.id} className="p-4"><div className="flex justify-between gap-2"><p className="text-sm font-semibold">{patientNameFromList(patients, item.patientId)} · {item.channel}</p><time className="text-[10px] text-slate-400">{item.time}</time></div><p className="mt-2 text-sm text-slate-600">{item.message}</p><p className="mt-2 text-[10px] font-semibold text-amber-700">Local queue · not sent</p></article>)}</div> : <Empty text="No messages composed this session." />}</section></div>;
}

function ReferralSection({ patients, referrals, onSubmit }: { patients: PatientRecord[]; referrals: ReferralRecord[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Referral & transfer request</h2><p className="mt-1 text-xs text-slate-500">Document referral logistics; clinical referral decisions belong to the treating doctor.</p><form onSubmit={onSubmit} className="mt-4 space-y-3"><SelectInput name="patientId" label="Patient" options={patients.map((patient) => `${patient.id} · ${patient.name}`)} values={patients.map((patient) => patient.id)} required /><SelectInput name="kind" label="Referral type" options={['Doctor referral', 'External referral', 'Transfer request']} required /><TextInput name="hospital" label="Hospital / facility" required /><TextInput name="doctor" label="Doctor / contact information" required /><label className="block text-xs font-semibold text-slate-700">Referral reason<textarea name="reason" required minLength={5} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" /></label><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Record referral request</button></form></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold">Referral register</h2></div>{referrals.length ? <div className="divide-y divide-slate-100">{referrals.map((item) => <article key={item.id} className="p-4"><div className="flex justify-between gap-2"><p className="font-semibold">{patientNameFromList(patients, item.patientId)} · {item.kind}</p><SimpleBadge text={item.status} /></div><p className="mt-1 text-xs text-slate-500">{item.hospital} · {item.doctor}</p><p className="mt-2 text-sm text-slate-600">{item.reason}</p></article>)}</div> : <Empty text="No referral requests in this session." />}</section></div>;
}

function NotificationsSection({ notifications, onRead, onReadAll }: { notifications: NotificationRecord[]; onRead: (id: number) => void; onReadAll: () => void }) {
  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-bold">Notification center</h2><p className="mt-1 text-xs text-slate-500">{notifications.filter((item) => !item.read).length} unread · demo session</p></div><button onClick={onReadAll} className="text-xs font-bold text-teal-700">Mark all read</button></div><div className="divide-y divide-slate-100">{notifications.map((item) => <button key={item.id} onClick={() => onRead(item.id)} className={`flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50 ${item.read ? '' : 'bg-teal-50/40'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.tone === 'rose' ? 'bg-rose-500' : item.read ? 'bg-slate-300' : 'bg-teal-600'}`} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{item.detail}</span><span className="mt-1 block text-[10px] text-slate-400">{item.time}</span></span>{!item.read && <span className="text-[10px] font-bold text-teal-700">NEW</span>}</button>)}</div></section>;
}

function ProfileSection({ name }: { name: string }) {
  return <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-xl font-bold text-teal-700">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><h2 className="text-lg font-bold">{name}</h2><p className="text-sm text-slate-500">Receptionist · Main Lobby · Desk 01</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><ProfileField label="Role" value="Receptionist" /><ProfileField label="Shift" value="Day · 08:00–16:00" /><ProfileField label="Permissions" value="Patient entry, appointments, queue, admission requests" /><ProfileField label="Restricted access" value="Clinical records and financial reports" /></div><p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demo workspace: records and actions are held in browser memory. No database, doctor portal, nurse portal, billing system, SMS or email integration is active.</p></section>;
}

function PatientProfileDrawer({ patient, appointments, onClose }: { patient: PatientRecord; appointments: AppointmentRecord[]; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="profile-title" className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5"><div><p className="text-xs font-semibold text-teal-700">{patient.id} · {patient.mrn}</p><h2 id="profile-title" className="mt-1 text-xl font-bold">{patient.name}</h2></div><button onClick={onClose} aria-label="Close patient profile" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="space-y-5 p-5"><DetailCard title="Basic information" text={`${patient.gender} · DOB ${patient.dob} · ${patient.phone} · ${patient.email || 'No email'} · ${patient.address}`} /><DetailCard title="Emergency contact" text={patient.emergencyContact || 'Not recorded'} /><DetailCard title="Patient-reported allergies" text={patient.allergies || 'Not recorded'} /><DetailCard title="Previous medical history (patient reported)" text={patient.history || 'Not recorded'} /><section><h3 className="mb-2 text-sm font-bold">Appointment history</h3>{appointments.length ? appointments.map((item) => <p key={item.id} className="mb-2 rounded-lg bg-slate-50 p-3 text-xs">{item.date} · {item.time} · {item.doctorName} · {item.status}</p>) : <p className="text-sm text-slate-500">No appointment records available to this demo.</p>}</section><DetailCard title="Reports & billing" text="Report files and payment status require connected EMR/Billing services. Reception access does not include clinical notes or financial reports." /></div></section></div>;
}

function AppointmentDialog({ form, setForm, patients, doctor, doctors, appointments, editingId, onSubmit, onClose }: {
  form: { patientId: string; doctorId: string; date: string; time: string; type: string };
  setForm: (value: (current: typeof form) => typeof form) => void; patients: PatientRecord[];
  doctor: typeof DOCTORS_DATA[number]; doctors: typeof DOCTORS_DATA; appointments: AppointmentRecord[];
  editingId: string | null; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void;
}) {
  const slots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];
  const editing = Boolean(editingId);
  return <Modal title={editing ? 'Reschedule appointment' : `${form.type} appointment`} onClose={onClose}><form onSubmit={onSubmit} className="space-y-3"><SelectInput label="Patient" value={form.patientId} onChange={(value) => setForm((current) => ({ ...current, patientId: value }))} options={patients.map((patient) => `${patient.id} · ${patient.name}`)} values={patients.map((patient) => patient.id)} required /><SelectInput label="Doctor" value={form.doctorId} onChange={(value) => setForm((current) => ({ ...current, doctorId: value }))} options={doctors.map((item) => `${item.name} · ${item.specialty}`)} values={doctors.map((item) => item.id)} required /><p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">{doctor.name} · {doctor.visitingHours} · {doctor.roomNo}</p><TextInput label="Appointment date" type="date" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} min={today()} required /><label className="block text-xs font-semibold text-slate-700">Available time<select value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal">{slots.map((slot) => { const busy = appointments.some((item) => item.doctorId === form.doctorId && item.date === form.date && item.time === slot && item.status !== 'Cancelled' && item.id !== editingId); return <option key={slot} value={slot} disabled={busy}>{slot}{busy ? ' · Booked' : ' · Available'}</option>; })}</select></label><p className="text-[11px] text-slate-500">Appointments are demo records; doctor schedules are not live-connected.</p><div className="flex gap-2"><button className="flex-1 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">{editing ? 'Save new time' : 'Confirm appointment'}</button><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button></div></form></Modal>;
}

function EmergencyDialog({ form, setForm, onSubmit, onClose }: { form: EmergencyForm; setForm: (value: (current: EmergencyForm) => EmergencyForm) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <Modal title="Quick emergency registration" onClose={onClose}><form onSubmit={onSubmit} className="space-y-3"><TextInput label="Patient name" value={form.name} onChange={(value) => update('name', value)} required /><div className="grid grid-cols-2 gap-3"><TextInput label="Age" type="number" min="0" max="120" value={form.age} onChange={(value) => update('age', value)} required /><SelectInput label="Gender" value={form.gender} onChange={(value) => update('gender', value)} options={['Male', 'Female', 'Other']} /></div><TextInput label="Emergency contact" type="tel" value={form.contact} onChange={(value) => update('contact', value)} required pattern="[+0-9 ()-]{7,20}" /><TextInput label="Condition / presenting concern" value={form.condition} onChange={(value) => update('condition', value)} required /><SelectInput label="Triage priority" value={form.priority} onChange={(value) => update('priority', value)} options={['RED - Critical', 'YELLOW - Urgent', 'GREEN - Normal']} /><p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800">This demo records intake only. Immediately notify Emergency, Doctor and Nurse teams using your hospital protocol.</p><button className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white">Record emergency arrival</button></form></Modal>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Close dialog"><X className="h-5 w-5 text-slate-500" /></button></div>{children}</section></div>;
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-600" /></label>;
}

function TextInput({ label, value, onChange, type = 'text', required = false, ...props }: { label: string; value?: string; onChange?: (value: string) => void; type?: string; required?: boolean; name?: string; min?: string; max?: string; maxLength?: number; pattern?: string; placeholder?: string; defaultValue?: string }) {
  return <label className="block text-xs font-semibold text-slate-700">{label}<input {...props} type={type} required={required} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600" /></label>;
}

function SelectInput({ label, value, onChange, options, values, name, required = false }: { label: string; value?: string; onChange?: (value: string) => void; options: string[]; values?: string[]; name?: string; required?: boolean }) {
  return <label className="block text-xs font-semibold text-slate-700">{label}<select name={name} required={required} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-600">{options.map((option, index) => <option key={values?.[index] ?? option} value={values?.[index] ?? option}>{option}</option>)}</select></label>;
}

function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  const tone = status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : status === 'Waiting' || status === 'Checked-in' ? 'bg-amber-50 text-amber-800' : status === 'Completed' ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-800';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${tone}`}>{status}</span>;
}

function SimpleBadge({ text }: { text: string }) {
  const tone = /red|critical|cancel|emergency/i.test(text) ? 'bg-rose-50 text-rose-700' : /pending|awaiting|yellow|urgent|requested/i.test(text) ? 'bg-amber-50 text-amber-800' : /approved|paid|green|available/i.test(text) ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-700';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${tone}`}>{text}</span>;
}

function DetailCard({ title, text }: { title: string; text: string }) {
  return <div className="rounded-lg bg-slate-50 p-4"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-800">{text}</p></div>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="p-8 text-center text-sm text-slate-500">{text}</div>;
}

function patientNameFromList(patients: PatientRecord[], patientId: string) {
  return patients.find((patient) => patient.id === patientId)?.name ?? patientId;
}
