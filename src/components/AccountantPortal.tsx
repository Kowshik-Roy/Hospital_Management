import { FormEvent, ReactNode, useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Building2, CalendarDays, Check,
  ChevronDown, CircleDollarSign, ClipboardList, CreditCard, Download, FileText,
  LayoutDashboard, LogOut, Menu, Plus, Printer, Search, ShieldCheck, Truck,
  UserRound, Wallet, X,
} from 'lucide-react';
import { INITIAL_INVOICES, INITIAL_PATIENTS } from '../data/hospitalData';

type Section = 'overview' | 'invoices' | 'payments' | 'insurance' | 'admission' | 'pharmacy' | 'laboratory' | 'expenses' | 'suppliers' | 'refunds' | 'reports' | 'notifications' | 'profile';
type InvoiceStatus = 'Paid' | 'Partial' | 'Pending';
type InvoiceRecord = {
  id: string; patientId: string; patient: string; phone: string; type: string; department: string;
  date: string; total: number; paid: number; status: InvoiceStatus; method: string;
};
type PaymentRecord = { id: string; invoiceId: string; patient: string; amount: number; method: string; date: string; status: string };
type ClaimRecord = { id: string; patient: string; insurer: string; policy: string; amount: number; status: string };
type ExpenseRecord = { id: string; category: string; department: string; amount: number; date: string; description: string; status: string };
type NotificationRecord = { id: number; title: string; detail: string; time: string; read: boolean };
type ModalKind = 'invoice' | 'payment' | 'claim' | 'expense' | 'supplier' | 'refund' | null;

interface AccountantPortalProps {
  name: string;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  onLogout: () => void;
}

const localISODate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const money = (amount: number) => `৳${Math.round(amount).toLocaleString('en-BD')}`;
const today = localISODate();
const departments = ['OPD', 'Emergency', 'ICU', 'Laboratory', 'Pharmacy', 'Surgery', 'Inpatient'];
const invoiceTypes = ['OPD Consultation', 'Admission', 'Pharmacy', 'Laboratory', 'Surgery', 'Emergency'];
const methods = ['Cash', 'Credit Card', 'Debit Card', 'Mobile Banking', 'Bank Transfer', 'Insurance'];

const initialInvoices: InvoiceRecord[] = INITIAL_INVOICES.map((invoice) => ({
  id: invoice.id,
  patientId: invoice.patientId,
  patient: invoice.patientName,
  phone: invoice.patientPhone,
  type: invoice.items.some((item) => item.category === 'bed') ? 'Admission'
    : invoice.items.some((item) => item.category === 'surgery') ? 'Surgery'
      : invoice.items.some((item) => item.category === 'emergency') ? 'Emergency'
        : invoice.items.some((item) => item.category === 'medicine') && !invoice.items.some((item) => item.category === 'consultation') ? 'Pharmacy'
          : invoice.items.some((item) => item.category === 'lab') && !invoice.items.some((item) => item.category === 'consultation') ? 'Laboratory'
            : 'OPD Consultation',
  department: invoice.departmentName ?? 'OPD',
  date: invoice.date,
  total: invoice.totalAmount,
  paid: invoice.paidAmount,
  status: invoice.dueAmount <= 0 ? 'Paid' : invoice.paidAmount > 0 ? 'Partial' : 'Pending',
  method: invoice.paymentMethod ?? '—',
}));

const initialPayments: PaymentRecord[] = [
  { id: 'TXN-884219', invoiceId: 'INV-2026-001', patient: 'Rahat Chowdhury', amount: 3308, method: 'Mobile Banking', date: today, status: 'Paid' },
  { id: 'TXN-884206', invoiceId: 'INV-2026-004', patient: 'Abdul Malek', amount: 5000, method: 'Cash', date: today, status: 'Paid' },
  { id: 'TXN-884175', invoiceId: 'INV-2026-003', patient: 'Aayan Ahmed', amount: 2500, method: 'Credit Card', date: today, status: 'Paid' },
  { id: 'TXN-883991', invoiceId: 'INV-2026-002', patient: 'Shamima Nasrin', amount: 1200, method: 'Bank Transfer', date: today, status: 'Paid' },
];
const initialClaims: ClaimRecord[] = [
  { id: 'CLM-2026-028', patient: 'Shamima Nasrin', insurer: 'Green Delta Insurance', policy: 'GDI-884102', amount: 8400, status: 'Under Review' },
  { id: 'CLM-2026-027', patient: 'Rahat Chowdhury', insurer: 'Pragati Life Insurance', policy: 'PLI-220184', amount: 12500, status: 'Submitted' },
  { id: 'CLM-2026-026', patient: 'Abdul Malek', insurer: 'MetLife Bangladesh', policy: 'MLB-449120', amount: 18600, status: 'Approved' },
];
const initialExpenses: ExpenseRecord[] = [
  { id: 'EXP-2026-114', category: 'Medical supplies', department: 'ICU', amount: 18500, date: today, description: 'Sterile consumables · purchase order PO-402', status: 'Pending approval' },
  { id: 'EXP-2026-113', category: 'Utilities', department: 'Administration', amount: 42000, date: today, description: 'Monthly electricity expense', status: 'Approved' },
  { id: 'EXP-2026-112', category: 'Maintenance', department: 'Laboratory', amount: 7800, date: today, description: 'Analyzer preventive maintenance', status: 'Approved' },
  { id: 'EXP-2026-111', category: 'Staff salary', department: 'Nursing', amount: 126000, date: today, description: 'Shift allowance · October', status: 'Approved' },
];
const initialNotifications: NotificationRecord[] = [
  { id: 1, title: 'Insurance claim awaiting review', detail: 'CLM-2026-028 · Green Delta · ৳8,400', time: '12 min ago', read: false },
  { id: 2, title: 'Invoice payment due', detail: 'INV-2026-005 · patient balance needs follow-up', time: '35 min ago', read: false },
  { id: 3, title: 'Expense approval requested', detail: 'EXP-2026-114 · ICU supplies · ৳18,500', time: '1 hr ago', read: false },
  { id: 4, title: 'Insurance payment received', detail: 'CLM-2026-024 · ৳12,200 settled', time: 'Yesterday', read: true },
];

