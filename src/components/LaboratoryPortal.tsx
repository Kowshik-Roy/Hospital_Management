import { FormEvent, ReactNode, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Barcode, Bell, Check, CheckCircle2,
  ClipboardList, Clock3, Download, FileCheck2, FileText, FlaskConical,
  LayoutDashboard, LogOut, Menu, Package, Plus, QrCode, Search, ShieldCheck,
  TestTube2, UserRound, Wallet, X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { DOCTORS_DATA } from '../data/hospitalData';

type Section = 'overview' | 'queue' | 'orders' | 'collection' | 'tracking' | 'processing' | 'results' | 'reports' | 'alerts' | 'inventory' | 'billing' | 'analytics' | 'notifications' | 'profile';
type OrderStatus = 'Ordered' | 'Collected' | 'Received' | 'Processing' | 'Awaiting verification' | 'Verified' | 'Rejected' | 'Delivered';
type Priority = 'Normal' | 'Urgent' | 'Emergency';
type ResultEntry = { name: string; value: string; unit: string; reference: string; abnormal: boolean; critical: boolean };
type TestOrder = {
  id: string; patientId: string; patient: string; age: number; gender: string; doctor: string;
  department: string; test: string; category: string; priority: Priority; orderDate: string;
  status: OrderStatus; sampleId: string; sampleType: string; sampleStatus: string; location: string;
  collector: string; collectedAt: string; results: ResultEntry[]; remarks: string;
  verifiedBy: string; verifiedAt: string; billingStatus: string; cost: number;
};
type InventoryItem = { id: string; name: string; category: string; stock: number; unit: string; threshold: number; purchaseDate: string; expiryDate: string; supplier: string; storage: string };
type NotificationItem = { id: number; title: string; detail: string; time: string; read: boolean; kind: string };

interface LaboratoryPortalProps {
  name: string;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  onLogout: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);
const formatMoney = (amount: number) => `৳${Math.round(amount).toLocaleString('en-BD')}`;
const categoryList = ['Hematology', 'Biochemistry', 'Microbiology', 'Pathology', 'Immunology', 'Radiology'];
const statusList: OrderStatus[] = ['Ordered', 'Collected', 'Received', 'Processing', 'Awaiting verification', 'Verified', 'Rejected', 'Delivered'];
const priorityStyles: Record<Priority, string> = { Normal: 'bg-slate-100 text-slate-700', Urgent: 'bg-amber-50 text-amber-700', Emergency: 'bg-rose-50 text-rose-700' };
const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
const primaryButton = 'inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800';

const initialOrders: TestOrder[] = [
  { id: 'LAB-2081', patientId: 'pat-1', patient: 'Rahat Chowdhury', age: 46, gender: 'Male', doctor: DOCTORS_DATA[0].name, department: 'Cardiology & Heart Center', test: 'Complete Blood Count (CBC)', category: 'Hematology', priority: 'Urgent', orderDate: today(), status: 'Processing', sampleId: 'SMP-51081', sampleType: 'Blood', sampleStatus: 'Processing', location: 'Hematology Lab · Analyzer 02', collector: 'Nusrat Jahan', collectedAt: '09:18 AM', results: [{ name: 'Hemoglobin', value: '13.5', unit: 'g/dL', reference: '13.0–17.0', abnormal: false, critical: false }, { name: 'WBC', value: '7,000', unit: 'cells/µL', reference: '4,000–11,000', abnormal: false, critical: false }, { name: 'Platelets', value: '250,000', unit: 'cells/µL', reference: '150,000–400,000', abnormal: false, critical: false }], remarks: 'Routine CBC panel', verifiedBy: '', verifiedAt: '', billingStatus: 'Pending', cost: 500 },
  { id: 'LAB-2082', patientId: 'pat-2', patient: 'Shamima Nasrin', age: 38, gender: 'Female', doctor: DOCTORS_DATA[1].name, department: 'Neurology & Brain Sciences', test: 'Serum Potassium', category: 'Biochemistry', priority: 'Emergency', orderDate: today(), status: 'Awaiting verification', sampleId: 'SMP-51082', sampleType: 'Blood', sampleStatus: 'Processing', location: 'Biochemistry Lab · Bench 01', collector: 'Arif Hossain', collectedAt: '09:32 AM', results: [{ name: 'Potassium', value: '7.0', unit: 'mmol/L', reference: '3.5–5.1', abnormal: true, critical: true }], remarks: 'Repeat sample confirmed', verifiedBy: '', verifiedAt: '', billingStatus: 'Pending', cost: 650 },
  { id: 'LAB-2083', patientId: 'pat-3', patient: 'Aayan Ahmed', age: 6, gender: 'Male', doctor: DOCTORS_DATA[2].name, department: 'Pediatrics & Child Health', test: 'Urine Culture', category: 'Microbiology', priority: 'Normal', orderDate: today(), status: 'Received', sampleId: 'SMP-51083', sampleType: 'Urine', sampleStatus: 'Received', location: 'Microbiology · Receiving bench', collector: 'Nusrat Jahan', collectedAt: '10:05 AM', results: [], remarks: '', verifiedBy: '', verifiedAt: '', billingStatus: 'Pending', cost: 1200 },
  { id: 'LAB-2084', patientId: 'pat-4', patient: 'Abdul Malek', age: 68, gender: 'Male', doctor: DOCTORS_DATA[3].name, department: 'Orthopedics & Spine Surgery', test: 'Tissue Histopathology', category: 'Pathology', priority: 'Urgent', orderDate: today(), status: 'Ordered', sampleId: '', sampleType: 'Tissue', sampleStatus: 'Not collected', location: 'Collection room', collector: '', collectedAt: '', results: [], remarks: '', verifiedBy: '', verifiedAt: '', billingStatus: 'Pending', cost: 2400 },
  { id: 'LAB-2085', patientId: 'pat-1', patient: 'Rahat Chowdhury', age: 46, gender: 'Male', doctor: DOCTORS_DATA[0].name, department: 'Cardiology & Heart Center', test: 'Lipid Profile', category: 'Biochemistry', priority: 'Normal', orderDate: today(), status: 'Verified', sampleId: 'SMP-51085', sampleType: 'Blood', sampleStatus: 'Completed', location: 'Cold storage · Freezer A-12', collector: 'Arif Hossain', collectedAt: '08:20 AM', results: [{ name: 'Total cholesterol', value: '185', unit: 'mg/dL', reference: '< 200', abnormal: false, critical: false }], remarks: 'Fasting sample', verifiedBy: 'Dr. Samira Ahmed · Lab Supervisor', verifiedAt: today(), billingStatus: 'Invoiced', cost: 1800 },
  { id: 'LAB-2086', patientId: 'pat-2', patient: 'Shamima Nasrin', age: 38, gender: 'Female', doctor: DOCTORS_DATA[1].name, department: 'Neurology & Brain Sciences', test: 'MRI Brain', category: 'Radiology', priority: 'Normal', orderDate: today(), status: 'Delivered', sampleId: '', sampleType: 'Imaging', sampleStatus: 'N/A', location: 'Radiology archive', collector: '', collectedAt: '', results: [{ name: 'Impression', value: 'No acute intracranial abnormality', unit: '', reference: 'No acute pathology', abnormal: false, critical: false }], remarks: 'Report delivered to ordering physician', verifiedBy: 'Dr. Samira Ahmed · Lab Supervisor', verifiedAt: today(), billingStatus: 'Paid', cost: 8500 },
  { id: 'LAB-2087', patientId: 'pat-3', patient: 'Aayan Ahmed', age: 6, gender: 'Male', doctor: DOCTORS_DATA[2].name, department: 'Pediatrics & Child Health', test: 'C-Reactive Protein', category: 'Immunology', priority: 'Urgent', orderDate: today(), status: 'Collected', sampleId: 'SMP-51087', sampleType: 'Blood', sampleStatus: 'Collected', location: 'Collection room · Rack B3', collector: 'Nusrat Jahan', collectedAt: '10:42 AM', results: [], remarks: '', verifiedBy: '', verifiedAt: '', billingStatus: 'Pending', cost: 950 },
];

const initialInventory: InventoryItem[] = [
  { id: 'INV-LAB-014', name: 'CBC reagent kit', category: 'Reagent', stock: 4, unit: 'kits', threshold: 8, purchaseDate: '2026-09-10', expiryDate: '2026-12-30', supplier: 'HealthTech Diagnostics', storage: 'Reagent room · Shelf R2' },
  { id: 'INV-LAB-015', name: 'Potassium assay reagent', category: 'Chemical', stock: 12, unit: 'bottles', threshold: 5, purchaseDate: '2026-08-25', expiryDate: '2027-02-15', supplier: 'MedSupply Bangladesh', storage: '2–8°C · Refrigerator B' },
  { id: 'INV-LAB-016', name: 'EDTA collection tubes', category: 'Consumable', stock: 86, unit: 'tubes', threshold: 40, purchaseDate: '2026-10-01', expiryDate: '2028-10-01', supplier: 'MedSupply Bangladesh', storage: 'Collection room · Cabinet 4' },
  { id: 'INV-LAB-017', name: 'Urine culture plates', category: 'Test kit', stock: 3, unit: 'packs', threshold: 6, purchaseDate: '2026-07-15', expiryDate: '2026-11-30', supplier: 'BioLab Suppliers', storage: 'Microbiology · Refrigerator A' },
];

const initialNotifications: NotificationItem[] = [
  { id: 1, title: 'Critical potassium result', detail: 'LAB-2082 · Shamima Nasrin · 7.0 mmol/L · notify doctor and care team', time: 'Just now', read: false, kind: 'critical' },
  { id: 2, title: 'Supervisor verification required', detail: 'LAB-2081 · CBC · Rahat Chowdhury', time: '8 min ago', read: false, kind: 'verification' },
  { id: 3, title: 'Low stock alert', detail: 'CBC reagent kit · 4 kits remaining · threshold 8', time: '24 min ago', read: false, kind: 'inventory' },
  { id: 4, title: 'New urgent order', detail: 'LAB-2087 · C-Reactive Protein · Pediatrics', time: '32 min ago', read: true, kind: 'order' },
];

const navigation: { id: Section; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard }, { id: 'queue', label: 'Test Queue', icon: ClipboardList },
  { id: 'orders', label: 'Test Orders', icon: TestTube2 }, { id: 'collection', label: 'Sample Collection', icon: Barcode },
  { id: 'tracking', label: 'Sample Tracking', icon: QrCode }, { id: 'processing', label: 'Processing', icon: Activity },
  { id: 'results', label: 'Result Entry', icon: FileCheck2 }, { id: 'reports', label: 'Report Management', icon: FileText },
  { id: 'alerts', label: 'Critical Alerts', icon: AlertTriangle }, { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'billing', label: 'Billing', icon: Wallet }, { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'notifications', label: 'Notifications', icon: Bell }, { id: 'profile', label: 'Profile', icon: UserRound },
];

export function LaboratoryPortal({ name, language, onToggleLanguage, onLogout }: LaboratoryPortalProps) {
  const [section, setSection] = useState<Section>('overview');
  const [orders, setOrders] = useState(initialOrders);
  const [inventory, setInventory] = useState(initialInventory);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [priorityFilter, setPriorityFilter] = useState('All priorities');
  const [resultOrder, setResultOrder] = useState<TestOrder | null>(null);
  const [verificationOrder, setVerificationOrder] = useState<TestOrder | null>(null);
  const [sampleOrder, setSampleOrder] = useState<TestOrder | null>(null);
  const [sampleDetail, setSampleDetail] = useState<TestOrder | null>(null);
  const [notice, setNotice] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeOrders = orders.filter((order) => !['Verified', 'Delivered'].includes(order.status));
  const criticalOrders = orders.filter((order) => order.results.some((result) => result.critical) && order.status !== 'Delivered');
  const pendingOrders = orders.filter((order) => ['Ordered', 'Collected', 'Received'].includes(order.status));
  const processingOrders = orders.filter((order) => ['Processing', 'Awaiting verification'].includes(order.status));
  const completedOrders = orders.filter((order) => ['Verified', 'Delivered'].includes(order.status));
  const delayedOrders = orders.filter((order) => !['Verified', 'Delivered', 'Rejected'].includes(order.status) && order.priority === 'Urgent');
  const pendingBilling = orders.filter((order) => order.billingStatus === 'Pending');
  const unreadCount = notifications.filter((item) => !item.read).length;
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const queryMatch = `${order.id} ${order.patientId} ${order.patient} ${order.doctor} ${order.test} ${order.sampleId} ${order.department}`.toLowerCase().includes(search.toLowerCase());
    return queryMatch && (statusFilter === 'All statuses' || order.status === statusFilter) && (priorityFilter === 'All priorities' || order.priority === priorityFilter);
  }), [orders, search, statusFilter, priorityFilter]);

  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4500);
  };
  const goTo = (id: Section) => {
    setSection(id);
    setSearch('');
    setStatusFilter('All statuses');
    setPriorityFilter('All priorities');
    setMobileNavOpen(false);
  };
  const updateOrder = (id: string, updates: Partial<TestOrder>) => setOrders((current) => current.map((order) => order.id === id ? { ...order, ...updates } : order));
  const receiveSample = (order: TestOrder) => {
    updateOrder(order.id, { status: 'Received', sampleStatus: 'Received', location: 'Processing lab · Receiving bench' });
    toast(`${order.sampleId} received into laboratory custody.`);
  };
  const startProcessing = (order: TestOrder) => {
    updateOrder(order.id, { status: 'Processing', sampleStatus: 'Processing', location: `${order.category} Lab · Processing bench` });
    toast(`${order.id} moved to ${order.category} processing.`);
  };

  const collectSample = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sampleOrder) return;
    const data = new FormData(event.currentTarget);
    const sampleId = sampleOrder.sampleId || `SMP-${String(Date.now()).slice(-5)}`;
    updateOrder(sampleOrder.id, {
      sampleId, sampleType: String(data.get('sampleType')), sampleStatus: 'Collected',
      location: String(data.get('location')), collector: String(data.get('collector')),
      collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Collected',
    });
    setSampleOrder(null);
    toast(`Sample ${sampleId} collection recorded and barcode generated.`);
  };

  const enterResults = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resultOrder) return;
    const data = new FormData(event.currentTarget);
    const fields = resultOrder.test.toLowerCase().includes('cbc')
      ? ['Hemoglobin', 'WBC', 'Platelets']
      : resultOrder.test.toLowerCase().includes('potassium')
        ? ['Potassium']
        : ['Result'];
    const units = resultOrder.test.toLowerCase().includes('cbc')
      ? ['g/dL', 'cells/µL', 'cells/µL']
      : resultOrder.test.toLowerCase().includes('potassium') ? ['mmol/L'] : [''];
    const refs = resultOrder.test.toLowerCase().includes('cbc')
      ? ['13.0–17.0', '4,000–11,000', '150,000–400,000']
      : resultOrder.test.toLowerCase().includes('potassium') ? ['3.5–5.1'] : ['See test reference range'];
    const entered = fields.map((field, index) => {
      const raw = String(data.get(`result-${index}`) ?? '').trim();
      const value = raw || (index === 0 ? String(data.get('summary') ?? '').trim() : '');
      const numeric = Number(value.replaceAll(',', ''));
      const critical = field === 'Potassium' && Number.isFinite(numeric) && (numeric >= 6.5 || numeric < 2.5);
      const abnormal = critical || (field === 'Hemoglobin' && Number.isFinite(numeric) && numeric < 13) || (field === 'WBC' && Number.isFinite(numeric) && (numeric < 4000 || numeric > 11000));
      return { name: field, value, unit: units[index], reference: refs[index], abnormal, critical };
    }).filter((result) => result.value);
    if (!entered.length) {
      toast('Enter a result value before submitting for verification.');
      return;
    }
    const remarks = String(data.get('remarks') ?? '').trim();
    updateOrder(resultOrder.id, { results: entered, remarks, status: 'Awaiting verification', sampleStatus: 'Processing' });
    if (entered.some((result) => result.critical)) {
      setNotifications((current) => [{ id: Date.now(), title: 'CRITICAL RESULT ALERT', detail: `${resultOrder.id} · ${resultOrder.patient} · ${entered.filter((result) => result.critical).map((result) => `${result.name} ${result.value} ${result.unit}`).join(', ')} · notify doctor, nurse and emergency team`, time: 'Just now', read: false, kind: 'critical' }, ...current]);
      toast('CRITICAL RESULT: immediate clinical escalation required. Notify the doctor, nurse and emergency team directly.');
    } else {
      toast(`${resultOrder.id} saved and sent to the lab supervisor for verification.`);
    }
    setResultOrder(null);
  };

  const verifyResult = (order: TestOrder, approve: boolean) => {
    if (approve) {
      setVerificationOrder(order);
      return;
    }
    updateOrder(order.id, { status: 'Rejected', verifiedBy: '', verifiedAt: '' });
    toast(`${order.id} returned to the technician for correction.`);
  };
  const approveVerification = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!verificationOrder) return;
    const data = new FormData(event.currentTarget);
    const supervisor = String(data.get('supervisor') ?? '').trim();
    if (!supervisor) {
      toast('Enter the approving supervisor name before signing the report.');
      return;
    }
    updateOrder(verificationOrder.id, {
      status: 'Verified',
      verifiedBy: `${supervisor} · Lab Supervisor`,
      verifiedAt: today(),
      sampleStatus: 'Completed',
      location: verificationOrder.sampleId ? 'Cold storage · Freezer A-12' : verificationOrder.location,
      billingStatus: verificationOrder.billingStatus === 'Pending' ? 'Invoice requested' : verificationOrder.billingStatus,
    });
    toast(`${verificationOrder.id} digitally signed and verified; billing request queued.`);
    setVerificationOrder(null);
  };

  const updateInventory = (id: string, amount: number) => {
    setInventory((current) => current.map((item) => item.id === id ? { ...item, stock: Math.max(0, item.stock + amount) } : item));
    toast('Inventory quantity updated.');
  };
  const currentTitle = navigation.find((item) => item.id === section)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 lg:flex">
      <aside className={`${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-[276px] overflow-y-auto bg-[#10283f] text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500"><FlaskConical className="h-5 w-5" /></div><div><p className="font-black tracking-wide">CarePulse</p><p className="text-xs text-slate-400">Laboratory Services</p></div><button onClick={() => setMobileNavOpen(false)} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button></div>
        <div className="mx-4 my-4 rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Laboratory workspace</p><p className="mt-1 text-sm font-semibold">Core Lab · Shift A</p><p className="mt-1 text-xs text-teal-300">● On duty</p></div>
        <nav className="space-y-1 px-3 pb-4">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => goTo(id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${section === id ? 'bg-teal-500 text-white shadow-lg shadow-teal-950/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="h-[17px] w-[17px] shrink-0" /><span className="flex-1">{label}</span>{id === 'notifications' && unreadCount > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold">{unreadCount}</span>}{id === 'alerts' && criticalOrders.length > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold">{criticalOrders.length}</span>}</button>)}</nav>
        <div className="border-t border-white/10 p-3"><div className="mb-3 flex items-center gap-2 px-3 py-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-teal-700 text-xs font-bold">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="min-w-0"><p className="truncate text-xs font-semibold">{name}</p><p className="text-[10px] text-slate-400">Lab Technician</p></div></div><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button></div>
      </aside>
      {mobileNavOpen && <button className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div className="min-w-0"><p className="hidden text-xs text-slate-500 sm:block">{new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-BD', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><h1 className="truncate text-lg font-bold sm:text-xl">{currentTitle}</h1></div></div>
          <div className="flex items-center gap-2"><button onClick={onToggleLanguage} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">{language === 'en' ? 'বাংলা' : 'EN'}</button><button onClick={() => goTo('notifications')} className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600" aria-label="Notifications"><Bell className="h-4 w-4" />{unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{unreadCount}</span>}</button><div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold sm:flex"><ShieldCheck className="h-4 w-4 text-teal-700" />Lab Staff</div></div>
        </header>

        <div className="mx-auto max-w-[1480px] space-y-6 p-4 sm:p-6 lg:p-8">
          {section === 'overview' && <>
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-teal-700">Good day, {name}</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Laboratory dashboard</h2><p className="mt-1 text-sm text-slate-500">Test operations, sample flow and critical results for today.</p></div><button onClick={() => goTo('queue')} className={primaryButton}><ClipboardList className="h-4 w-4" />Open test queue</button></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"><Metric label="Pending tests" value={String(pendingOrders.length)} detail="Awaiting next workflow step" icon={ClipboardList} tone="blue" /><Metric label="Samples collected today" value={String(orders.filter((order) => order.sampleId && order.orderDate === today()).length)} detail="Unique specimens logged" icon={Barcode} tone="teal" /><Metric label="Processing tests" value={String(processingOrders.length)} detail="Including verification queue" icon={Activity} tone="violet" /><Metric label="Completed reports" value={String(completedOrders.length)} detail="Verified or delivered" icon={FileCheck2} tone="green" /><Metric label="Critical results" value={String(criticalOrders.length)} detail="Requires clinical escalation" icon={AlertTriangle} tone="rose" /><Metric label="Delayed / urgent" value={String(delayedOrders.length)} detail="Prioritize turnaround" icon={Clock3} tone="amber" /></div>
            <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-bold">Daily test volume</h3><p className="mt-1 text-xs text-slate-500">Orders and completed tests · last 7 days</p></div><span className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">This week</span></div><div className="mt-6 grid h-48 grid-cols-7 items-end gap-4 border-b border-l border-slate-100 px-3 pb-2">{[42, 68, 55, 86, 62, 100, 76].map((height, index) => <div key={index} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex h-[85%] w-full items-end justify-center gap-1"><span style={{ height: `${height}%` }} className="w-3 rounded-t bg-teal-500" /><span style={{ height: `${Math.max(20, height * 0.55)}%` }} className="w-3 rounded-t bg-slate-200" /></div><span className="text-[10px] text-slate-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span></div>)}</div><div className="mt-4 flex gap-5 text-xs text-slate-500"><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-teal-500" />Orders</span><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-slate-200" />Completed</span></div></section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="font-bold">Category distribution</h3><p className="mt-1 text-xs text-slate-500">Current work queue</p><div className="mt-5 space-y-4">{categoryList.map((category) => { const count = orders.filter((order) => order.category === category).length; const percent = Math.max(5, Math.round(count / orders.length * 100)); return <div key={category}><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium">{category}</span><span className="text-slate-500">{count} tests</span></div><div className="h-2 rounded-full bg-slate-100"><div style={{ width: `${percent}%` }} className="h-2 rounded-full bg-teal-500" /></div></div>; })}</div></section>
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><PanelHeading title="Priority test queue" subtitle="Urgent and emergency orders requiring attention" action={<button onClick={() => goTo('queue')} className="text-sm font-semibold text-teal-700">View queue →</button>} /><OrderTable orders={orders.filter((order) => order.priority !== 'Normal' && !['Delivered', 'Verified'].includes(order.status)).slice(0, 5)} onSample={setSampleOrder} onReceive={receiveSample} onStart={startProcessing} onResult={setResultOrder} onViewSample={setSampleDetail} onVerify={verifyResult} /></section>
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><PanelHeading title="Critical result alerts" subtitle="Immediate clinical follow-up required" /><div className="divide-y divide-slate-100">{criticalOrders.map((order) => <div key={order.id} className="flex gap-3 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600"><AlertTriangle className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-rose-800">{order.test} · {order.patient}</p><p className="mt-1 text-xs text-slate-500">{order.results.filter((result) => result.critical).map((result) => `${result.name}: ${result.value} ${result.unit}`).join(', ')} · {order.id}</p><button onClick={() => goTo('alerts')} className="mt-2 text-xs font-bold text-rose-700">Open alert details →</button></div></div>)}{criticalOrders.length === 0 && <EmptyState text="No critical result alerts." />}</div></section>
            </div>
          </>}

          {['queue', 'orders', 'processing', 'results'].includes(section) && <Records title={section === 'queue' ? 'Test queue' : section === 'orders' ? 'Test orders' : section === 'processing' ? 'Test processing' : 'Result entry & verification'} subtitle="Search patient, test, order or sample; use filters to manage workflow." search={search} onSearch={setSearch}>
            <FilterBar status={statusFilter} onStatus={setStatusFilter} priority={priorityFilter} onPriority={setPriorityFilter} />
            <OrderTable orders={section === 'processing' ? filteredOrders.filter((order) => ['Received', 'Processing'].includes(order.status)) : section === 'results' ? filteredOrders.filter((order) => order.results.length > 0 || order.status === 'Awaiting verification') : section === 'queue' ? filteredOrders.filter((order) => !['Verified', 'Delivered'].includes(order.status)) : filteredOrders} onSample={setSampleOrder} onReceive={receiveSample} onStart={startProcessing} onResult={setResultOrder} onViewSample={setSampleDetail} onVerify={verifyResult} />
          </Records>}

          {section === 'collection' && <Records title="Sample collection" subtitle="Collect and label ordered specimens with traceable sample IDs." search={search} onSearch={setSearch}><div className="mb-4 grid gap-3 sm:grid-cols-3"><InfoTile label="Awaiting collection" value={String(orders.filter((order) => order.status === 'Ordered').length)} /><InfoTile label="Collected today" value={String(orders.filter((order) => order.sampleId && order.orderDate === today()).length)} /><InfoTile label="Specimen types" value="Blood · Urine · Tissue · Swab" /></div><OrderTable orders={filteredOrders.filter((order) => !['Verified', 'Delivered'].includes(order.status))} onSample={setSampleOrder} onReceive={receiveSample} onStart={startProcessing} onResult={setResultOrder} onViewSample={setSampleDetail} onVerify={verifyResult} showCollection /></Records>}

          {section === 'tracking' && <Records title="Sample tracking" subtitle="Trace specimen location, status, storage condition and barcode." search={search} onSearch={setSearch}><SampleTracking orders={filteredOrders.filter((order) => order.sampleId)} onView={setSampleDetail} /></Records>}

          {section === 'reports' && <Records title="Report management" subtitle="Supervisor-verified reports ready for review, PDF download and printing." search={search} onSearch={setSearch}><ReportList orders={filteredOrders.filter((order) => ['Verified', 'Delivered'].includes(order.status))} onDeliver={(order) => { updateOrder(order.id, { status: 'Delivered' }); toast(`${order.id} marked delivered to the ordering clinician.`); }} /></Records>}

          {section === 'alerts' && <Records title="Critical result alerts" subtitle="Critical value flags generated during result entry. Escalate to clinical staff immediately."><div className="space-y-3">{criticalOrders.map((order) => <article key={order.id} className="rounded-xl border border-rose-200 bg-rose-50/60 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-700"><AlertTriangle className="h-5 w-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-rose-900">{order.test}</h3><StatusPill status="CRITICAL ALERT" /></div><p className="mt-1 text-sm">{order.patient} · {order.patientId} · {order.doctor}</p><p className="mt-1 text-sm font-bold text-rose-800">{order.results.filter((result) => result.critical).map((result) => `${result.name} ${result.value} ${result.unit}`).join(' · ')}</p><p className="mt-1 text-xs text-slate-600">Raised just now · Notify ordering doctor, assigned nurse and emergency department immediately.</p></div></div><button onClick={() => setResultOrder(order)} className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-bold text-rose-800">Review result</button></div></article>)}{criticalOrders.length === 0 && <EmptyState text="No active critical alerts." />}</div></Records>}

          {section === 'inventory' && <Records title="Reagent & laboratory inventory" subtitle="Manage stock, lot expiry, supplier and storage location." action={<button onClick={() => setInventory((current) => [{ id: `INV-LAB-${String(Date.now()).slice(-3)}`, name: 'New lab supply', category: 'Consumable', stock: 0, unit: 'units', threshold: 5, purchaseDate: today(), expiryDate: today(), supplier: 'Unassigned', storage: 'Receiving' }, ...current])} className={primaryButton}><Plus className="h-4 w-4" />Add inventory item</button>}><div className="mb-4 grid gap-3 sm:grid-cols-3"><InfoTile label="Inventory items" value={String(inventory.length)} /><InfoTile label="Low stock alerts" value={String(inventory.filter((item) => item.stock <= item.threshold).length)} /><InfoTile label="Expiring within 90 days" value={String(inventory.filter((item) => (new Date(item.expiryDate).getTime() - Date.now()) / 86400000 <= 90).length)} /></div><div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Item / category', 'Stock', 'Purchase date', 'Expiry', 'Supplier / storage', 'Status', 'Update'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{inventory.map((item) => <tr key={item.id}><td className="px-4 py-3"><b>{item.name}</b><p className="mt-1 text-xs text-slate-500">{item.id} · {item.category}</p></td><td className="px-4 py-3 font-semibold">{item.stock} {item.unit}<p className="text-xs text-slate-400">Min {item.threshold}</p></td><td className="px-4 py-3 text-slate-500">{item.purchaseDate}</td><td className="px-4 py-3 text-slate-500">{item.expiryDate}</td><td className="px-4 py-3">{item.supplier}<p className="text-xs text-slate-500">{item.storage}</p></td><td className="px-4 py-3"><StatusPill status={item.stock <= item.threshold ? 'Low stock' : 'Available'} /></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => updateInventory(item.id, -1)} aria-label={`Use ${item.name}`} className="rounded border px-2 py-1">−</button><button onClick={() => updateInventory(item.id, 1)} aria-label={`Restock ${item.name}`} className="rounded border px-2 py-1">+</button></div></td></tr>)}</tbody></table></div></Records>}

          {section === 'billing' && <Records title="Laboratory billing requests" subtitle="Test orders raise a billing request; invoice posting is handled by the Accountant portal."><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Test order', 'Patient', 'Service', 'Date', 'Charge', 'Billing status', 'Action'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredOrders.map((order) => <tr key={order.id}><td className="px-4 py-3 font-semibold">{order.id}</td><td className="px-4 py-3">{order.patient}<p className="text-xs text-slate-500">{order.patientId}</p></td><td className="px-4 py-3">{order.test}</td><td className="px-4 py-3">{order.orderDate}</td><td className="px-4 py-3 font-semibold">{formatMoney(order.cost)}</td><td className="px-4 py-3"><StatusPill status={order.billingStatus} /></td><td className="px-4 py-3">{order.billingStatus === 'Pending' ? <button onClick={() => { updateOrder(order.id, { billingStatus: 'Invoice requested' }); toast(`Billing request for ${order.id} sent to Accountant portal.`); }} className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:border-teal-600">Send request</button> : <span className="text-xs text-slate-500">{order.billingStatus === 'Paid' ? 'Settled' : 'Sent to billing'}</span>}</td></tr>)}</tbody></table></div><p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Demo billing hand-off: request status is local to this portal and is not yet synchronized with Accountant records.</p></Records>}

          {section === 'analytics' && <section className="space-y-5"><div><h2 className="text-2xl font-black">Laboratory analytics</h2><p className="mt-1 text-sm text-slate-500">Test activity, average turnaround and revenue generated from current demo records.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Tests today" value={String(orders.filter((order) => order.orderDate === today()).length)} icon={TestTube2} tone="blue" /><Metric label="Completed" value={String(completedOrders.length)} icon={CheckCircle2} tone="green" /><Metric label="Average turnaround" value="2.4 hrs" detail="Demo estimate" icon={Clock3} tone="violet" /><Metric label="Revenue generated" value={formatMoney(orders.filter((order) => ['Invoice requested', 'Invoiced', 'Paid'].includes(order.billingStatus)).reduce((sum, order) => sum + order.cost, 0))} icon={Wallet} tone="teal" /></div><div className="grid gap-5 xl:grid-cols-2"><AnalyticsBars title="Tests by department" data={departmentsSummary(orders)} /><AnalyticsBars title="Most common test categories" data={categoryList.map((category) => ({ label: category, value: orders.filter((order) => order.category === category).length }))} /></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Turnaround and volume visualizations are based on demonstration records until connected to a persisted LIS database.</div></section>}

          {section === 'notifications' && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><PanelHeading title="Laboratory notifications" subtitle="New orders, critical results, verification tasks, stock and delayed reports" action={<button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} className="text-sm font-semibold text-teal-700">Mark all read</button>} /><div className="divide-y divide-slate-100">{notifications.map((item) => <div key={item.id} className={`flex items-start gap-3 p-4 sm:px-6 ${item.read ? '' : 'bg-teal-50/40'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.kind === 'critical' ? 'bg-rose-500' : item.read ? 'bg-slate-300' : 'bg-teal-500'}`} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.detail}</p><p className="mt-2 text-xs text-slate-400">{item.time}</p></div>{!item.read && <button onClick={() => setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry))} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium">Mark read</button>}</div>)}</div></section>}

          {section === 'profile' && <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700"><UserRound className="h-7 w-7" /></div><div><h2 className="text-xl font-bold">{name}</h2><p className="text-sm text-slate-500">Laboratory Technician · Core Laboratory · Shift A</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><InfoTile label="Assigned workload" value={`${activeOrders.length} active test orders`} /><InfoTile label="Completed reports" value={String(completedOrders.length)} /></div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><p className="font-bold">Access boundary</p><p className="mt-1">Lab staff can process assigned test orders and manage specimens/results. Doctor prescriptions, patient medical histories and billing amounts are not editable here.</p></div></section>}

          {notice && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">{notice}</div>}
          <p className="text-xs text-slate-400">Demo laboratory workspace · workflow updates and notifications are local to this session and do not send clinical alerts or persist to a hospital system.</p>
        </div>
      </main>

      {sampleOrder && <SampleModal order={sampleOrder} onClose={() => setSampleOrder(null)} onSubmit={collectSample} />}
      {resultOrder && <ResultModal order={resultOrder} onClose={() => setResultOrder(null)} onSubmit={enterResults} onVerify={verifyResult} />}
      {verificationOrder && <SupervisorModal order={verificationOrder} onClose={() => setVerificationOrder(null)} onSubmit={approveVerification} />}
      {sampleDetail && <SampleDetail order={sampleDetail} onClose={() => setSampleDetail(null)} />}
    </div>
  );
}

const departmentsSummary = (orders: TestOrder[]) => {
  const counts = new Map<string, number>();
  orders.forEach((order) => counts.set(order.department, (counts.get(order.department) ?? 0) + 1));
  return Array.from(counts, ([label, value]) => ({ label, value }));
};

function Metric({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail?: string; icon: typeof Activity; tone: string }) {
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-blue-700', teal: 'bg-teal-50 text-teal-700', violet: 'bg-violet-50 text-violet-700', green: 'bg-emerald-50 text-emerald-700', rose: 'bg-rose-50 text-rose-700', amber: 'bg-amber-50 text-amber-700' };
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-black tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">{detail ?? 'Current lab activity'}</p></article>;
}
function PanelHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5"><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>{action}</div>;
}
function Records({ title, subtitle, search, onSearch, action, children }: { title: string; subtitle: string; search?: string; onSearch?: (value: string) => void; action?: ReactNode; children: ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><PanelHeading title={title} subtitle={subtitle} action={action} />{onSearch && <div className="border-b border-slate-100 p-4"><label className="relative block max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search patient, patient ID, test, sample or doctor" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500" /></label></div>}<div className="p-4 sm:p-5">{children}</div></section>;
}
function InfoTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1.5 text-lg font-bold">{value}</p></div>;
}
function StatusPill({ status }: { status: string }) {
  const text = status.toLowerCase();
  const color = text.includes('critical') || text.includes('reject') || text.includes('emergency') ? 'bg-rose-50 text-rose-700'
    : text.includes('verified') || text.includes('paid') || text.includes('available') || text.includes('delivered') || text.includes('completed') ? 'bg-emerald-50 text-emerald-700'
      : text.includes('pending') || text.includes('ordered') || text.includes('urgent') || text.includes('review') || text.includes('invoice') || text.includes('collected') ? 'bg-amber-50 text-amber-700'
        : 'bg-blue-50 text-blue-700';
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${color}`}>{status}</span>;
}
function PriorityPill({ priority }: { priority: Priority }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[priority]}`}>{priority}</span>;
}
function FilterBar({ status, onStatus, priority, onPriority }: { status: string; onStatus: (value: string) => void; priority: string; onPriority: (value: string) => void }) {
  return <div className="mb-4 flex flex-wrap gap-2"><select value={status} onChange={(event) => onStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option>All statuses</option>{statusList.map((item) => <option key={item}>{item}</option>)}</select><select value={priority} onChange={(event) => onPriority(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option>All priorities</option><option>Normal</option><option>Urgent</option><option>Emergency</option></select></div>;
}
function OrderTable({ orders, onSample, onReceive, onStart, onResult, onViewSample, onVerify, showCollection = false }: { orders: TestOrder[]; onSample: (order: TestOrder) => void; onReceive: (order: TestOrder) => void; onStart: (order: TestOrder) => void; onResult: (order: TestOrder) => void; onViewSample: (order: TestOrder) => void; onVerify: (order: TestOrder, approve: boolean) => void; showCollection?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[1020px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Test order', 'Patient / ordered by', 'Test / category', 'Priority', 'Sample', 'Status', 'Action'].map((item) => <th key={item} className="px-4 py-3 font-semibold">{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{orders.map((order) => <tr key={order.id} className="hover:bg-slate-50/70"><td className="px-4 py-3 font-semibold text-teal-800">{order.id}<p className="mt-1 text-[11px] font-normal text-slate-400">{order.orderDate}</p></td><td className="px-4 py-3"><span className="font-medium">{order.patient}</span><p className="mt-1 text-[11px] text-slate-500">{order.patientId} · {order.age}y · {order.gender}</p><p className="mt-1 text-[11px] text-slate-400">{order.doctor}</p></td><td className="px-4 py-3"><span className="font-medium">{order.test}</span><p className="mt-1 text-[11px] text-slate-500">{order.category} · {order.department}</p></td><td className="px-4 py-3"><PriorityPill priority={order.priority} /></td><td className="px-4 py-3">{order.sampleId ? <button onClick={() => onViewSample(order)} className="text-left font-semibold text-teal-700 hover:underline">{order.sampleId}<p className="mt-1 text-[11px] font-normal text-slate-500">{order.sampleStatus}</p></button> : <span className="text-xs text-slate-400">Not collected</span>}</td><td className="px-4 py-3"><StatusPill status={order.status} />{order.results.some((result) => result.critical) && <p className="mt-1 text-[10px] font-bold text-rose-700">CRITICAL VALUE</p>}</td><td className="px-4 py-3"><div className="flex flex-wrap gap-1.5">
    {['Ordered'].includes(order.status) && <button onClick={() => onSample(order)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:border-teal-500">Collect</button>}
    {['Collected'].includes(order.status) && <button onClick={() => onReceive(order)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold">Receive</button>}
    {['Received'].includes(order.status) && <button onClick={() => onStart(order)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold">Start</button>}
    {['Processing'].includes(order.status) && <button onClick={() => onResult(order)} className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-800">Enter results</button>}
    {['Awaiting verification'].includes(order.status) && <><button onClick={() => onVerify(order, true)} className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800">Verify</button><button onClick={() => onVerify(order, false)} className="rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700">Return</button></>}
    {order.status === 'Rejected' && <button onClick={() => onResult({ ...order, status: 'Processing' })} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold">Correct</button>}
    {order.results.length > 0 && <button onClick={() => onResult(order)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold">Review</button>}
    {showCollection && order.status !== 'Ordered' && <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500"><Check className="h-3 w-3" />Logged</span>}
  </div></td></tr>)}</tbody></table>{orders.length === 0 && <EmptyState text="No test orders match the selected filters." />}</div>;
}
function SampleTracking({ orders, onView }: { orders: TestOrder[]; onView: (order: TestOrder) => void }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{orders.map((order) => <button key={order.id} onClick={() => onView(order)} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-400 hover:shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{order.sampleId}</p><h3 className="mt-1 font-bold">{order.patient}</h3><p className="mt-1 text-xs text-slate-500">{order.patientId} · {order.sampleType} · {order.test}</p></div><StatusPill status={order.sampleStatus} /></div><div className="mt-4 rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Current location</p><p className="mt-1 text-sm font-semibold">{order.location}</p><p className="mt-1 text-xs text-slate-500">Collector: {order.collector || '—'} · {order.collectedAt || '—'}</p></div><div className="mt-4 flex items-center gap-2"><QRCodeSVG value={`CarePulse|${order.sampleId}|${order.id}|${order.patientId}`} size={54} level="M" /><div className="text-left"><p className="text-xs font-semibold">Sample barcode / QR</p><p className="mt-1 font-mono text-[10px] text-slate-500">{order.sampleId} · order {order.id}</p><p className="mt-1 text-[10px] text-slate-400">Storage: -20°C monitor · archive after validation</p></div></div></button>)}</div>;
}
function ReportList({ orders, onDeliver }: { orders: TestOrder[]; onDeliver: (order: TestOrder) => void }) {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <article key={order.id} className="rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{order.test}</h3>
                <StatusPill status={order.status === 'Delivered' ? 'Delivered' : 'Ready'} />
              </div>
              <p className="mt-1 text-sm text-slate-600">{order.patient} · {order.patientId} · {order.age}y {order.gender}</p>
              <p className="mt-1 text-xs text-slate-500">{order.id} · Ordered by {order.doctor} · Verified by {order.verifiedBy} on {order.verifiedAt}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadReport(order)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"><Download className="mr-1 inline h-3.5 w-3.5" />PDF</button>
              <button onClick={() => window.print()} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Print</button>
              {order.status !== 'Delivered' && <button onClick={() => onDeliver(order)} className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white">Mark delivered</button>}
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400"><tr><th className="py-2">Analyte</th><th>Result</th><th>Unit</th><th>Reference range</th><th>Flag</th></tr></thead>
              <tbody>
                {order.results.map((result) => (
                  <tr key={result.name} className="border-t border-slate-100">
                    <td className="py-2 font-medium">{result.name}</td>
                    <td className={`font-bold ${result.critical ? 'text-rose-700' : result.abnormal ? 'text-amber-700' : ''}`}>{result.value}</td>
                    <td>{result.unit || '—'}</td><td>{result.reference}</td>
                    <td>{result.critical ? 'CRITICAL' : result.abnormal ? 'Abnormal' : 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">Technician: {order.collector || 'Lab staff'} · Digitally verified by {order.verifiedBy}</p>
        </article>
      ))}
      {orders.length === 0 && <EmptyState text="No verified reports found." />}
    </div>
  );
}
async function downloadReport(order: TestOrder) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(16); doc.text('CarePulse Hospital Laboratory', 18, 20);
  doc.setFontSize(10); doc.text('LABORATORY RESULT REPORT', 18, 31);
  doc.text(`Report / Test ID: ${order.id}`, 18, 42); doc.text(`Date: ${order.orderDate}`, 18, 49);
  doc.text(`Patient: ${order.patient} (${order.patientId})`, 18, 58); doc.text(`Age / Gender: ${order.age} / ${order.gender}`, 18, 65);
  doc.text(`Ordering doctor: ${order.doctor}`, 18, 72); doc.text(`Department: ${order.department}`, 18, 79);
  doc.line(18, 85, 192, 85); let y = 95;
  order.results.forEach((result) => { doc.text(`${result.name}: ${result.value} ${result.unit} | Ref: ${result.reference} | ${result.critical ? 'CRITICAL' : result.abnormal ? 'Abnormal' : 'Normal'}`, 18, y); y += 9; });
  if (order.remarks) { y += 5; doc.text(`Remarks: ${order.remarks}`, 18, y); y += 10; }
  doc.text(`Laboratory technician: ${order.collector || 'Lab staff'}`, 18, y + 8);
  doc.text(`Digitally verified by: ${order.verifiedBy}`, 18, y + 15);
  doc.text(`Verification date: ${order.verifiedAt}`, 18, y + 22);
  doc.text('This demo report is not a substitute for an authorized clinical laboratory report.', 18, y + 35);
  doc.save(`${order.id}-report.pdf`);
}
function AnalyticsBars({ title, data }: { title: string; data: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...data.map((row) => row.value));
  return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold">{title}</h3><div className="mt-4 space-y-4">{data.map((row) => <div key={row.label}><div className="mb-1 flex justify-between text-xs"><span>{row.label}</span><b>{row.value}</b></div><div className="h-2 rounded-full bg-slate-100"><div style={{ width: `${Math.max(4, row.value / max * 100)}%` }} className="h-2 rounded-full bg-teal-500" /></div></div>)}</div></section>;
}
function EmptyState({ text }: { text: string }) {
  return <div className="py-10 text-center text-sm text-slate-500">{text}</div>;
}
function SampleModal({ order, onClose, onSubmit }: { order: TestOrder; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={`Collect sample · ${order.id}`} onClose={onClose} onSubmit={onSubmit}><p className="rounded-lg bg-slate-50 p-3 text-sm"><b>{order.patient}</b> · {order.test} · {order.priority} priority</p><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Sample type<select name="sampleType" defaultValue={order.sampleType} className={inputClass}>{['Blood', 'Urine', 'Tissue', 'Saliva', 'Swab', 'Imaging'].map((type) => <option key={type}>{type}</option>)}</select></label><label className="block text-sm font-medium">Collected by<input name="collector" required defaultValue="Nusrat Jahan" className={inputClass} /></label><label className="block text-sm font-medium sm:col-span-2">Initial location<input name="location" required defaultValue="Collection room · Rack A1" className={inputClass} /></label></div><p className="flex items-center gap-2 rounded-lg bg-teal-50 p-3 text-xs text-teal-800"><Barcode className="h-4 w-4" />Unique sample ID and QR label will be generated on collection.</p></Modal>;
}
function ResultModal({ order, onClose, onSubmit, onVerify }: { order: TestOrder; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onVerify: (order: TestOrder, approve: boolean) => void }) {
  const isCbc = order.test.toLowerCase().includes('cbc');
  const isPotassium = order.test.toLowerCase().includes('potassium');
  if (order.status === 'Awaiting verification') return <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 p-4"><section role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold">Supervisor verification</h2><p className="mt-1 text-xs text-slate-500">{order.id} · {order.test} · {order.patient}</p></div><button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="space-y-4 p-5"><div className="rounded-lg bg-slate-50 p-4">{order.results.map((result) => <div key={result.name} className="flex flex-wrap justify-between gap-2 border-b py-2 last:border-0"><span>{result.name} <small className="text-slate-500">{result.reference}</small></span><b className={result.critical ? 'text-rose-700' : result.abnormal ? 'text-amber-700' : 'text-emerald-700'}>{result.value} {result.unit} · {result.critical ? 'CRITICAL' : result.abnormal ? 'Abnormal' : 'Normal'}</b></div>)}</div><p className="text-sm text-slate-600">Remarks: {order.remarks || '—'}</p><p className="text-xs text-slate-500">Approving records the signed-in staff name and verification date. Critical results still require direct clinical escalation.</p><div className="flex justify-end gap-2"><button onClick={() => { onVerify(order, false); onClose(); }} className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700">Return for correction</button><button onClick={() => { onVerify(order, true); onClose(); }} className={primaryButton}><Check className="h-4 w-4" />Approve report</button></div></div></section></div>;
  return <Modal title={`Enter result · ${order.id}`} onClose={onClose} onSubmit={onSubmit}><p className="rounded-lg bg-slate-50 p-3 text-sm"><b>{order.patient}</b> · {order.test} · {order.sampleId}</p><div className="grid gap-4 sm:grid-cols-2">{(isCbc ? ['Hemoglobin · g/dL · ref 13.0–17.0', 'WBC · cells/µL · ref 4,000–11,000', 'Platelets · cells/µL · ref 150,000–400,000'] : isPotassium ? ['Potassium · mmol/L · ref 3.5–5.1'] : ['Result / impression']).map((label, index) => <label key={label} className="block text-sm font-medium">{label}<input name={`result-${index}`} defaultValue={order.results[index]?.value ?? ''} required={index === 0} className={inputClass} placeholder="Enter measured value" /></label>)}<label className="block text-sm font-medium sm:col-span-2">Remarks / interpretation<textarea name="remarks" defaultValue={order.remarks} rows={3} className={inputClass} placeholder="Optional technical remarks" /></label></div>{isPotassium && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">Automatic critical flag applies at potassium ≥ 6.5 or &lt; 2.5 mmol/L. Confirmed critical values require immediate direct escalation to the clinical team.</p>}<p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Submitting sends this result to the supervisor verification queue. It does not modify the patient medical history.</p></Modal>;
}
function SupervisorModal({ order, onClose, onSubmit }: { order: TestOrder; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={`Supervisor sign-off · ${order.id}`} onClose={onClose} onSubmit={onSubmit} submitLabel="Digitally sign & approve">
    <p className="rounded-lg bg-slate-50 p-3 text-sm"><b>{order.patient}</b> · {order.test} · Review the entered values before final authorization.</p>
    <div className="space-y-2 rounded-lg border border-slate-200 p-4">
      {order.results.map((result) => <div key={result.name} className="flex flex-wrap justify-between gap-2 text-sm"><span>{result.name} <span className="text-xs text-slate-500">ref {result.reference}</span></span><b className={result.critical ? 'text-rose-700' : result.abnormal ? 'text-amber-700' : 'text-emerald-700'}>{result.value} {result.unit} · {result.critical ? 'CRITICAL' : result.abnormal ? 'Abnormal' : 'Normal'}</b></div>)}
    </div>
    <label className="block text-sm font-medium">Approving supervisor name<input name="supervisor" required className={inputClass} placeholder="Supervisor full name" /></label>
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Demo sign-off only. Production verification must require a separately authenticated supervisor and auditable digital signature. Critical values still require direct clinical escalation.</p>
  </Modal>;
}
function SampleDetail({ order, onClose }: { order: TestOrder; onClose: () => void }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 p-4"><section role="dialog" aria-modal="true" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><p className="text-xs font-semibold uppercase text-teal-700">Specimen chain of custody</p><h2 className="mt-1 text-xl font-bold">{order.sampleId}</h2></div><button onClick={onClose} aria-label="Close sample" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="space-y-4 p-5"><div className="flex items-center gap-3"><QRCodeSVG value={`CarePulse|${order.sampleId}|${order.id}|${order.patientId}`} size={88} /><div><p className="font-bold">{order.patient}</p><p className="mt-1 text-xs text-slate-500">{order.patientId} · {order.test}</p><p className="mt-2"><StatusPill status={order.sampleStatus} /></p></div></div><div className="space-y-3">{[['Ordered', order.orderDate, 'Doctor order'], ['Collected', order.collectedAt || 'Pending', `Collector: ${order.collector || '—'}`], ['Current status', order.sampleStatus, order.location], ['Storage condition', 'Temperature monitored', order.sampleStatus === 'Completed' ? 'Freezer A-12 · -20°C' : 'Processing bench · per SOP']].map(([title, time, detail]) => <div key={title} className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-teal-500" /><div><p className="text-sm font-semibold">{title} · {time}</p><p className="text-xs text-slate-500">{detail}</p></div></div>)}</div><p className="font-mono text-xs text-slate-500">Barcode: {order.sampleId} | {order.id}</p><button onClick={onClose} className={`${primaryButton} w-full`}>Close tracking</button></div></section></div>;
}
function Modal({ title, onClose, onSubmit, children, submitLabel = 'Save and continue' }: { title: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; children: ReactNode; submitLabel?: string }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="lab-modal-title" className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 id="lab-modal-title" className="font-bold">{title}</h2><p className="mt-1 text-xs text-slate-500">Use validated laboratory workflow values.</p></div><button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><form onSubmit={onSubmit} className="space-y-4 p-5">{children}<div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button><button className={primaryButton}><Check className="h-4 w-4" />{submitLabel}</button></div></form></section></div>;
}