const navigation: { id: Section; label: string; icon: typeof Wallet }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'insurance', label: 'Insurance Claims', icon: ShieldCheck },
  { id: 'admission', label: 'Admission Billing', icon: Building2 },
  { id: 'pharmacy', label: 'Pharmacy Billing', icon: Activity },
  { id: 'laboratory', label: 'Laboratory Billing', icon: ClipboardList },
  { id: 'expenses', label: 'Expenses', icon: Wallet },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'refunds', label: 'Refunds', icon: ArrowDownRight },
  { id: 'reports', label: 'Financial Reports', icon: CalendarDays },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50';

export function AccountantPortal({ name, language, onToggleLanguage, onLogout }: AccountantPortalProps) {
  const [section, setSection] = useState<Section>('overview');
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [claims, setClaims] = useState(initialClaims);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [refunds, setRefunds] = useState<Array<{ id: string; patient: string; invoice: string; reason: string; amount: number; status: string }>>([
    { id: 'REF-2026-008', patient: 'Aayan Ahmed', invoice: 'INV-2026-003', reason: 'Duplicate laboratory charge', amount: 850, status: 'Pending' },
  ]);
  const [suppliers, setSuppliers] = useState<Array<{ name: string; category: string; contact: string; payable: number; status: string }>>([
    { name: 'MedSupply Bangladesh Ltd.', category: 'Medical supplies', contact: '+880 1711-223344', payable: 42500, status: 'Payment due' },
    { name: 'HealthTech Diagnostics', category: 'Laboratory equipment', contact: '+880 1812-334455', payable: 0, status: 'Current' },
    { name: 'Square Pharmaceuticals', category: 'Medicines', contact: '+880 1913-445566', payable: 18600, status: 'Payment due' },
  ]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sectionSearch, setSectionSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [modal, setModal] = useState<ModalKind>(null);
  const [paymentInvoiceId, setPaymentInvoiceId] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [notice, setNotice] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const outstanding = invoices.reduce((sum, invoice) => sum + Math.max(invoice.total - invoice.paid, 0), 0);
  const todayRevenue = payments.filter((payment) => payment.date === today && payment.status === 'Paid').reduce((sum, payment) => sum + payment.amount, 0);
  const monthlyRevenue = payments.filter((payment) => payment.date.slice(0, 7) === today.slice(0, 7) && payment.status === 'Paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingClaims = claims.filter((claim) => ['Submitted', 'Under Review', 'Draft'].includes(claim.status)).length;
  const pendingInvoices = invoices.filter((invoice) => invoice.total > invoice.paid).length;
  const pendingRefunds = refunds.filter((refund) => refund.status === 'Pending').length;
  const unreadCount = notifications.filter((item) => !item.read).length;

  const visibleInvoices = useMemo(() => invoices.filter((invoice) => {
    const queryMatch = `${invoice.id} ${invoice.patient} ${invoice.patientId} ${invoice.phone} ${invoice.department}`.toLowerCase().includes(sectionSearch.toLowerCase());
    const statusMatch = statusFilter === 'All statuses' || invoice.status === statusFilter;
    return queryMatch && statusMatch;
  }), [invoices, sectionSearch, statusFilter]);
  const visiblePayments = useMemo(() => payments.filter((payment) => `${payment.id} ${payment.invoiceId} ${payment.patient} ${payment.method}`.toLowerCase().includes(sectionSearch.toLowerCase())), [payments, sectionSearch]);
  const visibleClaims = useMemo(() => claims.filter((claim) => `${claim.id} ${claim.patient} ${claim.insurer} ${claim.policy}`.toLowerCase().includes(sectionSearch.toLowerCase())), [claims, sectionSearch]);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4500);
  };

  const openSection = (id: Section) => {
    setSection(id);
    setSectionSearch('');
    setStatusFilter('All statuses');
    setMobileNavOpen(false);
  };

  const updateInvoicePayment = (invoiceId: string, amount: number, method: string, transactionId: string) => {
    setInvoices((current) => current.map((invoice) => {
      if (invoice.id !== invoiceId) return invoice;
      const paid = Math.min(invoice.total, invoice.paid + amount);
      return { ...invoice, paid, status: paid >= invoice.total ? 'Paid' : paid > 0 ? 'Partial' : 'Pending', method };
    }));
    setPayments((current) => [{ id: transactionId || `TXN-${Date.now()}`, invoiceId, patient: invoices.find((invoice) => invoice.id === invoiceId)?.patient ?? 'Patient', amount, method, date: today, status: 'Paid' }, ...current]);
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = (key: string) => String(formData.get(key) ?? '').trim();
    const idSuffix = String(Date.now()).slice(-5);

    if (modal === 'invoice') {
      const patientId = value('patientId');
      const patient = INITIAL_PATIENTS.find((item) => item.id === patientId);
      const doctorFee = Number(value('doctorFee') || 0);
      const room = Number(value('room') || 0);
      const medicine = Number(value('medicine') || 0);
      const lab = Number(value('lab') || 0);
      const procedure = Number(value('procedure') || 0);
      const discount = Number(value('discount') || 0);
      const subtotal = doctorFee + room + medicine + lab + procedure;
      if (subtotal <= 0) {
        notify('Enter at least one service charge greater than zero.');
        return;
      }
      if (discount > subtotal) {
        notify('Discount cannot exceed the invoice subtotal.');
        return;
      }
      const tax = Math.max(0, (subtotal - discount) * 0.05);
      const total = Math.max(0, subtotal - discount + tax);
      const initialPayment = Number(value('initialPayment') || 0);
      if (initialPayment > total) {
        notify('Initial payment cannot exceed the calculated invoice total.');
        return;
      }
      const invoice: InvoiceRecord = {
        id: `INV-${new Date().getFullYear()}-${idSuffix}`, patientId,
        patient: patient?.name ?? value('patientName'), phone: patient?.phone ?? '',
        type: value('type'), department: value('department'), date: today, total,
        paid: initialPayment, status: initialPayment >= total ? 'Paid' : initialPayment > 0 ? 'Partial' : 'Pending',
        method: initialPayment ? value('method') : '—',
      };
      setInvoices((current) => [invoice, ...current]);
      if (initialPayment > 0) setPayments((current) => [{ id: `TXN-${idSuffix}`, invoiceId: invoice.id, patient: invoice.patient, amount: initialPayment, method: value('method'), date: today, status: 'Paid' }, ...current]);
      notify(`Invoice ${invoice.id} created · ${money(total)} total.`);
    } else if (modal === 'payment') {
      const invoiceId = value('invoiceId');
      const amount = Number(value('amount'));
      if (!Number.isFinite(amount) || amount <= 0) {
        notify('Enter a valid payment amount greater than zero.');
        return;
      }
      const invoice = invoices.find((item) => item.id === invoiceId);
      if (!invoice) {
        notify('Select a valid invoice before recording payment.');
        return;
      }
      if (amount > invoice.total - invoice.paid) {
        notify('Payment cannot exceed the invoice balance due.');
        return;
      }
      updateInvoicePayment(invoiceId, amount, value('method'), value('transactionId'));
      notify(`Payment of ${money(amount)} recorded for ${invoiceId}.`);
    } else if (modal === 'claim') {
      const amount = Number(value('amount'));
      if (amount <= 0) {
        notify('Claim amount must be greater than zero.');
        return;
      }
      setClaims((current) => [{ id: `CLM-${new Date().getFullYear()}-${idSuffix}`, patient: value('patient'), insurer: value('insurer'), policy: value('policy'), amount, status: 'Submitted' }, ...current]);
      notify('Insurance claim submitted for review.');
    } else if (modal === 'expense') {
      const amount = Number(value('amount'));
      if (amount <= 0) {
        notify('Expense amount must be greater than zero.');
        return;
      }
      setExpenses((current) => [{ id: `EXP-${new Date().getFullYear()}-${idSuffix}`, category: value('category'), department: value('department'), amount, date: value('date') || today, description: value('description'), status: 'Pending approval' }, ...current]);
      notify('Expense submitted for approval.');
    } else if (modal === 'supplier') {
      setSuppliers((current) => [{ name: value('name'), category: value('category'), contact: value('contact'), payable: Number(value('payable') || 0), status: Number(value('payable') || 0) > 0 ? 'Payment due' : 'Current' }, ...current]);
      notify('Supplier added to the vendor directory.');
    } else if (modal === 'refund') {
      const invoice = invoices.find((item) => item.id === value('invoice'));
      const amount = Number(value('amount'));
      if (!invoice || amount <= 0 || amount > invoice.paid) {
        notify('Refund must be greater than zero and cannot exceed the amount already paid on that invoice.');
        return;
      }
      setRefunds((current) => [{ id: `REF-${new Date().getFullYear()}-${idSuffix}`, patient: value('patient'), invoice: value('invoice'), reason: value('reason'), amount, status: 'Pending' }, ...current]);
      notify('Refund request sent for billing and management approval.');
    }
    setModal(null);
  };

  const setClaimStatus = (id: string, status: string) => {
    setClaims((current) => current.map((claim) => claim.id === id ? { ...claim, status } : claim));
    notify(`${id} updated to ${status}.`);
  };

  const exportCsv = (rows: Array<Record<string, string | number>>, filename: string) => {
    if (!rows.length) {
      notify('There are no records to export.');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Excel-compatible CSV export downloaded.');
  };

  const currentTitle = navigation.find((item) => item.id === section)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 lg:flex">
      <aside className={`${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-[276px] overflow-y-auto bg-[#10283f] text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500"><Activity className="h-5 w-5" /></div>
          <div><p className="font-black tracking-wide">CarePulse</p><p className="text-xs text-slate-400">Finance & Billing</p></div>
          <button onClick={() => setMobileNavOpen(false)} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>
        <div className="mx-4 my-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Finance workspace</p>
          <p className="mt-1 text-sm font-semibold">Accounts & Revenue</p>
          <p className="mt-1 text-xs text-teal-300">● Shift active</p>
        </div>
        <nav className="space-y-1 px-3 pb-4">
          {navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => openSection(id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${section === id ? 'bg-teal-500 text-white shadow-lg shadow-teal-950/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            <Icon className="h-[17px] w-[17px] shrink-0" /><span className="flex-1">{label}</span>
            {id === 'notifications' && unreadCount > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold">{unreadCount}</span>}
          </button>)}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="mb-3 flex items-center gap-2 px-3 py-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-teal-700 text-xs font-bold">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="min-w-0"><p className="truncate text-xs font-semibold">{name}</p><p className="text-[10px] text-slate-400">Accountant</p></div></div>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
      </aside>
      {mobileNavOpen && <button className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0"><p className="hidden text-xs text-slate-500 sm:block">{new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-BD', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><h1 className="truncate text-lg font-bold sm:text-xl">{currentTitle}</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleLanguage} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50">{language === 'en' ? 'বাংলা' : 'EN'}</button>
            <button onClick={() => openSection('notifications')} className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Notifications"><Bell className="h-4 w-4" />{unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{unreadCount}</span>}</button>
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold sm:flex"><ShieldCheck className="h-4 w-4 text-teal-700" />Accountant</div>
          </div>
        </header>

        <div className="mx-auto max-w-[1480px] space-y-6 p-4 sm:p-6 lg:p-8">
          {section === 'overview' && <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-sm font-semibold text-teal-700">Good day, {name}</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Financial overview</h2><p className="mt-1 text-sm text-slate-500">Revenue, collections and outstanding balances at a glance.</p></div>
              <button onClick={() => setModal('invoice')} className={buttonClass}><Plus className="h-4 w-4" />Create invoice</button>
            </div>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Today's revenue" value={money(todayRevenue)} change="+12.8%" icon={CircleDollarSign} tone="teal" />
              <Metric label="Monthly revenue" value={money(monthlyRevenue)} change="+8.4%" icon={ArrowUpRight} tone="blue" />
              <Metric label="Pending payments" value={`${pendingInvoices} invoices`} detail={money(outstanding)} icon={CreditCard} tone="amber" />
              <Metric label="Total invoices" value={String(invoices.length)} detail={`${invoices.filter((invoice) => invoice.status === 'Paid').length} paid`} icon={FileText} tone="violet" />
              <Metric label="Claims pending" value={`${pendingClaims} claims`} detail={money(claims.filter((claim) => ['Submitted', 'Under Review', 'Draft'].includes(claim.status)).reduce((sum, claim) => sum + claim.amount, 0))} icon={ShieldCheck} tone="blue" />
              <Metric label="Hospital expenses" value={money(expenses.reduce((sum, expense) => sum + expense.amount, 0))} detail={`${expenses.length} expense records`} icon={ArrowDownRight} tone="rose" />
              <Metric label="Refund requests" value={`${pendingRefunds} pending`} detail={`${refunds.length} total requests`} icon={ArrowDownRight} tone="amber" />
              <Metric label="Outstanding bills" value={money(outstanding)} detail={`${pendingInvoices} patients`} icon={Wallet} tone="teal" />
            </section>
            <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">Revenue & expenses</h3><p className="mt-1 text-xs text-slate-500">Monthly view · BDT</p></div><span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">This year <ChevronDown className="ml-1 inline h-3.5 w-3.5" /></span></div>
                <div className="mt-6 grid h-52 grid-cols-12 items-end gap-2 border-b border-l border-slate-100 px-2 pb-2 sm:gap-4">
                  {[48, 62, 54, 70, 64, 82, 73, 88, 68, 94, 78, 100].map((height, index) => <div key={index} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex h-[85%] w-full items-end justify-center gap-1"><span style={{ height: `${height}%` }} className="w-2 rounded-t bg-teal-500 sm:w-3" /><span style={{ height: `${Math.max(16, height * 0.42)}%` }} className="w-2 rounded-t bg-slate-200 sm:w-3" /></div><span className="text-[9px] text-slate-400 sm:text-[10px]">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span></div>)}
                </div>
                <div className="mt-4 flex gap-5 text-xs text-slate-500"><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-teal-500" />Revenue</span><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-slate-200" />Expenses</span></div>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-start justify-between"><div><h3 className="font-bold">Revenue by department</h3><p className="mt-1 text-xs text-slate-500">Current month collection</p></div><button onClick={() => openSection('reports')} className="text-xs font-semibold text-teal-700">View report</button></div>
                <div className="mt-5 space-y-4">{[['OPD', 82, '৳ 4.2L'], ['Pharmacy', 68, '৳ 3.5L'], ['Laboratory', 54, '৳ 2.8L'], ['Inpatient', 42, '৳ 2.1L'], ['Emergency', 28, '৳ 1.4L']].map(([label, progress, total]) => <div key={String(label)}><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium">{label}</span><span className="text-slate-500">{total}</span></div><div className="h-2 rounded-full bg-slate-100"><div style={{ width: `${progress}%` }} className="h-2 rounded-full bg-teal-500" /></div></div>)}</div>
              </section>
            </div>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <SectionHeader title="Recent invoices" subtitle="Monitor collection status and balances" action={<button onClick={() => openSection('invoices')} className="text-sm font-semibold text-teal-700">View all invoices →</button>} />
              <InvoiceTable invoices={invoices.slice(0, 5)} onView={setSelectedInvoice} />
            </section>
          </>}

          {section === 'invoices' && <RecordsSection title="Invoice management" subtitle="Create, search, review and print patient invoices." search={sectionSearch} onSearch={setSectionSearch} action={<button onClick={() => setModal('invoice')} className={buttonClass}><Plus className="h-4 w-4" />Create invoice</button>}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">{visibleInvoices.length} invoices · outstanding {money(outstanding)}</p><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option>All statuses</option><option>Paid</option><option>Partial</option><option>Pending</option></select></div>
            <InvoiceTable invoices={visibleInvoices} onView={setSelectedInvoice} />
          </RecordsSection>}

          {section === 'payments' && <RecordsSection title="Payment tracking" subtitle="Record payments and review transaction history." search={sectionSearch} onSearch={setSectionSearch} action={<button onClick={() => { setPaymentInvoiceId(''); setModal('payment'); }} className={buttonClass}><Plus className="h-4 w-4" />Record payment</button>}>
            <div className="mb-5 grid gap-3 sm:grid-cols-3"><SummaryTile label="Collected this month" value={money(monthlyRevenue)} /><SummaryTile label="Open invoice balances" value={money(outstanding)} /><SummaryTile label="Transactions logged" value={String(payments.length)} /></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Transaction', 'Invoice', 'Patient', 'Date', 'Method', 'Amount', 'Status'].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visiblePayments.map((payment) => <tr key={payment.id}><td className="px-4 py-3 font-semibold text-slate-700">{payment.id}</td><td className="px-4 py-3">{payment.invoiceId}</td><td className="px-4 py-3">{payment.patient}</td><td className="px-4 py-3 text-slate-500">{payment.date}</td><td className="px-4 py-3">{payment.method}</td><td className="px-4 py-3 font-semibold">{money(payment.amount)}</td><td className="px-4 py-3"><StatusBadge status={payment.status} /></td></tr>)}</tbody></table>{visiblePayments.length === 0 && <EmptyState />}</div>
          </RecordsSection>}

          {section === 'insurance' && <RecordsSection title="Insurance claims" subtitle="Track submission, review decisions and insurer payments." search={sectionSearch} onSearch={setSectionSearch} action={<button onClick={() => setModal('claim')} className={buttonClass}><Plus className="h-4 w-4" />Submit claim</button>}>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Claim ID', 'Patient', 'Insurance company', 'Policy number', 'Claim amount', 'Status', 'Action'].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleClaims.map((claim) => <tr key={claim.id}><td className="px-4 py-3 font-semibold">{claim.id}</td><td className="px-4 py-3">{claim.patient}</td><td className="px-4 py-3">{claim.insurer}</td><td className="px-4 py-3 text-slate-500">{claim.policy}</td><td className="px-4 py-3 font-semibold">{money(claim.amount)}</td><td className="px-4 py-3"><StatusBadge status={claim.status} /></td><td className="px-4 py-3"><select value={claim.status} onChange={(event) => setClaimStatus(claim.id, event.target.value)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs"><option>Draft</option><option>Submitted</option><option>Under Review</option><option>Approved</option><option>Rejected</option><option>Paid</option></select></td></tr>)}</tbody></table>{visibleClaims.length === 0 && <EmptyState />}</div>
          </RecordsSection>}

          {section === 'admission' && <RecordsSection title="Admission billing" subtitle="Inpatient charge summary by admission and service category." action={<button onClick={() => setModal('invoice')} className={buttonClass}><Plus className="h-4 w-4" />Create admission bill</button>}>
            <div className="mb-5 grid gap-3 sm:grid-cols-3"><SummaryTile label="Active admissions" value="18" /><SummaryTile label="Unbilled inpatient days" value="26" /><SummaryTile label="Admission outstanding" value={money(invoices.filter((item) => item.type === 'Admission').reduce((sum, item) => sum + item.total - item.paid, 0))} /></div>
            <div className="grid gap-4 lg:grid-cols-2">{invoices.filter((invoice) => invoice.type === 'Admission').slice(0, 4).map((invoice) => <div key={invoice.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{invoice.patient}</p><p className="mt-1 text-xs text-slate-500">{invoice.id} · {invoice.department} · Admission charges</p></div><StatusBadge status={invoice.status} /></div><div className="mt-4 grid grid-cols-3 gap-2 text-xs"><div className="rounded-lg bg-slate-50 p-2"><span className="text-slate-500">Invoice total</span><p className="mt-1 font-semibold">{money(invoice.total)}</p></div><div className="rounded-lg bg-slate-50 p-2"><span className="text-slate-500">Paid to date</span><p className="mt-1 font-semibold">{money(invoice.paid)}</p></div><div className="rounded-lg bg-slate-50 p-2"><span className="text-slate-500">Balance due</span><p className="mt-1 font-semibold">{money(invoice.total - invoice.paid)}</p></div></div></div>)}</div>
            {invoices.every((invoice) => invoice.type !== 'Admission') && <EmptyState />}
          </RecordsSection>}

          {section === 'pharmacy' && <RecordsSection title="Pharmacy billing" subtitle="Review pharmacy sales and billing status." search={sectionSearch} onSearch={setSectionSearch} action={<button onClick={() => setModal('invoice')} className={buttonClass}><Plus className="h-4 w-4" />Add pharmacy invoice</button>}>
            <InvoiceTable invoices={invoices.filter((invoice) => invoice.type === 'Pharmacy' || invoice.department.toLowerCase().includes('pharmacy')).filter((invoice) => `${invoice.id} ${invoice.patient}`.toLowerCase().includes(sectionSearch.toLowerCase()))} onView={setSelectedInvoice} />
            <p className="border-t border-slate-100 p-4 text-xs text-slate-500">Pharmacy orders are sample records in this demo. Live prescription and inventory integration requires connected pharmacy APIs.</p>
          </RecordsSection>}

          {section === 'laboratory' && <RecordsSection title="Laboratory billing" subtitle="Review diagnostic service invoices and collection status." search={sectionSearch} onSearch={setSectionSearch} action={<button onClick={() => setModal('invoice')} className={buttonClass}><Plus className="h-4 w-4" />Add lab invoice</button>}>
            <InvoiceTable invoices={invoices.filter((invoice) => invoice.type === 'Laboratory' || invoice.department.toLowerCase().includes('laboratory') || invoice.department.toLowerCase().includes('diagnostic')).filter((invoice) => `${invoice.id} ${invoice.patient}`.toLowerCase().includes(sectionSearch.toLowerCase()))} onView={setSelectedInvoice} />
            <p className="border-t border-slate-100 p-4 text-xs text-slate-500">Lab orders and prices are not yet synchronized with the laboratory portal.</p>
          </RecordsSection>}

          {section === 'expenses' && <RecordsSection title="Expense management" subtitle="Track operating costs and route expenses for approval." search={sectionSearch} onSearch={setSectionSearch} action={<button onClick={() => setModal('expense')} className={buttonClass}><Plus className="h-4 w-4" />Add expense</button>}>
            <div className="mb-5 grid gap-3 sm:grid-cols-3"><SummaryTile label="Total recorded expenses" value={money(expenses.reduce((sum, expense) => sum + expense.amount, 0))} /><SummaryTile label="Awaiting approval" value={money(expenses.filter((item) => item.status === 'Pending approval').reduce((sum, item) => sum + item.amount, 0))} /><SummaryTile label="Categories" value={String(new Set(expenses.map((item) => item.category)).size)} /></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Expense ID', 'Category / description', 'Department', 'Date', 'Amount', 'Approval'].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{expenses.filter((expense) => `${expense.id} ${expense.category} ${expense.description} ${expense.department}`.toLowerCase().includes(sectionSearch.toLowerCase())).map((expense) => <tr key={expense.id}><td className="px-4 py-3 font-semibold">{expense.id}</td><td className="px-4 py-3"><span className="font-medium">{expense.category}</span><p className="mt-1 text-xs text-slate-500">{expense.description}</p></td><td className="px-4 py-3">{expense.department}</td><td className="px-4 py-3 text-slate-500">{expense.date}</td><td className="px-4 py-3 font-semibold">{money(expense.amount)}</td><td className="px-4 py-3"><button onClick={() => { setExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, status: item.status === 'Approved' ? 'Pending approval' : 'Approved' } : item)); notify(`${expense.id} approval status updated.`); }}><StatusBadge status={expense.status} /></button></td></tr>)}</tbody></table>{expenses.length === 0 && <EmptyState />}</div>
          </RecordsSection>}

          {section === 'suppliers' && <RecordsSection title="Supplier & vendor directory" subtitle="Manage vendor contacts, categories and outstanding payables." action={<button onClick={() => setModal('supplier')} className={buttonClass}><Plus className="h-4 w-4" />Add supplier</button>}>
            <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Supplier', 'Product category', 'Contact', 'Pending payment', 'Account status'].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{suppliers.map((supplier) => <tr key={supplier.name}><td className="px-4 py-3 font-semibold">{supplier.name}</td><td className="px-4 py-3">{supplier.category}</td><td className="px-4 py-3 text-slate-500">{supplier.contact}</td><td className="px-4 py-3 font-semibold">{money(supplier.payable)}</td><td className="px-4 py-3"><StatusBadge status={supplier.status} /></td></tr>)}</tbody></table></div>
          </RecordsSection>}

          {section === 'refunds' && <RecordsSection title="Refund management" subtitle="Review refund requests and update the approval workflow." action={<button onClick={() => setModal('refund')} className={buttonClass}><Plus className="h-4 w-4" />New refund request</button>}>
            <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Request', 'Patient', 'Invoice', 'Reason', 'Amount', 'Status', 'Update'].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{refunds.map((refund) => <tr key={refund.id}><td className="px-4 py-3 font-semibold">{refund.id}</td><td className="px-4 py-3">{refund.patient}</td><td className="px-4 py-3">{refund.invoice}</td><td className="px-4 py-3">{refund.reason}</td><td className="px-4 py-3 font-semibold">{money(refund.amount)}</td><td className="px-4 py-3"><StatusBadge status={refund.status} /></td><td className="px-4 py-3"><select value={refund.status} onChange={(event) => setRefunds((current) => current.map((item) => item.id === refund.id ? { ...item, status: event.target.value } : item))} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs"><option>Pending</option><option>Approved</option><option>Rejected</option><option>Completed</option></select></td></tr>)}</tbody></table></div>
          </RecordsSection>}

          {section === 'reports' && <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Financial reports</h2><p className="mt-1 text-sm text-slate-500">Revenue, collections, departmental performance and operating expenses.</p></div><div className="flex gap-2"><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"><Printer className="h-4 w-4" />Print / PDF</button><button onClick={() => exportCsv([{ report: 'Revenue', amount: monthlyRevenue }, { report: 'Expenses', amount: expenses.reduce((sum, item) => sum + item.amount, 0) }, { report: 'Outstanding', amount: outstanding }, ...departments.map((department, index) => ({ report: `${department} revenue`, amount: [420000, 280000, 140000, 210000, 350000, 175000, 198000][index] }))], `carepulse-financial-report-${today}.csv`)} className={buttonClass}><Download className="h-4 w-4" />Export Excel CSV</button></div></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryTile label="Collection this month" value={money(monthlyRevenue)} /><SummaryTile label="Outstanding bills" value={money(outstanding)} /><SummaryTile label="Operating expenses" value={money(expenses.reduce((sum, item) => sum + item.amount, 0))} /><SummaryTile label="Net cash flow" value={money(monthlyRevenue - expenses.reduce((sum, item) => sum + item.amount, 0))} /></div>
            <div className="grid gap-5 xl:grid-cols-2"><ReportTable title="Department revenue" rows={departments.map((department, index) => ({ label: department, value: [420000, 280000, 140000, 210000, 350000, 175000, 198000][index] }))} /><ReportTable title="Expense by category" rows={Object.entries(expenses.reduce<Record<string, number>>((totals, expense) => { totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount; return totals; }, {})).map(([label, value]) => ({ label, value }))} /></div>
          </section>}

          {section === 'notifications' && <section className="rounded-2xl border border-slate-200 bg-white">
            <SectionHeader title="Financial notifications" subtitle="Payment due, claim decisions, invoices and approval requests" action={<button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} className="text-sm font-semibold text-teal-700">Mark all read</button>} />
            <div className="divide-y divide-slate-100">{notifications.map((item) => <div key={item.id} className={`flex items-start gap-3 p-4 sm:px-6 ${item.read ? '' : 'bg-teal-50/50'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.read ? 'bg-slate-300' : 'bg-teal-500'}`} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.detail}</p><p className="mt-2 text-xs text-slate-400">{item.time}</p></div>{!item.read && <button onClick={() => setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry))} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium">Mark read</button>}</div>)}</div>
          </section>}

          {section === 'profile' && <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700"><UserRound className="h-7 w-7" /></div><div><h2 className="text-xl font-bold">{name}</h2><p className="text-sm text-slate-500">Accountant / Billing Staff · accounts@carepulse.bd</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><SummaryTile label="Role permissions" value="Billing & finance" /><SummaryTile label="Workspace" value="CarePulse Accounts" /></div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><p className="font-bold">Access boundary</p><p className="mt-1">This role is limited to billing and finance workflows. Medical records, prescriptions, nursing notes and unrelated patient details are not available here.</p></div></section>}

          {notice && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">{notice}</div>}
          <p className="text-xs text-slate-400">Demo workspace · changes are stored in browser memory only and are not synced to live hospital systems.</p>
        </div>
      </main>

      {modal && <FormModal kind={modal} invoices={invoices} initialInvoiceId={paymentInvoiceId} onClose={() => setModal(null)} onSubmit={submitForm} />}
      {selectedInvoice && <InvoiceDetail invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} onPrint={() => window.print()} onDownload={() => downloadInvoicePdf(selectedInvoice)} onPayment={() => { setPaymentInvoiceId(selectedInvoice.id); setSelectedInvoice(null); setModal('payment'); }} />}
    </div>
  );
}

function Metric({ label, value, change, detail, icon: Icon, tone }: { label: string; value: string; change?: string; detail?: string; icon: typeof Wallet; tone: string }) {
  const tones: Record<string, string> = { teal: 'bg-teal-50 text-teal-700', blue: 'bg-blue-50 text-blue-700', amber: 'bg-amber-50 text-amber-700', violet: 'bg-violet-50 text-violet-700', rose: 'bg-rose-50 text-rose-700' };
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-black tracking-tight sm:text-2xl">{value}</p><div className="mt-1 flex min-h-5 items-center gap-1 text-xs">{change && <span className="font-semibold text-emerald-700"><ArrowUpRight className="mr-0.5 inline h-3.5 w-3.5" />{change}</span>}<span className="text-slate-400">{detail ?? 'vs. previous period'}</span></div></div>;
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5"><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>{action}</div>;
}

function RecordsSection({ title, subtitle, search, onSearch, action, children }: { title: string; subtitle: string; search?: string; onSearch?: (value: string) => void; action?: ReactNode; children: ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><SectionHeader title={title} subtitle={subtitle} action={action} />{onSearch && <div className="border-b border-slate-100 p-4"><label className="relative block max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search by patient, invoice, transaction or ID" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500" /></label></div>}<div className="p-4 sm:p-5">{children}</div></section>;
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1.5 text-lg font-bold">{value}</p></div>;
}

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const style = lower.includes('paid') || lower.includes('approved') || lower.includes('completed') || lower === 'current'
    ? 'bg-emerald-50 text-emerald-700'
    : lower.includes('pending') || lower.includes('partial') || lower.includes('review') || lower.includes('submitted')
      ? 'bg-amber-50 text-amber-700'
      : lower.includes('reject') || lower.includes('failed')
        ? 'bg-rose-50 text-rose-700'
        : 'bg-slate-100 text-slate-600';
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${style}`}>{status}</span>;
}

function InvoiceTable({ invoices, onView }: { invoices: InvoiceRecord[]; onView: (invoice: InvoiceRecord) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Invoice', 'Patient', 'Service / department', 'Date', 'Total', 'Paid', 'Due', 'Status', ''].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{invoices.map((invoice) => <tr key={invoice.id} className="hover:bg-slate-50/70"><td className="px-4 py-3 font-semibold text-teal-800">{invoice.id}<p className="mt-1 text-[11px] font-normal text-slate-400">{invoice.type}</p></td><td className="px-4 py-3"><span className="font-medium">{invoice.patient}</span><p className="mt-1 text-[11px] text-slate-400">{invoice.patientId}</p></td><td className="px-4 py-3">{invoice.department}</td><td className="px-4 py-3 text-slate-500">{invoice.date}</td><td className="px-4 py-3 font-semibold">{money(invoice.total)}</td><td className="px-4 py-3">{money(invoice.paid)}</td><td className="px-4 py-3 font-semibold text-amber-700">{money(invoice.total - invoice.paid)}</td><td className="px-4 py-3"><StatusBadge status={invoice.status} /></td><td className="px-4 py-3"><button onClick={() => onView(invoice)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:border-teal-500 hover:text-teal-700">View</button></td></tr>)}</tbody></table>{invoices.length === 0 && <EmptyState />}</div>;
}

function EmptyState() {
  return <div className="py-12 text-center text-sm text-slate-500">No records match this search.</div>;
}

function ReportTable({ title, rows }: { title: string; rows: Array<{ label: string; value: number }> }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold">{title}</h3><div className="mt-4 divide-y divide-slate-100">{rows.map((row) => <div key={row.label} className="flex justify-between gap-3 py-3 text-sm"><span className="text-slate-600">{row.label}</span><span className="font-semibold">{money(row.value)}</span></div>)}</div></div>;
}

function FormModal({ kind, invoices, initialInvoiceId, onClose, onSubmit }: { kind: Exclude<ModalKind, null>; invoices: InvoiceRecord[]; initialInvoiceId: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const titles: Record<Exclude<ModalKind, null>, string> = { invoice: 'Create invoice', payment: 'Record a payment', claim: 'Submit insurance claim', expense: 'Add hospital expense', supplier: 'Add supplier', refund: 'Create refund request' };
  const field = (label: string, name: string, type = 'text', required = true) => <label className="block text-sm font-medium text-slate-700">{label}<input name={name} type={type} required={required} min={type === 'number' ? '0' : undefined} step={type === 'number' ? '0.01' : undefined} className={inputClass} /></label>;
  const select = (label: string, name: string, options: string[], required = true) => <label className="block text-sm font-medium text-slate-700">{label}<select name={name} required={required} className={inputClass}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
  return <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="billing-form-title" className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 id="billing-form-title" className="font-bold">{titles[kind]}</h2><p className="mt-1 text-xs text-slate-500">Enter billing details and review before saving.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-5 w-5" /></button></div>
    <form onSubmit={onSubmit} className="space-y-4 p-5">
      {kind === 'invoice' && <>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Patient<select name="patientId" required className={inputClass}><option value="">Select patient</option>{INITIAL_PATIENTS.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} · {patient.id}</option>)}</select></label>{select('Invoice type', 'type', invoiceTypes)}{select('Department', 'department', departments)}{field('Doctor / service fee (৳)', 'doctorFee', 'number', false)}{field('Room / bed charge (৳)', 'room', 'number', false)}{field('Medicine charge (৳)', 'medicine', 'number', false)}{field('Laboratory charge (৳)', 'lab', 'number', false)}{field('Procedure charge (৳)', 'procedure', 'number', false)}{field('Discount (৳)', 'discount', 'number', false)}{field('Initial payment (৳)', 'initialPayment', 'number', false)}{select('Payment method', 'method', methods)}</div><p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Tax is calculated at the demo hospital default of 5%. Invoice records are local to this session.</p>
      </>}
      {kind === 'payment' && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Invoice<select name="invoiceId" required defaultValue={initialInvoiceId} className={inputClass}><option value="">Select invoice</option>{invoices.filter((item) => item.total > item.paid).map((invoice) => <option key={invoice.id} value={invoice.id}>{invoice.id} · {invoice.patient} · due {money(invoice.total - invoice.paid)}</option>)}</select></label>{field('Amount (৳)', 'amount', 'number')}{select('Payment method', 'method', methods)}{field('Transaction ID / reference', 'transactionId', 'text', false)}</div>}
      {kind === 'claim' && <div className="grid gap-4 sm:grid-cols-2">{field('Patient name', 'patient')}{field('Insurance company', 'insurer')}{field('Policy number', 'policy')}{field('Claim amount (৳)', 'amount', 'number')}</div>}
      {kind === 'expense' && <div className="grid gap-4 sm:grid-cols-2">{select('Expense category', 'category', ['Staff salary', 'Equipment purchase', 'Medicine purchase', 'Medical supplies', 'Utilities', 'Maintenance', 'Rent', 'Other'])}{select('Department', 'department', [...departments, 'Administration', 'Nursing'])}{field('Amount (৳)', 'amount', 'number')}{field('Date', 'date', 'date')}{field('Description', 'description')}</div>}
      {kind === 'supplier' && <div className="grid gap-4 sm:grid-cols-2">{field('Supplier name', 'name')}{select('Product category', 'category', ['Medicines', 'Medical supplies', 'Equipment', 'Laboratory supplies', 'Other'])}{field('Contact number / email', 'contact')}{field('Pending payment (৳)', 'payable', 'number', false)}</div>}
      {kind === 'refund' && <div className="grid gap-4 sm:grid-cols-2">{field('Patient name', 'patient')}<label className="block text-sm font-medium">Invoice<select name="invoice" required className={inputClass}><option value="">Select invoice</option>{invoices.map((invoice) => <option key={invoice.id}>{invoice.id}</option>)}</select></label>{field('Refund amount (৳)', 'amount', 'number')}{field('Refund reason', 'reason')}</div>}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button><button className={buttonClass}><Check className="h-4 w-4" />Save record</button></div>
    </form>
  </section></div>;
}

function InvoiceDetail({ invoice, onClose, onPrint, onDownload, onPayment }: { invoice: InvoiceRecord; onClose: () => void; onPrint: () => void; onDownload: () => void; onPayment: () => void }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="invoice-detail-title" className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-teal-700">CarePulse · Billing</p><h2 id="invoice-detail-title" className="mt-1 text-xl font-bold">{invoice.id}</h2></div><button onClick={onClose} aria-label="Close invoice" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="space-y-4 p-5"><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-500">Patient</p><p className="mt-1 font-semibold">{invoice.patient}</p><p className="text-xs text-slate-500">{invoice.patientId} · {invoice.phone}</p></div><div><p className="text-xs text-slate-500">Invoice date</p><p className="mt-1 font-semibold">{invoice.date}</p></div><div><p className="text-xs text-slate-500">Service type</p><p className="mt-1 font-semibold">{invoice.type}</p></div><div><p className="text-xs text-slate-500">Department</p><p className="mt-1 font-semibold">{invoice.department}</p></div></div><div className="rounded-xl bg-slate-50 p-4 text-sm"><div className="flex justify-between py-1"><span className="text-slate-500">Invoice total</span><b>{money(invoice.total)}</b></div><div className="flex justify-between py-1"><span className="text-slate-500">Paid</span><b>{money(invoice.paid)}</b></div><div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-base"><span className="font-semibold">Balance due</span><b className="text-amber-700">{money(invoice.total - invoice.paid)}</b></div></div><div className="flex flex-wrap justify-end gap-2"><button onClick={onDownload} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold"><Download className="h-4 w-4" />Download PDF</button><button onClick={onPrint} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold"><Printer className="h-4 w-4" />Print</button>{invoice.total > invoice.paid && <button onClick={onPayment} className={buttonClass}><Plus className="h-4 w-4" />Record payment</button>}</div></div></section></div>;
}

async function downloadInvoicePdf(invoice: InvoiceRecord) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('CarePulse Hospital', 20, 22);
  doc.setFontSize(10);
  doc.text('INVOICE', 20, 34);
  doc.text(`Invoice number: ${invoice.id}`, 20, 44);
  doc.text(`Date: ${invoice.date}`, 20, 51);
  doc.text(`Patient: ${invoice.patient}`, 20, 62);
  doc.text(`Patient ID: ${invoice.patientId}`, 20, 69);
  doc.text(`Phone: ${invoice.phone}`, 20, 76);
  doc.text(`Service: ${invoice.type}`, 20, 87);
  doc.text(`Department: ${invoice.department}`, 20, 94);
  doc.line(20, 102, 190, 102);
  doc.text('Invoice total', 20, 113);
  doc.text(`BDT ${Math.round(invoice.total).toLocaleString('en-BD')}`, 150, 113, { align: 'right' });
  doc.text('Amount paid', 20, 122);
  doc.text(`BDT ${Math.round(invoice.paid).toLocaleString('en-BD')}`, 150, 122, { align: 'right' });
  doc.setFontSize(12);
  doc.text('Balance due', 20, 136);
  doc.text(`BDT ${Math.round(invoice.total - invoice.paid).toLocaleString('en-BD')}`, 150, 136, { align: 'right' });
  doc.setFontSize(9);
  doc.text('This is a demo invoice generated by the CarePulse billing workspace.', 20, 158);
  doc.save(`${invoice.id}.pdf`);
}
